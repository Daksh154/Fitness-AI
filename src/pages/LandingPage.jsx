import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Utensils, User, LogOut } from "lucide-react";
import axios from "axios";
import UserProfileDialog from "./UserProfileDialog";

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDialog, setShowProfileDialog] = useState(false); // Add this state

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        localStorage.setItem("userDetails", JSON.stringify(response.data));
      } catch (err) {
        console.error("Error fetching user profile:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post(
          "http://localhost:8000/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Error during logout:", err);
      }
    }
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signin");
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUser((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
    localStorage.setItem(
      "userDetails",
      JSON.stringify({
        ...user,
        ...updatedProfile,
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      {/* User Panel */}
      {user && (
        <div
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-lg"
          onClick={() => setShowProfileDialog(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-purple-500/20">
              <User size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              className="ml-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Logout"
            >
              <LogOut size={20} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-white mb-12 text-center">
          {user
            ? `Welcome Back, ${user.name.split(" ")[0]}`
            : "Transform Your Life"}
        </h1>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div
            onClick={() => navigate("/workout")}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 shadow-xl hover:shadow-purple-500/20">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30">
                  <Dumbbell size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Workout</h2>
                <p className="text-gray-300">
                  Get a personalized workout plan based on your fitness goals
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/diet")}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 shadow-xl hover:shadow-purple-500/20">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30">
                  <Utensils size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Diet</h2>
                <p className="text-gray-300">
                  Receive a customized diet plan to achieve your goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add the UserProfileDialog */}
      {showProfileDialog && (
        <UserProfileDialog
          user={user}
          onClose={() => setShowProfileDialog(false)}
          onUpdate={handleUpdateProfile}
        />
      )}
    </div>  
  );
};

export default LandingPage;
