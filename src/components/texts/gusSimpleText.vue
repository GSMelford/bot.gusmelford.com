<template>
  <p class="gus-text">{{text}}</p>
</template>

<script>
export default {
  name: 'gusSimpleText',
  props: ['text']
}
</script>

<style scoped>
.gus-text {
  color: snow;
  font-size: 24px;
  font-weight: bolder;
}
</style>
