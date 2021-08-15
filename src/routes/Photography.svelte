<script>
  import { Images } from "svelte-images";
  const images = [
    {
      src: "https://live.staticflickr.com/65535/49872110977_bfa5070ea1_b.jpg"
    },
    {
      src: "https://live.staticflickr.com/65535/49871263308_1d3e2955df_b.jpg"
    },
    {
      src: "https://live.staticflickr.com/65535/51376104576_6f5d417d62_b.jpg"
    },
    {
      src: "https://live.staticflickr.com/65535/51376334643_08fe02d60d_b.jpg"
    },
    {
      src: "https://live.staticflickr.com/65535/51375306602_5d6384a98d_b.jpg"
    },
    {
      src: "https://live.staticflickr.com/65535/51375337352_20f7c1f3dc_b.jpg"
    },

    {
      src: "https://live.staticflickr.com/65535/51376808584_097a2c2c22_b.jpg"
    },
    {
      src: "https://live.staticflickr.com/65535/51376303458_811bc9656c_b.jpg"
    },
    {
      src: "https://live.staticflickr.com/65535/51376808884_abf261dcaa_b.jpg"
    },
    {
      src: "https://live.staticflickr.com/65535/51375307282_f78fa093d3_b.jpg"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    },
    {
      src: "https://via.placeholder.com/250x200/1"
    }
  ];
</script>

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

  /* h1 {
    margin: 0;
  } */

  /* p a {
    color: #9dddc0;
    transition: 0.1s;xR
  }

  p a:hover {
    color: #56dda0;
  } */
</style>

<section class="section-container">
  <h1>Photography 📸</h1>
  <p class="first-container">
    I do portrait photography for fun! Photography is something I love to do
    when I visit a new area or one of my friends/new friends wants a photoshoot!
  </p>

  <p class="first-container">You can find my photography on and Flickr!</p>
  <p>Testing</p>
  <Images {images} gutter={3} numCols={5} />
</section>
