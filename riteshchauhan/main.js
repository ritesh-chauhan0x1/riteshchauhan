// Animate the features list for a simple effect
const features = document.querySelectorAll('.features li');
features.forEach((li, i) => {
    li.style.opacity = 0;
    setTimeout(() => {
        li.style.opacity = 1;
    }, 400 + i * 200);
});
