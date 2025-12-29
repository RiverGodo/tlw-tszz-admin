import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import '../my-theme/dist/iview.css';

// require styles

// Vue.use(VueQuillEditor, /* { default global options } */)
// import 'iview/dist/styles/iview.css';

Vue.use(iView);
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});
