'use client';

import { useState, useEffect } from 'react';
import MediaLibrary from './MediaLibrary';

const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return [val];
    }
  }
  return [val];
};

const ExperienceManager = ({ token }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [editId, setEditId] = useState(null);
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [date, setDate] = useState('');
  const [descText, setDescText] = useState(''); // Textarea with line-breaks
  const [skillsText, setSkillsText] = useState(''); // Comma separated list
  const [sortOrder, setSortOrder] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/experiences');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      } else {
        setError('Failed to fetch experiences');
      }
    } catch (err) {
      setError('Error loading experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setRole('');
    setCompany('');
    setCompanyLogo('');
    setDate('');
    setDescText('');
    setSkillsText('');
    setSortOrder('0');
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (exp) => {
    const descArray = ensureArray(exp.description);
    const skillsArray = ensureArray(exp.skills);
    setEditId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setCompanyLogo(exp.companyLogo || '');
    setDate(exp.date);
    setDescText(descArray.join('\n\n'));
    setSkillsText(skillsArray.join(', '));
    setSortOrder((exp.sortOrder || 0).toString());
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try {
      const res = await fetch(`/api/admin/experiences?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchExperiences();
      } else {
        alert('Failed to delete experience');
      }
    } catch (err) {
      alert('Error deleting experience');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Format description text back into an array of paragraphs
    const descriptionArray = descText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    // Format skills text back into an array
    const skillsArray = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload = {
      role,
      company,
      companyLogo,
      date,
      description: descriptionArray,
      skills: skillsArray,
      sortOrder: parseInt(sortOrder) || 0
    };

    if (editId) {
      payload.id = editId;
    }

    try {
      const url = '/api/admin/experiences';
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
        fetchExperiences();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save experience');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Work Experience</h2>
          <p className="text-slate-400 text-sm">Manage career timeline roles and details shown on your portfolio</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-1.5 active:scale-[0.97]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Role
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-20">Loading experiences database...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {experiences.length === 0 ? (
            <div className="text-slate-500 text-center py-16 glass-card rounded-2xl">
              No experience items in the database. Use the "Add Role" button or seed initial data.
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="glass-card rounded-xl p-6 flex flex-col sm:flex-row gap-5 border border-white/5 hover:border-accent/25 transition-all duration-300 relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-1.5 hover:text-accent transition-colors bg-white/5 rounded-lg border border-white/5 text-xs font-semibold flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 hover:text-red-400 transition-colors bg-white/5 rounded-lg border border-white/5 text-xs font-semibold flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M9 3h6" />
                    </svg>
                    Delete
                  </button>
                </div>

                <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/5 p-2 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={exp.companyLogo}
                    alt={exp.company}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => { e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdFJmybFp9hgFmci0L4srOF-YYwndid8Rrog&s'; }}
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2.5">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug">{exp.role}</h3>
                    <p className="text-accent text-sm font-semibold mt-0.5">{exp.company} <span className="text-slate-500 font-normal ml-2">| &nbsp;{exp.date}</span></p>
                  </div>
                  
                  <div className="text-slate-350 text-sm flex flex-col gap-2 max-w-4xl">
                    {ensureArray(exp.description).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {ensureArray(exp.skills).map((s, i) => (
                      <span key={i} className="text-xs bg-white/5 border border-white/10 text-slate-300 py-1 px-2.5 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                  
                  <span className="text-slate-500 text-xs mt-1">Display order: {exp.sortOrder}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-md px-4 overflow-y-auto pt-10 pb-10">
          <div className="w-full max-w-2xl glass-card rounded-2xl p-6 relative border border-white/10 shadow-glass my-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {editId ? 'Edit Work Role Details' : 'Add Work Experience Role'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-white font-medium mb-1.5 text-xs">Role Title</span>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Lead Developer"
                    className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-white font-medium mb-1.5 text-xs">Company Name</span>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google"
                    className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-white font-medium mb-1.5 text-xs">Company Logo Image URL</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={companyLogo}
                      onChange={(e) => setCompanyLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm flex-1"
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
                  <span className="text-white font-medium mb-1.5 text-xs">Date Range String</span>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g., Jun 2024 - Present"
                    className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-white font-medium mb-1.5 text-xs">Job Description (One paragraph per line)</span>
                <textarea
                  value={descText}
                  onChange={(e) => setDescText(e.target.value)}
                  placeholder="Collaborated with teams to...&#10;Managed architecture stack..."
                  rows={4}
                  className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm resize-none font-medium"
                  required
                />
              </div>

              <div className="flex flex-col">
                <span className="text-white font-medium mb-1.5 text-xs">Skills Used (Comma separated)</span>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="React, Redux, Node.js, TypeScript"
                  className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors text-sm"
                  required
                />
              </div>

              <div className="flex flex-col">
                <span className="text-white font-medium mb-1.5 text-xs">Sort Order</span>
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
                  {submitting ? 'Saving...' : 'Save Role'}
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
                setCompanyLogo(url);
                setShowMediaSelector(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManager;
