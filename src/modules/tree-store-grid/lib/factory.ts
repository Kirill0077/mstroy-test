import type { ColDef } from "ag-grid-enterprise";
import type { TreeStore } from "../model";

export function getColumnDefs(treeStore: TreeStore): Readonly<ColDef[]> {
  return [
    {
      headerName: '№ п/п',
      valueGetter: (params) => {
        const rowIndex = params.node?.rowIndex
        return rowIndex != null ? rowIndex + 1 : ''
      },
      width: 90,
    },
    {
      headerName: 'Категория',
      valueGetter: (params) => {
        const id = params.data?.id
        if (id === undefined || id === null) return ''
        return treeStore.getChildren(id).length > 0 ? 'Группа' : 'Элемент'
      },
      width: 120,
    },
    {
      headerName: 'Наименование',
      field: 'label',
      flex: 1,
    },
  ]
}
