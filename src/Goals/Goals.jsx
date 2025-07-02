import React from 'react';

const Goals = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col-reverse gap-8  lg:flex-row ">
      <div>
        <img
          src="https://i.ibb.co/Q7mwcDJz/h4-img-01.jpg"
          alt=""
          className="h-[700px] w-full object-cover mt-8 rounded-tl-[200px] shadow-lg"
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <h2 className="text-4xl text-center font-bold my-6 px-5 py-2 border-b-2 rounded-2xl">
          Our Goals
        </h2>
        <p className="text-lg text-center max-w-2xl mx-auto mb-8">
          Our goal is to provide a platform that connects food lovers with a
          wide variety of cuisines, ensuring that everyone can find something
          they love. We aim to support local restaurants and chefs by offering
          them a space to showcase their culinary creations.
        </p>
        <button className=" w-full px-5 py-2 border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500">
          Read More
        </button>

        <div className="flex items-center gap-10 mt-8">
          <div>
            <img
              src="https://i.ibb.co/Y4LNTsXT/h5-img4.jpg"
              alt=""
              className="h-[400px] object-cover mt-8 rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mt-4">
              Restaurant Opening Hours
            </h3>
            <p className="text-lg mt-2">Mon – thu: 10 am – 1.00 am</p>
            <p className="text-lg mt-2">Fri – sun: 10 am – 2.00 pm</p>
            <p className="text-lg mt-2">sun – sun: 10 am – 5.00pm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
