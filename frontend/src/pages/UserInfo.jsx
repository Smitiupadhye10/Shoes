import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, MapPin, CreditCard, Bell, HelpCircle, LogOut, ShoppingBag, Settings, Eye, EyeOff, Check, X, Edit2, Plus, Trash2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const UserInfo = () => {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });
  const [userData, setUserData] = useState({
    joinDate: new Date().toLocaleDateString(),
    lastLogin: new Date().toLocaleString(),
    addresses: []
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const { name, email, phone, createdAt, lastLogin, addresses = [] } = response.data;
        
        setFormData(prev => ({
          ...prev,
          name: name || '',
          email: email || '',
          phone: phone || ''
        }));
        
        setUserData(prev => ({
          ...prev,
          joinDate: new Date(createdAt).toLocaleDateString(),
          lastLogin: lastLogin ? new Date(lastLogin).toLocaleString() : 'First login',
          addresses: addresses.map(addr => ({
            ...addr,
            address: `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`
          }))
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddOrUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const addressData = {
        ...addressForm,
        isDefault: addressForm.isDefault || userData.addresses.length === 0
      };

      if (isEditingAddress) {
        await axios.put(
          `http://localhost:4000/api/users/addresses/${isEditingAddress}`,
          addressData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:4000/api/users/addresses',
          addressData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh addresses
      const response = await axios.get('http://localhost:4000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserData(prev => ({
        ...prev,
        addresses: response.data.addresses || []
      }));

      // Reset form
      setAddressForm({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
      setIsEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleEditAddress = (address) => {
    const [street, ...rest] = address.address.split(',').map(s => s.trim());
    const [city, stateZip, country] = rest.join(',').split(',').map(s => s.trim());
    const [state, postalCode] = stateZip ? stateZip.split(' ') : ['', ''];
    
    setAddressForm({
      type: address.type,
      street: street || '',
      city: city || '',
      state: state || '',
      postalCode: postalCode || '',
      country: country || 'India',
      isDefault: address.isDefault
    });
    setIsEditingAddress(address._id);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/users/addresses/${addressId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Refresh addresses
        const response = await axios.get('http://localhost:4000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData(prev => ({
          ...prev,
          addresses: response.data.addresses || []
        }));
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/api/users/addresses/${addressId}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh addresses
      const response = await axios.get('http://localhost:4000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserData(prev => ({
        ...prev,
        addresses: response.data.addresses || []
      }));
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    setIsEditing(false);
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{userData.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">{userData.lastLogin}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'addresses':
        return (
          <div className="space-y-6">
            {/* Add/Edit Address Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {isEditingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <form onSubmit={handleAddOrUpdateAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                    <select
                      name="type"
                      value={addressForm.type}
                      onChange={handleAddressInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="400001"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  {isEditingAddress && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingAddress(null);
                        setAddressForm({
                          type: 'Home',
                          street: '',
                          city: '',
                          state: '',
                          postalCode: '',
                          country: 'India',
                          isDefault: false
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isEditingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                </div>
              </form>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
              {userData.addresses.length === 0 ? (
                <p className="text-gray-500">No saved addresses found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.addresses.map((address) => (
                    <div 
                      key={address._id} 
                      className={`border rounded-lg p-4 relative ${address.isDefault ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{address.type}</span>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-gray-700">{address.address}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(address._id)}
                          className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Welcome to Your Account</h2>
            <p className="text-gray-600">Select a tab to view or manage your account information.</p>
          </div>
        );
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Account</h1>
              <p className="mt-2 text-blue-100">Manage your profile, orders, and more</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Welcome back,</p>
                  <p className="font-medium">{formData.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {formData.name.charAt(0)}
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-50 transition-all duration-200">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{formData.name}</h3>
                    <p className="text-sm text-gray-500">{formData.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Premium Member
                    </span>
                  </div>
                </div>
              </div>
              
              <nav className="p-2">
                <NavItem 
                  icon={<User className="w-5 h-5" />} 
                  active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                >
                  My Profile
                </NavItem>
                
                <NavItem 
                  icon={<ShoppingBag className="w-5 h-5" />} 
                  active={activeTab === 'orders'}
                  onClick={() => setActiveTab('orders')}
                  badge={userData.orders}
                >
                  My Orders
                </NavItem>
                
                <NavItem 
                  icon={<MapPin className="w-5 h-5" />} 
                  active={activeTab === 'addresses'}
                  onClick={() => setActiveTab('addresses')}
                >
                  Saved Addresses
                </NavItem>
                
                <NavItem 
                  icon={<CreditCard className="w-5 h-5" />} 
                  active={activeTab === 'payments'}
                  onClick={() => setActiveTab('payments')}
                >
                  Payment Methods
                </NavItem>
                
                <div className="border-t border-gray-100 my-2"></div>
                
                <NavItem 
                  icon={<Settings className="w-5 h-5" />} 
                  onClick={() => {}}
                >
                  Account Settings
                </NavItem>
                
                <NavItem 
                  icon={<HelpCircle className="w-5 h-5" />} 
                  onClick={() => {}}
                >
                  Help Center
                </NavItem>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-2 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <StatCard 
                value={userData.orders} 
                label="Orders" 
                icon={<ShoppingBag className="w-5 h-5" />}
                color="text-blue-600"
                bgColor="bg-blue-50"
              />
              <StatCard 
                value={userData.addresses.length} 
                label="Addresses" 
                icon={<MapPin className="w-5 h-5" />}
                color="text-emerald-600"
                bgColor="bg-emerald-50"
              />
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const NavItem = ({ icon, children, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
      active 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className={active ? 'text-blue-600' : 'text-gray-400'}>
        {icon}
      </span>
      <span>{children}</span>
    </div>
    {badge > 0 && (
      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ value, label, icon, color, bgColor }) => (
  <div className={`${bgColor} p-4 rounded-xl`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <div className={`p-2 rounded-lg ${bgColor.replace('bg-', 'bg-opacity-50 bg-')}`}>
        {React.cloneElement(icon, { className: `w-6 h-6 ${color}` })}
      </div>
    </div>
  </div>
);

// Tab Components
const ProfileTab = ({ 
  formData, 
  isEditing, 
  showPassword, 
  onInputChange, 
  onTogglePassword,
  onEditToggle,
  onSubmit
}) => (
  <div className="p-6 md:p-8">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-500">Update your personal details here</p>
      </div>
      {!isEditing ? (
        <button
          onClick={onEditToggle}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={onSubmit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Check className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button
            onClick={onEditToggle}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      )}
    </div>

    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="text-gray-900">{formData.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          ) : (
            <p className="text-gray-900">{formData.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          ) : (
            <p className="text-gray-900">{formData.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
          <p className="text-gray-500">January 2023</p>
        </div>
      </div>

      {isEditing && (
        <div className="pt-6 mt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={onInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters long and include at least one number and one special character.
            </p>
          </div>
        </div>
      )}
    </form>
  </div>
);

const OrdersTab = ({ orders }) => (
  <div className="p-6 md:p-8">
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900">Order History</h2>
      <p className="text-sm text-gray-500">View and track your recent orders</p>
    </div>
    
    {orders > 0 ? (
      <div className="space-y-4">
        {[...Array(orders)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                      <img
                        src={`https://picsum.photos/200/200?random=${i}`}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Order #ORD-{1000 + i + 1}</h3>
                      <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">$149.99</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end space-y-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                    Delivered
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Buy Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
        <div className="mt-6">
          <Link
            to="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )}
  </div>
);

const AddressesTab = ({ addresses }) => (
  <div className="p-6 md:p-8">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
        <p className="text-sm text-gray-500">Manage your delivery addresses</p>
      </div>
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add New Address</span>
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`p-6 rounded-xl border ${
            address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <MapPin className={`w-5 h-5 ${
                address.isDefault ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <span className="ml-2 font-medium text-gray-900">{address.type}</span>
              {address.isDefault && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Default
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-blue-600 p-1">
                <Edit2 className="w-4 h-4" />
              </button>
              {!address.isDefault && (
                <button className="text-gray-400 hover:text-red-600 p-1">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="mt-3 text-gray-600 ml-7">{address.address}</p>
          {!address.isDefault && (
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium ml-7">
              Set as default
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const PaymentsTab = ({ payments }) => (
  <div className="p-6 md:p-8">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
        <p className="text-sm text-gray-500">Manage your saved payment methods</p>
      </div>
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add New Card</span>
      </button>
    </div>

    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="p-6 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center">
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center mr-4">
              {payment.type === 'Visa' && (
                <span className="text-sm font-bold text-blue-800">VISA</span>
              )}
            </div>
            <div>
              <div className="font-medium">•••• •••• •••• {payment.last4}</div>
              <div className="text-sm text-gray-500">Expires {payment.expiry}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {payment.isDefault && (
              <span className="px-2.5 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                Default
              </span>
            )}
            <button className="text-gray-400 hover:text-blue-600">
              <Edit2 className="w-4 h-4" />
            </button>
            {!payment.isDefault && (
              <button className="text-gray-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserInfo;