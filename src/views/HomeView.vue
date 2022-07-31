<template>
  <div class="main-container">
    <div class="system-name">
      {{systemName}}
    </div>
    <div class="apps-container">
      <button class="myButton" @click="goToContentViewer">New contents {{contentCount}} for {{contentDurationMinutes}} minutes</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { systemConstants } from '@/api/constants'
import { contentCollectorMethod } from '@/api/contentCollector/contentCollectorRequest'

export default defineComponent({
  name: 'HomeView',
  data () {
    return {
      systemName: '',
      contentCount: 0,
      contentDurationMinutes: 0
    }
  },
  async created () {
    this.systemName = systemConstants.systemName + ' ' + 'v2.0 Beta'
    const response = await contentCollectorMethod.getInfo(false)
    this.contentCount = response.data.contentCount
    this.contentDurationMinutes = (response.data.duration as number) / 60
  },
  methods: {
    goToContentViewer () {
      this.$router.push('content-viewer')
    }
  }
})
</script>

<style>

body{
  background-color: #0f0f0f;
  margin: 0;
  padding: 0;
}

.main-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.system-name {
  color: #ff3c3c;
  font-size: xxx-large;
  width: 100%;
  text-align: center;
  margin: 24px;
}

.apps-container {
  width: 100%;
  text-align: center;
  margin: 24px;
}

button, button::after {
  width: 380px;
  height: 86px;
  font-size: 36px;
  font-family: 'Bebas Neue', cursive;
  background: linear-gradient(45deg, transparent 5%, #FF013C 5%);
  border: 0;
  color: #fff;
  letter-spacing: 3px;
  line-height: 88px;
  box-shadow: 6px 0px 0px #00E6F6;
  outline: transparent;
  position: relative;
}

button::after {
  --slice-0: inset(50% 50% 50% 50%);
  --slice-1: inset(80% -6px 0 0);
  --slice-2: inset(50% -6px 30% 0);
  --slice-3: inset(10% -6px 85% 0);
  --slice-4: inset(40% -6px 43% 0);
  --slice-5: inset(80% -6px 5% 0);

  content: 'AVAILABLE NOW';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 3%, #00E6F6 3%, #00E6F6 5%, #FF013C 5%);
  text-shadow: -3px -3px 0px #F8F005, 3px 3px 0px #00E6F6;
  clip-path: var(--slice-0);
}

button:hover::after {
  animation: 1s glitch;
  animation-timing-function: steps(2, end);
}

@keyframes glitch {
  0% {
    clip-path: var(--slice-1);
    transform: translate(-20px, -10px);
  }
  10% {
    clip-path: var(--slice-3);
    transform: translate(10px, 10px);
  }
  20% {
    clip-path: var(--slice-1);
    transform: translate(-10px, 10px);
  }
  30% {
    clip-path: var(--slice-3);
    transform: translate(0px, 5px);
  }
  40% {
    clip-path: var(--slice-2);
    transform: translate(-5px, 0px);
  }
  50% {
    clip-path: var(--slice-3);
    transform: translate(5px, 0px);
  }
  60% {
    clip-path: var(--slice-4);
    transform: translate(5px, 10px);
  }
  70% {
    clip-path: var(--slice-2);
    transform: translate(-10px, 10px);
  }
  80% {
    clip-path: var(--slice-5);
    transform: translate(20px, -10px);
  }
  90% {
    clip-path: var(--slice-1);
    transform: translate(-10px, 0px);
  }
  100% {
    clip-path: var(--slice-1);
    transform: translate(0);
  }
}
</style>
