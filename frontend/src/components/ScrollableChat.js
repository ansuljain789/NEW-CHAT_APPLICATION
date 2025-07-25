import { Avatar, Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/contextProvider";
import { DeleteIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
 const END = process.env.REACT_APP_ENDPOINT

const ScrollableChat = ({ messages, deleteMessageForMe, deleteMessageForEveryone }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex"}} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}


         <Box
              backgroundColor={m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}
              marginLeft={isSameSenderMargin(messages, m, i, user._id)}
              marginTop={isSameUser(messages, m, i, user._id) ? 6 : 10}
              borderRadius="0px"
              padding="5px 15px"
              maxWidth="60%"
            >
                 {m.content === "This message is deleted" ? (
                    <Box as="i" color="gray">
                           This message was deleted
                     </Box>
                 ) : (
               <>
               

       {/* Reduced-size Image */}
      {m.file && m.fileType === "image" && (
        <img
          src={`${END}${m.file}`}
          alt="sent"
          style={{
            width: "200px",          // Fixed width
            height: "auto",          // Auto height to maintain aspect ratio
            borderRadius: "0px",
            marginTop: "0px",
            objectFit: "cover"       // Optional: keeps image nicely cropped if needed
          }}
        />
      )}
    

      {/* Reduced-size Video */}
      {m.file && m.fileType === "video" && (
        <video
          src={`${END}${m.file}`}
          controls
          style={{
            width: "250px",          // Fixed width
            height: "auto",
            borderRadius: "10px",
            marginTop: "10px",
             objectFit: "cover"
          }}
        />
      )}
        {m.content && <div>{m.content}</div>}
    </>
  )}
</Box>



            {/* Delete Options (Hidden for Deleted Messages) */}
            {m.content !== "This message is deleted" && (
              <Menu>
                <MenuButton as={IconButton} icon={<BsThreeDotsVertical />} size="sm" ml={2} />
                <MenuList>
                  {/* Delete for Me */}
                  <MenuItem onClick={() => deleteMessageForMe(m._id)}>
                    <DeleteIcon mr={2} /> Delete for Me
                  </MenuItem>

                  {/* Delete for Everyone (Only if sender is current user) */}
                  {m.sender._id === user._id && (
                    <MenuItem onClick={() => deleteMessageForEveryone(m._id)}>
                      <DeleteIcon mr={2} /> Delete for Everyone
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;