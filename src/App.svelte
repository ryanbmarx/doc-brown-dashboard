<script>
  import DateModule from "./components/Date.svelte";

  export let name;
</script>

<style>
  :root {
    --letter-width: 2rem;
    --gap: 1rem;
    --date-part-padding: 0.5rem;
    --color-label: #4e0b06;
    --dot-height: 0.65rem;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .dash {
    padding: 1rem;
    background-color: #222;
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
  }
</style>

<div class="dash">
  <DateModule
    dateTarget={new Date(1985, 9, 26, 1, 21, 0)}
    accentColor="#F6581B"
    label="Destination time"
  />
  <DateModule
    dateTarget={new Date(1985, 9, 26, 13, 22, 0)}
    accentColor="#4FC93F"
    label="Present time"
  />
  <DateModule
    dateTarget={new Date(1985, 9, 26, 1, 20, 0)}
    accentColor="#E6CA36"
    label="Last time departed"
  />
</div>
