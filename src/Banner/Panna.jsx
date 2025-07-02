import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';

const foodItems = [
  {
    id: '1',
    mainImg: 'https://i.ibb.co/VW0mh7qs/Sushi-Platter.jpg',
    thumbImg: 'https://i.ibb.co/VW0mh7qs/Sushi-Platter.jpg',
  },
  {
    id: '2',
    mainImg: 'https://i.ibb.co/b5vrr5XW/Chicken-Roast.jpg',
    thumbImg: 'https://i.ibb.co/b5vrr5XW/Chicken-Roast.jpg',
  },
  {
    id: '3',
    mainImg: 'https://i.ibb.co/xSFGDQgd/Margherita-Pizza.jpg',
    thumbImg: 'https://i.ibb.co/xSFGDQgd/Margherita-Pizza.jpg',
  },
  {
    id: '4',
    mainImg: 'https://i.ibb.co/FbqkNB4f/Panta-Ilish.jpg',
    thumbImg: 'https://i.ibb.co/FbqkNB4f/Panta-Ilish.jpg',
  },
];

const FoodBanner = ({ searchTerm, setSearchTerm }) => {
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const intervalRef = useRef(null);
  const autoChangeDelay = 5000;
  const navigate = useNavigate();

  const startAutoChange = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentFoodIndex(prevIndex => (prevIndex + 1) % foodItems.length);
    }, autoChangeDelay);
  };

  const handleView = () => {
    resetAutoChange();
    navigate('/allFoods');
  };

  const resetAutoChange = () => {
    startAutoChange();
  };

  useEffect(() => {
    if (foodItems.length > 0) {
      startAutoChange();
    }

    return () => clearInterval(intervalRef.current);
  }, []);
  const handleThumbnailClick = index => {
    setCurrentFoodIndex(index);
    resetAutoChange();
  };

  const currentFood = foodItems[currentFoodIndex];

  return (
    <section className="relative w-full h-full md:h-[450px] lg:h-[450px] bg-dark-navy  flex items-center justify-center overflow-hidden  lg:py-0 flex-col-reverse lg:flex-row ">
      <div className="absolute top-5 right-0 flex flex-col gap-2 z-10 ">
        <div className="md:block lg:block hidden space-y-2">
          <button className="  text-sm  flex  items-center justify-center gap-1 px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            RELATED
          </button>

          <button className=" flex items-center gap-2 px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
            {/* Shopping cart icon for BUY NOW */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 1a1 1 0 000 2h1a2 2 0 012 2v2H2a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2H6a2 2 0 01-2-2V5a2 2 0 00-2-2H3zM16 16a1 1 0 100 2h2a1 1 0 100-2h-2z" />
            </svg>
            BUY NOW
          </button>
        </div>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between p-4 lg:p-8">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-10 lg:mb-0 lg:w-1/3">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2 leading-tight">
            GOOD TIMES
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-light leading-tight">
            GREAT TASTES
          </h2>
          <Link
            onClick={handleView} // Reset auto-change on button click
            className="px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
          >
            <button className="">VIEW MORE</button>
          </Link>

          <div className=" py-6 ">
            <div className="flex justify-center mb-6">
              <input
                type="text"
                placeholder="Search food by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-green-500 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Main Food Display */}
        <div className="relative w-full lg:w-1/2 flex justify-center items-center h-[350px] md:h-[450px] lg:h-[550px] py-5 ">
          {currentFood && (
            <img
              key={currentFood.id} // Key prop forces re-render when src changes, which helps with transition effects
              src={currentFood.mainImg}
              alt="Delicious Food"
              // Tailwind classes for styling the main image
              className="rounded-full border-8 border-green-600  object-cover w-full h-full max-w-[400px] max-h-[400px] shadow-2xl transition-opacity duration-500 ease-in-out opacity-100"
            />
          )}
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex flex-row lg:flex-col gap-5 mt-10 lg:mt-0 lg:w-1/6 justify-center lg:justify-start">
          {foodItems.map((food, index) => (
            <div
              key={food.id}
              className={`
                w-20 h-20 rounded-full overflow-hidden cursor-pointer border-2 transition-all duration-300
                ${
                  currentFoodIndex === index
                    ? 'border-accent-red scale-110 shadow-lg'
                    : 'border-transparent hover:scale-105'
                }
              `}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={food.thumbImg}
                alt={`Food Thumbnail ${food.id}`}
                className="w-full h-full object-cover border-4 rounded-full border-green-600 transition-transform duration-300 ease-in-out transform hover:scale-110"
                loading="lazy"
                style={{ filter: 'brightness(0.8)' }} // Optional: darken thumbnail images for better contrast
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodBanner;
