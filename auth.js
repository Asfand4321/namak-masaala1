// auth.js (Supabase session based + navbar/guard logic) - FIXED to avoid loops
import { supabase } from "./supabaseClient.js";

(function () {
  const publicPages = new Set(["index.html", "login.html", "signup.html", ""]);

  const rawPath = window.location.pathname.split("/").pop() || "";
  const cleanPath = rawPath.split("?")[0].split("#")[0];
  const isPublic = publicPages.has(cleanPath);

  const alwaysHideHrefs = new Set(["cart.html", "my-plans.html", "checkout.html"]);

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

      if (href === "index.html" || href === "" || href === "#") {
        a.style.display = "";
        return;
      }

      if (alwaysHideHrefs.has(href)) {
        a.style.display = "none";
        return;
      }

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
    // ✅ session check (local)
    const { data } = await supabase.auth.getSession();
    const isLoggedIn = !!data?.session;

    // ✅ optional compatibility flag (doesn't control auth, just UI)
    localStorage.setItem("nm_logged_in", isLoggedIn ? "1" : "0");

    // ✅ guard
    if (!isLoggedIn && !isPublic) {
      window.location.href = "login.html";
      return;
    }

    applyUI(isLoggedIn);

    // ✅ IMPORTANT FIX: ignore INITIAL_SESSION so it doesn't kick you out
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

// ✅ Logout helper (Supabase)
async function nmLogout() {
  try { await supabase.auth.signOut(); } catch (e) {}

  localStorage.removeItem("nm_logged_in");
  localStorage.removeItem("nm_user_email");
  localStorage.removeItem("nm_current_email");

  window.location.href = "login.html";
}

window.nmLogout = nmLogout;
