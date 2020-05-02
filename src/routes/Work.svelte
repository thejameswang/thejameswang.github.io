<script>
  import Project from "../components/work/Project.svelte";
  export let work = {};
</script>

<style>
  .work-container {
    display: flex;
    flex-direction: column;
  }

  h1 {
    margin-bottom: 10px;
  }

  h2 {
    font-size: 35px;
  }

  .projects-container {
    display: flex;
    flex-wrap: wrap;
  }

  .first-container {
    max-width: 700px;
  }

  .first-container {
    font-size: 18px;
  }
</style>

<section class="work-container">
  <h1>Work 📍</h1>
  <p class="first-container">
    Work is probably the wrong word. This is a congolmeration of projects,
    internships, research, and leadership roles. We could call it PIRL, but I
    don't think anyone would understand. I could make it a new trend, but I
    think it would be a losing battle.
  </p>
  <h2>current works</h2>
  <div class="projects-container">
    {#each work.current as project}
      <Project {...project} />
    {/each}
  </div>
  <h2>old works</h2>
  <div class="projects-container">
    {#each work.old as project}
      <Project {...project} />
    {/each}
  </div>
</section>
