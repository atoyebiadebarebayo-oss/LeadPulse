// --- STATE & CALCULATOR LOGIC ---
const calcType = document.getElementById('calc-type');
const addonChecks = document.querySelectorAll('.addon-check');
const calcTotalPrice = document.getElementById('calc-total-price');
const calcTotalDays = document.getElementById('calc-total-days');
const bookQuoteBtn = document.getElementById('book-quote-btn');

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const leadModal = document.getElementById('lead-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const openLeadBtns = document.querySelectorAll('.open-lead-modal');

const mainLeadForm = document.getElementById('main-lead-form');
const modalLeadForm = document.getElementById('modal-lead-form');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  calculateQuote();
});

// --- THEME ENGINE ---
function initTheme() {
  if (localStorage.getItem('leadpulse_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.querySelector('i').className = 'fa-solid fa-sun';
  }
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('leadpulse_theme', isDark ? 'dark' : 'light');
  themeToggleBtn.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});

// --- CALCULATOR ENGINE ---
function calculateQuote() {
  const selectedOption = calcType.options[calcType.selectedIndex];
  let basePrice = parseInt(selectedOption.getAttribute('data-price'));
  let baseDays = parseInt(selectedOption.getAttribute('data-days'));

  let selectedAddons = [];

  addonChecks.forEach(check => {
    if (check.checked) {
      basePrice += parseInt(check.getAttribute('data-price'));
      baseDays += parseInt(check.getAttribute('data-days'));
      selectedAddons.push(check.getAttribute('data-name'));
    }
  });

  calcTotalPrice.innerText = `$${basePrice.toLocaleString()}`;
  calcTotalDays.innerText = `${baseDays} Business Days`;

  return {
    type: selectedOption.text,
    price: basePrice,
    days: baseDays,
    addons: selectedAddons
  };
}

calcType.addEventListener('change', calculateQuote);
addonChecks.forEach(check => check.addEventListener('change', calculateQuote));

// --- WHATSAPP QUOTE ROUTER ---
bookQuoteBtn.addEventListener('click', () => {
  const quote = calculateQuote();
  const phone = '15550192834'; // Replace with client's real WhatsApp number
  
  let msg = `Hello Apex Digital! I generated a custom quote on your website:\n\n`;
  msg += `• *Package*: ${quote.type}\n`;
  msg += `• *Add-ons*: ${quote.addons.length > 0 ? quote.addons.join(', ') : 'None'}\n`;
  msg += `• *Estimated Price*: $${quote.price}\n`;
  msg += `• *Turnaround*: ${quote.days} Business Days\n\n`;
  msg += `I would like to confirm this quote and get started!`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
});

// --- MODAL CONTROLS ---
openLeadBtns.forEach(btn => {
  btn.addEventListener('click', () => leadModal.classList.add('active'));
});

closeModalBtn.addEventListener('click', () => leadModal.classList.remove('active'));

window.addEventListener('click', (e) => {
  if (e.target === leadModal) leadModal.classList.remove('active');
});

// --- FORM SUBMISSION & LOCALSTORAGE CAPTURE ---
function handleLeadSubmit(name, email, phone, details = '') {
  const leads = JSON.parse(localStorage.getItem('leadpulse_leads')) || [];
  leads.push({
    id: Date.now().toString(),
    name,
    email,
    phone,
    details,
    date: new Date().toISOString()
  });
  localStorage.setItem('leadpulse_leads', JSON.stringify(leads));

  alert(`Thank you, ${name}! Your request has been received. Our team will contact you shortly.`);
}

mainLeadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleLeadSubmit(
    document.getElementById('lead-name').value,
    document.getElementById('lead-email').value,
    document.getElementById('lead-phone').value,
    document.getElementById('lead-message').value
  );
  mainLeadForm.reset();
});

modalLeadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleLeadSubmit(
    document.getElementById('modal-name').value,
    document.getElementById('modal-email').value,
    document.getElementById('modal-phone').value
  );
  modalLeadForm.reset();
  leadModal.classList.remove('active');
});