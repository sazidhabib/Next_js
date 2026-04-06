'use client';

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const WYSIWYGEditor = forwardRef(({
    value,
    onChange,
    placeholder = "Start typing...",
    height = 300,
    onImageClick,
    onEditImage
}, ref) => {
    const editorRef = useRef(null);
    const savedRangeRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const handleScroll = () => {
            if (selectedElement && editorRef.current) {
                const rect = selectedElement.getBoundingClientRect();
                const containerRect = editorRef.current.parentElement.getBoundingClientRect();
                setToolbarPosition({
                    top: rect.top - containerRect.top - 40,
                    left: rect.left - containerRect.left + (rect.width / 2)
                });
            }
        };

        const container = editorRef.current?.parentElement;
        if (container) container.addEventListener('scroll', handleScroll);

        if (selectedElement) selectedElement.setAttribute('data-selected', 'true');

        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
            if (selectedElement) selectedElement.removeAttribute('data-selected');
        };
    }, [selectedElement]);

    useEffect(() => {
        if (editorRef.current) editorRef.current.innerHTML = value || '';
    }, []);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) editorRef.current.innerHTML = value || '';
    }, [value]);

    const saveSelection = () => { const s = window.getSelection(); if (s.rangeCount > 0) savedRangeRef.current = s.getRangeAt(0).cloneRange(); };
    const restoreSelection = () => { if (savedRangeRef.current && editorRef.current) { editorRef.current.focus(); const s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRangeRef.current); } };
    const handleInput = () => { const c = editorRef.current.innerHTML; onChange(c); };

    useImperativeHandle(ref, () => ({
        insertHTML: (html) => { restoreSelection(); document.execCommand('insertHTML', false, html); handleInput(); },
        saveSelection: () => saveSelection(),
        syncContent: () => handleInput(),
        focus: () => { if (editorRef.current) editorRef.current.focus(); }
    }));

    const execCommand = (command, val = null) => {
        const s = window.getSelection(); const r = s.rangeCount > 0 ? s.getRangeAt(0) : null;
        editorRef.current.focus(); if (r) { s.removeAllRanges(); s.addRange(r); }
        document.execCommand(command, false, val); handleInput();
    };

    const insertHTML = (html) => { editorRef.current.focus(); document.execCommand('insertHTML', false, html); handleInput(); };
    const handlePaste = (e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); handleInput(); };

    const handleEditorClick = (e) => {
        const img = e.target.closest('img'); const figure = e.target.closest('figure'); const el = figure || img;
        if (el && editorRef.current.contains(el)) {
            setSelectedElement(el);
            const rect = el.getBoundingClientRect(); const er = editorRef.current.parentElement.getBoundingClientRect();
            setToolbarPosition({ top: rect.top - er.top - 40, left: rect.left - er.left + (rect.width / 2) });
        } else setSelectedElement(null);
    };

    const handleDeleteElement = (e) => { e.preventDefault(); e.stopPropagation(); if (selectedElement) { selectedElement.remove(); setSelectedElement(null); handleInput(); } };

    const handleEditElement = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (selectedElement && onEditImage) {
            let img = selectedElement, caption = '', format = 'full-width';
            if (selectedElement.tagName === 'FIGURE') { img = selectedElement.querySelector('img'); const fc = selectedElement.querySelector('figcaption'); caption = fc ? fc.innerText : ''; format = 'full-width-captioned'; }
            else { const style = selectedElement.getAttribute('style') || ''; if (style.includes('float: left')) format = 'left-aligned'; else if (style.includes('float: right')) format = 'right-aligned'; }
            onEditImage({ imageUrl: img.getAttribute('src'), alt: img.getAttribute('alt') || '', caption, format, element: selectedElement });
            setSelectedElement(null);
        }
    };

    const handleBold = (e) => { e.preventDefault(); execCommand('bold'); };
    const handleItalic = (e) => { e.preventDefault(); execCommand('italic'); };
    const handleUnderline = (e) => { e.preventDefault(); execCommand('underline'); };
    const handleStrikethrough = (e) => { e.preventDefault(); execCommand('strikeThrough'); };
    const handleBulletList = (e) => { e.preventDefault(); execCommand('insertUnorderedList'); };
    const handleNumberedList = (e) => { e.preventDefault(); execCommand('insertOrderedList'); };
    const handleRemoveFormat = (e) => { e.preventDefault(); execCommand('removeFormat'); };
    const handleUndo = (e) => { e.preventDefault(); execCommand('undo'); };
    const handleRedo = (e) => { e.preventDefault(); execCommand('redo'); };

    const handleBlockquote = (e) => {
        e.preventDefault();
        editorRef.current.focus();
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            let node = range.commonAncestorContainer;
            while (node && node.nodeType !== 1) node = node.parentNode;
            if (node && node.nodeName === 'BLOCKQUOTE') {
                const content = node.innerHTML;
                const p = document.createElement('p');
                p.innerHTML = content;
                node.parentNode.replaceChild(p, node);
            } else {
                document.execCommand('formatBlock', false, 'blockquote');
            }
            handleInput();
        }
    };

    const handleHeadingChange = (e) => {
        const val = e.target.value;
        editorRef.current.focus();
        if (val === 'p') document.execCommand('formatBlock', false, '<p>');
        else document.execCommand('formatBlock', false, `<${val}>`);
        handleInput();
    };

    const handleFontSizeChange = (e) => {
        const size = e.target.value;
        editorRef.current.focus();
        document.execCommand('fontSize', false, size);
        handleInput();
    };

    const handleColorChange = (e) => execCommand('foreColor', e.target.value);

    const handleLinkInsert = (e) => {
        e.preventDefault();
        const url = prompt('Enter URL:');
        if (url) {
            const s = window.getSelection();
            if (s.toString().trim() === '') insertHTML(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
            else execCommand('createLink', url);
        }
    };

    const handleImageInsert = (e) => {
        e.preventDefault();
        saveSelection();
        if (onImageClick) onImageClick();
        else {
            const url = prompt('Enter image URL:');
            if (url) {
                const alt = prompt('Enter alt text:') || 'Image';
                insertHTML(`<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 0.375rem; margin: 1em 0; display: block;" />`);
            }
        }
    };

    const handleCodeBlockInsert = (e) => { e.preventDefault(); insertHTML('<pre style="background: #f4f4f4; padding: 10px; border-radius: 4px; overflow: auto;"><code>Code here</code></pre>'); };

    const handleJustifyLeft = (e) => { e.preventDefault(); execCommand('justifyLeft'); };
    const handleJustifyCenter = (e) => { e.preventDefault(); execCommand('justifyCenter'); };
    const handleJustifyRight = (e) => { e.preventDefault(); execCommand('justifyRight'); };

    return (
        <div className="border rounded" style={{ height: `${height}px`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div className="d-flex flex-wrap gap-1 p-2 bg-light border-bottom">
                <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleBold} title="Bold"><strong>B</strong></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleItalic} title="Italic"><em>I</em></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleUnderline} title="Underline"><u>U</u></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleStrikethrough} title="Strikethrough"><s>S</s></button>
                </div>
                <div className="btn-group">
                    <select className="form-select form-select-sm" style={{ width: 'auto' }} onChange={handleHeadingChange} title="Heading" defaultValue="p">
                        <option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="h4">Heading 4</option>
                    </select>
                </div>
                <div className="btn-group">
                    <select className="form-select form-select-sm" style={{ width: 'auto' }} onChange={handleFontSizeChange} title="Font Size" defaultValue="3">
                        <option value="1">Small</option><option value="2">Medium</option><option value="3">Normal</option><option value="4">Large</option><option value="5">X-Large</option><option value="6">XX-Large</option><option value="7">XXX-Large</option>
                    </select>
                </div>
                <div className="btn-group">
                    <input type="color" className="form-control form-control-sm" style={{ width: '40px', padding: '2px' }} onChange={handleColorChange} onMouseDown={e => { if (e.target.type === 'color') e.preventDefault(); }} title="Text Color" />
                </div>
                <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleBulletList} title="Bullet List"><i className="fa-solid fa-list-ul"></i></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleNumberedList} title="Numbered List"><i className="fa-solid fa-list-ol"></i></button>
                </div>
                <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleJustifyLeft} title="Align Left"><i className="fa-solid fa-align-left"></i></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleJustifyCenter} title="Align Center"><i className="fa-solid fa-align-center"></i></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleJustifyRight} title="Align Right"><i className="fa-solid fa-align-right"></i></button>
                </div>
                <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleLinkInsert} title="Insert Link"><i className="fa-solid fa-link"></i></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleImageInsert} title="Insert Image"><i className="fa-regular fa-image"></i></button>
                </div>
                <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleBlockquote} title="Blockquote"><i className="fa-solid fa-quote-left"></i></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleCodeBlockInsert} title="Code Block"><i className="fa-solid fa-code"></i></button>
                </div>
                <div className="btn-group">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleUndo} title="Undo"><i className="fa-solid fa-rotate-left"></i></button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleRedo} title="Redo"><i className="fa-solid fa-rotate-right"></i></button>
                </div>
                <button type="button" className="btn btn-sm btn-outline-secondary" onMouseDown={e => e.preventDefault()} onClick={handleRemoveFormat} title="Clear Formatting"><i className="fa-solid fa-eraser"></i></button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                <div ref={editorRef} contentEditable onInput={handleInput} onPaste={handlePaste} onFocus={() => setIsFocused(true)} onBlur={() => { setIsFocused(false); saveSelection(); }} onClick={handleEditorClick}
                    style={{ height: '100%', minHeight: '100px', padding: '1rem', outline: 'none', overflow: 'auto', lineHeight: '1.6', border: isFocused ? '2px solid #3b82f6' : 'none', backgroundColor: 'white' }} className="editor-content" data-placeholder={placeholder} />
                {selectedElement && (
                    <div className="position-absolute bg-dark text-white rounded shadow d-flex gap-2 p-1" style={{ top: `${toolbarPosition.top}px`, left: `${toolbarPosition.left}px`, transform: 'translateX(-50%)', zIndex: 1000, height: '32px' }} onMouseDown={e => e.preventDefault()}>
                        <button type="button" className="btn btn-sm btn-dark p-1 d-flex align-items-center" onClick={handleEditElement} title="Edit Image"><i className="fa-solid fa-pen-to-square"></i></button>
                        <div className="vr bg-white opacity-25"></div>
                        <button type="button" className="btn btn-sm btn-dark p-1 d-flex align-items-center text-danger" onClick={handleDeleteElement} title="Delete Image"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                )}
            </div>
            <style>{`
                .editor-content img, .editor-content figure { transition: outline .2s; cursor: pointer; }
                .editor-content img:hover, .editor-content figure:hover { outline: 2px solid #3b82f6; }
                .editor-content img[data-selected="true"], .editor-content figure[data-selected="true"] { outline: 2px solid #2563eb !important; }
                .editor-content ul { list-style-type: disc !important; padding-left: 2.5rem !important; margin-bottom: 1rem !important; }
                .editor-content ol { list-style-type: decimal !important; padding-left: 2.5rem !important; margin-bottom: 1rem !important; }
                .editor-content li { margin-bottom: 0.5rem !important; display: list-item !important; }
            `}</style>
        </div>
    );
});

WYSIWYGEditor.displayName = 'WYSIWYGEditor';
export default WYSIWYGEditor;
