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
    const { language } = useLanguage();

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

    const menuItems1 = [
        { text: "about", link: "/about-us" },
        { text: "contactUs", link: "/contact-us" },
        { text: "termsAndConditions", link: "/terms-and-condition" },
        { text: "privacyPolicy", link: "/privacy-policies" },
        // { text: "FAQ", link: role === roles.USER ? "/client" : "/service-pro" },
    ];

    const menuItems2 = [
        {
            text: "Host",
            link: `${CONFIGURATIONS.SERVICE_PROVIDER}`,
            external: true,
        },
        {
            text: "Browse",
            link: "/events",
        },
    ];

    const menuItems3 = [
        { text: "+48 507 256 612", icon: phoneIcon },
        { text: "contact@urbanecoflow.com", icon: emailIcon },
    ];

    return (
        <footer
            style={{ backgroundColor: "var(--footer-theme)", width: "100%" }}
            className="px-[10px] sm:px-[25px] md:px-[40px] lg:px-[60px] pt-3"
        >
            <div className="flex flex-col pt-3 pb-1">
                {/* Top Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center">
                    {/* Navigation Menu */}
                    <div className="flex flex-col xl:pl-0 w-full">
                        {/* Logo */}
                        <div
                            className="flex flex-col sm:flex-row w-full items-center sm:justify-between h-[79.96px] cursor-pointer -translate-y-6"
                            onClick={() => handleNavigation("/")}
                        >
                            <div
                                className={twMerge(
                                    "relative w-[148px] h-[79.96px]",
                                    logoLoaded
                                        ? "bg-transparent"
                                        : "bg-gray-300 animate-pulse"
                                )}
                            >
                                <LazyLoadImage
                                    src={FooterLogo}
                                    placeholderSrc={FooterLogo}
                                    alt="kidsplan Logo"
                                    className="w-full h-auto"
                                    effect="blur"
                                    onLoad={() => setLogoLoaded(true)}
                                />
                            </div>
                            <div className="flex gap-7 max-sm:mt-2 text-white font-[600]">
                              <div>Home</div>
                              <div>Devices</div>
                              <div>My Production</div>
                            </div>
                        </div>
                        <div className="flex max-sm:justify-center max-sm:mt-7 w-full">
                            <h1 className="font-inter text-[14px] text-white max-w-[340px] text-center">
                                Smart waste management for a greener tomorrow.
                            </h1>
                        </div>
                        {/* Social Icons */}
                        {/* <div className="flex gap-4 -translate-x-2 -translate-y-4">
                            {socialIcons.map((social, index) => (
                                <a key={index}>
                                    <div
                                        className={twMerge(
                                            "relative w-6 h-6",
                                            socialIconsLoaded[index]
                                                ? "bg-transparent"
                                                : "bg-gray-300 animate-pulse rounded-full"
                                        )}
                                    >
                                        <LazyLoadImage
                                            src={social.icon}
                                            placeholderSrc={social.icon}
                                            alt={social.alt}
                                            className="w-6 h-6 cursor-pointer hover:opacity-80"
                                            effect="blur"
                                            onLoad={() => {
                                                setSocialIconsLoaded(
                                                    (prev) => ({
                                                        ...prev,
                                                        [index]: true,
                                                    })
                                                );
                                            }}
                                        />
                                    </div>
                                </a>
                            ))}
                        </div> */}
                    </div>
                </div>

                <div className="fle flex-col mt-5">
                    {/* Divider */}
                    <div className="w-full h-[1px] mb-5 bg-[#CBD5E0] my-1" />

                    {/* Bottom Section */}
                    <div
                        className="flex flex-col sm:flex-row justify-between items-start md:gap-0 px-0 pt-3"
                        style={{
                            minHeight: "25px",
                            alignItems: "center",
                            marginBottom: "0px",
                            paddingBottom: "0px",
                        }}
                    >
                        <div className="text-white opacity-70 font-inter font-medium text-sm text-center md:text-left mb-3">
                            Urbanecoflow @ 2025. All right reserved
                        </div>
                        <div>
                            <div className="flex gap-4">
                                {socialIcons.map((social, index) => (
                                    <a key={index}>
                                        <div
                                            className={twMerge(
                                                "relative w-6 h-6",
                                                socialIconsLoaded[index]
                                                    ? "bg-transparent"
                                                    : "bg-gray-300 animate-pulse rounded-full"
                                            )}
                                        >
                                            <LazyLoadImage
                                                src={social.icon}
                                                placeholderSrc={social.icon}
                                                alt={social.alt}
                                                className="w-6 h-6 cursor-pointer hover:opacity-80"
                                                effect="blur"
                                                onLoad={() => {
                                                    setSocialIconsLoaded(
                                                        (prev) => ({
                                                            ...prev,
                                                            [index]: true,
                                                        })
                                                    );
                                                }}
                                            />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
