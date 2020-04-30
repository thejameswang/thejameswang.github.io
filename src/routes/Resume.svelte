<script>
  import Bullet from "../components/Bullet.svelte";
  import { onMount } from "svelte";
  export let Resume = [];
  let scrollClipHeight = 0;

  onMount(() => {
    let resumePDF = document
      .querySelector("#resumePDF")
      .getBoundingClientRect();
    let resumeTip = document.querySelector(".resume-tip-container");

    const doSomething = function doSomething() {
      let currentViewPort =
        window.innerHeight + window.scrollY - (scrollClipHeight || 0);
      console.log("current view port: " + currentViewPort);
      console.log("Resume PDF height: " + resumePDF.top);
      if (currentViewPort > resumePDF.top) {
        resumeTip.style = "opacity: 0";
      } else {
        console.log("NEED TO SHOW RESUME TIP");
        resumeTip.style = "opacity: 1";
      }
    };
    addEventListener("scroll", doSomething, false);
  });
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
    margin-top: 20px;
    font-size: 35px;
  }
  h3 {
    color: #91a6c0;
    font-size: 25px;
    margin: 0;
  }
  .fa-ul {
    margin-left: 24px;
    /* margin: 0; */
  }
  .year-container {
    min-width: 450px;
    margin-right: 2rem;
  }

  .resume-tip-container {
    position: fixed;
    bottom: 0;
    right: 50vw;
    color: white;
    margin-bottom: 10px;
    transition: transform 0.2s;
    z-index: 1;
  }

  .resume-tip-container h2 {
    font-family: "Open Sans", sans-serif;
    color: white;
    font-size: 25px;
  }

  .resume-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .resume-tip-container:hover {
    transform: scale(1.2);
  }

  .arrow-large {
    font-size: 40px;
  }

  #resumePDF {
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 600px) {
    /* .resume-tip-container {
      opacity: 0;
    } */
  }
</style>

<section class="resume-container">
  <h1>Failure Resume 📰</h1>
  <p></p>
  <div class="resume-tip-container">
    <a href="#resumePDF" class="resume-tip">
      <h2>Resume?</h2>
      <i class="fas fa-angle-down arrow-large" />
    </a>
  </div>
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

  <div id="resumePDF">
    <h2>Resume</h2>
    <iframe
      title="resume pdf"
      src="https://drive.google.com/file/d/1c8m8yz5qYzgZK2sMbfMnKu9yI1_Z753z/preview"
      width="640"
      height="480" />
  </div>
</section>

<!-- 
let bounding = resumePDF.getBoundingClientRect();
    if (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    ) {
      console.log("In the viewport!");
    } else {
      console.log("Not in the viewport... whomp whomp");
    } -->
