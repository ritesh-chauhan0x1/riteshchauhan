// blackmailing.js
// JS for Prashanna Blackmailing Report page

// Optional: Add fade-in animation for boxes
window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.box').forEach((box, i) => {
		box.style.opacity = 0;
		setTimeout(() => {
			box.style.transition = 'opacity 0.7s';
			box.style.opacity = 1;
		}, 200 + i * 200);
	});
});
