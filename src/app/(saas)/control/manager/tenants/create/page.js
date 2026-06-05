'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function CreateTenantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', status: 'active' });
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      [field]: val,
      // Auto-slug from name
      ...(field === 'name' && !f._slugEdited
        ? { slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        : {}),
    }));
  };
  const setSlug = (e) => setForm((f) => ({ ...f, slug: e.target.value, _slugEdited: true }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await axios.post('/api/control/tenants', form);
      router.push('/control/tenants');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tenant');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className={"flex items-start justify-between mb-8"}>
        <div>
          <h1 className={"text-3xl font-extrabold text-text tracking-tight"}>New Tenant</h1>
          <p className={"text-sm text-text-2 mt-1"}>Register a new organisation on the platform</p>
        </div>
      </div>

      <div className={"bg-white/5 border border-border rounded-2xl overflow-hidden"}>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Organisation Name *</label>
            <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={form.name} onChange={set('name')} required placeholder="Acme Tours Ltd" />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Subdomain Slug *</label>
            <div className="flex items-center">
              <input
                className="bg-white/5 border border-border rounded-l-lg border-r-0 px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50 flex-1"
                value={form.slug}
                onChange={setSlug}
                required
                placeholder="acme-tours"
                pattern="[a-z0-9\-]+"
                title="Lowercase letters, numbers, and hyphens only"
              />
              <span className="bg-surface border border-border border-l-0 px-3.5 py-2.5 text-sm text-text-3 rounded-r-lg whitespace-nowrap">
                .yourdomain.com
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Status</label>
            <select className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={form.status} onChange={set('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" className="px-5 py-2.5 rounded-xl bg-white/10 text-text font-bold text-sm hover:bg-white/20 transition disabled:opacity-50" onClick={() => router.back()} disabled={saving}>Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50" disabled={saving}>
              {saving ? 'Creating…' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
