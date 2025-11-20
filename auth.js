<!-- auth.js -->
<script>
// IIFE: turant run hone wala function
(function () {
  // Konsi pages without login allowed hain:
  const publicPages = ["login.html", "signup.html", ""]; // "" for root "/"

  // Current page ka naam nikaalo (eg: "plans.html")
  const path = window.location.pathname.split("/").pop();

  const isPublic = publicPages.includes(path);

  // localStorage me flag check karo
  const isLoggedIn = !!localStorage.getItem("nm_logged_in");

  if (!isLoggedIn && !isPublic) {
    // Agar login nahi hai aur page public nahi
    window.location.href = "login.html";
  }
})();

// simple logout helper (optional)
function nmLogout() {
  localStorage.removeItem("nm_logged_in");
  window.location.href = "login.html";
}
</script>
