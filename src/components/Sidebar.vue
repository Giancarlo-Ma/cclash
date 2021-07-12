<template>
  <div>
    <Speedometer />
    <a-menu mode="vertical" :default-selected-keys="['Status']">
      <a-menu-item v-for="tab in APP_TABS" :key="tab" @click="handleMenuItemClick(tab)">
        {{tab}}
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import Speedometer from "./Speedometer.vue";
import { mapMutations } from 'vuex';

const APP_TABS = ["Status", "Proxies", "Profiles", "Settings", "About"]
export default {
  components: {
    Speedometer,
  },
  data() {
    return {
      APP_TABS
    }
  },
  methods: {
    ...mapMutations('app', {handleMenuItemClick: 'switchAppTab'})
  }
};
</script>