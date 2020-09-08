const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const {generatemessage,  generatelocationo} = require('./utils/message') 
const {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}   = require('./utils/users')  
const { getuid } = require('process')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')



app.use(express.static(publicDirectoryPath))






io.on('connection',(socket)=>{
    
     console.log('New Websocket connection') 

     

     socket.on('sendmessage',(msg,callback)=>{

        const user = getUser(socket.id)
        io .to(user.room).emit('message',generatemessage(user.username, msg))
        callback()

     }) 

      socket.on('join',({username, room},callback)=>{

          const {error ,user } = addUser({id:socket.id,username,room})

          if(error)
          {
            return callback(error)
          }

          socket.join(user.room)

            socket.emit('message',generatemessage('Admin', 'Welcome') )  
            socket.broadcast.to(user.room).emit('message',generatemessage( 'Admin',`${user.username} has joined!`))
            socket.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserInRoom(user.room)
            }) 

         callback() 


      }) 


     
     socket.on('sendlocation',(coords,callback)=>{
         const user = getUser(socket.id)    

         io.to(user.room).emit('loctionmessage',generatelocationo(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

          callback() 
     }) 

     socket.on('disconnect',()=>{

     const user =   removeUser(socket.id) 
   
     
        if (user) {

            io.to(user.room).emit('message', generatemessage('Admin',`${user.username} has left!`))
            socket.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserInRoom(user.room)
            }) 
        }

        

        
     }) 

})   




server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

