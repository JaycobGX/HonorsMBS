// src/pages/admin/Reports.tsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/db";

export default function Reports() {
  const [ticketsSold, setTicketsSold] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [playingMovies, setPlayingMovies] = useState<string[]>([]);

  useEffect(()=> { fetchReport(); }, []);

  const fetchReport = async () => {
    // bookings collection
    const snap = await getDocs(collection(db, "bookings"));
    let sold = 0;
    let rev = 0;
    snap.docs.forEach(d=>{
      const b:any = d.data();
      sold += Number(b.seats || 0);
      rev += Number(b.totalCost || 0);
    });

    setTicketsSold(sold);
    setRevenue(rev);

    // movies with status current
    const msnap = await getDocs(query(collection(db, "movies"), where("status", "==", "current")));
    setPlayingMovies(msnap.docs.map(d=>d.data().title || d.data().title));
  };

  return (
    <div>
      <h2>Status Reports</h2>
      <div style={{display:"flex", gap:16}}>
        <div style={{padding:12, borderRadius:8, background:"#fff"}}><h3>{ticketsSold}</h3><p>Tickets Sold</p></div>
        <div style={{padding:12, borderRadius:8, background:"#fff"}}><h3>${revenue.toFixed(2)}</h3><p>Total Revenue</p></div>
      </div>

      <div style={{marginTop:16}}>
        <h3>Now Playing</h3>
        <ul>
          {playingMovies.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
