import { useState } from "react";
import  Button from "../components/Reusable/CustomButton";
import  Input  from "../components/Reusable/CustomInput";
import  Label  from "../components/Reusable/label";
import { RadioGroup, RadioGroupItem } from "../components/Reusable/RadioGroup";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/Reusable/Select";
import { Upload, Youtube, Facebook, Twitter, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";

// File Upload Component
const FileUpload = ({ onFileChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer?.files;
        if (files) {
            setUploadedFiles(Array.from(files));
            onFileChange?.(files);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target?.files;
        if (files) {
            setUploadedFiles(Array.from(files));
            onFileChange?.(files);
        }
    };

    return (
        <div className="space-y-2">
            <Label>Files Upload</Label>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/30"
                }`}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-4 text-muted-foreground w-12 h-12" />
                    <p className="text-muted-foreground mb-2">
                        Drop your images here, or browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Jpeg, Jpg, png are allowed
                    </p>
                </label>
            </div>
            {uploadedFiles.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    {uploadedFiles.length} file(s) selected
                </div>
            )}
        </div>
    );
};

// Main Request Collection Page
const RequestCollection = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        senderId: "",
        collectionType: "",
        location: "",
        serviceType: "regular",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Handle form submission
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 bg-background py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Request to Collect Garbage
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Request service, track status, stay clean.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="senderId">
                                    Sender ID{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="senderId"
                                    placeholder="Please Enter Sensor ID"
                                    value={formData.senderId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            senderId: e.target?.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="collectionType">
                                    Collection Type{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.collectionType}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            collectionType: value,
                                        })
                                    }
                                    required
                                >
                                    <SelectTrigger id="collectionType">
                                        <SelectValue placeholder="Collection Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="organic">
                                            Organic Waste
                                        </SelectItem>
                                        <SelectItem value="recyclable">
                                            Recyclable Waste
                                        </SelectItem>
                                        <SelectItem value="hazardous">
                                            Hazardous Waste
                                        </SelectItem>
                                        <SelectItem value="general">
                                            General Waste
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                placeholder="Enter your location"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target?.value,
                                    })
                                }
                            />
                        </div>

                        <FileUpload />

                        <div className="space-y-4">
                            <RadioGroup
                                value={formData.serviceType}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        serviceType: value,
                                    })
                                }
                            >
                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem
                                        value="regular"
                                        id="regular"
                                        className="mt-1"
                                    />
                                    <div>
                                        <Label
                                            htmlFor="regular"
                                            className="font-semibold cursor-pointer"
                                        >
                                            Regular
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Regular Garbage Collecting
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem
                                        value="urgent"
                                        id="urgent"
                                        className="mt-1"
                                    />
                                    <div>
                                        <Label
                                            htmlFor="urgent"
                                            className="font-semibold cursor-pointer"
                                        >
                                            Urgent
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Urgent Garbage Collecting
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem
                                        value="scheduled"
                                        id="scheduled"
                                        className="mt-1"
                                    />
                                    <div>
                                        <Label
                                            htmlFor="scheduled"
                                            className="font-semibold cursor-pointer"
                                        >
                                            Scheduled
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Scheduled Garbage Collecting
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
                            <Button
                                // variant="outline"
                                className="border-primary text-white hover:bg-primary hover:text-primary-foreground sm:w-auto w-full px-5"
                                onClick={handleCancel}
                                buttonText="Cancel"
                            />
                            <Button
                                className="bg-primary text-white hover:bg-primary/90 sm:w-auto w-full px-5"
                                buttonText="Submit"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestCollection;
