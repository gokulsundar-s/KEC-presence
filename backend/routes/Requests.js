const express = require("express");
const dotenv = require("dotenv");
const { sendMail } = require("../utiles/SendMail");
const {
  RequestUserMap,
  Request,
  Status,
  Notes,
  Proofs,
} = require("../schemas/Requests");
const {
  UserDetails,
  UserDepartmentDetails,
  UserContacts,
} = require("../schemas/Users");
const requestsRoute = express.Router();

dotenv.config();

requestsRoute.post("/", async (req, res) => {
  try {
    const {
      userID,
      reqType,
      reason,
      fromDate,
      fromSession,
      toDate,
      toSession,
      proofLink,
    } = req.body;

    if (reqType === "") {
      return res.json({ status: 400, message: "Request type is required" });
    } else if (reason === "") {
      return res.json({ status: 400, message: "Reason is required" });
    } else if (fromDate === "") {
      return res.json({ status: 400, message: "From date is required" });
    } else if (toDate === "") {
      return res.json({ status: 400, message: "To date is required" });
    } else if (fromSession === "") {
      return res.json({ status: 400, message: "From session is required" });
    } else if (toSession === "") {
      return res.json({ status: 400, message: "To session is required" });
    } else if (reqType === "OD" && proofLink === "") {
      return res.json({ status: 400, message: "Proof link is required" });
    } else if (fromDate > toDate) {
      return res.json({
        status: 400,
        message: "From date cannot be greater than To date",
      });
    }

    const users = await UserDetails.findOne({ userID: userID });
    if (!users) {
      return res.json({ status: 400, message: "User does not exist" });
    }

    const requests = await RequestUserMap.find({ userID: userID });

    for (let i = 0; i < requests.length; i++) {
      const request = await Request.findOne({
        requestID: requests[i].requestID,
      });

      if (request.fromDate <= fromDate && request.toDate >= toDate) {
        return res.json({
          status: 400,
          message:
            "You have posted a request already with or within the given date range",
        });
      } else if (
        request.fromDate === fromDate &&
        request.fromSession === fromSession
      ) {
        return res.json({
          status: 400,
          message:
            "You have posted a request already with or within the given date range",
        });
      } else if (request.toDate === toDate && request.toSession === toSession) {
        return res.json({
          status: 400,
          message:
            "You have posted a request already with or within the given date range",
        });
      }
    }

    const requestsCount = await Request.find({
      requestID: { $regex: new RegExp("^" + reqType.charAt(0), "i") },
    });
    const requestID =
      reqType.charAt(0) +
      (requestsCount.length + 1).toString().padStart(5, "0");

    const days =
      Math.floor(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
      ) + 1;

    const newRequestUserMap = new RequestUserMap({
      requestID,
      userID,
      isActiveRequest: true,
    });

    const newRequest = new Request({
      requestID,
      reqType,
      reason,
      fromDate,
      fromSession,
      toDate,
      toSession,
      days,
    });

    const newStatus = new Status({
      requestID,
      advisorStatus: "pending",
      inchargeStatus: "pending",
    });

    const newNotes = new Notes({
      requestID,
      advisorNote: "",
      inchargeNote: "",
    });

    const newProofs = new Proofs({
      requestID,
      proofLink,
    });

    await newRequestUserMap.save();
    await newRequest.save();
    await newStatus.save();
    await newNotes.save();
    await newProofs.save();

    res.json({ status: 200, message: "Request created successfully" });
  } catch {
    res.json({
      status: 500,
      message: "Internal Server Error! Please contact Administrator.",
    });
  }
});

requestsRoute.get("/", async (req, res) => {
  try {
    const { userID, isActiveRequest } = req.query;

    if (!userID) {
      return res.json({ status: 400, message: "User ID is required" });
    }

    const requestsUserMap = await RequestUserMap.find({
      userID: userID,
      isActiveRequest: isActiveRequest,
    });

    const requestDetails = await Request.find({});
    const requestStatus = await Status.find({});

    const requestData = requestsUserMap.map((request) => {
      const reqDetails = requestDetails.find(
        (detail) => detail.requestID === request.requestID
      );
      const reqStatus = requestStatus.find(
        (stat) => stat.requestID === request.requestID
      );

      return {
        requestID: reqDetails.requestID || null,
        reqType: reqDetails.reqType || null,
        fromDate: reqDetails.fromDate || null,
        toDate: reqDetails.toDate || null,
        days: reqDetails.days || null,
        status: reqStatus.inchargeStatus || null,
      };
    });

    res.json({
      status: 200,
      data: requestData,
      message: "Requests fetched successfully",
    });
  } catch {
    res.json({
      status: 500,
      message: "Internal Server Error! Please contact Administrator.",
    });
  }
});

requestsRoute.get("/:requestID", async (req, res) => {
  try {
    const reqID = req.params.requestID;

    if (!reqID) {
      return res.json({ status: 400, message: "Request ID is required" });
    }

    const requestDetails = await Request.findOne({ requestID: reqID });
    const requestStatus = await Status.findOne({ requestID: reqID });
    const requestNotes = await Notes.findOne({ requestID: reqID });
    const proofLink = await Proofs.findOne({ requestID: reqID });

    if (!requestDetails && !requestStatus && !requestNotes) {
      return res.json({
        status: 404,
        message: "No request data found for the given Request ID",
      });
    }

    const requestData = {
      requestID: requestDetails.requestID || null,
      reqType: requestDetails.reqType || null,
      reason: requestDetails.reason || null,
      fromDate: requestDetails.fromDate || null,
      fromSession: requestDetails.fromSession || null,
      toDate: requestDetails.toDate || null,
      toSession: requestDetails.toSession || null,
      days: requestDetails.days || null,
      advisorStatus: requestStatus.advisorStatus || null,
      inchargeStatus: requestStatus.inchargeStatus || null,
      advisorNote: requestNotes.advisorNote || null,
      inchargeNote: requestNotes.inchargeNote || null,
      proofLink: proofLink.proofLink || null,
    };

    res.json({
      status: 200,
      data: requestData,
      message: "Request details fetched successfully",
    });
  } catch {
    res.json({
      status: 500,
      message: "Internal Server Error! Please contact Administrator.",
    });
  }
});

requestsRoute.put("/:requestID", async (req, res) => {
  try {
    const reqID = req.params.requestID;
    const {
      reqType,
      reason,
      fromDate,
      fromSession,
      toDate,
      toSession,
      proofLink,
    } = req.body;

    const requestData = await RequestUserMap.findOne({
      requestID: reqID,
    });

    if (requestData.isActiveRequest === false) {
      return res.json({
        status: 400,
        message: "Expired request cannot be updated",
      });
    }

    const statusData = await Status.findOne({ requestID: reqID });

    if (statusData.advisorStatus !== "pending") {
      return res.json({
        status: 100,
        message:
          "Only pending requests can be updated. Please contact your Class Advisor to update the request.",
      });
    }

    if (reqType === "") {
      return res.json({ status: 400, message: "Request type is required" });
    } else if (reason === "") {
      return res.json({ status: 400, message: "Reason is required" });
    } else if (fromDate === "") {
      return res.json({ status: 400, message: "From date is required" });
    } else if (toDate === "") {
      return res.json({ status: 400, message: "To date is required" });
    } else if (fromSession === "") {
      return res.json({ status: 400, message: "From session is required" });
    } else if (toSession === "") {
      return res.json({ status: 400, message: "To session is required" });
    } else if (reqType === "OD" && proofLink === "") {
      return res.json({ status: 400, message: "Proof link is required" });
    } else if (fromDate > toDate) {
      return res.json({
        status: 400,
        message: "From date cannot be greater than To date",
      });
    }

    const days =
      Math.floor(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
      ) + 1;
    await Request.updateOne(
      { requestID: reqID },
      {
        reqType,
        reason,
        fromDate,
        fromSession,
        toDate,
        toSession,
        days,
      }
    );

    await Status.updateOne(
      { requestID: reqID },
      {
        advisorStatus: "pending",
        inchargeStatus: "pending",
      }
    );

    await Proofs.updateOne(
      { requestID: reqID },
      {
        proofLink,
      }
    );

    res.json({ status: 200, message: "Request updated successfully" });
  } catch {
    res.json({
      status: 500,
      message: "Internal Server Error! Please contact Administrator.",
    });
  }
});

requestsRoute.put("/status/:requestID", async (req, res) => {
  try {
    const reqID = req.params.requestID;
    if (!reqID) {
      return res.json({ status: 400, message: "Request ID is required" });
    }

    const { advisorStatus, inchargeStatus } = req.body;

    const requestData = await RequestUserMap.findOne({
      requestID: reqID,
    });
    if (!requestData) {
      res.json({
        status: 404,
        message: "No request found with the given Request ID",
      });
    }

    const statusData = await Status.findOne({ requestID: reqID });

    if (
      advisorStatus === "cancelled" &&
      inchargeStatus === "cancelled" &&
      statusData.advisorStatus !== "pending"
    ) {
      return res.json({
        status: 100,
        message:
          "Only pending requests can be cancelled. Please contact your class advisor to cancel the request.",
      });
    }

    const updateData = {};
    if (req.body.advisorStatus !== undefined) {
      updateData.advisorStatus = advisorStatus;
    } else {
      updateData.advisorStatus = statusData.advisorStatus;
    }

    if (req.body.inchargeStatus !== undefined) {
      updateData.inchargeStatus = inchargeStatus;
    } else {
      updateData.inchargeStatus = statusData.inchargeStatus;
    }

    await Status.updateOne({ requestID: reqID }, updateData);
    await RequestUserMap.updateOne({ requestID: reqID });

    res.json({ status: 200, message: "Request cancelled successfully" });
  } catch {
    res.json({
      status: 500,
      message: "Internal Server Error! Please contact Administrator.",
    });
  }
});

requestsRoute.get("/approvals/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return res.json({ status: 400, message: "User ID is required" });
    }

    const userDeptDetails = await UserDepartmentDetails.findOne({
      userID: userID,
    });

    const usersInSameDept = await UserDepartmentDetails.find({
      userID: { $regex: new RegExp("^S") },
      department: userDeptDetails.department,
      year: userDeptDetails.year,
      section: userDeptDetails.section,
    });
    const userIDList = usersInSameDept.map((user) => user.userID);

    const requestsUserMap = await RequestUserMap.find({
      userID: { $in: userIDList },
    });

    const requestDetails = await Request.find({});
    const requestStatus = await Status.find({});

    let requestData = requestsUserMap.map((request) => {
      const reqDetails = requestDetails.find(
        (detail) => detail.requestID === request.requestID
      );
      const reqStatus = requestStatus.find(
        (stat) => stat.requestID === request.requestID
      );
      const usrDept = usersInSameDept.find(
        (usr) => usr.userID === request.userID
      );

      return {
        rollNumber: usrDept?.rollNumber || null,
        requestID: reqDetails?.requestID || null,
        reqType: reqDetails?.reqType || null,
        fromDate: reqDetails?.fromDate || null,
        toDate: reqDetails?.toDate || null,
        days: reqDetails?.days || null,
        _advisorStatus: reqStatus?.advisorStatus || null,
        _inchargeStatus: reqStatus?.inchargeStatus || null,
      };
    });

    if (userID.startsWith("C")) {
      requestData = requestData.filter(
        (req) => req._advisorStatus === "pending"
      );
    } else if (userID.startsWith("Y")) {
      requestData = requestData.filter(
        (req) =>
          req._advisorStatus === "approved" && req._inchargeStatus === "pending"
      );
    }

    requestData = requestData.map(
      ({ _advisorStatus, _inchargeStatus, ...rest }) => rest
    );

    res.json({
      status: 200,
      data: requestData,
      message: "Requests fetched successfully",
    });
  } catch {
    res.json({
      status: 500,
      message: "Internal Server Error! Please contact Administrator.",
    });
  }
});

requestsRoute.get("/approval/:requestID", async (req, res) => {
  try {
    const { requestID } = req.params;

    if (!requestID) {
      return res.json({ status: 400, message: "Request ID is required" });
    }

    const requestUserMapData = await RequestUserMap.findOne({
      requestID: requestID,
    });
    const requestDetails = await Request.findOne({ requestID: requestID });
    const requestStatus = await Status.findOne({ requestID: requestID });
    const requestNotes = await Notes.findOne({ requestID: requestID });
    const proofLink = await Proofs.findOne({ requestID: requestID });
    const userDetails = await UserDetails.findOne({
      userID: requestUserMapData.userID,
    });
    const userContacts = await UserContacts.findOne({
      userID: requestUserMapData.userID,
    });
    const userDeptDetails = await UserDepartmentDetails.findOne({
      userID: requestUserMapData.userID,
    });

    if (!requestDetails && !requestStatus && !requestNotes && !proofLink) {
      return res.json({
        status: 404,
        message: "No data found for the given Request ID",
      });
    }
    const requestData = {
      requestID: requestDetails.requestID || null,
      userID: requestUserMapData.userID || null,
      name: userDetails?.name || null,
      year: userDeptDetails?.year || null,
      section: userDeptDetails?.section || null,
      rollNumber: userDeptDetails?.rollNumber || null,
      email: userContacts?.email || null,
      phone: userContacts?.phone || null,
      reqType: requestDetails.reqType || null,
      reason: requestDetails.reason || null,
      fromDate: requestDetails.fromDate || null,
      fromSession: requestDetails.fromSession || null,
      toDate: requestDetails.toDate || null,
      toSession: requestDetails.toSession || null,
      days: requestDetails.days || null,
      advisorStatus: requestStatus.advisorStatus || null,
      inchargeStatus: requestStatus.inchargeStatus || null,
      advisorNote: requestNotes.advisorNote || null,
      inchargeNote: requestNotes.inchargeNote || null,
      proofLink: proofLink.proofLink || null,
    };

    res.json({
      status: 200,
      data: requestData,
      message: "Requests fetched successfully",
    });
  } catch {
    res.json({
      status: 500,
      message: "Internal Server Error! Please contact Administrator.",
    });
  }
});

module.exports = requestsRoute;
