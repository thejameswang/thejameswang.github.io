<style>
  li {
    margin-bottom: 5px;
    font-size: 18px;
    max-width: 700px;
  }

  :global(li a) {
    color: #9dddc0;
    transition: 0.1s;
  }

  :global(li a):hover {
    color: #56dda0;
  }

  :global(span) {
    color: #9dddc0;
  }

  @media (max-width: 600px) {
    li {
      font-size: 16px;
    }
  }
</style>

<li>
  <span class="fa-li">
    <i class="fas fa-arrow-right green" />
  </span>
  <slot />
</li>
