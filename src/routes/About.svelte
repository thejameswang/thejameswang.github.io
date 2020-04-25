<script>
  import Bullet from "../components/Bullet.svelte";
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
      <p>
        I’m a current 3rd year CS major at the Georgia Institute of Technology.
        I’m terribly passionate about the intersection between technology and
        social good. Currently, I’m pursuing a career in product management
        because I’ve found it’s the best way to reach my goals of making good
        easier for everyone.
      </p>
    </div>
    <div>
      <h2>grow</h2>
      <ul class="fa-ul">
        <Bullet content="Improve writing ability and write more test" />
        <Bullet content="Be a better <span>storyteller</span>" />
        <Bullet
          content="Become a better ambassador of the <span>social impact
          space</span>" />
        <Bullet content="Code more often and learn more tools" />
        <Bullet content="Read with a <span>purpose</span>" />
      </ul>
    </div>
  </div>
</section>
