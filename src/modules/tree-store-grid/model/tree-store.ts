import type { TreeItemBase, TreeItemId } from ".";

export class TreeStore<T extends TreeItemBase = TreeItemBase> {
    private readonly items: T[] = [];
    private readonly byId = new Map<TreeItemId, T>();
    private readonly childrenByParent = new Map<TreeItemId | undefined, T[]>();

    constructor(initialItems: T[] = []) {
        for (const item of initialItems) {
            this.items.push(item);
            this.byId.set(item.id, item);
            const parentKey = item.parent;
            let list = this.childrenByParent.get(parentKey);
            if (!list) {
                list = [];
                this.childrenByParent.set(parentKey, list);
            }
            list.push(item);
        }
    }

    getAll(): T[] {
        return this.items;
    }

    getItem(id: TreeItemId): T | undefined {
        return this.byId.get(id);
    }

    getChildren(id: TreeItemId): T[] {
        return this.childrenByParent.get(id) ?? [];
    }

    getAllChildren(id: TreeItemId): T[] {
        const result: T[] = [];
        const queue = this.getChildren(id);
        for (let i = 0; i < queue.length; i++) {
            const item = queue[i];
            if (item === undefined) continue;
            result.push(item);
            const children = this.getChildren(item.id);
            for (const c of children) {
                queue.push(c);
            }
        }
        return result;
    }

    getAllParents(id: TreeItemId): T[] {
        const result: T[] = [];
        let current = this.byId.get(id);
        while (current) {
            result.push(current);
            if (current.parent === undefined) break;
            current = this.byId.get(current.parent);
        }
        return result;
    }

    addItem(item: T): void {
        if (this.byId.has(item.id)) return;
        this.items.push(item);
        this.byId.set(item.id, item);
        const parentKey = item.parent;
        let list = this.childrenByParent.get(parentKey);
        if (!list) {
            list = [];
            this.childrenByParent.set(parentKey, list);
        }
        list.push(item);
    }

    removeItem(id: TreeItemId): void {
        const item = this.byId.get(id);
        if (!item) return;
        const toRemove = new Set<TreeItemId>([id]);
        const descendants = this.getAllChildren(id);
        for (const c of descendants) {
            toRemove.add(c.id);
        }
        const parentKey = item.parent;
        for (const rid of toRemove) {
            this.byId.delete(rid);
            const childList = this.childrenByParent.get(rid);
            if (childList) {
                this.childrenByParent.delete(rid);
            }
        }
        const parentList = this.childrenByParent.get(parentKey);
        if (parentList) {
            const filtered = parentList.filter((x) => x.id !== id);
            if (filtered.length === 0) {
                this.childrenByParent.delete(parentKey);
            } else {
                parentList.length = 0;
                parentList.push(...filtered);
            }
        }
        for (let i = this.items.length - 1; i >= 0; i--) {
            const row = this.items[i];
            if (row !== undefined && toRemove.has(row.id)) {
                this.items.splice(i, 1);
            }
        }
    }

    updateItem(item: T): void {
        const existing = this.byId.get(item.id);
        if (!existing) return;
        const oldParent = existing.parent;
        const newParent = item.parent;
        this.byId.set(item.id, item);
        const idx = this.items.findIndex((x) => x.id === item.id);
        if (idx !== -1) {
            this.items[idx] = item;
        }
        if (oldParent !== newParent) {
            const oldList = this.childrenByParent.get(oldParent);
            if (oldList) {
                const filtered = oldList.filter((x) => x.id !== item.id);
                if (filtered.length === 0) {
                    this.childrenByParent.delete(oldParent);
                } else {
                    oldList.length = 0;
                    oldList.push(...filtered);
                }
            }
            let newList = this.childrenByParent.get(newParent);
            if (!newList) {
                newList = [];
                this.childrenByParent.set(newParent, newList);
            }
            newList.push(item);
        }
    }
}
