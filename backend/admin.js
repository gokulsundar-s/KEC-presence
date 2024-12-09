const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const PORT = 3003;
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const serverless = require('serverless-http');

dotenv.config();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

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
    advoicerstatus: String,
    inchargestatus: String,
  });





// --------------------------------------------------------------------
//                              Common Utilities
// --------------------------------------------------------------------

app.post('/userdata', async (req, res) => {
    const user = await Users.find({ usertype: {$ne: "Admin" }}).sort({ usertype : 1 });
    res.json(user);
});

app.post('/login', async (req, res) => {
    const { mail, password } = req.body;
    const user = await Users.findOne({ mail: mail, password: password });
    if(user){
        const validate = true;
        if(validate){
            const token = jwt.sign({ usertype: user.usertype, department: user.department, name: user.name, roll: user.roll, mail: user.mail, year: user.year, section: user.section, phone: user.phone, pphone: user.pphone, pmail: user.pmail }, process.env.secretKey, { expiresIn: '1d' });
            res.json(token);
        }
        else{
            res.json("wrongpass")
        }
    }
    else{
        res.json("nouser")
    }
});

app.post('/changepassword', async (req, res) => {
    const { mail, currentpassword, newpassword} = req.body;
    
    const user_data = await Users.findOne({ mail: mail, password: currentpassword });

    if(user_data !== null){
        const update = await Users.updateOne({ mail }, {$set:{ password: newpassword }});
        
        if(update.modifiedCount === 1){
            res.json("202");
        }
    }

    else if(user_data === null){
        res.json("402");
    }
});





// --------------------------------------------------------------------
//                              Users Module Utilities
// --------------------------------------------------------------------

app.post('/adminadduser', async (req, res) => {
    const { usertype, department, name, roll, mail, year,section, phone, pphone, pmail} = req.body;
    const user = await Users.findOne({ mail: mail });
    
    if(user){
        res.json("exists");
    }

    else{
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        length = 8;
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }
        
    
        const newUser = new Users({ usertype, department, name, roll, mail, year,section, phone, pphone, pmail, password});
        await newUser.save();
        
        if(newUser._id){
            res.json("success");
        }
        else{
            res.json("error");
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

app.post('/admindeleteuser', async (req, res) => {
    const mail = req.body.deletedata;
    const del = await Users.deleteOne({ mail });

    if(del.acknowledged === true){
        res.json("202");
    } else{
        res.json("402")
    } 
});

app.post('/adminsearchuser', async (req, res) => {
    const { searchby, searchvalue } = req.body;
    
    if(searchby === "Name"){
        const searchname = searchvalue.toUpperCase();
        const user = await Users.find({ usertype: {$ne: "Admin" }, name: {$regex : searchname}}).sort({ usertype : 1 });
        res.json(user);
    }
    else if(searchby === "Roll Number"){
        const searchroll = searchvalue.toUpperCase();
        const user = await Users.find({ usertype: {$ne: "Admin" }, roll: {$regex : searchroll}}).sort({ usertype : 1 });
        res.json(user);
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

module.exports = app;
module.exports.handler = serverless(app);