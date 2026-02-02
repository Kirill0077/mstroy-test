<script setup lang="ts">
import { TreeStoreGrid, getTestData, type TreeItemBase } from "@/modules/tree-store-grid";
import { onMounted, ref } from "vue";

const loading = ref(true);
const treeStore = ref<TreeItemBase[]>([]);

onMounted(async () => {
    treeStore.value = await getTestData();
    loading.value = false;
});
</script>

<template>
    <div class="app">
        <h1 class="app-title">Хранилище дерева</h1>
        <TreeStoreGrid v-if="!loading" :treeItems="treeStore" />
        <div v-else>Загрузка...</div>
    </div>
</template>

<style scoped>
.app {
    padding: 1rem;
    max-width: 900px;
    min-height: 100px;
    max-height: 100svh;
    height: 400px;
    margin: 0 auto;
}

.app-title {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    color: #4b4b4b;
}
</style>
