import React, { useState, useEffect } from 'react';

const FlashSale = ({ product, endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('EXPIRED');
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-2xl text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold">⚡ FLASH SALE</p>
          <p className="text-2xl font-black">{product.name}</p>
          <p className="text-3xl font-black">₹{product.price}</p>
        </div>
        <div className="text-center">
          <p className="text-sm mb-1">Ends in</p>
          <p className="text-2xl font-black">{timeLeft}</p>
        </div>
      </div>
    </div>
  );
};
