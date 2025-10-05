import React, { useEffect, useState } from "react";
import Dropdown from "../components/Reusable/Dropdown";
// import { searchableDropdownOptionsForTesting } from "../Data/Data";
import Button from "../components/Reusable/CustomButton";
import CustomDatePicker from "../components/Reusable/CustomDatePicker";
import { MdOutlineMood } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import MultiSelectDropDown from "../components/Reusable/MultiSelectDropDown";
import ImageUpload from "../components/Reusable/ImageUpload";
import CustomTimePicker from "../components/Reusable/CustomTimePicker";
import ProfileImageUploader from "../components/Reusable/ProfileImageUploader";
// import FormSectionHeading from "../components/Reusable/FormSectionHeading";
import Input from "../components/Reusable/Input";
import ProfileImage from "../components/Reusable/ProfileImage";
import StarRating from "../components/Reusable/StarRating";

import DropDownNew from "../components/Reusable/Dropdown";
import SearchBar from "../components/Reusable/SearchBar";
import HeroSearchBar from "../components/Reusable/HeroSearchBar";

import {
  EVENT_TYPES,
  firebaseUplaodFolders,
  referencesFormats,
} from "../constants/commonConstants";
import useFirebaseFileUpload from "../hooks/useFirebaseFileUpload";
import showToast from "../utils/toastNotifications";
// import AllOrders from "../components/Reusable/AllOrders";
// import EventCard from "../components/Reusable/EventPlan";
// import ReviewCardSkelton from "../components/Reusable/skeleton/ReviewCardSkelton";

const TestReusableComponents = () => {
  const [
    doUploadRefrencesToFirebase,
    isUploadRefrencesToFirebaseLoading,
    uploadRefrencesToFirebaseError,
  ] = useFirebaseFileUpload();

  const [searchParams, setSearchParams] = useSearchParams({
    category: "",
  });
  // const [selectedCategory, setSelectedCategory] = useState(
  //   searchableDropdownOptionsForTesting.find(
  //     (option) => option.id === Number(searchParams.get("category"))
  //   ) || null
  // );
  const [selectedDate, setSelectedDate] = useState(null);

  const [searchValue, setSerachValue] = useState("");

  // useEffect(() => {
  //   const params = {
  //     category: selectedCategory?.id,
  //   };
  //   setSearchParams(params);
  // }, [selectedCategory, searchParams]);

  // const handleSelectedCategory = (category) => {
  //   setSelectedCategory(category);
  // };

  const getSelectedDate = (date) => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const year = selectedDate.year();
    const month = selectedDate.month() + 1; // Note: zero-indexed
    const day = selectedDate.date();

    setSelectedDate(date);
  };

  console.log("selectedDate", selectedDate);


  const [uploadFiles, setUploadFiles] = useState([]);

  const onFileUpload = (files) => {
    setUploadFiles([...files]); // Ensure it's a new array
  };

  // Pick Time
  const [selectedTime, setSelectedTime] = useState("");

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    console.log("Selected Time:", time);
  };

  // MultiSelect
  const [multiSelect, setMultiSelect] = useState([]);

  const handleMultiSelect = (selectedOptions) => {
    setMultiSelect(selectedOptions);
  };

  const handleUploadFiles = async (e) => {
    e.preventDefault();

    const fileUploadResult = await doUploadRefrencesToFirebase(
      uploadFiles,
      firebaseUplaodFolders.F_REFERENCES
    );

    if (!fileUploadResult.success) {
      console.error("Upload Error:", fileUploadResult.error);
      showToast("error", "Failed to upload files");
      return;
    }

    const downloadURLs = fileUploadResult.uploadedUrls;

    console.log("uploadFiles", uploadFiles);
  };

  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const handleUploadProfileImage = async (e) => {
    e.preventDefault();

    if (!profilePictureFile) {
      showToast("error", "Please select a profile image");
      return;
    }

    const fileUploadResult = await doUploadRefrencesToFirebase(
      [profilePictureFile],
      firebaseUplaodFolders.F_PROFILE_PICTURES
    );

    if (!fileUploadResult.success) {
      console.error("Upload Error:", fileUploadResult.error);
      showToast("error", "Failed to upload files");
      return;
    }

    const downloadURLs = fileUploadResult.uploadedUrls;
    // Handle the downloaded URLs (e.g., save to user profile)
    console.log("Uploaded profile picture URLs:", downloadURLs);
  };

  const handleProfileImageUpload = (file) => {
    setProfilePictureFile(file);
  };

  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = () => {
    console.log("Searching for:", searchTerm); };

  return (
    <div className="p-2 flex flex-col gap-8 mb-[500px]">
      <div className=" py-2 flex gap-4 w-[600px] items-center justify-center ">
        <Dropdown
          // options={searchableDropdownOptionsForTesting}
          placeholder="Select an option"
          // isSearchable={true}
          // defaultOption={selectedCategory}
          // onSelect={handleSelectedCategory}
          wrapperClassName="font-inter"
          buttonClassName="h-12 rounded-[8px]"
          dropdownClassName="rounded-md"
          optionClassName="text-primary hover:bg-primary-light"
          displayKey="value"
          idKey="id"
          isRequired={true}
          label={`Category`}
        />
      </div>
      <div className="py-2 ">
        <h1>Custom</h1>
        <Dropdown
          // options={searchableDropdownOptionsForTesting}
          // defaultOption={selectedCategory}
          displayKey="value"
          placeholder="Select Category"
          idKey="id"
          // onSelect={handleSelectedCategory}
          wrapperClassName="w-full max-w-[745px] h-[56px] font-inter font-medium text-base"
          filterClassName="max-h-[240px] overflow-y-auto scrollbar-none"
          buttonClassName="px-10 border border-primary h-12 rounded-[20px] text-content"
          dropdownClassName="rounded-[22px] shadow-lg"
          optionClassName="px-10 py-3 hover:bg-gray-100 first:rounded-t-[20px] last:rounded-b-[20px]
                       text-content"
        />
      </div>

      <div className=" py-2 flex gap-4 w-[600px] items-center justify-center ">
        <DropDownNew
          // options={searchableDropdownOptionsForTesting}
          placeholder="Status"
          // isSearchable={true}
          // defaultOption={selectedCategory}
          // onSelect={handleSelectedCategory}
          wrapperClassName="font-inter"
          buttonClassName="h-12 rounded-[5px]"
          dropdownClassName="rounded-md"
          optionClassName="text-light-gray hover:bg-primary-light"
          displayKey="value"
          idKey="id"
          isRequired={true}
          // label={`Category`}
          // isForm={true}
          outerContainerStyle="w-[154px] h-[40px] rounded-[5px] top-[20px] left-[40px]"
        />
      </div>

      <div className=" py-2 flex gap-4 w-[600px] items-center justify-center ">
        <DropDownNew
          // options={searchableDropdownOptionsForTesting}
          placeholder="Select a Category"
          // isSearchable={true}
          // defaultOption={selectedCategory}
          // onSelect={handleSelectedCategory}
          wrapperClassName="font-roboto"
          buttonClassName="h-12 px-[18px] py-[14px] rounded-[5px]"
          dropdownClassName="rounded-md"
          optionClassName="text-light-gray hover:bg-primary-light"
          displayKey="value"
          idKey="id"
          isRequired={true}
          label={`Category`}
          isForm={true}
          outerContainerStyle="w-[519px] h-[50px] rounded-[5px] top-[154px] left-[563px]"
        />
      </div>

      <SearchBar
        type="text"
        placeholder="Search by Name"
        className="w-[380px] h-[40px] pt-10 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
        searchIcon={true}
        onChange={(e) => setSerachValue(e.target.value)}
        value={searchValue}
        outerContainerStyle="w-full md:w-[392px]"
        inputStyle={` placeholder:text-[#C1C3C3] placeholder-opacity-50 placeholder:font-normal`}
        title="Type to search"
      />

      <HeroSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />

      <div className="flex gap-4 ">
        <Button
          type="button"
          buttonText="Button"
          loading={false}
          onClick={handleUploadFiles}
          className=" bg-primary text-level-6 font-semibold text-white w-[120px] h-[46px] flex items-center justify-center rounded-xl"
        />
        <Button
          type="button"
          buttonText="Button"
          loading={true}
          loaderColor="var(--tertiary-color)"
          onClick={handleUploadProfileImage}
          className=" bg-primary text-level-6 font-semibold text-white w-[120px] h-[46px] flex items-center justify-center rounded-xl"
        />
        <Button
          type="button"
          buttonText="Become a Service Pro"
          bgColor="bg-white"
          borderColor="border-primary"
          textColor="text-primary"
          width="w-[200px]"
          height="h-12"
          loading={false}
        />
        <Button
          type="button"
          buttonText="Become a Service Pro"
          bgColor="bg-white"
          borderColor="border-primary"
          textColor="text-primary"
          width="w-[200px]"
          height="h-12"
          loading={true}
        />
        <Button
          type="button"
          buttonText="Post a Job"
          bgColor="bg-white"
          borderColor="border-primary"
          textColor="text-primary"
          width="w-[140px]"
          height="h-12"
          loading={false}
          icon={<MdOutlineMood size={20} />}
        />
        <Button
          type="button"
          buttonText="Post a Job"
          bgColor="bg-white"
          borderColor="border-primary"
          textColor="text-primary"
          width="w-[140px]"
          height="h-12"
          loading={false}
          icon={<MdOutlineMood size={20} />}
          iconPosition="right"
        />
      </div>
      <div className=" flex gap-3 items-center justify-center w-[400px]">
        <Button
          buttonText="Button"
          bgColor="bg-primary"
          textColor="text-white"
          width="w-full"
          height="h-[46px]"
          borderColor="border-transparent"
          loading={false}
        />
        <Button
          buttonText="Button"
          bgColor="bg-primary"
          textColor="text-white"
          width="w-full"
          height="h-[46px]"
          borderColor="border-transparent"
          loading={true}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 md:gap-12">
        <CustomDatePicker
          label="Date of Birth"
          placeholder="Select Date"
          selectedDate={selectedDate}
          onChange={(date) => console.log("date: ", date)}
          isRequired={true}
          // outerContainerStyle="w-[320px]"
          pickerWidth="100%"
          pickerHeight="3rem"
        />

        <CustomTimePicker
          label={"Time"}
          isRequired={true}
          selectedTime={selectedTime}
          onChange={handleTimeChange}
        />

        <MultiSelectDropDown
          // options={searchableDropdownOptionsForTesting}
          defaultSelected={multiSelect}
          onSelect={handleMultiSelect}
          label="Select"
          placeholder="multi select"
          isRequired={false}
          isDisabled={false}
          isSearchable={false}
          idKey="id"
          displayKey="value"
        />
      </div>

      <div className=" flex gap-6 max-w-[1024px] items-center justify-center">
        {/* <ImageUpload
          label="Upload Files"
          isRequired={true}
          labelStyle=""
          outerContainerStyle=""
          uploadFiles={uploadFiles}
          onFileUpload={onFileUpload}
          isLoading={false}
          uploadText="PDF, Excel are allowed"
          dragText="Drop your image here, or browse"
          error={null}
          accept={Object.values(referencesFormats)} // accept all formats
          borderStyle="border-dashed"
        /> */}
        {/* <ImageUpload
          label="Upload Files"
          isRequired={true}
          labelStyle=""
          outerContainerStyle=""
          uploadFiles={uploadFiles}
          onFileUpload={onFileUpload}
          isLoading={true}
          isDisabled={true}
          uploadText="Jpeg, Jpg, png are allowed"
          accept={[referencesFormats.JPEG_JPG, referencesFormats.PNG]}
          dragText="Drop your image here, or browse"
          error={null}
          borderStyle="border"
        /> */}

        <ProfileImageUploader
          label="Profile Image"
          isRequired={false}
          avatarContainerStyle="w-[119px]"
          imageStyle="w-[119px] h-[115px]"
          labelStyle="font-inter font-medium text-content"
          outerContainerStyle="flex flex-col gap-2"
          onImageUpload={handleProfileImageUpload}
          loading={isUploadRefrencesToFirebaseLoading}
        />
      </div>
      {/* <FormSectionHeading index={4} title="Additional Requirement" /> */}

      <Input
        label="Task Title"
        // type="textarea"
        placeholder="Enter a concise task"
        outerContainerStyle="flex-grow"
        name="taskTitle"
        isRequired={true}
        isForm={true}
      />

      <Input
        label="Task Title"
        // type="textarea"
        placeholder="Enter a concise task"
        outerContainerStyle="flex-grow"
        name="taskTitle"
        isRequired={true}
        // isForm={true}
      />

      <div className="mt-12 mb-[88px] px-[20px] md:px-[40px] lg:px-[100px]">
        <ImageUpload
          label="Upload Files"
          isRequired={true}
          labelStyle=""
          outerContainerStyle=""
          uploadFiles={uploadFiles}
          onFileUpload={onFileUpload}
          uploadText="Jpeg, Jpg, png are allowed"
          accept={[
            referencesFormats.JPEG_JPG,
            referencesFormats.PNG,
            referencesFormats.PDF,
          ]}
          dragText="Drop your image here, or browse"
          borderStyle="border border-dashed"
          allowImageArrange={true}
          maximumSize={1}
          numberOfImages={2}
          isLoading={false}
          numberOfFiles={3}
        />
      </div>
      {/* <AllOrders /> */}
      <hr />
      <div className="flex flex-wrap items-center justify-center gap-9">
        {/* <EventCard
          eventType={EVENT_TYPES.PUBLIC}
          price="$1,170"
          eventName="Magic Show"
          eventDate="2025-Sep-14"
          eventHostName="Centigradez"
          startTime="10:00 AM"
          endTime="06:00 PM"
          eventLocation="Kurunegala"
        /> */}
        {/* <EventCardSkeleton /> */}
        {/* <EventCard
          eventType={EVENT_TYPES.OPEN}
          price="$1,170"
          eventName="Magic Show"
          eventDate="2025-Sep-01"
          eventHostName="Centigradez"
          startTime="10:00 AM"
          endTime="06:00 PM"
          eventLocation="Kurunegala"
        /> */}
        {/* <EventCard
          eventType={EVENT_TYPES.RECURRING}
          price="$1,170"
          eventName="Magic Show"
          eventDate="2025-Sep-01"
          eventHostName="Centigradez"
          startTime="10:00 AM"
          endTime="06:00 PM"
          eventLocation="Kurunegala"
        /> */}
      </div>
      <hr />
      <div className="flex flex-col gap-6 px-20 my-5">
        {/* <ReviewCardSkelton /> */}
        {/* Review card for testing */}
        <div className="border border-[#DDE1E6] rounded-xl px-3 py-6 sm:p-6">
          {/* Review Item 1 */}
          <div className="pb-3 border-b border-gray-200 ">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="self-center w-16 h-16">
                <ProfileImage
                  profilePicture="https://img.freepik.com/premium-photo/beauty-fashion-portrait-young-beautiful-brunette-woman-with-long-black-hair-green-eyes_333900-2809.jpg?uid=R193178966&ga=GA1.1.282616820.1742108794&semt=ais_hybrid&w=740"
                  firstName="Sarah"
                  lastName="M."
                  className="w-12 h-12"
                  imageStyle="rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="mb-[2px]">
                  <span className="font-inter font-semibold text-[16px] sm:text-[18px] leading-6 text-headings-1">
                    Sarah M.
                  </span>
                </div>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  {/* 5 Star Rating */}
                  <StarRating rating={4} size={20} />
                  <span className="font-inter font-normal text-[14px] sm:text-[16px] text-dark-black">
                    2025-04-02 <span className="text-[#33415580]">at</span> 2.00
                    PM
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="pt-6 text-base font-normal font-inter text-content-color">
            The professionals are top-notch! I've used Tasker for plumbing and
            electrical work, and both experiences were fantastic. Reliable and
            trustworthy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestReusableComponents;
