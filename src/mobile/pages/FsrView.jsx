import React from 'react';
import { useParams } from 'react-router-dom';
import TopNameBar from '@/components/mobile/TopNameBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, X, FileImage } from 'lucide-react';

const mockFsrData = {
    'FSR-1178': {
        id: 'FSR-1178',
        date: 'Aug 05, 2025',
        service: 'Optical Alignment Check',
        details: 'Performed optical alignment and calibration. Replaced worn-out components.',
        attachments: [
            { name: 'Before.jpg', url: '/assets/FSR-14809.jpeg' },
            { name: 'After.jpg', url: '/assets/FSR-14809.jpeg' }
        ]
    },
    'FSR-1012': {
        id: 'FSR-1012',
        date: 'Feb 10, 2025',
        service: 'Lamp Replacement',
        details: 'Replaced lamp and verified output stability.',
        attachments: [
            { name: 'Lamp.jpg', url: '/assets/FSR-14809.jpeg' }
        ]
    }
};

// Local InfoRow to match JobInfo visual style
const InfoRow = ({ label, value }) => (
    <div className="flex items-start space-x-4 py-3.5">
        <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-base font-medium">{value}</p>
        </div>
    </div>
);

export default function FsrView() {
    const { fsrId } = useParams();
    const fsr = mockFsrData[fsrId] || null;
    // Zoom overlay state (parity with FsrSubmitForm)
    const [zoomedImage, setZoomedImage] = React.useState(null); // { url, name }
    const zoomRef = React.useRef(null);
    const [scale, setScale] = React.useState(1);
    const [translate, setTranslate] = React.useState({ x: 0, y: 0 });
    const [touches, setTouches] = React.useState([]);

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            setTouches([distance]);
        } else if (e.touches.length === 1) {
            setTouches([
                { x: e.touches[0].pageX - translate.x, y: e.touches[0].pageY - translate.y },
            ]);
        }
    };
    const handleTouchMove = (e) => {
        if (e.touches.length === 2 && touches.length === 1) {
            const newDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            const scaleChange = newDistance / touches[0];
            setScale(Math.min(Math.max(1, scaleChange), 4));
        } else if (e.touches.length === 1 && touches.length === 1 && scale > 1) {
            const newX = e.touches[0].pageX - touches[0].x;
            const newY = e.touches[0].pageY - touches[0].y;
            setTranslate({ x: newX, y: newY });
        }
    };
    const handleTouchEnd = () => {
        if (scale <= 1.05) {
            setScale(1);
            setTranslate({ x: 0, y: 0 });
        }
        setTouches([]);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Sticky header to match JobInfo */}
            <TopNameBar
                title="Service Report"
            />

            {/* Scrolling content area to match JobInfo */}
            <main className="flex-1 overflow-auto bg-muted p-4 pb-32">
                {/* FSR Details */}
                <Card className="rounded-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">FSR Details</CardTitle>
                            {fsr && (
                                <Badge variant="secondary" className="capitalize">
                                    {fsr.id}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="divide-y pt-0">
                        {fsr ? (
                            <>
                                <InfoRow label="FSR ID" value={fsr.id} />
                                <InfoRow label="Date" value={fsr.date} />
                                <InfoRow label="Service" value={fsr.service} />
                                <InfoRow label="Details" value={fsr.details} />
                            </>
                        ) : (
                            <div className="py-4 text-muted-foreground">FSR not found.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Attachments (Images) */}
                <Card className="rounded-sm overflow-hidden mt-4">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Attachments</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {fsr?.attachments?.length ? (
                            <ul className="divide-y rounded-sm border bg-white">
                                {fsr.attachments.map((img, idx) => (
                                    <li key={idx} className="flex items-center justify-between p-3">
                                        <button
                                            type="button"
                                            className="flex items-center gap-3 text-left flex-1 min-w-0"
                                            onClick={() => setZoomedImage(img)}
                                        >
                                            <FileImage className="w-5 h-5 text-gray-500" />
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900 truncate">{img.name}</div>
                                                <div className="text-xs text-gray-500">Tap to view</div>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-center py-6">No attachments.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Zoom Overlay */}
                {zoomedImage && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center touch-none">
                        <button
                            onClick={() => setZoomedImage(null)}
                            className="z-1 absolute top-5 right-5 bg-white/15 hover:bg-white/25 text-white p-3 rounded-full backdrop-blur-sm transition"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <img
                            ref={zoomRef}
                            src={zoomedImage.url}
                            alt={zoomedImage.name || 'attachment'}
                            className="max-w-[95%] max-h-[95%] rounded-lg shadow-lg transition-transform duration-200 ease-out"
                            style={{ transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)` }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
