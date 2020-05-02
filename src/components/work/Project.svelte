<script>
  export let name = "";
  export let briefDescription = "";
  export let src = "";
  export let alt = "";
  export let link = "";
  export let positionName = "";
</script>

<style>
  a.container {
    width: 350px;
    display: flex;
    flex-direction: column;
    margin-right: 3%;
    /* margin-right: auto; */
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
    color: #91a6c0;
  }

  p {
    max-width: 350px;
    margin-bottom: 50px;
    color: white;
    font-size: 16px;
  }

  h4 {
    font-size: 20px;
    color: white;
    margin: 0;
  }

  @media (max-width: 860px) {
    p {
      max-width: 280px;
    }

    a.container {
      width: 280px;
      display: flex;
      transition: 0.5s;
      /* margin-right: auto; */
    }

    .img-container {
      width: 280px;
      height: 200px;
    }
  }
</style>

<a href={link} class="container" target="_blank">
  <div class="img-container">
    <img {src} {alt} />
  </div>
  <h3>{name}</h3>
  <h4>{positionName}</h4>
  <p>
    {@html briefDescription}
  </p>
</a>
