/** Today's date in Dubai time. The build date is shown first; public/site.js updates it in the browser. */
export default function TodayDate() {
  const text = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" });
  return (
    <span className="today" data-today>
      {text}
    </span>
  );
}
