/* Public read-only certificate lookup. No private student data or credentials. */
(function () {
  "use strict";
  const form = document.getElementById("verify-form");
  const input = document.getElementById("certificate-id");
  const button = document.getElementById("verify-button");
  const result = document.getElementById("result");
  const heading = document.getElementById("result-heading");
  const description = document.getElementById("result-description");
  const details = document.getElementById("result-details");
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  function show(state, title, message, cert) {
    result.dataset.state = state;
    heading.textContent = title;
    description.textContent = message;
    details.hidden = !cert;
    if (cert) {
      document.getElementById("cert-name").textContent = cert.name || "Not provided";
      document.getElementById("cert-program").textContent = cert.program || "CAD to Career";
      document.getElementById("cert-id").textContent = cert.id || "";
      const date = new Date(cert.issuedAt);
      document.getElementById("cert-date").textContent = Number.isNaN(date.valueOf()) ? "Not available" : date.toLocaleDateString();
    }
  }
  async function verify(id) {
    if (!UUID.test(id)) {
      show("invalid", "Identifier format not recognized", "Use the complete UUID from the certificate; no verification was performed.");
      return;
    }
    const config = window.CAD_CLOUD_CONFIG || {};
    let base;
    try { base = new URL(config.url || ""); }
    catch (_) { show("error", "Verification unavailable", "The verification service has not been configured."); return; }
    if (base.protocol !== "https:") {
      show("error", "Verification unavailable", "Verification requires a secure HTTPS service.");
      return;
    }
    button.disabled = true;
    show("loading", "Checking the certificate…", "Contacting the independent certificate register.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const url = new URL("/functions/v1/cad-verify", base);
      url.searchParams.set("id", id);
      const response = await fetch(url.href, { method: "GET", signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error("The verification service did not respond successfully.");
      const data = await response.json();
      if (data && data.valid === true && data.revoked !== true) {
        show("valid", "Certificate currently valid", "The issuer records this certificate as issued and not revoked.", data);
      } else if (data && data.revoked === true) {
        show("invalid", "Certificate revoked", "This certificate is no longer valid.");
      } else if (data && data.valid === false) {
        show("invalid", "No valid certificate found", "No currently valid certificate matches this identifier.");
      } else {
        throw new Error("The verification response is incomplete.");
      }
    } catch (e) {
      show("error", "Verification could not be completed", "The verification service is temporarily unavailable. Do not treat this as proof of either validity or invalidity.");
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
    }
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    verify(input.value.trim());
  });
  const supplied = new URLSearchParams(location.search).get("id");
  if (supplied) {
    input.value = supplied.slice(0, 36);
    verify(input.value);
  }
})();
