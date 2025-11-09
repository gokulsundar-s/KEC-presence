const {
  Auth,
  UserDetails,
  UserDepartmentDetails,
} = require("../models/UsersModel");
const {
  RequestUserMap,
  Request,
  Status,
  Notes,
  Proofs,
} = require("../models/RequestModel");
const { verifyToken, getTokenData } = require("./TokenVerificationService");
const statusCodes = require("../utils/statusCodes");
const MailerService = require("./MailerService");

// Function to create a new request
const createRequest = async (req) => {
  try {
    const {
      userID,
      requestType,
      reason,
      fromDate,
      fromSession,
      toDate,
      toSession,
      proofLink,
    } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserID !== userID || tokenUserType !== "STUDENT") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Invalid user ID in token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "You are not authorized to post request for other users.",
      };
    }

    const authData = await Auth.findOne({ userID: userID });
    if (!authData.isActive) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Inactive or non-existent user.`
      );

      return {
        status: statusCodes.UNAUTHORIZED,
        message: "You are not authorized to post any requests.",
      };
    }

    if (requestType === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Request type is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Request type is required",
      };
    } else if (reason === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Reason is required.`
      );
      return { status: statusCodes.BAD_REQUEST, message: "Reason is required" };
    } else if (fromDate === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: From date is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "From date is required",
      };
    } else if (toDate === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: To date is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "To date is required",
      };
    } else if (fromSession === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: From session is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "From session is required",
      };
    } else if (toSession === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: To session is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "To session is required",
      };
    } else if (requestType === "OD" && proofLink === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Proof link is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Proof link is required",
      };
    } else if (fromDate > toDate) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: From date cannot be greater than To date.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "From date cannot be greater than To date",
      };
    } else if (
      fromDate === toDate &&
      fromSession === "FD" &&
      (toSession === "FN" || toSession === "AN")
    ) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: From date and session conflict with To date and session.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message:
          "If From session is Full Day, To session must be Full Day for same day requests",
      };
    }

    const users = await UserDetails.findOne({ userID: userID });
    if (!users) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: User does not exist.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "User does not exist",
      };
    }

    const requests = await RequestUserMap.find({ userID: userID });
    for (let i = 0; i < requests.length; i++) {
      const request = await Request.findOne({
        requestID: requests[i].requestID,
      });

      if (request.fromDate <= fromDate && request.toDate >= toDate) {
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Overlapping request exists.`
        );
        return {
          status: statusCodes.BAD_REQUEST,
          message:
            "You have posted a request already with or within the given date range",
        };
      } else if (
        request.fromDate === fromDate &&
        request.fromSession === fromSession
      ) {
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Overlapping request exists.`
        );
        return {
          status: statusCodes.BAD_REQUEST,
          message:
            "You have posted a request already with or within the given date range",
        };
      } else if (request.toDate === toDate && request.toSession === toSession) {
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Overlapping request exists.`
        );
        return {
          status: statusCodes.BAD_REQUEST,
          message:
            "You have posted a request already with or within the given date range",
        };
      }
    }

    const requestsCount = await Request.countDocuments();
    const requestID = "REQ" + (requestsCount + 1).toString().padStart(5, "0");

    let days =
      Math.floor(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
      ) + 1;

    if (
      fromSession === "FN" ||
      fromSession === "AN" ||
      toSession === "FN" ||
      toSession === "AN"
    ) {
      days -= 0.5;
    }

    const newRequestUserMap = new RequestUserMap({
      requestID,
      userID,
      isActiveRequest: true,
      createdAt: new Date().toISOString(),
      createdBy: tokenUserID,
      updatedAt: new Date().toISOString(),
      updatedBy: tokenUserID,
    });

    const newRequest = new Request({
      requestID,
      requestType,
      reason,
      fromDate,
      fromSession,
      toDate,
      toSession,
      days,
      createdAt: new Date().toISOString(),
      createdBy: tokenUserID,
      updatedAt: new Date().toISOString(),
      updatedBy: tokenUserID,
    });

    const newStatus = new Status({
      requestID,
      advisorStatus: "PENDING",
      inchargeStatus: "PENDING",
      createdAt: new Date().toISOString(),
      createdBy: tokenUserID,
      updatedAt: new Date().toISOString(),
      updatedBy: tokenUserID,
    });

    const newNotes = new Notes({
      requestID,
      advisorNote: "",
      inchargeNote: "",
      createdAt: new Date().toISOString(),
      createdBy: tokenUserID,
      updatedAt: new Date().toISOString(),
      updatedBy: tokenUserID,
    });

    const newProofs = new Proofs({
      requestID,
      proofLink,
      createdAt: new Date().toISOString(),
      createdBy: tokenUserID,
      updatedAt: new Date().toISOString(),
      updatedBy: tokenUserID,
    });

    await newRequestUserMap.save();
    await newRequest.save();
    await newStatus.save();
    await newNotes.save();
    await newProofs.save();

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Request created successfully: ${requestID} by User: ${userID}.`
    );
    return {
      status: statusCodes.CREATED,
      message: "Request created successfully",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error creating request:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get all requests based on user type
const getAllRequests = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Fetch all requests attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Fetch all requests attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const requestUserData = await RequestUserMap.find();
    const requestData = await Request.find();

    let requests = [];

    if (tokenUserType === "STUDENT") {
      const requestIDs = requestUserData
        .filter((r) => r.userID === tokenUserID)
        .map((r) => r.requestID);

      requests = requestData.filter((r) => requestIDs.includes(r.requestID));
    } else if (tokenUserType === "ADVISOR") {
      const departmentDetails = await UserDepartmentDetails.findOne({
        userID: tokenUserID,
      });
      const userIDs = await UserDetails.find({
        department: departmentDetails.department,
        year: departmentDetails.year,
        section: departmentDetails.section,
      }).map((user) => user.userID);

      const requestIDs = requestUserData
        .filter((r) => userIDs.includes(r.userID))
        .map((r) => r.requestID);

      requests = requestData.filter((r) => requestIDs.includes(r.requestID));
    } else if (tokenUserType === "INCHARGE") {
      const departmentDetails = await UserDepartmentDetails.findOne({
        userID: tokenUserID,
      });
      const userIDs = await UserDetails.find({
        department: departmentDetails.department,
        year: departmentDetails.year,
      }).map((user) => user.userID);

      const requestIDs = requestUserData
        .filter((r) => userIDs.includes(r.userID))
        .map((r) => r.requestID);

      requests = requestData.filter((r) => requestIDs.includes(r.requestID));
    } else if (tokenUserType === "HOD") {
      const departmentDetails = await UserDepartmentDetails.findOne({
        userID: tokenUserID,
      });
      const userIDs = await UserDetails.find({
        department: departmentDetails.department,
      }).map((user) => user.userID);

      const requestIDs = requestUserData
        .filter((r) => userIDs.includes(r.userID))
        .map((r) => r.requestID);

      requests = requestData.filter((r) => requestIDs.includes(r.requestID));
    }

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Fetched all requests successfully for User Type: ${tokenUserType}.`
    );
    return {
      status: statusCodes.OK,
      message: "Fetched all requests successfully",
      data: requests,
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error fetching all requests:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get request by ID
const getRequestByID = async (req) => {
  try {
    const requestID = req.params.requestID;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Fetch request by ID attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Fetch request by ID attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserType } = await getTokenData(token);

    if (tokenUserType === "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Fetch request by ID attempt failed: Admin users are not authorized.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Admin users are not authorized to access this resource.",
      };
    }

    const request = await Request.findOne({ requestID: requestID });
    const requestUserMap = await RequestUserMap.findOne({
      requestID: requestID,
    });
    const status = await Status.findOne({
      requestID: requestID,
    });
    const notes = await Notes.findOne({
      requestID: requestID,
    });
    const proofs = await Proofs.findOne({
      requestID: requestID,
    });
    const userDetails = await UserDetails.findOne({
      userID: requestUserMap.userID,
    });
    const userDeptDetails = await UserDepartmentDetails.findOne({
      userID: requestUserMap.userID,
    });

    if (!request) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Fetch request by ID attempt failed: Request does not exist.`
      );
      return {
        status: statusCodes.NOT_FOUND,
        message: "Request does not exist",
      };
    }

    const requestData = {
      userID: requestUserMap.userID,
      name: userDetails.name,
      year: userDeptDetails.year,
      section: userDeptDetails.section,
      requestID: request.requestID,
      requestType: request.requestType,
      reason: request.reason,
      fromDate: request.fromDate,
      fromSession: request.fromSession,
      toDate: request.toDate,
      toSession: request.toSession,
      days: request.days,
      proofs: proofs.proofLink,
      advisorStatus: status.advisorStatus,
      inchargeStatus: status.inchargeStatus,
      advisorNote: notes.advisorNote,
      inchargeNote: notes.inchargeNote,
    };

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Fetched request by ID successfully: ${requestID}.`
    );
    return {
      status: statusCodes.OK,
      message: "Fetched request by ID successfully",
      data: requestData,
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error fetching request by ID:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to update a request
const updateRequest = async (req) => {
  try {
    const requestID = req.params.requestID;
    const {
      userID,
      requestType,
      reason,
      fromDate,
      fromSession,
      toDate,
      toSession,
      proofLink,
      advisorStatus,
      inchargeStatus,
      advisorNote,
      inchargeNote,
    } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Update request attempt failed: Authorization token is missing.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Update request attempt failed: Expired token.`
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    const requestsCount = await Request.countDocuments({
      requestID: requestID,
    });
    if (requestsCount === 0) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Update request attempt failed: Request does not exist.`
      );
      return {
        status: statusCodes.NOT_FOUND,
        message: "Request does not exist for the requested ID.",
      };
    }

    if (tokenUserType !== "STUDENT") {
      const requestUser = await RequestUserMap.findOne({
        requestID: requestID,
      });
      const userDeptDetails = await UserDepartmentDetails.findOne({
        userID: tokenUserID,
      });
      const requestUserDeptDetails = await UserDepartmentDetails.findOne({
        userID: requestUser.userID,
      });

      if (tokenUserType === "ADVISOR") {
        if (
          userDeptDetails.year !== requestUserDeptDetails.year ||
          userDeptDetails.section !== requestUserDeptDetails.section ||
          userDeptDetails.department !== requestUserDeptDetails.department
        ) {
        }
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Update request attempt failed: Unauthorized access by Advisor.`
        );
        return {
          status: statusCodes.UNAUTHORIZED,
          message: "You are not authorized to update this request.",
        };
      } else if (tokenUserType === "INCHARGE") {
        if (
          userDeptDetails.year !== requestUserDeptDetails.year ||
          userDeptDetails.department !== requestUserDeptDetails.department
        ) {
          console.log(
            `[INFO] - [${new Date().toISOString()}] - Update request attempt failed: Unauthorized access by In-Charge.`
          );
          return {
            status: statusCodes.UNAUTHORIZED,
            message: "You are not authorized to update this request.",
          };
        }
      } else {
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Update request attempt failed: Unauthorized access by HOD.`
        );
        return {
          status: statusCodes.UNAUTHORIZED,
          message: "You are not authorized to update this request.",
        };
      }
    }

    const statusData = await Status.findOne({ requestID: requestID });
    if (
      tokenUserType === "STUDENT" &&
      (statusData.advisorStatus !== "PENDING" ||
        statusData.inchargeStatus !== "PENDING")
    ) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Update request attempt failed: Cannot update approved request.`
      );
      return {
        status: statusCodes.FORBIDDEN,
        message:
          "You are not allowed to update this request. Please contact your Class Advisor to update this request.",
      };
    }

    if (requestType === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Request type is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Request type is required",
      };
    } else if (reason === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Reason is required.`
      );
      return { status: statusCodes.BAD_REQUEST, message: "Reason is required" };
    } else if (fromDate === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: From date is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "From date is required",
      };
    } else if (toDate === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: To date is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "To date is required",
      };
    } else if (fromSession === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: From session is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "From session is required",
      };
    } else if (toSession === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: To session is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "To session is required",
      };
    } else if (requestType === "OD" && proofLink === "") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Proof link is required.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Proof link is required",
      };
    } else if (fromDate > toDate) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: From date cannot be greater than To date.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "From date cannot be greater than To date",
      };
    } else if (
      fromDate === toDate &&
      fromSession === "FD" &&
      (toSession === "FN" || toSession === "AN")
    ) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: From date and session conflict with To date and session.`
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message:
          "If From session is Full Day, To session must be Full Day for same day requests",
      };
    }

    const requests = await RequestUserMap.find({
      userID: userID,
      requestID: { $ne: requestID },
    });
    for (let i = 0; i < requests.length; i++) {
      const request = await Request.findOne({
        requestID: requests[i].requestID,
      });

      if (request.fromDate <= fromDate && request.toDate >= toDate) {
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Overlapping request exists.`
        );
        return {
          status: statusCodes.BAD_REQUEST,
          message:
            "You have posted a request already with or within the given date range",
        };
      } else if (
        request.fromDate === fromDate &&
        request.fromSession === fromSession
      ) {
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Overlapping request exists.`
        );
        return {
          status: statusCodes.BAD_REQUEST,
          message:
            "You have posted a request already with or within the given date range",
        };
      } else if (request.toDate === toDate && request.toSession === toSession) {
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Request creation attempt failed: Overlapping request exists.`
        );
        return {
          status: statusCodes.BAD_REQUEST,
          message:
            "You have posted a request already with or within the given date range",
        };
      }
    }

    let days =
      Math.floor(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
      ) + 1;

    if (
      fromSession === "FN" ||
      fromSession === "AN" ||
      toSession === "FN" ||
      toSession === "AN"
    ) {
      days -= 0.5;
    }

    await Request.updateOne(
      { requestID: requestID },
      {
        $set: {
          requestType: requestType,
          reason: reason,
          fromDate: fromDate,
          fromSession: fromSession,
          toDate: toDate,
          toSession: toSession,
          days: days,
          updatedAt: new Date().toISOString(),
          updatedBy: tokenUserID,
        },
      }
    );

    await Proofs.updateOne(
      { requestID: requestID },
      {
        $set: {
          proofLink: proofLink,
          updatedAt: new Date().toISOString(),
          updatedBy: tokenUserID,
        },
      }
    );

    await Status.updateOne(
      { requestID: requestID },
      {
        $set: {
          advisorStatus: advisorStatus,
          inchargeStatus: inchargeStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: tokenUserID,
        },
      }
    );

    await Notes.updateOne(
      { requestID: requestID },
      {
        $set: {
          advisorNote: advisorNote,
          inchargeNote: inchargeNote,
          updatedAt: new Date().toISOString(),
          updatedBy: tokenUserID,
        },
      }
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Request updated successfully: ${requestID} by User: ${tokenUserID}.`
    );
    return {
      status: statusCodes.OK,
      message: "Request updated successfully",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error updating request:`,
      error
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestByID,
  updateRequest,
};
