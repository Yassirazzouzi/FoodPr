import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="Logo du site" className="footer-logo" />
                <p>Nous proposons une expérience culinaire exceptionnelle avec des plats savoureux et un service de qualité.</p>
                <div className="footer-social-icons">
                    <a href="#" aria-label="Facebook"><img src={assets.facebook_icon} alt="Facebook" /></a>    
                    <a href="#" aria-label="Twitter"><img src={assets.twitter_icon} alt="Twitter" /></a>    
                    <a href="#" aria-label="LinkedIn"><img src={assets.linkedin_icon} alt="LinkedIn" /></a>    
                </div>
            </div>
            <div className="footer-content-center">
                <h2>ENTREPRISE</h2>
                <ul>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/about">À propos</a></li>
                    <li><a href="/delivery">Livraison</a></li>
                    <li><a href="/privacy">Politique de confidentialité</a></li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>CONTACTEZ-NOUS</h2>
                <ul>
                    <li><a href="tel:+212-07-13-23-97-20">+212-07-13-23-97-20</a></li>
                    <li><a href="mailto:contact@khadija.com">contact@khadija.com</a></li>
                    <li><a href="https://khadija.com" target="_blank" rel="noopener noreferrer">khadija.com</a></li>
                    <li><address>123 Rue Principale, Casablanca, Maroc</address></li>
                </ul>
            </div>
        </div>
        <hr/>
        <p className='footer-copyright'>&copy; Copyright {currentYear} Khadija.com - Tous droits réservés</p>
    </footer>
  )
}

export default Footer
