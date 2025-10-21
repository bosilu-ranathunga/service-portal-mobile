import React, { useState, useRef } from "react";
import { ArrowRight, ArrowLeft, Camera, X, Trash2, Loader2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import TopNameBar from "@/components/mobile/TopNameBar";
import { useToast } from "@/components/ui/Toast";

export default function FsrSubmitForm() {
    const [step, setStep] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedEngineers, setSelectedEngineers] = useState([]);
    const [fsrNumber, setFsrNumber] = useState("");
    const [remarks, setRemarks] = useState("");
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    // Validation flags (shown only after user tries to proceed)
    const [jobError, setJobError] = useState(false);
    const [engineerError, setEngineerError] = useState(false);
    const [fsrError, setFsrError] = useState(false);

    const { addToast, ToastContainer } = useToast();

    // Light haptic feedback for supported devices
    const vibrate = (pattern = 10) => {
        try {
            if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        } catch (_) { /* no-op */ }
    };

    const [zoomedImage, setZoomedImage] = useState(null);
    const zoomRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [touches, setTouches] = useState([]);

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

    const jobs = [
        { id: "J001", name: "Metro Hospital - UV Calibration" },
        { id: "J002", name: "BioLab Pvt Ltd - Centrifuge Repair" },
        { id: "J003", name: "GreenMed Clinic - pH Meter Service" },
    ];


    const engineers = [
        { id: "E001", name: "Eranda Nimal" },
        { id: "E002", name: "Kasun Perera" },
        { id: "E003", name: "Sithum Jayasena" },
    ];

    const getJobName = (id) => jobs.find(j => j.id === id)?.name || "-";
    const getEngineerNames = (ids) => ids.map(id => engineers.find(e => e.id === id)?.name || id);

    const handleEngineerChange = (id) => {
        if (selectedEngineers.includes(id)) {
            setSelectedEngineers(selectedEngineers.filter((e) => e !== id));
            vibrate(8);
        } else {
            setSelectedEngineers([...selectedEngineers, id]);
            vibrate(8);
        }
    };

    const acceptImageFiles = (files) => {
        const imgs = Array.from(files).filter(f => f.type?.startsWith("image/"));
        if (imgs.length !== files.length) {
            addToast("Some non-image files were skipped.", "info");
        }
        setImages(prev => [...prev, ...imgs]);
    };

    const handleImageUpload = (event) => {
        if (event.target.files) acceptImageFiles(event.target.files);
        vibrate(12);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files) acceptImageFiles(e.dataTransfer.files);
    };

    const preventDefault = (e) => e.preventDefault();

    const handleSubmit = async () => {
        // Validate again on submit; show inline error, don't advance
        if (!selectedJob) { setJobError(true); setStep(1); vibrate(12); return; }
        if (selectedEngineers.length === 0) { setEngineerError(true); setStep(2); vibrate(12); return; }
        if (!fsrNumber.trim()) { setFsrError(true); setStep(4); vibrate(12); return; }

        setIsSubmitting(true);
        try {
            const payload = {
                jobId: selectedJob,
                engineers: selectedEngineers,
                fsrNumber: fsrNumber.trim(),
                remarks: remarks.trim(),
                images, // files, to be handled by API layer if needed
                statusChoice,
                quotationRequired,
            };
            // TODO: replace with API call. For now, simulate latency.
            await new Promise(res => setTimeout(res, 800));

            addToast("FSR submitted successfully.", "success");
            vibrate([15, 40, 15]);
            // Reset form after successful submit
            setStep(1);
            setSelectedJob(null);
            setSelectedEngineers([]);
            setFsrNumber("");
            setRemarks("");
            setImages([]);
            setStatusChoice("inspection");
            setQuotationRequired(false);
            setJobError(false);
            setEngineerError(false);
            setFsrError(false);
        } catch (err) {
            addToast("Failed to submit FSR. Please try again.", "error");
            vibrate([60]);
            // console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = ["Job", "Engineers", "Images", "Details"];

    // Details inputs
    const [statusChoice, setStatusChoice] = useState("inspection"); // inspection | partial | full
    const [quotationRequired, setQuotationRequired] = useState(false);
    const remarksRef = useRef(null);
    const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
        const el = e.target;
        // Auto-resize textarea height
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopNameBar title="Submit FSR" />

            {/* Step Indicator */}
            <div className="flex justify-between items-center px-4 py-3 bg-white shadow-sm sticky top-16 z-40">
                {steps.map((s, i) => (
                    <div key={i} className="flex-1 text-center">
                        <div
                            className={`w-8 h-8 mx-auto rounded-full text-white flex items-center justify-center mb-1 ${step === i + 1
                                ? "bg-blue-600 font-semibold"
                                : "bg-gray-300 font-normal"
                                }`}
                        >
                            {i + 1}
                        </div>
                        <div
                            className={`text-xs font-medium ${step === i + 1 ? "text-blue-600" : "text-gray-400"
                                }`}
                        >
                            {s}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
                {/* STEP 1 - Select Job */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="mb-2 mt-3">
                            <h2 className="text-xl font-semibold text-gray-800">Select Job</h2>
                            <p className="text-gray-500 text-sm mb-3">
                                Choose one job related to this Field Service Report.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {jobs.map((job) => {
                                const active = selectedJob === job.id;
                                return (
                                    <button
                                        key={job.id}
                                        type="button"
                                        onClick={() => { setSelectedJob(job.id); vibrate(10); }}
                                        className={`w-full text-left p-4 rounded-md border transition shadow-sm hover:bg-gray-50 ${active ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">{job.name}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {jobError && !selectedJob && (
                            <p className="text-xs text-red-600 ">Select a job to continue.</p>
                        )}
                    </div>
                )}

                {/* STEP 2 - Select Engineers */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="mb-2 mt-3">
                            <h2 className="text-xl font-semibold text-gray-800">Assign Engineers</h2>
                            <p className="text-gray-500 text-sm mb-3">
                                Pick one or more engineers responsible for this job.
                            </p>
                        </div>

                        <div className="space-y-2">
                            {engineers.map((eng) => (
                                <label
                                    key={eng.id}
                                    className="flex items-center justify-between border p-3 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            className="rounded-xl h-5 w-5 border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                            checked={selectedEngineers.includes(eng.id)}
                                            onCheckedChange={() => handleEngineerChange(eng.id)}
                                            id={`eng-${eng.id}`}
                                        />
                                        <span className="font-medium">{eng.name}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {engineerError && selectedEngineers.length === 0 && (
                            <p className="text-xs text-red-600">Select at least one engineer to continue.</p>
                        )}
                    </div>
                )}

                {/* STEP 3 - Upload Images */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="mb-2 mt-3">
                            <h2 className="text-xl font-semibold text-gray-800">Attach Images</h2>
                            <p className="text-gray-500 text-sm mb-3">Upload from camera or gallery.</p>
                        </div>
                        <div
                            onDragOver={preventDefault}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-gray-300 rounded-md p-5 bg-white text-center hover:border-blue-400 transition"
                        >
                            <div className="flex flex-col items-center gap-2 text-gray-600">
                                <Camera className="w-6 h-6" />
                                <p className="text-sm">Drag and drop images here, or click to browse</p>
                            </div>
                            <div className="mt-3 flex items-center justify-center">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        {images.length > 0 && (
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{images.length} image{images.length > 1 ? "s" : ""} selected</span>
                                <button
                                    type="button"
                                    className="text-red-600 hover:underline"
                                    onClick={() => { setImages([]); vibrate(10); }}
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Image Documents List */}
                        {images.length > 0 && (
                            <ul className="mt-1 divide-y rounded-md border bg-white">
                                {images.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between p-3">
                                        <button
                                            type="button"
                                            className="flex items-center gap-3 text-left flex-1 min-w-0"
                                            onClick={() => setZoomedImage({ url: URL.createObjectURL(file), index })}
                                        >
                                            <FileImage className="w-5 h-5 text-gray-500" />
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900 truncate">
                                                    {file.name || `Image ${index + 1}`}
                                                </div>
                                                <div className="text-xs text-gray-500">{((file.size || 0) / 1024).toFixed(1)} KB</div>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImages(prev => prev.filter((_, i) => i !== index));
                                                vibrate(10);
                                            }}
                                            className="ml-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition"
                                            aria-label="Remove image"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {zoomedImage && (
                            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center touch-none">
                                <button
                                    onClick={() => setZoomedImage(null)}
                                    className="z-1 absolute top-5 right-5 bg-white/15 hover:bg-white/25 text-white p-3 rounded-full backdrop-blur-sm transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <img
                                    ref={zoomRef}
                                    src={zoomedImage.url}
                                    alt="zoomed"
                                    className="max-w-[95%] max-h-[95%] rounded-lg shadow-lg transition-transform duration-200 ease-out"
                                    style={{
                                        transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
                                    }}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 4 - Details & Summary */}
                {step === 4 && (
                    <div className="space-y-5">
                        <div className="mb-1 mt-3">
                            <h2 className="text-xl font-semibold text-gray-800">Details</h2>
                            <p className="text-gray-500 text-sm mb-3">Review the information and provide final details.</p>
                        </div>
                        {/* Details Form */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="fsrNumber">FSR Number <span className="text-red-500">*</span></Label>
                                <Input
                                    id="fsrNumber"
                                    type="number"
                                    value={fsrNumber}
                                    onChange={(e) => setFsrNumber(e.target.value)}
                                    placeholder="Enter FSR number"
                                />
                                {fsrError && !fsrNumber.trim() && (
                                    <p className="text-xs text-red-600">FSR number is required.</p>
                                )}
                            </div>
                            {/* What are you guys doing? */}
                            <div className="space-y-2">
                                <Label className="text-gray-700">What are you guys doing?</Label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 border rounded-md bg-white hover:bg-gray-50 transition cursor-pointer">
                                        <RadioGroup value={statusChoice} onValueChange={(v) => { setStatusChoice(v); vibrate(8); }}>
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem id="status-inspection" value="inspection" />
                                                <span>Inspection</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <RadioGroupItem id="status-partial" value="partial" />
                                                <span>Part of the job completed</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <RadioGroupItem id="status-full" value="full" />
                                                <span>Full job completed</span>
                                            </div>
                                        </RadioGroup>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="remarks">Remarks</Label>
                                <Textarea
                                    id="remarks"
                                    value={remarks}
                                    onChange={handleRemarksChange}
                                    placeholder="Add notes or details (optional)"
                                    ref={remarksRef}
                                    className="h-60 resize-none"
                                />
                            </div>
                        </div>

                        {/* Summary at the end */}
                        <div className="space-y-3 text-sm mb-8 text-gray-700 border rounded-md p-4 bg-white">
                            <div className="font-semibold text-gray-900">Summary</div>
                            <div className="flex items-start justify-between gap-3">
                                <span className="text-gray-500">Job</span>
                                <span className="font-medium text-right">{getJobName(selectedJob)}</span>
                            </div>
                            <div className="flex items-start justify-between gap-3">
                                <span className="text-gray-500">Engineers</span>
                                <span className="font-medium text-right">{getEngineerNames(selectedEngineers).join(", ") || "-"}</span>
                            </div>
                            <div className="flex items-start justify-between gap-3">
                                <span className="text-gray-500">Images</span>
                                <span className="font-medium text-right">{images.length}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* FOOTER BUTTONS */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 grid grid-cols-2 gap-3 shadow-md pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {/* Back */}
                {step > 1 && (
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-md flex items-center justify-center"
                        onClick={() => setStep((s) => Math.max(1, s - 1))}
                        disabled={isSubmitting}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </Button>
                )}

                {/* Next */}
                {step < 4 && (
                    <Button
                        size="lg"
                        className={`${step === 1 ? "col-span-2" : "col-span-1"} bg-blue-500 rounded-md flex items-center justify-center`}
                        onClick={() => {
                            // Validate current step; show inline error, don't advance when invalid
                            if (step === 1) {
                                if (!selectedJob) { setJobError(true); vibrate(12); return; }
                                setJobError(false);
                            }
                            if (step === 2) {
                                if (selectedEngineers.length === 0) { setEngineerError(true); vibrate(12); return; }
                                setEngineerError(false);
                            }
                            setStep(step + 1);
                        }}
                    >
                        <span>Next</span>
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                )}

                {/* Submit */}
                {step === 4 && (
                    <Button
                        size="lg"
                        className="bg-blue-500 col-span-2 rounded-md flex items-center justify-center space-x-2"
                        onClick={() => {
                            // Validate FSR number before opening confirmation
                            if (!fsrNumber.trim()) { setFsrError(true); vibrate(12); return; }
                            setFsrError(false);
                            setConfirmOpen(true);
                            vibrate(12);
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Submitting…</span>
                            </>
                        ) : (
                            <span>Submit FSR</span>
                        )}
                    </Button>
                )}
            </footer>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleSubmit}
                type="info"
                title="Submit Field Service Report"
                message="Are you sure you want to submit this FSR? You can’t edit it after submission."
                confirmText="Submit"
            />

            {/* Toasts */}
            <ToastContainer />
        </div >
    );
}
