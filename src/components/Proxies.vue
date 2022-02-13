<template>
  <a-spin :spinning="proxies === null">
    <a-collapse :defaultActiveKey="selectors.length > 0 ? selectors[0] : ''">
      <a-collapse-panel
        v-for="selector in selectors"
        :key="selector"
        :header="selector"
      >
        <a-row :gutter="[16, 16]">
          <a-col :span="12" v-for="item in proxies[selector].all" :key="item">
            <a-card
              style="overflow: auto"
              hoverable
              :bodyStyle="{
                background:
                  item === proxies[selector].now ? '#E6F7FF' : 'white',
              }"
              @click="switchProxy({ selector, proxy: item })"
              >{{ item }}</a-card
            >
          </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </a-spin>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {};
  },
  created() {
    this.fetchProxies();
  },
  computed: {
    ...mapState({
      proxies: (state) => state.proxy.proxies,
      selectors: (state) => Object.keys(state.proxy.proxies),
    }),
  },
  methods: {
    ...mapActions("proxy", ["fetchProxies", "switchProxy"]),
  },
};
</script>