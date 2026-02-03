import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import defaultProfileImage from "../assets/default.jpg";
import { BACKEND } from "../config/env";

const Profile = () => {
  const {
    user: authUser,
    loading: authLoading,
    email: contextEmail,
    setUser: setAuthUser,
  } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempImage, setTempImage] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [profileImage, setProfileImage] = useState(null); 
  const [imageUrl, setImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (authUser) {
      setUser(authUser);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(BACKEND + "/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: contextEmail }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(data.user);
          if (data.user.profileImage != null)
            setProfileImage(data.user.profileImage);
        } else {
          setError("Failed to load profile data");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError("An error occurred while loading profile data");
        setIsLoading(false);
      });
  }, [authUser, authLoading, contextEmail]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setProfileImage(reader.result); 
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileImage = () => {
    const uploadAndSave = async () => {
      try {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("image", selectedFile);
        const uploadRes = await fetch(BACKEND + "/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.imageUrl) {
          setImageUrl(uploadData.imageUrl);
          setProfileImage(uploadData.imageUrl);
          await fetch(BACKEND + "/profile-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              imageUrl: uploadData.imageUrl,
            }),
          });
        }
        setIsEditing(false);
        setTempImage(null);
        setSelectedFile(null);
      } catch (err) {
        console.error("Error uploading/saving profile image:", err);
      }
    };
    uploadAndSave();
  };

  const deleteProfileImage = () => {
    setProfileImage(defaultProfileImage);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="h-[90vh] flex items-center justify-center ">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl text-[#36a3eb] font-bold text-center mb-8">
          Profile
        </h1>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-t-[#36a3eb] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 py-8 text-center">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#36a3eb] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Retry
            </button>
          </div>
        ) : (
          user && (
            <div className="w-full space-y-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-[#36a3eb]">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={triggerFileInput}
                      className="bg-[#36a3eb] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={saveProfileImage}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                      Save
                    </button>
                  )}
                  <button
                    onClick={deleteProfileImage}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Name
                </label>
                <div className="bg-gray-100 text-black rounded-md px-4 py-2">
                  {user.name}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Email
                </label>
                <div className="bg-gray-100 text-black rounded-md px-4 py-2">
                  {user.email}
                </div>
              </div>
              <div className="flex justify-center">
                <p
                  onClick={() => navigate("/change-password")}
                  className=" text-blue-500 hover:underline cursor-pointer  text-[20px] font-medium">
                  Change Password
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;
