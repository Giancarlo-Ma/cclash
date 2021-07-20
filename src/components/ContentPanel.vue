<template>
  <div style="height: 100%">
    <component v-bind:is="currentTab"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Status from './Status.vue'
import Settings from './Settings.vue'

export default {
  computed: {
    ...mapState({
      currentTab: (state) => state.app.currentTab
    })
  },
  components: {
    Status,
    Settings
  }
}
</script>