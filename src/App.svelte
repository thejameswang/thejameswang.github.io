<script>
  import { Router, Link, Route } from "svelte-routing";
  import Landing from "./routes/Landing.svelte";
</script>

<style>
  nav {
    color: white;
  }
  link {
    color: #ffffff;
  }
</style>

<Router url="">
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About 🤗</Link>
    <Link to="/work">Work 📍</Link>
    <Link to="/resume">Resume 📰</Link>
    <Link to="/goodtimes">Good Times 🎇</Link>
  </nav>
  <div>
    <Route path="/">
      <Landing />
    </Route>
  </div>
</Router>
