<script>
  import { format } from "d3-format";
  import LED from "./LED.svelte";

  let speed = "";
  let light = true;
  const formatNumber = format(".1f");
  function handleGo(e) {
    console.log("going");
    if (!speed) speed = 0;
    console.log(speed);
    const speeder = setInterval(() => {
      speed += 0.1;
      if (speed >= 60) light = false;
      if (speed >= 88) clearInterval(speeder);
    }, 10);
  }
</script>

<style>
  .speedometer {
    --speedometer-font-size: 8rem;
    --speedometer-padding: 1rem;
    /*
        --speedometer-color: pink;
    /* --speedometer-letter-spacing: 0.3rem; */
    background: #ccc;
  }

  .light {
    --color-background: #eee;
    height: 5rem;
    width: 14rem;
    background-color: var(--color-background);
    transition: background 100ms ease-in-out;
  }

  .light.active {
    --color-background: red;
  }
</style>

<svelte:window on:go={handleGo} />
<div class="speedometer">
  <LED fillText="88.8" number={formatNumber(speed)} />
  <div class="light" class:active={light}>STOP</div>
</div>
