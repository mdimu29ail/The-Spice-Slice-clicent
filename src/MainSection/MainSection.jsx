import React, { use, useState } from 'react';

import Card from './Card';

const MainSection = ({ foodsPromise }) => {
  const foods = use(foodsPromise);

  // Filter foods with purchase_count > 100
  const foodsWithHighPurchaseCount = foods.filter(
    food => Number(food.purchase_count) > 200
  );

  const [showAllFoods, setShowAllFoods] = useState(false);

  const displayedFoods = showAllFoods
    ? foodsWithHighPurchaseCount
    : foodsWithHighPurchaseCount.slice(0, 6);

  const handleToggleShowAll = () => {
    setShowAllFoods(!showAllFoods);
  };

  return (
    <div>
      <div>
        <div className="my-6">
          <h2 className="text-4xl text-center font-bold">Top Foods</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-center">
          {displayedFoods.map(food => (
            <Card key={food._id} food={food} />
          ))}
        </div>

        <div className="flex justify-center items-center">
          {foodsWithHighPurchaseCount.length > 8 && (
            <div className="mt-8 mb-12">
              <button
                onClick={handleToggleShowAll}
                className="px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
              >
                {showAllFoods
                  ? 'Show Less'
                  : `See All (${foodsWithHighPurchaseCount.length - 6} more)`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
