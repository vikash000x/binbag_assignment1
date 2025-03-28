import { useState } from "react";
import {  useNavigate } from "react-router-dom"; // Import for navigation
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthPage() {
    const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    bio: "",
    profile_pic: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://localhost:5000/api/user/login" : "http://localhost:5000/api/user/register";
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
         credentials: "include"
      });
      
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message); // Show success toast
       
      
        navigate("/profile"); // Redirect to profile page
      } else {
        toast.error(data.message); // Show error toast
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={containerStyle}>
    <h1 style={headingStyle}>Welcome to Binbag Place</h1>

    <div style={formContainerStyle}>
      <h2 style={subHeadingStyle}>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        {!isLogin && (
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={inputStyle} required />
        )}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={inputStyle} required />
        {!isLogin && (
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={inputStyle} required />
        )}
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={inputStyle} required />
        {!isLogin && (
          <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} style={{ ...inputStyle, height: "80px" }}></textarea>
        )}
        {!isLogin && (
          <input type="text" name="profile_pic" placeholder="Profile Picture URL" value={formData.profile_pic} onChange={handleChange} style={inputStyle} />
        )}
        <button type="submit" style={buttonStyle}>{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <p style={toggleTextStyle}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLogin(!isLogin)} style={linkStyle}>{isLogin ? "Sign Up" : "Login"}</button>
      </p>
    </div>
  </div>
);
}

// 🌟 **Styling Section**
const containerStyle = {
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
height: "100vh",
width: "100vw",
backgroundColor: "#f0f2f5",
padding: "20px",
};

const headingStyle = {
color: "#ff6600",
fontSize: "34px",
fontWeight: "bold",
textTransform: "uppercase",
letterSpacing: "1.5px",
textAlign: "center",
marginBottom: "20px",
};

const formContainerStyle = {
backgroundColor: "#fff",
padding: "30px",
borderRadius: "12px",
boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
width: "380px",
textAlign: "center",
};

const subHeadingStyle = {
color: "#333",
marginBottom: "20px",
fontSize: "22px",
};

const inputStyle = {
width: "100%",
padding: "12px",
marginBottom: "12px",
border: "1px solid #ccc",
borderRadius: "6px",
fontSize: "16px",
outline: "none",
transition: "border-color 0.3s",
};

const buttonStyle = {
width: "100%",
backgroundColor: "#007BFF",
color: "white",
padding: "12px",
borderRadius: "6px",
cursor: "pointer",
border: "none",
fontSize: "16px",
transition: "background 0.3s",
};

buttonStyle[":hover"] = {
backgroundColor: "#0056b3",
};

const toggleTextStyle = {
textAlign: "center",
marginTop: "15px",
fontSize: "14px",
color: "#555",
};

const linkStyle = {
color: "#007BFF",
cursor: "pointer",
background: "none",
border: "none",
padding: "0",
fontSize: "14px",
textDecoration: "underline",
};