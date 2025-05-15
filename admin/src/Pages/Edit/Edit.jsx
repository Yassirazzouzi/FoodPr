
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Edit.css';
import assets from '../../assets/assets';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Salade',
    image: null,
    details: {
      ingredients: [],
      preparation: '',
      calories: '',
      time: '',
      allergenes: [],
      benefits: ''
    }
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergene, setNewAllergene] = useState('');
  const [initialData, setInitialData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const categoryOptions = [
    'Salade', 'Rolls', 'Desserts', 'Sandwich', 'Cake', 'Pure veg', 'Pasta', 'Noodles'
  ];

  useEffect(() => {
    fetchFood();
  }, [id]);

  useEffect(() => {
    if (initialData) {
      setHasChanges(JSON.stringify(formData) !== JSON.stringify(initialData));
    }
  }, [formData, initialData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const fetchFood = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/foods/${id}`);
      const food = res.data;
      const formatted = {
        name: food.name || '',
        description: food.description || '',
        category: food.category || 'Salade',
        image: null,
        details: {
          ingredients: food.details?.ingredients || [],
          preparation: food.details?.preparation || '',
          calories: food.details?.calories || '',
          time: food.details?.time || '',
          allergenes: food.details?.allergenes || [],
          benefits: food.details?.benefits || ''
        }
      };
      setFormData(formatted);
      setInitialData(formatted);
      if (food.imageUrl) {
        const url = food.imageUrl.startsWith('/')
          ? `http://localhost:4000${food.imageUrl}`
          : new URL(food.imageUrl, 'http://localhost:4000').toString();
        setImagePreview(url);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement du produit');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('details.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          ingredients: [...prev.details.ingredients, newIngredient.trim()]
        }
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        ingredients: prev.details.ingredients.filter((_, i) => i !== index)
      }
    }));
  };

  const addAllergene = () => {
    if (newAllergene.trim()) {
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          allergenes: [...prev.details.allergenes, newAllergene.trim()]
        }
      }));
      setNewAllergene('');
    }
  };

  const removeAllergene = (index) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        allergenes: prev.details.allergenes.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('ingredients', JSON.stringify(formData.details.ingredients));
      formDataToSend.append('preparation', formData.details.preparation);
      formDataToSend.append('calories', parseInt(formData.details.calories) || 0);
      formDataToSend.append('time', parseInt(formData.details.time) || 0);
      formDataToSend.append('allergenes', JSON.stringify(formData.details.allergenes));
      formDataToSend.append('benefits', formData.details.benefits);
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.put(
        `http://localhost:4000/api/foods/${id}`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        alert('Produit modifié avec succès!');
        navigate('/list');
      } else {
        throw new Error(response.data.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleNext = () => {
    if (activeTab === 'basic') {
      setActiveTab('details');
    }
  };

  return (
    <div className="edit-container">
      {loading ? (
        <p className="loading">Chargement...</p>
      ) : (
        <div className="product-form-container">
          <h2>Modifier un produit</h2>
          
          {error && <p className="error">{error}</p>}
          
          <div className="tabs">
            <button 
              type="button" 
              className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`} 
              onClick={() => handleTabChange('basic')}
            >
              Informations de base
            </button>
            <button 
              type="button" 
              className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} 
              onClick={() => handleTabChange('details')}
            >
              Détails nutritionnels
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'basic' && (
              <div className="tab-content basic-info">
                <div className="form-section">
                  <h3>Image du produit</h3>
                  <div className="image-upload-container">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Aperçu du produit" />
                        <button 
                          type="button" 
                          className="change-image-btn" 
                          onClick={() => document.getElementById('imageInput').click()}
                        >
                          Changer l'image
                        </button>
                      </div>
                    ) : (
                      <div className="image-placeholder" onClick={() => document.getElementById('imageInput').click()}>
                        <div className="placeholder-icon">
                          <i className="fa fa-image"></i>
                          <p>Cliquez pour sélectionner une image</p>
                        </div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      id="imageInput" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Nom du produit</h3>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Entrez le nom du produit"
                    className="form-input"
                  />
                </div>

                <div className="form-section">
                  <h3>Catégorie</h3>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="form-select"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-section">
                  <h3>Description du produit</h3>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    placeholder="Décrivez votre produit..."
                    className="form-textarea"
                  />
                </div>

                <div className="button-group">
                  <button type="button" className="back-button" onClick={() => navigate('/list')}>
                    Retour
                  </button>
                  <button type="button" className="next-button" onClick={handleNext}>
                    Suivant: Détails nutritionnels
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="tab-content details-info">
                <div className="form-section">
                  <h3>Ingrédients</h3>
                  <div className="input-with-button">
                    <input 
                      type="text" 
                      value={newIngredient} 
                      onChange={(e) => setNewIngredient(e.target.value)}
                      placeholder="Entrez un ingrédient et appuyez +"
                      className="form-input"
                    />
                    <button type="button" className="add-button" onClick={addIngredient}>
                      Ajouter
                    </button>
                  </div>
                  {formData.details.ingredients.length > 0 && (
                    <ul className="tags-list">
                      {formData.details.ingredients.map((ing, i) => (
                        <li key={i} className="tag-item">
                          {ing}
                          <button 
                            type="button" 
                            className="remove-tag" 
                            onClick={() => removeIngredient(i)}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-section">
                  <h3>Préparation</h3>
                  <textarea 
                    name="details.preparation" 
                    value={formData.details.preparation} 
                    onChange={handleChange}
                    placeholder="Décrivez les étapes de préparation..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-section">
                  <h3>Calories</h3>
                  <input 
                    type="number" 
                    name="details.calories" 
                    value={formData.details.calories} 
                    onChange={handleChange}
                    placeholder="ex: 120 kcal"
                    className="form-input"
                  />
                </div>

                <div className="form-section">
                  <h3>Temps de préparation</h3>
                  <input 
                    type="number" 
                    name="details.time" 
                    value={formData.details.time} 
                    onChange={handleChange}
                    placeholder="ex: 15 min"
                    className="form-input"
                  />
                </div>

                <div className="form-section">
                  <h3>Allergènes</h3>
                  <div className="input-with-button">
                    <input 
                      type="text" 
                      value={newAllergene} 
                      onChange={(e) => setNewAllergene(e.target.value)}
                      placeholder="Entrez un allergène et appuyez +"
                      className="form-input"
                    />
                    <button type="button" className="add-button" onClick={addAllergene}>
                      Ajouter
                    </button>
                  </div>
                  {formData.details.allergenes.length > 0 && (
                    <ul className="tags-list">
                      {formData.details.allergenes.map((a, i) => (
                        <li key={i} className="tag-item">
                          {a}
                          <button 
                            type="button" 
                            className="remove-tag" 
                            onClick={() => removeAllergene(i)}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-section">
                  <h3>Bénéfices nutritionnels</h3>
                  <textarea 
                    name="details.benefits" 
                    value={formData.details.benefits} 
                    onChange={handleChange}
                    placeholder="Décrivez les bénéfices nutritionnels..."
                    className="form-textarea"
                  />
                </div>

                <div className="button-group">
                  <button type="button" className="back-button" onClick={() => setActiveTab('basic')}>
                    Retour
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Modification...' : 'Modifier le produit'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Edit;