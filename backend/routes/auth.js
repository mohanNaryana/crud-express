const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const jwtSecret = "hi";

// Signup route
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;  
    const hashedPassword = await bcrypt.hash(password, 10); 

    try {
        const user = await prisma.user.create({  
            data: {
                username: username,
                password: hashedPassword
            }
        });
        res.json({
            msg: "Registered successfully",
            user
        });
    } catch (error) {
        res.status(500).json({  
            msg: "Error adding user",
            error: error.message
        });
    }
});

// Signin route
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
        console.log(user)
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const validatePassword = await bcrypt.compare(password, user.password);  
        if (!validatePassword) {
            return res.status(401).json({  
                msg: "Incorrect password"
            });
        }

        const token = jwt.sign({id : user.id , username }, jwtSecret);
        res.json({
            msg: "Logged in successfully",
            token
        });
    } catch (error) {
        res.status(500).json({
            msg: "Unable to login",
            error: error.message
        });
    }
});


function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({
            msg: "Access denied"
        });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({  
                msg: "Invalid token"
            });
        }

        req.user = user;  
        console.log(req.user)
        next();  
    });
}

module.exports = router;   
module.exports.authenticateToken = authenticateToken;