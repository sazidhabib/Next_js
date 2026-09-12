'use client';

import { useState, useEffect } from 'react';

const MessagesView = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err) {
      setError('Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id, currentReadStatus) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, read: !currentReadStatus })
      });
      if (res.ok) {
        // Optimistic update
        setMessages(messages.map(m => m.id === id ? { ...m, read: !currentReadStatus } : m));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating message status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
      } else {
        alert('Failed to delete message');
      }
    } catch (err) {
      alert('Error deleting message');
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white">Contact Submissions</h2>
        <p className="text-slate-400 text-sm">Read and manage messages received through the portfolio contact form</p>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-20">Loading messages inbox...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="text-slate-500 text-center py-16 glass-card rounded-2xl">
              No contact messages in the inbox.
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4 w-12">Status</th>
                      <th className="px-6 py-4 w-48">Sender</th>
                      <th className="px-6 py-4 w-48">Email</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4 w-44">Received</th>
                      <th className="px-6 py-4 w-28 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                    {messages.map((msg) => (
                      <tr key={msg.id} className={`hover:bg-white/[0.01] transition-colors ${!msg.read ? 'bg-accent/5' : ''}`}>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleRead(msg.id, msg.read)}
                            className="focus:outline-none"
                            title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                          >
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${msg.read ? 'bg-slate-700' : 'bg-accent animate-pulse'}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 font-bold text-white truncate max-w-[190px]">{msg.name}</td>
                        <td className="px-6 py-4 truncate max-w-[190px]">
                          <a href={`mailto:${msg.email}`} className="text-accent hover:underline">{msg.email}</a>
                        </td>
                        <td className="px-6 py-4 min-w-[240px] whitespace-pre-wrap leading-relaxed py-4 pr-10">{msg.message}</td>
                        <td className="px-6 py-4 text-xs text-slate-450">{formatDate(msg.createdAt)}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleToggleRead(msg.id, msg.read)}
                              className="p-1.5 hover:text-accent transition-colors bg-white/5 rounded-lg border border-white/5"
                              title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                {msg.read ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2" />
                                )}
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(msg.id)}
                              className="p-1.5 hover:text-red-400 transition-colors bg-white/5 rounded-lg border border-white/5"
                              title="Delete Message"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M9 3h6" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesView;
