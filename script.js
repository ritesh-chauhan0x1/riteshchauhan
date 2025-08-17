document.addEventListener('DOMContentLoaded', function() {
    // Loading screen logic
    setTimeout(function() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').style.display = '';
        // Show floating social icons
        var social = document.querySelector('.floating-social-icons');
        if (social) social.style.display = 'flex';
    }, 2000);
    // Hide floating social icons until loaded
    var social = document.querySelector('.floating-social-icons');
    if (social) social.style.display = 'none';
});
