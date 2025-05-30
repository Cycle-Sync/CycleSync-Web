import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaCalendarAlt, FaChartLine, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Landing: React.FC = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box bgGradient="linear(145deg, brand.50, white)" minH="100vh">
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        pt={{ base: 20, md: 32 }}
        pb={{ base: 16, md: 24 }}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading
              as="h1"
              size={{ base: '2xl', md: '4xl' }}
              color="brand.500"
              fontWeight="extrabold"
            >
              Track Your Cycle with Ease
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color={textColor} maxW="2xl">
              CycleSyNC helps you understand your menstrual cycle, log symptoms, and predict
              your next period with confidence.
            </Text>
            <HStack spacing={4}>
              <MotionButton
                as={Link}
                to="/register"
                colorScheme="pink"
                size="lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glow"
              >
                Get Started
              </MotionButton>
              <MotionButton
                as={Link}
                to="/login"
                variant="outline"
                colorScheme="pink"
                size="lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log In
              </MotionButton>
            </HStack>
          </VStack>
        </Container>
      </MotionBox>

      <Box py={16} bg={bg}>
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <Heading as="h2" size="2xl" color="brand.500" textAlign="center">
              Why Choose CycleSyNC?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {[
                {
                  icon: FaHeartbeat,
                  title: 'Cycle Tracking',
                  description: 'Monitor your menstrual cycle with precision.',
                },
                {
                  icon: FaCalendarAlt,
                  title: 'Symptom Logging',
                  description: 'Log daily symptoms to spot patterns.',
                },
                {
                  icon: FaChartLine,
                  title: 'Predictions',
                  description: 'Get accurate period and ovulation predictions.',
                },
                {
                  icon: FaUser,
                  title: 'Personalized Insights',
                  description: 'Tailored advice based on your data.',
                },
              ].map((feature, index) => (
                <MotionBox
                  key={index}
                  bg={cardBg}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  className="glow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  _hover={{ transform: 'translateY(-5px)', transition: '0.3s' }}
                >
                  <VStack spacing={4} align="start">
                    <Icon as={feature.icon} boxSize={10} color="brand.500" />
                    <Heading as="h3" size="md">
                      {feature.title}
                    </Heading>
                    <Text color={textColor}>{feature.description}</Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <MotionBox
        py={16}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="container.lg">
          <VStack spacing={6} textAlign="center">
            <Heading as="h2" size="2xl" color="brand.500">
              Our Mission
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl">
              At CycleSyNC, we empower you to take control of your reproductive health with a
              user-friendly platform that combines science and simplicity.
            </Text>
          </VStack>
        </Container>
      </MotionBox>

      <Box py={16} bg={bg}>
        <Container maxW="container.xl">
          <VStack spacing={10}>
            <Heading as="h2" size="2xl" color="brand.500" textAlign="center">
              What Users Say
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {[
                { name: 'Sarah', quote: 'CycleSyNC made tracking my cycle so easy!' },
                { name: 'Emma', quote: 'The predictions are spot-on.' },
                { name: 'Lily', quote: 'I love the intuitive design!' },
              ].map((testimonial, index) => (
                <MotionBox
                  key={index}
                  bg={cardBg}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  className="glow"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <Text color={textColor} mb={4}>
                    "{testimonial.quote}"
                  </Text>
                  <Text fontWeight="bold" color="brand.500">
                    — {testimonial.name}
                  </Text>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box bg="brand.500" py={8} color="white">
        <Container maxW="container.xl">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'center', md: 'start' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <VStack spacing={2} mb={{ base: 6, md: 0 }}>
              <Text fontSize="xl" fontWeight="bold">
                CycleSyNC 🫧
              </Text>
              <Text>Empowering your reproductive health.</Text>
            </VStack>
            <VStack spacing={2}>
              <Text fontWeight="bold">Links</Text>
              <Link to="/login">
                <Text _hover={{ color: 'brand.50' }}>Login</Text>
              </Link>
              <Link to="/register">
                <Text _hover={{ color: 'brand.50' }}>Sign Up</Text>
              </Link>
            </VStack>
            <VStack spacing={2}>
              <Text fontWeight="bold">Contact</Text>
              <Text>support@cyclesync.com</Text>
              <HStack spacing={4}>
                <Text>Twitter</Text>
                <Text>Instagram</Text>
              </HStack>
            </VStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;