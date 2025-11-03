import React from 'react';
import { useUser } from '../context/UserContext';

const MyOrders = () => {
  const { user } = useUser();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      {/* TODO: Implement orders list once backend is ready */}
      <div className="bg-white shadow-md rounded p-6">
        <p className="text-gray-700 mb-4">Welcome {user?.name}</p>
        <p className="text-gray-600">Your order history will appear here.</p>
      </div>
    </div>
  );
};

export default MyOrders;