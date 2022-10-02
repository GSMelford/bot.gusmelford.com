<template>
  <div class="content-viewer-container">
    <div class="info-container">
      <h2>{{systemName}}</h2>
      <div v-for="user in this.currentContentInfo.users" :key="user.id" class="users-info">
        <p>{{`${user.firstName} ${user.lastName}`}}</p>
      </div>
      <p style="color: snow">Content # {{this.currentContentInfo.number}}</p>
      <a class="content-original-link" :href="currentContentInfo.originalLink">Click here to open link</a>
      <p v-if="this.currentContentInfo.accompanyingCommentary" class="accompanying-commentary">Video comment: <br><br>{{this.currentContentInfo.accompanyingCommentary}}</p>
    </div>
    <div class="video-container">
      <video :src="contentLink" controls loop autoplay ref="videoElement"></video>
    </div>
    <div class="log-container" style="color: snow; overflow: auto">
      <div v-for="messageLog in this.logMessages" :key="messageLog.id" class="users-info">
        <p>{{messageLog.message}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { systemConstants } from '@/api/constants'
import { contentCollectorMethod } from '@/api/contentCollector/contentCollectorRequest'
import { mapGetters } from 'vuex'

let connection: any
let tempTime = 0
let currentContent: any

export default defineComponent({
  name: 'ContentViewer',
  data () {
    return {
      video: HTMLVideoElement,
      contentLink: '',
      systemName: '',
      contentCursor: 0,
      isPaused: false,
      volume: 1,
      maxWidth: '',
      logMessages: Array<{ id: string, message: string }>(),
      currentContentInfo: {
        users: Array<{ id: string, firstName: string, lastName: string }>(),
        originalLink: '',
        accompanyingCommentary: '',
        number: ''
      }
    }
  },
  computed: mapGetters(['getRoomCode', 'getToken']),
  mounted: async function () {
    connection = new HubConnectionBuilder()
      .withUrl(`${systemConstants.baseURL}content-viewer-hub`, { accessTokenFactory: () => this.getToken })
      .build()
    this.systemName = systemConstants.systemName + ' ' + 'ContentCollector'
    await this.setEvents()
    await this.setSync()
    await this.updateVideo()
    await connection.start()
  },
  methods: {
    async setEvents () {
      const videoEl = this.$refs.videoElement as HTMLVideoElement
      videoEl.addEventListener('seeked', await this.onSeeked)
      window.addEventListener('keydown', await this.onKeyDown)
      videoEl.onvolumechange = this.onVolumeChange
    },
    async onSeeked () {
      const videoEl = this.$refs.videoElement as HTMLVideoElement
      tempTime = videoEl.currentTime
      await connection.invoke('ChangeVideoTime', tempTime)
    },
    onVolumeChange () {
      const videoEl = this.$refs.videoElement as HTMLVideoElement
      this.volume = videoEl.volume
    },
    async onKeyDown (ev: any) {
      if (ev.key === 'ArrowRight' || ev.key === 'd' || ev.key === '>') {
        await contentCollectorMethod.markContentAsViewed(currentContent.id)
        await connection.invoke('NextContent', this.getRoomCode)
        this.changeRotate(0)
      } else if (ev.key === 'ArrowLeft' || ev.key === 'a' || ev.key === '<') {
        await connection.invoke('PrevContent', this.getRoomCode)
        this.changeRotate(0)
      } else if (ev.key === 'p' || ev.key === 'm') {
        await connection.invoke('ChangePause', this.getRoomCode)
      } else if (ev.key === 'r' || ev.key === 'R') {
        await connection.invoke('ChangeRotate', this.getRoomCode)
      }
    },
    async setSync () {
      await connection.on('ChangeVideoTime', (currentTime: number) => {
        const videoEl = this.$refs.videoElement as HTMLVideoElement
        if (this.decimalAdjust(tempTime, -1) !== this.decimalAdjust(currentTime, -1)) {
          videoEl.currentTime = currentTime
        }
      })
      await connection.on('VideoChanged', async () => {
        await this.updateVideo()
      })
      await connection.on('PauseChanged', (isPause: boolean) => {
        const videoEl = this.$refs.videoElement as HTMLVideoElement
        if (isPause) {
          videoEl.pause()
        } else {
          videoEl.play()
        }
      })
      await connection.on('RotateChanged', (rotate: number) => {
        this.changeRotate(rotate)
      })
    },
    changeRotate (rotate: number) {
      const videoEl = this.$refs.videoElement as HTMLVideoElement
      videoEl.style.transform = `rotate(${rotate}deg)`
    },
    async updateVideo () {
      currentContent = (await contentCollectorMethod.getContentInfo(this.getRoomCode)).data
      this.updateCurrentContentInfo()
      this.updateContentLink()
      this.setVideoSize()
    },
    updateCurrentContentInfo () {
      this.currentContentInfo.users = currentContent.users.map((x: any) => {
        return ({ firstName: x.firstName, lastName: x.lastName })
      })
      this.currentContentInfo.originalLink = currentContent.originalLink
      this.currentContentInfo.accompanyingCommentary = currentContent.accompanyingCommentary
      this.currentContentInfo.number = currentContent.number
    },
    updateContentLink () {
      this.contentLink = `${systemConstants.baseURL}${currentContent.contentPath}`
    },
    setVideoSize () {
      const clientHeight = document.body.clientHeight
      this.maxWidth = `${((clientHeight / currentContent.height) * currentContent.width)}px`
    },
    decimalAdjust (value: any, exp: any) {
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math.floor(value)
      }
      value = +value
      exp = +exp
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN
      }
      value = value.toString().split('e')
      value = Math.floor(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
      value = value.toString().split('e')
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
    },
    log (message: string) {
      this.logMessages.push({ id: message, message: message })
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

.content-viewer-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 256px 1fr 256px;
  grid-template-areas:
    'info-container video-container log-container'
}

.info-container {
  padding: 10px;
}

.info-container > h2 {
  color: #ff3c3c;
}

.users-info > p {
  color: snow;
}

.accompanying-commentary {
  color: yellow;
  font-size: 24px;
}

.content-original-link {
  text-decoration: none;
  color: #ff3c3c;
}

video {
  width: 100% !important;
  height: auto !important;
}

.video-container {
  height: 100vh;
  max-width: v-bind(maxWidth);
  margin: 0 auto;
  display: flex;
  align-items: center;
}

</style>
