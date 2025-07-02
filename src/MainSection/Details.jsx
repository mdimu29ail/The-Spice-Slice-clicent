import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { AuthContext } from '../Auth/AuthContext';
import { FaUtensils, FaStar, FaTag, FaListAlt, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Details = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const food = useLoaderData();
  const [isVisible, setIsVisible] = useState(false);

  const isOutOfStock = parseInt(food.availableQuantity) === 0;
  const isOwnItem = user?.email === food.createdBy;

  const handlePurchase = () => {
    if (!isOutOfStock && !isOwnItem) {
      navigate(`/orderNow/${food._id}`, {
        state: {
          quantity: 1,
          maxQuantity: parseInt(food.availableQuantity),
          foodName: food.name,
        },
      });
    }
  };

  const message = isOutOfStock
    ? 'This item is out of stock.'
    : isOwnItem
    ? 'You cannot purchase your own food item.'
    : '';

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen  py-10 ">
      <div
        className={`backdrop-blur-xl bg-white/10 border-b-2 rounded-3xl shadow-2xl p-8 max-w-2xl w-full transform transition-all duration-700 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <img
          src={food.image_url}
          alt={food.name}
          className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md border border-white/30"
        />

        <h2 className="text-4xl font-extrabold  text-center mb-2 tracking-wide">
          {food.name}
        </h2>
        <p className="text-center  italic mb-6 border-b-2 rounded-2xl px-5 py-2">
          {food.title}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  mb-6 ">
          <DetailRow
            icon={<FaListAlt />}
            label="Category"
            value={food.category}
          />
          <DetailRow
            icon={<FaUtensils />}
            label="Cuisine"
            value={food.cuisine}
          />
          <DetailRow
            icon={<FaTag />}
            label="Price"
            value={`$${food.price_usd}`}
          />
          <DetailRow
            icon={<FaStar />}
            label="Rating"
            value={`⭐ ${food.rating}`}
          />
          <DetailRow
            icon={<FaListAlt />}
            label="Available"
            value={food.availableQuantity}
          />
          <DetailRow
            icon={<FaUser />}
            label="Seller"
            value={`${food.hr_name} (${food.createdBy})`}
          />
        </div>

        {message && (
          <p className="text-center text-red-400 font-semibold my-4 animate-pulse">
            {message}
          </p>
        )}

        <div className="flex justify-center">
          <button
            onClick={handlePurchase}
            disabled={isOutOfStock || isOwnItem}
            className={`border-b-2 rounded-2xl px-5 py-3 ${
              isOutOfStock || isOwnItem
                ? 'text-green-600 font-bold border-b-2 border-green-600 rounded-2xl'
                : ' hover:text-green-400 border-b-2  rounded-2xl'
            }`}
          >
            Purchase Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail row component
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3  px-4 py-2 rounded-xl border-b-2  shadow-inner">
    <span className="text-lg">{icon}</span>
    <span className="font-semibold text-sm">
      {label}: <span className="font-normal">{value}</span>
    </span>
  </div>
);

export default Details;
