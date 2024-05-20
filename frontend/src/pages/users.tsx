import { useEffect, useState } from 'react';
import '../scss/pages/users.scss';
import { ToastContainer, toast } from 'react-toastify';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

interface Users {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState([] as Users[]);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [userSelectedId, setUserSelectedId] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogout } = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
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

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get(`/users/${userSelectedId}`);
        const user = data as any;
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message
        );
      }
    }

    if (userSelectedId && openUserForm) {
      fetchUser();
    }
  }, [userSelectedId, openUserForm]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      const newUsers = users.filter((user: Users) => user.id !== id);
      setUsers(newUsers);
      toast.success('User deleted successfully!');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message
      );
    }
  };

  const handleSubmitUserForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userSelectedId) {
        const { data } = await api.put(`/users/${userSelectedId}`, {
          name,
          email,
          password
        });

        console.log(data)

        const newUsers = users.map((user: Users) => {
          if (user.id === userSelectedId) {
            return {
              id: user.id,
              name: data.user.name,
              email: data.user.email,
            } as Users;
          }

          return user;
        });

        setUsers(newUsers);
        toast.success('User updated successfully!');
      } else {
        const { data } = await api.post('/users', {
          name,
          email,
          password
        });

        const userCreated = data.user as never;
        setUsers([...users, userCreated]);

        toast.success('User created successfully!');
      }

      setOpenUserForm(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message
      );
    }
  };

  return (
    <div className='user-list'>
      <div className='users-wrapper'>
        <h1 className='user-title'>Users</h1>

        <div className='user-actions'>
          <button
            className='button logout'
            type='button'
            onClick={() => handleLogout()}
          >
            Logout
          </button>

          <button
            className='button'
            type='button'
            onClick={() => {
              setUserSelectedId(0);
              setOpenUserForm(!openUserForm);
              setName('');
              setEmail('');
              setPassword('');
            }}
          >
            {!openUserForm ? 'Create User' : 'Cancel'}
          </button>
        </div>
      </div>

      {openUserForm && (
        <div className='user-form'>
          <div className='content'>
            <h2>{userSelectedId ? 'Edit' : 'Create'} User</h2>
            <form onSubmit={handleSubmitUserForm}>
              <div className='field-wrapper'>
                <label htmlFor='name'>Name</label>
                <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className='field-wrapper'>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='field-wrapper'>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type='submit'>{userSelectedId ? 'Edit' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}

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
          {users.map((user: Users) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className='table-actions'>
                <button
                  className='edit-button'
                  type='button'
                  onClick={() => {
                    setUserSelectedId(user.id);
                    setOpenUserForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className='delete-button'
                  type='button'
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
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