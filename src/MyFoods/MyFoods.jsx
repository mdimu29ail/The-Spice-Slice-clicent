import React, { use, useEffect, useState } from 'react';

import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../Auth/AuthContext';
import Panna from '../Banner/Panna';

const MyFoods = () => {
  const { user, loading, setLoading } = use(AuthContext);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);

    fetch(
      `https://my-assignment-11-server-lac.vercel.app/foods?email=${user.email}`
    )
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(food => food.createdBy === user.email);
        setFoods(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching foods:', error);
        setLoading(false);
      });
  }, [user?.email]);

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (!result.isConfirmed) return;

      fetch(`https://my-assignment-11-server-lac.vercel.app/foods/${id}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(data => {
          if (data.deletedCount > 0) {
            Swal.fire('Deleted!', 'Your food has been deleted.', 'success');
            setFoods(prevFoods => prevFoods.filter(food => food._id !== id));
          } else {
            Swal.fire('Error!', 'Food was not deleted.', 'error');
          }
        })
        .catch(() => {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        });
    });
  };

  return (
    // Full background gradient for the entire component area

    <div>
      <Panna></Panna>
      <div className="min-h-screen  py-10 px-4 ">
        {/* Content wrapper to center and limit width */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-8  animate-fadeInDown  px-5 py-2 border-t-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors dark:hover:bg-gray-500">
            My Foods
          </h2>

          {loading ? (
            <p className="text-center text-xl font-semibold animate-pulse">
              Loading...
            </p>
          ) : foods.length === 0 ? (
            <p className="text-center italic animate-pulse">
              You have not added any foods yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map(food => (
                <div
                  key={food._id}
                  className="card border border-green-200  rounded-lg shadow-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl animate-fadeInUp flex flex-col"
                >
                  <img
                    src={food.image_url}
                    alt={food.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-4 space-y-2 flex-grow">
                    {' '}
                    <h3 className="text-2xl font-semibold text-center mb-2 w-full px-5 py-2 border-b-2 rounded-2xl">
                      {food.name}
                    </h3>
                    {/* Short Description/Tagline (using food.description as a placeholder) */}
                    <p className="text-center w-full px-5 py-2 border-b-2 rounded-2xl  italic text-sm mb-3">
                      {food.description || 'No tagline available'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2  text-sm">
                      <div className="flex items-center w-full px-5 py-2 border-b-2 rounded-2xl">
                        <span className="mr-2 ">📋</span>
                        <p>
                          <span className="font-semibold">Category:</span>{' '}
                          {food.category}
                        </p>
                      </div>
                      <div className="flex items-center w-full px-5 py-2 border-b-2 rounded-2xl">
                        <span className="mr-2 ">🍴</span>{' '}
                        {/* Fork and knife icon */}
                        <p>
                          <span className="font-semibold ">Cuisine:</span>{' '}
                          {food.cuisine ?? 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center w-full px-5 py-2 border-b-2 rounded-2xl">
                        <span className="mr-2 ">🏷️</span>
                        <p>
                          <span className="font-semibold ">Price:</span> $
                          {food.price_usd}
                        </p>
                      </div>
                      <div className="flex items-center w-full px-5 py-2 border-b-2 rounded-2xl">
                        <span className="mr-2 ">✅</span>
                        <p>
                          <span className="font-semibold">Available:</span>{' '}
                          <span
                            className={
                              parseInt(food.quantity) > 1
                                ? 'text-green-400'
                                : 'text-red-400'
                            }
                          >
                            {parseInt(food.quantity) > 0 ? 'Yes' : 'No'}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* Food Quantity and Purchase Count in a flex container */}
                    {/* <div className="flex justify-between items-center  mt-4 ">
                      <p className="w-full px-3 py-2 border-b-2 rounded-2xl">
                        <span className="font-semibold ">Food Quantity:</span>{' '}
                        {food.quantity ?? 'N/A'}
                      </p>
                      <p className=" w-full px-3 py-2 border-b-2 rounded-2xl">
                        <span className="font-semibold ">Purchase Count:</span>{' '}
                        {food.purchase_count ?? 0}
                      </p>
                    </div> */}
                  </div>

                  {/* Buttons at the bottom */}
                  <div className="p-4 pt-0 flex justify-between gap-2">
                    {' '}
                    {/* Added gap for spacing */}
                    <Link to={`/foods/${food._id}`}>
                      <button className="flex-1  w-full px-5 py-2 border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
                        Details
                      </button>
                    </Link>
                    <Link to={`/update/${food._id}`}>
                      <button className="flex-1  w-full px-5 py-2 border-b-2 rounded-2xl hover:border-yellow-600 hover:text-yellow-500 transition-colors font-bold dark:hover:bg-gray-500">
                        Update
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="flex-1 w-full px-5 py-2 border-b-2 rounded-2xl hover:border-red-600 hover:text-red-500 transition-colors font-bold dark:hover:bg-gray-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFoods;
