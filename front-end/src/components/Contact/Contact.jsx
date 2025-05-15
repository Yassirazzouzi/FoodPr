import React, { useState, useContext } from 'react';
import './Contact.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';

const Contact = () => {
  const { url } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${url}/api/contact/save`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setSubmitted(true);
        // Réinitialiser le formulaire après 3 secondes
        setTimeout(() => {
          setFormData({
            nom: '',
            email: '',
            sujet: '',
            message: ''
          });
          setSubmitted(false);
        }, 3000);
      } else {
        setError(response.data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError(err.response?.data?.message || 'Impossible d\'envoyer le message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contactez-nous</h1>
        <p>Nous sommes à votre écoute pour toute question ou suggestion</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Notre adresse</h3>
              <p>123 Rue de la Gastronomie, 75000 Paris</p>
            </div>
          </div>
          
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <div>
              <h3>Téléphone</h3>
              <p>+33 1 23 45 67 89</p>
            </div>
          </div>
          
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>contact@tomato.com</p>
            </div>
          </div>
          
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <div>
              <h3>Horaires d'ouverture</h3>
              <p>Lun-Ven: 9h-18h | Sam-Dim: 10h-16h</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form">
          {submitted ? (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <h3>Message envoyé avec succès!</h3>
              <p>Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input 
                  type="text" 
                  id="nom" 
                  name="nom" 
                  value={formData.nom} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="sujet">Sujet</label>
                <input 
                  type="text" 
                  id="sujet" 
                  name="sujet" 
                  value={formData.sujet} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;