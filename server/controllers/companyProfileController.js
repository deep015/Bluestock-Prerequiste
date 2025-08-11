// File: /backend/src/controllers/companyProfileController.js

const companyModel = require('../models/companyProfileModel');
const userModel = require('../models/userModel');
const cloudinary = require('../utils/cloudinary'); 

/**
 * Handles the registration of a new company profile.
 * This route is protected by a JWT. The user's ID is retrieved from the token.
 */
exports.registerCompany = async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    const { name, address, city, state, country, postal_code, website, industry } = req.body;
    
    // Check if a company profile already exists for this user
    const existingCompany = await companyModel.findByOwnerId(owner_id);
    if (existingCompany) {
      return res.status(409).json({ message: 'Company profile already exists for this user.' });
    }

    const newCompany = await companyModel.create({
      owner_id,
      name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      industry,
    });

    res.status(201).json({
      message: 'Company profile registered successfully.',
      company: newCompany
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Fetches the company profile details for the authenticated user.
 */
exports.getCompanyProfile = async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    const companyProfile = await companyModel.findByOwnerId(owner_id);

    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found.' });
    }

    res.status(200).json({
      message: 'Company profile fetched successfully.',
      company: companyProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the company profile details for the authenticated user.
 */
exports.updateCompanyProfile = async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    const updatedData = req.body;
    
    const updatedCompany = await companyModel.update(owner_id, updatedData);

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company profile not found.' });
    }

    res.status(200).json({
      message: 'Company profile updated successfully.',
      company: updatedCompany
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Uploads a company logo to Cloudinary and saves the URL.
 */
exports.uploadCompanyLogo = async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    // Check if a file was uploaded by multer middleware
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // This is the key change: we need to get a URL from the upload,
    // not pass the file object directly to the model.
    // Assuming a placeholder function or Cloudinary utility that returns a URL.
    const logoUrl = await cloudinary.uploadToCloudinary(req.file.buffer, 'company-logos');

    const updatedProfile = await companyModel.updateLogoUrl(owner_id, logoUrl);

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Company profile not found.' });
    }

    res.status(200).json({
      message: 'Company logo uploaded and updated successfully.',
      company: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Uploads a company banner to Cloudinary and saves the URL.
 */
exports.uploadCompanyBanner = async (req, res, next) => {
  try {
    const owner_id = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const banner_url = await cloudinary.uploadToCloudinary(req.file.buffer, 'banners');
    const updatedCompany = await companyModel.updateBannerUrl(owner_id, banner_url);

    res.status(200).json({
      message: 'Company banner uploaded successfully.',
      banner_url: updatedCompany.banner_url
    });
  } catch (error) {
    next(error);
  }
};
