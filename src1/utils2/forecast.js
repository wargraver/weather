const request = require('request')
//request({url:url},(error,response)=>{
     //  const data = JSON.parse(response.body)
     //  console.log(data.currently)
    //request({url:url,json:true},(error,response)=>{
     //   if(error) console.log('SORRY NO INTERNET FOUND ON YOUR DEVICE')
     //   else if(response.body.error){
    //        console.log("invalid location")
      //  }        else{
 //           console.log('IT IS ' + response.body.currently.temperature+' DEGREES OUT THERE.THE DAY IS '+ response.body.currently.summary)
    //    }
   // })
   const forecast=(latitude,longitude,callback)=>{
       const url = 'https://api.darksky.net/forecast/dea9f0834adb52604af3b402dc4a0b31/'+latitude+','+longitude
       request({url:url,json:true},(error,response)=>{
           if(error){
               const str1 = 'NO INTERNET PLEASE TRY AGAIN LATER'
               callback(str1,undefined)
           }
           else if(response.body.error){
               callback(undefined,undefined)
           }
           else{
               const str2 =response.body.currently.temperature
               callback(undefined,str2)
           }
       }) 
    }
    module.exports = forecast