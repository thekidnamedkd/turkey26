/**
 * Registers the service worker that keeps the market list and recipes usable
 * without a connection, and offers a reload when a new build is waiting.
 */
export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return;
  }

  const base = import.meta.env.BASE_URL;
  const notice = document.querySelector<HTMLElement>("[data-update]");
  const reloadButton = document.querySelector<HTMLButtonElement>(
    "[data-update-reload]"
  );

  let registration: ServiceWorkerRegistration | undefined;
  let reloading = false;

  const reloadOnce = () => {
    if (reloading) {
      return;
    }
    reloading = true;
    window.location.reload();
  };

  const offerUpdate = () => {
    if (notice) {
      notice.hidden = false;
    }
  };

  navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);

  reloadButton?.addEventListener("click", () => {
    const waiting = registration?.waiting;
    if (waiting) {
      // ServiceWorker.postMessage takes a transfer list, not a target origin.
      // oxlint-disable-next-line unicorn/require-post-message-target-origin
      waiting.postMessage({ type: "SKIP_WAITING" });
      return;
    }
    reloadOnce();
  });

  const register = async () => {
    try {
      registration = await navigator.serviceWorker.register(`${base}sw.js`, {
        scope: base,
      });

      if (registration.waiting && navigator.serviceWorker.controller) {
        offerUpdate();
      }

      registration.addEventListener("updatefound", () => {
        const installing = registration?.installing;
        installing?.addEventListener("statechange", () => {
          if (
            installing.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            offerUpdate();
          }
        });
      });
    } catch {
      // Offline support is optional; the site works without it.
    }
  };

  void register();
};
