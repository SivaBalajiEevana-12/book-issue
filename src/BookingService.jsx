// API service functions for booking system

export const createUser = async (userData) => {
  try {
    const response = await fetch("https://book-server-production-aa37.up.railway.app/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error("Failed to create user")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const fetchBooks = async () => {
  try {
    const response = await fetch("https://book-server-production-aa37.up.railway.app/books")

    if (!response.ok) {
      throw new Error("Failed to fetch books")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching books:", error)
    throw error
  }
}

export const createBooking = async (userId, books) => {
  try {
    const response = await fetch("https://book-server-production-aa37.up.railway.app/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        books,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create booking")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export const getBookings = async (userId) => {
  try {
    const response = await fetch(`/bookings?userId=${userId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch bookings")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching bookings:", error)
    throw error
  }
}
