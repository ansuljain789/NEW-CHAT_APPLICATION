import React, { useEffect,useState } from 'react'
import { ChatState } from '../Context/contextProvider';
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast,Menu,MenuItem,MenuButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {getSender,getSenderFull} from "../config/ChatLogics"
import ProfileModal from './mainPages/ProfileModal';
import UpdateGroupChatModal from './mainPages/UpdateGroupChatModal';
import axios  from 'axios';
import "./styles.css"
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import animationData from '../animations/typing.json'
import { BsSend } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";


import Lottie from 'react-lottie'
const ENDPOINT = "http://localhost:5000";

var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => { 
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected,setSocketConnected] = useState(false)
  const [typing,setTyping] = useState(false)
  const [istyping,setIsTyping] = useState(false)
  


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  

 const { user,selectedChat, setSelectedChat,notification,setNotification} = ChatState();

const toast = useToast();

useEffect(()=>{
  socket  = io(ENDPOINT);
  socket.emit("setup",user);
  socket.on('connected', ()=> setSocketConnected(true))
  socket.on('typing',()=>setIsTyping(true))
  socket.on('stop typing',()=>setIsTyping(false))
},[])

useEffect(() => {
  socket.on("messageDeleted", (deletedMessageId) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== deletedMessageId)
    );
  });
}, []);

  const sendMessage = async(event) =>{
    socket.emit('stop typing',selectedChat._id)
    if((event.type==="click" ) && newMessage){
          try{
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            const { data } = await axios.post(
              "http://localhost:5000/api/message",
              {
                content: newMessage,
                chatId: selectedChat,
              },
              config
            );

            socket.emit("new message",data)
            setMessages([...messages, data]);

          }
          catch(error){
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });

          }
    }
  };
 

  const typingHandler = (e) =>{
    setNewMessage(e.target.value);

    // Typing indicator logic

     if(!socketConnected) return;

     if(!typing){
      setTyping(true)
      socket.emit('typing',selectedChat._id)
     }
       

     let lastTypingTime = new Date().getTime()

     var timerLength = 10000;
     setTimeout(()=>{
         var timeNow = new Date().getTime();
         var timeDiff = timeNow - lastTypingTime

         if(timeDiff >= timerLength && typing){
          socket.emit('stop typing',selectedChat._id)
          setTyping(false)
         }
     },timerLength)

  }

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
 
      setMessages(data);
      setLoading(false);
     socket.emit("join chat",selectedChat._id)

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  
  // const handleDeleteMessage = async (messageId) => {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  
  //     await axios.delete(`http://localhost:5000/api/message/${messageId}`, config);
  
  //     // Remove the deleted message from the state
  //     setMessages(messages.filter((msg) => msg._id !== messageId));
  
  //     toast({
  //       title: "Message deleted",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  
  //     socket.emit("message deleted", messageId);
  //   } catch (error) {
  //     toast({
  //       title: "Error deleting message",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //   }
  // };
  

  // const handleDeleteMessage = async (messageId, messageSenderId) => {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  
  //     // Check if the user is an admin, the sender, or a receiver
  //     const isSender = user._id === messageSenderId;
  //     const isAdmin = user.role === "admin"; // Ensure the backend provides this info
  //     const isReceiver = !isSender; // If the user is not the sender, they are the receiver
  
  //     let deleteForEveryone = false;
  
  //     if (isAdmin) {
  //       deleteForEveryone = true; // Admins can delete for everyone
  //     } else if (isSender) {
  //       deleteForEveryone = true; // Senders can delete their own messages for everyone
  //     } else {
  //       deleteForEveryone = false; // Receivers can only delete for themselves
  //     }
  
  //     await axios.delete(
  //       `http://localhost:5000/api/message/${messageId}`,
  //       {
  //         headers: config.headers,
  //         data: { deleteForEveryone }, // Send this flag to the backend
  //       }
  //     );
  
  //     // Remove the deleted message only for the current user if it's not a global deletion
  //     if (deleteForEveryone) {
  //       setMessages(messages.map((msg) =>
  //         msg._id === messageId ? { ...msg, deletedForUser: true } : msg
  //       ));
  //     } else {
  //       setMessages(messages.filter((msg) => msg._id !== messageId));
  //     }
  
  //     toast({
  //       title: "Message deleted for me",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  
  //     socket.emit("message deleted", { messageId, deleteForEveryone });
  
  //   } catch (error) {
  //     toast({
  //       title: "Error deleting message",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "bottom",
  //     });
  //   }
  // };
  
  const deleteMessageForMe = (messageId) => {
    // Remove message from local state (UI update only)
    setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
  };
  
  // const deleteMessageForEveryone = async (messageId) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/message/${messageId}/foreveryone`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     });
      
  //   const data = await response.json(); // Parse the JSON response
  //   if (response.ok) {
  //     if (data.message === "Message deleted already") {
  //       alert("This message has already been deleted.");
  //     } else {
  //       socket.emit("deleteMessage", messageId); // Emit event to notify others
  //       setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
  //       alert("Message deleted successfully.");
  //     }
  //   } else {
  //     alert(data.error || "Failed to delete the message.");
  //   }
  // }catch (error) {
  //     console.error("Error deleting message:", error);
  //     alert("Something went wrong. Please try again.");
  //   }
  // };
  
  // const deleteMessageForEveryone = async (messageId) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/message/${messageId}/foreveryone`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     });
  
  //     const data = await response.json(); // Parse JSON response
  
  //     if (response.ok) {
  //       setMessages((prevMessages) =>
  //         prevMessages.map((msg) =>
  //           msg._id === messageId 
  //             ? { ...msg, content: "This message is deleted" } 
  //             : msg
  //         )
  //       );
  
  //       socket.emit("deleteMessage", messageId); // Notify others
  //     } else {
  //       if (data.message === "Message deleted already") {
  //         // Show "already deleted" message in the chat UI
  //         setMessages((prevMessages) =>
  //           prevMessages.map((msg) =>
  //             msg._id === messageId 
  //               ? { ...msg, alreadyDeleted: true } // Add a flag for already deleted
  //               : msg
  //           )
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error deleting message:", error);
  //   }
  // };
  
  const deleteMessageForEveryone = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/message/${messageId}/foreveryone`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      const data = await response.json(); // Get backend response
  
      if (response.ok) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId 
              ? { ...msg, content: "This message is deleted" } // Soft delete in UI
              : msg
          )
        );
  
        socket.emit("deleteMessage", messageId); // Notify others
      } else if (data.message === "Message deleted already") {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId 
              ? { ...msg, content: "Message already deleted" } // Show "already deleted"
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  

  useEffect(() => {
   fetchMessages();

  selectedChatCompare = selectedChat
  }, [selectedChat])
  
  

  // useEffect(() => {
  //   socket.on("message recieved", (newMessageRecieved) => {
  //     if (
  //       !selectedChatCompare || // if chat is not selected or doesn't match current chat
  //       selectedChatCompare._id !== newMessageRecieved.chat._id
  //     ) {
  //        //give notification here
  //     }
  //     else{
  //       // setMessages([...messages,newMessageRecieved._id]);
  //       setMessages(prevMessages => [...prevMessages, newMessageRecieved]);

  //     }
  //   });
  // });

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Handle notification logic
       if(!notification.includes(newMessageRecieved)){
        setNotification([newMessageRecieved,...notification])
        setFetchAgain(!fetchAgain);
       }


      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]); 
      }
    });
  
    return () => {
      socket.off("message recieved"); // Cleanup event listener
    };
  }, [socket, selectedChatCompare]); 
  
    
  return (
    <>
   {selectedChat ? (
                <>

                <Text
                 fontSize={{ base: "28px", md: "30px" }}
                 pb={3}
                 px={2}
                 w="100%"
                 fontFamily="Work sans"
                 display="flex"
                 justifyContent={{ base: "space-between" }}
                 alignItems="center"
                >
                <IconButton
                   display={{base:"flex",md:"none"}}
                   icon={<ArrowBackIcon/>}
                   onClick={()=>setSelectedChat("")}
                />
              {!selectedChat.isGroupChat ?(
            <>
              {getSender(user,selectedChat.users)}
              <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
            </>
            ):(
              
                <>{
                    selectedChat.chatName.toUpperCase()}
                
                  <UpdateGroupChatModal
                  
                   fetchAgain={fetchAgain}
                   setFetchAgain={setFetchAgain}
                   fetchMessages = {fetchMessages}
                  />
                
                </>
            )}
                </Text>


                <Box
                 display="flex"
                 flexDir="column"
                 justifyContent="flex-end"
                 p={3}
                 bg="#E8E8E8"
                 w="100%"
                 h="100%"
                 borderRadius="lg"
                 overflowY="hidden"
                
                >
                    {/* Messages here */}

                    {loading ? (
                      <Spinner
                      size="xl"
                      w={20}
                      h={20}
                      alignSelf="center"
                      margin="auto"
                      />
                    ):(
                          <div className='messages'>
                            <ScrollableChat messages= {messages} 
                             deleteMessageForMe={deleteMessageForMe} 
                             deleteMessageForEveryone={deleteMessageForEveryone} 
                            />
                                     
                      

                           </div>

                    )}

                    <FormControl onKeyDown={sendMessage} sRequired mt={3}>
                    {istyping?<div>
                       <Lottie options = {defaultOptions}  width={70}  style={{marginBottom:15,marginLeft:0}}  />
                    </div>:<></>}
                     {/* <Input
                      variant="filled"
                      bg="#E0E0E0"
                      placeholder="Enter a message.."
                      value={newMessage}
                      onChange={typingHandler}
                     
                     /> */}
                      <Box display="flex" alignItems="center">
                         <Input
                              variant="filled"
                              bg="#E0E0E0"
                              placeholder="Enter a message..."
                              value={newMessage}
                              onChange={typingHandler}
                           />
    <Button
      onClick={sendMessage}  // Call sendMessage when button is clicked
      colorScheme="blue"
      ml={2}
    >
         <BsSend />
    </Button>
  </Box>

                    </FormControl>

                  
                </Box>
                </>
   ):(
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
                </Box>
   )}
   </>
  )
}

export default SingleChat
