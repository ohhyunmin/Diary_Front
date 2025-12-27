<template>
  <div class="board-page">
    <div class="board-container">
      <div class="board-header">
        <h1>게시판</h1>
        <Button 
          label="글쓰기" 
          icon="pi pi-pencil" 
          @click="openWriteModal"
          class="write-btn"
        />
      </div>

      <Card class="board-card">
        <template #content>
          <DataTable 
            :value="posts" 
            :paginator="true" 
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            tableStyle="min-width: 50rem"
            class="board-table"
          >
            <Column field="id" header="번호" :sortable="true" style="width: 10%"></Column>
            <Column field="title" header="제목" :sortable="true" style="width: 50%">
              <template #body="slotProps">
                <a 
                  href="#" 
                  class="post-title-link"
                  @click.prevent="readPost(slotProps.data)"
                >
                  {{ slotProps.data.title }}
                </a>
              </template>
            </Column>
            <Column field="author" header="작성자" :sortable="true" style="width: 15%"></Column>
            <Column field="date" header="작성일" :sortable="true" style="width: 15%"></Column>
            <Column field="views" header="조회수" :sortable="true" style="width: 10%"></Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- 글쓰기 모달 -->
    <Dialog 
      v-model:visible="showWriteModal" 
      modal 
      header="글쓰기" 
      :style="{ width: '50rem' }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div class="write-form">
        <div class="field">
          <label for="title">제목</label>
          <InputText 
            id="title" 
            v-model="newPost.title" 
            class="w-full"
            placeholder="제목을 입력하세요"
          />
        </div>
        <div class="field">
          <label for="author">작성자</label>
          <InputText 
            id="author" 
            v-model="newPost.author" 
            class="w-full"
            placeholder="작성자를 입력하세요"
          />
        </div>
        <div class="field">
          <label for="content">내용</label>
          <Textarea 
            id="content" 
            v-model="newPost.content" 
            rows="10" 
            class="w-full"
            placeholder="내용을 입력하세요"
          />
        </div>
      </div>
      <template #footer>
        <Button 
          label="취소" 
          icon="pi pi-times" 
          @click="closeWriteModal" 
          severity="secondary"
        />
        <Button 
          label="등록" 
          icon="pi pi-check" 
          @click="submitPost" 
          autofocus
        />
      </template>
    </Dialog>

    <!-- 글 읽기 모달 -->
    <Dialog 
      v-model:visible="showReadModal" 
      modal 
      :header="selectedPost?.title || '게시글'" 
      :style="{ width: '50rem' }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div class="read-content" v-if="selectedPost">
        <div class="post-info">
          <div class="info-item">
            <span class="label">작성자:</span>
            <span class="value">{{ selectedPost.author }}</span>
          </div>
          <div class="info-item">
            <span class="label">작성일:</span>
            <span class="value">{{ selectedPost.date }}</span>
          </div>
          <div class="info-item">
            <span class="label">조회수:</span>
            <span class="value">{{ selectedPost.views }}</span>
          </div>
        </div>
        <Divider />
        <div class="post-content">
          {{ selectedPost.content }}
        </div>
      </div>
      <template #footer>
        <Button 
          label="닫기" 
          icon="pi pi-times" 
          @click="closeReadModal" 
          severity="secondary"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Divider from 'primevue/divider';

export default {
  name: 'BoardPage',
  components: {
    Card,
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    Textarea,
    Divider
  },
  setup() {
    const posts = ref([]);
    const showWriteModal = ref(false);
    const showReadModal = ref(false);
    const selectedPost = ref(null);
    
    const newPost = ref({
      title: '',
      author: '',
      content: ''
    });

    // 샘플 게시글 데이터
    const initializePosts = () => {
      posts.value = [
        {
          id: 1,
          title: '첫 번째 게시글입니다',
          author: '홍길동',
          date: '2024-01-15',
          views: 42,
          content: '첫 번째 게시글의 내용입니다. 이것은 샘플 데이터입니다.'
        },
        {
          id: 2,
          title: '두 번째 게시글입니다',
          author: '김철수',
          date: '2024-01-14',
          views: 35,
          content: '두 번째 게시글의 내용입니다. 이것은 샘플 데이터입니다.'
        },
        {
          id: 3,
          title: '세 번째 게시글입니다',
          author: '이영희',
          date: '2024-01-13',
          views: 28,
          content: '세 번째 게시글의 내용입니다. 이것은 샘플 데이터입니다.'
        }
      ];
    };

    const openWriteModal = () => {
      newPost.value = {
        title: '',
        author: '',
        content: ''
      };
      showWriteModal.value = true;
    };

    const closeWriteModal = () => {
      showWriteModal.value = false;
      newPost.value = {
        title: '',
        author: '',
        content: ''
      };
    };

    const submitPost = () => {
      if (!newPost.value.title || !newPost.value.author || !newPost.value.content) {
        alert('모든 항목을 입력해주세요.');
        return;
      }

      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      const post = {
        id: posts.value.length > 0 ? Math.max(...posts.value.map(p => p.id)) + 1 : 1,
        title: newPost.value.title,
        author: newPost.value.author,
        date: dateStr,
        views: 0,
        content: newPost.value.content
      };

      posts.value.unshift(post);
      closeWriteModal();
    };

    const readPost = (post) => {
      selectedPost.value = { ...post };
      post.views += 1;
      showReadModal.value = true;
    };

    const closeReadModal = () => {
      showReadModal.value = false;
      selectedPost.value = null;
    };

    onMounted(() => {
      initializePosts();
    });

    return {
      posts,
      showWriteModal,
      showReadModal,
      selectedPost,
      newPost,
      openWriteModal,
      closeWriteModal,
      submitPost,
      readPost,
      closeReadModal
    };
  }
};
</script>

<style scoped>
.board-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.board-container {
  width: 100%;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.board-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.write-btn {
  background: #42b983;
  border: none;
}

.write-btn:hover {
  background: #359268;
}

.board-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.board-table {
  width: 100%;
}

.post-title-link {
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s;
}

.post-title-link:hover {
  color: #42b983;
  text-decoration: underline;
}

.write-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  color: #2c3e50;
}

.read-content {
  padding: 1rem 0;
}

.post-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
}

.info-item .label {
  font-weight: 600;
  color: #666;
}

.info-item .value {
  color: #2c3e50;
}

.post-content {
  padding: 1.5rem 0;
  line-height: 1.8;
  color: #2c3e50;
  white-space: pre-wrap;
  min-height: 200px;
}

@media (max-width: 768px) {
  .board-page {
    padding: 1rem;
  }

  .board-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .board-header h1 {
    font-size: 1.5rem;
  }

  .write-btn {
    width: 100%;
  }

  .post-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
