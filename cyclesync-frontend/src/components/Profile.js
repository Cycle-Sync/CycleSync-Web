import React, { useState, useEffect } from 'react';
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
import { getProfile, updateProfile } from '../api';
import { motion } from 'framer-motion';

function Profile() {
  const [profile, setProfile] = useState({});
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      toast({
        title: 'Profile Updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
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
          Profile
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="date_of_birth"
                value={profile.date_of_birth || ''}
                onChange={handleChange}
                focusBorderColor="brand.500"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                type="text"
                name="country"
                value={profile.country || ''}
                onChange={handleChange}
                placeholder="e.g., US"
                focusBorderColor="brand.500"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="pink"
              width="full"
              _hover={{ bg: 'brand.600' }}
            >
              Save
            </Button>
          </VStack>
        </form>
      </Box>
    </motion.div>
  );
}

export default Profile;