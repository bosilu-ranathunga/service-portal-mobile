import React from 'react'
import { MapPin, ChevronRight, History, Paperclip, ArrowRight, } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import TopNameBar from '@/components/mobile/TopNameBar'
import { useNavigate } from 'react-router-dom';

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
            otherEngineers: ['Kasun Silva', 'Tharindu Jayasuriya'],
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

    return (
        <div className="min-h-screen bg-background flex flex-col">

            {/* 1. STICKY HEADER */}
            <TopNameBar title="Job Information" />

            <Tabs defaultValue="overview" className="w-full flex flex-col flex-1">
                {/* 2. STICKY TAB BAR */}
                {/* This sits below the header and stays fixed. */}
                <div className="bg-background border-b shadow-sm">
                    <TabsList className="grid w-full grid-cols-3 h-14 p-0 px-2">
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
                        {/* Job Details Card */}
                        <Card className="rounded-md overflow-hidden">
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
                        <Card className="rounded-md overflow-hidden">
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
                        <Card className="rounded-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">Assigned Team</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <InfoRow
                                    label="Other Engineers"
                                    value={jobData.job.otherEngineers.join(', ') || 'None'}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* INSTRUMENT TAB */}
                    <TabsContent value="instrument" className="space-y-4 m-0">
                        {/* Instrument Details Card */}
                        <Card className="rounded-md overflow-hidden">
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
                        <Card className="rounded-md overflow-hidden">
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
                        <Card className="rounded-md overflow-hidden">
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
                <Button variant="outline" size="lg">
                    <MapPin className="w-4 h-4 mr-2" />
                    Navigate
                </Button>
                <Button size="lg" onClick={() => { navigate('/fsr'); }}>
                    Start Job
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </footer>

        </div>
    )
}