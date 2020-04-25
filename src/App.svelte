<script>
  import { Router, Route, links } from "svelte-routing";
  import NavLink from "./components/NavLink.svelte";
  import Landing from "./routes/Landing.svelte";
  import About from "./routes/About.svelte";
  import Work from "./routes/Work.svelte";
  import Resume from "./routes/Resume.svelte";
  import Goodtimes from "./routes/Goodtimes.svelte";
  import content from "./content";
  export let url = "";
</script>

<style>
  nav {
    color: white;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    width: 100%;
    /* box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15); */
    padding-bottom: 15px;
    align-items: center;
  }
  nav :global(a) {
    margin: 30px;
    position: relative;
    font-size: 25px;
  }

  nav :global(a):before {
    /* border-bottom: 8px solid #9dddc0;
    -webkit-transition: 0.1s all ease;
    transition: 0.1s all ease; */
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
    margin-bottom: -5px;
  }

  nav :global(a):hover:before,
  nav :global(a).active:before {
    transform: scaleX(1);
  }
</style>

<Router {url}>
  <nav use:links>
    <div>
      <a href="/">Home</a>
    </div>
    <div>
      <NavLink to="/about">About 🤗</NavLink>
      <NavLink to="/work">Work 📍</NavLink>
      <NavLink to="/resume">Resume 📰</NavLink>
      <NavLink to="/goodtimes">Good Times 🎇</NavLink>
    </div>
  </nav>
  <div>
    <Route path="about" component={About} {...content} />
    <Route path="work" component={Work} {...content} />
    <Route path="resume" component={Resume} />
    <Route path="goodtimes" component={Goodtimes} />
    <Route path="/">
      <Landing />
    </Route>
  </div>
</Router>
