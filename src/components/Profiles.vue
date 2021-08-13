<template>
  <div>
    <div class="cardHolder">
      <a-card hoverable style="width: 200px;">
        <template slot="actions" class="ant-card-actions">
          <a-icon key="reload" type="reload" />
          <a-icon key="delete" type="delete" />
          <a-checkbox />
        </template>
        <a-card-meta title="Card title" description="This is the description"></a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.profile.loading,
      profiles: (state) => state.profile.profiles,
      error: (state) => state.profile.error,
      currentProfile: (state) => state.profile.currentProfile,
    })
  },
  created() {
    this.fetchProfiles();
  },
  methods: {
    ...mapActions("profile", ["fetchProfiles"]),
  }
}
</script>