import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['Salade', 'Rolls', 'Desserts', 'Sandwich', 'Cake', 'Pure veg', 'Pasta', 'Noodles']
  },
  details: {
    ingredients: [{
      type: String,
      trim: true
    }],
    preparation: {
      type: String,
      trim: true
    },
    calories: {
      type: String
    },
    time: {
      type: String
    },
    allergenes: [{
      type: String,
      trim: true
    }],
    benefits: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('Food', foodSchema);