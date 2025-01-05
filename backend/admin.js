const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const PORT = 3003;
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const saltRounds = 10;

dotenv.config();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.mongodb_url);

const Users = mongoose.model('users', {
    usertype: String,
    department: String,
    name: String,
    roll: String,
    mail: String,
    year: String,
    section: String,
    phone: String,
    pphone: String,
    pmail: String,
    password: String,
});

const Request = mongoose.model('request', {
    name: String,
    roll: String,
    department: String,
    year: String,
    section: String,
    reqtype: String,
    reason: String,
    fromdate: String,
    todate: String,
    days: String,
    session: String,
    prooflink: String,
    advoicerstatus: String,
    inchargestatus: String,
});

const DropDown = mongoose.model('dropdown', {
    type: String,
    value: String,
    description: String,
});

const DatesConfiguration = mongoose.model('dates_configuration', {
    date: String,
    value: String,
});

// --------------------------------------------------------------------------------
//                                  Sending Email
// --------------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.mail,
        pass: process.env.password
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'gokulsundars.21cse@kongu.edu',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error in sending mail");
        } else {
            console.log('Email sent');
        }
    });
};

// --------------------------------------------------------------------------------
//                                Common Routes
// --------------------------------------------------------------------------------

app.post('/get-dropdown', async (req, res) => {
    const { type } = req.body;
    const dropdown = await DropDown.find({type: type}).sort({ description: 1 });
    res.json(dropdown);
});

app.post('/login', async (req, res) => {
    const { mail, password } = req.body;
    const auth = await Users.findOne({mail: mail});
    
    if(mail === ""){
        res.json({status: 400, message: "Please enter your Mail ID"});
    } else if(password === ""){
        res.json({status: 400, message: "Please enter your Password"});
    } else if(!auth) {
        res.json({status: 400, message: "Invalid Mail ID"});
    } else if(auth) {
        const match = await bcrypt.compare(password, auth.password);    
        if (!match) {
            res.json({status: 400, message: "Invalid Password"});
        } else {
            const token = jwt.sign({usertype: auth.usertype, mail: auth.mail, name: auth.name, roll: auth.roll, year: auth.department, section: auth.section, departyment: auth.department}, process.env.secretKey, { expiresIn: '1d' });
            res.json({status: 200, token: token});
        }
    }
});

// --------------------------------------------------------------------------------
//                                 Admin Routes
// --------------------------------------------------------------------------------

app.post('/add-dropdown', async (req, res) => {
    const { type, value, description } = req.body;
    const dropdown = await DropDown.findOne({type: type, value: value});
    
    if(dropdown) {
        res.json({status: 400, message: "Value for the same type already exists"});
    } else {
        if(type === "") {
            res.json({status: 400, message: "Please select the type"});
        } else if(value === "") {
            res.json({status: 400, message: "Please enter the value"});
        } else if(description === "") {
            res.json({status: 400, message: "Please enter the description"});
        } else {
            const newValue = new DropDown({ type, value, description});
            await newValue.save();
            
            if(newValue._id){
                res.json({status: 200, message: "New dropdown added successfully"});
            } else {
                res.json({status: 400, message: "Server errror in adding new dropdown"});
            }
        }
    }
});

app.post('/date-config', async (req, res) => {
    const { date, value } = req.body;
    const check = await DatesConfiguration.findOne({ date });
    
    if(date === "") {
        res.json({status: 400, message: "Please select the date"});
    } else if(value === "") {
        res.json({status: 400, message: "Please select the day type"});
    } else if(check) {
        res.json({status: 400, message: "Date already exists"});
    } else {
        const newDate = new DatesConfiguration({ date, value });
        await newDate.save();
            
        if(newDate._id){
            res.json({status: 200, message: "Date configuration added successfully"});
        } else {
            res.json({status: 400, message: "Server error in adding new date configuration"});
        }
    }
});

app.post('/adminadduser', async (req, res) => {
    const { usertype, department, name, roll, mail, year, section, phone, pphone, pmail } = req.body;
    const user = await Users.findOne({ mail: mail });
    
    if(user) {
        res.json({status: 400, message: "User already exists"});
    } else {
        if(usertype === ""){
            res.json({status: 400, message: "Please select the Usertype"});
        } else if(department === "") {
            res.json({status: 400, message: "Please select the Department"});
        } else if(name === "") {
            res.json({status: 400, message: "Please enter the Name"});
        } else if(usertype === "STU" && roll === "") {
            res.json({status: 400, message: "Please enter the Roll Number"});
        } else if(usertype === "STU" && roll.length !== 8) {
            res.json({status: 400, message: "Please enter a valid Roll Number"});
        } else if((usertype === "STU" || usertype === "CA" || usertype === "YI") && year === "") {
            res.json({status: 400, message: "Please select the Year"});
        } else if((usertype === "STU" || usertype === "CA") && section === "") {
            res.json({status: 400, message: "Please enter the Section"});
        } else if(mail === "") {
            res.json({status: 400, message: "Please enter the Mail ID"});
        } else if(!mail.includes("@") || !mail.includes(".")) {
            res.json({status: 400, message: "Please enter a valid Mail ID"});
        } else if(phone === "") {
            res.json({status: 400, message: "Please enter the Phone Number"});
        } else if(!phone.length === 10) {
            res.json({status: 400, message: "Please enter a valid Phone Number"});
        } else if(usertype === "STU" && pmail === "") {
            res.json({status: 400, message: "Please enter the Parent Mail ID"});
        } else if(usertype === "STU" && (!pmail.includes("@") || !pmail.includes("."))) {
            res.json({status: 400, message: "Please enter a valid Parent Mail ID"});
        } else if(usertype === "STU" && pphone === "") {
            res.json({status: 400, message: "Please enter the Parent Phone Number"});
        } else if(usertype === "STU" && pphone.length !== 10) {
            res.json({status: 400, message: "Please enter a valid Parent Phone Number"});
        } else {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
            let password = "";
            
            for (let i = 0; i < 8; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset.charAt(randomIndex);
            }
            
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new Users({ usertype, department, name, roll, mail, year,section, phone, pphone, pmail, password: hashedPassword });
            await newUser.save();
            
            if(newUser._id){
                sendMail(mail, 'Login credentials for KEC Presence Portal', `Hello ${name},\nYour account for accessing KEC Presence Portal is activated successfully!!\n\nUse the following login credentials to login to your account:\nMail ID: ${mail}\nPassword: ${password} (Kindly change your password at your first login)\n\nFor queries: kecpresence.server@gmail.com\n\nHave a happy journey with us!!\n\nThanks and Regards,\nKEC Presence Team.`);
                res.json({status: 200, message: "User created successfully"});
            }  else{
                res.json({status: 400, message: "Server error. Try again later"});
            }
        }
    }
});

app.post('/userdata', async (req, res) => {
    const user = await Users.find({ usertype: {$ne: "ADMIN" }}).sort({ usertype : 1 });
    res.json(user);
});

app.post('/searchuserdata', async (req, res) => {
    const { searchby, searchvalue } = req.body;
    
    if (searchby === "Name") {
        const users = await Users.find({ usertype: { $ne: "Admin" }, name: { $regex: String(searchvalue) } }).sort({ usertype: 1 });
        res.json(users);
    } else if (searchby === "Roll Number") {
        const users = await Users.find({ usertype: { $ne: "Admin" }, roll: { $regex: String(searchvalue) } }).sort({ usertype: 1 });
        res.json(users);
    }
});

app.post('/deleteuser', async (req, res) => {
    const { mail } = req.body;
    const user = await Users.findOne({ mail });
    
    if(!user) {
        res.json({status: 400, message: "User does not exist"});
    } else {
        const deleteUser = await Users.deleteOne({ mail });
        if(deleteUser.acknowledged === true){
            res.json({status: 200, message: "User deleted successfully"});
        }
        else{
            res.json({status: 400, message: "Server error. Try again later"});
        }
    }
});

// --------------------------------------------------------------------------------
//                                 Student Routes
// --------------------------------------------------------------------------------

app.post('/add-request', async (req, res) => {
    const { name, roll, mail, reqtype, reason, fromdate, todate, session, advoicerstatus, inchargestatus, prooflink } = req.body;
    
    if(reqtype === "") {
        res.json({status: 400, message: "Please select the Request Type"});
    } else if(reason === "") {
        res.json({status: 400, message: "Please enter the Reason"});
    } else if(fromdate === "") {
        res.json({status: 400, message: "Please select the From Date"});
    } else if(todate === "") {
        res.json({status: 400, message: "Please select the To Date"});
    } else if(session === "") {
        res.json({status: 400, message: "Please select the Session"});
    } else {
        const date1 = new Date(fromdate);
        const date2 = new Date(todate);
        const time = date2.getTime() - date1.getTime();
        const days = time / (1000 * 60 * 60 * 24) + 1;
        
        const check = await Request.findOne({ roll, fromdate: { $lte: fromdate }, todate: { $gte: todate } });

        if(days < 0) {
            res.json({status: 400, message: "Invalid date range selected"});
        } else if(check) {
            res.json({status: 400, message: "Request already exists for same date range"});
        } else if(days === 1 && !date2.getDay()) {
            res.json({status: 400, message: "Request selected date is a Sunday"});
        } else {
            const newReq = new Request({ name, roll, mail, reqtype, reason, fromdate, todate, days, session, prooflink, advoicerstatus, inchargestatus });
            await newReq.save();
            
            if(newReq._id){
                res.json({status: 200, message: "Request posted successfully"});
            } else {
                res.json({status: 400, message: "Server error in adding new request"});
            }
        }
    }
});

app.post('/student-history', async (req, res) => {
    const { roll } = req.body;
    const requests = await Request.find({ roll });
    res.json(requests);
});

app.post('/delete-request', async (req, res) => {
    const { _id } = req.body;
    const stureq = await Request.findOne({ _id });
    
    if(!stureq) {
        res.json({status: 400, message: "Request does not exist"});
    } else {
        const deleteReq = await Request.deleteOne({ _id });
        if(deleteReq.acknowledged === true){
            res.json({status: 200, message: "Request deleted successfully"});
        }
        else{
            res.json({status: 400, message: "Server error. Try again later"});
        }
    }
});





















app.post('/adminedituser', async (req, res) => {
    const { usertype, department, name, roll, mail, year,section, phone, pphone, pmail } = req.body;
    const user = await Users.findOne({ usertype, mail });
    
    if(user){
        const update = await Users.updateOne({usertype, mail}, {$set:{ department, name, roll, year,section, phone, pphone, pmail }});
        if(update.modifiedCount == "0"){
            res.json("false");
        }
        else if(update.modifiedCount != "0"){
            res.json("true");
        }
    }
});

// -------------------------------------Students--------------------------------
app.post('/studentrequest', async (req, res) => {
    const { name, roll, department, year, section, reqtype, reason, fromdate, todate, session, advoicerstatus, inchargestatus } = req.body;
    const date1 = new Date(fromdate);  
    const date2 = new Date(todate);  
    const time = date2.getTime() - date1.getTime();  
    const days = (time / (1000 * 60 * 60 * 24))+1;  
    const check = await Request.findOne({ fromdate: { $lte: fromdate }, todate: { $gte: todate }});
    if(!check){
        const newReq = new Request({ name, roll, department, year, section, reqtype, reason, fromdate, todate, days, session, advoicerstatus, inchargestatus });
        await newReq.save();
        
        if(newReq._id){
            res.json("success");
        }
        else{
            res.json("failure");
        }
    }
    else{
        res.json("exists");
    }
});

app.post('/studentshistory', async (req, res) => {
    const { roll } = req.body;
    const items = await Request.find({ roll }).sort({ _id: -1 });
    res.json(items);
});

// -------------------------------------Advoicer--------------------------------
app.post('/advoicerrequests', async (req, res) => {
    const { department, year, section } = req.body;
    const items = await Request.find({department, year, section, advoicerstatus:"pending"}).sort({ _id: -1 });
    res.json(items);
});

app.post('/advoicerupdate', async (req, res) => {
    const { objid, advoicerstatus } = req.body;
    const user = await Request.findById({ _id:new ObjectId(objid) });
    if(user){
        const update = await Request.updateOne({ _id:new ObjectId(objid)}, {$set:{ advoicerstatus }});
        if(update.modifiedCount == "0"){
            res.json("false");
        }
        else if(update.modifiedCount != "0"){
            res.json("true");
        };
    }
});

app.post('/advoicerhistory', async (req, res) => {
    const { department, year, section } = req.body;
    const items = await Request.find({department, year, section, $or:[{advoicerstatus:"accepted"}, {advoicerstatus:"rejected"} ]}).sort({ _id: -1 });
    res.json(items);
});
// ------------------------------------------Year Incharge--------------------------------
app.post('/inchargerequests', async (req, res) => {
    const { department, year, section } = req.body;
    const items = await Request.find({department, year, advoicerstatus:"accepted", inchargestatus:"pending"}).sort({ _id: -1 });
    res.json(items);
});

app.post('/inchargeupdate', async (req, res) => {
    const { objid, inchargestatus } = req.body;
    const user = await Request.findById({ _id:new ObjectId(objid) });

    if(user){
        const update = await Request.updateOne({ _id:new ObjectId(objid)}, {$set:{ inchargestatus }});
        if(update.modifiedCount == "0"){
            res.json("false");
        }
        else if(update.modifiedCount != "0"){
            res.json("true");
        }
    }
});

app.post('/inchargehistory', async (req, res) => {
    const { department, year } = req.body;
    const items = await Request.find({department, year, $or:[{inchargestatus:"accepted"}, {inchargestatus:"rejected"}], advoicerstatus:"accepted" }).sort({ _id: -1 });
    res.json(items);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});