import express from 'express';
import {
  createDonation,
  getUserDonations,
  getAllDonations,
  updateDonationStatus,
  getDonationStats,
  createPaymentIntent
} from '../controllers/donationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent); // Naya route
router.post('/', protect, createDonation);
router.get('/my-donations', protect, getUserDonations);
router.get('/stats', protect, admin, getDonationStats);
router.get('/', protect, admin, getAllDonations);
router.put('/:id/status', protect, admin, updateDonationStatus);

export default router;