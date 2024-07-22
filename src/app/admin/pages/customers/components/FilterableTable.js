'use client';
import { useState, useEffect } from 'react';

const FilterableTable = ({ onSelect }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user');
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.Full_Name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Filter by name..."
        className="mb-4 p-2 border rounded w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone Number</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.Full_Name}</td>
              <td className="py-2 px-4 border-b">{item.Email}</td>
              <td className="py-2 px-4 border-b">{item.Phone_No1}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => onSelect(item)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilterableTable;
