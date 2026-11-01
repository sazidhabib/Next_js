'use client';

import { useState, useEffect } from 'react';
import MediaLibrary from './MediaLibrary';

const TechnologiesManager = ({ token }) => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/technologies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTechnologies(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch technologies');
      }
    } catch (err) {
      setError('Error loading technologies');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Populate the default 13 Tech Stack items (HTML, CSS, JS, TS, React, Redux, Tailwind, Node, MongoDB, Three JS, git, figma, docker)?')) return;
    try {
      setSeeding(true);
      setError('');
      setSuccessMsg('');
      const res = await fetch('/api/admin/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'seed' })
      });

      if (res.ok) {
        const data = await res.json();
        setTechnologies(Array.isArray(data) ? data : []);
        setSuccessMsg('Successfully populated all 13 tech stack items!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setError('Failed to populate default technologies');
      }
    } catch (err) {
      setError('Connection error seeding technologies');
    } finally {
      setSeeding(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setIcon('');
    const nextOrder = technologies.length > 0 
      ? Math.max(...technologies.map(t => t.sortOrder || 0)) + 1 
      : 0;
    setSortOrder(nextOrder.toString());
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (tech) => {
    setEditId(tech.id);
    setName(tech.name);
    setIcon(tech.icon);
    setSortOrder((tech.sortOrder !== undefined ? tech.sortOrder : 0).toString());
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technology icon?')) return;
    try {
      const res = await fetch(`/api/admin/technologies?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTechnologies();
      } else {
        alert('Failed to delete technology');
      }
    } catch (err) {
      alert('Error deleting technology');
    }
  };

  const handleSwapOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= technologies.length) return;

    const current = technologies[index];
    const target = technologies[targetIndex];

    try {
      const currentOrder = current.sortOrder !== undefined ? current.sortOrder : index;
      const targetOrder = target.sortOrder !== undefined ? target.sortOrder : targetIndex;

      await Promise.all([
        fetch('/api/admin/technologies', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...current, sortOrder: targetOrder })
        }),
        fetch('/api/admin/technologies', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...target, sortOrder: currentOrder === targetOrder ? (direction === 'up' ? targetOrder + 1 : targetOrder - 1) : currentOrder })
        })
      ]);

      fetchTechnologies();
    } catch (err) {
      alert('Failed to reorder technologies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      name,
      icon,
      sortOrder: parseInt(sortOrder) || 0
    };

    if (editId) {
      payload.id = editId;
    }

    try {
      const url = '/api/admin/technologies';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        fetchTechnologies();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save technology');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Tech Stack Icons</h2>
          <p className="text-slate-400 text-sm">Manage the floating 3D/glass tech stack icons shown in the "Technologies / Tech Stack" section</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="py-2 px-3.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-[0.97] disabled:opacity-50"
            title="Populate/Reset the 13 default technology icons"
          >
            <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
            </svg>
            {seeding ? 'Populating...' : 'Populate All 13 Defaults'}
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-1.5 active:scale-[0.97]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Technology
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 text-center py-20">Loading tech stack items...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {technologies.length === 0 ? (
            <div className="text-slate-400 text-center py-16 glass-card rounded-2xl flex flex-col items-center gap-4">
              <p className="text-base text-slate-300">No tech stack items currently found in the database.</p>
              <button
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="py-3 px-6 bg-accent hover:bg-accent-dark text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-accent/20 flex items-center gap-2 active:scale-[0.97]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {seeding ? 'Populating...' : 'Click Here to Add All 13 Tech Stack Items Now'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {technologies.map((tech, index) => (
                <div
                  key={tech.id || tech.name}
                  className="glass-card rounded-2xl p-4 flex flex-col items-center justify-between gap-3 group relative border border-white/5 hover:border-accent/30 transition-all duration-300"
                >
                  {/* Action buttons (top right) */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleOpenEdit(tech)}
                      className="p-1 hover:text-accent transition-colors bg-white/5 hover:bg-white/10 rounded-lg border border-white/5"
                      title="Edit"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(tech.id)}
                      className="p-1 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 rounded-lg border border-white/5"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M9 3h6" />
                      </svg>
                    </button>
                  </div>

                  {/* Ordering arrows (top left) */}
                  <div className="absolute top-2 left-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      disabled={index === 0}
                      onClick={() => handleSwapOrder(index, 'up')}
                      className="p-1 hover:text-accent disabled:opacity-30 disabled:hover:text-slate-500 transition-colors bg-white/5 rounded-lg border border-white/5"
                      title="Move Left/Earlier"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      disabled={index === technologies.length - 1}
                      onClick={() => handleSwapOrder(index, 'down')}
                      className="p-1 hover:text-accent disabled:opacity-30 disabled:hover:text-slate-500 transition-colors bg-white/5 rounded-lg border border-white/5"
                      title="Move Right/Later"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Icon container */}
                  <div className="w-14 h-14 mt-3 flex items-center justify-center bg-white/5 rounded-xl p-2.5 border border-white/5 group-hover:scale-105 transition-transform">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg';
                      }}
                    />
                  </div>

                  {/* Name and Sort Order */}
                  <div className="text-center w-full">
                    <span className="text-white text-sm font-semibold block truncate" title={tech.name}>
                      {tech.name}
                    </span>
                    <span className="text-slate-500 text-xs block mt-0.5">
                      Order: {tech.sortOrder !== undefined ? tech.sortOrder : index}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-md px-4">
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 relative border border-white/10 shadow-glass">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {editId ? 'Edit Tech Stack Item' : 'Add New Tech Stack Item'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-white font-medium mb-1.5 text-xs">Technology Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., React JS, Node JS, Three JS"
                  className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <span className="text-white font-medium mb-1.5 text-xs">Icon / Image URL or Path</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="/src/assets/tech/reactjs.png or https://..."
                    className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowMediaSelector(true)}
                    className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                  >
                    Media Library
                  </button>
                </div>
                {icon && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-slate-500 text-xs">Preview:</span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center">
                      <img
                        src={icon}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-white font-medium mb-1.5 text-xs">Display Sort Order</span>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="e.g., 0, 1, 2"
                  className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm"
                  required
                />
                <span className="text-slate-500 text-[11px] mt-1">
                  Lower numbers appear first (left to right).
                </span>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Technology'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Selector Modal */}
      {showMediaSelector && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/90 backdrop-blur-md px-4 overflow-y-auto pt-10 pb-10">
          <div className="w-full max-w-4xl glass-card rounded-2xl p-6 relative border border-white/10 shadow-glass my-auto max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowMediaSelector(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-6">Select Image from Media Library</h3>
            
            <MediaLibrary
              token={token}
              isSelectMode={true}
              onSelect={(url) => {
                setIcon(url);
                setShowMediaSelector(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologiesManager;
