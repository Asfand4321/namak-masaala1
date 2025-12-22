(function () {
  const plans = {
    weekly1: {
      title: "Weekly 1 Meal Plan",
      desc: "Mon–Sat (6 days), 1 meal per day. Single fixed lunch/dinner slot.",
      price: 2000,
      days: "Mon–Sat",
      meals: "1",
      bullets: [
        "6 days a week (Mon–Sat)",
        "1 delivery time window of your choice",
        "Menu rotates but similar pattern",
        "WhatsApp confirmation for timing"
      ]
    },
    weekly2: {
      title: "Weekly 2 Meals Plan",
      desc: "Mon–Sat (6 days), 2 meals per day. Best for full office routine.",
      price: 4000,
      days: "Mon–Sat",
      meals: "2",
      bullets: [
        "6 days a week (Mon–Sat)",
        "2 meals per day (lunch + dinner)",
        "Priority coordination on WhatsApp",
        "Menu rotates weekly"
      ]
    },
    monthly1: {
      title: "Monthly 1 Meal Plan",
      desc: "Approx weekly pattern repeated. Best value for regular customers.",
      price: 8000,
      days: "Mon–Sat",
      meals: "1",
      bullets: [
        "Best value monthly package",
        "1 meal per day (Mon–Sat)",
        "Stable routine + easy management",
        "Menu rotates with similar balance"
      ]
    },
    monthly2: {
      title: "Monthly 2 Meals Plan",
      desc: "2 meals per day (Mon–Sat). Ideal for full month convenience.",
      price: 16000,
      days: "Mon–Sat",
      meals: "2",
      bullets: [
        "2 meals per day (Mon–Sat)",
        "Priority support",
        "Best for heavy routine / family",
        "Menu rotation maintained"
      ]
    }
  };

  const payDetails = {
    easypaisa: "EasyPaisa • Account Title: Namak Masaala • Number: 03xx-xxxxxxx",
    jazzcash: "JazzCash • Account Title: Namak Masaala • Number: 03xx-xxxxxxx",
    bank: "Bank Transfer • Bank: ____ • Title: ____ • IBAN/ACC: ____",
    cod: "Cash on Delivery • Payment on delivery (timing confirm WhatsApp)."
  };

  const grid = document.getElementById("nmPlanGrid");
  const orderSec = document.getElementById("nmOrderSection");
  const metaRow = document.getElementById("nmSelectedMeta");

  const titleEl = document.getElementById("nmSelectedTitle");
  const descEl = document.getElementById("nmSelectedDesc");
  const priceEl = document.getElementById("nmSelectedPrice");
  const daysEl = document.getElementById("nmSelectedDays");
  const mealsEl = document.getElementById("nmSelectedMeals");
  const bulletsEl = document.getElementById("nmSelectedBullets");

  const amountEl = document.getElementById("nmAmount");
  const payMethodEl = document.getElementById("nmPayMethod");
  const payDetailsEl = document.getElementById("nmPayDetails");

  const form = document.getElementById("nmOrderForm");
  const msg = document.getElementById("nmOrderMsg");

  let selectedPlan = null;

  function setActiveCard(planKey) {
    const cards = grid.querySelectorAll(".nm-plan-card");
    cards.forEach(c => c.classList.toggle("is-active", c.dataset.plan === planKey));
  }

  function renderPlan(planKey) {
    const p = plans[planKey];
    if (!p) return;

    selectedPlan = planKey;
    setActiveCard(planKey);

    titleEl.textContent = p.title;
    descEl.textContent = p.desc;

    metaRow.style.display = "grid";
    priceEl.textContent = `Rs ${p.price.toLocaleString()}`;
    daysEl.textContent = p.days;
    mealsEl.textContent = p.meals;

    bulletsEl.innerHTML = "";
    p.bullets.forEach(b => {
      const li = document.createElement("li");
      li.textContent = b;
      bulletsEl.appendChild(li);
    });

    // show order
    orderSec.style.display = "block";
    amountEl.value = `Rs ${p.price.toLocaleString()}`;

    // payment defaults
    const pm = payMethodEl.value || "easypaisa";
    payDetailsEl.textContent = payDetails[pm] || "";

    // store for later (optional)
    localStorage.setItem("nm_selected_plan", planKey);

    // scroll to order smoothly
    orderSec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (grid) {
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".nm-plan-card");
      if (!card) return;
      renderPlan(card.dataset.plan);
    });
  }

  if (payMethodEl) {
    payMethodEl.addEventListener("change", () => {
      const pm = payMethodEl.value;
      payDetailsEl.textContent = payDetails[pm] || "";
      // if COD, trx optional
      const trx = document.getElementById("nmTrx");
      if (trx) trx.required = (pm !== "cod");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!selectedPlan) return;

      const data = new FormData(form);
      const payload = {
        plan: selectedPlan,
        planTitle: plans[selectedPlan].title,
        amount: plans[selectedPlan].price,
        name: data.get("name"),
        phone: data.get("phone"),
        address: data.get("address"),
        from: data.get("from"),
        to: data.get("to"),
        payMethod: data.get("payMethod"),
        trx: data.get("trx") || ""
      };

      // TEMP store (tum apne orders system me connect kar sakte ho)
      localStorage.setItem("nm_last_order", JSON.stringify(payload));

      msg.textContent = "✅ Order saved! Team will confirm on WhatsApp. (Temporary demo mode)";
      form.reset();
      amountEl.value = `Rs ${plans[selectedPlan].price.toLocaleString()}`;
      payDetailsEl.textContent = payDetails[payMethodEl.value] || "";
    });
  }

  // Restore last selected plan (optional)
  const saved = localStorage.getItem("nm_selected_plan");
  if (saved && plans[saved]) {
    renderPlan(saved);
  }
})();
