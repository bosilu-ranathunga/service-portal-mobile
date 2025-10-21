import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TopNameBar from "@/components/mobile/TopNameBar";

export default function FsrSubmitForm() {
    const [step, setStep] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedEngineers, setSelectedEngineers] = useState([]);
    const [fsrNumber, setFsrNumber] = useState("");
    const [remarks, setRemarks] = useState("");
    const [images, setImages] = useState([]);

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

    const handleEngineerChange = (id) => {
        if (selectedEngineers.includes(id)) {
            setSelectedEngineers(selectedEngineers.filter((e) => e !== id));
        } else {
            setSelectedEngineers([...selectedEngineers, id]);
        }
    };

    const handleImageUpload = (event) => {
        if (event.target.files) {
            setImages([...images, ...Array.from(event.target.files)]);
        }
    };

    const handleSubmit = () => {
        const formData = {
            selectedJob,
            selectedEngineers,
            fsrNumber,
            remarks,
            images,
        };
        console.log("FSR Submitted:", formData);
        alert("FSR submitted successfully!");
    };

    const steps = ["Job", "Engineers", "Docs", "Images"];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TopNameBar title="Submit FSR" />

            {/* Step Indicator */}
            <div className="flex justify-between items-center px-4 py-3 bg-white shadow-sm sticky top-12 z-10">
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
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Job Information</h2>
                            <p className="text-gray-500 text-sm mb-4">
                                Please select the job related to this FSR submission.
                            </p>
                        </div>
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className={`p-4 border rounded-md cursor-pointer flex items-center justify-between transition-all duration-200 ${selectedJob === job.id
                                    ? "border-blue-600 bg-blue-50 shadow-sm"
                                    : "border-gray-300 bg-white hover:bg-gray-50"
                                    }`}
                                onClick={() => setSelectedJob(job.id)}
                            >
                                <span className="font-medium">{job.name}</span>
                                {selectedJob === job.id && (
                                    <ArrowRight className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* STEP 2 - Select Engineers */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Job Information</h2>
                            <p className="text-gray-500 text-sm mb-4">
                                Please select the job related to this FSR submission.
                            </p>
                        </div>
                        {engineers.map((eng) => (
                            <label
                                key={eng.id}
                                className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer bg-white hover:bg-white transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedEngineers.includes(eng.id)}
                                    onChange={() => handleEngineerChange(eng.id)}
                                    className="w-5 h-5 accent-blue-600"
                                />
                                <span className="font-medium">{eng.name}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* STEP 3 - Documentation */}
                {step === 3 && (
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Documentation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="fsrNumber">FSR Number</Label>
                                <Input
                                    id="fsrNumber"
                                    value={fsrNumber}
                                    onChange={(e) => setFsrNumber(e.target.value)}
                                    placeholder="Enter FSR number"
                                />
                            </div>
                            <div>
                                <Label htmlFor="remarks">Remarks</Label>
                                <textarea
                                    id="remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add notes or details..."
                                    className="w-full border rounded-md p-2 h-24 resize-none focus:outline-blue-500"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* STEP 4 - Upload Images */}
                {step === 4 && (
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Attach Images</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Camera className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-600 text-sm">Upload from Camera or Gallery</span>
                            </div>
                            <Input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                multiple
                                onChange={handleImageUpload}
                            />
                            <div className="flex flex-wrap gap-3 mt-2">
                                {images.map((file, index) => (
                                    <div
                                        key={index}
                                        className="w-20 h-20 border rounded-xl overflow-hidden shadow-sm"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* FOOTER BUTTONS */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 grid grid-cols-2 gap-3 shadow-md pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {step > 1 && (
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setStep(step - 1)}
                        className="flex items-center justify-center space-x-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </Button>
                )}

                {step < 4 && (
                    <Button
                        size="lg"
                        className="col-span-1 flex items-center justify-center space-x-2"
                        onClick={() => setStep(step + 1)}
                        disabled={
                            (step === 1 && !selectedJob) ||
                            (step === 2 && selectedEngineers.length === 0)
                        }
                    >
                        <span>Next</span>
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                )}

                {step === 4 && (
                    <Button
                        size="lg"
                        className="col-span-2 flex items-center justify-center space-x-2"
                        onClick={handleSubmit}
                    >
                        <span>Submit FSR</span>
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                )}
            </footer>
        </div>
    );
}
