import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { resolveShareAccess, ShareAccessMessage, TemporaryAccessBadge } from "./ShareAccess.jsx";
import "./styles.css";

const root = createRoot(document.getElementById("root"));

async function renderPortfolio() {
  const access = await resolveShareAccess();
  root.render(
    <React.StrictMode>
      {access.status === 'permanent' || access.status === 'temporary' ? (
        <>
          <App />
          {access.status === 'temporary' ? <TemporaryAccessBadge expiresAt={access.expiresAt} /> : null}
        </>
      ) : (
        <ShareAccessMessage status={access.status} expiresAt={access.expiresAt} />
      )}
    </React.StrictMode>,
  );
}

renderPortfolio();
