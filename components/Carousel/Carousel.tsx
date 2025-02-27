import React from "react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import AgentPulse from "../AgentPulse";
import { Typewriter } from "react-simple-typewriter";
import YoutubeVideoForm from "../YoutubeVideoForm";

const Carousel: React.FC = () => {
  return (
    <div className="w-full h-screen relative">
      {" "}
      <Swiper
        className="w-full h-full"
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
      >
        <SwiperSlide className="relative w-full h-full">
          <Image
            src={"/images/carousel/carousel-03.jpg"}
            alt="carousel"
            layout="fill"
            objectFit="cover"
            priority
          />
        </SwiperSlide>
        <SwiperSlide className="relative w-full h-full">
          <Image
            src={"/images/carousel/carousel-02.jpg"}
            alt="carousel"
            layout="fill"
            objectFit="cover"
            priority
          />
        </SwiperSlide>
        <SwiperSlide className="relative w-full h-full">
          <Image
            src={"/images/carousel/carousel-01.jpg"}
            alt="carousel"
            layout="fill"
            objectFit="cover"
            priority
          />
        </SwiperSlide>
      </Swiper>
      {/* Navigation Buttons */}
      {/* Text Section */}
      <div className="absolute z-100 inset-0 flex items-center justify-center bg-black/50">
        <div className="text-white text-center px-6 flex flex-col items-center">
          <AgentPulse size="large" color="blue" />
          <h1 className="text-5xl md:text-6xl my-7 font-bold">
            Meet Your Personal
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              <Typewriter
                words={[
                  "AI Content Agent",
                  "Writing Assistant",
                  "Creative Partner",
                  "Automation Expert",
                ]}
                loop={true}
                cursor
              />
              
            </span>
          </h1>

          <p className="text-2xl md:text-xl mb-8 mx-auto max-w-2xl text-amber-100 dark:text-white">
            Transform your video content with AI-Powered analysis. <br />
            <b>Write better with AI. Create content faster with AI.</b>
          </p>

          {/* Youtube Video Form */}
          <YoutubeVideoForm />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
