import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react';
import Layout from './components/Layout';

const VerifyBookingPage = () => {
  const { id } = useParams(); // this is a bookingId
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [approvedIds, setApprovedIds] = useState(new Set());

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://book-issue-server-110406681774.europe-west1.run.app/admin/booking/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }

      setBookings(data);
    } catch (err) {
      setError(err.message || 'Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      const res = await fetch(`https://book-issue-server-110406681774.europe-west1.run.app/verify/${bookingId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Approval failed');
      }

      setApprovedIds((prev) => new Set(prev).add(bookingId));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (id) fetchBookings();
  }, [id]);

  return (
    <Layout>
      <Container maxW="lg" py={10}>
        <Heading size="lg" mb={6}>
          Verify Bookings
        </Heading>

        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert status="error" borderRadius="md" mb={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        ) : bookings.length === 0 ? (
          <Text>No bookings found.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {bookings.map((booking) => (
              <Box key={booking._id} p={4} borderWidth="1px" borderRadius="md">
                <HStack justify="space-between">
                  <Box>
                    <Text><strong>Book:</strong> {booking.bookId?.name}</Text>
                    <Text><strong>Rate:</strong> ₹{booking.rate}</Text>
                    <Text><strong>Quantity:</strong> {booking.quantityBooked}</Text>
                    <Text><strong>Total:</strong> ₹{booking.totalPrice}</Text>
                    <Text><strong>Status:</strong> {approvedIds.has(booking._id) || booking.status === 'approved' ? 'Approved' : 'Pending'}</Text>
                  </Box>

                  <Button
                    colorScheme="green"
                    isDisabled={approvedIds.has(booking._id) || booking.status === 'approved'}
                    onClick={() => handleApprove(booking._id)}
                  >
                    Approve
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        <Divider my={6} />

        <Button mt={4} colorScheme="blue" onClick={() => window.location.href = '/'}>
          Go to Home
        </Button>
      </Container>
    </Layout>
  );
};

export default VerifyBookingPage;
