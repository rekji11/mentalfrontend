import { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/users/me")
      .then((res) => setData(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default Profile;