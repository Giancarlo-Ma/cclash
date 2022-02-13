import { requestClashProxies, requestSwitchProxy } from '../../api/clash-api'

const NON_SELECTOR_KEYS = ['ALL', 'GLOBAL', 'DIRECT', 'REJECT']

const state = () => ({
  proxies: null,
  delays: null,
  testingSpeed: false,
  currentSelector: '',
  error: null
})

const proxyMutationTypes = {
  GOT_PROXIES: 'GOT_PROXIES',
  GOT_ERROR: 'GOT_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CHECK_PROXY_DELAY: 'CHECK_PROXY_DELAY',
  GOT_PROXY_DELAY: 'GOT_PROXY_DELAY'
}

const mutations = {
  [proxyMutationTypes.GOT_PROXIES](state, { proxies }) {
    const { proxies: filtedProxies = [], selector = '' } = filterSelectors(proxies)
    state.proxies = filtedProxies
    state.currentSelector = selector
  },
  [proxyMutationTypes.GOT_ERROR](state, { err }) {
    state.error = err
  }
}

const actions = {
  async fetchProxies({ commit }) {
    try {
      const { proxies } = await requestClashProxies()
      if (proxies == null) {
        throw new Error('No proxies')
      }
      commit(proxyMutationTypes.GOT_PROXIES, { proxies })
    } catch (err) {
      commit(proxyMutationTypes.GOT_ERROR, { err })
    }
  },
  async switchProxy({ commit, dispatch }, { proxy, selector }) {
    try {
      const result = await requestSwitchProxy(selector, proxy)
      if (result == null) {
        await window.electronAPI.switchProxy({ selector, proxy })
        await dispatch('fetchProxies')
      } else {
        throw result
      }
    } catch (err) {
      commit(proxyMutationTypes.GOT_ERROR, { err })
    }
  }
}

function filterSelectors(proxies) {
  if (proxies == null) {
    return { proxies: {}, selector: '' }
  }
  const keys = Object.keys(proxies)
  const validKeys = keys.filter(each => {
    return proxies[each].type === 'Selector' && NON_SELECTOR_KEYS.indexOf(each.toUpperCase()) < 0
  })
  let selector = ''
  const ret = {}
  validKeys.map(each => {
    const value = proxies[each]
    ret[each] = value
    if (value.now != null && value.now.length !== 0) {
      selector = each
    }
    return each
  })
  return {
    proxies: ret,
    selector
  }
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}