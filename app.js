const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
app.use(express.json())

const auth = require("./routes/auth.js")
app.use("/",auth)



app.get("/",async(req,res)=>{
    try{
        const todo = await prisma.Todo.findMany()
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

app.post("/",async(req,res)=>{
    const { title } = req.body

    try{
        const todo = await prisma.Todo.create({
            data : {
                title
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

app.put("/:id",async(req,res)=>{
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

app.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id); 
    try {
        const response = await prisma.Todo.delete({
            where: {
                id: id,
            },
        });
        res.status(204).json({ msg: "Deleted successfully" }); 
    } catch (error) {
        res.status(500).json({
            msg: "Error in deleting todo",
            error: error.message, 
        });
    }
});

const port = 5000
app.listen(port)