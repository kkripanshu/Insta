import React from "react";
import InstaIcon from "../../../assets/icons/InstaIcon.svg";
import NavigationBar from "./NavigationBar";
import '../../../styles/index.css';

const Feed = () => {
  return (
    <div className="w-full h-full overflow-scroll bg-[#0c1014] flex flex-row p-4" style={{
      scrollbarWidth: 'none'
    }}>
      <div className="flex flex-col py-2 w-auto">
        <div className="w-8 h-8 flex justify-center items-center">
          <img src={InstaIcon} alt="" />
        </div>
        <div className="flex flex-col gap-4 h-8 w-auto pt-10">
          <NavigationBar />
        </div>
      </div>
      <div className="flex"></div>
      <div></div>
    </div>
  );
};

export default Feed;
