<template>
  <div style="height: 100%">
    <a-card style="height: 100%" v-if="configs">
      <a-list :data-source="listData">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <span slot="title">{{ item.name }}</span>
          </a-list-item-meta>
          <div>{{ item.value }}</div>
        </a-list-item>
      </a-list>
    </a-card>
    <div v-else>
      <div v-if="error">{{ JSON.stringify(error) }}</div>
      <a-spin v-else />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      listData: [],
    };
  },
  async created() {
    await this.fetchConfigs();
    this.listData = [
      {
        key: "port",
        name: "HTTP Port",
        value: this.configs.port || "",
      },
      {
        key: "socks-port",
        name: "Socks Port",
        value: this.configs["socks-port"] || "",
      },
      {
        key: "allow-lan",
        name: "Allow Lan",
        value: this.configs["allow-lan"] ? "true" : "false",
      },
      {
        key: "mode",
        name: "Mode",
        value: this.configs.mode || "",
      },
      {
        key: "log-level",
        name: "Log level",
        value: this.configs["log-level"] || "",
      },
    ];
  },
  computed: mapState({
    configs: (state) => state.app.configs,
    error: (state) => state.app.error,
  }),
  methods: {
    ...mapActions("app", ["fetchConfigs"]),
  },
};
</script>