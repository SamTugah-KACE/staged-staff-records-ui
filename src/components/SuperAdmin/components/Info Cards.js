import './Info Cards.css';

const InfoCard = ({ title, description, icon, value, color, colorRgb, bgOpacity, style }) => {
  const cardStyle = {
    '--card-accent-color': color,
    '--card-accent-rgb': colorRgb || '74, 108, 247', 
    '--card-bg-opacity': bgOpacity || '0.1',
    ...style
  };
  
  return (
    <div className="info-card" style={cardStyle}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-value">{value}</div>
      </div>
    </div>
  );
};

export default InfoCard;