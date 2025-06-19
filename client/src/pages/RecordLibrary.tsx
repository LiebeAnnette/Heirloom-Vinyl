import React, { useState, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { loggedIn, logout } from "../utils/auth";
import {
  GET_MY_RECORDS,
  ADD_RECORD,
  DELETE_RECORD,
  UPDATE_RECORD,
} from "../utils/queries";
import EditRecordModal from "../components/EditRecordModal";

// Define record type
interface RecordType {
  _id: string;
  artist: string;
  album: string;
  genre?: string;
  isFavorite?: boolean;
  listened?: boolean;
}

interface MyRecordsQueryData {
  myRecords: RecordType[];
}

export default function RecordLibrary() {
  const { loading, data, refetch } =
    useQuery<MyRecordsQueryData>(GET_MY_RECORDS);
  const [addRecord] = useMutation(ADD_RECORD);
  const [deleteRecord] = useMutation(DELETE_RECORD);
  const [updateRecord] = useMutation(UPDATE_RECORD);

  const [formState, setFormState] = useState({
    artist: "",
    album: "",
    genre: "",
    isFavorite: false,
    listened: false,
  });

  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;
    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";
    const checked = isCheckbox ? target.checked : undefined;

    setFormState((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addRecord({ variables: formState });
      setFormState({
        artist: "",
        album: "",
        genre: "",
        isFavorite: false,
        listened: false,
      });

      refetch();
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

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
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

        <select name="genre" value={formState.genre} onChange={handleChange}>
          <option value="">-- Select Genre --</option>
          <option value="Rock">Rock</option>
          <option value="Jazz">Jazz</option>
          <option value="Hip-Hop">Hip-Hop</option>
          <option value="Classical">Classical</option>
          <option value="Other">Other</option>
        </select>

        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            name="isFavorite"
            checked={formState.isFavorite}
            onChange={handleChange}
          />
          Favorite
        </label>

        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            name="listened"
            checked={formState.listened}
            onChange={handleChange}
          />
          Listened
        </label>

        <button type="submit">Add Record</button>
      </form>

      <button
        onClick={() => {
          logout();
          window.location.assign("/");
        }}
      >
        Log Out
      </button>

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <ul>
          {data?.myRecords?.map((record) => (
            <li key={record._id} style={{ marginBottom: "1rem" }}>
              <strong>{record.artist}</strong> — <em>{record.album}</em>
              {record.genre && (
                <>
                  {" | "}
                  <span>Genre: {record.genre}</span>
                </>
              )}
              {record.isFavorite && (
                <>
                  {" | "}
                  <span>★ Favorite</span>
                </>
              )}
              {" | "}
              {record.listened ? "🎧 Listened" : "🔇 Not Listened"}
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  style={{ marginRight: "0.5rem" }}
                  onClick={async () => {
                    const confirmed = window.confirm("Delete this record?");
                    if (confirmed) {
                      await deleteRecord({
                        variables: { recordId: record._id },
                      });
                      refetch();
                    }
                  }}
                >
                  🗑 Delete
                </button>
                <button onClick={() => setSelectedRecord(record)}>
                  ✏️ Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedRecord && (
        <EditRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSave={async ({ artist, album, genre, isFavorite, listened }) => {
            await updateRecord({
              variables: {
                recordId: selectedRecord._id,
                artist,
                album,
                genre,
                isFavorite,
                listened,
              },
            });
            refetch();
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
}
