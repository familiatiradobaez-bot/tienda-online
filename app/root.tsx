import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "react-router";
import type { Route } from "./+types/root";
import "./tailwind.css";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { loadAppContext } from "~/lib/app-context";

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  return {
    appContext: await loadAppContext(request, context.cloudflare.env),
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { appContext } = loaderData;
  return (
    <div className="flex min-h-screen flex-col">
      <Header user={appContext.user} categories={appContext.categories} cartCount={appContext.cartCount} />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message = isRouteErrorResponse(error) ? error.statusText : "Ha ocurrido un error inesperado";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="card max-w-md p-8 text-center">
        <h1 className="text-6xl font-bold text-brand-600">{status}</h1>
        <p className="mt-4 text-lg text-muted">{message}</p>
        <a href="/" className="btn-primary mt-6">Volver al inicio</a>
      </div>
    </div>
  );
}
