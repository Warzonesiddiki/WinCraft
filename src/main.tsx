import React from "react";
import ReactDOM from "react-dom/client";
// The app's single type family (self-hosted; no network fonts). The declared
// font used to be Sora but was never actually bundled, so the whole UI
// silently rendered in the system fallback.
import "@fontsource-variable/inter";
import App from "./App";
import { PageBoundary } from "./components/page-boundary";
import { detectInitialLang, loadStrings, stringsFor } from "./i18n";

const lang = detectInitialLang();

/** Draws the window. Nothing here depends on the language's table. */
function start() {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      {/* The last line of defence: an error outside any page still shows a way
          back instead of a blank window. */}
      <PageBoundary s={stringsFor(lang)} resetKey="app" scope="app">
        <App />
      </PageBoundary>
    </React.StrictMode>,
  );
}

// A reader who chose Italian sees Italian on the first frame: the table is
// fetched before the window is drawn. English is already in the bundle, so for
// most readers this resolves without a request — and if the fetch fails (a
// damaged install), the app still starts, in English, rather than going blank.
void loadStrings(lang).then(start, start);
