// auth.js (Supabase session based + navbar/guard logic) - FIXED to avoid loops
import { supabase } from "./supabaseClient.js";

(function () {
  // Public pages (no login required)
  const publicPages = new Set(["index.html", "login.html", "signup.html", ""]);

  const rawPath = window.location.pathname.split("/").pop() || "";
  const cleanPath = rawPath.split("?")[0].split("#")[0];
  const isPublic = publicPages.has(cleanPath);

  // Always hide these links
  const alwaysHideHrefs = new Set(["cart.html", "my-plans.html", "checkout.html"]);

  // Hide these when logged out
  const protectedHrefs = new Set([
    "plans.html",
    "meals.html",
    "referral.html",
    "account.html",
    "account-settings.html",
    "orders.html",
    "customercare.html",
  ]);

  function toggleLinks(containerSelector, isLoggedIn) {
    const nav = document.querySelector(containerSelector);
    if (!nav) return;

    nav.querySelectorAll("a").forEach((a) => {
      const hrefRaw = (a.getAttribute("href") || "").trim();
      const href = hrefRaw.split("?")[0].split("#")[0];

      // Always allow Home + empty/hash links
      if (href === "index.html" || href === "" || href === "#") {
        a.style.display = "";
        return;
      }

      // Always hide these
      if (alwaysHideHrefs.has(href)) {
        a.style.display = "none";
        return;
      }

      // Hide protected links when logged out
      if (!isLoggedIn && protectedHrefs.has(href)) a.style.display = "none";
      else a.style.display = "";
    });
  }

  function renderNavAuth(isLoggedIn) {
    const navAuth = document.querySelector(".nav-auth");
    if (!navAuth) return;

    if (isLoggedIn) {
      navAuth.innerHTML = `<button class="btn btn-outline" id="nmLogoutBtn">Logout</button>`;
      const btn = document.getElementById("nmLogoutBtn");
      if (btn) btn.addEventListener("click", nmLogout);
    } else {
      navAuth.innerHTML = `
        <a class="btn btn-outline" href="login.html">Login</a>
        <a class="btn btn-primary" href="signup.html">Sign up</a>
      `;
    }
  }

  function renderMobileLogout(isLoggedIn) {
    const mobileNav = document.querySelector(".nav-mobile");
    if (!mobileNav) return;

    // remove old injected logout
    const old = mobileNav.querySelector('[data-nm="logout"]');
    if (old) old.remove();

    if (isLoggedIn) {
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = "Logout";
      a.setAttribute("data-nm", "logout");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        nmLogout();
      });
      mobileNav.appendChild(a);
    }
  }

  function applyUI(isLoggedIn) {
    renderNavAuth(isLoggedIn);
    toggleLinks(".nav-links", isLoggedIn);
    toggleLinks(".nav-mobile", isLoggedIn);
    renderMobileLogout(isLoggedIn);
  }

  async function init() {
    const { data } = await supabase.auth.getSession();
    const isLoggedIn = !!data?.session;

    // (optional) compatibility flag (UI only)
    localStorage.setItem("nm_logged_in", isLoggedIn ? "1" : "0");

    // Guard: block protected pages when logged out
    if (!isLoggedIn && !isPublic) {
      window.location.href = "login.html";
      return;
    }

    applyUI(isLoggedIn);

    // IMPORTANT FIX: ignore INITIAL_SESSION to avoid redirect loop
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;

      const logged = !!session;
      localStorage.setItem("nm_logged_in", logged ? "1" : "0");

      if (!logged && !isPublic) {
        window.location.href = "login.html";
        return;
      }

      applyUI(logged);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

// Logout helper (Supabase)
async function nmLogout() {
  try {
    await supabase.auth.signOut();
  } catch (e) {}

  // old keys cleanup (safe)
  localStorage.removeItem("nm_logged_in");
  localStorage.removeItem("nm_user_email");
  localStorage.removeItem("nm_current_email");

  window.location.href = "login.html";
}

window.nmLogout = nmLogout;
