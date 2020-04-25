<script>
  import Bullet from "../components/Bullet.svelte";
  export let about = {};
</script>

<style>
  .about-container {
    display: flex;
    flex-direction: column;
    max-width: 700px;
  }

  .fa-ul {
    margin-left: 24px;
    /* margin: 0; */
  }
</style>

<section>
  <div class="about-container">
    <h1>About 🤗</h1>
    <div>
      <h2>who</h2>
      <p>{about.who}</p>
    </div>
    <div>
      <h2>grow</h2>
      <ul class="fa-ul">
        {#each about.grow as grow}
          <Bullet>
            {@html grow}
          </Bullet>
        {/each}
      </ul>
    </div>
  </div>
</section>
