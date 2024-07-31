import {
  FolderIcon,
  TableCellsIcon,
  KeyIcon,
  UserIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { SignIn, SignUp } from '@/pages/auth';
import Index from './Categories/Index';
import IndexJr from './Journal/IndexJr';
import User from './User/User';
import Coordinator from './Coordinator/Coordinator';

const icon = {
  className: 'w-5 h-5 text-inherit',
};

const userRole = localStorage.getItem('role');

export const routes = [
  {
    layout: 'dashboard',
    pages: [
      {
        icon: <FolderIcon {...icon} />,
        name: 'Categories',
        path: '/categories',
        element: <Index />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: 'journals',
        path: '/journals',
        element: <IndexJr />,
      },
      {
        icon: <KeyIcon {...icon} />,
        name: 'coordinators',
        path: '/coordinators',
        element: <Coordinator />,
      },
      ...(userRole === 'admin' || userRole === 'coordinator'
        ? [
            {
              icon: <UserIcon {...icon} />,
              name: 'users',
              path: '/users',
              element: <User />,
            },
          ]
        : []),
    ],
  },
  {
    title: 'auth pages',
    layout: 'auth',
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: 'sign in',
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: 'sign up',
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
