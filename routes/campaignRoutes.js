import express from 'express';
import {
  getCampaigns,
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/all', protect, admin, getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', protect, admin, createCampaign);
router.put('/:id', protect, admin, updateCampaign);
router.delete('/:id', protect, admin, deleteCampaign);

export default router;