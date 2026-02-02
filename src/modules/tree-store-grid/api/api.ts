import type { TreeItemBase } from "@/modules/tree-store-grid/model";

export async function getTestData(): Promise<TreeItemBase[]> {
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, parent: undefined, label: "Пепе" },
                { id: "91064cee", parent: 1, label: "Шнейне" },
                { id: 3, parent: 1, label: "Фааа" },
                { id: 4, parent: "91064cee", label: "Пепе шнейне фата" },
                { id: 5, parent: "91064cee", label: "Айтем 5" },
                { id: 6, parent: "91064cee", label: "кхе кхе Катерина" },
                { id: 7, parent: 4, label: "Айтем 7" },
                { id: 8, parent: 4, label: "Пепе шнейне фата фааа" },
            ]);
        }, 1000);
    });
}
