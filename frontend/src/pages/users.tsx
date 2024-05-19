import { useEffect, useState } from 'react';
import '../styles/pages/users.scss';
import { ToastContainer, toast } from 'react-toastify';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await api.get('/users');
        console.log(data)
        //setUsers(data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || 
          error?.response?.data?.error || 
          error?.message
        );
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className='user-list'>
      <div className='users-wrapper'>
        <h1 className='user-title'>Users</h1>

        <div className='user-actions'>
          <button className='button' type='button'>Create User</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>

      <ToastContainer
        closeOnClick={true}
        position='bottom-right'
        hideProgressBar={false}
        closeButton={false}
      />
    </div>
  )
}

export default Users