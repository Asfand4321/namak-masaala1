// auth.js (UPDATED: hide protected navbar links when logged out)

(function () {
  // Pages that don't require login
  const publicPages = new Set(["index.html", "login.html", "signup.html", ""]);

  // safer path detection (handles query/hash)
  const rawPath = window.location.pathname.split("/").pop() || "";
  const cleanPath = rawPath.split("?")[0].split("#")[0]; // remove ? and #

  const isPublic = publicPages.has(cleanPath);

  // Logged-in flag
  const isLoggedIn = localStorage.getItem("nm_logged_in") === "1";

  // 1) Route guard (DON'T block public pages)
  if (!isLoggedIn && !isPublic) {
    window.location.href = "login.html";
    return;
  }

  // These links should be hidden when NOT logged in
  const protectedHrefs = new Set([
    "plans.html",
    "meals.html",
    "referral.html",
    "account.html",
    "orders.html",
    "my-plans.html",
    "checkout.html",
    "cart.html",
    "customercare.html", // ✅ FIXED (aapka actual file)
  ]);

  function toggleLinks(containerSelector) {
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

      if (!isLoggedIn && protectedHrefs.has(href)) {
        a.style.display = "none";
      } else {
        a.style.display = "";
      }
    });
  }

  // 2) Navbar auth buttons toggle (Login/Signup vs Logout)
  function renderNavAuth() {
    const navAuth = document.querySelector(".nav-auth");
    if (!navAuth) return;

    if (isLoggedIn) {
      navAuth.innerHTML = `
        <button class="btn btn-outline" id="nmLogoutBtn">Logout</button>
      `;
      const btn = document.getElementById("nmLogoutBtn");
      if (btn) btn.addEventListener("click", nmLogout);
    } else {
      navAuth.innerHTML = `
        <a class="btn btn-outline" href="login.html">Login</a>
        <a class="btn btn-primary" href="signup.html">Sign up</a>
      `;
    }
  }

  // 3) Optional: mobile nav me logout link inject (only when logged in)
  function renderMobileLogout() {
    const mobileNav = document.querySelector(".nav-mobile");
    if (!mobileNav) return;

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

  document.addEventListener("DOMContentLoaded", function () {
    renderNavAuth();
    toggleLinks(".nav-links");   // desktop
    toggleLinks(".nav-mobile");  // mobile
    renderMobileLogout();
  });
})();

// Logout helper
function nmLogout() {
  localStorage.removeItem("nm_logged_in");
  localStorage.removeItem("nm_user_email");
  localStorage.removeItem("nm_current_email");
  window.location.href = "login.html";
}
