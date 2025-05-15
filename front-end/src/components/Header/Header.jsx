import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className='header'> 
      <div className="header-contents">
        <h2>
            Commandez vos plats préférés ici
        </h2>
        <p>
            Découvrez notre sélection de plats délicieux préparés avec des ingrédients frais et de qualité. Livraison rapide et service exceptionnel.
        </p>
        <div className="header-buttons">
          <button className="primary-btn">
              Voir le menu
          </button>
         
        </div>
      </div>
    </header>
  )
}

export default Header
