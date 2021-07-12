import Vue from 'vue'
import { Button, PageHeader, Menu, Icon, Layout, Card, List, Spin } from 'ant-design-vue';
import App from './App.vue'
import store from './store';

Vue.component(Button.name, Button)
Vue.component(PageHeader.name, PageHeader)
Vue.component(Menu.name, Menu)
Vue.component(Menu.Item.name, Menu.Item)
Vue.component(Icon.name, Icon)
Vue.component(Layout.name, Layout)
Vue.component(Layout.Header.name, Layout.Header)
Vue.component(Layout.Sider.name, Layout.Sider)
Vue.component(Layout.Content.name, Layout.Content)
Vue.component(Card.name, Card)
Vue.component(List.name, List)
Vue.component(List.Item.name, List.Item)
Vue.component(List.Item.Meta.name, List.Item.Meta)
Vue.component(Spin.name, Spin)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
