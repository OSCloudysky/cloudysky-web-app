import React, { useCallback, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

type Props = {
  children: any;
  href: string;
};

export default function LinkPreview({ children, href }: Props) {
  let [imagePreview, setImagePreview] = React.useState("");
  let [isHovering, setIsHovering] = React.useState(false);
  let inLink = false;

  let handleMouseEnterLink = () => {
    inLink = true;
    setIsHovering(true);
  };

  let handleMouseLeaveLink = () => {
    inLink = false;
    setIsHovering(false);
  };

  let handleFetchImage = useCallback(async (url: string) => {
    const res = await fetch(`/api/link-preview?url=${url}`);
    const data = await res.json();
    setImagePreview(data.image);
  }, []);

  useEffect(() => {
    handleFetchImage(href);
  }, []);

  return (
    <span>
      <span className="relative z-10 hidden md:inline-block">
        {/* Link itself */}
        <Link
          href={href}
          className={`${isHovering && "underline"}`}
          onMouseEnter={handleMouseEnterLink}
          onMouseLeave={handleMouseLeaveLink}
          onFocus={handleMouseEnterLink}
          onBlur={handleMouseLeaveLink}
        >
          {children}
        </Link>

        {/* Image Preview */}
        {isHovering && (
          <Link href={href} passHref>
            <span className="w-56 h-44 absolute top-[-255px] left-1/2 transform -translate-x-[7rem] translate-y-8 flex items-start justify-center">
              {imagePreview ? (
                <Image
                  fill
                  className="object-cover object-top w-56 h-40 bg-white rounded-md shadow-lg hover:ring-4 hover:ring-emerald-400"
                  src={imagePreview}
                  alt={children}
                />
              ) : (
                <span className="flex items-center justify-center w-56 h-40 bg-white rounded-md shadow-lg">
                  Loading...
                </span>
              )}
            </span>
          </Link>
        )}
      </span>

      {/* For mobile devices */}
      <a href={href} className={`${isHovering && "underline"} md:hidden`}>
        {children}
      </a>
    </span>
  );
}