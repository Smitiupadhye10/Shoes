import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const UserInfo = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">Please sign in to view your account information.</p>
        <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>
      <div className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p className="text-gray-900">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div className="mt-6 border-t pt-6">
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-800 block mb-4"
          >
            View My Orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;