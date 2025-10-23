import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import TopNameBar from '@/components/mobile/TopNameBar';
import manualPdf from '@/assets/83056-01-02manual.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfView() {
    const [params] = useSearchParams();
    const raw = params.get('file');
    const isManual = !raw || /83056-01-02manual\.pdf$/i.test(raw || '');
    const file = isManual ? manualPdf : raw;

    const [numPages, setNumPages] = useState(null);
    const [width, setWidth] = useState(window.innerWidth);
    const [loading, setLoading] = useState(true); // track loading state

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <TopNameBar title="PDF Viewer" />
            <main className="flex-1 overflow-auto bg-muted p-3">
                {file ? (
                    <div className="flex flex-col items-center bg-muted">
                        {loading && (
                            <p className="text-center mt-4 text-gray-500">
                                Loading PDF...
                            </p>
                        )}
                        <Document
                            file={file}
                            onLoadSuccess={({ numPages }) => {
                                setNumPages(numPages);
                                setLoading(false); // hide loading once loaded
                            }}
                        >
                            {Array.from(new Array(numPages), (_, index) => (
                                <div
                                    key={`page_wrapper_${index + 1}`}
                                    className="my-3 bg-white rounded-sm shadow-md overflow-hidden border border-gray-200"
                                >
                                    <Page
                                        pageNumber={index + 1}
                                        width={width * 0.95}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </div>
                            ))}
                        </Document>
                    </div>
                ) : (
                    <p className="text-center mt-6 text-muted-foreground">
                        No file specified.
                    </p>
                )}
            </main>
        </div>
    );
}
