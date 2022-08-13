import { createStore } from 'vuex'
import auth from '@/store/modules/auth'
import contentCollector from '@/store/modules/contentCollector'

export default createStore({
  modules: {
    auth,
    contentCollector
  }
})
