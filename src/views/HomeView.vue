<template>
  <div class="main-container">
    <div class="menu-container">
      <div>
        <GusSimpleText text="What do we do?"></GusSimpleText>
      </div>
      <div>
        <GusRainbowButton class="common-button" text="Watch content" @click="goToContentRoom"></GusRainbowButton>
        <GusButton class="common-button" text="Coming soon"></GusButton>
        <GusButton class="common-button" text="Coming soon"></GusButton>
        <GusButton class="common-button" text="Coming soon"></GusButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GusButton from '@/components/buttons/gusButton.vue'
import GusRainbowButton from '@/components/buttons/gusRainbowButton.vue'
import GusSimpleText from '@/components/texts/gusSimpleText.vue'

export default defineComponent({
  name: 'HomeView',
  components: { GusRainbowButton, GusButton, GusSimpleText },
  data () {
    return {
      systemName: '',
      contentCount: 0,
      contentDurationMinutes: 0
    }
  },
  methods: {
    goToContentRoom () {
      this.$router.push('content-room')
    }
  }
})
</script>

<style scoped>

.main-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  gap: 10px;
  grid-template-columns: 256px 1fr 256px;
  grid-template-rows: 1fr 64px;
  grid-template-areas:
    'menu-container dashboard'
    'footer footer'
}

.menu-container {
  margin: 10px;
  text-align: center;
}

.common-button {
  margin: 10px;
}

</style>
