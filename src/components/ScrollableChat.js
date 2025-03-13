// import { Avatar, Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
// import { Tooltip } from "@chakra-ui/react";
// import ScrollableFeed from "react-scrollable-feed";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../config/ChatLogics";
// import { ChatState } from "../Context/contextProvider";
// import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
// import { BsThreeDotsVertical } from "react-icons/bs";

// const ScrollableChat = ({ messages,deleteMessageForMe, deleteMessageForEveryone}) => {
//   const { user } = ChatState();
  

//   return (
//     <ScrollableFeed>
//       {messages &&
//         messages.map((m, i) => (
//           <div style={{ display: "flex" }} key={m._id}>
//             {(isSameSender(messages, m, i, user._id) ||
//               isLastMessage(messages, i, user._id)) && (
//               <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
//                 <Avatar
//                   mt="7px"
//                   mr={1}
//                   size="sm"
//                   cursor="pointer"
//                   name={m.sender.name}
//                   src={m.sender.pic}
//                 />
//               </Tooltip>
//             )}
//             <span
//               style={{
//                 backgroundColor: `${
//                   m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
//                 }`,
//                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
//                 marginTop: isSameUser(messages, m, i, user._id) ? 6 : 10,
//                 borderRadius: "20px",
//                 padding: "5px 15px",
//                 maxWidth: "75%",
//                 fontStyle: m.content === "This message is deleted" ? "italic" : "normal",
//                 color: m.content === "This message is deleted" ? "gray" : "black",
//               }}
//             >
//               {m.content === "This message is deleted" ? "This message was deleted" : m.content}
//               </span>


           
//            {/* Delete Options */}
//            <Menu>
//               <MenuButton as={IconButton} icon={<BsThreeDotsVertical/>} size="sm" ml={2} />
//               <MenuList>
//                 {/* Delete for Me */}
//                 <MenuItem onClick={() => deleteMessageForMe(m._id)}>
//                   <DeleteIcon mr={2} /> Delete for Me
//                 </MenuItem>

//                 {/* Delete for Everyone (only if sender is current user) */}
//                 {m.sender._id === user._id && (
//                   <MenuItem onClick={() => deleteMessageForEveryone(m._id)}>
//                     <DeleteIcon mr={2} /> Delete for Everyone
//                   </MenuItem>
//                 )}
//               </MenuList>
//             </Menu>
//           </div>
//         ))}
//     </ScrollableFeed>
//   );
// };

// export default ScrollableChat;



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

            {/* Message Styling */}
            <span
              style={{
                backgroundColor: `${
                                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                   }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 6 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                fontStyle: m.content === "This message is deleted" ? "italic" : "normal",
                color: m.content === "This message is deleted" ? "gray" : "black",
              }}
            >
              {m.content === "This message is deleted" ? "This message was deleted" : m.content}
            </span>

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
