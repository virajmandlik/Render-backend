const Job = require('../models/Job');
const moment = require('moment');

// @desc    Get job application statistics
// @route   GET /api/statistics
// @access  Private
const getStatistics = async (req, res) => {
  try {
    // Get total applications
    const totalApplications = await Job.countDocuments({ user: req.user.id });

    // Get applications this month
    const startOfMonth = moment().startOf('month').toDate();
    const monthlyApplications = await Job.countDocuments({
      user: req.user.id,
      createdAt: { $gte: startOfMonth },
    });

    // Get interviews scheduled
    const interviewsScheduled = await Job.countDocuments({
      user: req.user.id,
      status: 'Interview',
    });

    // Calculate response rate (responses / total applications)
    const responses = await Job.countDocuments({
      user: req.user.id,
      status: { $in: ['Interview', 'Offer', 'Rejected'] },
    });
    const responseRate = totalApplications ? Math.round((responses / totalApplications) * 100) : 0;

    // Get status distribution
    const statusAggregation = await Job.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statusDistribution = statusAggregation.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = moment().subtract(5, 'months').startOf('month').toDate();
    const monthlyTrendAggregation = await Job.aggregate([
      {
        $match: {
          user: req.user.id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyTrend = monthlyTrendAggregation.map(({ _id, count }) => ({
      month: moment().month(_id.month - 1).format('MMM'),
      count,
    }));

    res.json({
      totalApplications,
      monthlyApplications,
      interviewsScheduled,
      responseRate,
      statusDistribution,
      monthlyTrend,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStatistics,
}; 