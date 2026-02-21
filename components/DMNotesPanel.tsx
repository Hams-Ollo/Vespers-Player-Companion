import React, { useState, useRef, useEffect } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { useCampaign as useCampaignCtx } from '../contexts/CampaignContext';
import { DMNote, DMNoteType } from '../types';
import {
  BookOpen, Map, User, Scroll, Compass, Shield, Plus, Trash2,
  Save, Search, Tag, X, ChevronRight, Calendar,
} from 'lucide-react';

// ─── Note type config ─────────────────────────────────────────────────
const NOTE_TYPES: { id: DMNoteType; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { id: 'session',  label: 'Session',  icon: <Calendar size={12} />, color: 'text-blue-400',   bg: 'bg-blue-900/30 border-blue-500/30'   },
  { id: 'event',    label: 'Event',    icon: <Scroll size={12} />,   color: 'text-amber-400',  bg: 'bg-amber-900/30 border-amber-500/30' },
  { id: 'npc',      label: 'NPC',      icon: <User size={12} />,     color: 'text-green-400',  bg: 'bg-green-900/30 border-green-500/30' },
  { id: 'location', label: 'Location', icon: <Map size={12} />,      color: 'text-purple-400', bg: 'bg-purple-900/30 border-purple-500/30' },
  { id: 'lore',     label: 'Lore',     icon: <BookOpen size={12} />, color: 'text-cyan-400',   bg: 'bg-cyan-900/30 border-cyan-500/30'   },
  { id: 'quest',    label: 'Quest',    icon: <Compass size={12} />,  color: 'text-red-400',    bg: 'bg-red-900/30 border-red-500/30'     },
];

function typeConf(type: DMNoteType) {
  return NOTE_TYPES.find(t => t.id === type) ?? NOTE_TYPES[0];
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Tag input ────────────────────────────────────────────────────────
const TagInput: React.FC<{ tags: string[]; onChange: (tags: string[]) => void }> = ({ tags, onChange }) => {
  const [input, setInput] = useState('');

  const add = (val: string) => {
    const t = val.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center min-h-[34px] px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl focus-within:border-amber-500/50">
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 text-xs bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded-full">
          <Tag size={9} className="text-zinc-500" />
          {tag}
          <button onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-white" title={`Remove tag "${tag}"`} aria-label={`Remove tag "${tag}"`}>
            <X size={9} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }
          if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1));
        }}
        onBlur={() => { if (input) add(input); }}
        placeholder={tags.length === 0 ? 'Add tags (Enter to confirm)…' : ''}
        className="flex-1 min-w-[120px] bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
      />
    </div>
  );
};

// ─── Note editor ──────────────────────────────────────────────────────
interface EditorProps {
  note: Partial<DMNote>;
  onChange: (patch: Partial<DMNote>) => void;
  onSave: () => void;
  onDelete?: () => void;
  saving: boolean;
  isNew: boolean;
  sessionNumber?: number;
}

const NoteEditor: React.FC<EditorProps> = ({ note, onChange, onSave, onDelete, saving, isNew, sessionNumber }) => {
  const conf = typeConf(note.type ?? 'session');

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Title */}
      <input
        type="text"
        value={note.title ?? ''}
        onChange={e => onChange({ title: e.target.value })}
        placeholder="Note title…"
        className="bg-transparent text-xl font-bold text-white placeholder:text-zinc-600 focus:outline-none border-b border-zinc-800 pb-2"
      />

      {/* Type + Session# row */}
      <div className="flex flex-wrap items-center gap-2">
        {NOTE_TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => onChange({ type: t.id })}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
              note.type === t.id
                ? `${t.bg} ${t.color}`
                : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
        {note.type === 'session' && (
          <label className="flex items-center gap-1.5 ml-2 text-xs text-zinc-500">
            Session #
            <input
              type="number"
              min="1"
              value={note.sessionNumber ?? sessionNumber ?? ''}
              onChange={e => onChange({ sessionNumber: parseInt(e.target.value, 10) || undefined })}
              className="w-12 bg-zinc-900 border border-zinc-700 rounded-lg px-1.5 py-0.5 text-xs text-zinc-300 text-center focus:outline-none focus:border-amber-500/50"
            />
          </label>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest block mb-1.5">Tags</label>
        <TagInput tags={note.tags ?? []} onChange={tags => onChange({ tags })} />
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        <label className="text-xs font-bold text-zinc-600 uppercase tracking-widest block mb-1.5">Notes</label>
        <textarea
          value={note.content ?? ''}
          onChange={e => onChange({ content: e.target.value })}
          placeholder={`Write your ${conf.label.toLowerCase()} notes here…\n\nMarkdown-style formatting works: **bold**, *italic*, # Heading`}
          className="flex-1 min-h-[200px] bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={saving || !note.title?.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Save size={13} />
          {saving ? 'Saving…' : isNew ? 'Create Note' : 'Save Changes'}
        </button>
        {!isNew && onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-red-900/30 text-zinc-500 hover:text-red-400 text-sm font-bold rounded-xl border border-zinc-700 hover:border-red-500/30 transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
const BLANK_NOTE: Partial<DMNote> = {
  title: '',
  content: '',
  type: 'session',
  tags: [],
};

const DMNotesPanel: React.FC = () => {
  const { notes, activeCampaign, createNote, updateNote, deleteNote } = useCampaign();

  const [filterType, setFilterType] = useState<DMNoteType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null);
  const [editState, setEditState] = useState<Partial<DMNote>>(BLANK_NOTE);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const sessionNumber = activeCampaign?.currentSessionNumber ?? 1;

  // Filter notes
  const filtered = notes.filter(n => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.includes(q));
    }
    return true;
  });

  const selectNote = (note: DMNote) => {
    setSelectedId(note.id);
    setEditState({ ...note });
    setDeleteConfirmId(null);
  };

  const startNew = () => {
    setSelectedId('new');
    setEditState({ ...BLANK_NOTE, sessionNumber });
    setDeleteConfirmId(null);
  };

  const handleSave = async () => {
    if (!editState.title?.trim()) return;
    setSaving(true);
    try {
      if (selectedId === 'new') {
        const id = await createNote({
          title: editState.title!,
          content: editState.content ?? '',
          type: editState.type ?? 'session',
          tags: editState.tags ?? [],
          sessionNumber: editState.sessionNumber,
        });
        setSelectedId(id);
      } else if (selectedId) {
        await updateNote(selectedId, {
          title: editState.title,
          content: editState.content,
          type: editState.type,
          tags: editState.tags,
          sessionNumber: editState.sessionNumber,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (deleteConfirmId !== noteId) {
      setDeleteConfirmId(noteId);
      return;
    }
    await deleteNote(noteId);
    if (selectedId === noteId) {
      setSelectedId(null);
      setEditState(BLANK_NOTE);
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex gap-0 min-h-[600px] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* ── Left sidebar: note list ── */}
      <div className="w-64 shrink-0 flex flex-col border-r border-zinc-800">
        {/* Search + new */}
        <div className="p-3 space-y-2 border-b border-zinc-800">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes…"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <button
            onClick={startNew}
            className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Plus size={13} />
            New Note
          </button>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-800">
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
              filterType === 'all'
                ? 'bg-zinc-700 border-zinc-600 text-white'
                : 'bg-transparent border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-700'
            }`}
          >
            All ({notes.length})
          </button>
          {NOTE_TYPES.map(t => {
            const count = notes.filter(n => n.type === t.id).length;
            if (count === 0) return null;
            return (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id)}
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium transition-all ${
                  filterType === t.id
                    ? `${t.bg} ${t.color}`
                    : 'bg-transparent border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {t.icon}{count}
              </button>
            );
          })}
        </div>

        {/* Note list */}
        <div className="flex-1 overflow-y-auto">
          {/* New note placeholder in list */}
          {selectedId === 'new' && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-900/10 border-b border-amber-500/20">
              <Plus size={12} className="text-amber-400 shrink-0" />
              <span className="text-xs italic text-amber-400/80 truncate">New note…</span>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="p-4 text-center text-xs text-zinc-700">
              {notes.length === 0 ? 'No notes yet. Create your first one!' : 'No notes match your filter.'}
            </div>
          )}

          {filtered.map(note => {
            const tc = typeConf(note.type);
            const isSelected = selectedId === note.id;
            return (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className={`w-full text-left px-3 py-2.5 border-b border-zinc-900 hover:bg-zinc-900/70 transition-colors ${
                  isSelected ? 'bg-zinc-900 border-l-2 border-l-amber-500' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 shrink-0 ${tc.color}`}>{tc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-200 truncate">{note.title}</p>
                    <p className="text-xs text-zinc-600 truncate mt-0.5">
                      {note.content ? note.content.slice(0, 60) : <em>No content</em>}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold ${tc.color} capitalize`}>{tc.label}</span>
                      {note.sessionNumber && (
                        <span className="text-xs text-zinc-700">·</span>
                      )}
                      {note.sessionNumber && (
                        <span className="text-xs text-zinc-600">S#{note.sessionNumber}</span>
                      )}
                      <span className="ml-auto text-zinc-700 text-xs">{timeAgo(note.updatedAt)}</span>
                    </div>
                  </div>
                  {isSelected && <ChevronRight size={11} className="text-amber-500 shrink-0 mt-0.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right pane: editor ── */}
      <div className="flex-1 p-6">
        {!selectedId && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-zinc-700">
            <BookOpen size={36} className="opacity-40" />
            <p className="text-sm">Select a note to edit, or create a new one.</p>
          </div>
        )}

        {selectedId && (
          <NoteEditor
            note={editState}
            onChange={patch => setEditState(prev => ({ ...prev, ...patch }))}
            onSave={handleSave}
            onDelete={selectedId !== 'new' ? () => handleDelete(selectedId as string) : undefined}
            saving={saving}
            isNew={selectedId === 'new'}
            sessionNumber={sessionNumber}
          />
        )}

        {/* Delete confirm overlay */}
        {deleteConfirmId && deleteConfirmId === selectedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full mx-4 text-center space-y-4">
              <Trash2 size={28} className="text-red-400 mx-auto" />
              <div>
                <p className="font-bold text-white">Delete this note?</p>
                <p className="text-sm text-zinc-500 mt-1">This cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 py-2.5 bg-red-700 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DMNotesPanel;
