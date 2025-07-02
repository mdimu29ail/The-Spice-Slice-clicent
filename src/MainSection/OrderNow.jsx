import React, { use } from 'react';
import { useNavigate, useParams } from 'react-router';

import axios from 'axios';
import Swal from 'sweetalert2';
import Loading from '../Loading/Loading';
import { AuthContext } from '../Auth/AuthContext';

const OrderNow = () => {
  const { id: foodId } = useParams();
  const { user, loading, setLoading } = use(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-red-500 font-semibold">
          Please login to place an order.
        </p>
      </div>
    );
  }

  const handlePurchase = async e => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const number = form.number.value;

    const application = {
      foodId,
      applicant: user.email,
      name,
      email,
      number,
    };

    try {
      const res = await axios.post(
        'https://my-assignment-11-server-lac.vercel.app/applications',
        application
      );
      if (res.data.insertedId) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Purchase Added!',
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          navigate('/purchaseList');
        }, 1600);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Purchase',
        text: 'Something went wrong. Try again!',
      });
    } finally {
      setLoading(false); // ✅ সবশেষে loading false
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center my-5">Order Now</h2>

      <form
        onSubmit={handlePurchase}
        className="max-w-md mx-auto p-6 bg-base-200 rounded-xl shadow"
      >
        <fieldset className="mb-4">
          <label className="label">User Name</label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full"
            placeholder="User Name"
            defaultValue={user.displayName}
          />
        </fieldset>

        <fieldset className="mb-4">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full"
            placeholder="Email"
            defaultValue={user.email}
            readOnly
          />
        </fieldset>

        <fieldset className="mb-4">
          <label className="label">Phone Number</label>
          <input
            type="tel"
            name="number"
            className="input input-bordered w-full"
            placeholder="Phone Number"
            required
          />
        </fieldset>

        <input
          type="submit"
          className=" w-full px-5 py-2 border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
          value="Purchase"
        />
      </form>
    </div>
  );
};

export default OrderNow;
