import React from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNameBar from '@/components/mobile/TopNameBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import manualPdf from '@/assets/83056-01-02manual.pdf';

export default function PdfView() {
    const [params] = useSearchParams();
    const raw = params.get('file');
    const isManual = !raw || /83056-01-02manual\.pdf$/i.test(raw || '');
    const file = isManual ? manualPdf : raw;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopNameBar title="PDF Viewer" />
            <main className="flex-1 overflow-auto bg-muted p-4 pb-32">
                <Card className="rounded-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{file ? decodeURIComponent(file.split('/').pop() || 'Document') : 'No file provided'}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {file ? (
                            <div className="w-full h-[75vh] bg-white border rounded-sm overflow-hidden">
                                <iframe
                                    src={file}
                                    title="PDF"
                                    className="w-full h-full"
                                />
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No file specified.</p>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
