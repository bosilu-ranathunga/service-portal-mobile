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
        className="flex items-center w-full py-4 hover:bg-gray-100 active:bg-gray-200 transition-colors"
    >
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
            name: 'University of Rajarata',
            department: 'Department of Agriculture',
            address: 'University Park, Mihintale, Anuradhapura, Sri Lanka',
            contacts: [
                { name: 'Dr. Nimal Perera', phone: '+94 71 234 5678' },
                { name: 'Ms. Sanduni Weerasinghe, Lab Coordinator', phone: '+94 76 543 2109' },
            ],
        },
        job: {
            type: 'Repair',
            datePeriod: 'Oct 20, 2025 - Oct 22, 2025',
            description:
                'Spectrophotometer showing unstable readings and power fluctuation during calibration. Possible issue with the light source or internal power regulator. Detailed inspection and component replacement required.',
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
                    {/* Professional, mobile-friendly tab navigation */}
                    {/* Tab Bar Navigation */}
                    <div className="mb-4">
                        <TabsList className="flex w-full h-16 justify-around bg-background border-b border-border">
                            {[
                                { value: "overview", label: "Overview" },
                                { value: "instrument", label: "Instrument" },
                                { value: "documents", label: "Documents" },
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    aria-label={tab.label}
                                    className={`
          relative flex-1 text-center py-4 text-[14px] font-semibold tracking-wide uppercase
          text-muted-foreground transition-colors duration-200
          hover:text-foreground focus:text-foreground
          data-[state=active]:text-primary
          after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px]
          after:bg-transparent data-[state=active]:after:bg-blue-500
          transform-none active:scale-100 focus:scale-100
          data-[state=active]:scale-100 shadow-none data-[state=active]:shadow-none
        `}
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>




                    {/*
                     * ===================
                     * OVERVIEW TAB
                     * ===================
                     * Contains the most critical "at-a-glance" info.
                    */}
                    <TabsContent value="overview" className="space-y-4">

                        {/* Job Details Card */}
                        <Card className="rounded-md">
                            <CardHeader className="pb-0">
                                <CardTitle className="pt-2 text-xl">
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
                        <Card className="rounded-md">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-xl">Customer & Location</CardTitle>
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

                        {/* Instrument Details Card */}
                        <Card className="rounded-md">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-xl">Instrument Details</CardTitle>
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

                        {/* Contacts Card */}
                        <Card className="rounded-md">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-xl">Key Contacts</CardTitle>
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
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Team Card */}
                        <Card className="rounded-md">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-xl">Assigned Team</CardTitle>
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


                        <Card className="rounded-md">
                            <CardHeader>
                                <CardTitle className="text-xl">Service History</CardTitle>
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
                        <Card className="rounded-md">
                            <CardHeader>
                                <CardTitle className="text-xl">Attached Documents</CardTitle>
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
        </div>
    )
}