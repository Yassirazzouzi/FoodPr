import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// Ajouter un nouveau plat
const addFood = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    const { name, description, category } = req.body;
    const details = typeof req.body.details === 'string' ? JSON.parse(req.body.details) : req.body.details;

    const newFood = new foodModel({
      name,
      description,
      category,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      details
    });

    const savedFood = await newFood.save();

    res.status(201).json({
      success: true,
      message: 'Produit ajouté avec succès',
      data: savedFood
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du produit',
      error: error.message
    });
  }
};

// Récupérer tous les plats
const getAllFoods = async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.status(200).json({
      success: true,
      count: foods.length,
      foods
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des plats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des plats",
      error: error.message
    });
  }
};

// Récupérer un plat par son ID
const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Plat non trouvé"
      });
    }
    res.status(200).json({
      success: true,
      food
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du plat:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du plat",
      error: error.message
    });
  }
};

// Mettre à jour un plat
const updateFood = async (req, res) => {
  try {
    // Get existing food first
    const existingFood = await foodModel.findById(req.params.id);
    if (!existingFood) {
      return res.status(404).json({
        success: false,
        message: "Plat non trouvé"
      });
    }

    // Prepare update data using existing values as fallbacks
    const updateData = {
      name: req.body.name || existingFood.name,
      description: req.body.description || existingFood.description,
      category: req.body.category || existingFood.category,
      details: {
        ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : existingFood.details.ingredients,
        preparation: req.body.preparation || existingFood.details.preparation,
        calories: req.body.calories || existingFood.details.calories,
        time: req.body.time || existingFood.details.time,
        allergenes: req.body.allergenes ? JSON.parse(req.body.allergenes) : existingFood.details.allergenes,
        benefits: req.body.benefits || existingFood.details.benefits
      }
    };

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (existingFood.imageUrl) {
        const oldImagePath = path.join(process.cwd(), 'public', existingFood.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update with validation disabled
    const updatedFood = await foodModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: false // Disable validation
      }
    );

    res.status(200).json({
      success: true,
      message: "Plat mis à jour avec succès",
      food: updatedFood
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du plat:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du plat",
      error: error.message
    });
  }
};

// Supprimer un plat
const deleteFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Plat non trouvé"
      });
    }

    if (food.imageUrl && food.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), 'public', food.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await foodModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Plat supprimé avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du plat:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du plat",
      error: error.message
    });
  }
};

// Récupérer les plats par catégorie
const getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foods = await foodModel.find({ category });

    res.status(200).json({
      success: true,
      count: foods.length,
      foods
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des plats par catégorie:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des plats par catégorie",
      error: error.message
    });
  }
};

export {
  addFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodsByCategory
};
