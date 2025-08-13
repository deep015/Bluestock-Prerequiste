
const request = require('supertest');
const express = require('express');
const companyRoutes = require('../routes/companyProfileRoutes');
const verifyToken = require('../middleware/authMiddleware');
const companyController = require('../controllers/companyProfileController');

const app = express();
app.use(express.json());

// Mock middleware and controller functions
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => {
  // Mock a valid token by attaching a user object to the request
  req.user = { id: 1, email: 'test@example.com' };
  next();
}));
jest.mock('../controllers/companyProfileController');

// The app will use the mocked route handlers
app.use('/api/v1/company', companyRoutes);

describe('Company Profile Routes', () => {
  beforeEach(() => {
    // Clear all mock call counts before each test
    jest.clearAllMocks();
  });

  describe('POST /api/v1/company/register', () => {
    it('should register a company with a valid token', async () => {
      // Mock the controller function to return a success response
      companyController.registerCompany.mockImplementation((req, res) => res.status(201).json({ message: 'Success' }));

      const response = await request(app)
        .post('/api/v1/company/register')
        .set('Authorization', 'Bearer mock-token')
        .send({ name: 'Test Company' });

      expect(response.statusCode).toBe(201);
      // Verify that the middleware was called and the controller was called
      expect(verifyToken).toHaveBeenCalled();
      expect(companyController.registerCompany).toHaveBeenCalled();
    });

    it('should return 401 if token is missing', async () => {
      // Temporarily mock the middleware to handle a missing token scenario
      verifyToken.mockImplementationOnce((req, res) => res.status(401).json({ message: 'Authorization token missing.' }));

      const response = await request(app)
        .post('/api/v1/company/register')
        .send({ name: 'Test Company' });

      expect(response.statusCode).toBe(401);
      // Verify that the controller was NOT called
      expect(companyController.registerCompany).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/company/getCompanyProfile', () => {
    it('should get a company profile with a valid token', async () => {
      companyController.getCompanyProfile.mockImplementation((req, res) => res.status(200).json({ message: 'Success' }));

      const response = await request(app)
        .get('/api/v1/company/getCompanyProfile')
        .set('Authorization', 'Bearer mock-token');

      expect(response.statusCode).toBe(200);
      expect(verifyToken).toHaveBeenCalled();
      expect(companyController.getCompanyProfile).toHaveBeenCalled();
    });
  });

  describe('PUT /api/v1/company/updateCompanyProfile', () => {
    it('should update a company profile with a valid token', async () => {
      companyController.updateCompanyProfile.mockImplementation((req, res) => res.status(200).json({ message: 'Success' }));

      const response = await request(app)
        .put('/api/v1/company/updateCompanyProfile')
        .set('Authorization', 'Bearer mock-token')
        .send({ name: 'Updated Name' });

      expect(response.statusCode).toBe(200);
      expect(verifyToken).toHaveBeenCalled();
      expect(companyController.updateCompanyProfile).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/company/uploadCompanyLogo', () => {
    it('should upload a company logo with a valid token', async () => {
      companyController.uploadCompanyLogo.mockImplementation((req, res) => res.status(200).json({ message: 'Success' }));
      
      const response = await request(app)
        .post('/api/v1/company/uploadCompanyLogo')
        .set('Authorization', 'Bearer mock-token')
        .attach('logo', 'tests/test-file.png'); // Attach a mock file

      expect(response.statusCode).toBe(200);
      expect(verifyToken).toHaveBeenCalled();
      expect(companyController.uploadCompanyLogo).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/company/uploadCompanyBanner', () => {
    it('should upload a company banner with a valid token', async () => {
      companyController.uploadCompanyBanner.mockImplementation((req, res) => res.status(200).json({ message: 'Success' }));

      const response = await request(app)
        .post('/api/v1/company/uploadCompanyBanner')
        .set('Authorization', 'Bearer mock-token')
        .attach('banner', 'tests/test-file.png'); // Attach a mock file
      
      expect(response.statusCode).toBe(200);
      expect(verifyToken).toHaveBeenCalled();
      expect(companyController.uploadCompanyBanner).toHaveBeenCalled();
    });
  });
});
