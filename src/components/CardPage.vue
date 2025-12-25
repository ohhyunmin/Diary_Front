<template>
  <div class="card-page">
    <div class="card-container">
        <div v-for="item in items" :key="item.id">
            <Card class="card-item">
                <template #header>
                <img alt="Card Header" src="https://via.placeholder.com/400x200" />
                </template>
                <template #title>
                    {{ item.title }}
                </template>
                <template #content>
                    <p>{{ item.content }}</p>
                </template>
            </Card>
        </div>
    </div>
  </div>
</template>

<script>
import Card from 'primevue/card';


export default {
  name: 'CardPage',
  components: {
    Card
  },
  data(){
    return {
      items: [
        { id: 1, title: 'Item 1', content: 'Content 1' },
        { id: 2, title: 'Item 2', content: 'Content 2' },
        { id: 3, title: 'Item 3', content: 'Content 3' }
      ]
    }
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

@media (min-width: 768px) {
  .card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}
</style>
