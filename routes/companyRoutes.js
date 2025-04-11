const express = require('express');
const router = express.Router();
const {
  getCompanies,
  createCompany,
  searchCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getCompanies)
  .post(createCompany);

router.get('/search', searchCompanies);

router.route('/:id')
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

module.exports = router; 