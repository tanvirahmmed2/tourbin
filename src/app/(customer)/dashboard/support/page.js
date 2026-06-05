'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/dashboard/ui';

export default function CustomerSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '', priority: 'normal' });

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/customer/support');
      setTickets(res.data.data.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axios.post('/api/customer/support', formData);
      setFormData({ subject: '', message: '', priority: 'normal' });
      fetchTickets();
    } catch (err) {
      alert('Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">My Support Tickets</h1>
        {tickets.map(t => (
          <div key={t.ticket_id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-slate-800">{t.subject}</h3>
              <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${
                t.status === 'open' ? 'bg-blue-100 text-blue-700' :
                t.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-700'
              }`}>{t.status}</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">{t.message}</p>
            <div className="flex justify-between text-xs text-slate-500 border-t border-slate-100 pt-4 mt-auto">
              <span>{new Date(t.created_at).toLocaleDateString()}</span>
              <span>{t.reply_count} Replies</span>
            </div>
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
            No support tickets.
          </div>
        )}
      </div>

      <div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-8">
          <h2 className="text-lg font-bold mb-4">Open New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
              <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
              <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20" />
            </div>
            <button disabled={creating} type="submit" className="w-full btn-custom-primary !h-10 text-sm">
              {creating ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
