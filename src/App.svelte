<script>
  import { Router, Link, Route } from "svelte-routing";
  import Landing from "./routes/Landing.svelte";
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

  a {
    color: #ffffff;
  }

  /* a {
    color: rgb(0, 100, 200);
    text-decoration: none;
  } */

  a:hover {
    text-decoration: underline;
  }

  a:visited {
    color: rgb(0, 80, 160);
  }
</style>

<Router url="">
  <nav>
    <div>
      <Link to="/">Home</Link>
    </div>
    <div>
      <Link to="/about">About 🤗</Link>
      <Link to="/work">Work 📍</Link>
      <Link to="/resume">Resume 📰</Link>
      <Link to="/goodtimes">Good Times 🎇</Link>
    </div>
  </nav>
  <div>
    <Route path="/">
      <Landing />
    </Route>
  </div>
</Router>
