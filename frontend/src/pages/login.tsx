import React, { useState } from 'react';
import '../styles/pages/login.scss';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
      const user = await api.post('/login', {
        email: email,
        password: password
      });

      console.log(user);

      //navigate('/users');
    } catch (error: any) {
      console.log(error?.message)
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
    </form>
  );
}

export default Login;