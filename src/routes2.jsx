import {
  FolderIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { Home, Profile, Tables, Notifications } from '@/pages/dashboard';
import { SignIn, SignUp } from '@/pages/auth';
import Index from './Categories/Index';
import Add from './Categories/Add';
import Edit from './Categories/Edit';

const icon = {
  className: 'w-5 h-5 text-inherit',
};

export const routes2 = [
  {
    layout: 'categories',
    pages: [
      {
        name: 'add categories',
        path: '/categories/add',
        element: <Add />,
      },
      {
        name: 'edit categories',
        path: '/categories/edit/:id',
        element: <Edit />,
      },
    ],
  },
];

export default routes2;
