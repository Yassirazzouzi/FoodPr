import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware pour gérer les erreurs
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Middleware pour protéger les routes (authentification)
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token du header
      token = req.headers.authorization.split(' ')[1];
      
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Ajouter l'utilisateur à la requête
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, aucun token fourni');
  }
};

// Middleware pour vérifier si l'utilisateur est administrateur
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Non autorisé, accès administrateur requis');
  }
};

// Middleware pour gérer les requêtes non trouvées
export const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware pour limiter les requêtes (rate limiting)
export const rateLimiter = (maxRequests, timeWindow) => {
  const requestCounts = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    
    // Nettoyer les anciennes entrées
    if (requestCounts.has(ip)) {
      const { count, startTime } = requestCounts.get(ip);
      
      if (currentTime - startTime > timeWindow) {
        requestCounts.set(ip, { count: 1, startTime: currentTime });
        return next();
      }
      
      if (count >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Trop de requêtes, veuillez réessayer plus tard'
        });
      }
      
      requestCounts.set(ip, { count: count + 1, startTime });
    } else {
      requestCounts.set(ip, { count: 1, startTime: currentTime });
    }
    
    next();
  };
};

// Middleware pour valider les données de requête
export const validateRequestBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    next();
  };
};