/**
 * QTrip 3D Motion Engine
 * Provides interactive perspective tilt, 3D layer depth, and dynamic glare reflection.
 */

function attach3DTilt(element) {
  if (!element || element.dataset.has3dTilt) return;
  element.dataset.has3dTilt = "true";

  // Check prefers-reduced-motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Ensure card glare element exists
  let glare = element.querySelector(".card-glare");
  if (!glare) {
    glare = document.createElement("div");
    glare.className = "card-glare";
    element.appendChild(glare);
  }

  let rafId = null;
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;
  let isHovered = false;

  function updateTransform() {
    if (!isHovered) {
      currentTiltX += (0 - currentTiltX) * 0.15;
      currentTiltY += (0 - currentTiltY) * 0.15;
      if (Math.abs(currentTiltX) < 0.05 && Math.abs(currentTiltY) < 0.05) {
        element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        if (glare) glare.style.opacity = "0";
        rafId = null;
        return;
      }
    } else {
      currentTiltX += (targetTiltX - currentTiltX) * 0.2;
      currentTiltY += (targetTiltY - currentTiltY) * 0.2;
    }

    element.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    rafId = requestAnimationFrame(updateTransform);
  }

  element.addEventListener("mouseenter", () => {
    isHovered = true;
    element.style.transition = "none";
    if (!rafId) {
      rafId = requestAnimationFrame(updateTransform);
    }
  });

  element.addEventListener("mousemove", (e) => {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    const maxTilt = 14;
    targetTiltX = -y * maxTilt;
    targetTiltY = x * maxTilt;

    if (glare) {
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)`;
    }

    if (!rafId) {
      rafId = requestAnimationFrame(updateTransform);
    }
  });

  element.addEventListener("mouseleave", () => {
    isHovered = false;
    element.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    targetTiltX = 0;
    targetTiltY = 0;
    if (glare) {
      glare.style.opacity = "0";
    }
  });
}

export function init3DMotion() {
  const cards = document.querySelectorAll(".tile, .activity-card");
  cards.forEach(attach3DTilt);

  // Observe dynamically added cards in #data or document
  const dataContainer = document.getElementById("data") || document.body;
  if (dataContainer && !dataContainer.dataset.motionObserver) {
    dataContainer.dataset.motionObserver = "true";
    const observer = new MutationObserver(() => {
      const dynamicCards = document.querySelectorAll(".tile, .activity-card");
      dynamicCards.forEach(attach3DTilt);
    });
    observer.observe(dataContainer, { childList: true, subtree: true });
  }
}

// Auto-run when DOM is loaded
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init3DMotion);
  } else {
    init3DMotion();
  }
}
