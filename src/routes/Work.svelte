<script>
  import Project from "../components/work/Project.svelte";
  export let work = {};
</script>

<style>
  .work-container {
    display: flex;
    flex-direction: column;
  }

  .projects-container {
    display: flex;
    flex-wrap: wrap;
  }
</style>

<section class="work-container">
  <h1>Work 📍</h1>
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
