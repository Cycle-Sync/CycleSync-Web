import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import { setAuthToken } from '../auth';

function Register({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    date_of_birth: '',
    country: '',
    cycle_type: 'unknown',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      setAuthToken(response.data.access, response.data.refresh);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country (e.g., US)"
          required
        />
        <select name="cycle_type" value={formData.cycle_type} onChange={handleChange}>
          <option value="regular">Regular</option>
          <option value="irregular">Irregular</option>
          <option value="unknown">Unknown</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register; // Ensure default export