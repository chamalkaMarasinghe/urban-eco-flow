import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ServerErrorImgHQ from "../assets/images/Error_500HQ.webp";
import ServerErrorImgLQ from "../assets/images/Error_500LQ.webp";

export default function InternalServerErrorPage() {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <>
            <title>Internal Server Error</title>
            <div className="flex flex-col-reverse items-center justify-center w-full min-h-screen px-12 py-10 bg-white md:flex-row gap-y-8 md:px-20">
                {/* Text Section md:w-[380px] */}
                <div className="font-roboto text-left w-full md:w-[380px] flex flex-col justify-between">
                    <div className="text-[20px] sm:text-[48px] md:text-[64px] w-full md:w-[318px] leading-tight text-[#000000] mb-4 text-center md:text-left">
                        <p>Whoops! that Page is Gone.</p>
                    </div>
                    <p className="text-[14px] sm:text-[16px] text-[#2B2B2B] leading-tight text-center md:text-justify">
                        The link you clicked may be broken or the page may have been removed.
                        Get back to the{' '}
                        <a href="/" className="text-[#E31919] hover:underline">home page</a>.
                    </p>
                </div>

                <div className="w-full md:w-[784px] flex flex-col items-center">
                    <div
                        className={twMerge(
                            "relative w-full aspect-[984/600]",
                            imageLoaded ? "bg-transparent" : "bg-gray-300 animate-pulse"
                        )}
                    >
                        <LazyLoadImage
                            src={ServerErrorImgHQ}
                            placeholderSrc={ServerErrorImgLQ}
                            alt="500 Internal Server Error"
                            className="object-contain w-full h-full" // Fill the container
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>
                    <p className="text-center font-roboto font-semibold text-[14px] sm:text-[16px] mt-2">
                        ERROR - INTERNAL SERVER ERROR!
                    </p>
                </div>
                {/*/!* Image Section md:w-[784px] *!/*/}
                {/*<div className="w-full md:w-[784px]">*/}
                {/*    <div*/}
                {/*        className={twMerge(*/}
                {/*            "relative w-full h-auto",*/}
                {/*            imageLoaded ? "bg-transparent" : "bg-gray-300 animate-pulse"*/}
                {/*        )}*/}
                {/*    >*/}
                {/*        <LazyLoadImage*/}
                {/*            src={ServerErrorImg}*/}
                {/*            placeholderSrc={ServerErrorImg}*/}
                {/*            alt="500 Internal Server Error"*/}
                {/*            className="object-fill w-full h-auto"*/}
                {/*            effect="blur"*/}
                {/*            onLoad={() => setImageLoaded(true)}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <p className="text-center font-roboto font-semibold text-[14px] sm:text-[16px] mt-2">*/}
                {/*        ERROR - INTERNAL SERVER ERROR!*/}
                {/*    </p>*/}
                {/*</div>*/}
            </div>
        </>
    );
}