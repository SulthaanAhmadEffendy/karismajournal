import React, { useEffect, useState } from 'react';
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

const User = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [addUserMessage, setAddUserMessage] = useState('');
  const [isAddUserError, setIsAddUserError] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        'https://api.bariqfirjatullah.my.id/api/user',
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoadingDelete(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://api.bariqfirjatullah.my.id/api/user/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('User deleted successfully.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      fetchUsers();
    } catch (error) {
      console.log('Error deleting user:', error);
      setLoadingDelete(false);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleDeleteClick = (user) => {
    openDeleteModal(user);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const closeEditModal = () => {
    setEditUser(null);
    setModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (editUser) {
      setEditUser((prev) => ({
        ...prev,
        [id]: value,
      }));
    } else {
      setNewUser((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingAdd(true);
    setAddUserMessage('');

    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      setAddUserMessage('Please fill in all fields.');
      setIsAddUserError(true);
      setLoadingAdd(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://api.bariqfirjatullah.my.id/api/user',
        {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
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
        setAddUserMessage('User added successfully.');
        setIsAddUserError(false);
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'employee',
        });
        fetchUsers();
        setTimeout(() => {
          setAddUserMessage('');
        }, 3000);
      } else {
        setAddUserMessage(
          `Failed to add user. Status code: ${response.status}`
        );
        setIsAddUserError(true);
        setTimeout(() => {
          setAddUserMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      setAddUserMessage(`Error: ${error.message}`);
      setIsAddUserError(true);
      setLoadingAdd(false);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setLoadingEdit(true);
    setMessage('');

    if (
      !editUser.name ||
      !editUser.email ||
      !editUser.password ||
      !editUser.role
    ) {
      setMessage('Please fill in all fields.');
      setIsError(true);
      setLoadingEdit(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `https://api.bariqfirjatullah.my.id/api/user/${editUser.id}`,
        {
          name: editUser.name,
          email: editUser.email,
          password: editUser.password,
          role: editUser.role,
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
        setMessage('User updated successfully.');
        setIsError(false);
        fetchUsers();
        closeEditModal();
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(`Failed to update user. Status code: ${response.status}`);
        setIsError(true);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating user:', error);
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
    } finally {
      setLoadingEdit(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'indigo';
      case 'coordinator':
        return 'amber';
      case 'employee':
        return 'green';
    }
  };

  return (
    <>
      <Card>
        <div className='container mx-auto'>
          <div className='bg-white p-6'>
            <h2 className='text-lg font-semibold mb-4'>Add User</h2>

            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='mb-4'>
                  <label htmlFor='name' className='block text-gray-700 mb-2'>
                    Name
                  </label>
                  <input
                    id='name'
                    value={newUser.name}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='email' className='block text-gray-700 mb-2'>
                    Email
                  </label>
                  <input
                    id='email'
                    value={newUser.email}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='password'
                    className='block text-gray-700 mb-2'
                  >
                    Password
                  </label>
                  <input
                    id='password'
                    type='password'
                    value={newUser.password}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='role' className='block text-gray-700 mb-2'>
                    Role
                  </label>
                  <select
                    id='role'
                    value={newUser.role}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded'
                  >
                    <option value='employee'>Employee</option>
                    <option value='coordinator'>Coordinator</option>
                  </select>
                </div>
              </div>

              <Button
                type='submit'
                size='md'
                className='bg-blue-500 hover:bg-blue-700 text-white rounded'
                disabled={loadingAdd}
              >
                {loadingAdd ? 'Adding...' : 'Add'}
              </Button>
            </form>
            {addUserMessage && (
              <div
                className={`mt-4 p-4 rounded ${
                  isAddUserError
                    ? 'bg-red-200 text-red-800'
                    : 'bg-green-200 text-green-800'
                }`}
              >
                {addUserMessage}
              </div>
            )}
          </div>
          <hr className='border-t border-black my-4'></hr>
          <CardBody>
            <div className='text-center mb-5 font-bold'>Users List</div>
            {message && (
              <div
                className={`text-start ${
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
                    <th className='py-3 px-4 text-left'>Name</th>
                    <th className='py-3 px-4 text-left'>Email</th>
                    <th className='py-3 px-4 text-left'>Role</th>
                    <th className='py-3 px-4 text-left'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan='5' className='text-center py-4'>
                        Processing...
                      </td>
                    </tr>
                  ) : users.length ? (
                    users.map((item) => (
                      <tr key={item.id} className='border-t'>
                        <td className='py-3 px-4'>{item.name}</td>
                        <td className='py-3 px-4'>{item.email}</td>
                        <td className={`py-2 px-4`}>
                          <Chip
                            value={item.role}
                            className='w-fit'
                            color={getRoleColor(item.role)}
                          />
                        </td>
                        <td className='py-3 px-4 flex space-x-2'>
                          <Button
                            onClick={() => handleEditClick(item)}
                            className='py-2 px-2 text-xs'
                            color='amber'
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(item)}
                            className='py-2 px-2 text-xs'
                            disabled={loadingDelete}
                            color='red'
                          >
                            {loadingDelete ? 'Deleting...' : 'Delete'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='5' className='text-center py-4'>
                        No Users Found.
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
        <DialogHeader>Edit User</DialogHeader>
        <DialogBody>
          {editUser && (
            <form onSubmit={handleEditSubmit}>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-gray-700 mb-2'>
                  Name
                </label>
                <input
                  id='name'
                  value={editUser.name}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='email' className='block text-gray-700 mb-2'>
                  Email
                </label>
                <input
                  id='email'
                  value={editUser.email}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='password' className='block text-gray-700 mb-2'>
                  Password
                </label>
                <input
                  id='password'
                  type='password'
                  value={editUser.password}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor='role' className='block text-gray-700 mb-2'>
                  Role
                </label>
                <select
                  id='role'
                  value={editUser.role}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded'
                  required
                >
                  <option value='employee'>Employee</option>
                  <option value='coordinator'>Coordinator</option>
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

      <Dialog
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        size='xs'
        className='overflow-auto'
      >
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete user with the name "
          {userToDelete?.name}"?
        </DialogBody>
        <DialogFooter>
          <Button
            color='red'
            className='mr-2'
            onClick={() => {
              deleteUser(userToDelete.id);
              closeDeleteModal();
            }}
            disabled={loadingDelete}
          >
            {loadingDelete ? 'Deleting' : 'Delete'}
          </Button>
          <Button color='blue' onClick={closeDeleteModal}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default User;
