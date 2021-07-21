<li>
  <span class="fa-li">
    <i class="fas fa-arrow-right green" />
  </span>
  <slot />
</li>

<style>
  li {
    margin-bottom: 5px;
    font-size: 18px;
    max-width: 700px;
    color: #cdcdcd;
  }

  :global(li a) {
    color: #9dddc0;
    transition: 0.1s;
  }

  :global(li a):hover {
    color: #56dda0;
  }

  :global(li span) {
    color: #9dddc0;
  }
  :global(li b) {
    color: #7ca1ce;
  }

  @media (max-width: 600px) {
    li {
      font-size: 16px;
    }
  }
</style>
