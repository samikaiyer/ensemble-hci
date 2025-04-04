import React from 'react';
import { useParams, useLocation } from 'react-router-dom';  
import ScreenHeader from '../components/ScreenHeader';  

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
      <ScreenHeader text={closet.title} />
      <div>
        <h3>Closet Details</h3>
        <p><strong>Members:</strong> {closet.num_members}</p>
        <p><strong>Items:</strong> {closet.num_items}</p>
      </div>
    </div>
  );
}

export default IndividualCloset;
