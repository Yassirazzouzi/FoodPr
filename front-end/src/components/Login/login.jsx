import React, { useContext, useEffect, useState } from 'react'
import './login.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Login = ({ setshowLogin }) => {
    const { url, token, setToken } = useContext(StoreContext)
    const [currState, setCurrState] = useState('login')
    const [data, setdata] = useState({
        email: "",
        password: "",
        name: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setdata((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    useEffect(() => {
        console.log(data)
    }, [data])

    const onLogin = async (e) => {
        e.preventDefault();
        let newUrl = url;
        let payload = {};
        if (currState === 'login') {
            newUrl += "/api/users/login";
            payload = {
                email: data.email,
                password: data.password
            };
        } else {
            newUrl += "/api/users/register";
            payload = {
                name: data.name,
                email: data.email,
                password: data.password
            };
        }

        console.log("Données envoyées :", payload);

        try {
            const response = await axios.post(newUrl, payload);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setshowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erreur inconnue");
            if (err.response?.data?.details) {
                alert(err.response.data.details);
            }
        }
    }

    return (
        <div className='login-popup'>
            <div className="login-popup-overlay" onClick={() => setshowLogin(false)}></div>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState === 'login' ? 'Connexion' : 'Inscription'}</h2>
                    <img onClick={() => setshowLogin(false)} src={assets.cross_icon} alt="Fermer" className="close-icon" />
                </div>

                <div className="login-popup-inputs">
                    {currState === 'login' ? null :
                        <div className="input-group">
                            <label htmlFor="name">Nom</label>
                            <input type="text" placeholder='Votre nom' id="name" name='name' onChange={handleChange} value={data.name} required />
                        </div>
                    }

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name='email' onChange={handleChange} value={data.email} placeholder='Votre email' id="email" required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" onChange={handleChange} value={data.password} name='password' placeholder='Mot de passe' id="password" required />
                    </div>
                </div>

                <button type='submit' className="submit-btn">
                    {currState === 'login' ? 'Se connecter' : 'Créer un compte'}
                </button>

                <div className="login-popup-condition">
                    <input type="checkbox" name="terms" id="terms" required />
                    <p>
                        J'accepte les <span>Conditions d'utilisation</span>
                    </p>
                </div>

                <p className="switch-form">
                    {currState === 'login' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                    <span onClick={() => setCurrState(currState === 'login' ? 'register' : 'login')}>
                        {currState === 'login' ? "S'inscrire" : "Se connecter"}
                    </span>
                </p>
            </form>
        </div>
    )
}

export default Login
