import React from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItems from '../FoodItems/FoodItems'

const FoodDisplay = ({category, openDetail}) => {
  const {food_list, url}=React.useContext(StoreContext)
return (
  <div className='food-display' id='food-display'>
    <h2>top dishes near you</h2>
    <div className="food-display-list">
      {
          food_list.map((item,index)=>{
              console.log("Item à afficher:", item)
              if(category==='All' || category===item.category){
                  return <FoodItems 
                      key={index} 
                      id={item._id} 
                      name={item.name} 
                      description={item.description} 
                      price={item.price} 
                      image={item.imageUrl}
                      category={item.category}
                      openDetail={openDetail}
                      url={url}
                  />
              }
          })
      }
    </div>
  </div>
)
}

export default FoodDisplay
