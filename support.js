(function () {
  "use strict";
  // Only well-known payment hosts are rendered, so a typo or tampered config
  // can never turn a "Donate" button into a link to an arbitrary site.
  var ALLOWED_HOSTS = [
    "buy.stripe.com", "donate.stripe.com", "checkout.stripe.com",
    "github.com", "ko-fi.com", "opencollective.com",
    "www.paypal.com", "paypal.me", "www.buymeacoffee.com", "buymeacoffee.com",
    "calendly.com", "cal.com"
  ];

  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      var url = new URL(value.trim());
      if (url.protocol !== "https:") return null;
      if (ALLOWED_HOSTS.indexOf(url.hostname) === -1) return null;
      return url.href;
    } catch (e) {
      return null;
    }
  }

  function safeEmail(value) {
    return typeof value === "string" && /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(value.trim()) ? value.trim() : null;
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function link(href, label, primary) {
    var a = el("a", { class: "btn" + (primary ? " primary" : ""), href: href, rel: "noopener noreferrer", target: "_blank" }, label);
    return a;
  }

  function render(config) {
    config = config || {};
    var tiersBox = document.getElementById("supporter-tiers");
    var extraBox = document.getElementById("supporter-extra");
    var closedBox = document.getElementById("donations-closed");
    var teamsBox = document.getElementById("team-packages");
    var teamsActions = document.getElementById("team-actions");
    var shown = 0;

    if (tiersBox) {
      (Array.isArray(config.monthly) ? config.monthly : []).forEach(function (tier) {
        var href = safeUrl(tier && tier.url);
        if (!href) return;
        var card = el("div", { class: "card support-tier" });
        card.appendChild(el("span", { class: "badge" }, tier.name || "Supporter"));
        card.appendChild(el("h3", {}, "$" + Number(tier.amount || 0) + " / month"));
        card.appendChild(el("p", {}, tier.perks || ""));
        card.appendChild(link(href, "Join as " + (tier.name || "a supporter"), true));
        tiersBox.appendChild(card);
        shown++;
      });
    }

    if (extraBox) {
      var once = safeUrl(config.oneTime && config.oneTime.url);
      if (once) { extraBox.appendChild(link(once, (config.oneTime.label || "Give once"), shown === 0)); shown++; }
      var sponsors = safeUrl(config.githubSponsors);
      if (sponsors) { extraBox.appendChild(link(sponsors, "Sponsor on GitHub", false)); shown++; }
    }

    if (closedBox) closedBox.hidden = shown > 0;

    var teams = config.teams || {};
    if (teamsBox) {
      (Array.isArray(teams.packages) ? teams.packages : []).forEach(function (pkg) {
        var card = el("div", { class: "card" });
        card.appendChild(el("span", { class: "badge done" }, pkg.price || "Quoted"));
        card.appendChild(el("h3", {}, pkg.name || "Package"));
        card.appendChild(el("p", {}, pkg.detail || ""));
        teamsBox.appendChild(card);
      });
    }
    if (teamsActions) {
      var booking = safeUrl(teams.bookingUrl);
      var email = safeEmail(teams.contactEmail);
      if (booking) teamsActions.appendChild(link(booking, "Book a 20-minute call", true));
      if (email) {
        var mail = el("a", { class: "btn" + (booking ? "" : " primary"), href: "mailto:" + email + "?subject=" + encodeURIComponent("CAD to Career for our team") }, "Email us about a team plan");
        teamsActions.appendChild(mail);
      }
      if (!booking && !email) teamsActions.appendChild(el("p", { class: "muted" }, "Team enrollment opens soon."));
    }
    return shown;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { safeUrl: safeUrl, safeEmail: safeEmail };
  } else {
    document.addEventListener("DOMContentLoaded", function () { render(window.CAD_FUNDING); });
  }
})();
