const ShowFoods = ({ foods }) => {
  console.log(foods);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 shadow-2xl p-4 shadow-lime-50">
      {foods.map(food => (
        <div key={food._id} className="border p-4 rounded shadow">
          <h2 className="text-lg font-bold">{food.name}</h2>
          <p>{food.category}</p>
          <p>Price: ${food.price_usd}</p>
          <p className="">Purchased: {food.purchase_count || 0} times</p>
        </div>
      ))}
    </div>
  );
};

export default ShowFoods;
