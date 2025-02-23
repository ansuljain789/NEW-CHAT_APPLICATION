import React, { useEffect, useState} from 'react'
import axios from 'axios';

const ChatPage = () => {

    const [chats,setChats]=useState([]);
    const fetchChats = async() =>{
         try {
        const response = await axios.get("http://localhost:5000/api/chat");
        console.log(response.data);
        setChats(response.data);
    } catch (error) {
        console.error("Error fetching chats:", error);
    }
        
    };
     
    useEffect(()=>{
            fetchChats();
    },[])

  return (


    <div> {chats.map(chat=>(
            
       <div>  
        {chat.chatName}
        </div>
    ))}
    </div>
  )
};

export default ChatPage;