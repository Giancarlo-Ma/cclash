import { requestClashConfigs, requestSaveClashConfigs } from '../../api'
import { callIPC } from '../../native-support/message-queue'
import {  BRG_MSG_GET_CLASHY_CONFIG } from '../../native-support/message-constant'

const state = () => ({
	currentTab: 'Status',
	configs: {},
	clashy: {
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
	gotClashy(state, clashy) {
		state.clashy = clashy
	}
}

const getters = {
	settings(state) {
		const mode = state.configs.mode
		const socksPort = state.configs['socks-port']
		const httpPort = state.configs['port']
		const allowLan = state.configs['allow-lan']
		const startWithSystem = state.clashy.startWithSystem
		const systemProxy = state.clashy.systemProxy
		return { mode, socksPort, httpPort, allowLan, startWithSystem, systemProxy }
	}
}

const actions = {
	async fetchConfigs({ commit }) {
		try {
			const configs = await requestClashConfigs()
			commit('gotConfigs', configs)
			const clashy = await callIPC(BRG_MSG_GET_CLASHY_CONFIG)
			console.log(clashy)
			commit('gotClashy', clashy)
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