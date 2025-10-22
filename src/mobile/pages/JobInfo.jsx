import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin, ChevronRight, History, Paperclip, ArrowRight, Clock, Headset, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import TopNameBar from '@/components/mobile/TopNameBar'
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'

/**
 * A helper component to display information with an optional icon.
 * This ensures consistency and readability, similar to a native list item.
 */
const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start space-x-4 py-3.5">
        {Icon && (
            <Icon
                className="w-5 h-5 flex-shrink-0 text-muted-foreground mt-0.5"
                aria-hidden="true"
            />
        )}
        <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-base font-medium">{value}</p>
        </div>
    </div>
)




/**
 * A helper component for clickable list items, like contacts or documents.
 * The icon and chevron provide clear native-like affordances.
 */
const ClickableRow = ({ label, description, href, icon: Icon, target }) => (
    <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className="flex items-center w-full py-4 space-x-4 group"
        onClick={() => {
            try {
                if (navigator?.vibrate) navigator.vibrate(50);
            } catch (_) { }
        }}
    >
        {Icon && (
            <Icon
                className="w-5 h-5 flex-shrink-0 text-muted-foreground"
                aria-hidden="true"
            />
        )}
        <div className="flex-1">
            <p className="text-base font-medium group-hover:text-primary transition-colors">
                {label}
            </p>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </a>
)

export default function JobInfo() {

    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isHolding, setIsHolding] = useState(false);



    const handleHoldStart = (e, action, inputType) => {
        e.preventDefault();
        const holdDuration = 1500;
        let vibrationInterval;

        setIsHolding(true);

        // Start continuous vibration
        vibrationInterval = setInterval(() => {
            if (navigator.vibrate) navigator.vibrate(50);
        }, 120);

        const holdTimeout = setTimeout(() => {
            setIsHolding(false);
            clearInterval(vibrationInterval);

            if (action === "start") {
                setStartTs(Date.now());
                setPhase("running");
                addToast("Job timer started", "success");
            } else if (action === "stop") {
                setElapsedMs(Date.now() - startTs);
                setPhase("stopped");
                addToast("Job timer stopped", "info");
            }
        }, holdDuration);

        const clearHold = () => {
            clearTimeout(holdTimeout);
            clearInterval(vibrationInterval);
            setIsHolding(false);
        };

        const endEvent =
            inputType === "touch"
                ? ["touchend", "touchcancel"]
                : ["mouseup", "mouseleave"];

        endEvent.forEach((ev) => {
            document.addEventListener(
                ev,
                () => {
                    clearHold();
                },
                { once: true }
            );
        });
    };


    const jobData = {
        customer: {
            name: 'University of Rajarata',
            department: 'Department of Agriculture',
            address: 'University Park, Mihintale, Anuradhapura, Sri Lanka',
            contacts: [
                { name: 'Dr. Nimal Perera', phone: '+94 71 234 5678' },
                {
                    name: 'Ms. Sanduni Weerasinghe, Lab Coordinator',
                    phone: '+94 76 543 2109',
                },
            ],
        },
        job: {
            type: 'Repair',
            datePeriod: 'Oct 20, 2025 - Oct 22, 2025',
            description:
                'Spectrophotometer showing unstable readings and power fluctuation...',
            otherEngineers: [
                { name: 'Kasun Silva', phone: '+94 71 234 5678' },
                { name: 'Tharindu Jayasuriya', phone: '+94 77 345 6789' }
            ]
        },
        instrument: {
            name: 'UV-Vis Spectrophotometer',
            model: 'Shimadzu UV-1900',
            serial: 'SN-UV1900-45231',
            type: 'Analytical Instrument',
            warrantyStatus: 'Expired',
        },
        history: [
            {
                id: 'FSR-1178',
                date: 'Aug 05, 2025',
                service: 'Optical Alignment Check',
            },
            {
                id: 'FSR-1012',
                date: 'Feb 10, 2025',
                service: 'Lamp Replacement',
            },
        ],
        attachments: [
            { name: 'Spectrophotometer-Manual.pdf', type: 'PDF' },
            { name: 'Previous-Service-Report.jpg', type: 'Image' },
        ],
    }

    const TABS = [
        { value: 'overview', label: 'Overview' },
        { value: 'instrument', label: 'Instrument' },
        { value: 'documents', label: 'Documents' },
    ]

    // Job timer state
    const [phase, setPhase] = useState('idle'); // idle | running | stopped
    const [startTs, setStartTs] = useState(null); // number | null
    const [elapsedMs, setElapsedMs] = useState(0);

    // Haptic helper
    const vibrate = (pattern = 10) => {
        try { if (navigator?.vibrate) navigator.vibrate(pattern); } catch (_) { }
    };

    // Tick while running
    useEffect(() => {
        let id;
        if (phase === 'running' && startTs) {
            const tick = () => setElapsedMs(Date.now() - startTs);
            tick();
            id = setInterval(tick, 1000);
        }
        return () => { if (id) clearInterval(id); };
    }, [phase, startTs]);

    const formatDuration = (ms) => {
        const total = Math.max(0, Math.floor(ms / 1000));
        const h = String(Math.floor(total / 3600)).padStart(2, '0');
        const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
        const s = String(total % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };


    const onStart = () => {
        setStartTs(Date.now());
        setPhase('running');
        addToast('Job timer started', 'success');
        vibrate(12);
    };
    const onStop = () => {
        if (phase === 'running') setElapsedMs(Date.now() - startTs);
        setPhase('stopped');
        addToast('Job timer stopped', 'info');
        vibrate(12);
    };
    const onSubmitFsr = () => {
        vibrate(12);
        navigate('/fsr');
    };

    // Confirmation dialog state and handler routing
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        type: 'info',
        title: '',
        message: '',
        confirmText: ''
    });
    const confirmActionRef = useRef(() => { });

    const openConfirm = (config, action) => {
        confirmActionRef.current = action;
        setConfirmConfig(config);
        setConfirmOpen(true);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">

            {/* 1. STICKY HEADER */}
            <TopNameBar
                title="Job Information"
                rightIcon={<button
                    className="text-white"
                    onClick={() => {
                        const jobId = jobData.history[0]?.id || 'unknown';
                        const adminPhone = '+94762250479'; // Replace with actual admin phone number
                        const message = `Hello Admin,\n\nPlease be informed about the job with ID: ${jobId}.`;
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, '_blank');
                    }}
                >
                    <Headset />
                </button>}
            />

            <Tabs defaultValue="overview" className="w-full flex flex-col flex-1">
                {/* 2. STICKY TAB BAR */}
                {/* This sits below the header and stays fixed. */}
                <div className="bg-background border-b shadow-sm sticky top-16 z-40">
                    <TabsList className="grid w-full grid-cols-3 bg-white h-14 p-0 px-2">
                        {TABS.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`
                                    flex-1 text-center text-sm font-semibold text-muted-foreground
                                    data-[state=active]:text-primary
                                    relative h-full 
                                    data-[state=active]:after:absolute
                                    data-[state=active]:after:bottom-0
                                    data-[state=active]:after:left-0
                                    data-[state=active]:after:right-0
                                    data-[state=active]:after:h-0.5
                                    data-[state=active]:after:bg-primary
                                    rounded-none
                                    focus-visible:ring-inset
                                    `}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* 3. SCROLLING CONTENT AREA */}
                <main className="flex-1 overflow-auto bg-muted p-4 pb-32">
                    {/*OVERVIEW TAB*/}
                    <TabsContent value="overview" className="space-y-4 m-0">
                        {/* Running Timer Card */}
                        {(phase === 'running' || phase === 'stopped') && (
                            <Card className="rounded-sm overflow-hidden border-blue-100">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">
                                                {phase === 'running' ? 'Job in progress' : 'Job stopped'}
                                            </CardTitle>
                                        </div>
                                        <Badge variant="secondary" className={'px-3 py-1 ' + (phase === 'running' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white')}>
                                            {phase === 'running' ? 'In progress' : 'FSR Pending'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="text-3xl font-mono tracking-wide">
                                        {formatDuration(elapsedMs)}
                                    </div>
                                    {phase === 'stopped' && (
                                        <p className="text-sm text-muted-foreground mt-1">Final duration recorded.</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Job Details Card */}
                        <Card className="rounded-sm overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">Job Details</CardTitle>
                                    <Badge variant="secondary" className="capitalize">
                                        {jobData.job.type}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="divide-y pt-0">
                                <InfoRow
                                    label="Job Date"
                                    value={jobData.job.datePeriod}
                                />
                                <InfoRow
                                    label="Instrument Name"
                                    value={jobData.instrument.name}
                                />
                                <InfoRow
                                    label="Customer Name"
                                    value={jobData.customer.name}
                                />
                                <InfoRow
                                    label="Department"
                                    value={jobData.customer.department}
                                />
                                {/* Fixed Google Maps URL for proper native maps intent */}
                                <ClickableRow
                                    label="Address"
                                    description={jobData.customer.address}
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        jobData.customer.address
                                    )}`}
                                    target="_blank"
                                />
                                <InfoRow
                                    label="Job Description"
                                    value={jobData.job.description}
                                />
                            </CardContent>
                        </Card>

                        {/* Contacts Card */}
                        <Card className="rounded-sm overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">Key Contacts</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y pt-0">
                                {jobData.customer.contacts.map((contact) => (
                                    <ClickableRow
                                        key={contact.name}
                                        label={contact.name}
                                        description={contact.phone}
                                        href={`tel:${contact.phone}`}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Team Card */}
                        <Card className="rounded-sm overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">Assigned Team</CardTitle>
                            </CardHeader>

                            <CardContent className="divide-y pt-0">
                                {jobData.job.otherEngineers && jobData.job.otherEngineers.length > 0 ? (
                                    jobData.job.otherEngineers.map((engineer) => (
                                        <ClickableRow
                                            key={engineer.name}
                                            label={engineer.name}
                                            description={engineer.phone}
                                            href={`tel:${engineer.phone}`}
                                        />
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground py-2">No other engineers</div>
                                )}
                            </CardContent>
                        </Card>

                    </TabsContent>

                    {/* INSTRUMENT TAB */}
                    <TabsContent value="instrument" className="space-y-4 m-0">
                        {/* Instrument Details Card */}
                        <Card className="rounded-sm overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">Instrument Details</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y pt-0">
                                <InfoRow
                                    label="Instrument Name"
                                    value={jobData.instrument.name}
                                />
                                <InfoRow label="Model Number" value={jobData.instrument.model} />
                                <InfoRow
                                    label="Serial Number"
                                    value={jobData.instrument.serial}
                                />
                                <InfoRow
                                    label="Instrument Type"
                                    value={jobData.instrument.type}
                                />
                                <InfoRow
                                    label="Warranty Status"
                                    value={
                                        <Badge
                                            variant={
                                                jobData.instrument.warrantyStatus === 'Active'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={
                                                jobData.instrument.warrantyStatus === 'Active'
                                                    ? 'bg-green-600 text-white'
                                                    : 'border-destructive text-destructive'
                                            }
                                        >
                                            {jobData.instrument.warrantyStatus}
                                        </Badge>
                                    }
                                />
                            </CardContent>
                        </Card>

                        {/* Service History Card */}
                        <Card className="rounded-sm overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">Service History</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y pt-0">
                                {jobData.history.map((record) => (
                                    <ClickableRow
                                        key={record.id}
                                        label={record.service}
                                        description={`Date: ${record.date} | Report: ${record.id}`}
                                        href={`/fsr/${record.id}`} // Example link to the FSR
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* DOCUMENTS TAB*/}
                    <TabsContent value="documents" className="m-0">
                        <Card className="rounded-sm overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">Attached Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y pt-0">
                                {jobData.attachments.map((doc) => (
                                    <ClickableRow
                                        key={doc.name}
                                        icon={Paperclip}
                                        label={doc.name}
                                        href={`/docs/${doc.name}`} // Example link to view/download
                                        target="_blank"
                                    />
                                ))}
                                {jobData.attachments.length === 0 && (
                                    <p className="text-muted-foreground text-center py-6">
                                        No documents attached.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </main>

            </Tabs>

            {/* 4. STICKY FOOTER (Call to Action) */}
            <footer
                className="fixed bottom-0 left-0 right-0 bg-background border-t p-4
  grid grid-cols-2 gap-3
  pb-[calc(1rem+env(safe-area-inset-bottom))]"
            >
                {/* IDLE STATE */}
                {phase === "idle" && (
                    <Button
                        size="lg"
                        className="bg-blue-500 col-span-2 rounded-sm flex items-center justify-center space-x-2 relative select-none"
                        onMouseDown={(e) => handleHoldStart(e, "start", "mouse")}
                        onTouchStart={(e) => handleHoldStart(e, "start", "touch")}
                    >
                        <Play className="w-4 h-4" />
                        <span>Start Job</span>
                    </Button>
                )}

                {/* RUNNING STATE */}
                {phase === "running" && (
                    <Button
                        size="lg"
                        className="bg-red-600 col-span-2 rounded-sm flex items-center justify-center space-x-2 relative select-none"
                        onMouseDown={(e) => handleHoldStart(e, "stop", "mouse")}
                        onTouchStart={(e) => handleHoldStart(e, "stop", "touch")}
                    >
                        <Square className="w-4 h-4" />
                        <span>Stop Job</span>
                    </Button>
                )}

                {/* STOPPED STATE */}
                {phase === "stopped" && (
                    <Button
                        size="lg"
                        className="bg-green-600 col-span-2 rounded-sm flex items-center justify-center space-x-2"
                        onClick={() => onSubmitFsr()}
                    >
                        <ArrowRight className="w-4 h-4" />
                        <span>Submit FSR</span>
                    </Button>
                )}
            </footer>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => confirmActionRef.current?.()}
                type={confirmConfig.type}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
            />

        </div>
    )
}