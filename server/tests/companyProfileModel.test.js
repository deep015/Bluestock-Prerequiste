// File: /backend/src/tests/companyProfileModel.test.js

const pool = require('../config/db');
const companyModel = require('../models/companyModel');

// Mock the entire db pool module to control database behavior
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('Company Profile Model', () => {
  beforeEach(() => {
    // Clear all mock call counts and implementations before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new company profile and return the data', async () => {
      const mockCompanyData = {
        owner_id: 1,
        name: 'Test Company',
        address: '123 Main St',
        city: 'Techville',
        country: 'USA',
        industry: 'Software',
      };
      const mockResult = { rows: [{ id: 1, ...mockCompanyData }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await companyModel.create(mockCompanyData);

      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        mockCompanyData.owner_id,
        mockCompanyData.name,
        mockCompanyData.address,
        mockCompanyData.city,
        undefined, // state
        mockCompanyData.country,
        undefined, // postal_code
        undefined, // website
        mockCompanyData.industry,
      ]);
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findByOwnerId', () => {
    it('should find a company profile by ownerId', async () => {
      const mockCompany = { id: 1, owner_id: 1, name: 'Test Company' };
      const mockResult = { rows: [mockCompany] };
      pool.query.mockResolvedValue(mockResult);

      const result = await companyModel.findByOwnerId(1);

      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
      expect(result).toEqual(mockCompany);
    });

    it('should return undefined if no company profile is found', async () => {
      const mockResult = { rows: [] };
      pool.query.mockResolvedValue(mockResult);

      const result = await companyModel.findByOwnerId(99);

      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [99]);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a company profile and return the updated data', async () => {
      const updatedData = { website: 'https://new-site.com', city: 'Updated City' };
      const mockUpdatedCompany = { id: 1, owner_id: 1, ...updatedData };
      const mockResult = { rows: [mockUpdatedCompany] };
      pool.query.mockResolvedValue(mockResult);

      const result = await companyModel.update(1, updatedData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE company_profile SET website = $2, city = $3'),
        [1, 'https://new-site.com', 'Updated City']
      );
      expect(result).toEqual(mockUpdatedCompany);
    });
  });

  describe('updateLogoUrl', () => {
    it('should update the company logo URL', async () => {
      const mockLogoUrl = 'https://cloudinary.com/new-logo.png';
      const mockUpdatedCompany = { id: 1, owner_id: 1, logo_url: mockLogoUrl };
      const mockResult = { rows: [mockUpdatedCompany] };
      pool.query.mockResolvedValue(mockResult);

      const result = await companyModel.updateLogoUrl(1, mockLogoUrl);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE company_profile SET logo_url = $1'),
        [mockLogoUrl, 1]
      );
      expect(result).toEqual(mockUpdatedCompany);
    });
  });

  describe('updateBannerUrl', () => {
    it('should update the company banner URL', async () => {
      const mockBannerUrl = 'https://cloudinary.com/new-banner.png';
      const mockUpdatedCompany = { id: 1, owner_id: 1, banner_url: mockBannerUrl };
      const mockResult = { rows: [mockUpdatedCompany] };
      pool.query.mockResolvedValue(mockResult);

      const result = await companyModel.updateBannerUrl(1, mockBannerUrl);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE company_profile SET banner_url = $1'),
        [mockBannerUrl, 1]
      );
      expect(result).toEqual(mockUpdatedCompany);
    });
  });
});
