<style>
  li {
    margin-bottom: 5px;
    font-size: 18px;
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
