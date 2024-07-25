import { Button } from '@material-tailwind/react';
import React from 'react';

function ButtonDelete({ isLoading, handleDeleteClick, id }) {
  return (
    <Button
      onClick={() => handleDeleteClick(id)}
      className={`${
        isLoading ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-700'
      } text-white py-2 px-2 text-xs`}
      disabled={isLoading}
    >
      {isLoading ? 'Deleting...' : 'Delete'}
    </Button>
  );
}

export default ButtonDelete;
