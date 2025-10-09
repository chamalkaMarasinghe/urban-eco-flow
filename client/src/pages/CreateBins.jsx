import { useState } from "react";
import  Button from "../components/Reusable/CustomButton";
import  Input  from "../components/Reusable/CustomInput";
import  Label  from "../components/Reusable/label";
import { RadioGroup, RadioGroupItem } from "../components/Reusable/RadioGroup";
import ImageUpload from "../components/Reusable/ImageUpload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/Reusable/Select";
import { Upload, Youtube, Facebook, Twitter, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFirebaseFileUpload from "../hooks/useFirebaseFileUpload";
import showToast from "../utils/toastNotifications";
import { useThunk } from "../hooks/useThunk";
import { createCollectionRequest } from "../store/thunks/collectionRequest";
import { createBin } from "../store/thunks/sensor";

// Main Request Collection Page
const CreateBins = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        binNumber: "",
        collectionType: "",
        capacity: "",
        material: "",
        attachments: null,
    });

    // const [doUploadFilesToFirebase, isUploadingFiles, uploadFilesError] = useFirebaseFileUpload();
    const [doCreateBin, isCreateBin, errorCreateBin] = useThunk(createBin);

    const handleSubmit = async() => {
        
        // let attachment = [];

        // // NOTE: Upload attachments if they exist and are File objects
        // if (formData?.attachments && formData?.attachments?.length > 0) {

        //     const filesToUpload = formData?.attachments.filter(item =>
        //         item instanceof File ||
        //         (typeof item === "object" && item?.name && (item.type?.startsWith("image/") || item.type?.startsWith("application/")))
        //     );

        //     if (filesToUpload?.length > 0) {
        //         const uploadResult = await doUploadFilesToFirebase(
        //             filesToUpload,
        //             "collection-requests"
        //         );

        //         if (!uploadResult?.success) {
        //             showToast("error", uploadResult?.error?.message || "File Upload Error");
        //         }

        //         attachment = (uploadResult?.uploadedUrls || []).map(url => url);
        //     } else {
        //         attachment = [];
        //     }
        // }

        const tempFormData = { 
            ...formData,
            category: formData.collectionType
        };

        // if(attachment?.length > 0){
            // setFormData({...tempFormData});
        // }

        const result = await doCreateBin(tempFormData);
        if(result?.success){
            showToast("success", "Collection request was placed successfully");
        }else{
            showToast("error", result?.error?.message || "Error occrred during placing the collection request")
        }
        
        console.log("Form submitted:", formData);        
        // Handle form submission
        navigate("/");
    };

    const handleCancel = () => {
        navigate("/");
    };

    console.log("formdata outside");
    console.log(formData);
    
    return (
        <div className="flex flex-col">
            <div className="flex-1 bg-background py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Create Bin
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Create your own bin, place collection requests
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="senderId">
                                    Bin{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="binNumber"
                                    placeholder="Bin number / name"
                                    value={formData.binNumber}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            binNumber: e.target?.value,
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
                                        <SelectItem value="e_waste">
                                            E - Waste
                                        </SelectItem>
                                        <SelectItem value="bulky">
                                            Bulk Waste
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senderId">
                                Material{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="material"
                                placeholder="Please Enter Material"
                                value={formData.material}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        material: e.target?.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="senderId">
                                Capacity{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="capacity"
                                placeholder="Please Enter Capacity"
                                value={formData.capacity}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        capacity: e.target?.value,
                                    })
                                }
                                required
                            />

                        </div>

                        <div className="space-y-4">
                            {/* <RadioGroup
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
                            </RadioGroup> */}
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
                                onClick={() => {handleSubmit()}}
                                loading={isCreateBin}
                                disabled={isCreateBin}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBins;
