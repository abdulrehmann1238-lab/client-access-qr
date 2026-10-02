import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ShellLayout } from './ShellLayout';
import { Entry } from '../screens/Entry';
import { Menu } from '../screens/Menu';
import { Refill } from '../screens/Refill';
import { Documents } from '../screens/Documents';
import { Library } from '../screens/Library';
import { PdfViewer } from '../screens/PdfViewer';
import { AfterHours } from '../screens/AfterHours';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ShellLayout />,
    children: [
      {
        index: true,
        element: <Entry />,
      },
      {
        path: 'menu',
        element: <Menu />,
      },
      {
        path: 'refill',
        element: <Refill />,
      },
      {
        path: 'documents',
        element: <Documents />,
      },
      {
        path: 'library',
        element: <Library />,
      },
      {
        path: 'library/:docId',
        element: <PdfViewer />,
      },
      {
        path: 'after-hours',
        element: <AfterHours />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
