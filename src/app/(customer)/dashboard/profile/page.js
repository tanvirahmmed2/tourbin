'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/dashboard/ui';

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/customer/profile');
        setFormData({ name: res.data.data.profile.name, email: res.data.data.profile.email, password: '' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: formData.name, email: formData.email };
      if (formData.password) payload.password = formData.password;
      await axios.patch('/api/customer/profile', payload);
      alert('Profile updated successfully');
      setFormData(prev => ({ ...prev, password: '' })); // clear password
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Password (Optional)</label>
          <input type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
        </div>

        <button disabled={saving} type="submit" className="w-full btn-custom-primary mt-2">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
