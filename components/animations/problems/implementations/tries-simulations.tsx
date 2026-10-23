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
let Gu = _treeHelper848569.Gu;
let kU = _treeHelper848569.kU;
let E4 = _treeHelper848569.E4;

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
// Search Suggestions System (search-suggestions-system)
// ==========================================

const SearchSuggestionsSystemTemplates = {
  "python": {
    "language": "python",
    "code": "from bisect import bisect_left\n\n\nclass Solution:\n    def suggestedProducts(self, products: list[str], searchWord: str) -> list[list[str]]:\n        products.sort()\n        result = []\n\n        for i in range(len(searchWord)):\n            prefix = searchWord[:i + 1]\n\n            # Binary search for the leftmost position where prefix could be inserted\n            start = bisect_left(products, prefix)\n\n            suggestions = []\n            # Check up to 3 products starting from the insertion point\n            for j in range(start, min(start + 3, len(products))):\n                if products[j].startswith(prefix):\n                    suggestions.append(products[j])\n                else:\n                    break\n            result.append(suggestions)\n\n        return result",
    "lineMap": {
      "start": [
        5
      ],
      "sort": [
        6,
        7
      ],
      "build_prefix": [
        9,
        10
      ],
      "binary_search_start": [
        13
      ],
      "calculate_mid": [
        13
      ],
      "move_left": [
        13
      ],
      "move_right": [
        13
      ],
      "find_start": [
        13
      ],
      "initialize_suggestions": [
        15
      ],
      "add_suggestion": [
        18,
        19
      ],
      "skip_product": [
        20,
        21
      ],
      "add_to_result": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "while_binary_search": [
        13
      ],
      "compare_mid": [
        13
      ],
      "search_window": [
        17
      ],
      "starts_with_prefix": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<List<String>> suggestedProducts(String[] products, String searchWord) {\n        Arrays.sort(products);\n        List<List<String>> result = new ArrayList<>();\n\n        for (int i = 0; i < searchWord.length(); i++) {\n            String prefix = searchWord.substring(0, i + 1);\n\n            // Binary search for the leftmost position where prefix could be inserted\n            int start = lowerBound(products, prefix);\n\n            List<String> suggestions = new ArrayList<>();\n            // Check up to 3 products starting from the insertion point\n            for (int j = start; j < Math.min(start + 3, products.length); j++) {\n                if (products[j].startsWith(prefix)) {\n                    suggestions.add(products[j]);\n                } else {\n                    break;\n                }\n            }\n            result.add(suggestions);\n        }\n\n        return result;\n    }\n\n    private int lowerBound(String[] products, String prefix) {\n        int lo = 0, hi = products.length;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (products[mid].compareTo(prefix) < 0) {\n                lo = mid + 1;\n            } else {\n                hi = mid;\n            }\n        }\n        return lo;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "sort": [
        3,
        4
      ],
      "build_prefix": [
        6,
        7
      ],
      "binary_search_start": [
        28
      ],
      "calculate_mid": [
        30
      ],
      "move_left": [
        31,
        32
      ],
      "move_right": [
        33,
        34
      ],
      "find_start": [
        37
      ],
      "initialize_suggestions": [
        12
      ],
      "add_suggestion": [
        15,
        16
      ],
      "skip_product": [
        17,
        18
      ],
      "add_to_result": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "while_binary_search": [
        29
      ],
      "compare_mid": [
        31
      ],
      "search_window": [
        14
      ],
      "starts_with_prefix": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {\n        sort(products.begin(), products.end());\n        vector<vector<string>> result;\n\n        for (int i = 0; i < searchWord.size(); i++) {\n            string prefix = searchWord.substr(0, i + 1);\n\n            // Binary search for the leftmost position where prefix could be inserted\n            auto it = lower_bound(products.begin(), products.end(), prefix);\n            int start = it - products.begin();\n\n            vector<string> suggestions;\n            // Check up to 3 products starting from the insertion point\n            for (int j = start; j < min(start + 3, (int)products.size()); j++) {\n                if (products[j].compare(0, prefix.size(), prefix) == 0) {\n                    suggestions.push_back(products[j]);\n                } else {\n                    break;\n                }\n            }\n            result.push_back(suggestions);\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "sort": [
        4,
        5
      ],
      "build_prefix": [
        7,
        8
      ],
      "binary_search_start": [
        11
      ],
      "calculate_mid": [
        11
      ],
      "move_left": [
        11
      ],
      "move_right": [
        11
      ],
      "find_start": [
        11,
        12
      ],
      "initialize_suggestions": [
        14
      ],
      "add_suggestion": [
        17,
        18
      ],
      "skip_product": [
        19,
        20
      ],
      "add_to_result": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "while_binary_search": [
        11
      ],
      "compare_mid": [
        11
      ],
      "search_window": [
        16
      ],
      "starts_with_prefix": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<IList<string>> SuggestedProducts(string[] products, string searchWord) {\n        Array.Sort(products, StringComparer.Ordinal);\n        IList<IList<string>> result = new List<IList<string>>();\n\n        for (int i = 0; i < searchWord.Length; i++) {\n            string prefix = searchWord.Substring(0, i + 1);\n\n            // Binary search for the leftmost position where prefix could be inserted\n            int start = LowerBound(products, prefix);\n\n            IList<string> suggestions = new List<string>();\n            // Check up to 3 products starting from the insertion point\n            for (int j = start; j < Math.Min(start + 3, products.Length); j++) {\n                if (products[j].StartsWith(prefix)) {\n                    suggestions.Add(products[j]);\n                } else {\n                    break;\n                }\n            }\n            result.Add(suggestions);\n        }\n\n        return result;\n    }\n\n    private int LowerBound(string[] products, string prefix) {\n        int lo = 0, hi = products.Length;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (string.Compare(products[mid], prefix, StringComparison.Ordinal) < 0) {\n                lo = mid + 1;\n            } else {\n                hi = mid;\n            }\n        }\n        return lo;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "sort": [
        3,
        4
      ],
      "build_prefix": [
        6,
        7
      ],
      "binary_search_start": [
        28
      ],
      "calculate_mid": [
        30
      ],
      "move_left": [
        31,
        32
      ],
      "move_right": [
        33,
        34
      ],
      "find_start": [
        37
      ],
      "initialize_suggestions": [
        12
      ],
      "add_suggestion": [
        15,
        16
      ],
      "skip_product": [
        17,
        18
      ],
      "add_to_result": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "while_binary_search": [
        29
      ],
      "compare_mid": [
        31
      ],
      "search_window": [
        14
      ],
      "starts_with_prefix": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func suggestedProducts(products []string, searchWord string) [][]string {\n    sort.Strings(products)\n    result := make([][]string, 0, len(searchWord))\n\n    for i := 0; i < len(searchWord); i++ {\n        prefix := searchWord[:i+1]\n\n        // Binary search for the leftmost position where prefix could be inserted\n        start := sort.SearchStrings(products, prefix)\n\n        suggestions := []string{}\n        // Check up to 3 products starting from the insertion point\n        end := start + 3\n        if end > len(products) {\n            end = len(products)\n        }\n        for j := start; j < end; j++ {\n            if len(products[j]) >= len(prefix) && products[j][:len(prefix)] == prefix {\n                suggestions = append(suggestions, products[j])\n            } else {\n                break\n            }\n        }\n        result = append(result, suggestions)\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "sort": [
        2,
        3
      ],
      "build_prefix": [
        5,
        6
      ],
      "binary_search_start": [
        9
      ],
      "calculate_mid": [
        9
      ],
      "move_left": [
        9
      ],
      "move_right": [
        9
      ],
      "find_start": [
        9
      ],
      "initialize_suggestions": [
        11
      ],
      "add_suggestion": [
        18,
        19
      ],
      "skip_product": [
        20,
        21
      ],
      "add_to_result": [
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_binary_search": [
        9
      ],
      "compare_mid": [
        9
      ],
      "search_window": [
        17
      ],
      "starts_with_prefix": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var suggestedProducts = function(products, searchWord) {\n    products.sort();\n    const result = [];\n\n    for (let i = 0; i < searchWord.length; i++) {\n        const prefix = searchWord.substring(0, i + 1);\n\n        // Binary search for the leftmost position where prefix could be inserted\n        let lo = 0, hi = products.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (products[mid] < prefix) {\n                lo = mid + 1;\n            } else {\n                hi = mid;\n            }\n        }\n\n        const suggestions = [];\n        // Check up to 3 products starting from the insertion point\n        for (let j = lo; j < Math.min(lo + 3, products.length); j++) {\n            if (products[j].startsWith(prefix)) {\n                suggestions.push(products[j]);\n            } else {\n                break;\n            }\n        }\n        result.push(suggestions);\n    }\n\n    return result;\n};",
    "lineMap": {
      "start": [
        1
      ],
      "sort": [
        2,
        3
      ],
      "build_prefix": [
        5,
        6
      ],
      "binary_search_start": [
        9
      ],
      "calculate_mid": [
        11
      ],
      "move_left": [
        12,
        13
      ],
      "move_right": [
        14,
        15
      ],
      "find_start": [
        10
      ],
      "initialize_suggestions": [
        19
      ],
      "add_suggestion": [
        22,
        23
      ],
      "skip_product": [
        24,
        25
      ],
      "add_to_result": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_binary_search": [
        10
      ],
      "compare_mid": [
        12
      ],
      "search_window": [
        21
      ],
      "starts_with_prefix": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function suggestedProducts(products: string[], searchWord: string): string[][] {\n    products.sort();\n    const result: string[][] = [];\n\n    for (let i = 0; i < searchWord.length; i++) {\n        const prefix = searchWord.substring(0, i + 1);\n\n        // Binary search for the leftmost position where prefix could be inserted\n        let lo = 0, hi = products.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (products[mid] < prefix) {\n                lo = mid + 1;\n            } else {\n                hi = mid;\n            }\n        }\n\n        const suggestions: string[] = [];\n        // Check up to 3 products starting from the insertion point\n        for (let j = lo; j < Math.min(lo + 3, products.length); j++) {\n            if (products[j].startsWith(prefix)) {\n                suggestions.push(products[j]);\n            } else {\n                break;\n            }\n        }\n        result.push(suggestions);\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "sort": [
        2,
        3
      ],
      "build_prefix": [
        5,
        6
      ],
      "binary_search_start": [
        9
      ],
      "calculate_mid": [
        11
      ],
      "move_left": [
        12,
        13
      ],
      "move_right": [
        14,
        15
      ],
      "find_start": [
        10
      ],
      "initialize_suggestions": [
        19
      ],
      "add_suggestion": [
        22,
        23
      ],
      "skip_product": [
        24,
        25
      ],
      "add_to_result": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_binary_search": [
        10
      ],
      "compare_mid": [
        12
      ],
      "search_window": [
        21
      ],
      "starts_with_prefix": [
        22
      ]
    }
  }
};

const SearchSuggestionsSystemPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: mouse",
    "value": {
      "products": [
        "mobile",
        "mouse",
        "moneypot",
        "monitor",
        "mousepad"
      ],
      "searchWord": "mouse"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2: havana",
    "value": {
      "products": [
        "havana"
      ],
      "searchWord": "havana"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3: bags",
    "value": {
      "products": [
        "bags",
        "baggage",
        "banner",
        "box",
        "cloths"
      ],
      "searchWord": "bags"
    }
  }
];

function generateSearchSuggestionsSystemSteps(t: any): any[] {
  
let e=[...t.products],r=t.searchWord,i={};r.split("").forEach((t,e)=>{i[`search_char_${e}`]={type:"arrayElement",value:t,position:e}});let o=new StepRecorder({products:e,searchWord:r,result:[],product:void 0,node:void 0,suggestions:void 0},i);o.record("start",`Start: search suggestions for "${r}"`);let a=[...e].sort((t,e)=>t<e?-1:+(t>e));o.update_variable("products",a),o.record("sort",`Sort products: ${JSON.stringify(a)}`);let n=0,l={key:"node_root",char:"*",isEndOfWord:!1,children:new Map,suggestions:[]},d=[l];function c(t,e){o.update_visual(t.key,{type:"trieNode",char:t.char,isEndOfWord:t.isEndOfWord,...t.parent?{parent:t.parent,edgeLabel:t.char}:{},state:e})}function u(){d.forEach(t=>c(t,"standard"))}function p(t,e){o.update_visual("active_cache",{type:"metadata",value:t?[...t.suggestions]:[],label:""===e?"root":e})}for(let t of(c(l,"active"),p(l,""),o.record("create_root","Create the trie root with an empty suggestion cache"),a)){u(),c(l,"active");let e=l,r="";o.update_variable("product",t),o.update_variable("node","root"),p(l,r),o.add_conditional("product_loop",!0),o.record("insert_product",`Insert "${t}", starting at the root`);for(let s=0;s<t.length;s++){let i=t[s],a=!e.children.has(i);if(c(e,"visited"),a){n++;let t={key:`node_${n}`,char:i,isEndOfWord:!1,parent:e.key,children:new Map,suggestions:[]};e.children.set(i,t),d.push(t)}e=e.children.get(i),r+=i,s===t.length-1&&(e.isEndOfWord=!0);let l=e.suggestions.length<3;l&&e.suggestions.push(t),c(e,"active"),p(e,r),o.update_variable("node",r),o.update_variable("suggestions",[...e.suggestions]),o.add_conditional("char_loop",!0),o.add_conditional("child_missing",a),o.add_conditional("cache_has_room",l),o.record(a?"create_node":"descend",l?`${a?"Create":"Follow"} node "${r}" and cache "${t}" (${e.suggestions.length}/3)`:`${a?"Create":"Follow"} node "${r}", cache already holds 3`)}o.add_conditional("char_loop",!1)}o.add_conditional("product_loop",!1);let h=[];u(),c(l,"active"),p(l,""),o.update_variable("product",void 0),o.update_variable("node","root"),o.update_variable("suggestions",[]),o.record("build_result","Walk the search word from the root");let g=l,f="";for(let t=0;t<r.length;t++){let e=r[t],s=null!==g;g&&c(g,"visited"),o.update_visual("ptr_i",{type:"pointer",position:t,label:"i"}),o.update_visual("prefix_range",{type:"range",start:0,end:t,label:"prefix"});let i=g,a=g?g.children.get(e)??null:null;f+=e,(g=a)?c(g,"active"):i&&c(i,"error"),o.update_variable("node",g?f:"null"),p(g,f),o.add_conditional("search_loop",!0),o.add_conditional("node_exists",s),o.record("walk_char",g?`Follow '${e}' to node "${f}"`:`No child '${e}', the search word leaves the trie`);let n=g?[...g.suggestions]:[];h.push(n),o.update_variable("suggestions",n),o.update_visual(`result_${t}`,{type:"metadata",value:n,label:f}),o.update_variable("result",h.map(t=>[...t])),g?o.record("read_suggestions",`Read the cache at "${f}": ${JSON.stringify(n)}`):o.record("missing_node",`No node for "${f}", the suggestions are empty`)}return o.add_conditional("search_loop",!1),o.delete_visual("ptr_i"),o.delete_visual("prefix_range"),o.record("complete",`Return ${h.length} suggestion lists`),o.getSteps()
}

export function SearchSuggestionsSystemProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SearchSuggestionsSystemTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSearchSuggestionsSystemSteps(t) as any[];
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
      title="Search Suggestions System"
      slug="search-suggestions-system"
      approaches={approaches}
      presets={SearchSuggestionsSystemPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Word Search II (word-search-ii)
// ==========================================

const WordSearchIiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:\n        # Build Trie using nested dictionaries\n        root = {}\n        for word in words:\n            node = root\n            for ch in word:\n                if ch not in node:\n                    node[ch] = {}\n                node = node[ch]\n            node['#'] = word  # mark end of word\n\n        m, n = len(board), len(board[0])\n        result = []\n\n        def dfs(r, c, parent):\n            ch = board[r][c]\n            node = parent[ch]\n\n            # Found a complete word\n            if '#' in node:\n                result.append(node['#'])\n                del node['#']  # avoid duplicates\n\n            board[r][c] = '!'  # mark visited\n\n            for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < m and 0 <= nc < n and board[nr][nc] in node:\n                    dfs(nr, nc, node)\n\n            board[r][c] = ch  # backtrack\n\n            # Prune empty branches\n            if not node:\n                del parent[ch]\n\n        for r in range(m):\n            for c in range(n):\n                if board[r][c] in root:\n                    dfs(r, c, root)\n\n        return result",
    "lineMap": {
      "empty": [
        2
      ],
      "start": [
        2
      ],
      "init_trie": [
        4
      ],
      "insert_start": [
        5,
        6
      ],
      "create_node": [
        8,
        9,
        10
      ],
      "insert_char": [
        10
      ],
      "insert_end": [
        11
      ],
      "init_vars": [
        13,
        14
      ],
      "try_cell": [
        38,
        39,
        40
      ],
      "start_dfs": [
        41
      ],
      "enter_dfs": [
        16,
        17,
        18
      ],
      "found_word": [
        21,
        22,
        23
      ],
      "mark_visited": [
        25
      ],
      "check_dir": [
        27,
        28,
        29,
        30
      ],
      "backtrack": [
        32
      ],
      "prune_branch": [
        35,
        36
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "char_missing": [
        8
      ],
      "for_rows": [
        38
      ],
      "for_cols": [
        39
      ],
      "found_word": [
        21
      ],
      "can_prune": [
        35
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int m, n;\n    private char[][] board;\n    private List<String> result;\n\n    public List<String> findWords(char[][] board, String[] words) {\n        this.board = board;\n        this.m = board.length;\n        this.n = board[0].length;\n        this.result = new ArrayList<>();\n\n        // Build Trie from all words\n        int[][] children = new int[400001][26];\n        String[] wordAt = new String[400001];\n        int nodeCount = 1; // node 0 is root\n\n        for (String word : words) {\n            int cur = 0;\n            for (char ch : word.toCharArray()) {\n                int c = ch - 'a';\n                if (children[cur][c] == 0) {\n                    children[cur][c] = nodeCount++;\n                }\n                cur = children[cur][c];\n            }\n            wordAt[cur] = word;\n        }\n\n        // DFS from every cell\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                dfs(r, c, 0, children, wordAt);\n            }\n        }\n        return result;\n    }\n\n    private void dfs(int r, int c, int node, int[][] children, String[] wordAt) {\n        if (r < 0 || r >= m || c < 0 || c >= n) return;\n        char ch = board[r][c];\n        if (ch == '#') return; // already visited\n        int childNode = children[node][ch - 'a'];\n        if (childNode == 0) return; // no matching prefix in Trie\n\n        // Found a complete word\n        if (wordAt[childNode] != null) {\n            result.add(wordAt[childNode]);\n            wordAt[childNode] = null; // avoid duplicates\n        }\n\n        board[r][c] = '#'; // mark visited\n        dfs(r + 1, c, childNode, children, wordAt);\n        dfs(r - 1, c, childNode, children, wordAt);\n        dfs(r, c + 1, childNode, children, wordAt);\n        dfs(r, c - 1, childNode, children, wordAt);\n        board[r][c] = ch; // backtrack\n\n        // Prune: if child node has no children and no word, remove it\n        boolean hasChild = false;\n        for (int i = 0; i < 26; i++) {\n            if (children[childNode][i] != 0) {\n                hasChild = true;\n                break;\n            }\n        }\n        if (!hasChild && wordAt[childNode] == null) {\n            children[node][ch - 'a'] = 0;\n        }\n    }\n}",
    "lineMap": {
      "empty": [
        6
      ],
      "start": [
        6,
        8,
        9
      ],
      "init_trie": [
        13,
        14,
        15
      ],
      "insert_start": [
        17,
        18
      ],
      "create_node": [
        21,
        22,
        23,
        24
      ],
      "insert_char": [
        24
      ],
      "insert_end": [
        26
      ],
      "init_vars": [
        10
      ],
      "try_cell": [
        30,
        31,
        32
      ],
      "start_dfs": [
        32
      ],
      "enter_dfs": [
        38,
        40,
        42
      ],
      "found_word": [
        46,
        47,
        48
      ],
      "mark_visited": [
        51
      ],
      "check_dir": [
        52,
        53,
        54,
        55
      ],
      "backtrack": [
        56
      ],
      "prune_branch": [
        59,
        66,
        67
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "char_missing": [
        21
      ],
      "for_rows": [
        30
      ],
      "for_cols": [
        31
      ],
      "found_word": [
        46
      ],
      "can_prune": [
        66
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\n    struct TrieNode {\n        TrieNode* children[26] = {};\n        string word = \"\";\n    };\n\n    int m, n;\n    vector<string> result;\n\n    void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node) {\n        if (r < 0 || r >= m || c < 0 || c >= n) return;\n        char ch = board[r][c];\n        if (ch == '#' || !node->children[ch - 'a']) return;\n\n        TrieNode* child = node->children[ch - 'a'];\n\n        // Found a complete word\n        if (!child->word.empty()) {\n            result.push_back(child->word);\n            child->word = \"\"; // avoid duplicates\n        }\n\n        board[r][c] = '#'; // mark visited\n        dfs(board, r + 1, c, child);\n        dfs(board, r - 1, c, child);\n        dfs(board, r, c + 1, child);\n        dfs(board, r, c - 1, child);\n        board[r][c] = ch; // backtrack\n\n        // Prune empty branches\n        bool hasChild = false;\n        for (int i = 0; i < 26; i++) {\n            if (child->children[i]) { hasChild = true; break; }\n        }\n        if (!hasChild && child->word.empty()) {\n            delete child;\n            node->children[ch - 'a'] = nullptr;\n        }\n    }\n\npublic:\n    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {\n        m = board.size();\n        n = board[0].size();\n\n        // Build Trie\n        TrieNode* root = new TrieNode();\n        for (auto& word : words) {\n            TrieNode* cur = root;\n            for (char ch : word) {\n                int c = ch - 'a';\n                if (!cur->children[c]) cur->children[c] = new TrieNode();\n                cur = cur->children[c];\n            }\n            cur->word = word;\n        }\n\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                dfs(board, r, c, root);\n            }\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "empty": [
        42
      ],
      "start": [
        42,
        43,
        44
      ],
      "init_trie": [
        47
      ],
      "insert_start": [
        48,
        49
      ],
      "create_node": [
        51,
        52,
        53
      ],
      "insert_char": [
        53
      ],
      "insert_end": [
        55
      ],
      "init_vars": [
        8
      ],
      "try_cell": [
        58,
        59,
        60
      ],
      "start_dfs": [
        60
      ],
      "enter_dfs": [
        10,
        12,
        13
      ],
      "found_word": [
        18,
        19,
        20
      ],
      "mark_visited": [
        23
      ],
      "check_dir": [
        24,
        25,
        26,
        27
      ],
      "backtrack": [
        28
      ],
      "prune_branch": [
        31,
        35,
        36,
        37
      ],
      "complete": [
        63
      ]
    },
    "conditionalMap": {
      "char_missing": [
        52
      ],
      "for_rows": [
        58
      ],
      "for_cols": [
        59
      ],
      "found_word": [
        18
      ],
      "can_prune": [
        35
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int m, n;\n    private char[][] board;\n    private IList<string> result;\n\n    private class TrieNode {\n        public TrieNode[] Children = new TrieNode[26];\n        public string Word = null;\n    }\n\n    public IList<string> FindWords(char[][] board, string[] words) {\n        this.board = board;\n        m = board.Length;\n        n = board[0].Length;\n        result = new List<string>();\n\n        // Build Trie\n        var root = new TrieNode();\n        foreach (var word in words) {\n            var cur = root;\n            foreach (var ch in word) {\n                int c = ch - 'a';\n                if (cur.Children[c] == null) cur.Children[c] = new TrieNode();\n                cur = cur.Children[c];\n            }\n            cur.Word = word;\n        }\n\n        for (int r = 0; r < m; r++)\n            for (int c = 0; c < n; c++)\n                Dfs(r, c, root);\n\n        return result;\n    }\n\n    private void Dfs(int r, int c, TrieNode node) {\n        if (r < 0 || r >= m || c < 0 || c >= n) return;\n        char ch = board[r][c];\n        if (ch == '#' || node.Children[ch - 'a'] == null) return;\n\n        var child = node.Children[ch - 'a'];\n\n        if (child.Word != null) {\n            result.Add(child.Word);\n            child.Word = null; // avoid duplicates\n        }\n\n        board[r][c] = '#'; // mark visited\n        Dfs(r + 1, c, child);\n        Dfs(r - 1, c, child);\n        Dfs(r, c + 1, child);\n        Dfs(r, c - 1, child);\n        board[r][c] = ch; // backtrack\n\n        // Prune empty branches\n        bool hasChild = false;\n        for (int i = 0; i < 26; i++) {\n            if (child.Children[i] != null) { hasChild = true; break; }\n        }\n        if (!hasChild && child.Word == null) {\n            node.Children[ch - 'a'] = null;\n        }\n    }\n}",
    "lineMap": {
      "empty": [
        11
      ],
      "start": [
        11,
        13,
        14
      ],
      "init_trie": [
        18
      ],
      "insert_start": [
        19,
        20
      ],
      "create_node": [
        22,
        23,
        24
      ],
      "insert_char": [
        24
      ],
      "insert_end": [
        26
      ],
      "init_vars": [
        15
      ],
      "try_cell": [
        29,
        30,
        31
      ],
      "start_dfs": [
        31
      ],
      "enter_dfs": [
        36,
        38,
        39
      ],
      "found_word": [
        43,
        44,
        45
      ],
      "mark_visited": [
        48
      ],
      "check_dir": [
        49,
        50,
        51,
        52
      ],
      "backtrack": [
        53
      ],
      "prune_branch": [
        56,
        60,
        61
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "char_missing": [
        23
      ],
      "for_rows": [
        29
      ],
      "for_cols": [
        30
      ],
      "found_word": [
        43
      ],
      "can_prune": [
        60
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type TrieNode struct {\n    children [26]*TrieNode\n    word     string\n}\n\nfunc findWords(board [][]byte, words []string) []string {\n    m, n := len(board), len(board[0])\n\n    // Build Trie\n    root := &TrieNode{}\n    for _, word := range words {\n        cur := root\n        for _, ch := range word {\n            c := ch - 'a'\n            if cur.children[c] == nil {\n                cur.children[c] = &TrieNode{}\n            }\n            cur = cur.children[c]\n        }\n        cur.word = word\n    }\n\n    result := []string{}\n\n    var dfs func(r, c int, node *TrieNode)\n    dfs = func(r, c int, node *TrieNode) {\n        if r < 0 || r >= m || c < 0 || c >= n {\n            return\n        }\n        ch := board[r][c]\n        if ch == '#' || node.children[ch-'a'] == nil {\n            return\n        }\n\n        child := node.children[ch-'a']\n\n        // Found a complete word\n        if child.word != \"\" {\n            result = append(result, child.word)\n            child.word = \"\" // avoid duplicates\n        }\n\n        board[r][c] = '#' // mark visited\n        dfs(r+1, c, child)\n        dfs(r-1, c, child)\n        dfs(r, c+1, child)\n        dfs(r, c-1, child)\n        board[r][c] = ch // backtrack\n\n        // Prune empty branches\n        hasChild := false\n        for i := 0; i < 26; i++ {\n            if child.children[i] != nil {\n                hasChild = true\n                break\n            }\n        }\n        if !hasChild && child.word == \"\" {\n            node.children[ch-'a'] = nil\n        }\n    }\n\n    for r := 0; r < m; r++ {\n        for c := 0; c < n; c++ {\n            dfs(r, c, root)\n        }\n    }\n    return result\n}",
    "lineMap": {
      "empty": [
        6
      ],
      "start": [
        6,
        7
      ],
      "init_trie": [
        10
      ],
      "insert_start": [
        11,
        12
      ],
      "create_node": [
        15,
        16,
        17,
        18
      ],
      "insert_char": [
        18
      ],
      "insert_end": [
        20
      ],
      "init_vars": [
        23
      ],
      "try_cell": [
        63,
        64,
        65
      ],
      "start_dfs": [
        65
      ],
      "enter_dfs": [
        26,
        30,
        31
      ],
      "found_word": [
        38,
        39,
        40
      ],
      "mark_visited": [
        43
      ],
      "check_dir": [
        44,
        45,
        46,
        47
      ],
      "backtrack": [
        48
      ],
      "prune_branch": [
        51,
        58,
        59
      ],
      "complete": [
        68
      ]
    },
    "conditionalMap": {
      "char_missing": [
        15
      ],
      "for_rows": [
        63
      ],
      "for_cols": [
        64
      ],
      "found_word": [
        38
      ],
      "can_prune": [
        58
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findWords = function(board, words) {\n    const m = board.length, n = board[0].length;\n\n    // Build Trie using plain objects\n    const root = {};\n    for (const word of words) {\n        let node = root;\n        for (const ch of word) {\n            if (!node[ch]) node[ch] = {};\n            node = node[ch];\n        }\n        node['$'] = word; // mark end of word\n    }\n\n    const result = [];\n\n    const dfs = (r, c, parent) => {\n        const ch = board[r][c];\n        const node = parent[ch];\n\n        // Found a complete word\n        if (node['$']) {\n            result.push(node['$']);\n            delete node['$']; // avoid duplicates\n        }\n\n        board[r][c] = '#'; // mark visited\n\n        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n        for (const [dr, dc] of dirs) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] in node) {\n                dfs(nr, nc, node);\n            }\n        }\n\n        board[r][c] = ch; // backtrack\n\n        // Prune empty branches\n        if (Object.keys(node).length === 0) {\n            delete parent[ch];\n        }\n    };\n\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (board[r][c] in root) {\n                dfs(r, c, root);\n            }\n        }\n    }\n    return result;\n};",
    "lineMap": {
      "empty": [
        1
      ],
      "start": [
        1,
        2
      ],
      "init_trie": [
        5
      ],
      "insert_start": [
        6,
        7
      ],
      "create_node": [
        9,
        10
      ],
      "insert_char": [
        10
      ],
      "insert_end": [
        12
      ],
      "init_vars": [
        15
      ],
      "try_cell": [
        45,
        46,
        47
      ],
      "start_dfs": [
        48
      ],
      "enter_dfs": [
        17,
        18,
        19
      ],
      "found_word": [
        22,
        23,
        24
      ],
      "mark_visited": [
        27
      ],
      "check_dir": [
        30,
        31,
        32,
        33
      ],
      "backtrack": [
        37
      ],
      "prune_branch": [
        40,
        41
      ],
      "complete": [
        52
      ]
    },
    "conditionalMap": {
      "char_missing": [
        9
      ],
      "for_rows": [
        45
      ],
      "for_cols": [
        46
      ],
      "found_word": [
        22
      ],
      "can_prune": [
        40
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findWords(board: string[][], words: string[]): string[] {\n    const m = board.length, n = board[0].length;\n\n    // Build Trie using plain objects\n    const root: Record<string, any> = {};\n    for (const word of words) {\n        let node = root;\n        for (const ch of word) {\n            if (!node[ch]) node[ch] = {};\n            node = node[ch];\n        }\n        node['$'] = word; // mark end of word\n    }\n\n    const result: string[] = [];\n\n    const dfs = (r: number, c: number, parent: Record<string, any>): void => {\n        const ch = board[r][c];\n        const node = parent[ch];\n\n        // Found a complete word\n        if (node['$']) {\n            result.push(node['$']);\n            delete node['$']; // avoid duplicates\n        }\n\n        board[r][c] = '#'; // mark visited\n\n        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n        for (const [dr, dc] of dirs) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] in node) {\n                dfs(nr, nc, node);\n            }\n        }\n\n        board[r][c] = ch; // backtrack\n\n        // Prune empty branches\n        if (Object.keys(node).length === 0) {\n            delete parent[ch];\n        }\n    };\n\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (board[r][c] in root) {\n                dfs(r, c, root);\n            }\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "empty": [
        1
      ],
      "start": [
        1,
        2
      ],
      "init_trie": [
        5
      ],
      "insert_start": [
        6,
        7
      ],
      "create_node": [
        9,
        10
      ],
      "insert_char": [
        10
      ],
      "insert_end": [
        12
      ],
      "init_vars": [
        15
      ],
      "try_cell": [
        45,
        46,
        47
      ],
      "start_dfs": [
        48
      ],
      "enter_dfs": [
        17,
        18,
        19
      ],
      "found_word": [
        22,
        23,
        24
      ],
      "mark_visited": [
        27
      ],
      "check_dir": [
        30,
        31,
        32,
        33
      ],
      "backtrack": [
        37
      ],
      "prune_branch": [
        40,
        41
      ],
      "complete": [
        52
      ]
    },
    "conditionalMap": {
      "char_missing": [
        9
      ],
      "for_rows": [
        45
      ],
      "for_cols": [
        46
      ],
      "found_word": [
        22
      ],
      "can_prune": [
        40
      ]
    }
  }
};

const WordSearchIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: oath, eat",
    "value": {
      "board": [
        [
          "o",
          "a",
          "a",
          "n"
        ],
        [
          "e",
          "t",
          "a",
          "e"
        ],
        [
          "i",
          "h",
          "k",
          "r"
        ],
        [
          "i",
          "f",
          "l",
          "v"
        ]
      ],
      "words": [
        "oath",
        "pea",
        "eat",
        "rain"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2: ab, abd, acdb",
    "value": {
      "board": [
        [
          "a",
          "b"
        ],
        [
          "c",
          "d"
        ]
      ],
      "words": [
        "ab",
        "abc",
        "abd",
        "acdb"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "3x3 Grid",
    "value": {
      "board": [
        [
          "a",
          "b",
          "c"
        ],
        [
          "d",
          "e",
          "f"
        ],
        [
          "g",
          "h",
          "i"
        ]
      ],
      "words": [
        "abc",
        "def",
        "ghi",
        "adg",
        "beh",
        "cfi",
        "aei"
      ]
    }
  }
];

function generateWordSearchIiSteps(r: any): any[] {
  class n{constructor(){this.children=new Map,this.word=null}}
let e=r.board||[],t=r.words||[];if(0===e.length||0===e[0].length||0===t.length){let r=new RecursiveStepRecorder({},{});return r.pushCallFrame({board:[],words:[]},"findWords"),r.record("empty","Empty board or word list"),r.popCallFrame(),r.getSteps()}let a=e.length,i=e[0].length,d={};for(let r=0;r<a;r++)for(let t=0;t<i;t++)d[`cell_${r}_${t}`]={type:"matrixElement",value:e[r][t],row:r,col:t};let l={};for(let r=0;r<t.length;r++)l[`word_${r}`]={type:"arrayElement",value:t[r],position:r};let s=[],c=new RecursiveStepRecorder({},{...d,...l});c.pushCallFrame({board:e,words:t,root:void 0,word:void 0,rows:void 0,cols:void 0,dirs:void 0,start_r:void 0,start_c:void 0},"findWords"),c.record("start","Start: Find all words in board using Trie + DFS");let u=new n;c.update_frame_variable("root","TrieNode()"),c.add_new_visual("trie_root",{type:"binaryTreeNode",value:"●",parent:void 0,isLeftChild:void 0}),c.record("init_trie","Initialize Trie root");for(let r=0;r<t.length;r++){let e=t[r],o=u,a="trie_root";c.update_frame_variable("word",e),c.update_visual("word_pointer",{type:"pointer",position:r,label:""}),c.record("insert_start",`Insert word "${e}" into Trie`);for(let r=0;r<e.length;r++){let t=e[r],i=`${a}_${t}`,d=!o.children.has(t);d&&(o.children.set(t,new n),c.add_new_visual(i,{type:"binaryTreeNode",value:t,parent:a,isLeftChild:void 0})),a=i,o=o.children.get(t),c.add_conditional("char_missing",d),c.record(d?"create_node":"insert_char",d?`Create Trie node for '${t}'`:`Trie already has '${t}', descend`)}o.word=e,c.record("insert_end",`Inserted word "${e}" into Trie`)}c.delete_visual("word_pointer");let f=[[1,0],[-1,0],[0,1],[0,-1]];c.update_frame_variable("result",[]),c.update_frame_variable("rows",a),c.update_frame_variable("cols",i),c.update_frame_variable("dirs",f.map(([r,e])=>`(${r},${e})`)),c.record("init_vars","Initialize variables for DFS");for(let r=0;r<a;r++){c.add_conditional("for_rows",!0);for(let t=0;t<i;t++){c.add_conditional("for_cols",!0);let o=e[r][t];c.update_frame_variable("r",r),c.update_frame_variable("c",t),c.update_visual("pointer",{type:"2DPointer",row:r,col:t,label:""}),c.record("try_cell",`Try cell (${r}, ${t}), char='${o}'`),u.children.has(o)&&(c.record("start_dfs",`Start DFS from (${r}, ${t})`),!function r(t,o,n,d,l){let u=e[t][o];if(c.pushCallFrame({r:t,c:o,node:`TrieNode(${u})`},"dfs"),c.add_new_visual("pointer",{type:"2DPointer",row:t,col:o,label:""}),c.add_new_visual("trie_pointer",{type:"treeNodePointer",nodeKey:d,label:""}),c.record("enter_dfs",`DFS at (${t}, ${o}), char='${u}'`),null!==n.word){c.add_conditional("found_word",!0);let r=n.word;s.push(r),c.update_frame_variable("result",[...s]),c.record("found_word",`Found word: "${r}"`),n.word=null}else c.add_conditional("found_word",!1);e[t][o]="#",c.update_visual(`cell_${t}_${o}`,{type:"matrixElement",value:"#",row:t,col:o}),c.update_frame_variable("char",u),c.record("mark_visited",`Mark (${t}, ${o}) as visited`);for(let l=0;l<f.length;l++){let[s,u]=f[l],h=t+s,p=o+u;c.update_frame_variable("dr",s),c.update_frame_variable("dc",u),c.update_frame_variable("nr",h),c.update_frame_variable("nc",p),c.add_new_visual("neighbor_pointer",{type:"2DPointer",row:h,col:p,label:"neighbor"});let m=h>=0&&h<a&&p>=0&&p<i&&"#"!==e[h][p],g=m?e[h][p]:"",_=m&&n.children.has(g);c.update_frame_variable("next_char",m?g:void 0),c.record("check_dir",_?`(${s}, ${u}) leads to '${g}' at (${h}, ${p}), which continues the prefix`:m?`(${s}, ${u}) leads to '${g}' at (${h}, ${p}), not in the Trie`:`(${s}, ${u}) leaves the board or revisits a cell`),_&&(c.delete_visual("neighbor_pointer"),r(h,p,n.children.get(g),`${d}_${g}`,n),c.add_new_visual("pointer",{type:"2DPointer",row:t,col:o,label:""}),c.add_new_visual("neighbor_pointer",{type:"2DPointer",row:h,col:p,label:"neighbor"}),c.add_new_visual("trie_pointer",{type:"treeNodePointer",nodeKey:d,label:""})),c.delete_visual("neighbor_pointer")}e[t][o]=u,c.update_visual(`cell_${t}_${o}`,{type:"matrixElement",value:u,row:t,col:o}),c.delete_visual("pointer"),c.delete_visual("trie_pointer"),c.record("backtrack",`Backtrack: restore (${t}, ${o}) to '${u}'`);let h=null===n.word&&0===n.children.size;c.add_conditional("can_prune",h),h&&(l.children.delete(u),c.delete_visual(d),c.record("prune_branch",`Trie node '${u}' is a dead end, remove it`)),c.popCallFrame()}(r,t,u.children.get(o),`trie_root_${o}`,u))}c.add_conditional("for_cols",!1)}return c.delete_visual("pointer"),c.add_conditional("for_rows",!1),c.update_global_variable("result",s),c.record("complete",`Complete: Found ${s.length} word${1!==s.length?"s":""}: [${s.join(", ")}]`),c.popCallFrame(),c.getSteps()
}

export function WordSearchIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: WordSearchIiTemplates,
      generateSteps: (r: any) => {
        const recorded = generateWordSearchIiSteps(r) as any[];
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
      title="Word Search II"
      slug="word-search-ii"
      approaches={approaches}
      presets={WordSearchIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design Add and Search Words Data Structure (design-add-and-search-words-data-structure)
// ==========================================

const DesignAddAndSearchWordsDataStructureTemplates = {
  "python": {
    "language": "python",
    "code": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass WordDictionary:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def addWord(self, word: str) -> None:\n        current = self.root\n        for char in word:\n            if char not in current.children:\n                current.children[char] = TrieNode()\n            current = current.children[char]\n        current.is_end = True\n\n    def search(self, word: str) -> bool:\n        return self._dfs(self.root, word, 0)\n\n    def _dfs(self, node: TrieNode, word: str, index: int) -> bool:\n        if index == len(word):\n            return node.is_end\n\n        char = word[index]\n        if char == '.':\n            # Wildcard: try every existing child\n            for child in node.children.values():\n                if self._dfs(child, word, index + 1):\n                    return True\n            return False\n        else:\n            # Regular character: follow the specific child\n            if char not in node.children:\n                return False\n            return self._dfs(node.children[char], word, index + 1)",
    "lineMap": {
      "-": [
        7,
        8
      ],
      "start_add": [
        10
      ],
      "at_root": [
        11
      ],
      "process_char": [
        12
      ],
      "create_node": [
        14
      ],
      "traverse_existing": [
        15
      ],
      "mark_end": [
        16
      ],
      "start_search": [
        18,
        19
      ],
      "found_match": [
        22,
        23
      ],
      "not_end_of_word": [
        22,
        23
      ],
      "search_char": [
        25,
        26
      ],
      "check_wildcard": [
        28
      ],
      "try_child": [
        29
      ],
      "wildcard_matched": [
        30
      ],
      "wildcard_no_match": [
        31
      ],
      "char_not_found": [
        34,
        35
      ],
      "follow_child": [
        36
      ],
      "dfs_return": [
        36
      ],
      "word_found": [
        19
      ],
      "word_not_found": [
        19
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "check_exists": [
        13
      ],
      "is_wildcard": [
        26
      ],
      "check_end": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class WordDictionary {\n    private WordDictionary[] children;\n    private boolean isEnd;\n\n    public WordDictionary() {\n        children = new WordDictionary[26];\n        isEnd = false;\n    }\n\n    public void addWord(String word) {\n        WordDictionary current = this;\n        for (int i = 0; i < word.length(); i++) {\n            int c = word.charAt(i) - 'a';\n            if (current.children[c] == null) {\n                current.children[c] = new WordDictionary();\n            }\n            current = current.children[c];\n        }\n        current.isEnd = true;\n    }\n\n    public boolean search(String word) {\n        return dfs(this, word, 0);\n    }\n\n    private boolean dfs(WordDictionary node, String word, int index) {\n        if (index == word.length()) {\n            return node.isEnd;\n        }\n        char c = word.charAt(index);\n        if (c == '.') {\n            // Wildcard: try every existing child\n            for (WordDictionary child : node.children) {\n                if (child != null && dfs(child, word, index + 1)) {\n                    return true;\n                }\n            }\n            return false;\n        } else {\n            // Regular character: follow the specific child\n            WordDictionary child = node.children[c - 'a'];\n            return child != null && dfs(child, word, index + 1);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        5,
        6,
        7
      ],
      "start_add": [
        10
      ],
      "at_root": [
        11
      ],
      "process_char": [
        12,
        13
      ],
      "create_node": [
        15
      ],
      "traverse_existing": [
        17
      ],
      "mark_end": [
        19
      ],
      "start_search": [
        22,
        23
      ],
      "found_match": [
        27,
        28
      ],
      "not_end_of_word": [
        27,
        28
      ],
      "search_char": [
        30,
        31
      ],
      "check_wildcard": [
        33
      ],
      "try_child": [
        34
      ],
      "wildcard_matched": [
        35
      ],
      "wildcard_no_match": [
        38
      ],
      "char_not_found": [
        41,
        42
      ],
      "follow_child": [
        41,
        42
      ],
      "dfs_return": [
        42
      ],
      "word_found": [
        23
      ],
      "word_not_found": [
        23
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_exists": [
        14
      ],
      "is_wildcard": [
        31
      ],
      "check_end": [
        27
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class WordDictionary {\n    struct TrieNode {\n        TrieNode* children[26] = {};\n        bool isEnd = false;\n    };\n\n    TrieNode* root;\n\n    bool dfs(TrieNode* node, const string& word, int index) {\n        if (index == (int)word.size()) {\n            return node->isEnd;\n        }\n        char c = word[index];\n        if (c == '.') {\n            // Wildcard: try every existing child\n            for (int i = 0; i < 26; i++) {\n                if (node->children[i] && dfs(node->children[i], word, index + 1)) {\n                    return true;\n                }\n            }\n            return false;\n        } else {\n            // Regular character: follow the specific child\n            TrieNode* child = node->children[c - 'a'];\n            return child && dfs(child, word, index + 1);\n        }\n    }\n\npublic:\n    WordDictionary() {\n        root = new TrieNode();\n    }\n\n    void addWord(string word) {\n        TrieNode* current = root;\n        for (char c : word) {\n            int idx = c - 'a';\n            if (!current->children[idx]) {\n                current->children[idx] = new TrieNode();\n            }\n            current = current->children[idx];\n        }\n        current->isEnd = true;\n    }\n\n    bool search(string word) {\n        return dfs(root, word, 0);\n    }\n};",
    "lineMap": {
      "-": [
        30,
        31
      ],
      "start_add": [
        34
      ],
      "at_root": [
        35
      ],
      "process_char": [
        36,
        37
      ],
      "create_node": [
        39
      ],
      "traverse_existing": [
        41
      ],
      "mark_end": [
        43
      ],
      "start_search": [
        46,
        47
      ],
      "found_match": [
        10,
        11
      ],
      "not_end_of_word": [
        10,
        11
      ],
      "search_char": [
        13,
        14
      ],
      "check_wildcard": [
        16
      ],
      "try_child": [
        17
      ],
      "wildcard_matched": [
        18
      ],
      "wildcard_no_match": [
        21
      ],
      "char_not_found": [
        24,
        25
      ],
      "follow_child": [
        24,
        25
      ],
      "dfs_return": [
        25
      ],
      "word_found": [
        47
      ],
      "word_not_found": [
        47
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_exists": [
        38
      ],
      "is_wildcard": [
        14
      ],
      "check_end": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class WordDictionary {\n    private WordDictionary[] children;\n    private bool isEnd;\n\n    public WordDictionary() {\n        children = new WordDictionary[26];\n        isEnd = false;\n    }\n\n    public void AddWord(string word) {\n        WordDictionary current = this;\n        foreach (char c in word) {\n            int idx = c - 'a';\n            if (current.children[idx] == null) {\n                current.children[idx] = new WordDictionary();\n            }\n            current = current.children[idx];\n        }\n        current.isEnd = true;\n    }\n\n    public bool Search(string word) {\n        return Dfs(this, word, 0);\n    }\n\n    private bool Dfs(WordDictionary node, string word, int index) {\n        if (index == word.Length) {\n            return node.isEnd;\n        }\n        char c = word[index];\n        if (c == '.') {\n            // Wildcard: try every existing child\n            foreach (WordDictionary child in node.children) {\n                if (child != null && Dfs(child, word, index + 1)) {\n                    return true;\n                }\n            }\n            return false;\n        } else {\n            // Regular character: follow the specific child\n            WordDictionary child = node.children[c - 'a'];\n            return child != null && Dfs(child, word, index + 1);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        5,
        6,
        7
      ],
      "start_add": [
        10
      ],
      "at_root": [
        11
      ],
      "process_char": [
        12,
        13
      ],
      "create_node": [
        15
      ],
      "traverse_existing": [
        17
      ],
      "mark_end": [
        19
      ],
      "start_search": [
        22,
        23
      ],
      "found_match": [
        27,
        28
      ],
      "not_end_of_word": [
        27,
        28
      ],
      "search_char": [
        30,
        31
      ],
      "check_wildcard": [
        33
      ],
      "try_child": [
        34
      ],
      "wildcard_matched": [
        35
      ],
      "wildcard_no_match": [
        38
      ],
      "char_not_found": [
        41,
        42
      ],
      "follow_child": [
        41,
        42
      ],
      "dfs_return": [
        42
      ],
      "word_found": [
        23
      ],
      "word_not_found": [
        23
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_exists": [
        14
      ],
      "is_wildcard": [
        31
      ],
      "check_end": [
        27
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type TrieNode struct {\n    children [26]*TrieNode\n    isEnd    bool\n}\n\ntype WordDictionary struct {\n    root *TrieNode\n}\n\nfunc Constructor() WordDictionary {\n    return WordDictionary{root: &TrieNode{}}\n}\n\nfunc (wd *WordDictionary) AddWord(word string) {\n    current := wd.root\n    for _, c := range word {\n        idx := c - 'a'\n        if current.children[idx] == nil {\n            current.children[idx] = &TrieNode{}\n        }\n        current = current.children[idx]\n    }\n    current.isEnd = true\n}\n\nfunc (wd *WordDictionary) Search(word string) bool {\n    return dfs(wd.root, word, 0)\n}\n\nfunc dfs(node *TrieNode, word string, index int) bool {\n    if index == len(word) {\n        return node.isEnd\n    }\n    c := word[index]\n    if c == '.' {\n        // Wildcard: try every existing child\n        for i := 0; i < 26; i++ {\n            if node.children[i] != nil && dfs(node.children[i], word, index+1) {\n                return true\n            }\n        }\n        return false\n    }\n    // Regular character: follow the specific child\n    child := node.children[c-'a']\n    return child != nil && dfs(child, word, index+1)\n}",
    "lineMap": {
      "-": [
        10,
        11
      ],
      "start_add": [
        14
      ],
      "at_root": [
        15
      ],
      "process_char": [
        16,
        17
      ],
      "create_node": [
        19
      ],
      "traverse_existing": [
        21
      ],
      "mark_end": [
        23
      ],
      "start_search": [
        26,
        27
      ],
      "found_match": [
        31,
        32
      ],
      "not_end_of_word": [
        31,
        32
      ],
      "search_char": [
        34,
        35
      ],
      "check_wildcard": [
        37
      ],
      "try_child": [
        38
      ],
      "wildcard_matched": [
        39
      ],
      "wildcard_no_match": [
        42
      ],
      "char_not_found": [
        45,
        46
      ],
      "follow_child": [
        45,
        46
      ],
      "dfs_return": [
        46
      ],
      "word_found": [
        27
      ],
      "word_not_found": [
        27
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "check_exists": [
        18
      ],
      "is_wildcard": [
        35
      ],
      "check_end": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var WordDictionary = function () {\n  this.children = new Array(26).fill(null);\n  this.isEnd = false;\n};\n\nWordDictionary.prototype.addWord = function (word) {\n  let current = this;\n  for (const c of word) {\n    const idx = c.charCodeAt(0) - 97; // 'a' = 97\n    if (!current.children[idx]) {\n      current.children[idx] = new WordDictionary();\n    }\n    current = current.children[idx];\n  }\n  current.isEnd = true;\n};\n\nWordDictionary.prototype.search = function (word) {\n  return dfs(this, word, 0);\n};\n\n// Recursive DFS helper for wildcard matching\nvar dfs = function (node, word, index) {\n  if (index === word.length) return node.isEnd;\n\n  const c = word[index];\n  if (c === \".\") {\n    // Wildcard: try every existing child\n    for (const child of node.children) {\n      if (child && dfs(child, word, index + 1)) return true;\n    }\n    return false;\n  }\n  // Regular character: follow the specific child\n  const child = node.children[c.charCodeAt(0) - 97];\n  return child !== null && dfs(child, word, index + 1);\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "start_add": [
        6
      ],
      "at_root": [
        7
      ],
      "process_char": [
        8,
        9
      ],
      "create_node": [
        11
      ],
      "traverse_existing": [
        13
      ],
      "mark_end": [
        15
      ],
      "start_search": [
        18,
        19
      ],
      "found_match": [
        24
      ],
      "not_end_of_word": [
        24
      ],
      "search_char": [
        26,
        27
      ],
      "check_wildcard": [
        29
      ],
      "try_child": [
        30
      ],
      "wildcard_matched": [
        30
      ],
      "wildcard_no_match": [
        32
      ],
      "char_not_found": [
        35,
        36
      ],
      "follow_child": [
        35,
        36
      ],
      "dfs_return": [
        36
      ],
      "word_found": [
        19
      ],
      "word_not_found": [
        19
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_exists": [
        10
      ],
      "is_wildcard": [
        27
      ],
      "check_end": [
        24
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class WordDictionary {\n    private children: (WordDictionary | null)[];\n    private isEnd: boolean;\n\n    constructor() {\n        this.children = new Array(26).fill(null);\n        this.isEnd = false;\n    }\n\n    addWord(word: string): void {\n        let current: WordDictionary = this;\n        for (const c of word) {\n            const idx = c.charCodeAt(0) - 97; // 'a' = 97\n            if (!current.children[idx]) {\n                current.children[idx] = new WordDictionary();\n            }\n            current = current.children[idx]!;\n        }\n        current.isEnd = true;\n    }\n\n    search(word: string): boolean {\n        return this.dfs(this, word, 0);\n    }\n\n    // Recursive DFS helper for wildcard matching\n    private dfs(node: WordDictionary, word: string, index: number): boolean {\n        if (index === word.length) return node.isEnd;\n\n        const c = word[index];\n        if (c === '.') {\n            // Wildcard: try every existing child\n            for (const child of node.children) {\n                if (child && this.dfs(child, word, index + 1)) return true;\n            }\n            return false;\n        }\n        // Regular character: follow the specific child\n        const child = node.children[c.charCodeAt(0) - 97];\n        return child !== null && this.dfs(child, word, index + 1);\n    }\n}",
    "lineMap": {
      "-": [
        5,
        6,
        7
      ],
      "start_add": [
        10
      ],
      "at_root": [
        11
      ],
      "process_char": [
        12,
        13
      ],
      "create_node": [
        15
      ],
      "traverse_existing": [
        17
      ],
      "mark_end": [
        19
      ],
      "start_search": [
        22,
        23
      ],
      "found_match": [
        28
      ],
      "not_end_of_word": [
        28
      ],
      "search_char": [
        30,
        31
      ],
      "check_wildcard": [
        33
      ],
      "try_child": [
        34
      ],
      "wildcard_matched": [
        34
      ],
      "wildcard_no_match": [
        36
      ],
      "char_not_found": [
        39,
        40
      ],
      "follow_child": [
        39,
        40
      ],
      "dfs_return": [
        40
      ],
      "word_found": [
        23
      ],
      "word_not_found": [
        23
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_exists": [
        14
      ],
      "is_wildcard": [
        31
      ],
      "check_end": [
        28
      ]
    }
  }
};

const DesignAddAndSearchWordsDataStructurePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "operations": [
        "WordDictionary",
        "addWord",
        "addWord",
        "addWord",
        "search",
        "search",
        "search",
        "search"
      ],
      "values": [
        null,
        "bad",
        "dad",
        "mad",
        "pad",
        "bad",
        ".ad",
        "b.."
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "operations": [
        "WordDictionary",
        "addWord",
        "addWord",
        "addWord",
        "addWord",
        "search",
        "search",
        "search",
        "search"
      ],
      "values": [
        null,
        "at",
        "and",
        "an",
        "add",
        "a",
        ".at",
        "an.",
        "a.d."
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "operations": [
        "WordDictionary",
        "addWord",
        "addWord",
        "search",
        "search",
        "search",
        "search"
      ],
      "values": [
        null,
        "hello",
        "help",
        "hel.o",
        "he...",
        "h....",
        "world"
      ]
    }
  }
];

function generateDesignAddAndSearchWordsDataStructureSteps(e: any): any[] {
  
let r=e.operations||[],t=e.values||[],a=new RecursiveStepRecorder({},{});a.add_new_visual("node_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"}),a.update_global_variable("operation",""),a.update_global_variable("word",""),a.update_global_variable("result",""),a.record("-","Initialize WordDictionary with root node");let o=0,i=new Map;i.set("","node_root");let n=new Map;function s(e,r){let t=n.get(e);t&&a.update_visual(e,{type:"trieNode",char:t.char,isEndOfWord:t.isEndOfWord,parent:t.parent,edgeLabel:t.edgeLabel,state:r})}n.set("node_root",{char:"*",isEndOfWord:!1});for(let e=0;e<r.length;e++){let d=r[e],l=t[e];if("WordDictionary"!==d)if(n.forEach((e,r)=>{s(r,"standard")}),a.update_global_variable("operation",d),a.update_global_variable("word",l||""),a.update_global_variable("result",""),"addWord"===d&&l){a.pushCallFrame({word:l},"addWord"),a.record("start_add",`Start: addWord("${l}")`);let e="",r="node_root";s(r,"active"),a.record("at_root","Start at root node");for(let t=0;t<l.length;t++){let d=l[t],c=e+d,h=i.has(c);if(a.add_conditional("check_exists",!h),a.record("process_char",`Process character '${d}' (${t+1}/${l.length})`),h){let e=i.get(c);s(r,"visited"),s(e,"active"),a.record("traverse_existing",`Character '${d}' exists, traverse to child`),r=e}else{o++;let t=`node_${o}`,l=i.get(e);a.add_new_visual(t,{type:"trieNode",char:d,isEndOfWord:!1,parent:l,edgeLabel:d,state:"highlight"}),i.set(c,t),n.set(t,{char:d,isEndOfWord:!1,parent:l,edgeLabel:d}),s(r,"visited"),a.record("create_node",`Create new node for '${d}'`),s(t,"active"),r=t}e=c}n.get(r).isEndOfWord=!0,s(r,"result"),a.update_global_variable("result","null"),a.record("mark_end",`Mark node as end of word "${l}"`),a.popCallFrame()}else"search"===d&&l&&(a.record("start_search",`Start: search("${l}")`),s("node_root","active"),!function e(r,t,d,o){if(a.pushCallFrame({node:n.get(t)?.char||"*",index:o,word:d},"dfs"),o===d.length){let e=n.get(t),r=e?.isEndOfWord||!1;return a.add_conditional("check_end",r),r?(s(t,"result"),a.record("found_match","Reached end of word, node is marked as end, found!")):(s(t,"error"),a.record("not_end_of_word","Reached end of word, but node is NOT marked as end")),a.popCallFrame(),r}let l=d[o],c="."===l;if(a.add_conditional("is_wildcard",c),a.record("search_char",`Processing character '${l}' at index ${o}`),c){a.record("check_wildcard","Wildcard '.', try all children");let l=function(e){let r=[];return i.forEach((t,d)=>{d.length===e.length+1&&d.startsWith(e)&&r.push(d)}),r}(r);if(0===l.length)return s(t,"error"),a.record("wildcard_no_match","No children to explore, not found"),a.popCallFrame(),!1;for(let r of l){let l=i.get(r),c=n.get(l)?.char||"?";if(s(t,"visited"),s(l,"highlight"),a.record("try_child",`Try child '${c}' for wildcard '.'`),s(l,"active"),e(r,l,d,o+1))return a.record("wildcard_matched",`Child '${c}' matched, propagate success`),a.popCallFrame(),!0;s(l,"visited")}return s(t,"error"),a.record("wildcard_no_match",`No children matched for wildcard at index ${o}`),a.popCallFrame(),!1}{let n=r+l;if(!i.has(n))return s(t,"error"),a.record("char_not_found",`Character '${l}' not found, search fails`),a.popCallFrame(),!1;let c=i.get(n);s(t,"visited"),s(c,"active"),a.record("follow_child",`Found character '${l}', traverse to child`);let h=e(n,c,d,o+1);return a.record("dfs_return",`Return from dfs, result: ${h}`),a.popCallFrame(),h}}("","node_root",l,0)?(a.update_global_variable("result","false"),a.record("word_not_found",`search("${l}") = false`)):(a.update_global_variable("result","true"),a.record("word_found",`search("${l}") = true`)))}return a.record("complete","All operations completed"),a.getSteps()
}

export function DesignAddAndSearchWordsDataStructureProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignAddAndSearchWordsDataStructureTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDesignAddAndSearchWordsDataStructureSteps(e) as any[];
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
      title="Design Add and Search Words Data Structure"
      slug="design-add-and-search-words-data-structure"
      approaches={approaches}
      presets={DesignAddAndSearchWordsDataStructurePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design In-Memory File System (design-in-memory-file-system)
// ==========================================

const DesignInMemoryFileSystemTemplates = {
  "python": {
    "language": "python",
    "code": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.content = None  # None for directories, string for files\n\nclass FileSystem:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def _navigate(self, path: str) -> TrieNode:\n        \"\"\"Navigate from root to the node at the given path.\"\"\"\n        node = self.root\n        if path == \"/\":\n            return node\n        parts = path.split(\"/\")\n        for i in range(1, len(parts)):\n            node = node.children[parts[i]]\n        return node\n\n    def _navigate_and_create(self, path: str) -> TrieNode:\n        \"\"\"Navigate and create missing nodes along the way.\"\"\"\n        node = self.root\n        if path == \"/\":\n            return node\n        parts = path.split(\"/\")\n        for i in range(1, len(parts)):\n            if parts[i] not in node.children:\n                node.children[parts[i]] = TrieNode()\n            node = node.children[parts[i]]\n        return node\n\n    def ls(self, path: str) -> list[str]:\n        node = self._navigate(path)\n        # If it's a file, return just the file name\n        if node.content is not None:\n            return [path.split(\"/\")[-1]]\n        # Otherwise return sorted children names\n        return sorted(node.children.keys())\n\n    def mkdir(self, path: str) -> None:\n        self._navigate_and_create(path)\n\n    def addContentToFile(self, filePath: str, content: str) -> None:\n        node = self._navigate_and_create(filePath)\n        # Append content (initialize if first write)\n        if node.content is None:\n            node.content = content\n        else:\n            node.content += content\n\n    def readContentFromFile(self, filePath: str) -> str:\n        return self._navigate(filePath).content",
    "lineMap": {
      "-": [
        8
      ],
      "start_ls": [
        32
      ],
      "navigate_ls": [
        33
      ],
      "enter_dir": [
        16,
        17,
        18
      ],
      "check_is_file": [
        35
      ],
      "list_children": [
        38
      ],
      "ls_done": [
        38
      ],
      "start_mkdir": [
        40
      ],
      "navigate_mkdir": [
        41
      ],
      "create_dir": [
        27,
        28,
        29
      ],
      "mkdir_done": [
        41
      ],
      "start_addcontent": [
        43
      ],
      "navigate_addcontent": [
        44
      ],
      "create_nodes": [
        27,
        28,
        29
      ],
      "write_content": [
        46,
        47,
        48,
        49
      ],
      "addcontent_done": [
        49
      ],
      "start_readcontent": [
        51
      ],
      "navigate_readcontent": [
        52
      ],
      "read_content": [
        52
      ],
      "readcontent_done": [
        52
      ],
      "complete": [
        52
      ]
    },
    "conditionalMap": {
      "check_is_file": [
        35
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class FileSystem {\n    // Each node represents a file or directory in the tree\n    class TrieNode {\n        Map<String, TrieNode> children;\n        String content;  // null for directories, non-null for files\n\n        TrieNode() {\n            children = new HashMap<>();\n            content = null;\n        }\n    }\n\n    TrieNode root;\n\n    public FileSystem() {\n        root = new TrieNode();\n    }\n\n    // Navigate from root to the node at the given path\n    private TrieNode navigate(String path) {\n        TrieNode node = root;\n        if (path.equals(\"/\")) return node;\n        String[] parts = path.split(\"/\");\n        for (int i = 1; i < parts.length; i++) {\n            node = node.children.get(parts[i]);\n        }\n        return node;\n    }\n\n    // Navigate and create missing nodes along the way\n    private TrieNode navigateAndCreate(String path) {\n        TrieNode node = root;\n        if (path.equals(\"/\")) return node;\n        String[] parts = path.split(\"/\");\n        for (int i = 1; i < parts.length; i++) {\n            node.children.putIfAbsent(parts[i], new TrieNode());\n            node = node.children.get(parts[i]);\n        }\n        return node;\n    }\n\n    public List<String> ls(String path) {\n        TrieNode node = navigate(path);\n        // If it's a file, return just the file name\n        if (node.content != null) {\n            String[] parts = path.split(\"/\");\n            return Collections.singletonList(parts[parts.length - 1]);\n        }\n        // Otherwise return sorted children names\n        List<String> result = new ArrayList<>(node.children.keySet());\n        Collections.sort(result);\n        return result;\n    }\n\n    public void mkdir(String path) {\n        navigateAndCreate(path);\n    }\n\n    public void addContentToFile(String filePath, String content) {\n        TrieNode node = navigateAndCreate(filePath);\n        // Append content (initialize if first write)\n        if (node.content == null) {\n            node.content = content;\n        } else {\n            node.content += content;\n        }\n    }\n\n    public String readContentFromFile(String filePath) {\n        return navigate(filePath).content;\n    }\n}",
    "lineMap": {
      "-": [
        16
      ],
      "start_ls": [
        42
      ],
      "navigate_ls": [
        43
      ],
      "enter_dir": [
        24,
        25,
        27
      ],
      "check_is_file": [
        45
      ],
      "list_children": [
        50,
        51
      ],
      "ls_done": [
        52
      ],
      "start_mkdir": [
        55
      ],
      "navigate_mkdir": [
        56
      ],
      "create_dir": [
        35,
        36,
        37
      ],
      "mkdir_done": [
        56
      ],
      "start_addcontent": [
        59
      ],
      "navigate_addcontent": [
        60
      ],
      "create_nodes": [
        35,
        36,
        37
      ],
      "write_content": [
        62,
        63,
        64,
        65
      ],
      "addcontent_done": [
        66
      ],
      "start_readcontent": [
        69
      ],
      "navigate_readcontent": [
        70
      ],
      "read_content": [
        70
      ],
      "readcontent_done": [
        70
      ],
      "complete": [
        71
      ]
    },
    "conditionalMap": {
      "check_is_file": [
        45
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class FileSystem {\n    struct TrieNode {\n        unordered_map<string, TrieNode*> children;\n        string content;  // empty string means directory, non-empty means file\n        bool isFile;\n\n        TrieNode() : isFile(false) {}\n    };\n\n    TrieNode* root;\n\n    // Split path into components (skip empty first element from leading /)\n    vector<string> splitPath(const string& path) {\n        vector<string> parts;\n        string part;\n        for (int i = 1; i < path.size(); i++) {\n            if (path[i] == '/') {\n                if (!part.empty()) parts.push_back(part);\n                part.clear();\n            } else {\n                part += path[i];\n            }\n        }\n        if (!part.empty()) parts.push_back(part);\n        return parts;\n    }\n\n    // Navigate from root to the node at the given path\n    TrieNode* navigate(const string& path) {\n        TrieNode* node = root;\n        vector<string> parts = splitPath(path);\n        for (const string& p : parts) {\n            node = node->children[p];\n        }\n        return node;\n    }\n\n    // Navigate and create missing nodes along the way\n    TrieNode* navigateAndCreate(const string& path) {\n        TrieNode* node = root;\n        vector<string> parts = splitPath(path);\n        for (const string& p : parts) {\n            if (!node->children.count(p)) {\n                node->children[p] = new TrieNode();\n            }\n            node = node->children[p];\n        }\n        return node;\n    }\n\npublic:\n    FileSystem() {\n        root = new TrieNode();\n    }\n\n    vector<string> ls(string path) {\n        TrieNode* node = navigate(path);\n        // If it's a file, return just the file name\n        if (node->isFile) {\n            vector<string> parts = splitPath(path);\n            return {parts.back()};\n        }\n        // Otherwise return sorted children names\n        vector<string> result;\n        for (auto& [name, child] : node->children) {\n            result.push_back(name);\n        }\n        sort(result.begin(), result.end());\n        return result;\n    }\n\n    void mkdir(string path) {\n        navigateAndCreate(path);\n    }\n\n    void addContentToFile(string filePath, string content) {\n        TrieNode* node = navigateAndCreate(filePath);\n        node->isFile = true;\n        node->content += content;\n    }\n\n    string readContentFromFile(string filePath) {\n        return navigate(filePath)->content;\n    }\n};",
    "lineMap": {
      "-": [
        53
      ],
      "start_ls": [
        56
      ],
      "navigate_ls": [
        57
      ],
      "enter_dir": [
        32,
        33,
        35
      ],
      "check_is_file": [
        59
      ],
      "list_children": [
        64,
        65,
        66,
        68
      ],
      "ls_done": [
        69
      ],
      "start_mkdir": [
        72
      ],
      "navigate_mkdir": [
        73
      ],
      "create_dir": [
        42,
        43,
        44,
        46
      ],
      "mkdir_done": [
        73
      ],
      "start_addcontent": [
        76
      ],
      "navigate_addcontent": [
        77
      ],
      "create_nodes": [
        42,
        43,
        44,
        46
      ],
      "write_content": [
        78,
        79
      ],
      "addcontent_done": [
        79
      ],
      "start_readcontent": [
        82
      ],
      "navigate_readcontent": [
        83
      ],
      "read_content": [
        83
      ],
      "readcontent_done": [
        83
      ],
      "complete": [
        84
      ]
    },
    "conditionalMap": {
      "check_is_file": [
        59
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class FileSystem {\n    class TrieNode {\n        public Dictionary<string, TrieNode> Children = new Dictionary<string, TrieNode>();\n        public string Content = null;  // null for directories, non-null for files\n    }\n\n    TrieNode root;\n\n    public FileSystem() {\n        root = new TrieNode();\n    }\n\n    // Navigate from root to the node at the given path\n    private TrieNode Navigate(string path) {\n        TrieNode node = root;\n        if (path == \"/\") return node;\n        string[] parts = path.Split('/');\n        for (int i = 1; i < parts.Length; i++) {\n            node = node.Children[parts[i]];\n        }\n        return node;\n    }\n\n    // Navigate and create missing nodes along the way\n    private TrieNode NavigateAndCreate(string path) {\n        TrieNode node = root;\n        if (path == \"/\") return node;\n        string[] parts = path.Split('/');\n        for (int i = 1; i < parts.Length; i++) {\n            if (!node.Children.ContainsKey(parts[i])) {\n                node.Children[parts[i]] = new TrieNode();\n            }\n            node = node.Children[parts[i]];\n        }\n        return node;\n    }\n\n    public IList<string> Ls(string path) {\n        TrieNode node = Navigate(path);\n        // If it's a file, return just the file name\n        if (node.Content != null) {\n            string[] parts = path.Split('/');\n            return new List<string> { parts[parts.Length - 1] };\n        }\n        // Otherwise return sorted children names\n        List<string> result = new List<string>(node.Children.Keys);\n        result.Sort();\n        return result;\n    }\n\n    public void Mkdir(string path) {\n        NavigateAndCreate(path);\n    }\n\n    public void AddContentToFile(string filePath, string content) {\n        TrieNode node = NavigateAndCreate(filePath);\n        if (node.Content == null) {\n            node.Content = content;\n        } else {\n            node.Content += content;\n        }\n    }\n\n    public string ReadContentFromFile(string filePath) {\n        return Navigate(filePath).Content;\n    }\n}",
    "lineMap": {
      "-": [
        10
      ],
      "start_ls": [
        38
      ],
      "navigate_ls": [
        39
      ],
      "enter_dir": [
        18,
        19,
        21
      ],
      "check_is_file": [
        41
      ],
      "list_children": [
        46,
        47
      ],
      "ls_done": [
        48
      ],
      "start_mkdir": [
        51
      ],
      "navigate_mkdir": [
        52
      ],
      "create_dir": [
        30,
        31,
        33
      ],
      "mkdir_done": [
        52
      ],
      "start_addcontent": [
        55
      ],
      "navigate_addcontent": [
        56
      ],
      "create_nodes": [
        30,
        31,
        33
      ],
      "write_content": [
        57,
        58,
        59,
        60
      ],
      "addcontent_done": [
        61
      ],
      "start_readcontent": [
        64
      ],
      "navigate_readcontent": [
        65
      ],
      "read_content": [
        65
      ],
      "readcontent_done": [
        65
      ],
      "complete": [
        66
      ]
    },
    "conditionalMap": {
      "check_is_file": [
        41
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type TrieNode struct {\n    children map[string]*TrieNode\n    content  *string // nil for directories, non-nil for files\n}\n\ntype FileSystem struct {\n    root *TrieNode\n}\n\nfunc Constructor() FileSystem {\n    return FileSystem{root: &TrieNode{children: make(map[string]*TrieNode)}}\n}\n\n// navigate walks from root to the node at the given path\nfunc (fs *FileSystem) navigate(path string) *TrieNode {\n    node := fs.root\n    if path == \"/\" {\n        return node\n    }\n    parts := strings.Split(path, \"/\")\n    for i := 1; i < len(parts); i++ {\n        node = node.children[parts[i]]\n    }\n    return node\n}\n\n// navigateAndCreate walks the path, creating missing nodes\nfunc (fs *FileSystem) navigateAndCreate(path string) *TrieNode {\n    node := fs.root\n    if path == \"/\" {\n        return node\n    }\n    parts := strings.Split(path, \"/\")\n    for i := 1; i < len(parts); i++ {\n        if _, ok := node.children[parts[i]]; !ok {\n            node.children[parts[i]] = &TrieNode{children: make(map[string]*TrieNode)}\n        }\n        node = node.children[parts[i]]\n    }\n    return node\n}\n\nfunc (fs *FileSystem) Ls(path string) []string {\n    node := fs.navigate(path)\n    // If it's a file, return just the file name\n    if node.content != nil {\n        parts := strings.Split(path, \"/\")\n        return []string{parts[len(parts)-1]}\n    }\n    // Otherwise return sorted children names\n    result := make([]string, 0, len(node.children))\n    for name := range node.children {\n        result = append(result, name)\n    }\n    sort.Strings(result)\n    return result\n}\n\nfunc (fs *FileSystem) Mkdir(path string) {\n    fs.navigateAndCreate(path)\n}\n\nfunc (fs *FileSystem) AddContentToFile(filePath string, content string) {\n    node := fs.navigateAndCreate(filePath)\n    if node.content == nil {\n        s := content\n        node.content = &s\n    } else {\n        *node.content += content\n    }\n}\n\nfunc (fs *FileSystem) ReadContentFromFile(filePath string) string {\n    return *fs.navigate(filePath).content\n}",
    "lineMap": {
      "-": [
        11
      ],
      "start_ls": [
        43
      ],
      "navigate_ls": [
        44
      ],
      "enter_dir": [
        21,
        22,
        24
      ],
      "check_is_file": [
        46
      ],
      "list_children": [
        51,
        52,
        55
      ],
      "ls_done": [
        56
      ],
      "start_mkdir": [
        59
      ],
      "navigate_mkdir": [
        60
      ],
      "create_dir": [
        35,
        36,
        38
      ],
      "mkdir_done": [
        60
      ],
      "start_addcontent": [
        63
      ],
      "navigate_addcontent": [
        64
      ],
      "create_nodes": [
        35,
        36,
        38
      ],
      "write_content": [
        65,
        66,
        67,
        69
      ],
      "addcontent_done": [
        69
      ],
      "start_readcontent": [
        73
      ],
      "navigate_readcontent": [
        74
      ],
      "read_content": [
        74
      ],
      "readcontent_done": [
        74
      ],
      "complete": [
        74
      ]
    },
    "conditionalMap": {
      "check_is_file": [
        46
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var FileSystem = function () {\n  // Root node of the file system tree\n  this.root = { children: {}, content: null };\n};\n\n// Navigate from root to the node at the given path\nFileSystem.prototype._navigate = function (path) {\n  let node = this.root;\n  if (path === \"/\") return node;\n  const parts = path.split(\"/\");\n  for (let i = 1; i < parts.length; i++) {\n    node = node.children[parts[i]];\n  }\n  return node;\n};\n\n// Navigate and create missing nodes along the way\nFileSystem.prototype._navigateAndCreate = function (path) {\n  let node = this.root;\n  if (path === \"/\") return node;\n  const parts = path.split(\"/\");\n  for (let i = 1; i < parts.length; i++) {\n    if (!node.children[parts[i]]) {\n      node.children[parts[i]] = { children: {}, content: null };\n    }\n    node = node.children[parts[i]];\n  }\n  return node;\n};\n\nFileSystem.prototype.ls = function (path) {\n  const node = this._navigate(path);\n  // If it's a file, return just the file name\n  if (node.content !== null) {\n    const parts = path.split(\"/\");\n    return [parts[parts.length - 1]];\n  }\n  // Otherwise return sorted children names\n  return Object.keys(node.children).sort();\n};\n\nFileSystem.prototype.mkdir = function (path) {\n  this._navigateAndCreate(path);\n};\n\nFileSystem.prototype.addContentToFile = function (filePath, content) {\n  const node = this._navigateAndCreate(filePath);\n  if (node.content === null) {\n    node.content = content;\n  } else {\n    node.content += content;\n  }\n};\n\nFileSystem.prototype.readContentFromFile = function (filePath) {\n  return this._navigate(filePath).content;\n};",
    "lineMap": {
      "-": [
        3
      ],
      "start_ls": [
        31
      ],
      "navigate_ls": [
        32
      ],
      "enter_dir": [
        11,
        12,
        14
      ],
      "check_is_file": [
        34
      ],
      "list_children": [
        39
      ],
      "ls_done": [
        39
      ],
      "start_mkdir": [
        42
      ],
      "navigate_mkdir": [
        43
      ],
      "create_dir": [
        23,
        24,
        26
      ],
      "mkdir_done": [
        43
      ],
      "start_addcontent": [
        46
      ],
      "navigate_addcontent": [
        47
      ],
      "create_nodes": [
        23,
        24,
        26
      ],
      "write_content": [
        48,
        49,
        50,
        51
      ],
      "addcontent_done": [
        52
      ],
      "start_readcontent": [
        55
      ],
      "navigate_readcontent": [
        56
      ],
      "read_content": [
        56
      ],
      "readcontent_done": [
        56
      ],
      "complete": [
        56
      ]
    },
    "conditionalMap": {
      "check_is_file": [
        34
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class TrieNode {\n    children: Map<string, TrieNode>;\n    content: string | null;\n\n    constructor() {\n        this.children = new Map();\n        this.content = null; // null for directories, string for files\n    }\n}\n\nclass FileSystem {\n    private root: TrieNode;\n\n    constructor() {\n        this.root = new TrieNode();\n    }\n\n    // Navigate from root to the node at the given path\n    private navigate(path: string): TrieNode {\n        let node = this.root;\n        if (path === \"/\") return node;\n        const parts = path.split(\"/\");\n        for (let i = 1; i < parts.length; i++) {\n            node = node.children.get(parts[i])!;\n        }\n        return node;\n    }\n\n    // Navigate and create missing nodes along the way\n    private navigateAndCreate(path: string): TrieNode {\n        let node = this.root;\n        if (path === \"/\") return node;\n        const parts = path.split(\"/\");\n        for (let i = 1; i < parts.length; i++) {\n            if (!node.children.has(parts[i])) {\n                node.children.set(parts[i], new TrieNode());\n            }\n            node = node.children.get(parts[i])!;\n        }\n        return node;\n    }\n\n    ls(path: string): string[] {\n        const node = this.navigate(path);\n        // If it's a file, return just the file name\n        if (node.content !== null) {\n            const parts = path.split(\"/\");\n            return [parts[parts.length - 1]];\n        }\n        // Otherwise return sorted children names\n        return [...node.children.keys()].sort();\n    }\n\n    mkdir(path: string): void {\n        this.navigateAndCreate(path);\n    }\n\n    addContentToFile(filePath: string, content: string): void {\n        const node = this.navigateAndCreate(filePath);\n        if (node.content === null) {\n            node.content = content;\n        } else {\n            node.content += content;\n        }\n    }\n\n    readContentFromFile(filePath: string): string {\n        return this.navigate(filePath).content!;\n    }\n}",
    "lineMap": {
      "-": [
        15
      ],
      "start_ls": [
        43
      ],
      "navigate_ls": [
        44
      ],
      "enter_dir": [
        23,
        24,
        26
      ],
      "check_is_file": [
        46
      ],
      "list_children": [
        51
      ],
      "ls_done": [
        51
      ],
      "start_mkdir": [
        54
      ],
      "navigate_mkdir": [
        55
      ],
      "create_dir": [
        35,
        36,
        38
      ],
      "mkdir_done": [
        55
      ],
      "start_addcontent": [
        58
      ],
      "navigate_addcontent": [
        59
      ],
      "create_nodes": [
        35,
        36,
        38
      ],
      "write_content": [
        60,
        61,
        62,
        63
      ],
      "addcontent_done": [
        64
      ],
      "start_readcontent": [
        67
      ],
      "navigate_readcontent": [
        68
      ],
      "read_content": [
        68
      ],
      "readcontent_done": [
        68
      ],
      "complete": [
        69
      ]
    },
    "conditionalMap": {
      "check_is_file": [
        46
      ]
    }
  }
};

const DesignInMemoryFileSystemPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "LeetCode Example",
    "value": {
      "operations": [
        "FileSystem",
        "ls",
        "mkdir",
        "addContentToFile",
        "ls",
        "readContentFromFile"
      ],
      "values": [
        null,
        "/",
        "/a/b/c",
        "/a/b/c/d|hello",
        "/",
        "/a/b/c/d"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Nested Dirs",
    "value": {
      "operations": [
        "FileSystem",
        "mkdir",
        "mkdir",
        "addContentToFile",
        "addContentToFile",
        "ls",
        "readContentFromFile"
      ],
      "values": [
        null,
        "/docs",
        "/docs/notes",
        "/docs/notes/todo.txt|buy milk",
        "/docs/notes/todo.txt| and eggs",
        "/docs",
        "/docs/notes/todo.txt"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Simple",
    "value": {
      "operations": [
        "FileSystem",
        "mkdir",
        "addContentToFile",
        "addContentToFile",
        "readContentFromFile",
        "ls"
      ],
      "values": [
        null,
        "/home",
        "/home/file1|content1",
        "/home/file1| more",
        "/home/file1",
        "/home"
      ]
    }
  }
];

function generateDesignInMemoryFileSystemSteps(e: any): any[] {
  
let t=e.operations||[],n=e.values||[],i={name:"/",children:new Map,content:null},a=0,s=new Map;s.set("/","node_root");let o=new Map,l=new StepRecorder({operation:"",result:""},{node_root:{type:"naryTreeNode",value:"/",state:"standard",label:"D"},meta_result:{type:"metadata",value:""},meta_path:{type:"metadata",value:""},meta_content:{type:"metadata",value:""}});function d(e){if("/"===e)return i;let t=e.split("/").filter(e=>e.length>0),n=i;for(let e of t){if(!n.children.has(e))break;n=n.children.get(e)}return n}function c(e,t,n,r){if(s.has(e))return s.get(e);a++;let i=`node_${a}`,d=s.get(n)||"node_root";s.set(e,i);let c=o.get(d)||0;return o.set(d,c+1),l.add_new_visual(i,{type:"naryTreeNode",value:t,parent:d,childIndex:c,state:"highlight",label:r?"F":"D"}),i}function p(e){let t=l.get_visual("node_root");if(t&&l.update_visual("node_root",{...t,state:"highlight"}),"/"===e)return;let n=e.split("/").filter(e=>e.length>0),r="/";for(let e of n){r="/"===r?`/${e}`:`${r}/${e}`;let t=s.get(r);if(t){let e=l.get_visual(t);e&&l.update_visual(t,{...e,state:"highlight"})}}}function h(e){let t="/"===e?"node_root":s.get(e);if(t){let e=l.get_visual(t);e&&l.update_visual(t,{...e,state:"active"})}}l.record("-","Initialize In-Memory File System with root directory /");for(let e=0;e<t.length;e++){let r=t[e],a=n[e];if("FileSystem"!==r){if(s.forEach(e=>{let t=l.get_visual(e);t&&"naryTreeNode"===t.type&&l.update_visual(e,{...t,state:"standard"})}),l.update_variable("operation",r),l.update_variable("result",""),l.update_visual("meta_result",{type:"metadata",value:""}),l.update_visual("meta_content",{type:"metadata",value:""}),"ls"===r&&null!==a){l.update_visual("meta_path",{type:"metadata",value:a}),l.record("start_ls",`ls("${a}"): List directory or file`),p(a),l.record("navigate_ls",`Navigate to path "${a}"`);let e=d(a);if(h(a),l.record("enter_dir",`Reached target at "${a}"`),null!==e.content){let e=a.split("/").filter(e=>e.length>0),t=[e[e.length-1]];l.add_conditional("check_is_file",!0),l.record("check_is_file",`"${a}" is a file, return file name`),l.update_variable("result",JSON.stringify(t)),l.update_visual("meta_result",{type:"metadata",value:JSON.stringify(t)}),l.record("ls_done",`ls result: [${t.join(", ")}]`)}else{let t=Array.from(e.children.keys()).sort();for(let e of(l.add_conditional("check_is_file",!1),l.record("check_is_file",`"${a}" is a directory, list children`),t)){let t="/"===a?`/${e}`:`${a}/${e}`,n=s.get(t);if(n){let e=l.get_visual(n);e&&l.update_visual(n,{...e,state:"active"})}}l.update_variable("result",JSON.stringify(t)),l.update_visual("meta_result",{type:"metadata",value:JSON.stringify(t)}),l.record("list_children",`Directory children (sorted): [${t.join(", ")}]`),l.record("ls_done",`ls result: [${t.length>0?t.join(", "):"(empty)"}]`)}}else if("mkdir"===r&&null!==a){l.update_visual("meta_path",{type:"metadata",value:a}),l.record("start_mkdir",`mkdir("${a}"): Create directory path`);let e=a.split("/").filter(e=>e.length>0),t="/",n=i,r=l.get_visual("node_root");for(let i of(r&&l.update_visual("node_root",{...r,state:"highlight"}),l.record("navigate_mkdir","Start from root, creating directories as needed"),e)){let e=t;if(t="/"===t?`/${i}`:`${t}/${i}`,n.children.has(i)){let e=s.get(t);if(e){let t=l.get_visual(e);t&&l.update_visual(e,{...t,state:"highlight"})}l.record("navigate_mkdir",`Directory "${i}" already exists, traverse`)}else n.children.set(i,{name:i,children:new Map,content:null}),c(t,i,e,!1),l.record("create_dir",`Create directory "${i}" at ${t}`);n=n.children.get(i)}h(t),l.update_variable("result","null"),l.update_visual("meta_result",{type:"metadata",value:"null (void)"}),l.record("mkdir_done",`mkdir complete: path "${a}" created`)}else if("addContentToFile"===r&&null!==a){let e,t;if(a.includes("|")){let n=a.indexOf("|");e=a.substring(0,n),t=a.substring(n+1)}else if(a.includes("	")){let n=a.indexOf("	");e=a.substring(0,n),t=a.substring(n+1)}else e=a,t="";l.update_visual("meta_path",{type:"metadata",value:e}),l.update_visual("meta_content",{type:"metadata",value:t}),l.record("start_addcontent",`addContentToFile("${e}", "${t}")`);let n=e.split("/").filter(e=>e.length>0),r="/",o=i;p("/"),l.record("navigate_addcontent","Navigate to file path, creating nodes as needed");for(let e=0;e<n.length;e++){let t=n[e],i=r;r="/"===r?`/${t}`:`${r}/${t}`;let a=e===n.length-1;if(o.children.has(t)){let e=s.get(r);if(e){let t=l.get_visual(e);t&&l.update_visual(e,{...t,state:"highlight",label:a?"F":t.label})}}else o.children.set(t,{name:t,children:new Map,content:null}),c(r,t,i,a),l.record("create_nodes",`Create ${a?"file":"directory"} node "${t}"`);o=o.children.get(t)}null===o.content?o.content=t:o.content+=t;let d=s.get(r);if(d){let e=l.get_visual(d);e&&l.update_visual(d,{...e,state:"active",label:"F"})}l.update_visual("meta_content",{type:"metadata",value:o.content}),l.record("write_content",`Write content to file. Total content: "${o.content}"`),l.update_variable("result","null"),l.update_visual("meta_result",{type:"metadata",value:"null (void)"}),l.record("addcontent_done","addContentToFile complete")}else if("readContentFromFile"===r&&null!==a){l.update_visual("meta_path",{type:"metadata",value:a}),l.record("start_readcontent",`readContentFromFile("${a}")`),p(a),l.record("navigate_readcontent",`Navigate to file at "${a}"`);let e=d(a);h(a);let t=e.content||"";l.update_visual("meta_content",{type:"metadata",value:t}),l.record("read_content",`Read file content: "${t}"`),l.update_variable("result",`"${t}"`),l.update_visual("meta_result",{type:"metadata",value:`"${t}"`}),l.record("readcontent_done",`readContentFromFile result: "${t}"`)}}}return l.record("complete","All operations completed"),l.getSteps()
}

export function DesignInMemoryFileSystemProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignInMemoryFileSystemTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDesignInMemoryFileSystemSteps(e) as any[];
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
      title="Design In-Memory File System"
      slug="design-in-memory-file-system"
      approaches={approaches}
      presets={DesignInMemoryFileSystemPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design Search Autocomplete System (design-search-autocomplete-system)
// ==========================================

const DesignSearchAutocompleteSystemTemplates = {
  "python": {
    "language": "python",
    "code": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.top3 = []\n\nclass AutocompleteSystem:\n    def __init__(self, sentences: list[str], times: list[int]):\n        self.root = TrieNode()\n        self.counts = {}\n        self.current = self.root\n        self.prefix = []\n\n        for i in range(len(sentences)):\n            self.counts[sentences[i]] = times[i]\n            self._insert(sentences[i])\n\n    def _update_top3(self, node: TrieNode, sentence: str) -> None:\n        if sentence in node.top3:\n            node.top3.remove(sentence)\n        node.top3.append(sentence)\n        node.top3.sort(key=lambda s: (-self.counts[s], s))\n        if len(node.top3) > 3:\n            node.top3.pop()\n\n    def _insert(self, sentence: str) -> None:\n        node = self.root\n        self._update_top3(node, sentence)\n        for c in sentence:\n            if c not in node.children:\n                node.children[c] = TrieNode()\n            node = node.children[c]\n            self._update_top3(node, sentence)\n\n    def input(self, c: str) -> list[str]:\n        if c == '#':\n            sentence = ''.join(self.prefix)\n            self.counts[sentence] = self.counts.get(sentence, 0) + 1\n            self._insert(sentence)\n            self.prefix = []\n            self.current = self.root\n            return []\n\n        self.prefix.append(c)\n\n        if self.current is None or c not in self.current.children:\n            self.current = None\n            return []\n\n        self.current = self.current.children[c]\n        return list(self.current.top3)",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10,
        11
      ],
      "init_trie": [
        13,
        14,
        15
      ],
      "insert_sentence": [
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32
      ],
      "start_input": [
        34
      ],
      "start_commit": [
        35,
        36
      ],
      "update_count": [
        37
      ],
      "reinsert_trie": [
        38
      ],
      "commit_done": [
        39,
        40,
        41
      ],
      "append_char": [
        43
      ],
      "traverse_trie": [
        45
      ],
      "node_not_found": [
        46
      ],
      "show_empty": [
        47
      ],
      "node_found": [
        49
      ],
      "show_suggestions": [
        50
      ],
      "input_done": [
        50
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_hash": [
        35
      ],
      "node_missing": [
        45
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class AutocompleteSystem {\n    Map<String, Integer> counts;\n    Object[] children;\n    List<String>[] top3;\n    int nodeCount;\n    int currentNode;\n    StringBuilder prefix;\n\n    @SuppressWarnings(\"unchecked\")\n    public AutocompleteSystem(String[] sentences, int[] times) {\n        int maxNodes = 600000;\n        counts = new HashMap<>();\n        children = new Object[maxNodes];\n        top3 = new List[maxNodes];\n        nodeCount = 1;\n        currentNode = 0;\n        prefix = new StringBuilder();\n\n        // Initialize root\n        children[0] = new int[27];\n        Arrays.fill((int[]) children[0], -1);\n        top3[0] = new ArrayList<>();\n\n        for (int i = 0; i < sentences.length; i++) {\n            counts.put(sentences[i], times[i]);\n            insertIntoTrie(sentences[i]);\n        }\n    }\n\n    private int charIndex(char c) {\n        return c == ' ' ? 26 : c - 'a';\n    }\n\n    private void insertIntoTrie(String sentence) {\n        int node = 0;\n        updateTop3(node, sentence);\n        for (char c : sentence.toCharArray()) {\n            int idx = charIndex(c);\n            int[] ch = (int[]) children[node];\n            if (ch[idx] == -1) {\n                ch[idx] = nodeCount;\n                children[nodeCount] = new int[27];\n                Arrays.fill((int[]) children[nodeCount], -1);\n                top3[nodeCount] = new ArrayList<>();\n                nodeCount++;\n            }\n            node = ch[idx];\n            updateTop3(node, sentence);\n        }\n    }\n\n    private void updateTop3(int node, String sentence) {\n        List<String> list = top3[node];\n        list.remove(sentence);\n        list.add(sentence);\n        list.sort((a, b) -> {\n            int countDiff = counts.get(b) - counts.get(a);\n            if (countDiff != 0) return countDiff;\n            return a.compareTo(b);\n        });\n        while (list.size() > 3) {\n            list.remove(list.size() - 1);\n        }\n    }\n\n    public List<String> input(char c) {\n        if (c == '#') {\n            String sentence = prefix.toString();\n            counts.put(sentence, counts.getOrDefault(sentence, 0) + 1);\n            insertIntoTrie(sentence);\n            prefix = new StringBuilder();\n            currentNode = 0;\n            return new ArrayList<>();\n        }\n\n        prefix.append(c);\n        int idx = charIndex(c);\n\n        if (currentNode == -1) {\n            return new ArrayList<>();\n        }\n\n        int[] ch = (int[]) children[currentNode];\n        if (ch[idx] == -1) {\n            currentNode = -1;\n            return new ArrayList<>();\n        }\n\n        currentNode = ch[idx];\n        return new ArrayList<>(top3[currentNode]);\n    }\n}",
    "lineMap": {
      "-": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "init_trie": [
        24,
        25,
        26,
        27
      ],
      "insert_sentence": [
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
      ],
      "start_input": [
        66
      ],
      "start_commit": [
        67,
        68
      ],
      "update_count": [
        69
      ],
      "reinsert_trie": [
        70
      ],
      "commit_done": [
        71,
        72,
        73
      ],
      "append_char": [
        76,
        77
      ],
      "traverse_trie": [
        83,
        84
      ],
      "node_not_found": [
        85
      ],
      "show_empty": [
        86
      ],
      "node_found": [
        89
      ],
      "show_suggestions": [
        90
      ],
      "input_done": [
        90
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_hash": [
        67
      ],
      "node_missing": [
        84
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "struct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    vector<string> top3;\n};\n\nclass AutocompleteSystem {\n    TrieNode* root;\n    TrieNode* current;\n    string prefix;\n    unordered_map<string, int> counts;\n\n    void updateTop3(TrieNode* node, const string& sentence) {\n        auto& list = node->top3;\n        list.erase(remove(list.begin(), list.end(), sentence), list.end());\n        list.push_back(sentence);\n        sort(list.begin(), list.end(), [&](const string& a, const string& b) {\n            if (counts[a] != counts[b]) return counts[a] > counts[b];\n            return a < b;\n        });\n        if (list.size() > 3) list.resize(3);\n    }\n\n    void insert(const string& sentence) {\n        TrieNode* node = root;\n        updateTop3(node, sentence);\n        for (char c : sentence) {\n            if (node->children.find(c) == node->children.end()) {\n                node->children[c] = new TrieNode();\n            }\n            node = node->children[c];\n            updateTop3(node, sentence);\n        }\n    }\n\npublic:\n    AutocompleteSystem(vector<string>& sentences, vector<int>& times) {\n        root = new TrieNode();\n        current = root;\n        for (int i = 0; i < sentences.size(); i++) {\n            counts[sentences[i]] = times[i];\n            insert(sentences[i]);\n        }\n    }\n\n    vector<string> input(char c) {\n        if (c == '#') {\n            counts[prefix]++;\n            insert(prefix);\n            prefix.clear();\n            current = root;\n            return {};\n        }\n\n        prefix += c;\n\n        if (current == nullptr || current->children.find(c) == current->children.end()) {\n            current = nullptr;\n            return {};\n        }\n\n        current = current->children[c];\n        return current->top3;\n    }\n};",
    "lineMap": {
      "-": [
        37,
        38
      ],
      "init_trie": [
        39,
        40,
        41,
        42
      ],
      "insert_sentence": [
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32
      ],
      "start_input": [
        45
      ],
      "start_commit": [
        46
      ],
      "update_count": [
        47
      ],
      "reinsert_trie": [
        48
      ],
      "commit_done": [
        49,
        50,
        51
      ],
      "append_char": [
        54
      ],
      "traverse_trie": [
        56
      ],
      "node_not_found": [
        57
      ],
      "show_empty": [
        58
      ],
      "node_found": [
        61
      ],
      "show_suggestions": [
        62
      ],
      "input_done": [
        62
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_hash": [
        46
      ],
      "node_missing": [
        56
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class AutocompleteSystem {\n    class TrieNode {\n        public Dictionary<char, TrieNode> Children = new Dictionary<char, TrieNode>();\n        public List<string> Top3 = new List<string>();\n    }\n\n    TrieNode root;\n    TrieNode current;\n    StringBuilder prefix;\n    Dictionary<string, int> counts;\n\n    public AutocompleteSystem(string[] sentences, int[] times) {\n        root = new TrieNode();\n        current = root;\n        prefix = new StringBuilder();\n        counts = new Dictionary<string, int>();\n        for (int i = 0; i < sentences.Length; i++) {\n            counts[sentences[i]] = times[i];\n            Insert(sentences[i]);\n        }\n    }\n\n    void UpdateTop3(TrieNode node, string sentence) {\n        node.Top3.Remove(sentence);\n        node.Top3.Add(sentence);\n        node.Top3.Sort((a, b) => {\n            int countDiff = counts[b] - counts[a];\n            if (countDiff != 0) return countDiff;\n            return string.Compare(a, b);\n        });\n        while (node.Top3.Count > 3) {\n            node.Top3.RemoveAt(node.Top3.Count - 1);\n        }\n    }\n\n    void Insert(string sentence) {\n        var node = root;\n        UpdateTop3(node, sentence);\n        foreach (char c in sentence) {\n            if (!node.Children.ContainsKey(c))\n                node.Children[c] = new TrieNode();\n            node = node.Children[c];\n            UpdateTop3(node, sentence);\n        }\n    }\n\n    public IList<string> Input(char c) {\n        if (c == '#') {\n            string sentence = prefix.ToString();\n            if (counts.ContainsKey(sentence)) counts[sentence]++;\n            else counts[sentence] = 1;\n            Insert(sentence);\n            prefix.Clear();\n            current = root;\n            return new List<string>();\n        }\n\n        prefix.Append(c);\n\n        if (current == null || !current.Children.ContainsKey(c)) {\n            current = null;\n            return new List<string>();\n        }\n\n        current = current.Children[c];\n        return new List<string>(current.Top3);\n    }\n}",
    "lineMap": {
      "-": [
        13,
        14,
        15,
        16
      ],
      "init_trie": [
        17,
        18,
        19,
        20
      ],
      "insert_sentence": [
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44
      ],
      "start_input": [
        47
      ],
      "start_commit": [
        48,
        49
      ],
      "update_count": [
        50,
        51
      ],
      "reinsert_trie": [
        52
      ],
      "commit_done": [
        53,
        54,
        55
      ],
      "append_char": [
        58
      ],
      "traverse_trie": [
        60
      ],
      "node_not_found": [
        61
      ],
      "show_empty": [
        62
      ],
      "node_found": [
        65
      ],
      "show_suggestions": [
        66
      ],
      "input_done": [
        66
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_hash": [
        48
      ],
      "node_missing": [
        60
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type TrieNode struct {\n    children map[byte]*TrieNode\n    top3     []string\n}\n\ntype AutocompleteSystem struct {\n    root    *TrieNode\n    current *TrieNode\n    prefix  []byte\n    counts  map[string]int\n}\n\nfunc Constructor(sentences []string, times []int) AutocompleteSystem {\n    root := &TrieNode{children: make(map[byte]*TrieNode)}\n    sys := AutocompleteSystem{\n        root:    root,\n        current: root,\n        counts:  make(map[string]int),\n    }\n    for i := 0; i < len(sentences); i++ {\n        sys.counts[sentences[i]] = times[i]\n        sys.insert(sentences[i])\n    }\n    return sys\n}\n\nfunc (as *AutocompleteSystem) updateTop3(node *TrieNode, sentence string) {\n    filtered := node.top3[:0]\n    for _, s := range node.top3 {\n        if s != sentence {\n            filtered = append(filtered, s)\n        }\n    }\n    node.top3 = append(filtered, sentence)\n\n    sort.Slice(node.top3, func(i, j int) bool {\n        ci := as.counts[node.top3[i]]\n        cj := as.counts[node.top3[j]]\n        if ci != cj {\n            return ci > cj\n        }\n        return node.top3[i] < node.top3[j]\n    })\n\n    if len(node.top3) > 3 {\n        node.top3 = node.top3[:3]\n    }\n}\n\nfunc (as *AutocompleteSystem) insert(sentence string) {\n    node := as.root\n    as.updateTop3(node, sentence)\n    for i := 0; i < len(sentence); i++ {\n        c := sentence[i]\n        if node.children[c] == nil {\n            node.children[c] = &TrieNode{children: make(map[byte]*TrieNode)}\n        }\n        node = node.children[c]\n        as.updateTop3(node, sentence)\n    }\n}\n\nfunc (as *AutocompleteSystem) Input(c byte) []string {\n    if c == '#' {\n        sentence := string(as.prefix)\n        as.counts[sentence]++\n        as.insert(sentence)\n        as.prefix = nil\n        as.current = as.root\n        return []string{}\n    }\n\n    as.prefix = append(as.prefix, c)\n\n    if as.current == nil || as.current.children[c] == nil {\n        as.current = nil\n        return []string{}\n    }\n\n    as.current = as.current.children[c]\n    result := make([]string, len(as.current.top3))\n    copy(result, as.current.top3)\n    return result\n}",
    "lineMap": {
      "-": [
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "init_trie": [
        20,
        21,
        22,
        23
      ],
      "insert_sentence": [
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60
      ],
      "start_input": [
        63
      ],
      "start_commit": [
        64,
        65
      ],
      "update_count": [
        66
      ],
      "reinsert_trie": [
        67
      ],
      "commit_done": [
        68,
        69,
        70
      ],
      "append_char": [
        73
      ],
      "traverse_trie": [
        75
      ],
      "node_not_found": [
        76
      ],
      "show_empty": [
        77
      ],
      "node_found": [
        80
      ],
      "show_suggestions": [
        81,
        82,
        83
      ],
      "input_done": [
        83
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_hash": [
        64
      ],
      "node_missing": [
        75
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var AutocompleteSystem = function (sentences, times) {\n  this.root = { children: {}, top3: [] };\n  this.current = this.root;\n  this.prefix = [];\n  this.counts = new Map();\n\n  for (let i = 0; i < sentences.length; i++) {\n    this.counts.set(sentences[i], times[i]);\n    this._insert(sentences[i]);\n  }\n};\n\nAutocompleteSystem.prototype._updateTop3 = function (node, sentence) {\n  node.top3 = node.top3.filter((s) => s !== sentence);\n  node.top3.push(sentence);\n  node.top3.sort((a, b) => {\n    const countDiff = this.counts.get(b) - this.counts.get(a);\n    if (countDiff !== 0) return countDiff;\n    return a.localeCompare(b);\n  });\n  if (node.top3.length > 3) node.top3.length = 3;\n};\n\nAutocompleteSystem.prototype._insert = function (sentence) {\n  let node = this.root;\n  this._updateTop3(node, sentence);\n  for (const c of sentence) {\n    if (!node.children[c]) {\n      node.children[c] = { children: {}, top3: [] };\n    }\n    node = node.children[c];\n    this._updateTop3(node, sentence);\n  }\n};\n\nAutocompleteSystem.prototype.input = function (c) {\n  if (c === \"#\") {\n    const sentence = this.prefix.join(\"\");\n    this.counts.set(sentence, (this.counts.get(sentence) || 0) + 1);\n    this._insert(sentence);\n    this.prefix = [];\n    this.current = this.root;\n    return [];\n  }\n\n  this.prefix.push(c);\n\n  if (this.current === null || !this.current.children[c]) {\n    this.current = null;\n    return [];\n  }\n\n  this.current = this.current.children[c];\n  return [...this.current.top3];\n};",
    "lineMap": {
      "-": [
        2,
        3,
        4,
        5
      ],
      "init_trie": [
        7,
        8,
        9,
        10
      ],
      "insert_sentence": [
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33
      ],
      "start_input": [
        36
      ],
      "start_commit": [
        37,
        38
      ],
      "update_count": [
        39
      ],
      "reinsert_trie": [
        40
      ],
      "commit_done": [
        41,
        42,
        43
      ],
      "append_char": [
        46
      ],
      "traverse_trie": [
        48
      ],
      "node_not_found": [
        49
      ],
      "show_empty": [
        50
      ],
      "node_found": [
        53
      ],
      "show_suggestions": [
        54
      ],
      "input_done": [
        54
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_hash": [
        37
      ],
      "node_missing": [
        48
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class TrieNode {\n    children: Map<string, TrieNode> = new Map();\n    top3: string[] = [];\n}\n\nclass AutocompleteSystem {\n    private root: TrieNode;\n    private current: TrieNode | null;\n    private prefix: string[];\n    private counts: Map<string, number>;\n\n    constructor(sentences: string[], times: number[]) {\n        this.root = new TrieNode();\n        this.current = this.root;\n        this.prefix = [];\n        this.counts = new Map();\n        for (let i = 0; i < sentences.length; i++) {\n            this.counts.set(sentences[i], times[i]);\n            this.insertIntoTrie(sentences[i]);\n        }\n    }\n\n    private updateTop3(node: TrieNode, sentence: string): void {\n        node.top3 = node.top3.filter((s) => s !== sentence);\n        node.top3.push(sentence);\n        node.top3.sort((a, b) => {\n            const countDiff = this.counts.get(b)! - this.counts.get(a)!;\n            if (countDiff !== 0) return countDiff;\n            return a.localeCompare(b);\n        });\n        if (node.top3.length > 3) node.top3.length = 3;\n    }\n\n    private insertIntoTrie(sentence: string): void {\n        let node = this.root;\n        this.updateTop3(node, sentence);\n        for (const c of sentence) {\n            if (!node.children.has(c)) {\n                node.children.set(c, new TrieNode());\n            }\n            node = node.children.get(c)!;\n            this.updateTop3(node, sentence);\n        }\n    }\n\n    input(c: string): string[] {\n        if (c === \"#\") {\n            const sentence = this.prefix.join(\"\");\n            this.counts.set(sentence, (this.counts.get(sentence) || 0) + 1);\n            this.insertIntoTrie(sentence);\n            this.prefix = [];\n            this.current = this.root;\n            return [];\n        }\n\n        this.prefix.push(c);\n\n        if (this.current === null || !this.current.children.has(c)) {\n            this.current = null;\n            return [];\n        }\n\n        this.current = this.current.children.get(c)!;\n        return [...this.current.top3];\n    }\n}",
    "lineMap": {
      "-": [
        13,
        14,
        15,
        16
      ],
      "init_trie": [
        17,
        18,
        19,
        20
      ],
      "insert_sentence": [
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43
      ],
      "start_input": [
        46
      ],
      "start_commit": [
        47,
        48
      ],
      "update_count": [
        49
      ],
      "reinsert_trie": [
        50
      ],
      "commit_done": [
        51,
        52,
        53
      ],
      "append_char": [
        56
      ],
      "traverse_trie": [
        58
      ],
      "node_not_found": [
        59
      ],
      "show_empty": [
        60
      ],
      "node_found": [
        63
      ],
      "show_suggestions": [
        64
      ],
      "input_done": [
        64
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_hash": [
        47
      ],
      "node_missing": [
        58
      ]
    }
  }
};

const DesignSearchAutocompleteSystemPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "LeetCode Example",
    "value": {
      "operations": [
        "AutocompleteSystem",
        "input",
        "input",
        "input",
        "input"
      ],
      "values": [
        [
          [
            "i love you",
            "island",
            "iroman",
            "i love leetcode"
          ],
          [
            5,
            3,
            2,
            2
          ]
        ],
        "i",
        " ",
        "a",
        "#"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "App Prefix",
    "value": {
      "operations": [
        "AutocompleteSystem",
        "input",
        "input",
        "input"
      ],
      "values": [
        [
          [
            "apple",
            "app",
            "application"
          ],
          [
            3,
            5,
            2
          ]
        ],
        "a",
        "p",
        "#"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Hello Search",
    "value": {
      "operations": [
        "AutocompleteSystem",
        "input",
        "input",
        "input",
        "input",
        "input"
      ],
      "values": [
        [
          [
            "hello",
            "help",
            "hero"
          ],
          [
            5,
            3,
            2
          ]
        ],
        "h",
        "e",
        "l",
        "l",
        "#"
      ]
    }
  }
];

function generateDesignSearchAutocompleteSystemSteps(e: any): any[] {
  let r=()=>({children:new Map,sentence:null,count:0});
let t=e.operations||[],n=e.values||[],s=new StepRecorder({operation:"",result:""},{}),o=r(),c=o,a="",l=new Map;function u(){l.forEach(e=>{let t=s.get_visual(e);t&&s.update_visual(e,{...t,state:"standard"})})}function d(e,t){let n=l.get(e);if(!n)return;let i=s.get_visual(n);i&&s.update_visual(n,{...i,state:t})}function p(){for(let e=0;e<3;e++)s.get_visual(`suggestion_${e}`)&&s.delete_visual(`suggestion_${e}`);s.get_visual("prefix")&&s.delete_visual("prefix"),s.get_visual("inputChar")&&s.delete_visual("inputChar")}function h(e,t){let n=o,i="";for(let t of e)n.children.has(t)||n.children.set(t,r()),function(e,t,n){if(l.has(e))return;let i=`trie_${e}`;l.set(e,i),s.add_new_visual(i,{type:"trieNode",char:t,isEndOfWord:!1,parent:l.get(n)||"trie_root",edgeLabel:t,state:"standard"})}(i+=t,t,i.slice(0,-1)),n=n.children.get(t);n.count+=t,n.sentence=e;let c=l.get(i);if(c){let e=s.get_visual(c);e&&s.update_visual(c,{...e,isEndOfWord:!0})}return i}l.set("","trie_root"),s.add_new_visual("trie_root",{type:"trieNode",char:"root",isEndOfWord:!1,state:"standard"}),s.update_variable("mode","dfs"),s.record("-","Initialize AutocompleteSystem with an empty trie.");for(let e=0;e<t.length;e++){let i=t[e],r=n[e];if("AutocompleteSystem"===i){let e=r[0],t=r[1];s.update_variable("operation","AutocompleteSystem"),s.update_variable("result",""),s.record("init_trie","Insert the starting sentences into the trie.");for(let n=0;n<e.length;n++){h(e[n],t[n]);let i="";for(let t of e[n])d(i+=t,"active");s.update_variable("result",`Inserted "${e[n]}" (count: ${t[n]})`),s.record("insert_sentence",`Insert "${e[n]}" and store count ${t[n]} on its last node.`),u()}c=o,a="";continue}if("input"!==i)continue;u(),p(),s.update_variable("operation",`input('${r}')`),s.update_variable("result",""),s.update_variable("collected",null),s.update_variable("dfsAt",null),s.add_new_visual("inputChar",{type:"metadata",value:r}),s.record("start_input",`Process input character '${r}'.`);let l="#"===r;if(s.add_conditional("is_hash",l),l){s.add_new_visual("prefix",{type:"metadata",value:a}),s.record("start_commit",`Commit the sentence "${a}".`),h(a,1);let e="";for(let t of a)d(e+=t,"active");s.record("reinsert_trie",`Insert "${a}" again with count 1, which bumps the count on its last node.`),a="",c=o,u(),p(),s.update_variable("result","[]"),s.record("commit_done","Clear the prefix, reset to the root, and return an empty list.");continue}a+=r,s.add_new_visual("prefix",{type:"metadata",value:a}),s.record("append_char",`Append '${r}' to the prefix, now "${a}".`);let f=null===c||!c.children.has(r);s.add_conditional("node_missing",f),d("","visited");let m="";for(let e of a.slice(0,-1))d(m+=e,"visited");if(s.record("traverse_trie",f?`There is no child '${r}' to follow, so the prefix has left the trie.`:`Follow the child '${r}' from the current node.`),f){c=null,d(a.slice(0,-1),"highlight"),s.record("node_not_found",`No node for '${r}'; nothing below can match.`),s.update_variable("result","[]"),s.record("show_empty","Return an empty list."),s.record("input_done",`Finished processing input '${r}'.`);continue}c=c.children.get(r),d(a,"highlight"),s.record("node_found",`Node found for '${r}'; this subtree holds every match.`);let g=[];s.update_variable("collected",[]),s.record("dfs_start",`Walk the whole subtree under "${a}" to collect every sentence below it.`),function e(t,n,i){let r=null!==t.sentence;for(let[o,c]of(d(n,"highlight"),s.update_variable("dfsAt",n),s.add_conditional("has_sentence",r),s.record("dfs_visit",r?`Node "${n}" ends the sentence "${t.sentence}" with count ${t.count}, so it joins the results.`:`Node "${n}" is not the end of a sentence, so nothing is collected here.`),r&&(i.push({sentence:t.sentence,count:t.count}),s.update_variable("collected",i.map(e=>`${e.sentence} (${e.count})`))),d(n,"visited"),t.children))e(c,n+o,i)}(c,a,g),u(),d(a,"highlight");let _=[...g].sort((e,t)=>t.count!==e.count?t.count-e.count:e.sentence.localeCompare(t.sentence));s.update_variable("collected",_.map(e=>`${e.sentence} (${e.count})`)),s.record("sort",0===g.length?"Nothing was collected, so there is nothing to sort.":`Sort the ${g.length} collected sentence${1===g.length?"":"s"} by count descending, then alphabetically.`);let x=_.slice(0,3);x.forEach((e,t)=>{s.add_new_visual(`suggestion_${t}`,{type:"metadata",value:`${t+1}. "${e.sentence}" (${e.count})`})});let v=x.length>0?`[${x.map(e=>`"${e.sentence}"`).join(", ")}]`:"[]";s.update_variable("result",v),s.record("take_top3",`Return the first ${x.length}: ${v}.`),s.update_variable("dfsAt",null),s.record("input_done",`Finished processing input '${r}'.`)}return u(),p(),s.update_variable("collected",null),s.update_variable("dfsAt",null),s.update_variable("operation","Done"),s.update_variable("result","All operations complete"),s.record("complete","All operations completed."),s.getSteps()
}

export function DesignSearchAutocompleteSystemProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignSearchAutocompleteSystemTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDesignSearchAutocompleteSystemSteps(e) as any[];
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
      title="Design Search Autocomplete System"
      slug="design-search-autocomplete-system"
      approaches={approaches}
      presets={DesignSearchAutocompleteSystemPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Implement Trie (implement-trie)
// ==========================================

const ImplementTrieTemplates = {
  "python": {
    "language": "python",
    "code": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end_of_word = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end_of_word = True\n\n    def search(self, word: str) -> bool:\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                return False\n            node = node.children[char]\n        return node.is_end_of_word\n\n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for char in prefix:\n            if char not in node.children:\n                return False\n            node = node.children[char]\n        return True",
    "lineMap": {
      "start": [
        7,
        8
      ],
      "at_root": [
        10,
        10
      ],
      "process_char": [
        11,
        11
      ],
      "traverse": [
        14,
        14
      ],
      "create_node": [
        12,
        14
      ],
      "mark_end": [
        15,
        15
      ],
      "start_insert": [
        10
      ],
      "start_search": [
        18,
        19
      ],
      "search_char": [
        19,
        19
      ],
      "found_char": [
        22,
        22
      ],
      "not_found": [
        20,
        21
      ],
      "word_found": [
        23,
        23
      ],
      "prefix_only": [
        23,
        23
      ],
      "start_prefix": [
        26,
        27
      ],
      "check_char": [
        27,
        27
      ],
      "found_prefix_char": [
        30,
        30
      ],
      "prefix_found": [
        30,
        30
      ],
      "prefix_not_found": [
        28,
        29
      ],
      "complete": [
        30,
        30
      ]
    },
    "conditionalMap": {
      "check_exists": [
        12
      ],
      "check_found": [
        20
      ],
      "check_prefix": [
        28
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class TrieNode {\n    Map<Character, TrieNode> children;\n    boolean isEndOfWord;\n\n    TrieNode() {\n        children = new HashMap<>();\n        isEndOfWord = false;\n    }\n}\n\nclass Trie {\n    private TrieNode root;\n\n    public Trie() {\n        root = new TrieNode();\n    }\n\n    public void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                node.children.put(c, new TrieNode());\n            }\n            node = node.children.get(c);\n        }\n        node.isEndOfWord = true;\n    }\n\n    public boolean search(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                return false;\n            }\n            node = node.children.get(c);\n        }\n        return node.isEndOfWord;\n    }\n\n    public boolean startsWith(String prefix) {\n        TrieNode node = root;\n        for (char c : prefix.toCharArray()) {\n            if (!node.children.containsKey(c)) {\n                return false;\n            }\n            node = node.children.get(c);\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "start": [
        14,
        15
      ],
      "at_root": [
        19,
        19
      ],
      "process_char": [
        20,
        20
      ],
      "traverse": [
        24,
        24
      ],
      "create_node": [
        21,
        24
      ],
      "mark_end": [
        26,
        26
      ],
      "start_insert": [
        18,
        18
      ],
      "start_search": [
        29,
        29
      ],
      "search_char": [
        31,
        31
      ],
      "found_char": [
        35,
        35
      ],
      "not_found": [
        32,
        33
      ],
      "word_found": [
        37,
        37
      ],
      "prefix_only": [
        37,
        37
      ],
      "start_prefix": [
        40,
        40
      ],
      "check_char": [
        42,
        42
      ],
      "found_prefix_char": [
        46,
        46
      ],
      "prefix_found": [
        48,
        48
      ],
      "prefix_not_found": [
        43,
        44
      ],
      "complete": [
        48,
        48
      ]
    },
    "conditionalMap": {
      "check_exists": [
        21
      ],
      "check_found": [
        32
      ],
      "check_prefix": [
        43
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class TrieNode {\npublic:\n    unordered_map<char, TrieNode*> children;\n    bool isEndOfWord;\n\n    TrieNode() : isEndOfWord(false) {}\n};\n\nclass Trie {\nprivate:\n    TrieNode* root;\n\npublic:\n    Trie() {\n        root = new TrieNode();\n    }\n\n    void insert(string word) {\n        TrieNode* node = root;\n        for (char c : word) {\n            if (node->children.find(c) == node->children.end()) {\n                node->children[c] = new TrieNode();\n            }\n            node = node->children[c];\n        }\n        node->isEndOfWord = true;\n    }\n\n    bool search(string word) {\n        TrieNode* node = root;\n        for (char c : word) {\n            if (node->children.find(c) == node->children.end()) {\n                return false;\n            }\n            node = node->children[c];\n        }\n        return node->isEndOfWord;\n    }\n\n    bool startsWith(string prefix) {\n        TrieNode* node = root;\n        for (char c : prefix) {\n            if (node->children.find(c) == node->children.end()) {\n                return false;\n            }\n            node = node->children[c];\n        }\n        return true;\n    }\n};",
    "lineMap": {
      "start": [
        14,
        15
      ],
      "at_root": [
        19,
        19
      ],
      "process_char": [
        20,
        20
      ],
      "traverse": [
        24,
        24
      ],
      "create_node": [
        21,
        24
      ],
      "mark_end": [
        26,
        26
      ],
      "start_insert": [
        18,
        18
      ],
      "start_search": [
        30,
        31
      ],
      "search_char": [
        31,
        31
      ],
      "found_char": [
        35,
        35
      ],
      "not_found": [
        32,
        33
      ],
      "word_found": [
        37,
        37
      ],
      "prefix_only": [
        37,
        37
      ],
      "start_prefix": [
        41,
        42
      ],
      "check_char": [
        42,
        42
      ],
      "found_prefix_char": [
        46,
        46
      ],
      "prefix_found": [
        48,
        48
      ],
      "prefix_not_found": [
        43,
        44
      ],
      "complete": [
        48,
        48
      ]
    },
    "conditionalMap": {
      "check_exists": [
        21
      ],
      "check_found": [
        32
      ],
      "check_prefix": [
        43
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class TrieNode {\n    public Dictionary<char, TrieNode> Children;\n    public bool IsEndOfWord;\n\n    public TrieNode() {\n        Children = new Dictionary<char, TrieNode>();\n        IsEndOfWord = false;\n    }\n}\n\npublic class Trie {\n    private TrieNode root;\n\n    public Trie() {\n        root = new TrieNode();\n    }\n\n    public void Insert(string word) {\n        TrieNode node = root;\n        foreach (char c in word) {\n            if (!node.Children.ContainsKey(c)) {\n                node.Children[c] = new TrieNode();\n            }\n            node = node.Children[c];\n        }\n        node.IsEndOfWord = true;\n    }\n\n    public bool Search(string word) {\n        TrieNode node = root;\n        foreach (char c in word) {\n            if (!node.Children.ContainsKey(c)) {\n                return false;\n            }\n            node = node.Children[c];\n        }\n        return node.IsEndOfWord;\n    }\n\n    public bool StartsWith(string prefix) {\n        TrieNode node = root;\n        foreach (char c in prefix) {\n            if (!node.Children.ContainsKey(c)) {\n                return false;\n            }\n            node = node.Children[c];\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "start": [
        14,
        15
      ],
      "at_root": [
        19,
        19
      ],
      "process_char": [
        20,
        20
      ],
      "traverse": [
        24,
        24
      ],
      "create_node": [
        21,
        24
      ],
      "mark_end": [
        26,
        26
      ],
      "start_insert": [
        18,
        18
      ],
      "start_search": [
        30,
        31
      ],
      "search_char": [
        31,
        31
      ],
      "found_char": [
        35,
        35
      ],
      "not_found": [
        32,
        33
      ],
      "word_found": [
        37,
        37
      ],
      "prefix_only": [
        37,
        37
      ],
      "start_prefix": [
        41,
        42
      ],
      "check_char": [
        42,
        42
      ],
      "found_prefix_char": [
        46,
        46
      ],
      "prefix_found": [
        48,
        48
      ],
      "prefix_not_found": [
        43,
        44
      ],
      "complete": [
        48,
        48
      ]
    },
    "conditionalMap": {
      "check_exists": [
        21
      ],
      "check_found": [
        32
      ],
      "check_prefix": [
        43
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type TrieNode struct {\n    children map[rune]*TrieNode\n    isEndOfWord bool\n}\n\nfunc NewTrieNode() *TrieNode {\n    return &TrieNode{\n        children: make(map[rune]*TrieNode),\n        isEndOfWord: false,\n    }\n}\n\ntype Trie struct {\n    root *TrieNode\n}\n\nfunc Constructor() Trie {\n    return Trie{\n        root: NewTrieNode(),\n    }\n}\n\nfunc (t *Trie) Insert(word string) {\n    node := t.root\n    for _, c := range word {\n        if _, exists := node.children[c]; !exists {\n            node.children[c] = NewTrieNode()\n        }\n        node = node.children[c]\n    }\n    node.isEndOfWord = true\n}\n\nfunc (t *Trie) Search(word string) bool {\n    node := t.root\n    for _, c := range word {\n        if _, exists := node.children[c]; !exists {\n            return false\n        }\n        node = node.children[c]\n    }\n    return node.isEndOfWord\n}\n\nfunc (t *Trie) StartsWith(prefix string) bool {\n    node := t.root\n    for _, c := range prefix {\n        if _, exists := node.children[c]; !exists {\n            return false\n        }\n        node = node.children[c]\n    }\n    return true\n}",
    "lineMap": {
      "start": [
        17,
        20
      ],
      "at_root": [
        24,
        24
      ],
      "process_char": [
        25,
        25
      ],
      "traverse": [
        29,
        29
      ],
      "create_node": [
        26,
        29
      ],
      "mark_end": [
        31,
        31
      ],
      "start_insert": [
        23,
        23
      ],
      "start_search": [
        35,
        36
      ],
      "search_char": [
        36,
        36
      ],
      "found_char": [
        40,
        40
      ],
      "not_found": [
        37,
        38
      ],
      "word_found": [
        42,
        42
      ],
      "prefix_only": [
        42,
        42
      ],
      "start_prefix": [
        46,
        47
      ],
      "check_char": [
        47,
        47
      ],
      "found_prefix_char": [
        51,
        51
      ],
      "prefix_found": [
        53,
        53
      ],
      "prefix_not_found": [
        48,
        49
      ],
      "complete": [
        53,
        53
      ]
    },
    "conditionalMap": {
      "check_exists": [
        26
      ],
      "check_found": [
        37
      ],
      "check_prefix": [
        48
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class TrieNode {\n    constructor() {\n        this.children = new Map();\n        this.isEndOfWord = false;\n    }\n}\n\nclass Trie {\n    constructor() {\n        this.root = new TrieNode();\n    }\n\n    insert(word) {\n        let node = this.root;\n        for (const char of word) {\n            if (!node.children.has(char)) {\n                node.children.set(char, new TrieNode());\n            }\n            node = node.children.get(char);\n        }\n        node.isEndOfWord = true;\n    }\n\n    search(word) {\n        let node = this.root;\n        for (const char of word) {\n            if (!node.children.has(char)) {\n                return false;\n            }\n            node = node.children.get(char);\n        }\n        return node.isEndOfWord;\n    }\n\n    startsWith(prefix) {\n        let node = this.root;\n        for (const char of prefix) {\n            if (!node.children.has(char)) {\n                return false;\n            }\n            node = node.children.get(char);\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "start": [
        9,
        10
      ],
      "at_root": [
        14,
        14
      ],
      "process_char": [
        15,
        15
      ],
      "traverse": [
        19,
        19
      ],
      "create_node": [
        16,
        19
      ],
      "mark_end": [
        21,
        21
      ],
      "start_insert": [
        13,
        13
      ],
      "start_search": [
        25,
        26
      ],
      "search_char": [
        26,
        26
      ],
      "found_char": [
        30,
        30
      ],
      "not_found": [
        27,
        28
      ],
      "word_found": [
        32,
        32
      ],
      "prefix_only": [
        32,
        32
      ],
      "start_prefix": [
        36,
        37
      ],
      "check_char": [
        37,
        37
      ],
      "found_prefix_char": [
        41,
        41
      ],
      "prefix_found": [
        43,
        43
      ],
      "prefix_not_found": [
        38,
        39
      ],
      "complete": [
        43,
        43
      ]
    },
    "conditionalMap": {
      "check_exists": [
        16
      ],
      "check_found": [
        27
      ],
      "check_prefix": [
        38
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class TrieNode {\n    children: Map<string, TrieNode>;\n    isEndOfWord: boolean;\n\n    constructor() {\n        this.children = new Map();\n        this.isEndOfWord = false;\n    }\n}\n\nclass Trie {\n    private root: TrieNode;\n\n    constructor() {\n        this.root = new TrieNode();\n    }\n\n    insert(word: string): void {\n        let node = this.root;\n        for (const char of word) {\n            if (!node.children.has(char)) {\n                node.children.set(char, new TrieNode());\n            }\n            node = node.children.get(char)!;\n        }\n        node.isEndOfWord = true;\n    }\n\n    search(word: string): boolean {\n        let node = this.root;\n        for (const char of word) {\n            if (!node.children.has(char)) {\n                return false;\n            }\n            node = node.children.get(char)!;\n        }\n        return node.isEndOfWord;\n    }\n\n    startsWith(prefix: string): boolean {\n        let node = this.root;\n        for (const char of prefix) {\n            if (!node.children.has(char)) {\n                return false;\n            }\n            node = node.children.get(char)!;\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "start": [
        14,
        15
      ],
      "at_root": [
        19,
        19
      ],
      "process_char": [
        20,
        20
      ],
      "traverse": [
        24,
        24
      ],
      "create_node": [
        21,
        24
      ],
      "mark_end": [
        26,
        26
      ],
      "start_insert": [
        18,
        18
      ],
      "start_search": [
        30,
        31
      ],
      "search_char": [
        31,
        31
      ],
      "found_char": [
        35,
        35
      ],
      "not_found": [
        32,
        33
      ],
      "word_found": [
        37,
        37
      ],
      "prefix_only": [
        37,
        37
      ],
      "start_prefix": [
        41,
        42
      ],
      "check_char": [
        42,
        42
      ],
      "found_prefix_char": [
        46,
        46
      ],
      "prefix_found": [
        48,
        48
      ],
      "prefix_not_found": [
        43,
        44
      ],
      "complete": [
        48,
        48
      ]
    },
    "conditionalMap": {
      "check_exists": [
        21
      ],
      "check_found": [
        32
      ],
      "check_prefix": [
        43
      ]
    }
  }
};

const ImplementTriePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "operations": [
        "Trie",
        "insert",
        "search",
        "search",
        "startsWith",
        "insert",
        "search"
      ],
      "values": [
        null,
        "apple",
        "apple",
        "app",
        "app",
        "app",
        "app"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "operations": [
        "Trie",
        "insert",
        "insert",
        "search",
        "search",
        "startsWith",
        "startsWith"
      ],
      "values": [
        null,
        "apple",
        "app",
        "apple",
        "app",
        "app",
        "appl"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "operations": [
        "Trie",
        "insert",
        "insert",
        "insert",
        "search",
        "insert"
      ],
      "values": [
        null,
        "cat",
        "car",
        "card",
        "cat",
        "can"
      ]
    }
  }
];

function generateImplementTrieSteps(e: any): any[] {
  
let r=e.operations||[],t=e.values||[],n=new RecursiveStepRecorder({},{});n.add_new_visual("node_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"}),n.update_global_variable("operation",""),n.update_global_variable("word",""),n.update_global_variable("result",""),n.record("start","Initialize Trie with root node");let o=0,i=new Map;i.set("","node_root");for(let e=0;e<r.length;e++){let a=r[e],s=t[e];if("Trie"!==a){if(i.forEach(e=>{let r=n.get_visual(e);r&&"trieNode"===r.type&&n.update_visual(e,{...r,state:"standard"})}),n.update_global_variable("operation",a),n.update_global_variable("word",s||""),n.update_global_variable("result",""),"insert"===a&&s){n.record("start_insert",`Start: Insert word "${s}"`);let e="",r="node_root";n.update_visual(r,{type:"trieNode",char:"*",isEndOfWord:!1,state:"active"}),n.record("at_root","Start at root node");for(let t=0;t<s.length;t++){let a=s[t],l=e+a,d=i.has(l);if(n.add_conditional("check_exists",d),n.record("process_char",`Process character '${a}' (${t+1}/${s.length})`),d){let e=i.get(l),t=n.get_visual(r);n.update_visual(r,{...t,state:"visited"}),n.update_visual(e,{type:"trieNode",char:a,isEndOfWord:n.get_visual(e).isEndOfWord,parent:r,edgeLabel:a,state:"active"}),n.record("traverse",`Character '${a}' exists, traverse to child`),r=e}else{let t=function(e,r,t){let a=e+r;if(i.has(a))return i.get(a);if(t){o++;let t=`node_${o}`,s=i.get(e);return n.add_new_visual(t,{type:"trieNode",char:r,isEndOfWord:!1,parent:s,edgeLabel:r,state:"highlight"}),i.set(a,t),t}return""}(e,a,!0),s=n.get_visual(r);n.update_visual(r,{...s,state:"visited"}),n.record("create_node",`Create new node for '${a}'`),n.update_visual(t,{type:"trieNode",char:a,isEndOfWord:!1,parent:r,edgeLabel:a,state:"active"}),r=t}e=l}let t=n.get_visual(r);n.update_visual(r,{...t,type:"trieNode",isEndOfWord:!0,state:"result"}),n.update_global_variable("result","inserted"),n.record("mark_end",`Mark node as end of word "${s}"`)}else if("search"===a&&s){n.record("start_search",`Start: Search for word "${s}"`);let e="",r="node_root",t=!0;n.update_visual(r,{type:"trieNode",char:"*",isEndOfWord:!1,state:"active"});for(let a=0;a<s.length;a++){let o=s[a],l=e+o,d=i.has(l);if(n.add_conditional("check_found",d),n.record("search_char",`Search for character '${o}' (${a+1}/${s.length})`),d){let t=i.get(l),a=n.get_visual(r);n.update_visual(r,{...a,state:"visited"});let s=n.get_visual(t);n.update_visual(t,{...s,state:"active"}),n.record("found_char",`Found character '${o}'`),r=t,e=l}else{n.update_visual(r,{type:"trieNode",char:n.get_visual(r).char,isEndOfWord:n.get_visual(r).isEndOfWord,parent:n.get_visual(r).parent,edgeLabel:n.get_visual(r).edgeLabel,state:"error"}),n.update_global_variable("result","false"),n.record("not_found",`Character '${o}' not found - word does not exist`),t=!1;break}}if(t){let e=n.get_visual(r);e.isEndOfWord?(n.update_visual(r,{...e,state:"result"}),n.update_global_variable("result","true"),n.record("word_found",`Word "${s}" found (marked as end of word)`)):(n.update_visual(r,{...e,state:"error"}),n.update_global_variable("result","false"),n.record("prefix_only",`Prefix "${s}" exists but not marked as complete word`))}}else if("startsWith"===a&&s){n.record("start_prefix",`Start: Check if prefix "${s}" exists`);let e="",r="node_root",t=!0;n.update_visual(r,{type:"trieNode",char:"*",isEndOfWord:!1,state:"active"});for(let a=0;a<s.length;a++){let o=s[a],l=e+o,d=i.has(l);if(n.add_conditional("check_prefix",d),n.record("check_char",`Check for character '${o}' (${a+1}/${s.length})`),d){let t=i.get(l),a=n.get_visual(r);n.update_visual(r,{...a,state:"visited"});let s=n.get_visual(t);n.update_visual(t,{...s,state:"active"}),n.record("found_prefix_char",`Found character '${o}'`),r=t,e=l}else{n.update_visual(r,{type:"trieNode",char:n.get_visual(r).char,isEndOfWord:n.get_visual(r).isEndOfWord,parent:n.get_visual(r).parent,edgeLabel:n.get_visual(r).edgeLabel,state:"error"}),n.update_global_variable("result","false"),n.record("prefix_not_found",`Character '${o}' not found - prefix does not exist`),t=!1;break}}t&&(n.update_visual(r,{type:"trieNode",char:n.get_visual(r).char,isEndOfWord:n.get_visual(r).isEndOfWord,parent:n.get_visual(r).parent,edgeLabel:n.get_visual(r).edgeLabel,state:"result"}),n.update_global_variable("result","true"),n.record("prefix_found",`Prefix "${s}" exists in Trie`))}}}return n.record("complete","All operations completed"),n.getSteps()
}

export function ImplementTrieProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ImplementTrieTemplates,
      generateSteps: (e: any) => {
        const recorded = generateImplementTrieSteps(e) as any[];
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
      title="Implement Trie"
      slug="implement-trie"
      approaches={approaches}
      presets={ImplementTriePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Implement Trie (Prefix Tree) (implement-trie-prefix-tree)
// ==========================================

const ImplementTriePrefixTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class Trie:\n    def __init__(self):\n        self.children = [None] * 26\n        self.is_end = False\n\n    def insert(self, word: str) -> None:\n        node = self\n        for c in word:\n            index = ord(c) - ord('a')\n            # Create child node if it doesn't exist\n            if node.children[index] is None:\n                node.children[index] = Trie()\n            node = node.children[index]\n        # Mark the last node as end of a complete word\n        node.is_end = True\n\n    def search(self, word: str) -> bool:\n        node = self._traverse(word)\n        # Word exists only if we reached a valid node AND it is an end-of-word\n        return node is not None and node.is_end\n\n    def startsWith(self, prefix: str) -> bool:\n        # Prefix exists if we can traverse the entire prefix path\n        return self._traverse(prefix) is not None\n\n    def _traverse(self, s: str):\n        # Helper: traverse the trie along the given string\n        node = self\n        for c in s:\n            index = ord(c) - ord('a')\n            if node.children[index] is None:\n                return None\n            node = node.children[index]\n        return node",
    "lineMap": {
      "start": [
        2,
        3
      ],
      "start_insert": [
        6
      ],
      "at_root": [
        7
      ],
      "process_char": [
        8,
        9
      ],
      "create_node": [
        11,
        12
      ],
      "traverse": [
        13
      ],
      "mark_end": [
        15
      ],
      "start_search": [
        17,
        18
      ],
      "search_char": [
        29,
        30
      ],
      "found_char": [
        33
      ],
      "not_found": [
        31,
        32
      ],
      "word_found": [
        20
      ],
      "prefix_only": [
        20
      ],
      "start_prefix": [
        22,
        24
      ],
      "check_char": [
        29,
        30
      ],
      "found_prefix_char": [
        33
      ],
      "prefix_not_found": [
        31,
        32
      ],
      "prefix_found": [
        24
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "check_exists": [
        11
      ],
      "check_found": [
        31
      ],
      "check_prefix": [
        31
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Trie {\n    // Each node holds 26 possible children and an end-of-word marker\n    private Trie[] children;\n    private boolean isEnd;\n\n    public Trie() {\n        children = new Trie[26];\n        isEnd = false;\n    }\n\n    public void insert(String word) {\n        Trie node = this;\n        for (char c : word.toCharArray()) {\n            int index = c - 'a';\n            // Create child node if it doesn't exist\n            if (node.children[index] == null) {\n                node.children[index] = new Trie();\n            }\n            node = node.children[index];\n        }\n        // Mark the last node as end of a complete word\n        node.isEnd = true;\n    }\n\n    public boolean search(String word) {\n        Trie node = traverse(word);\n        // Word exists only if we reached a valid node AND it is an end-of-word\n        return node != null && node.isEnd;\n    }\n\n    public boolean startsWith(String prefix) {\n        // Prefix exists if we can traverse the entire prefix path\n        return traverse(prefix) != null;\n    }\n\n    // Helper: traverse the trie along the given string, return final node or null\n    private Trie traverse(String s) {\n        Trie node = this;\n        for (char c : s.toCharArray()) {\n            int index = c - 'a';\n            if (node.children[index] == null) {\n                return null;\n            }\n            node = node.children[index];\n        }\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        6,
        7,
        8
      ],
      "start_insert": [
        11
      ],
      "at_root": [
        12
      ],
      "process_char": [
        13,
        14
      ],
      "create_node": [
        16,
        17
      ],
      "traverse": [
        19
      ],
      "mark_end": [
        22
      ],
      "start_search": [
        25,
        26
      ],
      "search_char": [
        39,
        40
      ],
      "found_char": [
        44
      ],
      "not_found": [
        41,
        42
      ],
      "word_found": [
        28
      ],
      "prefix_only": [
        28
      ],
      "start_prefix": [
        31,
        33
      ],
      "check_char": [
        39,
        40
      ],
      "found_prefix_char": [
        44
      ],
      "prefix_not_found": [
        41,
        42
      ],
      "prefix_found": [
        33
      ],
      "complete": [
        46
      ]
    },
    "conditionalMap": {
      "check_exists": [
        16
      ],
      "check_found": [
        41
      ],
      "check_prefix": [
        41
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Trie {\n    // Each node holds 26 possible children and an end-of-word marker\n    Trie* children[26];\n    bool isEnd;\n\npublic:\n    Trie() {\n        for (int i = 0; i < 26; i++) children[i] = nullptr;\n        isEnd = false;\n    }\n\n    void insert(string word) {\n        Trie* node = this;\n        for (char c : word) {\n            int index = c - 'a';\n            // Create child node if it doesn't exist\n            if (node->children[index] == nullptr) {\n                node->children[index] = new Trie();\n            }\n            node = node->children[index];\n        }\n        // Mark the last node as end of a complete word\n        node->isEnd = true;\n    }\n\n    bool search(string word) {\n        Trie* node = traverse(word);\n        // Word exists only if we reached a valid node AND it is an end-of-word\n        return node != nullptr && node->isEnd;\n    }\n\n    bool startsWith(string prefix) {\n        // Prefix exists if we can traverse the entire prefix path\n        return traverse(prefix) != nullptr;\n    }\n\nprivate:\n    // Helper: traverse the trie along the given string, return final node or null\n    Trie* traverse(string s) {\n        Trie* node = this;\n        for (char c : s) {\n            int index = c - 'a';\n            if (node->children[index] == nullptr) {\n                return nullptr;\n            }\n            node = node->children[index];\n        }\n        return node;\n    }\n};",
    "lineMap": {
      "start": [
        7,
        8,
        9
      ],
      "start_insert": [
        12
      ],
      "at_root": [
        13
      ],
      "process_char": [
        14,
        15
      ],
      "create_node": [
        17,
        18
      ],
      "traverse": [
        20
      ],
      "mark_end": [
        23
      ],
      "start_search": [
        26,
        27
      ],
      "search_char": [
        41,
        42
      ],
      "found_char": [
        46
      ],
      "not_found": [
        43,
        44
      ],
      "word_found": [
        29
      ],
      "prefix_only": [
        29
      ],
      "start_prefix": [
        32,
        34
      ],
      "check_char": [
        41,
        42
      ],
      "found_prefix_char": [
        46
      ],
      "prefix_not_found": [
        43,
        44
      ],
      "prefix_found": [
        34
      ],
      "complete": [
        48
      ]
    },
    "conditionalMap": {
      "check_exists": [
        17
      ],
      "check_found": [
        43
      ],
      "check_prefix": [
        43
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Trie {\n    // Each node holds 26 possible children and an end-of-word marker\n    private Trie[] children;\n    private bool isEnd;\n\n    public Trie() {\n        children = new Trie[26];\n        isEnd = false;\n    }\n\n    public void Insert(string word) {\n        Trie node = this;\n        foreach (char c in word) {\n            int index = c - 'a';\n            // Create child node if it doesn't exist\n            if (node.children[index] == null) {\n                node.children[index] = new Trie();\n            }\n            node = node.children[index];\n        }\n        // Mark the last node as end of a complete word\n        node.isEnd = true;\n    }\n\n    public bool Search(string word) {\n        Trie node = Traverse(word);\n        // Word exists only if we reached a valid node AND it is an end-of-word\n        return node != null && node.isEnd;\n    }\n\n    public bool StartsWith(string prefix) {\n        // Prefix exists if we can traverse the entire prefix path\n        return Traverse(prefix) != null;\n    }\n\n    // Helper: traverse the trie along the given string, return final node or null\n    private Trie Traverse(string s) {\n        Trie node = this;\n        foreach (char c in s) {\n            int index = c - 'a';\n            if (node.children[index] == null) {\n                return null;\n            }\n            node = node.children[index];\n        }\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        6,
        7,
        8
      ],
      "start_insert": [
        11
      ],
      "at_root": [
        12
      ],
      "process_char": [
        13,
        14
      ],
      "create_node": [
        16,
        17
      ],
      "traverse": [
        19
      ],
      "mark_end": [
        22
      ],
      "start_search": [
        25,
        26
      ],
      "search_char": [
        39,
        40
      ],
      "found_char": [
        44
      ],
      "not_found": [
        41,
        42
      ],
      "word_found": [
        28
      ],
      "prefix_only": [
        28
      ],
      "start_prefix": [
        31,
        33
      ],
      "check_char": [
        39,
        40
      ],
      "found_prefix_char": [
        44
      ],
      "prefix_not_found": [
        41,
        42
      ],
      "prefix_found": [
        33
      ],
      "complete": [
        46
      ]
    },
    "conditionalMap": {
      "check_exists": [
        16
      ],
      "check_found": [
        41
      ],
      "check_prefix": [
        41
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Trie struct {\n    // Each node holds 26 possible children and an end-of-word marker\n    children [26]*Trie\n    isEnd    bool\n}\n\nfunc Constructor() Trie {\n    return Trie{}\n}\n\nfunc (t *Trie) Insert(word string) {\n    node := t\n    for _, c := range word {\n        index := c - 'a'\n        // Create child node if it doesn't exist\n        if node.children[index] == nil {\n            node.children[index] = &Trie{}\n        }\n        node = node.children[index]\n    }\n    // Mark the last node as end of a complete word\n    node.isEnd = true\n}\n\nfunc (t *Trie) Search(word string) bool {\n    node := t.traverse(word)\n    // Word exists only if we reached a valid node AND it is an end-of-word\n    return node != nil && node.isEnd\n}\n\nfunc (t *Trie) StartsWith(prefix string) bool {\n    // Prefix exists if we can traverse the entire prefix path\n    return t.traverse(prefix) != nil\n}\n\n// Helper: traverse the trie along the given string, return final node or nil\nfunc (t *Trie) traverse(s string) *Trie {\n    node := t\n    for _, c := range s {\n        index := c - 'a'\n        if node.children[index] == nil {\n            return nil\n        }\n        node = node.children[index]\n    }\n    return node\n}",
    "lineMap": {
      "start": [
        7,
        8
      ],
      "start_insert": [
        11
      ],
      "at_root": [
        12
      ],
      "process_char": [
        13,
        14
      ],
      "create_node": [
        16,
        17
      ],
      "traverse": [
        19
      ],
      "mark_end": [
        22
      ],
      "start_search": [
        25,
        26
      ],
      "search_char": [
        39,
        40
      ],
      "found_char": [
        44
      ],
      "not_found": [
        41,
        42
      ],
      "word_found": [
        28
      ],
      "prefix_only": [
        28
      ],
      "start_prefix": [
        31,
        33
      ],
      "check_char": [
        39,
        40
      ],
      "found_prefix_char": [
        44
      ],
      "prefix_not_found": [
        41,
        42
      ],
      "prefix_found": [
        33
      ],
      "complete": [
        46
      ]
    },
    "conditionalMap": {
      "check_exists": [
        16
      ],
      "check_found": [
        41
      ],
      "check_prefix": [
        41
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var Trie = function () {\n  // Each node holds 26 possible children and an end-of-word marker\n  this.children = new Array(26).fill(null);\n  this.isEnd = false;\n};\n\nTrie.prototype.insert = function (word) {\n  let node = this;\n  for (const c of word) {\n    const index = c.charCodeAt(0) - 97; // 'a' is 97\n    // Create child node if it doesn't exist\n    if (node.children[index] === null) {\n      node.children[index] = new Trie();\n    }\n    node = node.children[index];\n  }\n  // Mark the last node as end of a complete word\n  node.isEnd = true;\n};\n\nTrie.prototype.search = function (word) {\n  const node = this._traverse(word);\n  // Word exists only if we reached a valid node AND it is an end-of-word\n  return node !== null && node.isEnd;\n};\n\nTrie.prototype.startsWith = function (prefix) {\n  // Prefix exists if we can traverse the entire prefix path\n  return this._traverse(prefix) !== null;\n};\n\n// Helper: traverse the trie along the given string\nTrie.prototype._traverse = function (s) {\n  let node = this;\n  for (const c of s) {\n    const index = c.charCodeAt(0) - 97;\n    if (node.children[index] === null) {\n      return null;\n    }\n    node = node.children[index];\n  }\n  return node;\n};",
    "lineMap": {
      "start": [
        3,
        4
      ],
      "start_insert": [
        7
      ],
      "at_root": [
        8
      ],
      "process_char": [
        9,
        10
      ],
      "create_node": [
        12,
        13
      ],
      "traverse": [
        15
      ],
      "mark_end": [
        18
      ],
      "start_search": [
        21,
        22
      ],
      "search_char": [
        35,
        36
      ],
      "found_char": [
        40
      ],
      "not_found": [
        37,
        38
      ],
      "word_found": [
        24
      ],
      "prefix_only": [
        24
      ],
      "start_prefix": [
        27,
        29
      ],
      "check_char": [
        35,
        36
      ],
      "found_prefix_char": [
        40
      ],
      "prefix_not_found": [
        37,
        38
      ],
      "prefix_found": [
        29
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "check_exists": [
        12
      ],
      "check_found": [
        37
      ],
      "check_prefix": [
        37
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class Trie {\n    // Each node holds 26 possible children and an end-of-word marker\n    children: (Trie | null)[];\n    isEnd: boolean;\n\n    constructor() {\n        this.children = new Array(26).fill(null);\n        this.isEnd = false;\n    }\n\n    insert(word: string): void {\n        let node: Trie = this;\n        for (const c of word) {\n            const index = c.charCodeAt(0) - 97; // 'a' is 97\n            // Create child node if it doesn't exist\n            if (node.children[index] === null) {\n                node.children[index] = new Trie();\n            }\n            node = node.children[index]!;\n        }\n        // Mark the last node as end of a complete word\n        node.isEnd = true;\n    }\n\n    search(word: string): boolean {\n        const node = this.traverse(word);\n        // Word exists only if we reached a valid node AND it is an end-of-word\n        return node !== null && node.isEnd;\n    }\n\n    startsWith(prefix: string): boolean {\n        // Prefix exists if we can traverse the entire prefix path\n        return this.traverse(prefix) !== null;\n    }\n\n    // Helper: traverse the trie along the given string\n    private traverse(s: string): Trie | null {\n        let node: Trie = this;\n        for (const c of s) {\n            const index = c.charCodeAt(0) - 97;\n            if (node.children[index] === null) {\n                return null;\n            }\n            node = node.children[index]!;\n        }\n        return node;\n    }\n}",
    "lineMap": {
      "start": [
        6,
        7,
        8
      ],
      "start_insert": [
        11
      ],
      "at_root": [
        12
      ],
      "process_char": [
        13,
        14
      ],
      "create_node": [
        16,
        17
      ],
      "traverse": [
        19
      ],
      "mark_end": [
        22
      ],
      "start_search": [
        25,
        26
      ],
      "search_char": [
        39,
        40
      ],
      "found_char": [
        44
      ],
      "not_found": [
        41,
        42
      ],
      "word_found": [
        28
      ],
      "prefix_only": [
        28
      ],
      "start_prefix": [
        31,
        33
      ],
      "check_char": [
        39,
        40
      ],
      "found_prefix_char": [
        44
      ],
      "prefix_not_found": [
        41,
        42
      ],
      "prefix_found": [
        33
      ],
      "complete": [
        46
      ]
    },
    "conditionalMap": {
      "check_exists": [
        16
      ],
      "check_found": [
        41
      ],
      "check_prefix": [
        41
      ]
    }
  }
};

const ImplementTriePrefixTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "operations": [
        "Trie",
        "insert",
        "insert",
        "search",
        "search",
        "startsWith",
        "startsWith"
      ],
      "values": [
        null,
        "apple",
        "app",
        "apple",
        "app",
        "app",
        "ap"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Multiple Words",
    "value": {
      "operations": [
        "Trie",
        "insert",
        "insert",
        "insert",
        "insert",
        "search",
        "search",
        "startsWith"
      ],
      "values": [
        null,
        "car",
        "card",
        "care",
        "careful",
        "car",
        "care",
        "car"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Not Found",
    "value": {
      "operations": [
        "Trie",
        "insert",
        "insert",
        "search",
        "search",
        "startsWith",
        "startsWith"
      ],
      "values": [
        null,
        "hello",
        "help",
        "hell",
        "world",
        "hel",
        "wor"
      ]
    }
  }
];

function generateImplementTriePrefixTreeSteps(e: any): any[] {
  
let r=e.operations||[],t=e.values||[],a=new StepRecorder({},{}),s=[],n=[],o=new Map,d=new Map;function l(){a.update_variable("cursor",-1),a.update_variable("cursorStrip",""),a.update_variable("cursorState","active"),a.update_variable("probe",""),a.update_variable("probeState","")}a.update_variable("operation","Trie"),a.update_variable("word",""),a.update_variable("result",""),a.update_variable("words",s),a.update_variable("prefixes",n),l(),a.record("start","Initialize an empty word set and prefix set");for(let e=0;e<r.length;e++){let i=r[e],c=t[e];if("Trie"!==i){if(l(),a.update_variable("operation",i),a.update_variable("word",c||""),a.update_variable("result",""),"insert"===i&&c){a.record("start_insert",`Start: Insert word "${c}"`),o.has(c)||(o.set(c,s.length),s.push(c),a.update_variable("words",s)),a.update_variable("cursorStrip","words"),a.update_variable("cursor",o.get(c)),a.update_variable("cursorState","match"),a.record("add_word",`Add "${c}" to the word set`);for(let e=1;e<=c.length;e++){let r=c.slice(0,e);a.add_conditional("prefix_loop",!0),d.has(r)||(d.set(r,n.length),n.push(r),a.update_variable("prefixes",n)),a.update_variable("cursorStrip","prefixes"),a.update_variable("cursor",d.get(r)),a.update_variable("cursorState","match"),a.record("add_prefix",`Add prefix "${r}" (${e}/${c.length})`)}a.update_variable("result","inserted")}else if("search"===i&&c){a.update_variable("probe",c),a.record("start_search",`Start: Search for word "${c}"`);let e=o.has(c);a.add_conditional("in_words",e),a.update_variable("cursorStrip","words"),a.update_variable("cursor",e?o.get(c):-1),a.update_variable("cursorState","match"),a.update_variable("probeState",e?"hit":"miss"),a.update_variable("result",e?"true":"false"),e?a.record("word_found",`"${c}" is in the word set, return true`):a.record("word_not_found",`"${c}" is not in the word set, return false`)}else if("startsWith"===i&&c){a.update_variable("probe",c),a.record("start_prefix",`Start: Check if prefix "${c}" exists`);let e=d.has(c);a.add_conditional("in_prefixes",e),a.update_variable("cursorStrip","prefixes"),a.update_variable("cursor",e?d.get(c):-1),a.update_variable("cursorState","match"),a.update_variable("probeState",e?"hit":"miss"),a.update_variable("result",e?"true":"false"),e?a.record("prefix_found",`"${c}" is in the prefix set, return true`):a.record("prefix_not_found",`"${c}" is not in the prefix set, return false`)}}}return l(),a.record("complete","All operations completed"),a.getSteps()
}

export function ImplementTriePrefixTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ImplementTriePrefixTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateImplementTriePrefixTreeSteps(e) as any[];
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
      title="Implement Trie (Prefix Tree)"
      slug="implement-trie-prefix-tree"
      approaches={approaches}
      presets={ImplementTriePrefixTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Word in Dictionary (longest-word-in-dictionary)
// ==========================================

const LongestWordInDictionaryTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def longestWord(self, words: List[str]) -> str:\n        # Build Trie using nested dictionaries\n        trie = {}\n\n        for word in words:\n            node = trie\n            for char in word:\n                if char not in node:\n                    node[char] = {}\n                node = node[char]\n            node['#'] = True  # mark end of word\n\n        # DFS to find the longest word where every prefix is a word\n        result = \"\"\n\n        def dfs(node, path):\n            nonlocal result\n            # Update result if current path is better\n            if len(path) > len(result) or (len(path) == len(result) and path < result):\n                result = path\n\n            # Explore children in alphabetical order\n            for c in sorted(node.keys()):\n                if c == '#':\n                    continue\n                # Only follow this child if it represents a complete word\n                if '#' in node[c]:\n                    dfs(node[c], path + c)\n\n        dfs(trie, \"\")\n        return result",
    "lineMap": {
      "-": [
        4
      ],
      "insert_word": [
        6,
        7
      ],
      "insert_char": [
        8
      ],
      "traverse_char": [
        11
      ],
      "create_node": [
        9,
        10
      ],
      "mark_end": [
        12
      ],
      "start_dfs": [
        31
      ],
      "visit_node": [
        17,
        18
      ],
      "update_result": [
        20,
        21
      ],
      "explore_child": [
        28,
        29
      ],
      "backtrack": [
        29
      ],
      "skip_child": [
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "is_longer": [
        20
      ],
      "is_end_of_word": [
        28
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    // Trie node with 26 children for lowercase letters\n    private int[][] children;\n    private boolean[] isEnd;\n    private int nodeCount;\n\n    public String longestWord(String[] words) {\n        // Initialize Trie with enough space for all characters\n        int maxNodes = 30001; // at most 1000 words * 30 chars\n        children = new int[maxNodes][26];\n        isEnd = new boolean[maxNodes];\n        nodeCount = 1; // root is node 0\n\n        // Insert all words into the Trie\n        for (String word : words) {\n            insert(word);\n        }\n\n        // DFS to find the longest word where every prefix is a word\n        String[] result = {\"\"};\n        dfs(0, new StringBuilder(), result);\n        return result[0];\n    }\n\n    private void insert(String word) {\n        int node = 0;\n        for (int i = 0; i < word.length(); i++) {\n            int c = word.charAt(i) - 'a';\n            if (children[node][c] == 0) {\n                children[node][c] = nodeCount++;\n            }\n            node = children[node][c];\n        }\n        isEnd[node] = true;\n    }\n\n    private void dfs(int node, StringBuilder path, String[] result) {\n        // Update result if current path is longer, or same length but lexicographically smaller\n        if (path.length() > result[0].length() ||\n            (path.length() == result[0].length() && path.toString().compareTo(result[0]) < 0)) {\n            result[0] = path.toString();\n        }\n\n        // Explore children in alphabetical order (a-z)\n        for (int c = 0; c < 26; c++) {\n            int child = children[node][c];\n            if (child != 0 && isEnd[child]) {\n                path.append((char) ('a' + c));\n                dfs(child, path, result);\n                path.deleteCharAt(path.length() - 1);\n            }\n        }\n    }\n}",
    "lineMap": {
      "-": [
        10,
        11,
        12
      ],
      "insert_word": [
        15,
        16
      ],
      "insert_char": [
        27,
        28
      ],
      "traverse_char": [
        32
      ],
      "create_node": [
        29,
        30
      ],
      "mark_end": [
        34
      ],
      "start_dfs": [
        21
      ],
      "visit_node": [
        37
      ],
      "update_result": [
        39,
        40,
        41
      ],
      "explore_child": [
        47,
        48,
        49
      ],
      "backtrack": [
        50
      ],
      "skip_child": [
        47
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_longer": [
        39
      ],
      "is_end_of_word": [
        47
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    // Trie node structure\n    struct TrieNode {\n        int children[26] = {};\n        bool isEnd = false;\n    };\n\n    vector<TrieNode> nodes;\n    string result;\n\n    string longestWord(vector<string>& words) {\n        // Initialize Trie\n        nodes.push_back(TrieNode()); // root node\n\n        // Insert all words into the Trie\n        for (const string& word : words) {\n            int node = 0;\n            for (char c : word) {\n                int idx = c - 'a';\n                if (nodes[node].children[idx] == 0) {\n                    nodes[node].children[idx] = nodes.size();\n                    nodes.push_back(TrieNode());\n                }\n                node = nodes[node].children[idx];\n            }\n            nodes[node].isEnd = true;\n        }\n\n        // DFS to find the longest word where every prefix is a word\n        result = \"\";\n        string path;\n        dfs(0, path);\n        return result;\n    }\n\n    void dfs(int node, string& path) {\n        // Update result if current path is better\n        if (path.size() > result.size() ||\n            (path.size() == result.size() && path < result)) {\n            result = path;\n        }\n\n        // Explore children in alphabetical order\n        for (int c = 0; c < 26; c++) {\n            int child = nodes[node].children[c];\n            if (child != 0 && nodes[child].isEnd) {\n                path.push_back('a' + c);\n                dfs(child, path);\n                path.pop_back();\n            }\n        }\n    }\n};",
    "lineMap": {
      "-": [
        14
      ],
      "insert_word": [
        17,
        18
      ],
      "insert_char": [
        19,
        20
      ],
      "traverse_char": [
        25
      ],
      "create_node": [
        21,
        22,
        23
      ],
      "mark_end": [
        27
      ],
      "start_dfs": [
        33
      ],
      "visit_node": [
        37
      ],
      "update_result": [
        39,
        40,
        41
      ],
      "explore_child": [
        47,
        48,
        49
      ],
      "backtrack": [
        50
      ],
      "skip_child": [
        47
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "is_longer": [
        39
      ],
      "is_end_of_word": [
        47
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    // Trie represented with arrays\n    private int[][] children;\n    private bool[] isEnd;\n    private int nodeCount;\n\n    public string LongestWord(string[] words) {\n        // Initialize Trie\n        int maxNodes = 30001;\n        children = new int[maxNodes][];\n        isEnd = new bool[maxNodes];\n        for (int i = 0; i < maxNodes; i++) {\n            children[i] = new int[26];\n        }\n        nodeCount = 1; // root is node 0\n\n        // Insert all words\n        foreach (string word in words) {\n            int node = 0;\n            foreach (char c in word) {\n                int idx = c - 'a';\n                if (children[node][idx] == 0) {\n                    children[node][idx] = nodeCount++;\n                }\n                node = children[node][idx];\n            }\n            isEnd[node] = true;\n        }\n\n        // DFS to find the longest buildable word\n        string result = \"\";\n        Dfs(0, new List<char>(), ref result);\n        return result;\n    }\n\n    private void Dfs(int node, List<char> path, ref string result) {\n        string current = new string(path.ToArray());\n        if (current.Length > result.Length ||\n            (current.Length == result.Length && string.Compare(current, result) < 0)) {\n            result = current;\n        }\n\n        // Explore children in alphabetical order\n        for (int c = 0; c < 26; c++) {\n            int child = children[node][c];\n            if (child != 0 && isEnd[child]) {\n                path.Add((char)('a' + c));\n                Dfs(child, path, ref result);\n                path.RemoveAt(path.Count - 1);\n            }\n        }\n    }\n}",
    "lineMap": {
      "-": [
        10,
        11,
        15
      ],
      "insert_word": [
        18,
        19
      ],
      "insert_char": [
        20,
        21
      ],
      "traverse_char": [
        25
      ],
      "create_node": [
        22,
        23
      ],
      "mark_end": [
        27
      ],
      "start_dfs": [
        32
      ],
      "visit_node": [
        36,
        37
      ],
      "update_result": [
        38,
        39,
        40
      ],
      "explore_child": [
        46,
        47,
        48
      ],
      "backtrack": [
        49
      ],
      "skip_child": [
        46
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_longer": [
        38
      ],
      "is_end_of_word": [
        46
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestWord(words []string) string {\n    // Trie node structure\n    type TrieNode struct {\n        children [26]int\n        isEnd    bool\n    }\n\n    nodes := []TrieNode{{}} // root node\n\n    // Insert all words into the Trie\n    for _, word := range words {\n        node := 0\n        for _, c := range word {\n            idx := c - 'a'\n            if nodes[node].children[idx] == 0 {\n                nodes[node].children[idx] = len(nodes)\n                nodes = append(nodes, TrieNode{})\n            }\n            node = nodes[node].children[idx]\n        }\n        nodes[node].isEnd = true\n    }\n\n    // DFS to find the longest buildable word\n    result := \"\"\n    var dfs func(node int, path []byte)\n    dfs = func(node int, path []byte) {\n        current := string(path)\n        if len(current) > len(result) || (len(current) == len(result) && current < result) {\n            result = current\n        }\n\n        // Explore children in alphabetical order\n        for c := 0; c < 26; c++ {\n            child := nodes[node].children[c]\n            if child != 0 && nodes[child].isEnd {\n                path = append(path, byte('a'+c))\n                dfs(child, path)\n                path = path[:len(path)-1]\n            }\n        }\n    }\n\n    dfs(0, []byte{})\n    return result\n}",
    "lineMap": {
      "-": [
        8
      ],
      "insert_word": [
        11,
        12
      ],
      "insert_char": [
        13,
        14
      ],
      "traverse_char": [
        19
      ],
      "create_node": [
        15,
        16,
        17
      ],
      "mark_end": [
        21
      ],
      "start_dfs": [
        44
      ],
      "visit_node": [
        27,
        28
      ],
      "update_result": [
        29,
        30
      ],
      "explore_child": [
        36,
        37,
        38
      ],
      "backtrack": [
        39
      ],
      "skip_child": [
        36
      ],
      "complete": [
        45
      ]
    },
    "conditionalMap": {
      "is_longer": [
        29
      ],
      "is_end_of_word": [
        36
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestWord = function (words) {\n  // Build Trie using nested objects\n  const trie = {};\n\n  for (const word of words) {\n    let node = trie;\n    for (const char of word) {\n      if (!node[char]) {\n        node[char] = {};\n      }\n      node = node[char];\n    }\n    node[\"#\"] = true; // mark end of word\n  }\n\n  // DFS to find the longest buildable word\n  let result = \"\";\n\n  const dfs = (node, path) => {\n    if (path.length > result.length || (path.length === result.length && path < result)) {\n      result = path;\n    }\n\n    // Explore children in alphabetical order\n    const keys = Object.keys(node).filter((k) => k !== \"#\").sort();\n    for (const c of keys) {\n      // Only follow this child if it represents a complete word\n      if (node[c][\"#\"]) {\n        dfs(node[c], path + c);\n      }\n    }\n  };\n\n  dfs(trie, \"\");\n  return result;\n};",
    "lineMap": {
      "-": [
        3
      ],
      "insert_word": [
        5,
        6
      ],
      "insert_char": [
        7
      ],
      "traverse_char": [
        11
      ],
      "create_node": [
        8,
        9
      ],
      "mark_end": [
        13
      ],
      "start_dfs": [
        34
      ],
      "visit_node": [
        19
      ],
      "update_result": [
        20,
        21
      ],
      "explore_child": [
        28,
        29
      ],
      "backtrack": [
        29
      ],
      "skip_child": [
        28
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "is_longer": [
        20
      ],
      "is_end_of_word": [
        28
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestWord(words: string[]): string {\n    // Build Trie using nested objects\n    const trie: Record<string, any> = {};\n\n    for (const word of words) {\n        let node = trie;\n        for (const char of word) {\n            if (!node[char]) {\n                node[char] = {};\n            }\n            node = node[char];\n        }\n        node[\"#\"] = true; // mark end of word\n    }\n\n    // DFS to find the longest buildable word\n    let result = \"\";\n\n    const dfs = (node: Record<string, any>, path: string): void => {\n        if (path.length > result.length || (path.length === result.length && path < result)) {\n            result = path;\n        }\n\n        // Explore children in alphabetical order\n        const keys = Object.keys(node).filter((k) => k !== \"#\").sort();\n        for (const c of keys) {\n            // Only follow this child if it represents a complete word\n            if (node[c][\"#\"]) {\n                dfs(node[c], path + c);\n            }\n        }\n    };\n\n    dfs(trie, \"\");\n    return result;\n}",
    "lineMap": {
      "-": [
        3
      ],
      "insert_word": [
        5,
        6
      ],
      "insert_char": [
        7
      ],
      "traverse_char": [
        11
      ],
      "create_node": [
        8,
        9
      ],
      "mark_end": [
        13
      ],
      "start_dfs": [
        34
      ],
      "visit_node": [
        19
      ],
      "update_result": [
        20,
        21
      ],
      "explore_child": [
        28,
        29
      ],
      "backtrack": [
        29
      ],
      "skip_child": [
        28
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "is_longer": [
        20
      ],
      "is_end_of_word": [
        28
      ]
    }
  }
};

const LongestWordInDictionaryPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "words": [
        "w",
        "wo",
        "wor",
        "worl",
        "world"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "words": [
        "a",
        "banana",
        "app",
        "appl",
        "ap",
        "apply",
        "apple"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "words": [
        "m",
        "mo",
        "moc",
        "moch",
        "mocha",
        "l",
        "la",
        "lat",
        "latt",
        "latte"
      ]
    }
  }
];

function generateLongestWordInDictionarySteps(e: any): any[] {
  
let t=e.words||[],r=new RecursiveStepRecorder({},{});r.add_new_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"}),r.add_new_visual("meta_words",{type:"metadata",value:t.join(", "),label:"Words"}),r.add_new_visual("meta_result",{type:"metadata",value:'""',label:"Result"}),r.add_new_visual("meta_current",{type:"metadata",value:"",label:"Current Word"}),r.update_global_variable("result",""),r.update_global_variable("currentWord",""),r.record("-","Start: Build a Trie from words, then DFS to find the longest word where every prefix is also a word");let i=new Map;i.set("","trie_root");let a=0,s=new Map;function o(){s.forEach((e,t)=>{r.update_visual(t,{type:"trieNode",char:e.char,isEndOfWord:e.isEndOfWord,parent:e.parent,edgeLabel:e.edgeLabel,state:"standard"})})}function n(e,t){let l=s.get(e);l&&r.update_visual(e,{type:"trieNode",char:l.char,isEndOfWord:l.isEndOfWord,parent:l.parent,edgeLabel:l.edgeLabel,state:t})}s.set("trie_root",{char:"*",isEndOfWord:!1});for(let e=0;e<t.length;e++){let l=t[e];o(),r.update_global_variable("currentWord",l),r.update_visual("meta_current",{type:"metadata",value:`"${l}"`,label:"Inserting"}),r.record("insert_word",`Phase 1: Insert word "${l}" (${e+1}/${t.length})`);let d="",c="trie_root";n(c,"active");for(let e=0;e<l.length;e++){let t=l[e],o=d+t,u=i.has(o);if(r.record("insert_char",`Insert character '${t}' (${e+1}/${l.length})`),u){let e=i.get(o);n(c,"visited"),n(e,"active"),r.record("traverse_char",`Character '${t}' exists, traverse to it`),c=e}else{a++;let e=`trie_${a}`,l={char:t,isEndOfWord:!1,parent:c,edgeLabel:t};s.set(e,l),i.set(o,e),r.add_new_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:c,edgeLabel:t,state:"highlight"}),n(c,"visited"),r.record("create_node",`Create new node for '${t}'`),n(e,"active"),c=e}d=o}let u=s.get(c);u.isEndOfWord=!0,r.update_visual(c,{type:"trieNode",char:u.char,isEndOfWord:!0,parent:u.parent,edgeLabel:u.edgeLabel,state:"active"}),r.record("mark_end",`Mark '${u.char}' as end of word "${l}"`)}o(),r.update_global_variable("currentWord",""),r.update_visual("meta_current",{type:"metadata",value:"",label:"DFS Path"}),r.record("start_dfs","Phase 2: DFS from root to find longest word where every prefix is a word");let d=new Map;d.set("",[]),i.forEach((e,t)=>{if(""===t)return;let r=t.slice(0,-1),l=t[t.length-1];d.has(r)||d.set(r,[]),d.get(r).push(l),d.has(t)||d.set(t,[])}),d.forEach(e=>e.sort());let c="";!function e(t,l){let a=t.length>c.length||t.length===c.length&&t<c;for(let o of(r.add_conditional("is_longer",a),""===t?(n(l,"active"),r.pushCallFrame({node:"*",path:'""'},"dfs"),r.record("visit_node","Visit root node")):(r.pushCallFrame({node:t[t.length-1],path:`"${t}"`},"dfs"),r.record("visit_node",`Visit node, current path = "${t}"`)),a&&""!==t&&(c=t,r.update_global_variable("result",c),r.update_visual("meta_result",{type:"metadata",value:`"${c}"`,label:"Result"}),r.record("update_result",`Update result to "${c}" (length ${c.length})`)),d.get(t)||[])){let a=t+o,d=i.get(a);if(!d)continue;let c=s.get(d);if(!c)continue;let u=c.isEndOfWord;r.add_conditional("is_end_of_word",u),u?(n(d,"active"),r.update_global_variable("currentWord",a),r.update_visual("meta_current",{type:"metadata",value:`"${a}"`,label:"DFS Path"}),r.record("explore_child",`Explore child '${o}' - it is end of a word, valid prefix chain`),e(a,d),n(d,"visited"),n(l,"active"),r.update_global_variable("currentWord",t),r.update_visual("meta_current",{type:"metadata",value:t?`"${t}"`:"",label:"DFS Path"}),r.record("backtrack",`Backtrack from '${o}' to "${t||"root"}"`)):(n(d,"highlight"),r.record("skip_child",`Skip child '${o}' - not end of a word, breaks prefix chain`),n(d,"standard"))}r.popCallFrame()}("","trie_root"),o(),n("trie_root","active");let u="";for(let e of c){u+=e;let t=i.get(u);t&&n(t,"active")}return r.update_visual("meta_current",{type:"metadata",value:"",label:"DFS Path"}),r.update_visual("meta_result",{type:"metadata",value:`"${c}"`,label:"Result"}),r.record("complete",`Done! Longest word where every prefix is also a word: "${c}"`),r.getSteps()
}

export function LongestWordInDictionaryProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestWordInDictionaryTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestWordInDictionarySteps(e) as any[];
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
      title="Longest Word in Dictionary"
      slug="longest-word-in-dictionary"
      approaches={approaches}
      presets={LongestWordInDictionaryPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum XOR of Two Numbers in an Array (maximum-xor-of-two-numbers-in-an-array)
// ==========================================

const MaximumXorOfTwoNumbersInAnArrayTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def findMaximumXOR(self, nums: list[int]) -> int:\n        # Build binary trie using nested dictionaries\n        root = {}\n\n        # Insert all numbers into the trie\n        for num in nums:\n            node = root\n            for k in range(30, -1, -1):\n                bit = (num >> k) & 1\n                if bit not in node:\n                    node[bit] = {}\n                node = node[bit]\n\n        # For each number, greedily find max XOR partner\n        max_xor = 0\n        for num in nums:\n            node = root\n            current_xor = 0\n            for k in range(30, -1, -1):\n                bit = (num >> k) & 1\n                opposite_bit = 1 - bit\n\n                # Prefer opposite bit to maximize XOR\n                if opposite_bit in node:\n                    current_xor |= (1 << k)\n                    node = node[opposite_bit]\n                else:\n                    node = node[bit]\n\n            max_xor = max(max_xor, current_xor)\n\n        return max_xor",
    "lineMap": {
      "-": [
        4
      ],
      "insert_num": [
        7,
        8
      ],
      "insert_bit": [
        9,
        10
      ],
      "create_node": [
        11,
        12
      ],
      "start_query": [
        16
      ],
      "query_num": [
        17,
        18,
        19
      ],
      "query_bit": [
        20,
        21,
        22
      ],
      "take_opposite": [
        25,
        26,
        27
      ],
      "take_same": [
        28,
        29
      ],
      "update_xor": [
        31
      ],
      "update_max": [
        31
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "bit_missing": [
        11
      ],
      "has_opposite": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int findMaximumXOR(int[] nums) {\n        // Build binary trie using arrays\n        // Each node has children[0] and children[1]\n        int[][] trie = new int[31 * nums.length + 1][2];\n        int trieSize = 1; // node 0 is root\n\n        // Initialize children to -1 (no child)\n        for (int[] node : trie) {\n            node[0] = -1;\n            node[1] = -1;\n        }\n\n        // Insert all numbers into the trie\n        for (int num : nums) {\n            int node = 0;\n            for (int k = 30; k >= 0; k--) {\n                int bit = (num >> k) & 1;\n                if (trie[node][bit] == -1) {\n                    trie[node][bit] = trieSize++;\n                }\n                node = trie[node][bit];\n            }\n        }\n\n        // For each number, greedily find max XOR partner\n        int maxXor = 0;\n        for (int num : nums) {\n            int node = 0;\n            int currentXor = 0;\n            for (int k = 30; k >= 0; k--) {\n                int bit = (num >> k) & 1;\n                int oppositeBit = 1 - bit;\n\n                // Prefer opposite bit to maximize XOR\n                if (trie[node][oppositeBit] != -1) {\n                    currentXor |= (1 << k);\n                    node = trie[node][oppositeBit];\n                } else {\n                    node = trie[node][bit];\n                }\n            }\n            maxXor = Math.max(maxXor, currentXor);\n        }\n\n        return maxXor;\n    }\n}",
    "lineMap": {
      "-": [
        5,
        6
      ],
      "insert_num": [
        15,
        16
      ],
      "insert_bit": [
        17,
        18
      ],
      "create_node": [
        19,
        20
      ],
      "start_query": [
        27
      ],
      "query_num": [
        28,
        29,
        30
      ],
      "query_bit": [
        31,
        32,
        33
      ],
      "take_opposite": [
        36,
        37,
        38
      ],
      "take_same": [
        39,
        40
      ],
      "update_xor": [
        43
      ],
      "update_max": [
        43
      ],
      "complete": [
        46
      ]
    },
    "conditionalMap": {
      "bit_missing": [
        19
      ],
      "has_opposite": [
        36
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int findMaximumXOR(vector<int>& nums) {\n        // Binary trie using arrays for speed\n        int n = nums.size();\n        vector<array<int, 2>> trie(31 * n + 1, {-1, -1});\n        int trieSize = 1; // node 0 is root\n\n        // Insert all numbers into the trie\n        for (int num : nums) {\n            int node = 0;\n            for (int k = 30; k >= 0; k--) {\n                int bit = (num >> k) & 1;\n                if (trie[node][bit] == -1) {\n                    trie[node][bit] = trieSize++;\n                }\n                node = trie[node][bit];\n            }\n        }\n\n        // For each number, greedily find max XOR partner\n        int maxXor = 0;\n        for (int num : nums) {\n            int node = 0;\n            int currentXor = 0;\n            for (int k = 30; k >= 0; k--) {\n                int bit = (num >> k) & 1;\n                int oppositeBit = 1 - bit;\n\n                // Prefer opposite bit to maximize XOR\n                if (trie[node][oppositeBit] != -1) {\n                    currentXor |= (1 << k);\n                    node = trie[node][oppositeBit];\n                } else {\n                    node = trie[node][bit];\n                }\n            }\n            maxXor = max(maxXor, currentXor);\n        }\n\n        return maxXor;\n    }\n};",
    "lineMap": {
      "-": [
        5,
        6,
        7
      ],
      "insert_num": [
        10,
        11
      ],
      "insert_bit": [
        12,
        13
      ],
      "create_node": [
        14,
        15
      ],
      "start_query": [
        22
      ],
      "query_num": [
        23,
        24,
        25
      ],
      "query_bit": [
        26,
        27,
        28
      ],
      "take_opposite": [
        31,
        32,
        33
      ],
      "take_same": [
        34,
        35
      ],
      "update_xor": [
        38
      ],
      "update_max": [
        38
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "bit_missing": [
        14
      ],
      "has_opposite": [
        31
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int FindMaximumXOR(int[] nums) {\n        // Binary trie using arrays\n        int n = nums.Length;\n        int[][] trie = new int[31 * n + 1][];\n        for (int i = 0; i < trie.Length; i++) {\n            trie[i] = new int[] { -1, -1 };\n        }\n        int trieSize = 1; // node 0 is root\n\n        // Insert all numbers into the trie\n        foreach (int num in nums) {\n            int node = 0;\n            for (int k = 30; k >= 0; k--) {\n                int bit = (num >> k) & 1;\n                if (trie[node][bit] == -1) {\n                    trie[node][bit] = trieSize++;\n                }\n                node = trie[node][bit];\n            }\n        }\n\n        // For each number, greedily find max XOR partner\n        int maxXor = 0;\n        foreach (int num in nums) {\n            int node = 0;\n            int currentXor = 0;\n            for (int k = 30; k >= 0; k--) {\n                int bit = (num >> k) & 1;\n                int oppositeBit = 1 - bit;\n\n                // Prefer opposite bit to maximize XOR\n                if (trie[node][oppositeBit] != -1) {\n                    currentXor |= (1 << k);\n                    node = trie[node][oppositeBit];\n                } else {\n                    node = trie[node][bit];\n                }\n            }\n            maxXor = Math.Max(maxXor, currentXor);\n        }\n\n        return maxXor;\n    }\n}",
    "lineMap": {
      "-": [
        5,
        7,
        9
      ],
      "insert_num": [
        12,
        13
      ],
      "insert_bit": [
        14,
        15
      ],
      "create_node": [
        16,
        17
      ],
      "start_query": [
        24
      ],
      "query_num": [
        25,
        26,
        27
      ],
      "query_bit": [
        28,
        29,
        30
      ],
      "take_opposite": [
        33,
        34,
        35
      ],
      "take_same": [
        36,
        37
      ],
      "update_xor": [
        40
      ],
      "update_max": [
        40
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "bit_missing": [
        16
      ],
      "has_opposite": [
        33
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMaximumXOR(nums []int) int {\n    // Binary trie using slices\n    n := len(nums)\n    trie := make([][2]int, 31*n+1)\n    for i := range trie {\n        trie[i] = [2]int{-1, -1}\n    }\n    trieSize := 1 // node 0 is root\n\n    // Insert all numbers into the trie\n    for _, num := range nums {\n        node := 0\n        for k := 30; k >= 0; k-- {\n            bit := (num >> k) & 1\n            if trie[node][bit] == -1 {\n                trie[node][bit] = trieSize\n                trieSize++\n            }\n            node = trie[node][bit]\n        }\n    }\n\n    // For each number, greedily find max XOR partner\n    maxXor := 0\n    for _, num := range nums {\n        node := 0\n        currentXor := 0\n        for k := 30; k >= 0; k-- {\n            bit := (num >> k) & 1\n            oppositeBit := 1 - bit\n\n            // Prefer opposite bit to maximize XOR\n            if trie[node][oppositeBit] != -1 {\n                currentXor |= (1 << k)\n                node = trie[node][oppositeBit]\n            } else {\n                node = trie[node][bit]\n            }\n        }\n        if currentXor > maxXor {\n            maxXor = currentXor\n        }\n    }\n\n    return maxXor\n}",
    "lineMap": {
      "-": [
        4,
        6,
        8
      ],
      "insert_num": [
        11,
        12
      ],
      "insert_bit": [
        13,
        14
      ],
      "create_node": [
        15,
        16,
        17
      ],
      "start_query": [
        24
      ],
      "query_num": [
        25,
        26,
        27
      ],
      "query_bit": [
        28,
        29,
        30
      ],
      "take_opposite": [
        33,
        34,
        35
      ],
      "take_same": [
        36,
        37
      ],
      "update_xor": [
        40,
        41
      ],
      "update_max": [
        40,
        41
      ],
      "complete": [
        45
      ]
    },
    "conditionalMap": {
      "bit_missing": [
        15
      ],
      "has_opposite": [
        33
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findMaximumXOR = function(nums) {\n    // Binary trie using arrays\n    var n = nums.length;\n    var trie = [];\n    for (var t = 0; t < 31 * n + 1; t++) {\n        trie.push([-1, -1]);\n    }\n    var trieSize = 1; // node 0 is root\n\n    // Insert all numbers into the trie\n    for (var i = 0; i < nums.length; i++) {\n        var node = 0;\n        for (var k = 30; k >= 0; k--) {\n            var bit = (nums[i] >> k) & 1;\n            if (trie[node][bit] === -1) {\n                trie[node][bit] = trieSize++;\n            }\n            node = trie[node][bit];\n        }\n    }\n\n    // For each number, greedily find max XOR partner\n    var maxXor = 0;\n    for (var i = 0; i < nums.length; i++) {\n        var node = 0;\n        var currentXor = 0;\n        for (var k = 30; k >= 0; k--) {\n            var bit = (nums[i] >> k) & 1;\n            var oppositeBit = 1 - bit;\n\n            // Prefer opposite bit to maximize XOR\n            if (trie[node][oppositeBit] !== -1) {\n                currentXor |= (1 << k);\n                node = trie[node][oppositeBit];\n            } else {\n                node = trie[node][bit];\n            }\n        }\n        maxXor = Math.max(maxXor, currentXor);\n    }\n\n    return maxXor;\n};",
    "lineMap": {
      "-": [
        4,
        6,
        8
      ],
      "insert_num": [
        11,
        12
      ],
      "insert_bit": [
        13,
        14
      ],
      "create_node": [
        15,
        16
      ],
      "start_query": [
        23
      ],
      "query_num": [
        24,
        25,
        26
      ],
      "query_bit": [
        27,
        28,
        29
      ],
      "take_opposite": [
        32,
        33,
        34
      ],
      "take_same": [
        35,
        36
      ],
      "update_xor": [
        39
      ],
      "update_max": [
        39
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "bit_missing": [
        15
      ],
      "has_opposite": [
        32
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMaximumXOR(nums: number[]): number {\n    // Binary trie using arrays\n    const n = nums.length;\n    const trie: number[][] = [];\n    for (let t = 0; t < 31 * n + 1; t++) {\n        trie.push([-1, -1]);\n    }\n    let trieSize = 1; // node 0 is root\n\n    // Insert all numbers into the trie\n    for (const num of nums) {\n        let node = 0;\n        for (let k = 30; k >= 0; k--) {\n            const bit = (num >> k) & 1;\n            if (trie[node][bit] === -1) {\n                trie[node][bit] = trieSize++;\n            }\n            node = trie[node][bit];\n        }\n    }\n\n    // For each number, greedily find max XOR partner\n    let maxXor = 0;\n    for (const num of nums) {\n        let node = 0;\n        let currentXor = 0;\n        for (let k = 30; k >= 0; k--) {\n            const bit = (num >> k) & 1;\n            const oppositeBit = 1 - bit;\n\n            // Prefer opposite bit to maximize XOR\n            if (trie[node][oppositeBit] !== -1) {\n                currentXor |= (1 << k);\n                node = trie[node][oppositeBit];\n            } else {\n                node = trie[node][bit];\n            }\n        }\n        maxXor = Math.max(maxXor, currentXor);\n    }\n\n    return maxXor;\n}",
    "lineMap": {
      "-": [
        4,
        6,
        8
      ],
      "insert_num": [
        11,
        12
      ],
      "insert_bit": [
        13,
        14
      ],
      "create_node": [
        15,
        16
      ],
      "start_query": [
        23
      ],
      "query_num": [
        24,
        25,
        26
      ],
      "query_bit": [
        27,
        28,
        29
      ],
      "take_opposite": [
        32,
        33,
        34
      ],
      "take_same": [
        35,
        36
      ],
      "update_xor": [
        39
      ],
      "update_max": [
        39
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "bit_missing": [
        15
      ],
      "has_opposite": [
        32
      ]
    }
  }
};

const MaximumXorOfTwoNumbersInAnArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (ans=28)",
    "value": {
      "nums": [
        3,
        10,
        5,
        25,
        2,
        8
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Large (ans=127)",
    "value": {
      "nums": [
        14,
        70,
        53,
        83,
        49,
        91,
        36,
        80,
        92,
        51,
        66,
        70
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Small (ans=14)",
    "value": {
      "nums": [
        2,
        4,
        6,
        8
      ]
    }
  }
];

function generateMaximumXorOfTwoNumbersInAnArraySteps(e: any): any[] {
  
let t=e.nums||[],i=new StepRecorder({},{});if(0===t.length)return i.record("-","Start: Empty array, no XOR possible"),i.add_new_variable("maxXor",0),i.record("complete","Done! Maximum XOR = 0"),i.getSteps();let a=Math.max(...t),n=0===a?1:Math.floor(Math.log2(a))+1;function o(e){return e.toString(2).padStart(n,"0")}t.forEach((e,t)=>{i.add_new_visual(`bar_${t}`,{type:"arrayElement",value:e,position:t,label:o(e),state:void 0})}),i.add_new_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"}),i.add_new_variable("phase","Build Trie"),i.add_new_variable("currentNum",""),i.add_new_variable("currentBinary",""),i.add_new_variable("currentXor",""),i.add_new_variable("maxXor",0),i.record("-",`Start: Build binary trie using ${n}-bit representation`);let s=new Map;function l(){t.forEach((e,t)=>{i.update_visual(`bar_${t}`,{type:"arrayElement",value:e,position:t,label:o(e),state:void 0})})}function d(){s.forEach(e=>{let t=i.get_visual(e);t&&"trieNode"===t.type&&i.update_visual(e,{...t,state:"standard"})})}s.set("","trie_root");for(let e=0;e<t.length;e++){let r=t[e],a=o(r);d(),l(),i.update_visual(`bar_${e}`,{type:"arrayElement",value:r,position:e,label:a,state:"active"}),i.update_variable("currentNum",r),i.update_variable("currentBinary",a),i.record("insert_num",`Insert ${r} (${a}) into trie`);let u="",m="trie_root";i.update_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"active"});for(let e=0;e<n;e++){let t=a[e],r=u+t,n=s.has(r);if(i.add_conditional("bit_missing",!n),i.record("insert_bit",`Bit ${e}: '${t}', ${n?"exists":"create new node"}`),n){let e=s.get(r),t=i.get_visual(m);i.update_visual(m,{...t,state:"visited"});let a=i.get_visual(e);i.update_visual(e,{...a,state:"active"}),m=e}else{let e=`trie_${r}`,a=s.get(u);i.add_new_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:a,edgeLabel:t,state:"highlight"}),s.set(r,e);let n=i.get_visual(m);i.update_visual(m,{...n,state:"visited"}),i.record("create_node",`Created new node for bit '${t}'`),i.update_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:a,edgeLabel:t,state:"active"}),m=e}u=r}let c=i.get_visual(m);i.update_visual(m,{...c,type:"trieNode",isEndOfWord:!0,state:"active"}),i.update_visual(`bar_${e}`,{type:"arrayElement",value:r,position:e,label:a,state:"sorted"})}i.update_variable("phase","Find Max XOR"),i.update_variable("currentXor",0),d(),l(),i.record("start_query","Trie built. Now find maximum XOR by greedy traversal.");let u=0;for(let e=0;e<t.length;e++){let r=t[e],a=o(r);d(),l(),i.update_visual(`bar_${e}`,{type:"arrayElement",value:r,position:e,label:a,state:"active"}),i.update_variable("currentNum",r),i.update_variable("currentBinary",a),i.update_variable("currentXor",0),i.record("query_num",`Query: try to maximize XOR for ${r} (${a})`);let m="trie_root",c="",p=0;i.update_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"active"});for(let e=0;e<n;e++){let t=a[e],r="0"===t?"1":"0",o=c+r,l=c+t,d=s.has(o);if(i.add_conditional("has_opposite",d),i.record("query_bit",`Bit ${e}: num has '${t}', want opposite '${r}', ${d?"available!":"not available"}`),d){p|=1<<n-1-e;let t=s.get(o),a=i.get_visual(m);i.update_visual(m,{...a,state:"visited"});let l=i.get_visual(t);i.update_visual(t,{...l,state:"highlight"}),i.update_variable("currentXor",p),i.record("take_opposite",`Take opposite bit '${r}', XOR bit = 1, currentXor = ${p}`),m=t,c=o}else{let e=s.get(l),r=i.get_visual(m);i.update_visual(m,{...r,state:"visited"});let a=i.get_visual(e);i.update_visual(e,{...a,state:"active"}),i.record("take_same",`Take same bit '${t}', XOR bit = 0, currentXor = ${p}`),m=e,c=l}}p>u?(u=p,i.update_variable("maxXor",u),i.record("update_max",`currentXor ${p} > maxXor, update maxXor = ${u}`)):i.record("update_xor",`currentXor ${p} <= maxXor ${u}, no update`)}return i.update_variable("phase","Complete"),i.record("complete",`Done! Maximum XOR = ${u}`),i.getSteps()
}

export function MaximumXorOfTwoNumbersInAnArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumXorOfTwoNumbersInAnArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumXorOfTwoNumbersInAnArraySteps(e) as any[];
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
      title="Maximum XOR of Two Numbers in an Array"
      slug="maximum-xor-of-two-numbers-in-an-array"
      approaches={approaches}
      presets={MaximumXorOfTwoNumbersInAnArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Replace Words (replace-words)
// ==========================================

const ReplaceWordsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def replaceWords(self, dictionary: list[str], sentence: str) -> str:\n        # Build Trie using nested dictionaries\n        trie = {}\n\n        for root in dictionary:\n            node = trie\n            for ch in root:\n                if '#' in node:\n                    # A shorter root already ends here, skip the rest\n                    break\n                if ch not in node:\n                    node[ch] = {}\n                node = node[ch]\n            node['#'] = True  # Mark end of root\n\n        words = sentence.split()\n        result = []\n\n        for word in words:\n            # Search Trie for shortest root prefix\n            node = trie\n            found = False\n            for i, ch in enumerate(word):\n                if ch not in node:\n                    break\n                node = node[ch]\n                if '#' in node:\n                    result.append(word[:i + 1])\n                    found = True\n                    break\n\n            if not found:\n                result.append(word)\n\n        return \" \".join(result)",
    "lineMap": {
      "-": [
        4
      ],
      "insert_root": [
        6,
        7
      ],
      "insert_char": [
        8
      ],
      "create_node": [
        12,
        13
      ],
      "mark_end": [
        15
      ],
      "start_replace": [
        17,
        18
      ],
      "process_word": [
        20,
        22,
        23
      ],
      "search_char": [
        24,
        25,
        27
      ],
      "found_root": [
        28,
        29,
        30,
        31
      ],
      "no_root": [
        33,
        34
      ],
      "append_result": [
        29,
        34
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "char_missing": [
        12
      ],
      "search_miss": [
        25
      ],
      "is_root_end": [
        28
      ],
      "not_found": [
        33
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String replaceWords(List<String> dictionary, String sentence) {\n        // Build Trie\n        int[][] children = new int[100001][26];\n        boolean[] isEnd = new boolean[100001];\n        int trieSize = 1; // node 0 is root\n\n        for (String root : dictionary) {\n            int node = 0;\n            for (int i = 0; i < root.length(); i++) {\n                int idx = root.charAt(i) - 'a';\n                if (children[node][idx] == 0) {\n                    children[node][idx] = trieSize++;\n                }\n                node = children[node][idx];\n                // If a shorter root already ends here, skip the rest\n                if (isEnd[node]) break;\n            }\n            isEnd[node] = true;\n        }\n\n        String[] words = sentence.split(\" \");\n        StringBuilder result = new StringBuilder();\n\n        for (int w = 0; w < words.length; w++) {\n            if (w > 0) result.append(\" \");\n\n            // Search Trie for shortest root prefix\n            int node = 0;\n            boolean found = false;\n            for (int i = 0; i < words[w].length(); i++) {\n                int idx = words[w].charAt(i) - 'a';\n                if (children[node][idx] == 0) break;\n                node = children[node][idx];\n                if (isEnd[node]) {\n                    result.append(words[w], 0, i + 1);\n                    found = true;\n                    break;\n                }\n            }\n\n            if (!found) result.append(words[w]);\n        }\n\n        return result.toString();\n    }\n}",
    "lineMap": {
      "-": [
        4,
        5,
        6
      ],
      "insert_root": [
        8,
        9
      ],
      "insert_char": [
        10,
        11
      ],
      "create_node": [
        12,
        13
      ],
      "mark_end": [
        19
      ],
      "start_replace": [
        22,
        23
      ],
      "process_word": [
        25,
        29,
        30
      ],
      "search_char": [
        31,
        32,
        33,
        34
      ],
      "found_root": [
        35,
        36,
        37,
        38
      ],
      "no_root": [
        42
      ],
      "append_result": [
        36,
        42
      ],
      "complete": [
        45
      ]
    },
    "conditionalMap": {
      "char_missing": [
        12
      ],
      "search_miss": [
        33
      ],
      "is_root_end": [
        35
      ],
      "not_found": [
        42
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string replaceWords(vector<string>& dictionary, string sentence) {\n        // Build Trie using arrays\n        vector<array<int, 26>> children(1, array<int, 26>{});\n        vector<bool> isEnd(1, false);\n\n        for (const string& root : dictionary) {\n            int node = 0;\n            for (char c : root) {\n                int idx = c - 'a';\n                if (children[node][idx] == 0) {\n                    children[node][idx] = children.size();\n                    children.push_back(array<int, 26>{});\n                    isEnd.push_back(false);\n                }\n                node = children[node][idx];\n                // If a shorter root already ends here, skip\n                if (isEnd[node]) break;\n            }\n            isEnd[node] = true;\n        }\n\n        // Split sentence into words\n        vector<string> words;\n        string word;\n        for (char c : sentence) {\n            if (c == ' ') {\n                words.push_back(word);\n                word.clear();\n            } else {\n                word += c;\n            }\n        }\n        words.push_back(word);\n\n        string result;\n        for (int w = 0; w < words.size(); w++) {\n            if (w > 0) result += ' ';\n\n            // Search Trie for shortest root prefix\n            int node = 0;\n            bool found = false;\n            for (int i = 0; i < words[w].size(); i++) {\n                int idx = words[w][i] - 'a';\n                if (children[node][idx] == 0) break;\n                node = children[node][idx];\n                if (isEnd[node]) {\n                    result += words[w].substr(0, i + 1);\n                    found = true;\n                    break;\n                }\n            }\n\n            if (!found) result += words[w];\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        5,
        6
      ],
      "insert_root": [
        8,
        9
      ],
      "insert_char": [
        10,
        11
      ],
      "create_node": [
        12,
        13,
        14,
        15
      ],
      "mark_end": [
        21
      ],
      "start_replace": [
        35,
        37
      ],
      "process_word": [
        38,
        42,
        43
      ],
      "search_char": [
        44,
        45,
        46,
        47
      ],
      "found_root": [
        48,
        49,
        50,
        51
      ],
      "no_root": [
        55
      ],
      "append_result": [
        49,
        55
      ],
      "complete": [
        58
      ]
    },
    "conditionalMap": {
      "char_missing": [
        12
      ],
      "search_miss": [
        46
      ],
      "is_root_end": [
        48
      ],
      "not_found": [
        55
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string ReplaceWords(IList<string> dictionary, string sentence) {\n        // Build Trie\n        List<int[]> children = new List<int[]>();\n        List<bool> isEnd = new List<bool>();\n        children.Add(new int[26]);\n        isEnd.Add(false);\n\n        foreach (string root in dictionary) {\n            int node = 0;\n            foreach (char c in root) {\n                int idx = c - 'a';\n                if (children[node][idx] == 0) {\n                    children[node][idx] = children.Count;\n                    children.Add(new int[26]);\n                    isEnd.Add(false);\n                }\n                node = children[node][idx];\n                // If a shorter root already ends here, skip\n                if (isEnd[node]) break;\n            }\n            isEnd[node] = true;\n        }\n\n        string[] words = sentence.Split(' ');\n        StringBuilder result = new StringBuilder();\n\n        for (int w = 0; w < words.Length; w++) {\n            if (w > 0) result.Append(' ');\n\n            // Search Trie for shortest root prefix\n            int node = 0;\n            bool found = false;\n            for (int i = 0; i < words[w].Length; i++) {\n                int idx = words[w][i] - 'a';\n                if (children[node][idx] == 0) break;\n                node = children[node][idx];\n                if (isEnd[node]) {\n                    result.Append(words[w], 0, i + 1);\n                    found = true;\n                    break;\n                }\n            }\n\n            if (!found) result.Append(words[w]);\n        }\n\n        return result.ToString();\n    }\n}",
    "lineMap": {
      "-": [
        4,
        5,
        6,
        7
      ],
      "insert_root": [
        9,
        10
      ],
      "insert_char": [
        11,
        12
      ],
      "create_node": [
        13,
        14,
        15,
        16
      ],
      "mark_end": [
        22
      ],
      "start_replace": [
        25,
        26
      ],
      "process_word": [
        28,
        32,
        33
      ],
      "search_char": [
        34,
        35,
        36,
        37
      ],
      "found_root": [
        38,
        39,
        40,
        41
      ],
      "no_root": [
        45
      ],
      "append_result": [
        39,
        45
      ],
      "complete": [
        48
      ]
    },
    "conditionalMap": {
      "char_missing": [
        13
      ],
      "search_miss": [
        36
      ],
      "is_root_end": [
        38
      ],
      "not_found": [
        45
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func replaceWords(dictionary []string, sentence string) string {\n    // Build Trie\n    type trieNode struct {\n        children [26]int\n        isEnd    bool\n    }\n    trie := []trieNode{{}}\n\n    for _, root := range dictionary {\n        node := 0\n        for _, c := range root {\n            idx := int(c - 'a')\n            if trie[node].children[idx] == 0 {\n                trie[node].children[idx] = len(trie)\n                trie = append(trie, trieNode{})\n            }\n            node = trie[node].children[idx]\n            // If a shorter root already ends here, skip\n            if trie[node].isEnd {\n                break\n            }\n        }\n        trie[node].isEnd = true\n    }\n\n    words := strings.Split(sentence, \" \")\n    result := make([]string, len(words))\n\n    for w, word := range words {\n        // Search Trie for shortest root prefix\n        node := 0\n        found := false\n        for i := 0; i < len(word); i++ {\n            idx := int(word[i] - 'a')\n            if trie[node].children[idx] == 0 {\n                break\n            }\n            node = trie[node].children[idx]\n            if trie[node].isEnd {\n                result[w] = word[:i+1]\n                found = true\n                break\n            }\n        }\n        if !found {\n            result[w] = word\n        }\n    }\n\n    return strings.Join(result, \" \")\n}",
    "lineMap": {
      "-": [
        7
      ],
      "insert_root": [
        9,
        10
      ],
      "insert_char": [
        11,
        12
      ],
      "create_node": [
        13,
        14,
        15
      ],
      "mark_end": [
        23
      ],
      "start_replace": [
        26,
        27
      ],
      "process_word": [
        29,
        31,
        32
      ],
      "search_char": [
        33,
        34,
        35,
        38
      ],
      "found_root": [
        39,
        40,
        41,
        42
      ],
      "no_root": [
        45,
        46
      ],
      "append_result": [
        40,
        46
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "char_missing": [
        13
      ],
      "search_miss": [
        35
      ],
      "is_root_end": [
        39
      ],
      "not_found": [
        45
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var replaceWords = function(dictionary, sentence) {\n    // Build Trie using objects\n    var root = {};\n\n    for (var d = 0; d < dictionary.length; d++) {\n        var node = root;\n        for (var c = 0; c < dictionary[d].length; c++) {\n            var ch = dictionary[d][c];\n            // If a shorter root already ends here, skip\n            if (node['$']) break;\n            if (!node[ch]) node[ch] = {};\n            node = node[ch];\n        }\n        node['$'] = true; // Mark end of root\n    }\n\n    var words = sentence.split(\" \");\n    var result = [];\n\n    for (var i = 0; i < words.length; i++) {\n        var node = root;\n        var found = false;\n        for (var j = 0; j < words[i].length; j++) {\n            var ch = words[i][j];\n            if (!node[ch]) break;\n            node = node[ch];\n            if (node['$']) {\n                result.push(words[i].substring(0, j + 1));\n                found = true;\n                break;\n            }\n        }\n        if (!found) result.push(words[i]);\n    }\n\n    return result.join(\" \");\n};",
    "lineMap": {
      "-": [
        3
      ],
      "insert_root": [
        5,
        6
      ],
      "insert_char": [
        7,
        8
      ],
      "create_node": [
        11
      ],
      "mark_end": [
        14
      ],
      "start_replace": [
        17,
        18
      ],
      "process_word": [
        20,
        21,
        22
      ],
      "search_char": [
        23,
        24,
        25,
        26
      ],
      "found_root": [
        27,
        28,
        29,
        30
      ],
      "no_root": [
        33
      ],
      "append_result": [
        28,
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "char_missing": [
        11
      ],
      "search_miss": [
        25
      ],
      "is_root_end": [
        27
      ],
      "not_found": [
        33
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function replaceWords(dictionary: string[], sentence: string): string {\n    // Build Trie using objects\n    const root: Record<string, any> = {};\n\n    for (const dict of dictionary) {\n        let node = root;\n        for (const ch of dict) {\n            // If a shorter root already ends here, skip\n            if (node['$']) break;\n            if (!node[ch]) node[ch] = {};\n            node = node[ch];\n        }\n        node['$'] = true; // Mark end of root\n    }\n\n    const words = sentence.split(\" \");\n    const result: string[] = [];\n\n    for (const word of words) {\n        let node = root;\n        let found = false;\n        for (let j = 0; j < word.length; j++) {\n            const ch = word[j];\n            if (!node[ch]) break;\n            node = node[ch];\n            if (node['$']) {\n                result.push(word.substring(0, j + 1));\n                found = true;\n                break;\n            }\n        }\n        if (!found) result.push(word);\n    }\n\n    return result.join(\" \");\n}",
    "lineMap": {
      "-": [
        3
      ],
      "insert_root": [
        5,
        6
      ],
      "insert_char": [
        7
      ],
      "create_node": [
        10
      ],
      "mark_end": [
        13
      ],
      "start_replace": [
        16,
        17
      ],
      "process_word": [
        19,
        20,
        21
      ],
      "search_char": [
        22,
        23,
        24,
        25
      ],
      "found_root": [
        26,
        27,
        28,
        29
      ],
      "no_root": [
        32
      ],
      "append_result": [
        27,
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "char_missing": [
        10
      ],
      "search_miss": [
        24
      ],
      "is_root_end": [
        26
      ],
      "not_found": [
        32
      ]
    }
  }
};

const ReplaceWordsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "dictionary": [
        "cat",
        "bat",
        "rat"
      ],
      "sentence": "the cattle was rattled by the battery"
    }
  },
  {
    "id": "ex2",
    "label": "Short Roots",
    "value": {
      "dictionary": [
        "a",
        "b",
        "c"
      ],
      "sentence": "aadsfasf absbs bbab cadsfafs"
    }
  },
  {
    "id": "ex3",
    "label": "Overlapping Roots",
    "value": {
      "dictionary": [
        "catt",
        "cat",
        "bat",
        "rat"
      ],
      "sentence": "the cat was rattled by the battery bats"
    }
  }
];

function generateReplaceWordsSteps(e: any): any[] {
  
let t=e.dictionary||[],r=e.sentence||"",n=new StepRecorder({},{});n.add_new_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"}),n.add_new_visual("meta_phase",{type:"metadata",value:"Build Trie"}),n.add_new_visual("meta_current_word",{type:"metadata",value:""}),n.add_new_visual("meta_result",{type:"metadata",value:""}),n.record("-","Start: Build trie from dictionary, then replace words in sentence");let i=new Map;i.set("","trie_root");let s=0;function a(){i.forEach(e=>{let t=n.get_visual(e);t&&"trieNode"===t.type&&n.update_visual(e,{...t,state:"standard"})})}for(let e=0;e<t.length;e++){let r=t[e];a(),n.update_visual("meta_current_word",{type:"metadata",value:r}),n.record("insert_root",`Insert root "${r}" into trie`);let o="",d="trie_root",l=n.get_visual("trie_root");n.update_visual("trie_root",{...l,state:"active"});for(let e=0;e<r.length;e++){let t=r[e],a=o+t,l=i.has(a);if(n.add_conditional("char_missing",!l),n.record("insert_char",`Process character '${t}' of root "${r}"`),l){let e=i.get(a),t=n.get_visual(d);n.update_visual(d,{...t,state:"visited"});let r=n.get_visual(e);n.update_visual(e,{...r,state:"active"}),d=e}else{s++;let e=`trie_${s}`;n.add_new_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:d,edgeLabel:t,state:"highlight"}),i.set(a,e);let r=n.get_visual(d);n.update_visual(d,{...r,state:"visited"}),n.record("create_node",`Create new node for '${t}'`),n.update_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:d,edgeLabel:t,state:"active"}),d=e}o=a;let c=n.get_visual(d);if(c&&c.isEndOfWord)break}let c=n.get_visual(d);n.update_visual(d,{...c,type:"trieNode",isEndOfWord:!0,state:"active"}),n.record("mark_end",`Mark end of root "${r}"`)}a(),n.update_visual("meta_phase",{type:"metadata",value:"Replace Words"}),n.update_visual("meta_current_word",{type:"metadata",value:""}),n.record("start_replace","Trie built. Now replace words in sentence using shortest roots.");let d=r.split(" "),l=[];for(let e=0;e<d.length;e++){let t=d[e];a(),n.update_visual("meta_current_word",{type:"metadata",value:t}),n.record("process_word",`Process word "${t}"`);let r="",o="trie_root",s=!1,c="",u=n.get_visual("trie_root");n.update_visual("trie_root",{...u,state:"active"});for(let e=0;e<t.length;e++){let a=t[e],d=r+a,l=i.has(d);if(n.add_conditional("search_miss",!l),!l){n.record("search_char",`Character '${a}' not found in trie, keep original word`);break}let u=i.get(d),p=n.get_visual(o);n.update_visual(o,{...p,state:"visited"});let h=n.get_visual(u);n.update_visual(u,{...h,state:"active"}),o=u,r=d;let f=n.get_visual(u).isEndOfWord;if(n.add_conditional("is_root_end",f),n.record("search_char",`Match '${a}' in trie${f?" - found root end!":""}`),f){c=t.substring(0,e+1),s=!0,n.record("found_root",`Found root "${c}" for word "${t}"`);break}}s?l.push(c):(l.push(t),n.add_conditional("not_found",!0),n.record("no_root",`No root found for "${t}", keep original`)),n.update_visual("meta_result",{type:"metadata",value:l.join(" ")}),n.record("append_result",`Result so far: "${l.join(" ")}"`)}return a(),n.update_visual("meta_current_word",{type:"metadata",value:""}),n.update_visual("meta_phase",{type:"metadata",value:"Complete"}),n.record("complete",`Done! Result: "${l.join(" ")}"`),n.getSteps()
}

export function ReplaceWordsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReplaceWordsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReplaceWordsSteps(e) as any[];
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
      title="Replace Words"
      slug="replace-words"
      approaches={approaches}
      presets={ReplaceWordsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Stream of Characters (stream-of-characters)
// ==========================================

const StreamOfCharactersTemplates = {
  "python": {
    "language": "python",
    "code": "class StreamChecker:\n    def __init__(self, words: list[str]):\n        self.trie = {}\n        self.stream = []\n        self.max_len = 0\n\n        # Insert each word reversed into the Trie\n        for word in words:\n            self.max_len = max(self.max_len, len(word))\n            node = self.trie\n            for ch in reversed(word):\n                if ch not in node:\n                    node[ch] = {}\n                node = node[ch]\n            node['#'] = True  # Mark word end\n\n    def query(self, letter: str) -> bool:\n        self.stream.append(letter)\n        node = self.trie\n        # Walk backward through stream, forward through Trie\n        start = max(0, len(self.stream) - self.max_len)\n        for i in range(len(self.stream) - 1, start - 1, -1):\n            ch = self.stream[i]\n            if ch not in node:\n                return False\n            node = node[ch]\n            if '#' in node:\n                return True\n        return False",
    "lineMap": {
      "-": [
        2,
        3,
        4,
        5
      ],
      "insert_word": [
        8,
        9,
        10
      ],
      "insert_char_reversed": [
        11
      ],
      "create_node": [
        12,
        13,
        14
      ],
      "traverse_node": [
        14
      ],
      "mark_end": [
        15
      ],
      "start_query": [
        17,
        18
      ],
      "walk_backward": [
        19,
        21,
        22
      ],
      "check_char": [
        23
      ],
      "no_match": [
        24,
        25
      ],
      "match_char": [
        26
      ],
      "found_word": [
        27,
        28
      ],
      "not_found": [
        29
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "char_missing": [
        12
      ],
      "stream_char_missing": [
        24
      ],
      "is_end": [
        27
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class StreamChecker {\n    int[][] trie;\n    boolean[] isEnd;\n    int trieIdx;\n    List<Character> stream;\n    int maxLen;\n\n    public StreamChecker(String[] words) {\n        // Max nodes = total chars across all words + 1 for root\n        trie = new int[400001][26];\n        isEnd = new boolean[400001];\n        trieIdx = 0;\n        stream = new ArrayList<>();\n        maxLen = 0;\n\n        // Insert each word reversed into the Trie\n        for (String word : words) {\n            maxLen = Math.max(maxLen, word.length());\n            int node = 0;\n            for (int i = word.length() - 1; i >= 0; i--) {\n                int c = word.charAt(i) - 'a';\n                if (trie[node][c] == 0) {\n                    trie[node][c] = ++trieIdx;\n                }\n                node = trie[node][c];\n            }\n            isEnd[node] = true;\n        }\n    }\n\n    public boolean query(char letter) {\n        stream.add(letter);\n        int node = 0;\n        // Walk backward through stream, forward through Trie\n        int start = Math.max(0, stream.size() - maxLen);\n        for (int i = stream.size() - 1; i >= start; i--) {\n            int c = stream.get(i) - 'a';\n            if (trie[node][c] == 0) return false;\n            node = trie[node][c];\n            if (isEnd[node]) return true;\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        8,
        10,
        11,
        12,
        13,
        14
      ],
      "insert_word": [
        17,
        18,
        19
      ],
      "insert_char_reversed": [
        20,
        21
      ],
      "create_node": [
        22,
        23,
        24,
        25
      ],
      "traverse_node": [
        25
      ],
      "mark_end": [
        27
      ],
      "start_query": [
        31,
        32
      ],
      "walk_backward": [
        33,
        35,
        36
      ],
      "check_char": [
        37
      ],
      "no_match": [
        38
      ],
      "match_char": [
        39
      ],
      "found_word": [
        40
      ],
      "not_found": [
        42
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "char_missing": [
        22
      ],
      "stream_char_missing": [
        38
      ],
      "is_end": [
        40
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class StreamChecker {\n    int trie[400001][26];\n    bool isEnd[400001];\n    int trieIdx;\n    vector<char> stream;\n    int maxLen;\n\npublic:\n    StreamChecker(vector<string>& words) {\n        memset(trie, 0, sizeof(trie));\n        memset(isEnd, false, sizeof(isEnd));\n        trieIdx = 0;\n        maxLen = 0;\n\n        // Insert each word reversed into the Trie\n        for (const string& word : words) {\n            maxLen = max(maxLen, (int)word.size());\n            int node = 0;\n            for (int i = word.size() - 1; i >= 0; i--) {\n                int c = word[i] - 'a';\n                if (trie[node][c] == 0) {\n                    trie[node][c] = ++trieIdx;\n                }\n                node = trie[node][c];\n            }\n            isEnd[node] = true;\n        }\n    }\n\n    bool query(char letter) {\n        stream.push_back(letter);\n        int node = 0;\n        // Walk backward through stream, forward through Trie\n        int start = max(0, (int)stream.size() - maxLen);\n        for (int i = stream.size() - 1; i >= start; i--) {\n            int c = stream[i] - 'a';\n            if (trie[node][c] == 0) return false;\n            node = trie[node][c];\n            if (isEnd[node]) return true;\n        }\n        return false;\n    }\n};",
    "lineMap": {
      "-": [
        9,
        10,
        11,
        12,
        13
      ],
      "insert_word": [
        16,
        17,
        18
      ],
      "insert_char_reversed": [
        19,
        20
      ],
      "create_node": [
        21,
        22,
        23,
        24
      ],
      "traverse_node": [
        24
      ],
      "mark_end": [
        26
      ],
      "start_query": [
        30,
        31
      ],
      "walk_backward": [
        32,
        34,
        35
      ],
      "check_char": [
        36
      ],
      "no_match": [
        37
      ],
      "match_char": [
        38
      ],
      "found_word": [
        39
      ],
      "not_found": [
        41
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "char_missing": [
        21
      ],
      "stream_char_missing": [
        37
      ],
      "is_end": [
        39
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class StreamChecker {\n    int[][] trie;\n    bool[] isEnd;\n    int trieIdx;\n    List<char> stream;\n    int maxLen;\n\n    public StreamChecker(string[] words) {\n        trie = new int[400001][];\n        for (int i = 0; i < 400001; i++) trie[i] = new int[26];\n        isEnd = new bool[400001];\n        trieIdx = 0;\n        stream = new List<char>();\n        maxLen = 0;\n\n        // Insert each word reversed into the Trie\n        foreach (string word in words) {\n            maxLen = Math.Max(maxLen, word.Length);\n            int node = 0;\n            for (int i = word.Length - 1; i >= 0; i--) {\n                int c = word[i] - 'a';\n                if (trie[node][c] == 0) {\n                    trie[node][c] = ++trieIdx;\n                }\n                node = trie[node][c];\n            }\n            isEnd[node] = true;\n        }\n    }\n\n    public bool Query(char letter) {\n        stream.Add(letter);\n        int node = 0;\n        // Walk backward through stream, forward through Trie\n        int start = Math.Max(0, stream.Count - maxLen);\n        for (int i = stream.Count - 1; i >= start; i--) {\n            int c = stream[i] - 'a';\n            if (trie[node][c] == 0) return false;\n            node = trie[node][c];\n            if (isEnd[node]) return true;\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        8,
        9,
        11,
        12,
        13,
        14
      ],
      "insert_word": [
        17,
        18,
        19
      ],
      "insert_char_reversed": [
        20,
        21
      ],
      "create_node": [
        22,
        23,
        24,
        25
      ],
      "traverse_node": [
        25
      ],
      "mark_end": [
        27
      ],
      "start_query": [
        31,
        32
      ],
      "walk_backward": [
        33,
        35,
        36
      ],
      "check_char": [
        37
      ],
      "no_match": [
        38
      ],
      "match_char": [
        39
      ],
      "found_word": [
        40
      ],
      "not_found": [
        42
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "char_missing": [
        22
      ],
      "stream_char_missing": [
        38
      ],
      "is_end": [
        40
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type TrieNode struct {\n    children [26]*TrieNode\n    isEnd    bool\n}\n\ntype StreamChecker struct {\n    root   *TrieNode\n    stream []byte\n    maxLen int\n}\n\nfunc Constructor(words []string) StreamChecker {\n    root := &TrieNode{}\n    maxLen := 0\n\n    // Insert each word reversed into the Trie\n    for _, word := range words {\n        if len(word) > maxLen {\n            maxLen = len(word)\n        }\n        node := root\n        for i := len(word) - 1; i >= 0; i-- {\n            c := word[i] - 'a'\n            if node.children[c] == nil {\n                node.children[c] = &TrieNode{}\n            }\n            node = node.children[c]\n        }\n        node.isEnd = true\n    }\n\n    return StreamChecker{root: root, stream: []byte{}, maxLen: maxLen}\n}\n\nfunc (sc *StreamChecker) Query(letter byte) bool {\n    sc.stream = append(sc.stream, letter)\n    node := sc.root\n    // Walk backward through stream, forward through Trie\n    start := len(sc.stream) - sc.maxLen\n    if start < 0 {\n        start = 0\n    }\n    for i := len(sc.stream) - 1; i >= start; i-- {\n        c := sc.stream[i] - 'a'\n        if node.children[c] == nil {\n            return false\n        }\n        node = node.children[c]\n        if node.isEnd {\n            return true\n        }\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        12,
        13,
        14
      ],
      "insert_word": [
        17,
        21
      ],
      "insert_char_reversed": [
        22,
        23
      ],
      "create_node": [
        24,
        25,
        26,
        27
      ],
      "traverse_node": [
        27
      ],
      "mark_end": [
        29
      ],
      "start_query": [
        35,
        36
      ],
      "walk_backward": [
        37,
        39,
        43
      ],
      "check_char": [
        44
      ],
      "no_match": [
        45,
        46
      ],
      "match_char": [
        48
      ],
      "found_word": [
        49,
        50
      ],
      "not_found": [
        53
      ],
      "complete": [
        53
      ]
    },
    "conditionalMap": {
      "char_missing": [
        24
      ],
      "stream_char_missing": [
        45
      ],
      "is_end": [
        49
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var StreamChecker = function (words) {\n  // Trie node: children map + isEnd flag\n  this.root = {};\n  this.stream = [];\n  this.maxLen = 0;\n\n  // Insert each word reversed into the Trie\n  for (const word of words) {\n    this.maxLen = Math.max(this.maxLen, word.length);\n    let node = this.root;\n    for (let i = word.length - 1; i >= 0; i--) {\n      const ch = word[i];\n      if (!node[ch]) node[ch] = {};\n      node = node[ch];\n    }\n    node[\"#\"] = true; // Mark word end\n  }\n};\n\nStreamChecker.prototype.query = function (letter) {\n  this.stream.push(letter);\n  let node = this.root;\n  // Walk backward through stream, forward through Trie\n  const start = Math.max(0, this.stream.length - this.maxLen);\n  for (let i = this.stream.length - 1; i >= start; i--) {\n    const ch = this.stream[i];\n    if (!node[ch]) return false;\n    node = node[ch];\n    if (node[\"#\"]) return true;\n  }\n  return false;\n};",
    "lineMap": {
      "-": [
        1,
        3,
        4,
        5
      ],
      "insert_word": [
        8,
        9,
        10
      ],
      "insert_char_reversed": [
        11,
        12
      ],
      "create_node": [
        13,
        14
      ],
      "traverse_node": [
        14
      ],
      "mark_end": [
        16
      ],
      "start_query": [
        20,
        21
      ],
      "walk_backward": [
        22,
        24,
        25
      ],
      "check_char": [
        26
      ],
      "no_match": [
        27
      ],
      "match_char": [
        28
      ],
      "found_word": [
        29
      ],
      "not_found": [
        31
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "char_missing": [
        13
      ],
      "stream_char_missing": [
        27
      ],
      "is_end": [
        29
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class StreamChecker {\n    root: Record<string, any>;\n    stream: string[];\n    maxLen: number;\n\n    constructor(words: string[]) {\n        this.root = {};\n        this.stream = [];\n        this.maxLen = 0;\n\n        // Insert each word reversed into the Trie\n        for (const word of words) {\n            this.maxLen = Math.max(this.maxLen, word.length);\n            let node = this.root;\n            for (let i = word.length - 1; i >= 0; i--) {\n                const ch = word[i];\n                if (!node[ch]) node[ch] = {};\n                node = node[ch];\n            }\n            node[\"#\"] = true; // Mark word end\n        }\n    }\n\n    query(letter: string): boolean {\n        this.stream.push(letter);\n        let node = this.root;\n        // Walk backward through stream, forward through Trie\n        const start = Math.max(0, this.stream.length - this.maxLen);\n        for (let i = this.stream.length - 1; i >= start; i--) {\n            const ch = this.stream[i];\n            if (!node[ch]) return false;\n            node = node[ch];\n            if (node[\"#\"]) return true;\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9
      ],
      "insert_word": [
        12,
        13,
        14
      ],
      "insert_char_reversed": [
        15,
        16
      ],
      "create_node": [
        17,
        18
      ],
      "traverse_node": [
        18
      ],
      "mark_end": [
        20
      ],
      "start_query": [
        24,
        25
      ],
      "walk_backward": [
        26,
        28,
        29
      ],
      "check_char": [
        30
      ],
      "no_match": [
        31
      ],
      "match_char": [
        32
      ],
      "found_word": [
        33
      ],
      "not_found": [
        35
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "char_missing": [
        17
      ],
      "stream_char_missing": [
        31
      ],
      "is_end": [
        33
      ]
    }
  }
};

const StreamOfCharactersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "words": [
        "cd",
        "f",
        "kl"
      ],
      "queries": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "words": [
        "ab",
        "ba"
      ],
      "queries": [
        "a",
        "b",
        "a",
        "b"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "words": [
        "xyz",
        "yz"
      ],
      "queries": [
        "x",
        "y",
        "z"
      ]
    }
  }
];

function generateStreamOfCharactersSteps(e: any): any[] {
  
let t=e.words||[],r=e.queries||[],s=new StepRecorder({},{});s.add_new_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"}),s.record("-","Start: Build reversed trie from words, then process stream queries");let n=new Map;n.set("","trie_root");let i=0,o=0;for(let e=0;e<t.length;e++){let r=t[e];o=Math.max(o,r.length),s.add_new_visual("meta_phase",{type:"metadata",value:`Insert "${r}" (reversed)`}),s.record("insert_word",`Insert word "${r}" reversed into trie`);let a="",l="trie_root";n.forEach(e=>{let t=s.get_visual(e);t&&"trieNode"===t.type&&s.update_visual(e,{...t,state:"standard"})});let d=s.get_visual("trie_root");s.update_visual("trie_root",{...d,state:"active"});for(let e=r.length-1;e>=0;e--){let t=r[e],o=a+t,d=n.has(o);if(s.add_new_visual("meta_char",{type:"metadata",value:`'${t}' (index ${e} of "${r}")`}),s.record("insert_char_reversed",`Process character '${t}' from "${r}" (reversed index ${r.length-1-e})`),d){let e=n.get(o),r=s.get_visual(l);s.update_visual(l,{...r,state:"visited"});let a=s.get_visual(e);s.update_visual(e,{...a,state:"active"}),s.add_conditional("char_missing",!1),s.record("traverse_node",`Node for '${t}' already exists, traverse to it`),l=e}else{i++;let e=`trie_${i}`;s.add_new_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:l,edgeLabel:t,state:"highlight"}),n.set(o,e);let r=s.get_visual(l);s.update_visual(l,{...r,state:"visited"}),s.add_conditional("char_missing",!0),s.record("create_node",`Create new node for '${t}'`),s.update_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:l,edgeLabel:t,state:"active"}),l=e}a=o}let c=s.get_visual(l);s.update_visual(l,{...c,isEndOfWord:!0,state:"active"}),s.record("mark_end",`Mark end of reversed word "${r}" (trie path: "${r.split("").reverse().join("")}")`)}n.forEach(e=>{let t=s.get_visual(e);t&&"trieNode"===t.type&&s.update_visual(e,{...t,state:"standard"})}),s.delete_visual("meta_phase"),s.delete_visual("meta_char");let l=[];for(let e=0;e<r.length;e++){let t=r[e];l.push(t),n.forEach(e=>{let t=s.get_visual(e);t&&"trieNode"===t.type&&s.update_visual(e,{...t,state:"standard"})});for(let e=0;e<l.length;e++)s.add_new_visual(`bar_${e}`,{type:"arrayElement",value:l[e],position:e,state:e===l.length-1?"highlight":"standard"});s.add_new_visual("meta_query",{type:"metadata",value:`query('${t}')`}),s.add_new_visual("meta_result",{type:"metadata",value:"?"}),s.record("start_query",`query('${t}'): stream is now [${l.join(", ")}]`);let a="trie_root",i=s.get_visual("trie_root");s.update_visual("trie_root",{...i,state:"active"});let d=Math.max(0,l.length-o),c=!1,u=!1;s.record("walk_backward",`Walk backward from index ${l.length-1}${d>0?` to ${d}`:""}`);for(let e=l.length-1;e>=d;e--){let r=l[e];for(let t=0;t<l.length;t++)s.update_visual(`bar_${t}`,{type:"arrayElement",value:l[t],position:t,state:t===e?"highlight":t>e?"active":"standard"});s.record("check_char",`Check stream[${e}] = '${r}' in trie`);let i=null;for(let[e,t]of n.entries()){let e=s.get_visual(t);if(e&&"trieNode"===e.type&&e.parent===a&&e.char===r){i=t;break}}if(null===i){s.add_conditional("stream_char_missing",!0);let e=s.get_visual(a);s.update_visual(a,{...e,state:"standard"}),s.update_visual("meta_result",{type:"metadata",value:"false"}),s.record("no_match",`No child '${r}' found in trie - no match`),u=!0;break}s.add_conditional("stream_char_missing",!1);let o=s.get_visual(a);s.update_visual(a,{...o,state:"visited"});let d=s.get_visual(i);s.update_visual(i,{...d,state:"active"}),s.record("match_char",`Found '${r}' in trie, traverse to child`),a=i;let h=s.get_visual(a);if(s.add_conditional("is_end",h.isEndOfWord),h.isEndOfWord){s.update_visual(a,{...h,state:"active"});for(let t=0;t<l.length;t++)s.update_visual(`bar_${t}`,{type:"arrayElement",value:l[t],position:t,state:t>=e&&t<=l.length-1?"active":"standard"});s.update_visual("meta_result",{type:"metadata",value:"true"}),s.record("found_word",`End of word found! query('${t}') = true`),c=!0;break}}c||u||(s.update_visual("meta_result",{type:"metadata",value:"false"}),s.record("not_found",`No complete word found, query('${t}') = false`))}return s.delete_visual("meta_query"),s.delete_visual("meta_result"),s.record("complete","All queries processed"),s.getSteps()
}

export function StreamOfCharactersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: StreamOfCharactersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateStreamOfCharactersSteps(e) as any[];
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
      title="Stream of Characters"
      slug="stream-of-characters"
      approaches={approaches}
      presets={StreamOfCharactersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Sub-Folders from the Filesystem (remove-sub-folders-from-the-filesystem)
// ==========================================

const RemoveSubFoldersFromTheFilesystemTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def removeSubfolders(self, folder: list[str]) -> list[str]:\n        # Build trie using nested dicts\n        # A special key \"\" marks end-of-folder\n        root = {}\n\n        for path in folder:\n            parts = path.split(\"/\")\n            node = root\n            for i in range(1, len(parts)):\n                if parts[i] not in node:\n                    node[parts[i]] = {}\n                node = node[parts[i]]\n            node[\"\"] = None  # Mark end of folder\n\n        # DFS to collect root folders\n        result = []\n        self._dfs(root, [], result)\n        return result\n\n    def _dfs(self, node, path_parts, result):\n        if \"\" in node:\n            # This node is end-of-folder, collect and stop\n            result.append(\"/\" + \"/\".join(path_parts))\n            return\n        for key in node:\n            path_parts.append(key)\n            self._dfs(node[key], path_parts, result)\n            path_parts.pop()  # Backtrack",
    "lineMap": {
      "-": [
        2,
        5
      ],
      "insert_folder": [
        7,
        8,
        9
      ],
      "insert_component": [
        10,
        11
      ],
      "create_node": [
        11,
        12,
        13
      ],
      "traverse_node": [
        13
      ],
      "mark_end": [
        14
      ],
      "start_dfs": [
        17,
        18
      ],
      "visit_node": [
        21
      ],
      "is_folder_end": [
        22
      ],
      "collect_folder": [
        24,
        25
      ],
      "explore_child": [
        26,
        27,
        28
      ],
      "backtrack": [
        29
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_exists": [
        11
      ],
      "is_end_of_folder": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<String> removeSubfolders(String[] folder) {\n        // Build trie using nested HashMaps\n        // A special key \"\" marks end-of-folder\n        Map<String, Object> root = new HashMap<>();\n\n        for (String path : folder) {\n            String[] parts = path.split(\"/\");\n            Map<String, Object> node = root;\n            for (int i = 1; i < parts.length; i++) {\n                node.putIfAbsent(parts[i], new HashMap<>());\n                node = (Map<String, Object>) node.get(parts[i]);\n            }\n            node.put(\"\", null); // Mark end of folder\n        }\n\n        // DFS to collect root folders\n        List<String> result = new ArrayList<>();\n        dfs(root, new StringBuilder(), result);\n        return result;\n    }\n\n    private void dfs(Map<String, Object> node, StringBuilder path, List<String> result) {\n        if (node.containsKey(\"\")) {\n            // This node is an end-of-folder, collect it and stop\n            result.add(path.toString());\n            return;\n        }\n        for (String key : node.keySet()) {\n            path.append(\"/\").append(key);\n            dfs((Map<String, Object>) node.get(key), path, result);\n            // Backtrack: remove the appended \"/<key>\"\n            path.setLength(path.length() - key.length() - 1);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2,
        5
      ],
      "insert_folder": [
        7,
        8,
        9
      ],
      "insert_component": [
        10,
        11
      ],
      "create_node": [
        11,
        12
      ],
      "traverse_node": [
        12
      ],
      "mark_end": [
        14
      ],
      "start_dfs": [
        18,
        19
      ],
      "visit_node": [
        23
      ],
      "is_folder_end": [
        24
      ],
      "collect_folder": [
        26,
        27
      ],
      "explore_child": [
        29,
        30,
        31
      ],
      "backtrack": [
        33
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_exists": [
        11
      ],
      "is_end_of_folder": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    struct TrieNode {\n        unordered_map<string, TrieNode*> children;\n        bool isEnd = false;\n    };\n\n    vector<string> removeSubfolders(vector<string>& folder) {\n        TrieNode* root = new TrieNode();\n\n        // Build trie from folder paths\n        for (auto& path : folder) {\n            TrieNode* node = root;\n            string component;\n            // Split by '/' and insert components\n            for (int i = 1; i < path.size(); i++) {\n                if (path[i] == '/') {\n                    if (!node->children.count(component)) {\n                        node->children[component] = new TrieNode();\n                    }\n                    node = node->children[component];\n                    component.clear();\n                } else {\n                    component += path[i];\n                }\n            }\n            if (!node->children.count(component)) {\n                node->children[component] = new TrieNode();\n            }\n            node = node->children[component];\n            node->isEnd = true;\n        }\n\n        // DFS to collect root folders\n        vector<string> result;\n        string currentPath;\n        dfs(root, currentPath, result);\n        return result;\n    }\n\nprivate:\n    void dfs(TrieNode* node, string& path, vector<string>& result) {\n        if (node->isEnd) {\n            result.push_back(path);\n            return;\n        }\n        for (auto& [key, child] : node->children) {\n            path += \"/\" + key;\n            dfs(child, path, result);\n            path.erase(path.size() - key.size() - 1);\n        }\n    }\n};",
    "lineMap": {
      "-": [
        8,
        9
      ],
      "insert_folder": [
        12,
        13,
        14
      ],
      "insert_component": [
        16,
        17,
        18
      ],
      "create_node": [
        18,
        19,
        20,
        21
      ],
      "traverse_node": [
        21
      ],
      "mark_end": [
        30,
        31
      ],
      "start_dfs": [
        35,
        36,
        37
      ],
      "visit_node": [
        42
      ],
      "is_folder_end": [
        43
      ],
      "collect_folder": [
        44,
        45
      ],
      "explore_child": [
        47,
        48,
        49
      ],
      "backtrack": [
        50
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "check_exists": [
        18
      ],
      "is_end_of_folder": [
        43
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private class TrieNode {\n        public Dictionary<string, TrieNode> Children = new Dictionary<string, TrieNode>();\n        public bool IsEnd = false;\n    }\n\n    public IList<string> RemoveSubfolders(string[] folder) {\n        var root = new TrieNode();\n\n        // Build trie from folder paths\n        foreach (var path in folder) {\n            var parts = path.Split('/');\n            var node = root;\n            for (int i = 1; i < parts.Length; i++) {\n                if (!node.Children.ContainsKey(parts[i])) {\n                    node.Children[parts[i]] = new TrieNode();\n                }\n                node = node.Children[parts[i]];\n            }\n            node.IsEnd = true;\n        }\n\n        // DFS to collect root folders\n        var result = new List<string>();\n        var currentPath = new List<string>();\n        Dfs(root, currentPath, result);\n        return result;\n    }\n\n    private void Dfs(TrieNode node, List<string> pathParts, IList<string> result) {\n        if (node.IsEnd) {\n            // Collect this folder and stop descending\n            result.Add(\"/\" + string.Join(\"/\", pathParts));\n            return;\n        }\n        foreach (var kvp in node.Children) {\n            pathParts.Add(kvp.Key);\n            Dfs(kvp.Value, pathParts, result);\n            pathParts.RemoveAt(pathParts.Count - 1);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        7,
        8
      ],
      "insert_folder": [
        11,
        12,
        13
      ],
      "insert_component": [
        14,
        15
      ],
      "create_node": [
        15,
        16,
        17,
        18
      ],
      "traverse_node": [
        18
      ],
      "mark_end": [
        20
      ],
      "start_dfs": [
        24,
        25,
        26
      ],
      "visit_node": [
        30
      ],
      "is_folder_end": [
        31
      ],
      "collect_folder": [
        33,
        34
      ],
      "explore_child": [
        36,
        37,
        38
      ],
      "backtrack": [
        39
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_exists": [
        15
      ],
      "is_end_of_folder": [
        31
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type trieNode struct {\n    children map[string]*trieNode\n    isEnd    bool\n}\n\nfunc removeSubfolders(folder []string) []string {\n    root := &trieNode{children: make(map[string]*trieNode)}\n\n    // Build trie from folder paths\n    for _, path := range folder {\n        parts := strings.Split(path, \"/\")\n        node := root\n        for i := 1; i < len(parts); i++ {\n            if _, ok := node.children[parts[i]]; !ok {\n                node.children[parts[i]] = &trieNode{children: make(map[string]*trieNode)}\n            }\n            node = node.children[parts[i]]\n        }\n        node.isEnd = true\n    }\n\n    // DFS to collect root folders\n    var result []string\n    var dfs func(node *trieNode, pathParts []string)\n    dfs = func(node *trieNode, pathParts []string) {\n        if node.isEnd {\n            result = append(result, \"/\"+strings.Join(pathParts, \"/\"))\n            return\n        }\n        for key, child := range node.children {\n            dfs(child, append(pathParts, key))\n        }\n    }\n    dfs(root, []string{})\n    return result\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "insert_folder": [
        10,
        11,
        12
      ],
      "insert_component": [
        13,
        14
      ],
      "create_node": [
        14,
        15,
        16,
        17
      ],
      "traverse_node": [
        17
      ],
      "mark_end": [
        19
      ],
      "start_dfs": [
        34
      ],
      "visit_node": [
        25
      ],
      "is_folder_end": [
        26
      ],
      "collect_folder": [
        27,
        28
      ],
      "explore_child": [
        30,
        31
      ],
      "backtrack": [
        30
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "check_exists": [
        14
      ],
      "is_end_of_folder": [
        26
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var removeSubfolders = function(folder) {\n    // Build trie using nested objects\n    var root = {};\n\n    for (var path of folder) {\n        var parts = path.split(\"/\");\n        var node = root;\n        for (var i = 1; i < parts.length; i++) {\n            if (!node[parts[i]]) {\n                node[parts[i]] = {};\n            }\n            node = node[parts[i]];\n        }\n        node[\"#\"] = true; // Mark end of folder\n    }\n\n    // DFS to collect root folders\n    var result = [];\n    var dfs = function(node, pathParts) {\n        if (node[\"#\"]) {\n            result.push(\"/\" + pathParts.join(\"/\"));\n            return;\n        }\n        for (var key in node) {\n            if (key === \"#\") continue;\n            pathParts.push(key);\n            dfs(node[key], pathParts);\n            pathParts.pop();\n        }\n    };\n    dfs(root, []);\n    return result;\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "insert_folder": [
        5,
        6,
        7
      ],
      "insert_component": [
        8,
        9
      ],
      "create_node": [
        9,
        10,
        11,
        12
      ],
      "traverse_node": [
        12
      ],
      "mark_end": [
        14
      ],
      "start_dfs": [
        31
      ],
      "visit_node": [
        19
      ],
      "is_folder_end": [
        20
      ],
      "collect_folder": [
        21,
        22
      ],
      "explore_child": [
        24,
        25,
        26,
        27
      ],
      "backtrack": [
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "check_exists": [
        9
      ],
      "is_end_of_folder": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeSubfolders(folder: string[]): string[] {\n    // Build trie using nested Maps\n    const root: Map<string, any> = new Map();\n\n    for (const path of folder) {\n        const parts = path.split(\"/\");\n        let node = root;\n        for (let i = 1; i < parts.length; i++) {\n            if (!node.has(parts[i])) {\n                node.set(parts[i], new Map());\n            }\n            node = node.get(parts[i])!;\n        }\n        node.set(\"#\", null); // Mark end of folder\n    }\n\n    // DFS to collect root folders\n    const result: string[] = [];\n    const dfs = (node: Map<string, any>, pathParts: string[]) => {\n        if (node.has(\"#\")) {\n            result.push(\"/\" + pathParts.join(\"/\"));\n            return;\n        }\n        for (const [key, child] of node) {\n            if (key === \"#\") continue;\n            pathParts.push(key);\n            dfs(child, pathParts);\n            pathParts.pop();\n        }\n    };\n    dfs(root, []);\n    return result;\n}",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "insert_folder": [
        5,
        6,
        7
      ],
      "insert_component": [
        8,
        9
      ],
      "create_node": [
        9,
        10,
        11,
        12
      ],
      "traverse_node": [
        12
      ],
      "mark_end": [
        14
      ],
      "start_dfs": [
        31
      ],
      "visit_node": [
        19
      ],
      "is_folder_end": [
        20
      ],
      "collect_folder": [
        21,
        22
      ],
      "explore_child": [
        24,
        25,
        26,
        27
      ],
      "backtrack": [
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "check_exists": [
        9
      ],
      "is_end_of_folder": [
        20
      ]
    }
  }
};

const RemoveSubFoldersFromTheFilesystemPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "folder": [
        "/a",
        "/a/b",
        "/c/d",
        "/c/d/e",
        "/c/f"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Single Root",
    "value": {
      "folder": [
        "/a",
        "/a/b/c",
        "/a/b/d"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No Sub-Folders",
    "value": {
      "folder": [
        "/a/b/c",
        "/a/b/ca",
        "/a/b/d",
        "/a/b/cd"
      ]
    }
  }
];

function generateRemoveSubFoldersFromTheFilesystemSteps(e: any): any[] {
  
let t=e.folder||[],r=new RecursiveStepRecorder({},{});r.add_new_visual("trie_root",{type:"trieNode",char:"/",isEndOfWord:!1,state:"standard"}),r.add_new_global_variable("result",[]),r.add_new_global_variable("currentPath",""),r.record("-","Start: Build a path-component trie from folder paths, then DFS to collect root folders");let l=0,i=new Map;i.set("","trie_root");let a=new Map;a.set("trie_root",{char:"/",isEndOfWord:!1,parent:"",edgeLabel:""});for(let e=0;e<t.length;e++){let o=t[e],s=o.split("/").filter(e=>e.length>0);r.pushCallFrame({path:o},"insert"),r.update_global_variable("currentPath",o),r.record("insert_folder",`Insert folder "${o}" into trie`);let n="",d="trie_root";r.update_visual("trie_root",{type:"trieNode",char:"/",isEndOfWord:a.get("trie_root").isEndOfWord,state:"active"});for(let e=0;e<s.length;e++){let t=s[e],o=n+"/"+t,c=i.has(o);if(r.add_conditional("check_exists",!c),r.record("insert_component",`Process component "${t}" ${c?"(exists)":"(new)"}`),c){let e=i.get(o),l=r.get_visual(d);r.update_visual(d,{...l,state:"visited"});let a=r.get_visual(e);r.update_visual(e,{...a,state:"active"}),r.record("traverse_node",`Component "${t}" exists, descend into it`),d=e}else{l++;let e=`trie_${l}`;r.add_new_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:d,edgeLabel:t,state:"highlight"}),i.set(o,e),a.set(e,{char:t,isEndOfWord:!1,parent:d,edgeLabel:t});let s=r.get_visual(d);r.update_visual(d,{...s,state:"visited"}),r.record("create_node",`Create new node for "${t}"`),r.update_visual(e,{type:"trieNode",char:t,isEndOfWord:!1,parent:d,edgeLabel:t,state:"active"}),d=e}n=o}let c=a.get(d);c.isEndOfWord=!0,r.update_visual(d,{type:"trieNode",char:c.char,isEndOfWord:!0,parent:c.parent||void 0,edgeLabel:c.edgeLabel||void 0,state:"active"}),r.record("mark_end",`Mark "${o}" as end-of-folder`),r.popCallFrame(),i.forEach(e=>{let t=r.get_visual(e);t&&"trieNode"===t.type&&r.update_visual(e,{...t,state:"standard"})})}r.update_global_variable("currentPath",""),r.record("start_dfs","Start DFS to collect root folders (stop at end-of-folder markers)");let s=[];return!function e(t,o){let l=r.get_visual(t);if(!l||"trieNode"!==l.type)return;r.pushCallFrame({path:o||"/"},"dfs"),r.update_visual(t,{...l,state:"active"}),r.update_global_variable("currentPath",o||"/"),r.record("visit_node",`Visit node "${l.char}" (path: ${o||"/"})`);let a=l.isEndOfWord;if(r.add_conditional("is_end_of_folder",a),r.record("is_folder_end",`Check if "${o||"/"}" is a complete folder path: ${a?"Yes":"No"}`),a){s.push(o),r.update_global_variable("result",[...s]),r.update_visual(t,{...r.get_visual(t),state:"visited"}),r.record("collect_folder",`Collect folder "${o}" - stop recursion (sub-folders excluded)`),r.popCallFrame();return}let n=[];for(let a of(i.forEach((e,o)=>{let l=r.get_visual(e);l&&l.parent===t&&n.push({key:e,component:l.char,childPath:o})}),n)){let i=o+"/"+a.component;r.record("explore_child",`Explore child "${a.component}" (path: ${i})`),e(a.key,i),r.update_visual(t,{...r.get_visual(t),state:"active"}),r.record("backtrack",`Backtrack to "${l.char}" (path: ${o||"/"})`)}r.update_visual(t,{...r.get_visual(t),state:"visited"}),r.popCallFrame()}("trie_root",""),r.update_global_variable("currentPath",""),r.update_global_variable("result",[...s]),r.record("complete",`Done! Root folders: [${s.map(e=>`"${e}"`).join(", ")}]`),r.getSteps()
}

export function RemoveSubFoldersFromTheFilesystemProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveSubFoldersFromTheFilesystemTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveSubFoldersFromTheFilesystemSteps(e) as any[];
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
      title="Remove Sub-Folders from the Filesystem"
      slug="remove-sub-folders-from-the-filesystem"
      approaches={approaches}
      presets={RemoveSubFoldersFromTheFilesystemPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
