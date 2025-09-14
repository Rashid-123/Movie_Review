
import React from 'react';
import UserDetails from '../components/UserDetails';
import Watchlist from '../components/Watchlist';

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <UserDetails />
        <Watchlist />
      </div>
    </div>
  );
};

export default UserProfile;