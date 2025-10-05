import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import FooterLogo from "../../assets/icons/Logo3.png";
import { useLanguage } from "../../context/language/language";

// Import Social Icons
import facebookIcon from "../../assets/icons/facebook.svg";
import instagramIcon from "../../assets/icons/instagram.svg";
import twitterIcon from "../../assets/svgs/twitter.svg";
import { useSelector } from "react-redux";
import { roles } from "../../constants/commonConstants";
import phoneIcon from "../../assets/icons/phone.svg";
import emailIcon from "../../assets/icons/email.svg";
import { CONFIGURATIONS } from "../../config/envConfig";

const Footer = () => {
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Image loading states
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [socialIconsLoaded, setSocialIconsLoaded] = useState({});
  const [reachUsIconsLoaded, setReachUsIconsLoaded] = useState({});
  const {language} = useLanguage();

  const currentYear = new Date().getFullYear();

  const handleNavigation = (link) => {
    // Check if the link is external
    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.open(link, "_blank");
    } else {
      navigate(link);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };



  const socialIcons = [
    {
      icon: facebookIcon,
      alt: "facebook",
      link: "https://www.facebook.com/share/1EP2UyRvUZ/?mibextid=wwXIfr",
    },
    {
      icon: twitterIcon,
      alt: "twitter",
      link: "https://x.com",
    },
    {
      icon: instagramIcon,
      alt: "instagram",
      link: "https://www.instagram.com",
    },
  ];

  return (
      <footer
          style={{ backgroundColor: "var(--footer-theme)", width: "100%" }}
          className="px-[40px] md:px-[60px] lg:px-[120px] pt-3 min-h-[300px]"
      >
        <div className="flex flex-col pt-3 pb-1">
          {/* Top Section */}
          

          {/* Divider */}
          <div className="w-full h-[1px] mt-5 bg-[#CBD5E0] my-1" />

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-center gap-3 px-0 md:flex-row md:gap-0"
               style={{
                 minHeight: "25px",
                 alignItems: "center",
                 marginBottom: "0px",
                 paddingBottom: "0px"
               }}
          >
            <p className="mb-0 text-sm font-medium text-center text-white opacity-70 font-inter md:text-left">
               © 2025 kidsplan. All rights reserved.
          </p>

       
          </div>
        </div>
      </footer>
  );
};

export default Footer;