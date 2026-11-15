/* TheJobSeek: the only JavaScript on news pages (about 1 KB). */
(function () {
  // The /search/ page still runs React; leave its markup alone so it can hydrate cleanly.
  // Today's date in Dubai time. The static HTML carries no date (it would go stale in caches); it is written here.
  function today() {
    try {
      var d = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" });
      document.querySelectorAll("[data-today]").forEach(function (el) { el.textContent = d; });
    } catch (e) {}
  }
  // The /search/ page still runs React: wait until it has taken over the markup before changing it.
  if (!self.__next_f) today();
  else window.addEventListener("load", function () { setTimeout(today, 1500); });

  // Highlight the current section in the menu
  var path = location.pathname;
  document.querySelectorAll("a[data-nav]").forEach(function (a) {
    var h = a.getAttribute("href");
    if (h === "/" ? path === "/" : path.indexOf(h) === 0) { a.classList.add("active"); a.setAttribute("aria-current", "page"); }
  });

  // "Copy link" buttons
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(b.getAttribute("data-copy")).then(function () {
        var t = b.textContent; b.textContent = "Link copied";
        setTimeout(function () { b.textContent = t; }, 2000);
      });
    });
  });

  // AdSense units (only when ads are enabled)
  var ads = document.querySelectorAll("ins.adsbygoogle:not([data-adsbygoogle-status])");
  if (ads.length) {
    window.adsbygoogle = window.adsbygoogle || [];
    ads.forEach(function () { try { window.adsbygoogle.push({}); } catch (e) {} });
  }
})();
