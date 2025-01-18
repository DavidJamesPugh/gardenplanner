import React from 'react';

function VegetableCard({ name }) {
  return (
    <div className="vegetable-card" draggable>
      {name}
    </div>
  );
}

export default VegetableCard;
