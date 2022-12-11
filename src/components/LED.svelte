<script>
  export let number = "";
  export let fillText = ["8888", "1111", "7777"];
</script>

<style>
  .led {
    /* CONFIG */
    --speedometer-color: pink;
    --speedometer-font-size: 8rem;
    /* --speedometer-padding: 1rem; */
    /* --speedometer-letter-spacing: 0.3rem; */

    /* CONFIG DEFAULTS */
    --speedometer-default-color: yellow;
    --speedometer-default-font-size: clamp(1rem, 4.3vw, 3.6rem);
    --speedometer-default-padding: 1rem;
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
    opacity: 0.3;
    color: white;
  }
</style>

<div class="led">
  <span class="led__fill">{fillText}</span>
  <span class="led__number">{number}</span>
</div>
