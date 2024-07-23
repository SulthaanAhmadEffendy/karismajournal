import AddJr from './Journal/AddJr';
import EditJr from './Journal/EditJr';

const icon = {
  className: 'w-5 h-5 text-inherit',
};

export const routes3 = [
  {
    layout: 'journals',
    pages: [
      {
        name: 'add journals',
        path: '/journals/add',
        element: <AddJr />,
      },
      {
        name: 'edit journals',
        path: '/journals/edit/:id',
        element: <EditJr />,
      },
    ],
  },
];

export default routes3;
