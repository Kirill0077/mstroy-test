import type { ColDef, GetDataPath, GridOptions, Module } from "@ag-grid-community/core";
import { TreeStore, type TreeItemBase, type TreeStoreComponent } from "../model";
import { computed, onMounted, type Ref } from "vue";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";



export function useTreeStore(treeStore: Ref<TreeItemBase[]>): TreeStoreComponent {
    const modules: Module[] = [ClientSideRowModelModule, RowGroupingModule] as Module[];
    const treeStoreInstance = computed(() => new TreeStore(treeStore.value));
    const rowData = computed(() => treeStoreInstance.value.getAll());
    const columnDefs = computed(() => getColumnDefs(treeStoreInstance.value));

    const defaultColDef = {
        sortable: true,
        resizable: true,
    };

    onMounted(() => {
        console.log(rowData.value, columnDefs.value);
    });

    const gridOptions = computed<GridOptions>(() => {
        const store = treeStoreInstance.value;
        return {
            treeData: true,
            getDataPath: getDataPath(store),
            getRowId,
            groupDefaultExpanded: -1 as const,
            rowData: rowData.value,
            columnDefs: [...columnDefs.value],
            defaultColDef,
            suppressLoadingOverlay: true,
            rowClassRules: {
                "ag-row-group": (params) => {
                    const id = params.data?.id;
                    return id != null && store.getChildren(id).length > 0;
                },
            },
        };
    });


    return { modules, gridOptions };
}

export function getColumnDefs(treeStore: TreeStore): ColDef[] {
    return [
        {
            headerName: "№ п/п",
            valueGetter: (params) => {
                const rowIndex = params.node?.rowIndex;
                return rowIndex != null ? rowIndex + 1 : "";
            },
            width: 90,
        },
        {
            headerName: "Категория",
            valueGetter: (params) => {
                const id = params.data?.id;
                if (id === undefined || id === null) return "";
                return treeStore.getChildren(id).length > 0 ? "Группа" : "Элемент";
            },
            width: 120,
        },
        {
            headerName: "Наименование",
            field: "label",
            flex: 1,
        },
    ];
}

export const getDataPath =
    (treeStore: TreeStore): GetDataPath =>
        (data) => {
            const parents = treeStore.getAllParents(data?.id);
            return parents.map((p: TreeItemBase) => String(p.id)).reverse();
        };

export const getRowId = (params: { data: TreeItemBase }) => String(params.data.id);
