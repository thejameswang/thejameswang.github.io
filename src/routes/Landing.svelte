<script>
  let name = "James Wang";
</script>

<style>
  h1 {
    font-family: "Alegreya", serif;
    color: #ffffff;
    font-size: 50px;
  }

  p {
    font-family: "Open Sans", sans-serif;
    color: #ffffff;
    font-size: 35px;
  }

  .highlight {
    color: #9dddc0;
  }

  .highlight-good {
    color: #9dddc0;
    font-weight: 600;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  .underline {
    text-decoration: underline;
    -webkit-text-decoration-color: rgba(157, 221, 192, 0.4); /* Safari */
    text-decoration-color: rgba(157, 221, 192, 0.8);
  }

  .landing-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px;
    /* text-align: center; */
  }

  .saying-container {
    padding-right: 20em;
  }
</style>

<div class="landing-container">
  <div class="">
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
</div>
