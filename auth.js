// auth.js (UPDATED: hide protected navbar links when logged out)

(function () {
  // Pages that don't require login
  const publicPages = ["index.html", "login.html", "signup.html", ""];

  const path = window.location.pathname.split("/").pop();
  const isPublic = publicPages.includes(path);

  // IMPORTANT: login pe set: localStorage.setItem("nm_logged_in","1")
  const isLoggedIn = localStorage.getItem("nm_logged_in") === "1";

  // 1) Route guard
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
    "cart.html",            // agar kabhi cart page ho
    "customer-care.html",
  ]);

  function toggleLinks(containerSelector) {
    const nav = document.querySelector(containerSelector);
    if (!nav) return;

    const links = nav.querySelectorAll("a");
    links.forEach((a) => {
      const href = (a.getAttribute("href") || "").trim();

      // Always allow Home
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

  document.addEventListener("DOMContentLoaded", function () {
    renderNavAuth();

    // Hide protected nav links when logged out
    toggleLinks(".nav-links");   // desktop
    toggleLinks(".nav-mobile");  // mobile

    renderMobileLogout();
  });
})();

// Logout helper
function nmLogout() {
  localStorage.removeItem("nm_logged_in");
  localStorage.removeItem("nm_user_email");
  window.location.href = "login.html";
}
