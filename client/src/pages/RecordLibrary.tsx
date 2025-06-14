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

  const [formState, setFormState] = useState<{ artist: string; album: string }>(
    {
      artist: "",
      album: "",
    }
  );

  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);

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

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <ul>
          {data?.myRecords?.map((record) => (
            <li key={record._id}>
              <strong>{record.artist}</strong> — <em>{record.album}</em>
              <button
                style={{ marginLeft: "1rem" }}
                onClick={async () => {
                  const confirmed = window.confirm("Delete this record?");
                  if (confirmed) {
                    await deleteRecord({ variables: { recordId: record._id } });
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
