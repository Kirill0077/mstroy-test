import { describe, it, expect } from "vitest";
import { TreeStore } from "@/modules/tree-store-grid/model";
import type { TreeItemBase } from "@/modules/tree-store-grid/model";

function item(id: TreeItemBase["id"], parent?: TreeItemBase["parent"], label = ""): TreeItemBase {
    return { id, parent, label: label || `Item ${id}` };
}

describe("TreeStore", () => {
    describe("constructor", () => {
        it("создаёт пустое хранилище без аргументов", () => {
            const store = new TreeStore();
            expect(store.getAll()).toEqual([]);
        });

        it("инициализирует хранилище переданными элементами", () => {
            const items = [item(1), item(2), item(3)];
            const store = new TreeStore(items);
            expect(store.getAll()).toHaveLength(3);
            expect(store.getItem(1)).toEqual(items[0]);
            expect(store.getItem(2)).toEqual(items[1]);
            expect(store.getItem(3)).toEqual(items[2]);
        });

        it("строит индекс детей по родителю", () => {
            const items = [item(1), item(2, 1), item(3, 1)];
            const store = new TreeStore(items);
            expect(store.getChildren(1)).toHaveLength(2);
            expect(store.getChildren(2)).toEqual([]);
        });
    });

    describe("getAll", () => {
        it("возвращает все элементы в порядке добавления", () => {
            const items = [item(1), item(2), item(3)];
            const store = new TreeStore(items);
            expect(store.getAll()).toEqual(items);
        });
    });

    describe("getItem", () => {
        it("возвращает элемент по id", () => {
            const items = [item(1, undefined, "A"), item(2, 1, "B")];
            const store = new TreeStore(items);
            expect(store.getItem(1)).toEqual(items[0]);
            expect(store.getItem(2)).toEqual(items[1]);
        });

        it("возвращает undefined для несуществующего id", () => {
            const store = new TreeStore([item(1)]);
            expect(store.getItem(999)).toBeUndefined();
        });
    });

    describe("getChildren", () => {
        it("возвращает прямых детей по id родителя", () => {
            const items = [item(1), item(2, 1), item(3, 1), item(4, 2)];
            const store = new TreeStore(items);
            expect(store.getChildren(1)).toHaveLength(2);
            expect(store.getChildren(1).map((i) => i.id)).toEqual([2, 3]);
            expect(store.getChildren(2)).toHaveLength(1);
            expect(store.getChildren(2)[0]?.id).toBe(4);
        });

        it("возвращает пустой массив для узла без детей", () => {
            const store = new TreeStore([item(1), item(2, 1)]);
            expect(store.getChildren(2)).toEqual([]);
        });

        it("возвращает корневые элементы для undefined", () => {
            const items = [item(1), item(2), item(3, 1)];
            const store = new TreeStore(items);
            expect(store.getChildren(undefined as unknown as number)).toEqual([item(1), item(2)]);
        });
    });

    describe("getAllChildren", () => {
        it("возвращает всех потомков в ширину", () => {
            const items = [
                item(1),
                item(2, 1),
                item(3, 1),
                item(4, 2),
                item(5, 2),
                item(6, 4),
            ];
            const store = new TreeStore(items);
            const children = store.getAllChildren(1);
            expect(children.map((i) => i.id)).toEqual([2, 3, 4, 5, 6]);
        });

        it("возвращает пустой массив для листа", () => {
            const store = new TreeStore([item(1), item(2, 1)]);
            expect(store.getAllChildren(2)).toEqual([]);
        });
    });

    describe("getAllParents", () => {
        it("возвращает цепочку родителей от узла до корня", () => {
            const items = [item(1), item(2, 1), item(3, 2), item(4, 3)];
            const store = new TreeStore(items);
            expect(store.getAllParents(4).map((i) => i.id)).toEqual([4, 3, 2, 1]);
        });

        it("возвращает только сам узел для корневого элемента", () => {
            const store = new TreeStore([item(1), item(2, 1)]);
            expect(store.getAllParents(1).map((i) => i.id)).toEqual([1]);
        });

        it("возвращает пустой массив для несуществующего id", () => {
            const store = new TreeStore([item(1)]);
            expect(store.getAllParents(999)).toEqual([]);
        });
    });

    describe("addItem", () => {
        it("добавляет новый элемент", () => {
            const store = new TreeStore([item(1)]);
            const newItem = item(2, 1, "New");
            store.addItem(newItem);
            expect(store.getAll()).toHaveLength(2);
            expect(store.getItem(2)).toEqual(newItem);
            expect(store.getChildren(1)).toHaveLength(1);
        });

        it("игнорирует добавление элемента с существующим id", () => {
            const store = new TreeStore([item(1, undefined, "A")]);
            store.addItem(item(1, undefined, "B"));
            expect(store.getAll()).toHaveLength(1);
            expect(store.getItem(1)?.label).toBe("A");
        });
    });

    describe("removeItem", () => {
        it("удаляет элемент без детей", () => {
            const store = new TreeStore([item(1), item(2, 1)]);
            store.removeItem(2);
            expect(store.getItem(2)).toBeUndefined();
            expect(store.getAll()).toHaveLength(1);
            expect(store.getChildren(1)).toEqual([]);
        });

        it("удаляет элемент и всех его потомков", () => {
            const items = [item(1), item(2, 1), item(3, 2), item(4, 2)];
            const store = new TreeStore(items);
            store.removeItem(2);
            expect(store.getItem(2)).toBeUndefined();
            expect(store.getItem(3)).toBeUndefined();
            expect(store.getItem(4)).toBeUndefined();
            expect(store.getAll()).toHaveLength(1);
            expect(store.getChildren(1)).toEqual([]);
        });

        it("ничего не делает для несуществующего id", () => {
            const store = new TreeStore([item(1)]);
            store.removeItem(999);
            expect(store.getAll()).toHaveLength(1);
        });
    });

    describe("updateItem", () => {
        it("обновляет данные элемента без смены родителя", () => {
            const store = new TreeStore([item(1, undefined, "Old")]);
            store.updateItem(item(1, undefined, "New"));
            expect(store.getItem(1)?.label).toBe("New");
            expect(store.getAll()).toHaveLength(1);
        });

        it("переносит элемент к другому родителю", () => {
            const items = [item(1), item(2), item(3, 1)];
            const store = new TreeStore(items);
            expect(store.getChildren(1)).toHaveLength(1);
            expect(store.getChildren(2)).toHaveLength(0);

            store.updateItem(item(3, 2, "Moved"));

            expect(store.getChildren(1)).toEqual([]);
            expect(store.getChildren(2)).toHaveLength(1);
            expect(store.getChildren(2)[0]?.id).toBe(3);
        });

        it("ничего не делает для несуществующего id", () => {
            const store = new TreeStore([item(1)]);
            store.updateItem(item(999, undefined, "Ghost"));
            expect(store.getAll()).toHaveLength(1);
            expect(store.getItem(999)).toBeUndefined();
        });
    });
});
