import { requestClashConfigs } from '../../api'

const state = () => ({
	currentTab: 'Status',
	configs: {},
	error: null,
})

const mutations = {
	switchAppTab(state, tab) {
		state.currentTab = tab
	},
	gotConfigs(state, configs) {
		state.configs = configs
	},
	gotError(state, error) {
		state.error = error
	}
}

const actions = {
	async fetchConfigs({ commit }) {
		try {
			const configs = await requestClashConfigs()
			commit('gotConfigs', configs);
		} catch (err) {
			commit('gotError', err)
		}
	}
}

export default {
	namespaced: true,
	mutations,
	actions,
	state
}