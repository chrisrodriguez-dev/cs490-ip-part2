import React from 'react'

import axios from 'axios';

const handleRentalSubmit = async (e) => {
    e.preventDefault();

    const rentalData = {
        customer_id: customerId, 
        rental_rate: rentalRate,
        rental_duration: rentalDuration
    };

    const response = await axios.post('http://127.0.0.1:5000/api/rentals', rentalData);

    if (response.status === 201) {
        alert("Rental successfully added to MySQL!");
        setIsRentalOpen(false); 
    }
};

function popup({open, onClose, children}) {
  return (
    <div onClick={onClose} className={`fixed inset-0 z-[100] flex justify-center 
    items-center transition-colors ${open ? 'visible bg-black/20' : 'invisible'}`}>
      
      <div onClick={(e) => e.stopPropagation()} className={`bg-white rounded-xl shadow p-6 transition-all ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}>
        {children}
      </div>
      
    </div>
  )
}

export default popup