window.sr = ScrollReveal({reset: true});
$(document).ready(function() {
  $('a').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
  });
})
sr.reveal('.dumb')
sr.reveal('.about-me')
sr.reveal('.experience-container')
//Project reveal
sr.reveal('.Projects')
sr.reveal('.reveal', {duration:500, reset:true}, 50)
//Contact
sr.reveal('.contact-container', {duration: 1000}, 50)
