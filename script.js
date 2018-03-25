window.sr = ScrollReveal({reset: true});
$(document).ready(function() {
  $('a').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
  });
})
sr.reveal('.about-me')
sr.reveal('.experience-container')
sr.reveal('.Projects-Header-Container')
sr.reveal('.my-work-content-items')
// sr.reveal('.')
sr.reveal('.marketing')
sr.reveal('.projects')
sr.reveal('.community')
sr.reveal('.contact')
