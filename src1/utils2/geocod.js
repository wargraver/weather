const request = require('request')
//const url2 ='https://api.mapbox.com/geocoding/v5/mapbox.places/noida.json?access_token=pk.eyJ1Ijoid2FyZ3JhdmVyIiwiYSI6ImNrNXdxM2dkaDFoNzYzcGxva3Ixc3I4cWYifQ.BSblH46wcVgC2QUGZW9dnw&limit=1'
//request({url:url2,json:true},(error,response)=>{
    //if(error) console.log('no connection found')
   // else if(response.body.features.length === 0) console.log("invalid loaction")
    //else {console.log(response.body.features[0].center[0])
      //  console.log(response.body.features[0].center[1])
        //const x = response.body.features[0].center[0]
        //const y = response.body.features[0].center[1]
    //}
const geocode = (address,callback)=>{
      const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+address +'.json?access_token=pk.eyJ1Ijoid2FyZ3JhdmVyIiwiYSI6ImNrNXdxM2dkaDFoNzYzcGxva3Ixc3I4cWYifQ.BSblH46wcVgC2QUGZW9dnw&limit=1'
      request({url:url,json:true},(error,response)=>{
              if(error){
                  const str1 = 'NO INTERNET PLEASE CHECK AGAIN'
                  callback(str1,undefined)
              }
              else if(response.body.features.length === 0){
                  const str2 = 'LOCATION NOT FOUND'
                  callback(undefined,undefined)
              }
              else{
                  const str3 = {
                    x :response.body.features[0].center[0],
                    y : response.body.features[0].center[1]
                  }
                  callback(undefined,str3)
              }
      })
}
module.exports = geocode
