import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Textarea,
  VStack,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { getDailyEntry, updateDailyEntry } from '../api';
import { motion } from 'framer-motion';

function DailyLog() {
  const [entry, setEntry] = useState({
    cramps: 0,
    bloating: 0,
    tender_breasts: 0,
    headache: 0,
    acne: 0,
    mood: 3,
    stress: 0,
    energy: 3,
    cervical_mucus: 'none',
    sleep_quality: 3,
    libido: 2,
    notes: '',
  });
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await getDailyEntry();
        setEntry(response.data);
      } catch (error) {
        console.error('Failed to fetch entry', error);
      }
    };
    fetchEntry();
  }, []);

  const handleChange = (name, value) => {
    setEntry({ ...entry, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDailyEntry(entry);
      toast({
        title: 'Entry Saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
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
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Cramps</FormLabel>
            <Slider
              name="cramps"
              min={0}
              max={5}
              value={entry.cramps}
              onChange={(val) => handleChange('cramps', val)}
              colorScheme="pink"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name="notes"
              value={entry.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Enter any notes"
              focusBorderColor="brand.500"
            />
          </FormControl>
          <Button type="submit" colorScheme="pink" width="full">
            Save
          </Button>
        </VStack>
      </Box>
    </motion.div>
  );
}

export default DailyLog;