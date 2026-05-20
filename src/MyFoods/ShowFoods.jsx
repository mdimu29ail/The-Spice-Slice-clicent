import React, { memo } from 'react';

/**
 * Performance: React.memo ব্যবহার করা হয়েছে যাতে প্রপস চেঞ্জ না হলে
 * এই কম্পোনেন্টটি অপ্রয়োজনীয়ভাবে রি-রেন্ডার না হয়।
 */
const ShowFoods = memo(({ foods = [] }) => {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shadow-2xl p-4 shadow-lime-50"
      aria-label="Patron Creations Gallery"
    >
      {foods.map(food => (
        <article
          key={food._id || food.id}
          className="border p-4 rounded shadow bg-white dark:bg-gray-800 transition-all"
          aria-labelledby={`food-title-${food._id || food.id}`}
        >
          {/* SEO & Accessibility: h2 ব্যবহার করা হয়েছে এবং ইউনিক আইডি দেওয়া হয়েছে */}
          <h2
            id={`food-title-${food._id || food.id}`}
            className="text-lg font-bold text-[#1a1a1a] dark:text-white"
          >
            {food.name}
          </h2>

          {/* Accessibility: স্ক্রিন রিডারের জন্য লেবেল নিশ্চিত করা হয়েছে */}
          <p className="text-gray-600 dark:text-gray-400">
            <span className="sr-only">Category: </span>
            {food.category}
          </p>

          <p
            className="font-semibold text-[#E65100]"
            aria-label={`Price: ${food.price_usd} dollars`}
          >
            Price: ${food.price_usd}
          </p>

          <p className="text-sm text-gray-500 italic">
            <span className="font-medium">Purchased:</span>{' '}
            {food.purchase_count || 0} times
          </p>
        </article>
      ))}

      {/* Empty State for SEO & UX */}
      {foods.length === 0 && (
        <div className="col-span-full text-center py-10" role="status">
          <p className="text-gray-400 uppercase tracking-widest text-xs font-black">
            No masterpieces found in this collection.
          </p>
        </div>
      )}
    </section>
  );
});

// Display Name for debugging
ShowFoods.displayName = 'ShowFoods';

export default ShowFoods;
