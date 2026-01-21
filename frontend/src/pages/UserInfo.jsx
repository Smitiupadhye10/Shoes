import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  HelpCircle,
  LogOut,
  ShoppingBag,
  Eye,
  EyeOff,
  Edit2,
  Plus,
  Trash2,
  ChevronRight,
  Package,
  Headphones,
  MessageSquare,
  Info
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../api/axios';
import MyOrders from './MyOrders';
import { X } from 'lucide-react';

const UserInfo = () => {
  const { user, updateUser, logout } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(null);
  const [userData, setUserData] = useState({
    joinDate: new Date().toLocaleDateString(),
    lastLogin: new Date().toLocaleString(),
    addresses: [],
    orders: []
  });
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    addressLine1: '',
    addressLine2: '',
    name: '',
    phone: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    newPassword: ''
  });

  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me');

        const { name, email, phone, createdAt, lastLogin, addresses = [], orders = [] } = response.data;

        setFormData({
          name: name || '',
          email: email || '',
          phone: phone || '',
          newPassword: ''
        });

        setUserData({
          joinDate: createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A',
          lastLogin: lastLogin ? new Date(lastLogin).toLocaleString() : 'First login',
          addresses,
          orders
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  // -------------------------------
  // ADDRESS MANAGEMENT FUNCTIONS
  // -------------------------------

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddOrUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const addressData = {
        ...addressForm,
        type: addressForm.type.toLowerCase(),
        isDefault: addressForm.isDefault || userData.addresses.length === 0
      };

      if (isEditingAddress && isEditingAddress !== 'new') {
        await api.put(`/users/addresses/${isEditingAddress}`, addressData);
      } else {
        await api.post('/users/addresses', addressData);
      }

      const response = await api.get('/users/me');

      setUserData((prev) => ({
        ...prev,
        addresses: response.data.addresses || []
      }));

      setAddressForm({
        type: 'home',
        addressLine1: '',
        addressLine2: '',
        name: '',
        phone: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
      setIsEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
      alert(error.response?.data?.message || 'Error saving address. Please try again.');
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      type: address.type || 'home',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      name: address.name || '',
      phone: address.phone || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'India',
      isDefault: address.isDefault || false
    });
    setIsEditingAddress(address._id);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await api.delete(`/users/addresses/${addressId}`);

        const response = await api.get('/users/me');

        setUserData((prev) => ({
          ...prev,
          addresses: response.data.addresses || []
        }));
      } catch (error) {
        console.error('Error deleting address:', error);
        alert(error.response?.data?.message || 'Error deleting address. Please try again.');
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await api.put(`/users/addresses/${addressId}/default`);

      const response = await api.get('/users/me');

      setUserData((prev) => ({
        ...prev,
        addresses: response.data.addresses || []
      }));
    } catch (error) {
      console.error('Error setting default address:', error);
      alert(error.response?.data?.message || 'Error setting default address. Please try again.');
    }
  };

  // -------------------------------
  // PROFILE MANAGEMENT
  // -------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me', formData);
      setIsEditing(false);
      // Refresh user data
      const response = await api.get('/users/me');
      const { name, email, phone } = response.data;
      setFormData(prev => ({ ...prev, name, email, phone, newPassword: '' }));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Error updating profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      localStorage.removeItem('token');
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { id: 'profile', icon: <User />, label: 'Profile Information' },
    { id: 'orders', icon: <ShoppingBag />, label: 'My Orders', badge: userData.orders.length },
    { id: 'addresses', icon: <MapPin />, label: 'My Addresses' },
    { id: 'help', icon: <HelpCircle />, label: 'Help & Support' }
  ];

  // -------------------------------
  // RENDER SECTION
  // -------------------------------

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab
            formData={formData}
            isEditing={isEditing}
            showPassword={showPassword}
            onInputChange={handleInputChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onEditToggle={() => setIsEditing(!isEditing)}
            onSubmit={handleSubmit}
            joinDate={userData.joinDate}
          />
        );
      case 'orders':
        return <MyOrders />;
      case 'addresses':
        return (
          <AddressesTab
            addresses={userData.addresses}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            onAddNew={() => setIsEditingAddress('new')}
            handleSetDefaultAddress={handleSetDefaultAddress}
            isEditingAddress={isEditingAddress}
            addressForm={addressForm}
            onAddressFormChange={handleAddressInputChange}
            onSaveAddress={handleAddOrUpdateAddress}
            onCancelAddress={() => {
              setIsEditingAddress(null);
              setAddressForm({
                type: 'home',
                addressLine1: '',
                addressLine2: '',
                name: '',
                phone: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'India',
                isDefault: false
              });
            }}
          />
        );
      case 'help':
        return (
          <div className="p-6">
            <h2 className="text-optic-heading text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Help & Support</h2>
            <p className="text-optic-body mb-6" style={{ color: 'var(--text-secondary)' }}>Need assistance? Contact our support team or visit the FAQ section.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card-optic p-6">
                <Headphones className="w-8 h-8 mb-3" style={{ color: 'var(--text-heading)' }} />
                <h3 className="text-optic-heading font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Customer Support</h3>
                <p className="text-optic-body text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Get help from our support team</p>
                <a href="mailto:support@solemate.in" className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>support@solemate.in</a>
              </div>
              <div className="card-optic p-6">
                <MessageSquare className="w-8 h-8 mb-3" style={{ color: 'var(--text-heading)' }} />
                <h3 className="text-optic-heading font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>FAQ</h3>
                <p className="text-optic-body text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Find answers to common questions</p>
                <button className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>View FAQ</button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="pt-4 pb-6 md:pt-6 md:pb-8 px-4 sm:px-6" style={{ backgroundColor: 'var(--text-primary)' }}>
        <h1 className="text-optic-heading text-2xl sm:text-3xl font-bold" style={{ color: 'var(--bg-secondary)' }}>My Account</h1>
        <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--bg-secondary)' }}>Manage your profile, orders, and more</p>
      </div>

      {/* Main Layout */}
      <div className="container-optic p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar */}
        <div className="card-optic w-full lg:w-72 p-4 sm:p-6">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              badge={item.badge}
            >
              {item.label}
            </NavItem>
          ))}

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all"
            style={{ color: 'var(--text-heading)' }}
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>

        {/* Main Content */}
        <div className="card-optic flex-1 p-4 sm:p-6">{renderTab()}</div>
      </div>
    </div>
  );
};

// -------------------------------
// REUSABLE COMPONENTS
// -------------------------------

const NavItem = ({ icon, children, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      active ? 'shadow-md' : ''
    }`}
    style={{
      backgroundColor: active ? 'var(--text-heading)' : 'transparent',
      color: active ? 'var(--bg-primary)' : 'var(--text-secondary)'
    }}
  >
    <div className="flex items-center space-x-3">
      <span>{icon}</span>
      <span>{children}</span>
    </div>
    {badge > 0 && (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: 'var(--text-primary)',
          color: 'var(--bg-primary)'
        }}
      >
        {badge}
      </span>
    )}
  </button>
);

// -------------------------------
// TAB COMPONENTS
// -------------------------------

const ProfileTab = ({ formData, isEditing, showPassword, onInputChange, onTogglePassword, onEditToggle, onSubmit, joinDate }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
      {!isEditing && (
        <button
          onClick={onEditToggle}
          className="btn-primary"
        >
          <Edit2 size={16} className="inline mr-2" />
          Edit
        </button>
      )}
    </div>

    {isEditing ? (
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
          style={{ 
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--text-heading)'
          }}
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          placeholder="Phone Number"
          className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
          style={{ 
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--text-heading)'
          }}
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={onInputChange}
            placeholder="New Password"
            className="w-full px-4 py-3 rounded-lg pr-10 focus:ring-2 focus:ring-opacity-50 focus:outline-none"
            style={{ 
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              focusRingColor: 'var(--text-heading)'
            }}
          />
          <button type="button" onClick={onTogglePassword} className="absolute right-3 top-3" style={{ color: 'var(--text-secondary)' }}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </form>
    ) : (
      <div className="space-y-4">
        <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Name:</span>
          <span style={{ color: 'var(--text-primary)' }}>{formData.name}</span>
        </div>
        <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Email:</span>
          <span style={{ color: 'var(--text-primary)' }}>{formData.email}</span>
        </div>
        <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Phone:</span>
          <span style={{ color: 'var(--text-primary)' }}>{formData.phone || 'Not provided'}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Joined:</span>
          <span style={{ color: 'var(--text-primary)' }}>{joinDate}</span>
        </div>
      </div>
    )}
  </div>
);

const AddressesTab = ({ 
  addresses, 
  onEdit, 
  onDelete, 
  onAddNew, 
  handleSetDefaultAddress,
  isEditingAddress,
  addressForm,
  onAddressFormChange,
  onSaveAddress,
  onCancelAddress
}) => {
  const capitalizeFirst = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-optic-heading text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Addresses</h2>
        {!isEditingAddress && (
          <button onClick={onAddNew} className="btn-primary">
            <Plus size={16} className="inline mr-2" />
            Add Address
          </button>
        )}
      </div>

      {isEditingAddress && (
        <div className="card-optic p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {isEditingAddress === 'new' ? 'Add New Address' : 'Edit Address'}
            </h3>
            <button onClick={onCancelAddress} style={{ color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
          </div>
          <form onSubmit={onSaveAddress} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Address Type *</label>
                <select
                  name="type"
                  value={addressForm.type}
                  onChange={onAddressFormChange}
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={addressForm.name}
                  onChange={onAddressFormChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Address Line 1 *</label>
              <input
                type="text"
                name="addressLine1"
                value={addressForm.addressLine1}
                onChange={onAddressFormChange}
                placeholder="Street address, P.O. box"
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={addressForm.addressLine2}
                onChange={onAddressFormChange}
                placeholder="Apartment, suite, unit, building, floor, etc."
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={onAddressFormChange}
                  placeholder="City"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>State *</label>
                <input
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={onAddressFormChange}
                  placeholder="State"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={addressForm.postalCode}
                  onChange={onAddressFormChange}
                  placeholder="Postal Code"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={addressForm.phone}
                  onChange={onAddressFormChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={addressForm.country}
                  onChange={onAddressFormChange}
                  placeholder="Country"
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={onAddressFormChange}
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--text-heading)' }}
              />
              <label htmlFor="isDefault" className="ml-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                Set as default address
              </label>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                {isEditingAddress === 'new' ? 'Add Address' : 'Update Address'}
              </button>
              <button 
                type="button" 
                onClick={onCancelAddress}
                className="px-6 py-3 rounded-lg font-medium transition"
                style={{ 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !isEditingAddress ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <MapPin className="w-8 h-8" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <p className="text-optic-body" style={{ color: 'var(--text-secondary)' }}>No addresses saved yet.</p>
        </div>
      ) : addresses.length > 0 && !isEditingAddress ? (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div key={address._id} className="card-optic p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                  {capitalizeFirst(address.type)}
                </p>
                {address.isDefault && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ backgroundColor: 'var(--text-heading)', color: 'var(--bg-primary)' }}
                  >
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm mb-1 font-medium" style={{ color: 'var(--text-primary)' }}>{address.name}</p>
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{address.phone}</p>
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{address.country}</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => onEdit(address)} className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>Edit</button>
                <button onClick={() => onDelete(address._id)} className="text-sm font-medium" style={{ color: '#ef4444' }}>Delete</button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAddress(address._id)}
                    className="text-sm font-medium"
                    style={{ color: '#10b981' }}
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default UserInfo;
