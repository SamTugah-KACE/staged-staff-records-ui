import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselCard from './CarouselCard';
import Footer from './Footer';
import './LandingPage.css';
import {toast} from 'react-toastify';

// Import local images (ensure these files exist in src/assets/images/)
import softwareA from '../assets/images/e-asset.jpg';
import softwareB from '../assets/images/staff-records.jpg';
import softwareC from '../assets/images/appraisal.jpg';

const products = [
  {
    id: 1,
    name: 'E-ASSET',
    description: 'Description for Software A',
    image: softwareA
  },
  {
    id: 2,
    name: 'STAFF RECORDS DB',
    description: 'Description for Software B',
    image: softwareB
  },
  {
    id: 3,
    name: 'EMPLOYEE PERFORMANCE APPRAISAL',
    description: 'Description for Software C',
    image: softwareC
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = (product) => {
    // Pass along the selected product if needed
    if (product.id === 2) 
    navigate('/signup', { state: { product } });
  else{
    toast.error("Oops!, Sorry Product will be ready soon.");
    // alert("Oops!, Sorry Product will be ready soon.");

  }
  };

  return (
    <div className="landing-page">
      <header>
        <h5>Ghana-India Kofi Annan Centre of Excellence in ICT<br/>
        Research & Innovation Dept.
        </h5>
      </header>
      <div className="carousel-container">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <CarouselCard product={product} onGetStarted={() => handleGetStarted(product)} />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
