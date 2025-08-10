import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://my-assignment-11-server-lac.vercel.app/foods/${id}`)
      .then(res => setFoodData(res.data))
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load food data',
          timer: 1500,
        });
      });
  }, [id]);

  const handleUpdateFoods = e => {
    e.preventDefault();
    const form = e.target;
    const updatedFood = {
      name: form.name.value,
      category: form.category.value,
      quantity: parseInt(form.quantity.value),
      image_url: form.image_url.value,
      cuisine: form.cuisine.value,
      price_usd: parseFloat(form.price_usd.value),
      rating: parseFloat(form.rating.value),
      description: form.description.value,
    };

    axios
      .patch(
        `https://my-assignment-11-server-lac.vercel.app/foods/${id}`,
        updatedFood
      )
      .then(res => {
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Food updated successfully!',
            timer: 1500,
            showConfirmButton: false,
          });
          navigate('/dashboard/myFoods');
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No changes made',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Update failed!',
          timer: 1500,
        });
      });
  };

  if (!foodData)
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;

  const inputStyle =
    'w-full px-5 py-3 rounded-full bg-[#d1d5db] text-gray-700 shadow-inner focus:outline-none focus:shadow-lg transition-all placeholder-gray-500';

  return (
    <div className="my-10 flex justify-center w-full px-4 md:px-10  min-h-screen">
      <div className="w-full max-w-3xl">
        <h2 className="text-4xl text-center font-bold mb-8 ">
          Update Food Item
        </h2>

        <form onSubmit={handleUpdateFoods} className="flex flex-col gap-6">
          <label className="block mb-2 font-semibold text-gray-700">Name</label>
          <input
            commentMore
            actions
            type="text"
            name="name"
            defaultValue={foodData.name}
            required
            className={inputStyle}
          />

          {/* Category */}
          <label className="block mb-2 font-semibold ">Category</label>
          <input
            type="text"
            name="category"
            defaultValue={foodData.category}
            required
            className={inputStyle}
          />

          {/* Quantity */}
          <label className="block mb-2 font-semibold ">Quantity</label>
          <input
            type="number"
            name="quantity"
            defaultValue={foodData.quantity}
            required
            className={inputStyle}
          />

          {/* Image URL */}
          <label className="block mb-2 font-semibold ">Image URL</label>
          <input
            type="url"
            name="image_url"
            defaultValue={foodData.image_url}
            required
            className={inputStyle}
          />

          {/* Cuisine */}
          <label className="block mb-2 font-semibold ">Cuisine</label>
          <input
            type="text"
            name="cuisine"
            defaultValue={foodData.cuisine}
            className={inputStyle}
          />

          {/* Price USD */}
          <label className="block mb-2 font-semibold ">Price (USD)</label>
          <input
            type="number"
            name="price_usd"
            step="0.01"
            defaultValue={foodData.price_usd}
            required
            className={inputStyle}
          />

          {/* Rating */}
          <label className="block mb-2 font-semibold ">Rating</label>
          <input
            type="number"
            name="rating"
            step="0.1"
            min="0"
            max="5"
            defaultValue={foodData.rating}
            required
            className={inputStyle}
          />

          {/* Description */}
          <label className="block mb-2 font-semibold ">Description</label>
          <textarea
            name="description"
            defaultValue={foodData.description}
            rows="4"
            className="w-full px-5 py-3 rounded-2xl bg-[#d1d5db] text-gray-700 shadow-inner focus:outline-none focus:shadow-lg transition-all placeholder-gray-500"
            placeholder="Enter food description"
          />

          <button
            type="submit"
            className="w-full px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
          >
            Update Food
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;
