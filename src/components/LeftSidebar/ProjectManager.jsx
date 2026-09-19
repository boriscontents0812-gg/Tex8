import React from 'react';
import { Plus, Bookmark, Trash2, FolderOpen, Folder } from 'lucide-react';

export default function ProjectManager({
  projects = [],
  currentProject = null,
  onSelectProject,
  onNewProject,
  onContinueWithoutProject,
  onSaveProject,
  onDeleteProject
}) {
  return (
    <div className="anything-card p-4 mb-4 space-y-3.5">
      {/* New Project Button - Anything.com pure black pill */}
      <button
        onClick={onNewProject}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 anything-pill-black text-xs font-medium"
      >
        <Plus className="w-4 h-4" />
        <span>New project</span>
        <span className="text-neutral-400 text-xs">→</span>
      </button>

      {/* Continue without project */}
      <div className="text-center pt-0.5">
        <button
          onClick={onContinueWithoutProject}
          className="text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors py-1 px-3 rounded-full hover:bg-black/[0.04]"
        >
          Continue without project
        </button>
      </div>

      {/* Projects Dropdown */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
          PROJECTS
        </label>
        <div className="relative">
          <select
            value={currentProject ? currentProject.id : ''}
            onChange={(e) => {
              const selected = projects.find(p => p.id === e.target.value);
              if (selected) onSelectProject(selected);
            }}
            className="w-full anything-input rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:outline-none cursor-pointer"
          >
            <option value="" disabled className="bg-white text-neutral-400">Select a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-white text-neutral-900">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save / Delete Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onSaveProject}
          className="anything-pill-white flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs"
        >
          <Bookmark className="w-3.5 h-3.5 text-sky-600" />
          <span>Save project</span>
        </button>

        {currentProject && (
          <button
            onClick={() => onDeleteProject(currentProject.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold transition-all active:scale-[0.98]"
            title="Delete current project"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}


