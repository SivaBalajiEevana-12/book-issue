// components/Layout.js
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
// import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Flex minHeight="100vh">
      <Sidebar />
      <Box flex="1" bg="blue.200" p="6">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
