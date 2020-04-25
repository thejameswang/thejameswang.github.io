<script>
  export let name = "";
  export let briefDescription = "";
  export let src = "";
  export let alt = "";
  export let link = "#";
  export let positionName = "";
  console.log(src);
</script>

<style>
  div.container {
    width: 350px;
    font-weight: unset;
    display: flex;
    flex-direction: column;
    margin-right: 50px;
  }

  .img-container {
    width: 350px;
    height: 250px;
    overflow: hidden;
    border-radius: 10px;
  }

  div.container:hover img {
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
    font-size: 30px;
    color: white;
  }

  p {
    max-width: 350px;
    margin-bottom: 50px;
    color: white;
    font-size: 16px;
  }

  h4 {
    font-size: 24px;
    color: white;
    margin: 0;
  }
</style>

<div href={link} class="container">
  <div class="img-container">
    <img {src} {alt} />
  </div>
  <h3>{name}</h3>
  <h4>{positionName}</h4>
  <p>
    {@html briefDescription}
  </p>
</div>
