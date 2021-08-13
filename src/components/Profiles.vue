<template>
  <div>
    {{loading}}
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
      loading: (state) => state.profile.loading
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