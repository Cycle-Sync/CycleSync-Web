import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';
import './index.css';

// Custom Chakra theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#FFE6F0',
      100: '#FFCCE5',
      500: '#FF69B4',
      600: '#C2185B',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'linear-gradient(145deg, brand.50, white)',
        color: 'gray.800',
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);