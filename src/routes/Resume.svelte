<script>
  import Bullet from "../components/Bullet.svelte";
  export let Resume = [];
  console.log(Resume);
</script>

<style>
  .resume-container {
    display: flex;
    flex-direction: column;
  }
  .suc-fail {
    display: flex;
    flex-wrap: wrap;
  }
  h2 {
    margin: 0;
    font-size: 35px;
  }
  h3 {
    color: #91a6c0;
    font-family: "Alegreya", serif;
    font-size: 25px;
    margin: 0;
  }
  .fa-ul {
    margin-left: 24px;
    /* margin: 0; */
  }
  .year-container {
    min-width: 35vw;
    margin-right: 2rem;
  }
</style>

<section class="resume-container">
  <h1>Resume 📰</h1>
  {#each Resume as year}
    <h2>{year[0]}</h2>
    <div class="suc-fail">
      <div class="year-container">
        <h3>Failures</h3>
        <ul class="fa-ul">
          {#each year[1].failures as failure}
            <Bullet>
              {@html failure}
            </Bullet>
          {/each}
        </ul>
      </div>
      <div class="year-container">
        <h3>Successes</h3>
        <ul class="fa-ul">
          {#each year[1].successes as success}
            <Bullet>
              {@html success}
            </Bullet>
          {/each}
        </ul>
      </div>
    </div>
  {/each}
  <div class ="resume-tip">
  <h2>Resume</h2>
  </div>
</section>
