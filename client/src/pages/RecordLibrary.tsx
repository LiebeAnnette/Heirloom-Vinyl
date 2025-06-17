import React, { useState, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { loggedIn, logout } from "../utils/auth";
import {
  GET_MY_RECORDS,
  ADD_RECORD,
  DELETE_RECORD,
  UPDATE_RECORD,
  UPDATE_MULTIPLE_RECORDS,
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
  const [updateMultipleRecords] = useMutation(UPDATE_MULTIPLE_RECORDS);

  const [formState, setFormState] = useState({ artist: "", album: "" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);
  const [bulkForm, setBulkForm] = useState({
    genre: "",
    isFavorite: false,
    listened: false,
    touched: {
      genre: false,
      isFavorite: false,
      listened: false,
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addRecord({ variables: formState });
      setFormState({ artist: "", album: "" });
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
      <div style={{ marginTop: "1rem" }}>
        <label>
          Genre:
          <select
            value={bulkForm.genre}
            onChange={(e) =>
              setBulkForm((prev) => ({
                ...prev,
                genre: e.target.value,
                touched: { ...prev.touched, genre: true },
              }))
            }
          >
            <option value="">-- Select Genre --</option>
            <option value="Rock">Rock</option>
            <option value="Jazz">Jazz</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="Classical">Classical</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={bulkForm.isFavorite}
            onChange={(e) =>
              setBulkForm((prev) => ({
                ...prev,
                isFavorite: e.target.checked,
                touched: { ...prev.touched, isFavorite: true },
              }))
            }
          />
          Favorite
        </label>

        <label>
          <input
            type="checkbox"
            checked={bulkForm.listened}
            onChange={(e) =>
              setBulkForm((prev) => ({
                ...prev,
                listened: e.target.checked,
                touched: { ...prev.touched, listened: true },
              }))
            }
          />
          Listened
        </label>

        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={bulkForm.listened}
            onChange={(e) =>
              setBulkForm((prev) => ({ ...prev, listened: e.target.checked }))
            }
          />
          Listened
        </label>
      </div>

      <button
        disabled={selectedIds.length === 0}
        onClick={async () => {
          const updates: any = {};

          if (bulkForm.touched.genre && bulkForm.genre) {
            updates.genre = bulkForm.genre;
          }
          if (bulkForm.touched.isFavorite) {
            updates.isFavorite = bulkForm.isFavorite;
          }
          if (bulkForm.touched.listened) {
            updates.listened = bulkForm.listened;
          }

          try {
            await updateMultipleRecords({
              variables: { recordIds: selectedIds, updates },
            });
            setSelectedIds([]);
            setBulkForm({
              genre: "",
              isFavorite: false,
              listened: false,
              touched: {
                genre: false,
                isFavorite: false,
                listened: false,
              },
            });

            refetch();
          } catch (err) {
            console.error("Bulk update failed", err);
          }
        }}
      >
        Apply Bulk Update
      </button>
      {loading ? (
        <p>Loading records...</p>
      ) : (
        <>
          <ul>
            {data?.myRecords?.map((record) => (
              <li key={record._id}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(record._id)}
                  onChange={(e) => {
                    setSelectedIds((prev) =>
                      e.target.checked
                        ? [...prev, record._id]
                        : prev.filter((id) => id !== record._id)
                    );
                  }}
                />
                <strong>{record.artist}</strong> — <em>{record.album}</em>
                {/* Display genre, favorite, and listened status */}
                <div style={{ marginLeft: "1rem", fontSize: "0.9rem" }}>
                  {record.genre && <span>🎵 Genre: {record.genre}</span>}
                  {record.isFavorite && (
                    <span style={{ marginLeft: "1rem" }}>⭐ Favorite</span>
                  )}
                  {record.listened && (
                    <span style={{ marginLeft: "1rem" }}>👂 Listened</span>
                  )}
                </div>
                <button
                  style={{ marginLeft: "1rem" }}
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
                <button
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => setSelectedRecord(record)}
                >
                  ✏️ Edit
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedRecord && (
        <EditRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSave={async ({ artist, album }) => {
            await updateRecord({
              variables: {
                recordId: selectedRecord._id,
                artist,
                album,
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
