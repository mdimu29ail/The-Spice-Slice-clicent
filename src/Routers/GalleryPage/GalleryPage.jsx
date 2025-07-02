// src/components/GalleryPage.jsx
import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const images = [
  { src: 'https://i.ibb.co/b5vrr5XW/Chicken-Roast.jpg' },
  { src: 'https://i.ibb.co/Gfb52nYG/Beef-Tehari.jpg' },
  { src: 'https://i.ibb.co/0jpcLLxk/Beef-Rezala.jpg' },
  { src: 'https://i.ibb.co/ycdbqrSs/Spicy-Chicken-Biryani.jpg' },
  { src: 'https://i.ibb.co/FbqkNB4f/Panta-Ilish.jpg' },
  { src: 'https://i.ibb.co/p6WPYdJr/Mutton-Kacchi.jpg' },
  { src: 'https://i.ibb.co/CpbMwQ7w/Chicken-Tikka-Masala.jpg' },
  { src: 'https://i.ibb.co/wNhJdX58/Chocolate-Lava-Cake.jpg' },
  { src: 'https://i.ibb.co/xSFGDQgd/Margherita-Pizza.jpg' },
  { src: 'https://i.ibb.co/S4FbJM6S/Classic-Cheeseburger.jpg' },
];

const GalleryPage = () => {
  const [index, setIndex] = useState(-1); // -1 means lightbox is closed

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 ">
      <h1 className="text-5xl font-bold text-center  mb-12">The Spice Slice</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4  max-w-7xl">
        {images.map((image, i) => (
          <img
            key={i}
            src={image.src}
            alt={`Gallery ${i}`}
            className="rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md w-full h-60 object-cover"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={images}
        index={index}
      />
    </div>
  );
};

export default GalleryPage;
