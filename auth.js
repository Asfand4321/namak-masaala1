// auth.js (Supabase session based + your navbar/guard logic)
import { supabase } from "./supabaseClient.js";

(function () {
  // Pages that don't require login
  const publicPages = new Set(["index.html", "login.html", "signup.html", ""]);

  // safer path detection (handles query/hash)
  const rawPath = window.location.pathname.split("/").pop() || "";
  const cleanPath = rawPath.split("?")[0].split("#")[0];

  const isPublic = publicPages.has(cleanPath);

  // ✅ Always hide these links (even when logged in)
  const alwaysHideHrefs = new Set(["cart.html", "my-plans.html", "checkout.html"]);

  // These links should be hidden when NOT logged in
  const protectedHrefs = new Set([
    "plans.html",
    "meals.html",
    "referral.html",
    "account.html",
    "orders.html",
    "customercare.html",
  ]);

  function toggleLinks(containerSelector, isLoggedIn) {
    const nav = document.querySelector(containerSelector);
    if (!nav) return;

    const links = nav.querySelectorAll("a");
    links.forEach((a) => {
      const hrefRaw = (a.getAttribute("href") || "").trim();
      const href = hrefRaw.split("?")[0].split("#")[0];

      // Always allow Home + empty/hash links
      if (href === "index.html" || href === "" || href === "#") {
        a.style.display = "";
        return;
      }

      // ✅ Always hide these (Cart / My Plans / Checkout)
      if (alwaysHideHrefs.has(href)) {
        a.style.display = "none";
        return;
      }

      // Hide protected nav links when logged out
      if (!isLoggedIn && protectedHrefs.has(href)) {
        a.style.display = "none";
      } else {
        a.style.display = "";
      }
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
      a.addEventListener("click", function (e) {
        e.preventDefault();
        nmLogout();
      });
      mobileNav.appendChild(a);
    }
  }

  async function init() {
    // ✅ Supabase session check
    const { data } = await supabase.auth.getSession();
    const isLoggedIn = !!data?.session;

    // (Optional) tumhari old system ke sath compatibility:
    // localStorage.setItem("nm_logged_in", isLoggedIn ? "1" : "0");

    // 1) Route guard (DON'T block public pages)
    if (!isLoggedIn && !isPublic) {
      window.location.href = "login.html";
      return;
    }

    // 2) Navbar
    renderNavAuth(isLoggedIn);
    toggleLinks(".nav-links", isLoggedIn);
    toggleLinks(".nav-mobile", isLoggedIn);
    renderMobileLogout(isLoggedIn);

    // 3) Live update on login/logout (optional but nice)
    supabase.auth.onAuthStateChange((_event, session) => {
      const logged = !!session;

      if (!logged && !isPublic) {
        window.location.href = "login.html";
        return;
      }

      renderNavAuth(logged);
      toggleLinks(".nav-links", logged);
      toggleLinks(".nav-mobile", logged);
      renderMobileLogout(logged);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

// ✅ Logout helper (Supabase)
async function nmLogout() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // ignore
  }

  // old local keys cleanup (safe)
  localStorage.removeItem("nm_logged_in");
  localStorage.removeItem("nm_user_email");
  localStorage.removeItem("nm_current_email");

  window.location.href = "login.html";
}

// in case kahin inline use ho raha ho
window.nmLogout = nmLogout;
