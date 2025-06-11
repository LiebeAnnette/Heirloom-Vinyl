import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_RECORDS, ADD_RECORD } from '../utils/queries';
import { loggedIn, logout } from '../utils/auth';

export default function RecordLibrary() {
  const { loading, data, refetch } = useQuery(GET_MY_RECORDS);
  const [addRecord] = useMutation(ADD_RECORD);
  const [formState, setFormState] = useState({ artist: '', album: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRecord({ variables: formState });
      setFormState({ artist: '', album: '' });
      refetch(); // refresh the list
    } catch (err) {
      console.error(err);
    }
  };

  if (!loggedIn()) {
    return (
      <div>
        <p>You must be logged in to view your collection.</p>
        <a href="/login">Log In</a> | <a href="/signup">Sign Up</a>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Record Collection</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          name="artist"
          placeholder="Artist"
          value={formState.artist}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="album"
          placeholder="Album"
          value={formState.album}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Record</button>
      </form>

      <button onClick={() => { logout(); window.location.assign('/'); }}>
        Log Out
      </button>

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <ul>
          {data?.myRecords?.map((record) => (
            <li key={record._id}>
              <strong>{record.artist}</strong> — <em>{record.album}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
