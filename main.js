const metricNodes = document.querySelectorAll("[data-target]");
const parallaxNodes = document.querySelectorAll("[data-parallax]");
const spotlight = document.querySelector(".spotlight");
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const animateMetric = (node) => {
  const target = Number(node.dataset.target);
  const duration = 1200;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);

    node.textContent = `${current}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
};

if (metricNodes.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateMetric(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  metricNodes.forEach((node) => observer.observe(node));
}

if (!mediaQuery.matches) {
  window.addEventListener("pointermove", (event) => {
    const { innerWidth, innerHeight } = window;
    const x = event.clientX / innerWidth - 0.5;
    const y = event.clientY / innerHeight - 0.5;

    if (spotlight) {
      spotlight.style.left = `${event.clientX}px`;
      spotlight.style.top = `${event.clientY}px`;
    }

    parallaxNodes.forEach((node) => {
      const depth = Number(node.dataset.parallax) || 16;
      const translateX = x * depth;
      const translateY = y * depth;

      node.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  });
}
