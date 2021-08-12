<script>
  import { Images } from "svelte-images";
  const images = [
    {
      src: "https://live.staticflickr.com/65535/49872110977_bfa5070ea1_b.jpg",

      //   width: 640,
      //   height: 427,
    },
    {
      src: "https://via.placeholder.com/200x280/1",
    },
    {
      src: "https://via.placeholder.com/250x200/1",
    },
    {
      src: "https://via.placeholder.com/250x200/1",
    },
    {
      src: "https://via.placeholder.com/250x200/1g",
    },
    {
      src: "https://via.placeholder.com/250x200/1",
    },
  ];
</script>

<section>
  <h1>Photography 📸</h1>
  <p class="first-container">
    I do portrait photography for fun! Photography is something I
  </p>
  <Images {images} gutter={5} />
</section>

<style>
  .first-container {
    max-width: 700px;
  }
</style>
