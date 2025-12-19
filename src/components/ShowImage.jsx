"use client";

import Image from "next/image";
import React, { useState } from "react";

const ShowImage = ({ imageUrl }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="text-sm text-blue-600 underline"
      >
        Show Image
      </button>

      {show && (
        <div
          onClick={() => setShow(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-325 h-150 bg-white rounded-lg"
          >
            <Image
              src={imageUrl}
              alt="Report Image"
              fill
              className="object-contain rounded-lg"
              sizes="1300px"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ShowImage;
