import { callIPC } from "../../native-support/message-queue"
import { BRG_MSG_FETCH_PROFILES } from '../../native-support/message-constant'

const state = () => ({
  profiles: [],
  currentProfile: '',
  loading: false,
  error: null
})

const profileMutationTypes = {
  TOGGLE_LOADING: 'TOGGLE_LOADING'
}

const mutations = {
  [profileMutationTypes.TOGGLE_LOADING](state, { loading }) {
    state.loading = loading
  }
}

const actions = {
  async fetchProfiles({ commit }) {
		try {
			commit(profileMutationTypes.TOGGLE_LOADING, { loading: true });
      await callIPC(BRG_MSG_FETCH_PROFILES)
		} catch (err) {
			commit('gotError', err)
		}
	},
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}