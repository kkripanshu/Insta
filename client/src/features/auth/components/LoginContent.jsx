import React from "react";
import LeftLoginSection from "./LeftLoginSection";
import RightLoginSection from "./RightLoginSection";

const LoginContent = () => {
  return (
    <div className="w-full h-full flex flex-row">
      <LeftLoginSection />
      <RightLoginSection />
    </div>
  );
};

export default LoginContent;
