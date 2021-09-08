<script>
  import { Router, Route, links } from "svelte-routing";
  import NavLink from "./components/nav/NavLink.svelte";
  import MenuIcon from "./components/nav/MenuIcon.svelte";
  import Landing from "./routes/Landing.svelte";
  import Work from "./routes/Work.svelte";
  import Resume from "./routes/Resume.svelte";
  import content from "./content";
  import MLIP from "./routes/Mlip.svelte";
  import Photography from "./routes/Photography.svelte";
  import NotFound from "./components/NotFound.svelte";
  export let url = "";
  let mobileNavToggled = false;
</script>

<Router {url}>
  <nav use:links>
    <div
      class="nav-container"
      class:mobileNavToggled
      on:click={() => {
        if (mobileNavToggled) mobileNavToggled = false;
      }}
    >
      <div class="mobile-inner-nav">
        <a href="/">James Wang</a>
      </div>
      <div class="mobile-inner-nav">
        <NavLink to="/work">Work 📍</NavLink>
        <NavLink to="/resume">Failure Resume 📰</NavLink>
        <NavLink to="/Photography">Photos 📸</NavLink>
        <NavLink to="/MLIP">MLIP 📗</NavLink>
      </div>
    </div>
    <div class="mobile-content" style="top: 0">
      <button
        class="mobile-dropdown-toggle"
        on:click={() => (mobileNavToggled = !mobileNavToggled)}
      >
        <MenuIcon menuToggled={mobileNavToggled} />
      </button>
    </div>
  </nav>
  <div>
    <Route path="work" component={Work} {...content} />
    <Route path="resume" component={Resume} {...content} />
    <Route path="mlip" component={MLIP} />
    <Route path="photography" component={Photography} />
    <Route component="{NotFound}" />
    <Route path="/">
      <Landing {...content} />
    </Route>
  </div>
</Router>

<style>
  .nav-container {
    color: white;
    display: flex;
    justify-content: space-between;
    padding: 64px 0 15px 0;
  }
  .nav-container :global(a) {
    position: relative;
    font-size: 25px;
    color: #ffffff;
  }

  .mobile-content {
    display: none;
    align-items: inherit;
    flex: 2;
  }

  .nav-container :global(a):hover:before {
    transform: scaleX(1);
  }

  .mobile-dropdown-toggle {
    margin-left: auto;
    background: none;
  }

  .mobile-inner-nav :global(a) {
    margin-right: 1.5rem;
  }

  @media (max-width: 915px) {
    .nav-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 0;
      overflow: hidden;
      display: flex;
      background: #1f1f1f;
      flex-direction: column;
      justify-content: center;
      transition: height 0.3s, opacity 0.4s;
      opacity: 0;
      z-index: 2;
      align-items: flex-start;
      padding-top: 0;
    }

    .mobile-content {
      display: inherit;
      z-index: 2;
      position: fixed;
      background: #1f1f1f;
      width: 100%;
      padding: 30px 0;
    }

    button {
      border: 0;
    }

    .mobileNavToggled {
      height: 100vh;
      opacity: 1;
    }

    .mobile-inner-nav {
      display: flex;
      flex-direction: column;
    }
    .nav-container :global(a) {
      margin: 10px;
      margin-left: 55px;
    }
  }
</style>
