import React, { useState } from 'react';
import '../scss/pages/login.scss';
import { ToastContainer } from 'react-toastify';
import useAuth from '../hooks/useAuth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    handleLogin({ email, password });
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