import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const url = "http://localhost:4000"; 

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${url}/api/foods/all`);
      if (response.data.success) {
        setFoodList(response.data.foods);
        console.log("Produits chargés avec succès:", response.data.foods);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const contextValue = {
    food_list,
    setFoodList,
    url,
    fetchFoods,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;