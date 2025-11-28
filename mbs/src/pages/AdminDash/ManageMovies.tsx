// src/pages/admin/ManageMovies.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/db";

type MovieForm = {
  id?: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  cast: string;
  rating?: number;
  posterUrl: string;
  status: string;
};

export default function ManageMovies() {
  const [movies, setMovies] = useState<MovieForm[]>([]);
  const [editing, setEditing] = useState<MovieForm | null>(null);

  const fetchMovies = async () => {
    const snap = await getDocs(collection(db, "movies"));
    setMovies(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  };

  useEffect(() => { fetchMovies(); }, []);

  const createMovie = async (m: MovieForm) => {
    await addDoc(collection(db, "movies"), { ...m, createdAt: new Date().toISOString() });
    fetchMovies();
    setEditing(null);
  };

  const updateMovie = async (m: MovieForm) => {
    if (!m.id) return;
    await updateDoc(doc(db, "movies", m.id), { ...m, updatedAt: new Date().toISOString() });
    fetchMovies();
    setEditing(null);
  };

  const removeMovie = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete movie?")) return;
    await deleteDoc(doc(db, "movies", id));
    fetchMovies();
  };

  return (
    <div>
      <h2>Manage Movies</h2>

      <div style={{ display:"grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
        {movies.map(m => (
          <div key={m.id} style={{border:"1px solid #ddd", padding:10, borderRadius:8}}>
            <img src={m.posterUrl} alt={m.title} style={{width:"100%", height:120, objectFit:"cover", borderRadius:6}} />
            <h3>{m.title}</h3>
            <p style={{fontSize:12, color:"#666"}}>{m.genre} · {m.duration} </p>
            <div style={{display:"flex", gap:8, marginTop:8}}>
              <button onClick={() => setEditing(m)}>Edit</button>
              <button onClick={() => removeMovie(m.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:20}}>
        <h3>{editing ? "Edit Movie" : "Add Movie"}</h3>
        <MovieForm initial={editing} onCancel={() => setEditing(null)} onSave={editing ? updateMovie : createMovie} />
      </div>
    </div>
  );
}

// small form component
function MovieForm({ initial, onSave, onCancel }: { initial?: any, onSave: (m:any)=>Promise<void>, onCancel?: ()=>void }) {
  const [form, setForm] = useState<any>(initial || {
    title: "", description: "", genre: "", duration: "", cast: "", posterUrl: "", status: "current"
  });

  useEffect(()=> { if (initial) setForm(initial); }, [initial]);

  return (
    <div style={{marginTop:8, display:"flex", flexDirection:"column", gap:8}}>
      <input style={{padding:8}} placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
      <input style={{padding:8}} placeholder="Genre" value={form.genre} onChange={e=>setForm({...form, genre:e.target.value})} />
      <input style={{padding:8}} placeholder="Duration" value={form.duration} onChange={e=>setForm({...form, duration:e.target.value})} />
      <input style={{padding:8}} placeholder="Cast (comma-separated)" value={form.cast} onChange={e=>setForm({...form, cast:e.target.value})} />
      <input style={{padding:8}} placeholder="Image URL" value={form.posterUrl} onChange={e=>setForm({...form, posterUrl:e.target.value})} />
      <textarea style={{padding:8}} placeholder="Synopsis" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
      <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} style={{padding:8}}>
        <option value="current">current</option>
        <option value="upcoming">upcoming</option>
      </select>

      <div style={{display:"flex", gap:8}}>
        <button onClick={()=>onSave(form)}>{initial ? "Save" : "Create"}</button>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
