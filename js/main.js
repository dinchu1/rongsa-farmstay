/* ===================================
   RONGSA FARMSTAY - MAIN JAVASCRIPT
   Mobile-First Interactive Features
   PRODUCTION VERSION - FIXED
   =================================== */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // ==================
  // MOBILE NAVIGATION
  // ==================
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.body;

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      mobileToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      body.classList.toggle("no-scroll");
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileToggle.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("no-scroll");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        mobileToggle.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("no-scroll");
      }
    });

    // Close menu on ESC key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        mobileToggle.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("no-scroll");
      }
    });
  }

  // ==================
  // STICKY HEADER
  // ==================
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
      header.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
    }

    lastScroll = currentScroll;
  });

  // ==================
  // SMOOTH SCROLL
  // ==================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Only prevent default if it's not just "#"
      if (href !== "#" && href !== "") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerHeight = document.querySelector(".header").offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // ==================
  // FORM HANDLING - INQUIRY FORM
  // ==================
  const inquiryForm = document.getElementById("inquiryForm");
  const formSuccess = document.getElementById("formSuccess");
  const formError = document.getElementById("formError");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Show loading state
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      // Collect form data
      const formData = new FormData(inquiryForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        checkin: formData.get("checkin"),
        checkout: formData.get("checkout"),
        guests: formData.get("guests"),
        message: formData.get("message"),
        timestamp: new Date().toISOString(),
        source: "Inquiry Form",
      };

      try {
        // Your Google Apps Script Web App URL
        const SCRIPT_URL =
          "https://script.google.com/macros/s/AKfycbxOVkRpLxAsdqG4K1tul3DCFtT1Eqbp_tED0NWe_jY43ezxtfM_mxebT8g19wOIUP0G/exec";

        // Check if URL is configured
        if (SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
          throw new Error("Please configure Google Apps Script URL");
        }

        // Send data to Google Sheets
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", // Required for Google Apps Script
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // With no-cors mode, we can't read the response, so assume success
        // Hide form, show success
        inquiryForm.style.display = "none";
        formSuccess.style.display = "block";

        console.log("Form submitted successfully:", data);

        // Reset form after 10 seconds
        setTimeout(() => {
          inquiryForm.reset();
          inquiryForm.style.display = "block";
          formSuccess.style.display = "none";
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 10000);
      } catch (error) {
        console.error("Submission error:", error);

        // Show error with direct contact options
        formError.style.display = "block";
        formError.innerHTML = `
          <p><strong>Unable to submit form.</strong></p>
          <p>Please contact us directly:</p>
          <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
            <a href="https://wa.me/918101379235?text=${encodeURIComponent(
              `Hi! I'd like to inquire about Rongsa Farmstay.\n\nName: ${
                data.name
              }\nEmail: ${data.email}\nPhone: ${data.phone}\nCheck-in: ${
                data.checkin || "Not specified"
              }\nCheck-out: ${data.checkout || "Not specified"}\nGuests: ${
                data.guests
              }\n\nMessage: ${data.message || "N/A"}`
            )}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
              WhatsApp Us
            </a>
            <a href="tel:+918101379235" class="btn btn-secondary">
              Call Now
            </a>
          </div>
        `;

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ==================
  // CONTACT FORM HANDLING
  // ==================
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");
  const contactError = document.getElementById("contactError");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        timestamp: new Date().toISOString(),
        source: "Contact Form",
      };

      try {
        // Use the same URL as inquiry form
        const SCRIPT_URL =
          "https://script.google.com/macros/s/AKfycbxOVkRpLxAsdqG4K1tul3DCFtT1Eqbp_tED0NWe_jY43ezxtfM_mxebT8g19wOIUP0G/exec";

        if (SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
          throw new Error("Please configure Google Apps Script URL");
        }

        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        contactForm.style.display = "none";
        contactSuccess.style.display = "block";
        console.log("Contact form submitted successfully:", data);

        // Reset after 10 seconds
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = "block";
          contactSuccess.style.display = "none";
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 10000);
      } catch (error) {
        console.error("Contact form error:", error);
        contactError.style.display = "block";
        contactError.innerHTML = `
          <p><strong>Unable to send message.</strong></p>
          <p>Please contact us directly:</p>
          <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
            <a href="https://wa.me/918101379235?text=${encodeURIComponent(
              `Hi! I have a question about Rongsa Farmstay.\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage: ${data.message}`
            )}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href="tel:+918101379235" class="btn btn-secondary">
              Call: +91 81013 79235
            </a>
          </div>
        `;

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ==================
  // GALLERY FILTERING
  // ==================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        filterBtns.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        this.classList.add("active");

        const filter = this.getAttribute("data-filter");

        galleryItems.forEach((item) => {
          if (filter === "all") {
            item.style.display = "block";
            item.classList.add("fade-in");
          } else {
            const categories = item.getAttribute("data-category").split(" ");
            if (categories.includes(filter)) {
              item.style.display = "block";
              item.classList.add("fade-in");
            } else {
              item.style.display = "none";
            }
          }
        });
      });
    });
  }

  // ==================
  // LIGHTBOX GALLERY
  // ==================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  let currentImageIndex = 0;
  let visibleImages = [];

  if (galleryItems.length > 0 && lightbox) {
    // Open lightbox when clicking gallery item
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", function () {
        // Get all visible images
        visibleImages = Array.from(galleryItems).filter((item) => {
          return window.getComputedStyle(item).display !== "none";
        });

        currentImageIndex = visibleImages.indexOf(item);
        showLightboxImage(currentImageIndex);
        lightbox.style.display = "flex";
        body.classList.add("no-scroll");
      });
    });

    // Close lightbox
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    // Close on background click
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Previous image
    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", function () {
        currentImageIndex =
          (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        showLightboxImage(currentImageIndex);
      });
    }

    // Next image
    if (lightboxNext) {
      lightboxNext.addEventListener("click", function () {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        showLightboxImage(currentImageIndex);
      });
    }

    // Keyboard navigation
    document.addEventListener("keydown", function (e) {
      if (lightbox.style.display === "flex") {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "ArrowLeft") {
          lightboxPrev.click();
        } else if (e.key === "ArrowRight") {
          lightboxNext.click();
        }
      }
    });
  }

  function showLightboxImage(index) {
    const item = visibleImages[index];
    const img = item.querySelector("img");
    const overlay = item.querySelector(".gallery-overlay");

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    if (overlay) {
      const title = overlay.querySelector("h3")?.textContent || "";
      const desc = overlay.querySelector("p")?.textContent || "";
      lightboxCaption.textContent = title + (desc ? " - " + desc : "");
    }
  }

  function closeLightbox() {
    lightbox.style.display = "none";
    body.classList.remove("no-scroll");
  }

  // ==================
  // DATE INPUT RESTRICTIONS
  // ==================
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");

  if (checkinInput && checkoutInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    checkinInput.setAttribute("min", today);
    checkoutInput.setAttribute("min", today);

    // Update checkout min date when checkin changes
    checkinInput.addEventListener("change", function () {
      const checkinDate = new Date(this.value);
      checkinDate.setDate(checkinDate.getDate() + 1);
      const minCheckout = checkinDate.toISOString().split("T")[0];
      checkoutInput.setAttribute("min", minCheckout);

      // Clear checkout if it's before new minimum
      if (checkoutInput.value && checkoutInput.value < minCheckout) {
        checkoutInput.value = "";
      }
    });
  }

  // ==================
  // LAZY LOADING IMAGES
  // ==================
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add("fade-in");
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // ==================
  // SCROLL ANIMATIONS
  // ==================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".feature-card, .room-card, .gallery-item, .value-card")
    .forEach((el) => {
      observer.observe(el);
    });

  // ==================
  // FORM VALIDATION HELPERS
  // ==================
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.setCustomValidity("Please enter a valid email address");
        this.reportValidity();
      } else {
        this.setCustomValidity("");
      }
    });
  });

  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      const phoneRegex = /^[+]?[\d\s-]{10,}$/;
      if (this.value && !phoneRegex.test(this.value)) {
        this.setCustomValidity("Please enter a valid phone number");
        this.reportValidity();
      } else {
        this.setCustomValidity("");
      }
    });
  });

  // ==================
  // WHATSAPP TRACKING (Optional)
  // ==================
  document.querySelectorAll('a[href^="https://wa.me"]').forEach((link) => {
    link.addEventListener("click", function () {
      console.log("WhatsApp link clicked:", this.href);
      // Add analytics tracking here if needed
    });
  });

  // ==================
  // CONSOLE WELCOME MESSAGE
  // ==================
  console.log(
    "%c🏔️ Welcome to Rongsa Farmstay! 🏔️",
    "color: #2D5016; font-size: 20px; font-weight: bold;"
  );
  console.log(
    "%cWebsite designed for authentic Lepcha hospitality in Sittong, Darjeeling",
    "color: #C1666B; font-size: 14px;"
  );
  console.log(
    "%cFor inquiries: +91 81013 79235",
    "color: #5A5A5A; font-size: 12px;"
  );
});
