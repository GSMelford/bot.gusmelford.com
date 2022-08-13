<template>
  <div class="main-container">
    <div v-if="isRoomCreated">
      <GusSimpleText text="Excellent! You are in the room now"></GusSimpleText>
      <GusSimpleText v-text="`Code: ${this.roomCode}`"></GusSimpleText>
      <GusSimpleText text="Users:"></GusSimpleText>
      <div v-for="user in this.users" :key="user">
        <GusSimpleText v-text="user"></GusSimpleText>
      </div>
      <GusButton class="common-button" text="Let's watch!" @click="goToViewer"></GusButton>
    </div>
    <div v-if="!isRoomCreated">
      <GusButton class="common-button" text="Create Room" @click="createRoom"></GusButton>
      <GusSimpleText text="Write the room code here"></GusSimpleText>
      <input class="gus-input" type="text" maxlength="4" v-model="roomCode">
      <GusButton class="common-button" text="Join to Room" @click="joinToRoom(this.roomCode)"></GusButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { systemConstants } from '@/api/constants'
import GusButton from '@/components/buttons/gusButton.vue'
import GusSimpleText from '@/components/texts/gusSimpleText.vue'
import { contentCollectorMethod } from '@/api/contentCollector/contentCollectorRequest'
import { mapActions } from 'vuex'

const connection = new HubConnectionBuilder()
  .withUrl(`${systemConstants.baseURL}content-viewer-hub`)
  .build()

export default defineComponent({
  name: 'ContentViewerRoom',
  components: { GusButton, GusSimpleText },
  data () {
    return {
      isRoomCreated: false,
      roomCode: '',
      users: Array<string>()
    }
  },
  async mounted () {
    await this.sync()
    await connection.start()
  },
  methods: {
    ...mapActions(['saveRoomCode']),
    async createRoom () {
      const response = await contentCollectorMethod.createRoom(false)
      this.roomCode = String(response.data)
      await this.joinToRoom(this.roomCode)
    },
    async joinToRoom (roomCode: string) {
      await connection.invoke('JoinToRoom', roomCode)
      this.saveRoomCode(this.roomCode)
      this.isRoomCreated = true
    },
    async sync () {
      await connection.on('UserJoined', (info: any) => {
        if (this.roomCode === info.roomCode) {
          this.users = info.users
        }
      })
      await connection.on('UserLeft', (info: any) => {
        if (this.roomCode === info.roomCode) {
          this.users = info.users
        }
      })
      await connection.on('StartWatch', (roomCode: string) => {
        if (this.roomCode === roomCode) {
          this.$router.push('content-viewer')
        }
      })
    },
    async goToViewer () {
      await connection.invoke('StartWatch', this.roomCode)
    }
  }
})

</script>

<style scoped>
.main-container {
  flex-wrap: nowrap;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.common-button {
  width: 80%;
  margin: 10px;
}

.gus-input {
  border-radius: 10px;
  width: 128px;
  height: 28px;
  font-family: 'Open Sans', serif;
  font-size: 22px;
  border: red solid 1px;
  text-align: center;
  margin: 10px;
}

</style>
