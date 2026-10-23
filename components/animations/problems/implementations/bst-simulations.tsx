// @ts-nocheck
"use client";

import React from "react";
import {
  ProblemViewerShell,
  ProblemApproach,
  ProblemStep,
} from "../problem-viewer-shell";
import { PresetOption } from "../input-presets-panel";
import { ArrayVisualizer, VisualArrayElement, VisualPointer } from "../array-visualizer";
import { TreeVisualizer } from "../tree-visualizer";
import { StepRecorder, RecursiveStepRecorder } from "../recorder";

const _treeHelper848569 = {
  Gu: function(e) {
    if (!e || 0 === e.length) return [];
    let t = [], r = [0], l = 0;
    for (; l < e.length && r.length > 0; ) {
      let n = r.shift(), i = e[l++];
      for (; t.length <= n; ) t.push(null);
      t[n] = i, null !== i && (r.push(2 * n + 1), r.push(2 * n + 2));
    }
    return t;
  },
  kU: function(e) {
    return null == e ? null : "Node(" + (e ? e.value : "") + ")";
  },
  E4: function(e, t) {
    function r(r, l) {
      let n = e.get(r);
      n && t.update_visual("node_" + r, {
        type: "binaryTreeNode",
        value: n.value,
        parent: void 0 !== n.parent ? ("node_" + n.parent) : void 0,
        isLeftChild: n.isLeftChild,
        state: l
      });
    }
    return {
      updateNodeState: r,
      setNodeStateExclusive: function(l, n, i) {
        let a = t.getCurrentVisuals();
        e.forEach((e, t) => {
          if (t !== l) {
            let e = a["node_" + t];
            e && e.state === n && r(t, i);
          }
        }), r(l, n);
      },
      resetNodesWithState: function(l, n) {
        let i = t.getCurrentVisuals();
        e.forEach((e, t) => {
          let a = i["node_" + t];
          a && a.state === l && r(t, n);
        });
      }
    };
  }
};
let n = _treeHelper848569;
let l = _treeHelper848569;
let r = _treeHelper848569;
let a = _treeHelper848569;
let o = _treeHelper848569;
let s = _treeHelper848569;
let d = _treeHelper848569;
let Gu = _treeHelper848569.Gu;
let kU = _treeHelper848569.kU;
let E4 = _treeHelper848569.E4;


function ProblemVisualizerWrapper({
  visualState,
  height = 260,
}: {
  visualState: Record<string, any>;
  height?: number;
}) {
  const hasTreeNodes = Object.values(visualState).some(
    (item: any) =>
      item &&
      (item.type === "binaryTreeNode" ||
        item.type === "treeNode" ||
      item.type === "binaryTreeNode" ||
        item.type === "naryTreeNode"),
  );

  if (hasTreeNodes) {
    return <TreeVisualizer visualState={visualState} height={height} />;
  }

  const { elements, pointers } = elementsFromVisualState(visualState);
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ArrayVisualizer elements={elements} pointers={pointers} height={height} />
    </div>
  );
}

function elementsFromVisualState(visualState: Record<string, any>): {
  elements: VisualArrayElement[];
  pointers: VisualPointer[];
} {
  const elements: VisualArrayElement[] = [];
  const pointers: VisualPointer[] = [];

  for (const key in visualState) {
    const item = visualState[key];
    if (!item) continue;
    if (
      item.type === "arrayElement" ||
      item.type === "element" ||
      item.type === "char" ||
      item.type === "stateElement" ||
      item.type === "node" ||
      item.type === "treeNode" ||
      item.type === "cell" ||
      item.type === "stackElement" ||
      item.type === "bar" ||
      item.type === "token" ||
      item.type === "heapNode" ||
      item.type === "interval" ||
      item.type === "card"
    ) {
      elements.push({
        value: item.value ?? item.char ?? item.height ?? item.val ?? (item.start !== undefined ? `[${item.start},${item.end}]` : ""),
        position: item.position ?? (typeof item.col === "number" ? item.col : (typeof item.index === "number" ? item.index : 0)),
        state: item.state || (item.isHighlighted ? "active" : item.isCurrent ? "current" : "idle"),
      });
    } else if (item.type === "pointer") {
      pointers.push({
        position: item.position ?? item.index ?? 0,
        label: item.label || "",
        color: item.color,
      });
    }
  }

  elements.sort((a, b) => a.position - b.position);
  return { elements, pointers };
}

function formatGenericInput(input: any): string {
  if (!input) return "";
  const parts: string[] = [];
  for (const k in input) {
    const val = input[k];
    if (typeof val === "string") {
      parts.push(`${k} = "${val}"`);
    } else if (Array.isArray(val)) {
      if (val.length > 0 && Array.isArray(val[0])) {
        parts.push(`${k} = [${val.map((inner: any) => `[${inner.join(", ")}]`).join(", ")}]`);
      } else {
        parts.push(`${k} = [${val.join(", ")}]`);
      }
    } else {
      parts.push(`${k} = ${val}`);
    }
  }
  return parts.join(", ");
}

// ==========================================
// Trim Binary Search Tree (trim-a-binary-search-tree)
// ==========================================

const TrimABinarySearchTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def trimBST(self, root: Optional[TreeNode], low: int, high: int) -> Optional[TreeNode]:\n        if not root:\n            return None\n\n        # Node too small: discard it and left subtree, trim right\n        if root.val < low:\n            return self.trimBST(root.right, low, high)\n\n        # Node too large: discard it and right subtree, trim left\n        if root.val > high:\n            return self.trimBST(root.left, low, high)\n\n        # Node in range: keep it, trim both children\n        root.left = self.trimBST(root.left, low, high)\n        root.right = self.trimBST(root.right, low, high)\n        return root",
    "lineMap": {
      "init": [
        2
      ],
      "call": [
        3
      ],
      "null_base": [
        3,
        4
      ],
      "below_range": [
        7,
        8
      ],
      "return_below": [
        8
      ],
      "above_range": [
        11,
        12
      ],
      "return_above": [
        12
      ],
      "trim_left": [
        15
      ],
      "set_left": [
        15
      ],
      "trim_right": [
        16
      ],
      "set_right": [
        16
      ],
      "return_node": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "below": [
        7
      ],
      "above": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode trimBST(TreeNode root, int low, int high) {\n        if (root == null) return null;\n\n        // Node too small: discard it and left subtree, trim right\n        if (root.val < low) return trimBST(root.right, low, high);\n\n        // Node too large: discard it and right subtree, trim left\n        if (root.val > high) return trimBST(root.left, low, high);\n\n        // Node in range: keep it, trim both children\n        root.left = trimBST(root.left, low, high);\n        root.right = trimBST(root.right, low, high);\n        return root;\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "call": [
        3
      ],
      "null_base": [
        3
      ],
      "below_range": [
        6
      ],
      "return_below": [
        6
      ],
      "above_range": [
        9
      ],
      "return_above": [
        9
      ],
      "trim_left": [
        12
      ],
      "set_left": [
        12
      ],
      "trim_right": [
        13
      ],
      "set_right": [
        13
      ],
      "return_node": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "below": [
        6
      ],
      "above": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* trimBST(TreeNode* root, int low, int high) {\n        if (root == nullptr) return nullptr;\n\n        // Node too small: discard it and left subtree, trim right\n        if (root->val < low) return trimBST(root->right, low, high);\n\n        // Node too large: discard it and right subtree, trim left\n        if (root->val > high) return trimBST(root->left, low, high);\n\n        // Node in range: keep it, trim both children\n        root->left = trimBST(root->left, low, high);\n        root->right = trimBST(root->right, low, high);\n        return root;\n    }\n};",
    "lineMap": {
      "init": [
        3
      ],
      "call": [
        4
      ],
      "null_base": [
        4
      ],
      "below_range": [
        7
      ],
      "return_below": [
        7
      ],
      "above_range": [
        10
      ],
      "return_above": [
        10
      ],
      "trim_left": [
        13
      ],
      "set_left": [
        13
      ],
      "trim_right": [
        14
      ],
      "set_right": [
        14
      ],
      "return_node": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_null": [
        4
      ],
      "below": [
        7
      ],
      "above": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var trimBST = function (root, low, high) {\n  if (root === null) return null;\n\n  // Node too small: discard it and left subtree, trim right\n  if (root.val < low) return trimBST(root.right, low, high);\n\n  // Node too large: discard it and right subtree, trim left\n  if (root.val > high) return trimBST(root.left, low, high);\n\n  // Node in range: keep it, trim both children\n  root.left = trimBST(root.left, low, high);\n  root.right = trimBST(root.right, low, high);\n  return root;\n};",
    "lineMap": {
      "init": [
        1
      ],
      "call": [
        2
      ],
      "null_base": [
        2
      ],
      "below_range": [
        5
      ],
      "return_below": [
        5
      ],
      "above_range": [
        8
      ],
      "return_above": [
        8
      ],
      "trim_left": [
        11
      ],
      "set_left": [
        11
      ],
      "trim_right": [
        12
      ],
      "set_right": [
        12
      ],
      "return_node": [
        13
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_null": [
        2
      ],
      "below": [
        5
      ],
      "above": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function trimBST(root: TreeNode | null, low: number, high: number): TreeNode | null {\n    if (root === null) return null;\n\n    // Node too small: discard it and left subtree, trim right\n    if (root.val < low) return trimBST(root.right, low, high);\n\n    // Node too large: discard it and right subtree, trim left\n    if (root.val > high) return trimBST(root.left, low, high);\n\n    // Node in range: keep it, trim both children\n    root.left = trimBST(root.left, low, high);\n    root.right = trimBST(root.right, low, high);\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "call": [
        2
      ],
      "null_base": [
        2
      ],
      "below_range": [
        5
      ],
      "return_below": [
        5
      ],
      "above_range": [
        8
      ],
      "return_above": [
        8
      ],
      "trim_left": [
        11
      ],
      "set_left": [
        11
      ],
      "trim_right": [
        12
      ],
      "set_right": [
        12
      ],
      "return_node": [
        13
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_null": [
        2
      ],
      "below": [
        5
      ],
      "above": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func trimBST(root *TreeNode, low int, high int) *TreeNode {\n    if root == nil {\n        return nil\n    }\n\n    // Node too small: discard it and left subtree, trim right\n    if root.Val < low {\n        return trimBST(root.Right, low, high)\n    }\n\n    // Node too large: discard it and right subtree, trim left\n    if root.Val > high {\n        return trimBST(root.Left, low, high)\n    }\n\n    // Node in range: keep it, trim both children\n    root.Left = trimBST(root.Left, low, high)\n    root.Right = trimBST(root.Right, low, high)\n    return root\n}",
    "lineMap": {
      "init": [
        1
      ],
      "call": [
        2
      ],
      "null_base": [
        2,
        3
      ],
      "below_range": [
        7,
        8
      ],
      "return_below": [
        8
      ],
      "above_range": [
        12,
        13
      ],
      "return_above": [
        13
      ],
      "trim_left": [
        17
      ],
      "set_left": [
        17
      ],
      "trim_right": [
        18
      ],
      "set_right": [
        18
      ],
      "return_node": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_null": [
        2
      ],
      "below": [
        7
      ],
      "above": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode TrimBST(TreeNode root, int low, int high) {\n        if (root == null) return null;\n\n        // Node too small: discard it and left subtree, trim right\n        if (root.val < low) return TrimBST(root.right, low, high);\n\n        // Node too large: discard it and right subtree, trim left\n        if (root.val > high) return TrimBST(root.left, low, high);\n\n        // Node in range: keep it, trim both children\n        root.left = TrimBST(root.left, low, high);\n        root.right = TrimBST(root.right, low, high);\n        return root;\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "call": [
        3
      ],
      "null_base": [
        3
      ],
      "below_range": [
        6
      ],
      "return_below": [
        6
      ],
      "above_range": [
        9
      ],
      "return_above": [
        9
      ],
      "trim_left": [
        12
      ],
      "set_left": [
        12
      ],
      "trim_right": [
        13
      ],
      "set_right": [
        13
      ],
      "return_node": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "below": [
        6
      ],
      "above": [
        9
      ]
    }
  }
};

const TrimABinarySearchTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Trim Easy",
    "value": {
      "tree": [
        1,
        0,
        2,
        -1
      ],
      "low": 1,
      "high": 2
    }
  },
  {
    "id": "ex2",
    "label": "Trim [1,3]",
    "value": {
      "tree": [
        3,
        0,
        4,
        null,
        2,
        null,
        null,
        1
      ],
      "low": 1,
      "high": 3
    }
  },
  {
    "id": "ex3",
    "label": "Simple Trim",
    "value": {
      "tree": [
        1,
        null,
        2
      ],
      "low": 1,
      "high": 2
    }
  },
  {
    "id": "ex4",
    "label": "Trim Left",
    "value": {
      "tree": [
        1,
        0,
        2
      ],
      "low": 1,
      "high": 2
    }
  },
  {
    "id": "ex5",
    "label": "Trim Right",
    "value": {
      "tree": [
        3,
        2,
        4,
        1
      ],
      "low": 3,
      "high": 4
    }
  }
];

function generateTrimABinarySearchTreeSteps(e: any): any[] {
  
let t=(0,l.createTrimBSTScene)(e),{recorder:r,low:o,high:i,setState:n,markSubtree:a,syncTree:s,pointAt:d}=t,{pushFrame:h,popFrame:u,clearFrames:c,markSurvivorsKept:g}=t;r.record("init",`Start: trim the BST to [${o}, ${i}]`);let p=e=>{if(!e)return h(null),d(null),r.set_conditionals([{key:"is_null",result:!0}]),r.record("null_base","Null node, return null"),u(),null;let t=e.value;if(h(t),n(e,l.NODE_STATE.current),d(e),r.set_conditionals([{key:"is_null",result:!1}]),r.record("call",`trimBST(${t})`),t<o){n(e,l.NODE_STATE.removed),a(e.left,l.NODE_STATE.removed),r.set_conditionals([{key:"below",result:!0}]),r.record("below_range",`${t} < ${o}, so ${t} and its whole left subtree go; trim the right one`);let i=p(e.right);return d(e),r.record("return_below",`Return ${i?i.value:"null"} in place of ${t}`),u(),i}if(t>i){n(e,l.NODE_STATE.removed),a(e.right,l.NODE_STATE.removed),r.set_conditionals([{key:"below",result:!1},{key:"above",result:!0}]),r.record("above_range",`${t} > ${i}, so ${t} and its whole right subtree go; trim the left one`);let o=p(e.left);return d(e),r.record("return_above",`Return ${o?o.value:"null"} in place of ${t}`),u(),o}n(e,l.NODE_STATE.kept),r.set_conditionals([{key:"below",result:!1},{key:"above",result:!1}]),r.record("trim_left",`${o} <= ${t} <= ${i}, keep it and trim its left subtree`);let c=p(e.left);e.left=c,s(),d(e),r.record("set_left",`${t}.left = ${c?c.value:"null"}`),r.record("trim_right",`Now trim the right subtree of ${t}`);let g=p(e.right);return e.right=g,s(),d(e),r.record("set_right",`${t}.right = ${g?g.value:"null"}`),r.record("return_node",`Return ${t} with both children trimmed`),u(),e};t.setRoot(p(t.getRoot())),s(),c(),d(null),g();let f=t.getRoot();return r.record("complete",f?`Trimming complete. The new root is ${f.value}`:"Trimming complete. Nothing was inside the range, so the tree is empty"),r.getSteps()
}

export function TrimABinarySearchTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TrimABinarySearchTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTrimABinarySearchTreeSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Trim Binary Search Tree"
      slug="trim-a-binary-search-tree"
      approaches={approaches}
      presets={TrimABinarySearchTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Balance a Binary Search Tree (balance-a-binary-search-tree)
// ==========================================

const BalanceABinarySearchTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def balanceBST(root):\n    values = []\n    inorder(root, values)\n    return build(values, 0, len(values) - 1)\n\ndef inorder(node, values):\n    if node is None:\n        return\n    inorder(node.left, values)\n    values.append(node.val)\n    inorder(node.right, values)\n\ndef build(values, left, right):\n    if left > right:\n        return None\n    mid = left + (right - left) // 2\n    node = TreeNode(values[mid])\n    node.left = build(values, left, mid - 1)\n    node.right = build(values, mid + 1, right)\n    return node",
    "lineMap": {
      "init": [
        1
      ],
      "inorder_visit": [
        6
      ],
      "inorder_base": [
        7,
        8
      ],
      "inorder_left": [
        9
      ],
      "inorder_add": [
        10
      ],
      "inorder_right": [
        11
      ],
      "phase1_complete": [
        3
      ],
      "build_start": [
        4
      ],
      "check_range": [
        13
      ],
      "base_case": [
        15
      ],
      "find_mid": [
        16
      ],
      "create_node": [
        17
      ],
      "build_left": [
        18
      ],
      "build_right": [
        19
      ],
      "return_node": [
        20
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "inorder_null": [
        7
      ],
      "base_case": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public TreeNode balanceBST(TreeNode root) {\n    List<Integer> values = new ArrayList<>();\n    inorder(root, values);\n    return build(values, 0, values.size() - 1);\n}\n\nprivate void inorder(TreeNode node, List<Integer> values) {\n    if (node == null) {\n        return;\n    }\n    inorder(node.left, values);\n    values.add(node.val);\n    inorder(node.right, values);\n}\n\nprivate TreeNode build(List<Integer> values, int left, int right) {\n    if (left > right) {\n        return null;\n    }\n    int mid = left + (right - left) / 2;\n    TreeNode node = new TreeNode(values.get(mid));\n    node.left = build(values, left, mid - 1);\n    node.right = build(values, mid + 1, right);\n    return node;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "inorder_visit": [
        7
      ],
      "inorder_base": [
        8,
        9
      ],
      "inorder_left": [
        11
      ],
      "inorder_add": [
        12
      ],
      "inorder_right": [
        13
      ],
      "phase1_complete": [
        3
      ],
      "build_start": [
        4
      ],
      "check_range": [
        16
      ],
      "base_case": [
        18
      ],
      "find_mid": [
        20
      ],
      "create_node": [
        21
      ],
      "build_left": [
        22
      ],
      "build_right": [
        23
      ],
      "return_node": [
        24
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "inorder_null": [
        8
      ],
      "base_case": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "TreeNode* balanceBST(TreeNode* root) {\n    vector<int> values;\n    inorder(root, values);\n    return build(values, 0, values.size() - 1);\n}\n\nvoid inorder(TreeNode* node, vector<int>& values) {\n    if (node == nullptr) {\n        return;\n    }\n    inorder(node->left, values);\n    values.push_back(node->val);\n    inorder(node->right, values);\n}\n\nTreeNode* build(vector<int>& values, int left, int right) {\n    if (left > right) {\n        return nullptr;\n    }\n    int mid = left + (right - left) / 2;\n    TreeNode* node = new TreeNode(values[mid]);\n    node->left = build(values, left, mid - 1);\n    node->right = build(values, mid + 1, right);\n    return node;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "inorder_visit": [
        7
      ],
      "inorder_base": [
        8,
        9
      ],
      "inorder_left": [
        11
      ],
      "inorder_add": [
        12
      ],
      "inorder_right": [
        13
      ],
      "phase1_complete": [
        3
      ],
      "build_start": [
        4
      ],
      "check_range": [
        16
      ],
      "base_case": [
        18
      ],
      "find_mid": [
        20
      ],
      "create_node": [
        21
      ],
      "build_left": [
        22
      ],
      "build_right": [
        23
      ],
      "return_node": [
        24
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "inorder_null": [
        8
      ],
      "base_case": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public TreeNode BalanceBST(TreeNode root) {\n    List<int> values = new List<int>();\n    Inorder(root, values);\n    return Build(values, 0, values.Count - 1);\n}\n\nprivate void Inorder(TreeNode node, List<int> values) {\n    if (node == null) {\n        return;\n    }\n    Inorder(node.left, values);\n    values.Add(node.val);\n    Inorder(node.right, values);\n}\n\nprivate TreeNode Build(List<int> values, int left, int right) {\n    if (left > right) {\n        return null;\n    }\n    int mid = left + (right - left) / 2;\n    TreeNode node = new TreeNode(values[mid]);\n    node.left = Build(values, left, mid - 1);\n    node.right = Build(values, mid + 1, right);\n    return node;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "inorder_visit": [
        7
      ],
      "inorder_base": [
        8,
        9
      ],
      "inorder_left": [
        11
      ],
      "inorder_add": [
        12
      ],
      "inorder_right": [
        13
      ],
      "phase1_complete": [
        3
      ],
      "build_start": [
        4
      ],
      "check_range": [
        16
      ],
      "base_case": [
        18
      ],
      "find_mid": [
        20
      ],
      "create_node": [
        21
      ],
      "build_left": [
        22
      ],
      "build_right": [
        23
      ],
      "return_node": [
        24
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "inorder_null": [
        8
      ],
      "base_case": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func balanceBST(root *TreeNode) *TreeNode {\n    values := []int{}\n    var inorder func(node *TreeNode)\n    inorder = func(node *TreeNode) {\n        if node == nil {\n            return\n        }\n        inorder(node.Left)\n        values = append(values, node.Val)\n        inorder(node.Right)\n    }\n    inorder(root)\n    return build(values, 0, len(values)-1)\n}\n\nfunc build(values []int, left, right int) *TreeNode {\n    if left > right {\n        return nil\n    }\n    mid := left + (right-left)/2\n    node := &TreeNode{Val: values[mid]}\n    node.Left = build(values, left, mid-1)\n    node.Right = build(values, mid+1, right)\n    return node\n}",
    "lineMap": {
      "init": [
        1
      ],
      "inorder_visit": [
        4
      ],
      "inorder_base": [
        5,
        6
      ],
      "inorder_left": [
        8
      ],
      "inorder_add": [
        9
      ],
      "inorder_right": [
        10
      ],
      "phase1_complete": [
        12
      ],
      "build_start": [
        13
      ],
      "check_range": [
        16
      ],
      "base_case": [
        18
      ],
      "find_mid": [
        20
      ],
      "create_node": [
        21
      ],
      "build_left": [
        22
      ],
      "build_right": [
        23
      ],
      "return_node": [
        24
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "inorder_null": [
        5
      ],
      "base_case": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function balanceBST(root) {\n    const values = [];\n    function inorder(node) {\n        if (node === null) return;\n        inorder(node.left);\n        values.push(node.val);\n        inorder(node.right);\n    }\n    inorder(root);\n    return build(values, 0, values.length - 1);\n}\n\nfunction build(values, left, right) {\n    if (left > right) {\n        return null;\n    }\n    const mid = left + Math.floor((right - left) / 2);\n    const node = new TreeNode(values[mid]);\n    node.left = build(values, left, mid - 1);\n    node.right = build(values, mid + 1, right);\n    return node;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "inorder_visit": [
        3
      ],
      "inorder_base": [
        4
      ],
      "inorder_left": [
        5
      ],
      "inorder_add": [
        6
      ],
      "inorder_right": [
        7
      ],
      "phase1_complete": [
        9
      ],
      "build_start": [
        10
      ],
      "check_range": [
        13
      ],
      "base_case": [
        15
      ],
      "find_mid": [
        17
      ],
      "create_node": [
        18
      ],
      "build_left": [
        19
      ],
      "build_right": [
        20
      ],
      "return_node": [
        21
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "inorder_null": [
        4
      ],
      "base_case": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function balanceBST(root: TreeNode | null): TreeNode | null {\n    const values: number[] = [];\n    function inorder(node: TreeNode | null): void {\n        if (node === null) return;\n        inorder(node.left);\n        values.push(node.val);\n        inorder(node.right);\n    }\n    inorder(root);\n    return build(values, 0, values.length - 1);\n}\n\nfunction build(values: number[], left: number, right: number): TreeNode | null {\n    if (left > right) {\n        return null;\n    }\n    const mid = left + Math.floor((right - left) / 2);\n    const node = new TreeNode(values[mid]);\n    node.left = build(values, left, mid - 1);\n    node.right = build(values, mid + 1, right);\n    return node;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "inorder_visit": [
        3
      ],
      "inorder_base": [
        4
      ],
      "inorder_left": [
        5
      ],
      "inorder_add": [
        6
      ],
      "inorder_right": [
        7
      ],
      "phase1_complete": [
        9
      ],
      "build_start": [
        10
      ],
      "check_range": [
        13
      ],
      "base_case": [
        15
      ],
      "find_mid": [
        17
      ],
      "create_node": [
        18
      ],
      "build_left": [
        19
      ],
      "build_right": [
        20
      ],
      "return_node": [
        21
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "inorder_null": [
        4
      ],
      "base_case": [
        14
      ]
    }
  }
};

const BalanceABinarySearchTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Right-Skewed",
    "value": {
      "tree": [
        1,
        null,
        2,
        null,
        3,
        null,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Left-Skewed",
    "value": {
      "tree": [
        4,
        3,
        null,
        2,
        null,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Slightly Unbalanced",
    "value": {
      "tree": [
        3,
        1,
        4,
        null,
        2
      ]
    }
  }
];

function generateBalanceABinarySearchTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)null!==t[e]&&r.set(e,{value:t[e],index:e});let n=new Map,i=new Map,o=new Map,d=new Map,s=[];r.forEach((e,t)=>{n.set(t,e.value),s.push(t);let a=2*t+1,l=2*t+2;i.set(t,r.has(a)?a:null),o.set(t,r.has(l)?l:null),d.set(t,void 0)}),s.sort((e,t)=>e-t);let u=s.length>0?0:null;i.set(-1,null),o.set(-1,u);let c=e=>({type:"binaryTreeNode",value:n.get(e),state:d.get(e),leftId:i.get(e)??null,rightId:o.get(e)??null}),h={};s.forEach(e=>{h[`dsw_node_${e}`]=c(e)});let p=new StepRecorder({phase:1,n:0,m:null,count:null,pass:0,rootId:u,pivotVal:null,sinkVal:null,origHeight:null,newHeight:null},{...h}),g=()=>s.forEach(e=>p.update_visual(`dsw_node_${e}`,c(e))),f=()=>p.update_variable("rootId",o.get(-1)??null),b=()=>s.forEach(e=>d.set(e,void 0)),_=e=>null==e?-1:1+Math.max(_(i.get(e)),_(o.get(e))),v=s.length>0?_(u)+1:0;if(p.update_variable("origHeight",v),p.record("start","Day-Stout-Warren balances the tree in place with rotations off a pseudo-root"),0===s.length)return p.record("empty_tree","Empty tree is already balanced"),p.getSteps();let m=-1,x=o.get(-1)??null,y=0;for(;null!==x;){let e=null!==i.get(x)&&void 0!==i.get(x);if(p.add_conditional("has_left",e),e){let e=i.get(x);i.set(x,o.get(e)??null),o.set(e,x),o.set(m,e),d.set(e,"pivot"),d.set(x,"rotate");let t=x;x=e,f(),p.update_variable("pivotVal",n.get(e)),p.update_variable("sinkVal",n.get(t)),g(),p.record("vine_rotate",`Right-rotate: ${n.get(e)} rises, ${n.get(t)} sinks to its right`),b()}else{y+=1,m=x;let e=o.get(x)??null;d.set(x,"pivot"),p.update_variable("n",y),p.update_variable("pivotVal",n.get(x)),f(),g(),p.record("vine_advance",`${n.get(x)} has no left child, move down the right spine (${y} in the backbone)`),b(),x=e}}f(),p.update_variable("n",y),g(),p.record("vine_done",`Backbone ready: ${y} nodes in a right-leaning vine, sorted ascending`),p.update_variable("phase",2);let N=Math.pow(2,Math.floor(Math.log2(y+1)+1e-9))-1;p.update_variable("m",N);let T=0,k=(e,t)=>{if(e<=0)return;T+=1,p.update_variable("pass",T),p.update_variable("count",e),g(),p.record("balance_pass",`${t}: ${e} left rotation${e>1?"s":""} spaced down the vine`);let r=-1;for(let t=0;t<e;t++){let e=o.get(r),t=o.get(e);o.set(r,t),o.set(e,i.get(t)??null),i.set(t,e),d.set(e,"rotate"),d.set(t,"pivot"),r=t,f(),p.update_variable("pivotVal",n.get(t)),p.update_variable("sinkVal",n.get(e)),g(),p.record("balance_rotate",`Left-rotate: ${n.get(t)} rises, ${n.get(e)} becomes its left child`),b()}};for(k(y-N,"Seat the deepest level");N>1;)N=Math.floor(N/2),p.update_variable("m",N),k(N,`Halve to m = ${N}`);b(),s.forEach(e=>d.set(e,"balanced"));let $=_(o.get(-1)??null)+1;return p.update_variable("newHeight",$),f(),g(),p.record("complete",`Balanced in place: height ${v} to ${$}`),p.getSteps()
}

export function BalanceABinarySearchTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BalanceABinarySearchTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBalanceABinarySearchTreeSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Balance a Binary Search Tree"
      slug="balance-a-binary-search-tree"
      approaches={approaches}
      presets={BalanceABinarySearchTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Search Tree Iterator (binary-search-tree-iterator)
// ==========================================

const BinarySearchTreeIteratorTemplates = {
  "python": {
    "language": "python",
    "code": "class BSTIterator:\n    def __init__(self, root):\n        self.stack = []\n        self._push_left_branch(root)\n\n    def next(self):\n        node = self.stack.pop()\n        if node.right:\n            self._push_left_branch(node.right)\n        return node.val\n\n    def hasNext(self):\n        return len(self.stack) > 0\n\n    def _push_left_branch(self, node):\n        while node:\n            self.stack.append(node)\n            node = node.left",
    "lineMap": {
      "start": [
        1
      ],
      "init_stack": [
        2,
        3,
        4
      ],
      "push_left": [
        16,
        17,
        18
      ],
      "spine_done": [
        16
      ],
      "has_next": [
        12,
        13
      ],
      "call_next": [
        8
      ],
      "pop_node": [
        7
      ],
      "visit_node": [
        10
      ],
      "push_right_left": [
        16,
        17,
        18
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "while_current": [
        16
      ],
      "has_right": [
        8
      ],
      "has_next": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class BSTIterator {\n    private Deque<TreeNode> stack;\n\n    public BSTIterator(TreeNode root) {\n        stack = new ArrayDeque<>();\n        pushLeftBranch(root);\n    }\n\n    public int next() {\n        TreeNode node = stack.pop();\n        if (node.right != null) {\n            pushLeftBranch(node.right);\n        }\n        return node.val;\n    }\n\n    public boolean hasNext() {\n        return !stack.isEmpty();\n    }\n\n    private void pushLeftBranch(TreeNode node) {\n        while (node != null) {\n            stack.push(node);\n            node = node.left;\n        }\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_stack": [
        4,
        5,
        6
      ],
      "push_left": [
        22,
        23,
        24
      ],
      "spine_done": [
        22
      ],
      "has_next": [
        17,
        18
      ],
      "call_next": [
        11
      ],
      "pop_node": [
        10
      ],
      "visit_node": [
        14
      ],
      "push_right_left": [
        22,
        23,
        24
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_current": [
        22
      ],
      "has_right": [
        11
      ],
      "has_next": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class BSTIterator {\nprivate:\n    stack<TreeNode*> stk;\n\n    void pushLeftBranch(TreeNode* node) {\n        while (node != nullptr) {\n            stk.push(node);\n            node = node->left;\n        }\n    }\n\npublic:\n    BSTIterator(TreeNode* root) {\n        pushLeftBranch(root);\n    }\n\n    int next() {\n        TreeNode* node = stk.top();\n        stk.pop();\n        if (node->right != nullptr) {\n            pushLeftBranch(node->right);\n        }\n        return node->val;\n    }\n\n    bool hasNext() {\n        return !stk.empty();\n    }\n};",
    "lineMap": {
      "start": [
        1
      ],
      "init_stack": [
        13,
        14
      ],
      "push_left": [
        6,
        7,
        8
      ],
      "spine_done": [
        6
      ],
      "has_next": [
        26,
        27
      ],
      "call_next": [
        20
      ],
      "pop_node": [
        18,
        19
      ],
      "visit_node": [
        23
      ],
      "push_right_left": [
        6,
        7,
        8
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "while_current": [
        6
      ],
      "has_right": [
        20
      ],
      "has_next": [
        27
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class BSTIterator {\n    private Stack<TreeNode> stack;\n\n    public BSTIterator(TreeNode root) {\n        stack = new Stack<TreeNode>();\n        PushLeftBranch(root);\n    }\n\n    public int Next() {\n        TreeNode node = stack.Pop();\n        if (node.right != null) {\n            PushLeftBranch(node.right);\n        }\n        return node.val;\n    }\n\n    public bool HasNext() {\n        return stack.Count > 0;\n    }\n\n    private void PushLeftBranch(TreeNode node) {\n        while (node != null) {\n            stack.Push(node);\n            node = node.left;\n        }\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_stack": [
        4,
        5,
        6
      ],
      "push_left": [
        22,
        23,
        24
      ],
      "spine_done": [
        22
      ],
      "has_next": [
        17,
        18
      ],
      "call_next": [
        11
      ],
      "pop_node": [
        10
      ],
      "visit_node": [
        14
      ],
      "push_right_left": [
        22,
        23,
        24
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_current": [
        22
      ],
      "has_right": [
        11
      ],
      "has_next": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type BSTIterator struct {\n    stack []*TreeNode\n}\n\nfunc Constructor(root *TreeNode) BSTIterator {\n    it := BSTIterator{stack: []*TreeNode{}}\n    it.pushLeftBranch(root)\n    return it\n}\n\nfunc (it *BSTIterator) Next() int {\n    node := it.stack[len(it.stack)-1]\n    it.stack = it.stack[:len(it.stack)-1]\n    if node.Right != nil {\n        it.pushLeftBranch(node.Right)\n    }\n    return node.Val\n}\n\nfunc (it *BSTIterator) HasNext() bool {\n    return len(it.stack) > 0\n}\n\nfunc (it *BSTIterator) pushLeftBranch(node *TreeNode) {\n    for node != nil {\n        it.stack = append(it.stack, node)\n        node = node.Left\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_stack": [
        5,
        6,
        7
      ],
      "push_left": [
        25,
        26,
        27
      ],
      "spine_done": [
        25
      ],
      "has_next": [
        20,
        21
      ],
      "call_next": [
        14
      ],
      "pop_node": [
        12,
        13
      ],
      "visit_node": [
        17
      ],
      "push_right_left": [
        25,
        26,
        27
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_current": [
        25
      ],
      "has_right": [
        14
      ],
      "has_next": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class BSTIterator {\n    constructor(root) {\n        this.stack = [];\n        this.pushLeftBranch(root);\n    }\n\n    next() {\n        const node = this.stack.pop();\n        if (node.right) {\n            this.pushLeftBranch(node.right);\n        }\n        return node.val;\n    }\n\n    hasNext() {\n        return this.stack.length > 0;\n    }\n\n    pushLeftBranch(node) {\n        while (node) {\n            this.stack.push(node);\n            node = node.left;\n        }\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_stack": [
        2,
        3,
        4
      ],
      "push_left": [
        20,
        21,
        22
      ],
      "spine_done": [
        20
      ],
      "has_next": [
        15,
        16
      ],
      "call_next": [
        9
      ],
      "pop_node": [
        8
      ],
      "visit_node": [
        12
      ],
      "push_right_left": [
        20,
        21,
        22
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "while_current": [
        20
      ],
      "has_right": [
        9
      ],
      "has_next": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class BSTIterator {\n    private stack: TreeNode[];\n\n    constructor(root: TreeNode | null) {\n        this.stack = [];\n        this.pushLeftBranch(root);\n    }\n\n    next(): number {\n        const node = this.stack.pop()!;\n        if (node.right) {\n            this.pushLeftBranch(node.right);\n        }\n        return node.val;\n    }\n\n    hasNext(): boolean {\n        return this.stack.length > 0;\n    }\n\n    private pushLeftBranch(node: TreeNode | null): void {\n        while (node) {\n            this.stack.push(node);\n            node = node.left;\n        }\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_stack": [
        4,
        5,
        6
      ],
      "push_left": [
        22,
        23,
        24
      ],
      "spine_done": [
        22
      ],
      "has_next": [
        17,
        18
      ],
      "call_next": [
        11
      ],
      "pop_node": [
        10
      ],
      "visit_node": [
        14
      ],
      "push_right_left": [
        22,
        23,
        24
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_current": [
        22
      ],
      "has_right": [
        11
      ],
      "has_next": [
        18
      ]
    }
  }
};

const BinarySearchTreeIteratorPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "tree": [
        7,
        3,
        15,
        null,
        null,
        9,
        20
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Complete BST",
    "value": {
      "tree": [
        5,
        3,
        8,
        1,
        4,
        7,
        10
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Sparse BST",
    "value": {
      "tree": [
        10,
        5,
        15,
        2,
        7,
        null,
        20
      ]
    }
  }
];

function generateBinarySearchTreeIteratorSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let i=(e,t,a)=>{let n=r.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t,label:a}},l={};r.forEach((e,t)=>{l[`node_${t}`]=i(t)});let o=new StepRecorder({currentIdx:-1,currentVal:void 0,values:[],valueIdxs:[],index:-1,justReturnedPos:-1,output:[],phase:"flatten"},{...l});if(o.record("start","Start: flatten the whole BST into a sorted array up front"),0===r.size)return o.record("complete","Empty tree: values = [], hasNext() is false from the start"),o.getSteps();let s=[],d=[];o.record("init_flatten","new BSTIterator(root): inorder traversal fills the array"),!function e(t){if(!r.has(t))return;e(2*t+1);let a=r.get(t);s.push(a.value),d.push(t),o.update_visual(`node_${t}`,i(t,"visited",String(s.length))),o.update_variable("currentIdx",t),o.update_variable("currentVal",a.value),o.update_variable("values",[...s]),o.update_variable("valueIdxs",[...d]),o.record("collect",`Append ${a.value}: values = [${s.join(", ")}]`),e(2*t+2)}(0);let u=[];o.update_variable("currentIdx",-1),o.update_variable("phase","iterate"),o.update_variable("index",0),o.record("flatten_done",`Constructor done: values = [${s.join(", ")}], index = 0`);let h=0;for(;h<s.length;){o.add_conditional("has_next",!0),o.record("has_next",`hasNext() → index ${h} < ${s.length}: true`);let e=s[h],t=d[h];u.push(e),o.update_visual(`node_${t}`,i(t,"returned",String(h+1))),o.update_variable("currentIdx",t),o.update_variable("currentVal",e),o.update_variable("justReturnedPos",h),o.update_variable("output",[...u]),h++,o.update_variable("index",h),o.record("next_return",`next() → values[${h-1}] = ${e}, index becomes ${h}`)}return o.add_conditional("has_next",!1),o.update_variable("currentIdx",-1),o.update_variable("justReturnedPos",-1),o.record("has_next",`hasNext() → index ${h} < ${s.length}: false`),o.record("complete",`Iterator exhausted: values came out in sorted order [${u.join(", ")}]`),o.getSteps()
}

export function BinarySearchTreeIteratorProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinarySearchTreeIteratorTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinarySearchTreeIteratorSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Binary Search Tree Iterator"
      slug="binary-search-tree-iterator"
      approaches={approaches}
      presets={BinarySearchTreeIteratorPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Closest Binary Search Tree Value (closest-binary-search-tree-value)
// ==========================================

const ClosestBinarySearchTreeValueTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def closestValue(self, root: Optional[TreeNode], target: float) -> int:\n        closest = root.val\n        node = root\n\n        while node:\n            diff = abs(node.val - target)\n            closest_diff = abs(closest - target)\n\n            # Update if current node is closer, or same distance but smaller\n            if diff < closest_diff or (diff == closest_diff and node.val < closest):\n                closest = node.val\n\n            # Navigate toward the target using BST property\n            if target < node.val:\n                node = node.left\n            else:\n                node = node.right\n\n        return closest",
    "lineMap": {
      "init": [
        2
      ],
      "init_closest": [
        3,
        4
      ],
      "visit_node": [
        6
      ],
      "compare": [
        7,
        8
      ],
      "check_closer": [
        11
      ],
      "update_closest": [
        11,
        12
      ],
      "go_left": [
        15,
        16
      ],
      "go_right": [
        17,
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_node": [
        6
      ],
      "is_closer": [
        11
      ],
      "go_direction": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int closestValue(TreeNode root, double target) {\n        int closest = root.val;\n        TreeNode node = root;\n\n        while (node != null) {\n            double diff = Math.abs(node.val - target);\n            double closestDiff = Math.abs(closest - target);\n\n            // Update if current node is closer, or same distance but smaller\n            if (diff < closestDiff || (diff == closestDiff && node.val < closest)) {\n                closest = node.val;\n            }\n\n            // Navigate toward the target using BST property\n            if (target < node.val) {\n                node = node.left;\n            } else {\n                node = node.right;\n            }\n        }\n        return closest;\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "init_closest": [
        3,
        4
      ],
      "visit_node": [
        6
      ],
      "compare": [
        7,
        8
      ],
      "check_closer": [
        11
      ],
      "update_closest": [
        11,
        12
      ],
      "go_left": [
        16,
        17
      ],
      "go_right": [
        18,
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_node": [
        6
      ],
      "is_closer": [
        11
      ],
      "go_direction": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int closestValue(TreeNode* root, double target) {\n        int closest = root->val;\n        TreeNode* node = root;\n\n        while (node != nullptr) {\n            double diff = abs(node->val - target);\n            double closestDiff = abs(closest - target);\n\n            // Update if current node is closer, or same distance but smaller\n            if (diff < closestDiff || (diff == closestDiff && node->val < closest)) {\n                closest = node->val;\n            }\n\n            // Navigate toward the target using BST property\n            if (target < node->val) {\n                node = node->left;\n            } else {\n                node = node->right;\n            }\n        }\n        return closest;\n    }\n};",
    "lineMap": {
      "init": [
        3
      ],
      "init_closest": [
        4,
        5
      ],
      "visit_node": [
        7
      ],
      "compare": [
        8,
        9
      ],
      "check_closer": [
        12
      ],
      "update_closest": [
        12,
        13
      ],
      "go_left": [
        17,
        18
      ],
      "go_right": [
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "while_node": [
        7
      ],
      "is_closer": [
        12
      ],
      "go_direction": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var closestValue = function(root, target) {\n    var closest = root.val;\n    var node = root;\n\n    while (node !== null) {\n        var diff = Math.abs(node.val - target);\n        var closestDiff = Math.abs(closest - target);\n\n        // Update if current node is closer, or same distance but smaller\n        if (diff < closestDiff || (diff === closestDiff && node.val < closest)) {\n            closest = node.val;\n        }\n\n        // Navigate toward the target using BST property\n        if (target < node.val) {\n            node = node.left;\n        } else {\n            node = node.right;\n        }\n    }\n    return closest;\n};",
    "lineMap": {
      "init": [
        1
      ],
      "init_closest": [
        2,
        3
      ],
      "visit_node": [
        5
      ],
      "compare": [
        6,
        7
      ],
      "check_closer": [
        10
      ],
      "update_closest": [
        10,
        11
      ],
      "go_left": [
        15,
        16
      ],
      "go_right": [
        17,
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_node": [
        5
      ],
      "is_closer": [
        10
      ],
      "go_direction": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function closestValue(root: TreeNode | null, target: number): number {\n    let closest = root!.val;\n    let node: TreeNode | null = root;\n\n    while (node !== null) {\n        const diff = Math.abs(node.val - target);\n        const closestDiff = Math.abs(closest - target);\n\n        // Update if current node is closer, or same distance but smaller\n        if (diff < closestDiff || (diff === closestDiff && node.val < closest)) {\n            closest = node.val;\n        }\n\n        // Navigate toward the target using BST property\n        if (target < node.val) {\n            node = node.left;\n        } else {\n            node = node.right;\n        }\n    }\n    return closest;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "init_closest": [
        2,
        3
      ],
      "visit_node": [
        5
      ],
      "compare": [
        6,
        7
      ],
      "check_closer": [
        10
      ],
      "update_closest": [
        10,
        11
      ],
      "go_left": [
        15,
        16
      ],
      "go_right": [
        17,
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_node": [
        5
      ],
      "is_closer": [
        10
      ],
      "go_direction": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func closestValue(root *TreeNode, target float64) int {\n    closest := root.Val\n    node := root\n\n    for node != nil {\n        diff := math.Abs(float64(node.Val) - target)\n        closestDiff := math.Abs(float64(closest) - target)\n\n        // Update if current node is closer, or same distance but smaller\n        if diff < closestDiff || (diff == closestDiff && node.Val < closest) {\n            closest = node.Val\n        }\n\n        // Navigate toward the target using BST property\n        if target < float64(node.Val) {\n            node = node.Left\n        } else {\n            node = node.Right\n        }\n    }\n    return closest\n}",
    "lineMap": {
      "init": [
        1
      ],
      "init_closest": [
        2,
        3
      ],
      "visit_node": [
        5
      ],
      "compare": [
        6,
        7
      ],
      "check_closer": [
        10
      ],
      "update_closest": [
        10,
        11
      ],
      "go_left": [
        15,
        16
      ],
      "go_right": [
        17,
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_node": [
        5
      ],
      "is_closer": [
        10
      ],
      "go_direction": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int ClosestValue(TreeNode root, double target) {\n        int closest = root.val;\n        TreeNode node = root;\n\n        while (node != null) {\n            double diff = Math.Abs(node.val - target);\n            double closestDiff = Math.Abs(closest - target);\n\n            // Update if current node is closer, or same distance but smaller\n            if (diff < closestDiff || (diff == closestDiff && node.val < closest)) {\n                closest = node.val;\n            }\n\n            // Navigate toward the target using BST property\n            if (target < node.val) {\n                node = node.left;\n            } else {\n                node = node.right;\n            }\n        }\n        return closest;\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "init_closest": [
        3,
        4
      ],
      "visit_node": [
        6
      ],
      "compare": [
        7,
        8
      ],
      "check_closer": [
        11
      ],
      "update_closest": [
        11,
        12
      ],
      "go_left": [
        16,
        17
      ],
      "go_right": [
        18,
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_node": [
        6
      ],
      "is_closer": [
        11
      ],
      "go_direction": [
        16
      ]
    }
  }
};

const ClosestBinarySearchTreeValuePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "tree": [
        4,
        2,
        5,
        1,
        3
      ],
      "target": 3.7
    }
  },
  {
    "id": "ex2",
    "label": "Between Nodes",
    "value": {
      "tree": [
        8,
        4,
        12,
        2,
        6,
        10,
        14
      ],
      "target": 5
    }
  },
  {
    "id": "ex3",
    "label": "Single Path",
    "value": {
      "tree": [
        1,
        null,
        3,
        null,
        null,
        null,
        5
      ],
      "target": 4.2
    }
  }
];

function generateClosestBinarySearchTreeValueSteps(e: any): any[] {
  
let t=(0,o.createClosestBSTValueScene)(e),{recorder:l,nodeMap:s,target:r,childOf:a,updateNodeState:n,markSubtree:i}=t,{pointAt:d,setDiffs:c,isCloser:u}=t;if(l.record("init",`BST built. Find the value closest to target = ${r}`),!s.has(0))return l.record("complete","Tree is empty, there is no closest value"),l.getSteps();let f=s.get(0).value,h=0,g=0,p=e=>n(e,e===h?o.NODE_STATE.closest:o.NODE_STATE.current);for(l.update_variable("closest",f),n(0,o.NODE_STATE.closest),d(0),l.record("init_closest",`closest = ${f} (root value), node = root`);null!==g;){let e=s.get(g).value;p(g),d(g),l.set_conditionals([{key:"while_node",result:!0}]),l.record("visit_node",`node is ${e}`);let t=Math.abs(e-r),v=Math.abs(f-r);c(t,v),l.record("compare",`|${e} - ${r}| = ${t.toFixed(2)}, |${f} - ${r}| = ${v.toFixed(2)}`);let m=u(e,f);l.set_conditionals([{key:"is_closer",result:m}]),m?(n(h,o.NODE_STATE.passed),f=e,h=g,l.update_variable("closest",f),n(g,o.NODE_STATE.closest),l.record("update_closest",`${e} is nearer to ${r}, closest = ${e}`)):l.record("check_closer",`${e} is no nearer, closest stays ${f}`);let _=r<e,b=a(g,_?"left":"right");i(a(g,_?"right":"left"),o.NODE_STATE.passed),g!==h&&n(g,o.NODE_STATE.passed),d(b),l.set_conditionals([{key:"go_direction",result:_}]),l.record(_?"go_left":"go_right",_?`${r} < ${e}, discard the right subtree and move left`:`${r} >= ${e}, discard the left subtree and move right`),g=b}return c(),d(null),l.set_conditionals([{key:"while_node",result:!1}]),l.record("complete",`node is null. Closest value to ${r} is ${f}`),l.getSteps()
}

export function ClosestBinarySearchTreeValueProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ClosestBinarySearchTreeValueTemplates,
      generateSteps: (e: any) => {
        const recorded = generateClosestBinarySearchTreeValueSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Closest Binary Search Tree Value"
      slug="closest-binary-search-tree-value"
      approaches={approaches}
      presets={ClosestBinarySearchTreeValuePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Construct BST from Preorder Traversal (construct-binary-search-tree-from-preorder-traversal)
// ==========================================

const ConstructBinarySearchTreeFromPreorderTraversalTemplates = {
  "python": {
    "language": "python",
    "recursiveCode": "class Solution:\n    def bstFromPreorder(self, preorder: list[int]) -> TreeNode:\n        self.index = 0\n        return self.helper(preorder, float('inf'))\n\n    def helper(self, preorder, bound):\n        # If we've used all elements or current value exceeds the bound, stop\n        if self.index >= len(preorder) or preorder[self.index] > bound:\n            return None\n\n        root = TreeNode(preorder[self.index])\n        self.index += 1\n\n        # Left child must be less than current node's value\n        root.left = self.helper(preorder, root.val)\n        # Right child must be less than the inherited upper bound\n        root.right = self.helper(preorder, bound)\n\n        return root",
    "recursiveLineMap": {
      "-": [
        2
      ],
      "base_case": [
        8,
        9
      ],
      "create_node": [
        11
      ],
      "increment_index": [
        12
      ],
      "recurse_left": [
        15
      ],
      "return_left": [
        15
      ],
      "recurse_right": [
        17
      ],
      "return_right": [
        17
      ],
      "return_node": [
        19
      ],
      "complete": [
        4
      ]
    },
    "recursiveConditionalMap": {
      "base_case": [
        8
      ]
    },
    "code": "",
    "lineMap": {}
  },
  "java": {
    "language": "java",
    "recursiveCode": "class Solution {\n    private int index = 0;\n\n    public TreeNode bstFromPreorder(int[] preorder) {\n        index = 0;\n        return helper(preorder, Integer.MAX_VALUE);\n    }\n\n    private TreeNode helper(int[] preorder, int bound) {\n        // If we've used all elements or current value exceeds the bound, stop\n        if (index >= preorder.length || preorder[index] > bound) {\n            return null;\n        }\n\n        TreeNode root = new TreeNode(preorder[index]);\n        index++;\n\n        // Left child must be less than current node's value\n        root.left = helper(preorder, root.val);\n        // Right child must be less than the inherited upper bound\n        root.right = helper(preorder, bound);\n\n        return root;\n    }\n}",
    "recursiveLineMap": {
      "-": [
        4
      ],
      "base_case": [
        11,
        12
      ],
      "create_node": [
        15
      ],
      "increment_index": [
        16
      ],
      "recurse_left": [
        19
      ],
      "return_left": [
        19
      ],
      "recurse_right": [
        21
      ],
      "return_right": [
        21
      ],
      "return_node": [
        23
      ],
      "complete": [
        6
      ]
    },
    "recursiveConditionalMap": {
      "base_case": [
        11
      ]
    },
    "code": "",
    "lineMap": {}
  },
  "cpp": {
    "language": "cpp",
    "recursiveCode": "class Solution {\n    int index = 0;\n\npublic:\n    TreeNode* bstFromPreorder(vector<int>& preorder) {\n        index = 0;\n        return helper(preorder, INT_MAX);\n    }\n\n    TreeNode* helper(vector<int>& preorder, int bound) {\n        // If we've used all elements or current value exceeds the bound, stop\n        if (index >= preorder.size() || preorder[index] > bound) {\n            return nullptr;\n        }\n\n        TreeNode* root = new TreeNode(preorder[index]);\n        index++;\n\n        // Left child must be less than current node's value\n        root->left = helper(preorder, root->val);\n        // Right child must be less than the inherited upper bound\n        root->right = helper(preorder, bound);\n\n        return root;\n    }\n};",
    "recursiveLineMap": {
      "-": [
        5
      ],
      "base_case": [
        12,
        13
      ],
      "create_node": [
        16
      ],
      "increment_index": [
        17
      ],
      "recurse_left": [
        20
      ],
      "return_left": [
        20
      ],
      "recurse_right": [
        22
      ],
      "return_right": [
        22
      ],
      "return_node": [
        24
      ],
      "complete": [
        7
      ]
    },
    "recursiveConditionalMap": {
      "base_case": [
        12
      ]
    },
    "code": "",
    "lineMap": {}
  },
  "csharp": {
    "language": "csharp",
    "recursiveCode": "public class Solution {\n    private int index = 0;\n\n    public TreeNode BstFromPreorder(int[] preorder) {\n        index = 0;\n        return Helper(preorder, int.MaxValue);\n    }\n\n    private TreeNode Helper(int[] preorder, int bound) {\n        // If we've used all elements or current value exceeds the bound, stop\n        if (index >= preorder.Length || preorder[index] > bound) {\n            return null;\n        }\n\n        TreeNode root = new TreeNode(preorder[index]);\n        index++;\n\n        // Left child must be less than current node's value\n        root.left = Helper(preorder, root.val);\n        // Right child must be less than the inherited upper bound\n        root.right = Helper(preorder, bound);\n\n        return root;\n    }\n}",
    "recursiveLineMap": {
      "-": [
        4
      ],
      "base_case": [
        11,
        12
      ],
      "create_node": [
        15
      ],
      "increment_index": [
        16
      ],
      "recurse_left": [
        19
      ],
      "return_left": [
        19
      ],
      "recurse_right": [
        21
      ],
      "return_right": [
        21
      ],
      "return_node": [
        23
      ],
      "complete": [
        6
      ]
    },
    "recursiveConditionalMap": {
      "base_case": [
        11
      ]
    },
    "code": "",
    "lineMap": {}
  },
  "go": {
    "language": "go",
    "recursiveCode": "func bstFromPreorder(preorder []int) *TreeNode {\n    index := 0\n    return helper(preorder, &index, math.MaxInt32)\n}\n\nfunc helper(preorder []int, index *int, bound int) *TreeNode {\n    // If we've used all elements or current value exceeds the bound, stop\n    if *index >= len(preorder) || preorder[*index] > bound {\n        return nil\n    }\n\n    root := &TreeNode{Val: preorder[*index]}\n    *index++\n\n    // Left child must be less than current node's value\n    root.Left = helper(preorder, index, root.Val)\n    // Right child must be less than the inherited upper bound\n    root.Right = helper(preorder, index, bound)\n\n    return root\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "base_case": [
        8,
        9
      ],
      "create_node": [
        12
      ],
      "increment_index": [
        13
      ],
      "recurse_left": [
        16
      ],
      "return_left": [
        16
      ],
      "recurse_right": [
        18
      ],
      "return_right": [
        18
      ],
      "return_node": [
        20
      ],
      "complete": [
        3
      ]
    },
    "recursiveConditionalMap": {
      "base_case": [
        8
      ]
    },
    "code": "",
    "lineMap": {}
  },
  "javascript": {
    "language": "javascript",
    "recursiveCode": "var bstFromPreorder = function (preorder) {\n  var index = { val: 0 };\n  return helper(preorder, index, Infinity);\n};\n\nfunction helper(preorder, index, bound) {\n  // If we've used all elements or current value exceeds the bound, stop\n  if (index.val >= preorder.length || preorder[index.val] > bound) {\n    return null;\n  }\n\n  var root = new TreeNode(preorder[index.val]);\n  index.val++;\n\n  // Left child must be less than current node's value\n  root.left = helper(preorder, index, root.val);\n  // Right child must be less than the inherited upper bound\n  root.right = helper(preorder, index, bound);\n\n  return root;\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "base_case": [
        8,
        9
      ],
      "create_node": [
        12
      ],
      "increment_index": [
        13
      ],
      "recurse_left": [
        16
      ],
      "return_left": [
        16
      ],
      "recurse_right": [
        18
      ],
      "return_right": [
        18
      ],
      "return_node": [
        20
      ],
      "complete": [
        3
      ]
    },
    "recursiveConditionalMap": {
      "base_case": [
        8
      ]
    },
    "code": "",
    "lineMap": {}
  },
  "typescript": {
    "language": "typescript",
    "recursiveCode": "function bstFromPreorder(preorder: number[]): TreeNode | null {\n    const index = { val: 0 };\n    return helper(preorder, index, Infinity);\n}\n\nfunction helper(preorder: number[], index: { val: number }, bound: number): TreeNode | null {\n    // If we've used all elements or current value exceeds the bound, stop\n    if (index.val >= preorder.length || preorder[index.val] > bound) {\n        return null;\n    }\n\n    const root = new TreeNode(preorder[index.val]);\n    index.val++;\n\n    // Left child must be less than current node's value\n    root.left = helper(preorder, index, root.val);\n    // Right child must be less than the inherited upper bound\n    root.right = helper(preorder, index, bound);\n\n    return root;\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "base_case": [
        8,
        9
      ],
      "create_node": [
        12
      ],
      "increment_index": [
        13
      ],
      "recurse_left": [
        16
      ],
      "return_left": [
        16
      ],
      "recurse_right": [
        18
      ],
      "return_right": [
        18
      ],
      "return_node": [
        20
      ],
      "complete": [
        3
      ]
    },
    "recursiveConditionalMap": {
      "base_case": [
        8
      ]
    },
    "code": "",
    "lineMap": {}
  }
};

const ConstructBinarySearchTreeFromPreorderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "preorder": [
        8,
        5,
        1,
        7,
        10,
        12
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Ascending",
    "value": {
      "preorder": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Descending",
    "value": {
      "preorder": [
        5,
        4,
        3,
        2,
        1
      ]
    }
  }
];

function generateConstructBinarySearchTreeFromPreorderTraversalSteps(e: any): any[] {
  
let r=e.preorder||[],t={};r.forEach((e,r)=>{t[`arr_${r}`]={type:"arrayElement",value:e,position:r}}),r.length>0&&(t.ptr_index={type:"pointer",position:0,label:"idx"});let a=new RecursiveStepRecorder({idx:0},t);if(a.pushCallFrame({bound:"MAX",root:"-"},"bstFromPreorder"),a.record("-","Start: Construct BST from preorder traversal"),0===r.length)return a.record("complete","Empty array, nothing to build"),a.popCallFrame(),a.getSteps();let l=0,i=0;return!function e(t,n,o){let s=t===Number.MAX_SAFE_INTEGER?"MAX":t;a.pushCallFrame({bound:s,root:"-"},"helper");let d=l>=r.length,c=!d&&r[l]>t,u=d||c;if(a.add_conditional("base_case",u),u){let e=d?`idx (${l}) >= length (${r.length})`:`preorder[${l}] = ${r[l]} > bound (${s})`;a.record("base_case",`Base case: ${e}, return null`),a.popCallFrame();return}let p=r[l],h=`node_${i}`;i++,a.update_frame_variable("root",p),a.update_visual(`arr_${l}`,{type:"arrayElement",value:p,position:l,state:"highlight"}),a.add_new_visual(h,{type:"binaryTreeNode",value:p,parent:n,isLeftChild:o,state:"active"}),a.record("create_node",`Create node with value ${p}`),a.update_visual(`arr_${l}`,{type:"arrayElement",value:p,position:l,state:"sorted"}),l++,a.update_global_variable("idx",l),l<r.length?a.update_visual("ptr_index",{type:"pointer",position:l,label:"idx"}):a.delete_visual("ptr_index"),a.record("increment_index",`Increment idx to ${l}`),a.record("recurse_left",`Recurse left with bound = ${p}`),e(p,h,!0),a.record("return_left",`Returned from left subtree of node ${p}`),a.record("recurse_right",`Recurse right with bound = ${s}`),e(t,h,!1),a.record("return_right",`Returned from right subtree of node ${p}`),a.update_visual(h,{type:"binaryTreeNode",value:p,parent:n,isLeftChild:o,state:"visited"}),a.record("return_node",`Return completed node ${p}`),a.popCallFrame()}(Number.MAX_SAFE_INTEGER),a.record("complete","BST construction complete!"),a.popCallFrame(),a.getSteps()
}

export function ConstructBinarySearchTreeFromPreorderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ConstructBinarySearchTreeFromPreorderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateConstructBinarySearchTreeFromPreorderTraversalSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Construct BST from Preorder Traversal"
      slug="construct-binary-search-tree-from-preorder-traversal"
      approaches={approaches}
      presets={ConstructBinarySearchTreeFromPreorderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Convert BST to Sorted Doubly Linked List (convert-binary-search-tree-to-sorted-doubly-linked-list)
// ==========================================

const ConvertBinarySearchTreeToSortedDoublyLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def treeToDoublyList(self, root: 'Optional[Node]') -> 'Optional[Node]':\n        if not root:\n            return None\n\n        stack = []\n        first = None\n        last = None\n        current = root\n\n        while current or stack:\n            # Push all left children\n            while current:\n                stack.append(current)\n                current = current.left\n\n            # Process the next node in sorted order\n            current = stack.pop()\n\n            if last:\n                last.right = current\n                current.left = last\n            else:\n                first = current\n            last = current\n\n            # Move to right subtree\n            current = current.right\n\n        # Close the circular connection\n        first.left = last\n        last.right = first\n\n        return first",
    "lineMap": {
      "empty_tree": [
        3,
        4
      ],
      "init": [
        6,
        9
      ],
      "outer_loop": [
        11
      ],
      "push_left": [
        13,
        15
      ],
      "pop_node": [
        18
      ],
      "link_prev": [
        20,
        22
      ],
      "set_first": [
        23,
        24
      ],
      "set_last": [
        25
      ],
      "move_right": [
        28
      ],
      "close_circle": [
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "has_work": [
        11
      ],
      "has_last": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public Node treeToDoublyList(Node root) {\n        if (root == null) return null;\n\n        Deque<Node> stack = new ArrayDeque<>();\n        Node first = null;\n        Node last = null;\n        Node current = root;\n\n        while (current != null || !stack.isEmpty()) {\n            // Push all left children\n            while (current != null) {\n                stack.push(current);\n                current = current.left;\n            }\n\n            // Process the next node in sorted order\n            current = stack.pop();\n\n            if (last != null) {\n                last.right = current;\n                current.left = last;\n            } else {\n                first = current;\n            }\n            last = current;\n\n            // Move to right subtree\n            current = current.right;\n        }\n\n        // Close the circular connection\n        first.left = last;\n        last.right = first;\n\n        return first;\n    }\n}",
    "lineMap": {
      "empty_tree": [
        3
      ],
      "init": [
        5,
        8
      ],
      "outer_loop": [
        10
      ],
      "push_left": [
        12,
        14
      ],
      "pop_node": [
        18
      ],
      "link_prev": [
        20,
        22
      ],
      "set_first": [
        23,
        24
      ],
      "set_last": [
        26
      ],
      "move_right": [
        29
      ],
      "close_circle": [
        33,
        34
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "has_work": [
        10
      ],
      "has_last": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    Node* treeToDoublyList(Node* root) {\n        if (!root) return nullptr;\n\n        stack<Node*> stk;\n        Node* first = nullptr;\n        Node* last = nullptr;\n        Node* current = root;\n\n        while (current || !stk.empty()) {\n            // Push all left children\n            while (current) {\n                stk.push(current);\n                current = current->left;\n            }\n\n            // Process the next node in sorted order\n            current = stk.top();\n            stk.pop();\n\n            if (last) {\n                last->right = current;\n                current->left = last;\n            } else {\n                first = current;\n            }\n            last = current;\n\n            // Move to right subtree\n            current = current->right;\n        }\n\n        // Close the circular connection\n        first->left = last;\n        last->right = first;\n\n        return first;\n    }\n};",
    "lineMap": {
      "empty_tree": [
        4
      ],
      "init": [
        6,
        9
      ],
      "outer_loop": [
        11
      ],
      "push_left": [
        13,
        15
      ],
      "pop_node": [
        19,
        20
      ],
      "link_prev": [
        22,
        24
      ],
      "set_first": [
        25,
        26
      ],
      "set_last": [
        28
      ],
      "move_right": [
        31
      ],
      "close_circle": [
        35,
        36
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "has_work": [
        11
      ],
      "has_last": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var treeToDoublyList = function(root) {\n    if (!root) return null;\n\n    const stack = [];\n    let first = null;\n    let last = null;\n    let current = root;\n\n    while (current || stack.length > 0) {\n        // Push all left children\n        while (current) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        // Process the next node in sorted order\n        current = stack.pop();\n\n        if (last) {\n            last.right = current;\n            current.left = last;\n        } else {\n            first = current;\n        }\n        last = current;\n\n        // Move to right subtree\n        current = current.right;\n    }\n\n    // Close the circular connection\n    first.left = last;\n    last.right = first;\n\n    return first;\n};",
    "lineMap": {
      "empty_tree": [
        2
      ],
      "init": [
        4,
        7
      ],
      "outer_loop": [
        9
      ],
      "push_left": [
        11,
        13
      ],
      "pop_node": [
        17
      ],
      "link_prev": [
        19,
        21
      ],
      "set_first": [
        22,
        23
      ],
      "set_last": [
        25
      ],
      "move_right": [
        28
      ],
      "close_circle": [
        32,
        33
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "has_work": [
        9
      ],
      "has_last": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function treeToDoublyList(root: Node | null): Node | null {\n    if (!root) return null;\n\n    const stack: Node[] = [];\n    let first: Node | null = null;\n    let last: Node | null = null;\n    let current: Node | null = root;\n\n    while (current || stack.length > 0) {\n        // Push all left children\n        while (current) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        // Process the next node in sorted order\n        current = stack.pop()!;\n\n        if (last) {\n            last.right = current;\n            current.left = last;\n        } else {\n            first = current;\n        }\n        last = current;\n\n        // Move to right subtree\n        current = current.right;\n    }\n\n    // Close the circular connection\n    first!.left = last;\n    last!.right = first;\n\n    return first;\n}",
    "lineMap": {
      "empty_tree": [
        2
      ],
      "init": [
        4,
        7
      ],
      "outer_loop": [
        9
      ],
      "push_left": [
        11,
        13
      ],
      "pop_node": [
        17
      ],
      "link_prev": [
        19,
        21
      ],
      "set_first": [
        22,
        23
      ],
      "set_last": [
        25
      ],
      "move_right": [
        28
      ],
      "close_circle": [
        32,
        33
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "has_work": [
        9
      ],
      "has_last": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func treeToDoublyList(root *Node) *Node {\n    if root == nil {\n        return nil\n    }\n\n    stack := []*Node{}\n    var first, last *Node\n    current := root\n\n    for current != nil || len(stack) > 0 {\n        // Push all left children\n        for current != nil {\n            stack = append(stack, current)\n            current = current.Left\n        }\n\n        // Process the next node in sorted order\n        current = stack[len(stack)-1]\n        stack = stack[:len(stack)-1]\n\n        if last != nil {\n            last.Right = current\n            current.Left = last\n        } else {\n            first = current\n        }\n        last = current\n\n        // Move to right subtree\n        current = current.Right\n    }\n\n    // Close the circular connection\n    first.Left = last\n    last.Right = first\n\n    return first\n}",
    "lineMap": {
      "empty_tree": [
        2,
        3
      ],
      "init": [
        6,
        8
      ],
      "outer_loop": [
        10
      ],
      "push_left": [
        12,
        14
      ],
      "pop_node": [
        18,
        19
      ],
      "link_prev": [
        21,
        23
      ],
      "set_first": [
        24,
        25
      ],
      "set_last": [
        27
      ],
      "move_right": [
        30
      ],
      "close_circle": [
        34,
        35
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "has_work": [
        10
      ],
      "has_last": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public Node TreeToDoublyList(Node root) {\n        if (root == null) return null;\n\n        Stack<Node> stack = new Stack<Node>();\n        Node first = null;\n        Node last = null;\n        Node current = root;\n\n        while (current != null || stack.Count > 0) {\n            // Push all left children\n            while (current != null) {\n                stack.Push(current);\n                current = current.left;\n            }\n\n            // Process the next node in sorted order\n            current = stack.Pop();\n\n            if (last != null) {\n                last.right = current;\n                current.left = last;\n            } else {\n                first = current;\n            }\n            last = current;\n\n            // Move to right subtree\n            current = current.right;\n        }\n\n        // Close the circular connection\n        first.left = last;\n        last.right = first;\n\n        return first;\n    }\n}",
    "lineMap": {
      "empty_tree": [
        3
      ],
      "init": [
        5,
        8
      ],
      "outer_loop": [
        10
      ],
      "push_left": [
        12,
        14
      ],
      "pop_node": [
        18
      ],
      "link_prev": [
        20,
        22
      ],
      "set_first": [
        23,
        24
      ],
      "set_last": [
        26
      ],
      "move_right": [
        29
      ],
      "close_circle": [
        33,
        34
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "has_work": [
        10
      ],
      "has_last": [
        20
      ]
    }
  }
};

const ConvertBinarySearchTreeToSortedDoublyLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Balanced BST",
    "value": {
      "tree": [
        4,
        2,
        5,
        1,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
    "value": {
      "tree": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Right Skewed",
    "value": {
      "tree": [
        1,
        null,
        2,
        null,
        3
      ]
    }
  }
];

function generateConvertBinarySearchTreeToSortedDoublyLinkedListSteps(e: any): any[] {
  
let t=(0,l.createConvertBSTToDLLScene)(e),{recorder:r,nodeMap:n,leftOf:i,rightOf:o,setState:s,pointAt:a}=t,{clearPointers:d,setList:c}=t;if(0===n.size)return r.record("empty_tree","Empty tree, return null"),r.getSteps();let u=[],h=[];r.record("init","nodes = [] (collect the sorted order first)"),r.record("collect","Walk the tree in-order, appending each node");let f=e=>{if(null===e){r.set_conditionals([{key:"is_null",result:!0}]),r.record("inorder_null","Null node, return");return}let t=n.get(e).value;s(e,l.NODE_STATE.current),a("current",e),r.set_conditionals([{key:"is_null",result:!1}]),r.record("inorder_left",`Recurse into the left subtree of ${t}`),f(i(e)),u.push(e),h.push(t),c([...h],0,!1),s(e,l.NODE_STATE.onStack),a("current",e),r.record("inorder_visit",`Append ${t} to nodes`),r.record("inorder_right",`Recurse into the right subtree of ${t}`),f(o(e))};f(0),a("current",null);for(let e=0;e<u.length-1;e++)s(u[e],l.NODE_STATE.linked),s(u[e+1],l.NODE_STATE.linked),c([...h],e+1,!1),r.record("link_pair",`${h[e]}.right = ${h[e+1]}, ${h[e+1]}.left = ${h[e]}`);return s(u[0],l.NODE_STATE.linked),s(u[u.length-1],l.NODE_STATE.linked),a("first",u[0]),a("last",u[u.length-1]),r.record("close_head",`head = ${h[0]}, tail = ${h[h.length-1]}`),c([...h],Math.max(0,h.length-1),!0),r.record("close_circle",`head.left = ${h[h.length-1]}, tail.right = ${h[0]}`),d(),r.record("complete",`Done. Head of the circular list is ${h[0]}`),r.getSteps()
}

export function ConvertBinarySearchTreeToSortedDoublyLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ConvertBinarySearchTreeToSortedDoublyLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateConvertBinarySearchTreeToSortedDoublyLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Convert BST to Sorted Doubly Linked List"
      slug="convert-binary-search-tree-to-sorted-doubly-linked-list"
      approaches={approaches}
      presets={ConvertBinarySearchTreeToSortedDoublyLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Delete from BST (delete-bst)
// ==========================================

const DeleteBstTemplates = {
  "python": {
    "language": "python",
    "code": "def deleteNode(root, key):\n    if root is None:\n        return None\n\n    if key < root.val:\n        root.left = deleteNode(root.left, key)\n    elif key > root.val:\n        root.right = deleteNode(root.right, key)\n    else:\n        if root.left is None:\n            return root.right\n        elif root.right is None:\n            return root.left\n\n        successor = root.right\n        while successor.left:\n            successor = successor.left\n\n        root.val = successor.val\n        root.right = deleteNode(root.right, successor.val)\n\n    return root",
    "lineMap": {
      "init": [
        1
      ],
      "not_found": [
        2,
        3
      ],
      "visit_node": [
        5
      ],
      "go_left": [
        6
      ],
      "go_right": [
        8
      ],
      "found_node": [
        9
      ],
      "case_leaf": [
        10,
        11
      ],
      "case_one_child": [
        12,
        13
      ],
      "case_two_children": [
        15
      ],
      "find_successor": [
        15
      ],
      "successor_go_left": [
        16,
        17
      ],
      "found_successor": [
        15
      ],
      "copy_successor": [
        19
      ],
      "delete_successor": [
        20
      ],
      "delete_node": [
        11
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "search_loop": [
        5
      ],
      "go_left_condition": [
        5
      ],
      "found_key": [
        9
      ],
      "case_leaf": [
        10
      ],
      "case_one_child": [
        12
      ],
      "case_two_children": [],
      "successor_go_left": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public TreeNode deleteNode(TreeNode root, int key) {\n    if (root == null) {\n        return null;\n    }\n\n    if (key < root.val) {\n        root.left = deleteNode(root.left, key);\n    } else if (key > root.val) {\n        root.right = deleteNode(root.right, key);\n    } else {\n        if (root.left == null) {\n            return root.right;\n        } else if (root.right == null) {\n            return root.left;\n        }\n\n        TreeNode successor = root.right;\n        while (successor.left != null) {\n            successor = successor.left;\n        }\n\n        root.val = successor.val;\n        root.right = deleteNode(root.right, successor.val);\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "not_found": [
        2,
        3
      ],
      "visit_node": [
        6
      ],
      "go_left": [
        7
      ],
      "go_right": [
        9
      ],
      "found_node": [
        10
      ],
      "case_leaf": [
        11,
        12
      ],
      "case_one_child": [
        13,
        14
      ],
      "case_two_children": [
        17
      ],
      "find_successor": [
        17
      ],
      "successor_go_left": [
        18,
        19,
        20
      ],
      "found_successor": [
        17
      ],
      "copy_successor": [
        22
      ],
      "delete_successor": [
        23
      ],
      "delete_node": [
        12
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "search_loop": [
        6
      ],
      "go_left_condition": [
        6
      ],
      "found_key": [
        10
      ],
      "case_leaf": [
        11
      ],
      "case_one_child": [
        13
      ],
      "case_two_children": [],
      "successor_go_left": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "TreeNode* deleteNode(TreeNode* root, int key) {\n    if (root == nullptr) {\n        return nullptr;\n    }\n\n    if (key < root->val) {\n        root->left = deleteNode(root->left, key);\n    } else if (key > root->val) {\n        root->right = deleteNode(root->right, key);\n    } else {\n        if (root->left == nullptr) {\n            return root->right;\n        } else if (root->right == nullptr) {\n            return root->left;\n        }\n\n        TreeNode* successor = root->right;\n        while (successor->left != nullptr) {\n            successor = successor->left;\n        }\n\n        root->val = successor->val;\n        root->right = deleteNode(root->right, successor->val);\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "not_found": [
        2,
        3
      ],
      "visit_node": [
        6
      ],
      "go_left": [
        7
      ],
      "go_right": [
        9
      ],
      "found_node": [
        10
      ],
      "case_leaf": [
        11,
        12
      ],
      "case_one_child": [
        13,
        14
      ],
      "case_two_children": [
        17
      ],
      "find_successor": [
        17
      ],
      "successor_go_left": [
        18,
        19,
        20
      ],
      "found_successor": [
        17
      ],
      "copy_successor": [
        22
      ],
      "delete_successor": [
        23
      ],
      "delete_node": [
        12
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "search_loop": [
        6
      ],
      "go_left_condition": [
        6
      ],
      "found_key": [
        10
      ],
      "case_leaf": [
        11
      ],
      "case_one_child": [
        13
      ],
      "case_two_children": [],
      "successor_go_left": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function deleteNode(root, key) {\n    if (root === null) {\n        return null;\n    }\n\n    if (key < root.val) {\n        root.left = deleteNode(root.left, key);\n    } else if (key > root.val) {\n        root.right = deleteNode(root.right, key);\n    } else {\n        if (root.left === null) {\n            return root.right;\n        } else if (root.right === null) {\n            return root.left;\n        }\n\n        let successor = root.right;\n        while (successor.left !== null) {\n            successor = successor.left;\n        }\n\n        root.val = successor.val;\n        root.right = deleteNode(root.right, successor.val);\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "not_found": [
        2,
        3
      ],
      "visit_node": [
        6
      ],
      "go_left": [
        7
      ],
      "go_right": [
        9
      ],
      "found_node": [
        10
      ],
      "case_leaf": [
        11,
        12
      ],
      "case_one_child": [
        13,
        14
      ],
      "case_two_children": [
        17
      ],
      "find_successor": [
        17
      ],
      "successor_go_left": [
        18,
        19,
        20
      ],
      "found_successor": [
        17
      ],
      "copy_successor": [
        22
      ],
      "delete_successor": [
        23
      ],
      "delete_node": [
        12
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "search_loop": [
        6
      ],
      "go_left_condition": [
        6
      ],
      "found_key": [
        10
      ],
      "case_leaf": [
        11
      ],
      "case_one_child": [
        13
      ],
      "case_two_children": [],
      "successor_go_left": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function deleteNode(root: TreeNode | null, key: number): TreeNode | null {\n    if (root === null) {\n        return null;\n    }\n\n    if (key < root.val) {\n        root.left = deleteNode(root.left, key);\n    } else if (key > root.val) {\n        root.right = deleteNode(root.right, key);\n    } else {\n        if (root.left === null) {\n            return root.right;\n        } else if (root.right === null) {\n            return root.left;\n        }\n\n        let successor: TreeNode = root.right;\n        while (successor.left !== null) {\n            successor = successor.left;\n        }\n\n        root.val = successor.val;\n        root.right = deleteNode(root.right, successor.val);\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "not_found": [
        2,
        3
      ],
      "visit_node": [
        6
      ],
      "go_left": [
        7
      ],
      "go_right": [
        9
      ],
      "found_node": [
        10
      ],
      "case_leaf": [
        11,
        12
      ],
      "case_one_child": [
        13,
        14
      ],
      "case_two_children": [
        17
      ],
      "find_successor": [
        17
      ],
      "successor_go_left": [
        18,
        19,
        20
      ],
      "found_successor": [
        17
      ],
      "copy_successor": [
        22
      ],
      "delete_successor": [
        23
      ],
      "delete_node": [
        12
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "search_loop": [
        6
      ],
      "go_left_condition": [
        6
      ],
      "found_key": [
        10
      ],
      "case_leaf": [
        11
      ],
      "case_one_child": [
        13
      ],
      "case_two_children": [],
      "successor_go_left": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func deleteNode(root *TreeNode, key int) *TreeNode {\n    if root == nil {\n        return nil\n    }\n\n    if key < root.Val {\n        root.Left = deleteNode(root.Left, key)\n    } else if key > root.Val {\n        root.Right = deleteNode(root.Right, key)\n    } else {\n        if root.Left == nil {\n            return root.Right\n        } else if root.Right == nil {\n            return root.Left\n        }\n\n        successor := root.Right\n        for successor.Left != nil {\n            successor = successor.Left\n        }\n\n        root.Val = successor.Val\n        root.Right = deleteNode(root.Right, successor.Val)\n    }\n\n    return root\n}",
    "lineMap": {
      "init": [
        1
      ],
      "not_found": [
        2,
        3
      ],
      "visit_node": [
        6
      ],
      "go_left": [
        7
      ],
      "go_right": [
        9
      ],
      "found_node": [
        10
      ],
      "case_leaf": [
        11,
        12
      ],
      "case_one_child": [
        13,
        14
      ],
      "case_two_children": [
        17
      ],
      "find_successor": [
        17
      ],
      "successor_go_left": [
        18,
        19,
        20
      ],
      "found_successor": [
        17
      ],
      "copy_successor": [
        22
      ],
      "delete_successor": [
        23
      ],
      "delete_node": [
        12
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "search_loop": [
        6
      ],
      "go_left_condition": [
        6
      ],
      "found_key": [
        10
      ],
      "case_leaf": [
        11
      ],
      "case_one_child": [
        13
      ],
      "case_two_children": [],
      "successor_go_left": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public TreeNode DeleteNode(TreeNode root, int key) {\n    if (root == null) {\n        return null;\n    }\n\n    if (key < root.val) {\n        root.left = DeleteNode(root.left, key);\n    } else if (key > root.val) {\n        root.right = DeleteNode(root.right, key);\n    } else {\n        if (root.left == null) {\n            return root.right;\n        } else if (root.right == null) {\n            return root.left;\n        }\n\n        TreeNode successor = root.right;\n        while (successor.left != null) {\n            successor = successor.left;\n        }\n\n        root.val = successor.val;\n        root.right = DeleteNode(root.right, successor.val);\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "not_found": [
        2,
        3
      ],
      "visit_node": [
        6
      ],
      "go_left": [
        7
      ],
      "go_right": [
        9
      ],
      "found_node": [
        10
      ],
      "case_leaf": [
        11,
        12
      ],
      "case_one_child": [
        13,
        14
      ],
      "case_two_children": [
        17
      ],
      "find_successor": [
        17
      ],
      "successor_go_left": [
        18,
        19,
        20
      ],
      "found_successor": [
        17
      ],
      "copy_successor": [
        22
      ],
      "delete_successor": [
        23
      ],
      "delete_node": [
        12
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "search_loop": [
        6
      ],
      "go_left_condition": [
        6
      ],
      "found_key": [
        10
      ],
      "case_leaf": [
        11
      ],
      "case_one_child": [
        13
      ],
      "case_two_children": [],
      "successor_go_left": [
        18
      ]
    }
  }
};

const DeleteBstPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Delete 3 (two children)",
    "value": {
      "treeNodes": [
        5,
        3,
        6,
        2,
        4,
        null,
        7
      ],
      "key": 3
    }
  },
  {
    "id": "ex2",
    "label": "Delete 6 (one child)",
    "value": {
      "treeNodes": [
        5,
        3,
        6,
        2,
        4,
        null,
        7
      ],
      "key": 6
    }
  },
  {
    "id": "ex3",
    "label": "Delete 2 (leaf node)",
    "value": {
      "treeNodes": [
        5,
        3,
        6,
        2,
        4,
        null,
        7
      ],
      "key": 2
    }
  },
  {
    "id": "ex4",
    "label": "Delete 5 (root, two children)",
    "value": {
      "treeNodes": [
        5,
        3,
        6,
        2,
        4,
        null,
        7
      ],
      "key": 5
    }
  },
  {
    "id": "ex5",
    "label": "Delete 30 (balanced tree)",
    "value": {
      "treeNodes": [
        50,
        30,
        70,
        20,
        40,
        60,
        80
      ],
      "key": 30
    }
  }
];

function generateDeleteBstSteps(e: any): any[] {
  
let{treeNodes:t,key:r}=e,n=(0,_treeHelper848569.Gu)(t),s=new Map;for(let e=0;e<n.length;e++)if(null!==n[e]&&(s.set(e,{value:n[e],index:e}),e>0)){let t=Math.floor((e-1)/2);s.has(t)&&(s.get(e).parent=t,s.get(e).isLeftChild=e%2==1)}let i={};s.forEach((e,t)=>{i[`node_${t}`]={type:"binaryTreeNode",value:e.value,parent:void 0!==e.parent?`node_${e.parent}`:void 0,isLeftChild:e.isLeftChild,state:"standard"}});let a=new StepRecorder({key:r},{...i}),{updateNodeState:c}=(0,_treeHelper848569.E4)(s,a);if(a.record("init",`Start: Delete node with key ${r} from BST`),!s.has(0))return a.record("not_found","Tree is empty, nothing to delete"),a.record("complete",`Delete complete: key ${r} not found`),a.getSteps();let d=e=>2*e+1,u=e=>2*e+2,f=0,h=null,g=!0;for(;s.has(f);){let e=s.get(f).value;if(c(f,"visiting"),a.update_visual("ptr_curr",{type:"treeNodePointer",nodeKey:`node_${f}`,label:"curr",labelPosition:"top"}),a.add_conditional("search_loop",!0),a.record("visit_node",`Visiting node ${e}`),r===e){a.add_conditional("found_key",!0),a.record("found_node",`Found node with key ${r}`);break}if(r<e){let t=d(f);if(a.add_conditional("go_left_condition",!0),!s.has(t))return c(f,"visited"),a.record("not_found",`${r} < ${e}, but left child is null. Key not found.`),a.delete_visual("ptr_curr"),a.record("complete",`Delete complete: key ${r} not found in BST`),a.getSteps();c(f,"visited"),h=f,g=!0,f=t,a.update_visual("ptr_curr",{type:"treeNodePointer",nodeKey:`node_${f}`,label:"curr",labelPosition:"top"}),a.record("go_left",`${r} < ${e}, go to left child`)}else{let t=u(f);if(a.add_conditional("go_left_condition",!1),!s.has(t))return c(f,"visited"),a.record("not_found",`${r} > ${e}, but right child is null. Key not found.`),a.delete_visual("ptr_curr"),a.record("complete",`Delete complete: key ${r} not found in BST`),a.getSteps();c(f,"visited"),h=f,g=!1,f=t,a.update_visual("ptr_curr",{type:"treeNodePointer",nodeKey:`node_${f}`,label:"curr",labelPosition:"top"}),a.record("go_right",`${r} > ${e}, go to right child`)}}s.get(f);let _=d(f),p=u(f),v=s.has(_),y=s.has(p);if(!v&&!y)return a.add_conditional("case_leaf",!0),a.record("case_leaf",`Node ${r} is a leaf node, simply remove it`),a.delete_visual(`node_${f}`),a.delete_visual("ptr_curr"),a.record("delete_node",`Deleted leaf node ${r}`),a.record("complete",`Delete complete: removed ${r} from BST`),a.getSteps();if(!v||!y){a.add_conditional("case_one_child",!0);let e=v?_:p,t=s.get(e).value,o=v?"left":"right";return a.record("case_one_child",`Node ${r} has only ${o} child (${t}), replace with child`),(e=>{let t=[],r=[e];for(;r.length>0;){let e=r.shift();s.has(e)&&(t.push(e),r.push(d(e)),r.push(u(e)))}})(e),a.delete_visual(`node_${f}`),null!==h?a.update_visual(`node_${e}`,{type:"binaryTreeNode",value:t,parent:`node_${h}`,isLeftChild:g,state:"highlight"}):a.update_visual(`node_${e}`,{type:"binaryTreeNode",value:t,parent:void 0,isLeftChild:void 0,state:"highlight"}),a.delete_visual("ptr_curr"),a.record("delete_node",`Replaced node ${r} with its ${o} child ${t}`),a.record("complete",`Delete complete: removed ${r} from BST`),a.getSteps()}a.add_conditional("case_two_children",!0),a.record("case_two_children",`Node ${r} has two children, find inorder successor`);let m=p,b=f;for(a.update_visual("ptr_successor",{type:"treeNodePointer",nodeKey:`node_${m}`,label:"succ",labelPosition:"top"}),c(m,"visiting"),a.record("find_successor",`Looking for inorder successor starting from right child ${s.get(m).value}`);s.has(d(m));)c(m,"visited"),b=m,m=d(m),a.update_visual("ptr_successor",{type:"treeNodePointer",nodeKey:`node_${m}`,label:"succ",labelPosition:"top"}),c(m,"visiting"),a.add_conditional("successor_go_left",!0),a.record("successor_go_left",`Go left to ${s.get(m).value}`);let x=s.get(m).value;a.record("found_successor",`Found inorder successor: ${x}`),a.update_visual(`node_${f}`,{type:"binaryTreeNode",value:x,parent:null!==h?`node_${h}`:void 0,isLeftChild:null!==h?g:void 0,state:"highlight"}),a.record("copy_successor",`Copy successor value ${x} to node being deleted`);let k=u(m);if(s.has(k)){let e=s.get(k).value;a.delete_visual(`node_${m}`);let t=m===d(b);a.update_visual(`node_${k}`,{type:"binaryTreeNode",value:e,parent:`node_${b}`,isLeftChild:t,state:"standard"}),a.record("delete_successor",`Deleted successor ${x} and reconnected its right child ${e}`)}else a.delete_visual(`node_${m}`),a.record("delete_successor",`Deleted successor node ${x} (leaf)`);return a.delete_visual("ptr_curr"),a.delete_visual("ptr_successor"),c(f,"standard"),a.record("complete",`Delete complete: removed ${r} from BST`),a.getSteps()
}

export function DeleteBstProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DeleteBstTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDeleteBstSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Delete from BST"
      slug="delete-bst"
      approaches={approaches}
      presets={DeleteBstPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Delete Node in a BST (delete-node-in-a-bst)
// ==========================================

const DeleteNodeInABstTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:\n        # Find the node and its parent\n        parent = None\n        current = root\n\n        while current and current.val != key:\n            parent = current\n            if key < current.val:\n                current = current.left\n            else:\n                current = current.right\n\n        # Key not found\n        if not current:\n            return root\n\n        # Case: node has two children\n        if current.left and current.right:\n            # Find in-order successor and its parent\n            succ_parent = current\n            successor = current.right\n            while successor.left:\n                succ_parent = successor\n                successor = successor.left\n            # Copy successor value\n            current.val = successor.val\n            # Now delete the successor (has at most one child)\n            current = successor\n            parent = succ_parent\n\n        # Now current has at most one child\n        child = current.left if current.left else current.right\n\n        if parent is None:\n            # Deleting the root\n            return child\n\n        # Update parent pointer\n        if parent.left == current:\n            parent.left = child\n        else:\n            parent.right = child\n\n        return root",
    "lineMap": {
      "init": [
        4,
        5
      ],
      "search": [
        7
      ],
      "set_parent": [
        8
      ],
      "go_left": [
        10
      ],
      "go_right": [
        12
      ],
      "not_found": [
        15,
        16
      ],
      "check_two": [
        19
      ],
      "succ_init": [
        21,
        22
      ],
      "find_successor": [
        23
      ],
      "move_successor": [
        24,
        25
      ],
      "copy_value": [
        27
      ],
      "retarget": [
        29,
        30
      ],
      "pick_child": [
        33
      ],
      "delete_root": [
        35,
        37
      ],
      "link_left": [
        40,
        41
      ],
      "link_right": [
        42,
        43
      ],
      "complete": [
        45
      ]
    },
    "conditionalMap": {
      "searching": [
        7
      ],
      "less": [
        9
      ],
      "is_null": [
        15
      ],
      "two_children": [
        19
      ],
      "succ_left": [
        23
      ],
      "no_parent": [
        35
      ],
      "parent_left": [
        40
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode deleteNode(TreeNode root, int key) {\n        // Find the node and its parent\n        TreeNode parent = null;\n        TreeNode current = root;\n\n        while (current != null && current.val != key) {\n            parent = current;\n            if (key < current.val) {\n                current = current.left;\n            } else {\n                current = current.right;\n            }\n        }\n\n        // Key not found\n        if (current == null) return root;\n\n        // Case: node has two children\n        if (current.left != null && current.right != null) {\n            // Find in-order successor and its parent\n            TreeNode succParent = current;\n            TreeNode successor = current.right;\n            while (successor.left != null) {\n                succParent = successor;\n                successor = successor.left;\n            }\n            // Copy successor value\n            current.val = successor.val;\n            // Now delete the successor (has at most one child)\n            current = successor;\n            parent = succParent;\n        }\n\n        // Now current has at most one child\n        TreeNode child = (current.left != null) ? current.left : current.right;\n\n        if (parent == null) {\n            // Deleting the root\n            return child;\n        }\n\n        // Update parent pointer\n        if (parent.left == current) {\n            parent.left = child;\n        } else {\n            parent.right = child;\n        }\n\n        return root;\n    }\n}",
    "lineMap": {
      "init": [
        4,
        5
      ],
      "search": [
        7
      ],
      "set_parent": [
        8
      ],
      "go_left": [
        10
      ],
      "go_right": [
        12
      ],
      "not_found": [
        17
      ],
      "check_two": [
        20
      ],
      "succ_init": [
        22,
        23
      ],
      "find_successor": [
        24
      ],
      "move_successor": [
        25,
        26
      ],
      "copy_value": [
        29
      ],
      "retarget": [
        31,
        32
      ],
      "pick_child": [
        36
      ],
      "delete_root": [
        38,
        40
      ],
      "link_left": [
        44,
        45
      ],
      "link_right": [
        46,
        47
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "searching": [
        7
      ],
      "less": [
        9
      ],
      "is_null": [
        17
      ],
      "two_children": [
        20
      ],
      "succ_left": [
        24
      ],
      "no_parent": [
        38
      ],
      "parent_left": [
        44
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* deleteNode(TreeNode* root, int key) {\n        // Find the node and its parent\n        TreeNode* parent = nullptr;\n        TreeNode* current = root;\n\n        while (current && current->val != key) {\n            parent = current;\n            if (key < current->val) {\n                current = current->left;\n            } else {\n                current = current->right;\n            }\n        }\n\n        // Key not found\n        if (!current) return root;\n\n        // Case: node has two children\n        if (current->left && current->right) {\n            // Find in-order successor and its parent\n            TreeNode* succParent = current;\n            TreeNode* successor = current->right;\n            while (successor->left) {\n                succParent = successor;\n                successor = successor->left;\n            }\n            // Copy successor value\n            current->val = successor->val;\n            // Now delete the successor (has at most one child)\n            current = successor;\n            parent = succParent;\n        }\n\n        // Now current has at most one child\n        TreeNode* child = current->left ? current->left : current->right;\n\n        if (!parent) {\n            // Deleting the root\n            return child;\n        }\n\n        // Update parent pointer\n        if (parent->left == current) {\n            parent->left = child;\n        } else {\n            parent->right = child;\n        }\n\n        return root;\n    }\n};",
    "lineMap": {
      "init": [
        5,
        6
      ],
      "search": [
        8
      ],
      "set_parent": [
        9
      ],
      "go_left": [
        11
      ],
      "go_right": [
        13
      ],
      "not_found": [
        18
      ],
      "check_two": [
        21
      ],
      "succ_init": [
        23,
        24
      ],
      "find_successor": [
        25
      ],
      "move_successor": [
        26,
        27
      ],
      "copy_value": [
        30
      ],
      "retarget": [
        32,
        33
      ],
      "pick_child": [
        37
      ],
      "delete_root": [
        39,
        41
      ],
      "link_left": [
        45,
        46
      ],
      "link_right": [
        47,
        48
      ],
      "complete": [
        51
      ]
    },
    "conditionalMap": {
      "searching": [
        8
      ],
      "less": [
        10
      ],
      "is_null": [
        18
      ],
      "two_children": [
        21
      ],
      "succ_left": [
        25
      ],
      "no_parent": [
        39
      ],
      "parent_left": [
        45
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var deleteNode = function(root, key) {\n    // Find the node and its parent\n    var parent = null;\n    var current = root;\n\n    while (current !== null && current.val !== key) {\n        parent = current;\n        if (key < current.val) {\n            current = current.left;\n        } else {\n            current = current.right;\n        }\n    }\n\n    // Key not found\n    if (current === null) return root;\n\n    // Case: node has two children\n    if (current.left !== null && current.right !== null) {\n        // Find in-order successor and its parent\n        var succParent = current;\n        var successor = current.right;\n        while (successor.left !== null) {\n            succParent = successor;\n            successor = successor.left;\n        }\n        // Copy successor value\n        current.val = successor.val;\n        // Now delete the successor (has at most one child)\n        current = successor;\n        parent = succParent;\n    }\n\n    // Now current has at most one child\n    var child = current.left !== null ? current.left : current.right;\n\n    if (parent === null) {\n        // Deleting the root\n        return child;\n    }\n\n    // Update parent pointer\n    if (parent.left === current) {\n        parent.left = child;\n    } else {\n        parent.right = child;\n    }\n\n    return root;\n};",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "search": [
        6
      ],
      "set_parent": [
        7
      ],
      "go_left": [
        9
      ],
      "go_right": [
        11
      ],
      "not_found": [
        16
      ],
      "check_two": [
        19
      ],
      "succ_init": [
        21,
        22
      ],
      "find_successor": [
        23
      ],
      "move_successor": [
        24,
        25
      ],
      "copy_value": [
        28
      ],
      "retarget": [
        30,
        31
      ],
      "pick_child": [
        35
      ],
      "delete_root": [
        37,
        39
      ],
      "link_left": [
        43,
        44
      ],
      "link_right": [
        45,
        46
      ],
      "complete": [
        49
      ]
    },
    "conditionalMap": {
      "searching": [
        6
      ],
      "less": [
        8
      ],
      "is_null": [
        16
      ],
      "two_children": [
        19
      ],
      "succ_left": [
        23
      ],
      "no_parent": [
        37
      ],
      "parent_left": [
        43
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function deleteNode(root: TreeNode | null, key: number): TreeNode | null {\n    // Find the node and its parent\n    let parent: TreeNode | null = null;\n    let current: TreeNode | null = root;\n\n    while (current !== null && current.val !== key) {\n        parent = current;\n        if (key < current.val) {\n            current = current.left;\n        } else {\n            current = current.right;\n        }\n    }\n\n    // Key not found\n    if (current === null) return root;\n\n    // Case: node has two children\n    if (current.left !== null && current.right !== null) {\n        // Find in-order successor and its parent\n        let succParent: TreeNode = current;\n        let successor: TreeNode = current.right!;\n        while (successor.left !== null) {\n            succParent = successor;\n            successor = successor.left;\n        }\n        // Copy successor value\n        current.val = successor.val;\n        // Now delete the successor (has at most one child)\n        current = successor;\n        parent = succParent;\n    }\n\n    // Now current has at most one child\n    let child: TreeNode | null = current.left !== null ? current.left : current.right;\n\n    if (parent === null) {\n        // Deleting the root\n        return child;\n    }\n\n    // Update parent pointer\n    if (parent.left === current) {\n        parent.left = child;\n    } else {\n        parent.right = child;\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "search": [
        6
      ],
      "set_parent": [
        7
      ],
      "go_left": [
        9
      ],
      "go_right": [
        11
      ],
      "not_found": [
        16
      ],
      "check_two": [
        19
      ],
      "succ_init": [
        21,
        22
      ],
      "find_successor": [
        23
      ],
      "move_successor": [
        24,
        25
      ],
      "copy_value": [
        28
      ],
      "retarget": [
        30,
        31
      ],
      "pick_child": [
        35
      ],
      "delete_root": [
        37,
        39
      ],
      "link_left": [
        43,
        44
      ],
      "link_right": [
        45,
        46
      ],
      "complete": [
        49
      ]
    },
    "conditionalMap": {
      "searching": [
        6
      ],
      "less": [
        8
      ],
      "is_null": [
        16
      ],
      "two_children": [
        19
      ],
      "succ_left": [
        23
      ],
      "no_parent": [
        37
      ],
      "parent_left": [
        43
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func deleteNode(root *TreeNode, key int) *TreeNode {\n    // Find the node and its parent\n    var parent *TreeNode\n    current := root\n\n    for current != nil && current.Val != key {\n        parent = current\n        if key < current.Val {\n            current = current.Left\n        } else {\n            current = current.Right\n        }\n    }\n\n    // Key not found\n    if current == nil {\n        return root\n    }\n\n    // Case: node has two children\n    if current.Left != nil && current.Right != nil {\n        // Find in-order successor and its parent\n        succParent := current\n        successor := current.Right\n        for successor.Left != nil {\n            succParent = successor\n            successor = successor.Left\n        }\n        // Copy successor value\n        current.Val = successor.Val\n        // Now delete the successor (has at most one child)\n        current = successor\n        parent = succParent\n    }\n\n    // Now current has at most one child\n    var child *TreeNode\n    if current.Left != nil {\n        child = current.Left\n    } else {\n        child = current.Right\n    }\n\n    if parent == nil {\n        // Deleting the root\n        return child\n    }\n\n    // Update parent pointer\n    if parent.Left == current {\n        parent.Left = child\n    } else {\n        parent.Right = child\n    }\n\n    return root\n}",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "search": [
        6
      ],
      "set_parent": [
        7
      ],
      "go_left": [
        9
      ],
      "go_right": [
        11
      ],
      "not_found": [
        16,
        17
      ],
      "check_two": [
        21
      ],
      "succ_init": [
        23,
        24
      ],
      "find_successor": [
        25
      ],
      "move_successor": [
        26,
        27
      ],
      "copy_value": [
        30
      ],
      "retarget": [
        32,
        33
      ],
      "pick_child": [
        37,
        41
      ],
      "delete_root": [
        44,
        46
      ],
      "link_left": [
        50,
        51
      ],
      "link_right": [
        52,
        53
      ],
      "complete": [
        56
      ]
    },
    "conditionalMap": {
      "searching": [
        6
      ],
      "less": [
        8
      ],
      "is_null": [
        16
      ],
      "two_children": [
        21
      ],
      "succ_left": [
        25
      ],
      "no_parent": [
        44
      ],
      "parent_left": [
        50
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode DeleteNode(TreeNode root, int key) {\n        // Find the node and its parent\n        TreeNode parent = null;\n        TreeNode current = root;\n\n        while (current != null && current.val != key) {\n            parent = current;\n            if (key < current.val) {\n                current = current.left;\n            } else {\n                current = current.right;\n            }\n        }\n\n        // Key not found\n        if (current == null) return root;\n\n        // Case: node has two children\n        if (current.left != null && current.right != null) {\n            // Find in-order successor and its parent\n            TreeNode succParent = current;\n            TreeNode successor = current.right;\n            while (successor.left != null) {\n                succParent = successor;\n                successor = successor.left;\n            }\n            // Copy successor value\n            current.val = successor.val;\n            // Now delete the successor (has at most one child)\n            current = successor;\n            parent = succParent;\n        }\n\n        // Now current has at most one child\n        TreeNode child = (current.left != null) ? current.left : current.right;\n\n        if (parent == null) {\n            // Deleting the root\n            return child;\n        }\n\n        // Update parent pointer\n        if (parent.left == current) {\n            parent.left = child;\n        } else {\n            parent.right = child;\n        }\n\n        return root;\n    }\n}",
    "lineMap": {
      "init": [
        4,
        5
      ],
      "search": [
        7
      ],
      "set_parent": [
        8
      ],
      "go_left": [
        10
      ],
      "go_right": [
        12
      ],
      "not_found": [
        17
      ],
      "check_two": [
        20
      ],
      "succ_init": [
        22,
        23
      ],
      "find_successor": [
        24
      ],
      "move_successor": [
        25,
        26
      ],
      "copy_value": [
        29
      ],
      "retarget": [
        31,
        32
      ],
      "pick_child": [
        36
      ],
      "delete_root": [
        38,
        40
      ],
      "link_left": [
        44,
        45
      ],
      "link_right": [
        46,
        47
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "searching": [
        7
      ],
      "less": [
        9
      ],
      "is_null": [
        17
      ],
      "two_children": [
        20
      ],
      "succ_left": [
        24
      ],
      "no_parent": [
        38
      ],
      "parent_left": [
        44
      ]
    }
  }
};

const DeleteNodeInABstPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Two children (root)",
    "value": {
      "tree": [
        5,
        3,
        7,
        2,
        4,
        6,
        8
      ],
      "key": 5
    }
  },
  {
    "id": "ex2",
    "label": "One child",
    "value": {
      "tree": [
        5,
        3,
        7,
        2,
        4,
        6,
        8
      ],
      "key": 3
    }
  },
  {
    "id": "ex3",
    "label": "Leaf node",
    "value": {
      "tree": [
        5,
        3,
        7,
        2,
        4,
        6,
        8
      ],
      "key": 2
    }
  }
];

function generateDeleteNodeInABstSteps(e: any): any[] {
  
let t=(0,l.createDeleteNodeInBSTScene)(e),{recorder:r,key:n,setState:o,syncTree:s,pointAt:i,clearPointers:c}=t,a=null,u=t.getRoot();for(o(u,l.NODE_STATE.current),i("current",u),r.record("init",`parent = null, current = ${u?u.value:"null"}`);;){let e=null!==u&&u.value!==n;if(r.set_conditionals([{key:"searching",result:e}]),r.record("search",null===u?"current is null, the search is over":e?`${u.value} != ${n}, keep searching`:`${u.value} == ${n}, this is the node to delete`),!e||null===u)break;o(u,l.NODE_STATE.onPath),i("parent",a=u),r.record("set_parent",`parent = ${a.value}`);let t=n<u.value;o(u=t?u.left:u.right,l.NODE_STATE.current),i("current",u),r.set_conditionals([{key:"less",result:t}]),r.record(t?"go_left":"go_right",`${n} ${t?"<":">"} ${a.value}, current = ${u?u.value:"null"}`)}if(r.set_conditionals([{key:"is_null",result:null===u}]),null===u)return c(),r.record("not_found",`Key ${n} is not in the BST, return the tree unchanged`),r.record("complete",`Delete complete: key ${n} was not found`),r.getSteps();let d=null!==u.left&&null!==u.right;if(o(u,l.NODE_STATE.removed),r.set_conditionals([{key:"is_null",result:!1},{key:"two_children",result:d}]),r.record("check_two",d?`${u.value} has two children, find its in-order successor`:`${u.value} has at most one child, no successor needed`),d){let e=u,t=u.right;for(o(t,l.NODE_STATE.successor),i("current",null),i("succParent",e),i("successor",t),r.record("succ_init",`succParent = ${e.value}, successor = ${t.value}`);;){let n=null!==t.left;if(r.set_conditionals([{key:"succ_left",result:n}]),r.record("find_successor",n?`${t.value} still has a left child, keep going left`:`${t.value} has no left child, it is the in-order successor`),!n)break;o(t,l.NODE_STATE.onPath),e=t,o(t=t.left,l.NODE_STATE.successor),i("succParent",e),i("successor",t),r.record("move_successor",`succParent = ${e.value}, successor = ${t.value}`)}let n=t.value;u.value=n,o(u,l.NODE_STATE.kept),s(),r.record("copy_value",`Copy ${n} into the node being deleted`),u=t,a=e,o(u,l.NODE_STATE.removed),i("current",u),i("parent",a),i("successor",null),i("succParent",null),r.record("retarget",`current = ${u.value}, parent = ${a.value}`)}let h=null!==u.left?u.left:u.right;if(r.record("pick_child",h?`child = ${h.value}`:`child = null, ${u.value} is a leaf`),null===a)return t.setRoot(h),o(h,l.NODE_STATE.kept),s(),c(),r.set_conditionals([{key:"no_parent",result:!0}]),r.record("delete_root",h?`Root removed, ${h.value} becomes the new root`:"Root removed, the tree is now empty"),r.record("complete",`Delete complete: removed key ${n} from BST`),r.getSteps();let f=a.left===u;return f?a.left=h:a.right=h,o(h,l.NODE_STATE.kept),s(),c(),r.set_conditionals([{key:"no_parent",result:!1},{key:"parent_left",result:f}]),r.record(f?"link_left":"link_right",`${a.value}.${f?"left":"right"} = ${h?h.value:"null"}`),r.record("complete",`Delete complete: removed key ${n} from BST`),r.getSteps()
}

export function DeleteNodeInABstProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DeleteNodeInABstTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDeleteNodeInABstSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Delete Node in a BST"
      slug="delete-node-in-a-bst"
      approaches={approaches}
      presets={DeleteNodeInABstPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Inorder Successor in BST (inorder-successor-in-bst)
// ==========================================

const InorderSuccessorInBstTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def inorderSuccessor(self, root: TreeNode, p: TreeNode) -> TreeNode:\n        successor = None\n        current = root\n\n        while current:\n            if current.val > p.val:\n                # Current node could be the successor, record it\n                successor = current\n                # Look for a smaller valid candidate to the left\n                current = current.left\n            else:\n                # Current value is too small, go right\n                current = current.right\n\n        return successor",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "compare": [
        6,
        7
      ],
      "update_successor": [
        9,
        11
      ],
      "go_right": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "has_current": [
        6
      ],
      "greater": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode inorderSuccessor(TreeNode root, TreeNode p) {\n        TreeNode successor = null;\n        TreeNode current = root;\n\n        while (current != null) {\n            if (current.val > p.val) {\n                // Current node could be the successor, record it\n                successor = current;\n                // Look for a smaller valid candidate to the left\n                current = current.left;\n            } else {\n                // Current value is too small, go right\n                current = current.right;\n            }\n        }\n\n        return successor;\n    }\n}",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "compare": [
        6,
        7
      ],
      "update_successor": [
        9,
        11
      ],
      "go_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "has_current": [
        6
      ],
      "greater": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {\n        TreeNode* successor = nullptr;\n        TreeNode* current = root;\n\n        while (current != nullptr) {\n            if (current->val > p->val) {\n                // Current node could be the successor, record it\n                successor = current;\n                // Look for a smaller valid candidate to the left\n                current = current->left;\n            } else {\n                // Current value is too small, go right\n                current = current->right;\n            }\n        }\n\n        return successor;\n    }\n};",
    "lineMap": {
      "init": [
        4,
        5
      ],
      "compare": [
        7,
        8
      ],
      "update_successor": [
        10,
        12
      ],
      "go_right": [
        15
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "has_current": [
        7
      ],
      "greater": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var inorderSuccessor = function (root, p) {\n  let successor = null;\n  let current = root;\n\n  while (current !== null) {\n    if (current.val > p.val) {\n      // Current node could be the successor, record it\n      successor = current;\n      // Look for a smaller valid candidate to the left\n      current = current.left;\n    } else {\n      // Current value is too small, go right\n      current = current.right;\n    }\n  }\n\n  return successor;\n};",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "compare": [
        5,
        6
      ],
      "update_successor": [
        8,
        10
      ],
      "go_right": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "has_current": [
        5
      ],
      "greater": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function inorderSuccessor(root: TreeNode | null, p: TreeNode): TreeNode | null {\n    let successor: TreeNode | null = null;\n    let current = root;\n\n    while (current !== null) {\n        if (current.val > p.val) {\n            // Current node could be the successor, record it\n            successor = current;\n            // Look for a smaller valid candidate to the left\n            current = current.left;\n        } else {\n            // Current value is too small, go right\n            current = current.right;\n        }\n    }\n\n    return successor;\n}",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "compare": [
        5,
        6
      ],
      "update_successor": [
        8,
        10
      ],
      "go_right": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "has_current": [
        5
      ],
      "greater": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func inorderSuccessor(root *TreeNode, p *TreeNode) *TreeNode {\n    var successor *TreeNode\n    current := root\n\n    for current != nil {\n        if current.Val > p.Val {\n            // Current node could be the successor, record it\n            successor = current\n            // Look for a smaller valid candidate to the left\n            current = current.Left\n        } else {\n            // Current value is too small, go right\n            current = current.Right\n        }\n    }\n\n    return successor\n}",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "compare": [
        5,
        6
      ],
      "update_successor": [
        8,
        10
      ],
      "go_right": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "has_current": [
        5
      ],
      "greater": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode InorderSuccessor(TreeNode root, TreeNode p) {\n        TreeNode successor = null;\n        TreeNode current = root;\n\n        while (current != null) {\n            if (current.val > p.val) {\n                // Current node could be the successor, record it\n                successor = current;\n                // Look for a smaller valid candidate to the left\n                current = current.left;\n            } else {\n                // Current value is too small, go right\n                current = current.right;\n            }\n        }\n\n        return successor;\n    }\n}",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "compare": [
        6,
        7
      ],
      "update_successor": [
        9,
        11
      ],
      "go_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "has_current": [
        6
      ],
      "greater": [
        7
      ]
    }
  }
};

const InorderSuccessorInBstPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (successor = 5)",
    "value": {
      "tree": [
        5,
        3,
        7,
        2,
        4,
        6,
        8
      ],
      "p": 4
    }
  },
  {
    "id": "ex2",
    "label": "Successor is ancestor (successor = 20)",
    "value": {
      "tree": [
        20,
        10,
        30,
        5,
        15,
        25,
        35
      ],
      "p": 15
    }
  },
  {
    "id": "ex3",
    "label": "No successor (rightmost node)",
    "value": {
      "tree": [
        5,
        3,
        7,
        2,
        4,
        6,
        8
      ],
      "p": 8
    }
  }
];

function generateInorderSuccessorInBstSteps(e: any): any[] {
  
let{recorder:r,nodeMap:t,p:n,leftOf:s,rightOf:l,setState:i,pointAt:c,clearPointers:d}=(0,o.createInorderSuccessorScene)(e);if(0===t.size)return r.record("complete","Tree is empty, no successor exists"),r.getSteps();let a=0,u=null;for(i(0,o.NODE_STATE.current),c("current",a),r.record("init",`successor = null, current = root (${t.get(0).value})`);null!==a;){let e=t.get(a).value,d=e>n;if(r.set_conditionals([{key:"has_current",result:!0},{key:"greater",result:d}]),r.record("compare",`current.val (${e}) ${d?">":"<="} p.val (${n})`),d){null!==u&&i(u,o.NODE_STATE.visited),i(u=a,o.NODE_STATE.successor),c("successor",u);let t=s(a);i(t,o.NODE_STATE.current),c("current",t),r.record("update_successor",`${e} > ${n}: successor = ${e}, then move left`),a=t;continue}i(a,o.NODE_STATE.visited);let p=l(a);i(p,o.NODE_STATE.current),c("current",p),r.record("go_right",`${e} <= ${n}: move right`),a=p}return r.set_conditionals([{key:"has_current",result:!1}]),null!==u?(d(),c("successor",u),r.record("complete",`current is null. Inorder successor of ${n} is ${t.get(u).value}`)):(d(),r.record("complete",`current is null. ${n} has no successor`)),r.getSteps()
}

export function InorderSuccessorInBstProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InorderSuccessorInBstTemplates,
      generateSteps: (e: any) => {
        const recorded = generateInorderSuccessorInBstSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Inorder Successor in BST"
      slug="inorder-successor-in-bst"
      approaches={approaches}
      presets={InorderSuccessorInBstPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Inorder Successor in BST II (inorder-successor-in-bst-ii)
// ==========================================

const InorderSuccessorInBstIiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def inorderSuccessor(self, node: 'Node') -> 'Optional[Node]':\n        # Case 1: Node has a right subtree\n        # Successor is the leftmost node in the right subtree\n        if node.right:\n            current = node.right\n            while current.left:\n                current = current.left\n            return current\n\n        # Case 2: No right subtree\n        # Walk up until we find an ancestor where node is in its left subtree\n        current = node\n        while current.parent and current == current.parent.right:\n            current = current.parent\n        return current.parent",
    "lineMap": {
      "init": [
        2
      ],
      "check_right": [
        5
      ],
      "go_right": [
        6
      ],
      "check_left": [
        7
      ],
      "go_left": [
        8
      ],
      "complete_subtree": [
        9
      ],
      "start_climb": [
        13
      ],
      "check_parent": [
        14
      ],
      "walk_up": [
        15
      ],
      "complete_ancestor": [
        16
      ]
    },
    "conditionalMap": {
      "has_right": [
        5
      ],
      "has_left": [
        7
      ],
      "is_right_child": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public Node inorderSuccessor(Node node) {\n        // Case 1: Node has a right subtree\n        // Successor is the leftmost node in the right subtree\n        if (node.right != null) {\n            Node current = node.right;\n            while (current.left != null) {\n                current = current.left;\n            }\n            return current;\n        }\n\n        // Case 2: No right subtree\n        // Walk up until we find an ancestor where node is in its left subtree\n        Node current = node;\n        while (current.parent != null && current == current.parent.right) {\n            current = current.parent;\n        }\n        return current.parent;\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "check_right": [
        5
      ],
      "go_right": [
        6
      ],
      "check_left": [
        7
      ],
      "go_left": [
        8
      ],
      "complete_subtree": [
        10
      ],
      "start_climb": [
        15
      ],
      "check_parent": [
        16
      ],
      "walk_up": [
        17
      ],
      "complete_ancestor": [
        19
      ]
    },
    "conditionalMap": {
      "has_right": [
        5
      ],
      "has_left": [
        7
      ],
      "is_right_child": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    Node* inorderSuccessor(Node* node) {\n        // Case 1: Node has a right subtree\n        // Successor is the leftmost node in the right subtree\n        if (node->right != nullptr) {\n            Node* current = node->right;\n            while (current->left != nullptr) {\n                current = current->left;\n            }\n            return current;\n        }\n\n        // Case 2: No right subtree\n        // Walk up until we find an ancestor where node is in its left subtree\n        Node* current = node;\n        while (current->parent != nullptr && current == current->parent->right) {\n            current = current->parent;\n        }\n        return current->parent;\n    }\n};",
    "lineMap": {
      "init": [
        3
      ],
      "check_right": [
        6
      ],
      "go_right": [
        7
      ],
      "check_left": [
        8
      ],
      "go_left": [
        9
      ],
      "complete_subtree": [
        11
      ],
      "start_climb": [
        16
      ],
      "check_parent": [
        17
      ],
      "walk_up": [
        18
      ],
      "complete_ancestor": [
        20
      ]
    },
    "conditionalMap": {
      "has_right": [
        6
      ],
      "has_left": [
        8
      ],
      "is_right_child": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var inorderSuccessor = function (node) {\n  // Case 1: Node has a right subtree\n  // Successor is the leftmost node in the right subtree\n  if (node.right !== null) {\n    let current = node.right\n    while (current.left !== null) {\n      current = current.left\n    }\n    return current\n  }\n\n  // Case 2: No right subtree\n  // Walk up until we find an ancestor where node is in its left subtree\n  let current = node\n  while (current.parent !== null && current === current.parent.right) {\n    current = current.parent\n  }\n  return current.parent\n}",
    "lineMap": {
      "init": [
        1
      ],
      "check_right": [
        4
      ],
      "go_right": [
        5
      ],
      "check_left": [
        6
      ],
      "go_left": [
        7
      ],
      "complete_subtree": [
        9
      ],
      "start_climb": [
        14
      ],
      "check_parent": [
        15
      ],
      "walk_up": [
        16
      ],
      "complete_ancestor": [
        18
      ]
    },
    "conditionalMap": {
      "has_right": [
        4
      ],
      "has_left": [
        6
      ],
      "is_right_child": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function inorderSuccessor(node: Node): Node | null {\n  // Case 1: Node has a right subtree\n  // Successor is the leftmost node in the right subtree\n  if (node.right !== null) {\n    let current: Node = node.right\n    while (current.left !== null) {\n      current = current.left\n    }\n    return current\n  }\n\n  // Case 2: No right subtree\n  // Walk up until we find an ancestor where node is in its left subtree\n  let current: Node = node\n  while (current.parent !== null && current === current.parent.right) {\n    current = current.parent\n  }\n  return current.parent\n}",
    "lineMap": {
      "init": [
        1
      ],
      "check_right": [
        4
      ],
      "go_right": [
        5
      ],
      "check_left": [
        6
      ],
      "go_left": [
        7
      ],
      "complete_subtree": [
        9
      ],
      "start_climb": [
        14
      ],
      "check_parent": [
        15
      ],
      "walk_up": [
        16
      ],
      "complete_ancestor": [
        18
      ]
    },
    "conditionalMap": {
      "has_right": [
        4
      ],
      "has_left": [
        6
      ],
      "is_right_child": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func inorderSuccessor(node *Node) *Node {\n    // Case 1: Node has a right subtree\n    // Successor is the leftmost node in the right subtree\n    if node.Right != nil {\n        current := node.Right\n        for current.Left != nil {\n            current = current.Left\n        }\n        return current\n    }\n\n    // Case 2: No right subtree\n    // Walk up until we find an ancestor where node is in its left subtree\n    current := node\n    for current.Parent != nil && current == current.Parent.Right {\n        current = current.Parent\n    }\n    return current.Parent\n}",
    "lineMap": {
      "init": [
        1
      ],
      "check_right": [
        4
      ],
      "go_right": [
        5
      ],
      "check_left": [
        6
      ],
      "go_left": [
        7
      ],
      "complete_subtree": [
        9
      ],
      "start_climb": [
        14
      ],
      "check_parent": [
        15
      ],
      "walk_up": [
        16
      ],
      "complete_ancestor": [
        18
      ]
    },
    "conditionalMap": {
      "has_right": [
        4
      ],
      "has_left": [
        6
      ],
      "is_right_child": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public Node InorderSuccessor(Node node) {\n        // Case 1: Node has a right subtree\n        // Successor is the leftmost node in the right subtree\n        if (node.right != null) {\n            Node current = node.right;\n            while (current.left != null) {\n                current = current.left;\n            }\n            return current;\n        }\n\n        // Case 2: No right subtree\n        // Walk up until we find an ancestor where node is in its left subtree\n        Node current2 = node;\n        while (current2.parent != null && current2 == current2.parent.right) {\n            current2 = current2.parent;\n        }\n        return current2.parent;\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "check_right": [
        5
      ],
      "go_right": [
        6
      ],
      "check_left": [
        7
      ],
      "go_left": [
        8
      ],
      "complete_subtree": [
        10
      ],
      "start_climb": [
        15
      ],
      "check_parent": [
        16
      ],
      "walk_up": [
        17
      ],
      "complete_ancestor": [
        19
      ]
    },
    "conditionalMap": {
      "has_right": [
        5
      ],
      "has_left": [
        7
      ],
      "is_right_child": [
        16
      ]
    }
  }
};

const InorderSuccessorInBstIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Has right subtree (successor = 6)",
    "value": {
      "tree": [
        5,
        3,
        7,
        2,
        4,
        6,
        8
      ],
      "nodeValue": 5
    }
  },
  {
    "id": "ex2",
    "label": "Walk up to parent (successor = 5)",
    "value": {
      "tree": [
        5,
        3,
        7,
        2,
        4,
        6,
        8
      ],
      "nodeValue": 4
    }
  },
  {
    "id": "ex3",
    "label": "No successor (rightmost node)",
    "value": {
      "tree": [
        5,
        3,
        7,
        2,
        4,
        6,
        8
      ],
      "nodeValue": 8
    }
  }
];

function generateInorderSuccessorInBstIiSteps(e: any): any[] {
  
let t=(0,n.createInorderSuccessorIIScene)(e),{recorder:r,nodeMap:o,nodeValue:l,targetIdx:i,leftOf:a,rightOf:s,parentOf:c}=t,{setState:d,pointAt:u,clearPointers:h,setInorder:p,setCaseLabel:g}=t;if(p([],-1),0===o.size||null===i)return r.record("complete_not_found","Node not found in tree, return null"),r.getSteps();g("Step 1: climb to the root");let f=i;for(u("root",f),r.record("init",`root = node (${l})`);;){let e=c(f);if(r.set_conditionals([{key:"has_parent",result:null!==e}]),r.record("climb_check",null===e?`${o.get(f).value} has no parent, it is the root`:`${o.get(f).value} has a parent, keep climbing`),null===e)break;d(f,n.NODE_STATE.visited),d(f=e,n.NODE_STATE.current),u("root",f),r.record("climb",`root = ${o.get(f).value}`)}u("root",null),g("Step 2: collect the inorder sequence");let _=[],m=[];o.forEach((e,t)=>d(t,n.NODE_STATE.untouched)),r.record("collect_init","inorder = []"),r.record("collect","Walk the whole tree in-order");let v=e=>{if(null===e){r.set_conditionals([{key:"is_null",result:!0}]),r.record("inorder_null","Null node, return");return}let t=o.get(e).value;u("current",e),r.set_conditionals([{key:"is_null",result:!1}]),r.record("inorder_left",`Recurse into the left subtree of ${t}`),v(a(e)),_.push(e),m.push(t),p([...m],-1),d(e,n.NODE_STATE.visited),u("current",e),r.record("inorder_visit",`Append ${t} to inorder`),r.record("inorder_right",`Recurse into the right subtree of ${t}`),v(s(e))};v(f),u("current",null),g("Step 3: scan for the given node");for(let e=0;e<_.length-1;e++){let t=_[e];p([...m],e),d(t,n.NODE_STATE.current),u("current",t),r.record("scan",`i = ${e}, inorder[${e}] = ${m[e]}`);let a=t===i;if(r.set_conditionals([{key:"is_node",result:a}]),a){let i=_[e+1];return d(t,n.NODE_STATE.target),d(i,n.NODE_STATE.successor),p([...m],e+1),u("current",null),u("successor",i),r.record("found",`inorder[${e}] is the given node, take inorder[${e+1}]`),r.record("complete_found",`Inorder successor of ${l} is ${o.get(i).value}`),r.getSteps()}d(t,n.NODE_STATE.visited),r.record("check_node",`inorder[${e}] is not the given node, keep scanning`)}return p([...m],-1),h(),r.record("complete_not_found",`${l} is the last node in order, no successor`),r.getSteps()
}

export function InorderSuccessorInBstIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InorderSuccessorInBstIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateInorderSuccessorInBstIiSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Inorder Successor in BST II"
      slug="inorder-successor-in-bst-ii"
      approaches={approaches}
      presets={InorderSuccessorInBstIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Insert into BST (insert-bst)
// ==========================================

const InsertBstTemplates = {
  "python": {
    "language": "python",
    "code": "def insertIntoBST(root, val):\n    if root is None:\n        return TreeNode(val)\n\n    current = root\n\n    while True:\n        if val < current.val:\n            if current.left is None:\n                current.left = TreeNode(val)\n                break\n            current = current.left\n        else:\n            if current.right is None:\n                current.right = TreeNode(val)\n                break\n            current = current.right\n\n    return root",
    "lineMap": {
      "init": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "visit_node": [
        7
      ],
      "go_left": [
        12
      ],
      "found_position": [
        9
      ],
      "insert_node": [
        10,
        11
      ],
      "go_right": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "visit_node": [
        7
      ],
      "go_left_condition": [
        8
      ],
      "found_left_null": [
        9
      ],
      "found_right_null": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public TreeNode insertIntoBST(TreeNode root, int val) {\n    if (root == null) {\n        return new TreeNode(val);\n    }\n\n    TreeNode current = root;\n\n    while (true) {\n        if (val < current.val) {\n            if (current.left == null) {\n                current.left = new TreeNode(val);\n                break;\n            }\n            current = current.left;\n        } else {\n            if (current.right == null) {\n                current.right = new TreeNode(val);\n                break;\n            }\n            current = current.right;\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "visit_node": [
        8
      ],
      "go_left": [
        14
      ],
      "found_position": [
        10
      ],
      "insert_node": [
        11,
        12
      ],
      "go_right": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "visit_node": [
        8
      ],
      "go_left_condition": [
        9
      ],
      "found_left_null": [
        10
      ],
      "found_right_null": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "TreeNode* insertIntoBST(TreeNode* root, int val) {\n    if (root == nullptr) {\n        return new TreeNode(val);\n    }\n\n    TreeNode* current = root;\n\n    while (true) {\n        if (val < current->val) {\n            if (current->left == nullptr) {\n                current->left = new TreeNode(val);\n                break;\n            }\n            current = current->left;\n        } else {\n            if (current->right == nullptr) {\n                current->right = new TreeNode(val);\n                break;\n            }\n            current = current->right;\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "visit_node": [
        8
      ],
      "go_left": [
        14
      ],
      "found_position": [
        10
      ],
      "insert_node": [
        11,
        12
      ],
      "go_right": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "visit_node": [
        8
      ],
      "go_left_condition": [
        9
      ],
      "found_left_null": [
        10
      ],
      "found_right_null": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function insertIntoBST(root, val) {\n    if (root === null) {\n        return new TreeNode(val);\n    }\n\n    let current = root;\n\n    while (true) {\n        if (val < current.val) {\n            if (current.left === null) {\n                current.left = new TreeNode(val);\n                break;\n            }\n            current = current.left;\n        } else {\n            if (current.right === null) {\n                current.right = new TreeNode(val);\n                break;\n            }\n            current = current.right;\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "visit_node": [
        8
      ],
      "go_left": [
        14
      ],
      "found_position": [
        10
      ],
      "insert_node": [
        11,
        12
      ],
      "go_right": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "visit_node": [
        8
      ],
      "go_left_condition": [
        9
      ],
      "found_left_null": [
        10
      ],
      "found_right_null": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function insertIntoBST(root: TreeNode | null, val: number): TreeNode {\n    if (root === null) {\n        return new TreeNode(val);\n    }\n\n    let current: TreeNode = root;\n\n    while (true) {\n        if (val < current.val) {\n            if (current.left === null) {\n                current.left = new TreeNode(val);\n                break;\n            }\n            current = current.left;\n        } else {\n            if (current.right === null) {\n                current.right = new TreeNode(val);\n                break;\n            }\n            current = current.right;\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "visit_node": [
        8
      ],
      "go_left": [
        14
      ],
      "found_position": [
        10
      ],
      "insert_node": [
        11,
        12
      ],
      "go_right": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "visit_node": [
        8
      ],
      "go_left_condition": [
        9
      ],
      "found_left_null": [
        10
      ],
      "found_right_null": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func insertIntoBST(root *TreeNode, val int) *TreeNode {\n    if root == nil {\n        return &TreeNode{Val: val}\n    }\n\n    current := root\n\n    for {\n        if val < current.Val {\n            if current.Left == nil {\n                current.Left = &TreeNode{Val: val}\n                break\n            }\n            current = current.Left\n        } else {\n            if current.Right == nil {\n                current.Right = &TreeNode{Val: val}\n                break\n            }\n            current = current.Right\n        }\n    }\n\n    return root\n}",
    "lineMap": {
      "init": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "visit_node": [
        8
      ],
      "go_left": [
        14
      ],
      "found_position": [
        10
      ],
      "insert_node": [
        11,
        12
      ],
      "go_right": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "visit_node": [
        8
      ],
      "go_left_condition": [
        9
      ],
      "found_left_null": [
        10
      ],
      "found_right_null": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public TreeNode InsertIntoBST(TreeNode root, int val) {\n    if (root == null) {\n        return new TreeNode(val);\n    }\n\n    TreeNode current = root;\n\n    while (true) {\n        if (val < current.val) {\n            if (current.left == null) {\n                current.left = new TreeNode(val);\n                break;\n            }\n            current = current.left;\n        } else {\n            if (current.right == null) {\n                current.right = new TreeNode(val);\n                break;\n            }\n            current = current.right;\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "visit_node": [
        8
      ],
      "go_left": [
        14
      ],
      "found_position": [
        10
      ],
      "insert_node": [
        11,
        12
      ],
      "go_right": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "visit_node": [
        8
      ],
      "go_left_condition": [
        9
      ],
      "found_left_null": [
        10
      ],
      "found_right_null": [
        16
      ]
    }
  }
};

const InsertBstPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Insert 5 (Right subtree)",
    "value": {
      "treeNodes": [
        4,
        2,
        7,
        1,
        3
      ],
      "value": 5
    }
  },
  {
    "id": "ex2",
    "label": "Insert 25 (Balanced tree)",
    "value": {
      "treeNodes": [
        40,
        20,
        60,
        10,
        30,
        50,
        70
      ],
      "value": 25
    }
  }
];

function generateInsertBstSteps(e: any): any[] {
  
let{treeNodes:t,value:r}=e,i=(0,_treeHelper848569.Gu)(t),o=new Map;for(let e=0;e<i.length;e++)if(null!==i[e]&&(o.set(e,{value:i[e],index:e}),e>0)){let t=Math.floor((e-1)/2);o.has(t)&&(o.get(e).parent=t,o.get(e).isLeftChild=e%2==1)}let a={};o.forEach((e,t)=>{a[`node_${t}`]={type:"binaryTreeNode",value:e.value,parent:void 0!==e.parent?`node_${e.parent}`:void 0,isLeftChild:e.isLeftChild,state:"standard"}});let u=new StepRecorder({value:r},{...a}),{updateNodeState:s}=(0,_treeHelper848569.E4)(o,u);if(u.record("init",`Start: Insert ${r} into BST`),!o.has(0))return u.add_new_visual("node_0",{type:"binaryTreeNode",value:r,parent:void 0,isLeftChild:void 0,state:"highlight"}),u.record("empty_tree",`Tree is empty, insert ${r} as root`),u.record("complete",`Insert complete: ${r} is now the root`),u.getSteps();let d=0,c=null,f=!0;for(;o.has(d);){let e=o.get(d).value;if(s(d,"visiting"),u.update_visual("ptr_curr",{type:"treeNodePointer",nodeKey:`node_${d}`,label:"curr",labelPosition:"top"}),u.add_conditional("visit_node",!0),u.record("visit_node",`Visiting node ${e}`),r<e){c=d,f=!0;let t=2*d+1;if(u.add_conditional("go_left_condition",!0),!o.has(t)){s(d,"visited"),u.add_conditional("found_left_null",!0),u.record("found_position",`${r} < ${e}, current.left is null, insert here`),d=t;break}s(d,"visited"),d=t,u.update_visual("ptr_curr",{type:"treeNodePointer",nodeKey:`node_${d}`,label:"curr",labelPosition:"top"}),u.add_conditional("found_left_null",!1),u.record("go_left",`${r} < ${e}, go to left child`)}else{c=d,f=!1;let t=2*d+2;if(u.add_conditional("go_left_condition",!1),!o.has(t)){s(d,"visited"),u.add_conditional("found_right_null",!0),u.record("found_position",`${r} >= ${e}, current.right is null, insert here`),d=t;break}s(d,"visited"),d=t,u.update_visual("ptr_curr",{type:"treeNodePointer",nodeKey:`node_${d}`,label:"curr",labelPosition:"top"}),u.add_conditional("found_right_null",!1),u.record("go_right",`${r} >= ${e}, go to right child`)}}let h=d;return null!==c&&o.get(c).value,u.add_new_visual(`node_${h}`,{type:"binaryTreeNode",value:r,parent:null!==c?`node_${c}`:void 0,isLeftChild:f,state:"highlight"}),u.record("insert_node",`Inserted new node with value ${r}`),u.delete_visual("ptr_curr"),u.record("complete",`Insert complete: ${r} added to the tree`),u.getSteps()
}

export function InsertBstProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InsertBstTemplates,
      generateSteps: (e: any) => {
        const recorded = generateInsertBstSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Insert into BST"
      slug="insert-bst"
      approaches={approaches}
      presets={InsertBstPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Insert into a Binary Search Tree (insert-into-a-binary-search-tree)
// ==========================================

const InsertIntoABinarySearchTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def insertIntoBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:\n        new_node = TreeNode(val)\n        # Empty tree case\n        if not root:\n            return new_node\n\n        current = root\n        while current:\n            if val < current.val:\n                # Insert as left child if spot is empty\n                if not current.left:\n                    current.left = new_node\n                    return root\n                current = current.left\n            else:\n                # Insert as right child if spot is empty\n                if not current.right:\n                    current.right = new_node\n                    return root\n                current = current.right\n        return root",
    "lineMap": {
      "init": [
        3
      ],
      "empty_tree": [
        5,
        6
      ],
      "start": [
        8
      ],
      "visit": [
        9
      ],
      "compare": [
        10
      ],
      "check_left": [
        12
      ],
      "insert_left": [
        13,
        14
      ],
      "go_left": [
        15
      ],
      "check_right": [
        18
      ],
      "insert_right": [
        19,
        20
      ],
      "go_right": [
        21
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_empty": [
        5
      ],
      "has_current": [
        9
      ],
      "less": [
        10
      ],
      "left_null": [
        12
      ],
      "right_null": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode insertIntoBST(TreeNode root, int val) {\n        TreeNode newNode = new TreeNode(val);\n        // Empty tree case\n        if (root == null) return newNode;\n\n        TreeNode current = root;\n        while (current != null) {\n            if (val < current.val) {\n                // Insert as left child if spot is empty\n                if (current.left == null) {\n                    current.left = newNode;\n                    return root;\n                }\n                current = current.left;\n            } else {\n                // Insert as right child if spot is empty\n                if (current.right == null) {\n                    current.right = newNode;\n                    return root;\n                }\n                current = current.right;\n            }\n        }\n        return root;\n    }\n}",
    "lineMap": {
      "init": [
        3
      ],
      "empty_tree": [
        5
      ],
      "start": [
        7
      ],
      "visit": [
        8
      ],
      "compare": [
        9
      ],
      "check_left": [
        11
      ],
      "insert_left": [
        12,
        13
      ],
      "go_left": [
        15
      ],
      "check_right": [
        18
      ],
      "insert_right": [
        19,
        20
      ],
      "go_right": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_empty": [
        5
      ],
      "has_current": [
        8
      ],
      "less": [
        9
      ],
      "left_null": [
        11
      ],
      "right_null": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* insertIntoBST(TreeNode* root, int val) {\n        TreeNode* newNode = new TreeNode(val);\n        // Empty tree case\n        if (root == nullptr) return newNode;\n\n        TreeNode* current = root;\n        while (current != nullptr) {\n            if (val < current->val) {\n                // Insert as left child if spot is empty\n                if (current->left == nullptr) {\n                    current->left = newNode;\n                    return root;\n                }\n                current = current->left;\n            } else {\n                // Insert as right child if spot is empty\n                if (current->right == nullptr) {\n                    current->right = newNode;\n                    return root;\n                }\n                current = current->right;\n            }\n        }\n        return root;\n    }\n};",
    "lineMap": {
      "init": [
        4
      ],
      "empty_tree": [
        6
      ],
      "start": [
        8
      ],
      "visit": [
        9
      ],
      "compare": [
        10
      ],
      "check_left": [
        12
      ],
      "insert_left": [
        13,
        14
      ],
      "go_left": [
        16
      ],
      "check_right": [
        19
      ],
      "insert_right": [
        20,
        21
      ],
      "go_right": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_empty": [
        6
      ],
      "has_current": [
        9
      ],
      "less": [
        10
      ],
      "left_null": [
        12
      ],
      "right_null": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var insertIntoBST = function (root, val) {\n  var newNode = new TreeNode(val);\n  // Empty tree case\n  if (root === null) return newNode;\n\n  var current = root;\n  while (current !== null) {\n    if (val < current.val) {\n      // Insert as left child if spot is empty\n      if (current.left === null) {\n        current.left = newNode;\n        return root;\n      }\n      current = current.left;\n    } else {\n      // Insert as right child if spot is empty\n      if (current.right === null) {\n        current.right = newNode;\n        return root;\n      }\n      current = current.right;\n    }\n  }\n  return root;\n};",
    "lineMap": {
      "init": [
        2
      ],
      "empty_tree": [
        4
      ],
      "start": [
        6
      ],
      "visit": [
        7
      ],
      "compare": [
        8
      ],
      "check_left": [
        10
      ],
      "insert_left": [
        11,
        12
      ],
      "go_left": [
        14
      ],
      "check_right": [
        17
      ],
      "insert_right": [
        18,
        19
      ],
      "go_right": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_empty": [
        4
      ],
      "has_current": [
        7
      ],
      "less": [
        8
      ],
      "left_null": [
        10
      ],
      "right_null": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {\n    const newNode = new TreeNode(val);\n    // Empty tree case\n    if (root === null) return newNode;\n\n    let current = root;\n    while (current !== null) {\n        if (val < current.val) {\n            // Insert as left child if spot is empty\n            if (current.left === null) {\n                current.left = newNode;\n                return root;\n            }\n            current = current.left;\n        } else {\n            // Insert as right child if spot is empty\n            if (current.right === null) {\n                current.right = newNode;\n                return root;\n            }\n            current = current.right;\n        }\n    }\n    return root;\n}",
    "lineMap": {
      "init": [
        2
      ],
      "empty_tree": [
        4
      ],
      "start": [
        6
      ],
      "visit": [
        7
      ],
      "compare": [
        8
      ],
      "check_left": [
        10
      ],
      "insert_left": [
        11,
        12
      ],
      "go_left": [
        14
      ],
      "check_right": [
        17
      ],
      "insert_right": [
        18,
        19
      ],
      "go_right": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_empty": [
        4
      ],
      "has_current": [
        7
      ],
      "less": [
        8
      ],
      "left_null": [
        10
      ],
      "right_null": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func insertIntoBST(root *TreeNode, val int) *TreeNode {\n    newNode := &TreeNode{Val: val}\n    // Empty tree case\n    if root == nil {\n        return newNode\n    }\n\n    current := root\n    for current != nil {\n        if val < current.Val {\n            // Insert as left child if spot is empty\n            if current.Left == nil {\n                current.Left = newNode\n                return root\n            }\n            current = current.Left\n        } else {\n            // Insert as right child if spot is empty\n            if current.Right == nil {\n                current.Right = newNode\n                return root\n            }\n            current = current.Right\n        }\n    }\n    return root\n}",
    "lineMap": {
      "init": [
        2
      ],
      "empty_tree": [
        4,
        5
      ],
      "start": [
        8
      ],
      "visit": [
        9
      ],
      "compare": [
        10
      ],
      "check_left": [
        12
      ],
      "insert_left": [
        13,
        14
      ],
      "go_left": [
        16
      ],
      "check_right": [
        19
      ],
      "insert_right": [
        20,
        21
      ],
      "go_right": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_empty": [
        4
      ],
      "has_current": [
        9
      ],
      "less": [
        10
      ],
      "left_null": [
        12
      ],
      "right_null": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode InsertIntoBST(TreeNode root, int val) {\n        TreeNode newNode = new TreeNode(val);\n        // Empty tree case\n        if (root == null) return newNode;\n\n        TreeNode current = root;\n        while (current != null) {\n            if (val < current.val) {\n                // Insert as left child if spot is empty\n                if (current.left == null) {\n                    current.left = newNode;\n                    return root;\n                }\n                current = current.left;\n            } else {\n                // Insert as right child if spot is empty\n                if (current.right == null) {\n                    current.right = newNode;\n                    return root;\n                }\n                current = current.right;\n            }\n        }\n        return root;\n    }\n}",
    "lineMap": {
      "init": [
        3
      ],
      "empty_tree": [
        5
      ],
      "start": [
        7
      ],
      "visit": [
        8
      ],
      "compare": [
        9
      ],
      "check_left": [
        11
      ],
      "insert_left": [
        12,
        13
      ],
      "go_left": [
        15
      ],
      "check_right": [
        18
      ],
      "insert_right": [
        19,
        20
      ],
      "go_right": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_empty": [
        5
      ],
      "has_current": [
        8
      ],
      "less": [
        9
      ],
      "left_null": [
        11
      ],
      "right_null": [
        18
      ]
    }
  }
};

const InsertIntoABinarySearchTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "tree": [
        4,
        2,
        7,
        1,
        3
      ],
      "val": 5
    }
  },
  {
    "id": "ex2",
    "label": "Insert left",
    "value": {
      "tree": [
        8,
        4,
        12,
        2,
        6
      ],
      "val": 1
    }
  },
  {
    "id": "ex3",
    "label": "Larger tree",
    "value": {
      "tree": [
        40,
        20,
        60,
        10,
        30,
        50,
        70
      ],
      "val": 25
    }
  }
];

function generateInsertIntoABinarySearchTreeSteps(e: any): any[] {
  
let t=(0,n.createInsertIntoBSTScene)(e),{recorder:r,val:l,setState:i,syncTree:o,pointAt:a,setPending:s}=t,{pushFrame:u,popFrame:c,clearFrames:d}=t;r.record("init",`Insert ${l} into the BST`);let h=e=>{if(!e){u(null),a(null);let e=t.createNode();return s(l),r.set_conditionals([{key:"is_null",result:!0}]),r.record("create_node",`Reached a null spot, create the node holding ${l}`),c(),e}u(e.value),i(e,n.NODE_STATE.current),a(e),r.set_conditionals([{key:"is_null",result:!1}]),r.record("call",`insertIntoBST(${e.value})`);let d=l<e.value;i(e,n.NODE_STATE.onPath),r.set_conditionals([{key:"less",result:d}]),r.record(d?"go_left":"go_right",d?`${l} < ${e.value}, so it belongs in the left subtree`:`${l} >= ${e.value}, so it belongs in the right subtree`);let g=h(d?e.left:e.right);d?e.left=g:e.right=g;let f=g===t.getInserted();return f&&(i(g,n.NODE_STATE.entering),s(null)),o(),a(e),r.record(d?"set_left":"set_right",`${e.value}.${d?"left":"right"} = ${g.value}`),f&&i(g,n.NODE_STATE.inserted),r.record("return_node",`Return ${e.value} to the caller`),c(),e};return t.setRoot(h(t.getRoot())),i(t.getInserted(),n.NODE_STATE.inserted),s(null),o(),d(),a(null),r.record("complete",`Insertion complete. ${l} is now in the tree`),r.getSteps()
}

export function InsertIntoABinarySearchTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InsertIntoABinarySearchTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateInsertIntoABinarySearchTreeSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Insert into a Binary Search Tree"
      slug="insert-into-a-binary-search-tree"
      approaches={approaches}
      presets={InsertIntoABinarySearchTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Largest BST Subtree (largest-bst-subtree)
// ==========================================

const LargestBstSubtreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def largestBSTSubtree(self, root: Optional[TreeNode]) -> int:\n        self.max_size = 0\n\n        def post_order(node):\n            if not node:\n                # size=0, min=+inf, max=-inf (inverted so any value passes)\n                return (0, float('inf'), float('-inf'))\n\n            left_size, left_min, left_max = post_order(node.left)\n            right_size, right_min, right_max = post_order(node.right)\n\n            # Check if both subtrees are valid BSTs and ranges work\n            if (left_size != -1 and right_size != -1\n                    and left_max < node.val and right_min > node.val):\n                size = left_size + right_size + 1\n                self.max_size = max(self.max_size, size)\n                min_val = min(left_min, node.val)\n                max_val = max(right_max, node.val)\n                return (size, min_val, max_val)\n\n            # Not a valid BST -- update max_size from children\n            self.max_size = max(self.max_size, left_size, right_size)\n            return (-1, 0, 0)\n\n        post_order(root)\n        return self.max_size",
    "lineMap": {
      "init": [
        3
      ],
      "traverse": [
        26
      ],
      "base_case": [
        6,
        8
      ],
      "call": [
        6
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "check_valid": [
        14,
        15
      ],
      "valid_bst": [
        16,
        17
      ],
      "return_valid": [
        18,
        20
      ],
      "not_valid": [
        23,
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "is_valid": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int maxSize = 0;\n\n    public int largestBSTSubtree(TreeNode root) {\n        maxSize = 0;\n        postOrder(root);\n        return maxSize;\n    }\n\n    // Returns int[]{size, min, max}\n    // size = -1 means not a valid BST\n    private int[] postOrder(TreeNode node) {\n        if (node == null) {\n            return new int[]{0, Integer.MAX_VALUE, Integer.MIN_VALUE};\n        }\n\n        int[] left = postOrder(node.left);\n        int[] right = postOrder(node.right);\n\n        // Check if both subtrees are valid BSTs and ranges are compatible\n        if (left[0] != -1 && right[0] != -1\n                && left[2] < node.val && right[1] > node.val) {\n            int size = left[0] + right[0] + 1;\n            maxSize = Math.max(maxSize, size);\n            int minVal = Math.min(left[1], node.val);\n            int maxVal = Math.max(right[2], node.val);\n            return new int[]{size, minVal, maxVal};\n        }\n\n        // Not a valid BST -- update maxSize from children\n        maxSize = Math.max(maxSize, Math.max(left[0], right[0]));\n        return new int[]{-1, 0, 0};\n    }\n}",
    "lineMap": {
      "init": [
        5
      ],
      "traverse": [
        6
      ],
      "base_case": [
        13,
        14
      ],
      "call": [
        13
      ],
      "recurse_left": [
        17
      ],
      "recurse_right": [
        18
      ],
      "check_valid": [
        21,
        22
      ],
      "valid_bst": [
        23,
        24
      ],
      "return_valid": [
        25,
        27
      ],
      "not_valid": [
        31,
        32
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        13
      ],
      "is_valid": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maxSize = 0;\n\n    int largestBSTSubtree(TreeNode* root) {\n        maxSize = 0;\n        postOrder(root);\n        return maxSize;\n    }\n\n    // Returns {size, min, max}; size = -1 means not a valid BST\n    tuple<int, int, int> postOrder(TreeNode* node) {\n        if (!node) {\n            return {0, INT_MAX, INT_MIN};\n        }\n\n        auto [leftSize, leftMin, leftMax] = postOrder(node->left);\n        auto [rightSize, rightMin, rightMax] = postOrder(node->right);\n\n        // Check if both subtrees are valid BSTs and ranges work\n        if (leftSize != -1 && rightSize != -1\n                && leftMax < node->val && rightMin > node->val) {\n            int size = leftSize + rightSize + 1;\n            maxSize = max(maxSize, size);\n            int minVal = min(leftMin, node->val);\n            int maxVal = max(rightMax, node->val);\n            return {size, minVal, maxVal};\n        }\n\n        // Not a valid BST -- update maxSize from children\n        maxSize = max({maxSize, leftSize, rightSize});\n        return {-1, 0, 0};\n    }\n};",
    "lineMap": {
      "init": [
        6
      ],
      "traverse": [
        7
      ],
      "base_case": [
        13,
        14
      ],
      "call": [
        13
      ],
      "recurse_left": [
        17
      ],
      "recurse_right": [
        18
      ],
      "check_valid": [
        21,
        22
      ],
      "valid_bst": [
        23,
        24
      ],
      "return_valid": [
        25,
        27
      ],
      "not_valid": [
        31,
        32
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "is_null": [
        13
      ],
      "is_valid": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var largestBSTSubtree = function(root) {\n    let maxSize = 0;\n\n    // Returns [size, min, max]; size = -1 means not a valid BST\n    function postOrder(node) {\n        if (!node) {\n            return [0, Infinity, -Infinity];\n        }\n\n        let [leftSize, leftMin, leftMax] = postOrder(node.left);\n        let [rightSize, rightMin, rightMax] = postOrder(node.right);\n\n        // Check if both subtrees are valid BSTs and ranges work\n        if (leftSize !== -1 && rightSize !== -1\n                && leftMax < node.val && rightMin > node.val) {\n            let size = leftSize + rightSize + 1;\n            maxSize = Math.max(maxSize, size);\n            let minVal = Math.min(leftMin, node.val);\n            let maxVal = Math.max(rightMax, node.val);\n            return [size, minVal, maxVal];\n        }\n\n        // Not a valid BST -- update maxSize from children\n        maxSize = Math.max(maxSize, leftSize, rightSize);\n        return [-1, 0, 0];\n    }\n\n    postOrder(root);\n    return maxSize;\n};",
    "lineMap": {
      "init": [
        2
      ],
      "traverse": [
        28
      ],
      "base_case": [
        6,
        7
      ],
      "call": [
        6
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "check_valid": [
        14,
        15
      ],
      "valid_bst": [
        16,
        17
      ],
      "return_valid": [
        18,
        20
      ],
      "not_valid": [
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "is_valid": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function largestBSTSubtree(root: TreeNode | null): number {\n    let maxSize = 0;\n\n    // Returns [size, min, max]; size = -1 means not a valid BST\n    function postOrder(node: TreeNode | null): [number, number, number] {\n        if (!node) {\n            return [0, Infinity, -Infinity];\n        }\n\n        let [leftSize, leftMin, leftMax] = postOrder(node.left);\n        let [rightSize, rightMin, rightMax] = postOrder(node.right);\n\n        // Check if both subtrees are valid BSTs and ranges work\n        if (leftSize !== -1 && rightSize !== -1\n                && leftMax < node.val && rightMin > node.val) {\n            let size = leftSize + rightSize + 1;\n            maxSize = Math.max(maxSize, size);\n            let minVal = Math.min(leftMin, node.val);\n            let maxVal = Math.max(rightMax, node.val);\n            return [size, minVal, maxVal];\n        }\n\n        // Not a valid BST -- update maxSize from children\n        maxSize = Math.max(maxSize, leftSize, rightSize);\n        return [-1, 0, 0];\n    }\n\n    postOrder(root);\n    return maxSize;\n}",
    "lineMap": {
      "init": [
        2
      ],
      "traverse": [
        28
      ],
      "base_case": [
        6,
        7
      ],
      "call": [
        6
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "check_valid": [
        14,
        15
      ],
      "valid_bst": [
        16,
        17
      ],
      "return_valid": [
        18,
        20
      ],
      "not_valid": [
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "is_valid": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func largestBSTSubtree(root *TreeNode) int {\n    maxSize := 0\n\n    // Returns (size, min, max); size = -1 means not a valid BST\n    var postOrder func(node *TreeNode) (int, int, int)\n    postOrder = func(node *TreeNode) (int, int, int) {\n        if node == nil {\n            return 0, math.MaxInt32, math.MinInt32\n        }\n\n        leftSize, leftMin, leftMax := postOrder(node.Left)\n        rightSize, rightMin, rightMax := postOrder(node.Right)\n\n        // Check if both subtrees are valid BSTs and ranges work\n        if leftSize != -1 && rightSize != -1 &&\n            leftMax < node.Val && rightMin > node.Val {\n            size := leftSize + rightSize + 1\n            if size > maxSize {\n                maxSize = size\n            }\n            minVal := min(leftMin, node.Val)\n            maxVal := max(rightMax, node.Val)\n            return size, minVal, maxVal\n        }\n\n        // Not a valid BST -- update maxSize from children\n        if leftSize > maxSize {\n            maxSize = leftSize\n        }\n        if rightSize > maxSize {\n            maxSize = rightSize\n        }\n        return -1, 0, 0\n    }\n\n    postOrder(root)\n    return maxSize\n}",
    "lineMap": {
      "init": [
        2
      ],
      "traverse": [
        36
      ],
      "base_case": [
        7,
        8
      ],
      "call": [
        7
      ],
      "recurse_left": [
        11
      ],
      "recurse_right": [
        12
      ],
      "check_valid": [
        15,
        16
      ],
      "valid_bst": [
        17,
        20
      ],
      "return_valid": [
        21,
        23
      ],
      "not_valid": [
        27,
        33
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ],
      "is_valid": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int maxSize = 0;\n\n    public int LargestBSTSubtree(TreeNode root) {\n        maxSize = 0;\n        PostOrder(root);\n        return maxSize;\n    }\n\n    // Returns (size, min, max); size = -1 means not a valid BST\n    private (int size, int min, int max) PostOrder(TreeNode node) {\n        if (node == null) {\n            return (0, int.MaxValue, int.MinValue);\n        }\n\n        var left = PostOrder(node.left);\n        var right = PostOrder(node.right);\n\n        // Check if both subtrees are valid BSTs and ranges work\n        if (left.size != -1 && right.size != -1\n                && left.max < node.val && right.min > node.val) {\n            int size = left.size + right.size + 1;\n            maxSize = Math.Max(maxSize, size);\n            int minVal = Math.Min(left.min, node.val);\n            int maxVal = Math.Max(right.max, node.val);\n            return (size, minVal, maxVal);\n        }\n\n        // Not a valid BST -- update maxSize from children\n        maxSize = Math.Max(maxSize, Math.Max(left.size, right.size));\n        return (-1, 0, 0);\n    }\n}",
    "lineMap": {
      "init": [
        5
      ],
      "traverse": [
        6
      ],
      "base_case": [
        12,
        13
      ],
      "call": [
        12
      ],
      "recurse_left": [
        16
      ],
      "recurse_right": [
        17
      ],
      "check_valid": [
        20,
        21
      ],
      "valid_bst": [
        22,
        23
      ],
      "return_valid": [
        24,
        26
      ],
      "not_valid": [
        30,
        31
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        12
      ],
      "is_valid": [
        20
      ]
    }
  }
};

const LargestBstSubtreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (size 3)",
    "value": {
      "tree": [
        10,
        5,
        15,
        1,
        8,
        null,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Entire tree is BST",
    "value": {
      "tree": [
        5,
        3,
        7,
        1,
        4,
        6,
        8
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Complex",
    "value": {
      "tree": [
        4,
        2,
        7,
        2,
        3,
        5,
        null,
        2,
        null,
        null,
        null,
        null,
        null,
        1
      ]
    }
  }
];

function generateLargestBstSubtreeSteps(e: any): any[] {
  let n=e=>e===1/0?"+inf":e===-1/0?"-inf":String(e);
let t=(0,i.createLargestBSTSubtreeScene)(e,"postOrder"),{recorder:r,nodeMap:a,leftOf:l,rightOf:o,subtreeOf:s,setState:d}=t,{pointAt:u,setMaxSize:c,pushFrame:h,popFrame:g,clearFrames:f}=t,m=0,p=[];r.record("init","maxSize = 0"),r.record("traverse","Walk the tree post-order, gathering (size, min, max)");let x=e=>{if(null===e)return h(null),u(null),r.set_conditionals([{key:"is_null",result:!0}]),r.record("base_case","Null node, return (0, +inf, -inf)"),g(),[0,1/0,-1/0];let t=a.get(e).value;h(t),d(e,i.NODE_STATE.current),u(e),r.set_conditionals([{key:"is_null",result:!1}]),r.record("call",`postOrder(${t})`),r.record("recurse_left",`Recurse into the left subtree of ${t}`),d(e,i.NODE_STATE.untouched);let[f,v,S]=x(l(e));d(e,i.NODE_STATE.current),u(e),r.record("recurse_right",`Left returned (${f}, ${n(v)}, ${n(S)}), now recurse right`),d(e,i.NODE_STATE.untouched);let[_,b,T]=x(o(e));d(e,i.NODE_STATE.current),u(e);let z=-1!==f&&-1!==_&&S<t&&b>t;if(r.set_conditionals([{key:"is_valid",result:z}]),r.record("check_valid",`Right returned (${_}, ${n(b)}, ${n(T)}). leftMax ${n(S)} < ${t} and rightMin ${n(b)} > ${t}: ${z}`),z){let a=f+_+1;s(e).forEach(e=>d(e,i.NODE_STATE.validBST)),a>m&&(m=a,p=s(e),c(m)),r.record("valid_bst",`Valid BST of size ${a}, maxSize = ${m}`);let l=Math.min(v,t),o=Math.max(T,t);return r.record("return_valid",`Return (${a}, ${n(l)}, ${n(o)})`),g(),[a,l,o]}return d(e,i.NODE_STATE.invalid),c(m=Math.max(m,f,_)),r.record("not_valid",`Not a BST. maxSize stays ${m}, return (-1, 0, 0)`),g(),[-1,0,0]};return x(a.has(0)?0:null),f(),u(null),p.forEach(e=>d(e,i.NODE_STATE.largest)),c(m),r.record("complete",`Complete! Largest BST subtree has size ${m}`),r.getSteps()
}

export function LargestBstSubtreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LargestBstSubtreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLargestBstSubtreeSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Largest BST Subtree"
      slug="largest-bst-subtree"
      approaches={approaches}
      presets={LargestBstSubtreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Lowest Common Ancestor of a BST (lowest-common-ancestor-of-a-binary-search-tree)
// ==========================================

const LowestCommonAncestorOfABinarySearchTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        current = root\n\n        while current:\n            if p.val < current.val and q.val < current.val:\n                # Both values smaller: go left\n                current = current.left\n            elif p.val > current.val and q.val > current.val:\n                # Both values larger: go right\n                current = current.right\n            else:\n                # Split point: this is the LCA\n                return current\n\n        return None  # Should never reach here since p and q exist in the BST",
    "lineMap": {
      "init": [
        3
      ],
      "visit": [
        5
      ],
      "go_left": [
        6,
        8
      ],
      "go_right": [
        9,
        11
      ],
      "found_lca": [
        12,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "has_current": [
        5
      ],
      "both_left": [
        6
      ],
      "both_right": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        TreeNode current = root;\n\n        while (current != null) {\n            if (p.val < current.val && q.val < current.val) {\n                // Both values smaller: go left\n                current = current.left;\n            } else if (p.val > current.val && q.val > current.val) {\n                // Both values larger: go right\n                current = current.right;\n            } else {\n                // Split point: this is the LCA\n                return current;\n            }\n        }\n\n        return null; // Should never reach here since p and q exist in the BST\n    }\n}",
    "lineMap": {
      "init": [
        3
      ],
      "visit": [
        5
      ],
      "go_left": [
        6,
        8
      ],
      "go_right": [
        9,
        11
      ],
      "found_lca": [
        12,
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "has_current": [
        5
      ],
      "both_left": [
        6
      ],
      "both_right": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        TreeNode* current = root;\n\n        while (current != nullptr) {\n            if (p->val < current->val && q->val < current->val) {\n                // Both values smaller: go left\n                current = current->left;\n            } else if (p->val > current->val && q->val > current->val) {\n                // Both values larger: go right\n                current = current->right;\n            } else {\n                // Split point: this is the LCA\n                return current;\n            }\n        }\n\n        return nullptr; // Should never reach here since p and q exist in the BST\n    }\n};",
    "lineMap": {
      "init": [
        4
      ],
      "visit": [
        6
      ],
      "go_left": [
        7,
        9
      ],
      "go_right": [
        10,
        12
      ],
      "found_lca": [
        13,
        15
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "has_current": [
        6
      ],
      "both_left": [
        7
      ],
      "both_right": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var lowestCommonAncestor = function (root, p, q) {\n  let current = root;\n\n  while (current !== null) {\n    if (p.val < current.val && q.val < current.val) {\n      // Both values smaller: go left\n      current = current.left;\n    } else if (p.val > current.val && q.val > current.val) {\n      // Both values larger: go right\n      current = current.right;\n    } else {\n      // Split point: this is the LCA\n      return current;\n    }\n  }\n\n  return null; // Should never reach here since p and q exist in the BST\n};",
    "lineMap": {
      "init": [
        2
      ],
      "visit": [
        4
      ],
      "go_left": [
        5,
        7
      ],
      "go_right": [
        8,
        10
      ],
      "found_lca": [
        11,
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "has_current": [
        4
      ],
      "both_left": [
        5
      ],
      "both_right": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode): TreeNode {\n    let current: TreeNode | null = root;\n\n    while (current !== null) {\n        if (p.val < current.val && q.val < current.val) {\n            // Both values smaller: go left\n            current = current.left;\n        } else if (p.val > current.val && q.val > current.val) {\n            // Both values larger: go right\n            current = current.right;\n        } else {\n            // Split point: this is the LCA\n            return current;\n        }\n    }\n\n    return null as unknown as TreeNode; // Should never reach here since p and q exist in the BST\n}",
    "lineMap": {
      "init": [
        2
      ],
      "visit": [
        4
      ],
      "go_left": [
        5,
        7
      ],
      "go_right": [
        8,
        10
      ],
      "found_lca": [
        11,
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "has_current": [
        4
      ],
      "both_left": [
        5
      ],
      "both_right": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {\n    current := root\n\n    for current != nil {\n        if p.Val < current.Val && q.Val < current.Val {\n            // Both values smaller: go left\n            current = current.Left\n        } else if p.Val > current.Val && q.Val > current.Val {\n            // Both values larger: go right\n            current = current.Right\n        } else {\n            // Split point: this is the LCA\n            return current\n        }\n    }\n\n    return nil // Should never reach here since p and q exist in the BST\n}",
    "lineMap": {
      "init": [
        2
      ],
      "visit": [
        4
      ],
      "go_left": [
        5,
        7
      ],
      "go_right": [
        8,
        10
      ],
      "found_lca": [
        11,
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "has_current": [
        4
      ],
      "both_left": [
        5
      ],
      "both_right": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        TreeNode current = root;\n\n        while (current != null) {\n            if (p.val < current.val && q.val < current.val) {\n                // Both values smaller: go left\n                current = current.left;\n            } else if (p.val > current.val && q.val > current.val) {\n                // Both values larger: go right\n                current = current.right;\n            } else {\n                // Split point: this is the LCA\n                return current;\n            }\n        }\n\n        return null; // Should never reach here since p and q exist in the BST\n    }\n}",
    "lineMap": {
      "init": [
        3
      ],
      "visit": [
        5
      ],
      "go_left": [
        6,
        8
      ],
      "go_right": [
        9,
        11
      ],
      "found_lca": [
        12,
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "has_current": [
        5
      ],
      "both_left": [
        6
      ],
      "both_right": [
        9
      ]
    }
  }
};

const LowestCommonAncestorOfABinarySearchTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (LCA = 6)",
    "value": {
      "tree": [
        6,
        2,
        8,
        0,
        4,
        7,
        9,
        null,
        null,
        3,
        5
      ],
      "p": 2,
      "q": 8
    }
  },
  {
    "id": "ex2",
    "label": "Nested (LCA = 2)",
    "value": {
      "tree": [
        6,
        2,
        8,
        0,
        4,
        7,
        9,
        null,
        null,
        3,
        5
      ],
      "p": 2,
      "q": 4
    }
  },
  {
    "id": "ex3",
    "label": "Deep (LCA = 5)",
    "value": {
      "tree": [
        20,
        10,
        30,
        5,
        15,
        25,
        35,
        3,
        7
      ],
      "p": 3,
      "q": 7
    }
  }
];

function generateLowestCommonAncestorOfABinarySearchTreeSteps(e: any): any[] {
  
let t=(0,l.createLCAOfBSTScene)(e),{recorder:r,nodeMap:o,p:n,q:a,leftOf:i,rightOf:s}=t,{setState:c,pointAt:u,clearPointers:d}=t;if(0===o.size)return r.record("complete","Tree is empty, no LCA exists"),r.getSteps();let h=0;for(c(0,l.NODE_STATE.current),u("current",h),r.record("init",`current = root (${o.get(0).value}), p=${n}, q=${a}`);null!==h;){let e=o.get(h).value;r.set_conditionals([{key:"has_current",result:!0}]),r.record("visit",`current = ${e}`);let t=n<e&&a<e,d=n>e&&a>e;if(t){c(h,l.NODE_STATE.visited);let t=i(h);c(t,l.NODE_STATE.current),u("current",t),r.set_conditionals([{key:"both_left",result:!0}]),r.record("go_left",`${n} and ${a} are both < ${e}, go left`),h=t;continue}if(d){c(h,l.NODE_STATE.visited);let t=s(h);c(t,l.NODE_STATE.current),u("current",t),r.set_conditionals([{key:"both_left",result:!1},{key:"both_right",result:!0}]),r.record("go_right",`${n} and ${a} are both > ${e}, go right`),h=t;continue}return c(h,l.NODE_STATE.lca),u("current",null),u("lca",h),r.set_conditionals([{key:"both_left",result:!1},{key:"both_right",result:!1}]),r.record("found_lca",`${n} and ${a} split at ${e}, so it is the LCA`),r.record("complete",`Return LCA: ${e}`),r.getSteps()}return r.set_conditionals([{key:"has_current",result:!1}]),d(),r.record("complete","current is null, no LCA found"),r.getSteps()
}

export function LowestCommonAncestorOfABinarySearchTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LowestCommonAncestorOfABinarySearchTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLowestCommonAncestorOfABinarySearchTreeSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Lowest Common Ancestor of a BST"
      slug="lowest-common-ancestor-of-a-binary-search-tree"
      approaches={approaches}
      presets={LowestCommonAncestorOfABinarySearchTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Absolute Difference in BST (minimum-absolute-difference-in-bst)
// ==========================================

const MinimumAbsoluteDifferenceInBstTemplates = {
  "python": {
    "language": "python",
    "code": "def getMinimumDifference(root):\n    prev = None\n    min_diff = float('inf')\n\n    def inorder(node):\n        nonlocal prev, min_diff\n        if node is None:\n            return\n        inorder(node.left)\n        if prev is not None:\n            min_diff = min(min_diff, node.val - prev)\n        prev = node.val\n        inorder(node.right)\n\n    inorder(root)\n    return min_diff",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "start_validation": [
        15
      ],
      "visit_node": [
        5
      ],
      "base_case_null": [
        7,
        8
      ],
      "recurse_left": [
        9
      ],
      "first_node": [
        10
      ],
      "calculate_diff": [
        10,
        11
      ],
      "update_min": [
        11
      ],
      "no_update": [
        11
      ],
      "update_prev": [
        12
      ],
      "recurse_right": [
        13
      ],
      "return": [
        5
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ],
      "has_prev": [
        10
      ],
      "is_smaller": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "private TreeNode prev = null;\nprivate int minDiff = Integer.MAX_VALUE;\n\npublic int getMinimumDifference(TreeNode root) {\n    inorder(root);\n    return minDiff;\n}\n\nprivate void inorder(TreeNode node) {\n    if (node == null) {\n        return;\n    }\n    inorder(node.left);\n    if (prev != null) {\n        minDiff = Math.min(minDiff, node.val - prev.val);\n    }\n    prev = node;\n    inorder(node.right);\n}",
    "lineMap": {
      "init": [
        1,
        2
      ],
      "start_validation": [
        5
      ],
      "visit_node": [
        9
      ],
      "base_case_null": [
        10,
        11
      ],
      "recurse_left": [
        13
      ],
      "first_node": [
        14
      ],
      "calculate_diff": [
        14,
        15
      ],
      "update_min": [
        15
      ],
      "no_update": [
        15
      ],
      "update_prev": [
        17
      ],
      "recurse_right": [
        18
      ],
      "return": [
        9
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ],
      "has_prev": [
        14
      ],
      "is_smaller": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "TreeNode* prev = nullptr;\nint minDiff = INT_MAX;\n\nvoid inorder(TreeNode* node) {\n    if (node == nullptr) {\n        return;\n    }\n    inorder(node->left);\n    if (prev != nullptr) {\n        minDiff = min(minDiff, node->val - prev->val);\n    }\n    prev = node;\n    inorder(node->right);\n}\n\nint getMinimumDifference(TreeNode* root) {\n    inorder(root);\n    return minDiff;\n}",
    "lineMap": {
      "init": [
        1,
        2
      ],
      "start_validation": [
        17
      ],
      "visit_node": [
        4
      ],
      "base_case_null": [
        5,
        6
      ],
      "recurse_left": [
        8
      ],
      "first_node": [
        9
      ],
      "calculate_diff": [
        9,
        10
      ],
      "update_min": [
        10
      ],
      "no_update": [
        10
      ],
      "update_prev": [
        12
      ],
      "recurse_right": [
        13
      ],
      "return": [
        4
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "has_prev": [
        9
      ],
      "is_smaller": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "private TreeNode prev = null;\nprivate int minDiff = int.MaxValue;\n\npublic int GetMinimumDifference(TreeNode root) {\n    Inorder(root);\n    return minDiff;\n}\n\nprivate void Inorder(TreeNode node) {\n    if (node == null) {\n        return;\n    }\n    Inorder(node.left);\n    if (prev != null) {\n        minDiff = Math.Min(minDiff, node.val - prev.val);\n    }\n    prev = node;\n    Inorder(node.right);\n}",
    "lineMap": {
      "init": [
        1,
        2
      ],
      "start_validation": [
        5
      ],
      "visit_node": [
        9
      ],
      "base_case_null": [
        10,
        11
      ],
      "recurse_left": [
        13
      ],
      "first_node": [
        14
      ],
      "calculate_diff": [
        14,
        15
      ],
      "update_min": [
        15
      ],
      "no_update": [
        15
      ],
      "update_prev": [
        17
      ],
      "recurse_right": [
        18
      ],
      "return": [
        9
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ],
      "has_prev": [
        14
      ],
      "is_smaller": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func getMinimumDifference(root *TreeNode) int {\n    var prev *TreeNode\n    minDiff := math.MaxInt32\n    var inorder func(node *TreeNode)\n    inorder = func(node *TreeNode) {\n        if node == nil {\n            return\n        }\n        inorder(node.Left)\n        if prev != nil {\n            minDiff = min(minDiff, node.Val-prev.Val)\n        }\n        prev = node\n        inorder(node.Right)\n    }\n    inorder(root)\n    return minDiff\n}",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "start_validation": [
        16
      ],
      "visit_node": [
        5
      ],
      "base_case_null": [
        6,
        7
      ],
      "recurse_left": [
        9
      ],
      "first_node": [
        10
      ],
      "calculate_diff": [
        10,
        11
      ],
      "update_min": [
        11
      ],
      "no_update": [
        11
      ],
      "update_prev": [
        13
      ],
      "recurse_right": [
        14
      ],
      "return": [
        5
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "has_prev": [
        10
      ],
      "is_smaller": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function getMinimumDifference(root) {\n    let prev = null;\n    let minDiff = Infinity;\n\n    function inorder(node) {\n        if (!node) return;\n        inorder(node.left);\n        if (prev !== null) {\n            minDiff = Math.min(minDiff, node.val - prev.val);\n        }\n        prev = node;\n        inorder(node.right);\n    }\n\n    inorder(root);\n    return minDiff;\n}",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "start_validation": [
        15
      ],
      "visit_node": [
        5
      ],
      "base_case_null": [
        6
      ],
      "recurse_left": [
        7
      ],
      "first_node": [
        8
      ],
      "calculate_diff": [
        8,
        9
      ],
      "update_min": [
        9
      ],
      "no_update": [
        9
      ],
      "update_prev": [
        11
      ],
      "recurse_right": [
        12
      ],
      "return": [
        5
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "has_prev": [
        8
      ],
      "is_smaller": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function getMinimumDifference(root: TreeNode | null): number {\n    let prev: TreeNode | null = null;\n    let minDiff = Infinity;\n\n    function inorder(node: TreeNode | null) {\n        if (!node) return;\n        inorder(node.left);\n        if (prev !== null) {\n            minDiff = Math.min(minDiff, node.val - prev.val);\n        }\n        prev = node;\n        inorder(node.right);\n    }\n\n    inorder(root);\n    return minDiff;\n}",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "start_validation": [
        15
      ],
      "visit_node": [
        5
      ],
      "base_case_null": [
        6
      ],
      "recurse_left": [
        7
      ],
      "first_node": [
        8
      ],
      "calculate_diff": [
        8,
        9
      ],
      "update_min": [
        9
      ],
      "no_update": [
        9
      ],
      "update_prev": [
        11
      ],
      "recurse_right": [
        12
      ],
      "return": [
        5
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "has_prev": [
        8
      ],
      "is_smaller": [
        9
      ]
    }
  }
};

const MinimumAbsoluteDifferenceInBstPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (minDiff=1)",
    "value": {
      "tree": [
        4,
        2,
        6,
        1,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Mixed (minDiff=1)",
    "value": {
      "tree": [
        1,
        0,
        48,
        null,
        null,
        12,
        49
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Balanced (minDiff=2)",
    "value": {
      "tree": [
        10,
        5,
        15,
        3,
        7,
        12,
        20
      ]
    }
  }
];

function generateMinimumAbsoluteDifferenceInBstSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let l=(e,t,i)=>{let n=r.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t,label:i}},a={};r.forEach((e,t)=>{a[`node_${t}`]=l(t)});let o=new RecursiveStepRecorder({prev:null,minDiff:null,visited:[]},{...a});if(o.pushCallFrame({root:(0,_treeHelper848569.kU)(r.get(0))},"getMinimumDifference"),o.record("init","Start: minDiff = Infinity, prev = null; inorder visits BST values in sorted order"),0===r.size)return o.update_global_variable("minDiff",0),o.record("complete","Empty tree, nothing to compare"),o.popCallFrame(),o.getSteps();let d=null,s=-1,u=1/0,c=[],f=[],p=()=>{o.update_global_variable("pathIdxs",[...f]),o.update_global_variable("currentIdx",f.length>0?f[f.length-1]:-1)};return o.record("start_validation","Call inorder(root)"),!function e(t){let i=r.has(t),a=i?r.get(t):null;if(o.pushCallFrame({node:(0,_treeHelper848569.kU)(a)},"inorder"),!i){o.update_global_variable("currentIdx",-1),o.update_global_variable("nullIdx",t),o.add_conditional("is_null",!0),o.record("base_case_null","node is null, return"),o.popCallFrame(),p();return}f.push(t),p(),o.update_visual(`node_${t}`,l(t,"onpath")),o.add_conditional("is_null",!1),o.record("visit_node",`Enter inorder(${a.value})`);let h=2*t+1;if(o.record("recurse_left",`Recurse into the left subtree of ${a.value}`),e(h),c.push(a.value),o.update_global_variable("visited",[...c]),null!==d){let e=a.value-d;o.update_global_variable("diff",e),o.add_conditional("has_prev",!0),o.record("calculate_diff",`Consecutive in sorted order: diff = ${a.value} - ${d} = ${e}`),e<u?(u=e,o.update_global_variable("minDiff",u),o.update_global_variable("bestPairIdxs",[s,t]),o.add_conditional("is_smaller",!0),o.record("update_min",`New closest pair: minDiff = ${u}`)):(o.add_conditional("is_smaller",!1),o.record("no_update",`diff ${e} >= minDiff ${u}, keep minDiff`))}else o.add_conditional("has_prev",!1),o.record("first_node",`First value in sorted order: ${a.value}, nothing to compare yet`);d=a.value,s=t,o.update_global_variable("prev",d),o.update_global_variable("prevIdx",s),o.update_visual(`node_${t}`,l(t,"visited",String(c.length))),o.record("update_prev",`Update prev = ${d}`);let m=2*t+2;o.record("recurse_right",`Recurse into the right subtree of ${a.value}`),e(m),o.record("return",`Done with node ${a.value}, return to the parent`),f.pop(),o.popCallFrame(),p()}(0),o.update_global_variable("currentIdx",-1),o.record("complete",`Minimum absolute difference: ${u}`),o.popCallFrame(),o.getSteps()
}

export function MinimumAbsoluteDifferenceInBstProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumAbsoluteDifferenceInBstTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumAbsoluteDifferenceInBstSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Minimum Absolute Difference in BST"
      slug="minimum-absolute-difference-in-bst"
      approaches={approaches}
      presets={MinimumAbsoluteDifferenceInBstPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Range Sum of BST (range-sum-of-bst)
// ==========================================

const RangeSumOfBstTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def rangeSumBST(self, root: TreeNode, low: int, high: int) -> int:\n        if not root:\n            return 0\n\n        total = 0\n        queue = deque([root])\n\n        while queue:\n            node = queue.popleft()\n            if not node:\n                continue\n\n            # Add to sum if in range\n            if low <= node.val <= high:\n                total += node.val\n            # Only explore left if there could be in-range values there\n            if node.val > low:\n                queue.append(node.left)\n            # Only explore right if there could be in-range values there\n            if node.val < high:\n                queue.append(node.right)\n\n        return total",
    "lineMap": {
      "empty_tree": [
        3,
        4
      ],
      "init": [
        6,
        7
      ],
      "dequeue": [
        10
      ],
      "skip_null": [
        11,
        12
      ],
      "check_range": [
        15
      ],
      "add_to_sum": [
        15,
        16
      ],
      "check_left": [
        18
      ],
      "enqueue_left": [
        18,
        19
      ],
      "check_right": [
        21
      ],
      "enqueue_right": [
        21,
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_queue": [
        9
      ],
      "is_null": [
        11
      ],
      "in_range": [
        15
      ],
      "go_left": [
        18
      ],
      "go_right": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int rangeSumBST(TreeNode root, int low, int high) {\n        if (root == null) return 0;\n\n        int sum = 0;\n        Queue<TreeNode> queue = new LinkedList<>();\n        queue.offer(root);\n\n        while (!queue.isEmpty()) {\n            TreeNode node = queue.poll();\n            if (node == null) continue;\n\n            // Add to sum if in range\n            if (node.val >= low && node.val <= high) {\n                sum += node.val;\n            }\n            // Only explore left if there could be in-range values there\n            if (node.val > low) {\n                queue.offer(node.left);\n            }\n            // Only explore right if there could be in-range values there\n            if (node.val < high) {\n                queue.offer(node.right);\n            }\n        }\n        return sum;\n    }\n}",
    "lineMap": {
      "empty_tree": [
        3
      ],
      "init": [
        5,
        7
      ],
      "dequeue": [
        10
      ],
      "skip_null": [
        11
      ],
      "check_range": [
        14
      ],
      "add_to_sum": [
        14,
        15
      ],
      "check_left": [
        18
      ],
      "enqueue_left": [
        18,
        19
      ],
      "check_right": [
        22
      ],
      "enqueue_right": [
        22,
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "has_queue": [
        9
      ],
      "is_null": [
        11
      ],
      "in_range": [
        14
      ],
      "go_left": [
        18
      ],
      "go_right": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int rangeSumBST(TreeNode* root, int low, int high) {\n        if (root == nullptr) return 0;\n\n        int sum = 0;\n        queue<TreeNode*> q;\n        q.push(root);\n\n        while (!q.empty()) {\n            TreeNode* node = q.front();\n            q.pop();\n            if (node == nullptr) continue;\n\n            // Add to sum if in range\n            if (node->val >= low && node->val <= high) {\n                sum += node->val;\n            }\n            // Only explore left if there could be in-range values there\n            if (node->val > low) {\n                q.push(node->left);\n            }\n            // Only explore right if there could be in-range values there\n            if (node->val < high) {\n                q.push(node->right);\n            }\n        }\n        return sum;\n    }\n};",
    "lineMap": {
      "empty_tree": [
        4
      ],
      "init": [
        6,
        8
      ],
      "dequeue": [
        11,
        12
      ],
      "skip_null": [
        13
      ],
      "check_range": [
        16
      ],
      "add_to_sum": [
        16,
        17
      ],
      "check_left": [
        20
      ],
      "enqueue_left": [
        20,
        21
      ],
      "check_right": [
        24
      ],
      "enqueue_right": [
        24,
        25
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "has_queue": [
        10
      ],
      "is_null": [
        13
      ],
      "in_range": [
        16
      ],
      "go_left": [
        20
      ],
      "go_right": [
        24
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var rangeSumBST = function(root, low, high) {\n    if (root === null) return 0;\n\n    let sum = 0;\n    const queue = [root];\n\n    while (queue.length > 0) {\n        const node = queue.shift();\n        if (node === null) continue;\n\n        // Add to sum if in range\n        if (node.val >= low && node.val <= high) {\n            sum += node.val;\n        }\n        // Only explore left if there could be in-range values there\n        if (node.val > low) {\n            queue.push(node.left);\n        }\n        // Only explore right if there could be in-range values there\n        if (node.val < high) {\n            queue.push(node.right);\n        }\n    }\n    return sum;\n};",
    "lineMap": {
      "empty_tree": [
        2
      ],
      "init": [
        4,
        5
      ],
      "dequeue": [
        8
      ],
      "skip_null": [
        9
      ],
      "check_range": [
        12
      ],
      "add_to_sum": [
        12,
        13
      ],
      "check_left": [
        16
      ],
      "enqueue_left": [
        16,
        17
      ],
      "check_right": [
        20
      ],
      "enqueue_right": [
        20,
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_queue": [
        7
      ],
      "is_null": [
        9
      ],
      "in_range": [
        12
      ],
      "go_left": [
        16
      ],
      "go_right": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rangeSumBST(root: TreeNode | null, low: number, high: number): number {\n    if (root === null) return 0;\n\n    let sum = 0;\n    const queue: (TreeNode | null)[] = [root];\n\n    while (queue.length > 0) {\n        const node = queue.shift();\n        if (node === null) continue;\n\n        // Add to sum if in range\n        if (node.val >= low && node.val <= high) {\n            sum += node.val;\n        }\n        // Only explore left if there could be in-range values there\n        if (node.val > low) {\n            queue.push(node.left);\n        }\n        // Only explore right if there could be in-range values there\n        if (node.val < high) {\n            queue.push(node.right);\n        }\n    }\n    return sum;\n}",
    "lineMap": {
      "empty_tree": [
        2
      ],
      "init": [
        4,
        5
      ],
      "dequeue": [
        8
      ],
      "skip_null": [
        9
      ],
      "check_range": [
        12
      ],
      "add_to_sum": [
        12,
        13
      ],
      "check_left": [
        16
      ],
      "enqueue_left": [
        16,
        17
      ],
      "check_right": [
        20
      ],
      "enqueue_right": [
        20,
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_queue": [
        7
      ],
      "is_null": [
        9
      ],
      "in_range": [
        12
      ],
      "go_left": [
        16
      ],
      "go_right": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rangeSumBST(root *TreeNode, low int, high int) int {\n    if root == nil {\n        return 0\n    }\n\n    sum := 0\n    queue := []*TreeNode{root}\n\n    for len(queue) > 0 {\n        node := queue[0]\n        queue = queue[1:]\n        if node == nil {\n            continue\n        }\n\n        // Add to sum if in range\n        if node.Val >= low && node.Val <= high {\n            sum += node.Val\n        }\n        // Only explore left if there could be in-range values there\n        if node.Val > low {\n            queue = append(queue, node.Left)\n        }\n        // Only explore right if there could be in-range values there\n        if node.Val < high {\n            queue = append(queue, node.Right)\n        }\n    }\n    return sum\n}",
    "lineMap": {
      "empty_tree": [
        2,
        3
      ],
      "init": [
        6,
        7
      ],
      "dequeue": [
        10,
        11
      ],
      "skip_null": [
        12,
        13
      ],
      "check_range": [
        17
      ],
      "add_to_sum": [
        17,
        18
      ],
      "check_left": [
        21
      ],
      "enqueue_left": [
        21,
        22
      ],
      "check_right": [
        25
      ],
      "enqueue_right": [
        25,
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "has_queue": [
        9
      ],
      "is_null": [
        12
      ],
      "in_range": [
        17
      ],
      "go_left": [
        21
      ],
      "go_right": [
        25
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int RangeSumBST(TreeNode root, int low, int high) {\n        if (root == null) return 0;\n\n        int sum = 0;\n        Queue<TreeNode> queue = new Queue<TreeNode>();\n        queue.Enqueue(root);\n\n        while (queue.Count > 0) {\n            TreeNode node = queue.Dequeue();\n            if (node == null) continue;\n\n            // Add to sum if in range\n            if (node.val >= low && node.val <= high) {\n                sum += node.val;\n            }\n            // Only explore left if there could be in-range values there\n            if (node.val > low) {\n                queue.Enqueue(node.left);\n            }\n            // Only explore right if there could be in-range values there\n            if (node.val < high) {\n                queue.Enqueue(node.right);\n            }\n        }\n        return sum;\n    }\n}",
    "lineMap": {
      "empty_tree": [
        3
      ],
      "init": [
        5,
        7
      ],
      "dequeue": [
        10
      ],
      "skip_null": [
        11
      ],
      "check_range": [
        14
      ],
      "add_to_sum": [
        14,
        15
      ],
      "check_left": [
        18
      ],
      "enqueue_left": [
        18,
        19
      ],
      "check_right": [
        22
      ],
      "enqueue_right": [
        22,
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "has_queue": [
        9
      ],
      "is_null": [
        11
      ],
      "in_range": [
        14
      ],
      "go_left": [
        18
      ],
      "go_right": [
        22
      ]
    }
  }
};

const RangeSumOfBstPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "tree": [
        10,
        5,
        15,
        3,
        7,
        null,
        18
      ],
      "low": 7,
      "high": 15
    }
  },
  {
    "id": "ex2",
    "label": "All in range",
    "value": {
      "tree": [
        10,
        5,
        15,
        3,
        7,
        13,
        18,
        1,
        null,
        6
      ],
      "low": 1,
      "high": 20
    }
  },
  {
    "id": "ex3",
    "label": "Narrow range",
    "value": {
      "tree": [
        10,
        5,
        15,
        3,
        7,
        13,
        18
      ],
      "low": 6,
      "high": 10
    }
  }
];

function generateRangeSumOfBstSteps(e: any): any[] {
  
let t=(0,r.createRangeSumBSTScene)(e),{recorder:n,nodeMap:l,low:i,high:o,childOf:a,updateNodeState:u,markSubtree:s}=t,{pointAt:d,pushFrame:h,popFrame:g,clearFrames:c}=t;n.record("init",`Start: sum the nodes inside [${i}, ${o}], pruning what cannot help`);let f=0,p=e=>{if(null===e)return h(null),d(null),n.set_conditionals([{key:"is_null",result:!0}]),n.record("null_base","Null node, return 0"),g(),0;let t=l.get(e).value;if(h(t),u(e,r.NODE_STATE.current),d(e),n.set_conditionals([{key:"is_null",result:!1}]),n.record("call",`rangeSumBST(${t})`),t<i){s(a(e,"left"),r.NODE_STATE.pruned),u(e,r.NODE_STATE.skipped),n.set_conditionals([{key:"below",result:!0}]),n.record("below_range",`${t} < ${i}, prune the left subtree and recurse right only`);let l=p(a(e,"right"));return d(e),n.record("return_below",`Subtree at ${t} returns ${l}`),g(),l}if(t>o){s(a(e,"right"),r.NODE_STATE.pruned),u(e,r.NODE_STATE.skipped),n.set_conditionals([{key:"below",result:!1},{key:"above",result:!0}]),n.record("above_range",`${t} > ${o}, prune the right subtree and recurse left only`);let l=p(a(e,"left"));return d(e),n.record("return_above",`Subtree at ${t} returns ${l}`),g(),l}f+=t,n.update_variable("sum",f),u(e,r.NODE_STATE.counted),n.set_conditionals([{key:"below",result:!1},{key:"above",result:!1}]),n.record("in_range",`${i} <= ${t} <= ${o}, add it and check both subtrees. Sum = ${f}`);let c=t+p(a(e,"left"))+p(a(e,"right"));return d(e),n.record("return_sum",`Subtree at ${t} returns ${c}`),g(),c},m=p(l.has(0)?0:null);return c(),d(null),n.record("complete",`Pruning finished. Sum inside [${i}, ${o}] is ${m}`),n.getSteps()
}

export function RangeSumOfBstProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RangeSumOfBstTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRangeSumOfBstSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Range Sum of BST"
      slug="range-sum-of-bst"
      approaches={approaches}
      presets={RangeSumOfBstPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Recover Binary Search Tree (recover-binary-search-tree)
// ==========================================

const RecoverBinarySearchTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def recoverTree(self, root: Optional[TreeNode]) -> None:\n        first = second = prev = None\n        current = root\n\n        while current:\n            if not current.left:\n                # No left child: visit this node, then go right\n                if prev and prev.val > current.val:\n                    if not first:\n                        first = prev\n                    second = current\n                prev = current\n                current = current.right\n            else:\n                # Find in-order predecessor (rightmost node in left subtree)\n                predecessor = current.left\n                while predecessor.right and predecessor.right != current:\n                    predecessor = predecessor.right\n\n                if not predecessor.right:\n                    # First visit: create thread and move left\n                    predecessor.right = current\n                    current = current.left\n                else:\n                    # Returning via thread: remove it, visit node, move right\n                    predecessor.right = None\n                    if prev and prev.val > current.val:\n                        if not first:\n                            first = prev\n                        second = current\n                    prev = current\n                    current = current.right\n\n        # Swap values of the two misplaced nodes\n        first.val, second.val = second.val, first.val",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "loop": [
        6
      ],
      "check_left": [
        7
      ],
      "check_inversion": [
        9
      ],
      "set_first": [
        10,
        11
      ],
      "set_second": [
        12
      ],
      "set_prev": [
        13
      ],
      "move_right": [
        14
      ],
      "find_predecessor": [
        17
      ],
      "walk_predecessor": [
        18
      ],
      "move_predecessor": [
        19
      ],
      "check_thread": [
        21
      ],
      "create_thread": [
        23
      ],
      "move_left": [
        24
      ],
      "remove_thread": [
        27
      ],
      "check_inversion_t": [
        28
      ],
      "set_first_t": [
        29,
        30
      ],
      "set_second_t": [
        31
      ],
      "set_prev_t": [
        32
      ],
      "move_right_t": [
        33
      ],
      "swap": [
        36
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "has_current": [
        6
      ],
      "has_left": [
        7
      ],
      "is_inversion": [
        9
      ],
      "has_first": [
        10
      ],
      "pred_right": [
        18
      ],
      "no_thread": [
        21
      ],
      "is_inversion_t": [
        28
      ],
      "has_first_t": [
        29
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public void recoverTree(TreeNode root) {\n        TreeNode first = null, second = null, prev = null;\n        TreeNode current = root;\n\n        while (current != null) {\n            if (current.left == null) {\n                // No left child: visit this node, then go right\n                if (prev != null && prev.val > current.val) {\n                    if (first == null) first = prev;\n                    second = current;\n                }\n                prev = current;\n                current = current.right;\n            } else {\n                // Find in-order predecessor (rightmost node in left subtree)\n                TreeNode predecessor = current.left;\n                while (predecessor.right != null && predecessor.right != current) {\n                    predecessor = predecessor.right;\n                }\n\n                if (predecessor.right == null) {\n                    // First visit: create thread and move left\n                    predecessor.right = current;\n                    current = current.left;\n                } else {\n                    // Returning via thread: remove it, visit node, move right\n                    predecessor.right = null;\n                    if (prev != null && prev.val > current.val) {\n                        if (first == null) first = prev;\n                        second = current;\n                    }\n                    prev = current;\n                    current = current.right;\n                }\n            }\n        }\n\n        // Swap values of the two misplaced nodes\n        int temp = first.val;\n        first.val = second.val;\n        second.val = temp;\n    }\n}",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "loop": [
        6
      ],
      "check_left": [
        7
      ],
      "check_inversion": [
        9
      ],
      "set_first": [
        10
      ],
      "set_second": [
        11
      ],
      "set_prev": [
        13
      ],
      "move_right": [
        14
      ],
      "find_predecessor": [
        17
      ],
      "walk_predecessor": [
        18
      ],
      "move_predecessor": [
        19
      ],
      "check_thread": [
        22
      ],
      "create_thread": [
        24
      ],
      "move_left": [
        25
      ],
      "remove_thread": [
        28
      ],
      "check_inversion_t": [
        29
      ],
      "set_first_t": [
        30
      ],
      "set_second_t": [
        31
      ],
      "set_prev_t": [
        33
      ],
      "move_right_t": [
        34
      ],
      "swap": [
        40,
        42
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "has_current": [
        6
      ],
      "has_left": [
        7
      ],
      "is_inversion": [
        9
      ],
      "has_first": [
        10
      ],
      "pred_right": [
        18
      ],
      "no_thread": [
        22
      ],
      "is_inversion_t": [
        29
      ],
      "has_first_t": [
        30
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    void recoverTree(TreeNode* root) {\n        TreeNode* first = nullptr;\n        TreeNode* second = nullptr;\n        TreeNode* prev = nullptr;\n        TreeNode* current = root;\n\n        while (current) {\n            if (!current->left) {\n                // No left child: visit this node, then go right\n                if (prev && prev->val > current->val) {\n                    if (!first) first = prev;\n                    second = current;\n                }\n                prev = current;\n                current = current->right;\n            } else {\n                // Find in-order predecessor (rightmost node in left subtree)\n                TreeNode* predecessor = current->left;\n                while (predecessor->right && predecessor->right != current) {\n                    predecessor = predecessor->right;\n                }\n\n                if (!predecessor->right) {\n                    // First visit: create thread and move left\n                    predecessor->right = current;\n                    current = current->left;\n                } else {\n                    // Returning via thread: remove it, visit node, move right\n                    predecessor->right = nullptr;\n                    if (prev && prev->val > current->val) {\n                        if (!first) first = prev;\n                        second = current;\n                    }\n                    prev = current;\n                    current = current->right;\n                }\n            }\n        }\n\n        // Swap values of the two misplaced nodes\n        swap(first->val, second->val);\n    }\n};",
    "lineMap": {
      "init": [
        4,
        7
      ],
      "loop": [
        9
      ],
      "check_left": [
        10
      ],
      "check_inversion": [
        12
      ],
      "set_first": [
        13
      ],
      "set_second": [
        14
      ],
      "set_prev": [
        16
      ],
      "move_right": [
        17
      ],
      "find_predecessor": [
        20
      ],
      "walk_predecessor": [
        21
      ],
      "move_predecessor": [
        22
      ],
      "check_thread": [
        25
      ],
      "create_thread": [
        27
      ],
      "move_left": [
        28
      ],
      "remove_thread": [
        31
      ],
      "check_inversion_t": [
        32
      ],
      "set_first_t": [
        33
      ],
      "set_second_t": [
        34
      ],
      "set_prev_t": [
        36
      ],
      "move_right_t": [
        37
      ],
      "swap": [
        43
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "has_current": [
        9
      ],
      "has_left": [
        10
      ],
      "is_inversion": [
        12
      ],
      "has_first": [
        13
      ],
      "pred_right": [
        21
      ],
      "no_thread": [
        25
      ],
      "is_inversion_t": [
        32
      ],
      "has_first_t": [
        33
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var recoverTree = function(root) {\n    let first = null, second = null, prev = null;\n    let current = root;\n\n    while (current) {\n        if (!current.left) {\n            // No left child: visit this node, then go right\n            if (prev && prev.val > current.val) {\n                if (!first) first = prev;\n                second = current;\n            }\n            prev = current;\n            current = current.right;\n        } else {\n            // Find in-order predecessor (rightmost node in left subtree)\n            let predecessor = current.left;\n            while (predecessor.right && predecessor.right !== current) {\n                predecessor = predecessor.right;\n            }\n\n            if (!predecessor.right) {\n                // First visit: create thread and move left\n                predecessor.right = current;\n                current = current.left;\n            } else {\n                // Returning via thread: remove it, visit node, move right\n                predecessor.right = null;\n                if (prev && prev.val > current.val) {\n                    if (!first) first = prev;\n                    second = current;\n                }\n                prev = current;\n                current = current.right;\n            }\n        }\n    }\n\n    // Swap values of the two misplaced nodes\n    const temp = first.val;\n    first.val = second.val;\n    second.val = temp;\n};",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_left": [
        6
      ],
      "check_inversion": [
        8
      ],
      "set_first": [
        9
      ],
      "set_second": [
        10
      ],
      "set_prev": [
        12
      ],
      "move_right": [
        13
      ],
      "find_predecessor": [
        16
      ],
      "walk_predecessor": [
        17
      ],
      "move_predecessor": [
        18
      ],
      "check_thread": [
        21
      ],
      "create_thread": [
        23
      ],
      "move_left": [
        24
      ],
      "remove_thread": [
        27
      ],
      "check_inversion_t": [
        28
      ],
      "set_first_t": [
        29
      ],
      "set_second_t": [
        30
      ],
      "set_prev_t": [
        32
      ],
      "move_right_t": [
        33
      ],
      "swap": [
        39,
        41
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "has_current": [
        5
      ],
      "has_left": [
        6
      ],
      "is_inversion": [
        8
      ],
      "has_first": [
        9
      ],
      "pred_right": [
        17
      ],
      "no_thread": [
        21
      ],
      "is_inversion_t": [
        28
      ],
      "has_first_t": [
        29
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function recoverTree(root: TreeNode | null): void {\n    let first: TreeNode | null = null;\n    let second: TreeNode | null = null;\n    let prev: TreeNode | null = null;\n    let current = root;\n\n    while (current) {\n        if (!current.left) {\n            // No left child: visit this node, then go right\n            if (prev && prev.val > current.val) {\n                if (!first) first = prev;\n                second = current;\n            }\n            prev = current;\n            current = current.right;\n        } else {\n            // Find in-order predecessor (rightmost node in left subtree)\n            let predecessor: TreeNode = current.left;\n            while (predecessor.right && predecessor.right !== current) {\n                predecessor = predecessor.right;\n            }\n\n            if (!predecessor.right) {\n                // First visit: create thread and move left\n                predecessor.right = current;\n                current = current.left;\n            } else {\n                // Returning via thread: remove it, visit node, move right\n                predecessor.right = null;\n                if (prev && prev.val > current.val) {\n                    if (!first) first = prev;\n                    second = current;\n                }\n                prev = current;\n                current = current.right;\n            }\n        }\n    }\n\n    // Swap values of the two misplaced nodes\n    const temp = first!.val;\n    first!.val = second!.val;\n    second!.val = temp;\n}",
    "lineMap": {
      "init": [
        2,
        5
      ],
      "loop": [
        7
      ],
      "check_left": [
        8
      ],
      "check_inversion": [
        10
      ],
      "set_first": [
        11
      ],
      "set_second": [
        12
      ],
      "set_prev": [
        14
      ],
      "move_right": [
        15
      ],
      "find_predecessor": [
        18
      ],
      "walk_predecessor": [
        19
      ],
      "move_predecessor": [
        20
      ],
      "check_thread": [
        23
      ],
      "create_thread": [
        25
      ],
      "move_left": [
        26
      ],
      "remove_thread": [
        29
      ],
      "check_inversion_t": [
        30
      ],
      "set_first_t": [
        31
      ],
      "set_second_t": [
        32
      ],
      "set_prev_t": [
        34
      ],
      "move_right_t": [
        35
      ],
      "swap": [
        41,
        43
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "has_current": [
        7
      ],
      "has_left": [
        8
      ],
      "is_inversion": [
        10
      ],
      "has_first": [
        11
      ],
      "pred_right": [
        19
      ],
      "no_thread": [
        23
      ],
      "is_inversion_t": [
        30
      ],
      "has_first_t": [
        31
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func recoverTree(root *TreeNode) {\n    var first, second, prev *TreeNode\n    current := root\n\n    for current != nil {\n        if current.Left == nil {\n            // No left child: visit this node, then go right\n            if prev != nil && prev.Val > current.Val {\n                if first == nil {\n                    first = prev\n                }\n                second = current\n            }\n            prev = current\n            current = current.Right\n        } else {\n            // Find in-order predecessor (rightmost node in left subtree)\n            predecessor := current.Left\n            for predecessor.Right != nil && predecessor.Right != current {\n                predecessor = predecessor.Right\n            }\n\n            if predecessor.Right == nil {\n                // First visit: create thread and move left\n                predecessor.Right = current\n                current = current.Left\n            } else {\n                // Returning via thread: remove it, visit node, move right\n                predecessor.Right = nil\n                if prev != nil && prev.Val > current.Val {\n                    if first == nil {\n                        first = prev\n                    }\n                    second = current\n                }\n                prev = current\n                current = current.Right\n            }\n        }\n    }\n\n    // Swap values of the two misplaced nodes\n    first.Val, second.Val = second.Val, first.Val\n}",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_left": [
        6
      ],
      "check_inversion": [
        8
      ],
      "set_first": [
        9,
        10
      ],
      "set_second": [
        12
      ],
      "set_prev": [
        14
      ],
      "move_right": [
        15
      ],
      "find_predecessor": [
        18
      ],
      "walk_predecessor": [
        19
      ],
      "move_predecessor": [
        20
      ],
      "check_thread": [
        23
      ],
      "create_thread": [
        25
      ],
      "move_left": [
        26
      ],
      "remove_thread": [
        29
      ],
      "check_inversion_t": [
        30
      ],
      "set_first_t": [
        31,
        32
      ],
      "set_second_t": [
        34
      ],
      "set_prev_t": [
        36
      ],
      "move_right_t": [
        37
      ],
      "swap": [
        43
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "has_current": [
        5
      ],
      "has_left": [
        6
      ],
      "is_inversion": [
        8
      ],
      "has_first": [
        9
      ],
      "pred_right": [
        19
      ],
      "no_thread": [
        23
      ],
      "is_inversion_t": [
        30
      ],
      "has_first_t": [
        31
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public void RecoverTree(TreeNode root) {\n        TreeNode first = null, second = null, prev = null;\n        TreeNode current = root;\n\n        while (current != null) {\n            if (current.left == null) {\n                // No left child: visit this node, then go right\n                if (prev != null && prev.val > current.val) {\n                    if (first == null) first = prev;\n                    second = current;\n                }\n                prev = current;\n                current = current.right;\n            } else {\n                // Find in-order predecessor (rightmost node in left subtree)\n                TreeNode predecessor = current.left;\n                while (predecessor.right != null && predecessor.right != current) {\n                    predecessor = predecessor.right;\n                }\n\n                if (predecessor.right == null) {\n                    // First visit: create thread and move left\n                    predecessor.right = current;\n                    current = current.left;\n                } else {\n                    // Returning via thread: remove it, visit node, move right\n                    predecessor.right = null;\n                    if (prev != null && prev.val > current.val) {\n                        if (first == null) first = prev;\n                        second = current;\n                    }\n                    prev = current;\n                    current = current.right;\n                }\n            }\n        }\n\n        // Swap values of the two misplaced nodes\n        int temp = first.val;\n        first.val = second.val;\n        second.val = temp;\n    }\n}",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "loop": [
        6
      ],
      "check_left": [
        7
      ],
      "check_inversion": [
        9
      ],
      "set_first": [
        10
      ],
      "set_second": [
        11
      ],
      "set_prev": [
        13
      ],
      "move_right": [
        14
      ],
      "find_predecessor": [
        17
      ],
      "walk_predecessor": [
        18
      ],
      "move_predecessor": [
        19
      ],
      "check_thread": [
        22
      ],
      "create_thread": [
        24
      ],
      "move_left": [
        25
      ],
      "remove_thread": [
        28
      ],
      "check_inversion_t": [
        29
      ],
      "set_first_t": [
        30
      ],
      "set_second_t": [
        31
      ],
      "set_prev_t": [
        33
      ],
      "move_right_t": [
        34
      ],
      "swap": [
        40,
        42
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "has_current": [
        6
      ],
      "has_left": [
        7
      ],
      "is_inversion": [
        9
      ],
      "has_first": [
        10
      ],
      "pred_right": [
        18
      ],
      "no_thread": [
        22
      ],
      "is_inversion_t": [
        29
      ],
      "has_first_t": [
        30
      ]
    }
  }
};

const RecoverBinarySearchTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Adjacent swap (3<->2)",
    "value": {
      "tree": [
        1,
        3,
        null,
        null,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Non-adjacent swap (3<->2)",
    "value": {
      "tree": [
        3,
        1,
        4,
        null,
        null,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Root swap (3<->1)",
    "value": {
      "tree": [
        2,
        3,
        1
      ]
    }
  }
];

function generateRecoverBinarySearchTreeSteps(e: any): any[] {
  
let r=(0,n.createRecoverBSTScene)(e),{recorder:t,nodeMap:i,leftOf:s,rightOf:o,setValue:l,setState:a,pointAt:d}=r,{setInorder:c,clearPointers:u,addThread:v,removeThread:h}=r,p=new Map,f=e=>p.has(e)?p.get(e):o(e),g=null,_=null,m=null,x=[];if(t.record("init","first = null, second = null, prev = null, current = root"),0===i.size)return t.record("complete","Empty tree, nothing to recover"),t.getSteps();let y=0,T=(e,r)=>{let s=i.get(e).value;x.push(s),c([...x]);let o=null===m?null:i.get(m).value,l=null!==o&&o>s;t.set_conditionals([{key:r.checkCond,result:l}]),t.record(r.check,null===o?`${s} is the first node in order, nothing to compare`:l?`Inversion: prev (${o}) > current (${s})`:`${o} < ${s}, still in order`),l?(t.set_conditionals([{key:r.firstCond,result:null===g}]),null===g&&(a(g=m,n.NODE_STATE.misplaced),d("first",g),t.record(r.setFirst,`First inversion, so first = ${o}`)),null!==_&&_!==e&&a(_,n.NODE_STATE.visited),a(_=e,n.NODE_STATE.misplaced),d("second",_),t.record(r.setSecond,`second = ${s}`)):e!==g&&e!==_&&a(e,n.NODE_STATE.visited),d("prev",m=e),t.record(r.setPrev,`prev = ${s}`)},S=(e,r)=>{let s=f(e);if(y=s,null===s){d("current",null),t.record(r,"No right link, current = null");return}a(s,s===g||s===_?n.NODE_STATE.misplaced:n.NODE_STATE.current),d("current",s),t.record(r,`current = ${i.get(s).value}`)};for(a(y,n.NODE_STATE.current),d("current",y);null!==y;){let e=i.get(y).value;t.set_conditionals([{key:"has_current",result:!0}]),t.record("loop",`current = ${e}`);let r=s(y);if(t.set_conditionals([{key:"has_left",result:null!==r}]),t.record("check_left",null===r?`${e} has no left child, visit it now`:`${e} has a left child, find its in-order predecessor`),null===r){T(y,{check:"check_inversion",checkCond:"is_inversion",setFirst:"set_first",firstCond:"has_first",setSecond:"set_second",setPrev:"set_prev"}),S(y,"move_right");continue}let o=r;for(a(o,n.NODE_STATE.predecessor),d("predecessor",o),t.record("find_predecessor",`predecessor = ${i.get(o).value}`);;){let e=f(o),r=null!==e&&e!==y;if(t.set_conditionals([{key:"pred_right",result:r}]),t.record("walk_predecessor",r?`${i.get(o).value} has a right link, keep going right`:`${i.get(o).value} is the in-order predecessor`),!r)break;a(o,n.NODE_STATE.untouched),a(o=e,n.NODE_STATE.predecessor),d("predecessor",o),t.record("move_predecessor",`predecessor = ${i.get(o).value}`)}let l=null===f(o);if(t.set_conditionals([{key:"no_thread",result:l}]),t.record("check_thread",l?`${i.get(o).value} has no right link, this is the first visit`:`${i.get(o).value} already threads back, we are returning`),l){p.set(o,y),v(o,y),t.record("create_thread",`Thread ${i.get(o).value} -> ${e}`),a(o,o===g||o===_?n.NODE_STATE.misplaced:n.NODE_STATE.untouched),d("predecessor",null),a(y=r,n.NODE_STATE.current),d("current",y),t.record("move_left",`current = ${i.get(r).value}`);continue}p.delete(o),h(o,y),a(o,o===g||o===_?n.NODE_STATE.misplaced:n.NODE_STATE.visited),d("predecessor",null),t.record("remove_thread",`Remove the thread back to ${e}`),T(y,{check:"check_inversion_t",checkCond:"is_inversion_t",setFirst:"set_first_t",firstCond:"has_first_t",setSecond:"set_second_t",setPrev:"set_prev_t"}),S(y,"move_right_t")}if(d("prev",null),null!==g&&null!==_){let e=i.get(g).value,r=i.get(_).value;l(g,r),l(_,e),a(g,n.NODE_STATE.fixed),a(_,n.NODE_STATE.fixed),d("first",g),d("second",_),t.record("swap",`Swap values: ${e} and ${r}`),u(),t.record("complete",`BST recovered! Swapped ${e} <-> ${r}`)}else u(),t.record("complete","No inversion found, the tree is already a valid BST");return t.getSteps()
}

export function RecoverBinarySearchTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RecoverBinarySearchTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRecoverBinarySearchTreeSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Recover Binary Search Tree"
      slug="recover-binary-search-tree"
      approaches={approaches}
      presets={RecoverBinarySearchTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Search in a Binary Search Tree (search-bst)
// ==========================================

const SearchBstTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def searchBST(self, root: Optional[TreeNode], val: int) -> Optional[TreeNode]:\n        # Walk down the tree using BST property\n        current = root\n        while current is not None:\n            if val == current.val:\n                return current\n            # Go left if target is smaller, right if larger\n            if val < current.val:\n                current = current.left\n            else:\n                current = current.right\n        # Target not found\n        return None",
    "lineMap": {
      "init": [
        4
      ],
      "visit_node": [
        5
      ],
      "check_value": [
        6
      ],
      "found": [
        6,
        7
      ],
      "go_left": [
        10
      ],
      "go_right": [
        12
      ],
      "not_found": [
        5
      ],
      "complete_found": [
        7
      ],
      "complete_not_found": [
        14
      ]
    },
    "conditionalMap": {
      "has_node": [
        5
      ],
      "is_match": [
        6
      ],
      "go_left": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode searchBST(TreeNode root, int val) {\n        // Walk down the tree using BST property\n        TreeNode current = root;\n        while (current != null) {\n            if (val == current.val) return current;\n            // Go left if target is smaller, right if larger\n            current = (val < current.val) ? current.left : current.right;\n        }\n        // Target not found\n        return null;\n    }\n}",
    "lineMap": {
      "init": [
        4
      ],
      "visit_node": [
        5
      ],
      "check_value": [
        6
      ],
      "found": [
        6
      ],
      "go_left": [
        8
      ],
      "go_right": [
        8
      ],
      "not_found": [
        5
      ],
      "complete_found": [
        6
      ],
      "complete_not_found": [
        11
      ]
    },
    "conditionalMap": {
      "has_node": [
        5
      ],
      "is_match": [
        6
      ],
      "go_left": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* searchBST(TreeNode* root, int val) {\n        // Walk down the tree using BST property\n        TreeNode* current = root;\n        while (current != nullptr) {\n            if (val == current->val) return current;\n            // Go left if target is smaller, right if larger\n            current = (val < current->val) ? current->left : current->right;\n        }\n        // Target not found\n        return nullptr;\n    }\n};",
    "lineMap": {
      "init": [
        5
      ],
      "visit_node": [
        6
      ],
      "check_value": [
        7
      ],
      "found": [
        7
      ],
      "go_left": [
        9
      ],
      "go_right": [
        9
      ],
      "not_found": [
        6
      ],
      "complete_found": [
        7
      ],
      "complete_not_found": [
        12
      ]
    },
    "conditionalMap": {
      "has_node": [
        6
      ],
      "is_match": [
        7
      ],
      "go_left": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var searchBST = function (root, val) {\n  // Walk down the tree using BST property\n  var current = root;\n  while (current !== null) {\n    if (val === current.val) return current;\n    // Go left if target is smaller, right if larger\n    current = val < current.val ? current.left : current.right;\n  }\n  // Target not found\n  return null;\n};",
    "lineMap": {
      "init": [
        3
      ],
      "visit_node": [
        4
      ],
      "check_value": [
        5
      ],
      "found": [
        5
      ],
      "go_left": [
        7
      ],
      "go_right": [
        7
      ],
      "not_found": [
        4
      ],
      "complete_found": [
        5
      ],
      "complete_not_found": [
        10
      ]
    },
    "conditionalMap": {
      "has_node": [
        4
      ],
      "is_match": [
        5
      ],
      "go_left": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function searchBST(root: TreeNode | null, val: number): TreeNode | null {\n    // Walk down the tree using BST property\n    let current = root;\n    while (current !== null) {\n        if (val === current.val) return current;\n        // Go left if target is smaller, right if larger\n        current = val < current.val ? current.left : current.right;\n    }\n    // Target not found\n    return null;\n}",
    "lineMap": {
      "init": [
        3
      ],
      "visit_node": [
        4
      ],
      "check_value": [
        5
      ],
      "found": [
        5
      ],
      "go_left": [
        7
      ],
      "go_right": [
        7
      ],
      "not_found": [
        4
      ],
      "complete_found": [
        5
      ],
      "complete_not_found": [
        10
      ]
    },
    "conditionalMap": {
      "has_node": [
        4
      ],
      "is_match": [
        5
      ],
      "go_left": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func searchBST(root *TreeNode, val int) *TreeNode {\n    // Walk down the tree using BST property\n    current := root\n    for current != nil {\n        if val == current.Val {\n            return current\n        }\n        // Go left if target is smaller, right if larger\n        if val < current.Val {\n            current = current.Left\n        } else {\n            current = current.Right\n        }\n    }\n    // Target not found\n    return nil\n}",
    "lineMap": {
      "init": [
        3
      ],
      "visit_node": [
        4
      ],
      "check_value": [
        5
      ],
      "found": [
        5,
        6
      ],
      "go_left": [
        10
      ],
      "go_right": [
        12
      ],
      "not_found": [
        4
      ],
      "complete_found": [
        6
      ],
      "complete_not_found": [
        16
      ]
    },
    "conditionalMap": {
      "has_node": [
        4
      ],
      "is_match": [
        5
      ],
      "go_left": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode SearchBST(TreeNode root, int val) {\n        // Walk down the tree using BST property\n        TreeNode current = root;\n        while (current != null) {\n            if (val == current.val) return current;\n            // Go left if target is smaller, right if larger\n            current = (val < current.val) ? current.left : current.right;\n        }\n        // Target not found\n        return null;\n    }\n}",
    "lineMap": {
      "init": [
        4
      ],
      "visit_node": [
        5
      ],
      "check_value": [
        6
      ],
      "found": [
        6
      ],
      "go_left": [
        8
      ],
      "go_right": [
        8
      ],
      "not_found": [
        5
      ],
      "complete_found": [
        6
      ],
      "complete_not_found": [
        11
      ]
    },
    "conditionalMap": {
      "has_node": [
        5
      ],
      "is_match": [
        6
      ],
      "go_left": [
        8
      ]
    }
  }
};

const SearchBstPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (Found)",
    "value": {
      "treeNodes": [
        4,
        2,
        7,
        1,
        3
      ],
      "target": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (Not Found)",
    "value": {
      "treeNodes": [
        4,
        2,
        7,
        1,
        3
      ],
      "target": 5
    }
  },
  {
    "id": "ex3",
    "label": "Example 3 (Large Tree)",
    "value": {
      "treeNodes": [
        8,
        3,
        10,
        1,
        6,
        null,
        14,
        null,
        null,
        4,
        7,
        null,
        null
      ],
      "target": 13
    }
  }
];

function generateSearchBstSteps(e: any): any[] {
  
let t=(0,l.createSearchBSTScene)(e),{recorder:r,nodeMap:n,target:o,childOf:a,updateNodeState:i,markSubtree:u}=t,{pushFrame:c,popFrame:s,clearFrames:d}=t;r.record("init",`Start: follow the BST ordering down to ${o}`);let f=e=>{if(null===e)return c(null),r.set_conditionals([{key:"is_null",result:!0}]),r.record("null_base",`Ran off the tree, ${o} is not here`),s(),null;let t=n.get(e).value;if(c(t),i(e,l.NODE_STATE.current),r.set_conditionals([{key:"is_null",result:!1}]),r.record("call",`Call searchBST(${t})`),t===o)return i(e,l.NODE_STATE.found),r.set_conditionals([{key:"is_match",result:!0}]),r.record("found",`${o} == ${t}, return this node`),s(),e;r.set_conditionals([{key:"is_match",result:!1}]),r.record("check_value",`${o} != ${t}, use the ordering to pick a side`);let d=o<t,h=a(e,d?"left":"right");u(a(e,d?"right":"left"),l.NODE_STATE.discarded),i(e,l.NODE_STATE.onPath),r.set_conditionals([{key:"go_left",result:d}]),r.record(d?"go_left":"go_right",d?`${o} < ${t}, discard the right subtree and recurse left`:`${o} > ${t}, discard the left subtree and recurse right`);let _=f(h);return s(),_},h=f(n.has(0)?0:null);return d(),null!==h?(r.update_variable("result",n.get(h).value),r.record("complete_found",`Search complete: found the node with value ${o}`)):r.record("complete_not_found",`Search complete: ${o} is not in the tree`),r.getSteps()
}

export function SearchBstProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SearchBstTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSearchBstSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => (
        <ProblemVisualizerWrapper visualState={step.data || {}} height={260} />
      ),
    },
  ];

  return (
    <ProblemViewerShell
      title="Search in a Binary Search Tree"
      slug="search-bst"
      approaches={approaches}
      presets={SearchBstPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
