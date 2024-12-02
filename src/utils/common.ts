import { TreeNode } from "element-plus/es/components/tree-v2/src/types";
import { Tree } from "~/models/models";

export default {
  formatArrayToTree<T extends Tree>(
    data: T[],
    tree: T[],
    callback?: (it: T) => T | null
  ) {
    const formatDatas: T[] = [];
    data.forEach((d) => {
      if (callback) {
        d = callback(d) as T;
      }
      if (d) {
        formatDatas.push(d);
      }
    });
    let currentNode = formatDatas.filter(
      (m) => formatDatas.findIndex((f) => f.id == m.parentId) < 0
    );
    if (currentNode.length == 0) {
      formatDatas.forEach((d) => tree.push(d));
      return;
    }
    currentNode.forEach((d) => {
      const item = { ...d };
      tree.push(item);
      let nextLevelNodes = formatDatas.filter((m) => m.parentId == d.id);
      if (nextLevelNodes.length > 0) {
        this.findChildrenNodes<T>(nextLevelNodes, item, formatDatas);
      }
    });
  },

  findChildrenNodes<T extends Tree>(
    currency: T[],
    lastLevelNode: T,
    data: T[]
  ) {
    lastLevelNode.children = [];
    currency.forEach((d) => {
      const item = { ...d };
      lastLevelNode.children!.push(item);
      let nextLevelNodes = data.filter((m) => m.parentId == d.id);
      if (nextLevelNodes.length == 0) {
        d.isLeaf = true;
      } else {
        this.findChildrenNodes(nextLevelNodes, item, data);
      }
    });
  },
  findParent<T extends Tree>(
    id: number | string,
    data: T[],
    parents: T[],
    callback?: (it: T) => T
  ) {
    let node = data.find((d) => d.id == id);
    if (!node) {
      return;
    }
    const existParent = parents.findIndex((d) => d.id == id);
    if (existParent < 0) {
      if (callback) {
        node = callback(node);
      }
      parents.unshift(node);
      if (node.parentId) {
        this.findParent(node.parentId, data, parents, callback);
      }
    }
  },
  findTreeParent<T extends Tree>(
    node: T | undefined,
    callback: (data: T) => void
  ) {
    if (!node) {
      return;
    }
    callback(node);
    this.findTreeParent(node.parent as T | undefined, callback);
  },
  traverseTree<T extends Tree>(
    tree: T[] | undefined,
    callback?: (data: T) => void
  ) {
    if (!tree) {
      return;
    }
    for (const node of tree) {
      if (callback) callback(node);
      this.traverseTree(node.children as T[] | undefined, callback);
    }
  },
};
