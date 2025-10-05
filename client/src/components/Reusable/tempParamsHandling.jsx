import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useConfirmation } from "../../hooks/useConfirmation";
import { getOrderStatusColor } from "../../utils/getOrderStatusColor";
import { CLIENT_ORDERS_TABLE_TABS, customBreakpoints, eventCategories, orderStatus } from "../../constants/commonConstants";
import { currencyFormatter, formatOrderStatus } from "../../utils/formatting";
import Dropdown from "./Dropdown";
import { orderStatusForDropdown } from "../../constants/commonConstants";
import DataTable from "./Table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatYYYY_MM_DD } from "../../utils/dateFormating";
import Input from "../../components/Reusable/Input";
import DateRangePicker from "../../components/Reusable/DateRangePicker";
import EyeIcon from "../../assets/actions/eye.svg";
import MoreIcon from "../../assets/actions/more.svg";
import { logout } from "../../store";
import SearchBar from "./SearchBar";
import DropDownNew from "./DropDownNew";
import CustomButton from "./CustomButton";
import { ConfirmationModal } from "../Model/ConfirmationModel";
// import { searchableDropdownOptionsForTesting } from "../../Data/Data";
import TabButtonPlane from "./TabButtonsPlane";
import AddOrderReviewModal from "./AddOrderReviewModal";
import { getAllEvents } from "../../store/thunks/eventThunks";
import { addEventReview } from "../../store/thunks/reviewThunks";
import { useThunk } from "../../hooks/useThunk";
import showToast from "../../utils/toastNotifications";

const AllOrders = ({
                     textColor = "#555F7E",
                     textCommonStyles = `font-inter font-normal text-level-10 leading-[16.8px] text-content`,
                   }) => {

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Add the review thunk hook
  const [doAddReview, isAddingReview, addReviewError] = useThunk(addEventReview);

  // STATE: Refs ==============================================================================================

  const actionButtonRef = useRef(null);
  const menuRef = useRef(null);

  // STATE: Component States ====================================================================================

  const [openActionRow, setOpenActionRow] = useState(null);
  const [portalWidth, setPortalWidth] = useState(240);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    activeTab: searchParams.get("activeTab") || "",
    multipleStatus: searchParams.get("multipleStatus") || "",
    userName: searchParams.get("userName") || "",
    startingDate: searchParams.get("startingDate") || "",
    endingDate: searchParams.get("endingDate") || "",

    search: searchParams.get("search") || "",
    category: searchParams.get("category") || ""
  });

  // Search state - separate from filters to handle search/reset independently
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
      eventCategories.find(
          (option) => option?._id === Number(searchParams.get("category"))
      ) || null
  );
  const [selectedOption, setSelectedOptions] = useState(CLIENT_ORDERS_TABLE_TABS.UPCOMING);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger

  // STATE: custom hooks =======================================================================================

  const { requestConfirmation, confirmation, confirm, cancel } = useConfirmation();

  // STATE: Side Effects ========================================================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          actionButtonRef.current &&
          !actionButtonRef.current.contains(event.target)
      ) {
        setOpenActionRow(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      setPortalWidth(menuRef.current.offsetWidth);
    }
  }, [openActionRow]);

  // Update filters when URL params change (for direct URL access)
  useEffect(() => {
    setFilters({
      status: searchParams.get("status") || "",
      activeTab: searchParams.get("activeTab") || "",
      multipleStatus: searchParams.get("multipleStatus") || "",
      userName: searchParams.get("userName") || "",
      startingDate: searchParams.get("startingDate") || "",
      endingDate: searchParams.get("endingDate") || "",

      search: searchParams.get("search") || "",
      category: searchParams.get("category") || ""
    });
    setSearchValue(searchParams.get("search") || "");
    setSelectedCategory(
        eventCategories.find(
            (option) => option._id === Number(searchParams.get("category"))
        ) || null
    );
  }, [searchParams]);

  // Handle review submission errors
  useEffect(() => {
    if (addReviewError) {
      showToast("error", addReviewError);
    }
  }, [addReviewError]);

  // STATE: Helper Functions ====================================================================================

  const handleSelectedCategory = (category) => {    
    setSelectedCategory(category);
    // Update URL params immediately
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set("category", category._id);
    } else {
      newParams.delete("category");
    }
    newParams.set("page", "1"); // Reset to first page    
    setSearchParams(newParams);
  };

  const handleOpenMenu = (event, record) => {
    event.stopPropagation();

    if (openActionRow?._id === record._id) {
      setOpenActionRow(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
    setOpenActionRow(record);
  };

  const handleOpenReviewModal = (order) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
    setOpenActionRow(null);
  };

  // handleReviewSubmit function
  const handleReviewSubmit = async (reviewData) => {
    try {
      const result = await doAddReview({
        eventId: selectedOrder._id,
        reviewData: reviewData
      });

      if (result?.success) {
        showToast("success", "Thank you! Your review has been submitted successfully.");
        setIsReviewModalOpen(false);
        setSelectedOrder(null);
        // Refresh the table data to show updated information
        setRefreshTrigger(prev => prev + 1);
      } else {
        showToast("error", result?.error || "Failed to submit review. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("error", "Failed to submit review. Please try again later.");
    }
  };

  const handleAction = (order, action) => {
    if (action === "accept") {
      navigate(`/all-orders/raise-complaint?orderId=${order._id}`);
      setOpenActionRow(null);
    } else if (action === "delete") {
      handleOpenReviewModal(order);
    }
  };

  // Handle search functionality
  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      newParams.set("search", searchValue.trim());
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1"); // Reset to first page
    setSearchParams(newParams);
  };

  // Handle reset - only clear search params
  const handleReset = () => {
    setSearchValue("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Handle Enter key in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const [activeTab, setActiveTab] = useState(
      searchParams.get("activeTab") || ""
  );

  const prevFiltersRef = useRef(JSON.stringify(filters));

  // Update URL params whenever filters change (excluding search)
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    const currentFiltersStr = JSON.stringify(filters);
    const prevFiltersStr = prevFiltersRef.current;

    // Update or remove parameters based on filter values
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Only reset page to 1 if filters actually changed
    if (currentFiltersStr !== prevFiltersStr) {
      newParams.set("page", "1");
      prevFiltersRef.current = currentFiltersStr;
    }

    setSearchParams(newParams);
  }, [filters]);

  // Handle status filter change
  const handleStatusChange = (option) => {
    setFilters((prev) => ({
      ...prev,
      status: option?.id || "",
      multipleStatus: "",
      activeTab: "",
    }));
    setActiveTab("");
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    const activeTab = tab === "all" ? "" : tab;
    setActiveTab(activeTab);

    const ongoingStatuses = [
      orderStatus.ORDER_IN_PROGRESS,
      orderStatus.IN_REVISION,
      orderStatus.ORDER_DELIVERED,
    ];
    const completedStatuses = [
      orderStatus.COMPLETED,
      orderStatus.COMPLAINT_RAISED,
      orderStatus.ISSUE_RESOLVED,
    ];

    setFilters((prev) => ({
      ...prev,
      activeTab: activeTab,
      status: "",
      multipleStatus:
          tab === "ongoing"
              ? ongoingStatuses.join(",")
              : tab === "completed"
                  ? completedStatuses.join(",")
                  : "",
    }));
  };

  // NOTE: Table Columns ======================================================================================

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sortable: false,
      render: (id) => <span className={textCommonStyles}>{id}</span>,
      minWidth: "100px",
    },
    {
      title: "Event Title",
      dataIndex: "name",
      key: "name",
      render: (name) => (
          <span
              title={name}
              className={`${textCommonStyles} truncate whitespace-nowrap overflow-hidden text-ellipsis`}
          >
          {name || "N/A"}
        </span>
      ),
      maxWidth: "200px",
    },
    {
      title: "Event Date & Time",
      dataIndex: "date",
      key: "date",
      render: (date) => (
          <span className={textCommonStyles}>{formatYYYY_MM_DD(date)}</span>
      ),
    },
    {
      title: "Payment",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        textColor = "green"
        return (
            <span className={textCommonStyles} style={{ color: textColor }}>
            {status}
          </span>
        );
      },
    },
    {
      title: "Order Date & Time",
      dataIndex: "date",
      key: "date",
      render: (date) => (
          <span className={textCommonStyles}>{formatYYYY_MM_DD(date)}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        return (
            <span className={textCommonStyles}>
            {currencyFormatter.format(price)}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
          <div className="relative flex items-center gap-3">
            <button
                className="w-[32px] h-[32px] cursor-pointer"
                onClick={() => {
                  navigate(`/events/E1003`);
                }}
            >
              <img
                  src={EyeIcon}
                  alt="View"
                  className="object-fill w-full h-full "
              />
            </button>
            <button
                ref={actionButtonRef}
                className="w-[32px] h-[32px] cursor-pointer"
                onClick={(e) => handleOpenMenu(e, record)}
            >
              <img
                  src={MoreIcon}
                  alt="more"
                  className="object-fill w-full h-full"
              />
            </button>
          </div>
      ),
      minWidth: "80px",
    },
  ];

  // Render menu in a portal outside the table
  const actionMenu = openActionRow
      ? createPortal(
          <div
              ref={menuRef}
              className="absolute w-[180px] bg-[#DDE1E6] rounded-[8px] z-50 flex flex-col justify-center shadow-lg"
              style={{
                top: dropdownPosition.top + 6,
                left:
                    dropdownPosition.left -
                    (portalWidth === 180 ? 150 : portalWidth - 30),
              }}
          >
          <span
              onClick={() => handleAction(openActionRow, "delete")}
              className="px-3 py-2 font-medium leading-6 transition-all duration-300 cursor-pointer font-inter text-text-level-9 text-content rounded-tl-md rounded-tr-md hover:bg-primary hover:text-white"
          >
            Add Review
          </span>
            {
                openActionRow?.isLocalPaymentMethod &&
                <span
                    onClick={() => {navigate("/events/:eventId/checkout")}}
                    className="px-3 py-2 font-medium leading-6 transition-all duration-300 cursor-pointer font-inter text-text-level-9 text-content hover:bg-primary hover:text-white"
                >
              Pay Now
            </span>
            }
            {
                openActionRow?.isLocalPaymentMethod &&
                <span
                    onClick={async () => {
                      const isConfirmed = await requestConfirmation({
                        type: "accept",
                        title: "Unsubscribe",
                        message: "Are you sure you want to unsubscribe from all our emails just yet?",
                        confirmText: "Yes, Unsubscribe",
                        cancelText: "Go Back",
                      });
                    }}
                    className="px-3 py-2 font-medium leading-6 transition-all duration-300 cursor-pointer font-inter text-text-level-9 text-content hover:bg-primary hover:text-white"
                >
              Unsubscribe
            </span>
            }
            <span
                onClick={() => handleAction(openActionRow, "accept")}
                className="px-3 py-2 font-medium leading-6 transition-all duration-300 cursor-pointer font-inter text-text-level-9 text-content rounded-bl-md rounded-br-md hover:bg-primary hover:text-white"
            >
            Raise Complaint
          </span>
          </div>,
          document.body
      )
      : null;

  return (
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-2 font-roboto font-medium text-level-2 custom-w-br-360:text-level-1 leading-[100%] tracking-normal">
            <p className="text-primary-text">My</p>
            <p className="text-primary">Orders</p>
          </div>
        </div>
        <div className="flex flex-col flex-grow gap-9 px-[4.6%] mt-5 mb-10 py-8 w-[88.88%] mx-auto rounded-xl bg-white">
          <div className="flex flex-col gap-3 custom-w-br-920:flex-row">
            <div className="flex flex-col custom-w-br-680:flex-row gap-2 w-full custom-w-br-920:w-[52%]">
              <div className="flex w-full mr-2">
                <SearchBar
                    type="text"
                    placeholder="Search by Event Title/ID"
                    className="h-[40px] pt-10 py-2  border border-gray-300 rounded-md text-sm font-medium text-gray-700"
                    searchIcon={true}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    value={searchValue}
                    outerContainerStyle=""
                    inputStyle={` placeholder:text-[#C1C3C3] placeholder-opacity-50 placeholder:font-normal focus:border-primary`}
                    title="Type to search"
                />
              </div>
              <div className="flex flex-row gap-1">
                <CustomButton
                    type="button"
                    buttonText="Search"
                    loading={false}
                    onClick={handleSearch}
                    className="bg-primary text-level-6 font-semibold text-white flex items-center justify-center rounded-[5px] h-[39px] w-full custom-w-br-680:w-[100px]"
                    textWeight="font-[600] font-inter"
                />
                <CustomButton
                    type="button"
                    buttonText="Reset"
                    bgColor="bg-white"
                    borderColor="border-primary"
                    textColor="text-primary"
                    className="h-[39px] rounded-[5px] w-full custom-w-br-680:w-[100px]"
                    textWeight="font-[600] font-inter"
                    loading={false}
                    onClick={handleReset}
                />
              </div>
            </div>
            <div className="flex flex-row gap-1 justify-end w-full custom-w-br-920:w-[48%]">
              <div className="items-center justify-center hidden w-full custom-w-br-920:flex"></div>
              <div className="flex flex-row w-full custom-w-br-920:justify-end">
                <p className="flex justify-center items-center font-inter font-normal text-dark-gray w-[90px]">Filter By</p>
                <DropDownNew
                    options={eventCategories}
                    placeholder="Status"
                    defaultOption={selectedCategory}
                    onSelect={handleSelectedCategory}
                    wrapperClassName="font-inter"
                    buttonClassName="rounded-[5px] py-[8.5px] px-3"
                    dropdownClassName="rounded-md"
                    optionClassName="text-light-gray hover:bg-primary-light"
                    displayKey="name"
                    idKey="_id"
                    isRequired={true}
                    outerContainerStyle="w-full custom-w-br-680:w-[154px] rounded-[5px] top-[20px] left-[40px]"
                />
              </div>
            </div>
          </div>

          {/* Tab Buttons */}
          <div>
            <TabButtonPlane
                options={Object.values(CLIENT_ORDERS_TABLE_TABS)}
                selectedOption={selectedOption}
                setSelectedOptions={setSelectedOptions}
            />
          </div>

          <div className="flex flex-col flex-grow gap-4 ">
            <DataTable
                columns={columns}
                fetchData={getAllEvents}
                rowKey="_id"
                filters={{
                  ...filters,
                  search: searchParams.get("search") || "",
                  category: searchParams.get("category") || "",
                }}
                initialPageSize={5}
                enableUrlParams={true}
                hasSubTable={false}
                subTableConfig={{
                  columns: [],
                  rowKey: "_id",
                }}
                refreshTrigger={refreshTrigger} // Pass refresh trigger to DataTable
                customQueryParams={(params) => {
                  const apiParams = { ...params };

                  // Handle search
                  if (apiParams.search) {
                    apiParams.searchTerm = apiParams.search;
                    delete apiParams.search;
                  }

                  // Handle category filter
                  if (apiParams.category) {
                    // Map category ID to actual category name if needed
                    const categoryOption = eventCategories.find(
                        opt => opt._id === Number(apiParams.category)
                    );
                    if (categoryOption) {
                      apiParams.category = categoryOption?.name;
                    }
                  }

                  // Handle status
                  if (apiParams.status) {
                    apiParams.status = apiParams.status;
                  }

                  // Handle multiple statuses
                  if (apiParams.multipleStatus && apiParams.multipleStatus.includes(",")) {
                    apiParams.statuses = apiParams.multipleStatus.split(",");
                    delete apiParams.multipleStatus;
                    delete apiParams.status;
                  } else if (apiParams.status) {
                    delete apiParams.multipleStatus;
                  }

                  // Handle date range
                  if (apiParams.startingDate && apiParams.endingDate) {
                    apiParams.dateFrom = apiParams.startingDate;
                    apiParams.dateTo = apiParams.endingDate;
                    delete apiParams.startingDate;
                    delete apiParams.endingDate;
                  }

                  // Handle user name search
                  if (apiParams.userName) {
                    apiParams.userName = apiParams.userName;
                  }

                  // Remove UI-specific params
                  delete apiParams.activeTab;

                  return apiParams;
                }}
            />
          </div>

          {/* Render action menu */}
          {actionMenu}
        </div>

        {/* Add Review Modal */}
        <AddOrderReviewModal
            isOpen={isReviewModalOpen}
            onSubmit={handleReviewSubmit}
            onClose={() => setIsReviewModalOpen(false)}
            setIsOpen={setIsReviewModalOpen}
            title="Add Review"
            loading={isAddingReview}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
            isOpen={confirmation.isOpen}
            options={confirmation.options}
            onConfirm={confirm}
            onCancel={cancel}
        />
      </div>
  );
};

export default AllOrders;