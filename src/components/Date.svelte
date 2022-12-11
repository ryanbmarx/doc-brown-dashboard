<script>
  import { randomIntFromInterval } from "../utils/random.js";
  import { onMount } from "svelte";
  import AmPm from "./AmPm.svelte";

  export let label = "";
  export let dateTarget;
  export let accentColor;

  $: month = months[dateTarget.getMonth()];
  $: day = String(dateTarget.getDate()).padStart(2, 0);
  $: year = dateTarget.getFullYear();
  $: hours =
    dateTarget.getHours() < 12
      ? String(dateTarget.getHours()).padStart(2, 0)
      : String(dateTarget.getHours() - 12).padStart(2, 0);
  $: minutes = String(dateTarget.getMinutes()).padStart(2, 0);

  const translateX = randomIntFromInterval(-5, 5);
  const translateY = randomIntFromInterval(-2, 5);
  const id = `${Math.random()}-label`;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  onMount(() => {
    console.log({ dateTarget });
  });
</script>

<style>
  .date {
    display: grid;
    gap: 0.25rem calc(2 * var(--gap));
    grid-template-rows: minmax(1px 1fr) auto;
    grid-template-columns:
      minmax(1px, 3fr)
      minmax(1px, 2fr)
      minmax(1px, 4fr)
      3.5rem
      minmax(1px, 2fr)
      minmax(1px, 2fr);

    background: rgb(97, 97, 97);
    padding: var(--gap);
    max-width: 55rem;
    margin: auto;
  }

  .date__part {
    position: relative;
    display: flex;
    align-items: center;
    flex-flow: column nowrap;
    gap: 0.35rem;
  }

  .date__display {
    display: block;
    width: 100%;
    border-radius: 2px;
    background-color: black;
    color: var(--color-accent);
    padding: var(--date-part-padding);
    padding-bottom: 0;
    font-family: "LCD Normal", monospace;
    font-weight: bold;
    font-size: clamp(1rem, 4.3vw, 3.6rem);
    text-transform: uppercase;
    white-space: nowrap;
    text-align: center;
    text-shadow: 0 0 2px var(--color-accent);
    letter-spacing: 0.3rem;
    position: relative;
    overflow: hidden;
  }

  .date__display::after {
    content: "888888888";
    font-size: inherit;
    color: currentColor;
    font-family: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    opacity: 0.3;
    position: absolute;
    left: var(--date-part-padding);
  }

  .date__label {
    grid-column: 1/-1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .date__text {
    display: inline-block;
    text-align: center;
    text-transform: uppercase;
    background-color: black;
    padding: 0.25rem 0.7rem;
    letter-spacing: 0.15rem;
    font: bold 1rem/1em "Orbitron", sans-serif;
    color: #ccc;
    transform: translate(var(--translateX, 0), var(--translateY, 0))
      rotate(var(--rotate, 0));
  }

  .date__part .date__text {
    background-color: var(--color-label);
    transform: rotate(var(--rotate, 0));
  }
  .date__part--minutes::after,
  .date__part--minutes::before {
    content: "";
    position: absolute;
    right: calc(100% + var(--gap));
    top: 53%;
    width: var(--dot-height);
    height: var(--dot-height);
    background: var(--color-accent);
    background: radial-gradient(
      circle at 25% 18%,
      #dddddd,
      var(--color-accent) 65%
    );
    border-radius: 50%;
    transform: translate(51%, 0);
    border: 1px solid rgba(0, 0, 0, 0.3);
    transition: background 100ms ease-in-out;
  }
  .date__part--minutes::after {
    transform: translate(50%, calc(1.6 * var(--dot-height)));
  }
</style>

<div
  aria-labelledby={id}
  class="date"
  style:--color-accent={accentColor}
  style:--translateX="{translateX}px"
  style:--translateY="{translateY}px"
  style:border-radius="{randomIntFromInterval(2, 5)}px"
>
  <div
    class="date__part date__part--month"
    style:--rotate="{randomIntFromInterval(-0.6, 0.6)}deg"
  >
    <span class="date__text">Month</span>
    <span class="date__display">{month}</span>
  </div>
  <div
    class="date__part date__part--day"
    style:--rotate="{randomIntFromInterval(-0.6, 0.6)}deg"
  >
    <span class="date__text">Day</span>
    <span class="date__display">{day}</span>
  </div>
  <div
    class="date__part date__part--year"
    style:--rotate="{randomIntFromInterval(-0.6, 0.6)}deg"
  >
    <span class="date__text">Year</span>
    <span class="date__display">{year}</span>
  </div>
  <AmPm am={hours < 12} />
  <div
    class="date__part date__part--hours"
    style:--rotate="{randomIntFromInterval(-0.6, 0.6)}deg"
  >
    <span class="date__text">Hour</span>
    <span class="date__display">{hours}</span>
  </div>
  <div
    class="date__part date__part--minutes"
    style:--rotate="{randomIntFromInterval(-0.6, 0.6)}deg"
  >
    <span class="date__text">Min</span>
    <span class="date__display">{minutes}</span>
  </div>
  <div
    class="date__label"
    style:--rotate="{randomIntFromInterval(-0.6, 0.6)}deg"
  >
    <span {id} class="date__text">{label}</span>
  </div>
</div>
