"use client";

import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, 
  Video, Heading1, Heading2, List, ListOrdered, AlignLeft, 
  AlignCenter, AlignRight, RefreshCw
} from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';

export default function RichTextEditor({ value, onChange, placeholder = "Enter product description..." }) {
  const editorRef = useRef(null);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [savedRange, setSavedRange] = useState(null);

  // Set initial value once, or update if external change happens and it doesn't match editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleLink = () => {
    const url = prompt("Enter link URL (e.g. https://example.com):");
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const saveSelection = () => {
    if (typeof window === 'undefined') return null;
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        return range;
      }
    }
    return null;
  };

  const restoreSelection = (range) => {
    if (typeof window === 'undefined' || !range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleImage = () => {
    const range = saveSelection();
    setSavedRange(range);
    setIsMediaOpen(true);
  };

  const handleMediaSelect = (urls) => {
    if (Array.isArray(urls)) {
      if (savedRange) {
        restoreSelection(savedRange);
      }
      editorRef.current.focus();
      
      urls.forEach(url => {
        document.execCommand('insertImage', false, url);
      });
      handleInput();
      setSavedRange(null);
    }
  };

  const handleVideo = () => {
    const url = prompt("Enter YouTube video URL or Embed Iframe code:");
    if (!url) return;

    let embedHtml = '';
    if (url.trim().startsWith('<iframe')) {
      embedHtml = `<div class="rich-video-container my-4 relative aspect-[16/9] w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg">${url}</div>`;
    } else {
      // Parse YouTube watch URL or share URL
      let videoId = '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
        embedHtml = `<div class="rich-video-container my-4 relative aspect-[16/9] w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute inset-0 w-full h-full"></iframe></div>`;
      } else {
        alert("Invalid YouTube URL. Please use watch link or embed code.");
        return;
      }
    }

    insertHTMLAtCursor(embedHtml);
  };

  const insertHTMLAtCursor = (html) => {
    editorRef.current.focus();
    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      
      const el = document.createElement("div");
      el.innerHTML = html;
      
      const frag = document.createDocumentFragment();
      let node;
      let lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      editorRef.current.innerHTML += html;
    }
    handleInput();
  };

  const handleButtonMouseDown = (e, callback) => {
    e.preventDefault();
    callback();
  };

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 focus-within:border-blue-500 transition-all flex flex-col">
      {/* Toolbar */}
      <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex flex-wrap gap-1 items-center select-none">
        {[
          { icon: Bold, label: 'Bold', action: () => executeCommand('bold') },
          { icon: Italic, label: 'Italic', action: () => executeCommand('italic') },
          { icon: Underline, label: 'Underline', action: () => executeCommand('underline') },
          { icon: Heading1, label: 'Heading 1', action: () => executeCommand('formatBlock', '<h1>') },
          { icon: Heading2, label: 'Heading 2', action: () => executeCommand('formatBlock', '<h2>') },
          { icon: List, label: 'Bullet List', action: () => executeCommand('insertUnorderedList') },
          { icon: ListOrdered, label: 'Number List', action: () => executeCommand('insertOrderedList') },
          { icon: AlignLeft, label: 'Align Left', action: () => executeCommand('justifyLeft') },
          { icon: AlignCenter, label: 'Align Center', action: () => executeCommand('justifyCenter') },
          { icon: AlignRight, label: 'Align Right', action: () => executeCommand('justifyRight') },
          { icon: LinkIcon, label: 'Link', action: handleLink },
          { icon: ImageIcon, label: 'Image', action: handleImage },
          { icon: Video, label: 'YouTube Video', action: handleVideo }
        ].map((btn, index) => {
          const Icon = btn.icon;
          return (
            <button
              key={index}
              type="button"
              onMouseDown={(e) => handleButtonMouseDown(e, btn.action)}
              className="p-2 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded transition flex items-center justify-center"
              title={btn.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
        <button
          type="button"
          onMouseDown={(e) => handleButtonMouseDown(e, () => executeCommand('removeFormat'))}
          className="p-2 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded transition ml-auto flex items-center justify-center"
          title="Clear Formatting"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rich-editor-content px-4 py-3 min-h-[180px] max-h-[500px] overflow-y-auto text-slate-200 text-sm focus:outline-none resize-y"
        placeholder={placeholder}
        style={{
          outline: 'none',
        }}
      />
      
      <MediaLibraryModal
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={handleMediaSelect}
        multiSelect={true}
        title="Insert Image(s) into Description"
      />
    </div>
  );
}
