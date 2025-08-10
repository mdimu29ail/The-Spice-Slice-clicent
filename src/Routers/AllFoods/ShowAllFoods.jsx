import React, { use, useState } from 'react';
import SingleCard from './SingleCard';
import Panna from '../../Banner/Panna';

const ShowAllFoods = ({ foodsPromise }) => {
  const foods = use(foodsPromise); // Suspense-based data loading
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllFoods, setShowAllFoods] = useState(false);

  // Filter foods by search term
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedFoods = showAllFoods
    ? filteredFoods
    : filteredFoods.slice(0, 8);

  const handleToggleShowAll = () => {
    setShowAllFoods(!showAllFoods);
  };

  return (
    <div>
      <Panna searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="my-6">
        <h2 className="text-4xl text-center font-bold mb-4">All Foods Here</h2>
      </div>

      {/* 🧾 Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedFoods.length > 0 ? (
          displayedFoods.map(food => <SingleCard key={food._id} food={food} />)
        ) : (
          <p className="text-center col-span-3 text-red-500 font-semibold">
            No food matched your search.
          </p>
        )}
      </div>

      {/* Show More/Less Button */}
      {filteredFoods.length > 6 && (
        <div className="flex justify-center mt-8 mb-12">
          <button
            onClick={handleToggleShowAll}
            className="px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
          >
            {showAllFoods
              ? 'Show Less'
              : `See All (${filteredFoods.length - 6} more)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowAllFoods;
