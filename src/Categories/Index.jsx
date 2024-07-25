import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardBody, Dialog } from '@material-tailwind/react';

function Index() {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [loadingAdd, setIsLoadingAdd] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJournal, setEditJournal] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
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

  const handleEditClick = (category) => {
    setEditJournal(category);
    setName(category.name);
    setEditId(category.id);
    setModalOpen(true);
  };

  const closeEditModal = () => {
    setEditJournal(null);
    setName('');
    setEditId(null);
    setModalOpen(false);
  };

  const handleEditChange = (e) => {
    setName(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `https://journal.bariqfirjatullah.pw/api/category/${editId}`,
        { name },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage('Category updated successfully.');
        setIsError(false);
        setTimeout(() => {
          setMessage('');
        }, 3000);

        setTimeout(() => {
          navigate('/dashboard/categories');
        }, 1500);
        fetchCategories();
        closeEditModal();
      } else {
        setMessage(
          `Failed to update category. Status code: ${response.status}`
        );
        setIsError(true);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      setMessage(`Error: ${error.message}`);
      setIsError(true);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleInputChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setIsLoadingAdd(true);
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
        fetchCategories();
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
      setIsLoadingAdd(false);
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
    <>
      <Card className=''>
        <div className='p-6  rounded-md'>
          <h2 className='text-lg font-semibold mb-4'>Add Category</h2>
          <form onSubmit={handleAddSubmit}>
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
              disabled={loadingAdd}
            >
              {loadingAdd ? 'Adding' : 'Add'}
            </button>
          </form>
        </div>

        <hr class='border-t border-black my-4'></hr>

        <div className='text-center m-2 font-bold '>CATEGORY</div>
        {message && (
          <p
            className={`text-center mt-4 ${
              isError ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {message}
          </p>
        )}
        <div className='container mx-auto'>
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
                          <Button
                            onClick={() => handleEditClick(item)}
                            className='bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-2 text-xs'
                          >
                            Edit
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
      </Card>

      <Dialog
        open={modalOpen}
        onClose={closeEditModal}
        className='w-full max-w-xs mx-auto max-h-64'
        size='xs'
      >
        <div className='p-6 bg-white shadow-md rounded-md'>
          <h2 className='text-lg font-semibold mb-4'>Edit Category</h2>
          <form onSubmit={handleEditSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='editCategoryName'
                className='text-left text-gray-700 mb-2'
              >
                Category Name
              </label>
              <input
                type='text'
                id='editCategoryName'
                value={name}
                onChange={handleEditChange}
                className='w-56 px-3 py-2 border border-gray-300 rounded ml-3'
                required
              />
            </div>
            <Button
              type='submit'
              color='blue'
              className='py-2 px-4 rounded'
              disabled={loadingEdit}
            >
              {loadingEdit ? 'Updating' : 'Update'}
            </Button>
            <Button
              color='red'
              onClick={closeEditModal}
              className='py-2 px-4 rounded ml-3'
            >
              Cancel
            </Button>
          </form>
          {message && (
            <p
              className={`mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}
            >
              {message}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}

export default Index;
