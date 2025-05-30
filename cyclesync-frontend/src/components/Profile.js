import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api';

function Profile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date_of_birth"
          value={profile.date_of_birth || ''}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          value={profile.country || ''}
          onChange={handleChange}
          placeholder="Country"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Profile; // Ensure default export