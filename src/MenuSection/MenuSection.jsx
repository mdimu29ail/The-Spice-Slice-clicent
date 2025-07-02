import React, { useState } from 'react';

// --- Sample Menu Data ---
// In a real application, this data would likely come from an API
const menuData = [
  // Main Courses
  {
    id: 'mc1',
    category: 'Main Courses',
    name: 'Moussaka Noodles',
    description: 'Chicken / Apple / Tomatoes',
    price: 11.05,
    oldPrice: null, // No old price
  },
  {
    id: 'mc2',
    category: 'Main Courses',
    name: 'Pad Thai',
    description: 'Chicken / Apple / Tomatoes',
    price: 18.0,
    oldPrice: 20.0, // Discounted
  },
  {
    id: 'mc3',
    category: 'Main Courses',
    name: 'Beef Pho',
    description: 'Chicken / Apple / Tomatoes',
    price: 15.0,
    oldPrice: null,
  },
  {
    id: 'mc4',
    category: 'Main Courses',
    name: 'Chicken Roast',
    description: 'Chicken / Apple / Tomatoes',
    price: 25.0,
    oldPrice: null,
  },

  // Other items (could be in various categories)
  {
    id: 'des1',
    category: 'Dessert',
    name: 'Chocolate Lava Cake',
    description: 'Rich chocolate, vanilla ice cream',
    price: 8.5,
    oldPrice: null,
  },
  {
    id: 'sig1',
    category: 'Signature',
    name: "Chef's Special Risotto",
    description: 'Arborio rice, wild mushrooms, truffle oil',
    price: 32.0,
    oldPrice: null,
  },
  {
    id: 'st1',
    category: 'Starter',
    name: 'Spring Rolls',
    description: 'Crispy vegetables, sweet chili dip',
    price: 7.5,
    oldPrice: null,
  },
  {
    id: 'dr1',
    category: 'Drinks',
    name: 'Fresh Orange Juice',
    description: 'Squeezed daily',
    price: 4.0,
    oldPrice: null,
  },
  {
    id: 'ff1',
    category: 'Fast Food',
    name: 'Classic Burger',
    description: 'Beef patty, lettuce, tomato, cheese',
    price: 12.0,
    oldPrice: null,
  },

  // Items from the image, but categorized for demonstration
  {
    id: 'img1',
    category: 'Main Courses', // Assuming based on other items
    name: 'Creamy Biscuits',
    description: 'Chicken / Apple / Tomatoes',
    price: 45.0,
    oldPrice: null,
  },
  {
    id: 'img2',
    category: 'Main Courses', // Assuming based on other items
    name: 'Fish and Chips',
    description: 'Chicken / Apple / Tomatoes',
    price: 18.0,
    oldPrice: null,
  },
  {
    id: 'img3',
    category: 'Fast Food', // Or Starter, based on item type
    name: 'Falafel Wrap',
    description: 'Chicken / Apple / Tomatoes',
    price: 2.0,
    oldPrice: 3.0, // Discounted
  },
  {
    id: 'img4',
    category: 'Main Courses', // Assuming based on other items
    name: 'Beef Stroganoff',
    description: 'Chicken / Apple / Tomatoes',
    price: 45.0,
    oldPrice: null,
  },
];

const MenuSection = () => {
  // Extract unique categories from the data, maintaining order for initial display
  const categories = [
    'Main Courses',
    'Dessert',
    'Signature',
    'Starter',
    'Drinks',
    'Fast Food',
    // Add any other categories you have in your data
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]); // Default to 'Main Courses'

  const filteredItems = menuData.filter(
    item => item.category === activeCategory
  );

  return (
    <section className=" py-16 px-4 md:px-8 lg:px-16 shadow-2xl">
      <div className="container mx-auto">
        <h2 className="text-center font-serif text-4xl md:text-5xl  mb-12">
          Our Special
        </h2>

        {/* Category Navigation */}
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-3 md:gap-x-8 md:gap-y-0 border-b rounded-2xl shadow-2xl pb-6 mb-12">
          {categories.map(category => (
            <button
              key={category}
              className={`
                text-lg md:text-xl font-medium py-2 px-4 transition-colors duration-200 rounded-2xl
                ${
                  activeCategory === category
                    ? ' border-b-2 border-green-800'
                    : ' hover:text-green-700 hover:border-b-2 hover:border-green-400'
                }
              `}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-8">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div
                key={item.id}
                className="pb-6 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-2xl font-semibold ">{item.name}</h3>
                  <div className="flex items-baseline font-bold ">
                    {item.oldPrice && (
                      <span className="text-base  line-through mr-2">
                        ${item.oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-lg">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <p className=" text-sm">{item.description}</p>
              </div>
            ))
          ) : (
            <p className="md:col-span-2 text-center  text-lg">
              No items found in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
