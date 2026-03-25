import React from 'react';
import { User, Building, Phone, Mail, MapPin } from 'lucide-react';

/**
 * GuestForm Component
 * Renders the input fields for guest personal information.
 */
const GuestForm = ({ formData, handleChange, isDark }) => {
  const inputContainerClass = `flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
    isDark 
      ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50' 
      : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
  }`;

  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1";
  const inputClass = "bg-transparent border-none outline-none w-full text-sm font-bold text-slate-600 dark:text-slate-200";

  return (
    <div className="space-y-6">
      {/* Name Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="group">
          <label className={labelClass}>First Name</label>
          <div className={inputContainerClass}>
            <User size={18} className="text-slate-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className={inputClass}
              required
            />
          </div>
        </div>
        <div className="group">
          <label className={labelClass}>Last Name</label>
          <div className={inputContainerClass}>
            <User size={18} className="text-slate-400" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>

      {/* Company Group */}
      <div className="group">
        <label className={labelClass}>Affiliated Company</label>
        <div className={inputContainerClass}>
          <Building size={18} className="text-slate-400" />
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company name"
            className={inputClass}
          />
        </div>
      </div>

      {/* Contact Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="group">
          <label className={labelClass}>Phone Number</label>
          <div className={inputContainerClass}>
            <Phone size={18} className="text-slate-400" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className={inputClass}
              required
            />
          </div>
        </div>
        <div className="group">
          <label className={labelClass}>Email ID</label>
          <div className={inputContainerClass}>
            <Mail size={18} className="text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className={inputClass}
              required
            />
          </div>
        </div>
      </div>

      {/* Address Group */}
      <div className="group">
        <label className={labelClass}>Permanent Address</label>
        <div className={`flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all ${
          isDark 
            ? 'bg-slate-800/30 border-slate-700 focus-within:border-emerald-500/50' 
            : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500'
        }`}>
          <MapPin size={18} className="text-slate-400 mt-1" />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full street address"
            rows="3"
            className={`${inputClass} resize-none min-h-[80px]`}
          />
        </div>
      </div>
    </div>
  );
};

export default GuestForm;
