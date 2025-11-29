// src/pages/admin/ShowtimesManager.tsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/db";

export default function ShowtimesManager() {
  const [movies, setMovies] = useState<any[]>([]); // all movies from Firestore
  const [showtimes, setShowtimes] = useState<any[]>([]); // all showtimes from Firestore
  const [editing, setEditing] = useState<any>(null); // holds the showtime currently being edited or the ones that is null
// load data when the page mounts
  useEffect(() => {
    fetchMovies();
    fetchShowtimes();
  }, []);
 // get all movie documents
  const fetchMovies = async () => {
    const snap = await getDocs(collection(db, "movies"));
    setMovies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
// get all showtime documents
  const fetchShowtimes = async () => {
    const snap = await getDocs(collection(db, "showtimes"));
    setShowtimes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
// add a new showtime
  const createShowtime = async (s: any) => {
    await addDoc(collection(db, "showtimes"), {
      ...s,
      createdAt: new Date().toISOString(),
    });
    fetchShowtimes(); // refresh list
    setEditing(null);
  };
// update an existing showtime
  const updateShowtime = async (s: any) => {
    if (!s.id) return;
    await updateDoc(doc(db, "showtimes", s.id), {
      ...s,
      updatedAt: new Date().toISOString(),
    });
    fetchShowtimes();
    setEditing(null);
  };
// delete a showtime
  const removeShowtime = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete showtime?")) return;
    await deleteDoc(doc(db, "showtimes", id));
    fetchShowtimes();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Manage Showtimes</h2>

      {/* SHOWTIMES GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {showtimes.map((s) => (
          <div
            key={s.id}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              borderRadius: "10px",
              background: "#fafafa",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              {movies.find((m) => m.id === s.movie_id)?.title || "—"}
            </div>

            <div style={{ marginBottom: "6px" }}>
              <strong>Theater:</strong> {s.theater}
            </div>
            <div style={{ marginBottom: "6px" }}>
              <strong>Showtime:</strong>{" "}
              {new Date(s.start_time).toLocaleString()}
            </div>
            <div>
              <strong>Price:</strong> ${s.ticket_price}
            </div>

            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button onClick={() => setEditing(s)}>Edit</button>
              <button onClick={() => removeShowtime(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM SECTION */}
      <div style={{ marginTop: "30px" }}>
        <h3>{editing ? "Edit Showtime" : "Create Showtime"}</h3>

        <ShowtimeForm
          movies={movies}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={editing ? updateShowtime : createShowtime}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*      SMALL & NEAT SHOWTIME FORM COMPONENT      */
/* ────────────────────────────────────────────── */

function ShowtimeForm({ movies, initial, onSave, onCancel }: any) {
  const [state, setState] = useState<any>(
    initial || {
      movie_id: "",
      theater: "",
      start_time: "",
      ticket_price: 9.99,
      total_seats: 0,
    }
  );
// update inputs when switching from "create" to "edit"
  useEffect(() => {
    if (initial) setState(initial);
  }, [initial]);

  const formStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    maxWidth: "450px",
    padding: "15px",
    background: "#f7f7f7",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    marginTop: "10px",
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #bbb",
  };

  return (
    <div style={formStyle}>
      <select
        value={state.movie_id}
        onChange={(e) => setState({ ...state, movie_id: e.target.value })}
        style={inputStyle}
      >
        <option value="">Select movie</option>
        {movies.map((m: any) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </select>

      <select
        value={state.theater}
        onChange={(e) => setState({ ...state, theater: e.target.value })}
        style={inputStyle}
      >
        <option value="">Select theater</option>
        {["Lubbock", "Amarillo", "Levelland", "Plainview", "Snyder", "Abilene"].map(
          (t) => (
            <option key={t} value={t}>
              {t}
            </option>
          )
        )}
      </select>

      <input
        type="datetime-local"
        value={state.start_time}
        onChange={(e) => setState({ ...state, start_time: e.target.value })}
        style={inputStyle}
      />

      <input
        type="number"
        value={state.ticket_price}
        onChange={(e) =>
          setState({ ...state, ticket_price: Number(e.target.value) })
        }
        style={inputStyle}
      />

      <div style={{ gridColumn: "1 / span 2", display: "flex", gap: "10px" }}>
        <button onClick={() => onSave(state)}>{initial ? "Save" : "Create"}</button>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
