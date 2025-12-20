import React from "react";

const KomponenTanggal = ({ value }) => {
  return (
    <span className="font-semibold">
      {new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
};

export default KomponenTanggal;
