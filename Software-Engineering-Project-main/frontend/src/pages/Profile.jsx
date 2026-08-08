import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { HiUser, HiMail, HiPhone, HiCamera, HiPencil } from "react-icons/hi";
import { updateProfile } from "firebase/auth";
import axios from "axios";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    displayName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/profile/${user.email}`
      );
      setProfileData(response.data.data);
      setFormData({
        displayName: response.data.data.name || user.displayName || "",
        phoneNumber: response.data.data.phone || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback to Firebase data
      setFormData({
        displayName: user.displayName || "",
        phoneNumber: "",
      });
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);

    try {
      // Update MongoDB profile
      await axios.patch(
        `${import.meta.env.VITE_URL}/api/profile/${user.email}`,
        {
          name: formData.displayName,
          phone: formData.phoneNumber,
        }
      );

      // Update Firebase profile
      await updateProfile(user, {
        displayName: formData.displayName,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: profileData?.name || user.displayName || "",
      phoneNumber: profileData?.phone || "",
    });
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("email", user.email);

      // Upload to backend
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/profile/upload-photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const photoURL = response.data.photoURL;

      // Update Firebase profile
      await updateProfile(user, {
        photoURL: photoURL,
      });

      toast.success("Profile photo updated successfully!");
      fetchProfile(); // Refresh profile data
      window.location.reload(); // Reload to show new photo
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (!user) {
    return null;
  }

  if (fetchingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 px-8 py-12 text-white text-center relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative inline-block"
            >
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                {uploadingPhoto ? (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                ) : (profileData?.photoURL || user.photoURL) ? (
                  <img
                    src={profileData?.photoURL || user.photoURL}
                    alt={profileData?.name || user.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <HiUser className="text-white text-6xl" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePhotoClick}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                title="Change Photo"
              >
                <HiCamera className="text-xl" />
              </motion.button>
            </motion.div>
            <h1 className="text-3xl font-bold mt-4">
              {profileData?.name || user.displayName || "User"}
            </h1>
            <p className="text-white/90 mt-2">{user.email}</p>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Profile Information
              </h2>
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <HiPencil />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg transition-all ${
                      isEditing
                        ? "focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg transition-all ${
                      isEditing
                        ? "focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Optional - for order notifications
                </p>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 pt-4"
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </form>

            {/* Account Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-mono text-sm text-gray-800 mt-1">
                    {user.uid.slice(0, 20)}...
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Account Created</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {user.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 text-white">
        
          <h3 className="text-xl font-bold mb-2">Need Help?</h3>
          <p className="text-white/90">
            If you need to update your email or have any issues with your account,
            please contact our support team through the{" "}
            <a href="/contact" className="underline font-semibold">
              Contact Page
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
