// ---------- Feature 1 (compulsory): contact form validation and preview ----------
const form = document.getElementById("contact-form");
const preview = document.getElementById("preview");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shows or clears an error message beside a field.
function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  document.getElementById(fieldId + "-error").textContent = message;
  field.classList.toggle("invalid", message !== "");
  field.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

// Checks name, email and message; returns true only when all are valid.
function validateForm() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let ok = true;

  setError("name", name === "" ? "Enter your name (spaces alone are not accepted)." : "");
  setError("email", !emailPattern.test(email) ? "Enter an email like name@example.com." : "");
  setError("message", message === "" ? "Enter a message (spaces alone are not accepted)." : "");

  if (name === "" || !emailPattern.test(email) || message === "") ok = false;
  return ok;
}

// Builds the preview using textContent so user text is never run as HTML.
function showPreview() {
  const fields = [
    ["Name", form.name.value.trim()],
    ["Email", form.email.value.trim()],
    ["Topic", form.topic.options[form.topic.selectedIndex].text],
    ["Message", form.message.value.trim()]
  ];
  preview.replaceChildren();
  const heading = document.createElement("p");
  heading.textContent = "Your details were validated. Nothing was sent.";
  heading.style.fontWeight = "600";
  preview.appendChild(heading);
  fields.forEach(([label, value]) => {
    const line = document.createElement("p");
    line.textContent = label + ": " + value;
    preview.appendChild(line);
  });
  preview.hidden = false;
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); // keep everything local
  if (validateForm()) {
    showPreview();
  } else {
    preview.hidden = true;
    const firstBad = form.querySelector(".invalid");
    if (firstBad) firstBad.focus();
  }
});

// ---------- Feature 2: expandable project details ----------
// Opens or closes a project's details and updates the button text and aria-expanded.
function toggleDetails(button) {
  const panel = document.getElementById(button.getAttribute("aria-controls"));
  const willOpen = button.getAttribute("aria-expanded") === "false";
  button.setAttribute("aria-expanded", String(willOpen));
  button.textContent = willOpen ? "Hide details" : "Show details";
  panel.hidden = !willOpen;
}
document.querySelectorAll(".toggle").forEach((btn) => {
  btn.addEventListener("click", () => toggleDetails(btn));
});

// ---------- Feature 3: study hours calculator ----------
const hoursForm = document.getElementById("hours-form");
const hoursResult = document.getElementById("hours-result");

// Validates hours per day and days per week, then shows the weekly total.
function calculateHours(event) {
  event.preventDefault();
  const hoursText = document.getElementById("hpd").value.trim();
  const daysText = document.getElementById("dpw").value.trim();
  const hours = Number(hoursText);
  const days = Number(daysText);
  let error = "";

  if (hoursText === "" || daysText === "") error = "Enter both hours per day and days per week.";
  else if (Number.isNaN(hours) || Number.isNaN(days)) error = "Use numbers only.";
  else if (hours < 0) error = "Hours cannot be negative.";
  else if (hours > 24) error = "Hours per day cannot be more than 24.";
  else if (!Number.isInteger(days) || days < 1 || days > 7) error = "Days per week must be a whole number from 1 to 7.";

  hoursResult.classList.toggle("bad", error !== "");
  hoursResult.textContent = error || "You plan to study " + (hours * days) + " hours per week.";
}
hoursForm.addEventListener("submit", calculateHours);

// ---------- Navigation: underline the link for the section being viewed ----------
const navLinks = document.querySelectorAll("nav a");
// Marks the nav link whose section is currently in view.
function markActive(id) {
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
}
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) markActive(e.target.id); });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach((sec) => observer.observe(sec));
}

// ---------- Editable data: learning plan (change the numbers here only) ----------
const learningPlan = [
  { topic: "HTML structure", task: "Rebuild this page's sections from scratch", done: 10, total: 20, status: "In Progress" },
  { topic: "CSS layout", task: "Style the photo gallery and nav bar", done: 8, total: 20, status: "In Progress" },
  { topic: "Forms and tables", task: "Build a small contact form with validation", done: 0, total: 15, status: "Not Started" }
];

// Builds the learning table rows (Area, Focus, Status) from the learningPlan array.
function renderLearningPlan() {
  const body = document.getElementById("learning-body");
  learningPlan.forEach((item) => {
    const row = body.insertRow();
    row.insertCell().textContent = item.topic;
    row.insertCell().textContent = item.task;
    const badge = document.createElement("span");
    badge.className = "badge" + (item.status === "Completed" ? " done" : item.status === "Not Started" ? " todo" : "");
    badge.textContent = item.status;
    row.insertCell().appendChild(badge);
  });
}
renderLearningPlan();

// ---------- Feature 4: mobile navigation menu ----------
const navToggle = document.getElementById("nav-toggle");
const navList = document.getElementById("nav-list");
// Opens or closes the menu on narrow screens and updates aria-expanded.
function setMenu(open) {
  navList.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
}
navToggle.addEventListener("click", () => setMenu(!navList.classList.contains("open")));
navList.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });

// ---------- Gallery lightbox with Previous / Next ----------
const shots = Array.from(document.querySelectorAll("#photos figure"));
const box = document.getElementById("lightbox");
let current = 0;
// Shows photo number i (wraps at both ends) with its caption.
function showPhoto(i) {
  current = (i + shots.length) % shots.length;
  const img = shots[current].querySelector("img");
  document.getElementById("lb-img").src = img.src;
  document.getElementById("lb-img").alt = img.alt;
  document.getElementById("lb-cap").textContent = shots[current].querySelector("figcaption").textContent;
}
shots.forEach((fig, i) => {
  const img = fig.querySelector("img");
  const open = () => { showPhoto(i); box.showModal(); };
  img.addEventListener("click", open);
  img.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
});
document.getElementById("lb-prev").addEventListener("click", () => showPhoto(current - 1));
document.getElementById("lb-next").addEventListener("click", () => showPhoto(current + 1));
document.getElementById("lb-close").addEventListener("click", () => box.close());
box.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
});

// Footer year is filled in automatically.
document.getElementById("year").textContent = new Date().getFullYear();