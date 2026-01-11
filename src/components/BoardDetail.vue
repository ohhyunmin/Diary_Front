<template>
  <div class="board-detail">
    <div class="board-container">
      <div class="board-header">
        <h1>게시글 상세</h1>
        <div>
          <Button label="목록으로" icon="pi pi-angle-left" @click="goToList" class="back-btn" style="margin-right:8px;" />
          <Button label="수정" icon="pi pi-pencil" @click="goToUpdate" class="back-btn" />
        </div>
      </div>

      <Card class="detail-card">
        <template #content>
          <div v-if="displayPost">
            <h2 class="detail-title">{{ displayPost.title }}</h2>
            <div class="post-info">
              <div class="info-item"><span class="label">작성자:</span> <span class="value">{{ displayPost.author }}</span></div>
              <div class="info-item"><span class="label">작성일:</span> <span class="value">{{ displayPost.createtime }}</span></div>
            </div>
            <div v-if="displayPost.imagedata" class="detail-image-wrap">
              <img :src="displayPost.imagedata" alt="post image" class="detail-image" />
            </div>
            <div class="post-content">{{ displayPost.content }}</div>
          </div>
          <div v-else class="no-post">게시글을 찾을 수 없습니다.</div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import api from "../axios"

export default {
  name: 'BoardDetail',
  components: { Card, Button },
  props: {
    post: {
      type: Object,
      default: null
    },
    loginForm: {
      type: Object,
      default: null
    }
  },
  setup(props) {

    const detailPost = ref(null);

    const displayPost = computed(() => detailPost.value || props.post);

    const route = useRoute();
    const router = useRouter();

    // 샘플 게시글 데이터 / 상세 조회
    const initializePosts = () => {
      
      console.log('BoardDetail route.params:', route.params);
      const routeId = route.params && route.params.id;
      const fetchById = (id) => {
        api.get('/api/Board/' + id).then(response => {
          if (response.status === 200) {
            if (response.data.imagedata) {
              const img = response.data.imagedata;
              if (typeof img === 'string' && !img.startsWith('data:')) {
                response.data.imagedata = 'data:image/jpeg;base64,' + img;
              }
            }
            detailPost.value = response.data;
          }
        }).catch(error => {
          if (error && error.response) {
            console.error('Board detail fetch failed:', error.response.status, error.response.headers, error.response.data);
          } else {
            console.error('Board detail fetch error:', error);
          }
        });
      };

      if (routeId) {
        fetchById(routeId);
      } else if (props.post && props.post.id) {
        fetchById(props.post.id);
      } else if (props.post) {
        detailPost.value = props.post;
      }
    };

    onMounted(() => {
      initializePosts();
    });

    const goToList = () => {
      router.push({ name: 'BoardPage' }).catch(() => {});
    };

    const goToUpdate = () => {
      const id = (displayPost.value && displayPost.value.id) || (props.post && props.post.id);
      if (id) {
        router.push({ name: 'BoardUpdate', params: { id } }).catch(() => {});
      } else {
        console.warn('goToUpdate: no post id available');
      }
    };

    return { displayPost, goToList, goToUpdate };
  }
};
</script>

<style scoped>
.board-detail { padding: 2rem; max-width: 900px; margin: 0 auto; }
.board-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
.back-btn { background:#42b983; border:none; }
.back-btn:hover { background:#359268; }
.detail-card { box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
.detail-title { margin:0 0 1rem 0; color:#2c3e50; }
.post-info { display:flex; gap:2rem; margin-bottom:1rem; }
.info-item .label { font-weight:600; color:#666; margin-right:0.5rem; }
.post-content { white-space:pre-wrap; line-height:1.8; color:#2c3e50; padding-top:0.5rem; }
.detail-image-wrap { margin-bottom: 1rem; }
.detail-image { max-width: 100%; height: auto; border-radius: 6px; display: block; }
.no-post { color:#999; padding:1rem; }
</style>
