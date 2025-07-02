import Swal from 'sweetalert2';

const TableRow = ({ list, index, handleDelete }) => {
  const {
    _id,
    name,
    category,
    image_url,
    price_usd,
    rating,
    purchase_count = 0,
  } = list;

  return (
    <tr className="border-b md:border-none block md:table-row">
      {/* Index */}
      <th className="block md:table-cell px-4 py-2 font-semibold">
        <span className="md:hidden font-medium"># </span>
        {index + 1}
      </th>

      <td className="block md:table-cell px-4 py-2">
        <span className="md:hidden font-medium">Name: </span>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={image_url} alt={name} />
            </div>
          </div>
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-sm opacity-60">Rating : {rating}</div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="block md:table-cell px-4 py-2">
        <span className="md:hidden font-medium">Category: </span>
        {category}
      </td>

      {/* Price */}
      <td className="block md:table-cell px-4 py-2 md:text-left">
        <span className="md:hidden font-medium">Price: </span>${price_usd}
      </td>

      {/* Purchases */}
      <td className="block md:table-cell px-4 py-2">
        <span className="md:hidden font-medium">Purchased: </span>
        <span className="badge badge-ghost badge-sm">{purchase_count}</span>
      </td>

      {/* Delete button */}
      <td className="block md:table-cell px-4 py-2">
        <span className="md:hidden font-medium"></span>
        <button
          onClick={() => handleDelete(_id)}
          className="px-4 py-2  border-b-2 rounded-2xl hover:border-green-600 hover:text-green-500 transition-colors font-bold dark:hover:bg-gray-500"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
