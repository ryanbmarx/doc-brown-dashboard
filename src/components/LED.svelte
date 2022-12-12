<script>
  export let number = "";
  export let fillText = "88888";
  export let textAlign = "right";
  let clazz;
  export { clazz as class };
</script>

<style>
  .led {
    /* CONFIG */

    /* CONFIG DEFAULTS */
    --speedometer-default-color: yellow;
    --speedometer-default-font-size: clamp(1rem, 4.3vw, 3.6rem);
    --speedometer-default-padding: 0.5rem;
    --speedometer-default-letter-spacing: 0.3rem;

    /* SCAFFOLDING & SHAPE*/
    display: block;
    width: 100%;
    max-width: fit-content;
    padding: var(--speedometer-padding, var(--speedometer-default-padding));
    padding-bottom: 0;
    position: relative;
    overflow: hidden;

    /* VISUAL DISPLAY */
    border-radius: 2px;
    background-color: black;
    color: var(--speedometer-color, var(--speedometer-default-color));
  }

  .led__fill,
  .led__number {
    font-family: "LCDMono2 Normal", monospace;
    font-weight: bold;
    font-size: var(
      --speedometer-font-size,
      var(--speedometer-default-font-size)
    );
    text-transform: uppercase;
    white-space: nowrap;
    text-align: right;
    text-shadow: 0 0 2px
      var(--speedometer-color, var(--speedometer-default-color));
    letter-spacing: var(
      --speedometer-letter-spacing,
      var(--speedometer-default-letter-spacing)
    );
    color: var(--speedometer-color, var(--speedometer-default-color));
  }
  .led__number {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: var(--speedometer-padding, var(--speedometer-default-padding));
  }
  .led__fill {
    opacity: 0.2;
    color: white;
  }

  .led--align-right :is(.led__fill, .led__number) {
    text-align: right;
  }
  .led--align-center :is(.led__fill, .led__number) {
    text-align: center;
  }
  .led--align-left :is(.led__fill, .led__number) {
    text-align: left;
  }
</style>

<div
  class="led {clazz}"
  class:led--align-right={textAlign === "right"}
  class:led--align-center={textAlign === "center"}
  class:led--align-left={textAlign === "left"}
>
  <span class="led__fill">{fillText}</span>
  <span class="led__number">{number}</span>
</div>
