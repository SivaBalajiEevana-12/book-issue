"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "./components/Layout";

const ReturnBook = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [bookings, setBookings] = useState([]);
  const [returnQty, setReturnQty] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://book-issue-server-110406681774.europe-west1.run.app/booking?userId=${userId}`);
      const data = await res.json();

      setBookings(data);

      const initial = {};
      data.forEach(b => {
        initial[b._id] = b.quantityReturned || 0;
      });
      setReturnQty(initial);
    } catch (err) {
      toast({ status: 'error', title: 'Error fetching bookings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, value) => {
    setReturnQty(prev => ({
      ...prev,
      [id]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const updates = bookings.map(b => {
        const returned = returnQty[b._id];
        const sold = b.quantityBooked - returned;
        const rate = b.rate || b.bookId?.rate || 0;
        const total = sold * rate;

        return {
          bookingId: b._id,
          quantityReturned: returned,
          totalPrice: total
        };
      });

      for (let update of updates) {
        await fetch(`https://book-issue-server-110406681774.europe-west1.run.app/booking/${update.bookingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        });
      }

      toast({
        title: 'Returns submitted successfully',
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      await fetchBookings();

      // ✅ Reset return values to zero
      const resetQuantities = {};
      bookings.forEach(b => {
        resetQuantities[b._id] = 0;
      });
      setReturnQty(resetQuantities);

    } catch (err) {
      console.error('Submit error', err);
      toast({
        title: 'Error updating returns',
        status: 'error',
        duration: 5000
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
        <Layout>
      <Container py={10}>
        <Spinner size="lg" />
        <Text ml={4}>Loading issued books...</Text>
      </Container>
      </Layout>
    );
  }

  const totalBooksSold = bookings.reduce((sum, b) => {
    const returned = returnQty[b._id] || 0;
    return sum + (b.quantityBooked - returned);
  }, 0);

  const totalAmount = bookings.reduce((sum, b) => {
    const returned = returnQty[b._id] || 0;
    const sold = b.quantityBooked - returned;
    const rate = b.rate || b.bookId?.rate || 0;
    return sum + sold * rate;
  }, 0);

  return (
    <Layout>
    <Container maxW="container.lg" py={8}>
      <Heading size="lg" mb={6}>Return Unsold Books</Heading>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>#</Th>
              <Th>Book</Th>
              <Th isNumeric>Issued</Th>
              <Th isNumeric>Returned</Th>
              <Th isNumeric>Sold</Th>
              <Th isNumeric>Rate (₹)</Th>
              <Th isNumeric>Total (₹)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((b, idx) => {
              const returned = returnQty[b._id] || 0;
              const sold = b.quantityBooked - returned;
              const rate = b.rate || b.bookId?.rate || 0;
              const total = sold * rate;

              return (
                <Tr key={b._id}>
                  <Td>{idx + 1}</Td>
                  <Td>{b.bookId?.name || 'Unknown'}</Td>
                  <Td isNumeric>{b.quantityBooked}</Td>
                  <Td isNumeric>
                    <NumberInput
                      min={0}
                      max={b.quantityBooked}
                      value={returned}
                      onChange={(v) => handleChange(b._id, v)}
                      size="sm"
                      width="80px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Td>
                  <Td isNumeric>{sold}</Td>
                  <Td isNumeric>₹{rate}</Td>
                  <Td isNumeric>₹{total}</Td>
                </Tr>
              );
            })}

            <Tr fontWeight="bold" bg="gray.50">
              <Td colSpan={4}>Total</Td>
              <Td isNumeric>{totalBooksSold}</Td>
              <Td></Td>
              <Td isNumeric>₹{totalAmount.toFixed(2)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Button
        colorScheme="green"
        mt={6}
        onClick={handleSubmit}
        isLoading={submitting}
        loadingText="Submitting..."
      >
        Submit Returns
      </Button>
    </Container>
    </Layout>
  );
};

export default ReturnBook;
