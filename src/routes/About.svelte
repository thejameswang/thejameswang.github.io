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
  }

  p {
    font-size: 18px;
  }

  a {
    padding-top: 20px;
    margin-right: 30px;
  }

  .social-media-container {
    display: flex;
    flex-wrap: wrap;
  }

  .scale:hover {
    transform: scale(1.2);
  }

  .scale {
    transition: transform 0.2s;
  }

  @media (max-width: 600px) {
    p {
      font-size: 16px;
    }
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
    <div class="social-media-container">
      {#each about.social as social}
        <a href={social.link} target="_blank" class="scale">
          <img src={social.src} alt={social.alt} />
        </a>
      {/each}
    </div>
  </div>
</section>
