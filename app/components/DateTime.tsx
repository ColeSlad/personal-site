"use client";

import { useEffect, useState } from "react";

export default function DateTime() {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).toLowerCase().replace(" ", "");
      setDisplay(`${date} ${time} NYC`);
    };

    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  return <p className="datetime">{display}</p>;
}
