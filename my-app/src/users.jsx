import { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cache, setCache] = useState({});
  const [page, setPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetch("https://binbag-assignment1.onrender.com/api/user/getAll")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        if (Array.isArray(data.users)) {
          setUsers(data.users);
          console.log("users", users)
          setFilteredUsers(data.users);
        } else {
          setUsers([]);
          setFilteredUsers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
        setFilteredUsers([]);
      });
  }, []);

//   console.log("Users:", users);

  const debounceSearch = useCallback((query) => {
    if (cache[query]) {
      setFilteredUsers(cache[query]);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setCache((prevCache) => ({ ...prevCache, [query]: filtered }));
      setFilteredUsers(filtered);
    }
  }, [users, cache]);

  useEffect(() => {
    const timer = setTimeout(() => debounceSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceSearch]);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  //console.log("Filtered Users:", filteredUsers.profile_pic);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>All Users</h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          margin: "10px auto",
          display: "block",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />

      {/* User List */}
      <ul style={{ listStyle: "none", padding: "0", maxWidth: "500px", margin: "0 auto" }}>
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user) => (
            <li
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <img
               src=  {user.profile_pic}
                alt="User"
                width="100"
                height="100"
                style={{ borderRadius: "50%", marginRight: "10px" }}
              />
              <div>
                <strong>{user.name}</strong> - {user.email}
                <p style={{ margin: "5px 0", color: "#666" }}>{user.bio}</p>
              </div>
            </li>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>No users found.</p>
        )}
      </ul>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={{
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: page === 1 ? "#ccc" : "#007bff",
            color: "#fff",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <span style={{ margin: "10px", fontWeight: "bold" }}>Page {page}</span>
        <button
          onClick={() => setPage((prev) => (page * usersPerPage < filteredUsers.length ? prev + 1 : prev))}
          disabled={page * usersPerPage >= filteredUsers.length}
          style={{
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: page * usersPerPage >= filteredUsers.length ? "#ccc" : "#007bff",
            color: "#fff",
            cursor: page * usersPerPage >= filteredUsers.length ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
