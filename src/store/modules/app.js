import { requestClashConfigs, requestSaveClashConfigs } from '../../api'

const state = () => ({
	currentTab: 'Status',
	configs: {},
	vclash: {
		startWithSystem: false,
		systemProxy: false
	},
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
	},
	gotVclash(state, vclash) {
		state.vclash = vclash
	}
}

const getters = {
	settings(state) {
		const mode = state.configs.mode
		const socksPort = state.configs['socks-port']
		const httpPort = state.configs['port']
		const allowLan = state.configs['allow-lan']
		const startWithSystem = state.vclash.startWithSystem
		const systemProxy = state.vclash.systemProxy
		return { mode, socksPort, httpPort, allowLan, startWithSystem, systemProxy }
	}
}

const actions = {
	async fetchConfigs({ commit }) {
		try {
			const configs = await requestClashConfigs()
			commit('gotConfigs', configs)
			const vclash = await window.electronAPI.getVclashConfig()
			commit('gotVclash', vclash)
		} catch (err) {
			commit('gotError', err)
		}
	},
	async saveConfigs({ commit }, configs) {
		try {
			const {allowLan, httpPort, mode, socksPort } = configs;
			await requestSaveClashConfigs({
				port: httpPort,
				'socks-port': socksPort,
				'allow-lan': allowLan,
				mode
			})
		} catch (err) {
			commit('gotError', err)
		}
	}
}

export default {
	namespaced: true,
	mutations,
	actions,
	getters,
	state
}