import React from 'react';
import { useParams, useLocation } from 'react-router-dom';  
import { Button } from 'react-bootstrap';
import "./IndividualCloset.css";

function IndividualCloset() {
  const { name } = useParams(); 
  const location = useLocation();  
  const closets = location.state?.closets || []; 
  const closet = closets.find(c => c.title === decodeURIComponent(name));

  if (!closet) {
    return <h2>Closet not found</h2>;
  }

  return (
    <div>
      <header style={{ backgroundColor: "#DF8EC1", height: "200px", textAlign: "center", lineHeight: "60px", paddingTop: "3%" }}>
        <h1>{closet.title}</h1>
        <div className='infocontainer'>
            <p><strong>Members:</strong> {closet.num_members}</p>
            <p><strong>Items:</strong> {closet.num_items}</p>
        </div>
        <div className='infocontainer'>
            <Button variant="outline-dark" size="lg">All Items</Button>
            <Button variant="outline-dark" size="lg">Tops</Button>
            <Button variant="outline-dark" size="lg">Bottoms</Button>
        </div>
      </header>
      <div className='imagescontainer'>
      {closet.items && closet.items.length > 0 ? (
          closet.items.map((item, index) => (
            <img 
              key={index} 
              src={item.image} 
              alt={item.name} 
              className="itemImage" 
            />
          ))
        ) : (
          <p>No items in this closet</p>
        )}
      </div>
    </div>
  );
}

export default IndividualCloset;
