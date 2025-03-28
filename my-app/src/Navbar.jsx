import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  useEffect(() => {
    const token = Cookies.get("token");
 
    setIsAuthenticated(!!token); 
  }, [isAuthenticated]); 

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(false); 
        toast.success("Logged out successfully!");
        navigate("/auth");
      } else {
        toast.error("Logout failed: " + data.message);
      }
    } catch (error) {
      toast.error("Error logging out!");
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <nav style={{ padding: "10px", display: "flex", gap: "20px", background: "#007BFF", color: "white" }}>
        {/* {isAuthenticated ? ( */}
          <button 
            onClick={handleLogout} 
            style={{ background: "red", border: "none", color: "white", cursor: "pointer" }}
          >
            Logout
          </button>
        {/* ) : ( */}
          <Link to="/auth" style={{ color: "white", textDecoration: "none" }}>Auth</Link>
        {/* )} */}
        
        <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</Link>
       <Link to="/users" style={{ color: "white", textDecoration: "none" }}>Users</Link>
      </nav>

    
    </>
  );
}
