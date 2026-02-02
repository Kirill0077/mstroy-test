<script setup lang="ts">
import { computed } from "vue";
import { AgGridVue } from "@ag-grid-community/vue3";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { TreeStore, type TreeItemBase } from "@/modules/tree-store-grid/model";
import type { ColDef, Module } from "@ag-grid-community/core";
import { getColumnDefs } from "../lib";

const props = defineProps<{
    treeStore: TreeItemBase[];
}>();

const modules: Module[] = [ClientSideRowModelModule, RowGroupingModule as Module];

const treeStore = computed(() => new TreeStore(props.treeStore));

const rowData = computed(() => treeStore.value.getAll());

const getDataPath = (data: { id: unknown; parent: unknown }) => {
    const parents = treeStore.value.getAllParents(data.id as number | string);
    return parents.map((p) => String(p.id)).reverse();
};

const getRowId = (params: { data: { id: unknown } }) => String(params.data.id);

const columnDefs = computed(() => getColumnDefs(treeStore.value));

const defaultColDef = {
    sortable: true,
    resizable: true,
};

const gridOptions = computed(() => ({
    treeData: true,
    getDataPath,
    getRowId,
    groupDefaultExpanded: -1 as const,
    rowData: rowData.value,
    columnDefs: columnDefs.value as ColDef[],
    defaultColDef,
}));
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
