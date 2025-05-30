import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { setAuthToken } from '../api/auth';
import { motion } from 'framer-motion';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const toast = useToast();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.700');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      setAuthToken(response.data.access, response.data.refresh);
      setIsAuthenticated(true);
      navigate('/dashboard');
      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        maxW="md"
        mx="auto"
        mt={10}
        p={8}
        bg={bg}
        borderRadius="lg"
        boxShadow="lg"
        className="glow"
      >
        <Heading mb={6} textAlign="center" color="brand.500">
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                focusBorderColor="brand.500"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                focusBorderColor="brand.500"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="pink"
              width="full"
              _hover={{ bg: 'brand.600' }}
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </motion.div>
  );
};

export default Login;