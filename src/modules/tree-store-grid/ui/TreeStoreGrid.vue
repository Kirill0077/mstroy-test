<script setup lang="ts">
import { toRef } from "vue";
import { AgGridVue } from "@ag-grid-community/vue3";
import { type TreeItemBase } from "@/modules/tree-store-grid/model";
import { useTreeStore } from "../composables";

const props = defineProps<{
    treeItems: TreeItemBase[];
}>();

const treeStore = toRef(() => props.treeItems);
const { modules, gridOptions } = useTreeStore(treeStore);
</script>

<template>
    <div class="tree-store-grid-wrapper">
        <AgGridVue
            class="ag-theme-quartz"
            :grid-options="gridOptions"
            :modules="modules"
            style="height: 400px; width: 100%"
        />
    </div>
</template>

<style scoped>
.tree-store-grid-wrapper {
    width: 100%;
}
</style>
