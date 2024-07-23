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
import IndexJr from './Journal/IndexJr';

const icon = {
  className: 'w-5 h-5 text-inherit',
};

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
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: 'profile',
      //   path: '/profile',
      //   element: <Profile />,
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: 'journals',
        path: '/journals',
        element: <IndexJr />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: 'notifications',
      //   path: '/notifications',
      //   element: <Notifications />,
      // },
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
