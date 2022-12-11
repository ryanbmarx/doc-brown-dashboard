<script>
  import { format } from "d3-format";
  import LED from "./LED.svelte";

  let speed = "";

  const formatNumber = format(".1f");
  function handleGo(e) {
    console.log("going");
    if (!speed) speed = 0;
    console.log(speed);
    const speeder = setInterval(() => {
      speed += 0.1;
      if (speed >= 88) clearInterval(speeder);
    }, 10);
  }
</script>

<style>
  .speedometer {
    background: #ccc;
  }
</style>

<svelte:window on:go={handleGo} />
<div class="speedometer">
  <LED fillText={[88.8, 11.1, 77.7]} number={formatNumber(speed)} />
</div>
