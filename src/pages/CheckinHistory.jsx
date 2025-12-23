import { useEffect, useState } from "react";
import API from "../api";

export default function CheckInHistory() {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    API.get("/checkins/").then((res) => setCheckins(res.data));
  }, []);

  return (
    <div>
      <h2>My Check-Ins</h2>
      {checkins.map((c) => (
        <div key={c.id}>
          <strong>{c.mood}</strong>
          <p>{c.notes}</p>
        </div>
      ))}
    </div>
  );
}
