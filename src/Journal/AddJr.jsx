import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddJr() {
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('progress');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          'https://journal.bariqfirjatullah.pw/api/category',
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === 'startAt') setStartAt(value);
    if (id === 'endAt') setEndAt(value);
    if (id === 'categoryId') setCategoryId(value);
    if (id === 'description') setDescription(value);
    if (id === 'status') setStatus(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const formattedStartAt = new Date(startAt)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      const formattedEndAt = new Date(endAt)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      const response = await axios.post(
        'https://journal.bariqfirjatullah.pw/api/journal',
        {
          start_at: formattedStartAt,
          end_at: formattedEndAt,
          category_id: categoryId,
          description,
          status,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage('add data success!');
        setTimeout(() => {
          setMessage('');
        }, 3000);
        setStartAt('');
        setEndAt('');
        setCategoryId('');
        setDescription('');
        setStatus('progress');
        setTimeout(() => {
          navigate('/dashboard/journals');
        }, 1500);
      } else {
        setMessage(`Failed Add data. Status code: ${response.status}`);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding journal:', error.response.data);
      setMessage(`Error Occured: ${error.response.data.message}`);
    }
  };

  return (
    <div className='p-6 bg-white shadow-md rounded-md'>
      <h2 className='text-lg font-semibold mb-4'>Add Journal</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='startAt' className='block text-gray-700 mb-2'>
            Start At
          </label>
          <input
            type='datetime-local'
            id='startAt'
            value={startAt}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='endAt' className='block text-gray-700 mb-2'>
            End At
          </label>
          <input
            type='datetime-local'
            id='endAt'
            value={endAt}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='categoryId' className='block text-gray-700 mb-2'>
            Category
          </label>
          <select
            id='categoryId'
            value={categoryId}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded'
            required
          >
            <option value=''>Choose Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='description' className='block text-gray-700 mb-2'>
            Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='status' className='block text-gray-700 mb-2'>
            Status
          </label>
          <select
            id='status'
            value={status}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded'
          >
            <option value='progress'>Progress</option>
            <option value='pending'>Pending</option>
            <option value='cancel'>Cancel</option>
            <option value='complete'>Complete</option>
          </select>
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
        >
          Add
        </button>
      </form>
      {message && <p className='mt-4 text-green-500'>{message}</p>}
    </div>
  );
}

export default AddJr;
