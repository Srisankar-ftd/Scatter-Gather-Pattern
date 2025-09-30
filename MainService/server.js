const express = require('express')
const { get } = require('http')
const app = express()

app.use(express.json())

app.get("/:company",(request,response)=>{
    const company = request.params.company

    const ratePromise = fetch(`http://rate-service:3001/${company}`,{method:"GET", signal:AbortSignal.timeout(5000)})
    .then(res => res.json())
    .catch(err => { return{value:"Rate Service Not Available"}})

    const allocationPromise = fetch(`http://allocation-service:3002/${company}`,{method:"GET", signal:AbortSignal.timeout(5000)})
    .then(res => res.json())
    .catch(err => { return{duration:"Allocation Service Not Available"}})

    const logisticsPromise = fetch(`http://logistics-service:3003/${company}`,{method:"GET", signal:AbortSignal.timeout(5000)})
    .then(res => res.json())
    .catch(err => { return{location:"Logistics Service Not Available"}})

    Promise.all([ratePromise,allocationPromise,logisticsPromise])
    .then(([rate,allocation,logistics])=>{
        return response.status(200).json({
            company:company,
            time:new Date(),
            value:rate.value,
            duration:allocation.duration,
            location:logistics.location
        })
    })
    .catch(err => {
        return response.status(500).json({
            message:"Error"
        })
    })

})

app.listen(3000,(err)=>{
    if(err){
        console.log("Server Start : Fail")
    }else{
        console.log("Server Start : Success")
    }
})