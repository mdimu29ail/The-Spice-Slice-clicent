import React from 'react';
import { GiRoundStar } from 'react-icons/gi';
import { Link } from 'react-router';

const SingleCard = ({ food }) => {
  return (
    <div className="flex justify-center">
      <div className="card w-80 md:w-96 lg:w-96">
        <figure className="h-60">
          <img className=" bg-cover" src={food.image_url} alt="Shoes" />
        </figure>
        <div className="card-body rounded-lg shadow-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fadeInUp flex flex-col">
          <h2 className="px-5 py-2 border-b-2 rounded-2xl text-2xl flex justify-between">
            {food.name}{' '}
          </h2>

          <p className="px-5 py-2 border-b-2 rounded-2xl">{food.cuisine}</p>

          <div className="card-actions justify-between flex">
            <div className="px-5 py-2 border-b-2 rounded-2xl ">
              Price : ${food.price_usd}
            </div>

            {/* <div className="px-5 py-2 flex items-center gap-2 border-b-2 rounded-2xl">
              <GiRoundStar color="#FFD700" />
              {food.rating}
            </div> */}
            <div className="px-5 py-2 border-b-2 rounded-2xl  ">
              <span className="font-bold">Available:</span>{' '}
              <span
                className={
                  parseInt(food.quantity) > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {parseInt(food.quantity) > 0 ? 'available ' : 'not available'}
              </span>
            </div>
          </div>
          {/* 
          <div className="card-actions justify-between">
            <div className="px-5 py-2 border-b-2 rounded-2xl  ">
              <span className="font-bold">Available:</span>{' '}
              <span
                className={
                  parseInt(food.quantity) > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {parseInt(food.quantity) > 0 ? 'available ' : 'not available'}
              </span>
            </div>

            <div className="px-5 py-2 border-b-2 rounded-2xl">
              <span className="font-bold">Quantity :</span> {food.quantity}
            </div>
          </div> */}

          <div className="my-3">
            <Link to={`/foods/${food._id}`}>
              <button className="  w-full px-5 py-2 border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
