const express= require('express');
const router = express.Router();
const multer = require('multer');
const { registerCompany,
    getCompanyProfile,
    updateCompanyProfile,
    uploadCompanyLogo,
    uploadCompanyBanner}=require('../controllers/companyProfileController');

const verifyToken = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });
router.post('/register',verifyToken,registerCompany);

router.get('/getCompanyProfile',verifyToken,getCompanyProfile);
router.put('/updateCompanyProfile',verifyToken,updateCompanyProfile);
router.post('/uploadCompanyLogo',verifyToken, upload.single('logo'),uploadCompanyLogo);
router.post('/uploadCompanyBanner',verifyToken, upload.single('banner'),uploadCompanyBanner);

module.exports=router