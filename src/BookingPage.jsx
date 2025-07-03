import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Spinner,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Container,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import Layout from './components/Layout';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`https://book-issue-server-110406681774.europe-west1.run.app/booking?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId]);

  const totalBooks = bookings.reduce((sum, b) => sum + b.quantityBooked, 0);
  const totalAmount = bookings.reduce((sum, b) => {
    const rate = b.rate || b.bookId?.rate || 0;
    return sum + (b.totalPrice || b.quantityBooked * rate);
  }, 0);

  return (
    <Layout>
      <Container maxW="container.lg" py={8}>
        <Heading size="lg" mb={4}>Bookings for User</Heading>

        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        ) : bookings.length === 0 ? (
          <Text>No bookings found.</Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="blue" size="sm">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Book Name</Th>
                  <Th isNumeric>Rate (₹)</Th>
                  <Th isNumeric>Quantity</Th>
                  <Th isNumeric>Total (₹)</Th>
                  <Th>Status</Th>
                  <Th>Booked At</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bookings.map((b, index) => {
                  const rate = b.rate || b.bookId?.rate || 0;
                  const total = b.totalPrice || b.quantityBooked * rate;

                  return (
                    <Tr key={b._id}>
                      <Td>{index + 1}</Td>
                      <Td>{b.bookId?.name || 'Unknown Book'}</Td>
                      <Td isNumeric>₹{rate}</Td>
                      <Td isNumeric>{b.quantityBooked}</Td>
                      <Td isNumeric>₹{total}</Td>
                      <Td>{b.status || 'N/A'}</Td>
                      <Td>{new Date(b.bookedAt).toLocaleString()}</Td>
                    </Tr>
                  );
                })}

                <Tr fontWeight="bold" bg="gray.100">
                  <Td colSpan={3}>Total</Td>
                  <Td isNumeric>{totalBooks}</Td>
                  <Td isNumeric>₹{totalAmount.toFixed(2)}</Td>
                  <Td colSpan={2}></Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default BookingPage;
