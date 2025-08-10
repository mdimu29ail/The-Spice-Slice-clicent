// ProfileCard.jsx
import React, { useContext } from 'react';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiGlobe,
  FiLogOut,
} from 'react-icons/fi';
import { AuthContext } from '../Auth/AuthContext';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const ProfileCard = () => {
  const { user, loading, logOut } = useContext(AuthContext);

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
        No user logged in
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await logOut();

      Swal.fire({
        icon: 'success',
        title: 'Logout successful!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 1600);
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout failed',
        text: error.message,
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      {/* Top Section */}
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <img
          src={user.photoURL || 'https://via.placeholder.com/120'}
          alt={user.displayName || 'User'}
          className="w-24 h-24 rounded-full border-4 border-purple-500"
        />

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {user.displayName || 'Anonymous'}
          </h2>
          <p className="text-purple-600 font-medium">MERN Stack Developer</p>

          {/* Contact */}
          <div className="flex items-center gap-4 mt-2 text-gray-600 text-sm flex-wrap">
            <span className="flex items-center gap-1">
              <FiMail /> {user.email || 'Not provided'}
            </span>
            <span className="flex items-center gap-1">
              <FiPhone /> +000 000 0000
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin /> Dhaka, Bangladesh
            </span>
          </div>
        </div>

        {/* Example Static Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-xl font-bold">25</div>
            <div className="text-sm text-gray-500">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">1.2k</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">98%</div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
        </div>
      </div>

      {/* More Information */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">More Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <FiCalendar /> Joined: Jan 2023
          </p>
          <p className="flex items-center gap-2">
            <FiGlobe /> Website:{' '}
            <a
              href="https://imamul-portfolio.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              Portfolio
            </a>
          </p>
          <p className="md:col-span-2">
            <strong>Bio:</strong> Passionate developer with 5+ years of
            experience in building modern web applications using React, Node.js,
            and other latest technologies.
          </p>
          <p className="md:col-span-2">
            <strong>Skills:</strong> React, Node.js, Tailwind CSS, MongoDB,
            Firebase
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="border-t pt-4 flex justify-end">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
