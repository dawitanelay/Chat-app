
const generatemessage = (username ,text)=>{

    return {
          username,
         text,
         createAt: new Date().getDate()
    }

} 

const generatelocationo = (username,url)=>{

     return {
          username,
          url,
           createAt: new Date().getDate()
     }
} 


module.exports = {
    generatemessage,
    generatelocationo
} 