import { useEffect, useState } from "react";
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
import { getAllCreatedBins } from "../store/thunks/sensor";
import { collectionRequestOriginTypes } from "../constants/commonConstants";
import { useSelector } from "react-redux";

// Main Request Collection Page
const RequestCollection = () => {

    const { isAuthenticated, user, role, availableRoles } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        collectionRequestOriginType: collectionRequestOriginTypes.NORMAL,
        senderId: "",
        bin: "",
        collectionType: "",
        location: "",
        serviceType: "regular",
        attachments: null,
        // schedule fields (new)
        scheduleStartDate: "",        // format: YYYY-MM-DD
        scheduleDays: "",             // e.g. ["MONDAY","WEDNESDAY"]
    });
    const [bins, setBins] = useState([]);

    const [doUploadFilesToFirebase, isUploadingFiles, uploadFilesError] = useFirebaseFileUpload();
    const [doCollectionRequest, isCollectionRequest, collectionRequestError] = useThunk(createCollectionRequest);
    const [doGetAllCreatedBins, isGetAllCreatedBins, errorGetAllCreatedBins] = useThunk(getAllCreatedBins);

    useEffect(() => {
        if(formData.collectionType === "hazardous"){
            setFormData({
                ...formData,
                collectionRequestOriginType: collectionRequestOriginTypes.SPECIAL
            })
        }
    }, [formData.collectionType])

    useEffect(() => {
        getAllBinsMethod();
    }, [])

    const getAllBinsMethod = async() => {
        const res = await doGetAllCreatedBins();        
        if(res?.success){            
            setBins(res?.response?.data?.docs || []);
        }else{
            showToast("error", res?.error?.message || "Error Occurred");
        }
    }

    const WEEK_DAYS = [
      { key: "MONDAY", label: "Monday" },
      { key: "TUESDAY", label: "Tuesday" },
      { key: "WEDNESDAY", label: "Wednesday" },
      { key: "THURSDAY", label: "Thursday" },
      { key: "FRIDAY", label: "Friday" },
      { key: "SATURDAY", label: "Saturday" },
      { key: "SUNDAY", label: "Sunday" },
    ];

    // const toggleScheduleDay = (dayKey) => {
    //   setFormData(prev => {
    //     const days = Array.isArray(prev.scheduleDays) ? [...prev.scheduleDays] : [];
    //     const found = days.indexOf(dayKey);
    //     if (found === -1) days.push(dayKey);
    //     else days.splice(found, 1);
    //     return { ...prev, scheduleDays: days };
    //   });
    // };

    // const getScheduleValueForSelect = () => {
    //   const days = formData.scheduleDays || [];
    //   if (!days.length) return null;
    //   // show human readable labels joined by comma
    //   const labels = WEEK_DAYS.filter(w => days.includes(w.key)).map(w => w.label);
    //   return labels.join(", ");
    // };

    const handleSubmit = async() => {

        if(!formData.bin || formData?.bin?.length < 1){
            showToast("error", "Please select a bin");
            return;
        }

        // // If user requested scheduling (you can change condition as needed)
        // if (formData.collectionRequestOriginType === collectionRequestOriginTypes.SPECIAL) {
        //   // If they enabled schedule we validate schedule fields
        //   if (formData.scheduleDays?.length > 0 && !formData.scheduleStartDate) {
        //     showToast("error", "Please select a start date for the schedule");
        //     return;
        //   }
        // }

        let attachment = [];

        // NOTE: Upload attachments if they exist and are File objects
        if (formData?.attachments && formData?.attachments?.length > 0) {
            const filesToUpload = formData?.attachments.filter(item =>
                item instanceof File ||
                (typeof item === "object" && item?.name && (item.type?.startsWith("image/") || item.type?.startsWith("application/")))
            );

            if (filesToUpload?.length > 0) {
                const uploadResult = await doUploadFilesToFirebase(
                    filesToUpload,
                    "collection-requests"
                );

                if (!uploadResult?.success) {
                    showToast("error", uploadResult?.error?.message || "File Upload Error");
                }

                attachment = (uploadResult?.uploadedUrls || []).map(url => url);
            } else {
                attachment = [];
            }
        }

        const tempFormData = {
            ...formData, 
            attachment: formData.collectionRequestOriginType === collectionRequestOriginTypes.SPECIAL ?  attachment?.[0] : "https://png.pngtree.com/thumb_back/fh260/background/20240409/pngtree-concept-of-plastic-waste-and-pollution-from-plastic-waste-image_15651772.jpg",
            title: formData?.senderId,
            bin: formData.bin,
            location: {
                "type": "Point",
                "coordinates": [
                    "5",
                    "5"
                ],
                "address": formData?.location,
                "longitude": "5",
                "latitude": "5"
            },

            type: formData?.collectionType?.toUpperCase(),
            priority: formData?.serviceType?.toUpperCase(),
            // include schedule in payload
            schedule: {
                startDate: formData?.scheduleStartDate || null,
                days: formData?.scheduleDays || []
            }
        };

        if(attachment?.length > 0){
            setFormData({...tempFormData});
        }

        const result = await doCollectionRequest(tempFormData);
        if(result?.success){
            // showToast("success", "Collection request was placed successfully");
            setFormData({
                senderId: "",
                bin: "",
                collectionType: "",
                location: "",
                serviceType: "regular",
                attachments: null,
                scheduleStartDate: "",
                scheduleDays: []
            })
        }else{
            showToast("error", result?.error?.message || "Error occrred during placing the collection request")
        }
        showToast("success", "Collection request was placed successfully");
        
        console.log("Form submitted:", tempFormData);        
        // Handle form submission
    };

    const handleCancel = () => {
        setFormData({
            senderId: "",
            bin: "",
            collectionType: "",
            location: "",
            serviceType: "regular",
            attachments: null,
            scheduleStartDate: "",
            scheduleDays: []
        })
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
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <RadioGroup
                                value={formData.collectionRequestOriginType}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        collectionRequestOriginType: value,
                                    })
                                }
                                className="flex flex-row mb-[40px] gap-[30px] w-full"
                            >
                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem
                                        value={collectionRequestOriginTypes.NORMAL}
                                        id={collectionRequestOriginTypes.NORMAL}
                                        className="mt-1"
                                    />
                                    <div>
                                        <Label
                                            htmlFor={collectionRequestOriginTypes.NORMAL}
                                            className="font-semibold cursor-pointer"
                                        >
                                            {collectionRequestOriginTypes.NORMAL}
                                        </Label>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem
                                        value={collectionRequestOriginTypes.SPECIAL}
                                        id={collectionRequestOriginTypes.SPECIAL}
                                        className="mt-1"
                                    />
                                    <div>
                                        <Label
                                            htmlFor={collectionRequestOriginTypes.SPECIAL}
                                            className="font-semibold cursor-pointer"
                                        >
                                            {collectionRequestOriginTypes.SPECIAL}
                                        </Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="senderId">
                                    Request Name{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="senderId"
                                    placeholder="Please name the request"
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

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="collectionType">
                                    Bin{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.bin}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            bin: value,
                                        })
                                    }
                                    required
                                >
                                    <SelectTrigger id="collectionType">
                                        <SelectValue placeholder="Select your bin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bins?.map((item) => (
                                            <SelectItem key={item?._key} value={item?._id}>
                                                {item?.binNumber}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    required
                                />
                            </div>
                        </div>

                        {/* Conditional: file upload OR scheduler for SPECIAL origin */}
                        {
                            formData.collectionRequestOriginType === collectionRequestOriginTypes.SPECIAL && (
                                <ImageUpload
                                    label= {"Hello"}
                                    labelStyle="font-roboto font-medium text-sm leading-[22px] tracking-[-0.006em] text-user-black"
                                    onFileUpload={(files) => {setFormData({...formData, attachments: files})}}
                                    uploadFiles={formData?.attachments || []}
                                    uploadText= {"Drop your images here or Browse"}
                                    dragText= {"Jpeg, jpg and png are allowed"}
                                    numberOfFiles={1}
                                    allowImageArrange={false}
                                    maximumSize={10}
                                    isForm={true}
                                    accept={[
                                        { mime: "application/pdf", extensions: [".pdf"] },
                                        { mime: "image/jpeg", extensions: [".jpg", ".jpeg"] },
                                        { mime: "image/png", extensions: [".png"] },
                                    ]}
                                />
                            )
                        }

                        {
                            user?.scope === "BUSINESS" && (
                                <>
                                    {/* --- New schedule UI --- */}
                                    <div className="mt-4 p-4 border rounded">
                                    <h3 className="font-semibold mb-2">Plan a schedule</h3>

                                    {/* Start date */}
                                    <div className="mb-3">
                                        <Label htmlFor="scheduleStartDate">Start Date</Label>
                                        <input
                                        id="scheduleStartDate"
                                        type="date"
                                        value={formData.scheduleStartDate}
                                        onChange={(e) => setFormData({...formData, scheduleStartDate: e.target.value})}
                                        className="w-full border rounded px-3 py-2"
                                        />
                                    </div>

                                    {/* Weekday selector using your Select component as a toggle multi-select */}
                                    <div>
                                        <Label htmlFor="scheduleDays">Repeat on</Label>
                                        <Select
                                        value={formData.scheduleDays}
                                        //   onValueChange={(value) => {
                                        //     // value is the label or null; we'll not use it directly
                                        //     // The SelectItem click handler below toggles days.
                                        //   }}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    scheduleDays: value,
                                                })
                                            }
                                        >
                                        <SelectTrigger id="scheduleDays">
                                            <SelectValue placeholder="Select days (Mon - Fri)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {WEEK_DAYS.map((d) => (
                                            <SelectItem
                                                key={d.key}
                                                value={d.key}
                                                // onClick={(e) => {
                                                //   // Prevent the select from closing (if your Select closes on select)
                                                //   e.stopPropagation && e.stopPropagation();
                                                //   toggleScheduleDay(d.key);
                                                // }}
                                            >
                                                {/* <div className="flex justify-between items-center w-full">
                                                <span>{d.label}</span>
                                                {formData.scheduleDays?.includes(d.key) && (
                                                    <span className="text-sm text-green-600">Selected</span>
                                                )}
                                                </div> */}
                                                {d.key}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>

                                        {/* Summary of selected days */}
                                        <div className="mt-2 text-sm text-muted-foreground">
                                        {formData.scheduleDays?.length > 0 ? (
                                            <span>Every: { (WEEK_DAYS.filter(w => formData.scheduleDays.includes(w.key)).map(w => w.label)).join(", ") }</span>
                                        ) : (
                                            <span className="text-gray-400">No days selected</span>
                                        )}
                                        </div>
                                    </div>
                                    </div>
                                </>
                            )
                        }

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
                                onClick={() => {handleSubmit()}}
                                loading={isUploadingFiles}
                                disabled={isUploadingFiles}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestCollection;
