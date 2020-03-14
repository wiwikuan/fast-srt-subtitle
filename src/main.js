// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuikit from 'vuikit';
import VuikitIcons from '@vuikit/icons';
import VueI18n from 'vue-i18n';

import '@vuikit/theme';
import App from './App';
import messages from './i18n';

Vue.use(Vuikit);
Vue.use(VuikitIcons);
Vue.use(VueI18n);

Vue.config.productionTip = false;

const i18n = new VueI18n({
  locale: 'en',
  messages,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  i18n,
  template: '<App/>',
});
