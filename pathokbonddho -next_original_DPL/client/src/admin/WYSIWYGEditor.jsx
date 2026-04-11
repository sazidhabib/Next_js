import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const WYSIWYGEditor = forwardRef(({
    value,
    onChange,
    placeholder = "Start typing...",
    height = 300,
    onImageClick,
    onEditImage
}, ref) => {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [savedRange, setSavedRange] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

    // Handle selection and scroll effects
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
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        
        // Remove selection highlights when clicking outside or selecting other images
        if (selectedElement) {
            selectedElement.setAttribute('data-selected', 'true');
        }

        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
            if (selectedElement) {
                selectedElement.removeAttribute('data-selected');
            }
        };
    }, [selectedElement]);

    // Initialize editor content
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value || '';
        }
    }, []);

    // Update editor when value changes from parent
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            setSavedRange(selection.getRangeAt(0));
        }
    };

    const restoreSelection = () => {
        if (savedRange && editorRef.current) {
            editorRef.current.focus();
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedRange);
        }
    };

    useImperativeHandle(ref, () => ({
        insertHTML: (html) => {
            restoreSelection();
            document.execCommand('insertHTML', false, html);
            handleInput();
        },
        saveSelection: () => {
            saveSelection();
        },
        focus: () => {
            if (editorRef.current) {
                editorRef.current.focus();
            }
        }
    }));

    const handleInput = () => {
        const newContent = editorRef.current.innerHTML;
        onChange(newContent);
    };

    const handleEditorClick = (e) => {
        const target = e.target;
        
        // Check if we clicked an image or a figure
        const img = target.closest('img');
        const figure = target.closest('figure');
        
        const element = figure || img;
        
        if (element && editorRef.current.contains(element)) {
            setSelectedElement(element);
            
            // Calculate position for toolbar
            const rect = element.getBoundingClientRect();
            const editorRect = editorRef.current.parentElement.getBoundingClientRect();
            
            setToolbarPosition({
                top: rect.top - editorRect.top - 40,
                left: rect.left - editorRect.left + (rect.width / 2)
            });
        } else {
            setSelectedElement(null);
        }
    };

    const handleDeleteElement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectedElement) {
            selectedElement.remove();
            setSelectedElement(null);
            handleInput();
        }
    };

    const handleEditElement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectedElement && onEditImage) {
            // Extract data from element
            let img = selectedElement;
            let caption = '';
            let format = 'full-width';

            if (selectedElement.tagName === 'FIGURE') {
                img = selectedElement.querySelector('img');
                const figcaption = selectedElement.querySelector('figcaption');
                caption = figcaption ? figcaption.innerText : '';
                format = 'full-width-captioned';
            } else {
                // Determine format based on style
                const style = selectedElement.getAttribute('style') || '';
                if (style.includes('float: left')) format = 'left-aligned';
                else if (style.includes('float: right')) format = 'right-aligned';
            }

            const imageData = {
                imageUrl: img.getAttribute('src').replace(`${API_URL}/`, ''),
                alt: img.getAttribute('alt') || '',
                caption: caption,
                format: format,
                element: selectedElement
            };

            onEditImage(imageData);
            setSelectedElement(null);
        }
    };

    // Improved execCommand with better focus handling
    const execCommand = (command, value = null) => {
        // Store current selection before focusing
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        // Focus the editor
        editorRef.current.focus();

        // Restore selection if it exists
        if (range) {
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Execute command
        document.execCommand(command, false, value);
        handleInput();
    };

    const insertHTML = (html) => {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, html);
        handleInput();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        handleInput();
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        saveSelection();
    };

    // Toolbar button handlers with event prevention
    const handleBold = (e) => {
        e.preventDefault();
        execCommand('bold');
    };

    const handleItalic = (e) => {
        e.preventDefault();
        execCommand('italic');
    };

    const handleUnderline = (e) => {
        e.preventDefault();
        execCommand('underline');
    };

    const handleStrikethrough = (e) => {
        e.preventDefault();
        execCommand('strikeThrough');
    };

    const handleJustifyLeft = (e) => {
        e.preventDefault();
        execCommand('justifyLeft');
    };

    const handleJustifyCenter = (e) => {
        e.preventDefault();
        execCommand('justifyCenter');
    };

    const handleJustifyRight = (e) => {
        e.preventDefault();
        execCommand('justifyRight');
    };

    const handleBulletList = (e) => {
        e.preventDefault();
        execCommand('insertUnorderedList');
    };

    const handleNumberedList = (e) => {
        e.preventDefault();
        execCommand('insertOrderedList');
    };

    const handleRemoveFormat = (e) => {
        e.preventDefault();
        execCommand('removeFormat');
    };

    const handleUndo = (e) => {
        e.preventDefault();
        execCommand('undo');
    };

    const handleRedo = (e) => {
        e.preventDefault();
        execCommand('redo');
    };

    // FIXED: Blockquote handler
    const handleBlockquote = (e) => {
        e.preventDefault();
        editorRef.current.focus();

        // Check if we're already in a blockquote
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            let node = range.commonAncestorContainer;

            // Traverse up to find if we're inside a blockquote
            while (node && node.nodeType !== 1) {
                node = node.parentNode;
            }

            if (node && node.nodeName === 'BLOCKQUOTE') {
                // If already in blockquote, remove it
                const content = node.innerHTML;
                const p = document.createElement('p');
                p.innerHTML = content;
                node.parentNode.replaceChild(p, node);
            } else {
                // If not in blockquote, create one
                document.execCommand('formatBlock', false, 'blockquote');
            }
            handleInput();
        }
    };

    // FIXED: Heading handler
    const handleHeadingChange = (e) => {
        const value = e.target.value;
        editorRef.current.focus();

        if (value === 'p') {
            document.execCommand('formatBlock', false, '<p>');
        } else {
            document.execCommand('formatBlock', false, `<${value}>`);
        }
        handleInput();
    };

    // FIXED: Font Size handler
    const handleFontSizeChange = (e) => {
        const size = e.target.value;
        editorRef.current.focus();

        // Use font size command
        document.execCommand('fontSize', false, size);
        handleInput();
    };

    const handleColorChange = (e) => {
        execCommand('foreColor', e.target.value);
    };

    const handleLinkInsert = (e) => {
        e.preventDefault();
        const url = prompt('Enter URL:');
        if (url) {
            const selection = window.getSelection();
            if (selection.toString().trim() === '') {
                insertHTML(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
            } else {
                execCommand('createLink', url);
            }
        }
    };

    const handleImageInsert = (e) => {
        e.preventDefault();
        saveSelection();
        if (onImageClick) {
            onImageClick();
        } else {
            const imageUrl = prompt('Enter image URL:');
            if (imageUrl) {
                const altText = prompt('Enter alt text:') || 'Image';
                insertHTML(`<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 0.375rem; margin: 1em 0; display: block;" />`);
            }
        }
    };

    const handleCodeBlockInsert = (e) => {
        e.preventDefault();
        insertHTML('<pre style="background: #f4f4f4; padding: 10px; border-radius: 4px; overflow: auto;"><code>Code here</code></pre>');
    };

    // Add some CSS styles for better visual feedback
    const editorStyles = {
        height: '100%',
        minHeight: '100px',
        padding: '1rem',
        outline: 'none',
        overflow: 'auto',
        lineHeight: '1.6',
        border: isFocused ? '2px solid #3b82f6' : 'none',
        backgroundColor: 'white'
    };

    const Toolbar = () => (
        <div
            className="d-flex flex-wrap gap-1 p-2 bg-light border-bottom"
        >
            {/* Text Formatting */}
            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleBold}
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleItalic}
                    title="Italic"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleUnderline}
                    title="Underline"
                >
                    <u>U</u>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleStrikethrough}
                    title="Strikethrough"
                >
                    <s>S</s>
                </button>
            </div>

            {/* Headings - FIXED: Removed event prevention for dropdowns */}
            <div className="btn-group">
                <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    onChange={handleHeadingChange}
                    title="Heading"
                    defaultValue="p"
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                </select>
            </div>

            {/* Font Size - FIXED: Removed event prevention for dropdowns */}
            <div className="btn-group">
                <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    onChange={handleFontSizeChange}
                    title="Font Size"
                    defaultValue="3"
                >
                    <option value="1">Small</option>
                    <option value="2">Medium</option>
                    <option value="3">Normal</option>
                    <option value="4">Large</option>
                    <option value="5">X-Large</option>
                    <option value="6">XX-Large</option>
                    <option value="7">XXX-Large</option>
                </select>
            </div>

            {/* Text Color - FIXED: Only prevent default on color input */}
            <div className="btn-group">
                <input
                    type="color"
                    className="form-control form-control-sm"
                    style={{ width: '40px', padding: '2px' }}
                    onChange={handleColorChange}
                    onMouseDown={(e) => {
                        // Only prevent default for the color picker popup
                        if (e.target.type === 'color') {
                            e.preventDefault();
                        }
                    }}
                    title="Text Color"
                />
            </div>

            {/* Lists */}
            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleBulletList}
                    title="Bullet List"
                >
                    <i className="fa-solid fa-list-ul"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleNumberedList}
                    title="Numbered List"
                >
                    <i className="fa-solid fa-list-ol"></i>
                </button>
            </div>

            {/* Alignment */}
            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleJustifyLeft}
                    title="Align Left"
                >
                    <i className="fa-solid fa-align-left"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleJustifyCenter}
                    title="Align Center"
                >
                    <i className="fa-solid fa-align-center"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleJustifyRight}
                    title="Align Right"
                >
                    <i className="fa-solid fa-align-right"></i>
                </button>
            </div>

            {/* Links & Images */}
            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleLinkInsert}
                    title="Insert Link"
                >
                    <i className="fa-solid fa-link"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleImageInsert}
                    title="Insert Image"
                >
                    <i className="fa-regular fa-image"></i>
                </button>
            </div>

            {/* Block Elements */}
            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleBlockquote}
                    title="Blockquote"
                >
                    <i className="fa-solid fa-quote-left"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleCodeBlockInsert}
                    title="Code Block"
                >
                    <i className="fa-solid fa-code"></i>
                </button>
            </div>

            {/* Undo/Redo */}
            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleUndo}
                    title="Undo"
                >
                    <i className="fa-solid fa-rotate-left"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleRedo}
                    title="Redo"
                >
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>

            {/* Clear Formatting */}
            <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleRemoveFormat}
                title="Clear Formatting"
            >
                <i className="fa-solid fa-eraser"></i>
            </button>
        </div>
    );

    return (
        <div className="border rounded" style={{ height: `${height}px`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Toolbar />
            <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onPaste={handlePaste}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onClick={handleEditorClick}
                    style={editorStyles}
                    className="editor-content"
                    data-placeholder={placeholder}
                />

                {/* Floating Image Toolbar inside scrollable area */}
                {selectedElement && (
                    <div 
                        className="position-absolute bg-dark text-white rounded shadow d-flex gap-2 p-1"
                        style={{ 
                            top: `${toolbarPosition.top}px`, 
                            left: `${toolbarPosition.left}px`,
                            transform: 'translateX(-50%)',
                            zIndex: 1000,
                            height: '32px'
                        }}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur
                    >
                        <button 
                            type="button"
                            className="btn btn-sm btn-dark p-1 d-flex align-items-center"
                            onClick={handleEditElement}
                            title="Edit Image"
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <div className="vr bg-white opacity-25"></div>
                        <button 
                            type="button"
                            className="btn btn-sm btn-dark p-1 d-flex align-items-center text-danger"
                            onClick={handleDeleteElement}
                            title="Delete Image"
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .editor-content img, .editor-content figure {
                    transition: outline 0.2s;
                    cursor: pointer;
                }
                .editor-content img:hover, .editor-content figure:hover {
                    outline: 2px solid #3b82f6;
                }
                .editor-content img[data-selected="true"], .editor-content figure[data-selected="true"] {
                    outline: 2px solid #2563eb !important;
                }
            `}</style>
        </div>
    );
});

export default WYSIWYGEditor;