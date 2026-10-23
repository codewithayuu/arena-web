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
import { StepRecorder, RecursiveStepRecorder } from "../recorder";

function elementsFromVisualState(visualState: Record<string, any>): {
  elements: VisualArrayElement[];
  pointers: VisualPointer[];
} {
  const elements: VisualArrayElement[] = [];
  const pointers: VisualPointer[] = [];

  for (const key in visualState) {
    const item = visualState[key];
    if (!item) continue;
    if (item.type === "arrayElement" || item.type === "element" || item.type === "char" || item.type === "stateElement" || item.type === "node" || item.type === "cell") {
      elements.push({
        value: item.value ?? "",
        position: item.position ?? (typeof item.col === "number" ? item.col : 0),
        state: item.state || "idle",
      });
    } else if (item.type === "pointer") {
      pointers.push({
        position: item.position ?? 0,
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
// Middle of the Linked List (middle-of-the-linked-list)
// ==========================================

const MiddleOfTheLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        nodes = []\n        current = head\n\n        # Collect all nodes into an array\n        while current:\n            nodes.append(current)\n            current = current.next\n\n        # Return the middle node\n        return nodes[len(nodes) // 2]",
    "lineMap": {
      "-": [
        2
      ],
      "init_array": [
        3
      ],
      "push_node": [
        8
      ],
      "scan_done": [
        7
      ],
      "found_middle": [
        12
      ],
      "empty_list": [
        12
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public ListNode middleNode(ListNode head) {\n        List<ListNode> nodes = new ArrayList<>();\n        ListNode current = head;\n\n        // Collect all nodes into an array\n        while (current != null) {\n            nodes.add(current);\n            current = current.next;\n        }\n\n        // Return the middle node\n        return nodes.get(nodes.size() / 2);\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_array": [
        3
      ],
      "push_node": [
        8
      ],
      "scan_done": [
        7
      ],
      "found_middle": [
        13
      ],
      "empty_list": [
        13
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    ListNode* middleNode(ListNode* head) {\n        vector<ListNode*> nodes;\n        ListNode* current = head;\n\n        // Collect all nodes into an array\n        while (current) {\n            nodes.push_back(current);\n            current = current->next;\n        }\n\n        // Return the middle node\n        return nodes[nodes.size() / 2];\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init_array": [
        4
      ],
      "push_node": [
        9
      ],
      "scan_done": [
        8
      ],
      "found_middle": [
        14
      ],
      "empty_list": [
        14
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public ListNode MiddleNode(ListNode head) {\n        List<ListNode> nodes = new List<ListNode>();\n        ListNode current = head;\n\n        // Collect all nodes into an array\n        while (current != null) {\n            nodes.Add(current);\n            current = current.next;\n        }\n\n        // Return the middle node\n        return nodes[nodes.Count / 2];\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_array": [
        3
      ],
      "push_node": [
        8
      ],
      "scan_done": [
        7
      ],
      "found_middle": [
        13
      ],
      "empty_list": [
        13
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func middleNode(head *ListNode) *ListNode {\n    nodes := []*ListNode{}\n    current := head\n\n    // Collect all nodes into an array\n    for current != nil {\n        nodes = append(nodes, current)\n        current = current.Next\n    }\n\n    // Return the middle node\n    return nodes[len(nodes) / 2]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_array": [
        7
      ],
      "push_node": [
        7
      ],
      "scan_done": [
        6
      ],
      "found_middle": [
        12
      ],
      "empty_list": [
        12
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var middleNode = function(head) {\n    var nodes = [];\n    var current = head;\n\n    // Collect all nodes into an array\n    while (current) {\n        nodes.push(current);\n        current = current.next;\n    }\n\n    // Return the middle node\n    return nodes[Math.floor(nodes.length / 2)];\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_array": [
        2
      ],
      "push_node": [
        7
      ],
      "scan_done": [
        6
      ],
      "found_middle": [
        12
      ],
      "empty_list": [
        12
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function middleNode(head: ListNode | null): ListNode | null {\n    const nodes: ListNode[] = [];\n    let current = head;\n\n    // Collect all nodes into an array\n    while (current) {\n        nodes.push(current);\n        current = current.next;\n    }\n\n    // Return the middle node\n    return nodes[Math.floor(nodes.length / 2)];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_array": [
        2
      ],
      "push_node": [
        7
      ],
      "scan_done": [
        6
      ],
      "found_middle": [
        12
      ],
      "empty_list": [
        12
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        6
      ]
    }
  }
};

const MiddleOfTheLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Odd Length",
    "value": {
      "values": [
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
    "label": "Even Length",
    "value": {
      "values": [
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
    "label": "Single Node",
    "value": {
      "values": [
        1
      ]
    }
  }
];

function generateMiddleOfTheLinkedListSteps(e: any): any[] {
  class a{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function i(e){return null===e?null:`Node(${e.val})`}

let t=Array.isArray(e?.values)?e.values.map(Number):[],n=null,o=[];if(t.length>0){n=new a(t[0]),o.push(n);let e=n;for(let n=1;n<t.length;n++)e.next=new a(t[n]),e=e.next,o.push(e)}let l={};t.forEach((e,t)=>{l[`node_${t}`]={type:"arrayElement",value:e,position:t}});let s={};for(let e=0;e<t.length-1;e++)s[`arrow_${e}`]={type:"range",start:e,end:e+1};let d=new StepRecorder({values:t,head:i(n),slow:void 0,fast:void 0},{...l,...s,ptr_head:{type:"pointer",position:0,label:"head"}});if(d.record("-","Start: Find the middle node of the linked list"),!n)return d.record("empty_list","List is empty - return null"),d.getSteps();let u=n,c=n;d.update_variable("slow",i(u)),d.update_variable("fast",i(c)),d.add_new_visual("ptr_slow",{type:"pointer",position:0,label:"slow"}),d.add_new_visual("ptr_fast",{type:"pointer",position:0,label:"fast"}),d.record("initialize","Initialize slow and fast pointers at head");let p=0,h=0;for(;null!==c&&null!==c.next;)d.add_conditional("while_fast",!0),d.record("check_fast","Check if fast and fast.next exist"),u=u.next,c=c.next.next,p=o.indexOf(u),h=null!==c?o.indexOf(c):h,d.update_variable("slow",i(u)),d.update_variable("fast",i(c)),d.update_visual("ptr_slow",{type:"pointer",position:p,label:"slow"}),null!==c?(d.update_visual("ptr_fast",{type:"pointer",position:h,label:"fast"}),d.record("move_pointers",`Move slow to position ${p}, fast to position ${h}`)):(d.delete_visual("ptr_fast"),d.record("move_pointers",`Move slow to position ${p}, fast reached end`));return d.add_conditional("while_fast",!1),d.record("fast_end","Fast reached end or null - slow is at middle"),d.update_visual(`node_${p}`,{type:"arrayElement",value:t[p],position:p,state:"result"}),d.record("found_middle",`Return middle node at position ${p} with value ${t[p]}`),d.getSteps()
}

export function MiddleOfTheLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MiddleOfTheLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMiddleOfTheLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Middle of the Linked List"
      slug="middle-of-the-linked-list"
      approaches={approaches}
      presets={MiddleOfTheLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Nth Node From End of List (remove-nth-node-from-end-of-list)
// ==========================================

const RemoveNthNodeFromEndOfListTemplates = {
  "python": {
    "language": "python",
    "code": "def removeNthFromEnd(head, n):\n    # Dummy node simplifies edge case of removing head\n    dummy = ListNode(0, head)\n\n    # First pass: count total nodes\n    length = 0\n    current = head\n    while current:\n        length += 1\n        current = current.next\n\n    # Second pass: advance (length - n) steps from dummy\n    prev = dummy\n    for _ in range(length - n):\n        prev = prev.next\n\n    # Remove the target node\n    prev.next = prev.next.next\n\n    return dummy.next",
    "lineMap": {
      "-": [
        1
      ],
      "count_node": [
        9
      ],
      "count_done": [
        8
      ],
      "create_dummy": [
        3
      ],
      "init_prev": [
        13
      ],
      "walk_prev": [
        14
      ],
      "identify_target": [
        18
      ],
      "update_connections": [
        18
      ],
      "remove_node": [
        18
      ],
      "empty_list": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        8
      ],
      "more_steps": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode removeNthFromEnd(ListNode head, int n) {\n    // Dummy node simplifies edge case of removing head\n    ListNode dummy = new ListNode(0, head);\n\n    // First pass: count total nodes\n    int length = 0;\n    ListNode current = head;\n    while (current != null) {\n        length++;\n        current = current.next;\n    }\n\n    // Second pass: advance (length - n) steps from dummy\n    ListNode prev = dummy;\n    for (int i = 0; i < length - n; i++) {\n        prev = prev.next;\n    }\n\n    // Remove the target node\n    prev.next = prev.next.next;\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_node": [
        9
      ],
      "count_done": [
        8
      ],
      "create_dummy": [
        3
      ],
      "init_prev": [
        14
      ],
      "walk_prev": [
        15
      ],
      "identify_target": [
        20
      ],
      "update_connections": [
        20
      ],
      "remove_node": [
        20
      ],
      "empty_list": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        8
      ],
      "more_steps": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* removeNthFromEnd(ListNode* head, int n) {\n    // Dummy node simplifies edge case of removing head\n    ListNode dummy(0, head);\n\n    // First pass: count total nodes\n    int length = 0;\n    ListNode* current = head;\n    while (current != nullptr) {\n        length++;\n        current = current->next;\n    }\n\n    // Second pass: advance (length - n) steps from dummy\n    ListNode* prev = &dummy;\n    for (int i = 0; i < length - n; i++) {\n        prev = prev->next;\n    }\n\n    // Remove the target node\n    ListNode* toDelete = prev->next;\n    prev->next = prev->next->next;\n    delete toDelete;\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_node": [
        9
      ],
      "count_done": [
        8
      ],
      "create_dummy": [
        3
      ],
      "init_prev": [
        14
      ],
      "walk_prev": [
        15
      ],
      "identify_target": [
        21
      ],
      "update_connections": [
        21
      ],
      "remove_node": [
        21
      ],
      "empty_list": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        8
      ],
      "more_steps": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode RemoveNthFromEnd(ListNode head, int n) {\n    // Dummy node simplifies edge case of removing head\n    ListNode dummy = new ListNode(0, head);\n\n    // First pass: count total nodes\n    int length = 0;\n    ListNode current = head;\n    while (current != null) {\n        length++;\n        current = current.next;\n    }\n\n    // Second pass: advance (length - n) steps from dummy\n    ListNode prev = dummy;\n    for (int i = 0; i < length - n; i++) {\n        prev = prev.next;\n    }\n\n    // Remove the target node\n    prev.next = prev.next.next;\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_node": [
        9
      ],
      "count_done": [
        8
      ],
      "create_dummy": [
        3
      ],
      "init_prev": [
        14
      ],
      "walk_prev": [
        15
      ],
      "identify_target": [
        20
      ],
      "update_connections": [
        20
      ],
      "remove_node": [
        20
      ],
      "empty_list": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        8
      ],
      "more_steps": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeNthFromEnd(head *ListNode, n int) *ListNode {\n    // Dummy node simplifies edge case of removing head\n    dummy := &ListNode{0, head}\n\n    // First pass: count total nodes\n    length := 0\n    current := head\n    for current != nil {\n        length++\n        current = current.Next\n    }\n\n    // Second pass: advance (length - n) steps from dummy\n    prev := dummy\n    for i := 0; i < length-n; i++ {\n        prev = prev.Next\n    }\n\n    // Remove the target node\n    prev.Next = prev.Next.Next\n\n    return dummy.Next\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_node": [
        9
      ],
      "count_done": [
        8
      ],
      "create_dummy": [
        3
      ],
      "init_prev": [
        14
      ],
      "walk_prev": [
        15
      ],
      "identify_target": [
        20
      ],
      "update_connections": [
        20
      ],
      "remove_node": [
        20
      ],
      "empty_list": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        8
      ],
      "more_steps": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function removeNthFromEnd(head, n) {\n    // Dummy node simplifies edge case of removing head\n    var dummy = new ListNode(0, head);\n\n    // First pass: count total nodes\n    var length = 0;\n    var current = head;\n    while (current !== null) {\n        length++;\n        current = current.next;\n    }\n\n    // Second pass: advance (length - n) steps from dummy\n    var prev = dummy;\n    for (var i = 0; i < length - n; i++) {\n        prev = prev.next;\n    }\n\n    // Remove the target node\n    prev.next = prev.next.next;\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_node": [
        9
      ],
      "count_done": [
        8
      ],
      "create_dummy": [
        3
      ],
      "init_prev": [
        14
      ],
      "walk_prev": [
        15
      ],
      "identify_target": [
        20
      ],
      "update_connections": [
        20
      ],
      "remove_node": [
        20
      ],
      "empty_list": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        8
      ],
      "more_steps": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {\n    // Dummy node simplifies edge case of removing head\n    const dummy = new ListNode(0, head);\n\n    // First pass: count total nodes\n    let length = 0;\n    let current = head;\n    while (current !== null) {\n        length++;\n        current = current.next;\n    }\n\n    // Second pass: advance (length - n) steps from dummy\n    let prev: ListNode = dummy;\n    for (let i = 0; i < length - n; i++) {\n        prev = prev.next!;\n    }\n\n    // Remove the target node\n    prev.next = prev.next!.next;\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_node": [
        9
      ],
      "count_done": [
        8
      ],
      "create_dummy": [
        3
      ],
      "init_prev": [
        14
      ],
      "walk_prev": [
        15
      ],
      "identify_target": [
        20
      ],
      "update_connections": [
        20
      ],
      "remove_node": [
        20
      ],
      "empty_list": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "curr_not_null": [
        8
      ],
      "more_steps": [
        15
      ]
    }
  }
};

const RemoveNthNodeFromEndOfListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Remove 2nd from end",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "n": 2
    }
  },
  {
    "id": "ex2",
    "label": "Remove first",
    "value": {
      "values": [
        1,
        2
      ],
      "n": 2
    }
  },
  {
    "id": "ex3",
    "label": "Remove last",
    "value": {
      "values": [
        1,
        2,
        3
      ],
      "n": 1
    }
  }
];

function generateRemoveNthNodeFromEndOfListSteps(e: any): any[] {
  class r{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function a(e){return null===e?null:`Node(${e.val})`}

let t,n=Array.isArray(e?.values)?e.values.map(Number):[],i=Math.floor(Number(e?.n??0))||0,s=n.length>0?Math.min(Math.max(i,1),n.length):0,l=null,d=[];if(n.length>0){l=new r(n[0]),d.push(l);let e=l;for(let t=1;t<n.length;t++)e.next=new r(n[t]),e=e.next,d.push(e)}let u={};n.forEach((e,t)=>{u[`node_${t}`]={type:"arrayElement",value:e,position:t}});let p={};for(let e=0;e<n.length-1;e++)p[`arrow_${e}`]={type:"range",start:e,end:e+1};let m=new r(0,l),c=new StepRecorder({values:n,n:s,head:a(l),first:void 0,second:void 0},{...u,...p,ptr_head:{type:"pointer",position:0,label:"head"}});if(c.record("-",`Start: remove the ${(t=s%100)>=11&&t<=13?`${s}th`:`${s}${["th","st","nd","rd"][s%10]??"th"}`} node from the end`),0===n.length)return c.record("empty_list","List is empty, nothing to remove"),c.getSteps();c.add_new_visual("node_-1",{type:"arrayElement",value:0,position:-1}),c.add_new_visual("arrow_-1",{type:"range",start:-1,end:0}),c.record("create_dummy","Create dummy node pointing to head");let h=m,v=m;c.update_variable("first",a(h)),c.update_variable("second",a(v)),c.add_new_visual("ptr_first",{type:"pointer",position:-1,label:"first"}),c.add_new_visual("ptr_second",{type:"pointer",position:-1,label:"second"}),c.record("initialize","Initialize first and second pointers at dummy node");let f=-1;for(let e=0;e<=s&&null!==h;e++)null!==(h=h.next)&&(f=h===m?-1:d.indexOf(h),c.update_variable("first",a(h)),c.update_visual("ptr_first",{type:"pointer",position:f,label:"first"}),c.record("move_first",`Move first pointer forward (step ${e+1} of ${s+1})`));c.record("gap_created",`Gap of ${s} nodes created between second and first`);let _=-1;for(;null!==h;)c.add_conditional("while_first",!0),h=h.next,v=v.next,null!==h&&(f=h===m?-1:d.indexOf(h)),_=v===m?-1:d.indexOf(v),c.update_variable("first",a(h)),c.update_variable("second",a(v)),null!==h?c.update_visual("ptr_first",{type:"pointer",position:f,label:"first"}):c.delete_visual("ptr_first"),c.update_visual("ptr_second",{type:"pointer",position:_,label:"second"}),c.record("move_both",`Move both pointers forward. Second is at position ${_}`);c.add_conditional("while_first",!1),c.record("first_end","First pointer reached end. Second is just before target node");let g=_+1;if(v.next=v.next.next,c.update_visual(`node_${g}`,{type:"arrayElement",value:n[g],position:g,state:"active"}),c.record("identify_target",`Identify target node at position ${g} (value: ${n[g]})`),c.delete_visual(`arrow_${_}`),c.delete_visual(`arrow_${g}`),g<n.length-1&&c.add_new_visual(`arrow_skip_${g}`,{type:"range",start:_,end:g+1}),c.record("update_connections",`Update arrow to skip node ${g}`),c.delete_visual(`node_${g}`),c.record("remove_node",`Node at position ${g} removed from list`),c.delete_visual("ptr_second"),c.delete_visual("ptr_head"),null!==m.next){let e=d.indexOf(m.next);-1!==e&&c.update_visual(`node_${e}`,{type:"arrayElement",value:m.next.val,position:e,state:"result"})}return c.record("complete","Node removed successfully. Return dummy.next as new head"),c.getSteps()
}

export function RemoveNthNodeFromEndOfListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveNthNodeFromEndOfListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveNthNodeFromEndOfListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Remove Nth Node From End of List"
      slug="remove-nth-node-from-end-of-list"
      approaches={approaches}
      presets={RemoveNthNodeFromEndOfListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reverse Linked List (reverse-linked-list)
// ==========================================

const ReverseLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        prev = None\n        curr = head\n\n        while curr:\n            next_node = curr.next  # Save next node\n            curr.next = prev       # Reverse the pointer\n            prev = curr            # Move prev forward\n            curr = next_node       # Move curr forward\n\n        return prev",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4
      ],
      "check_curr": [
        6
      ],
      "save_next": [
        7
      ],
      "reverse_pointer": [
        8
      ],
      "move_pointers": [
        9,
        10
      ],
      "return": [
        12
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n\n        while (curr != null) {\n            ListNode next = curr.next; // Save next node\n            curr.next = prev;          // Reverse the pointer\n            prev = curr;               // Move prev forward\n            curr = next;               // Move curr forward\n        }\n\n        return prev;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4
      ],
      "check_curr": [
        6
      ],
      "save_next": [
        7
      ],
      "reverse_pointer": [
        8
      ],
      "move_pointers": [
        9,
        10
      ],
      "return": [
        13
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n\n        while (curr != nullptr) {\n            ListNode* next = curr->next; // Save next node\n            curr->next = prev;           // Reverse the pointer\n            prev = curr;                 // Move prev forward\n            curr = next;                 // Move curr forward\n        }\n\n        return prev;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize": [
        4,
        5
      ],
      "check_curr": [
        7
      ],
      "save_next": [
        8
      ],
      "reverse_pointer": [
        9
      ],
      "move_pointers": [
        10,
        11
      ],
      "return": [
        14
      ]
    },
    "conditionalMap": {
      "while_curr": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public ListNode ReverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n\n        while (curr != null) {\n            ListNode next = curr.next; // Save next node\n            curr.next = prev;          // Reverse the pointer\n            prev = curr;               // Move prev forward\n            curr = next;               // Move curr forward\n        }\n\n        return prev;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4
      ],
      "check_curr": [
        6
      ],
      "save_next": [
        7
      ],
      "reverse_pointer": [
        8
      ],
      "move_pointers": [
        9,
        10
      ],
      "return": [
        13
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reverseList(head *ListNode) *ListNode {\n    var prev *ListNode\n    curr := head\n\n    for curr != nil {\n        next := curr.Next // Save next node\n        curr.Next = prev  // Reverse the pointer\n        prev = curr       // Move prev forward\n        curr = next       // Move curr forward\n    }\n\n    return prev\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_curr": [
        5
      ],
      "save_next": [
        6
      ],
      "reverse_pointer": [
        7
      ],
      "move_pointers": [
        8,
        9
      ],
      "return": [
        12
      ]
    },
    "conditionalMap": {
      "while_curr": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var reverseList = function(head) {\n    var prev = null;\n    var curr = head;\n\n    while (curr !== null) {\n        var next = curr.next; // Save next node\n        curr.next = prev;     // Reverse the pointer\n        prev = curr;          // Move prev forward\n        curr = next;          // Move curr forward\n    }\n\n    return prev;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_curr": [
        5
      ],
      "save_next": [
        6
      ],
      "reverse_pointer": [
        7
      ],
      "move_pointers": [
        8,
        9
      ],
      "return": [
        12
      ]
    },
    "conditionalMap": {
      "while_curr": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reverseList(head: ListNode | null): ListNode | null {\n    let prev: ListNode | null = null;\n    let curr = head;\n\n    while (curr !== null) {\n        const next = curr.next; // Save next node\n        curr.next = prev;       // Reverse the pointer\n        prev = curr;            // Move prev forward\n        curr = next;            // Move curr forward\n    }\n\n    return prev;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_curr": [
        5
      ],
      "save_next": [
        6
      ],
      "reverse_pointer": [
        7
      ],
      "move_pointers": [
        8,
        9
      ],
      "return": [
        12
      ]
    },
    "conditionalMap": {
      "while_curr": [
        5
      ]
    }
  }
};

const ReverseLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "List 1",
    "value": {
      "values": [
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
    "label": "List 2",
    "value": {
      "values": [
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "List 3",
    "value": {
      "values": [
        5,
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single Node",
    "value": {
      "values": [
        1
      ]
    }
  }
];

function generateReverseLinkedListSteps(e: any): any[] {
  class a{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function i(e){return null===e?null:`Node(${e.val})`}

let t=e.values,r=null;if(t.length>0){let e=r=new a(t[0]);for(let r=1;r<t.length;r++)e.next=new a(t[r]),e=e.next}let s={};t.forEach((e,t)=>{s[`node_${t}`]={type:"arrayElement",value:e,position:t}});let l={};for(let e=0;e<t.length-1;e++)l[`arrow_${e}`]={type:"range",start:e,end:e+1};let o=new StepRecorder({values:t,head:i(r),prev:void 0,curr:void 0,next:void 0},{...s,...l,ptr_head:{type:"pointer",position:0,label:"head"}});o.record("-","Start of algorithm");let u=null,d=r,p=null;o.update_variable("prev",null),o.update_variable("curr",i(d)),o.add_new_visual("ptr_curr",{type:"pointer",position:0,label:"curr"}),o.record("initialize","Initialize three pointers: prev=null, curr=head, next=null");let c=0;for(;null!==d;)o.add_conditional("while_curr",!0),p=d.next,o.update_variable("next",i(p)),null===p?o.delete_visual("ptr_next"):o.update_visual("ptr_next",{type:"pointer",position:null!==p?c+1:t.length,label:"next"}),o.record("save_next",`Save next pointer: next = curr.next (${p?.val??"null"})`),null!==u?(o.delete_visual(`arrow_${c}`),o.add_new_visual(`arrow_${c}_rev`,{type:"range",start:c,end:c-1})):o.delete_visual(`arrow_${c}`),d.next=u,o.record("reverse_pointer",`Reverse pointer: curr.next = prev (point ${d.val} to ${i(u)})`),u=d,d=p,c++,o.update_variable("prev",i(u)),o.update_variable("curr",i(d)),o.update_visual("ptr_prev",{type:"pointer",position:c-1,label:"prev"}),o.update_visual("ptr_curr",{type:"pointer",position:c,label:"curr"}),null!==p&&o.update_visual("ptr_next",{type:"pointer",position:c,label:"next"}),null===d&&o.delete_visual("ptr_curr"),o.record("move_pointers","Move pointers forward: prev = curr, curr = next");if(o.add_conditional("while_curr",!1),o.delete_visual("ptr_curr"),o.delete_visual("ptr_next"),null!==u){let e=t.length-1;o.update_visual(`node_${e}`,{type:"arrayElement",value:u.val,position:e,state:"result"})}return o.record("return",`Return new head (prev = ${u?.val??"null"})`),o.getSteps()
}

export function ReverseLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReverseLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReverseLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Reverse Linked List"
      slug="reverse-linked-list"
      approaches={approaches}
      presets={ReverseLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reverse Linked List II (reverse-linked-list-ii)
// ==========================================

const ReverseLinkedListIiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:\n        dummy = ListNode(0, head)\n        prev = dummy\n\n        # Move prev to the node just before position left\n        for _ in range(left - 1):\n            prev = prev.next\n\n        curr = prev.next  # First node in the reversal range\n\n        # Reverse by moving each next node to the front of the reversed section\n        for _ in range(right - left):\n            next_node = curr.next\n            curr.next = next_node.next\n            next_node.next = prev.next\n            prev.next = next_node\n\n        return dummy.next",
    "lineMap": {
      "-": [
        2
      ],
      "create_dummy": [
        3
      ],
      "init_pre": [
        4
      ],
      "move_pre": [
        8
      ],
      "init_start": [
        10
      ],
      "highlight_sublist": [
        10
      ],
      "init_then": [
        14
      ],
      "reverse_step": [
        15,
        16,
        17
      ],
      "move_then": [
        14
      ],
      "complete": [
        19
      ],
      "return": [
        19
      ]
    },
    "conditionalMap": {
      "for_pre": [
        7
      ],
      "for_reverse": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public ListNode reverseBetween(ListNode head, int left, int right) {\n        ListNode dummy = new ListNode(0, head);\n        ListNode prev = dummy;\n\n        // Move prev to the node just before position left\n        for (int i = 0; i < left - 1; i++) {\n            prev = prev.next;\n        }\n\n        ListNode curr = prev.next; // First node in the reversal range\n\n        // Reverse by moving each next node to the front of the reversed section\n        for (int i = 0; i < right - left; i++) {\n            ListNode nextNode = curr.next;\n            curr.next = nextNode.next;\n            nextNode.next = prev.next;\n            prev.next = nextNode;\n        }\n\n        return dummy.next;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "create_dummy": [
        3
      ],
      "init_pre": [
        4
      ],
      "move_pre": [
        8
      ],
      "init_start": [
        11
      ],
      "highlight_sublist": [
        11
      ],
      "init_then": [
        15
      ],
      "reverse_step": [
        16,
        17,
        18
      ],
      "move_then": [
        15
      ],
      "complete": [
        21
      ],
      "return": [
        21
      ]
    },
    "conditionalMap": {
      "for_pre": [
        7
      ],
      "for_reverse": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    ListNode* reverseBetween(ListNode* head, int left, int right) {\n        ListNode dummy(0, head);\n        ListNode* prev = &dummy;\n\n        // Move prev to the node just before position left\n        for (int i = 0; i < left - 1; i++) {\n            prev = prev->next;\n        }\n\n        ListNode* curr = prev->next; // First node in the reversal range\n\n        // Reverse by moving each next node to the front of the reversed section\n        for (int i = 0; i < right - left; i++) {\n            ListNode* nextNode = curr->next;\n            curr->next = nextNode->next;\n            nextNode->next = prev->next;\n            prev->next = nextNode;\n        }\n\n        return dummy.next;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "create_dummy": [
        4
      ],
      "init_pre": [
        5
      ],
      "move_pre": [
        9
      ],
      "init_start": [
        12
      ],
      "highlight_sublist": [
        12
      ],
      "init_then": [
        16
      ],
      "reverse_step": [
        17,
        18,
        19
      ],
      "move_then": [
        16
      ],
      "complete": [
        22
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "for_pre": [
        8
      ],
      "for_reverse": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public ListNode ReverseBetween(ListNode head, int left, int right) {\n        ListNode dummy = new ListNode(0, head);\n        ListNode prev = dummy;\n\n        // Move prev to the node just before position left\n        for (int i = 0; i < left - 1; i++) {\n            prev = prev.next;\n        }\n\n        ListNode curr = prev.next; // First node in the reversal range\n\n        // Reverse by moving each next node to the front of the reversed section\n        for (int i = 0; i < right - left; i++) {\n            ListNode nextNode = curr.next;\n            curr.next = nextNode.next;\n            nextNode.next = prev.next;\n            prev.next = nextNode;\n        }\n\n        return dummy.next;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "create_dummy": [
        3
      ],
      "init_pre": [
        4
      ],
      "move_pre": [
        8
      ],
      "init_start": [
        11
      ],
      "highlight_sublist": [
        11
      ],
      "init_then": [
        15
      ],
      "reverse_step": [
        16,
        17,
        18
      ],
      "move_then": [
        15
      ],
      "complete": [
        21
      ],
      "return": [
        21
      ]
    },
    "conditionalMap": {
      "for_pre": [
        7
      ],
      "for_reverse": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reverseBetween(head *ListNode, left int, right int) *ListNode {\n    dummy := &ListNode{Val: 0, Next: head}\n    prev := dummy\n\n    // Move prev to the node just before position left\n    for i := 0; i < left-1; i++ {\n        prev = prev.Next\n    }\n\n    curr := prev.Next // First node in the reversal range\n\n    // Reverse by moving each next node to the front of the reversed section\n    for i := 0; i < right-left; i++ {\n        nextNode := curr.Next\n        curr.Next = nextNode.Next\n        nextNode.Next = prev.Next\n        prev.Next = nextNode\n    }\n\n    return dummy.Next\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_dummy": [
        2
      ],
      "init_pre": [
        3
      ],
      "move_pre": [
        7
      ],
      "init_start": [
        10
      ],
      "highlight_sublist": [
        10
      ],
      "init_then": [
        14
      ],
      "reverse_step": [
        15,
        16,
        17
      ],
      "move_then": [
        14
      ],
      "complete": [
        20
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "for_pre": [
        6
      ],
      "for_reverse": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var reverseBetween = function(head, left, right) {\n    var dummy = new ListNode(0, head);\n    var prev = dummy;\n\n    // Move prev to the node just before position left\n    for (var i = 0; i < left - 1; i++) {\n        prev = prev.next;\n    }\n\n    var curr = prev.next; // First node in the reversal range\n\n    // Reverse by moving each next node to the front of the reversed section\n    for (var i = 0; i < right - left; i++) {\n        var nextNode = curr.next;\n        curr.next = nextNode.next;\n        nextNode.next = prev.next;\n        prev.next = nextNode;\n    }\n\n    return dummy.next;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "create_dummy": [
        2
      ],
      "init_pre": [
        3
      ],
      "move_pre": [
        7
      ],
      "init_start": [
        10
      ],
      "highlight_sublist": [
        10
      ],
      "init_then": [
        14
      ],
      "reverse_step": [
        15,
        16,
        17
      ],
      "move_then": [
        14
      ],
      "complete": [
        20
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "for_pre": [
        6
      ],
      "for_reverse": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {\n    const dummy = new ListNode(0, head);\n    let prev: ListNode = dummy;\n\n    // Move prev to the node just before position left\n    for (let i = 0; i < left - 1; i++) {\n        prev = prev.next!;\n    }\n\n    let curr: ListNode = prev.next!; // First node in the reversal range\n\n    // Reverse by moving each next node to the front of the reversed section\n    for (let i = 0; i < right - left; i++) {\n        const nextNode: ListNode = curr.next!;\n        curr.next = nextNode.next;\n        nextNode.next = prev.next;\n        prev.next = nextNode;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_dummy": [
        2
      ],
      "init_pre": [
        3
      ],
      "move_pre": [
        7
      ],
      "init_start": [
        10
      ],
      "highlight_sublist": [
        10
      ],
      "init_then": [
        14
      ],
      "reverse_step": [
        15,
        16,
        17
      ],
      "move_then": [
        14
      ],
      "complete": [
        20
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "for_pre": [
        6
      ],
      "for_reverse": [
        13
      ]
    }
  }
};

const ReverseLinkedListIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "m": 2,
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "Single Node",
    "value": {
      "values": [
        5
      ],
      "m": 1,
      "n": 1
    }
  },
  {
    "id": "ex3",
    "label": "Full Reversal",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "m": 1,
      "n": 5
    }
  },
  {
    "id": "ex4",
    "label": "Middle Section",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "m": 3,
      "n": 5
    }
  }
];

function generateReverseLinkedListIiSteps(e: any): any[] {
  class i{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function a(e){return null===e?null:`Node(${e.val})`}

let t=e.values,r=e.m,s=e.n,l=null;if(t.length>0){let e=l=new i(t[0]);for(let r=1;r<t.length;r++)e.next=new i(t[r]),e=e.next}let o={node_dummy:{type:"arrayElement",value:0,position:-1,state:"default"}};t.forEach((e,t)=>{o[`node_${t}`]={type:"arrayElement",value:e,position:t,state:"default"}});let u=new Map;u.set(-1,0);for(let e=0;e<t.length-1;e++)u.set(e,e+1);u.set(t.length-1,null);let d={};u.forEach((e,t)=>{null!==e&&(d[-1===t?"arrow_dummy":`arrow_${t}`]={type:"range",start:t,end:e})});let c=new StepRecorder({values:t,m:r,n:s,dummy:"Node(0)",prev:void 0,curr:void 0,nextNode:void 0},{...o,...d,ptr_head:{type:"pointer",position:0,label:"head"}}),p=e=>-1===e?"arrow_dummy":`arrow_${e}`;if(c.record("-","Start of algorithm"),null===l)return c.record("return","Return head unchanged"),c.getSteps();let v=new i(0);v.next=l,c.update_variable("dummy","Node(0)"),c.record("create_dummy","Create dummy node and connect it to head");let h=v,_=-1;c.update_variable("prev",a(h)),c.add_new_visual("ptr_pre",{type:"pointer",position:-1,label:"prev"}),c.record("init_pre","Initialize prev to the dummy node");for(let e=1;e<r;e++)c.add_conditional("for_pre",!0),h=h.next,_=e-1,c.update_variable("prev",a(h)),c.update_visual("ptr_pre",{type:"pointer",position:_,label:"prev"}),c.record("move_pre",`prev = prev.next (now at node ${t[_]})`);r>1&&c.add_conditional("for_pre",!1);let x=h.next,g=x.next,f=r-1,m=r;c.update_variable("curr",a(x)),c.add_new_visual("ptr_start",{type:"pointer",position:f,label:"curr"}),c.record("init_start",`curr = prev.next (node ${x.val}), first node in the reversal range`),c.update_variable("nextNode",a(g)),g&&c.add_new_visual("ptr_then",{type:"pointer",position:m,label:"nextNode"}),c.record("init_then",`nextNode = curr.next (${g?`node ${g.val}`:"null"})`);for(let e=f;e<s;e++)c.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});c.record("highlight_sublist",`Highlight nodes from position ${r} to ${s}, the range to reverse`);for(let e=0;e<s-r&&(c.add_conditional("for_reverse",!0),g);e++){let e=u.get(m),r=u.get(_);x.next=g.next,g.next=h.next,h.next=g,c.delete_visual(p(f)),c.delete_visual(p(m)),c.delete_visual(p(_)),null!=e?(c.add_new_visual(p(f),{type:"range",start:f,end:e}),u.set(f,e)):u.set(f,null),null!=r&&(c.add_new_visual(p(m),{type:"range",start:m,end:r}),u.set(m,r)),c.add_new_visual(p(_),{type:"range",start:_,end:m}),u.set(_,m),c.record("reverse_step",`Move node ${t[m]} to the front: curr.next = nextNode.next, nextNode.next = prev.next, prev.next = nextNode`),(g=x.next)&&null!=e&&e<t.length?(m=e,c.update_variable("nextNode",a(g)),c.update_visual("ptr_then",{type:"pointer",position:m,label:"nextNode"}),c.record("move_then",`nextNode = curr.next (node ${t[m]})`)):(c.update_variable("nextNode",null),c.delete_visual("ptr_then"),c.record("move_then","nextNode = curr.next (null, reversal complete)"))}c.add_conditional("for_reverse",!1);for(let e=f;e<s;e++)c.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:e,state:"visited"});c.delete_visual("ptr_pre"),c.delete_visual("ptr_start"),c.delete_visual("ptr_then"),c.record("complete","Reversal complete");let w=t.length,b=[];for(let e=0;e<f;e++)b.push(e);for(let e=s-1;e>=f;e--)b.push(e);for(let e=s;e<w;e++)b.push(e);b.forEach((e,r)=>{c.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:r,state:0===r?"result":"default"})}),c.update_visual("arrow_dummy",{type:"range",start:-1,end:0});for(let e=0;e<w;e++)c.delete_visual(`arrow_${e}`);for(let e=0;e<w-1;e++)c.add_new_visual(`arrow_linear_${e}`,{type:"range",start:e,end:e+1});return c.record("return","Lay the reversed list out left to right and return the new head"),c.getSteps()
}

export function ReverseLinkedListIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReverseLinkedListIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReverseLinkedListIiSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Reverse Linked List II"
      slug="reverse-linked-list-ii"
      approaches={approaches}
      presets={ReverseLinkedListIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reverse Nodes in k-Group (reverse-nodes-in-k-group)
// ==========================================

const ReverseNodesInKGroupTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:\n        dummy = ListNode(0)\n        dummy.next = head\n        group_prev = dummy\n\n        while True:\n            # Check if k nodes remain\n            kth_node = self.get_kth_node(group_prev, k)\n            if not kth_node:\n                break\n\n            group_next = kth_node.next\n\n            # Reverse k nodes starting from group_prev.next\n            prev = group_next\n            curr = group_prev.next\n            for _ in range(k):\n                next_node = curr.next\n                curr.next = prev\n                prev = curr\n                curr = next_node\n\n            # Reconnect\n            group_head = group_prev.next  # original first node, now tail\n            group_prev.next = kth_node    # kth_node is the new head\n            group_prev = group_head       # advance to the tail of reversed group\n\n        return dummy.next\n\n    def get_kth_node(self, node: Optional[ListNode], k: int) -> Optional[ListNode]:\n        while node and k > 0:\n            node = node.next\n            k -= 1\n        return node",
    "lineMap": {
      "-": [
        2
      ],
      "create_dummy": [
        3,
        4
      ],
      "init_group_prev": [
        5
      ],
      "find_kth": [
        9
      ],
      "break_out": [
        11
      ],
      "init_group_next": [
        13
      ],
      "init_reverse": [
        16,
        17
      ],
      "reverse_step": [
        19,
        20,
        21,
        22
      ],
      "reconnect": [
        25,
        26,
        27
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "while_true": [
        7
      ],
      "kth_null": [
        10
      ],
      "for_reverse": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        ListNode dummy = new ListNode(0);\n        dummy.next = head;\n        ListNode groupPrev = dummy;\n\n        while (true) {\n            // Check if k nodes remain\n            ListNode kthNode = getKthNode(groupPrev, k);\n            if (kthNode == null) break;\n\n            ListNode groupNext = kthNode.next;\n\n            // Reverse k nodes starting from groupPrev.next\n            ListNode prev = groupNext; // will become the \"next\" for the last reversed node\n            ListNode curr = groupPrev.next;\n            for (int i = 0; i < k; i++) {\n                ListNode next = curr.next;\n                curr.next = prev;\n                prev = curr;\n                curr = next;\n            }\n\n            // Reconnect: groupPrev -> new head, old head is now the tail\n            ListNode groupHead = groupPrev.next; // original first node, now tail\n            groupPrev.next = kthNode; // kthNode is now the new head after reversal\n            groupPrev = groupHead; // move groupPrev to the tail of reversed group\n        }\n\n        return dummy.next;\n    }\n\n    // Returns the k-th node from the given node, or null if fewer than k nodes remain\n    private ListNode getKthNode(ListNode node, int k) {\n        while (node != null && k > 0) {\n            node = node.next;\n            k--;\n        }\n        return node;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "create_dummy": [
        3,
        4
      ],
      "init_group_prev": [
        5
      ],
      "find_kth": [
        9
      ],
      "break_out": [
        10
      ],
      "init_group_next": [
        12
      ],
      "init_reverse": [
        15,
        16
      ],
      "reverse_step": [
        18,
        19,
        20,
        21
      ],
      "reconnect": [
        25,
        26,
        27
      ],
      "return": [
        30
      ]
    },
    "conditionalMap": {
      "while_true": [
        7
      ],
      "kth_null": [
        10
      ],
      "for_reverse": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    ListNode* reverseKGroup(ListNode* head, int k) {\n        ListNode dummy(0);\n        dummy.next = head;\n        ListNode* groupPrev = &dummy;\n\n        while (true) {\n            // Check if k nodes remain\n            ListNode* kthNode = getKthNode(groupPrev, k);\n            if (!kthNode) break;\n\n            ListNode* groupNext = kthNode->next;\n\n            // Reverse k nodes starting from groupPrev->next\n            ListNode* prev = groupNext;\n            ListNode* curr = groupPrev->next;\n            for (int i = 0; i < k; i++) {\n                ListNode* next = curr->next;\n                curr->next = prev;\n                prev = curr;\n                curr = next;\n            }\n\n            // Reconnect\n            ListNode* groupHead = groupPrev->next;\n            groupPrev->next = kthNode;\n            groupPrev = groupHead;\n        }\n\n        return dummy.next;\n    }\n\nprivate:\n    ListNode* getKthNode(ListNode* node, int k) {\n        while (node && k > 0) {\n            node = node->next;\n            k--;\n        }\n        return node;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "create_dummy": [
        4,
        5
      ],
      "init_group_prev": [
        6
      ],
      "find_kth": [
        10
      ],
      "break_out": [
        11
      ],
      "init_group_next": [
        13
      ],
      "init_reverse": [
        16,
        17
      ],
      "reverse_step": [
        19,
        20,
        21,
        22
      ],
      "reconnect": [
        26,
        27,
        28
      ],
      "return": [
        31
      ]
    },
    "conditionalMap": {
      "while_true": [
        8
      ],
      "kth_null": [
        11
      ],
      "for_reverse": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public ListNode ReverseKGroup(ListNode head, int k) {\n        ListNode dummy = new ListNode(0);\n        dummy.next = head;\n        ListNode groupPrev = dummy;\n\n        while (true) {\n            // Check if k nodes remain\n            ListNode kthNode = GetKthNode(groupPrev, k);\n            if (kthNode == null) break;\n\n            ListNode groupNext = kthNode.next;\n\n            // Reverse k nodes starting from groupPrev.next\n            ListNode prev = groupNext;\n            ListNode curr = groupPrev.next;\n            for (int i = 0; i < k; i++) {\n                ListNode next = curr.next;\n                curr.next = prev;\n                prev = curr;\n                curr = next;\n            }\n\n            // Reconnect\n            ListNode groupHead = groupPrev.next;\n            groupPrev.next = kthNode;\n            groupPrev = groupHead;\n        }\n\n        return dummy.next;\n    }\n\n    private ListNode GetKthNode(ListNode node, int k) {\n        while (node != null && k > 0) {\n            node = node.next;\n            k--;\n        }\n        return node;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "create_dummy": [
        3,
        4
      ],
      "init_group_prev": [
        5
      ],
      "find_kth": [
        9
      ],
      "break_out": [
        10
      ],
      "init_group_next": [
        12
      ],
      "init_reverse": [
        15,
        16
      ],
      "reverse_step": [
        18,
        19,
        20,
        21
      ],
      "reconnect": [
        25,
        26,
        27
      ],
      "return": [
        30
      ]
    },
    "conditionalMap": {
      "while_true": [
        7
      ],
      "kth_null": [
        10
      ],
      "for_reverse": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reverseKGroup(head *ListNode, k int) *ListNode {\n    dummy := &ListNode{Val: 0, Next: head}\n    groupPrev := dummy\n\n    for {\n        // Check if k nodes remain\n        kthNode := getKthNode(groupPrev, k)\n        if kthNode == nil {\n            break\n        }\n\n        groupNext := kthNode.Next\n\n        // Reverse k nodes starting from groupPrev.Next\n        prev := groupNext\n        curr := groupPrev.Next\n        for i := 0; i < k; i++ {\n            next := curr.Next\n            curr.Next = prev\n            prev = curr\n            curr = next\n        }\n\n        // Reconnect\n        groupHead := groupPrev.Next\n        groupPrev.Next = kthNode\n        groupPrev = groupHead\n    }\n\n    return dummy.Next\n}\n\nfunc getKthNode(node *ListNode, k int) *ListNode {\n    for node != nil && k > 0 {\n        node = node.Next\n        k--\n    }\n    return node\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_dummy": [
        2
      ],
      "init_group_prev": [
        3
      ],
      "find_kth": [
        7
      ],
      "break_out": [
        9
      ],
      "init_group_next": [
        12
      ],
      "init_reverse": [
        15,
        16
      ],
      "reverse_step": [
        18,
        19,
        20,
        21
      ],
      "reconnect": [
        25,
        26,
        27
      ],
      "return": [
        30
      ]
    },
    "conditionalMap": {
      "while_true": [
        5
      ],
      "kth_null": [
        8
      ],
      "for_reverse": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var reverseKGroup = function(head, k) {\n    var dummy = new ListNode(0);\n    dummy.next = head;\n    var groupPrev = dummy;\n\n    while (true) {\n        // Check if k nodes remain\n        var kthNode = getKthNode(groupPrev, k);\n        if (!kthNode) break;\n\n        var groupNext = kthNode.next;\n\n        // Reverse k nodes starting from groupPrev.next\n        var prev = groupNext;\n        var curr = groupPrev.next;\n        for (var i = 0; i < k; i++) {\n            var next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n\n        // Reconnect\n        var groupHead = groupPrev.next;\n        groupPrev.next = kthNode;\n        groupPrev = groupHead;\n    }\n\n    return dummy.next;\n};\n\nfunction getKthNode(node, k) {\n    while (node && k > 0) {\n        node = node.next;\n        k--;\n    }\n    return node;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_dummy": [
        2,
        3
      ],
      "init_group_prev": [
        4
      ],
      "find_kth": [
        8
      ],
      "break_out": [
        9
      ],
      "init_group_next": [
        11
      ],
      "init_reverse": [
        14,
        15
      ],
      "reverse_step": [
        17,
        18,
        19,
        20
      ],
      "reconnect": [
        24,
        25,
        26
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "while_true": [
        6
      ],
      "kth_null": [
        9
      ],
      "for_reverse": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reverseKGroup(head: ListNode | null, k: number): ListNode | null {\n    const dummy = new ListNode(0);\n    dummy.next = head;\n    let groupPrev: ListNode = dummy;\n\n    while (true) {\n        // Check if k nodes remain\n        const kthNode = getKthNode(groupPrev, k);\n        if (!kthNode) break;\n\n        const groupNext: ListNode | null = kthNode.next;\n\n        // Reverse k nodes starting from groupPrev.next\n        let prev: ListNode | null = groupNext;\n        let curr: ListNode | null = groupPrev.next;\n        for (let i = 0; i < k; i++) {\n            const next: ListNode | null = curr!.next;\n            curr!.next = prev;\n            prev = curr;\n            curr = next;\n        }\n\n        // Reconnect\n        const groupHead: ListNode = groupPrev.next!;\n        groupPrev.next = kthNode;\n        groupPrev = groupHead;\n    }\n\n    return dummy.next;\n}\n\nfunction getKthNode(node: ListNode | null, k: number): ListNode | null {\n    while (node && k > 0) {\n        node = node.next;\n        k--;\n    }\n    return node;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_dummy": [
        2,
        3
      ],
      "init_group_prev": [
        4
      ],
      "find_kth": [
        8
      ],
      "break_out": [
        9
      ],
      "init_group_next": [
        11
      ],
      "init_reverse": [
        14,
        15
      ],
      "reverse_step": [
        17,
        18,
        19,
        20
      ],
      "reconnect": [
        24,
        25,
        26
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "while_true": [
        6
      ],
      "kth_null": [
        9
      ],
      "for_reverse": [
        16
      ]
    }
  }
};

const ReverseNodesInKGroupPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (k=2)",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (k=3)",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Even groups",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "k": 2
    }
  },
  {
    "id": "ex4",
    "label": "Two groups of 3",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "k": 3
    }
  },
  {
    "id": "ex5",
    "label": "k=1 (no change)",
    "value": {
      "values": [
        1,
        2,
        3
      ],
      "k": 1
    }
  }
];

function generateReverseNodesInKGroupSteps(e: any): any[] {
  

let r=e.values,t=e.k,o=r.length,a={node_dummy:{type:"arrayElement",value:0,position:-1,state:"default"}};r.forEach((e,r)=>{a[`node_${r}`]={type:"arrayElement",value:e,position:r,state:"default"}});let i=new Map;i.set(-1,o>0?0:null);for(let e=0;e<o-1;e++)i.set(e,e+1);o>0&&i.set(o-1,null);let u=(e,r)=>`arrow_${e}_${r}`,s={};i.forEach((e,r)=>{null!==e&&(s[u(r,e)]={type:"range",start:r,end:e})});let l=new StepRecorder({values:r,k:t,dummy:void 0,groupPrev:void 0,kthNode:void 0,groupNext:void 0,prev:void 0,curr:void 0,next:void 0},{...a,...s,ptr_head:{type:"pointer",position:0,label:"head"}}),d=e=>null===e?null:e<0?"Node(0)":`Node(${r[e]})`,c=e=>{let r=i.get(e);null!=r&&l.delete_visual(u(e,r)),i.delete(e)},p=(e,r)=>{null!==r&&l.add_new_visual(u(e,r),{type:"range",start:e,end:r}),i.set(e,r)};if(l.record("-","Start: reverse the list in groups of k"),0===o)return l.record("return","Empty list, return dummy.next"),l.getSteps();l.update_variable("dummy","Node(0)"),l.record("create_dummy","dummy = ListNode(0), dummy.next = head");let v=-1;l.update_variable("groupPrev",d(v)),l.add_new_visual("ptr_group_prev",{type:"pointer",position:v,label:"groupPrev"}),l.record("init_group_prev","groupPrev = dummy");let h=0;for(;;){l.add_conditional("while_true",!0);let e=h+t-1<o?h+t-1:null;if(l.update_variable("kthNode",d(e)),null!==e?(l.add_new_visual("ptr_kth",{type:"pointer",position:e,label:"kthNode"}),l.record("find_kth",`getKthNode(groupPrev, ${t}) = node ${r[e]}`)):(l.delete_visual("ptr_kth"),l.record("find_kth",`getKthNode(groupPrev, ${t}) = null, fewer than k nodes remain`)),l.add_conditional("kth_null",null===e),null===e){for(let e=h;e<o;e++)l.update_visual(`node_${e}`,{type:"arrayElement",value:r[e],position:e,state:"highlight"});l.record("break_out","kthNode is null, break out of the loop");break}let n=e+1<o?e+1:null;for(let t=h;t<=e;t++)l.update_visual(`node_${t}`,{type:"arrayElement",value:r[t],position:t,state:"active"});l.update_variable("groupNext",d(n)),l.record("init_group_next",`groupNext = kthNode.next (${null===n?"null":`node ${r[n]}`})`);let a=n,i=h;l.update_variable("prev",d(a)),l.update_variable("curr",d(i)),l.add_new_visual("ptr_curr",{type:"pointer",position:i,label:"curr"}),l.record("init_reverse",`prev = groupNext, curr = groupPrev.next (node ${r[h]})`);for(let o=0;o<t;o++){l.add_conditional("for_reverse",!0);let t=h+o,u=t+1<=e?t+1:n;l.update_variable("next",d(u)),c(t),p(t,a),a=t,i=u,l.update_variable("prev",d(a)),l.update_variable("curr",d(i)),null!==i?l.update_visual("ptr_curr",{type:"pointer",position:i,label:"curr"}):l.delete_visual("ptr_curr"),l.record("reverse_step",`Point node ${r[t]} back: curr.next = prev, then prev = curr, curr = next`)}l.add_conditional("for_reverse",!1);for(let t=h;t<=e;t++)l.update_visual(`node_${t}`,{type:"arrayElement",value:r[t],position:t,state:"visited"});let u=h;c(v),p(v,e),v=u,l.update_variable("groupPrev",d(v)),l.update_visual("ptr_group_prev",{type:"pointer",position:v,label:"groupPrev"}),l.delete_visual("ptr_curr"),l.delete_visual("ptr_kth"),l.record("reconnect",`groupPrev.next = kthNode (node ${r[e]}), then groupPrev = node ${r[u]}`),h=e+1}l.add_conditional("while_true",!1),l.delete_visual("ptr_group_prev");let g=Math.floor(o/t),_=[];for(let e=0;e<g;e++)for(let r=t-1;r>=0;r--)_.push(e*t+r);for(let e=g*t;e<o;e++)_.push(e);for(let e of(_.forEach((e,t)=>{l.update_visual(`node_${e}`,{type:"arrayElement",value:r[e],position:t,state:0===t?"result":"default"})}),Array.from(i.keys())))c(e);l.add_new_visual("arrow_final_dummy",{type:"range",start:-1,end:0});for(let e=0;e<o-1;e++)l.add_new_visual(`arrow_final_${e}`,{type:"range",start:e,end:e+1});return l.delete_visual("ptr_head"),l.record("return","Return dummy.next, the head of the fully reversed list"),l.getSteps()
}

export function ReverseNodesInKGroupProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReverseNodesInKGroupTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReverseNodesInKGroupSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Reverse Nodes in k-Group"
      slug="reverse-nodes-in-k-group"
      approaches={approaches}
      presets={ReverseNodesInKGroupPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Duplicates from Sorted List II (remove-duplicates-from-sorted-list-ii)
// ==========================================

const RemoveDuplicatesFromSortedListIiTemplates = {
  "python": {
    "language": "python",
    "code": "def deleteDuplicates(head):\n    dummy = ListNode(0, head)\n    prev = dummy\n\n    current = head\n    while current:\n        # Check if current starts a duplicate run\n        if current.next and current.val == current.next.val:\n            # Skip all nodes with this value\n            while current.next and current.val == current.next.val:\n                current = current.next\n            # Wire prev to the node after the duplicate run\n            prev.next = current.next\n        else:\n            # Current is unique, advance prev\n            prev = prev.next\n        current = current.next\n\n    return dummy.next",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "check_curr": [
        6
      ],
      "found_duplicate": [
        8
      ],
      "delete_node_start": [
        10
      ],
      "skip_while": [
        10
      ],
      "curr_next": [
        11
      ],
      "update_prev_next": [
        13
      ],
      "no_duplicate": [
        16
      ],
      "move_forward": [
        16,
        17
      ],
      "return": [
        19
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ],
      "has_duplicate": [
        8
      ],
      "no_duplicate": [
        14
      ],
      "skip_while": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode deleteDuplicates(ListNode head) {\n    ListNode dummy = new ListNode(0, head);\n    ListNode prev = dummy;\n\n    ListNode current = head;\n    while (current != null) {\n        // Check if current starts a duplicate run\n        if (current.next != null && current.val == current.next.val) {\n            // Skip all nodes with this value\n            while (current.next != null && current.val == current.next.val) {\n                current = current.next;\n            }\n            // Wire prev to the node after the duplicate run\n            prev.next = current.next;\n        } else {\n            // Current is unique, advance prev\n            prev = prev.next;\n        }\n        current = current.next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "check_curr": [
        6
      ],
      "found_duplicate": [
        8
      ],
      "delete_node_start": [
        10
      ],
      "skip_while": [
        10
      ],
      "curr_next": [
        11
      ],
      "update_prev_next": [
        14
      ],
      "no_duplicate": [
        17
      ],
      "move_forward": [
        17,
        19
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ],
      "has_duplicate": [
        8
      ],
      "no_duplicate": [
        15
      ],
      "skip_while": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* deleteDuplicates(ListNode* head) {\n    ListNode dummy(0, head);\n    ListNode* prev = &dummy;\n\n    ListNode* current = head;\n    while (current) {\n        // Check if current starts a duplicate run\n        if (current->next && current->val == current->next->val) {\n            // Skip all nodes with this value\n            while (current->next && current->val == current->next->val) {\n                current = current->next;\n            }\n            // Wire prev to the node after the duplicate run\n            prev->next = current->next;\n        } else {\n            // Current is unique, advance prev\n            prev = prev->next;\n        }\n        current = current->next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "check_curr": [
        6
      ],
      "found_duplicate": [
        8
      ],
      "delete_node_start": [
        10
      ],
      "skip_while": [
        10
      ],
      "curr_next": [
        11
      ],
      "update_prev_next": [
        14
      ],
      "no_duplicate": [
        17
      ],
      "move_forward": [
        17,
        19
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ],
      "has_duplicate": [
        8
      ],
      "no_duplicate": [
        15
      ],
      "skip_while": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode DeleteDuplicates(ListNode head) {\n    ListNode dummy = new ListNode(0, head);\n    ListNode prev = dummy;\n\n    ListNode current = head;\n    while (current != null) {\n        // Check if current starts a duplicate run\n        if (current.next != null && current.val == current.next.val) {\n            // Skip all nodes with this value\n            while (current.next != null && current.val == current.next.val) {\n                current = current.next;\n            }\n            // Wire prev to the node after the duplicate run\n            prev.next = current.next;\n        } else {\n            // Current is unique, advance prev\n            prev = prev.next;\n        }\n        current = current.next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "check_curr": [
        6
      ],
      "found_duplicate": [
        8
      ],
      "delete_node_start": [
        10
      ],
      "skip_while": [
        10
      ],
      "curr_next": [
        11
      ],
      "update_prev_next": [
        14
      ],
      "no_duplicate": [
        17
      ],
      "move_forward": [
        17,
        19
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ],
      "has_duplicate": [
        8
      ],
      "no_duplicate": [
        15
      ],
      "skip_while": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func deleteDuplicates(head *ListNode) *ListNode {\n    dummy := &ListNode{Val: 0, Next: head}\n    prev := dummy\n\n    current := head\n    for current != nil {\n        // Check if current starts a duplicate run\n        if current.Next != nil && current.Val == current.Next.Val {\n            // Skip all nodes with this value\n            for current.Next != nil && current.Val == current.Next.Val {\n                current = current.Next\n            }\n            // Wire prev to the node after the duplicate run\n            prev.Next = current.Next\n        } else {\n            // Current is unique, advance prev\n            prev = prev.Next\n        }\n        current = current.Next\n    }\n\n    return dummy.Next\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "check_curr": [
        6
      ],
      "found_duplicate": [
        8
      ],
      "delete_node_start": [
        10
      ],
      "skip_while": [
        10
      ],
      "curr_next": [
        11
      ],
      "update_prev_next": [
        14
      ],
      "no_duplicate": [
        17
      ],
      "move_forward": [
        17,
        19
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ],
      "has_duplicate": [
        8
      ],
      "no_duplicate": [
        15
      ],
      "skip_while": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function deleteDuplicates(head) {\n    var dummy = new ListNode(0, head);\n    var prev = dummy;\n\n    var current = head;\n    while (current !== null) {\n        // Check if current starts a duplicate run\n        if (current.next !== null && current.val === current.next.val) {\n            // Skip all nodes with this value\n            while (current.next !== null && current.val === current.next.val) {\n                current = current.next;\n            }\n            // Wire prev to the node after the duplicate run\n            prev.next = current.next;\n        } else {\n            // Current is unique, advance prev\n            prev = prev.next;\n        }\n        current = current.next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "check_curr": [
        6
      ],
      "found_duplicate": [
        8
      ],
      "delete_node_start": [
        10
      ],
      "skip_while": [
        10
      ],
      "curr_next": [
        11
      ],
      "update_prev_next": [
        14
      ],
      "no_duplicate": [
        17
      ],
      "move_forward": [
        17,
        19
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ],
      "has_duplicate": [
        8
      ],
      "no_duplicate": [
        15
      ],
      "skip_while": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function deleteDuplicates(head: ListNode | null): ListNode | null {\n    const dummy = new ListNode(0, head);\n    let prev: ListNode = dummy;\n\n    let current = head;\n    while (current !== null) {\n        // Check if current starts a duplicate run\n        if (current.next !== null && current.val === current.next.val) {\n            // Skip all nodes with this value\n            while (current.next !== null && current.val === current.next.val) {\n                current = current.next;\n            }\n            // Wire prev to the node after the duplicate run\n            prev.next = current.next;\n        } else {\n            // Current is unique, advance prev\n            prev = prev.next;\n        }\n        current = current.next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "check_curr": [
        6
      ],
      "found_duplicate": [
        8
      ],
      "delete_node_start": [
        10
      ],
      "skip_while": [
        10
      ],
      "curr_next": [
        11
      ],
      "update_prev_next": [
        14
      ],
      "no_duplicate": [
        17
      ],
      "move_forward": [
        17,
        19
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "while_curr": [
        6
      ],
      "has_duplicate": [
        8
      ],
      "no_duplicate": [
        15
      ],
      "skip_while": [
        10
      ]
    }
  }
};

const RemoveDuplicatesFromSortedListIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "values": [
        1,
        2,
        3,
        3,
        4,
        4,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Remove Head",
    "value": {
      "values": [
        1,
        1,
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Duplicates",
    "value": {
      "values": [
        1,
        1,
        2,
        2,
        3,
        3
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All Same",
    "value": {
      "values": [
        1,
        1,
        1,
        1
      ]
    }
  },
  {
    "id": "ex5",
    "label": "No Duplicates",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  }
];

function generateRemoveDuplicatesFromSortedListIiSteps(e: any): any[] {
  class a{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function u(e){return null===e?null:`Node(${e.val})`}

let t=e.values,r=null;if(t.length>0){let e=r=new a(t[0]);for(let r=1;r<t.length;r++)e.next=new a(t[r]),e=e.next}let l=[];if(t.length>0){r=new a(t[0]),l.push(r);let e=r;for(let r=1;r<t.length;r++)e.next=new a(t[r]),e=e.next,l.push(e)}let i={};t.forEach((e,t)=>{i[`node_${t}`]={type:"arrayElement",value:e,position:t}});let o={};for(let e=0;e<t.length-1;e++)o[`arrow_${e}`]={type:"range",start:e,end:e+1};let d={};null!==r&&(d.ptr_head={type:"pointer",position:0,label:"head"});let s=new StepRecorder({values:t,head:u(r)},{...i,...o,...d});s.record("-","Start of algorithm");let c=new a(0,r),p=c,v=r,h=new Set(t.map((e,t)=>t));h.add(-1);let _=0;for(s.update_variable("dummy",u(c)),s.update_variable("prev",u(c)),s.update_variable("curr",u(v)),s.add_new_visual("node_-1",{type:"arrayElement",value:0,position:-1}),null!==r&&(s.add_new_visual("arrow_-1",{type:"range",start:-1,end:0}),s.add_new_visual("ptr_curr",{type:"pointer",position:0,label:"curr"})),s.add_new_visual("ptr_dummy",{type:"pointer",position:-1,label:"dummy"}),s.add_new_visual("ptr_prev",{type:"pointer",position:-1,label:"prev"}),s.record("initialize","Create dummy node pointing to head. Initialize prev=dummy, curr=head");null!==v;)if(s.add_conditional("while_curr",!0),null!==v.next&&v.val===v.next.val){s.add_conditional("has_duplicate",!0),s.record("found_duplicate",`Found duplicate: curr.val (${v.val}) == curr.next.val (${v.next?.val})`);let e=v.val,t=[],r=[];for(;null!==v&&v.val===e;)s.add_conditional("skip_while",!0),h.delete(_),t.push(_),r.push(_),v=v.next,_++,s.update_variable("curr",u(v)),null===v?(s.delete_visual("ptr_curr"),s.delete_visual(`arrow_${_}`)):s.update_visual("ptr_curr",{type:"pointer",position:_,label:"curr"}),s.record("curr_next","Move curr.next forward");s.add_conditional("skip_while",!1),s.record("skip_while","End of skip while loop"),p.next=v,null===v&&s.delete_visual("arrow_-1"),t.forEach(e=>{0===e&&s.delete_visual("ptr_head"),s.delete_visual(`node_${e}`)}),r.forEach(e=>{s.delete_visual(`arrow_${e}`)});let n=Array.from(h).sort((e,t)=>e-t);for(let e=0;e<n.length-1;e++){let t=n[e],r=n[e+1];s.update_visual(`arrow_${t}`,{type:"range",start:t,end:r})}s.update_variable("curr",u(v)),null!==v?s.update_visual("ptr_curr",{type:"pointer",position:_,label:"curr"}):s.delete_visual("ptr_curr"),s.record("update_prev_next","Update prev.next to skip all duplicates")}else s.add_conditional("has_duplicate",!1),s.add_conditional("no_duplicate",!0),s.record("no_duplicate",`No duplicate for value ${v.val}, keep this node`),p=v,v=v.next,_++,s.update_variable("prev",u(p)),s.update_variable("curr",u(v)),s.update_visual("ptr_prev",{type:"pointer",position:_-1,label:"prev"}),null!==v?s.update_visual("ptr_curr",{type:"pointer",position:_,label:"curr"}):s.delete_visual("ptr_curr"),s.record("move_forward","Move prev and curr forward");s.add_conditional("while_curr",!1),s.update_variable("curr",null),s.delete_visual("ptr_curr");let m=c.next,x=l.indexOf(m);return null!==m&&s.update_visual(`node_${x}`,{type:"arrayElement",value:l[x].val,position:x,label:"slow",state:"result"}),s.record("return","Return dummy.next as the new head"),s.getSteps()
}

export function RemoveDuplicatesFromSortedListIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveDuplicatesFromSortedListIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveDuplicatesFromSortedListIiSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Remove Duplicates from Sorted List II"
      slug="remove-duplicates-from-sorted-list-ii"
      approaches={approaches}
      presets={RemoveDuplicatesFromSortedListIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Merge Two Sorted Lists (merge-two-sorted-lists)
// ==========================================

const MergeTwoSortedListsTemplates = {
  "python": {
    "language": "python",
    "code": "def mergeTwoLists(list1, list2):\n    dummy = ListNode(0)\n    current = dummy\n\n    p = list1\n    q = list2\n\n    while p and q:\n        if p.val <= q.val:\n            current.next = p\n            p = p.next\n        else:\n            current.next = q\n            q = q.next\n        current = current.next\n\n    if p:\n        current.next = p\n    else:\n        current.next = q\n\n    return dummy.next",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        5,
        6
      ],
      "compare_nodes": [
        9
      ],
      "select_from_list1": [
        10
      ],
      "advance_p": [
        11
      ],
      "select_from_list2": [
        13
      ],
      "advance_q": [
        14
      ],
      "move_current": [
        15
      ],
      "check_remaining_list1": [
        17
      ],
      "attach_list1": [
        18
      ],
      "check_remaining_list2": [
        19
      ],
      "attach_list2": [
        20
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "main_loop": [
        8
      ],
      "comparison": [
        9
      ],
      "remaining_list1": [
        17
      ],
      "remaining_list2": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    ListNode dummy = new ListNode(0);\n    ListNode current = dummy;\n\n    ListNode p = list1;\n    ListNode q = list2;\n\n    while (p != null && q != null) {\n        if (p.val <= q.val) {\n            current.next = p;\n            p = p.next;\n        } else {\n            current.next = q;\n            q = q.next;\n        }\n        current = current.next;\n    }\n\n    if (p != null) {\n        current.next = p;\n    } else {\n        current.next = q;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        5,
        6
      ],
      "compare_nodes": [
        9
      ],
      "select_from_list1": [
        10
      ],
      "advance_p": [
        11
      ],
      "select_from_list2": [
        13
      ],
      "advance_q": [
        14
      ],
      "move_current": [
        16
      ],
      "check_remaining_list1": [
        19
      ],
      "attach_list1": [
        20
      ],
      "check_remaining_list2": [
        21
      ],
      "attach_list2": [
        22
      ],
      "return": [
        25
      ]
    },
    "conditionalMap": {
      "main_loop": [
        8
      ],
      "comparison": [
        9
      ],
      "remaining_list1": [
        19
      ],
      "remaining_list2": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    ListNode* dummy = new ListNode(0);\n    ListNode* current = dummy;\n\n    ListNode* p = list1;\n    ListNode* q = list2;\n\n    while (p != nullptr && q != nullptr) {\n        if (p->val <= q->val) {\n            current->next = p;\n            p = p->next;\n        } else {\n            current->next = q;\n            q = q->next;\n        }\n        current = current->next;\n    }\n\n    if (p != nullptr) {\n        current->next = p;\n    } else {\n        current->next = q;\n    }\n\n    return dummy->next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        5,
        6
      ],
      "compare_nodes": [
        9
      ],
      "select_from_list1": [
        10
      ],
      "advance_p": [
        11
      ],
      "select_from_list2": [
        13
      ],
      "advance_q": [
        14
      ],
      "move_current": [
        16
      ],
      "check_remaining_list1": [
        19
      ],
      "attach_list1": [
        20
      ],
      "check_remaining_list2": [
        21
      ],
      "attach_list2": [
        22
      ],
      "return": [
        25
      ]
    },
    "conditionalMap": {
      "main_loop": [
        8
      ],
      "comparison": [
        9
      ],
      "remaining_list1": [
        19
      ],
      "remaining_list2": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function mergeTwoLists(list1, list2) {\n    const dummy = new ListNode(0);\n    let current = dummy;\n\n    let p = list1;\n    let q = list2;\n\n    while (p !== null && q !== null) {\n        if (p.val <= q.val) {\n            current.next = p;\n            p = p.next;\n        } else {\n            current.next = q;\n            q = q.next;\n        }\n        current = current.next;\n    }\n\n    if (p !== null) {\n        current.next = p;\n    } else {\n        current.next = q;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        5,
        6
      ],
      "compare_nodes": [
        9
      ],
      "select_from_list1": [
        10
      ],
      "advance_p": [
        11
      ],
      "select_from_list2": [
        13
      ],
      "advance_q": [
        14
      ],
      "move_current": [
        16
      ],
      "check_remaining_list1": [
        19
      ],
      "attach_list1": [
        20
      ],
      "check_remaining_list2": [
        21
      ],
      "attach_list2": [
        22
      ],
      "return": [
        25
      ]
    },
    "conditionalMap": {
      "main_loop": [
        8
      ],
      "comparison": [
        9
      ],
      "remaining_list1": [
        19
      ],
      "remaining_list2": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {\n    const dummy = new ListNode(0);\n    let current: ListNode = dummy;\n\n    let p: ListNode | null = list1;\n    let q: ListNode | null = list2;\n\n    while (p !== null && q !== null) {\n        if (p.val <= q.val) {\n            current.next = p;\n            p = p.next;\n        } else {\n            current.next = q;\n            q = q.next;\n        }\n        current = current.next!;\n    }\n\n    if (p !== null) {\n        current.next = p;\n    } else {\n        current.next = q;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        5,
        6
      ],
      "compare_nodes": [
        9
      ],
      "select_from_list1": [
        10
      ],
      "advance_p": [
        11
      ],
      "select_from_list2": [
        13
      ],
      "advance_q": [
        14
      ],
      "move_current": [
        16
      ],
      "check_remaining_list1": [
        19
      ],
      "attach_list1": [
        20
      ],
      "check_remaining_list2": [
        21
      ],
      "attach_list2": [
        22
      ],
      "return": [
        25
      ]
    },
    "conditionalMap": {
      "main_loop": [
        8
      ],
      "comparison": [
        9
      ],
      "remaining_list1": [
        19
      ],
      "remaining_list2": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode MergeTwoLists(ListNode list1, ListNode list2) {\n    ListNode dummy = new ListNode(0);\n    ListNode current = dummy;\n\n    ListNode p = list1;\n    ListNode q = list2;\n\n    while (p != null && q != null) {\n        if (p.val <= q.val) {\n            current.next = p;\n            p = p.next;\n        } else {\n            current.next = q;\n            q = q.next;\n        }\n        current = current.next;\n    }\n\n    if (p != null) {\n        current.next = p;\n    } else {\n        current.next = q;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        5,
        6
      ],
      "compare_nodes": [
        9
      ],
      "select_from_list1": [
        10
      ],
      "advance_p": [
        11
      ],
      "select_from_list2": [
        13
      ],
      "advance_q": [
        14
      ],
      "move_current": [
        16
      ],
      "check_remaining_list1": [
        19
      ],
      "attach_list1": [
        20
      ],
      "check_remaining_list2": [
        21
      ],
      "attach_list2": [
        22
      ],
      "return": [
        25
      ]
    },
    "conditionalMap": {
      "main_loop": [
        8
      ],
      "comparison": [
        9
      ],
      "remaining_list1": [
        19
      ],
      "remaining_list2": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {\n    dummy := &ListNode{Val: 0}\n    current := dummy\n\n    p := list1\n    q := list2\n\n    for p != nil && q != nil {\n        if p.Val <= q.Val {\n            current.Next = p\n            p = p.Next\n        } else {\n            current.Next = q\n            q = q.Next\n        }\n        current = current.Next\n    }\n\n    if p != nil {\n        current.Next = p\n    } else {\n        current.Next = q\n    }\n\n    return dummy.Next\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        5,
        6
      ],
      "compare_nodes": [
        9
      ],
      "select_from_list1": [
        10
      ],
      "advance_p": [
        11
      ],
      "select_from_list2": [
        13
      ],
      "advance_q": [
        14
      ],
      "move_current": [
        16
      ],
      "check_remaining_list1": [
        19
      ],
      "attach_list1": [
        20
      ],
      "check_remaining_list2": [
        21
      ],
      "attach_list2": [
        22
      ],
      "return": [
        25
      ]
    },
    "conditionalMap": {
      "main_loop": [
        8
      ],
      "comparison": [
        9
      ],
      "remaining_list1": [
        19
      ],
      "remaining_list2": [
        21
      ]
    }
  }
};

const MergeTwoSortedListsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "list1": [
        1,
        2,
        4
      ],
      "list2": [
        1,
        3,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "list1": [],
      "list2": [
        0
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "list1": [
        1,
        3,
        5,
        7
      ],
      "list2": [
        2,
        4,
        6,
        8
      ]
    }
  }
];

function generateMergeTwoSortedListsSteps(e: any): any[] {
  class r{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function l(e){return null===e?null:`Node(${e.val})`}

let t=e.list1,n=e.list2,a=null,s=[];if(t.length>0){a=new r(t[0]),s.push(a);let e=a;for(let n=1;n<t.length;n++)e.next=new r(t[n]),e=e.next,s.push(e)}let o=null,u=[];if(n.length>0){o=new r(n[0]),u.push(o);let e=o;for(let t=1;t<n.length;t++)e.next=new r(n[t]),e=e.next,u.push(e)}let d={};t.forEach((e,t)=>{d[`list1_node_${t}`]={type:"arrayElement",value:e,position:t,row:0}});let p={};for(let e=0;e<t.length-1;e++)p[`list1_arrow_${e}`]={type:"range",start:e,end:e+1,row:0};n.forEach((e,t)=>{d[`list2_node_${t}`]={type:"arrayElement",value:e,position:t,row:1}});for(let e=0;e<n.length-1;e++)p[`list2_arrow_${e}`]={type:"range",start:e,end:e+1,row:1};let c=new StepRecorder({list1Values:t,list2Values:n},{...d,...p});c.record("-","Start of algorithm");let m=new r(0),_=[m];c.add_new_visual("result_node_-1",{type:"arrayElement",value:0,position:-1,row:2,state:"inactive"}),c.record("initialize","Create dummy head node");let h=a,x=o,g=m;null!==h?(c.add_new_visual("ptr_p",{type:"pointer",position:0,label:"p",row:0}),c.update_variable("p",l(h))):c.update_variable("p",null),null!==x?(c.add_new_visual("ptr_q",{type:"pointer",position:0,label:"q",row:1}),c.update_variable("q",l(x))):c.update_variable("q",null),c.add_new_visual("ptr_current",{type:"pointer",position:-1,label:"current",row:2}),c.update_variable("current",l(g)),c.record("initialize_pointers","Initialize p, q, and current pointers");let v=0;for(;null!==h&&null!==x;){c.add_conditional("main_loop",!0);let e=s.indexOf(h),t=u.indexOf(x),n=h.val<=x.val;if(c.update_visual(`list1_node_${e}`,{type:"arrayElement",value:h.val,position:e,row:0,state:n?"active":"inactive"}),c.update_visual(`list2_node_${t}`,{type:"arrayElement",value:x.val,position:t,row:1,state:n?"inactive":"active"}),c.record("compare_nodes",`Compare: p.val=${h.val} vs q.val=${x.val}`),h.val<=x.val){if(c.add_conditional("comparison",!0),g.next=h,_.push(h),c.add_new_visual(`result_node_${v}`,{type:"arrayElement",value:h.val,position:v,row:2,state:"sorted"}),c.add_new_visual(`result_arrow_${v-1}`,{type:"range",start:v-1,end:v,row:2}),c.record("select_from_list1",`Select ${h.val} from list1 (smaller)`),c.update_visual(`list1_node_${e}`,{type:"arrayElement",value:h.val,position:e,row:0,state:"inactive"}),c.update_visual(`list2_node_${t}`,{type:"arrayElement",value:x.val,position:t,row:1,state:"inactive"}),h=h.next,c.update_variable("p",l(h)),null!==h){let e=s.indexOf(h);c.update_visual("ptr_p",{type:"pointer",position:e,label:"p",row:0})}else c.delete_visual("ptr_p");c.record("advance_p","Move p to next node in list1")}else{if(c.add_conditional("comparison",!1),g.next=x,_.push(x),c.add_new_visual(`result_node_${v}`,{type:"arrayElement",value:x.val,position:v,row:2,state:"sorted"}),c.add_new_visual(`result_arrow_${v-1}`,{type:"range",start:v-1,end:v,row:2}),c.record("select_from_list2",`Select ${x.val} from list2 (smaller)`),c.update_visual(`list2_node_${t}`,{type:"arrayElement",value:x.val,position:t,row:1,state:"inactive"}),c.update_visual(`list1_node_${e}`,{type:"arrayElement",value:h.val,position:e,row:0,state:"inactive"}),x=x.next,c.update_variable("q",l(x)),null!==x){let e=u.indexOf(x);c.update_visual("ptr_q",{type:"pointer",position:e,label:"q",row:1})}else c.delete_visual("ptr_q");c.record("advance_q","Move q to next node in list2")}g=g.next,c.update_variable("current",l(g)),c.update_visual("ptr_current",{type:"pointer",position:v,label:"current",row:2}),c.record("move_current","Move current pointer forward"),v++}if(c.add_conditional("main_loop",!1),null!==h){c.add_conditional("remaining_list1",!0);let e=h;for(;null!==e;){let t=s.indexOf(e);c.update_visual(`list1_node_${t}`,{type:"arrayElement",value:e.val,position:t,row:0,state:"active"}),e=e.next}for(c.record("check_remaining_list1","List1 has remaining nodes"),g.next=h,e=h;null!==e;){_.push(e),c.add_new_visual(`result_node_${v}`,{type:"arrayElement",value:e.val,position:v,row:2,state:"sorted"}),c.add_new_visual(`result_arrow_${v-1}`,{type:"range",start:v-1,end:v,row:2});let t=s.indexOf(e);c.update_visual(`list1_node_${t}`,{type:"arrayElement",value:e.val,position:t,row:0,state:"inactive"}),e=e.next,v++}c.record("attach_list1","Attach remaining nodes from list1 to result")}else if(null!==x){c.add_conditional("remaining_list2",!0);let e=x;for(;null!==e;){let t=u.indexOf(e);c.update_visual(`list2_node_${t}`,{type:"arrayElement",value:e.val,position:t,row:1,state:"active"}),e=e.next}for(c.record("check_remaining_list2","List2 has remaining nodes"),g.next=x,e=x;null!==e;){_.push(e),c.add_new_visual(`result_node_${v}`,{type:"arrayElement",value:e.val,position:v,row:2,state:"sorted"}),c.add_new_visual(`result_arrow_${v-1}`,{type:"range",start:v-1,end:v,row:2});let t=u.indexOf(e);c.update_visual(`list2_node_${t}`,{type:"arrayElement",value:e.val,position:t,row:1,state:"inactive"}),e=e.next,v++}c.record("attach_list2","Attach remaining nodes from list2 to result")}if(_.length>1){let e=_[1];c.update_visual("result_node_0",{type:"arrayElement",value:e.val,position:0,row:2,state:"result"})}return c.delete_visual("ptr_current"),c.delete_visual("ptr_p"),c.delete_visual("ptr_q"),c.record("return","Return dummy.next"),c.getSteps()
}

export function MergeTwoSortedListsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MergeTwoSortedListsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMergeTwoSortedListsSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Merge Two Sorted Lists"
      slug="merge-two-sorted-lists"
      approaches={approaches}
      presets={MergeTwoSortedListsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Linked List Cycle II (linked-list-cycle-ii)
// ==========================================

const LinkedListCycleIiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        slow = head\n        fast = head\n\n        # Phase 1: Detect if a cycle exists\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n\n            if slow == fast:\n                # Phase 2: Find the cycle start\n                slow = head\n                while slow != fast:\n                    slow = slow.next\n                    fast = fast.next\n                return slow\n\n        # No cycle\n        return None",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4
      ],
      "move_pointers_phase1": [
        8,
        9
      ],
      "found_cycle": [
        11
      ],
      "no_cycle": [
        7
      ],
      "return_null": [
        20
      ],
      "phase2_start": [
        13
      ],
      "check_not_equal": [
        14
      ],
      "move_pointers_phase2": [
        15,
        16
      ],
      "found_entry": [
        17
      ],
      "return_entry": [
        17
      ]
    },
    "conditionalMap": {
      "while_fast": [
        7
      ],
      "pointers_meet": [
        11
      ],
      "while_not_equal": [
        14
      ],
      "found_entry": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public class Solution {\n    public ListNode detectCycle(ListNode head) {\n        ListNode slow = head;\n        ListNode fast = head;\n\n        // Phase 1: Detect if a cycle exists\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n\n            if (slow == fast) {\n                // Phase 2: Find the cycle start\n                slow = head;\n                while (slow != fast) {\n                    slow = slow.next;\n                    fast = fast.next;\n                }\n                return slow;\n            }\n        }\n\n        // No cycle\n        return null;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4
      ],
      "move_pointers_phase1": [
        8,
        9
      ],
      "found_cycle": [
        11
      ],
      "no_cycle": [
        7
      ],
      "return_null": [
        23
      ],
      "phase2_start": [
        13
      ],
      "check_not_equal": [
        14
      ],
      "move_pointers_phase2": [
        15,
        16
      ],
      "found_entry": [
        18
      ],
      "return_entry": [
        18
      ]
    },
    "conditionalMap": {
      "while_fast": [
        7
      ],
      "pointers_meet": [
        11
      ],
      "while_not_equal": [
        14
      ],
      "found_entry": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    ListNode *detectCycle(ListNode *head) {\n        ListNode* slow = head;\n        ListNode* fast = head;\n\n        // Phase 1: Detect if a cycle exists\n        while (fast != nullptr && fast->next != nullptr) {\n            slow = slow->next;\n            fast = fast->next->next;\n\n            if (slow == fast) {\n                // Phase 2: Find the cycle start\n                slow = head;\n                while (slow != fast) {\n                    slow = slow->next;\n                    fast = fast->next;\n                }\n                return slow;\n            }\n        }\n\n        // No cycle\n        return nullptr;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize": [
        4,
        5
      ],
      "move_pointers_phase1": [
        9,
        10
      ],
      "found_cycle": [
        12
      ],
      "no_cycle": [
        8
      ],
      "return_null": [
        24
      ],
      "phase2_start": [
        14
      ],
      "check_not_equal": [
        15
      ],
      "move_pointers_phase2": [
        16,
        17
      ],
      "found_entry": [
        19
      ],
      "return_entry": [
        19
      ]
    },
    "conditionalMap": {
      "while_fast": [
        8
      ],
      "pointers_meet": [
        12
      ],
      "while_not_equal": [
        15
      ],
      "found_entry": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public ListNode DetectCycle(ListNode head) {\n        ListNode slow = head;\n        ListNode fast = head;\n\n        // Phase 1: Detect if a cycle exists\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n\n            if (slow == fast) {\n                // Phase 2: Find the cycle start\n                slow = head;\n                while (slow != fast) {\n                    slow = slow.next;\n                    fast = fast.next;\n                }\n                return slow;\n            }\n        }\n\n        // No cycle\n        return null;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4
      ],
      "move_pointers_phase1": [
        8,
        9
      ],
      "found_cycle": [
        11
      ],
      "no_cycle": [
        7
      ],
      "return_null": [
        23
      ],
      "phase2_start": [
        13
      ],
      "check_not_equal": [
        14
      ],
      "move_pointers_phase2": [
        15,
        16
      ],
      "found_entry": [
        18
      ],
      "return_entry": [
        18
      ]
    },
    "conditionalMap": {
      "while_fast": [
        7
      ],
      "pointers_meet": [
        11
      ],
      "while_not_equal": [
        14
      ],
      "found_entry": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func detectCycle(head *ListNode) *ListNode {\n    slow := head\n    fast := head\n\n    // Phase 1: Detect if a cycle exists\n    for fast != nil && fast.Next != nil {\n        slow = slow.Next\n        fast = fast.Next.Next\n\n        if slow == fast {\n            // Phase 2: Find the cycle start\n            slow = head\n            for slow != fast {\n                slow = slow.Next\n                fast = fast.Next\n            }\n            return slow\n        }\n    }\n\n    // No cycle\n    return nil\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "move_pointers_phase1": [
        7,
        8
      ],
      "found_cycle": [
        10
      ],
      "no_cycle": [
        6
      ],
      "return_null": [
        22
      ],
      "phase2_start": [
        12
      ],
      "check_not_equal": [
        13
      ],
      "move_pointers_phase2": [
        14,
        15
      ],
      "found_entry": [
        17
      ],
      "return_entry": [
        17
      ]
    },
    "conditionalMap": {
      "while_fast": [
        6
      ],
      "pointers_meet": [
        10
      ],
      "while_not_equal": [
        13
      ],
      "found_entry": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var detectCycle = function(head) {\n    var slow = head;\n    var fast = head;\n\n    // Phase 1: Detect if a cycle exists\n    while (fast !== null && fast.next !== null) {\n        slow = slow.next;\n        fast = fast.next.next;\n\n        if (slow === fast) {\n            // Phase 2: Find the cycle start\n            slow = head;\n            while (slow !== fast) {\n                slow = slow.next;\n                fast = fast.next;\n            }\n            return slow;\n        }\n    }\n\n    // No cycle\n    return null;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "move_pointers_phase1": [
        7,
        8
      ],
      "found_cycle": [
        10
      ],
      "no_cycle": [
        6
      ],
      "return_null": [
        22
      ],
      "phase2_start": [
        12
      ],
      "check_not_equal": [
        13
      ],
      "move_pointers_phase2": [
        14,
        15
      ],
      "found_entry": [
        17
      ],
      "return_entry": [
        17
      ]
    },
    "conditionalMap": {
      "while_fast": [
        6
      ],
      "pointers_meet": [
        10
      ],
      "while_not_equal": [
        13
      ],
      "found_entry": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function detectCycle(head: ListNode | null): ListNode | null {\n    let slow = head;\n    let fast = head;\n\n    // Phase 1: Detect if a cycle exists\n    while (fast !== null && fast.next !== null) {\n        slow = slow.next!;\n        fast = fast.next.next;\n\n        if (slow === fast) {\n            // Phase 2: Find the cycle start\n            slow = head;\n            while (slow !== fast) {\n                slow = slow!.next;\n                fast = fast!.next;\n            }\n            return slow;\n        }\n    }\n\n    // No cycle\n    return null;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "move_pointers_phase1": [
        7,
        8
      ],
      "found_cycle": [
        10
      ],
      "no_cycle": [
        6
      ],
      "return_null": [
        22
      ],
      "phase2_start": [
        12
      ],
      "check_not_equal": [
        13
      ],
      "move_pointers_phase2": [
        14,
        15
      ],
      "found_entry": [
        17
      ],
      "return_entry": [
        17
      ]
    },
    "conditionalMap": {
      "while_fast": [
        6
      ],
      "pointers_meet": [
        10
      ],
      "while_not_equal": [
        13
      ],
      "found_entry": [
        17
      ]
    }
  }
};

const LinkedListCycleIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Cycle at pos 2",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "cyclePos": 2
    }
  },
  {
    "id": "ex2",
    "label": "Cycle at pos 0",
    "value": {
      "values": [
        1,
        2
      ],
      "cyclePos": 0
    }
  },
  {
    "id": "ex3",
    "label": "No cycle",
    "value": {
      "values": [
        1,
        2,
        3,
        4
      ],
      "cyclePos": -1
    }
  }
];

function generateLinkedListCycleIiSteps(e: any): any[] {
  class s{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function a(e){return null===e?null:`Node(${e.val})`}

let t=e.values,n=e.cyclePos,r=null,o=[];if(t.length>0){r=new s(t[0]),o.push(r);let e=r;for(let n=1;n<t.length;n++)e.next=new s(t[n]),e=e.next,o.push(e);n>=0&&n<t.length&&(e.next=o[n])}let i={};t.forEach((e,t)=>{i[`node_${t}`]={type:"arrayElement",value:e,position:t}});let c={};for(let e=0;e<t.length-1;e++)c[`arrow_${e}`]={type:"range",start:e,end:e+1};n>=0&&(c.arrow_cycle={type:"range",start:t.length-1,end:n,label:"cycle"});let u={};u.ptr_head={type:"pointer",position:0,label:"head"};let d=new StepRecorder({values:t,head:a(r),slow:void 0,fast:void 0},{...i,...c,...u});d.record("-",n>=0?`Start: Linked list with cycle at position ${n}`:"Start: Linked list with no cycle");let p=r,h=r;d.update_variable("slow",a(p)),d.update_variable("fast",a(h)),d.add_new_visual("ptr_slow",{type:"pointer",position:0,label:"slow"}),d.add_new_visual("ptr_fast",{type:"pointer",position:0,label:"fast"}),d.record("initialize","Initialize slow and fast pointers at head");let _=0,f=0,y=!1;for(;null!==h&&null!==h.next;){if(d.add_conditional("while_fast",!0),p=p.next,h=h.next.next,_=o.indexOf(p),f=null!==h?o.indexOf(h):f,d.update_variable("slow",a(p)),d.update_variable("fast",a(h)),d.update_visual("ptr_slow",{type:"pointer",position:_,label:"slow"}),null!==h?d.update_visual("ptr_fast",{type:"pointer",position:f,label:"fast"}):d.delete_visual("ptr_fast"),d.record("move_pointers_phase1","Move slow by 1, fast by 2"),p===h){y=!0,d.add_conditional("pointers_meet",!0),d.record("found_cycle","Slow and fast meet - cycle detected!");break}d.add_conditional("pointers_meet",!1)}if(!y)return d.add_conditional("while_fast",!1),d.record("no_cycle","Fast reached end - no cycle exists"),d.delete_visual("ptr_fast"),d.record("return_null","Return null - no cycle"),d.getSteps();for(d.update_visual("ptr_slow",{type:"pointer",position:0,label:"slow",state:"entering"}),d.record("phase2_start","Phase 2: Find cycle entry point. Reset slow to head"),p=r,_=0,d.update_variable("slow",a(p));p!==h;)d.add_conditional("while_not_equal",!0),d.record("check_not_equal","Check if slow != fast"),p=p.next,h=h.next,_=o.indexOf(p),f=o.indexOf(h),d.update_variable("slow",a(p)),d.update_variable("fast",a(h)),d.update_visual("ptr_slow",{type:"pointer",position:_,label:"slow"}),d.update_visual("ptr_fast",{type:"pointer",position:f,label:"fast"}),d.record("move_pointers_phase2","Move both slow and fast by 1");return d.add_conditional("while_not_equal",!1),d.add_conditional("found_entry",!0),d.update_visual(`node_${_}`,{type:"arrayElement",value:o[_].val,position:_,label:"slow",state:"result"}),d.record("return_entry",`Return entry node (position ${_})`),d.getSteps()
}

export function LinkedListCycleIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LinkedListCycleIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLinkedListCycleIiSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Linked List Cycle II"
      slug="linked-list-cycle-ii"
      approaches={approaches}
      presets={LinkedListCycleIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Swap Nodes in Pairs (swap-nodes-in-pairs)
// ==========================================

const SwapNodesInPairsTemplates = {
  "python": {
    "language": "python",
    "code": "def swapPairs(head):\n    # Dummy node simplifies head pointer management\n    dummy = ListNode(0, head)\n    prev = dummy\n\n    while prev.next and prev.next.next:\n        first = prev.next\n        second = prev.next.next\n\n        # Rewire the three pointers\n        prev.next = second\n        first.next = second.next\n        second.next = first\n\n        # Advance prev to the end of the swapped pair\n        prev = first\n\n    return dummy.next",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "first_second": [
        7,
        8
      ],
      "prev_to_second": [
        11
      ],
      "first_to_second_next": [
        12
      ],
      "swap_positions": [
        11,
        12,
        13
      ],
      "second_to_first": [
        13
      ],
      "move_prev": [
        16
      ],
      "return": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_pair_exists": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode swapPairs(ListNode head) {\n    // Dummy node simplifies head pointer management\n    ListNode dummy = new ListNode(0, head);\n    ListNode prev = dummy;\n\n    while (prev.next != null && prev.next.next != null) {\n        ListNode first = prev.next;\n        ListNode second = prev.next.next;\n\n        // Rewire the three pointers\n        prev.next = second;\n        first.next = second.next;\n        second.next = first;\n\n        // Advance prev to the end of the swapped pair\n        prev = first;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "first_second": [
        7,
        8
      ],
      "prev_to_second": [
        11
      ],
      "first_to_second_next": [
        12
      ],
      "swap_positions": [
        11,
        12,
        13
      ],
      "second_to_first": [
        13
      ],
      "move_prev": [
        16
      ],
      "return": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_pair_exists": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* swapPairs(ListNode* head) {\n    // Dummy node simplifies head pointer management\n    ListNode dummy(0, head);\n    ListNode* prev = &dummy;\n\n    while (prev->next && prev->next->next) {\n        ListNode* first = prev->next;\n        ListNode* second = prev->next->next;\n\n        // Rewire the three pointers\n        prev->next = second;\n        first->next = second->next;\n        second->next = first;\n\n        // Advance prev to the end of the swapped pair\n        prev = first;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "first_second": [
        7,
        8
      ],
      "prev_to_second": [
        11
      ],
      "first_to_second_next": [
        12
      ],
      "swap_positions": [
        11,
        12,
        13
      ],
      "second_to_first": [
        13
      ],
      "move_prev": [
        16
      ],
      "return": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_pair_exists": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode SwapPairs(ListNode head) {\n    // Dummy node simplifies head pointer management\n    ListNode dummy = new ListNode(0, head);\n    ListNode prev = dummy;\n\n    while (prev.next != null && prev.next.next != null) {\n        ListNode first = prev.next;\n        ListNode second = prev.next.next;\n\n        // Rewire the three pointers\n        prev.next = second;\n        first.next = second.next;\n        second.next = first;\n\n        // Advance prev to the end of the swapped pair\n        prev = first;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "first_second": [
        7,
        8
      ],
      "prev_to_second": [
        11
      ],
      "first_to_second_next": [
        12
      ],
      "swap_positions": [
        11,
        12,
        13
      ],
      "second_to_first": [
        13
      ],
      "move_prev": [
        16
      ],
      "return": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_pair_exists": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func swapPairs(head *ListNode) *ListNode {\n    // Dummy node simplifies head pointer management\n    dummy := &ListNode{Val: 0, Next: head}\n    prev := dummy\n\n    for prev.Next != nil && prev.Next.Next != nil {\n        first := prev.Next\n        second := prev.Next.Next\n\n        // Rewire the three pointers\n        prev.Next = second\n        first.Next = second.Next\n        second.Next = first\n\n        // Advance prev to the end of the swapped pair\n        prev = first\n    }\n\n    return dummy.Next\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "first_second": [
        7,
        8
      ],
      "prev_to_second": [
        11
      ],
      "first_to_second_next": [
        12
      ],
      "swap_positions": [
        11,
        12,
        13
      ],
      "second_to_first": [
        13
      ],
      "move_prev": [
        16
      ],
      "return": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_pair_exists": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function swapPairs(head) {\n    // Dummy node simplifies head pointer management\n    var dummy = new ListNode(0, head);\n    var prev = dummy;\n\n    while (prev.next && prev.next.next) {\n        var first = prev.next;\n        var second = prev.next.next;\n\n        // Rewire the three pointers\n        prev.next = second;\n        first.next = second.next;\n        second.next = first;\n\n        // Advance prev to the end of the swapped pair\n        prev = first;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "first_second": [
        7,
        8
      ],
      "prev_to_second": [
        11
      ],
      "first_to_second_next": [
        12
      ],
      "swap_positions": [
        11,
        12,
        13
      ],
      "second_to_first": [
        13
      ],
      "move_prev": [
        16
      ],
      "return": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_pair_exists": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function swapPairs(head: ListNode | null): ListNode | null {\n    // Dummy node simplifies head pointer management\n    const dummy: ListNode = new ListNode(0, head);\n    let prev: ListNode = dummy;\n\n    while (prev.next && prev.next.next) {\n        const first: ListNode = prev.next;\n        const second: ListNode = prev.next.next;\n\n        // Rewire the three pointers\n        prev.next = second;\n        first.next = second.next;\n        second.next = first;\n\n        // Advance prev to the end of the swapped pair\n        prev = first;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "first_second": [
        7,
        8
      ],
      "prev_to_second": [
        11
      ],
      "first_to_second_next": [
        12
      ],
      "swap_positions": [
        11,
        12,
        13
      ],
      "second_to_first": [
        13
      ],
      "move_prev": [
        16
      ],
      "return": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_pair_exists": [
        6
      ]
    }
  }
};

const SwapNodesInPairsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Even length",
    "value": {
      "values": [
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Odd length",
    "value": {
      "values": [
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
    "label": "Single node",
    "value": {
      "values": [
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Empty list",
    "value": {
      "values": []
    }
  },
  {
    "id": "ex5",
    "label": "Three pairs",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5,
        6
      ]
    }
  }
];

function generateSwapNodesInPairsSteps(e: any): any[] {
  class r{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function a(e){return null===e?null:`Node(${e.val})`}

let t=e.values,s=null;if(t.length>0){let e=s=new r(t[0]);for(let s=1;s<t.length;s++)e.next=new r(t[s]),e=e.next}let i=[];if(t.length>0){s=new r(t[0]),i.push(s);let e=s;for(let s=1;s<t.length;s++)e.next=new r(t[s]),e=e.next,i.push(e)}let o={};t.forEach((e,t)=>{o[`node_${t}`]={type:"arrayElement",value:e,position:t}});let d={};for(let e=0;e<t.length-1;e++)d[`arrow_${e}`]={type:"range",start:e,end:e+1};let l=new StepRecorder({values:t,head:a(s)},{...o,...d});l.record("-","Start of algorithm");let p=new Map;for(let e=-1;e<t.length;e++)p.set(e,e);let u=new r(0);u.next=s;let c=u;for(l.add_new_visual("node_-1",{type:"arrayElement",value:0,position:-1}),null!==s&&l.add_new_visual("arrow_-1",{type:"range",start:-1,end:0}),l.update_variable("dummy",a(u)),l.update_variable("prev",a(u)),l.add_new_visual("ptr_dummy",{type:"pointer",position:-1,label:"dummy"}),l.add_new_visual("ptr_prev",{type:"pointer",position:-1,label:"prev"}),l.record("initialize","Create dummy node and set prev = dummy");null!==c.next&&null!==c.next.next;){let e=c.next,t=e.next,s=i.indexOf(c),n=i.indexOf(e),r=i.indexOf(t);l.update_variable("first",a(e)),l.update_variable("second",a(t)),l.add_new_visual("ptr_first",{type:"pointer",position:p.get(n),label:"first"}),l.add_new_visual("ptr_second",{type:"pointer",position:p.get(r),label:"second"}),l.record("first_second","first and second pointers set"),t&&(c.next=t),l.update_visual(`arrow_${s}`,{type:"range",start:p.get(s),end:p.get(r)}),l.update_variable("prev",a(c)),l.record("prev_to_second","Step 1: prev.next = second"),t&&(e.next=t.next);let o=null!==t.next?i.indexOf(t.next):n;null!==t.next?l.update_visual(`arrow_${n}`,{type:"range",start:p.get(n),end:p.get(o)}):l.delete_visual(`arrow_${n}`),l.record("first_to_second_next","Step 2: first.next = second.next"),l.update_visual(`arrow_${r}`,{type:"range",start:p.get(r),end:p.get(n)}),l.record("second_to_first","Step 2: second.next = first"),c=e,l.update_variable("prev",a(e)),l.update_visual("ptr_prev",{type:"pointer",position:p.get(n),label:"prev"}),l.record("move_prev","Move prev = first (prepare for next pair)"),l.add_conditional("while_pair_exists",null!==c.next&&null!==c.next.next)}l.delete_visual("ptr_first"),l.delete_visual("ptr_second"),l.delete_visual("ptr_prev"),l.add_conditional("while_pair_exists",!1);let h=u.next;if(null!==h){let e=i.indexOf(h);l.update_visual(`node_${e}`,{type:"arrayElement",value:h.val,position:e,state:"result"})}l.record("complete","All pairs swapped");let f=t.length,_=[];for(let e=0;e+1<f;e+=2)_.push(e+1,e);f%2==1&&_.push(f-1),_.forEach((e,s)=>{l.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:s,state:0===s?"result":"default"})}),f>=1&&l.update_visual("arrow_-1",{type:"range",start:-1,end:0});for(let e=0;e<f;e++)l.delete_visual(`arrow_${e}`);for(let e=0;e<f-1;e++)l.add_new_visual(`arrow_final_${e}`,{type:"range",start:e,end:e+1});return l.record("return","Lay the swapped list out left to right and return the new head"),l.getSteps()
}

export function SwapNodesInPairsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SwapNodesInPairsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSwapNodesInPairsSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Swap Nodes in Pairs"
      slug="swap-nodes-in-pairs"
      approaches={approaches}
      presets={SwapNodesInPairsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Partition List (partition-list)
// ==========================================

const PartitionListTemplates = {
  "python": {
    "language": "python",
    "code": "def partition(head, x):\n    # Two dummy heads for the less and greater chains\n    less_head = ListNode(0)\n    greater_head = ListNode(0)\n    less_tail = less_head\n    greater_tail = greater_head\n\n    # Distribute nodes into the two chains\n    current = head\n    while current:\n        if current.val < x:\n            less_tail.next = current\n            less_tail = less_tail.next\n        else:\n            greater_tail.next = current\n            greater_tail = greater_tail.next\n        current = current.next\n\n    # Connect the less chain to the greater chain\n    less_tail.next = greater_head.next\n    # Terminate the greater chain to prevent cycles\n    greater_tail.next = None\n\n    return less_head.next",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "check_node": [
        10
      ],
      "append_less": [
        12,
        13
      ],
      "append_greater": [
        15,
        16
      ],
      "break_cycle": [
        22
      ],
      "connect_lists": [
        20
      ],
      "return": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_head": [
        10
      ],
      "less_than_x": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode partition(ListNode head, int x) {\n    // Two dummy heads for the less and greater chains\n    ListNode lessHead = new ListNode(0);\n    ListNode greaterHead = new ListNode(0);\n    ListNode lessTail = lessHead;\n    ListNode greaterTail = greaterHead;\n\n    // Distribute nodes into the two chains\n    ListNode current = head;\n    while (current != null) {\n        if (current.val < x) {\n            lessTail.next = current;\n            lessTail = lessTail.next;\n        } else {\n            greaterTail.next = current;\n            greaterTail = greaterTail.next;\n        }\n        current = current.next;\n    }\n\n    // Connect the less chain to the greater chain\n    lessTail.next = greaterHead.next;\n    // Terminate the greater chain to prevent cycles\n    greaterTail.next = null;\n\n    return lessHead.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "check_node": [
        10
      ],
      "append_less": [
        12,
        13
      ],
      "append_greater": [
        15,
        16
      ],
      "break_cycle": [
        24
      ],
      "connect_lists": [
        22
      ],
      "return": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_head": [
        10
      ],
      "less_than_x": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* partition(ListNode* head, int x) {\n    // Two dummy heads for the less and greater chains\n    ListNode lessHead(0), greaterHead(0);\n    ListNode* lessTail = &lessHead;\n    ListNode* greaterTail = &greaterHead;\n\n    // Distribute nodes into the two chains\n    ListNode* current = head;\n    while (current != nullptr) {\n        if (current->val < x) {\n            lessTail->next = current;\n            lessTail = lessTail->next;\n        } else {\n            greaterTail->next = current;\n            greaterTail = greaterTail->next;\n        }\n        current = current->next;\n    }\n\n    // Connect the less chain to the greater chain\n    lessTail->next = greaterHead.next;\n    // Terminate the greater chain to prevent cycles\n    greaterTail->next = nullptr;\n\n    return lessHead.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "check_node": [
        9
      ],
      "append_less": [
        11,
        12
      ],
      "append_greater": [
        14,
        15
      ],
      "break_cycle": [
        23
      ],
      "connect_lists": [
        21
      ],
      "return": [
        25
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "while_head": [
        9
      ],
      "less_than_x": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode Partition(ListNode head, int x) {\n    // Two dummy heads for the less and greater chains\n    ListNode lessHead = new ListNode(0);\n    ListNode greaterHead = new ListNode(0);\n    ListNode lessTail = lessHead;\n    ListNode greaterTail = greaterHead;\n\n    // Distribute nodes into the two chains\n    ListNode current = head;\n    while (current != null) {\n        if (current.val < x) {\n            lessTail.next = current;\n            lessTail = lessTail.next;\n        } else {\n            greaterTail.next = current;\n            greaterTail = greaterTail.next;\n        }\n        current = current.next;\n    }\n\n    // Connect the less chain to the greater chain\n    lessTail.next = greaterHead.next;\n    // Terminate the greater chain to prevent cycles\n    greaterTail.next = null;\n\n    return lessHead.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "check_node": [
        10
      ],
      "append_less": [
        12,
        13
      ],
      "append_greater": [
        15,
        16
      ],
      "break_cycle": [
        24
      ],
      "connect_lists": [
        22
      ],
      "return": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_head": [
        10
      ],
      "less_than_x": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func partition(head *ListNode, x int) *ListNode {\n    // Two dummy heads for the less and greater chains\n    lessHead := &ListNode{}\n    greaterHead := &ListNode{}\n    lessTail := lessHead\n    greaterTail := greaterHead\n\n    // Distribute nodes into the two chains\n    current := head\n    for current != nil {\n        if current.Val < x {\n            lessTail.Next = current\n            lessTail = lessTail.Next\n        } else {\n            greaterTail.Next = current\n            greaterTail = greaterTail.Next\n        }\n        current = current.Next\n    }\n\n    // Connect the less chain to the greater chain\n    lessTail.Next = greaterHead.Next\n    // Terminate the greater chain to prevent cycles\n    greaterTail.Next = nil\n\n    return lessHead.Next\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "check_node": [
        10
      ],
      "append_less": [
        12,
        13
      ],
      "append_greater": [
        15,
        16
      ],
      "break_cycle": [
        24
      ],
      "connect_lists": [
        22
      ],
      "return": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_head": [
        10
      ],
      "less_than_x": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function partition(head, x) {\n    // Two dummy heads for the less and greater chains\n    var lessHead = new ListNode(0);\n    var greaterHead = new ListNode(0);\n    var lessTail = lessHead;\n    var greaterTail = greaterHead;\n\n    // Distribute nodes into the two chains\n    var current = head;\n    while (current !== null) {\n        if (current.val < x) {\n            lessTail.next = current;\n            lessTail = lessTail.next;\n        } else {\n            greaterTail.next = current;\n            greaterTail = greaterTail.next;\n        }\n        current = current.next;\n    }\n\n    // Connect the less chain to the greater chain\n    lessTail.next = greaterHead.next;\n    // Terminate the greater chain to prevent cycles\n    greaterTail.next = null;\n\n    return lessHead.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "check_node": [
        10
      ],
      "append_less": [
        12,
        13
      ],
      "append_greater": [
        15,
        16
      ],
      "break_cycle": [
        24
      ],
      "connect_lists": [
        22
      ],
      "return": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_head": [
        10
      ],
      "less_than_x": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function partition(head: ListNode | null, x: number): ListNode | null {\n    // Two dummy heads for the less and greater chains\n    const lessHead = new ListNode(0);\n    const greaterHead = new ListNode(0);\n    let lessTail = lessHead;\n    let greaterTail = greaterHead;\n\n    // Distribute nodes into the two chains\n    let current = head;\n    while (current !== null) {\n        if (current.val < x) {\n            lessTail.next = current;\n            lessTail = lessTail.next;\n        } else {\n            greaterTail.next = current;\n            greaterTail = greaterTail.next;\n        }\n        current = current.next;\n    }\n\n    // Connect the less chain to the greater chain\n    lessTail.next = greaterHead.next;\n    // Terminate the greater chain to prevent cycles\n    greaterTail.next = null;\n\n    return lessHead.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "check_node": [
        10
      ],
      "append_less": [
        12,
        13
      ],
      "append_greater": [
        15,
        16
      ],
      "break_cycle": [
        24
      ],
      "connect_lists": [
        22
      ],
      "return": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_head": [
        10
      ],
      "less_than_x": [
        11
      ]
    }
  }
};

const PartitionListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "values": [
        1,
        4,
        3,
        2,
        5,
        2
      ],
      "x": 3
    }
  },
  {
    "id": "ex2",
    "label": "Already partitioned",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "x": 3
    }
  },
  {
    "id": "ex3",
    "label": "Reverse order",
    "value": {
      "values": [
        5,
        4,
        3,
        2,
        1
      ],
      "x": 3
    }
  }
];

function generatePartitionListSteps(e: any): any[] {
  class n{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function l(e){return null===e?null:`Node(${e.val})`}

let t=e.values,a=e.x,i=null,s=[];if(t.length>0){i=new n(t[0]),s.push(i);let e=i;for(let a=1;a<t.length;a++)e.next=new n(t[a]),e=e.next,s.push(e)}let o={};t.forEach((e,t)=>{o[`node_${t}`]={type:"arrayElement",value:e,position:t}});let d={};for(let e=0;e<t.length-1;e++)d[`arrow_${e}`]={type:"range",start:e,end:e+1};let u=new StepRecorder({values:t,x:a,head:l(i)},{...o,...d});u.record("-","Start of algorithm");let c=new n(0),p=new n(0),h=c,g=p;u.add_new_visual("node_lessHead",{type:"arrayElement",value:0,position:-2,state:"inactive"}),u.add_new_visual("node_greaterHead",{type:"arrayElement",value:0,position:-1,state:"inactive"}),u.update_variable("lessHead",l(c)),u.update_variable("greaterHead",l(p)),u.update_variable("less",l(h)),u.update_variable("greater",l(g)),u.add_new_visual("ptr_lessHead",{type:"pointer",position:-2,label:"lessHead"}),u.add_new_visual("ptr_less",{type:"pointer",position:-2,label:"less"}),u.add_new_visual("ptr_greaterHead",{type:"pointer",position:-1,label:"greaterHead"}),u.add_new_visual("ptr_greater",{type:"pointer",position:-1,label:"greater"}),u.record("initialize","Initialize two dummy nodes for less and greater partitions"),null!==i&&u.add_new_visual("ptr_head",{type:"pointer",position:0,label:"head"});let _=i,x=0;for(;null!==_;){u.add_conditional("while_head",!0);let e=s.indexOf(_);if(u.update_visual(`node_${e}`,{type:"arrayElement",value:_.val,position:e,state:"active"}),u.record("check_node",`Check if ${_.val} < ${a}`),_.val<a){u.add_conditional("less_than_x",!0),h.next=_,s.indexOf(h);let t=s.indexOf(_);if(h!==c){let e=s.indexOf(h);u.delete_visual(`arrow_${e}`),u.add_new_visual(`arrow_less_${e}`,{type:"range",start:e,end:t,color:"blue"})}else u.add_new_visual(`arrow_lessHead_${t}`,{type:"range",start:-2,end:t,color:"blue"});u.update_visual(`node_${e}`,{type:"arrayElement",value:_.val,position:e,state:"sorted"}),h=h.next,u.update_variable("less",l(h)),u.update_visual("ptr_less",{type:"pointer",position:e,label:"less"}),u.record("append_less",`Append ${_.val} to less list`)}else{u.add_conditional("less_than_x",!1),g.next=_,s.indexOf(g);let t=s.indexOf(_);if(g!==p){let e=s.indexOf(g);u.delete_visual(`arrow_${e}`),u.add_new_visual(`arrow_greater_${e}`,{type:"range",start:e,end:t,color:"red"})}else u.add_new_visual(`arrow_greaterHead_${t}`,{type:"range",start:-1,end:t,color:"red"});u.update_visual(`node_${e}`,{type:"arrayElement",value:_.val,position:e,state:"comparing"}),g=g.next,u.update_variable("greater",l(g)),u.update_visual("ptr_greater",{type:"pointer",position:e,label:"greater"}),u.record("append_greater",`Append ${_.val} to greater list`)}_=_.next,x++,null!==_?u.update_visual("ptr_head",{type:"pointer",position:x,label:"head"}):u.delete_visual("ptr_head")}if(u.add_conditional("while_head",!1),g.next=null,u.record("break_cycle","Set greater.next = null to avoid cycles"),h.next=p.next,null!==p.next){let e=s.indexOf(p.next),t=s.indexOf(h);u.add_new_visual("arrow_connect",{type:"range",start:t,end:e,color:"green"})}if(u.record("connect_lists","Connect less list to greater list"),u.delete_visual("ptr_less"),u.delete_visual("ptr_greater"),u.delete_visual("ptr_lessHead"),u.delete_visual("ptr_greaterHead"),null!==c.next){let e=s.indexOf(c.next);u.add_new_visual("ptr_newHead",{type:"pointer",position:e,label:"lessHead.next"}),u.update_visual(`node_${e}`,{type:"arrayElement",value:c.next.val,position:e,state:"result"})}u.record("return","Return lessHead.next as the new head");let v=t.length,m=[];for(let e=0;e<v;e++)t[e]<a&&m.push(e);for(let e=0;e<v;e++)t[e]>=a&&m.push(e);m.forEach((e,r)=>{u.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:r-1,state:t[e]<a?"sorted":"comparing"})}),u.delete_visual("node_lessHead"),u.delete_visual("node_greaterHead"),u.delete_visual("ptr_newHead"),u.delete_visual("ptr_head"),u.delete_visual("arrow_connect");for(let e=0;e<v;e++)u.delete_visual(`arrow_${e}`),u.delete_visual(`arrow_less_${e}`),u.delete_visual(`arrow_greater_${e}`),u.delete_visual(`arrow_lessHead_${e}`),u.delete_visual(`arrow_greaterHead_${e}`);for(let e=0;e<v-1;e++)u.add_new_visual(`arrow_linear_${e}`,{type:"range",start:e-1,end:e});return u.record("complete","Lay the partitioned list out left to right"),u.getSteps()
}

export function PartitionListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PartitionListTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePartitionListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Partition List"
      slug="partition-list"
      approaches={approaches}
      presets={PartitionListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Rotate List (rotate-list)
// ==========================================

const RotateListTemplates = {
  "python": {
    "language": "python",
    "code": "def rotateRight(head, k):\n    if not head or not head.next or k == 0:\n        return head\n\n    # Find the length and the tail\n    n = 1\n    tail = head\n    while tail.next:\n        n += 1\n        tail = tail.next\n\n    # Compute effective rotation\n    k = k % n\n    if k == 0:\n        return head\n\n    # Form a circular list\n    tail.next = head\n\n    # Walk to the new tail: (n - k - 1) steps from head\n    new_tail = head\n    for _ in range(n - k - 1):\n        new_tail = new_tail.next\n\n    # Break the circle\n    new_head = new_tail.next\n    new_tail.next = None\n\n    return new_head",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_length": [
        6,
        7
      ],
      "calculate_length_loop": [
        9,
        10
      ],
      "make_circular": [
        18
      ],
      "adjust_k": [
        13
      ],
      "initialize_new_tail": [
        21
      ],
      "find_new_tail_loop": [
        23
      ],
      "set_new_head": [
        26
      ],
      "break_circle": [
        27
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "null_check": [
        2
      ],
      "while_counting": [
        8
      ],
      "while_finding_tail": [
        22
      ],
      "k_is_zero": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode rotateRight(ListNode head, int k) {\n    if (head == null || head.next == null || k == 0) return head;\n\n    // Find the length and the tail\n    int n = 1;\n    ListNode tail = head;\n    while (tail.next != null) {\n        n++;\n        tail = tail.next;\n    }\n\n    // Compute effective rotation\n    k = k % n;\n    if (k == 0) return head;\n\n    // Form a circular list\n    tail.next = head;\n\n    // Walk to the new tail: (n - k - 1) steps from head\n    ListNode newTail = head;\n    for (int i = 0; i < n - k - 1; i++) {\n        newTail = newTail.next;\n    }\n\n    // Break the circle\n    ListNode newHead = newTail.next;\n    newTail.next = null;\n\n    return newHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_length": [
        5,
        6
      ],
      "calculate_length_loop": [
        8,
        9
      ],
      "make_circular": [
        17
      ],
      "adjust_k": [
        13
      ],
      "initialize_new_tail": [
        20
      ],
      "find_new_tail_loop": [
        22
      ],
      "set_new_head": [
        26
      ],
      "break_circle": [
        27
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "null_check": [
        2
      ],
      "while_counting": [
        7
      ],
      "while_finding_tail": [
        21
      ],
      "k_is_zero": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* rotateRight(ListNode* head, int k) {\n    if (!head || !head->next || k == 0) return head;\n\n    // Find the length and the tail\n    int n = 1;\n    ListNode* tail = head;\n    while (tail->next) {\n        n++;\n        tail = tail->next;\n    }\n\n    // Compute effective rotation\n    k = k % n;\n    if (k == 0) return head;\n\n    // Form a circular list\n    tail->next = head;\n\n    // Walk to the new tail: (n - k - 1) steps from head\n    ListNode* newTail = head;\n    for (int i = 0; i < n - k - 1; i++) {\n        newTail = newTail->next;\n    }\n\n    // Break the circle\n    ListNode* newHead = newTail->next;\n    newTail->next = nullptr;\n\n    return newHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_length": [
        5,
        6
      ],
      "calculate_length_loop": [
        8,
        9
      ],
      "make_circular": [
        17
      ],
      "adjust_k": [
        13
      ],
      "initialize_new_tail": [
        20
      ],
      "find_new_tail_loop": [
        22
      ],
      "set_new_head": [
        26
      ],
      "break_circle": [
        27
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "null_check": [
        2
      ],
      "while_counting": [
        7
      ],
      "while_finding_tail": [
        21
      ],
      "k_is_zero": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode RotateRight(ListNode head, int k) {\n    if (head == null || head.next == null || k == 0) return head;\n\n    // Find the length and the tail\n    int n = 1;\n    ListNode tail = head;\n    while (tail.next != null) {\n        n++;\n        tail = tail.next;\n    }\n\n    // Compute effective rotation\n    k = k % n;\n    if (k == 0) return head;\n\n    // Form a circular list\n    tail.next = head;\n\n    // Walk to the new tail: (n - k - 1) steps from head\n    ListNode newTail = head;\n    for (int i = 0; i < n - k - 1; i++) {\n        newTail = newTail.next;\n    }\n\n    // Break the circle\n    ListNode newHead = newTail.next;\n    newTail.next = null;\n\n    return newHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_length": [
        5,
        6
      ],
      "calculate_length_loop": [
        8,
        9
      ],
      "make_circular": [
        17
      ],
      "adjust_k": [
        13
      ],
      "initialize_new_tail": [
        20
      ],
      "find_new_tail_loop": [
        22
      ],
      "set_new_head": [
        26
      ],
      "break_circle": [
        27
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "null_check": [
        2
      ],
      "while_counting": [
        7
      ],
      "while_finding_tail": [
        21
      ],
      "k_is_zero": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rotateRight(head *ListNode, k int) *ListNode {\n    if head == nil || head.Next == nil || k == 0 {\n        return head\n    }\n\n    // Find the length and the tail\n    n := 1\n    tail := head\n    for tail.Next != nil {\n        n++\n        tail = tail.Next\n    }\n\n    // Compute effective rotation\n    k = k % n\n    if k == 0 {\n        return head\n    }\n\n    // Form a circular list\n    tail.Next = head\n\n    // Walk to the new tail: (n - k - 1) steps from head\n    newTail := head\n    for i := 0; i < n-k-1; i++ {\n        newTail = newTail.Next\n    }\n\n    // Break the circle\n    newHead := newTail.Next\n    newTail.Next = nil\n\n    return newHead\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_length": [
        7,
        8
      ],
      "calculate_length_loop": [
        10,
        11
      ],
      "make_circular": [
        21
      ],
      "adjust_k": [
        15
      ],
      "initialize_new_tail": [
        24
      ],
      "find_new_tail_loop": [
        26
      ],
      "set_new_head": [
        30
      ],
      "break_circle": [
        31
      ],
      "return": [
        33
      ]
    },
    "conditionalMap": {
      "null_check": [
        2
      ],
      "while_counting": [
        9
      ],
      "while_finding_tail": [
        25
      ],
      "k_is_zero": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function rotateRight(head, k) {\n    if (!head || !head.next || k === 0) return head;\n\n    // Find the length and the tail\n    var n = 1;\n    var tail = head;\n    while (tail.next) {\n        n++;\n        tail = tail.next;\n    }\n\n    // Compute effective rotation\n    k = k % n;\n    if (k === 0) return head;\n\n    // Form a circular list\n    tail.next = head;\n\n    // Walk to the new tail: (n - k - 1) steps from head\n    var newTail = head;\n    for (var i = 0; i < n - k - 1; i++) {\n        newTail = newTail.next;\n    }\n\n    // Break the circle\n    var newHead = newTail.next;\n    newTail.next = null;\n\n    return newHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_length": [
        5,
        6
      ],
      "calculate_length_loop": [
        8,
        9
      ],
      "make_circular": [
        17
      ],
      "adjust_k": [
        13
      ],
      "initialize_new_tail": [
        20
      ],
      "find_new_tail_loop": [
        22
      ],
      "set_new_head": [
        26
      ],
      "break_circle": [
        27
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "null_check": [
        2
      ],
      "while_counting": [
        7
      ],
      "while_finding_tail": [
        21
      ],
      "k_is_zero": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rotateRight(head: ListNode | null, k: number): ListNode | null {\n    if (!head || !head.next || k === 0) return head;\n\n    // Find the length and the tail\n    let n = 1;\n    let tail: ListNode = head;\n    while (tail.next) {\n        n++;\n        tail = tail.next;\n    }\n\n    // Compute effective rotation\n    k = k % n;\n    if (k === 0) return head;\n\n    // Form a circular list\n    tail.next = head;\n\n    // Walk to the new tail: (n - k - 1) steps from head\n    let newTail: ListNode = head;\n    for (let i = 0; i < n - k - 1; i++) {\n        newTail = newTail.next!;\n    }\n\n    // Break the circle\n    let newHead: ListNode | null = newTail.next;\n    newTail.next = null;\n\n    return newHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_length": [
        5,
        6
      ],
      "calculate_length_loop": [
        8,
        9
      ],
      "make_circular": [
        17
      ],
      "adjust_k": [
        13
      ],
      "initialize_new_tail": [
        20
      ],
      "find_new_tail_loop": [
        22
      ],
      "set_new_head": [
        26
      ],
      "break_circle": [
        27
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "null_check": [
        2
      ],
      "while_counting": [
        7
      ],
      "while_finding_tail": [
        21
      ],
      "k_is_zero": [
        14
      ]
    }
  }
};

const RotateListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "values": [
        0,
        1,
        2
      ],
      "k": 4
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "k": 3
    }
  }
];

function generateRotateListSteps(e: any): any[] {
  class i{constructor(e,t=null){this.val=e,this.next=t}}function l(e){return null===e?null:`Node(${e.val})`}

let t=e.values,n=e.k,r=null,o=[];if(t.length>0){r=new i(t[0]),o.push(r);let e=r;for(let n=1;n<t.length;n++)e.next=new i(t[n]),e=e.next,o.push(e)}let d={};t.forEach((e,t)=>{d[`node_${t}`]={type:"arrayElement",value:e,position:t}});let s={};for(let e=0;e<t.length-1;e++)s[`arrow_${e}`]={type:"range",start:e,end:e+1};let u=new StepRecorder({values:t,k:n,head:l(r)},{...d,...s});if(u.record("-","Start of algorithm"),null===r||null===r.next)return u.add_conditional("null_check",!0),u.record("return","List is empty or has single node, return as is"),u.getSteps();u.add_conditional("null_check",!1),u.add_new_visual("ptr_head",{type:"pointer",position:0,label:"head"}),u.record("initialize","Initialize head pointer");let c=1,h=r;for(u.add_new_visual("ptr_tail",{type:"pointer",position:0,label:"tail"}),u.update_variable("length",c),u.update_variable("tail",l(h)),u.record("initialize_length","Initialize length and tail pointer");null!==h.next;){u.add_conditional("while_counting",!0),h=h.next,c++;let e=o.indexOf(h);u.update_visual("ptr_tail",{type:"pointer",position:e,label:"tail"}),u.update_variable("tail",l(h)),u.update_variable("length",c),u.record("calculate_length_loop",`Move tail pointer, length = ${c}`)}let p=o.indexOf(h);u.add_new_visual("arrow_cycle",{type:"range",start:p,end:0}),u.record("make_circular","Connect tail to head to form circular list");let _=n;if(n%=c,u.update_variable("k",n),u.record("adjust_k",`Adjust k: ${_} % ${c} = ${n}`),0===n)return u.add_conditional("k_is_zero",!0),u.record("return","k is 0, no rotation needed"),u.getSteps();let g=c-n,f=r;u.add_new_visual("ptr_newTail",{type:"pointer",position:0,label:"newTail"}),u.update_variable("newTail",l(f)),u.record("initialize_new_tail",`Initialize newTail, need to move ${g-1} steps`);for(let e=0;e<g-1;e++){u.add_conditional("while_finding_tail",!0),f=f.next;let e=o.indexOf(f);u.update_visual("ptr_newTail",{type:"pointer",position:e,label:"newTail"}),u.update_variable("newTail",l(f)),u.record("find_new_tail_loop",`Move newTail pointer to position ${e}`)}let k=f.next,w=o.indexOf(k);u.delete_visual("ptr_head"),u.add_new_visual("ptr_newHead",{type:"pointer",position:w,label:"newHead"}),u.update_variable("newHead",l(k)),u.update_visual(`node_${w}`,{type:"arrayElement",value:k.val,position:w,state:"sorted"}),u.record("set_new_head",`Set newHead = newTail.next at position ${w}`);let x=o.indexOf(f);for(let e=0;e<t.length-1;e++)u.delete_visual(`arrow_${e}`);let v=0;for(let e=w;e<t.length-1;e++)u.add_new_visual(`arrow_rotated_${v}`,{type:"range",start:e,end:e+1}),v++;for(let e=0;e<x;e++)u.add_new_visual(`arrow_rotated_${v}`,{type:"range",start:e,end:e+1}),v++;u.record("break_circle","Break circle: set newTail.next = null");let m=[];for(let e=w;e<t.length;e++)m.push(e);for(let e=0;e<w;e++)m.push(e);m.forEach((e,n)=>{u.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:n,state:0===n?"result":"default"})}),u.delete_visual("ptr_newHead"),u.delete_visual("ptr_newTail"),u.delete_visual("ptr_tail"),u.delete_visual("arrow_cycle");for(let e=0;e<v;e++)u.delete_visual(`arrow_rotated_${e}`);for(let e=0;e<t.length;e++)u.delete_visual(`arrow_${e}`);for(let e=0;e<t.length-1;e++)u.add_new_visual(`arrow_linear_${e}`,{type:"range",start:e,end:e+1});return u.record("return",`Lay the rotated list out left to right (new head ${k.val})`),u.getSteps()
}

export function RotateListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RotateListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRotateListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Rotate List"
      slug="rotate-list"
      approaches={approaches}
      presets={RotateListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Add Two Numbers (add-two-numbers)
// ==========================================

const AddTwoNumbersTemplates = {
  "python": {
    "language": "python",
    "code": "def addTwoNumbers(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    carry = 0\n\n    while l1 or l2 or carry:\n        val1 = l1.val if l1 else 0\n        val2 = l2.val if l2 else 0\n        total = val1 + val2 + carry\n\n        carry = total // 10\n        current.next = ListNode(total % 10)\n        current = current.next\n\n        if l1:\n            l1 = l1.next\n        if l2:\n            l2 = l2.next\n\n    return dummy.next",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        4
      ],
      "get_values": [
        7,
        8
      ],
      "calculate_sum": [
        9
      ],
      "update_carry": [
        11
      ],
      "create_node": [
        12
      ],
      "move_pointers": [
        13,
        16,
        18
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "main_loop": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n    ListNode dummy = new ListNode(0);\n    ListNode current = dummy;\n    int carry = 0;\n\n    while (l1 != null || l2 != null || carry != 0) {\n        int val1 = (l1 != null) ? l1.val : 0;\n        int val2 = (l2 != null) ? l2.val : 0;\n        int sum = val1 + val2 + carry;\n\n        carry = sum / 10;\n        current.next = new ListNode(sum % 10);\n        current = current.next;\n\n        if (l1 != null) l1 = l1.next;\n        if (l2 != null) l2 = l2.next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        4
      ],
      "get_values": [
        7,
        8
      ],
      "calculate_sum": [
        9
      ],
      "update_carry": [
        11
      ],
      "create_node": [
        12
      ],
      "move_pointers": [
        13,
        15,
        16
      ],
      "return": [
        19
      ]
    },
    "conditionalMap": {
      "main_loop": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* current = &dummy;\n    int carry = 0;\n\n    while (l1 || l2 || carry) {\n        int val1 = l1 ? l1->val : 0;\n        int val2 = l2 ? l2->val : 0;\n        int sum = val1 + val2 + carry;\n\n        carry = sum / 10;\n        current->next = new ListNode(sum % 10);\n        current = current->next;\n\n        if (l1) l1 = l1->next;\n        if (l2) l2 = l2->next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        4
      ],
      "get_values": [
        7,
        8
      ],
      "calculate_sum": [
        9
      ],
      "update_carry": [
        11
      ],
      "create_node": [
        12
      ],
      "move_pointers": [
        13,
        15,
        16
      ],
      "return": [
        19
      ]
    },
    "conditionalMap": {
      "main_loop": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {\n    ListNode dummy = new ListNode(0);\n    ListNode current = dummy;\n    int carry = 0;\n\n    while (l1 != null || l2 != null || carry != 0) {\n        int val1 = (l1 != null) ? l1.val : 0;\n        int val2 = (l2 != null) ? l2.val : 0;\n        int sum = val1 + val2 + carry;\n\n        carry = sum / 10;\n        current.next = new ListNode(sum % 10);\n        current = current.next;\n\n        if (l1 != null) l1 = l1.next;\n        if (l2 != null) l2 = l2.next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        4
      ],
      "get_values": [
        7,
        8
      ],
      "calculate_sum": [
        9
      ],
      "update_carry": [
        11
      ],
      "create_node": [
        12
      ],
      "move_pointers": [
        13,
        15,
        16
      ],
      "return": [
        19
      ]
    },
    "conditionalMap": {
      "main_loop": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {\n    dummy := &ListNode{Val: 0}\n    current := dummy\n    carry := 0\n\n    for l1 != nil || l2 != nil || carry != 0 {\n        val1 := 0\n        val2 := 0\n        if l1 != nil {\n            val1 = l1.Val\n        }\n        if l2 != nil {\n            val2 = l2.Val\n        }\n\n        sum := val1 + val2 + carry\n        carry = sum / 10\n        current.Next = &ListNode{Val: sum % 10}\n        current = current.Next\n\n        if l1 != nil {\n            l1 = l1.Next\n        }\n        if l2 != nil {\n            l2 = l2.Next\n        }\n    }\n\n    return dummy.Next\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        4
      ],
      "get_values": [
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "calculate_sum": [
        16
      ],
      "update_carry": [
        17
      ],
      "create_node": [
        18
      ],
      "move_pointers": [
        19,
        22,
        25
      ],
      "return": [
        29
      ]
    },
    "conditionalMap": {
      "main_loop": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function addTwoNumbers(l1, l2) {\n    var dummy = new ListNode(0);\n    var current = dummy;\n    var carry = 0;\n\n    while (l1 !== null || l2 !== null || carry !== 0) {\n        var val1 = l1 !== null ? l1.val : 0;\n        var val2 = l2 !== null ? l2.val : 0;\n        var sum = val1 + val2 + carry;\n\n        carry = Math.floor(sum / 10);\n        current.next = new ListNode(sum % 10);\n        current = current.next;\n\n        if (l1 !== null) l1 = l1.next;\n        if (l2 !== null) l2 = l2.next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        4
      ],
      "get_values": [
        7,
        8
      ],
      "calculate_sum": [
        9
      ],
      "update_carry": [
        11
      ],
      "create_node": [
        12
      ],
      "move_pointers": [
        13,
        15,
        16
      ],
      "return": [
        19
      ]
    },
    "conditionalMap": {
      "main_loop": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n    const dummy = new ListNode(0);\n    let current = dummy;\n    let carry = 0;\n\n    while (l1 !== null || l2 !== null || carry !== 0) {\n        const val1 = l1 !== null ? l1.val : 0;\n        const val2 = l2 !== null ? l2.val : 0;\n        const sum = val1 + val2 + carry;\n\n        carry = Math.floor(sum / 10);\n        current.next = new ListNode(sum % 10);\n        current = current.next;\n\n        if (l1 !== null) l1 = l1.next;\n        if (l2 !== null) l2 = l2.next;\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "initialize_pointers": [
        3,
        4
      ],
      "get_values": [
        7,
        8
      ],
      "calculate_sum": [
        9
      ],
      "update_carry": [
        11
      ],
      "create_node": [
        12
      ],
      "move_pointers": [
        13,
        15,
        16
      ],
      "return": [
        19
      ]
    },
    "conditionalMap": {
      "main_loop": [
        6
      ]
    }
  }
};

const AddTwoNumbersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "list1": [
        2,
        4,
        3
      ],
      "list2": [
        5,
        6,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "list1": [
        0
      ],
      "list2": [
        0
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "list1": [
        9,
        9,
        9,
        9,
        9,
        9
      ],
      "list2": [
        9,
        9,
        9,
        9
      ]
    }
  }
];

function generateAddTwoNumbersSteps(e: any): any[] {
  class a{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function n(e){return null===e?null:`Node(${e.val})`}

let t=e.list1,l=e.list2,i=null,s=[];if(t.length>0){i=new a(t[0]),s.push(i);let e=i;for(let l=1;l<t.length;l++)e.next=new a(t[l]),e=e.next,s.push(e)}let o=null,u=[];if(l.length>0){o=new a(l[0]),u.push(o);let e=o;for(let t=1;t<l.length;t++)e.next=new a(l[t]),e=e.next,u.push(e)}let d={};t.forEach((e,t)=>{d[`list1_node_${t}`]={type:"arrayElement",value:e,position:t,row:0}});let c={};for(let e=0;e<t.length-1;e++)c[`list1_arrow_${e}`]={type:"range",start:e,end:e+1,row:0};l.forEach((e,t)=>{d[`list2_node_${t}`]={type:"arrayElement",value:e,position:t,row:1}});for(let e=0;e<l.length-1;e++)c[`list2_arrow_${e}`]={type:"range",start:e,end:e+1,row:1};let p=new StepRecorder({list1Values:t,list2Values:l,carry:0},{...d,...c});p.record("-","Start of algorithm");let m=new a(0),v=[m];p.add_new_visual("result_node_-1",{type:"arrayElement",value:0,position:-1,row:2,state:"inactive"}),p.record("initialize","Create the dummy node that anchors the result list");let h=i,y=o,_=m,x=0;null!==h&&(p.add_new_visual("ptr_p",{type:"pointer",position:0,label:"l1",row:0}),p.update_variable("l1",n(h))),null!==y&&(p.add_new_visual("ptr_q",{type:"pointer",position:0,label:"l2",row:1}),p.update_variable("l2",n(y))),p.add_new_visual("ptr_current",{type:"pointer",position:-1,label:"current",row:2}),p.update_variable("current",n(_)),p.update_variable("carry",x),p.record("initialize_pointers","current starts at dummy, carry starts at 0");let f=0;for(;null!==h||null!==y||0!==x;){p.add_conditional("main_loop",!0);let e=null!==h?h.val:0,t=null!==y?y.val:0;if(p.update_variable("val1",e),p.update_variable("val2",t),null!==h){let e=s.indexOf(h);p.update_visual(`list1_node_${e}`,{type:"arrayElement",value:h.val,position:e,row:0,state:"active"})}if(null!==y){let e=u.indexOf(y);p.update_visual(`list2_node_${e}`,{type:"arrayElement",value:y.val,position:e,row:1,state:"active"})}p.record("get_values",`Read the digits: val1=${e}, val2=${t}`);let l=x+e+t;p.update_variable("sum",l),p.record("calculate_sum",`Calculate sum: ${x} + ${e} + ${t} = ${l}`),x=Math.floor(l/10),p.update_variable("carry",x),p.record("update_carry",`Update carry: ${x}`);let r=new a(l%10);if(_.next=r,v.push(r),p.add_new_visual(`result_node_${f}`,{type:"arrayElement",value:l%10,position:f,row:2,state:"sorted"}),p.add_new_visual(`result_arrow_${f-1}`,{type:"range",start:f-1,end:f,row:2}),p.record("create_node",`Create result node with value ${l%10}`),null!==h){let e=s.indexOf(h);p.update_visual(`list1_node_${e}`,{type:"arrayElement",value:h.val,position:e,row:0,state:"visited"})}if(null!==y){let e=u.indexOf(y);p.update_visual(`list2_node_${e}`,{type:"arrayElement",value:y.val,position:e,row:1,state:"visited"})}if(_=_.next,p.update_variable("current",n(_)),p.update_visual("ptr_current",{type:"pointer",position:f,label:"current",row:2}),null!==h&&(h=h.next,p.update_variable("l1",n(h)),null!==h)){let e=s.indexOf(h);p.update_visual("ptr_p",{type:"pointer",position:e,label:"l1",row:0})}if(null!==y&&(y=y.next,p.update_variable("l2",n(y)),null!==y)){let e=u.indexOf(y);p.update_visual("ptr_q",{type:"pointer",position:e,label:"l2",row:1})}p.record("move_pointers","Advance current, then l1 and l2 if they still have digits"),f++}return p.delete_visual("ptr_current"),p.delete_visual("ptr_p"),p.delete_visual("ptr_q"),p.record("return","Return dummy.next"),p.getSteps()
}

export function AddTwoNumbersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AddTwoNumbersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAddTwoNumbersSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Add Two Numbers"
      slug="add-two-numbers"
      approaches={approaches}
      presets={AddTwoNumbersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Copy List with Random Pointer (copy-list-with-random-pointer)
// ==========================================

const CopyListWithRandomPointerTemplates = {
  "python": {
    "language": "python",
    "code": "def copyRandomList(head):\n    if not head:\n        return None\n\n    # Pass 1: interleave copy nodes after each original\n    current = head\n    while current:\n        copy = Node(current.val)\n        copy.next = current.next\n        current.next = copy\n        current = copy.next\n\n    # Pass 2: set random pointers for copy nodes\n    current = head\n    while current:\n        if current.random:\n            current.next.random = current.random.next\n        current = current.next.next\n\n    # Pass 3: separate the interleaved list into original and copy\n    copy_head = head.next\n    current = head\n    copy_current = copy_head\n    while current:\n        current.next = copy_current.next\n        current = current.next\n        if current:\n            copy_current.next = current.next\n            copy_current = copy_current.next\n        else:\n            copy_current.next = None\n\n    return copy_head",
    "lineMap": {
      "-": [
        1
      ],
      "check_null": [
        2
      ],
      "step1_start": [
        6
      ],
      "init_current": [
        6
      ],
      "create_copy": [
        8
      ],
      "copy_next": [
        9
      ],
      "interleave": [
        10
      ],
      "move_current_step1": [
        11
      ],
      "step1_done": [
        11
      ],
      "step2_start": [
        6
      ],
      "reset_current": [
        6
      ],
      "assign_random": [
        17
      ],
      "skip_random": [
        16
      ],
      "move_current_step2": [
        18
      ],
      "step2_done": [
        18
      ],
      "step3_start": [
        21
      ],
      "init_step3": [
        21,
        22,
        23
      ],
      "restore_original": [
        25
      ],
      "link_copies": [
        28
      ],
      "move_current_step3": [
        26
      ],
      "step3_done": [
        28
      ],
      "complete": [
        33
      ],
      "return": [
        33
      ]
    },
    "conditionalMap": {
      "while_step1": [
        7
      ],
      "while_step2": [
        15
      ],
      "while_step3": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public Node copyRandomList(Node head) {\n    if (head == null) return null;\n\n    // Pass 1: interleave copy nodes after each original\n    Node current = head;\n    while (current != null) {\n        Node copy = new Node(current.val);\n        copy.next = current.next;\n        current.next = copy;\n        current = copy.next;\n    }\n\n    // Pass 2: set random pointers for copy nodes\n    current = head;\n    while (current != null) {\n        if (current.random != null) {\n            current.next.random = current.random.next;\n        }\n        current = current.next.next;\n    }\n\n    // Pass 3: separate the interleaved list into original and copy\n    Node copyHead = head.next;\n    current = head;\n    Node copyCurrent = copyHead;\n    while (current != null) {\n        current.next = copyCurrent.next;\n        current = current.next;\n        if (current != null) {\n            copyCurrent.next = current.next;\n            copyCurrent = copyCurrent.next;\n        } else {\n            copyCurrent.next = null;\n        }\n    }\n\n    return copyHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_null": [
        2
      ],
      "step1_start": [
        5
      ],
      "init_current": [
        5
      ],
      "create_copy": [
        7
      ],
      "copy_next": [
        8
      ],
      "interleave": [
        9
      ],
      "move_current_step1": [
        10
      ],
      "step1_done": [
        10
      ],
      "step2_start": [
        14
      ],
      "reset_current": [
        14
      ],
      "assign_random": [
        17
      ],
      "skip_random": [
        16
      ],
      "move_current_step2": [
        19
      ],
      "step2_done": [
        19
      ],
      "step3_start": [
        23
      ],
      "init_step3": [
        23,
        24,
        25
      ],
      "restore_original": [
        27
      ],
      "link_copies": [
        30
      ],
      "move_current_step3": [
        28
      ],
      "step3_done": [
        30
      ],
      "complete": [
        37
      ],
      "return": [
        37
      ]
    },
    "conditionalMap": {
      "while_step1": [
        6
      ],
      "while_step2": [
        15
      ],
      "while_step3": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "Node* copyRandomList(Node* head) {\n    if (!head) return nullptr;\n\n    // Pass 1: interleave copy nodes after each original\n    Node* current = head;\n    while (current) {\n        Node* copy = new Node(current->val);\n        copy->next = current->next;\n        current->next = copy;\n        current = copy->next;\n    }\n\n    // Pass 2: set random pointers for copy nodes\n    current = head;\n    while (current) {\n        if (current->random) {\n            current->next->random = current->random->next;\n        }\n        current = current->next->next;\n    }\n\n    // Pass 3: separate the interleaved list into original and copy\n    Node* copyHead = head->next;\n    current = head;\n    Node* copyCurrent = copyHead;\n    while (current) {\n        current->next = copyCurrent->next;\n        current = current->next;\n        if (current) {\n            copyCurrent->next = current->next;\n            copyCurrent = copyCurrent->next;\n        } else {\n            copyCurrent->next = nullptr;\n        }\n    }\n\n    return copyHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_null": [
        2
      ],
      "step1_start": [
        5
      ],
      "init_current": [
        5
      ],
      "create_copy": [
        7
      ],
      "copy_next": [
        8
      ],
      "interleave": [
        9
      ],
      "move_current_step1": [
        10
      ],
      "step1_done": [
        10
      ],
      "step2_start": [
        14
      ],
      "reset_current": [
        14
      ],
      "assign_random": [
        17
      ],
      "skip_random": [
        16
      ],
      "move_current_step2": [
        19
      ],
      "step2_done": [
        19
      ],
      "step3_start": [
        23
      ],
      "init_step3": [
        23,
        24,
        25
      ],
      "restore_original": [
        27
      ],
      "link_copies": [
        30
      ],
      "move_current_step3": [
        28
      ],
      "step3_done": [
        30
      ],
      "complete": [
        37
      ],
      "return": [
        37
      ]
    },
    "conditionalMap": {
      "while_step1": [
        6
      ],
      "while_step2": [
        15
      ],
      "while_step3": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public Node CopyRandomList(Node head) {\n    if (head == null) return null;\n\n    // Pass 1: interleave copy nodes after each original\n    Node current = head;\n    while (current != null) {\n        Node copy = new Node(current.val);\n        copy.next = current.next;\n        current.next = copy;\n        current = copy.next;\n    }\n\n    // Pass 2: set random pointers for copy nodes\n    current = head;\n    while (current != null) {\n        if (current.random != null) {\n            current.next.random = current.random.next;\n        }\n        current = current.next.next;\n    }\n\n    // Pass 3: separate the interleaved list into original and copy\n    Node copyHead = head.next;\n    current = head;\n    Node copyCurrent = copyHead;\n    while (current != null) {\n        current.next = copyCurrent.next;\n        current = current.next;\n        if (current != null) {\n            copyCurrent.next = current.next;\n            copyCurrent = copyCurrent.next;\n        } else {\n            copyCurrent.next = null;\n        }\n    }\n\n    return copyHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_null": [
        2
      ],
      "step1_start": [
        5
      ],
      "init_current": [
        5
      ],
      "create_copy": [
        7
      ],
      "copy_next": [
        8
      ],
      "interleave": [
        9
      ],
      "move_current_step1": [
        10
      ],
      "step1_done": [
        10
      ],
      "step2_start": [
        14
      ],
      "reset_current": [
        14
      ],
      "assign_random": [
        17
      ],
      "skip_random": [
        16
      ],
      "move_current_step2": [
        19
      ],
      "step2_done": [
        19
      ],
      "step3_start": [
        23
      ],
      "init_step3": [
        23,
        24,
        25
      ],
      "restore_original": [
        27
      ],
      "link_copies": [
        30
      ],
      "move_current_step3": [
        28
      ],
      "step3_done": [
        30
      ],
      "complete": [
        37
      ],
      "return": [
        37
      ]
    },
    "conditionalMap": {
      "while_step1": [
        6
      ],
      "while_step2": [
        15
      ],
      "while_step3": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func copyRandomList(head *Node) *Node {\n    if head == nil {\n        return nil\n    }\n\n    // Pass 1: interleave copy nodes after each original\n    current := head\n    for current != nil {\n        copyNode := &Node{Val: current.Val}\n        copyNode.Next = current.Next\n        current.Next = copyNode\n        current = copyNode.Next\n    }\n\n    // Pass 2: set random pointers for copy nodes\n    current = head\n    for current != nil {\n        if current.Random != nil {\n            current.Next.Random = current.Random.Next\n        }\n        current = current.Next.Next\n    }\n\n    // Pass 3: separate the interleaved list into original and copy\n    copyHead := head.Next\n    current = head\n    copyCurrent := copyHead\n    for current != nil {\n        current.Next = copyCurrent.Next\n        current = current.Next\n        if current != nil {\n            copyCurrent.Next = current.Next\n            copyCurrent = copyCurrent.Next\n        } else {\n            copyCurrent.Next = nil\n        }\n    }\n\n    return copyHead\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_null": [
        2
      ],
      "step1_start": [
        7
      ],
      "init_current": [
        7
      ],
      "create_copy": [
        9
      ],
      "copy_next": [
        10
      ],
      "interleave": [
        11
      ],
      "move_current_step1": [
        12
      ],
      "step1_done": [
        12
      ],
      "step2_start": [
        16
      ],
      "reset_current": [
        16
      ],
      "assign_random": [
        19
      ],
      "skip_random": [
        18
      ],
      "move_current_step2": [
        21
      ],
      "step2_done": [
        21
      ],
      "step3_start": [
        25
      ],
      "init_step3": [
        25,
        26,
        27
      ],
      "restore_original": [
        29
      ],
      "link_copies": [
        32
      ],
      "move_current_step3": [
        30
      ],
      "step3_done": [
        32
      ],
      "complete": [
        39
      ],
      "return": [
        39
      ]
    },
    "conditionalMap": {
      "while_step1": [
        8
      ],
      "while_step2": [
        17
      ],
      "while_step3": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function copyRandomList(head) {\n    if (!head) return null;\n\n    // Pass 1: interleave copy nodes after each original\n    var current = head;\n    while (current) {\n        var copy = new _Node(current.val);\n        copy.next = current.next;\n        current.next = copy;\n        current = copy.next;\n    }\n\n    // Pass 2: set random pointers for copy nodes\n    current = head;\n    while (current) {\n        if (current.random) {\n            current.next.random = current.random.next;\n        }\n        current = current.next.next;\n    }\n\n    // Pass 3: separate the interleaved list into original and copy\n    var copyHead = head.next;\n    current = head;\n    var copyCurrent = copyHead;\n    while (current) {\n        current.next = copyCurrent.next;\n        current = current.next;\n        if (current) {\n            copyCurrent.next = current.next;\n            copyCurrent = copyCurrent.next;\n        } else {\n            copyCurrent.next = null;\n        }\n    }\n\n    return copyHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_null": [
        2
      ],
      "step1_start": [
        5
      ],
      "init_current": [
        5
      ],
      "create_copy": [
        7
      ],
      "copy_next": [
        8
      ],
      "interleave": [
        9
      ],
      "move_current_step1": [
        10
      ],
      "step1_done": [
        10
      ],
      "step2_start": [
        14
      ],
      "reset_current": [
        14
      ],
      "assign_random": [
        17
      ],
      "skip_random": [
        16
      ],
      "move_current_step2": [
        19
      ],
      "step2_done": [
        19
      ],
      "step3_start": [
        23
      ],
      "init_step3": [
        23,
        24,
        25
      ],
      "restore_original": [
        27
      ],
      "link_copies": [
        30
      ],
      "move_current_step3": [
        28
      ],
      "step3_done": [
        30
      ],
      "complete": [
        37
      ],
      "return": [
        37
      ]
    },
    "conditionalMap": {
      "while_step1": [
        6
      ],
      "while_step2": [
        15
      ],
      "while_step3": [
        26
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function copyRandomList(head: _Node | null): _Node | null {\n    if (!head) return null;\n\n    // Pass 1: interleave copy nodes after each original\n    let current: _Node | null = head;\n    while (current) {\n        const copy: _Node = new _Node(current.val);\n        copy.next = current.next;\n        current.next = copy;\n        current = copy.next;\n    }\n\n    // Pass 2: set random pointers for copy nodes\n    current = head;\n    while (current) {\n        if (current.random) {\n            current.next!.random = current.random.next;\n        }\n        current = current.next!.next;\n    }\n\n    // Pass 3: separate the interleaved list into original and copy\n    const copyHead = head.next!;\n    current = head;\n    let copyCurrent: _Node | null = copyHead;\n    while (current) {\n        current.next = copyCurrent!.next;\n        current = current.next;\n        if (current) {\n            copyCurrent!.next = current.next;\n            copyCurrent = copyCurrent!.next;\n        } else {\n            copyCurrent!.next = null;\n        }\n    }\n\n    return copyHead;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_null": [
        2
      ],
      "step1_start": [
        5
      ],
      "init_current": [
        5
      ],
      "create_copy": [
        7
      ],
      "copy_next": [
        8
      ],
      "interleave": [
        9
      ],
      "move_current_step1": [
        10
      ],
      "step1_done": [
        10
      ],
      "step2_start": [
        14
      ],
      "reset_current": [
        14
      ],
      "assign_random": [
        17
      ],
      "skip_random": [
        16
      ],
      "move_current_step2": [
        19
      ],
      "step2_done": [
        19
      ],
      "step3_start": [
        23
      ],
      "init_step3": [
        23,
        24,
        25
      ],
      "restore_original": [
        27
      ],
      "link_copies": [
        30
      ],
      "move_current_step3": [
        28
      ],
      "step3_done": [
        30
      ],
      "complete": [
        37
      ],
      "return": [
        37
      ]
    },
    "conditionalMap": {
      "while_step1": [
        6
      ],
      "while_step2": [
        15
      ],
      "while_step3": [
        26
      ]
    }
  }
};

const CopyListWithRandomPointerPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "values": [
        7,
        13,
        11,
        10,
        1
      ],
      "randomIndices": [
        null,
        0,
        4,
        2,
        0
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Two nodes",
    "value": {
      "values": [
        1,
        2
      ],
      "randomIndices": [
        1,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Same values",
    "value": {
      "values": [
        3,
        3,
        3
      ],
      "randomIndices": [
        null,
        0,
        null
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All with random",
    "value": {
      "values": [
        1,
        2,
        3,
        4
      ],
      "randomIndices": [
        3,
        0,
        1,
        2
      ]
    }
  },
  {
    "id": "ex5",
    "label": "No random pointers",
    "value": {
      "values": [
        1,
        2,
        3
      ],
      "randomIndices": [
        null,
        null,
        null
      ]
    }
  }
];

function generateCopyListWithRandomPointerSteps(e: any): any[] {
  class a{constructor(e,t,r){this.val=void 0===e?0:e,this.next=void 0===t?null:t,this.random=void 0===r?null:r}}function o(e){return null===e?null:`Node(${e.val})`}

let t=e.values,r=e.randomIndices,l=[],u=null;if(t.length>0){for(let e=0;e<t.length;e++)l.push(new a(t[e]));for(let e=0;e<l.length-1;e++)l[e].next=l[e+1];for(let e=0;e<l.length;e++){let t=r[e];null!==t&&-1!==t&&t>=0&&t<l.length&&(l[e].random=l[t])}u=l[0]}let s=t.length,i={};t.forEach((e,t)=>{i[`node_${t}`]={type:"arrayElement",value:e,position:t,state:"default"}});let c={};for(let e=0;e<t.length-1;e++)c[`next_${e}_${e+1}`]={type:"range",start:e,end:e+1};for(let e=0;e<r.length;e++){let n=r[e];null!==n&&-1!==n&&n>=0&&n<t.length&&(c[`random_${e}_${n}`]={type:"range",start:e,end:n,label:"random"})}let d=new StepRecorder({values:t,randomIndices:r,current:void 0,newNode:void 0,copyHead:void 0},{...i,...c,ptr_head:{type:"pointer",position:0,label:"head"}}),p=r.map((e,r)=>null===e||-1===e?"null":`${t[e]}`).join(", ");if(d.record("-",`Original list with random pointers: [${p}]`),null===u)return d.record("check_null","head is null, return null"),d.record("return","Return null"),d.getSteps();d.record("check_null","head is not null, proceed with three-pass algorithm"),d.record("step1_start","STEP 1: Create copy nodes and interleave with original");let _=u,h=0;d.update_variable("current",o(_)),d.add_new_visual("ptr_current",{type:"pointer",position:0,label:"current"}),d.record("init_current","Initialize current = head");let m=[];for(;null!==_;){d.add_conditional("while_step1",!0),d.update_visual(`node_${h}`,{type:"arrayElement",value:t[h],position:h,state:"active"});let e=new a(_.val);d.update_variable("copy",o(e));let r=s+h;m.push(r),d.add_new_visual(`copy_node_${h}`,{type:"arrayElement",value:t[h],position:r,state:"highlight"}),d.record("create_copy",`Create copy node with value ${_.val}`),e.next=_.next,h<s-1?(d.add_new_visual(`copy_to_next_${h}`,{type:"range",start:r,end:h+1,label:"merge"}),d.record("copy_next",`copy.next = current.next (${t[h]}' → ${t[h+1]})`)):d.record("copy_next","copy.next = current.next (null)"),_.next=e,d.add_new_visual(`interleave_${h}`,{type:"range",start:h,end:r}),d.record("interleave",`current.next = copy (${t[h]} → ${t[h]}'). List is now interleaved.`),d.update_visual(`node_${h}`,{type:"arrayElement",value:t[h],position:h,state:"visited"}),null!==(_=e.next)?(h++,d.update_variable("current",o(_)),d.update_visual("ptr_current",{type:"pointer",position:h,label:"current"}),d.record("move_current_step1",`current = copy.next (skip copy, move to ${_.val})`)):(d.update_variable("current",null),d.delete_visual("ptr_current"),d.record("move_current_step1","current = copy.next (null, end of list)"))}for(let e=0;e<s-1;e++)d.add_new_visual(`copy_next_${e}`,{type:"range",start:s+e,end:s+e+1});for(d.add_conditional("while_step1",!1),d.record("step1_done","Step 1 complete: Copy nodes created. List is now A→A'→B→B'→C→C'..."),d.record("step2_start","STEP 2: Assign random pointers to copies using current.next.random = current.random.next"),_=u,h=0,d.update_variable("current",o(_)),d.add_new_visual("ptr_current",{type:"pointer",position:0,label:"current"}),d.record("reset_current","Reset current = head");null!==_;){d.add_conditional("while_step2",!0),d.update_visual(`node_${h}`,{type:"arrayElement",value:t[h],position:h,state:"active"});let e=r[h];if(null!==_.random&&null!==e&&-1!==e&&e>=0){d.update_visual(`random_${h}_${e}`,{type:"range",start:h,end:e,label:"random",state:"active"}),_.next.random=_.random.next;let r=s+h,n=s+e;d.add_new_visual(`copy_random_${h}_${e}`,{type:"range",start:r,end:n,label:"random"}),d.record("assign_random",`Copy's random assigned: ${t[h]}' → ${t[e]}' (copy of random pointer)`),d.update_visual(`random_${h}_${e}`,{type:"range",start:h,end:e,label:"random"})}else d.record("skip_random","current.random is null, copy's random stays null");d.update_visual(`node_${h}`,{type:"arrayElement",value:t[h],position:h,state:"visited"}),null!==(_=_.next.next)?(h++,d.update_variable("current",o(_)),d.update_visual("ptr_current",{type:"pointer",position:h,label:"current"}),d.record("move_current_step2",`current = current.next.next (${_.val})`)):(d.update_variable("current",null),d.delete_visual("ptr_current"),d.record("move_current_step2","current = current.next.next (null)"))}d.add_conditional("while_step2",!1),d.record("step2_done","Step 2 complete: All random pointers assigned to copies"),d.record("step3_start","STEP 3: Separate original and copied lists"),_=u,h=0;let y=u.next;for(d.update_variable("current",o(_)),d.update_variable("copyHead",o(y)),d.add_new_visual("ptr_current",{type:"pointer",position:0,label:"current"}),d.add_new_visual("ptr_copyHead",{type:"pointer",position:s,label:"copyHead"}),d.record("init_step3",`current = head, copyHead = head.next (${y?.val}')`);null!==_;){d.add_conditional("while_step3",!0);let e=_.next;d.update_visual(`node_${h}`,{type:"arrayElement",value:t[h],position:h,state:"active"}),_.next=e.next,d.delete_visual(`interleave_${h}`),d.record("restore_original",`Restore: ${t[h]}.next = ${e.next?t[h+1]:"null"} (remove interleave)`),null!==(_=_.next)?(e.next=_.next,d.record("link_copies",`Copy list intact: ${t[h]}' → ${t[h+1]}'`)):(e.next=null,d.record("link_copies",`Copy list ends: ${t[h]}' → null`)),d.update_visual(`node_${h}`,{type:"arrayElement",value:t[h],position:h,state:"visited"}),null!==_?(h++,d.update_variable("current",o(_)),d.update_visual("ptr_current",{type:"pointer",position:h,label:"current"}),d.record("move_current_step3",`current = current.next (${_.val})`)):(d.update_variable("current",null),d.delete_visual("ptr_current"),d.record("move_current_step3","current = current.next (null)"))}d.add_conditional("while_step3",!1);for(let e=0;e<s;e++)d.update_visual(`copy_node_${e}`,{type:"arrayElement",value:t[e],position:s+e,state:"result"});return d.record("step3_done","Step 3 complete: Lists separated"),d.record("complete","Deep copy complete! Original list restored, copied list has all next and random pointers"),d.record("return","Return copyHead"),d.getSteps()
}

export function CopyListWithRandomPointerProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CopyListWithRandomPointerTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCopyListWithRandomPointerSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Copy List with Random Pointer"
      slug="copy-list-with-random-pointer"
      approaches={approaches}
      presets={CopyListWithRandomPointerPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Flatten a Multilevel Doubly Linked List (flatten-a-multilevel-doubly-linked-list)
// ==========================================

const FlattenAMultilevelDoublyLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "def flatten(head):\n    curr = head\n\n    while curr:\n        if curr.child:\n            nxt = curr.next  # save the current next\n\n            # Find the tail of the child chain\n            tail = curr.child\n            while tail.next:\n                tail = tail.next\n\n            # Splice child chain between curr and nxt\n            curr.next = curr.child\n            curr.child.prev = curr\n            tail.next = nxt\n            if nxt:\n                nxt.prev = tail\n\n            # Clear the child pointer\n            curr.child = None\n\n        curr = curr.next\n\n    return head",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2
      ],
      "init_curr": [
        2
      ],
      "visit_node": [
        4
      ],
      "found_child": [
        5
      ],
      "save_next": [
        6
      ],
      "find_tail": [
        9,
        10,
        11
      ],
      "connect_curr_child": [
        14,
        15
      ],
      "connect_tail_next": [
        16,
        17,
        18
      ],
      "clear_child": [
        21
      ],
      "move_curr": [
        23
      ],
      "complete": [
        25
      ],
      "return": [
        25
      ]
    },
    "conditionalMap": {
      "while_curr": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public Node flatten(Node head) {\n    Node curr = head;\n\n    while (curr != null) {\n        if (curr.child != null) {\n            Node next = curr.next; // save the current next\n\n            // Find the tail of the child chain\n            Node tail = curr.child;\n            while (tail.next != null) {\n                tail = tail.next;\n            }\n\n            // Splice child chain between curr and next\n            curr.next = curr.child;\n            curr.child.prev = curr;\n            tail.next = next;\n            if (next != null) {\n                next.prev = tail;\n            }\n\n            // Clear the child pointer\n            curr.child = null;\n        }\n        curr = curr.next;\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2
      ],
      "init_curr": [
        2
      ],
      "visit_node": [
        4
      ],
      "found_child": [
        5
      ],
      "save_next": [
        6
      ],
      "find_tail": [
        9,
        10,
        11
      ],
      "connect_curr_child": [
        15,
        16
      ],
      "connect_tail_next": [
        17,
        18,
        19
      ],
      "clear_child": [
        23
      ],
      "move_curr": [
        25
      ],
      "complete": [
        28
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "while_curr": [
        4
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "Node* flatten(Node* head) {\n    Node* curr = head;\n\n    while (curr) {\n        if (curr->child) {\n            Node* next = curr->next; // save the current next\n\n            // Find the tail of the child chain\n            Node* tail = curr->child;\n            while (tail->next) {\n                tail = tail->next;\n            }\n\n            // Splice child chain between curr and next\n            curr->next = curr->child;\n            curr->child->prev = curr;\n            tail->next = next;\n            if (next) {\n                next->prev = tail;\n            }\n\n            // Clear the child pointer\n            curr->child = nullptr;\n        }\n        curr = curr->next;\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2
      ],
      "init_curr": [
        2
      ],
      "visit_node": [
        4
      ],
      "found_child": [
        5
      ],
      "save_next": [
        6
      ],
      "find_tail": [
        9,
        10,
        11
      ],
      "connect_curr_child": [
        15,
        16
      ],
      "connect_tail_next": [
        17,
        18,
        19
      ],
      "clear_child": [
        23
      ],
      "move_curr": [
        25
      ],
      "complete": [
        28
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "while_curr": [
        4
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function flatten(head) {\n    var curr = head;\n\n    while (curr !== null) {\n        if (curr.child !== null) {\n            var next = curr.next; // save the current next\n\n            // Find the tail of the child chain\n            var tail = curr.child;\n            while (tail.next !== null) {\n                tail = tail.next;\n            }\n\n            // Splice child chain between curr and next\n            curr.next = curr.child;\n            curr.child.prev = curr;\n            tail.next = next;\n            if (next !== null) {\n                next.prev = tail;\n            }\n\n            // Clear the child pointer\n            curr.child = null;\n        }\n        curr = curr.next;\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2
      ],
      "init_curr": [
        2
      ],
      "visit_node": [
        4
      ],
      "found_child": [
        5
      ],
      "save_next": [
        6
      ],
      "find_tail": [
        9,
        10,
        11
      ],
      "connect_curr_child": [
        15,
        16
      ],
      "connect_tail_next": [
        17,
        18,
        19
      ],
      "clear_child": [
        23
      ],
      "move_curr": [
        25
      ],
      "complete": [
        28
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "while_curr": [
        4
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function flatten(head: Node | null): Node | null {\n    let curr = head;\n\n    while (curr !== null) {\n        if (curr.child !== null) {\n            const next = curr.next; // save the current next\n\n            // Find the tail of the child chain\n            let tail = curr.child;\n            while (tail.next !== null) {\n                tail = tail.next;\n            }\n\n            // Splice child chain between curr and next\n            curr.next = curr.child;\n            curr.child.prev = curr;\n            tail.next = next;\n            if (next !== null) {\n                next.prev = tail;\n            }\n\n            // Clear the child pointer\n            curr.child = null;\n        }\n        curr = curr.next;\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2
      ],
      "init_curr": [
        2
      ],
      "visit_node": [
        4
      ],
      "found_child": [
        5
      ],
      "save_next": [
        6
      ],
      "find_tail": [
        9,
        10,
        11
      ],
      "connect_curr_child": [
        15,
        16
      ],
      "connect_tail_next": [
        17,
        18,
        19
      ],
      "clear_child": [
        23
      ],
      "move_curr": [
        25
      ],
      "complete": [
        28
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "while_curr": [
        4
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func flatten(root *Node) *Node {\n    curr := root\n\n    for curr != nil {\n        if curr.Child != nil {\n            next := curr.Next // save the current next\n\n            // Find the tail of the child chain\n            tail := curr.Child\n            for tail.Next != nil {\n                tail = tail.Next\n            }\n\n            // Splice child chain between curr and next\n            curr.Next = curr.Child\n            curr.Child.Prev = curr\n            tail.Next = next\n            if next != nil {\n                next.Prev = tail\n            }\n\n            // Clear the child pointer\n            curr.Child = nil\n        }\n        curr = curr.Next\n    }\n\n    return root\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2
      ],
      "init_curr": [
        2
      ],
      "visit_node": [
        4
      ],
      "found_child": [
        5
      ],
      "save_next": [
        6
      ],
      "find_tail": [
        9,
        10,
        11
      ],
      "connect_curr_child": [
        15,
        16
      ],
      "connect_tail_next": [
        17,
        18,
        19
      ],
      "clear_child": [
        23
      ],
      "move_curr": [
        25
      ],
      "complete": [
        28
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "while_curr": [
        4
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public Node Flatten(Node head) {\n    Node curr = head;\n\n    while (curr != null) {\n        if (curr.child != null) {\n            Node next = curr.next; // save the current next\n\n            // Find the tail of the child chain\n            Node tail = curr.child;\n            while (tail.next != null) {\n                tail = tail.next;\n            }\n\n            // Splice child chain between curr and next\n            curr.next = curr.child;\n            curr.child.prev = curr;\n            tail.next = next;\n            if (next != null) {\n                next.prev = tail;\n            }\n\n            // Clear the child pointer\n            curr.child = null;\n        }\n        curr = curr.next;\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2
      ],
      "init_curr": [
        2
      ],
      "visit_node": [
        4
      ],
      "found_child": [
        5
      ],
      "save_next": [
        6
      ],
      "find_tail": [
        9,
        10,
        11
      ],
      "connect_curr_child": [
        15,
        16
      ],
      "connect_tail_next": [
        17,
        18,
        19
      ],
      "clear_child": [
        23
      ],
      "move_curr": [
        25
      ],
      "complete": [
        28
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "while_curr": [
        4
      ]
    }
  }
};

const FlattenAMultilevelDoublyLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (3 levels)",
    "value": {
      "levels": [
        [
          1,
          2,
          3,
          4,
          5,
          6
        ],
        [
          7,
          8,
          9,
          10
        ],
        [
          11,
          12
        ]
      ],
      "childLinks": [
        [
          0,
          2,
          1
        ],
        [
          1,
          1,
          2
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple (2 levels)",
    "value": {
      "levels": [
        [
          1,
          2
        ],
        [
          3
        ]
      ],
      "childLinks": [
        [
          0,
          1,
          1
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Child at head",
    "value": {
      "levels": [
        [
          1,
          2,
          3
        ],
        [
          4,
          5
        ]
      ],
      "childLinks": [
        [
          0,
          0,
          1
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Nested children",
    "value": {
      "levels": [
        [
          1,
          2,
          3
        ],
        [
          4,
          5
        ],
        [
          6
        ]
      ],
      "childLinks": [
        [
          0,
          2,
          1
        ],
        [
          1,
          0,
          2
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Multiple children",
    "value": {
      "levels": [
        [
          1,
          2,
          3,
          4
        ],
        [
          5
        ],
        [
          6,
          7
        ]
      ],
      "childLinks": [
        [
          0,
          1,
          1
        ],
        [
          0,
          2,
          2
        ]
      ]
    }
  }
];

function generateFlattenAMultilevelDoublyLinkedListSteps(e: any): any[] {
  class n{constructor(e){this.val=e,this.prev=null,this.next=null,this.child=null}}function i(e){return null===e?null:`Node(${e.val})`}

let t=e.levels,l=e.childLinks,a=[];for(let e=0;e<t.length;e++){let l=[];for(let r=0;r<t[e].length;r++)l.push(new n(t[e][r]));for(let e=0;e<l.length-1;e++)l[e].next=l[e+1],l[e+1].prev=l[e];a.push(l)}for(let[e,t,r]of l)a[e]&&a[e][t]&&a[r]&&(a[e][t].child=a[r][0]);let c=a[0]?.[0]||null,d=0,u=new Map,o=new Map;for(let e=0;e<a.length;e++)for(let t=0;t<a[e].length;t++){let l=a[e][t];u.set(l,d),o.set(d,l),d++}let s={},h={};for(let e=0;e<t.length;e++)for(let l=0;l<t[e].length;l++){let r=a[e][l],n=u.get(r);s[`node_${e}_${l}`]={type:"arrayElement",value:t[e][l],position:n,state:0===e?"default":"highlight"}}for(let e=0;e<t.length;e++)for(let l=0;l<t[e].length-1;l++){let t=a[e][l],r=a[e][l+1];h[`next_${e}_${l}`]={type:"range",start:u.get(t),end:u.get(r)}}for(let[e,t,r]of l){let l=a[e][t],n=a[r][0];h[`child_${e}_${t}`]={type:"range",start:u.get(l),end:u.get(n),label:"child"}}let p=new Map;for(let e=0;e<a.length;e++)for(let t=0;t<a[e].length;t++)p.set(a[e][t],{level:e,index:t});let v=new StepRecorder({levels:t,childLinks:l,curr:void 0,next:void 0,child:void 0,tail:void 0},{...s,...h,ptr_head:a[0]?.length>0?{type:"pointer",position:0,label:"head"}:void 0}),_=t.map((e,t)=>`L${t}: [${e.join(",")}]`).join(" ");if(v.record("-",`Multilevel list: ${_}`),!c)return v.record("return","Empty list, return head"),v.getSteps();v.record("algo_start","Iterate through list. When child found, insert child list between curr and curr.next");let x=c;for(p.get(x),v.update_variable("curr",i(x)),v.add_new_visual("ptr_curr",{type:"pointer",position:u.get(x),label:"curr"}),v.record("init_curr","Initialize curr = head");null!==x;){v.add_conditional("while_curr",!0);let e=p.get(x),t=u.get(x);if(v.update_visual(`node_${e.level}_${e.index}`,{type:"arrayElement",value:x.val,position:t,state:"active"}),v.record("visit_node",`Visit node ${x.val}`),null!==x.child){let l=x.child;p.get(l);let r=u.get(l);v.update_variable("child",i(l)),v.add_new_visual("ptr_child",{type:"pointer",position:r,label:"child"}),v.update_visual(`child_${e.level}_${e.index}`,{type:"range",start:t,end:r,label:"child",state:"active"}),v.record("found_child",`Found child at node ${x.val}, child is ${l.val}`);let n=x.next;n&&p.get(n);let a=n?u.get(n):null;n?(v.update_variable("next",i(n)),v.add_new_visual("ptr_next",{type:"pointer",position:a,label:"next"}),v.record("save_next",`Save next = ${n.val}`)):(v.update_variable("next",null),v.record("save_next","next is null (curr is at end)"));let c=l;for(;null!==c.next;)c=c.next;p.get(c);let d=u.get(c);v.update_variable("tail",i(c)),v.add_new_visual("ptr_tail",{type:"pointer",position:d,label:"tail"}),v.record("find_tail",`Find tail of child list: ${c.val}`),x.next=l,l.prev=x,v.delete_visual(`child_${e.level}_${e.index}`),n&&v.delete_visual(`next_${e.level}_${e.index}`),v.add_new_visual(`flatten_${t}_${r}`,{type:"range",start:t,end:r}),v.record("connect_curr_child",`${x.val}.next = ${l.val}, ${l.val}.prev = ${x.val}`),null!==n?(c.next=n,n.prev=c,v.add_new_visual(`flatten_${d}_${a}`,{type:"range",start:d,end:a}),v.record("connect_tail_next",`${c.val}.next = ${n.val}, ${n.val}.prev = ${c.val}`)):v.record("connect_tail_next","tail.next stays null"),x.child=null,v.record("clear_child",`${x.val}.child = null`),v.delete_visual("ptr_child"),v.delete_visual("ptr_tail"),n&&v.delete_visual("ptr_next"),v.update_variable("child",null),v.update_variable("next",null),v.update_variable("tail",null)}if(v.update_visual(`node_${e.level}_${e.index}`,{type:"arrayElement",value:x.val,position:t,state:"visited"}),null!==(x=x.next)){p.get(x);let e=u.get(x);v.update_variable("curr",i(x)),v.update_visual("ptr_curr",{type:"pointer",position:e,label:"curr"}),v.record("move_curr",`curr = curr.next (${x.val})`)}else v.update_variable("curr",null),v.delete_visual("ptr_curr"),v.record("move_curr","curr = curr.next (null)")}v.add_conditional("while_curr",!1);for(let e=0;e<a.length;e++)for(let l=0;l<a[e].length;l++){let r=a[e][l],n=u.get(r);v.update_visual(`node_${e}_${l}`,{type:"arrayElement",value:t[e][l],position:n,state:"result"})}return v.record("complete","Flattening complete! All child lists merged into single level"),v.record("return","Return head"),v.getSteps()
}

export function FlattenAMultilevelDoublyLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FlattenAMultilevelDoublyLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFlattenAMultilevelDoublyLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Flatten a Multilevel Doubly Linked List"
      slug="flatten-a-multilevel-doubly-linked-list"
      approaches={approaches}
      presets={FlattenAMultilevelDoublyLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Intersection of Two Linked Lists (intersection-of-two-linked-lists)
// ==========================================

const IntersectionOfTwoLinkedListsTemplates = {
  "python": {
    "language": "python",
    "code": "def getIntersectionNode(headA, headB):\n    pA = headA\n    pB = headB\n\n    # Each pointer traverses both lists, meeting at intersection or null\n    while pA != pB:\n        pA = pA.next if pA else headB\n        pB = pB.next if pB else headA\n\n    return pA",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2,
        3
      ],
      "init_pointers": [
        2,
        3
      ],
      "compare": [
        6
      ],
      "move_pA": [
        2
      ],
      "switch_pA": [
        2
      ],
      "move_pB": [
        3
      ],
      "switch_pB": [
        3
      ],
      "found": [
        10
      ],
      "not_found": [
        10
      ],
      "return": [
        10
      ]
    },
    "conditionalMap": {
      "while_not_equal": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode getIntersectionNode(ListNode headA, ListNode headB) {\n    ListNode pA = headA;\n    ListNode pB = headB;\n\n    // Each pointer traverses both lists, meeting at intersection or null\n    while (pA != pB) {\n        pA = (pA != null) ? pA.next : headB;\n        pB = (pB != null) ? pB.next : headA;\n    }\n\n    return pA;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2,
        3
      ],
      "init_pointers": [
        2,
        3
      ],
      "compare": [
        6
      ],
      "move_pA": [
        7
      ],
      "switch_pA": [
        7
      ],
      "move_pB": [
        8
      ],
      "switch_pB": [
        8
      ],
      "found": [
        11
      ],
      "not_found": [
        11
      ],
      "return": [
        11
      ]
    },
    "conditionalMap": {
      "while_not_equal": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {\n    ListNode* pA = headA;\n    ListNode* pB = headB;\n\n    // Each pointer traverses both lists, meeting at intersection or null\n    while (pA != pB) {\n        pA = (pA != nullptr) ? pA->next : headB;\n        pB = (pB != nullptr) ? pB->next : headA;\n    }\n\n    return pA;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2,
        3
      ],
      "init_pointers": [
        2,
        3
      ],
      "compare": [
        6
      ],
      "move_pA": [
        7
      ],
      "switch_pA": [
        7
      ],
      "move_pB": [
        8
      ],
      "switch_pB": [
        8
      ],
      "found": [
        11
      ],
      "not_found": [
        11
      ],
      "return": [
        11
      ]
    },
    "conditionalMap": {
      "while_not_equal": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function getIntersectionNode(headA, headB) {\n    var pA = headA;\n    var pB = headB;\n\n    // Each pointer traverses both lists, meeting at intersection or null\n    while (pA !== pB) {\n        pA = (pA !== null) ? pA.next : headB;\n        pB = (pB !== null) ? pB.next : headA;\n    }\n\n    return pA;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2,
        3
      ],
      "init_pointers": [
        2,
        3
      ],
      "compare": [
        6
      ],
      "move_pA": [
        7
      ],
      "switch_pA": [
        7
      ],
      "move_pB": [
        8
      ],
      "switch_pB": [
        8
      ],
      "found": [
        11
      ],
      "not_found": [
        11
      ],
      "return": [
        11
      ]
    },
    "conditionalMap": {
      "while_not_equal": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {\n    let pA = headA;\n    let pB = headB;\n\n    // Each pointer traverses both lists, meeting at intersection or null\n    while (pA !== pB) {\n        pA = (pA !== null) ? pA.next : headB;\n        pB = (pB !== null) ? pB.next : headA;\n    }\n\n    return pA;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2,
        3
      ],
      "init_pointers": [
        2,
        3
      ],
      "compare": [
        6
      ],
      "move_pA": [
        7
      ],
      "switch_pA": [
        7
      ],
      "move_pB": [
        8
      ],
      "switch_pB": [
        8
      ],
      "found": [
        11
      ],
      "not_found": [
        11
      ],
      "return": [
        11
      ]
    },
    "conditionalMap": {
      "while_not_equal": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func getIntersectionNode(headA, headB *ListNode) *ListNode {\n    pA := headA\n    pB := headB\n\n    // Each pointer traverses both lists, meeting at intersection or null\n    for pA != pB {\n        if pA != nil {\n            pA = pA.Next\n        } else {\n            pA = headB\n        }\n        if pB != nil {\n            pB = pB.Next\n        } else {\n            pB = headA\n        }\n    }\n\n    return pA\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2,
        3
      ],
      "init_pointers": [
        2,
        3
      ],
      "compare": [
        6
      ],
      "move_pA": [
        7,
        8,
        9,
        10,
        11
      ],
      "switch_pA": [
        7,
        8,
        9,
        10,
        11
      ],
      "move_pB": [
        12,
        13,
        14,
        15,
        16
      ],
      "switch_pB": [
        12,
        13,
        14,
        15,
        16
      ],
      "found": [
        19
      ],
      "not_found": [
        19
      ],
      "return": [
        19
      ]
    },
    "conditionalMap": {
      "while_not_equal": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode GetIntersectionNode(ListNode headA, ListNode headB) {\n    ListNode pA = headA;\n    ListNode pB = headB;\n\n    // Each pointer traverses both lists, meeting at intersection or null\n    while (pA != pB) {\n        pA = (pA != null) ? pA.next : headB;\n        pB = (pB != null) ? pB.next : headA;\n    }\n\n    return pA;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "algo_start": [
        2,
        3
      ],
      "init_pointers": [
        2,
        3
      ],
      "compare": [
        6
      ],
      "move_pA": [
        7
      ],
      "switch_pA": [
        7
      ],
      "move_pB": [
        8
      ],
      "switch_pB": [
        8
      ],
      "found": [
        11
      ],
      "not_found": [
        11
      ],
      "return": [
        11
      ]
    },
    "conditionalMap": {
      "while_not_equal": [
        6
      ]
    }
  }
};

const IntersectionOfTwoLinkedListsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "listA": [
        4,
        1
      ],
      "listB": [
        5,
        6,
        1
      ],
      "intersection": [
        8,
        4,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "listA": [
        1,
        9,
        1
      ],
      "listB": [
        3
      ],
      "intersection": [
        2,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No intersection",
    "value": {
      "listA": [
        2,
        6,
        4
      ],
      "listB": [
        1,
        5
      ],
      "intersection": []
    }
  },
  {
    "id": "ex4",
    "label": "Intersection at head of A",
    "value": {
      "listA": [],
      "listB": [
        4,
        5
      ],
      "intersection": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Simple case",
    "value": {
      "listA": [
        1
      ],
      "listB": [
        2
      ],
      "intersection": [
        3
      ]
    }
  }
];

function generateIntersectionOfTwoLinkedListsSteps(e: any): any[] {
  class i{constructor(e){this.val=e,this.next=null}}function a(e){return null===e?null:`Node(${e.val})`}

let t=e.listA,n=e.listB,l=e.intersection,o=[],s=[],d=[];for(let e of t)o.push(new i(e));for(let e=0;e<o.length-1;e++)o[e].next=o[e+1];for(let e of n)s.push(new i(e));for(let e=0;e<s.length-1;e++)s[e].next=s[e+1];for(let e of l)d.push(new i(e));for(let e=0;e<d.length-1;e++)d[e].next=d[e+1];d.length>0&&(o.length>0&&(o[o.length-1].next=d[0]),s.length>0&&(s[s.length-1].next=d[0]));let u=o.length>0?o[0]:d.length>0?d[0]:null,p=s.length>0?s[0]:d.length>0?d[0]:null,c=t.length,h=n.length,f=l.length,g={},_={},v=new Map,A=new Map;for(let e=0;e<c;e++)g[`nodeA_${e}`]={type:"arrayElement",value:t[e],position:e,state:"default"},v.set(o[e],e),A.set(o[e],`nodeA_${e}`);for(let e=0;e<h;e++){let t=c+e;g[`nodeB_${e}`]={type:"arrayElement",value:n[e],position:t,state:"highlight"},v.set(s[e],t),A.set(s[e],`nodeB_${e}`)}let x=c+h;for(let e=0;e<f;e++){let t=x+e;g[`nodeI_${e}`]={type:"arrayElement",value:l[e],position:t,state:"comparing"},v.set(d[e],t),A.set(d[e],`nodeI_${e}`)}for(let e=0;e<c-1;e++)_[`arrowA_${e}`]={type:"range",start:e,end:e+1};c>0&&f>0&&(_.arrowA_to_I={type:"range",start:c-1,end:x,label:h>0?"merge":void 0});for(let e=0;e<h-1;e++){let t=c+e,n=c+e+1;_[`arrowB_${e}`]={type:"range",start:t,end:n}}h>0&&f>0&&(_.arrowB_to_I={type:"range",start:c+h-1,end:x});for(let e=0;e<f-1;e++)_[`arrowI_${e}`]={type:"range",start:x+e,end:x+e+1};let B=new StepRecorder({listA:t,listB:n,intersection:l,pA:void 0,pB:void 0},{...g,..._,ptr_headA:u?{type:"pointer",position:v.get(u)??0,label:"headA"}:void 0,ptr_headB:p?{type:"pointer",position:v.get(p)??c,label:"headB"}:void 0}),m=c>0?t.join("→"):"",w=h>0?n.join("→"):"",b=f>0?l.join("→"):"none";if(B.record("-",`List A: ${m}${f>0?"→"+b:""}, List B: ${w}${f>0?"→"+b:""}`),!u||!p)return B.record("return","One list is empty, the pointers meet at null"),B.getSteps();B.record("algo_start","Key insight: pA travels A+Intersection+B, pB travels B+Intersection+A. They meet at intersection!");let y=u,N=p;B.update_variable("pA",a(y)),B.update_variable("pB",a(N)),B.add_new_visual("ptr_pA",{type:"pointer",position:v.get(y),label:"pA"}),B.add_new_visual("ptr_pB",{type:"pointer",position:v.get(N),label:"pB"}),B.record("init_pointers",`pA = headA (${y.val}), pB = headB (${N.val})`);let $=!1,j=!1,L=0,M=(c+h+f)*2+5;for(;y!==N&&L<M;){if(L++,B.add_conditional("while_not_equal",!0),y){let e=A.get(y);e&&B.update_visual(e,{type:"arrayElement",value:y.val,position:v.get(y),state:"active"})}if(N&&N!==y){let e=A.get(N);e&&B.update_visual(e,{type:"arrayElement",value:N.val,position:v.get(N),state:"active"})}let e=y?y.val:"null",t=N?N.val:"null";if(B.record("compare",`pA=${e}, pB=${t} → Not equal, continue`),y){let e=A.get(y);if(e){let t=e.startsWith("nodeI_");B.update_visual(e,{type:"arrayElement",value:y.val,position:v.get(y),state:t?"comparing":"visited"})}}if(N&&N!==y){let e=A.get(N);if(e){let t=e.startsWith("nodeI_");B.update_visual(e,{type:"arrayElement",value:N.val,position:v.get(N),state:t?"comparing":"visited"})}}null===y?(y=p,$=!0,B.update_variable("pA",a(y)),B.add_new_visual("ptr_pA",{type:"pointer",position:v.get(y),label:"pA"}),B.record("switch_pA",`pA was null → switch to headB (${y.val})`)):(y=y.next)?(B.update_variable("pA",a(y)),B.update_visual("ptr_pA",{type:"pointer",position:v.get(y),label:"pA"}),B.record("move_pA",`pA = pA.next (${y.val})`)):$||(B.update_variable("pA",null),B.delete_visual("ptr_pA"),B.record("move_pA","pA = null, will switch to headB next")),null===N?(N=u,j=!0,B.update_variable("pB",a(N)),B.add_new_visual("ptr_pB",{type:"pointer",position:v.get(N),label:"pB"}),B.record("switch_pB",`pB was null → switch to headA (${N.val})`)):(N=N.next)?(B.update_variable("pB",a(N)),B.update_visual("ptr_pB",{type:"pointer",position:v.get(N),label:"pB"}),B.record("move_pB",`pB = pB.next (${N.val})`)):j||(B.update_variable("pB",null),B.delete_visual("ptr_pB"),B.record("move_pB","pB = null, will switch to headA next")),null!==y||$||(y=p,$=!0,B.update_variable("pA",a(y)),B.add_new_visual("ptr_pA",{type:"pointer",position:v.get(y),label:"pA"}),B.record("switch_pA",`pA reached end of A → switch to headB (${y.val})`)),null!==N||j||(N=u,j=!0,B.update_variable("pB",a(N)),B.add_new_visual("ptr_pB",{type:"pointer",position:v.get(N),label:"pB"}),B.record("switch_pB",`pB reached end of B → switch to headA (${N.val})`))}if(B.add_conditional("while_not_equal",!1),y===N&&null!==y){let e=A.get(y);e&&B.update_visual(e,{type:"arrayElement",value:y.val,position:v.get(y),state:"result"}),B.record("found",`pA == pB at node ${y.val}! Intersection found!`),B.record("return",`Return node ${y.val}`)}else B.record("not_found","pA == pB == null, no intersection exists"),B.record("return","Return null");return B.getSteps()
}

export function IntersectionOfTwoLinkedListsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IntersectionOfTwoLinkedListsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateIntersectionOfTwoLinkedListsSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Intersection of Two Linked Lists"
      slug="intersection-of-two-linked-lists"
      approaches={approaches}
      presets={IntersectionOfTwoLinkedListsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Add Two Numbers II (add-two-numbers-ii)
// ==========================================

const AddTwoNumbersIiTemplates = {
  "python": {
    "language": "python",
    "code": "def addTwoNumbers(l1, l2):\n    # Reverse both lists to process from least significant digit\n    l1 = reverse(l1)\n    l2 = reverse(l2)\n\n    dummy = ListNode(0)\n    current = dummy\n    carry = 0\n\n    # Add digits one by one\n    while l1 or l2 or carry:\n        total = carry\n        if l1:\n            total += l1.val\n            l1 = l1.next\n        if l2:\n            total += l2.val\n            l2 = l2.next\n        current.next = ListNode(total % 10)\n        carry = total // 10\n        current = current.next\n\n    # Reverse the result to restore most-significant-first order\n    return reverse(dummy.next)\n\ndef reverse(head):\n    prev = None\n    while head:\n        next_node = head.next\n        head.next = prev\n        prev = head\n        head = next_node\n    return prev",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_l1": [
        3
      ],
      "reverse_l2": [
        4
      ],
      "init_add": [
        6,
        7,
        8
      ],
      "get_values": [
        14,
        17
      ],
      "calculate_sum": [
        12
      ],
      "update_carry": [
        20
      ],
      "create_node": [
        19
      ],
      "move_pointers": [
        15,
        18,
        21
      ],
      "reverse_result": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n    // Reverse both lists to process from least significant digit\n    l1 = reverse(l1);\n    l2 = reverse(l2);\n\n    ListNode dummy = new ListNode(0);\n    ListNode current = dummy;\n    int carry = 0;\n\n    // Add digits one by one\n    while (l1 != null || l2 != null || carry != 0) {\n        int sum = carry;\n        if (l1 != null) {\n            sum += l1.val;\n            l1 = l1.next;\n        }\n        if (l2 != null) {\n            sum += l2.val;\n            l2 = l2.next;\n        }\n        current.next = new ListNode(sum % 10);\n        carry = sum / 10;\n        current = current.next;\n    }\n\n    // Reverse the result to restore most-significant-first order\n    return reverse(dummy.next);\n}\n\nprivate ListNode reverse(ListNode head) {\n    ListNode prev = null;\n    while (head != null) {\n        ListNode next = head.next;\n        head.next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_l1": [
        3
      ],
      "reverse_l2": [
        4
      ],
      "init_add": [
        6,
        7,
        8
      ],
      "get_values": [
        14,
        18
      ],
      "calculate_sum": [
        12
      ],
      "update_carry": [
        22
      ],
      "create_node": [
        21
      ],
      "move_pointers": [
        15,
        19,
        23
      ],
      "reverse_result": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    // Reverse both lists to process from least significant digit\n    l1 = reverse(l1);\n    l2 = reverse(l2);\n\n    ListNode dummy(0);\n    ListNode* current = &dummy;\n    int carry = 0;\n\n    // Add digits one by one\n    while (l1 || l2 || carry) {\n        int sum = carry;\n        if (l1) {\n            sum += l1->val;\n            l1 = l1->next;\n        }\n        if (l2) {\n            sum += l2->val;\n            l2 = l2->next;\n        }\n        current->next = new ListNode(sum % 10);\n        carry = sum / 10;\n        current = current->next;\n    }\n\n    // Reverse the result to restore most-significant-first order\n    return reverse(dummy.next);\n}\n\nprivate:\nListNode* reverse(ListNode* head) {\n    ListNode* prev = nullptr;\n    while (head) {\n        ListNode* next = head->next;\n        head->next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_l1": [
        3
      ],
      "reverse_l2": [
        4
      ],
      "init_add": [
        6,
        7,
        8
      ],
      "get_values": [
        14,
        18
      ],
      "calculate_sum": [
        12
      ],
      "update_carry": [
        22
      ],
      "create_node": [
        21
      ],
      "move_pointers": [
        15,
        19,
        23
      ],
      "reverse_result": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {\n    // Reverse both lists to process from least significant digit\n    l1 = Reverse(l1);\n    l2 = Reverse(l2);\n\n    ListNode dummy = new ListNode(0);\n    ListNode current = dummy;\n    int carry = 0;\n\n    // Add digits one by one\n    while (l1 != null || l2 != null || carry != 0) {\n        int sum = carry;\n        if (l1 != null) {\n            sum += l1.val;\n            l1 = l1.next;\n        }\n        if (l2 != null) {\n            sum += l2.val;\n            l2 = l2.next;\n        }\n        current.next = new ListNode(sum % 10);\n        carry = sum / 10;\n        current = current.next;\n    }\n\n    // Reverse the result to restore most-significant-first order\n    return Reverse(dummy.next);\n}\n\nprivate ListNode Reverse(ListNode head) {\n    ListNode prev = null;\n    while (head != null) {\n        ListNode next = head.next;\n        head.next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_l1": [
        3
      ],
      "reverse_l2": [
        4
      ],
      "init_add": [
        6,
        7,
        8
      ],
      "get_values": [
        14,
        18
      ],
      "calculate_sum": [
        12
      ],
      "update_carry": [
        22
      ],
      "create_node": [
        21
      ],
      "move_pointers": [
        15,
        19,
        23
      ],
      "reverse_result": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {\n    // Reverse both lists to process from least significant digit\n    l1 = reverse(l1)\n    l2 = reverse(l2)\n\n    dummy := &ListNode{}\n    current := dummy\n    carry := 0\n\n    // Add digits one by one\n    for l1 != nil || l2 != nil || carry != 0 {\n        sum := carry\n        if l1 != nil {\n            sum += l1.Val\n            l1 = l1.Next\n        }\n        if l2 != nil {\n            sum += l2.Val\n            l2 = l2.Next\n        }\n        current.Next = &ListNode{Val: sum % 10}\n        carry = sum / 10\n        current = current.Next\n    }\n\n    // Reverse the result to restore most-significant-first order\n    return reverse(dummy.Next)\n}\n\nfunc reverse(head *ListNode) *ListNode {\n    var prev *ListNode\n    for head != nil {\n        next := head.Next\n        head.Next = prev\n        prev = head\n        head = next\n    }\n    return prev\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_l1": [
        3
      ],
      "reverse_l2": [
        4
      ],
      "init_add": [
        6,
        7,
        8
      ],
      "get_values": [
        14,
        18
      ],
      "calculate_sum": [
        12
      ],
      "update_carry": [
        22
      ],
      "create_node": [
        21
      ],
      "move_pointers": [
        15,
        19,
        23
      ],
      "reverse_result": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "function addTwoNumbers(l1, l2) {\n    // Reverse both lists to process from least significant digit\n    l1 = reverse(l1);\n    l2 = reverse(l2);\n\n    var dummy = new ListNode(0);\n    var current = dummy;\n    var carry = 0;\n\n    // Add digits one by one\n    while (l1 || l2 || carry) {\n        var sum = carry;\n        if (l1) {\n            sum += l1.val;\n            l1 = l1.next;\n        }\n        if (l2) {\n            sum += l2.val;\n            l2 = l2.next;\n        }\n        current.next = new ListNode(sum % 10);\n        carry = Math.floor(sum / 10);\n        current = current.next;\n    }\n\n    // Reverse the result to restore most-significant-first order\n    return reverse(dummy.next);\n};\n\nfunction reverse(head) {\n    var prev = null;\n    while (head) {\n        var next = head.next;\n        head.next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_l1": [
        3
      ],
      "reverse_l2": [
        4
      ],
      "init_add": [
        6,
        7,
        8
      ],
      "get_values": [
        14,
        18
      ],
      "calculate_sum": [
        12
      ],
      "update_carry": [
        22
      ],
      "create_node": [
        21
      ],
      "move_pointers": [
        15,
        19,
        23
      ],
      "reverse_result": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n    // Reverse both lists to process from least significant digit\n    l1 = reverse(l1);\n    l2 = reverse(l2);\n\n    const dummy = new ListNode(0);\n    let current = dummy;\n    let carry = 0;\n\n    // Add digits one by one\n    while (l1 || l2 || carry) {\n        let sum = carry;\n        if (l1) {\n            sum += l1.val;\n            l1 = l1.next;\n        }\n        if (l2) {\n            sum += l2.val;\n            l2 = l2.next;\n        }\n        current.next = new ListNode(sum % 10);\n        carry = Math.floor(sum / 10);\n        current = current.next;\n    }\n\n    // Reverse the result to restore most-significant-first order\n    return reverse(dummy.next);\n}\n\nfunction reverse(head: ListNode | null): ListNode | null {\n    let prev: ListNode | null = null;\n    while (head) {\n        const next = head.next;\n        head.next = prev;\n        prev = head;\n        head = next;\n    }\n    return prev;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_l1": [
        3
      ],
      "reverse_l2": [
        4
      ],
      "init_add": [
        6,
        7,
        8
      ],
      "get_values": [
        14,
        18
      ],
      "calculate_sum": [
        12
      ],
      "update_carry": [
        22
      ],
      "create_node": [
        21
      ],
      "move_pointers": [
        15,
        19,
        23
      ],
      "reverse_result": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {}
  }
};

const AddTwoNumbersIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "list1": [
        7,
        2,
        4,
        3
      ],
      "list2": [
        5,
        6,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "list1": [
        2,
        4,
        3
      ],
      "list2": [
        5,
        6,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "list1": [
        0
      ],
      "list2": [
        0
      ]
    }
  }
];

function generateAddTwoNumbersIiSteps(e: any): any[] {
  class n{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}

let t=e.list1,r=e.list2,a={};t.forEach((e,t)=>{a[`list1_node_${t}`]={type:"arrayElement",value:e,position:t,row:0}});for(let e=0;e<t.length-1;e++)a[`list1_arrow_${e}`]={type:"range",start:e,end:e+1,row:0};r.forEach((e,t)=>{a[`list2_node_${t}`]={type:"arrayElement",value:e,position:t,row:1}});for(let e=0;e<r.length-1;e++)a[`list2_arrow_${e}`]={type:"range",start:e,end:e+1,row:1};let s=new StepRecorder({carry:0},{...a});s.record("-","Start: two linked lists representing numbers in forward order");let i=t.length,o=[...t].reverse();for(let e=0;e<i;e++)s.update_visual(`list1_node_${e}`,{type:"arrayElement",value:t[e],position:e,row:0,state:"highlight"});for(let e=0;e<i;e++)s.update_visual(`list1_node_${e}`,{type:"arrayElement",value:o[e],position:e,row:0,state:"default"});s.record("reverse_l1",`Reverse l1: [${t.join(", ")}] → [${o.join(", ")}]`);let d=r.length,u=[...r].reverse();for(let e=0;e<d;e++)s.update_visual(`list2_node_${e}`,{type:"arrayElement",value:r[e],position:e,row:1,state:"highlight"});for(let e=0;e<d;e++)s.update_visual(`list2_node_${e}`,{type:"arrayElement",value:u[e],position:e,row:1,state:"default"});s.record("reverse_l2",`Reverse l2: [${r.join(", ")}] → [${u.join(", ")}]`);let p=null,c=[];if(o.length>0){p=new n(o[0]),c.push(p);let e=p;for(let t=1;t<o.length;t++)e.next=new n(o[t]),e=e.next,c.push(e)}let h=null,v=[];if(u.length>0){h=new n(u[0]),v.push(h);let e=h;for(let t=1;t<u.length;t++)e.next=new n(u[t]),e=e.next,v.push(e)}let m=new n(0),_=[m];s.add_new_visual("result_node_-1",{type:"arrayElement",value:0,position:-1,row:2,state:"inactive"});let y=p,f=h,g=m,x=0;null!==y&&s.add_new_visual("ptr_p",{type:"pointer",position:0,label:"l1",row:0}),null!==f&&s.add_new_visual("ptr_q",{type:"pointer",position:0,label:"l2",row:1}),s.add_new_visual("ptr_current",{type:"pointer",position:-1,label:"current",row:2}),s.update_variable("carry",x),s.record("init_add","dummy anchors the result, current = dummy, carry = 0");let w=0;for(;null!==y||null!==f||0!==x;){let e=null!==y?y.val:0,t=null!==f?f.val:0;if(null!==y){let e=c.indexOf(y);s.update_visual(`list1_node_${e}`,{type:"arrayElement",value:y.val,position:e,row:0,state:"active"})}if(null!==f){let e=v.indexOf(f);s.update_visual(`list2_node_${e}`,{type:"arrayElement",value:f.val,position:e,row:1,state:"active"})}s.record("get_values",`Add the available digits ${e} and ${t} into sum`);let r=x+e+t;s.update_variable("sum",r),s.record("calculate_sum",`sum = ${x} + ${e} + ${t} = ${r}`),x=Math.floor(r/10),s.update_variable("carry",x),s.record("update_carry",`Update carry: ${x}`);let l=new n(r%10);if(g.next=l,_.push(l),s.add_new_visual(`result_node_${w}`,{type:"arrayElement",value:r%10,position:w,row:2,state:"sorted"}),s.add_new_visual(`result_arrow_${w-1}`,{type:"range",start:w-1,end:w,row:2}),s.record("create_node",`Create result node with value ${r%10}`),null!==y){let e=c.indexOf(y);s.update_visual(`list1_node_${e}`,{type:"arrayElement",value:y.val,position:e,row:0,state:"visited"})}if(null!==f){let e=v.indexOf(f);s.update_visual(`list2_node_${e}`,{type:"arrayElement",value:f.val,position:e,row:1,state:"visited"})}if(g=g.next,s.update_visual("ptr_current",{type:"pointer",position:w,label:"current",row:2}),null!==y&&null!==(y=y.next)){let e=c.indexOf(y);s.update_visual("ptr_p",{type:"pointer",position:e,label:"l1",row:0})}if(null!==f&&null!==(f=f.next)){let e=v.indexOf(f);s.update_visual("ptr_q",{type:"pointer",position:e,label:"l2",row:1})}s.record("move_pointers","Advance l1 and l2 past the digits just used, then advance current"),w++}s.delete_visual("result_node_-1"),s.delete_visual("result_arrow_-1"),s.delete_visual("ptr_p"),s.delete_visual("ptr_q"),s.delete_visual("ptr_current");let N=[],b=m.next;for(;null!==b;)N.push(b.val),b=b.next;let L=[...N].reverse();for(let e=-1;e<w-1;e++)s.delete_visual(`result_arrow_${e}`);for(let e=0;e<L.length;e++)s.update_visual(`result_node_${e}`,{type:"arrayElement",value:L[e],position:e,row:2,state:"active"});for(let e=0;e<L.length-1;e++)s.add_new_visual(`result_rev_arrow_${e}`,{type:"range",start:e,end:e+1,row:2});return s.record("reverse_result",`Reverse result: [${N.join(", ")}] → [${L.join(", ")}]`),s.record("complete",`Done! Result: [${L.join(", ")}]`),s.getSteps()
}

export function AddTwoNumbersIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AddTwoNumbersIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAddTwoNumbersIiSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Add Two Numbers II"
      slug="add-two-numbers-ii"
      approaches={approaches}
      presets={AddTwoNumbersIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Convert Sorted List to Binary Search Tree (convert-sorted-list-to-binary-search-tree)
// ==========================================

const ConvertSortedListToBinarySearchTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def sortedListToBST(self, head: ListNode) -> TreeNode:\n        # Count the total number of nodes\n        size = 0\n        node = head\n        while node:\n            size += 1\n            node = node.next\n\n        self.current = head\n\n        def build(left: int, right: int) -> TreeNode:\n            if left > right:\n                return None\n\n            mid = left + (right - left) // 2\n\n            # Build left subtree first (this advances 'current' through the list)\n            left_child = build(left, mid - 1)\n\n            # Current list node is the root of this subtree\n            root = TreeNode(self.current.val)\n            self.current = self.current.next\n\n            # Build right subtree\n            root.left = left_child\n            root.right = build(mid + 1, right)\n\n            return root\n\n        return build(0, size - 1)",
    "lineMap": {
      "-": [
        2
      ],
      "count_size": [
        4,
        5,
        6,
        7,
        8
      ],
      "call_build": [
        31
      ],
      "check_range": [
        12,
        13
      ],
      "base_case": [
        13,
        14
      ],
      "calc_mid": [
        16
      ],
      "build_left": [
        19
      ],
      "create_node": [
        22
      ],
      "advance_current": [
        23
      ],
      "build_right": [
        27
      ],
      "return_node": [
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "base_case": [
        13
      ],
      "has_left": [
        19
      ],
      "has_right": [
        27
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private ListNode current;\n\n    public TreeNode sortedListToBST(ListNode head) {\n        // Count the total number of nodes\n        int size = 0;\n        ListNode node = head;\n        while (node != null) {\n            size++;\n            node = node.next;\n        }\n\n        current = head;\n        return build(0, size - 1);\n    }\n\n    private TreeNode build(int left, int right) {\n        if (left > right) {\n            return null;\n        }\n\n        int mid = left + (right - left) / 2;\n\n        // Build left subtree first (this advances 'current' through the list)\n        TreeNode leftChild = build(left, mid - 1);\n\n        // Current list node is the root of this subtree\n        TreeNode root = new TreeNode(current.val);\n        current = current.next;\n\n        // Build right subtree\n        root.left = leftChild;\n        root.right = build(mid + 1, right);\n\n        return root;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        4
      ],
      "count_size": [
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "call_build": [
        14
      ],
      "check_range": [
        17,
        18
      ],
      "base_case": [
        18,
        19
      ],
      "calc_mid": [
        22
      ],
      "build_left": [
        25
      ],
      "create_node": [
        28
      ],
      "advance_current": [
        29
      ],
      "build_right": [
        33
      ],
      "return_node": [
        35
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "base_case": [
        18
      ],
      "has_left": [
        25
      ],
      "has_right": [
        33
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    TreeNode* sortedListToBST(ListNode* head) {\n        // Count the total number of nodes\n        int size = 0;\n        ListNode* node = head;\n        while (node) {\n            size++;\n            node = node->next;\n        }\n\n        current = head;\n        return build(0, size - 1);\n    }\n\nprivate:\n    ListNode* current;\n\n    TreeNode* build(int left, int right) {\n        if (left > right) {\n            return nullptr;\n        }\n\n        int mid = left + (right - left) / 2;\n\n        // Build left subtree first (this advances 'current' through the list)\n        TreeNode* leftChild = build(left, mid - 1);\n\n        // Current list node is the root of this subtree\n        TreeNode* root = new TreeNode(current->val);\n        current = current->next;\n\n        // Build right subtree\n        root->left = leftChild;\n        root->right = build(mid + 1, right);\n\n        return root;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "count_size": [
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "call_build": [
        13
      ],
      "check_range": [
        19,
        20
      ],
      "base_case": [
        20,
        21
      ],
      "calc_mid": [
        24
      ],
      "build_left": [
        27
      ],
      "create_node": [
        30
      ],
      "advance_current": [
        31
      ],
      "build_right": [
        35
      ],
      "return_node": [
        37
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "base_case": [
        20
      ],
      "has_left": [
        27
      ],
      "has_right": [
        35
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private ListNode current;\n\n    public TreeNode SortedListToBST(ListNode head) {\n        // Count the total number of nodes\n        int size = 0;\n        ListNode node = head;\n        while (node != null) {\n            size++;\n            node = node.next;\n        }\n\n        current = head;\n        return Build(0, size - 1);\n    }\n\n    private TreeNode Build(int left, int right) {\n        if (left > right) {\n            return null;\n        }\n\n        int mid = left + (right - left) / 2;\n\n        // Build left subtree first (this advances 'current' through the list)\n        TreeNode leftChild = Build(left, mid - 1);\n\n        // Current list node is the root of this subtree\n        TreeNode root = new TreeNode(current.val);\n        current = current.next;\n\n        // Build right subtree\n        root.left = leftChild;\n        root.right = Build(mid + 1, right);\n\n        return root;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        4
      ],
      "count_size": [
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "call_build": [
        14
      ],
      "check_range": [
        17,
        18
      ],
      "base_case": [
        18,
        19
      ],
      "calc_mid": [
        22
      ],
      "build_left": [
        25
      ],
      "create_node": [
        28
      ],
      "advance_current": [
        29
      ],
      "build_right": [
        33
      ],
      "return_node": [
        35
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "base_case": [
        18
      ],
      "has_left": [
        25
      ],
      "has_right": [
        33
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "var current *ListNode\n\nfunc sortedListToBST(head *ListNode) *TreeNode {\n    // Count the total number of nodes\n    size := 0\n    node := head\n    for node != nil {\n        size++\n        node = node.Next\n    }\n\n    current = head\n    return build(0, size-1)\n}\n\nfunc build(left int, right int) *TreeNode {\n    if left > right {\n        return nil\n    }\n\n    mid := left + (right-left)/2\n\n    // Build left subtree first (this advances 'current' through the list)\n    leftChild := build(left, mid-1)\n\n    // Current list node is the root of this subtree\n    root := &TreeNode{Val: current.Val}\n    current = current.Next\n\n    // Build right subtree\n    root.Left = leftChild\n    root.Right = build(mid+1, right)\n\n    return root\n}",
    "lineMap": {
      "-": [
        3
      ],
      "count_size": [
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "call_build": [
        13
      ],
      "check_range": [
        16,
        17
      ],
      "base_case": [
        17,
        18
      ],
      "calc_mid": [
        21
      ],
      "build_left": [
        24
      ],
      "create_node": [
        27
      ],
      "advance_current": [
        28
      ],
      "build_right": [
        32
      ],
      "return_node": [
        34
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "base_case": [
        17
      ],
      "has_left": [
        24
      ],
      "has_right": [
        32
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var sortedListToBST = function (head) {\n  // Count the total number of nodes\n  let size = 0;\n  let node = head;\n  while (node) {\n    size++;\n    node = node.next;\n  }\n\n  let current = head;\n\n  function build(left, right) {\n    if (left > right) {\n      return null;\n    }\n\n    const mid = left + Math.floor((right - left) / 2);\n\n    // Build left subtree first (this advances 'current' through the list)\n    const leftChild = build(left, mid - 1);\n\n    // Current list node is the root of this subtree\n    const root = new TreeNode(current.val);\n    current = current.next;\n\n    // Build right subtree\n    root.left = leftChild;\n    root.right = build(mid + 1, right);\n\n    return root;\n  }\n\n  return build(0, size - 1);\n};",
    "lineMap": {
      "-": [
        1
      ],
      "count_size": [
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "call_build": [
        33
      ],
      "check_range": [
        12,
        13
      ],
      "base_case": [
        13,
        14
      ],
      "calc_mid": [
        17
      ],
      "build_left": [
        20
      ],
      "create_node": [
        23
      ],
      "advance_current": [
        24
      ],
      "build_right": [
        28
      ],
      "return_node": [
        30
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "base_case": [
        13
      ],
      "has_left": [
        20
      ],
      "has_right": [
        28
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sortedListToBST(head: ListNode | null): TreeNode | null {\n    // Count the total number of nodes\n    let size = 0;\n    let node = head;\n    while (node) {\n        size++;\n        node = node.next;\n    }\n\n    let current = head;\n\n    function build(left: number, right: number): TreeNode | null {\n        if (left > right) {\n            return null;\n        }\n\n        const mid = left + Math.floor((right - left) / 2);\n\n        // Build left subtree first (this advances 'current' through the list)\n        const leftChild = build(left, mid - 1);\n\n        // Current list node is the root of this subtree\n        const root = new TreeNode(current!.val);\n        current = current!.next;\n\n        // Build right subtree\n        root.left = leftChild;\n        root.right = build(mid + 1, right);\n\n        return root;\n    }\n\n    return build(0, size - 1);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_size": [
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "call_build": [
        33
      ],
      "check_range": [
        12,
        13
      ],
      "base_case": [
        13,
        14
      ],
      "calc_mid": [
        17
      ],
      "build_left": [
        20
      ],
      "create_node": [
        23
      ],
      "advance_current": [
        24
      ],
      "build_right": [
        28
      ],
      "return_node": [
        30
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "base_case": [
        13
      ],
      "has_left": [
        20
      ],
      "has_right": [
        28
      ]
    }
  }
};

const ConvertSortedListToBinarySearchTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
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
    "label": "Longer",
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
  }
];

function generateConvertSortedListToBinarySearchTreeSteps(e: any): any[] {
  

let t=e.nums||[],l=t.length,a={};t.forEach((e,t)=>{a[`list_${t}`]={type:"arrayElement",value:e,position:t}});let i=new RecursiveStepRecorder({size:l},a);if(i.pushCallFrame({size:l},"sortedListToBST"),i.add_new_visual("meta_range",{type:"metadata",value:null}),i.add_new_visual("meta_curr",{type:"metadata",value:{curr:0}}),i.record("-","Start: convert a sorted linked list into a height-balanced BST"),0===l)return i.record("complete","Empty list, return null"),i.popCallFrame(),i.getSteps();let n=0;i.add_new_visual("ptr_current",{type:"pointer",position:0,label:"current"}),i.record("count_size",`List has ${l} nodes. Set current pointer to the head`);let o=0,d=(e,t,l,r,a,n)=>{i.update_visual("meta_range",{type:"metadata",value:{left:e,right:t,mid:l,depth:r,phase:a,newNode:n??null}})},s=(e,t,l,r,a,n)=>{i.update_visual(`frame_${e}`,{type:"metadata",state:t,value:{left:l,right:r,side:a,phase:n}})},u=(e,t,l,r,a,n)=>{i.update_visual(e,{type:"binaryTreeNode",value:t,parent:l,isLeftChild:r,state:n,label:String(a)})};return i.record("call_build",`Call build(0, ${l-1}) over the list indices`),!function e(r,a,c,h,f,p){i.pushCallFrame({left:r,right:a},"build");for(let e=0;e<c;e++){let t=i.get_visual(`frame_${e}`);t&&"metadata"===t.type&&i.update_visual(`frame_${e}`,{...t,state:"waiting"})}s(c,"active",r,a,h,"enter"),d(r,a,null,c,"enter"),i.record("check_range",`build(${r}, ${a}) — pick the middle as this subtree's root`);let g=r>a;if(i.add_conditional("base_case",g),g)return d(r,a,null,c,"base"),s(c,"done",r,a,h,"base"),i.record("base_case",`left (${r}) > right (${a}) → empty subtree (null)`),i.popCallFrame(),null;let m=r+Math.floor((a-r)/2);d(r,a,m,c,"mid"),i.record("calc_mid",`mid = ${m} → list[${m}] becomes this root`);let _=r<=m-1;i.add_conditional("has_left",_);let b=null;_&&(d(r,a,m,c,"left"),i.record("build_left",`Build LEFT subtree from [${r}, ${m-1}] first (consumes smaller values)`),b=e(r,m-1,c+1,"L",void 0,void 0),i.delete_visual(`frame_${c+1}`));let v=o++,x=`node_${v}`,y=t[n],w=n;if(u(x,y,void 0!==f?`node_${f}`:void 0,p,w,"new"),null!==b){let e=i.get_visual(`node_${b}`);e&&"binaryTreeNode"===e.type&&i.update_visual(`node_${b}`,{...e,parent:x,isLeftChild:!0})}if(d(r,a,m,c,"create",x),s(c,"active",r,a,h,"create"),i.record("create_node",`current is at list[${w}] = ${y} → create this node`),u(x,y,void 0!==f?`node_${f}`:void 0,p,w,"active"),null!==b){let e=i.get_visual(`node_${b}`);e&&"binaryTreeNode"===e.type&&i.update_visual(`node_${b}`,{...e,state:"done"})}n++,i.update_visual("meta_curr",{type:"metadata",value:{curr:n}}),n<l?i.update_visual("ptr_current",{type:"pointer",position:n,label:"current"}):i.delete_visual("ptr_current"),d(r,a,m,c,"advance",x),i.record("advance_current",n<l?`Advance current to list[${n}] = ${t[n]}`:"Advance current (end of list)");let T=m+1<=a;return i.add_conditional("has_right",T),T&&(d(r,a,m,c,"right",x),i.record("build_right",`Build RIGHT subtree from [${m+1}, ${a}] (consumes larger values)`),e(m+1,a,c+1,"R",v,!1),i.delete_visual(`frame_${c+1}`),u(x,y,void 0!==f?`node_${f}`:void 0,p,w,"active")),u(x,y,void 0!==f?`node_${f}`:void 0,p,w,"done"),d(r,a,m,c,"return",x),s(c,"done",r,a,h,"return"),i.record("return_node",`Subtree rooted at ${y} is complete → return it`),i.popCallFrame(),v}(0,l-1,0,"root"),i.update_visual("meta_range",{type:"metadata",value:null}),i.record("complete","Height-balanced BST complete — its in-order reads back the sorted list"),i.popCallFrame(),i.getSteps()
}

export function ConvertSortedListToBinarySearchTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ConvertSortedListToBinarySearchTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateConvertSortedListToBinarySearchTreeSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Convert Sorted List to Binary Search Tree"
      slug="convert-sorted-list-to-binary-search-tree"
      approaches={approaches}
      presets={ConvertSortedListToBinarySearchTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Delete the Middle Node of a Linked List (delete-the-middle-node-of-a-linked-list)
// ==========================================

const DeleteTheMiddleNodeOfALinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "def deleteMiddle(head):\n    # Edge case: single node\n    if not head.next:\n        return None\n\n    # slow starts at head, fast starts two ahead\n    slow = head\n    fast = head.next.next\n\n    # Move slow by 1 and fast by 2\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n\n    # slow.next is the middle node, delete it\n    slow.next = slow.next.next\n    return head",
    "lineMap": {
      "-": [
        1
      ],
      "edge_case": [
        3
      ],
      "initialize": [
        7,
        8
      ],
      "check_fast": [
        11
      ],
      "move_pointers": [
        12,
        13
      ],
      "found_middle": [
        16
      ],
      "delete_middle": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_fast": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode deleteMiddle(ListNode head) {\n    // Edge case: single node\n    if (head.next == null) return null;\n\n    // slow starts at head, fast starts two ahead\n    ListNode slow = head;\n    ListNode fast = head.next.next;\n\n    // Move slow by 1 and fast by 2\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    // slow.next is the middle node, delete it\n    slow.next = slow.next.next;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "edge_case": [
        3
      ],
      "initialize": [
        6,
        7
      ],
      "check_fast": [
        10
      ],
      "move_pointers": [
        11,
        12
      ],
      "found_middle": [
        16
      ],
      "delete_middle": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_fast": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* deleteMiddle(ListNode* head) {\n    // Edge case: single node\n    if (!head->next) return nullptr;\n\n    // slow starts at head, fast starts two ahead\n    ListNode* slow = head;\n    ListNode* fast = head->next->next;\n\n    // Move slow by 1 and fast by 2\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n\n    // slow.next is the middle node, delete it\n    slow->next = slow->next->next;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "edge_case": [
        3
      ],
      "initialize": [
        6,
        7
      ],
      "check_fast": [
        10
      ],
      "move_pointers": [
        11,
        12
      ],
      "found_middle": [
        16
      ],
      "delete_middle": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_fast": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode DeleteMiddle(ListNode head) {\n    // Edge case: single node\n    if (head.next == null) return null;\n\n    // slow starts at head, fast starts two ahead\n    ListNode slow = head;\n    ListNode fast = head.next.next;\n\n    // Move slow by 1 and fast by 2\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    // slow.next is the middle node, delete it\n    slow.next = slow.next.next;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "edge_case": [
        3
      ],
      "initialize": [
        6,
        7
      ],
      "check_fast": [
        10
      ],
      "move_pointers": [
        11,
        12
      ],
      "found_middle": [
        16
      ],
      "delete_middle": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_fast": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func deleteMiddle(head *ListNode) *ListNode {\n    // Edge case: single node\n    if head.Next == nil {\n        return nil\n    }\n\n    // slow starts at head, fast starts two ahead\n    slow := head\n    fast := head.Next.Next\n\n    // Move slow by 1 and fast by 2\n    for fast != nil && fast.Next != nil {\n        slow = slow.Next\n        fast = fast.Next.Next\n    }\n\n    // slow.Next is the middle node, delete it\n    slow.Next = slow.Next.Next\n    return head\n}",
    "lineMap": {
      "-": [
        1
      ],
      "edge_case": [
        3
      ],
      "initialize": [
        8,
        9
      ],
      "check_fast": [
        12
      ],
      "move_pointers": [
        13,
        14
      ],
      "found_middle": [
        18
      ],
      "delete_middle": [
        18
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_fast": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function deleteMiddle(head) {\n    // Edge case: single node\n    if (!head.next) return null;\n\n    // slow starts at head, fast starts two ahead\n    var slow = head;\n    var fast = head.next.next;\n\n    // Move slow by 1 and fast by 2\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    // slow.next is the middle node, delete it\n    slow.next = slow.next.next;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "edge_case": [
        3
      ],
      "initialize": [
        6,
        7
      ],
      "check_fast": [
        10
      ],
      "move_pointers": [
        11,
        12
      ],
      "found_middle": [
        16
      ],
      "delete_middle": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_fast": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function deleteMiddle(head: ListNode | null): ListNode | null {\n    // Edge case: single node\n    if (!head || !head.next) return null;\n\n    // slow starts at head, fast starts two ahead\n    let slow: ListNode = head;\n    let fast: ListNode | null = head.next.next;\n\n    // Move slow by 1 and fast by 2\n    while (fast && fast.next) {\n        slow = slow.next!;\n        fast = fast.next.next;\n    }\n\n    // slow.next is the middle node, delete it\n    slow.next = slow.next!.next;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "edge_case": [
        3
      ],
      "initialize": [
        6,
        7
      ],
      "check_fast": [
        10
      ],
      "move_pointers": [
        11,
        12
      ],
      "found_middle": [
        16
      ],
      "delete_middle": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_fast": [
        10
      ]
    }
  }
};

const DeleteTheMiddleNodeOfALinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Odd Length",
    "value": {
      "values": [
        1,
        3,
        4,
        7,
        1,
        2,
        6
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Even Length",
    "value": {
      "values": [
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Two Nodes",
    "value": {
      "values": [
        2,
        1
      ]
    }
  }
];

function generateDeleteTheMiddleNodeOfALinkedListSteps(e: any): any[] {
  class a{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}

let t=e.values,n=null;if(t.length>0){let e=n=new a(t[0]);for(let n=1;n<t.length;n++)e.next=new a(t[n]),e=e.next}let i={};t.forEach((e,t)=>{i[`node_${t}`]={type:"arrayElement",value:e,position:t}});for(let e=0;e<t.length-1;e++)i[`arrow_${e}`]={type:"range",start:e,end:e+1};i.ptr_head={type:"pointer",position:0,label:"head"};let o=new StepRecorder({values:t},i);if(o.record("-","Start: Delete the middle node of a linked list"),null===n||null===n.next)return o.add_new_visual("ptr_slow",{type:"pointer",position:0,label:"slow"}),o.update_visual("node_0",{type:"arrayElement",value:t[0],position:0,state:"error"}),o.record("edge_case","Only one node, return null (delete the only node)"),o.delete_visual("node_0"),o.delete_visual("ptr_head"),o.delete_visual("ptr_slow"),o.record("complete","Done! The list is now empty"),o.getSteps();let d=n,r=n.next.next,s=0,u=null!==r?2:null;for(o.add_new_visual("ptr_slow",{type:"pointer",position:0,label:"slow"}),null!==r&&o.add_new_visual("ptr_fast",{type:"pointer",position:2,label:"fast"}),o.update_visual(`node_${s}`,{type:"arrayElement",value:t[s],position:s,state:"active"}),null!==u&&o.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u,state:"comparing"}),o.record("initialize",`Initialize slow = head (${d.val}), fast = head.next.next (${r?.val??"null"})`);null!==r&&null!==r.next;){if(o.add_conditional("check_fast",!0),o.update_visual(`node_${s}`,{type:"arrayElement",value:t[s],position:s}),null!==u&&o.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u}),d=d.next,r=r.next.next,s++,null!==r){let e=n,t=0;for(;null!==e&&e!==r;)e=e.next,t++;u=t}else u=null;o.update_visual("ptr_slow",{type:"pointer",position:s,label:"slow"}),null!==u?o.update_visual("ptr_fast",{type:"pointer",position:u,label:"fast"}):o.delete_visual("ptr_fast"),o.update_visual(`node_${s}`,{type:"arrayElement",value:t[s],position:s,state:"active"}),null!==u&&o.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u,state:"comparing"}),o.record("move_pointers",`Move slow to ${d.val} (index ${s}), fast to ${r?.val??"null"}${null!==u?` (index ${u})`:""}`)}o.add_conditional("check_fast",!1),o.record("check_fast",`fast is ${null===r?"null":`${r.val} with fast.next = null`}, loop ends`);let c=s+1,p=t[c];o.update_visual(`node_${c}`,{type:"arrayElement",value:p,position:c,state:"error"}),o.record("found_middle",`slow.next is node ${p} at index ${c}, this is the middle node to delete`),o.delete_visual(`node_${c}`),o.delete_visual(`arrow_${c-1}`),c<t.length-1&&o.delete_visual(`arrow_${c}`);for(let e=c+1;e<t.length;e++)o.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:e-1,state:"sorted"}),e<t.length-1&&o.update_visual(`arrow_${e}`,{type:"range",start:e-1,end:e});c<t.length-1&&o.add_new_visual("arrow_skip",{type:"range",start:s,end:s+1}),null!==u&&o.delete_visual("ptr_fast"),o.record("delete_middle",`Delete middle node: slow.next = slow.next.next (skip over ${p})`);for(let e=0;e<t.length;e++){if(e===c)continue;let n=e<c?e:e-1;o.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:n,state:"sorted"})}return o.delete_visual("ptr_slow"),o.record("complete","Done! Middle node deleted, return head"),o.getSteps()
}

export function DeleteTheMiddleNodeOfALinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DeleteTheMiddleNodeOfALinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDeleteTheMiddleNodeOfALinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Delete the Middle Node of a Linked List"
      slug="delete-the-middle-node-of-a-linked-list"
      approaches={approaches}
      presets={DeleteTheMiddleNodeOfALinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Delete Node in a Linked List (delete-node-in-a-linked-list)
// ==========================================

const DeleteNodeInALinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "def deleteNode(node):\n    # Copy the next node's value into the current node\n    node.val = node.next.val\n    # Skip the next node by pointing past it\n    node.next = node.next.next",
    "lineMap": {
      "-": [
        1
      ],
      "copy_value": [
        3
      ],
      "unlink_next": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public void deleteNode(ListNode node) {\n    // Copy the next node's value into the current node\n    node.val = node.next.val;\n    // Skip the next node by pointing past it\n    node.next = node.next.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "copy_value": [
        3
      ],
      "unlink_next": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "void deleteNode(ListNode* node) {\n    // Copy the next node's value into the current node\n    node->val = node->next->val;\n    // Skip the next node by pointing past it\n    node->next = node->next->next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "copy_value": [
        3
      ],
      "unlink_next": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func deleteNode(node *ListNode) {\n    // Copy the next node's value into the current node\n    node.Val = node.Next.Val\n    // Skip the next node by pointing past it\n    node.Next = node.Next.Next\n}",
    "lineMap": {
      "-": [
        1
      ],
      "copy_value": [
        3
      ],
      "unlink_next": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "function deleteNode(node) {\n  // Copy the next node's value into the current node\n  node.val = node.next.val;\n  // Skip the next node by pointing past it\n  node.next = node.next.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "copy_value": [
        3
      ],
      "unlink_next": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function deleteNode(node: ListNode | null): void {\n    // Copy the next node's value into the current node\n    node.val = node.next.val;\n    // Skip the next node by pointing past it\n    node.next = node.next.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "copy_value": [
        3
      ],
      "unlink_next": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public void DeleteNode(ListNode node) {\n    // Copy the next node's value into the current node\n    node.val = node.next.val;\n    // Skip the next node by pointing past it\n    node.next = node.next.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "copy_value": [
        3
      ],
      "unlink_next": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  }
};

const DeleteNodeInALinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Delete at Head",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "deletePosition": 0
    }
  },
  {
    "id": "ex2",
    "label": "Delete at Tail",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "deletePosition": 4
    }
  },
  {
    "id": "ex3",
    "label": "Delete in Middle",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "deletePosition": 2
    }
  }
];

function generateDeleteNodeInALinkedListSteps(e: any): any[] {
  

let t=[...e.values],n=e.deletePosition,l=t.length;if(0===l){let e=new StepRecorder({values:t,deletePosition:n},{});return e.record("-","List is empty, nothing to delete"),e.getSteps()}if(n<0||n>=l){let e=new StepRecorder({values:t,deletePosition:n},{});return e.record("-",`Invalid position ${n}. Valid range is 0 to ${l-1}`),e.getSteps()}let i={};t.forEach((e,t)=>{i[`node_${t}`]={type:"arrayElement",value:e,position:t,state:"default"}});for(let e=0;e<l-1;e++)i[`arrow_${e}`]={type:"range",start:e,end:e+1};let a=new StepRecorder({values:t,deletePosition:n},{...i,ptr_head:{type:"pointer",position:0,label:"head"}});if(n===l-1)return a.record("-",`Position ${n} is the tail. This approach needs a next node to copy from, and the problem guarantees the given node is never the tail`),a.getSteps();a.record("-",`Delete the node at position ${n} (value ${t[n]}). Only this node is given, not the head`),a.update_visual(`node_${n}`,{type:"arrayElement",value:t[n],position:n,state:"error"}),a.add_new_visual("ptr_node",{type:"pointer",position:n,label:"node"}),a.update_visual(`node_${n+1}`,{type:"arrayElement",value:t[n+1],position:n+1,state:"comparing"}),a.update_visual(`node_${n}`,{type:"arrayElement",value:t[n+1],position:n,state:"active"}),a.record("copy_value",`node.val = node.next.val: ${t[n]} is overwritten with ${t[n+1]}`),a.delete_visual(`node_${n+1}`),a.delete_visual(`arrow_${n}`),n+1<l-1&&a.delete_visual(`arrow_${n+1}`),a.record("unlink_next",`node.next = node.next.next: the duplicate at position ${n+1} is skipped`);let o=[];for(let e=0;e<l;e++)e===n?o.push(t[n+1]):e!==n+1&&o.push(t[e]);for(let e=0;e<l;e++)a.delete_visual(`node_${e}`);for(let e=0;e<l-1;e++)a.delete_visual(`arrow_${e}`);o.forEach((e,t)=>{a.add_new_visual(`final_node_${t}`,{type:"arrayElement",value:e,position:t,state:"sorted"})});for(let e=0;e<o.length-1;e++)a.add_new_visual(`final_arrow_${e}`,{type:"range",start:e,end:e+1});return a.delete_visual("ptr_node"),a.record("complete",`Deletion complete! ${t[n]} is gone in O(1) without ever touching the head`),a.getSteps()
}

export function DeleteNodeInALinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DeleteNodeInALinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDeleteNodeInALinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Delete Node in a Linked List"
      slug="delete-node-in-a-linked-list"
      approaches={approaches}
      presets={DeleteNodeInALinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design Linked List (design-linked-list)
// ==========================================

const DesignLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "class Node:\n    def __init__(self, val=0):\n        self.val = val\n        self.next = None\n\nclass MyLinkedList:\n    def __init__(self):\n        self.sentinel = Node(0)\n        self.size = 0\n\n    def get(self, index: int) -> int:\n        if index < 0 or index >= self.size:\n            return -1\n        current = self.sentinel.next\n        for _ in range(index):\n            current = current.next\n        return current.val\n\n    def addAtHead(self, val: int) -> None:\n        self.addAtIndex(0, val)\n\n    def addAtTail(self, val: int) -> None:\n        self.addAtIndex(self.size, val)\n\n    def addAtIndex(self, index: int, val: int) -> None:\n        if index < 0 or index > self.size:\n            return\n        pred = self.sentinel\n        for _ in range(index):\n            pred = pred.next\n        new_node = Node(val)\n        new_node.next = pred.next\n        pred.next = new_node\n        self.size += 1\n\n    def deleteAtIndex(self, index: int) -> None:\n        if index < 0 or index >= self.size:\n            return\n        pred = self.sentinel\n        for _ in range(index):\n            pred = pred.next\n        pred.next = pred.next.next\n        self.size -= 1",
    "lineMap": {
      "-": [
        1
      ],
      "header_get": [
        11
      ],
      "header_addAtIndex": [
        25
      ],
      "header_addAtHead": [
        19,
        20
      ],
      "header_addAtTail": [
        22,
        23
      ],
      "header_deleteAtIndex": [
        36
      ],
      "get_traverse": [
        15,
        16
      ],
      "add_traverse": [
        29,
        30
      ],
      "delete_traverse": [
        40,
        41
      ],
      "add_node": [
        31,
        32,
        33,
        34
      ],
      "delete_node": [
        42
      ],
      "get_value": [
        17
      ],
      "complete_op": [
        1
      ],
      "complete": [
        1
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MyLinkedList {\n    private class Node {\n        int val;\n        Node next;\n        Node(int val) {\n            this.val = val;\n        }\n    }\n\n    private Node sentinel;\n    private int size;\n\n    public MyLinkedList() {\n        sentinel = new Node(0);\n        size = 0;\n    }\n\n    public int get(int index) {\n        if (index < 0 || index >= size) return -1;\n        Node current = sentinel.next;\n        for (int i = 0; i < index; i++) {\n            current = current.next;\n        }\n        return current.val;\n    }\n\n    public void addAtHead(int val) {\n        addAtIndex(0, val);\n    }\n\n    public void addAtTail(int val) {\n        addAtIndex(size, val);\n    }\n\n    public void addAtIndex(int index, int val) {\n        if (index < 0 || index > size) return;\n        Node pred = sentinel;\n        for (int i = 0; i < index; i++) {\n            pred = pred.next;\n        }\n        Node newNode = new Node(val);\n        newNode.next = pred.next;\n        pred.next = newNode;\n        size++;\n    }\n\n    public void deleteAtIndex(int index) {\n        if (index < 0 || index >= size) return;\n        Node pred = sentinel;\n        for (int i = 0; i < index; i++) {\n            pred = pred.next;\n        }\n        pred.next = pred.next.next;\n        size--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "header_get": [
        18
      ],
      "header_addAtIndex": [
        35
      ],
      "header_addAtHead": [
        27,
        28
      ],
      "header_addAtTail": [
        31,
        32
      ],
      "header_deleteAtIndex": [
        47
      ],
      "get_traverse": [
        21,
        22
      ],
      "add_traverse": [
        38,
        39
      ],
      "delete_traverse": [
        50,
        51
      ],
      "add_node": [
        41,
        42,
        43,
        44
      ],
      "delete_node": [
        53
      ],
      "get_value": [
        24
      ],
      "complete_op": [
        1
      ],
      "complete": [
        1
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MyLinkedList {\n    struct Node {\n        int val;\n        Node* next;\n        Node(int v) : val(v), next(nullptr) {}\n    };\n\n    Node* sentinel;\n    int size;\n\npublic:\n    MyLinkedList() {\n        sentinel = new Node(0);\n        size = 0;\n    }\n\n    int get(int index) {\n        if (index < 0 || index >= size) return -1;\n        Node* current = sentinel->next;\n        for (int i = 0; i < index; i++) {\n            current = current->next;\n        }\n        return current->val;\n    }\n\n    void addAtHead(int val) {\n        addAtIndex(0, val);\n    }\n\n    void addAtTail(int val) {\n        addAtIndex(size, val);\n    }\n\n    void addAtIndex(int index, int val) {\n        if (index < 0 || index > size) return;\n        Node* pred = sentinel;\n        for (int i = 0; i < index; i++) {\n            pred = pred->next;\n        }\n        Node* newNode = new Node(val);\n        newNode->next = pred->next;\n        pred->next = newNode;\n        size++;\n    }\n\n    void deleteAtIndex(int index) {\n        if (index < 0 || index >= size) return;\n        Node* pred = sentinel;\n        for (int i = 0; i < index; i++) {\n            pred = pred->next;\n        }\n        Node* toDelete = pred->next;\n        pred->next = toDelete->next;\n        delete toDelete;\n        size--;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "header_get": [
        17
      ],
      "header_addAtIndex": [
        34
      ],
      "header_addAtHead": [
        26,
        27
      ],
      "header_addAtTail": [
        30,
        31
      ],
      "header_deleteAtIndex": [
        46
      ],
      "get_traverse": [
        20,
        21
      ],
      "add_traverse": [
        37,
        38
      ],
      "delete_traverse": [
        49,
        50
      ],
      "add_node": [
        40,
        41,
        42,
        43
      ],
      "delete_node": [
        52,
        53,
        54
      ],
      "get_value": [
        23
      ],
      "complete_op": [
        1
      ],
      "complete": [
        1
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MyLinkedList {\n    private class Node {\n        public int Val;\n        public Node Next;\n        public Node(int val) {\n            Val = val;\n            Next = null;\n        }\n    }\n\n    private Node sentinel;\n    private int size;\n\n    public MyLinkedList() {\n        sentinel = new Node(0);\n        size = 0;\n    }\n\n    public int Get(int index) {\n        if (index < 0 || index >= size) return -1;\n        Node current = sentinel.Next;\n        for (int i = 0; i < index; i++) {\n            current = current.Next;\n        }\n        return current.Val;\n    }\n\n    public void AddAtHead(int val) {\n        AddAtIndex(0, val);\n    }\n\n    public void AddAtTail(int val) {\n        AddAtIndex(size, val);\n    }\n\n    public void AddAtIndex(int index, int val) {\n        if (index < 0 || index > size) return;\n        Node pred = sentinel;\n        for (int i = 0; i < index; i++) {\n            pred = pred.Next;\n        }\n        Node newNode = new Node(val);\n        newNode.Next = pred.Next;\n        pred.Next = newNode;\n        size++;\n    }\n\n    public void DeleteAtIndex(int index) {\n        if (index < 0 || index >= size) return;\n        Node pred = sentinel;\n        for (int i = 0; i < index; i++) {\n            pred = pred.Next;\n        }\n        pred.Next = pred.Next.Next;\n        size--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "header_get": [
        19
      ],
      "header_addAtIndex": [
        36
      ],
      "header_addAtHead": [
        28,
        29
      ],
      "header_addAtTail": [
        32,
        33
      ],
      "header_deleteAtIndex": [
        48
      ],
      "get_traverse": [
        22,
        23
      ],
      "add_traverse": [
        39,
        40
      ],
      "delete_traverse": [
        51,
        52
      ],
      "add_node": [
        42,
        43,
        44,
        45
      ],
      "delete_node": [
        54
      ],
      "get_value": [
        25
      ],
      "complete_op": [
        1
      ],
      "complete": [
        1
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Node struct {\n    Val  int\n    Next *Node\n}\n\ntype MyLinkedList struct {\n    sentinel *Node\n    size     int\n}\n\nfunc Constructor() MyLinkedList {\n    return MyLinkedList{sentinel: &Node{}, size: 0}\n}\n\nfunc (l *MyLinkedList) Get(index int) int {\n    if index < 0 || index >= l.size {\n        return -1\n    }\n    current := l.sentinel.Next\n    for i := 0; i < index; i++ {\n        current = current.Next\n    }\n    return current.Val\n}\n\nfunc (l *MyLinkedList) AddAtHead(val int) {\n    l.AddAtIndex(0, val)\n}\n\nfunc (l *MyLinkedList) AddAtTail(val int) {\n    l.AddAtIndex(l.size, val)\n}\n\nfunc (l *MyLinkedList) AddAtIndex(index int, val int) {\n    if index < 0 || index > l.size {\n        return\n    }\n    pred := l.sentinel\n    for i := 0; i < index; i++ {\n        pred = pred.Next\n    }\n    newNode := &Node{Val: val, Next: pred.Next}\n    pred.Next = newNode\n    l.size++\n}\n\nfunc (l *MyLinkedList) DeleteAtIndex(index int) {\n    if index < 0 || index >= l.size {\n        return\n    }\n    pred := l.sentinel\n    for i := 0; i < index; i++ {\n        pred = pred.Next\n    }\n    pred.Next = pred.Next.Next\n    l.size--\n}",
    "lineMap": {
      "-": [
        1
      ],
      "header_get": [
        15
      ],
      "header_addAtIndex": [
        34
      ],
      "header_addAtHead": [
        26,
        27
      ],
      "header_addAtTail": [
        30,
        31
      ],
      "header_deleteAtIndex": [
        47
      ],
      "get_traverse": [
        20,
        21
      ],
      "add_traverse": [
        39,
        40
      ],
      "delete_traverse": [
        52,
        53
      ],
      "add_node": [
        42,
        43,
        44
      ],
      "delete_node": [
        55
      ],
      "get_value": [
        23
      ],
      "complete_op": [
        1
      ],
      "complete": [
        1
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function MyLinkedList() {\n    this.sentinel = {val: 0, next: null};\n    this.size = 0;\n};\n\nMyLinkedList.prototype.get = function(index) {\n    if (index < 0 || index >= this.size) return -1;\n    var current = this.sentinel.next;\n    for (var i = 0; i < index; i++) {\n        current = current.next;\n    }\n    return current.val;\n};\n\nMyLinkedList.prototype.addAtHead = function(val) {\n    this.addAtIndex(0, val);\n};\n\nMyLinkedList.prototype.addAtTail = function(val) {\n    this.addAtIndex(this.size, val);\n};\n\nMyLinkedList.prototype.addAtIndex = function(index, val) {\n    if (index < 0 || index > this.size) return;\n    var pred = this.sentinel;\n    for (var i = 0; i < index; i++) {\n        pred = pred.next;\n    }\n    var newNode = {val: val, next: pred.next};\n    pred.next = newNode;\n    this.size++;\n};\n\nMyLinkedList.prototype.deleteAtIndex = function(index) {\n    if (index < 0 || index >= this.size) return;\n    var pred = this.sentinel;\n    for (var i = 0; i < index; i++) {\n        pred = pred.next;\n    }\n    pred.next = pred.next.next;\n    this.size--;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "header_get": [
        6
      ],
      "header_addAtIndex": [
        23
      ],
      "header_addAtHead": [
        15,
        16
      ],
      "header_addAtTail": [
        19,
        20
      ],
      "header_deleteAtIndex": [
        34
      ],
      "get_traverse": [
        9,
        10
      ],
      "add_traverse": [
        26,
        27
      ],
      "delete_traverse": [
        37,
        38
      ],
      "add_node": [
        29,
        30,
        31
      ],
      "delete_node": [
        40
      ],
      "get_value": [
        12
      ],
      "complete_op": [
        1
      ],
      "complete": [
        1
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class MyLinkedList {\n    private sentinel: {val: number, next: any};\n    private size: number;\n\n    constructor() {\n        this.sentinel = {val: 0, next: null};\n        this.size = 0;\n    }\n\n    get(index: number): number {\n        if (index < 0 || index >= this.size) return -1;\n        let current = this.sentinel.next;\n        for (let i = 0; i < index; i++) {\n            current = current.next;\n        }\n        return current.val;\n    }\n\n    addAtHead(val: number): void {\n        this.addAtIndex(0, val);\n    }\n\n    addAtTail(val: number): void {\n        this.addAtIndex(this.size, val);\n    }\n\n    addAtIndex(index: number, val: number): void {\n        if (index < 0 || index > this.size) return;\n        let pred = this.sentinel;\n        for (let i = 0; i < index; i++) {\n            pred = pred.next;\n        }\n        const newNode = {val: val, next: pred.next};\n        pred.next = newNode;\n        this.size++;\n    }\n\n    deleteAtIndex(index: number): void {\n        if (index < 0 || index >= this.size) return;\n        let pred = this.sentinel;\n        for (let i = 0; i < index; i++) {\n            pred = pred.next;\n        }\n        pred.next = pred.next.next;\n        this.size--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "header_get": [
        10
      ],
      "header_addAtIndex": [
        27
      ],
      "header_addAtHead": [
        19,
        20
      ],
      "header_addAtTail": [
        23,
        24
      ],
      "header_deleteAtIndex": [
        38
      ],
      "get_traverse": [
        13,
        14
      ],
      "add_traverse": [
        30,
        31
      ],
      "delete_traverse": [
        41,
        42
      ],
      "add_node": [
        33,
        34,
        35
      ],
      "delete_node": [
        44
      ],
      "get_value": [
        16
      ],
      "complete_op": [
        1
      ],
      "complete": [
        1
      ]
    }
  }
};

const DesignLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "LeetCode Example",
    "value": {
      "operations": [
        [
          "addAtHead",
          1
        ],
        [
          "addAtTail",
          3
        ],
        [
          "addAtIndex",
          1,
          2
        ],
        [
          "get",
          1
        ],
        [
          "deleteAtIndex",
          1
        ],
        [
          "get",
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Head & Tail Ops",
    "value": {
      "operations": [
        [
          "addAtHead",
          5
        ],
        [
          "addAtHead",
          3
        ],
        [
          "addAtTail",
          7
        ],
        [
          "get",
          0
        ],
        [
          "deleteAtIndex",
          2
        ],
        [
          "get",
          1
        ]
      ]
    }
  }
];

function generateDesignLinkedListSteps(e: any): any[] {
  

let t=e.operations;class n{constructor(e){this.val=e,this.next=null}}let i=new n(0),r=0,a=[],l=new StepRecorder({},{node_sentinel:{type:"arrayElement",value:"S",position:-1,state:"muted"},ptr_head:{type:"pointer",position:-1,label:"head"}});function o(e,t){for(let e of Object.keys(l.getCurrentVisuals()))e.startsWith("node_")&&"node_sentinel"!==e&&l.delete_visual(e),e.startsWith("arrow_")&&l.delete_visual(e),e.startsWith("ptr_")&&"ptr_head"!==e&&l.delete_visual(e);a=[];let n=i.next;for(;null!==n;)a.push(n),n=n.next;a.length>0?l.update_visual("arrow_sentinel",{type:"range",start:-1,end:0}):l.get_visual("arrow_sentinel")&&l.delete_visual("arrow_sentinel");for(let n=0;n<a.length;n++){let d;void 0!==e&&n===e&&t&&(d=t),l.update_visual(`node_${n}`,{type:"arrayElement",value:a[n].val,position:n,state:d}),n<a.length-1&&l.update_visual(`arrow_${n}`,{type:"range",start:n,end:n+1})}}l.record("-","Design Linked List: initialize an empty linked list with a sentinel node");for(let e=0;e<t.length;e++){let d=t[e],a=d[0],s=`header_${a}`,p="get"===a?"get_traverse":"deleteAtIndex"===a?"delete_traverse":"add_traverse";if("addAtHead"===a){let e=d[1];l.record(s,`Operation: addAtHead(${e})`),l.update_visual("ptr_pred",{type:"pointer",position:-1,label:"pred"}),l.record(p,"pred starts at sentinel (index 0, no traversal needed for addAtHead)");let t=new n(e);t.next=i.next,i.next=t,r++,o(0,"active"),l.record("add_node",`Inserted node ${e} at head. List size = ${r}`),o(),l.delete_visual("ptr_pred"),l.record("complete_op",`addAtHead(${e}) complete`)}else if("addAtTail"===a){let e=d[1];l.record(s,`Operation: addAtTail(${e})`);let t=i,a=-1;for(l.update_visual("ptr_pred",{type:"pointer",position:a,label:"pred"}),l.record(p,"pred starts at sentinel, will traverse to end");null!==t.next;)t=t.next,a++,l.update_visual("ptr_pred",{type:"pointer",position:a,label:"pred"}),a<r&&l.update_visual(`node_${a}`,{type:"arrayElement",value:t.val,position:a,state:"highlight"}),l.record(p,`pred moves to position ${a} (value ${t.val})`),a<r&&l.update_visual(`node_${a}`,{type:"arrayElement",value:t.val,position:a});let v=new n(e);t.next=v,o(++r-1,"active"),l.record("add_node",`Inserted node ${e} at tail. List size = ${r}`),o(),l.delete_visual("ptr_pred"),l.record("complete_op",`addAtTail(${e}) complete`)}else if("addAtIndex"===a){let e=d[1],t=d[2];if(l.record(s,`Operation: addAtIndex(${e}, ${t})`),e<0||e>r){l.record("complete_op",`Index ${e} out of bounds (size=${r}), skipping`);continue}let a=i,v=-1;l.update_visual("ptr_pred",{type:"pointer",position:v,label:"pred"}),l.record(p,`pred starts at sentinel, will traverse to index ${e}`);for(let t=0;t<e;t++)a=a.next,v++,l.update_visual("ptr_pred",{type:"pointer",position:v,label:"pred"}),l.update_visual(`node_${v}`,{type:"arrayElement",value:a.val,position:v,state:"highlight"}),l.record(p,`pred moves to position ${v} (value ${a.val})`),l.update_visual(`node_${v}`,{type:"arrayElement",value:a.val,position:v});let x=new n(t);x.next=a.next,a.next=x,r++,o(e,"active"),l.record("add_node",`Inserted node ${t} at index ${e}. List size = ${r}`),o(),l.delete_visual("ptr_pred"),l.record("complete_op",`addAtIndex(${e}, ${t}) complete`)}else if("get"===a){let e=d[1];if(l.record(s,`Operation: get(${e})`),e<0||e>=r){l.record("get_value",`Index ${e} out of bounds (size=${r}), return -1`),l.record("complete_op",`get(${e}) = -1`);continue}let t=i.next,n=0;l.update_visual("ptr_current",{type:"pointer",position:n,label:"current"}),l.update_visual(`node_${n}`,{type:"arrayElement",value:t.val,position:n,state:"highlight"}),l.record(p,`current starts at position 0 (value ${t.val})`);for(let d=0;d<e;d++)l.update_visual(`node_${n}`,{type:"arrayElement",value:t.val,position:n}),t=t.next,n++,l.update_visual("ptr_current",{type:"pointer",position:n,label:"current"}),l.update_visual(`node_${n}`,{type:"arrayElement",value:t.val,position:n,state:"highlight"}),l.record(p,`current moves to position ${n} (value ${t.val})`);l.update_visual(`node_${n}`,{type:"arrayElement",value:t.val,position:n,state:"active"}),l.record("get_value",`Found value ${t.val} at index ${e}`),o(),l.delete_visual("ptr_current"),l.record("complete_op",`get(${e}) = ${t.val}`)}else if("deleteAtIndex"===a){let e=d[1];if(l.record(s,`Operation: deleteAtIndex(${e})`),e<0||e>=r){l.record("complete_op",`Index ${e} out of bounds (size=${r}), skipping`);continue}let t=i,n=-1;l.update_visual("ptr_pred",{type:"pointer",position:n,label:"pred"}),l.record(p,`pred starts at sentinel, will traverse to index ${e}`);for(let d=0;d<e;d++)t=t.next,n++,l.update_visual("ptr_pred",{type:"pointer",position:n,label:"pred"}),l.update_visual(`node_${n}`,{type:"arrayElement",value:t.val,position:n,state:"highlight"}),l.record(p,`pred moves to position ${n} (value ${t.val})`),l.update_visual(`node_${n}`,{type:"arrayElement",value:t.val,position:n});let a=t.next;l.update_visual(`node_${e}`,{type:"arrayElement",value:a.val,position:e,state:"error"}),l.record("delete_node",`Marking node at index ${e} (value ${a.val}) for deletion`),t.next=t.next.next,r--,o(),l.delete_visual("ptr_pred"),l.record("complete_op",`deleteAtIndex(${e}) complete. List size = ${r}`)}}for(let e of(o(),Object.keys(l.getCurrentVisuals())))e.startsWith("ptr_")&&"ptr_head"!==e&&l.delete_visual(e);return l.record("complete",`All operations complete. Final list has ${r} nodes`),l.getSteps()
}

export function DesignLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDesignLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Design Linked List"
      slug="design-linked-list"
      approaches={approaches}
      presets={DesignLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Insert Node in Linked List (insert-node-linked-list)
// ==========================================

const InsertNodeLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "def insert(head, value, position):\n    new_node = ListNode(value)\n\n    # Insert at head\n    if position == 0:\n        new_node.next = head\n        return new_node\n\n    # Traverse to position - 1\n    current = head\n    for i in range(position - 1):\n        if current is None:\n            return head  # Invalid position\n        current = current.next\n\n    if current is None:\n        return head  # Invalid position\n\n    # Insert new node\n    new_node.next = current.next\n    current.next = new_node\n\n    return head",
    "lineMap": {
      "-": [
        1
      ],
      "check_position": [
        5
      ],
      "create_node": [
        2
      ],
      "link_new_next": [
        6
      ],
      "update_head": [
        7
      ],
      "init_current": [
        10
      ],
      "traverse_check": [
        11,
        12
      ],
      "move_current": [
        14
      ],
      "found_position": [
        16
      ],
      "error": [
        17
      ],
      "insert_tail": [
        20
      ],
      "insert_middle": [
        20
      ],
      "link_new_to_current_next": [
        20
      ],
      "link_current_next": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "while_traverse": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode insert(ListNode head, int value, int position) {\n    ListNode newNode = new ListNode(value);\n\n    // Insert at head\n    if (position == 0) {\n        newNode.next = head;\n        return newNode;\n    }\n\n    // Traverse to position - 1\n    ListNode current = head;\n    for (int i = 0; i < position - 1 && current != null; i++) {\n        current = current.next;\n    }\n\n    if (current == null) {\n        return head; // Invalid position\n    }\n\n    // Insert new node\n    newNode.next = current.next;\n    current.next = newNode;\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_position": [
        5
      ],
      "create_node": [
        2
      ],
      "link_new_next": [
        6
      ],
      "update_head": [
        7
      ],
      "init_current": [
        11
      ],
      "traverse_check": [
        12
      ],
      "move_current": [
        13
      ],
      "found_position": [
        16
      ],
      "error": [
        17
      ],
      "insert_tail": [
        21
      ],
      "insert_middle": [
        21
      ],
      "link_new_to_current_next": [
        21
      ],
      "link_current_next": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_traverse": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* insert(ListNode* head, int value, int position) {\n    ListNode* newNode = new ListNode(value);\n\n    // Insert at head\n    if (position == 0) {\n        newNode->next = head;\n        return newNode;\n    }\n\n    // Traverse to position - 1\n    ListNode* current = head;\n    for (int i = 0; i < position - 1 && current != nullptr; i++) {\n        current = current->next;\n    }\n\n    if (current == nullptr) {\n        return head; // Invalid position\n    }\n\n    // Insert new node\n    newNode->next = current->next;\n    current->next = newNode;\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_position": [
        5
      ],
      "create_node": [
        2
      ],
      "link_new_next": [
        6
      ],
      "update_head": [
        7
      ],
      "init_current": [
        11
      ],
      "traverse_check": [
        12
      ],
      "move_current": [
        13
      ],
      "found_position": [
        16
      ],
      "error": [
        17
      ],
      "insert_tail": [
        21
      ],
      "insert_middle": [
        21
      ],
      "link_new_to_current_next": [
        21
      ],
      "link_current_next": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_traverse": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func insert(head *ListNode, value int, position int) *ListNode {\n    newNode := &ListNode{Val: value}\n\n    // Insert at head\n    if position == 0 {\n        newNode.Next = head\n        return newNode\n    }\n\n    // Traverse to position - 1\n    current := head\n    for i := 0; i < position-1 && current != nil; i++ {\n        current = current.Next\n    }\n\n    if current == nil {\n        return head // Invalid position\n    }\n\n    // Insert new node\n    newNode.Next = current.Next\n    current.Next = newNode\n\n    return head\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_position": [
        5
      ],
      "create_node": [
        2
      ],
      "link_new_next": [
        6
      ],
      "update_head": [
        7
      ],
      "init_current": [
        11
      ],
      "traverse_check": [
        12
      ],
      "move_current": [
        13
      ],
      "found_position": [
        16
      ],
      "error": [
        17
      ],
      "insert_tail": [
        21
      ],
      "insert_middle": [
        21
      ],
      "link_new_to_current_next": [
        21
      ],
      "link_current_next": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_traverse": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function insert(head, value, position) {\n    const newNode = new ListNode(value);\n\n    // Insert at head\n    if (position === 0) {\n        newNode.next = head;\n        return newNode;\n    }\n\n    // Traverse to position - 1\n    let current = head;\n    for (let i = 0; i < position - 1 && current !== null; i++) {\n        current = current.next;\n    }\n\n    if (current === null) {\n        return head; // Invalid position\n    }\n\n    // Insert new node\n    newNode.next = current.next;\n    current.next = newNode;\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_position": [
        5
      ],
      "create_node": [
        2
      ],
      "link_new_next": [
        6
      ],
      "update_head": [
        7
      ],
      "init_current": [
        11
      ],
      "traverse_check": [
        12
      ],
      "move_current": [
        13
      ],
      "found_position": [
        16
      ],
      "error": [
        17
      ],
      "insert_tail": [
        21
      ],
      "insert_middle": [
        21
      ],
      "link_new_to_current_next": [
        21
      ],
      "link_current_next": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_traverse": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function insert(head: ListNode | null, value: number, position: number): ListNode | null {\n    const newNode = new ListNode(value);\n\n    // Insert at head\n    if (position === 0) {\n        newNode.next = head;\n        return newNode;\n    }\n\n    // Traverse to position - 1\n    let current: ListNode | null = head;\n    for (let i = 0; i < position - 1 && current !== null; i++) {\n        current = current.next;\n    }\n\n    if (current === null) {\n        return head; // Invalid position\n    }\n\n    // Insert new node\n    newNode.next = current.next;\n    current.next = newNode;\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_position": [
        5
      ],
      "create_node": [
        2
      ],
      "link_new_next": [
        6
      ],
      "update_head": [
        7
      ],
      "init_current": [
        11
      ],
      "traverse_check": [
        12
      ],
      "move_current": [
        13
      ],
      "found_position": [
        16
      ],
      "error": [
        17
      ],
      "insert_tail": [
        21
      ],
      "insert_middle": [
        21
      ],
      "link_new_to_current_next": [
        21
      ],
      "link_current_next": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_traverse": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode Insert(ListNode head, int value, int position) {\n    ListNode newNode = new ListNode(value);\n\n    // Insert at head\n    if (position == 0) {\n        newNode.next = head;\n        return newNode;\n    }\n\n    // Traverse to position - 1\n    ListNode current = head;\n    for (int i = 0; i < position - 1 && current != null; i++) {\n        current = current.next;\n    }\n\n    if (current == null) {\n        return head; // Invalid position\n    }\n\n    // Insert new node\n    newNode.next = current.next;\n    current.next = newNode;\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_position": [
        5
      ],
      "create_node": [
        2
      ],
      "link_new_next": [
        6
      ],
      "update_head": [
        7
      ],
      "init_current": [
        11
      ],
      "traverse_check": [
        12
      ],
      "move_current": [
        13
      ],
      "found_position": [
        16
      ],
      "error": [
        17
      ],
      "insert_tail": [
        21
      ],
      "insert_middle": [
        21
      ],
      "link_new_to_current_next": [
        21
      ],
      "link_current_next": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_traverse": [
        12
      ]
    }
  }
};

const InsertNodeLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Insert at Head",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "insertValue": 0,
      "insertPosition": 0
    }
  },
  {
    "id": "ex2",
    "label": "Insert at Tail",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "insertValue": 6,
      "insertPosition": 5
    }
  },
  {
    "id": "ex3",
    "label": "Insert in Middle",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ],
      "insertValue": 99,
      "insertPosition": 2
    }
  }
];

function generateInsertNodeLinkedListSteps(e: any): any[] {
  class i{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}function a(e){return null===e?null:`Node(${e.val})`}

let t=e.values,n=e.insertValue,o=e.insertPosition,l=t.length,s=null,d=[];if(t.length>0){s=new i(t[0]),d.push(s);let e=s;for(let n=1;n<t.length;n++)e.next=new i(t[n]),e=e.next,d.push(e)}let u={};t.forEach((e,t)=>{u[`node_${t}`]={type:"arrayElement",value:e,position:t,state:"default"}});let c={};for(let e=0;e<t.length-1;e++)c[`arrow_${e}_${e+1}`]={type:"range",start:e,end:e+1};let p=new StepRecorder({values:t,insertValue:n,insertPosition:o,head:a(s),current:void 0,newNode:void 0},{...u,...c,...l>0?{ptr_head:{type:"pointer",position:0,label:"head"}}:{}});p.record("-",`Insert value ${n} at position ${o}`);let f=new i(n);if(p.update_variable("newNode",a(f)),0===o)return p.add_new_visual("new_node",{type:"arrayElement",value:n,position:-1,state:"highlight"}),p.add_new_visual("ptr_newNode",{type:"pointer",position:-1,label:"newNode"}),p.record("create_node",`Create new node with value ${n}`),p.record("check_position","Position is 0, inserting at head"),f.next=s,l>0&&p.add_new_visual("arrow_new_to_head",{type:"range",start:-1,end:0}),p.record("link_new_next",`newNode.next = head (${n} → ${s?.val??"null"})`),s=f,p.update_variable("head",a(s)),p.delete_visual("ptr_head"),p.add_new_visual("ptr_head",{type:"pointer",position:-1,label:"head"}),p.delete_visual("ptr_newNode"),p.update_visual("new_node",{type:"arrayElement",value:n,position:-1,state:"result"}),p.record("update_head",`return newNode - Insertion complete! New node ${n} is now the head`),p.getSteps();p.add_new_visual("new_node",{type:"arrayElement",value:n,position:l,state:"highlight"}),p.add_new_visual("ptr_newNode",{type:"pointer",position:l,label:"newNode"}),p.record("create_node",`Create new node with value ${n}`),p.record("check_position",`Position is ${o}, need to traverse to position ${o-1}`);let h=s,x=0;for(p.update_variable("current",a(h)),p.add_new_visual("ptr_current",{type:"pointer",position:0,label:"current"}),p.record("init_current","Initialize current = head");null!==h&&x<o-1;)p.add_conditional("while_traverse",!0),p.update_visual(`node_${x}`,{type:"arrayElement",value:t[x],position:x,state:"active"}),p.record("traverse_check",`currentPos (${x}) < insertPosition - 1 (${o-1}), continue traversing`),p.update_visual(`node_${x}`,{type:"arrayElement",value:t[x],position:x,state:"visited"}),h=h.next,x++,p.update_variable("current",a(h)),p.update_visual("ptr_current",{type:"pointer",position:x,label:"current"}),p.record("move_current",`current = current.next (move to node ${h?.val})`);if(p.add_conditional("while_traverse",!1),null===h)return p.record("error",`Cannot insert at position ${o}, list too short`),p.getSteps();if(p.update_visual(`node_${x}`,{type:"arrayElement",value:t[x],position:x,state:"active"}),p.record("found_position",`Found position ${x}, will insert after node ${h.val}`),null===h.next)p.record("insert_tail","current.next is null, inserting at tail"),p.record("link_new_to_current_next","newNode.next = current.next (null - end of list)"),h.next=f,p.add_new_visual("arrow_current_to_new",{type:"range",start:x,end:l}),p.record("link_current_next",`current.next = newNode (${h.val} → ${n})`),p.update_visual(`node_${x}`,{type:"arrayElement",value:t[x],position:x,state:"visited"}),p.delete_visual("ptr_current"),p.delete_visual("ptr_newNode"),p.update_visual("new_node",{type:"arrayElement",value:n,position:l,state:"result"}),p.record("complete",`Insertion complete! New node ${n} added at tail`);else{p.record("insert_middle","current.next is not null, inserting in middle");let e=l+o;p.update_visual("new_node",{type:"arrayElement",value:n,position:e,state:"highlight"}),p.update_visual("ptr_newNode",{type:"pointer",position:e,label:"newNode"});let r=h.next;f.next=r,p.add_new_visual("arrow_new_to_next",{type:"range",start:e,end:x+1,label:"merge"}),p.record("link_new_to_current_next",`newNode.next = current.next (${n} → ${r?.val})`),h.next=f,p.delete_visual(`arrow_${x}_${x+1}`),p.add_new_visual("arrow_current_to_new",{type:"range",start:x,end:e}),p.record("link_current_next",`current.next = newNode (${t[x]} → ${n})`);for(let e=l-1;e>x;e--)p.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:e+1,state:"default"});for(let e=x+1;e<l-1;e++)p.update_visual(`arrow_${e}_${e+1}`,{type:"range",start:e+1,end:e+2});p.update_visual("new_node",{type:"arrayElement",value:n,position:x+1,state:"highlight"}),p.update_visual("ptr_newNode",{type:"pointer",position:x+1,label:"newNode"}),p.update_visual("arrow_current_to_new",{type:"range",start:x,end:x+1}),p.update_visual("arrow_new_to_next",{type:"range",start:x+1,end:x+2,label:"merge"}),p.update_visual(`node_${x}`,{type:"arrayElement",value:t[x],position:x,state:"visited"}),p.delete_visual("ptr_current"),p.delete_visual("ptr_newNode"),p.update_visual("new_node",{type:"arrayElement",value:n,position:x+1,state:"result"}),p.update_visual("arrow_new_to_next",{type:"range",start:x+1,end:x+2}),p.record("complete",`Insertion complete! New node ${n} inserted at position ${o}`)}return p.getSteps()
}

export function InsertNodeLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InsertNodeLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateInsertNodeLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Insert Node in Linked List"
      slug="insert-node-linked-list"
      approaches={approaches}
      presets={InsertNodeLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Insert into a Sorted Circular Linked List (insert-into-a-sorted-circular-linked-list)
// ==========================================

const InsertIntoASortedCircularLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "def insert(head, insertVal):\n    new_node = Node(insertVal)\n\n    # Empty list: create a self-referencing node\n    if not head:\n        new_node.next = new_node\n        return new_node\n\n    prev = head\n    curr = head.next\n\n    while True:\n        # Case 1: Normal range, insertVal fits between prev and curr\n        if prev.val <= insertVal <= curr.val:\n            break\n\n        # Case 2: At the boundary (max -> min wrap-around)\n        if prev.val > curr.val:\n            # insertVal is >= max or <= min, belongs at the boundary\n            if insertVal >= prev.val or insertVal <= curr.val:\n                break\n\n        # Case 3: Full loop, all values are the same, insert anywhere\n        prev = curr\n        curr = curr.next\n        if prev == head:\n            break\n\n    # Insert new node between prev and curr\n    prev.next = new_node\n    new_node.next = curr\n    return head",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        9,
        10
      ],
      "traverse": [
        24,
        25
      ],
      "check_normal": [
        14
      ],
      "check_boundary": [
        18,
        20
      ],
      "full_loop": [
        26,
        27
      ],
      "insert": [
        30,
        31
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "while_loop": [
        12
      ],
      "check_normal": [
        14
      ],
      "check_boundary": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public Node insert(Node head, int insertVal) {\n    Node newNode = new Node(insertVal);\n\n    // Empty list: create a self-referencing node\n    if (head == null) {\n        newNode.next = newNode;\n        return newNode;\n    }\n\n    Node prev = head;\n    Node curr = head.next;\n\n    while (true) {\n        // Case 1: Normal range, insertVal fits between prev and curr\n        if (prev.val <= insertVal && insertVal <= curr.val) {\n            break;\n        }\n\n        // Case 2: At the boundary (max -> min wrap-around)\n        if (prev.val > curr.val) {\n            // insertVal is >= max or <= min, belongs at the boundary\n            if (insertVal >= prev.val || insertVal <= curr.val) {\n                break;\n            }\n        }\n\n        // Case 3: Full loop, all values are the same, insert anywhere\n        prev = curr;\n        curr = curr.next;\n        if (prev == head) {\n            break;\n        }\n    }\n\n    // Insert new node between prev and curr\n    prev.next = newNode;\n    newNode.next = curr;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "traverse": [
        28,
        29
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20,
        22
      ],
      "full_loop": [
        30,
        31
      ],
      "insert": [
        36,
        37
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        13
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "Node* insert(Node* head, int insertVal) {\n    Node* newNode = new Node(insertVal);\n\n    // Empty list: create a self-referencing node\n    if (!head) {\n        newNode->next = newNode;\n        return newNode;\n    }\n\n    Node* prev = head;\n    Node* curr = head->next;\n\n    while (true) {\n        // Case 1: Normal range, insertVal fits between prev and curr\n        if (prev->val <= insertVal && insertVal <= curr->val) {\n            break;\n        }\n\n        // Case 2: At the boundary (max -> min wrap-around)\n        if (prev->val > curr->val) {\n            // insertVal is >= max or <= min, belongs at the boundary\n            if (insertVal >= prev->val || insertVal <= curr->val) {\n                break;\n            }\n        }\n\n        // Case 3: Full loop, all values are the same, insert anywhere\n        prev = curr;\n        curr = curr->next;\n        if (prev == head) {\n            break;\n        }\n    }\n\n    // Insert new node between prev and curr\n    prev->next = newNode;\n    newNode->next = curr;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "traverse": [
        28,
        29
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20,
        22
      ],
      "full_loop": [
        30,
        31
      ],
      "insert": [
        36,
        37
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        13
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public Node Insert(Node head, int insertVal) {\n    Node newNode = new Node(insertVal);\n\n    // Empty list: create a self-referencing node\n    if (head == null) {\n        newNode.next = newNode;\n        return newNode;\n    }\n\n    Node prev = head;\n    Node curr = head.next;\n\n    while (true) {\n        // Case 1: Normal range, insertVal fits between prev and curr\n        if (prev.val <= insertVal && insertVal <= curr.val) {\n            break;\n        }\n\n        // Case 2: At the boundary (max -> min wrap-around)\n        if (prev.val > curr.val) {\n            // insertVal is >= max or <= min, belongs at the boundary\n            if (insertVal >= prev.val || insertVal <= curr.val) {\n                break;\n            }\n        }\n\n        // Case 3: Full loop, all values are the same, insert anywhere\n        prev = curr;\n        curr = curr.next;\n        if (prev == head) {\n            break;\n        }\n    }\n\n    // Insert new node between prev and curr\n    prev.next = newNode;\n    newNode.next = curr;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "traverse": [
        28,
        29
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20,
        22
      ],
      "full_loop": [
        30,
        31
      ],
      "insert": [
        36,
        37
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        13
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func insert(aNode *Node, x int) *Node {\n    newNode := &Node{Val: x}\n\n    // Empty list: create a self-referencing node\n    if aNode == nil {\n        newNode.Next = newNode\n        return newNode\n    }\n\n    prev := aNode\n    curr := aNode.Next\n\n    for {\n        // Case 1: Normal range, x fits between prev and curr\n        if prev.Val <= x && x <= curr.Val {\n            break\n        }\n\n        // Case 2: At the boundary (max -> min wrap-around)\n        if prev.Val > curr.Val {\n            // x is >= max or <= min, belongs at the boundary\n            if x >= prev.Val || x <= curr.Val {\n                break\n            }\n        }\n\n        // Case 3: Full loop, all values are the same, insert anywhere\n        prev = curr\n        curr = curr.Next\n        if prev == aNode {\n            break\n        }\n    }\n\n    // Insert new node between prev and curr\n    prev.Next = newNode\n    newNode.Next = curr\n    return aNode\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "traverse": [
        28,
        29
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20,
        22
      ],
      "full_loop": [
        30,
        31
      ],
      "insert": [
        36,
        37
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        13
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function insert(head, insertVal) {\n    var newNode = new _Node(insertVal);\n\n    // Empty list: create a self-referencing node\n    if (!head) {\n        newNode.next = newNode;\n        return newNode;\n    }\n\n    var prev = head;\n    var curr = head.next;\n\n    while (true) {\n        // Case 1: Normal range, insertVal fits between prev and curr\n        if (prev.val <= insertVal && insertVal <= curr.val) {\n            break;\n        }\n\n        // Case 2: At the boundary (max -> min wrap-around)\n        if (prev.val > curr.val) {\n            // insertVal is >= max or <= min, belongs at the boundary\n            if (insertVal >= prev.val || insertVal <= curr.val) {\n                break;\n            }\n        }\n\n        // Case 3: Full loop, all values are the same, insert anywhere\n        prev = curr;\n        curr = curr.next;\n        if (prev === head) {\n            break;\n        }\n    }\n\n    // Insert new node between prev and curr\n    prev.next = newNode;\n    newNode.next = curr;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "traverse": [
        28,
        29
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20,
        22
      ],
      "full_loop": [
        30,
        31
      ],
      "insert": [
        36,
        37
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        13
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function insert(head: _Node | null, insertVal: number): _Node {\n    const newNode = new _Node(insertVal);\n\n    // Empty list: create a self-referencing node\n    if (!head) {\n        newNode.next = newNode;\n        return newNode;\n    }\n\n    let prev = head;\n    let curr = head.next!;\n\n    while (true) {\n        // Case 1: Normal range, insertVal fits between prev and curr\n        if (prev.val <= insertVal && insertVal <= curr.val) {\n            break;\n        }\n\n        // Case 2: At the boundary (max -> min wrap-around)\n        if (prev.val > curr.val) {\n            // insertVal is >= max or <= min, belongs at the boundary\n            if (insertVal >= prev.val || insertVal <= curr.val) {\n                break;\n            }\n        }\n\n        // Case 3: Full loop, all values are the same, insert anywhere\n        prev = curr;\n        curr = curr.next!;\n        if (prev === head) {\n            break;\n        }\n    }\n\n    // Insert new node between prev and curr\n    prev.next = newNode;\n    newNode.next = curr;\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "traverse": [
        28,
        29
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20,
        22
      ],
      "full_loop": [
        30,
        31
      ],
      "insert": [
        36,
        37
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        13
      ],
      "check_normal": [
        15
      ],
      "check_boundary": [
        20
      ]
    }
  }
};

const InsertIntoASortedCircularLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "values": [
        1,
        3,
        5,
        8,
        10,
        12
      ],
      "insertVal": 7
    }
  },
  {
    "id": "ex2",
    "label": "Rotated List",
    "value": {
      "values": [
        7,
        9,
        11,
        1,
        3
      ],
      "insertVal": 4
    }
  },
  {
    "id": "ex3",
    "label": "Insert at Boundary",
    "value": {
      "values": [
        1,
        3,
        5,
        8,
        10
      ],
      "insertVal": 12
    }
  },
  {
    "id": "ex4",
    "label": "All Same Values",
    "value": {
      "values": [
        5,
        5,
        5,
        5,
        5
      ],
      "insertVal": 8
    }
  }
];

function generateInsertIntoASortedCircularLinkedListSteps(e: any): any[] {
  class t{constructor(e,r){this.val=void 0===e?0:e,this.next=void 0===r?null:r}}

let r=e.values,n=e.insertVal;if(0===r.length){let e=new StepRecorder({insertVal:n},{});return e.record("-",`Start: Insert ${n} into an empty circular linked list`),e.add_new_visual("node_0",{type:"arrayElement",value:n,position:0,state:"sorted"}),e.add_new_visual("arrow_circular",{type:"range",start:0,end:0,label:"circular"}),e.add_new_visual("ptr_head",{type:"pointer",position:0,label:"head"}),e.record("insert",`Head is null. Create new node ${n} pointing to itself`),e.record("complete",`Done! Inserted ${n} as the only node in the circular list`),e.getSteps()}let i=[];for(let e=0;e<r.length;e++)i.push(new t(r[e]));for(let e=0;e<i.length-1;e++)i[e].next=i[e+1];i[i.length-1].next=i[0];let o=i[0],l={};for(let e=0;e<r.length;e++)l[`node_${e}`]={type:"arrayElement",value:r[e],position:e};for(let e=0;e<r.length-1;e++)l[`arrow_${e}`]={type:"range",start:e,end:e+1};l.arrow_circular={type:"range",start:r.length-1,end:0},l.ptr_head={type:"pointer",position:0,label:"head"};let d=new StepRecorder({insertVal:n},l);d.record("-",`Start: Insert ${n} into the sorted circular linked list [${r.join(", ")}]`);let s=o,u=0,c=o.next,p=1%r.length;for(d.update_visual(`node_${u}`,{type:"arrayElement",value:s.val,position:u,state:"active"}),d.update_visual(`node_${p}`,{type:"arrayElement",value:c.val,position:p,state:"comparing"}),d.add_new_visual("ptr_prev",{type:"pointer",position:u,label:"prev"}),d.add_new_visual("ptr_curr",{type:"pointer",position:p,label:"curr"}),d.record("initialize",`Initialize prev = head (${s.val}), curr = head.next (${c.val})`);;){d.add_conditional("while_loop",!0);let e=s.val<=n&&n<=c.val;if(d.add_conditional("check_normal",e),e){d.record("check_normal",`Found insertion point: prev.val (${s.val}) <= ${n} <= curr.val (${c.val})`);break}d.record("check_normal",`Normal range check: prev.val (${s.val}) <= ${n} <= curr.val (${c.val})? No`);let a=s.val>c.val,t=a&&(n>=s.val||n<=c.val);if(d.add_conditional("check_boundary",t),t){d.record("check_boundary",`Found boundary insertion point: prev.val (${s.val}) > curr.val (${c.val}), and ${n} ${n>=s.val?">= prev.val":"<= curr.val"}`);break}if(d.record("check_boundary",`Boundary check: prev.val (${s.val}) > curr.val (${c.val})? ${a?"Yes, but "+n+" not at boundary":"No"}`),d.update_visual(`node_${u}`,{type:"arrayElement",value:s.val,position:u}),s=c,u=p,c=c.next,p=(p+1)%r.length,s===o){d.add_conditional("while_loop",!1),d.update_visual(`node_${u}`,{type:"arrayElement",value:s.val,position:u,state:"active"}),d.update_visual(`node_${p}`,{type:"arrayElement",value:c.val,position:p,state:"comparing"}),d.update_visual("ptr_prev",{type:"pointer",position:u,label:"prev"}),d.update_visual("ptr_curr",{type:"pointer",position:p,label:"curr"}),d.record("full_loop","Completed full loop (prev == head). All values are the same. Insert anywhere");break}d.update_visual(`node_${u}`,{type:"arrayElement",value:s.val,position:u,state:"active"}),d.update_visual(`node_${p}`,{type:"arrayElement",value:c.val,position:p,state:"comparing"}),d.update_visual("ptr_prev",{type:"pointer",position:u,label:"prev"}),d.update_visual("ptr_curr",{type:"pointer",position:p,label:"curr"}),d.record("traverse",`Advance pointers: prev = ${s.val} (index ${u}), curr = ${c.val} (index ${p})`)}let v=r.length;d.update_visual(`node_${u}`,{type:"arrayElement",value:s.val,position:u,state:"active"}),d.update_visual(`node_${p}`,{type:"arrayElement",value:c.val,position:p});let _=u===r.length-1&&0===p;d.add_new_visual(`node_${r.length}`,{type:"arrayElement",value:n,position:v,state:"sorted"}),d.add_new_visual("ptr_newNode",{type:"pointer",position:v,label:"newNode"}),_?d.delete_visual("arrow_circular"):d.delete_visual(`arrow_${u}`),d.add_new_visual("arrow_prev_to_new",{type:"range",start:u,end:v}),_?d.add_new_visual("arrow_circular",{type:"range",start:v,end:0}):d.add_new_visual("arrow_new_to_curr",{type:"range",start:v,end:p}),d.record("insert",`Insert new node ${n} between ${s.val} and ${c.val}`);let m=[];for(let e=0;e<r.length;e++)m.push(e),e===u&&m.push(r.length);m.forEach((e,a)=>{let t=e===r.length;d.update_visual(`node_${e}`,{type:"arrayElement",value:t?n:r[e],position:a,state:t?"sorted":void 0})}),d.delete_visual("arrow_circular"),d.delete_visual("arrow_prev_to_new"),d.delete_visual("arrow_new_to_curr");for(let e=0;e<r.length;e++)d.delete_visual(`arrow_${e}`);for(let e=0;e<m.length-1;e++)d.add_new_visual(`arrow_linear_${e}`,{type:"range",start:e,end:e+1});return d.add_new_visual("arrow_circular",{type:"range",start:m.length-1,end:0}),d.delete_visual("ptr_prev"),d.delete_visual("ptr_curr"),d.delete_visual("ptr_newNode"),d.record("complete",`Done! Successfully inserted ${n} into the circular linked list`),d.getSteps()
}

export function InsertIntoASortedCircularLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InsertIntoASortedCircularLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateInsertIntoASortedCircularLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Insert into a Sorted Circular Linked List"
      slug="insert-into-a-sorted-circular-linked-list"
      approaches={approaches}
      presets={InsertIntoASortedCircularLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// LRU Cache (lru-cache)
// ==========================================

const LruCacheTemplates = {
  "python": {
    "language": "python",
    "code": "def get(self, key: int) -> int:\n    for i, (k, v) in enumerate(self.cache):\n        if k == key:\n            self.cache.pop(i)\n            self.cache.insert(0, (k, v))\n            return v\n    return -1\n\ndef put(self, key: int, value: int) -> None:\n    for i, (k, _) in enumerate(self.cache):\n        if k == key:\n            self.cache.pop(i)\n            self.cache.insert(0, (key, value))\n            return\n    if len(self.cache) == self.capacity:\n        self.cache.pop()\n    self.cache.insert(0, (key, value))",
    "lineMap": {
      "-": [
        1
      ],
      "get_start": [
        1
      ],
      "get_scan": [
        2,
        3
      ],
      "get_move_to_front": [
        4,
        5
      ],
      "return_result": [
        6
      ],
      "get_miss": [
        7
      ],
      "return_miss": [
        7
      ],
      "put_start": [
        9
      ],
      "put_scan": [
        10,
        11
      ],
      "put_move_to_front": [
        12,
        13
      ],
      "check_capacity": [
        15
      ],
      "evict_lru": [
        16
      ],
      "insert_front": [
        17
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_matches": [
        3,
        11
      ],
      "at_capacity": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int get(int key) {\n    for (int i = 0; i < cache.size(); i++) {\n        if (cache.get(i)[0] == key) {\n            int[] entry = cache.remove(i);\n            cache.add(0, entry);\n            return entry[1];\n        }\n    }\n    return -1;\n}\npublic void put(int key, int value) {\n    for (int i = 0; i < cache.size(); i++) {\n        if (cache.get(i)[0] == key) {\n            cache.remove(i);\n            cache.add(0, new int[] {key, value});\n            return;\n        }\n    }\n    if (cache.size() == capacity) {\n        cache.remove(cache.size() - 1);\n    }\n    cache.add(0, new int[] {key, value});\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_start": [
        1
      ],
      "get_scan": [
        2,
        3
      ],
      "get_move_to_front": [
        4,
        5
      ],
      "return_result": [
        6
      ],
      "get_miss": [
        9
      ],
      "return_miss": [
        9
      ],
      "put_start": [
        11
      ],
      "put_scan": [
        12,
        13
      ],
      "put_move_to_front": [
        14,
        15
      ],
      "check_capacity": [
        19
      ],
      "evict_lru": [
        20
      ],
      "insert_front": [
        22
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_matches": [
        3,
        13
      ],
      "at_capacity": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int get(int key) {\n    for (int i = 0; i < cache.size(); i++) {\n        if (cache[i].first == key) {\n            auto entry = cache[i];\n            cache.erase(cache.begin() + i);\n            cache.insert(cache.begin(), entry);\n            return entry.second;\n        }\n    }\n    return -1;\n}\nvoid put(int key, int value) {\n    for (int i = 0; i < cache.size(); i++) {\n        if (cache[i].first == key) {\n            cache.erase(cache.begin() + i);\n            cache.insert(cache.begin(), {key, value});\n            return;\n        }\n    }\n    if (cache.size() == capacity) {\n        cache.pop_back();\n    }\n    cache.insert(cache.begin(), {key, value});\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_start": [
        1
      ],
      "get_scan": [
        2,
        3
      ],
      "get_move_to_front": [
        5,
        6
      ],
      "return_result": [
        7
      ],
      "get_miss": [
        10
      ],
      "return_miss": [
        10
      ],
      "put_start": [
        12
      ],
      "put_scan": [
        13,
        14
      ],
      "put_move_to_front": [
        15,
        16
      ],
      "check_capacity": [
        20
      ],
      "evict_lru": [
        21
      ],
      "insert_front": [
        23
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_matches": [
        3,
        14
      ],
      "at_capacity": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int Get(int key) {\n    for (int i = 0; i < cache.Count; i++) {\n        if (cache[i].Key == key) {\n            var entry = cache[i];\n            cache.RemoveAt(i);\n            cache.Insert(0, entry);\n            return entry.Value;\n        }\n    }\n    return -1;\n}\npublic void Put(int key, int value) {\n    for (int i = 0; i < cache.Count; i++) {\n        if (cache[i].Key == key) {\n            cache.RemoveAt(i);\n            cache.Insert(0, new KeyValuePair<int, int>(key, value));\n            return;\n        }\n    }\n    if (cache.Count == capacity) {\n        cache.RemoveAt(cache.Count - 1);\n    }\n    cache.Insert(0, new KeyValuePair<int, int>(key, value));\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_start": [
        1
      ],
      "get_scan": [
        2,
        3
      ],
      "get_move_to_front": [
        5,
        6
      ],
      "return_result": [
        7
      ],
      "get_miss": [
        10
      ],
      "return_miss": [
        10
      ],
      "put_start": [
        12
      ],
      "put_scan": [
        13,
        14
      ],
      "put_move_to_front": [
        15,
        16
      ],
      "check_capacity": [
        20
      ],
      "evict_lru": [
        21
      ],
      "insert_front": [
        23
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_matches": [
        3,
        14
      ],
      "at_capacity": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func (c *LRUCache) Get(key int) int {\n    for i, e := range c.cache {\n        if e[0] == key {\n            c.cache = append(c.cache[:i], c.cache[i+1:]...)\n            c.cache = append([][2]int{e}, c.cache...)\n            return e[1]\n        }\n    }\n    return -1\n}\nfunc (c *LRUCache) Put(key, value int) {\n    for i, e := range c.cache {\n        if e[0] == key {\n            c.cache = append(c.cache[:i], c.cache[i+1:]...)\n            c.cache = append([][2]int{{key, value}}, c.cache...)\n            return\n        }\n    }\n    if len(c.cache) == c.capacity {\n        c.cache = c.cache[:len(c.cache)-1]\n    }\n    c.cache = append([][2]int{{key, value}}, c.cache...)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_start": [
        1
      ],
      "get_scan": [
        2,
        3
      ],
      "get_move_to_front": [
        4,
        5
      ],
      "return_result": [
        6
      ],
      "get_miss": [
        9
      ],
      "return_miss": [
        9
      ],
      "put_start": [
        11
      ],
      "put_scan": [
        12,
        13
      ],
      "put_move_to_front": [
        14,
        15
      ],
      "check_capacity": [
        19
      ],
      "evict_lru": [
        20
      ],
      "insert_front": [
        22
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_matches": [
        3,
        13
      ],
      "at_capacity": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "get(key) {\n    for (let i = 0; i < this.cache.length; i++) {\n        if (this.cache[i][0] === key) {\n            const entry = this.cache.splice(i, 1)[0];\n            this.cache.unshift(entry);\n            return entry[1];\n        }\n    }\n    return -1;\n}\nput(key, value) {\n    for (let i = 0; i < this.cache.length; i++) {\n        if (this.cache[i][0] === key) {\n            this.cache.splice(i, 1);\n            this.cache.unshift([key, value]);\n            return;\n        }\n    }\n    if (this.cache.length === this.capacity) {\n        this.cache.pop();\n    }\n    this.cache.unshift([key, value]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_start": [
        1
      ],
      "get_scan": [
        2,
        3
      ],
      "get_move_to_front": [
        4,
        5
      ],
      "return_result": [
        6
      ],
      "get_miss": [
        9
      ],
      "return_miss": [
        9
      ],
      "put_start": [
        11
      ],
      "put_scan": [
        12,
        13
      ],
      "put_move_to_front": [
        14,
        15
      ],
      "check_capacity": [
        19
      ],
      "evict_lru": [
        20
      ],
      "insert_front": [
        22
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_matches": [
        3,
        13
      ],
      "at_capacity": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "get(key: number): number {\n    for (let i = 0; i < this.cache.length; i++) {\n        if (this.cache[i][0] === key) {\n            const entry = this.cache.splice(i, 1)[0];\n            this.cache.unshift(entry);\n            return entry[1];\n        }\n    }\n    return -1;\n}\nput(key: number, value: number): void {\n    for (let i = 0; i < this.cache.length; i++) {\n        if (this.cache[i][0] === key) {\n            this.cache.splice(i, 1);\n            this.cache.unshift([key, value]);\n            return;\n        }\n    }\n    if (this.cache.length === this.capacity) {\n        this.cache.pop();\n    }\n    this.cache.unshift([key, value]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_start": [
        1
      ],
      "get_scan": [
        2,
        3
      ],
      "get_move_to_front": [
        4,
        5
      ],
      "return_result": [
        6
      ],
      "get_miss": [
        9
      ],
      "return_miss": [
        9
      ],
      "put_start": [
        11
      ],
      "put_scan": [
        12,
        13
      ],
      "put_move_to_front": [
        14,
        15
      ],
      "check_capacity": [
        19
      ],
      "evict_lru": [
        20
      ],
      "insert_front": [
        22
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_matches": [
        3,
        13
      ],
      "at_capacity": [
        19
      ]
    }
  }
};

const LruCachePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "capacity": 2,
      "operations": [
        "put(1,1)",
        "put(2,2)",
        "get(1)",
        "put(3,3)",
        "get(2)",
        "put(4,4)",
        "get(1)",
        "get(3)",
        "get(4)"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Hits",
    "value": {
      "capacity": 3,
      "operations": [
        "put(1,1)",
        "put(2,2)",
        "put(3,3)",
        "get(1)",
        "get(2)",
        "get(3)",
        "get(1)"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Evictions",
    "value": {
      "capacity": 1,
      "operations": [
        "put(1,1)",
        "put(2,2)",
        "get(1)",
        "put(3,3)",
        "get(2)"
      ]
    }
  }
];

function generateLruCacheSteps(e: any): any[] {
  

let _lru_regex=/^(get|put)\(\s*(-?\d+)\s*(?:,\s*(-?\d+)\s*)?\)$/;
let r = {
  VZ: function(e){if(!Array.isArray(e))return[];let t=[];for(let a of e){if("string"!=typeof a)continue;let m=a.trim().match(_lru_regex);if(!m)continue;let r=m[1];if("put"===r&&void 0===m[3])continue;let n=Number(m[2]),l="put"===r?Number(m[3]):0;t.push({type:r,key:n,value:l,text:"put"===r?`put(${n},${l})`:`get(${n})`})}return t},
  eT: function(e){let t=Math.floor(Number(e));return Number.isFinite(t)&&t>0?Math.min(t,10):1},
  yk: function(e,t){let a=[],i=new Map;return t.map(t=>{let r=i.has(t.key);return(r&&a.splice(a.indexOf(t.key),1),"get"===t.type)?r?(a.unshift(t.key),i.get(t.key)):-1:(i.set(t.key,t.value),a.unshift(t.key),a.length>e&&i.delete(a.pop()),null)})}
};

let t=(0,r.eT)(e?.capacity),a=(0,r.VZ)(e?.operations),n=(0,r.yk)(t,a),l=[],s=new Map,o=[],c=new StepRecorder({ops:a.map(e=>e.text),opResults:n,results:o,capacity:t,opIdx:-1,size:0},{}),d=["key","val","exists","evictKey","evictVal","result"],u=()=>{for(let e of d)c.delete_variable(e)},p=()=>{c.update_variable("size",s.size),c.update_variable("mapEntries",Array.from(s.entries()).sort((e,t)=>e[0]-t[0]))},h=()=>{l.forEach((e,t)=>{c.update_visual(`node_${e}`,{type:"arrayElement",value:s.get(e),position:t,label:String(e)})})};c.record("-",`LRU Cache initialized with capacity ${t}: a hash map for O(1) lookup + a doubly linked list for recency order.`);let y=e=>{l.splice(l.indexOf(e),1),l.unshift(e)};for(let e=0;e<a.length;e++){let{type:i,key:r}=a[e];if(u(),c.update_variable("opIdx",e),c.update_variable("key",r),p(),h(),"get"===i){c.record("get_start",`Operation: get(${r})`);let e=s.has(r);if(c.add_conditional("key_exists",e),c.update_variable("exists",e),c.record("get_lookup",`Look up key ${r} in the map: ${e?"found":"not found"}`),e){y(r),h(),c.record("get_move_to_front",`Unlink node ${r} and relink it at the head: it is now the most recently used`);let e=s.get(r);c.update_variable("result",e),o.push(e),c.update_variable("results",[...o]),c.record("return_result",`Return value ${e}`)}else c.update_variable("result",-1),c.record("cache_miss",`Key ${r} is not in the cache`),o.push(-1),c.update_variable("results",[...o]),c.record("return_miss","Return -1")}else{let i=a[e].value;c.update_variable("val",i),c.record("put_start",`Operation: put(${r}, ${i})`);let n=s.has(r);if(c.add_conditional("key_exists",n),c.update_variable("exists",n),c.record("put_lookup",`Look up key ${r} in the map: ${n?"found, update it":"not found, insert a new node"}`),n)s.set(r,i),p(),h(),c.record("update_value",`Update node ${r}'s value to ${i}`),y(r),h(),c.record("put_move_to_front",`Unlink node ${r} and relink it at the head: it is now the most recently used`);else{s.set(r,i),p(),c.update_visual(`node_${r}`,{type:"arrayElement",value:i,position:0,label:String(r),stage:"staged"}),c.record("create_node",`Create node (${r}:${i}) and add it to the map`),l.unshift(r),h(),c.record("add_to_front",`Link node ${r} at the head (most recently used)`);let e=s.size>t;if(c.add_conditional("over_capacity",e),c.record("check_capacity",`Check capacity: size ${s.size} ${e?">":"≤"} capacity ${t}${e?", must evict the LRU node":", OK"}`),e){let e=l[l.length-1];c.update_variable("evictKey",e),c.update_variable("evictVal",s.get(e)),c.update_visual(`node_${e}`,{type:"arrayElement",value:s.get(e),position:l.length-1,label:String(e),state:"evicted"}),c.record("evict_lru",`The node before the tail (key ${e}) is the least recently used: evict it`),l.pop(),s.delete(e),c.delete_visual(`node_${e}`),p(),h(),c.record("remove_from_map",`Remove key ${e} from the map`)}}}}return u(),c.update_variable("opIdx",a.length),p(),h(),c.record("complete","All operations complete"),c.getSteps()
}

export function LruCacheProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LruCacheTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLruCacheSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="LRU Cache"
      slug="lru-cache"
      approaches={approaches}
      presets={LruCachePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Merge In Between Linked Lists (merge-in-between-linked-lists)
// ==========================================

const MergeInBetweenLinkedListsTemplates = {
  "python": {
    "language": "python",
    "code": "def mergeInBetween(list1, a, b, list2):\n    # Find the node just before the cut (index a-1)\n    before_cut = list1\n    for _ in range(a - 1):\n        before_cut = before_cut.next\n\n    # Find the node just after the cut (index b+1)\n    after_cut = before_cut\n    for _ in range(b - a + 2):\n        after_cut = after_cut.next\n\n    # Find the tail of list2\n    list2_tail = list2\n    while list2_tail.next:\n        list2_tail = list2_tail.next\n\n    # Rewire: before_cut → list2 head, list2 tail → after_cut\n    before_cut.next = list2\n    list2_tail.next = after_cut\n\n    return list1",
    "lineMap": {
      "-": [
        1
      ],
      "find_before_cut": [
        3,
        4,
        5
      ],
      "find_after_cut": [
        8,
        9,
        10
      ],
      "find_list2_tail": [
        13,
        14,
        15
      ],
      "splice": [
        18,
        19
      ],
      "connect_head": [
        18
      ],
      "connect_tail": [
        19
      ],
      "complete": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {\n    // Find the node just before the cut (index a-1)\n    ListNode beforeCut = list1;\n    for (int i = 0; i < a - 1; i++) {\n        beforeCut = beforeCut.next;\n    }\n\n    // Find the node just after the cut (index b+1)\n    ListNode afterCut = beforeCut;\n    for (int i = 0; i < b - a + 2; i++) {\n        afterCut = afterCut.next;\n    }\n\n    // Find the tail of list2\n    ListNode list2Tail = list2;\n    while (list2Tail.next != null) {\n        list2Tail = list2Tail.next;\n    }\n\n    // Rewire: beforeCut → list2 head, list2 tail → afterCut\n    beforeCut.next = list2;\n    list2Tail.next = afterCut;\n\n    return list1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_before_cut": [
        3,
        4,
        5
      ],
      "find_after_cut": [
        9,
        10,
        11
      ],
      "find_list2_tail": [
        15,
        16,
        17
      ],
      "splice": [
        21,
        22
      ],
      "connect_head": [
        21
      ],
      "connect_tail": [
        22
      ],
      "complete": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* mergeInBetween(ListNode* list1, int a, int b, ListNode* list2) {\n    // Find the node just before the cut (index a-1)\n    ListNode* beforeCut = list1;\n    for (int i = 0; i < a - 1; i++) {\n        beforeCut = beforeCut->next;\n    }\n\n    // Find the node just after the cut (index b+1)\n    ListNode* afterCut = beforeCut;\n    for (int i = 0; i < b - a + 2; i++) {\n        afterCut = afterCut->next;\n    }\n\n    // Find the tail of list2\n    ListNode* list2Tail = list2;\n    while (list2Tail->next != nullptr) {\n        list2Tail = list2Tail->next;\n    }\n\n    // Rewire: beforeCut → list2 head, list2 tail → afterCut\n    beforeCut->next = list2;\n    list2Tail->next = afterCut;\n\n    return list1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_before_cut": [
        3,
        4,
        5
      ],
      "find_after_cut": [
        9,
        10,
        11
      ],
      "find_list2_tail": [
        15,
        16,
        17
      ],
      "splice": [
        21,
        22
      ],
      "connect_head": [
        21
      ],
      "connect_tail": [
        22
      ],
      "complete": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode MergeInBetween(ListNode list1, int a, int b, ListNode list2) {\n    // Find the node just before the cut (index a-1)\n    ListNode beforeCut = list1;\n    for (int i = 0; i < a - 1; i++) {\n        beforeCut = beforeCut.next;\n    }\n\n    // Find the node just after the cut (index b+1)\n    ListNode afterCut = beforeCut;\n    for (int i = 0; i < b - a + 2; i++) {\n        afterCut = afterCut.next;\n    }\n\n    // Find the tail of list2\n    ListNode list2Tail = list2;\n    while (list2Tail.next != null) {\n        list2Tail = list2Tail.next;\n    }\n\n    // Rewire: beforeCut → list2 head, list2 tail → afterCut\n    beforeCut.next = list2;\n    list2Tail.next = afterCut;\n\n    return list1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_before_cut": [
        3,
        4,
        5
      ],
      "find_after_cut": [
        9,
        10,
        11
      ],
      "find_list2_tail": [
        15,
        16,
        17
      ],
      "splice": [
        21,
        22
      ],
      "connect_head": [
        21
      ],
      "connect_tail": [
        22
      ],
      "complete": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mergeInBetween(list1 *ListNode, a int, b int, list2 *ListNode) *ListNode {\n    // Find the node just before the cut (index a-1)\n    beforeCut := list1\n    for i := 0; i < a-1; i++ {\n        beforeCut = beforeCut.Next\n    }\n\n    // Find the node just after the cut (index b+1)\n    afterCut := beforeCut\n    for i := 0; i < b-a+2; i++ {\n        afterCut = afterCut.Next\n    }\n\n    // Find the tail of list2\n    list2Tail := list2\n    for list2Tail.Next != nil {\n        list2Tail = list2Tail.Next\n    }\n\n    // Rewire: beforeCut → list2 head, list2 tail → afterCut\n    beforeCut.Next = list2\n    list2Tail.Next = afterCut\n\n    return list1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_before_cut": [
        3,
        4,
        5
      ],
      "find_after_cut": [
        9,
        10,
        11
      ],
      "find_list2_tail": [
        15,
        16,
        17
      ],
      "splice": [
        21,
        22
      ],
      "connect_head": [
        21
      ],
      "connect_tail": [
        22
      ],
      "complete": [
        24
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function mergeInBetween(list1, a, b, list2) {\n    // Find the node just before the cut (index a-1)\n    let beforeCut = list1;\n    for (let i = 0; i < a - 1; i++) {\n        beforeCut = beforeCut.next;\n    }\n\n    // Find the node just after the cut (index b+1)\n    let afterCut = beforeCut;\n    for (let i = 0; i < b - a + 2; i++) {\n        afterCut = afterCut.next;\n    }\n\n    // Find the tail of list2\n    let list2Tail = list2;\n    while (list2Tail.next !== null) {\n        list2Tail = list2Tail.next;\n    }\n\n    // Rewire: beforeCut → list2 head, list2 tail → afterCut\n    beforeCut.next = list2;\n    list2Tail.next = afterCut;\n\n    return list1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_before_cut": [
        3,
        4,
        5
      ],
      "find_after_cut": [
        9,
        10,
        11
      ],
      "find_list2_tail": [
        15,
        16,
        17
      ],
      "splice": [
        21,
        22
      ],
      "connect_head": [
        21
      ],
      "connect_tail": [
        22
      ],
      "complete": [
        24
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mergeInBetween(list1: ListNode | null, a: number, b: number, list2: ListNode | null): ListNode | null {\n    // Find the node just before the cut (index a-1)\n    let beforeCut = list1;\n    for (let i = 0; i < a - 1; i++) {\n        beforeCut = beforeCut!.next;\n    }\n\n    // Find the node just after the cut (index b+1)\n    let afterCut: ListNode | null = beforeCut;\n    for (let i = 0; i < b - a + 2; i++) {\n        afterCut = afterCut!.next;\n    }\n\n    // Find the tail of list2\n    let list2Tail = list2;\n    while (list2Tail!.next !== null) {\n        list2Tail = list2Tail!.next;\n    }\n\n    // Rewire: beforeCut → list2 head, list2 tail → afterCut\n    beforeCut!.next = list2;\n    list2Tail!.next = afterCut;\n\n    return list1;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "find_before_cut": [
        3,
        4,
        5
      ],
      "find_after_cut": [
        9,
        10,
        11
      ],
      "find_list2_tail": [
        15,
        16,
        17
      ],
      "splice": [
        21,
        22
      ],
      "connect_head": [
        21
      ],
      "connect_tail": [
        22
      ],
      "complete": [
        24
      ]
    }
  }
};

const MergeInBetweenLinkedListsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "list1": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "list2": [
        7,
        8,
        9
      ],
      "a": 3,
      "b": 4
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "list1": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "list2": [
        8,
        9,
        10,
        11,
        12
      ],
      "a": 2,
      "b": 5
    }
  }
];

function generateMergeInBetweenLinkedListsSteps(e: any): any[] {
  

let t=e.list1,i=e.list2,r=e.a,n=e.b,s={};t.forEach((e,t)=>{s[`list1_node_${t}`]={type:"arrayElement",value:e,position:t,row:0}});for(let e=0;e<t.length-1;e++)s[`list1_arrow_${e}`]={type:"range",start:e,end:e+1,row:0};i.forEach((e,t)=>{s[`list2_node_${t}`]={type:"arrayElement",value:e,position:t,row:1}});for(let e=0;e<i.length-1;e++)s[`list2_arrow_${e}`]={type:"range",start:e,end:e+1,row:1};let a=new StepRecorder({},{...s});a.record("-","Start: merge list2 into list1 between positions a and b");for(let e=0;e<r;e++)a.update_visual(`list1_node_${e}`,{type:"arrayElement",value:t[e],position:e,row:0,state:"active"}),e<r-1&&(a.record("find_before_cut",`Traversing list1: at node ${e} (value ${t[e]})`),a.update_visual(`list1_node_${e}`,{type:"arrayElement",value:t[e],position:e,row:0,state:void 0}));let o=r-1;a.update_visual(`list1_node_${o}`,{type:"arrayElement",value:t[o],position:o,row:0,state:"comparing"}),a.add_new_visual("ptr_beforeCut",{type:"pointer",position:o,label:"beforeCut",row:0}),a.record("find_before_cut",`Found beforeCut at position ${o} (value ${t[o]})`);for(let e=r;e<=n;e++)a.update_visual(`list1_node_${e}`,{type:"arrayElement",value:t[e],position:e,row:0,state:"error"});let d=n+1;d<t.length&&(a.update_visual(`list1_node_${d}`,{type:"arrayElement",value:t[d],position:d,row:0,state:"comparing"}),a.add_new_visual("ptr_afterCut",{type:"pointer",position:d,label:"afterCut",row:0})),a.record("find_after_cut",`Marked nodes ${r} to ${n} for removal. afterCut at position ${d}${d>=t.length?" (null)":` (value ${t[d]})`}`);for(let e=0;e<i.length;e++)a.update_visual(`list2_node_${e}`,{type:"arrayElement",value:i[e],position:e,row:1,state:"highlight"});let u=i.length-1;a.add_new_visual("ptr_list2Tail",{type:"pointer",position:u,label:"list2Tail",row:1}),a.record("find_list2_tail",`Found list2Tail at position ${u} (value ${i[u]})`),o<t.length-1&&a.delete_visual(`list1_arrow_${o}`);for(let e=r;e<=n;e++)e<t.length-1&&a.delete_visual(`list1_arrow_${e}`);a.record("splice","Removed connections in the cut region");for(let e=r;e<=n;e++)a.delete_visual(`list1_node_${e}`);a.record("connect_head",`Connected beforeCut.next to list2 head (value ${i[0]})`),a.record("connect_tail",`Connected list2Tail.next to afterCut${d>=t.length?" (null)":` (value ${t[d]})`}`);for(let e=0;e<t.length;e++)a.get_visual(`list1_node_${e}`)&&a.delete_visual(`list1_node_${e}`);for(let e=0;e<t.length-1;e++)a.get_visual(`list1_arrow_${e}`)&&a.delete_visual(`list1_arrow_${e}`);for(let e=0;e<i.length;e++)a.delete_visual(`list2_node_${e}`);for(let e=0;e<i.length-1;e++)a.delete_visual(`list2_arrow_${e}`);a.delete_visual("ptr_beforeCut"),a.get_visual("ptr_afterCut")&&a.delete_visual("ptr_afterCut"),a.delete_visual("ptr_list2Tail");let c=[];for(let e=0;e<r;e++)c.push(t[e]);for(let e=0;e<i.length;e++)c.push(i[e]);for(let e=n+1;e<t.length;e++)c.push(t[e]);c.forEach((e,t)=>{let l;l=t<r?"sorted":t<r+i.length?"highlight":"sorted",a.add_new_visual(`merged_node_${t}`,{type:"arrayElement",value:e,position:t,row:0,state:l})});for(let e=0;e<c.length-1;e++)a.add_new_visual(`merged_arrow_${e}`,{type:"range",start:e,end:e+1,row:0});return a.record("complete",`Done! Merged list: [${c.join(" -> ")}]`),a.getSteps()
}

export function MergeInBetweenLinkedListsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MergeInBetweenLinkedListsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMergeInBetweenLinkedListsSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Merge In Between Linked Lists"
      slug="merge-in-between-linked-lists"
      approaches={approaches}
      presets={MergeInBetweenLinkedListsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Odd Even Linked List (odd-even-linked-list)
// ==========================================

const OddEvenLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "def oddEvenList(head):\n    if not head or not head.next:\n        return head\n\n    odd = head\n    even = head.next\n    even_head = even  # Save the start of the even chain\n\n    while even and even.next:\n        odd.next = even.next   # Odd skips over even\n        odd = odd.next\n        even.next = odd.next   # Even skips over odd\n        even = even.next\n\n    odd.next = even_head  # Connect odd chain to even chain\n    return head",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6,
        7
      ],
      "check_even": [
        9
      ],
      "link_odd": [
        10
      ],
      "advance_odd": [
        11
      ],
      "link_even": [
        12
      ],
      "advance_even": [
        13
      ],
      "connect": [
        15
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "check_even": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode oddEvenList(ListNode head) {\n    if (head == null || head.next == null) return head;\n\n    ListNode odd = head;\n    ListNode even = head.next;\n    ListNode evenHead = even; // Save the start of the even chain\n\n    while (even != null && even.next != null) {\n        odd.next = even.next;   // Odd skips over even\n        odd = odd.next;\n        even.next = odd.next;   // Even skips over odd\n        even = even.next;\n    }\n\n    odd.next = evenHead; // Connect odd chain to even chain\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "check_even": [
        8
      ],
      "link_odd": [
        9
      ],
      "advance_odd": [
        10
      ],
      "link_even": [
        11
      ],
      "advance_even": [
        12
      ],
      "connect": [
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_even": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* oddEvenList(ListNode* head) {\n    if (!head || !head->next) return head;\n\n    ListNode* odd = head;\n    ListNode* even = head->next;\n    ListNode* evenHead = even; // Save the start of the even chain\n\n    while (even && even->next) {\n        odd->next = even->next;   // Odd skips over even\n        odd = odd->next;\n        even->next = odd->next;   // Even skips over odd\n        even = even->next;\n    }\n\n    odd->next = evenHead; // Connect odd chain to even chain\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "check_even": [
        8
      ],
      "link_odd": [
        9
      ],
      "advance_odd": [
        10
      ],
      "link_even": [
        11
      ],
      "advance_even": [
        12
      ],
      "connect": [
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_even": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode OddEvenList(ListNode head) {\n    if (head == null || head.next == null) return head;\n\n    ListNode odd = head;\n    ListNode even = head.next;\n    ListNode evenHead = even; // Save the start of the even chain\n\n    while (even != null && even.next != null) {\n        odd.next = even.next;   // Odd skips over even\n        odd = odd.next;\n        even.next = odd.next;   // Even skips over odd\n        even = even.next;\n    }\n\n    odd.next = evenHead; // Connect odd chain to even chain\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "check_even": [
        8
      ],
      "link_odd": [
        9
      ],
      "advance_odd": [
        10
      ],
      "link_even": [
        11
      ],
      "advance_even": [
        12
      ],
      "connect": [
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_even": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func oddEvenList(head *ListNode) *ListNode {\n    if head == nil || head.Next == nil {\n        return head\n    }\n\n    odd := head\n    even := head.Next\n    evenHead := even // Save the start of the even chain\n\n    for even != nil && even.Next != nil {\n        odd.Next = even.Next   // Odd skips over even\n        odd = odd.Next\n        even.Next = odd.Next   // Even skips over odd\n        even = even.Next\n    }\n\n    odd.Next = evenHead // Connect odd chain to even chain\n    return head\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "check_even": [
        10
      ],
      "link_odd": [
        11
      ],
      "advance_odd": [
        12
      ],
      "link_even": [
        13
      ],
      "advance_even": [
        14
      ],
      "connect": [
        17
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "check_even": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function oddEvenList(head) {\n    if (!head || !head.next) return head;\n\n    var odd = head;\n    var even = head.next;\n    var evenHead = even; // Save the start of the even chain\n\n    while (even && even.next) {\n        odd.next = even.next;   // Odd skips over even\n        odd = odd.next;\n        even.next = odd.next;   // Even skips over odd\n        even = even.next;\n    }\n\n    odd.next = evenHead; // Connect odd chain to even chain\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "check_even": [
        8
      ],
      "link_odd": [
        9
      ],
      "advance_odd": [
        10
      ],
      "link_even": [
        11
      ],
      "advance_even": [
        12
      ],
      "connect": [
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_even": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function oddEvenList(head: ListNode | null): ListNode | null {\n    if (!head || !head.next) return head;\n\n    let odd: ListNode = head;\n    let even: ListNode | null = head.next;\n    const evenHead: ListNode = even; // Save the start of the even chain\n\n    while (even && even.next) {\n        odd.next = even.next;   // Odd skips over even\n        odd = odd.next;\n        even.next = odd.next;   // Even skips over odd\n        even = even.next;\n    }\n\n    odd.next = evenHead; // Connect odd chain to even chain\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "check_even": [
        8
      ],
      "link_odd": [
        9
      ],
      "advance_odd": [
        10
      ],
      "link_even": [
        11
      ],
      "advance_even": [
        12
      ],
      "connect": [
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_even": [
        8
      ]
    }
  }
};

const OddEvenLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "List 1",
    "value": {
      "values": [
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
    "label": "List 2",
    "value": {
      "values": [
        2,
        1,
        3,
        5,
        6,
        4,
        7
      ]
    }
  },
  {
    "id": "ex3",
    "label": "List 3",
    "value": {
      "values": [
        1,
        2,
        3
      ]
    }
  }
];

function generateOddEvenLinkedListSteps(e: any): any[] {
  class r{constructor(e,n){this.val=void 0===e?0:e,this.next=void 0===n?null:n}}function d(e){return null===e?null:`Node(${e.val})`}

let n=e.values,a=null;if(n.length>0){let e=a=new r(n[0]);for(let a=1;a<n.length;a++)e.next=new r(n[a]),e=e.next}let i={};n.forEach((e,n)=>{i[`node_${n}`]={type:"arrayElement",value:e,position:n}});let l={};for(let e=0;e<n.length-1;e++)l[`arrow_${e}`]={type:"range",start:e,end:e+1};let o=new StepRecorder({values:n},{...i,...l,ptr_head:{type:"pointer",position:0,label:"head"}});if(o.record("-","Start: Odd Even Linked List - rearrange nodes so all odd-indexed nodes come before even-indexed nodes"),null===a||null===a.next)return null!==a&&o.update_visual("node_0",{type:"arrayElement",value:n[0],position:0,state:"active"}),o.record("complete","List has 0 or 1 node, already in correct order"),o.getSteps();let s=a,u=a.next,c=u,v=0,p=1,h=n.length;for(o.update_visual("node_0",{type:"arrayElement",value:n[0],position:0,state:"active"}),o.update_visual("node_1",{type:"arrayElement",value:n[1],position:1,state:"highlight"}),o.add_new_visual("ptr_odd",{type:"pointer",position:0,label:"odd"}),o.add_new_visual("ptr_even",{type:"pointer",position:1,label:"even"}),o.add_new_visual("ptr_evenHead",{type:"pointer",position:1,label:"evenHead"}),o.record("initialize","Initialize: odd = head, even = head.next, evenHead = even");null!==u&&null!==u.next;){o.add_conditional("check_even",!0),o.record("check_even",`Check: even (${d(u)}) != null and even.next (${d(u.next)}) != null → true`);let e=p+1;s.next=u.next,o.delete_visual(`arrow_${v}`);let a=`arrow_${h++}`;if(o.add_new_visual(a,{type:"range",start:v,end:e}),o.update_visual(`node_${e}`,{type:"arrayElement",value:n[e],position:e,state:"comparing"}),o.record("link_odd",`odd.next = even.next: link node ${n[v]} → node ${n[e]}`),s=s.next,v=e,o.update_visual("ptr_odd",{type:"pointer",position:v,label:"odd"}),o.update_visual(`node_${v}`,{type:"arrayElement",value:n[v],position:v,state:"active"}),o.record("advance_odd",`Advance odd pointer to node ${n[v]}`),u.next=s.next,o.delete_visual(`arrow_${p}`),null!==s.next){let e=v+1,a=`arrow_${h++}`;o.add_new_visual(a,{type:"range",start:p,end:e}),o.update_visual(`node_${e}`,{type:"arrayElement",value:n[e],position:e,state:"comparing"}),o.record("link_even",`even.next = odd.next: link node ${n[p]} → node ${n[e]}`)}else o.record("link_even",`even.next = odd.next: link node ${n[p]} → null`);if(null!==(u=u.next)){let e=p;p=v+1,o.update_visual("ptr_even",{type:"pointer",position:p,label:"even"}),o.update_visual(`node_${p}`,{type:"arrayElement",value:n[p],position:p,state:"highlight"}),o.update_visual(`node_${e}`,{type:"arrayElement",value:n[e],position:e,state:"highlight"}),o.record("advance_even",`Advance even pointer to node ${n[p]}`)}else o.delete_visual("ptr_even"),o.record("advance_even","Advance even pointer: even = null, loop will end")}null===u?(o.add_conditional("check_even",!1),o.record("check_even","Check: even == null → exit loop")):(o.add_conditional("check_even",!1),o.record("check_even","Check: even.next == null → exit loop")),s.next=c;let _=`arrow_${h++}`;o.add_new_visual(_,{type:"range",start:v,end:1});for(let e=0;e<n.length;e++)o.update_visual(`node_${e}`,{type:"arrayElement",value:n[e],position:e,state:e%2==0?"sorted":"highlight"});o.record("connect",`Connect odd chain to even chain: odd.next = evenHead (node ${c.val})`),o.delete_visual("ptr_odd"),o.delete_visual("ptr_even"),o.delete_visual("ptr_evenHead");let g=n.length,x=[];for(let e=0;e<g;e+=2)x.push(e);for(let e=1;e<g;e+=2)x.push(e);x.forEach((e,a)=>{o.update_visual(`node_${e}`,{type:"arrayElement",value:n[e],position:a,state:e%2==0?"sorted":"highlight"})});for(let e=0;e<h;e++)o.delete_visual(`arrow_${e}`);for(let e=0;e<g-1;e++)o.add_new_visual(`arrow_linear_${e}`,{type:"range",start:e,end:e+1});return o.record("complete","Done! Odd-indexed nodes are followed by even-indexed nodes"),o.getSteps()
}

export function OddEvenLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: OddEvenLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateOddEvenLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Odd Even Linked List"
      slug="odd-even-linked-list"
      approaches={approaches}
      presets={OddEvenLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Palindrome Linked List (palindrome-linked-list)
// ==========================================

const PalindromeLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def isPalindrome(self, head: ListNode) -> bool:\n        if not head or not head.next:\n            return True\n\n        # Step 1: Find the middle using slow/fast pointers\n        slow = head\n        fast = head\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n\n        # Step 2: Reverse the second half\n        prev = None\n        curr = slow\n        while curr:\n            next_node = curr.next\n            curr.next = prev\n            prev = curr\n            curr = next_node\n\n        # Step 3: Compare both halves\n        left = head\n        right = prev\n        while right:\n            if left.val != right.val:\n                return False\n            left = left.next\n            right = right.next\n        return True",
    "lineMap": {
      "-": [
        2
      ],
      "init_slow_fast": [
        7,
        8
      ],
      "move_slow_fast": [
        10,
        11
      ],
      "reverse_init": [
        14,
        15
      ],
      "reverse_step": [
        17,
        18,
        19,
        20
      ],
      "compare_init": [
        23,
        24
      ],
      "compare": [
        26
      ],
      "mismatch": [
        27
      ],
      "match": [
        28,
        29
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "while_fast": [
        9
      ],
      "while_right": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean isPalindrome(ListNode head) {\n        if (head == null || head.next == null) {\n            return true;\n        }\n\n        // Step 1: Find the middle using slow/fast pointers\n        ListNode slow = head;\n        ListNode fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n        }\n\n        // Step 2: Reverse the second half\n        ListNode prev = null;\n        ListNode curr = slow;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n\n        // Step 3: Compare both halves\n        ListNode left = head;\n        ListNode right = prev;\n        while (right != null) {\n            if (left.val != right.val) {\n                return false;\n            }\n            left = left.next;\n            right = right.next;\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_slow_fast": [
        8,
        9
      ],
      "move_slow_fast": [
        11,
        12
      ],
      "reverse_init": [
        16,
        17
      ],
      "reverse_step": [
        19,
        20,
        21,
        22
      ],
      "compare_init": [
        26,
        27
      ],
      "compare": [
        29
      ],
      "mismatch": [
        30
      ],
      "match": [
        32,
        33
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "while_fast": [
        10
      ],
      "while_right": [
        28
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool isPalindrome(ListNode* head) {\n        if (head == nullptr || head->next == nullptr) {\n            return true;\n        }\n\n        // Step 1: Find the middle using slow/fast pointers\n        ListNode* slow = head;\n        ListNode* fast = head;\n        while (fast != nullptr && fast->next != nullptr) {\n            slow = slow->next;\n            fast = fast->next->next;\n        }\n\n        // Step 2: Reverse the second half\n        ListNode* prev = nullptr;\n        ListNode* curr = slow;\n        while (curr != nullptr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n\n        // Step 3: Compare both halves\n        ListNode* left = head;\n        ListNode* right = prev;\n        while (right != nullptr) {\n            if (left->val != right->val) {\n                return false;\n            }\n            left = left->next;\n            right = right->next;\n        }\n        return true;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init_slow_fast": [
        9,
        10
      ],
      "move_slow_fast": [
        12,
        13
      ],
      "reverse_init": [
        17,
        18
      ],
      "reverse_step": [
        20,
        21,
        22,
        23
      ],
      "compare_init": [
        27,
        28
      ],
      "compare": [
        30
      ],
      "mismatch": [
        31
      ],
      "match": [
        33,
        34
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "while_fast": [
        11
      ],
      "while_right": [
        29
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool IsPalindrome(ListNode head) {\n        if (head == null || head.next == null) {\n            return true;\n        }\n\n        // Step 1: Find the middle using slow/fast pointers\n        ListNode slow = head;\n        ListNode fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n        }\n\n        // Step 2: Reverse the second half\n        ListNode prev = null;\n        ListNode curr = slow;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n\n        // Step 3: Compare both halves\n        ListNode left = head;\n        ListNode right = prev;\n        while (right != null) {\n            if (left.val != right.val) {\n                return false;\n            }\n            left = left.next;\n            right = right.next;\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_slow_fast": [
        8,
        9
      ],
      "move_slow_fast": [
        11,
        12
      ],
      "reverse_init": [
        16,
        17
      ],
      "reverse_step": [
        19,
        20,
        21,
        22
      ],
      "compare_init": [
        26,
        27
      ],
      "compare": [
        29
      ],
      "mismatch": [
        30
      ],
      "match": [
        32,
        33
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "while_fast": [
        10
      ],
      "while_right": [
        28
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isPalindrome(head *ListNode) bool {\n    if head == nil || head.Next == nil {\n        return true\n    }\n\n    // Step 1: Find the middle using slow/fast pointers\n    slow := head\n    fast := head\n    for fast != nil && fast.Next != nil {\n        slow = slow.Next\n        fast = fast.Next.Next\n    }\n\n    // Step 2: Reverse the second half\n    var prev *ListNode\n    curr := slow\n    for curr != nil {\n        next := curr.Next\n        curr.Next = prev\n        prev = curr\n        curr = next\n    }\n\n    // Step 3: Compare both halves\n    left := head\n    right := prev\n    for right != nil {\n        if left.Val != right.Val {\n            return false\n        }\n        left = left.Next\n        right = right.Next\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow_fast": [
        7,
        8
      ],
      "move_slow_fast": [
        10,
        11
      ],
      "reverse_init": [
        15,
        16
      ],
      "reverse_step": [
        18,
        19,
        20,
        21
      ],
      "compare_init": [
        25,
        26
      ],
      "compare": [
        28
      ],
      "mismatch": [
        29
      ],
      "match": [
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "while_fast": [
        9
      ],
      "while_right": [
        27
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var isPalindrome = function(head) {\n    if (head === null || head.next === null) {\n        return true;\n    }\n\n    // Step 1: Find the middle using slow/fast pointers\n    var slow = head;\n    var fast = head;\n    while (fast !== null && fast.next !== null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    // Step 2: Reverse the second half\n    var prev = null;\n    var curr = slow;\n    while (curr !== null) {\n        var next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n\n    // Step 3: Compare both halves\n    var left = head;\n    var right = prev;\n    while (right !== null) {\n        if (left.val !== right.val) {\n            return false;\n        }\n        left = left.next;\n        right = right.next;\n    }\n    return true;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow_fast": [
        7,
        8
      ],
      "move_slow_fast": [
        10,
        11
      ],
      "reverse_init": [
        15,
        16
      ],
      "reverse_step": [
        18,
        19,
        20,
        21
      ],
      "compare_init": [
        25,
        26
      ],
      "compare": [
        28
      ],
      "mismatch": [
        29
      ],
      "match": [
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "while_fast": [
        9
      ],
      "while_right": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isPalindrome(head: ListNode | null): boolean {\n    if (head === null || head.next === null) {\n        return true;\n    }\n\n    // Step 1: Find the middle using slow/fast pointers\n    let slow: ListNode = head;\n    let fast: ListNode | null = head;\n    while (fast !== null && fast.next !== null) {\n        slow = slow.next!;\n        fast = fast.next.next;\n    }\n\n    // Step 2: Reverse the second half\n    let prev: ListNode | null = null;\n    let curr: ListNode | null = slow;\n    while (curr !== null) {\n        const next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n\n    // Step 3: Compare both halves\n    let left: ListNode | null = head;\n    let right: ListNode | null = prev;\n    while (right !== null) {\n        if (left!.val !== right.val) {\n            return false;\n        }\n        left = left!.next;\n        right = right.next;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow_fast": [
        7,
        8
      ],
      "move_slow_fast": [
        10,
        11
      ],
      "reverse_init": [
        15,
        16
      ],
      "reverse_step": [
        18,
        19,
        20,
        21
      ],
      "compare_init": [
        25,
        26
      ],
      "compare": [
        28
      ],
      "mismatch": [
        29
      ],
      "match": [
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "while_fast": [
        9
      ],
      "while_right": [
        27
      ]
    }
  }
};

const PalindromeLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Palindrome (even)",
    "value": {
      "values": [
        1,
        2,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Not Palindrome",
    "value": {
      "values": [
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Palindrome (odd)",
    "value": {
      "values": [
        1,
        2,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single Node",
    "value": {
      "values": [
        1
      ]
    }
  }
];

function generatePalindromeLinkedListSteps(e: any): any[] {
  class a{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}

let t=e.values,l=null;if(t.length>0){let e=l=new a(t[0]);for(let l=1;l<t.length;l++)e.next=new a(t[l]),e=e.next}let i={};t.forEach((e,t)=>{i[`node_${t}`]={type:"arrayElement",value:e,position:t}});for(let e=0;e<t.length-1;e++)i[`arrow_${e}`]={type:"range",start:e,end:e+1};let n=new StepRecorder({},{...i,ptr_head:{type:"pointer",position:0,label:"head"}});if(n.record("-","Start: Check if linked list is a palindrome"),t.length<=1)return t.forEach((e,l)=>{n.update_visual(`node_${l}`,{type:"arrayElement",value:t[l],position:l,state:"sorted"})}),n.record("complete","Single node or empty list is always a palindrome. Return true."),n.getSteps();let s=l,o=l,p=0,u=0;for(n.add_new_visual("ptr_slow",{type:"pointer",position:0,label:"slow"}),n.add_new_visual("ptr_fast",{type:"pointer",position:0,label:"fast"}),n.update_visual("node_0",{type:"arrayElement",value:t[0],position:0,state:"active"}),n.record("init_slow_fast","Initialize slow = head, fast = head");null!==o&&null!==o.next;)n.add_conditional("while_fast",!0),n.update_visual(`node_${p}`,{type:"arrayElement",value:t[p],position:p}),u!==p&&u<t.length&&n.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u}),s=s.next,o=o.next.next,p++,u+=2,n.update_visual("ptr_slow",{type:"pointer",position:p,label:"slow"}),null!==o?n.update_visual("ptr_fast",{type:"pointer",position:u,label:"fast"}):n.delete_visual("ptr_fast"),n.update_visual(`node_${p}`,{type:"arrayElement",value:t[p],position:p,state:"active"}),null!==o&&u<t.length&&n.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u,state:"comparing"}),n.record("move_slow_fast",`Move slow to node ${p} (val=${t[p]}), fast to ${null!==o?`node ${u} (val=${t[u]})`:"null"}`);n.add_conditional("while_fast",!1),n.update_visual(`node_${p}`,{type:"arrayElement",value:t[p],position:p}),null!==o&&u<t.length&&n.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u}),n.delete_visual("ptr_fast"),n.record("move_slow_fast",`Loop ends: fast is ${null===o?"null":"at last node"}. Slow is at middle (node ${p}).`);let d=null,c=s,h=p;for(n.add_new_visual("ptr_prev",{type:"pointer",position:p-1,label:"prev"}),n.add_new_visual("ptr_curr",{type:"pointer",position:p,label:"curr"}),n.delete_visual("ptr_slow"),n.record("reverse_init",`Initialize reversal: prev = null, curr = slow (node ${p})`);null!==c;){let e=c.next,l=h+1;h<t.length-1&&n.delete_visual(`arrow_${h}`),null!==d&&n.add_new_visual(`arrow_${h}_rev`,{type:"range",start:h,end:h-1}),c.next=d,d=c,c=e,n.update_visual("ptr_prev",{type:"pointer",position:h,label:"prev"}),null!==c?n.update_visual("ptr_curr",{type:"pointer",position:l,label:"curr"}):n.delete_visual("ptr_curr"),h=l,n.record("reverse_step",`Reverse: point node ${h-1} backward. prev = node ${h-1}, curr = ${null!==c?`node ${h}`:"null"}`)}let v=l,m=d,f=0,_=t.length-1;n.delete_visual("ptr_prev"),n.add_new_visual("ptr_left",{type:"pointer",position:0,label:"left"}),n.add_new_visual("ptr_right",{type:"pointer",position:_,label:"right"}),n.record("compare_init","Initialize comparison: left = head, right = prev (reversed half head)");let g=!0;for(;null!==m;){if(n.add_conditional("while_right",!0),n.update_visual(`node_${f}`,{type:"arrayElement",value:t[f],position:f,state:"comparing"}),n.update_visual(`node_${_}`,{type:"arrayElement",value:t[_],position:_,state:"comparing"}),n.record("compare",`Compare left.val (${v.val}) with right.val (${m.val})`),v.val!==m.val){n.update_visual(`node_${f}`,{type:"arrayElement",value:t[f],position:f,state:"error"}),n.update_visual(`node_${_}`,{type:"arrayElement",value:t[_],position:_,state:"error"}),n.record("mismatch",`Mismatch: ${v.val} != ${m.val}. Not a palindrome. Return false.`),g=!1;break}n.update_visual(`node_${f}`,{type:"arrayElement",value:t[f],position:f,state:"sorted"}),n.update_visual(`node_${_}`,{type:"arrayElement",value:t[_],position:_,state:"sorted"}),n.record("match",`Match: ${v.val} == ${m.val}`),v=v.next,m=m.next,f++,_--,null!==m?(n.update_visual("ptr_left",{type:"pointer",position:f,label:"left"}),n.update_visual("ptr_right",{type:"pointer",position:_,label:"right"})):(n.delete_visual("ptr_left"),n.delete_visual("ptr_right"))}return g?(n.add_conditional("while_right",!1),n.record("complete","All nodes matched. The linked list is a palindrome. Return true.")):n.record("complete","The linked list is not a palindrome. Return false."),n.getSteps()
}

export function PalindromeLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PalindromeLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePalindromeLinkedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Palindrome Linked List"
      slug="palindrome-linked-list"
      approaches={approaches}
      presets={PalindromeLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Duplicates from Sorted List (remove-duplicates-from-sorted-list)
// ==========================================

const RemoveDuplicatesFromSortedListTemplates = {
  "python": {
    "language": "python",
    "code": "def deleteDuplicates(head):\n    current = head\n\n    while current and current.next:\n        if current.val == current.next.val:\n            # Skip the duplicate node\n            current.next = current.next.next\n        else:\n            # Move to the next distinct node\n            current = current.next\n\n    return head",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_duplicate": [
        4,
        5
      ],
      "skip_duplicate": [
        7
      ],
      "move_forward": [
        10
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_duplicate": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public ListNode deleteDuplicates(ListNode head) {\n    ListNode current = head;\n\n    while (current != null && current.next != null) {\n        if (current.val == current.next.val) {\n            // Skip the duplicate node\n            current.next = current.next.next;\n        } else {\n            // Move to the next distinct node\n            current = current.next;\n        }\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_duplicate": [
        4,
        5
      ],
      "skip_duplicate": [
        7
      ],
      "move_forward": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_duplicate": [
        5
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "ListNode* deleteDuplicates(ListNode* head) {\n    ListNode* current = head;\n\n    while (current && current->next) {\n        if (current->val == current->next->val) {\n            // Skip the duplicate node\n            ListNode* duplicate = current->next;\n            current->next = current->next->next;\n            delete duplicate;\n        } else {\n            // Move to the next distinct node\n            current = current->next;\n        }\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_duplicate": [
        4,
        5
      ],
      "skip_duplicate": [
        8
      ],
      "move_forward": [
        12
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_duplicate": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public ListNode DeleteDuplicates(ListNode head) {\n    ListNode current = head;\n\n    while (current != null && current.next != null) {\n        if (current.val == current.next.val) {\n            // Skip the duplicate node\n            current.next = current.next.next;\n        } else {\n            // Move to the next distinct node\n            current = current.next;\n        }\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_duplicate": [
        4,
        5
      ],
      "skip_duplicate": [
        7
      ],
      "move_forward": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_duplicate": [
        5
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func deleteDuplicates(head *ListNode) *ListNode {\n    current := head\n\n    for current != nil && current.Next != nil {\n        if current.Val == current.Next.Val {\n            // Skip the duplicate node\n            current.Next = current.Next.Next\n        } else {\n            // Move to the next distinct node\n            current = current.Next\n        }\n    }\n\n    return head\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_duplicate": [
        4,
        5
      ],
      "skip_duplicate": [
        7
      ],
      "move_forward": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_duplicate": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function deleteDuplicates(head) {\n    var current = head;\n\n    while (current !== null && current.next !== null) {\n        if (current.val === current.next.val) {\n            // Skip the duplicate node\n            current.next = current.next.next;\n        } else {\n            // Move to the next distinct node\n            current = current.next;\n        }\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_duplicate": [
        4,
        5
      ],
      "skip_duplicate": [
        7
      ],
      "move_forward": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_duplicate": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function deleteDuplicates(head: ListNode | null): ListNode | null {\n    let current = head;\n\n    while (current !== null && current.next !== null) {\n        if (current.val === current.next.val) {\n            // Skip the duplicate node\n            current.next = current.next.next;\n        } else {\n            // Move to the next distinct node\n            current = current.next;\n        }\n    }\n\n    return head;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_duplicate": [
        4,
        5
      ],
      "skip_duplicate": [
        7
      ],
      "move_forward": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_duplicate": [
        5
      ]
    }
  }
};

const RemoveDuplicatesFromSortedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "values": [
        1,
        1,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "values": [
        1,
        1,
        2,
        3,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Same",
    "value": {
      "values": [
        1,
        1,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "No Duplicates",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  }
];

function generateRemoveDuplicatesFromSortedListSteps(e: any): any[] {
  class l{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}

let t=e.values,n=null;if(t.length>0){let e=n=new l(t[0]);for(let n=1;n<t.length;n++)e.next=new l(t[n]),e=e.next}let i={};t.forEach((e,t)=>{i[`node_${t}`]={type:"arrayElement",value:e,position:t}});for(let e=0;e<t.length-1;e++)i[`arrow_${e}`]={type:"range",start:e,end:e+1};t.length>0&&(i.ptr_head={type:"pointer",position:0,label:"head"});let a=new StepRecorder({},i);if(a.record("-","Start: Remove duplicates from sorted linked list"),null===n)return a.record("complete","List is empty, nothing to do"),a.getSteps();let s=n,o=0,u=t.map((e,t)=>t),d=t.map((e,t)=>t);for(a.add_new_visual("ptr_current",{type:"pointer",position:0,label:"current"}),a.update_visual(`node_${o}`,{type:"arrayElement",value:t[o],position:d[o],state:"active"}),a.record("initialize","Initialize current = head");null!==s&&null!==s.next;)if(s.val===s.next.val){a.add_conditional("check_duplicate",!0);let e=u.indexOf(o),n=u[e+1];a.update_visual(`node_${n}`,{type:"arrayElement",value:t[n],position:d[n],state:"error"}),a.record("skip_duplicate",`current.val == current.next.val (${s.val} == ${s.next.val}), duplicate found`);let r=u.indexOf(n),l=r+1<u.length?u[r+1]:null;a.delete_visual(`arrow_${o}`),a.delete_visual(`arrow_${n}`),a.delete_visual(`node_${n}`),u.splice(r,1);let i=u.indexOf(o)+1;for(let e=i;e<u.length;e++){let n=u[e];d[n]-=1,a.update_visual(`node_${n}`,{type:"arrayElement",value:t[n],position:d[n]})}null!==l&&a.add_new_visual(`arrow_${o}`,{type:"range",start:d[o],end:d[l]});for(let e=i;e<u.length-1;e++){let t=u[e],n=u[e+1];a.update_visual(`arrow_${t}`,{type:"range",start:d[t],end:d[n]})}a.update_visual(`node_${o}`,{type:"arrayElement",value:t[o],position:d[o],state:"active"}),a.update_visual("ptr_current",{type:"pointer",position:d[o],label:"current"}),s.next=s.next.next,a.record("skip_duplicate","Removed duplicate: current.next = current.next.next")}else{a.add_conditional("check_duplicate",!1),a.update_visual(`node_${o}`,{type:"arrayElement",value:t[o],position:d[o],state:"visited"}),s=s.next;let e=u.indexOf(o);o=u[e+1],a.update_visual("ptr_current",{type:"pointer",position:d[o],label:"current"}),a.update_visual(`node_${o}`,{type:"arrayElement",value:t[o],position:d[o],state:"active"}),a.record("move_forward",`current.val != current.next.val, move current forward to node ${s.val}`)}for(let e of(a.update_visual(`node_${o}`,{type:"arrayElement",value:t[o],position:d[o],state:"visited"}),u))a.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:d[e],state:"result"});return a.delete_visual("ptr_current"),a.record("complete","Done! All duplicates removed. Return head."),a.getSteps()
}

export function RemoveDuplicatesFromSortedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveDuplicatesFromSortedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveDuplicatesFromSortedListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Remove Duplicates from Sorted List"
      slug="remove-duplicates-from-sorted-list"
      approaches={approaches}
      presets={RemoveDuplicatesFromSortedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reorder List (reorder-list)
// ==========================================

const ReorderListTemplates = {
  "python": {
    "language": "python",
    "code": "def reorderList(head):\n    if not head or not head.next:\n        return\n\n    # Step 1: Find the middle using slow/fast pointers\n    slow, fast = head, head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n\n    # Step 2: Reverse the second half\n    prev, curr = None, slow.next\n    slow.next = None  # Disconnect the two halves\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n\n    # Step 3: Merge the two halves alternately\n    first, second = head, prev\n    while second:\n        tmp1, tmp2 = first.next, second.next\n        first.next = second\n        second.next = tmp1\n        first = tmp1\n        second = tmp2",
    "lineMap": {
      "-": [
        1
      ],
      "find_middle": [
        6
      ],
      "move_slow_fast": [
        7,
        8,
        9
      ],
      "disconnect": [
        12,
        13
      ],
      "reverse_init": [
        12
      ],
      "reverse_step": [
        14,
        15,
        16,
        17,
        18
      ],
      "merge_init": [
        21
      ],
      "merge_step": [
        22,
        23,
        24,
        25,
        26,
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "while_fast": [
        7
      ],
      "while_curr": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void reorderList(ListNode head) {\n    if (head == null || head.next == null) return;\n\n    // Step 1: Find the middle using slow/fast pointers\n    ListNode slow = head, fast = head;\n    while (fast.next != null && fast.next.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    // Step 2: Reverse the second half\n    ListNode prev = null, curr = slow.next;\n    slow.next = null; // Disconnect the two halves\n    while (curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n\n    // Step 3: Merge the two halves alternately\n    ListNode first = head, second = prev;\n    while (second != null) {\n        ListNode tmp1 = first.next, tmp2 = second.next;\n        first.next = second;\n        second.next = tmp1;\n        first = tmp1;\n        second = tmp2;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_middle": [
        5
      ],
      "move_slow_fast": [
        6,
        7,
        8
      ],
      "disconnect": [
        12,
        13
      ],
      "reverse_init": [
        12
      ],
      "reverse_step": [
        14,
        15,
        16,
        17,
        18
      ],
      "merge_init": [
        22
      ],
      "merge_step": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "while_fast": [
        6
      ],
      "while_curr": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void reorderList(ListNode* head) {\n    if (!head || !head->next) return;\n\n    // Step 1: Find the middle using slow/fast pointers\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n\n    // Step 2: Reverse the second half\n    ListNode* prev = nullptr;\n    ListNode* curr = slow->next;\n    slow->next = nullptr; // Disconnect the two halves\n    while (curr) {\n        ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n\n    // Step 3: Merge the two halves alternately\n    ListNode* first = head;\n    ListNode* second = prev;\n    while (second) {\n        ListNode* tmp1 = first->next;\n        ListNode* tmp2 = second->next;\n        first->next = second;\n        second->next = tmp1;\n        first = tmp1;\n        second = tmp2;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_middle": [
        5
      ],
      "move_slow_fast": [
        7,
        8,
        9
      ],
      "disconnect": [
        13,
        14,
        15
      ],
      "reverse_init": [
        13
      ],
      "reverse_step": [
        16,
        17,
        18,
        19,
        20
      ],
      "merge_init": [
        24
      ],
      "merge_step": [
        26,
        27,
        28,
        29,
        30,
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "while_fast": [
        7
      ],
      "while_curr": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void ReorderList(ListNode head) {\n    if (head == null || head.next == null) return;\n\n    // Step 1: Find the middle using slow/fast pointers\n    ListNode slow = head, fast = head;\n    while (fast.next != null && fast.next.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    // Step 2: Reverse the second half\n    ListNode prev = null, curr = slow.next;\n    slow.next = null; // Disconnect the two halves\n    while (curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n\n    // Step 3: Merge the two halves alternately\n    ListNode first = head, second = prev;\n    while (second != null) {\n        ListNode tmp1 = first.next, tmp2 = second.next;\n        first.next = second;\n        second.next = tmp1;\n        first = tmp1;\n        second = tmp2;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_middle": [
        5
      ],
      "move_slow_fast": [
        6,
        7,
        8
      ],
      "disconnect": [
        12,
        13
      ],
      "reverse_init": [
        12
      ],
      "reverse_step": [
        14,
        15,
        16,
        17,
        18
      ],
      "merge_init": [
        22
      ],
      "merge_step": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "while_fast": [
        6
      ],
      "while_curr": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reorderList(head *ListNode) {\n    if head == nil || head.Next == nil {\n        return\n    }\n\n    // Step 1: Find the middle using slow/fast pointers\n    slow, fast := head, head\n    for fast.Next != nil && fast.Next.Next != nil {\n        slow = slow.Next\n        fast = fast.Next.Next\n    }\n\n    // Step 2: Reverse the second half\n    var prev *ListNode\n    curr := slow.Next\n    slow.Next = nil // Disconnect the two halves\n    for curr != nil {\n        next := curr.Next\n        curr.Next = prev\n        prev = curr\n        curr = next\n    }\n\n    // Step 3: Merge the two halves alternately\n    first, second := head, prev\n    for second != nil {\n        tmp1, tmp2 := first.Next, second.Next\n        first.Next = second\n        second.Next = tmp1\n        first = tmp1\n        second = tmp2\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_middle": [
        7
      ],
      "move_slow_fast": [
        8,
        9,
        10
      ],
      "disconnect": [
        14,
        15,
        16
      ],
      "reverse_init": [
        14
      ],
      "reverse_step": [
        17,
        18,
        19,
        20,
        21
      ],
      "merge_init": [
        25
      ],
      "merge_step": [
        26,
        27,
        28,
        29,
        30,
        31
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "while_fast": [
        8
      ],
      "while_curr": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function reorderList(head) {\n    if (!head || !head.next) return;\n\n    // Step 1: Find the middle using slow/fast pointers\n    var slow = head, fast = head;\n    while (fast.next && fast.next.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    // Step 2: Reverse the second half\n    var prev = null, curr = slow.next;\n    slow.next = null; // Disconnect the two halves\n    while (curr) {\n        var next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n\n    // Step 3: Merge the two halves alternately\n    var first = head, second = prev;\n    while (second) {\n        var tmp1 = first.next, tmp2 = second.next;\n        first.next = second;\n        second.next = tmp1;\n        first = tmp1;\n        second = tmp2;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_middle": [
        5
      ],
      "move_slow_fast": [
        6,
        7,
        8
      ],
      "disconnect": [
        12,
        13
      ],
      "reverse_init": [
        12
      ],
      "reverse_step": [
        14,
        15,
        16,
        17,
        18
      ],
      "merge_init": [
        22
      ],
      "merge_step": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "while_fast": [
        6
      ],
      "while_curr": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reorderList(head: ListNode | null): void {\n    if (!head || !head.next) return;\n\n    // Step 1: Find the middle using slow/fast pointers\n    let slow: ListNode = head, fast: ListNode = head;\n    while (fast.next && fast.next.next) {\n        slow = slow.next!;\n        fast = fast.next.next;\n    }\n\n    // Step 2: Reverse the second half\n    let prev: ListNode | null = null;\n    let curr: ListNode | null = slow.next;\n    slow.next = null; // Disconnect the two halves\n    while (curr) {\n        const next: ListNode | null = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n\n    // Step 3: Merge the two halves alternately\n    let first: ListNode | null = head;\n    let second: ListNode | null = prev;\n    while (second) {\n        const tmp1: ListNode | null = first!.next;\n        const tmp2: ListNode | null = second.next;\n        first!.next = second;\n        second.next = tmp1;\n        first = tmp1;\n        second = tmp2;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_middle": [
        5
      ],
      "move_slow_fast": [
        6,
        7,
        8
      ],
      "disconnect": [
        12,
        13,
        14
      ],
      "reverse_init": [
        12
      ],
      "reverse_step": [
        15,
        16,
        17,
        18,
        19
      ],
      "merge_init": [
        23
      ],
      "merge_step": [
        25,
        26,
        27,
        28,
        29,
        30,
        31
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "while_fast": [
        6
      ],
      "while_curr": [
        15
      ]
    }
  }
};

const ReorderListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Even Length",
    "value": {
      "values": [
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Odd Length",
    "value": {
      "values": [
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
    "label": "Longer List",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Small",
    "value": {
      "values": [
        1,
        2,
        3
      ]
    }
  }
];

function generateReorderListSteps(e: any): any[] {
  class l{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}

let t=e.values;if(0===t.length)return[];let r=new l(t[0]),i=r;for(let e=1;e<t.length;e++)i.next=new l(t[e]),i=i.next;let s={};t.forEach((e,t)=>{s[`node_${t}`]={type:"arrayElement",value:e,position:t}});for(let e=0;e<t.length-1;e++)s[`arrow_${e}`]={type:"range",start:e,end:e+1};let o=new StepRecorder({},{...s,ptr_head:{type:"pointer",position:0,label:"head"}});if(o.record("-","Start: Reorder the linked list L0 -> Ln -> L1 -> Ln-1 -> ..."),t.length<=2)return t.forEach((e,r)=>{o.update_visual(`node_${r}`,{type:"arrayElement",value:t[r],position:r,state:"sorted"})}),o.record("complete","List has fewer than 3 nodes, already in order."),o.getSteps();let a=r,d=r,p=0,u=0;for(o.add_new_visual("ptr_slow",{type:"pointer",position:0,label:"slow"}),o.add_new_visual("ptr_fast",{type:"pointer",position:0,label:"fast"}),o.update_visual("node_0",{type:"arrayElement",value:t[0],position:0,state:"active"}),o.record("find_middle","Phase 1: Find the middle. Initialize slow = head, fast = head.");null!==d.next&&null!==d.next.next;)o.add_conditional("while_fast",!0),o.update_visual(`node_${p}`,{type:"arrayElement",value:t[p],position:p}),u!==p&&o.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u}),a=a.next,d=d.next.next,p++,u+=2,o.update_visual(`node_${p}`,{type:"arrayElement",value:t[p],position:p,state:"active"}),o.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u,state:"comparing"}),o.update_visual("ptr_slow",{type:"pointer",position:p,label:"slow"}),o.update_visual("ptr_fast",{type:"pointer",position:u,label:"fast"}),o.record("move_slow_fast",`Move slow to node ${a.val} (index ${p}), fast to node ${d.val} (index ${u}).`);o.add_conditional("while_fast",!1),o.delete_visual("ptr_fast"),o.update_visual(`node_${u}`,{type:"arrayElement",value:t[u],position:u}),o.record("move_slow_fast",`Fast reached end. Slow at node ${a.val} (index ${p}), end of first half.`);let c=p+1;o.delete_visual(`arrow_${p}`),o.delete_visual("ptr_slow"),o.update_visual(`node_${p}`,{type:"arrayElement",value:t[p],position:p}),o.record("disconnect","Disconnect: slow.next = null. Split list into two halves.");let h=-1,_=c;for(o.add_new_visual("ptr_prev",{type:"pointer",position:c-1,label:"prev"}),o.add_new_visual("ptr_curr",{type:"pointer",position:c,label:"curr"}),o.update_visual(`node_${_}`,{type:"arrayElement",value:t[_],position:_,state:"highlight"}),o.record("reverse_init","Phase 2: Reverse second half. Initialize prev = null, curr = slow.next.");_<t.length;){o.add_conditional("while_curr",!0);let e=_+1<t.length?_+1:-1;_<t.length-1&&o.delete_visual(`arrow_${_}`),h>=c&&o.add_new_visual(`arrow_rev_${_}`,{type:"range",start:_,end:h}),h=_,_=e>=0?e:t.length,o.update_visual(`node_${h}`,{type:"arrayElement",value:t[h],position:h,state:"highlight"}),o.update_visual("ptr_prev",{type:"pointer",position:h,label:"prev"}),_<t.length?(o.update_visual("ptr_curr",{type:"pointer",position:_,label:"curr"}),o.update_visual(`node_${_}`,{type:"arrayElement",value:t[_],position:_,state:"highlight"})):o.delete_visual("ptr_curr"),o.record("reverse_step",`Reverse: node ${t[h]} now points to ${h>c?"node "+t[h-1]:"null"}. Move prev and curr forward.`)}o.add_conditional("while_curr",!1),o.delete_visual("ptr_curr"),o.delete_visual("ptr_prev");for(let e=c;e<t.length;e++)o.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:e});o.record("reverse_step",`Second half fully reversed. prev = node ${t[t.length-1]}.`);let f=[];for(let e=0;e<=p;e++)f.push(e);let v=[];for(let e=t.length-1;e>=c;e--)v.push(e);for(let e=0;e<t.length-1;e++)o.delete_visual(`arrow_${e}`);for(let e=c;e<t.length;e++)o.delete_visual(`arrow_rev_${e}`);f.forEach((e,r)=>{o.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:2*r})}),v.forEach((e,r)=>{o.update_visual(`node_${e}`,{type:"arrayElement",value:t[e],position:2*r+1})}),o.add_new_visual("ptr_first",{type:"pointer",position:0,label:"first"}),o.add_new_visual("ptr_second",{type:"pointer",position:1,label:"second"}),o.record("merge_init","Phase 3: Merge alternately. first = head, second = reversed second half head.");for(let e=0;e<v.length;e++){let r=f[e],n=v[e],l=2*e,i=2*e+1,s=e+1<f.length;o.update_visual(`node_${r}`,{type:"arrayElement",value:t[r],position:l,state:"sorted"}),o.update_visual(`node_${n}`,{type:"arrayElement",value:t[n],position:i,state:"sorted"}),o.add_new_visual(`arrow_merge_${l}`,{type:"range",start:l,end:i}),s&&(o.add_new_visual(`arrow_merge_${i}`,{type:"range",start:i,end:i+1}),o.update_visual(`node_${f[e+1]}`,{type:"arrayElement",value:t[f[e+1]],position:i+1,state:"sorted"})),s?o.update_visual("ptr_first",{type:"pointer",position:l+2,label:"first"}):o.delete_visual("ptr_first"),e+1<v.length?o.update_visual("ptr_second",{type:"pointer",position:i+2,label:"second"}):o.delete_visual("ptr_second"),o.record("merge_step",`Interleave: ${t[r]} -> ${t[n]}. first.next = second, second.next = next first.`)}o.delete_visual("ptr_first"),o.delete_visual("ptr_second");let g=Array(t.length),x=0,w=0,m=0;for(;m<v.length;)g[x++]=t[f[w++]],g[x++]=t[v[m++]];return w<f.length&&(g[x++]=t[f[w++]]),o.record("complete",`Done! Reordered list: ${g.join(" -> ")}`),o.getSteps()
}

export function ReorderListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReorderListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReorderListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Reorder List"
      slug="reorder-list"
      approaches={approaches}
      presets={ReorderListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sort List (sort-list)
// ==========================================

const SortListTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        if not head or not head.next:\n            return head\n\n        # Count total nodes\n        length = 0\n        current = head\n        while current:\n            length += 1\n            current = current.next\n\n        dummy = ListNode(0)\n        dummy.next = head\n\n        # Double the merge size each pass\n        merge_size = 1\n        while merge_size < length:\n            tail = dummy\n            current = dummy.next\n\n            while current:\n                # Split off left sublist of merge_size nodes\n                left = current\n                right = self.split(left, merge_size)\n\n                # Split off right sublist of merge_size nodes\n                current = self.split(right, merge_size)\n\n                # Merge left and right, attach to tail\n                merged_head, merged_tail = self.merge_and_get_tail(left, right)\n                tail.next = merged_head\n                tail = merged_tail\n\n            merge_size *= 2\n\n        return dummy.next\n\n    def split(self, head: Optional[ListNode], size: int) -> Optional[ListNode]:\n        if not head:\n            return None\n\n        for _ in range(1, size):\n            if not head.next:\n                break\n            head = head.next\n\n        second = head.next\n        head.next = None\n        return second\n\n    def merge_and_get_tail(self, l1: Optional[ListNode], l2: Optional[ListNode]):\n        dummy = ListNode(0)\n        current = dummy\n\n        while l1 and l2:\n            if l1.val <= l2.val:\n                current.next = l1\n                l1 = l1.next\n            else:\n                current.next = l2\n                l2 = l2.next\n            current = current.next\n\n        current.next = l1 if l1 else l2\n\n        # Advance to the tail\n        while current.next:\n            current = current.next\n\n        return dummy.next, current",
    "lineMap": {
      "-": [
        2
      ],
      "count_nodes": [
        7,
        8,
        9,
        10,
        11
      ],
      "init_merge_size": [
        17
      ],
      "start_pass": [
        19,
        20
      ],
      "split_left": [
        24,
        25
      ],
      "split_right": [
        28
      ],
      "merge_complete": [
        31,
        32,
        33
      ],
      "compare": [
        56,
        57
      ],
      "pick_left": [
        58,
        59
      ],
      "pick_right": [
        61,
        62
      ],
      "append_remaining": [
        65
      ],
      "double_size": [
        35
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public ListNode sortList(ListNode head) {\n        if (head == null || head.next == null) {\n            return head;\n        }\n\n        // Count total nodes\n        int length = 0;\n        ListNode current = head;\n        while (current != null) {\n            length++;\n            current = current.next;\n        }\n\n        ListNode dummy = new ListNode(0);\n        dummy.next = head;\n\n        // Double the merge size each pass\n        for (int mergeSize = 1; mergeSize < length; mergeSize *= 2) {\n            ListNode tail = dummy;\n            current = dummy.next;\n\n            while (current != null) {\n                // Split off left sublist of mergeSize nodes\n                ListNode left = current;\n                ListNode right = split(left, mergeSize);\n\n                // Split off right sublist of mergeSize nodes\n                current = split(right, mergeSize);\n\n                // Merge left and right, attach to tail\n                ListNode[] merged = mergeAndGetTail(left, right);\n                tail.next = merged[0];\n                tail = merged[1];\n            }\n        }\n\n        return dummy.next;\n    }\n\n    // Splits the list after 'size' nodes. Returns head of the second part.\n    private ListNode split(ListNode head, int size) {\n        if (head == null) {\n            return null;\n        }\n\n        for (int i = 1; i < size && head.next != null; i++) {\n            head = head.next;\n        }\n\n        ListNode second = head.next;\n        head.next = null;\n        return second;\n    }\n\n    // Merges two sorted lists. Returns [head, tail] of merged list.\n    private ListNode[] mergeAndGetTail(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0);\n        ListNode current = dummy;\n\n        while (l1 != null && l2 != null) {\n            if (l1.val <= l2.val) {\n                current.next = l1;\n                l1 = l1.next;\n            } else {\n                current.next = l2;\n                l2 = l2.next;\n            }\n            current = current.next;\n        }\n\n        current.next = (l1 != null) ? l1 : l2;\n\n        // Advance to the tail\n        while (current.next != null) {\n            current = current.next;\n        }\n\n        return new ListNode[]{dummy.next, current};\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "count_nodes": [
        8,
        9,
        10,
        11,
        12
      ],
      "init_merge_size": [
        19
      ],
      "start_pass": [
        20,
        21
      ],
      "split_left": [
        25,
        26
      ],
      "split_right": [
        29
      ],
      "merge_complete": [
        32,
        33,
        34
      ],
      "compare": [
        61,
        62
      ],
      "pick_left": [
        63,
        64
      ],
      "pick_right": [
        66,
        67
      ],
      "append_remaining": [
        72
      ],
      "double_size": [
        19
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    ListNode* sortList(ListNode* head) {\n        if (head == nullptr || head->next == nullptr) {\n            return head;\n        }\n\n        // Count total nodes\n        int length = 0;\n        ListNode* current = head;\n        while (current != nullptr) {\n            length++;\n            current = current->next;\n        }\n\n        ListNode dummy(0);\n        dummy.next = head;\n\n        // Double the merge size each pass\n        for (int mergeSize = 1; mergeSize < length; mergeSize *= 2) {\n            ListNode* tail = &dummy;\n            current = dummy.next;\n\n            while (current != nullptr) {\n                // Split off left sublist of mergeSize nodes\n                ListNode* left = current;\n                ListNode* right = split(left, mergeSize);\n\n                // Split off right sublist of mergeSize nodes\n                current = split(right, mergeSize);\n\n                // Merge left and right, attach to tail\n                auto [mergedHead, mergedTail] = mergeAndGetTail(left, right);\n                tail->next = mergedHead;\n                tail = mergedTail;\n            }\n        }\n\n        return dummy.next;\n    }\n\nprivate:\n    ListNode* split(ListNode* head, int size) {\n        if (head == nullptr) {\n            return nullptr;\n        }\n\n        for (int i = 1; i < size && head->next != nullptr; i++) {\n            head = head->next;\n        }\n\n        ListNode* second = head->next;\n        head->next = nullptr;\n        return second;\n    }\n\n    pair<ListNode*, ListNode*> mergeAndGetTail(ListNode* l1, ListNode* l2) {\n        ListNode dummy(0);\n        ListNode* current = &dummy;\n\n        while (l1 != nullptr && l2 != nullptr) {\n            if (l1->val <= l2->val) {\n                current->next = l1;\n                l1 = l1->next;\n            } else {\n                current->next = l2;\n                l2 = l2->next;\n            }\n            current = current->next;\n        }\n\n        current->next = (l1 != nullptr) ? l1 : l2;\n\n        while (current->next != nullptr) {\n            current = current->next;\n        }\n\n        return {dummy.next, current};\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "count_nodes": [
        9,
        10,
        11,
        12,
        13
      ],
      "init_merge_size": [
        20
      ],
      "start_pass": [
        21,
        22
      ],
      "split_left": [
        26,
        27
      ],
      "split_right": [
        30
      ],
      "merge_complete": [
        33,
        34,
        35
      ],
      "compare": [
        61,
        62
      ],
      "pick_left": [
        63,
        64
      ],
      "pick_right": [
        66,
        67
      ],
      "append_remaining": [
        72
      ],
      "double_size": [
        20
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public ListNode SortList(ListNode head) {\n        if (head == null || head.next == null) {\n            return head;\n        }\n\n        // Count total nodes\n        int length = 0;\n        ListNode current = head;\n        while (current != null) {\n            length++;\n            current = current.next;\n        }\n\n        ListNode dummy = new ListNode(0);\n        dummy.next = head;\n\n        // Double the merge size each pass\n        for (int mergeSize = 1; mergeSize < length; mergeSize *= 2) {\n            ListNode tail = dummy;\n            current = dummy.next;\n\n            while (current != null) {\n                // Split off left sublist of mergeSize nodes\n                ListNode left = current;\n                ListNode right = Split(left, mergeSize);\n\n                // Split off right sublist of mergeSize nodes\n                current = Split(right, mergeSize);\n\n                // Merge left and right, attach to tail\n                var merged = MergeAndGetTail(left, right);\n                tail.next = merged.Item1;\n                tail = merged.Item2;\n            }\n        }\n\n        return dummy.next;\n    }\n\n    private ListNode Split(ListNode head, int size) {\n        if (head == null) {\n            return null;\n        }\n\n        for (int i = 1; i < size && head.next != null; i++) {\n            head = head.next;\n        }\n\n        ListNode second = head.next;\n        head.next = null;\n        return second;\n    }\n\n    private (ListNode, ListNode) MergeAndGetTail(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0);\n        ListNode current = dummy;\n\n        while (l1 != null && l2 != null) {\n            if (l1.val <= l2.val) {\n                current.next = l1;\n                l1 = l1.next;\n            } else {\n                current.next = l2;\n                l2 = l2.next;\n            }\n            current = current.next;\n        }\n\n        current.next = (l1 != null) ? l1 : l2;\n\n        while (current.next != null) {\n            current = current.next;\n        }\n\n        return (dummy.next, current);\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "count_nodes": [
        8,
        9,
        10,
        11,
        12
      ],
      "init_merge_size": [
        19
      ],
      "start_pass": [
        20,
        21
      ],
      "split_left": [
        25,
        26
      ],
      "split_right": [
        29
      ],
      "merge_complete": [
        32,
        33,
        34
      ],
      "compare": [
        59,
        60
      ],
      "pick_left": [
        61,
        62
      ],
      "pick_right": [
        64,
        65
      ],
      "append_remaining": [
        70
      ],
      "double_size": [
        19
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func sortList(head *ListNode) *ListNode {\n    if head == nil || head.Next == nil {\n        return head\n    }\n\n    // Count total nodes\n    length := 0\n    current := head\n    for current != nil {\n        length++\n        current = current.Next\n    }\n\n    dummy := &ListNode{}\n    dummy.Next = head\n\n    // Double the merge size each pass\n    for mergeSize := 1; mergeSize < length; mergeSize *= 2 {\n        tail := dummy\n        current = dummy.Next\n\n        for current != nil {\n            // Split off left sublist of mergeSize nodes\n            left := current\n            right := split(left, mergeSize)\n\n            // Split off right sublist of mergeSize nodes\n            current = split(right, mergeSize)\n\n            // Merge left and right, attach to tail\n            mergedHead, mergedTail := mergeAndGetTail(left, right)\n            tail.Next = mergedHead\n            tail = mergedTail\n        }\n    }\n\n    return dummy.Next\n}\n\nfunc split(head *ListNode, size int) *ListNode {\n    if head == nil {\n        return nil\n    }\n\n    for i := 1; i < size && head.Next != nil; i++ {\n        head = head.Next\n    }\n\n    second := head.Next\n    head.Next = nil\n    return second\n}\n\nfunc mergeAndGetTail(l1 *ListNode, l2 *ListNode) (*ListNode, *ListNode) {\n    dummy := &ListNode{}\n    current := dummy\n\n    for l1 != nil && l2 != nil {\n        if l1.Val <= l2.Val {\n            current.Next = l1\n            l1 = l1.Next\n        } else {\n            current.Next = l2\n            l2 = l2.Next\n        }\n        current = current.Next\n    }\n\n    if l1 != nil {\n        current.Next = l1\n    } else {\n        current.Next = l2\n    }\n\n    for current.Next != nil {\n        current = current.Next\n    }\n\n    return dummy.Next, current\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_nodes": [
        7,
        8,
        9,
        10,
        11
      ],
      "init_merge_size": [
        18
      ],
      "start_pass": [
        19,
        20
      ],
      "split_left": [
        24,
        25
      ],
      "split_right": [
        28
      ],
      "merge_complete": [
        31,
        32,
        33
      ],
      "compare": [
        58,
        59
      ],
      "pick_left": [
        60,
        61
      ],
      "pick_right": [
        63,
        64
      ],
      "append_remaining": [
        69,
        70,
        71,
        72
      ],
      "double_size": [
        18
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var sortList = function (head) {\n  if (head === null || head.next === null) {\n    return head;\n  }\n\n  // Count total nodes\n  var length = 0;\n  var current = head;\n  while (current !== null) {\n    length++;\n    current = current.next;\n  }\n\n  var dummy = new ListNode(0);\n  dummy.next = head;\n\n  // Double the merge size each pass\n  for (var mergeSize = 1; mergeSize < length; mergeSize *= 2) {\n    var tail = dummy;\n    current = dummy.next;\n\n    while (current !== null) {\n      // Split off left sublist of mergeSize nodes\n      var left = current;\n      var right = splitList(left, mergeSize);\n\n      // Split off right sublist of mergeSize nodes\n      current = splitList(right, mergeSize);\n\n      // Merge left and right, attach to tail\n      var merged = mergeAndGetTail(left, right);\n      tail.next = merged[0];\n      tail = merged[1];\n    }\n  }\n\n  return dummy.next;\n};\n\nfunction splitList(head, size) {\n  if (head === null) {\n    return null;\n  }\n\n  for (var i = 1; i < size && head.next !== null; i++) {\n    head = head.next;\n  }\n\n  var second = head.next;\n  head.next = null;\n  return second;\n}\n\nfunction mergeAndGetTail(l1, l2) {\n  var dummy = new ListNode(0);\n  var current = dummy;\n\n  while (l1 !== null && l2 !== null) {\n    if (l1.val <= l2.val) {\n      current.next = l1;\n      l1 = l1.next;\n    } else {\n      current.next = l2;\n      l2 = l2.next;\n    }\n    current = current.next;\n  }\n\n  current.next = l1 !== null ? l1 : l2;\n\n  while (current.next !== null) {\n    current = current.next;\n  }\n\n  return [dummy.next, current];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_nodes": [
        7,
        8,
        9,
        10,
        11
      ],
      "init_merge_size": [
        18
      ],
      "start_pass": [
        19,
        20
      ],
      "split_left": [
        24,
        25
      ],
      "split_right": [
        28
      ],
      "merge_complete": [
        31,
        32,
        33
      ],
      "compare": [
        58,
        59
      ],
      "pick_left": [
        60,
        61
      ],
      "pick_right": [
        63,
        64
      ],
      "append_remaining": [
        69
      ],
      "double_size": [
        18
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function sortList(head: ListNode | null): ListNode | null {\n    if (head === null || head.next === null) {\n        return head;\n    }\n\n    // Count total nodes\n    let length = 0;\n    let current: ListNode | null = head;\n    while (current !== null) {\n        length++;\n        current = current.next;\n    }\n\n    const dummy = new ListNode(0);\n    dummy.next = head;\n\n    // Double the merge size each pass\n    for (let mergeSize = 1; mergeSize < length; mergeSize *= 2) {\n        let tail: ListNode = dummy;\n        current = dummy.next;\n\n        while (current !== null) {\n            // Split off left sublist of mergeSize nodes\n            const left: ListNode | null = current;\n            const right: ListNode | null = splitList(left, mergeSize);\n\n            // Split off right sublist of mergeSize nodes\n            current = splitList(right, mergeSize);\n\n            // Merge left and right, attach to tail\n            const [mergedHead, mergedTail] = mergeAndGetTail(left, right);\n            tail.next = mergedHead;\n            tail = mergedTail;\n        }\n    }\n\n    return dummy.next;\n}\n\nfunction splitList(head: ListNode | null, size: number): ListNode | null {\n    if (head === null) {\n        return null;\n    }\n\n    for (let i = 1; i < size && head.next !== null; i++) {\n        head = head.next;\n    }\n\n    const second = head.next;\n    head.next = null;\n    return second;\n}\n\nfunction mergeAndGetTail(l1: ListNode | null, l2: ListNode | null): [ListNode | null, ListNode] {\n    const dummy = new ListNode(0);\n    let current: ListNode = dummy;\n\n    while (l1 !== null && l2 !== null) {\n        if (l1.val <= l2.val) {\n            current.next = l1;\n            l1 = l1.next;\n        } else {\n            current.next = l2;\n            l2 = l2.next;\n        }\n        current = current.next;\n    }\n\n    current.next = l1 !== null ? l1 : l2;\n\n    while (current.next !== null) {\n        current = current.next;\n    }\n\n    return [dummy.next, current];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_nodes": [
        7,
        8,
        9,
        10,
        11
      ],
      "init_merge_size": [
        18
      ],
      "start_pass": [
        19,
        20
      ],
      "split_left": [
        24,
        25
      ],
      "split_right": [
        28
      ],
      "merge_complete": [
        31,
        32,
        33
      ],
      "compare": [
        58,
        59
      ],
      "pick_left": [
        60,
        61
      ],
      "pick_right": [
        63,
        64
      ],
      "append_remaining": [
        69
      ],
      "double_size": [
        18
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {}
  }
};

const SortListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "values": [
        4,
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Medium",
    "value": {
      "values": [
        8,
        3,
        5,
        1,
        7,
        2,
        6,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Small",
    "value": {
      "values": [
        2,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "values": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Reverse Sorted",
    "value": {
      "values": [
        5,
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex6",
    "label": "Single",
    "value": {
      "values": [
        1
      ]
    }
  }
];

function generateSortListSteps(e: any): any[] {
  class n{constructor(e,t){this.val=void 0===e?0:e,this.next=void 0===t?null:t}}

let t=e.values,r=t.length;if(r>0){let e=new n(t[0]);for(let l=1;l<r;l++)e.next=new n(t[l]),e=e.next}let i=t.map((e,t)=>t),a={};t.forEach((e,t)=>{a[`node_${t}`]={type:"arrayElement",value:e,position:t}});for(let e=0;e<r-1;e++)a[`arrow_${e}`]={type:"range",start:e,end:e+1};a.merge_size_badge={type:"metadata",value:""};let s=new StepRecorder({values:[...t],totalNodes:void 0,mergeSize:void 0},a);if(s.record("-","Start of algorithm: Sort linked list using bottom-up merge sort"),r<=1)return 1===r&&s.update_visual("node_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),s.update_visual("merge_size_badge",{type:"metadata",value:""}),s.record("complete","List is already sorted"),s.getSteps();function o(){for(let e=0;e<r;e++)s.delete_visual(`arrow_${e}`);for(let e=0;e<r-1;e++)s.update_visual(`arrow_${e}`,{type:"range",start:e,end:e+1})}function d(e){for(let l=0;l<r;l++){let r=i[l];s.update_visual(`node_${r}`,{type:"arrayElement",value:t[r],position:l,state:e?.[l]||void 0})}}s.update_variable("totalNodes",r),s.record("count_nodes",`Count total nodes in the list: ${r}`);let u=[...t],c=1;for(s.update_variable("mergeSize",c),s.update_visual("merge_size_badge",{type:"metadata",value:`Merge Size: ${c}`}),s.record("init_merge_size",`Initialize merge size = ${c}`);c<r;){s.update_visual("merge_size_badge",{type:"metadata",value:`Merge Size: ${c}`}),s.record("start_pass",`Start pass with merge size = ${c}`);let e=0;for(;e<r;){let t=e,l=Math.min(e+c,r),n=Math.min(e+2*c,r);if(l>=r)break;let a={};for(let e=t;e<l;e++)a[e]="left";d(a),s.record("split_left",`Left sublist: positions [${t}..${l-1}] = [${u.slice(t,l).join(", ")}]`);let g={};for(let e=t;e<l;e++)g[e]="left";for(let e=l;e<n;e++)g[e]="right";d(g),s.record("split_right",`Right sublist: positions [${l}..${n-1}] = [${u.slice(l,n).join(", ")}]`);let h=[],m=[],f=t,p=l;for(;f<l&&p<n;){let e={};for(let r=t;r<l;r++)e[r]="left";for(let t=l;t<n;t++)e[t]="right";if(e[f]="comparing",e[p]="comparing",d(e),s.record("compare",`Compare ${u[f]} (left) with ${u[p]} (right)`),u[f]<=u[p]){h.push(u[f]),m.push(i[f]);let e={};for(let r=t;r<l;r++)e[r]="left";for(let t=l;t<n;t++)e[t]="right";e[f]="merged",d(e),s.record("pick_left",`Pick ${u[f]} from left sublist`),f++}else{h.push(u[p]),m.push(i[p]);let e={};for(let r=t;r<l;r++)e[r]="left";for(let t=l;t<n;t++)e[t]="right";e[p]="merged",d(e),s.record("pick_right",`Pick ${u[p]} from right sublist`),p++}}for(;f<l;)h.push(u[f]),m.push(i[f]),f++;for(;p<n;)h.push(u[p]),m.push(i[p]),p++;if(f!==l+(l-t)||p!==n){let e={};for(let r=t;r<n;r++)e[r]="merged";d(e),s.record("append_remaining","Append remaining elements to merged result")}for(let e=0;e<h.length;e++)u[t+e]=h[e],i[t+e]=m[e];let x={};for(let e=t;e<n;e++)x[e]="merged";d(x),o(),s.record("merge_complete",`Merge complete: [${u.slice(t,n).join(", ")}]`),d(),o(),e+=2*c}c*=2,s.update_variable("mergeSize",c),c<r&&(s.update_visual("merge_size_badge",{type:"metadata",value:`Merge Size: ${c}`}),s.record("double_size",`Double merge size to ${c}`))}let g={};for(let e=0;e<r;e++)g[e]="sorted";return d(g),o(),s.update_visual("merge_size_badge",{type:"metadata",value:"Sorted!"}),s.record("complete",`Sort complete! List is sorted: [${u.join(", ")}]`),s.getSteps()
}

export function SortListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SortListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSortListSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Sort List"
      slug="sort-list"
      approaches={approaches}
      presets={SortListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
