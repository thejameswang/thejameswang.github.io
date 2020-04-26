<script>
  import { Link } from "svelte-routing";
  export let to = "";
  const getProps = ({ isCurrent }) => ({ class: isCurrent ? "active" : "" });
</script>

<Link {to} {getProps}>
  <slot />
</Link>
