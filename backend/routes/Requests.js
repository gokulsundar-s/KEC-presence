const express = require("express");
const bcrypt = require("bcrypt");
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
const saltRounds = 10;

requestsRoute.post("/", async (req, res) => {
  try {
    const { userID, reqType, reason, fromDate, toDate, session, proofLink } =
      req.body;

    if (reqType === "") {
      return res.json({ status: 400, message: "Request type is required" });
    } else if (reason === "") {
      return res.json({ status: 400, message: "Reason is required" });
    } else if (fromDate === "") {
      return res.json({ status: 400, message: "From date is required" });
    } else if (toDate === "") {
      return res.json({ status: 400, message: "To date is required" });
    } else if (session === "") {
      return res.json({ status: 400, message: "Session is required" });
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
      }
    }

    const requestsCount = await Request.find();
    const requestID =
      reqType.charAt(0) +
      (requestsCount.length + 1).toString().padStart(5, "0");

    const newRequestUserMap = new RequestUserMap({
      requestID: requestID,
      userID,
    });

    const newRequest = new Request({
      requestID: requestID,
      reqType,
      reason,
      fromDate,
      toDate,
      session,
    });

    const newStatus = new Status({
      requestID: requestID,
      advisorStatus: "Pending",
      inchargeStatus: "Pending",
    });

    const newNotes = new Notes({
      requestID: requestID,
      advisorNote: "",
      inchargeNote: "",
    });

    const newProofs = new Proofs({
      requestID: requestID,
      proofLink,
    });

    await newRequestUserMap.save();
    await newRequest.save();
    await newStatus.save();
    await newNotes.save();
    await newProofs.save();
    res.json({ status: 200, message: "Request created successfully" });
  } catch (error) {
    console.log(error);

    res.json({ status: 500, message: "Server Error" });
  }
});

module.exports = requestsRoute;
