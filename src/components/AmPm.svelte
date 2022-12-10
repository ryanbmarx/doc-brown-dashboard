<script>
  import { randomIntFromInterval } from "../utils/random.js";
  export let am = true;

  const translateX = randomIntFromInterval(-2, -2);
  const translateY = randomIntFromInterval(-1, 1);
</script>

<style>
  .meridian {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.25rem;
    align-items: center;
    align-self: center;
  }

  .label {
    display: inline-block;
    text-align: center;
    text-transform: uppercase;
    background-color: var(--color-label);
    padding: 0.1rem 0.7rem;
    letter-spacing: 0.15rem;
    font: bold 1rem/1em "Orbitron", sans-serif;
    color: #ccc;
    transform: translate(var(--translateX, 0), var(--translateY, 0))
      rotate(var(--rotate, 0));
  }

  .dot {
    --color-dot: #555;
    width: var(--dot-height);
    height: var(--dot-height);
    background: var(--color-dot);
    background: radial-gradient(
      circle at 25% 18%,
      #ffffff,
      var(--color-dot) 45%
    );
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.3);
    transition: background 100ms ease-in-out;
  }

  .dot.dot--on {
    --color-dot: var(--color-accent);
  }
</style>

<div
  class="meridian"
  class:am
  style:--translateX="{translateX}px"
  style:--translateY="{translateY}px"
>
  <span class="label" style:--rotate="{randomIntFromInterval(-0.53, 0.53)}deg"
    >AM</span
  >
  <span class="dot" class:dot--on={am} />
  <span class="label" style:--rotate="{randomIntFromInterval(-0.53, 0.53)}deg"
    >PM</span
  >
  <span class="dot" class:dot--on={!am} />
</div>
