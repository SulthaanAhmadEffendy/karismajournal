import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardBody } from '@material-tailwind/react';

function Index() {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.get(
        'https://journal.bariqfirjatullah.pw/api/category',
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `https://journal.bariqfirjatullah.pw/api/category/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Category deleted successfully.');
      setIsError(false);
      setTimeout(() => {
        setMessage('');
      }, 3000);
      fetchCategories();
    } catch (error) {
      setMessage('Error deleting category:', error);
      if (error.response && error.response.status === 500) {
        setMessage('Error, categories related to journals.');
      } else {
        setMessage('Failed to delete category.');
      }
      setIsError(true);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure to delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <Card className=''>
      <div className='text-center m-5 font-bold '>CATEGORY</div>
      <div className='container mx-auto'>
        <div className='flex justify-center mb-3'>
          <Link
            to='add'
            className='inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
          >
            Add New Category
          </Link>
        </div>
        <CardBody>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[320px] table-auto rounded-lg'>
              <thead className='bg-gray-800 text-white rounded-t-lg'>
                <tr>
                  <th className='py-3 px-4 text-left'>Category Jobs</th>
                  <th className='py-3 px-4 text-left'>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='2' className='text-center py-4'>
                      Processing...
                    </td>
                  </tr>
                ) : categories.length ? (
                  categories.map((item) => (
                    <tr key={item.id} className='border-t'>
                      <td className='py-3 px-4'>{item.name}</td>
                      <td className='py-3 px-4 flex space-x-2'>
                        <Button className='bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 text-xs'>
                          <Link to={`edit/${item.id}`} className='inline-block'>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(item.id)}
                          className='bg-red-500 hover:bg-red-700 text-white py-2 px-2 text-xs'
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='2' className='text-center py-4'>
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </div>
      {message && (
        <p
          className={`text-center mt-4 ${
            isError ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {message}
        </p>
      )}
    </Card>
  );
}

export default Index;
