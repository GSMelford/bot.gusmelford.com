<template>
  <input class="gus-input" type="text">
</template>

<script>
export default {
  name: 'gusInput',
  props: ['width', 'center']
}
</script>

<style scoped>
.gus-input {
  border-radius: 10px;
  width: v-bind(width);
  height: 28px;
  font-family: 'Open Sans', serif;
  font-size: 22px;
  border: red solid 1px;
  text-align: center;
}
</style>
