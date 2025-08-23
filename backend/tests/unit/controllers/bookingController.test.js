jest.mock('../../../src/websocket.js', () => ({
  broadcastMessage: jest.fn(),
  initWebSocket: jest.fn()
}));

import { 
  createBooking, 
  getUserBookings, 
  getBookingById, 
  cancelBooking,
  getTotalBookingCount
} from '../../../src/controllers/bookingController.js';
import Booking from '../../../src/models/bookingModel.js';
import ShowtimeSeats from '../../../src/models/showtimeSeatsModel.js';
import Showtime from '../../../src/models/showtimeModel.js';
import { mockRequest, mockResponse, clearAllMocks } from '../../utils/mockHelpers.js';
import { testBookings } from '../../fixtures/testData.js';
import { broadcastMessage } from '../../../src/websocket.js';

// Mock dependencies
jest.mock('../../../src/models/bookingModel.js');
jest.mock('../../../src/models/showtimeSeatsModel.js');
jest.mock('../../../src/models/showtimeModel.js');
jest.mock('../../../src/services/emailService.js', () => ({
  sendBookingConfirmationEmail: jest.fn().mockResolvedValue(true)
}));

describe('Booking Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    clearAllMocks();
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      req.user = { _id: 'userId123' };
      req.body = {
        showtimeId: 'showtimeId123',
        showtimeSeatIds: ['seatId1', 'seatId2']
      };

      const mockSeats = [
        { _id: 'seatId1', seatNumber: 'A1', status: 'available', showtime: 'showtimeId123' },
        { _id: 'seatId2', seatNumber: 'A2', status: 'available', showtime: 'showtimeId123' }
      ];

      const mockShowtime = {
        _id: 'showtimeId123',
        movie: { title: 'Test Movie' },
        price: 12.5
      };

      const mockBooking = {
        _id: 'bookingId123',
        user: req.user._id,
        showtime: 'showtimeId123',
        showtimeSeatIds: req.body.showtimeSeatIds,
        bookingId: 'BK123456',
        bookingStatus: 'confirmed',
        paymentStatus: 'completed',
        totalPrice: 25
      };

      ShowtimeSeats.find.mockResolvedValue(mockSeats);
      Showtime.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockShowtime)
      });

      // Mock Booking.create to return a booking with _id
      Booking.create.mockResolvedValue({
        _id: 'bookingId123',
        ...mockBooking
      });

      // Mock Booking.findById for the populate chain after creation
      const finalPopulate = jest.fn().mockResolvedValue(mockBooking);
      const secondPopulate = jest.fn().mockReturnValue({ populate: finalPopulate });
      const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
      
      Booking.findById.mockReturnValue({
        populate: firstPopulate
      });

      ShowtimeSeats.updateMany.mockResolvedValue({ acknowledged: true });

      await createBooking(req, res);

      expect(ShowtimeSeats.find).toHaveBeenCalled();
      expect(Showtime.findById).toHaveBeenCalledWith('showtimeId123');
      expect(Booking.create).toHaveBeenCalled();
      expect(ShowtimeSeats.updateMany).toHaveBeenCalled();
      expect(broadcastMessage).toHaveBeenCalledWith({
        type: 'SEAT_UPDATE',
        showtimeId: req.body.showtimeId,
        seatIds: req.body.showtimeSeatIds,
        status: 'booked'
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle booking creation errors', async () => {
      req.user = { _id: 'userId123' };
      req.body = {}; // Missing required fields

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Showtime and selected seats are required'
      });
    });
  });

  describe('getUserBookings', () => {
    it('should return user bookings', async () => {
      req.user = { _id: 'userId123' };
      const mockBookings = [
        { _id: 'booking1', bookingId: 'BK001' },
        { _id: 'booking2', bookingId: 'BK002' }
      ];

      const sortMock = jest.fn().mockResolvedValue(mockBookings);
      const populateChain = {
        populate: jest.fn().mockReturnThis(),
        sort: sortMock
      };

      Booking.find.mockReturnValue({
        populate: jest.fn().mockReturnValue(populateChain)
      });

      await getUserBookings(req, res);

      expect(Booking.find).toHaveBeenCalledWith({ user: req.user._id });
      expect(res.json).toHaveBeenCalledWith(mockBookings);
    });

    it('should handle errors when fetching bookings', async () => {
      req.user = { _id: 'userId123' };
      Booking.find.mockImplementation(() => {
        throw new Error('Database error');
      });

      await getUserBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });

  describe('getBookingById', () => {
    it('should return booking by ID', async () => {
      req.params = { id: 'bookingId123' };
      req.user = { _id: 'userId123' };

      const mockBooking = {
        _id: 'bookingId123',
        user: { _id: 'userId123' },
        bookingId: 'BK123456'
      };

      // Create a proper populate chain mock
      const finalPopulate = jest.fn().mockResolvedValue(mockBooking);
      const secondPopulate = jest.fn().mockReturnValue({ populate: finalPopulate });
      const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
      
      Booking.findById.mockReturnValue({
        populate: firstPopulate
      });

      await getBookingById(req, res);

      expect(Booking.findById).toHaveBeenCalledWith('bookingId123');
      expect(res.json).toHaveBeenCalledWith(mockBooking);
    });

    it('should return 404 if booking not found', async () => {
      req.params = { id: 'nonexistentId' };
      req.user = { _id: 'userId123' };

      // Create a proper populate chain mock that returns null
      const finalPopulate = jest.fn().mockResolvedValue(null);
      const secondPopulate = jest.fn().mockReturnValue({ populate: finalPopulate });
      const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
      
      Booking.findById.mockReturnValue({
        populate: firstPopulate
      });

      await getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking not found'
      });
    });

    it('should return 403 if user is not authorized', async () => {
      req.params = { id: 'bookingId123' };
      req.user = { _id: 'differentUserId' };

      const mockBooking = {
        _id: 'bookingId123',
        user: { _id: 'userId123' },
        bookingId: 'BK123456'
      };

      // Create a proper populate chain mock
      const finalPopulate = jest.fn().mockResolvedValue(mockBooking);
      const secondPopulate = jest.fn().mockReturnValue({ populate: finalPopulate });
      const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
      
      Booking.findById.mockReturnValue({
        populate: firstPopulate
      });

      await getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized to view this booking'
      });
    });
  });

  describe('cancelBooking', () => {
    it('should cancel booking successfully', async () => {
      req.params = { id: 'bookingId123' };
      req.user = { _id: 'userId123' };

      const mockBooking = {
        _id: 'bookingId123',
        user: 'userId123',
        bookingStatus: 'confirmed',
        showtime: 'showtimeId123',
        showtimeSeatIds: ['seatId1', 'seatId2'],
        save: jest.fn().mockResolvedValue(true)
      };

      Booking.findById.mockResolvedValue(mockBooking);
      ShowtimeSeats.updateMany.mockResolvedValue({ acknowledged: true });

      await cancelBooking(req, res);

      expect(mockBooking.bookingStatus).toBe('cancelled');
      expect(mockBooking.save).toHaveBeenCalled();
      expect(ShowtimeSeats.updateMany).toHaveBeenCalled();
      expect(broadcastMessage).toHaveBeenCalledWith({
        type: 'SEAT_UPDATE',
        showtimeId: mockBooking.showtime,
        seatIds: mockBooking.showtimeSeatIds,
        status: 'available'
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking cancelled successfully'
      });
    });

    it('should not cancel already cancelled booking', async () => {
      req.params = { id: 'bookingId123' };
      req.user = { _id: 'userId123' };

      const mockBooking = {
        _id: 'bookingId123',
        user: 'userId123',
        bookingStatus: 'cancelled'
      };

      Booking.findById.mockResolvedValue(mockBooking);

      await cancelBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Booking is already cancelled'
      });
    });
  });

  describe('getTotalBookingCount', () => {
    it('should return total booking count', async () => {
      Booking.countDocuments.mockResolvedValue(100);

      await getTotalBookingCount(req, res);

      expect(Booking.countDocuments).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ count: 100 });
    });

    it('should handle count errors', async () => {
      Booking.countDocuments.mockRejectedValue(new Error('Database error'));

      await getTotalBookingCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });
  });
});