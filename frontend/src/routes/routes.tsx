import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from '../pages/login'
import Users from '../pages/users';

const router = createBrowserRouter([
  {
    path: 'login',
    Component: Login
  },
  {
    path: 'users',
    Component: Users
  },
  {
    ErrorBoundary: Login
  }
]);

const Routes = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Routes