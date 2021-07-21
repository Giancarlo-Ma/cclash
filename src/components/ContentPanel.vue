<template>
  <div style="height: 100%">
    <a-card style="height: 100%">
      <component v-bind:is="currentTab"></component>
    </a-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Status from './Status.vue'
import Settings from './Settings.vue'
import Profiles from './Profiles.vue'
import Proxies from './Proxies.vue'
import About from './About.vue'

export default {
  computed: {
    ...mapState({
      currentTab: (state) => state.app.currentTab
    })
  },
  components: {
    Status,
    Settings,
    Profiles,
    Proxies,
    About
  }
}
</script>