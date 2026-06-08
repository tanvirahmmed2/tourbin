'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', 
    monthly_price: 0, yearly_price: 0,
    max_tours: 10, max_bookings_per_month: 100, max_staff: 2,
    custom_domain: false, analytics: false, is_active: true,
    image: '', image_id: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post('/api/control/upload', data);
      if (res.data.success) {
        setFormData(prev => ({ ...prev, image: res.data.url, image_id: res.data.public_id }));
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/control/packages', formData, { withCredentials: true });
      router.push('/control/manager/packages');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create package');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/control/manager/packages" className="btn btn-ghost btn-sm">← Back</Link>
        <h1 className="text-3xl font-extrabold text-text">Add New Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-primary/20 rounded-2xl p-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label"><span className="label-text">Name</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Slug</span></label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="input input-bordered" />
          </div>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Description</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered" rows="3"></textarea>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Package Image (Cloudinary)</span></label>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered w-full max-w-xs" disabled={uploading} />
            {uploading && <span className="text-sm text-text-3">Uploading...</span>}
          </div>
          {formData.image && (
            <img src={formData.image} alt="Preview" className="mt-4 w-48 h-32 object-cover rounded-xl border border-primary/20" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label"><span className="label-text">Monthly Price ($)</span></label>
            <input type="number" name="monthly_price" value={formData.monthly_price} onChange={handleChange} className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Yearly Price ($)</span></label>
            <input type="number" name="yearly_price" value={formData.yearly_price} onChange={handleChange} className="input input-bordered" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="form-control">
            <label className="label"><span className="label-text">Max Tours</span></label>
            <input type="number" name="max_tours" value={formData.max_tours} onChange={handleChange} className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Max Bookings/mo</span></label>
            <input type="number" name="max_bookings_per_month" value={formData.max_bookings_per_month} onChange={handleChange} className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Max Staff</span></label>
            <input type="number" name="max_staff" value={formData.max_staff} onChange={handleChange} className="input input-bordered" />
          </div>
        </div>

        <div className="flex gap-8 mt-4">
          <label className="cursor-pointer label justify-start gap-3">
            <input type="checkbox" name="custom_domain" checked={formData.custom_domain} onChange={handleChange} className="checkbox checkbox-primary" />
            <span className="label-text">Custom Domain</span>
          </label>
          <label className="cursor-pointer label justify-start gap-3">
            <input type="checkbox" name="analytics" checked={formData.analytics} onChange={handleChange} className="checkbox checkbox-primary" />
            <span className="label-text">Analytics</span>
          </label>
          <label className="cursor-pointer label justify-start gap-3">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="checkbox checkbox-primary" />
            <span className="label-text">Is Active</span>
          </label>
        </div>

        <div className="mt-8">
          <button type="submit" disabled={loading || uploading} className="btn btn-primary w-full">
            {loading ? 'Creating...' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  );
}
