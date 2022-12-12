<script>
  import DateModule from "./components/Date.svelte";
  import Keypad from "./components/Keypad.svelte";
  import Speedometer from "./components/Speedometer.svelte";

  let keypad;

  let datesVisited = [new Date(1985, 9, 26, 1, 21, 0)];

  const dates = [
    {
      dateTarget: new Date(1985, 9, 26, 1, 20, 0),
      accentColor: "#F6581B",
      label: "Destination time",
      class: "destination",
    },
    {
      dateTarget: new Date(),
      accentColor: "#4FC93F",
      label: "Present time",
      class: "present",
    },

    {
      dateTarget: datesVisited.at(-1),
      accentColor: "#E6CA36",
      label: "Last time departed",
      class: "departed",
    },
  ];
  // const dates = [
  //   {
  //     dateTarget: new Date(1985, 9, 26, 1, 21, 0),
  //     accentColor: "#F6581B",
  //     label: "Destination time",
  //   },
  //   {
  //     dateTarget: new Date(1985, 9, 26, 13, 22, 0),
  //     accentColor: "#4FC93F",
  //     label: "Present time",
  //   },

  //   {
  //     dateTarget: new Date(1985, 9, 26, 1, 20, 0),
  //     accentColor: "#E6CA36",
  //     label: "Last time departed",
  //   },
  // ];
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
    grid-column: 1/-1;
    padding: 1rem;
    background-color: #222;
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
  }

  main {
    display: grid;
    gap: var(--gap);
    grid-template: auto auto / minmax(1px, 2fr) minmax(1px, 1fr);
  }
</style>

<main>
  <div class="dash">
    {#each dates as date}
      <DateModule {...date} />
    {/each}
  </div>

  <Keypad bind:this={keypad} />
  <Speedometer />
</main>
