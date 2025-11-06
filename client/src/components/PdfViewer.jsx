import React, { useEffect, useRef, useState } from 'react';

// Lightweight PDF.js loader + renderer using CDN-delivered pdf.js
export default function PdfViewer({ url }) {
  const containerRef = useRef(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    // Load pdf.js if not already present
    const ensurePdfJs = () => {
      return new Promise((resolve, reject) => {
        if (window.pdfjsLib) return resolve(window.pdfjsLib);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
        script.async = true;
        script.onload = () => {
          // set worker src
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            return resolve(window.pdfjsLib);
          }
          reject(new Error('pdfjs failed to load'));
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    let isCancelled = false;
    let currentPdf = null;

    (async () => {
      try {
        const pdfjsLib = await ensurePdfJs();
        if (isCancelled) return;

        const loadingTask = pdfjsLib.getDocument(url);
        currentPdf = await loadingTask.promise;
        if (isCancelled) return;
        pdfRef.current = currentPdf;

        const renderPages = async () => {
          const container = containerRef.current;
          if (!container) return;

          // clear existing
          container.innerHTML = '';

          for (let pageNum = 1; pageNum <= currentPdf.numPages; pageNum++) {
            const page = await currentPdf.getPage(pageNum);

            // create wrapper for each page to allow margin/footer spacing
              const pageWrapper = document.createElement('div');
              pageWrapper.style.width = '100%';
              pageWrapper.style.display = 'block';
              pageWrapper.style.marginBottom = '18px';

              const canvas = document.createElement('canvas');
              // make canvas responsive: set CSS width to 100% and height auto
              canvas.style.display = 'block';
              canvas.style.width = '100%';
              canvas.style.height = 'auto';

              pageWrapper.appendChild(canvas);
              container.appendChild(pageWrapper);

              const viewport = page.getViewport({ scale: 1 });
              // compute scale such that page width fits container width
              // Calculate initial scale to fit container width
              const containerWidth = container.clientWidth;
              // Use a slightly smaller scale to prevent text from being too large
              const scale = (containerWidth / viewport.width) * 0.85;
              const scaledViewport = page.getViewport({ scale });

              // Set canvas internal pixel size for crisp rendering
              canvas.width = Math.floor(scaledViewport.width);
              canvas.height = Math.floor(scaledViewport.height);
              
              // Apply anti-aliasing for better text rendering
              const ctx = canvas.getContext('2d');
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';

              const renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: scaledViewport,
              };

              await page.render(renderContext).promise;
          }

          setPdfLoaded(true);
        };

        await renderPages();

        // re-render on resize (debounced)
        let resizeTimeout = null;
        const onResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            if (!pdfRef.current) return;
            renderPages();
          }, 200);
        };

        window.addEventListener('resize', onResize);

        // cleanup
        const cleanup = () => {
          window.removeEventListener('resize', onResize);
        };

        // attach cleanup to ref so we can call on unmount
        pdfRef.current.__cleanup = cleanup;
      } catch (err) {
        console.error('PDF load/render error', err);
      }
    })();

    return () => {
      isCancelled = true;
      if (pdfRef.current && pdfRef.current.__cleanup) pdfRef.current.__cleanup();
      pdfRef.current = null;
    };
  }, [url]);

  return (
    <div className="pdf-canvas-root" style={{ width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          minHeight: '60vh',
          boxSizing: 'border-box',
          padding: '0',
          background: '#fff',
        }}
      />
      {!pdfLoaded && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#777' }}>Loading document…</div>
      )}
    </div>
  );
}
