import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { BagDrawer } from "@/components/bag-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { themeInitScript } from "@/components/theme-toggle";
import { BagProvider } from "@/lib/bag";

import appCss from "../styles.css?url";

function Message({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <section className="wrap grid min-h-[60dvh] content-center py-24">
      <h1 className="display-xl max-w-[14ch]">{title}</h1>
      <p className="lead mt-5">{text}</p>
      <div className="mt-8 flex flex-wrap gap-3">{children}</div>
    </section>
  );
}

function NotFound() {
  return (
    <Message
      title="That page isn't here."
      text="It may have moved. Head back home, or find something you'll reach for in the shop."
    >
      <Link to="/" className="btn btn-primary">
        Back home
      </Link>
      <Link to="/shop" className="btn btn-ghost">
        Shop the Collection
      </Link>
    </Message>
  );
}

function RouteError({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return (
    <Message
      title="This page didn't load."
      text="Something went wrong on our side. Try again, or head back home."
    >
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          void router.invalidate();
          reset();
        }}
      >
        Try again
      </button>
      <a href="/" className="btn btn-ghost">
        Back home
      </a>
    </Message>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a1020" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/gambetta-var.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/manrope-var.woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", type: "image/png", href: "/favicon-192.png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [{ children: themeInitScript }],
  }),
  shellComponent: RootShell,
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootLayout() {
  return (
    <BagProvider>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-accent px-5 py-3 font-bold text-on-accent focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
      <BagDrawer />
    </BagProvider>
  );
}
