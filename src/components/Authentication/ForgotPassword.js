import React, { useState } from 'react';
import { Box, Input, Button, Heading, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';


  const END = process.env.REACT_APP_ENDPOINT
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const toast = useToast();

  const showToast = (title, status = 'info') =>
    toast({ title, status, duration: 3000, isClosable: true });

  const handleSendOTP = async () => {
    try {
      await axios.post(`${END}/api/auth/send-otp`, { email });
      showToast('OTP sent to your email', 'success');
      setStep(2);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error sending OTP', 'error');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.post(`${END}/api/auth/verify-otp`, { email, otp });
      showToast('OTP verified', 'success');
      setStep(3);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Invalid OTP', 'error');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post(`${END}/api/auth/reset-password`, { email, newPassword });
      showToast('Password updated!', 'success');
      setStep(1);
      setEmail('');
      setOTP('');
      setNewPassword('');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Reset failed', 'error');
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={12} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading size="lg" textAlign="center" mb={6}>
        Forgot Password
      </Heading>
      <VStack spacing={4}>
        {step === 1 && (
          <>
            <Input placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={handleSendOTP} colorScheme="blue" w="full">Send OTP</Button>
          </>
        )}
        {step === 2 && (
          <>
            <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOTP(e.target.value)} />
            <Button onClick={handleVerifyOTP} colorScheme="green" w="full">Verify OTP</Button>
          </>
        )}
        {step === 3 && (
          <>
            <Input placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button onClick={handleResetPassword} colorScheme="purple" w="full">Reset Password</Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
