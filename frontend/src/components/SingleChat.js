import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/contextProvider";
import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./mainPages/ProfileModal";
import UpdateGroupChatModal from "./mainPages/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import animationData from "../animations/typing.json";
import { BsSend } from "react-icons/bs";
import { useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { FiPaperclip } from "react-icons/fi";
import VoiceCall from "./voiceCall";
import { FiPhone } from "react-icons/fi";


import Lottie from "react-lottie";
//  const ENDPOINT = "http://localhost:5000";
 const END = process.env.REACT_APP_ENDPOINT

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
// --- Voice call state ---



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

   

  const toast = useToast();

 useEffect(() => {
  socket = io(END);
  socket.emit("setup", user);
  socket.on("connected", () => setSocketConnected(true));
  socket.on("typing", () => setIsTyping(true));
  socket.on("stop typing", () => setIsTyping(false));

}, []); // keep your original deps; if you had [user], add the handlers inside that effect


  useEffect(() => {
    socket.on("messageDeleted", (deletedMessageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== deletedMessageId)
      );
    });
  }, []);

    const removeFile = () => setSelectedFile(null);

  const sendMessage = async (event) => {
    socket.emit("stop typing", selectedChat._id);
    if ((event.type === "click" ||event.key === 'Enter' )  && (newMessage.trim() || selectedFile)) {

  
      try {

        // Use FormData for sending file + text
      const formData = new FormData();
      formData.append("chatId", selectedChat._id);

      if (newMessage.trim()) formData.append("content", newMessage);
      if (selectedFile) formData.append("file", selectedFile);


        const config = {
          headers: {
            // "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`${END}/api/message`, formData, config);
  
         setNewMessage("");
      setSelectedFile(null); // Clear preview
      setMessages([...messages, data]);
      socket.emit("new message", data);
      } catch (error) {
  
        
        toast({
          title: "Error Occured!",
          description: "either you blocked or Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

  

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();

    var timerLength = 10000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

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
        `${END}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
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

  const deleteMessageForMe = (messageId) => {
    // Remove message from local state (UI update only)
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== messageId)
    );
  };

  const deleteMessageForEveryone = async (messageId) => {
    try {
      const response = await fetch(
        `${END}/api/message/${messageId}/foreveryone`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

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

const recognitionRef = useRef(null);
const startListening = () => {
  if (!("webkitSpeechRecognition" in window)) {
    toast({
      title: "Speech Recognition Not Supported",
      description: "Your browser does not support speech-to-text.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    toast({
      title: "Listening...",
      description: "Speak now!",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setNewMessage(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    console.log("Speech recognition ended");
  };

  recognition.start();
  recognitionRef.current = recognition;
};

// inside SingleChat.js




  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);


  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Handle notification logic
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
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
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
          
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
               
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />

               
              </>
            ) : (
              <> 
                {selectedChat.chatName.toUpperCase()}
        
                
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}

             {/* voice call will added here */}

      




             
             

          
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
            ) : (
              <div className="messages">
                <ScrollableChat
                  messages={messages}
                  deleteMessageForMe={deleteMessageForMe}
                  deleteMessageForEveryone={deleteMessageForEveryone}
                />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} sRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Box width="100%" mt={2}>
      {/* ✅ File Preview above input */}
      {selectedFile && (
        <Flex
          align="center"
          gap={2}
          mb={2}
          p={2}
          border="1px solid #ccc"
          borderRadius="md"
          bg="gray.50"
          maxW="300px"
        >
          {selectedFile.type.startsWith("image") ? (
            <Image
              src={URL.createObjectURL(selectedFile)}
              boxSize="50px"
              objectFit="cover"
              alt="Preview"
            />
          ) : (
            <video width="60" height="40" controls>
              <source src={URL.createObjectURL(selectedFile)} />
            </video>
          )}
          <Text fontSize="sm" isTruncated maxW="150px">
            {selectedFile.name}
          </Text>
          <IconButton
            icon={<CloseIcon />}
            size="xs"
             onClick={removeFile}
            colorScheme="red"
            aria-label="Remove file"
          />
        </Flex>
      )}

              <Box display="flex" alignItems="center" width="100%" gap={2} mt={3}>
                
              <IconButton
                  icon={<FaMicrophone />}
                   onClick={startListening}
                  colorScheme="blue"
                   aria-label="Voice Input"
                  ml={0}
                />
                <Box display="flex" flex="1" gap={2} alignItems="center">
                  
                
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                />


            {/* 📎 File Upload Icon */}
    <Box>
      <label htmlFor="fileUpload">
        <IconButton
          icon={<FiPaperclip />}
          colorScheme="gray"
          aria-label="Attach file"
          as="span" // Important: makes label clickable
          cursor="pointer"
        />
      </label>

      {/* Hidden File Input */}
      <Input
        id="fileUpload"
        type="file"
        accept="image/*,video/*"
        display="none"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
    </Box>

           </Box>

                <Button
                  onClick={sendMessage} // Call sendMessage when button is clicked
                  colorScheme="blue"
                >
                  <BsSend />
                </Button>
              </Box>
              </Box>
            </FormControl>
          </Box>

        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;