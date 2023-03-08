import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import App from './js/App';
import ErrorPage from './js/error-page';
import VerseDisplay from './js/VerseDisplay';
import Search from './js/Search';
import RoadMap from './js/Roadmap';

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "concordance/search",
      element: <Search />
    },
    {
      path: "concordance/display/:word",
      element: <VerseDisplay />
    },
    {
      path: "roadmap",
      element: <RoadMap />
    }
  ]
}])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

