// src/components/Sidebar.js
import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken"); // Remove token or session data
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box
      width="250px"
      bg="gray.800"
      color="white"
      p="5"
      height="100vh"
      position="sticky"
      top="0"
    >
      <Text fontSize="2xl" fontWeight="bold" mb="6" textAlign="center">
        My Sidebar
      </Text>
      <VStack align="stretch" spacing="4">
        <Box
          as={Link}
          to="/"
          _hover={{ bg: "gray.700" }}
          p="3"
          borderRadius="md"
          cursor="pointer"
        >
         Book-Request
        </Box>
        <Box
          as={Link}
          to="/return-page"
          _hover={{ bg: "gray.700" }}
          p="3"
          borderRadius="md"
          cursor="pointer"
        >
         Return
        </Box>
    <Box
          as={Link}
          to="/users"
          _hover={{ bg: "gray.700" }}
          p="3"
          borderRadius="md"
          cursor="pointer"
        >
         Booking
        </Box>
        {/* Logout Button */}
        
      </VStack>
    </Box>
  );
};

export default Sidebar;
