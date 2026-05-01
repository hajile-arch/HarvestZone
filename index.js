
      // Reveal
      const revEls = document.querySelectorAll(".reveal");
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e, i) => {
            if (e.isIntersecting) {
              setTimeout(() => e.target.classList.add("visible"), i * 60);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 },
      );
      revEls.forEach((el) => obs.observe(el));

      // Nav scroll
      window.addEventListener("scroll", () => {
        document
          .getElementById("navbar")
          .classList.toggle("scrolled", window.scrollY > 40);
      });

      // Category tabs
      function showCat(cat, btn) {
        document
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".prod-section").forEach((s) => {
          if (cat === "all" || s.dataset.cat === cat) s.classList.add("active");
          else s.classList.remove("active");
        });
      }

      // Lightbox
      let lbItems = [],
        lbIdx = 0;
      function openLb(el) {
        lbItems = Array.from(
          el.closest("section").querySelectorAll(".gallery-item"),
        );
        lbIdx = lbItems.indexOf(el);
        showLbItem();
        document.getElementById("lightbox").classList.add("open");
      }
      function showLbItem() {
  const item = lbItems[lbIdx];
  const img = item.querySelector("img");
  const label = item.querySelector(".gallery-item-label");
  const spec = item.querySelector(".gallery-item-spec");

  // get the section title as category (e.g. "Road Barriers & Poles")
  const sectionTitle = item.closest(".prod-section")
    ?.querySelector(".prod-section-title")
    ?.childNodes[0]?.textContent?.trim() || "";

  document.getElementById("lb-img").src = img.src;
  document.getElementById("lb-img").alt = label ? label.textContent : "";
  document.getElementById("lb-name").textContent = label ? label.textContent : "";
  document.getElementById("lb-category").textContent = sectionTitle;

  const specBlock = document.getElementById("lb-spec-block");
  const specValue = document.getElementById("lb-spec-value");
  if (spec && spec.innerHTML.trim()) {
  specValue.innerHTML = spec.innerHTML;
  specBlock.style.display = "flex";
} else {
  specBlock.style.display = "none";
}
}
      function closeLb() {
        document.getElementById("lightbox").classList.remove("open");
      }
      function navLb(dir) {
        lbIdx = (lbIdx + dir + lbItems.length) % lbItems.length;
        showLbItem();
      }
      document.getElementById("lightbox").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeLb();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLb();
        if (e.key === "ArrowLeft") navLb(-1);
        if (e.key === "ArrowRight") navLb(1);
      });

      // Mobile menu
      function toggleMenu() {
        const links = document.querySelector(".nav-links");
        if (links.style.display === "flex") {
          links.style.display = "";
        } else {
          links.style.cssText =
            "display:flex;flex-direction:column;position:fixed;top:65px;left:0;right:0;background:var(--white);padding:2rem 5%;gap:1.5rem;border-bottom:1px solid var(--light-gray);z-index:99;";
        }
      }

      // Form
      function submitForm(btn) {
  // basic validation
  const name    = document.getElementById("f-name").value.trim();
  const phone   = document.getElementById("f-phone").value.trim();
  const email   = document.getElementById("f-email").value.trim();
  const product = document.getElementById("f-product").value;
  const message = document.getElementById("f-message").value.trim();
  const status  = document.getElementById("form-status");

  if (!name || !phone || !message) {
    status.style.display = "block";
    status.style.background = "#2a1a1a";
    status.style.color = "#e88";
    status.style.border = "1px solid #5a2a2a";
    status.textContent = "Please fill in your name, phone number and message.";
    return;
  }

  // loading state
  btn.disabled = true;
  btn.textContent = "Sending…";
  status.style.display = "none";

  const templateParams = {
    from_name: name,
    phone:     phone,
    from_email: email || "Not provided",
    product:   product || "Not specified",
    message:   message,
  };

  emailjs.send("service_istqqlp", "template_gqh0dje", templateParams)
    .then(() => {
      // success
      status.style.display = "block";
      status.style.background = "#0d1f14";
      status.style.color = "#6dbf8a";
      status.style.border = "1px solid #1e4d2b";
      status.textContent = "✓ Enquiry sent! We'll get back to you shortly.";

      // clear the form
      document.getElementById("f-name").value    = "";
      document.getElementById("f-phone").value   = "";
      document.getElementById("f-email").value   = "";
      document.getElementById("f-product").value = "";
      document.getElementById("f-message").value = "";

      btn.textContent = "Send Enquiry";
      btn.disabled = false;
    })
    .catch((err) => {
      // error
      status.style.display = "block";
      status.style.background = "#2a1a1a";
      status.style.color = "#e88";
      status.style.border = "1px solid #5a2a2a";
      status.textContent = "Something went wrong. Please call or email us directly.";
      console.error("EmailJS error:", err);

      btn.textContent = "Send Enquiry";
      btn.disabled = false;
    });
}
