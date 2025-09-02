import React from 'react';
import './CarouselCard.css'; // add your styling

const CarouselCard = ({ product, onGetStarted }) => {
  return (
    <div className="carousel-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="card-content">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
      </div>
      <button className="get-started-btn" onClick={onGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default CarouselCard;
