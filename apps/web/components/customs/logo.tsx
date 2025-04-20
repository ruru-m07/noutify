import Image from "next/image";
import React from "react";

const Logo = ({ size = 40 }: { size?: number }) => {
  return (
    <>
      <Image
        src={"/assets/logo_dark.svg"}
        alt="catra logo dark"
        width={size}
        height={size}
        className="dark:block hidden"
      />
      <Image
        src={"/assets/logo_light.svg"}
        alt="catra logo light"
        width={size}
        height={size}
        className="dark:hidden block"
      />
    </>
  );
};

export default Logo;
