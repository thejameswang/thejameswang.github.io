<script>
  import { Images } from "svelte-images";
  const images = [
    {
      src: "https://live.staticflickr.com/65535/49872110977_bfa5070ea1_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/49871263308_1d3e2955df_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376104576_6f5d417d62_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376334643_08fe02d60d_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51375306602_5d6384a98d_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51375337352_20f7c1f3dc_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376808584_097a2c2c22_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376303458_811bc9656c_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376808884_abf261dcaa_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51375307282_f78fa093d3_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376538624_1b733b552b_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376032763_f7b2d4ed82_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51375023962_fc444594f0_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376786005_770fe216d0_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376006938_0fb11c712e_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376512899_df04a6b2ea_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51376512784_d464c3be6c_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51375752926_72240627e7_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/51375753036_c00a7fb8c3_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/49871799026_8bf8fed62f_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/49871274108_be5bea2493_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/49872132357_084edc50f5_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/49871405482_d78bc00fa6_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/65535/49871081596_03c6a05f05_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/4800/39860699775_59132e4708_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/4776/40009331524_db4d86692d_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/4793/25884490397_6f9712b10f_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/4789/39860551235_71c3728c6c_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/4726/38802546164_9ff19d878c_b.jpg",
    },
    {
      src: "https://live.staticflickr.com/4334/36447307336_b1ce6ed3fd_b.jpg",
    },
  ];
</script>

<section class="section-container">
  <h1>Photography 📸</h1>
  <p class="first-container">
    I do portrait photography for fun! Photography is something I love to do
    when I visit a new area or one of my friends/new friends wants a photoshoot!
  </p>
  <p class="first-container">
    You can find my photography on <a
      href="https://www.flickr.com/people/145227047@N06/"
      target="_blank">Flickr</a
    >
    and
    <a href="https://www.instagram.com/jamesmakesnewfriends" target="_blank"
      >Instagram</a
    >!
  </p>

  <Images {images} gutter={3} numCols={5} />
</section>

<style>
  .section-container {
    display: relative;
    flex-direction: column;
  }
  .first-container {
    max-width: 700px;
  }

  section {
    margin-bottom: -1000px;
  }

  p a {
    color: #9dddc0;
    transition: 0.1s;
  }

  p a:hover {
    color: #56dda0;
  }
</style>
