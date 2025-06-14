import React, { useState, useEffect } from 'react';

export default function EditRecordModal({ record, onClose, onSave }) {
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');

  useEffect(() => {
    if (record) {
      setArtist(record.artist);
      setAlbum(record.album);
    }
  }, [record]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ artist, album });
  };

  if (!record) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Record</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist"
            style={styles.input}
          />
          <input
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            placeholder="Album"
            style={styles.input}
          />
          <div style={styles.buttons}>
            <button type="submit" style={styles.save}>
              Save
            </button>
            <button type="button" style={styles.cancel} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '300px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  save: {
    background: 'green',
    color: 'white',
    padding: '0.5rem 1rem',
  },
  cancel: {
    background: 'gray',
    color: 'white',
    padding: '0.5rem 1rem',
  },
};
