import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flex,
  Text,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { logout } from '../api/api';
import { getRefreshToken, clearAuthToken } from '../api/auth';
import { motion } from 'framer-motion';

interface NavbarProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.800', 'white');

  const handleLogout = async () => {
    try {
      await logout(getRefreshToken() || '');
      clearAuthToken();
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bg={bg}
        color={color}
        boxShadow="md"
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="1000"
        className="glow"
      >
        <Flex align="center">
          <Link to="/">
            <Text fontSize="2xl" fontWeight="bold" color="brand.500">
              CycleSyNC 🫧
            </Text>
          </Link>
        </Flex>

        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <Link to="/dashboard">
            <Button variant="link" color="brand.500">
              Home
            </Button>
          </Link>
          <Link to="/calendar">
            <Button variant="link" color="brand.500">
              Calendar
            </Button>
          </Link>
          <Link to="/daily-log">
            <Button variant="link" color="brand.500">
              Daily Log
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="link" color="brand.500">
              Profile
            </Button>
          </Link>
          <Button colorScheme="pink" onClick={handleLogout}>
            Logout
          </Button>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </HStack>

        <IconButton
          display={{ base: 'flex', md: 'none' }}
          icon={<HamburgerIcon />}
          aria-label="Open menu"
          onClick={() => {}}
        />
      </Flex>
    </motion.div>
  );
};

export default Navbar;