<script>
  import { Router, Route, links } from "svelte-routing";
  import NavLink from "./components/nav/NavLink.svelte";
  import MenuIcon from "./components/nav/MenuIcon.svelte";
  import Landing from "./routes/Landing.svelte";
  import About from "./routes/About.svelte";
  import Work from "./routes/Work.svelte";
  import Resume from "./routes/Resume.svelte";
  import Goodtimes from "./routes/Goodtimes.svelte";
  import content from "./content";
  export let url = "";
  let mobileNavToggled = false;
</script>

<style>
  .nav-container {
    color: white;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    padding-bottom: 15px;
    padding-left: 65px;
  }
  .nav-container :global(a) {
    margin: 30px;
    position: relative;
    font-size: 25px;
  }

  .nav-container :global(a):before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 8px solid #9dddc0;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s;
    margin-bottom: -9px;
  }

  .mobile-content {
    display: none;
    align-items: inherit;
    flex: 2;
  }

  .nav-container :global(a):hover:before,
  .nav-container :global(a).active:before {
    transform: scaleX(1);
  }

  .mobile-dropdown-toggle {
    margin-left: auto;
    background: none;
  }
  @media (max-width: 1000px) {
    .nav-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 0;
      overflow: hidden;
      display: flex;
      background: #404040;
      flex-direction: column;
      justify-content: center;
      transition: height 0.3s, opacity 0.4s;
      opacity: 0;
      z-index: 2;
    }

    .nav-container :global(a):before {
      transform-origin: center;
    }

    .mobile-content {
      display: inherit;
      z-index: 2;
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
      text-align: center;
    }

    @media (max-width: 600px) {
      .nav-container :global(a) {
        margin: 10px;
      }
    }
  }
</style>

<Router {url}>
  <nav use:links>
    <div
      class="nav-container"
      class:mobileNavToggled
      on:click={() => {
        if (mobileNavToggled) mobileNavToggled = false;
      }}>
      <div class="mobile-inner-nav">
        <a href="/">James Wang</a>
      </div>
      <div class="mobile-inner-nav">
        <NavLink to="/me">About 🤗</NavLink>
        <NavLink to="/work">Work 📍</NavLink>
        <NavLink to="/resume">Resume 📰</NavLink>
        <!-- <NavLink to="/goodtimes">Good Times 🎇</NavLink> -->
      </div>
    </div>
    <div class="mobile-content">
      <button
        class="mobile-dropdown-toggle"
        on:click={() => (mobileNavToggled = !mobileNavToggled)}>
        <MenuIcon menuToggled={mobileNavToggled} />
      </button>
    </div>
  </nav>
  <div>
    <Route path="me" component={About} {...content} />
    <Route path="work" component={Work} {...content} />
    <Route path="resume" component={Resume} {...content} />
    <!-- <Route path="goodtimes" component={Goodtimes} {...content} /> -->
    <Route path="/">
      <Landing />
    </Route>
  </div>
</Router>
