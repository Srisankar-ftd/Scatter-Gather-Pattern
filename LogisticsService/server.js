const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({origin:'http://main-service:3000'}))
app.use(express.json())

app.get("/:company",(req,res)=>{
    return res.status(200).json({
        company:req.params.company,
        time:new Date(),
        location:['Jaffna','Colombo','Galle']
    })
})

app.listen(3003,(err)=>{
    if(err){
        console.log("Server Start : Fail")
    }else{
        console.log("Server Start : Success")
    }
})