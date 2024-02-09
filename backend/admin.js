const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3003;
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(cors());

const secretKey = "SZ9NkP*va21$FCw";

mongoose.connect('mongodb://localhost:27017/kecpresence');

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
    reqtype: String,
    reason: String,
    fromdate: String,
    todate: String,
    session: String,
    days: String,
    status: String,
  });

app.post('/login', async (req, res) => {
    const { mail, password } = req.body;
    const user = await Users.findOne({ mail: mail , password: password });
    
    if(user){
        const token = jwt.sign({ usertype: user.usertype, department: user.department, name: user.name, rollnumber: user.rollnumber, mail: user.mail, year: user.year, section: user.section, phone: user.phone, pphone: user.pphone, pmail: user.pmail }, secretKey, { expiresIn: '1d' });
        res.json(token);
    }
    else{
        res.json("failed");
    }
});

app.post('/adduser', async (req, res) => {
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
    
        const newUser = new Users({ usertype, department, name, roll, mail, year,section, phone, pphone, pmail, password });
        await newUser.save();
        
        if(newUser._id){
            res.json("success");
        }
        else{
            res.json("error");
        }
    }
});

app.post('/searchuser', async (req, res) => {
    const { usertype, mail } = req.body;
    const user = await Users.findOne({ usertype, mail });
    res.json(user);
});

app.post('/edituser', async (req, res) => {
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

app.post('/deleteuser', async (req, res) => {
    const { mail } = req.body;
    const user = await Users.findOne({ mail });

    if(!user){
        res.json("not-found")
    }
    
    else{
        const del = await Users.deleteOne({ mail });
        
        if(del.acknowledged === true){
            res.json("success");
        }
        else{
            res.json("error")
        }
    } 
});

app.post('/addrequest', async (req, res) => {
    const { reqtype, reason, fromdate, todate, session, days, status } = req.body;
    const newReq = new Request({ reqtype, reason, fromdate, todate, session, days, status });
    await newReq.save();
    res.json("success");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});