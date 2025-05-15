import React, { useContext, useState } from 'react'
import './Navbar.css'   
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { Link } from 'react-router-dom'

const Navbar = ({setshowLogin}) => {
    const [menu, setMenu] = useState('menu')
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const {token, setToken} = useContext(StoreContext)
    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu)
    }
  
    const logout = ()=>{
            localStorage.removeItem('token')
            setToken('')
    }
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/">
                    <img src={assets.logo} alt="Logo" className="logo"/>
                </Link>
                
                <div className={`navbar-menu-container ${showMobileMenu ? 'active' : ''}`}>
                    <ul className="navbar-menu">
                        <li onClick={()=>setMenu("home")} className={menu==='home'?'active':''}>
                            <Link to="/">Accueil</Link>
                        </li>
                        <li onClick={()=>setMenu("menu")} className={menu==='menu'?'active':''}>
                            <Link to="/menu">Menu</Link>
                        </li>
                        <li onClick={()=>setMenu("contact-us")} className={menu==='contact-us'?'active':''}>
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
                
                <div className='navbar-right'>
                    <div className="search-box">
                        <img src={assets.search_icon} alt='Rechercher'/>
                        <input type="text" placeholder="Rechercher..." />
                    </div>
                    
                    {!token?<button className="signup-btn" onClick={()=>setshowLogin(true)} >Sign up</button> : <div className="navbar-profile">
                        <img src={assets.profile_icon} alt='Profile'/>
                        <ul className='nav-profile-menu'>
                            <li onClick={logout}><img src={assets.logout_icon} alt="" />Logout</li>
                        </ul>
                    </div>   }

                    <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        <div className={`hamburger ${showMobileMenu ? 'active' : ''}`}>
                          
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
