export const testUsers = {
  validUser: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    mobile: '1234567890'
  },
  adminUser: {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@filmspot.com',
    password: 'AdminPass123!',
    mobile: '9876543210',
    role: 'admin'
  },
  invalidUser: {
    firstName: '',
    lastName: '',
    email: 'invalid-email',
    password: '123',
    mobile: ''
  }
};

export const testMovies = {
  validMovie: {
    title: 'The Test Movie',
    description: 'A movie created for testing purposes',
    releaseDate: new Date('2024-01-01'),
    duration: 120,
    genres: ['Action', 'Drama'],
    director: 'Test Director',
    cast: ['Actor 1', 'Actor 2', 'Actor 3'],
    moviePoster: 'https://example.com/poster.jpg',
    moviePosterHomepage: 'https://example.com/homepage-poster.jpg',
    trailerURL: 'https://youtube.com/watch?v=test',
    imdbRating: 8.5,
    rating: 'PG-13'
  },
  upcomingMovie: {
    title: 'Future Test Movie',
    description: 'A movie coming in the future',
    releaseDate: new Date('2025-12-01'),
    duration: 150,
    genres: ['Sci-Fi', 'Adventure'],
    director: 'Future Director',
    cast: ['Future Actor 1', 'Future Actor 2'],
    moviePoster: 'https://example.com/future-poster.jpg',
    moviePosterHomepage: 'https://example.com/future-homepage-poster.jpg',
    trailerURL: 'https://youtube.com/watch?v=future',
    imdbRating: 0,
    rating: 'R'
  }
};

export const testTheatres = {
  validTheatre: {
    name: 'Test Cinema Complex',
    location: 'Test City',
    address: '123 Test Street, Test City, TC 12345',
    facilities: ['Parking', 'Food Court', '3D'],
    contactNumber: '555-0123'
  }
};

export const testScreens = {
  validScreen: {
    screenNumber: 1,
    capacity: 200,
    screenType: 'Standard',
    features: ['Dolby Atmos', 'Recliner Seats']
  }
};

export const testSeats = {
  generateSeats: (rows, seatsPerRow) => {
    const seats = [];
    for (let row = 0; row < rows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C...
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        seats.push({
          row: rowLetter,
          number: seatNum,
          type: seatNum <= 3 || seatNum >= seatsPerRow - 2 ? 'premium' : 'standard',
          price: seatNum <= 3 || seatNum >= seatsPerRow - 2 ? 15 : 10
        });
      }
    }
    return seats;
  }
};

export const testShowtimes = {
  validShowtime: {
    showDate: new Date('2024-12-01'),
    showTime: '19:00',
    language: 'English',
    subtitles: true,
    is3D: false
  }
};

export const testBookings = {
  validBooking: {
    selectedSeats: ['A1', 'A2'],
    totalAmount: 25,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    transactionId: 'TEST-TXN-123456'
  }
};