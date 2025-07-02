import React from 'react';
import ShowAllFoods from './ShowAllFoods';
const foodsPromise = fetch(
  'https://my-assignment-11-server-lac.vercel.app/foods'
).then(res => res.json());

const AllFoods = () => {
  return (
    <div className="w-11/12 mx-auto">
      <ShowAllFoods foodsPromise={foodsPromise}></ShowAllFoods>
    </div>
  );
};

export default AllFoods;
