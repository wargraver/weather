const express = require('express')
const path =require('path')
const app = express()
const request = require('request')
const geocode=require('./utils2/geocod.js')
const forecast=require('./utils2/forecast.js')
const path2 = path.join(__dirname,'../public')
app.use(express.static(path2))
/*app.get('',(req,res)=>{
    res.send('hello server')
})
app.get('/help',(req,res)=>{ 
    res.send('hello help')
})*/ 
app.set('view engine','hbs') 
app.get('',(req,res)=>{
    res.render('hello',{
        title:'wheater'
    })
})
app.get('/hello',(req,res)=>{
    res.render('hello',{
        title:'hello'
    })
})
app.get('/product',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:'YOU MUST PROVIDE A LOCATION'})
    }
        res.send({
            product:[]
        })
   })
app.get('/wheater',(req,res)=>{
    if(!req.query.search){
       return res.send('no search value given')
    }
    else{
        geocode(req.query.search,(error,response)=>{
            if(error) res.send({
                address:'NO INTERNET'})
            else if(response){
                forecast(response.x,response.y,(error,response)=>{
                res.send({
                    address:req.query.search,
                    day:response
                })})
            }
            else res.send({
                address:"SEARCH NOT FOUND"})
        })}
})
app.listen(3000,()=>{
    console.log('server is up on port 3000')
})