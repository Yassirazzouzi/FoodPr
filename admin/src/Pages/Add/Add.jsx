import React, { useState } from 'react';
import './Add.css';
import axios from 'axios';
import assets from '../../assets/assets';

const Add = () => {
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
  
    name: '',
    description: '',
    category: 'Salade',
    image: null,
    
    
    ingredients: [],
    preparation: '',
    calories: '',
    time: '',
    allergenes: [],
    benefits: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergene, setNewAllergene] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    
    if (file && file.size > 10 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      e.target.value = '';
      return;
    }
  
  
    if (file && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Format d'image non supporté. Utilisez JPG, PNG ou WEBP.");
      e.target.value = '';
      return;
    }
  
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addIngredient = () => {
    if (newIngredient.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };
  
  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };
  
  const addAllergene = () => {
    if (newAllergene.trim() !== '') {
      setFormData(prev => ({
        ...prev, 
        allergenes: [...prev.allergenes, newAllergene.trim()]
      }));
      setNewAllergene('');
    }
  };
  
  const removeAllergene = (index) => {
    setFormData(prev => ({
      ...prev,
      allergenes: prev.allergenes.filter((_, i) => i !== index)
    }));
  };
  const url= "http://localhost:4000"

  // Add this validation function
  const validateForm = () => {
    const errors = [];

    if (formData.name.trim().length < 3) {
      errors.push("Le nom du produit doit contenir au moins 3 caractères");
    }

    if (formData.description.trim().length < 10) {
      errors.push("La description doit être plus détaillée (au moins 10 caractères)");
    }

    if (!formData.image) {
      errors.push("Une image est requise");
    }

    if (formData.ingredients.length === 0) {
      errors.push("Ajoutez au moins un ingrédient");
    }

    if (!formData.preparation.trim()) {
      errors.push("Les instructions de préparation sont requises");
    }

    return errors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
 
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      

      const detailsData = {
        ingredients: formData.ingredients,
        preparation: formData.preparation,
        calories: formData.calories,
        time: formData.time,
        allergenes: formData.allergenes,
        benefits: formData.benefits
      };
      

      formDataToSend.append('details', JSON.stringify(detailsData));
      
      console.log('Données envoyées:', Object.fromEntries(formDataToSend));
      
      const response = await axios.post(`${url}/api/foods/add`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201 || response.status === 200) {
        alert('Produit ajouté avec succès!');
        // Réinitialise le formulaire
        setFormData({
          name: '',
          description: '',
          category: 'Salade',
          image: null,
          ingredients: [],
          preparation: '',
          calories: '',
          time: '',
          allergenes: [],
          benefits: ''
        });
        setImagePreview(null);
        setActiveTab('basic');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Erreur lors de l'ajout: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: "Salade", label: "Salade" },
    { value: "Rolls", label: "Rolls" },
    { value: "Desserts", label: "Desserts" }, // Currently "Deserts" in assets.js
    { value: "Sandwich", label: "Sandwich" },
    { value: "Cake", label: "Cake" },
    { value: "Pure veg", label: "Pure veg" }, // Currently "Pure Veg" in assets.js
    { value: "Pasta", label: "Pasta" },
    { value: "Noodles", label: "Noodles" }
  ];
  
  return (
    <div className="add-container">
      <h2 className="add-title">Ajouter un nouveau produit</h2>
      
      <div className="tabs-container">
        <div className="tab-buttons">
          <button 
            type="button"
            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`} 
            onClick={() => setActiveTab('basic')}
          >
            Informations de base
          </button>
          <button 
            type="button"
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} 
            onClick={() => setActiveTab('details')}
          >
            Détails nutritionnels
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="add-form">
        {activeTab === 'basic' ? (
          // Onglet Informations de base
          <>
            <div className="add-form-section">
              <div className="add-img-upload">
                <label className="form-label">Image du produit</label>
                <div className="upload-area">
                  <label htmlFor="image" className="upload-label">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Aperçu" className="image-preview" />
                    ) : (
                      <>
                        <img src={assets.upload_area} alt="" className="upload-icon" />
                        <span className="upload-text">Cliquez pour sélectionner une image</span>
                      </>
                    )}
                  </label>
                  <input 
                    type="file" 
                    name="image" 
                    id="image" 
                    className="file-input" 
                    required 
                    accept="image/*"
                    onChange={handleImageChange} 
                  />
                </div>
              </div>
            </div>
            
            <div className="add-form-section form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nom du produit</label>
                <input 
                  type="text" 
                  id="name"
                  name="name" 
                  className="form-control"
                  placeholder="Entrez le nom du produit" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category" className="form-label">Catégorie</label>
                <select 
                  id="category"
                  name="category" 
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="add-form-section">
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description du produit</label>
                <textarea 
                  id="description"
                  name="description" 
                  className="form-control"
                  rows="5" 
                  placeholder="Décrivez votre produit ici..." 
                  value={formData.description}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={1000}
                ></textarea>
              </div>
            </div>
          </>
        ) : (
          // Onglet Détails nutritionnels
          <>
            <div className="add-form-section">
              <div className="form-group">
                <label className="form-label">Ingrédients</label>
                <div className="tags-input-container">
                  <div className="tags-input-wrapper">
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Entrez un ingrédient et appuyez sur Ajouter" 
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                    />
                    <button 
                      type="button" 
                      className="add-tag-btn"
                      onClick={addIngredient}
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  <div className="tags-list">
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="tag-item">
                        <span>{ingredient}</span>
                        <button 
                          type="button" 
                          className="remove-tag-btn"
                          onClick={() => removeIngredient(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="add-form-section">
              <div className="form-group">
                <label htmlFor="preparation" className="form-label">Préparation</label>
                <textarea 
                  id="preparation"
                  name="preparation" 
                  className="form-control"
                  rows="4" 
                  placeholder="Décrivez les étapes de préparation..." 
                  value={formData.preparation}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            <div className="add-form-section form-grid">
              <div className="form-group">
                <label htmlFor="calories" className="form-label">Calories</label>
                <input 
                  type="text" 
                  id="calories"
                  name="calories" 
                  className="form-control"
                  placeholder="ex: 120 kcal"
                  value={formData.calories}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time" className="form-label">Temps de préparation</label>
                <input 
                  type="text" 
                  id="time"
                  name="time" 
                  className="form-control"
                  placeholder="ex: 15 min" 
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="add-form-section">
              <div className="form-group">
                <label className="form-label">Allergènes</label>
                <div className="tags-input-container">
                  <div className="tags-input-wrapper">
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Entrez un allergène et appuyez sur Ajouter" 
                      value={newAllergene}
                      onChange={(e) => setNewAllergene(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergene())}
                    />
                    <button 
                      type="button" 
                      className="add-tag-btn"
                      onClick={addAllergene}
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  <div className="tags-list">
                    {formData.allergenes.map((allergene, index) => (
                      <div key={index} className="tag-item">
                        <span>{allergene}</span>
                        <button 
                          type="button" 
                          className="remove-tag-btn"
                          onClick={() => removeAllergene(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="add-form-section">
              <div className="form-group">
                <label htmlFor="benefits" className="form-label">Bienfaits nutritionnels</label>
                <textarea 
                  id="benefits"
                  name="benefits" 
                  className="form-control"
                  rows="3" 
                  placeholder="Décrivez les bienfaits nutritionnels..." 
                  value={formData.benefits}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </>
        )}
        
        <div className="add-form-actions">
          {activeTab === 'basic' ? (
            <div className="form-navigation">
              <button 
                type="button" 
                className="next-btn"
                onClick={() => setActiveTab('details')}
              >
                Suivant: Détails nutritionnels
              </button>
            </div>
          ) : (
            <div className="form-navigation">
              <button 
                type="button" 
                className="back-btn"
                onClick={() => setActiveTab('basic')}
              >
                Retour
              </button>
              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Ajout en cours...</span>
                  </>
                ) : 'Ajouter le produit'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Add;