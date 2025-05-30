import React, { useState, useEffect } from 'react';
import { getDashboard } from '../api';

function Dashboard() {
  const [data, setData] = useState({ days: [], fsh: [], lh: [], estradiol: [], progesterone: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboard();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Hormone trends (to be visualized):</p>
      <ul>
        <li>Days: {data.days.join(', ')}</li>
        <li>FSH: {data.fsh.join(', ')}</li>
        <li>LH: {data.lh.join(', ')}</li>
      </ul>
    </div>
  );
}

export default Dashboard; // Ensure default export