"use client";

import { useEffect, useState } from "react";

/** Shows today's date in Dubai time. Rendered on the client so a static page never shows a stale date. */
export default function TodayDate() {
  const [text, setText] = useState("");
  useEffect(() => {
    setText(
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dubai",
      })
    );
  }, []);
  return <span className="today" suppressHydrationWarning>{text || " "}</span>;
}
