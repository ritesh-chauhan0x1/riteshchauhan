// JS for Coinswitch Transaction page
document.addEventListener('DOMContentLoaded', function() {
	const modal = document.getElementById('imgModal');
	const modalImg = document.getElementById('imgModalImg');
	const modalClose = document.getElementById('imgModalClose');
	const imgs = document.querySelectorAll('.responsive-img');

	imgs.forEach(img => {
		img.addEventListener('click', function() {
			modal.style.display = 'flex';
			modalImg.src = this.src;
			modalImg.alt = this.alt;
		});
	});

	modalClose.addEventListener('click', function() {
		modal.style.display = 'none';
		modalImg.src = '';
	});

	modal.addEventListener('click', function(e) {
		if (e.target === modal) {
			modal.style.display = 'none';
			modalImg.src = '';
		}
	});
});
