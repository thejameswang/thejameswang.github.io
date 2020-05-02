<script>
  import Bullet from "../components/Bullet.svelte";
  import About from "../components/About.svelte";
  let name = "James";
  export let about = {};
</script>

<style>
  h1 {
    font-family: "Poppins", sans-serif;
    color: #ffffff;
    font-size: 50px;
    font-weight: 1000;
    margin-bottom: 0;
  }

  p {
    font-size: 18px;
  }
  .saying-container p {
    font-size: 35px;
  }

  .highlight {
    color: #9dddc0;
  }

  .highlight-good {
    color: #9dddc0;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-bottom: 8px solid #9dddc0;
    position: relative;
    z-index: -1;
  }

  .landing-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 41.5px 0 0 0;
  }

  .saying-container {
    max-width: 1000px;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 35px;
    }
    .saying-container p {
      font-size: 20px;
    }
    /* .landing-container {
      min-height: 40vh;
    } */
  }
</style>

<section>
  <div class="landing-container">
    <div>
      <h1>
        👋 Hi! I'm
        <span class="highlight">{name}</span>
      </h1>
    </div>
    <div class="saying-container">
      <p>
        I am an aspiring technical product manager who wants to make doing
        <span class="highlight-good underline">good</span>
        easier for everyone.
      </p>
    </div>
  </div>
  <About {about} />
</section>
