import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { AgGridVue } from "@ag-grid-community/vue3";
import TreeStoreGrid from "@/modules/tree-store-grid/ui/TreeStoreGrid.vue";
import type { TreeItemBase } from "@/modules/tree-store-grid/model";

const mockTreeItems: TreeItemBase[] = [
    { id: 1, label: "Корень 1" },
    { id: 2, parent: 1, label: "Дочерний 1" },
];

describe("TreeStoreGrid", () => {
    it("монтируется и рендерит обёртку", () => {
        const wrapper = mount(TreeStoreGrid, {
            props: { treeItems: [] },
            global: {
                stubs: { AgGridVue: true },
            },
        });
        expect(wrapper.find(".tree-store-grid-wrapper").exists()).toBe(true);
    });

    it("передаёт treeItems через props", () => {
        const wrapper = mount(TreeStoreGrid, {
            props: { treeItems: mockTreeItems },
            global: {
                stubs: { AgGridVue: true },
            },
        });
        expect(wrapper.props("treeItems")).toEqual(mockTreeItems);
    });

    it("рендерит AgGridVue с темой ag-theme-quartz", () => {
        const wrapper = mount(TreeStoreGrid, {
            props: { treeItems: [] },
            global: {
                stubs: { AgGridVue: false },
            },
        });
        const agGrid = wrapper.findComponent(AgGridVue);
        expect(agGrid.exists()).toBe(true);
        expect(agGrid.classes()).toContain("ag-theme-quartz");
    });

    it("передаёт gridOptions и modules в AgGridVue", () => {
        const wrapper = mount(TreeStoreGrid, {
            props: { treeItems: mockTreeItems },
            global: {
                stubs: { AgGridVue: false },
            },
        });
        const agGrid = wrapper.findComponent(AgGridVue);
        expect(agGrid.props("gridOptions")).toBeDefined();
        expect(agGrid.props("modules")).toBeDefined();
        expect(Array.isArray(agGrid.props("modules"))).toBe(true);
    });

    it("gridOptions содержит treeData и rowData при переданных treeItems", () => {
        const wrapper = mount(TreeStoreGrid, {
            props: { treeItems: mockTreeItems },
            global: {
                stubs: { AgGridVue: false },
            },
        });
        const agGrid = wrapper.findComponent(AgGridVue);
        const gridOptions = agGrid.props("gridOptions") as { treeData?: boolean; rowData?: TreeItemBase[] };
        expect(gridOptions).toBeDefined();
        expect(gridOptions.treeData).toBe(true);
        expect(gridOptions.rowData).toEqual(mockTreeItems);
    });
});
