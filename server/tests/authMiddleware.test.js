
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');

// Mock the jsonwebtoken library to control token behavior
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Auth Middleware', () => {
  let req, res, next;
  const mockUser = { id: 1, email: 'test@example.com' };

  beforeEach(() => {
    // Reset mock call counts and implementations before each test
    jest.clearAllMocks();

    // Create a mock request, response, and next function for each test
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should call next() and attach user data to the request for a valid token', () => {
    // Mock a valid JWT and the corresponding header
    const mockToken = 'mock-valid-token';
    req.headers.authorization = `Bearer ${mockToken}`;

    // Mock jwt.verify to call its callback with no error and a decoded user payload
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    verifyToken(req, res, next);

    // Verify that jwt.verify was called with the correct token
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String), expect.any(Function));
    // Verify that the user payload was attached to the request object
    expect(req.user).toEqual(mockUser);
    // Verify that the next middleware function was called
    expect(next).toHaveBeenCalled();
    // Ensure the response was not sent
    expect(res.statusCode).toBe(200);
  });

  it('should return a 401 status if the authorization token is missing', () => {
    // No authorization header on the request
    req.headers.authorization = undefined;

    verifyToken(req, res, next);

    // Verify that the response status is 401
    expect(res.statusCode).toBe(401);
    // Verify the JSON response message
    expect(res._getJSONData()).toEqual({ message: 'Authorization token missing.' });
    // Verify that next() was not called
    expect(next).not.toHaveBeenCalled();
    // Verify that jwt.verify was not called
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should return a 403 status if the token is invalid or expired', () => {
    // Mock an invalid JWT
    const mockToken = 'invalid-token';
    req.headers.authorization = `Bearer ${mockToken}`;

    // Mock jwt.verify to call its callback with an error
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('jwt malformed'), undefined);
    });

    verifyToken(req, res, next);

    // Verify the response status
    expect(res.statusCode).toBe(403);
    // Verify the JSON response message
    expect(res._getJSONData()).toEqual({ message: 'Invalid or expired token.' });
    // Verify that next() was not called
    expect(next).not.toHaveBeenCalled();
  });
});
