window.sr = ScrollReveal({reset: true});
$(document).ready(function() {
    $(".filter-button1").click(function(){
        var value = $(this).attr('data-filter1');

        if(value == "all")
        {
            //$('.filter').removeClass('hidden');
            $('.filter1').show('1000');
        }
        else
        {
//            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
//            $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
            $(".filter1").not('.'+value).hide('3000');
            $('.filter1').filter('.'+value).show('3000');

        }
    });
    $(".filter-button").click(function(){
        var value = $(this).attr('data-filter');

        if(value == "all")
        {
            //$('.filter').removeClass('hidden');
            $('.filter').show('1000');
        }
        else
        {
//            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
//            $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
            $(".filter").not('.'+value).hide('3000');
            $('.filter').filter('.'+value).show('3000');

        }
    });
    $('a').click(function(){
        $('html, body').animate({
            scrollTop: $( $(this).attr('href') ).offset().top
        }, 500);
        return false;
    });
    sr.reveal('.dumb')
    sr.reveal('.about-me')
    sr.reveal('.experience-container')
    //Project reveal
    sr.reveal('.Projects')
    sr.reveal('.reveal', {duration:500, reset:true}, 50)
    //Contact
    sr.reveal('.contact-container', {duration: 1000}, 50)
})
