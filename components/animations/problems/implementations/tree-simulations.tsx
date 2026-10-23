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
// Binary Tree Level Order Traversal (binary-tree-level-order-traversal)
// ==========================================

const BinaryTreeLevelOrderTraversalTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        if not root:\n            return []\n\n        result = []\n        queue = deque([root])\n\n        while queue:\n            level_size = len(queue)\n            current_level = []\n\n            # Process all nodes at the current level\n            for _ in range(level_size):\n                node = queue.popleft()\n                current_level.append(node.val)\n\n                # Enqueue children for the next level\n                if node.left:\n                    queue.append(node.left)\n                if node.right:\n                    queue.append(node.right)\n\n            result.append(current_level)\n\n        return result",
    "lineMap": {
      "start": [
        2
      ],
      "empty_tree": [
        3,
        4
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        10,
        11
      ],
      "dequeue_node": [
        15,
        16
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        21
      ],
      "enqueue_right": [
        22
      ],
      "complete_level": [
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> result = new ArrayList<>();\n        if (root == null) return result;\n\n        Queue<TreeNode> queue = new LinkedList<>();\n        queue.offer(root);\n\n        while (!queue.isEmpty()) {\n            int levelSize = queue.size();\n            List<Integer> currentLevel = new ArrayList<>();\n\n            // Process all nodes at the current level\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode node = queue.poll();\n                currentLevel.add(node.val);\n\n                // Enqueue children for the next level\n                if (node.left != null) queue.offer(node.left);\n                if (node.right != null) queue.offer(node.right);\n            }\n\n            result.add(currentLevel);\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "empty_tree": [
        4
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        10,
        11
      ],
      "dequeue_node": [
        15,
        16
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        19
      ],
      "highlight_right": [
        20
      ],
      "enqueue_right": [
        20
      ],
      "complete_level": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        vector<vector<int>> result;\n        if (root == nullptr) return result;\n\n        queue<TreeNode*> q;\n        q.push(root);\n\n        while (!q.empty()) {\n            int levelSize = q.size();\n            vector<int> currentLevel;\n\n            // Process all nodes at the current level\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode* node = q.front();\n                q.pop();\n                currentLevel.push_back(node->val);\n\n                // Enqueue children for the next level\n                if (node->left) q.push(node->left);\n                if (node->right) q.push(node->right);\n            }\n\n            result.push_back(currentLevel);\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "start": [
        3,
        4
      ],
      "empty_tree": [
        5
      ],
      "init_queue": [
        7,
        8
      ],
      "start_level": [
        11,
        12
      ],
      "dequeue_node": [
        16,
        17,
        18
      ],
      "highlight_left": [
        21
      ],
      "enqueue_left": [
        21
      ],
      "highlight_right": [
        22
      ],
      "enqueue_right": [
        22
      ],
      "complete_level": [
        25
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "queue": [
        10
      ],
      "for_loop": [
        15
      ],
      "enqueue_left": [
        21
      ],
      "enqueue_right": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var levelOrder = function(root) {\n    var result = [];\n    if (root === null) return result;\n\n    // Head index instead of shift(): Array.prototype.shift is O(n)\n    var queue = [root];\n    var head = 0;\n\n    while (head < queue.length) {\n        var levelSize = queue.length - head;\n        var currentLevel = [];\n\n        // Process all nodes at the current level\n        for (var i = 0; i < levelSize; i++) {\n            var node = queue[head++];\n            currentLevel.push(node.val);\n\n            // Enqueue children for the next level\n            if (node.left !== null) queue.push(node.left);\n            if (node.right !== null) queue.push(node.right);\n        }\n\n        result.push(currentLevel);\n    }\n\n    return result;\n};",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        10,
        11
      ],
      "dequeue_node": [
        15,
        16
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        19
      ],
      "highlight_right": [
        20
      ],
      "enqueue_right": [
        20
      ],
      "complete_level": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function levelOrder(root: TreeNode | null): number[][] {\n    const result: number[][] = [];\n    if (root === null) return result;\n\n    // Head index instead of shift(): Array.prototype.shift is O(n)\n    const queue: TreeNode[] = [root];\n    let head = 0;\n\n    while (head < queue.length) {\n        const levelSize = queue.length - head;\n        const currentLevel: number[] = [];\n\n        // Process all nodes at the current level\n        for (let i = 0; i < levelSize; i++) {\n            const node = queue[head++];\n            currentLevel.push(node.val);\n\n            // Enqueue children for the next level\n            if (node.left !== null) queue.push(node.left);\n            if (node.right !== null) queue.push(node.right);\n        }\n\n        result.push(currentLevel);\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        10,
        11
      ],
      "dequeue_node": [
        15,
        16
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        19
      ],
      "highlight_right": [
        20
      ],
      "enqueue_right": [
        20
      ],
      "complete_level": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<IList<int>> LevelOrder(TreeNode root) {\n        IList<IList<int>> result = new List<IList<int>>();\n        if (root == null) return result;\n\n        Queue<TreeNode> queue = new Queue<TreeNode>();\n        queue.Enqueue(root);\n\n        while (queue.Count > 0) {\n            int levelSize = queue.Count;\n            IList<int> currentLevel = new List<int>();\n\n            // Process all nodes at the current level\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode node = queue.Dequeue();\n                currentLevel.Add(node.val);\n\n                // Enqueue children for the next level\n                if (node.left != null) queue.Enqueue(node.left);\n                if (node.right != null) queue.Enqueue(node.right);\n            }\n\n            result.Add(currentLevel);\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "empty_tree": [
        4
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        10,
        11
      ],
      "dequeue_node": [
        15,
        16
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        19
      ],
      "highlight_right": [
        20
      ],
      "enqueue_right": [
        20
      ],
      "complete_level": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func levelOrder(root *TreeNode) [][]int {\n    result := [][]int{}\n    if root == nil {\n        return result\n    }\n\n    queue := []*TreeNode{root}\n\n    for len(queue) > 0 {\n        levelSize := len(queue)\n        currentLevel := []int{}\n\n        // Process all nodes at the current level\n        for i := 0; i < levelSize; i++ {\n            node := queue[0]\n            queue = queue[1:]\n            currentLevel = append(currentLevel, node.Val)\n\n            // Enqueue children for the next level\n            if node.Left != nil {\n                queue = append(queue, node.Left)\n            }\n            if node.Right != nil {\n                queue = append(queue, node.Right)\n            }\n        }\n\n        result = append(result, currentLevel)\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3,
        4
      ],
      "init_queue": [
        7
      ],
      "start_level": [
        10,
        11
      ],
      "dequeue_node": [
        15,
        16,
        17
      ],
      "highlight_left": [
        20
      ],
      "enqueue_left": [
        21
      ],
      "highlight_right": [
        23
      ],
      "enqueue_right": [
        24
      ],
      "complete_level": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        20
      ],
      "enqueue_right": [
        23
      ]
    }
  }
};

const BinaryTreeLevelOrderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Complete Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Four Levels",
    "value": {
      "tree": [
        4,
        7,
        9,
        1,
        5,
        8,
        12,
        3,
        2,
        6,
        10,
        null,
        null,
        11,
        14
      ]
    }
  }
];

function generateBinaryTreeLevelOrderTraversalSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let i=(e,t)=>{let l=r.get(e);return{type:"binaryTreeNode",value:l.value,parent:void 0!==l.parent?`node_${l.parent}`:void 0,isLeftChild:l.isLeftChild,state:t}},a={};r.forEach((e,t)=>{a[`node_${t}`]=i(t)});let u=new StepRecorder({root:(0,_treeHelper848569.kU)(r.get(0)),result:[],queue:[],level:void 0,level_size:void 0,current_level:void 0,i:void 0,node:void 0},{...a});if(u.record("start","Start: BFS with level-size counting, the queue holds one level at a time"),0===r.size)return u.update_variable("result",[]),u.record("empty_tree","Root is null, return an empty list"),u.getSteps();let o=[],d=[0],s=0;u.update_variable("level",s),u.update_variable("queue",[r.get(0).value]),u.update_visual("node_0",i(0,"queued")),u.add_new_visual("queue_n0",{type:"queueElement",value:r.get(0).value,position:0,state:"queued"}),u.record("init_queue",`Create a queue and add the root: queue = [${r.get(0).value}]`);let h=-1;for(;d.length>0;){let e=d.length,l=[],a=[];u.update_variable("level",s),u.update_variable("level_size",e),u.update_variable("current_level",[]),u.add_conditional("queue",!0),u.record("start_level",`Level ${s}: record level_size = ${e} (${e} node${e>1?"s":""} in this level), current_level = []`);for(let o=0;o<e;o++){let e=d.shift(),s=r.get(e);a.push(e),h>=0&&u.update_visual(`node_${h}`,i(h,"collected")),u.update_visual(`node_${e}`,i(e,"current")),h=e;for(let e=0;e<d.length;e++)u.update_visual(`queue_n${d[e]}`,{type:"queueElement",value:r.get(d[e]).value,position:e,state:"queued"});u.delete_visual(`queue_n${e}`),l.push(s.value),u.update_variable("queue",d.map(e=>r.get(e).value)),u.update_variable("current_level",[...l]),u.update_variable("i",o),u.update_variable("node",(0,_treeHelper848569.kU)(s)),u.update_variable("currentIdx",e),u.add_conditional("for_loop",!0),u.record("dequeue_node",`Dequeue ${s.value} and add its value to current_level`);let c=2*e+1,p=2*e+2;if(c<t.length&&null!==t[c]){let e=r.get(c);u.update_variable("enqueuedIdx",c),u.update_variable("enqueuedVal",e.value),u.add_conditional("enqueue_left",!0),u.record("highlight_left",`${s.value} has a left child: ${e.value}`),d.push(c),u.update_visual(`node_${c}`,i(c,"queued")),u.add_new_visual(`queue_n${c}`,{type:"queueElement",value:e.value,position:d.length-1,state:"queued"}),u.update_variable("queue",d.map(e=>r.get(e).value)),u.record("enqueue_left",`Enqueue left child ${e.value} for the next level`)}if(p<t.length&&null!==t[p]){let e=r.get(p);u.update_variable("enqueuedIdx",p),u.update_variable("enqueuedVal",e.value),u.add_conditional("enqueue_right",!0),u.record("highlight_right",`${s.value} has a right child: ${e.value}`),d.push(p),u.update_visual(`node_${p}`,i(p,"queued")),u.add_new_visual(`queue_n${p}`,{type:"queueElement",value:e.value,position:d.length-1,state:"queued"}),u.update_variable("queue",d.map(e=>r.get(e).value)),u.record("enqueue_right",`Enqueue right child ${e.value} for the next level`)}}u.add_conditional("for_loop",!1),o.push([...l]),a.forEach(e=>{u.update_visual(`node_${e}`,i(e,"done"))}),h=-1,u.update_variable("result",o.map(e=>[...e])),u.record("complete_level",`Level ${s} done: add current_level [${l.join(", ")}] to result`),s++,u.update_variable("level",s)}return u.add_conditional("queue",!1),u.record("complete",`Queue is empty, return result: [${o.map(e=>`[${e.join(", ")}]`).join(", ")}]`),u.getSteps()
}

export function BinaryTreeLevelOrderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreeLevelOrderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreeLevelOrderTraversalSteps(e) as any[];
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
      title="Binary Tree Level Order Traversal"
      slug="binary-tree-level-order-traversal"
      approaches={approaches}
      presets={BinaryTreeLevelOrderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Tree Right Side View (binary-tree-right-side-view)
// ==========================================

const BinaryTreeRightSideViewTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:\n        result = []\n        if not root:\n            return result\n\n        queue = deque([root])\n\n        while queue:\n            level_size = len(queue)\n\n            for i in range(level_size):\n                node = queue.popleft()\n\n                # The last node in this level is the right side view\n                if i == level_size - 1:\n                    result.append(node.val)\n\n                if node.left:\n                    queue.append(node.left)\n                if node.right:\n                    queue.append(node.right)\n\n        return result",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "empty_tree": [
        4,
        5
      ],
      "init_queue": [
        7
      ],
      "start_level": [
        9,
        10
      ],
      "dequeue_node": [
        13
      ],
      "mark_rightmost": [
        16
      ],
      "add_to_result": [
        17
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        21
      ],
      "enqueue_right": [
        22
      ],
      "complete_level": [
        9
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "last_in_level": [
        16
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Integer> rightSideView(TreeNode root) {\n        List<Integer> result = new ArrayList<>();\n        if (root == null) return result;\n\n        Queue<TreeNode> queue = new LinkedList<>();\n        queue.offer(root);\n\n        while (!queue.isEmpty()) {\n            int levelSize = queue.size();\n\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode node = queue.poll();\n\n                // The last node in this level is the right side view\n                if (i == levelSize - 1) {\n                    result.add(node.val);\n                }\n\n                if (node.left != null) queue.offer(node.left);\n                if (node.right != null) queue.offer(node.right);\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "empty_tree": [
        4
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        9,
        10
      ],
      "dequeue_node": [
        13
      ],
      "mark_rightmost": [
        16
      ],
      "add_to_result": [
        17
      ],
      "highlight_left": [
        20
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        21
      ],
      "enqueue_right": [
        21
      ],
      "complete_level": [
        9
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "last_in_level": [
        16
      ],
      "enqueue_left": [
        20
      ],
      "enqueue_right": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> rightSideView(TreeNode* root) {\n        vector<int> result;\n        if (root == nullptr) return result;\n\n        queue<TreeNode*> q;\n        q.push(root);\n\n        while (!q.empty()) {\n            int levelSize = q.size();\n\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode* node = q.front();\n                q.pop();\n\n                // The last node in this level is the right side view\n                if (i == levelSize - 1) {\n                    result.push_back(node->val);\n                }\n\n                if (node->left != nullptr) q.push(node->left);\n                if (node->right != nullptr) q.push(node->right);\n            }\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "start": [
        3,
        4
      ],
      "empty_tree": [
        5
      ],
      "init_queue": [
        7,
        8
      ],
      "start_level": [
        10,
        11
      ],
      "dequeue_node": [
        14,
        15
      ],
      "mark_rightmost": [
        18
      ],
      "add_to_result": [
        19
      ],
      "highlight_left": [
        22
      ],
      "enqueue_left": [
        22
      ],
      "highlight_right": [
        23
      ],
      "enqueue_right": [
        23
      ],
      "complete_level": [
        10
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "queue": [
        10
      ],
      "for_loop": [
        13
      ],
      "last_in_level": [
        18
      ],
      "enqueue_left": [
        22
      ],
      "enqueue_right": [
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var rightSideView = function (root) {\n    const result = [];\n    if (root === null) return result;\n\n    // Array.shift() is O(n), so use a head index for O(1) dequeues\n    const queue = [root];\n    let head = 0;\n\n    while (head < queue.length) {\n        const levelEnd = queue.length;\n\n        while (head < levelEnd) {\n            const node = queue[head++];\n\n            // The last node in this level is the right side view\n            if (head === levelEnd) {\n                result.push(node.val);\n            }\n\n            if (node.left !== null) queue.push(node.left);\n            if (node.right !== null) queue.push(node.right);\n        }\n    }\n\n    return result;\n};",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        9,
        10
      ],
      "dequeue_node": [
        13
      ],
      "mark_rightmost": [
        16
      ],
      "add_to_result": [
        17
      ],
      "highlight_left": [
        20
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        21
      ],
      "enqueue_right": [
        21
      ],
      "complete_level": [
        9
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "last_in_level": [
        16
      ],
      "enqueue_left": [
        20
      ],
      "enqueue_right": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rightSideView(root: TreeNode | null): number[] {\n    const result: number[] = [];\n    if (root === null) return result;\n\n    // Array.shift() is O(n), so use a head index for O(1) dequeues\n    const queue: TreeNode[] = [root];\n    let head = 0;\n\n    while (head < queue.length) {\n        const levelEnd = queue.length;\n\n        while (head < levelEnd) {\n            const node = queue[head++];\n\n            // The last node in this level is the right side view\n            if (head === levelEnd) {\n                result.push(node.val);\n            }\n\n            if (node.left !== null) queue.push(node.left);\n            if (node.right !== null) queue.push(node.right);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        9,
        10
      ],
      "dequeue_node": [
        13
      ],
      "mark_rightmost": [
        16
      ],
      "add_to_result": [
        17
      ],
      "highlight_left": [
        20
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        21
      ],
      "enqueue_right": [
        21
      ],
      "complete_level": [
        9
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "last_in_level": [
        16
      ],
      "enqueue_left": [
        20
      ],
      "enqueue_right": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<int> RightSideView(TreeNode root) {\n        List<int> result = new List<int>();\n        if (root == null) return result;\n\n        Queue<TreeNode> queue = new Queue<TreeNode>();\n        queue.Enqueue(root);\n\n        while (queue.Count > 0) {\n            int levelSize = queue.Count;\n\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode node = queue.Dequeue();\n\n                // The last node in this level is the right side view\n                if (i == levelSize - 1) {\n                    result.Add(node.val);\n                }\n\n                if (node.left != null) queue.Enqueue(node.left);\n                if (node.right != null) queue.Enqueue(node.right);\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "empty_tree": [
        4
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        9,
        10
      ],
      "dequeue_node": [
        13
      ],
      "mark_rightmost": [
        16
      ],
      "add_to_result": [
        17
      ],
      "highlight_left": [
        20
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        21
      ],
      "enqueue_right": [
        21
      ],
      "complete_level": [
        9
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "last_in_level": [
        16
      ],
      "enqueue_left": [
        20
      ],
      "enqueue_right": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rightSideView(root *TreeNode) []int {\n    result := []int{}\n    if root == nil {\n        return result\n    }\n\n    queue := []*TreeNode{root}\n\n    for len(queue) > 0 {\n        levelSize := len(queue)\n\n        for i := 0; i < levelSize; i++ {\n            node := queue[0]\n            queue = queue[1:]\n\n            // The last node in this level is the right side view\n            if i == levelSize-1 {\n                result = append(result, node.Val)\n            }\n\n            if node.Left != nil {\n                queue = append(queue, node.Left)\n            }\n            if node.Right != nil {\n                queue = append(queue, node.Right)\n            }\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3,
        4
      ],
      "init_queue": [
        7
      ],
      "start_level": [
        9,
        10
      ],
      "dequeue_node": [
        13,
        14
      ],
      "mark_rightmost": [
        17
      ],
      "add_to_result": [
        18
      ],
      "highlight_left": [
        21
      ],
      "enqueue_left": [
        22
      ],
      "highlight_right": [
        24
      ],
      "enqueue_right": [
        25
      ],
      "complete_level": [
        9
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "last_in_level": [
        17
      ],
      "enqueue_left": [
        21
      ],
      "enqueue_right": [
        24
      ]
    }
  }
};

const BinaryTreeRightSideViewPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        1,
        2,
        3,
        null,
        5,
        null,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Complete Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Left Skewed",
    "value": {
      "tree": [
        1,
        2,
        null,
        3,
        null,
        4,
        null
      ]
    }
  }
];

function generateBinaryTreeRightSideViewSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),i=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(i.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);i.has(t)&&(i.get(e).parent=t,i.get(e).isLeftChild=e%2==1)}let n=(e,t)=>{let l=i.get(e);return{type:"binaryTreeNode",value:l.value,parent:void 0!==l.parent?`node_${l.parent}`:void 0,isLeftChild:l.isLeftChild,state:t}},a={};i.forEach((e,t)=>{a[`node_${t}`]=n(t)});let o=new StepRecorder({root:(0,_treeHelper848569.kU)(i.get(0)),result:[],queue:[],level:void 0,level_size:void 0,i:void 0,current_node:void 0},{...a});if(o.record("start","Start: create an empty result list; the last node of every level is the right side view"),0===i.size)return o.record("empty_tree","root is null, return the empty result []"),o.getSteps();let u=[],s=[0],d=0,h=()=>s.map(e=>i.get(e).value);for(o.update_variable("level",d),o.update_variable("queue",h()),o.update_visual("node_0",n(0,"queued")),o.add_new_visual("queue_n0",{type:"queueElement",value:i.get(0).value,position:0,state:"queued"}),o.record("init_queue",`Create a queue and add the root: queue = [${i.get(0).value}]`);s.length>0;){let e=s.length,l=-1;o.update_variable("level",d),o.update_variable("level_size",e),o.update_variable("i",void 0),o.update_variable("rightmostIdx",-1),o.update_variable("rightmostVal",null),o.add_conditional("queue",!0),o.record("start_level",`Queue is not empty. Level ${d}: levelSize = ${e}, process exactly ${e} node${e>1?"s":""}`);for(let a=0;a<e;a++){let c=s.shift(),f=i.get(c),g=a===e-1;l>=0&&o.update_visual(`node_${l}`,n(l,"processed")),o.update_visual(`node_${c}`,n(c,"current")),l=c;for(let e=0;e<s.length;e++)o.update_visual(`queue_n${s[e]}`,{type:"queueElement",value:i.get(s[e]).value,position:e,state:"queued"});o.delete_visual(`queue_n${c}`),o.update_variable("queue",h()),o.update_variable("i",a),o.update_variable("current_node",(0,_treeHelper848569.kU)(f)),o.update_variable("currentIdx",c),o.update_variable("rightmostIdx",c),o.update_variable("rightmostVal",f.value),o.add_conditional("for_loop",!0),o.record("dequeue_node",`i = ${a}: dequeue node ${f.value} (node ${a+1} of ${e} in level ${d})`),o.add_conditional("last_in_level",g),g&&(o.update_visual(`node_${c}`,n(c,"picked")),o.record("mark_rightmost",`i == levelSize - 1: node ${f.value} is the last node in level ${d}, so it is visible from the right side`),u.push(f.value),o.update_variable("result",[...u]),o.record("add_to_result",`Add ${f.value} to result: [${u.join(", ")}]`));let p=2*c+1,x=2*c+2;if(p<t.length&&null!==t[p]){let e=i.get(p);o.update_variable("enqueuedIdx",p),o.update_variable("enqueuedVal",e.value),o.add_conditional("enqueue_left",!0),o.record("highlight_left",`Node ${f.value} has a left child: ${e.value}`),s.push(p),o.update_visual(`node_${p}`,n(p,"queued")),o.add_new_visual(`queue_n${p}`,{type:"queueElement",value:e.value,position:s.length-1,state:"queued"}),o.update_variable("queue",h()),o.record("enqueue_left",`Enqueue left child ${e.value}: queue = [${h().join(", ")}]`)}if(x<t.length&&null!==t[x]){let e=i.get(x);o.update_variable("enqueuedIdx",x),o.update_variable("enqueuedVal",e.value),o.add_conditional("enqueue_right",!0),o.record("highlight_right",`Node ${f.value} has a right child: ${e.value}`),s.push(x),o.update_visual(`node_${x}`,n(x,"queued")),o.add_new_visual(`queue_n${x}`,{type:"queueElement",value:e.value,position:s.length-1,state:"queued"}),o.update_variable("queue",h()),o.record("enqueue_right",`Enqueue right child ${e.value}: queue = [${h().join(", ")}]`)}}o.add_conditional("for_loop",!1),d++,o.update_variable("level",d),o.record("complete_level",`Level ${d-1} complete, queue = [${h().join(", ")}]; check the queue again`)}return o.add_conditional("queue",!1),o.record("complete",`Queue is empty. Return result: [${u.join(", ")}]`),o.getSteps()
}

export function BinaryTreeRightSideViewProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreeRightSideViewTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreeRightSideViewSteps(e) as any[];
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
      title="Binary Tree Right Side View"
      slug="binary-tree-right-side-view"
      approaches={approaches}
      presets={BinaryTreeRightSideViewPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Tree Zigzag Level Order Traversal (binary-tree-zigzag-level-order-traversal)
// ==========================================

const BinaryTreeZigzagLevelOrderTraversalTemplates = {
  "python": {
    "language": "python",
    "code": "def zigzagLevelOrder(root):\n  if not root:\n    return []\n\n  result = []\n  queue = [root]\n  level = 0\n\n  while queue:\n    level_size = len(queue)\n    current_level = []\n\n    for i in range(level_size):\n      node = queue.pop(0)\n      current_level.append(node.val)\n\n      if node.left:\n        queue.append(node.left)\n      if node.right:\n        queue.append(node.right)\n\n    # Reverse if odd level (right-to-left)\n    if level % 2 == 1:\n      current_level.reverse()\n\n    result.append(current_level)\n    level += 1\n\n  return result",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queue": [
        5,
        6,
        7
      ],
      "start_level": [
        10,
        11
      ],
      "dequeue_node": [
        14,
        15
      ],
      "add_to_level": [
        14
      ],
      "highlight_left": [
        17
      ],
      "enqueue_left": [
        18
      ],
      "highlight_right": [
        19
      ],
      "enqueue_right": [
        20
      ],
      "reverse_level": [
        24
      ],
      "complete_level": [
        26,
        27
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "queue": [
        9
      ],
      "for_loop": [
        13
      ],
      "enqueue_left": [
        17
      ],
      "enqueue_right": [
        19
      ],
      "reverse_level": [
        23
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> zigzagLevelOrder(TreeNode root) {\n    if (root == null) {\n        return new ArrayList<>();\n    }\n\n    List<List<Integer>> result = new ArrayList<>();\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.offer(root);\n    int level = 0;\n\n    while (!queue.isEmpty()) {\n        int levelSize = queue.size();\n        List<Integer> currentLevel = new ArrayList<>();\n\n        for (int i = 0; i < levelSize; i++) {\n            TreeNode node = queue.poll();\n            currentLevel.add(node.val);\n\n            if (node.left != null) {\n                queue.offer(node.left);\n            }\n            if (node.right != null) {\n                queue.offer(node.right);\n            }\n        }\n\n        // Reverse if odd level (right-to-left)\n        if (level % 2 == 1) {\n            Collections.reverse(currentLevel);\n        }\n\n        result.add(currentLevel);\n        level++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queue": [
        6,
        7,
        8,
        9
      ],
      "start_level": [
        12,
        13
      ],
      "dequeue_node": [
        16,
        17
      ],
      "add_to_level": [
        16
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        22
      ],
      "enqueue_right": [
        23
      ],
      "reverse_level": [
        29
      ],
      "complete_level": [
        32,
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "queue": [
        11
      ],
      "for_loop": [
        15
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        22
      ],
      "reverse_level": [
        28
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> zigzagLevelOrder(TreeNode* root) {\n    if (root == nullptr) {\n        return {};\n    }\n\n    vector<vector<int>> result;\n    queue<TreeNode*> q;\n    q.push(root);\n    int level = 0;\n\n    while (!q.empty()) {\n        int levelSize = q.size();\n        vector<int> currentLevel;\n\n        for (int i = 0; i < levelSize; i++) {\n            TreeNode* node = q.front();\n            q.pop();\n            currentLevel.push_back(node->val);\n\n            if (node->left != nullptr) {\n                q.push(node->left);\n            }\n            if (node->right != nullptr) {\n                q.push(node->right);\n            }\n        }\n\n        // Reverse if odd level (right-to-left)\n        if (level % 2 == 1) {\n            reverse(currentLevel.begin(), currentLevel.end());\n        }\n\n        result.push_back(currentLevel);\n        level++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queue": [
        6,
        7,
        8,
        9
      ],
      "start_level": [
        12,
        13
      ],
      "dequeue_node": [
        16,
        17,
        18
      ],
      "add_to_level": [
        16,
        17
      ],
      "highlight_left": [
        20
      ],
      "enqueue_left": [
        21
      ],
      "highlight_right": [
        23
      ],
      "enqueue_right": [
        24
      ],
      "reverse_level": [
        30
      ],
      "complete_level": [
        33,
        34
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "queue": [
        11
      ],
      "for_loop": [
        15
      ],
      "enqueue_left": [
        20
      ],
      "enqueue_right": [
        23
      ],
      "reverse_level": [
        29
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> ZigzagLevelOrder(TreeNode root) {\n    if (root == null) {\n        return new List<IList<int>>();\n    }\n\n    var result = new List<IList<int>>();\n    var queue = new Queue<TreeNode>();\n    queue.Enqueue(root);\n    int level = 0;\n\n    while (queue.Count > 0) {\n        int levelSize = queue.Count;\n        var currentLevel = new List<int>();\n\n        for (int i = 0; i < levelSize; i++) {\n            TreeNode node = queue.Dequeue();\n            currentLevel.Add(node.val);\n\n            if (node.left != null) {\n                queue.Enqueue(node.left);\n            }\n            if (node.right != null) {\n                queue.Enqueue(node.right);\n            }\n        }\n\n        // Reverse if odd level (right-to-left)\n        if (level % 2 == 1) {\n            currentLevel.Reverse();\n        }\n\n        result.Add(currentLevel);\n        level++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queue": [
        6,
        7,
        8,
        9
      ],
      "start_level": [
        12,
        13
      ],
      "dequeue_node": [
        16,
        17
      ],
      "add_to_level": [
        16
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        22
      ],
      "enqueue_right": [
        23
      ],
      "reverse_level": [
        29
      ],
      "complete_level": [
        32,
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "queue": [
        11
      ],
      "for_loop": [
        15
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        22
      ],
      "reverse_level": [
        28
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func zigzagLevelOrder(root *TreeNode) [][]int {\n    if root == nil {\n        return [][]int{}\n    }\n\n    result := [][]int{}\n    queue := []*TreeNode{root}\n    level := 0\n\n    for len(queue) > 0 {\n        levelSize := len(queue)\n        currentLevel := []int{}\n\n        for i := 0; i < levelSize; i++ {\n            node := queue[0]\n            queue = queue[1:]\n            currentLevel = append(currentLevel, node.Val)\n\n            if node.Left != nil {\n                queue = append(queue, node.Left)\n            }\n            if node.Right != nil {\n                queue = append(queue, node.Right)\n            }\n        }\n\n        // Reverse if odd level (right-to-left)\n        if level%2 == 1 {\n            for i, j := 0, len(currentLevel)-1; i < j; i, j = i+1, j-1 {\n                currentLevel[i], currentLevel[j] = currentLevel[j], currentLevel[i]\n            }\n        }\n\n        result = append(result, currentLevel)\n        level++\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "start_level": [
        11,
        12
      ],
      "dequeue_node": [
        15,
        16,
        17
      ],
      "add_to_level": [
        15,
        16
      ],
      "highlight_left": [
        19
      ],
      "enqueue_left": [
        20
      ],
      "highlight_right": [
        22
      ],
      "enqueue_right": [
        23
      ],
      "reverse_level": [
        29,
        30,
        31
      ],
      "complete_level": [
        35,
        36
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "queue": [
        10
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        19
      ],
      "enqueue_right": [
        22
      ],
      "reverse_level": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function zigzagLevelOrder(root) {\n    if (root === null) {\n        return [];\n    }\n\n    const result = [];\n    const queue = [root];\n    let level = 0;\n\n    while (queue.length > 0) {\n        const levelSize = queue.length;\n        const currentLevel = [];\n\n        for (let i = 0; i < levelSize; i++) {\n            const node = queue.shift();\n            currentLevel.push(node.val);\n\n            if (node.left !== null) {\n                queue.push(node.left);\n            }\n            if (node.right !== null) {\n                queue.push(node.right);\n            }\n        }\n\n        // Reverse if odd level (right-to-left)\n        if (level % 2 === 1) {\n            currentLevel.reverse();\n        }\n\n        result.push(currentLevel);\n        level++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "start_level": [
        11,
        12
      ],
      "dequeue_node": [
        15,
        16
      ],
      "add_to_level": [
        15
      ],
      "highlight_left": [
        18
      ],
      "enqueue_left": [
        19
      ],
      "highlight_right": [
        21
      ],
      "enqueue_right": [
        22
      ],
      "reverse_level": [
        28
      ],
      "complete_level": [
        31,
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "queue": [
        10
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        18
      ],
      "enqueue_right": [
        21
      ],
      "reverse_level": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function zigzagLevelOrder(root: TreeNode | null): number[][] {\n    if (root === null) {\n        return [];\n    }\n\n    const result: number[][] = [];\n    const queue: TreeNode[] = [root];\n    let level = 0;\n\n    while (queue.length > 0) {\n        const levelSize = queue.length;\n        const currentLevel: number[] = [];\n\n        for (let i = 0; i < levelSize; i++) {\n            const node = queue.shift()!;\n            currentLevel.push(node.val);\n\n            if (node.left !== null) {\n                queue.push(node.left);\n            }\n            if (node.right !== null) {\n                queue.push(node.right);\n            }\n        }\n\n        // Reverse if odd level (right-to-left)\n        if (level % 2 === 1) {\n            currentLevel.reverse();\n        }\n\n        result.push(currentLevel);\n        level++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "start_level": [
        11,
        12
      ],
      "dequeue_node": [
        15,
        16
      ],
      "add_to_level": [
        15
      ],
      "highlight_left": [
        18
      ],
      "enqueue_left": [
        19
      ],
      "highlight_right": [
        21
      ],
      "enqueue_right": [
        22
      ],
      "reverse_level": [
        28
      ],
      "complete_level": [
        31,
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "queue": [
        10
      ],
      "for_loop": [
        14
      ],
      "enqueue_left": [
        18
      ],
      "enqueue_right": [
        21
      ],
      "reverse_level": [
        27
      ]
    }
  }
};

const BinaryTreeZigzagLevelOrderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        null,
        null,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Four Levels",
    "value": {
      "tree": [
        4,
        7,
        9,
        1,
        5,
        8,
        12,
        3,
        2,
        6,
        10,
        null,
        null,
        11,
        14
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single Node",
    "value": {
      "tree": [
        1
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Empty Tree",
    "value": {
      "tree": []
    }
  }
];

function generateBinaryTreeZigzagLevelOrderTraversalSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),l=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(l.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);l.has(t)&&(l.get(e).parent=t,l.get(e).isLeftChild=e%2==1)}let n=(e,t)=>{let r=l.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,state:t}},a={};l.forEach((e,t)=>{a[`node_${t}`]=n(t)});let o=new StepRecorder({result:[],depth:void 0,currentIdx:void 0,insertSide:void 0,maxDepth:void 0},{...a});if(o.record("start","Start: pre-order DFS; append on even depths, insert front on odd"),0===l.size)return o.update_variable("result",[]),o.record("empty_tree","Empty tree, return []"),o.getSteps();let u=Math.max(...Array.from(l.keys()).map(e=>Math.floor(Math.log2(e+1))));o.update_variable("maxDepth",u);let d=[],s=-1;return!function e(t,r){if(!l.has(t))return;let i=l.get(t);r===d.length&&d.push([]);let a=r%2==0?"back":"front";"back"===a?d[r].push(i.value):d[r].unshift(i.value),s>=0&&o.update_visual(`node_${s}`,n(s,"collected")),o.update_visual(`node_${t}`,n(t,"current")),s=t,o.update_variable("depth",r),o.update_variable("currentIdx",t),o.update_variable("insertSide",a),o.update_variable("result",d.map(e=>[...e])),o.record("visit",`Visit ${i.value} at depth ${r}: insert at ${a} of result[${r}]`),e(2*t+1,r+1),e(2*t+2,r+1)}(0,0),l.forEach((e,t)=>o.update_visual(`node_${t}`,n(t,"done"))),o.update_variable("depth",-1),o.update_variable("result",d.map(e=>[...e])),o.record("complete",`Zigzag traversal complete: [${d.map(e=>`[${e.join(", ")}]`).join(", ")}]`),o.getSteps()
}

export function BinaryTreeZigzagLevelOrderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreeZigzagLevelOrderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreeZigzagLevelOrderTraversalSteps(e) as any[];
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
      title="Binary Tree Zigzag Level Order Traversal"
      slug="binary-tree-zigzag-level-order-traversal"
      approaches={approaches}
      presets={BinaryTreeZigzagLevelOrderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Populating Next Right Pointers in Each Node II (populating-next-right-pointers-in-each-node-ii)
// ==========================================

const PopulatingNextRightPointersInEachNodeIiTemplates = {
  "python": {
    "language": "python",
    "code": "def connect(root):\n  if not root:\n    return root\n\n  queue = [root]\n  level = 0\n\n  while queue:\n    level_size = len(queue)\n\n    for i in range(level_size):\n      current = queue.pop(0)\n\n      # Connect to next node in level\n      if i < level_size - 1:\n        current.next = queue[0]\n\n      # Add children to queue\n      if current.left:\n        queue.append(current.left)\n      if current.right:\n        queue.append(current.right)\n\n    level += 1\n\n  return root",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        5,
        6
      ],
      "start_level": [
        9
      ],
      "process_node": [
        12
      ],
      "connect_next": [
        16
      ],
      "connect_null": [
        16
      ],
      "enqueue_left": [
        20
      ],
      "enqueue_right": [
        22
      ],
      "complete_level": [
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_empty_tree": [
        2
      ],
      "while_queue": [
        8
      ],
      "for_loop": [
        11
      ],
      "has_next": [
        15
      ],
      "has_left": [
        19
      ],
      "has_right": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public Node connect(Node root) {\n    if (root == null) {\n        return root;\n    }\n\n    Queue<Node> queue = new LinkedList<>();\n    queue.offer(root);\n    int level = 0;\n\n    while (!queue.isEmpty()) {\n        int levelSize = queue.size();\n\n        for (int i = 0; i < levelSize; i++) {\n            Node current = queue.poll();\n\n            // Connect to next node in level\n            if (i < levelSize - 1) {\n                current.next = queue.peek();\n            }\n\n            // Add children to queue\n            if (current.left != null) {\n                queue.offer(current.left);\n            }\n            if (current.right != null) {\n                queue.offer(current.right);\n            }\n        }\n\n        level++;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "start_level": [
        11
      ],
      "process_node": [
        14
      ],
      "connect_next": [
        18
      ],
      "connect_null": [
        17
      ],
      "enqueue_left": [
        23
      ],
      "enqueue_right": [
        26
      ],
      "complete_level": [
        30
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_empty_tree": [
        2
      ],
      "while_queue": [
        10
      ],
      "for_loop": [
        13
      ],
      "has_next": [
        17
      ],
      "has_left": [
        22
      ],
      "has_right": [
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "Node* connect(Node* root) {\n    if (root == nullptr) {\n        return root;\n    }\n\n    queue<Node*> q;\n    q.push(root);\n    int level = 0;\n\n    while (!q.empty()) {\n        int levelSize = q.size();\n\n        for (int i = 0; i < levelSize; i++) {\n            Node* current = q.front();\n            q.pop();\n\n            // Connect to next node in level\n            if (i < levelSize - 1) {\n                current->next = q.front();\n            }\n\n            // Add children to queue\n            if (current->left != nullptr) {\n                q.push(current->left);\n            }\n            if (current->right != nullptr) {\n                q.push(current->right);\n            }\n        }\n\n        level++;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "start_level": [
        11
      ],
      "process_node": [
        14,
        15
      ],
      "connect_next": [
        19
      ],
      "connect_null": [
        18
      ],
      "enqueue_left": [
        24
      ],
      "enqueue_right": [
        27
      ],
      "complete_level": [
        31
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "is_empty_tree": [
        2
      ],
      "while_queue": [
        10
      ],
      "for_loop": [
        13
      ],
      "has_next": [
        18
      ],
      "has_left": [
        23
      ],
      "has_right": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public Node Connect(Node root) {\n    if (root == null) {\n        return root;\n    }\n\n    Queue<Node> queue = new Queue<Node>();\n    queue.Enqueue(root);\n    int level = 0;\n\n    while (queue.Count > 0) {\n        int levelSize = queue.Count;\n\n        for (int i = 0; i < levelSize; i++) {\n            Node current = queue.Dequeue();\n\n            // Connect to next node in level\n            if (i < levelSize - 1) {\n                current.next = queue.Peek();\n            }\n\n            // Add children to queue\n            if (current.left != null) {\n                queue.Enqueue(current.left);\n            }\n            if (current.right != null) {\n                queue.Enqueue(current.right);\n            }\n        }\n\n        level++;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "start_level": [
        11
      ],
      "process_node": [
        14
      ],
      "connect_next": [
        18
      ],
      "connect_null": [
        17
      ],
      "enqueue_left": [
        23
      ],
      "enqueue_right": [
        26
      ],
      "complete_level": [
        30
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_empty_tree": [
        2
      ],
      "while_queue": [
        10
      ],
      "for_loop": [
        13
      ],
      "has_next": [
        17
      ],
      "has_left": [
        22
      ],
      "has_right": [
        25
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func connect(root *Node) *Node {\n    if root == nil {\n        return root\n    }\n\n    queue := []*Node{root}\n    level := 0\n\n    for len(queue) > 0 {\n        levelSize := len(queue)\n\n        for i := 0; i < levelSize; i++ {\n            current := queue[0]\n            queue = queue[1:]\n\n            // Connect to next node in level\n            if i < levelSize-1 {\n                current.Next = queue[0]\n            }\n\n            // Add children to queue\n            if current.Left != nil {\n                queue = append(queue, current.Left)\n            }\n            if current.Right != nil {\n                queue = append(queue, current.Right)\n            }\n        }\n\n        level++\n    }\n\n    return root\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        10
      ],
      "process_node": [
        13,
        14
      ],
      "connect_next": [
        18
      ],
      "connect_null": [
        17
      ],
      "enqueue_left": [
        23
      ],
      "enqueue_right": [
        26
      ],
      "complete_level": [
        30
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_empty_tree": [
        2
      ],
      "while_queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "has_next": [
        17
      ],
      "has_left": [
        22
      ],
      "has_right": [
        25
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function connect(root) {\n    if (root === null) {\n        return root;\n    }\n\n    const queue = [root];\n    let level = 0;\n\n    while (queue.length > 0) {\n        const levelSize = queue.length;\n\n        for (let i = 0; i < levelSize; i++) {\n            const current = queue.shift();\n\n            // Connect to next node in level\n            if (i < levelSize - 1) {\n                current.next = queue[0];\n            }\n\n            // Add children to queue\n            if (current.left !== null) {\n                queue.push(current.left);\n            }\n            if (current.right !== null) {\n                queue.push(current.right);\n            }\n        }\n\n        level++;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        10
      ],
      "process_node": [
        13
      ],
      "connect_next": [
        17
      ],
      "connect_null": [
        16
      ],
      "enqueue_left": [
        22
      ],
      "enqueue_right": [
        25
      ],
      "complete_level": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "is_empty_tree": [
        2
      ],
      "while_queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "has_next": [
        16
      ],
      "has_left": [
        21
      ],
      "has_right": [
        24
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function connect(root: Node | null): Node | null {\n    if (root === null) {\n        return root;\n    }\n\n    const queue: Node[] = [root];\n    let level = 0;\n\n    while (queue.length > 0) {\n        const levelSize = queue.length;\n\n        for (let i = 0; i < levelSize; i++) {\n            const current = queue.shift()!;\n\n            // Connect to next node in level\n            if (i < levelSize - 1) {\n                current.next = queue[0];\n            }\n\n            // Add children to queue\n            if (current.left !== null) {\n                queue.push(current.left);\n            }\n            if (current.right !== null) {\n                queue.push(current.right);\n            }\n        }\n\n        level++;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3
      ],
      "init_queue": [
        6,
        7
      ],
      "start_level": [
        10
      ],
      "process_node": [
        13
      ],
      "connect_next": [
        17
      ],
      "connect_null": [
        16
      ],
      "enqueue_left": [
        22
      ],
      "enqueue_right": [
        25
      ],
      "complete_level": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "is_empty_tree": [
        2
      ],
      "while_queue": [
        9
      ],
      "for_loop": [
        12
      ],
      "has_next": [
        16
      ],
      "has_left": [
        21
      ],
      "has_right": [
        24
      ]
    }
  }
};

const PopulatingNextRightPointersInEachNodeIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        null,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Complete Binary Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Sparse Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        null,
        null,
        6,
        7
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Left-Skewed",
    "value": {
      "tree": [
        1,
        2,
        null,
        3,
        null,
        4,
        null,
        5
      ]
    }
  }
];

function generatePopulatingNextRightPointersInEachNodeIiSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),n=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(n.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);n.has(t)&&(n.get(e).parent=t,n.get(e).isLeftChild=e%2==1)}let o=(e,t)=>{let l=n.get(e);return{type:"binaryTreeNode",value:l.value,parent:void 0!==l.parent?`node_${l.parent}`:void 0,isLeftChild:l.isLeftChild,state:t}},i={};n.forEach((e,t)=>{i[`node_${t}`]=o(t)});let a=new StepRecorder({root:(0,_treeHelper848569.kU)(n.get(0)),queue:[],level:0,level_size:void 0,i:void 0,current:void 0},{...i});if(!n.has(0))return a.record("empty_tree","Empty tree, nothing to connect"),a.getSteps();a.record("start","Start: connect nodes level by level with BFS");let u=null,d=()=>{u&&(a.update_visual(u.key,{type:"graphEdge",from:u.from,to:u.to,directed:!0,state:"set"}),u=null)},s=(e,t)=>{d(),a.add_new_visual(`next_${e}`,{type:"graphEdge",from:e,to:t,directed:!0,state:"new"}),u={key:`next_${e}`,from:e,to:t}},c=[0],p=0,h=-1;for(a.update_variable("queue",c.map(e=>n.get(e).value)),a.update_visual("node_0",o(0,"queued")),a.add_new_visual("queue_n0",{type:"queueElement",value:n.get(0).value,position:0,state:"queued"}),a.add_conditional("is_empty_tree",!1),a.record("init_queue",`Initialize queue with root: [${n.get(0).value}]`);c.length>0;){let e=c.length;a.update_variable("level",p),a.update_variable("level_size",e),a.add_conditional("while_queue",!0),a.record("start_level",`Level ${p}: process ${e} node${e>1?"s":""}`);for(let l=0;l<e;l++){a.update_variable("i",l);let i=c.shift(),u=n.get(i);h>=0&&a.update_visual(`node_${h}`,o(h,"done")),a.update_visual(`node_${i}`,o(i,"current")),h=i,d();for(let e=0;e<c.length;e++)a.update_visual(`queue_n${c[e]}`,{type:"queueElement",value:n.get(c[e]).value,position:e,state:"queued"});if(a.delete_visual(`queue_n${i}`),a.update_variable("current",(0,_treeHelper848569.kU)(u)),a.update_variable("currentIdx",i),a.update_variable("queue",c.map(e=>n.get(e).value)),a.add_conditional("for_loop",!0),a.record("process_node",`Process node ${u.value}`),l<e-1){let e=c[0];a.add_conditional("has_next",!0),s(i,e),a.update_variable("connFromVal",u.value),a.update_variable("connToVal",n.get(e).value),a.record("connect_next",`Connect ${u.value}.next = ${n.get(e).value}`)}else a.add_conditional("has_next",!1),s(i,-1);let p=2*i+1;p<t.length&&null!==t[p]&&(c.push(p),a.update_visual(`node_${p}`,o(p,"queued")),a.add_new_visual(`queue_n${p}`,{type:"queueElement",value:n.get(p).value,position:c.length-1,state:"queued"}),a.update_variable("queue",c.map(e=>n.get(e).value)),a.update_variable("enqueuedIdx",p),a.update_variable("enqueuedVal",n.get(p).value),a.add_conditional("has_left",!0),a.record("enqueue_left",`Enqueue left child: ${n.get(p).value}`));let f=2*i+2;f<t.length&&null!==t[f]&&(c.push(f),a.update_visual(`node_${f}`,o(f,"queued")),a.add_new_visual(`queue_n${f}`,{type:"queueElement",value:n.get(f).value,position:c.length-1,state:"queued"}),a.update_variable("queue",c.map(e=>n.get(e).value)),a.update_variable("enqueuedIdx",f),a.update_variable("enqueuedVal",n.get(f).value),a.add_conditional("has_right",!0),a.record("enqueue_right",`Enqueue right child: ${n.get(f).value}`))}h>=0&&(a.update_visual(`node_${h}`,o(h,"done")),h=-1),d(),a.add_conditional("for_loop",!1),a.record("complete_level",`Level ${p} connected`),p++}return a.add_conditional("while_queue",!1),a.update_variable("current",null),a.update_variable("currentIdx",-1),a.record("complete","All next pointers connected, return root"),a.getSteps()
}

export function PopulatingNextRightPointersInEachNodeIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PopulatingNextRightPointersInEachNodeIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePopulatingNextRightPointersInEachNodeIiSteps(e) as any[];
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
      title="Populating Next Right Pointers in Each Node II"
      slug="populating-next-right-pointers-in-each-node-ii"
      approaches={approaches}
      presets={PopulatingNextRightPointersInEachNodeIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Tree Preorder Traversal (binary-tree-preorder-traversal)
// ==========================================

const BinaryTreePreorderTraversalTemplates = {
  "python": {
    "language": "python",
    "code": "def preorderTraversal(root):\n    if not root:\n        return []\n\n    result = []\n    stack = [root]\n\n    while stack:\n        current = stack.pop()\n        result.append(current.val)\n\n        if current.right:\n            stack.append(current.right)\n\n        if current.left:\n            stack.append(current.left)\n\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_stack": [
        5,
        6
      ],
      "pop_node": [
        9
      ],
      "visit_node": [
        10
      ],
      "highlight_right": [
        12
      ],
      "push_right": [
        13
      ],
      "highlight_left": [
        15
      ],
      "push_left": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_stack": [
        8
      ],
      "has_right": [
        12
      ],
      "has_left": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> preorderTraversal(TreeNode root) {\n    List<Integer> result = new ArrayList<>();\n    if (root == null) return result;\n\n    Stack<TreeNode> stack = new Stack<>();\n    stack.push(root);\n\n    while (!stack.isEmpty()) {\n        TreeNode current = stack.pop();\n        result.add(current.val);\n\n        if (current.right != null) {\n            stack.push(current.right);\n        }\n\n        if (current.left != null) {\n            stack.push(current.left);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_stack": [
        5,
        6
      ],
      "pop_node": [
        9
      ],
      "visit_node": [
        10
      ],
      "highlight_right": [
        12
      ],
      "push_right": [
        13
      ],
      "highlight_left": [
        16
      ],
      "push_left": [
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_stack": [
        8
      ],
      "has_right": [
        12
      ],
      "has_left": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> preorderTraversal(TreeNode* root) {\n    vector<int> result;\n    if (root == nullptr) return result;\n\n    stack<TreeNode*> stk;\n    stk.push(root);\n\n    while (!stk.empty()) {\n        TreeNode* current = stk.top();\n        stk.pop();\n        result.push_back(current->val);\n\n        if (current->right != nullptr) {\n            stk.push(current->right);\n        }\n\n        if (current->left != nullptr) {\n            stk.push(current->left);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_stack": [
        5,
        6
      ],
      "pop_node": [
        9,
        10
      ],
      "visit_node": [
        11
      ],
      "highlight_right": [
        13
      ],
      "push_right": [
        14
      ],
      "highlight_left": [
        17
      ],
      "push_left": [
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_stack": [
        8
      ],
      "has_right": [
        13
      ],
      "has_left": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<int> PreorderTraversal(TreeNode root) {\n    var result = new List<int>();\n    if (root == null) return result;\n\n    var stack = new Stack<TreeNode>();\n    stack.Push(root);\n\n    while (stack.Count > 0) {\n        var current = stack.Pop();\n        result.Add(current.val);\n\n        if (current.right != null) {\n            stack.Push(current.right);\n        }\n\n        if (current.left != null) {\n            stack.Push(current.left);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_stack": [
        5,
        6
      ],
      "pop_node": [
        9
      ],
      "visit_node": [
        10
      ],
      "highlight_right": [
        12
      ],
      "push_right": [
        13
      ],
      "highlight_left": [
        16
      ],
      "push_left": [
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_stack": [
        8
      ],
      "has_right": [
        12
      ],
      "has_left": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func preorderTraversal(root *TreeNode) []int {\n    result := []int{}\n    if root == nil {\n        return result\n    }\n\n    stack := []*TreeNode{root}\n\n    for len(stack) > 0 {\n        n := len(stack)\n        current := stack[n-1]\n        stack = stack[:n-1]\n        result = append(result, current.Val)\n\n        if current.Right != nil {\n            stack = append(stack, current.Right)\n        }\n\n        if current.Left != nil {\n            stack = append(stack, current.Left)\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3,
        4,
        5
      ],
      "init_stack": [
        7
      ],
      "pop_node": [
        10,
        11,
        12
      ],
      "visit_node": [
        13
      ],
      "highlight_right": [
        15
      ],
      "push_right": [
        16
      ],
      "highlight_left": [
        19
      ],
      "push_left": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_stack": [
        9
      ],
      "has_right": [
        15
      ],
      "has_left": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function preorderTraversal(root) {\n    if (!root) return [];\n\n    const result = [];\n    const stack = [root];\n\n    while (stack.length > 0) {\n        const current = stack.pop();\n        result.push(current.val);\n\n        if (current.right) {\n            stack.push(current.right);\n        }\n\n        if (current.left) {\n            stack.push(current.left);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2
      ],
      "init_stack": [
        4,
        5
      ],
      "pop_node": [
        8
      ],
      "visit_node": [
        9
      ],
      "highlight_right": [
        11
      ],
      "push_right": [
        12
      ],
      "highlight_left": [
        15
      ],
      "push_left": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_stack": [
        7
      ],
      "has_right": [
        11
      ],
      "has_left": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function preorderTraversal(root: TreeNode | null): number[] {\n    if (!root) return [];\n\n    const result: number[] = [];\n    const stack: TreeNode[] = [root];\n\n    while (stack.length > 0) {\n        const current = stack.pop()!;\n        result.push(current.val);\n\n        if (current.right) {\n            stack.push(current.right);\n        }\n\n        if (current.left) {\n            stack.push(current.left);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2
      ],
      "init_stack": [
        4,
        5
      ],
      "pop_node": [
        8
      ],
      "visit_node": [
        9
      ],
      "highlight_right": [
        11
      ],
      "push_right": [
        12
      ],
      "highlight_left": [
        15
      ],
      "push_left": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_stack": [
        7
      ],
      "has_right": [
        11
      ],
      "has_left": [
        15
      ]
    }
  }
};

const BinaryTreePreorderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Small (5 nodes)",
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
    "label": "Example 1",
    "value": {
      "tree": [
        1,
        2,
        3,
        null,
        4,
        null,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Complete Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  }
];

function generateBinaryTreePreorderTraversalSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let a=(e,t)=>{let i=r.get(e);return{type:"binaryTreeNode",value:i.value,parent:void 0!==i.parent?`node_${i.parent}`:void 0,isLeftChild:i.isLeftChild,state:t}},n={};r.forEach((e,t)=>{n[`node_${t}`]=a(t)});let s=new StepRecorder({result:[],currIdx:void 0,predIdx:void 0,action:void 0},{...n});if(s.record("start","Start: thread the tree for O(1)-space preorder"),0===r.size)return s.update_variable("result",[]),s.record("empty_tree","Empty tree, return []"),s.getSteps();let o=e=>e<t.length&&null!==t[e],d=e=>o(2*e+1)?2*e+1:-1,u=new Map;r.forEach((e,t)=>u.set(t,o(2*t+2)?2*t+2:-1));let c=[],h=new Set,p=(e,t)=>{r.forEach((r,i)=>{let l;i===e?l="current":i===t?l="pred":h.has(i)&&(l="visited"),s.update_visual(`node_${i}`,a(i,l))})},g=e=>{c.push(r.get(e).value),h.add(e)},f=0;for(;-1!==f;){let e=d(f);if(-1===e){g(f),p(f,-1),s.update_variable("result",[...c]),s.update_variable("currIdx",f),s.update_variable("predIdx",-1),s.update_variable("action","visit"),s.record("visit",`${r.get(f).value} has no left child — visit it, go right`),f=u.get(f);continue}let t=e;for(p(f,t),s.update_variable("currIdx",f),s.update_variable("predIdx",t),s.update_variable("action","find_pred"),s.record("find_pred",`Find predecessor of ${r.get(f).value}: start at ${r.get(t).value}`);-1!==u.get(t)&&u.get(t)!==f;)p(f,t=u.get(t)),s.update_variable("predIdx",t),s.record("find_pred",`Walk right to ${r.get(t).value}`);-1===u.get(t)?(g(f),u.set(t,f),s.add_new_visual(`thread_${t}`,{type:"graphEdge",from:t,to:f,directed:!0,state:"active"}),p(f,t),s.update_variable("result",[...c]),s.update_variable("action","create_thread"),s.record("create_thread",`Visit ${r.get(f).value}, thread ${r.get(t).value}.right → ${r.get(f).value}, go left`),f=e):(u.set(t,-1),s.delete_visual(`thread_${t}`),p(f,t),s.update_variable("action","remove_thread"),s.record("remove_thread",`Thread found — remove ${r.get(t).value}.right, go right`),f=u.get(f))}return p(-1,-1),s.update_variable("currIdx",-1),s.update_variable("predIdx",-1),s.record("complete",`Preorder traversal complete: [${c.join(", ")}]`),s.getSteps()
}

export function BinaryTreePreorderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreePreorderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreePreorderTraversalSteps(e) as any[];
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
      title="Binary Tree Preorder Traversal"
      slug="binary-tree-preorder-traversal"
      approaches={approaches}
      presets={BinaryTreePreorderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Same Tree (same-tree)
// ==========================================

const SameTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def isSameTree(p, q):\n    if p is None and q is None:\n        return True\n\n    if p is None or q is None:\n        return False\n\n    if p.val != q.val:\n        return False\n\n    return (isSameTree(p.left, q.left)\n        and isSameTree(p.right, q.right))",
    "lineMap": {
      "start": [
        1
      ],
      "both_null": [
        2,
        3
      ],
      "one_null": [
        5,
        6
      ],
      "values_differ": [
        8,
        9
      ],
      "check_left": [
        11
      ],
      "left_different": [
        11
      ],
      "check_right": [
        12
      ],
      "right_different": [
        12
      ],
      "return_result": [
        11,
        12
      ],
      "complete": [
        11,
        12
      ]
    },
    "conditionalMap": {
      "both_null": [
        2
      ],
      "one_null": [
        5
      ],
      "values_differ": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isSameTree(TreeNode p, TreeNode q) {\n    if (p == null && q == null) {\n        return true;\n    }\n\n    if (p == null || q == null) {\n        return false;\n    }\n\n    if (p.val != q.val) {\n        return false;\n    }\n\n    return isSameTree(p.left, q.left)\n        && isSameTree(p.right, q.right);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "both_null": [
        2,
        3
      ],
      "one_null": [
        6,
        7
      ],
      "values_differ": [
        10,
        11
      ],
      "check_left": [
        14
      ],
      "left_different": [
        14
      ],
      "check_right": [
        15
      ],
      "right_different": [
        15
      ],
      "return_result": [
        14,
        15
      ],
      "complete": [
        14,
        15
      ]
    },
    "conditionalMap": {
      "both_null": [
        2
      ],
      "one_null": [
        6
      ],
      "values_differ": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isSameTree(TreeNode* p, TreeNode* q) {\n    if (p == nullptr && q == nullptr) {\n        return true;\n    }\n\n    if (p == nullptr || q == nullptr) {\n        return false;\n    }\n\n    if (p->val != q->val) {\n        return false;\n    }\n\n    return isSameTree(p->left, q->left)\n        && isSameTree(p->right, q->right);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "both_null": [
        2,
        3
      ],
      "one_null": [
        6,
        7
      ],
      "values_differ": [
        10,
        11
      ],
      "check_left": [
        14
      ],
      "left_different": [
        14
      ],
      "check_right": [
        15
      ],
      "right_different": [
        15
      ],
      "return_result": [
        14,
        15
      ],
      "complete": [
        14,
        15
      ]
    },
    "conditionalMap": {
      "both_null": [
        2
      ],
      "one_null": [
        6
      ],
      "values_differ": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsSameTree(TreeNode p, TreeNode q) {\n    if (p == null && q == null) {\n        return true;\n    }\n\n    if (p == null || q == null) {\n        return false;\n    }\n\n    if (p.val != q.val) {\n        return false;\n    }\n\n    return IsSameTree(p.left, q.left)\n        && IsSameTree(p.right, q.right);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "both_null": [
        2,
        3
      ],
      "one_null": [
        6,
        7
      ],
      "values_differ": [
        10,
        11
      ],
      "check_left": [
        14
      ],
      "left_different": [
        14
      ],
      "check_right": [
        15
      ],
      "right_different": [
        15
      ],
      "return_result": [
        14,
        15
      ],
      "complete": [
        14,
        15
      ]
    },
    "conditionalMap": {
      "both_null": [
        2
      ],
      "one_null": [
        6
      ],
      "values_differ": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isSameTree(p *TreeNode, q *TreeNode) bool {\n    if p == nil && q == nil {\n        return true\n    }\n\n    if p == nil || q == nil {\n        return false\n    }\n\n    if p.Val != q.Val {\n        return false\n    }\n\n    return isSameTree(p.Left, q.Left) &&\n        isSameTree(p.Right, q.Right)\n}",
    "lineMap": {
      "start": [
        1
      ],
      "both_null": [
        2,
        3
      ],
      "one_null": [
        6,
        7
      ],
      "values_differ": [
        10,
        11
      ],
      "check_left": [
        14
      ],
      "left_different": [
        14
      ],
      "check_right": [
        15
      ],
      "right_different": [
        15
      ],
      "return_result": [
        14,
        15
      ],
      "complete": [
        14,
        15
      ]
    },
    "conditionalMap": {
      "both_null": [
        2
      ],
      "one_null": [
        6
      ],
      "values_differ": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isSameTree(p, q) {\n    if (p === null && q === null) {\n        return true;\n    }\n\n    if (p === null || q === null) {\n        return false;\n    }\n\n    if (p.val !== q.val) {\n        return false;\n    }\n\n    return isSameTree(p.left, q.left)\n        && isSameTree(p.right, q.right);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "both_null": [
        2,
        3
      ],
      "one_null": [
        6,
        7
      ],
      "values_differ": [
        10,
        11
      ],
      "check_left": [
        14
      ],
      "left_different": [
        14
      ],
      "check_right": [
        15
      ],
      "right_different": [
        15
      ],
      "return_result": [
        14,
        15
      ],
      "complete": [
        14,
        15
      ]
    },
    "conditionalMap": {
      "both_null": [
        2
      ],
      "one_null": [
        6
      ],
      "values_differ": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {\n    if (p === null && q === null) {\n        return true;\n    }\n\n    if (p === null || q === null) {\n        return false;\n    }\n\n    if (p.val !== q.val) {\n        return false;\n    }\n\n    return isSameTree(p.left, q.left)\n        && isSameTree(p.right, q.right);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "both_null": [
        2,
        3
      ],
      "one_null": [
        6,
        7
      ],
      "values_differ": [
        10,
        11
      ],
      "check_left": [
        14
      ],
      "left_different": [
        14
      ],
      "check_right": [
        15
      ],
      "right_different": [
        15
      ],
      "return_result": [
        14,
        15
      ],
      "complete": [
        14,
        15
      ]
    },
    "conditionalMap": {
      "both_null": [
        2
      ],
      "one_null": [
        6
      ],
      "values_differ": [
        10
      ]
    }
  }
};

const SameTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Same Trees",
    "value": {
      "tree1": [
        1,
        2,
        3
      ],
      "tree2": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Different Structure",
    "value": {
      "tree1": [
        1,
        2
      ],
      "tree2": [
        1,
        null,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Different Values",
    "value": {
      "tree1": [
        1,
        2,
        1
      ],
      "tree2": [
        1,
        1,
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Three Levels",
    "value": {
      "tree1": [
        4,
        2,
        7,
        1,
        3
      ],
      "tree2": [
        4,
        2,
        7,
        1,
        3
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Deep Mismatch",
    "value": {
      "tree1": [
        4,
        2,
        7,
        1,
        3,
        6,
        9
      ],
      "tree2": [
        4,
        2,
        7,
        1,
        3,
        6,
        8
      ]
    }
  }
];

function generateSameTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree1||[]),r=(0,_treeHelper848569.Gu)(e.tree2||[]),i=e=>{let t=new Map;for(let r=0;r<e.length;r++)if(null!==e[r]&&(t.set(r,{value:e[r],index:r}),r>0)){let e=Math.floor((r-1)/2);t.has(e)&&(t.get(r).parent=e,t.get(r).isLeftChild=r%2==1)}return t},n=i(t),s=i(r),u=(e,t,r)=>{let l=(1===e?n:s).get(t);return{type:"binaryTreeNode",value:l.value,parent:void 0!==l.parent?`tree${e}_node_${l.parent}`:void 0,isLeftChild:l.isLeftChild,state:r}},o={};n.forEach((e,t)=>{o[`tree1_node_${t}`]=u(1,t)}),s.forEach((e,t)=>{o[`tree2_node_${t}`]=u(2,t)});let d=new RecursiveStepRecorder({result:void 0},o);d.pushCallFrame({p:(0,_treeHelper848569.kU)(n.get(0)),q:(0,_treeHelper848569.kU)(s.get(0))},"isSameTree"),d.record("start","Start: compare the two trees pair by pair");let c=[],h=[],f=(e,t,r)=>{n.has(e)&&d.update_visual(`tree1_node_${e}`,u(1,e,r)),s.has(t)&&d.update_visual(`tree2_node_${t}`,u(2,t,r))},p=(e,t)=>{d.update_global_variable("pIdx",e),d.update_global_variable("qIdx",t),d.update_global_variable("pVal",n.get(e)?.value??null),d.update_global_variable("qVal",s.get(t)?.value??null)},g=(e,t)=>{h.push([e,t]),d.update_global_variable("checks",h.map(e=>[...e]))},m=function e(t,r){let l=n.get(t)??null,i=s.get(r)??null;if(d.pushCallFrame({p:(0,_treeHelper848569.kU)(l),q:(0,_treeHelper848569.kU)(i)},"isSameTree"),c.length>0){let[e,t]=c[c.length-1];f(e,t,"onpath")}c.push([t,r]),f(t,r,"current"),p(t,r);let u=!l&&!i;if(d.add_conditional("both_null",u),u){if(g("∅",!0),d.record("both_null","Both positions are empty: identical here, return true"),c.pop(),d.popCallFrame(),c.length>0){let[e,t]=c[c.length-1];f(e,t,"current")}return!0}let o=!l||!i;if(d.add_conditional("one_null",o),o){let e=l?`${l.value}`:"∅",a=i?`${i.value}`:"∅";return f(t,r,"error"),g(`${e}≠${a}`,!1),d.record("one_null",`${e} vs ${a}: one node is missing, return false`),c.pop(),d.popCallFrame(),!1}let h=l.value!==i.value;if(d.add_conditional("values_differ",h),h)return f(t,r,"error"),g(`${l.value}≠${i.value}`,!1),d.record("values_differ",`Values differ: ${l.value} vs ${i.value}, return false`),c.pop(),d.popCallFrame(),!1;if(g(`${l.value}`,!0),d.record("check_left",`${l.value} = ${i.value}, check the left subtrees`),!e(2*t+1,2*r+1))return f(t,r,"error"),p(t,r),d.record("left_different",`Left subtrees differ under ${l.value}: return false`),c.pop(),d.popCallFrame(),!1;if(p(t,r),d.record("check_right","Left subtrees match, check the right subtrees"),!e(2*t+2,2*r+2))return f(t,r,"error"),p(t,r),d.record("right_different",`Right subtrees differ under ${l.value}: return false`),c.pop(),d.popCallFrame(),!1;if(f(t,r,"matched"),p(t,r),d.record("return_result",`Subtree at ${l.value} fully matches: return true`),c.pop(),d.popCallFrame(),c.length>0){let[e,t]=c[c.length-1];f(e,t,"current")}return!0}(0,0);return d.update_global_variable("result",m),d.record("complete",m?"Every pair matched: the trees are identical":"The trees are not identical"),d.popCallFrame(),d.getSteps()
}

export function SameTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SameTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSameTreeSteps(e) as any[];
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
      title="Same Tree"
      slug="same-tree"
      approaches={approaches}
      presets={SameTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Symmetric Tree (symmetric-tree)
// ==========================================

const SymmetricTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def isSymmetric(root):\n    if not root:\n        return True\n    return isMirror(root.left, root.right)\n\ndef isMirror(t1, t2):\n    if t1 is None and t2 is None:\n        return True\n\n    if t1 is None or t2 is None:\n        return False\n\n    if t1.val != t2.val:\n        return False\n\n    return (isMirror(t1.left, t2.right)\n        and isMirror(t1.right, t2.left))",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "call_helper": [
        4
      ],
      "both_null": [
        7,
        8
      ],
      "one_null": [
        10,
        11
      ],
      "values_differ": [
        13,
        14
      ],
      "check_outer": [
        16
      ],
      "outer_not_mirror": [
        16
      ],
      "check_inner": [
        17
      ],
      "inner_not_mirror": [
        17
      ],
      "subtrees_mirror": [
        16,
        17
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "empty_tree": [
        2
      ],
      "both_null": [
        7
      ],
      "one_null": [
        10
      ],
      "values_differ": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isSymmetric(TreeNode root) {\n    if (root == null) {\n        return true;\n    }\n    return isMirror(root.left, root.right);\n}\n\nprivate boolean isMirror(TreeNode t1, TreeNode t2) {\n    if (t1 == null && t2 == null) {\n        return true;\n    }\n\n    if (t1 == null || t2 == null) {\n        return false;\n    }\n\n    if (t1.val != t2.val) {\n        return false;\n    }\n\n    return isMirror(t1.left, t2.right)\n        && isMirror(t1.right, t2.left);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "call_helper": [
        5
      ],
      "both_null": [
        9,
        10
      ],
      "one_null": [
        13,
        14
      ],
      "values_differ": [
        17,
        18
      ],
      "check_outer": [
        21
      ],
      "outer_not_mirror": [
        21
      ],
      "check_inner": [
        22
      ],
      "inner_not_mirror": [
        22
      ],
      "subtrees_mirror": [
        21,
        22
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "empty_tree": [
        2
      ],
      "both_null": [
        9
      ],
      "one_null": [
        13
      ],
      "values_differ": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isSymmetric(TreeNode* root) {\n    if (root == nullptr) {\n        return true;\n    }\n    return isMirror(root->left, root->right);\n}\n\nbool isMirror(TreeNode* t1, TreeNode* t2) {\n    if (t1 == nullptr && t2 == nullptr) {\n        return true;\n    }\n\n    if (t1 == nullptr || t2 == nullptr) {\n        return false;\n    }\n\n    if (t1->val != t2->val) {\n        return false;\n    }\n\n    return isMirror(t1->left, t2->right)\n        && isMirror(t1->right, t2->left);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "call_helper": [
        5
      ],
      "both_null": [
        9,
        10
      ],
      "one_null": [
        13,
        14
      ],
      "values_differ": [
        17,
        18
      ],
      "check_outer": [
        21
      ],
      "outer_not_mirror": [
        21
      ],
      "check_inner": [
        22
      ],
      "inner_not_mirror": [
        22
      ],
      "subtrees_mirror": [
        21,
        22
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "empty_tree": [
        2
      ],
      "both_null": [
        9
      ],
      "one_null": [
        13
      ],
      "values_differ": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsSymmetric(TreeNode root) {\n    if (root == null) {\n        return true;\n    }\n    return IsMirror(root.left, root.right);\n}\n\nprivate bool IsMirror(TreeNode t1, TreeNode t2) {\n    if (t1 == null && t2 == null) {\n        return true;\n    }\n\n    if (t1 == null || t2 == null) {\n        return false;\n    }\n\n    if (t1.val != t2.val) {\n        return false;\n    }\n\n    return IsMirror(t1.left, t2.right)\n        && IsMirror(t1.right, t2.left);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "call_helper": [
        5
      ],
      "both_null": [
        9,
        10
      ],
      "one_null": [
        13,
        14
      ],
      "values_differ": [
        17,
        18
      ],
      "check_outer": [
        21
      ],
      "outer_not_mirror": [
        21
      ],
      "check_inner": [
        22
      ],
      "inner_not_mirror": [
        22
      ],
      "subtrees_mirror": [
        21,
        22
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "empty_tree": [
        2
      ],
      "both_null": [
        9
      ],
      "one_null": [
        13
      ],
      "values_differ": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isSymmetric(root *TreeNode) bool {\n    if root == nil {\n        return true\n    }\n    return isMirror(root.Left, root.Right)\n}\n\nfunc isMirror(t1 *TreeNode, t2 *TreeNode) bool {\n    if t1 == nil && t2 == nil {\n        return true\n    }\n\n    if t1 == nil || t2 == nil {\n        return false\n    }\n\n    if t1.Val != t2.Val {\n        return false\n    }\n\n    return isMirror(t1.Left, t2.Right) &&\n        isMirror(t1.Right, t2.Left)\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "call_helper": [
        5
      ],
      "both_null": [
        9,
        10
      ],
      "one_null": [
        13,
        14
      ],
      "values_differ": [
        17,
        18
      ],
      "check_outer": [
        21
      ],
      "outer_not_mirror": [
        21
      ],
      "check_inner": [
        22
      ],
      "inner_not_mirror": [
        22
      ],
      "subtrees_mirror": [
        21,
        22
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "empty_tree": [
        2
      ],
      "both_null": [
        9
      ],
      "one_null": [
        13
      ],
      "values_differ": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isSymmetric(root) {\n    if (root === null) {\n        return true;\n    }\n    return isMirror(root.left, root.right);\n}\n\nfunction isMirror(t1, t2) {\n    if (t1 === null && t2 === null) {\n        return true;\n    }\n\n    if (t1 === null || t2 === null) {\n        return false;\n    }\n\n    if (t1.val !== t2.val) {\n        return false;\n    }\n\n    return isMirror(t1.left, t2.right)\n        && isMirror(t1.right, t2.left);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "call_helper": [
        5
      ],
      "both_null": [
        9,
        10
      ],
      "one_null": [
        13,
        14
      ],
      "values_differ": [
        17,
        18
      ],
      "check_outer": [
        21
      ],
      "outer_not_mirror": [
        21
      ],
      "check_inner": [
        22
      ],
      "inner_not_mirror": [
        22
      ],
      "subtrees_mirror": [
        21,
        22
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "empty_tree": [
        2
      ],
      "both_null": [
        9
      ],
      "one_null": [
        13
      ],
      "values_differ": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isSymmetric(root: TreeNode | null): boolean {\n    if (root === null) {\n        return true;\n    }\n    return isMirror(root.left, root.right);\n}\n\nfunction isMirror(t1: TreeNode | null, t2: TreeNode | null): boolean {\n    if (t1 === null && t2 === null) {\n        return true;\n    }\n\n    if (t1 === null || t2 === null) {\n        return false;\n    }\n\n    if (t1.val !== t2.val) {\n        return false;\n    }\n\n    return isMirror(t1.left, t2.right)\n        && isMirror(t1.right, t2.left);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "call_helper": [
        5
      ],
      "both_null": [
        9,
        10
      ],
      "one_null": [
        13,
        14
      ],
      "values_differ": [
        17,
        18
      ],
      "check_outer": [
        21
      ],
      "outer_not_mirror": [
        21
      ],
      "check_inner": [
        22
      ],
      "inner_not_mirror": [
        22
      ],
      "subtrees_mirror": [
        21,
        22
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "empty_tree": [
        2
      ],
      "both_null": [
        9
      ],
      "one_null": [
        13
      ],
      "values_differ": [
        17
      ]
    }
  }
};

const SymmetricTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Symmetric Tree",
    "value": {
      "tree": [
        1,
        2,
        2,
        3,
        4,
        4,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Not Symmetric",
    "value": {
      "tree": [
        1,
        2,
        2,
        null,
        3,
        null,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Same Values, Not Mirror",
    "value": {
      "tree": [
        1,
        2,
        2,
        2,
        null,
        2,
        null
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Four Levels",
    "value": {
      "tree": [
        1,
        2,
        2,
        3,
        4,
        4,
        3,
        5,
        6,
        7,
        8,
        8,
        7,
        6,
        5
      ]
    }
  }
];

function generateSymmetricTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let a=(e,t)=>{let l=r.get(e);return{type:"binaryTreeNode",value:l.value,parent:void 0!==l.parent?`node_${l.parent}`:void 0,isLeftChild:l.isLeftChild,state:t}},n={};r.forEach((e,t)=>{n[`node_${t}`]=a(t)});let o=new RecursiveStepRecorder({root:(0,_treeHelper848569.kU)(r.get(0)),result:void 0},n);if(o.pushCallFrame({root:(0,_treeHelper848569.kU)(r.get(0))},"isSymmetric"),o.record("start","Start: is the tree a mirror image of itself?"),0===r.size)return o.add_conditional("empty_tree",!0),o.update_global_variable("result",!0),o.record("empty_tree","Empty tree is symmetric, return true"),o.popCallFrame(),o.getSteps();o.add_conditional("empty_tree",!1),o.update_visual("node_0",a(0,"current")),o.record("call_helper","Compare the root's left and right subtrees as mirrors");let u=[],s=[],d=(e,t,l)=>{r.has(e)&&o.update_visual(`node_${e}`,a(e,l)),r.has(t)&&o.update_visual(`node_${t}`,a(t,l))},c=(e,t)=>{o.update_global_variable("t1Idx",e),o.update_global_variable("t2Idx",t),o.update_global_variable("t1Val",r.get(e)?.value??null),o.update_global_variable("t2Val",r.get(t)?.value??null)},h=(e,t)=>{s.push([e,t]),o.update_global_variable("checks",s.map(e=>[...e]))},f=function e(t,l){let n=r.get(t)??null,s=r.get(l)??null;if(o.pushCallFrame({t1:(0,_treeHelper848569.kU)(n),t2:(0,_treeHelper848569.kU)(s)},"isMirror"),u.length>0){let[e,t]=u[u.length-1];d(e,t,"onpath")}else r.has(0)&&o.update_visual("node_0",a(0,"onpath"));u.push([t,l]),d(t,l,"current"),c(t,l);let f=!n&&!s;if(o.add_conditional("both_null",f),f){if(h("∅",!0),o.record("both_null","Both positions are empty: mirrored here, return true"),u.pop(),o.popCallFrame(),u.length>0){let[e,t]=u[u.length-1];d(e,t,"current")}return!0}let p=!n||!s;if(o.add_conditional("one_null",p),p){let e=n?`${n.value}`:"∅",r=s?`${s.value}`:"∅";return d(t,l,"error"),h(`${e}≠${r}`,!1),o.record("one_null",`${e} vs ${r}: one side is missing, return false`),u.pop(),o.popCallFrame(),!1}let m=n.value!==s.value;if(o.add_conditional("values_differ",m),m)return d(t,l,"error"),h(`${n.value}≠${s.value}`,!1),o.record("values_differ",`Values differ: ${n.value} vs ${s.value}, return false`),u.pop(),o.popCallFrame(),!1;if(h(`${n.value}`,!0),o.record("check_outer",`${n.value} = ${s.value}, compare the outer children`),!e(2*t+1,2*l+2))return d(t,l,"error"),c(t,l),o.record("outer_not_mirror",`Outer children under ${n.value} differ: return false`),u.pop(),o.popCallFrame(),!1;if(c(t,l),o.record("check_inner","Outer children mirror, compare the inner children"),!e(2*t+2,2*l+1))return d(t,l,"error"),c(t,l),o.record("inner_not_mirror",`Inner children under ${n.value} differ: return false`),u.pop(),o.popCallFrame(),!1;if(d(t,l,"matched"),c(t,l),o.record("subtrees_mirror",`Pair ${n.value} mirrors fully: return true`),u.pop(),o.popCallFrame(),u.length>0){let[e,t]=u[u.length-1];d(e,t,"current")}return!0}(1,2);return f&&o.update_visual("node_0",a(0,"matched")),o.update_global_variable("result",f),o.record("complete",f?"Every mirror pair matched: the tree is symmetric":"The tree is not symmetric"),o.popCallFrame(),o.getSteps()
}

export function SymmetricTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SymmetricTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSymmetricTreeSteps(e) as any[];
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
      title="Symmetric Tree"
      slug="symmetric-tree"
      approaches={approaches}
      presets={SymmetricTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Tree Paths (binary-tree-paths)
// ==========================================

const BinaryTreePathsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:\n        result = []\n        self.dfs(root, \"\", result)\n        return result\n\n    def dfs(self, node, path, result):\n        if not node:\n            return\n\n        # Append current node's value to the path\n        path += str(node.val)\n\n        # If it's a leaf, we have a complete path\n        if not node.left and not node.right:\n            result.append(path)\n            return\n\n        # Not a leaf, continue with \"->\" separator\n        path += \"->\"\n        self.dfs(node.left, path, result)\n        self.dfs(node.right, path, result)",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "call_dfs": [
        4
      ],
      "null_return": [
        8,
        9
      ],
      "append_node": [
        12
      ],
      "is_leaf": [
        15,
        16,
        17
      ],
      "append_separator": [
        20
      ],
      "explore_left": [
        21
      ],
      "explore_right": [
        22
      ],
      "backtrack": [
        22
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "is_null": [
        8
      ],
      "is_leaf": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<String> binaryTreePaths(TreeNode root) {\n        List<String> result = new ArrayList<>();\n        dfs(root, \"\", result);\n        return result;\n    }\n\n    private void dfs(TreeNode node, String path, List<String> result) {\n        if (node == null) {\n            return;\n        }\n\n        // Append current node's value to the path\n        path += node.val;\n\n        // If it's a leaf, we have a complete path\n        if (node.left == null && node.right == null) {\n            result.add(path);\n            return;\n        }\n\n        // Not a leaf, continue with \"->\" separator\n        path += \"->\";\n        dfs(node.left, path, result);\n        dfs(node.right, path, result);\n    }\n}",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "call_dfs": [
        4
      ],
      "null_return": [
        9,
        10
      ],
      "append_node": [
        14
      ],
      "is_leaf": [
        17,
        18,
        19
      ],
      "append_separator": [
        23
      ],
      "explore_left": [
        24
      ],
      "explore_right": [
        25
      ],
      "backtrack": [
        25,
        26
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "is_null": [
        9
      ],
      "is_leaf": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<string> binaryTreePaths(TreeNode* root) {\n        vector<string> result;\n        dfs(root, \"\", result);\n        return result;\n    }\n\n    void dfs(TreeNode* node, string path, vector<string>& result) {\n        if (node == nullptr) {\n            return;\n        }\n\n        // Append current node's value to the path\n        path += to_string(node->val);\n\n        // If it's a leaf, we have a complete path\n        if (node->left == nullptr && node->right == nullptr) {\n            result.push_back(path);\n            return;\n        }\n\n        // Not a leaf, continue with \"->\" separator\n        path += \"->\";\n        dfs(node->left, path, result);\n        dfs(node->right, path, result);\n    }\n};",
    "lineMap": {
      "start": [
        3,
        4
      ],
      "call_dfs": [
        5
      ],
      "null_return": [
        10,
        11
      ],
      "append_node": [
        15
      ],
      "is_leaf": [
        18,
        19,
        20
      ],
      "append_separator": [
        24
      ],
      "explore_left": [
        25
      ],
      "explore_right": [
        26
      ],
      "backtrack": [
        26,
        27
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ],
      "is_leaf": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<string> BinaryTreePaths(TreeNode root) {\n        List<string> result = new List<string>();\n        Dfs(root, \"\", result);\n        return result;\n    }\n\n    private void Dfs(TreeNode node, string path, List<string> result) {\n        if (node == null) {\n            return;\n        }\n\n        // Append current node's value to the path\n        path += node.val;\n\n        // If it's a leaf, we have a complete path\n        if (node.left == null && node.right == null) {\n            result.Add(path);\n            return;\n        }\n\n        // Not a leaf, continue with \"->\" separator\n        path += \"->\";\n        Dfs(node.left, path, result);\n        Dfs(node.right, path, result);\n    }\n}",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "call_dfs": [
        4
      ],
      "null_return": [
        9,
        10
      ],
      "append_node": [
        14
      ],
      "is_leaf": [
        17,
        18,
        19
      ],
      "append_separator": [
        23
      ],
      "explore_left": [
        24
      ],
      "explore_right": [
        25
      ],
      "backtrack": [
        25,
        26
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "is_null": [
        9
      ],
      "is_leaf": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func binaryTreePaths(root *TreeNode) []string {\n    result := []string{}\n    var dfs func(node *TreeNode, path string)\n    dfs = func(node *TreeNode, path string) {\n        if node == nil {\n            return\n        }\n\n        // Append current node's value to the path\n        path += strconv.Itoa(node.Val)\n\n        // If it's a leaf, we have a complete path\n        if node.Left == nil && node.Right == nil {\n            result = append(result, path)\n            return\n        }\n\n        // Not a leaf, continue with \"->\" separator\n        path += \"->\"\n        dfs(node.Left, path)\n        dfs(node.Right, path)\n    }\n    dfs(root, \"\")\n    return result\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "call_dfs": [
        23
      ],
      "null_return": [
        5,
        6
      ],
      "append_node": [
        10
      ],
      "is_leaf": [
        13,
        14,
        15
      ],
      "append_separator": [
        19
      ],
      "explore_left": [
        20
      ],
      "explore_right": [
        21
      ],
      "backtrack": [
        21,
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "is_leaf": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var binaryTreePaths = function (root) {\n  const result = [];\n\n  const dfs = (node, path) => {\n    if (node === null) {\n      return;\n    }\n\n    // Append current node's value to the path\n    path += node.val;\n\n    // If it's a leaf, we have a complete path\n    if (node.left === null && node.right === null) {\n      result.push(path);\n      return;\n    }\n\n    // Not a leaf, continue with \"->\" separator\n    path += \"->\";\n    dfs(node.left, path);\n    dfs(node.right, path);\n  };\n\n  dfs(root, \"\");\n  return result;\n};",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "call_dfs": [
        24
      ],
      "null_return": [
        5,
        6
      ],
      "append_node": [
        10
      ],
      "is_leaf": [
        13,
        14,
        15
      ],
      "append_separator": [
        19
      ],
      "explore_left": [
        20
      ],
      "explore_right": [
        21
      ],
      "backtrack": [
        21,
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "is_leaf": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function binaryTreePaths(root: TreeNode | null): string[] {\n    const result: string[] = [];\n\n    const dfs = (node: TreeNode | null, path: string): void => {\n        if (node === null) {\n            return;\n        }\n\n        // Append current node's value to the path\n        path += node.val;\n\n        // If it's a leaf, we have a complete path\n        if (node.left === null && node.right === null) {\n            result.push(path);\n            return;\n        }\n\n        // Not a leaf, continue with \"->\" separator\n        path += \"->\";\n        dfs(node.left, path);\n        dfs(node.right, path);\n    };\n\n    dfs(root, \"\");\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "call_dfs": [
        24
      ],
      "null_return": [
        5,
        6
      ],
      "append_node": [
        10
      ],
      "is_leaf": [
        13,
        14,
        15
      ],
      "append_separator": [
        19
      ],
      "explore_left": [
        20
      ],
      "explore_right": [
        21
      ],
      "backtrack": [
        21,
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "is_leaf": [
        13
      ]
    }
  }
};

const BinaryTreePathsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Complete Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Three Levels (4 paths)",
    "value": {
      "tree": [
        5,
        2,
        8,
        1,
        3,
        7,
        9
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Left Skewed",
    "value": {
      "tree": [
        1,
        2,
        null,
        3
      ]
    }
  },
  {
    "id": "ex4",
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

function generateBinaryTreePathsSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),a=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(a.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);a.has(t)&&(a.get(e).parent=t,a.get(e).isLeftChild=e%2==1)}let n=(e,t)=>{let r=a.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,state:t}},i={};a.forEach((e,t)=>{i[`node_${t}`]=n(t)});let s=new RecursiveStepRecorder({root:(0,_treeHelper848569.kU)(a.get(0)),paths:[],pathLabel:"path"},i);s.pushCallFrame({root:(0,_treeHelper848569.kU)(a.get(0))},"binaryTreePaths"),s.record("start","Start: collect every root-to-leaf path into result");let o=[],d=[],p=[],u=()=>{s.update_global_variable("pathVals",[...d]),s.update_global_variable("pathIdxs",[...p])},h=()=>{if(p.length>0){let e=p[p.length-1];s.update_visual(`node_${e}`,n(e,"current")),s.update_global_variable("currentIdx",e),s.update_global_variable("currentVal",a.get(e).value)}else s.update_global_variable("currentIdx",-1)};return s.update_global_variable("pathStr",""),s.record("call_dfs",'Call dfs(root, "", result) with an empty path'),!function e(t,r){let i=a.get(t);if(s.pushCallFrame({node:i?(0,_treeHelper848569.kU)(i):"null",path:r},"dfs"),!i){s.add_conditional("is_null",!0),s.update_global_variable("pathStr",r),s.record("null_return","Null node: return immediately"),s.popCallFrame();return}if(s.add_conditional("is_null",!1),p.length>0){let e=p[p.length-1];s.update_visual(`node_${e}`,n(e,"onpath"))}d.push(i.value),p.push(t),s.update_visual(`node_${t}`,n(t,"current")),u(),s.update_global_variable("currentIdx",t),s.update_global_variable("currentVal",i.value),r+=String(i.value),s.update_global_variable("pathStr",r),s.record("append_node",`Append ${i.value} to the path: path = "${r}"`);let c=2*t+1,f=2*t+2,g=!a.has(c)&&!a.has(f);if(s.add_conditional("is_leaf",g),g){o.push(r),s.update_global_variable("paths",[...o]),s.update_visual(`node_${t}`,n(t,"pathleaf")),s.record("is_leaf",`Leaf ${i.value}: add "${r}" to result and return`),d.pop(),p.pop(),u(),s.popCallFrame(),h();return}r+="->",s.update_global_variable("pathStr",r),s.record("append_separator",`Not a leaf: append "->", path = "${r}"`),s.update_global_variable("exploringIdx",c),s.record("explore_left",`Recurse into the left child of ${i.value}`),e(c,r),s.update_global_variable("exploringIdx",f),s.update_global_variable("pathStr",r),s.record("explore_right",`Recurse into the right child of ${i.value}`),e(f,r),d.pop(),p.pop(),s.update_visual(`node_${t}`,n(t,"visited")),u(),s.popCallFrame(),h();let x=p.length>0?d.join("->")+"->":"";s.update_global_variable("pathStr",x),s.record("backtrack",p.length>0?`dfs(${i.value}) returns: the parent's path "${x}" is unchanged`:`dfs(${i.value}) returns: every root-to-leaf path is in result`)}(0,""),s.update_global_variable("paths",[...o]),s.record("complete",`Return result: [${o.map(e=>`"${e}"`).join(", ")}]`),s.popCallFrame(),s.getSteps()
}

export function BinaryTreePathsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreePathsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreePathsSteps(e) as any[];
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
      title="Binary Tree Paths"
      slug="binary-tree-paths"
      approaches={approaches}
      presets={BinaryTreePathsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Convert Sorted Array to Binary Search Tree (convert-sorted-array-to-binary-search-tree)
// ==========================================

const ConvertSortedArrayToBinarySearchTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def sortedArrayToBST(self, nums: list[int]) -> TreeNode:\n        def build(left: int, right: int) -> TreeNode:\n            if left > right:\n                return None\n            # Pick the middle element as the root of this subtree\n            mid = left + (right - left) // 2\n            node = TreeNode(nums[mid])\n            # Recursively build left and right subtrees from remaining halves\n            node.left = build(left, mid - 1)\n            node.right = build(mid + 1, right)\n            return node\n\n        return build(0, len(nums) - 1)",
    "lineMap": {
      "start": [
        2
      ],
      "call_build": [
        14
      ],
      "base_case": [
        4,
        5
      ],
      "find_mid": [
        7
      ],
      "create_node": [
        8
      ],
      "build_left": [
        10
      ],
      "build_right": [
        11
      ],
      "return_node": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "base_case": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode sortedArrayToBST(int[] nums) {\n        return build(nums, 0, nums.length - 1);\n    }\n\n    private TreeNode build(int[] nums, int left, int right) {\n        if (left > right) {\n            return null;\n        }\n        // Pick the middle element as the root of this subtree\n        int mid = left + (right - left) / 2;\n        TreeNode node = new TreeNode(nums[mid]);\n        // Recursively build left and right subtrees from remaining halves\n        node.left = build(nums, left, mid - 1);\n        node.right = build(nums, mid + 1, right);\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "call_build": [
        3
      ],
      "base_case": [
        7,
        8
      ],
      "find_mid": [
        11
      ],
      "create_node": [
        12
      ],
      "build_left": [
        14
      ],
      "build_right": [
        15
      ],
      "return_node": [
        16
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "base_case": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* sortedArrayToBST(vector<int>& nums) {\n        return build(nums, 0, nums.size() - 1);\n    }\n\nprivate:\n    TreeNode* build(vector<int>& nums, int left, int right) {\n        if (left > right) {\n            return nullptr;\n        }\n        // Pick the middle element as the root of this subtree\n        int mid = left + (right - left) / 2;\n        TreeNode* node = new TreeNode(nums[mid]);\n        // Recursively build left and right subtrees from remaining halves\n        node->left = build(nums, left, mid - 1);\n        node->right = build(nums, mid + 1, right);\n        return node;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "call_build": [
        4
      ],
      "base_case": [
        9,
        10
      ],
      "find_mid": [
        13
      ],
      "create_node": [
        14
      ],
      "build_left": [
        16
      ],
      "build_right": [
        17
      ],
      "return_node": [
        18
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "base_case": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode SortedArrayToBST(int[] nums) {\n        return Build(nums, 0, nums.Length - 1);\n    }\n\n    private TreeNode Build(int[] nums, int left, int right) {\n        if (left > right) {\n            return null;\n        }\n        // Pick the middle element as the root of this subtree\n        int mid = left + (right - left) / 2;\n        TreeNode node = new TreeNode(nums[mid]);\n        // Recursively build left and right subtrees from remaining halves\n        node.left = Build(nums, left, mid - 1);\n        node.right = Build(nums, mid + 1, right);\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "call_build": [
        3
      ],
      "base_case": [
        7,
        8
      ],
      "find_mid": [
        11
      ],
      "create_node": [
        12
      ],
      "build_left": [
        14
      ],
      "build_right": [
        15
      ],
      "return_node": [
        16
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "base_case": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func sortedArrayToBST(nums []int) *TreeNode {\n    return build(nums, 0, len(nums)-1)\n}\n\nfunc build(nums []int, left int, right int) *TreeNode {\n    if left > right {\n        return nil\n    }\n    // Pick the middle element as the root of this subtree\n    mid := left + (right-left)/2\n    node := &TreeNode{Val: nums[mid]}\n    // Recursively build left and right subtrees from remaining halves\n    node.Left = build(nums, left, mid-1)\n    node.Right = build(nums, mid+1, right)\n    return node\n}",
    "lineMap": {
      "start": [
        1
      ],
      "call_build": [
        2
      ],
      "base_case": [
        6,
        7
      ],
      "find_mid": [
        10
      ],
      "create_node": [
        11
      ],
      "build_left": [
        13
      ],
      "build_right": [
        14
      ],
      "return_node": [
        15
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "base_case": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var sortedArrayToBST = function (nums) {\n  return build(nums, 0, nums.length - 1);\n};\n\nfunction build(nums, left, right) {\n  if (left > right) {\n    return null;\n  }\n  // Pick the middle element as the root of this subtree\n  const mid = left + Math.floor((right - left) / 2);\n  const node = new TreeNode(nums[mid]);\n  // Recursively build left and right subtrees from remaining halves\n  node.left = build(nums, left, mid - 1);\n  node.right = build(nums, mid + 1, right);\n  return node;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "call_build": [
        2
      ],
      "base_case": [
        6,
        7
      ],
      "find_mid": [
        10
      ],
      "create_node": [
        11
      ],
      "build_left": [
        13
      ],
      "build_right": [
        14
      ],
      "return_node": [
        15
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "base_case": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sortedArrayToBST(nums: number[]): TreeNode | null {\n    return build(nums, 0, nums.length - 1);\n}\n\nfunction build(nums: number[], left: number, right: number): TreeNode | null {\n    if (left > right) {\n        return null;\n    }\n    // Pick the middle element as the root of this subtree\n    const mid = left + Math.floor((right - left) / 2);\n    const node = new TreeNode(nums[mid]);\n    // Recursively build left and right subtrees from remaining halves\n    node.left = build(nums, left, mid - 1);\n    node.right = build(nums, mid + 1, right);\n    return node;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "call_build": [
        2
      ],
      "base_case": [
        6,
        7
      ],
      "find_mid": [
        10
      ],
      "create_node": [
        11
      ],
      "build_left": [
        13
      ],
      "build_right": [
        14
      ],
      "return_node": [
        15
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "base_case": [
        6
      ]
    }
  }
};

const ConvertSortedArrayToBinarySearchTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        -10,
        -3,
        0,
        5,
        9
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Complete BST",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Nine Elements",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ]
    }
  }
];

function generateConvertSortedArrayToBinarySearchTreeSteps(e: any): any[] {
  
let t=e.nums||[],r={};t.forEach((e,t)=>{r[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let a=new RecursiveStepRecorder({nums:t},r);a.pushCallFrame({nums:`[${t.join(", ")}]`},"sortedArrayToBST"),a.record("start","Start: build a height-balanced BST from the sorted array");let l=(e,t,r)=>{let i=e>0?Math.floor((e-1)/2):void 0;return{type:"binaryTreeNode",value:t,parent:void 0!==i?`node_${i}`:void 0,isLeftChild:e>0?e%2==1:void 0,state:r}},n=(e,r,i,l)=>{a.update_global_variable("left",e),a.update_global_variable("right",r),a.update_global_variable("mid",i),a.update_global_variable("midVal",i>=0?t[i]:null),a.update_global_variable("heapIdx",l)},s=[],o=new Map;return a.record("call_build",`Call build(0, ${t.length-1}) on the whole array`),!function e(r,i,d){if(a.pushCallFrame({left:r,right:i},"build"),r>i){a.add_conditional("base_case",!0),n(r,i,-1,d),a.record("base_case",`left > right for [${r}..${i}]: empty subarray, return null`),a.popCallFrame();return}a.add_conditional("base_case",!1);let u=r+Math.floor((i-r)/2);if(n(r,i,u,d),a.record("find_mid",`Middle index of [${r}..${i}]: mid = ${u}, nums[mid] = ${t[u]}`),s.length>0){let e=s[s.length-1];a.update_visual(`node_${e}`,l(e,o.get(e),"building"))}if(s.push(d),o.set(d,t[u]),a.update_visual(`node_${d}`,l(d,t[u],"current")),a.update_visual(`elem_${u}`,{type:"arrayElement",value:t[u],position:u,state:"used"}),a.record("create_node",`Create a new tree node with nums[${u}] = ${t[u]} as the root of this subtree`),n(r,i,u,d),a.record("build_left",`Build the left subtree from nums[${r}..${u-1}]`),e(r,u-1,2*d+1),n(r,i,u,d),a.record("build_right",`Build the right subtree from nums[${u+1}..${i}]`),e(u+1,i,2*d+2),a.update_visual(`node_${d}`,l(d,t[u],"done")),s.pop(),s.length>0){let e=s[s.length-1];a.update_visual(`node_${e}`,l(e,o.get(e),"current"))}n(r,i,u,d),a.record("return_node",`Return the node ${t[u]}: subtree for [${r}..${i}] is complete`),a.popCallFrame()}(0,t.length-1,0),a.update_global_variable("mid",-1),a.record("complete","Height-balanced BST built: return root"),a.popCallFrame(),a.getSteps()
}

export function ConvertSortedArrayToBinarySearchTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ConvertSortedArrayToBinarySearchTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateConvertSortedArrayToBinarySearchTreeSteps(e) as any[];
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
      title="Convert Sorted Array to Binary Search Tree"
      slug="convert-sorted-array-to-binary-search-tree"
      approaches={approaches}
      presets={ConvertSortedArrayToBinarySearchTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Difference Between Node and Ancestor (maximum-difference-between-node-and-ancestor)
// ==========================================

const MaximumDifferenceBetweenNodeAndAncestorTemplates = {
  "python": {
    "language": "python",
    "code": "def maxAncestorDiff(root):\n    def dfs(node, minVal, maxVal):\n        if not node:\n            # If node is null, return the difference between max and min values found so far\n            return maxVal - minVal\n\n        # Update min and max values on this path as we go deeper into the tree\n        minVal = min(minVal, node.val)\n        maxVal = max(maxVal, node.val)\n\n        # Travel down both children and get their max differences\n        leftMaxDiff = dfs(node.left, minVal, maxVal)\n        rightMaxDiff = dfs(node.right, minVal, maxVal)\n\n        # Return the maximum difference obtained from either subtree\n        return max(leftMaxDiff, rightMaxDiff)\n\n    # Start DFS from the root node with its own value as both min and max\n    return dfs(root, root.val, root.val)",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        2
      ],
      "start_dfs": [
        2
      ],
      "visit_node": [
        2,
        3
      ],
      "base_case_null": [
        5
      ],
      "update_min_max": [
        8,
        9
      ],
      "calc_diff": [
        8,
        9
      ],
      "before_left": [
        12
      ],
      "after_left": [
        12
      ],
      "before_right": [
        13
      ],
      "after_right": [
        13
      ],
      "return_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maxAncestorDiff(TreeNode root) {\n        // Start DFS from the root node with its own value as both min and max.\n        return dfs(root, root.val, root.val);\n    }\n\n    private int dfs(TreeNode node, int minVal, int maxVal) {\n        if (node == null) {\n            // If node is null, return the difference between max and min values found so far.\n            return maxVal - minVal;\n        }\n\n        // Update min and max values on this path as we go deeper into the tree.\n        minVal = Math.min(minVal, node.val);\n        maxVal = Math.max(maxVal, node.val);\n\n        // Travel down both children and get their max differences.\n        int leftMaxDiff = dfs(node.left, minVal, maxVal);\n        int rightMaxDiff = dfs(node.right, minVal, maxVal);\n\n        // Return the maximum difference obtained from either subtree.\n        return Math.max(leftMaxDiff, rightMaxDiff);\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "empty_tree": [
        2
      ],
      "init": [
        4
      ],
      "start_dfs": [
        4
      ],
      "visit_node": [
        7
      ],
      "base_case_null": [
        10
      ],
      "update_min_max": [
        14,
        15
      ],
      "calc_diff": [
        14,
        15
      ],
      "before_left": [
        18
      ],
      "after_left": [
        19
      ],
      "before_right": [
        19
      ],
      "after_right": [
        19
      ],
      "return_max": [
        22
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "is_null": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maxAncestorDiff(TreeNode* root) {\n        // Start DFS from the root node with its own value as both min and max.\n        return dfs(root, root->val, root->val);\n    }\n\nprivate:\n    int dfs(TreeNode* node, int minVal, int maxVal) {\n        if (!node) {\n            // If node is null, return the difference between max and min values found so far.\n            return maxVal - minVal;\n        }\n\n        // Update min and max values on this path as we go deeper into the tree.\n        minVal = min(minVal, node->val);\n        maxVal = max(maxVal, node->val);\n\n        // Travel down both children and get their max differences.\n        int leftMaxDiff = dfs(node->left, minVal, maxVal);\n        int rightMaxDiff = dfs(node->right, minVal, maxVal);\n\n        // Return the maximum difference obtained from either subtree.\n        return max(leftMaxDiff, rightMaxDiff);\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "empty_tree": [
        3
      ],
      "init": [
        5
      ],
      "start_dfs": [
        5
      ],
      "visit_node": [
        10
      ],
      "base_case_null": [
        12
      ],
      "update_min_max": [
        16,
        17
      ],
      "calc_diff": [
        16,
        17
      ],
      "before_left": [
        20
      ],
      "after_left": [
        20
      ],
      "before_right": [
        21
      ],
      "after_right": [
        21
      ],
      "return_max": [
        24
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaxAncestorDiff(TreeNode root) {\n        // Start DFS from the root node with its own value as both min and max.\n        return Dfs(root, root.val, root.val);\n    }\n\n    private int Dfs(TreeNode node, int minVal, int maxVal) {\n        if (node == null) {\n            // If node is null, return the difference between max and min values found so far.\n            return maxVal - minVal;\n        }\n\n        // Update min and max values on this path as we go deeper into the tree.\n        minVal = Math.Min(minVal, node.val);\n        maxVal = Math.Max(maxVal, node.val);\n\n        // Travel down both children and get their max differences.\n        int leftMaxDiff = Dfs(node.left, minVal, maxVal);\n        int rightMaxDiff = Dfs(node.right, minVal, maxVal);\n\n        // Return the maximum difference obtained from either subtree.\n        return Math.Max(leftMaxDiff, rightMaxDiff);\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "empty_tree": [
        2
      ],
      "init": [
        4
      ],
      "start_dfs": [
        4
      ],
      "visit_node": [
        8
      ],
      "base_case_null": [
        10
      ],
      "update_min_max": [
        14,
        15
      ],
      "calc_diff": [
        14,
        15
      ],
      "before_left": [
        18
      ],
      "after_left": [
        18
      ],
      "before_right": [
        19
      ],
      "after_right": [
        19
      ],
      "return_max": [
        22
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "is_null": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxAncestorDiff(root *TreeNode) int {\n    // Start DFS from the root node with its own value as both min and max.\n    return dfs(root, root.Val, root.Val)\n}\n\nfunc dfs(node *TreeNode, minVal int, maxVal int) int {\n    if node == nil {\n        // If node is null, return the difference between max and min values found so far.\n        return maxVal - minVal\n    }\n\n    // Update min and max values on this path as we go deeper into the tree.\n    minVal = min(minVal, node.Val)\n    maxVal = max(maxVal, node.Val)\n\n    // Travel down both children and get their max differences.\n    leftMaxDiff := dfs(node.Left, minVal, maxVal)\n    rightMaxDiff := dfs(node.Right, minVal, maxVal)\n\n    // Return the maximum difference obtained from either subtree.\n    return max(leftMaxDiff, rightMaxDiff)\n}\n\nfunc min(a, b int) int {\n    if a < b {\n        return a\n    }\n    return b\n}\n\nfunc max(a, b int) int {\n    if a > b {\n        return a\n    }\n    return b\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        3
      ],
      "start_dfs": [
        3
      ],
      "visit_node": [
        7
      ],
      "base_case_null": [
        9
      ],
      "update_min_max": [
        13,
        14
      ],
      "calc_diff": [
        13,
        14
      ],
      "before_left": [
        17
      ],
      "after_left": [
        17
      ],
      "before_right": [
        18
      ],
      "after_right": [
        18
      ],
      "return_max": [
        21
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxAncestorDiff(root) {\n    function dfs(node, minVal, maxVal) {\n        if (!node) {\n            // If node is null, return the difference between max and min values found so far\n            return maxVal - minVal;\n        }\n\n        // Update min and max values on this path as we go deeper into the tree\n        minVal = Math.min(minVal, node.val);\n        maxVal = Math.max(maxVal, node.val);\n\n        // Travel down both children and get their max differences\n        const leftMaxDiff = dfs(node.left, minVal, maxVal);\n        const rightMaxDiff = dfs(node.right, minVal, maxVal);\n\n        // Return the maximum difference obtained from either subtree\n        return Math.max(leftMaxDiff, rightMaxDiff);\n    }\n\n    // Start DFS from the root node with its own value as both min and max\n    return dfs(root, root.val, root.val);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        2
      ],
      "start_dfs": [
        21
      ],
      "visit_node": [
        3
      ],
      "base_case_null": [
        5
      ],
      "update_min_max": [
        9,
        10
      ],
      "calc_diff": [
        9,
        10
      ],
      "before_left": [
        13
      ],
      "after_left": [
        13
      ],
      "before_right": [
        14
      ],
      "after_right": [
        14
      ],
      "return_max": [
        17
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxAncestorDiff(root: TreeNode | null): number {\n    function dfs(node: TreeNode | null, minVal: number, maxVal: number): number {\n        if (!node) {\n            // If node is null, return the difference between max and min values found so far\n            return maxVal - minVal;\n        }\n\n        // Update min and max values on this path as we go deeper into the tree\n        minVal = Math.min(minVal, node.val);\n        maxVal = Math.max(maxVal, node.val);\n\n        // Travel down both children and get their max differences\n        const leftMaxDiff = dfs(node.left, minVal, maxVal);\n        const rightMaxDiff = dfs(node.right, minVal, maxVal);\n\n        // Return the maximum difference obtained from either subtree\n        return Math.max(leftMaxDiff, rightMaxDiff);\n    }\n\n    // Start DFS from the root node with its own value as both min and max\n    return dfs(root, root.val, root.val);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        21
      ],
      "start_dfs": [
        21
      ],
      "visit_node": [
        3
      ],
      "base_case_null": [
        5
      ],
      "update_min_max": [
        9,
        10
      ],
      "calc_diff": [
        9,
        10
      ],
      "before_left": [
        13
      ],
      "after_left": [
        13
      ],
      "before_right": [
        14
      ],
      "after_right": [
        14
      ],
      "return_max": [
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ]
    }
  }
};

const MaximumDifferenceBetweenNodeAndAncestorPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
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
        13
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        1,
        null,
        2,
        null,
        0,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Balanced Tree",
    "value": {
      "tree": [
        5,
        3,
        8,
        1,
        4,
        7,
        9
      ]
    }
  }
];

function generateMaximumDifferenceBetweenNodeAndAncestorSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),a=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(a.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);a.has(t)&&(a.get(e).parent=t,a.get(e).isLeftChild=e%2==1)}let i={};a.forEach((e,t)=>{i[`node_${t}`]={type:"binaryTreeNode",value:e.value,parent:void 0!==e.parent?`node_${e.parent}`:void 0,isLeftChild:e.isLeftChild}});let l=new RecursiveStepRecorder({},{...i});l.pushCallFrame({root:(0,_treeHelper848569.kU)(a.get(0)??null)},"maxAncestorDiff");let{updateNodeState:o,setNodeStateExclusive:s}=(0,_treeHelper848569.E4)(a,l);if(l.record("start","Start: Find maximum difference between node and ancestor"),!a.has(0))return l.record("empty_tree","Empty tree, no difference possible"),l.popCallFrame(),l.getSteps();let d=a.get(0);l.update_global_variable("result",0);let c=0,f=[];l.record("start_dfs",`Start DFS from root with minVal = ${d.value}, maxVal = ${d.value}`);let u=function e(t,r,i){if(f.push(t),s(t,"active"),!a.has(t)){let e=i-r;return l.pushCallFrame({node:null,minVal:r,maxVal:i},"dfs"),l.record("visit_node","Visit null node"),l.add_conditional("is_null",!0),l.update_frame_variable("diff",e),l.record("base_case_null",`Null node - return difference: ${i} - ${r} = ${e}`),l.popCallFrame(),f.length>0&&(f.pop(),s(f[f.length-1],"active")),e}let d=a.get(t),u=d.value;l.pushCallFrame({node:(0,_treeHelper848569.kU)(d),minVal:r,maxVal:i},"dfs"),l.record("visit_node",`Visit node ${u}`),l.add_conditional("is_null",!1),l.update_visual(`node_${t}`,{type:"binaryTreeNode",value:u,parent:void 0!==d.parent?`node_${d.parent}`:void 0,isLeftChild:d.isLeftChild,state:"active"});let h=Math.min(r,u),m=Math.max(i,u);l.update_frame_variable("minVal",h),l.update_frame_variable("maxVal",m),l.record("update_min_max",`Update min = ${h}, max = ${m}`);let p=m-h;l.update_frame_variable("currentDiff",p);let x=2*t+1;l.record("before_left","Recurse into left subtree");let g=e(x,h,m);l.update_frame_variable("leftMaxDiff",g),l.record("after_left",`Left subtree max difference: ${g}`);let v=2*t+2;l.record("before_right","Recurse into right subtree");let b=e(v,h,m);l.update_frame_variable("rightMaxDiff",b),l.record("after_right",`Right subtree max difference: ${b}`);let _=Math.max(g,b);return l.update_frame_variable("result",_),c=Math.max(c,_),l.update_global_variable("result",c),l.record("return_max",`Return max(${g}, ${b}) = ${_}`),void 0!==d.parent&&l.add_new_visual(`edge_label_${t}`,{type:"edgeLabel",childNode:`node_${t}`,parentNode:`node_${d.parent}`,value:_}),f.length>0&&(f.pop(),f.length>0&&s(f[f.length-1],"active")),o(t,"visited"),l.popCallFrame(),_}(0,d.value,d.value);return l.update_global_variable("result",u),l.record("complete",`DFS complete! Maximum difference: ${u}`),l.popCallFrame(),l.getSteps()
}

export function MaximumDifferenceBetweenNodeAndAncestorProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumDifferenceBetweenNodeAndAncestorTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumDifferenceBetweenNodeAndAncestorSteps(e) as any[];
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
      title="Maximum Difference Between Node and Ancestor"
      slug="maximum-difference-between-node-and-ancestor"
      approaches={approaches}
      presets={MaximumDifferenceBetweenNodeAndAncestorPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Path Sum III (path-sum-iii)
// ==========================================

const PathSumIiiTemplates = {
  "python": {
    "language": "python",
    "code": "def pathSum(root, targetSum):\n    prefix = {0: 1}\n    result = 0\n\n    def dfs(node, currentSum):\n        nonlocal result\n        if node is None:\n            return\n\n        currentSum += node.val\n        result += prefix.get(currentSum - targetSum, 0)\n        prefix[currentSum] = prefix.get(currentSum, 0) + 1\n\n        dfs(node.left, currentSum)\n        dfs(node.right, currentSum)\n\n        prefix[currentSum] -= 1\n\n    dfs(root, 0)\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "start_dfs": [
        2,
        3
      ],
      "visit_node": [
        7
      ],
      "update_sum": [
        10
      ],
      "count_paths": [
        11
      ],
      "add_prefix": [
        12
      ],
      "recurse_left": [
        14
      ],
      "recurse_right": [
        15
      ],
      "backtrack": [
        17
      ],
      "complete": [
        20
      ],
      "empty_tree": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int pathSum(TreeNode root, int targetSum) {\n    Map<Long, Integer> prefix = new HashMap<>();\n    prefix.put(0L, 1);\n    return dfs(root, 0L, targetSum, prefix);\n}\n\nprivate int dfs(TreeNode node, long currentSum, int targetSum, Map<Long, Integer> prefix) {\n    if (node == null) {\n        return 0;\n    }\n\n    currentSum += node.val;\n    int count = prefix.getOrDefault(currentSum - targetSum, 0);\n    prefix.merge(currentSum, 1, Integer::sum);\n\n    count += dfs(node.left, currentSum, targetSum, prefix);\n    count += dfs(node.right, currentSum, targetSum, prefix);\n\n    prefix.merge(currentSum, -1, Integer::sum);\n    return count;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "start_dfs": [
        2,
        3
      ],
      "visit_node": [
        8
      ],
      "update_sum": [
        12
      ],
      "count_paths": [
        13
      ],
      "add_prefix": [
        14
      ],
      "recurse_left": [
        16
      ],
      "recurse_right": [
        17
      ],
      "backtrack": [
        19
      ],
      "complete": [
        4
      ],
      "empty_tree": [
        8
      ]
    },
    "conditionalMap": {
      "is_null": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int pathSum(TreeNode* root, int targetSum) {\n    unordered_map<long, int> prefix;\n    prefix[0] = 1;\n    return dfs(root, 0L, targetSum, prefix);\n}\n\nint dfs(TreeNode* node, long currentSum, int targetSum, unordered_map<long, int>& prefix) {\n    if (node == nullptr) {\n        return 0;\n    }\n\n    currentSum += node->val;\n    int count = prefix.count(currentSum - targetSum) ? prefix[currentSum - targetSum] : 0;\n    prefix[currentSum]++;\n\n    count += dfs(node->left, currentSum, targetSum, prefix);\n    count += dfs(node->right, currentSum, targetSum, prefix);\n\n    prefix[currentSum]--;\n    return count;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "start_dfs": [
        2,
        3
      ],
      "visit_node": [
        8
      ],
      "update_sum": [
        12
      ],
      "count_paths": [
        13
      ],
      "add_prefix": [
        14
      ],
      "recurse_left": [
        16
      ],
      "recurse_right": [
        17
      ],
      "backtrack": [
        19
      ],
      "complete": [
        4
      ],
      "empty_tree": [
        8
      ]
    },
    "conditionalMap": {
      "is_null": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int PathSum(TreeNode root, int targetSum) {\n    var prefix = new Dictionary<long, int> { { 0, 1 } };\n    return Dfs(root, 0L, targetSum, prefix);\n}\n\nprivate int Dfs(TreeNode node, long currentSum, int targetSum, Dictionary<long, int> prefix) {\n    if (node == null) {\n        return 0;\n    }\n\n    currentSum += node.val;\n    int count = prefix.GetValueOrDefault(currentSum - targetSum, 0);\n    prefix[currentSum] = prefix.GetValueOrDefault(currentSum, 0) + 1;\n\n    count += Dfs(node.left, currentSum, targetSum, prefix);\n    count += Dfs(node.right, currentSum, targetSum, prefix);\n\n    prefix[currentSum]--;\n    return count;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "start_dfs": [
        2
      ],
      "visit_node": [
        7
      ],
      "update_sum": [
        11
      ],
      "count_paths": [
        12
      ],
      "add_prefix": [
        13
      ],
      "recurse_left": [
        15
      ],
      "recurse_right": [
        16
      ],
      "backtrack": [
        18
      ],
      "complete": [
        3
      ],
      "empty_tree": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func pathSum(root *TreeNode, targetSum int) int {\n    prefix := map[int]int{0: 1}\n    return dfs(root, 0, targetSum, prefix)\n}\n\nfunc dfs(node *TreeNode, currentSum int, targetSum int, prefix map[int]int) int {\n    if node == nil {\n        return 0\n    }\n\n    currentSum += node.Val\n    count := prefix[currentSum-targetSum]\n    prefix[currentSum]++\n\n    count += dfs(node.Left, currentSum, targetSum, prefix)\n    count += dfs(node.Right, currentSum, targetSum, prefix)\n\n    prefix[currentSum]--\n    return count\n}",
    "lineMap": {
      "start": [
        1
      ],
      "start_dfs": [
        2
      ],
      "visit_node": [
        7
      ],
      "update_sum": [
        11
      ],
      "count_paths": [
        12
      ],
      "add_prefix": [
        13
      ],
      "recurse_left": [
        15
      ],
      "recurse_right": [
        16
      ],
      "backtrack": [
        18
      ],
      "complete": [
        3
      ],
      "empty_tree": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function pathSum(root, targetSum) {\n    const prefix = new Map([[0, 1]]);\n\n    function dfs(node, currentSum) {\n        if (node === null) {\n            return 0;\n        }\n\n        currentSum += node.val;\n        let count = prefix.get(currentSum - targetSum) || 0;\n        prefix.set(currentSum, (prefix.get(currentSum) || 0) + 1);\n\n        count += dfs(node.left, currentSum);\n        count += dfs(node.right, currentSum);\n\n        prefix.set(currentSum, prefix.get(currentSum) - 1);\n        return count;\n    }\n\n    return dfs(root, 0);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "start_dfs": [
        2
      ],
      "visit_node": [
        5
      ],
      "update_sum": [
        9
      ],
      "count_paths": [
        10
      ],
      "add_prefix": [
        11
      ],
      "recurse_left": [
        13
      ],
      "recurse_right": [
        14
      ],
      "backtrack": [
        16
      ],
      "complete": [
        20
      ],
      "empty_tree": [
        5
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function pathSum(root: TreeNode | null, targetSum: number): number {\n    const prefix = new Map<number, number>([[0, 1]]);\n\n    function dfs(node: TreeNode | null, currentSum: number): number {\n        if (node === null) {\n            return 0;\n        }\n\n        currentSum += node.val;\n        let count = prefix.get(currentSum - targetSum) || 0;\n        prefix.set(currentSum, (prefix.get(currentSum) || 0) + 1);\n\n        count += dfs(node.left, currentSum);\n        count += dfs(node.right, currentSum);\n\n        prefix.set(currentSum, prefix.get(currentSum)! - 1);\n        return count;\n    }\n\n    return dfs(root, 0);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "start_dfs": [
        2
      ],
      "visit_node": [
        5
      ],
      "update_sum": [
        9
      ],
      "count_paths": [
        10
      ],
      "add_prefix": [
        11
      ],
      "recurse_left": [
        13
      ],
      "recurse_right": [
        14
      ],
      "backtrack": [
        16
      ],
      "complete": [
        20
      ],
      "empty_tree": [
        5
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ]
    }
  }
};

const PathSumIiiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        10,
        5,
        -3,
        3,
        2,
        null,
        11,
        3,
        -2,
        null,
        1
      ],
      "targetSum": 8
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        5,
        4,
        8,
        11,
        null,
        13,
        4,
        7,
        2,
        null,
        null,
        5,
        1
      ],
      "targetSum": 22
    }
  },
  {
    "id": "ex3",
    "label": "Simple Tree",
    "value": {
      "tree": [
        1,
        2,
        3
      ],
      "targetSum": 3
    }
  }
];

function generatePathSumIiiSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=e.targetSum||0,i=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(i.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);i.has(t)&&(i.get(e).parent=t,i.get(e).isLeftChild=e%2==1)}let l=e=>e<t.length&&null!==t[e],u=(e,t)=>{let r=i.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,state:t}},o={};i.forEach((e,t)=>{o[`node_${t}`]=u(t)});let s=new RecursiveStepRecorder({},{...o});s.pushCallFrame({root:(0,_treeHelper848569.kU)(i.get(0)??null),targetSum:r},"pathSum"),s.record("start","Start: count every downward path that sums to the target");let d=new Map;d.set(0,1);let c=()=>Array.from(d.entries()).map(([e,t])=>({sum:e,count:t}));s.update_global_variable("target",r),s.update_global_variable("result",0),s.update_global_variable("mapEntries",c()),s.record("start_dfs","prefix map starts with {0: 1}; walk the tree with currentSum = 0");let m=0,h=[];return i.has(0)?(!function e(t,n){h.push(t),s.pushCallFrame({node:(0,_treeHelper848569.kU)(i.get(t)),currentSum:n},"dfs");let o=i.get(t),p=n+o.value;s.add_conditional("is_null",!1),s.update_global_variable("currentIdx",t),s.update_global_variable("currentVal",o.value),s.update_global_variable("currentSum",p),s.update_global_variable("pathIdxs",[...h]),s.record("visit_node",`Visit ${o.value}`),s.update_frame_variable("currentSum",p),s.record("update_sum",`currentSum = ${n} + ${o.value} = ${p}`);let g=p-r,f=d.get(g)||0;if(m+=f,s.update_global_variable("lookupKey",g),s.update_global_variable("numPaths",f),s.update_global_variable("result",m),f>0){let e=0;if(0!==g){let t=0;for(let r=0;r<h.length-1;r++)if((t+=i.get(h[r]).value)===g){e=r+1;break}}for(let t=e;t<h.length;t++)s.update_visual(`node_${h[t]}`,u(h[t],"result"))}s.record("count_paths",f>0?`sum - target = ${p} - ${r} = ${g}: map has it ${f}x -> +${f} path(s)`:`sum - target = ${p} - ${r} = ${g}: not in map, no path ends here`);let x=d.get(p)||0;d.set(p,x+1),s.update_global_variable("activeSum",p),s.update_global_variable("mapEntries",c()),s.record("add_prefix",`Record prefix ${p} in the map (count ${x+1})`);let S=2*t+1,b=2*t+2;l(S)&&(s.update_global_variable("pathIdxs",[...h]),s.record("recurse_left",`Go left from ${o.value}`),e(S,p),s.update_global_variable("currentIdx",t),s.update_global_variable("currentVal",o.value),s.update_global_variable("currentSum",p),s.update_global_variable("pathIdxs",[...h])),l(b)&&(s.update_global_variable("pathIdxs",[...h]),s.record("recurse_right",`Go right from ${o.value}`),e(b,p),s.update_global_variable("currentIdx",t),s.update_global_variable("currentVal",o.value),s.update_global_variable("currentSum",p),s.update_global_variable("pathIdxs",[...h]));let v=d.get(p)||0;if(v>1?d.set(p,v-1):d.delete(p),s.update_global_variable("activeSum",p),s.update_global_variable("numPaths",-1),s.update_global_variable("mapEntries",c()),s.record("backtrack",`Backtrack from ${o.value}: drop prefix ${p} from the map`),h.pop(),s.popCallFrame(),h.length>0){let e=h[h.length-1];s.update_global_variable("currentIdx",e),s.update_global_variable("pathIdxs",[...h])}else s.update_global_variable("currentIdx",-1),s.update_global_variable("pathIdxs",[])}(0,0),s.update_global_variable("currentIdx",-1),s.update_global_variable("pathIdxs",[]),s.update_global_variable("numPaths",-1),s.update_global_variable("result",m),s.record("complete",`Done: ${m} path(s) sum to ${r}`)):(s.update_global_variable("result",0),s.record("empty_tree","Empty tree: return 0")),s.popCallFrame(),s.getSteps()
}

export function PathSumIiiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PathSumIiiTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePathSumIiiSteps(e) as any[];
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
      title="Path Sum III"
      slug="path-sum-iii"
      approaches={approaches}
      presets={PathSumIiiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Tree Inorder Traversal (binary-tree-inorder-traversal)
// ==========================================

const BinaryTreeInorderTraversalTemplates = {
  "python": {
    "language": "python",
    "code": "def inorderTraversal(root):\n    result = []\n    stack = []\n    current = root\n\n    while stack or current:\n        # Reach the leftmost node\n        while current:\n            stack.append(current)\n            current = current.left\n\n        # Current must be None at this point\n        current = stack.pop()\n        result.append(current.val)  # Visit the node\n\n        # Visit the right subtree\n        current = current.right\n\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init_current": [
        2,
        3,
        4
      ],
      "push_current": [
        9
      ],
      "move_left": [
        10
      ],
      "no_left": [
        10
      ],
      "pop_node": [
        13
      ],
      "visit_node": [
        14
      ],
      "move_right": [
        17
      ],
      "no_right": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        6
      ],
      "while_current": [
        8
      ],
      "has_left": [
        10
      ],
      "has_right": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> inorderTraversal(TreeNode root) {\n    List<Integer> result = new ArrayList<>();\n    Stack<TreeNode> stack = new Stack<>();\n    TreeNode current = root;\n\n    while (!stack.isEmpty() || current != null) {\n        // Reach the leftmost node of the current node\n        while (current != null) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        // Current must be null at this point\n        current = stack.pop();\n        result.add(current.val); // Visit the node\n\n        // We have visited the node and its left subtree. Now, visit the right subtree\n        current = current.right;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        1,
        2
      ],
      "init_current": [
        2,
        3,
        4
      ],
      "push_current": [
        9
      ],
      "move_left": [
        10
      ],
      "no_left": [
        10
      ],
      "pop_node": [
        14
      ],
      "visit_node": [
        15
      ],
      "move_right": [
        18
      ],
      "no_right": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        6
      ],
      "while_current": [
        8
      ],
      "has_left": [
        10
      ],
      "has_right": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> inorderTraversal(TreeNode* root) {\n    vector<int> result;\n    stack<TreeNode*> stk;\n    TreeNode* current = root;\n\n    while (!stk.empty() || current != nullptr) {\n        // Reach the leftmost node of the current node\n        while (current != nullptr) {\n            stk.push(current);\n            current = current->left;\n        }\n\n        // Current must be nullptr at this point\n        current = stk.top();\n        stk.pop();\n        result.push_back(current->val); // Visit the node\n\n        // We have visited the node and its left subtree. Now, visit the right subtree\n        current = current->right;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        1,
        2
      ],
      "init_current": [
        2,
        3,
        4
      ],
      "push_current": [
        9
      ],
      "move_left": [
        10
      ],
      "no_left": [
        10
      ],
      "pop_node": [
        14,
        15
      ],
      "visit_node": [
        16
      ],
      "move_right": [
        19
      ],
      "no_right": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        6
      ],
      "while_current": [
        8
      ],
      "has_left": [
        10
      ],
      "has_right": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function inorderTraversal(root) {\n    const result = [];\n    const stack = [];\n    let current = root;\n\n    while (stack.length > 0 || current !== null) {\n        // Reach the leftmost node of the current node\n        while (current !== null) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        // Current must be null at this point\n        current = stack.pop();\n        result.push(current.val); // Visit the node\n\n        // We have visited the node and its left subtree. Now, visit the right subtree\n        current = current.right;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init_current": [
        2,
        3,
        4
      ],
      "push_current": [
        9
      ],
      "move_left": [
        10
      ],
      "no_left": [
        10
      ],
      "pop_node": [
        14
      ],
      "visit_node": [
        15
      ],
      "move_right": [
        18
      ],
      "no_right": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        6
      ],
      "while_current": [
        8
      ],
      "has_left": [
        10
      ],
      "has_right": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function inorderTraversal(root: TreeNode | null): number[] {\n    const result: number[] = [];\n    const stack: TreeNode[] = [];\n    let current: TreeNode | null = root;\n\n    while (stack.length > 0 || current !== null) {\n        // Reach the leftmost node of the current node\n        while (current !== null) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        // Current must be null at this point\n        current = stack.pop()!;\n        result.push(current.val); // Visit the node\n\n        // We have visited the node and its left subtree. Now, visit the right subtree\n        current = current.right;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init_current": [
        2,
        3,
        4
      ],
      "push_current": [
        9
      ],
      "move_left": [
        10
      ],
      "no_left": [
        10
      ],
      "pop_node": [
        14
      ],
      "visit_node": [
        15
      ],
      "move_right": [
        18
      ],
      "no_right": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        6
      ],
      "while_current": [
        8
      ],
      "has_left": [
        10
      ],
      "has_right": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<int> InorderTraversal(TreeNode root) {\n    var result = new List<int>();\n    var stack = new Stack<TreeNode>();\n    TreeNode current = root;\n\n    while (stack.Count > 0 || current != null) {\n        // Reach the leftmost node of the current node\n        while (current != null) {\n            stack.Push(current);\n            current = current.left;\n        }\n\n        // Current must be null at this point\n        current = stack.Pop();\n        result.Add(current.val); // Visit the node\n\n        // We have visited the node and its left subtree. Now, visit the right subtree\n        current = current.right;\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        1,
        2
      ],
      "init_current": [
        2,
        3,
        4
      ],
      "push_current": [
        9
      ],
      "move_left": [
        10
      ],
      "no_left": [
        10
      ],
      "pop_node": [
        14
      ],
      "visit_node": [
        15
      ],
      "move_right": [
        18
      ],
      "no_right": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        6
      ],
      "while_current": [
        8
      ],
      "has_left": [
        10
      ],
      "has_right": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func inorderTraversal(root *TreeNode) []int {\n    result := []int{}\n    stack := []*TreeNode{}\n    current := root\n\n    for len(stack) > 0 || current != nil {\n        // Reach the leftmost node of the current node\n        for current != nil {\n            stack = append(stack, current)\n            current = current.Left\n        }\n\n        // Current must be nil at this point\n        current = stack[len(stack)-1]\n        stack = stack[:len(stack)-1]\n        result = append(result, current.Val) // Visit the node\n\n        // We have visited the node and its left subtree. Now, visit the right subtree\n        current = current.Right\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        1,
        2
      ],
      "init_current": [
        2,
        3,
        4
      ],
      "push_current": [
        9
      ],
      "move_left": [
        10
      ],
      "no_left": [
        10
      ],
      "pop_node": [
        14,
        15
      ],
      "visit_node": [
        16
      ],
      "move_right": [
        19
      ],
      "no_right": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        6
      ],
      "while_current": [
        8
      ],
      "has_left": [
        10
      ],
      "has_right": [
        19
      ]
    }
  }
};

const BinaryTreeInorderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Small (5 nodes)",
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
    "label": "Example 1",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        null,
        8,
        null,
        null,
        6,
        7,
        9
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Complete Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  }
];

function generateBinaryTreeInorderTraversalSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let l=(e,t)=>{let i=r.get(e);return{type:"binaryTreeNode",value:i.value,parent:void 0!==i.parent?`node_${i.parent}`:void 0,isLeftChild:i.isLeftChild,state:t}},a={};r.forEach((e,t)=>{a[`node_${t}`]=l(t)});let o=new StepRecorder({result:[],stack:[],currentIdx:void 0},{...a});if(o.record("start","Start: one stack of (node, visited) frames"),0===r.size)return o.update_variable("result",[]),o.record("empty_tree","Empty tree, return []"),o.getSteps();let s=e=>e<t.length&&null!==t[e],d=[],u=[],c=0,h=()=>u.map(e=>`${r.get(e.idx).value}${e.flag?"✓":""}`),p=(e,t)=>{let i=`stack_f${c++}`;if(u.push({idx:e,flag:t,key:i}),o.add_new_visual(i,{type:"stackElement",value:r.get(e).value,position:u.length-1,flag:t,state:t?"visited":"unvisited"}),!r.has(e))return};for(p(0,!1),o.update_visual("node_0",l(0,"onstack")),o.update_variable("stack",h()),o.record("init_stack",`Push (root ${r.get(0).value}, unvisited)`);u.length>0;){let e=u.pop();o.delete_visual(e.key);let t=e.idx,i=r.get(t);if(o.update_visual(`node_${t}`,l(t,"current")),o.update_variable("stack",h()),o.update_variable("currentIdx",t),e.flag){o.record("pop_visited",`Pop (${i.value}, visited)`),d.push(i.value),o.update_visual(`node_${t}`,l(t,"visited")),o.update_variable("result",[...d]),o.record("output",`Marked visited — append ${i.value}: result = [${d.join(", ")}]`);continue}o.record("pop_unvisited",`Pop (${i.value}, unvisited): expand it`);let n=2*t+1,a=2*t+2;s(a)&&(p(a,!1),o.update_visual(`node_${a}`,l(a,"onstack"))),p(t,!0),o.update_visual(`node_${t}`,l(t,"onstack")),s(n)&&(p(n,!1),o.update_visual(`node_${n}`,l(n,"onstack"))),o.update_variable("stack",h()),o.record("expand",`Push right, (${i.value}, visited), left — so ${i.value} outputs after its left subtree`)}return o.update_variable("currentIdx",-1),o.record("complete",`Inorder traversal complete: [${d.join(", ")}]`),o.getSteps()
}

export function BinaryTreeInorderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreeInorderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreeInorderTraversalSteps(e) as any[];
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
      title="Binary Tree Inorder Traversal"
      slug="binary-tree-inorder-traversal"
      approaches={approaches}
      presets={BinaryTreeInorderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Distance Between BST Nodes (minimum-distance-between-bst-nodes)
// ==========================================

const MinimumDistanceBetweenBstNodesTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def minDiffInBST(self, root: Optional[TreeNode]) -> int:\n        self.min_diff = float('inf')\n        self.prev = None\n\n        def inorder(node):\n            if not node:\n                return\n            inorder(node.left)\n            # Compare current node with the previously visited node\n            if self.prev is not None:\n                self.min_diff = min(self.min_diff, node.val - self.prev)\n            self.prev = node.val\n            inorder(node.right)\n\n        inorder(root)\n        return self.min_diff",
    "lineMap": {
      "start": [
        2
      ],
      "init_variables": [
        3,
        4
      ],
      "empty_tree": [
        7,
        8
      ],
      "call_root": [
        16
      ],
      "enter": [
        6
      ],
      "base_case": [
        8
      ],
      "recurse_left": [
        9
      ],
      "first_node": [
        11
      ],
      "calculate_diff": [
        12
      ],
      "update_min": [
        12
      ],
      "no_update": [
        12
      ],
      "update_prev": [
        13
      ],
      "recurse_right": [
        14
      ],
      "return_frame": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ],
      "has_prev": [
        11
      ],
      "is_smaller": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    int minDiff = Integer.MAX_VALUE;\n    Integer prev = null;\n\n    public int minDiffInBST(TreeNode root) {\n        inorder(root);\n        return minDiff;\n    }\n\n    private void inorder(TreeNode node) {\n        if (node == null) return;\n        inorder(node.left);\n        // Compare current node with the previously visited node\n        if (prev != null) {\n            minDiff = Math.min(minDiff, node.val - prev);\n        }\n        prev = node.val;\n        inorder(node.right);\n    }\n}",
    "lineMap": {
      "start": [
        5
      ],
      "init_variables": [
        2,
        3
      ],
      "empty_tree": [
        11
      ],
      "call_root": [
        6
      ],
      "enter": [
        10
      ],
      "base_case": [
        11
      ],
      "recurse_left": [
        12
      ],
      "first_node": [
        14
      ],
      "calculate_diff": [
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
      "return_frame": [
        18
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        11
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
    "code": "class Solution {\npublic:\n    int minDiff = INT_MAX;\n    int prev = -1;\n\n    int minDiffInBST(TreeNode* root) {\n        inorder(root);\n        return minDiff;\n    }\n\nprivate:\n    void inorder(TreeNode* node) {\n        if (!node) return;\n        inorder(node->left);\n        // Compare current node with the previously visited node\n        if (prev != -1) {\n            minDiff = min(minDiff, node->val - prev);\n        }\n        prev = node->val;\n        inorder(node->right);\n    }\n};",
    "lineMap": {
      "start": [
        6
      ],
      "init_variables": [
        3,
        4
      ],
      "empty_tree": [
        13
      ],
      "call_root": [
        7
      ],
      "enter": [
        12
      ],
      "base_case": [
        13
      ],
      "recurse_left": [
        14
      ],
      "first_node": [
        16
      ],
      "calculate_diff": [
        17
      ],
      "update_min": [
        17
      ],
      "no_update": [
        17
      ],
      "update_prev": [
        19
      ],
      "recurse_right": [
        20
      ],
      "return_frame": [
        20
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "is_null": [
        13
      ],
      "has_prev": [
        16
      ],
      "is_smaller": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var minDiffInBST = function (root) {\n  let minDiff = Infinity;\n  let prev = null;\n\n  const inorder = (node) => {\n    if (!node) return;\n    inorder(node.left);\n    // Compare current node with the previously visited node\n    if (prev !== null) {\n      minDiff = Math.min(minDiff, node.val - prev);\n    }\n    prev = node.val;\n    inorder(node.right);\n  };\n  inorder(root);\n  return minDiff;\n};",
    "lineMap": {
      "start": [
        1
      ],
      "init_variables": [
        2,
        3
      ],
      "empty_tree": [
        6
      ],
      "call_root": [
        15
      ],
      "enter": [
        5
      ],
      "base_case": [
        6
      ],
      "recurse_left": [
        7
      ],
      "first_node": [
        9
      ],
      "calculate_diff": [
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
      "return_frame": [
        13
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
        9
      ],
      "is_smaller": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minDiffInBST(root: TreeNode | null): number {\n    let minDiff = Infinity;\n    let prev: number | null = null;\n\n    const inorder = (node: TreeNode | null): void => {\n        if (!node) return;\n        inorder(node.left);\n        // Compare current node with the previously visited node\n        if (prev !== null) {\n            minDiff = Math.min(minDiff, node.val - prev);\n        }\n        prev = node.val;\n        inorder(node.right);\n    };\n    inorder(root);\n    return minDiff;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_variables": [
        2,
        3
      ],
      "empty_tree": [
        6
      ],
      "call_root": [
        15
      ],
      "enter": [
        5
      ],
      "base_case": [
        6
      ],
      "recurse_left": [
        7
      ],
      "first_node": [
        9
      ],
      "calculate_diff": [
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
      "return_frame": [
        13
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
        9
      ],
      "is_smaller": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int minDiff = int.MaxValue;\n    private int? prev = null;\n\n    public int MinDiffInBST(TreeNode root) {\n        Inorder(root);\n        return minDiff;\n    }\n\n    private void Inorder(TreeNode node) {\n        if (node == null) return;\n        Inorder(node.left);\n        // Compare current node with the previously visited node\n        if (prev.HasValue) {\n            minDiff = Math.Min(minDiff, node.val - prev.Value);\n        }\n        prev = node.val;\n        Inorder(node.right);\n    }\n}",
    "lineMap": {
      "start": [
        5
      ],
      "init_variables": [
        2,
        3
      ],
      "empty_tree": [
        11
      ],
      "call_root": [
        6
      ],
      "enter": [
        10
      ],
      "base_case": [
        11
      ],
      "recurse_left": [
        12
      ],
      "first_node": [
        14
      ],
      "calculate_diff": [
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
      "return_frame": [
        18
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        11
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
    "code": "func minDiffInBST(root *TreeNode) int {\n    minDiff := math.MaxInt32\n    prev := -1\n\n    var inorder func(node *TreeNode)\n    inorder = func(node *TreeNode) {\n        if node == nil {\n            return\n        }\n        inorder(node.Left)\n        // Compare current node with the previously visited node\n        if prev != -1 && node.Val-prev < minDiff {\n            minDiff = node.Val - prev\n        }\n        prev = node.Val\n        inorder(node.Right)\n    }\n    inorder(root)\n    return minDiff\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_variables": [
        2,
        3
      ],
      "empty_tree": [
        7,
        8
      ],
      "call_root": [
        18
      ],
      "enter": [
        6
      ],
      "base_case": [
        8
      ],
      "recurse_left": [
        10
      ],
      "first_node": [
        12
      ],
      "calculate_diff": [
        12
      ],
      "update_min": [
        13
      ],
      "no_update": [
        12
      ],
      "update_prev": [
        15
      ],
      "recurse_right": [
        16
      ],
      "return_frame": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ],
      "has_prev": [
        12
      ],
      "is_smaller": [
        12
      ]
    }
  }
};

const MinimumDistanceBetweenBstNodesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
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
    "label": "Example 2",
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
    "label": "Example 3",
    "value": {
      "tree": [
        90,
        69,
        null,
        49,
        89,
        null,
        52
      ]
    }
  }
];

function generateMinimumDistanceBetweenBstNodesSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree??[]),n=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(n.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);n.has(t)&&(n.get(e).parent=t,n.get(e).isLeftChild=e%2==1)}let l=(e,t,i)=>{let r=n.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,state:t,label:i}},a={};n.forEach((e,t)=>{a[`node_${t}`]=l(t)});let o=new StepRecorder({root:(0,_treeHelper848569.kU)(n.get(0)),minDiff:null,prev:null,callStack:[],currentIdx:-1,currentVal:void 0,nullCall:null,returnedVal:null,visited:[]},{...a});if(o.record("start","Start: inorder traversal of a BST visits values in sorted order"),o.record("init_variables","Initialize the fields: minDiff = Infinity, prev = null"),0===n.size)return o.add_conditional("is_null",!0),o.record("empty_tree","Empty tree: inorder(null) returns immediately, minDiff stays Infinity"),o.getSteps();let s=1/0,d=null,u=-1,f=[],c=[],p=new Map,m=()=>{let e=f.length?f[f.length-1]:-1;n.forEach((t,n)=>{let i,r;p.has(n)?(i="visited",r=String(p.get(n))):n===e?i="current":f.includes(n)&&(i="onstack"),o.update_visual(`node_${n}`,l(n,i,r))})},v=()=>{let e=f.length?f[f.length-1]:-1;o.update_variable("callStack",f.map(e=>n.get(e).value)),o.update_variable("currentIdx",e),o.update_variable("currentVal",-1===e?void 0:n.get(e).value)};return o.record("call_root",`Call inorder(${n.get(0).value}) on the root to start the traversal`),!function e(t,i,r){if(!n.has(t)){let e=n.get(r).value;o.add_conditional("is_null",!0),o.update_variable("nullCall",i),o.record("base_case",`${"left"===i?"Left":"Right"} child of ${e} is null: inorder(null) returns immediately`),o.update_variable("nullCall",null);return}let l=n.get(t);if(f.push(t),m(),v(),o.add_conditional("is_null",!1),o.record("enter",`Enter inorder(${l.value}): node is not null, push a call frame`),o.record("recurse_left",`Recurse into the left subtree of ${l.value} first`),e(2*t+1,"left",t),c.push(l.value),p.set(t,c.length),m(),v(),o.update_variable("visited",[...c]),null!==d){let e=l.value-d;if(o.update_variable("diff",e),o.add_conditional("has_prev",!0),o.record("calculate_diff",`Left subtree of ${l.value} done, prev = ${d} is the next smaller value: diff = ${l.value} - ${d} = ${e}`),e<s){let n=s;s=e,o.update_variable("minDiff",s),o.update_variable("bestPairIdxs",[u,t]),o.add_conditional("is_smaller",!0),o.record("update_min",`minDiff = min(${n===1/0?"Infinity":n}, ${e}) = ${s}, new closest pair`)}else o.add_conditional("is_smaller",!1),o.record("no_update",`minDiff = min(${s}, ${e}) = ${s}, keep minDiff`)}else o.add_conditional("has_prev",!1),o.record("first_node",`Left subtree of ${l.value} done, prev = null: ${l.value} is the smallest value, nothing to compare yet`);d=l.value,u=t,o.update_variable("prev",d),o.update_variable("prevIdx",u),o.record("update_prev",`Update prev = ${d}`),o.record("recurse_right",`Recurse into the right subtree of ${l.value}`),e(2*t+2,"right",t),f.pop();let a=f.length?f[f.length-1]:-1;m(),v(),o.update_variable("returnedVal",l.value),o.record("return_frame",`inorder(${l.value}) is done, return to ${-1===a?"minDiffInBST":`inorder(${n.get(a).value})`}`),o.update_variable("returnedVal",null)}(0,null,-1),o.record("complete",`Traversal finished. Minimum distance between BST nodes: ${s}`),o.getSteps()
}

export function MinimumDistanceBetweenBstNodesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumDistanceBetweenBstNodesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumDistanceBetweenBstNodesSteps(e) as any[];
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
      title="Minimum Distance Between BST Nodes"
      slug="minimum-distance-between-bst-nodes"
      approaches={approaches}
      presets={MinimumDistanceBetweenBstNodesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Validate Binary Search Tree (validate-binary-search-tree)
// ==========================================

const ValidateBinarySearchTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def isValidBST(root):\n  def validate(node, min_val, max_val):\n    if not node:\n      return True\n\n    # Check if current node violates BST property\n    if node.val <= min_val or node.val >= max_val:\n      return False\n\n    # Recursively validate left and right subtrees\n    left_valid = validate(node.left, min_val, node.val)\n    if not left_valid:\n      return False\n\n    right_valid = validate(node.right, node.val, max_val)\n    if not right_valid:\n      return False\n\n    return True\n\n  return validate(root, float('-inf'), float('inf'))",
    "lineMap": {
      "init": [
        1
      ],
      "start_validation": [
        21
      ],
      "enter_node": [
        2
      ],
      "base_case_null": [
        3,
        4
      ],
      "check_bounds": [
        7
      ],
      "bounds_ok": [
        7
      ],
      "invalid_node": [
        8
      ],
      "before_left": [
        11
      ],
      "left_invalid": [
        13
      ],
      "before_right": [
        15
      ],
      "right_invalid": [
        17
      ],
      "subtrees_valid": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "violates_bounds": [
        7
      ],
      "left_invalid": [
        12
      ],
      "right_invalid": [
        16
      ],
      "return": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isValidBST(TreeNode root) {\n    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);\n}\n\nprivate boolean validate(TreeNode node, long minVal, long maxVal) {\n    if (node == null) {\n        return true;\n    }\n\n    // Check if current node violates BST property\n    if (node.val <= minVal || node.val >= maxVal) {\n        return false;\n    }\n\n    // Recursively validate left and right subtrees\n    boolean leftValid = validate(node.left, minVal, node.val);\n    if (!leftValid) {\n        return false;\n    }\n\n    boolean rightValid = validate(node.right, node.val, maxVal);\n    if (!rightValid) {\n        return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_validation": [
        2
      ],
      "enter_node": [
        5
      ],
      "base_case_null": [
        6,
        7
      ],
      "check_bounds": [
        11
      ],
      "bounds_ok": [
        11
      ],
      "invalid_node": [
        12
      ],
      "before_left": [
        16
      ],
      "left_invalid": [
        18
      ],
      "before_right": [
        21
      ],
      "right_invalid": [
        23
      ],
      "subtrees_valid": [
        26
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "violates_bounds": [
        11
      ],
      "left_invalid": [
        17
      ],
      "right_invalid": [
        22
      ],
      "return": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isValidBST(TreeNode* root) {\n    return validate(root, LONG_MIN, LONG_MAX);\n}\n\nbool validate(TreeNode* node, long minVal, long maxVal) {\n    if (node == nullptr) {\n        return true;\n    }\n\n    // Check if current node violates BST property\n    if (node->val <= minVal || node->val >= maxVal) {\n        return false;\n    }\n\n    // Recursively validate left and right subtrees\n    bool leftValid = validate(node->left, minVal, node->val);\n    if (!leftValid) {\n        return false;\n    }\n\n    bool rightValid = validate(node->right, node->val, maxVal);\n    if (!rightValid) {\n        return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_validation": [
        2
      ],
      "enter_node": [
        5
      ],
      "base_case_null": [
        6,
        7
      ],
      "check_bounds": [
        11
      ],
      "bounds_ok": [
        11
      ],
      "invalid_node": [
        12
      ],
      "before_left": [
        16
      ],
      "left_invalid": [
        18
      ],
      "before_right": [
        21
      ],
      "right_invalid": [
        23
      ],
      "subtrees_valid": [
        26
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "violates_bounds": [
        11
      ],
      "left_invalid": [
        17
      ],
      "right_invalid": [
        22
      ],
      "return": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsValidBST(TreeNode root) {\n    return Validate(root, long.MinValue, long.MaxValue);\n}\n\nprivate bool Validate(TreeNode node, long minVal, long maxVal) {\n    if (node == null) {\n        return true;\n    }\n\n    // Check if current node violates BST property\n    if (node.val <= minVal || node.val >= maxVal) {\n        return false;\n    }\n\n    // Recursively validate left and right subtrees\n    bool leftValid = Validate(node.left, minVal, node.val);\n    if (!leftValid) {\n        return false;\n    }\n\n    bool rightValid = Validate(node.right, node.val, maxVal);\n    if (!rightValid) {\n        return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_validation": [
        2
      ],
      "enter_node": [
        5
      ],
      "base_case_null": [
        6,
        7
      ],
      "check_bounds": [
        11
      ],
      "bounds_ok": [
        11
      ],
      "invalid_node": [
        12
      ],
      "before_left": [
        16
      ],
      "left_invalid": [
        18
      ],
      "before_right": [
        21
      ],
      "right_invalid": [
        23
      ],
      "subtrees_valid": [
        26
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "violates_bounds": [
        11
      ],
      "left_invalid": [
        17
      ],
      "right_invalid": [
        22
      ],
      "return": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "import \"math\"\n\nfunc isValidBST(root *TreeNode) bool {\n    return validate(root, math.MinInt64, math.MaxInt64)\n}\n\nfunc validate(node *TreeNode, minVal int, maxVal int) bool {\n    if node == nil {\n        return true\n    }\n\n    // Check if current node violates BST property\n    if node.Val <= minVal || node.Val >= maxVal {\n        return false\n    }\n\n    // Recursively validate left and right subtrees\n    leftValid := validate(node.Left, minVal, node.Val)\n    if !leftValid {\n        return false\n    }\n\n    rightValid := validate(node.Right, node.Val, maxVal)\n    if !rightValid {\n        return false\n    }\n\n    return true\n}",
    "lineMap": {
      "init": [
        3
      ],
      "start_validation": [
        4
      ],
      "enter_node": [
        7
      ],
      "base_case_null": [
        8,
        9
      ],
      "check_bounds": [
        13
      ],
      "bounds_ok": [
        13
      ],
      "invalid_node": [
        14
      ],
      "before_left": [
        18
      ],
      "left_invalid": [
        20
      ],
      "before_right": [
        23
      ],
      "right_invalid": [
        25
      ],
      "subtrees_valid": [
        28
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "is_null": [
        8
      ],
      "violates_bounds": [
        13
      ],
      "left_invalid": [
        19
      ],
      "right_invalid": [
        24
      ],
      "return": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isValidBST(root) {\n    return validate(root, -Infinity, Infinity);\n}\n\nfunction validate(node, minVal, maxVal) {\n    if (node === null) {\n        return true;\n    }\n\n    // Check if current node violates BST property\n    if (node.val <= minVal || node.val >= maxVal) {\n        return false;\n    }\n\n    // Recursively validate left and right subtrees\n    const leftValid = validate(node.left, minVal, node.val);\n    if (!leftValid) {\n        return false;\n    }\n\n    const rightValid = validate(node.right, node.val, maxVal);\n    if (!rightValid) {\n        return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_validation": [
        2
      ],
      "enter_node": [
        5
      ],
      "base_case_null": [
        6,
        7
      ],
      "check_bounds": [
        11
      ],
      "bounds_ok": [
        11
      ],
      "invalid_node": [
        12
      ],
      "before_left": [
        16
      ],
      "left_invalid": [
        18
      ],
      "before_right": [
        21
      ],
      "right_invalid": [
        23
      ],
      "subtrees_valid": [
        26
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "violates_bounds": [
        11
      ],
      "left_invalid": [
        17
      ],
      "right_invalid": [
        22
      ],
      "return": [
        26
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isValidBST(root: TreeNode | null): boolean {\n    return validate(root, -Infinity, Infinity);\n}\n\nfunction validate(node: TreeNode | null, minVal: number, maxVal: number): boolean {\n    if (node === null) {\n        return true;\n    }\n\n    // Check if current node violates BST property\n    if (node.val <= minVal || node.val >= maxVal) {\n        return false;\n    }\n\n    // Recursively validate left and right subtrees\n    const leftValid = validate(node.left, minVal, node.val);\n    if (!leftValid) {\n        return false;\n    }\n\n    const rightValid = validate(node.right, node.val, maxVal);\n    if (!rightValid) {\n        return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_validation": [
        2
      ],
      "enter_node": [
        5
      ],
      "base_case_null": [
        6,
        7
      ],
      "check_bounds": [
        11
      ],
      "bounds_ok": [
        11
      ],
      "invalid_node": [
        12
      ],
      "before_left": [
        16
      ],
      "left_invalid": [
        18
      ],
      "before_right": [
        21
      ],
      "right_invalid": [
        23
      ],
      "subtrees_valid": [
        26
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "violates_bounds": [
        11
      ],
      "left_invalid": [
        17
      ],
      "right_invalid": [
        22
      ],
      "return": [
        26
      ]
    }
  }
};

const ValidateBinarySearchTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid BST (Simple)",
    "value": {
      "tree": [
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Invalid BST (Example)",
    "value": {
      "tree": [
        5,
        1,
        4,
        null,
        null,
        3,
        6
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Invalid BST (Subtle)",
    "value": {
      "tree": [
        10,
        5,
        15,
        null,
        null,
        6,
        20
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Valid BST (Complex)",
    "value": {
      "tree": [
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
        13
      ]
    }
  }
];

function generateValidateBinarySearchTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),l=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(l.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);l.has(t)&&(l.get(e).parent=t,l.get(e).isLeftChild=e%2==1)}let i=(e,t)=>{let r=l.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,state:t}},n={};l.forEach((e,t)=>{n[`node_${t}`]=i(t)});let o=new RecursiveStepRecorder({},{...n});if(o.pushCallFrame({root:(0,_treeHelper848569.kU)(l.get(0))},"isValidBST"),o.record("init","Start: every node must lie in an open range (min, max); the root starts with (-Infinity, +Infinity)"),0===l.size)return o.update_global_variable("result",!0),o.add_conditional("return",!0),o.record("complete","Empty tree is a valid BST, return true"),o.popCallFrame(),o.getSteps();let s=(e,t)=>null===e?`${t}Infinity`:`${e}`,d=[],u=[],c=()=>{o.update_global_variable("pathIdxs",[...d]),o.update_global_variable("currentIdx",d.length>0?d[d.length-1]:-1);let e=u.length>0?u[u.length-1]:[null,null];o.update_global_variable("curMin",e[0]),o.update_global_variable("curMax",e[1])};o.record("start_validation","Call validate(root, -Infinity, +Infinity)");let h=function e(t,r,n){let h=l.has(t),f=h?l.get(t):null;if(o.pushCallFrame({node:(0,_treeHelper848569.kU)(f),min_val:null===r?"-∞":r,max_val:null===n?"+∞":n},"validate"),!h)return o.update_global_variable("currentIdx",-1),o.update_global_variable("nullIdx",t),o.add_conditional("is_null",!0),o.record("base_case_null","node is null: an empty subtree is valid, return true"),o.popCallFrame(),c(),!0;let g=f.value,v=s(r,"-"),p=s(n,"+");d.push(t),u.push([r,n]),c(),o.update_visual(`node_${t}`,i(t,"onpath")),o.add_conditional("is_null",!1),o.record("enter_node",`validate(${g}, min = ${v}, max = ${p})`),o.record("check_bounds",`Check ${v} < ${g} < ${p}`);let _=null!==r&&g<=r,x=null!==n&&g>=n;if(_||x)return o.update_global_variable("violation",_?"min":"max"),o.update_visual(`node_${t}`,i(t,"error")),o.add_conditional("violates_bounds",!0),o.record("invalid_node",_?`${g} <= min ${v}: violates the BST property, return false`:`${g} >= max ${p}: violates the BST property, return false`),d.pop(),u.pop(),o.popCallFrame(),c(),!1;o.add_conditional("violates_bounds",!1),o.record("bounds_ok",`${v} < ${g} < ${p}: within range`);let b=2*t+1;o.record("before_left",`Left subtree of ${g} must be in (${v}, ${g})`);let m=e(b,r,g);if(o.update_frame_variable("left_valid",m),!m)return o.add_conditional("left_invalid",!0),o.record("left_invalid",`Left subtree of ${g} is invalid, return false`),o.update_visual(`node_${t}`,i(t)),d.pop(),u.pop(),o.popCallFrame(),c(),!1;o.add_conditional("left_invalid",!1);let y=2*t+2;o.record("before_right",`Right subtree of ${g} must be in (${g}, ${p})`);let V=e(y,g,n);return(o.update_frame_variable("right_valid",V),V)?(o.add_conditional("right_invalid",!1),o.update_visual(`node_${t}`,i(t,"valid")),o.record("subtrees_valid",`${g} and both subtrees satisfy the BST property, return true`),d.pop(),u.pop(),o.popCallFrame(),c(),!0):(o.add_conditional("right_invalid",!0),o.record("right_invalid",`Right subtree of ${g} is invalid, return false`),o.update_visual(`node_${t}`,i(t)),d.pop(),u.pop(),o.popCallFrame(),c(),!1)}(0,null,null);return o.update_global_variable("result",h),o.update_global_variable("currentIdx",-1),o.add_conditional("return",h),o.record("complete",h?"Every node is within its range: valid BST, return true":"Tree is NOT a valid BST, return false"),o.popCallFrame(),o.getSteps()
}

export function ValidateBinarySearchTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidateBinarySearchTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidateBinarySearchTreeSteps(e) as any[];
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
      title="Validate Binary Search Tree"
      slug="validate-binary-search-tree"
      approaches={approaches}
      presets={ValidateBinarySearchTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Kth Smallest Element in a BST (kth-smallest-element-in-a-bst)
// ==========================================

const KthSmallestElementInABstTemplates = {
  "python": {
    "language": "python",
    "code": "def kthSmallest(root, k):\n    stack = []\n    current = root\n\n    while stack or current:\n        # Go to leftmost node\n        while current:\n            stack.append(current)\n            current = current.left\n\n        # Visit node\n        current = stack.pop()\n        k -= 1\n        if k == 0:\n            return current.val\n\n        # Move to right subtree\n        current = current.right\n\n    return -1",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init_variables": [
        2,
        3
      ],
      "push_current": [
        8
      ],
      "move_left": [
        9
      ],
      "no_left": [
        9
      ],
      "pop_node": [
        12
      ],
      "decrement_k": [
        13
      ],
      "found_answer": [
        14,
        15
      ],
      "not_found_yet": [
        14
      ],
      "move_right": [
        18
      ],
      "no_right": [
        18
      ],
      "complete": [
        15
      ],
      "complete_not_found": [
        20
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        5
      ],
      "while_current": [
        7
      ],
      "has_left": [
        9
      ],
      "is_k_zero": [
        14
      ],
      "has_right": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int kthSmallest(TreeNode root, int k) {\n    Stack<TreeNode> stack = new Stack<>();\n    TreeNode current = root;\n\n    while (current != null || !stack.isEmpty()) {\n        // Go to leftmost node\n        while (current != null) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        // Visit node\n        current = stack.pop();\n        k--;\n        if (k == 0) {\n            return current.val;\n        }\n\n        // Move to right subtree\n        current = current.right;\n    }\n\n    return -1;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        1,
        2
      ],
      "init_variables": [
        2,
        3
      ],
      "push_current": [
        8
      ],
      "move_left": [
        9
      ],
      "no_left": [
        9
      ],
      "pop_node": [
        13
      ],
      "decrement_k": [
        14
      ],
      "found_answer": [
        15,
        16
      ],
      "not_found_yet": [
        15
      ],
      "move_right": [
        20
      ],
      "no_right": [
        20
      ],
      "complete": [
        16
      ],
      "complete_not_found": [
        23
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        5
      ],
      "while_current": [
        7
      ],
      "has_left": [
        9
      ],
      "is_k_zero": [
        15
      ],
      "has_right": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int kthSmallest(TreeNode* root, int k) {\n    stack<TreeNode*> stk;\n    TreeNode* current = root;\n\n    while (current != nullptr || !stk.empty()) {\n        // Go to leftmost node\n        while (current != nullptr) {\n            stk.push(current);\n            current = current->left;\n        }\n\n        // Visit node\n        current = stk.top();\n        stk.pop();\n        k--;\n        if (k == 0) {\n            return current->val;\n        }\n\n        // Move to right subtree\n        current = current->right;\n    }\n\n    return -1;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        1,
        2
      ],
      "init_variables": [
        2,
        3
      ],
      "push_current": [
        8
      ],
      "move_left": [
        9
      ],
      "no_left": [
        9
      ],
      "pop_node": [
        13,
        14
      ],
      "decrement_k": [
        15
      ],
      "found_answer": [
        16,
        17
      ],
      "not_found_yet": [
        16
      ],
      "move_right": [
        21
      ],
      "no_right": [
        21
      ],
      "complete": [
        17
      ],
      "complete_not_found": [
        24
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        5
      ],
      "while_current": [
        7
      ],
      "has_left": [
        9
      ],
      "is_k_zero": [
        16
      ],
      "has_right": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function kthSmallest(root, k) {\n    const stack = [];\n    let current = root;\n\n    while (stack.length > 0 || current !== null) {\n        // Go to leftmost node\n        while (current !== null) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        // Visit node\n        current = stack.pop();\n        k--;\n        if (k === 0) {\n            return current.val;\n        }\n\n        // Move to right subtree\n        current = current.right;\n    }\n\n    return -1;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init_variables": [
        2,
        3
      ],
      "push_current": [
        8
      ],
      "move_left": [
        9
      ],
      "no_left": [
        9
      ],
      "pop_node": [
        13
      ],
      "decrement_k": [
        14
      ],
      "found_answer": [
        15,
        16
      ],
      "not_found_yet": [
        15
      ],
      "move_right": [
        20
      ],
      "no_right": [
        20
      ],
      "complete": [
        16
      ],
      "complete_not_found": [
        23
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        5
      ],
      "while_current": [
        7
      ],
      "has_left": [
        9
      ],
      "is_k_zero": [
        15
      ],
      "has_right": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function kthSmallest(root: TreeNode | null, k: number): number {\n    const stack: TreeNode[] = [];\n    let current: TreeNode | null = root;\n\n    while (stack.length > 0 || current !== null) {\n        // Go to leftmost node\n        while (current !== null) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        // Visit node\n        current = stack.pop()!;\n        k--;\n        if (k === 0) {\n            return current.val;\n        }\n\n        // Move to right subtree\n        current = current.right;\n    }\n\n    return -1;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init_variables": [
        2,
        3
      ],
      "push_current": [
        8
      ],
      "move_left": [
        9
      ],
      "no_left": [
        9
      ],
      "pop_node": [
        13
      ],
      "decrement_k": [
        14
      ],
      "found_answer": [
        15,
        16
      ],
      "not_found_yet": [
        15
      ],
      "move_right": [
        20
      ],
      "no_right": [
        20
      ],
      "complete": [
        16
      ],
      "complete_not_found": [
        23
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        5
      ],
      "while_current": [
        7
      ],
      "has_left": [
        9
      ],
      "is_k_zero": [
        15
      ],
      "has_right": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int KthSmallest(TreeNode root, int k) {\n    Stack<TreeNode> stack = new Stack<TreeNode>();\n    TreeNode current = root;\n\n    while (current != null || stack.Count > 0) {\n        // Go to leftmost node\n        while (current != null) {\n            stack.Push(current);\n            current = current.left;\n        }\n\n        // Visit node\n        current = stack.Pop();\n        k--;\n        if (k == 0) {\n            return current.val;\n        }\n\n        // Move to right subtree\n        current = current.right;\n    }\n\n    return -1;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        1,
        2
      ],
      "init_variables": [
        2,
        3
      ],
      "push_current": [
        8
      ],
      "move_left": [
        9
      ],
      "no_left": [
        9
      ],
      "pop_node": [
        13
      ],
      "decrement_k": [
        14
      ],
      "found_answer": [
        15,
        16
      ],
      "not_found_yet": [
        15
      ],
      "move_right": [
        20
      ],
      "no_right": [
        20
      ],
      "complete": [
        16
      ],
      "complete_not_found": [
        23
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        5
      ],
      "while_current": [
        7
      ],
      "has_left": [
        9
      ],
      "is_k_zero": [
        15
      ],
      "has_right": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func kthSmallest(root *TreeNode, k int) int {\n    stack := []*TreeNode{}\n    current := root\n\n    for current != nil || len(stack) > 0 {\n        // Go to leftmost node\n        for current != nil {\n            stack = append(stack, current)\n            current = current.Left\n        }\n\n        // Visit node\n        current = stack[len(stack)-1]\n        stack = stack[:len(stack)-1]\n        k--\n        if k == 0 {\n            return current.Val\n        }\n\n        // Move to right subtree\n        current = current.Right\n    }\n\n    return -1\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        1,
        2
      ],
      "init_variables": [
        2,
        3
      ],
      "push_current": [
        8
      ],
      "move_left": [
        9
      ],
      "no_left": [
        9
      ],
      "pop_node": [
        13,
        14
      ],
      "decrement_k": [
        15
      ],
      "found_answer": [
        16,
        17
      ],
      "not_found_yet": [
        16
      ],
      "move_right": [
        21
      ],
      "no_right": [
        21
      ],
      "complete": [
        17
      ],
      "complete_not_found": [
        24
      ]
    },
    "conditionalMap": {
      "while_stack_or_current": [
        5
      ],
      "while_current": [
        7
      ],
      "has_left": [
        9
      ],
      "is_k_zero": [
        16
      ],
      "has_right": [
        21
      ]
    }
  }
};

const KthSmallestElementInABstPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        3,
        1,
        4,
        null,
        2
      ],
      "k": 1
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        5,
        3,
        6,
        2,
        4,
        null,
        null,
        1
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "tree": [
        4,
        2,
        6,
        1,
        3,
        5,
        7
      ],
      "k": 4
    }
  }
];

function generateKthSmallestElementInABstSteps(e: any): any[] {
  let i=e=>`${e}${e%100>=11&&e%100<=13?"th":e%10==1?"st":e%10==2?"nd":e%10==3?"rd":"th"}`;
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=e.k||1,o=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(o.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);o.has(t)&&(o.get(e).parent=t,o.get(e).isLeftChild=e%2==1)}let a=(e,t,r)=>{let n=o.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t,label:r}},s={};o.forEach((e,t)=>{s[`node_${t}`]=a(t)});let d=new StepRecorder({root:(0,_treeHelper848569.kU)(o.get(0)),k:r,stack:[],current:void 0,result:null,visited:[]},{...s});if(d.record("start",`Start: the ${i(r)} node visited in inorder is the ${i(r)} smallest`),0===o.size)return d.update_variable("result",-1),d.record("empty_tree","Empty tree, return -1"),d.getSteps();let u=r,c=[],h=[],p=0,f=null;for(d.update_variable("current",(0,_treeHelper848569.kU)(o.get(0))),d.update_variable("currentIdx",0),d.update_variable("currentVal",o.get(0).value),d.record("init_variables",`Initialize: k = ${u}, current = root = ${o.get(0).value}`);c.length>0||null!==p;){for(d.add_conditional("while_stack_or_current",!0);null!==p;){let e=o.get(p);c.push(p),d.update_visual(`node_${p}`,a(p,"stacked")),d.add_new_visual(`stack_n${p}`,{type:"stackElement",value:e.value,position:c.length-1,state:"stacked"}),d.update_variable("stack",c.map(e=>o.get(e).value)),d.update_variable("pushedIdx",p),d.add_conditional("while_current",!0),d.record("push_current",`Push node ${e.value} to the stack`);let r=2*p+1;if(r<t.length&&null!==t[r]){let e=o.get(r);p=r,d.update_variable("current",(0,_treeHelper848569.kU)(e)),d.update_variable("currentIdx",r),d.update_variable("currentVal",e.value),d.add_conditional("has_left",!0),d.record("move_left",`Move current to left child: ${e.value}`)}else p=null,d.update_variable("current",null),d.update_variable("currentIdx",-1),d.add_conditional("has_left",!1),d.record("no_left","No left child, current becomes null")}d.add_conditional("while_current",!1);let e=c.pop(),n=o.get(e);if(d.delete_visual(`stack_n${e}`),d.update_variable("stack",c.map(e=>o.get(e).value)),d.update_variable("current",(0,_treeHelper848569.kU)(n)),d.update_variable("currentIdx",e),d.update_variable("currentVal",n.value),d.update_variable("poppedIdx",e),d.record("pop_node",`Current is null: pop node ${n.value} from the stack`),u--,h.push(n.value),d.update_variable("k",u),d.update_variable("visited",[...h]),d.update_visual(`node_${e}`,a(e,"visited",String(h.length))),d.record("decrement_k",`${n.value} is the ${i(h.length)} smallest, k becomes ${u}`),0===u){f=n.value,d.update_variable("result",f),d.update_visual(`node_${e}`,a(e,"result",String(h.length))),d.add_conditional("is_k_zero",!0),d.record("found_answer",`k = 0: found the ${i(r)} smallest element: ${f}`);break}d.add_conditional("is_k_zero",!1),d.record("not_found_yet",`k = ${u} > 0, keep traversing`);let s=2*e+2;if(s<t.length&&null!==t[s]){let e=o.get(s);p=s,d.update_variable("current",(0,_treeHelper848569.kU)(e)),d.update_variable("currentIdx",s),d.update_variable("currentVal",e.value),d.add_conditional("has_right",!0),d.record("move_right",`Move current to right child: ${e.value}`)}else p=null,d.update_variable("current",null),d.update_variable("currentIdx",-1),d.add_conditional("has_right",!1),d.record("no_right","No right child, current becomes null")}return d.update_variable("currentIdx",-1),null!==f?d.record("complete",`The ${i(r)} smallest element in the BST is ${f}`):(d.add_conditional("while_stack_or_current",!1),d.record("complete_not_found",`Fewer than ${r} nodes in the tree, return -1`)),d.getSteps()
}

export function KthSmallestElementInABstProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: KthSmallestElementInABstTemplates,
      generateSteps: (e: any) => {
        const recorded = generateKthSmallestElementInABstSteps(e) as any[];
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
      title="Kth Smallest Element in a BST"
      slug="kth-smallest-element-in-a-bst"
      approaches={approaches}
      presets={KthSmallestElementInABstPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Tree Postorder Traversal (binary-tree-postorder-traversal)
// ==========================================

const BinaryTreePostorderTraversalTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:\n        result = []\n        stack = []\n        current = root\n        previous = None\n\n        while current or stack:\n            # Push all left children\n            while current:\n                stack.append(current)\n                current = current.left\n\n            current = stack[-1]\n\n            # If right child is None or already processed, visit this node\n            if current.right is None or current.right is previous:\n                result.append(current.val)\n                previous = current\n                stack.pop()\n                current = None  # Don't go left again\n            else:\n                # Right subtree still needs processing\n                current = current.right\n\n        return result",
    "lineMap": {
      "start": [
        2
      ],
      "init_variables": [
        3,
        4,
        5,
        6
      ],
      "push_current": [
        11
      ],
      "move_left": [
        12
      ],
      "no_left": [
        12
      ],
      "peek_stack": [
        14
      ],
      "no_unvisited_right": [
        17
      ],
      "has_unvisited_right": [
        17
      ],
      "visit_node": [
        18
      ],
      "set_previous": [
        19
      ],
      "pop_node": [
        20
      ],
      "reset_current": [
        21
      ],
      "move_right": [
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_current_or_stack": [
        8
      ],
      "while_current": [
        10
      ],
      "if_right_done": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Integer> postorderTraversal(TreeNode root) {\n        List<Integer> result = new ArrayList<>();\n        Deque<TreeNode> stack = new ArrayDeque<>();\n        TreeNode current = root;\n        TreeNode previous = null;\n\n        while (current != null || !stack.isEmpty()) {\n            // Push all left children\n            while (current != null) {\n                stack.push(current);\n                current = current.left;\n            }\n\n            current = stack.peek();\n\n            // If right child is null or already processed, visit this node\n            if (current.right == null || current.right == previous) {\n                result.add(current.val);\n                previous = current;\n                stack.pop();\n                current = null; // Don't go left again\n            } else {\n                // Right subtree still needs processing\n                current = current.right;\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "init_variables": [
        3,
        4,
        5,
        6
      ],
      "push_current": [
        11
      ],
      "move_left": [
        12
      ],
      "no_left": [
        12
      ],
      "peek_stack": [
        15
      ],
      "no_unvisited_right": [
        18
      ],
      "has_unvisited_right": [
        18
      ],
      "visit_node": [
        19
      ],
      "set_previous": [
        20
      ],
      "pop_node": [
        21
      ],
      "reset_current": [
        22
      ],
      "move_right": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_current_or_stack": [
        8
      ],
      "while_current": [
        10
      ],
      "if_right_done": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> postorderTraversal(TreeNode* root) {\n        vector<int> result;\n        stack<TreeNode*> stk;\n        TreeNode* current = root;\n        TreeNode* previous = nullptr;\n\n        while (current != nullptr || !stk.empty()) {\n            // Push all left children\n            while (current != nullptr) {\n                stk.push(current);\n                current = current->left;\n            }\n\n            current = stk.top();\n\n            // If right child is null or already processed, visit this node\n            if (current->right == nullptr || current->right == previous) {\n                result.push_back(current->val);\n                previous = current;\n                stk.pop();\n                current = nullptr; // Don't go left again\n            } else {\n                // Right subtree still needs processing\n                current = current->right;\n            }\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "init_variables": [
        4,
        5,
        6,
        7
      ],
      "push_current": [
        12
      ],
      "move_left": [
        13
      ],
      "no_left": [
        13
      ],
      "peek_stack": [
        16
      ],
      "no_unvisited_right": [
        19
      ],
      "has_unvisited_right": [
        19
      ],
      "visit_node": [
        20
      ],
      "set_previous": [
        21
      ],
      "pop_node": [
        22
      ],
      "reset_current": [
        23
      ],
      "move_right": [
        26
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "while_current_or_stack": [
        9
      ],
      "while_current": [
        11
      ],
      "if_right_done": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<int> PostorderTraversal(TreeNode root) {\n        IList<int> result = new List<int>();\n        Stack<TreeNode> stack = new Stack<TreeNode>();\n        TreeNode current = root;\n        TreeNode previous = null;\n\n        while (current != null || stack.Count > 0) {\n            // Push all left children\n            while (current != null) {\n                stack.Push(current);\n                current = current.left;\n            }\n\n            current = stack.Peek();\n\n            // If right child is null or already processed, visit this node\n            if (current.right == null || current.right == previous) {\n                result.Add(current.val);\n                previous = current;\n                stack.Pop();\n                current = null; // Don't go left again\n            } else {\n                // Right subtree still needs processing\n                current = current.right;\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "init_variables": [
        3,
        4,
        5,
        6
      ],
      "push_current": [
        11
      ],
      "move_left": [
        12
      ],
      "no_left": [
        12
      ],
      "peek_stack": [
        15
      ],
      "no_unvisited_right": [
        18
      ],
      "has_unvisited_right": [
        18
      ],
      "visit_node": [
        19
      ],
      "set_previous": [
        20
      ],
      "pop_node": [
        21
      ],
      "reset_current": [
        22
      ],
      "move_right": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_current_or_stack": [
        8
      ],
      "while_current": [
        10
      ],
      "if_right_done": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func postorderTraversal(root *TreeNode) []int {\n    result := []int{}\n    stack := []*TreeNode{}\n    current := root\n    var previous *TreeNode\n\n    for current != nil || len(stack) > 0 {\n        // Push all left children\n        for current != nil {\n            stack = append(stack, current)\n            current = current.Left\n        }\n\n        current = stack[len(stack)-1]\n\n        // If right child is nil or already processed, visit this node\n        if current.Right == nil || current.Right == previous {\n            result = append(result, current.Val)\n            previous = current\n            stack = stack[:len(stack)-1]\n            current = nil // Don't go left again\n        } else {\n            // Right subtree still needs processing\n            current = current.Right\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_variables": [
        2,
        3,
        4,
        5
      ],
      "push_current": [
        10
      ],
      "move_left": [
        11
      ],
      "no_left": [
        11
      ],
      "peek_stack": [
        14
      ],
      "no_unvisited_right": [
        17
      ],
      "has_unvisited_right": [
        17
      ],
      "visit_node": [
        18
      ],
      "set_previous": [
        19
      ],
      "pop_node": [
        20
      ],
      "reset_current": [
        21
      ],
      "move_right": [
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "while_current_or_stack": [
        7
      ],
      "while_current": [
        9
      ],
      "if_right_done": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var postorderTraversal = function(root) {\n    var result = [];\n    var stack = [];\n    var current = root;\n    var previous = null;\n\n    while (current !== null || stack.length > 0) {\n        // Push all left children\n        while (current !== null) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        current = stack[stack.length - 1];\n\n        // If right child is null or already processed, visit this node\n        if (current.right === null || current.right === previous) {\n            result.push(current.val);\n            previous = current;\n            stack.pop();\n            current = null; // Don't go left again\n        } else {\n            // Right subtree still needs processing\n            current = current.right;\n        }\n    }\n\n    return result;\n};",
    "lineMap": {
      "start": [
        1
      ],
      "init_variables": [
        2,
        3,
        4,
        5
      ],
      "push_current": [
        10
      ],
      "move_left": [
        11
      ],
      "no_left": [
        11
      ],
      "peek_stack": [
        14
      ],
      "no_unvisited_right": [
        17
      ],
      "has_unvisited_right": [
        17
      ],
      "visit_node": [
        18
      ],
      "set_previous": [
        19
      ],
      "pop_node": [
        20
      ],
      "reset_current": [
        21
      ],
      "move_right": [
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "while_current_or_stack": [
        7
      ],
      "while_current": [
        9
      ],
      "if_right_done": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function postorderTraversal(root: TreeNode | null): number[] {\n    const result: number[] = [];\n    const stack: TreeNode[] = [];\n    let current: TreeNode | null = root;\n    let previous: TreeNode | null = null;\n\n    while (current !== null || stack.length > 0) {\n        // Push all left children\n        while (current !== null) {\n            stack.push(current);\n            current = current.left;\n        }\n\n        current = stack[stack.length - 1];\n\n        // If right child is null or already processed, visit this node\n        if (current.right === null || current.right === previous) {\n            result.push(current.val);\n            previous = current;\n            stack.pop();\n            current = null; // Don't go left again\n        } else {\n            // Right subtree still needs processing\n            current = current.right;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_variables": [
        2,
        3,
        4,
        5
      ],
      "push_current": [
        10
      ],
      "move_left": [
        11
      ],
      "no_left": [
        11
      ],
      "peek_stack": [
        14
      ],
      "no_unvisited_right": [
        17
      ],
      "has_unvisited_right": [
        17
      ],
      "visit_node": [
        18
      ],
      "set_previous": [
        19
      ],
      "pop_node": [
        20
      ],
      "reset_current": [
        21
      ],
      "move_right": [
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "while_current_or_stack": [
        7
      ],
      "while_current": [
        9
      ],
      "if_right_done": [
        17
      ]
    }
  }
};

const BinaryTreePostorderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Small (5 nodes)",
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
    "label": "Example 1",
    "value": {
      "tree": [
        1,
        null,
        2,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Complete Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  }
];

function generateBinaryTreePostorderTraversalSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let l=(e,t)=>{let i=r.get(e);return{type:"binaryTreeNode",value:i.value,parent:void 0!==i.parent?`node_${i.parent}`:void 0,isLeftChild:i.isLeftChild,state:t}},a={};r.forEach((e,t)=>{a[`node_${t}`]=l(t)});let o=new StepRecorder({result:[],callStack:[],currentIdx:void 0},{...a});if(o.record("start","Start: postorder = recurse left, recurse right, then visit the node"),0===r.size)return o.update_variable("result",[]),o.record("empty_tree","Empty tree, return []"),o.getSteps();let s=[],u=[],d=new Set,c=e=>{r.forEach((t,r)=>{let i;d.has(r)?i="done":r===e?i="current":u.includes(r)&&(i="onstack"),o.update_visual(`node_${r}`,l(r,i))})};return!function e(i){if(!(i<t.length&&null!==t[i]))return;let n=r.get(i);u.push(i),c(i),o.update_variable("callStack",u.map(e=>r.get(e).value)),o.update_variable("currentIdx",i),o.record("enter",`Enter ${n.value}: recurse into its left subtree first`),e(2*i+1),c(i),o.update_variable("currentIdx",i),o.record("go_right",`Left subtree of ${n.value} done, recurse into its right subtree`),e(2*i+2),s.push(n.value),d.add(i),c(i),o.update_variable("result",[...s]),o.update_variable("currentIdx",i),o.record("visit",`Both subtrees of ${n.value} done, visit it: result = [${s.join(", ")}]`),u.pop();let l=u.length?u[u.length-1]:-1;c(l),o.update_variable("callStack",u.map(e=>r.get(e).value)),o.update_variable("currentIdx",l),o.record("return",`${n.value} done, return to ${-1===l?"the caller":r.get(l).value}`)}(0),o.update_variable("currentIdx",-1),o.record("complete",`Postorder traversal complete: [${s.join(", ")}]`),o.getSteps()
}

export function BinaryTreePostorderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreePostorderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreePostorderTraversalSteps(e) as any[];
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
      title="Binary Tree Postorder Traversal"
      slug="binary-tree-postorder-traversal"
      approaches={approaches}
      presets={BinaryTreePostorderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Invert Binary Tree (invert-binary-tree)
// ==========================================

const InvertBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def invertTree(root):\n    if root is None:\n        return None\n\n    stack = [root]\n\n    while stack:\n        node = stack.pop()\n\n        # Swap left and right children\n        temp = node.left\n        node.left = node.right\n        node.right = temp\n\n        # Add children to stack\n        if node.left:\n            stack.append(node.left)\n        if node.right:\n            stack.append(node.right)\n\n    return root",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_stack": [
        5
      ],
      "pop_node": [
        8
      ],
      "swap_children": [
        11
      ],
      "swap_complete": [
        12,
        13
      ],
      "no_children": [
        11,
        12,
        13
      ],
      "push_left": [
        17
      ],
      "push_right": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "check_empty": [
        2
      ],
      "while_stack": [
        7
      ],
      "check_left": [
        16
      ],
      "check_right": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public TreeNode invertTree(TreeNode root) {\n    if (root == null) {\n        return null;\n    }\n\n    Stack<TreeNode> stack = new Stack<>();\n    stack.push(root);\n\n    while (!stack.isEmpty()) {\n        TreeNode node = stack.pop();\n\n        // Swap the left and right children\n        TreeNode temp = node.left;\n        node.left = node.right;\n        node.right = temp;\n\n        // Add children to stack for further processing\n        if (node.left != null) {\n            stack.push(node.left);\n        }\n        if (node.right != null) {\n            stack.push(node.right);\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_stack": [
        6,
        7
      ],
      "pop_node": [
        10
      ],
      "swap_children": [
        13
      ],
      "swap_complete": [
        14,
        15
      ],
      "no_children": [
        13,
        14,
        15
      ],
      "push_left": [
        19
      ],
      "push_right": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_empty": [
        2
      ],
      "while_stack": [
        9
      ],
      "check_left": [
        18
      ],
      "check_right": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "TreeNode* invertTree(TreeNode* root) {\n    if (root == nullptr) {\n        return nullptr;\n    }\n\n    stack<TreeNode*> stk;\n    stk.push(root);\n\n    while (!stk.empty()) {\n        TreeNode* node = stk.top();\n        stk.pop();\n\n        // Swap the left and right children\n        TreeNode* temp = node->left;\n        node->left = node->right;\n        node->right = temp;\n\n        // Add children to stack for further processing\n        if (node->left != nullptr) {\n            stk.push(node->left);\n        }\n        if (node->right != nullptr) {\n            stk.push(node->right);\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_stack": [
        6,
        7
      ],
      "pop_node": [
        10,
        11
      ],
      "swap_children": [
        14
      ],
      "swap_complete": [
        15,
        16
      ],
      "no_children": [
        14,
        15,
        16
      ],
      "push_left": [
        20
      ],
      "push_right": [
        23
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_empty": [
        2
      ],
      "while_stack": [
        9
      ],
      "check_left": [
        19
      ],
      "check_right": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public TreeNode InvertTree(TreeNode root) {\n    if (root == null) {\n        return null;\n    }\n\n    Stack<TreeNode> stack = new Stack<TreeNode>();\n    stack.Push(root);\n\n    while (stack.Count > 0) {\n        TreeNode node = stack.Pop();\n\n        // Swap the left and right children\n        TreeNode temp = node.left;\n        node.left = node.right;\n        node.right = temp;\n\n        // Add children to stack for further processing\n        if (node.left != null) {\n            stack.Push(node.left);\n        }\n        if (node.right != null) {\n            stack.Push(node.right);\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_stack": [
        6,
        7
      ],
      "pop_node": [
        10
      ],
      "swap_children": [
        13
      ],
      "swap_complete": [
        14,
        15
      ],
      "no_children": [
        13,
        14,
        15
      ],
      "push_left": [
        19
      ],
      "push_right": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_empty": [
        2
      ],
      "while_stack": [
        9
      ],
      "check_left": [
        18
      ],
      "check_right": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func invertTree(root *TreeNode) *TreeNode {\n    if root == nil {\n        return nil\n    }\n\n    stack := []*TreeNode{root}\n\n    for len(stack) > 0 {\n        node := stack[len(stack)-1]\n        stack = stack[:len(stack)-1]\n\n        // Swap the left and right children\n        temp := node.Left\n        node.Left = node.Right\n        node.Right = temp\n\n        // Add children to stack for further processing\n        if node.Left != nil {\n            stack = append(stack, node.Left)\n        }\n        if node.Right != nil {\n            stack = append(stack, node.Right)\n        }\n    }\n\n    return root\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_stack": [
        6
      ],
      "pop_node": [
        9,
        10
      ],
      "swap_children": [
        13
      ],
      "swap_complete": [
        14,
        15
      ],
      "no_children": [
        13,
        14,
        15
      ],
      "push_left": [
        19
      ],
      "push_right": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_empty": [
        2
      ],
      "while_stack": [
        8
      ],
      "check_left": [
        18
      ],
      "check_right": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function invertTree(root) {\n    if (root === null) {\n        return null;\n    }\n\n    const stack = [root];\n\n    while (stack.length > 0) {\n        const node = stack.pop();\n\n        // Swap left and right children\n        const temp = node.left;\n        node.left = node.right;\n        node.right = temp;\n\n        // Add children to stack\n        if (node.left !== null) {\n            stack.push(node.left);\n        }\n        if (node.right !== null) {\n            stack.push(node.right);\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_stack": [
        6
      ],
      "pop_node": [
        9
      ],
      "swap_children": [
        12
      ],
      "swap_complete": [
        13,
        14
      ],
      "no_children": [
        12,
        13,
        14
      ],
      "push_left": [
        18
      ],
      "push_right": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "check_empty": [
        2
      ],
      "while_stack": [
        8
      ],
      "check_left": [
        17
      ],
      "check_right": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function invertTree(root: TreeNode | null): TreeNode | null {\n    if (root === null) {\n        return null;\n    }\n\n    const stack: TreeNode[] = [root];\n\n    while (stack.length > 0) {\n        const node = stack.pop()!;\n\n        // Swap left and right children\n        const temp = node.left;\n        node.left = node.right;\n        node.right = temp;\n\n        // Add children to stack\n        if (node.left !== null) {\n            stack.push(node.left);\n        }\n        if (node.right !== null) {\n            stack.push(node.right);\n        }\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_stack": [
        6
      ],
      "pop_node": [
        9
      ],
      "swap_children": [
        12
      ],
      "swap_complete": [
        13,
        14
      ],
      "no_children": [
        12,
        13,
        14
      ],
      "push_left": [
        18
      ],
      "push_right": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "check_empty": [
        2
      ],
      "while_stack": [
        8
      ],
      "check_left": [
        17
      ],
      "check_right": [
        20
      ]
    }
  }
};

const InvertBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        4,
        2,
        7,
        1,
        3,
        6,
        9
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple Tree",
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
    "label": "Left Child Only",
    "value": {
      "tree": [
        1,
        2
      ]
    }
  }
];

function generateInvertBinaryTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let i=new Map;r.forEach((e,t)=>i.set(t,t%2==1));let a=()=>{let e={},t=(n,l)=>{e[n]=l;let a=2*n+1,o=2*n+2;r.has(a)&&t(a,2*l+(i.get(a)?1:2)),r.has(o)&&t(o,2*l+(i.get(o)?1:2))};return r.has(0)&&t(0,0),e},o=(e,t)=>{let n=r.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:void 0!==n.parent?i.get(e):void 0,state:t}},d={};r.forEach((e,t)=>{d[`node_${t}`]=o(t)});let s=new StepRecorder({root:r.size>0?r.get(0).value:null,callStack:[],node:void 0,temp:void 0,slots:a()},{...d});if(s.record("start","Start: invert both subtrees of every node, then swap them (post-order)"),0===r.size)return s.add_conditional("check_empty",!0),s.record("empty_tree","Empty tree, return null"),s.getSteps();let u=e=>e<t.length&&null!==t[e],c=[],h=new Set,p=(e,t)=>{r.forEach((r,n)=>{let l;t&&t.has(n)?l="swapping":h.has(n)?l="done":n===e?l="current":c.includes(n)&&(l="onstack"),s.update_visual(`node_${n}`,o(n,l))})};return s.add_conditional("check_empty",!1),!function e(t){if(!u(t))return;let n=r.get(t);c.push(t),p(t),s.update_variable("callStack",c.map(e=>r.get(e).value)),s.update_variable("currentIdx",t),s.update_variable("node",n.value),s.record("enter",`invert(${n.value})`);let l=2*t+1,o=2*t+2,d=u(l),f=u(o);if(d&&e(l),f&&e(o),p(t),s.update_variable("callStack",c.map(e=>r.get(e).value)),s.update_variable("currentIdx",t),s.update_variable("node",n.value),d||f){let e=d?r.get(l).value:null,u=f?r.get(o).value:null,c=new Set;d&&c.add(l),f&&c.add(o),s.update_variable("temp",e),s.update_variable("leftVal",e),s.update_variable("rightVal",u),s.update_variable("swapA",d?l:-1),s.update_variable("swapB",f?o:-1),p(t,c),s.record("swap_children",`Both subtrees of ${n.value} are inverted, swap them: ${e??"null"} ↔ ${u??"null"}`),d&&i.set(l,!1),f&&i.set(o,!0),p(t,c),s.update_variable("slots",a()),s.record("swap_complete",`Swapped: left = ${u??"null"}, right = ${e??"null"}`)}else p(t),s.record("no_children",`Leaf ${n.value}: no children to swap`);c.pop(),h.add(t);let g=c.length?c[c.length-1]:-1;p(g),s.update_variable("callStack",c.map(e=>r.get(e).value)),s.update_variable("currentIdx",g),s.record("return",`${n.value}'s subtree is inverted, return to ${-1===g?"the caller":r.get(g).value}`)}(0),s.update_variable("node",null),s.update_variable("temp",null),s.update_variable("currentIdx",-1),s.record("complete","Every node is inverted: the tree is a mirror of the original, return root"),s.getSteps()
}

export function InvertBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InvertBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateInvertBinaryTreeSteps(e) as any[];
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
      title="Invert Binary Tree"
      slug="invert-binary-tree"
      approaches={approaches}
      presets={InvertBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Diameter of Binary Tree (diameter-of-binary-tree)
// ==========================================

const DiameterOfBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def diameterOfBinaryTree(self, root):\n        self.max_diameter = 0\n\n        def calculate_height(node):\n            if node is None:\n                return 0\n\n            left_height = calculate_height(node.left)\n            right_height = calculate_height(node.right)\n\n            diameter_through_node = left_height + right_height\n            self.max_diameter = max(self.max_diameter, diameter_through_node)\n\n            return 1 + max(left_height, right_height)\n\n        calculate_height(root)\n        return self.max_diameter",
    "lineMap": {
      "start": [
        1,
        2,
        3
      ],
      "empty_tree": [
        2
      ],
      "init": [
        3,
        5
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        10
      ],
      "calc_diameter": [
        12
      ],
      "update_max": [
        13
      ],
      "no_update": [
        13
      ],
      "return_height": [
        15
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_empty": [
        2
      ],
      "check_null": [
        6,
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int maxDiameter = 0;\n\n    public int diameterOfBinaryTree(TreeNode root) {\n        calculateHeightAndDiameter(root);\n        return maxDiameter;\n    }\n\n    private int calculateHeightAndDiameter(TreeNode node) {\n        if (node == null) return 0;\n\n        int leftHeight = calculateHeightAndDiameter(node.left);\n        int rightHeight = calculateHeightAndDiameter(node.right);\n\n        int diameterThroughNode = leftHeight + rightHeight;\n\n        maxDiameter = Math.max(maxDiameter, diameterThroughNode);\n\n        return 1 + Math.max(leftHeight, rightHeight);\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        4,
        5
      ],
      "init": [
        4,
        5
      ],
      "visit_node": [
        9
      ],
      "recurse_left": [
        12
      ],
      "recurse_right": [
        13
      ],
      "calc_diameter": [
        15
      ],
      "update_max": [
        17
      ],
      "no_update": [
        17
      ],
      "return_height": [
        19
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "check_empty": [
        5
      ],
      "check_null": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\nprivate:\n    int maxDiameter = 0;\n\n    int calculateHeightAndDiameter(TreeNode* node) {\n        if (node == nullptr) return 0;\n\n        int leftHeight = calculateHeightAndDiameter(node->left);\n        int rightHeight = calculateHeightAndDiameter(node->right);\n\n        int diameterThroughNode = leftHeight + rightHeight;\n\n        maxDiameter = max(maxDiameter, diameterThroughNode);\n\n        return 1 + max(leftHeight, rightHeight);\n    }\n\npublic:\n    int diameterOfBinaryTree(TreeNode* root) {\n        calculateHeightAndDiameter(root);\n        return maxDiameter;\n    }\n};",
    "lineMap": {
      "start": [
        1,
        2,
        3
      ],
      "empty_tree": [
        19,
        20
      ],
      "init": [
        19,
        20
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        9
      ],
      "calc_diameter": [
        11
      ],
      "update_max": [
        13
      ],
      "no_update": [
        13
      ],
      "return_height": [
        15
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "check_empty": [
        20
      ],
      "check_null": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "class Solution {\n    private int maxDiameter = 0;\n\n    public int DiameterOfBinaryTree(TreeNode root) {\n        CalculateHeightAndDiameter(root);\n        return maxDiameter;\n    }\n\n    private int CalculateHeightAndDiameter(TreeNode node) {\n        if (node == null) return 0;\n\n        int leftHeight = CalculateHeightAndDiameter(node.left);\n        int rightHeight = CalculateHeightAndDiameter(node.right);\n\n        int diameterThroughNode = leftHeight + rightHeight;\n\n        maxDiameter = Math.Max(maxDiameter, diameterThroughNode);\n\n        return 1 + Math.Max(leftHeight, rightHeight);\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        4,
        5
      ],
      "init": [
        4,
        5
      ],
      "visit_node": [
        9
      ],
      "recurse_left": [
        12
      ],
      "recurse_right": [
        13
      ],
      "calc_diameter": [
        15
      ],
      "update_max": [
        17
      ],
      "no_update": [
        17
      ],
      "return_height": [
        19
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "check_empty": [
        5
      ],
      "check_null": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func diameterOfBinaryTree(root *TreeNode) int {\n    maxDiameter := 0\n\n    var calculateHeight func(node *TreeNode) int\n    calculateHeight = func(node *TreeNode) int {\n        if node == nil {\n            return 0\n        }\n\n        leftHeight := calculateHeight(node.Left)\n        rightHeight := calculateHeight(node.Right)\n\n        diameterThroughNode := leftHeight + rightHeight\n        maxDiameter = max(maxDiameter, diameterThroughNode)\n\n        return 1 + max(leftHeight, rightHeight)\n    }\n\n    calculateHeight(root)\n    return maxDiameter\n}\n\nfunc max(a, b int) int {\n    if a > b {\n        return a\n    }\n    return b\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        2,
        4,
        5
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "calc_diameter": [
        13
      ],
      "update_max": [
        14
      ],
      "no_update": [
        14
      ],
      "return_height": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_empty": [
        1
      ],
      "check_null": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function diameterOfBinaryTree(root) {\n    let maxDiameter = 0;\n\n    function calculateHeight(node) {\n        if (node === null) return 0;\n\n        const leftHeight = calculateHeight(node.left);\n        const rightHeight = calculateHeight(node.right);\n\n        const diameterThroughNode = leftHeight + rightHeight;\n        maxDiameter = Math.max(maxDiameter, diameterThroughNode);\n\n        return 1 + Math.max(leftHeight, rightHeight);\n    }\n\n    calculateHeight(root);\n    return maxDiameter;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        2,
        4
      ],
      "visit_node": [
        4
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        8
      ],
      "calc_diameter": [
        10
      ],
      "update_max": [
        11
      ],
      "no_update": [
        11
      ],
      "return_height": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_empty": [
        1
      ],
      "check_null": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function diameterOfBinaryTree(root: TreeNode | null): number {\n    let maxDiameter = 0;\n\n    function calculateHeight(node: TreeNode | null): number {\n        if (node === null) return 0;\n\n        const leftHeight = calculateHeight(node.left);\n        const rightHeight = calculateHeight(node.right);\n\n        const diameterThroughNode = leftHeight + rightHeight;\n        maxDiameter = Math.max(maxDiameter, diameterThroughNode);\n\n        return 1 + Math.max(leftHeight, rightHeight);\n    }\n\n    calculateHeight(root);\n    return maxDiameter;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        2,
        4
      ],
      "visit_node": [
        4
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        8
      ],
      "calc_diameter": [
        10
      ],
      "update_max": [
        11
      ],
      "no_update": [
        11
      ],
      "return_height": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_empty": [
        1
      ],
      "check_null": [
        5
      ]
    }
  }
};

const DiameterOfBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Longer Path",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        null,
        null,
        6,
        7
      ]
    }
  }
];

function generateDiameterOfBinaryTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let n=(e,t,i)=>{let a=r.get(e),n={type:"binaryTreeNode",value:a.value,parent:void 0!==a.parent?`node_${a.parent}`:void 0,isLeftChild:a.isLeftChild};return t&&(n.state=t),i&&(n.label=i),n},l={};r.forEach((e,t)=>{l[`node_${t}`]=n(t)});let o=new StepRecorder({maxDiameter:0,currentNode:void 0,leftHeight:void 0,rightHeight:void 0,diameterThroughNode:void 0,height:void 0},{...l});if(o.record("start","Start: the diameter is the longest path between any two nodes"),0===r.size)return o.add_conditional("check_empty",!0),o.record("empty_tree","Empty tree, return 0"),o.getSteps();o.add_conditional("check_empty",!1),o.record("init","Initialize maxDiameter = 0, compute heights bottom-up");let d=0,h=new Map,u=[],s=new Map,c=(e,t,r)=>{h.set(e,{state:t,label:r}),o.update_visual(`node_${e}`,n(e,t,r))};return!function e(i){if(null===i||!r.has(i))return o.add_conditional("check_null",!0),0;o.add_conditional("check_null",!1);let a=r.get(i);if(u.length>0){let e=u[u.length-1];c(e,"path",h.get(e)?.label)}u.push(i),c(i,"current"),o.update_variable("currentNode",a.value),o.update_variable("currentIdx",i),o.record("visit_node",`Call calculateHeight(${a.value})`);let n=2*i+1,l=2*i+2,g=n<t.length&&null!==t[n],m=l<t.length&&null!==t[l];o.update_variable("hasLeft",g),o.record("recurse_left",g?`Recurse into the left subtree of ${a.value}`:`Left child of ${a.value} is null: height 0`);let f=e(g?n:null);o.update_variable("leftHeight",f),o.update_variable("hasRight",m),o.record("recurse_right",m?`Recurse into the right subtree of ${a.value}`:`Right child of ${a.value} is null: height 0`);let p=e(m?l:null);o.update_variable("rightHeight",p);let x=f+p,_=g?s.get(n):[],v=m?s.get(l):[],y=[...[..._].reverse(),i,...v];o.update_variable("diameterThroughNode",x),o.update_variable("pathIdxs",y),c(i,"checking"),o.record("calc_diameter",`Path through ${a.value}: ${f} + ${p} = ${x} edges`);let b=d;d=Math.max(d,x),o.update_variable("maxDiameter",d),d>b?(o.update_variable("bestPathIdxs",y),o.record("update_max",`New max: diameter = ${d}, the longest path so far runs through ${a.value}`)):o.record("no_update",`${x} does not beat ${d}, keep maxDiameter = ${d}`);let $=1+Math.max(f,p),j=f>=p?_:v;if(s.set(i,[i,...j]),o.update_variable("height",$),c(i,"done",`h=${$}`),o.record("return_height",`Return height of ${a.value}: 1 + max(${f}, ${p}) = ${$}`),u.pop(),u.length>0){let e=u[u.length-1];c(e,"current",h.get(e)?.label),o.update_variable("currentIdx",e),o.update_variable("currentNode",r.get(e).value)}else o.update_variable("currentIdx",-1);return $}(0),o.update_variable("currentNode",null),o.update_variable("currentIdx",-1),o.record("complete",`Every node measured: the diameter is ${d}, return ${d}`),o.getSteps()
}

export function DiameterOfBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DiameterOfBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDiameterOfBinaryTreeSteps(e) as any[];
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
      title="Diameter of Binary Tree"
      slug="diameter-of-binary-tree"
      approaches={approaches}
      presets={DiameterOfBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Lowest Common Ancestor of a Binary Tree (lowest-common-ancestor-of-a-binary-tree)
// ==========================================

const LowestCommonAncestorOfABinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def lowestCommonAncestor(self, root, p, q):\n        # Base case: null or found p/q\n        if root is None or root == p or root == q:\n            return root\n\n        # Search in left subtree\n        left = self.lowestCommonAncestor(root.left, p, q)\n\n        # Search in right subtree\n        right = self.lowestCommonAncestor(root.right, p, q)\n\n        # If both return non-null, current node is LCA\n        if left is not None and right is not None:\n            return root\n\n        # Return whichever is non-null\n        return left if left is not None else right",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "init": [
        2
      ],
      "invalid": [
        5
      ],
      "visit": [
        4
      ],
      "found_target": [
        5
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        11
      ],
      "found_lca": [
        14,
        15
      ],
      "return": [
        18
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        4
      ],
      "is_target": [
        4
      ],
      "both_found": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Base case: null or found p/q\n        if (root == null || root == p || root == q) {\n            return root;\n        }\n\n        // Search in left subtree\n        TreeNode left = lowestCommonAncestor(root.left, p, q);\n\n        // Search in right subtree\n        TreeNode right = lowestCommonAncestor(root.right, p, q);\n\n        // If both return non-null, current node is LCA\n        if (left != null && right != null) {\n            return root;\n        }\n\n        // Return whichever is non-null\n        return left != null ? left : right;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "invalid": [
        5
      ],
      "visit": [
        4
      ],
      "found_target": [
        5
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        12
      ],
      "found_lca": [
        15,
        16
      ],
      "return": [
        20
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        4
      ],
      "is_target": [
        4
      ],
      "both_found": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        // Base case: null or found p/q\n        if (root == nullptr || root == p || root == q) {\n            return root;\n        }\n\n        // Search in left subtree\n        TreeNode* left = lowestCommonAncestor(root->left, p, q);\n\n        // Search in right subtree\n        TreeNode* right = lowestCommonAncestor(root->right, p, q);\n\n        // If both return non-null, current node is LCA\n        if (left != nullptr && right != nullptr) {\n            return root;\n        }\n\n        // Return whichever is non-null\n        return left != nullptr ? left : right;\n    }\n};",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "init": [
        3
      ],
      "invalid": [
        6
      ],
      "visit": [
        5
      ],
      "found_target": [
        6
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        13
      ],
      "found_lca": [
        16,
        17
      ],
      "return": [
        21
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "is_target": [
        5
      ],
      "both_found": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Base case: null or found p/q\n        if (root == null || root == p || root == q) {\n            return root;\n        }\n\n        // Search in left subtree\n        TreeNode left = LowestCommonAncestor(root.left, p, q);\n\n        // Search in right subtree\n        TreeNode right = LowestCommonAncestor(root.right, p, q);\n\n        // If both return non-null, current node is LCA\n        if (left != null && right != null) {\n            return root;\n        }\n\n        // Return whichever is non-null\n        return left != null ? left : right;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "invalid": [
        5
      ],
      "visit": [
        4
      ],
      "found_target": [
        5
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        12
      ],
      "found_lca": [
        15,
        16
      ],
      "return": [
        20
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        4
      ],
      "is_target": [
        4
      ],
      "both_found": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {\n    // Base case: null or found p/q\n    if root == nil || root == p || root == q {\n        return root\n    }\n\n    // Search in left subtree\n    left := lowestCommonAncestor(root.Left, p, q)\n\n    // Search in right subtree\n    right := lowestCommonAncestor(root.Right, p, q)\n\n    // If both return non-null, current node is LCA\n    if left != nil && right != nil {\n        return root\n    }\n\n    // Return whichever is non-null\n    if left != nil {\n        return left\n    }\n    return right\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        1
      ],
      "invalid": [
        4
      ],
      "visit": [
        3
      ],
      "found_target": [
        4
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        11
      ],
      "found_lca": [
        14,
        15
      ],
      "return": [
        19
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "is_target": [
        3
      ],
      "both_found": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function lowestCommonAncestor(root, p, q) {\n    // Base case: null or found p/q\n    if (root === null || root === p || root === q) {\n        return root;\n    }\n\n    // Search in left subtree\n    const left = lowestCommonAncestor(root.left, p, q);\n\n    // Search in right subtree\n    const right = lowestCommonAncestor(root.right, p, q);\n\n    // If both return non-null, current node is LCA\n    if (left !== null && right !== null) {\n        return root;\n    }\n\n    // Return whichever is non-null\n    return left !== null ? left : right;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        1
      ],
      "invalid": [
        4
      ],
      "visit": [
        3
      ],
      "found_target": [
        4
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        11
      ],
      "found_lca": [
        14,
        15
      ],
      "return": [
        19
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "is_target": [
        3
      ],
      "both_found": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {\n    // Base case: null or found p/q\n    if (root === null || root === p || root === q) {\n        return root;\n    }\n\n    // Search in left subtree\n    const left = lowestCommonAncestor(root.left, p, q);\n\n    // Search in right subtree\n    const right = lowestCommonAncestor(root.right, p, q);\n\n    // If both return non-null, current node is LCA\n    if (left !== null && right !== null) {\n        return root;\n    }\n\n    // Return whichever is non-null\n    return left !== null ? left : right;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        1
      ],
      "invalid": [
        4
      ],
      "visit": [
        3
      ],
      "found_target": [
        4
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        11
      ],
      "found_lca": [
        14,
        15
      ],
      "return": [
        19
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "is_target": [
        3
      ],
      "both_found": [
        14
      ]
    }
  }
};

const LowestCommonAncestorOfABinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        3,
        5,
        1,
        6,
        2,
        0,
        8,
        null,
        null,
        7,
        4
      ],
      "p": 5,
      "q": 1
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        3,
        5,
        1,
        6,
        2,
        0,
        8,
        null,
        null,
        7,
        4
      ],
      "p": 5,
      "q": 4
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "tree": [
        1,
        2
      ],
      "p": 1,
      "q": 2
    }
  }
];

function generateLowestCommonAncestorOfABinaryTreeSteps(e: any): any[] {
  
let t,r,o=(0,_treeHelper848569.Gu)(e.tree||[]),a=e.p,i=e.q,s=new Map;for(let e=0;e<o.length;e++)if(null!==o[e]&&(s.set(e,{value:o[e],index:e}),e>0)){let t=Math.floor((e-1)/2);s.has(t)&&(s.get(e).parent=t,s.get(e).isLeftChild=e%2==1)}s.forEach((e,n)=>{e.value===a&&(t=n),e.value===i&&(r=n)});let d=(e,t,r)=>{let n=s.get(e),l={type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild};return t&&(l.state=t),r&&(l.label=r),l},u={};s.forEach((e,t)=>{u[`node_${t}`]=d(t)});let c=new StepRecorder({p:a,q:i,currentNode:void 0,leftResult:void 0,rightResult:void 0,lca:void 0,currentIdx:-1,pathIdxs:[],pIdxG:t??-1,qIdxG:r??-1,lcaVal:null},{...u});if(c.record("start","Start: find the lowest node that has both p and q in its subtree"),0===s.size||void 0===t||void 0===r)return c.record("invalid","Invalid input: return null"),c.getSteps();c.record("init",`Targets: p = ${a}, q = ${i}. Search from the root`);let h=new Map,p=[],f=null,g=(e,t,r)=>{h.set(e,{state:t,label:r}),c.update_visual(`node_${e}`,d(e,t,r))},x=e=>null!==e&&s.has(e)?String(s.get(e).value):"∅",m=function e(n){if(null===n||!s.has(n))return c.add_conditional("is_null",!0),null;c.add_conditional("is_null",!1);let l=s.get(n).value;if(p.length>0){let e=p[p.length-1];g(e,"path",h.get(e)?.label)}p.push(n),g(n,"current"),c.update_variable("currentIdx",n),c.update_variable("nodeVal",l),c.update_variable("pathIdxs",[...p]),c.update_variable("currentNode",l),c.record("visit",`Call findLCA(${l})`);let a=()=>{if(p.pop(),c.update_variable("pathIdxs",[...p]),p.length>0){let e=p[p.length-1];g(e,"current",h.get(e)?.label),c.update_variable("currentIdx",e),c.update_variable("nodeVal",s.get(e).value)}else c.update_variable("currentIdx",-1)};if(n===t||n===r){c.add_conditional("is_target",!0);let e=n===t?"p":"q";return c.update_variable("targetName",e),c.update_variable("retVal",String(l)),g(n,"found",String(l)),a(),c.record("found_target",`This is ${e} (${l}): return it immediately, no need to look below`),n}c.add_conditional("is_target",!1);let i=2*n+1,d=2*n+2,u=i<o.length&&null!==o[i],m=d<o.length&&null!==o[d];c.update_variable("hasLeft",u),c.record("recurse_left",u?`Search the left subtree of ${l}`:`Left of ${l} is null: L = null`);let b=e(u?i:null);c.update_variable("leftResult",x(b)),c.update_variable("lVal",x(b)),c.update_variable("nodeVal",l),c.update_variable("hasRight",m),c.record("recurse_right",m?`Search the right subtree of ${l}`:`Right of ${l} is null: R = null`);let v=e(m?d:null);if(c.update_variable("rightResult",x(v)),c.update_variable("rVal",x(v)),c.update_variable("nodeVal",l),null!==b&&null!==v)return c.add_conditional("both_found",!0),f=n,c.update_variable("lca",l),c.update_variable("lcaVal",l),c.update_variable("retVal",String(l)),g(n,"lca","LCA"),a(),c.record("found_lca",`L = ${x(b)} and R = ${x(v)}: both sides found a target, ${l} is the LCA`),n;c.add_conditional("both_found",!1);let _=null!==b?b:v;return c.update_variable("retVal",x(_)),g(n,"visited",x(_)),a(),c.record("return",null!==_?`Only one side found a target: pass ${x(_)} up`:`Nothing found under ${l}: return null`),_}(0);if(c.update_variable("currentNode",null),c.update_variable("pathIdxs",[]),c.update_variable("currentIdx",-1),null===f&&null!==m){f=m;let e=s.get(m).value;c.update_variable("lca",e),c.update_variable("lcaVal",e),g(m,"lca","LCA"),c.record("complete",`${e} reached the top: the other target is inside its subtree, so the LCA is ${e}`)}else c.record("complete",`The lowest common ancestor of ${a} and ${i} is ${null!==f?s.get(f).value:"null"}`);return c.getSteps()
}

export function LowestCommonAncestorOfABinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LowestCommonAncestorOfABinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLowestCommonAncestorOfABinaryTreeSteps(e) as any[];
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
      title="Lowest Common Ancestor of a Binary Tree"
      slug="lowest-common-ancestor-of-a-binary-tree"
      approaches={approaches}
      presets={LowestCommonAncestorOfABinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find Duplicate Subtrees (find-duplicate-subtrees)
// ==========================================

const FindDuplicateSubtreesTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def findDuplicateSubtrees(self, root):\n        self.id = 1\n        self.trees = {}\n        self.count = {}\n        self.result = []\n        self.lookup(root)\n        return self.result\n\n    def lookup(self, root):\n        if not root:\n            return 0\n\n        # Serialize subtree\n        serial = f\"{root.val},{self.lookup(root.left)},{self.lookup(root.right)}\"\n\n        # Assign ID to serialized subtree\n        if serial not in self.trees:\n            self.trees[serial] = self.id\n            self.id += 1\n        tree_id = self.trees[serial]\n\n        # Count the occurrence of the tree ID\n        self.count[tree_id] = self.count.get(tree_id, 0) + 1\n\n        # If it's the second occurrence, record it\n        if self.count[tree_id] == 2:\n            self.result.append(root)\n\n        return tree_id",
    "lineMap": {
      "start": [
        1,
        2,
        3,
        4,
        5
      ],
      "start_dfs": [
        6
      ],
      "return_zero": [
        12
      ],
      "visit_node": [
        11
      ],
      "process_left": [
        15
      ],
      "process_right": [
        15
      ],
      "found_existing": [
        18,
        19,
        20
      ],
      "assign_new_id": [
        18,
        19,
        20
      ],
      "update_count": [
        24
      ],
      "add_duplicate": [
        27,
        28
      ],
      "return_id": [
        30
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    int id = 1;\n    Map<String, Integer> trees = new HashMap<>();\n    Map<Integer, Integer> count = new HashMap<>();\n    List<TreeNode> result = new ArrayList<>();\n\n    public List<TreeNode> findDuplicateSubtrees(TreeNode root) {\n        lookup(root);\n        return result;\n    }\n\n    private int lookup(TreeNode root) {\n        if (root == null) return 0;\n\n        // Serialize subtree\n        String serial = root.val + \",\" + lookup(root.left) + \",\" + lookup(root.right);\n\n        // Assign ID to serialized subtree\n        int treeId = trees.computeIfAbsent(serial, x -> id++);\n\n        // Count the occurrence of the tree ID\n        count.put(treeId, count.getOrDefault(treeId, 0) + 1);\n\n        // If it's the second occurrence of the same subtree, record it\n        if (count.get(treeId) == 2)\n            result.add(root);\n\n        return treeId;\n    }\n}",
    "lineMap": {
      "start": [
        2,
        3,
        4,
        5
      ],
      "start_dfs": [
        8
      ],
      "return_zero": [
        13
      ],
      "visit_node": [
        13
      ],
      "process_left": [
        16
      ],
      "process_right": [
        16
      ],
      "found_existing": [
        19
      ],
      "assign_new_id": [
        19
      ],
      "update_count": [
        22
      ],
      "add_duplicate": [
        25,
        26
      ],
      "return_id": [
        28
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "is_null": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int id = 1;\n    unordered_map<string, int> trees;\n    unordered_map<int, int> count;\n    vector<TreeNode*> result;\n\n    vector<TreeNode*> findDuplicateSubtrees(TreeNode* root) {\n        lookup(root);\n        return result;\n    }\n\nprivate:\n    int lookup(TreeNode* root) {\n        if (!root) return 0;\n\n        // Serialize subtree\n        string serial = to_string(root->val) + \",\" + to_string(lookup(root->left)) + \",\" + to_string(lookup(root->right));\n\n        // Assign ID to serialized subtree\n        int treeId;\n        if (trees.find(serial) == trees.end()) {\n            trees[serial] = id++;\n        }\n        treeId = trees[serial];\n\n        // Count the occurrence of the tree ID\n        count[treeId]++;\n\n        // If it's the second occurrence, record it\n        if (count[treeId] == 2) {\n            result.push_back(root);\n        }\n\n        return treeId;\n    }\n};",
    "lineMap": {
      "start": [
        3,
        4,
        5,
        6
      ],
      "start_dfs": [
        9
      ],
      "return_zero": [
        15
      ],
      "visit_node": [
        15
      ],
      "process_left": [
        18
      ],
      "process_right": [
        18
      ],
      "found_existing": [
        21,
        22,
        23,
        24
      ],
      "assign_new_id": [
        21,
        22,
        23,
        24
      ],
      "update_count": [
        28
      ],
      "add_duplicate": [
        31,
        32
      ],
      "return_id": [
        35
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_null": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    int id = 1;\n    Dictionary<string, int> trees = new Dictionary<string, int>();\n    Dictionary<int, int> count = new Dictionary<int, int>();\n    List<TreeNode> result = new List<TreeNode>();\n\n    public IList<TreeNode> FindDuplicateSubtrees(TreeNode root) {\n        Lookup(root);\n        return result;\n    }\n\n    private int Lookup(TreeNode root) {\n        if (root == null) return 0;\n\n        // Serialize subtree\n        string serial = $\"{root.val},{Lookup(root.left)},{Lookup(root.right)}\";\n\n        // Assign ID to serialized subtree\n        int treeId;\n        if (!trees.ContainsKey(serial)) {\n            trees[serial] = id++;\n        }\n        treeId = trees[serial];\n\n        // Count the occurrence of the tree ID\n        if (!count.ContainsKey(treeId)) {\n            count[treeId] = 0;\n        }\n        count[treeId]++;\n\n        // If it's the second occurrence, record it\n        if (count[treeId] == 2) {\n            result.Add(root);\n        }\n\n        return treeId;\n    }\n}",
    "lineMap": {
      "start": [
        2,
        3,
        4,
        5
      ],
      "start_dfs": [
        8
      ],
      "return_zero": [
        13
      ],
      "visit_node": [
        13
      ],
      "process_left": [
        16
      ],
      "process_right": [
        16
      ],
      "found_existing": [
        19,
        20,
        21,
        22
      ],
      "assign_new_id": [
        19,
        20,
        21,
        22
      ],
      "update_count": [
        26,
        27,
        28,
        29
      ],
      "add_duplicate": [
        32,
        33
      ],
      "return_id": [
        36
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "is_null": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Solution struct {\n    id     int\n    trees  map[string]int\n    count  map[int]int\n    result []*TreeNode\n}\n\nfunc findDuplicateSubtrees(root *TreeNode) []*TreeNode {\n    s := &Solution{\n        id:     1,\n        trees:  make(map[string]int),\n        count:  make(map[int]int),\n        result: make([]*TreeNode, 0),\n    }\n    s.lookup(root)\n    return s.result\n}\n\nfunc (s *Solution) lookup(root *TreeNode) int {\n    if root == nil {\n        return 0\n    }\n\n    // Serialize subtree\n    serial := fmt.Sprintf(\"%d,%d,%d\", root.Val, s.lookup(root.Left), s.lookup(root.Right))\n\n    // Assign ID to serialized subtree\n    treeId, exists := s.trees[serial]\n    if !exists {\n        s.trees[serial] = s.id\n        treeId = s.id\n        s.id++\n    }\n\n    // Count the occurrence of the tree ID\n    s.count[treeId]++\n\n    // If it's the second occurrence, record it\n    if s.count[treeId] == 2 {\n        s.result = append(s.result, root)\n    }\n\n    return treeId\n}",
    "lineMap": {
      "start": [
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "start_dfs": [
        14
      ],
      "return_zero": [
        21
      ],
      "visit_node": [
        20
      ],
      "process_left": [
        25
      ],
      "process_right": [
        25
      ],
      "found_existing": [
        28,
        29,
        30,
        31,
        32
      ],
      "assign_new_id": [
        28,
        29,
        30,
        31,
        32
      ],
      "update_count": [
        36
      ],
      "add_duplicate": [
        39,
        40
      ],
      "return_id": [
        43
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_null": [
        20
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findDuplicateSubtrees = function(root) {\n    const trees = new Map();\n    const count = new Map();\n    const result = [];\n    let id = 1;\n\n    function lookup(root) {\n        if (!root) return 0;\n\n        // Serialize subtree\n        const serial = `${root.val},${lookup(root.left)},${lookup(root.right)}`;\n\n        // Assign ID to serialized subtree\n        if (!trees.has(serial)) {\n            trees.set(serial, id++);\n        }\n        const treeId = trees.get(serial);\n\n        // Count the occurrence of the tree ID\n        count.set(treeId, (count.get(treeId) || 0) + 1);\n\n        // If it's the second occurrence, record it\n        if (count.get(treeId) === 2) {\n            result.push(root);\n        }\n\n        return treeId;\n    }\n\n    lookup(root);\n    return result;\n};",
    "lineMap": {
      "start": [
        1,
        2,
        3,
        4,
        5
      ],
      "start_dfs": [
        28
      ],
      "return_zero": [
        8
      ],
      "visit_node": [
        8
      ],
      "process_left": [
        11
      ],
      "process_right": [
        11
      ],
      "found_existing": [
        14,
        15,
        16
      ],
      "assign_new_id": [
        14,
        15,
        16
      ],
      "update_count": [
        20
      ],
      "add_duplicate": [
        23,
        24
      ],
      "return_id": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_null": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findDuplicateSubtrees(root: TreeNode | null): Array<TreeNode | null> {\n    const trees = new Map<string, number>();\n    const count = new Map<number, number>();\n    const result: Array<TreeNode | null> = [];\n    let id = 1;\n\n    function lookup(root: TreeNode | null): number {\n        if (!root) return 0;\n\n        // Serialize subtree\n        const serial = `${root.val},${lookup(root.left)},${lookup(root.right)}`;\n\n        // Assign ID to serialized subtree\n        if (!trees.has(serial)) {\n            trees.set(serial, id++);\n        }\n        const treeId = trees.get(serial)!;\n\n        // Count the occurrence of the tree ID\n        count.set(treeId, (count.get(treeId) || 0) + 1);\n\n        // If it's the second occurrence, record it\n        if (count.get(treeId) === 2) {\n            result.push(root);\n        }\n\n        return treeId;\n    }\n\n    lookup(root);\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2,
        3,
        4,
        5
      ],
      "start_dfs": [
        28
      ],
      "return_zero": [
        8
      ],
      "visit_node": [
        8
      ],
      "process_left": [
        11
      ],
      "process_right": [
        11
      ],
      "found_existing": [
        14,
        15,
        16
      ],
      "assign_new_id": [
        14,
        15,
        16
      ],
      "update_count": [
        20
      ],
      "add_duplicate": [
        23,
        24
      ],
      "return_id": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_null": [
        8
      ]
    }
  }
};

const FindDuplicateSubtreesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        null,
        2,
        4,
        null,
        null,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        2,
        1,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "tree": [
        2,
        2,
        2,
        3,
        null,
        3,
        null
      ]
    }
  }
];

function generateFindDuplicateSubtreesSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let a=(e,t,l)=>{let i=r.get(e),a={type:"binaryTreeNode",value:i.value,parent:void 0!==i.parent?`node_${i.parent}`:void 0,isLeftChild:i.isLeftChild};return t&&(a.state=t),l&&(a.label=l),a},s={};r.forEach((e,t)=>{s[`node_${t}`]=a(t)});let n=new RecursiveStepRecorder({},{...s});n.pushCallFrame({root:(0,_treeHelper848569.kU)(r.get(0)??null)},"findDuplicateSubtrees");let o=1,d=new Map,u=new Map,c=new Map,h=[],p=[],f=[],g=[];n.add_new_global_variable("currentIdx",-1),n.add_new_global_variable("nullIdx",-1),n.add_new_global_variable("pathIdxs",[]),n.add_new_global_variable("idCounts",[]),n.add_new_global_variable("dupIds",[]),n.add_new_global_variable("dupArcs",[]),n.add_new_global_variable("result",[]),n.record("start","Start: identical subtrees produce identical serializations");let x=new Map,m=[],_=(e,t,r)=>{x.set(e,{state:t,label:r}),n.update_visual(`node_${e}`,a(e,t,r))},b=()=>{n.update_global_variable("idCounts",h.map(e=>[e,u.get(e)??0]))};return 0===r.size?n.record("complete","Empty tree: return []"):(n.record("start_dfs","Call lookup(root)"),!function e(t){let l,a=r.has(t);if(n.pushCallFrame({node:a?(0,_treeHelper848569.kU)(r.get(t)):"null"},"lookup"),!a)return n.add_conditional("is_null",!0),n.update_global_variable("nullIdx",t),n.record("return_zero","Null child: id 0"),n.update_global_variable("nullIdx",-1),n.popCallFrame(),0;let s=r.get(t).value;if(m.length>0){let e=m[m.length-1],t=x.get(e);t?.state!=="result"&&_(e,"path",t?.label)}m.push(t),_(t,"current"),n.update_global_variable("currentIdx",t),n.update_global_variable("nodeVal",s),n.update_global_variable("pathIdxs",[...m]),n.add_conditional("is_null",!1),n.record("visit_node",`Call lookup(${s})`);let v=2*t+1;n.update_global_variable("hasLeft",r.has(v)),n.record("process_left",r.has(v)?`Get the id of ${s}'s left subtree`:`Left of ${s} is null: id 0`);let y=e(v);n.update_frame_variable("leftId",y),n.update_global_variable("nodeVal",s);let N=2*t+2;n.update_global_variable("hasRight",r.has(N)),n.record("process_right",r.has(N)?`Get the id of ${s}'s right subtree`:`Right of ${s} is null: id 0`);let S=e(N);n.update_frame_variable("rightId",S),n.update_global_variable("nodeVal",s);let w=`${s},${y},${S}`;n.update_frame_variable("serial",w),n.update_global_variable("serText",w),d.has(w)?(l=d.get(w),n.update_global_variable("idNow",l),_(t,"current",`#${l}`),n.record("found_existing",`ser = "${w}" was seen before: same shape, id #${l}`)):(l=o,d.set(w,l),c.set(l,t),h.push(l),o++,n.update_global_variable("idNow",l),b(),_(t,"current",`#${l}`),n.record("assign_new_id",`ser = "${w}" is new: assign id #${l}`)),n.update_frame_variable("treeId",l);let $=(u.get(l)||0)+1;if(u.set(l,$),b(),n.update_global_variable("countNow",$),n.record("update_count",$>2?`count[#${l}] = ${$}: already in the result`:`count[#${l}] = ${$}`),2===$){g.push(t),p.push(l);let e=c.get(l);f.push([e,t]),n.update_global_variable("dupIds",[...p]),n.update_global_variable("dupArcs",f.map(e=>[...e])),n.update_global_variable("dupPair",[e,t]),n.update_global_variable("result",g.map(e=>r.get(e).value)),_(t,"result",`#${l}`),n.record("add_duplicate",`Second #${l}: duplicate subtree, result += ${s}`)}let j=x.get(t)?.state==="result"?"result":"visited";if(_(t,j,`#${l}`),m.pop(),n.update_global_variable("pathIdxs",[...m]),m.length>0){let e=m[m.length-1],t=x.get(e);t?.state!=="result"&&_(e,"current",t?.label),n.update_global_variable("currentIdx",e)}else n.update_global_variable("currentIdx",-1);return n.record("return_id",`Return id #${l} for the subtree at ${s}`),n.popCallFrame(),l}(0),n.update_global_variable("result",g.map(e=>r.get(e).value)),n.record("complete",`Done: ${g.length} duplicate subtree${1===g.length?"":"s"}, return [${g.map(e=>r.get(e).value).join(", ")}]`)),n.popCallFrame(),n.getSteps()
}

export function FindDuplicateSubtreesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindDuplicateSubtreesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindDuplicateSubtreesSteps(e) as any[];
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
      title="Find Duplicate Subtrees"
      slug="find-duplicate-subtrees"
      approaches={approaches}
      presets={FindDuplicateSubtreesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Flatten Binary Tree to Linked List (flatten-binary-tree-to-linked-list)
// ==========================================

const FlattenBinaryTreeToLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "def flatten(root):\n  current = root\n\n  while current:\n    if current.left:\n      # Find rightmost node in left subtree\n      predecessor = current.left\n      while predecessor.right:\n        predecessor = predecessor.right\n\n      # Connect predecessor's right to current's right\n      predecessor.right = current.right\n\n      # Move left subtree to right\n      current.right = current.left\n      current.left = None\n\n    # Move to next node\n    current = current.right",
    "lineMap": {
      "start": [
        1
      ],
      "root": [
        2
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "find_predecessor_start": [
        7,
        8
      ],
      "find_predecessor_continue": [
        9
      ],
      "connect_predecessor_right": [
        12
      ],
      "move_left_to_right": [
        15
      ],
      "clear_left": [
        16
      ],
      "next_current": [
        19
      ],
      "no_left": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_current": [
        4
      ],
      "has_left": [
        5
      ],
      "while_predecessor": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void flatten(TreeNode root) {\n    TreeNode current = root;\n\n    while (current != null) {\n        if (current.left != null) {\n            // Find rightmost node in left subtree\n            TreeNode predecessor = current.left;\n            while (predecessor.right != null) {\n                predecessor = predecessor.right;\n            }\n\n            // Connect predecessor's right to current's right\n            predecessor.right = current.right;\n\n            // Move left subtree to right\n            current.right = current.left;\n            current.left = null;\n        }\n\n        // Move to next node\n        current = current.right;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "root": [
        2
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "find_predecessor_start": [
        7,
        8
      ],
      "find_predecessor_continue": [
        9
      ],
      "connect_predecessor_right": [
        13
      ],
      "move_left_to_right": [
        16
      ],
      "clear_left": [
        17
      ],
      "next_current": [
        21
      ],
      "no_left": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_current": [
        4
      ],
      "has_left": [
        5
      ],
      "while_predecessor": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void flatten(TreeNode* root) {\n    TreeNode* current = root;\n\n    while (current != nullptr) {\n        if (current->left != nullptr) {\n            // Find rightmost node in left subtree\n            TreeNode* predecessor = current->left;\n            while (predecessor->right != nullptr) {\n                predecessor = predecessor->right;\n            }\n\n            // Connect predecessor's right to current's right\n            predecessor->right = current->right;\n\n            // Move left subtree to right\n            current->right = current->left;\n            current->left = nullptr;\n        }\n\n        // Move to next node\n        current = current->right;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "root": [
        2
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "find_predecessor_start": [
        7,
        8
      ],
      "find_predecessor_continue": [
        9
      ],
      "connect_predecessor_right": [
        13
      ],
      "move_left_to_right": [
        16
      ],
      "clear_left": [
        17
      ],
      "next_current": [
        21
      ],
      "no_left": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_current": [
        4
      ],
      "has_left": [
        5
      ],
      "while_predecessor": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void Flatten(TreeNode root) {\n    TreeNode current = root;\n\n    while (current != null) {\n        if (current.left != null) {\n            // Find rightmost node in left subtree\n            TreeNode predecessor = current.left;\n            while (predecessor.right != null) {\n                predecessor = predecessor.right;\n            }\n\n            // Connect predecessor's right to current's right\n            predecessor.right = current.right;\n\n            // Move left subtree to right\n            current.right = current.left;\n            current.left = null;\n        }\n\n        // Move to next node\n        current = current.right;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "root": [
        2
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "find_predecessor_start": [
        7,
        8
      ],
      "find_predecessor_continue": [
        9
      ],
      "connect_predecessor_right": [
        13
      ],
      "move_left_to_right": [
        16
      ],
      "clear_left": [
        17
      ],
      "next_current": [
        21
      ],
      "no_left": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_current": [
        4
      ],
      "has_left": [
        5
      ],
      "while_predecessor": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func flatten(root *TreeNode) {\n    current := root\n\n    for current != nil {\n        if current.Left != nil {\n            // Find rightmost node in left subtree\n            predecessor := current.Left\n            for predecessor.Right != nil {\n                predecessor = predecessor.Right\n            }\n\n            // Connect predecessor's right to current's right\n            predecessor.Right = current.Right\n\n            // Move left subtree to right\n            current.Right = current.Left\n            current.Left = nil\n        }\n\n        // Move to next node\n        current = current.Right\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "root": [
        2
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "find_predecessor_start": [
        7,
        8
      ],
      "find_predecessor_continue": [
        9
      ],
      "connect_predecessor_right": [
        13
      ],
      "move_left_to_right": [
        16
      ],
      "clear_left": [
        17
      ],
      "next_current": [
        21
      ],
      "no_left": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_current": [
        4
      ],
      "has_left": [
        5
      ],
      "while_predecessor": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function flatten(root) {\n    let current = root;\n\n    while (current !== null) {\n        if (current.left !== null) {\n            // Find rightmost node in left subtree\n            let predecessor = current.left;\n            while (predecessor.right !== null) {\n                predecessor = predecessor.right;\n            }\n\n            // Connect predecessor's right to current's right\n            predecessor.right = current.right;\n\n            // Move left subtree to right\n            current.right = current.left;\n            current.left = null;\n        }\n\n        // Move to next node\n        current = current.right;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "root": [
        2
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "find_predecessor_start": [
        7,
        8
      ],
      "find_predecessor_continue": [
        9
      ],
      "connect_predecessor_right": [
        13
      ],
      "move_left_to_right": [
        16
      ],
      "clear_left": [
        17
      ],
      "next_current": [
        21
      ],
      "no_left": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_current": [
        4
      ],
      "has_left": [
        5
      ],
      "while_predecessor": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function flatten(root: TreeNode | null): void {\n    let current = root;\n\n    while (current !== null) {\n        if (current.left !== null) {\n            // Find rightmost node in left subtree\n            let predecessor = current.left;\n            while (predecessor.right !== null) {\n                predecessor = predecessor.right;\n            }\n\n            // Connect predecessor's right to current's right\n            predecessor.right = current.right;\n\n            // Move left subtree to right\n            current.right = current.left;\n            current.left = null;\n        }\n\n        // Move to next node\n        current = current.right;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "root": [
        2
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "find_predecessor_start": [
        7,
        8
      ],
      "find_predecessor_continue": [
        9
      ],
      "connect_predecessor_right": [
        13
      ],
      "move_left_to_right": [
        16
      ],
      "clear_left": [
        17
      ],
      "next_current": [
        21
      ],
      "no_left": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_current": [
        4
      ],
      "has_left": [
        5
      ],
      "while_predecessor": [
        8
      ]
    }
  }
};

const FlattenBinaryTreeToLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example Tree",
    "value": {
      "tree": [
        1,
        2,
        5,
        3,
        4,
        null,
        6
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple Tree",
    "value": {
      "tree": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex3",
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
    "id": "ex4",
    "label": "Left-Skewed",
    "value": {
      "tree": [
        1,
        2,
        null,
        3,
        null,
        4,
        null,
        5
      ]
    }
  }
];

function generateFlattenBinaryTreeToLinkedListSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let i=new Map,o=new Map;r.forEach((e,t)=>{let n=2*t+1,l=2*t+2;i.set(t,r.has(n)?n:-1),o.set(t,r.has(l)?l:-1)});let a=()=>{let e={};return r.forEach((t,r)=>{e[r]=[i.get(r)??-1,o.get(r)??-1]}),e},s=(e,t,n)=>{let l=r.get(e),i={type:"binaryTreeNode",value:l.value,parent:void 0!==l.parent?`node_${l.parent}`:void 0,isLeftChild:l.isLeftChild};return t&&(i.state=t),n&&(i.label=n),i},d={};r.forEach((e,t)=>{d[`node_${t}`]=s(t)});let c=new StepRecorder({root:r.size>0?r.get(0).value:null,current:void 0,ptrs:a(),currentIdx:-1,nextIdx:-1,listVals:[]},{...d});if(!r.has(0))return c.record("empty_tree","Empty tree: nothing to flatten"),c.getSteps();c.record("start","Start: collect the nodes in preorder, then rewire into a right chain");let u=new Map,h=(e,t,r)=>{u.set(e,{state:t,label:r}),c.update_visual(`node_${e}`,s(e,t,r))},p=[],f=e=>{-1!==e&&r.has(e)&&(p.push(e),f(i.get(e)??-1),f(o.get(e)??-1))};f(0);let g=[],x=-1;p.forEach((e,t)=>{-1!==x&&h(x,"done",`#${t}`),g.push(r.get(e).value),h(e,"current",`#${t+1}`),c.update_variable("current",r.get(e).value),c.update_variable("currentIdx",e),c.update_variable("listVals",[...g]),c.record("collect_node",`Preorder visit ${r.get(e).value}: append to the list (#${t+1})`),x=e}),-1!==x&&h(x,"done",`#${p.length}`);for(let e=0;e<p.length-1;e++){let t=p[e],n=p[e+1];i.set(t,-1),o.set(t,n),h(t,"current",`#${e+1}`),h(n,"done",`#${e+2}`),c.update_variable("ptrs",a()),c.update_variable("current",r.get(t).value),c.update_variable("currentIdx",t),c.update_variable("nextIdx",n),c.record("rewire",`${r.get(t).value}.right = ${r.get(n).value}, ${r.get(t).value}.left = null`),h(t,"done",`#${e+1}`)}let m=p[p.length-1];return i.set(m,-1),c.update_variable("ptrs",a()),c.update_variable("current",null),c.update_variable("currentIdx",-1),c.update_variable("nextIdx",-1),c.record("complete",`Flattened: the tree is now the preorder chain ${g.join(" -> ")}`),c.getSteps()
}

export function FlattenBinaryTreeToLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FlattenBinaryTreeToLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFlattenBinaryTreeToLinkedListSteps(e) as any[];
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
      title="Flatten Binary Tree to Linked List"
      slug="flatten-binary-tree-to-linked-list"
      approaches={approaches}
      presets={FlattenBinaryTreeToLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Distribute Coins in Binary Tree (distribute-coins-in-binary-tree)
// ==========================================

const DistributeCoinsInBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def distributeCoins(self, root):\n        self.moves = 0\n\n        def dfs(node):\n            if node is None:\n                return 0\n\n            # Calculate excess from subtrees\n            left_excess = dfs(node.left)\n            right_excess = dfs(node.right)\n\n            # Calculate moves at this node\n            self.moves += abs(left_excess) + abs(right_excess)\n\n            # Calculate and return excess\n            excess = node.val + left_excess + right_excess - 1\n            return excess\n\n        dfs(root)\n        return self.moves",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        2
      ],
      "init": [
        3,
        5
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "calc_moves": [
        14
      ],
      "calc_excess": [
        17
      ],
      "return_excess": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_null": [
        6,
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int moves;\n\n    public int distributeCoins(TreeNode root) {\n        moves = 0;\n        dfs(root);\n        return moves;\n    }\n\n    private int dfs(TreeNode node) {\n        if (node == null) return 0;\n\n        // Calculate excess from subtrees\n        int leftExcess = dfs(node.left);\n        int rightExcess = dfs(node.right);\n\n        // Calculate moves at this node\n        moves += Math.abs(leftExcess) + Math.abs(rightExcess);\n\n        // Calculate and return excess\n        int excess = node.val + leftExcess + rightExcess - 1;\n        return excess;\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        4
      ],
      "init": [
        4,
        5,
        6
      ],
      "visit_node": [
        10
      ],
      "recurse_left": [
        14
      ],
      "recurse_right": [
        15
      ],
      "calc_moves": [
        18
      ],
      "calc_excess": [
        21
      ],
      "return_excess": [
        22
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\nprivate:\n    int moves = 0;\n\n    int dfs(TreeNode* node) {\n        if (node == nullptr) return 0;\n\n        // Calculate excess from subtrees\n        int leftExcess = dfs(node->left);\n        int rightExcess = dfs(node->right);\n\n        // Calculate moves at this node\n        moves += abs(leftExcess) + abs(rightExcess);\n\n        // Calculate and return excess\n        int excess = node->val + leftExcess + rightExcess - 1;\n        return excess;\n    }\n\npublic:\n    int distributeCoins(TreeNode* root) {\n        moves = 0;\n        dfs(root);\n        return moves;\n    }\n};",
    "lineMap": {
      "start": [
        1,
        2,
        3
      ],
      "empty_tree": [
        21
      ],
      "init": [
        20,
        21,
        22
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        10
      ],
      "calc_moves": [
        13
      ],
      "calc_excess": [
        16
      ],
      "return_excess": [
        17
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function distributeCoins(root) {\n    let moves = 0;\n\n    function dfs(node) {\n        if (node === null) return 0;\n\n        // Calculate excess from subtrees\n        const leftExcess = dfs(node.left);\n        const rightExcess = dfs(node.right);\n\n        // Calculate moves at this node\n        moves += Math.abs(leftExcess) + Math.abs(rightExcess);\n\n        // Calculate and return excess\n        const excess = node.val + leftExcess + rightExcess - 1;\n        return excess;\n    }\n\n    dfs(root);\n    return moves;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        2,
        4
      ],
      "visit_node": [
        4
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        9
      ],
      "calc_moves": [
        12
      ],
      "calc_excess": [
        15
      ],
      "return_excess": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function distributeCoins(root: TreeNode | null): number {\n    let moves = 0;\n\n    function dfs(node: TreeNode | null): number {\n        if (node === null) return 0;\n\n        // Calculate excess from subtrees\n        const leftExcess = dfs(node.left);\n        const rightExcess = dfs(node.right);\n\n        // Calculate moves at this node\n        moves += Math.abs(leftExcess) + Math.abs(rightExcess);\n\n        // Calculate and return excess\n        const excess = node.val + leftExcess + rightExcess - 1;\n        return excess;\n    }\n\n    dfs(root);\n    return moves;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        2,
        4
      ],
      "visit_node": [
        4
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        9
      ],
      "calc_moves": [
        12
      ],
      "calc_excess": [
        15
      ],
      "return_excess": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int moves;\n\n    public int DistributeCoins(TreeNode root) {\n        moves = 0;\n        Dfs(root);\n        return moves;\n    }\n\n    private int Dfs(TreeNode node) {\n        if (node == null) return 0;\n\n        // Calculate excess from subtrees\n        int leftExcess = Dfs(node.left);\n        int rightExcess = Dfs(node.right);\n\n        // Calculate moves at this node\n        moves += Math.Abs(leftExcess) + Math.Abs(rightExcess);\n\n        // Calculate and return excess\n        int excess = node.val + leftExcess + rightExcess - 1;\n        return excess;\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        4
      ],
      "init": [
        4,
        5,
        6
      ],
      "visit_node": [
        10
      ],
      "recurse_left": [
        14
      ],
      "recurse_right": [
        15
      ],
      "calc_moves": [
        18
      ],
      "calc_excess": [
        21
      ],
      "return_excess": [
        22
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_null": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func distributeCoins(root *TreeNode) int {\n    moves := 0\n\n    var dfs func(node *TreeNode) int\n    dfs = func(node *TreeNode) int {\n        if node == nil {\n            return 0\n        }\n\n        // Calculate excess from subtrees\n        leftExcess := dfs(node.Left)\n        rightExcess := dfs(node.Right)\n\n        // Calculate moves at this node\n        moves += abs(leftExcess) + abs(rightExcess)\n\n        // Calculate and return excess\n        excess := node.Val + leftExcess + rightExcess - 1\n        return excess\n    }\n\n    dfs(root)\n    return moves\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        1
      ],
      "init": [
        2,
        4,
        5
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        11
      ],
      "recurse_right": [
        12
      ],
      "calc_moves": [
        15
      ],
      "calc_excess": [
        18
      ],
      "return_excess": [
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ]
    }
  }
};

const DistributeCoinsInBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        3,
        0,
        0
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        0,
        3,
        0
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "tree": [
        1,
        0,
        2
      ]
    }
  }
];

function generateDistributeCoinsInBinaryTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),n=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(n.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);n.has(t)&&(n.get(e).parent=t,n.get(e).isLeftChild=e%2==1)}let a=e=>e<0?`(${e})`:String(e),o=new Map;n.forEach((e,t)=>o.set(t,e.value));let i=(e,t,r)=>{let s=n.get(e),a={type:"binaryTreeNode",value:o.get(e),parent:void 0!==s.parent?`node_${s.parent}`:void 0,isLeftChild:s.isLeftChild};return t&&(a.state=t),r&&(a.label=r),a},l={};n.forEach((e,t)=>{l[`node_${t}`]=i(t)});let d=new StepRecorder({totalMoves:0,currentNode:void 0,balance:void 0,movesAtEdge:void 0,currentIdx:-1,parentIdx:-1,flowEdge:null},{...l});if(d.record("start","Start: move coins until every node holds exactly 1"),0===n.size)return d.record("empty_tree","Empty tree: 0 moves"),d.getSteps();let c=new Map,u=(e,t,n)=>{c.set(e,{state:t,label:n}),d.update_visual(`node_${e}`,i(e,t,n))},p=[...n.keys()].sort((e,t)=>e-t);d.record("build_order","BFS from the root builds the parent map and the node list; now walk the list in reverse BFS order so every child is handled before its parent");let h=0;for(let e=p.length-1;e>=0;e--){let t=p[e],r=0===t?-1:Math.floor((t-1)/2),s=0!==t&&n.has(r);u(t,"current");let l=o.get(t),f=l-1;d.update_variable("currentIdx",t),d.update_variable("parentIdx",r),d.update_variable("currentNode",l),d.update_variable("balance",f),d.update_variable("flowEdge",null),d.record("visit_node",`${0===t?"Root":"Node"} holds ${l} coin${1===l?"":"s"}: balance = ${l} - 1 = ${f}`);let g=Math.abs(f);if(h+=g,d.update_variable("movesAtEdge",g),d.update_variable("totalMoves",h),d.update_variable("flowEdge",s?[t,r,f]:null),d.record("add_moves",0===g?`Add abs(0) = 0 moves, moves stays ${h}`:`Add abs(${a(f)}) = ${g} move${1===g?"":"s"}: moves = ${h}`),d.add_conditional("has_parent",s),s){let e=o.get(r);o.set(r,e+f),o.set(t,1),d.update_visual(`node_${r}`,i(r,c.get(r)?.state,c.get(r)?.label)),u(t,"done"),d.record("push_balance",0===f?`Push 0 to the parent: it stays at ${e}, node keeps its 1 coin`:`Push ${f} to the parent, so parent becomes ${e} + ${a(f)} = ${e+f}; node keeps 1 coin`)}else u(t,"done"),d.record("skip_root",`Root has no parent, so nothing is pushed: it keeps its ${o.get(t)} coin`);d.update_variable("flowEdge",null)}return d.update_variable("currentNode",null),d.update_variable("currentIdx",-1),d.update_variable("flowEdge",null),d.record("complete",`Every node has 1 coin: return moves = ${h}`),d.getSteps()
}

export function DistributeCoinsInBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DistributeCoinsInBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDistributeCoinsInBinaryTreeSteps(e) as any[];
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
      title="Distribute Coins in Binary Tree"
      slug="distribute-coins-in-binary-tree"
      approaches={approaches}
      presets={DistributeCoinsInBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// House Robber III (house-robber-iii)
// ==========================================

const HouseRobberIiiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def rob(self, root: TreeNode) -> int:\n        if not root:\n            return 0\n\n        # Option 1: Rob this node, skip children, collect from grandchildren\n        rob_current = root.val\n        if root.left:\n            rob_current += self.rob(root.left.left) + self.rob(root.left.right)\n        if root.right:\n            rob_current += self.rob(root.right.left) + self.rob(root.right.right)\n\n        # Option 2: Skip this node, collect best from children\n        skip_current = self.rob(root.left) + self.rob(root.right)\n\n        return max(rob_current, skip_current)",
    "lineMap": {
      "start": [
        1
      ],
      "visit_node": [
        2
      ],
      "null_check": [
        3,
        4
      ],
      "rob_current": [
        7
      ],
      "check_left": [
        8
      ],
      "add_left": [
        9
      ],
      "check_right": [
        10
      ],
      "add_right": [
        11
      ],
      "skip_current": [
        14
      ],
      "return_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_null": [
        3
      ],
      "has_left": [
        8
      ],
      "has_right": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int rob(TreeNode root) {\n        if (root == null) return 0;\n\n        // Option 1: Rob this node, skip children, collect from grandchildren\n        int robCurrent = root.val;\n        if (root.left != null) {\n            robCurrent += rob(root.left.left) + rob(root.left.right);\n        }\n        if (root.right != null) {\n            robCurrent += rob(root.right.left) + rob(root.right.right);\n        }\n\n        // Option 2: Skip this node, collect best from children\n        int skipCurrent = rob(root.left) + rob(root.right);\n\n        return Math.max(robCurrent, skipCurrent);\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "visit_node": [
        2
      ],
      "null_check": [
        3
      ],
      "rob_current": [
        6
      ],
      "check_left": [
        7
      ],
      "add_left": [
        8
      ],
      "check_right": [
        10
      ],
      "add_right": [
        11
      ],
      "skip_current": [
        15
      ],
      "return_result": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_null": [
        3
      ],
      "has_left": [
        7
      ],
      "has_right": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int rob(TreeNode* root) {\n        if (root == nullptr) return 0;\n\n        // Option 1: Rob this node, skip children, collect from grandchildren\n        int robCurrent = root->val;\n        if (root->left) {\n            robCurrent += rob(root->left->left) + rob(root->left->right);\n        }\n        if (root->right) {\n            robCurrent += rob(root->right->left) + rob(root->right->right);\n        }\n\n        // Option 2: Skip this node, collect best from children\n        int skipCurrent = rob(root->left) + rob(root->right);\n\n        return max(robCurrent, skipCurrent);\n    }\n};",
    "lineMap": {
      "start": [
        1
      ],
      "visit_node": [
        3
      ],
      "null_check": [
        4
      ],
      "rob_current": [
        7
      ],
      "check_left": [
        8
      ],
      "add_left": [
        9
      ],
      "check_right": [
        11
      ],
      "add_right": [
        12
      ],
      "skip_current": [
        16
      ],
      "return_result": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_null": [
        4
      ],
      "has_left": [
        8
      ],
      "has_right": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int Rob(TreeNode root) {\n        if (root == null) return 0;\n\n        // Option 1: Rob this node, skip children, collect from grandchildren\n        int robCurrent = root.val;\n        if (root.left != null) {\n            robCurrent += Rob(root.left.left) + Rob(root.left.right);\n        }\n        if (root.right != null) {\n            robCurrent += Rob(root.right.left) + Rob(root.right.right);\n        }\n\n        // Option 2: Skip this node, collect best from children\n        int skipCurrent = Rob(root.left) + Rob(root.right);\n\n        return Math.Max(robCurrent, skipCurrent);\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "visit_node": [
        2
      ],
      "null_check": [
        3
      ],
      "rob_current": [
        6
      ],
      "check_left": [
        7
      ],
      "add_left": [
        8
      ],
      "check_right": [
        10
      ],
      "add_right": [
        11
      ],
      "skip_current": [
        15
      ],
      "return_result": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_null": [
        3
      ],
      "has_left": [
        7
      ],
      "has_right": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rob(root *TreeNode) int {\n    if root == nil {\n        return 0\n    }\n\n    // Option 1: Rob this node, skip children, collect from grandchildren\n    robCurrent := root.Val\n    if root.Left != nil {\n        robCurrent += rob(root.Left.Left) + rob(root.Left.Right)\n    }\n    if root.Right != nil {\n        robCurrent += rob(root.Right.Left) + rob(root.Right.Right)\n    }\n\n    // Option 2: Skip this node, collect best from children\n    skipCurrent := rob(root.Left) + rob(root.Right)\n\n    if robCurrent > skipCurrent {\n        return robCurrent\n    }\n    return skipCurrent\n}",
    "lineMap": {
      "start": [
        1
      ],
      "visit_node": [
        1
      ],
      "null_check": [
        2,
        3
      ],
      "rob_current": [
        7
      ],
      "check_left": [
        8
      ],
      "add_left": [
        9
      ],
      "check_right": [
        11
      ],
      "add_right": [
        12
      ],
      "skip_current": [
        16
      ],
      "return_result": [
        18,
        19,
        21
      ],
      "complete": [
        18,
        19,
        21
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "has_left": [
        8
      ],
      "has_right": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var rob = function(root) {\n    if (root === null) return 0;\n\n    // Option 1: Rob this node, skip children, collect from grandchildren\n    var robCurrent = root.val;\n    if (root.left !== null) {\n        robCurrent += rob(root.left.left) + rob(root.left.right);\n    }\n    if (root.right !== null) {\n        robCurrent += rob(root.right.left) + rob(root.right.right);\n    }\n\n    // Option 2: Skip this node, collect best from children\n    var skipCurrent = rob(root.left) + rob(root.right);\n\n    return Math.max(robCurrent, skipCurrent);\n};",
    "lineMap": {
      "start": [
        1
      ],
      "visit_node": [
        1
      ],
      "null_check": [
        2
      ],
      "rob_current": [
        5
      ],
      "check_left": [
        6
      ],
      "add_left": [
        7
      ],
      "check_right": [
        9
      ],
      "add_right": [
        10
      ],
      "skip_current": [
        14
      ],
      "return_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "has_left": [
        6
      ],
      "has_right": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rob(root: TreeNode | null): number {\n    if (root === null) return 0;\n\n    // Option 1: Rob this node, skip children, collect from grandchildren\n    let robCurrent = root.val;\n    if (root.left !== null) {\n        robCurrent += rob(root.left.left) + rob(root.left.right);\n    }\n    if (root.right !== null) {\n        robCurrent += rob(root.right.left) + rob(root.right.right);\n    }\n\n    // Option 2: Skip this node, collect best from children\n    let skipCurrent = rob(root.left) + rob(root.right);\n\n    return Math.max(robCurrent, skipCurrent);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "visit_node": [
        1
      ],
      "null_check": [
        2
      ],
      "rob_current": [
        5
      ],
      "check_left": [
        6
      ],
      "add_left": [
        7
      ],
      "check_right": [
        9
      ],
      "add_right": [
        10
      ],
      "skip_current": [
        14
      ],
      "return_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "has_left": [
        6
      ],
      "has_right": [
        9
      ]
    }
  }
};

const HouseRobberIiiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        3,
        2,
        3,
        null,
        3,
        null,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        3,
        4,
        5,
        1,
        3,
        null,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Skewed Tree",
    "value": {
      "tree": [
        4,
        1,
        null,
        2,
        null,
        3
      ]
    }
  }
];

function generateHouseRobberIiiSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r={maxMoney:0,currentIdx:-1,currentVal:void 0,pathIdxs:[],nullIdx:-1,robCurrent:void 0,skipCurrent:void 0,addLeft:void 0,addRight:void 0,hasLeft:void 0,hasRight:void 0,calls:0};if(0===t.length||null===t[0]){let e=new StepRecorder({...r},{});return e.record("start","Empty tree - no houses to rob"),e.record("complete","Algorithm complete! Max money: 0"),e.getSteps()}let l=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(l.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);l.has(t)&&(l.get(e).parent=t,l.get(e).isLeftChild=e%2==1)}let n=(e,t={})=>{let r=l.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,...t}},a={};l.forEach((e,t)=>{a[`node_${t}`]=n(t)});let d=new StepRecorder({...r},{...a}),s=[],u=-1,h=-1,c=0,p=(e,t)=>{d.update_variable("currentIdx",u),d.update_variable("currentVal",u>=0?l.get(u).value:void 0),d.update_variable("pathIdxs",[...s]),d.update_variable("nullIdx",h),d.update_variable("calls",c),d.record(e,t),h=-1};p("start","Start House Robber III, naive recursion");let b=function e(t){if(c++,!l.has(t)){h=t;let e=t>0?Math.floor((t-1)/2):-1,r=u;return u=l.has(e)?e:u,d.add_conditional("check_null",!0),p("null_check","Empty house returns 0"),u=r,0}let r=l.get(t),o=2*t+1,a=2*t+2;s.push(t),u=t,d.update_visual(`node_${t}`,n(t,{state:"active"})),d.update_variable("currentNode",(0,_treeHelper848569.kU)(r)),d.update_variable("robCurrent",void 0),d.update_variable("skipCurrent",void 0),d.update_variable("addLeft",void 0),d.update_variable("addRight",void 0),d.update_variable("hasLeft",void 0),d.update_variable("hasRight",void 0),d.add_conditional("check_null",!1),p("visit_node",`Visiting node with value ${r.value}`);let b=r.value;d.update_variable("robCurrent",b),p("rob_current",`Rob ${r.value}: start with $${r.value}`);let f=l.has(o);if(d.update_variable("hasLeft",f),d.add_conditional("has_left",f),p("check_left",f?"Left child exists, so reach past it to its two grandchildren":"No left child, nothing to reach past"),f){let r=e(2*o+1)+e(2*o+2);b+=r,u=t,d.update_variable("addLeft",r),d.update_variable("robCurrent",b),p("add_left",`Left grandchildren give $${r}, robCurrent = $${b}`)}let m=l.has(a);if(u=t,d.update_variable("hasRight",m),d.add_conditional("has_right",m),p("check_right",m?"Right child exists, so reach past it to its two grandchildren":"No right child, nothing to reach past"),m){let r=e(2*a+1)+e(2*a+2);b+=r,u=t,d.update_variable("addRight",r),d.update_variable("robCurrent",b),p("add_right",`Right grandchildren give $${r}, robCurrent = $${b}`)}let g=e(o),_=e(a),v=g+_;u=t,d.update_variable("skipCurrent",v),p("skip_current",`Skip ${r.value}: ${g} + ${_} = $${v} from the children`);let x=Math.max(b,v);return d.update_visual(`node_${t}`,n(t,{state:"visited",label:`${x}`})),p("return_result",`Node ${r.value} returns max(${b}, ${v}) = $${x}`),s.pop(),u=s.length>0?s[s.length-1]:-1,x}(0);return d.update_variable("maxMoney",b),d.update_variable("robCurrent",void 0),d.update_variable("skipCurrent",void 0),d.update_variable("addLeft",void 0),d.update_variable("addRight",void 0),d.update_variable("currentNode",void 0),d.update_visual("node_0",n(0,{state:"result",label:`${b}`})),u=-1,p("complete",`Maximum money: $${b} (${c} calls)`),d.getSteps()
}

export function HouseRobberIiiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: HouseRobberIiiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateHouseRobberIiiSteps(e) as any[];
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
      title="House Robber III"
      slug="house-robber-iii"
      approaches={approaches}
      presets={HouseRobberIiiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Tree Maximum Path Sum (binary-tree-maximum-path-sum)
// ==========================================

const BinaryTreeMaximumPathSumTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maxPathSum(self, root):\n        self.max_sum = float('-inf')\n\n        def calculate_max_gain(node):\n            if node is None:\n                return 0\n\n            # Calculate max gain from left and right (discard negative)\n            left_gain = max(calculate_max_gain(node.left), 0)\n            right_gain = max(calculate_max_gain(node.right), 0)\n\n            # Calculate path sum through this node\n            current_max_path = node.val + left_gain + right_gain\n\n            # Update global maximum\n            self.max_sum = max(self.max_sum, current_max_path)\n\n            # Return gain to parent\n            return node.val + max(left_gain, right_gain)\n\n        calculate_max_gain(root)\n        return self.max_sum",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "init": [
        3,
        5
      ],
      "empty_tree": [
        2
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "calc_path": [
        14
      ],
      "update_max": [
        17
      ],
      "no_update": [
        17
      ],
      "calc_gain": [
        20
      ],
      "return_gain": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_null": [
        6,
        7
      ],
      "update_max": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int maxSum = Integer.MIN_VALUE;\n\n    public int maxPathSum(TreeNode root) {\n        calculateMaxGain(root);\n        return maxSum;\n    }\n\n    private int calculateMaxGain(TreeNode node) {\n        if (node == null) return 0;\n\n        // Calculate max gain from left and right (discard negative)\n        int leftGain = Math.max(calculateMaxGain(node.left), 0);\n        int rightGain = Math.max(calculateMaxGain(node.right), 0);\n\n        // Calculate path sum through this node\n        int currentMaxPath = node.val + leftGain + rightGain;\n\n        // Update global maximum\n        maxSum = Math.max(maxSum, currentMaxPath);\n\n        // Return gain to parent\n        return node.val + Math.max(leftGain, rightGain);\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "init": [
        4,
        5
      ],
      "empty_tree": [
        4
      ],
      "visit_node": [
        9
      ],
      "recurse_left": [
        13
      ],
      "recurse_right": [
        14
      ],
      "calc_path": [
        17
      ],
      "update_max": [
        20
      ],
      "no_update": [
        20
      ],
      "calc_gain": [
        23
      ],
      "return_gain": [
        23
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ],
      "update_max": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\nprivate:\n    int maxSum = INT_MIN;\n\n    int calculateMaxGain(TreeNode* node) {\n        if (node == nullptr) return 0;\n\n        // Calculate max gain from left and right (discard negative)\n        int leftGain = max(calculateMaxGain(node->left), 0);\n        int rightGain = max(calculateMaxGain(node->right), 0);\n\n        // Calculate path sum through this node\n        int currentMaxPath = node->val + leftGain + rightGain;\n\n        // Update global maximum\n        maxSum = max(maxSum, currentMaxPath);\n\n        // Return gain to parent\n        return node->val + max(leftGain, rightGain);\n    }\n\npublic:\n    int maxPathSum(TreeNode* root) {\n        calculateMaxGain(root);\n        return maxSum;\n    }\n};",
    "lineMap": {
      "start": [
        1,
        2,
        3
      ],
      "init": [
        22,
        23
      ],
      "empty_tree": [
        23
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        10
      ],
      "calc_path": [
        13
      ],
      "update_max": [
        16
      ],
      "no_update": [
        16
      ],
      "calc_gain": [
        19
      ],
      "return_gain": [
        19
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "update_max": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxPathSum(root) {\n    let maxSum = -Infinity;\n\n    function calculateMaxGain(node) {\n        if (node === null) return 0;\n\n        // Calculate max gain from left and right (discard negative)\n        const leftGain = Math.max(calculateMaxGain(node.left), 0);\n        const rightGain = Math.max(calculateMaxGain(node.right), 0);\n\n        // Calculate path sum through this node\n        const currentMaxPath = node.val + leftGain + rightGain;\n\n        // Update global maximum\n        maxSum = Math.max(maxSum, currentMaxPath);\n\n        // Return gain to parent\n        return node.val + Math.max(leftGain, rightGain);\n    }\n\n    calculateMaxGain(root);\n    return maxSum;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        4
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        9
      ],
      "calc_path": [
        12
      ],
      "update_max": [
        15
      ],
      "no_update": [
        15
      ],
      "calc_gain": [
        18
      ],
      "return_gain": [
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "update_max": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxPathSum(root: TreeNode | null): number {\n    let maxSum = -Infinity;\n\n    function calculateMaxGain(node: TreeNode | null): number {\n        if (node === null) return 0;\n\n        // Calculate max gain from left and right (discard negative)\n        const leftGain = Math.max(calculateMaxGain(node.left), 0);\n        const rightGain = Math.max(calculateMaxGain(node.right), 0);\n\n        // Calculate path sum through this node\n        const currentMaxPath = node.val + leftGain + rightGain;\n\n        // Update global maximum\n        maxSum = Math.max(maxSum, currentMaxPath);\n\n        // Return gain to parent\n        return node.val + Math.max(leftGain, rightGain);\n    }\n\n    calculateMaxGain(root);\n    return maxSum;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        4
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        4
      ],
      "recurse_left": [
        8
      ],
      "recurse_right": [
        9
      ],
      "calc_path": [
        12
      ],
      "update_max": [
        15
      ],
      "no_update": [
        15
      ],
      "calc_gain": [
        18
      ],
      "return_gain": [
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "update_max": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "class Solution {\n    private int maxSum = int.MinValue;\n\n    public int MaxPathSum(TreeNode root) {\n        MaxGain(root);\n        return maxSum;\n    }\n\n    private int MaxGain(TreeNode node) {\n        if (node == null) return 0;\n\n        // Calculate max gain from left and right (discard negative)\n        int leftGain = Math.Max(MaxGain(node.left), 0);\n        int rightGain = Math.Max(MaxGain(node.right), 0);\n\n        // Calculate path sum through this node\n        int currentMaxPath = node.val + leftGain + rightGain;\n\n        // Update global maximum\n        maxSum = Math.Max(maxSum, currentMaxPath);\n\n        // Return gain to parent\n        return node.val + Math.Max(leftGain, rightGain);\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "init": [
        4,
        5
      ],
      "empty_tree": [
        4
      ],
      "visit_node": [
        9
      ],
      "recurse_left": [
        13
      ],
      "recurse_right": [
        14
      ],
      "calc_path": [
        17
      ],
      "update_max": [
        20
      ],
      "no_update": [
        20
      ],
      "calc_gain": [
        23
      ],
      "return_gain": [
        23
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ],
      "update_max": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxPathSum(root *TreeNode) int {\n    maxSum := math.MinInt32\n\n    var maxGain func(node *TreeNode) int\n    maxGain = func(node *TreeNode) int {\n        if node == nil {\n            return 0\n        }\n\n        // Calculate max gain from left and right (discard negative)\n        leftGain := max(maxGain(node.Left), 0)\n        rightGain := max(maxGain(node.Right), 0)\n\n        // Calculate path sum through this node\n        currentMaxPath := node.Val + leftGain + rightGain\n\n        // Update global maximum\n        maxSum = max(maxSum, currentMaxPath)\n\n        // Return gain to parent\n        return node.Val + max(leftGain, rightGain)\n    }\n\n    maxGain(root)\n    return maxSum\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        4,
        5
      ],
      "empty_tree": [
        1
      ],
      "visit_node": [
        5
      ],
      "recurse_left": [
        11
      ],
      "recurse_right": [
        12
      ],
      "calc_path": [
        15
      ],
      "update_max": [
        18
      ],
      "no_update": [
        18
      ],
      "calc_gain": [
        21
      ],
      "return_gain": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "update_max": [
        18
      ]
    }
  }
};

const BinaryTreeMaximumPathSumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        -10,
        9,
        20,
        null,
        null,
        15,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Negative",
    "value": {
      "tree": [
        -3,
        -2,
        -1
      ]
    }
  }
];

function generateBinaryTreeMaximumPathSumSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),a=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(a.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);a.has(t)&&(a.get(e).parent=t,a.get(e).isLeftChild=e%2==1)}let i=e=>e>0?`+${e}`:String(e),l=(e,t,n)=>{let r=a.get(e),i={type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild};return t&&(i.state=t),n&&(i.label=n),i},o={};a.forEach((e,t)=>{o[`node_${t}`]=l(t)});let u=new StepRecorder({maxSum:0,currentNode:void 0,leftGain:void 0,rightGain:void 0,currentMaxPath:void 0,gain:void 0,currentIdx:-1,pathIdxs:[],maxSet:!1},{...o});if(u.record("start","Start: the max path can bend at any node and use any two of its arms"),0===a.size)return u.record("empty_tree","Empty tree: return 0"),u.getSteps();let s=Number.MIN_SAFE_INTEGER;u.record("init","maxSum = -infinity, compute gains bottom-up");let d=new Map,c=[],h=new Map,m=(e,t,a)=>{d.set(e,{state:t,label:a}),u.update_visual(`node_${e}`,l(e,t,a))};return!function e(n){if(null===n||!a.has(n))return u.add_conditional("is_null",!0),0;u.add_conditional("is_null",!1);let r=a.get(n).value;if(c.length>0){let e=c[c.length-1];m(e,"path",d.get(e)?.label)}c.push(n),m(n,"current"),u.update_variable("currentIdx",n),u.update_variable("nodeVal",r),u.update_variable("currentNode",r),u.record("visit_node",`Compute the gain of ${r}`);let l=2*n+1,o=2*n+2,x=l<t.length&&null!==t[l],g=o<t.length&&null!==t[o];u.update_variable("hasLeft",x),u.record("recurse_left",x?`Left arm gain of ${r} (drop it if negative)`:"Left is null: gain 0");let p=e(x?l:null),f=Math.max(p,0);u.update_variable("leftGain",f),u.update_variable("rawLeft",p),u.update_variable("nodeVal",r),u.update_variable("hasRight",g),u.record("recurse_right",g?`Right arm gain of ${r} (drop it if negative)`:"Right is null: gain 0");let _=e(g?o:null),b=Math.max(_,0);u.update_variable("rightGain",b),u.update_variable("rawRight",_),u.update_variable("nodeVal",r);let v=r+f+b,y=f>0&&x?h.get(l):[],M=b>0&&g?h.get(o):[],S=[...[...y].reverse(),n,...M];u.update_variable("currentMaxPath",v),u.update_variable("pathIdxs",S),u.record("calc_path",`Path bending at ${r}: ${r} + ${f} + ${b} = ${v}`);let G=s;s=Math.max(s,v),u.update_variable("maxSum",s),u.update_variable("maxSet",!0),s>G?(u.add_conditional("update_max",!0),u.update_variable("bestPathIdxs",S),u.record("update_max",`New best: maxSum = ${s}`)):(u.add_conditional("update_max",!1),u.record("no_update",`${v} does not beat ${s}`));let $=Math.max(f,b),j=r+$,w=[];if($>0&&(w=f>=b&&x?h.get(l):h.get(o)),h.set(n,[n,...w]),u.update_variable("gain",j),m(n,"done",i(j)),u.record("calc_gain",`Gain up to the parent: ${r} + max(${f}, ${b}) = ${i(j)}`),c.pop(),c.length>0){let e=c[c.length-1];m(e,"current",d.get(e)?.label),u.update_variable("currentIdx",e),u.update_variable("nodeVal",a.get(e).value)}else u.update_variable("currentIdx",-1);return u.record("return_gain",$>0?`Return ${i(j)} up the ${f>=b?"left":"right"} arm`:`Both arms drop: return just ${i(j)}`),j}(0),u.update_variable("currentNode",null),u.update_variable("currentIdx",-1),u.record("complete",`Maximum path sum = ${s}`),u.getSteps()
}

export function BinaryTreeMaximumPathSumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreeMaximumPathSumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreeMaximumPathSumSteps(e) as any[];
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
      title="Binary Tree Maximum Path Sum"
      slug="binary-tree-maximum-path-sum"
      approaches={approaches}
      presets={BinaryTreeMaximumPathSumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Tree Cameras (binary-tree-cameras)
// ==========================================

const BinaryTreeCamerasTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def minCameraCover(self, root: TreeNode) -> int:\n        nodes = []\n        self.collect_nodes(root, nodes)\n        n = len(nodes)\n        min_cameras = n\n\n        # Try all subsets using bitmask\n        for mask in range(1 << n):\n            cameras = set()\n            for i in range(n):\n                if mask & (1 << i):\n                    cameras.add(id(nodes[i]))\n            if self.all_covered(root, cameras, None):\n                min_cameras = min(min_cameras, bin(mask).count('1'))\n\n        return min_cameras\n\n    def collect_nodes(self, node, node_list):\n        if not node:\n            return\n        node_list.append(node)\n        self.collect_nodes(node.left, node_list)\n        self.collect_nodes(node.right, node_list)\n\n    def all_covered(self, node, cameras, parent):\n        if not node:\n            return True\n        covered = (id(node) in cameras\n            or (parent is not None and id(parent) in cameras)\n            or (node.left is not None and id(node.left) in cameras)\n            or (node.right is not None and id(node.right) in cameras))\n        if not covered:\n            return False\n        return (self.all_covered(node.left, cameras, node)\n            and self.all_covered(node.right, cameras, node))",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "collect": [
        3,
        4,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "init_min": [
        5,
        6
      ],
      "start_mask": [
        8,
        9
      ],
      "build_cameras": [
        10,
        11,
        12,
        13
      ],
      "check_node": [
        26,
        27,
        29,
        30,
        31,
        32
      ],
      "cover_fail": [
        33,
        34
      ],
      "cover_ok": [
        35,
        36
      ],
      "check_cover": [
        14
      ],
      "update_min": [
        14,
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "for_mask": [
        9
      ],
      "for_i": [
        11
      ],
      "in_mask": [
        12
      ],
      "is_covered": [
        33
      ],
      "all_covered": [
        14
      ],
      "is_better": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    int minCameras;\n\n    public int minCameraCover(TreeNode root) {\n        List<TreeNode> nodes = new ArrayList<>();\n        collectNodes(root, nodes);\n        int n = nodes.size();\n        minCameras = n; // worst case: camera on every node\n\n        // Try all subsets using bitmask\n        for (int mask = 0; mask < (1 << n); mask++) {\n            Set<TreeNode> cameras = new HashSet<>();\n            for (int i = 0; i < n; i++) {\n                if ((mask & (1 << i)) != 0) {\n                    cameras.add(nodes.get(i));\n                }\n            }\n            if (allCovered(root, cameras, null)) {\n                minCameras = Math.min(minCameras, cameras.size());\n            }\n        }\n        return minCameras;\n    }\n\n    private void collectNodes(TreeNode node, List<TreeNode> list) {\n        if (node == null) return;\n        list.add(node);\n        collectNodes(node.left, list);\n        collectNodes(node.right, list);\n    }\n\n    private boolean allCovered(TreeNode node, Set<TreeNode> cameras, TreeNode parent) {\n        if (node == null) return true;\n        // A node is covered if it has a camera, or its parent has a camera,\n        // or one of its children has a camera\n        boolean covered = cameras.contains(node)\n            || (parent != null && cameras.contains(parent))\n            || (node.left != null && cameras.contains(node.left))\n            || (node.right != null && cameras.contains(node.right));\n        if (!covered) return false;\n        return allCovered(node.left, cameras, node)\n            && allCovered(node.right, cameras, node);\n    }\n}",
    "lineMap": {
      "-": [
        1,
        4
      ],
      "collect": [
        5,
        6,
        25,
        26,
        27,
        28,
        29
      ],
      "init_min": [
        7,
        8
      ],
      "start_mask": [
        10,
        11
      ],
      "build_cameras": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "check_node": [
        32,
        33,
        36,
        37,
        38,
        39
      ],
      "cover_fail": [
        40
      ],
      "cover_ok": [
        41,
        42
      ],
      "check_cover": [
        18
      ],
      "update_min": [
        18,
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_mask": [
        11
      ],
      "for_i": [
        13
      ],
      "in_mask": [
        14
      ],
      "is_covered": [
        40
      ],
      "all_covered": [
        18
      ],
      "is_better": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int minCameraCover(TreeNode* root) {\n        vector<TreeNode*> nodes;\n        collectNodes(root, nodes);\n        int n = nodes.size();\n        int minCameras = n;\n\n        for (int mask = 0; mask < (1 << n); mask++) {\n            unordered_set<TreeNode*> cameras;\n            for (int i = 0; i < n; i++) {\n                if (mask & (1 << i)) {\n                    cameras.insert(nodes[i]);\n                }\n            }\n            if (allCovered(root, cameras, nullptr)) {\n                minCameras = min(minCameras, (int)cameras.size());\n            }\n        }\n        return minCameras;\n    }\n\nprivate:\n    void collectNodes(TreeNode* node, vector<TreeNode*>& list) {\n        if (!node) return;\n        list.push_back(node);\n        collectNodes(node->left, list);\n        collectNodes(node->right, list);\n    }\n\n    bool allCovered(TreeNode* node, unordered_set<TreeNode*>& cameras, TreeNode* parent) {\n        if (!node) return true;\n        bool covered = cameras.count(node)\n            || (parent && cameras.count(parent))\n            || (node->left && cameras.count(node->left))\n            || (node->right && cameras.count(node->right));\n        if (!covered) return false;\n        return allCovered(node->left, cameras, node)\n            && allCovered(node->right, cameras, node);\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "collect": [
        4,
        5,
        24,
        25,
        26,
        27,
        28
      ],
      "init_min": [
        6,
        7
      ],
      "start_mask": [
        9
      ],
      "build_cameras": [
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "check_node": [
        31,
        32,
        33,
        34,
        35,
        36
      ],
      "cover_fail": [
        37
      ],
      "cover_ok": [
        38,
        39
      ],
      "check_cover": [
        16
      ],
      "update_min": [
        16,
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "for_mask": [
        9
      ],
      "for_i": [
        11
      ],
      "in_mask": [
        12
      ],
      "is_covered": [
        37
      ],
      "all_covered": [
        16
      ],
      "is_better": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MinCameraCover(TreeNode root) {\n        var nodes = new List<TreeNode>();\n        CollectNodes(root, nodes);\n        int n = nodes.Count;\n        int minCameras = n;\n\n        for (int mask = 0; mask < (1 << n); mask++) {\n            var cameras = new HashSet<TreeNode>();\n            for (int i = 0; i < n; i++) {\n                if ((mask & (1 << i)) != 0) {\n                    cameras.Add(nodes[i]);\n                }\n            }\n            if (AllCovered(root, cameras, null)) {\n                minCameras = Math.Min(minCameras, cameras.Count);\n            }\n        }\n        return minCameras;\n    }\n\n    private void CollectNodes(TreeNode node, List<TreeNode> list) {\n        if (node == null) return;\n        list.Add(node);\n        CollectNodes(node.left, list);\n        CollectNodes(node.right, list);\n    }\n\n    private bool AllCovered(TreeNode node, HashSet<TreeNode> cameras, TreeNode parent) {\n        if (node == null) return true;\n        bool covered = cameras.Contains(node)\n            || (parent != null && cameras.Contains(parent))\n            || (node.left != null && cameras.Contains(node.left))\n            || (node.right != null && cameras.Contains(node.right));\n        if (!covered) return false;\n        return AllCovered(node.left, cameras, node)\n            && AllCovered(node.right, cameras, node);\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "collect": [
        3,
        4,
        22,
        23,
        24,
        25,
        26
      ],
      "init_min": [
        5,
        6
      ],
      "start_mask": [
        8
      ],
      "build_cameras": [
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "check_node": [
        29,
        30,
        31,
        32,
        33,
        34
      ],
      "cover_fail": [
        35
      ],
      "cover_ok": [
        36,
        37
      ],
      "check_cover": [
        15
      ],
      "update_min": [
        15,
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_mask": [
        8
      ],
      "for_i": [
        10
      ],
      "in_mask": [
        11
      ],
      "is_covered": [
        35
      ],
      "all_covered": [
        15
      ],
      "is_better": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minCameraCover(root *TreeNode) int {\n    var nodes []*TreeNode\n    collectNodes(root, &nodes)\n    n := len(nodes)\n    minCameras := n\n\n    for mask := 0; mask < (1 << n); mask++ {\n        cameras := make(map[*TreeNode]bool)\n        for i := 0; i < n; i++ {\n            if mask&(1<<i) != 0 {\n                cameras[nodes[i]] = true\n            }\n        }\n        if allCovered(root, cameras, nil) {\n            count := 0\n            for range cameras {\n                count++\n            }\n            if count < minCameras {\n                minCameras = count\n            }\n        }\n    }\n    return minCameras\n}\n\nfunc collectNodes(node *TreeNode, list *[]*TreeNode) {\n    if node == nil {\n        return\n    }\n    *list = append(*list, node)\n    collectNodes(node.Left, list)\n    collectNodes(node.Right, list)\n}\n\nfunc allCovered(node *TreeNode, cameras map[*TreeNode]bool, parent *TreeNode) bool {\n    if node == nil {\n        return true\n    }\n    covered := cameras[node] ||\n        (parent != nil && cameras[parent]) ||\n        (node.Left != nil && cameras[node.Left]) ||\n        (node.Right != nil && cameras[node.Right])\n    if !covered {\n        return false\n    }\n    return allCovered(node.Left, cameras, node) &&\n        allCovered(node.Right, cameras, node)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "collect": [
        2,
        3,
        27,
        28,
        29,
        30,
        31,
        32,
        33
      ],
      "init_min": [
        4,
        5
      ],
      "start_mask": [
        7
      ],
      "build_cameras": [
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "check_node": [
        36,
        37,
        40,
        41,
        42,
        43
      ],
      "cover_fail": [
        44,
        45
      ],
      "cover_ok": [
        47,
        48
      ],
      "check_cover": [
        14
      ],
      "update_min": [
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_mask": [
        7
      ],
      "for_i": [
        9
      ],
      "in_mask": [
        10
      ],
      "is_covered": [
        44
      ],
      "all_covered": [
        14
      ],
      "is_better": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var minCameraCover = function(root) {\n    var nodes = [];\n    collectNodes(root, nodes);\n    var n = nodes.length;\n    var minCameras = n;\n\n    for (var mask = 0; mask < (1 << n); mask++) {\n        var cameras = new Set();\n        for (var i = 0; i < n; i++) {\n            if (mask & (1 << i)) {\n                cameras.add(nodes[i]);\n            }\n        }\n        if (allCovered(root, cameras, null)) {\n            minCameras = Math.min(minCameras, cameras.size);\n        }\n    }\n    return minCameras;\n};\n\nfunction collectNodes(node, list) {\n    if (!node) return;\n    list.push(node);\n    collectNodes(node.left, list);\n    collectNodes(node.right, list);\n}\n\nfunction allCovered(node, cameras, parent) {\n    if (!node) return true;\n    var covered = cameras.has(node)\n        || (parent !== null && cameras.has(parent))\n        || (node.left !== null && cameras.has(node.left))\n        || (node.right !== null && cameras.has(node.right));\n    if (!covered) return false;\n    return allCovered(node.left, cameras, node)\n        && allCovered(node.right, cameras, node);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "collect": [
        2,
        3,
        21,
        22,
        23,
        24,
        25
      ],
      "init_min": [
        4,
        5
      ],
      "start_mask": [
        7
      ],
      "build_cameras": [
        8,
        9,
        10,
        11,
        12
      ],
      "check_node": [
        28,
        29,
        30,
        31,
        32,
        33
      ],
      "cover_fail": [
        34
      ],
      "cover_ok": [
        35,
        36
      ],
      "check_cover": [
        14
      ],
      "update_min": [
        14,
        15
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_mask": [
        7
      ],
      "for_i": [
        9
      ],
      "in_mask": [
        10
      ],
      "is_covered": [
        34
      ],
      "all_covered": [
        14
      ],
      "is_better": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minCameraCover(root: TreeNode | null): number {\n    const nodes: TreeNode[] = [];\n    collectNodesTS(root, nodes);\n    const n = nodes.length;\n    let minCameras = n;\n\n    for (let mask = 0; mask < (1 << n); mask++) {\n        const cameras = new Set<TreeNode>();\n        for (let i = 0; i < n; i++) {\n            if (mask & (1 << i)) {\n                cameras.add(nodes[i]);\n            }\n        }\n        if (allCoveredTS(root, cameras, null)) {\n            minCameras = Math.min(minCameras, cameras.size);\n        }\n    }\n    return minCameras;\n}\n\nfunction collectNodesTS(node: TreeNode | null, list: TreeNode[]): void {\n    if (!node) return;\n    list.push(node);\n    collectNodesTS(node.left, list);\n    collectNodesTS(node.right, list);\n}\n\nfunction allCoveredTS(node: TreeNode | null, cameras: Set<TreeNode>, parent: TreeNode | null): boolean {\n    if (!node) return true;\n    const covered = cameras.has(node)\n        || (parent !== null && cameras.has(parent))\n        || (node.left !== null && cameras.has(node.left))\n        || (node.right !== null && cameras.has(node.right));\n    if (!covered) return false;\n    return allCoveredTS(node.left, cameras, node)\n        && allCoveredTS(node.right, cameras, node);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "collect": [
        2,
        3,
        21,
        22,
        23,
        24,
        25
      ],
      "init_min": [
        4,
        5
      ],
      "start_mask": [
        7
      ],
      "build_cameras": [
        8,
        9,
        10,
        11,
        12
      ],
      "check_node": [
        28,
        29,
        30,
        31,
        32,
        33
      ],
      "cover_fail": [
        34
      ],
      "cover_ok": [
        35,
        36
      ],
      "check_cover": [
        14
      ],
      "update_min": [
        14,
        15
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_mask": [
        7
      ],
      "for_i": [
        9
      ],
      "in_mask": [
        10
      ],
      "is_covered": [
        34
      ],
      "all_covered": [
        14
      ],
      "is_better": [
        15
      ]
    }
  }
};

const BinaryTreeCamerasPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Small Tree",
    "value": {
      "tree": [
        0,
        0,
        null,
        0,
        0
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Medium Tree",
    "value": {
      "tree": [
        0,
        0,
        null,
        0,
        null,
        0,
        null,
        null,
        0
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Skewed Tree",
    "value": {
      "tree": [
        0,
        0,
        null,
        0,
        null,
        0
      ]
    }
  }
];

function generateBinaryTreeCamerasSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]);if(0===t.length||null===t[0]){let e=new StepRecorder({cameras:0,currentIdx:-1,currentVal:void 0,pathIdxs:[],nullIdx:-1,leftCode:-1,rightCode:-1,nodeCode:-1},{});return e.record("start","Empty tree - no cameras needed"),e.record("complete","Algorithm complete! Minimum cameras needed: 0"),e.getSteps()}let r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let o=(e,t={})=>{let a=r.get(e);return{type:"binaryTreeNode",value:a.value,parent:void 0!==a.parent?`node_${a.parent}`:void 0,isLeftChild:a.isLeftChild,...t}},l={};r.forEach((e,t)=>{l[`node_${t}`]=o(t)});let d=new StepRecorder({cameras:0,currentIdx:-1,currentVal:void 0,pathIdxs:[],nullIdx:-1,leftCode:-1,rightCode:-1,nodeCode:-1},{...l}),c=[],s=-1,u=-1,m=(e,t)=>{d.update_variable("currentIdx",s),d.update_variable("currentVal",s>=0?r.get(s).value:void 0),d.update_variable("pathIdxs",[...c]),d.update_variable("nullIdx",u),d.record(e,t),u=-1};m("start","Start Binary Tree Cameras algorithm"),d.update_variable("cameras",0),m("init","Cover every node with the fewest cameras; count = 0");let i=(c: any)=>0===c?"uncovered":1===c?"a camera":"covered";let h=0;return 0===function e(t){if(!r.has(t)){u=t;let e=t>0?Math.floor((t-1)/2):-1,a=s;return s=r.has(e)?e:s,d.add_conditional("check_null",!0),m("null_node","Null node is already covered (return covered)"),s=a,2}d.add_conditional("check_null",!1);let a=r.get(t);c.push(t),s=t,d.update_visual(`node_${t}`,o(t,{state:"active"})),d.update_variable("leftCode",-1),d.update_variable("rightCode",-1),d.update_variable("nodeCode",-1),m("visit_node",`Visit node ${a.value}`);let n=e(2*t+1);s=t,d.update_variable("leftCode",n),m("left_result",`Left child is ${i(n)}`);let l=e(2*t+2);if(s=t,d.update_variable("rightCode",l),m("right_result",`Right child is ${i(l)}`),0===n||0===l)return d.add_conditional("needs_camera",!0),h++,d.update_variable("cameras",h),d.update_variable("nodeCode",1),d.update_visual(`node_${t}`,o(t,{state:"camera",label:"cam"})),m("place_camera",`A child is uncovered → place a camera here (total ${h})`),c.pop(),s=c.length?c[c.length-1]:-1,1;d.add_conditional("needs_camera",!1);let f=1===n||1===l;return(d.add_conditional("has_camera_child",f),f)?(d.update_variable("nodeCode",2),d.update_visual(`node_${t}`,o(t,{state:"covered",label:"cov"})),m("mark_covered",`A child has a camera → node ${a.value} is covered`),c.pop(),s=c.length?c[c.length-1]:-1,2):(d.update_variable("nodeCode",0),d.update_visual(`node_${t}`,o(t,{state:"not_covered",label:"unc"})),m("not_covered",`Both children covered but no camera → node ${a.value} is exposed`),c.pop(),s=c.length?c[c.length-1]:-1,0)}(0)?(d.add_conditional("root_not_covered",!0),h++,d.update_variable("cameras",h),s=0,d.update_variable("nodeCode",1),d.update_visual("node_0",o(0,{state:"camera",label:"cam"})),m("root_camera",`Root is exposed → place a camera at the root (total ${h})`)):(d.add_conditional("root_not_covered",!1),s=0,m("root_covered","Root is already covered")),s=-1,d.update_variable("currentVal",void 0),d.update_variable("leftCode",-1),d.update_variable("rightCode",-1),d.update_variable("nodeCode",-1),m("complete",`Algorithm complete! Minimum cameras needed: ${h}`),d.getSteps()
}

export function BinaryTreeCamerasProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreeCamerasTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreeCamerasSteps(e) as any[];
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
      title="Binary Tree Cameras"
      slug="binary-tree-cameras"
      approaches={approaches}
      presets={BinaryTreeCamerasPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Average of Levels in Binary Tree (average-of-levels-in-binary-tree)
// ==========================================

const AverageOfLevelsInBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def averageOfLevels(self, root: Optional[TreeNode]) -> List[float]:\n        result = []\n        queue = deque([root])\n\n        while queue:\n            level_size = len(queue)\n            level_sum = 0\n\n            for _ in range(level_size):\n                node = queue.popleft()\n                level_sum += node.val\n\n                if node.left:\n                    queue.append(node.left)\n                if node.right:\n                    queue.append(node.right)\n\n            result.append(level_sum / level_size)\n\n        return result",
    "lineMap": {
      "start": [
        2
      ],
      "init_queue": [
        3,
        4
      ],
      "start_level": [
        7,
        8
      ],
      "dequeue_node": [
        11,
        12
      ],
      "enqueue_left": [
        15
      ],
      "enqueue_right": [
        17
      ],
      "compute_average": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_queue": [
        6
      ],
      "for_loop": [
        10
      ],
      "has_left": [
        14
      ],
      "has_right": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Double> averageOfLevels(TreeNode root) {\n        List<Double> result = new ArrayList<>();\n        Queue<TreeNode> queue = new LinkedList<>();\n        queue.offer(root);\n\n        while (!queue.isEmpty()) {\n            int levelSize = queue.size();\n            // Use long to avoid overflow with large node values\n            long sum = 0;\n\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode node = queue.poll();\n                sum += node.val;\n\n                if (node.left != null) queue.offer(node.left);\n                if (node.right != null) queue.offer(node.right);\n            }\n\n            result.add((double) sum / levelSize);\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "init_queue": [
        3,
        4,
        5
      ],
      "start_level": [
        8,
        10
      ],
      "dequeue_node": [
        13,
        14
      ],
      "enqueue_left": [
        16
      ],
      "enqueue_right": [
        17
      ],
      "compute_average": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "while_queue": [
        7
      ],
      "for_loop": [
        12
      ],
      "has_left": [
        16
      ],
      "has_right": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<double> averageOfLevels(TreeNode* root) {\n        vector<double> result;\n        queue<TreeNode*> q;\n        q.push(root);\n\n        while (!q.empty()) {\n            int levelSize = q.size();\n            // Use long long to avoid overflow with large node values\n            long long sum = 0;\n\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode* node = q.front();\n                q.pop();\n                sum += node->val;\n\n                if (node->left) q.push(node->left);\n                if (node->right) q.push(node->right);\n            }\n\n            result.push_back((double) sum / levelSize);\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "init_queue": [
        4,
        5,
        6
      ],
      "start_level": [
        9,
        11
      ],
      "dequeue_node": [
        14,
        15,
        16
      ],
      "enqueue_left": [
        18
      ],
      "enqueue_right": [
        19
      ],
      "compute_average": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "while_queue": [
        8
      ],
      "for_loop": [
        13
      ],
      "has_left": [
        18
      ],
      "has_right": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<double> AverageOfLevels(TreeNode root) {\n        List<double> result = new List<double>();\n        Queue<TreeNode> queue = new Queue<TreeNode>();\n        queue.Enqueue(root);\n\n        while (queue.Count > 0) {\n            int levelSize = queue.Count;\n            // Use long to avoid overflow with large node values\n            long sum = 0;\n\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode node = queue.Dequeue();\n                sum += node.val;\n\n                if (node.left != null) queue.Enqueue(node.left);\n                if (node.right != null) queue.Enqueue(node.right);\n            }\n\n            result.Add((double) sum / levelSize);\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "init_queue": [
        3,
        4,
        5
      ],
      "start_level": [
        8,
        10
      ],
      "dequeue_node": [
        13,
        14
      ],
      "enqueue_left": [
        16
      ],
      "enqueue_right": [
        17
      ],
      "compute_average": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "while_queue": [
        7
      ],
      "for_loop": [
        12
      ],
      "has_left": [
        16
      ],
      "has_right": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func averageOfLevels(root *TreeNode) []float64 {\n    result := []float64{}\n    queue := []*TreeNode{root}\n\n    for len(queue) > 0 {\n        levelSize := len(queue)\n        // Use int64 to avoid overflow with large node values\n        var sum int64\n\n        for i := 0; i < levelSize; i++ {\n            node := queue[0]\n            queue = queue[1:]\n            sum += int64(node.Val)\n\n            if node.Left != nil {\n                queue = append(queue, node.Left)\n            }\n            if node.Right != nil {\n                queue = append(queue, node.Right)\n            }\n        }\n\n        result = append(result, float64(sum)/float64(levelSize))\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_queue": [
        2,
        3
      ],
      "start_level": [
        6,
        8
      ],
      "dequeue_node": [
        11,
        12,
        13
      ],
      "enqueue_left": [
        16
      ],
      "enqueue_right": [
        19
      ],
      "compute_average": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_queue": [
        5
      ],
      "for_loop": [
        10
      ],
      "has_left": [
        15
      ],
      "has_right": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var averageOfLevels = function(root) {\n    const result = [];\n    const queue = [root];\n\n    while (queue.length > 0) {\n        const levelSize = queue.length;\n        // Max sum is 10^4 * 2^31 (about 2.1e13), below Number.MAX_SAFE_INTEGER (2^53 - 1), so a plain number is exact\n        let sum = 0;\n\n        for (let i = 0; i < levelSize; i++) {\n            const node = queue.shift();\n            sum += node.val;\n\n            if (node.left) queue.push(node.left);\n            if (node.right) queue.push(node.right);\n        }\n\n        result.push(sum / levelSize);\n    }\n\n    return result;\n};",
    "lineMap": {
      "start": [
        1
      ],
      "init_queue": [
        2,
        3
      ],
      "start_level": [
        6,
        8
      ],
      "dequeue_node": [
        11,
        12
      ],
      "enqueue_left": [
        14
      ],
      "enqueue_right": [
        15
      ],
      "compute_average": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_queue": [
        5
      ],
      "for_loop": [
        10
      ],
      "has_left": [
        14
      ],
      "has_right": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function averageOfLevels(root: TreeNode | null): number[] {\n    const result: number[] = [];\n    if (!root) return result;\n\n    const queue: TreeNode[] = [root];\n\n    while (queue.length > 0) {\n        const levelSize = queue.length;\n        // Max sum is 10^4 * 2^31 (about 2.1e13), below Number.MAX_SAFE_INTEGER (2^53 - 1), so a plain number is exact\n        let sum = 0;\n\n        for (let i = 0; i < levelSize; i++) {\n            const node = queue.shift()!;\n            sum += node.val;\n\n            if (node.left) queue.push(node.left);\n            if (node.right) queue.push(node.right);\n        }\n\n        result.push(sum / levelSize);\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init_queue": [
        2,
        5
      ],
      "start_level": [
        8,
        10
      ],
      "dequeue_node": [
        13,
        14
      ],
      "enqueue_left": [
        16
      ],
      "enqueue_right": [
        17
      ],
      "compute_average": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "while_queue": [
        7
      ],
      "for_loop": [
        12
      ],
      "has_left": [
        16
      ],
      "has_right": [
        17
      ]
    }
  }
};

const AverageOfLevelsInBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Complete Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Large Values",
    "value": {
      "tree": [
        5,
        8,
        11,
        13,
        4,
        7,
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Four Levels",
    "value": {
      "tree": [
        4,
        7,
        9,
        1,
        5,
        8,
        12,
        3,
        2,
        6,
        10,
        null,
        null,
        11,
        14
      ]
    }
  }
];

function generateAverageOfLevelsInBinaryTreeSteps(e: any): any[] {
  let r=e=>Number.isInteger(e)?String(e):String(parseFloat(e.toFixed(5)));
let t=(0,_treeHelper848569.Gu)(e.tree||[]),l=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(l.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);l.has(t)&&(l.get(e).parent=t,l.get(e).isLeftChild=e%2==1)}let a=(e,t)=>{let n=l.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t}},s={};l.forEach((e,t)=>{s[`node_${t}`]=a(t)});let o=new StepRecorder({result:[],sums:[],counts:[],depth:void 0,currentIdx:void 0,maxDepth:void 0},{...s});if(o.record("start","Start: accumulate each level's sum and count with DFS"),0===l.size)return o.update_variable("result",[]),o.record("complete","Empty tree, return []"),o.getSteps();let u=e=>Math.floor(Math.log2(e+1)),d=Math.max(...Array.from(l.keys()).map(u));o.update_variable("maxDepth",d);let h=[],c=[],f=[],p=-1;!function e(t,n){if(!l.has(t))return;let i=l.get(t);n===h.length&&(h.push(0),c.push(0)),h[n]+=i.value,c[n]+=1,p>=0&&o.update_visual(`node_${p}`,a(p,"visited")),o.update_visual(`node_${t}`,a(t,"current")),p=t,o.update_variable("depth",n),o.update_variable("currentIdx",t),o.update_variable("sums",[...h]),o.update_variable("counts",[...c]),o.record("visit",`Visit ${i.value} at depth ${n}: sums[${n}] = ${h[n]}, count = ${c[n]}`),e(2*t+1,n+1),e(2*t+2,n+1)}(0,0),p>=0&&o.update_visual(`node_${p}`,a(p,"visited"));for(let e=0;e<h.length;e++){let t=h[e]/c[e];f.push(t),l.forEach((t,l)=>{u(l)===e&&o.update_visual(`node_${l}`,a(l,"done"))}),o.update_variable("depth",e),o.update_variable("result",f.map(e=>Number.isInteger(e)?e:parseFloat(e.toFixed(5)))),o.record("compute",`Level ${e} average: ${h[e]} / ${c[e]} = ${r(t)}`)}return o.record("complete",`Average of levels complete: [${f.map(r).join(", ")}]`),o.getSteps()
}

export function AverageOfLevelsInBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AverageOfLevelsInBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAverageOfLevelsInBinaryTreeSteps(e) as any[];
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
      title="Average of Levels in Binary Tree"
      slug="average-of-levels-in-binary-tree"
      approaches={approaches}
      presets={AverageOfLevelsInBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Balanced Binary Tree (balanced-binary-tree)
// ==========================================

const BalancedBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def isBalanced(root):\n    def checkHeight(node):\n        if node is None:\n            return 0\n        leftHeight = checkHeight(node.left)\n        if leftHeight == -1:\n            return -1\n        rightHeight = checkHeight(node.right)\n        if rightHeight == -1:\n            return -1\n        if abs(leftHeight - rightHeight) > 1:\n            return -1\n        return 1 + max(leftHeight, rightHeight)\n    return checkHeight(root) != -1",
    "lineMap": {
      "init": [
        1
      ],
      "start_check": [
        2
      ],
      "base_case_null": [
        4
      ],
      "check_left": [
        5
      ],
      "left_unbalanced": [
        7
      ],
      "check_right": [
        8
      ],
      "right_unbalanced": [
        10
      ],
      "check_balance": [
        11
      ],
      "unbalanced": [
        12
      ],
      "return_height": [
        13
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "left_unbalanced": [
        6
      ],
      "right_unbalanced": [
        9
      ],
      "is_balanced": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isBalanced(TreeNode root) {\n    return checkHeight(root) != -1;\n}\n\nprivate int checkHeight(TreeNode node) {\n    if (node == null) return 0;\n    int leftHeight = checkHeight(node.left);\n    if (leftHeight == -1) return -1;\n    int rightHeight = checkHeight(node.right);\n    if (rightHeight == -1) return -1;\n    if (Math.abs(leftHeight - rightHeight) > 1) return -1;\n    return 1 + Math.max(leftHeight, rightHeight);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_check": [
        5
      ],
      "base_case_null": [
        6
      ],
      "check_left": [
        7
      ],
      "left_unbalanced": [
        8
      ],
      "check_right": [
        9
      ],
      "right_unbalanced": [
        10
      ],
      "check_balance": [
        11
      ],
      "unbalanced": [
        11
      ],
      "return_height": [
        12
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "left_unbalanced": [
        8
      ],
      "right_unbalanced": [
        10
      ],
      "is_balanced": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isBalanced(TreeNode* root) {\n    return checkHeight(root) != -1;\n}\n\nint checkHeight(TreeNode* node) {\n    if (node == nullptr) return 0;\n    int leftHeight = checkHeight(node->left);\n    if (leftHeight == -1) return -1;\n    int rightHeight = checkHeight(node->right);\n    if (rightHeight == -1) return -1;\n    if (abs(leftHeight - rightHeight) > 1) return -1;\n    return 1 + max(leftHeight, rightHeight);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_check": [
        5
      ],
      "base_case_null": [
        6
      ],
      "check_left": [
        7
      ],
      "left_unbalanced": [
        8
      ],
      "check_right": [
        9
      ],
      "right_unbalanced": [
        10
      ],
      "check_balance": [
        11
      ],
      "unbalanced": [
        11
      ],
      "return_height": [
        12
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "left_unbalanced": [
        8
      ],
      "right_unbalanced": [
        10
      ],
      "is_balanced": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsBalanced(TreeNode root) {\n    return CheckHeight(root) != -1;\n}\n\nprivate int CheckHeight(TreeNode node) {\n    if (node == null) return 0;\n    int leftHeight = CheckHeight(node.left);\n    if (leftHeight == -1) return -1;\n    int rightHeight = CheckHeight(node.right);\n    if (rightHeight == -1) return -1;\n    if (Math.Abs(leftHeight - rightHeight) > 1) return -1;\n    return 1 + Math.Max(leftHeight, rightHeight);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_check": [
        5
      ],
      "base_case_null": [
        6
      ],
      "check_left": [
        7
      ],
      "left_unbalanced": [
        8
      ],
      "check_right": [
        9
      ],
      "right_unbalanced": [
        10
      ],
      "check_balance": [
        11
      ],
      "unbalanced": [
        11
      ],
      "return_height": [
        12
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "left_unbalanced": [
        8
      ],
      "right_unbalanced": [
        10
      ],
      "is_balanced": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isBalanced(root *TreeNode) bool {\n    return checkHeight(root) != -1\n}\n\nfunc checkHeight(node *TreeNode) int {\n    if node == nil {\n        return 0\n    }\n    leftHeight := checkHeight(node.Left)\n    if leftHeight == -1 {\n        return -1\n    }\n    rightHeight := checkHeight(node.Right)\n    if rightHeight == -1 {\n        return -1\n    }\n    if abs(leftHeight - rightHeight) > 1 {\n        return -1\n    }\n    return 1 + max(leftHeight, rightHeight)\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_check": [
        5
      ],
      "base_case_null": [
        7
      ],
      "check_left": [
        9
      ],
      "left_unbalanced": [
        11
      ],
      "check_right": [
        13
      ],
      "right_unbalanced": [
        15
      ],
      "check_balance": [
        17
      ],
      "unbalanced": [
        18
      ],
      "return_height": [
        20
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "left_unbalanced": [
        10
      ],
      "right_unbalanced": [
        14
      ],
      "is_balanced": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isBalanced(root) {\n    return checkHeight(root) !== -1;\n}\n\nfunction checkHeight(node) {\n    if (node === null) return 0;\n    const leftHeight = checkHeight(node.left);\n    if (leftHeight === -1) return -1;\n    const rightHeight = checkHeight(node.right);\n    if (rightHeight === -1) return -1;\n    if (Math.abs(leftHeight - rightHeight) > 1) return -1;\n    return 1 + Math.max(leftHeight, rightHeight);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_check": [
        5
      ],
      "base_case_null": [
        6
      ],
      "check_left": [
        7
      ],
      "left_unbalanced": [
        8
      ],
      "check_right": [
        9
      ],
      "right_unbalanced": [
        10
      ],
      "check_balance": [
        11
      ],
      "unbalanced": [
        11
      ],
      "return_height": [
        12
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "left_unbalanced": [
        8
      ],
      "right_unbalanced": [
        10
      ],
      "is_balanced": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isBalanced(root: TreeNode | null): boolean {\n    return checkHeight(root) !== -1;\n}\n\nfunction checkHeight(node: TreeNode | null): number {\n    if (node === null) return 0;\n    const leftHeight: number = checkHeight(node.left);\n    if (leftHeight === -1) return -1;\n    const rightHeight: number = checkHeight(node.right);\n    if (rightHeight === -1) return -1;\n    if (Math.abs(leftHeight - rightHeight) > 1) return -1;\n    return 1 + Math.max(leftHeight, rightHeight);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_check": [
        5
      ],
      "base_case_null": [
        6
      ],
      "check_left": [
        7
      ],
      "left_unbalanced": [
        8
      ],
      "check_right": [
        9
      ],
      "right_unbalanced": [
        10
      ],
      "check_balance": [
        11
      ],
      "unbalanced": [
        11
      ],
      "return_height": [
        12
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "left_unbalanced": [
        8
      ],
      "right_unbalanced": [
        10
      ],
      "is_balanced": [
        11
      ]
    }
  }
};

const BalancedBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Balanced (Example 1)",
    "value": {
      "tree": [
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Unbalanced (Example 2)",
    "value": {
      "tree": [
        1,
        2,
        2,
        3,
        3,
        null,
        null,
        4,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Complete Tree (Balanced)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  }
];

function generateBalancedBinaryTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),i=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(i.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);i.has(t)&&(i.get(e).parent=t,i.get(e).isLeftChild=e%2==1)}let a=(e,t,n)=>{let l=i.get(e),a={type:"binaryTreeNode",value:l.value,parent:void 0!==l.parent?`node_${l.parent}`:void 0,isLeftChild:l.isLeftChild};return t&&(a.state=t),n&&(a.label=n),a},r={};i.forEach((e,t)=>{r[`node_${t}`]=a(t)});let o=new RecursiveStepRecorder({},{...r}),h=i.get(0);o.pushCallFrame({root:(0,_treeHelper848569.kU)(h)},"isBalanced"),o.add_new_global_variable("currentIdx",-1),o.add_new_global_variable("nullIdx",-1),o.record("init","Start: is the tree height-balanced at every node?");let c=new Map,d=[],s=(e,t,i)=>{c.set(e,{state:t,label:i}),o.update_visual(`node_${e}`,a(e,t,i))};if(0===i.size)return o.add_new_global_variable("result",!0),o.record("complete","Empty tree is balanced: return true"),o.popCallFrame(),o.getSteps();o.record("start_check","Compute checkHeight(root)");let u=function e(t){let n=i.has(t);if(o.pushCallFrame({node:n?(0,_treeHelper848569.kU)(i.get(t)):"null"},"checkHeight"),!n)return o.add_conditional("is_null",!0),o.update_global_variable("nullIdx",t),o.record("base_case_null","Null child: height 0"),o.update_global_variable("nullIdx",-1),o.popCallFrame(),0;let a=i.get(t);if(d.length>0){let e=d[d.length-1];s(e,"path",c.get(e)?.label)}d.push(t),s(t,"current"),o.update_global_variable("currentIdx",t),o.update_global_variable("currentVal",a.value),o.add_conditional("is_null",!1),o.record("start_check",`Call checkHeight(${a.value})`);let r=()=>{if(d.pop(),d.length>0){let e=d[d.length-1];s(e,"current",c.get(e)?.label),o.update_global_variable("currentIdx",e),o.update_global_variable("currentVal",i.get(e).value)}else o.update_global_variable("currentIdx",-1)},h=2*t+1;o.record("check_left",`Recurse into the left subtree of ${a.value}`);let u=e(h);if(o.update_frame_variable("leftHeight",u),o.update_global_variable("hl",u),-1===u)return o.add_conditional("left_unbalanced",!0),s(t,"error","-1"),o.record("left_unbalanced",`Left subtree of ${a.value} returned -1: pass it up`),o.popCallFrame(),r(),-1;o.add_conditional("left_unbalanced",!1);let g=2*t+2;o.record("check_right",`Recurse into the right subtree of ${a.value}`);let f=e(g);if(o.update_frame_variable("rightHeight",f),o.update_global_variable("hr",f),-1===f)return o.add_conditional("right_unbalanced",!0),s(t,"error","-1"),o.record("right_unbalanced",`Right subtree of ${a.value} returned -1: pass it up`),o.popCallFrame(),r(),-1;o.add_conditional("right_unbalanced",!1);let p=Math.abs(u-f),b=p<=1;if(o.update_global_variable("hl",u),o.update_global_variable("hr",f),o.update_global_variable("diff",p),s(t,"checking"),o.record("check_balance",`Balance check at ${a.value}: |${u} - ${f}| = ${p} ${b?"<= 1":"> 1"}`),!b)return o.add_conditional("is_balanced",!1),s(t,"error","-1"),o.record("unbalanced",`${p} > 1: node ${a.value} is unbalanced, return -1`),o.popCallFrame(),r(),-1;o.add_conditional("is_balanced",!0);let _=1+Math.max(u,f);return o.update_global_variable("h",_),s(t,"done",`h=${_}`),o.record("return_height",`Node ${a.value} is balanced: height = 1 + max(${u}, ${f}) = ${_}`),o.popCallFrame(),r(),_}(0),g=-1!==u;return o.add_new_global_variable("result",g),o.record("complete",g?`checkHeight(root) = ${u}, not -1: the tree is balanced, return true`:"checkHeight(root) = -1: the tree is NOT balanced, return false"),o.popCallFrame(),o.getSteps()
}

export function BalancedBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BalancedBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBalancedBinaryTreeSteps(e) as any[];
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
      title="Balanced Binary Tree"
      slug="balanced-binary-tree"
      approaches={approaches}
      presets={BalancedBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Boundary of Binary Tree (boundary-of-binary-tree)
// ==========================================

const BoundaryOfBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def boundaryOfBinaryTree(self, root: Optional[TreeNode]) -> List[int]:\n        if not root:\n            return []\n\n        result = [root.val]\n        if not root.left and not root.right:\n            return result\n\n        # Collect left boundary (top-down, excluding leaves)\n        self._collect_left_boundary(root.left, result)\n\n        # Collect all leaves (left to right)\n        self._collect_leaves(root, result)\n\n        # Collect right boundary (bottom-up, excluding leaves)\n        right_boundary = []\n        self._collect_right_boundary(root.right, right_boundary)\n        result.extend(reversed(right_boundary))\n\n        return result\n\n    def _collect_left_boundary(self, node: Optional[TreeNode], result: List[int]) -> None:\n        while node:\n            # Stop if this is a leaf\n            if not node.left and not node.right:\n                break\n            result.append(node.val)\n            # Prefer left child, fall back to right\n            node = node.left if node.left else node.right\n\n    def _collect_leaves(self, node: Optional[TreeNode], result: List[int]) -> None:\n        if not node:\n            return\n        if not node.left and not node.right:\n            result.append(node.val)\n            return\n        self._collect_leaves(node.left, result)\n        self._collect_leaves(node.right, result)\n\n    def _collect_right_boundary(self, node: Optional[TreeNode], result: List[int]) -> None:\n        while node:\n            # Stop if this is a leaf\n            if not node.left and not node.right:\n                break\n            result.append(node.val)\n            # Prefer right child, fall back to left\n            node = node.right if node.right else node.left",
    "lineMap": {
      "-": [
        2
      ],
      "add_root": [
        6
      ],
      "root_is_leaf": [
        7
      ],
      "start_left_boundary": [
        11
      ],
      "visit_left_boundary": [
        24,
        26
      ],
      "add_left_boundary": [
        28,
        30
      ],
      "start_leaves": [
        14
      ],
      "visit_leaf_check": [
        35
      ],
      "add_leaf": [
        36
      ],
      "not_leaf": [
        38,
        39
      ],
      "start_right_boundary": [
        17,
        18
      ],
      "collect_right_boundary": [
        46
      ],
      "add_right_boundary": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_leaf": [
        35
      ],
      "root_leaf": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Integer> boundaryOfBinaryTree(TreeNode root) {\n        List<Integer> result = new ArrayList<>();\n        if (root == null) return result;\n\n        // Root is always included\n        result.add(root.val);\n        if (root.left == null && root.right == null) return result;\n\n        // Collect left boundary (top-down, excluding leaves)\n        collectLeftBoundary(root.left, result);\n\n        // Collect all leaves (left to right)\n        collectLeaves(root, result);\n\n        // Collect right boundary (bottom-up, excluding leaves)\n        List<Integer> rightBoundary = new ArrayList<>();\n        collectRightBoundary(root.right, rightBoundary);\n        for (int i = rightBoundary.size() - 1; i >= 0; i--) {\n            result.add(rightBoundary.get(i));\n        }\n\n        return result;\n    }\n\n    private void collectLeftBoundary(TreeNode node, List<Integer> result) {\n        while (node != null) {\n            // Stop if this is a leaf (leaves are collected separately)\n            if (node.left == null && node.right == null) break;\n            result.add(node.val);\n            // Prefer left child, fall back to right\n            node = (node.left != null) ? node.left : node.right;\n        }\n    }\n\n    private void collectLeaves(TreeNode node, List<Integer> result) {\n        if (node == null) return;\n        if (node.left == null && node.right == null) {\n            result.add(node.val);\n            return;\n        }\n        collectLeaves(node.left, result);\n        collectLeaves(node.right, result);\n    }\n\n    private void collectRightBoundary(TreeNode node, List<Integer> result) {\n        while (node != null) {\n            // Stop if this is a leaf\n            if (node.left == null && node.right == null) break;\n            result.add(node.val);\n            // Prefer right child, fall back to left\n            node = (node.right != null) ? node.right : node.left;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "add_root": [
        7
      ],
      "root_is_leaf": [
        8
      ],
      "start_left_boundary": [
        11
      ],
      "visit_left_boundary": [
        27,
        29
      ],
      "add_left_boundary": [
        30,
        32
      ],
      "start_leaves": [
        14
      ],
      "visit_leaf_check": [
        38
      ],
      "add_leaf": [
        39
      ],
      "not_leaf": [
        42,
        43
      ],
      "start_right_boundary": [
        17,
        18
      ],
      "collect_right_boundary": [
        50
      ],
      "add_right_boundary": [
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_leaf": [
        38
      ],
      "root_leaf": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> boundaryOfBinaryTree(TreeNode* root) {\n        vector<int> result;\n        if (!root) return result;\n\n        result.push_back(root->val);\n        if (!root->left && !root->right) return result;\n\n        // Collect left boundary (top-down, excluding leaves)\n        collectLeftBoundary(root->left, result);\n\n        // Collect all leaves (left to right)\n        collectLeaves(root, result);\n\n        // Collect right boundary (bottom-up, excluding leaves)\n        vector<int> rightBoundary;\n        collectRightBoundary(root->right, rightBoundary);\n        // Cast before subtracting: size() is unsigned and wraps when the list is empty\n        for (int i = static_cast<int>(rightBoundary.size()) - 1; i >= 0; i--) {\n            result.push_back(rightBoundary[i]);\n        }\n\n        return result;\n    }\n\nprivate:\n    void collectLeftBoundary(TreeNode* node, vector<int>& result) {\n        while (node) {\n            // Stop if this is a leaf\n            if (!node->left && !node->right) break;\n            result.push_back(node->val);\n            // Prefer left child, fall back to right\n            node = node->left ? node->left : node->right;\n        }\n    }\n\n    void collectLeaves(TreeNode* node, vector<int>& result) {\n        if (!node) return;\n        if (!node->left && !node->right) {\n            result.push_back(node->val);\n            return;\n        }\n        collectLeaves(node->left, result);\n        collectLeaves(node->right, result);\n    }\n\n    void collectRightBoundary(TreeNode* node, vector<int>& result) {\n        while (node) {\n            // Stop if this is a leaf\n            if (!node->left && !node->right) break;\n            result.push_back(node->val);\n            // Prefer right child, fall back to left\n            node = node->right ? node->right : node->left;\n        }\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "add_root": [
        7
      ],
      "root_is_leaf": [
        8
      ],
      "start_left_boundary": [
        11
      ],
      "visit_left_boundary": [
        29,
        31
      ],
      "add_left_boundary": [
        32,
        34
      ],
      "start_leaves": [
        14
      ],
      "visit_leaf_check": [
        40
      ],
      "add_leaf": [
        41
      ],
      "not_leaf": [
        44,
        45
      ],
      "start_right_boundary": [
        17,
        18
      ],
      "collect_right_boundary": [
        52
      ],
      "add_right_boundary": [
        20,
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_leaf": [
        40
      ],
      "root_leaf": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<int> BoundaryOfBinaryTree(TreeNode root) {\n        List<int> result = new List<int>();\n        if (root == null) return result;\n\n        result.Add(root.val);\n        if (root.left == null && root.right == null) return result;\n\n        // Collect left boundary (top-down, excluding leaves)\n        CollectLeftBoundary(root.left, result);\n\n        // Collect all leaves (left to right)\n        CollectLeaves(root, result);\n\n        // Collect right boundary (bottom-up, excluding leaves)\n        List<int> rightBoundary = new List<int>();\n        CollectRightBoundary(root.right, rightBoundary);\n        for (int i = rightBoundary.Count - 1; i >= 0; i--) {\n            result.Add(rightBoundary[i]);\n        }\n\n        return result;\n    }\n\n    private void CollectLeftBoundary(TreeNode node, List<int> result) {\n        while (node != null) {\n            // Stop if this is a leaf\n            if (node.left == null && node.right == null) break;\n            result.Add(node.val);\n            // Prefer left child, fall back to right\n            node = (node.left != null) ? node.left : node.right;\n        }\n    }\n\n    private void CollectLeaves(TreeNode node, List<int> result) {\n        if (node == null) return;\n        if (node.left == null && node.right == null) {\n            result.Add(node.val);\n            return;\n        }\n        CollectLeaves(node.left, result);\n        CollectLeaves(node.right, result);\n    }\n\n    private void CollectRightBoundary(TreeNode node, List<int> result) {\n        while (node != null) {\n            // Stop if this is a leaf\n            if (node.left == null && node.right == null) break;\n            result.Add(node.val);\n            // Prefer right child, fall back to left\n            node = (node.right != null) ? node.right : node.left;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "add_root": [
        6
      ],
      "root_is_leaf": [
        7
      ],
      "start_left_boundary": [
        10
      ],
      "visit_left_boundary": [
        26,
        28
      ],
      "add_left_boundary": [
        29,
        31
      ],
      "start_leaves": [
        13
      ],
      "visit_leaf_check": [
        37
      ],
      "add_leaf": [
        38
      ],
      "not_leaf": [
        41,
        42
      ],
      "start_right_boundary": [
        16,
        17
      ],
      "collect_right_boundary": [
        49
      ],
      "add_right_boundary": [
        18,
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_leaf": [
        37
      ],
      "root_leaf": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func boundaryOfBinaryTree(root *TreeNode) []int {\n    if root == nil {\n        return []int{}\n    }\n\n    result := []int{root.Val}\n    if root.Left == nil && root.Right == nil {\n        return result\n    }\n\n    // Collect left boundary (top-down, excluding leaves)\n    collectLeftBoundary(root.Left, &result)\n\n    // Collect all leaves (left to right)\n    collectLeaves(root, &result)\n\n    // Collect right boundary (bottom-up, excluding leaves)\n    rightBoundary := []int{}\n    collectRightBoundary(root.Right, &rightBoundary)\n    for i := len(rightBoundary) - 1; i >= 0; i-- {\n        result = append(result, rightBoundary[i])\n    }\n\n    return result\n}\n\nfunc collectLeftBoundary(node *TreeNode, result *[]int) {\n    for node != nil {\n        if node.Left == nil && node.Right == nil {\n            break\n        }\n        *result = append(*result, node.Val)\n        if node.Left != nil {\n            node = node.Left\n        } else {\n            node = node.Right\n        }\n    }\n}\n\nfunc collectLeaves(node *TreeNode, result *[]int) {\n    if node == nil {\n        return\n    }\n    if node.Left == nil && node.Right == nil {\n        *result = append(*result, node.Val)\n        return\n    }\n    collectLeaves(node.Left, result)\n    collectLeaves(node.Right, result)\n}\n\nfunc collectRightBoundary(node *TreeNode, result *[]int) {\n    for node != nil {\n        if node.Left == nil && node.Right == nil {\n            break\n        }\n        *result = append(*result, node.Val)\n        if node.Right != nil {\n            node = node.Right\n        } else {\n            node = node.Left\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "add_root": [
        6
      ],
      "root_is_leaf": [
        7
      ],
      "start_left_boundary": [
        12
      ],
      "visit_left_boundary": [
        28,
        29
      ],
      "add_left_boundary": [
        32,
        34
      ],
      "start_leaves": [
        15
      ],
      "visit_leaf_check": [
        45
      ],
      "add_leaf": [
        46
      ],
      "not_leaf": [
        49,
        50
      ],
      "start_right_boundary": [
        18,
        19
      ],
      "collect_right_boundary": [
        58
      ],
      "add_right_boundary": [
        20,
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_leaf": [
        45
      ],
      "root_leaf": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var boundaryOfBinaryTree = function (root) {\n    if (!root) return [];\n\n    const result = [root.val];\n    if (!root.left && !root.right) return result;\n\n    // Collect left boundary (top-down, excluding leaves)\n    collectLeftBoundary(root.left, result);\n\n    // Collect all leaves (left to right)\n    collectLeaves(root, result);\n\n    // Collect right boundary (bottom-up, excluding leaves)\n    const rightBoundary = [];\n    collectRightBoundary(root.right, rightBoundary);\n    for (let i = rightBoundary.length - 1; i >= 0; i--) {\n        result.push(rightBoundary[i]);\n    }\n\n    return result;\n};\n\nfunction collectLeftBoundary(node, result) {\n    while (node) {\n        if (!node.left && !node.right) break;\n        result.push(node.val);\n        node = node.left ? node.left : node.right;\n    }\n}\n\nfunction collectLeaves(node, result) {\n    if (!node) return;\n    if (!node.left && !node.right) {\n        result.push(node.val);\n        return;\n    }\n    collectLeaves(node.left, result);\n    collectLeaves(node.right, result);\n}\n\nfunction collectRightBoundary(node, result) {\n    while (node) {\n        if (!node.left && !node.right) break;\n        result.push(node.val);\n        node = node.right ? node.right : node.left;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "add_root": [
        4
      ],
      "root_is_leaf": [
        5
      ],
      "start_left_boundary": [
        8
      ],
      "visit_left_boundary": [
        24,
        25
      ],
      "add_left_boundary": [
        26,
        27
      ],
      "start_leaves": [
        11
      ],
      "visit_leaf_check": [
        33
      ],
      "add_leaf": [
        34
      ],
      "not_leaf": [
        37,
        38
      ],
      "start_right_boundary": [
        14,
        15
      ],
      "collect_right_boundary": [
        44
      ],
      "add_right_boundary": [
        16,
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_leaf": [
        33
      ],
      "root_leaf": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function boundaryOfBinaryTree(root: TreeNode | null): number[] {\n    if (!root) return [];\n\n    const result: number[] = [root.val];\n    if (!root.left && !root.right) return result;\n\n    // Collect left boundary (top-down, excluding leaves)\n    collectLeftBoundary(root.left, result);\n\n    // Collect all leaves (left to right)\n    collectLeaves(root, result);\n\n    // Collect right boundary (bottom-up, excluding leaves)\n    const rightBoundary: number[] = [];\n    collectRightBoundary(root.right, rightBoundary);\n    for (let i = rightBoundary.length - 1; i >= 0; i--) {\n        result.push(rightBoundary[i]);\n    }\n\n    return result;\n}\n\nfunction collectLeftBoundary(node: TreeNode | null, result: number[]): void {\n    while (node) {\n        if (!node.left && !node.right) break;\n        result.push(node.val);\n        node = node.left ? node.left : node.right;\n    }\n}\n\nfunction collectLeaves(node: TreeNode | null, result: number[]): void {\n    if (!node) return;\n    if (!node.left && !node.right) {\n        result.push(node.val);\n        return;\n    }\n    collectLeaves(node.left, result);\n    collectLeaves(node.right, result);\n}\n\nfunction collectRightBoundary(node: TreeNode | null, result: number[]): void {\n    while (node) {\n        if (!node.left && !node.right) break;\n        result.push(node.val);\n        node = node.right ? node.right : node.left;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "add_root": [
        4
      ],
      "root_is_leaf": [
        5
      ],
      "start_left_boundary": [
        8
      ],
      "visit_left_boundary": [
        24,
        25
      ],
      "add_left_boundary": [
        26,
        27
      ],
      "start_leaves": [
        11
      ],
      "visit_leaf_check": [
        33
      ],
      "add_leaf": [
        34
      ],
      "not_leaf": [
        37,
        38
      ],
      "start_right_boundary": [
        14,
        15
      ],
      "collect_right_boundary": [
        44
      ],
      "add_right_boundary": [
        16,
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_leaf": [
        33
      ],
      "root_leaf": [
        5
      ]
    }
  }
};

const BoundaryOfBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Simple Right-skewed",
    "value": {
      "tree": [
        1,
        null,
        2,
        null,
        null,
        3,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Standard Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        null,
        null,
        null,
        7,
        8
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Deep Tree",
    "value": {
      "tree": [
        1,
        2,
        7,
        3,
        null,
        null,
        8,
        4,
        null,
        null,
        9,
        null,
        5,
        10,
        null,
        null,
        6
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Small BST",
    "value": {
      "tree": [
        1,
        2,
        3
      ]
    }
  }
];

function generateBoundaryOfBinaryTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),l=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(l.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);l.has(t)&&(l.get(e).parent=t,l.get(e).isLeftChild=e%2==1)}let n=(e,t)=>{let r=l.get(e),o={type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild};return t&&(o.state=t),o},a={};l.forEach((e,t)=>{a[`node_${t}`]=n(t)});let i=new RecursiveStepRecorder({result:[]},{...a}),d=new Set,s=[],u=new Map,f=(e,t)=>{u.set(e,t),i.update_visual(`node_${e}`,n(e,t))},c=e=>{d.add(e),s.push(e),g.push(l.get(e).value),f(e,"boundary"),i.update_global_variable("result",[...g]),i.update_global_variable("boundaryIdxs",[...s])},h=e=>!l.has(2*e+1)&&!l.has(2*e+2);if(i.pushCallFrame({root:(0,_treeHelper848569.kU)(l.get(0))},"boundaryOfBinaryTree"),i.add_new_global_variable("boundaryIdxs",[]),i.add_new_global_variable("phase",""),i.add_new_global_variable("currentIdx",-1),i.record("-","Start: walk the tree's outline anticlockwise from the root"),0===l.size)return i.update_global_variable("result",[]),i.record("complete","Empty tree: return []"),i.popCallFrame(),i.getSteps();let g=[];if(i.update_global_variable("phase","root"),i.update_global_variable("currentIdx",0),c(0),i.record("add_root",`Root ${l.get(0).value} always starts the boundary`),1===l.size)return i.add_conditional("root_leaf",!0),i.record("root_is_leaf",`Root ${l.get(0).value} is a leaf: the boundary is just [${g.join(", ")}]`),i.record("complete",`Boundary = [${g.join(", ")}]`),i.popCallFrame(),i.getSteps();if(i.add_conditional("root_leaf",!1),i.update_global_variable("phase","left"),i.record("start_left_boundary","Left boundary: walk down the left edge, skipping leaves"),l.has(1)){let e=1;for(;!h(e);){f(e,"current"),i.update_global_variable("currentIdx",e),i.record("visit_left_boundary",`On the left edge: ${l.get(e).value}`),c(e),i.record("add_left_boundary",`Add ${l.get(e).value} to the boundary`);let t=2*e+1,r=2*e+2;e=l.has(t)?t:r}}i.update_global_variable("phase","leaves"),i.record("start_leaves","Leaves: collect every leaf, left to right");let p=[];function y(){if(p.length>0){let e=p[p.length-1];d.has(e)||f(e,"current"),i.update_global_variable("currentIdx",e)}else i.update_global_variable("currentIdx",-1)}if(!function e(t){if(!l.has(t))return;let r=l.get(t);if(i.pushCallFrame({node:(0,_treeHelper848569.kU)(r)},"addLeaves"),p.length>0){let e=p[p.length-1];d.has(e)||f(e,"path")}if(p.push(t),d.has(t)||f(t,"current"),i.update_global_variable("currentIdx",t),i.record("visit_leaf_check",`Is ${r.value} a leaf?`),h(t)){i.add_conditional("is_leaf",!0),d.has(t)?i.record("add_leaf",`${r.value} is a leaf, already in the boundary`):(c(t),i.record("add_leaf",`${r.value} is a leaf: add it`)),p.pop(),y(),i.popCallFrame();return}i.add_conditional("is_leaf",!1),i.record("not_leaf",`${r.value} is not a leaf: recurse into its children`);let n=2*t+1;l.has(n)&&e(n);let a=2*t+2;l.has(a)&&e(a),p.pop(),d.has(t)||f(t,"inner"),y(),i.popCallFrame()}(0),i.update_global_variable("phase","right"),i.record("start_right_boundary","Right boundary: walk down the right edge, add it bottom-up"),l.has(2)){let e=[],t=2;for(;!h(t);){d.has(t)||(e.push(t),f(t,"pending"));let r=2*t+2,o=2*t+1;t=l.has(r)?r:o}e.length>0&&(i.update_global_variable("currentIdx",e[e.length-1]),i.record("collect_right_boundary",`Collected ${e.length} right-edge node${1===e.length?"":"s"}: add them in reverse`));for(let t=e.length-1;t>=0;t--){let r=e[t];i.update_global_variable("currentIdx",r),c(r),i.record("add_right_boundary",`Add ${l.get(r).value} (bottom-up)`)}}return i.update_global_variable("phase","done"),i.update_global_variable("currentIdx",-1),i.record("complete",`Boundary = [${g.join(", ")}]`),i.popCallFrame(),i.getSteps()
}

export function BoundaryOfBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BoundaryOfBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBoundaryOfBinaryTreeSteps(e) as any[];
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
      title="Boundary of Binary Tree"
      slug="boundary-of-binary-tree"
      approaches={approaches}
      presets={BoundaryOfBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Check Completeness of a Binary Tree (check-completeness-of-a-binary-tree)
// ==========================================

const CheckCompletenessOfABinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def isCompleteTree(root):\n    queue = deque([root])\n    seen_null = False\n\n    while queue:\n        node = queue.popleft()\n\n        if node is None:\n            seen_null = True\n        else:\n            if seen_null:\n                return False\n            queue.append(node.left)\n            queue.append(node.right)\n\n    return True",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "dequeue": [
        6
      ],
      "node_is_null": [
        8
      ],
      "set_seen_null": [
        9
      ],
      "check_gap": [
        11
      ],
      "return_false": [
        12
      ],
      "enqueue_left": [
        13
      ],
      "enqueue_right": [
        14
      ],
      "return_true": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "while_queue": [
        5
      ],
      "is_null": [
        8
      ],
      "seen_null_and_not_null": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isCompleteTree(TreeNode root) {\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.offer(root);\n    boolean seenNull = false;\n\n    while (!queue.isEmpty()) {\n        TreeNode node = queue.poll();\n\n        if (node == null) {\n            seenNull = true;\n        } else {\n            if (seenNull) return false;\n            queue.offer(node.left);\n            queue.offer(node.right);\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "dequeue": [
        7
      ],
      "node_is_null": [
        9
      ],
      "set_seen_null": [
        10
      ],
      "check_gap": [
        12
      ],
      "return_false": [
        12
      ],
      "enqueue_left": [
        13
      ],
      "enqueue_right": [
        14
      ],
      "return_true": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_queue": [
        6
      ],
      "is_null": [
        9
      ],
      "seen_null_and_not_null": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isCompleteTree(TreeNode* root) {\n    queue<TreeNode*> q;\n    q.push(root);\n    bool seenNull = false;\n\n    while (!q.empty()) {\n        TreeNode* node = q.front();\n        q.pop();\n\n        if (node == nullptr) {\n            seenNull = true;\n        } else {\n            if (seenNull) return false;\n            q.push(node->left);\n            q.push(node->right);\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "dequeue": [
        7,
        8
      ],
      "node_is_null": [
        10
      ],
      "set_seen_null": [
        11
      ],
      "check_gap": [
        13
      ],
      "return_false": [
        13
      ],
      "enqueue_left": [
        14
      ],
      "enqueue_right": [
        15
      ],
      "return_true": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_queue": [
        6
      ],
      "is_null": [
        10
      ],
      "seen_null_and_not_null": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isCompleteTree(root) {\n    const queue = [root];\n    let seenNull = false;\n\n    while (queue.length > 0) {\n        const node = queue.shift();\n\n        if (node === null) {\n            seenNull = true;\n        } else {\n            if (seenNull) return false;\n            queue.push(node.left);\n            queue.push(node.right);\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "dequeue": [
        6
      ],
      "node_is_null": [
        8
      ],
      "set_seen_null": [
        9
      ],
      "check_gap": [
        11
      ],
      "return_false": [
        11
      ],
      "enqueue_left": [
        12
      ],
      "enqueue_right": [
        13
      ],
      "return_true": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_queue": [
        5
      ],
      "is_null": [
        8
      ],
      "seen_null_and_not_null": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isCompleteTree(root: TreeNode | null): boolean {\n    const queue: (TreeNode | null)[] = [root];\n    let seenNull = false;\n\n    while (queue.length > 0) {\n        const node = queue.shift()!;\n\n        if (node === null) {\n            seenNull = true;\n        } else {\n            if (seenNull) return false;\n            queue.push(node.left);\n            queue.push(node.right);\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "dequeue": [
        6
      ],
      "node_is_null": [
        8
      ],
      "set_seen_null": [
        9
      ],
      "check_gap": [
        11
      ],
      "return_false": [
        11
      ],
      "enqueue_left": [
        12
      ],
      "enqueue_right": [
        13
      ],
      "return_true": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_queue": [
        5
      ],
      "is_null": [
        8
      ],
      "seen_null_and_not_null": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isCompleteTree(root *TreeNode) bool {\n    queue := []*TreeNode{root}\n    seenNull := false\n\n    for len(queue) > 0 {\n        node := queue[0]\n        queue = queue[1:]\n\n        if node == nil {\n            seenNull = true\n        } else {\n            if seenNull {\n                return false\n            }\n            queue = append(queue, node.Left)\n            queue = append(queue, node.Right)\n        }\n    }\n\n    return true\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "dequeue": [
        6,
        7
      ],
      "node_is_null": [
        9
      ],
      "set_seen_null": [
        10
      ],
      "check_gap": [
        12
      ],
      "return_false": [
        13
      ],
      "enqueue_left": [
        15
      ],
      "enqueue_right": [
        16
      ],
      "return_true": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_queue": [
        5
      ],
      "is_null": [
        9
      ],
      "seen_null_and_not_null": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsCompleteTree(TreeNode root) {\n    var queue = new Queue<TreeNode>();\n    queue.Enqueue(root);\n    bool seenNull = false;\n\n    while (queue.Count > 0) {\n        TreeNode node = queue.Dequeue();\n\n        if (node == null) {\n            seenNull = true;\n        } else {\n            if (seenNull) return false;\n            queue.Enqueue(node.left);\n            queue.Enqueue(node.right);\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "dequeue": [
        7
      ],
      "node_is_null": [
        9
      ],
      "set_seen_null": [
        10
      ],
      "check_gap": [
        12
      ],
      "return_false": [
        12
      ],
      "enqueue_left": [
        13
      ],
      "enqueue_right": [
        14
      ],
      "return_true": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_queue": [
        6
      ],
      "is_null": [
        9
      ],
      "seen_null_and_not_null": [
        12
      ]
    }
  }
};

const CheckCompletenessOfABinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Incomplete (false)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        null,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Complete (true)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Gap at Level 2 (false)",
    "value": {
      "tree": [
        1,
        2,
        3,
        null,
        5,
        6
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Partial Last Level (true)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  }
];

function generateCheckCompletenessOfABinaryTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),n=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(n.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);n.has(t)&&(n.get(e).parent=t,n.get(e).isLeftChild=e%2==1)}let r=(e,t)=>{let l=n.get(e);return{type:"binaryTreeNode",value:l.value,parent:void 0!==l.parent?`node_${l.parent}`:void 0,isLeftChild:l.isLeftChild,state:t}},u={};n.forEach((e,t)=>{u[`node_${t}`]=r(t)});let a=new StepRecorder({idxMap:{},queue:[],position:0,currentIdx:-1,index:void 0,gapIdx:-1,result:void 0},{...u});if(a.record("start","Start: BFS with (node, index) pairs; the k-th node dequeued must have index k"),0===n.size)return a.update_variable("result",!0),a.record("complete","Empty tree: no nodes to check (the problem guarantees at least one node)"),a.getSteps();let o=e=>e<t.length&&null!==t[e],d={},s=[],h=()=>s.map(e=>n.get(e).value),c=0,p=-1;s.push(0),d[0]=1,a.update_visual("node_0",r(0,"queued")),a.update_variable("idxMap",{...d}),a.update_variable("queue",h()),a.update_variable("position",0),a.record("init","Enqueue (root, index 1); position = 0");let f=!0;for(;s.length>0;){let e=s.shift(),t=n.get(e),l=d[e];c++,p>=0&&a.update_visual(`node_${p}`,r(p,"done")),a.update_visual(`node_${e}`,r(e,"current")),p=e,a.update_variable("queue",h()),a.update_variable("position",c),a.update_variable("currentIdx",e),a.update_variable("index",l),a.record("dequeue",`Dequeue node ${t.value}: index ${l}, position ${c}`);let i=l!==c;if(a.add_conditional("index_mismatch",i),i){f=!1,a.update_visual(`node_${e}`,r(e,"violation")),a.update_variable("gapIdx",c-1),a.update_variable("result",!1),a.record("return_false",`Index ${l} != position ${c}: index ${c} is unoccupied, return false`);break}a.record("match",`Index ${l} == position ${c}, match`);let u=2*e+1,x=2*e+2,g=o(u);if(a.add_conditional("has_left",g),g){let e=n.get(u).value;s.push(u),d[u]=2*l,a.update_visual(`node_${u}`,r(u,"queued")),a.update_variable("idxMap",{...d}),a.update_variable("queue",h()),a.record("enqueue_left",`Left child ${e}: enqueue (${e}, index ${2*l})`)}else a.record("enqueue_left",`Node ${t.value} has no left child, nothing to enqueue`);let m=o(x);if(a.add_conditional("has_right",m),m){let e=n.get(x).value;s.push(x),d[x]=2*l+1,a.update_visual(`node_${x}`,r(x,"queued")),a.update_variable("idxMap",{...d}),a.update_variable("queue",h()),a.record("enqueue_right",`Right child ${e}: enqueue (${e}, index ${2*l+1})`)}else a.record("enqueue_right",`Node ${t.value} has no right child, nothing to enqueue`)}return f&&(p>=0&&a.update_visual(`node_${p}`,r(p,"done")),a.update_variable("currentIdx",-1),a.update_variable("result",!0),a.record("return_true",`Every node's index matched its position (1..${c}), return true`)),a.record("complete",f?"A complete binary tree":"Not a complete binary tree"),a.getSteps()
}

export function CheckCompletenessOfABinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CheckCompletenessOfABinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCheckCompletenessOfABinaryTreeSteps(e) as any[];
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
      title="Check Completeness of a Binary Tree"
      slug="check-completeness-of-a-binary-tree"
      approaches={approaches}
      presets={CheckCompletenessOfABinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Construct Binary Tree from Inorder and Postorder Traversal (construct-binary-tree-from-inorder-and-postorder-traversal)
// ==========================================

const ConstructBinaryTreeFromInorderAndPostorderTraversalTemplates = {
  "python": {
    "language": "python",
    "code": "def buildTree(inorder, postorder):\n    indexMap = {}\n    for i in range(len(inorder)):\n        indexMap[inorder[i]] = i\n    return build(inorder, 0, len(inorder) - 1, postorder, 0, len(postorder) - 1, indexMap)\n\ndef build(inorder, inStart, inEnd, postorder, postStart, postEnd, indexMap):\n    if inStart > inEnd:\n        return None\n    rootVal = postorder[postEnd]\n    root = TreeNode(rootVal)\n    rootIndex = indexMap[rootVal]\n    leftSize = rootIndex - inStart\n    root.left = build(inorder, inStart, rootIndex - 1, postorder, postStart, postStart + leftSize - 1, indexMap)\n    root.right = build(inorder, rootIndex + 1, inEnd, postorder, postStart + leftSize, postEnd - 1, indexMap)\n    return root",
    "lineMap": {
      "start": [
        1
      ],
      "build_map": [
        2,
        3,
        4
      ],
      "call_build": [
        5
      ],
      "check_range": [
        7,
        8
      ],
      "base_case": [
        8,
        9
      ],
      "pick_root": [
        10
      ],
      "create_node": [
        11
      ],
      "find_in_inorder": [
        12
      ],
      "calc_left_size": [
        13
      ],
      "build_left": [
        14
      ],
      "build_right": [
        15
      ],
      "return_node": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "base_case": [
        8
      ],
      "has_left": [
        14
      ],
      "has_right": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private Map<Integer, Integer> indexMap = new HashMap<>();\n    public TreeNode buildTree(int[] inorder, int[] postorder) {\n        for (int i = 0; i < inorder.length; i++) {\n            indexMap.put(inorder[i], i);\n        }\n        return build(inorder, 0, inorder.length - 1, postorder, 0, postorder.length - 1);\n    }\n    private TreeNode build(int[] inorder, int inStart, int inEnd, int[] postorder, int postStart, int postEnd) {\n        if (inStart > inEnd) return null;\n        int rootVal = postorder[postEnd];\n        TreeNode root = new TreeNode(rootVal);\n        int rootIndex = indexMap.get(rootVal);\n        int leftSize = rootIndex - inStart;\n        root.left = build(inorder, inStart, rootIndex - 1, postorder, postStart, postStart + leftSize - 1);\n        root.right = build(inorder, rootIndex + 1, inEnd, postorder, postStart + leftSize, postEnd - 1);\n        return root;\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2,
        3
      ],
      "build_map": [
        4,
        5,
        6
      ],
      "call_build": [
        7
      ],
      "check_range": [
        9,
        10
      ],
      "base_case": [
        10
      ],
      "pick_root": [
        11
      ],
      "create_node": [
        12
      ],
      "find_in_inorder": [
        13
      ],
      "calc_left_size": [
        14
      ],
      "build_left": [
        15
      ],
      "build_right": [
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
      "base_case": [
        10
      ],
      "has_left": [
        15
      ],
      "has_right": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    unordered_map<int, int> indexMap;\n    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {\n        for (int i = 0; i < inorder.size(); i++) {\n            indexMap[inorder[i]] = i;\n        }\n        return build(inorder, 0, inorder.size() - 1, postorder, 0, postorder.size() - 1);\n    }\nprivate:\n    TreeNode* build(vector<int>& inorder, int inStart, int inEnd, vector<int>& postorder, int postStart, int postEnd) {\n        if (inStart > inEnd) return nullptr;\n        int rootVal = postorder[postEnd];\n        TreeNode* root = new TreeNode(rootVal);\n        int rootIndex = indexMap[rootVal];\n        int leftSize = rootIndex - inStart;\n        root->left = build(inorder, inStart, rootIndex - 1, postorder, postStart, postStart + leftSize - 1);\n        root->right = build(inorder, rootIndex + 1, inEnd, postorder, postStart + leftSize, postEnd - 1);\n        return root;\n    }\n};",
    "lineMap": {
      "start": [
        1,
        2,
        3,
        4
      ],
      "build_map": [
        5,
        6,
        7
      ],
      "call_build": [
        8
      ],
      "check_range": [
        11,
        12
      ],
      "base_case": [
        12
      ],
      "pick_root": [
        13
      ],
      "create_node": [
        14
      ],
      "find_in_inorder": [
        15
      ],
      "calc_left_size": [
        16
      ],
      "build_left": [
        17
      ],
      "build_right": [
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
      "base_case": [
        12
      ],
      "has_left": [
        17
      ],
      "has_right": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private Dictionary<int, int> indexMap = new Dictionary<int, int>();\n    public TreeNode BuildTree(int[] inorder, int[] postorder) {\n        for (int i = 0; i < inorder.Length; i++) {\n            indexMap[inorder[i]] = i;\n        }\n        return Build(inorder, 0, inorder.Length - 1, postorder, 0, postorder.Length - 1);\n    }\n    private TreeNode Build(int[] inorder, int inStart, int inEnd, int[] postorder, int postStart, int postEnd) {\n        if (inStart > inEnd) return null;\n        int rootVal = postorder[postEnd];\n        TreeNode root = new TreeNode(rootVal);\n        int rootIndex = indexMap[rootVal];\n        int leftSize = rootIndex - inStart;\n        root.left = Build(inorder, inStart, rootIndex - 1, postorder, postStart, postStart + leftSize - 1);\n        root.right = Build(inorder, rootIndex + 1, inEnd, postorder, postStart + leftSize, postEnd - 1);\n        return root;\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2,
        3
      ],
      "build_map": [
        4,
        5,
        6
      ],
      "call_build": [
        7
      ],
      "check_range": [
        9,
        10
      ],
      "base_case": [
        10
      ],
      "pick_root": [
        11
      ],
      "create_node": [
        12
      ],
      "find_in_inorder": [
        13
      ],
      "calc_left_size": [
        14
      ],
      "build_left": [
        15
      ],
      "build_right": [
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
      "base_case": [
        10
      ],
      "has_left": [
        15
      ],
      "has_right": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func buildTree(inorder []int, postorder []int) *TreeNode {\n    indexMap := make(map[int]int)\n    for i, v := range inorder {\n        indexMap[v] = i\n    }\n    return build(inorder, 0, len(inorder)-1, postorder, 0, len(postorder)-1, indexMap)\n}\n\nfunc build(inorder []int, inStart, inEnd int, postorder []int, postStart, postEnd int, indexMap map[int]int) *TreeNode {\n    if inStart > inEnd {\n        return nil\n    }\n    rootVal := postorder[postEnd]\n    root := &TreeNode{Val: rootVal}\n    rootIndex := indexMap[rootVal]\n    leftSize := rootIndex - inStart\n    root.Left = build(inorder, inStart, rootIndex-1, postorder, postStart, postStart+leftSize-1, indexMap)\n    root.Right = build(inorder, rootIndex+1, inEnd, postorder, postStart+leftSize, postEnd-1, indexMap)\n    return root\n}",
    "lineMap": {
      "start": [
        1
      ],
      "build_map": [
        2,
        3,
        4
      ],
      "call_build": [
        6
      ],
      "check_range": [
        9,
        10
      ],
      "base_case": [
        10,
        11
      ],
      "pick_root": [
        13
      ],
      "create_node": [
        14
      ],
      "find_in_inorder": [
        15
      ],
      "calc_left_size": [
        16
      ],
      "build_left": [
        17
      ],
      "build_right": [
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
      "base_case": [
        10
      ],
      "has_left": [
        17
      ],
      "has_right": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function buildTree(inorder, postorder) {\n    const indexMap = new Map();\n    for (let i = 0; i < inorder.length; i++) {\n        indexMap.set(inorder[i], i);\n    }\n    return build(inorder, 0, inorder.length - 1, postorder, 0, postorder.length - 1, indexMap);\n}\n\nfunction build(inorder, inStart, inEnd, postorder, postStart, postEnd, indexMap) {\n    if (inStart > inEnd) return null;\n    const rootVal = postorder[postEnd];\n    const root = new TreeNode(rootVal);\n    const rootIndex = indexMap.get(rootVal);\n    const leftSize = rootIndex - inStart;\n    root.left = build(inorder, inStart, rootIndex - 1, postorder, postStart, postStart + leftSize - 1, indexMap);\n    root.right = build(inorder, rootIndex + 1, inEnd, postorder, postStart + leftSize, postEnd - 1, indexMap);\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "build_map": [
        2,
        3,
        4
      ],
      "call_build": [
        6
      ],
      "check_range": [
        9,
        10
      ],
      "base_case": [
        10
      ],
      "pick_root": [
        11
      ],
      "create_node": [
        12
      ],
      "find_in_inorder": [
        13
      ],
      "calc_left_size": [
        14
      ],
      "build_left": [
        15
      ],
      "build_right": [
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
      "base_case": [
        10
      ],
      "has_left": [
        15
      ],
      "has_right": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function buildTree(inorder: number[], postorder: number[]): TreeNode | null {\n    const indexMap = new Map<number, number>();\n    for (let i = 0; i < inorder.length; i++) {\n        indexMap.set(inorder[i], i);\n    }\n    return build(inorder, 0, inorder.length - 1, postorder, 0, postorder.length - 1, indexMap);\n}\n\nfunction build(inorder: number[], inStart: number, inEnd: number, postorder: number[], postStart: number, postEnd: number, indexMap: Map<number, number>): TreeNode | null {\n    if (inStart > inEnd) return null;\n    const rootVal = postorder[postEnd];\n    const root = new TreeNode(rootVal);\n    const rootIndex = indexMap.get(rootVal)!;\n    const leftSize = rootIndex - inStart;\n    root.left = build(inorder, inStart, rootIndex - 1, postorder, postStart, postStart + leftSize - 1, indexMap);\n    root.right = build(inorder, rootIndex + 1, inEnd, postorder, postStart + leftSize, postEnd - 1, indexMap);\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "build_map": [
        2,
        3,
        4
      ],
      "call_build": [
        6
      ],
      "check_range": [
        9,
        10
      ],
      "base_case": [
        10
      ],
      "pick_root": [
        11
      ],
      "create_node": [
        12
      ],
      "find_in_inorder": [
        13
      ],
      "calc_left_size": [
        14
      ],
      "build_left": [
        15
      ],
      "build_right": [
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
      "base_case": [
        10
      ],
      "has_left": [
        15
      ],
      "has_right": [
        16
      ]
    }
  }
};

const ConstructBinaryTreeFromInorderAndPostorderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "inorder": [
        9,
        3,
        15,
        20,
        7
      ],
      "postorder": [
        9,
        15,
        7,
        20,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Balanced",
    "value": {
      "inorder": [
        4,
        2,
        5,
        1,
        6,
        3,
        7
      ],
      "postorder": [
        4,
        5,
        2,
        6,
        7,
        3,
        1
      ]
    }
  }
];

function generateConstructBinaryTreeFromInorderAndPostorderTraversalSteps(e: any): any[] {
  
let t=e.inorder||[],r=e.postorder||[],n=(e,r)=>({type:"arrayElement",value:t[e],position:e,state:r}),i=(e,o)=>({type:"arrayElement",value:r[e],position:e+t.length+1,state:o}),a={};t.forEach((e,t)=>{a[`in_${t}`]=n(t)}),r.forEach((e,t)=>{a[`post_${t}`]=i(t)});let d=new StepRecorder({inStart:void 0,inEnd:void 0,postStart:void 0,postEnd:void 0,rootValue:void 0,rootIndex:void 0,leftSize:void 0,scanIdx:void 0},{...a});if(d.record("start","Start: build the tree, finding each root by scanning inorder"),0===t.length)return d.record("complete","Empty arrays: return null"),d.getSteps();let l=0;return!function e(o,a,s,u,p,c){if(o>a)return d.add_conditional("base_case",!0),null;d.add_conditional("base_case",!1),d.update_variable("inStart",o),d.update_variable("inEnd",a),d.update_variable("postStart",s),d.update_variable("postEnd",u),d.update_variable("scanIdx",-1);for(let e=o;e<=a;e++)d.update_visual(`in_${e}`,n(e,"highlight"));for(let e=s;e<=u;e++)d.update_visual(`post_${e}`,i(e,"highlight"));let h=r[u];d.update_variable("rootValue",h),d.update_visual(`post_${u}`,i(u,"active")),d.record("pick_root",`Pick root: postorder[${u}] = ${h}`);let _=o;for(let e=o;e<=a;e++){d.update_visual(`in_${e}`,n(e,"comparing")),d.update_variable("scanIdx",e);let r=t[e]===h;if(d.record("scan",r?`inorder[${e}] = ${t[e]} = root`:`inorder[${e}] = ${t[e]} != ${h}, keep scanning`),r){_=e;break}d.update_visual(`in_${e}`,n(e,"highlight"))}d.update_variable("rootIndex",_),d.update_visual(`in_${_}`,n(_,"active")),d.record("find_in_inorder",`Found ${h} at inorder index ${_}`);let g=_-o;d.update_variable("leftSize",g),d.record("calc_left_size",`Left subtree size: ${_} - ${o} = ${g}`);let f=l++;d.add_new_visual(`node_${f}`,{type:"binaryTreeNode",value:h,parent:void 0!==p?`node_${p}`:void 0,isLeftChild:c,state:"active"}),d.record("create_node",`Create tree node ${h}`),d.update_visual(`post_${u}`,i(u,"result")),d.update_visual(`in_${_}`,n(_,"result"));for(let e=o;e<=a;e++)e!==_&&d.update_visual(`in_${e}`,n(e));for(let e=s;e<u;e++)d.update_visual(`post_${e}`,i(e));return d.record("build_left",`Build left subtree: inorder[${o}..${_-1}], postorder[${s}..${s+g-1}]`),e(o,_-1,s,s+g-1,f,!0),d.record("build_right",`Build right subtree: inorder[${_+1}..${a}], postorder[${s+g}..${u-1}]`),e(_+1,a,s+g,u-1,f,!1),d.update_visual(`node_${f}`,{type:"binaryTreeNode",value:h,parent:void 0!==p?`node_${p}`:void 0,isLeftChild:c,state:"visited"}),d.record("return_node",`Node ${h} placed with its subtrees`),f}(0,t.length-1,0,r.length-1),d.update_variable("inStart",void 0),d.update_variable("inEnd",void 0),d.update_variable("postStart",void 0),d.update_variable("postEnd",void 0),d.update_variable("rootValue",void 0),d.update_variable("rootIndex",void 0),d.update_variable("leftSize",void 0),d.update_variable("scanIdx",void 0),d.record("complete","Binary tree construction complete!"),d.getSteps()
}

export function ConstructBinaryTreeFromInorderAndPostorderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ConstructBinaryTreeFromInorderAndPostorderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateConstructBinaryTreeFromInorderAndPostorderTraversalSteps(e) as any[];
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
      title="Construct Binary Tree from Inorder and Postorder Traversal"
      slug="construct-binary-tree-from-inorder-and-postorder-traversal"
      approaches={approaches}
      presets={ConstructBinaryTreeFromInorderAndPostorderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Construct Binary Tree from Preorder and Inorder Traversal (construct-binary-tree-from-preorder-and-inorder-traversal)
// ==========================================

const ConstructBinaryTreeFromPreorderAndInorderTraversalTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def buildTree(self, preorder, inorder):\n        inorder_map = {}\n        for i, val in enumerate(inorder):\n            inorder_map[val] = i\n\n        def build(pre_start, pre_end, in_start, in_end):\n            if pre_start > pre_end:\n                return None\n            root = TreeNode(preorder[pre_start])\n            root_index = inorder_map[preorder[pre_start]]\n            left_size = root_index - in_start\n            root.left = build(pre_start + 1, pre_start + left_size, in_start, root_index - 1)\n            root.right = build(pre_start + left_size + 1, pre_end, root_index + 1, in_end)\n            return root\n\n        return build(0, len(preorder) - 1, 0, len(inorder) - 1)",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "build_map": [
        3,
        4,
        5
      ],
      "pick_root": [
        10
      ],
      "find_in_inorder": [
        11
      ],
      "calc_left_size": [
        12
      ],
      "create_node": [
        10
      ],
      "build_left": [
        13
      ],
      "build_right": [
        14
      ],
      "place_node": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "base_case": [
        8,
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private HashMap<Integer, Integer> inorderMap;\n    public TreeNode buildTree(int[] preorder, int[] inorder) {\n        inorderMap = new HashMap<>();\n        for (int i = 0; i < inorder.length; i++) {\n            inorderMap.put(inorder[i], i);\n        }\n        return build(preorder, 0, preorder.length - 1, 0, inorder.length - 1);\n    }\n    private TreeNode build(int[] preorder, int preStart, int preEnd, int inStart, int inEnd) {\n        if (preStart > preEnd) return null;\n        TreeNode root = new TreeNode(preorder[preStart]);\n        int rootIndex = inorderMap.get(preorder[preStart]);\n        int leftSize = rootIndex - inStart;\n        root.left = build(preorder, preStart + 1, preStart + leftSize, inStart, rootIndex - 1);\n        root.right = build(preorder, preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);\n        return root;\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "build_map": [
        4,
        5,
        6
      ],
      "pick_root": [
        12
      ],
      "find_in_inorder": [
        13
      ],
      "calc_left_size": [
        14
      ],
      "create_node": [
        12
      ],
      "build_left": [
        15
      ],
      "build_right": [
        16
      ],
      "place_node": [
        17
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "base_case": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\nprivate:\n    unordered_map<int, int> inorderMap;\n    TreeNode* build(vector<int>& preorder, int preStart, int preEnd, int inStart, int inEnd) {\n        if (preStart > preEnd) return nullptr;\n        TreeNode* root = new TreeNode(preorder[preStart]);\n        int rootIndex = inorderMap[preorder[preStart]];\n        int leftSize = rootIndex - inStart;\n        root->left = build(preorder, preStart + 1, preStart + leftSize, inStart, rootIndex - 1);\n        root->right = build(preorder, preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);\n        return root;\n    }\npublic:\n    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {\n        for (int i = 0; i < inorder.size(); i++) {\n            inorderMap[inorder[i]] = i;\n        }\n        return build(preorder, 0, preorder.size() - 1, 0, inorder.size() - 1);\n    }\n};",
    "lineMap": {
      "start": [
        1,
        2,
        3
      ],
      "build_map": [
        15,
        16
      ],
      "pick_root": [
        6
      ],
      "find_in_inorder": [
        7
      ],
      "calc_left_size": [
        8
      ],
      "create_node": [
        6
      ],
      "build_left": [
        9
      ],
      "build_right": [
        10
      ],
      "place_node": [
        11
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "base_case": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private Dictionary<int, int> inorderMap;\n    public TreeNode BuildTree(int[] preorder, int[] inorder) {\n        inorderMap = new Dictionary<int, int>();\n        for (int i = 0; i < inorder.Length; i++) {\n            inorderMap[inorder[i]] = i;\n        }\n        return Build(preorder, 0, preorder.Length - 1, 0, inorder.Length - 1);\n    }\n    private TreeNode Build(int[] preorder, int preStart, int preEnd, int inStart, int inEnd) {\n        if (preStart > preEnd) return null;\n        TreeNode root = new TreeNode(preorder[preStart]);\n        int rootIndex = inorderMap[preorder[preStart]];\n        int leftSize = rootIndex - inStart;\n        root.left = Build(preorder, preStart + 1, preStart + leftSize, inStart, rootIndex - 1);\n        root.right = Build(preorder, preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);\n        return root;\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "build_map": [
        4,
        5,
        6
      ],
      "pick_root": [
        12
      ],
      "find_in_inorder": [
        13
      ],
      "calc_left_size": [
        14
      ],
      "create_node": [
        12
      ],
      "build_left": [
        15
      ],
      "build_right": [
        16
      ],
      "place_node": [
        17
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "base_case": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func buildTree(preorder []int, inorder []int) *TreeNode {\n    inorderMap := make(map[int]int)\n    for i, v := range inorder {\n        inorderMap[v] = i\n    }\n    var build func(preStart, preEnd, inStart, inEnd int) *TreeNode\n    build = func(preStart, preEnd, inStart, inEnd int) *TreeNode {\n        if preStart > preEnd { return nil }\n        rootVal := preorder[preStart]\n        root := &TreeNode{Val: rootVal}\n        rootIndex := inorderMap[rootVal]\n        leftSize := rootIndex - inStart\n        root.Left = build(preStart+1, preStart+leftSize, inStart, rootIndex-1)\n        root.Right = build(preStart+leftSize+1, preEnd, rootIndex+1, inEnd)\n        return root\n    }\n    return build(0, len(preorder)-1, 0, len(inorder)-1)\n}",
    "lineMap": {
      "start": [
        1
      ],
      "build_map": [
        2,
        3,
        4
      ],
      "pick_root": [
        9,
        10
      ],
      "find_in_inorder": [
        11
      ],
      "calc_left_size": [
        12
      ],
      "create_node": [
        10
      ],
      "build_left": [
        13
      ],
      "build_right": [
        14
      ],
      "place_node": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "base_case": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function buildTree(preorder, inorder) {\n    const inorderMap = new Map();\n    for (let i = 0; i < inorder.length; i++) {\n        inorderMap.set(inorder[i], i);\n    }\n    function build(preStart, preEnd, inStart, inEnd) {\n        if (preStart > preEnd) return null;\n        const root = new TreeNode(preorder[preStart]);\n        const rootIndex = inorderMap.get(preorder[preStart]);\n        const leftSize = rootIndex - inStart;\n        root.left = build(preStart + 1, preStart + leftSize, inStart, rootIndex - 1);\n        root.right = build(preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);\n        return root;\n    }\n    return build(0, preorder.length - 1, 0, inorder.length - 1);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "build_map": [
        2,
        3,
        4
      ],
      "pick_root": [
        8
      ],
      "find_in_inorder": [
        9
      ],
      "calc_left_size": [
        10
      ],
      "create_node": [
        8
      ],
      "build_left": [
        11
      ],
      "build_right": [
        12
      ],
      "place_node": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "base_case": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function buildTree(preorder: number[], inorder: number[]): TreeNode | null {\n    const inorderMap = new Map<number, number>();\n    for (let i = 0; i < inorder.length; i++) {\n        inorderMap.set(inorder[i], i);\n    }\n    function build(preStart: number, preEnd: number, inStart: number, inEnd: number): TreeNode | null {\n        if (preStart > preEnd) return null;\n        const root = new TreeNode(preorder[preStart]);\n        const rootIndex = inorderMap.get(preorder[preStart])!;\n        const leftSize = rootIndex - inStart;\n        root.left = build(preStart + 1, preStart + leftSize, inStart, rootIndex - 1);\n        root.right = build(preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);\n        return root;\n    }\n    return build(0, preorder.length - 1, 0, inorder.length - 1);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "build_map": [
        2,
        3,
        4
      ],
      "pick_root": [
        8
      ],
      "find_in_inorder": [
        9
      ],
      "calc_left_size": [
        10
      ],
      "create_node": [
        8
      ],
      "build_left": [
        11
      ],
      "build_right": [
        12
      ],
      "place_node": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "base_case": [
        7
      ]
    }
  }
};

const ConstructBinaryTreeFromPreorderAndInorderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "preorder": [
        3,
        9,
        20,
        15,
        7
      ],
      "inorder": [
        9,
        3,
        15,
        20,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "preorder": [
        1,
        2,
        4,
        5,
        3
      ],
      "inorder": [
        4,
        2,
        5,
        1,
        3
      ]
    }
  }
];

function generateConstructBinaryTreeFromPreorderAndInorderTraversalSteps(e: any): any[] {
  
let r=e.preorder||[],t=e.inorder||[],i={};for(let e=0;e<r.length;e++)i[`preorder_${e}`]={type:"arrayElement",value:r[e],position:e};for(let e=0;e<t.length;e++)i[`inorder_${e}`]={type:"arrayElement",value:t[e],position:e};let o=new StepRecorder({preStart:void 0,preEnd:void 0,inStart:void 0,inEnd:void 0,rootValue:void 0,rootIndex:void 0,leftSize:void 0,scanIdx:void 0},{...i});if(o.record("start","Start: build the tree, finding each root by scanning inorder"),0===r.length)return o.record("complete","Empty arrays: return null"),o.getSteps();let a=(e,r,t,n)=>({type:"arrayElement",value:r,position:t,state:n}),d=0;return!function e(n,i,l,p,s,u){if(n>i)return o.add_conditional("base_case",!0),null;o.add_conditional("base_case",!1),o.update_variable("preStart",n),o.update_variable("preEnd",i),o.update_variable("inStart",l),o.update_variable("inEnd",p),o.update_variable("scanIdx",-1);for(let e=n;e<=i;e++)o.update_visual(`preorder_${e}`,a(`preorder_${e}`,r[e],e,e===n?"active":"highlight"));for(let e=l;e<=p;e++)o.update_visual(`inorder_${e}`,a(`inorder_${e}`,t[e],e,"highlight"));let c=r[n];o.update_variable("rootValue",c),o.record("pick_root",`Pick root: preorder[${n}] = ${c}`);let h=l;for(let e=l;e<=p;e++){o.update_visual(`inorder_${e}`,a(`inorder_${e}`,t[e],e,"comparing")),o.update_variable("scanIdx",e);let r=t[e]===c;if(o.record("scan",r?`inorder[${e}] = ${t[e]} = root`:`inorder[${e}] = ${t[e]} != ${c}, keep scanning`),r){h=e;break}o.update_visual(`inorder_${e}`,a(`inorder_${e}`,t[e],e,"highlight"))}o.update_variable("rootIndex",h),o.update_visual(`inorder_${h}`,a(`inorder_${h}`,t[h],h,"active")),o.record("find_in_inorder",`Found ${c} at inorder index ${h}`);let _=h-l;o.update_variable("leftSize",_),o.record("calc_left_size",`Left subtree size: ${h} - ${l} = ${_}`);let f=`node_${d}`;return d++,o.add_new_visual(f,{type:"binaryTreeNode",value:c,parent:s,isLeftChild:u,state:"active"}),o.record("create_node",`Create tree node ${c}`),o.update_visual(`preorder_${n}`,a(`preorder_${n}`,r[n],n,"result")),o.update_visual(`inorder_${h}`,a(`inorder_${h}`,t[h],h,"result")),o.record("build_left",`Build left subtree: preorder[${n+1}..${n+_}], inorder[${l}..${h-1}]`),e(n+1,n+_,l,h-1,f,!0),o.record("build_right",`Build right subtree: preorder[${n+_+1}..${i}], inorder[${h+1}..${p}]`),e(n+_+1,i,h+1,p,f,!1),o.update_visual(f,{type:"binaryTreeNode",value:c,parent:s,isLeftChild:u,state:"result"}),o.record("place_node",`Node ${c} placed with its subtrees`),f}(0,r.length-1,0,t.length-1),o.update_variable("preStart",void 0),o.update_variable("preEnd",void 0),o.update_variable("inStart",void 0),o.update_variable("inEnd",void 0),o.update_variable("rootValue",void 0),o.update_variable("rootIndex",void 0),o.update_variable("leftSize",void 0),o.update_variable("scanIdx",void 0),o.record("complete","Binary tree construction complete!"),o.getSteps()
}

export function ConstructBinaryTreeFromPreorderAndInorderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ConstructBinaryTreeFromPreorderAndInorderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateConstructBinaryTreeFromPreorderAndInorderTraversalSteps(e) as any[];
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
      title="Construct Binary Tree from Preorder and Inorder Traversal"
      slug="construct-binary-tree-from-preorder-and-inorder-traversal"
      approaches={approaches}
      presets={ConstructBinaryTreeFromPreorderAndInorderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Construct Quad Tree (construct-quad-tree)
// ==========================================

const ConstructQuadTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def construct(self, grid: list[list[int]]) -> Node:\n        n = len(grid)\n        # Build 2D prefix sum (1-indexed)\n        prefix = [[0] * (n + 1) for _ in range(n + 1)]\n        for i in range(1, n + 1):\n            for j in range(1, n + 1):\n                prefix[i][j] = (grid[i - 1][j - 1]\n                    + prefix[i - 1][j] + prefix[i][j - 1]\n                    - prefix[i - 1][j - 1])\n\n        def region_sum(row, col, size):\n            return (prefix[row + size][col + size]\n                - prefix[row][col + size]\n                - prefix[row + size][col]\n                + prefix[row][col])\n\n        def build(row, col, size):\n            total = size * size\n            s = region_sum(row, col, size)\n\n            # All zeros or all ones → leaf node\n            if s == 0:\n                return Node(False, True)\n            if s == total:\n                return Node(True, True)\n\n            # Mixed → subdivide into four quadrants\n            half = size // 2\n            top_left = build(row, col, half)\n            top_right = build(row, col + half, half)\n            bottom_left = build(row + half, col, half)\n            bottom_right = build(row + half, col + half, half)\n\n            return Node(True, False, top_left, top_right, bottom_left, bottom_right)\n\n        return build(0, 0, n)",
    "lineMap": {
      "-": [
        2
      ],
      "build_prefix": [
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "calc_sum": [
        12,
        13,
        14,
        15,
        16
      ],
      "check_region": [
        18,
        19,
        20
      ],
      "leaf_true": [
        23,
        24,
        25,
        26
      ],
      "leaf_false": [
        23,
        25
      ],
      "subdivide": [
        29,
        30,
        31,
        32,
        33
      ],
      "return_internal": [
        35
      ],
      "call_build": [
        37
      ],
      "complete": [
        37
      ],
      "build_tl": [
        30
      ],
      "build_tr": [
        31
      ],
      "build_bl": [
        32
      ],
      "build_br": [
        33
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int[][] prefix;\n\n    public Node construct(int[][] grid) {\n        int n = grid.length;\n        // Build 2D prefix sum (1-indexed)\n        prefix = new int[n + 1][n + 1];\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= n; j++) {\n                prefix[i][j] = grid[i - 1][j - 1]\n                    + prefix[i - 1][j] + prefix[i][j - 1]\n                    - prefix[i - 1][j - 1];\n            }\n        }\n        return build(0, 0, n);\n    }\n\n    private int regionSum(int row, int col, int size) {\n        // Sum of sub-grid from (row, col) to (row+size-1, col+size-1)\n        return prefix[row + size][col + size]\n            - prefix[row][col + size]\n            - prefix[row + size][col]\n            + prefix[row][col];\n    }\n\n    private Node build(int row, int col, int size) {\n        int sum = regionSum(row, col, size);\n        int total = size * size;\n\n        // All zeros or all ones → leaf node\n        if (sum == 0) return new Node(false, true);\n        if (sum == total) return new Node(true, true);\n\n        // Mixed → subdivide into four quadrants\n        int half = size / 2;\n        Node topLeft = build(row, col, half);\n        Node topRight = build(row, col + half, half);\n        Node bottomLeft = build(row + half, col, half);\n        Node bottomRight = build(row + half, col + half, half);\n\n        return new Node(true, false, topLeft, topRight, bottomLeft, bottomRight);\n    }\n}",
    "lineMap": {
      "-": [
        1,
        4
      ],
      "build_prefix": [
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "calc_sum": [
        18,
        19,
        20,
        21,
        22,
        23
      ],
      "check_region": [
        26,
        27,
        28
      ],
      "leaf_true": [
        31,
        32
      ],
      "leaf_false": [
        31,
        32
      ],
      "subdivide": [
        35,
        36,
        37,
        38,
        39
      ],
      "return_internal": [
        41
      ],
      "call_build": [
        15
      ],
      "complete": [
        15
      ],
      "build_tl": [
        36
      ],
      "build_tr": [
        37
      ],
      "build_bl": [
        38
      ],
      "build_br": [
        39
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<int>> prefix;\n\n    Node* construct(vector<vector<int>>& grid) {\n        int n = grid.size();\n        // Build 2D prefix sum (1-indexed)\n        prefix.assign(n + 1, vector<int>(n + 1, 0));\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= n; j++) {\n                prefix[i][j] = grid[i - 1][j - 1]\n                    + prefix[i - 1][j] + prefix[i][j - 1]\n                    - prefix[i - 1][j - 1];\n            }\n        }\n        return build(0, 0, n);\n    }\n\n    int regionSum(int row, int col, int size) {\n        return prefix[row + size][col + size]\n            - prefix[row][col + size]\n            - prefix[row + size][col]\n            + prefix[row][col];\n    }\n\n    Node* build(int row, int col, int size) {\n        int sum = regionSum(row, col, size);\n        int total = size * size;\n\n        // All zeros or all ones → leaf node\n        if (sum == 0) return new Node(false, true);\n        if (sum == total) return new Node(true, true);\n\n        // Mixed → subdivide into four quadrants\n        int half = size / 2;\n        Node* topLeft = build(row, col, half);\n        Node* topRight = build(row, col + half, half);\n        Node* bottomLeft = build(row + half, col, half);\n        Node* bottomRight = build(row + half, col + half, half);\n\n        return new Node(true, false, topLeft, topRight, bottomLeft, bottomRight);\n    }\n};",
    "lineMap": {
      "-": [
        5
      ],
      "build_prefix": [
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "calc_sum": [
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "check_region": [
        26,
        27,
        28
      ],
      "leaf_true": [
        31,
        32
      ],
      "leaf_false": [
        31,
        32
      ],
      "subdivide": [
        35,
        36,
        37,
        38,
        39
      ],
      "return_internal": [
        41
      ],
      "call_build": [
        16
      ],
      "complete": [
        16
      ],
      "build_tl": [
        36
      ],
      "build_tr": [
        37
      ],
      "build_bl": [
        38
      ],
      "build_br": [
        39
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int[,] prefix;\n\n    public Node Construct(int[][] grid) {\n        int n = grid.Length;\n        // Build 2D prefix sum (1-indexed)\n        prefix = new int[n + 1, n + 1];\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= n; j++) {\n                prefix[i, j] = grid[i - 1][j - 1]\n                    + prefix[i - 1, j] + prefix[i, j - 1]\n                    - prefix[i - 1, j - 1];\n            }\n        }\n        return Build(0, 0, n);\n    }\n\n    private int RegionSum(int row, int col, int size) {\n        return prefix[row + size, col + size]\n            - prefix[row, col + size]\n            - prefix[row + size, col]\n            + prefix[row, col];\n    }\n\n    private Node Build(int row, int col, int size) {\n        int sum = RegionSum(row, col, size);\n        int total = size * size;\n\n        // All zeros or all ones → leaf node\n        if (sum == 0) return new Node(false, true);\n        if (sum == total) return new Node(true, true);\n\n        // Mixed → subdivide into four quadrants\n        int half = size / 2;\n        Node topLeft = Build(row, col, half);\n        Node topRight = Build(row, col + half, half);\n        Node bottomLeft = Build(row + half, col, half);\n        Node bottomRight = Build(row + half, col + half, half);\n\n        return new Node(true, false, topLeft, topRight, bottomLeft, bottomRight);\n    }\n}",
    "lineMap": {
      "-": [
        1,
        4
      ],
      "build_prefix": [
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "calc_sum": [
        18,
        19,
        20,
        21,
        22,
        23
      ],
      "check_region": [
        25,
        26,
        27
      ],
      "leaf_true": [
        30,
        31
      ],
      "leaf_false": [
        30,
        31
      ],
      "subdivide": [
        34,
        35,
        36,
        37,
        38
      ],
      "return_internal": [
        40
      ],
      "call_build": [
        15
      ],
      "complete": [
        15
      ],
      "build_tl": [
        35
      ],
      "build_tr": [
        36
      ],
      "build_bl": [
        37
      ],
      "build_br": [
        38
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func construct(grid [][]int) *Node {\n    n := len(grid)\n    // Build 2D prefix sum (1-indexed)\n    prefix := make([][]int, n+1)\n    for i := range prefix {\n        prefix[i] = make([]int, n+1)\n    }\n    for i := 1; i <= n; i++ {\n        for j := 1; j <= n; j++ {\n            prefix[i][j] = grid[i-1][j-1] +\n                prefix[i-1][j] + prefix[i][j-1] -\n                prefix[i-1][j-1]\n        }\n    }\n\n    regionSum := func(row, col, size int) int {\n        return prefix[row+size][col+size] -\n            prefix[row][col+size] -\n            prefix[row+size][col] +\n            prefix[row][col]\n    }\n\n    var build func(row, col, size int) *Node\n    build = func(row, col, size int) *Node {\n        sum := regionSum(row, col, size)\n        total := size * size\n\n        // All zeros or all ones → leaf node\n        if sum == 0 {\n            return &Node{Val: false, IsLeaf: true}\n        }\n        if sum == total {\n            return &Node{Val: true, IsLeaf: true}\n        }\n\n        // Mixed → subdivide into four quadrants\n        half := size / 2\n        topLeft := build(row, col, half)\n        topRight := build(row, col+half, half)\n        bottomLeft := build(row+half, col, half)\n        bottomRight := build(row+half, col+half, half)\n\n        return &Node{Val: true, IsLeaf: false,\n            TopLeft: topLeft, TopRight: topRight,\n            BottomLeft: bottomLeft, BottomRight: bottomRight}\n    }\n\n    return build(0, 0, n)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "calc_sum": [
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "check_region": [
        24,
        25,
        26
      ],
      "leaf_true": [
        29,
        30,
        32,
        33
      ],
      "leaf_false": [
        29,
        32
      ],
      "subdivide": [
        37,
        38,
        39,
        40,
        41
      ],
      "return_internal": [
        43,
        44,
        45
      ],
      "call_build": [
        48
      ],
      "complete": [
        48
      ],
      "build_tl": [
        38
      ],
      "build_tr": [
        39
      ],
      "build_bl": [
        40
      ],
      "build_br": [
        41
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var construct = function (grid) {\n  var n = grid.length;\n  // Build 2D prefix sum (1-indexed)\n  var prefix = Array.from({ length: n + 1 }, function () {\n    return new Array(n + 1).fill(0);\n  });\n  for (var i = 1; i <= n; i++) {\n    for (var j = 1; j <= n; j++) {\n      prefix[i][j] =\n        grid[i - 1][j - 1] +\n        prefix[i - 1][j] +\n        prefix[i][j - 1] -\n        prefix[i - 1][j - 1];\n    }\n  }\n\n  function regionSum(row, col, size) {\n    return (\n      prefix[row + size][col + size] -\n      prefix[row][col + size] -\n      prefix[row + size][col] +\n      prefix[row][col]\n    );\n  }\n\n  function build(row, col, size) {\n    var sum = regionSum(row, col, size);\n    var total = size * size;\n\n    // All zeros or all ones → leaf node\n    if (sum === 0) return new _Node(false, true);\n    if (sum === total) return new _Node(true, true);\n\n    // Mixed → subdivide into four quadrants\n    var half = size / 2;\n    var topLeft = build(row, col, half);\n    var topRight = build(row, col + half, half);\n    var bottomLeft = build(row + half, col, half);\n    var bottomRight = build(row + half, col + half, half);\n\n    return new _Node(true, false, topLeft, topRight, bottomLeft, bottomRight);\n  }\n\n  return build(0, 0, n);\n};",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "calc_sum": [
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "check_region": [
        26,
        27,
        28
      ],
      "leaf_true": [
        31,
        32
      ],
      "leaf_false": [
        31,
        32
      ],
      "subdivide": [
        35,
        36,
        37,
        38,
        39
      ],
      "return_internal": [
        41
      ],
      "call_build": [
        44
      ],
      "complete": [
        44
      ],
      "build_tl": [
        36
      ],
      "build_tr": [
        37
      ],
      "build_bl": [
        38
      ],
      "build_br": [
        39
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function construct(grid: number[][]): _Node | null {\n    const n = grid.length;\n    // Build 2D prefix sum (1-indexed)\n    const prefix: number[][] = Array.from({ length: n + 1 }, () =>\n        new Array(n + 1).fill(0)\n    );\n    for (let i = 1; i <= n; i++) {\n        for (let j = 1; j <= n; j++) {\n            prefix[i][j] =\n                grid[i - 1][j - 1] +\n                prefix[i - 1][j] +\n                prefix[i][j - 1] -\n                prefix[i - 1][j - 1];\n        }\n    }\n\n    function regionSum(row: number, col: number, size: number): number {\n        return (\n            prefix[row + size][col + size] -\n            prefix[row][col + size] -\n            prefix[row + size][col] +\n            prefix[row][col]\n        );\n    }\n\n    function build(row: number, col: number, size: number): _Node {\n        const sum = regionSum(row, col, size);\n        const total = size * size;\n\n        // All zeros or all ones → leaf node\n        if (sum === 0) return new _Node(false, true);\n        if (sum === total) return new _Node(true, true);\n\n        // Mixed → subdivide into four quadrants\n        const half = size / 2;\n        const topLeft = build(row, col, half);\n        const topRight = build(row, col + half, half);\n        const bottomLeft = build(row + half, col, half);\n        const bottomRight = build(row + half, col + half, half);\n\n        return new _Node(true, false, topLeft, topRight, bottomLeft, bottomRight);\n    }\n\n    return build(0, 0, n);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "calc_sum": [
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "check_region": [
        26,
        27,
        28
      ],
      "leaf_true": [
        31,
        32
      ],
      "leaf_false": [
        31,
        32
      ],
      "subdivide": [
        35,
        36,
        37,
        38,
        39
      ],
      "return_internal": [
        41
      ],
      "call_build": [
        44
      ],
      "complete": [
        44
      ],
      "build_tl": [
        36
      ],
      "build_tr": [
        37
      ],
      "build_bl": [
        38
      ],
      "build_br": [
        39
      ]
    },
    "conditionalMap": {}
  }
};

const ConstructQuadTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "2x2 Mixed",
    "value": {
      "grid": [
        [
          0,
          1
        ],
        [
          1,
          0
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "8x8 Standard",
    "value": {
      "grid": [
        [
          1,
          1,
          1,
          1,
          0,
          0,
          0,
          0
        ],
        [
          1,
          1,
          1,
          1,
          0,
          0,
          0,
          0
        ],
        [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ],
        [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ],
        [
          0,
          0,
          1,
          1,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          1,
          1,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "4x4 Checkerboard",
    "value": {
      "grid": [
        [
          1,
          1,
          0,
          0
        ],
        [
          1,
          1,
          0,
          0
        ],
        [
          0,
          0,
          1,
          1
        ],
        [
          0,
          0,
          1,
          1
        ]
      ]
    }
  }
];

function generateConstructQuadTreeSteps(e: any): any[] {
  
let t=e.grid||[],i=t.length,r={};for(let e=0;e<i;e++)for(let l=0;l<i;l++)r[`cell_${e}_${l}`]={type:"matrixElement",value:t[e][l],row:e,col:l};let a=new RecursiveStepRecorder({n:i},r);if(a.pushCallFrame({n:i},"construct"),a.add_new_visual("region_active",{type:"metadata",value:null}),a.add_new_visual("meta_decision",{type:"metadata",value:null}),a.record("-",`Start: construct a quad tree from the ${i}\xd7${i} grid`),0===i)return a.record("complete","Empty grid, return null"),a.popCallFrame(),a.getSteps();let o=Array.from({length:i+1},()=>Array(i+1).fill(0));for(let e=1;e<=i;e++)for(let l=1;l<=i;l++)o[e][l]=t[e-1][l-1]+o[e-1][l]+o[e][l-1]-o[e-1][l-1];a.record("build_prefix","Build a 2D prefix sum so any region's sum is O(1)");let n=["TL","TR","BL","BR"],d=0,u=0,s=(e,t,i,l,r,o)=>{a.update_visual("region_active",{type:"metadata",value:{row:e,col:t,size:i,depth:l,phase:r,quad:o}})},f=(e,t,i,l,r,o)=>{a.update_visual("meta_decision",{type:"metadata",value:{row:e,col:t,size:i,sum:l,total:r,verdict:o}})},c=(e,t,i,l,r,o)=>{a.update_visual(`frame_${e}`,{type:"metadata",state:t,value:{row:i,col:l,size:r,quad:o}})};return a.record("call_build",`Call build(0, 0, ${i})`),!function e(t,i,l,r,h,p,g){a.pushCallFrame({row:t,col:i,size:l},"build");for(let e=0;e<r;e++){let t=a.get_visual(`frame_${e}`);t&&"metadata"===t.type&&a.update_visual(`frame_${e}`,{...t,state:"waiting"})}c(r,"active",t,i,l,h),s(t,i,l,r,"check",h),f(t,i,l,-1,l*l,""),a.record("check_region",`build(row=${t}, col=${i}, size=${l}) — is this region uniform?`);let b=o[t+l][i+l]-o[t][i+l]-o[t+l][i]+o[t][i],m=l*l;if(s(t,i,l,r,"sum",h),f(t,i,l,b,m,""),a.record("calc_sum",`sum = ${b}, total = ${m} (${l}\xd7${l})`),0===b){let e=d++;return a.update_visual(`qnode_${e}`,{type:"naryTreeNode",value:"0",parent:void 0!==p?`qnode_${p}`:void 0,childIndex:g,state:"leaf0"}),a.update_visual(`leaf_${u++}`,{type:"metadata",value:{row:t,col:i,size:l,val:0}}),s(t,i,l,r,"leaf0",h),f(t,i,l,b,m,"leaf0"),c(r,"done",t,i,l,h),a.record("leaf_false","sum is 0 → all zeros → leaf node (val = false)"),a.popCallFrame(),e}if(b===m){let e=d++;return a.update_visual(`qnode_${e}`,{type:"naryTreeNode",value:"1",parent:void 0!==p?`qnode_${p}`:void 0,childIndex:g,state:"leaf1"}),a.update_visual(`leaf_${u++}`,{type:"metadata",value:{row:t,col:i,size:l,val:1}}),s(t,i,l,r,"leaf1",h),f(t,i,l,b,m,"leaf1"),c(r,"done",t,i,l,h),a.record("leaf_true","sum equals total → all ones → leaf node (val = true)"),a.popCallFrame(),e}let v=d++;a.update_visual(`qnode_${v}`,{type:"naryTreeNode",value:"*",parent:void 0!==p?`qnode_${p}`:void 0,childIndex:g,state:"active"}),s(t,i,l,r,"subdivide",h),f(t,i,l,b,m,"subdivide"),a.record("subdivide",`Mixed (0 < ${b} < ${m}) → subdivide into 4 quadrants`);let _=Math.floor(l/2);for(let[o,d,u,f]of[[t,i,"build_tl",0],[t,i+_,"build_tr",1],[t+_,i,"build_bl",2],[t+_,i+_,"build_br",3]])s(o,d,_,r,"quadrant",n[f]),c(r,"active",t,i,l,h),a.record(u,`Build ${n[f]} quadrant at (${o}, ${d}), size ${_}`),e(o,d,_,r+1,n[f],v,f),a.delete_visual(`frame_${r+1}`);return a.update_visual(`qnode_${v}`,{type:"naryTreeNode",value:"*",parent:void 0!==p?`qnode_${p}`:void 0,childIndex:g,state:"internal"}),s(t,i,l,r,"internal-done",h),c(r,"done",t,i,l,h),a.record("return_internal","All 4 quadrants done → return internal node"),a.popCallFrame(),v}(0,0,i,0,"root"),a.update_visual("region_active",{type:"metadata",value:null}),a.update_visual("meta_decision",{type:"metadata",value:null}),a.record("complete","Quad tree complete — the grid is partitioned into uniform squares"),a.popCallFrame(),a.getSteps()
}

export function ConstructQuadTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ConstructQuadTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateConstructQuadTreeSteps(e) as any[];
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
      title="Construct Quad Tree"
      slug="construct-quad-tree"
      approaches={approaches}
      presets={ConstructQuadTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count Complete Tree Nodes (count-complete-tree-nodes)
// ==========================================

const CountCompleteTreeNodesTemplates = {
  "python": {
    "language": "python",
    "code": "def countNodes(root):\n    if root is None:\n        return 0\n\n    height = 0\n    node = root\n    while node is not None:\n        height += 1\n        node = node.left\n\n    if height == 1:\n        return 1\n\n    last_level_max = 1 << (height - 1)\n    low, high = 0, last_level_max - 1\n\n    while low < high:\n        mid = low + (high - low + 1) // 2\n        if node_exists(root, height, mid):\n            low = mid\n        else:\n            high = mid - 1\n\n    nodes_above = last_level_max - 1\n    nodes_on_last = low + 1\n    return nodes_above + nodes_on_last\n\ndef node_exists(root, height, position):\n    node = root\n    left, right = 0, (1 << (height - 1)) - 1\n\n    for level in range(1, height):\n        mid = left + (right - left) // 2\n        if position <= mid:\n            node = node.left\n            right = mid\n        else:\n            node = node.right\n            left = mid + 1\n\n    return node is not None",
    "lineMap": {
      "start": [
        1
      ],
      "return_null": [
        2,
        3
      ],
      "height_walk": [
        7,
        8,
        9
      ],
      "height_done": [
        14
      ],
      "single_node": [
        11,
        12
      ],
      "init_search": [
        15
      ],
      "calc_mid": [
        18
      ],
      "go_left": [
        34,
        35,
        36
      ],
      "go_right": [
        37,
        38,
        39
      ],
      "node_found": [
        41
      ],
      "node_not_found": [
        41
      ],
      "exists_true": [
        19,
        20
      ],
      "exists_false": [
        21,
        22
      ],
      "search_done": [
        25
      ],
      "calc_result": [
        24,
        25,
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "while_height": [
        7
      ],
      "check_single": [
        11
      ],
      "while_search": [
        17
      ],
      "node_exists": [
        19
      ],
      "check_position": [
        34
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int countNodes(TreeNode root) {\n    if (root == null) return 0;\n\n    int height = 0;\n    TreeNode node = root;\n    while (node != null) {\n        height++;\n        node = node.left;\n    }\n\n    if (height == 1) return 1;\n\n    int lastLevelMax = 1 << (height - 1);\n    int low = 0, high = lastLevelMax - 1;\n\n    while (low < high) {\n        int mid = low + (high - low + 1) / 2;\n        if (nodeExists(root, height, mid)) {\n            low = mid;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    int nodesAbove = lastLevelMax - 1;\n    int nodesOnLast = low + 1;\n    return nodesAbove + nodesOnLast;\n}\n\nprivate boolean nodeExists(TreeNode root, int height, int position) {\n    TreeNode node = root;\n    int left = 0, right = (1 << (height - 1)) - 1;\n\n    for (int level = 1; level < height; level++) {\n        int mid = left + (right - left) / 2;\n        if (position <= mid) {\n            node = node.left;\n            right = mid;\n        } else {\n            node = node.right;\n            left = mid + 1;\n        }\n    }\n\n    return node != null;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "return_null": [
        2
      ],
      "height_walk": [
        6,
        7,
        8
      ],
      "height_done": [
        13
      ],
      "single_node": [
        11
      ],
      "init_search": [
        14
      ],
      "calc_mid": [
        17
      ],
      "go_left": [
        36,
        37,
        38
      ],
      "go_right": [
        39,
        40,
        41
      ],
      "node_found": [
        45
      ],
      "node_not_found": [
        45
      ],
      "exists_true": [
        18,
        19
      ],
      "exists_false": [
        20,
        21
      ],
      "search_done": [
        26
      ],
      "calc_result": [
        25,
        26,
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "while_height": [
        6
      ],
      "check_single": [
        11
      ],
      "while_search": [
        16
      ],
      "node_exists": [
        18
      ],
      "check_position": [
        36
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int countNodes(TreeNode* root) {\n    if (root == nullptr) return 0;\n\n    int height = 0;\n    TreeNode* node = root;\n    while (node != nullptr) {\n        height++;\n        node = node->left;\n    }\n\n    if (height == 1) return 1;\n\n    int lastLevelMax = 1 << (height - 1);\n    int low = 0, high = lastLevelMax - 1;\n\n    while (low < high) {\n        int mid = low + (high - low + 1) / 2;\n        if (nodeExists(root, height, mid)) {\n            low = mid;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    int nodesAbove = lastLevelMax - 1;\n    int nodesOnLast = low + 1;\n    return nodesAbove + nodesOnLast;\n}\n\nbool nodeExists(TreeNode* root, int height, int position) {\n    TreeNode* node = root;\n    int left = 0, right = (1 << (height - 1)) - 1;\n\n    for (int level = 1; level < height; level++) {\n        int mid = left + (right - left) / 2;\n        if (position <= mid) {\n            node = node->left;\n            right = mid;\n        } else {\n            node = node->right;\n            left = mid + 1;\n        }\n    }\n\n    return node != nullptr;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "return_null": [
        2
      ],
      "height_walk": [
        6,
        7,
        8
      ],
      "height_done": [
        13
      ],
      "single_node": [
        11
      ],
      "init_search": [
        14
      ],
      "calc_mid": [
        17
      ],
      "go_left": [
        36,
        37,
        38
      ],
      "go_right": [
        39,
        40,
        41
      ],
      "node_found": [
        45
      ],
      "node_not_found": [
        45
      ],
      "exists_true": [
        18,
        19
      ],
      "exists_false": [
        20,
        21
      ],
      "search_done": [
        26
      ],
      "calc_result": [
        25,
        26,
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "while_height": [
        6
      ],
      "check_single": [
        11
      ],
      "while_search": [
        16
      ],
      "node_exists": [
        18
      ],
      "check_position": [
        36
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int CountNodes(TreeNode root) {\n    if (root == null) return 0;\n\n    int height = 0;\n    TreeNode node = root;\n    while (node != null) {\n        height++;\n        node = node.left;\n    }\n\n    if (height == 1) return 1;\n\n    int lastLevelMax = 1 << (height - 1);\n    int low = 0, high = lastLevelMax - 1;\n\n    while (low < high) {\n        int mid = low + (high - low + 1) / 2;\n        if (NodeExists(root, height, mid)) {\n            low = mid;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    int nodesAbove = lastLevelMax - 1;\n    int nodesOnLast = low + 1;\n    return nodesAbove + nodesOnLast;\n}\n\nprivate bool NodeExists(TreeNode root, int height, int position) {\n    TreeNode node = root;\n    int left = 0, right = (1 << (height - 1)) - 1;\n\n    for (int level = 1; level < height; level++) {\n        int mid = left + (right - left) / 2;\n        if (position <= mid) {\n            node = node.left;\n            right = mid;\n        } else {\n            node = node.right;\n            left = mid + 1;\n        }\n    }\n\n    return node != null;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "return_null": [
        2
      ],
      "height_walk": [
        6,
        7,
        8
      ],
      "height_done": [
        13
      ],
      "single_node": [
        11
      ],
      "init_search": [
        14
      ],
      "calc_mid": [
        17
      ],
      "go_left": [
        36,
        37,
        38
      ],
      "go_right": [
        39,
        40,
        41
      ],
      "node_found": [
        45
      ],
      "node_not_found": [
        45
      ],
      "exists_true": [
        18,
        19
      ],
      "exists_false": [
        20,
        21
      ],
      "search_done": [
        26
      ],
      "calc_result": [
        25,
        26,
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "while_height": [
        6
      ],
      "check_single": [
        11
      ],
      "while_search": [
        16
      ],
      "node_exists": [
        18
      ],
      "check_position": [
        36
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countNodes(root *TreeNode) int {\n    if root == nil {\n        return 0\n    }\n\n    height := 0\n    node := root\n    for node != nil {\n        height++\n        node = node.Left\n    }\n\n    if height == 1 {\n        return 1\n    }\n\n    lastLevelMax := 1 << (height - 1)\n    low, high := 0, lastLevelMax-1\n\n    for low < high {\n        mid := low + (high-low+1)/2\n        if nodeExists(root, height, mid) {\n            low = mid\n        } else {\n            high = mid - 1\n        }\n    }\n\n    nodesAbove := lastLevelMax - 1\n    nodesOnLast := low + 1\n    return nodesAbove + nodesOnLast\n}\n\nfunc nodeExists(root *TreeNode, height int, position int) bool {\n    node := root\n    left, right := 0, (1<<(height-1))-1\n\n    for level := 1; level < height; level++ {\n        mid := left + (right-left)/2\n        if position <= mid {\n            node = node.Left\n            right = mid\n        } else {\n            node = node.Right\n            left = mid + 1\n        }\n    }\n\n    return node != nil\n}",
    "lineMap": {
      "start": [
        1
      ],
      "return_null": [
        2,
        3,
        4
      ],
      "height_walk": [
        8,
        9,
        10
      ],
      "height_done": [
        17
      ],
      "single_node": [
        13,
        14,
        15
      ],
      "init_search": [
        18
      ],
      "calc_mid": [
        21
      ],
      "go_left": [
        40,
        41,
        42
      ],
      "go_right": [
        43,
        44,
        45
      ],
      "node_found": [
        49
      ],
      "node_not_found": [
        49
      ],
      "exists_true": [
        22,
        23
      ],
      "exists_false": [
        24,
        25
      ],
      "search_done": [
        30
      ],
      "calc_result": [
        29,
        30,
        31
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "while_height": [
        8
      ],
      "check_single": [
        13
      ],
      "while_search": [
        20
      ],
      "node_exists": [
        22
      ],
      "check_position": [
        40
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function countNodes(root) {\n    if (root === null) return 0;\n\n    let height = 0;\n    let node = root;\n    while (node !== null) {\n        height++;\n        node = node.left;\n    }\n\n    if (height === 1) return 1;\n\n    const lastLevelMax = 1 << (height - 1);\n    let low = 0, high = lastLevelMax - 1;\n\n    while (low < high) {\n        const mid = low + Math.ceil((high - low) / 2);\n        if (nodeExists(root, height, mid)) {\n            low = mid;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    const nodesAbove = lastLevelMax - 1;\n    const nodesOnLast = low + 1;\n    return nodesAbove + nodesOnLast;\n}\n\nfunction nodeExists(root, height, position) {\n    let node = root;\n    let left = 0, right = (1 << (height - 1)) - 1;\n\n    for (let level = 1; level < height; level++) {\n        const mid = left + Math.floor((right - left) / 2);\n        if (position <= mid) {\n            node = node.left;\n            right = mid;\n        } else {\n            node = node.right;\n            left = mid + 1;\n        }\n    }\n\n    return node !== null;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "return_null": [
        2
      ],
      "height_walk": [
        6,
        7,
        8
      ],
      "height_done": [
        13
      ],
      "single_node": [
        11
      ],
      "init_search": [
        14
      ],
      "calc_mid": [
        17
      ],
      "go_left": [
        36,
        37,
        38
      ],
      "go_right": [
        39,
        40,
        41
      ],
      "node_found": [
        45
      ],
      "node_not_found": [
        45
      ],
      "exists_true": [
        18,
        19
      ],
      "exists_false": [
        20,
        21
      ],
      "search_done": [
        26
      ],
      "calc_result": [
        25,
        26,
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "while_height": [
        6
      ],
      "check_single": [
        11
      ],
      "while_search": [
        16
      ],
      "node_exists": [
        18
      ],
      "check_position": [
        36
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countNodes(root: TreeNode | null): number {\n    if (root === null) return 0;\n\n    let height = 0;\n    let node: TreeNode | null = root;\n    while (node !== null) {\n        height++;\n        node = node.left;\n    }\n\n    if (height === 1) return 1;\n\n    const lastLevelMax = 1 << (height - 1);\n    let low = 0, high = lastLevelMax - 1;\n\n    while (low < high) {\n        const mid = low + Math.ceil((high - low) / 2);\n        if (nodeExists(root, height, mid)) {\n            low = mid;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    const nodesAbove = lastLevelMax - 1;\n    const nodesOnLast = low + 1;\n    return nodesAbove + nodesOnLast;\n}\n\nfunction nodeExists(root: TreeNode, height: number, position: number): boolean {\n    let node: TreeNode | null = root;\n    let left = 0, right = (1 << (height - 1)) - 1;\n\n    for (let level = 1; level < height; level++) {\n        const mid = left + Math.floor((right - left) / 2);\n        if (position <= mid) {\n            node = node.left;\n            right = mid;\n        } else {\n            node = node.right;\n            left = mid + 1;\n        }\n    }\n\n    return node !== null;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "return_null": [
        2
      ],
      "height_walk": [
        6,
        7,
        8
      ],
      "height_done": [
        13
      ],
      "single_node": [
        11
      ],
      "init_search": [
        14
      ],
      "calc_mid": [
        17
      ],
      "go_left": [
        36,
        37,
        38
      ],
      "go_right": [
        39,
        40,
        41
      ],
      "node_found": [
        45
      ],
      "node_not_found": [
        45
      ],
      "exists_true": [
        18,
        19
      ],
      "exists_false": [
        20,
        21
      ],
      "search_done": [
        26
      ],
      "calc_result": [
        25,
        26,
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "while_height": [
        6
      ],
      "check_single": [
        11
      ],
      "while_search": [
        16
      ],
      "node_exists": [
        18
      ],
      "check_position": [
        36
      ]
    }
  }
};

const CountCompleteTreeNodesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "6 Nodes",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6
      ]
    }
  },
  {
    "id": "ex2",
    "label": "10 Nodes",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Perfect Tree (15)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single Node",
    "value": {
      "tree": [
        1
      ]
    }
  }
];

function generateCountCompleteTreeNodesSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),i=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(i.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);i.has(t)&&(i.get(e).parent=t,i.get(e).isLeftChild=e%2==1)}let r=e=>i.has(e),l=(e,t)=>{let n=i.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t}},a={};i.forEach((e,t)=>{a[`node_${t}`]=l(t)});let d=new StepRecorder({count:0,currentIdx:void 0,leftHeight:void 0,rightHeight:void 0,subtreeSize:void 0,result:void 0},{...a});if(d.record("start","Start: use perfect-subtree shortcuts to skip counting"),0===i.size)return d.update_variable("result",0),d.record("return_null","Root is null: return 0"),d.getSteps();let s=0,h=[],u=function e(t){d.update_visual(`node_${t}`,l(t,"current")),d.update_variable("currentIdx",t),d.update_variable("leftHeight",void 0),d.update_variable("rightHeight",void 0),d.record("visit",`Measure the subtree rooted at ${i.get(t).value}`);let n=(e=>{let t=[];for(let i=e;r(i);i=2*i+1)t.push(i);return t})(t),o=(e=>{let t=[];for(let i=e;r(i);i=2*i+2)t.push(i);return t})(t),a=n.length,u=o.length;if(n.forEach(e=>{e!==t&&d.update_visual(`node_${e}`,l(e,"lspine"))}),d.update_variable("leftHeight",a),d.record("measure_left",`Left spine height = ${a}`),o.forEach(e=>{e!==t&&d.update_visual(`node_${e}`,l(e,"rspine"))}),d.update_variable("rightHeight",u),d.record("measure_right",`Right spine height = ${u}`),a===u){let e=(1<<a)-1;return(e=>{let t=[],i=[e];for(;i.length;){let e=i.pop();r(e)&&(t.push(e),i.push(2*e+1,2*e+2))}return t})(t).forEach(e=>d.update_visual(`node_${e}`,l(e,"perfect"))),s+=e,d.update_variable("subtreeSize",e),d.update_variable("count",s),d.record("perfect",`Heights match: perfect subtree of 2^${a} - 1 = ${e} nodes`),e}new Set([...n,...o]).forEach(e=>{e!==t&&d.update_visual(`node_${e}`,l(e))}),d.update_visual(`node_${t}`,l(t,"onpath")),h.push(t),d.record("recurse",`Heights differ (${a} vs ${u}): count the children`);let c=r(2*t+1)?e(2*t+1):0,g=r(2*t+2)?e(2*t+2):0,f=1+c+g;return h.pop(),s+=1,d.update_visual(`node_${t}`,l(t,"counted")),d.update_variable("currentIdx",t),d.update_variable("subtreeSize",f),d.update_variable("count",s),d.record("count_node",`Count ${i.get(t).value}: 1 + ${c} + ${g} = ${f}`),f}(0);return d.update_variable("result",u),d.update_variable("currentIdx",-1),i.forEach((e,t)=>{d.update_visual(`node_${t}`,l(t,"perfect"))}),d.record("complete",`Total nodes: ${u}`),d.getSteps()
}

export function CountCompleteTreeNodesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountCompleteTreeNodesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCountCompleteTreeNodesSteps(e) as any[];
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
      title="Count Complete Tree Nodes"
      slug="count-complete-tree-nodes"
      approaches={approaches}
      presets={CountCompleteTreeNodesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count Good Nodes in Binary Tree (count-good-nodes-in-binary-tree)
// ==========================================

const CountGoodNodesInBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def goodNodes(root):\n    def dfs(node, maxSoFar):\n        if not node:\n            return 0\n        count = 1 if node.val >= maxSoFar else 0\n        newMax = max(maxSoFar, node.val)\n        count += dfs(node.left, newMax)\n        count += dfs(node.right, newMax)\n        return count\n    return dfs(root, float('-inf'))",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        10
      ],
      "base_case_null": [
        4
      ],
      "is_good": [
        5
      ],
      "not_good": [
        5
      ],
      "update_max": [
        6
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        8
      ],
      "return_count": [
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "is_good": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int goodNodes(TreeNode root) {\n    return dfs(root, Integer.MIN_VALUE);\n}\n\nprivate int dfs(TreeNode node, int maxSoFar) {\n    if (node == null) return 0;\n    int count = node.val >= maxSoFar ? 1 : 0;\n    int newMax = Math.max(maxSoFar, node.val);\n    count += dfs(node.left, newMax);\n    count += dfs(node.right, newMax);\n    return count;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        2
      ],
      "base_case_null": [
        6
      ],
      "is_good": [
        7
      ],
      "not_good": [
        7
      ],
      "update_max": [
        8
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        10
      ],
      "return_count": [
        11
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "is_good": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int goodNodes(TreeNode* root) {\n        return dfs(root, INT_MIN);\n    }\n    int dfs(TreeNode* node, int maxSoFar) {\n        if (node == nullptr) return 0;\n        int count = node->val >= maxSoFar ? 1 : 0;\n        int newMax = max(maxSoFar, node->val);\n        count += dfs(node->left, newMax);\n        count += dfs(node->right, newMax);\n        return count;\n    }\n};",
    "lineMap": {
      "init": [
        3
      ],
      "start_dfs": [
        4
      ],
      "base_case_null": [
        7
      ],
      "is_good": [
        8
      ],
      "not_good": [
        8
      ],
      "update_max": [
        9
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "return_count": [
        12
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "is_null": [
        7
      ],
      "is_good": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int GoodNodes(TreeNode root) {\n        return Dfs(root, int.MinValue);\n    }\n    private int Dfs(TreeNode node, int maxSoFar) {\n        if (node == null) return 0;\n        int count = node.val >= maxSoFar ? 1 : 0;\n        int newMax = Math.Max(maxSoFar, node.val);\n        count += Dfs(node.left, newMax);\n        count += Dfs(node.right, newMax);\n        return count;\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "start_dfs": [
        3
      ],
      "base_case_null": [
        6
      ],
      "is_good": [
        7
      ],
      "not_good": [
        7
      ],
      "update_max": [
        8
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        10
      ],
      "return_count": [
        11
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "is_null": [
        6
      ],
      "is_good": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func goodNodes(root *TreeNode) int {\n    var dfs func(node *TreeNode, maxSoFar int) int\n    dfs = func(node *TreeNode, maxSoFar int) int {\n        if node == nil {\n            return 0\n        }\n        count := 0\n        if node.Val >= maxSoFar {\n            count = 1\n        }\n        newMax := max(maxSoFar, node.Val)\n        count += dfs(node.Left, newMax)\n        count += dfs(node.Right, newMax)\n        return count\n    }\n    return dfs(root, math.MinInt32)\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        16
      ],
      "base_case_null": [
        5
      ],
      "is_good": [
        9
      ],
      "not_good": [
        7
      ],
      "update_max": [
        11
      ],
      "recurse_left": [
        12
      ],
      "recurse_right": [
        13
      ],
      "return_count": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_null": [
        4
      ],
      "is_good": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function goodNodes(root) {\n    function dfs(node, maxSoFar) {\n        if (node === null) return 0;\n        let count = node.val >= maxSoFar ? 1 : 0;\n        const newMax = Math.max(maxSoFar, node.val);\n        count += dfs(node.left, newMax);\n        count += dfs(node.right, newMax);\n        return count;\n    }\n    return dfs(root, -Infinity);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        10
      ],
      "base_case_null": [
        3
      ],
      "is_good": [
        4
      ],
      "not_good": [
        4
      ],
      "update_max": [
        5
      ],
      "recurse_left": [
        6
      ],
      "recurse_right": [
        7
      ],
      "return_count": [
        8
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "is_good": [
        4
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function goodNodes(root: TreeNode | null): number {\n    function dfs(node: TreeNode | null, maxSoFar: number): number {\n        if (node === null) return 0;\n        let count = node.val >= maxSoFar ? 1 : 0;\n        const newMax = Math.max(maxSoFar, node.val);\n        count += dfs(node.left, newMax);\n        count += dfs(node.right, newMax);\n        return count;\n    }\n    return dfs(root, -Infinity);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        10
      ],
      "base_case_null": [
        3
      ],
      "is_good": [
        4
      ],
      "not_good": [
        4
      ],
      "update_max": [
        5
      ],
      "recurse_left": [
        6
      ],
      "recurse_right": [
        7
      ],
      "return_count": [
        8
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_null": [
        3
      ],
      "is_good": [
        4
      ]
    }
  }
};

const CountGoodNodesInBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (count=4)",
    "value": {
      "tree": [
        3,
        1,
        4,
        3,
        null,
        1,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (count=3)",
    "value": {
      "tree": [
        3,
        3,
        null,
        4,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single Node (count=1)",
    "value": {
      "tree": [
        1
      ]
    }
  }
];

function generateCountGoodNodesInBinaryTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),o=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(o.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);o.has(t)&&(o.get(e).parent=t,o.get(e).isLeftChild=e%2==1)}let r=(e,t,n)=>{let a=o.get(e),r={type:"binaryTreeNode",value:a.value,parent:void 0!==a.parent?`node_${a.parent}`:void 0,isLeftChild:a.isLeftChild};return t&&(r.state=t),n&&(r.label=n),r},i={};o.forEach((e,t)=>{i[`node_${t}`]=r(t)});let l=new StepRecorder({totalCount:0,currentIdx:-1,nullIdx:-1,pathIdxs:[],maxNow:"-∞"},{...i});l.record("init","Start: a node is good if no value on its root path is bigger");let d=e=>e===-1/0?"-∞":String(e),u=new Map,s=[],c=0,h=(e,t,o)=>{u.set(e,{state:t,label:o}),l.update_visual(`node_${e}`,r(e,t,o))};if(0===o.size)return l.record("complete","Empty tree: 0 good nodes"),l.getSteps();l.record("start_dfs","Call dfs(root, -∞): the root always counts");let g=function e(t,n){if(!o.has(t))return l.add_conditional("is_null",!0),l.update_variable("nullIdx",t),l.record("base_case_null","Null child: contributes 0"),l.update_variable("nullIdx",-1),0;let a=o.get(t).value;if(s.length>0){let e=s[s.length-1];h(e,"path",u.get(e)?.label)}s.push(t),h(t,"current"),l.update_variable("currentIdx",t),l.update_variable("nodeVal",a),l.update_variable("pathIdxs",[...s]),l.update_variable("maxNow",d(n)),l.add_conditional("is_null",!1);let r=a>=n;l.add_conditional("is_good",r),r?(c++,l.update_variable("totalCount",c),h(t,"current","+1"),l.record("is_good",`${a} >= ${d(n)}: good node, count it (${c} so far)`)):(h(t,"current","+0"),l.record("not_good",`${a} < ${d(n)}: a bigger value sits on its path, not a good node`));let i=Math.max(n,a);l.update_variable("prevMax",d(n)),l.update_variable("newMax",i),l.update_variable("maxNow",d(i)),l.record("update_max",`maxSoFar = max(${d(n)}, ${a}) = ${i}`);let g=2*t+1,f=o.has(g);l.update_variable("hasLeft",f),l.record("recurse_left",f?`Recurse left of ${a} with maxSoFar = ${i}`:`Left child of ${a} is null: contributes 0`);let x=e(g,i);l.update_variable("maxNow",d(i));let p=2*t+2,m=o.has(p);l.update_variable("hasRight",m),l.record("recurse_right",m?`Recurse right of ${a} with maxSoFar = ${i}`:`Right child of ${a} is null: contributes 0`);let _=e(p,i);l.update_variable("maxNow",d(i));let b=+!!r+x+_;if(l.update_variable("retCount",b),l.update_variable("retGood",+!!r),l.update_variable("retLeft",x),l.update_variable("retRight",_),h(t,r?"good":"notgood",u.get(t)?.label),s.pop(),l.update_variable("pathIdxs",[...s]),s.length>0){let e=s[s.length-1];h(e,"current",u.get(e)?.label),l.update_variable("currentIdx",e)}else l.update_variable("currentIdx",-1);return l.record("return_count",`Subtree of ${a} done: return ${+!!r} + ${x} + ${_} = ${b}`),b}(0,-1/0);return l.update_variable("totalCount",g),l.record("complete",`Every node checked: ${g} good node${1===g?"":"s"}, return ${g}`),l.getSteps()
}

export function CountGoodNodesInBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountGoodNodesInBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCountGoodNodesInBinaryTreeSteps(e) as any[];
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
      title="Count Good Nodes in Binary Tree"
      slug="count-good-nodes-in-binary-tree"
      approaches={approaches}
      presets={CountGoodNodesInBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Delete Nodes And Return Forest (delete-nodes-and-return-forest)
// ==========================================

const DeleteNodesAndReturnForestTemplates = {
  "python": {
    "language": "python",
    "code": "def delNodes(root, to_delete):\n    forest = []\n    deleteSet = set(to_delete)\n    def dfs(node, isRoot):\n        if not node:\n            return None\n        shouldDelete = node.val in deleteSet\n        if isRoot and not shouldDelete:\n            forest.append(node)\n        node.left = dfs(node.left, shouldDelete)\n        node.right = dfs(node.right, shouldDelete)\n        return None if shouldDelete else node\n    dfs(root, True)\n    return forest",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        13
      ],
      "complete": [
        14
      ],
      "base_case_null": [
        6
      ],
      "check_delete": [
        7
      ],
      "add_to_forest": [
        8,
        9
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "delete_node": [
        12
      ],
      "keep_node": [
        12
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "should_delete": [
        7
      ],
      "is_root_and_kept": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<TreeNode> delNodes(TreeNode root, int[] to_delete) {\n    List<TreeNode> forest = new ArrayList<>();\n    Set<Integer> deleteSet = new HashSet<>();\n    for (int val : to_delete) deleteSet.add(val);\n    dfs(root, true, deleteSet, forest);\n    return forest;\n}\n\nprivate TreeNode dfs(TreeNode node, boolean isRoot,\n        Set<Integer> deleteSet, List<TreeNode> forest) {\n    if (node == null) return null;\n    boolean shouldDelete = deleteSet.contains(node.val);\n    if (isRoot && !shouldDelete) {\n        forest.add(node);\n    }\n    node.left = dfs(node.left, shouldDelete, deleteSet, forest);\n    node.right = dfs(node.right, shouldDelete, deleteSet, forest);\n    return shouldDelete ? null : node;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        5
      ],
      "complete": [
        6
      ],
      "base_case_null": [
        11
      ],
      "check_delete": [
        12
      ],
      "add_to_forest": [
        13,
        14
      ],
      "recurse_left": [
        16
      ],
      "recurse_right": [
        17
      ],
      "delete_node": [
        18
      ],
      "keep_node": [
        18
      ]
    },
    "conditionalMap": {
      "is_null": [
        11
      ],
      "should_delete": [
        12
      ],
      "is_root_and_kept": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<TreeNode*> delNodes(TreeNode* root, vector<int>& to_delete) {\n    vector<TreeNode*> forest;\n    unordered_set<int> deleteSet(to_delete.begin(), to_delete.end());\n    dfs(root, true, deleteSet, forest);\n    return forest;\n}\n\nTreeNode* dfs(TreeNode* node, bool isRoot,\n        unordered_set<int>& deleteSet, vector<TreeNode*>& forest) {\n    if (!node) return nullptr;\n    bool shouldDelete = deleteSet.count(node->val);\n    if (isRoot && !shouldDelete) {\n        forest.push_back(node);\n    }\n    node->left = dfs(node->left, shouldDelete, deleteSet, forest);\n    node->right = dfs(node->right, shouldDelete, deleteSet, forest);\n    return shouldDelete ? nullptr : node;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        4
      ],
      "complete": [
        5
      ],
      "base_case_null": [
        10
      ],
      "check_delete": [
        11
      ],
      "add_to_forest": [
        12,
        13
      ],
      "recurse_left": [
        15
      ],
      "recurse_right": [
        16
      ],
      "delete_node": [
        17
      ],
      "keep_node": [
        17
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ],
      "should_delete": [
        11
      ],
      "is_root_and_kept": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<TreeNode> DelNodes(TreeNode root, int[] to_delete) {\n    var forest = new List<TreeNode>();\n    var deleteSet = new HashSet<int>(to_delete);\n    Dfs(root, true, deleteSet, forest);\n    return forest;\n}\n\nprivate TreeNode Dfs(TreeNode node, bool isRoot,\n        HashSet<int> deleteSet, List<TreeNode> forest) {\n    if (node == null) return null;\n    bool shouldDelete = deleteSet.Contains(node.val);\n    if (isRoot && !shouldDelete) {\n        forest.Add(node);\n    }\n    node.left = Dfs(node.left, shouldDelete, deleteSet, forest);\n    node.right = Dfs(node.right, shouldDelete, deleteSet, forest);\n    return shouldDelete ? null : node;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        4
      ],
      "complete": [
        5
      ],
      "base_case_null": [
        10
      ],
      "check_delete": [
        11
      ],
      "add_to_forest": [
        12,
        13
      ],
      "recurse_left": [
        15
      ],
      "recurse_right": [
        16
      ],
      "delete_node": [
        17
      ],
      "keep_node": [
        17
      ]
    },
    "conditionalMap": {
      "is_null": [
        10
      ],
      "should_delete": [
        11
      ],
      "is_root_and_kept": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func delNodes(root *TreeNode, toDelete []int) []*TreeNode {\n    forest := []*TreeNode{}\n    deleteSet := map[int]bool{}\n    for _, val := range toDelete {\n        deleteSet[val] = true\n    }\n    var dfs func(node *TreeNode, isRoot bool) *TreeNode\n    dfs = func(node *TreeNode, isRoot bool) *TreeNode {\n        if node == nil {\n            return nil\n        }\n        shouldDelete := deleteSet[node.Val]\n        if isRoot && !shouldDelete {\n            forest = append(forest, node)\n        }\n        node.Left = dfs(node.Left, shouldDelete)\n        node.Right = dfs(node.Right, shouldDelete)\n        if shouldDelete {\n            return nil\n        }\n        return node\n    }\n    dfs(root, true)\n    return forest\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        23
      ],
      "complete": [
        24
      ],
      "base_case_null": [
        10
      ],
      "check_delete": [
        12
      ],
      "add_to_forest": [
        13,
        14
      ],
      "recurse_left": [
        16
      ],
      "recurse_right": [
        17
      ],
      "delete_node": [
        19
      ],
      "keep_node": [
        21
      ]
    },
    "conditionalMap": {
      "is_null": [
        9
      ],
      "should_delete": [
        12
      ],
      "is_root_and_kept": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function delNodes(root, to_delete) {\n    const forest = [];\n    const deleteSet = new Set(to_delete);\n    function dfs(node, isRoot) {\n        if (!node) return null;\n        const shouldDelete = deleteSet.has(node.val);\n        if (isRoot && !shouldDelete) {\n            forest.push(node);\n        }\n        node.left = dfs(node.left, shouldDelete);\n        node.right = dfs(node.right, shouldDelete);\n        return shouldDelete ? null : node;\n    }\n    dfs(root, true);\n    return forest;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        14
      ],
      "complete": [
        15
      ],
      "base_case_null": [
        5
      ],
      "check_delete": [
        6
      ],
      "add_to_forest": [
        7,
        8
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "delete_node": [
        12
      ],
      "keep_node": [
        12
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "should_delete": [
        6
      ],
      "is_root_and_kept": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function delNodes(root: TreeNode | null, to_delete: number[]): TreeNode[] {\n    const forest: TreeNode[] = [];\n    const deleteSet = new Set(to_delete);\n    function dfs(node: TreeNode | null, isRoot: boolean): TreeNode | null {\n        if (!node) return null;\n        const shouldDelete = deleteSet.has(node.val);\n        if (isRoot && !shouldDelete) {\n            forest.push(node);\n        }\n        node.left = dfs(node.left, shouldDelete);\n        node.right = dfs(node.right, shouldDelete);\n        return shouldDelete ? null : node;\n    }\n    dfs(root, true);\n    return forest;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        14
      ],
      "complete": [
        15
      ],
      "base_case_null": [
        5
      ],
      "check_delete": [
        6
      ],
      "add_to_forest": [
        7,
        8
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        11
      ],
      "delete_node": [
        12
      ],
      "keep_node": [
        12
      ]
    },
    "conditionalMap": {
      "is_null": [
        5
      ],
      "should_delete": [
        6
      ],
      "is_root_and_kept": [
        7
      ]
    }
  }
};

const DeleteNodesAndReturnForestPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "toDelete": [
        3,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        1,
        2,
        4,
        null,
        3
      ],
      "toDelete": [
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "tree": [
        1,
        2,
        3,
        null,
        null,
        null,
        4
      ],
      "toDelete": [
        2,
        1
      ]
    }
  }
];

function generateDeleteNodesAndReturnForestSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),l=e.toDelete||[],n=new Set(l),a=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(a.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);a.has(t)&&(a.get(e).parent=t,a.get(e).isLeftChild=e%2==1)}let i=(e,t,l)=>{let r=a.get(e),o={type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild};return t&&(o.state=t),l&&(o.label=l),o},d={};a.forEach((e,t)=>{d[`node_${t}`]=i(t)});let s=new RecursiveStepRecorder({forest:[]},{...d}),u=a.get(0);s.pushCallFrame({root:(0,_treeHelper848569.kU)(u),to_delete:`[${l.join(", ")}]`},"delNodes"),s.add_new_global_variable("currentIdx",-1),s.add_new_global_variable("nullIdx",-1),s.add_new_global_variable("pathIdxs",[]),s.add_new_global_variable("deletedVals",[]),s.record("-",`Start: delete ${JSON.stringify(l)}, the survivors split into a forest`);let h=new Map,p=[],f=[],c=[],_=(e,t,l)=>{h.set(e,{state:t,label:l}),s.update_visual(`node_${e}`,i(e,t,l))},g=e=>{let t=h.get(e);t?.state!=="doomed"&&t?.state!=="root"&&_(e,"current",t?.label)};return 0===a.size?s.record("complete","Empty tree: return []"):(s.record("start_dfs","Call dfs(root, isRoot = true)"),!function e(t,l){var r;let i,d=a.has(t);if(s.pushCallFrame({node:d?(0,_treeHelper848569.kU)(a.get(t)):"null",isRoot:l,shouldDelete:!!d&&n.has(a.get(t).value)},"dfs"),!d)return s.add_conditional("is_null",!0),s.update_global_variable("nullIdx",t),s.record("base_case_null","Null child: return null"),s.update_global_variable("nullIdx",-1),s.popCallFrame(),!1;let u=a.get(t).value,x=n.has(u);p.length>0&&(r=p[p.length-1],i=h.get(r),i?.state!=="doomed"&&i?.state!=="root"&&_(r,"path",i?.label)),p.push(t),g(t),s.update_global_variable("currentIdx",t),s.update_global_variable("nodeVal",u),s.update_global_variable("shouldDelete",x),s.update_global_variable("isRootNow",l),s.update_global_variable("pathIdxs",[...p]),s.add_conditional("is_null",!1),s.add_conditional("should_delete",x),!x&&l?(s.add_conditional("is_root_and_kept",!0),f.push(u),s.update_global_variable("forest",[...f]),_(t,"root","root"),s.record("add_to_forest",`${u} survives with no surviving parent: forest += ${u}`)):x||l?(s.add_conditional("is_root_and_kept",!1),_(t,"doomed"),s.record("check_delete",`${u} is in the delete set: mark it, its children may become roots`)):(s.add_conditional("is_root_and_kept",!1),s.record("check_delete",`${u} is not in the delete set: it stays attached to its parent`));let m=2*t+1,v=a.has(m);s.update_global_variable("hasLeft",v),s.record("recurse_left",v?x?`Recurse left of ${u}: parent is doomed, so isRoot = true`:`Recurse left of ${u} (isRoot = false)`:`Left child of ${u} is null`),e(m,x),s.update_global_variable("shouldDelete",x),s.update_global_variable("nodeVal",u);let b=2*t+2,y=a.has(b);if(s.update_global_variable("hasRight",y),s.record("recurse_right",y?x?`Recurse right of ${u}: parent is doomed, so isRoot = true`:`Recurse right of ${u} (isRoot = false)`:`Right child of ${u} is null`),e(b,x),s.update_global_variable("shouldDelete",x),s.update_global_variable("nodeVal",u),p.pop(),s.update_global_variable("pathIdxs",[...p]),p.length>0){let e=p[p.length-1];g(e),s.update_global_variable("currentIdx",e)}else s.update_global_variable("currentIdx",-1);if(x)return c.push(u),s.update_global_variable("deletedVals",[...c]),s.delete_visual(`node_${t}`),s.record("delete_node",`Delete ${u}: return null, the edges to it are severed`),!0;{let e=h.get(t);return e?.state!=="root"&&_(t,"kept",e?.label),s.record("keep_node",`Keep ${u}: return the node to its parent`),!1}}(0,!0),s.update_global_variable("forest",[...f]),s.record("complete",`Done: the forest has ${f.length} tree${1===f.length?"":"s"}, return [${f.join(", ")}]`)),s.popCallFrame(),s.getSteps()
}

export function DeleteNodesAndReturnForestProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DeleteNodesAndReturnForestTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDeleteNodesAndReturnForestSteps(e) as any[];
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
      title="Delete Nodes And Return Forest"
      slug="delete-nodes-and-return-forest"
      approaches={approaches}
      presets={DeleteNodesAndReturnForestPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Univalue Path (longest-univalue-path)
// ==========================================

const LongestUnivaluePathTemplates = {
  "python": {
    "language": "python",
    "code": "def longestUnivaluePath(root):\n    best = 0\n\n    def arm(node, value):\n        if node is None or node.val != value:\n            return 0\n        return 1 + max(arm(node.left, value), arm(node.right, value))\n\n    def walk(node):\n        nonlocal best\n        if node is None:\n            return\n        left = arm(node.left, node.val)\n        right = arm(node.right, node.val)\n        best = max(best, left + right)\n        walk(node.left)\n        walk(node.right)\n\n    walk(root)\n    return best",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "visit_anchor": [
        11
      ],
      "probe_left": [
        13
      ],
      "probe_right": [
        14
      ],
      "probe_visit": [
        5
      ],
      "probe_stop": [
        6
      ],
      "probe_return": [
        7
      ],
      "update_best": [
        15
      ],
      "no_update": [
        15
      ],
      "walk_left": [
        16
      ],
      "walk_right": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "probe_stops": [
        5
      ],
      "new_best": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int longestUnivaluePath(TreeNode root) {\n    int[] best = {0};\n    walk(root, best);\n    return best[0];\n}\n\nprivate void walk(TreeNode node, int[] best) {\n    if (node == null) {\n        return;\n    }\n    int left = arm(node.left, node.val);\n    int right = arm(node.right, node.val);\n    best[0] = Math.max(best[0], left + right);\n    walk(node.left, best);\n    walk(node.right, best);\n}\n\nprivate int arm(TreeNode node, int value) {\n    if (node == null || node.val != value) {\n        return 0;\n    }\n    return 1 + Math.max(arm(node.left, value), arm(node.right, value));\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "visit_anchor": [
        8
      ],
      "probe_left": [
        11
      ],
      "probe_right": [
        12
      ],
      "probe_visit": [
        19
      ],
      "probe_stop": [
        20
      ],
      "probe_return": [
        22
      ],
      "update_best": [
        13
      ],
      "no_update": [
        13
      ],
      "walk_left": [
        14
      ],
      "walk_right": [
        15
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "probe_stops": [
        19
      ],
      "new_best": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int arm(TreeNode* node, int value) {\n    if (node == nullptr || node->val != value) {\n        return 0;\n    }\n    return 1 + max(arm(node->left, value), arm(node->right, value));\n}\n\nvoid walk(TreeNode* node, int& best) {\n    if (node == nullptr) {\n        return;\n    }\n    int left = arm(node->left, node->val);\n    int right = arm(node->right, node->val);\n    best = max(best, left + right);\n    walk(node->left, best);\n    walk(node->right, best);\n}\n\nint longestUnivaluePath(TreeNode* root) {\n    int best = 0;\n    walk(root, best);\n    return best;\n}",
    "lineMap": {
      "start": [
        19
      ],
      "init": [
        20
      ],
      "visit_anchor": [
        9
      ],
      "probe_left": [
        12
      ],
      "probe_right": [
        13
      ],
      "probe_visit": [
        2
      ],
      "probe_stop": [
        3
      ],
      "probe_return": [
        5
      ],
      "update_best": [
        14
      ],
      "no_update": [
        14
      ],
      "walk_left": [
        15
      ],
      "walk_right": [
        16
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "probe_stops": [
        2
      ],
      "new_best": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LongestUnivaluePath(TreeNode root) {\n    int best = 0;\n    Walk(root, ref best);\n    return best;\n}\n\nprivate void Walk(TreeNode node, ref int best) {\n    if (node == null) {\n        return;\n    }\n    int left = Arm(node.left, node.val);\n    int right = Arm(node.right, node.val);\n    best = Math.Max(best, left + right);\n    Walk(node.left, ref best);\n    Walk(node.right, ref best);\n}\n\nprivate int Arm(TreeNode node, int value) {\n    if (node == null || node.val != value) {\n        return 0;\n    }\n    return 1 + Math.Max(Arm(node.left, value), Arm(node.right, value));\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "visit_anchor": [
        8
      ],
      "probe_left": [
        11
      ],
      "probe_right": [
        12
      ],
      "probe_visit": [
        19
      ],
      "probe_stop": [
        20
      ],
      "probe_return": [
        22
      ],
      "update_best": [
        13
      ],
      "no_update": [
        13
      ],
      "walk_left": [
        14
      ],
      "walk_right": [
        15
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "probe_stops": [
        19
      ],
      "new_best": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestUnivaluePath(root *TreeNode) int {\n    best := 0\n\n    var arm func(node *TreeNode, value int) int\n    arm = func(node *TreeNode, value int) int {\n        if node == nil || node.Val != value {\n            return 0\n        }\n        return 1 + max(arm(node.Left, value), arm(node.Right, value))\n    }\n\n    var walk func(node *TreeNode)\n    walk = func(node *TreeNode) {\n        if node == nil {\n            return\n        }\n        left := arm(node.Left, node.Val)\n        right := arm(node.Right, node.Val)\n        best = max(best, left+right)\n        walk(node.Left)\n        walk(node.Right)\n    }\n\n    walk(root)\n    return best\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "visit_anchor": [
        14
      ],
      "probe_left": [
        17
      ],
      "probe_right": [
        18
      ],
      "probe_visit": [
        6
      ],
      "probe_stop": [
        7
      ],
      "probe_return": [
        9
      ],
      "update_best": [
        19
      ],
      "no_update": [
        19
      ],
      "walk_left": [
        20
      ],
      "walk_right": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "probe_stops": [
        6
      ],
      "new_best": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function longestUnivaluePath(root) {\n    let best = 0;\n\n    function arm(node, value) {\n        if (!node || node.val !== value) {\n            return 0;\n        }\n        return 1 + Math.max(arm(node.left, value), arm(node.right, value));\n    }\n\n    function walk(node) {\n        if (!node) {\n            return;\n        }\n        const left = arm(node.left, node.val);\n        const right = arm(node.right, node.val);\n        best = Math.max(best, left + right);\n        walk(node.left);\n        walk(node.right);\n    }\n\n    walk(root);\n    return best;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "visit_anchor": [
        12
      ],
      "probe_left": [
        15
      ],
      "probe_right": [
        16
      ],
      "probe_visit": [
        5
      ],
      "probe_stop": [
        6
      ],
      "probe_return": [
        8
      ],
      "update_best": [
        17
      ],
      "no_update": [
        17
      ],
      "walk_left": [
        18
      ],
      "walk_right": [
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "probe_stops": [
        5
      ],
      "new_best": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestUnivaluePath(root: TreeNode | null): number {\n    let best = 0;\n\n    function arm(node: TreeNode | null, value: number): number {\n        if (!node || node.val !== value) {\n            return 0;\n        }\n        return 1 + Math.max(arm(node.left, value), arm(node.right, value));\n    }\n\n    function walk(node: TreeNode | null): void {\n        if (!node) {\n            return;\n        }\n        const left = arm(node.left, node.val);\n        const right = arm(node.right, node.val);\n        best = Math.max(best, left + right);\n        walk(node.left);\n        walk(node.right);\n    }\n\n    walk(root);\n    return best;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "visit_anchor": [
        12
      ],
      "probe_left": [
        15
      ],
      "probe_right": [
        16
      ],
      "probe_visit": [
        5
      ],
      "probe_stop": [
        6
      ],
      "probe_return": [
        8
      ],
      "update_best": [
        17
      ],
      "no_update": [
        17
      ],
      "walk_left": [
        18
      ],
      "walk_right": [
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "probe_stops": [
        5
      ],
      "new_best": [
        17
      ]
    }
  }
};

const LongestUnivaluePathPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        5,
        4,
        5,
        1,
        1,
        null,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tree": [
        1,
        4,
        5,
        4,
        4,
        null,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Same",
    "value": {
      "tree": [
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  }
];

function generateLongestUnivaluePathSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),a=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(a.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);a.has(t)&&(a.get(e).parent=t,a.get(e).isLeftChild=e%2==1)}let n=e=>e<t.length&&null!==t[e],i={};a.forEach((e,t)=>{let r;i[`node_${t}`]={type:"binaryTreeNode",value:(r=a.get(t)).value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild}});let o=new RecursiveStepRecorder({},{...i});if(o.pushCallFrame({root:(0,_treeHelper848569.kU)(a.get(0)??null)},"longestUnivaluePath"),o.record("start","Start: find the longest path where every node shares one value"),0===a.size)return o.update_global_variable("maxPath",0),o.record("complete","Empty tree: return 0"),o.popCallFrame(),o.getSteps();let s=0,d=new Map,h=new Map,u=[],c=[];o.update_global_variable("maxPath",0),o.update_global_variable("bestPathIdxs",[]),o.update_global_variable("arms",{}),o.record("init","maxPath = 0; walk the tree bottom-up (post-order)");let g=e=>{o.update_global_variable("currentIdx",e),o.update_global_variable("currentVal",a.get(e).value),o.update_global_variable("pathIdxs",[...c])};return!function e(t){let r;c.push(t),o.pushCallFrame({node:(0,_treeHelper848569.kU)(a.get(t))},"dfs");let i=a.get(t).value;o.add_conditional("is_null",!1),g(t),o.record("visit_node",`Visit ${i}`);let p=2*t+1,f=2*t+2,m=n(p),b=n(f),x=0;m&&(o.record("recurse_left",`Recurse into the left subtree of ${i}`),x=e(p),g(t)),o.update_global_variable("leftArm",x);let _=0;b&&(o.record("recurse_right",`Recurse into the right subtree of ${i}`),_=e(f),g(t)),o.update_global_variable("rightArm",_);let v=m&&a.get(p).value===i,w=v?x+1:0;o.add_conditional("left_matches",v),o.update_global_variable("leftPath",w),o.update_global_variable("evalChildIdx",m?p:-1),o.update_global_variable("evalMatches",v),o.record("calc_left_path",m?v?`Left child ${a.get(p).value} matches: leftPath = ${x} + 1 = ${w}`:`Left child ${a.get(p).value} differs: leftPath = 0`:"No left child: leftPath = 0");let P=b&&a.get(f).value===i,y=P?_+1:0;o.add_conditional("right_matches",P),o.update_global_variable("rightPath",y),o.update_global_variable("evalChildIdx",b?f:-1),o.update_global_variable("evalMatches",P),o.record("calc_right_path",b?P?`Right child ${a.get(f).value} matches: rightPath = ${_} + 1 = ${y}`:`Right child ${a.get(f).value} differs: rightPath = 0`:"No right child: rightPath = 0"),o.update_global_variable("evalChildIdx",-1);let k=w+y,$=k>s;if(o.add_conditional("new_max",$),$){s=k;let e=(e,t)=>{let a=[],r=e;for(let e=0;e<t;e++){a.push(r);let e=h.get(r);if(void 0===e||e<0)break;r=e}return a},a=w>0?e(p,w):[],r=y>0?e(f,y):[];u=[...a.reverse(),t,...r],o.update_global_variable("maxPath",s),o.update_global_variable("bestPathIdxs",[...u]),o.record("update_max",`Path through ${i}: ${w} + ${y} = ${k} edges -> new max!`)}else o.record("no_update",`Path through ${i} is ${k}; max stays ${s}`);let M=Math.max(w,y);return 0===M?h.set(t,-1):w>=y?h.set(t,p):h.set(t,f),d.set(t,M),r={},d.forEach((e,t)=>r[String(t)]=e),o.update_global_variable("arms",r),o.update_global_variable("returnArm",M),o.record("return_arm",`Return the longer arm of ${i}: max(${w}, ${y}) = ${M}`),c.pop(),o.popCallFrame(),c.length>0?g(c[c.length-1]):(o.update_global_variable("currentIdx",-1),o.update_global_variable("pathIdxs",[])),M}(0),o.update_global_variable("currentIdx",-1),o.update_global_variable("pathIdxs",[]),o.update_global_variable("maxPath",s),o.update_global_variable("bestPathIdxs",[...u]),o.record("complete",`Longest univalue path: ${s} edge${1===s?"":"s"}`),o.popCallFrame(),o.getSteps()
}

export function LongestUnivaluePathProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestUnivaluePathTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestUnivaluePathSteps(e) as any[];
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
      title="Longest Univalue Path"
      slug="longest-univalue-path"
      approaches={approaches}
      presets={LongestUnivaluePathPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Binary Tree (maximum-binary-tree)
// ==========================================

const MaximumBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def constructMaximumBinaryTree(self, nums: list[int]) -> TreeNode:\n        return self.build(nums, 0, len(nums) - 1)\n\n    def build(self, nums, left, right):\n        if left > right:\n            return None\n\n        # Find the index of the maximum element in the current range\n        max_index = left\n        for i in range(left + 1, right + 1):\n            if nums[i] > nums[max_index]:\n                max_index = i\n\n        # Create the root with the maximum value\n        root = TreeNode(nums[max_index])\n\n        # Recursively build left and right subtrees\n        root.left = self.build(nums, left, max_index - 1)\n        root.right = self.build(nums, max_index + 1, right)\n\n        return root",
    "lineMap": {
      "-": [
        2
      ],
      "call_build": [
        3
      ],
      "check_range": [
        5,
        6
      ],
      "base_case": [
        6,
        7
      ],
      "find_max": [
        10,
        11,
        12,
        13
      ],
      "create_node": [
        16
      ],
      "build_left": [
        19
      ],
      "build_right": [
        20
      ],
      "return_node": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "base_case": [
        6
      ],
      "has_left": [
        19
      ],
      "has_right": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public TreeNode constructMaximumBinaryTree(int[] nums) {\n        return build(nums, 0, nums.length - 1);\n    }\n\n    private TreeNode build(int[] nums, int left, int right) {\n        if (left > right) return null;\n\n        // Find the index of the maximum element in the current range\n        int maxIndex = left;\n        for (int i = left + 1; i <= right; i++) {\n            if (nums[i] > nums[maxIndex]) {\n                maxIndex = i;\n            }\n        }\n\n        // Create the root with the maximum value\n        TreeNode root = new TreeNode(nums[maxIndex]);\n\n        // Recursively build left and right subtrees\n        root.left = build(nums, left, maxIndex - 1);\n        root.right = build(nums, maxIndex + 1, right);\n\n        return root;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "call_build": [
        3
      ],
      "check_range": [
        6,
        7
      ],
      "base_case": [
        7
      ],
      "find_max": [
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "create_node": [
        18
      ],
      "build_left": [
        21
      ],
      "build_right": [
        22
      ],
      "return_node": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "base_case": [
        7
      ],
      "has_left": [
        21
      ],
      "has_right": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* constructMaximumBinaryTree(vector<int>& nums) {\n        return build(nums, 0, nums.size() - 1);\n    }\n\n    TreeNode* build(vector<int>& nums, int left, int right) {\n        if (left > right) return nullptr;\n\n        // Find the index of the maximum element in the current range\n        int maxIndex = left;\n        for (int i = left + 1; i <= right; i++) {\n            if (nums[i] > nums[maxIndex]) {\n                maxIndex = i;\n            }\n        }\n\n        // Create the root with the maximum value\n        TreeNode* root = new TreeNode(nums[maxIndex]);\n\n        // Recursively build left and right subtrees\n        root->left = build(nums, left, maxIndex - 1);\n        root->right = build(nums, maxIndex + 1, right);\n\n        return root;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "call_build": [
        4
      ],
      "check_range": [
        7,
        8
      ],
      "base_case": [
        8
      ],
      "find_max": [
        11,
        12,
        13,
        14,
        15,
        16
      ],
      "create_node": [
        19
      ],
      "build_left": [
        22
      ],
      "build_right": [
        23
      ],
      "return_node": [
        25
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "base_case": [
        8
      ],
      "has_left": [
        22
      ],
      "has_right": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public TreeNode ConstructMaximumBinaryTree(int[] nums) {\n        return Build(nums, 0, nums.Length - 1);\n    }\n\n    private TreeNode Build(int[] nums, int left, int right) {\n        if (left > right) return null;\n\n        // Find the index of the maximum element in the current range\n        int maxIndex = left;\n        for (int i = left + 1; i <= right; i++) {\n            if (nums[i] > nums[maxIndex]) {\n                maxIndex = i;\n            }\n        }\n\n        // Create the root with the maximum value\n        TreeNode root = new TreeNode(nums[maxIndex]);\n\n        // Recursively build left and right subtrees\n        root.left = Build(nums, left, maxIndex - 1);\n        root.right = Build(nums, maxIndex + 1, right);\n\n        return root;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "call_build": [
        3
      ],
      "check_range": [
        6,
        7
      ],
      "base_case": [
        7
      ],
      "find_max": [
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "create_node": [
        18
      ],
      "build_left": [
        21
      ],
      "build_right": [
        22
      ],
      "return_node": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "base_case": [
        7
      ],
      "has_left": [
        21
      ],
      "has_right": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func constructMaximumBinaryTree(nums []int) *TreeNode {\n    return build(nums, 0, len(nums)-1)\n}\n\nfunc build(nums []int, left, right int) *TreeNode {\n    if left > right {\n        return nil\n    }\n\n    // Find the index of the maximum element in the current range\n    maxIndex := left\n    for i := left + 1; i <= right; i++ {\n        if nums[i] > nums[maxIndex] {\n            maxIndex = i\n        }\n    }\n\n    // Create the root with the maximum value\n    root := &TreeNode{Val: nums[maxIndex]}\n\n    // Recursively build left and right subtrees\n    root.Left = build(nums, left, maxIndex-1)\n    root.Right = build(nums, maxIndex+1, right)\n\n    return root\n}",
    "lineMap": {
      "-": [
        1
      ],
      "call_build": [
        2
      ],
      "check_range": [
        5,
        6
      ],
      "base_case": [
        6,
        7
      ],
      "find_max": [
        11,
        12,
        13,
        14,
        15,
        16
      ],
      "create_node": [
        19
      ],
      "build_left": [
        22
      ],
      "build_right": [
        23
      ],
      "return_node": [
        25
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "base_case": [
        6
      ],
      "has_left": [
        22
      ],
      "has_right": [
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var constructMaximumBinaryTree = function (nums) {\n  return build(nums, 0, nums.length - 1);\n};\n\nfunction build(nums, left, right) {\n  if (left > right) return null;\n\n  // Find the index of the maximum element in the current range\n  var maxIndex = left;\n  for (var i = left + 1; i <= right; i++) {\n    if (nums[i] > nums[maxIndex]) {\n      maxIndex = i;\n    }\n  }\n\n  // Create the root with the maximum value\n  var root = new TreeNode(nums[maxIndex]);\n\n  // Recursively build left and right subtrees\n  root.left = build(nums, left, maxIndex - 1);\n  root.right = build(nums, maxIndex + 1, right);\n\n  return root;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "call_build": [
        2
      ],
      "check_range": [
        5,
        6
      ],
      "base_case": [
        6
      ],
      "find_max": [
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "create_node": [
        17
      ],
      "build_left": [
        20
      ],
      "build_right": [
        21
      ],
      "return_node": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "base_case": [
        6
      ],
      "has_left": [
        20
      ],
      "has_right": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function constructMaximumBinaryTree(nums: number[]): TreeNode | null {\n    return build(nums, 0, nums.length - 1);\n}\n\nfunction build(nums: number[], left: number, right: number): TreeNode | null {\n    if (left > right) return null;\n\n    // Find the index of the maximum element in the current range\n    let maxIndex = left;\n    for (let i = left + 1; i <= right; i++) {\n        if (nums[i] > nums[maxIndex]) {\n            maxIndex = i;\n        }\n    }\n\n    // Create the root with the maximum value\n    const root = new TreeNode(nums[maxIndex]);\n\n    // Recursively build left and right subtrees\n    root.left = build(nums, left, maxIndex - 1);\n    root.right = build(nums, maxIndex + 1, right);\n\n    return root;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "call_build": [
        2
      ],
      "check_range": [
        5,
        6
      ],
      "base_case": [
        6
      ],
      "find_max": [
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "create_node": [
        17
      ],
      "build_left": [
        20
      ],
      "build_right": [
        21
      ],
      "return_node": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "base_case": [
        6
      ],
      "has_left": [
        20
      ],
      "has_right": [
        21
      ]
    }
  }
};

const MaximumBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        3,
        2,
        1,
        6,
        0,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Decreasing",
    "value": {
      "nums": [
        3,
        2,
        1
      ]
    }
  }
];

function generateMaximumBinaryTreeSteps(e: any): any[] {
  
let t=e.nums||[],a={};t.forEach((e,t)=>{a[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let r=new RecursiveStepRecorder({nums:t},a);if(r.pushCallFrame({nums:t},"constructMaximumBinaryTree"),r.add_new_visual("meta_range",{type:"metadata",value:null}),r.record("-","Build a maximum binary tree — the max value in a range is its subtree root"),0===t.length)return r.record("complete","Empty array, return null"),r.popCallFrame(),r.getSteps();let i=0,l=(e,t,a,n,i,l)=>{r.update_visual("meta_range",{type:"metadata",value:{left:e,right:t,maxIndex:a,scanIdx:n,phase:i,side:l}})},s=(e,t,a,n,i)=>{r.update_visual(`frame_${e}`,{type:"metadata",state:t,value:{left:a,right:n,side:i}})},o=(e,t,a,n,i)=>{r.update_visual(`node_${e}`,{type:"binaryTreeNode",value:t,parent:void 0!==a?`node_${a}`:void 0,isLeftChild:n,state:i})};return r.record("call_build",`Call build(0, ${t.length-1})`),!function e(a,n,c,d,u,h){r.pushCallFrame({left:a,right:n},"build");for(let e=0;e<c;e++){let t=r.get_visual(`frame_${e}`);t&&"metadata"===t.type&&r.update_visual(`frame_${e}`,{...t,state:"waiting"})}s(c,"active",a,n,d),l(a,n,-1,-1,"check",d),r.record("check_range",`build(left=${a}, right=${n})`);let m=a>n;if(r.add_conditional("base_case",m),m)return l(a,n,-1,-1,"base",d),s(c,"done",a,n,d),r.record("base_case",`left (${a}) > right (${n}) → empty range, return null`),r.popCallFrame(),null;let f=a;l(a,n,f,a,"scan",d),r.record("find_max",`Scan for max: start at nums[${a}] = ${t[a]}`);for(let e=a+1;e<=n;e++){let i=t[e]>t[f];i&&(f=e),l(a,n,f,e,"scan",d),r.record("find_max",`nums[${e}] = ${t[e]}${i?" is a new max":""} → running max = nums[${f}] = ${t[f]}`)}l(a,n,f,-1,"max",d);let p=i++;o(p,t[f],u,h,"active"),l(a,n,f,-1,"split",d),r.record("create_node",`Max is nums[${f}] = ${t[f]} → new node; it splits the range`);let g=a<=f-1;r.add_conditional("has_left",g),g&&(r.record("build_left",`Left subtree from [${a}, ${f-1}]`),e(a,f-1,c+1,"L",p,!0),r.delete_visual(`frame_${c+1}`),o(p,t[f],u,h,"active"),l(a,n,f,-1,"split",d));let x=f+1<=n;return r.add_conditional("has_right",x),x&&(r.record("build_right",`Right subtree from [${f+1}, ${n}]`),e(f+1,n,c+1,"R",p,!1),r.delete_visual(`frame_${c+1}`),o(p,t[f],u,h,"active"),l(a,n,f,-1,"split",d)),o(p,t[f],u,h,"visited"),s(c,"done",a,n,d),l(a,n,f,-1,"done",d),r.record("return_node",`Return node ${t[f]}`),r.popCallFrame(),p}(0,t.length-1,0,"root"),r.update_visual("meta_range",{type:"metadata",value:null}),r.record("complete","Maximum binary tree complete"),r.popCallFrame(),r.getSteps()
}

export function MaximumBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumBinaryTreeSteps(e) as any[];
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
      title="Maximum Binary Tree"
      slug="maximum-binary-tree"
      approaches={approaches}
      presets={MaximumBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Width of Binary Tree (maximum-width-of-binary-tree)
// ==========================================

const MaximumWidthOfBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "def widthOfBinaryTree(root):\n    nodeQueue = deque([root])\n    indexQueue = deque([0])\n    maxWidth = 0\n\n    while nodeQueue:\n        levelSize = len(nodeQueue)\n        leftmost = indexQueue[0]\n        rightmost = leftmost\n\n        for i in range(levelSize):\n            node = nodeQueue.popleft()\n            idx = indexQueue.popleft()\n            rightmost = idx\n            normalizedIdx = idx - leftmost\n\n            if node.left:\n                nodeQueue.append(node.left)\n                indexQueue.append(2 * normalizedIdx)\n            if node.right:\n                nodeQueue.append(node.right)\n                indexQueue.append(2 * normalizedIdx + 1)\n\n        width = rightmost - leftmost + 1\n        maxWidth = max(maxWidth, width)\n\n    return maxWidth",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "start_level": [
        7,
        8,
        9
      ],
      "process_node": [
        12,
        13,
        14,
        15
      ],
      "enqueue_left": [
        18,
        19
      ],
      "enqueue_right": [
        21,
        22
      ],
      "compute_width": [
        24
      ],
      "update_max": [
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "while_queue": [
        6
      ],
      "for_loop": [
        11
      ],
      "has_left": [
        17
      ],
      "has_right": [
        20
      ],
      "new_max": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int widthOfBinaryTree(TreeNode root) {\n    LinkedList<TreeNode> nodeQueue = new LinkedList<>();\n    LinkedList<Long> indexQueue = new LinkedList<>();\n    nodeQueue.offer(root);\n    indexQueue.offer(0L);\n    long maxWidth = 0;\n\n    while (!nodeQueue.isEmpty()) {\n        int levelSize = nodeQueue.size();\n        long leftmost = indexQueue.peek();\n        long rightmost = leftmost;\n\n        for (int i = 0; i < levelSize; i++) {\n            TreeNode node = nodeQueue.poll();\n            long idx = indexQueue.poll();\n            rightmost = idx;\n            long normalizedIdx = idx - leftmost;\n\n            if (node.left != null) {\n                nodeQueue.offer(node.left);\n                indexQueue.offer(2 * normalizedIdx);\n            }\n            if (node.right != null) {\n                nodeQueue.offer(node.right);\n                indexQueue.offer(2 * normalizedIdx + 1);\n            }\n        }\n\n        maxWidth = Math.max(maxWidth, rightmost - leftmost + 1);\n    }\n\n    return (int) maxWidth;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "start_level": [
        9,
        10,
        11
      ],
      "process_node": [
        14,
        15,
        16,
        17
      ],
      "enqueue_left": [
        20,
        21
      ],
      "enqueue_right": [
        24,
        25
      ],
      "compute_width": [
        29
      ],
      "update_max": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "while_queue": [
        8
      ],
      "for_loop": [
        13
      ],
      "has_left": [
        19
      ],
      "has_right": [
        23
      ],
      "new_max": [
        29
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int widthOfBinaryTree(TreeNode* root) {\n    queue<TreeNode*> nodeQueue;\n    queue<long long> indexQueue;\n    nodeQueue.push(root);\n    indexQueue.push(0);\n    long long maxWidth = 0;\n\n    while (!nodeQueue.empty()) {\n        int levelSize = nodeQueue.size();\n        long long leftmost = indexQueue.front();\n        long long rightmost = leftmost;\n\n        for (int i = 0; i < levelSize; i++) {\n            TreeNode* node = nodeQueue.front();\n            nodeQueue.pop();\n            long long idx = indexQueue.front();\n            indexQueue.pop();\n            rightmost = idx;\n            long long normalizedIdx = idx - leftmost;\n\n            if (node->left) {\n                nodeQueue.push(node->left);\n                indexQueue.push(2 * normalizedIdx);\n            }\n            if (node->right) {\n                nodeQueue.push(node->right);\n                indexQueue.push(2 * normalizedIdx + 1);\n            }\n        }\n\n        maxWidth = max(maxWidth, rightmost - leftmost + 1);\n    }\n\n    return (int) maxWidth;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "start_level": [
        9,
        10,
        11
      ],
      "process_node": [
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "enqueue_left": [
        22,
        23
      ],
      "enqueue_right": [
        26,
        27
      ],
      "compute_width": [
        31
      ],
      "update_max": [
        31
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "while_queue": [
        8
      ],
      "for_loop": [
        13
      ],
      "has_left": [
        21
      ],
      "has_right": [
        25
      ],
      "new_max": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function widthOfBinaryTree(root) {\n    const nodeQueue = [root];\n    const indexQueue = [0];\n    let maxWidth = 0;\n\n    while (nodeQueue.length > 0) {\n        const levelSize = nodeQueue.length;\n        const leftmost = indexQueue[0];\n        let rightmost = leftmost;\n\n        for (let i = 0; i < levelSize; i++) {\n            const node = nodeQueue.shift();\n            const idx = indexQueue.shift();\n            rightmost = idx;\n            const normalizedIdx = idx - leftmost;\n\n            if (node.left) {\n                nodeQueue.push(node.left);\n                indexQueue.push(2 * normalizedIdx);\n            }\n            if (node.right) {\n                nodeQueue.push(node.right);\n                indexQueue.push(2 * normalizedIdx + 1);\n            }\n        }\n\n        maxWidth = Math.max(maxWidth, rightmost - leftmost + 1);\n    }\n\n    return maxWidth;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "start_level": [
        7,
        8,
        9
      ],
      "process_node": [
        12,
        13,
        14,
        15
      ],
      "enqueue_left": [
        18,
        19
      ],
      "enqueue_right": [
        22,
        23
      ],
      "compute_width": [
        27
      ],
      "update_max": [
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "while_queue": [
        6
      ],
      "for_loop": [
        11
      ],
      "has_left": [
        17
      ],
      "has_right": [
        21
      ],
      "new_max": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function widthOfBinaryTree(root: TreeNode): number {\n    const nodeQueue: TreeNode[] = [root];\n    const indexQueue: number[] = [0];\n    let maxWidth = 0;\n\n    while (nodeQueue.length > 0) {\n        const levelSize = nodeQueue.length;\n        const leftmost = indexQueue[0];\n        let rightmost = leftmost;\n\n        for (let i = 0; i < levelSize; i++) {\n            const node = nodeQueue.shift()!;\n            const idx = indexQueue.shift()!;\n            rightmost = idx;\n            const normalizedIdx = idx - leftmost;\n\n            if (node.left) {\n                nodeQueue.push(node.left);\n                indexQueue.push(2 * normalizedIdx);\n            }\n            if (node.right) {\n                nodeQueue.push(node.right);\n                indexQueue.push(2 * normalizedIdx + 1);\n            }\n        }\n\n        maxWidth = Math.max(maxWidth, rightmost - leftmost + 1);\n    }\n\n    return maxWidth;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "start_level": [
        7,
        8,
        9
      ],
      "process_node": [
        12,
        13,
        14,
        15
      ],
      "enqueue_left": [
        18,
        19
      ],
      "enqueue_right": [
        22,
        23
      ],
      "compute_width": [
        27
      ],
      "update_max": [
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "while_queue": [
        6
      ],
      "for_loop": [
        11
      ],
      "has_left": [
        17
      ],
      "has_right": [
        21
      ],
      "new_max": [
        27
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func widthOfBinaryTree(root *TreeNode) int {\n    nodeQueue := []*TreeNode{root}\n    indexQueue := []int{0}\n    maxWidth := 0\n\n    for len(nodeQueue) > 0 {\n        levelSize := len(nodeQueue)\n        leftmost := indexQueue[0]\n        rightmost := leftmost\n\n        for i := 0; i < levelSize; i++ {\n            node := nodeQueue[0]\n            nodeQueue = nodeQueue[1:]\n            idx := indexQueue[0]\n            indexQueue = indexQueue[1:]\n            rightmost = idx\n            normalizedIdx := idx - leftmost\n\n            if node.Left != nil {\n                nodeQueue = append(nodeQueue, node.Left)\n                indexQueue = append(indexQueue, 2*normalizedIdx)\n            }\n            if node.Right != nil {\n                nodeQueue = append(nodeQueue, node.Right)\n                indexQueue = append(indexQueue, 2*normalizedIdx+1)\n            }\n        }\n\n        width := rightmost - leftmost + 1\n        if width > maxWidth {\n            maxWidth = width\n        }\n    }\n\n    return maxWidth\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "start_level": [
        7,
        8,
        9
      ],
      "process_node": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "enqueue_left": [
        20,
        21
      ],
      "enqueue_right": [
        24,
        25
      ],
      "compute_width": [
        29
      ],
      "update_max": [
        30,
        31
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "while_queue": [
        6
      ],
      "for_loop": [
        11
      ],
      "has_left": [
        19
      ],
      "has_right": [
        23
      ],
      "new_max": [
        30
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int WidthOfBinaryTree(TreeNode root) {\n    var nodeQueue = new Queue<TreeNode>();\n    var indexQueue = new Queue<long>();\n    nodeQueue.Enqueue(root);\n    indexQueue.Enqueue(0);\n    long maxWidth = 0;\n\n    while (nodeQueue.Count > 0) {\n        int levelSize = nodeQueue.Count;\n        long leftmost = indexQueue.Peek();\n        long rightmost = leftmost;\n\n        for (int i = 0; i < levelSize; i++) {\n            TreeNode node = nodeQueue.Dequeue();\n            long idx = indexQueue.Dequeue();\n            rightmost = idx;\n            long normalizedIdx = idx - leftmost;\n\n            if (node.left != null) {\n                nodeQueue.Enqueue(node.left);\n                indexQueue.Enqueue(2 * normalizedIdx);\n            }\n            if (node.right != null) {\n                nodeQueue.Enqueue(node.right);\n                indexQueue.Enqueue(2 * normalizedIdx + 1);\n            }\n        }\n\n        maxWidth = Math.Max(maxWidth, rightmost - leftmost + 1);\n    }\n\n    return (int) maxWidth;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "start_level": [
        9,
        10,
        11
      ],
      "process_node": [
        14,
        15,
        16,
        17
      ],
      "enqueue_left": [
        20,
        21
      ],
      "enqueue_right": [
        24,
        25
      ],
      "compute_width": [
        29
      ],
      "update_max": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "while_queue": [
        8
      ],
      "for_loop": [
        13
      ],
      "has_left": [
        19
      ],
      "has_right": [
        23
      ],
      "new_max": [
        29
      ]
    }
  }
};

const MaximumWidthOfBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (width 4)",
    "value": {
      "tree": [
        1,
        3,
        2,
        5,
        3,
        null,
        9
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Wide Gap (width 7)",
    "value": {
      "tree": [
        1,
        3,
        2,
        5,
        null,
        null,
        9,
        6,
        null,
        7
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Complete Tree (width 4)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  }
];

function generateMaximumWidthOfBinaryTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),i=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(i.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);i.has(t)&&(i.get(e).parent=t,i.get(e).isLeftChild=e%2==1)}let l=(e,t)=>{let n=i.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t}},r={};i.forEach((e,t)=>{r[`node_${t}`]=l(t)});let o=new StepRecorder({max_width:0,depth:void 0,index:void 0,currentIdx:void 0,curWidth:void 0},{...r});if(o.record("start","Start: DFS carrying each node's depth and index, recording the leftmost index per depth"),0===i.size)return o.update_variable("max_width",0),o.record("empty_tree","Root is null, dfs returns immediately: maxWidth = 0"),o.getSteps();let a=Math.max(...Array.from(i.keys()).map(e=>Math.floor(Math.log2(e+1))));o.update_variable("maxDepth",a);let s={},u=[],h=[],x=0,f=-1,m=-1,c=-1,p=-1;return o.update_variable("leftmostIndices",[]),o.update_variable("firstIdxSet",[]),o.record("init",`maxWidth = 0, leftmostIndices = [], call dfs(root ${i.get(0).value}, depth 0, index 0)`),!function e(t,n,d){if(!i.has(t))return;let r=i.get(t);s[t]=d,p>=0&&o.update_visual(`node_${p}`,l(p,"visited")),o.update_visual(`node_${t}`,l(t,"current")),p=t;let a=n===u.length;o.update_variable("posMap",{...s}),o.update_variable("depth",n),o.update_variable("index",d),o.update_variable("currentIdx",t),o.update_variable("isNewMax",!1),o.add_conditional("first_at_depth",a),o.record("visit",a?`Visit ${r.value} at depth ${n}, index ${d}: first node at this depth`:`Visit ${r.value} at depth ${n}, index ${d}: leftmostIndices[${n}] = ${u[n]} already recorded`),a&&(u.push(d),h.push(t),o.update_variable("leftmostIndices",[...u]),o.update_variable("firstIdxSet",[...h]),o.record("record_leftmost",`Append ${d} to leftmostIndices: leftmostIndices[${n}] = ${d}`));let g=u[n],v=d-g+1,_=v>x;_&&(x=v,f=n,m=h[n],c=t),o.update_variable("curWidth",v),o.update_variable("isNewMax",_),o.update_variable("max_width",x),o.update_variable("bestDepth",f),o.update_variable("bestLeftIdx",m),o.update_variable("bestRightIdx",c),o.add_conditional("new_max",_),o.record("compute_width",_?`width = ${d} - ${g} + 1 = ${v}, new maxWidth = ${v}`:`width = ${d} - ${g} + 1 = ${v}, maxWidth stays ${x}`);let y=d-g;o.update_variable("isNewMax",!1),o.update_variable("normalizedIndex",y),o.record("normalize",`normalizedIndex = ${d} - ${g} = ${y}: left child gets index ${2*y}, right child ${2*y+1}`),e(2*t+1,n+1,2*y),e(2*t+2,n+1,2*y+1)}(0,0,0),i.forEach((e,t)=>o.update_visual(`node_${t}`,l(t,"done"))),o.update_variable("depth",-1),o.update_variable("currentIdx",-1),o.update_variable("isNewMax",!1),o.record("complete",`Return maxWidth = ${x}`),o.getSteps()
}

export function MaximumWidthOfBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumWidthOfBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumWidthOfBinaryTreeSteps(e) as any[];
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
      title="Maximum Width of Binary Tree"
      slug="maximum-width-of-binary-tree"
      approaches={approaches}
      presets={MaximumWidthOfBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Path Sum II (path-sum-ii)
// ==========================================

const PathSumIiTemplates = {
  "python": {
    "language": "python",
    "code": "def pathSum(root, targetSum):\n    result = []\n    if root is None:\n        return result\n\n    stack = [(root, targetSum, [root.val])]\n\n    while stack:\n        node, remaining, path = stack.pop()\n\n        if not node.left and not node.right and remaining == node.val:\n            result.append(path)\n            continue\n\n        if node.right:\n            stack.append((node.right, remaining - node.val, path + [node.right.val]))\n        if node.left:\n            stack.append((node.left, remaining - node.val, path + [node.left.val]))\n\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3,
        4
      ],
      "init_stack": [
        6
      ],
      "pop_node": [
        9
      ],
      "found_path": [
        11,
        12,
        13
      ],
      "leaf_no_match": [
        11
      ],
      "push_right": [
        15,
        16
      ],
      "push_left": [
        17,
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_empty": [
        3
      ],
      "while_stack": [
        8
      ],
      "is_leaf_match": [
        11
      ],
      "check_right": [
        15
      ],
      "check_left": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> pathSum(TreeNode root, int targetSum) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) {\n        return result;\n    }\n\n    Deque<Object[]> stack = new ArrayDeque<>();\n    List<Integer> rootPath = new ArrayList<>(List.of(root.val));\n    stack.push(new Object[]{root, targetSum, rootPath});\n\n    while (!stack.isEmpty()) {\n        Object[] top = stack.pop();\n        TreeNode node = (TreeNode) top[0];\n        int remaining = (int) top[1];\n        List<Integer> path = (List<Integer>) top[2];\n\n        if (node.left == null && node.right == null && remaining == node.val) {\n            result.add(path);\n            continue;\n        }\n\n        if (node.right != null) {\n            List<Integer> rp = new ArrayList<>(path);\n            rp.add(node.right.val);\n            stack.push(new Object[]{node.right, remaining - node.val, rp});\n        }\n        if (node.left != null) {\n            List<Integer> lp = new ArrayList<>(path);\n            lp.add(node.left.val);\n            stack.push(new Object[]{node.left, remaining - node.val, lp});\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3,
        4,
        5
      ],
      "init_stack": [
        7,
        8,
        9
      ],
      "pop_node": [
        12,
        13,
        14,
        15
      ],
      "found_path": [
        17,
        18,
        19
      ],
      "leaf_no_match": [
        17
      ],
      "push_right": [
        22,
        23,
        24,
        25
      ],
      "push_left": [
        27,
        28,
        29,
        30
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "check_empty": [
        3
      ],
      "while_stack": [
        11
      ],
      "is_leaf_match": [
        17
      ],
      "check_right": [
        22
      ],
      "check_left": [
        27
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> pathSum(TreeNode* root, int targetSum) {\n    vector<vector<int>> result;\n    if (root == nullptr) {\n        return result;\n    }\n\n    stack<tuple<TreeNode*, int, vector<int>>> stk;\n    stk.push({root, targetSum, {root->val}});\n\n    while (!stk.empty()) {\n        auto [node, remaining, path] = stk.top();\n        stk.pop();\n\n        if (!node->left && !node->right && remaining == node->val) {\n            result.push_back(path);\n            continue;\n        }\n\n        if (node->right) {\n            vector<int> rp = path;\n            rp.push_back(node->right->val);\n            stk.push({node->right, remaining - node->val, rp});\n        }\n        if (node->left) {\n            vector<int> lp = path;\n            lp.push_back(node->left->val);\n            stk.push({node->left, remaining - node->val, lp});\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3,
        4,
        5
      ],
      "init_stack": [
        7,
        8
      ],
      "pop_node": [
        11,
        12
      ],
      "found_path": [
        14,
        15,
        16
      ],
      "leaf_no_match": [
        14
      ],
      "push_right": [
        19,
        20,
        21,
        22
      ],
      "push_left": [
        24,
        25,
        26,
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "check_empty": [
        3
      ],
      "while_stack": [
        10
      ],
      "is_leaf_match": [
        14
      ],
      "check_right": [
        19
      ],
      "check_left": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> PathSum(TreeNode root, int targetSum) {\n    var result = new List<IList<int>>();\n    if (root == null) {\n        return result;\n    }\n\n    var stack = new Stack<(TreeNode node, int remaining, List<int> path)>();\n    stack.Push((root, targetSum, new List<int> { root.val }));\n\n    while (stack.Count > 0) {\n        var (node, remaining, path) = stack.Pop();\n\n        if (node.left == null && node.right == null && remaining == node.val) {\n            result.Add(path);\n            continue;\n        }\n\n        if (node.right != null) {\n            var rp = new List<int>(path) { node.right.val };\n            stack.Push((node.right, remaining - node.val, rp));\n        }\n        if (node.left != null) {\n            var lp = new List<int>(path) { node.left.val };\n            stack.Push((node.left, remaining - node.val, lp));\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3,
        4,
        5
      ],
      "init_stack": [
        7,
        8
      ],
      "pop_node": [
        11
      ],
      "found_path": [
        13,
        14,
        15
      ],
      "leaf_no_match": [
        13
      ],
      "push_right": [
        18,
        19,
        20
      ],
      "push_left": [
        22,
        23,
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "check_empty": [
        3
      ],
      "while_stack": [
        10
      ],
      "is_leaf_match": [
        13
      ],
      "check_right": [
        18
      ],
      "check_left": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func pathSum(root *TreeNode, targetSum int) [][]int {\n    result := [][]int{}\n    if root == nil {\n        return result\n    }\n\n    type frame struct {\n        node      *TreeNode\n        remaining int\n        path      []int\n    }\n    stack := []frame{{root, targetSum, []int{root.Val}}}\n\n    for len(stack) > 0 {\n        top := stack[len(stack)-1]\n        stack = stack[:len(stack)-1]\n        node, remaining, path := top.node, top.remaining, top.path\n\n        if node.Left == nil && node.Right == nil && remaining == node.Val {\n            result = append(result, path)\n            continue\n        }\n\n        if node.Right != nil {\n            rp := append(append([]int{}, path...), node.Right.Val)\n            stack = append(stack, frame{node.Right, remaining - node.Val, rp})\n        }\n        if node.Left != nil {\n            lp := append(append([]int{}, path...), node.Left.Val)\n            stack = append(stack, frame{node.Left, remaining - node.Val, lp})\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3,
        4,
        5
      ],
      "init_stack": [
        12
      ],
      "pop_node": [
        15,
        16,
        17
      ],
      "found_path": [
        19,
        20,
        21
      ],
      "leaf_no_match": [
        19
      ],
      "push_right": [
        24,
        25,
        26
      ],
      "push_left": [
        28,
        29,
        30
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "check_empty": [
        3
      ],
      "while_stack": [
        14
      ],
      "is_leaf_match": [
        19
      ],
      "check_right": [
        24
      ],
      "check_left": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function pathSum(root, targetSum) {\n    const result = [];\n    if (root === null) {\n        return result;\n    }\n\n    const stack = [[root, targetSum, [root.val]]];\n\n    while (stack.length > 0) {\n        const [node, remaining, path] = stack.pop();\n\n        if (!node.left && !node.right && remaining === node.val) {\n            result.push(path);\n            continue;\n        }\n\n        if (node.right) {\n            stack.push([node.right, remaining - node.val, [...path, node.right.val]]);\n        }\n        if (node.left) {\n            stack.push([node.left, remaining - node.val, [...path, node.left.val]]);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3,
        4,
        5
      ],
      "init_stack": [
        7
      ],
      "pop_node": [
        10
      ],
      "found_path": [
        12,
        13,
        14
      ],
      "leaf_no_match": [
        12
      ],
      "push_right": [
        17,
        18
      ],
      "push_left": [
        20,
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "check_empty": [
        3
      ],
      "while_stack": [
        9
      ],
      "is_leaf_match": [
        12
      ],
      "check_right": [
        17
      ],
      "check_left": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function pathSum(root: TreeNode | null, targetSum: number): number[][] {\n    const result: number[][] = [];\n    if (root === null) {\n        return result;\n    }\n\n    const stack: [TreeNode, number, number[]][] = [[root, targetSum, [root.val]]];\n\n    while (stack.length > 0) {\n        const [node, remaining, path] = stack.pop()!;\n\n        if (!node.left && !node.right && remaining === node.val) {\n            result.push(path);\n            continue;\n        }\n\n        if (node.right) {\n            stack.push([node.right, remaining - node.val, [...path, node.right.val]]);\n        }\n        if (node.left) {\n            stack.push([node.left, remaining - node.val, [...path, node.left.val]]);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        3,
        4,
        5
      ],
      "init_stack": [
        7
      ],
      "pop_node": [
        10
      ],
      "found_path": [
        12,
        13,
        14
      ],
      "leaf_no_match": [
        12
      ],
      "push_right": [
        17,
        18
      ],
      "push_left": [
        20,
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "check_empty": [
        3
      ],
      "while_stack": [
        9
      ],
      "is_leaf_match": [
        12
      ],
      "check_right": [
        17
      ],
      "check_left": [
        20
      ]
    }
  }
};

const PathSumIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        5,
        4,
        8,
        11,
        null,
        13,
        4,
        7,
        2,
        null,
        null,
        5,
        1
      ],
      "targetSum": 22
    }
  },
  {
    "id": "ex2",
    "label": "No Match",
    "value": {
      "tree": [
        1,
        2,
        3
      ],
      "targetSum": 5
    }
  },
  {
    "id": "ex3",
    "label": "Single Path",
    "value": {
      "tree": [
        1,
        2
      ],
      "targetSum": 1
    }
  },
  {
    "id": "ex4",
    "label": "Perfect Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "targetSum": 11
    }
  }
];

function generatePathSumIiSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),n=e.targetSum??0,i=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(i.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);i.has(t)&&(i.get(e).parent=t,i.get(e).isLeftChild=e%2==1)}let l=(e,t)=>{let n=i.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t}},o={};i.forEach((e,t)=>{o[`node_${t}`]=l(t)});let s=new StepRecorder({target:n,remaining:void 0,currentIdx:void 0,currentVal:void 0,pathIdxs:[],pathVals:[],results:[]},{...o});if(s.record("start",`Start: find every root-to-leaf path summing to ${n}`),0===i.size)return s.update_variable("results",[]),s.record("empty_tree","Root is null: return []"),s.getSteps();let d=[],u=[],h=()=>d.map(e=>i.get(e).value),p=()=>{s.update_variable("pathIdxs",[...d]),s.update_variable("pathVals",h())};return!function e(t,n){let a=i.get(t);d.push(t),p(),s.update_variable("currentIdx",t),s.update_variable("currentVal",a.value),s.update_variable("remaining",n),s.record("visit",`Visit ${a.value}: still need ${n} down this path`);let r=2*t+1,o=2*t+2;if(!i.has(r)&&!i.has(o)){if(n===a.value){let e=h().join("->");u.push(e),d.forEach(e=>s.update_visual(`node_${e}`,l(e,"matched"))),s.update_variable("results",[...u]),s.record("found_path",`Leaf ${a.value} = remaining ${n}: add path [${e}]`)}else s.record("leaf_no_match",`Leaf ${a.value}: remaining ${n} != ${a.value}, skip`);d.pop();return}i.has(r)&&e(r,n-a.value),i.has(o)&&e(o,n-a.value),d.pop(),p(),s.update_variable("currentIdx",d.length>0?d[d.length-1]:-1),s.record("backtrack",`Backtrack from ${a.value}: drop it off the path`)}(0,n),s.update_variable("currentIdx",-1),s.update_variable("pathIdxs",[]),s.update_variable("pathVals",[]),s.update_variable("results",[...u]),s.record("complete",u.length>0?`Found ${u.length} path(s): [${u.map(e=>`[${e}]`).join(", ")}]`:`No root-to-leaf path sums to ${n}: return []`),s.getSteps()
}

export function PathSumIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PathSumIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePathSumIiSteps(e) as any[];
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
      title="Path Sum II"
      slug="path-sum-ii"
      approaches={approaches}
      presets={PathSumIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Populating Next Right Pointers in Each Node (populating-next-right-pointers-in-each-node)
// ==========================================

const PopulatingNextRightPointersInEachNodeTemplates = {
  "python": {
    "language": "python",
    "code": "def connect(root):\n    if not root:\n        return None\n\n    leftmost = root\n\n    while leftmost.left:\n        current = leftmost\n\n        while current:\n            current.left.next = current.right\n\n            if current.next:\n                current.right.next = current.next.left\n\n            current = current.next\n\n        leftmost = leftmost.left\n\n    return root",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        5
      ],
      "start_level": [
        8
      ],
      "same_parent": [
        11
      ],
      "cross_parent": [
        14
      ],
      "move_next": [
        16
      ],
      "drop_down": [
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "has_left": [
        7
      ],
      "has_next": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public Node connect(Node root) {\n    if (root == null) return null;\n\n    Node leftmost = root;\n\n    while (leftmost.left != null) {\n        Node current = leftmost;\n\n        while (current != null) {\n            current.left.next = current.right;\n\n            if (current.next != null) {\n                current.right.next = current.next.left;\n            }\n\n            current = current.next;\n        }\n\n        leftmost = leftmost.left;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        4
      ],
      "start_level": [
        7
      ],
      "same_parent": [
        10
      ],
      "cross_parent": [
        13
      ],
      "move_next": [
        16
      ],
      "drop_down": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "has_left": [
        6
      ],
      "has_next": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "Node* connect(Node* root) {\n    if (root == nullptr) return nullptr;\n\n    Node* leftmost = root;\n\n    while (leftmost->left != nullptr) {\n        Node* current = leftmost;\n\n        while (current != nullptr) {\n            current->left->next = current->right;\n\n            if (current->next != nullptr) {\n                current->right->next = current->next->left;\n            }\n\n            current = current->next;\n        }\n\n        leftmost = leftmost->left;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        4
      ],
      "start_level": [
        7
      ],
      "same_parent": [
        10
      ],
      "cross_parent": [
        13
      ],
      "move_next": [
        16
      ],
      "drop_down": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "has_left": [
        6
      ],
      "has_next": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public Node Connect(Node root) {\n    if (root == null) return null;\n\n    Node leftmost = root;\n\n    while (leftmost.left != null) {\n        Node current = leftmost;\n\n        while (current != null) {\n            current.left.next = current.right;\n\n            if (current.next != null) {\n                current.right.next = current.next.left;\n            }\n\n            current = current.next;\n        }\n\n        leftmost = leftmost.left;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        4
      ],
      "start_level": [
        7
      ],
      "same_parent": [
        10
      ],
      "cross_parent": [
        13
      ],
      "move_next": [
        16
      ],
      "drop_down": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "has_left": [
        6
      ],
      "has_next": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func connect(root *Node) *Node {\n    if root == nil {\n        return nil\n    }\n\n    leftmost := root\n\n    for leftmost.Left != nil {\n        current := leftmost\n\n        for current != nil {\n            current.Left.Next = current.Right\n\n            if current.Next != nil {\n                current.Right.Next = current.Next.Left\n            }\n\n            current = current.Next\n        }\n\n        leftmost = leftmost.Left\n    }\n\n    return root\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        6
      ],
      "start_level": [
        9
      ],
      "same_parent": [
        12
      ],
      "cross_parent": [
        15
      ],
      "move_next": [
        18
      ],
      "drop_down": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_left": [
        8
      ],
      "has_next": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function connect(root) {\n    if (root === null) return null;\n\n    let leftmost = root;\n\n    while (leftmost.left !== null) {\n        let current = leftmost;\n\n        while (current !== null) {\n            current.left.next = current.right;\n\n            if (current.next !== null) {\n                current.right.next = current.next.left;\n            }\n\n            current = current.next;\n        }\n\n        leftmost = leftmost.left;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        4
      ],
      "start_level": [
        7
      ],
      "same_parent": [
        10
      ],
      "cross_parent": [
        13
      ],
      "move_next": [
        16
      ],
      "drop_down": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "has_left": [
        6
      ],
      "has_next": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function connect(root: Node | null): Node | null {\n    if (root === null) return null;\n\n    let leftmost: Node = root;\n\n    while (leftmost.left !== null) {\n        let current: Node | null = leftmost;\n\n        while (current !== null) {\n            current.left!.next = current.right;\n\n            if (current.next !== null) {\n                current.right!.next = current.next.left;\n            }\n\n            current = current.next;\n        }\n\n        leftmost = leftmost.left!;\n    }\n\n    return root;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        4
      ],
      "start_level": [
        7
      ],
      "same_parent": [
        10
      ],
      "cross_parent": [
        13
      ],
      "move_next": [
        16
      ],
      "drop_down": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "has_left": [
        6
      ],
      "has_next": [
        12
      ]
    }
  }
};

const PopulatingNextRightPointersInEachNodePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Perfect Tree (depth 3)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Perfect Tree (depth 2)",
    "value": {
      "tree": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Perfect Tree (depth 4)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ]
    }
  }
];

function generatePopulatingNextRightPointersInEachNodeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let l=(e,t)=>{let n=r.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t}},i={};r.forEach((e,t)=>{i[`node_${t}`]=l(t)});let a=new StepRecorder({currentIdx:void 0,depth:0,connFromIdx:void 0,connToIdx:void 0,viaFromIdx:void 0,viaToIdx:void 0},{...i});if(!r.has(0))return a.record("empty_tree","Empty tree, nothing to connect"),a.getSteps();a.record("start","Start: recursively wire same-parent and cross-parent links");let u=null,s=()=>{u&&(a.update_visual(u.key,{type:"graphEdge",from:u.from,to:u.to,directed:!0,state:"set"}),u=null)},c=(e,t)=>{s(),a.add_new_visual(`next_${e}`,{type:"graphEdge",from:e,to:t,directed:!0,state:"new"}),u={key:`next_${e}`,from:e,to:t}},d=e=>e<t.length&&null!==t[e],p=new Map,f=e=>{for(let[t,r]of Object.entries(e))a.update_variable(t,r)},h=()=>{for(let e of["connFromIdx","connToIdx","viaFromIdx","viaToIdx"])a.delete_variable(e)},x=-1;return!function e(t,n){if(!d(t))return;x>=0&&x!==t&&a.update_visual(`node_${x}`,l(x,"visited")),a.update_visual(`node_${t}`,l(t,"current")),x=t,s(),h(),f({currentIdx:t,depth:n}),a.record("visit",`Visit ${r.get(t).value}; connect its children`);let o=2*t+1,i=2*t+2;if(d(o)){c(o,i),p.set(o,i),f({currentIdx:t,depth:n,connFromIdx:o,connToIdx:i}),a.record("same_parent",`Same parent: ${r.get(o).value}.next = ${r.get(i).value}`);let l=p.get(t)??-1;if(-1!==l){let e=2*l+1;d(e)&&(c(i,e),p.set(i,e),f({currentIdx:t,depth:n,connFromIdx:i,connToIdx:e,viaFromIdx:t,viaToIdx:l}),a.record("cross_parent",`Across parents: ${r.get(i).value}.next = ${r.get(e).value} via ${r.get(t).value}.next`))}e(o,n+1),e(i,n+1)}}(0,0),s(),r.forEach((e,t)=>a.update_visual(`node_${t}`,l(t,"done"))),h(),f({currentIdx:-1}),a.record("complete","All next pointers connected, return root"),a.getSteps()
}

export function PopulatingNextRightPointersInEachNodeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PopulatingNextRightPointersInEachNodeTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePopulatingNextRightPointersInEachNodeSteps(e) as any[];
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
      title="Populating Next Right Pointers in Each Node"
      slug="populating-next-right-pointers-in-each-node"
      approaches={approaches}
      presets={PopulatingNextRightPointersInEachNodePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Serialize and Deserialize Binary Tree (serialize-and-deserialize-binary-tree)
// ==========================================

const SerializeAndDeserializeBinaryTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Codec:\n    def serialize(self, root):\n        result = []\n        self._serialize_dfs(root, result)\n        return \",\".join(result)\n\n    def _serialize_dfs(self, node, result):\n        if node is None:\n            result.append(\"N\")\n            return\n        result.append(str(node.val))\n        self._serialize_dfs(node.left, result)\n        self._serialize_dfs(node.right, result)\n\n    def deserialize(self, data):\n        tokens = data.split(\",\")\n        self.index = 0\n        return self._deserialize_dfs(tokens)\n\n    def _deserialize_dfs(self, tokens):\n        if self.index >= len(tokens) or tokens[self.index] == \"N\":\n            self.index += 1\n            return None\n        node = TreeNode(int(tokens[self.index]))\n        self.index += 1\n        node.left = self._deserialize_dfs(tokens)\n        node.right = self._deserialize_dfs(tokens)\n        return node",
    "lineMap": {
      "start": [
        1
      ],
      "serialize_start": [
        2,
        3,
        4
      ],
      "serialize_value": [
        11
      ],
      "serialize_null": [
        8,
        9
      ],
      "serialize_left": [
        12
      ],
      "serialize_right": [
        13
      ],
      "serialize_done": [
        5
      ],
      "deserialize_start": [
        15,
        16,
        17
      ],
      "consume_token": [
        23,
        24
      ],
      "create_node_deser": [
        23
      ],
      "skip_null": [
        20,
        21,
        22
      ],
      "deserialize_left": [
        25
      ],
      "deserialize_right": [
        26
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_null_deserialize": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public class Codec {\n    public String serialize(TreeNode root) {\n        StringBuilder sb = new StringBuilder();\n        serializeDFS(root, sb);\n        return sb.toString();\n    }\n    private void serializeDFS(TreeNode node, StringBuilder sb) {\n        if (node == null) {\n            sb.append(\"N,\");\n            return;\n        }\n        sb.append(node.val).append(\",\");\n        serializeDFS(node.left, sb);\n        serializeDFS(node.right, sb);\n    }\n    public TreeNode deserialize(String data) {\n        String[] tokens = data.split(\",\");\n        int[] index = {0};\n        return deserializeDFS(tokens, index);\n    }\n    private TreeNode deserializeDFS(String[] tokens, int[] index) {\n        if (index[0] >= tokens.length || tokens[index[0]].equals(\"N\")) {\n            index[0]++;\n            return null;\n        }\n        TreeNode node = new TreeNode(Integer.parseInt(tokens[index[0]]));\n        index[0]++;\n        node.left = deserializeDFS(tokens, index);\n        node.right = deserializeDFS(tokens, index);\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "serialize_start": [
        3,
        4,
        5
      ],
      "serialize_value": [
        11
      ],
      "serialize_null": [
        8,
        9,
        10
      ],
      "serialize_left": [
        12
      ],
      "serialize_right": [
        13
      ],
      "serialize_done": [
        5
      ],
      "deserialize_start": [
        16,
        17,
        18,
        19
      ],
      "consume_token": [
        25,
        26
      ],
      "create_node_deser": [
        25
      ],
      "skip_null": [
        21,
        22,
        23
      ],
      "deserialize_left": [
        27
      ],
      "deserialize_right": [
        28
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_null_deserialize": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Codec {\npublic:\n    string serialize(TreeNode* root) {\n        string result;\n        serializeDFS(root, result);\n        return result;\n    }\nprivate:\n    void serializeDFS(TreeNode* node, string& result) {\n        if (node == nullptr) {\n            result += \"N,\";\n            return;\n        }\n        result += to_string(node->val) + \",\";\n        serializeDFS(node->left, result);\n        serializeDFS(node->right, result);\n    }\npublic:\n    TreeNode* deserialize(string data) {\n        vector<string> tokens;\n        stringstream ss(data);\n        string token;\n        while (getline(ss, token, ',')) tokens.push_back(token);\n        int index = 0;\n        return deserializeDFS(tokens, index);\n    }\nprivate:\n    TreeNode* deserializeDFS(vector<string>& tokens, int& index) {\n        if (index >= tokens.size() || tokens[index] == \"N\") {\n            index++;\n            return nullptr;\n        }\n        TreeNode* node = new TreeNode(stoi(tokens[index]));\n        index++;\n        node->left = deserializeDFS(tokens, index);\n        node->right = deserializeDFS(tokens, index);\n        return node;\n    }\n};",
    "lineMap": {
      "start": [
        1,
        2,
        3
      ],
      "serialize_start": [
        4,
        5,
        6
      ],
      "serialize_value": [
        14
      ],
      "serialize_null": [
        10,
        11,
        12
      ],
      "serialize_left": [
        15
      ],
      "serialize_right": [
        16
      ],
      "serialize_done": [
        6
      ],
      "deserialize_start": [
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "consume_token": [
        29,
        30
      ],
      "create_node_deser": [
        29
      ],
      "skip_null": [
        26,
        27,
        28
      ],
      "deserialize_left": [
        31
      ],
      "deserialize_right": [
        32
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_null_deserialize": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Codec {\n    public string serialize(TreeNode root) {\n        var sb = new StringBuilder();\n        SerializeDFS(root, sb);\n        return sb.ToString();\n    }\n    private void SerializeDFS(TreeNode node, StringBuilder sb) {\n        if (node == null) {\n            sb.Append(\"N,\");\n            return;\n        }\n        sb.Append(node.val).Append(\",\");\n        SerializeDFS(node.left, sb);\n        SerializeDFS(node.right, sb);\n    }\n    public TreeNode deserialize(string data) {\n        var tokens = data.Split(\",\");\n        int index = 0;\n        return DeserializeDFS(tokens, ref index);\n    }\n    private TreeNode DeserializeDFS(string[] tokens, ref int index) {\n        if (index >= tokens.Length || tokens[index] == \"N\") {\n            index++;\n            return null;\n        }\n        var node = new TreeNode(int.Parse(tokens[index]));\n        index++;\n        node.left = DeserializeDFS(tokens, ref index);\n        node.right = DeserializeDFS(tokens, ref index);\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "serialize_start": [
        3,
        4,
        5
      ],
      "serialize_value": [
        12
      ],
      "serialize_null": [
        8,
        9,
        10
      ],
      "serialize_left": [
        13
      ],
      "serialize_right": [
        14
      ],
      "serialize_done": [
        5
      ],
      "deserialize_start": [
        17,
        18,
        19
      ],
      "consume_token": [
        25,
        26
      ],
      "create_node_deser": [
        25
      ],
      "skip_null": [
        22,
        23,
        24
      ],
      "deserialize_left": [
        27
      ],
      "deserialize_right": [
        28
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_null_deserialize": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Codec struct{}\n\nfunc (c *Codec) serialize(root *TreeNode) string {\n    var result []string\n    c.serializeDFS(root, &result)\n    return strings.Join(result, \",\")\n}\n\nfunc (c *Codec) serializeDFS(node *TreeNode, result *[]string) {\n    if node == nil {\n        *result = append(*result, \"N\")\n        return\n    }\n    *result = append(*result, strconv.Itoa(node.Val))\n    c.serializeDFS(node.Left, result)\n    c.serializeDFS(node.Right, result)\n}\n\nfunc (c *Codec) deserialize(data string) *TreeNode {\n    tokens := strings.Split(data, \",\")\n    index := 0\n    return c.deserializeDFS(tokens, &index)\n}\n\nfunc (c *Codec) deserializeDFS(tokens []string, index *int) *TreeNode {\n    if *index >= len(tokens) || tokens[*index] == \"N\" {\n        *index++\n        return nil\n    }\n    val, _ := strconv.Atoi(tokens[*index])\n    node := &TreeNode{Val: val}\n    *index++\n    node.Left = c.deserializeDFS(tokens, index)\n    node.Right = c.deserializeDFS(tokens, index)\n    return node\n}",
    "lineMap": {
      "start": [
        1
      ],
      "serialize_start": [
        3,
        4,
        5,
        6
      ],
      "serialize_value": [
        14
      ],
      "serialize_null": [
        10,
        11,
        12
      ],
      "serialize_left": [
        15
      ],
      "serialize_right": [
        16
      ],
      "serialize_done": [
        6
      ],
      "deserialize_start": [
        19,
        20,
        21,
        22
      ],
      "consume_token": [
        29,
        30,
        31
      ],
      "create_node_deser": [
        30
      ],
      "skip_null": [
        26,
        27,
        28
      ],
      "deserialize_left": [
        32
      ],
      "deserialize_right": [
        33
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "is_null_deserialize": [
        26
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class Codec {\n    serialize(root) {\n        const result = [];\n        this.serializeDFS(root, result);\n        return result.join(\",\");\n    }\n\n    serializeDFS(node, result) {\n        if (node === null) {\n            result.push(\"N\");\n            return;\n        }\n        result.push(String(node.val));\n        this.serializeDFS(node.left, result);\n        this.serializeDFS(node.right, result);\n    }\n\n    deserialize(data) {\n        const tokens = data.split(\",\");\n        const index = { val: 0 };\n        return this.deserializeDFS(tokens, index);\n    }\n\n    deserializeDFS(tokens, index) {\n        if (index.val >= tokens.length || tokens[index.val] === \"N\") {\n            index.val++;\n            return null;\n        }\n        const node = new TreeNode(parseInt(tokens[index.val]));\n        index.val++;\n        node.left = this.deserializeDFS(tokens, index);\n        node.right = this.deserializeDFS(tokens, index);\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "serialize_start": [
        2,
        3,
        4,
        5
      ],
      "serialize_value": [
        13
      ],
      "serialize_null": [
        9,
        10,
        11
      ],
      "serialize_left": [
        14
      ],
      "serialize_right": [
        15
      ],
      "serialize_done": [
        5
      ],
      "deserialize_start": [
        18,
        19,
        20,
        21
      ],
      "consume_token": [
        27,
        28
      ],
      "create_node_deser": [
        27
      ],
      "skip_null": [
        24,
        25,
        26
      ],
      "deserialize_left": [
        29
      ],
      "deserialize_right": [
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_null_deserialize": [
        24
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class Codec {\n    serialize(root: TreeNode | null): string {\n        const result: string[] = [];\n        this.serializeDFS(root, result);\n        return result.join(\",\");\n    }\n\n    serializeDFS(node: TreeNode | null, result: string[]): void {\n        if (node === null) {\n            result.push(\"N\");\n            return;\n        }\n        result.push(String(node.val));\n        this.serializeDFS(node.left, result);\n        this.serializeDFS(node.right, result);\n    }\n\n    deserialize(data: string): TreeNode | null {\n        const tokens = data.split(\",\");\n        const index = { val: 0 };\n        return this.deserializeDFS(tokens, index);\n    }\n\n    deserializeDFS(tokens: string[], index: { val: number }): TreeNode | null {\n        if (index.val >= tokens.length || tokens[index.val] === \"N\") {\n            index.val++;\n            return null;\n        }\n        const node = new TreeNode(parseInt(tokens[index.val]));\n        index.val++;\n        node.left = this.deserializeDFS(tokens, index);\n        node.right = this.deserializeDFS(tokens, index);\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "serialize_start": [
        2,
        3,
        4,
        5
      ],
      "serialize_value": [
        13
      ],
      "serialize_null": [
        9,
        10,
        11
      ],
      "serialize_left": [
        14
      ],
      "serialize_right": [
        15
      ],
      "serialize_done": [
        5
      ],
      "deserialize_start": [
        18,
        19,
        20,
        21
      ],
      "consume_token": [
        27,
        28
      ],
      "create_node_deser": [
        27
      ],
      "skip_null": [
        24,
        25,
        26
      ],
      "deserialize_left": [
        29
      ],
      "deserialize_right": [
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_null_deserialize": [
        24
      ]
    }
  }
};

const SerializeAndDeserializeBinaryTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "tree": [
        1,
        2,
        3,
        null,
        null,
        4,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Left-heavy",
    "value": {
      "tree": [
        1,
        2,
        null,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Complex",
    "value": {
      "tree": [
        5,
        4,
        7,
        3,
        null,
        2,
        null,
        -1,
        null,
        9
      ]
    }
  }
];

function generateSerializeAndDeserializeBinaryTreeSteps(e: any): any[] {
  
let t=e.tree||[],i=(0,_treeHelper848569.Gu)(t),a=[];for(let e=0;e<i.length;e++)null!==i[e]&&void 0!==i[e]&&a.push({index:e,value:i[e],parentIdx:0===e?-1:Math.floor((e-1)/2),isLeftChild:0!==e&&e%2==1});let n={};a.forEach((e,t)=>{n[`node_${t}`]={type:"binaryTreeNode",value:e.value,parent:e.parentIdx>=0?`node_${a.findIndex(t=>t.index===e.parentIdx)}`:void 0,isLeftChild:e.isLeftChild}});let s=new RecursiveStepRecorder({phase:"Serialize"},n);s.pushCallFrame({phase:"Serialize"},"codec"),s.record("start","Start: Serialize and then deserialize the binary tree");let o=[],d=0;function u(e,t){let i=d++;s.add_new_visual(`token_${i}`,{type:"arrayElement",value:e,position:i,state:t||void 0}),o.push(e)}let c=new Map;a.forEach((e,t)=>{if(e.parentIdx>=0){let i=a.findIndex(t=>t.index===e.parentIdx);if(i>=0){c.has(i)||c.set(i,{});let r=c.get(i);e.isLeftChild?r.left=t:r.right=t}}}),s.record("serialize_start","Phase 1: Serialize the tree using preorder DFS"),a.length>0&&function e(t){if(null==t){u("N","active"),s.record("serialize_null",'Node is null, append "N" to serialized string'),s.update_visual(`token_${d-1}`,{type:"arrayElement",value:"N",position:d-1});return}let i=a[t];s.update_visual(`node_${t}`,{type:"binaryTreeNode",value:i.value,parent:i.parentIdx>=0?`node_${a.findIndex(e=>e.index===i.parentIdx)}`:void 0,isLeftChild:i.isLeftChild,state:"active"}),u(String(i.value),"active"),s.record("serialize_value",`Visit node ${i.value}, append "${i.value}" to serialized string`),s.update_visual(`token_${d-1}`,{type:"arrayElement",value:String(i.value),position:d-1}),s.update_visual(`node_${t}`,{type:"binaryTreeNode",value:i.value,parent:i.parentIdx>=0?`node_${a.findIndex(e=>e.index===i.parentIdx)}`:void 0,isLeftChild:i.isLeftChild,state:"visited"});let r=c.get(t),l=r?.left??null;s.record("serialize_left",`Serialize left subtree of node ${i.value}`),e(l);let n=r?.right??null;s.record("serialize_right",`Serialize right subtree of node ${i.value}`),e(n)}(0);let h=o.join(",");s.update_global_variable("serialized",h),s.record("serialize_done",`Serialization complete: "${h}"`),s.update_global_variable("phase","Deserialize"),a.forEach((e,t)=>{s.delete_visual(`node_${t}`)});for(let e=0;e<d;e++)s.update_visual(`token_${e}`,{type:"arrayElement",value:o[e],position:e});s.record("deserialize_start",`Phase 2: Deserialize "${h}" back into a binary tree`);let p=0,g=0;return!function e(t,i){if(p>=o.length)return null;let r=o[p];s.update_visual(`token_${p}`,{type:"arrayElement",value:r,position:p,state:"active"});let l="N"===r;if(s.add_conditional("is_null_deserialize",l),l)return s.record("skip_null",`Token[${p}] = "N", null node, skip`),s.update_visual(`token_${p}`,{type:"arrayElement",value:r,position:p,state:"result"}),p++,null;let a=parseInt(r),n=g++;return s.record("consume_token",`Token[${p}] = "${r}", create node with value ${a}`),s.update_visual(`token_${p}`,{type:"arrayElement",value:r,position:p,state:"result"}),p++,s.add_new_visual(`new_node_${n}`,{type:"binaryTreeNode",value:a,parent:void 0!==t?`new_node_${t}`:void 0,isLeftChild:i,state:"active"}),s.record("create_node_deser",`Created node ${a} in the tree`),s.record("deserialize_left",`Deserialize left child of node ${a}`),e(n,!0),s.record("deserialize_right",`Deserialize right child of node ${a}`),e(n,!1),s.update_visual(`new_node_${n}`,{type:"binaryTreeNode",value:a,parent:void 0!==t?`new_node_${t}`:void 0,isLeftChild:i,state:"visited"}),n}(),s.record("complete","Deserialization complete, original tree has been reconstructed"),s.popCallFrame(),s.getSteps()
}

export function SerializeAndDeserializeBinaryTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SerializeAndDeserializeBinaryTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSerializeAndDeserializeBinaryTreeSteps(e) as any[];
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
      title="Serialize and Deserialize Binary Tree"
      slug="serialize-and-deserialize-binary-tree"
      approaches={approaches}
      presets={SerializeAndDeserializeBinaryTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Step-By-Step Directions From a Binary Tree Node to Another (step-by-step-directions-from-a-binary-tree-node-to-another)
// ==========================================

const StepByStepDirectionsFromABinaryTreeNodeToAnotherTemplates = {
  "python": {
    "language": "python",
    "code": "def getDirections(root, startValue, destValue):\n    lca = findLCA(root, startValue, destValue)\n    pathToStart = []\n    findPath(lca, startValue, pathToStart)\n    pathToDest = []\n    findPath(lca, destValue, pathToDest)\n    result = \"U\" * len(pathToStart) + \"\".join(pathToDest)\n    return result\n\ndef findLCA(node, p, q):\n    if not node or node.val == p or node.val == q:\n        return node\n    left = findLCA(node.left, p, q)\n    right = findLCA(node.right, p, q)\n    if left and right:\n        return node\n    return left if left else right\n\ndef findPath(node, target, path):\n    if not node:\n        return False\n    if node.val == target:\n        return True\n    path.append(\"L\")\n    if findPath(node.left, target, path):\n        return True\n    path.pop()\n    path.append(\"R\")\n    if findPath(node.right, target, path):\n        return True\n    path.pop()\n    return False",
    "lineMap": {
      "init": [
        1
      ],
      "find_lca": [
        2
      ],
      "lca_found": [
        2
      ],
      "find_path_start": [
        3,
        4
      ],
      "find_path_dest": [
        5,
        6
      ],
      "build_result": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def findPath(node, target, path):\n    if not node:\n        return False\n    if node.val == target:\n        return True\n    path.append(\"L\")\n    if findPath(node.left, target, path):\n        return True\n    path.pop()\n    path.append(\"R\")\n    if findPath(node.right, target, path):\n        return True\n    path.pop()\n    return False",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "find_lca": [
        1
      ],
      "lca_base": [
        3
      ],
      "lca_found": [
        1
      ],
      "lca_check": [
        1
      ],
      "find_path_start": [
        1
      ],
      "find_path_dest": [
        1
      ],
      "path_base": [
        3
      ],
      "path_found": [
        5
      ],
      "path_try_left": [
        6,
        7
      ],
      "path_try_right": [
        10,
        11
      ],
      "path_backtrack": [
        14
      ],
      "build_result": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "lca_base_check": [
        2
      ],
      "path_base_check": [
        2
      ],
      "path_found_check": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String getDirections(TreeNode root, int startValue, int destValue) {\n    TreeNode lca = findLCA(root, startValue, destValue);\n    StringBuilder pathToStart = new StringBuilder();\n    findPath(lca, startValue, pathToStart);\n    StringBuilder pathToDest = new StringBuilder();\n    findPath(lca, destValue, pathToDest);\n    StringBuilder result = new StringBuilder();\n    for (int i = 0; i < pathToStart.length(); i++) {\n        result.append('U');\n    }\n    result.append(pathToDest);\n    return result.toString();\n}\n\nprivate TreeNode findLCA(TreeNode node, int p, int q) {\n    if (node == null || node.val == p || node.val == q) return node;\n    TreeNode left = findLCA(node.left, p, q);\n    TreeNode right = findLCA(node.right, p, q);\n    if (left != null && right != null) return node;\n    return left != null ? left : right;\n}\n\nprivate boolean findPath(TreeNode node, int target, StringBuilder path) {\n    if (node == null) return false;\n    if (node.val == target) return true;\n    path.append('L');\n    if (findPath(node.left, target, path)) return true;\n    path.deleteCharAt(path.length() - 1);\n    path.append('R');\n    if (findPath(node.right, target, path)) return true;\n    path.deleteCharAt(path.length() - 1);\n    return false;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "find_lca": [
        2
      ],
      "lca_found": [
        2
      ],
      "find_path_start": [
        3,
        4
      ],
      "find_path_dest": [
        5,
        6
      ],
      "build_result": [
        7,
        8,
        9,
        10,
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private boolean findPath(TreeNode node, int target, StringBuilder path) {\n    if (node == null) return false;\n    if (node.val == target) return true;\n    path.append('L');\n    if (findPath(node.left, target, path)) return true;\n    path.deleteCharAt(path.length() - 1);\n    path.append('R');\n    if (findPath(node.right, target, path)) return true;\n    path.deleteCharAt(path.length() - 1);\n    return false;\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "find_lca": [
        1
      ],
      "lca_base": [
        2
      ],
      "lca_found": [
        1
      ],
      "lca_check": [
        1
      ],
      "find_path_start": [
        1
      ],
      "find_path_dest": [
        1
      ],
      "path_base": [
        2
      ],
      "path_found": [
        3
      ],
      "path_try_left": [
        4,
        5
      ],
      "path_try_right": [
        7,
        8
      ],
      "path_backtrack": [
        10
      ],
      "build_result": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "lca_base_check": [
        2
      ],
      "path_base_check": [
        2
      ],
      "path_found_check": [
        3
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string getDirections(TreeNode* root, int startValue, int destValue) {\n    TreeNode* lca = findLCA(root, startValue, destValue);\n    string pathToStart, pathToDest;\n    findPath(lca, startValue, pathToStart);\n    findPath(lca, destValue, pathToDest);\n    string result(pathToStart.size(), 'U');\n    return result + pathToDest;\n}\n\nTreeNode* findLCA(TreeNode* node, int p, int q) {\n    if (!node || node->val == p || node->val == q) return node;\n    TreeNode* left = findLCA(node->left, p, q);\n    TreeNode* right = findLCA(node->right, p, q);\n    if (left && right) return node;\n    return left ? left : right;\n}\n\nbool findPath(TreeNode* node, int target, string& path) {\n    if (!node) return false;\n    if (node->val == target) return true;\n    path.push_back('L');\n    if (findPath(node->left, target, path)) return true;\n    path.pop_back();\n    path.push_back('R');\n    if (findPath(node->right, target, path)) return true;\n    path.pop_back();\n    return false;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "find_lca": [
        2
      ],
      "lca_found": [
        2
      ],
      "find_path_start": [
        3,
        4
      ],
      "find_path_dest": [
        5
      ],
      "build_result": [
        6
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "bool findPath(TreeNode* node, int target, string& path) {\n    if (!node) return false;\n    if (node->val == target) return true;\n    path.push_back('L');\n    if (findPath(node->left, target, path)) return true;\n    path.pop_back();\n    path.push_back('R');\n    if (findPath(node->right, target, path)) return true;\n    path.pop_back();\n    return false;\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "find_lca": [
        1
      ],
      "lca_base": [
        2
      ],
      "lca_found": [
        1
      ],
      "lca_check": [
        1
      ],
      "find_path_start": [
        1
      ],
      "find_path_dest": [
        1
      ],
      "path_base": [
        2
      ],
      "path_found": [
        3
      ],
      "path_try_left": [
        4,
        5
      ],
      "path_try_right": [
        7,
        8
      ],
      "path_backtrack": [
        10
      ],
      "build_result": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "lca_base_check": [
        2
      ],
      "path_base_check": [
        2
      ],
      "path_found_check": [
        3
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string GetDirections(TreeNode root, int startValue, int destValue) {\n    TreeNode lca = FindLCA(root, startValue, destValue);\n    var pathToStart = new StringBuilder();\n    FindPath(lca, startValue, pathToStart);\n    var pathToDest = new StringBuilder();\n    FindPath(lca, destValue, pathToDest);\n    var result = new string('U', pathToStart.Length);\n    return result + pathToDest.ToString();\n}\n\nprivate TreeNode FindLCA(TreeNode node, int p, int q) {\n    if (node == null || node.val == p || node.val == q) return node;\n    TreeNode left = FindLCA(node.left, p, q);\n    TreeNode right = FindLCA(node.right, p, q);\n    if (left != null && right != null) return node;\n    return left ?? right;\n}\n\nprivate bool FindPath(TreeNode node, int target, StringBuilder path) {\n    if (node == null) return false;\n    if (node.val == target) return true;\n    path.Append('L');\n    if (FindPath(node.left, target, path)) return true;\n    path.Remove(path.Length - 1, 1);\n    path.Append('R');\n    if (FindPath(node.right, target, path)) return true;\n    path.Remove(path.Length - 1, 1);\n    return false;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "find_lca": [
        2
      ],
      "lca_found": [
        2
      ],
      "find_path_start": [
        3,
        4
      ],
      "find_path_dest": [
        5,
        6
      ],
      "build_result": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private bool FindPath(TreeNode node, int target, StringBuilder path) {\n    if (node == null) return false;\n    if (node.val == target) return true;\n    path.Append('L');\n    if (FindPath(node.left, target, path)) return true;\n    path.Remove(path.Length - 1, 1);\n    path.Append('R');\n    if (FindPath(node.right, target, path)) return true;\n    path.Remove(path.Length - 1, 1);\n    return false;\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "find_lca": [
        1
      ],
      "lca_base": [
        2
      ],
      "lca_found": [
        1
      ],
      "lca_check": [
        1
      ],
      "find_path_start": [
        1
      ],
      "find_path_dest": [
        1
      ],
      "path_base": [
        2
      ],
      "path_found": [
        3
      ],
      "path_try_left": [
        4,
        5
      ],
      "path_try_right": [
        7,
        8
      ],
      "path_backtrack": [
        10
      ],
      "build_result": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "lca_base_check": [
        2
      ],
      "path_base_check": [
        2
      ],
      "path_found_check": [
        3
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func getDirections(root *TreeNode, startValue int, destValue int) string {\n    lca := findLCA(root, startValue, destValue)\n    pathToStart := []byte{}\n    findPath(lca, startValue, &pathToStart)\n    pathToDest := []byte{}\n    findPath(lca, destValue, &pathToDest)\n    result := strings.Repeat(\"U\", len(pathToStart))\n    return result + string(pathToDest)\n}\n\nfunc findLCA(node *TreeNode, p int, q int) *TreeNode {\n    if node == nil || node.Val == p || node.Val == q {\n        return node\n    }\n    left := findLCA(node.Left, p, q)\n    right := findLCA(node.Right, p, q)\n    if left != nil && right != nil {\n        return node\n    }\n    if left != nil {\n        return left\n    }\n    return right\n}\n\nfunc findPath(node *TreeNode, target int, path *[]byte) bool {\n    if node == nil {\n        return false\n    }\n    if node.Val == target {\n        return true\n    }\n    *path = append(*path, 'L')\n    if findPath(node.Left, target, path) {\n        return true\n    }\n    *path = (*path)[:len(*path)-1]\n    *path = append(*path, 'R')\n    if findPath(node.Right, target, path) {\n        return true\n    }\n    *path = (*path)[:len(*path)-1]\n    return false\n}",
    "lineMap": {
      "init": [
        1
      ],
      "find_lca": [
        2
      ],
      "lca_found": [
        2
      ],
      "find_path_start": [
        3,
        4
      ],
      "find_path_dest": [
        5,
        6
      ],
      "build_result": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func findPath(node *TreeNode, target int, path *[]byte) bool {\n    if node == nil {\n        return false\n    }\n    if node.Val == target {\n        return true\n    }\n    *path = append(*path, 'L')\n    if findPath(node.Left, target, path) {\n        return true\n    }\n    *path = (*path)[:len(*path)-1]\n    *path = append(*path, 'R')\n    if findPath(node.Right, target, path) {\n        return true\n    }\n    *path = (*path)[:len(*path)-1]\n    return false\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "find_lca": [
        1
      ],
      "lca_base": [
        3
      ],
      "lca_found": [
        1
      ],
      "lca_check": [
        1
      ],
      "find_path_start": [
        1
      ],
      "find_path_dest": [
        1
      ],
      "path_base": [
        3
      ],
      "path_found": [
        6
      ],
      "path_try_left": [
        8,
        9
      ],
      "path_try_right": [
        13,
        14
      ],
      "path_backtrack": [
        18
      ],
      "build_result": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "lca_base_check": [
        2
      ],
      "path_base_check": [
        2
      ],
      "path_found_check": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function getDirections(root, startValue, destValue) {\n    const lca = findLCA(root, startValue, destValue);\n    const pathToStart = [];\n    findPath(lca, startValue, pathToStart);\n    const pathToDest = [];\n    findPath(lca, destValue, pathToDest);\n    return \"U\".repeat(pathToStart.length) + pathToDest.join(\"\");\n}\n\nfunction findLCA(node, p, q) {\n    if (!node || node.val === p || node.val === q) return node;\n    const left = findLCA(node.left, p, q);\n    const right = findLCA(node.right, p, q);\n    if (left && right) return node;\n    return left || right;\n}\n\nfunction findPath(node, target, path) {\n    if (!node) return false;\n    if (node.val === target) return true;\n    path.push(\"L\");\n    if (findPath(node.left, target, path)) return true;\n    path.pop();\n    path.push(\"R\");\n    if (findPath(node.right, target, path)) return true;\n    path.pop();\n    return false;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "find_lca": [
        2
      ],
      "lca_found": [
        2
      ],
      "find_path_start": [
        3,
        4
      ],
      "find_path_dest": [
        5,
        6
      ],
      "build_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function findPath(node, target, path) {\n    if (!node) return false;\n    if (node.val === target) return true;\n    path.push(\"L\");\n    if (findPath(node.left, target, path)) return true;\n    path.pop();\n    path.push(\"R\");\n    if (findPath(node.right, target, path)) return true;\n    path.pop();\n    return false;\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "find_lca": [
        1
      ],
      "lca_base": [
        2
      ],
      "lca_found": [
        1
      ],
      "lca_check": [
        1
      ],
      "find_path_start": [
        1
      ],
      "find_path_dest": [
        1
      ],
      "path_base": [
        2
      ],
      "path_found": [
        3
      ],
      "path_try_left": [
        4,
        5
      ],
      "path_try_right": [
        7,
        8
      ],
      "path_backtrack": [
        10
      ],
      "build_result": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "lca_base_check": [
        2
      ],
      "path_base_check": [
        2
      ],
      "path_found_check": [
        3
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function getDirections(root: TreeNode, startValue: number, destValue: number): string {\n    const lca = findLCA(root, startValue, destValue);\n    const pathToStart: string[] = [];\n    findPath(lca, startValue, pathToStart);\n    const pathToDest: string[] = [];\n    findPath(lca, destValue, pathToDest);\n    return \"U\".repeat(pathToStart.length) + pathToDest.join(\"\");\n}\n\nfunction findLCA(node: TreeNode | null, p: number, q: number): TreeNode | null {\n    if (!node || node.val === p || node.val === q) return node;\n    const left = findLCA(node.left, p, q);\n    const right = findLCA(node.right, p, q);\n    if (left && right) return node;\n    return left || right;\n}\n\nfunction findPath(node: TreeNode | null, target: number, path: string[]): boolean {\n    if (!node) return false;\n    if (node.val === target) return true;\n    path.push(\"L\");\n    if (findPath(node.left, target, path)) return true;\n    path.pop();\n    path.push(\"R\");\n    if (findPath(node.right, target, path)) return true;\n    path.pop();\n    return false;\n}",
    "lineMap": {
      "init": [
        1
      ],
      "find_lca": [
        2
      ],
      "lca_found": [
        2
      ],
      "find_path_start": [
        3,
        4
      ],
      "find_path_dest": [
        5,
        6
      ],
      "build_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function findPath(node: TreeNode | null, target: number, path: string[]): boolean {\n    if (!node) return false;\n    if (node.val === target) return true;\n    path.push(\"L\");\n    if (findPath(node.left, target, path)) return true;\n    path.pop();\n    path.push(\"R\");\n    if (findPath(node.right, target, path)) return true;\n    path.pop();\n    return false;\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "find_lca": [
        1
      ],
      "lca_base": [
        2
      ],
      "lca_found": [
        1
      ],
      "lca_check": [
        1
      ],
      "find_path_start": [
        1
      ],
      "find_path_dest": [
        1
      ],
      "path_base": [
        2
      ],
      "path_found": [
        3
      ],
      "path_try_left": [
        4,
        5
      ],
      "path_try_right": [
        7,
        8
      ],
      "path_backtrack": [
        10
      ],
      "build_result": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "lca_base_check": [
        2
      ],
      "path_base_check": [
        2
      ],
      "path_found_check": [
        3
      ]
    }
  }
};

const StepByStepDirectionsFromABinaryTreeNodeToAnotherPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        5,
        1,
        2,
        3,
        null,
        6,
        4
      ],
      "startValue": 3,
      "destValue": 6
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
    "value": {
      "tree": [
        2,
        1
      ],
      "startValue": 2,
      "destValue": 1
    }
  },
  {
    "id": "ex3",
    "label": "Complete Tree",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "startValue": 4,
      "destValue": 7
    }
  }
];

function generateStepByStepDirectionsFromABinaryTreeNodeToAnotherSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),a=e.startValue,l=e.destValue,i=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(i.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);i.has(t)&&(i.get(e).parent=t,i.get(e).isLeftChild=e%2==1)}let o=-1,d=-1;i.forEach((e,t)=>{e.value===a&&(o=t),e.value===l&&(d=t)});let s=(e,t)=>{let a=i.get(e),r={type:"binaryTreeNode",value:a.value,parent:void 0!==a.parent?`node_${a.parent}`:void 0,isLeftChild:a.isLeftChild};return t&&(r.state=t),r},u={};i.forEach((e,t)=>{u[`node_${t}`]=s(t)});let h=new RecursiveStepRecorder({startValue:a,destValue:l,directions:""},{...u}),c=new Map,p=(e,t)=>{c.set(e,t),h.update_visual(`node_${e}`,s(e,t))},f=[],g=[],_="",x="",m=()=>{h.update_global_variable("directions",_+x)};h.pushCallFrame({root:(0,_treeHelper848569.kU)(i.get(0)),startValue:a,destValue:l},"getDirections"),h.add_new_global_variable("currentIdx",-1),h.add_new_global_variable("lcaIdx",-1),h.add_new_global_variable("phase",""),h.add_new_global_variable("upIdxs",[]),h.add_new_global_variable("downIdxs",[]),h.add_new_global_variable("pIdxG",o),h.add_new_global_variable("qIdxG",d),h.record("init",`Directions from ${a} to ${l}`),h.update_global_variable("phase","lca"),h.record("find_lca",`Phase 1: find the LCA of ${a} and ${l}`);let b=-1,v=-1;b=function e(t){if(!i.has(t))return h.pushCallFrame({node:"null",p:a,q:l},"findLCA"),h.add_conditional("lca_base_check",!0),h.record("lca_base","Null: return null"),h.popCallFrame(),null;let r=i.get(t);if(h.pushCallFrame({node:(0,_treeHelper848569.kU)(r),p:a,q:l},"findLCA"),v>=0&&v!==t&&"current"===c.get(v)&&p(v,void 0),"lca"!==c.get(t)&&p(t,"current"),v=t,h.update_global_variable("currentIdx",t),r.value===a||r.value===l)return h.add_conditional("lca_base_check",!0),h.record("lca_found",`${r.value} is a target: return it up`),h.popCallFrame(),t;h.add_conditional("lca_base_check",!1),h.record("lca_check",`Search under ${r.value}`);let o=e(2*t+1),d=e(2*t+2);if(null!==o&&null!==d)return b=t,h.update_global_variable("lcaIdx",t),p(t,"lca"),h.record("lca_found",`Both sides found a target: ${r.value} is the LCA`),h.popCallFrame(),t;let s=null!==o?o:d;return"current"===c.get(t)&&p(t,void 0),h.record("lca_check",`Pass ${null!==s?"the found node":"null"} up`),h.popCallFrame(),s}(0)??0,h.update_global_variable("lcaIdx",b),i.forEach((e,t)=>{t!==b&&void 0!==c.get(t)&&p(t,void 0)}),p(b,"lca"),h.update_global_variable("currentIdx",b),h.record("lca_found",`LCA is ${i.get(b).value}`),h.update_global_variable("phase","up"),h.record("find_path_start",`Phase 2: reaching start ${a} means climbing up to the LCA (one U per step)`);let y=[];function k(e){return e!==b?(p(e,"onstart"),f.push(e),_+="U",h.update_global_variable("upIdxs",[...f]),m()):p(e,"lca"),h.update_global_variable("currentIdx",e),y.pop(),h.popCallFrame(),!0}!function e(t){if(!i.has(t))return h.pushCallFrame({node:"null",target:a},"findPath"),h.add_conditional("path_base_check",!0),h.record("path_base","Null: return false"),h.popCallFrame(),!1;let r=i.get(t);return(h.pushCallFrame({node:(0,_treeHelper848569.kU)(r),target:a},"findPath"),y.push(t),"lca"!==c.get(t)&&p(t,"current"),h.update_global_variable("currentIdx",t),r.value===a)?(h.add_conditional("path_found_check",!0),p(t,"onstart"),f.push(t),_+="U",h.update_global_variable("upIdxs",[...f]),m(),h.record("path_found",`Reached start ${a}`),y.pop(),!0):(h.add_conditional("path_found_check",!1),h.record("path_try_left",`Try left of ${r.value}`),e(2*t+1)||(h.record("path_try_right",`Try right of ${r.value}`),e(2*t+2)))?k(t):(h.record("path_backtrack",`Dead end: back up from ${r.value}`),"current"===c.get(t)&&p(t,void 0),y.pop(),h.popCallFrame(),!1)}(b),h.update_global_variable("phase","down"),h.record("find_path_dest",`Phase 3: descend from the LCA to dest ${l}, recording L / R`);let j=[];function N(e){return e!==b?(p(e,"ondest"),g.push(e),h.update_global_variable("downIdxs",[...g])):p(e,"lca"),h.update_global_variable("currentIdx",e),j.pop(),h.popCallFrame(),!0}!function e(t){if(!i.has(t))return h.pushCallFrame({node:"null",target:l},"findPath"),h.add_conditional("path_base_check",!0),h.record("path_base","Null: return false"),h.popCallFrame(),!1;let a=i.get(t);h.pushCallFrame({node:(0,_treeHelper848569.kU)(a),target:l},"findPath"),j.push(t);let r=c.get(t);return("lca"!==r&&"ondest"!==r&&"onstart"!==r&&p(t,"current"),h.update_global_variable("currentIdx",t),a.value===l)?(h.add_conditional("path_found_check",!0),p(t,"ondest"),g.push(t),h.update_global_variable("downIdxs",[...g]),h.record("path_found",`Reached dest ${l}`),j.pop(),!0):(h.add_conditional("path_found_check",!1),x+="L",m(),h.record("path_try_left",'Go left: directions += "L"'),e(2*t+1)||(x=x.slice(0,-1),m(),x+="R",m(),h.record("path_try_right",'Left failed, go right: directions += "R"'),e(2*t+2)))?N(t):(x=x.slice(0,-1),m(),h.record("path_backtrack",`Dead end: back up from ${a.value}`),"current"===c.get(t)&&p(t,void 0),j.pop(),h.popCallFrame(),!1)}(b);let w=_+x;return h.update_global_variable("phase","done"),h.update_global_variable("currentIdx",-1),h.record("build_result",`directions = "${_}" (${_.length} U) + "${x}" = "${w}"`),h.popCallFrame(),h.record("complete",`Directions from ${a} to ${l}: "${w}"`),h.getSteps()
}

export function StepByStepDirectionsFromABinaryTreeNodeToAnotherProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: StepByStepDirectionsFromABinaryTreeNodeToAnotherTemplates,
      generateSteps: (e: any) => {
        const recorded = generateStepByStepDirectionsFromABinaryTreeNodeToAnotherSteps(e) as any[];
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
      title="Step-By-Step Directions From a Binary Tree Node to Another"
      slug="step-by-step-directions-from-a-binary-tree-node-to-another"
      approaches={approaches}
      presets={StepByStepDirectionsFromABinaryTreeNodeToAnotherPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Subtree of Another Tree (subtree-of-another-tree)
// ==========================================

const SubtreeOfAnotherTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:\n        if root is None:\n            return False\n\n        # Check if trees rooted here are identical\n        if self.isSameTree(root, subRoot):\n            return True\n\n        # Otherwise, check left and right subtrees\n        return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)\n\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\n        if p is None and q is None:\n            return True\n        if p is None or q is None:\n            return False\n        if p.val != q.val:\n            return False\n\n        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)",
    "lineMap": {
      "start": [
        2
      ],
      "enter": [
        2
      ],
      "null_root": [
        3,
        4
      ],
      "match_found": [
        7,
        8
      ],
      "no_match": [
        7,
        11
      ],
      "try_right": [
        11
      ],
      "return_false": [
        11
      ],
      "propagate_true": [
        11
      ],
      "complete_true": [
        7,
        8,
        11
      ],
      "complete_false": [
        11
      ],
      "pair_both_null": [
        14,
        15
      ],
      "pair_null": [
        16,
        17
      ],
      "pair_diff": [
        18,
        19
      ],
      "pair_match": [
        21
      ]
    },
    "conditionalMap": {
      "check_null_root": [
        3
      ],
      "check_same": [
        7
      ],
      "left_found": [
        11
      ],
      "right_found": [
        11
      ],
      "both_null": [
        14
      ],
      "one_null": [
        16
      ],
      "values_differ": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        if (root == null) return false;\n\n        // Check if trees rooted here are identical\n        if (isSameTree(root, subRoot)) return true;\n\n        // Otherwise, check left and right subtrees\n        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n    }\n\n    private boolean isSameTree(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null) return false;\n        if (p.val != q.val) return false;\n\n        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "enter": [
        2
      ],
      "null_root": [
        3
      ],
      "match_found": [
        6
      ],
      "no_match": [
        6,
        9
      ],
      "try_right": [
        9
      ],
      "return_false": [
        9
      ],
      "propagate_true": [
        9
      ],
      "complete_true": [
        6,
        9
      ],
      "complete_false": [
        9
      ],
      "pair_both_null": [
        13
      ],
      "pair_null": [
        14
      ],
      "pair_diff": [
        15
      ],
      "pair_match": [
        17
      ]
    },
    "conditionalMap": {
      "check_null_root": [
        3
      ],
      "check_same": [
        6
      ],
      "left_found": [
        9
      ],
      "right_found": [
        9
      ],
      "both_null": [
        13
      ],
      "one_null": [
        14
      ],
      "values_differ": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool isSubtree(TreeNode* root, TreeNode* subRoot) {\n        if (root == nullptr) return false;\n\n        // Check if trees rooted here are identical\n        if (isSameTree(root, subRoot)) return true;\n\n        // Otherwise, check left and right subtrees\n        return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);\n    }\n\nprivate:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        if (p == nullptr && q == nullptr) return true;\n        if (p == nullptr || q == nullptr) return false;\n        if (p->val != q->val) return false;\n\n        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "enter": [
        3
      ],
      "null_root": [
        4
      ],
      "match_found": [
        7
      ],
      "no_match": [
        7,
        10
      ],
      "try_right": [
        10
      ],
      "return_false": [
        10
      ],
      "propagate_true": [
        10
      ],
      "complete_true": [
        7,
        10
      ],
      "complete_false": [
        10
      ],
      "pair_both_null": [
        15
      ],
      "pair_null": [
        16
      ],
      "pair_diff": [
        17
      ],
      "pair_match": [
        19
      ]
    },
    "conditionalMap": {
      "check_null_root": [
        4
      ],
      "check_same": [
        7
      ],
      "left_found": [
        10
      ],
      "right_found": [
        10
      ],
      "both_null": [
        15
      ],
      "one_null": [
        16
      ],
      "values_differ": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool IsSubtree(TreeNode root, TreeNode subRoot) {\n        if (root == null) return false;\n\n        // Check if trees rooted here are identical\n        if (IsSameTree(root, subRoot)) return true;\n\n        // Otherwise, check left and right subtrees\n        return IsSubtree(root.left, subRoot) || IsSubtree(root.right, subRoot);\n    }\n\n    private bool IsSameTree(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null) return false;\n        if (p.val != q.val) return false;\n\n        return IsSameTree(p.left, q.left) && IsSameTree(p.right, q.right);\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "enter": [
        2
      ],
      "null_root": [
        3
      ],
      "match_found": [
        6
      ],
      "no_match": [
        6,
        9
      ],
      "try_right": [
        9
      ],
      "return_false": [
        9
      ],
      "propagate_true": [
        9
      ],
      "complete_true": [
        6,
        9
      ],
      "complete_false": [
        9
      ],
      "pair_both_null": [
        13
      ],
      "pair_null": [
        14
      ],
      "pair_diff": [
        15
      ],
      "pair_match": [
        17
      ]
    },
    "conditionalMap": {
      "check_null_root": [
        3
      ],
      "check_same": [
        6
      ],
      "left_found": [
        9
      ],
      "right_found": [
        9
      ],
      "both_null": [
        13
      ],
      "one_null": [
        14
      ],
      "values_differ": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isSubtree(root *TreeNode, subRoot *TreeNode) bool {\n    if root == nil {\n        return false\n    }\n\n    // Check if trees rooted here are identical\n    if isSameTree(root, subRoot) {\n        return true\n    }\n\n    // Otherwise, check left and right subtrees\n    return isSubtree(root.Left, subRoot) || isSubtree(root.Right, subRoot)\n}\n\nfunc isSameTree(p *TreeNode, q *TreeNode) bool {\n    if p == nil && q == nil {\n        return true\n    }\n    if p == nil || q == nil {\n        return false\n    }\n    if p.Val != q.Val {\n        return false\n    }\n\n    return isSameTree(p.Left, q.Left) && isSameTree(p.Right, q.Right)\n}",
    "lineMap": {
      "start": [
        1
      ],
      "enter": [
        1
      ],
      "null_root": [
        2,
        3
      ],
      "match_found": [
        7,
        8
      ],
      "no_match": [
        7,
        12
      ],
      "try_right": [
        12
      ],
      "return_false": [
        12
      ],
      "propagate_true": [
        12
      ],
      "complete_true": [
        7,
        8,
        12
      ],
      "complete_false": [
        12
      ],
      "pair_both_null": [
        16,
        17
      ],
      "pair_null": [
        19,
        20
      ],
      "pair_diff": [
        22,
        23
      ],
      "pair_match": [
        26
      ]
    },
    "conditionalMap": {
      "check_null_root": [
        2
      ],
      "check_same": [
        7
      ],
      "left_found": [
        12
      ],
      "right_found": [
        12
      ],
      "both_null": [
        16
      ],
      "one_null": [
        19
      ],
      "values_differ": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var isSubtree = function(root, subRoot) {\n    if (root === null) return false;\n\n    // Check if trees rooted here are identical\n    if (isSameTree(root, subRoot)) return true;\n\n    // Otherwise, check left and right subtrees\n    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n};\n\nvar isSameTree = function(p, q) {\n    if (p === null && q === null) return true;\n    if (p === null || q === null) return false;\n    if (p.val !== q.val) return false;\n\n    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n};",
    "lineMap": {
      "start": [
        1
      ],
      "enter": [
        1
      ],
      "null_root": [
        2
      ],
      "match_found": [
        5
      ],
      "no_match": [
        5,
        8
      ],
      "try_right": [
        8
      ],
      "return_false": [
        8
      ],
      "propagate_true": [
        8
      ],
      "complete_true": [
        5,
        8
      ],
      "complete_false": [
        8
      ],
      "pair_both_null": [
        12
      ],
      "pair_null": [
        13
      ],
      "pair_diff": [
        14
      ],
      "pair_match": [
        16
      ]
    },
    "conditionalMap": {
      "check_null_root": [
        2
      ],
      "check_same": [
        5
      ],
      "left_found": [
        8
      ],
      "right_found": [
        8
      ],
      "both_null": [
        12
      ],
      "one_null": [
        13
      ],
      "values_differ": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {\n    if (root === null) return false;\n\n    // Check if trees rooted here are identical\n    if (isSameTree(root, subRoot)) return true;\n\n    // Otherwise, check left and right subtrees\n    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n}\n\nfunction isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {\n    if (p === null && q === null) return true;\n    if (p === null || q === null) return false;\n    if (p.val !== q.val) return false;\n\n    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "enter": [
        1
      ],
      "null_root": [
        2
      ],
      "match_found": [
        5
      ],
      "no_match": [
        5,
        8
      ],
      "try_right": [
        8
      ],
      "return_false": [
        8
      ],
      "propagate_true": [
        8
      ],
      "complete_true": [
        5,
        8
      ],
      "complete_false": [
        8
      ],
      "pair_both_null": [
        12
      ],
      "pair_null": [
        13
      ],
      "pair_diff": [
        14
      ],
      "pair_match": [
        16
      ]
    },
    "conditionalMap": {
      "check_null_root": [
        2
      ],
      "check_same": [
        5
      ],
      "left_found": [
        8
      ],
      "right_found": [
        8
      ],
      "both_null": [
        12
      ],
      "one_null": [
        13
      ],
      "values_differ": [
        14
      ]
    }
  }
};

const SubtreeOfAnotherTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (true)",
    "value": {
      "tree": [
        3,
        4,
        5,
        1,
        2
      ],
      "subTree": [
        4,
        1,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (false)",
    "value": {
      "tree": [
        3,
        4,
        5,
        1,
        2,
        null,
        null,
        null,
        null,
        0
      ],
      "subTree": [
        4,
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Match Mid-Tree (true)",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5
      ],
      "subTree": [
        2,
        4,
        5
      ]
    }
  }
];

function generateSubtreeOfAnotherTreeSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=(0,_treeHelper848569.Gu)(e.subTree||[]),o=e=>{let t=new Map;for(let r=0;r<e.length;r++)if(null!==e[r]&&(t.set(r,{value:e[r],index:r}),r>0)){let e=Math.floor((r-1)/2);t.has(e)&&(t.get(r).parent=e,t.get(r).isLeftChild=r%2==1)}return t},i=o(t),n=o(r),s=(e,t)=>{let r=i.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`main_node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,state:t}},u=(e,t)=>{let r=n.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`sub_node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,state:t}},h={};i.forEach((e,t)=>{h[`main_node_${t}`]=s(t)}),n.forEach((e,t)=>{h[`sub_node_${t}`]=u(t)});let d=new StepRecorder({found:!1,node:void 0,callStack:[],currentIdx:-1},{...h});d.record("start","Start: visit every node of root and check whether the tree rooted there is identical to subRoot");let c=[],f=new Set,p=new Set,g=new Set,m=new Set,b=e=>{i.forEach((t,r)=>{let a;f.has(r)?a="matched":g.has(r)?a="pairok":r===e?a="candidate":c.includes(r)?a="onstack":p.has(r)&&(a="visited"),d.update_visual(`main_node_${r}`,s(r,a))})},_=e=>{d.update_variable("callStack",c.map(e=>i.has(e)?i.get(e).value:null)),d.update_variable("currentIdx",e);let t=i.get(e);d.update_variable("node",t?(0,_treeHelper848569.kU)(t):null)},x=e=>{i.has(e)&&(f.add(e),x(2*e+1),x(2*e+2))},v=function e(t){c.push(t);let r=i.get(t),a=!r;if(d.add_conditional("check_null_root",a),a)return _(t),d.record("null_root","isSubtree(null): there is no subtree to match against, return false"),c.pop(),!1;let l=r.value;b(t),_(t),d.record("enter",`isSubtree(${l}): is the tree rooted at ${l} identical to subRoot?`);let o=function e(t,r,a){let l=i.get(t)??null,o=n.get(r)??null;d.update_variable("mIdx",t),d.update_variable("sIdx",r),d.update_variable("mVal",i.get(t)?.value??null),d.update_variable("sVal",n.get(r)?.value??null);let h=!l&&!o;if(d.add_conditional("both_null",h),h)return d.record("pair_both_null","∅ vs ∅: both positions are empty, identical here"),!0;let c=!l||!o;if(d.add_conditional("one_null",c),c){let e=l?`${l.value}`:"∅",t=o?`${o.value}`:"∅";return d.record("pair_null",`${e} vs ${t}: one node is missing, the trees differ`),!1}let f=l.value!==o.value;return(d.add_conditional("values_differ",f),f)?(d.record("pair_diff",`${l.value} vs ${o.value}: values differ, the trees differ`),!1):(a||(g.add(t),d.update_visual(`main_node_${t}`,s(t,"pairok"))),m.add(r),d.update_visual(`sub_node_${r}`,u(r,"pairok")),d.record("pair_match",`${l.value} = ${o.value}, compare the left and right children`),e(2*t+1,2*r+1,!1)&&e(2*t+2,2*r+2,!1))}(t,0,!0);if(d.add_conditional("check_same",o),o)return x(t),g=new Set,m=new Set,b(t),n.forEach((e,t)=>{d.update_visual(`sub_node_${t}`,u(t,"matched"))}),d.update_variable("found",!0),d.record("match_found",`The tree rooted at ${l} is identical to subRoot: return true`),c.pop(),!0;g=new Set,m.forEach(e=>{d.update_visual(`sub_node_${e}`,u(e))}),m=new Set,b(t),d.record("no_match",`Not identical at ${l}: check whether subRoot is a subtree of ${l}'s left subtree`);let h=e(2*t+1);if(d.add_conditional("left_found",h),h)return c.pop(),p.add(t),b(-1),_(c.length>0?c[c.length-1]:-1),d.record("propagate_true",`The left subtree of ${l} contains a match, so isSubtree(${l}) returns true`),!0;b(t),_(t),d.record("try_right",`No match in the left subtree of ${l}: check the right subtree of ${l}`);let f=e(2*t+2);return(d.add_conditional("right_found",f),c.pop(),p.add(t),b(-1),_(c.length>0?c[c.length-1]:-1),f)?(d.record("propagate_true",`The right subtree of ${l} contains a match, so isSubtree(${l}) returns true`),!0):(d.record("return_false",`isSubtree(${l}) is false: no match at ${l} or below, return to ${c.length>0?`${i.get(c[c.length-1]).value}`:"the caller"}`),!1)}(0);return d.update_variable("callStack",[]),d.update_variable("currentIdx",-1),d.update_variable("node",null),v?d.record("complete_true","subRoot is a subtree of root: return true"):d.record("complete_false","No node of root has a subtree identical to subRoot: return false"),d.getSteps()
}

export function SubtreeOfAnotherTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SubtreeOfAnotherTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSubtreeOfAnotherTreeSteps(e) as any[];
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
      title="Subtree of Another Tree"
      slug="subtree-of-another-tree"
      approaches={approaches}
      presets={SubtreeOfAnotherTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sum of Left Leaves (sum-of-left-leaves)
// ==========================================

const SumOfLeftLeavesTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def sumOfLeftLeaves(self, root: Optional[TreeNode]) -> int:\n        if root is None:\n            return 0\n\n        total = 0\n\n        # Check if the left child is a leaf\n        if root.left and not root.left.left and not root.left.right:\n            total += root.left.val\n        else:\n            # Left child is not a leaf, recurse into it\n            total += self.sumOfLeftLeaves(root.left)\n\n        # Always recurse into the right subtree\n        total += self.sumOfLeftLeaves(root.right)\n\n        return total",
    "lineMap": {
      "start": [
        2
      ],
      "empty_tree": [
        3,
        4
      ],
      "visit": [
        3,
        6
      ],
      "check_left": [
        9
      ],
      "add_left_leaf": [
        10
      ],
      "recurse_left": [
        13
      ],
      "return_left": [
        13
      ],
      "no_left": [
        13
      ],
      "recurse_right": [
        16
      ],
      "return_right": [
        16
      ],
      "no_right": [
        16
      ],
      "return_sum": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_null": [
        3
      ],
      "check_left_leaf": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int sumOfLeftLeaves(TreeNode root) {\n        if (root == null) return 0;\n\n        int sum = 0;\n\n        // Check if the left child is a leaf\n        if (root.left != null && root.left.left == null && root.left.right == null) {\n            sum += root.left.val;\n        } else {\n            // Left child is not a leaf, recurse into it\n            sum += sumOfLeftLeaves(root.left);\n        }\n\n        // Always recurse into the right subtree\n        sum += sumOfLeftLeaves(root.right);\n\n        return sum;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "empty_tree": [
        3
      ],
      "visit": [
        3,
        5
      ],
      "check_left": [
        8
      ],
      "add_left_leaf": [
        9
      ],
      "recurse_left": [
        12
      ],
      "return_left": [
        12
      ],
      "no_left": [
        12
      ],
      "recurse_right": [
        16
      ],
      "return_right": [
        16
      ],
      "no_right": [
        16
      ],
      "return_sum": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_null": [
        3
      ],
      "check_left_leaf": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int sumOfLeftLeaves(TreeNode* root) {\n        if (root == nullptr) return 0;\n\n        int sum = 0;\n\n        // Check if the left child is a leaf\n        if (root->left != nullptr && root->left->left == nullptr && root->left->right == nullptr) {\n            sum += root->left->val;\n        } else {\n            // Left child is not a leaf, recurse into it\n            sum += sumOfLeftLeaves(root->left);\n        }\n\n        // Always recurse into the right subtree\n        sum += sumOfLeftLeaves(root->right);\n\n        return sum;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "empty_tree": [
        4
      ],
      "visit": [
        4,
        6
      ],
      "check_left": [
        9
      ],
      "add_left_leaf": [
        10
      ],
      "recurse_left": [
        13
      ],
      "return_left": [
        13
      ],
      "no_left": [
        13
      ],
      "recurse_right": [
        17
      ],
      "return_right": [
        17
      ],
      "no_right": [
        17
      ],
      "return_sum": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_null": [
        4
      ],
      "check_left_leaf": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int SumOfLeftLeaves(TreeNode root) {\n        if (root == null) return 0;\n\n        int sum = 0;\n\n        // Check if the left child is a leaf\n        if (root.left != null && root.left.left == null && root.left.right == null) {\n            sum += root.left.val;\n        } else {\n            // Left child is not a leaf, recurse into it\n            sum += SumOfLeftLeaves(root.left);\n        }\n\n        // Always recurse into the right subtree\n        sum += SumOfLeftLeaves(root.right);\n\n        return sum;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "empty_tree": [
        3
      ],
      "visit": [
        3,
        5
      ],
      "check_left": [
        8
      ],
      "add_left_leaf": [
        9
      ],
      "recurse_left": [
        12
      ],
      "return_left": [
        12
      ],
      "no_left": [
        12
      ],
      "recurse_right": [
        16
      ],
      "return_right": [
        16
      ],
      "no_right": [
        16
      ],
      "return_sum": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_null": [
        3
      ],
      "check_left_leaf": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func sumOfLeftLeaves(root *TreeNode) int {\n    if root == nil {\n        return 0\n    }\n\n    sum := 0\n\n    // Check if the left child is a leaf\n    if root.Left != nil && root.Left.Left == nil && root.Left.Right == nil {\n        sum += root.Left.Val\n    } else {\n        // Left child is not a leaf, recurse into it\n        sum += sumOfLeftLeaves(root.Left)\n    }\n\n    // Always recurse into the right subtree\n    sum += sumOfLeftLeaves(root.Right)\n\n    return sum\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "visit": [
        2,
        6
      ],
      "check_left": [
        9
      ],
      "add_left_leaf": [
        10
      ],
      "recurse_left": [
        13
      ],
      "return_left": [
        13
      ],
      "no_left": [
        13
      ],
      "recurse_right": [
        17
      ],
      "return_right": [
        17
      ],
      "no_right": [
        17
      ],
      "return_sum": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "check_left_leaf": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var sumOfLeftLeaves = function (root) {\n  if (root === null) return 0;\n\n  let sum = 0;\n\n  // Check if the left child is a leaf\n  if (root.left !== null && root.left.left === null && root.left.right === null) {\n    sum += root.left.val;\n  } else {\n    // Left child is not a leaf, recurse into it\n    sum += sumOfLeftLeaves(root.left);\n  }\n\n  // Always recurse into the right subtree\n  sum += sumOfLeftLeaves(root.right);\n\n  return sum;\n};",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2
      ],
      "visit": [
        2,
        4
      ],
      "check_left": [
        7
      ],
      "add_left_leaf": [
        8
      ],
      "recurse_left": [
        11
      ],
      "return_left": [
        11
      ],
      "no_left": [
        11
      ],
      "recurse_right": [
        15
      ],
      "return_right": [
        15
      ],
      "no_right": [
        15
      ],
      "return_sum": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "check_left_leaf": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sumOfLeftLeaves(root: TreeNode | null): number {\n    if (root === null) return 0;\n\n    let sum = 0;\n\n    // Check if the left child is a leaf\n    if (root.left !== null && root.left.left === null && root.left.right === null) {\n        sum += root.left.val;\n    } else {\n        // Left child is not a leaf, recurse into it\n        sum += sumOfLeftLeaves(root.left);\n    }\n\n    // Always recurse into the right subtree\n    sum += sumOfLeftLeaves(root.right);\n\n    return sum;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2
      ],
      "visit": [
        2,
        4
      ],
      "check_left": [
        7
      ],
      "add_left_leaf": [
        8
      ],
      "recurse_left": [
        11
      ],
      "return_left": [
        11
      ],
      "no_left": [
        11
      ],
      "recurse_right": [
        15
      ],
      "return_right": [
        15
      ],
      "no_right": [
        15
      ],
      "return_sum": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_null": [
        2
      ],
      "check_left_leaf": [
        7
      ]
    }
  }
};

const SumOfLeftLeavesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (sum=24)",
    "value": {
      "tree": [
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (sum=4)",
    "value": {
      "tree": [
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
    "label": "Right Leaves Don't Count (sum=8)",
    "value": {
      "tree": [
        5,
        3,
        8,
        1,
        4,
        7,
        9
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single Node (sum=0)",
    "value": {
      "tree": [
        1
      ]
    }
  }
];

function generateSumOfLeftLeavesSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),l=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(l.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);l.has(t)&&(l.get(e).parent=t,l.get(e).isLeftChild=e%2==1)}let n=(e,t)=>{let r=l.get(e);return{type:"binaryTreeNode",value:r.value,parent:void 0!==r.parent?`node_${r.parent}`:void 0,isLeftChild:r.isLeftChild,state:t}},a={};l.forEach((e,t)=>{a[`node_${t}`]=n(t)});let u=new StepRecorder({sum:0,added:[],currentIdx:void 0,pathIdxs:[],isLeft:void 0,checkedIdx:void 0,checkedVal:void 0,local:void 0,returned:void 0},{...a});if(u.record("start","Start: at each node, check whether its left child is a leaf"),0===l.size)return u.add_conditional("check_null",!0),u.update_variable("sum",0),u.record("empty_tree","Empty tree, return 0"),u.getSteps();let o=0,s=[],d=[],f=new Set,c=new Set,h=(e=-1)=>{let t=d.length>0?d[d.length-1]:-1;l.forEach((l,r)=>{let i;f.has(r)?i="counted":r===e?i="checking":r===t?i="current":d.includes(r)?i="onpath":c.has(r)&&(i="visited"),u.update_visual(`node_${r}`,n(r,i))})},g=e=>{if(0===e)return"root";let t=l.get(l.get(e).parent).value;return`${l.get(e).isLeftChild?"left":"right"} child of ${t}`},p=(e,t)=>{u.update_variable("currentIdx",e),u.update_variable("pathIdxs",[...d]),u.update_variable("isLeft",0!==e&&!0===l.get(e).isLeftChild),u.update_variable("local",t)};return!function e(t){let r=l.get(t);d.push(t);let i=0;u.add_conditional("check_null",!1),u.update_variable("checkedIdx",-1),u.update_variable("checkedVal",void 0),u.update_variable("returned",void 0),p(t,i),h(),u.record("visit",`Call sumOfLeftLeaves(${r.value}) (${g(t)}): sum = 0 for this call`);let n=2*t+1,a=2*t+2,m=!l.has(n)&&!l.has(a);if(l.has(n)){let a,d,c=l.get(n),g=(a=2*n+1,!l.has(a)&&(d=2*n+2,!l.has(d)));if(u.update_variable("checkedIdx",n),u.update_variable("checkedVal",c.value),u.add_conditional("check_left_leaf",g),h(n),u.record("check_left",`Check: is left child ${c.value} a leaf?`),g)i+=c.value,o+=c.value,s.push(c.value),f.add(n),u.update_variable("sum",o),u.update_variable("added",[...s]),u.update_variable("local",i),h(),u.record("add_left_leaf",`Node ${c.value} has no children, it is a left leaf. sum += ${c.value}, sum = ${o}`);else{h(),u.record("recurse_left",`Left child ${c.value} has children, not a leaf: recurse into the left subtree`);let l=e(n);i+=l,u.update_variable("returned",l),p(t,i),h(),u.record("return_left",`Back at ${r.value}: the left subtree returned ${l}, sum = ${i} for this call`)}}else u.add_conditional("check_left_leaf",!1),u.update_variable("checkedIdx",-1),h(),u.record("no_left",m?`${r.value} has no left child (it is a leaf reached as the ${g(t)}, so it is not counted): the call on null returns 0`:`${r.value} has no left child: the call on null returns 0`);if(l.has(a)){let n=l.get(a);h(),u.record("recurse_right",`Recurse into the right subtree of ${r.value} (right child ${n.value})`);let o=e(a);i+=o,u.update_variable("returned",o),p(t,i),h(),u.record("return_right",`Back at ${r.value}: the right subtree returned ${o}, sum = ${i} for this call`)}else h(),u.record("no_right",`${r.value} has no right child: the call on null returns 0`);return u.update_variable("returned",i),u.update_variable("local",i),h(),u.record("return_sum",`sumOfLeftLeaves(${r.value}) returns ${i}`),d.pop(),c.add(t),i}(0),u.update_variable("sum",o),u.update_variable("currentIdx",-1),u.update_variable("checkedIdx",-1),u.update_variable("pathIdxs",[]),h(),u.record("complete",`Sum of left leaves = ${o}`),u.getSteps()
}

export function SumOfLeftLeavesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SumOfLeftLeavesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSumOfLeftLeavesSteps(e) as any[];
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
      title="Sum of Left Leaves"
      slug="sum-of-left-leaves"
      approaches={approaches}
      presets={SumOfLeftLeavesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sum Root to Leaf Numbers (sum-root-to-leaf-numbers)
// ==========================================

const SumRootToLeafNumbersTemplates = {
  "python": {
    "language": "python",
    "code": "def sumNumbers(root):\n    return dfs(root, 0)",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def dfs(node, currentNum):\n    if not node:\n        return 0\n    currentNum = currentNum * 10 + node.val\n    if not node.left and not node.right:\n        return currentNum\n    return dfs(node.left, currentNum) + dfs(node.right, currentNum)",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "base_case_null": [
        3
      ],
      "form_number": [
        4
      ],
      "add_to_sum": [
        6
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        7
      ],
      "return_sum": [
        7
      ]
    },
    "recursiveConditionalMap": {
      "is_null": [
        2
      ],
      "is_leaf": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int sumNumbers(TreeNode root) {\n        return dfs(root, 0);\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "start_dfs": [
        3
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private int dfs(TreeNode node, int currentNum) {\n    if (node == null) return 0;\n    currentNum = currentNum * 10 + node.val;\n    if (node.left == null && node.right == null) {\n        return currentNum;\n    }\n    return dfs(node.left, currentNum) + dfs(node.right, currentNum);\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "base_case_null": [
        2
      ],
      "form_number": [
        3
      ],
      "add_to_sum": [
        5
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        7
      ],
      "return_sum": [
        7
      ]
    },
    "recursiveConditionalMap": {
      "is_null": [
        2
      ],
      "is_leaf": [
        4
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int sumNumbers(TreeNode* root) {\n        return dfs(root, 0);\n    }\n};",
    "lineMap": {
      "init": [
        3
      ],
      "start_dfs": [
        4
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "int dfs(TreeNode* node, int currentNum) {\n    if (node == nullptr) return 0;\n    currentNum = currentNum * 10 + node->val;\n    if (node->left == nullptr && node->right == nullptr) {\n        return currentNum;\n    }\n    return dfs(node->left, currentNum) + dfs(node->right, currentNum);\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "base_case_null": [
        2
      ],
      "form_number": [
        3
      ],
      "add_to_sum": [
        5
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        7
      ],
      "return_sum": [
        7
      ]
    },
    "recursiveConditionalMap": {
      "is_null": [
        2
      ],
      "is_leaf": [
        4
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int SumNumbers(TreeNode root) {\n        return Dfs(root, 0);\n    }\n}",
    "lineMap": {
      "init": [
        2
      ],
      "start_dfs": [
        3
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private int Dfs(TreeNode node, int currentNum) {\n    if (node == null) return 0;\n    currentNum = currentNum * 10 + node.val;\n    if (node.left == null && node.right == null) {\n        return currentNum;\n    }\n    return Dfs(node.left, currentNum) + Dfs(node.right, currentNum);\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "base_case_null": [
        2
      ],
      "form_number": [
        3
      ],
      "add_to_sum": [
        5
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        7
      ],
      "return_sum": [
        7
      ]
    },
    "recursiveConditionalMap": {
      "is_null": [
        2
      ],
      "is_leaf": [
        4
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func sumNumbers(root *TreeNode) int {\n    return dfs(root, 0)\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func dfs(node *TreeNode, currentNum int) int {\n    if node == nil {\n        return 0\n    }\n    currentNum = currentNum * 10 + node.Val\n    if node.Left == nil && node.Right == nil {\n        return currentNum\n    }\n    return dfs(node.Left, currentNum) + dfs(node.Right, currentNum)\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "base_case_null": [
        3
      ],
      "form_number": [
        5
      ],
      "add_to_sum": [
        7
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        9
      ],
      "return_sum": [
        9
      ]
    },
    "recursiveConditionalMap": {
      "is_null": [
        2
      ],
      "is_leaf": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function sumNumbers(root) {\n    return dfs(root, 0);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function dfs(node, currentNum) {\n    if (node === null) return 0;\n    currentNum = currentNum * 10 + node.val;\n    if (node.left === null && node.right === null) {\n        return currentNum;\n    }\n    return dfs(node.left, currentNum) + dfs(node.right, currentNum);\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "base_case_null": [
        2
      ],
      "form_number": [
        3
      ],
      "add_to_sum": [
        5
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        7
      ],
      "return_sum": [
        7
      ]
    },
    "recursiveConditionalMap": {
      "is_null": [
        2
      ],
      "is_leaf": [
        4
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sumNumbers(root: TreeNode | null): number {\n    return dfs(root, 0);\n}",
    "lineMap": {
      "init": [
        1
      ],
      "start_dfs": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function dfs(node: TreeNode | null, currentNum: number): number {\n    if (node === null) return 0;\n    currentNum = currentNum * 10 + node.val;\n    if (node.left === null && node.right === null) {\n        return currentNum;\n    }\n    return dfs(node.left, currentNum) + dfs(node.right, currentNum);\n}",
    "recursiveLineMap": {
      "init": [
        1
      ],
      "base_case_null": [
        2
      ],
      "form_number": [
        3
      ],
      "add_to_sum": [
        5
      ],
      "recurse_left": [
        7
      ],
      "recurse_right": [
        7
      ],
      "return_sum": [
        7
      ]
    },
    "recursiveConditionalMap": {
      "is_null": [
        2
      ],
      "is_leaf": [
        4
      ]
    }
  }
};

const SumRootToLeafNumbersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Simple (sum=25)",
    "value": {
      "tree": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Medium (sum=1026)",
    "value": {
      "tree": [
        4,
        9,
        0,
        5,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Two leaves (sum=110)",
    "value": {
      "tree": [
        5,
        3,
        7
      ]
    }
  }
];

function generateSumRootToLeafNumbersSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),r=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(r.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);r.has(t)&&(r.get(e).parent=t,r.get(e).isLeftChild=e%2==1)}let a=(e,t,l)=>{let n=r.get(e),a={type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild};return t&&(a.state=t),l&&(a.label=l),a},i={};r.forEach((e,t)=>{i[`node_${t}`]=a(t)});let o=new RecursiveStepRecorder({totalSum:0},{...i}),s=r.get(0);o.pushCallFrame({root:(0,_treeHelper848569.kU)(s)},"sumNumbers"),o.add_new_global_variable("currentIdx",-1),o.add_new_global_variable("nullIdx",-1),o.add_new_global_variable("pathIdxs",[]),o.add_new_global_variable("numNow",0),o.add_new_global_variable("leafNums",[]),o.record("init","Start: every root-to-leaf path spells out a number, sum them all");let u=new Map,d=[],c=[],f=0,m=(e,t,r)=>{u.set(e,{state:t,label:r}),o.update_visual(`node_${e}`,a(e,t,r))};return 0===r.size?o.record("complete","Empty tree: return 0"):(o.record("start_dfs","Call dfs(root, 0)"),!function e(t,l){let a=r.has(t);if(o.pushCallFrame({node:a?(0,_treeHelper848569.kU)(r.get(t)):"null",currentNum:l},"dfs"),!a)return o.add_conditional("is_null",!0),o.update_global_variable("nullIdx",t),o.record("base_case_null","Null child: contributes 0"),o.update_global_variable("nullIdx",-1),o.popCallFrame(),0;let i=r.get(t).value;if(d.length>0){let e=d[d.length-1];m(e,"path",u.get(e)?.label)}d.push(t),m(t,"current",u.get(t)?.label),o.update_global_variable("currentIdx",t),o.update_global_variable("nodeVal",i),o.update_global_variable("pathIdxs",[...d]),o.add_conditional("is_null",!1);let s=10*l+i;o.update_frame_variable("currentNum",s),o.update_global_variable("prevNum",l),o.update_global_variable("newNum",s),o.update_global_variable("numNow",s),m(t,"current",String(s)),o.record("form_number",`Extend the number: ${l} * 10 + ${i} = ${s}`);let h=2*t+1,g=2*t+2,x=!r.has(h)&&!r.has(g);if(o.add_conditional("is_leaf",x),x){let e=f;if(f+=s,c.push(s),o.update_global_variable("oldSum",e),o.update_global_variable("totalSum",f),o.update_global_variable("leafNums",[...c]),m(t,"leaf",String(s)),o.record("add_to_sum",`Leaf reached: the path spells ${s}, sum = ${e} + ${s} = ${f}`),d.pop(),o.update_global_variable("pathIdxs",[...d]),d.length>0){let e=d[d.length-1];m(e,"current",u.get(e)?.label),o.update_global_variable("currentIdx",e)}else o.update_global_variable("currentIdx",-1);return o.popCallFrame(),s}let p=r.has(h);o.update_global_variable("hasLeft",p),o.record("recurse_left",p?`Recurse left of ${i}, carrying ${s}`:`Left child of ${i} is null: contributes 0`);let b=e(h,s);o.update_global_variable("numNow",s);let _=r.has(g);o.update_global_variable("hasRight",_),o.record("recurse_right",_?`Recurse right of ${i}, carrying ${s}`:`Right child of ${i} is null: contributes 0`);let y=e(g,s);o.update_global_variable("numNow",s);let v=b+y;if(o.update_global_variable("retLeft",b),o.update_global_variable("retRight",y),o.update_global_variable("retSum",v),m(t,"visited",u.get(t)?.label),d.pop(),o.update_global_variable("pathIdxs",[...d]),d.length>0){let e=d[d.length-1];m(e,"current",u.get(e)?.label),o.update_global_variable("currentIdx",e)}else o.update_global_variable("currentIdx",-1);return o.record("return_sum",`Subtree of ${i} done: return ${b} + ${y} = ${v}`),v}(0,0),o.record("complete",`All paths summed: ${c.join(" + ")} = ${f}, return ${f}`)),o.popCallFrame(),o.getSteps()
}

export function SumRootToLeafNumbersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SumRootToLeafNumbersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSumRootToLeafNumbersSteps(e) as any[];
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
      title="Sum Root to Leaf Numbers"
      slug="sum-root-to-leaf-numbers"
      approaches={approaches}
      presets={SumRootToLeafNumbersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Vertical Order Traversal of a Binary Tree (binary-tree-vertical-order-traversal)
// ==========================================

const BinaryTreeVerticalOrderTraversalTemplates = {
  "python": {
    "language": "python",
    "code": "def verticalOrder(root):\n    if not root:\n        return []\n\n    column_map = {}\n    node_queue = [root]\n    col_queue = [0]\n    min_col, max_col = 0, 0\n\n    while node_queue:\n        node = node_queue.pop(0)\n        col = col_queue.pop(0)\n        column_map.setdefault(col, []).append(node.val)\n        min_col = min(min_col, col)\n        max_col = max(max_col, col)\n\n        if node.left:\n            node_queue.append(node.left)\n            col_queue.append(col - 1)\n        if node.right:\n            node_queue.append(node.right)\n            col_queue.append(col + 1)\n\n    result = []\n    for c in range(min_col, max_col + 1):\n        result.append(column_map[c])\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queues": [
        5,
        6,
        7,
        8
      ],
      "dequeue_node": [
        11,
        12
      ],
      "add_to_column": [
        13,
        14,
        15
      ],
      "enqueue_left": [
        18,
        19
      ],
      "enqueue_right": [
        21,
        22
      ],
      "build_result": [
        25,
        26
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_empty": [
        2
      ],
      "while_queue": [
        10
      ],
      "has_left": [
        17
      ],
      "has_right": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> verticalOrder(TreeNode root) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) return result;\n\n    Map<Integer, List<Integer>> columnMap = new HashMap<>();\n    Queue<TreeNode> nodeQueue = new LinkedList<>();\n    Queue<Integer> colQueue = new LinkedList<>();\n    nodeQueue.offer(root);\n    colQueue.offer(0);\n    int minCol = 0, maxCol = 0;\n\n    while (!nodeQueue.isEmpty()) {\n        TreeNode node = nodeQueue.poll();\n        int col = colQueue.poll();\n        columnMap.computeIfAbsent(col, k -> new ArrayList<>()).add(node.val);\n        minCol = Math.min(minCol, col);\n        maxCol = Math.max(maxCol, col);\n\n        if (node.left != null) {\n            nodeQueue.offer(node.left);\n            colQueue.offer(col - 1);\n        }\n        if (node.right != null) {\n            nodeQueue.offer(node.right);\n            colQueue.offer(col + 1);\n        }\n    }\n\n    for (int c = minCol; c <= maxCol; c++) {\n        result.add(columnMap.get(c));\n    }\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_queues": [
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "dequeue_node": [
        13,
        14
      ],
      "add_to_column": [
        15,
        16,
        17
      ],
      "enqueue_left": [
        20,
        21
      ],
      "enqueue_right": [
        24,
        25
      ],
      "build_result": [
        29,
        30
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "is_empty": [
        3
      ],
      "while_queue": [
        12
      ],
      "has_left": [
        19
      ],
      "has_right": [
        23
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> verticalOrder(TreeNode* root) {\n    vector<vector<int>> result;\n    if (root == nullptr) return result;\n\n    unordered_map<int, vector<int>> columnMap;\n    queue<TreeNode*> nodeQueue;\n    queue<int> colQueue;\n    nodeQueue.push(root);\n    colQueue.push(0);\n    int minCol = 0, maxCol = 0;\n\n    while (!nodeQueue.empty()) {\n        TreeNode* node = nodeQueue.front();\n        nodeQueue.pop();\n        int col = colQueue.front();\n        colQueue.pop();\n        columnMap[col].push_back(node->val);\n        minCol = min(minCol, col);\n        maxCol = max(maxCol, col);\n\n        if (node->left != nullptr) {\n            nodeQueue.push(node->left);\n            colQueue.push(col - 1);\n        }\n        if (node->right != nullptr) {\n            nodeQueue.push(node->right);\n            colQueue.push(col + 1);\n        }\n    }\n\n    for (int c = minCol; c <= maxCol; c++) {\n        result.push_back(columnMap[c]);\n    }\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_queues": [
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "dequeue_node": [
        13,
        14,
        15,
        16
      ],
      "add_to_column": [
        17,
        18,
        19
      ],
      "enqueue_left": [
        22,
        23
      ],
      "enqueue_right": [
        26,
        27
      ],
      "build_result": [
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "is_empty": [
        3
      ],
      "while_queue": [
        12
      ],
      "has_left": [
        21
      ],
      "has_right": [
        25
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function verticalOrder(root) {\n    if (!root) return [];\n\n    const columnMap = new Map();\n    const nodeQueue = [root];\n    const colQueue = [0];\n    let minCol = 0, maxCol = 0;\n\n    while (nodeQueue.length > 0) {\n        const node = nodeQueue.shift();\n        const col = colQueue.shift();\n        if (!columnMap.has(col)) columnMap.set(col, []);\n        columnMap.get(col).push(node.val);\n        minCol = Math.min(minCol, col);\n        maxCol = Math.max(maxCol, col);\n\n        if (node.left) {\n            nodeQueue.push(node.left);\n            colQueue.push(col - 1);\n        }\n        if (node.right) {\n            nodeQueue.push(node.right);\n            colQueue.push(col + 1);\n        }\n    }\n\n    const result = [];\n    for (let c = minCol; c <= maxCol; c++) {\n        result.push(columnMap.get(c));\n    }\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2
      ],
      "init_queues": [
        4,
        5,
        6,
        7
      ],
      "dequeue_node": [
        10,
        11
      ],
      "add_to_column": [
        12,
        13,
        14,
        15
      ],
      "enqueue_left": [
        18,
        19
      ],
      "enqueue_right": [
        22,
        23
      ],
      "build_result": [
        28,
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_empty": [
        2
      ],
      "while_queue": [
        9
      ],
      "has_left": [
        17
      ],
      "has_right": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function verticalOrder(root: TreeNode | null): number[][] {\n    if (!root) return [];\n\n    const columnMap = new Map<number, number[]>();\n    const nodeQueue: TreeNode[] = [root];\n    const colQueue: number[] = [0];\n    let minCol = 0, maxCol = 0;\n\n    while (nodeQueue.length > 0) {\n        const node = nodeQueue.shift()!;\n        const col = colQueue.shift()!;\n        if (!columnMap.has(col)) columnMap.set(col, []);\n        columnMap.get(col)!.push(node.val);\n        minCol = Math.min(minCol, col);\n        maxCol = Math.max(maxCol, col);\n\n        if (node.left) {\n            nodeQueue.push(node.left);\n            colQueue.push(col - 1);\n        }\n        if (node.right) {\n            nodeQueue.push(node.right);\n            colQueue.push(col + 1);\n        }\n    }\n\n    const result: number[][] = [];\n    for (let c = minCol; c <= maxCol; c++) {\n        result.push(columnMap.get(c)!);\n    }\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2
      ],
      "init_queues": [
        4,
        5,
        6,
        7
      ],
      "dequeue_node": [
        10,
        11
      ],
      "add_to_column": [
        12,
        13,
        14,
        15
      ],
      "enqueue_left": [
        18,
        19
      ],
      "enqueue_right": [
        22,
        23
      ],
      "build_result": [
        28,
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_empty": [
        2
      ],
      "while_queue": [
        9
      ],
      "has_left": [
        17
      ],
      "has_right": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func verticalOrder(root *TreeNode) [][]int {\n    if root == nil {\n        return [][]int{}\n    }\n\n    columnMap := make(map[int][]int)\n    nodeQueue := []*TreeNode{root}\n    colQueue := []int{0}\n    minCol, maxCol := 0, 0\n\n    for len(nodeQueue) > 0 {\n        node := nodeQueue[0]\n        nodeQueue = nodeQueue[1:]\n        col := colQueue[0]\n        colQueue = colQueue[1:]\n        columnMap[col] = append(columnMap[col], node.Val)\n        if col < minCol { minCol = col }\n        if col > maxCol { maxCol = col }\n\n        if node.Left != nil {\n            nodeQueue = append(nodeQueue, node.Left)\n            colQueue = append(colQueue, col-1)\n        }\n        if node.Right != nil {\n            nodeQueue = append(nodeQueue, node.Right)\n            colQueue = append(colQueue, col+1)\n        }\n    }\n\n    result := [][]int{}\n    for c := minCol; c <= maxCol; c++ {\n        result = append(result, columnMap[c])\n    }\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "empty_tree": [
        2,
        3
      ],
      "init_queues": [
        6,
        7,
        8,
        9
      ],
      "dequeue_node": [
        12,
        13,
        14,
        15
      ],
      "add_to_column": [
        16,
        17,
        18
      ],
      "enqueue_left": [
        21,
        22
      ],
      "enqueue_right": [
        25,
        26
      ],
      "build_result": [
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "is_empty": [
        2
      ],
      "while_queue": [
        11
      ],
      "has_left": [
        20
      ],
      "has_right": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> VerticalOrder(TreeNode root) {\n    var result = new List<IList<int>>();\n    if (root == null) return result;\n\n    var columnMap = new Dictionary<int, List<int>>();\n    var nodeQueue = new Queue<TreeNode>();\n    var colQueue = new Queue<int>();\n    nodeQueue.Enqueue(root);\n    colQueue.Enqueue(0);\n    int minCol = 0, maxCol = 0;\n\n    while (nodeQueue.Count > 0) {\n        var node = nodeQueue.Dequeue();\n        var col = colQueue.Dequeue();\n        if (!columnMap.ContainsKey(col))\n            columnMap[col] = new List<int>();\n        columnMap[col].Add(node.val);\n        minCol = Math.Min(minCol, col);\n        maxCol = Math.Max(maxCol, col);\n\n        if (node.left != null) {\n            nodeQueue.Enqueue(node.left);\n            colQueue.Enqueue(col - 1);\n        }\n        if (node.right != null) {\n            nodeQueue.Enqueue(node.right);\n            colQueue.Enqueue(col + 1);\n        }\n    }\n\n    for (int c = minCol; c <= maxCol; c++) {\n        result.Add(columnMap[c]);\n    }\n    return result;\n}",
    "lineMap": {
      "start": [
        1,
        2
      ],
      "empty_tree": [
        3
      ],
      "init_queues": [
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "dequeue_node": [
        13,
        14
      ],
      "add_to_column": [
        15,
        16,
        17,
        18,
        19
      ],
      "enqueue_left": [
        22,
        23
      ],
      "enqueue_right": [
        26,
        27
      ],
      "build_result": [
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "is_empty": [
        3
      ],
      "while_queue": [
        12
      ],
      "has_left": [
        21
      ],
      "has_right": [
        25
      ]
    }
  }
};

const BinaryTreeVerticalOrderTraversalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tree": [
        3,
        9,
        20,
        null,
        null,
        15,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Left-Heavy",
    "value": {
      "tree": [
        1,
        2,
        3,
        4,
        5,
        null,
        null,
        6,
        7
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Small",
    "value": {
      "tree": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Four Levels",
    "value": {
      "tree": [
        4,
        7,
        9,
        1,
        5,
        8,
        12,
        3,
        2,
        6,
        10,
        null,
        null,
        11,
        14
      ]
    }
  }
];

function generateBinaryTreeVerticalOrderTraversalSteps(e: any): any[] {
  
let t=(0,_treeHelper848569.Gu)(e.tree||[]),l=new Map;for(let e=0;e<t.length;e++)if(null!==t[e]&&(l.set(e,{value:t[e],index:e}),e>0)){let t=Math.floor((e-1)/2);l.has(t)&&(l.get(e).parent=t,l.get(e).isLeftChild=e%2==1)}let r=(e,t)=>{let n=l.get(e);return{type:"binaryTreeNode",value:n.value,parent:void 0!==n.parent?`node_${n.parent}`:void 0,isLeftChild:n.isLeftChild,state:t}},u={};l.forEach((e,t)=>{u[`node_${t}`]=r(t)});let i=new StepRecorder({root:(0,_treeHelper848569.kU)(l.get(0)),result:[],column_map:{},min_col:0,max_col:0,node:void 0,col:void 0},{...u});if(i.record("start","Start: group nodes by vertical column with BFS"),0===l.size)return i.update_variable("result",[]),i.add_conditional("is_empty",!0),i.record("empty_tree","Empty tree, return []"),i.getSteps();i.add_conditional("is_empty",!1);let a=new Map,s=[0],d=[0],c=new Map;c.set(0,0);let h=0,p=0;for(i.update_variable("column_map",{}),i.update_variable("min_col",0),i.update_variable("max_col",0),i.update_visual("node_0",r(0,"queued")),i.add_new_visual("queue_n0",{type:"queueElement",value:l.get(0).value,position:0,label:"0",state:"queued"}),i.record("init_queues",`Initialize queue with root ${l.get(0).value} at column 0`);s.length>0;){let e=s.shift(),n=d.shift(),u=l.get(e);i.update_visual(`node_${e}`,r(e,"current"));for(let e=0;e<s.length;e++)i.update_visual(`queue_n${s[e]}`,{type:"queueElement",value:l.get(s[e]).value,position:e,label:String(d[e]),state:"queued"});i.delete_visual(`queue_n${e}`),i.update_variable("node",(0,_treeHelper848569.kU)(u)),i.update_variable("col",n),i.update_variable("currentIdx",e),i.add_conditional("while_queue",!0),i.record("dequeue_node",`Dequeue node ${u.value} at column ${n}`),a.has(n)||a.set(n,[]),a.get(n).push(u.value),h=Math.min(h,n),p=Math.max(p,n);let m={};a.forEach((e,t)=>{m[String(t)]=[...e]}),i.update_visual(`node_${e}`,r(e,"binned")),i.update_variable("column_map",m),i.update_variable("min_col",h),i.update_variable("max_col",p),i.record("add_to_column",`Add ${u.value} to column ${n}: [${a.get(n).join(", ")}]`);let f=2*e+1;if(f<t.length&&null!==t[f]){let e=l.get(f),t=n-1;s.push(f),d.push(t),c.set(f,t),i.update_visual(`node_${f}`,r(f,"queued")),i.add_new_visual(`queue_n${f}`,{type:"queueElement",value:e.value,position:s.length-1,label:String(t),state:"queued"}),i.update_variable("enqueuedIdx",f),i.update_variable("enqueuedVal",e.value),i.update_variable("enqueuedCol",t),i.add_conditional("has_left",!0),i.record("enqueue_left",`Enqueue left child ${e.value} at column ${n} - 1 = ${t}`)}let g=2*e+2;if(g<t.length&&null!==t[g]){let e=l.get(g),t=n+1;s.push(g),d.push(t),c.set(g,t),i.update_visual(`node_${g}`,r(g,"queued")),i.add_new_visual(`queue_n${g}`,{type:"queueElement",value:e.value,position:s.length-1,label:String(t),state:"queued"}),i.update_variable("enqueuedIdx",g),i.update_variable("enqueuedVal",e.value),i.update_variable("enqueuedCol",t),i.add_conditional("has_right",!0),i.record("enqueue_right",`Enqueue right child ${e.value} at column ${n} + 1 = ${t}`)}}let m=[];i.add_conditional("while_queue",!1);for(let e=h;e<=p;e++){let t=a.get(e)||[];m.push([...t]),c.forEach((t,l)=>{t===e&&i.update_visual(`node_${l}`,r(l,"done"))}),i.update_variable("result",m.map(e=>[...e])),i.update_variable("buildCol",e),i.record("build_result",`Column ${e}: add [${t.join(", ")}] to result`)}return i.record("complete",`Vertical order traversal complete: [${m.map(e=>`[${e.join(", ")}]`).join(", ")}]`),i.getSteps()
}

export function BinaryTreeVerticalOrderTraversalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinaryTreeVerticalOrderTraversalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinaryTreeVerticalOrderTraversalSteps(e) as any[];
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
      title="Vertical Order Traversal of a Binary Tree"
      slug="binary-tree-vertical-order-traversal"
      approaches={approaches}
      presets={BinaryTreeVerticalOrderTraversalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
