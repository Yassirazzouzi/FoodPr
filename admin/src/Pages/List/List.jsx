import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './List.css';

const List = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/foods/all');
     
      const foodsData = Array.isArray(response.data) ? response.data : response.data.foods || [];
      setFoods(foodsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching foods:', err);
      setError('Erreur lors du chargement des produits');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`http://localhost:4000/api/foods/${id}`);
        setFoods(foods.filter(food => food._id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };
  
  const renderProducts = () => {
    if (!Array.isArray(foods) || foods.length === 0) {
      return <div className="no-products">
        <i className="fas fa-utensils" style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }}></i>
        <p>Aucun produit trouvé</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Ajoutez votre premier produit en cliquant sur le bouton ci-dessus</p>
      </div>;
    }

    return foods.map((food) => (
      <div key={food._id} className="product-card">
        <img 
          src={`http://localhost:4000${food.imageUrl}`} 
          alt={food.name} 
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
          }}
        />
        <div className="product-info">
          <h3>{food.name}</h3>
          <p className="category">{food.category}</p>
          <p className="description">
            {food.description ? (food.description.length > 100 ? food.description.substring(0, 100) + '...' : food.description) : 'Pas de description'}
          </p>
          <div className="product-details">
            <span><i className="fas fa-fire" style={{ color: '#ff6b6b' }}></i> Calories: {food.details?.calories || 'N/A'}</span>
            <span><i className="fas fa-clock" style={{ color: '#4dabf7' }}></i> Temps: {food.details?.time || 'N/A'}</span>
            <span><i className="fas fa-euro-sign" style={{ color: '#40c057' }}></i> Prix: {food.price ? `${food.price} €` : 'N/A'}</span>
          </div>
        </div>
        <div className="product-actions">
          <Link to={`/edit/${food._id}`} className="edit-button">
            <i className="fas fa-edit"></i> Modifier
          </Link>
          <button 
            onClick={() => handleDelete(food._id)} 
            className="delete-button"
          >
            <i className="fas fa-trash-alt"></i> Supprimer
          </button>
        </div>
      </div>
    ));
  };

  if (loading) return <div className="loading">
    <div className="spinner" style={{ marginBottom: '1rem' }}></div>
    Chargement des produits...
  </div>;
  
  if (error) return <div className="error">
    <i className="fas fa-exclamation-circle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
    <p>{error}</p>
  </div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Liste des Produits</h2>
        <Link to="/add" className="add-button">
          <i className="fas fa-plus"></i> Ajouter un produit
        </Link>
      </div>

      <div className="products-grid">
        {renderProducts()}
      </div>
    </div>
  );
};

export default List;
