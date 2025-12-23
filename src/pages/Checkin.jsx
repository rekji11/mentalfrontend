import { useState } from "react";
import API from "../api";

export default function CheckIn() {
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    await API.post("/checkins/", {
      mood,
      notes,
    });

    alert("Check-in saved");
  };

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Mood"
        onChange={(e) => setMood(e.target.value)}
      />
      <textarea
        placeholder="Notes"
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
