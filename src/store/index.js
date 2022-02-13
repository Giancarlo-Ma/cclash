import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import profile from './modules/profile'
import proxy from './modules/proxy'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		app,
		profile,
		proxy
	}
})