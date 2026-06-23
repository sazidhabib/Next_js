'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore, editorStore, Project } from '../../store/editorStore';

interface RecentProjectsProps {
  onCreateNewClick: () => void;
}

export default function RecentProjects({ onCreateNewClick }: RecentProjectsProps) {
  const router = useRouter();
  const projects = useEditorStore((state) => state.projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [menuOpenProjectId, setMenuOpenProjectId] = useState<string | null>(null);

  // Close menus on click outside
  useEffect(() => {
    const closeMenus = () => setMenuOpenProjectId(null);
    window.addEventListener('click', closeMenus);
    return () => window.removeEventListener('click', closeMenus);
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditProject = (id: string) => {
    editorStore.loadProject(id);
    router.push('/editor');
  };

  const handleRenameProject = (id: string, currentName: string) => {
    const newName = prompt('Rename Project', currentName);
    if (newName !== null && newName.trim() !== '') {
      editorStore.renameProject(id, newName.trim());
    }
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the project "${name}"? This cannot be undone.`)) {
      editorStore.deleteProject(id);
    }
  };

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="font-headline-md text-headline-md font-bold">Recent Projects</h2>
        <div className="flex items-center gap-4 self-end md:self-auto">
          {/* View toggle */}
          <div className="flex border border-outline-variant rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 flex items-center justify-center transition-all ${
                viewMode === 'grid'
                  ? 'bg-surface-container-highest text-primary font-bold'
                  : 'hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 flex items-center justify-center transition-all ${
                viewMode === 'list'
                  ? 'bg-surface-container-highest text-primary font-bold'
                  : 'hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">list</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-lg pl-8 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none w-48 sm:w-64 transition-all"
              placeholder="Search projects..."
            />
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Projects */}
          {filteredProjects.map((project) => (
            <div key={project.id} className="bento-card rounded-xl overflow-hidden flex flex-col group relative">
              <div className="relative h-48 bg-surface-container-lowest">
                <img
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  alt={project.name}
                  src={project.thumbnail}
                />

                {project.status && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#3B82F6] text-white text-[10px] font-bold rounded uppercase">
                    {project.status}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEditProject(project.id)}
                    className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    title="Open in Editor"
                  >
                    <span className="material-symbols-outlined block">edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenProjectId(menuOpenProjectId === project.id ? null : project.id);
                    }}
                    className="bg-surface text-on-surface w-10 h-10 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform hover:bg-surface-container-highest active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined block">more_horiz</span>
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] font-mono-data uppercase tracking-tighter">
                  {project.duration}
                </div>
              </div>

              {/* Action Dropdown Menu */}
              {menuOpenProjectId === project.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-2 top-12 bg-surface-container border border-outline-variant rounded-lg p-1 shadow-xl z-50 flex flex-col min-w-[120px]"
                >
                  <button
                    onClick={() => {
                      setMenuOpenProjectId(null);
                      handleRenameProject(project.id, project.name);
                    }}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-surface-container-high rounded text-xs text-on-surface hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[16px] block">drive_file_rename_outline</span>
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpenProjectId(null);
                      handleDeleteProject(project.id, project.name);
                    }}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-surface-container-high rounded text-xs text-error hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[16px] block text-error">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              )}

              <div className="p-4">
                <h4
                  className="font-body-md text-body-md font-bold mb-1 truncate group-hover:text-primary transition-colors cursor-pointer"
                  onClick={() => handleEditProject(project.id)}
                >
                  {project.name}
                </h4>
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Modified {project.modifiedAt}</span>
                  <div className="flex items-center gap-2">
                    <span>{project.size}</span>
                    <span className="material-symbols-outlined text-[14px]">cloud_done</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Start New Session Button */}
          <div
            onClick={onCreateNewClick}
            className="border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-8 hover:border-primary group transition-colors cursor-pointer min-h-[260px] bg-surface-container/20"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
              <span className="material-symbols-outlined text-2xl block">add</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary uppercase tracking-wider">
              Start New Session
            </span>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="w-full bg-surface-container border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 hover:bg-surface-container-high transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-10 rounded overflow-hidden bg-surface-container-lowest flex-shrink-0">
                  <img className="w-full h-full object-cover" src={project.thumbnail} alt={project.name} />
                </div>
                <div className="min-w-0">
                  <h4
                    className="font-body-md text-body-md font-bold truncate group-hover:text-primary cursor-pointer"
                    onClick={() => handleEditProject(project.id)}
                  >
                    {project.name}
                  </h4>
                  <span className="text-xs text-on-surface-variant">Modified {project.modifiedAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs text-on-surface-variant font-mono-data">
                <span className="bg-black/40 px-2 py-0.5 rounded">{project.duration}</span>
                <span>{project.size}</span>
                {project.status && (
                  <span className="bg-primary/20 border border-primary/30 text-primary text-[9px] px-1.5 py-0.5 rounded uppercase font-bold font-sans">
                    {project.status}
                  </span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProject(project.id)}
                    className="p-1.5 hover:bg-surface-container-highest text-primary rounded transition-all active:scale-95 cursor-pointer font-sans"
                    title="Open in Editor"
                  >
                    <span className="material-symbols-outlined text-lg block">edit</span>
                  </button>
                  <button
                    onClick={() => handleRenameProject(project.id, project.name)}
                    className="p-1.5 hover:bg-surface-container-highest rounded text-on-surface transition-all active:scale-95 cursor-pointer font-sans"
                    title="Rename Project"
                  >
                    <span className="material-symbols-outlined text-lg block">drive_file_rename_outline</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="p-1.5 hover:bg-surface-container-highest rounded text-error transition-all active:scale-95 cursor-pointer font-sans"
                    title="Delete Project"
                  >
                    <span className="material-symbols-outlined text-lg block text-error">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
