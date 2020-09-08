

const socket = io() 

const $message_form = document.querySelector('#message-form') 
const $message_input= $message_form.querySelector('input') 
const $message_button= $message_form.querySelector('button')
const $location_button= document.querySelector('#location') 
const $displaymessage = document.querySelector('#message')


// Template 

const templatemessage = document.querySelector('#message-template').innerHTML
const locationtemplate =document.querySelector('#location-template').innerHTML
const sidbartemplate = document.querySelector('#sidebar-template').innerHTML 

// 

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) 


const autoscroll = ()=>
{
  const $newmessage = $displaymessage.lastElementChild

  const newMessageStyle = getComputedStyle($newmessage) 
  const newMessageMargin = parseInt(newMessageStyle.marginBottom)

  const $newmessageHight = $newmessage.offsetHeight + newMessageMargin

  // visbel hight 

  const visbleHeight = $displaymessage.offsetHeight
  // container height 

  const containerHeight = $displaymessage.scrollHeight 
  // how far i scroll
  const scrolloffset = $displaymessage.scrollTop + visbleHeight 

  if(containerHeight-$newmessage <=scrolloffset)  
  {
      $displaymessage.scrollTop = $displaymessage.scrollHeight 
  }
}



socket.on('message',(message)=>{

     const html = Mustache.render(templatemessage,{ username:message.username, message:message.text,
        createAt:moment(message.createAt).format('h:mm: a')}) 
     $displaymessage.insertAdjacentHTML('beforeend',html)

    autoscroll()
}) 

socket.on('roomData',({room,users})=>{

 const html = Mustache.render(sidbartemplate,{
     room,
     users
 })
 document.querySelector('#sidebar').innerHTML= html

}) 


socket.on('loctionmessage',(message)=>{
    const locationurl = Mustache.render(locationtemplate,{ username :message.username, url:message.url,createAt:
        
        moment (message.createAt).format('h:mm a')})  
    $displaymessage.insertAdjacentHTML('beforeend',locationurl)

        autoscroll()
      
})  

$message_form.addEventListener('submit',(e)=>{
    e.preventDefault()

    $message_button.setAttribute('disabled','disabled') 

    const message = e.target.elements.message1.value
     
     socket.emit('sendmessage',message,()=>{
        $message_button.removeAttribute('disabled')
        $message_input.value=''
        $message_input.focus()
         

        console.log('Message delivered')
        

     }) 

     
     
}) 

$location_button.addEventListener('click',(postion)=>{

      $location_button.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((postion)=>{

        socket.emit('sendlocation',{

            latitude: postion.coords.latitude,
            longitude:postion.coords.longitude
        },()=>{$location_button.removeAttribute('disabled')

                console.log('Location shard !')
        }) 
    })
}) 



socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/' 
    }

     
})  