<template>
  <div class="board-page">
    <div class="board-container">
      <div class="board-header">
        <h1>게시판</h1>
        <Button 
          label="글쓰기" 
          icon="pi pi-pencil" 
          @click="goToWrite"
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
            <Column field="createtime" header="작성일" :sortable="true" style="width: 15%"></Column>
          </DataTable>
        </template>
      </Card>
    </div>

    
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import api from "../axios"

export default {
  name: 'BoardPage',
  components: {
    Card,
    DataTable,
    Column,
    Button
  },
  props: {
    loginForm: {
      type: Object,
      default: null
    }
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    const posts = ref([]);

    // 샘플 게시글 데이터
    const initializePosts = () => {
      
      // If the API expects query params (GET), pass them via `params` in the config.
      // If the API expects a JSON body, use `axios.post` instead (see commented alternative).
      api.get('/api/Board/AllBoard').then(response => {
        if (response.status === 200) {
          console.log(response.data);
          posts.value = response.data;
        }
        else{
        //   posts.value = [
        //   {
        //     id: 1,
        //     title: '첫 번째 게시글입니다',
        //     author: '홍길동',
        //     date: '2024-01-15',
        //     content: '첫 번째 게시글의 내용입니다. 이것은 샘플 데이터입니다.'
        //   },
        //   {
        //     id: 2,
        //     title: '두 번째 게시글입니다',
        //     author: '김철수',
        //     date: '2024-01-14',
        //     content: '두 번째 게시글의 내용입니다. 이것은 샘플 데이터입니다.'
        //   },
        //   {
        //     id: 3,
        //     title: '세 번째 게시글입니다',
        //     author: '이영희',
        //     date: '2024-01-13',
        //     content: '세 번째 게시글의 내용입니다. 이것은 샘플 데이터입니다.'
        //   }
        // ];
        }
      }).catch(error => {
        // Enhanced error logging to help debug 415 Unsupported Media Type
        if (error && error.response) {
          console.error('Board list fetch failed:', error.response.status, error.response.headers, error.response.data);
        } else {
          console.error('Board list fetch error:', error);
        }
      });
    };

    const goToWrite = () => {
      // Emit an object payload so the parent can receive loginForm
      emit('navigate', { route: '/boardWrite', loginForm: props.loginForm });
    };

    const readPost = (post) => {
      emit('navigate', { route: '/boardDetail', post, loginForm: props.loginForm });
    };

    onMounted(() => {
      initializePosts();
    });

    return {
      posts,
      goToWrite,
      readPost
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
