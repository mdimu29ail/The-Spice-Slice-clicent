import React from 'react';
import { Link } from 'react-router';
import Banner1 from '../../src/assets/img/banner-1.jpg';
import Banner2 from '../../src/assets/img/banner-2.jpg';
import Banner3 from '../../src/assets/img/banner-3.jpg';
import Banner4 from '../../src/assets/img/banner-4.jpg';
// import Banner5 from '../../src/assets/img/banner-5.jpg';
// import Banner6 from '../../src/assets/img/banner-6.jpg';

const Banner = () => {
  return (
    <div className="carousel w-full h-[500px] relative overflow-hidden">
      {/* Slide 1 */}
      <div id="slide1" className="carousel-item relative w-full">
        <img
          src={Banner1}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Nature"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="absolute top-1/2 left-1/2 text-center text-white z-20 -translate-x-1/2 -translate-y-1/2 space-y-4">
          <h2 className="text-4xl font-bold">
            "An Evening Full of Flavors & Friendship!"
          </h2>
          <p className="text-lg">
            Spice up your hangouts with mouthwatering deshi dishes and a cozy
            vibe — only at Adda Bari. Gather your friends and drop by today!
          </p>
          <Link to="/allFoods">
            <button className="px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
              Explore More
            </button>
          </Link>
        </div>
        <div className="absolute left-5 right-5 top-1/2 flex justify-between -translate-y-1/2 z-20">
          <a href="#slide4" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide2" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>

      {/* Slide 2 */}
      <div id="slide2" className="carousel-item relative w-full">
        <img
          src={Banner2}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Mountains"
        />
        <div className="absolute inset-0 bg-black opacity-80 z-10"></div>
        <div className="absolute top-1/2 left-1/2 text-center text-white z-20 -translate-x-1/2 -translate-y-1/2 space-y-4">
          <h2 className="text-4xl font-bold">
            "Your Hunger, Our Responsibility!"
          </h2>

          <p className="text-lg">
            From authentic Bengali meals to international delights, we serve
            happiness on every plate — with warmth and care you’ll remember.
          </p>

          <Link to="/allFoods">
            <button className=" px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
              Explore More
            </button>
          </Link>
        </div>
        <div className="absolute left-5 right-5 top-1/2 flex justify-between -translate-y-1/2 z-20">
          <a href="#slide1" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide3" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>

      {/* Slide 3 */}
      <div id="slide3" className="carousel-item relative w-full">
        <img
          src={Banner3}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Adventure"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="absolute top-1/2 left-1/2 text-center text-white z-20 -translate-x-1/2 -translate-y-1/2 space-y-4">
          <h2 className="text-4xl font-bold">
            "Where Taste Meets Togetherness!"
          </h2>
          <p className="text-lg">
            Looking for the perfect spot to chill with friends or family? Adda
            Bari is your go-to destination for good food and great
            conversations.
          </p>
          <Link to="/allFoods">
            <button className="px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
              Explore More
            </button>
          </Link>
        </div>
        <div className="absolute left-5 right-5 top-1/2 flex justify-between -translate-y-1/2 z-20">
          <a href="#slide2" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide4" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>

      {/* Slide 4 */}
      <div id="slide4" className="carousel-item relative w-full">
        <img
          src={Banner4}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Serenity"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="absolute top-1/2 left-1/2 text-center text-white z-20 -translate-x-1/2 -translate-y-1/2 space-y-4">
          <h2 className="text-4xl font-bold">Discover Serenity</h2>

          <p className="text-lg">
            Experience the calm and beauty of nature like never before.
          </p>
          <Link to="/allFoods">
            <button className="px-5 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
              Explore More
            </button>
          </Link>
        </div>
        <div className="absolute left-5 right-5 top-1/2 flex justify-between -translate-y-1/2 z-20">
          <a href="#slide3" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide1" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
