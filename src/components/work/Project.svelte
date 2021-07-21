<script>
  export let name = "";
  // export let briefDescription = "";
  export let src = "";
  export let alt = "";
  export let link = "";
  export let positionName = "";
  export let year = "";
</script>

<a href={link} class="container" target="_blank">
  <div class="img-container">
    <img {src} {alt} />
  </div>
  <div class="desc-container">
    <h3>{name}</h3>
    <h4>{positionName}</h4>
    <h4>{year}</h4>
  </div>
</a>

<style>
  a.container {
    width: 350px;
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
  }

  .img-container {
    width: 350px;
    height: 250px;
    overflow: hidden;
    border-radius: 15px;
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
    margin-top: 10px;
    margin-bottom: 0px;
    font-size: 25px;
    color: #9dddc0;
    /* letter-spacing: 0.05rem; */
  }

  /* p {
    max-width: 350px;
    margin-bottom: 50px;
    color: white;
    font-size: 16px;
  } */

  h4 {
    font-size: 16px;
    text-transform: uppercase;
    color: white;
    margin: 0;
    letter-spacing: 0.05rem;
  }

  .desc-container {
    text-align: center;
  }

  @media (max-width: 860px) {
    /* p {
      max-width: 280px;
    } */

    a.container {
      width: 280px;
      display: flex;
      transition: 0.5s;
    }

    .img-container {
      width: 280px;
      height: 200px;
    }
  }
</style>
