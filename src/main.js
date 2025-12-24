import { createApp } from 'vue'

import PrimeVue from 'primevue/config'; // PrimeVue 임포트
import 'primeicons/primeicons.css'; // PrimeIcons 적용
import Aura from '@primeuix/themes/aura';
import App from './App.vue'

createApp(App).use(PrimeVue, {
    
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
}).mount('#app')
 
