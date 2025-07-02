import React, { use, useState } from 'react';
import TableRow from './TableRow';
import Swal from 'sweetalert2';
import {} from 'react-router';

const Table = ({ myApplicationPromise }) => {
  const application = use(myApplicationPromise);
  const [lists, setLists] = useState(application);

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

      fetch(
        `https://my-assignment-11-server-lac.vercel.app/applications/${id}`,
        { method: 'DELETE' }
      )
        .then(res => res.json())
        .then(data => {
          if (data.deletedCount > 0) {
            Swal.fire('Deleted!', 'The group has been deleted.', 'success');
            setLists(prev => prev.filter(item => item._id !== id));
          } else {
            Swal.fire('Error!', 'Group was not deleted.', 'error');
          }
        })
        .catch(() => Swal.fire('Error!', 'Something went wrong.', 'error'));
    });
  };

  return (
    <div className="w-full overflow-x-auto shadow-2xl rounded-lg my-10">
      <table className="min-w-full divide-y text-sm md:text-base">
        {/* Desktop / tablet header */}
        <thead className=" md:table-header-group hidden md:table">
          <tr>
            <th className="px-4 py-3 text-left font-semibold ">#</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Foods</th>
            <th className="px-4 py-3 text-left font-semibold">Price</th>
            <th className="px-4 py-3 text-left font-semibold">Purchase</th>
            <th className="px-4 py-3 text-left font-semibold">Delete</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {lists.map((list, index) => (
            <TableRow
              key={list._id}
              index={index}
              list={list}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
