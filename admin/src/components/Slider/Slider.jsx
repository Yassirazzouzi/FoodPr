import React from 'react';
import assets from '../../assets/assets';
import './Slider.css';
import { NavLink } from 'react-router-dom';

const Slider = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={assets.logo || assets.add_icon} alt="Logo" />
          <h3>Dashboard</h3>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <h4 className="menu-category">Menu principal</h4>
        
        <div className="sidebar-options">
          <NavLink 
            className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"} 
            to="/add"
          >
            <div className="option-icon">
              <img src={assets.add_icon} alt="Add" />
            </div>
            <p>Ajouter un produit</p>
          </NavLink>
          
          <NavLink 
            className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"} 
            to="/"
          >
            <div className="option-icon">
              <img src={assets.order_icon} alt="List" />
            </div>
            <p>Liste des produits</p>
          </NavLink>
        </div>
        
        <h4 className="menu-category">Gestion</h4>
        
        <div className="sidebar-options">
          <NavLink 
            className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"} 
            to="/categories"
          >
            <div className="option-icon">
              <img src={assets.order_icon} alt="Categories" />
            </div>
             
            <p>Catégories</p>
          </NavLink>
          
          <NavLink 
            className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"} 
            to="/settings"
          >
            <div className="option-icon">
              <img src={assets.add_icon} alt="Settings" />
            </div>
            <p>Paramètres</p>
          </NavLink>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <img src={assets.logo || assets.add_icon} alt="User" />
          </div>
          <div className="user-info">
            <h5>Admin</h5>
            <p>Administrateur</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;