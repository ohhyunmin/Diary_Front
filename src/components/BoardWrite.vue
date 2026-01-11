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
                  :multiple="false"
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
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../authStore';
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
  setup() {
    const formData = ref({
      title: '',
      author: '',
      content: '',
      image: ref(null)
    });

    const route = useRoute();
    const router = useRouter();
    const auth = useAuthStore();

    const uploadedImages = ref([]);

    const onFileSelect = (event) => {
      const files = event.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          // replace any existing image with the newly selected one
          uploadedImages.value = [{
            name: file.name,
            file: file,
            url: e.target.result,
            size: file.size
          }];
          formData.value.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      // since we only allow one image, clear arrays entirely
      uploadedImages.value = [];
      formData.value.image = null;
    };

    const validateForm = () => {
      console.log('auth:', auth.loginForm);
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
      console.log(auth.loginForm);
      const parsedLogin = route.query.loginForm ? JSON.parse(route.query.loginForm) : null;
      const loginFromStore = auth.loginForm || null;
      const effectiveLogin = parsedLogin || loginFromStore;

      const postPayload = {
        email: effectiveLogin && effectiveLogin.email ? effectiveLogin.email : '',
        title: formData.value.title,
        author: formData.value.author,
        content: formData.value.content,
        date: dateStr
      };

      // If an image (data URL) is present, send multipart/form-data
      if (formData.value.image) {
        const form = new FormData();
        Object.keys(postPayload).forEach(key => form.append(key, postPayload[key]));

        // convert dataURL to Blob and append as file
        const dataUrl = formData.value.image;
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        form.append('image', blob, uploadedImages.value[0]?.name || 'image.jpg');

        api.post('/api/Board', form).then(response => {
          if (response.status === 200) {
            router.push({ name: 'BoardPage' }).catch(() => {});
          }
        }).catch(err => {
          console.error('CreateBoard failed:', err.response || err);
          alert('게시글 등록 중 오류가 발생했습니다.');
        });
      } else {
        // No image — send JSON
        const form = new FormData();
        Object.keys(postPayload).forEach(key => form.append(key, postPayload[key]));
        console.log(postPayload);
        api.post('/api/Board', form).then(response => {
          if (response.status === 200) {
            router.push({ name: 'BoardPage' }).catch(() => {});
          }
        }).catch(err => {
          console.error('CreateBoard failed:', err.response || err);
          alert('게시글 등록 중 오류가 발생했습니다.');
        });
      }
    };

    const goToList = () => {
      router.push({ name: 'BoardPage' }).catch(() => {});
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
