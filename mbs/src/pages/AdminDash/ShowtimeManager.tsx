// src/pages/admin/ShowtimesManager.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from "firebase/firestore";
import { db } from "../../firebase/db";

export default function ShowtimesManager() {
  const [movies, setMovies] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  useEffect(()=>{ fetchMovies(); fetchShowtimes(); }, []);

  const fetchMovies = async () => {
    const snap = await getDocs(collection(db, "movies"));
    setMovies(snap.docs.map(d=>({id:d.id, ...d.data()})));
  };

  const fetchShowtimes = async () => {
    const snap = await getDocs(collection(db, "showtimes"));
    setShowtimes(snap.docs.map(d=>({id:d.id, ...d.data()})));
  };

  const createShowtime = async (s:any) => {
    await addDoc(collection(db, "showtimes"), { ...s, createdAt:new Date().toISOString() });
    fetchShowtimes();
    setEditing(null);
  };

  const updateShowtime = async (s:any) => {
    if (!s.id) return;
    await updateDoc(doc(db,"showtimes",s.id), { ...s, updatedAt: new Date().toISOString() });
    fetchShowtimes();
    setEditing(null);
  };

  const removeShowtime = async (id?:string) => {
    if (!id) return;
    if (!confirm("Delete showtime?")) return;
    await deleteDoc(doc(db,"showtimes",id));
    fetchShowtimes();
  };

  return (
    <div>
      <h2>Manage Showtimes</h2>

      <div style={{display:"grid", gap:12}}>
        {showtimes.map(s => (
          <div key={s.id} style={{border:"1px solid #ddd", padding:12, borderRadius:8}}>
            <div><strong>{movies.find(m=>m.id===s.movie_id)?.title || "—"}</strong></div>
            <div>{s.theater} — {new Date(s.start_time).toLocaleString()}</div>
            <div>${s.ticket_price} per ticket</div>
            <div style={{marginTop:8}}>
              <button onClick={()=>setEditing(s)}>Edit</button>
              <button onClick={()=>removeShowtime(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:16}}>
        <h3>{editing ? "Edit Showtime" : "Create Showtime"}</h3>
        <ShowtimeForm movies={movies} initial={editing} onCancel={()=>setEditing(null)} onSave={editing ? updateShowtime : createShowtime} />
      </div>
    </div>
  );
}

// small showtime form
function ShowtimeForm({ movies, initial, onSave, onCancel }: any) {
  const [state, setState] = useState<any>(initial || { movie_id: "", theater: "", start_time: "", ticket_price: 9.99, total_seats: 0 });

  useEffect(()=>{ if (initial) setState(initial); }, [initial]);

  return (
    <div style={{display:"flex", flexDirection:"column", gap:8}}>
      <select value={state.movie_id} onChange={e=>setState({...state, movie_id:e.target.value})}>
        <option value="">Select movie</option>
        {movies.map((m:any)=> <option key={m.id} value={m.id}>{m.title}</option>)}
      </select>

      <select value={state.theater} onChange={e=>setState({...state, theater:e.target.value})}>
        <option value="">Select theater</option>
        {["Lubbock","Amarillo","Levelland","Plainview","Snyder","Abilene"].map(t=> <option key={t} value={t}>{t}</option>)}
      </select>

      <input type="datetime-local" value={state.start_time} onChange={e=>setState({...state, start_time: e.target.value})} />
      <input type="number" value={state.ticket_price} onChange={e=>setState({...state, ticket_price: Number(e.target.value)})} />

      <div style={{display:"flex", gap:8}}>
        <button onClick={()=>onSave(state)}>{initial ? "Save" : "Create"}</button>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
