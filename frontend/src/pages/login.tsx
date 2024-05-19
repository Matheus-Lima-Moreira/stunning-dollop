import React, { useState } from 'react';
import '../styles/pages/login.scss';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await api.post('/login', {
        email: email,
        password: password
      });

      if (data) {
        navigate('/users');
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        error?.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <div className='login-form-wrapper-components'>
        <div className='field-wrapper'>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className='field-wrapper'>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Submit</button>
      </div>
      <ToastContainer 
        closeOnClick={true}
        position='bottom-right'
        hideProgressBar={false}
        closeButton={false}
      />
    </form>
  );
}

export default Login;