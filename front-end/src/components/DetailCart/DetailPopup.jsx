import React, { useState, useEffect, useContext } from 'react';
import './DetailPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const DetailPopup = ({ food, onClose }) => {
  const [foodDetails, setFoodDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { url } = useContext(StoreContext);
  
  // Récupérer les détails du plat depuis la base de données
  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (!food || !food._id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${url}/api/foods/${food._id}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails');
        }
        
        const data = await response.json();
        console.log("Détails récupérés de la base de données:", data);
        setFoodDetails(data.food);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoodDetails();
  }, [food, url]);
  
  // Fonction pour construire l'URL de l'image
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return assets.default_food;
    }
    
    if (imagePath.startsWith('/uploads/')) {
      return `${url}${imagePath}`;
    } else {
      return `${url}/uploads/${imagePath}`;
    }
  };

  // Utiliser les détails récupérés ou les données de base si non disponibles
  const displayData = foodDetails || food;

  return (
    <div className="detail-container">
      <div className="detail-overlay" onClick={onClose}></div>
      <div className="detail-content">
        <div className="detail-close" onClick={onClose}>
          <img src={assets.cross_icon} alt="Fermer" />
        </div>
        
        {loading ? (
          <div className="loading">Chargement des détails...</div>
        ) : (
          <>
            <div className="detail-image-container">
              <img 
                src={getImageUrl(displayData?.imageUrl || displayData?.image)} 
                alt={displayData?.name} 
                className="detail-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = assets.default_food;
                }}
              />
              <div className="detail-tag">{displayData?.category || 'Populaire'}</div>
            </div>
            
            <div className="detail-info">
              <div className="detail-header">
                <h2 className="detail-title">{displayData?.name}</h2>
                <div className="detail-rating">
                  <img src={assets.rating_starts} alt="Évaluation" />
                  <span>(124 avis)</span>
                </div>
              </div>
              
              <div className="detail-description">
                <h3>Description</h3>
                <p>{displayData?.description}</p>
              </div>
              
              {displayData?.details ? (
                <>
                  <div className="detail-ingredients">
                    <h3>Ingrédients</h3>
                    <ul>
                      {displayData.details.ingredients && displayData.details.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="detail-preparation">
                    <h3>Préparation</h3>
                    <p>{displayData.details.preparation}</p>
                  </div>
                  
                  <div className="detail-info-grid">
                    <div className="detail-info-item">
                      <h4>Calories</h4>
                      <p>{displayData.details.calories}</p>
                    </div>
                    <div className="detail-info-item">
                      <h4>Temps de préparation</h4>
                      <p>{displayData.details.time}</p>
                    </div>
                  </div>
                  
                  {displayData.details.allergenes && displayData.details.allergenes.length > 0 && (
                    <div className="detail-allergenes">
                      <h3>Allergènes</h3>
                      <div className="allergenes-tags">
                        {displayData.details.allergenes.map((allergene, index) => (
                          <span key={index} className="allergene-tag">{allergene}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {displayData.details.benefits && (
                    <div className="detail-benefits">
                      <h3>Bienfaits</h3>
                      <p>{displayData.details.benefits}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="detail-ingredients">
                  <h3>Ingrédients</h3>
                  <ul>
                    <li>Ingrédient 1</li>
                    <li>Ingrédient 2</li>
                    <li>Ingrédient 3</li>
                    <li>Ingrédient 4</li>
                  </ul>
                </div>
              )}
              
              <div className="detail-actions">
                <button className="back-btn" onClick={onClose}>
                  Retour
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailPopup;
