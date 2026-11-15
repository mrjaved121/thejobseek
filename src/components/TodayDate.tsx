/**
 * Today's date in Dubai time. Left empty in the static HTML on purpose: pages are built once and cached,
 * so a date written at build time goes stale. public/site.js fills it in the reader's browser.
 */
export default function TodayDate() {
  return <span className="today" data-today suppressHydrationWarning />;
}
