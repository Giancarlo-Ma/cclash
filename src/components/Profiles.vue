<template>
  <div>
    <div>
      <a-row :gutter="32">
        <a-col v-for="profile in profiles" :key="profile.url" :span="8">
          <a-card hoverable style="width: 180px">
            <template slot="actions" class="ant-card-actions">
              <a-icon key="reload" type="reload" @click="onReloadProfile(profile.url)"/>
              <a-icon key="delete" type="delete" />
              <a-checkbox :checked="profile.url === currentProfile" @change="onSwitchProfile($event, profile.url)"/>
            </template>
            <a-card-meta :title="profile.name" />
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-spin :spinning="loading">
      <a-form-model layout="vertical" class="subscription-form">
        <a-form-model-item label="Add Subscription">
          <a-input
            type="url"
            v-model="subscriptionAddress"
            placeholder="subscription address"
          />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="saveSubscription"> Save </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <a-alert type="error" :message="error && error.message" v-if="error" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      subscriptionAddress: "",
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.profile.loading,
      profiles: (state) => state.profile.profiles,
      error: (state) => state.profile.error,
      currentProfile: (state) => state.profile.currentProfile,
    }),
  },
  created() {
    this.fetchProfiles();
  },
  methods: {
    ...mapActions("profile", ["fetchProfiles", "addProfile", "switchProfile", "reloadProfile"]),
    saveSubscription() {
      this.addProfile({ url: this.subscriptionAddress });
    },
    async onSwitchProfile(e, url) {
      if(!e.target.checked) return;
      await this.switchProfile({profileUrl: url});
    },
    async onReloadProfile(url) {
      await this.reloadProfile(url)
    }
  },
};
</script>

<style scoped>
.subscription-form {
  margin-top: 50px;
}
</style>