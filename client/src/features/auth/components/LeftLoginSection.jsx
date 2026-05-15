import React from "react";
import IMLogo from "../../../assets/images/IM-Logo.png";
import IM_Cover from "../../../assets/images/IM_Cover.png";

const LeftLoginSection = () => {
  return (
    <div className="w-3/5 h-full items-center flex flex-col pt-10">
      <div className="w-full h-20 flex items-center justify-start px-10">
        <img src={IMLogo} alt="" className="h-full w-auto object-contain" />
      </div>
      <div className="w-full h-[calc(100%-5rem)] pt-2.5 flex-1 flex flex-col">
        <div className="flex flex-col items-center w-full">
          <div
            style={{
              fontFamily: "'Playwrite NZ Basic', serif",
              fontSize: "2.8vw",
              color: "#F1F4F7",
            }}
          >
            See everyday moments from your
          </div>
          <div
            style={{
              fontFamily: "'Playwrite NZ Basic', serif",
              backgroundImage:
                "linear-gradient(to right, #ff5c00, #ff0069, #d300c5)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontSize: "2.8vw",
              fontWeight: 500,
            }}
          >
            close friends
          </div>
        </div>
        <div className="flex items-center h-full justify-center w-full mt-6">
          <img
            src={IM_Cover}
            alt=""
            className="max-h-96 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LeftLoginSection;
