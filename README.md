# My Personal Website: thejameswang.github.io

## The Beginning

During the summer of 2017, I first started my quest of web development and computer science. I chose to create a personal website because it combines multiple skills that I would need to start on a Front-end Web development journey. Of course at that time, I didn't know what that meant. The goal was to create a website completely from scratch with an about me, contact me, experience, projects, and hobbies. Eventually, it would expand to include blog posts.

## The Journey

Starting with code academy's HTML and CSS course, I learned the basics. From basic tags to advanced postioning, I learned the syntax of it all. But, I still felt lost at where to start. Finally, I discovered internetingishard.com. Their HTML and CSS tutorial provided very comprehensive steps on accomplishing my project.

## Bugs and Issues: Resolved

1. Initially, my website used purely flexbox that remained unresponsive. My solution was to chance my entire site to use Bootstrap. Though now I understand the power behind flexbox, Bootstrap still does the job. I can still always change to the use of Flexbox together with Bootstrap.
2. JavaScript was only slightly introduced later to allow scrolling. JQuery was necessary for the smooth transitions.
3. Design: The design is still unpolished, and it requires a revamp. If there are any ideas, please submit a PR!

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.
  `vite dev` and `vite build` wouldn't work in a SvelteKit environment, for example.

This template contains as little as possible to get started with Vite + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```js
// store.js
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
