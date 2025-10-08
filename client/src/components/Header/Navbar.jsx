import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import CustomButton from "../Reusable/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { getClientProfile, logout, openSignInModal } from "../../store";
import { useLanguage } from "../../context/language/language";
// Import assets
// import Logo from "../../assets/logo.png";
import ChatIcon from "../pagesSpecific/thread/MyChat"
import ProfileImage from "../Reusable/ProfileImage";
import { twMerge } from "tailwind-merge";
import "react-lazy-load-image-component/src/effects/blur.css";
import { CONFIGURATIONS } from "../../config/envConfig";
import { LANGUAGE } from "../../constants/commonConstants";
import Logo from "../../assets/icons/Logo3.png";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // const {language} = useLanguage();

  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileProfileDropdownOpen, setIsMobileProfileDropdownOpen] =
    useState(false);
  const { isAuthenticated, user, role, availableRoles } = useSelector(
    (state) => state.auth
  );
  const [userRole, setUserRole] = useState("client"); // "client" or "serviceProvider"
  const [loadedLogo, setLoadedLogo] = useState(false);

  // Refs for click outside detection
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const mobileProfileCardRef = useRef(null);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu when clicking outside
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      // Close profile dropdown when clicking outside
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }

      // Close mobile profile dropdown when clicking outside
      if (
        isMobileProfileDropdownOpen &&
        mobileProfileCardRef.current &&
        !mobileProfileCardRef.current.contains(event.target)
      ) {
        setIsMobileProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isDropdownOpen, isMobileProfileDropdownOpen]);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  // Style constants
  const STYLES = {
    link: "font-roboto font-medium text-[16px] leading-[100%] tracking-[0%] text-[#022B3A] transition-colors duration-300 hover:text-primary",
    activeLink:
      "font-roboto font-medium text-[16px] leading-[100%] tracking-[0%] text-primary",
    buttonBase:
      "rounded-[12px] font-roboto text-[16px] leading-[100%] transition-all duration-300 h-[43px]",
  };

  // Navigation links configuration
  const NAV_LINKS = [
    { path: "/", label: "Home" },
    { path: "/devices", label: "Devices" },
    { path: "/my-production", label: "My Production" },
  ];

  // Profile dropdown links configuration
  const getProfileLinks = (isMobile = false) => {
    let links = [
      { path: "/user-profile", label: "My Profile" },
      { path: "/", label: "Logout" },
    ];

    // Add My Wishlist link only for mobile view
    if (isMobile) {
      links = [
        { path: "/user-profile", label: "My Profile" },
        { path: "/my-wishlists", label: "Wish List" },
        //TO-DO : missing my chat value
        { path: "/chat", label: "My Chat", isChat: true },
        { path: "/signin", label: "Logout" },
      ];
    }

    const roleSpecificLink =
      userRole === "client"
        ? { path: "/all-orders", label: "My Orders" }
        : { path: "/my-events", label: "My Events" };

    return [roleSpecificLink, ...links];
  };

  // Button configurations
  const buttonProps = {
    login: {
      //no direct language object
      buttonText: "Sign In/Sign Up",
      bgColor: "bg-transparent",
      textColor: "text-primary",
      textWeight: "font-medium",
      className: `${STYLES.buttonBase} border border-primary pt-[12px] pb-[12px]`,
    },
    addBusiness: {
      buttonText: "Add Your Business",
      bgColor: "bg-[#FFF7ED]",
      textColor: "text-user-orange",
      borderColor: "border-user-orange",
      textWeight: "font-medium",
      className: `${STYLES.buttonBase} hover:bg-[#FFF7ED] hover:border hover:border-user-orange hover:text-user-orange pt-[12px] pb-[12px]`,
    },
  };

  // Toggle handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileProfileDropdown = () =>
    setIsMobileProfileDropdownOpen(!isMobileProfileDropdownOpen);

  return (
    <nav className="h-[67px] w-full inset-0 z-[99] fixed bg-[#FFFEFC] backdrop-blur-[64px] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.08)]">
      <div className="relative w-full h-full mx-auto px-[10px] sm:px-[25px] md:px-[40px] lg:px-[60px] max-w-[1700px]">
        <div className="relative flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="relative z-50 flex items-center">
              {/* <img
                src={Logo}
                alt="Kidsplan Logo"
                className="w-[100px] h-[54px] sm:w-[124px] sm:h-[67px]"
              /> */}

              <div
                className={twMerge(
                  "w-[100px] h-[54px] sm:w-[124px] sm:h-[67px] relative",
                  // loadedLogo ? "bg-transparent" : "bg-gray-300 animate-pulse"
                )}
              >
                <img
                  src={Logo}
                  placeholderSrc={Logo}
                  alt="location pin"
                  className="absolute inset-0 object-cover w-full h-full rounded-[12px]"
                  effect="blur"
                  onLoad={() => {
                    setLoadedLogo(true);
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            className="relative z-50 p-2 text-xl text-gray-800 lg:hidden sm:text-2xl focus:outline-none"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Navigation Links */}
          <div className="items-center hidden w-full lg:flex">
            {/* <div className="flex-1 hidden custom-w-br-1180:block"></div> */}

            {/* Navigation links */}
            {/* {isAuthenticated && ( */}
            {/* <div className="flex items-center gap-4 ml-auto mr-6 bg-red-600 xl:gap-6 custom-w-br-1180:flex-shrink-0 custom-w-br-1180:ml-0 custom-w-br-1180:mr-0"> */}
            <div className={
              twMerge(
                `flex items-center justify-end gap-4 xl:gap-6 w-full ml-auto mr-6`
              )}>
              {NAV_LINKS.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={isActive(path) ? STYLES.activeLink : STYLES.link}
                >
                  {label}
                </Link>
              ))}
            </div>
            {/* )} */}

            {/* <div className={twMerge(isAuthenticated ? "hidden custom-w-br-1180:block flex-1" : "hidden custom-w-br-1366:block flex-1")}></div> */}

            {/* Desktop Right Buttons */}
            <div className={twMerge(isAuthenticated ? "flex items-center gap-1 flex-shrink-0 custom-w-br-1180:ml-6" : "flex items-center gap-1 flex-shrink-0 custom-w-br-1366:ml-6")}>
              {/* Language Selector */}
              {/* <LanguageSelector /> */}

              {isAuthenticated ? (
                /* Authenticated User UI */
                <div className="flex items-center gap-1">
                  {/* Wishlist icon*/}

                  {/* Chat Icon */}
                  <ChatIcon viewType="desktop" />

                  {/* Avatar with Dropdown */}
                  <div className="relative">
                    <button
                      ref={avatarRef}
                      onClick={toggleDropdown}
                      aria-label="Open profile menu"
                      aria-expanded={isDropdownOpen}
                      className="flex items-center gap-1 focus:outline-none w-[43px] h-[43px] rounded-full overflow-hidden"
                    >
                      {/*<img*/}
                      {/*  src={ProfilePic}*/}
                      {/*  alt="Profile"*/}
                      {/*  className="w-[43px] h-[43px] flex items-center justify-center rounded-full object-cover"*/}
                      {/*/>*/}

                      <ProfileImage
                        profilePicture={user?.profilePicture}
                        firstName={user?.firstName || ""}
                        lastName={user?.lastName || ""}
                        fontSize={"16px"}
                        avatarSize={10}
                        loading={false}
                        backgroundColor={"#F65F18"}
                        className="w-[33px] h-[33px] flex items-center justify-center rounded-full object-cover"
                      />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 px-2 py-2 w-[180px] bg-white rounded-[12px] border border-[#E6E7EC] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] flex flex-col gap-1 z-50 overflow-hidden"
                      >
                        {getProfileLinks(false).map(({ path, label }) => (
                          <Link
                            key={path}
                            to={path}
                            className="px-4 py-3 text-[16px] font-roboto text-[#334155] hover:bg-gray-100 rounded-md hover:text-user-orange transition-colors duration-200"
                            onClick={() => {
                              setIsDropdownOpen(false);
                              if (label === "Logout") {
                                dispatch(logout());
                              }
                            }}
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Guest User UI */
                <CustomButton
                  {...buttonProps.login}
                  width="w-auto"
                  className={`${buttonProps.login.className} px-4 xl:px-6`}
                  onClick={() => {
                    dispatch(openSignInModal());
                  }}
                />
                // <span></span>
              )}
      
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          ref={menuRef}
          className={`
            fixed lg:hidden inset-0 top-[67px] bg-[#FFFEFC] backdrop-blur-[64px] shadow-[0px_4px_64px_0px_rgba(0,0,0,0.08)]
            transition-all duration-300 ease-in-out overflow-hidden 
            ${
              isMenuOpen
                ? "opacity-100 visible h-[calc(100vh-67px)]"
                : "opacity-0 invisible h-0"
            }
            flex flex-col items-center justify-start
            pt-8 pb-12 px-6 sm:px-10
            border-t border-gray-200 z-40
          `}
          aria-hidden={!isMenuOpen}
        >
          {/* Mobile Navigation Links */}
          <div className="flex flex-col w-full gap-8 mb-8 text-left">
            {NAV_LINKS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={isActive(path) ? STYLES.activeLink : STYLES.link}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {/* Navigation links */}
            {isAuthenticated && (
              <>
                {/* {NAV_LINKS.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={isActive(path) ? STYLES.activeLink : STYLES.link}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))} */}

                {/* User Profile Menu Item */}
                <div ref={mobileProfileCardRef} className={STYLES.link}>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={toggleMobileProfileDropdown}
                    role="button"
                    aria-expanded={isMobileProfileDropdownOpen}
                    tabIndex={0}
                  >
                    {/*<img*/}
                    {/*  src={ProfilePic}*/}
                    {/*  alt="Profile"*/}
                    {/*  className="object-cover w-8 h-8 mr-3 rounded-full"*/}
                    {/*/>*/}
                    <div className="object-cover w-8 h-8 mr-3 rounded-full">
                      <ProfileImage
                        profilePicture={user?.profilePicture}
                        firstName={user?.firstName || ""}
                        lastName={user?.lastName || ""}
                        fontSize={"14px"}
                        loading={false}
                        backgroundColor={"#F65F18"}
                      />
                    </div>
                  {/* ToDo:Missing "Me" Value */}
                    <span>Me</span>
                    <div className="ml-2">
                      {isMobileProfileDropdownOpen ? (
                        <FaChevronUp className="text-[#64748B] text-xs" />
                      ) : (
                        <FaChevronDown className="text-[#64748B] text-xs" />
                      )}
                    </div>
                  </div>

                  {/* Profile Dropdown Items */}
                  <div
                    className={`
                     ml-[43px] flex flex-col gap-6 overflow-hidden transition-all duration-300
                    ${
                      isMobileProfileDropdownOpen
                        ? "mt-4 max-h-[300px] opacity-100"
                        : "max-h-0 opacity-0"
                    }
                  `}
                  >
                    {getProfileLinks(true).map(({ path, label, isChat }) =>
                      isChat ? (
                        <ChatIcon key={path} viewType="dropdown" className="" />
                      ) : (
                        <Link
                          key={path}
                          to={path}
                          className={STYLES.link}
                          onClick={() => {
                            setIsMobileProfileDropdownOpen(false);
                            setIsMenuOpen(false);
                            if (label === "Logout") {
                              dispatch(logout());
                            }
                          }}
                        >
                          {label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            <div className={isAuthenticated ? "mt-0" : "mt-0"}>
              {/* Language selector */}
              {/* <LanguageSelector viewType={"mobile"} /> */}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex flex-col w-full max-w-xs gap-4 mt-auto sm:max-w-md">
            {!isAuthenticated && (
              <CustomButton
                {...buttonProps.login}
                width="w-auto"
                className={`${buttonProps.login.className} px-4 xl:px-6`}
                onClick={() => {
                  dispatch(openSignInModal());
                }}
              />
            )}
 
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;