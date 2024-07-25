import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';

const IndexJr = () => {
  const [journals, setJournals] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJournal, setEditJournal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isError, setIsError] = useState(false);
  const [newJournal, setNewJournal] = useState({
    start_at: '',
    end_at: '',
    category_id: '',
    description: '',
    status: 'progress',
  });
  const [addJournalMessage, setAddJournalMessage] = useState('');
  const [isAddJournalError, setIsAddJournalError] = useState(false);

  useEffect(() => {
    fetchJournals();
    fetchCategories();
  }, []);

  const fetchJournals = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        'https://journal.bariqfirjatullah.pw/api/journal',
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJournals(response.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch journals:', error);
      setJournals([]);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const deleteJournal = async (id) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `https://journal.bariqfirjatullah.pw/api/journal/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Journal deleted successfully.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      fetchJournals();
    } catch (error) {
      console.log('Error deleting journal:', error);
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure to delete this journal?')) {
      deleteJournal(id);
    }
  };

  const handleEditClick = (journal) => {
    setEditJournal(journal);
    setModalOpen(true);
  };

  const closeEditModal = () => {
    setEditJournal(null);
    setModalOpen(false);
  };

  const formatDateToYmdHms = (date) => {
    if (!date) return '';

    const [datePart, timePart] = date.split('T');
    if (!timePart) return `${datePart} `;

    const [hour, minute] = timePart.split(':');
    const seconds = '00';

    return `${datePart} ${hour}:${minute}:${seconds}`;
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (editJournal) {
      setEditJournal((prev) => ({
        ...prev,
        [id]:
          id === 'start_at' || id === 'end_at'
            ? formatDateToYmdHms(value)
            : value,
      }));
    } else {
      setNewJournal((prev) => ({
        ...prev,
        [id]:
          id === 'start_at' || id === 'end_at'
            ? formatDateToYmdHms(value)
            : value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingAdd(true);
    setAddJournalMessage('');

    if (
      !newJournal.start_at ||
      !newJournal.end_at ||
      !newJournal.category_id ||
      !newJournal.description ||
      !newJournal.status
    ) {
      setAddJournalMessage('Please fill in all fields.');
      setIsAddJournalError(true);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const formattedStartAt = formatDateToYmdHms(newJournal.start_at);
      const formattedEndAt = formatDateToYmdHms(newJournal.end_at);

      const response = await axios.post(
        'https://journal.bariqfirjatullah.pw/api/journal',
        {
          start_at: formattedStartAt,
          end_at: formattedEndAt,
          category_id: newJournal.category_id,
          description: newJournal.description,
          status: newJournal.status,
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
        setAddJournalMessage('Journal added successfully.');
        setIsAddJournalError(false);
        setNewJournal({
          start_at: '',
          end_at: '',
          category_id: '',
          description: '',
          status: 'progress',
        });
        fetchJournals();
        setTimeout(() => {
          setAddJournalMessage('');
        }, 3000);
      } else {
        setAddJournalMessage(
          `Failed to add journal. Status code: ${response.status}`
        );
        setIsAddJournalError(true);
        setTimeout(() => {
          setAddJournalMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding journal:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      setAddJournalMessage(`Error: ${error.message}`);
      setIsAddJournalError(true);
      setLoadingAdd(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setLoadingEdit(true);
    setMessage('');

    if (
      !editJournal.start_at ||
      !editJournal.end_at ||
      !editJournal.category_id ||
      !editJournal.description ||
      !editJournal.status
    ) {
      setMessage('Please fill in all fields.');
      setIsError(true);

      return;
    }

    try {
      const token = localStorage.getItem('token');

      const formattedStartAt = formatDateToYmdHms(editJournal.start_at);
      const formattedEndAt = formatDateToYmdHms(editJournal.end_at);

      const response = await axios.put(
        `https://journal.bariqfirjatullah.pw/api/journal/${editJournal.id}`,
        {
          start_at: formattedStartAt,
          end_at: formattedEndAt,
          category_id: editJournal.category_id,
          description: editJournal.description,
          status: editJournal.status,
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
        setMessage('Journal updated successfully.');
        setIsError(false);
        fetchJournals();
        closeEditModal();
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(`Failed to update journal. Status code: ${response.status}`);
        setIsError(true);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating journal:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
        setMessage(
          `Server Error: ${error.response.data.message || 'Unknown error'}`
        );
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(`Error: ${error.message}`);
      }
      setIsError(true);
      setLoadingEdit(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'amber';
      case 'cancel':
        return 'red';
      case 'complete':
        return 'green';
      default:
        return 'indigo';
    }
  };

  return (
    <>
      <Card>
        <div className='container mx-auto'>
          <div className='bg-white   p-6'>
            <h2 className='text-lg font-semibold mb-4'>Add Journal</h2>

            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='mb-4'>
                  <label
                    htmlFor='start_at'
                    className='block text-gray-700 mb-2'
                  >
                    Start At
                  </label>
                  <input
                    type='datetime-local'
                    id='start_at'
                    value={newJournal.start_at}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='end_at' className='block text-gray-700 mb-2'>
                    End At
                  </label>
                  <input
                    type='datetime-local'
                    id='end_at'
                    value={newJournal.end_at}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='category_id'
                    className='block text-gray-700 mb-2'
                  >
                    Category
                  </label>
                  <select
                    id='category_id'
                    value={newJournal.category_id}
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
                  <label htmlFor='status' className='block text-gray-700 mb-2'>
                    Status
                  </label>
                  <select
                    id='status'
                    value={newJournal.status}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded'
                  >
                    <option value='progress'>Progress</option>
                    <option value='pending'>Pending</option>
                    <option value='cancel'>Cancel</option>
                    <option value='complete'>Complete</option>
                  </select>
                </div>
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='description'
                  className='block text-gray-700 mb-2'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  value={newJournal.description}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  required
                ></textarea>
              </div>
              <Button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                disabled={loadingAdd}
              >
                {loadingAdd ? 'Adding...' : 'Add'}
              </Button>
            </form>
            {addJournalMessage && (
              <div
                className={`mt-4 p-4 rounded ${
                  isAddJournalError
                    ? 'bg-red-200 text-red-800'
                    : 'bg-green-200 text-green-800'
                }`}
              >
                {addJournalMessage}
              </div>
            )}
          </div>
          <hr class='border-t border-black my-4'></hr>
          <CardBody>
            <div className='text-center mb-5 font-bold'>Journals List</div>
            {message && (
              <div
                className={`text-start  ${
                  isError ? 'text-red-800' : 'text-green-800'
                }`}
              >
                {message}
              </div>
            )}
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[320px] table-auto rounded-lg'>
                <thead className='bg-gray-800 text-white'>
                  <tr>
                    <th className='py-3 px-4 text-left'>Start At</th>
                    <th className='py-3 px-4 text-left'>End At</th>
                    <th className='py-3 px-4 text-left'>Category</th>
                    <th className='py-3 px-4 text-left'>Description</th>
                    <th className='py-3 px-4 text-left'>Status</th>
                    <th className='py-3 px-4 text-left'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan='6' className='text-center py-4'>
                        Processing...
                      </td>
                    </tr>
                  ) : journals.length ? (
                    journals.map((item) => (
                      <tr key={item.id} className='border-t'>
                        <td className='py-3 px-4'>{item.start_at}</td>
                        <td className='py-3 px-4'>{item.end_at}</td>
                        <td className='py-3 px-4'>{item.category.name}</td>
                        <td className='py-3 px-4'>{item.description}</td>
                        <td className={`py-2 px-4 `}>
                          <Chip
                            color={getStatusColor(item.status)}
                            value={item.status}
                            className='w-fit'
                          />
                        </td>
                        <td className='py-3 px-4 flex space-x-2'>
                          <Button
                            onClick={() => handleEditClick(item)}
                            className=' py-2 px-2 text-xs'
                            color='amber'
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(item.id)}
                            className=' py-2 px-2 text-xs'
                            disabled={loading}
                            color='red'
                          >
                            {loading ? 'Deleting...' : 'Delete'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='6' className='text-center py-4'>
                        No Journals Found.
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
        size='lg'
        className='overflow-auto max-h-[80vh] sm:max-w-lg md:max-w-2xl lg:max-w-4xl'
      >
        <DialogHeader>Edit Journal</DialogHeader>
        <DialogBody>
          {editJournal && (
            <form onSubmit={handleEditSubmit}>
              <div className='mb-4'>
                <label htmlFor='start_at' className='block text-gray-700 mb-2'>
                  Start At
                </label>
                <input
                  type='datetime-local'
                  id='start_at'
                  value={editJournal.start_at}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='end_at' className='block text-gray-700 mb-2'>
                  End At
                </label>
                <input
                  type='datetime-local'
                  id='end_at'
                  value={editJournal.end_at}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  required
                />
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='category_id'
                  className='block text-gray-700 mb-2'
                >
                  Category
                </label>
                <select
                  id='category_id'
                  value={editJournal.category_id}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  required
                >
                  <option value=''>Choose Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='description'
                  className='block text-gray-700 mb-2'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  value={editJournal.description}
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
                  value={editJournal.status}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                >
                  <option value='progress'>Progress</option>
                  <option value='pending'>Pending</option>
                  <option value='cancel'>Cancel</option>
                  <option value='complete'>Complete</option>
                </select>
              </div>
            </form>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            color='blue'
            onClick={handleEditSubmit}
            disabled={loadingEdit}
            className='mr-3'
          >
            {loadingEdit ? 'Updating...' : 'Save'}
          </Button>
          <Button color='red' onClick={closeEditModal}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default IndexJr;
