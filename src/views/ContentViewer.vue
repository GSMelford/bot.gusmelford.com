<template>
  <div class="content-viewer-container">
    <div class="info-container">
      <h2>{{systemName}}</h2>
      <div v-for="user in this.currentContentInfo.users" :key="user.id" class="users-info">
        <p>{{`${user.firstName} ${user.lastName}`}}</p>
      </div>
      <a class="content-original-link" :href="currentContentInfo.originalLink">Click here to open link</a>
      <p class="accompanying-commentary">Video comment: </p>
      <p class="accompanying-commentary">{{this.currentContentInfo.accompanyingCommentary}}</p>
    </div>
    <div class="video-container">
      <video :src="contentLink" controls autoplay loop></video>
    </div>
    <div class="log-container">
      <h1>CONTENT VIEWER LOGS</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { systemConstants } from '@/api/constants'
import { contentCollectorMethod } from '@/api/contentCollector/contentCollectorRequest'

const connection = new HubConnectionBuilder()
  .withUrl(`${systemConstants.baseURL}content-viewer-hub`)
  .configureLogging(LogLevel.Information)
  .build()

let contents: any[]
let currentContent: any

export default defineComponent({
  name: 'ContentViewer',
  data () {
    return {
      systemName: '',
      message: '',
      contentCursor: 0,
      contentLink: '',
      currentContentInfo: {
        users: Array<{ id: string, firstName: string, lastName: string }>(),
        originalLink: '',
        accompanyingCommentary: ''
      }
    }
  },
  created () {
    window.addEventListener('keydown', ev => {
      if (ev.key === 'ArrowRight') {
        if (this.contentCursor + 1 === contents.length) {
          this.contentCursor = 0
        } else {
          this.contentCursor++
        }
        this.contentLink = this.buildContentLink(contents[this.contentCursor])
      } else if (ev.key === 'ArrowLeft') {
        if (this.contentCursor - 1 < 0) {
          this.contentCursor = contents.length - 1
        } else {
          this.contentCursor--
        }
        this.contentLink = this.buildContentLink(contents[this.contentCursor])
      }
    })
  },
  async mounted () {
    connection.on('Send', args => console.log(args))
    await connection.start()

    contents = (await contentCollectorMethod.getContents(false)).data
    currentContent = contents[0]
    this.contentLink = this.buildContentLink(currentContent)
    this.systemName = systemConstants.systemName
    this.updateCurrentContentInfo()
  },
  methods: {
    sendMessage () {
      connection.invoke('Send', this.message)
    },
    updateCurrentContentInfo () {
      this.currentContentInfo.users = currentContent.users.map((x: any) => {
        return ({ firstName: x.firstName, lastName: x.lastName })
      })
      this.currentContentInfo.originalLink = currentContent.originalLink
      this.currentContentInfo.accompanyingCommentary = currentContent.accompanyingCommentary
    },
    buildContentLink (currentContent: any) : string {
      return `${systemConstants.baseURL}${currentContent.contentPath}`
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
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

</style>
