const { GenericCode } = require("../models/GenericCodeModel");
const { verifyToken, getTokenData } = require("./TokenVerificationService");
const statusCodes = require("../utils/statusCodes");

// Function to create initail generic coode
const createInitialGenericCodes = async () => {
  try {
    console.log(
      `[INFO] - [${new Date().toISOString()}] - Starting creation of initial generic codes.`,
    );

    const genericCodeData = await GenericCode.find({});
    if (genericCodeData.length > 0) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Initial generic codes already exist. Skipping creation.`,
      );
      return;
    }

    const initialCodes = [
      {
        codeType: "GENERICCODETYPE",
        code: "USERTYPE",
        codeDescription: "User Type",
      },
      {
        codeType: "GENERICCODETYPE",
        code: "REQUESTTYPE",
        codeDescription: "Request Type",
      },
      {
        codeType: "GENERICCODETYPE",
        code: "REQUESTSTATUS",
        codeDescription: "Request Status",
      },
      {
        codeType: "GENERICCODETYPE",
        code: "SESSIONTYPE",
        codeDescription: "Session Type",
      },
      {
        codeType: "GENERICCODETYPE",
        code: "DEPARTMENT",
        codeDescription: "Department",
      },
      {
        codeType: "GENERICCODETYPE",
        code: "YEAR",
        codeDescription: "Year",
      },
      {
        codeType: "GENERICCODETYPE",
        code: "SECTION",
        codeDescription: "Section",
      },
      {
        codeType: "USERTYPE",
        code: "ADMIN",
        codeDescription: "Administrator",
      },
      {
        codeType: "USERTYPE",
        code: "HOD",
        codeDescription: "Head of Department",
      },
      {
        codeType: "USERTYPE",
        code: "ADVISOR",
        codeDescription: "Class Advisor",
      },
      {
        codeType: "USERTYPE",
        code: "INCHARGE",
        codeDescription: "Year Incharge",
      },
      {
        codeType: "USERTYPE",
        code: "STUDENT",
        codeDescription: "Student",
      },
      {
        codeType: "REQUESTTYPE",
        code: "LEAVE",
        codeDescription: "Leave",
      },
      {
        codeType: "REQUESTTYPE",
        code: "OD",
        codeDescription: "On Duty",
      },
      {
        codeType: "REQUESTSTATUS",
        code: "PENDING",
        codeDescription: "Pending",
      },
      {
        codeType: "REQUESTSTATUS",
        code: "APPROVED",
        codeDescription: "Approved",
      },
      {
        codeType: "REQUESTSTATUS",
        code: "REJECTED",
        codeDescription: "Rejected",
      },
      {
        codeType: "REQUESTSTATUS",
        code: "CANCELLED",
        codeDescription: "Cancelled",
      },
      {
        codeType: "SESSIONTYPE",
        code: "FD",
        codeDescription: "Full Day",
      },
      {
        codeType: "SESSIONTYPE",
        code: "AN",
        codeDescription: "Afternoon",
      },
      {
        codeType: "SESSIONTYPE",
        code: "FN",
        codeDescription: "Forenoon",
      },
      {
        codeType: "USERSTATUS",
        code: "ACTIVE",
        codeDescription: "Active",
      },
      {
        codeType: "USERSTATUS",
        code: "INACTIVE",
        codeDescription: "Inactive",
      },
    ];

    for (const codeData of initialCodes) {
      const existingCode = await GenericCode.findOne({
        codeType: codeData.codeType,
        code: codeData.code,
      });
      if (!existingCode) {
        const newGenericCode = new GenericCode({
          codeType: codeData.codeType,
          code: codeData.code,
          codeDescription: codeData.codeDescription,
          createdAt: new Date().toISOString(),
          createdBy: "SYSTEM",
          updatedAt: new Date().toISOString(),
          updatedBy: "SYSTEM",
        });
        await newGenericCode.save();
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Initial generic code '${
            codeData.code
          }' of type '${codeData.codeType}' created successfully.`,
        );
      } else {
        console.log(
          `[INFO] - [${new Date().toISOString()}] - Initial generic code '${
            codeData.code
          }' of type '${codeData.codeType}' already exists. Skipping creation.`,
        );
      }
    }
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error creating initial generic codes:`,
      error,
    );
  }
};

// Function to create a new generic code
const createGenericCode = async (req) => {
  try {
    const { codeType, code, codeDescription } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized generic code creation attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to perform this action.",
      };
    }

    if (!codeType) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code creation failed: 'codeType' is required.`,
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Code Type is required.",
      };
    } else if (!code) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code creation failed: 'code' is required.`,
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Code is required.",
      };
    } else if (!codeDescription) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code creation failed: 'codeDescription' is required.`,
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Code Description is required.",
      };
    }

    const genericCodeData = await GenericCode.findOne({
      codeType: codeType,
      code: code,
    });

    if (genericCodeData) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code creation failed: Code '${code}' already exists.`,
      );
      return {
        status: statusCodes.CONFLICT,
        message: "Code already exists with the same code type.",
      };
    }

    const newGenericCode = new GenericCode({
      codeType,
      code,
      codeDescription,
      createdAt: new Date().toISOString(),
      createdBy: tokenUserID,
      updatedAt: new Date().toISOString(),
      updatedBy: tokenUserID,
    });
    await newGenericCode.save();

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Generic code created successfully by user ID: ${tokenUserID}`,
    );

    return {
      status: statusCodes.CREATED,
      message: "Generic code created successfully.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error creating generic code:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get all generic codes
const getAllGenericCodes = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { pageNumber, pageSize } = req.query;

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized generic code creation attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to perform this action.",
      };
    }

    let genericCodes = await GenericCode.find().sort({ createdAt: -1 });

    if (pageNumber < 0 || pageSize < 0) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic codes fetched successfully by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.OK,
        message: "Generic codes fetched successfully.",
        data: { total: genericCodes.length, data: genericCodes },
      };
    }

    const startIndex = (Number(pageNumber) - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);
    const totalRecords = genericCodes.length;

    genericCodes = genericCodes.slice(startIndex, endIndex);

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Generic codes fetched successfully by user ID: ${tokenUserID}`,
    );

    return {
      status: statusCodes.OK,
      message: "Generic codes fetched successfully.",
      data: { total: totalRecords, data: genericCodes },
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error fetching generic codes:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to get generic codes by code type
const getGenericCodeByCode = async (req) => {
  try {
    const { code } = req.params;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID } = await getTokenData(token);

    const genericCodes = await GenericCode.findOne({ code: code });

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Generic codes by code type fetched successfully by user ID: ${tokenUserID}`,
    );

    return {
      status: statusCodes.OK,
      message: "Generic codes fetched successfully.",
      data: genericCodes,
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error fetching generic codes by code type:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to update the generic code
const updateGenericCode = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - User change password attempt failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { code } = req.params;
    const { codeDescription } = req.body;

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized generic code creation attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to perform this action.",
      };
    }

    if (!codeDescription) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code update failed: 'codeDescription' is required.`,
      );
      return {
        status: statusCodes.BAD_REQUEST,
        message: "Code Description is required.",
      };
    }

    const genericCodeData = await GenericCode.findOne({ code: code });

    if (!genericCodeData) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code update failed: Code '${code}' not found.`,
      );
      return {
        status: statusCodes.NOT_FOUND,
        message: "Generic code not found.",
      };
    }

    if (genericCodeData.createdBy === "SYSTEM") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code update failed: System defined codes cannot be updated.`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "System defined codes cannot be updated.",
      };
    }

    await GenericCode.updateOne(
      { code: code },
      {
        $set: {
          codeDescription: codeDescription,
          updatedAt: new Date().toISOString(),
          updatedBy: tokenUserID,
        },
      },
    );

    console.log(
      `[INFO] - [${new Date().toISOString()}] - Generic code updated successfully by user ID: ${tokenUserID}`,
    );

    return {
      status: statusCodes.OK,
      message: "Generic code updated successfully.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error updating generic code:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

// Function to delete a generic code
const deleteGenericCode = async (req) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Delete generic code failed: Authorization token is missing.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Authorization token is missing.",
      };
    }

    const tokenVerification = await verifyToken(token);
    if (!tokenVerification) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Delete generic code failed: Expired token.`,
      );
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "Your session has expired. Please log in again.",
      };
    }

    const { tokenUserID, tokenUserType } = await getTokenData(token);
    const { code } = req.params;

    if (tokenUserType !== "ADMIN") {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Unauthorized generic code deletion attempt by user ID: ${tokenUserID}`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "You do not have permission to perform this action.",
      };
    }

    const codes = code.split(",").map((c) => c.trim());

    const genericCodeData = await GenericCode.find({ code: { $in: codes } });

    if (genericCodeData.length === 0) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code delete failed: Codes '${code}' not found.`,
      );
      return {
        status: statusCodes.NOT_FOUND,
        message: "Generic code not found.",
      };
    }

    if (genericCodeData.some((item) => item.createdBy === "SYSTEM")) {
      console.log(
        `[INFO] - [${new Date().toISOString()}] - Generic code delete failed: System defined codes cannot be deleted.`,
      );
      return {
        status: statusCodes.FORBIDDEN,
        message: "System defined codes cannot be deleted.",
      };
    }

    await GenericCode.deleteMany({ code: { $in: codes } });
    console.log(
      `[INFO] - [${new Date().toISOString()}] - Generic codes deleted successfully by user ID: ${tokenUserID}`,
    );

    return {
      status: statusCodes.OK,
      message: "Generic codes deleted successfully.",
    };
  } catch (error) {
    console.error(
      `[ERROR] - [${new Date().toISOString()}] - Error deleting generic code:`,
      error,
    );
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message:
        "Internal server error. Please report this issue to the administrator.",
    };
  }
};

module.exports = {
  createInitialGenericCodes,
  createGenericCode,
  getAllGenericCodes,
  getGenericCodeByCode,
  updateGenericCode,
  deleteGenericCode,
};
