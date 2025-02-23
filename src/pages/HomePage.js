import React from 'react'
import {Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

const HomePage = () => {
  return <Container maxW='xl' centerContent>
   
   <Box
       d='flex'
       justifyContent='center'
       textAlign= 'center'
       p={3}
       bgColor={'white'}
       w="100%"
       m="40px 0 15px 0"
       borderRadius= "lg"
       borderWidth="1px"
   >
     <Text
       fontFamily="work sans"
       fontSize="3xl"
       color="black"
     
     >CHAT-APPLICATION</Text>
   </Box>
   <Box bg="white" w="100%" p={4} borderRadius="lg" color="black" borderWidth="1px">
  <Tabs>
  <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
               <Signup/>
            </TabPanel>
          </TabPanels>
  </Tabs>




   
   
   </Box>


  </Container>;
};

export default HomePage;