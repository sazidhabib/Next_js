"use client";

import { useEffect, useRef } from "react";

export default function Banner300() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentWindow || iframe.contentDocument;
      const iframeDoc = doc.document || doc;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              html, body { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '7541c46a85052a48bf31789531028836',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highrevenueformat.com/7541c46a85052a48bf31789531028836/invoke.js"></script>
          </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    } catch (e) {
      console.error("Failed to load Banner300 ad iframe:", e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-2 overflow-hidden min-h-[250px]">
      <iframe
        ref={iframeRef}
        title="Advertisement 300x250"
        width="300"
        height="250"
        style={{
          border: "none",
          width: "300px",
          height: "250px",
          overflow: "hidden",
        }}
        scrolling="no"
      />
    </div>
  );
}