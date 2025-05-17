import Navbar from "@/components/customs/navbar";
import React from "react";

const DownloadsPage = () => {
  return (
    <div className="dark relative bg-[#1F1F1F] text-[#D1CFC0] min-h-screen flex flex-col items-center">
      <div className="z-10 w-full">
        <Navbar />
      </div>
      <div className="w-full px-4 sm:px-6 h-[80vh] flex flex-col items-center justify-center">
        <div className="title relative px-4 sm:px-12 text-center !font-normal text-4xl sm:text-5xl md:text-6xl">
          <div className="flex relative items-center justify-center">
            {"SOON "}
            <span className="text-[#F76F53] italic pl-1"> ...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;
