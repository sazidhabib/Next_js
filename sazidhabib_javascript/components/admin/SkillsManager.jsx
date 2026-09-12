'use client';

import { useState, useEffect } from 'react';
import MediaLibrary from './MediaLibrary';

const SkillsManager = ({ token }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [image, setImage] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      } else {
        setError('Failed to fetch skills');
      }
    } catch (err) {
      setError('Error loading skills');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setName('');
    setCategory('Frontend');
    setImage('');
    setSortOrder('0');
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (skill) => {
    setEditId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setImage(skill.image);
    setSortOrder(skill.sortOrder.toString());
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSkills();
      } else {
        alert('Failed to delete skill');
      }
    } catch (err) {
      alert('Error deleting skill');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      category,
      name,
      image,
      sortOrder: parseInt(sortOrder) || 0
    };

    if (editId) {
      payload.id = editId;
    }

    try {
      const url = '/api/admin/skills';
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
        fetchSkills();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save skill');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Group skills by category for display
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Skills Library</h2>
          <p className="text-slate-400 text-sm">Add and arrange technologies displayed on your portfolio</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-1.5 active:scale-[0.97]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-20">Loading skills database...</div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.keys(groupedSkills).length === 0 ? (
            <div className="text-slate-500 text-center py-16 glass-card rounded-2xl">
              No skills in the database. Use the "Add Skill" button or seed initial data.
            </div>
          ) : (
            Object.keys(groupedSkills).map((cat) => (
              <div key={cat} className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-accent/90 border-b border-white/5 pb-2 capitalize">{cat} Skills</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedSkills[cat].map((skill) => (
                    <div key={skill.id} className="glass-card rounded-xl p-4 flex flex-col items-center justify-between gap-3 group relative border border-white/5 hover:border-accent/25 transition-all duration-300">
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="p-1 hover:text-accent transition-colors bg-white/5 rounded-lg border border-white/5"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1 hover:text-red-400 transition-colors bg-white/5 rounded-lg border border-white/5"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M9 3h6" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl p-2 border border-white/5">
                        <img
                          src={skill.image}
                          alt={skill.name}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = 'https://www.svgrepo.com/show/354262/react-router.svg'; }}
                        />
                      </div>
                      
                      <div className="text-center">
                        <span className="text-white text-sm font-semibold block truncate max-w-[130px]">{skill.name}</span>
                        <span className="text-slate-500 text-xs block mt-0.5">Order: {skill.sortOrder}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
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
              {editId ? 'Edit Skill Detail' : 'Create New Skill'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-white font-medium mb-1.5 text-xs">Skill Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., React JS"
                    className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-white font-medium mb-1.5 text-xs">Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-primary border border-white/10 py-2.5 px-4 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-white font-medium mb-1.5 text-xs">Skill Icon URL</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowMediaSelector(true)}
                    className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    Select
                  </button>
                </div>
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
                  {submitting ? 'Saving...' : 'Save Skill'}
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

            <h3 className="text-xl font-bold text-white mb-6">Select Image from Library</h3>
            
            <MediaLibrary
              token={token}
              isSelectMode={true}
              onSelect={(url) => {
                setImage(url);
                setShowMediaSelector(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
