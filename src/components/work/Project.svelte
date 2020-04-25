<script>
  export let name = "";
  export let briefDescription = "";
  export let src = "";
  export let alt = "";
  export let link = "#";
  console.log(src);
</script>

<style>
  a.container {
    width: 150px;
    font-weight: unset;
    display: flex;
    flex-direction: column;
  }
  .img-container {
    width: 250px;
    height: 200px;
    overflow: hidden;
  }
  a.container:hover img {
    transform: scale(1.2);
  }
  img {
    width: inherit;
    height: inherit;
    transition: transform 0.2s;
  }
  h3 {
    margin-top: 20px;
    margin-bottom: 0px;
    font-size: 16px;
    font-weight: 500;
  }
  h3,
  a.container:hover h3 {
    color: white;
  }
  p {
    max-width: 150px;
    margin-bottom: 15px;
    color: white;
    font-size: 16px;
  }
  .learn-more {
    border-radius: 12px;
    font-weight: normal;
    letter-spacing: inherit;
    text-align: center;
    color: white;
    font-size: 14px;
    padding: 2px 10px;
    border: 2px solid white;
    transition-property: background-color, color;
    transition-duration: 0.2s;
    margin-top: auto;
    display: block;
  }
  a.container:hover .learn-more {
    background-color: white;
    color: black;
  }
</style>

<a href={link} class="container">
  <div class="img-container">
    <img {src} {alt} />
  </div>
  <h3>{name}</h3>
  <p>
    {@html briefDescription}
  </p>
  <div class="learn-more">Read More</div>
</a>
