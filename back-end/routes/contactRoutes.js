import express from 'express';
import { saveContactMessage } from '../controllers/contactController.js';

const router = express.Router();

// Route pour enregistrer un message de contact
router.post('/save', saveContactMessage);

export default router;