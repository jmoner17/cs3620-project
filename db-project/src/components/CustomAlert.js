import React, { useEffect, useState } from 'react';

const AnimatedCheckmark = () => (
  <div className="relative w-10 h-10">
    <svg
      className="absolute w-full h-full text-theme-color"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <div className="w-full h-full border-4 border-theme-color rounded-full animate-ping" />
  </div>
);

const CustomAlert = ({ title, message, show, onClose }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (show) {
      setShowAlert(true);
    } else {
      setTimeout(() => setShowAlert(false), 300);
    }
  }, [show]);

  if (!showAlert) return null;

  return (
    <div className="fixed z-top inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className={`bg-primary dark:bg-dark-primary p-6 rounded-lg shadow-md w-80 h-60 transform transition-all duration-300 flex flex-col items-center justify-center ${
          show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <AnimatedCheckmark />
        <p className="mt-auto text-text-color dark:text-dark-text-color text-lg font-semibold">{title}</p>
        <p className="text-light-text dark:text-dark-light-text">{message}</p>
        <button
          className="mt-auto bg-theme-color text-white px-4 py-2 rounded-md hover:opacity-50 transition-colors duration-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;