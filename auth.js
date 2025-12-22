// auth.js (UPDATED)

(function () {
  // Ye pages bina login allow hain
  // "" = index.html case (kabhi kabhi blank pathname aata)
  const publicPages = ["index.html", "login.html", "signup.html", ""];

  // current file name nikaalo (e.g. "plans.html")
  const path = window.location.pathname.split("/").pop();

  const isPublic = publicPages.includes(path);
  const isLoggedIn = localStorage.getItem("nm_logged_in") === "1";

  // 1) Route guard: agar login nahi aur page public nahi => login page
  if (!isLoggedIn && !isPublic) {
    window.location.href = "login.html";
    return;
  }

  // 2) Navbar buttons toggle
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

  // 3) Optional: mobile nav me logout link inject
  function renderMobileNav() {
    const mobileNav = document.querySelector(".nav-mobile");
    if (!mobileNav) return;

    // pehle purana injected logout remove kar do
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

  // Run after DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    renderNavAuth();
    renderMobileNav();
  });
})();

// simple logout helper (navbar button se call kar sakte ho)
function nmLogout() {
  localStorage.removeItem("nm_logged_in");
  localStorage.removeItem("nm_user_email");
  // Agar aur keys save karte ho to yahan add kar lena
  // localStorage.removeItem("nm_user");
  window.location.href = "login.html";
}
