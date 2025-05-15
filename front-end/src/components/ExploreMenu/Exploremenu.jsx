import React from 'react'
import './Exploremenu.css'
import { menu_list } from '../../assets/assets'
const Exploremenu = ({category,setCategory}) => {
    
  return (
    <div    className='explore-menu' id='explore-menu'>
     <h1>Explore our menu</h1>
     <p className='explore-menu-text'> choose from a diverse menu featruring </p>   
     <div className="explore-menu-list">
        {menu_list.map((item,index)=>(
            <div  onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} className="explore-menu-item" key={index}>
                <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                <p>{item.menu_name}</p>
            </div>
        ))}
        </div>   
    </div>
  )
}

export default Exploremenu
