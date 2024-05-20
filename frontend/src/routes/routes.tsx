import { BrowserRouter, Route, Routes as RoutesReact } from 'react-router-dom'
import Login from '../pages/login'
import Users from '../pages/users';
import { AuthProvider } from "../context/Auth/AuthContext";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesReact>
          <Route path='*' Component={Login} />
          <Route path='users' Component={Users} />
        </RoutesReact>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Routes