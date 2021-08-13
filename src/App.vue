<template>
  <div id="app">
    <a-layout>
      <a-page-header
          :title="currentTab"
        />
      <a-layout style="height: calc(100vh - 66px)">
        <a-layout-sider width="130" theme="light">
           <Sidebar />
        </a-layout-sider>
        <a-layout style="padding-left: 24px">
          <a-layout-content
            :style="{
              background: '#fff',
              padding: '24px',
              margin: 0,
            }"
          >
            <ContentPanel />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Sidebar from "./components/Sidebar.vue";
import ContentPanel from './components/ContentPanel.vue'

export default {
  computed: mapState({
    currentTab: (state) => state.app.currentTab,
  }),
  components: {
    Sidebar,
    ContentPanel
  },
};
</script>

<style>
</style>
