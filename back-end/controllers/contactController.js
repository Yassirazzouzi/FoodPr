import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le dossier data où les fichiers seront stockés
const dataDir = path.join(__dirname, '..', 'data');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const saveContactMessage = async (req, res) => {
  try {
    // Vérifier si le corps de la requête existe
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Corps de la requête manquant"
      });
    }

    // Extraire les données du formulaire
    const { nom = '', email = '', sujet = '', message = '' } = req.body;
    
    // Validation des champs
    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis"
      });
    }

    // Créer le contenu du fichier
    const timestamp = new Date().toISOString();
    const fileName = `contact_${Date.now()}.txt`;
    const filePath = path.join(dataDir, fileName);
    
    const fileContent = `
Date: ${timestamp}
Nom: ${nom}
Email: ${email}
Sujet: ${sujet}
Message:
${message}
----------------------------------------
`;

    // Écrire dans le fichier
    fs.writeFileSync(filePath, fileContent);

    // Réponse de succès
    res.status(201).json({
      success: true,
      message: "Message enregistré avec succès",
      fileName
    });

  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'enregistrement du message",
      error: error.message
    });
  }
};