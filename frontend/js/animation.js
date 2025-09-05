// Simple animation for form
window.onload = function() {
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = 0;
    setTimeout(() => {
      container.style.opacity = 1;
      container.style.transition = 'opacity 1s';
    }, 100);
  }
};
