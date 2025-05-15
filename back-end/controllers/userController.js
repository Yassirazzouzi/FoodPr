import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    console.log('Registration attempt with data:', req.body);
    
    // Vérifier si req.body existe
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Corps de la requête manquant",
        error: "req.body est undefined"
      });
    }

    // Validation détaillée
    const { name, email, password } = req.body || {};
    const missingFields = [];

    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Champs manquants",
        details: `Les champs suivants sont requis: ${missingFields.join(', ')}`
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format d'email invalide"
      });
    }

    // Validation mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères"
      });
    }

    // Log full request for debugging
    console.log({
      headers: req.headers,
      body: req.body,
      contentType: req.get('Content-Type')
    });

    // Check if user exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email déjà utilisé"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Vérifier si req.body existe
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Corps de la requête manquant",
        error: "req.body est undefined"
      });
    }

    const { email, password } = req.body || {};
    
    // Vérifier si les champs sont présents
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message
    });
  }
};


// import userModel from '../models/userModel.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// export const registerUser = async (req, res) => {
//   try {
//     // Debug log (with sensitive data removed)
//     console.log('Register attempt:', {
//       contentType: req.headers['content-type']
//     });

//     // Check for request body issues
//     if (!req.body || Object.keys(req.body).length === 0) {
//       // Check if body is empty despite Content-Type being application/json
//       return res.status(400).json({
//         success: false,
//         message: "Corps de la requête manquant",
//         error: "Le corps de la requête est vide ou mal formaté"
//       });
//     }

//     // Extract data with default empty values to prevent undefined errors
//     const { name = '', email = '', password = '' } = req.body;
    
//     // Validation détaillée
//     const missingFields = [];

//     if (!name || name.trim() === '') missingFields.push('name');
//     if (!email || email.trim() === '') missingFields.push('email');
//     if (!password) missingFields.push('password');

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Champs manquants",
//         details: `Les champs suivants sont requis: ${missingFields.join(', ')}`
//       });
//     }

//     // Validation email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Format d'email invalide"
//       });
//     }

//     // Validation mot de passe
//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Le mot de passe doit contenir au moins 6 caractères"
//       });
//     }

//     // Log non-sensitive information for debugging
//     console.log({
//       contentType: req.get('Content-Type'),
//       bodyPresent: !!req.body,
//       bodySize: Object.keys(req.body).length
//     });

//     // Check if user exists
//     const userExists = await userModel.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: "Email déjà utilisé"
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const user = await userModel.create({
//       name: name.trim(),
//       email: email.trim().toLowerCase(),
//       password: hashedPassword
//     });

//     // Generate token
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET || 'default_secret_key',
//       { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
//     );

//     res.status(201).json({
//       success: true,
//       message: "Inscription réussie",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });

//   } catch (error) {
//     console.error("Erreur lors de l'inscription:", error);
//     res.status(500).json({
//       success: false,
//       message: "Erreur lors de l'inscription",
//       error: error.message
//     });
//   }
// };

// export const loginUser = async (req, res) => {
//   try {
//     // Check for request body issues
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Corps de la requête manquant",
//         error: "Le corps de la requête est vide ou mal formaté"
//       });
//     }

//     const { email = '', password = '' } = req.body;
    
//     // Vérifier si les champs sont présents
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email et mot de passe requis"
//       });
//     }

//     // Find user
//     const user = await userModel.findOne({ email: email.trim().toLowerCase() });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Email ou mot de passe incorrect"
//       });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Email ou mot de passe incorrect"
//       });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET || 'default_secret_key',
//       { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Connexion réussie",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });

//   } catch (error) {
//     console.error("Erreur lors de la connexion:", error);
//     res.status(500).json({
//       success: false,
//       message: "Erreur lors de la connexion",
//       error: error.message
//     });
//   }
// };

