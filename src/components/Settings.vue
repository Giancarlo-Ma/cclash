<template>
  <div>
    <a-form-model
      v-if="settingsForm"
      :model="settingsForm"
      :rules="settingsRules"
      label-align="left"
      :label-col="{ span: 13 }"
      :wrapper-col="{ span: 11 }"
    >
      <a-form-model-item label="Proxy Mode">
        <a-radio-group v-model="settingsForm.mode">
          <a-radio value="global">Global</a-radio>
          <a-radio value="rule">Rule</a-radio>
          <a-radio value="direct">Direct</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="HTTP Port">
        <a-input-number v-model="settingsForm.httpPort" :min="1" :max="65535" />
      </a-form-model-item>
      <a-form-model-item label="Socks Port">
        <a-input-number v-model="settingsForm.socksPort" :min="1" :max="65535" />
      </a-form-model-item>
      <a-form-model-item label="Allow LAN">
        <a-switch v-model="settingsForm.allowLan" />
      </a-form-model-item>
      <a-form-model-item label="Start with system">
        <a-switch v-model="settingsForm.startWithSystem" />
      </a-form-model-item>
      <a-form-model-item label="System proxy">
        <a-switch v-model="settingsForm.systemProxy" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
        <a-button type="primary" @click="saveSetting">Save</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-spin v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      settingsForm: {
        httpPort: '',
        socksPort: '',
        allowLan: false,
        startWithSystem: false,
        systemProxy: false
      },
      settingsRules: {
        httpPort: {}
      }
    };
  },
  async created() {
    const settings = this.$store.getters['app/settings']
    this.settingsForm = Object.assign({}, settings)
  },
  methods: {
    async saveSetting() {
      await this.saveConfigs(this.settingsForm)
      this.$message.success('save success')
    },
    ...mapActions('app', ['saveConfigs'])
  }
};
</script>