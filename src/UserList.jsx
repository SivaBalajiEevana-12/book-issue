import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Spinner,
  Text,
  Container
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Layout from './components/Layout';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://book-issue-server-110406681774.europe-west1.run.app/users'); // your API route
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/booking?userId=${userId}`);
  };

  return (
    <Layout>
    <Container maxW="container.md" py={8}>
      <Heading size="lg" mb={4}>User List</Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : users.length === 0 ? (
        <Text>No users found.</Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr
                  key={user._id}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onClick={() => handleUserClick(user._id)}
                >
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phone}</Td>
                  <Td>{new Date(user.createdAt).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Container>
    </Layout>
  );
};

export default UserList;
