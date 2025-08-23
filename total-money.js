// total-money.js
// JS for TOTAL Money page

window.addEventListener('DOMContentLoaded', () => {
	// Animate money boxes with staggered delays
	const boxes = document.querySelectorAll('.money-box');
	boxes.forEach((box, i) => {
		box.style.animationDelay = `${i * 0.2}s`;
		box.classList.add('fade-in');
	});
	// Animate result box
	const result = document.querySelector('.result-box');
	if (result) {
		result.classList.add('pop-in');
	}
});
