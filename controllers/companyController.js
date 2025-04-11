const Company = require('../models/Company');

// Mock company data
const mockCompanies = [
  {
    name: 'Microsoft',
    description: 'Global technology company that develops software, consumer electronics, and computers.',
    website: 'https://microsoft.com',
    location: 'Redmond, WA',
    industry: 'Technology',
    size: '10000+',
    jobCount: 150
  },
  {
    name: 'Apple',
    description: 'Technology company that designs and develops consumer electronics, software, and services.',
    website: 'https://apple.com',
    location: 'Cupertino, CA',
    industry: 'Technology',
    size: '10000+',
    jobCount: 200
  },
  {
    name: 'Amazon',
    description: 'E-commerce and technology company focusing on e-commerce, cloud computing, and artificial intelligence.',
    website: 'https://amazon.com',
    location: 'Seattle, WA',
    industry: 'Technology/Retail',
    size: '10000+',
    jobCount: 300
  },
  {
    name: 'Google',
    description: 'Technology company specializing in internet-related services and products.',
    website: 'https://google.com',
    location: 'Mountain View, CA',
    industry: 'Technology',
    size: '10000+',
    jobCount: 250
  },
  {
    name: 'Meta',
    description: 'Technology company focusing on social networking, virtual reality, and metaverse technologies.',
    website: 'https://meta.com',
    location: 'Menlo Park, CA',
    industry: 'Technology',
    size: '10000+',
    jobCount: 180
  },
  {
    name: 'Netflix',
    description: 'Streaming media and video-on-demand company.',
    website: 'https://netflix.com',
    location: 'Los Gatos, CA',
    industry: 'Entertainment/Technology',
    size: '10000+',
    jobCount: 100
  },
  {
    name: 'Tesla',
    description: 'Electric vehicle and clean energy company.',
    website: 'https://tesla.com',
    location: 'Austin, TX',
    industry: 'Automotive/Technology',
    size: '10000+',
    jobCount: 120
  }
];

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ user: req.user.id });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a company
// @route   POST /api/companies
// @access  Private
const createCompany = async (req, res) => {
  try {
    const company = new Company({
      ...req.body,
      user: req.user.id,
    });
    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Search companies from mock data
// @route   GET /api/companies/search
// @access  Private
const searchCompanies = async (req, res) => {
  try {
    const query = req.query.q.toLowerCase();
    
    // Filter companies based on the search query
    const results = mockCompanies.filter(company => 
      company.name.toLowerCase().includes(query) ||
      company.description.toLowerCase().includes(query) ||
      company.industry.toLowerCase().includes(query) ||
      company.location.toLowerCase().includes(query)
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error searching companies',
      error: error.message 
    });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCompanies,
  createCompany,
  searchCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
}; 