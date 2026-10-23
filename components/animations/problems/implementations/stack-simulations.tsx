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
    if (
      item.type === "arrayElement" ||
      item.type === "element" ||
      item.type === "char" ||
      item.type === "stateElement" ||
      item.type === "node" ||
      item.type === "cell" ||
      item.type === "stackElement" ||
      item.type === "bar" ||
      item.type === "token"
    ) {
      elements.push({
        value: item.value ?? item.char ?? item.height ?? item.val ?? "",
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
// Valid Parentheses (valid-parentheses)
// ==========================================

const ValidParenthesesTemplates = {
  "python": {
    "language": "python",
    "code": "def isValid(s):\n    # Keep removing adjacent matching pairs until none remain\n    prev = \"\"\n    while s != prev:\n        prev = s\n        s = s.replace(\"()\", \"\").replace(\"[]\", \"\").replace(\"{}\", \"\")\n    return s == \"\"",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "mark_paren": [
        6
      ],
      "remove_paren": [
        6
      ],
      "mark_square": [
        6
      ],
      "remove_square": [
        6
      ],
      "mark_curly": [
        6
      ],
      "remove_curly": [
        6
      ],
      "return_true": [
        7
      ],
      "return_false": [
        7
      ]
    },
    "conditionalMap": {
      "has_pair": [
        4
      ],
      "is_empty": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isValid(String s) {\n    // Keep removing adjacent matching pairs until none remain\n    String prev = \"\";\n    while (!s.equals(prev)) {\n        prev = s;\n        s = s.replace(\"()\", \"\").replace(\"[]\", \"\").replace(\"{}\", \"\");\n    }\n    return s.isEmpty();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "mark_paren": [
        6
      ],
      "remove_paren": [
        6
      ],
      "mark_square": [
        6
      ],
      "remove_square": [
        6
      ],
      "mark_curly": [
        6
      ],
      "remove_curly": [
        6
      ],
      "return_true": [
        8
      ],
      "return_false": [
        8
      ]
    },
    "conditionalMap": {
      "has_pair": [
        4
      ],
      "is_empty": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isValid(string s) {\n    // Keep removing adjacent matching pairs until none remain\n    string prev = \"\";\n    while (s != prev) {\n        prev = s;\n        size_t pos;\n        while ((pos = s.find(\"()\")) != string::npos) s.erase(pos, 2);\n        while ((pos = s.find(\"[]\")) != string::npos) s.erase(pos, 2);\n        while ((pos = s.find(\"{}\")) != string::npos) s.erase(pos, 2);\n    }\n    return s.empty();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "mark_paren": [
        7
      ],
      "remove_paren": [
        7
      ],
      "mark_square": [
        8
      ],
      "remove_square": [
        8
      ],
      "mark_curly": [
        9
      ],
      "remove_curly": [
        9
      ],
      "return_true": [
        11
      ],
      "return_false": [
        11
      ]
    },
    "conditionalMap": {
      "has_pair": [
        4
      ],
      "is_empty": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsValid(string s) {\n    // Keep removing adjacent matching pairs until none remain\n    string prev = \"\";\n    while (s != prev) {\n        prev = s;\n        s = s.Replace(\"()\", \"\").Replace(\"[]\", \"\").Replace(\"{}\", \"\");\n    }\n    return s.Length == 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "mark_paren": [
        6
      ],
      "remove_paren": [
        6
      ],
      "mark_square": [
        6
      ],
      "remove_square": [
        6
      ],
      "mark_curly": [
        6
      ],
      "remove_curly": [
        6
      ],
      "return_true": [
        8
      ],
      "return_false": [
        8
      ]
    },
    "conditionalMap": {
      "has_pair": [
        4
      ],
      "is_empty": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isValid(s string) bool {\n    // Keep removing adjacent matching pairs until none remain\n    prev := \"\"\n    for s != prev {\n        prev = s\n        s = strings.ReplaceAll(s, \"()\", \"\")\n        s = strings.ReplaceAll(s, \"[]\", \"\")\n        s = strings.ReplaceAll(s, \"{}\", \"\")\n    }\n    return len(s) == 0\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "mark_paren": [
        6
      ],
      "remove_paren": [
        6
      ],
      "mark_square": [
        7
      ],
      "remove_square": [
        7
      ],
      "mark_curly": [
        8
      ],
      "remove_curly": [
        8
      ],
      "return_true": [
        10
      ],
      "return_false": [
        10
      ]
    },
    "conditionalMap": {
      "has_pair": [
        4
      ],
      "is_empty": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isValid(s) {\n  // Keep removing adjacent matching pairs until none remain\n  let prev = \"\";\n  while (s !== prev) {\n    prev = s;\n    s = s.replace(/()/g, \"\").replace(/[]/g, \"\").replace(/{}/g, \"\");\n  }\n  return s.length === 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "mark_paren": [
        6
      ],
      "remove_paren": [
        6
      ],
      "mark_square": [
        6
      ],
      "remove_square": [
        6
      ],
      "mark_curly": [
        6
      ],
      "remove_curly": [
        6
      ],
      "return_true": [
        8
      ],
      "return_false": [
        8
      ]
    },
    "conditionalMap": {
      "has_pair": [
        4
      ],
      "is_empty": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isValid(s: string): boolean {\n    // Keep removing adjacent matching pairs until none remain\n    let prev: string = \"\";\n    while (s !== prev) {\n        prev = s;\n        s = s.replace(/()/g, \"\").replace(/[]/g, \"\").replace(/{}/g, \"\");\n    }\n    return s.length === 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "mark_paren": [
        6
      ],
      "remove_paren": [
        6
      ],
      "mark_square": [
        6
      ],
      "remove_square": [
        6
      ],
      "mark_curly": [
        6
      ],
      "remove_curly": [
        6
      ],
      "return_true": [
        8
      ],
      "return_false": [
        8
      ]
    },
    "conditionalMap": {
      "has_pair": [
        4
      ],
      "is_empty": [
        8
      ]
    }
  }
};

const ValidParenthesesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Nested",
    "value": {
      "s": "([{}])"
    }
  },
  {
    "id": "ex2",
    "label": "Pairs",
    "value": {
      "s": "()[]{}"
    }
  },
  {
    "id": "ex3",
    "label": "Mismatch",
    "value": {
      "s": "([)]"
    }
  },
  {
    "id": "ex4",
    "label": "Extra Closing",
    "value": {
      "s": "()[]{})"
    }
  },
  {
    "id": "ex5",
    "label": "Unclosed",
    "value": {
      "s": "(()"
    }
  }
];

function generateValidParenthesesSteps(e: any): any[] {
  

let t="string"==typeof e?.s?e.s:"",a=t.split(""),n=a.reduce((e,t,a)=>(e[`elem_${a}`]={type:"arrayElement",value:t,position:a},e),{}),r=[],l=[],s={")":"(","}":"{","]":"["},o=new StepRecorder({s:t},{...n}),c=(e,t)=>{o.update_visual(`elem_${e}`,{type:"arrayElement",value:a[e],position:e,state:t})},p=e=>{for(let e=0;e<=a.length;e++)o.delete_visual(`stack_${e}`);r.forEach((t,a)=>{o.update_visual(`stack_${a}`,{type:"stackElement",value:t,position:a,state:e?.enteringTop&&a===r.length-1?"entering":void 0})}),e?.exiting&&o.update_visual(`stack_${e.exiting.pos}`,{type:"stackElement",value:e.exiting.char,position:e.exiting.pos,state:"exiting"}),o.update_variable("stackIdxs",[...l]),o.update_variable("stack",[...r])};o.record("-","Start of algorithm"),o.add_new_variable("match_map",{...s}),o.add_new_variable("stack",[...r]),o.update_variable("stackIdxs",[]),o.record("initialize","Initialize an empty stack and the closing-to-opening match map");for(let e=0;e<a.length;e++){let t=a[e],i=t in s;if(o.update_variable("i",e),o.update_variable("char",t),o.update_variable("isClosing",i),i?o.update_variable("expected",s[t]):o.delete_variable("expected"),o.update_visual("curr",{type:"pointer",position:e,label:"i"}),p(),o.record("check_char",i?`s[${e}] = '${t}' is a closing bracket, it must match the stack top`:`s[${e}] = '${t}' is an opening bracket`),i){if(o.add_conditional("is_closing",!0),0===r.length)return o.add_conditional("stack_empty",!0),o.update_variable("return",!1),c(e,"failed"),o.record("invalid_empty",`The stack is empty, there is no opening bracket for '${t}'. Invalid!`),o.getSteps();o.add_conditional("stack_empty",!1);let a=r[r.length-1],i=l[l.length-1];if(s[t]!==a)return o.add_conditional("invalid_mismatch",!0),o.update_variable("return",!1),o.update_variable("topChar",a),o.update_variable("topIdx",i),c(e,"failed"),c(i,"failed"),o.record("invalid_mismatch",`'${t}' needs '${s[t]}' but the stack top is '${a}'. Invalid!`),o.getSteps();o.add_conditional("invalid_mismatch",!1),r.pop(),l.pop(),o.update_variable("openIdx",i),o.update_variable("popped",a),c(e,"matched"),c(i,"matched"),p({exiting:{char:a,pos:r.length}}),o.record("pop_match",`'${t}' matches '${a}' at index ${i}, pop it from the stack`),o.delete_variable("openIdx"),o.delete_variable("popped")}else r.push(t),l.push(e),o.add_conditional("is_closing",!1),o.add_conditional("is_opening",!0),c(e,"open"),p({enteringTop:!0}),o.record("push_opening",`Push '${t}' onto the stack and wait for its closing bracket`)}o.add_conditional("for_loop",!1);let d=0===r.length;return o.update_variable("i",a.length-1),o.delete_variable("char"),o.delete_variable("isClosing"),o.delete_variable("expected"),o.delete_visual("curr"),p(),d?(o.add_conditional("final_return",!0),o.update_variable("return",!0),o.record("return_true","The stack is empty, every bracket found its match. Valid!")):(o.add_conditional("final_return",!1),o.update_variable("return",!1),l.forEach(e=>c(e,"failed")),o.record("return_false_final",`The stack still holds ${r.length} unmatched opening bracket${r.length>1?"s":""}. Invalid!`)),o.getSteps()
}

export function ValidParenthesesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidParenthesesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidParenthesesSteps(e) as any[];
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
      title="Valid Parentheses"
      slug="valid-parentheses"
      approaches={approaches}
      presets={ValidParenthesesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove All Adjacent Duplicates In String (remove-all-adjacent-duplicates-in-string)
// ==========================================

const RemoveAllAdjacentDuplicatesInStringTemplates = {
  "python": {
    "language": "python",
    "code": "def removeDuplicates(s):\n    stack = []\n\n    for c in s:\n        # If top of stack matches current character, pop (cancel the pair)\n        if stack and stack[-1] == c:\n            stack.pop()\n        else:\n            stack.append(c)\n\n    return \"\".join(stack)",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        4
      ],
      "pop_match": [
        7
      ],
      "push_char": [
        9
      ],
      "push_char_empty": [
        9
      ],
      "build_result": [
        11
      ],
      "return_result": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "stack_not_empty": [
        6
      ],
      "char_matches_top": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String removeDuplicates(String s) {\n    StringBuilder stack = new StringBuilder();\n\n    for (char c : s.toCharArray()) {\n        // If top of stack matches current character, pop (cancel the pair)\n        if (stack.length() > 0 && stack.charAt(stack.length() - 1) == c) {\n            stack.deleteCharAt(stack.length() - 1);\n        } else {\n            stack.append(c);\n        }\n    }\n\n    return stack.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        4
      ],
      "pop_match": [
        7
      ],
      "push_char": [
        9
      ],
      "push_char_empty": [
        9
      ],
      "build_result": [
        13
      ],
      "return_result": [
        13
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "stack_not_empty": [
        6
      ],
      "char_matches_top": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string removeDuplicates(string s) {\n    string stack;\n\n    for (char c : s) {\n        // If top of stack matches current character, pop (cancel the pair)\n        if (!stack.empty() && stack.back() == c) {\n            stack.pop_back();\n        } else {\n            stack.push_back(c);\n        }\n    }\n\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        4
      ],
      "pop_match": [
        7
      ],
      "push_char": [
        9
      ],
      "push_char_empty": [
        9
      ],
      "build_result": [
        13
      ],
      "return_result": [
        13
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "stack_not_empty": [
        6
      ],
      "char_matches_top": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string RemoveDuplicates(string s) {\n    StringBuilder stack = new StringBuilder();\n\n    foreach (char c in s) {\n        // If top of stack matches current character, pop (cancel the pair)\n        if (stack.Length > 0 && stack[stack.Length - 1] == c) {\n            stack.Remove(stack.Length - 1, 1);\n        } else {\n            stack.Append(c);\n        }\n    }\n\n    return stack.ToString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        4
      ],
      "pop_match": [
        7
      ],
      "push_char": [
        9
      ],
      "push_char_empty": [
        9
      ],
      "build_result": [
        13
      ],
      "return_result": [
        13
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "stack_not_empty": [
        6
      ],
      "char_matches_top": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeDuplicates(s string) string {\n    stack := []byte{}\n\n    for i := 0; i < len(s); i++ {\n        c := s[i]\n        // If top of stack matches current character, pop (cancel the pair)\n        if len(stack) > 0 && stack[len(stack)-1] == c {\n            stack = stack[:len(stack)-1]\n        } else {\n            stack = append(stack, c)\n        }\n    }\n\n    return string(stack)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        4,
        5
      ],
      "pop_match": [
        8
      ],
      "push_char": [
        10
      ],
      "push_char_empty": [
        10
      ],
      "build_result": [
        14
      ],
      "return_result": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "stack_not_empty": [
        7
      ],
      "char_matches_top": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function removeDuplicates(s) {\n  var stack = [];\n\n  for (var i = 0; i < s.length; i++) {\n    var c = s[i];\n    // If top of stack matches current character, pop (cancel the pair)\n    if (stack.length > 0 && stack[stack.length - 1] === c) {\n      stack.pop();\n    } else {\n      stack.push(c);\n    }\n  }\n\n  return stack.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        4,
        5
      ],
      "pop_match": [
        8
      ],
      "push_char": [
        10
      ],
      "push_char_empty": [
        10
      ],
      "build_result": [
        14
      ],
      "return_result": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "stack_not_empty": [
        7
      ],
      "char_matches_top": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeDuplicates(s: string): string {\n    let stack: string[] = [];\n\n    for (let i = 0; i < s.length; i++) {\n        let c = s[i];\n        // If top of stack matches current character, pop (cancel the pair)\n        if (stack.length > 0 && stack[stack.length - 1] === c) {\n            stack.pop();\n        } else {\n            stack.push(c);\n        }\n    }\n\n    return stack.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        4,
        5
      ],
      "pop_match": [
        8
      ],
      "push_char": [
        10
      ],
      "push_char_empty": [
        10
      ],
      "build_result": [
        14
      ],
      "return_result": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "stack_not_empty": [
        7
      ],
      "char_matches_top": [
        7
      ]
    }
  }
};

const RemoveAllAdjacentDuplicatesInStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "abbaca"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "azxxzy"
    }
  },
  {
    "id": "ex3",
    "label": "All duplicates",
    "value": {
      "s": "aabbcc"
    }
  },
  {
    "id": "ex4",
    "label": "No duplicates",
    "value": {
      "s": "abcd"
    }
  }
];

function generateRemoveAllAdjacentDuplicatesInStringSteps(e: any): any[] {
  

let t=e.s,a=t.split(""),r=a.reduce((e,t,a)=>(e[`elem_${a}`]={type:"arrayElement",value:t,position:a},e),{}),n=[],s=[],l=new StepRecorder({s:t},{...r}),c=(e,t)=>{l.update_visual(`elem_${e}`,{type:"arrayElement",value:a[e],position:e,state:t})},o=e=>{for(let e=0;e<=a.length;e++)l.delete_visual(`stack_${e}`);n.forEach((t,a)=>{l.update_visual(`stack_${a}`,{type:"stackElement",value:t,position:a,state:e?.enteringTop&&a===n.length-1?"entering":void 0})}),e?.exiting&&l.update_visual(`stack_${e.exiting.pos}`,{type:"stackElement",value:e.exiting.char,position:e.exiting.pos,state:"exiting"}),l.update_variable("stackIdxs",[...s]),l.update_variable("stack",[...n])};l.record("-","Start of algorithm"),l.add_new_variable("stack",[...n]),l.update_variable("stackIdxs",[]),l.record("initialize","Initialize an empty stack to hold the characters that survive");for(let e=0;e<a.length;e++){let t=a[e],i=0===n.length,r=i?"":n[n.length-1],p=i?-1:s[s.length-1],h=!i&&r===t;if(l.add_conditional("for_loop",!0),l.update_variable("i",e),l.update_variable("char",t),l.update_variable("stackEmpty",i),l.update_variable("matches",h),i?(l.delete_variable("topChar"),l.delete_variable("topIdx")):(l.update_variable("topChar",r),l.update_variable("topIdx",p)),l.update_visual("curr",{type:"pointer",position:e,label:"i"}),o(),l.record("check_char",i?`s[${e}] = '${t}', the stack is empty so there is nothing to cancel`:`s[${e}] = '${t}', compare it with the stack top '${r}'`),i)l.add_conditional("stack_not_empty",!1),n.push(t),s.push(e),l.update_variable("stack",[...n]),c(e,"open"),o({enteringTop:!0}),l.record("push_char_empty",`The stack is empty, push '${t}' onto it`);else{if(l.add_conditional("stack_not_empty",!0),h){l.add_conditional("char_matches_top",!0),n.pop(),s.pop(),l.update_variable("stack",[...n]),l.update_variable("popped",r),l.update_variable("openIdx",p),c(e,"removed"),c(p,"removed"),o({exiting:{char:r,pos:n.length}}),l.record("pop_match",`'${t}' matches top '${r}' at index ${p}, pop it. Both are removed`),l.delete_variable("popped"),l.delete_variable("openIdx");continue}l.add_conditional("char_matches_top",!1),n.push(t),s.push(e),l.update_variable("stack",[...n]),c(e,"open"),o({enteringTop:!0}),l.record("push_char",`'${t}' differs from top '${r}', push it onto the stack`)}}l.add_conditional("for_loop",!1);let p=n.join("");return l.update_variable("i",a.length-1),l.delete_variable("char"),l.delete_variable("topChar"),l.delete_variable("topIdx"),l.delete_variable("stackEmpty"),l.delete_variable("matches"),l.delete_visual("curr"),o(),s.forEach(e=>c(e,"kept")),l.update_variable("result",p),l.record("build_result",p.length>0?`The stack holds the survivors, join them into the result: "${p}"`:'Every character was cancelled, the result is the empty string ""'),l.record("return_result",`Return the result: "${p}"`),l.getSteps()
}

export function RemoveAllAdjacentDuplicatesInStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveAllAdjacentDuplicatesInStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveAllAdjacentDuplicatesInStringSteps(e) as any[];
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
      title="Remove All Adjacent Duplicates In String"
      slug="remove-all-adjacent-duplicates-in-string"
      approaches={approaches}
      presets={RemoveAllAdjacentDuplicatesInStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Duplicate Letters (remove-duplicate-letters)
// ==========================================

const RemoveDuplicateLettersTemplates = {
  "python": {
    "language": "python",
    "code": "def removeDuplicateLetters(s):\n    last_index = {}\n    for i, ch in enumerate(s):\n        last_index[ch] = i\n\n    in_stack = set()\n    stack = []\n\n    for i, ch in enumerate(s):\n        # Skip if this character is already in our result\n        if ch in in_stack:\n            continue\n\n        # Pop characters that are larger and appear later\n        while stack and stack[-1] > ch and last_index[stack[-1]] > i:\n            in_stack.remove(stack.pop())\n\n        stack.append(ch)\n        in_stack.add(ch)\n\n    return \"\".join(stack)",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        6,
        7
      ],
      "check_char": [
        9
      ],
      "already_in_stack": [
        11,
        12
      ],
      "compare_top": [
        15
      ],
      "pop_from_stack": [
        16
      ],
      "push_to_stack": [
        18,
        19
      ],
      "build_result": [
        21
      ],
      "return_result": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "in_stack": [
        11
      ],
      "stack_not_empty": [
        15
      ],
      "top_greater": [
        15
      ],
      "appears_later": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String removeDuplicateLetters(String s) {\n    int[] lastIndex = new int[26];\n    for (int i = 0; i < s.length(); i++) {\n        lastIndex[s.charAt(i) - 'a'] = i;\n    }\n\n    boolean[] inStack = new boolean[26];\n    StringBuilder stack = new StringBuilder();\n\n    for (int i = 0; i < s.length(); i++) {\n        char ch = s.charAt(i);\n        // Skip if this character is already in our result\n        if (inStack[ch - 'a']) continue;\n\n        // Pop characters that are larger and appear later\n        while (stack.length() > 0\n                && stack.charAt(stack.length() - 1) > ch\n                && lastIndex[stack.charAt(stack.length() - 1) - 'a'] > i) {\n            inStack[stack.charAt(stack.length() - 1) - 'a'] = false;\n            stack.deleteCharAt(stack.length() - 1);\n        }\n\n        stack.append(ch);\n        inStack[ch - 'a'] = true;\n    }\n\n    return stack.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        7,
        8
      ],
      "check_char": [
        10
      ],
      "already_in_stack": [
        13
      ],
      "compare_top": [
        16
      ],
      "pop_from_stack": [
        19,
        20
      ],
      "push_to_stack": [
        23,
        24
      ],
      "build_result": [
        27
      ],
      "return_result": [
        27
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "in_stack": [
        13
      ],
      "stack_not_empty": [
        16
      ],
      "top_greater": [
        16
      ],
      "appears_later": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string removeDuplicateLetters(string s) {\n    int lastIndex[26] = {};\n    for (int i = 0; i < s.size(); i++) {\n        lastIndex[s[i] - 'a'] = i;\n    }\n\n    bool inStack[26] = {};\n    string stack = \"\";\n\n    for (int i = 0; i < s.size(); i++) {\n        char ch = s[i];\n        // Skip if this character is already in our result\n        if (inStack[ch - 'a']) continue;\n\n        // Pop characters that are larger and appear later\n        while (!stack.empty() && stack.back() > ch && lastIndex[stack.back() - 'a'] > i) {\n            inStack[stack.back() - 'a'] = false;\n            stack.pop_back();\n        }\n\n        stack.push_back(ch);\n        inStack[ch - 'a'] = true;\n    }\n\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        7,
        8
      ],
      "check_char": [
        10
      ],
      "already_in_stack": [
        13
      ],
      "compare_top": [
        16
      ],
      "pop_from_stack": [
        17,
        18
      ],
      "push_to_stack": [
        21,
        22
      ],
      "build_result": [
        25
      ],
      "return_result": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "in_stack": [
        13
      ],
      "stack_not_empty": [
        16
      ],
      "top_greater": [
        16
      ],
      "appears_later": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string RemoveDuplicateLetters(string s) {\n    int[] lastIndex = new int[26];\n    for (int i = 0; i < s.Length; i++) {\n        lastIndex[s[i] - 'a'] = i;\n    }\n\n    bool[] inStack = new bool[26];\n    var stack = new List<char>();\n\n    for (int i = 0; i < s.Length; i++) {\n        char ch = s[i];\n        // Skip if this character is already in our result\n        if (inStack[ch - 'a']) continue;\n\n        // Pop characters that are larger and appear later\n        while (stack.Count > 0 && stack[stack.Count - 1] > ch\n               && lastIndex[stack[stack.Count - 1] - 'a'] > i) {\n            inStack[stack[stack.Count - 1] - 'a'] = false;\n            stack.RemoveAt(stack.Count - 1);\n        }\n\n        stack.Add(ch);\n        inStack[ch - 'a'] = true;\n    }\n\n    return new string(stack.ToArray());\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        7,
        8
      ],
      "check_char": [
        10
      ],
      "already_in_stack": [
        13
      ],
      "compare_top": [
        16,
        17
      ],
      "pop_from_stack": [
        18,
        19
      ],
      "push_to_stack": [
        22,
        23
      ],
      "build_result": [
        26
      ],
      "return_result": [
        26
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "in_stack": [
        13
      ],
      "stack_not_empty": [
        16,
        17
      ],
      "top_greater": [
        16,
        17
      ],
      "appears_later": [
        16,
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeDuplicateLetters(s string) string {\n    lastIndex := [26]int{}\n    for i := 0; i < len(s); i++ {\n        lastIndex[s[i]-'a'] = i\n    }\n\n    inStack := [26]bool{}\n    stack := []byte{}\n\n    for i := 0; i < len(s); i++ {\n        ch := s[i]\n        // Skip if this character is already in our result\n        if inStack[ch-'a'] {\n            continue\n        }\n\n        // Pop characters that are larger and appear later\n        for len(stack) > 0 && stack[len(stack)-1] > ch && lastIndex[stack[len(stack)-1]-'a'] > i {\n            inStack[stack[len(stack)-1]-'a'] = false\n            stack = stack[:len(stack)-1]\n        }\n\n        stack = append(stack, ch)\n        inStack[ch-'a'] = true\n    }\n\n    return string(stack)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        7,
        8
      ],
      "check_char": [
        10
      ],
      "already_in_stack": [
        13,
        14
      ],
      "compare_top": [
        18
      ],
      "pop_from_stack": [
        19,
        20
      ],
      "push_to_stack": [
        23,
        24
      ],
      "build_result": [
        27
      ],
      "return_result": [
        27
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "in_stack": [
        13
      ],
      "stack_not_empty": [
        18
      ],
      "top_greater": [
        18
      ],
      "appears_later": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function removeDuplicateLetters(s) {\n  const lastIndex = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    lastIndex[s.charCodeAt(i) - 97] = i;\n  }\n\n  const inStack = new Array(26).fill(false);\n  const stack = [];\n\n  for (let i = 0; i < s.length; i++) {\n    const ch = s[i];\n    const idx = s.charCodeAt(i) - 97;\n    // Skip if this character is already in our result\n    if (inStack[idx]) continue;\n\n    // Pop characters that are larger and appear later\n    while (\n      stack.length > 0 &&\n      stack[stack.length - 1] > ch &&\n      lastIndex[stack[stack.length - 1].charCodeAt(0) - 97] > i\n    ) {\n      inStack[stack[stack.length - 1].charCodeAt(0) - 97] = false;\n      stack.pop();\n    }\n\n    stack.push(ch);\n    inStack[idx] = true;\n  }\n\n  return stack.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        7,
        8
      ],
      "check_char": [
        10
      ],
      "already_in_stack": [
        14
      ],
      "compare_top": [
        17,
        18,
        19,
        20,
        21
      ],
      "pop_from_stack": [
        22,
        23
      ],
      "push_to_stack": [
        26,
        27
      ],
      "build_result": [
        30
      ],
      "return_result": [
        30
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "in_stack": [
        14
      ],
      "stack_not_empty": [
        17,
        18,
        19,
        20,
        21
      ],
      "top_greater": [
        17,
        18,
        19,
        20,
        21
      ],
      "appears_later": [
        17,
        18,
        19,
        20,
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeDuplicateLetters(s: string): string {\n    const lastIndex: number[] = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) {\n        lastIndex[s.charCodeAt(i) - 97] = i;\n    }\n\n    const inStack: boolean[] = new Array(26).fill(false);\n    const stack: string[] = [];\n\n    for (let i = 0; i < s.length; i++) {\n        const ch = s[i];\n        const idx = s.charCodeAt(i) - 97;\n        // Skip if this character is already in our result\n        if (inStack[idx]) continue;\n\n        // Pop characters that are larger and appear later\n        while (\n            stack.length > 0 &&\n            stack[stack.length - 1] > ch &&\n            lastIndex[stack[stack.length - 1].charCodeAt(0) - 97] > i\n        ) {\n            inStack[stack[stack.length - 1].charCodeAt(0) - 97] = false;\n            stack.pop();\n        }\n\n        stack.push(ch);\n        inStack[idx] = true;\n    }\n\n    return stack.join(\"\");\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        7,
        8
      ],
      "check_char": [
        10
      ],
      "already_in_stack": [
        14
      ],
      "compare_top": [
        17,
        18,
        19,
        20,
        21
      ],
      "pop_from_stack": [
        22,
        23
      ],
      "push_to_stack": [
        26,
        27
      ],
      "build_result": [
        30
      ],
      "return_result": [
        30
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "in_stack": [
        14
      ],
      "stack_not_empty": [
        17,
        18,
        19,
        20,
        21
      ],
      "top_greater": [
        17,
        18,
        19,
        20,
        21
      ],
      "appears_later": [
        17,
        18,
        19,
        20,
        21
      ]
    }
  }
};

const RemoveDuplicateLettersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "bcabc"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "cbacdcbc"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "ecbacba"
    }
  }
];

function generateRemoveDuplicateLettersSteps(e: any): any[] {
  

let t=e.s,i=t.split(""),s=i.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),n={};i.forEach((e,t)=>n[e]=t);let r=[],o=new Set,l=new StepRecorder({s:t},{...s}),c=e=>{for(let e=0;e<=i.length;e++)l.delete_visual(`stack_${e}`);r.forEach((t,i)=>{l.update_visual(`stack_${i}`,{type:"stackElement",value:t,position:i,state:e?.entering&&i===r.length-1?"entering":void 0})}),e?.exiting&&l.update_visual(`stack_${e.exiting.pos}`,{type:"stackElement",value:e.exiting.ch,position:e.exiting.pos,state:"exiting"}),l.update_variable("stack",[...r]),l.update_variable("in_stack",Array.from(o))};l.record("-","Build the smallest string with each letter once, keeping order."),l.add_new_variable("lastIndex",{...n}),l.add_new_variable("stack",[...r]),l.add_new_variable("in_stack",[]),l.record("initialize","Record the last index of each letter, and start an empty result stack.");for(let e=0;e<i.length;e++){let t=i[e];if(l.add_conditional("for_loop",!0),l.update_variable("i",e),l.update_variable("char",t),l.delete_variable("top"),l.update_visual("curr",{type:"pointer",position:e,label:"i"}),c(),l.record("check_char",`Look at s[${e}] = '${t}'`),o.has(t)){l.add_conditional("in_stack",!0),l.record("already_in_stack",`'${t}' is already in the result, skip it`);continue}for(l.add_conditional("in_stack",!1);r.length>0;){let i=r[r.length-1],a=i>t,s=n[i]>e;if(!a||!s){l.add_conditional("stack_not_empty",!0),l.add_conditional("top_greater",a),l.add_conditional("appears_later",s);break}l.add_conditional("stack_not_empty",!0),l.add_conditional("top_greater",!0),l.add_conditional("appears_later",!0),l.update_variable("top",i),l.record("compare_top",`top '${i}' > '${t}' and lastIndex['${i}'] = ${n[i]} > ${e}, so drop it`),r.pop(),o.delete(i),c({exiting:{ch:i,pos:r.length}}),l.record("pop_from_stack",`Pop '${i}' — we can add it back later`)}0===r.length&&l.add_conditional("stack_not_empty",!1),r.push(t),o.add(t),l.delete_variable("top"),c({entering:!0}),l.record("push_to_stack",`Push '${t}' onto the result`)}l.add_conditional("for_loop",!1);let d=r.join("");return l.update_variable("i",i.length-1),l.delete_variable("char"),l.delete_variable("top"),l.delete_visual("curr"),c(),l.update_variable("result",d),l.record("build_result",`The stack is the answer: "${d}"`),l.record("return_result",`Return "${d}"`),l.getSteps()
}

export function RemoveDuplicateLettersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveDuplicateLettersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveDuplicateLettersSteps(e) as any[];
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
      title="Remove Duplicate Letters"
      slug="remove-duplicate-letters"
      approaches={approaches}
      presets={RemoveDuplicateLettersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Removing Stars From a String (removing-stars-from-a-string)
// ==========================================

const RemovingStarsFromAStringTemplates = {
  "python": {
    "language": "python",
    "code": "def removeStars(s):\n    stack = []\n    for c in s:\n        if c == '*':\n            # Star removes the most recent character\n            stack.pop()\n        else:\n            stack.append(c)\n    return ''.join(stack)",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        3
      ],
      "found_star": [
        4
      ],
      "stack_empty": [
        6
      ],
      "pop_from_stack": [
        6
      ],
      "push_to_stack": [
        8
      ],
      "build_result": [
        9
      ],
      "return_result": [
        9
      ]
    },
    "conditionalMap": {
      "for_loop": [
        3
      ],
      "is_star": [
        4
      ],
      "stack_not_empty": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String removeStars(String s) {\n    StringBuilder stack = new StringBuilder();\n    for (char c : s.toCharArray()) {\n        if (c == '*') {\n            // Star removes the most recent character\n            stack.deleteCharAt(stack.length() - 1);\n        } else {\n            stack.append(c);\n        }\n    }\n    return stack.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        3
      ],
      "found_star": [
        4
      ],
      "stack_empty": [
        6
      ],
      "pop_from_stack": [
        6
      ],
      "push_to_stack": [
        8
      ],
      "build_result": [
        11
      ],
      "return_result": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        3
      ],
      "is_star": [
        4
      ],
      "stack_not_empty": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string removeStars(string s) {\n    string stack;\n    for (char c : s) {\n        if (c == '*') {\n            // Star removes the most recent character\n            stack.pop_back();\n        } else {\n            stack.push_back(c);\n        }\n    }\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        3
      ],
      "found_star": [
        4
      ],
      "stack_empty": [
        6
      ],
      "pop_from_stack": [
        6
      ],
      "push_to_stack": [
        8
      ],
      "build_result": [
        11
      ],
      "return_result": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        3
      ],
      "is_star": [
        4
      ],
      "stack_not_empty": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string RemoveStars(string s) {\n    StringBuilder stack = new StringBuilder();\n    foreach (char c in s) {\n        if (c == '*') {\n            // Star removes the most recent character\n            stack.Remove(stack.Length - 1, 1);\n        } else {\n            stack.Append(c);\n        }\n    }\n    return stack.ToString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        3
      ],
      "found_star": [
        4
      ],
      "stack_empty": [
        6
      ],
      "pop_from_stack": [
        6
      ],
      "push_to_stack": [
        8
      ],
      "build_result": [
        11
      ],
      "return_result": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        3
      ],
      "is_star": [
        4
      ],
      "stack_not_empty": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeStars(s string) string {\n    stack := []byte{}\n    for i := 0; i < len(s); i++ {\n        if s[i] == '*' {\n            // Star removes the most recent character\n            stack = stack[:len(stack)-1]\n        } else {\n            stack = append(stack, s[i])\n        }\n    }\n    return string(stack)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        3
      ],
      "found_star": [
        4
      ],
      "stack_empty": [
        6
      ],
      "pop_from_stack": [
        6
      ],
      "push_to_stack": [
        8
      ],
      "build_result": [
        11
      ],
      "return_result": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        3
      ],
      "is_star": [
        4
      ],
      "stack_not_empty": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function removeStars(s) {\n  let stack = [];\n  for (let c of s) {\n    if (c === \"*\") {\n      // Star removes the most recent character\n      stack.pop();\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        3
      ],
      "found_star": [
        4
      ],
      "stack_empty": [
        6
      ],
      "pop_from_stack": [
        6
      ],
      "push_to_stack": [
        8
      ],
      "build_result": [
        11
      ],
      "return_result": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        3
      ],
      "is_star": [
        4
      ],
      "stack_not_empty": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeStars(s: string): string {\n    let stack: string[] = [];\n    for (let c of s) {\n        if (c === \"*\") {\n            // Star removes the most recent character\n            stack.pop();\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_char": [
        3
      ],
      "found_star": [
        4
      ],
      "stack_empty": [
        6
      ],
      "pop_from_stack": [
        6
      ],
      "push_to_stack": [
        8
      ],
      "build_result": [
        11
      ],
      "return_result": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        3
      ],
      "is_star": [
        4
      ],
      "stack_not_empty": [
        6
      ]
    }
  }
};

const RemovingStarsFromAStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "leet**cod*e"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "erase*****"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "abc*de*f"
    }
  }
];

function generateRemovingStarsFromAStringSteps(e: any): any[] {
  

let t=e.s,r=t.split(""),a=r.reduce((e,t,r)=>(e[`elem_${r}`]={type:"arrayElement",value:t,position:r},e),{}),n=[],s=[],l=new StepRecorder({s:t},{...a}),o=(e,t)=>{l.update_visual(`elem_${e}`,{type:"arrayElement",value:r[e],position:e,state:t})},c=e=>{for(let e=0;e<=r.length;e++)l.delete_visual(`stack_${e}`);n.forEach((t,r)=>{l.update_visual(`stack_${r}`,{type:"stackElement",value:t,position:r,state:e?.entering&&r===n.length-1?"entering":void 0})}),e?.exiting&&l.update_visual(`stack_${e.exiting.pos}`,{type:"stackElement",value:e.exiting.ch,position:e.exiting.pos,state:"exiting"}),l.update_variable("stack",[...n])};l.record("-","A '*' deletes the character just before it. Use a stack."),l.add_new_variable("stack",[...n]),l.record("initialize","Start with an empty stack of surviving characters.");for(let e=0;e<r.length;e++){let t=r[e],i="*"===t;if(l.add_conditional("for_loop",!0),l.update_variable("i",e),l.update_variable("char",t),l.update_variable("isStar",i),l.delete_variable("eatenChar"),l.delete_variable("eatenIdx"),l.update_visual("curr",{type:"pointer",position:e,label:"i"}),o(e,"current"),c(),l.record("check_char",`s[${e}] = '${t}'`),i)if(l.add_conditional("is_star",!0),l.record("found_star","It is a '*', so delete the character before it"),n.length>0){l.add_conditional("stack_not_empty",!0);let t=n.pop(),r=s.pop();l.update_variable("eatenChar",t),l.update_variable("eatenIdx",r),o(e,"removed"),o(r,"removed"),c({exiting:{ch:t,pos:n.length}}),l.record("pop_from_stack",`'*' removes '${t}' from the top`)}else l.add_conditional("stack_not_empty",!1),o(e,"removed"),c(),l.record("stack_empty","Stack is empty, the '*' removes nothing");else l.add_conditional("is_star",!1),n.push(t),s.push(e),o(e,"kept"),c({entering:!0}),l.record("push_to_stack",`Push '${t}' onto the stack`)}l.add_conditional("for_loop",!1);let d=n.join("");return l.update_variable("i",r.length-1),l.delete_variable("char"),l.delete_variable("isStar"),l.delete_variable("eatenChar"),l.delete_variable("eatenIdx"),l.delete_visual("curr"),c(),s.forEach(e=>o(e,"kept")),l.update_variable("result",d),l.record("build_result",`The stack is the answer: "${d}"`),l.record("return_result",`Return "${d}"`),l.getSteps()
}

export function RemovingStarsFromAStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemovingStarsFromAStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemovingStarsFromAStringSteps(e) as any[];
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
      title="Removing Stars From a String"
      slug="removing-stars-from-a-string"
      approaches={approaches}
      presets={RemovingStarsFromAStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Evaluate Reverse Polish Notation (evaluate-reverse-polish-notation)
// ==========================================

const EvaluateReversePolishNotationTemplates = {
  "python": {
    "language": "python",
    "code": "def evalRPN(tokens):\n    stack = []\n\n    for token in tokens:\n        if token == \"+\":\n            b = stack.pop()\n            a = stack.pop()\n            stack.append(a + b)\n        elif token == \"-\":\n            b = stack.pop()\n            a = stack.pop()\n            stack.append(a - b)\n        elif token == \"*\":\n            b = stack.pop()\n            a = stack.pop()\n            stack.append(a * b)\n        elif token == \"/\":\n            # Use int(a / b) to truncate toward zero\n            # Python's // operator floors toward negative infinity\n            b = stack.pop()\n            a = stack.pop()\n            stack.append(int(a / b))\n        else:\n            # Token is a number, push it onto the stack\n            stack.append(int(token))\n\n    return stack.pop()",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_token": [
        4
      ],
      "found_operator": [
        5
      ],
      "pop_operands": [
        6,
        7,
        10,
        11,
        14,
        15,
        20,
        21
      ],
      "check_switch": [
        5
      ],
      "compute_add": [
        5,
        6,
        7,
        8
      ],
      "compute_sub": [
        9,
        10,
        11,
        12
      ],
      "compute_mul": [
        13,
        14,
        15,
        16
      ],
      "compute_div": [
        17,
        20,
        21,
        22
      ],
      "push_result": [
        8,
        12,
        16,
        22
      ],
      "push_number": [
        25
      ],
      "get_result": [
        27
      ],
      "return_result": [
        27
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "is_operator": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int evalRPN(String[] tokens) {\n    Stack<Integer> stack = new Stack<>();\n\n    for (String token : tokens) {\n        if (token.equals(\"+\")) {\n            int b = stack.pop();\n            int a = stack.pop();\n            stack.push(a + b);\n        } else if (token.equals(\"-\")) {\n            int b = stack.pop();\n            int a = stack.pop();\n            stack.push(a - b);\n        } else if (token.equals(\"*\")) {\n            int b = stack.pop();\n            int a = stack.pop();\n            stack.push(a * b);\n        } else if (token.equals(\"/\")) {\n            // Integer division in Java truncates toward zero by default\n            int b = stack.pop();\n            int a = stack.pop();\n            stack.push(a / b);\n        } else {\n            // Token is a number, push it onto the stack\n            stack.push(Integer.parseInt(token));\n        }\n    }\n\n    return stack.pop();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_token": [
        4
      ],
      "found_operator": [
        5
      ],
      "pop_operands": [
        6,
        7,
        10,
        11,
        14,
        15,
        19,
        20
      ],
      "check_switch": [
        5
      ],
      "compute_add": [
        5,
        6,
        7,
        8
      ],
      "compute_sub": [
        9,
        10,
        11,
        12
      ],
      "compute_mul": [
        13,
        14,
        15,
        16
      ],
      "compute_div": [
        17,
        19,
        20,
        21
      ],
      "push_result": [
        8,
        12,
        16,
        21
      ],
      "push_number": [
        24
      ],
      "get_result": [
        28
      ],
      "return_result": [
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "is_operator": [
        5
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int evalRPN(vector<string>& tokens) {\n    stack<int> stk;\n\n    for (const string& token : tokens) {\n        if (token == \"+\") {\n            int b = stk.top(); stk.pop();\n            int a = stk.top(); stk.pop();\n            stk.push(a + b);\n        } else if (token == \"-\") {\n            int b = stk.top(); stk.pop();\n            int a = stk.top(); stk.pop();\n            stk.push(a - b);\n        } else if (token == \"*\") {\n            int b = stk.top(); stk.pop();\n            int a = stk.top(); stk.pop();\n            stk.push(a * b);\n        } else if (token == \"/\") {\n            // Integer division in C++ truncates toward zero by default\n            int b = stk.top(); stk.pop();\n            int a = stk.top(); stk.pop();\n            stk.push(a / b);\n        } else {\n            // Token is a number, push it onto the stack\n            stk.push(stoi(token));\n        }\n    }\n\n    return stk.top();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_token": [
        4
      ],
      "found_operator": [
        5
      ],
      "pop_operands": [
        6,
        7,
        10,
        11,
        14,
        15,
        19,
        20
      ],
      "check_switch": [
        5
      ],
      "compute_add": [
        5,
        6,
        7,
        8
      ],
      "compute_sub": [
        9,
        10,
        11,
        12
      ],
      "compute_mul": [
        13,
        14,
        15,
        16
      ],
      "compute_div": [
        17,
        19,
        20,
        21
      ],
      "push_result": [
        8,
        12,
        16,
        21
      ],
      "push_number": [
        24
      ],
      "get_result": [
        28
      ],
      "return_result": [
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "is_operator": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int EvalRPN(string[] tokens) {\n    Stack<int> stack = new Stack<int>();\n\n    foreach (string token in tokens) {\n        if (token == \"+\") {\n            int b = stack.Pop();\n            int a = stack.Pop();\n            stack.Push(a + b);\n        } else if (token == \"-\") {\n            int b = stack.Pop();\n            int a = stack.Pop();\n            stack.Push(a - b);\n        } else if (token == \"*\") {\n            int b = stack.Pop();\n            int a = stack.Pop();\n            stack.Push(a * b);\n        } else if (token == \"/\") {\n            // Integer division in C# truncates toward zero by default\n            int b = stack.Pop();\n            int a = stack.Pop();\n            stack.Push(a / b);\n        } else {\n            // Token is a number, push it onto the stack\n            stack.Push(int.Parse(token));\n        }\n    }\n\n    return stack.Pop();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_token": [
        4
      ],
      "found_operator": [
        5
      ],
      "pop_operands": [
        6,
        7,
        10,
        11,
        14,
        15,
        19,
        20
      ],
      "check_switch": [
        5
      ],
      "compute_add": [
        5,
        6,
        7,
        8
      ],
      "compute_sub": [
        9,
        10,
        11,
        12
      ],
      "compute_mul": [
        13,
        14,
        15,
        16
      ],
      "compute_div": [
        17,
        19,
        20,
        21
      ],
      "push_result": [
        8,
        12,
        16,
        21
      ],
      "push_number": [
        24
      ],
      "get_result": [
        28
      ],
      "return_result": [
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "is_operator": [
        5
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func evalRPN(tokens []string) int {\n    stack := []int{}\n\n    for _, token := range tokens {\n        switch token {\n        case \"+\":\n            b, a := stack[len(stack)-1], stack[len(stack)-2]\n            stack = stack[:len(stack)-2]\n            stack = append(stack, a+b)\n        case \"-\":\n            b, a := stack[len(stack)-1], stack[len(stack)-2]\n            stack = stack[:len(stack)-2]\n            stack = append(stack, a-b)\n        case \"*\":\n            b, a := stack[len(stack)-1], stack[len(stack)-2]\n            stack = stack[:len(stack)-2]\n            stack = append(stack, a*b)\n        case \"/\":\n            // Integer division in Go truncates toward zero by default\n            b, a := stack[len(stack)-1], stack[len(stack)-2]\n            stack = stack[:len(stack)-2]\n            stack = append(stack, a/b)\n        default:\n            // Token is a number, push it onto the stack\n            val, _ := strconv.Atoi(token)\n            stack = append(stack, val)\n        }\n    }\n\n    return stack[0]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_token": [
        4
      ],
      "found_operator": [
        5
      ],
      "pop_operands": [
        7,
        11,
        15,
        20
      ],
      "check_switch": [
        5
      ],
      "compute_add": [
        6,
        7,
        8,
        9
      ],
      "compute_sub": [
        10,
        11,
        12,
        13
      ],
      "compute_mul": [
        14,
        15,
        16,
        17
      ],
      "compute_div": [
        18,
        20,
        21,
        22
      ],
      "push_result": [
        9,
        13,
        17,
        22
      ],
      "push_number": [
        25,
        26
      ],
      "get_result": [
        30
      ],
      "return_result": [
        30
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "is_operator": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function evalRPN(tokens) {\n  const stack = [];\n\n  for (const token of tokens) {\n    if (token === \"+\") {\n      const b = stack.pop();\n      const a = stack.pop();\n      stack.push(a + b);\n    } else if (token === \"-\") {\n      const b = stack.pop();\n      const a = stack.pop();\n      stack.push(a - b);\n    } else if (token === \"*\") {\n      const b = stack.pop();\n      const a = stack.pop();\n      stack.push(a * b);\n    } else if (token === \"/\") {\n      // Use Math.trunc to truncate toward zero\n      const b = stack.pop();\n      const a = stack.pop();\n      stack.push(Math.trunc(a / b));\n    } else {\n      // Token is a number, push it onto the stack\n      stack.push(parseInt(token));\n    }\n  }\n\n  return stack.pop();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_token": [
        4
      ],
      "found_operator": [
        5
      ],
      "pop_operands": [
        6,
        7,
        10,
        11,
        14,
        15,
        19,
        20
      ],
      "check_switch": [
        5
      ],
      "compute_add": [
        5,
        6,
        7,
        8
      ],
      "compute_sub": [
        9,
        10,
        11,
        12
      ],
      "compute_mul": [
        13,
        14,
        15,
        16
      ],
      "compute_div": [
        17,
        19,
        20,
        21
      ],
      "push_result": [
        8,
        12,
        16,
        21
      ],
      "push_number": [
        24
      ],
      "get_result": [
        28
      ],
      "return_result": [
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "is_operator": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function evalRPN(tokens: string[]): number {\n    const stack: number[] = [];\n\n    for (const token of tokens) {\n        if (token === \"+\") {\n            const b = stack.pop()!;\n            const a = stack.pop()!;\n            stack.push(a + b);\n        } else if (token === \"-\") {\n            const b = stack.pop()!;\n            const a = stack.pop()!;\n            stack.push(a - b);\n        } else if (token === \"*\") {\n            const b = stack.pop()!;\n            const a = stack.pop()!;\n            stack.push(a * b);\n        } else if (token === \"/\") {\n            // Use Math.trunc to truncate toward zero\n            const b = stack.pop()!;\n            const a = stack.pop()!;\n            stack.push(Math.trunc(a / b));\n        } else {\n            // Token is a number, push it onto the stack\n            stack.push(parseInt(token));\n        }\n    }\n\n    return stack.pop()!;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_token": [
        4
      ],
      "found_operator": [
        5
      ],
      "pop_operands": [
        6,
        7,
        10,
        11,
        14,
        15,
        19,
        20
      ],
      "check_switch": [
        5
      ],
      "compute_add": [
        5,
        6,
        7,
        8
      ],
      "compute_sub": [
        9,
        10,
        11,
        12
      ],
      "compute_mul": [
        13,
        14,
        15,
        16
      ],
      "compute_div": [
        17,
        19,
        20,
        21
      ],
      "push_result": [
        8,
        12,
        16,
        21
      ],
      "push_number": [
        24
      ],
      "get_result": [
        28
      ],
      "return_result": [
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "is_operator": [
        5
      ]
    }
  }
};

const EvaluateReversePolishNotationPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tokens": [
        "2",
        "1",
        "+",
        "3",
        "*"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tokens": [
        "4",
        "13",
        "5",
        "/",
        "+"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "tokens": [
        "10",
        "6",
        "9",
        "3",
        "+",
        "-11",
        "*",
        "/",
        "*",
        "17",
        "+",
        "5",
        "+"
      ]
    }
  }
];

function generateEvaluateReversePolishNotationSteps(t: any): any[] {
  

let e=t.tokens,a=e.reduce((t,e,a)=>(t[`elem_${a}`]={type:"arrayElement",value:e,position:a},t),{}),s=[],o=t=>"+"===t||"-"===t||"*"===t||"/"===t,i=new StepRecorder({tokens:e},{...a}),r=(t,a)=>{i.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:a})},l=t=>{for(let t=0;t<=e.length+1;t++)i.delete_visual(`stack_${t}`);s.forEach((e,a)=>{let n;t?.operands&&(a===t.operands.bPos?n="operand_b":a===t.operands.aPos&&(n="operand_a")),t?.entering&&a===s.length-1&&(n="entering"),i.update_visual(`stack_${a}`,{type:"stackElement",value:String(e),position:a,state:n})}),t?.exitingB&&i.update_visual(`stack_${t.exitingB.pos}`,{type:"stackElement",value:String(t.exitingB.val),position:t.exitingB.pos,state:"exiting"}),i.update_variable("stack",[...s])};i.record("-","Evaluate the expression left to right with a stack."),i.add_new_variable("stack",[]),i.record("initialize","Start with an empty stack of operands.");for(let t=0;t<e.length;t++){let a=e[t],n=o(a);if(i.add_conditional("for_loop",!0),i.update_variable("i",t),i.update_variable("token",a),i.update_variable("isOp",n),i.delete_variable("a"),i.delete_variable("b"),i.delete_variable("operation"),i.update_visual("curr",{type:"pointer",position:t,label:"i"}),r(t,"current"),l(),i.record("check_token",`Token ${t}: "${a}"`),n){i.add_conditional("is_operator",!0),i.record("found_operator",`"${a}" is an operator, it needs two operands`);let e=s.length-1,n=s.length-2,o=s[e],c=s[n];i.update_variable("a",c),i.update_variable("b",o),l({operands:{aPos:n,bPos:e}}),i.record("pop_operands",`Pop the top two: a = ${c}, b = ${o}`),i.record("check_switch",`Apply the operator "${a}"`);let p=0,u="";"+"===a?(p=c+o,u="compute_add"):"-"===a?(p=c-o,u="compute_sub"):"*"===a?(p=c*o,u="compute_mul"):(p=Math.trunc(c/o),u="compute_div");let d=`${c} ${a} ${o} = ${p}`;i.update_variable("result",p),i.update_variable("operation",d),l({operands:{aPos:n,bPos:e}}),i.record(u,d),s.pop(),s.pop(),s.push(p),r(t,"op_done"),i.update_variable("stack",[...s]),l({entering:!0,exitingB:{val:o,pos:e}}),i.record("push_result",`Push the result ${p} back onto the stack`)}else{i.add_conditional("is_operator",!1);let e=parseInt(a,10);s.push(e),r(t,"num_done"),i.update_variable("stack",[...s]),l({entering:!0}),i.record("push_number",`Push the number ${e} onto the stack`)}}i.add_conditional("for_loop",!1);let c=s[0];return i.update_variable("i",e.length-1),i.delete_variable("token"),i.delete_variable("isOp"),i.delete_variable("a"),i.delete_variable("b"),i.delete_variable("operation"),i.delete_visual("curr"),l(),i.update_variable("result",c),i.record("get_result",`One value left on the stack: ${c}`),i.record("return_result",`Return ${c}`),i.getSteps()
}

export function EvaluateReversePolishNotationProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: EvaluateReversePolishNotationTemplates,
      generateSteps: (t: any) => {
        const recorded = generateEvaluateReversePolishNotationSteps(t) as any[];
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
      title="Evaluate Reverse Polish Notation"
      slug="evaluate-reverse-polish-notation"
      approaches={approaches}
      presets={EvaluateReversePolishNotationPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Basic Calculator II (basic-calculator-ii)
// ==========================================

const BasicCalculatorIiTemplates = {
  "python": {
    "language": "python",
    "code": "def calculate(s):\n    stack = []\n    current_num = 0\n    prev_op = '+'\n\n    for i, c in enumerate(s):\n        if c.isdigit():\n            current_num = current_num * 10 + int(c)\n\n        # Process when we hit an operator or the end of string\n        if c in \"+-*/\" or i == len(s) - 1:\n            if prev_op == '+':\n                stack.append(current_num)\n            elif prev_op == '-':\n                stack.append(-current_num)\n            elif prev_op == '*':\n                stack.append(stack.pop() * current_num)\n            elif prev_op == '/':\n                # Truncate toward zero (Python's // rounds toward -inf)\n                stack.append(int(stack.pop() / current_num))\n            prev_op = c\n            current_num = 0\n\n    return sum(stack)",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6
      ],
      "build_number": [
        7,
        8
      ],
      "process_operation": [
        11
      ],
      "operation_add": [
        12,
        13
      ],
      "operation_sub": [
        14,
        15
      ],
      "operation_mul_pop": [
        16
      ],
      "operation_mul_push": [
        17
      ],
      "operation_div_pop": [
        18
      ],
      "operation_div_push": [
        20
      ],
      "update_sign": [
        21
      ],
      "reset_num": [
        22
      ],
      "start_sum": [
        24
      ],
      "sum_complete": [
        24
      ],
      "return_result": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_digit": [
        7
      ],
      "is_operator_or_end": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int calculate(String s) {\n    Stack<Integer> stack = new Stack<>();\n    int currentNum = 0;\n    char prevOp = '+';\n\n    for (int i = 0; i < s.length(); i++) {\n        char c = s.charAt(i);\n\n        if (Character.isDigit(c)) {\n            currentNum = currentNum * 10 + (c - '0');\n        }\n\n        // Process when we hit an operator or the end of string\n        if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {\n            if (prevOp == '+') {\n                stack.push(currentNum);\n            } else if (prevOp == '-') {\n                stack.push(-currentNum);\n            } else if (prevOp == '*') {\n                stack.push(stack.pop() * currentNum);\n            } else if (prevOp == '/') {\n                stack.push(stack.pop() / currentNum);\n            }\n            prevOp = c;\n            currentNum = 0;\n        }\n    }\n\n    // Sum all values in the stack\n    int result = 0;\n    for (int val : stack) {\n        result += val;\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "build_number": [
        9,
        10
      ],
      "process_operation": [
        14
      ],
      "operation_add": [
        15,
        16
      ],
      "operation_sub": [
        17,
        18
      ],
      "operation_mul_pop": [
        19
      ],
      "operation_mul_push": [
        20
      ],
      "operation_div_pop": [
        21
      ],
      "operation_div_push": [
        22
      ],
      "update_sign": [
        24
      ],
      "reset_num": [
        25
      ],
      "start_sum": [
        30,
        31,
        32
      ],
      "sum_complete": [
        30,
        31,
        32
      ],
      "return_result": [
        34
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_digit": [
        9
      ],
      "is_operator_or_end": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int calculate(string s) {\n    stack<int> stk;\n    int currentNum = 0;\n    char prevOp = '+';\n\n    for (int i = 0; i < s.size(); i++) {\n        char c = s[i];\n\n        if (isdigit(c)) {\n            currentNum = currentNum * 10 + (c - '0');\n        }\n\n        // Process when we hit an operator or the end of string\n        if ((!isdigit(c) && c != ' ') || i == s.size() - 1) {\n            if (prevOp == '+') {\n                stk.push(currentNum);\n            } else if (prevOp == '-') {\n                stk.push(-currentNum);\n            } else if (prevOp == '*') {\n                int top = stk.top(); stk.pop();\n                stk.push(top * currentNum);\n            } else if (prevOp == '/') {\n                int top = stk.top(); stk.pop();\n                stk.push(top / currentNum);\n            }\n            prevOp = c;\n            currentNum = 0;\n        }\n    }\n\n    // Sum all values in the stack\n    int result = 0;\n    while (!stk.empty()) {\n        result += stk.top();\n        stk.pop();\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "build_number": [
        9,
        10
      ],
      "process_operation": [
        14
      ],
      "operation_add": [
        15,
        16
      ],
      "operation_sub": [
        17,
        18
      ],
      "operation_mul_pop": [
        19
      ],
      "operation_mul_push": [
        21
      ],
      "operation_div_pop": [
        22
      ],
      "operation_div_push": [
        24
      ],
      "update_sign": [
        26
      ],
      "reset_num": [
        27
      ],
      "start_sum": [
        32,
        33,
        34
      ],
      "sum_complete": [
        32,
        33,
        34
      ],
      "return_result": [
        37
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_digit": [
        9
      ],
      "is_operator_or_end": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int Calculate(string s) {\n    Stack<int> stack = new Stack<int>();\n    int currentNum = 0;\n    char prevOp = '+';\n\n    for (int i = 0; i < s.Length; i++) {\n        char c = s[i];\n\n        if (char.IsDigit(c)) {\n            currentNum = currentNum * 10 + (c - '0');\n        }\n\n        // Process when we hit an operator or the end of string\n        if ((!char.IsDigit(c) && c != ' ') || i == s.Length - 1) {\n            if (prevOp == '+') {\n                stack.Push(currentNum);\n            } else if (prevOp == '-') {\n                stack.Push(-currentNum);\n            } else if (prevOp == '*') {\n                stack.Push(stack.Pop() * currentNum);\n            } else if (prevOp == '/') {\n                stack.Push(stack.Pop() / currentNum);\n            }\n            prevOp = c;\n            currentNum = 0;\n        }\n    }\n\n    // Sum all values in the stack\n    int result = 0;\n    foreach (int val in stack) {\n        result += val;\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "build_number": [
        9,
        10
      ],
      "process_operation": [
        14
      ],
      "operation_add": [
        15,
        16
      ],
      "operation_sub": [
        17,
        18
      ],
      "operation_mul_pop": [
        19
      ],
      "operation_mul_push": [
        20
      ],
      "operation_div_pop": [
        21
      ],
      "operation_div_push": [
        22
      ],
      "update_sign": [
        24
      ],
      "reset_num": [
        25
      ],
      "start_sum": [
        30,
        31,
        32
      ],
      "sum_complete": [
        30,
        31,
        32
      ],
      "return_result": [
        34
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_digit": [
        9
      ],
      "is_operator_or_end": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func calculate(s string) int {\n    stack := []int{}\n    currentNum := 0\n    prevOp := byte('+')\n\n    for i := 0; i < len(s); i++ {\n        c := s[i]\n\n        if c >= '0' && c <= '9' {\n            currentNum = currentNum*10 + int(c-'0')\n        }\n\n        // Process when we hit an operator or the end of string\n        if c == '+' || c == '-' || c == '*' || c == '/' || i == len(s)-1 {\n            if prevOp == '+' {\n                stack = append(stack, currentNum)\n            } else if prevOp == '-' {\n                stack = append(stack, -currentNum)\n            } else if prevOp == '*' {\n                top := stack[len(stack)-1]\n                stack[len(stack)-1] = top * currentNum\n            } else if prevOp == '/' {\n                top := stack[len(stack)-1]\n                stack[len(stack)-1] = top / currentNum\n            }\n            prevOp = c\n            currentNum = 0\n        }\n    }\n\n    result := 0\n    for _, val := range stack {\n        result += val\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "build_number": [
        9,
        10
      ],
      "process_operation": [
        14
      ],
      "operation_add": [
        15,
        16
      ],
      "operation_sub": [
        17,
        18
      ],
      "operation_mul_pop": [
        19
      ],
      "operation_mul_push": [
        21
      ],
      "operation_div_pop": [
        22
      ],
      "operation_div_push": [
        24
      ],
      "update_sign": [
        26
      ],
      "reset_num": [
        27
      ],
      "start_sum": [
        31,
        32,
        33
      ],
      "sum_complete": [
        31,
        32,
        33
      ],
      "return_result": [
        35
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_digit": [
        9
      ],
      "is_operator_or_end": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function calculate(s) {\n  const stack = [];\n  let currentNum = 0;\n  let prevOp = \"+\";\n\n  for (let i = 0; i < s.length; i++) {\n    const c = s[i];\n\n    if (c >= \"0\" && c <= \"9\") {\n      currentNum = currentNum * 10 + Number(c);\n    }\n\n    // Process when we hit an operator or the end of string\n    if (\"+-*/\".includes(c) || i === s.length - 1) {\n      if (prevOp === \"+\") {\n        stack.push(currentNum);\n      } else if (prevOp === \"-\") {\n        stack.push(-currentNum);\n      } else if (prevOp === \"*\") {\n        stack.push(stack.pop() * currentNum);\n      } else if (prevOp === \"/\") {\n        stack.push(Math.trunc(stack.pop() / currentNum));\n      }\n      prevOp = c;\n      currentNum = 0;\n    }\n  }\n\n  return stack.reduce((sum, val) => sum + val, 0);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "build_number": [
        9,
        10
      ],
      "process_operation": [
        14
      ],
      "operation_add": [
        15,
        16
      ],
      "operation_sub": [
        17,
        18
      ],
      "operation_mul_pop": [
        19
      ],
      "operation_mul_push": [
        20
      ],
      "operation_div_pop": [
        21
      ],
      "operation_div_push": [
        22
      ],
      "update_sign": [
        24
      ],
      "reset_num": [
        25
      ],
      "start_sum": [
        29
      ],
      "sum_complete": [
        29
      ],
      "return_result": [
        29
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_digit": [
        9
      ],
      "is_operator_or_end": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function calculate(s: string): number {\n    const stack: number[] = [];\n    let currentNum: number = 0;\n    let prevOp: string = '+';\n\n    for (let i = 0; i < s.length; i++) {\n        const c: string = s[i];\n\n        if (c >= '0' && c <= '9') {\n            currentNum = currentNum * 10 + Number(c);\n        }\n\n        // Process when we hit an operator or the end of string\n        if ('+-*/'.includes(c) || i === s.length - 1) {\n            if (prevOp === '+') {\n                stack.push(currentNum);\n            } else if (prevOp === '-') {\n                stack.push(-currentNum);\n            } else if (prevOp === '*') {\n                stack.push(stack.pop()! * currentNum);\n            } else if (prevOp === '/') {\n                stack.push(Math.trunc(stack.pop()! / currentNum));\n            }\n            prevOp = c;\n            currentNum = 0;\n        }\n    }\n\n    return stack.reduce((sum, val) => sum + val, 0);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "build_number": [
        9,
        10
      ],
      "process_operation": [
        14
      ],
      "operation_add": [
        15,
        16
      ],
      "operation_sub": [
        17,
        18
      ],
      "operation_mul_pop": [
        19
      ],
      "operation_mul_push": [
        20
      ],
      "operation_div_pop": [
        21
      ],
      "operation_div_push": [
        22
      ],
      "update_sign": [
        24
      ],
      "reset_num": [
        25
      ],
      "start_sum": [
        29
      ],
      "sum_complete": [
        29
      ],
      "return_result": [
        29
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_digit": [
        9
      ],
      "is_operator_or_end": [
        14
      ]
    }
  }
};

const BasicCalculatorIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "3+2*2"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "3/2"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "3+5/2"
    }
  }
];

function generateBasicCalculatorIiSteps(e: any): any[] {
  

let t=e.s,i=t.split(""),n=i.length,s=e=>e>="0"&&e<="9",a={"+":1,"-":1,"*":2,"/":2},l={};i.forEach((e,t)=>l[`elem_${t}`]={type:"arrayElement",value:e,position:t});let o=new StepRecorder({s:t},l),u=(e,t)=>o.update_visual(`elem_${e}`,{type:"arrayElement",value:i[e],position:e,state:t}),p=[],c=e=>{for(let e=0;e<=n+1;e++)o.delete_visual(`rpn_${e}`);p.forEach((t,i)=>o.update_visual(`rpn_${i}`,{type:"arrayElement",value:t,position:i,state:i===e?"current":void 0}))},d=[],h=e=>{for(let e=0;e<=n+1;e++)o.delete_visual(`stk_${e}`);d.forEach((t,i)=>o.update_visual(`stk_${i}`,{type:"stackElement",value:t,position:i,state:e?.entering&&i===d.length-1?"entering":void 0})),e?.exiting&&o.update_visual(`stk_${e.exiting.pos}`,{type:"stackElement",value:e.exiting.val,position:e.exiting.pos,state:"exiting"})};o.update_variable("phase",1),o.update_variable("stackLabel","operators"),o.record("-","Shunting-yard: first convert to RPN, then evaluate it."),o.record("init","output = [] (RPN), ops = [] (operator stack)");let m=0;for(;m<n;){let e=i[m];if(o.update_variable("i",m),o.update_visual("curr",{type:"pointer",position:m,label:"i"}),u(m,"current")," "===e)o.record("skip","A space, skip it"),u(m,"done"),m++;else if(s(e)){let e=m,t="";for(;m<n&&s(i[m]);)t+=i[m],o.update_variable("i",m),o.update_visual("curr",{type:"pointer",position:m,label:"i"}),u(m,"current"),o.record("read_digit",`Read digit '${i[m]}', the number so far is ${t}`),u(m,"done"),m++;p.push(t),c(),o.record("emit_number",`Emit s[${e}..${m}) = ${t} to the RPN output`)}else{for(;d.length>0&&a[d[d.length-1]]>=a[e];){let e=d[d.length-1];d.pop(),p.push(e),h({exiting:{val:e,pos:d.length}}),c(),o.record("pop_operator",`'${e}' has >= precedence, pop it to the RPN output`)}d.push(e),u(m,"op"),h({entering:!0}),o.record("push_operator",`Push operator '${e}' onto the operator stack`),u(m,"done"),m++}}for(;d.length>0;){let e=d[d.length-1];d.pop(),p.push(e),h({exiting:{val:e,pos:d.length}}),c(),o.record("drain_operator",`Drain '${e}' to the RPN output`)}o.delete_visual("curr"),o.update_variable("phase",2),o.update_variable("stackLabel","values");let f=[];o.record("phase2_start","Now evaluate the RPN with a value stack");for(let e=0;e<p.length;e++){let t=p[e];if(c(e),void 0===a[t])f.push(parseInt(t,10)),d.length=0,f.forEach(e=>d.push(String(e))),h({entering:!0}),o.record("push_value",`Push value ${t}`);else{let e=f.pop(),i=f.pop(),r="+"===t?i+e:"-"===t?i-e:"*"===t?i*e:Math.trunc(i/e);f.push(r),d.length=0,f.forEach(e=>d.push(String(e))),h({entering:!0}),o.record("apply_operator",`Apply '${t}': ${i} ${t} ${e} = ${r}`)}}c();let g=f[0]??0;return o.update_variable("result",g),o.record("return_result",`Return ${g}`),o.getSteps()
}

export function BasicCalculatorIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BasicCalculatorIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBasicCalculatorIiSteps(e) as any[];
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
      title="Basic Calculator II"
      slug="basic-calculator-ii"
      approaches={approaches}
      presets={BasicCalculatorIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Valid Parentheses (longest-valid-parentheses)
// ==========================================

const LongestValidParenthesesTemplates = {
  "python": {
    "language": "python",
    "code": "def longestValidParentheses(s):\n    max_len = 0\n    stack = [-1]  # Base boundary\n\n    for i in range(len(s)):\n        if s[i] == '(':\n            stack.append(i)\n        else:\n            stack.pop()\n            if not stack:\n                # Unmatched ')' becomes the new base boundary\n                stack.append(i)\n            else:\n                # Valid substring length = current index - top of stack\n                max_len = max(max_len, i - stack[-1])\n\n    return max_len",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_char": [
        5,
        6
      ],
      "found_open": [
        7
      ],
      "found_close_pop": [
        9
      ],
      "check_empty": [
        10
      ],
      "push_unmatched": [
        12
      ],
      "calculate_length": [
        15
      ],
      "update_max": [
        15
      ],
      "keep_max": [
        15
      ],
      "return_result": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "is_open": [
        6
      ],
      "stack_empty": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int longestValidParentheses(String s) {\n    int maxLen = 0;\n    Stack<Integer> stack = new Stack<>();\n    stack.push(-1); // Base boundary\n\n    for (int i = 0; i < s.length(); i++) {\n        if (s.charAt(i) == '(') {\n            stack.push(i);\n        } else {\n            stack.pop();\n            if (stack.isEmpty()) {\n                // Unmatched ')' becomes the new base boundary\n                stack.push(i);\n            } else {\n                // Valid substring length = current index - top of stack\n                maxLen = Math.max(maxLen, i - stack.peek());\n            }\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "found_open": [
        8
      ],
      "found_close_pop": [
        10
      ],
      "check_empty": [
        11
      ],
      "push_unmatched": [
        13
      ],
      "calculate_length": [
        16
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "return_result": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_open": [
        7
      ],
      "stack_empty": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int longestValidParentheses(string s) {\n    int maxLen = 0;\n    stack<int> stk;\n    stk.push(-1); // Base boundary\n\n    for (int i = 0; i < s.size(); i++) {\n        if (s[i] == '(') {\n            stk.push(i);\n        } else {\n            stk.pop();\n            if (stk.empty()) {\n                // Unmatched ')' becomes the new base boundary\n                stk.push(i);\n            } else {\n                // Valid substring length = current index - top of stack\n                maxLen = max(maxLen, i - stk.top());\n            }\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "found_open": [
        8
      ],
      "found_close_pop": [
        10
      ],
      "check_empty": [
        11
      ],
      "push_unmatched": [
        13
      ],
      "calculate_length": [
        16
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "return_result": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_open": [
        7
      ],
      "stack_empty": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LongestValidParentheses(string s) {\n    int maxLen = 0;\n    Stack<int> stack = new Stack<int>();\n    stack.Push(-1); // Base boundary\n\n    for (int i = 0; i < s.Length; i++) {\n        if (s[i] == '(') {\n            stack.Push(i);\n        } else {\n            stack.Pop();\n            if (stack.Count == 0) {\n                // Unmatched ')' becomes the new base boundary\n                stack.Push(i);\n            } else {\n                // Valid substring length = current index - top of stack\n                maxLen = Math.Max(maxLen, i - stack.Peek());\n            }\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6,
        7
      ],
      "found_open": [
        8
      ],
      "found_close_pop": [
        10
      ],
      "check_empty": [
        11
      ],
      "push_unmatched": [
        13
      ],
      "calculate_length": [
        16
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "return_result": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_open": [
        7
      ],
      "stack_empty": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestValidParentheses(s string) int {\n    maxLen := 0\n    stack := []int{-1} // Base boundary\n\n    for i := 0; i < len(s); i++ {\n        if s[i] == '(' {\n            stack = append(stack, i)\n        } else {\n            stack = stack[:len(stack)-1] // Pop\n            if len(stack) == 0 {\n                // Unmatched ')' becomes the new base boundary\n                stack = append(stack, i)\n            } else {\n                // Valid substring length = current index - top of stack\n                length := i - stack[len(stack)-1]\n                if length > maxLen {\n                    maxLen = length\n                }\n            }\n        }\n    }\n    return maxLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_char": [
        5,
        6
      ],
      "found_open": [
        7
      ],
      "found_close_pop": [
        9
      ],
      "check_empty": [
        10
      ],
      "push_unmatched": [
        12
      ],
      "calculate_length": [
        17
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        17
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "is_open": [
        6
      ],
      "stack_empty": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function longestValidParentheses(s) {\n  let maxLen = 0;\n  const stack = [-1]; // Base boundary\n\n  for (let i = 0; i < s.length; i++) {\n    if (s[i] === \"(\") {\n      stack.push(i);\n    } else {\n      stack.pop();\n      if (stack.length === 0) {\n        // Unmatched ')' becomes the new base boundary\n        stack.push(i);\n      } else {\n        // Valid substring length = current index - top of stack\n        maxLen = Math.max(maxLen, i - stack[stack.length - 1]);\n      }\n    }\n  }\n  return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_char": [
        5,
        6
      ],
      "found_open": [
        7
      ],
      "found_close_pop": [
        9
      ],
      "check_empty": [
        10
      ],
      "push_unmatched": [
        12
      ],
      "calculate_length": [
        15
      ],
      "update_max": [
        15
      ],
      "keep_max": [
        15
      ],
      "return_result": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "is_open": [
        6
      ],
      "stack_empty": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestValidParentheses(s: string): number {\n    let maxLen = 0;\n    const stack: number[] = [-1]; // Base boundary\n\n    for (let i = 0; i < s.length; i++) {\n        if (s[i] === '(') {\n            stack.push(i);\n        } else {\n            stack.pop();\n            if (stack.length === 0) {\n                // Unmatched ')' becomes the new base boundary\n                stack.push(i);\n            } else {\n                // Valid substring length = current index - top of stack\n                maxLen = Math.max(maxLen, i - stack[stack.length - 1]);\n            }\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_char": [
        5,
        6
      ],
      "found_open": [
        7
      ],
      "found_close_pop": [
        9
      ],
      "check_empty": [
        10
      ],
      "push_unmatched": [
        12
      ],
      "calculate_length": [
        15
      ],
      "update_max": [
        15
      ],
      "keep_max": [
        15
      ],
      "return_result": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "is_open": [
        6
      ],
      "stack_empty": [
        10
      ]
    }
  }
};

const LongestValidParenthesesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "(()"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": ")()())"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "(()()"
    }
  }
];

function generateLongestValidParenthesesSteps(e: any): any[] {
  

let t=e.s,n=t.split(""),a=n.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),l=[],s=0,r=e=>{let t={};return e.forEach((n,i)=>{t[`stack_${i}`]={type:"stackElement",value:n.toString(),position:i,state:i===e.length-1?"active":void 0}}),t},o=new StepRecorder({s:t},{...a});o.record("-","Start of algorithm"),l.push(-1),o.add_new_variable("stack",[...l]),o.add_new_variable("maxLength",s);let c=r(l);for(let[e,t]of Object.entries(c))o.update_visual(e,t);o.record("initialize","Initialize stack with -1 (base), maxLength = 0");for(let e=0;e<n.length;e++){let t=n[e];for(let[n,i]of(o.add_conditional("for_loop",!0),o.update_variable("i",e),o.update_variable("char",t),o.update_visual("curr",{type:"pointer",position:e,label:"i"}),Object.entries(c=r(l))))o.update_visual(n,i);if(o.record("check_char",`Check character at position ${e}: '${t}'`),"("===t){o.add_conditional("is_open",!0),l.push(e),o.update_variable("stack",[...l]);let t=r(l);for(let e=0;e<=n.length+1;e++)o.delete_visual(`stack_${e}`);for(let[e,n]of Object.entries(t))o.update_visual(e,n);o.record("found_open",`Found '(' - push index ${e} to stack`)}else{o.add_conditional("is_open",!1);let t=l.pop();o.update_variable("stack",[...l]);let i=r(l);for(let e=0;e<=n.length+1;e++)o.delete_visual(`stack_${e}`);for(let[e,t]of Object.entries(i))o.update_visual(e,t);if(o.record("found_close_pop",`Found ')' - pop from stack (popped: ${t})`),0===l.length){o.add_conditional("stack_empty",!0),l.push(e),o.update_variable("stack",[...l]);let t=r(l);for(let e=0;e<=n.length+1;e++)o.delete_visual(`stack_${e}`);for(let[e,n]of Object.entries(t))o.update_visual(e,n);o.record("push_unmatched",`Stack empty - push index ${e} (unmatched ')')`)}else{o.add_conditional("stack_empty",!1);let t=e-l[l.length-1];o.update_variable("currentLength",t),o.record("calculate_length",`Calculate length: ${e} - ${l[l.length-1]} = ${t}`),t>s?(s=t,o.update_variable("maxLength",s),o.record("update_max",`Update maxLength to ${s}`)):o.record("keep_max",`Keep maxLength = ${s} (current: ${t})`),o.delete_variable("currentLength")}}}o.add_conditional("for_loop",!1),o.update_variable("i",n.length-1),o.delete_variable("char"),o.delete_visual("curr");let d=r(l);for(let e=0;e<=n.length+1;e++)o.delete_visual(`stack_${e}`);for(let[e,t]of Object.entries(d))o.update_visual(e,t);return o.record("return_result",`Return maxLength: ${s}`),o.getSteps()
}

export function LongestValidParenthesesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestValidParenthesesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestValidParenthesesSteps(e) as any[];
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
      title="Longest Valid Parentheses"
      slug="longest-valid-parentheses"
      approaches={approaches}
      presets={LongestValidParenthesesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Next Greater Element I (next-greater-element-i)
// ==========================================

const NextGreaterElementITemplates = {
  "python": {
    "language": "python",
    "code": "def nextGreaterElement(nums1, nums2):\n    map_dict = {}\n    stack = []\n\n    for num in nums2:\n        while stack and stack[-1] < num:\n            map_dict[stack.pop()] = num\n        stack.append(num)\n\n    result = []\n    for num in nums1:\n        result.append(map_dict.get(num, -1))\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "check_stack": [
        6
      ],
      "pop_and_map": [
        7
      ],
      "push_index": [
        8
      ],
      "phase1_complete": [
        8
      ],
      "query_nums1": [
        10
      ],
      "check_query": [
        11
      ],
      "map_lookup": [
        12
      ],
      "update_result": [
        12
      ],
      "return_result": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop_nums2": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_greater": [
        6
      ],
      "for_loop_nums1": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] nextGreaterElement(int[] nums1, int[] nums2) {\n    Map<Integer, Integer> map = new HashMap<>();\n    Stack<Integer> stack = new Stack<>();\n\n    for (int num : nums2) {\n        while (!stack.isEmpty() && stack.peek() < num) {\n            map.put(stack.pop(), num);\n        }\n        stack.push(num);\n    }\n\n    int[] result = new int[nums1.length];\n    for (int i = 0; i < nums1.length; i++) {\n        result[i] = map.getOrDefault(nums1[i], -1);\n    }\n    return result;\n}",
    "lineMap": {
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "check_stack": [
        6
      ],
      "-": [
        1
      ],
      "pop_and_map": [
        7
      ],
      "push_index": [
        9
      ],
      "phase1_complete": [
        10
      ],
      "query_nums1": [
        12
      ],
      "check_query": [
        13
      ],
      "map_lookup": [
        14
      ],
      "update_result": [
        14
      ],
      "return_result": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop_nums2": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_greater": [
        6
      ],
      "for_loop_nums1": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {\n    unordered_map<int, int> map;\n    stack<int> stk;\n\n    for (int num : nums2) {\n        while (!stk.empty() && stk.top() < num) {\n            map[stk.top()] = num;\n            stk.pop();\n        }\n        stk.push(num);\n    }\n\n    vector<int> result;\n    for (int num : nums1) {\n        result.push_back(map.count(num) ? map[num] : -1);\n    }\n    return result;\n}",
    "lineMap": {
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "check_stack": [
        6
      ],
      "-": [
        1
      ],
      "pop_and_map": [
        7,
        8
      ],
      "push_index": [
        10
      ],
      "phase1_complete": [
        11
      ],
      "query_nums1": [
        13
      ],
      "check_query": [
        14
      ],
      "map_lookup": [
        15
      ],
      "update_result": [
        15
      ],
      "return_result": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop_nums2": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_greater": [
        6
      ],
      "for_loop_nums1": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] NextGreaterElement(int[] nums1, int[] nums2) {\n    Dictionary<int, int> map = new Dictionary<int, int>();\n    Stack<int> stack = new Stack<int>();\n\n    foreach (int num in nums2) {\n        while (stack.Count > 0 && stack.Peek() < num) {\n            map[stack.Pop()] = num;\n        }\n        stack.Push(num);\n    }\n\n    int[] result = new int[nums1.Length];\n    for (int i = 0; i < nums1.Length; i++) {\n        result[i] = map.ContainsKey(nums1[i]) ? map[nums1[i]] : -1;\n    }\n    return result;\n}",
    "lineMap": {
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "check_stack": [
        6
      ],
      "-": [
        1
      ],
      "pop_and_map": [
        7
      ],
      "push_index": [
        9
      ],
      "phase1_complete": [
        10
      ],
      "query_nums1": [
        12
      ],
      "check_query": [
        13
      ],
      "map_lookup": [
        14
      ],
      "update_result": [
        14
      ],
      "return_result": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop_nums2": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_greater": [
        6
      ],
      "for_loop_nums1": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func nextGreaterElement(nums1 []int, nums2 []int) []int {\n    m := make(map[int]int)\n    stack := []int{}\n\n    for _, num := range nums2 {\n        for len(stack) > 0 && stack[len(stack)-1] < num {\n            m[stack[len(stack)-1]] = num\n            stack = stack[:len(stack)-1]\n        }\n        stack = append(stack, num)\n    }\n\n    result := make([]int, len(nums1))\n    for i, num := range nums1 {\n        if val, ok := m[num]; ok {\n            result[i] = val\n        } else {\n            result[i] = -1\n        }\n    }\n    return result\n}",
    "lineMap": {
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "check_stack": [
        6
      ],
      "-": [
        1
      ],
      "pop_and_map": [
        7,
        8
      ],
      "push_index": [
        10
      ],
      "phase1_complete": [
        11
      ],
      "query_nums1": [
        13
      ],
      "check_query": [
        14
      ],
      "map_lookup": [
        15,
        16,
        17,
        18
      ],
      "update_result": [
        16,
        18
      ],
      "return_result": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop_nums2": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_greater": [
        6
      ],
      "for_loop_nums1": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function nextGreaterElement(nums1, nums2) {\n    const map = new Map();\n    const stack = [];\n\n    for (const num of nums2) {\n        while (stack.length > 0 && stack[stack.length - 1] < num) {\n            map.set(stack.pop(), num);\n        }\n        stack.push(num);\n    }\n\n    const result = [];\n    for (const num of nums1) {\n        result.push(map.has(num) ? map.get(num) : -1);\n    }\n    return result;\n}",
    "lineMap": {
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "check_stack": [
        6
      ],
      "-": [
        1
      ],
      "pop_and_map": [
        7
      ],
      "push_index": [
        9
      ],
      "phase1_complete": [
        10
      ],
      "query_nums1": [
        12
      ],
      "check_query": [
        13
      ],
      "map_lookup": [
        14
      ],
      "update_result": [
        14
      ],
      "return_result": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop_nums2": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_greater": [
        6
      ],
      "for_loop_nums1": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function nextGreaterElement(nums1: number[], nums2: number[]): number[] {\n    const map = new Map<number, number>();\n    const stack: number[] = [];\n\n    for (const num of nums2) {\n        while (stack.length > 0 && stack[stack.length - 1] < num) {\n            map.set(stack.pop()!, num);\n        }\n        stack.push(num);\n    }\n\n    const result: number[] = [];\n    for (const num of nums1) {\n        result.push(map.has(num) ? map.get(num)! : -1);\n    }\n    return result;\n}",
    "lineMap": {
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "check_stack": [
        6
      ],
      "-": [
        1
      ],
      "pop_and_map": [
        7
      ],
      "push_index": [
        9
      ],
      "phase1_complete": [
        10
      ],
      "query_nums1": [
        12
      ],
      "check_query": [
        13
      ],
      "map_lookup": [
        14
      ],
      "update_result": [
        14
      ],
      "return_result": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop_nums2": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_greater": [
        6
      ],
      "for_loop_nums1": [
        13
      ]
    }
  }
};

const NextGreaterElementIPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums1": [
        4,
        1,
        2
      ],
      "nums2": [
        1,
        3,
        4,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums1": [
        2,
        4
      ],
      "nums2": [
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums1": [
        1,
        3,
        5,
        2,
        4
      ],
      "nums2": [
        6,
        5,
        4,
        3,
        2,
        1
      ]
    }
  }
];

function generateNextGreaterElementISteps(e: any): any[] {
  

let t,n=e.nums1,r=e.nums2,a=r.reduce((e,t,n)=>(e[`elem_nums2_${n}`]={type:"arrayElement",value:t,position:n},e),{}),i=n.reduce((e,t,n)=>(e[`elem_nums1_${n}`]={type:"arrayElement",value:t,position:n},e),{}),s=[],o={},u=Array(n.length).fill(-1),c=new Map,d=e=>{let t={};return e.forEach((n,l)=>{t[`stack_${l}`]={type:"stackElement",value:r[n].toString(),position:l,state:l===e.length-1?"active":void 0}}),t},p=[],m=new StepRecorder({nums1:n,nums2:r},{...a,...i,...(t={},u.forEach((e,n)=>{let l=c.get(n)||0;t[0===l?`result_${n}`:`result_${n}_v${l}`]={type:"arrayElement",value:e,position:n}}),t)});m.record("-","Start of algorithm"),m.add_new_variable("map",{...o}),m.add_new_variable("stack",[...s]),m.add_new_variable("result",[...u]),m.record("initialize","Initialize map={}, stack=[], result=[-1, -1, ...]");for(let e=0;e<r.length;e++){let t=r[e];for(let[n,l]of(m.add_conditional("for_loop_nums2",!0),m.update_variable("i",e),m.update_variable("num",t),m.update_variable("stackIdxs",[...s]),m.update_visual("curr",{type:"pointer",position:e,label:"i"}),Object.entries(d(s))))m.update_visual(n,l);for(m.record("check_element",`Check nums2[${e}] = ${t}`);s.length>0&&r[s[s.length-1]]<t;){m.add_conditional("stack_not_empty",!0),m.add_conditional("is_greater",!0);let e=s[s.length-1];m.update_variable("topIdx",e),m.update_variable("topVal",r[e]),m.record("check_stack",`Stack top nums2[${e}] = ${r[e]} < ${t}`);let n=s.pop(),l=r[n];m.update_variable("prev_index",n),m.update_variable("poppedIdx",n),m.update_variable("poppedVal",l),m.update_variable("stack",[...s]),m.update_variable("stackIdxs",[...s]);let a=d(s);for(let e=0;e<=r.length;e++)m.delete_visual(`stack_${e}`);for(let[e,t]of Object.entries(a))m.update_visual(e,t);o[l]=t,p.push(l),m.update_variable("map",{...o}),m.update_variable("mapOrder",[...p]),m.record("pop_and_map",`Pop index ${n} (value ${l}), map[${l}] = ${t}`)}0===s.length?m.add_conditional("stack_not_empty",!1):(m.add_conditional("stack_not_empty",!0),m.add_conditional("is_greater",!1)),s.push(e),m.update_variable("stack",[...s]),m.update_variable("stackIdxs",[...s]),m.delete_variable("prev_index"),m.delete_variable("topIdx"),m.delete_variable("topVal"),m.delete_variable("poppedIdx"),m.delete_variable("poppedVal");let n=d(s);for(let e=0;e<=r.length;e++)m.delete_visual(`stack_${e}`);for(let[e,t]of Object.entries(n))m.update_visual(e,t);m.record("push_index",`Push index ${e} to stack`)}m.add_conditional("for_loop_nums2",!1),m.delete_variable("i"),m.delete_variable("num"),m.delete_visual("curr");let h=d(s);for(let e=0;e<=r.length;e++)m.delete_visual(`stack_${e}`);for(let[e,t]of Object.entries(h))m.update_visual(e,t);m.record("phase1_complete","Phase 1 complete - map built from nums2"),m.delete_variable("stackIdxs"),m.record("query_nums1","Phase 2: Query map for each element in nums1");for(let e=0;e<n.length;e++){let t=n[e];m.add_conditional("for_loop_nums1",!0),m.update_variable("j",e),m.update_variable("num",t),m.update_variable("queryVal",t),m.update_visual("curr_nums1",{type:"pointer",position:e,label:"j"}),m.record("check_query",`Check nums1[${e}] = ${t}`);let l=void 0!==o[t]?o[t]:-1;m.update_variable("answer",l),m.update_variable("isNegOne",-1===l),m.record("map_lookup",`map[${t}] = ${l}`),u[e]=l,m.update_variable("result",[...u]),c.set(e,(c.get(e)||0)+1);let r=c.get(e)-1,a=0===r?`result_${e}`:`result_${e}_v${r}`;m.delete_visual(a);let i=`result_${e}_v${c.get(e)}`;m.update_visual(i,{type:"arrayElement",value:l,position:e}),m.record("update_result",`result[${e}] = ${l}`)}return m.add_conditional("for_loop_nums1",!1),m.delete_variable("j"),m.delete_variable("num"),m.delete_variable("queryVal"),m.delete_variable("answer"),m.delete_variable("isNegOne"),m.delete_visual("curr_nums1"),m.record("return_result",`Return result: [${u.join(", ")}]`),m.getSteps()
}

export function NextGreaterElementIProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NextGreaterElementITemplates,
      generateSteps: (e: any) => {
        const recorded = generateNextGreaterElementISteps(e) as any[];
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
      title="Next Greater Element I"
      slug="next-greater-element-i"
      approaches={approaches}
      presets={NextGreaterElementIPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Daily Temperatures (daily-temperatures)
// ==========================================

const DailyTemperaturesTemplates = {
  "python": {
    "language": "python",
    "code": "def dailyTemperatures(temperatures):\n  stack = []\n  result = [0] * len(temperatures)\n\n  for i in range(len(temperatures)):\n    while stack and temperatures[i] > temperatures[stack[-1]]:\n      prev_index = stack.pop()\n      result[prev_index] = i - prev_index\n\n    stack.append(i)\n\n  return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_day": [
        5
      ],
      "compare_warmer": [
        7
      ],
      "update_result": [
        8
      ],
      "push_stack": [
        10
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_warmer": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] dailyTemperatures(int[] temperatures) {\n    Stack<Integer> stack = new Stack<>();\n    int[] result = new int[temperatures.length];\n\n    for (int i = 0; i < temperatures.length; i++) {\n        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {\n            int prevIndex = stack.pop();\n            result[prevIndex] = i - prevIndex;\n        }\n\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_day": [
        5
      ],
      "compare_warmer": [
        7
      ],
      "update_result": [
        8
      ],
      "push_stack": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_warmer": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> dailyTemperatures(vector<int>& temperatures) {\n    stack<int> stk;\n    vector<int> result(temperatures.size(), 0);\n\n    for (int i = 0; i < temperatures.size(); i++) {\n        while (!stk.empty() && temperatures[i] > temperatures[stk.top()]) {\n            int prevIndex = stk.top();\n            stk.pop();\n            result[prevIndex] = i - prevIndex;\n        }\n\n        stk.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_day": [
        5
      ],
      "compare_warmer": [
        7,
        8
      ],
      "update_result": [
        9
      ],
      "push_stack": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_warmer": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] DailyTemperatures(int[] temperatures) {\n    Stack<int> stack = new Stack<int>();\n    int[] result = new int[temperatures.Length];\n\n    for (int i = 0; i < temperatures.Length; i++) {\n        while (stack.Count > 0 && temperatures[i] > temperatures[stack.Peek()]) {\n            int prevIndex = stack.Pop();\n            result[prevIndex] = i - prevIndex;\n        }\n\n        stack.Push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_day": [
        5
      ],
      "compare_warmer": [
        7
      ],
      "update_result": [
        8
      ],
      "push_stack": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_warmer": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func dailyTemperatures(temperatures []int) []int {\n    stack := []int{}\n    result := make([]int, len(temperatures))\n\n    for i := 0; i < len(temperatures); i++ {\n        for len(stack) > 0 && temperatures[i] > temperatures[stack[len(stack)-1]] {\n            prevIndex := stack[len(stack)-1]\n            stack = stack[:len(stack)-1]\n            result[prevIndex] = i - prevIndex\n        }\n\n        stack = append(stack, i)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_day": [
        5
      ],
      "compare_warmer": [
        7,
        8
      ],
      "update_result": [
        9
      ],
      "push_stack": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_warmer": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function dailyTemperatures(temperatures) {\n    const stack = [];\n    const result = new Array(temperatures.length).fill(0);\n\n    for (let i = 0; i < temperatures.length; i++) {\n        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n            const prevIndex = stack.pop();\n            result[prevIndex] = i - prevIndex;\n        }\n\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_day": [
        5
      ],
      "compare_warmer": [
        7
      ],
      "update_result": [
        8
      ],
      "push_stack": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_warmer": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function dailyTemperatures(temperatures: number[]): number[] {\n    const stack: number[] = [];\n    const result: number[] = new Array(temperatures.length).fill(0);\n\n    for (let i = 0; i < temperatures.length; i++) {\n        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n            const prevIndex = stack.pop()!;\n            result[prevIndex] = i - prevIndex;\n        }\n\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_day": [
        5
      ],
      "compare_warmer": [
        7
      ],
      "update_result": [
        8
      ],
      "push_stack": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "stack_not_empty": [
        6
      ],
      "is_warmer": [
        6
      ]
    }
  }
};

const DailyTemperaturesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "temperatures": [
        73,
        74,
        75,
        71,
        69,
        72,
        76,
        73
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "temperatures": [
        30,
        40,
        50,
        60
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "temperatures": [
        30,
        60,
        90
      ]
    }
  }
];

function generateDailyTemperaturesSteps(e: any): any[] {
  

let t=e.temperatures,r=t.length,a=t.reduce((e,t,r)=>(e[`temp_${r}`]={type:"arrayElement",value:t,position:r},e),{}),l=Array(r).fill(0),n=l.reduce((e,t,r)=>(e[`result_${r}`]={type:"arrayElement",value:t,position:r},e),{}),s=new StepRecorder({temperatures:t},{...a,...n}),o=(e,t)=>s.update_visual(`result_${e}`,{type:"arrayElement",value:t,position:e});s.record("-","Right to left: reuse computed answers to jump over cooler days."),s.update_variable("result",[...l]),s.record("init","result = [0, ...]; fill it from the right so jumps are ready.");for(let e=r-2;e>=0;e--){s.update_variable("i",e),s.update_variable("tempI",t[e]),s.delete_variable("jumpBy"),s.delete_variable("dist"),s.update_visual("iptr",{type:"pointer",position:e,label:"i"});let i=e+1;for(s.update_variable("j",i),s.update_variable("tempJ",t[i]),s.update_visual("jptr",{type:"pointer",position:i,label:"j"}),s.record("start_day",`Day ${e} is ${t[e]}\xb0: start comparing at day ${i}.`);i<r;){if(s.update_variable("j",i),s.update_variable("tempJ",t[i]),s.update_visual("jptr",{type:"pointer",position:i,label:"j"}),t[i]>t[e]){l[e]=i-e,s.update_variable("dist",i-e),s.delete_variable("jumpBy"),o(e,l[e]),s.update_variable("result",[...l]),s.record("found_warmer",`Day ${i} (${t[i]}\xb0) is warmer: result[${e}] = ${i} - ${e} = ${l[e]}.`);break}if(0===l[i]){s.delete_variable("jumpBy"),s.record("dead_end",`Day ${i} (${t[i]}\xb0) never warms up, so neither does day ${e}: result[${e}] = 0.`);break}{let r=l[i];s.update_variable("jumpBy",r),s.record("jump",`Day ${i} (${t[i]}\xb0) <= ${t[e]}\xb0: jump ahead by result[${i}] = ${r}.`),i+=r}}}return s.delete_variable("i"),s.delete_variable("tempI"),s.delete_variable("j"),s.delete_variable("tempJ"),s.delete_variable("jumpBy"),s.delete_variable("dist"),s.delete_visual("iptr"),s.delete_visual("jptr"),s.update_variable("return",[...l]),s.record("complete",`Done. Days until warmer: [${l.join(", ")}]`),s.getSteps()
}

export function DailyTemperaturesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DailyTemperaturesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDailyTemperaturesSteps(e) as any[];
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
      title="Daily Temperatures"
      slug="daily-temperatures"
      approaches={approaches}
      presets={DailyTemperaturesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// 132 Pattern (132-pattern)
// ==========================================

const P132PatternTemplates = {
  "python": {
    "language": "python",
    "code": "def find132pattern(nums):\n    n = len(nums)\n    if n < 3:\n        return False\n\n    stack = []\n    third = float('-inf')\n\n    for i in range(n - 1, -1, -1):\n        if nums[i] < third:\n            return True\n\n        while stack and nums[i] > stack[-1]:\n            third = max(third, stack.pop())\n        stack.append(nums[i])\n\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        6,
        7
      ],
      "check_element": [
        9
      ],
      "found_pattern": [
        10
      ],
      "pattern_check_step": [
        9
      ],
      "compare_stack": [
        13
      ],
      "update_third": [
        14
      ],
      "push_stack": [
        15
      ],
      "no_pattern_found": [
        17
      ],
      "return_result": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "pattern_check": [
        10
      ],
      "stack_not_empty": [
        13
      ],
      "is_greater": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean find132pattern(int[] nums) {\n    int n = nums.length;\n    if (n < 3) return false;\n\n    Deque<Integer> stack = new ArrayDeque<>();\n    int third = Integer.MIN_VALUE;\n\n    for (int i = n - 1; i >= 0; i--) {\n        if (nums[i] < third) return true;\n\n        while (!stack.isEmpty() && nums[i] > stack.peek()) {\n            third = Math.max(third, stack.pop());\n        }\n        stack.push(nums[i]);\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "check_element": [
        8
      ],
      "found_pattern": [
        9
      ],
      "pattern_check_step": [
        8
      ],
      "compare_stack": [
        11
      ],
      "update_third": [
        12
      ],
      "push_stack": [
        14
      ],
      "no_pattern_found": [
        16
      ],
      "return_result": [
        9
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "pattern_check": [
        9
      ],
      "stack_not_empty": [
        11
      ],
      "is_greater": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool find132pattern(vector<int>& nums) {\n    int n = nums.size();\n    if (n < 3) return false;\n\n    stack<int> st;\n    int third = INT_MIN;\n\n    for (int i = n - 1; i >= 0; i--) {\n        if (nums[i] < third) return true;\n\n        while (!st.empty() && nums[i] > st.top()) {\n            third = max(third, st.top());\n            st.pop();\n        }\n        st.push(nums[i]);\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "check_element": [
        8
      ],
      "found_pattern": [
        9
      ],
      "pattern_check_step": [
        8
      ],
      "compare_stack": [
        11
      ],
      "update_third": [
        12,
        13
      ],
      "push_stack": [
        15
      ],
      "no_pattern_found": [
        17
      ],
      "return_result": [
        9
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "pattern_check": [
        9
      ],
      "stack_not_empty": [
        11
      ],
      "is_greater": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool Find132pattern(int[] nums) {\n    int n = nums.Length;\n    if (n < 3) return false;\n\n    Stack<int> stack = new Stack<int>();\n    int third = int.MinValue;\n\n    for (int i = n - 1; i >= 0; i--) {\n        if (nums[i] < third) return true;\n\n        while (stack.Count > 0 && nums[i] > stack.Peek()) {\n            third = Math.Max(third, stack.Pop());\n        }\n        stack.Push(nums[i]);\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "check_element": [
        8
      ],
      "found_pattern": [
        9
      ],
      "pattern_check_step": [
        8
      ],
      "compare_stack": [
        11
      ],
      "update_third": [
        12
      ],
      "push_stack": [
        14
      ],
      "no_pattern_found": [
        16
      ],
      "return_result": [
        9
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "pattern_check": [
        9
      ],
      "stack_not_empty": [
        11
      ],
      "is_greater": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func find132pattern(nums []int) bool {\n    n := len(nums)\n    if n < 3 {\n        return false\n    }\n\n    stack := []int{}\n    third := -1 << 31\n\n    for i := n - 1; i >= 0; i-- {\n        if nums[i] < third {\n            return true\n        }\n\n        for len(stack) > 0 && nums[i] > stack[len(stack)-1] {\n            top := stack[len(stack)-1]\n            stack = stack[:len(stack)-1]\n            if top > third {\n                third = top\n            }\n        }\n        stack = append(stack, nums[i])\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        7,
        8
      ],
      "check_element": [
        10
      ],
      "found_pattern": [
        11
      ],
      "pattern_check_step": [
        10
      ],
      "compare_stack": [
        15
      ],
      "update_third": [
        16,
        17,
        18,
        19
      ],
      "push_stack": [
        22
      ],
      "no_pattern_found": [
        24
      ],
      "return_result": [
        12
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "pattern_check": [
        11
      ],
      "stack_not_empty": [
        15
      ],
      "is_greater": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var find132pattern = function(nums) {\n    const n = nums.length;\n    if (n < 3) return false;\n\n    const stack = [];\n    let third = -Infinity;\n\n    for (let i = n - 1; i >= 0; i--) {\n        if (nums[i] < third) return true;\n\n        while (stack.length > 0 && nums[i] > stack[stack.length - 1]) {\n            third = Math.max(third, stack.pop());\n        }\n        stack.push(nums[i]);\n    }\n    return false;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "check_element": [
        8
      ],
      "found_pattern": [
        9
      ],
      "pattern_check_step": [
        8
      ],
      "compare_stack": [
        11
      ],
      "update_third": [
        12
      ],
      "push_stack": [
        14
      ],
      "no_pattern_found": [
        16
      ],
      "return_result": [
        9
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "pattern_check": [
        9
      ],
      "stack_not_empty": [
        11
      ],
      "is_greater": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function find132pattern(nums: number[]): boolean {\n    const n = nums.length;\n    if (n < 3) return false;\n\n    const stack: number[] = [];\n    let third = -Infinity;\n\n    for (let i = n - 1; i >= 0; i--) {\n        if (nums[i] < third) return true;\n\n        while (stack.length > 0 && nums[i] > stack[stack.length - 1]) {\n            third = Math.max(third, stack.pop()!);\n        }\n        stack.push(nums[i]);\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "check_element": [
        8
      ],
      "found_pattern": [
        9
      ],
      "pattern_check_step": [
        8
      ],
      "compare_stack": [
        11
      ],
      "update_third": [
        12
      ],
      "push_stack": [
        14
      ],
      "no_pattern_found": [
        16
      ],
      "return_result": [
        9
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "pattern_check": [
        9
      ],
      "stack_not_empty": [
        11
      ],
      "is_greater": [
        11
      ]
    }
  }
};

const P132PatternPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        3,
        1,
        4,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        3,
        5,
        0,
        3,
        4
      ]
    }
  }
];

function generateP132PatternSteps(e: any): any[] {
  let r=Number.MIN_SAFE_INTEGER;

let t=e.nums,n=t.length,a=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),l=[],s=[],o=r,u=-1,d=-1,c=!1,p=new StepRecorder({nums:t},{...a});p.update_variable("nums",[...t]),p.record("-","Start of algorithm"),p.update_variable("stack",[...l]),p.update_variable("third",o),p.update_variable("thirdIdx",u),p.update_variable("threeIdx",d),p.update_variable("result",c),p.record("initialize","Initialize an empty stack and third = -inf");for(let e=n-1;e>=0;e--){let n=t[e];if(p.add_conditional("for_loop",!0),p.update_variable("i",e),p.update_variable("num",n),p.update_variable("stack",[...l]),p.update_variable("third",o),p.update_variable("thirdIdx",u),p.update_variable("threeIdx",d),p.record("check_element",`Check nums[${e}] = ${n} (scanning right to left)`),n<o){p.add_conditional("pattern_check",!0),c=!0,p.update_variable("result",c),p.update_variable("oneIdx",e),p.record("found_pattern",`nums[${e}] = ${n} < third = ${o}: found a 132 pattern`);break}for(p.add_conditional("pattern_check",!1),p.record("pattern_check_step",`nums[${e}] = ${n} >= third = ${o<-1e15?"-inf":o}, keep scanning`);l.length>0&&n>l[l.length-1];){p.add_conditional("stack_not_empty",!0),p.add_conditional("is_greater",!0),p.update_variable("topVal",l[l.length-1]),p.record("compare_stack",`nums[${e}] = ${n} > top = ${l[l.length-1]}, pop it as the new "2"`);let t=l.pop(),i=s.pop();o=t,u=i,d=e,p.update_variable("poppedVal",t),p.update_variable("third",o),p.update_variable("thirdIdx",u),p.update_variable("threeIdx",d),p.update_variable("stack",[...l]),p.record("update_third",`third = ${o} (a "2" with a bigger "3" to its right)`)}0===l.length?p.add_conditional("stack_not_empty",!1):(p.add_conditional("stack_not_empty",!0),p.add_conditional("is_greater",!1)),l.push(n),s.push(e),p.update_variable("stack",[...l]),p.delete_variable("poppedVal"),p.record("push_stack",`Push ${n} onto the stack (a candidate "3")`)}return p.add_conditional("for_loop",!1),p.delete_variable("i"),c?p.record("return_result","Return true: a 132 pattern exists"):p.record("no_pattern_found","Return false: no 132 pattern exists"),p.getSteps()
}

export function P132PatternProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: P132PatternTemplates,
      generateSteps: (e: any) => {
        const recorded = generateP132PatternSteps(e) as any[];
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
      title="132 Pattern"
      slug="132-pattern"
      approaches={approaches}
      presets={P132PatternPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of Visible People in a Queue (number-of-visible-people-in-a-queue)
// ==========================================

const NumberOfVisiblePeopleInAQueueTemplates = {
  "python": {
    "language": "python",
    "code": "def canSeePersonsCount(heights):\n    n = len(heights)\n    result = [0] * n\n    stack = []\n\n    for i in range(n - 1, -1, -1):\n        visible_count = 0\n\n        while stack and heights[i] > heights[stack[-1]]:\n            stack.pop()\n            visible_count += 1\n\n        if stack:\n            visible_count += 1\n\n        result[i] = visible_count\n        stack.append(i)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_person": [
        6
      ],
      "compare_shorter": [
        9
      ],
      "pop_shorter": [
        10,
        11
      ],
      "add_taller": [
        13,
        14
      ],
      "update_result": [
        16
      ],
      "push_index": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "stack_not_empty": [
        9,
        13
      ],
      "is_taller": [
        9
      ],
      "has_taller_ahead": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] canSeePersonsCount(int[] heights) {\n    int n = heights.length;\n    int[] result = new int[n];\n    Stack<Integer> stack = new Stack<>();\n\n    for (int i = n - 1; i >= 0; i--) {\n        int visibleCount = 0;\n\n        while (!stack.isEmpty() && heights[i] > heights[stack.peek()]) {\n            stack.pop();\n            visibleCount++;\n        }\n\n        if (!stack.isEmpty()) {\n            visibleCount++;\n        }\n\n        result[i] = visibleCount;\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_person": [
        6
      ],
      "compare_shorter": [
        9
      ],
      "pop_shorter": [
        10,
        11
      ],
      "add_taller": [
        14,
        15
      ],
      "update_result": [
        18
      ],
      "push_index": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "stack_not_empty": [
        9,
        14
      ],
      "is_taller": [
        9
      ],
      "has_taller_ahead": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> canSeePersonsCount(vector<int>& heights) {\n    int n = heights.size();\n    vector<int> result(n, 0);\n    stack<int> stk;\n\n    for (int i = n - 1; i >= 0; i--) {\n        int visibleCount = 0;\n\n        while (!stk.empty() && heights[i] > heights[stk.top()]) {\n            stk.pop();\n            visibleCount++;\n        }\n\n        if (!stk.empty()) {\n            visibleCount++;\n        }\n\n        result[i] = visibleCount;\n        stk.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_person": [
        6
      ],
      "compare_shorter": [
        9
      ],
      "pop_shorter": [
        10,
        11
      ],
      "add_taller": [
        14,
        15
      ],
      "update_result": [
        18
      ],
      "push_index": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "stack_not_empty": [
        9,
        14
      ],
      "is_taller": [
        9
      ],
      "has_taller_ahead": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] CanSeePersonsCount(int[] heights) {\n    int n = heights.Length;\n    int[] result = new int[n];\n    Stack<int> stack = new Stack<int>();\n\n    for (int i = n - 1; i >= 0; i--) {\n        int visibleCount = 0;\n\n        while (stack.Count > 0 && heights[i] > heights[stack.Peek()]) {\n            stack.Pop();\n            visibleCount++;\n        }\n\n        if (stack.Count > 0) {\n            visibleCount++;\n        }\n\n        result[i] = visibleCount;\n        stack.Push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_person": [
        6
      ],
      "compare_shorter": [
        9
      ],
      "pop_shorter": [
        10,
        11
      ],
      "add_taller": [
        14,
        15
      ],
      "update_result": [
        18
      ],
      "push_index": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "stack_not_empty": [
        9,
        14
      ],
      "is_taller": [
        9
      ],
      "has_taller_ahead": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func canSeePersonsCount(heights []int) []int {\n    n := len(heights)\n    result := make([]int, n)\n    stack := []int{}\n\n    for i := n - 1; i >= 0; i-- {\n        visibleCount := 0\n\n        for len(stack) > 0 && heights[i] > heights[stack[len(stack)-1]] {\n            stack = stack[:len(stack)-1]\n            visibleCount++\n        }\n\n        if len(stack) > 0 {\n            visibleCount++\n        }\n\n        result[i] = visibleCount\n        stack = append(stack, i)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_person": [
        6
      ],
      "compare_shorter": [
        9
      ],
      "pop_shorter": [
        10,
        11
      ],
      "add_taller": [
        14,
        15
      ],
      "update_result": [
        18
      ],
      "push_index": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "stack_not_empty": [
        9,
        14
      ],
      "is_taller": [
        9
      ],
      "has_taller_ahead": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function canSeePersonsCount(heights) {\n    const n = heights.length;\n    const result = new Array(n).fill(0);\n    const stack = [];\n\n    for (let i = n - 1; i >= 0; i--) {\n        let visibleCount = 0;\n\n        while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {\n            stack.pop();\n            visibleCount++;\n        }\n\n        if (stack.length > 0) {\n            visibleCount++;\n        }\n\n        result[i] = visibleCount;\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_person": [
        6
      ],
      "compare_shorter": [
        9
      ],
      "pop_shorter": [
        10,
        11
      ],
      "add_taller": [
        14,
        15
      ],
      "update_result": [
        18
      ],
      "push_index": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "stack_not_empty": [
        9,
        14
      ],
      "is_taller": [
        9
      ],
      "has_taller_ahead": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function canSeePersonsCount(heights: number[]): number[] {\n    const n = heights.length;\n    const result: number[] = new Array(n).fill(0);\n    const stack: number[] = [];\n\n    for (let i = n - 1; i >= 0; i--) {\n        let visibleCount = 0;\n\n        while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {\n            stack.pop();\n            visibleCount++;\n        }\n\n        if (stack.length > 0) {\n            visibleCount++;\n        }\n\n        result[i] = visibleCount;\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_person": [
        6
      ],
      "compare_shorter": [
        9
      ],
      "pop_shorter": [
        10,
        11
      ],
      "add_taller": [
        14,
        15
      ],
      "update_result": [
        18
      ],
      "push_index": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "stack_not_empty": [
        9,
        14
      ],
      "is_taller": [
        9
      ],
      "has_taller_ahead": [
        14
      ]
    }
  }
};

const NumberOfVisiblePeopleInAQueuePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "heights": [
        10,
        6,
        8,
        5,
        11,
        9
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "heights": [
        5,
        1,
        2,
        3,
        10
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "heights": [
        3,
        1,
        4,
        2,
        5
      ]
    }
  }
];

function generateNumberOfVisiblePeopleInAQueueSteps(e: any): any[] {
  

let t=e.heights,i=t.length,r=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=[],a=Array(i).fill(0),s=new StepRecorder({heights:t},{...r});s.update_variable("heights",[...t]),s.record("-","Start of algorithm"),s.update_variable("stack",[...l]),s.update_variable("stackIdxs",[...l]),s.update_variable("result",[...a]),s.record("initialize","Initialize an empty stack and result filled with 0s");for(let e=i-1;e>=0;e--){let i=0,n=[];for(s.add_conditional("for_loop",!0),s.update_variable("i",e),s.update_variable("height",t[e]),s.update_variable("visibleCount",0),s.update_variable("stackIdxs",[...l]),s.update_variable("visibleShort",[]),s.update_variable("result",[...a]),s.delete_variable("tallerIdx"),s.delete_variable("poppedIdx"),s.record("check_person",`Person ${e} has height ${t[e]} and looks to the right`);l.length>0&&t[e]>t[l[l.length-1]];){s.add_conditional("stack_not_empty",!0),s.add_conditional("is_taller",!0);let r=l[l.length-1];s.update_variable("poppedIdx",r),s.record("compare_shorter",`Person ${e} (${t[e]}) is taller than person ${r} (${t[r]}): visible`),l.pop(),i++,n.push(r),s.update_variable("visibleCount",i),s.update_variable("visibleShort",[...n]),s.update_variable("stackIdxs",[...l]),s.record("pop_shorter",`See person ${r}. visible = ${i}`)}if(0===l.length)s.add_conditional("stack_not_empty",!1),s.add_conditional("has_taller_ahead",!1);else{s.add_conditional("stack_not_empty",!0),s.add_conditional("is_taller",!1),s.add_conditional("has_taller_ahead",!0),i++;let n=l[l.length-1];s.update_variable("visibleCount",i),s.update_variable("tallerIdx",n),s.record("add_taller",`Person ${e} also sees the taller person ${n} (${t[n]}), then the view is blocked. visible = ${i}`)}a[e]=i,s.update_variable("result",[...a]),s.record("update_result",`result[${e}] = ${i}`),l.push(e),s.update_variable("stackIdxs",[...l]),s.record("push_index",`Push person ${e} onto the stack`)}return s.add_conditional("for_loop",!1),s.delete_variable("i"),s.delete_variable("visibleCount"),s.delete_variable("poppedIdx"),s.delete_variable("tallerIdx"),s.record("complete",`Done. Visible people: [${a.join(", ")}]`),s.getSteps()
}

export function NumberOfVisiblePeopleInAQueueProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOfVisiblePeopleInAQueueTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNumberOfVisiblePeopleInAQueueSteps(e) as any[];
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
      title="Number of Visible People in a Queue"
      slug="number-of-visible-people-in-a-queue"
      approaches={approaches}
      presets={NumberOfVisiblePeopleInAQueuePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Largest Rectangle in Histogram (largest-rectangle-in-histogram)
// ==========================================

const LargestRectangleInHistogramTemplates = {
  "python": {
    "language": "python",
    "code": "def largestRectangleArea(heights):\n  stack = []\n  max_area = 0\n\n  for i in range(len(heights)):\n    while stack and heights[i] < heights[stack[-1]]:\n      height = heights[stack.pop()]\n      width = i if not stack else i - stack[-1] - 1\n      current_area = height * width\n      max_area = max(max_area, current_area)\n\n    stack.append(i)\n\n  while stack:\n    height = heights[stack.pop()]\n    width = len(heights) if not stack else len(heights) - stack[-1] - 1\n    current_area = height * width\n    max_area = max(max_area, current_area)\n\n  return max_area",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_bar": [
        5
      ],
      "while_check": [
        6
      ],
      "calculate_area": [
        7,
        8,
        9
      ],
      "update_max": [
        10
      ],
      "push_index": [
        12
      ],
      "final_while_check": [
        14
      ],
      "final_calculate": [
        15,
        16,
        17
      ],
      "return": [
        20
      ],
      "final_update_max": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_condition": [
        6
      ],
      "update_max": [
        10
      ],
      "final_while": [
        14
      ],
      "final_update_max": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int largestRectangleArea(int[] heights) {\n    Stack<Integer> stack = new Stack<>();\n    int maxArea = 0;\n\n    for (int i = 0; i < heights.length; i++) {\n        while (!stack.isEmpty() && heights[i] < heights[stack.peek()]) {\n            int height = heights[stack.pop()];\n            int width = stack.isEmpty() ? i : i - stack.peek() - 1;\n            int currentArea = height * width;\n            maxArea = Math.max(maxArea, currentArea);\n        }\n\n        stack.push(i);\n    }\n\n    while (!stack.isEmpty()) {\n        int height = heights[stack.pop()];\n        int width = stack.isEmpty() ? heights.length : heights.length - stack.peek() - 1;\n        int currentArea = height * width;\n        maxArea = Math.max(maxArea, currentArea);\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_bar": [
        5
      ],
      "while_check": [
        6
      ],
      "calculate_area": [
        7,
        8,
        9
      ],
      "update_max": [
        10
      ],
      "push_index": [
        13
      ],
      "final_while_check": [
        16
      ],
      "final_calculate": [
        17,
        18,
        19
      ],
      "return": [
        23
      ],
      "final_update_max": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_condition": [
        6
      ],
      "update_max": [
        10
      ],
      "final_while": [
        16
      ],
      "final_update_max": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int largestRectangleArea(vector<int>& heights) {\n    stack<int> stk;\n    int maxArea = 0;\n\n    for (int i = 0; i < heights.size(); i++) {\n        while (!stk.empty() && heights[i] < heights[stk.top()]) {\n            int height = heights[stk.top()];\n            stk.pop();\n            int width = stk.empty() ? i : i - stk.top() - 1;\n            int currentArea = height * width;\n            maxArea = max(maxArea, currentArea);\n        }\n\n        stk.push(i);\n    }\n\n    while (!stk.empty()) {\n        int height = heights[stk.top()];\n        stk.pop();\n        int width = stk.empty() ? (int)heights.size() : (int)heights.size() - stk.top() - 1;\n        int currentArea = height * width;\n        maxArea = max(maxArea, currentArea);\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_bar": [
        5
      ],
      "while_check": [
        6
      ],
      "calculate_area": [
        7,
        8,
        9,
        10
      ],
      "update_max": [
        11
      ],
      "push_index": [
        14
      ],
      "final_while_check": [
        17
      ],
      "final_calculate": [
        18,
        19,
        20,
        21
      ],
      "return": [
        25
      ],
      "final_update_max": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_condition": [
        6
      ],
      "update_max": [
        11
      ],
      "final_while": [
        17
      ],
      "final_update_max": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LargestRectangleArea(int[] heights) {\n    Stack<int> stack = new Stack<int>();\n    int maxArea = 0;\n\n    for (int i = 0; i < heights.Length; i++) {\n        while (stack.Count > 0 && heights[i] < heights[stack.Peek()]) {\n            int height = heights[stack.Pop()];\n            int width = stack.Count == 0 ? i : i - stack.Peek() - 1;\n            int currentArea = height * width;\n            maxArea = Math.Max(maxArea, currentArea);\n        }\n\n        stack.Push(i);\n    }\n\n    while (stack.Count > 0) {\n        int height = heights[stack.Pop()];\n        int width = stack.Count == 0 ? heights.Length : heights.Length - stack.Peek() - 1;\n        int currentArea = height * width;\n        maxArea = Math.Max(maxArea, currentArea);\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_bar": [
        5
      ],
      "while_check": [
        6
      ],
      "calculate_area": [
        7,
        8,
        9
      ],
      "update_max": [
        10
      ],
      "push_index": [
        13
      ],
      "final_while_check": [
        16
      ],
      "final_calculate": [
        17,
        18,
        19
      ],
      "return": [
        23
      ],
      "final_update_max": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_condition": [
        6
      ],
      "update_max": [
        10
      ],
      "final_while": [
        16
      ],
      "final_update_max": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func largestRectangleArea(heights []int) int {\n    stack := []int{}\n    maxArea := 0\n\n    for i := 0; i < len(heights); i++ {\n        for len(stack) > 0 && heights[i] < heights[stack[len(stack)-1]] {\n            height := heights[stack[len(stack)-1]]\n            stack = stack[:len(stack)-1]\n            var width int\n            if len(stack) == 0 {\n                width = i\n            } else {\n                width = i - stack[len(stack)-1] - 1\n            }\n            currentArea := height * width\n            if currentArea > maxArea {\n                maxArea = currentArea\n            }\n        }\n\n        stack = append(stack, i)\n    }\n\n    for len(stack) > 0 {\n        height := heights[stack[len(stack)-1]]\n        stack = stack[:len(stack)-1]\n        var width int\n        if len(stack) == 0 {\n            width = len(heights)\n        } else {\n            width = len(heights) - stack[len(stack)-1] - 1\n        }\n        currentArea := height * width\n        if currentArea > maxArea {\n            maxArea = currentArea\n        }\n    }\n\n    return maxArea\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_bar": [
        5
      ],
      "while_check": [
        6
      ],
      "calculate_area": [
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
      "update_max": [
        16,
        17
      ],
      "push_index": [
        21
      ],
      "final_while_check": [
        24
      ],
      "final_calculate": [
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
      "return": [
        39
      ],
      "final_update_max": [
        34,
        35
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_condition": [
        6
      ],
      "update_max": [
        16
      ],
      "final_while": [
        24
      ],
      "final_update_max": [
        34
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function largestRectangleArea(heights) {\n    const stack = [];\n    let maxArea = 0;\n\n    for (let i = 0; i < heights.length; i++) {\n        while (stack.length > 0 && heights[i] < heights[stack[stack.length - 1]]) {\n            const height = heights[stack.pop()];\n            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n            const currentArea = height * width;\n            maxArea = Math.max(maxArea, currentArea);\n        }\n\n        stack.push(i);\n    }\n\n    while (stack.length > 0) {\n        const height = heights[stack.pop()];\n        const width = stack.length === 0 ? heights.length : heights.length - stack[stack.length - 1] - 1;\n        const currentArea = height * width;\n        maxArea = Math.max(maxArea, currentArea);\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_bar": [
        5
      ],
      "while_check": [
        6
      ],
      "calculate_area": [
        7,
        8,
        9
      ],
      "update_max": [
        10
      ],
      "push_index": [
        13
      ],
      "final_while_check": [
        16
      ],
      "final_calculate": [
        17,
        18,
        19
      ],
      "return": [
        23
      ],
      "final_update_max": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_condition": [
        6
      ],
      "update_max": [
        10
      ],
      "final_while": [
        16
      ],
      "final_update_max": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function largestRectangleArea(heights: number[]): number {\n    const stack: number[] = [];\n    let maxArea = 0;\n\n    for (let i = 0; i < heights.length; i++) {\n        while (stack.length > 0 && heights[i] < heights[stack[stack.length - 1]]) {\n            const height = heights[stack.pop()!];\n            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n            const currentArea = height * width;\n            maxArea = Math.max(maxArea, currentArea);\n        }\n\n        stack.push(i);\n    }\n\n    while (stack.length > 0) {\n        const height = heights[stack.pop()!];\n        const width = stack.length === 0 ? heights.length : heights.length - stack[stack.length - 1] - 1;\n        const currentArea = height * width;\n        maxArea = Math.max(maxArea, currentArea);\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_bar": [
        5
      ],
      "while_check": [
        6
      ],
      "calculate_area": [
        7,
        8,
        9
      ],
      "update_max": [
        10
      ],
      "push_index": [
        13
      ],
      "final_while_check": [
        16
      ],
      "final_calculate": [
        17,
        18,
        19
      ],
      "return": [
        23
      ],
      "final_update_max": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "while_condition": [
        6
      ],
      "update_max": [
        10
      ],
      "final_while": [
        16
      ],
      "final_update_max": [
        20
      ]
    }
  }
};

const LargestRectangleInHistogramPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "heights": [
        2,
        1,
        5,
        6,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "heights": [
        2,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "heights": [
        6,
        2,
        5,
        4,
        5,
        1,
        6
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Ascending",
    "value": {
      "heights": [
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
    "label": "Descending",
    "value": {
      "heights": [
        5,
        4,
        3,
        2,
        1
      ]
    }
  }
];

function generateLargestRectangleInHistogramSteps(e: any): any[] {
  

let t=e.heights,a=t.length,r=t.reduce((e,t,a)=>(e[`elem_${a}`]={type:"arrayElement",value:t,position:a},e),{}),n=new StepRecorder({heights:t},{...r}),l=e=>e===a?0:t[e],h=[-1],s=0,c=-1,d=-1,o=0,g=()=>{n.delete_variable("topIdx"),n.delete_variable("poppedIdx"),n.delete_variable("rectStart"),n.delete_variable("rectEnd"),n.delete_variable("rectHeight"),n.delete_variable("rectWidth"),n.delete_variable("rectArea"),n.delete_variable("isNewMax")};n.update_variable("heights",[...t]),n.record("-","Sentinels: a -1 base and an appended 0 bar remove both special cases."),n.update_variable("stackIdxs",[...h]),n.update_variable("maxArea",0),n.record("initialize","stack = [-1] (base sentinel), maxArea = 0");for(let e=0;e<=a;e++){let i=e===a;for(n.update_variable("i",e),n.update_variable("isSentinel",i),n.update_variable("stackIdxs",[...h]),n.update_variable("maxArea",s),g(),n.record("check_bar",i?`Sentinel bar (height 0) at index ${e}: flush everything left.`:`Bar ${e} has height ${t[e]}`);-1!==h[h.length-1]&&l(e)<l(h[h.length-1]);){let t=h[h.length-1];n.update_variable("topIdx",t),n.record("while_check",`${l(e)} < ${l(t)}: pop bar ${t} and measure it.`),h.pop();let a=l(t),i=h[h.length-1]+1,r=e-h[h.length-1]-1,g=a*r;n.update_variable("poppedIdx",t),n.update_variable("rectStart",i),n.update_variable("rectEnd",e-1),n.update_variable("rectHeight",a),n.update_variable("rectWidth",r),n.update_variable("rectArea",g),n.update_variable("stackIdxs",[...h]),n.record("calculate_area",`height ${a} \xd7 width ${r} = ${g}`);let u=g>s;u&&(s=g,c=i,d=e-1,o=a,n.update_variable("maxArea",s),n.update_variable("maxStart",c),n.update_variable("maxEnd",d),n.update_variable("maxHeight",o)),n.update_variable("isNewMax",u),n.record("update_max",u?`New largest rectangle: area = ${s}`:`Not larger, keep maxArea = ${s}`)}h.push(e),n.update_variable("stackIdxs",[...h]),g(),n.record("push_index",i?`Push the sentinel index ${e}`:`Push bar ${e} onto the stack`)}return n.delete_variable("i"),n.delete_variable("isSentinel"),g(),n.record("return",`Return the largest rectangle area = ${s}`),n.getSteps()
}

export function LargestRectangleInHistogramProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LargestRectangleInHistogramTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLargestRectangleInHistogramSteps(e) as any[];
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
      title="Largest Rectangle in Histogram"
      slug="largest-rectangle-in-histogram"
      approaches={approaches}
      presets={LargestRectangleInHistogramPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Asteroid Collision (asteroid-collision)
// ==========================================

const AsteroidCollisionTemplates = {
  "python": {
    "language": "python",
    "code": "def asteroidCollision(asteroids):\n    stack = []\n\n    for asteroid in asteroids:\n        alive = True\n\n        # Resolve collisions: current is left-moving, top is right-moving\n        while alive and stack and asteroid < 0 and stack[-1] > 0:\n            top = stack[-1]\n            if top < -asteroid:\n                # Top asteroid is smaller, it gets destroyed\n                stack.pop()\n            elif top == -asteroid:\n                # Same size, both get destroyed\n                stack.pop()\n                alive = False\n            else:\n                # Top asteroid is bigger, current gets destroyed\n                alive = False\n\n        if alive:\n            stack.append(asteroid)\n\n    return stack",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        4
      ],
      "set_alive": [
        5
      ],
      "check_collision": [
        8,
        9
      ],
      "top_smaller": [
        10,
        12
      ],
      "both_equal": [
        13,
        15,
        16
      ],
      "top_larger": [
        17,
        19
      ],
      "push": [
        21,
        22
      ],
      "build_result": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "collision_check": [
        8
      ],
      "top_smaller": [
        10
      ],
      "both_equal": [
        13
      ],
      "top_larger": [
        17
      ],
      "push_alive": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] asteroidCollision(int[] asteroids) {\n    Deque<Integer> stack = new ArrayDeque<>();\n\n    for (int asteroid : asteroids) {\n        boolean alive = true;\n\n        // Resolve collisions: current is left-moving, top is right-moving\n        while (alive && !stack.isEmpty() && asteroid < 0 && stack.peek() > 0) {\n            int top = stack.peek();\n            if (top < -asteroid) {\n                // Top asteroid is smaller, it gets destroyed\n                stack.pop();\n            } else if (top == -asteroid) {\n                // Same size, both get destroyed\n                stack.pop();\n                alive = false;\n            } else {\n                // Top asteroid is bigger, current gets destroyed\n                alive = false;\n            }\n        }\n\n        if (alive) {\n            stack.push(asteroid);\n        }\n    }\n\n    // Convert stack to result array (stack is in reverse order)\n    int[] result = new int[stack.size()];\n    for (int i = result.length - 1; i >= 0; i--) {\n        result[i] = stack.pop();\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        4
      ],
      "set_alive": [
        5
      ],
      "check_collision": [
        8,
        9
      ],
      "top_smaller": [
        10,
        12
      ],
      "both_equal": [
        13,
        15,
        16
      ],
      "top_larger": [
        17,
        19
      ],
      "push": [
        23,
        24
      ],
      "build_result": [
        29,
        30,
        31
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "collision_check": [
        8
      ],
      "top_smaller": [
        10
      ],
      "both_equal": [
        13
      ],
      "top_larger": [
        17
      ],
      "push_alive": [
        23
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> asteroidCollision(vector<int>& asteroids) {\n    vector<int> stack;\n\n    for (int asteroid : asteroids) {\n        bool alive = true;\n\n        // Resolve collisions: current is left-moving, top is right-moving\n        while (alive && !stack.empty() && asteroid < 0 && stack.back() > 0) {\n            int top = stack.back();\n            if (top < -asteroid) {\n                // Top asteroid is smaller, it gets destroyed\n                stack.pop_back();\n            } else if (top == -asteroid) {\n                // Same size, both get destroyed\n                stack.pop_back();\n                alive = false;\n            } else {\n                // Top asteroid is bigger, current gets destroyed\n                alive = false;\n            }\n        }\n\n        if (alive) {\n            stack.push_back(asteroid);\n        }\n    }\n\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        4
      ],
      "set_alive": [
        5
      ],
      "check_collision": [
        8,
        9
      ],
      "top_smaller": [
        10,
        12
      ],
      "both_equal": [
        13,
        15,
        16
      ],
      "top_larger": [
        17,
        19
      ],
      "push": [
        23,
        24
      ],
      "build_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "collision_check": [
        8
      ],
      "top_smaller": [
        10
      ],
      "both_equal": [
        13
      ],
      "top_larger": [
        17
      ],
      "push_alive": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] AsteroidCollision(int[] asteroids) {\n    Stack<int> stack = new Stack<int>();\n\n    foreach (int asteroid in asteroids) {\n        bool alive = true;\n\n        // Resolve collisions: current is left-moving, top is right-moving\n        while (alive && stack.Count > 0 && asteroid < 0 && stack.Peek() > 0) {\n            int top = stack.Peek();\n            if (top < -asteroid) {\n                // Top asteroid is smaller, it gets destroyed\n                stack.Pop();\n            } else if (top == -asteroid) {\n                // Same size, both get destroyed\n                stack.Pop();\n                alive = false;\n            } else {\n                // Top asteroid is bigger, current gets destroyed\n                alive = false;\n            }\n        }\n\n        if (alive) {\n            stack.Push(asteroid);\n        }\n    }\n\n    // Stack is in reverse order, so reverse to get correct result\n    int[] result = stack.ToArray();\n    Array.Reverse(result);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        4
      ],
      "set_alive": [
        5
      ],
      "check_collision": [
        8,
        9
      ],
      "top_smaller": [
        10,
        12
      ],
      "both_equal": [
        13,
        15,
        16
      ],
      "top_larger": [
        17,
        19
      ],
      "push": [
        23,
        24
      ],
      "build_result": [
        29,
        30,
        31
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "collision_check": [
        8
      ],
      "top_smaller": [
        10
      ],
      "both_equal": [
        13
      ],
      "top_larger": [
        17
      ],
      "push_alive": [
        23
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func asteroidCollision(asteroids []int) []int {\n    stack := []int{}\n\n    for _, asteroid := range asteroids {\n        alive := true\n\n        // Resolve collisions: current is left-moving, top is right-moving\n        for alive && len(stack) > 0 && asteroid < 0 && stack[len(stack)-1] > 0 {\n            top := stack[len(stack)-1]\n            if top < -asteroid {\n                // Top asteroid is smaller, it gets destroyed\n                stack = stack[:len(stack)-1]\n            } else if top == -asteroid {\n                // Same size, both get destroyed\n                stack = stack[:len(stack)-1]\n                alive = false\n            } else {\n                // Top asteroid is bigger, current gets destroyed\n                alive = false\n            }\n        }\n\n        if alive {\n            stack = append(stack, asteroid)\n        }\n    }\n\n    return stack\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        4
      ],
      "set_alive": [
        5
      ],
      "check_collision": [
        8,
        9
      ],
      "top_smaller": [
        10,
        12
      ],
      "both_equal": [
        13,
        15,
        16
      ],
      "top_larger": [
        17,
        19
      ],
      "push": [
        23,
        24
      ],
      "build_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "collision_check": [
        8
      ],
      "top_smaller": [
        10
      ],
      "both_equal": [
        13
      ],
      "top_larger": [
        17
      ],
      "push_alive": [
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function asteroidCollision(asteroids) {\n  var stack = [];\n\n  for (var i = 0; i < asteroids.length; i++) {\n    var asteroid = asteroids[i];\n    var alive = true;\n\n    // Resolve collisions: current is left-moving, top is right-moving\n    while (alive && stack.length > 0 && asteroid < 0 && stack[stack.length - 1] > 0) {\n      var top = stack[stack.length - 1];\n      if (top < -asteroid) {\n        // Top asteroid is smaller, it gets destroyed\n        stack.pop();\n      } else if (top === -asteroid) {\n        // Same size, both get destroyed\n        stack.pop();\n        alive = false;\n      } else {\n        // Top asteroid is bigger, current gets destroyed\n        alive = false;\n      }\n    }\n\n    if (alive) {\n      stack.push(asteroid);\n    }\n  }\n\n  return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        4
      ],
      "set_alive": [
        6
      ],
      "check_collision": [
        9,
        10
      ],
      "top_smaller": [
        11,
        13
      ],
      "both_equal": [
        14,
        16,
        17
      ],
      "top_larger": [
        18,
        20
      ],
      "push": [
        24,
        25
      ],
      "build_result": [
        29
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "collision_check": [
        9
      ],
      "top_smaller": [
        11
      ],
      "both_equal": [
        14
      ],
      "top_larger": [
        18
      ],
      "push_alive": [
        24
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function asteroidCollision(asteroids: number[]): number[] {\n    const stack: number[] = [];\n\n    for (const asteroid of asteroids) {\n        let alive = true;\n\n        // Resolve collisions: current is left-moving, top is right-moving\n        while (alive && stack.length > 0 && asteroid < 0 && stack[stack.length - 1] > 0) {\n            const top = stack[stack.length - 1];\n            if (top < -asteroid) {\n                // Top asteroid is smaller, it gets destroyed\n                stack.pop();\n            } else if (top === -asteroid) {\n                // Same size, both get destroyed\n                stack.pop();\n                alive = false;\n            } else {\n                // Top asteroid is bigger, current gets destroyed\n                alive = false;\n            }\n        }\n\n        if (alive) {\n            stack.push(asteroid);\n        }\n    }\n\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        4
      ],
      "set_alive": [
        5
      ],
      "check_collision": [
        8,
        9
      ],
      "top_smaller": [
        10,
        12
      ],
      "both_equal": [
        13,
        15,
        16
      ],
      "top_larger": [
        17,
        19
      ],
      "push": [
        23,
        24
      ],
      "build_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "collision_check": [
        8
      ],
      "top_smaller": [
        10
      ],
      "both_equal": [
        13
      ],
      "top_larger": [
        17
      ],
      "push_alive": [
        23
      ]
    }
  }
};

const AsteroidCollisionPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "[5, 10, -5]",
    "value": {
      "asteroids": [
        5,
        10,
        -5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "[8, -8]",
    "value": {
      "asteroids": [
        8,
        -8
      ]
    }
  },
  {
    "id": "ex3",
    "label": "[10, 2, -5]",
    "value": {
      "asteroids": [
        10,
        2,
        -5
      ]
    }
  },
  {
    "id": "ex4",
    "label": "[-2, -1, 1, 2]",
    "value": {
      "asteroids": [
        -2,
        -1,
        1,
        2
      ]
    }
  }
];

function generateAsteroidCollisionSteps(e: any): any[] {
  

let t=e.asteroids,i=t.reduce((e,t,i)=>(e[`ast_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=[],o=new StepRecorder({asteroids:t},{...i}),r=(e,i)=>{o.update_visual(`ast_${e}`,{type:"arrayElement",value:t[e],position:e,state:i})},a=e=>{for(let e=0;e<=t.length+1;e++)o.delete_visual(`stack_${e}`);l.forEach((t,i)=>{o.update_visual(`stack_${i}`,{type:"stackElement",value:t,position:i,state:e?.entering&&i===l.length-1?"entering":void 0})}),e?.exploding&&o.update_visual(`stack_${e.exploding.pos}`,{type:"stackElement",value:e.exploding.val,position:e.exploding.pos,state:"exploding"}),o.update_variable("stack",[...l])};o.record("-","Asteroids fly right (+) or left (-). A stack holds the survivors."),o.add_new_variable("stack",[...l]),o.record("init","Initialize an empty stack to hold surviving asteroids");for(let e=0;e<t.length;e++){let i=t[e];o.delete_variable("top"),o.delete_variable("cmp"),o.update_variable("i",e),o.update_variable("asteroid",i),o.update_visual("curr",{type:"pointer",position:e,label:"i"}),r(e,"current"),a(),o.record("loop",i>0?`asteroids[${e}] = ${i}, flying right →`:`asteroids[${e}] = ${i}, flying left ←`);let s=!0;for(o.update_variable("alive",s),o.record("set_alive",`Assume asteroid ${i} survives (alive = true)`);s&&l.length>0&&i<0&&l[l.length-1]>0;){let t=l[l.length-1];o.update_variable("top",t),o.delete_variable("cmp"),o.add_conditional("collision_check",!0),a(),o.record("check_collision",`Collision: top ${t} → meets ${i} ←. Compare sizes.`),t<Math.abs(i)?(l.pop(),o.update_variable("cmp","lt"),o.add_conditional("top_smaller",!0),a({exploding:{val:t,pos:l.length}}),o.record("top_smaller",`|${t}| < |${i}|: the top explodes, keep checking`)):t===Math.abs(i)?(l.pop(),s=!1,o.update_variable("cmp","eq"),o.update_variable("alive",s),o.add_conditional("both_equal",!0),r(e,"destroyed"),a({exploding:{val:t,pos:l.length}}),o.record("both_equal",`|${t}| == |${i}|: both asteroids explode`)):(s=!1,o.update_variable("cmp","gt"),o.update_variable("alive",s),o.add_conditional("top_larger",!0),r(e,"destroyed"),a(),o.record("top_larger",`|${t}| > |${i}|: asteroid ${i} explodes`))}s&&(l.push(i),o.delete_variable("top"),o.delete_variable("cmp"),o.add_conditional("push_alive",!0),r(e,"survived"),a({entering:!0}),o.record("push",`Asteroid ${i} survives, push it onto the stack`))}return o.delete_visual("curr"),o.delete_variable("alive"),o.delete_variable("top"),o.delete_variable("cmp"),o.delete_variable("i"),o.delete_variable("asteroid"),o.update_variable("result",[...l]),a(),o.record("build_result",`The survivors that remain on the stack are the result: [${l.join(", ")}]`),o.update_variable("return",[...l]),o.record("complete",`Return [${l.join(", ")}]`),o.getSteps()
}

export function AsteroidCollisionProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AsteroidCollisionTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAsteroidCollisionSteps(e) as any[];
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
      title="Asteroid Collision"
      slug="asteroid-collision"
      approaches={approaches}
      presets={AsteroidCollisionPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Baseball Game (baseball-game)
// ==========================================

const BaseballGameTemplates = {
  "python": {
    "language": "python",
    "code": "def calPoints(operations):\n    # Stack to maintain the record of valid scores\n    stack = []\n\n    for op in operations:\n        if op == \"C\":\n            # Remove the last valid score\n            stack.pop()\n        elif op == \"D\":\n            # Double the last valid score and record it\n            stack.append(2 * stack[-1])\n        elif op == \"+\":\n            # Sum of the last two valid scores\n            stack.append(stack[-1] + stack[-2])\n        else:\n            # It's a number, record it\n            stack.append(int(op))\n\n    # Sum all remaining scores\n    return sum(stack)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "loop": [
        5
      ],
      "pop": [
        8
      ],
      "double": [
        11
      ],
      "sum_top_two": [
        14
      ],
      "push_num": [
        17
      ],
      "calc_sum": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_c": [
        6
      ],
      "check_d": [
        9
      ],
      "check_plus": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int calPoints(String[] operations) {\n    // ArrayDeque is the standard stack in Java\n    // (java.util.Stack is a legacy synchronized class)\n    Deque<Integer> stack = new ArrayDeque<>();\n\n    for (String op : operations) {\n        if (op.equals(\"C\")) {\n            // Remove the last valid score\n            stack.pop();\n        } else if (op.equals(\"D\")) {\n            // Double the last valid score and record it\n            stack.push(2 * stack.peek());\n        } else if (op.equals(\"+\")) {\n            // Sum of the last two valid scores\n            int top = stack.pop();\n            int newScore = top + stack.peek();\n            stack.push(top);\n            stack.push(newScore);\n        } else {\n            // It's a number, record it\n            stack.push(Integer.parseInt(op));\n        }\n    }\n\n    // Sum all remaining scores\n    int sum = 0;\n    for (int score : stack) {\n        sum += score;\n    }\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        4
      ],
      "loop": [
        6
      ],
      "pop": [
        9
      ],
      "double": [
        12
      ],
      "sum_top_two": [
        15,
        16,
        17,
        18
      ],
      "push_num": [
        21
      ],
      "calc_sum": [
        26,
        27,
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "check_c": [
        7
      ],
      "check_d": [
        10
      ],
      "check_plus": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int calPoints(vector<string>& operations) {\n    // Stack to maintain the record of valid scores\n    vector<int> stack;\n\n    for (const string& op : operations) {\n        if (op == \"C\") {\n            // Remove the last valid score\n            stack.pop_back();\n        } else if (op == \"D\") {\n            // Double the last valid score and record it\n            stack.push_back(2 * stack.back());\n        } else if (op == \"+\") {\n            // Sum of the last two valid scores\n            int n = stack.size();\n            stack.push_back(stack[n - 1] + stack[n - 2]);\n        } else {\n            // It's a number, record it\n            stack.push_back(stoi(op));\n        }\n    }\n\n    // Sum all remaining scores\n    int sum = 0;\n    for (int score : stack) {\n        sum += score;\n    }\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "loop": [
        5
      ],
      "pop": [
        8
      ],
      "double": [
        11
      ],
      "sum_top_two": [
        14,
        15
      ],
      "push_num": [
        18
      ],
      "calc_sum": [
        23,
        24,
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_c": [
        6
      ],
      "check_d": [
        9
      ],
      "check_plus": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int CalPoints(string[] operations) {\n    // Stack (using List for easy iteration at the end)\n    List<int> stack = new List<int>();\n\n    foreach (string op in operations) {\n        if (op == \"C\") {\n            // Remove the last valid score\n            stack.RemoveAt(stack.Count - 1);\n        } else if (op == \"D\") {\n            // Double the last valid score and record it\n            stack.Add(2 * stack[stack.Count - 1]);\n        } else if (op == \"+\") {\n            // Sum of the last two valid scores\n            stack.Add(stack[stack.Count - 1] + stack[stack.Count - 2]);\n        } else {\n            // It's a number, record it\n            stack.Add(int.Parse(op));\n        }\n    }\n\n    // Sum all remaining scores\n    int sum = 0;\n    foreach (int score in stack) {\n        sum += score;\n    }\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "loop": [
        5
      ],
      "pop": [
        8
      ],
      "double": [
        11
      ],
      "sum_top_two": [
        14
      ],
      "push_num": [
        17
      ],
      "calc_sum": [
        22,
        23,
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_c": [
        6
      ],
      "check_d": [
        9
      ],
      "check_plus": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func calPoints(operations []string) int {\n    // Stack to maintain the record of valid scores\n    stack := []int{}\n\n    for _, op := range operations {\n        n := len(stack)\n        if op == \"C\" {\n            // Remove the last valid score\n            stack = stack[:n-1]\n        } else if op == \"D\" {\n            // Double the last valid score and record it\n            stack = append(stack, 2*stack[n-1])\n        } else if op == \"+\" {\n            // Sum of the last two valid scores\n            stack = append(stack, stack[n-1]+stack[n-2])\n        } else {\n            // It's a number, record it\n            val, _ := strconv.Atoi(op)\n            stack = append(stack, val)\n        }\n    }\n\n    // Sum all remaining scores\n    sum := 0\n    for _, score := range stack {\n        sum += score\n    }\n    return sum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "loop": [
        5
      ],
      "pop": [
        9
      ],
      "double": [
        12
      ],
      "sum_top_two": [
        15
      ],
      "push_num": [
        18,
        19
      ],
      "calc_sum": [
        24,
        25,
        26
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "check_c": [
        7
      ],
      "check_d": [
        10
      ],
      "check_plus": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function calPoints(operations) {\n  // Stack to maintain the record of valid scores\n  const stack = [];\n\n  for (const op of operations) {\n    if (op === \"C\") {\n      // Remove the last valid score\n      stack.pop();\n    } else if (op === \"D\") {\n      // Double the last valid score and record it\n      stack.push(2 * stack[stack.length - 1]);\n    } else if (op === \"+\") {\n      // Sum of the last two valid scores\n      stack.push(stack[stack.length - 1] + stack[stack.length - 2]);\n    } else {\n      // It's a number, record it\n      stack.push(parseInt(op));\n    }\n  }\n\n  // Sum all remaining scores\n  return stack.reduce((sum, score) => sum + score, 0);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "loop": [
        5
      ],
      "pop": [
        8
      ],
      "double": [
        11
      ],
      "sum_top_two": [
        14
      ],
      "push_num": [
        17
      ],
      "calc_sum": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "check_c": [
        6
      ],
      "check_d": [
        9
      ],
      "check_plus": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function calPoints(operations: string[]): number {\n    // Stack to maintain the record of valid scores\n    const stack: number[] = [];\n\n    for (const op of operations) {\n        if (op === \"C\") {\n            // Remove the last valid score\n            stack.pop();\n        } else if (op === \"D\") {\n            // Double the last valid score and record it\n            stack.push(2 * stack[stack.length - 1]);\n        } else if (op === \"+\") {\n            // Sum of the last two valid scores\n            stack.push(stack[stack.length - 1] + stack[stack.length - 2]);\n        } else {\n            // It's a number, record it\n            stack.push(parseInt(op));\n        }\n    }\n\n    // Sum all remaining scores\n    return stack.reduce((sum, score) => sum + score, 0);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "loop": [
        5
      ],
      "pop": [
        8
      ],
      "double": [
        11
      ],
      "sum_top_two": [
        14
      ],
      "push_num": [
        17
      ],
      "calc_sum": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "check_c": [
        6
      ],
      "check_d": [
        9
      ],
      "check_plus": [
        12
      ]
    }
  }
};

const BaseballGamePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "operations": [
        "5",
        "2",
        "C",
        "D",
        "+"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Complex",
    "value": {
      "operations": [
        "5",
        "-2",
        "4",
        "C",
        "D",
        "9",
        "+",
        "+"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Simple",
    "value": {
      "operations": [
        "1",
        "2",
        "3"
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All Cancelled",
    "value": {
      "operations": [
        "1",
        "C"
      ]
    }
  }
];

function generateBaseballGameSteps(e: any): any[] {
  

let t=e.operations,a=t.reduce((e,t,a)=>(e[`op_${a}`]={type:"arrayElement",value:t,position:a},e),{}),i=[],l=[],n=new Set,o=new Set,r=new StepRecorder({operations:t},{...a}),c=(e,a)=>{r.update_visual(`op_${e}`,{type:"arrayElement",value:t[e],position:e,state:a})},d=e=>{for(let e=0;e<=t.length;e++)r.delete_visual(`stack_${e}`);i.forEach((t,a)=>{r.update_visual(`stack_${a}`,{type:"stackElement",value:t,position:a,state:e?.enteringTop&&a===i.length-1?"entering":void 0})}),e?.exiting&&r.update_visual(`stack_${e.exiting.pos}`,{type:"stackElement",value:e.exiting.val,position:e.exiting.pos,state:"exiting"}),r.update_variable("stackOrigins",[...l]),r.update_variable("stack",[...i])};r.record("-","Start of algorithm"),r.add_new_variable("stack",[...i]),r.update_variable("stackOrigins",[]),r.record("init","Initialize an empty stack to hold the scores");for(let e=0;e<t.length;e++){let a=t[e];r.update_variable("i",e),r.update_variable("op",a),r.update_visual("curr",{type:"pointer",position:e,label:"i"}),d();let s="C"===a?"remove the last score":"D"===a?"double the last score":"+"===a?"sum the last two scores":"record a new score";if(r.record("loop",`operations[${e}] = "${a}", ${s}`),"C"===a){r.add_conditional("check_c",!0);let t=i.pop(),a=l.pop();n.add(a),n.add(e),r.update_variable("popped",t),r.update_variable("cancelledOrigin",a),c(a,"cancelled"),c(e,"cancelled"),d({exiting:{val:t,pos:i.length}}),r.record("pop",`Pop ${t}, the score from operations[${a}] is cancelled`),r.delete_variable("popped"),r.delete_variable("cancelledOrigin")}else if("D"===a){r.add_conditional("check_c",!1),r.add_conditional("check_d",!0);let t=i[i.length-1],a=2*t;i.push(a),l.push(e),r.update_variable("prevTop",t),r.update_variable("doubled",a),c(e,"done"),o.add(e),d({enteringTop:!0}),r.record("double",`Push 2 \xd7 ${t} = ${a} onto the stack`),r.delete_variable("prevTop"),r.delete_variable("doubled")}else if("+"===a){r.add_conditional("check_c",!1),r.add_conditional("check_d",!1),r.add_conditional("check_plus",!0);let t=i[i.length-2],a=i[i.length-1],s=t+a;i.push(s),l.push(e),r.update_variable("addA",t),r.update_variable("addB",a),r.update_variable("sumVal",s),c(e,"done"),o.add(e),d({enteringTop:!0}),r.record("sum_top_two",`Push ${t} + ${a} = ${s} onto the stack`),r.delete_variable("addA"),r.delete_variable("addB"),r.delete_variable("sumVal")}else{r.add_conditional("check_c",!1),r.add_conditional("check_d",!1),r.add_conditional("check_plus",!1);let t=parseInt(a);i.push(t),l.push(e),r.update_variable("num",t),c(e,"done"),o.add(e),d({enteringTop:!0}),r.record("push_num",`Push ${t} onto the stack`),r.delete_variable("num")}}r.delete_variable("i"),r.delete_variable("op"),r.delete_visual("curr"),d();let p=i.reduce((e,t)=>e+t,0);return r.update_variable("sum",p),r.record("calc_sum",i.length>0?`Sum the remaining scores: ${i.join(" + ")} = ${p}`:"The stack is empty, the total is 0"),r.update_variable("return",p),r.record("complete",`Return the total score: ${p}`),r.getSteps()
}

export function BaseballGameProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BaseballGameTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBaseballGameSteps(e) as any[];
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
      title="Baseball Game"
      slug="baseball-game"
      approaches={approaches}
      presets={BaseballGamePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Basic Calculator (basic-calculator)
// ==========================================

const BasicCalculatorTemplates = {
  "python": {
    "language": "python",
    "code": "def calculate(s):\n    result = 0\n    sign = 1\n    i = 0\n    sign_stack = [1]  # base sign context\n\n    while i < len(s):\n        ch = s[i]\n\n        if ch.isdigit():\n            # Build multi-digit number\n            num = 0\n            while i < len(s) and s[i].isdigit():\n                num = num * 10 + int(s[i])\n                i += 1\n            # Apply the effective sign and add to result\n            result += sign_stack[-1] * sign * num\n            continue\n        elif ch == '+':\n            sign = 1\n        elif ch == '-':\n            sign = -1\n        elif ch == '(':\n            # Push the cumulative sign for this nesting level\n            sign_stack.append(sign_stack[-1] * sign)\n            sign = 1\n        elif ch == ')':\n            sign_stack.pop()\n\n        i += 1\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "loop": [
        7,
        8
      ],
      "build_number": [
        12,
        13,
        14,
        15
      ],
      "add_number": [
        17,
        18
      ],
      "set_plus": [
        3,
        19
      ],
      "set_minus": [
        21,
        22
      ],
      "open_paren": [
        23,
        25,
        26
      ],
      "close_paren": [
        27,
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public int calculate(String s) {\n    int result = 0;\n    int sign = 1;\n    int i = 0;\n    Deque<Integer> signStack = new ArrayDeque<>();\n    signStack.push(1); // base sign context\n\n    while (i < s.length()) {\n        char ch = s.charAt(i);\n\n        if (Character.isDigit(ch)) {\n            // Build multi-digit number\n            int num = 0;\n            while (i < s.length() && Character.isDigit(s.charAt(i))) {\n                num = num * 10 + (s.charAt(i) - '0');\n                i++;\n            }\n            // Apply the effective sign and add to result\n            result += signStack.peek() * sign * num;\n            continue;\n        } else if (ch == '+') {\n            sign = 1;\n        } else if (ch == '-') {\n            sign = -1;\n        } else if (ch == '(') {\n            // Push the cumulative sign for this nesting level\n            signStack.push(signStack.peek() * sign);\n            sign = 1;\n        } else if (ch == ')') {\n            signStack.pop();\n        }\n\n        i++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "loop": [
        8,
        9
      ],
      "build_number": [
        13,
        14,
        15,
        16
      ],
      "add_number": [
        19,
        20
      ],
      "set_plus": [
        3,
        21
      ],
      "set_minus": [
        23,
        24
      ],
      "open_paren": [
        25,
        27,
        28
      ],
      "close_paren": [
        29,
        30
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "int calculate(string s) {\n    int result = 0;\n    int sign = 1;\n    int i = 0;\n    vector<int> signStack = {1}; // base sign context\n\n    while (i < (int)s.length()) {\n        char ch = s[i];\n\n        if (isdigit(ch)) {\n            // Build multi-digit number\n            int num = 0;\n            while (i < (int)s.length() && isdigit(s[i])) {\n                num = num * 10 + (s[i] - '0');\n                i++;\n            }\n            // Apply the effective sign and add to result\n            result += signStack.back() * sign * num;\n            continue;\n        } else if (ch == '+') {\n            sign = 1;\n        } else if (ch == '-') {\n            sign = -1;\n        } else if (ch == '(') {\n            // Push the cumulative sign for this nesting level\n            signStack.push_back(signStack.back() * sign);\n            sign = 1;\n        } else if (ch == ')') {\n            signStack.pop_back();\n        }\n\n        i++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "loop": [
        7,
        8
      ],
      "build_number": [
        12,
        13,
        14,
        15
      ],
      "add_number": [
        18,
        19
      ],
      "set_plus": [
        3,
        20
      ],
      "set_minus": [
        22,
        23
      ],
      "open_paren": [
        24,
        26,
        27
      ],
      "close_paren": [
        28,
        29
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public int Calculate(string s) {\n    int result = 0;\n    int sign = 1;\n    int i = 0;\n    Stack<int> signStack = new Stack<int>();\n    signStack.Push(1); // base sign context\n\n    while (i < s.Length) {\n        char ch = s[i];\n\n        if (char.IsDigit(ch)) {\n            // Build multi-digit number\n            int num = 0;\n            while (i < s.Length && char.IsDigit(s[i])) {\n                num = num * 10 + (s[i] - '0');\n                i++;\n            }\n            // Apply the effective sign and add to result\n            result += signStack.Peek() * sign * num;\n            continue;\n        } else if (ch == '+') {\n            sign = 1;\n        } else if (ch == '-') {\n            sign = -1;\n        } else if (ch == '(') {\n            // Push the cumulative sign for this nesting level\n            signStack.Push(signStack.Peek() * sign);\n            sign = 1;\n        } else if (ch == ')') {\n            signStack.Pop();\n        }\n\n        i++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "loop": [
        8,
        9
      ],
      "build_number": [
        13,
        14,
        15,
        16
      ],
      "add_number": [
        19,
        20
      ],
      "set_plus": [
        3,
        21
      ],
      "set_minus": [
        23,
        24
      ],
      "open_paren": [
        25,
        27,
        28
      ],
      "close_paren": [
        29,
        30
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func calculate(s string) int {\n    result := 0\n    sign := 1\n    i := 0\n    signStack := []int{1} // base sign context\n\n    for i < len(s) {\n        ch := s[i]\n\n        if ch >= '0' && ch <= '9' {\n            // Build multi-digit number\n            num := 0\n            for i < len(s) && s[i] >= '0' && s[i] <= '9' {\n                num = num*10 + int(s[i]-'0')\n                i++\n            }\n            // Apply the effective sign and add to result\n            result += signStack[len(signStack)-1] * sign * num\n            continue\n        } else if ch == '+' {\n            sign = 1\n        } else if ch == '-' {\n            sign = -1\n        } else if ch == '(' {\n            // Push the cumulative sign for this nesting level\n            signStack = append(signStack, signStack[len(signStack)-1]*sign)\n            sign = 1\n        } else if ch == ')' {\n            signStack = signStack[:len(signStack)-1]\n        }\n\n        i++\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "loop": [
        7,
        8
      ],
      "build_number": [
        12,
        13,
        14,
        15
      ],
      "add_number": [
        18,
        19
      ],
      "set_plus": [
        20,
        21
      ],
      "set_minus": [
        22,
        23
      ],
      "open_paren": [
        24,
        26,
        27
      ],
      "close_paren": [
        28,
        29
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "function calculate(s) {\n    var result = 0;\n    var sign = 1;\n    var i = 0;\n    var signStack = [1]; // base sign context\n\n    while (i < s.length) {\n        var ch = s[i];\n\n        if (ch >= '0' && ch <= '9') {\n            // Build multi-digit number\n            var num = 0;\n            while (i < s.length && s[i] >= '0' && s[i] <= '9') {\n                num = num * 10 + (s.charCodeAt(i) - 48);\n                i++;\n            }\n            // Apply the effective sign and add to result\n            result += signStack[signStack.length - 1] * sign * num;\n            continue;\n        } else if (ch === '+') {\n            sign = 1;\n        } else if (ch === '-') {\n            sign = -1;\n        } else if (ch === '(') {\n            // Push the cumulative sign for this nesting level\n            signStack.push(signStack[signStack.length - 1] * sign);\n            sign = 1;\n        } else if (ch === ')') {\n            signStack.pop();\n        }\n\n        i++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "loop": [
        7,
        8
      ],
      "build_number": [
        12,
        13,
        14,
        15
      ],
      "add_number": [
        18,
        19
      ],
      "set_plus": [
        3,
        20
      ],
      "set_minus": [
        22,
        23
      ],
      "open_paren": [
        24,
        26,
        27
      ],
      "close_paren": [
        28,
        29
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function calculate(s: string): number {\n    let result = 0;\n    let sign = 1;\n    let i = 0;\n    const signStack: number[] = [1]; // base sign context\n\n    while (i < s.length) {\n        const ch = s[i];\n\n        if (ch >= '0' && ch <= '9') {\n            // Build multi-digit number\n            let num = 0;\n            while (i < s.length && s[i] >= '0' && s[i] <= '9') {\n                num = num * 10 + (s.charCodeAt(i) - 48);\n                i++;\n            }\n            // Apply the effective sign and add to result\n            result += signStack[signStack.length - 1] * sign * num;\n            continue;\n        } else if (ch === '+') {\n            sign = 1;\n        } else if (ch === '-') {\n            sign = -1;\n        } else if (ch === '(') {\n            // Push the cumulative sign for this nesting level\n            signStack.push(signStack[signStack.length - 1] * sign);\n            sign = 1;\n        } else if (ch === ')') {\n            signStack.pop();\n        }\n\n        i++;\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "loop": [
        7,
        8
      ],
      "build_number": [
        12,
        13,
        14,
        15
      ],
      "add_number": [
        18,
        19
      ],
      "set_plus": [
        3,
        20
      ],
      "set_minus": [
        22,
        23
      ],
      "open_paren": [
        24,
        26,
        27
      ],
      "close_paren": [
        28,
        29
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {}
  }
};

const BasicCalculatorPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Simple Add",
    "value": {
      "s": "1 + 1"
    }
  },
  {
    "id": "ex2",
    "label": "Mixed Ops",
    "value": {
      "s": " 2-1 + 2 "
    }
  },
  {
    "id": "ex3",
    "label": "Nested Parens",
    "value": {
      "s": "(1+(4+5+2)-3)+(6+8)"
    }
  },
  {
    "id": "ex4",
    "label": "Leading Neg",
    "value": {
      "s": "-(3+2)+5"
    }
  }
];

function generateBasicCalculatorSteps(e: any): any[] {
  

let t=e.s,i=t.split(""),s=i.length,l=i.reduce((e,t,i)=>(e[`char_${i}`]={type:"arrayElement",value:t,position:i},e),{}),a=new StepRecorder({s:t},{...l}),r=[],u=()=>r[r.length-1],c=e=>`result=${e.r}  sign=${e.s>0?"+1":"-1"}`,o=e=>{for(let e=0;e<=s+1;e++)a.delete_visual(`frame_${e}`);r.forEach((t,i)=>{a.update_visual(`frame_${i}`,{type:"stackElement",value:c(t),position:i,state:e?.entering&&i===r.length-1?"entering":void 0})}),e?.exiting&&a.update_visual(`frame_${e.exiting.pos}`,{type:"stackElement",value:c(e.exiting.f),position:e.exiting.pos,state:"exiting"}),a.update_variable("frames",r.map(c))},d=0,h=()=>{let e=u();a.update_variable("result",e.r),a.update_variable("sign",e.s),a.update_variable("num",d),a.update_variable("depth",r.length)};a.record("-","Evaluate each parenthesis group with its own recursive call frame."),r.push({r:0,s:1}),a.add_new_variable("result",0),a.add_new_variable("sign",1),a.add_new_variable("num",0),a.add_new_variable("depth",1),o(),h(),a.record("init","calculate(s): i = 0, then evaluate(s) with result = 0, sign = +1.");let p=0;for(;p<s;){let e=i[p];if(a.update_variable("i",p),a.update_variable("ch",e),a.update_visual("curr",{type:"pointer",position:p,label:"i"}),e>="0"&&e<="9"){for(d=0;p<s&&i[p]>="0"&&i[p]<="9";)d=10*d+parseInt(i[p],10),a.update_variable("i",p),a.update_visual("curr",{type:"pointer",position:p,label:"i"}),h(),a.record("build_number",`Digit '${i[p]}': num = ${d}`),p++;let e=u();e.r+=e.s*d,d=0,h(),a.record("add_num",`result += sign * num → result = ${e.r}`);continue}if(p++,"+"===e||"-"===e)u().s="+"===e?1:-1,o(),h(),a.record("+"===e?"set_plus":"set_minus",`'${e}' sets sign = ${"+"===e?"+1":"-1"}`);else if("("===e)r.push({r:0,s:1}),o({entering:!0}),h(),a.record("recurse",`'(' evaluates the group in a new frame (depth ${r.length}).`);else if(")"===e){let e=r.pop(),t=e.r,i=u();i.r+=i.s*t,a.update_variable("returnedVal",t),o({exiting:{f:e,pos:r.length}}),h(),a.record("return_val",`')' returns ${t}; the parent folds it in as result = ${i.r}.`),a.delete_variable("returnedVal")}else a.record("loop","A space, nothing to do.")}let g=u().r;return a.update_variable("result",g),a.update_variable("num",0),a.delete_variable("i"),a.delete_variable("ch"),a.delete_visual("curr"),a.update_variable("return",g),a.record("complete",`The loop ends, return result = ${g}`),a.getSteps()
}

export function BasicCalculatorProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BasicCalculatorTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBasicCalculatorSteps(e) as any[];
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
      title="Basic Calculator"
      slug="basic-calculator"
      approaches={approaches}
      presets={BasicCalculatorPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Buildings With an Ocean View (buildings-with-an-ocean-view)
// ==========================================

const BuildingsWithAnOceanViewTemplates = {
  "python": {
    "language": "python",
    "code": "def findBuildings(heights):\n    stack = []\n\n    for i in range(len(heights)):\n        while stack and heights[stack[-1]] <= heights[i]:\n            stack.pop()\n\n        stack.append(i)\n\n    result = list(stack)\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_building": [
        4
      ],
      "pop_blocked": [
        6
      ],
      "push_visible": [
        8
      ],
      "build_result": [
        10
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "is_blocked": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] findBuildings(int[] heights) {\n    Deque<Integer> stack = new ArrayDeque<>();\n\n    for (int i = 0; i < heights.length; i++) {\n        while (!stack.isEmpty() && heights[stack.peek()] <= heights[i]) {\n            stack.pop();\n        }\n\n        stack.push(i);\n    }\n\n    int[] result = new int[stack.size()];\n    for (int j = result.length - 1; j >= 0; j--) {\n        result[j] = stack.pop();\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_building": [
        4
      ],
      "pop_blocked": [
        6
      ],
      "push_visible": [
        9
      ],
      "build_result": [
        12,
        13,
        14,
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_blocked": [
        5
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> findBuildings(vector<int>& heights) {\n    stack<int> stk;\n\n    for (int i = 0; i < heights.size(); i++) {\n        while (!stk.empty() && heights[stk.top()] <= heights[i]) {\n            stk.pop();\n        }\n\n        stk.push(i);\n    }\n\n    vector<int> result;\n    while (!stk.empty()) {\n        result.push_back(stk.top());\n        stk.pop();\n    }\n    reverse(result.begin(), result.end());\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_building": [
        4
      ],
      "pop_blocked": [
        6
      ],
      "push_visible": [
        9
      ],
      "build_result": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_blocked": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] FindBuildings(int[] heights) {\n    Stack<int> stack = new Stack<int>();\n\n    for (int i = 0; i < heights.Length; i++) {\n        while (stack.Count > 0 && heights[stack.Peek()] <= heights[i]) {\n            stack.Pop();\n        }\n\n        stack.Push(i);\n    }\n\n    int[] result = new int[stack.Count];\n    for (int j = result.Length - 1; j >= 0; j--) {\n        result[j] = stack.Pop();\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_building": [
        4
      ],
      "pop_blocked": [
        6
      ],
      "push_visible": [
        9
      ],
      "build_result": [
        12,
        13,
        14,
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_blocked": [
        5
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findBuildings(heights []int) []int {\n    stack := []int{}\n\n    for i := 0; i < len(heights); i++ {\n        for len(stack) > 0 && heights[stack[len(stack)-1]] <= heights[i] {\n            stack = stack[:len(stack)-1]\n        }\n\n        stack = append(stack, i)\n    }\n\n    return stack\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_building": [
        4
      ],
      "pop_blocked": [
        6
      ],
      "push_visible": [
        9
      ],
      "build_result": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_blocked": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findBuildings(heights) {\n    const stack = [];\n\n    for (let i = 0; i < heights.length; i++) {\n        while (stack.length > 0 && heights[stack[stack.length - 1]] <= heights[i]) {\n            stack.pop();\n        }\n\n        stack.push(i);\n    }\n\n    return [...stack];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_building": [
        4
      ],
      "pop_blocked": [
        6
      ],
      "push_visible": [
        9
      ],
      "build_result": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_blocked": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findBuildings(heights: number[]): number[] {\n    const stack: number[] = [];\n\n    for (let i = 0; i < heights.length; i++) {\n        while (stack.length > 0 && heights[stack[stack.length - 1]] <= heights[i]) {\n            stack.pop();\n        }\n\n        stack.push(i);\n    }\n\n    return [...stack];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_building": [
        4
      ],
      "pop_blocked": [
        6
      ],
      "push_visible": [
        9
      ],
      "build_result": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_blocked": [
        5
      ]
    }
  }
};

const BuildingsWithAnOceanViewPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "heights": [
        4,
        2,
        3,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "heights": [
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "heights": [
        1,
        3,
        2,
        4
      ]
    }
  }
];

function generateBuildingsWithAnOceanViewSteps(e: any): any[] {
  

let t=e.heights,i=t.length,l=t.reduce((e,t,i)=>(e[`bldg_${i}`]={type:"arrayElement",value:t,position:i},e),{}),r=new StepRecorder({heights:t},{...l}),a=[];r.update_variable("heights",[...t]),r.record("-","Scan from the ocean side, keeping the tallest building seen so far."),r.update_variable("result",[]),r.update_variable("maxH",0),r.record("init","maxH = 0. A building has a view when it beats every building to its right.");let s=0;for(let e=i-1;e>=0;e--)r.update_variable("i",e),r.update_variable("height",t[e]),r.update_variable("maxH",s),r.update_visual("iptr",{type:"pointer",position:e,label:"i"}),r.record("check_building",`Building ${e} (height ${t[e]}): compare with maxH = ${s}.`),t[e]>s?(a.push(e),s=t[e],r.update_variable("maxH",s),r.update_variable("hasView",!0),r.update_variable("result",[...a]),r.record("has_view",`${t[e]} > maxH: building ${e} has a view. maxH = ${s}.`)):(r.update_variable("hasView",!1),r.record("blocked",`${t[e]} <= maxH (${s}): a taller building is to its right, no view.`));return a.reverse(),r.update_variable("result",[...a]),r.delete_variable("hasView"),r.record("reverse",`Collected right to left; reverse to increasing order: [${a.join(", ")}]`),r.delete_variable("i"),r.delete_variable("height"),r.delete_visual("iptr"),r.update_variable("return",[...a]),r.record("complete",`Done. Buildings with an ocean view: [${a.join(", ")}]`),r.getSteps()
}

export function BuildingsWithAnOceanViewProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BuildingsWithAnOceanViewTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBuildingsWithAnOceanViewSteps(e) as any[];
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
      title="Buildings With an Ocean View"
      slug="buildings-with-an-ocean-view"
      approaches={approaches}
      presets={BuildingsWithAnOceanViewPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Car Fleet (car-fleet)
// ==========================================

const CarFleetTemplates = {
  "python": {
    "language": "python",
    "code": "def carFleet(target, position, speed):\n    cars = sorted(zip(position, speed), reverse=True)\n\n    # Explicit stack tracking fleet arrival times\n    stack = []\n\n    for pos, spd in cars:\n        time = (target - pos) / spd\n        # Only push if this car is slower than the fleet ahead\n        if not stack or time > stack[-1]:\n            stack.append(time)\n    return len(stack)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5
      ],
      "sort": [
        2
      ],
      "loop": [
        7
      ],
      "calc_time": [
        8
      ],
      "check_fleet": [
        10
      ],
      "new_fleet": [
        11
      ],
      "merge": [
        10
      ],
      "result": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public int carFleet(int target, int[] position, int[] speed) {\n    int n = position.length;\n    int[][] cars = new int[n][2];\n    for (int i = 0; i < n; i++) {\n        cars[i][0] = position[i];\n        cars[i][1] = speed[i];\n    }\n    Arrays.sort(cars, (a, b) -> b[0] - a[0]);\n\n    // Explicit stack tracking fleet arrival times\n    Deque<Double> stack = new ArrayDeque<>();\n\n    for (int[] car : cars) {\n        double time = (double)(target - car[0]) / car[1];\n        // Only push if this car is slower than the fleet ahead\n        if (stack.isEmpty() || time > stack.peek()) {\n            stack.push(time);\n        }\n    }\n    return stack.size();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        11
      ],
      "sort": [
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "loop": [
        13
      ],
      "calc_time": [
        14
      ],
      "check_fleet": [
        16
      ],
      "new_fleet": [
        17
      ],
      "merge": [
        16
      ],
      "result": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "int carFleet(int target, vector<int>& position, vector<int>& speed) {\n    int n = position.size();\n    vector<pair<int,int>> cars(n);\n    for (int i = 0; i < n; i++) {\n        cars[i] = {position[i], speed[i]};\n    }\n    sort(cars.begin(), cars.end(), [](auto& a, auto& b) {\n        return a.first > b.first;\n    });\n\n    // Explicit stack tracking fleet arrival times\n    vector<double> stack;\n\n    for (auto& [pos, spd] : cars) {\n        double time = (double)(target - pos) / spd;\n        // Only push if this car is slower than the fleet ahead\n        if (stack.empty() || time > stack.back()) {\n            stack.push_back(time);\n        }\n    }\n    return stack.size();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        12
      ],
      "sort": [
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "loop": [
        14
      ],
      "calc_time": [
        15
      ],
      "check_fleet": [
        17
      ],
      "new_fleet": [
        18
      ],
      "merge": [
        17
      ],
      "result": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public int CarFleet(int target, int[] position, int[] speed) {\n    int n = position.Length;\n    int[][] cars = new int[n][];\n    for (int i = 0; i < n; i++) {\n        cars[i] = new int[] { position[i], speed[i] };\n    }\n    Array.Sort(cars, (a, b) => b[0] - a[0]);\n\n    // Explicit stack tracking fleet arrival times\n    Stack<double> stack = new Stack<double>();\n\n    foreach (var car in cars) {\n        double time = (double)(target - car[0]) / car[1];\n        // Only push if this car is slower than the fleet ahead\n        if (stack.Count == 0 || time > stack.Peek()) {\n            stack.Push(time);\n        }\n    }\n    return stack.Count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        10
      ],
      "sort": [
        3,
        4,
        5,
        6,
        7
      ],
      "loop": [
        12
      ],
      "calc_time": [
        13
      ],
      "check_fleet": [
        15
      ],
      "new_fleet": [
        16
      ],
      "merge": [
        15
      ],
      "result": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func carFleet(target int, position []int, speed []int) int {\n    n := len(position)\n    cars := make([][2]int, n)\n    for i := 0; i < n; i++ {\n        cars[i] = [2]int{position[i], speed[i]}\n    }\n    sort.Slice(cars, func(i, j int) bool {\n        return cars[i][0] > cars[j][0]\n    })\n\n    // Explicit stack tracking fleet arrival times\n    stack := []float64{}\n\n    for _, car := range cars {\n        time := float64(target-car[0]) / float64(car[1])\n        // Only push if this car is slower than the fleet ahead\n        if len(stack) == 0 || time > stack[len(stack)-1] {\n            stack = append(stack, time)\n        }\n    }\n    return len(stack)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        12
      ],
      "sort": [
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "loop": [
        14
      ],
      "calc_time": [
        15
      ],
      "check_fleet": [
        17
      ],
      "new_fleet": [
        18
      ],
      "merge": [
        17
      ],
      "result": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "function carFleet(target, position, speed) {\n    var n = position.length;\n    var cars = [];\n    for (var i = 0; i < n; i++) {\n        cars.push([position[i], speed[i]]);\n    }\n    cars.sort((a, b) => b[0] - a[0]);\n\n    // Explicit stack tracking fleet arrival times\n    var stack = [];\n\n    for (var j = 0; j < cars.length; j++) {\n        var time = (target - cars[j][0]) / cars[j][1];\n        // Only push if this car is slower than the fleet ahead\n        if (stack.length === 0 || time > stack[stack.length - 1]) {\n            stack.push(time);\n        }\n    }\n    return stack.length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        10
      ],
      "sort": [
        3,
        4,
        5,
        6,
        7
      ],
      "loop": [
        12
      ],
      "calc_time": [
        13
      ],
      "check_fleet": [
        15
      ],
      "new_fleet": [
        16
      ],
      "merge": [
        15
      ],
      "result": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function carFleet(target: number, position: number[], speed: number[]): number {\n    const n = position.length;\n    const cars: number[][] = [];\n    for (let i = 0; i < n; i++) {\n        cars.push([position[i], speed[i]]);\n    }\n    cars.sort((a, b) => b[0] - a[0]);\n\n    // Explicit stack tracking fleet arrival times\n    const stack: number[] = [];\n\n    for (const car of cars) {\n        const time = (target - car[0]) / car[1];\n        // Only push if this car is slower than the fleet ahead\n        if (stack.length === 0 || time > stack[stack.length - 1]) {\n            stack.push(time);\n        }\n    }\n    return stack.length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        10
      ],
      "sort": [
        3,
        4,
        5,
        6,
        7
      ],
      "loop": [
        12
      ],
      "calc_time": [
        13
      ],
      "check_fleet": [
        15
      ],
      "new_fleet": [
        16
      ],
      "merge": [
        15
      ],
      "result": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {}
  }
};

const CarFleetPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "target": 12,
      "position": [
        10,
        8,
        0,
        5,
        3
      ],
      "speed": [
        2,
        4,
        1,
        1,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Single car",
    "value": {
      "target": 10,
      "position": [
        3
      ],
      "speed": [
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All catch up",
    "value": {
      "target": 100,
      "position": [
        0,
        2,
        4
      ],
      "speed": [
        4,
        2,
        1
      ]
    }
  }
];

function generateCarFleetSteps(e: any): any[] {
  

let t=e.target,i=e.position,a=e.speed,n=i.length,s=i.map((e,t)=>[e,a[t]]),l=e=>parseFloat(e.toFixed(2)),o=new StepRecorder({target:t,position:[...i],speed:[...a]},{}),c=[...s].sort((e,t)=>t[0]-e[0]),d=c.map(([e,i])=>l((t-e)/i)),p=(e,t,i)=>{o.update_variable("carsSorted",e.map(e=>[e[0],e[1]])),o.update_variable("timesSorted",[...t]),o.update_variable("fleetOf",[...i])},f=Array(n).fill(-1);o.update_variable("target",t),p(c,d,f),o.record("-",`Cars drive toward the finish at ${t}. Count how many fleets arrive.`),o.update_variable("stackTimes",[]),o.record("init","Use a stack of fleet lead times; its size is the fleet count."),o.record("sort","Sort by position descending, then scan from the car closest to the target.");let u=[];for(let e=0;e<c.length;e++){let[i,r]=c[e],a=(t-i)/r;o.update_variable("i",e),o.update_variable("pos",i),o.update_variable("spd",r),o.delete_variable("time"),o.delete_variable("top"),o.update_visual("curr",{type:"pointer",position:e,label:"i"}),p(c,d,f),o.record("loop",`Car at position ${i} moving at speed ${r}`),o.update_variable("time",l(a)),o.record("calc_time",`Arrival time = (${t} - ${i}) / ${r} = ${l(a)}`);let n=u.length>0?u[u.length-1]:null;null!==n?o.update_variable("top",l(n)):o.delete_variable("top"),o.record("check_fleet",null===n?"Stack is empty, this car starts the first fleet":`Is arrival ${l(a)} > lead time ${l(n)} ?`),null===n||a>n?(f[e]=u.length,u.push(a),o.update_variable("stackTimes",u.map(e=>l(e))),p(c,d,f),o.record("new_fleet",null===n?`First fleet, push lead time ${l(a)}`:`${l(a)} > ${l(n)}: a new fleet forms, push ${l(a)}`)):(f[e]=u.length-1,p(c,d,f),o.record("merge",`${l(a)} <= ${l(n)}: it catches the fleet ahead and joins it`))}return o.delete_visual("curr"),o.delete_variable("time"),o.delete_variable("top"),o.delete_variable("i"),o.delete_variable("pos"),o.delete_variable("spd"),o.update_variable("return",u.length),p(c,d,f),o.record("result",`${u.length} fleet${1===u.length?"":"s"} reach the target`),o.record("complete",`Return the number of fleets: ${u.length}`),o.getSteps()
}

export function CarFleetProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CarFleetTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCarFleetSteps(e) as any[];
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
      title="Car Fleet"
      slug="car-fleet"
      approaches={approaches}
      presets={CarFleetPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Create Maximum Number (create-maximum-number)
// ==========================================

const CreateMaximumNumberTemplates = {
  "python": {
    "language": "python",
    "code": "def maxNumber(nums1, nums2, k):\n    def maxSubsequence(nums, t):\n        stack = []\n        canDrop = len(nums) - t\n        for num in nums:\n            while stack and stack[-1] < num and canDrop > 0:\n                stack.pop()\n                canDrop -= 1\n            if len(stack) < t:\n                stack.append(num)\n            else:\n                canDrop -= 1\n        return stack\n\n    def merge(sub1, sub2):\n        result = []\n        while sub1 or sub2:\n            if sub1 >= sub2:\n                result.append(sub1[0])\n                sub1 = sub1[1:]\n            else:\n                result.append(sub2[0])\n                sub2 = sub2[1:]\n        return result\n\n    best = [0] * k\n    for i in range(max(0, k - len(nums2)), min(k, len(nums1)) + 1):\n        sub1 = maxSubsequence(nums1, i)\n        sub2 = maxSubsequence(nums2, k - i)\n        merged = merge(sub1, sub2)\n        if merged > best:\n            best = merged\n    return best",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        26
      ],
      "try_split": [
        27
      ],
      "extract_sub1": [
        28
      ],
      "sub1_pop": [
        7,
        8
      ],
      "sub1_push": [
        10
      ],
      "extract_sub2": [
        29
      ],
      "sub2_pop": [
        7,
        8
      ],
      "sub2_push": [
        10
      ],
      "merge_step": [
        18,
        19,
        22
      ],
      "compare_result": [
        31
      ],
      "update_best": [
        32
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_better": [
        31
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] maxNumber(int[] nums1, int[] nums2, int k) {\n    int[] best = new int[k];\n    for (int i = Math.max(0, k - nums2.length); i <= Math.min(k, nums1.length); i++) {\n        int[] sub1 = maxSubsequence(nums1, i);\n        int[] sub2 = maxSubsequence(nums2, k - i);\n        int[] merged = merge(sub1, sub2);\n        if (greater(merged, 0, best, 0)) {\n            best = merged;\n        }\n    }\n    return best;\n}\n\nint[] maxSubsequence(int[] nums, int t) {\n    int[] stack = new int[t];\n    int top = -1, canDrop = nums.length - t;\n    for (int num : nums) {\n        while (top >= 0 && stack[top] < num && canDrop > 0) {\n            top--;\n            canDrop--;\n        }\n        if (top + 1 < t) stack[++top] = num;\n        else canDrop--;\n    }\n    return Arrays.copyOf(stack, t);\n}\n\nint[] merge(int[] sub1, int[] sub2) {\n    int[] result = new int[sub1.length + sub2.length];\n    int i = 0, j = 0, idx = 0;\n    while (i < sub1.length || j < sub2.length) {\n        if (greater(sub1, i, sub2, j)) result[idx++] = sub1[i++];\n        else result[idx++] = sub2[j++];\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "try_split": [
        3
      ],
      "extract_sub1": [
        4
      ],
      "sub1_pop": [
        19,
        20
      ],
      "sub1_push": [
        22
      ],
      "extract_sub2": [
        5
      ],
      "sub2_pop": [
        19,
        20
      ],
      "sub2_push": [
        22
      ],
      "merge_step": [
        32,
        33
      ],
      "compare_result": [
        7
      ],
      "update_best": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "is_better": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> maxNumber(vector<int>& nums1, vector<int>& nums2, int k) {\n    vector<int> best(k, 0);\n    int m = nums1.size(), n = nums2.size();\n    for (int i = max(0, k - n); i <= min(k, m); i++) {\n        auto sub1 = maxSubsequence(nums1, i);\n        auto sub2 = maxSubsequence(nums2, k - i);\n        auto merged = merge(sub1, sub2);\n        if (greater(merged, 0, best, 0)) {\n            best = merged;\n        }\n    }\n    return best;\n}\n\nvector<int> maxSubsequence(vector<int>& nums, int t) {\n    vector<int> stack;\n    int canDrop = nums.size() - t;\n    for (int num : nums) {\n        while (!stack.empty() && stack.back() < num && canDrop > 0) {\n            stack.pop_back();\n            canDrop--;\n        }\n        if (stack.size() < t) stack.push_back(num);\n        else canDrop--;\n    }\n    return stack;\n}\n\nvector<int> merge(vector<int>& sub1, vector<int>& sub2) {\n    vector<int> result;\n    int i = 0, j = 0;\n    while (i < sub1.size() || j < sub2.size()) {\n        if (greater(sub1, i, sub2, j)) result.push_back(sub1[i++]);\n        else result.push_back(sub2[j++]);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "try_split": [
        4
      ],
      "extract_sub1": [
        5
      ],
      "sub1_pop": [
        20,
        21
      ],
      "sub1_push": [
        23
      ],
      "extract_sub2": [
        6
      ],
      "sub2_pop": [
        20,
        21
      ],
      "sub2_push": [
        23
      ],
      "merge_step": [
        33,
        34
      ],
      "compare_result": [
        8
      ],
      "update_best": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_better": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] MaxNumber(int[] nums1, int[] nums2, int k) {\n    int[] best = new int[k];\n    int m = nums1.Length, n = nums2.Length;\n    for (int i = Math.Max(0, k - n); i <= Math.Min(k, m); i++) {\n        int[] sub1 = MaxSubsequence(nums1, i);\n        int[] sub2 = MaxSubsequence(nums2, k - i);\n        int[] merged = Merge(sub1, sub2);\n        if (Greater(merged, 0, best, 0)) {\n            best = merged;\n        }\n    }\n    return best;\n}\n\nint[] MaxSubsequence(int[] nums, int t) {\n    var stack = new List<int>();\n    int canDrop = nums.Length - t;\n    foreach (int num in nums) {\n        while (stack.Count > 0 && stack[^1] < num && canDrop > 0) {\n            stack.RemoveAt(stack.Count - 1);\n            canDrop--;\n        }\n        if (stack.Count < t) stack.Add(num);\n        else canDrop--;\n    }\n    return stack.ToArray();\n}\n\nint[] Merge(int[] sub1, int[] sub2) {\n    var result = new List<int>();\n    int i = 0, j = 0;\n    while (i < sub1.Length || j < sub2.Length) {\n        if (Greater(sub1, i, sub2, j)) result.Add(sub1[i++]);\n        else result.Add(sub2[j++]);\n    }\n    return result.ToArray();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "try_split": [
        4
      ],
      "extract_sub1": [
        5
      ],
      "sub1_pop": [
        20,
        21
      ],
      "sub1_push": [
        23
      ],
      "extract_sub2": [
        6
      ],
      "sub2_pop": [
        20,
        21
      ],
      "sub2_push": [
        23
      ],
      "merge_step": [
        33,
        34
      ],
      "compare_result": [
        8
      ],
      "update_best": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_better": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxNumber(nums1, nums2 []int, k int) []int {\n    best := make([]int, k)\n    m, n := len(nums1), len(nums2)\n    for i := max(0, k-n); i <= min(k, m); i++ {\n        sub1 := maxSubsequence(nums1, i)\n        sub2 := maxSubsequence(nums2, k-i)\n        merged := merge(sub1, sub2)\n        if greater(merged, 0, best, 0) {\n            best = merged\n        }\n    }\n    return best\n}\n\nfunc maxSubsequence(nums []int, t int) []int {\n    stack := []int{}\n    canDrop := len(nums) - t\n    for _, num := range nums {\n        for len(stack) > 0 && stack[len(stack)-1] < num && canDrop > 0 {\n            stack = stack[:len(stack)-1]\n            canDrop--\n        }\n        if len(stack) < t {\n            stack = append(stack, num)\n        } else {\n            canDrop--\n        }\n    }\n    return stack\n}\n\nfunc merge(sub1, sub2 []int) []int {\n    result := []int{}\n    i, j := 0, 0\n    for i < len(sub1) || j < len(sub2) {\n        if greater(sub1, i, sub2, j) {\n            result = append(result, sub1[i])\n            i++\n        } else {\n            result = append(result, sub2[j])\n            j++\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "try_split": [
        4
      ],
      "extract_sub1": [
        5
      ],
      "sub1_pop": [
        20,
        21
      ],
      "sub1_push": [
        24
      ],
      "extract_sub2": [
        6
      ],
      "sub2_pop": [
        20,
        21
      ],
      "sub2_push": [
        24
      ],
      "merge_step": [
        36,
        37,
        40
      ],
      "compare_result": [
        8
      ],
      "update_best": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_better": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxNumber(nums1, nums2, k) {\n    let best = new Array(k).fill(0);\n    const m = nums1.length, n = nums2.length;\n    for (let i = Math.max(0, k - n); i <= Math.min(k, m); i++) {\n        const sub1 = maxSubsequence(nums1, i);\n        const sub2 = maxSubsequence(nums2, k - i);\n        const merged = merge(sub1, sub2);\n        if (greater(merged, 0, best, 0)) {\n            best = merged;\n        }\n    }\n    return best;\n}\n\nfunction maxSubsequence(nums, t) {\n    const stack = [];\n    let canDrop = nums.length - t;\n    for (const num of nums) {\n        while (stack.length > 0 && stack[stack.length - 1] < num && canDrop > 0) {\n            stack.pop();\n            canDrop--;\n        }\n        if (stack.length < t) stack.push(num);\n        else canDrop--;\n    }\n    return stack;\n}\n\nfunction merge(sub1, sub2) {\n    const result = [];\n    let i = 0, j = 0;\n    while (i < sub1.length || j < sub2.length) {\n        if (greater(sub1, i, sub2, j)) result.push(sub1[i++]);\n        else result.push(sub2[j++]);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "try_split": [
        4
      ],
      "extract_sub1": [
        5
      ],
      "sub1_pop": [
        20,
        21
      ],
      "sub1_push": [
        23
      ],
      "extract_sub2": [
        6
      ],
      "sub2_pop": [
        20,
        21
      ],
      "sub2_push": [
        23
      ],
      "merge_step": [
        33,
        34
      ],
      "compare_result": [
        8
      ],
      "update_best": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_better": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxNumber(nums1: number[], nums2: number[], k: number): number[] {\n    let best: number[] = new Array(k).fill(0);\n    const m = nums1.length, n = nums2.length;\n    for (let i = Math.max(0, k - n); i <= Math.min(k, m); i++) {\n        const sub1 = maxSubsequence(nums1, i);\n        const sub2 = maxSubsequence(nums2, k - i);\n        const merged = merge(sub1, sub2);\n        if (greater(merged, 0, best, 0)) {\n            best = merged;\n        }\n    }\n    return best;\n}\n\nfunction maxSubsequence(nums: number[], t: number): number[] {\n    const stack: number[] = [];\n    let canDrop = nums.length - t;\n    for (const num of nums) {\n        while (stack.length > 0 && stack[stack.length - 1] < num && canDrop > 0) {\n            stack.pop();\n            canDrop--;\n        }\n        if (stack.length < t) stack.push(num);\n        else canDrop--;\n    }\n    return stack;\n}\n\nfunction merge(sub1: number[], sub2: number[]): number[] {\n    const result: number[] = [];\n    let i = 0, j = 0;\n    while (i < sub1.length || j < sub2.length) {\n        if (greater(sub1, i, sub2, j)) result.push(sub1[i++]);\n        else result.push(sub2[j++]);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "try_split": [
        4
      ],
      "extract_sub1": [
        5
      ],
      "sub1_pop": [
        20,
        21
      ],
      "sub1_push": [
        23
      ],
      "extract_sub2": [
        6
      ],
      "sub2_pop": [
        20,
        21
      ],
      "sub2_push": [
        23
      ],
      "merge_step": [
        33,
        34
      ],
      "compare_result": [
        8
      ],
      "update_best": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_better": [
        8
      ]
    }
  }
};

const CreateMaximumNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums1": [
        3,
        4,
        6,
        5
      ],
      "nums2": [
        9,
        1,
        2,
        5,
        8,
        3
      ],
      "k": 5
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums1": [
        6,
        7
      ],
      "nums2": [
        6,
        0,
        4
      ],
      "k": 5
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums1": [
        3,
        9
      ],
      "nums2": [
        8,
        9
      ],
      "k": 3
    }
  }
];

function generateCreateMaximumNumberSteps(e: any): any[] {
  

let t=e.nums1,n=e.nums2,r=e.k,s=t.length,a=n.length,l={};t.forEach((e,t)=>{l[`nums1_${t}`]={type:"arrayElement",value:e,position:t}}),n.forEach((e,t)=>{l[`nums2_${t}`]={type:"arrayElement",value:e,position:t}});let u=new StepRecorder({},{...l});u.record("-","Start: Create Maximum Number");let o=Array(r).fill(0);function c(e,t,n,i){for(;t<e.length&&i<n.length&&e[t]===n[i];)t++,i++;return i===n.length||t!==e.length&&e[t]>n[i]}function m(){for(let e=0;e<s+a;e++)u.delete_visual(`sub1_${e}`),u.delete_visual(`sub2_${e}`),u.delete_visual(`merged_${e}`),u.delete_visual(`stack_${e}`)}o.forEach((e,t)=>{u.add_new_visual(`best_${t}`,{type:"arrayElement",value:e,position:t,state:"inactive"})}),u.add_new_variable("k",r),u.add_new_variable("best",[...o]),u.record("initialize",`Initialize best array of length ${r} with zeros`);for(let e=Math.max(0,r-a);e<=Math.min(r,s);e++){m(),u.update_variable("split",`i=${e}, j=${r-e}`),u.update_visual("meta_split",{type:"metadata",value:`Take ${e} from nums1, ${r-e} from nums2`}),t.forEach((e,t)=>{u.update_visual(`nums1_${t}`,{type:"arrayElement",value:e,position:t})}),n.forEach((e,t)=>{u.update_visual(`nums2_${t}`,{type:"arrayElement",value:e,position:t})}),u.record("try_split",`Try split: take ${e} from nums1, ${r-e} from nums2`);let i=[],l=s-e;if(e>0)for(let n=0;n<s;n++){let r=t[n];for(u.update_visual(`nums1_${n}`,{type:"arrayElement",value:r,position:n,state:"active"});i.length>0&&i[i.length-1]<r&&l>0;){let e=i.pop();l--;for(let e=0;e<=i.length+1;e++)u.delete_visual(`stack_${e}`);i.forEach((e,t)=>{u.update_visual(`stack_${t}`,{type:"stackElement",value:e,position:t})}),u.record("sub1_pop",`Pop ${e} from stack (${r} > ${e})`)}i.length<e?(i.push(r),i.forEach((e,t)=>{u.update_visual(`stack_${t}`,{type:"stackElement",value:e,position:t,state:t===i.length-1?"active":void 0})}),u.record("sub1_push",`Push ${r} onto stack`)):l--,u.update_visual(`nums1_${n}`,{type:"arrayElement",value:r,position:n})}let d=i.slice(0,e);for(let e=0;e<s+a;e++)u.delete_visual(`stack_${e}`);d.forEach((e,t)=>{u.update_visual(`sub1_${t}`,{type:"arrayElement",value:e,position:t,state:"highlight"})}),e>0&&u.record("extract_sub1",`Extracted max subsequence of length ${e} from nums1: [${d.join(", ")}]`);let p=[],b=r-e,h=a-b;if(b>0)for(let e=0;e<a;e++){let t=n[e];for(u.update_visual(`nums2_${e}`,{type:"arrayElement",value:t,position:e,state:"active"});p.length>0&&p[p.length-1]<t&&h>0;){let e=p.pop();h--;for(let e=0;e<=p.length+1;e++)u.delete_visual(`stack_${e}`);p.forEach((e,t)=>{u.update_visual(`stack_${t}`,{type:"stackElement",value:e,position:t})}),u.record("sub2_pop",`Pop ${e} from stack (${t} > ${e})`)}p.length<b?(p.push(t),p.forEach((e,t)=>{u.update_visual(`stack_${t}`,{type:"stackElement",value:e,position:t,state:t===p.length-1?"active":void 0})}),u.record("sub2_push",`Push ${t} onto stack`)):h--,u.update_visual(`nums2_${e}`,{type:"arrayElement",value:t,position:e})}let g=p.slice(0,b);for(let e=0;e<s+a;e++)u.delete_visual(`stack_${e}`);g.forEach((e,t)=>{u.update_visual(`sub2_${t}`,{type:"arrayElement",value:e,position:t,state:"highlight"})}),b>0&&u.record("extract_sub2",`Extracted max subsequence of length ${b} from nums2: [${g.join(", ")}]`);let f=function(e,t){let n=[],i=0,r=0;for(;i<e.length&&r<t.length;)c(e,i,t,r)?n.push(e[i++]):n.push(t[r++]);for(;i<e.length;)n.push(e[i++]);for(;r<t.length;)n.push(t[r++]);return n}(d,g),x=0,v=0;for(let e=0;e<f.length;e++){let t=x<d.length&&(v>=g.length||c(d,x,g,v));t?(u.update_visual(`sub1_${x}`,{type:"arrayElement",value:d[x],position:x,state:"active"}),x++):(u.update_visual(`sub2_${v}`,{type:"arrayElement",value:g[v],position:v,state:"active"}),v++),u.update_visual(`merged_${e}`,{type:"arrayElement",value:f[e],position:e,state:"active"}),u.record("merge_step",`Merge position ${e}: pick ${f[e]} from ${t?"sub1":"sub2"}`),t?u.update_visual(`sub1_${x-1}`,{type:"arrayElement",value:d[x-1],position:x-1,state:"highlight"}):u.update_visual(`sub2_${v-1}`,{type:"arrayElement",value:g[v-1],position:v-1,state:"highlight"}),u.update_visual(`merged_${e}`,{type:"arrayElement",value:f[e],position:e,state:"highlight"})}let y=c(f,0,o,0);u.add_conditional("is_better",y),u.record("compare_result",`Compare merged [${f.join(", ")}] with best [${o.join(", ")}]: ${y?"merged is better":"best stays"}`),y&&(o=[...f],u.update_variable("best",[...o]),o.forEach((e,t)=>{u.update_visual(`best_${t}`,{type:"arrayElement",value:e,position:t,state:"active"})}),u.record("update_best",`Update best to [${o.join(", ")}]`))}return m(),u.delete_visual("meta_split"),u.delete_variable("split"),o.forEach((e,t)=>{u.update_visual(`best_${t}`,{type:"arrayElement",value:e,position:t,state:"active"})}),u.record("complete",`Done! Maximum number: [${o.join(", ")}]`),u.getSteps()
}

export function CreateMaximumNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CreateMaximumNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCreateMaximumNumberSteps(e) as any[];
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
      title="Create Maximum Number"
      slug="create-maximum-number"
      approaches={approaches}
      presets={CreateMaximumNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Decode String (decode-string)
// ==========================================

const DecodeStringTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def __init__(self):\n        self.index = 0\n\n    def decodeString(self, s: str) -> str:\n        return self.decode(s)\n\n    def decode(self, s):\n        result = []\n        while self.index < len(s) and s[self.index] != ']':\n            if s[self.index].isdigit():\n                num = 0\n                while self.index < len(s) and s[self.index].isdigit():\n                    num = num * 10 + int(s[self.index])\n                    self.index += 1\n                self.index += 1  # Skip '['\n                decoded = self.decode(s)\n                self.index += 1  # Skip ']'\n                result.append(decoded * num)\n            else:\n                result.append(s[self.index])\n                self.index += 1\n        return ''.join(result)",
    "lineMap": {
      "-": [
        1
      ],
      "enter_decode": [
        8,
        9
      ],
      "parse_num": [
        11,
        12,
        13,
        14,
        15
      ],
      "skip_open": [
        16
      ],
      "skip_close": [
        18
      ],
      "repeat_str": [
        19
      ],
      "append_char": [
        20,
        21,
        22
      ],
      "return_decode": [
        23
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int index = 0;\n    public String decodeString(String s) {\n        return decode(s);\n    }\n    private String decode(String s) {\n        StringBuilder result = new StringBuilder();\n        while (index < s.length() && s.charAt(index) != ']') {\n            if (Character.isDigit(s.charAt(index))) {\n                int num = 0;\n                while (index < s.length() && Character.isDigit(s.charAt(index))) {\n                    num = num * 10 + (s.charAt(index) - '0');\n                    index++;\n                }\n                index++; // Skip '['\n                String decoded = decode(s);\n                index++; // Skip ']'\n                for (int i = 0; i < num; i++) {\n                    result.append(decoded);\n                }\n            } else {\n                result.append(s.charAt(index));\n                index++;\n            }\n        }\n        return result.toString();\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "enter_decode": [
        6,
        7
      ],
      "parse_num": [
        9,
        10,
        11,
        12,
        13
      ],
      "skip_open": [
        15
      ],
      "skip_close": [
        17
      ],
      "repeat_str": [
        18,
        19,
        20
      ],
      "append_char": [
        21,
        22,
        23
      ],
      "return_decode": [
        26
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int index = 0;\n    string decodeString(string s) {\n        return decode(s);\n    }\n    string decode(string& s) {\n        string result;\n        while (index < s.size() && s[index] != ']') {\n            if (isdigit(s[index])) {\n                int num = 0;\n                while (index < s.size() && isdigit(s[index])) {\n                    num = num * 10 + (s[index] - '0');\n                    index++;\n                }\n                index++; // Skip '['\n                string decoded = decode(s);\n                index++; // Skip ']'\n                for (int i = 0; i < num; i++) {\n                    result += decoded;\n                }\n            } else {\n                result += s[index];\n                index++;\n            }\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "enter_decode": [
        7,
        8
      ],
      "parse_num": [
        10,
        11,
        12,
        13,
        14
      ],
      "skip_open": [
        16
      ],
      "skip_close": [
        18
      ],
      "repeat_str": [
        19,
        20,
        21
      ],
      "append_char": [
        22,
        23,
        24
      ],
      "return_decode": [
        27
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int index = 0;\n    public string DecodeString(string s) {\n        return Decode(s);\n    }\n    private string Decode(string s) {\n        var result = new System.Text.StringBuilder();\n        while (index < s.Length && s[index] != ']') {\n            if (char.IsDigit(s[index])) {\n                int num = 0;\n                while (index < s.Length && char.IsDigit(s[index])) {\n                    num = num * 10 + (s[index] - '0');\n                    index++;\n                }\n                index++; // Skip '['\n                string decoded = Decode(s);\n                index++; // Skip ']'\n                for (int i = 0; i < num; i++) {\n                    result.Append(decoded);\n                }\n            } else {\n                result.Append(s[index]);\n                index++;\n            }\n        }\n        return result.ToString();\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "enter_decode": [
        6,
        7
      ],
      "parse_num": [
        9,
        10,
        11,
        12,
        13
      ],
      "skip_open": [
        15
      ],
      "skip_close": [
        17
      ],
      "repeat_str": [
        18,
        19,
        20
      ],
      "append_char": [
        21,
        22,
        23
      ],
      "return_decode": [
        26
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "var idx int\n\nfunc decodeString(s string) string {\n    idx = 0\n    return decode(s)\n}\n\nfunc decode(s string) string {\n    result := \"\"\n    for idx < len(s) && s[idx] != ']' {\n        if s[idx] >= '0' && s[idx] <= '9' {\n            num := 0\n            for idx < len(s) && s[idx] >= '0' && s[idx] <= '9' {\n                num = num*10 + int(s[idx]-'0')\n                idx++\n            }\n            idx++ // Skip '['\n            decoded := decode(s)\n            idx++ // Skip ']'\n            for i := 0; i < num; i++ {\n                result += decoded\n            }\n        } else {\n            result += string(s[idx])\n            idx++\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "enter_decode": [
        8,
        9
      ],
      "parse_num": [
        11,
        12,
        13,
        14,
        15
      ],
      "skip_open": [
        17
      ],
      "skip_close": [
        19
      ],
      "repeat_str": [
        20,
        21,
        22
      ],
      "append_char": [
        23,
        24,
        25
      ],
      "return_decode": [
        28
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var decodeString = function(s) {\n    let index = 0;\n    function decode() {\n        let result = \"\";\n        while (index < s.length && s[index] !== ']') {\n            if (s[index] >= '0' && s[index] <= '9') {\n                let num = 0;\n                while (index < s.length && s[index] >= '0' && s[index] <= '9') {\n                    num = num * 10 + parseInt(s[index]);\n                    index++;\n                }\n                index++; // Skip '['\n                const decoded = decode();\n                index++; // Skip ']'\n                result += decoded.repeat(num);\n            } else {\n                result += s[index];\n                index++;\n            }\n        }\n        return result;\n    }\n    return decode();\n};",
    "lineMap": {
      "-": [
        1
      ],
      "enter_decode": [
        3,
        4
      ],
      "parse_num": [
        6,
        7,
        8,
        9,
        10
      ],
      "skip_open": [
        12
      ],
      "skip_close": [
        14
      ],
      "repeat_str": [
        15
      ],
      "append_char": [
        16,
        17,
        18
      ],
      "return_decode": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function decodeString(s: string): string {\n    let index = 0;\n    function decode(): string {\n        let result = \"\";\n        while (index < s.length && s[index] !== ']') {\n            if (s[index] >= '0' && s[index] <= '9') {\n                let num = 0;\n                while (index < s.length && s[index] >= '0' && s[index] <= '9') {\n                    num = num * 10 + parseInt(s[index]);\n                    index++;\n                }\n                index++; // Skip '['\n                const decoded = decode();\n                index++; // Skip ']'\n                result += decoded.repeat(num);\n            } else {\n                result += s[index];\n                index++;\n            }\n        }\n        return result;\n    }\n    return decode();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "enter_decode": [
        3,
        4
      ],
      "parse_num": [
        6,
        7,
        8,
        9,
        10
      ],
      "skip_open": [
        12
      ],
      "skip_close": [
        14
      ],
      "repeat_str": [
        15
      ],
      "append_char": [
        16,
        17,
        18
      ],
      "return_decode": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {}
  }
};

const DecodeStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "3[a]2[bc]"
    }
  },
  {
    "id": "ex2",
    "label": "Nested",
    "value": {
      "s": "3[a2[c]]"
    }
  },
  {
    "id": "ex3",
    "label": "Mixed",
    "value": {
      "s": "2[abc]3[cd]ef"
    }
  }
];

function generateDecodeStringSteps(e: any): any[] {
  

let t=e.s??"3[a]2[bc]",n=new StepRecorder({}),r=[],s=[],a="",l=0,c=e=>{for(let[i,c]of(n.update_variable("s",t),n.update_variable("currentString",a),n.update_variable("currentNum",l),n.update_variable("countStack",[...r]),n.update_variable("stringStack",[...s]),Object.entries(e)))n.update_variable(i,c)};n.delete_variable("ch"),c({i:-1}),n.record("-",`Decode "${t}" with a count stack and a string stack.`);let o=e=>e>="0"&&e<="9";for(let e=0;e<t.length;e++){let i=t[e];if(o(i))l=10*l+(i.charCodeAt(0)-48),c({i:e,ch:i}),n.record("read_digit",`Digit '${i}': currentNum = ${l}.`);else if("["===i){r.push(l),s.push(a);let t=l,o=a;l=0,a="",c({i:e,ch:i}),n.record("open",`'[': push count ${t} and prefix "${o}", reset current.`)}else if("]"===i){let t=r.pop()??1,l=s.pop()??"",o=a;a=l+a.repeat(t),c({i:e,ch:i}),n.record("close",`']': pop ${t}, "${l}" → "${l}" + "${o}"\xd7${t} = "${a}".`)}else a+=i,c({i:e,ch:i}),n.record("append",`Letter '${i}': currentString = "${a}".`)}return n.delete_variable("ch"),c({i:t.length,result:a}),n.record("complete",`Done! Decoded string = "${a}".`),n.getSteps()
}

export function DecodeStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DecodeStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDecodeStringSteps(e) as any[];
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
      title="Decode String"
      slug="decode-string"
      approaches={approaches}
      presets={DecodeStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design a Text Editor (design-a-text-editor)
// ==========================================

const DesignATextEditorTemplates = {
  "python": {
    "language": "python",
    "code": "class TextEditor:\n    def __init__(self):\n        self.left = []   # characters to the left of cursor\n        self.right = []  # characters to the right of cursor\n\n    def addText(self, text: str) -> None:\n        # Push each character onto the left stack\n        for ch in text:\n            self.left.append(ch)\n\n    def deleteText(self, k: int) -> int:\n        deleted = 0\n        # Pop up to k characters from the left stack\n        while deleted < k and self.left:\n            self.left.pop()\n            deleted += 1\n        return deleted\n\n    def cursorLeft(self, k: int) -> str:\n        # Move k characters from left to right\n        moves = 0\n        while moves < k and self.left:\n            self.right.append(self.left.pop())\n            moves += 1\n        return self._get_left_text()\n\n    def cursorRight(self, k: int) -> str:\n        # Move k characters from right to left\n        moves = 0\n        while moves < k and self.right:\n            self.left.append(self.right.pop())\n            moves += 1\n        return self._get_left_text()\n\n    def _get_left_text(self) -> str:\n        # Return last min(10, len) characters to the left of cursor\n        count = min(10, len(self.left))\n        return ''.join(self.left[-count:]) if count > 0 else ''",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "show_result": [
        35,
        37,
        38
      ],
      "start_addtext": [
        6
      ],
      "push_char": [
        8,
        9
      ],
      "addtext_done": [
        9
      ],
      "start_deletetext": [
        11
      ],
      "pop_char": [
        14,
        15,
        16
      ],
      "deletetext_done": [
        17
      ],
      "start_cursorleft": [
        19
      ],
      "move_to_right": [
        22,
        23,
        24
      ],
      "cursorleft_done": [
        25
      ],
      "start_cursorright": [
        27
      ],
      "move_to_left": [
        30,
        31,
        32
      ],
      "cursorright_done": [
        33
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class TextEditor {\n    Deque<Character> left;\n    Deque<Character> right;\n\n    public TextEditor() {\n        left = new ArrayDeque<>();\n        right = new ArrayDeque<>();\n    }\n\n    public void addText(String text) {\n        // Push each character onto the left stack\n        for (char ch : text.toCharArray()) {\n            left.push(ch);\n        }\n    }\n\n    public int deleteText(int k) {\n        int deleted = 0;\n        // Pop up to k characters from the left stack\n        while (deleted < k && !left.isEmpty()) {\n            left.pop();\n            deleted++;\n        }\n        return deleted;\n    }\n\n    public String cursorLeft(int k) {\n        // Move k characters from left stack to right stack\n        int moves = 0;\n        while (moves < k && !left.isEmpty()) {\n            right.push(left.pop());\n            moves++;\n        }\n        return getLeftText();\n    }\n\n    public String cursorRight(int k) {\n        // Move k characters from right stack to left stack\n        int moves = 0;\n        while (moves < k && !right.isEmpty()) {\n            left.push(right.pop());\n            moves++;\n        }\n        return getLeftText();\n    }\n\n    private String getLeftText() {\n        // Return last min(10, left.size) characters to the left of cursor\n        int count = Math.min(10, left.size());\n        char[] chars = new char[count];\n        // Pop characters, they come out in reverse order\n        for (int i = count - 1; i >= 0; i--) {\n            chars[i] = left.pop();\n        }\n        // Push them back onto the left stack\n        for (char ch : chars) {\n            left.push(ch);\n        }\n        return new String(chars);\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "show_result": [
        47,
        49,
        59
      ],
      "start_addtext": [
        10
      ],
      "push_char": [
        12,
        13
      ],
      "addtext_done": [
        14
      ],
      "start_deletetext": [
        17
      ],
      "pop_char": [
        20,
        21,
        22
      ],
      "deletetext_done": [
        24
      ],
      "start_cursorleft": [
        27
      ],
      "move_to_right": [
        30,
        31,
        32
      ],
      "cursorleft_done": [
        34
      ],
      "start_cursorright": [
        37
      ],
      "move_to_left": [
        40,
        41,
        42
      ],
      "cursorright_done": [
        44
      ],
      "complete": [
        60
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class TextEditor {\n    vector<char> left;\n    vector<char> right;\n\n    string getLeftText() {\n        int count = min(10, (int)left.size());\n        return string(left.end() - count, left.end());\n    }\n\npublic:\n    TextEditor() {}\n\n    void addText(string text) {\n        // Push each character onto the left stack\n        for (char ch : text) {\n            left.push_back(ch);\n        }\n    }\n\n    int deleteText(int k) {\n        int deleted = 0;\n        // Pop up to k characters from the left stack\n        while (deleted < k && !left.empty()) {\n            left.pop_back();\n            deleted++;\n        }\n        return deleted;\n    }\n\n    string cursorLeft(int k) {\n        // Move k characters from left to right\n        int moves = 0;\n        while (moves < k && !left.empty()) {\n            right.push_back(left.back());\n            left.pop_back();\n            moves++;\n        }\n        return getLeftText();\n    }\n\n    string cursorRight(int k) {\n        // Move k characters from right to left\n        int moves = 0;\n        while (moves < k && !right.empty()) {\n            left.push_back(right.back());\n            right.pop_back();\n            moves++;\n        }\n        return getLeftText();\n    }\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "show_result": [
        5,
        6,
        7
      ],
      "start_addtext": [
        13
      ],
      "push_char": [
        15,
        16
      ],
      "addtext_done": [
        17
      ],
      "start_deletetext": [
        20
      ],
      "pop_char": [
        23,
        24,
        25
      ],
      "deletetext_done": [
        27
      ],
      "start_cursorleft": [
        30
      ],
      "move_to_right": [
        33,
        34,
        35,
        36
      ],
      "cursorleft_done": [
        38
      ],
      "start_cursorright": [
        41
      ],
      "move_to_left": [
        44,
        45,
        46,
        47
      ],
      "cursorright_done": [
        49
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class TextEditor {\n    List<char> left;\n    List<char> right;\n\n    public TextEditor() {\n        left = new List<char>();\n        right = new List<char>();\n    }\n\n    public void AddText(string text) {\n        // Push each character onto the left stack\n        foreach (char ch in text) {\n            left.Add(ch);\n        }\n    }\n\n    public int DeleteText(int k) {\n        int deleted = 0;\n        // Pop up to k characters from the left stack\n        while (deleted < k && left.Count > 0) {\n            left.RemoveAt(left.Count - 1);\n            deleted++;\n        }\n        return deleted;\n    }\n\n    public string CursorLeft(int k) {\n        // Move k characters from left to right\n        int moves = 0;\n        while (moves < k && left.Count > 0) {\n            right.Add(left[left.Count - 1]);\n            left.RemoveAt(left.Count - 1);\n            moves++;\n        }\n        return GetLeftText();\n    }\n\n    public string CursorRight(int k) {\n        // Move k characters from right to left\n        int moves = 0;\n        while (moves < k && right.Count > 0) {\n            left.Add(right[right.Count - 1]);\n            right.RemoveAt(right.Count - 1);\n            moves++;\n        }\n        return GetLeftText();\n    }\n\n    private string GetLeftText() {\n        int count = Math.Min(10, left.Count);\n        int start = left.Count - count;\n        char[] chars = new char[count];\n        for (int i = 0; i < count; i++) {\n            chars[i] = left[start + i];\n        }\n        return new string(chars);\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "show_result": [
        49,
        50,
        51,
        56
      ],
      "start_addtext": [
        10
      ],
      "push_char": [
        12,
        13
      ],
      "addtext_done": [
        14
      ],
      "start_deletetext": [
        17
      ],
      "pop_char": [
        20,
        21,
        22
      ],
      "deletetext_done": [
        24
      ],
      "start_cursorleft": [
        27
      ],
      "move_to_right": [
        30,
        31,
        32,
        33
      ],
      "cursorleft_done": [
        35
      ],
      "start_cursorright": [
        38
      ],
      "move_to_left": [
        41,
        42,
        43,
        44
      ],
      "cursorright_done": [
        46
      ],
      "complete": [
        57
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "type TextEditor struct {\n    left  []byte\n    right []byte\n}\n\nfunc Constructor() TextEditor {\n    return TextEditor{left: []byte{}, right: []byte{}}\n}\n\nfunc (t *TextEditor) AddText(text string) {\n    // Push each character onto the left stack\n    t.left = append(t.left, []byte(text)...)\n}\n\nfunc (t *TextEditor) DeleteText(k int) int {\n    deleted := k\n    if deleted > len(t.left) {\n        deleted = len(t.left)\n    }\n    // Pop deleted characters from the left stack\n    t.left = t.left[:len(t.left)-deleted]\n    return deleted\n}\n\nfunc (t *TextEditor) CursorLeft(k int) string {\n    // Move k characters from left to right\n    moves := 0\n    for moves < k && len(t.left) > 0 {\n        ch := t.left[len(t.left)-1]\n        t.left = t.left[:len(t.left)-1]\n        t.right = append(t.right, ch)\n        moves++\n    }\n    return t.getLeftText()\n}\n\nfunc (t *TextEditor) CursorRight(k int) string {\n    // Move k characters from right to left\n    moves := 0\n    for moves < k && len(t.right) > 0 {\n        ch := t.right[len(t.right)-1]\n        t.right = t.right[:len(t.right)-1]\n        t.left = append(t.left, ch)\n        moves++\n    }\n    return t.getLeftText()\n}\n\nfunc (t *TextEditor) getLeftText() string {\n    count := 10\n    if count > len(t.left) {\n        count = len(t.left)\n    }\n    return string(t.left[len(t.left)-count:])\n}",
    "lineMap": {
      "-": [
        7
      ],
      "show_result": [
        49,
        50,
        51,
        52,
        54
      ],
      "start_addtext": [
        10
      ],
      "push_char": [
        11,
        12
      ],
      "addtext_done": [
        12
      ],
      "start_deletetext": [
        15
      ],
      "pop_char": [
        16,
        17,
        18,
        21
      ],
      "deletetext_done": [
        22
      ],
      "start_cursorleft": [
        25
      ],
      "move_to_right": [
        28,
        29,
        30,
        31,
        32
      ],
      "cursorleft_done": [
        34
      ],
      "start_cursorright": [
        37
      ],
      "move_to_left": [
        40,
        41,
        42,
        43,
        44
      ],
      "cursorright_done": [
        46
      ],
      "complete": [
        55
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var TextEditor = function () {\n  this.left = [];  // characters to the left of cursor\n  this.right = []; // characters to the right of cursor\n};\n\nTextEditor.prototype.addText = function (text) {\n  // Push each character onto the left stack\n  for (var i = 0; i < text.length; i++) {\n    this.left.push(text[i]);\n  }\n};\n\nTextEditor.prototype.deleteText = function (k) {\n  var deleted = 0;\n  // Pop up to k characters from the left stack\n  while (deleted < k && this.left.length > 0) {\n    this.left.pop();\n    deleted++;\n  }\n  return deleted;\n};\n\nTextEditor.prototype.cursorLeft = function (k) {\n  // Move k characters from left to right\n  var moves = 0;\n  while (moves < k && this.left.length > 0) {\n    this.right.push(this.left.pop());\n    moves++;\n  }\n  return this._getLeftText();\n};\n\nTextEditor.prototype.cursorRight = function (k) {\n  // Move k characters from right to left\n  var moves = 0;\n  while (moves < k && this.right.length > 0) {\n    this.left.push(this.right.pop());\n    moves++;\n  }\n  return this._getLeftText();\n};\n\nTextEditor.prototype._getLeftText = function () {\n  var count = Math.min(10, this.left.length);\n  return this.left.slice(this.left.length - count).join(\"\");\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "show_result": [
        43,
        44,
        45
      ],
      "start_addtext": [
        6
      ],
      "push_char": [
        8,
        9
      ],
      "addtext_done": [
        10
      ],
      "start_deletetext": [
        13
      ],
      "pop_char": [
        16,
        17,
        18
      ],
      "deletetext_done": [
        20
      ],
      "start_cursorleft": [
        23
      ],
      "move_to_right": [
        26,
        27,
        28
      ],
      "cursorleft_done": [
        30
      ],
      "start_cursorright": [
        33
      ],
      "move_to_left": [
        36,
        37,
        38
      ],
      "cursorright_done": [
        40
      ],
      "complete": [
        45
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "class TextEditor {\n    private left: string[];\n    private right: string[];\n\n    constructor() {\n        this.left = [];\n        this.right = [];\n    }\n\n    addText(text: string): void {\n        // Push each character onto the left stack\n        for (const ch of text) {\n            this.left.push(ch);\n        }\n    }\n\n    deleteText(k: number): number {\n        let deleted = 0;\n        // Pop up to k characters from the left stack\n        while (deleted < k && this.left.length > 0) {\n            this.left.pop();\n            deleted++;\n        }\n        return deleted;\n    }\n\n    cursorLeft(k: number): string {\n        // Move k characters from left to right\n        let moves = 0;\n        while (moves < k && this.left.length > 0) {\n            this.right.push(this.left.pop()!);\n            moves++;\n        }\n        return this.getLeftText();\n    }\n\n    cursorRight(k: number): string {\n        // Move k characters from right to left\n        let moves = 0;\n        while (moves < k && this.right.length > 0) {\n            this.left.push(this.right.pop()!);\n            moves++;\n        }\n        return this.getLeftText();\n    }\n\n    private getLeftText(): string {\n        const count = Math.min(10, this.left.length);\n        return this.left.slice(this.left.length - count).join(\"\");\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "show_result": [
        47,
        48,
        49
      ],
      "start_addtext": [
        10
      ],
      "push_char": [
        12,
        13
      ],
      "addtext_done": [
        14
      ],
      "start_deletetext": [
        17
      ],
      "pop_char": [
        20,
        21,
        22
      ],
      "deletetext_done": [
        24
      ],
      "start_cursorleft": [
        27
      ],
      "move_to_right": [
        30,
        31,
        32
      ],
      "cursorleft_done": [
        34
      ],
      "start_cursorright": [
        37
      ],
      "move_to_left": [
        40,
        41,
        42
      ],
      "cursorright_done": [
        44
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {}
  }
};

const DesignATextEditorPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "LeetCode Example",
    "value": {
      "operations": [
        "TextEditor",
        "addText",
        "deleteText",
        "addText",
        "cursorRight",
        "cursorLeft",
        "deleteText",
        "cursorLeft",
        "cursorRight"
      ],
      "values": [
        null,
        "leetcode",
        4,
        "practice",
        3,
        9,
        4,
        7,
        6
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple Edit",
    "value": {
      "operations": [
        "TextEditor",
        "addText",
        "cursorLeft",
        "deleteText",
        "cursorRight",
        "addText"
      ],
      "values": [
        null,
        "hello",
        3,
        1,
        2,
        " world"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Insert Middle",
    "value": {
      "operations": [
        "TextEditor",
        "addText",
        "cursorLeft",
        "addText",
        "cursorRight",
        "deleteText"
      ],
      "values": [
        null,
        "abc",
        2,
        "XY",
        1,
        2
      ]
    }
  }
];

function generateDesignATextEditorSteps(t: any): any[] {
  

let e=t.operations||[],r=t.values||[],o=new StepRecorder({operation:"",result:""},{}),a=[],l=[];function i(){for(let t of Object.keys(o.getCurrentVisuals()))(t.startsWith("left_")||t.startsWith("right_"))&&o.delete_visual(t);for(let t=0;t<a.length;t++)o.add_new_visual(`left_${t}`,{type:"stackElement",value:a[t],position:t,state:"standard"});for(let t=0;t<l.length;t++)o.add_new_visual(`right_${t}`,{type:"stackElement",value:l[t],position:t,state:"standard"});let t=a.join("")+"|"+[...l].reverse().join("");o.update_visual("meta_text",{type:"metadata",value:t}),o.update_visual("meta_cursor",{type:"metadata",value:a.length})}function n(){let t=Math.min(10,a.length);return a.slice(a.length-t).join("")}o.add_new_visual("meta_text",{type:"metadata",value:"|"}),o.add_new_visual("meta_cursor",{type:"metadata",value:0}),o.add_new_visual("meta_result",{type:"metadata",value:""}),o.record("-","Initialize TextEditor with empty text and cursor at position 0");for(let t=0;t<e.length;t++){let s=e[t],c=r[t];if("TextEditor"===s){o.update_variable("operation","TextEditor()"),o.update_variable("result","null"),o.update_visual("meta_result",{type:"metadata",value:"null"}),o.record("show_result","TextEditor constructor called, initialized empty editor");continue}if("addText"===s&&"string"==typeof c){o.update_variable("operation",`addText("${c}")`),o.update_variable("result",""),o.update_visual("meta_result",{type:"metadata",value:""}),i(),o.record("start_addtext",`addText("${c}"), push each character onto left stack`);for(let t=0;t<c.length;t++){let e=c[t];a.push(e),i(),o.update_visual(`left_${a.length-1}`,{type:"stackElement",value:e,position:a.length-1,state:"active"}),o.record("push_char",`Push '${e}' onto left stack (${t+1}/${c.length})`)}i(),o.update_variable("result","null"),o.update_visual("meta_result",{type:"metadata",value:"null"}),o.record("addtext_done",`addText complete, added "${c}" before cursor`)}if("deleteText"===s&&"number"==typeof c){o.update_variable("operation",`deleteText(${c})`),o.update_variable("result",""),o.update_visual("meta_result",{type:"metadata",value:""}),i(),o.record("start_deletetext",`deleteText(${c}), pop up to ${c} characters from left stack`);let t=Math.min(c,a.length),e=0;for(let r=0;r<t;r++){let s=a.length-1;o.update_visual(`left_${s}`,{type:"stackElement",value:a[s],position:s,state:"muted"}),o.record("pop_char",`Delete '${a[s]}' from left stack (${r+1}/${t})`),a.pop(),e++,i()}o.update_variable("result",String(e)),o.update_visual("meta_result",{type:"metadata",value:e}),o.record("deletetext_done",`deleteText complete, deleted ${e} character(s)`)}if("cursorLeft"===s&&"number"==typeof c){o.update_variable("operation",`cursorLeft(${c})`),o.update_variable("result",""),o.update_visual("meta_result",{type:"metadata",value:""}),i(),o.record("start_cursorleft",`cursorLeft(${c}), move up to ${c} characters from left to right stack`);let t=Math.min(c,a.length);for(let e=0;e<t;e++){let r=a.length-1;o.update_visual(`left_${r}`,{type:"stackElement",value:a[r],position:r,state:"highlight"}),o.record("move_to_right",`Move '${a[r]}' from left to right stack (${e+1}/${t})`);let s=a.pop();l.push(s),i()}let e=n();o.update_variable("result",`"${e}"`),o.update_visual("meta_result",{type:"metadata",value:`"${e}"`}),o.record("cursorleft_done",`cursorLeft complete, returned "${e}" (last ${Math.min(10,a.length)} chars left of cursor)`)}if("cursorRight"===s&&"number"==typeof c){o.update_variable("operation",`cursorRight(${c})`),o.update_variable("result",""),o.update_visual("meta_result",{type:"metadata",value:""}),i(),o.record("start_cursorright",`cursorRight(${c}), move up to ${c} characters from right to left stack`);let t=Math.min(c,l.length);for(let e=0;e<t;e++){let r=l.length-1;o.update_visual(`right_${r}`,{type:"stackElement",value:l[r],position:r,state:"highlight"}),o.record("move_to_left",`Move '${l[r]}' from right to left stack (${e+1}/${t})`);let s=l.pop();a.push(s),i()}let e=n();o.update_variable("result",`"${e}"`),o.update_visual("meta_result",{type:"metadata",value:`"${e}"`}),o.record("cursorright_done",`cursorRight complete, returned "${e}" (last ${Math.min(10,a.length)} chars left of cursor)`)}}return o.record("complete","All operations completed"),o.getSteps()
}

export function DesignATextEditorProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignATextEditorTemplates,
      generateSteps: (t: any) => {
        const recorded = generateDesignATextEditorSteps(t) as any[];
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
      title="Design a Text Editor"
      slug="design-a-text-editor"
      approaches={approaches}
      presets={DesignATextEditorPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design Browser History (design-browser-history)
// ==========================================

const DesignBrowserHistoryTemplates = {
  "python": {
    "language": "python",
    "code": "class BrowserHistory:\n    def __init__(self, homepage: str):\n        self.history = [homepage]\n        self.current = 0\n        self.last = 0\n\n    def visit(self, url: str) -> None:\n        self.current += 1\n        # Overwrite if within bounds, append if at the end\n        if self.current < len(self.history):\n            self.history[self.current] = url\n        else:\n            self.history.append(url)\n        # Clear forward history by setting last to current\n        self.last = self.current\n\n    def back(self, steps: int) -> str:\n        # Move back, but don't go before index 0\n        self.current = max(0, self.current - steps)\n        return self.history[self.current]\n\n    def forward(self, steps: int) -> str:\n        # Move forward, but don't go past the last valid page\n        self.current = min(self.last, self.current + steps)\n        return self.history[self.current]",
    "lineMap": {
      "-": [
        2,
        3,
        4,
        5
      ],
      "visit_set": [
        8,
        9,
        10,
        11
      ],
      "visit_append": [
        12,
        13
      ],
      "visit_invalidate": [
        14,
        15
      ],
      "back_compute": [
        18,
        19
      ],
      "back_compute_clamped": [
        18,
        19
      ],
      "return_back": [
        20
      ],
      "forward_compute": [
        23,
        24
      ],
      "forward_compute_clamped": [
        23,
        24
      ],
      "return_forward": [
        25
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_place": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class BrowserHistory {\n    private List<String> history;\n    private int current;\n    private int last;\n\n    public BrowserHistory(String homepage) {\n        history = new ArrayList<>();\n        history.add(homepage);\n        current = 0;\n        last = 0;\n    }\n\n    public void visit(String url) {\n        current++;\n        // Overwrite if within bounds, append if at the end\n        if (current < history.size()) {\n            history.set(current, url);\n        } else {\n            history.add(url);\n        }\n        // Clear forward history by setting last to current\n        last = current;\n    }\n\n    public String back(int steps) {\n        // Move back, but don't go before index 0\n        current = Math.max(0, current - steps);\n        return history.get(current);\n    }\n\n    public String forward(int steps) {\n        // Move forward, but don't go past the last valid page\n        current = Math.min(last, current + steps);\n        return history.get(current);\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "visit_set": [
        14,
        15,
        16,
        17
      ],
      "visit_append": [
        18,
        19
      ],
      "visit_invalidate": [
        21,
        22
      ],
      "back_compute": [
        26,
        27
      ],
      "back_compute_clamped": [
        26,
        27
      ],
      "return_back": [
        28
      ],
      "forward_compute": [
        32,
        33
      ],
      "forward_compute_clamped": [
        32,
        33
      ],
      "return_forward": [
        34
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_place": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class BrowserHistory {\n    vector<string> history;\n    int current;\n    int last;\n\npublic:\n    BrowserHistory(string homepage) {\n        history.push_back(homepage);\n        current = 0;\n        last = 0;\n    }\n\n    void visit(string url) {\n        current++;\n        // Overwrite if within bounds, append if at the end\n        if (current < (int) history.size()) {\n            history[current] = url;\n        } else {\n            history.push_back(url);\n        }\n        // Clear forward history by setting last to current\n        last = current;\n    }\n\n    string back(int steps) {\n        // Move back, but don't go before index 0\n        current = max(0, current - steps);\n        return history[current];\n    }\n\n    string forward(int steps) {\n        // Move forward, but don't go past the last valid page\n        current = min(last, current + steps);\n        return history[current];\n    }\n};",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10,
        11
      ],
      "visit_set": [
        14,
        15,
        16,
        17
      ],
      "visit_append": [
        18,
        19
      ],
      "visit_invalidate": [
        21,
        22
      ],
      "back_compute": [
        26,
        27
      ],
      "back_compute_clamped": [
        26,
        27
      ],
      "return_back": [
        28
      ],
      "forward_compute": [
        32,
        33
      ],
      "forward_compute_clamped": [
        32,
        33
      ],
      "return_forward": [
        34
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_place": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class BrowserHistory {\n    private List<string> history;\n    private int current;\n    private int last;\n\n    public BrowserHistory(string homepage) {\n        history = new List<string> { homepage };\n        current = 0;\n        last = 0;\n    }\n\n    public void Visit(string url) {\n        current++;\n        // Overwrite if within bounds, append if at the end\n        if (current < history.Count) {\n            history[current] = url;\n        } else {\n            history.Add(url);\n        }\n        // Clear forward history by setting last to current\n        last = current;\n    }\n\n    public string Back(int steps) {\n        // Move back, but don't go before index 0\n        current = Math.Max(0, current - steps);\n        return history[current];\n    }\n\n    public string Forward(int steps) {\n        // Move forward, but don't go past the last valid page\n        current = Math.Min(last, current + steps);\n        return history[current];\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9,
        10
      ],
      "visit_set": [
        13,
        14,
        15,
        16
      ],
      "visit_append": [
        17,
        18
      ],
      "visit_invalidate": [
        20,
        21
      ],
      "back_compute": [
        25,
        26
      ],
      "back_compute_clamped": [
        25,
        26
      ],
      "return_back": [
        27
      ],
      "forward_compute": [
        31,
        32
      ],
      "forward_compute_clamped": [
        31,
        32
      ],
      "return_forward": [
        33
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_place": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type BrowserHistory struct {\n    history []string\n    current int\n    last    int\n}\n\nfunc Constructor(homepage string) BrowserHistory {\n    return BrowserHistory{\n        history: []string{homepage},\n        current: 0,\n        last:    0,\n    }\n}\n\nfunc (bh *BrowserHistory) Visit(url string) {\n    bh.current++\n    // Overwrite if within bounds, append if at the end\n    if bh.current < len(bh.history) {\n        bh.history[bh.current] = url\n    } else {\n        bh.history = append(bh.history, url)\n    }\n    // Clear forward history by setting last to current\n    bh.last = bh.current\n}\n\nfunc (bh *BrowserHistory) Back(steps int) string {\n    // Move back, but don't go before index 0\n    bh.current = max(0, bh.current-steps)\n    return bh.history[bh.current]\n}\n\nfunc (bh *BrowserHistory) Forward(steps int) string {\n    // Move forward, but don't go past the last valid page\n    bh.current = min(bh.last, bh.current+steps)\n    return bh.history[bh.current]\n}\n\nfunc max(a, b int) int {\n    if a > b {\n        return a\n    }\n    return b\n}\n\nfunc min(a, b int) int {\n    if a < b {\n        return a\n    }\n    return b\n}",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "visit_set": [
        16,
        17,
        18,
        19
      ],
      "visit_append": [
        20,
        21
      ],
      "visit_invalidate": [
        23,
        24
      ],
      "back_compute": [
        28,
        29
      ],
      "back_compute_clamped": [
        28,
        29
      ],
      "return_back": [
        30
      ],
      "forward_compute": [
        34,
        35
      ],
      "forward_compute_clamped": [
        34,
        35
      ],
      "return_forward": [
        36
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_place": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var BrowserHistory = function (homepage) {\n  this.history = [homepage];\n  this.current = 0;\n  this.last = 0;\n};\n\nBrowserHistory.prototype.visit = function (url) {\n  this.current++;\n  // Overwrite if within bounds, append if at the end\n  if (this.current < this.history.length) {\n    this.history[this.current] = url;\n  } else {\n    this.history.push(url);\n  }\n  // Clear forward history by setting last to current\n  this.last = this.current;\n};\n\nBrowserHistory.prototype.back = function (steps) {\n  // Move back, but don't go before index 0\n  this.current = Math.max(0, this.current - steps);\n  return this.history[this.current];\n};\n\nBrowserHistory.prototype.forward = function (steps) {\n  // Move forward, but don't go past the last valid page\n  this.current = Math.min(this.last, this.current + steps);\n  return this.history[this.current];\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5
      ],
      "visit_set": [
        8,
        9,
        10,
        11
      ],
      "visit_append": [
        12,
        13
      ],
      "visit_invalidate": [
        15,
        16
      ],
      "back_compute": [
        20,
        21
      ],
      "back_compute_clamped": [
        20,
        21
      ],
      "return_back": [
        22
      ],
      "forward_compute": [
        26,
        27
      ],
      "forward_compute_clamped": [
        26,
        27
      ],
      "return_forward": [
        28
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_place": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class BrowserHistory {\n    private history: string[];\n    private current: number;\n    private last: number;\n\n    constructor(homepage: string) {\n        this.history = [homepage];\n        this.current = 0;\n        this.last = 0;\n    }\n\n    visit(url: string): void {\n        this.current++;\n        // Overwrite if within bounds, append if at the end\n        if (this.current < this.history.length) {\n            this.history[this.current] = url;\n        } else {\n            this.history.push(url);\n        }\n        // Clear forward history by setting last to current\n        this.last = this.current;\n    }\n\n    back(steps: number): string {\n        // Move back, but don't go before index 0\n        this.current = Math.max(0, this.current - steps);\n        return this.history[this.current];\n    }\n\n    forward(steps: number): string {\n        // Move forward, but don't go past the last valid page\n        this.current = Math.min(this.last, this.current + steps);\n        return this.history[this.current];\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9,
        10
      ],
      "visit_set": [
        13,
        14,
        15,
        16
      ],
      "visit_append": [
        17,
        18
      ],
      "visit_invalidate": [
        20,
        21
      ],
      "back_compute": [
        25,
        26
      ],
      "back_compute_clamped": [
        25,
        26
      ],
      "return_back": [
        27
      ],
      "forward_compute": [
        31,
        32
      ],
      "forward_compute_clamped": [
        31,
        32
      ],
      "return_forward": [
        33
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_place": [
        15
      ]
    }
  }
};

const DesignBrowserHistoryPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "homepage": "google.com",
      "operations": [
        "visit(facebook.com)",
        "visit(youtube.com)",
        "visit(twitter.com)",
        "back(1)",
        "back(1)",
        "forward(1)",
        "visit(linkedin.com)",
        "forward(2)",
        "back(2)"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Heavy back",
    "value": {
      "homepage": "a.com",
      "operations": [
        "visit(b.com)",
        "visit(c.com)",
        "visit(d.com)",
        "back(3)",
        "forward(1)"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Visit clears forward",
    "value": {
      "homepage": "home",
      "operations": [
        "visit(p1)",
        "visit(p2)",
        "visit(p3)",
        "back(2)",
        "visit(new)",
        "forward(1)",
        "back(1)"
      ]
    }
  }
];

function generateDesignBrowserHistorySteps(e: any): any[] {
  

let{homepage:t,operations:r}=e,n=[t],s=0,a=0,l=new StepRecorder({},{bar_0:{type:"arrayElement",value:t,position:0},ptr_current:{type:"pointer",position:0,label:"current"},ptr_last:{type:"pointer",position:0,label:"last"}}),o=(e,t)=>{l.update_variable("op",e),l.update_variable("kind",t),l.update_variable("cur",s),l.update_variable("last",a),l.update_variable("addr",n[s]),l.update_variable("n",n.length)};for(let e of(l.update_variable("mode","array"),o(`BrowserHistory("${t}")`,"init"),l.record("-",`Initialize the history with homepage "${t}". current = 0, last = 0.`),r)){let t=e.match(/^visit\((.+)\)$/),r=e.match(/^back\((\d+)\)$/),i=e.match(/^forward\((\d+)\)$/);if(t){let e=t[1],r=s,i=++s<n.length;i?n[s]=e:n.push(e),l.update_visual("ptr_current",{type:"pointer",position:s,label:"current"}),l.update_visual(`bar_${s}`,{type:"arrayElement",value:e,position:s}),o(`visit("${e}")`,"visit"),l.update_variable("prev",r),l.update_variable("url",e),l.add_conditional("in_place",i),l.record(i?"visit_set":"visit_append",`visit("${e}"): current = ${r} + 1 = ${s}. ${i?`Overwrite the stale entry, history[${s}] = "${e}".`:`Append history[${s}] = "${e}".`}`);let c=n.length-(s+1);a=s,l.update_visual("ptr_last",{type:"pointer",position:a,label:"last"}),o(`visit("${e}")`,"visit"),l.update_variable("staleCount",c),l.record("visit_invalidate",c>0?`last = current = ${a}. The ${c} page${1===c?"":"s"} ahead can no longer be reached, forward history is cleared.`:`last = current = ${a}. There is nothing ahead, forward history is empty.`)}else if(r){let e=parseInt(r[1]),t=s,i=t-e<0;s=Math.max(0,s-e),l.update_visual("ptr_current",{type:"pointer",position:s,label:"current"}),o(`back(${e})`,"back"),l.update_variable("prev",t),l.update_variable("steps",e),l.update_variable("clamped",i),l.record(i?"back_compute_clamped":"back_compute",`back(${e}): current = max(0, ${t} - ${e}) = ${s}.${i?" Clamped at the homepage.":""}`),l.record("return_back",`Return history[${s}] = "${n[s]}".`)}else if(i){let e=parseInt(i[1]),t=s,r=t+e>a;s=Math.min(a,s+e),l.update_visual("ptr_current",{type:"pointer",position:s,label:"current"}),o(`forward(${e})`,"forward"),l.update_variable("prev",t),l.update_variable("steps",e),l.update_variable("clamped",r),l.record(r?"forward_compute_clamped":"forward_compute",`forward(${e}): current = min(${a}, ${t} + ${e}) = ${s}.${r?" Clamped at last.":""}`),l.record("return_forward",`Return history[${s}] = "${n[s]}".`)}}return o("","done"),l.record("complete",`All operations processed. The current page is "${n[s]}".`),l.getSteps()
}

export function DesignBrowserHistoryProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignBrowserHistoryTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDesignBrowserHistorySteps(e) as any[];
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
      title="Design Browser History"
      slug="design-browser-history"
      approaches={approaches}
      presets={DesignBrowserHistoryPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Exclusive Time of Functions (exclusive-time-of-functions)
// ==========================================

const ExclusiveTimeOfFunctionsTemplates = {
  "python": {
    "language": "python",
    "code": "def exclusiveTime(n, logs):\n    result = [0] * n\n    stack = []\n    # Parse the first log to initialize\n    first = logs[0].split(\":\")\n    stack.append(int(first[0]))\n    prev_time = int(first[2])\n\n    for i in range(1, len(logs)):\n        parts = logs[i].split(\":\")\n        func_id = int(parts[0])\n        log_type = parts[1]\n        time = int(parts[2])\n\n        if log_type == \"start\":\n            # Time since last event goes to the current top function\n            if stack:\n                result[stack[-1]] += time - prev_time\n            stack.append(func_id)\n            prev_time = time\n        else:\n            # Time including this timestamp goes to the ending function\n            result[stack[-1]] += time - prev_time + 1\n            stack.pop()\n            prev_time = time + 1\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "parse_first": [
        5,
        6,
        7
      ],
      "loop": [
        9
      ],
      "parse_log": [
        10,
        11,
        12,
        13
      ],
      "start_event": [
        15
      ],
      "add_time_start": [
        18
      ],
      "push_func": [
        19,
        20
      ],
      "end_event": [
        21
      ],
      "add_time_end": [
        23
      ],
      "pop_func": [
        24,
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_start": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] exclusiveTime(int n, List<String> logs) {\n    int[] result = new int[n];\n    Stack<Integer> stack = new Stack<>();\n    // Parse the first log to initialize\n    String[] first = logs.get(0).split(\":\");\n    stack.push(Integer.parseInt(first[0]));\n    int prevTime = Integer.parseInt(first[2]);\n\n    for (int i = 1; i < logs.size(); i++) {\n        String[] parts = logs.get(i).split(\":\");\n        int id = Integer.parseInt(parts[0]);\n        String type = parts[1];\n        int time = Integer.parseInt(parts[2]);\n\n        if (type.equals(\"start\")) {\n            // Time since last event goes to the current top function\n            if (!stack.isEmpty()) {\n                result[stack.peek()] += time - prevTime;\n            }\n            stack.push(id);\n            prevTime = time;\n        } else {\n            // Time including this timestamp goes to the ending function\n            result[stack.peek()] += time - prevTime + 1;\n            stack.pop();\n            prevTime = time + 1;\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "parse_first": [
        5,
        6,
        7
      ],
      "loop": [
        9
      ],
      "parse_log": [
        10,
        11,
        12,
        13
      ],
      "start_event": [
        15
      ],
      "add_time_start": [
        18
      ],
      "push_func": [
        20,
        21
      ],
      "end_event": [
        22
      ],
      "add_time_end": [
        24
      ],
      "pop_func": [
        25,
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_start": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> exclusiveTime(int n, vector<string>& logs) {\n    vector<int> result(n, 0);\n    stack<int> callStack;\n    // Parse the first log to initialize\n    int firstColon = logs[0].find(':');\n    int secondColon = logs[0].find(':', firstColon + 1);\n    callStack.push(stoi(logs[0].substr(0, firstColon)));\n    int prevTime = stoi(logs[0].substr(secondColon + 1));\n\n    for (int i = 1; i < logs.size(); i++) {\n        int fc = logs[i].find(':');\n        int sc = logs[i].find(':', fc + 1);\n        int id = stoi(logs[i].substr(0, fc));\n        string type = logs[i].substr(fc + 1, sc - fc - 1);\n        int time = stoi(logs[i].substr(sc + 1));\n\n        if (type == \"start\") {\n            // Time since last event goes to the current top function\n            if (!callStack.empty()) {\n                result[callStack.top()] += time - prevTime;\n            }\n            callStack.push(id);\n            prevTime = time;\n        } else {\n            // Time including this timestamp goes to the ending function\n            result[callStack.top()] += time - prevTime + 1;\n            callStack.pop();\n            prevTime = time + 1;\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "parse_first": [
        5,
        6,
        7,
        8
      ],
      "loop": [
        10
      ],
      "parse_log": [
        11,
        12,
        13,
        14,
        15
      ],
      "start_event": [
        17
      ],
      "add_time_start": [
        20
      ],
      "push_func": [
        22,
        23
      ],
      "end_event": [
        24
      ],
      "add_time_end": [
        26
      ],
      "pop_func": [
        27,
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_start": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] ExclusiveTime(int n, IList<string> logs) {\n    int[] result = new int[n];\n    Stack<int> stack = new Stack<int>();\n    // Parse the first log to initialize\n    string[] first = logs[0].Split(':');\n    stack.Push(int.Parse(first[0]));\n    int prevTime = int.Parse(first[2]);\n\n    for (int i = 1; i < logs.Count; i++) {\n        string[] parts = logs[i].Split(':');\n        int id = int.Parse(parts[0]);\n        string type = parts[1];\n        int time = int.Parse(parts[2]);\n\n        if (type == \"start\") {\n            // Time since last event goes to the current top function\n            if (stack.Count > 0) {\n                result[stack.Peek()] += time - prevTime;\n            }\n            stack.Push(id);\n            prevTime = time;\n        } else {\n            // Time including this timestamp goes to the ending function\n            result[stack.Peek()] += time - prevTime + 1;\n            stack.Pop();\n            prevTime = time + 1;\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "parse_first": [
        5,
        6,
        7
      ],
      "loop": [
        9
      ],
      "parse_log": [
        10,
        11,
        12,
        13
      ],
      "start_event": [
        15
      ],
      "add_time_start": [
        18
      ],
      "push_func": [
        20,
        21
      ],
      "end_event": [
        22
      ],
      "add_time_end": [
        24
      ],
      "pop_func": [
        25,
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_start": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func exclusiveTime(n int, logs []string) []int {\n    result := make([]int, n)\n    stack := []int{}\n    // Parse the first log to initialize\n    first := strings.Split(logs[0], \":\")\n    firstId, _ := strconv.Atoi(first[0])\n    prevTime, _ := strconv.Atoi(first[2])\n    stack = append(stack, firstId)\n\n    for i := 1; i < len(logs); i++ {\n        parts := strings.Split(logs[i], \":\")\n        id, _ := strconv.Atoi(parts[0])\n        logType := parts[1]\n        time, _ := strconv.Atoi(parts[2])\n\n        if logType == \"start\" {\n            // Time since last event goes to the current top function\n            if len(stack) > 0 {\n                result[stack[len(stack)-1]] += time - prevTime\n            }\n            stack = append(stack, id)\n            prevTime = time\n        } else {\n            // Time including this timestamp goes to the ending function\n            result[stack[len(stack)-1]] += time - prevTime + 1\n            stack = stack[:len(stack)-1]\n            prevTime = time + 1\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "parse_first": [
        5,
        6,
        7,
        8
      ],
      "loop": [
        10
      ],
      "parse_log": [
        11,
        12,
        13,
        14
      ],
      "start_event": [
        16
      ],
      "add_time_start": [
        19
      ],
      "push_func": [
        21,
        22
      ],
      "end_event": [
        23
      ],
      "add_time_end": [
        25
      ],
      "pop_func": [
        26,
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "is_start": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function exclusiveTime(n, logs) {\n  var result = new Array(n).fill(0);\n  var stack = [];\n  // Parse the first log to initialize\n  var first = logs[0].split(\":\");\n  stack.push(parseInt(first[0]));\n  var prevTime = parseInt(first[2]);\n\n  for (var i = 1; i < logs.length; i++) {\n    var parts = logs[i].split(\":\");\n    var id = parseInt(parts[0]);\n    var type = parts[1];\n    var time = parseInt(parts[2]);\n\n    if (type === \"start\") {\n      // Time since last event goes to the current top function\n      if (stack.length > 0) {\n        result[stack[stack.length - 1]] += time - prevTime;\n      }\n      stack.push(id);\n      prevTime = time;\n    } else {\n      // Time including this timestamp goes to the ending function\n      result[stack[stack.length - 1]] += time - prevTime + 1;\n      stack.pop();\n      prevTime = time + 1;\n    }\n  }\n  return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "parse_first": [
        5,
        6,
        7
      ],
      "loop": [
        9
      ],
      "parse_log": [
        10,
        11,
        12,
        13
      ],
      "start_event": [
        15
      ],
      "add_time_start": [
        18
      ],
      "push_func": [
        20,
        21
      ],
      "end_event": [
        22
      ],
      "add_time_end": [
        24
      ],
      "pop_func": [
        25,
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_start": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function exclusiveTime(n: number, logs: string[]): number[] {\n    const result: number[] = new Array(n).fill(0);\n    const stack: number[] = [];\n    // Parse the first log to initialize\n    const first = logs[0].split(\":\");\n    stack.push(parseInt(first[0]));\n    let prevTime = parseInt(first[2]);\n\n    for (let i = 1; i < logs.length; i++) {\n        const parts = logs[i].split(\":\");\n        const id = parseInt(parts[0]);\n        const type = parts[1];\n        const time = parseInt(parts[2]);\n\n        if (type === \"start\") {\n            // Time since last event goes to the current top function\n            if (stack.length > 0) {\n                result[stack[stack.length - 1]] += time - prevTime;\n            }\n            stack.push(id);\n            prevTime = time;\n        } else {\n            // Time including this timestamp goes to the ending function\n            result[stack[stack.length - 1]] += time - prevTime + 1;\n            stack.pop();\n            prevTime = time + 1;\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "parse_first": [
        5,
        6,
        7
      ],
      "loop": [
        9
      ],
      "parse_log": [
        10,
        11,
        12,
        13
      ],
      "start_event": [
        15
      ],
      "add_time_start": [
        18
      ],
      "push_func": [
        20,
        21
      ],
      "end_event": [
        22
      ],
      "add_time_end": [
        24
      ],
      "pop_func": [
        25,
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_start": [
        15
      ]
    }
  }
};

const ExclusiveTimeOfFunctionsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "n": 2,
      "logs": [
        "0:start:0",
        "1:start:2",
        "1:end:5",
        "0:end:6"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Recursive",
    "value": {
      "n": 1,
      "logs": [
        "0:start:0",
        "0:start:2",
        "0:end:5",
        "0:start:6",
        "0:end:6",
        "0:end:7"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Sequential",
    "value": {
      "n": 2,
      "logs": [
        "0:start:0",
        "0:end:0",
        "1:start:1",
        "1:end:1"
      ]
    }
  }
];

function generateExclusiveTimeOfFunctionsSteps(e: any): any[] {
  

let t=e.n,i=e.logs,r=new StepRecorder({n:t,logs:i},{}),s=Array(t).fill(0),l=[],a=[],o=()=>{r.update_variable("result",[...s]),r.update_variable("stack",[...l]),r.update_variable("segments",a.map(e=>[e[0],e[1],e[2]]))};r.record("-","Single-threaded CPU: each log credits time to the function on top of the stack.");let c=i[0].split(":"),d=parseInt(c[0]),u=parseInt(c[2]);l.push(d),r.update_variable("i",0),r.update_variable("prevTime",u),r.delete_variable("curSeg"),o(),r.record("parse_first",`Function ${d} starts at ${u}. Push it; set prevTime = ${u}.`);for(let e=1;e<i.length;e++){r.update_variable("i",e),r.delete_variable("curSeg"),o(),r.record("loop",`Read log ${e}: "${i[e]}"`);let t=i[e].split(":"),n=parseInt(t[0]),c=t[1],d=parseInt(t[2]);if(r.update_variable("funcId",n),r.update_variable("eventType",c),r.update_variable("time",d),r.record("parse_log",`Function ${n}, "${c}", time ${d}`),"start"===c){r.add_conditional("is_start",!0);let e=l[l.length-1],t=d-u,i=[e,u,d];s[e]+=t,a.push(i),r.update_variable("curSeg",[e,u,d]),o(),r.record("add_time_start",`Before switching, fn ${e} ran ${u}..${d}: result[${e}] += ${d} - ${u} = ${t}`),l.push(n),u=d,r.update_variable("prevTime",u),o(),r.record("push_func",`Push fn ${n} (it starts now); set prevTime = ${u}`)}else{r.add_conditional("is_start",!1);let e=l[l.length-1],t=d-u+1,i=[e,u,d+1];s[e]+=t,a.push(i),r.update_variable("curSeg",[e,u,d+1]),o(),r.record("add_time_end",`fn ${e} ran ${u}..${d} inclusive: result[${e}] += ${d} - ${u} + 1 = ${t}`),l.pop(),u=d+1,r.update_variable("prevTime",u),o(),r.record("pop_func",`fn ${e} ends; pop it; set prevTime = ${u}`)}}return r.delete_variable("i"),r.delete_variable("funcId"),r.delete_variable("eventType"),r.delete_variable("time"),r.delete_variable("curSeg"),r.update_variable("return",[...s]),o(),r.record("complete",`Exclusive times: [${s.join(", ")}]`),r.getSteps()
}

export function ExclusiveTimeOfFunctionsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ExclusiveTimeOfFunctionsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateExclusiveTimeOfFunctionsSteps(e) as any[];
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
      title="Exclusive Time of Functions"
      slug="exclusive-time-of-functions"
      approaches={approaches}
      presets={ExclusiveTimeOfFunctionsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find the Most Competitive Subsequence (find-the-most-competitive-subsequence)
// ==========================================

const FindTheMostCompetitiveSubsequenceTemplates = {
  "python": {
    "language": "python",
    "code": "def mostCompetitive(nums, k):\n    stack = []\n    n = len(nums)\n    for i in range(n):\n        while stack and stack[-1] > nums[i] and len(stack) - 1 + (n - i) >= k:\n            stack.pop()\n        if len(stack) < k:\n            stack.append(nums[i])\n    return stack",
    "lineMap": {
      "-": [
        1
      ],
      "iterate": [
        4
      ],
      "check_pop": [
        5
      ],
      "pop_stack": [
        6
      ],
      "check_push": [
        7
      ],
      "push_stack": [
        8
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "check_pop": [
        5
      ],
      "check_push": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] mostCompetitive(int[] nums, int k) {\n    int n = nums.length;\n    int[] stack = new int[k];\n    int size = 0;\n    for (int i = 0; i < n; i++) {\n        while (size > 0 && stack[size - 1] > nums[i] && size - 1 + (n - i) >= k) {\n            size--;\n        }\n        if (size < k) {\n            stack[size++] = nums[i];\n        }\n    }\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "iterate": [
        5
      ],
      "check_pop": [
        6
      ],
      "pop_stack": [
        7
      ],
      "check_push": [
        9
      ],
      "push_stack": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_pop": [
        6
      ],
      "check_push": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> mostCompetitive(vector<int>& nums, int k) {\n    int n = nums.size();\n    vector<int> stack;\n    int size = 0;\n    for (int i = 0; i < n; i++) {\n        while (size > 0 && stack[size - 1] > nums[i] && size - 1 + (n - i) >= k) {\n            stack.pop_back(); size--;\n        }\n        if (size < k) {\n            stack.push_back(nums[i]); size++;\n        }\n    }\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "iterate": [
        5
      ],
      "check_pop": [
        6
      ],
      "pop_stack": [
        7
      ],
      "check_push": [
        9
      ],
      "push_stack": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_pop": [
        6
      ],
      "check_push": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] MostCompetitive(int[] nums, int k) {\n    int n = nums.Length;\n    int[] stack = new int[k];\n    int size = 0;\n    for (int i = 0; i < n; i++) {\n        while (size > 0 && stack[size - 1] > nums[i] && size - 1 + (n - i) >= k) {\n            size--;\n        }\n        if (size < k) {\n            stack[size++] = nums[i];\n        }\n    }\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "iterate": [
        5
      ],
      "check_pop": [
        6
      ],
      "pop_stack": [
        7
      ],
      "check_push": [
        9
      ],
      "push_stack": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_pop": [
        6
      ],
      "check_push": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mostCompetitive(nums []int, k int) []int {\n    n := len(nums)\n    stack := make([]int, 0, k)\n    size := 0\n    for i := 0; i < n; i++ {\n        for size > 0 && stack[size-1] > nums[i] && size-1+(n-i) >= k {\n            stack = stack[:size-1]; size--\n        }\n        if size < k {\n            stack = append(stack, nums[i]); size++\n        }\n    }\n    return stack\n}",
    "lineMap": {
      "-": [
        1
      ],
      "iterate": [
        5
      ],
      "check_pop": [
        6
      ],
      "pop_stack": [
        7
      ],
      "check_push": [
        9
      ],
      "push_stack": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_pop": [
        6
      ],
      "check_push": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function mostCompetitive(nums, k) {\n    const n = nums.length;\n    const stack = [];\n    let size = 0;\n    for (let i = 0; i < n; i++) {\n        while (size > 0 && stack[size - 1] > nums[i] && size - 1 + (n - i) >= k) {\n            stack.pop(); size--;\n        }\n        if (size < k) {\n            stack.push(nums[i]); size++;\n        }\n    }\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "iterate": [
        5
      ],
      "check_pop": [
        6
      ],
      "pop_stack": [
        7
      ],
      "check_push": [
        9
      ],
      "push_stack": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_pop": [
        6
      ],
      "check_push": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mostCompetitive(nums: number[], k: number): number[] {\n    const n = nums.length;\n    const stack: number[] = [];\n    let size = 0;\n    for (let i = 0; i < n; i++) {\n        while (size > 0 && stack[size - 1] > nums[i] && size - 1 + (n - i) >= k) {\n            stack.pop(); size--;\n        }\n        if (size < k) {\n            stack.push(nums[i]); size++;\n        }\n    }\n    return stack;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "iterate": [
        5
      ],
      "check_pop": [
        6
      ],
      "pop_stack": [
        7
      ],
      "check_push": [
        9
      ],
      "push_stack": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_pop": [
        6
      ],
      "check_push": [
        9
      ]
    }
  }
};

const FindTheMostCompetitiveSubsequencePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        3,
        5,
        2,
        6
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        2,
        4,
        3,
        3,
        5,
        4,
        9,
        6
      ],
      "k": 4
    }
  },
  {
    "id": "ex3",
    "label": "Simple",
    "value": {
      "nums": [
        1,
        2,
        3,
        4
      ],
      "k": 3
    }
  }
];

function generateFindTheMostCompetitiveSubsequenceSteps(e: any): any[] {
  

let t=[...e.nums],n=e.k,s=t.length,l={};for(let e=0;e<s;e++)l[`bar_${e}`]={type:"arrayElement",value:t[e],position:e};let a=new StepRecorder({k:n,n:s,size:0,remaining:s,i:-1},l),r=[],o=[],c=[],d=()=>{a.update_variable("stackVals",[...r]),a.update_variable("stackIdxs",[...o]),a.update_variable("discardedIdxs",[...c]),a.update_variable("size",r.length)},u=()=>{a.delete_variable("topVal"),a.delete_variable("topIdx"),a.delete_variable("poppedVal"),a.delete_variable("poppedIdx"),a.delete_variable("popDecision"),a.delete_variable("pushDecision")};d(),a.record("-",`Build the most competitive length-${n} subsequence by keeping an increasing stack`);for(let e=0;e<s;e++){let i=s-e;for(a.add_new_visual("ptr_i",{type:"pointer",position:e,label:"i"}),u(),a.update_variable("i",e),a.update_variable("num",t[e]),a.update_variable("remaining",i),d(),a.record("iterate",`Consider nums[${e}] = ${t[e]}  (remaining = ${i})`);r.length>0&&r[r.length-1]>t[e]&&r.length-1+i>=n;){let s=r[r.length-1],l=o[o.length-1],u=r.length-1+i;a.update_variable("topVal",s),a.update_variable("topIdx",l),a.update_variable("popDecision","pop"),a.add_conditional("check_pop",!0),d(),a.record("check_pop",`top ${s} > ${t[e]} and (size-1)+remaining = ${u} >= ${n}: pop`),r.pop(),o.pop(),c.push(l),a.update_variable("poppedVal",s),a.update_variable("poppedIdx",l),d(),a.record("pop_stack",`Discard ${s}, a smaller value is available. size = ${r.length}`)}if(r.length>0){let s,l,c=r[r.length-1],u=o[o.length-1],p=r.length-1+i;c>t[e]?(s="budget",l=`(size-1)+remaining = ${p} < ${n}: can't afford to pop, keep top ${c}`):(s="keep",l=`top ${c} <= ${t[e]}: increasing order holds, stop popping`),a.delete_variable("poppedVal"),a.delete_variable("poppedIdx"),a.update_variable("topVal",c),a.update_variable("topIdx",u),a.update_variable("popDecision",s),a.add_conditional("check_pop",!1),d(),a.record("check_pop",l)}a.delete_variable("poppedVal"),a.delete_variable("poppedIdx"),r.length<n?(a.update_variable("pushDecision","push"),a.add_conditional("check_push",!0),d(),a.record("check_push",`size ${r.length} < k ${n}: keep nums[${e}] = ${t[e]}`),r.push(t[e]),o.push(e),d(),a.record("push_stack",`Pushed ${t[e]}, subsequence = [${r.join(", ")}]`)):(a.update_variable("pushDecision","skip"),a.add_conditional("check_push",!1),c.push(e),d(),a.record("check_push",`size ${r.length} == k ${n}: full, discard nums[${e}] = ${t[e]}`))}return a.delete_visual("ptr_i"),u(),a.update_variable("i",-1),a.update_variable("result",[...r]),a.update_variable("keptIdxs",[...o]),d(),a.record("complete",`Most competitive subsequence: [${r.join(", ")}]`),a.getSteps()
}

export function FindTheMostCompetitiveSubsequenceProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindTheMostCompetitiveSubsequenceTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindTheMostCompetitiveSubsequenceSteps(e) as any[];
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
      title="Find the Most Competitive Subsequence"
      slug="find-the-most-competitive-subsequence"
      approaches={approaches}
      presets={FindTheMostCompetitiveSubsequencePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Implement Queue Using Stacks (implement-queue-using-stacks)
// ==========================================

const ImplementQueueUsingStacksTemplates = {
  "python": {
    "language": "python",
    "code": "class MyQueue:\n    def __init__(self):\n        self.input = []\n        self.output = []\n\n    def push(self, x: int) -> None:\n        self.input.append(x)\n\n    def pop(self) -> int:\n        # Only transfer when output is empty\n        if not self.output:\n            while self.input:\n                self.output.append(self.input.pop())\n        return self.output.pop()\n\n    def peek(self) -> int:\n        if not self.output:\n            while self.input:\n                self.output.append(self.input.pop())\n        return self.output[-1]\n\n    def empty(self) -> bool:\n        return not self.input and not self.output",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "operation_start": [
        1
      ],
      "push_input": [
        6,
        7
      ],
      "check_output_empty": [
        11,
        17
      ],
      "transfer_pop": [
        12,
        18
      ],
      "transfer_push": [
        13,
        19
      ],
      "pop_output": [
        14
      ],
      "peek_output": [
        20
      ],
      "check_empty": [
        23
      ],
      "return_result": [
        7
      ],
      "return_result_pop": [
        14
      ],
      "return_result_peek": [
        20
      ],
      "return_result_empty": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "output_empty": [
        11,
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MyQueue {\n    private Stack<Integer> input;\n    private Stack<Integer> output;\n\n    public MyQueue() {\n        input = new Stack<>();\n        output = new Stack<>();\n    }\n\n    public void push(int x) {\n        input.push(x);\n    }\n\n    public int pop() {\n        // Only transfer when output is empty\n        if (output.isEmpty()) {\n            while (!input.isEmpty()) {\n                output.push(input.pop());\n            }\n        }\n        return output.pop();\n    }\n\n    public int peek() {\n        if (output.isEmpty()) {\n            while (!input.isEmpty()) {\n                output.push(input.pop());\n            }\n        }\n        return output.peek();\n    }\n\n    public boolean empty() {\n        return input.isEmpty() && output.isEmpty();\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "operation_start": [
        1
      ],
      "push_input": [
        10,
        11
      ],
      "check_output_empty": [
        16,
        25
      ],
      "transfer_pop": [
        17,
        26
      ],
      "transfer_push": [
        18,
        27
      ],
      "pop_output": [
        21
      ],
      "peek_output": [
        30
      ],
      "check_empty": [
        34
      ],
      "return_result": [
        11
      ],
      "return_result_pop": [
        21
      ],
      "return_result_peek": [
        30
      ],
      "return_result_empty": [
        34
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "output_empty": [
        16,
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MyQueue {\n    stack<int> input;\n    stack<int> output;\n\n    // Transfer all elements from input to output\n    void transferIfNeeded() {\n        if (output.empty()) {\n            while (!input.empty()) {\n                output.push(input.top());\n                input.pop();\n            }\n        }\n    }\n\npublic:\n    MyQueue() {}\n\n    void push(int x) {\n        input.push(x);\n    }\n\n    int pop() {\n        transferIfNeeded();\n        int val = output.top();\n        output.pop();\n        return val;\n    }\n\n    int peek() {\n        transferIfNeeded();\n        return output.top();\n    }\n\n    bool empty() {\n        return input.empty() && output.empty();\n    }\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "operation_start": [
        1
      ],
      "push_input": [
        18,
        19
      ],
      "check_output_empty": [
        7
      ],
      "transfer_pop": [
        8
      ],
      "transfer_push": [
        9,
        10
      ],
      "pop_output": [
        24
      ],
      "peek_output": [
        31
      ],
      "check_empty": [
        35
      ],
      "return_result": [
        19
      ],
      "return_result_pop": [
        26
      ],
      "return_result_peek": [
        31
      ],
      "return_result_empty": [
        35
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "output_empty": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MyQueue {\n    private Stack<int> input;\n    private Stack<int> output;\n\n    public MyQueue() {\n        input = new Stack<int>();\n        output = new Stack<int>();\n    }\n\n    public void Push(int x) {\n        input.Push(x);\n    }\n\n    // Transfer all elements from input to output when output is empty\n    private void TransferIfNeeded() {\n        if (output.Count == 0) {\n            while (input.Count > 0) {\n                output.Push(input.Pop());\n            }\n        }\n    }\n\n    public int Pop() {\n        TransferIfNeeded();\n        return output.Pop();\n    }\n\n    public int Peek() {\n        TransferIfNeeded();\n        return output.Peek();\n    }\n\n    public bool Empty() {\n        return input.Count == 0 && output.Count == 0;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "operation_start": [
        1
      ],
      "push_input": [
        10,
        11
      ],
      "check_output_empty": [
        16
      ],
      "transfer_pop": [
        17
      ],
      "transfer_push": [
        18
      ],
      "pop_output": [
        25
      ],
      "peek_output": [
        30
      ],
      "check_empty": [
        34
      ],
      "return_result": [
        11
      ],
      "return_result_pop": [
        25
      ],
      "return_result_peek": [
        30
      ],
      "return_result_empty": [
        34
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "output_empty": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type MyQueue struct {\n    input  []int\n    output []int\n}\n\nfunc Constructor() MyQueue {\n    return MyQueue{}\n}\n\nfunc (q *MyQueue) Push(x int) {\n    q.input = append(q.input, x)\n}\n\n// Transfer all elements from input to output when output is empty\nfunc (q *MyQueue) transferIfNeeded() {\n    if len(q.output) == 0 {\n        for len(q.input) > 0 {\n            q.output = append(q.output, q.input[len(q.input)-1])\n            q.input = q.input[:len(q.input)-1]\n        }\n    }\n}\n\nfunc (q *MyQueue) Pop() int {\n    q.transferIfNeeded()\n    val := q.output[len(q.output)-1]\n    q.output = q.output[:len(q.output)-1]\n    return val\n}\n\nfunc (q *MyQueue) Peek() int {\n    q.transferIfNeeded()\n    return q.output[len(q.output)-1]\n}\n\nfunc (q *MyQueue) Empty() bool {\n    return len(q.input) == 0 && len(q.output) == 0\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "operation_start": [
        1
      ],
      "push_input": [
        10,
        11
      ],
      "check_output_empty": [
        16
      ],
      "transfer_pop": [
        17
      ],
      "transfer_push": [
        18,
        19
      ],
      "pop_output": [
        26,
        27
      ],
      "peek_output": [
        33
      ],
      "check_empty": [
        37
      ],
      "return_result": [
        11
      ],
      "return_result_pop": [
        28
      ],
      "return_result_peek": [
        33
      ],
      "return_result_empty": [
        37
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "output_empty": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var MyQueue = function () {\n  this.input = [];\n  this.output = [];\n};\n\nMyQueue.prototype.push = function (x) {\n  this.input.push(x);\n};\n\n// Transfer all elements from input to output when output is empty\nMyQueue.prototype.transferIfNeeded = function () {\n  if (this.output.length === 0) {\n    while (this.input.length > 0) {\n      this.output.push(this.input.pop());\n    }\n  }\n};\n\nMyQueue.prototype.pop = function () {\n  this.transferIfNeeded();\n  return this.output.pop();\n};\n\nMyQueue.prototype.peek = function () {\n  this.transferIfNeeded();\n  return this.output[this.output.length - 1];\n};\n\nMyQueue.prototype.empty = function () {\n  return this.input.length === 0 && this.output.length === 0;\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "operation_start": [
        1
      ],
      "push_input": [
        6,
        7
      ],
      "check_output_empty": [
        12
      ],
      "transfer_pop": [
        13
      ],
      "transfer_push": [
        14
      ],
      "pop_output": [
        21
      ],
      "peek_output": [
        26
      ],
      "check_empty": [
        30
      ],
      "return_result": [
        7
      ],
      "return_result_pop": [
        21
      ],
      "return_result_peek": [
        26
      ],
      "return_result_empty": [
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "output_empty": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class MyQueue {\n    private input: number[];\n    private output: number[];\n\n    constructor() {\n        this.input = [];\n        this.output = [];\n    }\n\n    push(x: number): void {\n        this.input.push(x);\n    }\n\n    // Transfer all elements from input to output when output is empty\n    private transferIfNeeded(): void {\n        if (this.output.length === 0) {\n            while (this.input.length > 0) {\n                this.output.push(this.input.pop()!);\n            }\n        }\n    }\n\n    pop(): number {\n        this.transferIfNeeded();\n        return this.output.pop()!;\n    }\n\n    peek(): number {\n        this.transferIfNeeded();\n        return this.output[this.output.length - 1];\n    }\n\n    empty(): boolean {\n        return this.input.length === 0 && this.output.length === 0;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "operation_start": [
        1
      ],
      "push_input": [
        10,
        11
      ],
      "check_output_empty": [
        16
      ],
      "transfer_pop": [
        17
      ],
      "transfer_push": [
        18
      ],
      "pop_output": [
        25
      ],
      "peek_output": [
        30
      ],
      "check_empty": [
        34
      ],
      "return_result": [
        11
      ],
      "return_result_pop": [
        25
      ],
      "return_result_peek": [
        30
      ],
      "return_result_empty": [
        34
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "output_empty": [
        16
      ]
    }
  }
};

const ImplementQueueUsingStacksPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "operations": [
        "push(1)",
        "push(2)",
        "push(3)",
        "pop()",
        "peek()",
        "push(4)",
        "pop()"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Alternating",
    "value": {
      "operations": [
        "push(1)",
        "pop()",
        "push(2)",
        "pop()",
        "push(3)",
        "pop()"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Batch push then pop",
    "value": {
      "operations": [
        "push(1)",
        "push(2)",
        "push(3)",
        "push(4)",
        "pop()",
        "pop()",
        "pop()",
        "pop()"
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Peek and empty checks",
    "value": {
      "operations": [
        "push(5)",
        "push(7)",
        "peek()",
        "pop()",
        "empty()",
        "pop()",
        "empty()"
      ]
    }
  }
];

function generateImplementQueueUsingStacksSteps(e: any): any[] {
  

let t=e.operations,n=[],u=[],a=0,i=new StepRecorder({},{}),o=(e={})=>{n.forEach((t,n)=>{i.update_visual(t.key,{type:"stackElement",value:t.value,position:n,state:e[t.key]})}),u.forEach((t,n)=>{i.update_visual(t.key,{type:"stackElement",value:t.value,position:p.QUEUE_STACKS_OUT_BASE+n,state:e[t.key]})})},l=(e,t)=>{i.update_visual("meta_opIdx",{type:"metadata",value:e}),i.update_visual("meta_operation",{type:"metadata",value:t}),i.update_visual("meta_result",{type:"metadata",value:"-"})},s=e=>{i.update_visual("meta_result",{type:"metadata",value:e})};i.add_new_visual("meta_ops",{type:"metadata",value:t}),i.add_new_visual("meta_opIdx",{type:"metadata",value:-1}),i.add_new_visual("meta_operation",{type:"metadata",value:"init"}),i.add_new_visual("meta_result",{type:"metadata",value:"-"}),i.add_new_visual("meta_labels",{type:"metadata",value:["helper","main","scratch space","queue order lives here"]}),i.record("-","Every push does the work: main is kept in queue order so pop and peek are O(1)");for(let e=0;e<t.length;e++){let r=t[e],h=r.match(/^push\((\d+)\)$/),c="pop()"===r,m="peek()"===r,d="empty()"===r;if(h){let t=parseInt(h[1],10);for(l(e,`push(${t})`),o(),i.record("operation_start",`push(${t}): make room at the bottom of main`);u.length>0;){let e=u[u.length-1];i.add_conditional("main_not_empty",!0),o({[e.key]:"lift"}),i.record("drain_pop",`Pop ${e.value} from the top of main`),u.pop(),n.push(e),o({[e.key]:"moving"}),i.record("drain_push",`Push ${e.value} onto helper`)}i.add_conditional("main_not_empty",!1);let r={key:`el_${a++}`,value:t};for(u.push(r),i.add_new_visual(r.key,{type:"stackElement",value:t,position:p.QUEUE_STACKS_OUT_BASE,state:"active"}),i.record("push_main",`Push ${t} onto the empty main, so it sits at the bottom`);n.length>0;){let e=n[n.length-1];i.add_conditional("helper_not_empty",!0),o({[e.key]:"lift"}),i.record("restore_pop",`Pop ${e.value} from the top of helper`),n.pop(),u.push(e),o({[e.key]:"moving"}),i.record("restore_push",`Push ${e.value} back onto main, above ${t}`)}i.add_conditional("helper_not_empty",!1),o(),i.record("return_result",`push(${t}) done. Cost: O(n), every element moved twice`)}else if(c||m){let t=c?"pop":"peek";if(l(e,`${t}()`),o(),i.record("operation_start",c?"pop(): the front is already on top of main":"peek(): the front is already on top of main"),0===u.length){s("empty"),i.record(c?"return_result_pop":"return_result_peek",`Queue is empty, nothing to ${t}`);continue}let n=u[u.length-1];c?(o({[n.key]:"result"}),i.record("pop_main",`Top of main is ${n.value}, the queue front`),u.pop(),i.delete_visual(n.key),o(),s(String(n.value)),i.record("return_result_pop",`pop() returns ${n.value}. Cost: O(1)`)):(o({[n.key]:"result"}),s(String(n.value)),i.record("peek_main",`Top of main is ${n.value}, the queue front`),o(),i.record("return_result_peek",`peek() returns ${n.value}, the element stays in place`))}else if(d){l(e,"empty()"),o(),i.record("operation_start","empty(): main holds the whole queue, so check only main");let t=0===u.length;o(),s(String(t)),i.record("check_empty",`main holds ${u.length}: empty() is ${t}`),i.record("return_result_empty",`empty() returns ${t}`)}}return o(),i.update_visual("meta_opIdx",{type:"metadata",value:t.length}),i.update_visual("meta_operation",{type:"metadata",value:"done"}),i.record("complete","All operations complete. Push costs O(n), but pop and peek are always O(1)"),i.getSteps()
}

export function ImplementQueueUsingStacksProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ImplementQueueUsingStacksTemplates,
      generateSteps: (e: any) => {
        const recorded = generateImplementQueueUsingStacksSteps(e) as any[];
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
      title="Implement Queue Using Stacks"
      slug="implement-queue-using-stacks"
      approaches={approaches}
      presets={ImplementQueueUsingStacksPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Implement Stack Using Queues (implement-stack-using-queues)
// ==========================================

const ImplementStackUsingQueuesTemplates = {
  "python": {
    "language": "python",
    "code": "class MyStack:\n    def __init__(self):\n        self.q = deque()\n\n    # Push element onto stack - O(n)\n    def push(self, x: int) -> None:\n        self.q.append(x)\n        # Rotate queue so the new element is at the front\n        for _ in range(len(self.q) - 1):\n            self.q.append(self.q.popleft())\n\n    # Pop top element - O(1)\n    def pop(self) -> int:\n        return self.q.popleft()\n\n    # Peek top element - O(1)\n    def top(self) -> int:\n        return self.q[0]\n\n    # Check if empty - O(1)\n    def empty(self) -> bool:\n        return len(self.q) == 0",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "op_push": [
        6
      ],
      "enqueue": [
        7
      ],
      "rotate": [
        9,
        10
      ],
      "rotate_done": [
        9
      ],
      "op_pop": [
        13
      ],
      "dequeue": [
        14
      ],
      "return_result": [
        14
      ],
      "op_top": [
        17
      ],
      "peek_front": [
        18
      ],
      "op_empty": [
        21
      ],
      "check_empty": [
        22
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class MyStack {\n    private Queue<Integer> q;\n\n    public MyStack() {\n        q = new LinkedList<>();\n    }\n\n    // Push element onto stack - O(n)\n    public void push(int x) {\n        q.add(x);\n        // Rotate queue so the new element is at the front\n        int size = q.size();\n        for (int i = 0; i < size - 1; i++) {\n            q.add(q.remove());\n        }\n    }\n\n    // Pop top element - O(1)\n    public int pop() {\n        return q.remove();\n    }\n\n    // Peek top element - O(1)\n    public int top() {\n        return q.peek();\n    }\n\n    // Check if empty - O(1)\n    public boolean empty() {\n        return q.isEmpty();\n    }\n}",
    "lineMap": {
      "-": [
        4,
        5
      ],
      "op_push": [
        9
      ],
      "enqueue": [
        10
      ],
      "rotate": [
        12,
        13,
        14
      ],
      "rotate_done": [
        13
      ],
      "op_pop": [
        19
      ],
      "dequeue": [
        20
      ],
      "return_result": [
        20
      ],
      "op_top": [
        24
      ],
      "peek_front": [
        25
      ],
      "op_empty": [
        29
      ],
      "check_empty": [
        30
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class MyStack {\n    queue<int> q;\n\npublic:\n    MyStack() {}\n\n    // Push element onto stack - O(n)\n    void push(int x) {\n        q.push(x);\n        // Rotate queue so the new element is at the front\n        int size = q.size();\n        for (int i = 0; i < size - 1; i++) {\n            q.push(q.front());\n            q.pop();\n        }\n    }\n\n    // Pop top element - O(1)\n    int pop() {\n        int val = q.front();\n        q.pop();\n        return val;\n    }\n\n    // Peek top element - O(1)\n    int top() {\n        return q.front();\n    }\n\n    // Check if empty - O(1)\n    bool empty() {\n        return q.empty();\n    }\n};",
    "lineMap": {
      "-": [
        2,
        5
      ],
      "op_push": [
        8
      ],
      "enqueue": [
        9
      ],
      "rotate": [
        11,
        12,
        13,
        14
      ],
      "rotate_done": [
        12
      ],
      "op_pop": [
        19
      ],
      "dequeue": [
        20
      ],
      "return_result": [
        20,
        21,
        22
      ],
      "op_top": [
        26
      ],
      "peek_front": [
        27
      ],
      "op_empty": [
        31
      ],
      "check_empty": [
        32
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MyStack {\n    private Queue<int> q;\n\n    public MyStack() {\n        q = new Queue<int>();\n    }\n\n    // Push element onto stack - O(n)\n    public void Push(int x) {\n        q.Enqueue(x);\n        // Rotate queue so the new element is at the front\n        int size = q.Count;\n        for (int i = 0; i < size - 1; i++) {\n            q.Enqueue(q.Dequeue());\n        }\n    }\n\n    // Pop top element - O(1)\n    public int Pop() {\n        return q.Dequeue();\n    }\n\n    // Peek top element - O(1)\n    public int Top() {\n        return q.Peek();\n    }\n\n    // Check if empty - O(1)\n    public bool Empty() {\n        return q.Count == 0;\n    }\n}",
    "lineMap": {
      "-": [
        4,
        5
      ],
      "op_push": [
        9
      ],
      "enqueue": [
        10
      ],
      "rotate": [
        12,
        13,
        14
      ],
      "rotate_done": [
        13
      ],
      "op_pop": [
        19
      ],
      "dequeue": [
        20
      ],
      "return_result": [
        20
      ],
      "op_top": [
        24
      ],
      "peek_front": [
        25
      ],
      "op_empty": [
        29
      ],
      "check_empty": [
        30
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "type MyStack struct {\n    q []int\n}\n\nfunc Constructor() MyStack {\n    return MyStack{q: []int{}}\n}\n\n// Push element onto stack - O(n)\nfunc (s *MyStack) Push(x int) {\n    s.q = append(s.q, x)\n    // Rotate queue so the new element is at the front\n    size := len(s.q)\n    for i := 0; i < size-1; i++ {\n        s.q = append(s.q, s.q[0])\n        s.q = s.q[1:]\n    }\n}\n\n// Pop top element - O(1)\nfunc (s *MyStack) Pop() int {\n    val := s.q[0]\n    s.q = s.q[1:]\n    return val\n}\n\n// Peek top element - O(1)\nfunc (s *MyStack) Top() int {\n    return s.q[0]\n}\n\n// Check if empty - O(1)\nfunc (s *MyStack) Empty() bool {\n    return len(s.q) == 0\n}",
    "lineMap": {
      "-": [
        5,
        6
      ],
      "op_push": [
        10
      ],
      "enqueue": [
        11
      ],
      "rotate": [
        13,
        14,
        15,
        16
      ],
      "rotate_done": [
        14
      ],
      "op_pop": [
        21
      ],
      "dequeue": [
        22
      ],
      "return_result": [
        22,
        23,
        24
      ],
      "op_top": [
        28
      ],
      "peek_front": [
        29
      ],
      "op_empty": [
        33
      ],
      "check_empty": [
        34
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var MyStack = function () {\n  this.q = [];\n};\n\n// Push element onto stack - O(n)\nMyStack.prototype.push = function (x) {\n  this.q.push(x);\n  // Rotate queue so the new element is at the front\n  const size = this.q.length;\n  for (let i = 0; i < size - 1; i++) {\n    this.q.push(this.q.shift());\n  }\n};\n\n// Pop top element - O(1)\nMyStack.prototype.pop = function () {\n  return this.q.shift();\n};\n\n// Peek top element - O(1)\nMyStack.prototype.top = function () {\n  return this.q[0];\n};\n\n// Check if empty - O(1)\nMyStack.prototype.empty = function () {\n  return this.q.length === 0;\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "op_push": [
        6
      ],
      "enqueue": [
        7
      ],
      "rotate": [
        9,
        10,
        11
      ],
      "rotate_done": [
        10
      ],
      "op_pop": [
        16
      ],
      "dequeue": [
        17
      ],
      "return_result": [
        17
      ],
      "op_top": [
        21
      ],
      "peek_front": [
        22
      ],
      "op_empty": [
        26
      ],
      "check_empty": [
        27
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "class MyStack {\n    private q: number[];\n\n    constructor() {\n        this.q = [];\n    }\n\n    // Push element onto stack - O(n)\n    push(x: number): void {\n        this.q.push(x);\n        // Rotate queue so the new element is at the front\n        const size = this.q.length;\n        for (let i = 0; i < size - 1; i++) {\n            this.q.push(this.q.shift()!);\n        }\n    }\n\n    // Pop top element - O(1)\n    pop(): number {\n        return this.q.shift()!;\n    }\n\n    // Peek top element - O(1)\n    top(): number {\n        return this.q[0];\n    }\n\n    // Check if empty - O(1)\n    empty(): boolean {\n        return this.q.length === 0;\n    }\n}",
    "lineMap": {
      "-": [
        4,
        5
      ],
      "op_push": [
        9
      ],
      "enqueue": [
        10
      ],
      "rotate": [
        12,
        13,
        14
      ],
      "rotate_done": [
        13
      ],
      "op_pop": [
        19
      ],
      "dequeue": [
        20
      ],
      "return_result": [
        20
      ],
      "op_top": [
        24
      ],
      "peek_front": [
        25
      ],
      "op_empty": [
        29
      ],
      "check_empty": [
        30
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  }
};

const ImplementStackUsingQueuesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "operations": [
        "push(1)",
        "push(2)",
        "push(3)",
        "pop()",
        "top()",
        "push(4)",
        "pop()"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Push Heavy",
    "value": {
      "operations": [
        "push(5)",
        "push(4)",
        "push(3)",
        "push(2)",
        "push(1)",
        "pop()",
        "pop()"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Alternating",
    "value": {
      "operations": [
        "push(1)",
        "pop()",
        "push(2)",
        "top()",
        "push(3)",
        "pop()"
      ]
    }
  }
];

function generateImplementStackUsingQueuesSteps(e: any): any[] {
  

let t=e.operations,n=new StepRecorder({},{}),l=0,a=[],r=[],i=-1;function p(e,t,o,l){n.update_visual(e.key,{type:"queueElement",value:e.value,position:o,label:t,state:l})}function s(){a.forEach((e,t)=>p(e,"q1",t)),r.forEach((e,t)=>p(e,"q2",t))}function u(){n.delete_variable("moveVal"),n.delete_variable("result"),n.delete_variable("err")}n.add_new_variable("opIndex",-1),n.add_new_variable("topElement",i),n.record("-","Start with two empty queues. Pushes go straight onto q1, so the stack top sits at the back.");for(let e=0;e<t.length;e++){let o=t[e],{name:c,arg:h}=function(e){let t=e.match(/^(\w+)\((\d+)?\)$/);return t?{name:t[1],arg:void 0!==t[2]?parseInt(t[2]):void 0}:{name:e}}(o);if(n.update_variable("opIndex",e),n.update_variable("op",o),u(),s(),"push"===c&&void 0!==h){n.record("op_push",`push(${h}): enqueue ${h} onto q1 and remember it as the top`);let e={key:`el_${l++}`,value:h};a.push(e),i=h,n.add_new_visual(e.key,{type:"queueElement",value:h,position:a.length-1,label:"q1",state:"new"}),n.update_variable("moveVal",h),n.update_variable("topElement",i),n.record("enqueue_q1",`Enqueue ${h} at the back of q1 and set topElement = ${h}`)}else if("pop"===c)if(0===a.length)n.record("op_pop","pop(): remove and return the stack top"),n.update_variable("result","error"),n.update_variable("err",!0),n.record("return_result","q1 is empty, there is nothing to pop");else{for(n.record("op_pop","pop(): drain q1 into q2 until only the last element is left");a.length>1;){let e=a.shift();r.push(e),i=e.value,s(),p(e,"q2",r.length-1,"moving"),n.update_variable("moveVal",e.value),n.update_variable("topElement",i),n.add_conditional("more_than_one",!0),n.record("move_element",`q1 still holds more than one: move ${e.value} to q2, topElement = ${e.value}`)}n.add_conditional("more_than_one",!1),s(),p(a[0],"q1",0,"active"),n.update_variable("moveVal",a[0].value),n.record("take_last",`The last element in q1 is ${a[0].value}, the stack top`);let e=a.shift();p(e,"q1",-1.6,"removed"),n.record("swap_queues",`Dequeue ${e.value} and swap the queues so q1 holds the rest`),n.delete_visual(e.key);let t=a;a=r,r=t,s(),n.update_variable("result",`${e.value}`),n.record("return_result",`pop() returns ${e.value}`)}else if("top"===c)0===a.length?(n.record("op_top","top(): read the remembered stack top"),n.update_variable("result","error"),n.update_variable("err",!0),n.record("peek_top","The stack is empty, there is nothing to peek at")):(n.record("op_top","top(): read the remembered stack top"),p(a[a.length-1],"q1",a.length-1,"peek"),n.update_variable("moveVal",i),n.update_variable("result",`${i}`),n.record("peek_top",`top() returns topElement = ${i}, no queue is touched`));else if("empty"===c){n.record("op_empty","empty(): check whether the stack has any elements");let e=0===a.length;n.update_variable("result",`${e}`),n.record("check_empty",`q1 has ${a.length} element(s), so empty() returns ${e}`)}}return n.update_variable("opIndex",t.length),u(),a.forEach((e,t)=>p(e,"q1",t,"done")),r.forEach((e,t)=>p(e,"q2",t)),n.record("complete","All operations complete"),n.getSteps()
}

export function ImplementStackUsingQueuesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ImplementStackUsingQueuesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateImplementStackUsingQueuesSteps(e) as any[];
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
      title="Implement Stack Using Queues"
      slug="implement-stack-using-queues"
      approaches={approaches}
      presets={ImplementStackUsingQueuesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Max Stack (max-stack)
// ==========================================

const MaxStackTemplates = {
  "python": {
    "language": "python",
    "code": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.prev = None\n        self.next = None\n        self.alive = True   # for lazy deletion\n\nclass MaxStack:\n\n    def __init__(self):\n        self.head = Node(0)\n        self.tail = Node(0)\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n        self.map = {}              # val -> list of nodes\n        self.max_heap = []         # max heap using negative values\n\n    def push(self, x: int) -> None:\n        node = Node(x)\n\n        # insert into DLL\n        node.prev = self.tail.prev\n        node.next = self.tail\n        self.tail.prev.next = node\n        self.tail.prev = node\n\n        # map\n        if x not in self.map:\n            self.map[x] = []\n        self.map[x].append(node)\n\n        # heap\n        heapq.heappush(self.max_heap, -x)\n\n    def pop(self) -> int:\n        node = self.tail.prev\n        self._remove_node(node)\n\n        val = node.val\n        nodes = self.map[val]\n        nodes.pop()\n        if not nodes:\n            del self.map[val]\n\n        node.alive = False\n        return val\n\n    def top(self) -> int:\n        return self.tail.prev.val\n\n    def peekMax(self) -> int:\n        self._clean_heap()\n        return -self.max_heap[0]\n\n    def popMax(self) -> int:\n        self._clean_heap()\n        max_val = -heapq.heappop(self.max_heap)\n\n        node = self.map[max_val].pop()\n        if not self.map[max_val]:\n            del self.map[max_val]\n\n        self._remove_node(node)\n        node.alive = False\n\n        return max_val\n\n    def _remove_node(self, node):\n        node.prev.next = node.next\n        node.next.prev = node.prev\n\n    def _clean_heap(self):\n        # remove stale elements\n        while self.max_heap:\n            val = -self.max_heap[0]\n            if val in self.map and self.map[val]:\n                break\n            heapq.heappop(self.max_heap)",
    "lineMap": {
      "-": [
        11,
        12,
        16,
        17
      ],
      "start_push": [
        19
      ],
      "create_node": [
        20
      ],
      "add_to_list": [
        23,
        24,
        25,
        26
      ],
      "add_to_tree": [
        29,
        30,
        31,
        34
      ],
      "push_done": [
        34
      ],
      "start_pop": [
        36
      ],
      "get_tail": [
        37
      ],
      "remove_from_list": [
        38
      ],
      "remove_from_tree": [
        41,
        42,
        43,
        44
      ],
      "pop_done": [
        46,
        47
      ],
      "start_top": [
        49
      ],
      "read_tail": [
        50
      ],
      "top_done": [
        50
      ],
      "start_peekmax": [
        52
      ],
      "get_last_key": [
        53,
        54
      ],
      "peekmax_done": [
        54
      ],
      "start_popmax": [
        56
      ],
      "find_max": [
        57,
        58
      ],
      "get_max_node": [
        60
      ],
      "remove_max_from_tree": [
        61,
        62
      ],
      "remove_max_from_list": [
        64,
        65
      ],
      "popmax_done": [
        67
      ],
      "complete": [
        79
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class MaxStack {\n    static class Node {\n        int val;\n        Node prev, next;\n        Node(int val) { this.val = val; }\n    }\n\n    Node head, tail;\n    TreeMap<Integer, List<Node>> map;\n\n    public MaxStack() {\n        head = new Node(0);\n        tail = new Node(0);\n        head.next = tail;\n        tail.prev = head;\n        map = new TreeMap<>();\n    }\n\n    public void push(int x) {\n        Node node = new Node(x);\n        node.prev = tail.prev;\n        node.next = tail;\n        tail.prev.next = node;\n        tail.prev = node;\n        map.computeIfAbsent(x, k -> new ArrayList<>()).add(node);\n    }\n\n    public int pop() {\n        Node node = tail.prev;\n        removeNode(node);\n        List<Node> nodes = map.get(node.val);\n        nodes.remove(nodes.size() - 1);\n        if (nodes.isEmpty()) map.remove(node.val);\n        return node.val;\n    }\n\n    public int top() {\n        return tail.prev.val;\n    }\n\n    public int peekMax() {\n        return map.lastKey();\n    }\n\n    public int popMax() {\n        int maxVal = map.lastKey();\n        List<Node> nodes = map.get(maxVal);\n        Node node = nodes.remove(nodes.size() - 1);\n        if (nodes.isEmpty()) map.remove(maxVal);\n        removeNode(node);\n        return maxVal;\n    }\n\n    private void removeNode(Node node) {\n        node.prev.next = node.next;\n        node.next.prev = node.prev;\n    }\n}",
    "lineMap": {
      "-": [
        12,
        13,
        14,
        15,
        16
      ],
      "start_push": [
        19
      ],
      "create_node": [
        20
      ],
      "add_to_list": [
        21,
        22,
        23,
        24
      ],
      "add_to_tree": [
        25
      ],
      "push_done": [
        25
      ],
      "start_pop": [
        28
      ],
      "get_tail": [
        29
      ],
      "remove_from_list": [
        30
      ],
      "remove_from_tree": [
        31,
        32,
        33
      ],
      "pop_done": [
        34
      ],
      "start_top": [
        37
      ],
      "read_tail": [
        38
      ],
      "top_done": [
        38
      ],
      "start_peekmax": [
        41
      ],
      "get_last_key": [
        42
      ],
      "peekmax_done": [
        42
      ],
      "start_popmax": [
        45
      ],
      "find_max": [
        46
      ],
      "get_max_node": [
        47,
        48
      ],
      "remove_max_from_tree": [
        49
      ],
      "remove_max_from_list": [
        50
      ],
      "popmax_done": [
        51
      ],
      "complete": [
        57
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class MaxStack {\n    list<int> dll;\n    map<int, vector<list<int>::iterator>> mp;\n\npublic:\n    MaxStack() {}\n\n    void push(int x) {\n        dll.push_back(x);\n        mp[x].push_back(prev(dll.end()));\n    }\n\n    int pop() {\n        int val = dll.back();\n        dll.pop_back();\n        mp[val].pop_back();\n        if (mp[val].empty()) mp.erase(val);\n        return val;\n    }\n\n    int top() {\n        return dll.back();\n    }\n\n    int peekMax() {\n        return mp.rbegin()->first;\n    }\n\n    int popMax() {\n        int maxVal = mp.rbegin()->first;\n        auto it = mp[maxVal].back();\n        mp[maxVal].pop_back();\n        if (mp[maxVal].empty()) mp.erase(maxVal);\n        dll.erase(it);\n        return maxVal;\n    }\n};",
    "lineMap": {
      "-": [
        2,
        3,
        6
      ],
      "start_push": [
        8
      ],
      "create_node": [
        9
      ],
      "add_to_list": [
        9
      ],
      "add_to_tree": [
        10
      ],
      "push_done": [
        10
      ],
      "start_pop": [
        13
      ],
      "get_tail": [
        14
      ],
      "remove_from_list": [
        15
      ],
      "remove_from_tree": [
        16,
        17
      ],
      "pop_done": [
        18
      ],
      "start_top": [
        21
      ],
      "read_tail": [
        22
      ],
      "top_done": [
        22
      ],
      "start_peekmax": [
        25
      ],
      "get_last_key": [
        26
      ],
      "peekmax_done": [
        26
      ],
      "start_popmax": [
        29
      ],
      "find_max": [
        30
      ],
      "get_max_node": [
        31
      ],
      "remove_max_from_tree": [
        32,
        33
      ],
      "remove_max_from_list": [
        34
      ],
      "popmax_done": [
        35
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MaxStack {\n    LinkedList<int> dll;\n    SortedDictionary<int, List<LinkedListNode<int>>> map;\n\n    public MaxStack() {\n        dll = new LinkedList<int>();\n        map = new SortedDictionary<int, List<LinkedListNode<int>>>();\n    }\n\n    public void Push(int x) {\n        var node = dll.AddLast(x);\n        if (!map.ContainsKey(x)) {\n            map[x] = new List<LinkedListNode<int>>();\n        }\n        map[x].Add(node);\n    }\n\n    public int Pop() {\n        var node = dll.Last;\n        dll.RemoveLast();\n        var nodes = map[node.Value];\n        nodes.RemoveAt(nodes.Count - 1);\n        if (nodes.Count == 0) map.Remove(node.Value);\n        return node.Value;\n    }\n\n    public int Top() {\n        return dll.Last.Value;\n    }\n\n    public int PeekMax() {\n        return map.Keys.Max();\n    }\n\n    public int PopMax() {\n        int maxVal = map.Keys.Max();\n        var nodes = map[maxVal];\n        var node = nodes[nodes.Count - 1];\n        nodes.RemoveAt(nodes.Count - 1);\n        if (nodes.Count == 0) map.Remove(maxVal);\n        dll.Remove(node);\n        return maxVal;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "start_push": [
        10
      ],
      "create_node": [
        11
      ],
      "add_to_list": [
        11
      ],
      "add_to_tree": [
        12,
        13,
        15
      ],
      "push_done": [
        15
      ],
      "start_pop": [
        18
      ],
      "get_tail": [
        19
      ],
      "remove_from_list": [
        20
      ],
      "remove_from_tree": [
        21,
        22,
        23
      ],
      "pop_done": [
        24
      ],
      "start_top": [
        27
      ],
      "read_tail": [
        28
      ],
      "top_done": [
        28
      ],
      "start_peekmax": [
        31
      ],
      "get_last_key": [
        32
      ],
      "peekmax_done": [
        32
      ],
      "start_popmax": [
        35
      ],
      "find_max": [
        36
      ],
      "get_max_node": [
        37,
        38
      ],
      "remove_max_from_tree": [
        39,
        40
      ],
      "remove_max_from_list": [
        41
      ],
      "popmax_done": [
        42
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "type DLLNode struct {\n    val        int\n    prev, next *DLLNode\n}\n\ntype MaxStack struct {\n    head, tail *DLLNode\n    nodeMap    map[int][]*DLLNode\n    sorted     []int\n}\n\nfunc Constructor() MaxStack {\n    head := &DLLNode{}\n    tail := &DLLNode{}\n    head.next = tail\n    tail.prev = head\n    return MaxStack{\n        head:    head,\n        tail:    tail,\n        nodeMap: make(map[int][]*DLLNode),\n        sorted:  []int{},\n    }\n}\n\nfunc (s *MaxStack) addSorted(val int) {\n    if nodes, exists := s.nodeMap[val]; exists && len(nodes) > 0 {\n        return\n    }\n    i := sort.SearchInts(s.sorted, val)\n    s.sorted = append(s.sorted, 0)\n    copy(s.sorted[i+1:], s.sorted[i:])\n    s.sorted[i] = val\n}\n\nfunc (s *MaxStack) removeSorted(val int) {\n    if nodes, exists := s.nodeMap[val]; exists && len(nodes) > 0 {\n        return\n    }\n    i := sort.SearchInts(s.sorted, val)\n    s.sorted = append(s.sorted[:i], s.sorted[i+1:]...)\n}\n\nfunc (s *MaxStack) removeNode(node *DLLNode) {\n    node.prev.next = node.next\n    node.next.prev = node.prev\n}\n\nfunc (s *MaxStack) Push(x int) {\n    node := &DLLNode{val: x}\n    node.prev = s.tail.prev\n    node.next = s.tail\n    s.tail.prev.next = node\n    s.tail.prev = node\n    s.addSorted(x)\n    s.nodeMap[x] = append(s.nodeMap[x], node)\n}\n\nfunc (s *MaxStack) Pop() int {\n    node := s.tail.prev\n    s.removeNode(node)\n    nodes := s.nodeMap[node.val]\n    s.nodeMap[node.val] = nodes[:len(nodes)-1]\n    s.removeSorted(node.val)\n    return node.val\n}\n\nfunc (s *MaxStack) Top() int {\n    return s.tail.prev.val\n}\n\nfunc (s *MaxStack) PeekMax() int {\n    return s.sorted[len(s.sorted)-1]\n}\n\nfunc (s *MaxStack) PopMax() int {\n    maxVal := s.sorted[len(s.sorted)-1]\n    nodes := s.nodeMap[maxVal]\n    node := nodes[len(nodes)-1]\n    s.nodeMap[maxVal] = nodes[:len(nodes)-1]\n    s.removeSorted(maxVal)\n    s.removeNode(node)\n    return maxVal\n}",
    "lineMap": {
      "-": [
        15,
        16,
        20,
        21
      ],
      "start_push": [
        48
      ],
      "create_node": [
        49
      ],
      "add_to_list": [
        50,
        51,
        52,
        53
      ],
      "add_to_tree": [
        54,
        55
      ],
      "push_done": [
        55
      ],
      "start_pop": [
        58
      ],
      "get_tail": [
        59
      ],
      "remove_from_list": [
        60
      ],
      "remove_from_tree": [
        61,
        62,
        63
      ],
      "pop_done": [
        64
      ],
      "start_top": [
        67
      ],
      "read_tail": [
        68
      ],
      "top_done": [
        68
      ],
      "start_peekmax": [
        71
      ],
      "get_last_key": [
        72
      ],
      "peekmax_done": [
        72
      ],
      "start_popmax": [
        75
      ],
      "find_max": [
        76
      ],
      "get_max_node": [
        77,
        78
      ],
      "remove_max_from_tree": [
        79,
        80
      ],
      "remove_max_from_list": [
        81
      ],
      "popmax_done": [
        82
      ],
      "complete": [
        83
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var MaxStack = function () {\n  this.head = { val: 0, prev: null, next: null };\n  this.tail = { val: 0, prev: null, next: null };\n  this.head.next = this.tail;\n  this.tail.prev = this.head;\n  this.nodeMap = new Map();\n  this.sortedKeys = [];\n};\n\nMaxStack.prototype._addKey = function (key) {\n  if (this.nodeMap.has(key) && this.nodeMap.get(key).length > 0) return;\n  var lo = 0, hi = this.sortedKeys.length;\n  while (lo < hi) {\n    var mid = (lo + hi) >> 1;\n    if (this.sortedKeys[mid] < key) lo = mid + 1;\n    else hi = mid;\n  }\n  this.sortedKeys.splice(lo, 0, key);\n};\n\nMaxStack.prototype._removeKey = function (key) {\n  if (this.nodeMap.has(key) && this.nodeMap.get(key).length > 0) return;\n  var lo = 0, hi = this.sortedKeys.length;\n  while (lo < hi) {\n    var mid = (lo + hi) >> 1;\n    if (this.sortedKeys[mid] < key) lo = mid + 1;\n    else hi = mid;\n  }\n  this.sortedKeys.splice(lo, 1);\n};\n\nMaxStack.prototype._removeNode = function (node) {\n  node.prev.next = node.next;\n  node.next.prev = node.prev;\n};\n\nMaxStack.prototype.push = function (x) {\n  var node = { val: x, prev: this.tail.prev, next: this.tail };\n  this.tail.prev.next = node;\n  this.tail.prev = node;\n  this._addKey(x);\n  if (!this.nodeMap.has(x)) this.nodeMap.set(x, []);\n  this.nodeMap.get(x).push(node);\n};\n\nMaxStack.prototype.pop = function () {\n  var node = this.tail.prev;\n  this._removeNode(node);\n  var nodes = this.nodeMap.get(node.val);\n  nodes.pop();\n  this._removeKey(node.val);\n  return node.val;\n};\n\nMaxStack.prototype.top = function () {\n  return this.tail.prev.val;\n};\n\nMaxStack.prototype.peekMax = function () {\n  return this.sortedKeys[this.sortedKeys.length - 1];\n};\n\nMaxStack.prototype.popMax = function () {\n  var maxVal = this.sortedKeys[this.sortedKeys.length - 1];\n  var nodes = this.nodeMap.get(maxVal);\n  var node = nodes.pop();\n  this._removeKey(maxVal);\n  this._removeNode(node);\n  return maxVal;\n};",
    "lineMap": {
      "-": [
        4,
        5,
        6,
        7
      ],
      "start_push": [
        37
      ],
      "create_node": [
        38
      ],
      "add_to_list": [
        39,
        40
      ],
      "add_to_tree": [
        41,
        42,
        43
      ],
      "push_done": [
        43
      ],
      "start_pop": [
        46
      ],
      "get_tail": [
        47
      ],
      "remove_from_list": [
        48
      ],
      "remove_from_tree": [
        49,
        50,
        51
      ],
      "pop_done": [
        52
      ],
      "start_top": [
        55
      ],
      "read_tail": [
        56
      ],
      "top_done": [
        56
      ],
      "start_peekmax": [
        59
      ],
      "get_last_key": [
        60
      ],
      "peekmax_done": [
        60
      ],
      "start_popmax": [
        63
      ],
      "find_max": [
        64
      ],
      "get_max_node": [
        65,
        66
      ],
      "remove_max_from_tree": [
        67
      ],
      "remove_max_from_list": [
        68
      ],
      "popmax_done": [
        69
      ],
      "complete": [
        70
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "interface DLLNode {\n    val: number;\n    prev: DLLNode | null;\n    next: DLLNode | null;\n}\n\nclass MaxStack {\n    private head: DLLNode;\n    private tail: DLLNode;\n    private nodeMap: Map<number, DLLNode[]>;\n    private sortedKeys: number[];\n\n    constructor() {\n        this.head = { val: 0, prev: null, next: null };\n        this.tail = { val: 0, prev: null, next: null };\n        this.head.next = this.tail;\n        this.tail.prev = this.head;\n        this.nodeMap = new Map();\n        this.sortedKeys = [];\n    }\n\n    private addKey(key: number): void {\n        if (this.nodeMap.has(key) && this.nodeMap.get(key)!.length > 0) return;\n        let lo = 0, hi = this.sortedKeys.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (this.sortedKeys[mid] < key) lo = mid + 1;\n            else hi = mid;\n        }\n        this.sortedKeys.splice(lo, 0, key);\n    }\n\n    private removeKey(key: number): void {\n        if (this.nodeMap.has(key) && this.nodeMap.get(key)!.length > 0) return;\n        let lo = 0, hi = this.sortedKeys.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (this.sortedKeys[mid] < key) lo = mid + 1;\n            else hi = mid;\n        }\n        this.sortedKeys.splice(lo, 1);\n    }\n\n    private removeNode(node: DLLNode): void {\n        node.prev!.next = node.next;\n        node.next!.prev = node.prev;\n    }\n\n    push(x: number): void {\n        const node: DLLNode = { val: x, prev: this.tail.prev, next: this.tail };\n        this.tail.prev!.next = node;\n        this.tail.prev = node;\n        this.addKey(x);\n        if (!this.nodeMap.has(x)) this.nodeMap.set(x, []);\n        this.nodeMap.get(x)!.push(node);\n    }\n\n    pop(): number {\n        const node = this.tail.prev!;\n        this.removeNode(node);\n        const nodes = this.nodeMap.get(node.val)!;\n        nodes.pop();\n        this.removeKey(node.val);\n        return node.val;\n    }\n\n    top(): number {\n        return this.tail.prev!.val;\n    }\n\n    peekMax(): number {\n        return this.sortedKeys[this.sortedKeys.length - 1];\n    }\n\n    popMax(): number {\n        const maxVal = this.sortedKeys[this.sortedKeys.length - 1];\n        const nodes = this.nodeMap.get(maxVal)!;\n        const node = nodes.pop()!;\n        this.removeKey(maxVal);\n        this.removeNode(node);\n        return maxVal;\n    }\n}",
    "lineMap": {
      "-": [
        16,
        17,
        18,
        19
      ],
      "start_push": [
        49
      ],
      "create_node": [
        50
      ],
      "add_to_list": [
        51,
        52
      ],
      "add_to_tree": [
        53,
        54,
        55
      ],
      "push_done": [
        55
      ],
      "start_pop": [
        58
      ],
      "get_tail": [
        59
      ],
      "remove_from_list": [
        60
      ],
      "remove_from_tree": [
        61,
        62,
        63
      ],
      "pop_done": [
        64
      ],
      "start_top": [
        67
      ],
      "read_tail": [
        68
      ],
      "top_done": [
        68
      ],
      "start_peekmax": [
        71
      ],
      "get_last_key": [
        72
      ],
      "peekmax_done": [
        72
      ],
      "start_popmax": [
        75
      ],
      "find_max": [
        76
      ],
      "get_max_node": [
        77,
        78
      ],
      "remove_max_from_tree": [
        79
      ],
      "remove_max_from_list": [
        80
      ],
      "popmax_done": [
        81
      ],
      "complete": [
        82
      ]
    },
    "conditionalMap": {}
  }
};

const MaxStackPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "operations": [
        "MaxStack",
        "push",
        "push",
        "push",
        "top",
        "popMax",
        "top",
        "peekMax",
        "pop",
        "top"
      ],
      "values": [
        null,
        5,
        1,
        5,
        null,
        null,
        null,
        null,
        null,
        null
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "operations": [
        "MaxStack",
        "push",
        "push",
        "push",
        "peekMax",
        "popMax",
        "peekMax",
        "popMax"
      ],
      "values": [
        null,
        1,
        3,
        2,
        null,
        null,
        null,
        null
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "operations": [
        "MaxStack",
        "push",
        "push",
        "push",
        "push",
        "popMax",
        "pop",
        "top"
      ],
      "values": [
        null,
        10,
        20,
        5,
        15,
        null,
        null,
        null
      ]
    }
  }
];

function generateMaxStackSteps(e: any): any[] {
  class n{get size(){return this.items.length}peek(){return this.items[0]}snapshot(){return this.items.map(e=>[e.val,e.id])}greater(e,t){return e.val!==t.val?e.val>t.val:e.id>t.id}push(e){this.items.push(e);let t=this.items.length-1;for(;t>0;){let e=t-1>>1;if(!this.greater(this.items[t],this.items[e]))break;[this.items[t],this.items[e]]=[this.items[e],this.items[t]],t=e}}pop(){if(0===this.items.length)return;let e=this.items[0],t=this.items.pop();if(this.items.length>0){this.items[0]=t;let e=0;for(;;){let t=e,a=2*e+1,s=2*e+2;if(a<this.items.length&&this.greater(this.items[a],this.items[t])&&(t=a),s<this.items.length&&this.greater(this.items[s],this.items[t])&&(t=s),t===e)break;[this.items[e],this.items[t]]=[this.items[t],this.items[e]],e=t}}return e}constructor(){this.items=[]}}

let t=(0,o.parseMaxStackOps)(e),a=new StepRecorder({},{}),p=[],r=new n,i=new Set,l=0,d=(e,t)=>{a.update_variable("opIdx",e),a.update_variable("kind",t),a.update_variable("stack",p.map(e=>[e.val,e.id])),a.update_variable("heap",r.snapshot()),a.update_variable("deleted",[...i])},h=()=>{a.update_variable("target",""),a.update_variable("result","")},c=()=>p.filter(e=>!i.has(e.id)).length,u=[],m=new n,x=new Set,_=0,k=t.map(e=>{if("push"===e.kind)return u.push({val:e.val,id:_}),m.push({val:e.val,id:_}),_++,null;for(;u.length>0&&x.has(u[u.length-1].id);)u.pop();for(;;){let e=m.peek();if(!e||!x.has(e.id))break;m.pop()}if(0===u.length)return"-";if("pop"===e.kind){let e=u.pop();return x.add(e.id),String(e.val)}if("top"===e.kind)return String(u[u.length-1].val);if("peekMax"===e.kind)return String(m.peek().val);let t=m.pop();return x.add(t.id),String(t.val)});a.update_variable("ops",t.map(o.maxStackOpLabel)),a.update_variable("opResults",k),d(-1,"init"),h(),a.record("-","A stack and a max-heap over the same (value, id) pairs; removals only record the id.");let f=(e,t,s)=>{for(;;){let o=p.length>0&&i.has(p[p.length-1].id);if(a.add_conditional("stack_stale",o),!o)break;let n=p.pop();d(e,t),a.record(s,`Top of the stack is id ${n.id}, already deleted, so drop it`)}},v=(e,t,s)=>{for(;;){let o=r.peek();if(!o||!i.has(o.id))break;r.pop(),d(e,t),a.record(s,`Heap top is id ${o.id}, already deleted, so pop it`)}};for(let e=0;e<t.length;e++){let s=t[e];if("push"===s.kind){let t=s.val;d(e,"push"),h(),a.update_variable("target",t),a.record("start_push",`push(${t})`),p.push({val:t,id:l}),d(e,"push"),a.update_variable("target",t),a.record("push_val",`Push (${t}, id ${l}) onto the stack`),r.push({val:t,id:l}),l++,d(e,"push"),a.update_variable("target",t),a.record("push_heap",`Push (${t}, id ${l-1}) onto the heap`),a.record("push_done",`push(${t}) complete`);continue}if(d(e,s.kind),h(),0===c()){a.update_variable("result","-");let e="pop"===s.kind?"start_pop":"top"===s.kind?"start_top":"peekMax"===s.kind?"start_peekmax":"start_popmax";a.record(e,`${s.kind}() with nothing live, nothing to return`);continue}if("pop"===s.kind){a.record("start_pop","pop()"),f(e,"pop","pop_clean");let t=p.pop();i.add(t.id),d(e,"pop"),a.record("pop_take",`Take (${t.val}, id ${t.id}) and mark id ${t.id} deleted`),a.update_variable("result",String(t.val)),a.record("pop_done",`pop() returns ${t.val}`)}else if("top"===s.kind){a.record("start_top","top()"),f(e,"top","top_clean");let t=p[p.length-1].val;a.update_variable("result",String(t)),a.record("top_done",`top() returns ${t}`)}else if("peekMax"===s.kind){a.record("start_peekmax","peekMax()"),v(e,"peekMax","peek_clean");let t=r.peek().val;a.update_variable("result",String(t)),a.record("peekmax_done",`peekMax() returns ${t}`)}else{a.record("start_popmax","popMax()"),v(e,"popMax","popmax_clean");let t=r.pop();i.add(t.id),d(e,"popMax"),a.update_variable("target",t.val),a.record("popmax_take",`Pop (${t.val}, id ${t.id}) and mark id ${t.id} deleted; the stack copy goes stale`),a.update_variable("result",String(t.val)),a.record("popmax_done",`popMax() returns ${t.val}`)}}return d(t.length,"done"),h(),a.record("complete",`All operations complete. ${c()} live value(s), ${i.size} id(s) marked deleted.`),a.getSteps()
}

export function MaxStackProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaxStackTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaxStackSteps(e) as any[];
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
      title="Max Stack"
      slug="max-stack"
      approaches={approaches}
      presets={MaxStackPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Frequency Stack (maximum-frequency-stack)
// ==========================================

const MaximumFrequencyStackTemplates = {
  "python": {
    "language": "python",
    "code": "class FreqStack:\n    def __init__(self):\n        self.freq = {}\n        self.freq_to_stack = defaultdict(list)\n        self.max_freq = 0\n\n    def push(self, val: int) -> None:\n        f = self.freq.get(val, 0) + 1\n        self.freq[val] = f\n        self.freq_to_stack[f].append(val)\n        self.max_freq = max(self.max_freq, f)\n\n    def pop(self) -> int:\n        # Pop from the stack at the current max frequency\n        val = self.freq_to_stack[self.max_freq].pop()\n        self.freq[val] -= 1\n        # If no more elements at this frequency, decrease max_freq\n        if not self.freq_to_stack[self.max_freq]:\n            self.max_freq -= 1\n        return val",
    "lineMap": {
      "-": [
        2,
        3,
        4,
        5
      ],
      "start_push": [
        7
      ],
      "get_freq": [
        8
      ],
      "increment_freq": [
        9
      ],
      "push_to_stack": [
        10
      ],
      "update_max_freq": [
        11
      ],
      "push_done": [
        11
      ],
      "start_pop": [
        13
      ],
      "get_max_stack": [
        14,
        15
      ],
      "pop_from_stack": [
        15
      ],
      "decrement_freq": [
        16
      ],
      "check_empty": [
        17,
        18
      ],
      "decrement_max_freq": [
        19
      ],
      "pop_done": [
        20
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_empty_stack": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class FreqStack {\n    Map<Integer, Integer> freq;\n    Map<Integer, Deque<Integer>> freqToStack;\n    int maxFreq;\n\n    public FreqStack() {\n        freq = new HashMap<>();\n        freqToStack = new HashMap<>();\n        maxFreq = 0;\n    }\n\n    public void push(int val) {\n        int f = freq.getOrDefault(val, 0) + 1;\n        freq.put(val, f);\n        freqToStack.computeIfAbsent(f, k -> new ArrayDeque<>()).push(val);\n        maxFreq = Math.max(maxFreq, f);\n    }\n\n    public int pop() {\n        // Pop from the stack at the current max frequency\n        int val = freqToStack.get(maxFreq).pop();\n        freq.put(val, freq.get(val) - 1);\n        // If no more elements at this frequency, decrease maxFreq\n        if (freqToStack.get(maxFreq).isEmpty()) {\n            maxFreq--;\n        }\n        return val;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9,
        10
      ],
      "start_push": [
        12
      ],
      "get_freq": [
        13
      ],
      "increment_freq": [
        14
      ],
      "push_to_stack": [
        15
      ],
      "update_max_freq": [
        16
      ],
      "push_done": [
        17
      ],
      "start_pop": [
        19
      ],
      "get_max_stack": [
        20,
        21
      ],
      "pop_from_stack": [
        21
      ],
      "decrement_freq": [
        22
      ],
      "check_empty": [
        23,
        24
      ],
      "decrement_max_freq": [
        25
      ],
      "pop_done": [
        27
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_empty_stack": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class FreqStack {\n    unordered_map<int, int> freq;\n    unordered_map<int, vector<int>> freqToStack;\n    int maxFreq;\n\npublic:\n    FreqStack() : maxFreq(0) {}\n\n    void push(int val) {\n        int f = ++freq[val];\n        freqToStack[f].push_back(val);\n        maxFreq = max(maxFreq, f);\n    }\n\n    int pop() {\n        // Pop from the stack at the current max frequency\n        int val = freqToStack[maxFreq].back();\n        freqToStack[maxFreq].pop_back();\n        freq[val]--;\n        // If no more elements at this frequency, decrease maxFreq\n        if (freqToStack[maxFreq].empty()) {\n            maxFreq--;\n        }\n        return val;\n    }\n};",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "start_push": [
        9
      ],
      "get_freq": [
        10
      ],
      "increment_freq": [
        10
      ],
      "push_to_stack": [
        11
      ],
      "update_max_freq": [
        12
      ],
      "push_done": [
        13
      ],
      "start_pop": [
        15
      ],
      "get_max_stack": [
        16,
        17
      ],
      "pop_from_stack": [
        18
      ],
      "decrement_freq": [
        19
      ],
      "check_empty": [
        20,
        21
      ],
      "decrement_max_freq": [
        22
      ],
      "pop_done": [
        24
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_empty_stack": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class FreqStack {\n    Dictionary<int, int> freq;\n    Dictionary<int, Stack<int>> freqToStack;\n    int maxFreq;\n\n    public FreqStack() {\n        freq = new Dictionary<int, int>();\n        freqToStack = new Dictionary<int, Stack<int>>();\n        maxFreq = 0;\n    }\n\n    public void Push(int val) {\n        if (!freq.ContainsKey(val)) freq[val] = 0;\n        freq[val]++;\n        int f = freq[val];\n        if (!freqToStack.ContainsKey(f)) freqToStack[f] = new Stack<int>();\n        freqToStack[f].Push(val);\n        maxFreq = Math.Max(maxFreq, f);\n    }\n\n    public int Pop() {\n        // Pop from the stack at the current max frequency\n        int val = freqToStack[maxFreq].Pop();\n        freq[val]--;\n        // If no more elements at this frequency, decrease maxFreq\n        if (freqToStack[maxFreq].Count == 0) {\n            maxFreq--;\n        }\n        return val;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9,
        10
      ],
      "start_push": [
        12
      ],
      "get_freq": [
        13
      ],
      "increment_freq": [
        14,
        15
      ],
      "push_to_stack": [
        16,
        17
      ],
      "update_max_freq": [
        18
      ],
      "push_done": [
        19
      ],
      "start_pop": [
        21
      ],
      "get_max_stack": [
        22,
        23
      ],
      "pop_from_stack": [
        23
      ],
      "decrement_freq": [
        24
      ],
      "check_empty": [
        25,
        26
      ],
      "decrement_max_freq": [
        27
      ],
      "pop_done": [
        29
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_empty_stack": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type FreqStack struct {\n    freq        map[int]int\n    freqToStack map[int][]int\n    maxFreq     int\n}\n\nfunc Constructor() FreqStack {\n    return FreqStack{\n        freq:        map[int]int{},\n        freqToStack: map[int][]int{},\n        maxFreq:     0,\n    }\n}\n\nfunc (this *FreqStack) Push(val int) {\n    this.freq[val]++\n    f := this.freq[val]\n    this.freqToStack[f] = append(this.freqToStack[f], val)\n    if f > this.maxFreq {\n        this.maxFreq = f\n    }\n}\n\nfunc (this *FreqStack) Pop() int {\n    // Pop from the stack at the current max frequency\n    stack := this.freqToStack[this.maxFreq]\n    val := stack[len(stack)-1]\n    this.freqToStack[this.maxFreq] = stack[:len(stack)-1]\n    this.freq[val]--\n    // If no more elements at this frequency, decrease maxFreq\n    if len(this.freqToStack[this.maxFreq]) == 0 {\n        this.maxFreq--\n    }\n    return val\n}",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "start_push": [
        15
      ],
      "get_freq": [
        16
      ],
      "increment_freq": [
        17
      ],
      "push_to_stack": [
        18
      ],
      "update_max_freq": [
        19,
        20,
        21
      ],
      "push_done": [
        22
      ],
      "start_pop": [
        24
      ],
      "get_max_stack": [
        25,
        26
      ],
      "pop_from_stack": [
        27,
        28
      ],
      "decrement_freq": [
        29
      ],
      "check_empty": [
        30,
        31
      ],
      "decrement_max_freq": [
        32
      ],
      "pop_done": [
        34
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_empty_stack": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var FreqStack = function () {\n  this.freq = new Map();\n  this.freqToStack = new Map();\n  this.maxFreq = 0;\n};\n\nFreqStack.prototype.push = function (val) {\n  const f = (this.freq.get(val) || 0) + 1;\n  this.freq.set(val, f);\n  if (!this.freqToStack.has(f)) this.freqToStack.set(f, []);\n  this.freqToStack.get(f).push(val);\n  this.maxFreq = Math.max(this.maxFreq, f);\n};\n\nFreqStack.prototype.pop = function () {\n  // Pop from the stack at the current max frequency\n  const stack = this.freqToStack.get(this.maxFreq);\n  const val = stack.pop();\n  this.freq.set(val, this.freq.get(val) - 1);\n  // If no more elements at this frequency, decrease maxFreq\n  if (stack.length === 0) {\n    this.maxFreq--;\n  }\n  return val;\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5
      ],
      "start_push": [
        7
      ],
      "get_freq": [
        8
      ],
      "increment_freq": [
        9
      ],
      "push_to_stack": [
        10,
        11
      ],
      "update_max_freq": [
        12
      ],
      "push_done": [
        13
      ],
      "start_pop": [
        15
      ],
      "get_max_stack": [
        16,
        17
      ],
      "pop_from_stack": [
        18
      ],
      "decrement_freq": [
        19
      ],
      "check_empty": [
        20,
        21
      ],
      "decrement_max_freq": [
        22
      ],
      "pop_done": [
        24
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_empty_stack": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class FreqStack {\n    private freq: Map<number, number>;\n    private freqToStack: Map<number, number[]>;\n    private maxFreq: number;\n\n    constructor() {\n        this.freq = new Map();\n        this.freqToStack = new Map();\n        this.maxFreq = 0;\n    }\n\n    push(val: number): void {\n        const f = (this.freq.get(val) || 0) + 1;\n        this.freq.set(val, f);\n        if (!this.freqToStack.has(f)) this.freqToStack.set(f, []);\n        this.freqToStack.get(f)!.push(val);\n        this.maxFreq = Math.max(this.maxFreq, f);\n    }\n\n    pop(): number {\n        // Pop from the stack at the current max frequency\n        const stack = this.freqToStack.get(this.maxFreq)!;\n        const val = stack.pop()!;\n        this.freq.set(val, this.freq.get(val)! - 1);\n        // If no more elements at this frequency, decrease maxFreq\n        if (stack.length === 0) {\n            this.maxFreq--;\n        }\n        return val;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9,
        10
      ],
      "start_push": [
        12
      ],
      "get_freq": [
        13
      ],
      "increment_freq": [
        14
      ],
      "push_to_stack": [
        15,
        16
      ],
      "update_max_freq": [
        17
      ],
      "push_done": [
        18
      ],
      "start_pop": [
        20
      ],
      "get_max_stack": [
        21,
        22
      ],
      "pop_from_stack": [
        23
      ],
      "decrement_freq": [
        24
      ],
      "check_empty": [
        25,
        26
      ],
      "decrement_max_freq": [
        27
      ],
      "pop_done": [
        29
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_empty_stack": [
        26
      ]
    }
  }
};

const MaximumFrequencyStackPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "LeetCode Example",
    "value": {
      "operations": [
        "FreqStack",
        "push",
        "push",
        "push",
        "push",
        "push",
        "push",
        "pop",
        "pop",
        "pop",
        "pop"
      ],
      "values": [
        null,
        5,
        7,
        5,
        7,
        4,
        5,
        null,
        null,
        null,
        null
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Repeated Elements",
    "value": {
      "operations": [
        "FreqStack",
        "push",
        "push",
        "push",
        "push",
        "pop",
        "pop",
        "push",
        "pop"
      ],
      "values": [
        null,
        1,
        1,
        2,
        1,
        null,
        null,
        1,
        null
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Mixed Values",
    "value": {
      "operations": [
        "FreqStack",
        "push",
        "push",
        "push",
        "push",
        "push",
        "pop",
        "pop",
        "pop"
      ],
      "values": [
        null,
        4,
        0,
        9,
        3,
        4,
        null,
        null,
        null
      ]
    }
  }
];

function generateMaximumFrequencyStackSteps(e: any): any[] {
  function n(e,t){return e.f!==t.f?e.f>t.f:e.t>t.t}

let t=e.operations||[],a=e.values||[],i=new StepRecorder({operation:"",result:""},{}),s=new Map,l=[],o=0,p=()=>{i.update_variable("heap",l.map(e=>({...e}))),i.update_variable("counts",Object.fromEntries(s)),i.update_variable("time",o)};i.update_variable("mode","heap"),i.update_variable("popped",null),p(),i.record("-","Initialize FreqStack: an empty frequency map, an empty max-heap of (frequency, timestamp, value), and time = 0.");for(let e=0;e<t.length;e++){let r=t[e],c=a[e];if("FreqStack"!==r){if("push"===r&&null!==c){i.update_variable("operation",`push(${c})`),i.update_variable("result",""),i.update_variable("popped",null),i.record("start_push",`Push ${c} onto the FreqStack.`);let e=(s.get(c)??0)+1;s.set(c,e),p(),i.update_variable("touched",c),i.record("increment_freq",`${c} has now been pushed ${e} time${1===e?"":"s"}, so freq[${c}] = ${e}.`),o++,p(),i.record("increment_time",`Bump the clock to time = ${o}. It breaks ties between equal frequencies.`),l.push({f:e,t:o,v:c}),function(e,t){let a=t;for(;a>0;){let t=Math.floor((a-1)/2);if(!n(e[a],e[t]))break;[e[a],e[t]]=[e[t],e[a]],a=t}}(l,l.length-1),p(),i.update_variable("entered",`${e}:${o}:${c}`),i.record("heap_push",`Offer (${e}, ${o}, ${c}) to the heap. It settles into place by frequency first, then by time.`),i.delete_variable("touched"),i.delete_variable("entered"),i.update_variable("result","null"),i.record("push_done",`push(${c}) complete.`)}else if("pop"===r){i.update_variable("operation","pop()"),i.update_variable("result",""),i.update_variable("popped",null),i.record("start_pop","Pop the most frequent element. The heap root already holds it.");let e=l[0];l[0]=l[l.length-1],l.pop(),l.length>0&&function(e){let t=0,a=e.length;for(;2*t+1<a;){let r=2*t+1;if(r+1<a&&n(e[r+1],e[r])&&r++,!n(e[r],e[t]))break;[e[t],e[r]]=[e[r],e[t]],t=r}}(l),i.update_variable("popped",{...e}),p(),i.record("heap_pop",`The root is (${e.f}, ${e.t}, ${e.v}), the highest frequency and the newest among ties. Remove it and let the heap re-settle.`),s.set(e.v,(s.get(e.v)??0)-1),p(),i.update_variable("touched",e.v),i.record("decrement_freq",`${e.v} leaves the stack, so freq[${e.v}] drops to ${s.get(e.v)}.`),i.delete_variable("touched"),i.update_variable("popped",null),i.update_variable("result",String(e.v)),i.record("pop_done",`pop() returns ${e.v}.`)}}}return i.update_variable("popped",null),i.record("complete","All operations completed."),i.getSteps()
}

export function MaximumFrequencyStackProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumFrequencyStackTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumFrequencyStackSteps(e) as any[];
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
      title="Maximum Frequency Stack"
      slug="maximum-frequency-stack"
      approaches={approaches}
      presets={MaximumFrequencyStackPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Nesting Depth of the Parentheses (maximum-nesting-depth-of-the-parentheses)
// ==========================================

const MaximumNestingDepthOfTheParenthesesTemplates = {
  "python": {
    "language": "python",
    "code": "def maxDepth(s):\n    depth = 0\n    max_depth = 0\n\n    for c in s:\n        if c == '(':\n            depth += 1\n            # Track the peak depth\n            max_depth = max(max_depth, depth)\n        elif c == ')':\n            depth -= 1\n\n    return max_depth",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_depth": [
        7
      ],
      "update_max": [
        9
      ],
      "check_close": [
        10
      ],
      "dec_depth": [
        11
      ],
      "skip": [
        5
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_open": [
        6
      ],
      "is_close": [
        10
      ],
      "new_max": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxDepth(String s) {\n    int depth = 0;\n    int maxDepth = 0;\n\n    for (char c : s.toCharArray()) {\n        if (c == '(') {\n            depth++;\n            // Track the peak depth\n            maxDepth = Math.max(maxDepth, depth);\n        } else if (c == ')') {\n            depth--;\n        }\n    }\n\n    return maxDepth;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_depth": [
        7
      ],
      "update_max": [
        9
      ],
      "check_close": [
        10
      ],
      "dec_depth": [
        11
      ],
      "skip": [
        5
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_open": [
        6
      ],
      "is_close": [
        10
      ],
      "new_max": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxDepth(string s) {\n    int depth = 0;\n    int maxDepth = 0;\n\n    for (char c : s) {\n        if (c == '(') {\n            depth++;\n            // Track the peak depth\n            maxDepth = max(maxDepth, depth);\n        } else if (c == ')') {\n            depth--;\n        }\n    }\n\n    return maxDepth;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_depth": [
        7
      ],
      "update_max": [
        9
      ],
      "check_close": [
        10
      ],
      "dec_depth": [
        11
      ],
      "skip": [
        5
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_open": [
        6
      ],
      "is_close": [
        10
      ],
      "new_max": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxDepth(string s) {\n    int depth = 0;\n    int maxDepth = 0;\n\n    foreach (char c in s) {\n        if (c == '(') {\n            depth++;\n            // Track the peak depth\n            maxDepth = Math.Max(maxDepth, depth);\n        } else if (c == ')') {\n            depth--;\n        }\n    }\n\n    return maxDepth;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_depth": [
        7
      ],
      "update_max": [
        9
      ],
      "check_close": [
        10
      ],
      "dec_depth": [
        11
      ],
      "skip": [
        5
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_open": [
        6
      ],
      "is_close": [
        10
      ],
      "new_max": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxDepth(s string) int {\n    depth := 0\n    maxD := 0\n\n    for _, c := range s {\n        if c == '(' {\n            depth++\n            // Track the peak depth\n            if depth > maxD {\n                maxD = depth\n            }\n        } else if c == ')' {\n            depth--\n        }\n    }\n\n    return maxD\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_depth": [
        7
      ],
      "update_max": [
        9
      ],
      "check_close": [
        12
      ],
      "dec_depth": [
        13
      ],
      "skip": [
        5
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_open": [
        6
      ],
      "is_close": [
        12
      ],
      "new_max": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxDepth(s) {\n    var depth = 0;\n    var maxD = 0;\n\n    for (var i = 0; i < s.length; i++) {\n        if (s[i] === '(') {\n            depth++;\n            // Track the peak depth\n            maxD = Math.max(maxD, depth);\n        } else if (s[i] === ')') {\n            depth--;\n        }\n    }\n\n    return maxD;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_depth": [
        7
      ],
      "update_max": [
        9
      ],
      "check_close": [
        10
      ],
      "dec_depth": [
        11
      ],
      "skip": [
        5
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_open": [
        6
      ],
      "is_close": [
        10
      ],
      "new_max": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxDepth(s: string): number {\n    let depth = 0;\n    let maxD = 0;\n\n    for (const c of s) {\n        if (c === '(') {\n            depth++;\n            // Track the peak depth\n            maxD = Math.max(maxD, depth);\n        } else if (c === ')') {\n            depth--;\n        }\n    }\n\n    return maxD;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_depth": [
        7
      ],
      "update_max": [
        9
      ],
      "check_close": [
        10
      ],
      "dec_depth": [
        11
      ],
      "skip": [
        5
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_open": [
        6
      ],
      "is_close": [
        10
      ],
      "new_max": [
        9
      ]
    }
  }
};

const MaximumNestingDepthOfTheParenthesesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (depth=3)",
    "value": {
      "s": "(1+(2*3)+((8)/4))+1"
    }
  },
  {
    "id": "ex2",
    "label": "Increasing depth",
    "value": {
      "s": "(1)+((2))+(((3)))"
    }
  },
  {
    "id": "ex3",
    "label": "Depth 1",
    "value": {
      "s": "1+(2*3)/(2-1)"
    }
  },
  {
    "id": "ex4",
    "label": "No parens",
    "value": {
      "s": "1"
    }
  }
];

function generateMaximumNestingDepthOfTheParenthesesSteps(e: any): any[] {
  

let t=e.s,a=t.split(""),n={};a.forEach((e,t)=>n[`char_${t}`]={type:"arrayElement",value:e,position:t});let r=new StepRecorder({s:t},n),l=(e,t)=>r.update_visual(`char_${e}`,{type:"arrayElement",value:a[e],position:e,state:t}),s=[],o=e=>{for(let e=0;e<=a.length;e++)r.delete_visual(`stack_${e}`);s.forEach((t,a)=>r.update_visual(`stack_${a}`,{type:"stackElement",value:t,position:a,state:e?.enteringTop&&a===s.length-1?"entering":void 0})),e?.exiting&&r.update_visual(`stack_${e.exiting.pos}`,{type:"stackElement",value:e.exiting.char,position:e.exiting.pos,state:"exiting"})};r.record("-","Start: track nesting depth with an explicit stack of open parens");let p=0;r.add_new_variable("maxDepth",0),r.record("init","stack = [], maxDepth = 0");for(let e=0;e<a.length;e++){let t=a[e];if(r.update_variable("i",e),r.update_variable("maxDepth",p),r.update_visual("curr",{type:"pointer",position:e,label:"i"}),o(),r.record("loop",`Read character at index ${e}: '${t}'`),"("===t)if(r.add_conditional("is_open",!0),s.push("("),l(e,"open"),o({enteringTop:!0}),r.record("push",`Push '(' onto the stack, its height is now ${s.length}`),s.length>p){let t=p;p=s.length,r.update_variable("maxDepth",p),r.update_variable("prevMax",t),l(e,"peak"),r.add_conditional("new_max",!0),r.record("update_max",`New record: maxDepth = max(${t}, ${s.length}) = ${p}`),r.delete_variable("prevMax")}else r.add_conditional("new_max",!1),r.record("update_max",`maxDepth stays max(${p}, ${s.length}) = ${p}`);else")"===t?(r.add_conditional("is_open",!1),r.add_conditional("is_close",!0),l(e,"close"),s.pop(),o({exiting:{char:"(",pos:s.length}}),r.record("pop",`Pop the matching '(', stack height is now ${s.length}`)):(r.add_conditional("is_open",!1),r.add_conditional("is_close",!1),l(e,"skip"),r.record("skip",`'${t}' is not a parenthesis, the stack is unchanged`))}r.delete_visual("curr");for(let e=0;e<=a.length;e++)r.delete_visual(`stack_${e}`);return r.update_variable("maxDepth",p),r.update_variable("result",p),r.record("complete",`Scan complete. The maximum nesting depth is ${p}`),r.getSteps()
}

export function MaximumNestingDepthOfTheParenthesesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumNestingDepthOfTheParenthesesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumNestingDepthOfTheParenthesesSteps(e) as any[];
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
      title="Maximum Nesting Depth of the Parentheses"
      slug="maximum-nesting-depth-of-the-parentheses"
      approaches={approaches}
      presets={MaximumNestingDepthOfTheParenthesesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Score From Removing Substrings (maximum-score-from-removing-substrings)
// ==========================================

const MaximumScoreFromRemovingSubstringsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maximumGain(self, s: str, x: int, y: int) -> int:\n        if x < y:\n            return self.solve(s, 'b', 'a', y, x)\n        return self.solve(s, 'a', 'b', x, y)\n\n    def solve(self, s: str, c1: str, c2: str, high_points: int, low_points: int) -> int:\n        score = 0\n        count1 = 0  # count of c1 waiting to be paired\n        count2 = 0  # count of c2 that couldn't pair with c1\n\n        for c in s:\n            if c == c1:\n                count1 += 1\n            elif c == c2:\n                if count1 > 0:\n                    # Form the high-value pair\n                    count1 -= 1\n                    score += high_points\n                else:\n                    # Can't form high-value pair, save for low-value\n                    count2 += 1\n            else:\n                # Non a/b character: resolve remaining pairs in this segment\n                score += min(count1, count2) * low_points\n                count1 = 0\n                count2 = 0\n\n        # Handle the last segment\n        score += min(count1, count2) * low_points\n        return score",
    "lineMap": {
      "-": [
        2
      ],
      "determine_priority": [
        3,
        4,
        5
      ],
      "initialize": [
        8,
        9,
        10
      ],
      "increment_c1": [
        13,
        14
      ],
      "form_high_pair": [
        16,
        17,
        18,
        19
      ],
      "save_for_low": [
        20,
        21,
        22
      ],
      "resolve_low_pairs": [
        23,
        24,
        25,
        26,
        27
      ],
      "final_segment": [
        29,
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "priority_check": [
        3
      ],
      "for_loop": [
        12
      ],
      "is_c1": [
        13
      ],
      "has_c1": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maximumGain(String s, int x, int y) {\n        // Ensure we always process the higher-value pair first\n        if (x < y) {\n            return solve(s, 'b', 'a', y, x);\n        }\n        return solve(s, 'a', 'b', x, y);\n    }\n\n    private int solve(String s, char c1, char c2, int highPoints, int lowPoints) {\n        int score = 0;\n        int count1 = 0; // count of c1 waiting to be paired\n        int count2 = 0; // count of c2 that couldn't pair with c1\n\n        for (char c : s.toCharArray()) {\n            if (c == c1) {\n                count1++;\n            } else if (c == c2) {\n                if (count1 > 0) {\n                    // Form the high-value pair\n                    count1--;\n                    score += highPoints;\n                } else {\n                    // Can't form high-value pair, save for low-value\n                    count2++;\n                }\n            } else {\n                // Non a/b character: resolve remaining pairs in this segment\n                score += Math.min(count1, count2) * lowPoints;\n                count1 = 0;\n                count2 = 0;\n            }\n        }\n        // Handle the last segment\n        score += Math.min(count1, count2) * lowPoints;\n\n        return score;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "determine_priority": [
        3,
        4,
        5,
        6,
        7
      ],
      "initialize": [
        11,
        12,
        13
      ],
      "increment_c1": [
        16,
        17
      ],
      "form_high_pair": [
        19,
        20,
        21,
        22
      ],
      "save_for_low": [
        23,
        24,
        25
      ],
      "resolve_low_pairs": [
        27,
        28,
        29,
        30,
        31
      ],
      "final_segment": [
        34,
        35
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "priority_check": [
        4
      ],
      "for_loop": [
        15
      ],
      "is_c1": [
        16
      ],
      "has_c1": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maximumGain(string s, int x, int y) {\n        if (x < y) {\n            return solve(s, 'b', 'a', y, x);\n        }\n        return solve(s, 'a', 'b', x, y);\n    }\n\nprivate:\n    int solve(const string& s, char c1, char c2, int highPoints, int lowPoints) {\n        int score = 0;\n        int count1 = 0; // count of c1 waiting to be paired\n        int count2 = 0; // count of c2 that couldn't pair with c1\n\n        for (char c : s) {\n            if (c == c1) {\n                count1++;\n            } else if (c == c2) {\n                if (count1 > 0) {\n                    count1--;\n                    score += highPoints;\n                } else {\n                    count2++;\n                }\n            } else {\n                score += min(count1, count2) * lowPoints;\n                count1 = 0;\n                count2 = 0;\n            }\n        }\n        score += min(count1, count2) * lowPoints;\n        return score;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "determine_priority": [
        4,
        5,
        6,
        7
      ],
      "initialize": [
        12,
        13,
        14
      ],
      "increment_c1": [
        17,
        18
      ],
      "form_high_pair": [
        20,
        21,
        22
      ],
      "save_for_low": [
        23,
        24
      ],
      "resolve_low_pairs": [
        26,
        27,
        28,
        29
      ],
      "final_segment": [
        32
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "priority_check": [
        4
      ],
      "for_loop": [
        16
      ],
      "is_c1": [
        17
      ],
      "has_c1": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaximumGain(string s, int x, int y) {\n        if (x < y) {\n            return Solve(s, 'b', 'a', y, x);\n        }\n        return Solve(s, 'a', 'b', x, y);\n    }\n\n    private int Solve(string s, char c1, char c2, int highPoints, int lowPoints) {\n        int score = 0;\n        int count1 = 0; // count of c1 waiting to be paired\n        int count2 = 0; // count of c2 that couldn't pair with c1\n\n        foreach (char c in s) {\n            if (c == c1) {\n                count1++;\n            } else if (c == c2) {\n                if (count1 > 0) {\n                    count1--;\n                    score += highPoints;\n                } else {\n                    count2++;\n                }\n            } else {\n                score += Math.Min(count1, count2) * lowPoints;\n                count1 = 0;\n                count2 = 0;\n            }\n        }\n        score += Math.Min(count1, count2) * lowPoints;\n        return score;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "determine_priority": [
        3,
        4,
        5,
        6
      ],
      "initialize": [
        10,
        11,
        12
      ],
      "increment_c1": [
        15,
        16
      ],
      "form_high_pair": [
        18,
        19,
        20
      ],
      "save_for_low": [
        21,
        22
      ],
      "resolve_low_pairs": [
        24,
        25,
        26,
        27
      ],
      "final_segment": [
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "priority_check": [
        3
      ],
      "for_loop": [
        14
      ],
      "is_c1": [
        15
      ],
      "has_c1": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maximumGain(s string, x int, y int) int {\n    if x < y {\n        return solve(s, 'b', 'a', y, x)\n    }\n    return solve(s, 'a', 'b', x, y)\n}\n\nfunc solve(s string, c1 byte, c2 byte, highPoints int, lowPoints int) int {\n    score := 0\n    count1 := 0 // count of c1 waiting to be paired\n    count2 := 0 // count of c2 that couldn't pair with c1\n\n    for i := 0; i < len(s); i++ {\n        c := s[i]\n        if c == c1 {\n            count1++\n        } else if c == c2 {\n            if count1 > 0 {\n                count1--\n                score += highPoints\n            } else {\n                count2++\n            }\n        } else {\n            if count1 < count2 {\n                score += count1 * lowPoints\n            } else {\n                score += count2 * lowPoints\n            }\n            count1 = 0\n            count2 = 0\n        }\n    }\n    if count1 < count2 {\n        score += count1 * lowPoints\n    } else {\n        score += count2 * lowPoints\n    }\n    return score\n}",
    "lineMap": {
      "-": [
        1
      ],
      "determine_priority": [
        2,
        3,
        4,
        5
      ],
      "initialize": [
        9,
        10,
        11
      ],
      "increment_c1": [
        15,
        16
      ],
      "form_high_pair": [
        18,
        19,
        20
      ],
      "save_for_low": [
        21,
        22
      ],
      "resolve_low_pairs": [
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31
      ],
      "final_segment": [
        34,
        35,
        36,
        37,
        38
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "priority_check": [
        2
      ],
      "for_loop": [
        13
      ],
      "is_c1": [
        15
      ],
      "has_c1": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maximumGain = function (s, x, y) {\n  if (x < y) {\n    return solve(s, \"b\", \"a\", y, x);\n  }\n  return solve(s, \"a\", \"b\", x, y);\n};\n\nfunction solve(s, c1, c2, highPoints, lowPoints) {\n  var score = 0;\n  var count1 = 0; // count of c1 waiting to be paired\n  var count2 = 0; // count of c2 that couldn't pair with c1\n\n  for (var i = 0; i < s.length; i++) {\n    var c = s[i];\n    if (c === c1) {\n      count1++;\n    } else if (c === c2) {\n      if (count1 > 0) {\n        count1--;\n        score += highPoints;\n      } else {\n        count2++;\n      }\n    } else {\n      score += Math.min(count1, count2) * lowPoints;\n      count1 = 0;\n      count2 = 0;\n    }\n  }\n  score += Math.min(count1, count2) * lowPoints;\n  return score;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "determine_priority": [
        2,
        3,
        4,
        5
      ],
      "initialize": [
        9,
        10,
        11
      ],
      "increment_c1": [
        15,
        16
      ],
      "form_high_pair": [
        18,
        19,
        20
      ],
      "save_for_low": [
        21,
        22
      ],
      "resolve_low_pairs": [
        24,
        25,
        26,
        27
      ],
      "final_segment": [
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "priority_check": [
        2
      ],
      "for_loop": [
        13
      ],
      "is_c1": [
        15
      ],
      "has_c1": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maximumGain(s: string, x: number, y: number): number {\n    if (x < y) {\n        return solve(s, \"b\", \"a\", y, x);\n    }\n    return solve(s, \"a\", \"b\", x, y);\n}\n\nfunction solve(s: string, c1: string, c2: string, highPoints: number, lowPoints: number): number {\n    let score = 0;\n    let count1 = 0; // count of c1 waiting to be paired\n    let count2 = 0; // count of c2 that couldn't pair with c1\n\n    for (const c of s) {\n        if (c === c1) {\n            count1++;\n        } else if (c === c2) {\n            if (count1 > 0) {\n                count1--;\n                score += highPoints;\n            } else {\n                count2++;\n            }\n        } else {\n            score += Math.min(count1, count2) * lowPoints;\n            count1 = 0;\n            count2 = 0;\n        }\n    }\n    score += Math.min(count1, count2) * lowPoints;\n    return score;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "determine_priority": [
        2,
        3,
        4,
        5
      ],
      "initialize": [
        9,
        10,
        11
      ],
      "increment_c1": [
        14,
        15
      ],
      "form_high_pair": [
        17,
        18,
        19
      ],
      "save_for_low": [
        20,
        21
      ],
      "resolve_low_pairs": [
        23,
        24,
        25,
        26
      ],
      "final_segment": [
        29
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "priority_check": [
        2
      ],
      "for_loop": [
        13
      ],
      "is_c1": [
        14
      ],
      "has_c1": [
        17
      ]
    }
  }
};

const MaximumScoreFromRemovingSubstringsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "cdbcbbaaabab",
      "x": 4,
      "y": 5
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "aabbaaxybbaabb",
      "x": 5,
      "y": 4
    }
  },
  {
    "id": "ex3",
    "label": "Small ab",
    "value": {
      "s": "abab",
      "x": 3,
      "y": 2
    }
  },
  {
    "id": "ex4",
    "label": "Small ba",
    "value": {
      "s": "baba",
      "x": 2,
      "y": 5
    }
  }
];

function generateMaximumScoreFromRemovingSubstringsSteps(e: any): any[] {
  

let t=e.s,i=e.x,r=e.y,s=t.split("").reduce((e,t,i)=>(e[`char_${i}`]={type:"arrayElement",value:t,position:i},e),{}),o=new StepRecorder({s:t,x:i,y:r},s);o.update_variable("mode","stack"),o.record("-",`Start: one stack pass strips "ab" (+${i}) or "ba" (+${r}), whichever pays more, then a second pass takes the rest.`);let n=i>=r,c=n?"a":"b",l=n?"b":"a",p=Math.max(i,r),h=Math.min(i,r);o.add_conditional("priority_check",!n),o.add_new_variable("c1",c),o.add_new_variable("c2",l),o.add_new_variable("highPoints",p),o.add_new_variable("lowPoints",h),o.record("determine_priority",n?`x (${i}) >= y (${r}): the first pass hunts "${c}${l}" for ${p} pts each.`:`x (${i}) < y (${r}): the first pass hunts "${c}${l}" for ${p} pts each.`);let u=0,d=[],_=[];o.add_new_variable("score",u),o.add_new_variable("pairedHigh",d),o.add_new_variable("pairedLow",_),o.add_new_variable("stack",[]);let m=(e,i,a,r,s,n)=>{let c=[];for(let l of(o.update_variable("stack",[]),o.update_variable("pair",`${a}${r}`),o.update_variable("passPoints",s),o.record(e.start,`Sweep left to right with an empty stack, closing every "${a}${r}" it forms.`),i)){let i=t[l],p=c.length>0?c[c.length-1]:-1,h=-1!==p&&t[p]===a&&i===r;o.update_visual("ptr_i",{type:"pointer",position:l,label:"i"}),o.update_variable("i",l),o.update_variable("ch",i),o.add_conditional(e.cond,h),o.record(e.check,h?`The stack top is '${a}' and this is '${r}', so they close a "${a}${r}".`:-1===p?`The stack is empty, so '${i}' has nothing to pair with.`:`The stack top is '${t[p]}', which does not pair with '${i}'.`),h?(c.pop(),n.push([p,l]),u+=s,o.update_variable("stack",[...c]),o.update_variable("score",u),o.update_variable("pairedHigh",d),o.update_variable("pairedLow",_),o.update_variable("pairFrom",p),o.update_variable("pairTo",l),o.record(e.pop,`Pop the '${a}' and drop this '${r}': score + ${s} = ${u}.`),o.delete_variable("pairFrom"),o.delete_variable("pairTo")):(c.push(l),o.update_variable("stack",[...c]),o.record(e.push,`Push '${i}' onto the stack, which now holds ${c.length}.`))}return c},f=m({start:"start_high_pass",check:"high_check",pop:"high_pop",push:"high_push",cond:"high_match"},t.split("").map((e,t)=>t),c,l,p,d);return m({start:"start_low_pass",check:"low_check",pop:"low_pop",push:"low_push",cond:"low_match"},f,l,c,h,_),o.delete_visual("ptr_i"),o.update_variable("stack",[]),o.add_new_variable("result",u),o.record("complete",`Return score = ${u}`),o.getSteps()
}

export function MaximumScoreFromRemovingSubstringsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumScoreFromRemovingSubstringsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumScoreFromRemovingSubstringsSteps(e) as any[];
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
      title="Maximum Score From Removing Substrings"
      slug="maximum-score-from-removing-substrings"
      approaches={approaches}
      presets={MaximumScoreFromRemovingSubstringsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Width Ramp (maximum-width-ramp)
// ==========================================

const MaximumWidthRampTemplates = {
  "python": {
    "language": "python",
    "code": "def maxWidthRamp(nums):\n    n = len(nums)\n    stack = []\n\n    for i in range(n):\n        if not stack or nums[i] < nums[stack[-1]]:\n            stack.append(i)\n\n    maxWidth = 0\n    for j in range(n - 1, -1, -1):\n        while stack and nums[j] >= nums[stack[-1]]:\n            maxWidth = max(maxWidth, j - stack.pop())\n\n    return maxWidth",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "build_stack_check": [
        5,
        6
      ],
      "build_stack_push": [
        7
      ],
      "build_stack_skip": [
        6
      ],
      "phase2_start": [
        9
      ],
      "scan_right": [
        10
      ],
      "found_ramp": [
        11,
        12
      ],
      "update_max": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "should_push": [
        6
      ],
      "is_valid_ramp": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxWidthRamp(int[] nums) {\n    int n = nums.length;\n    Deque<Integer> stack = new ArrayDeque<>();\n\n    for (int i = 0; i < n; i++) {\n        if (stack.isEmpty() || nums[i] < nums[stack.peek()]) {\n            stack.push(i);\n        }\n    }\n\n    int maxWidth = 0;\n    for (int j = n - 1; j >= 0; j--) {\n        while (!stack.isEmpty() && nums[j] >= nums[stack.peek()]) {\n            maxWidth = Math.max(maxWidth, j - stack.pop());\n        }\n    }\n\n    return maxWidth;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "build_stack_check": [
        5,
        6
      ],
      "build_stack_push": [
        7
      ],
      "build_stack_skip": [
        6
      ],
      "phase2_start": [
        11
      ],
      "scan_right": [
        12
      ],
      "found_ramp": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_push": [
        6
      ],
      "is_valid_ramp": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxWidthRamp(vector<int>& nums) {\n    int n = nums.size();\n    stack<int> stk;\n\n    for (int i = 0; i < n; i++) {\n        if (stk.empty() || nums[i] < nums[stk.top()]) {\n            stk.push(i);\n        }\n    }\n\n    int maxWidth = 0;\n    for (int j = n - 1; j >= 0; j--) {\n        while (!stk.empty() && nums[j] >= nums[stk.top()]) {\n            maxWidth = max(maxWidth, j - stk.top());\n            stk.pop();\n        }\n    }\n\n    return maxWidth;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "build_stack_check": [
        5,
        6
      ],
      "build_stack_push": [
        7
      ],
      "build_stack_skip": [
        6
      ],
      "phase2_start": [
        11
      ],
      "scan_right": [
        12
      ],
      "found_ramp": [
        13,
        14
      ],
      "update_max": [
        14,
        15
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "should_push": [
        6
      ],
      "is_valid_ramp": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxWidthRamp(int[] nums) {\n    int n = nums.Length;\n    Stack<int> stack = new Stack<int>();\n\n    for (int i = 0; i < n; i++) {\n        if (stack.Count == 0 || nums[i] < nums[stack.Peek()]) {\n            stack.Push(i);\n        }\n    }\n\n    int maxWidth = 0;\n    for (int j = n - 1; j >= 0; j--) {\n        while (stack.Count > 0 && nums[j] >= nums[stack.Peek()]) {\n            maxWidth = Math.Max(maxWidth, j - stack.Pop());\n        }\n    }\n\n    return maxWidth;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "build_stack_check": [
        5,
        6
      ],
      "build_stack_push": [
        7
      ],
      "build_stack_skip": [
        6
      ],
      "phase2_start": [
        11
      ],
      "scan_right": [
        12
      ],
      "found_ramp": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_push": [
        6
      ],
      "is_valid_ramp": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxWidthRamp(nums []int) int {\n    n := len(nums)\n    stack := []int{}\n\n    for i := 0; i < n; i++ {\n        if len(stack) == 0 || nums[i] < nums[stack[len(stack)-1]] {\n            stack = append(stack, i)\n        }\n    }\n\n    maxWidth := 0\n    for j := n - 1; j >= 0; j-- {\n        for len(stack) > 0 && nums[j] >= nums[stack[len(stack)-1]] {\n            top := stack[len(stack)-1]\n            stack = stack[:len(stack)-1]\n            if j-top > maxWidth {\n                maxWidth = j - top\n            }\n        }\n    }\n\n    return maxWidth\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "build_stack_check": [
        5,
        6
      ],
      "build_stack_push": [
        7
      ],
      "build_stack_skip": [
        6
      ],
      "phase2_start": [
        11
      ],
      "scan_right": [
        12
      ],
      "found_ramp": [
        13,
        14,
        15
      ],
      "update_max": [
        16,
        17
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "should_push": [
        6
      ],
      "is_valid_ramp": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxWidthRamp(nums) {\n    const n = nums.length;\n    const stack = [];\n\n    for (let i = 0; i < n; i++) {\n        if (stack.length === 0 || nums[i] < nums[stack[stack.length - 1]]) {\n            stack.push(i);\n        }\n    }\n\n    let maxWidth = 0;\n    for (let j = n - 1; j >= 0; j--) {\n        while (stack.length > 0 && nums[j] >= nums[stack[stack.length - 1]]) {\n            maxWidth = Math.max(maxWidth, j - stack.pop());\n        }\n    }\n\n    return maxWidth;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "build_stack_check": [
        5,
        6
      ],
      "build_stack_push": [
        7
      ],
      "build_stack_skip": [
        6
      ],
      "phase2_start": [
        11
      ],
      "scan_right": [
        12
      ],
      "found_ramp": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_push": [
        6
      ],
      "is_valid_ramp": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxWidthRamp(nums: number[]): number {\n    const n = nums.length;\n    const stack: number[] = [];\n\n    for (let i = 0; i < n; i++) {\n        if (stack.length === 0 || nums[i] < nums[stack[stack.length - 1]]) {\n            stack.push(i);\n        }\n    }\n\n    let maxWidth = 0;\n    for (let j = n - 1; j >= 0; j--) {\n        while (stack.length > 0 && nums[j] >= nums[stack[stack.length - 1]]) {\n            maxWidth = Math.max(maxWidth, j - stack.pop()!);\n        }\n    }\n\n    return maxWidth;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "build_stack_check": [
        5,
        6
      ],
      "build_stack_push": [
        7
      ],
      "build_stack_skip": [
        6
      ],
      "phase2_start": [
        11
      ],
      "scan_right": [
        12
      ],
      "found_ramp": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_push": [
        6
      ],
      "is_valid_ramp": [
        13
      ]
    }
  }
};

const MaximumWidthRampPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        6,
        0,
        8,
        2,
        1,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        9,
        8,
        1,
        0,
        1,
        9,
        4,
        0,
        4,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        2,
        4,
        1,
        3
      ]
    }
  }
];

function generateMaximumWidthRampSteps(e: any): any[] {
  

let t=e.nums,i=t.length,a=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=[],r=0,s=-1,d=-1,o=new StepRecorder({nums:t},{...a});o.update_variable("nums",[...t]),o.record("-","Start of algorithm"),o.update_variable("stack",[...l]),o.update_variable("stackIdxs",[...l]),o.update_variable("maxWidth",0),o.update_variable("phase",1),o.record("initialize","Phase 1: build a strictly-decreasing stack of candidate left endpoints");for(let e=0;e<i;e++){o.update_variable("i",e),o.update_variable("num",t[e]),o.update_variable("stackIdxs",[...l]),o.update_variable("phase",1);let i=0===l.length||t[e]<t[l[l.length-1]];o.add_conditional("should_push",i),o.record("build_stack_check",`Index ${e} (value ${t[e]}): ${i?"smaller than the stack top":"not smaller, skip"}`),i?(l.push(e),o.update_variable("stackIdxs",[...l]),o.record("build_stack_push",`Push index ${e} — a candidate left endpoint`)):o.record("build_stack_skip",`Skip index ${e} — a later index already has a smaller value`)}o.delete_variable("i"),o.update_variable("phase",2),o.update_variable("stackIdxs",[...l]),o.record("phase2_start","Phase 2: scan right to left, popping valid left endpoints to measure ramps");for(let e=i-1;e>=0;e--){for(o.update_variable("j",e),o.update_variable("num",t[e]),o.update_variable("stackIdxs",[...l]),o.update_variable("phase",2),o.record("scan_right",`Scan j = ${e} (value ${t[e]})`);l.length>0&&t[e]>=t[l[l.length-1]];){let i=l.pop(),n=e-i;o.add_conditional("is_valid_ramp",!0),o.update_variable("poppedIdx",i),o.update_variable("width",n),o.update_variable("stackIdxs",[...l]),o.record("found_ramp",`Ramp nums[${i}]=${t[i]} <= nums[${e}]=${t[e]}, width = ${e} - ${i} = ${n}`),n>r&&(r=n,s=i,d=e),o.update_variable("maxWidth",r),o.update_variable("bestI",s),o.update_variable("bestJ",d),o.record("update_max",`maxWidth = max(maxWidth, ${n}) = ${r}`)}l.length>0&&t[e]<t[l[l.length-1]]&&o.add_conditional("is_valid_ramp",!1)}return o.delete_variable("j"),o.delete_variable("poppedIdx"),o.update_variable("phase",3),o.record("complete",`Done. Maximum width ramp = ${r}`),o.getSteps()
}

export function MaximumWidthRampProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumWidthRampTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumWidthRampSteps(e) as any[];
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
      title="Maximum Width Ramp"
      slug="maximum-width-ramp"
      approaches={approaches}
      presets={MaximumWidthRampPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Min Stack (min-stack)
// ==========================================

const MinStackTemplates = {
  "python": {
    "language": "python",
    "code": "class MinStack:\n    def __init__(self):\n        # Each entry stores (value, current_minimum)\n        self.stack = []\n\n    def push(self, val: int) -> None:\n        # Compute the minimum at this level\n        current_min = val if not self.stack else min(val, self.stack[-1][1])\n        self.stack.append((val, current_min))\n\n    def pop(self) -> None:\n        self.stack.pop()\n\n    def top(self) -> int:\n        return self.stack[-1][0]\n\n    def getMin(self) -> int:\n        return self.stack[-1][1]",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        4
      ],
      "read_op": [
        1
      ],
      "push": [
        6,
        8,
        9
      ],
      "pop": [
        12
      ],
      "top": [
        15
      ],
      "get_min": [
        18
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class MinStack {\n    // Each entry stores [value, currentMinimum]\n    Stack<int[]> stack;\n\n    public MinStack() {\n        stack = new Stack<>();\n    }\n\n    public void push(int val) {\n        // Compute the minimum at this level\n        int currentMin = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);\n        stack.push(new int[]{val, currentMin});\n    }\n\n    public void pop() {\n        stack.pop();\n    }\n\n    public int top() {\n        return stack.peek()[0];\n    }\n\n    public int getMin() {\n        return stack.peek()[1];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "read_op": [
        1
      ],
      "push": [
        9,
        11,
        12
      ],
      "pop": [
        16
      ],
      "top": [
        20
      ],
      "get_min": [
        24
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class MinStack {\n    // Each entry stores {value, currentMinimum}\n    vector<pair<int, int>> stack;\n\npublic:\n    MinStack() {}\n\n    void push(int val) {\n        // Compute the minimum at this level\n        int currentMin = stack.empty() ? val : min(val, stack.back().second);\n        stack.push_back({val, currentMin});\n    }\n\n    void pop() {\n        stack.pop_back();\n    }\n\n    int top() {\n        return stack.back().first;\n    }\n\n    int getMin() {\n        return stack.back().second;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "read_op": [
        1
      ],
      "push": [
        8,
        10,
        11
      ],
      "pop": [
        15
      ],
      "top": [
        19
      ],
      "get_min": [
        23
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MinStack {\n    // Each entry stores (value, currentMinimum)\n    Stack<(int val, int min)> stack;\n\n    public MinStack() {\n        stack = new Stack<(int, int)>();\n    }\n\n    public void Push(int val) {\n        // Compute the minimum at this level\n        int currentMin = stack.Count == 0 ? val : Math.Min(val, stack.Peek().min);\n        stack.Push((val, currentMin));\n    }\n\n    public void Pop() {\n        stack.Pop();\n    }\n\n    public int Top() {\n        return stack.Peek().val;\n    }\n\n    public int GetMin() {\n        return stack.Peek().min;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "read_op": [
        1
      ],
      "push": [
        9,
        11,
        12
      ],
      "pop": [
        16
      ],
      "top": [
        20
      ],
      "get_min": [
        24
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "type pair struct {\n    val int\n    min int\n}\n\ntype MinStack struct {\n    // Each entry stores {value, currentMinimum}\n    stack []pair\n}\n\nfunc Constructor() MinStack {\n    return MinStack{stack: []pair{}}\n}\n\nfunc (s *MinStack) Push(val int) {\n    // Compute the minimum at this level\n    currentMin := val\n    if len(s.stack) > 0 && s.stack[len(s.stack)-1].min < val {\n        currentMin = s.stack[len(s.stack)-1].min\n    }\n    s.stack = append(s.stack, pair{val, currentMin})\n}\n\nfunc (s *MinStack) Pop() {\n    s.stack = s.stack[:len(s.stack)-1]\n}\n\nfunc (s *MinStack) Top() int {\n    return s.stack[len(s.stack)-1].val\n}\n\nfunc (s *MinStack) GetMin() int {\n    return s.stack[len(s.stack)-1].min\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        8
      ],
      "read_op": [
        1
      ],
      "push": [
        15,
        17,
        18,
        19,
        20
      ],
      "pop": [
        24,
        25,
        26
      ],
      "top": [
        29
      ],
      "get_min": [
        33
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "function MinStack() {\n  // Each entry stores [value, currentMinimum]\n  this.stack = [];\n};\n\nMinStack.prototype.push = function (val) {\n  // Compute the minimum at this level\n  var currentMin = this.stack.length === 0 ? val : Math.min(val, this.stack[this.stack.length - 1][1]);\n  this.stack.push([val, currentMin]);\n};\n\nMinStack.prototype.pop = function () {\n  this.stack.pop();\n};\n\nMinStack.prototype.top = function () {\n  return this.stack[this.stack.length - 1][0];\n};\n\nMinStack.prototype.getMin = function () {\n  return this.stack[this.stack.length - 1][1];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "read_op": [
        1
      ],
      "push": [
        6,
        8,
        9
      ],
      "pop": [
        13
      ],
      "top": [
        17
      ],
      "get_min": [
        21
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "class MinStack {\n    // Each entry stores [value, currentMinimum]\n    private stack: [number, number][];\n\n    constructor() {\n        this.stack = [];\n    }\n\n    push(val: number): void {\n        // Compute the minimum at this level\n        const currentMin = this.stack.length === 0 ? val : Math.min(val, this.stack[this.stack.length - 1][1]);\n        this.stack.push([val, currentMin]);\n    }\n\n    pop(): void {\n        this.stack.pop();\n    }\n\n    top(): number {\n        return this.stack[this.stack.length - 1][0];\n    }\n\n    getMin(): number {\n        return this.stack[this.stack.length - 1][1];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "read_op": [
        1
      ],
      "push": [
        9,
        11,
        12
      ],
      "pop": [
        16
      ],
      "top": [
        20
      ],
      "get_min": [
        24
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  }
};

const MinStackPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "LeetCode Example",
    "value": {
      "operations": [
        "push -2",
        "push 0",
        "push -3",
        "getMin",
        "pop",
        "top",
        "getMin"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Mixed Ops",
    "value": {
      "operations": [
        "push 5",
        "push 3",
        "push 7",
        "getMin",
        "pop",
        "getMin",
        "push 1",
        "getMin"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Push & Top",
    "value": {
      "operations": [
        "push 1",
        "push 2",
        "push 3",
        "top",
        "pop",
        "top"
      ]
    }
  }
];

function generateMinStackSteps(t: any): any[] {
  

let e=t.operations,i=[],a=new StepRecorder({},{}),s=(t,n)=>{e.forEach((e,i)=>{a.update_visual(`op_${i}`,{type:"arrayElement",value:e,position:i,state:i===t?"active":i<t?"done":void 0})});for(let t=0;t<=e.length+1;t++)a.delete_visual(`stack_${t}`);i.forEach(([t,e],s)=>{a.update_visual(`stack_${s}`,{type:"stackElement",value:`${t}, ${e}`,position:s,state:n?.entering&&s===i.length-1?"entering":void 0})}),n?.exiting&&a.update_visual(`stack_${n.exiting.pos}`,{type:"stackElement",value:`${n.exiting.val}, ${n.exiting.min}`,position:n.exiting.pos,state:"exiting"}),a.update_variable("topPos",i.length-1)},l=()=>{a.delete_variable("result"),a.delete_variable("queryKind"),a.delete_variable("pushVal"),a.delete_variable("prevMin"),a.delete_variable("newMin")};e.forEach((t,e)=>{a.update_visual(`op_${e}`,{type:"arrayElement",value:t,position:e})}),a.record("-","MinStack: each entry stores [value, currentMin] so getMin is O(1)"),a.record("init","Initialize an empty stack. Each entry will store (value, currentMin).");for(let t=0;t<e.length;t++){let n=e[t];l(),a.update_variable("op",n),a.update_variable("opIdx",t),a.update_visual("curr",{type:"pointer",position:t,label:"i"}),s(t),a.record("read_op",`Read operation: "${n}"`);let r=n.match(/^push\s+(-?\d+)$/),o="pop"===n,c="top"===n,p="getMin"===n;if(r){let e=parseInt(r[1],10),n=0===i.length?null:i[i.length-1][1],l=null===n?e:Math.min(e,n);i.push([e,l]),a.update_variable("pushVal",e),null!==n&&a.update_variable("prevMin",n),a.update_variable("newMin",l),s(t,{entering:!0}),a.record("push",null===n?`Stack empty, so min = ${e}. Push (${e}, ${l}).`:`min = min(${e}, ${n}) = ${l}. Push (${e}, ${l}).`)}else if(o)if(i.length>0){let e=i.length-1,[n,l]=i[e];i.pop(),s(t,{exiting:{val:n,min:l,pos:e}}),a.record("pop",`Pop (${n}, ${l}) off the top of the stack`)}else s(t),a.record("pop","Stack is empty, nothing to pop");else if(c)if(i.length>0){let[e]=i[i.length-1];a.update_variable("result",e),a.update_variable("queryKind","top"),s(t),a.record("top",`top() returns the top value = ${e}`)}else s(t),a.record("top","Stack is empty");else if(p)if(i.length>0){let[,e]=i[i.length-1];a.update_variable("result",e),a.update_variable("queryKind","getMin"),s(t),a.record("get_min",`getMin() reads the top's stored min = ${e}, in O(1)`)}else s(t),a.record("get_min","Stack is empty")}return l(),a.delete_variable("op"),a.delete_variable("opIdx"),a.delete_visual("curr"),e.forEach((t,e)=>{a.update_visual(`op_${e}`,{type:"arrayElement",value:t,position:e,state:"done"})}),a.record("complete","All operations complete"),a.getSteps()
}

export function MinStackProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinStackTemplates,
      generateSteps: (t: any) => {
        const recorded = generateMinStackSteps(t) as any[];
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
      title="Min Stack"
      slug="min-stack"
      approaches={approaches}
      presets={MinStackPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Add to Make Parentheses Valid (minimum-add-to-make-parentheses-valid)
// ==========================================

const MinimumAddToMakeParenthesesValidTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def minAddToMakeValid(self, s: str) -> int:\n        unmatched_open = 0\n        unmatched_close = 0\n\n        for c in s:\n            if c == '(':\n                unmatched_open += 1\n            else:\n                # Match with an unmatched '(' if available\n                if unmatched_open > 0:\n                    unmatched_open -= 1\n                else:\n                    unmatched_close += 1\n\n        return unmatched_open + unmatched_close",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4
      ],
      "loop": [
        6
      ],
      "inc_open": [
        8
      ],
      "dec_open": [
        12
      ],
      "inc_close": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_open": [
        7
      ],
      "has_open": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int minAddToMakeValid(String s) {\n        int unmatchedOpen = 0;\n        int unmatchedClose = 0;\n\n        for (char c : s.toCharArray()) {\n            if (c == '(') {\n                unmatchedOpen++;\n            } else {\n                // Match with an unmatched '(' if available\n                if (unmatchedOpen > 0) {\n                    unmatchedOpen--;\n                } else {\n                    unmatchedClose++;\n                }\n            }\n        }\n\n        return unmatchedOpen + unmatchedClose;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4
      ],
      "loop": [
        6
      ],
      "inc_open": [
        8
      ],
      "dec_open": [
        12
      ],
      "inc_close": [
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_open": [
        7
      ],
      "has_open": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int minAddToMakeValid(string s) {\n        int unmatchedOpen = 0;\n        int unmatchedClose = 0;\n\n        for (char c : s) {\n            if (c == '(') {\n                unmatchedOpen++;\n            } else {\n                // Match with an unmatched '(' if available\n                if (unmatchedOpen > 0) {\n                    unmatchedOpen--;\n                } else {\n                    unmatchedClose++;\n                }\n            }\n        }\n\n        return unmatchedOpen + unmatchedClose;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "init": [
        4,
        5
      ],
      "loop": [
        7
      ],
      "inc_open": [
        9
      ],
      "dec_open": [
        13
      ],
      "inc_close": [
        15
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "is_open": [
        8
      ],
      "has_open": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MinAddToMakeValid(string s) {\n        int unmatchedOpen = 0;\n        int unmatchedClose = 0;\n\n        foreach (char c in s) {\n            if (c == '(') {\n                unmatchedOpen++;\n            } else {\n                // Match with an unmatched '(' if available\n                if (unmatchedOpen > 0) {\n                    unmatchedOpen--;\n                } else {\n                    unmatchedClose++;\n                }\n            }\n        }\n\n        return unmatchedOpen + unmatchedClose;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4
      ],
      "loop": [
        6
      ],
      "inc_open": [
        8
      ],
      "dec_open": [
        12
      ],
      "inc_close": [
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "is_open": [
        7
      ],
      "has_open": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minAddToMakeValid(s string) int {\n    unmatchedOpen := 0\n    unmatchedClose := 0\n\n    for i := 0; i < len(s); i++ {\n        if s[i] == '(' {\n            unmatchedOpen++\n        } else {\n            // Match with an unmatched '(' if available\n            if unmatchedOpen > 0 {\n                unmatchedOpen--\n            } else {\n                unmatchedClose++\n            }\n        }\n    }\n\n    return unmatchedOpen + unmatchedClose\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "inc_open": [
        7
      ],
      "dec_open": [
        11
      ],
      "inc_close": [
        13
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "is_open": [
        6
      ],
      "has_open": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var minAddToMakeValid = function (s) {\n  var unmatchedOpen = 0;\n  var unmatchedClose = 0;\n\n  for (var i = 0; i < s.length; i++) {\n    if (s[i] === \"(\") {\n      unmatchedOpen++;\n    } else {\n      // Match with an unmatched '(' if available\n      if (unmatchedOpen > 0) {\n        unmatchedOpen--;\n      } else {\n        unmatchedClose++;\n      }\n    }\n  }\n\n  return unmatchedOpen + unmatchedClose;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "inc_open": [
        7
      ],
      "dec_open": [
        11
      ],
      "inc_close": [
        13
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "is_open": [
        6
      ],
      "has_open": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minAddToMakeValid(s: string): number {\n    let unmatchedOpen = 0;\n    let unmatchedClose = 0;\n\n    for (const c of s) {\n        if (c === '(') {\n            unmatchedOpen++;\n        } else {\n            // Match with an unmatched '(' if available\n            if (unmatchedOpen > 0) {\n                unmatchedOpen--;\n            } else {\n                unmatchedClose++;\n            }\n        }\n    }\n\n    return unmatchedOpen + unmatchedClose;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "inc_open": [
        7
      ],
      "dec_open": [
        11
      ],
      "inc_close": [
        13
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "is_open": [
        6
      ],
      "has_open": [
        10
      ]
    }
  }
};

const MinimumAddToMakeParenthesesValidPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "())"
    }
  },
  {
    "id": "ex2",
    "label": "All open",
    "value": {
      "s": "((("
    }
  },
  {
    "id": "ex3",
    "label": "Balanced",
    "value": {
      "s": "(())()"
    }
  },
  {
    "id": "ex4",
    "label": "Mixed",
    "value": {
      "s": "()))(("
    }
  }
];

function generateMinimumAddToMakeParenthesesValidSteps(e: any): any[] {
  

let t=e.s.split(""),a=t.length,n={};for(let e=0;e<a;e++)n[`bar_${e}`]={type:"arrayElement",value:t[e],position:e};let o=new StepRecorder({},{...n,meta_open:{type:"metadata",value:"unmatchedOpen = 0"},meta_close:{type:"metadata",value:"unmatchedClose = 0"}});o.record("-","Start: Count minimum additions to make parentheses valid");let l=0,s=0,c=Array(a).fill(!1),r=[];o.update_visual("meta_open",{type:"metadata",value:`unmatchedOpen = ${l}`}),o.update_visual("meta_close",{type:"metadata",value:`unmatchedClose = ${s}`}),o.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),o.record("init","Initialize unmatchedOpen = 0, unmatchedClose = 0");for(let e=0;e<a;e++){let a=t[e];if(o.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),o.update_visual(`bar_${e}`,{type:"arrayElement",value:a,position:e,state:"highlight"}),o.add_conditional("for_loop",!0),o.record("loop",`Processing character s[${e}] = '${a}'`),"("===a)o.add_conditional("is_open",!0),l++,r.push(e),o.update_visual("meta_open",{type:"metadata",value:`unmatchedOpen = ${l}`}),o.update_visual(`bar_${e}`,{type:"arrayElement",value:a,position:e,state:"highlight"}),o.record("inc_open",`'(' found, increment unmatchedOpen to ${l}`);else if(o.add_conditional("is_open",!1),l>0){o.add_conditional("has_open",!0),l--;let i=r.pop();c[i]=!0,c[e]=!0,o.update_visual(`bar_${i}`,{type:"arrayElement",value:t[i],position:i,state:"active"}),o.update_visual(`bar_${e}`,{type:"arrayElement",value:a,position:e,state:"active"}),o.update_visual("meta_open",{type:"metadata",value:`unmatchedOpen = ${l}`}),o.record("dec_open",`Matched with '(' at index ${i}. Decrement unmatchedOpen to ${l}`)}else o.add_conditional("has_open",!1),s++,o.update_visual(`bar_${e}`,{type:"arrayElement",value:a,position:e,state:"muted"}),o.update_visual("meta_close",{type:"metadata",value:`unmatchedClose = ${s}`}),o.record("inc_close",`No matching '(' available. Increment unmatchedClose to ${s}`)}o.add_conditional("for_loop",!1),o.delete_visual("ptr_i");for(let e=0;e<a;e++)c[e]||"("!==t[e]||o.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,state:"highlight"});let d=l+s;return o.update_visual("meta_open",{type:"metadata",value:`unmatchedOpen = ${l}`}),o.update_visual("meta_close",{type:"metadata",value:`unmatchedClose = ${s}`}),o.record("complete",`Done! Result = unmatchedOpen + unmatchedClose = ${l} + ${s} = ${d}`),o.getSteps()
}

export function MinimumAddToMakeParenthesesValidProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumAddToMakeParenthesesValidTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumAddToMakeParenthesesValidSteps(e) as any[];
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
      title="Minimum Add to Make Parentheses Valid"
      slug="minimum-add-to-make-parentheses-valid"
      approaches={approaches}
      presets={MinimumAddToMakeParenthesesValidPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Remove to Make Valid Parentheses (minimum-remove-to-make-valid-parentheses)
// ==========================================

const MinimumRemoveToMakeValidParenthesesTemplates = {
  "python": {
    "language": "python",
    "code": "def minRemoveToMakeValid(s):\n    stack = []\n    indices_to_remove = set()\n\n    for i, char in enumerate(s):\n        if char == '(':\n            stack.append(i)\n        elif char == ')':\n            if stack:\n                # Matched pair found\n                stack.pop()\n            else:\n                # Unmatched ')', mark for removal\n                indices_to_remove.add(i)\n\n    # Any remaining '(' on stack are unmatched\n    indices_to_remove.update(stack)\n\n    # Build result skipping removed indices\n    return ''.join(char for i, char in enumerate(s) if i not in indices_to_remove)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "push_index": [
        7
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9,
        11
      ],
      "mark_remove": [
        12,
        14
      ],
      "drain_stack": [
        17
      ],
      "build_result": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String minRemoveToMakeValid(String s) {\n    Stack<Integer> stack = new Stack<>();\n    Set<Integer> indicesToRemove = new HashSet<>();\n\n    for (int i = 0; i < s.length(); i++) {\n        char c = s.charAt(i);\n        if (c == '(') {\n            stack.push(i);\n        } else if (c == ')') {\n            if (!stack.isEmpty()) {\n                // Matched pair found\n                stack.pop();\n            } else {\n                // Unmatched ')', mark for removal\n                indicesToRemove.add(i);\n            }\n        }\n    }\n\n    // Any remaining '(' on stack are unmatched\n    while (!stack.isEmpty()) {\n        indicesToRemove.add(stack.pop());\n    }\n\n    // Build result skipping removed indices\n    StringBuilder result = new StringBuilder();\n    for (int i = 0; i < s.length(); i++) {\n        if (!indicesToRemove.contains(i)) {\n            result.append(s.charAt(i));\n        }\n    }\n    return result.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5,
        6
      ],
      "check_open": [
        7
      ],
      "push_index": [
        8
      ],
      "check_close": [
        9
      ],
      "match_pop": [
        10,
        12
      ],
      "mark_remove": [
        13,
        15
      ],
      "drain_stack": [
        21,
        22
      ],
      "build_result": [
        27,
        28,
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "check_open": [
        7
      ],
      "check_close": [
        9
      ],
      "match_pop": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string minRemoveToMakeValid(string s) {\n    stack<int> stk;\n    unordered_set<int> indicesToRemove;\n\n    for (int i = 0; i < s.size(); i++) {\n        if (s[i] == '(') {\n            stk.push(i);\n        } else if (s[i] == ')') {\n            if (!stk.empty()) {\n                // Matched pair found\n                stk.pop();\n            } else {\n                // Unmatched ')', mark for removal\n                indicesToRemove.insert(i);\n            }\n        }\n    }\n\n    // Any remaining '(' on stack are unmatched\n    while (!stk.empty()) {\n        indicesToRemove.insert(stk.top());\n        stk.pop();\n    }\n\n    // Build result skipping removed indices\n    string result;\n    for (int i = 0; i < s.size(); i++) {\n        if (indicesToRemove.find(i) == indicesToRemove.end()) {\n            result += s[i];\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "push_index": [
        7
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9,
        11
      ],
      "mark_remove": [
        12,
        14
      ],
      "drain_stack": [
        20,
        21
      ],
      "build_result": [
        27,
        28,
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string MinRemoveToMakeValid(string s) {\n    Stack<int> stack = new Stack<int>();\n    HashSet<int> indicesToRemove = new HashSet<int>();\n\n    for (int i = 0; i < s.Length; i++) {\n        char c = s[i];\n        if (c == '(') {\n            stack.Push(i);\n        } else if (c == ')') {\n            if (stack.Count > 0) {\n                // Matched pair found\n                stack.Pop();\n            } else {\n                // Unmatched ')', mark for removal\n                indicesToRemove.Add(i);\n            }\n        }\n    }\n\n    // Any remaining '(' on stack are unmatched\n    while (stack.Count > 0) {\n        indicesToRemove.Add(stack.Pop());\n    }\n\n    // Build result skipping removed indices\n    StringBuilder result = new StringBuilder();\n    for (int i = 0; i < s.Length; i++) {\n        if (!indicesToRemove.Contains(i)) {\n            result.Append(s[i]);\n        }\n    }\n    return result.ToString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5,
        6
      ],
      "check_open": [
        7
      ],
      "push_index": [
        8
      ],
      "check_close": [
        9
      ],
      "match_pop": [
        10,
        12
      ],
      "mark_remove": [
        13,
        15
      ],
      "drain_stack": [
        21,
        22
      ],
      "build_result": [
        27,
        28,
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "check_open": [
        7
      ],
      "check_close": [
        9
      ],
      "match_pop": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minRemoveToMakeValid(s string) string {\n    stack := []int{}\n    indicesToRemove := map[int]bool{}\n\n    for i := 0; i < len(s); i++ {\n        if s[i] == '(' {\n            stack = append(stack, i)\n        } else if s[i] == ')' {\n            if len(stack) > 0 {\n                // Matched pair found\n                stack = stack[:len(stack)-1]\n            } else {\n                // Unmatched ')', mark for removal\n                indicesToRemove[i] = true\n            }\n        }\n    }\n\n    // Any remaining '(' on stack are unmatched\n    for _, idx := range stack {\n        indicesToRemove[idx] = true\n    }\n\n    // Build result skipping removed indices\n    result := []byte{}\n    for i := 0; i < len(s); i++ {\n        if !indicesToRemove[i] {\n            result = append(result, s[i])\n        }\n    }\n    return string(result)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "push_index": [
        7
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9,
        11
      ],
      "mark_remove": [
        12,
        14
      ],
      "drain_stack": [
        20,
        21
      ],
      "build_result": [
        26,
        27,
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minRemoveToMakeValid(s) {\n  var stack = [];\n  var indicesToRemove = new Set();\n\n  for (var i = 0; i < s.length; i++) {\n    if (s[i] === \"(\") {\n      stack.push(i);\n    } else if (s[i] === \")\") {\n      if (stack.length > 0) {\n        // Matched pair found\n        stack.pop();\n      } else {\n        // Unmatched ')', mark for removal\n        indicesToRemove.add(i);\n      }\n    }\n  }\n\n  // Any remaining '(' on stack are unmatched\n  for (var idx of stack) {\n    indicesToRemove.add(idx);\n  }\n\n  // Build result skipping removed indices\n  var result = [];\n  for (var i = 0; i < s.length; i++) {\n    if (!indicesToRemove.has(i)) {\n      result.push(s[i]);\n    }\n  }\n  return result.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "push_index": [
        7
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9,
        11
      ],
      "mark_remove": [
        12,
        14
      ],
      "drain_stack": [
        20,
        21
      ],
      "build_result": [
        26,
        27,
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minRemoveToMakeValid(s: string): string {\n    const stack: number[] = [];\n    const indicesToRemove: Set<number> = new Set();\n\n    for (let i = 0; i < s.length; i++) {\n        if (s[i] === '(') {\n            stack.push(i);\n        } else if (s[i] === ')') {\n            if (stack.length > 0) {\n                // Matched pair found\n                stack.pop();\n            } else {\n                // Unmatched ')', mark for removal\n                indicesToRemove.add(i);\n            }\n        }\n    }\n\n    // Any remaining '(' on stack are unmatched\n    for (const idx of stack) {\n        indicesToRemove.add(idx);\n    }\n\n    // Build result skipping removed indices\n    const result: string[] = [];\n    for (let i = 0; i < s.length; i++) {\n        if (!indicesToRemove.has(i)) {\n            result.push(s[i]);\n        }\n    }\n    return result.join('');\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "push_index": [
        7
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9,
        11
      ],
      "mark_remove": [
        12,
        14
      ],
      "drain_stack": [
        20,
        21
      ],
      "build_result": [
        26,
        27,
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        8
      ],
      "match_pop": [
        9
      ]
    }
  }
};

const MinimumRemoveToMakeValidParenthesesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "lee(t(c)o)de)"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "a)b(c)d"
    }
  },
  {
    "id": "ex3",
    "label": "All Invalid",
    "value": {
      "s": "))(("
    }
  },
  {
    "id": "ex4",
    "label": "Nested",
    "value": {
      "s": "(a(b(c)d)"
    }
  }
];

function generateMinimumRemoveToMakeValidParenthesesSteps(e: any): any[] {
  

let t=e.s,i=t.split(""),n=i.reduce((e,t,i)=>(e[`char_${i}`]={type:"arrayElement",value:t,position:i},e),{}),r=new StepRecorder({s:t},{...n}),a=(e,t)=>r.update_visual(`char_${e}`,{type:"arrayElement",value:i[e],position:e,state:t}),l=[],o=new Set,c=()=>r.update_variable("stackIdxs",[...l]),d=()=>{r.delete_variable("matchedIdx"),r.delete_variable("removedIdx")};r.record("-","Use a stack of indices of unmatched '(' to find what to remove."),c(),r.record("init","Empty stack (indices of open brackets) and nothing removed yet.");for(let e=0;e<i.length;e++){let t=i[e];if(r.update_variable("i",e),r.update_variable("char",t),d(),r.update_visual("curr",{type:"pointer",position:e,label:"i"}),c(),r.record("loop",`Character at index ${e}: '${t}'`),"("===t)r.add_conditional("check_open",!0),l.push(e),a(e,"open"),c(),r.record("push_index",`'(' opens, push its index ${e} onto the stack`);else if(")"===t)if(r.add_conditional("check_open",!1),r.add_conditional("check_close",!0),l.length>0){r.add_conditional("match_pop",!0);let t=l.pop();r.update_variable("matchedIdx",t),a(t,"matched"),a(e,"matched"),c(),r.record("match_pop",`')' matches the '(' at index ${t}, keep both`),r.delete_variable("matchedIdx")}else r.add_conditional("match_pop",!1),o.add(e),a(e,"removed"),r.update_variable("removedIdx",e),r.record("mark_remove",`')' has no '(' to match, mark index ${e} for removal`),r.delete_variable("removedIdx");else r.add_conditional("check_open",!1),r.add_conditional("check_close",!1),r.record("check_close",`'${t}' is not a bracket, keep it and move on`)}for(r.delete_visual("curr"),d();l.length>0;){let e=l.pop();o.add(e),a(e,"removed"),r.update_variable("removedIdx",e),c(),r.record("drain_stack",`'(' at index ${e} never matched, mark it for removal`),r.delete_variable("removedIdx")}let p=i.filter((e,t)=>!o.has(t)).join("");for(let e=0;e<i.length;e++)a(e,o.has(e)?"removed":"kept");return r.update_variable("result",p),r.record("build_result",`Drop the marked characters. Result: "${p}"`),r.update_variable("return",p),r.record("complete",`Return "${p}"`),r.getSteps()
}

export function MinimumRemoveToMakeValidParenthesesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumRemoveToMakeValidParenthesesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumRemoveToMakeValidParenthesesSteps(e) as any[];
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
      title="Minimum Remove to Make Valid Parentheses"
      slug="minimum-remove-to-make-valid-parentheses"
      approaches={approaches}
      presets={MinimumRemoveToMakeValidParenthesesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Next Greater Element II (next-greater-element-ii)
// ==========================================

const NextGreaterElementIiTemplates = {
  "python": {
    "language": "python",
    "code": "def nextGreaterElements(nums):\n    n = len(nums)\n    result = [-1] * n\n    stack = []\n\n    for i in range(2 * n):\n        current = nums[i % n]\n        while stack and nums[stack[-1]] < current:\n            result[stack.pop()] = current\n\n        if i < n:\n            stack.append(i)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_element": [
        6,
        7
      ],
      "second_pass": [
        6,
        7
      ],
      "compare_greater": [
        8
      ],
      "pop_and_update": [
        9
      ],
      "push_stack": [
        11,
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] nextGreaterElements(int[] nums) {\n    int n = nums.length;\n    int[] result = new int[n];\n    for (int i = 0; i < n; i++) result[i] = -1;\n    Deque<Integer> stack = new ArrayDeque<>();\n\n    for (int i = 0; i < 2 * n; i++) {\n        int current = nums[i % n];\n        while (!stack.isEmpty() && nums[stack.peek()] < current) {\n            result[stack.pop()] = current;\n        }\n\n        if (i < n) stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "check_element": [
        7,
        8
      ],
      "second_pass": [
        7,
        8
      ],
      "compare_greater": [
        9
      ],
      "pop_and_update": [
        10
      ],
      "push_stack": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_greater": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> nextGreaterElements(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> result(n, -1);\n    stack<int> stk;\n\n    for (int i = 0; i < 2 * n; i++) {\n        int current = nums[i % n];\n        while (!stk.empty() && nums[stk.top()] < current) {\n            result[stk.top()] = current;\n            stk.pop();\n        }\n\n        if (i < n) stk.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_element": [
        6,
        7
      ],
      "second_pass": [
        6,
        7
      ],
      "compare_greater": [
        8
      ],
      "pop_and_update": [
        9,
        10
      ],
      "push_stack": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] NextGreaterElements(int[] nums) {\n    int n = nums.Length;\n    int[] result = new int[n];\n    Array.Fill(result, -1);\n    Stack<int> stack = new Stack<int>();\n\n    for (int i = 0; i < 2 * n; i++) {\n        int current = nums[i % n];\n        while (stack.Count > 0 && nums[stack.Peek()] < current) {\n            result[stack.Pop()] = current;\n        }\n\n        if (i < n) stack.Push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "check_element": [
        7,
        8
      ],
      "second_pass": [
        7,
        8
      ],
      "compare_greater": [
        9
      ],
      "pop_and_update": [
        10
      ],
      "push_stack": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_greater": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func nextGreaterElements(nums []int) []int {\n    n := len(nums)\n    result := make([]int, n)\n    for i := range result { result[i] = -1 }\n    stack := []int{}\n\n    for i := 0; i < 2*n; i++ {\n        current := nums[i%n]\n        for len(stack) > 0 && nums[stack[len(stack)-1]] < current {\n            result[stack[len(stack)-1]] = current\n            stack = stack[:len(stack)-1]\n        }\n\n        if i < n { stack = append(stack, i) }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "check_element": [
        7,
        8
      ],
      "second_pass": [
        7,
        8
      ],
      "compare_greater": [
        9
      ],
      "pop_and_update": [
        10,
        11
      ],
      "push_stack": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_greater": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function nextGreaterElements(nums) {\n    const n = nums.length;\n    const result = new Array(n).fill(-1);\n    const stack = [];\n\n    for (let i = 0; i < 2 * n; i++) {\n        const current = nums[i % n];\n        while (stack.length > 0 && nums[stack[stack.length - 1]] < current) {\n            result[stack.pop()] = current;\n        }\n\n        if (i < n) stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_element": [
        6,
        7
      ],
      "second_pass": [
        6,
        7
      ],
      "compare_greater": [
        8
      ],
      "pop_and_update": [
        9
      ],
      "push_stack": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function nextGreaterElements(nums: number[]): number[] {\n    const n = nums.length;\n    const result: number[] = new Array(n).fill(-1);\n    const stack: number[] = [];\n\n    for (let i = 0; i < 2 * n; i++) {\n        const current = nums[i % n];\n        while (stack.length > 0 && nums[stack[stack.length - 1]] < current) {\n            result[stack.pop()!] = current;\n        }\n\n        if (i < n) stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_element": [
        6,
        7
      ],
      "second_pass": [
        6,
        7
      ],
      "compare_greater": [
        8
      ],
      "pop_and_update": [
        9
      ],
      "push_stack": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ]
    }
  }
};

const NextGreaterElementIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        5,
        4,
        3,
        2,
        1
      ]
    }
  }
];

function generateNextGreaterElementIiSteps(e: any): any[] {
  

let t=e.nums,n=t.length,i=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),l=[],a=Array(n).fill(-1),s=new StepRecorder({nums:t},{...i});s.update_variable("nums",[...t]),s.record("-","Start of algorithm"),s.update_variable("stack",[...l]),s.update_variable("stackIdxs",[...l]),s.update_variable("result",[...a]),s.record("initialize","Initialize an empty stack and a result array filled with -1");for(let e=0;e<2*n;e++){let r=e%n,i=e<n?1:2;for(s.update_variable("i",e),s.update_variable("idx",r),s.update_variable("pass",i),s.update_variable("num",t[r]),s.update_variable("stack",[...l]),s.update_variable("stackIdxs",[...l]),1===i?s.record("check_element",`Pass 1: consider nums[${r}] = ${t[r]}`):s.record("second_pass",`Pass 2 (wrap): revisit nums[${r}] = ${t[r]} for items still waiting`),0===l.length&&s.add_conditional("is_greater",!1);l.length>0&&t[r]>t[l[l.length-1]];){let e=l[l.length-1];s.add_conditional("is_greater",!0),s.update_variable("topIdx",e),s.update_variable("topVal",t[e]),s.record("compare_greater",`nums[${r}] (${t[r]}) > nums[${e}] (${t[e]}), so it is the next greater`),l.pop(),a[e]=t[r],s.update_variable("poppedIdx",e),s.update_variable("poppedVal",t[e]),s.update_variable("stack",[...l]),s.update_variable("stackIdxs",[...l]),s.update_variable("result",[...a]),s.record("pop_and_update",`Pop index ${e}, set result[${e}] = ${t[r]}`)}l.length>0&&t[r]<=t[l[l.length-1]]&&s.add_conditional("is_greater",!1),1===i&&(l.push(e),s.update_variable("stack",[...l]),s.update_variable("stackIdxs",[...l]),s.record("push_stack",`No greater element yet, push index ${e} onto the stack`))}return s.delete_variable("i"),s.delete_variable("idx"),s.delete_variable("poppedIdx"),s.delete_variable("topIdx"),s.record("complete",`Done. Next greater elements: [${a.join(", ")}]`),s.getSteps()
}

export function NextGreaterElementIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NextGreaterElementIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNextGreaterElementIiSteps(e) as any[];
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
      title="Next Greater Element II"
      slug="next-greater-element-ii"
      approaches={approaches}
      presets={NextGreaterElementIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Next Greater Node In Linked List (next-greater-node-in-linked-list)
// ==========================================

const NextGreaterNodeInLinkedListTemplates = {
  "python": {
    "language": "python",
    "code": "def nextLargerNodes(head):\n    values = []\n    current = head\n    while current:\n        values.append(current.val)\n        current = current.next\n\n    n = len(values)\n    result = [0] * n\n    stack = []\n\n    for i in range(n):\n        while stack and values[i] > values[stack[-1]]:\n            popped_index = stack.pop()\n            result[popped_index] = values[i]\n\n        stack.append(i)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        9,
        10
      ],
      "check_node": [
        12
      ],
      "compare_greater": [
        14
      ],
      "pop_and_update": [
        15
      ],
      "push_stack": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_greater": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] nextLargerNodes(ListNode head) {\n    List<Integer> values = new ArrayList<>();\n    ListNode current = head;\n    while (current != null) {\n        values.add(current.val);\n        current = current.next;\n    }\n\n    int n = values.size();\n    int[] result = new int[n];\n    Deque<Integer> stack = new ArrayDeque<>();\n\n    for (int i = 0; i < n; i++) {\n        while (!stack.isEmpty() && values.get(i) > values.get(stack.peek())) {\n            int poppedIndex = stack.pop();\n            result[poppedIndex] = values.get(i);\n        }\n\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "check_node": [
        13
      ],
      "compare_greater": [
        15
      ],
      "pop_and_update": [
        16
      ],
      "push_stack": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_greater": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> nextLargerNodes(ListNode* head) {\n    vector<int> values;\n    ListNode* current = head;\n    while (current != nullptr) {\n        values.push_back(current->val);\n        current = current->next;\n    }\n\n    int n = values.size();\n    vector<int> result(n, 0);\n    stack<int> stk;\n\n    for (int i = 0; i < n; i++) {\n        while (!stk.empty() && values[i] > values[stk.top()]) {\n            int poppedIndex = stk.top();\n            stk.pop();\n            result[poppedIndex] = values[i];\n        }\n\n        stk.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "check_node": [
        13
      ],
      "compare_greater": [
        15,
        16
      ],
      "pop_and_update": [
        17
      ],
      "push_stack": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_greater": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] NextLargerNodes(ListNode head) {\n    List<int> values = new List<int>();\n    ListNode current = head;\n    while (current != null) {\n        values.Add(current.val);\n        current = current.next;\n    }\n\n    int n = values.Count;\n    int[] result = new int[n];\n    Stack<int> stack = new Stack<int>();\n\n    for (int i = 0; i < n; i++) {\n        while (stack.Count > 0 && values[i] > values[stack.Peek()]) {\n            int poppedIndex = stack.Pop();\n            result[poppedIndex] = values[i];\n        }\n\n        stack.Push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "check_node": [
        13
      ],
      "compare_greater": [
        15
      ],
      "pop_and_update": [
        16
      ],
      "push_stack": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_greater": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func nextLargerNodes(head *ListNode) []int {\n    values := []int{}\n    current := head\n    for current != nil {\n        values = append(values, current.Val)\n        current = current.Next\n    }\n\n    n := len(values)\n    result := make([]int, n)\n    stack := []int{}\n\n    for i := 0; i < n; i++ {\n        for len(stack) > 0 && values[i] > values[stack[len(stack)-1]] {\n            poppedIndex := stack[len(stack)-1]\n            stack = stack[:len(stack)-1]\n            result[poppedIndex] = values[i]\n        }\n\n        stack = append(stack, i)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "check_node": [
        13
      ],
      "compare_greater": [
        15,
        16
      ],
      "pop_and_update": [
        17
      ],
      "push_stack": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_greater": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function nextLargerNodes(head) {\n    const values = [];\n    let current = head;\n    while (current !== null) {\n        values.push(current.val);\n        current = current.next;\n    }\n\n    const n = values.length;\n    const result = new Array(n).fill(0);\n    const stack = [];\n\n    for (let i = 0; i < n; i++) {\n        while (stack.length > 0 && values[i] > values[stack[stack.length - 1]]) {\n            const poppedIndex = stack.pop();\n            result[poppedIndex] = values[i];\n        }\n\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "check_node": [
        13
      ],
      "compare_greater": [
        15
      ],
      "pop_and_update": [
        16
      ],
      "push_stack": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_greater": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function nextLargerNodes(head: ListNode | null): number[] {\n    const values: number[] = [];\n    let current = head;\n    while (current !== null) {\n        values.push(current.val);\n        current = current.next;\n    }\n\n    const n = values.length;\n    const result: number[] = new Array(n).fill(0);\n    const stack: number[] = [];\n\n    for (let i = 0; i < n; i++) {\n        while (stack.length > 0 && values[i] > values[stack[stack.length - 1]]) {\n            const poppedIndex = stack.pop()!;\n            result[poppedIndex] = values[i];\n        }\n\n        stack.push(i);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        10,
        11
      ],
      "check_node": [
        13
      ],
      "compare_greater": [
        15
      ],
      "pop_and_update": [
        16
      ],
      "push_stack": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_greater": [
        14
      ]
    }
  }
};

const NextGreaterNodeInLinkedListPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "values": [
        2,
        1,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "values": [
        2,
        7,
        4,
        3,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "values": [
        1,
        7,
        5,
        1,
        9,
        2,
        5,
        1
      ]
    }
  }
];

function generateNextGreaterNodeInLinkedListSteps(e: any): any[] {
  

let t=e.values,r=t.length,a=t.reduce((e,t,r)=>(e[`elem_${r}`]={type:"arrayElement",value:t,position:r},e),{}),l=[],i=Array(r).fill(0),s=new StepRecorder({values:t},{...a});s.update_variable("values",[...t]),s.record("-","Start of algorithm"),s.update_variable("stack",[...l]),s.update_variable("stackIdxs",[...l]),s.update_variable("result",[...i]),s.record("initialize","Initialize an empty stack and a result array filled with 0s");for(let e=0;e<r;e++){for(s.update_variable("i",e),s.update_variable("val",t[e]),s.update_variable("stackIdxs",[...l]),s.update_variable("result",[...i]),s.record("check_node",`Visit node ${e} with value ${t[e]}`),0===l.length&&s.add_conditional("is_greater",!1);l.length>0&&t[e]>t[l[l.length-1]];){let r=l[l.length-1];l.pop(),s.add_conditional("is_greater",!0),s.update_variable("poppedIdx",r),s.update_variable("poppedVal",t[r]),s.update_variable("stackIdxs",[...l]),s.record("compare_greater",`value ${t[e]} (node ${e}) > value ${t[r]} (node ${r}): it is the next greater`),i[r]=t[e],s.update_variable("result",[...i]),s.record("pop_and_update",`Pop node ${r}, set result[${r}] = ${t[e]}`)}l.length>0&&t[e]<=t[l[l.length-1]]&&s.add_conditional("is_greater",!1),l.push(e),s.update_variable("stackIdxs",[...l]),s.record("push_stack",`No greater node yet, push node ${e} onto the stack`)}return s.delete_variable("i"),s.delete_variable("poppedIdx"),s.record("complete",`Done. Next greater values: [${i.join(", ")}]`),s.getSteps()
}

export function NextGreaterNodeInLinkedListProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NextGreaterNodeInLinkedListTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNextGreaterNodeInLinkedListSteps(e) as any[];
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
      title="Next Greater Node In Linked List"
      slug="next-greater-node-in-linked-list"
      approaches={approaches}
      presets={NextGreaterNodeInLinkedListPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Online Stock Span (online-stock-span)
// ==========================================

const OnlineStockSpanTemplates = {
  "python": {
    "language": "python",
    "code": "class StockSpanner:\n    def __init__(self):\n        self.stack = []\n\n    def next(self, price):\n        span = 1\n        while self.stack and self.stack[-1][0] <= price:\n            span += self.stack.pop()[1]\n\n        self.stack.append((price, span))\n        return span",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "new_price": [
        5,
        6
      ],
      "stack_check": [
        7
      ],
      "pop_accumulate": [
        8
      ],
      "push_result": [
        10,
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "stack_top_leq": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class StockSpanner {\n    Deque<int[]> stack;\n\n    public StockSpanner() {\n        stack = new ArrayDeque<>();\n    }\n\n    public int next(int price) {\n        int span = 1;\n        while (!stack.isEmpty() && stack.peek()[0] <= price) {\n            span += stack.pop()[1];\n        }\n\n        stack.push(new int[]{price, span});\n        return span;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4,
        5
      ],
      "new_price": [
        8,
        9
      ],
      "stack_check": [
        10
      ],
      "pop_accumulate": [
        11
      ],
      "push_result": [
        14,
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "stack_top_leq": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class StockSpanner {\n    stack<pair<int, int>> stk;\n\npublic:\n    StockSpanner() {}\n\n    int next(int price) {\n        int span = 1;\n        while (!stk.empty() && stk.top().first <= price) {\n            span += stk.top().second;\n            stk.pop();\n        }\n\n        stk.push({price, span});\n        return span;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5
      ],
      "new_price": [
        7,
        8
      ],
      "stack_check": [
        9
      ],
      "pop_accumulate": [
        10,
        11
      ],
      "push_result": [
        14,
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "stack_top_leq": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class StockSpanner {\n    Stack<int[]> stack;\n\n    public StockSpanner() {\n        stack = new Stack<int[]>();\n    }\n\n    public int Next(int price) {\n        int span = 1;\n        while (stack.Count > 0 && stack.Peek()[0] <= price) {\n            span += stack.Pop()[1];\n        }\n\n        stack.Push(new int[]{price, span});\n        return span;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4,
        5
      ],
      "new_price": [
        8,
        9
      ],
      "stack_check": [
        10
      ],
      "pop_accumulate": [
        11
      ],
      "push_result": [
        14,
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "stack_top_leq": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type StockSpanner struct {\n    stack [][]int\n}\n\nfunc Constructor() StockSpanner {\n    return StockSpanner{stack: [][]int{}}\n}\n\nfunc (s *StockSpanner) Next(price int) int {\n    span := 1\n    for len(s.stack) > 0 && s.stack[len(s.stack)-1][0] <= price {\n        span += s.stack[len(s.stack)-1][1]\n        s.stack = s.stack[:len(s.stack)-1]\n    }\n\n    s.stack = append(s.stack, []int{price, span})\n    return span\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "new_price": [
        9,
        10
      ],
      "stack_check": [
        11
      ],
      "pop_accumulate": [
        12,
        13
      ],
      "push_result": [
        16,
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "stack_top_leq": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var StockSpanner = function() {\n    this.stack = [];\n};\n\nStockSpanner.prototype.next = function(price) {\n    let span = 1;\n    while (this.stack.length > 0 && this.stack[this.stack.length - 1][0] <= price) {\n        span += this.stack.pop()[1];\n    }\n\n    this.stack.push([price, span]);\n    return span;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        1,
        2
      ],
      "new_price": [
        5,
        6
      ],
      "stack_check": [
        7
      ],
      "pop_accumulate": [
        8
      ],
      "push_result": [
        11,
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "stack_top_leq": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class StockSpanner {\n    private stack: number[][];\n\n    constructor() {\n        this.stack = [];\n    }\n\n    next(price: number): number {\n        let span = 1;\n        while (this.stack.length > 0 && this.stack[this.stack.length - 1][0] <= price) {\n            span += this.stack.pop()![1];\n        }\n\n        this.stack.push([price, span]);\n        return span;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4,
        5
      ],
      "new_price": [
        8,
        9
      ],
      "stack_check": [
        10
      ],
      "pop_accumulate": [
        11
      ],
      "push_result": [
        14,
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "stack_top_leq": [
        10
      ]
    }
  }
};

const OnlineStockSpanPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "prices": [
        100,
        80,
        60,
        70,
        60,
        75,
        85
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "prices": [
        31,
        41,
        48,
        59,
        79
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "prices": [
        28,
        14,
        28,
        35,
        46,
        53,
        66,
        80,
        87,
        17
      ]
    }
  }
];

function generateOnlineStockSpanSteps(e: any): any[] {
  

let t=e.prices,n=t.length,a={};for(let e=0;e<n;e++)a[`price_${e}`]={type:"arrayElement",value:t[e],position:e};let r=[],l=Array(n).fill(0),s=new StepRecorder({prices:t},{...a});s.update_variable("prices",[...t]),s.record("-","Start: online stock span with a monotonic stack"),s.update_variable("stackPairs",[]),s.update_variable("spans",[...l]),s.record("initialize","Initialize an empty stack that will hold (price, span) pairs");for(let e=0;e<n;e++){let n=1;for(s.update_variable("i",e),s.update_variable("price",t[e]),s.update_variable("span",n),s.update_variable("stackPairs",r.map(e=>({...e}))),s.record("new_price",`New price ${t[e]} arrives. Start span = 1.`),0===r.length&&s.add_conditional("stack_top_leq",!1);r.length>0&&r[r.length-1].price<=t[e];){let i=r[r.length-1];s.add_conditional("stack_top_leq",!0),s.update_variable("topPrice",i.price),s.update_variable("topSpan",i.span),s.record("stack_check",`Top price ${i.price} <= ${t[e]}, so pop it and absorb its span`);let a=r.pop();n+=a.span,s.update_variable("poppedPrice",a.price),s.update_variable("poppedSpan",a.span),s.update_variable("span",n),s.update_variable("stackPairs",r.map(e=>({...e}))),s.record("pop_accumulate",`Absorb (${a.price}, ${a.span}): span += ${a.span} = ${n}`)}r.length>0&&r[r.length-1].price>t[e]&&s.add_conditional("stack_top_leq",!1),r.push({price:t[e],span:n}),l[e]=n,s.update_variable("stackPairs",r.map(e=>({...e}))),s.update_variable("spans",[...l]),s.update_variable("span",n),s.record("push_result",`Push (${t[e]}, ${n}). Span for price ${t[e]} = ${n}.`)}return s.delete_variable("i"),s.delete_variable("span"),s.delete_variable("topPrice"),s.delete_variable("topSpan"),s.delete_variable("poppedPrice"),s.delete_variable("poppedSpan"),s.record("complete",`Done. Spans: [${l.join(", ")}]`),s.getSteps()
}

export function OnlineStockSpanProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: OnlineStockSpanTemplates,
      generateSteps: (e: any) => {
        const recorded = generateOnlineStockSpanSteps(e) as any[];
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
      title="Online Stock Span"
      slug="online-stock-span"
      approaches={approaches}
      presets={OnlineStockSpanPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Invalid Parentheses (remove-invalid-parentheses)
// ==========================================

const RemoveInvalidParenthesesTemplates = {
  "python": {
    "language": "python",
    "code": "def removeInvalidParentheses(s):\n    openToRemove = closeToRemove = 0\n    for c in s:\n        if c == '(':\n            openToRemove += 1\n        elif c == ')':\n            if openToRemove > 0:\n                openToRemove -= 1\n            else:\n                closeToRemove += 1\n    result = set()\n    dfs(s, 0, 0, openToRemove, closeToRemove, [], result)\n    return list(result)",
    "lineMap": {
      "-": [
        1
      ],
      "count_unmatched": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "before_dfs": [
        12
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def dfs(s, index, balance, openRem, closeRem, path, result):\n    if openRem < 0 or closeRem < 0 or balance < 0:\n        return\n    if index == len(s):\n        if balance == 0 and openRem == 0 and closeRem == 0:\n            result.add(''.join(path))\n        return\n    c = s[index]\n    if c == '(':\n        dfs(s, index+1, balance, openRem-1, closeRem, path, result)\n        path.append(c)\n        dfs(s, index+1, balance+1, openRem, closeRem, path, result)\n        path.pop()\n    elif c == ')':\n        dfs(s, index+1, balance, openRem, closeRem-1, path, result)\n        path.append(c)\n        dfs(s, index+1, balance-1, openRem, closeRem, path, result)\n        path.pop()\n    else:\n        path.append(c)\n        dfs(s, index+1, balance, openRem, closeRem, path, result)\n        path.pop()",
    "recursiveLineMap": {
      "enter_dfs": [
        1
      ],
      "pruned": [
        2,
        3
      ],
      "check_end": [
        4
      ],
      "found_valid": [
        5,
        6
      ],
      "invalid_end": [
        7
      ],
      "process_char": [
        8,
        9
      ],
      "remove_open": [
        10
      ],
      "keep_open": [
        11,
        12
      ],
      "remove_close": [
        15
      ],
      "keep_close": [
        16,
        17
      ],
      "keep_letter": [
        20,
        21
      ],
      "backtrack": [
        13
      ]
    },
    "recursiveConditionalMap": {
      "check_pruning": [
        2
      ],
      "check_end": [
        4
      ],
      "is_valid": [
        5
      ],
      "is_open": [
        9
      ],
      "is_close": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> removeInvalidParentheses(String s) {\n    int openToRemove = 0, closeToRemove = 0;\n    for (char c : s.toCharArray()) {\n        if (c == '(') openToRemove++;\n        else if (c == ')') {\n            if (openToRemove > 0) openToRemove--;\n            else closeToRemove++;\n        }\n    }\n    Set<String> result = new HashSet<>();\n    dfs(s, 0, 0, openToRemove, closeToRemove, new StringBuilder(), result);\n    return new ArrayList<>(result);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_unmatched": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "before_dfs": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void dfs(String s, int index, int balance, int openRem, int closeRem, StringBuilder path, Set<String> result) {\n    if (openRem < 0 || closeRem < 0 || balance < 0) return;\n    if (index == s.length()) {\n        if (balance == 0 && openRem == 0 && closeRem == 0)\n            result.add(path.toString());\n        return;\n    }\n    char c = s.charAt(index);\n    int len = path.length();\n    if (c == '(') {\n        dfs(s, index+1, balance, openRem-1, closeRem, path, result);\n        path.append(c);\n        dfs(s, index+1, balance+1, openRem, closeRem, path, result);\n        path.deleteCharAt(len);\n    } else if (c == ')') {\n        dfs(s, index+1, balance, openRem, closeRem-1, path, result);\n        path.append(c);\n        dfs(s, index+1, balance-1, openRem, closeRem, path, result);\n        path.deleteCharAt(len);\n    } else {\n        path.append(c);\n        dfs(s, index+1, balance, openRem, closeRem, path, result);\n        path.deleteCharAt(len);\n    }\n}",
    "recursiveLineMap": {
      "enter_dfs": [
        1
      ],
      "pruned": [
        2
      ],
      "check_end": [
        3
      ],
      "found_valid": [
        4,
        5
      ],
      "invalid_end": [
        6
      ],
      "process_char": [
        8,
        9,
        10
      ],
      "remove_open": [
        11
      ],
      "keep_open": [
        12,
        13
      ],
      "remove_close": [
        16
      ],
      "keep_close": [
        17,
        18
      ],
      "keep_letter": [
        21,
        22
      ],
      "backtrack": [
        14
      ]
    },
    "recursiveConditionalMap": {
      "check_pruning": [
        2
      ],
      "check_end": [
        3
      ],
      "is_valid": [
        4
      ],
      "is_open": [
        10
      ],
      "is_close": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> removeInvalidParentheses(string s) {\n    int openToRemove = 0, closeToRemove = 0;\n    for (char c : s) {\n        if (c == '(') openToRemove++;\n        else if (c == ')') {\n            if (openToRemove > 0) openToRemove--;\n            else closeToRemove++;\n        }\n    }\n    unordered_set<string> result;\n    string path;\n    dfs(s, 0, 0, openToRemove, closeToRemove, path, result);\n    return vector<string>(result.begin(), result.end());\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_unmatched": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "before_dfs": [
        12
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void dfs(string& s, int index, int balance, int openRem, int closeRem, string& path, unordered_set<string>& result) {\n    if (openRem < 0 || closeRem < 0 || balance < 0) return;\n    if (index == s.size()) {\n        if (balance == 0 && openRem == 0 && closeRem == 0)\n            result.insert(path);\n        return;\n    }\n    char c = s[index];\n    if (c == '(') {\n        dfs(s, index+1, balance, openRem-1, closeRem, path, result);\n        path.push_back(c);\n        dfs(s, index+1, balance+1, openRem, closeRem, path, result);\n        path.pop_back();\n    } else if (c == ')') {\n        dfs(s, index+1, balance, openRem, closeRem-1, path, result);\n        path.push_back(c);\n        dfs(s, index+1, balance-1, openRem, closeRem, path, result);\n        path.pop_back();\n    } else {\n        path.push_back(c);\n        dfs(s, index+1, balance, openRem, closeRem, path, result);\n        path.pop_back();\n    }\n}",
    "recursiveLineMap": {
      "enter_dfs": [
        1
      ],
      "pruned": [
        2
      ],
      "check_end": [
        3
      ],
      "found_valid": [
        4,
        5
      ],
      "invalid_end": [
        6
      ],
      "process_char": [
        8,
        9
      ],
      "remove_open": [
        10
      ],
      "keep_open": [
        11,
        12
      ],
      "remove_close": [
        15
      ],
      "keep_close": [
        16,
        17
      ],
      "keep_letter": [
        20,
        21
      ],
      "backtrack": [
        13
      ]
    },
    "recursiveConditionalMap": {
      "check_pruning": [
        2
      ],
      "check_end": [
        3
      ],
      "is_valid": [
        4
      ],
      "is_open": [
        9
      ],
      "is_close": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> RemoveInvalidParentheses(string s) {\n    int openToRemove = 0, closeToRemove = 0;\n    foreach (char c in s) {\n        if (c == '(') openToRemove++;\n        else if (c == ')') {\n            if (openToRemove > 0) openToRemove--;\n            else closeToRemove++;\n        }\n    }\n    var result = new HashSet<string>();\n    Dfs(s, 0, 0, openToRemove, closeToRemove, new StringBuilder(), result);\n    return result.ToList();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_unmatched": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "before_dfs": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void Dfs(string s, int index, int balance, int openRem, int closeRem, StringBuilder path, HashSet<string> result) {\n    if (openRem < 0 || closeRem < 0 || balance < 0) return;\n    if (index == s.Length) {\n        if (balance == 0 && openRem == 0 && closeRem == 0)\n            result.Add(path.ToString());\n        return;\n    }\n    char c = s[index];\n    int len = path.Length;\n    if (c == '(') {\n        Dfs(s, index+1, balance, openRem-1, closeRem, path, result);\n        path.Append(c);\n        Dfs(s, index+1, balance+1, openRem, closeRem, path, result);\n        path.Remove(len, path.Length - len);\n    } else if (c == ')') {\n        Dfs(s, index+1, balance, openRem, closeRem-1, path, result);\n        path.Append(c);\n        Dfs(s, index+1, balance-1, openRem, closeRem, path, result);\n        path.Remove(len, path.Length - len);\n    } else {\n        path.Append(c);\n        Dfs(s, index+1, balance, openRem, closeRem, path, result);\n        path.Remove(len, path.Length - len);\n    }\n}",
    "recursiveLineMap": {
      "enter_dfs": [
        1
      ],
      "pruned": [
        2
      ],
      "check_end": [
        3
      ],
      "found_valid": [
        4,
        5
      ],
      "invalid_end": [
        6
      ],
      "process_char": [
        8,
        9,
        10
      ],
      "remove_open": [
        11
      ],
      "keep_open": [
        12,
        13
      ],
      "remove_close": [
        16
      ],
      "keep_close": [
        17,
        18
      ],
      "keep_letter": [
        21,
        22
      ],
      "backtrack": [
        14
      ]
    },
    "recursiveConditionalMap": {
      "check_pruning": [
        2
      ],
      "check_end": [
        3
      ],
      "is_valid": [
        4
      ],
      "is_open": [
        10
      ],
      "is_close": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeInvalidParentheses(s string) []string {\n    openToRemove, closeToRemove := 0, 0\n    for _, c := range s {\n        if c == '(' {\n            openToRemove++\n        } else if c == ')' {\n            if openToRemove > 0 {\n                openToRemove--\n            } else {\n                closeToRemove++\n            }\n        }\n    }\n    result := map[string]bool{}\n    dfs(s, 0, 0, openToRemove, closeToRemove, []byte{}, result)\n    keys := []string{}\n    for k := range result { keys = append(keys, k) }\n    return keys\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_unmatched": [
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
        13
      ],
      "before_dfs": [
        15
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func dfs(s string, index, balance, openRem, closeRem int, path []byte, result map[string]bool) {\n    if openRem < 0 || closeRem < 0 || balance < 0 {\n        return\n    }\n    if index == len(s) {\n        if balance == 0 && openRem == 0 && closeRem == 0 {\n            result[string(path)] = true\n        }\n        return\n    }\n    c := s[index]\n    if c == '(' {\n        dfs(s, index+1, balance, openRem-1, closeRem, path, result)\n        dfs(s, index+1, balance+1, openRem, closeRem, append(path, c), result)\n        path = path[:len(path)-1]\n    } else if c == ')' {\n        dfs(s, index+1, balance, openRem, closeRem-1, path, result)\n        dfs(s, index+1, balance-1, openRem, closeRem, append(path, c), result)\n        path = path[:len(path)-1]\n    } else {\n        dfs(s, index+1, balance, openRem, closeRem, append(path, c), result)\n        path = path[:len(path)-1]\n    }\n}",
    "recursiveLineMap": {
      "enter_dfs": [
        1
      ],
      "pruned": [
        2,
        3
      ],
      "check_end": [
        5
      ],
      "found_valid": [
        6,
        7
      ],
      "invalid_end": [
        9
      ],
      "process_char": [
        11,
        12
      ],
      "remove_open": [
        13
      ],
      "keep_open": [
        14
      ],
      "remove_close": [
        17
      ],
      "keep_close": [
        18
      ],
      "keep_letter": [
        21
      ],
      "backtrack": [
        15
      ]
    },
    "recursiveConditionalMap": {
      "check_pruning": [
        2
      ],
      "check_end": [
        5
      ],
      "is_valid": [
        6
      ],
      "is_open": [
        12
      ],
      "is_close": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function removeInvalidParentheses(s) {\n    let openToRemove = 0, closeToRemove = 0;\n    for (const c of s) {\n        if (c === '(') openToRemove++;\n        else if (c === ')') {\n            if (openToRemove > 0) openToRemove--;\n            else closeToRemove++;\n        }\n    }\n    const result = new Set();\n    dfs(s, 0, 0, openToRemove, closeToRemove, [], result);\n    return [...result];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_unmatched": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "before_dfs": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function dfs(s, index, balance, openRem, closeRem, path, result) {\n    if (openRem < 0 || closeRem < 0 || balance < 0) return;\n    if (index === s.length) {\n        if (balance === 0 && openRem === 0 && closeRem === 0)\n            result.add(path.join(''));\n        return;\n    }\n    const c = s[index];\n    if (c === '(') {\n        dfs(s, index+1, balance, openRem-1, closeRem, path, result);\n        path.push(c);\n        dfs(s, index+1, balance+1, openRem, closeRem, path, result);\n        path.pop();\n    } else if (c === ')') {\n        dfs(s, index+1, balance, openRem, closeRem-1, path, result);\n        path.push(c);\n        dfs(s, index+1, balance-1, openRem, closeRem, path, result);\n        path.pop();\n    } else {\n        path.push(c);\n        dfs(s, index+1, balance, openRem, closeRem, path, result);\n        path.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_dfs": [
        1
      ],
      "pruned": [
        2
      ],
      "check_end": [
        3
      ],
      "found_valid": [
        4,
        5
      ],
      "invalid_end": [
        6
      ],
      "process_char": [
        8,
        9
      ],
      "remove_open": [
        10
      ],
      "keep_open": [
        11,
        12
      ],
      "remove_close": [
        15
      ],
      "keep_close": [
        16,
        17
      ],
      "keep_letter": [
        20,
        21
      ],
      "backtrack": [
        13
      ]
    },
    "recursiveConditionalMap": {
      "check_pruning": [
        2
      ],
      "check_end": [
        3
      ],
      "is_valid": [
        4
      ],
      "is_open": [
        9
      ],
      "is_close": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeInvalidParentheses(s: string): string[] {\n    let openToRemove = 0, closeToRemove = 0;\n    for (const c of s) {\n        if (c === '(') openToRemove++;\n        else if (c === ')') {\n            if (openToRemove > 0) openToRemove--;\n            else closeToRemove++;\n        }\n    }\n    const result = new Set<string>();\n    dfs(s, 0, 0, openToRemove, closeToRemove, [], result);\n    return [...result];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_unmatched": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "before_dfs": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function dfs(s: string, index: number, balance: number, openRem: number, closeRem: number, path: string[], result: Set<string>): void {\n    if (openRem < 0 || closeRem < 0 || balance < 0) return;\n    if (index === s.length) {\n        if (balance === 0 && openRem === 0 && closeRem === 0)\n            result.add(path.join(''));\n        return;\n    }\n    const c = s[index];\n    if (c === '(') {\n        dfs(s, index+1, balance, openRem-1, closeRem, path, result);\n        path.push(c);\n        dfs(s, index+1, balance+1, openRem, closeRem, path, result);\n        path.pop();\n    } else if (c === ')') {\n        dfs(s, index+1, balance, openRem, closeRem-1, path, result);\n        path.push(c);\n        dfs(s, index+1, balance-1, openRem, closeRem, path, result);\n        path.pop();\n    } else {\n        path.push(c);\n        dfs(s, index+1, balance, openRem, closeRem, path, result);\n        path.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_dfs": [
        1
      ],
      "pruned": [
        2
      ],
      "check_end": [
        3
      ],
      "found_valid": [
        4,
        5
      ],
      "invalid_end": [
        6
      ],
      "process_char": [
        8,
        9
      ],
      "remove_open": [
        10
      ],
      "keep_open": [
        11,
        12
      ],
      "remove_close": [
        15
      ],
      "keep_close": [
        16,
        17
      ],
      "keep_letter": [
        20,
        21
      ],
      "backtrack": [
        13
      ]
    },
    "recursiveConditionalMap": {
      "check_pruning": [
        2
      ],
      "check_end": [
        3
      ],
      "is_valid": [
        4
      ],
      "is_open": [
        9
      ],
      "is_close": [
        14
      ]
    }
  }
};

const RemoveInvalidParenthesesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid",
    "value": {
      "s": "()"
    }
  },
  {
    "id": "ex2",
    "label": "One Extra Close",
    "value": {
      "s": "())"
    }
  },
  {
    "id": "ex3",
    "label": "With Letter",
    "value": {
      "s": "(a))"
    }
  },
  {
    "id": "ex4",
    "label": "One Extra Open",
    "value": {
      "s": "(()"
    }
  }
];

function generateRemoveInvalidParenthesesSteps(e: any): any[] {
  

let t=e.s||"",n=new RecursiveStepRecorder({},{});for(let e=0;e<t.length;e++)n.add_new_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`});n.pushCallFrame({s:t},"removeInvalidParentheses"),n.record("-","Start: Remove minimum parentheses to make string valid");let i=0,s=0;for(let e of t)"("===e?i++:")"===e&&(i>0?i--:s++);n.update_global_variable("openToRemove",i),n.update_global_variable("closeToRemove",s),n.record("count_unmatched",`Count unmatched: openToRemove=${i}, closeToRemove=${s}`);let a=new Set;function l(e){let t=n.getCurrentVisuals();Object.keys(t).forEach(r=>{let i=t[r];if("naryTreeNode"===i.type){let t=r===e,s=i.state;t&&"active"!==s?n.update_visual(r,{...i,state:"active"}):t||"active"!==s||n.update_visual(r,{...i,state:void 0})}})}function o(){for(let e=0;e<t.length;e++)n.update_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`})}function c(e,r){e<t.length&&n.update_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:r})}n.update_global_variable("result",Array.from(a));let d=0;return n.record("before_dfs","Start DFS backtracking"),!function e(r,i,s,p,u,h){let f=h.lastIndexOf("-"),v=f>0?h.substring(0,f):null,m=f>0?parseInt(h.substring(f+1),10):void 0,g=`"${u}"`;if(n.add_new_visual(h,{type:"naryTreeNode",value:g,parent:v||void 0,childIndex:m}),n.pushCallFrame({index:r,balance:i,openRem:s,closeRem:p,path:u},"dfs"),l(h),o(),r<t.length&&c(r,"active"),n.record("enter_dfs",`Enter dfs(index=${r}, balance=${i}, openRem=${s}, closeRem=${p}, path="${u}")`),s<0||p<0||i<0){n.add_conditional("check_pruning",!0),n.update_visual(h,{type:"naryTreeNode",value:g,parent:v||void 0,childIndex:m,state:"inactive"}),n.record("pruned",`Pruned: openRem=${s}, closeRem=${p}, balance=${i}`),n.popCallFrame();return}if(n.add_conditional("check_pruning",!1),r===t.length){n.add_conditional("check_end",!0),0===i&&0===s&&0===p?(n.add_conditional("is_valid",!0),a.add(u),n.update_global_variable("result",Array.from(a)),n.update_visual(h,{type:"naryTreeNode",value:g,parent:v||void 0,childIndex:m,state:"visited"}),n.record("found_valid",`Found valid result: "${u}"`)):(n.add_conditional("is_valid",!1),n.update_visual(h,{type:"naryTreeNode",value:g,parent:v||void 0,childIndex:m,state:"inactive"}),n.record("invalid_end",`End reached but invalid: balance=${i}, openRem=${s}, closeRem=${p}`)),n.popCallFrame();return}n.add_conditional("check_end",!1);let x=t[r];if("("===x){n.add_conditional("is_open",!0),n.add_conditional("is_close",!1),c(r,"highlight"),n.record("process_char",`Process '(' at index ${r}`);let t=h+"-"+ ++d;n.record("remove_open",`Remove '(' at index ${r}`),e(r+1,i,s-1,p,u,t),l(h),o(),c(r,"active");let a=h+"-"+ ++d;n.record("keep_open",`Keep '(' at index ${r}`),e(r+1,i+1,s,p,u+x,a)}else if(")"===x){n.add_conditional("is_open",!1),n.add_conditional("is_close",!0),c(r,"highlight"),n.record("process_char",`Process ')' at index ${r}`);let t=h+"-"+ ++d;n.record("remove_close",`Remove ')' at index ${r}`),e(r+1,i,s,p-1,u,t),l(h),o(),c(r,"active");let a=h+"-"+ ++d;n.record("keep_close",`Keep ')' at index ${r}`),e(r+1,i-1,s,p,u+x,a)}else{n.add_conditional("is_open",!1),n.add_conditional("is_close",!1),c(r,"highlight"),n.record("process_char",`Process letter '${x}' at index ${r}`);let t=h+"-"+ ++d;n.record("keep_letter",`Keep letter '${x}' at index ${r}`),e(r+1,i,s,p,u+x,t)}l(h),o(),r<t.length&&c(r,"active"),n.update_visual(h,{type:"naryTreeNode",value:g,parent:v||void 0,childIndex:m,state:"visited"}),n.record("backtrack",`Backtrack from index ${r}`),n.popCallFrame()}(0,0,i,s,"","0"),o(),n.update_global_variable("result",Array.from(a)),n.record("complete",`Found ${a.size} valid result(s): [${Array.from(a).map(e=>`"${e}"`).join(", ")}]`),n.getSteps()
}

export function RemoveInvalidParenthesesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveInvalidParenthesesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveInvalidParenthesesSteps(e) as any[];
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
      title="Remove Invalid Parentheses"
      slug="remove-invalid-parentheses"
      approaches={approaches}
      presets={RemoveInvalidParenthesesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove K Digits (remove-k-digits)
// ==========================================

const RemoveKDigitsTemplates = {
  "python": {
    "language": "python",
    "code": "def removeKdigits(num, k):\n    stack = []\n    for digit in num:\n        while stack and k > 0 and stack[-1] > digit:\n            stack.pop()\n            k -= 1\n        stack.append(digit)\n    while k > 0:\n        stack.pop()\n        k -= 1\n    start = 0\n    while start < len(stack) - 1 and stack[start] == '0':\n        start += 1\n    return ''.join(stack[start:]) if stack else '0'",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_digit": [
        3
      ],
      "compare_and_remove": [
        5,
        6
      ],
      "push_digit": [
        7
      ],
      "trim_remaining": [
        9,
        10
      ],
      "strip_zeros": [
        11,
        12,
        13
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "should_remove": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String removeKdigits(String num, int k) {\n    StringBuilder stack = new StringBuilder();\n    for (char digit : num.toCharArray()) {\n        while (stack.length() > 0 && k > 0 && stack.charAt(stack.length() - 1) > digit) {\n            stack.deleteCharAt(stack.length() - 1);\n            k--;\n        }\n        stack.append(digit);\n    }\n    while (k > 0) {\n        stack.deleteCharAt(stack.length() - 1);\n        k--;\n    }\n    int start = 0;\n    while (start < stack.length() - 1 && stack.charAt(start) == '0') {\n        start++;\n    }\n    return stack.substring(start);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_digit": [
        3
      ],
      "compare_and_remove": [
        5,
        6
      ],
      "push_digit": [
        8
      ],
      "trim_remaining": [
        11,
        12
      ],
      "strip_zeros": [
        14,
        15,
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_remove": [
        4
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string removeKdigits(string num, int k) {\n    string stack = \"\";\n    for (char digit : num) {\n        while (!stack.empty() && k > 0 && stack.back() > digit) {\n            stack.pop_back();\n            k--;\n        }\n        stack.push_back(digit);\n    }\n    while (k > 0) {\n        stack.pop_back();\n        k--;\n    }\n    int start = 0;\n    while (start < stack.size() - 1 && stack[start] == '0') {\n        start++;\n    }\n    return stack.substr(start);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_digit": [
        3
      ],
      "compare_and_remove": [
        5,
        6
      ],
      "push_digit": [
        8
      ],
      "trim_remaining": [
        11,
        12
      ],
      "strip_zeros": [
        14,
        15,
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_remove": [
        4
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string RemoveKdigits(string num, int k) {\n    var stack = new StringBuilder();\n    foreach (char digit in num) {\n        while (stack.Length > 0 && k > 0 && stack[stack.Length - 1] > digit) {\n            stack.Remove(stack.Length - 1, 1);\n            k--;\n        }\n        stack.Append(digit);\n    }\n    while (k > 0) {\n        stack.Remove(stack.Length - 1, 1);\n        k--;\n    }\n    int start = 0;\n    while (start < stack.Length - 1 && stack[start] == '0') {\n        start++;\n    }\n    return stack.ToString().Substring(start);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_digit": [
        3
      ],
      "compare_and_remove": [
        5,
        6
      ],
      "push_digit": [
        8
      ],
      "trim_remaining": [
        11,
        12
      ],
      "strip_zeros": [
        14,
        15,
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_remove": [
        4
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeKdigits(num string, k int) string {\n    stack := []byte{}\n    for _, digit := range num {\n        for len(stack) > 0 && k > 0 && stack[len(stack)-1] > byte(digit) {\n            stack = stack[:len(stack)-1]\n            k--\n        }\n        stack = append(stack, byte(digit))\n    }\n    for k > 0 {\n        stack = stack[:len(stack)-1]\n        k--\n    }\n    start := 0\n    for start < len(stack)-1 && stack[start] == '0' {\n        start++\n    }\n    return string(stack[start:])\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_digit": [
        3
      ],
      "compare_and_remove": [
        5,
        6
      ],
      "push_digit": [
        8
      ],
      "trim_remaining": [
        11,
        12
      ],
      "strip_zeros": [
        14,
        15,
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_remove": [
        4
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function removeKdigits(num, k) {\n    const stack = [];\n    for (const digit of num) {\n        while (stack.length > 0 && k > 0 && stack[stack.length - 1] > digit) {\n            stack.pop();\n            k--;\n        }\n        stack.push(digit);\n    }\n    while (k > 0) {\n        stack.pop();\n        k--;\n    }\n    let start = 0;\n    while (start < stack.length - 1 && stack[start] === '0') {\n        start++;\n    }\n    return stack.slice(start).join('') || '0';\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_digit": [
        3
      ],
      "compare_and_remove": [
        5,
        6
      ],
      "push_digit": [
        8
      ],
      "trim_remaining": [
        11,
        12
      ],
      "strip_zeros": [
        14,
        15,
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_remove": [
        4
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeKdigits(num: string, k: number): string {\n    const stack: string[] = [];\n    for (const digit of num) {\n        while (stack.length > 0 && k > 0 && stack[stack.length - 1] > digit) {\n            stack.pop();\n            k--;\n        }\n        stack.push(digit);\n    }\n    while (k > 0) {\n        stack.pop();\n        k--;\n    }\n    let start = 0;\n    while (start < stack.length - 1 && stack[start] === '0') {\n        start++;\n    }\n    return stack.slice(start).join('') || '0';\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_digit": [
        3
      ],
      "compare_and_remove": [
        5,
        6
      ],
      "push_digit": [
        8
      ],
      "trim_remaining": [
        11,
        12
      ],
      "strip_zeros": [
        14,
        15,
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "should_remove": [
        4
      ]
    }
  }
};

const RemoveKDigitsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "num": "1432219",
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "num": "10200",
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "num": "10",
      "k": 2
    }
  }
];

function generateRemoveKDigitsSteps(e: any): any[] {
  

let t=e.num,i=e.k,a=t.split(""),r=a.reduce((e,t,i)=>(e[`digit_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=[],s=[],o=[],d=[],c=i,u=new StepRecorder({num:t,k:i},{...r});u.update_variable("digits",[...a]),u.update_variable("k",c),u.record("-","Start: remove k digits to make the smallest number"),u.update_variable("stack",""),u.update_variable("stackIdxs",[]),u.update_variable("removedIdxs",[]),u.update_variable("strippedIdxs",[]),u.update_variable("result",""),u.record("initialize",`Initialize an empty stack, k = ${i}`);for(let e=0;e<t.length;e++){let i=t[e];for(u.update_variable("i",e),u.update_variable("digit",i),u.update_variable("stackIdxs",[...s]),u.update_variable("k",c),u.record("check_digit",`Look at digit '${i}' (index ${e})`);l.length>0&&c>0&&l[l.length-1]>i;){let e=l[l.length-1];u.add_conditional("should_remove",!0),l.pop();let t=s.pop();c--,o.push(t),u.update_variable("topDigit",e),u.update_variable("poppedIdx",t),u.update_variable("stack",l.join("")),u.update_variable("stackIdxs",[...s]),u.update_variable("removedIdxs",[...o]),u.update_variable("k",c),u.update_variable("result",l.join("")),u.record("compare_and_remove",`top '${e}' > '${i}', remove it. k = ${c}`)}l.length>0&&c>0&&l[l.length-1]<=i&&u.add_conditional("should_remove",!1),l.push(i),s.push(e),u.update_variable("stack",l.join("")),u.update_variable("stackIdxs",[...s]),u.update_variable("result",l.join("")),u.record("push_digit",`Push '${i}'. Result so far: "${l.join("")}"`)}for(;c>0&&l.length>0;){l.pop();let e=s.pop();c--,o.push(e),u.update_variable("poppedIdx",e),u.update_variable("stack",l.join("")),u.update_variable("stackIdxs",[...s]),u.update_variable("removedIdxs",[...o]),u.update_variable("k",c),u.update_variable("result",l.join("")),u.record("trim_remaining",`k still ${c+1} > 0, drop the last digit. k = ${c}`)}let p=l.join(""),m=0;for(;m<p.length-1&&"0"===p[m];)d.push(s[m]),m++;if(m>0){let e=p.substring(m);u.update_variable("stackIdxs",s.slice(m)),u.update_variable("strippedIdxs",[...d]),u.update_variable("result",e),u.record("strip_zeros",`Strip leading zeros: "${p}" → "${e}"`)}let g=p.substring(m)||"0";return u.delete_variable("i"),u.delete_variable("poppedIdx"),u.delete_variable("topDigit"),u.update_variable("result",g),u.update_variable("finalResult",g),u.record("complete",`Smallest number: "${g}"`),u.getSteps()
}

export function RemoveKDigitsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveKDigitsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveKDigitsSteps(e) as any[];
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
      title="Remove K Digits"
      slug="remove-k-digits"
      approaches={approaches}
      presets={RemoveKDigitsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Simplify Path (simplify-path)
// ==========================================

const SimplifyPathTemplates = {
  "python": {
    "language": "python",
    "code": "def simplifyPath(path):\n    stack = []\n    components = path.split(\"/\")\n\n    for component in components:\n        if component == \"..\":\n            # Go up one directory if possible\n            if stack:\n                stack.pop()\n        elif component and component != \".\":\n            # Valid directory name, add it\n            stack.append(component)\n\n    return \"/\" + \"/\".join(stack)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "split": [
        3
      ],
      "loop": [
        5
      ],
      "check_dotdot": [
        6
      ],
      "pop_dir": [
        8,
        9
      ],
      "check_skip": [
        10
      ],
      "skip": [
        10
      ],
      "push_dir": [
        12
      ],
      "build_result": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_dotdot": [
        6
      ],
      "stack_not_empty": [
        8
      ],
      "is_skip": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String simplifyPath(String path) {\n    Deque<String> stack = new ArrayDeque<>();\n    String[] components = path.split(\"/\");\n\n    for (String component : components) {\n        if (component.equals(\"..\")) {\n            // Go up one directory if possible\n            if (!stack.isEmpty()) {\n                stack.pop();\n            }\n        } else if (!component.isEmpty() && !component.equals(\".\")) {\n            // Valid directory name, add it\n            stack.push(component);\n        }\n    }\n\n    // Build result from bottom of stack to top\n    StringBuilder result = new StringBuilder();\n    for (String dir : stack) {\n        result.insert(0, \"/\" + dir);\n    }\n    return result.length() == 0 ? \"/\" : result.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "split": [
        3
      ],
      "loop": [
        5
      ],
      "check_dotdot": [
        6
      ],
      "pop_dir": [
        8,
        9
      ],
      "check_skip": [
        11
      ],
      "skip": [
        11
      ],
      "push_dir": [
        13
      ],
      "build_result": [
        18,
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_dotdot": [
        6
      ],
      "stack_not_empty": [
        8
      ],
      "is_skip": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string simplifyPath(string path) {\n    vector<string> stack;\n    string component;\n\n    // Use stringstream to split by '/'\n    stringstream ss(path);\n    while (getline(ss, component, '/')) {\n        if (component == \"..\") {\n            // Go up one directory if possible\n            if (!stack.empty()) {\n                stack.pop_back();\n            }\n        } else if (!component.empty() && component != \".\") {\n            // Valid directory name, add it\n            stack.push_back(component);\n        }\n    }\n\n    // Build result\n    string result;\n    for (const string& dir : stack) {\n        result += \"/\" + dir;\n    }\n    return result.empty() ? \"/\" : result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "split": [
        6
      ],
      "loop": [
        7
      ],
      "check_dotdot": [
        8
      ],
      "pop_dir": [
        10,
        11
      ],
      "check_skip": [
        13
      ],
      "skip": [
        13
      ],
      "push_dir": [
        15
      ],
      "build_result": [
        24
      ],
      "complete": [
        21,
        22
      ]
    },
    "conditionalMap": {
      "is_dotdot": [
        8
      ],
      "stack_not_empty": [
        10
      ],
      "is_skip": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string SimplifyPath(string path) {\n    Stack<string> stack = new Stack<string>();\n    string[] components = path.Split('/');\n\n    foreach (string component in components) {\n        if (component == \"..\") {\n            // Go up one directory if possible\n            if (stack.Count > 0) {\n                stack.Pop();\n            }\n        } else if (component.Length > 0 && component != \".\") {\n            // Valid directory name, add it\n            stack.Push(component);\n        }\n    }\n\n    // Build result from bottom of stack to top\n    string[] dirs = stack.ToArray();\n    Array.Reverse(dirs);\n    return \"/\" + string.Join(\"/\", dirs);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "split": [
        3
      ],
      "loop": [
        5
      ],
      "check_dotdot": [
        6
      ],
      "pop_dir": [
        8,
        9
      ],
      "check_skip": [
        11
      ],
      "skip": [
        11
      ],
      "push_dir": [
        13
      ],
      "build_result": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_dotdot": [
        6
      ],
      "stack_not_empty": [
        8
      ],
      "is_skip": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func simplifyPath(path string) string {\n    stack := []string{}\n    components := strings.Split(path, \"/\")\n\n    for _, component := range components {\n        if component == \"..\" {\n            // Go up one directory if possible\n            if len(stack) > 0 {\n                stack = stack[:len(stack)-1]\n            }\n        } else if len(component) > 0 && component != \".\" {\n            // Valid directory name, add it\n            stack = append(stack, component)\n        }\n    }\n\n    return \"/\" + strings.Join(stack, \"/\")\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "split": [
        3
      ],
      "loop": [
        5
      ],
      "check_dotdot": [
        6
      ],
      "pop_dir": [
        8,
        9
      ],
      "check_skip": [
        11
      ],
      "skip": [
        11
      ],
      "push_dir": [
        13
      ],
      "build_result": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_dotdot": [
        6
      ],
      "stack_not_empty": [
        8
      ],
      "is_skip": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function simplifyPath(path) {\n  var stack = [];\n  var components = path.split(\"/\");\n\n  for (var i = 0; i < components.length; i++) {\n    var component = components[i];\n    if (component === \"..\") {\n      // Go up one directory if possible\n      if (stack.length > 0) {\n        stack.pop();\n      }\n    } else if (component.length > 0 && component !== \".\") {\n      // Valid directory name, add it\n      stack.push(component);\n    }\n  }\n\n  return \"/\" + stack.join(\"/\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "split": [
        3
      ],
      "loop": [
        5,
        6
      ],
      "check_dotdot": [
        7
      ],
      "pop_dir": [
        9,
        10
      ],
      "check_skip": [
        12
      ],
      "skip": [
        12
      ],
      "push_dir": [
        14
      ],
      "build_result": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_dotdot": [
        7
      ],
      "stack_not_empty": [
        9
      ],
      "is_skip": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function simplifyPath(path: string): string {\n    const stack: string[] = [];\n    const components = path.split(\"/\");\n\n    for (const component of components) {\n        if (component === \"..\") {\n            // Go up one directory if possible\n            if (stack.length > 0) {\n                stack.pop();\n            }\n        } else if (component.length > 0 && component !== \".\") {\n            // Valid directory name, add it\n            stack.push(component);\n        }\n    }\n\n    return \"/\" + stack.join(\"/\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "split": [
        3
      ],
      "loop": [
        5
      ],
      "check_dotdot": [
        6
      ],
      "pop_dir": [
        8,
        9
      ],
      "check_skip": [
        11
      ],
      "skip": [
        11
      ],
      "push_dir": [
        13
      ],
      "build_result": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_dotdot": [
        6
      ],
      "stack_not_empty": [
        8
      ],
      "is_skip": [
        11
      ]
    }
  }
};

const SimplifyPathPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "/home/",
    "value": {
      "path": "/home/"
    }
  },
  {
    "id": "ex2",
    "label": "/home//foo/",
    "value": {
      "path": "/home//foo/"
    }
  },
  {
    "id": "ex3",
    "label": "../Pictures",
    "value": {
      "path": "/home/user/Documents/../Pictures"
    }
  },
  {
    "id": "ex4",
    "label": "/../",
    "value": {
      "path": "/../"
    }
  },
  {
    "id": "ex5",
    "label": "/a/./b/../../c/",
    "value": {
      "path": "/a/./b/../../c/"
    }
  }
];

function generateSimplifyPathSteps(t: any): any[] {
  

let e=t.path,i=e.split("/"),r=i.reduce((t,e,i)=>(t[`comp_${i}`]={type:"arrayElement",value:""===e?'""':e,position:i},t),{}),l=[],a=new StepRecorder({path:e},{...r}),o=t=>".."===t?"dotdot":""===t||"."===t?"skip":"name",s=()=>"/"+l.join("/"),c=t=>{for(let t=0;t<=i.length+1;t++)a.delete_visual(`stack_${t}`);l.forEach((e,i)=>{a.update_visual(`stack_${i}`,{type:"stackElement",value:e,position:i,state:t?.entering&&i===l.length-1?"entering":void 0})}),t?.exiting&&a.update_visual(`stack_${t.exiting.pos}`,{type:"stackElement",value:t.exiting.dir,position:t.exiting.pos,state:"exiting"}),a.update_variable("stack",[...l]),a.update_variable("resultPath",s())};a.record("-","Simplify a Unix path. A stack holds the current directory."),a.add_new_variable("stack",[]),a.update_variable("resultPath",s()),a.record("init","Start with an empty stack (the root directory /)."),a.add_new_variable("components",i.map(t=>""===t?'""':t)),a.record("split",`Split the path by "/" into ${i.length} components.`);for(let t=0;t<i.length;t++){let e=i[t],n=o(e);if(a.update_variable("i",t),a.update_variable("component",""===e?'""':e),a.update_variable("compType",n),a.delete_variable("poppedDir"),a.update_visual("curr",{type:"pointer",position:t,label:"i"}),c(),a.record("loop",`Component ${t}: "${""===e?"":e}"`),".."===e)if(a.add_conditional("is_dotdot",!0),a.record("check_dotdot","It is '..', go up one directory"),l.length>0){let t=l.pop();a.add_conditional("stack_not_empty",!0),a.update_variable("poppedDir",t),c({exiting:{dir:t,pos:l.length}}),a.record("pop_dir",`Go up: leave '${t}'`)}else a.add_conditional("stack_not_empty",!1),c(),a.record("pop_dir","Already at root, nothing to go up to");else""===e||"."===e?(a.add_conditional("is_dotdot",!1),a.add_conditional("is_skip",!0),a.record("check_skip",""===e?"It is empty, skip":"It is '.', the current directory"),a.record("skip",""===e?"Skip the empty component":"Skip '.', stay in place")):(a.add_conditional("is_dotdot",!1),a.add_conditional("is_skip",!1),a.record("check_skip",`'${e}' is a directory name`),l.push(e),c({entering:!0}),a.record("push_dir",`Enter directory '${e}'`))}a.delete_variable("i"),a.delete_variable("component"),a.delete_variable("compType"),a.delete_variable("poppedDir"),a.delete_visual("curr"),c();let p="/"+l.join("/");return a.update_variable("result",p),a.record("build_result",`Join the stack with "/": "${p}"`),a.record("complete",`Return "${p}"`),a.getSteps()
}

export function SimplifyPathProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SimplifyPathTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSimplifyPathSteps(t) as any[];
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
      title="Simplify Path"
      slug="simplify-path"
      approaches={approaches}
      presets={SimplifyPathPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Parenthesis String (valid-parenthesis-string)
// ==========================================

const ValidParenthesisStringTemplates = {
  "python": {
    "language": "python",
    "code": "def checkValidString(s):\n    low = 0   # Min possible open count\n    high = 0  # Max possible open count\n\n    for c in s:\n        if c == '(':\n            low += 1\n            high += 1\n        elif c == ')':\n            low -= 1\n            high -= 1\n        else:\n            # '*' can be '(', ')', or empty\n            low -= 1   # Treat as ')' for minimum\n            high += 1  # Treat as '(' for maximum\n\n        # Even the most optimistic case has too many ')'\n        if high < 0:\n            return False\n\n        # Open count can't go negative; clamp minimum\n        if low < 0:\n            low = 0\n\n    # Valid if zero is within the range of possible open counts\n    return low == 0",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_both": [
        7,
        8
      ],
      "check_close": [
        9
      ],
      "dec_both": [
        10,
        11
      ],
      "check_star": [
        12
      ],
      "star_range": [
        14,
        15
      ],
      "check_high": [
        18
      ],
      "return_false": [
        18
      ],
      "clamp_low": [
        22
      ],
      "check_result": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        9
      ],
      "check_star": [
        12
      ],
      "check_high": [
        18
      ],
      "check_result": [
        26
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean checkValidString(String s) {\n    int low = 0;  // Min possible open count\n    int high = 0; // Max possible open count\n\n    for (char c : s.toCharArray()) {\n        if (c == '(') {\n            low++;\n            high++;\n        } else if (c == ')') {\n            low--;\n            high--;\n        } else {\n            // '*' can be '(', ')', or empty\n            low--;  // Treat as ')' for minimum\n            high++; // Treat as '(' for maximum\n        }\n\n        // Even the most optimistic case has too many ')'\n        if (high < 0) return false;\n\n        // Open count can't go negative; clamp minimum\n        if (low < 0) low = 0;\n    }\n\n    // Valid if zero is within the range of possible open counts\n    return low == 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_both": [
        7,
        8
      ],
      "check_close": [
        9
      ],
      "dec_both": [
        10,
        11
      ],
      "check_star": [
        12
      ],
      "star_range": [
        14,
        15
      ],
      "check_high": [
        19
      ],
      "return_false": [
        19
      ],
      "clamp_low": [
        22
      ],
      "check_result": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        9
      ],
      "check_star": [
        12
      ],
      "check_high": [
        19
      ],
      "check_result": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool checkValidString(string s) {\n    int low = 0;  // Min possible open count\n    int high = 0; // Max possible open count\n\n    for (char c : s) {\n        if (c == '(') {\n            low++;\n            high++;\n        } else if (c == ')') {\n            low--;\n            high--;\n        } else {\n            // '*' can be '(', ')', or empty\n            low--;  // Treat as ')' for minimum\n            high++; // Treat as '(' for maximum\n        }\n\n        // Even the most optimistic case has too many ')'\n        if (high < 0) return false;\n\n        // Open count can't go negative; clamp minimum\n        if (low < 0) low = 0;\n    }\n\n    // Valid if zero is within the range of possible open counts\n    return low == 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_both": [
        7,
        8
      ],
      "check_close": [
        9
      ],
      "dec_both": [
        10,
        11
      ],
      "check_star": [
        12
      ],
      "star_range": [
        14,
        15
      ],
      "check_high": [
        19
      ],
      "return_false": [
        19
      ],
      "clamp_low": [
        22
      ],
      "check_result": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        9
      ],
      "check_star": [
        12
      ],
      "check_high": [
        19
      ],
      "check_result": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool CheckValidString(string s) {\n    int low = 0;  // Min possible open count\n    int high = 0; // Max possible open count\n\n    foreach (char c in s) {\n        if (c == '(') {\n            low++;\n            high++;\n        } else if (c == ')') {\n            low--;\n            high--;\n        } else {\n            // '*' can be '(', ')', or empty\n            low--;  // Treat as ')' for minimum\n            high++; // Treat as '(' for maximum\n        }\n\n        // Even the most optimistic case has too many ')'\n        if (high < 0) return false;\n\n        // Open count can't go negative; clamp minimum\n        if (low < 0) low = 0;\n    }\n\n    // Valid if zero is within the range of possible open counts\n    return low == 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_both": [
        7,
        8
      ],
      "check_close": [
        9
      ],
      "dec_both": [
        10,
        11
      ],
      "check_star": [
        12
      ],
      "star_range": [
        14,
        15
      ],
      "check_high": [
        19
      ],
      "return_false": [
        19
      ],
      "clamp_low": [
        22
      ],
      "check_result": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        9
      ],
      "check_star": [
        12
      ],
      "check_high": [
        19
      ],
      "check_result": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func checkValidString(s string) bool {\n    low := 0  // Min possible open count\n    high := 0 // Max possible open count\n\n    for _, c := range s {\n        if c == '(' {\n            low++\n            high++\n        } else if c == ')' {\n            low--\n            high--\n        } else {\n            // '*' can be '(', ')', or empty\n            low--  // Treat as ')' for minimum\n            high++ // Treat as '(' for maximum\n        }\n\n        // Even the most optimistic case has too many ')'\n        if high < 0 {\n            return false\n        }\n\n        // Open count can't go negative; clamp minimum\n        if low < 0 {\n            low = 0\n        }\n    }\n\n    // Valid if zero is within the range of possible open counts\n    return low == 0\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_both": [
        7,
        8
      ],
      "check_close": [
        9
      ],
      "dec_both": [
        10,
        11
      ],
      "check_star": [
        12
      ],
      "star_range": [
        14,
        15
      ],
      "check_high": [
        19
      ],
      "return_false": [
        19
      ],
      "clamp_low": [
        24
      ],
      "check_result": [
        30
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        9
      ],
      "check_star": [
        12
      ],
      "check_high": [
        19
      ],
      "check_result": [
        30
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function checkValidString(s) {\n  var low = 0; // Min possible open count\n  var high = 0; // Max possible open count\n\n  for (var i = 0; i < s.length; i++) {\n    var c = s[i];\n    if (c === \"(\") {\n      low++;\n      high++;\n    } else if (c === \")\") {\n      low--;\n      high--;\n    } else {\n      // '*' can be '(', ')', or empty\n      low--; // Treat as ')' for minimum\n      high++; // Treat as '(' for maximum\n    }\n\n    // Even the most optimistic case has too many ')'\n    if (high < 0) return false;\n\n    // Open count can't go negative; clamp minimum\n    if (low < 0) low = 0;\n  }\n\n  // Valid if zero is within the range of possible open counts\n  return low === 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        7
      ],
      "inc_both": [
        8,
        9
      ],
      "check_close": [
        10
      ],
      "dec_both": [
        11,
        12
      ],
      "check_star": [
        13
      ],
      "star_range": [
        15,
        16
      ],
      "check_high": [
        20
      ],
      "return_false": [
        20
      ],
      "clamp_low": [
        23
      ],
      "check_result": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "check_open": [
        7
      ],
      "check_close": [
        10
      ],
      "check_star": [
        13
      ],
      "check_high": [
        20
      ],
      "check_result": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function checkValidString(s: string): boolean {\n    let low = 0;  // Min possible open count\n    let high = 0; // Max possible open count\n\n    for (const c of s) {\n        if (c === '(') {\n            low++;\n            high++;\n        } else if (c === ')') {\n            low--;\n            high--;\n        } else {\n            // '*' can be '(', ')', or empty\n            low--;  // Treat as ')' for minimum\n            high++; // Treat as '(' for maximum\n        }\n\n        // Even the most optimistic case has too many ')'\n        if (high < 0) return false;\n\n        // Open count can't go negative; clamp minimum\n        if (low < 0) low = 0;\n    }\n\n    // Valid if zero is within the range of possible open counts\n    return low === 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "check_open": [
        6
      ],
      "inc_both": [
        7,
        8
      ],
      "check_close": [
        9
      ],
      "dec_both": [
        10,
        11
      ],
      "check_star": [
        12
      ],
      "star_range": [
        14,
        15
      ],
      "check_high": [
        19
      ],
      "return_false": [
        19
      ],
      "clamp_low": [
        22
      ],
      "check_result": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_open": [
        6
      ],
      "check_close": [
        9
      ],
      "check_star": [
        12
      ],
      "check_high": [
        19
      ],
      "check_result": [
        26
      ]
    }
  }
};

const ValidParenthesisStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid 1",
    "value": {
      "s": "(*))"
    }
  },
  {
    "id": "ex2",
    "label": "Valid 2",
    "value": {
      "s": "(*)"
    }
  },
  {
    "id": "ex3",
    "label": "Valid 3",
    "value": {
      "s": "(((*))"
    }
  },
  {
    "id": "ex4",
    "label": "Invalid",
    "value": {
      "s": "*))"
    }
  }
];

function generateValidParenthesisStringSteps(e: any): any[] {
  

let n=e.s,t=n.split(""),o=t.reduce((e,n,t)=>(e[`char_${t}`]={type:"arrayElement",value:n,position:t},e),{}),r=new StepRecorder({s:n},{...o}),l=0,a=0,s=[],c=()=>r.update_variable("band",s.map(e=>[e[0],e[1]])),d=(e,n)=>{r.update_variable("prevLow",e),r.update_variable("prevHigh",n)},u=()=>{r.delete_variable("prevLow"),r.delete_variable("prevHigh")};r.record("-","Track the range [low, high] of possible open-bracket counts."),r.update_variable("low",l),r.update_variable("high",a),c(),r.record("init","low = 0, high = 0. A '*' can be '(', ')', or empty.");for(let e=0;e<t.length;e++){let n=t[e];if(r.update_variable("i",e),r.update_variable("c",n),r.update_visual("curr",{type:"pointer",position:e,label:"i"}),u(),s[e]=[l,a],c(),r.record("loop",`Character at index ${e}: '${n}'`),"("===n?(r.add_conditional("check_open",!0),r.record("check_open","'(' must be an open bracket"),d(l,a),l++,a++,s[e]=[l,a],r.update_variable("low",l),r.update_variable("high",a),c(),r.record("inc_both",`'(' → low + 1, high + 1  (now ${l}, ${a})`)):")"===n?(r.add_conditional("check_open",!1),r.add_conditional("check_close",!0),r.record("check_close","')' must be a close bracket"),d(l,a),l--,a--,s[e]=[l,a],r.update_variable("low",l),r.update_variable("high",a),c(),r.record("dec_both",`')' → low - 1, high - 1  (now ${l}, ${a})`)):(r.add_conditional("check_open",!1),r.add_conditional("check_close",!1),r.add_conditional("check_star",!0),r.record("check_star","'*' is a wildcard: '(', ')', or empty"),d(l,a),l--,a++,s[e]=[l,a],r.update_variable("low",l),r.update_variable("high",a),c(),r.record("star_range",`'*' → low - 1, high + 1  (widen to ${l}..${a})`)),a<0)return r.add_conditional("check_high",!0),r.update_variable("return",!1),u(),r.record("return_false","high < 0: too many ')' to ever balance. Invalid!"),r.getSteps();r.add_conditional("check_high",!1),u(),r.record("check_high",`high = ${a} ≥ 0, still balanceable`),l<0?(d(l,a),l=0,s[e]=[l,a],r.update_variable("low",l),c(),r.record("clamp_low","low was negative, clamp it back up to 0")):(u(),r.record("clamp_low",`low = ${l} ≥ 0, no clamp needed`))}let p=0===l;return r.delete_visual("curr"),r.delete_variable("i"),r.delete_variable("c"),u(),r.update_variable("return",p),p?(r.add_conditional("check_result",!0),r.record("check_result","low == 0: the range can reach a balanced 0. Valid!")):(r.add_conditional("check_result",!1),r.record("check_result",`low = ${l} ≠ 0: can't reach 0 open brackets. Invalid!`)),r.record("complete",`Return ${p}`),r.getSteps()
}

export function ValidParenthesisStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidParenthesisStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidParenthesisStringSteps(e) as any[];
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
      title="Valid Parenthesis String"
      slug="valid-parenthesis-string"
      approaches={approaches}
      presets={ValidParenthesisStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Validate Stack Sequences (validate-stack-sequences)
// ==========================================

const ValidateStackSequencesTemplates = {
  "python": {
    "language": "python",
    "code": "def validateStackSequences(pushed, popped):\n    top = 0  # Virtual stack pointer within the pushed array\n    pop_idx = 0\n\n    for val in pushed:\n        pushed[top] = val  # \"Push\" onto the virtual stack\n        top += 1\n\n        # \"Pop\" from the virtual stack while top matches next expected pop\n        while top > 0 and pushed[top - 1] == popped[pop_idx]:\n            top -= 1\n            pop_idx += 1\n\n    return top == 0",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "push_val": [
        6,
        7
      ],
      "check_pop": [
        10
      ],
      "pop_match": [
        11,
        12
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_pop": [
        10
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean validateStackSequences(int[] pushed, int[] popped) {\n    int top = 0;  // Virtual stack pointer within the pushed array\n    int popIdx = 0;\n\n    for (int val : pushed) {\n        pushed[top] = val;  // \"Push\" onto the virtual stack\n        top++;\n\n        // \"Pop\" from the virtual stack while top matches next expected pop\n        while (top > 0 && pushed[top - 1] == popped[popIdx]) {\n            top--;\n            popIdx++;\n        }\n    }\n\n    return top == 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "push_val": [
        6,
        7
      ],
      "check_pop": [
        10
      ],
      "pop_match": [
        11,
        12
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_pop": [
        10
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool validateStackSequences(vector<int>& pushed, vector<int>& popped) {\n    int top = 0;  // Virtual stack pointer within the pushed array\n    int popIdx = 0;\n\n    for (int val : pushed) {\n        pushed[top] = val;  // \"Push\" onto the virtual stack\n        top++;\n\n        // \"Pop\" from the virtual stack while top matches next expected pop\n        while (top > 0 && pushed[top - 1] == popped[popIdx]) {\n            top--;\n            popIdx++;\n        }\n    }\n\n    return top == 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "push_val": [
        6,
        7
      ],
      "check_pop": [
        10
      ],
      "pop_match": [
        11,
        12
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_pop": [
        10
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool ValidateStackSequences(int[] pushed, int[] popped) {\n    int top = 0;  // Virtual stack pointer within the pushed array\n    int popIdx = 0;\n\n    foreach (int val in pushed) {\n        pushed[top] = val;  // \"Push\" onto the virtual stack\n        top++;\n\n        // \"Pop\" from the virtual stack while top matches next expected pop\n        while (top > 0 && pushed[top - 1] == popped[popIdx]) {\n            top--;\n            popIdx++;\n        }\n    }\n\n    return top == 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "push_val": [
        6,
        7
      ],
      "check_pop": [
        10
      ],
      "pop_match": [
        11,
        12
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_pop": [
        10
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func validateStackSequences(pushed []int, popped []int) bool {\n    top := 0  // Virtual stack pointer within the pushed array\n    popIdx := 0\n\n    for _, val := range pushed {\n        pushed[top] = val  // \"Push\" onto the virtual stack\n        top++\n\n        // \"Pop\" from the virtual stack while top matches next expected pop\n        for top > 0 && pushed[top-1] == popped[popIdx] {\n            top--\n            popIdx++\n        }\n    }\n\n    return top == 0\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "push_val": [
        6,
        7
      ],
      "check_pop": [
        10
      ],
      "pop_match": [
        11,
        12
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_pop": [
        10
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function validateStackSequences(pushed, popped) {\n    let top = 0;  // Virtual stack pointer within the pushed array\n    let popIdx = 0;\n\n    for (const val of pushed) {\n        pushed[top] = val;  // \"Push\" onto the virtual stack\n        top++;\n\n        // \"Pop\" from the virtual stack while top matches next expected pop\n        while (top > 0 && pushed[top - 1] === popped[popIdx]) {\n            top--;\n            popIdx++;\n        }\n    }\n\n    return top === 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "push_val": [
        6,
        7
      ],
      "check_pop": [
        10
      ],
      "pop_match": [
        11,
        12
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_pop": [
        10
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function validateStackSequences(pushed: number[], popped: number[]): boolean {\n    let top = 0;  // Virtual stack pointer within the pushed array\n    let popIdx = 0;\n\n    for (const val of pushed) {\n        pushed[top] = val;  // \"Push\" onto the virtual stack\n        top++;\n\n        // \"Pop\" from the virtual stack while top matches next expected pop\n        while (top > 0 && pushed[top - 1] === popped[popIdx]) {\n            top--;\n            popIdx++;\n        }\n    }\n\n    return top === 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "loop": [
        5
      ],
      "push_val": [
        6,
        7
      ],
      "check_pop": [
        10
      ],
      "pop_match": [
        11,
        12
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_pop": [
        10
      ],
      "loop_end": [
        5
      ],
      "check_result": [
        16
      ]
    }
  }
};

const ValidateStackSequencesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid",
    "value": {
      "pushed": [
        1,
        2,
        3,
        4,
        5
      ],
      "popped": [
        4,
        5,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Invalid",
    "value": {
      "pushed": [
        1,
        2,
        3,
        4,
        5
      ],
      "popped": [
        4,
        3,
        5,
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Pop immediately",
    "value": {
      "pushed": [
        1,
        2,
        3
      ],
      "popped": [
        1,
        2,
        3
      ]
    }
  }
];

function generateValidateStackSequencesSteps(e: any): any[] {
  

let t=e.pushed,p=e.popped,a=t.length,n=t.reduce((e,t,p)=>(e[`pushed_${p}`]={type:"arrayElement",value:t,position:p},e),{}),i=p.reduce((e,t,p)=>(e[`popped_${p}`]={type:"arrayElement",value:t,position:p},e),{}),l=new StepRecorder({pushed:[...t],popped:[...p]},{...n,...i}),s=[],r=(e,p)=>l.update_visual(`pushed_${e}`,{type:"arrayElement",value:t[e],position:e,state:p}),c=(e,t)=>l.update_visual(`popped_${e}`,{type:"arrayElement",value:p[e],position:e,state:t}),d=e=>{for(let e=0;e<=a;e++)l.delete_visual(`stack_${e}`);s.forEach((t,p)=>{l.update_visual(`stack_${p}`,{type:"stackElement",value:t,position:p,state:e?.entering&&p===s.length-1?"entering":void 0})}),e?.exiting&&l.update_visual(`stack_${e.exiting.pos}`,{type:"stackElement",value:e.exiting.val,position:e.exiting.pos,state:"exiting"}),l.update_variable("top",s.length)},u=e=>{e<a?l.update_variable("need",p[e]):l.delete_variable("need")};l.record("-","Simulate a stack: push in order, pop greedily when the top matches.");let h=0;l.add_new_variable("top",0),l.add_new_variable("popIdx",h),u(h),l.update_visual("push_ptr",{type:"pointer",position:0,label:"i"}),l.update_visual("pop_ptr",{type:"pointer",position:0,label:"popIdx"}),l.record("init","top = 0 (empty stack), popIdx = 0");for(let e=0;e<a;e++){let o=t[e];l.update_variable("i",e),l.update_variable("val",o),u(h),l.update_visual("push_ptr",{type:"pointer",position:e,label:"i"}),h<a&&l.update_visual("pop_ptr",{type:"pointer",position:h,label:"popIdx"});for(let t=0;t<a;t++)r(t,t===e?"current":t<e?"consumed":void 0);for(h<a&&c(h,"target"),d(),l.record("loop",`Next to push: pushed[${e}] = ${o}`),s.push(o),r(e,"consumed"),d({entering:!0}),l.record("push_val",`Push ${o} onto the stack`);s.length>0&&h<a&&s[s.length-1]===p[h];){l.add_conditional("check_pop",!0),u(h),l.update_visual(`stack_${s.length-1}`,{type:"stackElement",value:s[s.length-1],position:s.length-1,state:"active"}),c(h,"target"),l.record("check_pop",`top ${s[s.length-1]} == popped[${h}] ${p[h]}, match`);let e=s.pop();c(h,"matched"),h++,l.update_variable("popIdx",h),u(h),h<a?l.update_visual("pop_ptr",{type:"pointer",position:h,label:"popIdx"}):l.delete_visual("pop_ptr"),d({exiting:{val:e,pos:s.length}}),l.record("pop_match",`Pop ${e} off the stack (popIdx = ${h})`)}s.length>0&&h<a?(l.add_conditional("check_pop",!1),l.update_visual(`stack_${s.length-1}`,{type:"stackElement",value:s[s.length-1],position:s.length-1,state:"active"}),c(h,"target"),l.record("check_pop",`top ${s[s.length-1]} ≠ popped[${h}] ${p[h]}, push more`)):(l.add_conditional("check_pop",!1),l.record("check_pop",0===s.length?"Stack is empty, keep pushing":"All elements popped"))}l.add_conditional("loop_end",!0),l.delete_visual("push_ptr"),l.delete_variable("i"),l.delete_variable("val");for(let e=0;e<a;e++)r(e,"consumed");d(),l.record("loop_end","Every element from pushed has been processed");let x=0===s.length;if(l.update_variable("return",x),x){l.add_conditional("check_result",!0);for(let e=0;e<a;e++)c(e,"matched");l.delete_variable("need"),l.record("check_result","Stack is empty (top == 0): the pop sequence is achievable. Valid!")}else l.add_conditional("check_result",!1),l.update_visual(`stack_${s.length-1}`,{type:"stackElement",value:s[s.length-1],position:s.length-1,state:"blocked"}),h<a&&c(h,"blocked"),l.record("check_result",`Stack still holds ${s.length} element${1===s.length?"":"s"} (top = ${s[s.length-1]}). Invalid!`);return l.record("complete",`Return ${x}`),l.getSteps()
}

export function ValidateStackSequencesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidateStackSequencesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidateStackSequencesSteps(e) as any[];
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
      title="Validate Stack Sequences"
      slug="validate-stack-sequences"
      approaches={approaches}
      presets={ValidateStackSequencesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Final Prices With a Special Discount in a Shop (final-prices-with-a-special-discount-in-a-shop)
// ==========================================

const FinalPricesWithASpecialDiscountInAShopTemplates = {
  "python": {
    "language": "python",
    "code": "def finalPrices(prices):\n    result = prices[:]\n    stack = []\n\n    for j in range(len(prices)):\n        while stack and prices[j] <= prices[stack[-1]]:\n            i = stack.pop()\n            result[i] = prices[i] - prices[j]\n\n        stack.append(j)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_price": [
        5
      ],
      "pop_and_discount": [
        7
      ],
      "update_result": [
        8
      ],
      "push_stack": [
        10
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "stack_not_empty_and_leq": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] finalPrices(int[] prices) {\n    int n = prices.length;\n    int[] result = new int[n];\n    Deque<Integer> stack = new ArrayDeque<>();\n    for (int i = 0; i < n; i++) {\n        result[i] = prices[i];\n    }\n\n    for (int j = 0; j < n; j++) {\n        while (!stack.isEmpty() && prices[j] <= prices[stack.peek()]) {\n            int i = stack.pop();\n            result[i] = prices[i] - prices[j];\n        }\n\n        stack.push(j);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6,
        7
      ],
      "check_price": [
        9
      ],
      "pop_and_discount": [
        11
      ],
      "update_result": [
        12
      ],
      "push_stack": [
        15
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "stack_not_empty_and_leq": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> finalPrices(vector<int>& prices) {\n    int n = prices.size();\n    vector<int> result(prices.begin(), prices.end());\n    stack<int> stk;\n\n    for (int j = 0; j < n; j++) {\n        while (!stk.empty() && prices[j] <= prices[stk.top()]) {\n            int i = stk.top();\n            stk.pop();\n            result[i] = prices[i] - prices[j];\n        }\n\n        stk.push(j);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "check_price": [
        6
      ],
      "pop_and_discount": [
        8,
        9
      ],
      "update_result": [
        10
      ],
      "push_stack": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "stack_not_empty_and_leq": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] FinalPrices(int[] prices) {\n    int n = prices.Length;\n    int[] result = (int[])prices.Clone();\n    Stack<int> stack = new Stack<int>();\n\n    for (int j = 0; j < n; j++) {\n        while (stack.Count > 0 && prices[j] <= prices[stack.Peek()]) {\n            int i = stack.Pop();\n            result[i] = prices[i] - prices[j];\n        }\n\n        stack.Push(j);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "check_price": [
        6
      ],
      "pop_and_discount": [
        8
      ],
      "update_result": [
        9
      ],
      "push_stack": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "stack_not_empty_and_leq": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func finalPrices(prices []int) []int {\n    n := len(prices)\n    result := make([]int, n)\n    copy(result, prices)\n    stack := []int{}\n\n    for j := 0; j < n; j++ {\n        for len(stack) > 0 && prices[j] <= prices[stack[len(stack)-1]] {\n            i := stack[len(stack)-1]\n            stack = stack[:len(stack)-1]\n            result[i] = prices[i] - prices[j]\n        }\n\n        stack = append(stack, j)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "check_price": [
        7
      ],
      "pop_and_discount": [
        9,
        10
      ],
      "update_result": [
        11
      ],
      "push_stack": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "stack_not_empty_and_leq": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function finalPrices(prices) {\n    const result = [...prices];\n    const stack = [];\n\n    for (let j = 0; j < prices.length; j++) {\n        while (stack.length > 0 && prices[j] <= prices[stack[stack.length - 1]]) {\n            const i = stack.pop();\n            result[i] = prices[i] - prices[j];\n        }\n\n        stack.push(j);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_price": [
        5
      ],
      "pop_and_discount": [
        7
      ],
      "update_result": [
        8
      ],
      "push_stack": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "stack_not_empty_and_leq": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function finalPrices(prices: number[]): number[] {\n    const result: number[] = [...prices];\n    const stack: number[] = [];\n\n    for (let j = 0; j < prices.length; j++) {\n        while (stack.length > 0 && prices[j] <= prices[stack[stack.length - 1]]) {\n            const i = stack.pop()!;\n            result[i] = prices[i] - prices[j];\n        }\n\n        stack.push(j);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_price": [
        5
      ],
      "pop_and_discount": [
        7
      ],
      "update_result": [
        8
      ],
      "push_stack": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "stack_not_empty_and_leq": [
        6
      ]
    }
  }
};

const FinalPricesWithASpecialDiscountInAShopPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "prices": [
        8,
        4,
        6,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "prices": [
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
    "label": "Input 3",
    "value": {
      "prices": [
        10,
        1,
        1,
        6
      ]
    }
  }
];

function generateFinalPricesWithASpecialDiscountInAShopSteps(e: any): any[] {
  

let t=e.prices,i=t.length,n=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=[],s=[...t],a=new StepRecorder({prices:t},{...n});a.update_variable("prices",[...t]),a.record("-","Start of algorithm"),a.update_variable("stack",[...l]),a.update_variable("stackIdxs",[...l]),a.update_variable("result",[...s]),a.record("initialize","Initialize an empty stack and result as a copy of prices");for(let e=0;e<i;e++){for(a.update_variable("j",e),a.update_variable("priceJ",t[e]),a.update_variable("stack",[...l]),a.update_variable("stackIdxs",[...l]),a.record("check_price",`Consider item ${e} with price ${t[e]}`),0===l.length&&a.add_conditional("stack_not_empty_and_leq",!1);l.length>0&&t[e]<=t[l[l.length-1]];){let i=l[l.length-1];l.pop(),a.add_conditional("stack_not_empty_and_leq",!0),a.update_variable("poppedIdx",i),a.update_variable("poppedVal",t[i]),a.update_variable("discount",t[e]),a.update_variable("stack",[...l]),a.update_variable("stackIdxs",[...l]),a.record("pop_and_discount",`prices[${e}] (${t[e]}) <= prices[${i}] (${t[i]}), so item ${i} gets a discount`),s[i]=t[i]-t[e],a.update_variable("result",[...s]),a.record("update_result",`result[${i}] = prices[${i}] - prices[${e}] = ${t[i]} - ${t[e]} = ${s[i]}`)}l.length>0&&t[e]>t[l[l.length-1]]&&a.add_conditional("stack_not_empty_and_leq",!1),l.push(e),a.update_variable("stack",[...l]),a.update_variable("stackIdxs",[...l]),a.record("push_stack",`No discount for item ${e} yet, push it onto the stack`)}return a.delete_variable("j"),a.delete_variable("poppedIdx"),a.record("complete",`Done. Final prices: [${s.join(", ")}]`),a.getSteps()
}

export function FinalPricesWithASpecialDiscountInAShopProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FinalPricesWithASpecialDiscountInAShopTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFinalPricesWithASpecialDiscountInAShopSteps(e) as any[];
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
      title="Final Prices With a Special Discount in a Shop"
      slug="final-prices-with-a-special-discount-in-a-shop"
      approaches={approaches}
      presets={FinalPricesWithASpecialDiscountInAShopPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Max Chunks To Make Sorted (max-chunks-to-make-sorted)
// ==========================================

const MaxChunksToMakeSortedTemplates = {
  "python": {
    "language": "python",
    "code": "def maxChunksToSorted(arr):\n    maxSoFar = 0\n    chunks = 0\n    for i in range(len(arr)):\n        maxSoFar = max(maxSoFar, arr[i])\n        if maxSoFar == i:\n            chunks += 1\n    return chunks",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        4
      ],
      "update_max": [
        5
      ],
      "chunk_found": [
        7
      ],
      "no_chunk": [
        6
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "is_chunk_boundary": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxChunksToSorted(int[] arr) {\n    int maxSoFar = 0;\n    int chunks = 0;\n    for (int i = 0; i < arr.length; i++) {\n        maxSoFar = Math.max(maxSoFar, arr[i]);\n        if (maxSoFar == i) {\n            chunks++;\n        }\n    }\n    return chunks;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        4
      ],
      "update_max": [
        5
      ],
      "chunk_found": [
        7
      ],
      "no_chunk": [
        6
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_chunk_boundary": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxChunksToSorted(vector<int>& arr) {\n    int maxSoFar = 0;\n    int chunks = 0;\n    for (int i = 0; i < arr.size(); i++) {\n        maxSoFar = max(maxSoFar, arr[i]);\n        if (maxSoFar == i) {\n            chunks++;\n        }\n    }\n    return chunks;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        4
      ],
      "update_max": [
        5
      ],
      "chunk_found": [
        7
      ],
      "no_chunk": [
        6
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_chunk_boundary": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxChunksToSorted(int[] arr) {\n    int maxSoFar = 0;\n    int chunks = 0;\n    for (int i = 0; i < arr.Length; i++) {\n        maxSoFar = Math.Max(maxSoFar, arr[i]);\n        if (maxSoFar == i) {\n            chunks++;\n        }\n    }\n    return chunks;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        4
      ],
      "update_max": [
        5
      ],
      "chunk_found": [
        7
      ],
      "no_chunk": [
        6
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_chunk_boundary": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxChunksToSorted(arr []int) int {\n    maxSoFar := 0\n    chunks := 0\n    for i := 0; i < len(arr); i++ {\n        if arr[i] > maxSoFar {\n            maxSoFar = arr[i]\n        }\n        if maxSoFar == i {\n            chunks++\n        }\n    }\n    return chunks\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        4
      ],
      "update_max": [
        5,
        6
      ],
      "chunk_found": [
        9
      ],
      "no_chunk": [
        8
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_chunk_boundary": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxChunksToSorted(arr) {\n    let maxSoFar = 0;\n    let chunks = 0;\n    for (let i = 0; i < arr.length; i++) {\n        maxSoFar = Math.max(maxSoFar, arr[i]);\n        if (maxSoFar === i) {\n            chunks++;\n        }\n    }\n    return chunks;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        4
      ],
      "update_max": [
        5
      ],
      "chunk_found": [
        7
      ],
      "no_chunk": [
        6
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_chunk_boundary": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxChunksToSorted(arr: number[]): number {\n    let maxSoFar = 0;\n    let chunks = 0;\n    for (let i = 0; i < arr.length; i++) {\n        maxSoFar = Math.max(maxSoFar, arr[i]);\n        if (maxSoFar === i) {\n            chunks++;\n        }\n    }\n    return chunks;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        4
      ],
      "update_max": [
        5
      ],
      "chunk_found": [
        7
      ],
      "no_chunk": [
        6
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_chunk_boundary": [
        6
      ]
    }
  }
};

const MaxChunksToMakeSortedPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "arr": [
        4,
        3,
        2,
        1,
        0
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "arr": [
        1,
        0,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "arr": [
        2,
        0,
        1,
        4,
        3,
        5
      ]
    }
  }
];

function generateMaxChunksToMakeSortedSteps(e: any): any[] {
  

let t=e.arr,r=t.length,a=t.reduce((e,t,r)=>(e[`elem_${r}`]={type:"arrayElement",value:t,position:r},e),{}),i=new StepRecorder({arr:t},{...a});i.update_variable("arr",[...t]),i.record("-","Start: split into the most chunks that can each be sorted alone");let l=0,s=0,o=0,u=[];i.update_variable("maxSoFar",l),i.update_variable("chunks",s),i.update_variable("chunkStart",o),i.update_variable("chunkRanges",[]),i.record("initialize","Initialize maxSoFar = 0, chunks = 0");for(let e=0;e<r;e++){i.update_variable("i",e),i.update_variable("val",t[e]),i.update_variable("maxSoFar",l),i.update_variable("chunkStart",o),i.update_variable("chunkRanges",u.map(e=>[...e])),i.update_variable("chunks",s),i.record("check_element",`Look at arr[${e}] = ${t[e]}`);let r=l;l=Math.max(l,t[e]),i.update_variable("maxSoFar",l),i.record("update_max",r!==l?`maxSoFar = max(${r}, ${t[e]}) = ${l}`:`maxSoFar stays ${l}`);let n=l===e;if(i.add_conditional("is_chunk_boundary",n),n){s++;let t=[o,e];u.push(t),i.update_variable("chunks",s),i.update_variable("chunkRanges",u.map(e=>[...e])),i.update_variable("lastChunk",[...t]),o=e+1,i.update_variable("chunkStart",o),i.record("chunk_found",`maxSoFar (${l}) == i (${e}): close a chunk. chunks = ${s}`)}else i.record("no_chunk",`maxSoFar (${l}) > i (${e}): chunk must still reach position ${l}`)}return i.delete_variable("i"),i.delete_variable("lastChunk"),i.record("complete",`Done. Maximum chunks = ${s}`),i.getSteps()
}

export function MaxChunksToMakeSortedProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaxChunksToMakeSortedTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaxChunksToMakeSortedSteps(e) as any[];
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
      title="Max Chunks To Make Sorted"
      slug="max-chunks-to-make-sorted"
      approaches={approaches}
      presets={MaxChunksToMakeSortedPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sum of Subarray Minimums (sum-of-subarray-minimums)
// ==========================================

const SumOfSubarrayMinimumsTemplates = {
  "python": {
    "language": "python",
    "code": "def sumSubarrayMins(arr):\n    MOD = 10**9 + 7\n    n = len(arr)\n    dp = [0] * n\n    stack = []\n    result = 0\n\n    for i in range(n):\n        while stack and arr[stack[-1]] >= arr[i]:\n            stack.pop()\n\n        if not stack:\n            dp[i] = arr[i] * (i + 1)\n        else:\n            j = stack[-1]\n            dp[i] = dp[j] + arr[i] * (i - j)\n\n        stack.append(i)\n        result = (result + dp[i]) % MOD\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_element": [
        8
      ],
      "pop_greater": [
        10
      ],
      "calc_dp_empty": [
        13
      ],
      "calc_dp_nonempty": [
        15,
        16
      ],
      "push_stack": [
        18
      ],
      "add_to_result": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "stack_empty_after_pop": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int sumSubarrayMins(int[] arr) {\n    int MOD = 1_000_000_007;\n    int n = arr.length;\n    long[] dp = new long[n];\n    Deque<Integer> stack = new ArrayDeque<>();\n    long result = 0;\n\n    for (int i = 0; i < n; i++) {\n        while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {\n            stack.pop();\n        }\n\n        if (stack.isEmpty()) {\n            dp[i] = (long) arr[i] * (i + 1);\n        } else {\n            int j = stack.peek();\n            dp[i] = dp[j] + (long) arr[i] * (i - j);\n        }\n\n        stack.push(i);\n        result = (result + dp[i]) % MOD;\n    }\n\n    return (int) result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_element": [
        8
      ],
      "pop_greater": [
        10
      ],
      "calc_dp_empty": [
        14
      ],
      "calc_dp_nonempty": [
        16,
        17
      ],
      "push_stack": [
        20
      ],
      "add_to_result": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "stack_empty_after_pop": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int sumSubarrayMins(vector<int>& arr) {\n    int MOD = 1e9 + 7;\n    int n = arr.size();\n    vector<long long> dp(n, 0);\n    stack<int> stk;\n    long long result = 0;\n\n    for (int i = 0; i < n; i++) {\n        while (!stk.empty() && arr[stk.top()] >= arr[i]) {\n            stk.pop();\n        }\n\n        if (stk.empty()) {\n            dp[i] = (long long) arr[i] * (i + 1);\n        } else {\n            int j = stk.top();\n            dp[i] = dp[j] + (long long) arr[i] * (i - j);\n        }\n\n        stk.push(i);\n        result = (result + dp[i]) % MOD;\n    }\n\n    return (int) result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_element": [
        8
      ],
      "pop_greater": [
        10
      ],
      "calc_dp_empty": [
        14
      ],
      "calc_dp_nonempty": [
        16,
        17
      ],
      "push_stack": [
        20
      ],
      "add_to_result": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "stack_empty_after_pop": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int SumSubarrayMins(int[] arr) {\n    int MOD = 1_000_000_007;\n    int n = arr.Length;\n    long[] dp = new long[n];\n    Stack<int> stack = new Stack<int>();\n    long result = 0;\n\n    for (int i = 0; i < n; i++) {\n        while (stack.Count > 0 && arr[stack.Peek()] >= arr[i]) {\n            stack.Pop();\n        }\n\n        if (stack.Count == 0) {\n            dp[i] = (long) arr[i] * (i + 1);\n        } else {\n            int j = stack.Peek();\n            dp[i] = dp[j] + (long) arr[i] * (i - j);\n        }\n\n        stack.Push(i);\n        result = (result + dp[i]) % MOD;\n    }\n\n    return (int) result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_element": [
        8
      ],
      "pop_greater": [
        10
      ],
      "calc_dp_empty": [
        14
      ],
      "calc_dp_nonempty": [
        16,
        17
      ],
      "push_stack": [
        20
      ],
      "add_to_result": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "stack_empty_after_pop": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func sumSubarrayMins(arr []int) int {\n    MOD := 1_000_000_007\n    n := len(arr)\n    dp := make([]int, n)\n    stack := []int{}\n    result := 0\n\n    for i := 0; i < n; i++ {\n        for len(stack) > 0 && arr[stack[len(stack)-1]] >= arr[i] {\n            stack = stack[:len(stack)-1]\n        }\n\n        if len(stack) == 0 {\n            dp[i] = arr[i] * (i + 1)\n        } else {\n            j := stack[len(stack)-1]\n            dp[i] = dp[j] + arr[i] * (i - j)\n        }\n\n        stack = append(stack, i)\n        result = (result + dp[i]) % MOD\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_element": [
        8
      ],
      "pop_greater": [
        10
      ],
      "calc_dp_empty": [
        14
      ],
      "calc_dp_nonempty": [
        16,
        17
      ],
      "push_stack": [
        20
      ],
      "add_to_result": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "stack_empty_after_pop": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function sumSubarrayMins(arr) {\n    const MOD = 1e9 + 7;\n    const n = arr.length;\n    const dp = new Array(n).fill(0);\n    const stack = [];\n    let result = 0;\n\n    for (let i = 0; i < n; i++) {\n        while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {\n            stack.pop();\n        }\n\n        if (stack.length === 0) {\n            dp[i] = arr[i] * (i + 1);\n        } else {\n            const j = stack[stack.length - 1];\n            dp[i] = dp[j] + arr[i] * (i - j);\n        }\n\n        stack.push(i);\n        result = (result + dp[i]) % MOD;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_element": [
        8
      ],
      "pop_greater": [
        10
      ],
      "calc_dp_empty": [
        14
      ],
      "calc_dp_nonempty": [
        16,
        17
      ],
      "push_stack": [
        20
      ],
      "add_to_result": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "stack_empty_after_pop": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sumSubarrayMins(arr: number[]): number {\n    const MOD = 1e9 + 7;\n    const n = arr.length;\n    const dp: number[] = new Array(n).fill(0);\n    const stack: number[] = [];\n    let result = 0;\n\n    for (let i = 0; i < n; i++) {\n        while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {\n            stack.pop();\n        }\n\n        if (stack.length === 0) {\n            dp[i] = arr[i] * (i + 1);\n        } else {\n            const j = stack[stack.length - 1];\n            dp[i] = dp[j] + arr[i] * (i - j);\n        }\n\n        stack.push(i);\n        result = (result + dp[i]) % MOD;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_element": [
        8
      ],
      "pop_greater": [
        10
      ],
      "calc_dp_empty": [
        14
      ],
      "calc_dp_nonempty": [
        16,
        17
      ],
      "push_stack": [
        20
      ],
      "add_to_result": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "stack_empty_after_pop": [
        13
      ]
    }
  }
};

const SumOfSubarrayMinimumsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "arr": [
        3,
        1,
        2,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "arr": [
        11,
        81,
        94,
        43,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "arr": [
        1,
        2,
        3,
        4
      ]
    }
  }
];

function generateSumOfSubarrayMinimumsSteps(t: any): any[] {
  

let e=t.arr,r=e.length,a=e.reduce((t,e,r)=>(t[`elem_${r}`]={type:"arrayElement",value:e,position:r},t),{}),n=[],l=Array(r).fill(0),s=0,o=new StepRecorder({arr:e},{...a});o.update_variable("arr",[...e]),o.record("-","Start of algorithm"),o.update_variable("stack",[...n]),o.update_variable("stackIdxs",[...n]),o.update_variable("dpArr",[...l]),o.update_variable("result",s),o.record("initialize","Initialize an empty stack, dp filled with 0, result = 0");for(let t=0;t<r;t++){for(o.update_variable("i",t),o.update_variable("val",e[t]),o.update_variable("stackIdxs",[...n]),o.update_variable("dpArr",[...l]),o.update_variable("result",s),o.record("check_element",`Look at arr[${t}] = ${e[t]}`),0===n.length&&o.add_conditional("stack_empty_after_pop",!0);n.length>0&&e[n[n.length-1]]>=e[t];){let r=n[n.length-1];n.pop(),o.update_variable("poppedIdx",r),o.update_variable("stackIdxs",[...n]),o.record("pop_greater",`arr[${r}] = ${e[r]} >= ${e[t]}, pop it`)}if(0===n.length){let r=t+1,i=e[t]*r;l[t]=i%0x3b9aca07,o.add_conditional("stack_empty_after_pop",!0),o.update_variable("j",-1),o.update_variable("span",r),o.update_variable("contribution",i),o.update_variable("dpJ",0),o.update_variable("dpArr",[...l]),o.update_variable("dpI",l[t]),o.update_variable("stackIdxs",[...n]),o.record("calc_dp_empty",`no smaller element to the left: dp[${t}] = arr[${t}] * (${t} + 1) = ${e[t]} * ${r} = ${l[t]}`)}else{let r=n[n.length-1],i=t-r,a=e[t]*i;l[t]=(l[r]+a)%0x3b9aca07,o.add_conditional("stack_empty_after_pop",!1),o.update_variable("j",r),o.update_variable("span",i),o.update_variable("contribution",a),o.update_variable("dpJ",l[r]),o.update_variable("dpArr",[...l]),o.update_variable("dpI",l[t]),o.update_variable("stackIdxs",[...n]),o.record("calc_dp_nonempty",`j = ${r} (previous smaller): dp[${t}] = dp[${r}] + arr[${t}] * (${t} - ${r}) = ${l[r]} + ${e[t]} * ${i} = ${l[t]}`)}n.push(t),o.update_variable("stackIdxs",[...n]),o.record("push_stack",`Push index ${t} onto the stack`),s=(s+l[t])%0x3b9aca07,o.update_variable("addedDp",l[t]),o.update_variable("result",s),o.record("add_to_result",`result += dp[${t}] (${l[t]}) = ${s}`)}return o.delete_variable("i"),o.delete_variable("poppedIdx"),o.delete_variable("j"),o.record("complete",`Done. Sum of subarray minimums = ${s}`),o.getSteps()
}

export function SumOfSubarrayMinimumsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SumOfSubarrayMinimumsTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSumOfSubarrayMinimumsSteps(t) as any[];
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
      title="Sum of Subarray Minimums"
      slug="sum-of-subarray-minimums"
      approaches={approaches}
      presets={SumOfSubarrayMinimumsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sum of Subarray Ranges (sum-of-subarray-ranges)
// ==========================================

const SumOfSubarrayRangesTemplates = {
  "python": {
    "language": "python",
    "code": "def subArrayRanges(nums):\n    n = len(nums)\n    sum_of_maximums = sum_of_subarray_maximums(nums, n)\n    sum_of_minimums = sum_of_subarray_minimums(nums, n)\n    return sum_of_maximums - sum_of_minimums\n\ndef sum_of_subarray_minimums(nums, n):\n    total = 0\n    stack = []\n\n    for i in range(n + 1):\n        current_val = float('-inf') if i == n else nums[i]\n\n        while stack and nums[stack[-1]] >= current_val:\n            mid = stack.pop()\n            left_boundary = stack[-1] if stack else -1\n            right_boundary = i\n\n            left_count = mid - left_boundary\n            right_count = right_boundary - mid\n            total += nums[mid] * left_count * right_count\n\n        if i < n:\n            stack.append(i)\n\n    return total\n\ndef sum_of_subarray_maximums(nums, n):\n    total = 0\n    stack = []\n\n    for i in range(n + 1):\n        current_val = float('inf') if i == n else nums[i]\n\n        while stack and nums[stack[-1]] <= current_val:\n            mid = stack.pop()\n            left_boundary = stack[-1] if stack else -1\n            right_boundary = i\n\n            left_count = mid - left_boundary\n            right_count = right_boundary - mid\n            total += nums[mid] * left_count * right_count\n\n        if i < n:\n            stack.append(i)\n\n    return total",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        1,
        2,
        3,
        4,
        5
      ],
      "min_phase_start": [
        7,
        8,
        9,
        10
      ],
      "min_check": [
        11,
        12
      ],
      "min_pop": [
        15
      ],
      "min_calculate": [
        16,
        17,
        19,
        20,
        21
      ],
      "min_push": [
        23,
        24
      ],
      "max_phase_start": [
        28,
        29,
        30,
        31
      ],
      "max_check": [
        32,
        33
      ],
      "max_pop": [
        36
      ],
      "max_calculate": [
        37,
        38,
        40,
        41,
        42
      ],
      "max_push": [
        44,
        45
      ],
      "final_result": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "min_should_pop": [
        14
      ],
      "max_should_pop": [
        35
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public long subArrayRanges(int[] nums) {\n    int n = nums.length;\n    long sumOfMaximums = sumOfSubarrayMaximums(nums, n);\n    long sumOfMinimums = sumOfSubarrayMinimums(nums, n);\n    return sumOfMaximums - sumOfMinimums;\n}\n\nprivate long sumOfSubarrayMinimums(int[] nums, int n) {\n    long sum = 0;\n    int[] stack = new int[n];\n    int top = -1;\n\n    for (int i = 0; i <= n; i++) {\n        int currentVal = (i == n) ? Integer.MIN_VALUE : nums[i];\n\n        while (top >= 0 && nums[stack[top]] >= currentVal) {\n            int mid = stack[top--];\n            int leftBoundary = (top >= 0) ? stack[top] : -1;\n            int rightBoundary = i;\n\n            long leftCount = mid - leftBoundary;\n            long rightCount = rightBoundary - mid;\n            sum += (long) nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stack[++top] = i;\n    }\n\n    return sum;\n}\n\nprivate long sumOfSubarrayMaximums(int[] nums, int n) {\n    long sum = 0;\n    int[] stack = new int[n];\n    int top = -1;\n\n    for (int i = 0; i <= n; i++) {\n        int currentVal = (i == n) ? Integer.MAX_VALUE : nums[i];\n\n        while (top >= 0 && nums[stack[top]] <= currentVal) {\n            int mid = stack[top--];\n            int leftBoundary = (top >= 0) ? stack[top] : -1;\n            int rightBoundary = i;\n\n            long leftCount = mid - leftBoundary;\n            long rightCount = rightBoundary - mid;\n            sum += (long) nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stack[++top] = i;\n    }\n\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "min_phase_start": [
        8,
        9,
        10,
        11,
        12
      ],
      "min_check": [
        13,
        14
      ],
      "min_pop": [
        17
      ],
      "min_calculate": [
        18,
        19,
        21,
        22,
        23
      ],
      "min_push": [
        25
      ],
      "max_phase_start": [
        31,
        32,
        33,
        34,
        35
      ],
      "max_check": [
        36,
        37
      ],
      "max_pop": [
        40
      ],
      "max_calculate": [
        41,
        42,
        44,
        45,
        46
      ],
      "max_push": [
        48
      ],
      "final_result": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "min_should_pop": [
        16
      ],
      "max_should_pop": [
        39
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "long long subArrayRanges(vector<int>& nums) {\n    int n = nums.size();\n    long long sumOfMaximums = sumOfSubarrayMaximums(nums, n);\n    long long sumOfMinimums = sumOfSubarrayMinimums(nums, n);\n    return sumOfMaximums - sumOfMinimums;\n}\n\nlong long sumOfSubarrayMinimums(vector<int>& nums, int n) {\n    long long sum = 0;\n    vector<int> stk;\n\n    for (int i = 0; i <= n; i++) {\n        int currentVal = (i == n) ? INT_MIN : nums[i];\n\n        while (!stk.empty() && nums[stk.back()] >= currentVal) {\n            int mid = stk.back();\n            stk.pop_back();\n            int leftBoundary = stk.empty() ? -1 : stk.back();\n            int rightBoundary = i;\n\n            long long leftCount = mid - leftBoundary;\n            long long rightCount = rightBoundary - mid;\n            sum += (long long) nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stk.push_back(i);\n    }\n\n    return sum;\n}\n\nlong long sumOfSubarrayMaximums(vector<int>& nums, int n) {\n    long long sum = 0;\n    vector<int> stk;\n\n    for (int i = 0; i <= n; i++) {\n        int currentVal = (i == n) ? INT_MAX : nums[i];\n\n        while (!stk.empty() && nums[stk.back()] <= currentVal) {\n            int mid = stk.back();\n            stk.pop_back();\n            int leftBoundary = stk.empty() ? -1 : stk.back();\n            int rightBoundary = i;\n\n            long long leftCount = mid - leftBoundary;\n            long long rightCount = rightBoundary - mid;\n            sum += (long long) nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stk.push_back(i);\n    }\n\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "min_phase_start": [
        8,
        9,
        10,
        11
      ],
      "min_check": [
        12,
        13
      ],
      "min_pop": [
        16,
        17
      ],
      "min_calculate": [
        18,
        19,
        21,
        22,
        23
      ],
      "min_push": [
        25
      ],
      "max_phase_start": [
        31,
        32,
        33,
        34
      ],
      "max_check": [
        35,
        36
      ],
      "max_pop": [
        39,
        40
      ],
      "max_calculate": [
        41,
        42,
        44,
        45,
        46
      ],
      "max_push": [
        48
      ],
      "final_result": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "min_should_pop": [
        15
      ],
      "max_should_pop": [
        38
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public long SubArrayRanges(int[] nums) {\n    int n = nums.Length;\n    long sumOfMaximums = SumOfSubarrayMaximums(nums, n);\n    long sumOfMinimums = SumOfSubarrayMinimums(nums, n);\n    return sumOfMaximums - sumOfMinimums;\n}\n\nprivate long SumOfSubarrayMinimums(int[] nums, int n) {\n    long sum = 0;\n    var stack = new Stack<int>();\n\n    for (int i = 0; i <= n; i++) {\n        int currentVal = (i == n) ? int.MinValue : nums[i];\n\n        while (stack.Count > 0 && nums[stack.Peek()] >= currentVal) {\n            int mid = stack.Pop();\n            int leftBoundary = stack.Count > 0 ? stack.Peek() : -1;\n            int rightBoundary = i;\n\n            long leftCount = mid - leftBoundary;\n            long rightCount = rightBoundary - mid;\n            sum += (long) nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stack.Push(i);\n    }\n\n    return sum;\n}\n\nprivate long SumOfSubarrayMaximums(int[] nums, int n) {\n    long sum = 0;\n    var stack = new Stack<int>();\n\n    for (int i = 0; i <= n; i++) {\n        int currentVal = (i == n) ? int.MaxValue : nums[i];\n\n        while (stack.Count > 0 && nums[stack.Peek()] <= currentVal) {\n            int mid = stack.Pop();\n            int leftBoundary = stack.Count > 0 ? stack.Peek() : -1;\n            int rightBoundary = i;\n\n            long leftCount = mid - leftBoundary;\n            long rightCount = rightBoundary - mid;\n            sum += (long) nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stack.Push(i);\n    }\n\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "min_phase_start": [
        8,
        9,
        10,
        11
      ],
      "min_check": [
        12,
        13
      ],
      "min_pop": [
        16
      ],
      "min_calculate": [
        17,
        18,
        20,
        21,
        22
      ],
      "min_push": [
        24
      ],
      "max_phase_start": [
        30,
        31,
        32,
        33
      ],
      "max_check": [
        34,
        35
      ],
      "max_pop": [
        38
      ],
      "max_calculate": [
        39,
        40,
        42,
        43,
        44
      ],
      "max_push": [
        46
      ],
      "final_result": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "min_should_pop": [
        15
      ],
      "max_should_pop": [
        37
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func subArrayRanges(nums []int) int64 {\n    n := len(nums)\n    sumOfMaximums := sumOfSubarrayMaximums(nums, n)\n    sumOfMinimums := sumOfSubarrayMinimums(nums, n)\n    return sumOfMaximums - sumOfMinimums\n}\n\nfunc sumOfSubarrayMinimums(nums []int, n int) int64 {\n    var sum int64\n    stack := []int{}\n\n    for i := 0; i <= n; i++ {\n        currentVal := -1 << 62\n        if i < n {\n            currentVal = nums[i]\n        }\n\n        for len(stack) > 0 && nums[stack[len(stack)-1]] >= currentVal {\n            mid := stack[len(stack)-1]\n            stack = stack[:len(stack)-1]\n            leftBoundary := -1\n            if len(stack) > 0 {\n                leftBoundary = stack[len(stack)-1]\n            }\n            rightBoundary := i\n\n            leftCount := int64(mid - leftBoundary)\n            rightCount := int64(rightBoundary - mid)\n            sum += int64(nums[mid]) * leftCount * rightCount\n        }\n        if i < n {\n            stack = append(stack, i)\n        }\n    }\n\n    return sum\n}\n\nfunc sumOfSubarrayMaximums(nums []int, n int) int64 {\n    var sum int64\n    stack := []int{}\n\n    for i := 0; i <= n; i++ {\n        currentVal := 1 << 62\n        if i < n {\n            currentVal = nums[i]\n        }\n\n        for len(stack) > 0 && nums[stack[len(stack)-1]] <= currentVal {\n            mid := stack[len(stack)-1]\n            stack = stack[:len(stack)-1]\n            leftBoundary := -1\n            if len(stack) > 0 {\n                leftBoundary = stack[len(stack)-1]\n            }\n            rightBoundary := i\n\n            leftCount := int64(mid - leftBoundary)\n            rightCount := int64(rightBoundary - mid)\n            sum += int64(nums[mid]) * leftCount * rightCount\n        }\n        if i < n {\n            stack = append(stack, i)\n        }\n    }\n\n    return sum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "min_phase_start": [
        8,
        9,
        10,
        11
      ],
      "min_check": [
        12,
        13,
        15
      ],
      "min_pop": [
        19,
        20
      ],
      "min_calculate": [
        21,
        23,
        25,
        27,
        28,
        29
      ],
      "min_push": [
        31,
        32
      ],
      "max_phase_start": [
        39,
        40,
        41,
        42
      ],
      "max_check": [
        43,
        44,
        46
      ],
      "max_pop": [
        50,
        51
      ],
      "max_calculate": [
        52,
        54,
        56,
        58,
        59,
        60
      ],
      "max_push": [
        62,
        63
      ],
      "final_result": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "min_should_pop": [
        18
      ],
      "max_should_pop": [
        49
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var subArrayRanges = function(nums) {\n    const n = nums.length;\n    const sumOfMaximums = sumOfSubarrayMaximums(nums, n);\n    const sumOfMinimums = sumOfSubarrayMinimums(nums, n);\n    return sumOfMaximums - sumOfMinimums;\n};\n\nfunction sumOfSubarrayMinimums(nums, n) {\n    let sum = 0;\n    const stack = [];\n\n    for (let i = 0; i <= n; i++) {\n        const currentVal = i === n ? -Infinity : nums[i];\n\n        while (stack.length > 0 && nums[stack[stack.length - 1]] >= currentVal) {\n            const mid = stack.pop();\n            const leftBoundary = stack.length > 0 ? stack[stack.length - 1] : -1;\n            const rightBoundary = i;\n\n            const leftCount = mid - leftBoundary;\n            const rightCount = rightBoundary - mid;\n            sum += nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stack.push(i);\n    }\n\n    return sum;\n}\n\nfunction sumOfSubarrayMaximums(nums, n) {\n    let sum = 0;\n    const stack = [];\n\n    for (let i = 0; i <= n; i++) {\n        const currentVal = i === n ? Infinity : nums[i];\n\n        while (stack.length > 0 && nums[stack[stack.length - 1]] <= currentVal) {\n            const mid = stack.pop();\n            const leftBoundary = stack.length > 0 ? stack[stack.length - 1] : -1;\n            const rightBoundary = i;\n\n            const leftCount = mid - leftBoundary;\n            const rightCount = rightBoundary - mid;\n            sum += nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stack.push(i);\n    }\n\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "min_phase_start": [
        8,
        9,
        10,
        11
      ],
      "min_check": [
        12,
        13
      ],
      "min_pop": [
        16
      ],
      "min_calculate": [
        17,
        18,
        20,
        21,
        22
      ],
      "min_push": [
        24
      ],
      "max_phase_start": [
        30,
        31,
        32,
        33
      ],
      "max_check": [
        34,
        35
      ],
      "max_pop": [
        38
      ],
      "max_calculate": [
        39,
        40,
        42,
        43,
        44
      ],
      "max_push": [
        46
      ],
      "final_result": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "min_should_pop": [
        15
      ],
      "max_should_pop": [
        37
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function subArrayRanges(nums: number[]): number {\n    const n = nums.length;\n    const sumOfMaximums = sumOfSubarrayMaximums(nums, n);\n    const sumOfMinimums = sumOfSubarrayMinimums(nums, n);\n    return sumOfMaximums - sumOfMinimums;\n}\n\nfunction sumOfSubarrayMinimums(nums: number[], n: number): number {\n    let sum = 0;\n    const stack: number[] = [];\n\n    for (let i = 0; i <= n; i++) {\n        const currentVal = i === n ? -Infinity : nums[i];\n\n        while (stack.length > 0 && nums[stack[stack.length - 1]] >= currentVal) {\n            const mid = stack.pop()!;\n            const leftBoundary = stack.length > 0 ? stack[stack.length - 1] : -1;\n            const rightBoundary = i;\n\n            const leftCount = mid - leftBoundary;\n            const rightCount = rightBoundary - mid;\n            sum += nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stack.push(i);\n    }\n\n    return sum;\n}\n\nfunction sumOfSubarrayMaximums(nums: number[], n: number): number {\n    let sum = 0;\n    const stack: number[] = [];\n\n    for (let i = 0; i <= n; i++) {\n        const currentVal = i === n ? Infinity : nums[i];\n\n        while (stack.length > 0 && nums[stack[stack.length - 1]] <= currentVal) {\n            const mid = stack.pop()!;\n            const leftBoundary = stack.length > 0 ? stack[stack.length - 1] : -1;\n            const rightBoundary = i;\n\n            const leftCount = mid - leftBoundary;\n            const rightCount = rightBoundary - mid;\n            sum += nums[mid] * leftCount * rightCount;\n        }\n        if (i < n) stack.push(i);\n    }\n\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "min_phase_start": [
        8,
        9,
        10,
        11
      ],
      "min_check": [
        12,
        13
      ],
      "min_pop": [
        16
      ],
      "min_calculate": [
        17,
        18,
        20,
        21,
        22
      ],
      "min_push": [
        24
      ],
      "max_phase_start": [
        30,
        31,
        32,
        33
      ],
      "max_check": [
        34,
        35
      ],
      "max_pop": [
        38
      ],
      "max_calculate": [
        39,
        40,
        42,
        43,
        44
      ],
      "max_push": [
        46
      ],
      "final_result": [
        5
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "min_should_pop": [
        15
      ],
      "max_should_pop": [
        37
      ]
    }
  }
};

const SumOfSubarrayRangesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        3,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        4,
        1,
        2,
        3
      ]
    }
  }
];

function generateSumOfSubarrayRangesSteps(t: any): any[] {
  

let e=t.nums,n=e.length,a=e.reduce((t,e,n)=>(t[`elem_${n}`]={type:"arrayElement",value:e,position:n},t),{}),r=new StepRecorder({nums:e},{...a});r.update_variable("nums",[...e]),r.record("-","Start: sum of subarray ranges = sum of maxes - sum of mins");let s=0,l=0;r.update_variable("sumMin",s),r.update_variable("sumMax",l),r.update_variable("stackIdxs",[]),r.record("initialize","Initialize sumMin = 0, sumMax = 0");let u=[];r.update_variable("phase","min"),r.update_variable("stackIdxs",[]),r.record("min_phase_start","Min phase: pop with an increasing stack to sum every subarray's minimum");for(let t=0;t<=n;t++){let i=t===n?Number.MIN_SAFE_INTEGER:e[t];for(r.update_variable("i",t),r.update_variable("phase","min"),r.update_variable("stackIdxs",[...u]),r.update_variable("sumMin",s),t<n&&r.update_variable("val",e[t]),r.add_conditional("min_should_pop",u.length>0&&e[u[u.length-1]]>=i),r.record("min_check",t<n?`Check i = ${t}, nums[${t}] = ${e[t]}`:"End of array: flush the stack");u.length>0&&e[u[u.length-1]]>=i;){let n=u[u.length-1];u.pop();let a=u.length>0?u[u.length-1]:-1,l=n-a,o=t-n;r.update_variable("poppedMid",n),r.update_variable("leftBoundary",a),r.update_variable("leftCount",l),r.update_variable("rightCount",o),r.update_variable("stackIdxs",[...u]),r.record("min_pop",`Pop index ${n} (min of ${l} x ${o} subarrays)`);let m=e[n]*l*o;s+=m,r.update_variable("contribution",m),r.update_variable("sumMin",s),r.record("min_calculate",`${e[n]} x ${l} x ${o} = ${m}; sumMin = ${s}`),r.add_conditional("min_should_pop",u.length>0&&e[u[u.length-1]]>=i)}t<n&&(u.push(t),r.update_variable("stackIdxs",[...u]),r.record("min_push",`Push index ${t} onto the stack`))}let o=[];r.update_variable("phase","max"),r.update_variable("stackIdxs",[]),r.record("max_phase_start","Max phase: pop with a decreasing stack to sum every subarray's maximum");for(let t=0;t<=n;t++){let i=t===n?Number.MAX_SAFE_INTEGER:e[t];for(r.update_variable("i",t),r.update_variable("phase","max"),r.update_variable("stackIdxs",[...o]),r.update_variable("sumMax",l),t<n&&r.update_variable("val",e[t]),r.add_conditional("max_should_pop",o.length>0&&e[o[o.length-1]]<=i),r.record("max_check",t<n?`Check i = ${t}, nums[${t}] = ${e[t]}`:"End of array: flush the stack");o.length>0&&e[o[o.length-1]]<=i;){let n=o[o.length-1];o.pop();let a=o.length>0?o[o.length-1]:-1,s=n-a,u=t-n;r.update_variable("poppedMid",n),r.update_variable("leftBoundary",a),r.update_variable("leftCount",s),r.update_variable("rightCount",u),r.update_variable("stackIdxs",[...o]),r.record("max_pop",`Pop index ${n} (max of ${s} x ${u} subarrays)`);let m=e[n]*s*u;l+=m,r.update_variable("contribution",m),r.update_variable("sumMax",l),r.record("max_calculate",`${e[n]} x ${s} x ${u} = ${m}; sumMax = ${l}`),r.add_conditional("max_should_pop",o.length>0&&e[o[o.length-1]]<=i)}t<n&&(o.push(t),r.update_variable("stackIdxs",[...o]),r.record("max_push",`Push index ${t} onto the stack`))}let m=l-s;return r.update_variable("phase","done"),r.update_variable("result",m),r.delete_variable("i"),r.delete_variable("poppedMid"),r.update_variable("stackIdxs",[]),r.record("final_result",`result = sumMax - sumMin = ${l} - ${s} = ${m}`),r.record("complete",`Done. Sum of subarray ranges = ${m}`),r.getSteps()
}

export function SumOfSubarrayRangesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SumOfSubarrayRangesTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSumOfSubarrayRangesSteps(t) as any[];
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
      title="Sum of Subarray Ranges"
      slug="sum-of-subarray-ranges"
      approaches={approaches}
      presets={SumOfSubarrayRangesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
