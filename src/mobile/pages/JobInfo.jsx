import React from 'react'
import TopNameBar from '@/components/mobile/TopNameBar'

// Import shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Import icons from lucide-react
import {
    Phone,
    MapPin,
    Users,
    Wrench,
    ShieldCheck,
    CalendarDays,
    FileText,
    ListTodo,
    ChevronRight,
    History,
    Paperclip,
    User,
    Building,
} from 'lucide-react'

/*
 * A helper component to display information clearly.
 * This ensures consistency and readability, which is important for
 * an older audience.
 *
 * label: The title (e.g., "Model Number")
 * value: The data (e.g., "SPEC-3000")
 * icon:  An optional icon to add clarity
 */
const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start py-3">
        {Icon && <Icon className="w-5 h-5 mr-3 mt-1 text-muted-foreground" />}
        <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-base font-medium">{value}</p>
        </div>
    </div>
)

/*
 * A helper component for clickable list items, like contacts or documents.
 * The visible chevron (>) clearly indicates it's interactive.
 */
const ClickableRow = ({ label, description, href, icon: Icon }) => (
    <a
        href={href}
        className="flex items-center w-full p-4 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
    >
        <Icon className="w-6 h-6 mr-4 text-primary" />
        <div className="flex-1">
            <p className="text-base font-medium">{label}</p>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </a>
)

export default function JobInfo() {
    // Placeholder data based on your screenshot and request
    const jobData = {
        customer: {
            name: 'Metro Hospital',
            department: 'Facilities Management',
            address: '789 Healthcare Blvd, Medical District, TC 12347',
            contacts: [
                { name: 'Dr. Alen Smith', phone: '123-456-7890' },
                { name: 'Sarah Jen, Dept. Head', phone: '098-765-4321' },
            ],
        },
        job: {
            type: 'Emergency Repair',
            datePeriod: 'Oct 20, 2025 - Oct 21, 2025',
            description:
                'Critical cooling system failure in the main server room. The primary compressor unit appears to be offline. Urgent attention is required.',
            otherEngineers: ['Markus Lee', 'Jane Doe'],
        },
        instrument: {
            name: 'Chiller Unit',
            model: 'CoolMax-Pro 5000',
            serial: 'SN-CM5000-98765',
            type: 'HVAC',
            warrantyStatus: 'Active', // 'Expired'
        },
        history: [
            {
                id: 'FSR-1023',
                date: 'Jul 15, 2025',
                service: 'Preventive Maintenance',
            },
            {
                id: 'FSR-0988',
                date: 'Jan 10, 2025',
                service: 'Calibration Check',
            },
        ],
        attachments: [
            { name: 'Site-Access-Permit.pdf', type: 'PDF' },
            { name: 'Original-Install-Diagram.png', type: 'Image' },
        ],
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Mobile Header */}
            <TopNameBar title="Job Information" />

            {/* Main Content */}
            {/* We use a neutral background color for the main area */}
            {/* pb-28 gives space so content doesn't hide under the sticky footer */}
            <main className="flex-1 overflow-auto bg-[#f3f4f6] p-4 pb-28">
                {/* Using tabs is an excellent way to organize a lot of information
                    without overwhelming the user.
                */}
                <Tabs defaultValue="overview" className="w-full">
                    {/* Tab Navigation: Simple and clear text labels */}
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="instrument">Instrument</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    {/*
                     * ===================
                     * OVERVIEW TAB
                     * ===================
                     * Contains the most critical "at-a-glance" info.
                    */}
                    <TabsContent value="overview" className="space-y-4">
                        {/* Job Details Card */}
                        <Card>
                            <CardHeader>
                                {/* We use a Badge for Job Type, as seen in your screenshot */}
                                <Badge
                                    className="w-fit"
                                    variant={
                                        jobData.job.type === 'Emergency Repair'
                                            ? 'destructive'
                                            : 'default'
                                    }
                                >
                                    {jobData.job.type}
                                </Badge>
                                <CardTitle className="pt-2">
                                    Job Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <InfoRow
                                    icon={CalendarDays}
                                    label="Job Date"
                                    value={jobData.job.datePeriod}
                                />
                                <Separator />
                                <InfoRow
                                    icon={ListTodo}
                                    label="Job Description"
                                    value={jobData.job.description}
                                />
                            </CardContent>
                        </Card>

                        {/* Customer & Location Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer & Location</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <InfoRow
                                    icon={Building}
                                    label="Customer Name"
                                    value={jobData.customer.name}
                                />
                                <Separator />
                                <InfoRow
                                    icon={User}
                                    label="Department"
                                    value={jobData.customer.department}
                                />
                                <Separator />
                                {/* Address is a clickable link to open maps.
                                    This is a key affordance for a PWA.
                                */}
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        jobData.customer.address
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start py-3 rounded-md -mx-2 px-2 hover:bg-gray-100 active:bg-gray-200"
                                >
                                    <MapPin className="w-5 h-5 mr-3 mt-1 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            Address
                                        </p>
                                        <p className="text-base font-medium text-blue-600 underline">
                                            {jobData.customer.address}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 self-center text-muted-foreground" />
                                </a>
                            </CardContent>
                        </Card>

                        {/* Contacts Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Contacts</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                {/* Contact list is clearly clickable, linking to the dial pad.
                                    This is a critical, time-saving feature for engineers.
                                */}
                                {jobData.customer.contacts.map((contact) => (
                                    <ClickableRow
                                        key={contact.name}
                                        label={contact.name}
                                        description={contact.phone}
                                        href={`tel:${contact.phone}`}
                                        icon={Phone}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Team Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Assigned Team</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <InfoRow
                                    icon={Users}
                                    label="Other Engineers"
                                    value={
                                        jobData.job.otherEngineers.join(', ') ||
                                        'None'
                                    }
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/*
                     * ===================
                     * INSTRUMENT TAB
                     * ===================
                     * All info related to the equipment being serviced.
                     * We've included service history here, as it's tied
                     * to the instrument.
                    */}
                    <TabsContent value="instrument" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Instrument Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <InfoRow
                                    icon={Wrench}
                                    label="Instrument Name"
                                    value={jobData.instrument.name}
                                />
                                <Separator />
                                <InfoRow
                                    label="Model Number"
                                    value={jobData.instrument.model}
                                />
                                <Separator />
                                <InfoRow
                                    label="Serial Number"
                                    value={jobData.instrument.serial}
                                />
                                <Separator />
                                <InfoRow
                                    label="Instrument Type"
                                    value={jobData.instrument.type}
                                />
                                <Separator />
                                <InfoRow
                                    icon={ShieldCheck}
                                    label="Warranty Status"
                                    value={
                                        <Badge
                                            variant={
                                                jobData.instrument
                                                    .warrantyStatus === 'Active'
                                                    ? 'secondary' // 'secondary' is often green in shadcn themes
                                                    : 'outline'
                                            }
                                        >
                                            {jobData.instrument.warrantyStatus}
                                        </Badge>
                                    }
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Service History</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                {jobData.history.map((record) => (
                                    <ClickableRow
                                        key={record.id}
                                        label={record.service}
                                        description={`Date: ${record.date} | Report: ${record.id}`}
                                        href={`/fsr/${record.id}`} // Example link to the FSR
                                        icon={History}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/*
                     * ===================
                     * DOCUMENTS TAB
                     * ===================
                     * A simple list of attached files.
                    */}
                    <TabsContent value="documents">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attached Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                {jobData.attachments.map((doc) => (
                                    <ClickableRow
                                        key={doc.name}
                                        label={doc.name}
                                        href={`/docs/${doc.name}`} // Example link to view/download
                                        icon={Paperclip}
                                    />
                                ))}
                                {jobData.attachments.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">
                                        No documents attached.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Sticky Action Bar
                This footer is fixed to the bottom, providing persistent,
                clear actions. Text labels are crucial for usability.
            */}
            <footer className="sticky bottom-0 left-0 right-0 z-10 bg-white border-t p-3 shadow-inner">
                <div className="flex items-center justify-between gap-3">
                    {/* Example actions. These can be changed based on job status */}
                    <Button variant="outline" className="flex-1">
                        Add Note
                    </Button>
                    <Button className="flex-1">Complete Job</Button>
                </div>
            </footer>
        </div>
    )
}