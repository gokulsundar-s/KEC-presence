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

    const requestsCount = await Request.find();
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
    const requestNotes = await Notes.find({});

    const requestData = requestsUserMap.map((request) => {
      const reqDetails = requestDetails.find(
        (detail) => detail.requestID === request.requestID
      );
      const reqStatus = requestStatus.find(
        (stat) => stat.requestID === request.requestID
      );
      const reqNotes = requestNotes.find(
        (note) => note.requestID === request.requestID
      );

      const notesCount = 0;
      if (reqNotes?.advisorNote) notesCount++;
      if (reqNotes?.inchargeNote) notesCount++;

      return {
        requestID: reqDetails.requestID || null,
        reqType: reqDetails.reqType || null,
        fromDate: reqDetails.fromDate || null,
        toDate: reqDetails.toDate || null,
        status: reqStatus.inchargeStatus || null,
        notesCount: notesCount,
      };
    });

    res.json({
      status: 200,
      data: requestData,
      message: "Requests fetched successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.json({
      status: 500,
      message: "Internal Server Error! Please contact Administrator.",
    });
  }
});

module.exports = requestsRoute;
