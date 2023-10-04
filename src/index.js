import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ChakraProvider>
    <App />
    </ChakraProvider>
    </Router>
);


