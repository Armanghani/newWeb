const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thank you. Your enquiry is ready to be connected to the VENICE contact endpoint.');
});
