// other-money.js
// JS for Other Money page

window.addEventListener('DOMContentLoaded', () => {
	// Animate transaction boxes with staggered delays
	const boxes = document.querySelectorAll('.transaction-box');
	boxes.forEach((box, i) => {
		box.style.animationDelay = `${i * 0.2}s`;
		box.classList.add('fade-in');
	});

	// Animate total box
	const total = document.querySelector('.highlight.total-box');
	if (total) {
		total.classList.add('pop-in');
	}
});
