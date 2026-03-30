import React from 'react';
import ShowAllFoods from './ShowAllFoods';
const foodsPromise = fetch(
  'https://the-spice-slice-server.vercel.app/foods',
).then(res => res.json());

const AllFoods = () => {
  return (
    <div className="w-11/12 mx-auto">
      <ShowAllFoods foodsPromise={foodsPromise}></ShowAllFoods>
    </div>
  );
};

export default AllFoods;
