"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Header from "./header";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  
  const [userData, setUserData] = useState({
    fullName: "",
    city: "",
    preferredNickname: "",
    email: "",
    bio: ""
  });
  
  const [editing, setEditing] = useState({
    fullName: false,
    city: false,
    preferredNickname: false,
    email: false,
    bio: false,
    password: false
  });

  const [formInputs, setFormInputs] = useState({
    fullName: "",
    city: "",
    preferredNickname: "",
    email: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!session) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/userinfo');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        
        setUserData({
          fullName: data.name || "",
          city: data.city || "",
          preferredNickname: data.preferredNickname || "",
          email: data.email || "",
          bio: data.bio || ""
        });
        
        setFormInputs({
          fullName: data.name || "",
          city: data.city || "",
          preferredNickname: data.preferredNickname || "",
          email: data.email || "",
          bio: data.bio || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } catch (err) {
        setError("Failed to load profile data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [session]);

    // Delete function to call the API
    const deleteUser = async (userId) => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete account');
        }
        
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      }
    };

  const toggleEdit = (field) => {
    setFormInputs(prev => ({
      ...prev,
      [field]: userData[field],
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
    
    setEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveField = async (field) => {
    try {
      setSaving(true);
      setError(null);
      
      if (field === 'email') {
        const updateData = { email: formInputs.email };
        
        if (formInputs.email !== userData.email) {
          const response = await fetch('/api/userinfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
          });
          
          if (!response.ok) {
            throw new Error('Failed to update email');
          }
          
          setSuccess("Email updated successfully! Logging you out...");
          
          setTimeout(() => {
            signOut({ callbackUrl: '/' });
          }, 1500);
        } else {
          toggleEdit(field);
        }
      } else if (field === 'password') {
        // Validate password fields
        if (!formInputs.currentPassword) {
          setError("Current password is required");
          setSaving(false);
          return;
        }
        
        if (!formInputs.newPassword) {
          setError("New password is required");
          setSaving(false);
          return;
        }
        
        if (formInputs.newPassword !== formInputs.confirmPassword) {
          setError("New passwords do not match");
          setSaving(false);
          return;
        }
        
        // Send password update request
        const response = await fetch('/api/update_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentPassword: formInputs.currentPassword,
            newPassword: formInputs.newPassword
          })
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to update password');
        }
        
        // Reset password fields
        setFormInputs(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
        
        toggleEdit(field);
        setSuccess("Password updated successfully! You may need to log in again.");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const updateData = {};
        updateData[field === 'fullName' ? 'name' : field] = formInputs[field];
        
        const response = await fetch('/api/userinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${field}`);
        }
        
        setUserData(prev => ({
          ...prev,
          [field]: formInputs[field]
        }));
        
        toggleEdit(field);
        setSuccess(`${field} updated successfully!`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.message || `Failed to update ${field}. Please try again.`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const saveAllChanges = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        name: formInputs.fullName, 
        email: formInputs.email,
        city: formInputs.city,
        preferredNickname: formInputs.preferredNickname,
        bio: formInputs.bio
      };
      
      const response = await fetch('/api/userinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const emailChanged = formInputs.email !== userData.email;
      
      setEditing({
        fullName: false,
        city: false,
        preferredNickname: false,
        email: false,
        bio: false,
        password: false
      });
      
      if (emailChanged) {
        setSuccess("Profile updated successfully! Logging you out due to email change...");
        setTimeout(() => {
          signOut({ callbackUrl: '/' });
        }, 1500);
      } else {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
        
        setUserData({
          fullName: formInputs.fullName,
          email: formInputs.email,
          city: formInputs.city,
          preferredNickname: formInputs.preferredNickname,
          bio: formInputs.bio
        });
      }
      
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setError("Please type DELETE in all caps to confirm");
      return;
    }
  
    try {
      setDeletingAccount(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/delete_user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}` //Token for Auth
        },
        credentials: 'include',
        body: JSON.stringify({ 
          userId: session.user.id,
          confirmation: deleteConfirmation
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Deletion failed (Status: ${response.status})`
        );
      }
  
      setSuccess("Account and all related data deleted. Redirecting...");
      
      //visual feedback bc im brainrot
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sign out with redirect
      await signOut({ 
        callbackUrl: '/?message=account_deleted',
        redirect: true 
      });
  
    } catch (err) {
      setError(err.message || "Deletion failed. Please try again later.");
      console.error("Delete error:", err);
      
      logErrorToService(err, { 
        userId: session?.user?.id,
        action: 'account_deletion' 
      });
      
    } finally {
      if (!success) { // Only reset if not redirect
        setDeletingAccount(false);
      }
    }
  };


  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingProfilePic(true);
      setError(null);
      

      const cloudForm = new FormData();
      cloudForm.append("file", file);
      cloudForm.append("upload_preset", "apdev_preset");
      
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dquub7fch/image/upload",
        {
          method: "POST",
          body: cloudForm,
        }
      );
      
      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");
      
      
      const response = await fetch('/api/userinfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: data.secure_url }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }
      
      
      await update({ user: { ...session.user, image: data.secure_url } });
      
      setSuccess("Profile picture updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error("Error updating profile picture:", err);
      setError("Failed to update profile picture. Please try again.");
    } finally {
      setUploadingProfilePic(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">Loading profile data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* left block */}
          <div className="md:col-span-1">
            <div className="w-full min-h-[500px] border-2 border-gray-300 rounded-lg p-5 text-center shadow-md mx-auto">
              <div className="relative mx-auto w-40 h-40 mb-4">
                <Image
                  src={session?.user?.image || "/Images/defaultUser.png"}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto object-cover border-2 border-gray-300"
                  style={{ width: '150px', height: '150px' }}
                />

                <input
                    type="file"
                    id="profilePicUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                />

                {/* little edit icon from svg, https://icons.getbootstrap.com/icons/pencil-square/*/}
                <label 
                  htmlFor="profilePicUpload" 
                  className={`absolute bottom-0 right-0 ${uploadingProfilePic ? 'bg-gray-500' : 'bg-black'} text-white rounded-full p-2 shadow-md hover:bg-gray-800 cursor-pointer`}
                >
                  {uploadingProfilePic ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                  )}
                </label>

              </div>
              <h2 className="text-xl font-semibold mb-2">{userData.fullName}</h2>
              <p className="text-gray-500 text-sm">Profile Settings</p>
              <hr className="border-t-2 border-gray-200 my-4" />
              <div className="text-left">
                <h3 className="font-semibold mb-2">Account Settings</h3>
                <ul className="space-y-2 text-sm">
                  <li className="py-1 px-2 bg-gray-100 rounded">Profile Information</li>
                  <li className="py-1 px-2 hover:bg-gray-100 rounded cursor-pointer">Security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* right block */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 border-2 border-gray-300 rounded-lg shadow-md mb-8">
              <h1 className="text-2xl font-bold mb-6 border-b pb-3">Profile Information</h1>
              
              {/* settings to change */}
              <div className="space-y-6">
                {/* full name */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="md:w-2/3">
                    <h3 className="font-semibold">Full Name</h3>
                    {editing.fullName ? (
                      <input 
                        type="text" 
                        name="fullName"
                        value={formInputs.fullName}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-gray-700">{userData.fullName}</p>
                    )}
                  </div>
                  {editing.fullName ? (
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <button 
                        onClick={() => saveField('fullName')}
                        disabled={saving}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => toggleEdit('fullName')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleEdit('fullName')}
                      className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* city */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="md:w-2/3">
                    <h3 className="font-semibold">City</h3>
                    {editing.city ? (
                      <input 
                        type="text" 
                        name="city"
                        value={formInputs.city}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-gray-700">{userData.city || "Add your city"}</p>
                    )}
                  </div>
                  {editing.city ? (
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <button 
                        onClick={() => saveField('city')}
                        disabled={saving}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => toggleEdit('city')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleEdit('city')}
                      className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                    >
                      {userData.city ? 'Edit' : 'Add'}
                    </button>
                  )}
                </div>
                
                {/* preferred nickname */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="md:w-2/3">
                    <h3 className="font-semibold">Preferred Nickname</h3>
                    {editing.preferredNickname ? (
                      <input 
                        type="text" 
                        name="preferredNickname"
                        value={formInputs.preferredNickname}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1 mt-1"
                        placeholder="Add a preferred name for hosts to call you"
                      />
                    ) : (
                      <p className="text-gray-700">
                        {userData.preferredNickname || "Add a preferred name for hosts to call you"}
                      </p>
                    )}
                  </div>
                  {editing.preferredNickname ? (
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <button 
                        onClick={() => saveField('preferredNickname')}
                        disabled={saving}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => toggleEdit('preferredNickname')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleEdit('preferredNickname')}
                      className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                    >
                      {userData.preferredNickname ? 'Edit' : 'Add'}
                    </button>
                  )}
                </div>
                
                {/* email address */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="md:w-2/3">
                    <h3 className="font-semibold">Email Address</h3>
                    {editing.email ? (
                      <input 
                        type="email" 
                        name="email"
                        value={formInputs.email}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1 mt-1"
                      />
                    ) : (
                      <p className="text-gray-700">{userData.email}</p>
                    )}
                  </div>
                  {editing.email ? (
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <button 
                        onClick={() => saveField('email')}
                        disabled={saving}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => toggleEdit('email')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleEdit('email')}
                      className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                {/* bio */}
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="md:w-2/3">
                    <h3 className="font-semibold">Bio</h3>
                    {editing.bio ? (
                      <textarea 
                        name="bio"
                        value={formInputs.bio}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1 mt-1 h-32"
                        placeholder="Tell others about yourself..."
                      />
                    ) : (
                      <p className="text-gray-700">{userData.bio || "Add a bio to tell others about yourself"}</p>
                    )}
                  </div>
                  {editing.bio ? (
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <button 
                        onClick={() => saveField('bio')}
                        disabled={saving}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => toggleEdit('bio')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleEdit('bio')}
                      className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                    >
                      {userData.bio ? 'Edit' : 'Add'}
                    </button>
                  )}
                </div>
              </div>

              {/* save button only shown when there are unsaved changes */}
              {Object.values(editing).some(Boolean) && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button 
                    onClick={saveAllChanges}
                    disabled={saving}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save All Changes'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Security Section */}
            <div className="bg-white p-6 border-2 border-gray-300 rounded-lg shadow-md mb-8">
              <h1 className="text-2xl font-bold mb-6 border-b pb-3">Security</h1>
              
              {/* Password change */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="md:w-2/3">
                    <h3 className="font-semibold">Password</h3>
                    {editing.password ? (
                      <div className="space-y-3 mt-2">
                        <div>
                          <label className="block text-sm text-gray-600">Current Password</label>
                          <input 
                            type="password" 
                            name="currentPassword"
                            value={formInputs.currentPassword}
                            onChange={handleInputChange}
                            className="w-full border rounded px-2 py-1 mt-1"
                            placeholder="Enter your current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">New Password</label>
                          <input 
                            type="password" 
                            name="newPassword"
                            value={formInputs.newPassword}
                            onChange={handleInputChange}
                            className="w-full border rounded px-2 py-1 mt-1"
                            placeholder="Enter a new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Confirm New Password</label>
                          <input 
                            type="password" 
                            name="confirmPassword"
                            value={formInputs.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full border rounded px-2 py-1 mt-1"
                            placeholder="Confirm your new password"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700">••••••••••••</p>
                    )}
                  </div>
                  {editing.password ? (
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <button 
                        onClick={() => saveField('password')}
                        disabled={saving}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={() => toggleEdit('password')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleEdit('password')}
                      className="mt-2 md:mt-0 px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                    >
                      Change Password
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="bg-white p-6 border-2 border-red-300 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-6 border-b border-red-200 pb-3 text-red-600">Danger Zone</h1>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="md:w-2/3">
                    <h3 className="font-semibold text-red-600">Delete Account</h3>
                    <p className="text-gray-700 text-sm">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="mt-2 md:mt-0 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Your Account</h2>
            <p className="mb-4">
              This action is permanent and cannot be undone. All your data will be permanently removed.
            </p>
            <p className="mb-4 font-semibold">
              Please type "DELETE" to confirm:
            </p>
            <input 
              type="text" 
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Type DELETE to confirm"
            />
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                disabled={deletingAccount}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={deletingAccount || deleteConfirmation !== "DELETE"}
                className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${
                  deleteConfirmation !== "DELETE" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {deletingAccount ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
