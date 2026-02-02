import type { GridOptions, Module } from "@ag-grid-community/core";
import type { ComputedRef } from "vue";

export type TreeItemId = number | string;

export interface TreeItemBase {
    id: TreeItemId;
    parent?: TreeItemId;
    [key: string]: unknown;
}

export type TreeStoreComponent = {
    modules: Module[];
    gridOptions: ComputedRef<GridOptions>;
};
