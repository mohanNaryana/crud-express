
const express = require("express")
const router = express.Router()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")


const jwtSecret = "hi"


router.post("/signup",async (req,res)=>{
    const { username , password } = res.body
    const hashedpassword = bcrypt.hash(password,10)
    try{
        const response = await prisma.user.create({
            data : {
                username,
                password : hashedpassword
            }
        })
        res.json({
            msg : "registered successfully",
            response
        })
    }catch(error){
        res.json({
            msg : "error adding user"
        })
    }

})


router.post("/signin",async(req,res)=>{
    const { username , password } = req.body

    try{
        const response = await prisma.user.findUnique({
            where :{
                username
            }
        })
        if(!response){
            res.status(404).json({
                msg : "user not found"
            })
        }
        const validatepassword = bcrypt.compare(password,User.password)
        if(!validatepassword){
            res.status(404).json({
                msg : "incorrect password"
            })
        }
        const token  = jwt.sign({username},jwtSecret,{expiresIn : '1h'})
        res.json({
            msg : "loged in successfully",
            token
        })
    }catch(error){
        res.json({
            msg : "unable to login",
            error
        })
    }
})



module.exports = router;
