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
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'HomePage',
  setup() {
    const images = ref([
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
        alt: '산 풍경'
      },
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop',
        alt: '자연 풍경'
      },
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
        alt: '숲 풍경'
      },
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=600&fit=crop',
        alt: '바다 풍경'
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=600&fit=crop',
        alt: '호수 풍경'
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
    });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    return {
      images,
      currentImageIndex,
      nextImage,
      goToImage
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
</style>
