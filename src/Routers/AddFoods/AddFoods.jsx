import React, { use } from 'react';
import { AuthContext } from '../../Auth/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddFoods = () => {
  const { user, loading, setLoading } = use(AuthContext);

  const handleAddFoods = async e => {
    e.preventDefault();
    setLoading(true); // START loading

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const newFood = {
      ...data,
      price_usd: parseFloat(data.price_usd),
      rating: parseFloat(data.rating),
      purchase_count: parseInt(data.purchase_count || '0'),
      createdBy: user.email,
    };

    try {
      const res = await axios.post(
        'https://my-assignment-11-server-lac.vercel.app/foods',
        newFood
      );
      if (res.data.insertedId) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Food added successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        form.reset();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Something went wrong!',
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false); // END loading
    }
  };

  const inputStyle =
    'w-full px-5 py-3 rounded-full bg-[#d1d5db] text-gray-700 shadow-inner focus:outline-none focus:shadow-lg transition-all placeholder-gray-500';

  return (
    <div className="my-10 flex justify-center w-full px-10">
      <div className="w-full max-w-3xl">
        <h2 className="text-4xl text-center font-bold mb-8">Add Foods</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <form onSubmit={handleAddFoods} className="flex flex-col gap-6">
            <div>
              <label className="block mb-2 text-lg font-semibold">
                Food Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter food name"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-2 text-lg font-semibold">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="Enter category"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-2 text-lg font-semibold">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Food quantity"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-2 text-lg font-semibold">
                Purchase Count
              </label>
              <input
                type="number"
                name="purchase_count"
                placeholder="Purchase count"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-2 text-lg font-semibold">
                Food Image URL
              </label>
              <input
                type="url"
                name="image_url"
                placeholder="Image URL"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-2 text-lg font-semibold">
                Cuisine
              </label>
              <input
                type="text"
                name="cuisine"
                placeholder="Cuisine type"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-2 text-lg font-semibold">
                Price (USD)
              </label>
              <input
                type="number"
                name="price_usd"
                placeholder="Price in USD"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-2 text-lg font-semibold">Rating</label>
              <input
                type="number"
                name="rating"
                step="0.1"
                placeholder="Rating (e.g. 4.5)"
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-2 text-lg font-semibold">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter food description"
                className="w-full px-5 py-3 rounded-2xl bg-[#d1d5db] text-gray-700 shadow-inner focus:outline-none focus:shadow-lg transition-all placeholder-gray-500"
                rows="3"
              />
            </div>

            <div className="border border-gray-300 p-5 rounded-2xl shadow-inner ">
              <legend className="text-xl font-semibold mb-4">
                User Related Info
              </legend>
              <label className="block mb-2">User Name</label>
              <input
                type="text"
                name="hr_name"
                defaultValue={user.displayName}
                readOnly
                className={inputStyle}
              />

              <label className="block mt-4 mb-2">User Email</label>
              <input
                type="email"
                defaultValue={user.email}
                readOnly
                className={inputStyle}
              />
            </div>

            <div className="mt-6">
              <input
                type="submit"
                value="Add Foods"
                className="w-full px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddFoods;
