<script>
  import Bullet from "../components/Bullet.svelte";
  export let about = {};
</script>

<div class="social-media-container">
  {#each about.social as social}
    <a href={social.link} target="_blank" class="scale">
      <img src={social.src} alt={social.alt} width="30px" />
    </a>
  {/each}
</div>
<div class="about-container">
  <div>
    <h2>who am i 🙆‍♂️</h2>
    <p>{about.who}</p>
  </div>
  <div>
    <h2>how i grow 💪</h2>
    <ul class="fa-ul">
      {#each about.grow as grow}
        <Bullet>
          {@html grow}
        </Bullet>
      {/each}
    </ul>
  </div>
  <div>
    <h2>fun facts 🏂</h2>
    <ul class="fa-ul">
      {#each about.funFacts as funFacts}
        <Bullet>
          {@html funFacts}
        </Bullet>
      {/each}
    </ul>
  </div>
  <div>
    <h2>What I use 💻</h2>
    <ul class="fa-ul">
      {#each about.using as use}
        <Bullet>
          {@html use}
        </Bullet>
      {/each}
    </ul>
  </div>
</div>

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
    margin-right: 30px;
  }

  .social-media-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 50px;
    align-items: center;
    margin-left: 5px;
  }

  .scale:hover {
    transform: scale(1.4);
  }

  .scale {
    transform: scale(1.2);
    transition: transform 0.2s;
  }

  @media (max-width: 600px) {
    p {
      font-size: 16px;
    }
  }
</style>
