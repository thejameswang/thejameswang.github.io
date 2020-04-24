<script>
  import { Router, Link, Route } from "svelte-routing";
  import Landing from "./routes/Landing.svelte";
  import About from "./routes/About.svelte";
  import Work from "./routes/Work.svelte";
  import Resume from "./routes/Resume.svelte";
  import Goodtimes from "./routes/Goodtimes.svelte";
  // import { Landing, About, Work, Resume, Goodtimes } from "./routes";
  export let url = "";
</script>

<style>
  nav {
    color: white;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    width: 100%;
  }
  nav :global(a) {
    color: #ffffff;
    text-decoration: None;
  }
</style>

<Router {url}>
  <nav>
    <div>
      <Link to="/">Home</Link>
    </div>
    <div>
      <Link to="about">About 🤗</Link>
      <Link to="work">Work 📍</Link>
      <Link to="resume">Resume 📰</Link>
      <Link to="goodtimes">Good Times 🎇</Link>
    </div>
  </nav>
  <div>
    <Route path="about" component={About} />
    <Route path="work" component={Work} />
    <Route path="resume" component={Resume} />
    <Route path="goodtimes" component={Goodtimes} />
    <Route path="/">
      <Landing />
    </Route>
  </div>
</Router>
