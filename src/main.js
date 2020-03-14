// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuikit from 'vuikit';
import VuikitIcons from '@vuikit/icons';

import '@vuikit/theme';
import App from './App';

Vue.use(Vuikit);
Vue.use(VuikitIcons);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
