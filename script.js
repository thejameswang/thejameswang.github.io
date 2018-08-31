$(document).ready(function() {
    window.sr = ScrollReveal({reset: true});
    // Filters project container
    $(".filter-button1").click(function(){
        var value = $(this).attr('data-filter1');
        if(value == "all") {
            $('.filter1').show('1000');
        } else {
            $(".filter1").not('.'+value).hide('3000');
            $('.filter1').filter('.'+value).show('3000');
        }
    });
    // Filters Hobby container
    $(".filter-button").click(function(){
        var value = $(this).attr('data-filter');
        if(value == "all") {
            $('.filter').show('1000');
        } else {
            $(".filter").not('.'+value).hide('3000');
            $('.filter').filter('.'+value).show('3000');
        }
    });
    // Allows smooth scrolling for each anchor tag
    $('a').click(function() {
        $('html, body').animate({
            scrollTop: $( $(this).attr('href') ).offset().top
        }, 500);
        return false;
    });
    // Does scroll revealing
    sr.reveal('.dumb')
    sr.reveal('.about-me')
    sr.reveal('.experience-container')
    sr.reveal('.reveal', {duration:1000, reset:true}, 30)
    sr.reveal('.contact-container', {duration: 1000}, 50)
})
