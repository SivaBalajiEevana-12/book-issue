"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Grid,
  GridItem,
  useToast,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  Alert,
  AlertIcon,
  Text,
} from "@chakra-ui/react"
import Layout from "./components/Layout"

function Main() {
  const toast = useToast()
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [books, setBooks] = useState([])
  const [quantities, setQuantities] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [bookingData, setBookingData] = useState({
    bdCode: "",
    irFormNo: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Fetch books from API
  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3300/books")

      if (!response.ok) {
        throw new Error("Failed to fetch books")
      }

      const booksData = await response.json()
      setBooks(booksData)

      // Initialize quantities object
      const initialQuantities = {}
      booksData.forEach((book) => {
        initialQuantities[book._id] = 0
      })
      setQuantities(initialQuantities)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching books:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUserChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setBookingData({
      ...bookingData,
      [name]: value,
    })
  }

  const handleQuantityChange = (bookId, value) => {
    setQuantities({
      ...quantities,
      [bookId]: Number.parseInt(value) || 0,
    })
  }

  // Calculate totals
  const calculateTotalAmount = () => {
    return books.reduce((total, book) => {
      const quantity = quantities[book._id] || 0
      return total + book.rate * quantity
    }, 0)
  }

  const calculateTotalBooks = () => {
    return Object.values(quantities).reduce((total, qty) => total + qty, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!userData.name || !userData.phone) {
      toast({
        title: "Required fields missing",
        description: "Please fill in name and phone number",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Check if any books are selected
    const selectedBooks = books.filter((book) => quantities[book._id] > 0)
    if (selectedBooks.length === 0) {
      toast({
        title: "No books selected",
        description: "Please select at least one book with quantity > 0",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setSubmitting(true)

      // First create/get user (you'll need to implement this endpoint)
      const userResponse = await fetch("http://localhost:3300/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!userResponse.ok) {
        throw new Error("Failed to create user")
      }

      const user = await userResponse.json()

      // Prepare books data for booking
      const booksToBook = selectedBooks.map((book) => ({
        bookId: book._id,
        quantity: quantities[book._id],
      }))

      // Submit booking
      const bookingResponse = await fetch("http://localhost:3300/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.data._id,
          books: booksToBook,
        }),
      })

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking")
      }

      const bookingResult = await bookingResponse.json()

      toast({
        title: "Booking successful!",
        description: `${selectedBooks.length} books booked successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      // Reset form
      setUserData({ name: "", email: "", phone: "" })
      setBookingData({
        bdCode: "",
        irFormNo: "",
        date: new Date().toISOString().split("T")[0],
      })
      const resetQuantities = {}
      books.forEach((book) => {
        resetQuantities[book._id] = 0
      })
      setQuantities(resetQuantities)
    } catch (err) {
      console.error("Error submitting booking:", err)
      toast({
        title: "Booking failed",
        description: err.message || "An error occurred while processing your booking",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
          <Text ml={4}>Loading books...</Text>
        </Flex>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading books: {error}
          <Button ml={4} onClick={fetchBooks} size="sm">
            Retry
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Layout>
    <Container maxW="container.xl" py={8}>
      <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md" bg="white">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box textAlign="center" pb={4}>
            <Heading as="h1" size="lg" textTransform="uppercase">
              HARE KRISHNA MOVEMENT VISAKHAPATNAM
            </Heading>
            <Heading as="h2" size="md" textTransform="uppercase" mt={2}>
              SRILA PRABHUPADA BOOK MARATHON - 2024-2025
            </Heading>
          </Box>

          {/* User Details Section */}
          <Box as="form" onSubmit={handleSubmit}>
            <Heading as="h3" size="md" mb={4}>
              User Details
            </Heading>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" value={userData.name} onChange={handleUserChange} placeholder="Enter full name" />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleUserChange}
                    placeholder="Enter email address"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="phone"
                    value={userData.phone}
                    onChange={handleUserChange}
                    placeholder="Enter phone number"
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Divider my={6} />

            {/* Booking Form Header */}
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4} mb={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>BD Code</FormLabel>
                  <Input name="bdCode" value={bookingData.bdCode} onChange={handleBookingChange} />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>I R Form No.</FormLabel>
                  <Input name="irFormNo" value={bookingData.irFormNo} onChange={handleBookingChange} />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input name="date" type="date" value={bookingData.date} onChange={handleBookingChange} />
                </FormControl>
              </GridItem>
            </Grid>

            {/* Book Table */}
            <Box overflowX="auto">
              <Table variant="simple" size="sm" borderWidth={1}>
                <Thead bg="gray.100">
                  <Tr>
                    <Th textAlign="center">Sl No</Th>
                    <Th>Book Name</Th>
                    <Th isNumeric>Price (₹)</Th>
                    <Th textAlign="center">Quantity</Th>
                    <Th isNumeric>Total (₹)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {books.map((book, index) => (
                    <Tr key={book._id}>
                      <Td textAlign="center">{index + 1}</Td>
                      <Td>{book.name}</Td>
                      <Td isNumeric>₹{book.rate}</Td>
                      <Td>
                        <NumberInput
                          value={quantities[book._id] || 0}
                          onChange={(value) => handleQuantityChange(book._id, value)}
                          min={0}
                          max={1000}
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
                      <Td isNumeric>₹{(book.rate * (quantities[book._id] || 0)).toFixed(2)}</Td>
                    </Tr>
                  ))}
                  <Tr fontWeight="bold" bg="gray.50">
                    <Td colSpan={3} textAlign="right">
                      TOTAL BOOKS: {calculateTotalBooks()}
                    </Td>
                    <Td textAlign="right">TOTAL AMOUNT:</Td>
                    <Td isNumeric>₹{calculateTotalAmount().toFixed(2)}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Flex justify="flex-end" mt={6}>
              <Button colorScheme="blue" type="submit" size="lg" isLoading={submitting} loadingText="Submitting...">
                Submit Booking
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Box>
    </Container>
    </Layout>
  )
}

export default Main
