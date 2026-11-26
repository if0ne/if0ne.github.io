const masthead = document.querySelector(".masthead");
const progress = masthead.querySelector("progress");
const article = document.querySelector("article");
const sections = Array.from(document.querySelectorAll(".contents a"), link => ({
  link,
  heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
})).filter(section => section.heading);

function updateReadingPosition() {
  const remaining = article.getBoundingClientRect().bottom - window.innerHeight;
  const distance = window.scrollY + remaining;
  progress.value = distance <= 0 ? 100 : Math.min(100, 100 * window.scrollY / distance);
  const readingLine = masthead.offsetHeight + 20;
  let current;
  for (const section of sections) {
    if (section.heading.getBoundingClientRect().top > readingLine && remaining > 0) break;
    current = section;
  }
  for (const section of sections) {
    if (section === current) section.link.setAttribute("aria-current", "location");
    else section.link.removeAttribute("aria-current");
  }
}
progress.hidden = false;
new ResizeObserver(() => {
  document.documentElement.style.setProperty("--masthead-height", masthead.offsetHeight + "px");
  updateReadingPosition();
}).observe(masthead);
window.addEventListener("scroll", updateReadingPosition, { passive: true });
window.addEventListener("resize", updateReadingPosition);
new ResizeObserver(updateReadingPosition).observe(document.querySelector("main"));
updateReadingPosition();
