// auth.js

(function () {
  // Ye pages bina login allow hain
  const publicPages = ["login.html", "signup.html", ""];

  // current file name nikaalo (e.g. "plans.html")
  const path = window.location.pathname.split("/").pop();

  const isPublic = publicPages.includes(path);
  const isLoggedIn = !!localStorage.getItem("nm_logged_in");

  if (!isLoggedIn && !isPublic) {
    // agar login nahi hai aur page public nahi
    window.location.href = "login.html";
  }
})();

// simple logout helper (navbar button se call kar sakte ho)
function nmLogout() {
  localStorage.removeItem("nm_logged_in");
  localStorage.removeItem("nm_user_email");
  window.location.href = "login.html";
}
