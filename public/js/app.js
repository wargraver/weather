console.log('hello javascript')
const form = document.querySelector('form')
const input = document.querySelector('input')
const msg1 = document.querySelector('#message1')
const msg2 = document.querySelector('#message2')
msg1.textContent=''
msg2.textContent=''
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const se = input.value
    console.log('searching')
    console.log(se)
    fetch('http://localhost:3000/wheater?search='+se).then((response)=>{
         response.json().then((data)=>{
             if(data.day==undefined){
                 msg1.textContent='PLEASE TRY ANOTHER VALID LOCATION'
                 console.log(data.error)
             }
             else{
                 msg1.textContent="THE TEMPRATURE OF "+se+" IS "+data.day
                 //msg2.textContent=data.day
                 console.log(se)
                 console.log(data.day)
             }
         })
    })
    
})
