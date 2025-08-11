// File: /backend/src/tests/companyProfileController.test.js

const httpMocks = require('node-mocks-http');
const companyController = require('../controllers/companyProfileController');
const companyModel = require('../models/companyModel');
const cloudinary = require('../utils/cloudinary');

// Mock all external dependencies
jest.mock('../models/companyModel');
jest.mock('../utils/cloudinary');

describe('Company Profile Controller', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mock call counts and implementations before each test
    jest.clearAllMocks();

    // Create a mock request, response, and next function for each test
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    // Mock a user ID from a decoded JWT, which the auth middleware would add
    req.user = { id: 1 };
  });

  describe('registerCompany', () => {
    it('should register a new company profile successfully', async () => {
      // Mock request body
      req.body = {
        name: 'Test Company',
        address: '123 Test St',
        city: 'Test City',
        industry: 'Tech',
      };

      // Mock dependencies' responses
      companyModel.findByOwnerId.mockResolvedValue(null);
      companyModel.create.mockResolvedValue({ id: 1, ...req.body, owner_id: 1 });

      await companyController.registerCompany(req, res, next);

      // Verify that the necessary functions were called with the correct arguments
      expect(companyModel.findByOwnerId).toHaveBeenCalledWith(1);
      expect(companyModel.create).toHaveBeenCalledWith({
        owner_id: 1,
        name: 'Test Company',
        address: '123 Test St',
        city: 'Test City',
        state: undefined,
        country: undefined,
        postal_code: undefined,
        website: undefined,
        industry: 'Tech',
      });

      // Verify the response status and JSON payload
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        message: 'Company profile registered successfully.',
        company: { id: 1, ...req.body, owner_id: 1 },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 409 status if a company profile already exists', async () => {
      req.body = { name: 'Existing Company' };

      // Mock a pre-existing company profile for the owner
      companyModel.findByOwnerId.mockResolvedValue({ id: 1, name: 'Existing Company' });

      await companyController.registerCompany(req, res, next);

      // Verify the response
      expect(res.statusCode).toBe(409);
      expect(res._getJSONData()).toEqual({ message: 'Company profile already exists for this user.' });
      expect(companyModel.create).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getCompanyProfile', () => {
    it('should return a company profile successfully', async () => {
      const mockCompany = { id: 1, name: 'Test Company', owner_id: 1 };
      companyModel.findByOwnerId.mockResolvedValue(mockCompany);

      await companyController.getCompanyProfile(req, res, next);

      expect(companyModel.findByOwnerId).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: 'Company profile fetched successfully.',
        company: mockCompany,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 404 status if the company profile is not found', async () => {
      companyModel.findByOwnerId.mockResolvedValue(null);

      await companyController.getCompanyProfile(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: 'Company profile not found.' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('updateCompanyProfile', () => {
    it('should update a company profile successfully', async () => {
      req.body = { website: 'http://updated.com' };
      const updatedCompany = { id: 1, name: 'Test Company', owner_id: 1, website: 'http://updated.com' };
      companyModel.update.mockResolvedValue(updatedCompany);

      await companyController.updateCompanyProfile(req, res, next);

      expect(companyModel.update).toHaveBeenCalledWith(1, req.body);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: 'Company profile updated successfully.',
        company: updatedCompany,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 404 status if the company profile to update is not found', async () => {
      req.body = { website: 'http://updated.com' };
      companyModel.update.mockResolvedValue(null);

      await companyController.updateCompanyProfile(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: 'Company profile not found.' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('uploadCompanyLogo', () => {
    it('should upload a logo successfully and return the new URL', async () => {
      req.file = { buffer: Buffer.from('mock-logo-data') };
      const mockLogoUrl = 'https://cloudinary.com/mock-logo.png';
      const updatedCompany = { id: 1, logo_url: mockLogoUrl };

      cloudinary.uploadToCloudinary.mockResolvedValue(mockLogoUrl);
      companyModel.updateLogoUrl.mockResolvedValue(updatedCompany);

      await companyController.uploadCompanyLogo(req, res, next);

      expect(cloudinary.uploadToCloudinary).toHaveBeenCalledWith(req.file.buffer, 'logos');
      expect(companyModel.updateLogoUrl).toHaveBeenCalledWith(1, mockLogoUrl);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: 'Company logo uploaded successfully.',
        logo_url: mockLogoUrl,
      });
    });

    it('should return a 400 status if no file is uploaded', async () => {
      req.file = undefined;

      await companyController.uploadCompanyLogo(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'No file uploaded.' });
      expect(cloudinary.uploadToCloudinary).not.toHaveBeenCalled();
    });
  });

  describe('uploadCompanyBanner', () => {
    it('should upload a banner successfully and return the new URL', async () => {
      req.file = { buffer: Buffer.from('mock-banner-data') };
      const mockBannerUrl = 'https://cloudinary.com/mock-banner.png';
      const updatedCompany = { id: 1, banner_url: mockBannerUrl };

      cloudinary.uploadToCloudinary.mockResolvedValue(mockBannerUrl);
      companyModel.updateBannerUrl.mockResolvedValue(updatedCompany);

      await companyController.uploadCompanyBanner(req, res, next);

      expect(cloudinary.uploadToCloudinary).toHaveBeenCalledWith(req.file.buffer, 'banners');
      expect(companyModel.updateBannerUrl).toHaveBeenCalledWith(1, mockBannerUrl);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: 'Company banner uploaded successfully.',
        banner_url: mockBannerUrl,
      });
    });

    it('should return a 400 status if no file is uploaded', async () => {
      req.file = undefined;

      await companyController.uploadCompanyBanner(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'No file uploaded.' });
      expect(cloudinary.uploadToCloudinary).not.toHaveBeenCalled();
    });
  });
});
