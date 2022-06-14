<script>
  import Bullet from "../components/Bullet.svelte";
  import { onMount } from "svelte";
  export let Resume = [];
  let scrollClipHeight = 0;
</script>

<section class="resume-container">
  <h1>Failure Resume 📰</h1>
  <p class="first-container">
    They say you learn more from your failures than your successes. I see my
    failure résumé as a list of times where I didn't reach where I thought I
    could have or made choices I shouldn't have made. Rather than being
    disappointed (though maybe a little at the time), I'm proud to be a failure!
  </p>
  <p class="first-container">
    This wasn't my idea! Here are a few resources that inspired me, <a
      href="https://www.nytimes.com/2019/02/03/smarter-living/failure-resume.html"
      >NYT</a
    >,
    <a
      href="https://hbr.org/2016/05/write-a-failure-resume-to-learn-what-makes-you-succeed"
      >HBR</a
    >,
    <a href="https://www.nature.com/articles/nj7322-467a">Melanie Stefan</a>,
    and many people who've since published their failure resumes online!
  </p>
  <p class="first-container">
    If you're actually looking for my Resume,
    <a
      href="https://drive.google.com/file/d/1gTe-b0CE4JXGU59Kc08i89ErjK3EFxS5/view"
      target="_blank"
    >
      click here</a
    >!
  </p>
  <p class="first-container"><i>Last Updated: Dec 9, 2021</i></p>
  {#each Resume as year}
    <h2>{year[0]}</h2>
    <div class="suc-fail">
      <div class="year-container">
        <ul class="fa-ul">
          {#each year[1].failures as failure}
            <Bullet>
              {@html failure}
            </Bullet>
          {/each}
        </ul>
      </div>
    </div>
  {/each}
</section>

<style>
  .resume-container {
    display: flex;
    flex-direction: column;
  }

  .suc-fail {
    display: flex;
    flex-wrap: wrap;
  }

  a {
    color: #9dddc0;
    transition: 0.5s;
  }

  a:hover {
    color: #56dda0;
  }

  h1 {
    margin-bottom: 10px;
  }

  h2 {
    margin: 0;
    margin-top: 20px;
    font-size: 35px;
  }

  .fa-ul {
    margin-left: 24px;
  }
  .year-container {
    margin-right: 2rem;
  }

  .first-container {
    max-width: 900px;
  }

  .first-container {
    font-size: 18px;
  }
</style>
