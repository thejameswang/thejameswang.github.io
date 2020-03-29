$(document).ready(function() {
  $("#home").backstretch(
    "https://c1.staticflickr.com/9/8529/28113938684_4873d33485_c.jpg"
  );
  window.sr = ScrollReveal({ reset: true });
  // Filters project container
  $(".filter-button1").click(function() {
    var value = $(this).attr("data-filter1");
    if (value == "all") {
      $(".filter1").show("1000");
    } else {
      $(".filter1")
        .not("." + value)
        .hide("3000");
      $(".filter1")
        .filter("." + value)
        .show("3000");
    }
  });
  // Filters Hobby container
  $(".filter-button").click(function() {
    var value = $(this).attr("data-filter");
    if (value == "all") {
      $(".filter").show("1000");
    } else {
      $(".filter")
        .not("." + value)
        .hide("3000");
      $(".filter")
        .filter("." + value)
        .show("3000");
    }
  });
  // Allows smooth scrolling for each anchor tag
  $("a").click(function() {
    $("html, body").animate(
      {
        scrollTop: $($(this).attr("href")).offset().top
      },
      500
    );
    return false;
  });
  // Does scroll revealing
  sr.reveal(".dumb");
  sr.reveal(".about-me");
  sr.reveal(".experience-container");
  sr.reveal(".reveal", { duration: 1000, reset: true }, 30);
  sr.reveal(".contact-container", { duration: 1000 }, 50);

  //   var coll = document.getElementsByClassName("collapsible");

  $(".header").click(function() {
    $header = $(this);
    //getting the next element
    $content = $header.next();
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $content.slideToggle(500, function() {
      //execute this after slideToggle is done
      //change text of header based on visibility of content div
      $header.text(function() {
        //change text based on condition
        return $content.is(":visible") ? "Collapse" : "Expand";
      });
    });
  });
  //   for (i = 0; i < coll.length; i++) {
  //     coll[i].addEventListener("click", function() {
  //       this.classList.toggle("active");
  //       var content = this.nextElementSibling;
  //       if (content.style.display === "block") {
  //         content.style.display = "none";
  //       } else {
  //         content.style.display = "block";
  //       }
  //     });
  //   }

  //   $("#cE").click(function() {});
});

// function
