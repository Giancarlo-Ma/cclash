import { requestSwitchConfigs } from "../../api/clash-api"

const state = () => ({
  profiles: [],
  currentProfile: '',
  loading: false,
  error: null
})

const profileMutationTypes = {
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  GOT_PROFILES: 'GOT_PROFILES',
  GOT_ERROR: 'GOT_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

const mutations = {
  [profileMutationTypes.TOGGLE_LOADING](state, { loading = false }) {
    state.loading = loading
  },
  [profileMutationTypes.GOT_PROFILES](state, { profiles = [], currentProfile = ''}) {
    state.profiles = profiles;
    state.currentProfile = currentProfile;
    state.loading = false;
    state.error = null;
  },
  [profileMutationTypes.GOT_ERROR](state, { error }) {
    state.error = error;
    state.loading = false;
  },
  [profileMutationTypes.CLEAR_ERROR](state) {
    state.error = null;
  }
}

const actions = {
  async fetchProfiles({ commit }) {
		try {
			commit(profileMutationTypes.TOGGLE_LOADING, { loading: true });
      const { profiles = [], currentProfile = '' } = await window.electronAPI.fetchProfiles();
      commit(profileMutationTypes.GOT_PROFILES, { profiles, currentProfile })
		} catch (err) {
      commit(profileMutationTypes.TOGGLE_LOADING, { loading: false });
			commit(profileMutationTypes.GOT_ERROR, { error: err })
		}
	},
  async addProfile({ commit, dispatch }, { url = '' }) {
    try {
      commit(profileMutationTypes.TOGGLE_LOADING, { loading: true });
      await window.electronAPI.addProfile(url);
      await dispatch('fetchProfiles')
    } catch (err) {
      commit(profileMutationTypes.TOGGLE_LOADING, { loading: false });
			commit(profileMutationTypes.GOT_ERROR, { error: err })
		}
  },
  async switchProfile({ commit, dispatch }, { profileUrl }) {
    try {
      commit(profileMutationTypes.TOGGLE_LOADING, { loading: true });
      const res = await requestSwitchConfigs(profileUrl || '')
      if(res == null) {
        await window.electronAPI.switchProfile(profileUrl);
        await dispatch('fetchProfiles')
      } else {
        throw res
      }
    } catch (e) {
      commit(profileMutationTypes.TOGGLE_LOADING, { loading: false });
      const msg = e.message || 'Network Error.'
      commit(profileMutationTypes.GOT_ERROR, { error: msg });
    }
  },
  async reloadProfile({commit, dispatch}, { profileUrl }) {
    commit(profileMutationTypes.TOGGLE_LOADING, { loading: true });
    await window.electronAPI.reloadProfile(profileUrl);
    await dispatch('fetchProfiles')
  },
  async deleteProfile({commit, dispatch }, {  profileUrl }) {
    commit(profileMutationTypes.TOGGLE_LOADING, { loading: true });
    console.log(`delete ${profileUrl}`)
    await window.electronAPI.deleteProfile(profileUrl);
    await dispatch('fetchProfiles')
  },
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}