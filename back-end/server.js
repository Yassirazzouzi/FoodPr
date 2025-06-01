// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import connectDB from './config/db.js';
import foodRoutes from './routes/foodRoute.js';
import UserRouter from './routes/userRoute.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler, notFound, rateLimiter } from './middleware/middlware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

// ✅ Connexion MongoDB
connectDB();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*', // 🚨 Remplace "*" par ton domaine exact si tu veux plus de sécurité
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Répertoires statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ✅ Crée le dossier "uploads" s’il n’existe pas
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Logs simples
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Rate Limiter
app.use(rateLimiter(100, 15 * 60 * 1000));

// ✅ Routes
app.use('/api/foods', foodRoutes);
app.use('/api/users', UserRouter);
app.use('/api/contact', contactRoutes);

// ✅ Favicon handler (évite l’erreur 502 sur /favicon.ico)
app.get('/favicon.ico', (req, res) => res.status(204));

// ✅ Page d’accueil
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ Middleware de gestion d'erreurs
app.use(notFound);
app.use(errorHandler);

// ✅ Démarrage du serveur : À appeler **une seule fois**
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
