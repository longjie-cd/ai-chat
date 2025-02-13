import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'

// TDesign
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import TDesignChat from '@tdesign-vue-next/chat'; // 引入chat组件

const app = createApp(App);
app.use(TDesign);
app.use(TDesignChat);
app.mount('#app')
