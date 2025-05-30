import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import { setAuthToken } from '../api/auth';
import { motion } from 'framer-motion';

interface RegisterProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Register: React.FC<RegisterProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    date_of_birth: '',
    country: '',
    cycle_type: 'unknown',
  });
  const toast = useToast();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.700');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      setAuthToken(response.data.access, response.data.refresh);
      setIsAuthenticated(true);
      navigate('/dashboard');
      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Registration Failed',
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
          Register
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
            <FormControl>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                focusBorderColor="brand.500"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., US"
                focusBorderColor="brand.500"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Cycle Type</FormLabel>
              <Select
                name="cycle_type"
                value={formData.cycle_type}
                onChange={handleChange}
                focusBorderColor="brand.500"
              >
                <option value="regular">Regular</option>
                <option value="irregular">Irregular</option>
                <option value="unknown">Unknown</option>
              </Select>
            </FormControl>
            <Button
              type="submit"
              colorScheme="pink"
              width="full"
              _hover={{ bg: 'brand.600' }}
            >
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </motion.div>
  );
};

export default Register;