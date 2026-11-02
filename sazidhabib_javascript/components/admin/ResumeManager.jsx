'use client';

import { useState, useEffect } from 'react';
import MediaLibrary from './MediaLibrary';

const DEFAULT_RESUME_URL = '/Mahbub_Sazid_Habib_Resume.pdf';
const DEFAULT_RESUME_FILENAME = 'Mahbub_Sazid_Habib_Resume.pdf';

const ResumeManager = ({ token }) => {
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_RESUME_URL);
  const [resumeFilename, setResumeFilename] = useState(DEFAULT_RESUME_FILENAME);
  const [isDefault, setIsDefault] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  useEffect(() => {
    fetchResumeSettings();
  }, [token]);

  const fetchResumeSettings = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/resume', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumeUrl(data.resumeUrl || DEFAULT_RESUME_URL);
        setResumeFilename(data.resumeFilename || DEFAULT_RESUME_FILENAME);
        setIsDefault(!!data.isDefault);
        setUpdatedAt(data.updatedAt);
      } else {
        setErrorMsg('Failed to fetch resume settings from database.');
      }
    } catch (err) {
      setErrorMsg('Connection error loading resume settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (urlToSave = resumeUrl, filenameToSave = resumeFilename) => {
    try {
      setSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await fetch('/api/admin/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resumeUrl: urlToSave,
          resumeFilename: filenameToSave
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResumeUrl(data.resumeUrl);
        setResumeFilename(data.resumeFilename);
        setIsDefault(false);
        setUpdatedAt(new Date().toISOString());
        setSuccessMsg('Resume settings saved successfully! Your portfolio is now updated.');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to update resume.');
      }
    } catch (err) {
      setErrorMsg('Connection error while saving resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMsg('');
      setSuccessMsg('');

      // Read file as base64 DataURL
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const dataUrl = await base64Promise;

      // Clean filename
      const cleanFileName = file.name.replace(/\s+/g, '_');

      // Upload to media library so it is saved in the database
      const uploadRes = await fetch('/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: cleanFileName,
          data: dataUrl
        })
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Upload to media library failed');
      }

      const mediaItem = await uploadRes.json();
      const newUrl = mediaItem.url;
      const newFilename = file.name;

      setResumeUrl(newUrl);
      setResumeFilename(newFilename);

      // Automatically commit to resume settings
      await handleSave(newUrl, newFilename);
    } catch (err) {
      setErrorMsg(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      // Reset input value so same file can be picked again if desired
      e.target.value = '';
    }
  };

  const handleResetDefault = async () => {
    if (!window.confirm('Reset resume to the default built-in file (/Mahbub_Sazid_Habib_Resume.pdf)?')) return;
    setResumeUrl(DEFAULT_RESUME_URL);
    setResumeFilename(DEFAULT_RESUME_FILENAME);
    await handleSave(DEFAULT_RESUME_URL, DEFAULT_RESUME_FILENAME);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Resume Configuration</h2>
        <p className="text-slate-400 text-sm mt-1">
          Manage the resume file and link served by the "Download Resume" button on your portfolio without touching any code.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 text-center py-20">Loading resume settings...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Active Resume Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/25 text-accent flex items-center justify-center shrink-0">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-base truncate">
                    {resumeFilename || 'Resume.pdf'}
                  </h3>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${isDefault ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'}`}>
                    {isDefault ? 'Default Asset' : 'Custom Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-1 font-mono max-w-md">
                  {resumeUrl}
                </p>
                {updatedAt && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Last updated: {new Date(updatedAt).toLocaleDateString()} at {new Date(updatedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={resumeFilename}
                className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 flex-1 md:flex-initial"
              >
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Preview / Download
              </a>
              {!isDefault && (
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="py-2.5 px-3 hover:text-red-400 text-slate-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/25 rounded-xl text-xs font-medium transition-all"
                  title="Reset to default built-in resume"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Upload New Resume Box */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-glass flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Quick Upload (PDF / Document)
            </h3>
            <p className="text-xs text-slate-400">
              Upload your new resume PDF directly from your device. It will automatically be stored in your portfolio database and set as active.
            </p>

            <label className="border-2 border-dashed border-white/15 hover:border-accent/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04] group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-accent/15 text-slate-400 group-hover:text-accent border border-white/10 group-hover:border-accent/30 flex items-center justify-center transition-all">
                {uploading ? (
                  <svg className="w-6 h-6 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-white block">
                  {uploading ? 'Uploading and activating resume...' : 'Click to upload or drag and drop new resume'}
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Supported formats: PDF, DOCX (Max: 10MB)
                </span>
              </div>
            </label>
          </div>

          {/* Manual Link & Filename Configuration Form */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-glass flex flex-col gap-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Manual URL &amp; File Details
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300">
                Resume Source URL / Path
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="/Mahbub_Sazid_Habib_Resume.pdf or https://drive.google.com/..."
                  className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-xl outline-none focus:border-accent/40 transition-colors text-sm flex-1 font-mono text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMediaSelector(true)}
                  className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Media Library
                </button>
              </div>
              <span className="text-[11px] text-slate-500">
                Can be a local path (e.g., <code>/Mahbub_Sazid_Habib_Resume.pdf</code>), an uploaded media path (<code>/api/media?id=...</code>), or an external cloud URL (Google Drive, Dropbox, Cloudinary).
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300">
                Download Filename
              </label>
              <input
                type="text"
                value={resumeFilename}
                onChange={(e) => setResumeFilename(e.target.value)}
                placeholder="Mahbub_Sazid_Habib_Resume.pdf"
                className="bg-white/5 border border-white/10 py-2.5 px-4 placeholder:text-slate-500 text-white rounded-xl outline-none focus:border-accent/40 transition-colors text-sm"
                required
              />
              <span className="text-[11px] text-slate-500">
                The name the browser will assign when users click "Download Resume".
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving || uploading}
                className="py-2.5 px-6 bg-accent hover:bg-accent-dark text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-accent/20 flex items-center gap-2 disabled:opacity-50 active:scale-[0.98]"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Resume Settings
                  </>
                )}
              </button>
            </div>
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

            <h3 className="text-xl font-bold text-white mb-6">Select Document or Resume from Library</h3>
            
            <MediaLibrary
              token={token}
              isSelectMode={true}
              onSelect={(url) => {
                setResumeUrl(url);
                setShowMediaSelector(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;

