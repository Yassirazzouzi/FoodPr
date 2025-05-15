import React from 'react'
import { assets } from '../../assets/assets'
import './FoodItems.css'

const FoodItems = ({id, name, description, image, category, openDetail, url}) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return assets.default_food;
    }
    
    // Vérifiez si le chemin commence déjà par /uploads/
    if (imagePath.startsWith('/uploads/')) {
      return `${url}${imagePath}`; // Ne pas ajouter /uploads/ si déjà présent
    } else {
      return `${url}/uploads/${imagePath}`; // Ajouter /uploads/ si nécessaire
    }
  }

  const handleDetailClick = () => {
    if (openDetail) {
      const food = {
        _id: id,
        name,
        description,
        image,
        category,
        url
      }
      openDetail(food)
    }
  }
  
  return (
    <div className='food-items'>
      <div className="food-item-img-container">
        <img 
          className='food-item-image' 
          src={getImageUrl(image)}
          alt={name}
          onError={(e) => {
            console.log(`Erreur de chargement de l'image: ${image}`);
            e.target.onerror = null;
            e.target.src = assets.default_food;
          }}
        />
        <div className="food-item-tag">{category || 'Populaire'}</div>
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Évaluation" />
        </div>
        <p className="food-item-desc">
          {description}
        </p>
        <div className="food-item-footer">
          <button 
            className="view-details-btn"
            onClick={handleDetailClick}
          >
            Voir détails
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodItems
