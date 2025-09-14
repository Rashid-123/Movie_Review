import React, { useState } from 'react';
import { User, Mail, Edit3, Save, X, Calendar , LogOut } from 'lucide-react';
import { useAuth } from '../context/authContext';
import Loader from '../components/Loader';

const UserDetails = () => {
    const { user, updateProfile , logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });
 
const handleLogout = () => {
    logout();
    navigate('/');
  };


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
        setSuccess(''); // Clear success when user types
    };

    const handleEdit = () => {
        setIsEditing(true);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            username: user?.username || '',
            email: user?.email || ''
        });
        setError('');
        setSuccess('');
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');

        if (!formData.username || !formData.email) {
            setError('Please fill in all fields');
            return;
        }

        // Check if anything changed
        if (formData.username === user.username && formData.email === user.email) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        const result = await updateProfile(formData);
        setLoading(false);

        if (result.success) {
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(result.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <Loader text="Updating profile..." />;
    }

    return (
        <div className="bg-white border border-gray-300 p-6 sm:p-8 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                {/* <h1 className="text-2xl font-bold text-gray-800">User Profile</h1> */}
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 px-2 py-1 border border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                        <Edit3 size={16} />
                        <span>Edit Profile</span>
                    </button>
                ) : <span></span>}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-2 py-1 border border-red-200 text-red-500 hover:bg-red-50"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Profile Picture Section */}
            <div className="flex items-center mb-8">
                <div
                    className="w-20 h-20 bg-blue-600 flex items-center justify-center text-white text-2xl font-bold"
                    style={{ borderRadius: '50%' }}
                >
                    {user?.username?.charAt(0).toUpperCase() || <User size={32} />}
                </div>
                <div className="ml-6">
                    <h2 className="text-xl font-semibold text-gray-800">{user?.username}</h2>
                    <p className="text-gray-600">Profile Picture: Not Available</p>
                </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
                {/* Username Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                    </label>
                    {isEditing ? (
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter username"
                            />
                        </div>
                    ) : (
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-gray-800">
                            {user?.username}
                        </div>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    {isEditing ? (
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter email"
                            />
                        </div>
                    ) : (
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-gray-800">
                            {user?.email}
                        </div>
                    )}
                </div>

                {/* Created At Field (Read Only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                    </label>
                    <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </div>
                </div>
            </div>

            {/* Action Buttons for Edit Mode */}
            {isEditing && (
                <div className="flex space-x-4 mt-8">
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white hover:bg-green-700"
                    >
                        <Save size={16} />
                        <span>Save Changes</span>
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        <X size={16} />
                        <span>Cancel</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDetails;