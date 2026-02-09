/*
  Small vanilla JS
  - smooth scroll (1000ms)
  - service details modal with pricing
  - payment demo overlay (non-functional)
*/

const servicesData = {
  laundry: {
    title: "Laundry Service",
    desc: "Full-service laundry: sorting, washing, drying, folding and light ironing. Suitable for clothing and linens.",
    prices: [
      { tier: "Basic", price: "₦1,000", note: "Per kg - standard wash" },
      { tier: "Standard", price: "₦1,500", note: "Per kg - includes drying" },
      { tier: "Premium", price: "₦2,000", note: "Per kg - express + ironing" }
    ]
  },
  assignment: {
    title: "Assignment Assistance",
    desc: "Research, writing, referencing and formatting. Tailored to your academic level and deadline needs.",
    prices: [
      { tier: "Basic", price: "₦1,000", note: "Short tasks / edits" },
      { tier: "Standard", price: "₦1,500", note: "Full assignment up to 1,500 words" },
      { tier: "Premium", price: "₦2,000", note: "Priority delivery & review" }
    ]
  },
  cv: {
    title: "CV Creation",
    desc: "Professional CV/resume writing, ATS-optimised and tailored to your industry.",
    prices: [
      { tier: "Basic", price: "₦1,000", note: "CV refresh" },
      { tier: "Standard", price: "₦1,500", note: "Full CV + cover letter" },
      { tier: "Premium", price: "₦2,000", note: "CV + LinkedIn optimisation" }
    ]
  },
  design: {
    title: "Graphic Design",
    desc: "Logos, flyers, social media graphics and branding elements designed to communicate your message.",
    prices: [
      { tier: "Basic", price: "₦1,000", note: "Simple social graphic" },
      { tier: "Standard", price: "₦1,500", note: "Logo or multi-panel flyer" },
      { tier: "Premium", price: "₦2,000", note: "Brand pack & revisions" }
    ]
  }
};

/* Smooth scroll: selector, duration ms */
function smoothScrollTo(selector, duration = 1000) {
  const el = document.querySelector(selector);
  if (!el) return;
  const start = window.pageYOffset;
  const end = el.getBoundingClientRect().top + start - 20;
  const distance = end - start;
  let startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    const time = ts - startTime;
    const progress = Math.min(time / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress; // easeInOut
    window.scrollTo(0, start + distance * ease);
    if (time < duration) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* Buttons that target sections */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-target]");
  if (!btn) return;
  const target = btn.getAttribute("data-target");
  if (target) {
    e.preventDefault();
    smoothScrollTo(target, 1000);
  }
});

/* Modal utilities */
const serviceModal = document.getElementById("service-modal");
const paymentModal = document.getElementById("payment-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalPrices = document.getElementById("modal-prices");
let activeServiceKey = null;

function openModal(modal) {
  modal.setAttribute("aria-hidden", "false");
  const firstFocusable = modal.querySelector("button, a, input");
  if (firstFocusable) firstFocusable.focus();
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* Populate service modal */
function populateServiceModal(key) {
  const data = servicesData[key];
  if (!data) return;
  activeServiceKey = key;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalPrices.innerHTML = "";
  data.prices.forEach(p => {
    const div = document.createElement("div");
    div.className = "price-item";
    div.innerHTML = `<h4>${p.tier} — ${p.price}</h4><p>${p.note}</p>`;
    modalPrices.appendChild(div);
  });
}

/* Open details from view-details links or press on card */
document.addEventListener("click", (e) => {
  const link = e.target.closest(".view-details, .service-card");
  if (!link) return;
  const key = link.dataset.service;
  if (!key) return;
  e.preventDefault();
  populateServiceModal(key);
  openModal(serviceModal);
});

/* Close handlers (buttons and backdrop) */
document.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal");
    if (modal) closeModal(modal);
  });
});
document.querySelectorAll(".modal-backdrop").forEach(b => {
  b.addEventListener("click", () => {
    const modal = b.closest(".modal");
    if (modal) closeModal(modal);
  });
});

/* ESC to close */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal[aria-hidden='false']").forEach(m => closeModal(m));
  }
});

/* Order Service -> open payment demo */
const orderBtn = document.getElementById("order-service");
if (orderBtn) {
  orderBtn.addEventListener("click", () => {
    closeModal(serviceModal);
    const title = servicesData[activeServiceKey] ? servicesData[activeServiceKey].title : "Service";
    document.getElementById("payment-title").textContent = `Pay for ${title} (Demo)`;
    document.getElementById("payment-result").textContent = "";
    openModal(paymentModal);
  });
}

/* Payment demo logic */
const payBtn = document.getElementById("pay-demo");
if (payBtn) {
  payBtn.addEventListener("click", () => {
    const result = document.getElementById("payment-result");
    if (!result) return;
    result.textContent = "Processing demo payment...";
    result.style.color = "";
    setTimeout(() => {
      const ok = Math.random() > 0.15;
      if (ok) {
        result.textContent = "Payment simulated — success! (Demo only)";
        result.style.color = "green";
      } else {
        result.textContent = "Payment simulated — failed. Try again (Demo).";
        result.style.color = "crimson";
      }
    }, 900);
  });
}

/* Basic focus-trap (simple) for modals */
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = modal.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
});

/* keyboard activation for service cards */
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const key = card.dataset.service;
      populateServiceModal(key);
      openModal(serviceModal);
      e.preventDefault();
    }
  });
});
