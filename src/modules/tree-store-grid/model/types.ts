export type TreeItemId = number | string;

export interface TreeItemBase {
  id: TreeItemId;
  parent?: TreeItemId;
  [key: string]: unknown;
}
