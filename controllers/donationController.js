import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';


export const createDonation = async (req, res) => {
  try {
    const { amount, type, category, paymentMethod, campaignId } = req.body;

    const donationData = {
      user: req.user._id,
      amount,
      type,
      category,
      paymentMethod,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
    };

    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      donationData.campaign = campaignId;
    }

    const donation = await Donation.create(donationData);

    
    if (campaignId) {
      await Campaign.findByIdAndUpdate(campaignId, {
        $inc: { raisedAmount: amount }
      });
    }

    const populatedDonation = await Donation.findById(donation._id)
      .populate('user', 'name email')
      .populate('campaign', 'title');

    res.status(201).json(populatedDonation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('user', 'name email phone')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update donation status (Admin)
// @route   PUT /api/donations/:id/status
// @access  Private/Admin
export const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = status;
    await donation.save();

    const updatedDonation = await Donation.findById(donation._id)
      .populate('user', 'name email')
      .populate('campaign', 'title');

    res.json(updatedDonation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donation statistics (Admin)
// @route   GET /api/donations/stats
// @access  Private/Admin
export const getDonationStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const totalAmount = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const verifiedAmount = await Donation.aggregate([
      { $match: { status: 'Verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingAmount = await Donation.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalDonations,
      totalAmount: totalAmount[0]?.total || 0,
      verifiedAmount: verifiedAmount[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};