import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FileReader from 'vue-filereader'
import { Vue3Mq, MqResponsive } from 'vue3-mq'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
library.add(faUserSecret, faHeart)





createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.component(FileReader.name, FileReader)
.component('mq-responsive', MqResponsive)
.use(Vue3Mq, {
    breakpoints: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 992,
      xl: 1904,
    }
  })
.use(store)
.use(router)
.mount('#app')






