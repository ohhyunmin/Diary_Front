<template>
  <div class="card-page">
    <div class="card-container">
        <div v-for="post in posts" :key="post.id">
            <Card class="card-item">
                <template #header>
                <div v-if="post.imagedata" class="detail-image-wrap">
                  <img :src="post.imagedata" alt="post image" class="detail-image" />
                </div>
                </template>
                <template #title>
                    {{ post.title }}
                </template>
                <template #content>
                    <p>{{ post.content }}</p>
                </template>
                <template #footer>
                    <p>{{ post.createtime }}</p>
                </template>
            </Card>
        </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Card from 'primevue/card';
import api from "../axios"

export default {
  name: 'CardPage',
  components: {
    Card
  },
  setup() {
    const posts = ref([]);

    // 샘플 게시글 데이터
    const initializePosts = () => {
      api.get('/api/Board/AllBoard').then(response => {
        if (response.status === 200) {
          for (let i = 0; i < response.data.length; i++) {
            const post_data = response.data[i];
            const item = post_data.data || post_data;
            if (item && item.imagedata) {
              console.log(item.imagedata);
              const img = item.imagedata;
              if (typeof img === 'string' && !img.startsWith('data:')) {
                item.imagedata = 'data:image/jpeg;base64,' + img;
              }
            }
          }
          posts.value = response.data;
        } else {
          // fallback or sample data could go here
        }
      }).catch(error => {
        if (error && error.response) {
          console.error('Board list fetch failed:', error.response.status, error.response.headers, error.response.data);
        } else {
          console.error('Board list fetch error:', error);
        }
      });
    };

    onMounted(() => {
      initializePosts();
    });

    return { posts };
  }
};
</script>

<style scoped>
.card-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card-page h1 {
  margin-bottom: 2rem;
  color: var(--text-color);
}

.card-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-item {
  width: 100%;
}

.detail-image-wrap { margin-bottom: 1rem; }
.detail-image { max-width: 100%; height: auto; border-radius: 6px; display: block; }

@media (min-width: 768px) {
  .card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}
</style>
