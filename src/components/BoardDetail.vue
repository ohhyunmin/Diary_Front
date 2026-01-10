<template>
  <div class="board-detail">
    <div class="board-container">
      <div class="board-header">
        <h1>게시글 상세</h1>
        <Button label="목록으로" icon="pi pi-angle-left" @click="goToList" class="back-btn" />
      </div>

      <Card class="detail-card">
        <template #content>
          <div v-if="post">
            <h2 class="detail-title">{{ post.title }}</h2>
            <div class="post-info">
              <div class="info-item"><span class="label">작성자:</span> <span class="value">{{ post.author }}</span></div>
              <div class="info-item"><span class="label">작성일:</span> <span class="value">{{ post.createtime }}</span></div>
            </div>
            <div class="post-content">{{ post.content }}</div>
          </div>
          <div v-else class="no-post">게시글을 찾을 수 없습니다.</div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
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
  emits: ['navigate'],
  setup(props, { emit }) {

    const post = ref(null);

    // 샘플 게시글 데이터 / 상세 조회
    const initializePosts = () => {
      console.log('BoardDetail props:', props);
      if (props.post && props.post.id) {
        api.get('/api/Board/' + props.post.id).then(response => {
          if (response.status === 200) {
            console.log(response.data);
            post.value = response.data;
          }
        }).catch(error => {
          if (error && error.response) {
            console.error('Board detail fetch failed:', error.response.status, error.response.headers, error.response.data);
          } else {
            console.error('Board detail fetch error:', error);
          }
        });
      }
    };

    onMounted(() => {
      initializePosts();
      // log loginForm when BoardPage mounts
      console.log('BoardPage mounted loginForm:', props.loginForm);
    });

    const goToList = () => {
      emit('navigate', { route: '/boardPage', loginForm: props.loginForm });
    };

    return { goToList };
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
.no-post { color:#999; padding:1rem; }
</style>
