'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-panel-padding h-toolbar-height border-b border-outline-variant bg-surface">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary cursor-pointer hover:opacity-95">
          CineFlow Pro
        </Link>
        <nav className="hidden md:flex gap-4">
          <Link className="text-primary font-bold border-b-2 border-primary pb-1 font-label-caps text-label-caps" href="/">
            File
          </Link>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            Edit
          </a>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            Sequence
          </a>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            Clip
          </a>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            Graphics
          </a>
          <a className="text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-150 px-2 rounded font-label-caps text-label-caps" href="#">
            View
          </a>
        </nav>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex gap-1 mr-2">
          <button className="p-2 hover:bg-surface-container-high rounded transition-colors active:scale-95 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined block">settings</span>
          </button>
          <button className="p-2 hover:bg-surface-container-high rounded transition-colors active:scale-95 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined block">notifications</span>
          </button>
        </div>
        
        <button className="px-4 py-1.5 text-on-surface font-medium border border-outline-variant hover:bg-surface-container-high rounded transition-all active:scale-95 text-body-md font-body-md">
          Share
        </button>
        <Link href="/editor" className="px-4 py-1.5 bg-primary-container text-on-primary-container font-bold rounded hover:opacity-90 transition-all active:scale-95 text-body-md font-body-md flex items-center justify-center">
          Open Editor
        </Link>
        
        <div className="w-8 h-8 rounded-full overflow-hidden ml-2 border border-outline-variant">
          <img
            className="w-full h-full object-cover"
            alt="User profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAjGADBhkt1XxXgXw-xgCpjoSuvP0VtS0KRyOf1lvJuPR8fuJonAuy4tGOpLgyY6bUcAMYxYkuvZam6Tb_rZ7PFnCH0m890BGcf0cC9by8nTlOYIw_JvsqAnLw6umPcholkJN0qrgvdkweg8x1HLFnnYslPXmnTrKbWVc0ziRBULVITknfQk2t8SdNwKS2p_lQzXsP7Rj2MOxl48qL_4nXNSb4VliJcrM-i5KEIZ4nVnq-J5myz62BOaFBcaCqOtUZQdl42TNoP7Zu"
          />
        </div>
      </div>
    </header>
  );
}
