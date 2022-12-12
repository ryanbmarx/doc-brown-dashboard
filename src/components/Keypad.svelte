<script>
  import Date from "./Date.svelte";

  export let value;

  const lights = ["red", "yellow", "lightgreen", "yellow"];
  let input = "";
  let blink = true;
  const minimum = 8;
  function updateDate(e) {
    if (input.length < minimum) return;

    console.log("updating");

    const month = +input.slice(0, 2);
    const day = +input.slice(2, 4);
    const year = +input.slice(4, 8);

    const hours = +input.slice(8, 10) || 0;
    const minutes = +input.slice(10) || 0;

    console.log({ month, day, year, hours, minutes });

    window.dispatchEvent(new Event("go"));
    // if (month && day && year) {
    //   //   value = new Date(year, month, day, hours, minutes);
    //   console.log({ value: new Date(year, month, day, hours, minutes) });
    // }
  }

  function handleNumber(e) {
    const number = e.target.textContent;
    input += number;
  }

  function onReset() {
    input = "";
  }
</script>

<style>
  .controls {
    --lights-width: 3rem;
    --lights-padding: 0;
    width: 100%;
    max-width: 25rem;
    margin: 2rem auto;
    background: #222;
    display: grid;
    gap: var(--gap);
    padding: 1rem;
    grid-template: auto minmax(1px, 1fr) / var(--lights-width) minmax(1px, 1fr);
  }

  .controls__keypad {
    grid-row: 2;
    grid-column: 2;
    padding: 2rem;
  }

  .keypad {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.5rem;
    grid-template: auto / repeat(3, minmax(1px, 1fr));

    background-color: white;
    padding: 1rem;
  }

  :global(.key--0) {
    grid-column: 2;
  }

  .key {
    aspect-ratio: 1/1;
  }

  .key button {
    background-color: white;
    width: 100%;
    height: 100%;
    border: 1px solid black;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    font: 1.5rem/1em "Arial", "Orbitron", sans-serif;
  }

  .controls__lights {
    padding: var(--lights-padding);
    grid-row: 1 / -1;
    grid-column: 1;
  }

  .controls__lights > :global(*) {
    margin-bottom: 1rem;
  }

  .light {
    height: var(--lights-width);
    width: var(--lights-width);
    background-color: var(--color-accent);
    position: relative;
    box-shadow: 0 0 6px var(--color-accent);
    border: none;
    transition: filter 100ms ease-in-out, opacity 100ms ease-in-out;
  }

  .light::after {
    content: "";
    display: block;
    background: white;
    background: radial-gradient(
      #000000 0%,
      #ffffff 5%,
      #000000 10%,
      #ffffff 15%,
      #000000 20%,
      #ffffff 25%,
      #000000 30%,
      #ffffff 35%,
      #000000 40%,
      #ffffff 45%,
      #000000 50%,
      #ffffff 55%,
      #000000 60%,
      #ffffff 65%,
      #000000 70%,
      #ffffff 75%,
      #000000 80%,
      #ffffff 85%,
      #000000 90%,
      #ffffff 95%,
      #000 100%
    );

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 85%;
    width: 85%;
    border-radius: 50%;
    mix-blend-mode: lighten;
    opacity: 0.9;
    filter: blur(1px);
  }

  .mute {
    filter: grayscale(1);
    opacity: 0.3;
  }

  .blink {
    animation: blink 600ms ease-out infinite alternate forwards;
  }

  .controls__readout {
    grid-column: 2;
    grid-row: 1;
    padding: 1rem;
    display: block;
    width: 100%;
    border-radius: 2px;
    background-color: black;
    color: var(--color-accent, pink);
    padding: var(--date-part-padding);
    padding-bottom: 0;
    position: relative;
    overflow: hidden;
    min-height: 1em;
    /* TEXT */
    font-family: "LCD Normal", monospace;
    font-weight: bold;
    font-size: clamp(1rem, 4.3vw, 2rem);
    text-transform: uppercase;
    white-space: nowrap;
    text-align: left;
    text-shadow: 0 0 2px var(--color-accent);
    letter-spacing: 0.3rem;
  }

  .controls__readout::after {
    content: "8888888888888";
    font-size: inherit;
    color: currentColor;
    font-family: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    position: absolute;
    text-align: left;
    opacity: 0.3;
  }

  @keyframes blink {
    from {
      opacity: 0.4;
    }
    to {
      opacity: 1;
    }
  }
</style>

<div class="controls">
  <div class="controls__lights">
    <div
      class="light"
      class:mute={input.length >= minimum}
      style:--color-accent="red"
    />
    <div
      class="light"
      class:mute={input.length >= minimum}
      style:--color-accent="yellow"
    />
    <button
      class="light"
      class:blink={input.length >= minimum}
      style:--color-accent="lightgreen"
      on:click={updateDate}
    />
    <div
      class="light"
      class:mute={input.length >= minimum}
      style:--color-accent="yellow"
    />
  </div>
  <div class="controls__readout">
    {input}
  </div>
  <div class="controls__keypad">
    <ul class="keypad">
      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as number}
        <li class="key key--{number}">
          <button on:click={handleNumber}>{@html number}</button>
        </li>
      {/each}
      <li class="key key--reset">
        <button on:click={onReset}>&times;</button>
      </li>
    </ul>
  </div>
</div>
