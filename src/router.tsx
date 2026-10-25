import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Jump to the top instantly (the page crossfades; a smooth scroll would play on top of it).
    scrollRestorationBehavior: "instant",
    // Pages crossfade through the View Transitions API where the browser has it.
    defaultViewTransition: true,
    defaultPreloadStaleTime: 0,
    // Hovering or pressing a link starts loading its page, and its hero photograph, in advance.
    defaultPreload: "intent",
  });

  if (typeof document !== "undefined") {
    // The hero photograph fades up on the first load only. On later navigations the crossfade does
    // that job, and replaying it would blank the page for a moment.
    router.subscribe("onBeforeNavigate", () => {
      document.documentElement.setAttribute("data-nav", "");
    });
  }

  return router;
};
