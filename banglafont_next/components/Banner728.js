"use client";

import { useEffect, useRef } from "react";

export default function Banner728() {
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
                'key' : 'dd04769585e31cf064b4ae3869943868',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highrevenueformat.com/dd04769585e31cf064b4ae3869943868/invoke.js"></script>
          </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    } catch (e) {
      console.error("Failed to load Banner728 ad iframe:", e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-4 overflow-hidden min-h-[90px]">
      <iframe
        ref={iframeRef}
        title="Advertisement 728x90"
        width="728"
        height="90"
        style={{
          border: "none",
          width: "728px",
          height: "90px",
          maxWidth: "100%",
          overflow: "hidden",
        }}
        scrolling="no"
      />
    </div>
  );
}