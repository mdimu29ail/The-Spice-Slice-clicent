import React from 'react';
import { Link } from 'react-router';

const SingleCard = ({ food }) => {
  return (
    <div className="card w-full">
      <figure className="h-60">
        <img
          className="object-cover w-full h-full"
          src={food.image_url}
          alt={food.name}
        />
      </figure>
      <div className="card-body rounded-lg shadow-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
        <h2 className="px-5 py-2 border-b-2 rounded-2xl text-2xl flex justify-between">
          {food.name}
        </h2>

        <div className="card-actions justify-between flex">
          <div className="px-2 py-2 border-b-2 rounded-2xl">
            Price : ${food.price_usd}
          </div>
          <div className="px-2 py-2 border-b-2 rounded-2xl">
            <span className="font-bold">Available:</span>{' '}
            <span
              className={
                parseInt(food.quantity) > 0 ? 'text-green-400' : 'text-red-400'
              }
            >
              {parseInt(food.quantity) > 0 ? 'available' : 'not available'}
            </span>
          </div>
        </div>

        <div className="my-3">
          <Link to={`/foods/${food._id}`}>
            <button className="w-full px-5 py-2 border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
              Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
