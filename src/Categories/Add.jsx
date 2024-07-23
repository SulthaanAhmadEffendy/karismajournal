import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Add() {
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://journal.bariqfirjatullah.pw/api/category',
        { name: categoryName },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage('Kategori berhasil ditambahkan!');
        setIsError(false);
        setTimeout(() => {
          setMessage('');
        }, 3000);
        setCategoryName('');
        setTimeout(() => {
          navigate('/dashboard/categories');
        }, 1500);
      } else {
        setMessage(
          `Gagal menambahkan kategori. Status code: ${response.status}`
        );
        setIsError(true);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage(`Terjadi kesalahan: ${error.message}`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-6 bg-white shadow-md rounded-md'>
      <h2 className='text-lg font-semibold mb-4'>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='categoryName'
            className='text-left text-gray-700 mb-2 '
          >
            Category Name
          </label>
          <input
            type='text'
            id='categoryName'
            value={categoryName}
            onChange={handleInputChange}
            className='w-56 px-3 py-2 border border-gray-300 rounded ml-3'
            required
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
          disabled={loading}
        >
          {loading ? 'Adding' : 'Add'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Add;
