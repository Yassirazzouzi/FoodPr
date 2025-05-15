import express from 'express';

import { 
  addFood, 
  getAllFoods, 
  getFoodById, 
  updateFood, 
  deleteFood, 
  getFoodsByCategory 
} from '../controllers/foodController.js';
import multer from 'multer';

import { protect, admin } from '../middleware/middlware.js';

const router = express.Router();

// Configuration de multer pour le téléchargement des images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez JPG, PNG ou WEBP.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite à 5MB
  fileFilter: fileFilter
});

// Routes pour les plats
// Routes publiques
router.get('/all', getAllFoods);
router.get('/category/:category', getFoodsByCategory);

// Routes spécifiques d'abord
router.post('/add', upload.single('image'), addFood);
router.put('/:id', upload.single('image'), updateFood);
router.delete('/:id', deleteFood);

// Route générique avec paramètre en dernier
router.get('/:id', getFoodById);

// Version sécurisée (à utiliser plus tard)
// router.post('/add', protect, admin, upload.single('image'), addFood);
// router.put('/:id', protect, admin, upload.single('image'), updateFood);
// router.delete('/:id', protect, admin, deleteFood);

export default router;
