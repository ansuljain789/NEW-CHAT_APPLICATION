import { Box, Button, Tooltip,Text, MenuButton,MenuItem, Menu, MenuList, Avatar, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useToast, Spinner,} from '@chakra-ui/react';
import React, { useState } from 'react'
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { ChatState } from '../../Context/contextProvider';
import {useNavigate} from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import ProfileModal from "./ProfileModal"


import axios from 'axios';
import UserListItem from '../User details/UserListItem';
import { getSender } from '../../config/ChatLogics';


  const END = process.env.REACT_APP_ENDPOINT

const SideDrawer = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
       
    const [search,setsearch] = useState("");
    const [searchResult,setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
        setNotification
  } = ChatState();
   const navigate = useNavigate();


   const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate('/')
  };
  
  const toast = useToast();
  const handleSearch = async() =>{
     if(!search) {
      toast({
        title:"please enter something in Search",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left"

      });
      return
     }
     try{
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${END}/api/user?search=${search}`, config);



      setLoading(false);
      setSearchResult(data);
  

     }catch(error){
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

     }
     
  }

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${END}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
   <>


   <Box display="flex" justifyContent="space-between" alignItems="center" bg="white"w="100%" p="5px 10px" borderWidth="5px">

        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>


        <Text fontSize="2xl" fontFamily="Work sans" flex="1" textAlign="center">
         chat-app
        </Text>

        <div>
                <Menu>
            <MenuButton p={1}>
            
              
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
                 {!notification.length && "No New Messages"}
                 {notification.map(notif =>(
                  <MenuItem
                    key={notif._id} onClick={()=>{
                      setSelectedChat(notif.chat)
                      setNotification(notification.filter((n)=> n!==notif))
                    }}
                  >
                     {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`
                     :`New Message  from ${getSender(user,notif.chat.users)}`}
                  
                  </MenuItem>
                 ))}
            </MenuList>
                </Menu>

                <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          <Avatar size="sm" cursor='pointer' name={user.name} src={user.pic}/>

          </MenuButton>

          <MenuList>

          {/* <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal> */}
             
             <ProfileModal user={user}>
             <MenuItem>My Profile</MenuItem>
             </ProfileModal>

      
             <MenuDivider />
             
             <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
                </Menu>
 

          </div>
   </Box>


   <Drawer  placement='left' onClose={onClose} isOpen={isOpen}>
          

        <DrawerOverlay />
        <DrawerContent>
           <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
           <DrawerBody>
          <Box display={"flex"} padding={2}>

            <input
               placeholder='search by name or email'
               value={search}
               onChange={(e)=>setsearch(e.target.value)}
            />
            <Button 
            onClick={handleSearch}
            >Go</Button>
          </Box>
          {loading ? <ChatLoading /> :
          (
            searchResult?.map((user) => (
              <UserListItem
              
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
              />
            ))
          ) }
          {loadingChat && <Spinner marginLeft={"auto"} display={"flex"}/>}
        </DrawerBody>
        </DrawerContent>

       


   </Drawer>
   </>
  )
}

export default SideDrawer