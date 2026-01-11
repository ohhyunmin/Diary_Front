import { createApp } from 'vue'
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config'; // PrimeVue 임포트
import 'primeicons/primeicons.css'; // PrimeIcons 적용
import Aura from '@primeuix/themes/aura';
import App from './App.vue'
import router from './router'

const pinia = createPinia();
createApp(App).use(PrimeVue, {
    
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
}).use(pinia).use(router).mount('#app')
 
