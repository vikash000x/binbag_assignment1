import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profile_pic: "" // Add this to prevent it from being undefined
  });
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("API Response:", data);

        console.log("Profile Pic:", data.profile_pic);

        if (response.ok) {
          setUser(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            bio: data.bio || "",
            profile_pic: data.profile_pic || "" // Ensure it always has a value
          });
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        profile_pic: formData.profile_pic, // URL string
      };

    console.log("Updated Data:", updatedData);
    

    try {
      const response = await fetch("http://localhost:5000/api/user/profile/update", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData), 
        
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setUser(data);
        window.location.reload();
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Something went wrong.");
    }
  };

 

  if (!user) return <h2>GO TO AUTH SECTION THEN LOGIN/SIGNUP 🔔🔔📣📣 </h2>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
        background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
        color: "#333",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontSize: "32px", marginBottom: "20px", fontWeight: "bold" }}>
        {user.name}'s Profile
      </h2>
      <img
        src={user.profile_pic || "https://cdn.pixabay.com/photo/2023/11/15/13/55/woman-8390124_1280.jpg"}
        alt="Profile"
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "6px solid white",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
          marginBottom: "20px",
        }}
      />
      <form
        onSubmit={handleUpdate}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
        />
         <input
          type="text"
          name="profile_pic"
          value={formData.profile_pic}
          onChange={handleChange}
          placeholder="paste image url"
          style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
        />
       
        <button
          type="submit"
          style={{
            padding: "10px",
            width: "100%",
            backgroundColor: "#ff6f61",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Update Profile
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default ProfilePage;
