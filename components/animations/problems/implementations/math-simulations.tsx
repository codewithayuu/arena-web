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
      item.type === "token" ||
      item.type === "graphNode" ||
      item.type === "dpCell" ||
      item.type === "treeNode"
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
// Palindrome Number (palindrome-number)
// ==========================================

const PalindromeNumberTemplates = {
  "python": {
    "language": "python",
    "code": "def isPalindrome(x):\n    if x < 0 or (x % 10 == 0 and x != 0):\n        return False\n\n    reversed_half = 0\n    while x > reversed_half:\n        reversed_half = reversed_half * 10 + x % 10\n        x //= 10\n\n    return x == reversed_half or x == reversed_half // 10",
    "lineMap": {
      "-": [
        1
      ],
      "check_special": [
        2
      ],
      "reject": [
        3
      ],
      "complete_reject": [
        3
      ],
      "peel_digit": [
        7,
        8
      ],
      "compare": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_negative": [
        2
      ],
      "ends_in_zero": [
        2
      ],
      "x_greater_than_reversed": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean isPalindrome(int x) {\n        if (x < 0 || (x % 10 == 0 && x != 0)) {\n            return false;\n        }\n\n        int reversedHalf = 0;\n        while (x > reversedHalf) {\n            reversedHalf = reversedHalf * 10 + x % 10;\n            x /= 10;\n        }\n\n        return x == reversedHalf || x == reversedHalf / 10;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_special": [
        3
      ],
      "reject": [
        4
      ],
      "complete_reject": [
        4
      ],
      "peel_digit": [
        9,
        10
      ],
      "compare": [
        13
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_negative": [
        3
      ],
      "ends_in_zero": [
        3
      ],
      "x_greater_than_reversed": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        if (x < 0 || (x % 10 == 0 && x != 0)) {\n            return false;\n        }\n\n        int reversedHalf = 0;\n        while (x > reversedHalf) {\n            reversedHalf = reversedHalf * 10 + x % 10;\n            x /= 10;\n        }\n\n        return x == reversedHalf || x == reversedHalf / 10;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "check_special": [
        4
      ],
      "reject": [
        5
      ],
      "complete_reject": [
        5
      ],
      "peel_digit": [
        10,
        11
      ],
      "compare": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_negative": [
        4
      ],
      "ends_in_zero": [
        4
      ],
      "x_greater_than_reversed": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool IsPalindrome(int x) {\n        if (x < 0 || (x % 10 == 0 && x != 0)) {\n            return false;\n        }\n\n        int reversedHalf = 0;\n        while (x > reversedHalf) {\n            reversedHalf = reversedHalf * 10 + x % 10;\n            x /= 10;\n        }\n\n        return x == reversedHalf || x == reversedHalf / 10;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_special": [
        3
      ],
      "reject": [
        4
      ],
      "complete_reject": [
        4
      ],
      "peel_digit": [
        9,
        10
      ],
      "compare": [
        13
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_negative": [
        3
      ],
      "ends_in_zero": [
        3
      ],
      "x_greater_than_reversed": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isPalindrome(x int) bool {\n    if x < 0 || (x % 10 == 0 && x != 0) {\n        return false\n    }\n\n    reversedHalf := 0\n    for x > reversedHalf {\n        reversedHalf = reversedHalf * 10 + x % 10\n        x /= 10\n    }\n\n    return x == reversedHalf || x == reversedHalf / 10\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_special": [
        2
      ],
      "reject": [
        3
      ],
      "complete_reject": [
        3
      ],
      "peel_digit": [
        8,
        9
      ],
      "compare": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_negative": [
        2
      ],
      "ends_in_zero": [
        2
      ],
      "x_greater_than_reversed": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isPalindrome(x) {\n    if (x < 0 || (x % 10 === 0 && x !== 0)) {\n        return false;\n    }\n\n    let reversedHalf = 0;\n    while (x > reversedHalf) {\n        reversedHalf = reversedHalf * 10 + x % 10;\n        x = Math.floor(x / 10);\n    }\n\n    return x === reversedHalf || x === Math.floor(reversedHalf / 10);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_special": [
        2
      ],
      "reject": [
        3
      ],
      "complete_reject": [
        3
      ],
      "peel_digit": [
        8,
        9
      ],
      "compare": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_negative": [
        2
      ],
      "ends_in_zero": [
        2
      ],
      "x_greater_than_reversed": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isPalindrome(x: number): boolean {\n    if (x < 0 || (x % 10 === 0 && x !== 0)) {\n        return false;\n    }\n\n    let reversedHalf = 0;\n    while (x > reversedHalf) {\n        reversedHalf = reversedHalf * 10 + x % 10;\n        x = Math.floor(x / 10);\n    }\n\n    return x === reversedHalf || x === Math.floor(reversedHalf / 10);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_special": [
        2
      ],
      "reject": [
        3
      ],
      "complete_reject": [
        3
      ],
      "peel_digit": [
        8,
        9
      ],
      "compare": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_negative": [
        2
      ],
      "ends_in_zero": [
        2
      ],
      "x_greater_than_reversed": [
        7
      ]
    }
  }
};

const PalindromeNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Palindrome",
    "value": {
      "x": 121
    }
  },
  {
    "id": "ex2",
    "label": "Negative",
    "value": {
      "x": -121
    }
  },
  {
    "id": "ex3",
    "label": "Ends in 0",
    "value": {
      "x": 10
    }
  },
  {
    "id": "ex4",
    "label": "Odd-length",
    "value": {
      "x": 12321
    }
  }
];

function generatePalindromeNumberSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.x,r=t,l=new StepRecorder({x:t,reversedHalf:0,original:r},{}),n=r<0,s=r%10==0&&0!==r,o=Math.abs(r).toString().split("");o.length;let d=+!!n;if(n&&l.add_new_visual("digit_sign",{type:"matrixElement",value:"-",row:0,col:0}),o.forEach((e,t)=>{l.add_new_visual(`digit_${t}`,{type:"matrixElement",value:e,row:0,col:d+t,state:"idle"})}),l.record("-",`Check whether ${r} is a palindrome`),n||s)return n&&l.add_new_visual("digit_sign",{type:"matrixElement",value:"-",row:0,col:0,state:"reject"}),o.forEach((e,t)=>{l.update_visual(`digit_${t}`,{type:"matrixElement",value:e,row:0,col:d+t,state:"reject"})}),n?(l.add_conditional("is_negative",!0),l.update_variable("rejectReason","negative"),l.record("reject",`x = ${r} is negative, so it can't be a palindrome`)):(l.add_conditional("ends_in_zero",!0),l.update_variable("rejectReason","endsZero"),l.record("reject",`x = ${r} ends in 0 (and isn't 0), so it can't be a palindrome`)),l.add_new_visual("meta_result",{type:"metadata",value:!1}),l.record("complete_reject",`Result: false, ${r} is not a palindrome`),l.getSteps();l.add_conditional("is_negative",!1),l.add_conditional("ends_in_zero",!1),l.record("check_special",`${r} is non-negative and doesn't end in 0, so we reverse its second half`);let c=0,u=0,f=o.map((e,t)=>t);for(;t>c;){l.add_conditional("x_greater_than_reversed",!0);let e=t%10,r=f[f.length-1],a=c,i=t;c=10*c+e,t=Math.floor(t/10),f=f.slice(0,-1),l.update_visual(`digit_${r}`,{type:"matrixElement",value:String(e),row:1,col:u,state:"reversed"}),l.update_variable("x",t),l.update_variable("reversedHalf",c),l.update_variable("lastDigit",e),l.update_variable("prevReversed",a),l.update_variable("prevX",i),l.record("peel_digit",`Take last digit ${e}: reversedHalf = ${a} \xd7 10 + ${e} = ${c}, x = ${i} // 10 = ${t}`),u++}l.add_conditional("x_greater_than_reversed",!1);let x=Math.floor(c/10),h=t===c,p=t===x,v=h||p,m=!h,g=f.length,_=u;if(f.forEach((e,t)=>{let r=i(l,t),a=l.get_visual(`digit_${e}`),n=r?l.get_visual(r):void 0,s=n&&String(a.value)===String(n.value),o=v||s?"match":"mismatch";l.update_visual(`digit_${e}`,{...a,state:o}),n&&l.update_visual(r,{...n,state:o})}),m&&_>g){let e=i(l,_-1);if(e){let t=l.get_visual(e);l.update_visual(e,{...t,state:"pivot"})}}for(let e of(l.update_variable("x",t),l.update_variable("reversedHalf",c),l.update_variable("revHalved",x),l.update_variable("isOddCase",m),l.update_variable("verdict",v),l.update_variable("xLen",g),l.update_variable("revLen",_),m?l.record("compare",`x == reversedHalf // 10  ->  ${t} == ${x}  ->  ${v}`):l.record("compare",`x == reversedHalf  ->  ${t} == ${c}  ->  ${v}`),Object.keys(l.getCurrentVisuals()))){if(!e.startsWith("digit_"))continue;let t=l.get_visual(e);if(t&&v){let r="pivot"===t.state?"pivot":"done";l.update_visual(e,{...t,state:r})}}return l.add_new_visual("meta_result",{type:"metadata",value:v}),l.record("complete",`Result: ${v}, ${r} ${v?"is":"is not"} a palindrome`),l.getSteps()
  })(__inputArg);
}

export function PalindromeNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PalindromeNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePalindromeNumberSteps(e) as any[];
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
      title="Palindrome Number"
      slug="palindrome-number"
      approaches={approaches}
      presets={PalindromeNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reverse Integer (reverse-integer)
// ==========================================

const ReverseIntegerTemplates = {
  "python": {
    "language": "python",
    "code": "def reverse(x):\n    result = 0\n\n    while x != 0:\n        digit = x % 10\n        x = int(x / 10)\n\n        if result > 2147483647 // 10 or \\\n           (result == 2147483647 // 10 and digit > 7):\n            return 0\n        if result < -2147483648 // 10 or \\\n           (result == -2147483648 // 10 and digit < -8):\n            return 0\n\n        result = result * 10 + digit\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "check_while": [
        4
      ],
      "extract_digit": [
        5
      ],
      "remove_from_x": [
        6
      ],
      "check_overflow": [
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "build_result": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "x_not_zero": [
        4
      ],
      "overflow_positive": [
        8
      ],
      "overflow_negative": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int reverse(int x) {\n        int result = 0;\n\n        while (x != 0) {\n            int digit = x % 10;\n            x /= 10;\n\n            if (result > Integer.MAX_VALUE / 10 ||\n                (result == Integer.MAX_VALUE / 10 && digit > 7)) {\n                return 0;\n            }\n            if (result < Integer.MIN_VALUE / 10 ||\n                (result == Integer.MIN_VALUE / 10 && digit < -8)) {\n                return 0;\n            }\n\n            result = result * 10 + digit;\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_while": [
        5
      ],
      "extract_digit": [
        6
      ],
      "remove_from_x": [
        7
      ],
      "check_overflow": [
        9,
        10,
        11,
        13,
        14,
        15
      ],
      "build_result": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "x_not_zero": [
        5
      ],
      "overflow_positive": [
        9
      ],
      "overflow_negative": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int reverse(int x) {\n        int result = 0;\n\n        while (x != 0) {\n            int digit = x % 10;\n            x /= 10;\n\n            if (result > INT_MAX / 10 ||\n                (result == INT_MAX / 10 && digit > 7)) {\n                return 0;\n            }\n            if (result < INT_MIN / 10 ||\n                (result == INT_MIN / 10 && digit < -8)) {\n                return 0;\n            }\n\n            result = result * 10 + digit;\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "check_while": [
        6
      ],
      "extract_digit": [
        7
      ],
      "remove_from_x": [
        8
      ],
      "check_overflow": [
        10,
        11,
        12,
        14,
        15,
        16
      ],
      "build_result": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "x_not_zero": [
        6
      ],
      "overflow_positive": [
        10
      ],
      "overflow_negative": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int Reverse(int x) {\n        int result = 0;\n\n        while (x != 0) {\n            int digit = x % 10;\n            x /= 10;\n\n            if (result > int.MaxValue / 10 ||\n                (result == int.MaxValue / 10 && digit > 7)) {\n                return 0;\n            }\n            if (result < int.MinValue / 10 ||\n                (result == int.MinValue / 10 && digit < -8)) {\n                return 0;\n            }\n\n            result = result * 10 + digit;\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_while": [
        5
      ],
      "extract_digit": [
        6
      ],
      "remove_from_x": [
        7
      ],
      "check_overflow": [
        9,
        10,
        11,
        13,
        14,
        15
      ],
      "build_result": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "x_not_zero": [
        5
      ],
      "overflow_positive": [
        9
      ],
      "overflow_negative": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reverse(x int) int {\n    result := 0\n\n    for x != 0 {\n        digit := x % 10\n        x /= 10\n\n        if result > math.MaxInt32/10 ||\n            (result == math.MaxInt32/10 && digit > 7) {\n            return 0\n        }\n        if result < math.MinInt32/10 ||\n            (result == math.MinInt32/10 && digit < -8) {\n            return 0\n        }\n\n        result = result*10 + digit\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_while": [
        4
      ],
      "extract_digit": [
        5
      ],
      "remove_from_x": [
        6
      ],
      "check_overflow": [
        8,
        9,
        10,
        12,
        13,
        14
      ],
      "build_result": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "x_not_zero": [
        4
      ],
      "overflow_positive": [
        8
      ],
      "overflow_negative": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function reverse(x) {\n    let result = 0;\n\n    while (x !== 0) {\n        const digit = x % 10;\n        x = Math.trunc(x / 10);\n\n        if (result > Math.trunc(2147483647 / 10) ||\n            (result === Math.trunc(2147483647 / 10) && digit > 7)) {\n            return 0;\n        }\n        if (result < Math.trunc(-2147483648 / 10) ||\n            (result === Math.trunc(-2147483648 / 10) && digit < -8)) {\n            return 0;\n        }\n\n        result = result * 10 + digit;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_while": [
        4
      ],
      "extract_digit": [
        5
      ],
      "remove_from_x": [
        6
      ],
      "check_overflow": [
        8,
        9,
        10,
        12,
        13,
        14
      ],
      "build_result": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "x_not_zero": [
        4
      ],
      "overflow_positive": [
        8
      ],
      "overflow_negative": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reverse(x: number): number {\n    let result = 0;\n\n    while (x !== 0) {\n        const digit = x % 10;\n        x = Math.trunc(x / 10);\n\n        if (result > Math.trunc(2147483647 / 10) ||\n            (result === Math.trunc(2147483647 / 10) && digit > 7)) {\n            return 0;\n        }\n        if (result < Math.trunc(-2147483648 / 10) ||\n            (result === Math.trunc(-2147483648 / 10) && digit < -8)) {\n            return 0;\n        }\n\n        result = result * 10 + digit;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_while": [
        4
      ],
      "extract_digit": [
        5
      ],
      "remove_from_x": [
        6
      ],
      "check_overflow": [
        8,
        9,
        10,
        12,
        13,
        14
      ],
      "build_result": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "x_not_zero": [
        4
      ],
      "overflow_positive": [
        8
      ],
      "overflow_negative": [
        12
      ]
    }
  }
};

const ReverseIntegerPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "x": 123
    }
  },
  {
    "id": "ex2",
    "label": "Negative",
    "value": {
      "x": -123
    }
  },
  {
    "id": "ex3",
    "label": "Trailing Zero",
    "value": {
      "x": 120
    }
  },
  {
    "id": "ex4",
    "label": "Overflow",
    "value": {
      "x": 1534236469
    }
  }
];

function generateReverseIntegerSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.x,r=t,i=Math.abs(r).toString().split("").map(Number),l=i.length,a={};for(let e=0;e<l;e++)a[`src_${e}`]={type:"arrayElement",value:i[e],position:e};let o=new StepRecorder({x:t,result:0,digit:void 0,negative:r<0,originalX:r,exprParts:[]},a),s=e=>o.update_variable("exprParts",e);s([{t:"Peel the last digit of x onto result",c:"muted"}]),o.record("-",`Start: reverse the integer ${r}`);let u=0,c=0;for(;0!==t;){o.add_conditional("x_not_zero",!0),s([{t:"x = ",c:"muted"},{t:`${t}`,c:"cyan"},{t:" ≠ 0",c:"muted"}]),o.record("check_while",`x = ${t} ≠ 0, continue`);let e=t%10;o.update_variable("digit",e);let n=l-1-c;n>=0&&o.update_visual(`src_${n}`,{type:"arrayElement",value:i[n],position:n,state:"active"}),s([{t:`digit = ${t} % 10 = `,c:"muted"},{t:`${e}`,c:"yellow"}]),o.record("extract_digit",`digit = ${t} % 10 = ${e}`);let a=t;t=Math.trunc(t/10),o.update_variable("x",t),n>=0&&o.update_visual(`src_${n}`,{type:"arrayElement",value:i[n],position:n,state:"consumed"}),s([{t:`x = ${a} / 10 = `,c:"muted"},{t:`${t}`,c:"cyan"}]),o.record("remove_from_x",`x = ${a} / 10 = ${t}`);let d=u>Math.trunc(214748364.7)||u===Math.trunc(214748364.7)&&e>7,h=u<Math.trunc(-214748364.8)||u===Math.trunc(-214748364.8)&&e<-8;if(o.add_conditional("overflow_positive",d),o.add_conditional("overflow_negative",h),d||h)return o.update_variable("result",0),o.update_variable("overflow",!0),o.update_variable("done",!0),o.update_variable("answer",0),s([{t:"result would overflow 32-bit",c:"red"},{t:"  →  return 0",c:"muted"}]),o.record("check_overflow","Overflow! result would leave the 32-bit range, return 0"),o.record("complete",`Overflow, reverse(${r}) = 0`),o.getSteps();s([{t:`${u} `,c:"plain"},{t:"within 32-bit range ✓",c:"green"}]),o.record("check_overflow",`result = ${u} stays within the 32-bit range`);let f=u;u=10*u+e,o.update_variable("result",u);let g=0===u;o.update_visual(`res_${c}`,{type:"arrayElement",value:Math.abs(e),position:c,state:g?"dropped":"filled"}),s([{t:`result = ${f} \xd7 10 + ${e} = `,c:"muted"},{t:`${u}`,c:"green"}]),o.record("build_result",`result = ${f} \xd7 10 + ${e} = ${u}`),c++}return o.add_conditional("x_not_zero",!1),o.update_variable("done",!0),o.update_variable("answer",u),s([{t:"x = 0, all digits consumed",c:"muted"}]),o.record("check_while","x = 0, exit loop"),o.record("complete",`Done! reverse(${r}) = ${u}`),o.getSteps()
  })(__inputArg);
}

export function ReverseIntegerProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReverseIntegerTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReverseIntegerSteps(e) as any[];
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
      title="Reverse Integer"
      slug="reverse-integer"
      approaches={approaches}
      presets={ReverseIntegerPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Factorial Trailing Zeroes (factorial-trailing-zeroes)
// ==========================================

const FactorialTrailingZeroesTemplates = {
  "python": {
    "language": "python",
    "code": "def trailingZeroes(n):\n    count = 0\n\n    while n >= 5:\n        n //= 5\n        count += n\n\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "check_condition": [
        4
      ],
      "divide": [
        5
      ],
      "add_to_count": [
        6
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "n_gte_5": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int trailingZeroes(int n) {\n        int count = 0;\n\n        while (n >= 5) {\n            n /= 5;\n            count += n;\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_condition": [
        5
      ],
      "divide": [
        6
      ],
      "add_to_count": [
        7
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "n_gte_5": [
        5
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int trailingZeroes(int n) {\n        int count = 0;\n\n        while (n >= 5) {\n            n /= 5;\n            count += n;\n        }\n\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "check_condition": [
        6
      ],
      "divide": [
        7
      ],
      "add_to_count": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "n_gte_5": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int TrailingZeroes(int n) {\n        int count = 0;\n\n        while (n >= 5) {\n            n /= 5;\n            count += n;\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_condition": [
        5
      ],
      "divide": [
        6
      ],
      "add_to_count": [
        7
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "n_gte_5": [
        5
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func trailingZeroes(n int) int {\n    count := 0\n\n    for n >= 5 {\n        n /= 5\n        count += n\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_condition": [
        4
      ],
      "divide": [
        5
      ],
      "add_to_count": [
        6
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "n_gte_5": [
        4
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function trailingZeroes(n) {\n    let count = 0;\n\n    while (n >= 5) {\n        n = Math.floor(n / 5);\n        count += n;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_condition": [
        4
      ],
      "divide": [
        5
      ],
      "add_to_count": [
        6
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "n_gte_5": [
        4
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function trailingZeroes(n: number): number {\n    let count = 0;\n\n    while (n >= 5) {\n        n = Math.floor(n / 5);\n        count += n;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_condition": [
        4
      ],
      "divide": [
        5
      ],
      "add_to_count": [
        6
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "n_gte_5": [
        4
      ]
    }
  }
};

const FactorialTrailingZeroesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "n=5 (1 zero)",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex2",
    "label": "n=25 (6 zeroes)",
    "value": {
      "n": 25
    }
  },
  {
    "id": "ex3",
    "label": "n=100 (24 zeroes)",
    "value": {
      "n": 100
    }
  },
  {
    "id": "ex4",
    "label": "n=3 (0 zeroes)",
    "value": {
      "n": 3
    }
  },
  {
    "id": "ex5",
    "label": "n=30 (7 zeroes)",
    "value": {
      "n": 30
    }
  }
];

function generateFactorialTrailingZeroesSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=Number(e.n),n=t,i=new StepRecorder({n:t,originalN:n,count:0,exprParts:[]},{}),l=e=>i.update_variable("exprParts",e),a=()=>i.delete_variable("quotientFlight");a(),l([{t:"trailing zeroes = number of 5s in n! (2s are always plentiful)",c:"muted"}]),i.record("-",`Count trailing zeroes in ${n}!`);let o=0,s=0;if(i.add_conditional("n_gte_5",t>=5),t<5)return i.update_variable("count",0),i.update_variable("done",!0),i.update_variable("answer",0),l([{t:`n = ${t} < 5, no factors of 5  →  `,c:"muted"},{t:"0 zeroes",c:"green"}]),i.record("check_condition",`n = ${t} < 5, loop ends`),i.record("complete",`${n}! has 0 trailing zeroes`),i.getSteps();for(l([{t:`n = ${t} ≥ 5  →  divide by 5`,c:"muted"}]),i.record("check_condition",`n = ${t} ≥ 5, enter loop`);t>=5;){let e=t;t=Math.floor(t/5),i.update_variable("n",t),i.update_variable("nPulse",!0),a(),l([{t:`${e} \xf7 5 = `,c:"muted"},{t:`${t}`,c:"cyan"},{t:`   multiples of ${Math.pow(5,s+1)} in ${n}!`,c:"muted"}]),i.record("divide",`${e} \xf7 5 = ${t}`),i.delete_variable("nPulse");let r=o;o+=t,i.update_variable("count",o),i.update_visual(`term_${s}`,{type:"arrayElement",value:t,position:s,label:`${Math.pow(5,s+1)}`,state:"new"}),i.update_variable("quotientFlight",{value:t,termIdx:s}),l([{t:`count = ${r} + ${t} = `,c:"muted"},{t:`${o}`,c:"green"}]),i.record("add_to_count",`count += ${t} = ${o}`),s++,i.add_conditional("n_gte_5",t>=5),a(),l(t>=5?[{t:`n = ${t} ≥ 5, divide again`,c:"muted"}]:[{t:`n = ${t} < 5, stop dividing`,c:"muted"}]),i.record("check_condition",t>=5?`n = ${t} ≥ 5, continue loop`:`n = ${t} < 5, loop ends`)}for(let e=0;e<s;e++){let t=i.get_visual(`term_${e}`);t&&"arrayElement"===t.type&&i.update_visual(`term_${e}`,{...t,state:"done"})}return i.update_variable("count",o),i.update_variable("answer",o),i.update_variable("done",!0),a(),l([{t:`${n}! ends in `,c:"muted"},{t:`${o}`,c:"green"},{t:" zeroes",c:"muted"}]),i.record("complete",`${n}! has ${o} trailing zeroes`),i.getSteps()
  })(__inputArg);
}

export function FactorialTrailingZeroesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FactorialTrailingZeroesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFactorialTrailingZeroesSteps(e) as any[];
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
      title="Factorial Trailing Zeroes"
      slug="factorial-trailing-zeroes"
      approaches={approaches}
      presets={FactorialTrailingZeroesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Square (valid-square)
// ==========================================

const ValidSquareTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def validSquare(self, p1, p2, p3, p4):\n        def dist(p, q):\n            return (p[0]-q[0])**2 + (p[1]-q[1])**2\n\n        dists = [\n            dist(p1,p2), dist(p1,p3), dist(p1,p4),\n            dist(p2,p3), dist(p2,p4), dist(p3,p4)\n        ]\n\n        freq = {}\n        for d in dists:\n            freq[d] = freq.get(d, 0) + 1\n\n        if len(freq) != 2:\n            return False\n\n        side = min(freq.keys())\n        diag = max(freq.keys())\n\n        return (side > 0 and\n                freq[side] == 4 and\n                freq[diag] == 2 and\n                diag == 2 * side)",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "compute_distance": [
        6,
        7,
        8,
        9
      ],
      "count_frequencies": [
        11,
        12,
        13
      ],
      "find_side_diag": [
        18,
        19
      ],
      "check_valid": [
        21,
        22,
        23,
        24
      ],
      "complete": [
        21,
        22,
        23,
        24
      ]
    },
    "conditionalMap": {
      "two_distinct_distances": [
        15
      ],
      "valid_square": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean validSquare(int[] p1, int[] p2, int[] p3, int[] p4) {\n        long[] dists = {\n            dist(p1,p2), dist(p1,p3), dist(p1,p4),\n            dist(p2,p3), dist(p2,p4), dist(p3,p4)\n        };\n\n        HashMap<Long, Integer> freq = new HashMap<>();\n        for (long d : dists) {\n            freq.put(d, freq.getOrDefault(d, 0) + 1);\n        }\n\n        if (freq.size() != 2) return false;\n\n        long side = Long.MAX_VALUE, diag = Long.MIN_VALUE;\n        for (long d : freq.keySet()) {\n            side = Math.min(side, d);\n            diag = Math.max(diag, d);\n        }\n\n        return side > 0 && freq.get(side) == 4\n            && freq.get(diag) == 2 && diag == 2 * side;\n    }\n\n    private long dist(int[] p, int[] q) {\n        return (long)(p[0]-q[0])*(p[0]-q[0])\n             + (long)(p[1]-q[1])*(p[1]-q[1]);\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "compute_distance": [
        3,
        4,
        5,
        6
      ],
      "count_frequencies": [
        8,
        9,
        10,
        11
      ],
      "find_side_diag": [
        15,
        16,
        17,
        18,
        19
      ],
      "check_valid": [
        21,
        22
      ],
      "complete": [
        21,
        22
      ]
    },
    "conditionalMap": {
      "two_distinct_distances": [
        13
      ],
      "valid_square": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool validSquare(vector<int>& p1, vector<int>& p2,\n                     vector<int>& p3, vector<int>& p4) {\n        auto dist = [](vector<int>& a, vector<int>& b) -> long {\n            return (long)(a[0]-b[0])*(a[0]-b[0])\n                 + (long)(a[1]-b[1])*(a[1]-b[1]);\n        };\n\n        vector<long> dists = {\n            dist(p1,p2), dist(p1,p3), dist(p1,p4),\n            dist(p2,p3), dist(p2,p4), dist(p3,p4)\n        };\n\n        unordered_map<long, int> freq;\n        for (long d : dists) {\n            freq[d]++;\n        }\n\n        if (freq.size() != 2) return false;\n\n        long side = LONG_MAX, diag = LONG_MIN;\n        for (auto& [d, _] : freq) {\n            side = min(side, d);\n            diag = max(diag, d);\n        }\n\n        return side > 0 && freq[side] == 4\n            && freq[diag] == 2 && diag == 2 * side;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "compute_distance": [
        10,
        11,
        12,
        13
      ],
      "count_frequencies": [
        15,
        16,
        17,
        18
      ],
      "find_side_diag": [
        22,
        23,
        24,
        25,
        26
      ],
      "check_valid": [
        28,
        29
      ],
      "complete": [
        28,
        29
      ]
    },
    "conditionalMap": {
      "two_distinct_distances": [
        20
      ],
      "valid_square": [
        28
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool ValidSquare(int[] p1, int[] p2, int[] p3, int[] p4) {\n        long[] dists = {\n            Dist(p1,p2), Dist(p1,p3), Dist(p1,p4),\n            Dist(p2,p3), Dist(p2,p4), Dist(p3,p4)\n        };\n\n        var freq = new Dictionary<long, int>();\n        foreach (long d in dists) {\n            freq[d] = freq.GetValueOrDefault(d, 0) + 1;\n        }\n\n        if (freq.Count != 2) return false;\n\n        long side = long.MaxValue, diag = long.MinValue;\n        foreach (long d in freq.Keys) {\n            side = Math.Min(side, d);\n            diag = Math.Max(diag, d);\n        }\n\n        return side > 0 && freq[side] == 4\n            && freq[diag] == 2 && diag == 2 * side;\n    }\n\n    private long Dist(int[] p, int[] q) {\n        return (long)(p[0]-q[0])*(p[0]-q[0])\n             + (long)(p[1]-q[1])*(p[1]-q[1]);\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "compute_distance": [
        3,
        4,
        5,
        6
      ],
      "count_frequencies": [
        8,
        9,
        10,
        11
      ],
      "find_side_diag": [
        15,
        16,
        17,
        18,
        19
      ],
      "check_valid": [
        21,
        22
      ],
      "complete": [
        21,
        22
      ]
    },
    "conditionalMap": {
      "two_distinct_distances": [
        13
      ],
      "valid_square": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func validSquare(p1, p2, p3, p4 []int) bool {\n    dist := func(p, q []int) int {\n        return (p[0]-q[0])*(p[0]-q[0]) +\n            (p[1]-q[1])*(p[1]-q[1])\n    }\n\n    dists := []int{\n        dist(p1,p2), dist(p1,p3), dist(p1,p4),\n        dist(p2,p3), dist(p2,p4), dist(p3,p4),\n    }\n\n    freq := map[int]int{}\n    for _, d := range dists {\n        freq[d]++\n    }\n\n    if len(freq) != 2 {\n        return false\n    }\n\n    side, diag := math.MaxInt, math.MinInt\n    for d := range freq {\n        if d < side { side = d }\n        if d > diag { diag = d }\n    }\n\n    return side > 0 && freq[side] == 4 &&\n        freq[diag] == 2 && diag == 2*side\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_distance": [
        7,
        8,
        9,
        10
      ],
      "count_frequencies": [
        12,
        13,
        14,
        15
      ],
      "find_side_diag": [
        21,
        22,
        23,
        24,
        25
      ],
      "check_valid": [
        27,
        28
      ],
      "complete": [
        27,
        28
      ]
    },
    "conditionalMap": {
      "two_distinct_distances": [
        17
      ],
      "valid_square": [
        27
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var validSquare = function(p1, p2, p3, p4) {\n    const dist = (p, q) =>\n        (p[0]-q[0])*(p[0]-q[0]) + (p[1]-q[1])*(p[1]-q[1]);\n\n    const dists = [\n        dist(p1,p2), dist(p1,p3), dist(p1,p4),\n        dist(p2,p3), dist(p2,p4), dist(p3,p4)\n    ];\n\n    const freq = new Map();\n    for (const d of dists) {\n        freq.set(d, (freq.get(d) || 0) + 1);\n    }\n\n    if (freq.size !== 2) return false;\n\n    let side = Infinity, diag = -Infinity;\n    for (const d of freq.keys()) {\n        side = Math.min(side, d);\n        diag = Math.max(diag, d);\n    }\n\n    return side > 0 && freq.get(side) === 4\n        && freq.get(diag) === 2 && diag === 2 * side;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "compute_distance": [
        5,
        6,
        7,
        8
      ],
      "count_frequencies": [
        10,
        11,
        12,
        13
      ],
      "find_side_diag": [
        17,
        18,
        19,
        20,
        21
      ],
      "check_valid": [
        23,
        24
      ],
      "complete": [
        23,
        24
      ]
    },
    "conditionalMap": {
      "two_distinct_distances": [
        15
      ],
      "valid_square": [
        23
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function validSquare(p1: number[], p2: number[],\n                     p3: number[], p4: number[]): boolean {\n    const dist = (p: number[], q: number[]): number =>\n        (p[0]-q[0])*(p[0]-q[0]) + (p[1]-q[1])*(p[1]-q[1]);\n\n    const dists: number[] = [\n        dist(p1,p2), dist(p1,p3), dist(p1,p4),\n        dist(p2,p3), dist(p2,p4), dist(p3,p4)\n    ];\n\n    const freq = new Map<number, number>();\n    for (const d of dists) {\n        freq.set(d, (freq.get(d) || 0) + 1);\n    }\n\n    if (freq.size !== 2) return false;\n\n    let side = Infinity, diag = -Infinity;\n    for (const d of freq.keys()) {\n        side = Math.min(side, d);\n        diag = Math.max(diag, d);\n    }\n\n    return side > 0 && freq.get(side) === 4\n        && freq.get(diag) === 2 && diag === 2 * side;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "compute_distance": [
        6,
        7,
        8,
        9
      ],
      "count_frequencies": [
        11,
        12,
        13,
        14
      ],
      "find_side_diag": [
        18,
        19,
        20,
        21,
        22
      ],
      "check_valid": [
        24,
        25
      ],
      "complete": [
        24,
        25
      ]
    },
    "conditionalMap": {
      "two_distinct_distances": [
        16
      ],
      "valid_square": [
        24
      ]
    }
  }
};

const ValidSquarePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid square",
    "value": {
      "p1": [
        0,
        0
      ],
      "p2": [
        1,
        0
      ],
      "p3": [
        1,
        1
      ],
      "p4": [
        0,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Rotated valid square",
    "value": {
      "p1": [
        1,
        0
      ],
      "p2": [
        -1,
        0
      ],
      "p3": [
        0,
        1
      ],
      "p4": [
        0,
        -1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Not a square",
    "value": {
      "p1": [
        0,
        0
      ],
      "p2": [
        1,
        0
      ],
      "p3": [
        2,
        0
      ],
      "p4": [
        0,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All same point",
    "value": {
      "p1": [
        0,
        0
      ],
      "p2": [
        0,
        0
      ],
      "p3": [
        0,
        0
      ],
      "p4": [
        0,
        0
      ]
    }
  }
];

function generateValidSquareSteps(__inputArg: any): any[] {
  let n=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],a=(e,t)=>(e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1]);
  return (function(e: any) {
let t=[e.p1,e.p2,e.p3,e.p4],i=new StepRecorder({pts:t,phase:"compute",dists:[],segIdx:-1,exprParts:[]},{}),l=e=>i.update_variable("exprParts",e);l([{t:"a square = 4 equal sides + 2 equal diagonals (diag\xb2 = 2\xb7side\xb2)",c:"muted"}]),i.record("-","Do these 4 points form a square?");let s=[];for(let e=0;e<6;e++){let[r,d]=n[e],o=a(t[r],t[d]);s.push({i:r,j:d,d:o}),i.update_variable("segIdx",e),i.update_variable("dists",[...s]),l([{t:`dist\xb2(p${r+1}, p${d+1}) = (${t[r][0]}−${t[d][0]})\xb2 + (${t[r][1]}−${t[d][1]})\xb2 = `,c:"muted"},{t:`${o}`,c:"cyan"}]),i.record("compute_distance",`dist\xb2(p${r+1}, p${d+1}) = ${o}`)}let d=new Map;for(let{d:e}of s)d.set(e,(d.get(e)||0)+1);let o=Object.fromEntries(d);i.update_variable("segIdx",-1),i.update_variable("freq",o),l([{t:"distinct squared distances: ",c:"muted"},{t:`${d.size}`,c:2===d.size?"green":"red"},{t:`  (${Array.from(d.entries()).map(([e,t])=>`${e}\xd7${t}`).join(", ")})`,c:"muted"}]),i.record("count_frequencies",`Distinct distances: ${d.size}`);let c=2===d.size;if(i.add_conditional("two_distinct_distances",c),!c)return i.update_variable("classified",!1),i.update_variable("isValid",!1),i.update_variable("done",!0),i.update_variable("answer",!1),i.add_conditional("valid_square",!1),l([{t:`${d.size} distinct distances (a square needs exactly `,c:"muted"},{t:"2",c:"red"},{t:")  →  not a square",c:"muted"}]),i.record("find_side_diag",`Need exactly 2 distinct distances, found ${d.size}`),i.record("check_valid","Wrong number of distinct distances"),i.record("complete","Not a valid square → false"),i.getSteps();let u=Math.min(...d.keys()),p=Math.max(...d.keys());i.update_variable("side",u),i.update_variable("diag",p),i.update_variable("classified",!0),l([{t:"side\xb2 = ",c:"muted"},{t:`${u}`,c:"green"},{t:` (\xd7${d.get(u)}),  diag\xb2 = `,c:"muted"},{t:`${p}`,c:"orange"},{t:` (\xd7${d.get(p)})`,c:"muted"}]),i.record("find_side_diag",`side\xb2 = ${u} (\xd7${d.get(u)}), diag\xb2 = ${p} (\xd7${d.get(p)})`);let f=u>0&&4===d.get(u)&&2===d.get(p)&&p===2*u;if(i.update_variable("isValid",f),i.add_conditional("valid_square",f),f)l([{t:`4 sides ✓, 2 diagonals ✓, ${p} = 2\xb7${u} ✓  →  `,c:"muted"},{t:"valid square",c:"green"}]),i.record("check_valid","4 sides, 2 diagonals, diag\xb2 = 2\xb7side\xb2 → valid square");else{let e=[];0===u&&e.push("side\xb2 = 0"),4!==d.get(u)&&e.push(`${d.get(u)} sides (need 4)`),2!==d.get(p)&&e.push(`${d.get(p)} diagonals (need 2)`),p!==2*u&&e.push(`diag\xb2 ${p} ≠ 2\xb7side\xb2 ${2*u}`),l([{t:`${e.join(", ")}  →  `,c:"muted"},{t:"not a square",c:"red"}]),i.record("check_valid",`Fails: ${e.join(", ")}`)}return i.update_variable("done",!0),i.update_variable("answer",f),i.record("complete",`The four points ${f?"form a valid square → true":"do not form a square → false"}`),i.getSteps()
  })(__inputArg);
}

export function ValidSquareProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidSquareTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidSquareSteps(e) as any[];
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
      title="Valid Square"
      slug="valid-square"
      approaches={approaches}
      presets={ValidSquarePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Area Rectangle II (minimum-area-rectangle-ii)
// ==========================================

const MinimumAreaRectangleIiTemplates = {
  "python": {
    "language": "python",
    "code": "import math\n\ndef minAreaFreeRect(points):\n    n = len(points)\n    groups = {}\n    for i in range(n):\n        for j in range(i + 1, n):\n            mx = points[i][0] + points[j][0]\n            my = points[i][1] + points[j][1]\n            dx = points[i][0] - points[j][0]\n            dy = points[i][1] - points[j][1]\n            dist_sq = dx * dx + dy * dy\n            key = (mx, my, dist_sq)\n            if key not in groups:\n                groups[key] = []\n            groups[key].append((i, j))\n\n    min_area = float('inf')\n    found = False\n    for pairs in groups.values():\n        if len(pairs) < 2:\n            continue\n        for a in range(len(pairs)):\n            for b in range(a + 1, len(pairs)):\n                i, j = pairs[a]\n                k, l = pairs[b]\n                s1x = points[k][0] - points[i][0]\n                s1y = points[k][1] - points[i][1]\n                s2x = points[j][0] - points[i][0]\n                s2y = points[j][1] - points[i][1]\n                area = abs(s1x * s2y - s1y * s2x)\n                if area > 0:\n                    found = True\n                    if area < min_area:\n                        min_area = area\n\n    return min_area if found else 0.0",
    "lineMap": {
      "-": [
        3
      ],
      "pick_pair": [
        6,
        7,
        8,
        9
      ],
      "compute_key": [
        10,
        11,
        12,
        13
      ],
      "add_to_group": [
        14,
        15,
        16
      ],
      "check_group": [
        23,
        24,
        25,
        26
      ],
      "compute_area": [
        27,
        28,
        29,
        30,
        31
      ],
      "update_min": [
        32,
        33,
        34,
        35
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "group_has_pair": [
        21
      ],
      "area_positive": [
        32
      ],
      "new_minimum": [
        34
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public double minAreaFreeRect(int[][] points) {\n        int n = points.length;\n        Map<Long, List<int[]>> groups = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int mx = points[i][0] + points[j][0];\n                int my = points[i][1] + points[j][1];\n                int dx = points[i][0] - points[j][0];\n                int dy = points[i][1] - points[j][1];\n                long distSq = (long)dx * dx + (long)dy * dy;\n                long key = (long)mx * 80003L * 80003L + (long)my * 80003L + distSq;\n                groups.computeIfAbsent(key, k -> new ArrayList<>()).add(new int[]{i, j});\n            }\n        }\n        double minArea = Double.MAX_VALUE;\n        boolean found = false;\n        for (List<int[]> pairs : groups.values()) {\n            if (pairs.size() < 2) continue;\n            for (int a = 0; a < pairs.size(); a++) {\n                for (int b = a + 1; b < pairs.size(); b++) {\n                    int i = pairs.get(a)[0], j = pairs.get(a)[1];\n                    int k = pairs.get(b)[0];\n                    double s1x = points[k][0] - points[i][0];\n                    double s1y = points[k][1] - points[i][1];\n                    double s2x = points[j][0] - points[i][0];\n                    double s2y = points[j][1] - points[i][1];\n                    double area = Math.abs(s1x * s2y - s1y * s2x);\n                    if (area > 0) {\n                        found = true;\n                        minArea = Math.min(minArea, area);\n                    }\n                }\n            }\n        }\n        return found ? minArea : 0.0;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "pick_pair": [
        5,
        6,
        7,
        8
      ],
      "compute_key": [
        9,
        10,
        11,
        12
      ],
      "add_to_group": [
        13
      ],
      "check_group": [
        20,
        21,
        22,
        23
      ],
      "compute_area": [
        24,
        25,
        26,
        27,
        28
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "group_has_pair": [
        19
      ],
      "area_positive": [
        29
      ],
      "new_minimum": [
        31
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    double minAreaFreeRect(vector<vector<int>>& points) {\n        int n = points.size();\n        map<tuple<int,int,long>, vector<pair<int,int>>> groups;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int mx = points[i][0] + points[j][0];\n                int my = points[i][1] + points[j][1];\n                int dx = points[i][0] - points[j][0];\n                int dy = points[i][1] - points[j][1];\n                long distSq = (long)dx * dx + (long)dy * dy;\n                groups[{mx, my, distSq}].push_back({i, j});\n            }\n        }\n        double minArea = DBL_MAX;\n        bool found = false;\n        for (auto& [key, pairs] : groups) {\n            if (pairs.size() < 2) continue;\n            for (int a = 0; a < pairs.size(); a++) {\n                for (int b = a + 1; b < pairs.size(); b++) {\n                    auto [i, j] = pairs[a];\n                    auto [k, l] = pairs[b];\n                    double s1x = points[k][0] - points[i][0];\n                    double s1y = points[k][1] - points[i][1];\n                    double s2x = points[j][0] - points[i][0];\n                    double s2y = points[j][1] - points[i][1];\n                    double area = abs(s1x * s2y - s1y * s2x);\n                    if (area > 0) {\n                        found = true;\n                        minArea = min(minArea, area);\n                    }\n                }\n            }\n        }\n        return found ? minArea : 0.0;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "pick_pair": [
        6,
        7,
        8,
        9
      ],
      "compute_key": [
        10,
        11,
        12
      ],
      "add_to_group": [
        13
      ],
      "check_group": [
        20,
        21,
        22,
        23
      ],
      "compute_area": [
        24,
        25,
        26,
        27,
        28
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "group_has_pair": [
        19
      ],
      "area_positive": [
        29
      ],
      "new_minimum": [
        31
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public double MinAreaFreeRect(int[][] points) {\n        int n = points.Length;\n        var groups = new Dictionary<long, List<int[]>>();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int mx = points[i][0] + points[j][0];\n                int my = points[i][1] + points[j][1];\n                int dx = points[i][0] - points[j][0];\n                int dy = points[i][1] - points[j][1];\n                long distSq = (long)dx * dx + (long)dy * dy;\n                long key = (long)mx * 80003L * 80003L + (long)my * 80003L + distSq;\n                if (!groups.ContainsKey(key)) groups[key] = new List<int[]>();\n                groups[key].Add(new int[]{i, j});\n            }\n        }\n        double minArea = double.MaxValue;\n        bool found = false;\n        foreach (var pairs in groups.Values) {\n            if (pairs.Count < 2) continue;\n            for (int a = 0; a < pairs.Count; a++) {\n                for (int b = a + 1; b < pairs.Count; b++) {\n                    int pi = pairs[a][0], pj = pairs[a][1];\n                    int pk = pairs[b][0], pl = pairs[b][1];\n                    double s1x = points[pk][0] - points[pi][0];\n                    double s1y = points[pk][1] - points[pi][1];\n                    double s2x = points[pj][0] - points[pi][0];\n                    double s2y = points[pj][1] - points[pi][1];\n                    double area = Math.Abs(s1x * s2y - s1y * s2x);\n                    if (area > 0) {\n                        found = true;\n                        minArea = Math.Min(minArea, area);\n                    }\n                }\n            }\n        }\n        return found ? minArea : 0.0;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "pick_pair": [
        5,
        6,
        7,
        8
      ],
      "compute_key": [
        9,
        10,
        11,
        12
      ],
      "add_to_group": [
        13,
        14
      ],
      "check_group": [
        21,
        22,
        23,
        24
      ],
      "compute_area": [
        25,
        26,
        27,
        28,
        29
      ],
      "update_min": [
        30,
        31,
        32
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "group_has_pair": [
        20
      ],
      "area_positive": [
        30
      ],
      "new_minimum": [
        32
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minAreaFreeRect(points [][]int) float64 {\n    n := len(points)\n    type key struct{ mx, my, distSq int }\n    groups := map[key][][2]int{}\n    for i := 0; i < n; i++ {\n        for j := i + 1; j < n; j++ {\n            mx := points[i][0] + points[j][0]\n            my := points[i][1] + points[j][1]\n            dx := points[i][0] - points[j][0]\n            dy := points[i][1] - points[j][1]\n            distSq := dx*dx + dy*dy\n            k := key{mx, my, distSq}\n            groups[k] = append(groups[k], [2]int{i, j})\n        }\n    }\n    minArea := math.MaxFloat64\n    found := false\n    for _, pairs := range groups {\n        if len(pairs) < 2 { continue }\n        for a := 0; a < len(pairs); a++ {\n            for b := a + 1; b < len(pairs); b++ {\n                i, j := pairs[a][0], pairs[a][1]\n                k := pairs[b][0]\n                s1x := float64(points[k][0] - points[i][0])\n                s1y := float64(points[k][1] - points[i][1])\n                s2x := float64(points[j][0] - points[i][0])\n                s2y := float64(points[j][1] - points[i][1])\n                area := math.Abs(s1x*s2y - s1y*s2x)\n                if area > 0 {\n                    found = true\n                    minArea = math.Min(minArea, area)\n                }\n            }\n        }\n    }\n    if found { return minArea }\n    return 0.0\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_pair": [
        5,
        6,
        7,
        8
      ],
      "compute_key": [
        9,
        10,
        11,
        12
      ],
      "add_to_group": [
        13
      ],
      "check_group": [
        20,
        21,
        22,
        23
      ],
      "compute_area": [
        24,
        25,
        26,
        27,
        28
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "complete": [
        36,
        37
      ]
    },
    "conditionalMap": {
      "group_has_pair": [
        19
      ],
      "area_positive": [
        29
      ],
      "new_minimum": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minAreaFreeRect(points) {\n    const n = points.length;\n    const groups = new Map();\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            const mx = points[i][0] + points[j][0];\n            const my = points[i][1] + points[j][1];\n            const dx = points[i][0] - points[j][0];\n            const dy = points[i][1] - points[j][1];\n            const distSq = dx * dx + dy * dy;\n            const key = `${mx},${my},${distSq}`;\n            if (!groups.has(key)) groups.set(key, []);\n            groups.get(key).push([i, j]);\n        }\n    }\n    let minArea = Infinity;\n    let found = false;\n    for (const pairs of groups.values()) {\n        if (pairs.length < 2) continue;\n        for (let a = 0; a < pairs.length; a++) {\n            for (let b = a + 1; b < pairs.length; b++) {\n                const [pi, pj] = pairs[a];\n                const [pk, pl] = pairs[b];\n                const s1x = points[pk][0] - points[pi][0];\n                const s1y = points[pk][1] - points[pi][1];\n                const s2x = points[pj][0] - points[pi][0];\n                const s2y = points[pj][1] - points[pi][1];\n                const area = Math.abs(s1x * s2y - s1y * s2x);\n                if (area > 0) {\n                    found = true;\n                    minArea = Math.min(minArea, area);\n                }\n            }\n        }\n    }\n    return found ? minArea : 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_pair": [
        4,
        5,
        6,
        7
      ],
      "compute_key": [
        8,
        9,
        10,
        11
      ],
      "add_to_group": [
        12,
        13
      ],
      "check_group": [
        20,
        21,
        22,
        23
      ],
      "compute_area": [
        24,
        25,
        26,
        27,
        28
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "group_has_pair": [
        19
      ],
      "area_positive": [
        29
      ],
      "new_minimum": [
        31
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minAreaFreeRect(points: number[][]): number {\n    const n = points.length;\n    const groups = new Map<string, number[][]>();\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            const mx = points[i][0] + points[j][0];\n            const my = points[i][1] + points[j][1];\n            const dx = points[i][0] - points[j][0];\n            const dy = points[i][1] - points[j][1];\n            const distSq = dx * dx + dy * dy;\n            const key = `${mx},${my},${distSq}`;\n            if (!groups.has(key)) groups.set(key, []);\n            groups.get(key)!.push([i, j]);\n        }\n    }\n    let minArea = Infinity;\n    let found = false;\n    for (const pairs of groups.values()) {\n        if (pairs.length < 2) continue;\n        for (let a = 0; a < pairs.length; a++) {\n            for (let b = a + 1; b < pairs.length; b++) {\n                const [pi, pj] = pairs[a];\n                const [pk, pl] = pairs[b];\n                const s1x = points[pk][0] - points[pi][0];\n                const s1y = points[pk][1] - points[pi][1];\n                const s2x = points[pj][0] - points[pi][0];\n                const s2y = points[pj][1] - points[pi][1];\n                const area = Math.abs(s1x * s2y - s1y * s2x);\n                if (area > 0) {\n                    found = true;\n                    minArea = Math.min(minArea, area);\n                }\n            }\n        }\n    }\n    return found ? minArea : 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_pair": [
        4,
        5,
        6,
        7
      ],
      "compute_key": [
        8,
        9,
        10,
        11
      ],
      "add_to_group": [
        12,
        13
      ],
      "check_group": [
        20,
        21,
        22,
        23
      ],
      "compute_area": [
        24,
        25,
        26,
        27,
        28
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "group_has_pair": [
        19
      ],
      "area_positive": [
        29
      ],
      "new_minimum": [
        31
      ]
    }
  }
};

const MinimumAreaRectangleIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Forms rectangle",
    "value": {
      "points": [
        [
          1,
          2
        ],
        [
          2,
          1
        ],
        [
          1,
          0
        ],
        [
          0,
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Multiple candidates",
    "value": {
      "points": [
        [
          0,
          1
        ],
        [
          2,
          1
        ],
        [
          1,
          1
        ],
        [
          1,
          0
        ],
        [
          2,
          0
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Square + extra",
    "value": {
      "points": [
        [
          0,
          0
        ],
        [
          1,
          0
        ],
        [
          1,
          1
        ],
        [
          0,
          1
        ],
        [
          2,
          2
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "No rectangle",
    "value": {
      "points": [
        [
          0,
          0
        ],
        [
          1,
          0
        ],
        [
          2,
          0
        ]
      ]
    }
  }
];

function generateMinimumAreaRectangleIiSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.points,i=t.length,a=new StepRecorder({points:t,minArea:"∞",phase:"group",groups:{},exprParts:[]},{}),r=e=>a.update_variable("exprParts",e),s=()=>{["pairI","pairJ","midX","midY","lenSq","activeKey","diag1","diag2","rectOrder","area","isNewMin"].forEach(e=>a.delete_variable(e))};s(),r([{t:"a rectangle's two diagonals share a midpoint and a length",c:"muted"}]),a.record("-","Find the minimum-area rectangle of any orientation");let o=new Map,p=e=>Math.round(100*e)/100;for(let e=0;e<i;e++)for(let n=e+1;n<i;n++){let i=t[e][0]+t[n][0],s=t[e][1]+t[n][1],l=t[e][0]-t[n][0],u=t[e][1]-t[n][1],d=l*l+u*u,c=`${i},${s},${d}`,m=i/2,g=s/2;a.update_variable("phase","group"),a.update_variable("pairI",e),a.update_variable("pairJ",n),a.delete_variable("midX"),a.delete_variable("midY"),a.delete_variable("activeKey"),r([{t:"pair ",c:"muted"},{t:`p${e}–p${n}`,c:"cyan"},{t:": a candidate diagonal",c:"muted"}]),a.record("pick_pair",`Pair p${e} (${t[e]}) and p${n} (${t[n]})`),a.update_variable("midX",m),a.update_variable("midY",g),a.update_variable("lenSq",d),a.update_variable("activeKey",c),r([{t:"midpoint (",c:"muted"},{t:`${p(m)}, ${p(g)}`,c:"yellow"},{t:"), length\xb2 = ",c:"muted"},{t:`${d}`,c:"yellow"}]),a.record("compute_key",`key = midpoint (${p(m)},${p(g)}), length\xb2 ${d}`),o.has(c)||o.set(c,[]),o.get(c).push([e,n]);let h=o.get(c).length;a.update_variable("groups",Object.fromEntries(o)),r([{t:"group by that key  →  ",c:"muted"},{t:`${h} pair${h>1?"s":""}`,c:h>1?"green":"cyan"},{t:h>1?" share it (rectangle!)":" so far",c:"muted"}]),a.record("add_to_group",`Group now has ${h} pair(s)`)}let l=1/0,u=null;for(let[e,i]of o){if(i.length<2)continue;let[n,o]=e.split(",").map(Number);for(let e=0;e<i.length;e++)for(let d=e+1;d<i.length;d++){let[c,m]=i[e],[g,h]=i[d],f=[c,g,m,h];a.update_variable("phase","check"),s(),a.update_variable("midX",n/2),a.update_variable("midY",o/2),a.update_variable("diag1",[c,m]),a.update_variable("diag2",[g,h]),a.update_variable("rectOrder",f),a.add_conditional("group_has_pair",!0),r([{t:`diagonals p${c}–p${m} and p${g}–p${h} share midpoint  →  `,c:"muted"},{t:"a rectangle",c:"cyan"}]),a.record("check_group",`Rectangle from diagonals (${c},${m}) & (${g},${h})`);let x=t[g][0]-t[c][0],y=t[g][1]-t[c][1],_=t[m][0]-t[c][0],b=t[m][1]-t[c][1],j=Math.abs(x*b-y*_),k=j>0;a.add_conditional("area_positive",k),a.update_variable("area",p(j)),r([{t:`area = |${x}\xb7${b} − ${y}\xb7${_}| = `,c:"muted"},{t:`${p(j)}`,c:k?"cyan":"red"}]),a.record("compute_area",`area = ${p(j)}`);let v=k&&j<l;a.add_conditional("new_minimum",v),v?(l=j,u=f,a.update_variable("minArea",p(l)),a.update_variable("bestOrder",f),a.update_variable("isNewMin",!0),r([{t:`${p(j)} is the smallest so far  →  `,c:"muted"},{t:`new min ${p(l)}`,c:"green"}])):(a.update_variable("isNewMin",!1),r([k?{t:`${p(j)} ≥ min ${p(l)}, keep current min`,c:"muted"}:{t:"degenerate (area 0), skip",c:"muted"}])),a.record("update_min",v?`New min ${p(l)}`:"min stays")}}let d=l===1/0?0:p(l);return s(),a.update_variable("phase","done"),a.update_variable("minArea",d),u&&(a.update_variable("bestOrder",u),a.update_variable("rectOrder",u)),a.update_variable("done",!0),a.update_variable("answer",d),r([{t:"minimum area rectangle = ",c:"muted"},{t:`${d}`,c:"green"}]),a.record("complete",u?`Minimum area = ${d}`:"No rectangle, return 0"),a.getSteps()
  })(__inputArg);
}

export function MinimumAreaRectangleIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumAreaRectangleIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumAreaRectangleIiSteps(e) as any[];
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
      title="Minimum Area Rectangle II"
      slug="minimum-area-rectangle-ii"
      approaches={approaches}
      presets={MinimumAreaRectangleIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Max Points on a Line (max-points-on-a-line)
// ==========================================

const MaxPointsOnALineTemplates = {
  "python": {
    "language": "python",
    "code": "def max_points(points):\n    n = len(points)\n    if n < 3:\n        return n\n    result = 2\n    for i in range(n):\n        slope_map = {}\n        local_max = 0\n        for j in range(n):\n            if j == i:\n                continue\n            dy = points[j][1] - points[i][1]\n            dx = points[j][0] - points[i][0]\n            g = gcd(abs(dy), abs(dx))\n            dy //= g\n            dx //= g\n            if dx < 0:\n                dy, dx = -dy, -dx\n            elif dx == 0:\n                dy = abs(dy)\n            key = f\"{dy}/{dx}\"\n            slope_map[key] = slope_map.get(key, 0) + 1\n            local_max = max(local_max, slope_map[key])\n        result = max(result, local_max + 1)\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "check_base": [
        2,
        3,
        4
      ],
      "pick_anchor": [
        6,
        7,
        8
      ],
      "compute_slope": [
        12,
        13
      ],
      "normalize_slope": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "update_count": [
        22
      ],
      "update_local_max": [
        23
      ],
      "update_result": [
        24
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "n_lt_3": [
        3
      ],
      "skip_self": [
        10
      ],
      "dx_negative": [
        17
      ],
      "dx_zero": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxPoints(int[][] points) {\n    int n = points.length;\n    if (n < 3) return n;\n    int result = 2;\n    for (int i = 0; i < n; i++) {\n        HashMap<String, Integer> slopeMap = new HashMap<>();\n        int localMax = 0;\n        for (int j = 0; j < n; j++) {\n            if (j == i) continue;\n            int dy = points[j][1] - points[i][1];\n            int dx = points[j][0] - points[i][0];\n            int g = gcd(Math.abs(dy), Math.abs(dx));\n            dy /= g;\n            dx /= g;\n            if (dx < 0) { dy = -dy; dx = -dx; }\n            else if (dx == 0) { dy = Math.abs(dy); }\n            String key = dy + \"/\" + dx;\n            slopeMap.put(key, slopeMap.getOrDefault(key, 0) + 1);\n            localMax = Math.max(localMax, slopeMap.get(key));\n        }\n        result = Math.max(result, localMax + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_base": [
        2,
        3
      ],
      "pick_anchor": [
        5,
        6,
        7
      ],
      "compute_slope": [
        10,
        11
      ],
      "normalize_slope": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "update_count": [
        18
      ],
      "update_local_max": [
        19
      ],
      "update_result": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "n_lt_3": [
        3
      ],
      "skip_self": [
        9
      ],
      "dx_negative": [
        15
      ],
      "dx_zero": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxPoints(vector<vector<int>>& points) {\n    int n = points.size();\n    if (n < 3) return n;\n    int result = 2;\n    for (int i = 0; i < n; i++) {\n        unordered_map<string, int> slopeMap;\n        int localMax = 0;\n        for (int j = 0; j < n; j++) {\n            if (j == i) continue;\n            int dy = points[j][1] - points[i][1];\n            int dx = points[j][0] - points[i][0];\n            int g = __gcd(abs(dy), abs(dx));\n            dy /= g;\n            dx /= g;\n            if (dx < 0) { dy = -dy; dx = -dx; }\n            else if (dx == 0) { dy = abs(dy); }\n            string key = to_string(dy) + \"/\" + to_string(dx);\n            slopeMap[key]++;\n            localMax = max(localMax, slopeMap[key]);\n        }\n        result = max(result, localMax + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_base": [
        2,
        3
      ],
      "pick_anchor": [
        5,
        6,
        7
      ],
      "compute_slope": [
        10,
        11
      ],
      "normalize_slope": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "update_count": [
        18
      ],
      "update_local_max": [
        19
      ],
      "update_result": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "n_lt_3": [
        3
      ],
      "skip_self": [
        9
      ],
      "dx_negative": [
        15
      ],
      "dx_zero": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxPoints(int[][] points) {\n    int n = points.Length;\n    if (n < 3) return n;\n    int result = 2;\n    for (int i = 0; i < n; i++) {\n        var slopeMap = new Dictionary<string, int>();\n        int localMax = 0;\n        for (int j = 0; j < n; j++) {\n            if (j == i) continue;\n            int dy = points[j][1] - points[i][1];\n            int dx = points[j][0] - points[i][0];\n            int g = GCD(Math.Abs(dy), Math.Abs(dx));\n            dy /= g;\n            dx /= g;\n            if (dx < 0) { dy = -dy; dx = -dx; }\n            else if (dx == 0) { dy = Math.Abs(dy); }\n            string key = $\"{dy}/{dx}\";\n            slopeMap[key] = slopeMap.GetValueOrDefault(key, 0) + 1;\n            localMax = Math.Max(localMax, slopeMap[key]);\n        }\n        result = Math.Max(result, localMax + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_base": [
        2,
        3
      ],
      "pick_anchor": [
        5,
        6,
        7
      ],
      "compute_slope": [
        10,
        11
      ],
      "normalize_slope": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "update_count": [
        18
      ],
      "update_local_max": [
        19
      ],
      "update_result": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "n_lt_3": [
        3
      ],
      "skip_self": [
        9
      ],
      "dx_negative": [
        15
      ],
      "dx_zero": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxPoints(points [][]int) int {\n    n := len(points)\n    if n < 3 {\n        return n\n    }\n    result := 2\n    for i := 0; i < n; i++ {\n        slopeMap := make(map[string]int)\n        localMax := 0\n        for j := 0; j < n; j++ {\n            if j == i {\n                continue\n            }\n            dy := points[j][1] - points[i][1]\n            dx := points[j][0] - points[i][0]\n            g := gcd(abs(dy), abs(dx))\n            dy /= g\n            dx /= g\n            if dx < 0 {\n                dy, dx = -dy, -dx\n            } else if dx == 0 {\n                dy = abs(dy)\n            }\n            key := fmt.Sprintf(\"%d/%d\", dy, dx)\n            slopeMap[key]++\n            if slopeMap[key] > localMax {\n                localMax = slopeMap[key]\n            }\n        }\n        if localMax+1 > result {\n            result = localMax + 1\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_base": [
        2,
        3,
        4
      ],
      "pick_anchor": [
        7,
        8,
        9
      ],
      "compute_slope": [
        14,
        15
      ],
      "normalize_slope": [
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        24
      ],
      "update_count": [
        25
      ],
      "update_local_max": [
        26,
        27
      ],
      "update_result": [
        30,
        31
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "n_lt_3": [
        3
      ],
      "skip_self": [
        11
      ],
      "dx_negative": [
        19
      ],
      "dx_zero": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxPoints(points) {\n    const n = points.length;\n    if (n < 3) return n;\n    let result = 2;\n    for (let i = 0; i < n; i++) {\n        const slopeMap = {};\n        let localMax = 0;\n        for (let j = 0; j < n; j++) {\n            if (j === i) continue;\n            let dy = points[j][1] - points[i][1];\n            let dx = points[j][0] - points[i][0];\n            const g = gcd(Math.abs(dy), Math.abs(dx));\n            dy /= g;\n            dx /= g;\n            if (dx < 0) { dy = -dy; dx = -dx; }\n            else if (dx === 0) { dy = Math.abs(dy); }\n            const key = `${dy}/${dx}`;\n            slopeMap[key] = (slopeMap[key] || 0) + 1;\n            localMax = Math.max(localMax, slopeMap[key]);\n        }\n        result = Math.max(result, localMax + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_base": [
        2,
        3
      ],
      "pick_anchor": [
        5,
        6,
        7
      ],
      "compute_slope": [
        10,
        11
      ],
      "normalize_slope": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "update_count": [
        18
      ],
      "update_local_max": [
        19
      ],
      "update_result": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "n_lt_3": [
        3
      ],
      "skip_self": [
        9
      ],
      "dx_negative": [
        15
      ],
      "dx_zero": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxPoints(points: number[][]): number {\n    const n = points.length;\n    if (n < 3) return n;\n    let result = 2;\n    for (let i = 0; i < n; i++) {\n        const slopeMap: Record<string, number> = {};\n        let localMax = 0;\n        for (let j = 0; j < n; j++) {\n            if (j === i) continue;\n            let dy = points[j][1] - points[i][1];\n            let dx = points[j][0] - points[i][0];\n            const g = gcd(Math.abs(dy), Math.abs(dx));\n            dy /= g;\n            dx /= g;\n            if (dx < 0) { dy = -dy; dx = -dx; }\n            else if (dx === 0) { dy = Math.abs(dy); }\n            const key = `${dy}/${dx}`;\n            slopeMap[key] = (slopeMap[key] || 0) + 1;\n            localMax = Math.max(localMax, slopeMap[key]);\n        }\n        result = Math.max(result, localMax + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_base": [
        2,
        3
      ],
      "pick_anchor": [
        5,
        6,
        7
      ],
      "compute_slope": [
        10,
        11
      ],
      "normalize_slope": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "update_count": [
        18
      ],
      "update_local_max": [
        19
      ],
      "update_result": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "n_lt_3": [
        3
      ],
      "skip_self": [
        9
      ],
      "dx_negative": [
        15
      ],
      "dx_zero": [
        16
      ]
    }
  }
};

const MaxPointsOnALinePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "All collinear (3)",
    "value": {
      "points": [
        [
          1,
          1
        ],
        [
          2,
          2
        ],
        [
          3,
          3
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Mixed (result=4)",
    "value": {
      "points": [
        [
          1,
          1
        ],
        [
          3,
          2
        ],
        [
          5,
          3
        ],
        [
          4,
          1
        ],
        [
          2,
          3
        ],
        [
          1,
          4
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Two points (2)",
    "value": {
      "points": [
        [
          1,
          0
        ],
        [
          0,
          0
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Two lines",
    "value": {
      "points": [
        [
          0,
          0
        ],
        [
          1,
          1
        ],
        [
          2,
          2
        ],
        [
          3,
          1
        ],
        [
          4,
          0
        ]
      ]
    }
  }
];

function generateMaxPointsOnALineSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.points,a=t.length,i=new StepRecorder({points:t,result:0,n:a,slopeMap:{},exprParts:[]},{}),l=e=>i.update_variable("exprParts",e),o=()=>{["anchor","comparePt","rawDy","rawDx","normKey","lineSlope","linePoints","localMax","bestLine"].forEach(e=>i.delete_variable(e))};if(o(),l([{t:"collinear points through an anchor share the same slope",c:"muted"}]),i.record("-","Find the most points on one line"),i.add_conditional("n_lt_3",a<3),a<3)return i.update_variable("result",a),i.update_variable("done",!0),i.update_variable("answer",a),l([{t:`n = ${a} < 3, every point counts  →  `,c:"muted"},{t:`${a}`,c:"green"}]),i.record("check_base",`n = ${a} < 3, return ${a}`),i.record("complete",`Maximum points on a line: ${a}`),i.getSteps();l([{t:`n = ${a} ≥ 3, check every anchor`,c:"muted"}]),i.record("check_base",`n = ${a} ≥ 3, proceed`);let s=2;i.update_variable("result",s);let r=null;for(let e=0;e<a;e++){let n=new Map,d=new Map,p=0;o(),i.update_variable("anchor",e),i.update_variable("localMax",0),i.update_variable("slopeMap",{}),l([{t:`anchor p${e} (${t[e]}): measure the slope to every other point`,c:"muted"}]),i.record("pick_anchor",`Anchor p${e} = (${t[e]})`);for(let o=0;o<a;o++){if(o===e){i.add_conditional("skip_self",!0);continue}i.add_conditional("skip_self",!1);let a=t[o][1]-t[e][1],s=t[o][0]-t[e][0];i.update_variable("comparePt",o),i.update_variable("rawDy",a),i.update_variable("rawDx",s),i.delete_variable("normKey"),l([{t:`to p${o}: dy = ${a}, dx = ${s}`,c:"cyan"}]),i.record("compute_slope",`p${o}: dy = ${a}, dx = ${s}`);let r=function(e,t){for(e=Math.abs(e),t=Math.abs(t);0!==t;){let a=t;t=e%t,e=a}return e}(a,s);0!==r&&(a/=r,s/=r),i.add_conditional("dx_negative",s<0),i.add_conditional("dx_zero",0===s),s<0?(a=-a,s=-s):0===s&&(a=Math.abs(a));let c=`${a}/${s}`;i.update_variable("normKey",c),i.update_variable("lineSlope",{dy:a,dx:s}),l([{t:"reduce  →  slope ",c:"muted"},{t:`${c}`,c:"yellow"}]),i.record("normalize_slope",`Normalized slope ${c}`);let u=(n.get(c)||0)+1;n.set(c,u),d.has(c)||d.set(c,[e]),d.get(c).includes(o)||d.get(c).push(o),i.update_variable("slopeMap",Object.fromEntries(n)),l([{t:"slope ",c:"muted"},{t:`${c}`,c:"yellow"},{t:" now has ",c:"muted"},{t:`${u}`,c:"cyan"},{t:` other point${u>1?"s":""}`,c:"muted"}]),i.record("update_count",`slopeMap[${c}] = ${u}`),u>p?(p=u,i.update_variable("localMax",p),i.update_variable("lineSlope",{dy:a,dx:s}),i.update_variable("linePoints",[...d.get(c)]),l([{t:`${p+1} points on this line  →  `,c:"muted"},{t:`best for anchor p${e}`,c:"green"}]),i.record("update_local_max",`Local max ${p} at slope ${c}`)):(i.delete_variable("lineSlope"),i.delete_variable("linePoints"),l([{t:`local best stays ${p+1} points`,c:"muted"}]),i.record("update_local_max",`Local max unchanged ${p}`))}if(p+1>s){s=p+1,i.update_variable("result",s);let t="",a=0;for(let[e,i]of n.entries())i>a&&(a=i,t=e);let[o,c]=t.split("/").map(Number);r={anchor:e,slope:{dy:o,dx:c},points:d.get(t)||[e]},i.update_variable("bestLine",r),l([{t:`anchor p${e} gives ${s} points  →  `,c:"muted"},{t:`new global max ${s}`,c:"green"}]),i.record("update_result",`Global result ${s}`)}else r&&i.update_variable("bestLine",r),l([{t:`global max stays ${s}`,c:"muted"}]),i.record("update_result",`Global result unchanged ${s}`)}return o(),i.update_variable("result",s),r&&i.update_variable("bestLine",r),i.update_variable("done",!0),i.update_variable("answer",s),l([{t:"max points on a line = ",c:"muted"},{t:`${s}`,c:"green"}]),i.record("complete",`Maximum points on a line: ${s}`),i.getSteps()
  })(__inputArg);
}

export function MaxPointsOnALineProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaxPointsOnALineTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaxPointsOnALineSteps(e) as any[];
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
      title="Max Points on a Line"
      slug="max-points-on-a-line"
      approaches={approaches}
      presets={MaxPointsOnALinePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Perfect Rectangle (perfect-rectangle)
// ==========================================

const PerfectRectangleTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def isRectangleCover(self, rectangles: list[list[int]]) -> bool:\n        min_x = float('inf')\n        min_y = float('inf')\n        max_a = float('-inf')\n        max_b = float('-inf')\n        total_area = 0\n\n        for x, y, a, b in rectangles:\n            min_x = min(min_x, x)\n            min_y = min(min_y, y)\n            max_a = max(max_a, a)\n            max_b = max(max_b, b)\n            total_area += (a - x) * (b - y)\n\n        # Area check\n        bounding_area = (max_a - min_x) * (max_b - min_y)\n        if total_area != bounding_area:\n            return False\n\n        # Pairwise overlap check\n        for i in range(len(rectangles)):\n            for j in range(i + 1, len(rectangles)):\n                if self.overlaps(rectangles[i], rectangles[j]):\n                    return False\n        return True\n\n    def overlaps(self, a: list[int], b: list[int]) -> bool:\n        return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "process_rect": [
        9
      ],
      "update_bounds": [
        10,
        11,
        12,
        13
      ],
      "add_area": [
        14
      ],
      "check_area": [
        16,
        17
      ],
      "area_mismatch": [
        18,
        19
      ],
      "area_match": [
        18
      ],
      "pick_pair": [
        21,
        22,
        23
      ],
      "pair_overlap": [
        24,
        25
      ],
      "pair_ok": [
        24,
        29
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "for_rect": [
        9
      ],
      "area_matches": [
        18
      ],
      "for_i": [
        22
      ],
      "for_j": [
        23
      ],
      "overlaps": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean isRectangleCover(int[][] rectangles) {\n        int minX = Integer.MAX_VALUE, minY = Integer.MAX_VALUE;\n        int maxA = Integer.MIN_VALUE, maxB = Integer.MIN_VALUE;\n        long totalArea = 0;\n\n        for (int[] rect : rectangles) {\n            minX = Math.min(minX, rect[0]);\n            minY = Math.min(minY, rect[1]);\n            maxA = Math.max(maxA, rect[2]);\n            maxB = Math.max(maxB, rect[3]);\n            totalArea += (long)(rect[2] - rect[0]) * (rect[3] - rect[1]);\n        }\n\n        // Area check\n        long boundingArea = (long)(maxA - minX) * (maxB - minY);\n        if (totalArea != boundingArea) return false;\n\n        // Pairwise overlap check\n        for (int i = 0; i < rectangles.length; i++) {\n            for (int j = i + 1; j < rectangles.length; j++) {\n                if (overlaps(rectangles[i], rectangles[j])) return false;\n            }\n        }\n        return true;\n    }\n\n    private boolean overlaps(int[] a, int[] b) {\n        // Two rectangles overlap if they intersect in both x and y\n        return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5
      ],
      "process_rect": [
        7
      ],
      "update_bounds": [
        8,
        9,
        10,
        11
      ],
      "add_area": [
        12
      ],
      "check_area": [
        15,
        16
      ],
      "area_mismatch": [
        17
      ],
      "area_match": [
        17
      ],
      "pick_pair": [
        19,
        20,
        21
      ],
      "pair_overlap": [
        22
      ],
      "pair_ok": [
        22,
        30
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_rect": [
        7
      ],
      "area_matches": [
        17
      ],
      "for_i": [
        20
      ],
      "for_j": [
        21
      ],
      "overlaps": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool isRectangleCover(vector<vector<int>>& rectangles) {\n        int minX = INT_MAX, minY = INT_MAX;\n        int maxA = INT_MIN, maxB = INT_MIN;\n        long long totalArea = 0;\n\n        for (auto& rect : rectangles) {\n            minX = min(minX, rect[0]);\n            minY = min(minY, rect[1]);\n            maxA = max(maxA, rect[2]);\n            maxB = max(maxB, rect[3]);\n            totalArea += (long long)(rect[2] - rect[0]) * (rect[3] - rect[1]);\n        }\n\n        long long boundingArea = (long long)(maxA - minX) * (maxB - minY);\n        if (totalArea != boundingArea) return false;\n\n        // Pairwise overlap check\n        int n = rectangles.size();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (overlaps(rectangles[i], rectangles[j])) return false;\n            }\n        }\n        return true;\n    }\n\nprivate:\n    bool overlaps(vector<int>& a, vector<int>& b) {\n        return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3,
        4,
        5,
        6
      ],
      "process_rect": [
        8
      ],
      "update_bounds": [
        9,
        10,
        11,
        12
      ],
      "add_area": [
        13
      ],
      "check_area": [
        16,
        17
      ],
      "area_mismatch": [
        17
      ],
      "area_match": [
        17
      ],
      "pick_pair": [
        19,
        20,
        21,
        22
      ],
      "pair_overlap": [
        23
      ],
      "pair_ok": [
        23,
        31
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "for_rect": [
        8
      ],
      "area_matches": [
        17
      ],
      "for_i": [
        21
      ],
      "for_j": [
        22
      ],
      "overlaps": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool IsRectangleCover(int[][] rectangles) {\n        int minX = int.MaxValue, minY = int.MaxValue;\n        int maxA = int.MinValue, maxB = int.MinValue;\n        long totalArea = 0;\n\n        foreach (var rect in rectangles) {\n            minX = Math.Min(minX, rect[0]);\n            minY = Math.Min(minY, rect[1]);\n            maxA = Math.Max(maxA, rect[2]);\n            maxB = Math.Max(maxB, rect[3]);\n            totalArea += (long)(rect[2] - rect[0]) * (rect[3] - rect[1]);\n        }\n\n        long boundingArea = (long)(maxA - minX) * (maxB - minY);\n        if (totalArea != boundingArea) return false;\n\n        for (int i = 0; i < rectangles.Length; i++) {\n            for (int j = i + 1; j < rectangles.Length; j++) {\n                if (Overlaps(rectangles[i], rectangles[j])) return false;\n            }\n        }\n        return true;\n    }\n\n    private bool Overlaps(int[] a, int[] b) {\n        return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5
      ],
      "process_rect": [
        7
      ],
      "update_bounds": [
        8,
        9,
        10,
        11
      ],
      "add_area": [
        12
      ],
      "check_area": [
        15,
        16
      ],
      "area_mismatch": [
        16
      ],
      "area_match": [
        16
      ],
      "pick_pair": [
        18,
        19
      ],
      "pair_overlap": [
        20
      ],
      "pair_ok": [
        20,
        27
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_rect": [
        7
      ],
      "area_matches": [
        16
      ],
      "for_i": [
        18
      ],
      "for_j": [
        19
      ],
      "overlaps": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isRectangleCover(rectangles [][]int) bool {\n    minX, minY := math.MaxInt32, math.MaxInt32\n    maxA, maxB := math.MinInt32, math.MinInt32\n    totalArea := int64(0)\n\n    for _, rect := range rectangles {\n        if rect[0] < minX { minX = rect[0] }\n        if rect[1] < minY { minY = rect[1] }\n        if rect[2] > maxA { maxA = rect[2] }\n        if rect[3] > maxB { maxB = rect[3] }\n        totalArea += int64(rect[2]-rect[0]) * int64(rect[3]-rect[1])\n    }\n\n    boundingArea := int64(maxA-minX) * int64(maxB-minY)\n    if totalArea != boundingArea {\n        return false\n    }\n\n    // Pairwise overlap check\n    for i := 0; i < len(rectangles); i++ {\n        for j := i + 1; j < len(rectangles); j++ {\n            if overlaps(rectangles[i], rectangles[j]) {\n                return false\n            }\n        }\n    }\n    return true\n}\n\nfunc overlaps(a, b []int) bool {\n    return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "process_rect": [
        6
      ],
      "update_bounds": [
        7,
        8,
        9,
        10
      ],
      "add_area": [
        11
      ],
      "check_area": [
        14,
        15
      ],
      "area_mismatch": [
        15,
        16
      ],
      "area_match": [
        15
      ],
      "pick_pair": [
        19,
        20,
        21
      ],
      "pair_overlap": [
        22,
        23
      ],
      "pair_ok": [
        22,
        31
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_rect": [
        6
      ],
      "area_matches": [
        15
      ],
      "for_i": [
        20
      ],
      "for_j": [
        21
      ],
      "overlaps": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var isRectangleCover = function(rectangles) {\n    var minX = Infinity, minY = Infinity;\n    var maxA = -Infinity, maxB = -Infinity;\n    var totalArea = 0;\n\n    for (var i = 0; i < rectangles.length; i++) {\n        var rect = rectangles[i];\n        minX = Math.min(minX, rect[0]);\n        minY = Math.min(minY, rect[1]);\n        maxA = Math.max(maxA, rect[2]);\n        maxB = Math.max(maxB, rect[3]);\n        totalArea += (rect[2] - rect[0]) * (rect[3] - rect[1]);\n    }\n\n    var boundingArea = (maxA - minX) * (maxB - minY);\n    if (totalArea !== boundingArea) return false;\n\n    // Pairwise overlap check\n    for (var i = 0; i < rectangles.length; i++) {\n        for (var j = i + 1; j < rectangles.length; j++) {\n            var a = rectangles[i], b = rectangles[j];\n            if (a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]) return false;\n        }\n    }\n    return true;\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "process_rect": [
        6,
        7
      ],
      "update_bounds": [
        8,
        9,
        10,
        11
      ],
      "add_area": [
        12
      ],
      "check_area": [
        15,
        16
      ],
      "area_mismatch": [
        16
      ],
      "area_match": [
        16
      ],
      "pick_pair": [
        18,
        19,
        20,
        21
      ],
      "pair_overlap": [
        22
      ],
      "pair_ok": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_rect": [
        6
      ],
      "area_matches": [
        16
      ],
      "for_i": [
        19
      ],
      "for_j": [
        20
      ],
      "overlaps": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isRectangleCover(rectangles: number[][]): boolean {\n    let minX = Infinity, minY = Infinity;\n    let maxA = -Infinity, maxB = -Infinity;\n    let totalArea = 0;\n\n    for (const rect of rectangles) {\n        minX = Math.min(minX, rect[0]);\n        minY = Math.min(minY, rect[1]);\n        maxA = Math.max(maxA, rect[2]);\n        maxB = Math.max(maxB, rect[3]);\n        totalArea += (rect[2] - rect[0]) * (rect[3] - rect[1]);\n    }\n\n    const boundingArea = (maxA - minX) * (maxB - minY);\n    if (totalArea !== boundingArea) return false;\n\n    for (let i = 0; i < rectangles.length; i++) {\n        for (let j = i + 1; j < rectangles.length; j++) {\n            const a = rectangles[i], b = rectangles[j];\n            if (a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]) return false;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "process_rect": [
        6
      ],
      "update_bounds": [
        7,
        8,
        9,
        10
      ],
      "add_area": [
        11
      ],
      "check_area": [
        14,
        15
      ],
      "area_mismatch": [
        15
      ],
      "area_match": [
        15
      ],
      "pick_pair": [
        17,
        18,
        19
      ],
      "pair_overlap": [
        20
      ],
      "pair_ok": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_rect": [
        6
      ],
      "area_matches": [
        15
      ],
      "for_i": [
        17
      ],
      "for_j": [
        18
      ],
      "overlaps": [
        20
      ]
    }
  }
};

const PerfectRectanglePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Perfect",
    "value": {
      "rectangles": [
        [
          1,
          1,
          3,
          3
        ],
        [
          3,
          1,
          4,
          2
        ],
        [
          3,
          2,
          4,
          4
        ],
        [
          1,
          3,
          2,
          4
        ],
        [
          2,
          3,
          3,
          4
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Overlap",
    "value": {
      "rectangles": [
        [
          0,
          0,
          2,
          2
        ],
        [
          1,
          0,
          3,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Gap",
    "value": {
      "rectangles": [
        [
          1,
          1,
          3,
          3
        ],
        [
          3,
          1,
          4,
          2
        ],
        [
          1,
          3,
          2,
          4
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Equal Areas, Bad Corners",
    "value": {
      "rectangles": [
        [
          0,
          0,
          2,
          2
        ],
        [
          1,
          1,
          3,
          3
        ],
        [
          2,
          0,
          3,
          1
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Simple 2x2",
    "value": {
      "rectangles": [
        [
          0,
          0,
          1,
          1
        ],
        [
          0,
          1,
          1,
          2
        ],
        [
          1,
          0,
          2,
          1
        ],
        [
          1,
          1,
          2,
          2
        ]
      ]
    }
  }
];

function generatePerfectRectangleSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.rectangles.map(e=>[...e]),a=new StepRecorder({},{});if(0===t.length)return a.update_variable("result",!1),a.record("complete","No rectangles provided"),a.getSteps();for(let e=0;e<t.length;e++){let r=t[e];a.add_new_visual(`rect_${e}`,{type:"metadata",value:{x1:r[0],y1:r[1],x2:r[2],y2:r[3],state:"pending"}})}a.add_new_visual("meta_bounds",{type:"metadata",value:{minX:null,minY:null,maxA:null,maxB:null}}),a.add_new_visual("meta_area",{type:"metadata",value:{totalArea:0,boundingArea:0}}),a.add_new_visual("meta_corners",{type:"metadata",value:{set:[],added:[],removed:[]}}),a.add_new_visual("meta_result",{type:"metadata",value:{result:null}}),a.record("-","Check if rectangles form an exact cover of a rectangular region");let n=1/0,i=1/0,s=-1/0,o=-1/0,l=0,c=new Set;for(let e=0;e<t.length;e++){let r=t[e];a.update_visual(`rect_${e}`,{type:"metadata",value:{x1:r[0],y1:r[1],x2:r[2],y2:r[3],state:"current"}}),a.add_conditional("for_rect",!0),a.record("process_rect",`Process rectangle ${e+1} of ${t.length}: bottom-left (${r[0]}, ${r[1]}), top-right (${r[2]}, ${r[3]})`),n=Math.min(n,r[0]),i=Math.min(i,r[1]),s=Math.max(s,r[2]),o=Math.max(o,r[3]),a.update_visual("meta_bounds",{type:"metadata",value:{minX:n,minY:i,maxA:s,maxB:o}}),a.record("update_bounds",`Grow the bounding rectangle to enclose this one: (${n}, ${i}) to (${s}, ${o})`);let m=(r[2]-r[0])*(r[3]-r[1]);l+=m,a.update_visual("meta_area",{type:"metadata",value:{totalArea:l,boundingArea:0}}),a.record("add_area",`Add this rectangle's area ${m} to the running sum: total area = ${l}`);let d=[`${r[0]},${r[1]}`,`${r[0]},${r[3]}`,`${r[2]},${r[1]}`,`${r[2]},${r[3]}`],u=[],p=[];for(let e of d)c.has(e)?(c.delete(e),p.push(e)):(c.add(e),u.push(e));a.update_visual("meta_corners",{type:"metadata",value:{set:Array.from(c),added:u,removed:p}});let h=e=>e.map(e=>`(${e})`).join(" "),_=[];u.length>0&&_.push(`added ${h(u)}`),p.length>0&&_.push(`cancelled ${h(p)} (shared with an earlier rectangle)`),a.record("toggle_corners",`Toggle this rectangle's 4 corners: ${_.join("; ")}. Shared corners cancel in pairs, so a perfect cover leaves exactly the 4 outer corners. Set size: ${c.size}`),a.update_visual(`rect_${e}`,{type:"metadata",value:{x1:r[0],y1:r[1],x2:r[2],y2:r[3],state:"processed"}})}a.update_visual("meta_corners",{type:"metadata",value:{set:Array.from(c),added:[],removed:[]}});let m=(s-n)*(o-i);if(a.update_visual("meta_area",{type:"metadata",value:{totalArea:l,boundingArea:m}}),a.add_conditional("for_rect",!1),a.record("check_area",`Compare areas: sum of rectangle areas = ${l}, bounding rectangle area = ${m}. If they differ, there is a gap or an overlap.`),l!==m)return a.update_visual("meta_result",{type:"metadata",value:{result:!1}}),a.update_variable("result",!1),a.add_conditional("area_matches",!1),a.record("area_mismatch",`${l} != ${m}: the rectangles leave a gap or overlap somewhere. Return false.`),a.getSteps();a.add_conditional("area_matches",!0),a.record("area_match",`${l} == ${m}: areas match, but overlaps paired with gaps could still fake this. Check corners next.`);let d=[`${n},${i}`,`${n},${o}`,`${s},${i}`,`${s},${o}`];return(a.record("check_corners",`Check the surviving corners. A perfect cover leaves exactly 4: the bounding rectangle's own corners ${d.map(e=>`(${e})`).join(" ")}. Current set size: ${c.size}`),4!==c.size)?(a.update_visual("meta_result",{type:"metadata",value:{result:!1}}),a.update_variable("result",!1),a.add_conditional("corners_ok",!1),a.record("corners_count_mismatch",`${c.size} corners survived instead of 4: some corner did not cancel, so seams do not line up. Return false.`)):d.every(e=>c.has(e))?(a.update_visual("meta_result",{type:"metadata",value:{result:!0}}),a.update_variable("result",!0),a.add_conditional("corners_ok",!0),a.record("corners_match","Exactly the 4 bounding corners survived: every interior corner cancelled in pairs"),a.record("complete","Result: true, the rectangles form an exact cover of the bounding rectangle")):(a.update_visual("meta_result",{type:"metadata",value:{result:!1}}),a.update_variable("result",!1),a.add_conditional("corners_ok",!1),a.record("corners_position_mismatch","4 corners survived, but they are not the bounding rectangle's corners. Return false.")),a.getSteps()
  })(__inputArg);
}

export function PerfectRectangleProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PerfectRectangleTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePerfectRectangleSteps(e) as any[];
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
      title="Perfect Rectangle"
      slug="perfect-rectangle"
      approaches={approaches}
      presets={PerfectRectanglePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Pow(x, n) (powx-n)
// ==========================================

const PowxNTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def myPow(self, x: float, n: int) -> float:\n        power = n\n        if power < 0:\n            x = 1 / x\n            power = -power\n        return self.helper(x, power)\n\n    def helper(self, x, n):\n        if n == 0:\n            return 1.0\n        half = self.helper(x, n // 2)\n        if n % 2 == 0:\n            return half * half\n        else:\n            return half * half * x",
    "lineMap": {
      "-": [
        1
      ],
      "handle_neg": [
        3,
        4,
        5,
        6
      ],
      "call_helper": [
        7
      ],
      "check_base": [
        9,
        10
      ],
      "return_base": [
        11
      ],
      "compute_half_exp": [
        12
      ],
      "return_even": [
        13,
        14
      ],
      "return_odd": [
        15,
        16
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_negative": [
        4
      ],
      "base_case": [
        10
      ],
      "is_even": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public double myPow(double x, int n) {\n        long power = n;\n        if (power < 0) {\n            x = 1 / x;\n            power = -power;\n        }\n        return helper(x, power);\n    }\n    private double helper(double x, long n) {\n        if (n == 0) return 1.0;\n        double half = helper(x, n / 2);\n        if (n % 2 == 0) {\n            return half * half;\n        } else {\n            return half * half * x;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "handle_neg": [
        3,
        4,
        5,
        6
      ],
      "call_helper": [
        8
      ],
      "check_base": [
        10,
        11
      ],
      "return_base": [
        11
      ],
      "compute_half_exp": [
        12
      ],
      "return_even": [
        13,
        14
      ],
      "return_odd": [
        15,
        16
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "is_negative": [
        4
      ],
      "base_case": [
        11
      ],
      "is_even": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    double myPow(double x, int n) {\n        long power = n;\n        if (power < 0) {\n            x = 1 / x;\n            power = -power;\n        }\n        return helper(x, power);\n    }\n    double helper(double x, long n) {\n        if (n == 0) return 1.0;\n        double half = helper(x, n / 2);\n        if (n % 2 == 0) {\n            return half * half;\n        } else {\n            return half * half * x;\n        }\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "handle_neg": [
        4,
        5,
        6,
        7
      ],
      "call_helper": [
        9
      ],
      "check_base": [
        11,
        12
      ],
      "return_base": [
        12
      ],
      "compute_half_exp": [
        13
      ],
      "return_even": [
        14,
        15
      ],
      "return_odd": [
        16,
        17
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "is_negative": [
        5
      ],
      "base_case": [
        12
      ],
      "is_even": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public double MyPow(double x, int n) {\n        long power = n;\n        if (power < 0) {\n            x = 1 / x;\n            power = -power;\n        }\n        return Helper(x, power);\n    }\n    private double Helper(double x, long n) {\n        if (n == 0) return 1.0;\n        double half = Helper(x, n / 2);\n        if (n % 2 == 0) {\n            return half * half;\n        } else {\n            return half * half * x;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "handle_neg": [
        3,
        4,
        5,
        6
      ],
      "call_helper": [
        8
      ],
      "check_base": [
        10,
        11
      ],
      "return_base": [
        11
      ],
      "compute_half_exp": [
        12
      ],
      "return_even": [
        13,
        14
      ],
      "return_odd": [
        15,
        16
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "is_negative": [
        4
      ],
      "base_case": [
        11
      ],
      "is_even": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func myPow(x float64, n int) float64 {\n    power := int64(n)\n    if power < 0 {\n        x = 1 / x\n        power = -power\n    }\n    return helper(x, power)\n}\n\nfunc helper(x float64, n int64) float64 {\n    if n == 0 {\n        return 1.0\n    }\n    half := helper(x, n/2)\n    if n%2 == 0 {\n        return half * half\n    }\n    return half * half * x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "handle_neg": [
        2,
        3,
        4,
        5
      ],
      "call_helper": [
        7
      ],
      "check_base": [
        10,
        11
      ],
      "return_base": [
        12
      ],
      "compute_half_exp": [
        14
      ],
      "return_even": [
        15,
        16
      ],
      "return_odd": [
        18
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_negative": [
        3
      ],
      "base_case": [
        11
      ],
      "is_even": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var myPow = function(x, n) {\n    let power = n;\n    if (power < 0) {\n        x = 1 / x;\n        power = -power;\n    }\n    return helper(x, power);\n};\n\nfunction helper(x, n) {\n    if (n === 0) return 1.0;\n    let half = helper(x, Math.floor(n / 2));\n    if (n % 2 === 0) {\n        return half * half;\n    } else {\n        return half * half * x;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "handle_neg": [
        2,
        3,
        4,
        5
      ],
      "call_helper": [
        7
      ],
      "check_base": [
        10,
        11
      ],
      "return_base": [
        11
      ],
      "compute_half_exp": [
        12
      ],
      "return_even": [
        13,
        14
      ],
      "return_odd": [
        15,
        16
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_negative": [
        3
      ],
      "base_case": [
        11
      ],
      "is_even": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function myPow(x: number, n: number): number {\n    let power = n;\n    if (power < 0) {\n        x = 1 / x;\n        power = -power;\n    }\n    return helper(x, power);\n}\n\nfunction helper(x: number, n: number): number {\n    if (n === 0) return 1.0;\n    const half = helper(x, Math.floor(n / 2));\n    if (n % 2 === 0) {\n        return half * half;\n    } else {\n        return half * half * x;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "handle_neg": [
        2,
        3,
        4,
        5
      ],
      "call_helper": [
        7
      ],
      "check_base": [
        10,
        11
      ],
      "return_base": [
        11
      ],
      "compute_half_exp": [
        12
      ],
      "return_even": [
        13,
        14
      ],
      "return_odd": [
        15,
        16
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "is_negative": [
        3
      ],
      "base_case": [
        11
      ],
      "is_even": [
        13
      ]
    }
  }
};

const PowxNPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "2^10 (Even)",
    "value": {
      "x": 2,
      "n": 10
    }
  },
  {
    "id": "ex2",
    "label": "2.1^3 (Odd)",
    "value": {
      "x": 2.1,
      "n": 3
    }
  },
  {
    "id": "ex3",
    "label": "2^(-2) (Negative)",
    "value": {
      "x": 2,
      "n": -2
    }
  }
];

function generatePowxNSteps(__inputArg: any): any[] {
  let r=e=>Number.isFinite(e)?Number(e.toFixed(6)):null;
  return (function(e: any) {
let t=e.x??2,l=e.n??10,i=t,a=l,o=a<0,s=new StepRecorder({}),u=1,d=e=>{for(let[n,d]of(s.update_variable("origX",t),s.update_variable("origN",l),s.update_variable("isNeg",o),s.update_variable("x",r(i)),s.update_variable("power",a),s.update_variable("result",r(u)),Object.entries(e)))s.update_variable(n,d)},c=()=>s.delete_variable("bit");for(c(),d({}),s.record("-",`Compute ${t}^${l} by squaring and reading the exponent's bits.`),o?(i=1/i,a=-a,d({}),s.record("handle_neg",`n < 0: invert the base, x = 1/${t} = ${r(i)}, power = ${a}.`)):(d({}),s.record("handle_neg",`n ≥ 0: keep x = ${t}, power = ${a}.`)),u=1,c(),d({}),s.record("init","Start with result = 1.");a>0;){let e=a%2;d({bit:e}),s.record("check_bit",`power = ${a} (binary ${a.toString(2)}): low bit = ${e}.`),1===e&&(u*=i,d({bit:e}),s.record("multiply",`Bit is 1: fold this base in, result \xd7 x = ${r(u)}.`)),i*=i,a=Math.floor(a/2),c(),d({}),s.record("advance",`Square the base (x = ${r(i)}) and halve power → ${a}.`)}return c(),d({}),s.record("complete",`Done! ${t}^${l} = ${r(u)}.`),s.getSteps()
  })(__inputArg);
}

export function PowxNProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PowxNTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePowxNSteps(e) as any[];
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
      title="Pow(x, n)"
      slug="powx-n"
      approaches={approaches}
      presets={PowxNPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Rectangle Area II (rectangle-area-ii)
// ==========================================

const RectangleAreaIiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def rectangleArea(self, rectangles: list[list[int]]) -> int:\n        n = len(rectangles)\n        MOD = 10**9 + 7\n        total = 0\n\n        # Iterate over all non-empty subsets\n        for mask in range(1, 1 << n):\n            x1, y1 = 0, 0\n            x2, y2 = float('inf'), float('inf')\n            bits = 0\n\n            for i in range(n):\n                if mask & (1 << i):\n                    x1 = max(x1, rectangles[i][0])\n                    y1 = max(y1, rectangles[i][1])\n                    x2 = min(x2, rectangles[i][2])\n                    y2 = min(y2, rectangles[i][3])\n                    bits += 1\n\n            # Intersection area (0 if no overlap)\n            area = max(0, x2 - x1) * max(0, y2 - y1)\n\n            # Inclusion-exclusion: odd subsets add, even subsets subtract\n            if bits % 2 == 1:\n                total += area\n            else:\n                total -= area\n\n        return total % MOD",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "pick_subset": [
        7,
        8,
        9,
        10,
        11
      ],
      "test_bit": [
        13,
        14
      ],
      "shrink": [
        15,
        16,
        17,
        18,
        19
      ],
      "calc_area": [
        21,
        22
      ],
      "add_area": [
        24,
        25,
        26
      ],
      "sub_area": [
        27,
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "for_mask": [
        8
      ],
      "for_i": [
        13
      ],
      "in_subset": [
        14
      ],
      "is_odd": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int rectangleArea(int[][] rectangles) {\n        int n = rectangles.length;\n        long MOD = 1_000_000_007;\n        long total = 0;\n\n        // Iterate over all non-empty subsets\n        for (int mask = 1; mask < (1 << n); mask++) {\n            long x1 = 0, y1 = 0, x2 = Long.MAX_VALUE, y2 = Long.MAX_VALUE;\n            int bits = 0;\n\n            for (int i = 0; i < n; i++) {\n                if ((mask & (1 << i)) != 0) {\n                    x1 = Math.max(x1, rectangles[i][0]);\n                    y1 = Math.max(y1, rectangles[i][1]);\n                    x2 = Math.min(x2, rectangles[i][2]);\n                    y2 = Math.min(y2, rectangles[i][3]);\n                    bits++;\n                }\n            }\n\n            // Intersection area (0 if no overlap)\n            long area = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);\n\n            // Inclusion-exclusion: odd subsets add, even subsets subtract\n            if (bits % 2 == 1) {\n                total += area;\n            } else {\n                total -= area;\n            }\n        }\n\n        // Handle negative modulo\n        total = ((total % MOD) + MOD) % MOD;\n        return (int) total;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "pick_subset": [
        7,
        8,
        9,
        10
      ],
      "test_bit": [
        12,
        13
      ],
      "shrink": [
        14,
        15,
        16,
        17,
        18
      ],
      "calc_area": [
        22,
        23
      ],
      "add_area": [
        25,
        26,
        27
      ],
      "sub_area": [
        28,
        29
      ],
      "complete": [
        33,
        34,
        35
      ]
    },
    "conditionalMap": {
      "for_mask": [
        8
      ],
      "for_i": [
        12
      ],
      "in_subset": [
        13
      ],
      "is_odd": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int rectangleArea(vector<vector<int>>& rectangles) {\n        int n = rectangles.size();\n        long long MOD = 1e9 + 7;\n        long long total = 0;\n\n        // Iterate over all non-empty subsets\n        for (int mask = 1; mask < (1 << n); mask++) {\n            long long x1 = 0, y1 = 0;\n            long long x2 = LLONG_MAX, y2 = LLONG_MAX;\n            int bits = 0;\n\n            for (int i = 0; i < n; i++) {\n                if (mask & (1 << i)) {\n                    x1 = max(x1, (long long)rectangles[i][0]);\n                    y1 = max(y1, (long long)rectangles[i][1]);\n                    x2 = min(x2, (long long)rectangles[i][2]);\n                    y2 = min(y2, (long long)rectangles[i][3]);\n                    bits++;\n                }\n            }\n\n            long long area = max(0LL, x2 - x1) * max(0LL, y2 - y1);\n\n            if (bits % 2 == 1) {\n                total += area;\n            } else {\n                total -= area;\n            }\n        }\n\n        total = ((total % MOD) + MOD) % MOD;\n        return (int)total;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "init": [
        4,
        5,
        6
      ],
      "pick_subset": [
        8,
        9,
        10,
        11,
        12
      ],
      "test_bit": [
        14,
        15
      ],
      "shrink": [
        16,
        17,
        18,
        19,
        20
      ],
      "calc_area": [
        24
      ],
      "add_area": [
        26,
        27
      ],
      "sub_area": [
        28,
        29
      ],
      "complete": [
        33,
        34
      ]
    },
    "conditionalMap": {
      "for_mask": [
        9
      ],
      "for_i": [
        14
      ],
      "in_subset": [
        15
      ],
      "is_odd": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int RectangleArea(int[][] rectangles) {\n        int n = rectangles.Length;\n        long MOD = 1_000_000_007;\n        long total = 0;\n\n        // Iterate over all non-empty subsets\n        for (int mask = 1; mask < (1 << n); mask++) {\n            long x1 = 0, y1 = 0;\n            long x2 = long.MaxValue, y2 = long.MaxValue;\n            int bits = 0;\n\n            for (int i = 0; i < n; i++) {\n                if ((mask & (1 << i)) != 0) {\n                    x1 = Math.Max(x1, rectangles[i][0]);\n                    y1 = Math.Max(y1, rectangles[i][1]);\n                    x2 = Math.Min(x2, rectangles[i][2]);\n                    y2 = Math.Min(y2, rectangles[i][3]);\n                    bits++;\n                }\n            }\n\n            long area = Math.Max(0, x2 - x1) * Math.Max(0, y2 - y1);\n\n            if (bits % 2 == 1) {\n                total += area;\n            } else {\n                total -= area;\n            }\n        }\n\n        total = ((total % MOD) + MOD) % MOD;\n        return (int)total;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "pick_subset": [
        7,
        8,
        9,
        10,
        11
      ],
      "test_bit": [
        13,
        14
      ],
      "shrink": [
        15,
        16,
        17,
        18,
        19
      ],
      "calc_area": [
        23
      ],
      "add_area": [
        25,
        26
      ],
      "sub_area": [
        27,
        28
      ],
      "complete": [
        32,
        33
      ]
    },
    "conditionalMap": {
      "for_mask": [
        8
      ],
      "for_i": [
        13
      ],
      "in_subset": [
        14
      ],
      "is_odd": [
        25
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rectangleArea(rectangles [][]int) int {\n    n := len(rectangles)\n    MOD := int64(1_000_000_007)\n    total := int64(0)\n\n    // Iterate over all non-empty subsets\n    for mask := 1; mask < (1 << n); mask++ {\n        x1, y1 := int64(0), int64(0)\n        x2, y2 := int64(math.MaxInt64), int64(math.MaxInt64)\n        bits := 0\n\n        for i := 0; i < n; i++ {\n            if mask&(1<<i) != 0 {\n                if int64(rectangles[i][0]) > x1 {\n                    x1 = int64(rectangles[i][0])\n                }\n                if int64(rectangles[i][1]) > y1 {\n                    y1 = int64(rectangles[i][1])\n                }\n                if int64(rectangles[i][2]) < x2 {\n                    x2 = int64(rectangles[i][2])\n                }\n                if int64(rectangles[i][3]) < y2 {\n                    y2 = int64(rectangles[i][3])\n                }\n                bits++\n            }\n        }\n\n        width := x2 - x1\n        height := y2 - y1\n        if width < 0 { width = 0 }\n        if height < 0 { height = 0 }\n        area := width * height\n\n        if bits%2 == 1 {\n            total += area\n        } else {\n            total -= area\n        }\n    }\n\n    total = ((total % MOD) + MOD) % MOD\n    return int(total)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "pick_subset": [
        6,
        7,
        8,
        9,
        10
      ],
      "test_bit": [
        12,
        13
      ],
      "shrink": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26
      ],
      "calc_area": [
        30,
        31,
        32,
        33,
        34
      ],
      "add_area": [
        36,
        37
      ],
      "sub_area": [
        38,
        39
      ],
      "complete": [
        43,
        44
      ]
    },
    "conditionalMap": {
      "for_mask": [
        7
      ],
      "for_i": [
        12
      ],
      "in_subset": [
        13
      ],
      "is_odd": [
        36
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var rectangleArea = function (rectangles) {\n  const n = rectangles.length;\n  const MOD = 1000000007n;\n  let total = 0n;\n\n  // Iterate over all non-empty subsets\n  for (let mask = 1; mask < (1 << n); mask++) {\n    let x1 = 0n,\n      y1 = 0n;\n    let x2 = BigInt(Number.MAX_SAFE_INTEGER),\n      y2 = BigInt(Number.MAX_SAFE_INTEGER);\n    let bits = 0;\n\n    for (let i = 0; i < n; i++) {\n      if (mask & (1 << i)) {\n        const rx1 = BigInt(rectangles[i][0]);\n        const ry1 = BigInt(rectangles[i][1]);\n        const rx2 = BigInt(rectangles[i][2]);\n        const ry2 = BigInt(rectangles[i][3]);\n        if (rx1 > x1) x1 = rx1;\n        if (ry1 > y1) y1 = ry1;\n        if (rx2 < x2) x2 = rx2;\n        if (ry2 < y2) y2 = ry2;\n        bits++;\n      }\n    }\n\n    let width = x2 - x1;\n    let height = y2 - y1;\n    if (width < 0n) width = 0n;\n    if (height < 0n) height = 0n;\n    const area = width * height;\n\n    if (bits % 2 === 1) {\n      total += area;\n    } else {\n      total -= area;\n    }\n  }\n\n  total = ((total % MOD) + MOD) % MOD;\n  return Number(total);\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "pick_subset": [
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "test_bit": [
        14,
        15
      ],
      "shrink": [
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "calc_area": [
        28,
        29,
        30,
        31,
        32
      ],
      "add_area": [
        34,
        35
      ],
      "sub_area": [
        36,
        37
      ],
      "complete": [
        41,
        42
      ]
    },
    "conditionalMap": {
      "for_mask": [
        7
      ],
      "for_i": [
        14
      ],
      "in_subset": [
        15
      ],
      "is_odd": [
        34
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rectangleArea(rectangles: number[][]): number {\n    const n = rectangles.length;\n    const MOD = 1000000007n;\n    let total = 0n;\n\n    // Iterate over all non-empty subsets\n    for (let mask = 1; mask < (1 << n); mask++) {\n        let x1 = 0n, y1 = 0n;\n        let x2 = BigInt(Number.MAX_SAFE_INTEGER), y2 = BigInt(Number.MAX_SAFE_INTEGER);\n        let bits = 0;\n\n        for (let i = 0; i < n; i++) {\n            if (mask & (1 << i)) {\n                const rx1 = BigInt(rectangles[i][0]);\n                const ry1 = BigInt(rectangles[i][1]);\n                const rx2 = BigInt(rectangles[i][2]);\n                const ry2 = BigInt(rectangles[i][3]);\n                if (rx1 > x1) x1 = rx1;\n                if (ry1 > y1) y1 = ry1;\n                if (rx2 < x2) x2 = rx2;\n                if (ry2 < y2) y2 = ry2;\n                bits++;\n            }\n        }\n\n        let width = x2 - x1;\n        let height = y2 - y1;\n        if (width < 0n) width = 0n;\n        if (height < 0n) height = 0n;\n        const area = width * height;\n\n        if (bits % 2 === 1) {\n            total += area;\n        } else {\n            total -= area;\n        }\n    }\n\n    total = ((total % MOD) + MOD) % MOD;\n    return Number(total);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "pick_subset": [
        6,
        7,
        8,
        9,
        10
      ],
      "test_bit": [
        12,
        13
      ],
      "shrink": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22
      ],
      "calc_area": [
        26,
        27,
        28,
        29,
        30
      ],
      "add_area": [
        32,
        33
      ],
      "sub_area": [
        34,
        35
      ],
      "complete": [
        39,
        40
      ]
    },
    "conditionalMap": {
      "for_mask": [
        7
      ],
      "for_i": [
        12
      ],
      "in_subset": [
        13
      ],
      "is_odd": [
        32
      ]
    }
  }
};

const RectangleAreaIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "rectangles": [
        [
          0,
          0,
          2,
          2
        ],
        [
          1,
          0,
          2,
          3
        ],
        [
          1,
          0,
          3,
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Overlapping",
    "value": {
      "rectangles": [
        [
          0,
          0,
          3,
          3
        ],
        [
          1,
          1,
          4,
          4
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Non-overlapping",
    "value": {
      "rectangles": [
        [
          0,
          0,
          1,
          1
        ],
        [
          2,
          2,
          3,
          3
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Complex",
    "value": {
      "rectangles": [
        [
          0,
          0,
          4,
          4
        ],
        [
          1,
          1,
          3,
          3
        ],
        [
          2,
          0,
          5,
          2
        ]
      ]
    }
  }
];

function generateRectangleAreaIiSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.rectangles.map(e=>[...e]),a=new StepRecorder({total:0},{});if(t.forEach((e,t)=>{a.add_new_visual(`rect_${t}`,{type:"metadata",value:{x1:e[0],y1:e[1],x2:e[2],y2:e[3],state:"default"},label:`R${t}`})}),a.record("-","Find the total area covered by the union of axis-aligned rectangles"),0===t.length)return a.update_variable("result",0),a.record("complete","No rectangles. Total area = 0"),a.getSteps();let r=700,i=(e,t)=>{r>0&&(r--,a.record(e,t))},l=(e,t)=>{r>0&&a.add_conditional(e,t)},s=Array.from(new Set(t.flatMap(e=>[e[0],e[2]]))).sort((e,t)=>e-t),o=Array.from(new Set(t.flatMap(e=>[e[1],e[3]]))).sort((e,t)=>e-t);a.add_new_visual("meta_xs",{type:"metadata",value:s,label:"xs"}),a.add_new_visual("meta_ys",{type:"metadata",value:o,label:"ys"}),i("collect_coords",`Distinct x = [${s.join(", ")}], distinct y = [${o.join(", ")}]. They cut the plane into ${(s.length-1)*(o.length-1)} cells, each fully covered or fully empty.`);let c=(e,n)=>{let r=t[e];a.update_visual(`rect_${e}`,{type:"metadata",value:{x1:r[0],y1:r[1],x2:r[2],y2:r[3],state:n},label:`R${e}`})},d=0,y=0;for(let e=0;e<s.length-1;e++)for(let n=0;n<o.length-1;n++){let r=(s[e+1]-s[e])*(o[n+1]-o[n]);t.forEach((e,t)=>c(t,"default")),a.add_new_visual("slice_rect",{type:"metadata",value:{x1:s[e],x2:s[e+1],segments:[[o[n],o[n+1]]]},label:"cell"}),a.add_new_visual("meta_slice",{type:"metadata",value:`${s[e+1]-s[e]} x ${o[n+1]-o[n]} = ${r}`,label:"cell"}),a.update_variable("cell",`x[${s[e]}, ${s[e+1]}] y[${o[n]}, ${o[n+1]}]`),l("for_i",!0),l("for_j",!0),i("pick_cell",`Cell x in [${s[e]}, ${s[e+1]}], y in [${o[n]}, ${o[n+1]}]: does any rectangle contain it?`);let u=!1;for(let x=0;x<t.length;x++){let[p,g,f,_]=t[x],v=p<=s[e]&&s[e+1]<=f&&g<=o[n]&&o[n+1]<=_;if(t.forEach((e,t)=>c(t,t===x?"active":"default")),l("for_rect",!0),l("covers",v),i("test_rect",v?`R${x} spans x [${p}, ${f}] and y [${g}, ${_}]: it contains this cell.`:`R${x} spans x [${p}, ${f}] and y [${g}, ${_}]: it does not contain this cell.`),v){u=!0,d=(d+r)%0x3b9aca07,a.update_variable("total",d),a.add_new_visual(`slab_${y++}`,{type:"metadata",value:{x1:s[e],x2:s[e+1],y1:o[n],y2:o[n+1]}}),i("cover_cell",`Covered: add ${r}. Total = ${d}. Stop checking the rest for this cell.`);break}}u||(t.forEach((e,t)=>c(t,"default")),l("for_rect",!1),i("cell_empty","No rectangle contains this cell, so it adds nothing.")),a.delete_visual("slice_rect"),a.delete_visual("meta_slice")}return t.forEach((e,t)=>c(t,"default")),a.update_variable("total",d),a.update_variable("result",d),a.add_conditional("for_i",!1),a.add_conditional("for_j",!1),a.record("complete",`Total union area = ${d}`),a.getSteps()
  })(__inputArg);
}

export function RectangleAreaIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RectangleAreaIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRectangleAreaIiSteps(e) as any[];
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
      title="Rectangle Area II"
      slug="rectangle-area-ii"
      approaches={approaches}
      presets={RectangleAreaIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Multiply Strings (multiply-strings)
// ==========================================

const MultiplyStringsTemplates = {
  "python": {
    "language": "python",
    "code": "def multiply(num1, num2):\n    n1, n2 = len(num1), len(num2)\n    products = [0] * (n1 + n2)\n\n    for i in range(n1 - 1, -1, -1):\n        for j in range(n2 - 1, -1, -1):\n            mul = int(num1[i]) * int(num2[j])\n            products[i + j + 1] += mul\n\n    for k in range(len(products) - 1, 0, -1):\n        products[k - 1] += products[k] // 10\n        products[k] %= 10\n\n    result = \"\"\n    for digit in products:\n        if not result and digit == 0:\n            continue\n        result += str(digit)\n\n    return result if result else \"0\"",
    "lineMap": {
      "-": [
        1
      ],
      "compute_mul": [
        7
      ],
      "accumulate": [
        8
      ],
      "carry_start": [
        10
      ],
      "carry": [
        10,
        11
      ],
      "carry_update": [
        11,
        12
      ],
      "no_carry": [
        10
      ],
      "build_result": [
        14,
        15,
        16,
        17,
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "has_carry": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String multiply(String num1, String num2) {\n    int n1 = num1.length(), n2 = num2.length();\n    int[] products = new int[n1 + n2];\n\n    for (int i = n1 - 1; i >= 0; i--) {\n        for (int j = n2 - 1; j >= 0; j--) {\n            int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');\n            products[i + j + 1] += mul;\n        }\n    }\n\n    for (int k = products.length - 1; k > 0; k--) {\n        products[k - 1] += products[k] / 10;\n        products[k] %= 10;\n    }\n\n    StringBuilder result = new StringBuilder();\n    for (int digit : products) {\n        if (result.length() == 0 && digit == 0) continue;\n        result.append(digit);\n    }\n\n    return result.length() == 0 ? \"0\" : result.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_mul": [
        7
      ],
      "accumulate": [
        8
      ],
      "carry_start": [
        12
      ],
      "carry": [
        12,
        13
      ],
      "carry_update": [
        13,
        14
      ],
      "no_carry": [
        12
      ],
      "build_result": [
        17,
        18,
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "has_carry": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string multiply(string num1, string num2) {\n    int n1 = num1.size(), n2 = num2.size();\n    vector<int> products(n1 + n2, 0);\n\n    for (int i = n1 - 1; i >= 0; i--) {\n        for (int j = n2 - 1; j >= 0; j--) {\n            int mul = (num1[i] - '0') * (num2[j] - '0');\n            products[i + j + 1] += mul;\n        }\n    }\n\n    for (int k = products.size() - 1; k > 0; k--) {\n        products[k - 1] += products[k] / 10;\n        products[k] %= 10;\n    }\n\n    string result = \"\";\n    for (int digit : products) {\n        if (result.empty() && digit == 0) continue;\n        result += to_string(digit);\n    }\n\n    return result.empty() ? \"0\" : result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_mul": [
        7
      ],
      "accumulate": [
        8
      ],
      "carry_start": [
        12
      ],
      "carry": [
        12,
        13
      ],
      "carry_update": [
        13,
        14
      ],
      "no_carry": [
        12
      ],
      "build_result": [
        17,
        18,
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "has_carry": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string Multiply(string num1, string num2) {\n    int n1 = num1.Length, n2 = num2.Length;\n    int[] products = new int[n1 + n2];\n\n    for (int i = n1 - 1; i >= 0; i--) {\n        for (int j = n2 - 1; j >= 0; j--) {\n            int mul = (num1[i] - '0') * (num2[j] - '0');\n            products[i + j + 1] += mul;\n        }\n    }\n\n    for (int k = products.Length - 1; k > 0; k--) {\n        products[k - 1] += products[k] / 10;\n        products[k] %= 10;\n    }\n\n    var result = new StringBuilder();\n    foreach (int digit in products) {\n        if (result.Length == 0 && digit == 0) continue;\n        result.Append(digit);\n    }\n\n    return result.Length == 0 ? \"0\" : result.ToString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_mul": [
        7
      ],
      "accumulate": [
        8
      ],
      "carry_start": [
        12
      ],
      "carry": [
        12,
        13
      ],
      "carry_update": [
        13,
        14
      ],
      "no_carry": [
        12
      ],
      "build_result": [
        17,
        18,
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "has_carry": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func multiply(num1 string, num2 string) string {\n    n1, n2 := len(num1), len(num2)\n    products := make([]int, n1+n2)\n\n    for i := n1 - 1; i >= 0; i-- {\n        for j := n2 - 1; j >= 0; j-- {\n            mul := int(num1[i]-'0') * int(num2[j]-'0')\n            products[i+j+1] += mul\n        }\n    }\n\n    for k := len(products) - 1; k > 0; k-- {\n        products[k-1] += products[k] / 10\n        products[k] %= 10\n    }\n\n    result := \"\"\n    for _, digit := range products {\n        if result == \"\" && digit == 0 {\n            continue\n        }\n        result += strconv.Itoa(digit)\n    }\n\n    if result == \"\" {\n        return \"0\"\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_mul": [
        7
      ],
      "accumulate": [
        8
      ],
      "carry_start": [
        12
      ],
      "carry": [
        12,
        13
      ],
      "carry_update": [
        13,
        14
      ],
      "no_carry": [
        12
      ],
      "build_result": [
        17,
        18,
        19,
        20,
        21,
        22
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "has_carry": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function multiply(num1, num2) {\n    const n1 = num1.length, n2 = num2.length;\n    const products = new Array(n1 + n2).fill(0);\n\n    for (let i = n1 - 1; i >= 0; i--) {\n        for (let j = n2 - 1; j >= 0; j--) {\n            const mul = Number(num1[i]) * Number(num2[j]);\n            products[i + j + 1] += mul;\n        }\n    }\n\n    for (let k = products.length - 1; k > 0; k--) {\n        products[k - 1] += Math.floor(products[k] / 10);\n        products[k] %= 10;\n    }\n\n    let result = \"\";\n    for (const digit of products) {\n        if (result === \"\" && digit === 0) continue;\n        result += digit;\n    }\n\n    return result || \"0\";\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_mul": [
        7
      ],
      "accumulate": [
        8
      ],
      "carry_start": [
        12
      ],
      "carry": [
        12,
        13
      ],
      "carry_update": [
        13,
        14
      ],
      "no_carry": [
        12
      ],
      "build_result": [
        17,
        18,
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "has_carry": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function multiply(num1: string, num2: string): string {\n    const n1 = num1.length, n2 = num2.length;\n    const products: number[] = new Array(n1 + n2).fill(0);\n\n    for (let i = n1 - 1; i >= 0; i--) {\n        for (let j = n2 - 1; j >= 0; j--) {\n            const mul = Number(num1[i]) * Number(num2[j]);\n            products[i + j + 1] += mul;\n        }\n    }\n\n    for (let k = products.length - 1; k > 0; k--) {\n        products[k - 1] += Math.floor(products[k] / 10);\n        products[k] %= 10;\n    }\n\n    let result = \"\";\n    for (const digit of products) {\n        if (result === \"\" && digit === 0) continue;\n        result += digit;\n    }\n\n    return result || \"0\";\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_mul": [
        7
      ],
      "accumulate": [
        8
      ],
      "carry_start": [
        12
      ],
      "carry": [
        12,
        13
      ],
      "carry_update": [
        13,
        14
      ],
      "no_carry": [
        12
      ],
      "build_result": [
        17,
        18,
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "has_carry": [
        12
      ]
    }
  }
};

const MultiplyStringsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "num1": "123",
      "num2": "456"
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
    "value": {
      "num1": "12",
      "num2": "34"
    }
  },
  {
    "id": "ex3",
    "label": "With Zero",
    "value": {
      "num1": "0",
      "num2": "123"
    }
  }
];

function generateMultiplyStringsSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.num1,r=e.num2,l=t.length,i=r.length,a=Array(l+i).fill(0),o={};for(let e=0;e<l;e++)o[`num1_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<i;e++)o[`num2_${e}`]={type:"arrayElement",value:r[e],position:e};for(let e=0;e<a.length;e++)o[`prod_${e}`]={type:"arrayElement",value:0,position:e};let s=new StepRecorder({num1:t,num2:r,phase:"multiply",exprParts:[]},o),u=e=>s.update_variable("exprParts",e),c=()=>{s.delete_variable("mulFlight"),s.delete_variable("carryFlight")};if(u([{t:"digit i \xd7 digit j lands in slot i + j + 1",c:"muted"}]),c(),s.record("-",`Start: multiply "${t}" \xd7 "${r}"`),"0"===t||"0"===r){for(let e=0;e<a.length;e++)s.update_visual(`prod_${e}`,{type:"arrayElement",value:0,position:e,state:"muted"});return s.update_variable("result","0"),s.update_variable("done",!0),u([{t:'a factor is 0  →  result "0"',c:"green"}]),s.record("complete",'One factor is 0, result "0"'),s.getSteps()}for(let e=l-1;e>=0;e--)for(let n=i-1;n>=0;n--){let l=parseInt(t[e]),i=parseInt(r[n]),o=l*i,d=e+n+1;s.update_variable("i",e),s.update_variable("j",n),s.update_variable("pos",d),s.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),s.update_visual("ptr_j",{type:"pointer",position:n,label:"j"}),s.update_visual("ptr_k",{type:"pointer",position:d,label:"i+j+1"}),c(),u([{t:`${l} \xd7 ${i} = `,c:"muted"},{t:`${o}`,c:"yellow"},{t:`  →  slot ${e}+${n}+1 = ${d}`,c:"muted"}]),s.record("compute_mul",`num1[${e}]=${l} \xd7 num2[${n}]=${i} = ${o}`);let p=a[d];a[d]+=o,s.update_visual(`prod_${d}`,{type:"arrayElement",value:a[d],position:d,state:"highlight"}),s.update_variable("mul",o),s.update_variable("mulFlight",{i:e,j:n,pos:d,mul:o}),u([{t:`products[${d}] = ${p} + ${o} = `,c:"muted"},{t:`${a[d]}`,c:"green"}]),s.record("accumulate",`products[${d}] += ${o} = ${a[d]}`),s.update_visual(`prod_${d}`,{type:"arrayElement",value:a[d],position:d})}s.delete_visual("ptr_i"),s.delete_visual("ptr_j"),s.delete_visual("ptr_k"),s.update_variable("phase","carry"),c(),u([{t:"normalize right → left: keep %10, carry \xf710",c:"muted"}]),s.record("carry_start","Multiplication done, normalize the carries");for(let e=a.length-1;e>0;e--){let t=Math.floor(a[e]/10),r=a[e]%10;if(s.update_variable("k",e),s.update_visual("ptr_carry",{type:"pointer",position:e,label:"k"}),s.add_conditional("has_carry",t>0),t>0){let n=a[e];s.update_visual(`prod_${e}`,{type:"arrayElement",value:n,position:e,state:"highlight"}),c(),u([{t:`${n} → keep `,c:"muted"},{t:`${r}`,c:"green"},{t:", carry ",c:"muted"},{t:`${t}`,c:"yellow"},{t:" left",c:"muted"}]),s.record("carry",`products[${e}] = ${n}: keep ${r}, carry ${t}`),a[e-1]+=t,a[e]=r,s.update_visual(`prod_${e}`,{type:"arrayElement",value:r,position:e,state:"active"}),s.update_visual(`prod_${e-1}`,{type:"arrayElement",value:a[e-1],position:e-1,state:"highlight"}),s.update_variable("carryFlight",{k:e,carry:t}),u([{t:`products[${e}] = ${r},  products[${e-1}] = `,c:"muted"},{t:`${a[e-1]}`,c:"green"}]),s.record("carry_update",`products[${e}] = ${r}, products[${e-1}] = ${a[e-1]}`),s.update_visual(`prod_${e}`,{type:"arrayElement",value:r,position:e}),s.update_visual(`prod_${e-1}`,{type:"arrayElement",value:a[e-1],position:e-1})}else c(),s.update_visual(`prod_${e}`,{type:"arrayElement",value:a[e],position:e,state:"active"}),u([{t:`${a[e]}`,c:"plain"},{t:" < 10, nothing to carry",c:"muted"}]),s.record("no_carry",`products[${e}] = ${a[e]}: no carry`),s.update_visual(`prod_${e}`,{type:"arrayElement",value:a[e],position:e})}s.delete_visual("ptr_carry"),s.update_variable("phase","build"),c();let d="";for(let e=0;e<a.length;e++)0===d.length&&0===a[e]&&e<a.length-1||(d+=a[e].toString());0===d.length&&(d="0"),s.update_variable("result",d);for(let e=0;e<a.length;e++){let t=0===a[e]&&a.slice(0,e+1).every(e=>0===e)&&e<a.length-1;s.update_visual(`prod_${e}`,{type:"arrayElement",value:a[e],position:e,state:t?"muted":"complete"})}return u([{t:"drop leading zeros  →  ",c:"muted"},{t:`"${d}"`,c:"green"}]),s.record("build_result",`Read the digits, skip leading zeros: "${d}"`),s.update_variable("done",!0),s.record("complete",`Done! "${t}" \xd7 "${r}" = "${d}"`),s.getSteps()
  })(__inputArg);
}

export function MultiplyStringsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MultiplyStringsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMultiplyStringsSteps(e) as any[];
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
      title="Multiply Strings"
      slug="multiply-strings"
      approaches={approaches}
      presets={MultiplyStringsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find the Duplicate Number (find-the-duplicate-number)
// ==========================================

const FindTheDuplicateNumberTemplates = {
  "python": {
    "language": "python",
    "code": "def findDuplicate(nums):\n    slow = nums[0]\n    fast = nums[nums[0]]\n\n    while slow != fast:\n        slow = nums[slow]\n        fast = nums[nums[fast]]\n\n    slow = 0\n\n    while slow != fast:\n        slow = nums[slow]\n        fast = nums[fast]\n\n    return slow",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow": [
        2
      ],
      "init_fast": [
        3
      ],
      "phase1_loop": [
        5
      ],
      "move_slow_p1": [
        6
      ],
      "move_fast_p1": [
        7
      ],
      "phase1_meet": [
        5
      ],
      "phase2_start": [
        9
      ],
      "phase2_loop": [
        11
      ],
      "move_slow_p2": [
        12
      ],
      "move_fast_p2": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "phase1_check": [
        5
      ],
      "phase2_check": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findDuplicate(int[] nums) {\n    int slow = nums[0];\n    int fast = nums[nums[0]];\n\n    while (slow != fast) {\n        slow = nums[slow];\n        fast = nums[nums[fast]];\n    }\n\n    slow = 0;\n\n    while (slow != fast) {\n        slow = nums[slow];\n        fast = nums[fast];\n    }\n\n    return slow;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow": [
        2
      ],
      "init_fast": [
        3
      ],
      "phase1_loop": [
        5
      ],
      "move_slow_p1": [
        6
      ],
      "move_fast_p1": [
        7
      ],
      "phase1_meet": [
        5
      ],
      "phase2_start": [
        10
      ],
      "phase2_loop": [
        12
      ],
      "move_slow_p2": [
        13
      ],
      "move_fast_p2": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "phase1_check": [
        5
      ],
      "phase2_check": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findDuplicate(vector<int>& nums) {\n    int slow = nums[0];\n    int fast = nums[nums[0]];\n\n    while (slow != fast) {\n        slow = nums[slow];\n        fast = nums[nums[fast]];\n    }\n\n    slow = 0;\n\n    while (slow != fast) {\n        slow = nums[slow];\n        fast = nums[fast];\n    }\n\n    return slow;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow": [
        2
      ],
      "init_fast": [
        3
      ],
      "phase1_loop": [
        5
      ],
      "move_slow_p1": [
        6
      ],
      "move_fast_p1": [
        7
      ],
      "phase1_meet": [
        5
      ],
      "phase2_start": [
        10
      ],
      "phase2_loop": [
        12
      ],
      "move_slow_p2": [
        13
      ],
      "move_fast_p2": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "phase1_check": [
        5
      ],
      "phase2_check": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindDuplicate(int[] nums) {\n    int slow = nums[0];\n    int fast = nums[nums[0]];\n\n    while (slow != fast) {\n        slow = nums[slow];\n        fast = nums[nums[fast]];\n    }\n\n    slow = 0;\n\n    while (slow != fast) {\n        slow = nums[slow];\n        fast = nums[fast];\n    }\n\n    return slow;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow": [
        2
      ],
      "init_fast": [
        3
      ],
      "phase1_loop": [
        5
      ],
      "move_slow_p1": [
        6
      ],
      "move_fast_p1": [
        7
      ],
      "phase1_meet": [
        5
      ],
      "phase2_start": [
        10
      ],
      "phase2_loop": [
        12
      ],
      "move_slow_p2": [
        13
      ],
      "move_fast_p2": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "phase1_check": [
        5
      ],
      "phase2_check": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findDuplicate(nums []int) int {\n    slow := nums[0]\n    fast := nums[nums[0]]\n\n    for slow != fast {\n        slow = nums[slow]\n        fast = nums[nums[fast]]\n    }\n\n    slow = 0\n\n    for slow != fast {\n        slow = nums[slow]\n        fast = nums[fast]\n    }\n\n    return slow\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow": [
        2
      ],
      "init_fast": [
        3
      ],
      "phase1_loop": [
        5
      ],
      "move_slow_p1": [
        6
      ],
      "move_fast_p1": [
        7
      ],
      "phase1_meet": [
        5
      ],
      "phase2_start": [
        10
      ],
      "phase2_loop": [
        12
      ],
      "move_slow_p2": [
        13
      ],
      "move_fast_p2": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "phase1_check": [
        5
      ],
      "phase2_check": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findDuplicate(nums) {\n    let slow = nums[0];\n    let fast = nums[nums[0]];\n\n    while (slow !== fast) {\n        slow = nums[slow];\n        fast = nums[nums[fast]];\n    }\n\n    slow = 0;\n\n    while (slow !== fast) {\n        slow = nums[slow];\n        fast = nums[fast];\n    }\n\n    return slow;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow": [
        2
      ],
      "init_fast": [
        3
      ],
      "phase1_loop": [
        5
      ],
      "move_slow_p1": [
        6
      ],
      "move_fast_p1": [
        7
      ],
      "phase1_meet": [
        5
      ],
      "phase2_start": [
        10
      ],
      "phase2_loop": [
        12
      ],
      "move_slow_p2": [
        13
      ],
      "move_fast_p2": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "phase1_check": [
        5
      ],
      "phase2_check": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findDuplicate(nums: number[]): number {\n    let slow = nums[0];\n    let fast = nums[nums[0]];\n\n    while (slow !== fast) {\n        slow = nums[slow];\n        fast = nums[nums[fast]];\n    }\n\n    slow = 0;\n\n    while (slow !== fast) {\n        slow = nums[slow];\n        fast = nums[fast];\n    }\n\n    return slow;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_slow": [
        2
      ],
      "init_fast": [
        3
      ],
      "phase1_loop": [
        5
      ],
      "move_slow_p1": [
        6
      ],
      "move_fast_p1": [
        7
      ],
      "phase1_meet": [
        5
      ],
      "phase2_start": [
        10
      ],
      "phase2_loop": [
        12
      ],
      "move_slow_p2": [
        13
      ],
      "move_fast_p2": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "phase1_check": [
        5
      ],
      "phase2_check": [
        12
      ]
    }
  }
};

const FindTheDuplicateNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        1,
        3,
        4,
        2,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Larger",
    "value": {
      "nums": [
        3,
        1,
        3,
        4,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Simple",
    "value": {
      "nums": [
        1,
        1
      ]
    }
  }
];

function generateFindTheDuplicateNumberSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.nums],n=t.length,s={};t.forEach((e,t)=>{s[`bar_${t}`]={type:"arrayElement",value:e,position:t}});let r=new StepRecorder({nums:t,slow:void 0,fast:void 0,phase:1,exprParts:[]},s),a=e=>r.update_variable("exprParts",e),i=()=>{r.delete_variable("slowMove"),r.delete_variable("fastMove")};i(),a([{t:"nums is a linked list: node i → nums[i]; a duplicate makes a cycle",c:"muted"}]),r.record("-","Find the duplicate with Floyd's cycle detection");let o=t[0],u=t[t[0]];for(r.update_visual("ptr_slow",{type:"pointer",position:o,label:"slow"}),r.update_variable("slow",o),r.update_variable("fast",t[0]),i(),r.update_variable("slowMove",{from:0,to:o}),a([{t:"slow = nums[0] = ",c:"muted"},{t:`${o}`,c:"cyan"}]),r.record("init_slow",`slow = nums[0] = ${o}`),r.update_visual("ptr_fast",{type:"pointer",position:u,label:"fast"}),r.update_variable("fast",u),i(),r.update_variable("fastMove",{from:0,mid:t[0],to:u}),a([{t:`fast = nums[nums[0]] = nums[${t[0]}] = `,c:"muted"},{t:`${u}`,c:"orange"}]),r.record("init_fast",`fast = nums[nums[0]] = ${u}`);o!==u;){r.add_conditional("phase1_check",!1),i(),a([{t:"slow ",c:"muted"},{t:`${o}`,c:"cyan"},{t:" ≠ fast ",c:"muted"},{t:`${u}`,c:"orange"}]),r.record("phase1_loop",`slow (${o}) ≠ fast (${u})`);let e=o;o=t[e],r.update_variable("slow",o),r.update_visual("ptr_slow",{type:"pointer",position:o,label:"slow"}),i(),r.update_variable("slowMove",{from:e,to:o}),a([{t:`slow = nums[${e}] = `,c:"muted"},{t:`${o}`,c:"cyan"},{t:"   (one hop)",c:"muted"}]),r.record("move_slow_p1",`slow = nums[${e}] = ${o}`);let n=u,l=t[n];u=t[l],r.update_variable("fast",u),r.update_visual("ptr_fast",{type:"pointer",position:u,label:"fast"}),i(),r.update_variable("fastMove",{from:n,mid:l,to:u}),a([{t:`fast = nums[nums[${n}]] = nums[${l}] = `,c:"muted"},{t:`${u}`,c:"orange"},{t:"   (two hops)",c:"muted"}]),r.record("move_fast_p1",`fast = nums[nums[${n}]] = ${u}`)}for(r.add_conditional("phase1_check",!0),r.update_visual(`bar_${o}`,{type:"arrayElement",value:t[o],position:o,state:"meet"}),i(),a([{t:"slow == fast == ",c:"muted"},{t:`${o}`,c:"yellow"},{t:"  →  they meet inside the cycle",c:"muted"}]),r.record("phase1_meet",`slow == fast == ${o}, cycle detected`),r.update_variable("phase",2),r.update_visual(`bar_${o}`,{type:"arrayElement",value:t[o],position:o}),o=0,r.update_variable("slow",o),r.update_visual("ptr_slow",{type:"pointer",position:o,label:"slow"}),i(),a([{t:"reset slow = 0",c:"cyan"},{t:`; keep fast at ${u}. Now both hop once.`,c:"muted"}]),r.record("phase2_start","Phase 2: reset slow = 0");o!==u;){r.add_conditional("phase2_check",!1),i(),a([{t:"slow ",c:"muted"},{t:`${o}`,c:"cyan"},{t:" ≠ fast ",c:"muted"},{t:`${u}`,c:"orange"}]),r.record("phase2_loop",`slow (${o}) ≠ fast (${u})`);let e=o;o=t[e],r.update_variable("slow",o),r.update_visual("ptr_slow",{type:"pointer",position:o,label:"slow"}),i(),r.update_variable("slowMove",{from:e,to:o}),a([{t:`slow = nums[${e}] = `,c:"muted"},{t:`${o}`,c:"cyan"}]),r.record("move_slow_p2",`slow = nums[${e}] = ${o}`);let n=u;u=t[n],r.update_variable("fast",u),r.update_visual("ptr_fast",{type:"pointer",position:u,label:"fast"}),i(),r.update_variable("fastMove",{from:n,to:u}),a([{t:`fast = nums[${n}] = `,c:"muted"},{t:`${u}`,c:"orange"}]),r.record("move_fast_p2",`fast = nums[${n}] = ${u}`)}r.add_conditional("phase2_check",!0);let c=o;r.update_variable("duplicate",c),r.update_variable("done",!0);for(let e=0;e<n;e++)t[e]===c&&r.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,state:"dup"});return i(),a([{t:"slow == fast == ",c:"muted"},{t:`${c}`,c:"green"},{t:"  =  the cycle entrance = the duplicate",c:"muted"}]),r.record("complete",`The duplicate number is ${c}`),r.getSteps()
  })(__inputArg);
}

export function FindTheDuplicateNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindTheDuplicateNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindTheDuplicateNumberSteps(e) as any[];
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
      title="Find the Duplicate Number"
      slug="find-the-duplicate-number"
      approaches={approaches}
      presets={FindTheDuplicateNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count Good Numbers (count-good-numbers)
// ==========================================

const CountGoodNumbersTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    MOD = 10**9 + 7\n\n    def countGoodNumbers(self, n: int) -> int:\n        evenCount = (n + 1) // 2\n        oddCount = n // 2\n        fivePower = self.power(5, evenCount)\n        fourPower = self.power(4, oddCount)\n        return (fivePower * fourPower) % self.MOD\n\n    def power(self, base, exp):\n        result = 1\n        base %= self.MOD\n        while exp > 0:\n            if exp % 2 == 1:\n                result = (result * base) % self.MOD\n            base = (base * base) % self.MOD\n            exp //= 2\n        return result",
    "lineMap": {
      "-": [
        1
      ],
      "compute_even": [
        5
      ],
      "compute_odd": [
        6
      ],
      "call_power5": [
        7
      ],
      "call_power4": [
        8
      ],
      "init_power5": [
        11,
        12,
        13
      ],
      "init_power4": [
        11,
        12,
        13
      ],
      "multiply_result": [
        16
      ],
      "skip_multiply": [
        15
      ],
      "square_base": [
        17
      ],
      "halve_exp": [
        18
      ],
      "done_power5": [
        7
      ],
      "done_power4": [
        8
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "check_odd": [
        15
      ],
      "while_exp": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private static final long MOD = 1000000007;\n\n    public int countGoodNumbers(long n) {\n        long evenCount = (n + 1) / 2;\n        long oddCount = n / 2;\n        long fivePower = power(5, evenCount);\n        long fourPower = power(4, oddCount);\n        return (int) ((fivePower * fourPower) % MOD);\n    }\n\n    private long power(long base, long exp) {\n        long result = 1;\n        base %= MOD;\n        while (exp > 0) {\n            if (exp % 2 == 1) {\n                result = (result * base) % MOD;\n            }\n            base = (base * base) % MOD;\n            exp /= 2;\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_even": [
        5
      ],
      "compute_odd": [
        6
      ],
      "call_power5": [
        7
      ],
      "call_power4": [
        8
      ],
      "init_power5": [
        12,
        13,
        14
      ],
      "init_power4": [
        12,
        13,
        14
      ],
      "multiply_result": [
        17
      ],
      "skip_multiply": [
        16
      ],
      "square_base": [
        19
      ],
      "halve_exp": [
        20
      ],
      "done_power5": [
        7
      ],
      "done_power4": [
        8
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "check_odd": [
        16
      ],
      "while_exp": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    const long long MOD = 1000000007;\n\n    int countGoodNumbers(long long n) {\n        long long evenCount = (n + 1) / 2;\n        long long oddCount = n / 2;\n        long long fivePower = power(5, evenCount);\n        long long fourPower = power(4, oddCount);\n        return (int)((fivePower * fourPower) % MOD);\n    }\n\n    long long power(long long base, long long exp) {\n        long long result = 1;\n        base %= MOD;\n        while (exp > 0) {\n            if (exp % 2 == 1) {\n                result = (result * base) % MOD;\n            }\n            base = (base * base) % MOD;\n            exp /= 2;\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "compute_even": [
        6
      ],
      "compute_odd": [
        7
      ],
      "call_power5": [
        8
      ],
      "call_power4": [
        9
      ],
      "init_power5": [
        13,
        14,
        15
      ],
      "init_power4": [
        13,
        14,
        15
      ],
      "multiply_result": [
        18
      ],
      "skip_multiply": [
        17
      ],
      "square_base": [
        20
      ],
      "halve_exp": [
        21
      ],
      "done_power5": [
        8
      ],
      "done_power4": [
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "check_odd": [
        17
      ],
      "while_exp": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private const long MOD = 1000000007;\n\n    public int CountGoodNumbers(long n) {\n        long evenCount = (n + 1) / 2;\n        long oddCount = n / 2;\n        long fivePower = Power(5, evenCount);\n        long fourPower = Power(4, oddCount);\n        return (int)((fivePower * fourPower) % MOD);\n    }\n\n    private long Power(long baseVal, long exp) {\n        long result = 1;\n        baseVal %= MOD;\n        while (exp > 0) {\n            if (exp % 2 == 1) {\n                result = (result * baseVal) % MOD;\n            }\n            baseVal = (baseVal * baseVal) % MOD;\n            exp /= 2;\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_even": [
        5
      ],
      "compute_odd": [
        6
      ],
      "call_power5": [
        7
      ],
      "call_power4": [
        8
      ],
      "init_power5": [
        12,
        13,
        14
      ],
      "init_power4": [
        12,
        13,
        14
      ],
      "multiply_result": [
        17
      ],
      "skip_multiply": [
        16
      ],
      "square_base": [
        19
      ],
      "halve_exp": [
        20
      ],
      "done_power5": [
        7
      ],
      "done_power4": [
        8
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "check_odd": [
        16
      ],
      "while_exp": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countGoodNumbers(n int64) int {\n    MOD := int64(1000000007)\n    evenCount := (n + 1) / 2\n    oddCount := n / 2\n    fivePower := power(5, evenCount, MOD)\n    fourPower := power(4, oddCount, MOD)\n    return int((fivePower * fourPower) % MOD)\n}\n\nfunc power(base, exp, MOD int64) int64 {\n    result := int64(1)\n    base %= MOD\n    for exp > 0 {\n        if exp % 2 == 1 {\n            result = (result * base) % MOD\n        }\n        base = (base * base) % MOD\n        exp /= 2\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_even": [
        3
      ],
      "compute_odd": [
        4
      ],
      "call_power5": [
        5
      ],
      "call_power4": [
        6
      ],
      "init_power5": [
        10,
        11,
        12
      ],
      "init_power4": [
        10,
        11,
        12
      ],
      "multiply_result": [
        15
      ],
      "skip_multiply": [
        14
      ],
      "square_base": [
        17
      ],
      "halve_exp": [
        18
      ],
      "done_power5": [
        5
      ],
      "done_power4": [
        6
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "check_odd": [
        14
      ],
      "while_exp": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var countGoodNumbers = function(n) {\n    const MOD = 1000000007n;\n    const evenCount = (n + 1n) / 2n;\n    const oddCount = n / 2n;\n    const fivePower = power(5n, evenCount, MOD);\n    const fourPower = power(4n, oddCount, MOD);\n    return Number((fivePower * fourPower) % MOD);\n};\n\nfunction power(base, exp, MOD) {\n    let result = 1n;\n    base %= MOD;\n    while (exp > 0n) {\n        if (exp % 2n === 1n) {\n            result = (result * base) % MOD;\n        }\n        base = (base * base) % MOD;\n        exp /= 2n;\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_even": [
        3
      ],
      "compute_odd": [
        4
      ],
      "call_power5": [
        5
      ],
      "call_power4": [
        6
      ],
      "init_power5": [
        10,
        11,
        12
      ],
      "init_power4": [
        10,
        11,
        12
      ],
      "multiply_result": [
        15
      ],
      "skip_multiply": [
        14
      ],
      "square_base": [
        17
      ],
      "halve_exp": [
        18
      ],
      "done_power5": [
        5
      ],
      "done_power4": [
        6
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "check_odd": [
        14
      ],
      "while_exp": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countGoodNumbers(n: bigint): number {\n    const MOD = 1000000007n;\n    const evenCount = (n + 1n) / 2n;\n    const oddCount = n / 2n;\n    const fivePower = power(5n, evenCount, MOD);\n    const fourPower = power(4n, oddCount, MOD);\n    return Number((fivePower * fourPower) % MOD);\n}\n\nfunction power(base: bigint, exp: bigint, MOD: bigint): bigint {\n    let result = 1n;\n    base %= MOD;\n    while (exp > 0n) {\n        if (exp % 2n === 1n) {\n            result = (result * base) % MOD;\n        }\n        base = (base * base) % MOD;\n        exp /= 2n;\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_even": [
        3
      ],
      "compute_odd": [
        4
      ],
      "call_power5": [
        5
      ],
      "call_power4": [
        6
      ],
      "init_power5": [
        10,
        11,
        12
      ],
      "init_power4": [
        10,
        11,
        12
      ],
      "multiply_result": [
        15
      ],
      "skip_multiply": [
        14
      ],
      "square_base": [
        17
      ],
      "halve_exp": [
        18
      ],
      "done_power5": [
        5
      ],
      "done_power4": [
        6
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "check_odd": [
        14
      ],
      "while_exp": [
        13
      ]
    }
  }
};

const CountGoodNumbersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Small",
    "value": {
      "n": 1
    }
  },
  {
    "id": "ex2",
    "label": "Standard",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex3",
    "label": "Medium",
    "value": {
      "n": 8
    }
  }
];

function generateCountGoodNumbersSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t,n=e.n,l={};for(let e=0;e<n;e++)l[`pos_${e}`]={type:"arrayElement",value:e,position:e,state:e%2==0?"even":"odd"};let r=new StepRecorder({n,phase:"count",exprParts:[]},l),i=e=>r.update_variable("exprParts",e),a=Math.ceil(n/2),s=Math.floor(n/2);i([{t:"even index → 5 even digits \xb7 odd index → 4 primes",c:"muted"}]),r.record("-",`Count good digit strings of length ${n}`);for(let e=0;e<n;e++)e%2==0&&r.update_visual(`pos_${e}`,{type:"arrayElement",value:e,position:e,state:"even_hl"});r.update_variable("evenCount",a),i([{t:`${a}`,c:"cyan"},{t:" even positions, each with ",c:"muted"},{t:"5",c:"cyan"},{t:" choices {0,2,4,6,8}",c:"muted"}]),r.record("compute_even",`evenCount = ceil(${n}/2) = ${a}, each has 5 choices`);for(let e=0;e<n;e++)r.update_visual(`pos_${e}`,{type:"arrayElement",value:e,position:e,state:e%2==0?"even":"odd_hl"});r.update_variable("oddCount",s),i([{t:`${s}`,c:"orange"},{t:" odd positions, each with ",c:"muted"},{t:"4",c:"orange"},{t:" choices {2,3,5,7}",c:"muted"}]),r.record("compute_odd",`oddCount = floor(${n}/2) = ${s}, each has 4 choices`);for(let e=0;e<n;e++)r.update_visual(`pos_${e}`,{type:"arrayElement",value:e,position:e,state:e%2==0?"even":"odd"});function u(e,t,n){let o="five"===n?"power5":"power4",l=Number(e),a=t.toString(2);r.update_variable("phase","power"),r.update_variable("whichPower",n),r.update_variable("powerBase",l),r.update_variable("powerExp",t),r.update_variable("expBits",a),r.update_variable("bitIndex",-1),r.update_variable("base",(e%1000000007n).toString()),r.update_variable("result","1"),i([{t:"compute ",c:"muted"},{t:`${l}^${t}`,c:"five"===n?"cyan":"orange"},{t:`  (exponent ${t} = ${a} in binary)`,c:"muted"}]),r.record(`call_${o}`,`compute ${l}^${t} with binary exponentiation`);let s=e%1000000007n,u=BigInt(t),d=1n;r.update_variable("bitIndex",0),i([{t:"result = ",c:"muted"},{t:"1",c:"green"},{t:", base = ",c:"muted"},{t:`${s}`,c:"cyan"},{t:`; read the bits of ${t} low → high`,c:"muted"}]),r.record(`init_${o}`,`result = 1, base = ${s}, read exponent bits`);let c=0;for(;u>0n;){let e=u%2n===1n;r.add_conditional("check_odd",e),r.update_variable("bitIndex",c),e?(d=d*s%1000000007n,r.update_variable("result",d.toString()),r.update_variable("resultPulse",!0),i([{t:`bit ${c} = `,c:"muted"},{t:"1",c:"green"},{t:"  →  result = result \xd7 base = ",c:"muted"},{t:`${d}`,c:"green"}]),r.record("multiply_result",`bit ${c} = 1: result = result \xd7 base = ${d}`),r.delete_variable("resultPulse")):(i([{t:`bit ${c} = `,c:"muted"},{t:"0",c:"muted"},{t:"  →  skip the multiply",c:"muted"}]),r.record("skip_multiply",`bit ${c} = 0: skip multiply`)),s=s*s%1000000007n,r.update_variable("base",s.toString()),r.update_variable("basePulse",!0),i([{t:"base = base\xb2 = ",c:"muted"},{t:`${s}`,c:"cyan"}]),r.record("square_base",`base = base\xb2 = ${s}`),r.delete_variable("basePulse"),u/=2n,c++,r.add_conditional("while_exp",u>0n),r.update_variable("bitIndex",u>0n?c:c-1),i([u>0n?{t:"move to the next bit",c:"muted"}:{t:"no bits left, done",c:"muted"}]),r.record("halve_exp",u>0n?"move to the next bit":"exponent exhausted")}return d}let d=u(5n,a,"five");r.update_variable("fivePower",d.toString()),r.update_variable("phase","count"),i([{t:`5^${a} = `,c:"muted"},{t:`${d}`,c:"cyan"}]),r.record("done_power5",`5^${a} = ${d}`),0===s?(t=1n,r.update_variable("fourPower","1"),r.update_variable("phase","count"),i([{t:"oddCount = 0, so 4^0 = ",c:"muted"},{t:"1",c:"orange"}]),r.record("done_power4","oddCount = 0, so 4^0 = 1")):(t=u(4n,s,"four"),r.update_variable("fourPower",t.toString()),r.update_variable("phase","count"),i([{t:`4^${s} = `,c:"muted"},{t:`${t}`,c:"orange"}]),r.record("done_power4",`4^${s} = ${t}`));let c=d*t%1000000007n;r.update_variable("phase","done"),r.update_variable("answer",c.toString()),r.update_variable("done",!0);for(let e=0;e<n;e++)r.update_visual(`pos_${e}`,{type:"arrayElement",value:e,position:e,state:"complete"});return i([{t:`${d} \xd7 ${t} mod (1e9+7) = `,c:"muted"},{t:`${c}`,c:"green"}]),r.record("complete",`answer = (${d} \xd7 ${t}) mod 1e9+7 = ${c}`),r.getSteps()
  })(__inputArg);
}

export function CountGoodNumbersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountGoodNumbersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCountGoodNumbersSteps(e) as any[];
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
      title="Count Good Numbers"
      slug="count-good-numbers"
      approaches={approaches}
      presets={CountGoodNumbersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count Primes (count-primes)
// ==========================================

const CountPrimesTemplates = {
  "python": {
    "language": "python",
    "code": "def countPrimes(n):\n    if n <= 2:\n        return 0\n    is_prime = [True] * n\n    is_prime[0] = is_prime[1] = False\n    for i in range(2, int(n**0.5) + 1):\n        if is_prime[i]:\n            for j in range(i*i, n, i):\n                is_prime[j] = False\n    return sum(is_prime)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        4,
        5
      ],
      "check_prime": [
        6,
        7
      ],
      "found_prime": [
        7
      ],
      "mark_multiple": [
        8,
        9
      ],
      "done_marking": [
        6
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_prime_check": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int countPrimes(int n) {\n        if (n <= 2) return 0;\n        boolean[] isPrime = new boolean[n];\n        Arrays.fill(isPrime, true);\n        isPrime[0] = isPrime[1] = false;\n        for (int i = 2; i * i < n; i++) {\n            if (isPrime[i]) {\n                for (int j = i * i; j < n; j += i) {\n                    isPrime[j] = false;\n                }\n            }\n        }\n        int count = 0;\n        for (boolean p : isPrime) if (p) count++;\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        4,
        5,
        6
      ],
      "check_prime": [
        7,
        8
      ],
      "found_prime": [
        8
      ],
      "mark_multiple": [
        9,
        10
      ],
      "done_marking": [
        7
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_prime_check": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int countPrimes(int n) {\n        if (n <= 2) return 0;\n        vector<bool> isPrime(n, true);\n        isPrime[0] = isPrime[1] = false;\n        for (int i = 2; i * i < n; i++) {\n            if (isPrime[i]) {\n                for (int j = i * i; j < n; j += i) {\n                    isPrime[j] = false;\n                }\n            }\n        }\n        int count = 0;\n        for (bool p : isPrime) if (p) count++;\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        5,
        6
      ],
      "check_prime": [
        7,
        8
      ],
      "found_prime": [
        8
      ],
      "mark_multiple": [
        9,
        10
      ],
      "done_marking": [
        7
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_prime_check": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int CountPrimes(int n) {\n        if (n <= 2) return 0;\n        bool[] isPrime = new bool[n];\n        Array.Fill(isPrime, true);\n        isPrime[0] = isPrime[1] = false;\n        for (int i = 2; i * i < n; i++) {\n            if (isPrime[i]) {\n                for (int j = i * i; j < n; j += i) {\n                    isPrime[j] = false;\n                }\n            }\n        }\n        int count = 0;\n        foreach (bool p in isPrime) if (p) count++;\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        4,
        5,
        6
      ],
      "check_prime": [
        7,
        8
      ],
      "found_prime": [
        8
      ],
      "mark_multiple": [
        9,
        10
      ],
      "done_marking": [
        7
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_prime_check": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countPrimes(n int) int {\n    if n <= 2 {\n        return 0\n    }\n    isPrime := make([]bool, n)\n    for i := range isPrime {\n        isPrime[i] = true\n    }\n    isPrime[0], isPrime[1] = false, false\n    for i := 2; i*i < n; i++ {\n        if isPrime[i] {\n            for j := i * i; j < n; j += i {\n                isPrime[j] = false\n            }\n        }\n    }\n    count := 0\n    for _, p := range isPrime {\n        if p { count++ }\n    }\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6,
        7,
        9
      ],
      "check_prime": [
        10,
        11
      ],
      "found_prime": [
        11
      ],
      "mark_multiple": [
        12,
        13
      ],
      "done_marking": [
        10
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_prime_check": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var countPrimes = function(n) {\n    if (n <= 2) return 0;\n    const isPrime = new Array(n).fill(true);\n    isPrime[0] = isPrime[1] = false;\n    for (let i = 2; i * i < n; i++) {\n        if (isPrime[i]) {\n            for (let j = i * i; j < n; j += i) {\n                isPrime[j] = false;\n            }\n        }\n    }\n    return isPrime.filter(Boolean).length;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4
      ],
      "check_prime": [
        5,
        6
      ],
      "found_prime": [
        6
      ],
      "mark_multiple": [
        7,
        8
      ],
      "done_marking": [
        5
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_prime_check": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countPrimes(n: number): number {\n    if (n <= 2) return 0;\n    const isPrime: boolean[] = new Array(n).fill(true);\n    isPrime[0] = isPrime[1] = false;\n    for (let i = 2; i * i < n; i++) {\n        if (isPrime[i]) {\n            for (let j = i * i; j < n; j += i) {\n                isPrime[j] = false;\n            }\n        }\n    }\n    return isPrime.filter(Boolean).length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4
      ],
      "check_prime": [
        5,
        6
      ],
      "found_prime": [
        6
      ],
      "mark_multiple": [
        7,
        8
      ],
      "done_marking": [
        5
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_prime_check": [
        6
      ]
    }
  }
};

const CountPrimesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "n": 10
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "n": 20
    }
  },
  {
    "id": "ex3",
    "label": "Medium",
    "value": {
      "n": 30
    }
  },
  {
    "id": "ex4",
    "label": "Large",
    "value": {
      "n": 50
    }
  }
];

function generateCountPrimesSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.n,i=new StepRecorder({n:t,count:0,phase:"sieve",exprParts:[]},{}),n=e=>i.update_variable("exprParts",e),l=(e,t)=>i.update_visual(`cell_${e}`,{type:"stateElement",value:e,index:e,...t?{state:t}:{}});if(n([{t:"Sieve of Eratosthenes: cross out every prime's multiples",c:"muted"}]),i.record("-",`Count the primes below ${t}`),t<=2)return i.update_variable("count",0),i.update_variable("done",!0),i.update_variable("answer",0),n([{t:`no numbers below ${t} to check  →  `,c:"muted"},{t:"0 primes",c:"green"}]),i.record("complete",`No primes below ${t}, answer 0`),i.getSteps();let s=Array(t).fill(!0);s[0]=!1,s[1]=!1;for(let e=0;e<t;e++)l(e,e<2?"not_prime":void 0);n([{t:"assume every number is prime; ",c:"muted"},{t:"0",c:"red"},{t:" and ",c:"muted"},{t:"1",c:"red"},{t:" are not",c:"muted"}]),i.record("init","Assume all prime, cross out 0 and 1");for(let e=2;e*e<t;e++)if(i.update_variable("currentPrime",e),l(e,s[e]?"checking":"not_prime"),i.add_conditional("is_prime_check",s[e]),n(s[e]?[{t:`${e}`,c:"cyan"},{t:" is still uncrossed  →  it is prime",c:"muted"}]:[{t:`${e}`,c:"muted"},{t:" was already crossed out, skip",c:"muted"}]),i.record("check_prime",`Is ${e} still uncrossed?`),s[e]){l(e,"prime"),n([{t:`${e}`,c:"green"},{t:" is prime  →  cross out ",c:"muted"},{t:`${e}\xb2, ${e}\xb2+${e}, …`,c:"muted"}]),i.record("found_prime",`${e} is prime, cross out its multiples starting at ${e*e}`);for(let r=e*e;r<t;r+=e)s[r]&&(s[r]=!1,i.update_variable("currentMultiple",r),l(r,"marking"),n([{t:"cross out ",c:"muted"},{t:`${r}`,c:"red"},{t:` = ${e} \xd7 ${r/e}`,c:"muted"}]),i.record("mark_multiple",`Cross out ${r} = ${e} \xd7 ${r/e}`),l(r,"not_prime"));i.delete_variable("currentMultiple"),n([{t:"all multiples of ",c:"muted"},{t:`${e}`,c:"green"},{t:" are crossed out",c:"muted"}]),i.record("done_marking",`Finished the multiples of ${e}`),l(e,"prime")}i.update_variable("phase","reveal"),i.delete_variable("currentPrime");let a=0;for(let e=2;e<t;e++)s[e]&&(a++,l(e,"prime"));return i.update_variable("count",a),i.update_variable("answer",a),i.update_variable("done",!0),n([{t:"the survivors are the primes  →  ",c:"muted"},{t:`${a} primes below ${t}`,c:"green"}]),i.record("complete",`${a} primes below ${t}`),i.getSteps()
  })(__inputArg);
}

export function CountPrimesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountPrimesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCountPrimesSteps(e) as any[];
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
      title="Count Primes"
      slug="count-primes"
      approaches={approaches}
      presets={CountPrimesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Triangle Number (valid-triangle-number)
// ==========================================

const ValidTriangleNumberTemplates = {
  "python": {
    "language": "python",
    "code": "def triangleNumber(nums):\n    n = len(nums)\n    count = 0\n    nums.sort()\n\n    for k in range(n - 1, 1, -1):\n        left = 0\n        right = k - 1\n\n        while left < right:\n            if nums[left] + nums[right] > nums[k]:\n                count += right - left\n                right -= 1\n            else:\n                left += 1\n\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "outer_loop": [
        6
      ],
      "init_pointers": [
        7,
        8
      ],
      "check": [
        10,
        11
      ],
      "valid_found": [
        12
      ],
      "dec_right": [
        13
      ],
      "inc_left": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_valid": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int triangleNumber(int[] nums) {\n    int n = nums.length;\n    int count = 0;\n    Arrays.sort(nums);\n\n    for (int k = n - 1; k >= 2; k--) {\n        int left = 0, right = k - 1;\n\n        while (left < right) {\n            if (nums[left] + nums[right] > nums[k]) {\n                count += right - left;\n                right--;\n            } else {\n                left++;\n            }\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "outer_loop": [
        6
      ],
      "init_pointers": [
        7
      ],
      "check": [
        9,
        10
      ],
      "valid_found": [
        11
      ],
      "dec_right": [
        12
      ],
      "inc_left": [
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_valid": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int triangleNumber(vector<int>& nums) {\n    int n = nums.size();\n    int count = 0;\n    sort(nums.begin(), nums.end());\n\n    for (int k = n - 1; k >= 2; k--) {\n        int left = 0, right = k - 1;\n\n        while (left < right) {\n            if (nums[left] + nums[right] > nums[k]) {\n                count += right - left;\n                right--;\n            } else {\n                left++;\n            }\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "outer_loop": [
        6
      ],
      "init_pointers": [
        7
      ],
      "check": [
        9,
        10
      ],
      "valid_found": [
        11
      ],
      "dec_right": [
        12
      ],
      "inc_left": [
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_valid": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int TriangleNumber(int[] nums) {\n    int n = nums.Length;\n    int count = 0;\n    Array.Sort(nums);\n\n    for (int k = n - 1; k >= 2; k--) {\n        int left = 0, right = k - 1;\n\n        while (left < right) {\n            if (nums[left] + nums[right] > nums[k]) {\n                count += right - left;\n                right--;\n            } else {\n                left++;\n            }\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "outer_loop": [
        6
      ],
      "init_pointers": [
        7
      ],
      "check": [
        9,
        10
      ],
      "valid_found": [
        11
      ],
      "dec_right": [
        12
      ],
      "inc_left": [
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_valid": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func triangleNumber(nums []int) int {\n    n := len(nums)\n    count := 0\n    sort.Ints(nums)\n\n    for k := n - 1; k >= 2; k-- {\n        left := 0\n        right := k - 1\n\n        for left < right {\n            if nums[left]+nums[right] > nums[k] {\n                count += right - left\n                right--\n            } else {\n                left++\n            }\n        }\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "outer_loop": [
        6
      ],
      "init_pointers": [
        7,
        8
      ],
      "check": [
        10,
        11
      ],
      "valid_found": [
        12
      ],
      "dec_right": [
        13
      ],
      "inc_left": [
        15
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_valid": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function triangleNumber(nums) {\n    const n = nums.length;\n    let count = 0;\n    nums.sort((a, b) => a - b);\n\n    for (let k = n - 1; k >= 2; k--) {\n        let left = 0, right = k - 1;\n\n        while (left < right) {\n            if (nums[left] + nums[right] > nums[k]) {\n                count += right - left;\n                right--;\n            } else {\n                left++;\n            }\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "outer_loop": [
        6
      ],
      "init_pointers": [
        7
      ],
      "check": [
        9,
        10
      ],
      "valid_found": [
        11
      ],
      "dec_right": [
        12
      ],
      "inc_left": [
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_valid": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function triangleNumber(nums: number[]): number {\n    const n = nums.length;\n    let count = 0;\n    nums.sort((a, b) => a - b);\n\n    for (let k = n - 1; k >= 2; k--) {\n        let left = 0, right = k - 1;\n\n        while (left < right) {\n            if (nums[left] + nums[right] > nums[k]) {\n                count += right - left;\n                right--;\n            } else {\n                left++;\n            }\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "outer_loop": [
        6
      ],
      "init_pointers": [
        7
      ],
      "check": [
        9,
        10
      ],
      "valid_found": [
        11
      ],
      "dec_right": [
        12
      ],
      "inc_left": [
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_valid": [
        10
      ]
    }
  }
};

const ValidTriangleNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        2,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Larger",
    "value": {
      "nums": [
        4,
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
    "label": "Small",
    "value": {
      "nums": [
        1,
        1,
        2
      ]
    }
  }
];

function generateValidTriangleNumberSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.nums],n=t.length,r=t.reduce((e,t,n)=>(e[`bar_${n}`]={type:"arrayElement",value:t,position:n},e),{}),l=new StepRecorder({nums:[...t],count:0,exprParts:[]},r),a=e=>l.update_variable("exprParts",e),s=()=>l.delete_variable("batchFlight"),o=e=>{for(let i=0;i<n;i++)l.update_visual(`bar_${i}`,{type:"arrayElement",value:t[i],position:i,...e[i]?{state:e[i]}:{}})},u=(e,t,n,i)=>l.update_variable("tri",{a:e,b:t,c:n,valid:i});if(s(),a([{t:"sides a ≤ b ≤ c form a triangle only if a + b > c",c:"muted"}]),l.record("-","Count triangles with sort + two pointers"),n<3)return l.update_variable("count",0),l.update_variable("done",!0),l.update_variable("answer",0),a([{t:"fewer than 3 sides  →  ",c:"muted"},{t:"0 triangles",c:"green"}]),l.record("complete","Not enough sides, count 0"),l.getSteps();t.sort((e,t)=>e-t),l.update_variable("nums",[...t]),o({}),a([{t:"sort ascending so the largest side is easy to fix",c:"muted"}]),l.record("sort","Sort ascending");let c=0;for(let e=n-1;e>=2;e--){l.update_variable("k",e),l.update_visual("ptr_k",{type:"pointer",position:e,label:"k"}),l.delete_variable("tri"),s(),o({}),a([{t:`fix the largest side c = nums[${e}] = `,c:"muted"},{t:`${t[e]}`,c:"green"}]),l.record("outer_loop",`Fix largest side nums[${e}] = ${t[e]}`);let n=0,i=e-1;for(l.update_variable("left",n),l.update_variable("right",i),l.update_visual("ptr_left",{type:"pointer",position:n,label:"left"}),l.update_visual("ptr_right",{type:"pointer",position:i,label:"right"}),a([{t:`pick the two smaller sides: left = 0, right = ${i}`,c:"muted"}]),l.record("init_pointers",`left = 0, right = ${i}`);n<i;){let r=t[n],d=t[i],h=t[e],p=r+d,g=p>h;if(l.update_variable("left",n),l.update_variable("right",i),l.update_visual("ptr_left",{type:"pointer",position:n,label:"left"}),l.update_visual("ptr_right",{type:"pointer",position:i,label:"right"}),o({}),u(r,d,h,g),l.add_conditional("check_valid",g),s(),a([{t:`${r} + ${d} = `,c:"muted"},{t:`${p}`,c:g?"green":"red"},{t:` ${g?">":"≤"} `,c:"muted"},{t:`${h}`,c:"green"}]),l.record("check",`${r} + ${d} = ${p} ${g?">":"≤"} ${h}`),g){let e=i-n,t=c;c+=e,l.update_variable("count",c);let r={};for(let e=n;e<i;e++)r[e]="counted";o(r),l.update_variable("batchFlight",{batch:e,from:(n+i)/2}),a([{t:`every left in [${n}..${i-1}] also works  →  `,c:"muted"},{t:`+${e}`,c:"green"},{t:` (count ${t} → ${c})`,c:"muted"}]),l.record("valid_found",`All ${e} pairs with right = ${i} are valid, count = ${c}`),i--,l.update_variable("right",i),l.update_visual("ptr_right",{type:"pointer",position:i,label:"right"}),l.delete_variable("batchFlight"),a([{t:`shrink the window: right = ${i}`,c:"muted"}]),l.record("dec_right",`right = ${i}`)}else n++,l.update_variable("left",n),l.update_visual("ptr_left",{type:"pointer",position:n,label:"left"}),s(),a([{t:`sum too small, need a bigger a: left = ${n}`,c:"muted"}]),l.record("inc_left",`left = ${n}`)}}return o(Object.fromEntries(Array.from({length:n},(e,t)=>[t,"done"]))),l.delete_visual("ptr_k"),l.delete_visual("ptr_left"),l.delete_visual("ptr_right"),l.delete_variable("tri"),l.update_variable("count",c),l.update_variable("answer",c),l.update_variable("done",!0),s(),a([{t:"total: ",c:"muted"},{t:`${c} valid triangles`,c:"green"}]),l.record("complete",`Total valid triangles = ${c}`),l.getSteps()
  })(__inputArg);
}

export function ValidTriangleNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidTriangleNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidTriangleNumberSteps(e) as any[];
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
      title="Valid Triangle Number"
      slug="valid-triangle-number"
      approaches={approaches}
      presets={ValidTriangleNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Area Rectangle (minimum-area-rectangle)
// ==========================================

const MinimumAreaRectangleTemplates = {
  "python": {
    "language": "python",
    "code": "def minAreaRect(points):\n    columns = {}\n    for x, y in points:\n        columns.setdefault(x, []).append(y)\n    last_x = {}\n    min_area = float('inf')\n    for x in sorted(columns):\n        ys = sorted(columns[x])\n        for i in range(len(ys)):\n            for j in range(i + 1, len(ys)):\n                y1, y2 = ys[i], ys[j]\n                key = (y1, y2)\n                if key in last_x:\n                    area = (x - last_x[key]) * (y2 - y1)\n                    min_area = min(min_area, area)\n                last_x[key] = x\n    return 0 if min_area == float('inf') else min_area",
    "lineMap": {
      "-": [
        1
      ],
      "process_column": [
        7,
        8
      ],
      "check_pair": [
        9,
        10,
        11,
        12
      ],
      "found_rect": [
        14,
        15
      ],
      "no_match": [
        13
      ],
      "update_lastx": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "has_match": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int minAreaRect(int[][] points) {\n    Map<Integer, List<Integer>> columns = new TreeMap<>();\n    for (int[] p : points) {\n        columns.computeIfAbsent(p[0], k -> new ArrayList<>()).add(p[1]);\n    }\n    Map<Long, Integer> lastX = new HashMap<>();\n    int minArea = Integer.MAX_VALUE;\n    for (Map.Entry<Integer, List<Integer>> entry : columns.entrySet()) {\n        int x = entry.getKey();\n        List<Integer> ys = entry.getValue();\n        Collections.sort(ys);\n        for (int i = 0; i < ys.size(); i++) {\n            for (int j = i + 1; j < ys.size(); j++) {\n                int y1 = ys.get(i), y2 = ys.get(j);\n                long key = (long) y1 * 40001 + y2;\n                if (lastX.containsKey(key)) {\n                    int area = (x - lastX.get(key)) * (y2 - y1);\n                    minArea = Math.min(minArea, area);\n                }\n                lastX.put(key, x);\n            }\n        }\n    }\n    return minArea == Integer.MAX_VALUE ? 0 : minArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "process_column": [
        8,
        9,
        10,
        11
      ],
      "check_pair": [
        12,
        13,
        14,
        15
      ],
      "found_rect": [
        17,
        18
      ],
      "no_match": [
        16
      ],
      "update_lastx": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_match": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int minAreaRect(vector<vector<int>>& points) {\n    map<int, vector<int>> columns;\n    for (auto& p : points) {\n        columns[p[0]].push_back(p[1]);\n    }\n    unordered_map<long, int> lastX;\n    int minArea = INT_MAX;\n    for (auto& [x, ys] : columns) {\n        sort(ys.begin(), ys.end());\n        for (int i = 0; i < ys.size(); i++) {\n            for (int j = i + 1; j < ys.size(); j++) {\n                int y1 = ys[i], y2 = ys[j];\n                long key = (long)y1 * 40001 + y2;\n                if (lastX.count(key)) {\n                    int area = (x - lastX[key]) * (y2 - y1);\n                    minArea = min(minArea, area);\n                }\n                lastX[key] = x;\n            }\n        }\n    }\n    return minArea == INT_MAX ? 0 : minArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "process_column": [
        8,
        9
      ],
      "check_pair": [
        10,
        11,
        12,
        13
      ],
      "found_rect": [
        15,
        16
      ],
      "no_match": [
        14
      ],
      "update_lastx": [
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "has_match": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MinAreaRect(int[][] points) {\n    var columns = new SortedDictionary<int, List<int>>();\n    foreach (var p in points) {\n        if (!columns.ContainsKey(p[0]))\n            columns[p[0]] = new List<int>();\n        columns[p[0]].Add(p[1]);\n    }\n    var lastX = new Dictionary<long, int>();\n    int minArea = int.MaxValue;\n    foreach (var (x, ys) in columns) {\n        ys.Sort();\n        for (int i = 0; i < ys.Count; i++) {\n            for (int j = i + 1; j < ys.Count; j++) {\n                int y1 = ys[i], y2 = ys[j];\n                long key = (long)y1 * 40001 + y2;\n                if (lastX.ContainsKey(key)) {\n                    int area = (x - lastX[key]) * (y2 - y1);\n                    minArea = Math.Min(minArea, area);\n                }\n                lastX[key] = x;\n            }\n        }\n    }\n    return minArea == int.MaxValue ? 0 : minArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "process_column": [
        10,
        11
      ],
      "check_pair": [
        12,
        13,
        14,
        15
      ],
      "found_rect": [
        17,
        18
      ],
      "no_match": [
        16
      ],
      "update_lastx": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_match": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minAreaRect(points [][]int) int {\n    columns := map[int][]int{}\n    for _, p := range points {\n        columns[p[0]] = append(columns[p[0]], p[1])\n    }\n    keys := make([]int, 0, len(columns))\n    for k := range columns {\n        keys = append(keys, k)\n    }\n    sort.Ints(keys)\n    lastX := map[int64]int{}\n    minArea := math.MaxInt32\n    for _, x := range keys {\n        ys := columns[x]\n        sort.Ints(ys)\n        for i := 0; i < len(ys); i++ {\n            for j := i + 1; j < len(ys); j++ {\n                y1, y2 := ys[i], ys[j]\n                key := int64(y1)*40001 + int64(y2)\n                if prev, ok := lastX[key]; ok {\n                    area := (x - prev) * (y2 - y1)\n                    if area < minArea {\n                        minArea = area\n                    }\n                }\n                lastX[key] = x\n            }\n        }\n    }\n    if minArea == math.MaxInt32 {\n        return 0\n    }\n    return minArea\n}",
    "lineMap": {
      "-": [
        1
      ],
      "process_column": [
        13,
        14,
        15
      ],
      "check_pair": [
        16,
        17,
        18,
        19
      ],
      "found_rect": [
        21,
        22,
        23
      ],
      "no_match": [
        20
      ],
      "update_lastx": [
        26
      ],
      "complete": [
        30,
        31,
        32,
        33
      ]
    },
    "conditionalMap": {
      "has_match": [
        20
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minAreaRect(points) {\n    const columns = new Map();\n    for (const [x, y] of points) {\n        if (!columns.has(x)) columns.set(x, []);\n        columns.get(x).push(y);\n    }\n    const lastX = new Map();\n    let minArea = Infinity;\n    const sortedKeys = [...columns.keys()].sort((a, b) => a - b);\n    for (const x of sortedKeys) {\n        const ys = columns.get(x).sort((a, b) => a - b);\n        for (let i = 0; i < ys.length; i++) {\n            for (let j = i + 1; j < ys.length; j++) {\n                const [y1, y2] = [ys[i], ys[j]];\n                const key = y1 * 40001 + y2;\n                if (lastX.has(key)) {\n                    const area = (x - lastX.get(key)) * (y2 - y1);\n                    minArea = Math.min(minArea, area);\n                }\n                lastX.set(key, x);\n            }\n        }\n    }\n    return minArea === Infinity ? 0 : minArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "process_column": [
        10,
        11
      ],
      "check_pair": [
        12,
        13,
        14,
        15
      ],
      "found_rect": [
        17,
        18
      ],
      "no_match": [
        16
      ],
      "update_lastx": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_match": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minAreaRect(points: number[][]): number {\n    const columns = new Map<number, number[]>();\n    for (const [x, y] of points) {\n        if (!columns.has(x)) columns.set(x, []);\n        columns.get(x)!.push(y);\n    }\n    const lastX = new Map<number, number>();\n    let minArea = Infinity;\n    const sortedKeys = [...columns.keys()].sort((a, b) => a - b);\n    for (const x of sortedKeys) {\n        const ys = columns.get(x)!.sort((a, b) => a - b);\n        for (let i = 0; i < ys.length; i++) {\n            for (let j = i + 1; j < ys.length; j++) {\n                const [y1, y2] = [ys[i], ys[j]];\n                const key = y1 * 40001 + y2;\n                if (lastX.has(key)) {\n                    const area = (x - lastX.get(key)!) * (y2 - y1);\n                    minArea = Math.min(minArea, area);\n                }\n                lastX.set(key, x);\n            }\n        }\n    }\n    return minArea === Infinity ? 0 : minArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "process_column": [
        10,
        11
      ],
      "check_pair": [
        12,
        13,
        14,
        15
      ],
      "found_rect": [
        17,
        18
      ],
      "no_match": [
        16
      ],
      "update_lastx": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_match": [
        16
      ]
    }
  }
};

const MinimumAreaRectanglePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "points": [
        [
          1,
          1
        ],
        [
          1,
          3
        ],
        [
          3,
          1
        ],
        [
          3,
          3
        ],
        [
          2,
          2
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Rectangle",
    "value": {
      "points": [
        [
          1,
          1
        ],
        [
          1,
          3
        ],
        [
          3,
          1
        ],
        [
          3,
          3
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Multiple",
    "value": {
      "points": [
        [
          1,
          1
        ],
        [
          1,
          3
        ],
        [
          3,
          1
        ],
        [
          3,
          3
        ],
        [
          4,
          1
        ],
        [
          4,
          3
        ]
      ]
    }
  }
];

function generateMinimumAreaRectangleSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.points,n=new Map;for(let[e,r]of t)n.has(e)||n.set(e,[]),n.get(e).push(r);let i=Array.from(n.keys()).sort((e,t)=>e-t);for(let e of i)n.get(e).sort((e,t)=>e-t);let a=new StepRecorder({points:t,minArea:"∞",lastXMap:{},exprParts:[]},{}),l=e=>a.update_variable("exprParts",e),s=()=>{a.delete_variable("colX"),a.delete_variable("y1"),a.delete_variable("y2"),a.delete_variable("matchPrevX"),a.delete_variable("rect"),a.delete_variable("lookupKey"),a.delete_variable("updatedKey")};s(),l([{t:"a rectangle needs two columns that share the same y-pair",c:"muted"}]),a.record("-","Find the minimum axis-aligned rectangle");let o=new Map,c=1/0,u=null;for(let e of i){let t=n.get(e);if(s(),a.update_variable("colX",e),l([{t:"column x = ",c:"muted"},{t:`${e}`,c:"cyan"},{t:`: y = {${t.join(", ")}}`,c:"muted"}]),a.record("process_column",`Column x = ${e} with ${t.length} point${t.length>1?"s":""}`),!(t.length<2))for(let n=0;n<t.length;n++)for(let r=n+1;r<t.length;r++){let i=t[n],s=t[r],d=`${i},${s}`,h=o.has(d),f=o.get(d);if(a.update_variable("colX",e),a.update_variable("y1",i),a.update_variable("y2",s),a.update_variable("lookupKey",d),a.delete_variable("rect"),a.delete_variable("updatedKey"),h?a.update_variable("matchPrevX",f):a.delete_variable("matchPrevX"),a.add_conditional("has_match",h),l([{t:"right edge: y-pair (",c:"muted"},{t:`${i}, ${s}`,c:"cyan"},{t:`) at x = ${e}`,c:"muted"}]),a.record("check_pair",`y-pair (${i}, ${s}) at x = ${e}`),h){let t=e-f,n=s-i,r=t*n,o={x1:f,y1:i,x2:e,y2:s,area:r};a.update_variable("rect",o);let d=r<c;d&&(c=r,u=o,a.update_variable("minArea",c),a.update_variable("minRect",u)),l([{t:`rectangle [${f}..${e}] \xd7 [${i}..${s}]  →  area = ${t} \xd7 ${n} = `,c:"muted"},{t:`${r}`,c:d?"green":"yellow"},d?{t:"  (new min!)",c:"green"}:{t:`  (min stays ${c})`,c:"muted"}]),a.record("found_rect",`Rectangle (${f},${i})-(${e},${s}), area = ${r}, min = ${c}`)}else l([{t:"no earlier column has (",c:"muted"},{t:`${i}, ${s}`,c:"cyan"},{t:") yet",c:"muted"}]),a.record("no_match",`No earlier column has (${i}, ${s})`);o.set(d,e),a.update_variable("lastXMap",Object.fromEntries(o)),a.update_variable("updatedKey",d),a.delete_variable("rect"),a.delete_variable("matchPrevX"),l([{t:`remember lastX[(${i}, ${s})] = `,c:"muted"},{t:`${e}`,c:"cyan"}]),a.record("update_lastx",`lastX[(${i},${s})] = ${e}`)}}let d=c===1/0?0:c;return s(),a.update_variable("minArea",d),u&&a.update_variable("minRect",u),a.update_variable("done",!0),a.update_variable("answer",d),l([{t:"minimum area rectangle = ",c:"muted"},{t:`${d}`,c:"green"}]),a.record("complete",`Minimum area = ${d}`),a.getSteps()
  })(__inputArg);
}

export function MinimumAreaRectangleProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumAreaRectangleTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumAreaRectangleSteps(e) as any[];
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
      title="Minimum Area Rectangle"
      slug="minimum-area-rectangle"
      approaches={approaches}
      presets={MinimumAreaRectanglePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Plus One (plus-one)
// ==========================================

const PlusOneTemplates = {
  "python": {
    "language": "python",
    "code": "def plus_one(digits):\n    n = len(digits)\n\n    for i in range(n - 1, -1, -1):\n        if digits[i] < 9:\n            digits[i] += 1\n            return digits\n        digits[i] = 0\n\n    result = [0] * (n + 1)\n    result[0] = 1\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "check_digit": [
        4,
        5
      ],
      "increment": [
        6,
        7
      ],
      "complete_increment": [
        7
      ],
      "set_zero": [
        8
      ],
      "new_array": [
        10,
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_less_than_9": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] plusOne(int[] digits) {\n        int n = digits.length;\n\n        for (int i = n - 1; i >= 0; i--) {\n            if (digits[i] < 9) {\n                digits[i]++;\n                return digits;\n            }\n            digits[i] = 0;\n        }\n\n        int[] result = new int[n + 1];\n        result[0] = 1;\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_digit": [
        5,
        6
      ],
      "increment": [
        7,
        8
      ],
      "complete_increment": [
        8
      ],
      "set_zero": [
        10
      ],
      "new_array": [
        13,
        14
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "check_less_than_9": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> plusOne(vector<int>& digits) {\n        int n = digits.size();\n\n        for (int i = n - 1; i >= 0; i--) {\n            if (digits[i] < 9) {\n                digits[i]++;\n                return digits;\n            }\n            digits[i] = 0;\n        }\n\n        vector<int> result(n + 1, 0);\n        result[0] = 1;\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "check_digit": [
        6,
        7
      ],
      "increment": [
        8,
        9
      ],
      "complete_increment": [
        9
      ],
      "set_zero": [
        11
      ],
      "new_array": [
        14,
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_less_than_9": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] PlusOne(int[] digits) {\n        int n = digits.Length;\n\n        for (int i = n - 1; i >= 0; i--) {\n            if (digits[i] < 9) {\n                digits[i]++;\n                return digits;\n            }\n            digits[i] = 0;\n        }\n\n        int[] result = new int[n + 1];\n        result[0] = 1;\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_digit": [
        5,
        6
      ],
      "increment": [
        7,
        8
      ],
      "complete_increment": [
        8
      ],
      "set_zero": [
        10
      ],
      "new_array": [
        13,
        14
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "check_less_than_9": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func plusOne(digits []int) []int {\n    n := len(digits)\n\n    for i := n - 1; i >= 0; i-- {\n        if digits[i] < 9 {\n            digits[i]++\n            return digits\n        }\n        digits[i] = 0\n    }\n\n    result := make([]int, n+1)\n    result[0] = 1\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_digit": [
        4,
        5
      ],
      "increment": [
        6,
        7
      ],
      "complete_increment": [
        7
      ],
      "set_zero": [
        9
      ],
      "new_array": [
        12,
        13
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_less_than_9": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function plusOne(digits) {\n    const n = digits.length;\n\n    for (let i = n - 1; i >= 0; i--) {\n        if (digits[i] < 9) {\n            digits[i]++;\n            return digits;\n        }\n        digits[i] = 0;\n    }\n\n    const result = new Array(n + 1).fill(0);\n    result[0] = 1;\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_digit": [
        4,
        5
      ],
      "increment": [
        6,
        7
      ],
      "complete_increment": [
        7
      ],
      "set_zero": [
        9
      ],
      "new_array": [
        12,
        13
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_less_than_9": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function plusOne(digits: number[]): number[] {\n    const n = digits.length;\n\n    for (let i = n - 1; i >= 0; i--) {\n        if (digits[i] < 9) {\n            digits[i]++;\n            return digits;\n        }\n        digits[i] = 0;\n    }\n\n    const result = new Array(n + 1).fill(0);\n    result[0] = 1;\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_digit": [
        4,
        5
      ],
      "increment": [
        6,
        7
      ],
      "complete_increment": [
        7
      ],
      "set_zero": [
        9
      ],
      "new_array": [
        12,
        13
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_less_than_9": [
        5
      ]
    }
  }
};

const PlusOnePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "digits": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Single Carry",
    "value": {
      "digits": [
        1,
        2,
        9
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Nines",
    "value": {
      "digits": [
        9,
        9,
        9
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Zero",
    "value": {
      "digits": [
        0
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Double Carry",
    "value": {
      "digits": [
        1,
        9,
        9
      ]
    }
  }
];

function generatePlusOneSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.digits],i=t.length,r=t.join(""),l={};for(let e=0;e<i;e++)l[`digit_${e}`]={type:"arrayElement",value:t[e],position:e,state:"idle"};let a=new StepRecorder({digits:[...t],n:i,i:void 0,original:r},l);if(a.record("-",`Add one to the number ${r}`),0===i)return a.record("complete","Empty array, nothing to do"),a.getSteps();for(let e=i-1;e>=0;e--){if(a.update_variable("i",e),a.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),a.update_visual("ptr_carry",{type:"pointer",position:e,label:"carry"}),a.update_visual(`digit_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),a.add_conditional("check_less_than_9",t[e]<9),a.update_variable("digitVal",t[e]),a.record("check_digit",`Add the carry to digits[${e}] = ${t[e]}: is it less than 9?`),t[e]<9){let i=t[e];return t[e]++,a.update_variable("digits",[...t]),a.update_variable("incFrom",i),a.update_variable("incTo",t[e]),a.update_variable("incIdx",e),a.update_visual(`digit_${e}`,{type:"arrayElement",value:t[e],position:e,state:"incremented"}),a.record("increment",`${i} + 1 = ${t[e]}: the carry is absorbed, so we're done`),a.delete_visual("ptr_i"),a.delete_visual("ptr_carry"),a.add_new_visual("meta_result",{type:"metadata",value:`[${t.join(", ")}]`,label:"result"}),a.record("complete_increment",`Result: [${t.join(", ")}]`),a.getSteps()}t[e]=0,a.update_variable("digits",[...t]),a.update_visual(`digit_${e}`,{type:"arrayElement",value:0,position:e,state:"carried"}),e-1>=0&&a.update_visual("ptr_carry",{type:"pointer",position:e-1,label:"carry"}),a.record("set_zero","9 + 1 = 10: write 0 here and carry the 1 left")}a.delete_visual("ptr_i");for(let e=0;e<i;e++)a.update_visual(`digit_${e}`,{type:"arrayElement",value:0,position:e+1,state:"carried"});a.add_new_visual("lead_1",{type:"arrayElement",value:1,position:0,state:"lead",stage:"entering"}),a.update_visual("ptr_carry",{type:"pointer",position:0,label:"carry"});let s=[1,...Array(i).fill(0)];return a.update_variable("digits",[...s]),a.record("new_array","The carry has nowhere to go, so prepend a new 1"),a.delete_visual("ptr_carry"),a.add_new_visual("meta_result",{type:"metadata",value:`[${s.join(", ")}]`,label:"result"}),a.record("complete",`Result: [${s.join(", ")}]`),a.getSteps()
  })(__inputArg);
}

export function PlusOneProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PlusOneTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePlusOneSteps(e) as any[];
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
      title="Plus One"
      slug="plus-one"
      approaches={approaches}
      presets={PlusOnePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Roman to Integer (roman-to-integer)
// ==========================================

const RomanToIntegerTemplates = {
  "python": {
    "language": "python",
    "code": "def roman_to_int(s):\n    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50,\n              'C': 100, 'D': 500, 'M': 1000}\n    result = 0\n    n = len(s)\n\n    for i in range(n):\n        current = values[s[i]]\n        if i < n - 1 and current < values[s[i + 1]]:\n            result -= current\n        else:\n            result += current\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "get_current": [
        7,
        8
      ],
      "check_next": [
        9
      ],
      "subtract": [
        10
      ],
      "add": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_subtract": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int romanToInt(String s) {\n        int[] values = new int[128];\n        values['I'] = 1;\n        values['V'] = 5;\n        values['X'] = 10;\n        values['L'] = 50;\n        values['C'] = 100;\n        values['D'] = 500;\n        values['M'] = 1000;\n        int result = 0;\n        int n = s.length();\n\n        for (int i = 0; i < n; i++) {\n            int current = values[s.charAt(i)];\n            if (i < n - 1 && current < values[s.charAt(i + 1)]) {\n                result -= current;\n            } else {\n                result += current;\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "get_current": [
        14,
        15
      ],
      "check_next": [
        16
      ],
      "subtract": [
        17
      ],
      "add": [
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "check_subtract": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int romanToInt(string s) {\n        unordered_map<char, int> values = {\n            {'I', 1}, {'V', 5}, {'X', 10}, {'L', 50},\n            {'C', 100}, {'D', 500}, {'M', 1000}\n        };\n        int result = 0;\n        int n = s.length();\n\n        for (int i = 0; i < n; i++) {\n            int current = values[s[i]];\n            if (i < n - 1 && current < values[s[i + 1]]) {\n                result -= current;\n            } else {\n                result += current;\n            }\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "get_current": [
        11,
        12
      ],
      "check_next": [
        13
      ],
      "subtract": [
        14
      ],
      "add": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_subtract": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int RomanToInt(string s) {\n        var values = new Dictionary<char, int> {\n            {'I', 1}, {'V', 5}, {'X', 10}, {'L', 50},\n            {'C', 100}, {'D', 500}, {'M', 1000}\n        };\n        int result = 0;\n        int n = s.Length;\n\n        for (int i = 0; i < n; i++) {\n            int current = values[s[i]];\n            if (i < n - 1 && current < values[s[i + 1]]) {\n                result -= current;\n            } else {\n                result += current;\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "get_current": [
        10,
        11
      ],
      "check_next": [
        12
      ],
      "subtract": [
        13
      ],
      "add": [
        15
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_subtract": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func romanToInt(s string) int {\n    values := map[byte]int{\n        'I': 1, 'V': 5, 'X': 10, 'L': 50,\n        'C': 100, 'D': 500, 'M': 1000,\n    }\n    result := 0\n    n := len(s)\n\n    for i := 0; i < n; i++ {\n        current := values[s[i]]\n        if i < n-1 && current < values[s[i+1]] {\n            result -= current\n        } else {\n            result += current\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_current": [
        9,
        10
      ],
      "check_next": [
        11
      ],
      "subtract": [
        12
      ],
      "add": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_subtract": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function romanToInt(s) {\n    const values = {\n        'I': 1, 'V': 5, 'X': 10, 'L': 50,\n        'C': 100, 'D': 500, 'M': 1000\n    };\n    let result = 0;\n    const n = s.length;\n\n    for (let i = 0; i < n; i++) {\n        const current = values[s[i]];\n        if (i < n - 1 && current < values[s[i + 1]]) {\n            result -= current;\n        } else {\n            result += current;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_current": [
        9,
        10
      ],
      "check_next": [
        11
      ],
      "subtract": [
        12
      ],
      "add": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_subtract": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function romanToInt(s: string): number {\n    const values: Record<string, number> = {\n        'I': 1, 'V': 5, 'X': 10, 'L': 50,\n        'C': 100, 'D': 500, 'M': 1000\n    };\n    let result = 0;\n    const n = s.length;\n\n    for (let i = 0; i < n; i++) {\n        const current = values[s[i]];\n        if (i < n - 1 && current < values[s[i + 1]]) {\n            result -= current;\n        } else {\n            result += current;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "get_current": [
        9,
        10
      ],
      "check_next": [
        11
      ],
      "subtract": [
        12
      ],
      "add": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_subtract": [
        11
      ]
    }
  }
};

const RomanToIntegerPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Simple",
    "value": {
      "s": "III"
    }
  },
  {
    "id": "ex2",
    "label": "Standard",
    "value": {
      "s": "LVIII"
    }
  },
  {
    "id": "ex3",
    "label": "Complex",
    "value": {
      "s": "MCMXCIV"
    }
  },
  {
    "id": "ex4",
    "label": "Subtraction",
    "value": {
      "s": "IV"
    }
  },
  {
    "id": "ex5",
    "label": "Mixed",
    "value": {
      "s": "XLII"
    }
  }
];

function generateRomanToIntegerSteps(__inputArg: any): any[] {
  let l={I:1,V:5,X:10,L:50,C:100,D:500,M:1e3};
  return (function(e: any) {
let t=e.s,r=t.length,i={};for(let e=0;e<r;e++)i[`char_${e}`]={type:"arrayElement",value:t[e],position:e};let a=new StepRecorder({s:t,n:r,result:0,terms:[]},{...i}),s=()=>{a.delete_variable("delta"),a.delete_variable("deltaSlot"),a.delete_variable("relation")};if(s(),a.record("-","Scan left to right, adding each symbol's value"),0===r)return a.update_variable("done",!0),a.record("complete","Empty string, result is 0"),a.getSteps();let o=0,u=[];for(let e=0;e<r;e++){let n=l[t[e]];a.update_variable("i",e),a.update_variable("current",n),a.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),a.update_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),s(),a.record("get_current",`Read '${t[e]}' → value ${n}`);let i=e<r-1,c=i?l[t[e+1]]:-1/0,d=i&&n<c;a.add_conditional("check_subtract",d),i?(a.update_visual(`char_${e+1}`,{type:"arrayElement",value:t[e+1],position:e+1,state:"peek"}),a.update_variable("relation",{i:e,a:n,b:c,symbol:d?"<":"≥",subtract:d}),a.record("check_next",d?`${n} < ${c}: smaller before larger, so subtract`:`${n} ≥ ${c}: not smaller, so add`),a.update_visual(`char_${e+1}`,{type:"arrayElement",value:t[e+1],position:e+1})):(a.update_variable("relation",{i:e,a:n,b:null,symbol:null,subtract:!1}),a.record("check_next","Last symbol, nothing larger follows, so add"));let h=d?-n:n;o+=h,u.push({sign:d?"−":"+",value:n,slot:e}),a.update_variable("result",o),a.update_variable("terms",[...u]),a.update_variable("delta",h),a.update_variable("deltaSlot",e),a.delete_variable("relation"),a.update_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,state:d?"subtract":"add"}),a.record(d?"subtract":"add",d?`Subtract ${n}: result = ${o}`:`Add ${n}: result = ${o}`)}return a.delete_visual("ptr_i"),a.update_variable("done",!0),s(),a.record("complete",`Done! "${t}" = ${o}`),a.getSteps()
  })(__inputArg);
}

export function RomanToIntegerProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RomanToIntegerTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRomanToIntegerSteps(e) as any[];
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
      title="Roman to Integer"
      slug="roman-to-integer"
      approaches={approaches}
      presets={RomanToIntegerPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Excel Sheet Column Title (excel-sheet-column-title)
// ==========================================

const ExcelSheetColumnTitleTemplates = {
  "python": {
    "language": "python",
    "code": "def convert_to_title(columnNumber):\n    result = []\n\n    while columnNumber > 0:\n        columnNumber -= 1\n        remainder = columnNumber % 26\n        result.append(chr(ord('A') + remainder))\n        columnNumber //= 26\n\n    return ''.join(reversed(result))",
    "lineMap": {
      "-": [
        1
      ],
      "init_result": [
        2
      ],
      "while_check": [
        4
      ],
      "decrement": [
        5
      ],
      "compute_remainder": [
        6
      ],
      "append_char": [
        7
      ],
      "divide": [
        8
      ],
      "reverse": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String convertToTitle(int columnNumber) {\n        StringBuilder result = new StringBuilder();\n\n        while (columnNumber > 0) {\n            columnNumber--;\n            int remainder = columnNumber % 26;\n            result.append((char) ('A' + remainder));\n            columnNumber /= 26;\n        }\n\n        return result.reverse().toString();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_result": [
        3
      ],
      "while_check": [
        5
      ],
      "decrement": [
        6
      ],
      "compute_remainder": [
        7
      ],
      "append_char": [
        8
      ],
      "divide": [
        9
      ],
      "reverse": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string convertToTitle(int columnNumber) {\n        string result = \"\";\n\n        while (columnNumber > 0) {\n            columnNumber--;\n            int remainder = columnNumber % 26;\n            result += (char)('A' + remainder);\n            columnNumber /= 26;\n        }\n\n        reverse(result.begin(), result.end());\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init_result": [
        4
      ],
      "while_check": [
        6
      ],
      "decrement": [
        7
      ],
      "compute_remainder": [
        8
      ],
      "append_char": [
        9
      ],
      "divide": [
        10
      ],
      "reverse": [
        13,
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "while_check": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string ConvertToTitle(int columnNumber) {\n        StringBuilder result = new StringBuilder();\n\n        while (columnNumber > 0) {\n            columnNumber--;\n            int remainder = columnNumber % 26;\n            result.Append((char)('A' + remainder));\n            columnNumber /= 26;\n        }\n\n        char[] chars = result.ToString().ToCharArray();\n        Array.Reverse(chars);\n        return new string(chars);\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_result": [
        3
      ],
      "while_check": [
        5
      ],
      "decrement": [
        6
      ],
      "compute_remainder": [
        7
      ],
      "append_char": [
        8
      ],
      "divide": [
        9
      ],
      "reverse": [
        12,
        13,
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func convertToTitle(columnNumber int) string {\n    result := []byte{}\n\n    for columnNumber > 0 {\n        columnNumber--\n        remainder := columnNumber % 26\n        result = append(result, byte('A'+remainder))\n        columnNumber /= 26\n    }\n\n    // Reverse\n    for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {\n        result[i], result[j] = result[j], result[i]\n    }\n    return string(result)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_result": [
        2
      ],
      "while_check": [
        4
      ],
      "decrement": [
        5
      ],
      "compute_remainder": [
        6
      ],
      "append_char": [
        7
      ],
      "divide": [
        8
      ],
      "reverse": [
        12,
        13,
        14,
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function convertToTitle(columnNumber) {\n    let result = [];\n\n    while (columnNumber > 0) {\n        columnNumber--;\n        let remainder = columnNumber % 26;\n        result.push(String.fromCharCode(65 + remainder));\n        columnNumber = Math.floor(columnNumber / 26);\n    }\n\n    return result.reverse().join('');\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_result": [
        2
      ],
      "while_check": [
        4
      ],
      "decrement": [
        5
      ],
      "compute_remainder": [
        6
      ],
      "append_char": [
        7
      ],
      "divide": [
        8
      ],
      "reverse": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function convertToTitle(columnNumber: number): string {\n    const result: string[] = [];\n\n    while (columnNumber > 0) {\n        columnNumber--;\n        const remainder = columnNumber % 26;\n        result.push(String.fromCharCode(65 + remainder));\n        columnNumber = Math.floor(columnNumber / 26);\n    }\n\n    return result.reverse().join('');\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_result": [
        2
      ],
      "while_check": [
        4
      ],
      "decrement": [
        5
      ],
      "compute_remainder": [
        6
      ],
      "append_char": [
        7
      ],
      "divide": [
        8
      ],
      "reverse": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  }
};

const ExcelSheetColumnTitlePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "1 → \"A\"",
    "value": {
      "columnNumber": 1
    }
  },
  {
    "id": "ex2",
    "label": "28 → \"AB\"",
    "value": {
      "columnNumber": 28
    }
  },
  {
    "id": "ex3",
    "label": "701 → \"ZY\"",
    "value": {
      "columnNumber": 701
    }
  },
  {
    "id": "ex4",
    "label": "26 → \"Z\"",
    "value": {
      "columnNumber": 26
    }
  },
  {
    "id": "ex5",
    "label": "52 → \"AZ\"",
    "value": {
      "columnNumber": 52
    }
  }
];

function generateExcelSheetColumnTitleSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.columnNumber,r=t,l=new StepRecorder({n:t,columnNumber:r,result:"",reg:r,regChanged:!1,exprParts:[],phase:"loop"}),i=e=>l.update_variable("exprParts",e),a=(e,t)=>{l.update_variable("reg",e),l.update_variable("regChanged",t)};i([{t:`Convert column ${t} to its Excel title`,c:"muted"}]),l.record("-",`Start: convert column number ${t} to an Excel title`),i([{t:'result = ""',c:"muted"}]),l.record("init_result","Initialize an empty result");let o=[],s=(e,t,r)=>{o.forEach((n,i)=>{l.update_visual(`digit_${i}`,{type:"arrayElement",value:n.char,position:r?r[i]:i,label:String(n.rem),...t?{state:"sorted"}:e===i?{state:"active"}:{}})})};for(;r>0;){a(r,!1),i([{t:"columnNumber ",c:"muted"},{t:`${r}`,c:"cyan"},{t:" > 0",c:"muted"}]),l.add_conditional("while_check",!0),l.record("while_check",`columnNumber = ${r} > 0, enter loop`);let e=r;r--,l.update_variable("columnNumber",r),a(r,!0),i([{t:`${e} − 1 = `,c:"muted"},{t:`${r}`,c:"cyan"},{t:"   (shift to 0-indexed)",c:"muted"}]),l.record("decrement",`Decrement: ${e} − 1 = ${r}`);let t=r%26;l.update_variable("remainder",t),a(r,!1),i([{t:`${r} mod 26 = `,c:"muted"},{t:`${t}`,c:"yellow"}]),l.record("compute_remainder",`remainder = ${r} mod 26 = ${t}`);let n=String.fromCharCode(65+t);l.update_variable("char",n),o.push({char:n,rem:t}),l.update_variable("result",o.map(e=>e.char).join("")),s(o.length-1,!1),i([{t:"'A' + ",c:"muted"},{t:`${t}`,c:"yellow"},{t:" = ",c:"muted"},{t:`'${n}'`,c:"green"}]),l.record("append_char",`Append 'A' + ${t} = '${n}'`);let u=r;r=Math.floor(r/26),l.update_variable("columnNumber",r),a(r,!0),s(null,!1),i([{t:`${u} \xf7 26 = `,c:"muted"},{t:`${r}`,c:"cyan"},{t:"   (next digit)",c:"muted"}]),l.record("divide",`columnNumber = ${u} \xf7 26 = ${r}`)}a(0,!1),i([{t:"columnNumber ",c:"muted"},{t:"0",c:"cyan"},{t:" = 0, stop",c:"muted"}]),l.add_conditional("while_check",!1),l.record("while_check","columnNumber = 0, exit loop");let u=[...o].reverse().map(e=>e.char).join(""),c=o.map((e,t)=>o.length-1-t);return l.update_variable("result",u),l.update_variable("phase","reverse"),s(null,!0,c),i([{t:"reverse  →  ",c:"muted"},{t:`"${u}"`,c:"green"}]),l.record("reverse",`Reverse the digits: "${u}"`),l.update_variable("phase","done"),l.update_variable("done",!0),i([]),l.record("complete",`Return "${u}"`),l.getSteps()
  })(__inputArg);
}

export function ExcelSheetColumnTitleProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ExcelSheetColumnTitleTemplates,
      generateSteps: (e: any) => {
        const recorded = generateExcelSheetColumnTitleSteps(e) as any[];
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
      title="Excel Sheet Column Title"
      slug="excel-sheet-column-title"
      approaches={approaches}
      presets={ExcelSheetColumnTitlePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Greatest Common Divisor of Strings (greatest-common-divisor-of-strings)
// ==========================================

const GreatestCommonDivisorOfStringsTemplates = {
  "python": {
    "language": "python",
    "code": "def gcd_of_strings(str1, str2):\n    if str1 + str2 != str2 + str1:\n        return \"\"\n\n    from math import gcd\n    gcd_len = gcd(len(str1), len(str2))\n    return str1[:gcd_len]",
    "lineMap": {
      "-": [
        1
      ],
      "concat_check": [
        2
      ],
      "return_empty": [
        3
      ],
      "init_gcd": [
        5,
        6
      ],
      "gcd_step": [
        6
      ],
      "gcd_loop": [
        6
      ],
      "gcd_result": [
        6
      ],
      "extract_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "concat_check": [
        2
      ],
      "gcd_loop": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String gcdOfStrings(String str1, String str2) {\n        if (!(str1 + str2).equals(str2 + str1)) {\n            return \"\";\n        }\n\n        int gcdLen = gcd(str1.length(), str2.length());\n        return str1.substring(0, gcdLen);\n    }\n\n    private int gcd(int a, int b) {\n        while (b != 0) {\n            int temp = b;\n            b = a % b;\n            a = temp;\n        }\n        return a;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "concat_check": [
        3
      ],
      "return_empty": [
        4
      ],
      "init_gcd": [
        7
      ],
      "gcd_step": [
        12,
        13,
        14,
        15
      ],
      "gcd_loop": [
        12
      ],
      "gcd_result": [
        17
      ],
      "extract_result": [
        8
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "concat_check": [
        3
      ],
      "gcd_loop": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string gcdOfStrings(string str1, string str2) {\n        if (str1 + str2 != str2 + str1) {\n            return \"\";\n        }\n\n        int gcdLen = gcd(str1.size(), str2.size());\n        return str1.substr(0, gcdLen);\n    }\n\n    int gcd(int a, int b) {\n        while (b != 0) {\n            int temp = b;\n            b = a % b;\n            a = temp;\n        }\n        return a;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "concat_check": [
        4
      ],
      "return_empty": [
        5
      ],
      "init_gcd": [
        8
      ],
      "gcd_step": [
        13,
        14,
        15,
        16
      ],
      "gcd_loop": [
        13
      ],
      "gcd_result": [
        18
      ],
      "extract_result": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "concat_check": [
        4
      ],
      "gcd_loop": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string GcdOfStrings(string str1, string str2) {\n        if (str1 + str2 != str2 + str1) {\n            return \"\";\n        }\n\n        int gcdLen = Gcd(str1.Length, str2.Length);\n        return str1.Substring(0, gcdLen);\n    }\n\n    private int Gcd(int a, int b) {\n        while (b != 0) {\n            int temp = b;\n            b = a % b;\n            a = temp;\n        }\n        return a;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "concat_check": [
        3
      ],
      "return_empty": [
        4
      ],
      "init_gcd": [
        7
      ],
      "gcd_step": [
        12,
        13,
        14,
        15
      ],
      "gcd_loop": [
        12
      ],
      "gcd_result": [
        17
      ],
      "extract_result": [
        8
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "concat_check": [
        3
      ],
      "gcd_loop": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func gcdOfStrings(str1 string, str2 string) string {\n    if str1 + str2 != str2 + str1 {\n        return \"\"\n    }\n\n    gcdLen := gcd(len(str1), len(str2))\n    return str1[:gcdLen]\n}\n\nfunc gcd(a, b int) int {\n    for b != 0 {\n        a, b = b, a % b\n    }\n    return a\n}",
    "lineMap": {
      "-": [
        1
      ],
      "concat_check": [
        2
      ],
      "return_empty": [
        3
      ],
      "init_gcd": [
        6
      ],
      "gcd_step": [
        11,
        12
      ],
      "gcd_loop": [
        11
      ],
      "gcd_result": [
        14
      ],
      "extract_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "concat_check": [
        2
      ],
      "gcd_loop": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function gcdOfStrings(str1, str2) {\n    if (str1 + str2 !== str2 + str1) {\n        return \"\";\n    }\n\n    function gcd(a, b) {\n        while (b !== 0) {\n            [a, b] = [b, a % b];\n        }\n        return a;\n    }\n\n    const gcdLen = gcd(str1.length, str2.length);\n    return str1.substring(0, gcdLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "concat_check": [
        2
      ],
      "return_empty": [
        3
      ],
      "init_gcd": [
        13
      ],
      "gcd_step": [
        7,
        8
      ],
      "gcd_loop": [
        7
      ],
      "gcd_result": [
        10
      ],
      "extract_result": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "concat_check": [
        2
      ],
      "gcd_loop": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function gcdOfStrings(str1: string, str2: string): string {\n    if (str1 + str2 !== str2 + str1) {\n        return \"\";\n    }\n\n    function gcd(a: number, b: number): number {\n        while (b !== 0) {\n            [a, b] = [b, a % b];\n        }\n        return a;\n    }\n\n    const gcdLen = gcd(str1.length, str2.length);\n    return str1.substring(0, gcdLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "concat_check": [
        2
      ],
      "return_empty": [
        3
      ],
      "init_gcd": [
        13
      ],
      "gcd_step": [
        7,
        8
      ],
      "gcd_loop": [
        7
      ],
      "gcd_result": [
        10
      ],
      "extract_result": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "concat_check": [
        2
      ],
      "gcd_loop": [
        7
      ]
    }
  }
};

const GreatestCommonDivisorOfStringsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "str1": "ABCABC",
      "str2": "ABC"
    }
  },
  {
    "id": "ex2",
    "label": "Longer GCD",
    "value": {
      "str1": "ABABAB",
      "str2": "ABAB"
    }
  },
  {
    "id": "ex3",
    "label": "No GCD",
    "value": {
      "str1": "LEET",
      "str2": "CODE"
    }
  },
  {
    "id": "ex4",
    "label": "Single Char",
    "value": {
      "str1": "AAAAAA",
      "str2": "AAA"
    }
  },
  {
    "id": "ex5",
    "label": "Equal",
    "value": {
      "str1": "ABC",
      "str2": "ABC"
    }
  }
];

function generateGreatestCommonDivisorOfStringsSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let{str1:t,str2:r}=e,l=new StepRecorder({str1:t,str2:r,phase:"intro",exprParts:[]}),i=e=>l.update_variable("exprParts",e),s=(e,t,r)=>{for(let n=0;n<t.length;n++){let i=r?.(n);l.update_visual(`${e}_${n}`,{type:"arrayElement",value:t[n],position:n,...i?{state:i}:{}})}},a=(e,t)=>{for(let r=0;r<t;r++)l.delete_visual(`${e}_${r}`)};s("s1",t),s("s2",r),i([{t:"A divisor string must tile both str1 and str2",c:"muted"}]),l.record("-",`Start: find the GCD string of "${t}" and "${r}"`);let o=t+r,c=r+t,d=o===c,u=-1;for(let e=0;e<o.length;e++)if(o[e]!==c[e]){u=e;break}a("s1",t.length),a("s2",r.length);let g=e=>o[e]===c[e]?"match":"mismatch";if(s("c1",o,g),s("c2",c,g),l.update_variable("phase","concat"),l.update_variable("concatEqual",d),l.update_variable("mismatchIdx",u),l.add_conditional("concat_check",!d),i(d?[{t:"str1+str2 = str2+str1  →  a divisor exists",c:"green"}]:[{t:"str1+str2 ≠ str2+str1  →  no divisor",c:"red"}]),l.record("concat_check",d?"str1 + str2 = str2 + str1, a common divisor string exists":"str1 + str2 ≠ str2 + str1, no common divisor exists"),!d)return l.update_variable("result",""),l.update_variable("done",!0),i([{t:'return ""',c:"red"}]),l.record("return_empty",'Return ""'),l.record("complete",'No GCD string exists, return ""'),l.getSteps();a("c1",o.length),a("c2",c.length),s("s1",t),s("s2",r);let h=t.length,f=r.length;for(l.update_variable("phase","gcd"),l.update_variable("a",h),l.update_variable("b",f),i([{t:`gcd(len1, len2) = gcd(${h}, ${f})`,c:"muted"}]),l.record("init_gcd",`Divisor length = gcd(${h}, ${f})`);0!==f;){l.add_conditional("gcd_loop",!0);let e=h,t=f,r=f;f=h%f,h=r,l.update_variable("a",h),l.update_variable("b",f),i([{t:`${e} mod ${t} = `,c:"muted"},{t:`${e%t}`,c:"yellow"},{t:`   →   a=${h}, b=${f}`,c:"muted"}]),l.record("gcd_step",`${e} mod ${t} = ${e%t}  (a=${h}, b=${f})`)}l.add_conditional("gcd_loop",!1);let p=h;l.update_variable("gcdLen",p),i([{t:"b = 0  →  gcd = ",c:"muted"},{t:`${p}`,c:"green"}]),l.record("gcd_result",`b = 0, so the divisor length = ${p}`);let x=t.substring(0,p),m=t.length/p,b=r.length/p,v=e=>e<p?"sorted":void 0;return s("s1",t,v),s("s2",r,v),l.update_variable("phase","extract"),l.update_variable("result",x),l.update_variable("k1",m),l.update_variable("k2",b),i([]),l.record("extract_result",`Take str1[0..${p-1}] = "${x}"`),l.update_variable("done",!0),l.record("complete",`Return "${x}"`),l.getSteps()
  })(__inputArg);
}

export function GreatestCommonDivisorOfStringsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: GreatestCommonDivisorOfStringsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateGreatestCommonDivisorOfStringsSteps(e) as any[];
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
      title="Greatest Common Divisor of Strings"
      slug="greatest-common-divisor-of-strings"
      approaches={approaches}
      presets={GreatestCommonDivisorOfStringsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Ugly Number (ugly-number)
// ==========================================

const UglyNumberTemplates = {
  "python": {
    "language": "python",
    "code": "def is_ugly(n):\n    if n <= 0:\n        return False\n    for factor in [2, 3, 5]:\n        while n % factor == 0:\n            n //= factor\n    return n == 1",
    "lineMap": {
      "-": [
        1
      ],
      "check_non_positive": [
        2,
        3
      ],
      "for_factor": [
        4
      ],
      "divide": [
        5,
        6
      ],
      "factor_done": [
        5
      ],
      "check_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "check_non_positive": [
        2
      ],
      "while_divisible": [
        5
      ],
      "check_result": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean isUgly(int n) {\n        if (n <= 0) return false;\n        int[] factors = {2, 3, 5};\n        for (int factor : factors) {\n            while (n % factor == 0) {\n                n /= factor;\n            }\n        }\n        return n == 1;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_non_positive": [
        3
      ],
      "for_factor": [
        5
      ],
      "divide": [
        6,
        7
      ],
      "factor_done": [
        6
      ],
      "check_result": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "check_non_positive": [
        3
      ],
      "while_divisible": [
        6
      ],
      "check_result": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool isUgly(int n) {\n        if (n <= 0) return false;\n        int factors[] = {2, 3, 5};\n        for (int factor : factors) {\n            while (n % factor == 0) {\n                n /= factor;\n            }\n        }\n        return n == 1;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "check_non_positive": [
        4
      ],
      "for_factor": [
        6
      ],
      "divide": [
        7,
        8
      ],
      "factor_done": [
        7
      ],
      "check_result": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_non_positive": [
        4
      ],
      "while_divisible": [
        7
      ],
      "check_result": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool IsUgly(int n) {\n        if (n <= 0) return false;\n        int[] factors = {2, 3, 5};\n        foreach (int factor in factors) {\n            while (n % factor == 0) {\n                n /= factor;\n            }\n        }\n        return n == 1;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_non_positive": [
        3
      ],
      "for_factor": [
        5
      ],
      "divide": [
        6,
        7
      ],
      "factor_done": [
        6
      ],
      "check_result": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "check_non_positive": [
        3
      ],
      "while_divisible": [
        6
      ],
      "check_result": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isUgly(n int) bool {\n    if n <= 0 {\n        return false\n    }\n    factors := []int{2, 3, 5}\n    for _, factor := range factors {\n        for n % factor == 0 {\n            n /= factor\n        }\n    }\n    return n == 1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_non_positive": [
        2,
        3
      ],
      "for_factor": [
        6
      ],
      "divide": [
        7,
        8
      ],
      "factor_done": [
        7
      ],
      "check_result": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_non_positive": [
        2
      ],
      "while_divisible": [
        7
      ],
      "check_result": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isUgly(n) {\n    if (n <= 0) return false;\n    const factors = [2, 3, 5];\n    for (const factor of factors) {\n        while (n % factor === 0) {\n            n /= factor;\n        }\n    }\n    return n === 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_non_positive": [
        2
      ],
      "for_factor": [
        4
      ],
      "divide": [
        5,
        6
      ],
      "factor_done": [
        5
      ],
      "check_result": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "check_non_positive": [
        2
      ],
      "while_divisible": [
        5
      ],
      "check_result": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isUgly(n: number): boolean {\n    if (n <= 0) return false;\n    const factors = [2, 3, 5];\n    for (const factor of factors) {\n        while (n % factor === 0) {\n            n /= factor;\n        }\n    }\n    return n === 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_non_positive": [
        2
      ],
      "for_factor": [
        4
      ],
      "divide": [
        5,
        6
      ],
      "factor_done": [
        5
      ],
      "check_result": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "check_non_positive": [
        2
      ],
      "while_divisible": [
        5
      ],
      "check_result": [
        9
      ]
    }
  }
};

const UglyNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Simple Ugly",
    "value": {
      "n": 6
    }
  },
  {
    "id": "ex2",
    "label": "Power of 2",
    "value": {
      "n": 8
    }
  },
  {
    "id": "ex3",
    "label": "Not Ugly",
    "value": {
      "n": 14
    }
  },
  {
    "id": "ex4",
    "label": "One",
    "value": {
      "n": 1
    }
  },
  {
    "id": "ex5",
    "label": "All Factors",
    "value": {
      "n": 30
    }
  }
];

function generateUglyNumberSteps(__inputArg: any): any[] {
  let i=[2,3,5];
  return (function(e: any) {
let t=e.n,n=t,l=new StepRecorder({n:t,originalN:n,peeled:[],exprParts:[]}),o=e=>l.update_variable("exprParts",e),a=e=>{i.forEach((t,n)=>{l.update_visual(`factor_${n}`,{type:"arrayElement",value:t,position:n,...null!==e&&n===e?{state:"active"}:null!==e&&n<e?{state:"done"}:{}})})},s=[],c=(e,t)=>l.update_visual("rem",{type:"arrayElement",value:e,position:s.length,state:t});if(a(null),c(t,"active"),o([{t:"Ugly numbers factor into only 2, 3, and 5",c:"muted"}]),l.record("-",`Start: is n = ${n} an ugly number?`),l.add_conditional("check_non_positive",t<=0),t<=0)return l.update_variable("nonPositive",!0),l.update_variable("done",!0),l.update_variable("isUgly",!1),c(t,"error"),o([{t:`n = ${t} ≤ 0  →  not ugly`,c:"red"}]),l.record("check_non_positive",`n = ${t} ≤ 0, return false`),l.record("complete",`${n} is not positive, not ugly`),l.getSteps();o([{t:`n = ${t} > 0`,c:"muted"}]),l.record("check_non_positive",`n = ${t} > 0, continue`);for(let e=0;e<i.length;e++){let n=i[e];for(l.update_variable("factor",n),l.update_variable("factorIdx",e),a(e),l.update_visual("ptr_factor",{type:"pointer",position:e,label:"factor"}),o([{t:"try factor ",c:"muted"},{t:`${n}`,c:"cyan"}]),l.record("for_factor",`Try dividing by ${n}`);t%n==0;){let e=t;t/=n,s.push(n),l.update_variable("n",t),l.update_variable("peeled",[...s]),l.update_visual(`peel_${s.length-1}`,{type:"arrayElement",value:n,position:s.length-1,state:"sorted"}),c(t,"active"),l.add_conditional("while_divisible",!0),o([{t:`${e} \xf7 ${n} = `,c:"muted"},{t:`${t}`,c:"cyan"}]),l.record("divide",`${e} \xf7 ${n} = ${t}`)}l.add_conditional("while_divisible",!1),l.update_visual(`factor_${e}`,{type:"arrayElement",value:n,position:e,state:"done"}),o([{t:`${t}`,c:"plain"},{t:` not divisible by ${n}`,c:"muted"}]),l.record("factor_done",`${t} is not divisible by ${n}`)}l.delete_visual("ptr_factor");let u=1===t;return l.add_conditional("check_result",u),l.update_variable("isUgly",u),u&&s.length>0?l.delete_visual("rem"):c(t,u?"sorted":"error"),o(u?[{t:"n = 1  →  only 2, 3, 5 as factors",c:"green"}]:[{t:`n = ${t} ≠ 1  →  `,c:"muted"},{t:`${t}`,c:"red"},{t:" is a forbidden prime factor",c:"muted"}]),l.record("check_result",`n = ${t}, return ${u}`),l.update_variable("done",!0),l.record("complete",u?`${n} is an ugly number`:`${n} is not an ugly number`),l.getSteps()
  })(__inputArg);
}

export function UglyNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: UglyNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateUglyNumberSteps(e) as any[];
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
      title="Ugly Number"
      slug="ugly-number"
      approaches={approaches}
      presets={UglyNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Ugly Number II (ugly-number-ii)
// ==========================================

const UglyNumberIiTemplates = {
  "python": {
    "language": "python",
    "code": "def nthUglyNumber(n):\n    ugly = [0] * n\n    ugly[0] = 1\n    i2 = i3 = i5 = 0\n    for i in range(1, n):\n        next2 = ugly[i2] * 2\n        next3 = ugly[i3] * 3\n        next5 = ugly[i5] * 5\n        ugly[i] = min(next2, next3, next5)\n        if ugly[i] == next2: i2 += 1\n        if ugly[i] == next3: i3 += 1\n        if ugly[i] == next5: i5 += 1\n    return ugly[n - 1]",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "compute_candidates": [
        6,
        7,
        8
      ],
      "set_min": [
        9
      ],
      "advance_pointers": [
        10,
        11,
        12
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "advance_i2": [
        10
      ],
      "advance_i3": [
        11
      ],
      "advance_i5": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int nthUglyNumber(int n) {\n        int[] ugly = new int[n];\n        ugly[0] = 1;\n        int i2 = 0, i3 = 0, i5 = 0;\n        for (int i = 1; i < n; i++) {\n            int next2 = ugly[i2] * 2;\n            int next3 = ugly[i3] * 3;\n            int next5 = ugly[i5] * 5;\n            ugly[i] = Math.min(next2, Math.min(next3, next5));\n            if (ugly[i] == next2) i2++;\n            if (ugly[i] == next3) i3++;\n            if (ugly[i] == next5) i5++;\n        }\n        return ugly[n - 1];\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "compute_candidates": [
        7,
        8,
        9
      ],
      "set_min": [
        10
      ],
      "advance_pointers": [
        11,
        12,
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "advance_i2": [
        11
      ],
      "advance_i3": [
        12
      ],
      "advance_i5": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int nthUglyNumber(int n) {\n        vector<int> ugly(n);\n        ugly[0] = 1;\n        int i2 = 0, i3 = 0, i5 = 0;\n        for (int i = 1; i < n; i++) {\n            int next2 = ugly[i2] * 2;\n            int next3 = ugly[i3] * 3;\n            int next5 = ugly[i5] * 5;\n            ugly[i] = min({next2, next3, next5});\n            if (ugly[i] == next2) i2++;\n            if (ugly[i] == next3) i3++;\n            if (ugly[i] == next5) i5++;\n        }\n        return ugly[n - 1];\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4,
        5,
        6
      ],
      "compute_candidates": [
        8,
        9,
        10
      ],
      "set_min": [
        11
      ],
      "advance_pointers": [
        12,
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "advance_i2": [
        12
      ],
      "advance_i3": [
        13
      ],
      "advance_i5": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int NthUglyNumber(int n) {\n        int[] ugly = new int[n];\n        ugly[0] = 1;\n        int i2 = 0, i3 = 0, i5 = 0;\n        for (int i = 1; i < n; i++) {\n            int next2 = ugly[i2] * 2;\n            int next3 = ugly[i3] * 3;\n            int next5 = ugly[i5] * 5;\n            ugly[i] = Math.Min(next2, Math.Min(next3, next5));\n            if (ugly[i] == next2) i2++;\n            if (ugly[i] == next3) i3++;\n            if (ugly[i] == next5) i5++;\n        }\n        return ugly[n - 1];\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "compute_candidates": [
        7,
        8,
        9
      ],
      "set_min": [
        10
      ],
      "advance_pointers": [
        11,
        12,
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "advance_i2": [
        11
      ],
      "advance_i3": [
        12
      ],
      "advance_i5": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func nthUglyNumber(n int) int {\n    ugly := make([]int, n)\n    ugly[0] = 1\n    i2, i3, i5 := 0, 0, 0\n    for i := 1; i < n; i++ {\n        next2 := ugly[i2] * 2\n        next3 := ugly[i3] * 3\n        next5 := ugly[i5] * 5\n        ugly[i] = min(next2, min(next3, next5))\n        if ugly[i] == next2 { i2++ }\n        if ugly[i] == next3 { i3++ }\n        if ugly[i] == next5 { i5++ }\n    }\n    return ugly[n-1]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "compute_candidates": [
        6,
        7,
        8
      ],
      "set_min": [
        9
      ],
      "advance_pointers": [
        10,
        11,
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "advance_i2": [
        10
      ],
      "advance_i3": [
        11
      ],
      "advance_i5": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function nthUglyNumber(n) {\n    const ugly = new Array(n).fill(0);\n    ugly[0] = 1;\n    let i2 = 0, i3 = 0, i5 = 0;\n    for (let i = 1; i < n; i++) {\n        const next2 = ugly[i2] * 2;\n        const next3 = ugly[i3] * 3;\n        const next5 = ugly[i5] * 5;\n        ugly[i] = Math.min(next2, next3, next5);\n        if (ugly[i] === next2) i2++;\n        if (ugly[i] === next3) i3++;\n        if (ugly[i] === next5) i5++;\n    }\n    return ugly[n - 1];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "compute_candidates": [
        6,
        7,
        8
      ],
      "set_min": [
        9
      ],
      "advance_pointers": [
        10,
        11,
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "advance_i2": [
        10
      ],
      "advance_i3": [
        11
      ],
      "advance_i5": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function nthUglyNumber(n: number): number {\n    const ugly: number[] = new Array(n).fill(0);\n    ugly[0] = 1;\n    let i2 = 0, i3 = 0, i5 = 0;\n    for (let i = 1; i < n; i++) {\n        const next2 = ugly[i2] * 2;\n        const next3 = ugly[i3] * 3;\n        const next5 = ugly[i5] * 5;\n        ugly[i] = Math.min(next2, next3, next5);\n        if (ugly[i] === next2) i2++;\n        if (ugly[i] === next3) i3++;\n        if (ugly[i] === next5) i5++;\n    }\n    return ugly[n - 1];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "compute_candidates": [
        6,
        7,
        8
      ],
      "set_min": [
        9
      ],
      "advance_pointers": [
        10,
        11,
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "advance_i2": [
        10
      ],
      "advance_i3": [
        11
      ],
      "advance_i5": [
        12
      ]
    }
  }
};

const UglyNumberIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "n": 10
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "Medium",
    "value": {
      "n": 15
    }
  },
  {
    "id": "ex4",
    "label": "Seven",
    "value": {
      "n": 7
    }
  }
];

function generateUglyNumberIiSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.n,n=Array(t).fill(0);n[0]=1;let l=0,r=0,a=0,o=new StepRecorder({n:t,i2:l,i3:r,i5:a,phase:"init"},{arr_0:{type:"arrayElement",value:1,position:0,state:"filled"},ptr_i2:{type:"pointer",position:0,label:"i2"},ptr_i3:{type:"pointer",position:0,label:"i3"},ptr_i5:{type:"pointer",position:0,label:"i5"}}),s=(e,t,n,i,l,r)=>{o.update_variable("src2",e),o.update_variable("src3",t),o.update_variable("src5",n),o.update_variable("next2",2*e),o.update_variable("next3",3*t),o.update_variable("next5",5*n),o.update_variable("minVal",i),o.update_variable("showMin",l),o.update_variable("winners",r)},u=()=>{["src2","src3","src5","next2","next3","next5","minVal","showMin","winners"].forEach(e=>o.delete_variable(e))};o.record("-",`Start: find the ${t}th ugly number`),u(),o.record("init","ugly[0] = 1, and i2 = i3 = i5 = 0");for(let e=1;e<t;e++){o.update_variable("i",e);let t=n[l],i=n[r],u=n[a],c=2*t,d=3*i,g=5*u;o.update_variable("phase","compute"),s(t,i,u,null,!1,[]),o.record("compute_candidates",`Candidates: ${t}x2=${c}, ${i}x3=${d}, ${u}x5=${g}`);let h=Math.min(c,d,g);n[e]=h;let f=[];h===c&&f.push("2"),h===d&&f.push("3"),h===g&&f.push("5"),o.update_variable("phase","min"),s(t,i,u,h,!0,f),o.update_visual(`arr_${e}`,{type:"arrayElement",value:h,position:e,state:"new"}),o.record("set_min",`ugly[${e}] = min(${c}, ${d}, ${g}) = ${h}`),o.add_conditional("advance_i2",h===c),o.add_conditional("advance_i3",h===d),o.add_conditional("advance_i5",h===g),h===c&&l++,h===d&&r++,h===g&&a++,o.update_variable("i2",l),o.update_variable("i3",r),o.update_variable("i5",a),o.update_visual("ptr_i2",{type:"pointer",position:l,label:"i2"}),o.update_visual("ptr_i3",{type:"pointer",position:r,label:"i3"}),o.update_visual("ptr_i5",{type:"pointer",position:a,label:"i5"}),o.update_visual(`arr_${e}`,{type:"arrayElement",value:h,position:e,state:"filled"}),o.update_variable("phase","advance"),s(t,i,u,h,!0,f);let p=f.map(e=>`i${e}`).join(", ");o.record("advance_pointers",`${h} came from ${f.map(e=>`x${e}`).join(", ")}, advance ${p}`)}return u(),o.update_variable("phase","done"),o.update_variable("done",!0),o.update_variable("answer",n[t-1]),o.delete_visual("ptr_i2"),o.delete_visual("ptr_i3"),o.delete_visual("ptr_i5"),o.update_visual(`arr_${t-1}`,{type:"arrayElement",value:n[t-1],position:t-1,state:"result"}),o.record("complete",`The ${t}th ugly number is ${n[t-1]}`),o.getSteps()
  })(__inputArg);
}

export function UglyNumberIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: UglyNumberIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateUglyNumberIiSteps(e) as any[];
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
      title="Ugly Number II"
      slug="ugly-number-ii"
      approaches={approaches}
      presets={UglyNumberIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find the Winner of the Circular Game (find-the-winner-of-the-circular-game)
// ==========================================

const FindTheWinnerOfTheCircularGameTemplates = {
  "python": {
    "language": "python",
    "code": "def findTheWinner(n, k):\n    winner = 0  # Base case: J(1) = 0\n\n    # Build up from circle of size 2 to size n\n    for i in range(2, n + 1):\n        winner = (winner + k) % i\n\n    # Convert from 0-indexed to 1-indexed\n    return winner + 1",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        5
      ],
      "calc_winner": [
        6
      ],
      "update_winner": [
        6
      ],
      "convert_result": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public int findTheWinner(int n, int k) {\n    int winner = 0; // Base case: J(1) = 0\n\n    // Build up from circle of size 2 to size n\n    for (int i = 2; i <= n; i++) {\n        winner = (winner + k) % i;\n    }\n\n    // Convert from 0-indexed to 1-indexed\n    return winner + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        5
      ],
      "calc_winner": [
        6
      ],
      "update_winner": [
        6
      ],
      "convert_result": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "int findTheWinner(int n, int k) {\n    int winner = 0; // Base case: J(1) = 0\n\n    // Build up from circle of size 2 to size n\n    for (int i = 2; i <= n; i++) {\n        winner = (winner + k) % i;\n    }\n\n    // Convert from 0-indexed to 1-indexed\n    return winner + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        5
      ],
      "calc_winner": [
        6
      ],
      "update_winner": [
        6
      ],
      "convert_result": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindTheWinner(int n, int k) {\n    int winner = 0; // Base case: J(1) = 0\n\n    // Build up from circle of size 2 to size n\n    for (int i = 2; i <= n; i++) {\n        winner = (winner + k) % i;\n    }\n\n    // Convert from 0-indexed to 1-indexed\n    return winner + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        5
      ],
      "calc_winner": [
        6
      ],
      "update_winner": [
        6
      ],
      "convert_result": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func findTheWinner(n int, k int) int {\n    winner := 0 // Base case: J(1) = 0\n\n    // Build up from circle of size 2 to size n\n    for i := 2; i <= n; i++ {\n        winner = (winner + k) % i\n    }\n\n    // Convert from 0-indexed to 1-indexed\n    return winner + 1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        5
      ],
      "calc_winner": [
        6
      ],
      "update_winner": [
        6
      ],
      "convert_result": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var findTheWinner = function(n, k) {\n    var winner = 0; // Base case: J(1) = 0\n\n    // Build up from circle of size 2 to size n\n    for (var i = 2; i <= n; i++) {\n        winner = (winner + k) % i;\n    }\n\n    // Convert from 0-indexed to 1-indexed\n    return winner + 1;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        5
      ],
      "calc_winner": [
        6
      ],
      "update_winner": [
        6
      ],
      "convert_result": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function findTheWinner(n: number, k: number): number {\n    let winner = 0; // Base case: J(1) = 0\n\n    // Build up from circle of size 2 to size n\n    for (let i = 2; i <= n; i++) {\n        winner = (winner + k) % i;\n    }\n\n    // Convert from 0-indexed to 1-indexed\n    return winner + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "loop": [
        5
      ],
      "calc_winner": [
        6
      ],
      "update_winner": [
        6
      ],
      "convert_result": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  }
};

const FindTheWinnerOfTheCircularGamePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "n": 5,
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "n": 3,
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "Larger",
    "value": {
      "n": 6,
      "k": 3
    }
  }
];

function generateFindTheWinnerOfTheCircularGameSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let n=e.n,t=e.k,r=new StepRecorder({n,k:t},{}),l=Array.from({length:n},(e,n)=>n),a=[],s=e=>{for(let[i,s]of(r.update_variable("n",n),r.update_variable("k",t),r.update_variable("aliveSeats",[...l]),r.update_variable("eliminated",[...a]),Object.entries(e)))r.update_variable(i,s)},o=()=>{for(let e of["startSeat","victim","hopPath"])r.delete_variable(e)};o(),s({}),r.record("-",`Start: ${n} friends sit in a circle, counting ${t} each round.`);let c=0;for(;l.length>1;){let e=l.length,n=l[c],i=(c+t-1)%e,o=l[i],d=[];for(let n=0;n<t;n++)d.push(l[(c+n)%e]);s({startSeat:n,victim:o,hopPath:d}),r.record("count",`Count ${t} from friend ${n+1}: friend ${o+1} is out.`),l.splice(i,1),a.push(o),c=l.length>0?i%l.length:0,s({victim:o,hopPath:d}),r.record("eliminate",`Remove friend ${o+1}; ${l.length} friend(s) left.`)}let d=l[0],u=d+1;return o(),s({winner:d,result:u}),r.record("winner",`One friend remains: friend ${u}, so that is the answer.`),s({winner:d,result:u}),r.record("complete",`Done! Friend ${u} wins the game.`),r.getSteps()
  })(__inputArg);
}

export function FindTheWinnerOfTheCircularGameProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindTheWinnerOfTheCircularGameTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindTheWinnerOfTheCircularGameSteps(e) as any[];
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
      title="Find the Winner of the Circular Game"
      slug="find-the-winner-of-the-circular-game"
      approaches={approaches}
      presets={FindTheWinnerOfTheCircularGamePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
