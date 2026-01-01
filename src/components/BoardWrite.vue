<template>
  <div class="board-write-page">
    <div class="write-container">
      <Card class="write-card">
        <template #title>
          <div class="write-header">
            <h1>글쓰기</h1>
            <Button 
              label="목록으로" 
              icon="pi pi-arrow-left" 
              severity="secondary"
              @click="goToList"
            />
          </div>
        </template>
        <template #content>
          <div class="write-form">
            <div class="field">
              <label for="title">제목 <span class="required">*</span></label>
              <InputText 
                id="title" 
                v-model="formData.title" 
                class="w-full"
                placeholder="제목을 입력하세요"
              />
            </div>

            <div class="field">
              <label for="author">작성자 <span class="required">*</span></label>
              <InputText 
                id="author" 
                v-model="formData.author" 
                class="w-full"
                placeholder="작성자를 입력하세요"
              />
            </div>

            <div class="field">
              <label for="content">내용 <span class="required">*</span></label>
              <Textarea 
                id="content" 
                v-model="formData.content" 
                rows="15" 
                class="w-full"
                placeholder="내용을 입력하세요"
              />
            </div>

            <div class="field">
              <label>이미지 업로드</label>
              <div class="image-upload-section">
                <FileUpload
                  mode="basic"
                  accept="image/*"
                  :maxFileSize="5000000"
                  :auto="true"
                  chooseLabel="이미지 선택"
                  class="upload-button"
                  @select="onFileSelect"
                />
                <div v-if="uploadedImages.length > 0" class="uploaded-images">
                  <div 
                    v-for="(image, index) in uploadedImages" 
                    :key="index"
                    class="image-preview-item"
                  >
                    <img :src="image.url" :alt="image.name" class="preview-image" />
                    <Button
                      icon="pi pi-times"
                      severity="danger"
                      rounded
                      text
                      class="remove-image-btn"
                      @click="removeImage(index)"
                      :aria-label="`이미지 ${index + 1} 삭제`"
                    />
                    <span class="image-name">{{ image.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="write-footer">
            <Button 
              label="취소" 
              icon="pi pi-times" 
              severity="secondary"
              @click="goToList"
            />
            <Button 
              label="등록" 
              icon="pi pi-check" 
              @click="submitPost"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import api from "../axios"

export default {
  name: 'BoardWrite',
  props: {
    loginForm: {
      type: Object,
      default: null
    }
  },
  components: {
    Card,
    InputText,
    Textarea,
    Button,
    FileUpload
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const formData = ref({
      title: '',
      author: '',
      content: '',
      images: []
    });

    const uploadedImages = ref([]);

    const onFileSelect = (event) => {
      const files = event.files;
      if (files && files.length > 0) {
        Array.from(files).forEach(file => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              uploadedImages.value.push({
                name: file.name,
                file: file,
                url: e.target.result,
                size: file.size
              });
              formData.value.images.push({
                name: file.name,
                file: file,
                url: e.target.result
              });
            };
            reader.readAsDataURL(file);
          } else {
            alert('이미지 파일만 업로드 가능합니다.');
          }
        });
      }
    };

    const removeImage = (index) => {
      uploadedImages.value.splice(index, 1);
      formData.value.images.splice(index, 1);
    };

    const validateForm = () => {
      if (!formData.value.title.trim()) {
        alert('제목을 입력해주세요.');
        return false;
      }
      if (!formData.value.author.trim()) {
        alert('작성자를 입력해주세요.');
        return false;
      }
      if (!formData.value.content.trim()) {
        alert('내용을 입력해주세요.');
        return false;
      }
      return true;
    };

    const submitPost = () => {
      if (!validateForm()) {
        return;
      }

      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      const post = {
        email: props.loginForm ? props.loginForm.email : '',
        title: formData.value.title,
        author: formData.value.author,
        content: formData.value.content,
        date: dateStr,
        views: 0,
        images: formData.value.images.map(img => img.url)
      };
      console.log(formData.value.images.map(img => img.url)); 
      //등록 요청 후 응답 받은 후 목록 페이지로 이동
      api.post('/api/Board/CreateBoard', post).then(response => {
        if (response.status === 200) {
          emit('registerPost', post);
        }
      });
    };

    const goToList = () => {
      emit('cancel');
    };

    return {
      formData,
      uploadedImages,
      onFileSelect,
      removeImage,
      submitPost,
      goToList
    };
  }
};
</script>

<style scoped>
.board-write-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.write-container {
  width: 100%;
}

.write-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.write-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.75rem;
}

.write-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.required {
  color: #e74c3c;
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-button {
  width: fit-content;
}

.uploaded-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-preview-item {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.5rem;
  background: #f9f9f9;
}

.preview-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(4px);
}

.image-name {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.write-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .board-write-page {
    padding: 1rem;
  }

  .write-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .write-header h1 {
    font-size: 1.5rem;
  }

  .write-footer {
    flex-direction: column-reverse;
  }

  .write-footer button {
    width: 100%;
  }

  .uploaded-images {
    grid-template-columns: 1fr;
  }
}
</style>
