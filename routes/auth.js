const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const jwtSecret = "hi";

// Signup route
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;  // Changed res.body to req.body
    const hashedpassword = await bcrypt.hash(password, 10);  // Await bcrypt.hash

    try {
        const response = await prisma.user.create({  // Prisma model should match your schema (user, not User)
            data: {
                username: username,
                password: hashedpassword
            }
        });
        res.json({
            msg: "registered successfully",
            response
        });
    } catch (error) {
        res.json({
            msg: "error adding user",
            error
        });
    }
});

// Signin route
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (!response) {
            return res.status(404).json({
                msg: "user not found"
            });
        }

        const validatepassword = await bcrypt.compare(password, response.password);  // Compare with response.password
        if (!validatepassword) {
            return res.status(404).json({
                msg: "incorrect password"
            });
        }

        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
        res.json({
            msg: "logged in successfully",
            token
        });
    } catch (error) {
        res.json({
            msg: "unable to login",
            error
        });
    }
});

module.exports = router;
