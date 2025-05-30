import React, { useState, useEffect } from 'react';
import { getDailyEntry, updateDailyEntry } from '../api';

function DailyLog() {
  const [entry, setEntry] = useState({
    cramps: 0, bloating: 0, tender_breasts: 0, headache: 0, acne: 0,
    mood: 3, stress: 0, energy: 3, cervical_mucus: 'none',
    sleep_quality: 3, libido: 2, notes: ''
  });

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await getDailyEntry();
        setEntry(response.data);
      } catch (error) {
        console.error('Failed to fetch entry', error);
      }
    };
    fetchEntry();
  }, []);

  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDailyEntry(entry);
      alert('Entry saved successfully!');
    } catch (error) {
      console.error('Failed to save entry', error);
    }
  };

  return (
    <div>
      <h2>Daily Log</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Cramps:
          <input
            type="range"
            name="cramps"
            min="0"
            max="5"
            value={entry.cramps}
            onChange={handleChange}
          />
        </label>
        {/* Add other fields similarly */}
        <textarea name="notes" value={entry.notes} onChange={handleChange} placeholder="Notes" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default DailyLog;