import React from 'react'
import {Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import ForgotPassword from '../components/Authentication/ForgotPassword';

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
            <Tab width="33%">Login</Tab>
            <Tab width="33%">Sign Up</Tab>
            <Tab width="33%">Forgot password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
               <Signup/>
            </TabPanel>
             <TabPanel>
               <ForgotPassword/>
            </TabPanel>
            
          </TabPanels>
  </Tabs>   
   </Box>


  </Container>;
};

export default HomePage;