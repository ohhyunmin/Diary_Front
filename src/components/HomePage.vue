<template>
  <div class="home-page">
    <div class="image-slider-section">
      <div class="slider-container">
        <transition name="fade" mode="out-in">
          <img 
            :key="currentImageIndex" 
            :src="images[currentImageIndex].url" 
            :alt="images[currentImageIndex].alt"
            class="slider-image"
          />
        </transition>
        
        <!-- 이미지 인디케이터 -->
        <div class="image-indicators">
          <button
            v-for="(image, index) in images"
            :key="index"
            :class="['indicator', { active: currentImageIndex === index }]"
            @click="goToImage(index)"
            :aria-label="`이미지 ${index + 1}로 이동`"
          ></button>
        </div>
      </div>
    </div>

    <div class="calendar-section">
      <Card class="calendar-card">
        <template #title>
          <h2>일정 캘린더</h2>
        </template>
        <template #content>
          <FullCalendar :options="calendarOptions" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import Card from 'primevue/card';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../axios'

export default {
  name: 'HomePage',
  components: {
    Card,
    FullCalendar
  },
  setup() {
    const posts = ref([]);
    const events = ref([]);
    const images = ref([
      {
        url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=600&fit=crop',
        alt: '아이와 놀이'
      },
      {
        url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=600&fit=crop',
        alt: '행복한 아이'
      },
      {
        url: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&h=600&fit=crop',
        alt: '아이의 일상'
      },
      {
        url: 'https://images.unsplash.com/photo-1445633629932-0029acc44e88?w=1200&h=600&fit=crop',
        alt: '아이의 성장'
      },
      {
        url: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=1200&h=600&fit=crop',
        alt: '아이의 순간'
      }
    ]);

    const currentImageIndex = ref(0);
    let intervalId = null;

    const nextImage = () => {
      currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
    };

    const goToImage = (index) => {
      currentImageIndex.value = index;
      // 이미지 변경 시 타이머 리셋
      resetTimer();
    };

    const startTimer = () => {
      intervalId = setInterval(nextImage, 5000); // 5초마다 변경
    };

    const resetTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      startTimer();
    };

    onMounted(() => {
      startTimer();
      api.get('/api/Board/AllBoard').then(response => {
        if (response.status === 200) {
          for (let i = 0; i < response.data.length; i++) {
            const post_data = response.data[i];
            const item = post_data.data || post_data;
            if (item && item.imagedata) {
              const img = item.imagedata;
              if (typeof img === 'string' && !img.startsWith('data:')) {
                item.imagedata = 'data:image/jpeg;base64,' + img;
              }
            }
          }
          posts.value = response.data;

          // convert posts to FullCalendar events using `createtime`
          events.value = posts.value.map(p => {
            let start = null;
            if (p.createtime) {
              const d = new Date(p.createtime);
              start = !isNaN(d) ? d.toISOString() : p.createtime;
            }
            return {
              id: p.id,
              title: p.title || '제목 없음',
              start: start,
              allDay: true,
              color: '#42b983'
            };
          });

          // ensure calendarOptions is updated
          calendarOptions.value.events = [...events.value];
        } else {
          // fallback or sample data could go here
        }
      })
    });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth'
      },
      events: events.value,
      editable: true,
      selectable: true,
      eventClick: (info) => {
        alert('이벤트: ' + info.event.title);
      },
      dateClick: (info) => {
        const title = prompt('일정 제목을 입력하세요:');
        if (title) {
          events.value.push({
            title: title,
            start: info.dateStr,
            color: '#42b983'
          });
          // calendarOptions의 events 업데이트
          calendarOptions.value.events = [...events.value];
        }
      }
    });

    return {
      images,
      currentImageIndex,
      nextImage,
      goToImage,
      calendarOptions,
      events
    };
  }
};
</script>

<style scoped>
.home-page {
  width: 100%;
}

.image-slider-section {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 500px;
  background-color: #f0f0f0;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 페이드 전환 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 이미지 인디케이터 */
.image-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator:hover {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background-color: white;
  width: 30px;
  border-radius: 6px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .slider-container {
    height: 300px;
  }

  .image-indicators {
    bottom: 10px;
  }

  .indicator {
    width: 10px;
    height: 10px;
  }

  .indicator.active {
    width: 25px;
  }
}

.calendar-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-card {
  margin-top: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.calendar-card h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

/* FullCalendar 기본 스타일 */
:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-header-toolbar) {
  margin-bottom: 1.5em;
}

:deep(.fc-button) {
  background-color: #42b983;
  border-color: #42b983;
}

:deep(.fc-button:hover) {
  background-color: #359268;
  border-color: #359268;
}

:deep(.fc-button-primary:not(:disabled).fc-button-active) {
  background-color: #359268;
  border-color: #359268;
}

@media (max-width: 768px) {
  .calendar-section {
    padding: 1rem;
  }
}
</style>
