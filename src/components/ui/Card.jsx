const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded shadow-sm border p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;