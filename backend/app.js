const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require("cors"); 
const corsMiddleware = cors();
app.use(express.json())
app.use(corsMiddleware)

const auth = require("./routes/auth.js")
const authenticateToken = require("./routes/auth.js").authenticateToken;

app.use("/",auth)



app.get("/",authenticateToken,async(req,res)=>{
    try{
        const todo = await prisma.Todo.findMany({
            where : {
                userid : req.user.id
            }
        })
        res.status(201).json({
            todo
        })
    }catch(error){
        res.status(500).json({
            msg : "error in fetching the data",
            error
        })
    }
})

app.post("/",authenticateToken, async(req,res)=>{
    const { title  } = req.body
    const userid = req.user.id
    console.log(userid)
    

    try{
        const todo = await prisma.Todo.create({
            data : {
                title,
                userid 
            }
        })
        res.status(201).json({
            msg : "created successfully",
            todo
            
        })
    }catch(error){
        res.status(500).json({
            msg : "error in creating todo",error
        })
    }
})

app.put("/:id",authenticateToken, async(req,res)=>{
    const id = req.params.id
    const { completed } = req.body
    try{
        const response = await prisma.Todo.update({
            where : {
                id
            },
            data : {
                completed
            }
        })
        res.status(200).json({
            msg: "Todo updated successfully",
            todo: response 
        });
    }catch(error){
        res.status(500).json({
            msg: "Error in updating the todo",
            error
        });
    }
})

app.delete("/:id",authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id); 
    try {
        const response = await prisma.Todo.delete({
            where: {
                id: id,
            },
        });
        res.status(204).json({ msg: "Deleted successfully",response }); 
    } catch (error) {
        res.status(500).json({
            msg: "Error in deleting todo",
            error: error.message, 
        });
    }
});

const port = 5000
app.listen(port)