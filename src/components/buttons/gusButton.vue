<template>
  <button class="gus-button-pushable" role="button">
    <span class="gus-button-shadow"></span>
    <span class="gus-button-edge"></span>
    <span class="gus-button-front text">{{text}}</span>
  </button>
</template>

<script>
export default {
  name: 'gusButton',
  props: ['text']
}
</script>

<style scoped>
.gus-button-pushable {
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.gus-button-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: hsl(0deg 0% 0% / 0.25);
  will-change: transform;
  transform: translateY(2px);
  transition:
    transform
    600ms
    cubic-bezier(.3, .7, .4, 1);
}

.gus-button-edge {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(
    to left,
    hsl(340deg 100% 16%) 0%,
    hsl(340deg 100% 32%) 8%,
    hsl(340deg 100% 32%) 92%,
    hsl(340deg 100% 16%) 100%
  );
}

.gus-button-front {
  display: block;
  position: relative;
  padding: 12px 27px;
  border-radius: 12px;
  font-size: 1.1rem;
  color: white;
  background: hsl(345deg 100% 47%);
  will-change: transform;
  transform: translateY(-4px);
  transition:
    transform
    600ms
    cubic-bezier(.3, .7, .4, 1);
}

@media (min-width: 768px) {
  .gus-button-front {
    font-size: 1.25rem;
    padding: 12px 42px;
  }
}

.gus-button-pushable:hover {
  filter: brightness(110%);
  -webkit-filter: brightness(110%);
}

.gus-button-pushable:hover .gus-button-front {
  transform: translateY(-6px);
  transition:
    transform
    250ms
    cubic-bezier(.3, .7, .4, 1.5);
}

.gus-button-pushable:active .gus-button-front {
  transform: translateY(-2px);
  transition: transform 34ms;
}

.gus-button-pushable:hover .gus-button-shadow {
  transform: translateY(4px);
  transition:
    transform
    250ms
    cubic-bezier(.3, .7, .4, 1.5);
}

.gus-button-pushable:active .gus-button-shadow {
  transform: translateY(1px);
  transition: transform 34ms;
}

.gus-button-pushable:focus:not(:focus-visible) {
  outline: none;
}
</style>
