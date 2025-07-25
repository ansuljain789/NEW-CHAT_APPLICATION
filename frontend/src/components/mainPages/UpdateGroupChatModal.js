import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import UserBadgeItem from '../User details/UserBadgeItem';
import UserListItem from '../User details/UserListItem';
import { ChatState } from '../../Context/contextProvider';
import axios from 'axios';

const END = process.env.REACT_APP_ENDPOINT

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {

  const {isOpen, onOpen,onClose} = useDisclosure();

  const [groupChatName,setGroupChatName]=useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading,setRenameLoading] = useState(false)

  const { selectedChat, setSelectedChat, user } = ChatState();

  const toast = useToast();


  ///remove
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${END}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
       fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  ///rename
  const handleRename = async()=>{
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put( `${END}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");

  }


//search
 const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${END}/api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

 ////addUser
  const handleAddUser = async (user1) => {

    if (selectedChat.users.find((u) => u._id === user1._id)) {

      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {

      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {


      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${END}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error)
     {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };





  return (
    <>
    <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize={"30px"}
          fontFamily={"work sans"}
          display={"flex"}
          justifyContent={"center"}
        
        >{selectedChat.chatName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
               <Box w="100%" d="flex" flexWrap={"wrap"} pb={3}>

               {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}

               </Box>
               <FormControl display="flex" alignItems="center">
                     <Input
                     placeholder="Chat Name"
                     mb={3}
                     value={groupChatName}
                     onChange={(e)=>setGroupChatName(e.target.value)}
                     size="md"
                     />
                     <Button
                      variant="solid"
                      colorScheme="teal"
                      ml={2}
                      isLoading={renameLoading}
                      onClick={handleRename}
                      size="md"
                     >
                      Update
                      </Button>
               </FormControl>

               <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  chatName={user.name}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}

        </ModalBody>
        <ModalFooter>
          <Button onClick={()=>handleRemove(user)} colorScheme="red">
          Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}
export default UpdateGroupChatModal