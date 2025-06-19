import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

// Define prop types
interface RecordType {
  _id: string;
  artist: string;
  album: string;
  genre?: string;
  isFavorite?: boolean;
  listened?: boolean;
}

interface EditRecordModalProps {
  record: RecordType;
  onClose: () => void;
  onSave: (updated: {
    artist: string;
    album: string;
    genre?: string;
    isFavorite?: boolean;
    listened?: boolean;
  }) => void;
}

export default function EditRecordModal({
  record,
  onClose,
  onSave,
}: EditRecordModalProps) {
  const [artist, setArtist] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [listened, setListened] = useState<boolean>(false);

  useEffect(() => {
    if (record) {
      setArtist(record.artist);
      setAlbum(record.album);
      setGenre(record.genre || "");
      setIsFavorite(record.isFavorite || false);
      setListened(record.listened || false);
    }
  }, [record]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ artist, album, genre, isFavorite, listened });
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  if (!record) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Record</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            value={artist}
            onChange={handleChange(setArtist)}
            placeholder="Artist"
            style={styles.input}
          />
          <input
            value={album}
            onChange={handleChange(setAlbum)}
            placeholder="Album"
            style={styles.input}
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={styles.input}
          >
            <option value="">-- Select Genre --</option>
            <option value="Rock">Rock</option>
            <option value="Jazz">Jazz</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="Classical">Classical</option>
            <option value="Other">Other</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
            />{" "}
            Favorite
          </label>

          <label>
            <input
              type="checkbox"
              checked={listened}
              onChange={(e) => setListened(e.target.checked)}
            />{" "}
            Listened
          </label>

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

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    width: "300px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  save: {
    background: "green",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
  },
  cancel: {
    background: "gray",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
  },
};
