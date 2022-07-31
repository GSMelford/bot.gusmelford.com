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

const connection = new HubConnectionBuilder()
  .withUrl(`${systemConstants.baseURL}content-viewer-hub`)
  .build()

let contents: any[]
let currentContent: any

export default defineComponent({
  name: 'ContentViewer',
  data () {
    return {
      video: HTMLVideoElement,
      systemName: '',
      contentCursor: 0,
      contentLink: '',
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
  created () {
    window.addEventListener('keydown', async ev => {
      if (ev.key === 'ArrowRight' || ev.key === 'd' || ev.key === '>') {
        await connection.invoke('SwitchVideo', 'next')
      } else if (ev.key === 'ArrowLeft' || ev.key === 'a' || ev.key === '<') {
        await connection.invoke('SwitchVideo', 'prev')
      } else if (ev.key === 'p') {
        this.isPaused = !this.isPaused
        await connection.invoke('PauseVideo', this.isPaused)
      }
    })
  },
  mounted: async function () {
    await this.initContents()
    this.updateCurrentContentInfo()
    await this.syncCurrentVideoTime()
    await this.syncSwitchVideo()
    await this.syncPauseVideo()
    this.setVolumeEvent()
    await connection.start()
  },
  methods: {
    async initContents () {
      contents = (await contentCollectorMethod.getContents(false)).data
      currentContent = contents[0]
      this.contentLink = this.buildContentLink(currentContent)
      this.setVideoSize(contents[this.contentCursor])
      this.systemName = systemConstants.systemName + ' ' + 'ContentCollector'
    },
    updateCurrentContentInfo () {
      this.currentContentInfo.users = currentContent.users.map((x: any) => {
        return ({ firstName: x.firstName, lastName: x.lastName })
      })
      this.currentContentInfo.originalLink = currentContent.originalLink
      this.currentContentInfo.accompanyingCommentary = currentContent.accompanyingCommentary
      this.currentContentInfo.number = currentContent.number
    },
    buildContentLink (currentContent: any) : string {
      return `${systemConstants.baseURL}${currentContent.contentPath}`
    },
    log (message: string) {
      this.logMessages.push({ id: message, message: message })
    },
    async syncCurrentVideoTime () {
      let tempTime = 0
      const videoEl = this.$refs.videoElement as HTMLVideoElement
      await connection.on('ChangeVideoTime', (currentTime: number) => {
        if (this.decimalAdjust(tempTime, -1) !== this.decimalAdjust(currentTime, -1)) {
          videoEl.currentTime = currentTime
        }
      })
      videoEl.addEventListener('seeked', async ev => {
        tempTime = videoEl.currentTime
        await connection.invoke('ChangeVideoTime', tempTime)
      })
      videoEl.onloadeddata = async ev => {
        await connection.invoke('ReadyWatchVideo')
      }
    },
    async syncSwitchVideo () {
      await connection.on('SwitchVideo', (direction: string) => {
        const videoEl = this.$refs.videoElement as HTMLVideoElement
        videoEl.volume = this.volume
        if (direction === 'next') {
          if (this.contentCursor + 1 === contents.length) {
            this.contentCursor = 0
          } else {
            this.contentCursor++
          }
        } else if (direction === 'prev') {
          if (this.contentCursor - 1 < 0) {
            this.contentCursor = contents.length - 1
          } else {
            this.contentCursor--
          }
        }

        currentContent = contents[this.contentCursor]
        this.contentLink = this.buildContentLink(contents[this.contentCursor])
        this.setVideoSize(contents[this.contentCursor])
        this.updateCurrentContentInfo()
      })
    },
    setVideoSize (content: any) {
      const clientHeight = document.body.clientHeight
      this.maxWidth = `${((clientHeight / content.height) * content.width)}px`
    },
    async syncPauseVideo () {
      const videoEl = this.$refs.videoElement as HTMLVideoElement
      await connection.on('PauseVideo', (isPaused: number) => {
        if (isPaused) {
          videoEl.pause()
        } else {
          videoEl.play()
        }
      })
    },
    setVolumeEvent () {
      const videoEl = this.$refs.videoElement as HTMLVideoElement
      videoEl.onvolumechange = ev => { this.volume = videoEl.volume }
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
