console.log("YouTube Exact Upload Date: script running.");

// Get exact upload date from meta tag
function getExactDate() {
    const meta = document.querySelector('meta[itemprop="datePublished"]');
    if (!meta) return null;
    const isoDate = meta.getAttribute("content");
    if (!isoDate) return null;
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Try replacing any date-looking element on the watch page
function replaceVisibleDate() {
    const formatted = getExactDate() + "                                          ";
    if (!formatted) {
        console.log("No formatted date found.");
        return false;
    }

    const candidates = document.querySelectorAll('yt-formatted-string, span');
    for (let el of candidates) {
        if (el.textContent.match(/\byear|\bmonth|\bweek|\bday|\bhour|\bminute/i)) {
            el.textContent = formatted;
            console.log("Updated upload date:", formatted, "in element:", el);
            return true;
        }
    }

    console.log("No matching element to replace.");
    return false;
}

// Auto-run when the page loads
if (location.pathname.startsWith("/watch")) {
    const observer = new MutationObserver(() => {
        if (replaceVisibleDate()) {
            observer.disconnect();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
}

// // Manual re-run on click
// document.addEventListener("click", () => {
//     console.log("Manual re-check triggered by click.");
//     replaceVisibleDate();
// });
