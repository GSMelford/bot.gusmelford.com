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
        <GusButton class="common-button" text="Log out" @click="doLogout"></GusButton>
      </div>
    </div>
    <div class="dashboard-container">
      <h1 class="welcome-text">Welcome back, {{userFullName}}</h1>
      <h3 class="welcome-text"><i>Dashboard coming soon...</i></h3>
      <div class="dashboard-video-container">
        <video autoplay controls class="dashboard-video" ref="videoElement">
          <source src="resources/dashboard.mp4">
        </video>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GusButton from '@/components/buttons/gusButton.vue'
import GusRainbowButton from '@/components/buttons/gusRainbowButton.vue'
import GusSimpleText from '@/components/texts/gusSimpleText.vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  name: 'HomeView',
  components: { GusRainbowButton, GusButton, GusSimpleText },
  data () {
    return {
      userFullName: '',
      systemName: '',
      contentCount: 0,
      contentDurationMinutes: 0
    }
  },
  computed: mapGetters(['getUserFullName']),
  created () {
    this.userFullName = this.getUserFullName
  },
  mounted () {
    const videoEl = this.$refs.videoElement as HTMLVideoElement
    videoEl.volume = 0.1
  },
  methods: {
    ...mapActions(['logout']),
    goToContentRoom () {
      this.$router.push('content-room')
    },
    doLogout () {
      this.logout()
      this.$router.push('login')
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
  grid-template-columns: 256px 1fr;
  grid-template-rows: 1fr 64px;
  grid-template-areas:
    'menu-container dashboard-container'
    'footer footer'
}

.menu-container {
  grid-area: menu-container;
  margin: 10px;
  text-align: center;
}

.welcome-text {
  color: snow;
}

.dashboard-container {
  margin: 10px;
  grid-area: dashboard-container;
  text-align: center;
}

.dashboard-video {
  width: 80%;
}

.common-button {
  margin: 10px;
}

</style>
