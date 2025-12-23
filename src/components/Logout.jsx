export default function Logout() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return <button onClick={logout}>Logout</button>;
}
