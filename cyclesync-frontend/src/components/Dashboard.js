import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { getDashboard } from '../api';
import { motion } from 'framer-motion';

function Dashboard() {
  const [data, setData] = useState({ days: [], fsh: [], lh: [], estradiol: [], progesterone: [] });
  const bg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboard();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box maxW="4xl" mx="auto" mt={10} p={6} bg={bg} borderRadius="lg" boxShadow="lg" className="glow">
        <VStack spacing={4}>
          <Heading color="brand.500">Dashboard</Heading>
          <Text>Hormone trends will be visualized here.</Text>
          <Box>
            <Text fontWeight="bold">FSH: {data.fsh.join(', ')}</Text>
            {/* Add chart library like Chart.js here */}
          </Box>
        </VStack>
      </Box>
    </motion.div>
  );
}

export default Dashboard;