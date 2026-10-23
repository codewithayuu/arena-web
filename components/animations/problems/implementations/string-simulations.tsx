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
    if (item.type === "arrayElement" || item.type === "element" || item.type === "char") {
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
      parts.push(`${k} = [${val.join(", ")}]`);
    } else {
      parts.push(`${k} = ${val}`);
    }
  }
  return parts.join(", ");
}

// ==========================================
// Is Subsequence (is-subsequence)
// ==========================================

const IsSubsequenceTemplates = {
  "python": {
    "language": "python",
    "code": "def isSubsequence(s: str, t: str) -> bool:\n    # Initialize pointer for s\n    i = 0\n\n    # Traverse through t\n    for j in range(len(t)):\n        # If we found all characters in s\n        if i == len(s):\n            return True\n        # If characters match, move pointer in s\n        if s[i] == t[j]:\n            i += 1\n\n    # Check if we found all characters\n    return i == len(s)",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3
      ],
      "compare": [
        11
      ],
      "case_match": [
        12
      ],
      "case_no_match": [
        6
      ],
      "early_success": [
        9
      ],
      "check_complete": [
        15
      ],
      "subsequence_found": [
        15
      ],
      "not_subsequence": [
        15
      ]
    },
    "conditionalMap": {
      "early_success_check": [
        8
      ],
      "match_check": [
        11
      ],
      "final_check": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isSubsequence(String s, String t) {\n    // Initialize pointer for s\n    int i = 0;\n\n    // Traverse through t\n    for (int j = 0; j < t.length(); j++) {\n        // If we found all characters in s\n        if (i == s.length()) {\n            return true;\n        }\n        // If characters match, move pointer in s\n        if (s.charAt(i) == t.charAt(j)) {\n            i++;\n        }\n    }\n\n    // Check if we found all characters\n    return i == s.length();\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3
      ],
      "compare": [
        12
      ],
      "case_match": [
        13
      ],
      "case_no_match": [
        6
      ],
      "early_success": [
        9
      ],
      "check_complete": [
        18
      ],
      "subsequence_found": [
        18
      ],
      "not_subsequence": [
        18
      ]
    },
    "conditionalMap": {
      "early_success_check": [
        8
      ],
      "match_check": [
        12
      ],
      "final_check": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isSubsequence(string s, string t) {\n    // Initialize pointer for s\n    int i = 0;\n\n    // Traverse through t\n    for (int j = 0; j < t.length(); j++) {\n        // If we found all characters in s\n        if (i == s.length()) {\n            return true;\n        }\n        // If characters match, move pointer in s\n        if (s[i] == t[j]) {\n            i++;\n        }\n    }\n\n    // Check if we found all characters\n    return i == s.length();\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3
      ],
      "compare": [
        12
      ],
      "case_match": [
        13
      ],
      "case_no_match": [
        6
      ],
      "early_success": [
        9
      ],
      "check_complete": [
        18
      ],
      "subsequence_found": [
        18
      ],
      "not_subsequence": [
        18
      ]
    },
    "conditionalMap": {
      "early_success_check": [
        8
      ],
      "match_check": [
        12
      ],
      "final_check": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsSubsequence(string s, string t) {\n    // Initialize pointer for s\n    int i = 0;\n\n    // Traverse through t\n    for (int j = 0; j < t.Length; j++) {\n        // If we found all characters in s\n        if (i == s.Length) {\n            return true;\n        }\n        // If characters match, move pointer in s\n        if (s[i] == t[j]) {\n            i++;\n        }\n    }\n\n    // Check if we found all characters\n    return i == s.Length;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3
      ],
      "compare": [
        12
      ],
      "case_match": [
        13
      ],
      "case_no_match": [
        6
      ],
      "early_success": [
        9
      ],
      "check_complete": [
        18
      ],
      "subsequence_found": [
        18
      ],
      "not_subsequence": [
        18
      ]
    },
    "conditionalMap": {
      "early_success_check": [
        8
      ],
      "match_check": [
        12
      ],
      "final_check": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isSubsequence(s string, t string) bool {\n    // Initialize pointer for s\n    i := 0\n\n    // Traverse through t\n    for j := 0; j < len(t); j++ {\n        // If we found all characters in s\n        if i == len(s) {\n            return true\n        }\n        // If characters match, move pointer in s\n        if s[i] == t[j] {\n            i++\n        }\n    }\n\n    // Check if we found all characters\n    return i == len(s)\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3
      ],
      "compare": [
        12
      ],
      "case_match": [
        13
      ],
      "case_no_match": [
        6
      ],
      "early_success": [
        9
      ],
      "check_complete": [
        18
      ],
      "subsequence_found": [
        18
      ],
      "not_subsequence": [
        18
      ]
    },
    "conditionalMap": {
      "early_success_check": [
        8
      ],
      "match_check": [
        12
      ],
      "final_check": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var isSubsequence = function(s, t) {\n    // Initialize pointer for s\n    let i = 0;\n\n    // Traverse through t\n    for (let j = 0; j < t.length; j++) {\n        // If we found all characters in s\n        if (i === s.length) {\n            return true;\n        }\n        // If characters match, move pointer in s\n        if (s[i] === t[j]) {\n            i++;\n        }\n    }\n\n    // Check if we found all characters\n    return i === s.length;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3
      ],
      "compare": [
        12
      ],
      "case_match": [
        13
      ],
      "case_no_match": [
        6
      ],
      "early_success": [
        9
      ],
      "check_complete": [
        18
      ],
      "subsequence_found": [
        18
      ],
      "not_subsequence": [
        18
      ]
    },
    "conditionalMap": {
      "early_success_check": [
        8
      ],
      "match_check": [
        12
      ],
      "final_check": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isSubsequence(s: string, t: string): boolean {\n    // Initialize pointer for s\n    let i = 0;\n\n    // Traverse through t\n    for (let j = 0; j < t.length; j++) {\n        // If we found all characters in s\n        if (i === s.length) {\n            return true;\n        }\n        // If characters match, move pointer in s\n        if (s[i] === t[j]) {\n            i++;\n        }\n    }\n\n    // Check if we found all characters\n    return i === s.length;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3
      ],
      "compare": [
        12
      ],
      "case_match": [
        13
      ],
      "case_no_match": [
        6
      ],
      "early_success": [
        9
      ],
      "check_complete": [
        18
      ],
      "subsequence_found": [
        18
      ],
      "not_subsequence": [
        18
      ]
    },
    "conditionalMap": {
      "early_success_check": [
        8
      ],
      "match_check": [
        12
      ],
      "final_check": [
        18
      ]
    }
  }
};

const IsSubsequencePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "abc",
      "t": "ahbgdc"
    }
  },
  {
    "id": "ex2",
    "label": "No Match",
    "value": {
      "s": "axc",
      "t": "ahbgdc"
    }
  },
  {
    "id": "ex3",
    "label": "Empty s",
    "value": {
      "s": "",
      "t": "ahbgdc"
    }
  },
  {
    "id": "ex4",
    "label": "Exact Match",
    "value": {
      "s": "abc",
      "t": "abc"
    }
  }
];

function generateIsSubsequenceSteps(e: any): any[] {
  let t="string"==typeof e?.s?e.s:"",i="string"==typeof e?.t?e.t:"",r=t.length,a=i.length,s={};for(let e=0;e<r;e++)s[`s_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<a;e++)s[`t_${e}`]={type:"arrayElement",value:i[e],position:e};let l=new StepRecorder({s:t,t:i},s);l.record("start",`Start: check if s = "${t}" is a subsequence of t = "${i}"`);let o=0,c=0;if(l.add_new_variable("i",o),l.add_new_variable("j",c),r>0&&l.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),a>0&&l.add_new_visual("ptr_j",{type:"pointer",position:0,label:"j"}),l.record("initialize","Initialize two pointers: i = 0 scans s, j = 0 scans t"),0===r)return l.add_new_visual("verdict",{type:"metadata",value:!0}),a>0&&l.delete_visual("ptr_j"),l.record("subsequence_found","s is empty, and an empty string is a subsequence of any string, return true"),l.getSteps();for(;c<a;){if(o===r)return l.add_conditional("early_success_check",!0),l.add_new_visual("verdict",{type:"metadata",value:!0}),l.delete_visual("ptr_j"),l.record("early_success",`i = ${o} equals s.length, every character of s is matched, return true`),l.getSteps();l.add_conditional("early_success_check",!1),l.record("compare",`Compare s[${o}] = '${t[o]}' with t[${c}] = '${i[c]}'`);let e=t[o]===i[c];l.add_conditional("match_check",e),e?(l.update_visual(`s_${o}`,{type:"arrayElement",value:t[o],position:o,state:"matched"}),l.update_visual(`t_${c}`,{type:"arrayElement",value:i[c],position:c,state:"matched"}),l.add_new_visual(`connection_${o}_${c}`,{type:"range",start:o,end:c,label:"match"}),o++,c++,l.update_variable("i",o),l.update_variable("j",c),o<r?l.update_visual("ptr_i",{type:"pointer",position:o,label:"i"}):l.delete_visual("ptr_i"),c<a?l.update_visual("ptr_j",{type:"pointer",position:c,label:"j"}):l.delete_visual("ptr_j"),l.record("case_match",`Match! '${i[c-1]}' found, move both pointers: i = ${o}, j = ${c}`)):(l.update_visual(`t_${c}`,{type:"arrayElement",value:i[c],position:c,state:"unmatched"}),c++,l.update_variable("j",c),c<a?l.update_visual("ptr_j",{type:"pointer",position:c,label:"j"}):l.delete_visual("ptr_j"),l.record("case_no_match",`No match, '${t[o]}' != '${i[c-1]}', move only j = ${c}`))}l.record("check_complete",`Traversed all of t, check whether every character of s was matched: i = ${o}, s.length = ${r}`);let u=o===r;if(l.add_conditional("final_check",u),u)r>0&&l.delete_visual("ptr_i"),l.add_new_visual("verdict",{type:"metadata",value:!0}),l.record("subsequence_found","i equals s.length, every character of s appears in t in order, return true");else{for(let e=o;e<r;e++)l.update_visual(`s_${e}`,{type:"arrayElement",value:t[e],position:e,state:"failed"});l.delete_visual("ptr_i"),l.add_new_visual("verdict",{type:"metadata",value:!1}),l.record("not_subsequence",`Only ${o} of ${r} characters matched, s is not a subsequence of t, return false`)}return l.getSteps()
}

export function IsSubsequenceProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IsSubsequenceTemplates,
      generateSteps: (e: any) => {
        const recorded = generateIsSubsequenceSteps(e) as any[];
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
      title="Is Subsequence"
      slug="is-subsequence"
      approaches={approaches}
      presets={IsSubsequencePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Palindrome (valid-palindrome)
// ==========================================

const ValidPalindromeTemplates = {
  "python": {
    "language": "python",
    "code": "def isPalindrome(s: str) -> bool:\n    left = 0\n    right = len(s) - 1\n\n    while left < right:\n        # Skip non-alphanumeric characters from the left\n        if not s[left].isalnum():\n            left += 1\n            continue\n        # Skip non-alphanumeric characters from the right\n        if not s[right].isalnum():\n            right -= 1\n            continue\n\n        # Compare lowercase versions\n        if s[left].lower() != s[right].lower():\n            return False\n\n        left += 1\n        right -= 1\n\n    return True",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_left_char": [
        7
      ],
      "skip_left": [
        8,
        9
      ],
      "check_right_char": [
        11
      ],
      "skip_right": [
        12,
        13
      ],
      "compare_chars": [
        16
      ],
      "chars_mismatch": [
        17
      ],
      "not_palindrome": [
        17
      ],
      "chars_match": [
        19,
        20
      ],
      "palindrome_found": [
        22
      ]
    },
    "conditionalMap": {
      "is_alphanumeric_left": [
        7
      ],
      "is_alphanumeric_right": [
        11
      ],
      "chars_match": [
        16
      ],
      "final_result": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isPalindrome(String s) {\n    int left = 0;\n    int right = s.length() - 1;\n\n    while (left < right) {\n        // Skip non-alphanumeric characters from the left\n        if (!Character.isLetterOrDigit(s.charAt(left))) {\n            left++;\n            continue;\n        }\n        // Skip non-alphanumeric characters from the right\n        if (!Character.isLetterOrDigit(s.charAt(right))) {\n            right--;\n            continue;\n        }\n\n        // Compare lowercase versions\n        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {\n            return false;\n        }\n\n        left++;\n        right--;\n    }\n\n    return true;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_left_char": [
        7
      ],
      "skip_left": [
        8,
        9
      ],
      "check_right_char": [
        12
      ],
      "skip_right": [
        13,
        14
      ],
      "compare_chars": [
        18
      ],
      "chars_mismatch": [
        19
      ],
      "not_palindrome": [
        19
      ],
      "chars_match": [
        22,
        23
      ],
      "palindrome_found": [
        26
      ]
    },
    "conditionalMap": {
      "is_alphanumeric_left": [
        7
      ],
      "is_alphanumeric_right": [
        12
      ],
      "chars_match": [
        18
      ],
      "final_result": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isPalindrome(string s) {\n    int left = 0;\n    int right = s.length() - 1;\n\n    while (left < right) {\n        // Skip non-alphanumeric characters from the left\n        if (!isalnum(s[left])) {\n            left++;\n            continue;\n        }\n        // Skip non-alphanumeric characters from the right\n        if (!isalnum(s[right])) {\n            right--;\n            continue;\n        }\n\n        // Compare lowercase versions\n        if (tolower(s[left]) != tolower(s[right])) {\n            return false;\n        }\n\n        left++;\n        right--;\n    }\n\n    return true;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_left_char": [
        7
      ],
      "skip_left": [
        8,
        9
      ],
      "check_right_char": [
        12
      ],
      "skip_right": [
        13,
        14
      ],
      "compare_chars": [
        18
      ],
      "chars_mismatch": [
        19
      ],
      "not_palindrome": [
        19
      ],
      "chars_match": [
        22,
        23
      ],
      "palindrome_found": [
        26
      ]
    },
    "conditionalMap": {
      "is_alphanumeric_left": [
        7
      ],
      "is_alphanumeric_right": [
        12
      ],
      "chars_match": [
        18
      ],
      "final_result": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsPalindrome(string s) {\n    int left = 0;\n    int right = s.Length - 1;\n\n    while (left < right) {\n        // Skip non-alphanumeric characters from the left\n        if (!char.IsLetterOrDigit(s[left])) {\n            left++;\n            continue;\n        }\n        // Skip non-alphanumeric characters from the right\n        if (!char.IsLetterOrDigit(s[right])) {\n            right--;\n            continue;\n        }\n\n        // Compare lowercase versions\n        if (char.ToLower(s[left]) != char.ToLower(s[right])) {\n            return false;\n        }\n\n        left++;\n        right--;\n    }\n\n    return true;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_left_char": [
        7
      ],
      "skip_left": [
        8,
        9
      ],
      "check_right_char": [
        12
      ],
      "skip_right": [
        13,
        14
      ],
      "compare_chars": [
        18
      ],
      "chars_mismatch": [
        19
      ],
      "not_palindrome": [
        19
      ],
      "chars_match": [
        22,
        23
      ],
      "palindrome_found": [
        26
      ]
    },
    "conditionalMap": {
      "is_alphanumeric_left": [
        7
      ],
      "is_alphanumeric_right": [
        12
      ],
      "chars_match": [
        18
      ],
      "final_result": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isPalindrome(s string) bool {\n    left := 0\n    right := len(s) - 1\n\n    for left < right {\n        // Skip non-alphanumeric characters from the left\n        if !isAlphanumeric(s[left]) {\n            left++\n            continue\n        }\n        // Skip non-alphanumeric characters from the right\n        if !isAlphanumeric(s[right]) {\n            right--\n            continue\n        }\n\n        // Compare lowercase versions\n        if toLower(s[left]) != toLower(s[right]) {\n            return false\n        }\n\n        left++\n        right--\n    }\n\n    return true\n}\n\nfunc isAlphanumeric(b byte) bool {\n    return (b >= 'a' && b <= 'z') || (b >= 'A' && b <= 'Z') || (b >= '0' && b <= '9')\n}\n\nfunc toLower(b byte) byte {\n    if b >= 'A' && b <= 'Z' {\n        return b + 32\n    }\n    return b\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_left_char": [
        7
      ],
      "skip_left": [
        8,
        9
      ],
      "check_right_char": [
        12
      ],
      "skip_right": [
        13,
        14
      ],
      "compare_chars": [
        18
      ],
      "chars_mismatch": [
        19
      ],
      "not_palindrome": [
        19
      ],
      "chars_match": [
        22,
        23
      ],
      "palindrome_found": [
        26
      ]
    },
    "conditionalMap": {
      "is_alphanumeric_left": [
        7
      ],
      "is_alphanumeric_right": [
        12
      ],
      "chars_match": [
        18
      ],
      "final_result": [
        26
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var isPalindrome = function(s) {\n    let left = 0;\n    let right = s.length - 1;\n\n    while (left < right) {\n        // Skip non-alphanumeric characters from the left\n        if (!isAlphanumeric(s[left])) {\n            left++;\n            continue;\n        }\n        // Skip non-alphanumeric characters from the right\n        if (!isAlphanumeric(s[right])) {\n            right--;\n            continue;\n        }\n\n        // Compare lowercase versions\n        if (s[left].toLowerCase() !== s[right].toLowerCase()) {\n            return false;\n        }\n\n        left++;\n        right--;\n    }\n\n    return true;\n}\n\nfunction isAlphanumeric(char) {\n    return /[a-zA-Z0-9]/.test(char);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_left_char": [
        7
      ],
      "skip_left": [
        8,
        9
      ],
      "check_right_char": [
        12
      ],
      "skip_right": [
        13,
        14
      ],
      "compare_chars": [
        18
      ],
      "chars_mismatch": [
        19
      ],
      "not_palindrome": [
        19
      ],
      "chars_match": [
        22,
        23
      ],
      "palindrome_found": [
        26
      ]
    },
    "conditionalMap": {
      "is_alphanumeric_left": [
        7
      ],
      "is_alphanumeric_right": [
        12
      ],
      "chars_match": [
        18
      ],
      "final_result": [
        26
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isPalindrome(s: string): boolean {\n    let left = 0;\n    let right = s.length - 1;\n\n    while (left < right) {\n        // Skip non-alphanumeric characters from the left\n        if (!isAlphanumeric(s[left])) {\n            left++;\n            continue;\n        }\n        // Skip non-alphanumeric characters from the right\n        if (!isAlphanumeric(s[right])) {\n            right--;\n            continue;\n        }\n\n        // Compare lowercase versions\n        if (s[left].toLowerCase() !== s[right].toLowerCase()) {\n            return false;\n        }\n\n        left++;\n        right--;\n    }\n\n    return true;\n}\n\nfunction isAlphanumeric(char: string): boolean {\n    return /[a-zA-Z0-9]/.test(char);\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_left_char": [
        7
      ],
      "skip_left": [
        8,
        9
      ],
      "check_right_char": [
        12
      ],
      "skip_right": [
        13,
        14
      ],
      "compare_chars": [
        18
      ],
      "chars_mismatch": [
        19
      ],
      "not_palindrome": [
        19
      ],
      "chars_match": [
        22,
        23
      ],
      "palindrome_found": [
        26
      ]
    },
    "conditionalMap": {
      "is_alphanumeric_left": [
        7
      ],
      "is_alphanumeric_right": [
        12
      ],
      "chars_match": [
        18
      ],
      "final_result": [
        26
      ]
    }
  }
};

const ValidPalindromePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid",
    "value": {
      "s": "Madam"
    }
  },
  {
    "id": "ex2",
    "label": "Valid 2",
    "value": {
      "s": "A Santa at NASA"
    }
  },
  {
    "id": "ex3",
    "label": "Invalid 1",
    "value": {
      "s": "A man, a plan"
    }
  },
  {
    "id": "ex4",
    "label": "Invalid 2",
    "value": {
      "s": "race a car"
    }
  }
];

function generateValidPalindromeSteps(e: any): any[] {
  const a = (e) => /[a-zA-Z0-9]/.test(e);
let t=e.s,r=t.length,n=(e,r)=>Array.from(t).reduce((t,i,a)=>{let n;return r?.has(a)?n="skipped":e?.has(a)&&(n="matched"),t[`char_${a}`]={type:"arrayElement",value:i,position:a,fontSize:20,...n&&{state:n}},t},{}),l=n(),s=new StepRecorder({s:t},{...l});s.record("start",`Start: Check if "${t}" is a valid palindrome`);let o=0,c=r-1,d=new Set,h=new Set;for(s.add_new_variable("left",o),s.add_new_variable("right",c),s.add_new_variable("result",!1),r>0&&(s.add_new_visual("ptr_left",{type:"pointer",position:o,label:"left"}),s.add_new_visual("ptr_right",{type:"pointer",position:c,label:"right"})),s.record("initialize",`Initialize: left=0, right=${r-1}. Use two pointers to check from both ends.`);o<c;){let e=t[o],i=a(e);if(s.add_conditional("is_alphanumeric_left",!i),!i){for(let[e,t]of(h.add(o),Object.entries(n(d,h))))s.update_visual(e,t);s.record("check_left_char",`Check left: s[${o}]='${e}' is not alphanumeric`),o++,s.update_variable("left",o),o<r&&s.update_visual("ptr_left",{type:"pointer",position:o,label:"left"}),s.record("skip_left",`Skip non-alphanumeric character, increment left to ${o}`);continue}let l=t[c],u=a(l);if(s.add_conditional("is_alphanumeric_right",!u),!u){for(let[e,t]of(h.add(c),Object.entries(n(d,h))))s.update_visual(e,t);s.record("check_right_char",`Check right: s[${c}]='${l}' is not alphanumeric`),c--,s.update_variable("right",c),c>=0&&s.update_visual("ptr_right",{type:"pointer",position:c,label:"right"}),s.record("skip_right",`Skip non-alphanumeric character, decrement right to ${c}`);continue}s.record("compare_chars",`Compare: s[${o}]='${e}' vs s[${c}]='${l}' (case-insensitive)`);let p=e.toLowerCase()===l.toLowerCase();if(s.add_conditional("chars_match",!p),!p)return s.record("chars_mismatch",`Mismatch: '${e}' ≠ '${l}'. Not a palindrome!`),s.update_variable("result",!1),s.delete_visual("ptr_left"),s.delete_visual("ptr_right"),s.add_conditional("final_result",!1),s.record("not_palindrome",`Return false: "${t}" is NOT a valid palindrome`),s.getSteps();for(let[e,t]of(d.add(o),d.add(c),Object.entries(n(d,h))))s.update_visual(e,t);o++,c--,s.update_variable("left",o),s.update_variable("right",c),o<r&&o<=c?s.update_visual("ptr_left",{type:"pointer",position:o,label:"left"}):s.delete_visual("ptr_left"),c>=0&&o<=c?s.update_visual("ptr_right",{type:"pointer",position:c,label:"right"}):s.delete_visual("ptr_right"),s.record("chars_match",`Match: '${e}' == '${l}'. Move both pointers inward.`)}return s.update_variable("result",!0),s.delete_visual("ptr_left"),s.delete_visual("ptr_right"),s.add_conditional("final_result",!0),s.record("palindrome_found",`Return true: "${t}" is a valid palindrome!`),s.getSteps()
}

export function ValidPalindromeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidPalindromeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidPalindromeSteps(e) as any[];
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
      title="Valid Palindrome"
      slug="valid-palindrome"
      approaches={approaches}
      presets={ValidPalindromePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Common Prefix (longest-common-prefix)
// ==========================================

const LongestCommonPrefixTemplates = {
  "python": {
    "language": "python",
    "code": "def longestCommonPrefix(strs: list[str]) -> str:\n    if not strs:\n        return \"\"\n\n    # Use first string as reference\n    for i in range(len(strs[0])):\n        char = strs[0][i]\n\n        # Check if all strings have this character at position i\n        for j in range(1, len(strs)):\n            if i >= len(strs[j]) or strs[j][i] != char:\n                return strs[0][:i]\n\n    # The entire first string is the common prefix\n    return strs[0]",
    "lineMap": {
      "-": [
        1
      ],
      "empty": [
        2,
        3
      ],
      "single_string": [
        15
      ],
      "init": [
        6
      ],
      "get_char": [
        7
      ],
      "char_match_step": [
        11
      ],
      "length_mismatch": [
        11
      ],
      "char_mismatch": [
        11
      ],
      "add_to_prefix": [
        6
      ],
      "stop_early": [
        11
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "mismatch_check": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String longestCommonPrefix(String[] strs) {\n    if (strs == null || strs.length == 0) {\n        return \"\";\n    }\n\n    // Use first string as reference\n    for (int i = 0; i < strs[0].length(); i++) {\n        char c = strs[0].charAt(i);\n\n        // Check if all strings have this character at position i\n        for (int j = 1; j < strs.length; j++) {\n            if (i >= strs[j].length() || strs[j].charAt(i) != c) {\n                return strs[0].substring(0, i);\n            }\n        }\n    }\n\n    // The entire first string is the common prefix\n    return strs[0];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "empty": [
        2,
        3
      ],
      "single_string": [
        19
      ],
      "init": [
        7
      ],
      "get_char": [
        8
      ],
      "char_match_step": [
        12
      ],
      "length_mismatch": [
        13
      ],
      "char_mismatch": [
        13
      ],
      "add_to_prefix": [
        7
      ],
      "stop_early": [
        13
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "mismatch_check": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string longestCommonPrefix(vector<string>& strs) {\n    if (strs.empty()) {\n        return \"\";\n    }\n\n    // Use first string as reference\n    for (int i = 0; i < strs[0].length(); i++) {\n        char c = strs[0][i];\n\n        // Check if all strings have this character at position i\n        for (int j = 1; j < strs.size(); j++) {\n            if (i >= strs[j].length() || strs[j][i] != c) {\n                return strs[0].substr(0, i);\n            }\n        }\n    }\n\n    // The entire first string is the common prefix\n    return strs[0];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "empty": [
        2,
        3
      ],
      "single_string": [
        19
      ],
      "init": [
        7
      ],
      "get_char": [
        8
      ],
      "char_match_step": [
        12
      ],
      "length_mismatch": [
        13
      ],
      "char_mismatch": [
        13
      ],
      "add_to_prefix": [
        7
      ],
      "stop_early": [
        13
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "mismatch_check": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string LongestCommonPrefix(string[] strs) {\n    if (strs == null || strs.Length == 0) {\n        return \"\";\n    }\n\n    // Use first string as reference\n    for (int i = 0; i < strs[0].Length; i++) {\n        char c = strs[0][i];\n\n        // Check if all strings have this character at position i\n        for (int j = 1; j < strs.Length; j++) {\n            if (i >= strs[j].Length || strs[j][i] != c) {\n                return strs[0].Substring(0, i);\n            }\n        }\n    }\n\n    // The entire first string is the common prefix\n    return strs[0];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "empty": [
        2,
        3
      ],
      "single_string": [
        19
      ],
      "init": [
        7
      ],
      "get_char": [
        8
      ],
      "char_match_step": [
        12
      ],
      "length_mismatch": [
        13
      ],
      "char_mismatch": [
        13
      ],
      "add_to_prefix": [
        7
      ],
      "stop_early": [
        13
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "mismatch_check": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestCommonPrefix(strs []string) string {\n    if len(strs) == 0 {\n        return \"\"\n    }\n\n    // Use first string as reference\n    for i := 0; i < len(strs[0]); i++ {\n        c := strs[0][i]\n\n        // Check if all strings have this character at position i\n        for j := 1; j < len(strs); j++ {\n            if i >= len(strs[j]) || strs[j][i] != c {\n                return strs[0][:i]\n            }\n        }\n    }\n\n    // The entire first string is the common prefix\n    return strs[0]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "empty": [
        2,
        3
      ],
      "single_string": [
        19
      ],
      "init": [
        7
      ],
      "get_char": [
        8
      ],
      "char_match_step": [
        12
      ],
      "length_mismatch": [
        13
      ],
      "char_mismatch": [
        13
      ],
      "add_to_prefix": [
        7
      ],
      "stop_early": [
        13
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "mismatch_check": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestCommonPrefix = function(strs) {\n    if (strs.length === 0) {\n        return \"\";\n    }\n\n    // Use first string as reference\n    for (let i = 0; i < strs[0].length; i++) {\n        const char = strs[0][i];\n\n        // Check if all strings have this character at position i\n        for (let j = 1; j < strs.length; j++) {\n            if (i >= strs[j].length || strs[j][i] !== char) {\n                return strs[0].substring(0, i);\n            }\n        }\n    }\n\n    // The entire first string is the common prefix\n    return strs[0];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "empty": [
        2,
        3
      ],
      "single_string": [
        19
      ],
      "init": [
        7
      ],
      "get_char": [
        8
      ],
      "char_match_step": [
        12
      ],
      "length_mismatch": [
        13
      ],
      "char_mismatch": [
        13
      ],
      "add_to_prefix": [
        7
      ],
      "stop_early": [
        13
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "mismatch_check": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestCommonPrefix(strs: string[]): string {\n    if (strs.length === 0) {\n        return \"\";\n    }\n\n    // Use first string as reference\n    for (let i = 0; i < strs[0].length; i++) {\n        const char = strs[0][i];\n\n        // Check if all strings have this character at position i\n        for (let j = 1; j < strs.length; j++) {\n            if (i >= strs[j].length || strs[j][i] !== char) {\n                return strs[0].substring(0, i);\n            }\n        }\n    }\n\n    // The entire first string is the common prefix\n    return strs[0];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "empty": [
        2,
        3
      ],
      "single_string": [
        19
      ],
      "init": [
        7
      ],
      "get_char": [
        8
      ],
      "char_match_step": [
        12
      ],
      "length_mismatch": [
        13
      ],
      "char_mismatch": [
        13
      ],
      "add_to_prefix": [
        7
      ],
      "stop_early": [
        13
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "mismatch_check": [
        12
      ]
    }
  }
};

const LongestCommonPrefixPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "strs": [
        "flower",
        "flow",
        "flight"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (No Prefix)",
    "value": {
      "strs": [
        "dog",
        "racecar",
        "car"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3 (Long)",
    "value": {
      "strs": [
        "interspecies",
        "interstellar",
        "interstate"
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All Same",
    "value": {
      "strs": [
        "test",
        "test",
        "test"
      ]
    }
  }
];

function generateLongestCommonPrefixSteps(t: any): any[] {
  let e=t.strs,i=e.length;if(0===i){let t=new StepRecorder({strs:e},{});return t.record("empty","Empty array, return an empty string"),t.getSteps()}let s={};e.forEach((t,e)=>{Array.from(t).forEach((t,i)=>{s[`char_${e}_${i}`]={type:"arrayElement",value:t,position:i,row:e}})});let n=new StepRecorder({strs:e},s);if(n.record("-",`Start: find the longest common prefix of ${i} strings by scanning column by column`),1===i){for(let t=0;t<e[0].length;t++)n.update_visual(`char_0_${t}`,{type:"arrayElement",value:e[0][t],position:t,row:0,state:"matched"});return n.add_new_visual("meta_prefix",{type:"metadata",value:e[0]}),n.record("single_string",`Only one string, the prefix is the whole string "${e[0]}"`),n.getSteps()}let l=e[0],a="",o=-1;n.add_new_variable("col",0),n.add_new_variable("result",""),n.add_new_visual("meta_prefix",{type:"metadata",value:""}),n.record("init",`Use the first string "${l}" as reference and check each column across all strings`);let c=new Set,h=(t,i,r)=>{n.update_visual(`char_${t}_${i}`,{type:"arrayElement",value:e[t][i],position:i,row:t,state:r})};for(let t=0;t<l.length;t++){n.update_variable("col",t);let r={type:"pointer",position:t,label:"col"},s={type:"range",start:t,end:t,label:"col"};0===t?(n.add_new_visual("col_pointer",r),n.add_new_visual("col_band",s)):(n.update_visual("col_pointer",r),n.update_visual("col_band",s));let m=l[t];h(0,t,"checking"),n.record("get_char",`Column ${t}: reference character from strs[0] is '${m}'`);let g=!0;for(let r=1;r<i;r++){if(t>=e[r].length){g=!1,n.add_conditional("mismatch_check",!0);for(let t=0;t<e[r].length;t++)h(r,t,"mismatch"),c.add(`${r}_${t}`);n.record("length_mismatch",`strs[${r}] = "${e[r]}" has no character at column ${t}, it is too short`);break}let i=e[r][t];if(i!==m){g=!1,n.add_conditional("mismatch_check",!0),h(r,t,"mismatch"),c.add(`${r}_${t}`),n.record("char_mismatch",`strs[${r}][${t}] = '${i}' does not match '${m}'`);break}n.add_conditional("mismatch_check",!1),h(r,t,"matched"),n.record("char_match_step",`strs[${r}][${t}] = '${i}' matches '${m}'`)}if(g)a+=m,o=t,n.update_variable("result",a),h(0,t,"matched"),n.update_visual("meta_prefix",{type:"metadata",value:a}),n.record("add_to_prefix",`Every string has '${m}' at column ${t}, prefix = "${a}"`);else{n.delete_visual("col_pointer"),n.delete_visual("col_band");for(let t=0;t<i;t++)for(let i=o+1;i<e[t].length;i++)c.has(`${t}_${i}`)||h(t,i,"dim");return n.record("stop_early",a.length>0?`Stop: the longest common prefix is "${a}"`:'Stop: the strings share no common prefix, return ""'),n.getSteps()}}n.delete_visual("col_pointer"),n.delete_visual("col_band");for(let t=0;t<i;t++)for(let i=a.length;i<e[t].length;i++)h(t,i,"dim");return n.record("complete",`Scanned all of strs[0], the longest common prefix is "${a}"`),n.getSteps()
}

export function LongestCommonPrefixProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestCommonPrefixTemplates,
      generateSteps: (t: any) => {
        const recorded = generateLongestCommonPrefixSteps(t) as any[];
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
      title="Longest Common Prefix"
      slug="longest-common-prefix"
      approaches={approaches}
      presets={LongestCommonPrefixPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Zigzag Conversion (zigzag-conversion)
// ==========================================

const ZigzagConversionTemplates = {
  "python": {
    "language": "python",
    "code": "def convert(s: str, numRows: int) -> str:\n    if numRows == 1 or numRows >= len(s):\n        return s\n\n    rows = [''] * numRows\n    currentRow, goingDown = 0, False\n\n    for char in s:\n        rows[currentRow] += char\n        # Flip direction at top and bottom rows\n        if currentRow == 0 or currentRow == numRows - 1:\n            goingDown = not goingDown\n        currentRow += 1 if goingDown else -1\n\n    return ''.join(rows)",
    "lineMap": {
      "-": [
        1
      ],
      "check_single_row": [
        2
      ],
      "init_rows": [
        5
      ],
      "init_vars": [
        6
      ],
      "loop_char": [
        8
      ],
      "append_char": [
        9
      ],
      "check_boundary": [
        11
      ],
      "change_direction": [
        12
      ],
      "move_row": [
        13
      ],
      "join_rows": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "single_row_check": [
        2
      ],
      "boundary_check": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String convert(String s, int numRows) {\n    if (numRows == 1 || numRows >= s.length()) {\n        return s;\n    }\n\n    StringBuilder[] rows = new StringBuilder[numRows];\n    for (int i = 0; i < numRows; i++) {\n        rows[i] = new StringBuilder();\n    }\n\n    int currentRow = 0;\n    boolean goingDown = false;\n\n    for (char c : s.toCharArray()) {\n        rows[currentRow].append(c);\n        // Flip direction at top and bottom rows\n        if (currentRow == 0 || currentRow == numRows - 1) {\n            goingDown = !goingDown;\n        }\n        currentRow += goingDown ? 1 : -1;\n    }\n\n    StringBuilder result = new StringBuilder();\n    for (StringBuilder row : rows) {\n        result.append(row);\n    }\n    return result.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_single_row": [
        2
      ],
      "init_rows": [
        6,
        7,
        8,
        9
      ],
      "init_vars": [
        11,
        12
      ],
      "loop_char": [
        14
      ],
      "append_char": [
        15
      ],
      "check_boundary": [
        17
      ],
      "change_direction": [
        18
      ],
      "move_row": [
        20
      ],
      "join_rows": [
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
      "single_row_check": [
        2
      ],
      "boundary_check": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string convert(string s, int numRows) {\n    if (numRows == 1 || numRows >= (int)s.length()) {\n        return s;\n    }\n\n    vector<string> rows(numRows);\n    int currentRow = 0;\n    bool goingDown = false;\n\n    for (char c : s) {\n        rows[currentRow] += c;\n        // Flip direction at top and bottom rows\n        if (currentRow == 0 || currentRow == numRows - 1) {\n            goingDown = !goingDown;\n        }\n        currentRow += goingDown ? 1 : -1;\n    }\n\n    string result = \"\";\n    for (const string& row : rows) {\n        result += row;\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_single_row": [
        2
      ],
      "init_rows": [
        6
      ],
      "init_vars": [
        7,
        8
      ],
      "loop_char": [
        10
      ],
      "append_char": [
        11
      ],
      "check_boundary": [
        13
      ],
      "change_direction": [
        14
      ],
      "move_row": [
        16
      ],
      "join_rows": [
        19,
        20,
        21,
        22,
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "single_row_check": [
        2
      ],
      "boundary_check": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string Convert(string s, int numRows) {\n    if (numRows == 1 || numRows >= s.Length) {\n        return s;\n    }\n\n    var rows = new StringBuilder[numRows];\n    for (int i = 0; i < numRows; i++) {\n        rows[i] = new StringBuilder();\n    }\n\n    int currentRow = 0;\n    bool goingDown = false;\n\n    foreach (char c in s) {\n        rows[currentRow].Append(c);\n        // Flip direction at top and bottom rows\n        if (currentRow == 0 || currentRow == numRows - 1) {\n            goingDown = !goingDown;\n        }\n        currentRow += goingDown ? 1 : -1;\n    }\n\n    var result = new StringBuilder();\n    foreach (var row in rows) {\n        result.Append(row);\n    }\n    return result.ToString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_single_row": [
        2
      ],
      "init_rows": [
        6,
        7,
        8,
        9
      ],
      "init_vars": [
        11,
        12
      ],
      "loop_char": [
        14
      ],
      "append_char": [
        15
      ],
      "check_boundary": [
        17
      ],
      "change_direction": [
        18
      ],
      "move_row": [
        20
      ],
      "join_rows": [
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
      "single_row_check": [
        2
      ],
      "boundary_check": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func convert(s string, numRows int) string {\n    if numRows == 1 || numRows >= len(s) {\n        return s\n    }\n\n    rows := make([][]byte, numRows)\n    currentRow := 0\n    goingDown := false\n\n    for i := 0; i < len(s); i++ {\n        rows[currentRow] = append(rows[currentRow], s[i])\n        // Flip direction at top and bottom rows\n        if currentRow == 0 || currentRow == numRows-1 {\n            goingDown = !goingDown\n        }\n        if goingDown {\n            currentRow++\n        } else {\n            currentRow--\n        }\n    }\n\n    result := []byte{}\n    for _, row := range rows {\n        result = append(result, row...)\n    }\n    return string(result)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_single_row": [
        2
      ],
      "init_rows": [
        6
      ],
      "init_vars": [
        7,
        8
      ],
      "loop_char": [
        10
      ],
      "append_char": [
        11
      ],
      "check_boundary": [
        13
      ],
      "change_direction": [
        14
      ],
      "move_row": [
        16,
        17,
        18,
        19,
        20
      ],
      "join_rows": [
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
      "single_row_check": [
        2
      ],
      "boundary_check": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var convert = function (s, numRows) {\n    if (numRows === 1 || numRows >= s.length) {\n        return s;\n    }\n\n    const rows = new Array(numRows).fill('');\n    let currentRow = 0;\n    let goingDown = false;\n\n    for (const char of s) {\n        rows[currentRow] += char;\n        // Flip direction at top and bottom rows\n        if (currentRow === 0 || currentRow === numRows - 1) {\n            goingDown = !goingDown;\n        }\n        currentRow += goingDown ? 1 : -1;\n    }\n\n    return rows.join('');\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_single_row": [
        2
      ],
      "init_rows": [
        6
      ],
      "init_vars": [
        7,
        8
      ],
      "loop_char": [
        10
      ],
      "append_char": [
        11
      ],
      "check_boundary": [
        13
      ],
      "change_direction": [
        14
      ],
      "move_row": [
        16
      ],
      "join_rows": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "single_row_check": [
        2
      ],
      "boundary_check": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function convert(s: string, numRows: number): string {\n    if (numRows === 1 || numRows >= s.length) {\n        return s;\n    }\n\n    const rows: string[] = new Array(numRows).fill('');\n    let currentRow = 0;\n    let goingDown = false;\n\n    for (const char of s) {\n        rows[currentRow] += char;\n        // Flip direction at top and bottom rows\n        if (currentRow === 0 || currentRow === numRows - 1) {\n            goingDown = !goingDown;\n        }\n        currentRow += goingDown ? 1 : -1;\n    }\n\n    return rows.join('');\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_single_row": [
        2
      ],
      "init_rows": [
        6
      ],
      "init_vars": [
        7,
        8
      ],
      "loop_char": [
        10
      ],
      "append_char": [
        11
      ],
      "check_boundary": [
        13
      ],
      "change_direction": [
        14
      ],
      "move_row": [
        16
      ],
      "join_rows": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "single_row_check": [
        2
      ],
      "boundary_check": [
        13
      ]
    }
  }
};

const ZigzagConversionPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (3 rows)",
    "value": {
      "s": "PAYPALISHIRING",
      "numRows": 3
    }
  },
  {
    "id": "ex2",
    "label": "4 Rows",
    "value": {
      "s": "PAYPALISHIRING",
      "numRows": 4
    }
  },
  {
    "id": "ex3",
    "label": "Small",
    "value": {
      "s": "ABCDE",
      "numRows": 3
    }
  },
  {
    "id": "ex4",
    "label": "Single Row",
    "value": {
      "s": "HELLO",
      "numRows": 1
    }
  }
];

function generateZigzagConversionSteps(e: any): any[] {
  let t=String(e?.s??""),r=Math.max(1,Number(e?.numRows??1)),o=t.length,i=Array(o).fill(0);if(r>1){let e=2*r-2;for(let t=0;t<o;t++){let n=t%e;i[t]=n<r?n:e-n}}let l=new Set,a=(e,r,n)=>{let a={};for(let s=0;s<o;s++){let o=s===r||s===n?"reading":l.has(s)?"consumed":e>=0&&i[s]===e?"candidate":void 0;a[`char_${s}`]={type:"arrayElement",value:t[s],position:s,...o&&{state:o}}}return a},s=new StepRecorder({s:t,numRows:r},{...a(-1,-1,-1),meta_row:{type:"metadata",value:null},meta_cycle:{type:"metadata",value:null},meta_result:{type:"metadata",value:""},meta_jump:{type:"metadata",value:null}}),c=(e,t,r,n)=>{for(let[n,o]of Object.entries(a(e,t,r)))s.update_visual(n,o);for(let e=0;e<n.length;e++)s.update_visual(`result_${e}`,{type:"arrayElement",value:n[e],position:e,state:"placed"});s.update_visual("meta_row",{type:"metadata",value:e<0?null:e}),s.update_visual("meta_result",{type:"metadata",value:n}),s.update_visual("meta_jump",{type:"metadata",value:t<0?null:{from:t,second:r<0?null:r}}),t>=0?s.update_visual("ptr_i",{type:"pointer",position:t,label:"j"}):s.delete_visual("ptr_i")};s.record("-",`Start: read "${t}" row by row without ever building the zigzag`);let u=1===r;if(s.add_conditional("single_row_check",u),s.record("check_single_row",u?"With one row the zigzag is the string itself, so it is returned unchanged":`${r} rows means each row owns a fixed set of indices`),u){for(let e=0;e<o;e++)l.add(e);return c(-1,-1,-1,t),s.add_new_variable("result",t),s.record("complete",`Done, result = "${t}"`),s.getSteps()}let d=2*r-2;s.add_new_variable("cycleLen",d),s.update_visual("meta_cycle",{type:"metadata",value:d}),c(-1,-1,-1,""),s.record("init_cycle",`One full zigzag covers ${d} characters, so every row repeats every ${d} indices`);let g="";for(let e=0;e<r;e++){s.update_variable("row",e),c(e,-1,-1,g),s.record("start_row",0===e||e===r-1?`Row ${e} is an edge row: it owns one index per cycle, starting at ${e}`:`Row ${e} is a middle row: it owns two indices per cycle, starting at ${e}`);for(let n=e;n<o;n+=d){l.add(n),g+=t[n],s.update_variable("result",g),c(e,n,-1,g),s.record("take_char",`Take s[${n}] = '${t[n]}', result = "${g}"`);let i=e>0&&e<r-1;if(s.add_conditional("is_middle_row",i),!i)continue;let a=n+d-2*e,u=a<o;s.add_conditional("second_in_range",u),u&&(l.add(a),g+=t[a],s.update_variable("result",g),c(e,n,a,g),s.record("take_second",`The diagonal character of this cycle is s[${a}] = '${t[a]}', result = "${g}"`))}}return c(-1,-1,-1,g),s.add_new_variable("result",g),s.record("complete",`Done, result = "${g}"`),s.getSteps()
}

export function ZigzagConversionProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ZigzagConversionTemplates,
      generateSteps: (e: any) => {
        const recorded = generateZigzagConversionSteps(e) as any[];
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
      title="Zigzag Conversion"
      slug="zigzag-conversion"
      approaches={approaches}
      presets={ZigzagConversionPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reverse Words in a String (reverse-words-in-a-string)
// ==========================================

const ReverseWordsInAStringTemplates = {
  "python": {
    "language": "python",
    "code": "def reverseWords(s: str) -> str:\n    chars = list(s)\n    n = len(chars)\n\n    # Step 1: Reverse entire array\n    reverse(chars, 0, n - 1)\n\n    # Step 2: Reverse each word and compact\n    write = 0\n    i = 0\n    while i < n:\n        if chars[i] != ' ':\n            # Add space between words\n            if write > 0:\n                chars[write] = ' '\n                write += 1\n            # Copy and track word boundaries\n            word_start = write\n            while i < n and chars[i] != ' ':\n                chars[write] = chars[i]\n                write += 1\n                i += 1\n            # Reverse the word we just wrote\n            reverse(chars, word_start, write - 1)\n        i += 1\n\n    return ''.join(chars[:write])\n\ndef reverse(chars: list, left: int, right: int) -> None:\n    while left < right:\n        chars[left], chars[right] = chars[right], chars[left]\n        left += 1\n        right -= 1",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_entire": [
        6
      ],
      "reverse_done": [
        6
      ],
      "skip_space": [
        12
      ],
      "add_space": [
        14,
        15,
        16
      ],
      "copy_char": [
        20,
        21,
        22
      ],
      "reverse_word": [
        24
      ],
      "complete": [
        27
      ],
      "swap_chars": [
        31
      ],
      "move_pointers": [
        32,
        33
      ],
      "while_done": [
        30
      ]
    },
    "conditionalMap": {
      "while_loop": [
        30
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String reverseWords(String s) {\n    char[] chars = s.toCharArray();\n    int n = chars.length;\n\n    // Step 1: Reverse the entire array\n    reverse(chars, 0, n - 1);\n\n    // Step 2: Reverse each word and compact\n    int write = 0;\n    for (int i = 0; i < n; i++) {\n        if (chars[i] != ' ') {\n            // Add space between words\n            if (write > 0) chars[write++] = ' ';\n            // Copy and track word boundaries\n            int wordStart = write;\n            while (i < n && chars[i] != ' ') {\n                chars[write++] = chars[i++];\n            }\n            // Reverse the word we just wrote\n            reverse(chars, wordStart, write - 1);\n        }\n    }\n\n    return new String(chars, 0, write);\n}\n\nprivate void reverse(char[] c, int l, int r) {\n    while (l < r) {\n        char temp = c[l];\n        c[l] = c[r];\n        c[r] = temp;\n        l++;\n        r--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_entire": [
        6
      ],
      "reverse_done": [
        6
      ],
      "skip_space": [
        11
      ],
      "add_space": [
        13
      ],
      "copy_char": [
        17
      ],
      "reverse_word": [
        20
      ],
      "complete": [
        24
      ],
      "swap_chars": [
        29,
        30,
        31
      ],
      "move_pointers": [
        32,
        33
      ],
      "while_done": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        28
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string reverseWords(string s) {\n    int n = s.length();\n    vector<char> chars(s.begin(), s.end());\n\n    // Step 1: Reverse the entire array\n    reverse(chars, 0, n - 1);\n\n    // Step 2: Reverse each word and compact\n    int write = 0;\n    for (int i = 0; i < n; i++) {\n        if (chars[i] != ' ') {\n            // Add space between words\n            if (write > 0) chars[write++] = ' ';\n            // Copy and track word boundaries\n            int wordStart = write;\n            while (i < n && chars[i] != ' ') {\n                chars[write++] = chars[i++];\n            }\n            // Reverse the word we just wrote\n            reverse(chars, wordStart, write - 1);\n        }\n    }\n\n    return string(chars.begin(), chars.begin() + write);\n}\n\nvoid reverse(vector<char>& c, int l, int r) {\n    while (l < r) {\n        swap(c[l], c[r]);\n        l++;\n        r--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_entire": [
        6
      ],
      "reverse_done": [
        6
      ],
      "skip_space": [
        11
      ],
      "add_space": [
        13
      ],
      "copy_char": [
        17
      ],
      "reverse_word": [
        20
      ],
      "complete": [
        24
      ],
      "swap_chars": [
        29
      ],
      "move_pointers": [
        30,
        31
      ],
      "while_done": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        28
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string ReverseWords(string s) {\n    char[] chars = s.ToCharArray();\n    int n = chars.Length;\n\n    // Step 1: Reverse the entire array\n    Reverse(chars, 0, n - 1);\n\n    // Step 2: Reverse each word and compact\n    int write = 0;\n    for (int i = 0; i < n; i++) {\n        if (chars[i] != ' ') {\n            // Add space between words\n            if (write > 0) chars[write++] = ' ';\n            // Copy and track word boundaries\n            int wordStart = write;\n            while (i < n && chars[i] != ' ') {\n                chars[write++] = chars[i++];\n            }\n            // Reverse the word we just wrote\n            Reverse(chars, wordStart, write - 1);\n        }\n    }\n\n    return new string(chars, 0, write);\n}\n\nprivate void Reverse(char[] c, int l, int r) {\n    while (l < r) {\n        char temp = c[l];\n        c[l] = c[r];\n        c[r] = temp;\n        l++;\n        r--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_entire": [
        6
      ],
      "reverse_done": [
        6
      ],
      "skip_space": [
        11
      ],
      "add_space": [
        13
      ],
      "copy_char": [
        17
      ],
      "reverse_word": [
        20
      ],
      "complete": [
        24
      ],
      "swap_chars": [
        29,
        30,
        31
      ],
      "move_pointers": [
        32,
        33
      ],
      "while_done": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        28
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reverseWords(s string) string {\n    chars := []rune(s)\n    n := len(chars)\n\n    // Step 1: Reverse the entire array\n    reverse(chars, 0, n-1)\n\n    // Step 2: Reverse each word and compact\n    write := 0\n    for i := 0; i < n; i++ {\n        if chars[i] != ' ' {\n            // Add space between words\n            if write > 0 {\n                chars[write] = ' '\n                write++\n            }\n            // Copy and track word boundaries\n            wordStart := write\n            for i < n && chars[i] != ' ' {\n                chars[write] = chars[i]\n                write++\n                i++\n            }\n            // Reverse the word we just wrote\n            reverse(chars, wordStart, write-1)\n        }\n    }\n\n    return string(chars[:write])\n}\n\nfunc reverse(chars []rune, left, right int) {\n    for left < right {\n        chars[left], chars[right] = chars[right], chars[left]\n        left++\n        right--\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_entire": [
        6
      ],
      "reverse_done": [
        6
      ],
      "skip_space": [
        11
      ],
      "add_space": [
        13,
        14,
        15
      ],
      "copy_char": [
        20,
        21,
        22
      ],
      "reverse_word": [
        25
      ],
      "complete": [
        29
      ],
      "swap_chars": [
        34
      ],
      "move_pointers": [
        35,
        36
      ],
      "while_done": [
        33
      ]
    },
    "conditionalMap": {
      "while_loop": [
        33
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var reverseWords = function(s) {\n    const chars = s.split('');\n    const n = chars.length;\n\n    // Step 1: Reverse the entire array\n    reverse(chars, 0, n - 1);\n\n    // Step 2: Reverse each word and compact\n    let write = 0;\n    for (let i = 0; i < n; i++) {\n        if (chars[i] !== ' ') {\n            // Add space between words\n            if (write > 0) chars[write++] = ' ';\n            // Copy and track word boundaries\n            let wordStart = write;\n            while (i < n && chars[i] !== ' ') {\n                chars[write++] = chars[i++];\n            }\n            // Reverse the word we just wrote\n            reverse(chars, wordStart, write - 1);\n        }\n    }\n\n    return chars.slice(0, write).join('');\n}\n\nfunction reverse(chars, left, right) {\n    while (left < right) {\n        [chars[left], chars[right]] = [chars[right], chars[left]];\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_entire": [
        6
      ],
      "reverse_done": [
        6
      ],
      "skip_space": [
        11
      ],
      "add_space": [
        13
      ],
      "copy_char": [
        17
      ],
      "reverse_word": [
        20
      ],
      "complete": [
        24
      ],
      "swap_chars": [
        29
      ],
      "move_pointers": [
        30,
        31
      ],
      "while_done": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        28
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reverseWords(s: string): string {\n    const chars = s.split('');\n    const n = chars.length;\n\n    // Step 1: Reverse the entire array\n    reverse(chars, 0, n - 1);\n\n    // Step 2: Reverse each word and compact\n    let write = 0;\n    for (let i = 0; i < n; i++) {\n        if (chars[i] !== ' ') {\n            // Add space between words\n            if (write > 0) chars[write++] = ' ';\n            // Copy and track word boundaries\n            let wordStart = write;\n            while (i < n && chars[i] !== ' ') {\n                chars[write++] = chars[i++];\n            }\n            // Reverse the word we just wrote\n            reverse(chars, wordStart, write - 1);\n        }\n    }\n\n    return chars.slice(0, write).join('');\n}\n\nfunction reverse(chars: string[], left: number, right: number): void {\n    while (left < right) {\n        [chars[left], chars[right]] = [chars[right], chars[left]];\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_entire": [
        6
      ],
      "reverse_done": [
        6
      ],
      "skip_space": [
        11
      ],
      "add_space": [
        13
      ],
      "copy_char": [
        17
      ],
      "reverse_word": [
        20
      ],
      "complete": [
        24
      ],
      "swap_chars": [
        29
      ],
      "move_pointers": [
        30,
        31
      ],
      "while_done": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        28
      ]
    }
  }
};

const ReverseWordsInAStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "the sky is blue"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (Spaces)",
    "value": {
      "s": "  hello world  "
    }
  },
  {
    "id": "ex3",
    "label": "Example 3 (Multiple Spaces)",
    "value": {
      "s": "a good   example"
    }
  },
  {
    "id": "ex4",
    "label": "Single Word",
    "value": {
      "s": "hello"
    }
  }
];

function generateReverseWordsInAStringSteps(e: any): any[] {
  let r=String(e?.s??""),t=r.length,s=[];for(let e=0;e<t;){if(" "===r[e]){e++;continue}let i=e;for(;e<t&&" "!==r[e];)e++;s.push({text:r.slice(i,e),start:i,end:e-1})}let a=(e,i)=>{let a=(e,r)=>r>=0&&r<s.length&&e>=s[r].start&&e<=s[r].end,n={};for(let o=0;o<t;o++){let t=" "===r[o],l=t?"space":a(o,e)?"active":s.slice(0,i).some((e,r)=>a(o,r))?"consumed":void 0;n[`char_${o}`]={type:"arrayElement",value:t?"␣":r[o],position:o,...l&&{state:l}}}return n},n=new StepRecorder({s:r},{...a(-1,0),meta_words:{type:"metadata",value:[]},meta_result:{type:"metadata",value:""},meta_phase:{type:"metadata",value:"split"}}),o=(e,r,t,i,s)=>{for(let[t,i]of Object.entries(a(e,r)))n.update_visual(t,i);n.update_visual("meta_words",{type:"metadata",value:t.map(e=>({...e}))}),n.update_visual("meta_result",{type:"metadata",value:i}),n.update_visual("meta_phase",{type:"metadata",value:s})};n.record("-",`Start: reverse the word order of "${r}"`);let l=[];for(let e=0;e<s.length;e++)l.forEach(e=>e.state=""),l.push({id:e,text:s[e].text,state:"active"}),n.update_variable("words",l.map(e=>e.text)),o(e,e+1,l,"","split"),n.record("split",`Cut out word ${e+1}: "${s[e].text}"`);l.reverse(),l.forEach(e=>e.state="reversed"),n.update_variable("words",l.map(e=>e.text)),o(-1,s.length,l,"","reverse"),n.record("reverse",`Reverse the list: ${l.map(e=>`"${e.text}"`).join(", ")}`);let d="";for(let e=0;e<l.length;e++)l.forEach((r,t)=>r.state=t<=e?"joined":"reversed"),d=l.slice(0,e+1).map(e=>e.text).join(" "),n.update_variable("result",d),o(-1,s.length,l,d,"join"),n.record("join",`Join word ${e+1}: result = "${d}"`);return n.add_new_variable("result",d),o(-1,s.length,l,d,"done"),n.record("complete",`Done, the reversed word order is "${d}"`),n.getSteps()
}

export function ReverseWordsInAStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReverseWordsInAStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReverseWordsInAStringSteps(e) as any[];
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
      title="Reverse Words in a String"
      slug="reverse-words-in-a-string"
      approaches={approaches}
      presets={ReverseWordsInAStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Repeated Substring Pattern (repeated-substring-pattern)
// ==========================================

const RepeatedSubstringPatternTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def repeatedSubstringPattern(self, s: str) -> bool:\n        n = len(s)\n        # Try every candidate substring length from 1 to n/2\n        for length in range(1, n // 2 + 1):\n            if n % length != 0:\n                continue\n            # Build the repeated string and compare\n            candidate = s[:length]\n            if candidate * (n // length) == s:\n                return True\n        return False",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "skip_length": [
        6,
        7
      ],
      "build_candidate": [
        8,
        9
      ],
      "compare": [
        10
      ],
      "found": [
        11
      ],
      "not_found": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "for_len": [
        5
      ],
      "divides": [
        6
      ],
      "is_equal": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean repeatedSubstringPattern(String s) {\n        int n = s.length();\n        // Try every candidate substring length from 1 to n/2\n        for (int len = 1; len <= n / 2; len++) {\n            if (n % len != 0) continue;\n            // Build the repeated string and compare\n            StringBuilder sb = new StringBuilder();\n            String candidate = s.substring(0, len);\n            for (int i = 0; i < n / len; i++) {\n                sb.append(candidate);\n            }\n            if (sb.toString().equals(s)) return true;\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "skip_length": [
        6
      ],
      "build_candidate": [
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "compare": [
        13
      ],
      "found": [
        13
      ],
      "not_found": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "for_len": [
        5
      ],
      "divides": [
        6
      ],
      "is_equal": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool repeatedSubstringPattern(string s) {\n        int n = s.size();\n        // Try every candidate substring length from 1 to n/2\n        for (int len = 1; len <= n / 2; len++) {\n            if (n % len != 0) continue;\n            // Build the repeated string and compare\n            string candidate = s.substr(0, len);\n            string built = \"\";\n            for (int i = 0; i < n / len; i++) {\n                built += candidate;\n            }\n            if (built == s) return true;\n        }\n        return false;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "init": [
        4
      ],
      "try_length": [
        5,
        6,
        7
      ],
      "skip_length": [
        7
      ],
      "build_candidate": [
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "compare": [
        14
      ],
      "found": [
        14
      ],
      "not_found": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "for_len": [
        6
      ],
      "divides": [
        7
      ],
      "is_equal": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool RepeatedSubstringPattern(string s) {\n        int n = s.Length;\n        // Try every candidate substring length from 1 to n/2\n        for (int len = 1; len <= n / 2; len++) {\n            if (n % len != 0) continue;\n            // Build the repeated string and compare\n            string candidate = s.Substring(0, len);\n            StringBuilder sb = new StringBuilder();\n            for (int i = 0; i < n / len; i++) {\n                sb.Append(candidate);\n            }\n            if (sb.ToString() == s) return true;\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "skip_length": [
        6
      ],
      "build_candidate": [
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "compare": [
        13
      ],
      "found": [
        13
      ],
      "not_found": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "for_len": [
        5
      ],
      "divides": [
        6
      ],
      "is_equal": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func repeatedSubstringPattern(s string) bool {\n    n := len(s)\n    // Try every candidate substring length from 1 to n/2\n    for length := 1; length <= n/2; length++ {\n        if n%length != 0 {\n            continue\n        }\n        // Build the repeated string and compare\n        candidate := s[:length]\n        built := \"\"\n        for i := 0; i < n/length; i++ {\n            built += candidate\n        }\n        if built == s {\n            return true\n        }\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "try_length": [
        3,
        4,
        5
      ],
      "skip_length": [
        5,
        6
      ],
      "build_candidate": [
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "compare": [
        14
      ],
      "found": [
        15
      ],
      "not_found": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_len": [
        4
      ],
      "divides": [
        5
      ],
      "is_equal": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var repeatedSubstringPattern = function(s) {\n    var n = s.length;\n    // Try every candidate substring length from 1 to n/2\n    for (var len = 1; len <= n / 2; len++) {\n        if (n % len !== 0) continue;\n        // Build the repeated string and compare\n        var candidate = s.substring(0, len);\n        var built = candidate.repeat(n / len);\n        if (built === s) return true;\n    }\n    return false;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "try_length": [
        3,
        4,
        5
      ],
      "skip_length": [
        5
      ],
      "build_candidate": [
        6,
        7,
        8
      ],
      "compare": [
        9
      ],
      "found": [
        9
      ],
      "not_found": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "for_len": [
        4
      ],
      "divides": [
        5
      ],
      "is_equal": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function repeatedSubstringPattern(s: string): boolean {\n    const n = s.length;\n    // Try every candidate substring length from 1 to n/2\n    for (let len = 1; len <= n / 2; len++) {\n        if (n % len !== 0) continue;\n        // Build the repeated string and compare\n        const candidate = s.substring(0, len);\n        const built = candidate.repeat(n / len);\n        if (built === s) return true;\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "try_length": [
        3,
        4,
        5
      ],
      "skip_length": [
        5
      ],
      "build_candidate": [
        6,
        7,
        8
      ],
      "compare": [
        9
      ],
      "found": [
        9
      ],
      "not_found": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "for_len": [
        4
      ],
      "divides": [
        5
      ],
      "is_equal": [
        9
      ]
    }
  }
};

const RepeatedSubstringPatternPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "True (ab x2)",
    "value": {
      "s": "abab"
    }
  },
  {
    "id": "ex2",
    "label": "False",
    "value": {
      "s": "abc"
    }
  },
  {
    "id": "ex3",
    "label": "True (abc x2)",
    "value": {
      "s": "abcabc"
    }
  },
  {
    "id": "ex4",
    "label": "True (abaab x2)",
    "value": {
      "s": "abaababaab"
    }
  }
];

function generateRepeatedSubstringPatternSteps(e: any): any[] {
  let t=e.s,a=t.length,i={};for(let e=0;e<a;e++)i[`s_${e}`]={type:"arrayElement",value:t[e],position:e};let l=new StepRecorder({s:t,n:a},i);l.record("-",`Start: can "${t}" be built by repeating one of its substrings?`),l.record("init",`n = ${a}. Only a block length that divides ${a} can tile s exactly.`);let r=(e,t,n=-1)=>{for(let i=0;i<a;i++){let a=i===n?"mismatch":i<t?"checking":void 0;l.update_visual(`d_${i}`,{type:"arrayElement",value:i<e.length?e[i]:"",position:i,...a?{state:a}:{}})}},s=(e,n=-1,i="checking")=>{for(let r=0;r<a;r++){let a=r===n?"mismatch":r<e?i:void 0;l.update_visual(`s_${r}`,{type:"arrayElement",value:t[r],position:r,...a?{state:a}:{}})}};for(let e=0;e<a;e++)l.add_new_visual(`d_${e}`,{type:"arrayElement",value:"",position:e});let o=-1;for(let e=1;e<=Math.floor(a/2);e++){let n=a%e==0;if(l.update_variable("length",e),l.update_visual("window",{type:"range",start:0,end:e-1,label:"block",state:n?"checking":"failed"}),s(e,-1,"checking"),r("",0),l.add_conditional("for_len",!0),l.add_conditional("divides",n),l.record("try_length",n?`Block length ${e}: ${a} / ${e} = ${a/e} copies would tile s.`:`Block length ${e}: ${a} % ${e} = ${a%e} ≠ 0, so it cannot tile s.`),!n){l.record("skip_length",`Skip length ${e}, it does not divide ${a}.`);continue}let i=t.slice(0,e),d=i.repeat(a/e);l.update_variable("candidate",i),r(d,0),l.record("build_candidate",`Repeat "${i}" ${a/e} times: "${d}".`);let u=0;for(;u<a&&d[u]===t[u];)u++;let c=u===a;if(r(d,c?a:u,c?-1:u),s(c?a:u,c?-1:u),l.add_conditional("is_equal",c),l.record("compare",c?`"${d}" equals s.`:`'${d[u]}' ≠ s[${u}] = '${t[u]}'. This block length fails.`),c){o=e;break}}if(l.add_conditional("for_len",!1),o>0){r(t.slice(0,o).repeat(a/o),a,-1);for(let e=0;e<a;e++)l.update_visual(`s_${e}`,{type:"arrayElement",value:t[e],position:e,state:"matched"}),l.update_visual(`d_${e}`,{type:"arrayElement",value:t[e],position:e,state:"matched"});l.update_visual("window",{type:"range",start:0,end:o-1,label:"block",state:"matched"}),l.update_variable("period",o),l.update_variable("copies",a/o),l.add_new_visual("verdict",{type:"metadata",value:!0}),l.update_variable("result",!0),l.record("found",`s = "${t.slice(0,o)}" repeated ${a/o} times.`),l.record("complete",`Return true: "${t}" is a repeated substring pattern.`)}else{l.delete_visual("window");for(let e=0;e<a;e++)l.delete_visual(`d_${e}`),l.update_visual(`s_${e}`,{type:"arrayElement",value:t[e],position:e,state:"failed"});l.add_new_visual("verdict",{type:"metadata",value:!1}),l.update_variable("result",!1),l.record("not_found",`No block length from 1 to ${Math.floor(a/2)} tiles "${t}".`),l.record("complete",`Return false: "${t}" is not a repeated substring pattern.`)}return l.getSteps()
}

export function RepeatedSubstringPatternProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RepeatedSubstringPatternTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRepeatedSubstringPatternSteps(e) as any[];
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
      title="Repeated Substring Pattern"
      slug="repeated-substring-pattern"
      approaches={approaches}
      presets={RepeatedSubstringPatternPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Repeated String Match (repeated-string-match)
// ==========================================

const RepeatedStringMatchTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def repeatedStringMatch(self, a: str, b: str) -> int:\n        # Every character in b must exist in a\n        if not set(b).issubset(set(a)):\n            return -1\n\n        min_reps = -(-len(b) // len(a))  # ceil division\n\n        repeated = a * min_reps\n        if b in repeated:\n            return min_reps\n\n        # One more copy covers a match that wraps across a copy boundary\n        if b in repeated + a:\n            return min_reps + 1\n\n        return -1",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "char_found": [
        3,
        4
      ],
      "char_not_found": [
        4,
        5
      ],
      "compute_min_reps": [
        7
      ],
      "append_copy": [
        9
      ],
      "search": [
        10
      ],
      "found_match": [
        11
      ],
      "not_found_yet": [
        10
      ],
      "append_extra": [
        13,
        14
      ],
      "search_extra": [
        14
      ],
      "found_match_extra": [
        15
      ],
      "not_found_final": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "char_check": [
        4
      ],
      "contains": [
        10
      ],
      "contains_extra": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int repeatedStringMatch(String a, String b) {\n        // Every character in b must exist in a\n        boolean[] charInA = new boolean[26];\n        for (char c : a.toCharArray()) {\n            charInA[c - 'a'] = true;\n        }\n        for (char c : b.toCharArray()) {\n            if (!charInA[c - 'a']) return -1;\n        }\n\n        int minReps = (b.length() + a.length() - 1) / a.length(); // ceil(m / n)\n\n        StringBuilder repeated = new StringBuilder();\n        for (int i = 0; i < minReps; i++) {\n            repeated.append(a);\n        }\n\n        if (repeated.toString().contains(b)) {\n            return minReps;\n        }\n\n        // One more copy covers a match that wraps across a copy boundary\n        repeated.append(a);\n        if (repeated.toString().contains(b)) {\n            return minReps + 1;\n        }\n\n        return -1;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "char_found": [
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "char_not_found": [
        8,
        9
      ],
      "compute_min_reps": [
        12
      ],
      "append_copy": [
        14,
        15,
        16,
        17
      ],
      "search": [
        19
      ],
      "found_match": [
        20
      ],
      "not_found_yet": [
        19
      ],
      "append_extra": [
        23,
        24
      ],
      "search_extra": [
        25
      ],
      "found_match_extra": [
        26
      ],
      "not_found_final": [
        29
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "char_check": [
        9
      ],
      "contains": [
        19
      ],
      "contains_extra": [
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int repeatedStringMatch(string a, string b) {\n        // Every character in b must exist in a\n        bool charInA[26] = {};\n        for (char c : a) charInA[c - 'a'] = true;\n        for (char c : b) {\n            if (!charInA[c - 'a']) return -1;\n        }\n\n        int minReps = (b.size() + a.size() - 1) / a.size();\n\n        string repeated = \"\";\n        for (int i = 0; i < minReps; i++) {\n            repeated += a;\n        }\n\n        if (repeated.find(b) != string::npos) {\n            return minReps;\n        }\n\n        // One more copy covers a match that wraps across a copy boundary\n        repeated += a;\n        if (repeated.find(b) != string::npos) {\n            return minReps + 1;\n        }\n\n        return -1;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "char_found": [
        4,
        5,
        6,
        7
      ],
      "char_not_found": [
        7,
        8
      ],
      "compute_min_reps": [
        11
      ],
      "append_copy": [
        13,
        14,
        15,
        16
      ],
      "search": [
        18
      ],
      "found_match": [
        19
      ],
      "not_found_yet": [
        18
      ],
      "append_extra": [
        22,
        23
      ],
      "search_extra": [
        24
      ],
      "found_match_extra": [
        25
      ],
      "not_found_final": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "char_check": [
        8
      ],
      "contains": [
        18
      ],
      "contains_extra": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int RepeatedStringMatch(string a, string b) {\n        // Every character in b must exist in a\n        bool[] charInA = new bool[26];\n        foreach (char c in a) charInA[c - 'a'] = true;\n        foreach (char c in b) {\n            if (!charInA[c - 'a']) return -1;\n        }\n\n        int minReps = (b.Length + a.Length - 1) / a.Length;\n\n        StringBuilder repeated = new StringBuilder();\n        for (int i = 0; i < minReps; i++) {\n            repeated.Append(a);\n        }\n\n        if (repeated.ToString().Contains(b)) {\n            return minReps;\n        }\n\n        // One more copy covers a match that wraps across a copy boundary\n        repeated.Append(a);\n        if (repeated.ToString().Contains(b)) {\n            return minReps + 1;\n        }\n\n        return -1;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "char_found": [
        3,
        4,
        5,
        6
      ],
      "char_not_found": [
        6,
        7
      ],
      "compute_min_reps": [
        10
      ],
      "append_copy": [
        12,
        13,
        14,
        15
      ],
      "search": [
        17
      ],
      "found_match": [
        18
      ],
      "not_found_yet": [
        17
      ],
      "append_extra": [
        21,
        22
      ],
      "search_extra": [
        23
      ],
      "found_match_extra": [
        24
      ],
      "not_found_final": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "char_check": [
        7
      ],
      "contains": [
        17
      ],
      "contains_extra": [
        23
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func repeatedStringMatch(a string, b string) int {\n    // Every character in b must exist in a\n    charInA := [26]bool{}\n    for _, c := range a {\n        charInA[c-'a'] = true\n    }\n    for _, c := range b {\n        if !charInA[c-'a'] {\n            return -1\n        }\n    }\n\n    minReps := (len(b) + len(a) - 1) / len(a)\n\n    repeated := strings.Repeat(a, minReps)\n    if strings.Contains(repeated, b) {\n        return minReps\n    }\n\n    // One more copy covers a match that wraps across a copy boundary\n    if strings.Contains(repeated+a, b) {\n        return minReps + 1\n    }\n\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "char_found": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "char_not_found": [
        8,
        9
      ],
      "compute_min_reps": [
        13
      ],
      "append_copy": [
        15
      ],
      "search": [
        16
      ],
      "found_match": [
        17
      ],
      "not_found_yet": [
        16
      ],
      "append_extra": [
        20,
        21
      ],
      "search_extra": [
        21
      ],
      "found_match_extra": [
        22
      ],
      "not_found_final": [
        25
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "char_check": [
        8
      ],
      "contains": [
        16
      ],
      "contains_extra": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var repeatedStringMatch = function(a, b) {\n    // Every character in b must exist in a\n    var charSet = new Set(a);\n    for (var i = 0; i < b.length; i++) {\n        if (!charSet.has(b[i])) return -1;\n    }\n\n    var minReps = Math.ceil(b.length / a.length);\n\n    var repeated = a.repeat(minReps);\n    if (repeated.includes(b)) {\n        return minReps;\n    }\n\n    // One more copy covers a match that wraps across a copy boundary\n    if ((repeated + a).includes(b)) {\n        return minReps + 1;\n    }\n\n    return -1;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "char_found": [
        2,
        3,
        4
      ],
      "char_not_found": [
        5
      ],
      "compute_min_reps": [
        8
      ],
      "append_copy": [
        10
      ],
      "search": [
        11
      ],
      "found_match": [
        12
      ],
      "not_found_yet": [
        11
      ],
      "append_extra": [
        15,
        16
      ],
      "search_extra": [
        16
      ],
      "found_match_extra": [
        17
      ],
      "not_found_final": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "char_check": [
        5
      ],
      "contains": [
        11
      ],
      "contains_extra": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function repeatedStringMatch(a: string, b: string): number {\n    // Every character in b must exist in a\n    const charSet = new Set(a);\n    for (let i = 0; i < b.length; i++) {\n        if (!charSet.has(b[i])) return -1;\n    }\n\n    const minReps = Math.ceil(b.length / a.length);\n\n    const repeated = a.repeat(minReps);\n    if (repeated.includes(b)) {\n        return minReps;\n    }\n\n    // One more copy covers a match that wraps across a copy boundary\n    if ((repeated + a).includes(b)) {\n        return minReps + 1;\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "char_found": [
        2,
        3,
        4
      ],
      "char_not_found": [
        5
      ],
      "compute_min_reps": [
        8
      ],
      "append_copy": [
        10
      ],
      "search": [
        11
      ],
      "found_match": [
        12
      ],
      "not_found_yet": [
        11
      ],
      "append_extra": [
        15,
        16
      ],
      "search_extra": [
        16
      ],
      "found_match_extra": [
        17
      ],
      "not_found_final": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "char_check": [
        5
      ],
      "contains": [
        11
      ],
      "contains_extra": [
        16
      ]
    }
  }
};

const RepeatedStringMatchPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (3)",
    "value": {
      "a": "abcd",
      "b": "cdabcdab"
    }
  },
  {
    "id": "ex2",
    "label": "Simple (2)",
    "value": {
      "a": "a",
      "b": "aa"
    }
  },
  {
    "id": "ex3",
    "label": "No match (-1)",
    "value": {
      "a": "abc",
      "b": "xyz"
    }
  },
  {
    "id": "ex4",
    "label": "Extra copy (4)",
    "value": {
      "a": "abc",
      "b": "cabcabca"
    }
  }
];

function generateRepeatedStringMatchSteps(e: any): any[] {
  let t=e.a,a=e.b,r={};for(let e=0;e<t.length;e++)r[`a_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<a.length;e++)r[`b_${e}`]={type:"arrayElement",value:a[e],position:e};let i=new StepRecorder({a:t,b:a,unit:t.length},r);i.record("-",`Start: how many times must "${t}" repeat so that "${a}" appears inside it?`);let o=new Set(t);for(let e=0;e<a.length;e++){let t=a[e];i.update_visual(`b_${e}`,{type:"arrayElement",value:t,position:e,state:"checking"});let n=o.has(t);if(i.add_conditional("char_check",n),!n)return i.update_visual(`b_${e}`,{type:"arrayElement",value:t,position:e,state:"mismatch"}),i.update_variable("result",-1),i.add_new_visual("verdict",{type:"metadata",value:-1}),i.record("char_not_found",`'${t}' in b never appears in a, so b can never be a substring. Return -1.`),i.record("complete","Done: return -1."),i.getSteps();i.update_visual(`b_${e}`,{type:"arrayElement",value:t,position:e,state:"matched"}),i.record("char_found",`'${t}' occurs in a. Keep checking.`)}for(let e=0;e<a.length;e++)i.update_visual(`b_${e}`,{type:"arrayElement",value:a[e],position:e});let s=Math.ceil(a.length/t.length);i.update_variable("minReps",s),i.record("compute_min_reps",`b needs at least minReps = ceil(${a.length} / ${t.length}) = ${s} copies of a to have room.`);let h="";for(let e=0;e<s;e++){h+=t;for(let a=0;a<t.length;a++){let n=e*t.length+a;i.add_new_visual(`r_${n}`,{type:"arrayElement",value:t[a],position:n})}i.record("append_copy",`Append copy ${e+1} of ${s}: repeated = "${h}".`)}let l=[],c=[],d=()=>{for(let e of l)i.update_visual(`r_${e}`,{type:"arrayElement",value:h[e],position:e});for(let e of c)i.update_visual(`b_${e}`,{type:"arrayElement",value:a[e],position:e});l=[],c=[]},p=e=>{let t=-1,n=h.length-a.length;for(let r=0;r<=n;r++){let n=0;for(;n<a.length&&h[r+n]===a[n];)n++;let o=n===a.length;i.update_visual("window",{type:"range",start:r,end:r+a.length-1,label:"window",state:"checking"}),d();let s=o?a.length:n;for(let e=0;e<s;e++)i.update_visual(`r_${r+e}`,{type:"arrayElement",value:h[r+e],position:r+e,state:"checking"}),l.push(r+e),i.update_visual(`b_${e}`,{type:"arrayElement",value:a[e],position:e,state:"checking"}),c.push(e);o||(i.update_visual(`r_${r+n}`,{type:"arrayElement",value:h[r+n],position:r+n,state:"mismatch"}),l.push(r+n),i.update_visual(`b_${n}`,{type:"arrayElement",value:a[n],position:n,state:"mismatch"}),c.push(n));let p="search"===e?"contains":"contains_extra";if(o){i.add_conditional(p,!0),i.record(e,`Offset ${r}: "${h.slice(r,r+a.length)}" equals b. Match found!`),t=r;break}i.add_conditional(p,!1),i.record(e,`Offset ${r}: '${h[r+n]}' ≠ b[${n}] = '${a[n]}'. Slide b right.`)}return t},u=e=>{for(let t=0;t<a.length;t++)i.update_visual(`r_${e+t}`,{type:"arrayElement",value:h[e+t],position:e+t,state:"matched"}),i.update_visual(`b_${t}`,{type:"arrayElement",value:a[t],position:t,state:"matched"});i.update_visual("window",{type:"range",start:e,end:e+a.length-1,label:"window",state:"matched"})};i.add_new_visual("window",{type:"range",start:0,end:a.length-1,label:"window",state:"checking"});let m=p("search");if(m>=0)return u(m),i.update_variable("result",s),i.add_new_visual("verdict",{type:"metadata",value:s}),i.record("found_match",`b fits inside ${s} copies of a. Return ${s}.`),i.record("complete",`Done: return ${s}.`),i.getSteps();d(),i.record("not_found_yet","b does not fit yet. A window may straddle the seam, so try one extra copy."),h+=t;for(let e=0;e<t.length;e++){let a=s*t.length+e;i.add_new_visual(`r_${a}`,{type:"arrayElement",value:t[e],position:a})}i.record("append_extra",`Append one more copy: repeated = "${h}" (${s+1} copies).`);let _=p("search_extra");if(_>=0)return u(_),i.update_variable("result",s+1),i.add_new_visual("verdict",{type:"metadata",value:s+1}),i.record("found_match_extra",`b fits after one extra copy. Return ${s+1}.`),i.record("complete",`Done: return ${s+1}.`),i.getSteps();d(),i.delete_visual("window");for(let e=0;e<a.length;e++)i.update_visual(`b_${e}`,{type:"arrayElement",value:a[e],position:e,state:"failed"});return i.update_variable("result",-1),i.add_new_visual("verdict",{type:"metadata",value:-1}),i.record("not_found_final","b never appears, even with the extra copy. Return -1."),i.record("complete","Done: return -1."),i.getSteps()
}

export function RepeatedStringMatchProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RepeatedStringMatchTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRepeatedStringMatchSteps(e) as any[];
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
      title="Repeated String Match"
      slug="repeated-string-match"
      approaches={approaches}
      presets={RepeatedStringMatchPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of Distinct Substrings in a String (number-of-distinct-substrings-in-a-string)
// ==========================================

const NumberOfDistinctSubstringsInAStringTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def countDistinct(self, s: str) -> int:\n        seen = set()\n        n = len(s)\n\n        # Generate all substrings and add to set\n        for i in range(n):\n            for j in range(i + 1, n + 1):\n                seen.add(s[i:j])\n        return len(seen)",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4
      ],
      "outer_loop": [
        6,
        7
      ],
      "inner_loop": [
        8
      ],
      "add_substring": [
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "for_i": [
        7
      ],
      "for_j": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int countDistinct(String s) {\n        Set<String> seen = new HashSet<>();\n        int n = s.length();\n\n        // Generate all substrings and add to set\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j <= n; j++) {\n                seen.add(s.substring(i, j));\n            }\n        }\n        return seen.size();\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4
      ],
      "outer_loop": [
        6,
        7
      ],
      "inner_loop": [
        8
      ],
      "add_substring": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "for_i": [
        7
      ],
      "for_j": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int countDistinct(string s) {\n        unordered_set<string> seen;\n        int n = s.size();\n\n        // Generate all substrings and add to set\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j <= n; j++) {\n                seen.insert(s.substr(i, j - i));\n            }\n        }\n        return seen.size();\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "init": [
        4,
        5
      ],
      "outer_loop": [
        7,
        8
      ],
      "inner_loop": [
        9
      ],
      "add_substring": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "for_i": [
        8
      ],
      "for_j": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int CountDistinct(string s) {\n        HashSet<string> seen = new HashSet<string>();\n        int n = s.Length;\n\n        // Generate all substrings and add to set\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j <= n; j++) {\n                seen.Add(s.Substring(i, j - i));\n            }\n        }\n        return seen.Count;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4
      ],
      "outer_loop": [
        6,
        7
      ],
      "inner_loop": [
        8
      ],
      "add_substring": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "for_i": [
        7
      ],
      "for_j": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countDistinct(s string) int {\n    seen := make(map[string]bool)\n    n := len(s)\n\n    // Generate all substrings and add to map\n    for i := 0; i < n; i++ {\n        for j := i + 1; j <= n; j++ {\n            seen[s[i:j]] = true\n        }\n    }\n    return len(seen)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "outer_loop": [
        5,
        6
      ],
      "inner_loop": [
        7
      ],
      "add_substring": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "for_i": [
        6
      ],
      "for_j": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var countDistinct = function(s) {\n    var seen = new Set();\n    var n = s.length;\n\n    // Generate all substrings and add to set\n    for (var i = 0; i < n; i++) {\n        for (var j = i + 1; j <= n; j++) {\n            seen.add(s.substring(i, j));\n        }\n    }\n    return seen.size;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "outer_loop": [
        5,
        6
      ],
      "inner_loop": [
        7
      ],
      "add_substring": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "for_i": [
        6
      ],
      "for_j": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countDistinct(s: string): number {\n    const seen = new Set<string>();\n    const n = s.length;\n\n    // Generate all substrings and add to set\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j <= n; j++) {\n            seen.add(s.substring(i, j));\n        }\n    }\n    return seen.size;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "outer_loop": [
        5,
        6
      ],
      "inner_loop": [
        7
      ],
      "add_substring": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "for_i": [
        6
      ],
      "for_j": [
        7
      ]
    }
  }
};

const NumberOfDistinctSubstringsInAStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "\"abc\" → 6",
    "value": {
      "s": "abc"
    }
  },
  {
    "id": "ex2",
    "label": "\"aab\" → 5",
    "value": {
      "s": "aab"
    }
  },
  {
    "id": "ex3",
    "label": "\"abab\" → 7",
    "value": {
      "s": "abab"
    }
  }
];

function generateNumberOfDistinctSubstringsInAStringSteps(e: any): any[] {
  let t=e.s||"",n=t.length,a={};for(let e=0;e<n;e++)a[`char_${e}`]={type:"arrayElement",value:t[e],position:e};a.trie_root={type:"trieNode",char:"",isEndOfWord:!1};let r=new StepRecorder({},a);r.add_new_visual("meta_count",{type:"metadata",value:0}),r.add_new_visual("meta_sub",{type:"metadata",value:""}),r.add_new_visual("meta_flash",{type:"metadata",value:""}),r.record("-","Start: Count distinct substrings by inserting every suffix into a trie");let s=new Map;s.set("","trie_root");let o=new Map;o.set("trie_root",{char:""});let l=(e,t)=>{let n=o.get(e);r.update_visual(e,{type:"trieNode",char:n.char,isEndOfWord:!1,...n.parent&&{parent:n.parent,edgeLabel:n.edgeLabel},...t&&{state:t}})},u=0;for(let e=0;e<n;e++){s.forEach(e=>l(e,void 0)),l("trie_root","cursor"),r.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),r.update_visual("ptr_j",{type:"pointer",position:e,label:"j"}),r.delete_visual("sub_range"),r.update_visual("meta_sub",{type:"metadata",value:""}),r.update_visual("meta_flash",{type:"metadata",value:""}),r.add_conditional("for_i",!0),r.record("outer_loop",`Start suffix at i=${e}: insert "${t.substring(e)}" character by character`);let i="",a="trie_root";for(let d=e;d<n;d++){let n=t[d],c=i+n,h=t.substring(e,d+1);if(l(a,"cursor"),r.update_visual("ptr_j",{type:"pointer",position:d,label:"j"}),r.update_visual("sub_range",{type:"range",start:e,end:d,label:"substring"}),r.update_visual("meta_sub",{type:"metadata",value:h}),r.update_visual("meta_flash",{type:"metadata",value:""}),r.add_conditional("for_j",!0),r.record("inner_loop",`Process s[${d}]='${n}': current substring "${h}"`),s.has(c)){let e=s.get(c);l(a,"path"),l(e,"cursor"),r.add_conditional("is_new",!1),r.record("traverse_existing",`"${h}" already seen — follow the existing '${n}' edge`),a=e}else{let e=`trie_${c}`;s.set(c,e),o.set(e,{char:n,parent:a,edgeLabel:n}),u++,l(a,"path"),l(e,"new"),r.update_visual("meta_count",{type:"metadata",value:u}),r.update_visual("meta_flash",{type:"metadata",value:"new"}),r.add_conditional("is_new",!0),r.record("create_node",`"${h}" is new — create a trie node. Distinct count = ${u}`),a=e}i=c}}return r.delete_visual("ptr_i"),r.delete_visual("ptr_j"),r.delete_visual("sub_range"),s.forEach(e=>{"trie_root"!==e?l(e,"done"):l(e,void 0)}),r.update_visual("meta_count",{type:"metadata",value:u}),r.update_visual("meta_sub",{type:"metadata",value:""}),r.update_visual("meta_flash",{type:"metadata",value:"result"}),r.update_variable("result",u),r.add_conditional("for_i",!1),r.add_conditional("for_j",!1),r.record("complete",`Complete! ${u} trie nodes (excluding root) = ${u} distinct substrings`),r.getSteps()
}

export function NumberOfDistinctSubstringsInAStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOfDistinctSubstringsInAStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNumberOfDistinctSubstringsInAStringSteps(e) as any[];
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
      title="Number of Distinct Substrings in a String"
      slug="number-of-distinct-substrings-in-a-string"
      approaches={approaches}
      presets={NumberOfDistinctSubstringsInAStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Happy Prefix (longest-happy-prefix)
// ==========================================

const LongestHappyPrefixTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def longestPrefix(self, s: str) -> str:\n        n = len(s)\n\n        # Try each prefix length from longest to shortest\n        for k in range(n - 1, 0, -1):\n            # Compare prefix s[0:k] with suffix s[n-k:n]\n            if s[:k] == s[n - k:]:\n                return s[:k]\n\n        return \"\"",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_length": [
        5,
        6
      ],
      "compare_pair": [
        7,
        8
      ],
      "found": [
        9
      ],
      "not_found": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "k_loop": [
        6
      ],
      "chars_equal": [
        8
      ],
      "if_match": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String longestPrefix(String s) {\n        int n = s.length();\n\n        // Try each prefix length from longest to shortest\n        for (int k = n - 1; k >= 1; k--) {\n            boolean match = true;\n            // Compare prefix s[0..k-1] with suffix s[n-k..n-1]\n            for (int i = 0; i < k; i++) {\n                if (s.charAt(i) != s.charAt(n - k + i)) {\n                    match = false;\n                    break;\n                }\n            }\n            if (match) {\n                return s.substring(0, k);\n            }\n        }\n\n        return \"\";\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_length": [
        5,
        6,
        7
      ],
      "compare_pair": [
        8,
        9,
        10
      ],
      "found": [
        15,
        16
      ],
      "not_found": [
        11,
        12
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "k_loop": [
        6
      ],
      "chars_equal": [
        10
      ],
      "if_match": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string longestPrefix(string s) {\n        int n = s.size();\n\n        // Try each prefix length from longest to shortest\n        for (int k = n - 1; k >= 1; k--) {\n            bool match = true;\n            // Compare prefix s[0..k-1] with suffix s[n-k..n-1]\n            for (int i = 0; i < k; i++) {\n                if (s[i] != s[n - k + i]) {\n                    match = false;\n                    break;\n                }\n            }\n            if (match) {\n                return s.substr(0, k);\n            }\n        }\n\n        return \"\";\n    }\n};",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "try_length": [
        6,
        7,
        8
      ],
      "compare_pair": [
        9,
        10,
        11
      ],
      "found": [
        16,
        17
      ],
      "not_found": [
        12,
        13
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "k_loop": [
        7
      ],
      "chars_equal": [
        11
      ],
      "if_match": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string LongestPrefix(string s) {\n        int n = s.Length;\n\n        // Try each prefix length from longest to shortest\n        for (int k = n - 1; k >= 1; k--) {\n            bool match = true;\n            // Compare prefix s[0..k-1] with suffix s[n-k..n-1]\n            for (int i = 0; i < k; i++) {\n                if (s[i] != s[n - k + i]) {\n                    match = false;\n                    break;\n                }\n            }\n            if (match) {\n                return s.Substring(0, k);\n            }\n        }\n\n        return \"\";\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_length": [
        5,
        6,
        7
      ],
      "compare_pair": [
        8,
        9,
        10
      ],
      "found": [
        15,
        16
      ],
      "not_found": [
        11,
        12
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "k_loop": [
        6
      ],
      "chars_equal": [
        10
      ],
      "if_match": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestPrefix(s string) string {\n    n := len(s)\n\n    // Try each prefix length from longest to shortest\n    for k := n - 1; k >= 1; k-- {\n        match := true\n        // Compare prefix s[0..k-1] with suffix s[n-k..n-1]\n        for i := 0; i < k; i++ {\n            if s[i] != s[n-k+i] {\n                match = false\n                break\n            }\n        }\n        if match {\n            return s[:k]\n        }\n    }\n\n    return \"\"\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "compare_pair": [
        7,
        8,
        9
      ],
      "found": [
        14,
        15
      ],
      "not_found": [
        10,
        11
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "k_loop": [
        5
      ],
      "chars_equal": [
        9
      ],
      "if_match": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestPrefix = function(s) {\n    var n = s.length;\n\n    // Try each prefix length from longest to shortest\n    for (var k = n - 1; k >= 1; k--) {\n        var match = true;\n        // Compare prefix s[0..k-1] with suffix s[n-k..n-1]\n        for (var i = 0; i < k; i++) {\n            if (s[i] !== s[n - k + i]) {\n                match = false;\n                break;\n            }\n        }\n        if (match) {\n            return s.substring(0, k);\n        }\n    }\n\n    return \"\";\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "compare_pair": [
        7,
        8,
        9
      ],
      "found": [
        14,
        15
      ],
      "not_found": [
        10,
        11
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "k_loop": [
        5
      ],
      "chars_equal": [
        9
      ],
      "if_match": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestPrefix(s: string): string {\n    const n = s.length;\n\n    // Try each prefix length from longest to shortest\n    for (let k = n - 1; k >= 1; k--) {\n        let match = true;\n        // Compare prefix s[0..k-1] with suffix s[n-k..n-1]\n        for (let i = 0; i < k; i++) {\n            if (s[i] !== s[n - k + i]) {\n                match = false;\n                break;\n            }\n        }\n        if (match) {\n            return s.substring(0, k);\n        }\n    }\n\n    return \"\";\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "compare_pair": [
        7,
        8,
        9
      ],
      "found": [
        14,
        15
      ],
      "not_found": [
        10,
        11
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "k_loop": [
        5
      ],
      "chars_equal": [
        9
      ],
      "if_match": [
        14
      ]
    }
  }
};

const LongestHappyPrefixPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "\"level\" → \"l\"",
    "value": {
      "s": "level"
    }
  },
  {
    "id": "ex2",
    "label": "\"ababab\" → \"abab\"",
    "value": {
      "s": "ababab"
    }
  },
  {
    "id": "ex3",
    "label": "\"acbabc\" → \"\"",
    "value": {
      "s": "acbabc"
    }
  },
  {
    "id": "ex4",
    "label": "\"aaaa\" → \"aaa\"",
    "value": {
      "s": "aaaa"
    }
  }
];

function generateLongestHappyPrefixSteps(e: any): any[] {
  let t=e.s??"",a=t.length,n={};for(let e=0;e<a;e++)n[`char_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};n.cnt_k={type:"stateElement",value:"k = -",index:0,state:"standard"},n.cnt_result={type:"stateElement",value:'result = ""',index:1,state:"standard"},n.meta_scan={type:"metadata",value:"",label:"scan",state:"standard"};let s=new StepRecorder({s:t,n:a,k:void 0,i:void 0,result:void 0},n);function l(e,i,n){for(let l=0;l<a;l++){let r=i>=0?i:-1,o=i>=0?a-e+i:-1,p=e>0&&l<e,h=e>0&&l>=a-e;s.update_visual(`char_${l}`,{type:"arrayElement",value:t[l],position:l,state:n&&(l===r||l===o)?"mismatch":l===r||l===o?"current":p?"prefix":h?"suffix":"muted"})}}function r(e,t,a){s.update_visual("cnt_k",{type:"stateElement",value:`k = ${e<0?"-":e}`,index:0,state:"k"===a?"active":"standard"}),s.update_visual("cnt_result",{type:"stateElement",value:`result = "${t}"`,index:1,state:"result"===a?"active":"standard"})}function o(e){s.update_visual("meta_scan",{type:"metadata",value:e,label:"scan",state:"standard"})}s.record("-",`Find the longest proper prefix of "${t}" that is also a suffix`);let p="";for(let e=a-1;e>=1;e--){s.update_variable("k",e),s.add_conditional("k_loop",!0),l(e,-1,!1),r(e,p,"k"),o(`prefix "${t.slice(0,e)}" vs suffix "${t.slice(a-e)}"`),s.record("try_length",`Try length ${e}: does the prefix "${t.slice(0,e)}" equal the suffix "${t.slice(a-e)}"?`);let i=!0;for(let n=0;n<e;n++){let r=t[n]===t[a-e+n];if(s.update_variable("i",n),s.add_conditional("chars_equal",r),l(e,n,!r),o(`s[${n}] = '${t[n]}' vs s[${a-e+n}] = '${t[a-e+n]}'`),s.record("compare_pair",r?`Position ${n} matches: both are '${t[n]}'.`:`Position ${n} differs: '${t[n]}' against '${t[a-e+n]}', so length ${e} fails.`),!r){i=!1;break}}if(s.add_conditional("if_match",i),i){p=t.slice(0,e),l(e,-1,!1),r(e,p,"result"),o(`"${p}" is both a prefix and a suffix`),s.record("found",`Every position matched, so "${p}" is the longest happy prefix.`);break}l(e,-1,!1),r(e,p,""),o(`length ${e} fails, try one shorter`),s.record("not_found",`Length ${e} does not work, so try a shorter prefix.`)}return s.update_variable("result",p),s.delete_variable("k"),s.delete_variable("i"),l(p.length,-1,!1),r(p.length,p,"result"),o(p?`longest happy prefix = "${p}"`:"no happy prefix exists"),s.record("complete",p?`Done! The longest happy prefix is "${p}".`:'Done! No proper prefix is also a suffix, so return "".'),s.getSteps()
}

export function LongestHappyPrefixProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestHappyPrefixTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestHappyPrefixSteps(e) as any[];
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
      title="Longest Happy Prefix"
      slug="longest-happy-prefix"
      approaches={approaches}
      presets={LongestHappyPrefixPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Shortest Palindrome (shortest-palindrome)
// ==========================================

const ShortestPalindromeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def shortestPalindrome(self, s: str) -> str:\n        n = len(s)\n        # Try each prefix length from longest to shortest\n        for k in range(n, -1, -1):\n            if self.is_palindrome(s, 0, k - 1):\n                # Reverse the remaining suffix and prepend\n                suffix = s[k:]\n                return suffix[::-1] + s\n        return s\n\n    def is_palindrome(self, s: str, left: int, right: int) -> bool:\n        while left < right:\n            if s[left] != s[right]:\n                return False\n            left += 1\n            right -= 1\n        return True",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_prefix": [
        4,
        5
      ],
      "check_pair": [
        13,
        14
      ],
      "not_palindrome": [
        15
      ],
      "palindrome_ok": [
        18
      ],
      "build_result": [
        7,
        8
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "k_loop": [
        5
      ],
      "if_palindrome": [
        6
      ],
      "chars_equal": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String shortestPalindrome(String s) {\n        int n = s.length();\n        // Try each prefix length from longest to shortest\n        for (int k = n; k >= 0; k--) {\n            if (isPalindrome(s, 0, k - 1)) {\n                // Reverse the remaining suffix and prepend\n                String suffix = s.substring(k);\n                StringBuilder reversed = new StringBuilder(suffix).reverse();\n                return reversed.toString() + s;\n            }\n        }\n        return s;\n    }\n\n    private boolean isPalindrome(String s, int left, int right) {\n        while (left < right) {\n            if (s.charAt(left) != s.charAt(right)) {\n                return false;\n            }\n            left++;\n            right--;\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_prefix": [
        4,
        5
      ],
      "check_pair": [
        17,
        18
      ],
      "not_palindrome": [
        19
      ],
      "palindrome_ok": [
        24
      ],
      "build_result": [
        7,
        8,
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "k_loop": [
        5
      ],
      "if_palindrome": [
        6
      ],
      "chars_equal": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string shortestPalindrome(string s) {\n        int n = s.length();\n        // Try each prefix length from longest to shortest\n        for (int k = n; k >= 0; k--) {\n            if (isPalindrome(s, 0, k - 1)) {\n                // Reverse the remaining suffix and prepend\n                string suffix = s.substr(k);\n                string reversed(suffix.rbegin(), suffix.rend());\n                return reversed + s;\n            }\n        }\n        return s;\n    }\n\nprivate:\n    bool isPalindrome(const string& s, int left, int right) {\n        while (left < right) {\n            if (s[left] != s[right]) {\n                return false;\n            }\n            left++;\n            right--;\n        }\n        return true;\n    }\n};",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "try_prefix": [
        5,
        6
      ],
      "check_pair": [
        19,
        20
      ],
      "not_palindrome": [
        21
      ],
      "palindrome_ok": [
        26
      ],
      "build_result": [
        8,
        9,
        10
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "k_loop": [
        6
      ],
      "if_palindrome": [
        7
      ],
      "chars_equal": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string ShortestPalindrome(string s) {\n        int n = s.Length;\n        // Try each prefix length from longest to shortest\n        for (int k = n; k >= 0; k--) {\n            if (IsPalindrome(s, 0, k - 1)) {\n                // Reverse the remaining suffix and prepend\n                char[] suffix = s.Substring(k).ToCharArray();\n                Array.Reverse(suffix);\n                return new string(suffix) + s;\n            }\n        }\n        return s;\n    }\n\n    private bool IsPalindrome(string s, int left, int right) {\n        while (left < right) {\n            if (s[left] != s[right]) {\n                return false;\n            }\n            left++;\n            right--;\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_prefix": [
        4,
        5
      ],
      "check_pair": [
        17,
        18
      ],
      "not_palindrome": [
        19
      ],
      "palindrome_ok": [
        24
      ],
      "build_result": [
        7,
        8,
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "k_loop": [
        5
      ],
      "if_palindrome": [
        6
      ],
      "chars_equal": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func shortestPalindrome(s string) string {\n    n := len(s)\n    // Try each prefix length from longest to shortest\n    for k := n; k >= 0; k-- {\n        if isPalindrome(s, 0, k-1) {\n            // Reverse the remaining suffix and prepend\n            suffix := s[k:]\n            reversed := reverseString(suffix)\n            return reversed + s\n        }\n    }\n    return s\n}\n\nfunc isPalindrome(s string, left, right int) bool {\n    for left < right {\n        if s[left] != s[right] {\n            return false\n        }\n        left++\n        right--\n    }\n    return true\n}\n\nfunc reverseString(s string) string {\n    runes := []byte(s)\n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        runes[i], runes[j] = runes[j], runes[i]\n    }\n    return string(runes)\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_prefix": [
        3,
        4
      ],
      "check_pair": [
        16,
        17
      ],
      "not_palindrome": [
        18
      ],
      "palindrome_ok": [
        23
      ],
      "build_result": [
        6,
        7,
        8
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "k_loop": [
        4
      ],
      "if_palindrome": [
        5
      ],
      "chars_equal": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var shortestPalindrome = function (s) {\n  var n = s.length;\n  // Try each prefix length from longest to shortest\n  for (var k = n; k >= 0; k--) {\n    if (isPalindrome(s, 0, k - 1)) {\n      // Reverse the remaining suffix and prepend\n      var suffix = s.substring(k);\n      var reversed = suffix.split(\"\").reverse().join(\"\");\n      return reversed + s;\n    }\n  }\n  return s;\n};\n\nvar isPalindrome = function (s, left, right) {\n  while (left < right) {\n    if (s[left] !== s[right]) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  return true;\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_prefix": [
        3,
        4
      ],
      "check_pair": [
        16,
        17
      ],
      "not_palindrome": [
        18
      ],
      "palindrome_ok": [
        23
      ],
      "build_result": [
        6,
        7,
        8
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "k_loop": [
        4
      ],
      "if_palindrome": [
        5
      ],
      "chars_equal": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function shortestPalindrome(s: string): string {\n    const n = s.length;\n    // Try each prefix length from longest to shortest\n    for (let k = n; k >= 0; k--) {\n        if (isPalindromeCheck(s, 0, k - 1)) {\n            // Reverse the remaining suffix and prepend\n            const suffix = s.substring(k);\n            const reversed = suffix.split(\"\").reverse().join(\"\");\n            return reversed + s;\n        }\n    }\n    return s;\n}\n\nfunction isPalindromeCheck(s: string, left: number, right: number): boolean {\n    while (left < right) {\n        if (s[left] !== s[right]) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_prefix": [
        3,
        4
      ],
      "check_pair": [
        16,
        17
      ],
      "not_palindrome": [
        18
      ],
      "palindrome_ok": [
        23
      ],
      "build_result": [
        6,
        7,
        8
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "k_loop": [
        4
      ],
      "if_palindrome": [
        5
      ],
      "chars_equal": [
        17
      ]
    }
  }
};

const ShortestPalindromePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "aacecaaa",
    "value": {
      "s": "aacecaaa"
    }
  },
  {
    "id": "ex2",
    "label": "abcd",
    "value": {
      "s": "abcd"
    }
  },
  {
    "id": "ex3",
    "label": "aba",
    "value": {
      "s": "aba"
    }
  },
  {
    "id": "ex4",
    "label": "abbacd",
    "value": {
      "s": "abbacd"
    }
  }
];

function generateShortestPalindromeSteps(e: any): any[] {
  let t=e.s??"",a=t.length,i={};for(let e=0;e<a;e++)i[`char_${e}`]={type:"arrayElement",value:t[e],position:e,state:"muted"};for(let e=0;e<a;e++)i[`lane_${e}`]={type:"arrayElement",value:"",position:e,state:"pending"};i.cnt_forward={type:"stateElement",value:"forward = 0",index:0,state:"standard"},i.cnt_backward={type:"stateElement",value:"backward = 0",index:1,state:"standard"},i.cnt_best={type:"stateElement",value:"bestLen = 0",index:2,state:"standard"},i.meta_scan={type:"metadata",value:"",label:"scan",state:"standard"};let n=new StepRecorder({s:t,n:a,base:31,mod:0x3b9aca07,i:void 0,forwardHash:void 0,backwardHash:void 0,bestLen:void 0,result:void 0},i);function s(e,r){for(let i=0;i<a;i++)n.update_visual(`char_${i}`,{type:"arrayElement",value:t[i],position:i,state:i===e?"current":i<r?"prefix":i<e?"standard":"muted"})}let l=Array(a).fill("pending");function o(e){for(let t=0;t<a;t++)n.update_visual(`lane_${t}`,{type:"arrayElement",value:"pending"===l[t]?"":"best"===l[t]?"P":"-",position:t,state:t===e?"active":"best"===l[t]?"best":l[t]})}function d(e,t,a,r){n.update_visual("cnt_forward",{type:"stateElement",value:`forward = ${e}`,index:0,state:"hash"===r?"active":"standard"}),n.update_visual("cnt_backward",{type:"stateElement",value:`backward = ${t}`,index:1,state:"hash"===r?"active":"standard"}),n.update_visual("cnt_best",{type:"stateElement",value:`bestLen = ${a}`,index:2,state:"best"===r?"active":"standard"})}function h(e){n.update_visual("meta_scan",{type:"metadata",value:e,label:"scan",state:"standard"})}n.record("-",`Prepend as few characters as possible to make "${t}" a palindrome`);let c=0,u=0,f=1,p=0;d(0,0,0,""),h("base = 31, both hashes start at 0"),n.record("init_hash","Read the string as a base-31 number: the forward hash appends, the backward hash prepends.");for(let e=0;e<a;e++){let a=t.charCodeAt(e)-96;c=(31*c+a)%0x3b9aca07,u=(u+a*f)%0x3b9aca07,f=31*f%0x3b9aca07,n.update_variable("i",e),n.update_variable("forwardHash",c),n.update_variable("backwardHash",u),n.add_conditional("i_loop",!0),s(e,p),o(e),d(c,u,p,"hash"),h(`s[${e}] = '${t[e]}' folds into both hashes`),n.record("update_hashes",`Add '${t[e]}' to both directions: forward = ${c}, backward = ${u}.`);let r=c===u;n.add_conditional("hashes_equal",r),r?(p=e+1,l[e]="best",n.update_variable("bestLen",p),s(e,p),o(e),d(c,u,p,"best"),h(`"${t.slice(0,p)}" is a palindrome`),n.record("hash_match",`Both hashes read ${c}, so "${t.slice(0,e+1)}" is a palindrome: bestLen = ${p}.`)):(l[e]="done",o(e),d(c,u,p,""),h(`${c} != ${u}`),n.record("no_match",`The hashes differ, so "${t.slice(0,e+1)}" is not a palindrome. bestLen stays ${p}.`))}n.add_conditional("i_loop",!1);let m=t.substring(p),g=m.split("").reverse().join("")+t;return n.update_variable("result",g),n.delete_variable("i"),s(-1,p),o(-1),d(c,u,p,"best"),h(`reverse "${m}" and put it in front`),n.record("build_result",`The longest palindromic prefix has length ${p}, so reverse the leftover "${m}" and prepend it.`),n.record("complete",`Done! Shortest palindrome: "${g}"`),n.getSteps()
}

export function ShortestPalindromeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ShortestPalindromeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateShortestPalindromeSteps(e) as any[];
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
      title="Shortest Palindrome"
      slug="shortest-palindrome"
      approaches={approaches}
      presets={ShortestPalindromePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Duplicate Substring (longest-duplicate-substring)
// ==========================================

const LongestDuplicateSubstringTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def longestDupSubstring(self, s: str) -> str:\n        n = len(s)\n        # Try every length from longest to shortest\n        for length in range(n - 1, 0, -1):\n            seen = set()\n            for i in range(n - length + 1):\n                sub = s[i:i + length]\n                if sub in seen:\n                    return sub\n                seen.add(sub)\n        return \"\"",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "take_window": [
        7,
        8
      ],
      "found": [
        9,
        10
      ],
      "remember": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "len_loop": [
        5
      ],
      "i_loop": [
        7
      ],
      "seen_before": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String longestDupSubstring(String s) {\n        int n = s.length();\n        // Try every length from longest to shortest\n        for (int len = n - 1; len >= 1; len--) {\n            HashSet<String> seen = new HashSet<>();\n            for (int i = 0; i <= n - len; i++) {\n                String sub = s.substring(i, i + len);\n                if (!seen.add(sub)) {\n                    return sub;\n                }\n            }\n        }\n        return \"\";\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "take_window": [
        7,
        8
      ],
      "found": [
        9,
        10,
        11
      ],
      "remember": [
        9
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "len_loop": [
        5
      ],
      "i_loop": [
        7
      ],
      "seen_before": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string longestDupSubstring(string s) {\n        int n = s.size();\n        // Try every length from longest to shortest\n        for (int len = n - 1; len >= 1; len--) {\n            unordered_set<string> seen;\n            for (int i = 0; i <= n - len; i++) {\n                string sub = s.substr(i, len);\n                if (seen.count(sub)) {\n                    return sub;\n                }\n                seen.insert(sub);\n            }\n        }\n        return \"\";\n    }\n};",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "try_length": [
        5,
        6,
        7
      ],
      "take_window": [
        8,
        9
      ],
      "found": [
        10,
        11,
        12
      ],
      "remember": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "len_loop": [
        6
      ],
      "i_loop": [
        8
      ],
      "seen_before": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string LongestDupSubstring(string s) {\n        int n = s.Length;\n        // Try every length from longest to shortest\n        for (int len = n - 1; len >= 1; len--) {\n            HashSet<string> seen = new HashSet<string>();\n            for (int i = 0; i <= n - len; i++) {\n                string sub = s.Substring(i, len);\n                if (!seen.Add(sub)) {\n                    return sub;\n                }\n            }\n        }\n        return \"\";\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "try_length": [
        4,
        5,
        6
      ],
      "take_window": [
        7,
        8
      ],
      "found": [
        9,
        10,
        11
      ],
      "remember": [
        9
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "len_loop": [
        5
      ],
      "i_loop": [
        7
      ],
      "seen_before": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestDupSubstring(s string) string {\n    n := len(s)\n    // Try every length from longest to shortest\n    for length := n - 1; length >= 1; length-- {\n        seen := make(map[string]bool)\n        for i := 0; i <= n-length; i++ {\n            sub := s[i : i+length]\n            if seen[sub] {\n                return sub\n            }\n            seen[sub] = true\n        }\n    }\n    return \"\"\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_length": [
        3,
        4,
        5
      ],
      "take_window": [
        6,
        7
      ],
      "found": [
        8,
        9,
        10
      ],
      "remember": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "len_loop": [
        4
      ],
      "i_loop": [
        6
      ],
      "seen_before": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestDupSubstring = function(s) {\n    const n = s.length;\n    // Try every length from longest to shortest\n    for (let len = n - 1; len >= 1; len--) {\n        const seen = new Set();\n        for (let i = 0; i <= n - len; i++) {\n            const sub = s.substring(i, i + len);\n            if (seen.has(sub)) {\n                return sub;\n            }\n            seen.add(sub);\n        }\n    }\n    return \"\";\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_length": [
        3,
        4,
        5
      ],
      "take_window": [
        6,
        7
      ],
      "found": [
        8,
        9,
        10
      ],
      "remember": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "len_loop": [
        4
      ],
      "i_loop": [
        6
      ],
      "seen_before": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestDupSubstring(s: string): string {\n    const n = s.length;\n    // Try every length from longest to shortest\n    for (let len = n - 1; len >= 1; len--) {\n        const seen = new Set<string>();\n        for (let i = 0; i <= n - len; i++) {\n            const sub = s.substring(i, i + len);\n            if (seen.has(sub)) {\n                return sub;\n            }\n            seen.add(sub);\n        }\n    }\n    return \"\";\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "try_length": [
        3,
        4,
        5
      ],
      "take_window": [
        6,
        7
      ],
      "found": [
        8,
        9,
        10
      ],
      "remember": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "len_loop": [
        4
      ],
      "i_loop": [
        6
      ],
      "seen_before": [
        8
      ]
    }
  }
};

const LongestDuplicateSubstringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "\"banana\" → \"ana\"",
    "value": {
      "s": "banana"
    }
  },
  {
    "id": "ex2",
    "label": "\"abcd\" → \"\"",
    "value": {
      "s": "abcd"
    }
  },
  {
    "id": "ex3",
    "label": "\"aabaa\" → \"aa\"",
    "value": {
      "s": "aabaa"
    }
  },
  {
    "id": "ex4",
    "label": "\"abcabc\" → \"abc\"",
    "value": {
      "s": "abcabc"
    }
  }
];

function generateLongestDuplicateSubstringSteps(e: any): any[] {
  let t=e.s??"",n=t.length,i={};for(let e=0;e<n;e++)i[`char_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};i.cnt_len={type:"stateElement",value:"len = -",index:0,state:"standard"},i.cnt_seen={type:"stateElement",value:"seen = 0 window(s)",index:1,state:"standard"},i.meta_scan={type:"metadata",value:"",label:"scan",state:"standard"},i.meta_note={type:"metadata",value:"",label:"seen",state:"standard"};let s=new StepRecorder({s:t,n,len:void 0,i:void 0,window:void 0,result:void 0},i);function r(e,a,i){for(let r=0;r<n;r++){let n=e>=0&&r>=e&&r<e+a,l=i>=0&&r>=i&&r<i+a;s.update_visual(`char_${r}`,{type:"arrayElement",value:t[r],position:r,state:n?"current":l?"prefix":"muted"})}}function l(e,t,n){s.update_visual("cnt_len",{type:"stateElement",value:`len = ${e<0?"-":e}`,index:0,state:"len"===n?"active":"standard"}),s.update_visual("cnt_seen",{type:"stateElement",value:`seen = ${t} window(s)`,index:1,state:"seen"===n?"active":"standard"})}function o(e){s.update_visual("meta_scan",{type:"metadata",value:e,label:"scan",state:"standard"})}function d(e){s.update_visual("meta_note",{type:"metadata",value:e,label:"seen",state:"standard"})}s.record("-",`Find the longest substring of "${t}" that appears more than once`);let u="",h=new Map;e:for(let e=n-1;e>=1;e--){let a=new Set;h.clear(),s.update_variable("len",e),s.add_conditional("len_loop",!0),r(-1,e,-1),l(e,0,"len"),d(""),o(`try every window of length ${e}`),s.record("try_length",`Try length ${e}: walk every window of that size and watch for a repeat.`);for(let i=0;i<=n-e;i++){let n=t.substring(i,i+e),c=a.has(n);if(s.update_variable("i",i),s.update_variable("window",n),s.add_conditional("i_loop",!0),s.add_conditional("seen_before",c),r(i,e,c?h.get(n):-1),l(e,a.size,"seen"),d(a.size>0?`seen: ${[...a].map(e=>`"${e}"`).join(", ")}`:""),o(`window at ${i} is "${n}"`),s.record("take_window",`Window at index ${i} is "${n}".`),c){u=n,r(i,e,h.get(n)),l(e,a.size,"seen"),o(`"${n}" appeared before at ${h.get(n)}`),s.record("found",`"${n}" already appeared at index ${h.get(n)}, so it is the longest duplicate.`);break e}a.add(n),h.set(n,i),l(e,a.size,"seen"),d(`seen: ${[...a].map(e=>`"${e}"`).join(", ")}`),o(`remember "${n}"`),s.record("remember",`"${n}" is new, so remember it and slide on.`)}}return s.update_variable("result",u),s.delete_variable("len"),s.delete_variable("i"),s.delete_variable("window"),0===u.length&&r(-1,0,-1),l(u.length,0,""),d(""),o(u?`longest duplicate = "${u}"`:"no substring repeats"),s.record("complete",u?`Done! The longest duplicate substring is "${u}".`:'Done! No substring repeats, so return "".'),s.getSteps()
}

export function LongestDuplicateSubstringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestDuplicateSubstringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestDuplicateSubstringSteps(e) as any[];
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
      title="Longest Duplicate Substring"
      slug="longest-duplicate-substring"
      approaches={approaches}
      presets={LongestDuplicateSubstringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Add Bold Tag in String (add-bold-tag-in-string)
// ==========================================

const AddBoldTagInStringTemplates = {
  "python": {
    "language": "python",
    "code": "def addBoldTag(s: str, words: list[str]) -> str:\n    n = len(s)\n    bold = [False] * n\n\n    for word in words:\n        # Mark all positions covered by any word\n        start = s.find(word)\n        while start != -1:\n            for i in range(start, start + len(word)):\n                bold[i] = True\n            start = s.find(word, start + 1)\n\n    result = []\n    # Build result with bold tags at transitions\n    for i in range(n):\n        if bold[i] and (i == 0 or not bold[i - 1]):\n            result.append(\"<b>\")\n        result.append(s[i])\n        if bold[i] and (i == n - 1 or not bold[i + 1]):\n            result.append(\"</b>\")\n\n    return \"\".join(result)",
    "lineMap": {
      "-": [
        1
      ],
      "init_bold": [
        2,
        3
      ],
      "search_word": [
        5,
        7
      ],
      "mark_bold": [
        9,
        10
      ],
      "next_occurrence": [
        11
      ],
      "build_result": [
        13,
        15
      ],
      "open_tag": [
        16,
        17
      ],
      "add_char": [
        18
      ],
      "close_tag": [
        19,
        20
      ],
      "complete": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String addBoldTag(String s, String[] words) {\n    int n = s.length();\n    boolean[] bold = new boolean[n];\n\n    for (String word : words) {\n        // Mark all positions covered by any word\n        int start = s.indexOf(word);\n        while (start != -1) {\n            for (int i = start; i < start + word.length(); i++) {\n                bold[i] = true;\n            }\n            start = s.indexOf(word, start + 1);\n        }\n    }\n\n    StringBuilder result = new StringBuilder();\n    // Build result with bold tags at transitions\n    for (int i = 0; i < n; i++) {\n        if (bold[i] && (i == 0 || !bold[i - 1])) {\n            result.append(\"<b>\");\n        }\n        result.append(s.charAt(i));\n        if (bold[i] && (i == n - 1 || !bold[i + 1])) {\n            result.append(\"</b>\");\n        }\n    }\n\n    return result.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bold": [
        2,
        3
      ],
      "search_word": [
        5,
        7
      ],
      "mark_bold": [
        9,
        10
      ],
      "next_occurrence": [
        12
      ],
      "build_result": [
        16,
        18
      ],
      "open_tag": [
        19,
        20
      ],
      "add_char": [
        22
      ],
      "close_tag": [
        23,
        24
      ],
      "complete": [
        28
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string addBoldTag(string s, vector<string>& words) {\n    int n = s.length();\n    vector<bool> bold(n, false);\n\n    for (const string& word : words) {\n        // Mark all positions covered by any word\n        size_t start = s.find(word);\n        while (start != string::npos) {\n            for (int i = start; i < start + word.length(); i++) {\n                bold[i] = true;\n            }\n            start = s.find(word, start + 1);\n        }\n    }\n\n    string result;\n    // Build result with bold tags at transitions\n    for (int i = 0; i < n; i++) {\n        if (bold[i] && (i == 0 || !bold[i - 1])) {\n            result += \"<b>\";\n        }\n        result += s[i];\n        if (bold[i] && (i == n - 1 || !bold[i + 1])) {\n            result += \"</b>\";\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bold": [
        2,
        3
      ],
      "search_word": [
        5,
        7
      ],
      "mark_bold": [
        9,
        10
      ],
      "next_occurrence": [
        12
      ],
      "build_result": [
        16,
        18
      ],
      "open_tag": [
        19,
        20
      ],
      "add_char": [
        22
      ],
      "close_tag": [
        23,
        24
      ],
      "complete": [
        28
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string AddBoldTag(string s, string[] words) {\n    int n = s.Length;\n    bool[] bold = new bool[n];\n\n    foreach (string word in words) {\n        // Mark all positions covered by any word\n        int start = s.IndexOf(word);\n        while (start != -1) {\n            for (int i = start; i < start + word.Length; i++) {\n                bold[i] = true;\n            }\n            start = s.IndexOf(word, start + 1);\n        }\n    }\n\n    var result = new StringBuilder();\n    // Build result with bold tags at transitions\n    for (int i = 0; i < n; i++) {\n        if (bold[i] && (i == 0 || !bold[i - 1])) {\n            result.Append(\"<b>\");\n        }\n        result.Append(s[i]);\n        if (bold[i] && (i == n - 1 || !bold[i + 1])) {\n            result.Append(\"</b>\");\n        }\n    }\n\n    return result.ToString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bold": [
        2,
        3
      ],
      "search_word": [
        5,
        7
      ],
      "mark_bold": [
        9,
        10
      ],
      "next_occurrence": [
        12
      ],
      "build_result": [
        16,
        18
      ],
      "open_tag": [
        19,
        20
      ],
      "add_char": [
        22
      ],
      "close_tag": [
        23,
        24
      ],
      "complete": [
        28
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func addBoldTag(s string, words []string) string {\n    n := len(s)\n    bold := make([]bool, n)\n\n    for _, word := range words {\n        // Mark all positions covered by any word\n        start := strings.Index(s, word)\n        for start != -1 {\n            for i := start; i < start+len(word); i++ {\n                bold[i] = true\n            }\n            start = strings.Index(s[start+1:], word)\n            if start != -1 {\n                start++\n            }\n        }\n    }\n\n    var result strings.Builder\n    // Build result with bold tags at transitions\n    for i := 0; i < n; i++ {\n        if bold[i] && (i == 0 || !bold[i-1]) {\n            result.WriteString(\"<b>\")\n        }\n        result.WriteByte(s[i])\n        if bold[i] && (i == n-1 || !bold[i+1]) {\n            result.WriteString(\"</b>\")\n        }\n    }\n\n    return result.String()\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bold": [
        2,
        3
      ],
      "search_word": [
        5,
        7
      ],
      "mark_bold": [
        9,
        10
      ],
      "next_occurrence": [
        12
      ],
      "build_result": [
        19,
        21
      ],
      "open_tag": [
        22,
        23
      ],
      "add_char": [
        25
      ],
      "close_tag": [
        26,
        27
      ],
      "complete": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var addBoldTag = function(s, words) {\n    const n = s.length;\n    const bold = new Array(n).fill(false);\n\n    for (const word of words) {\n        // Mark all positions covered by any word\n        let start = s.indexOf(word);\n        while (start !== -1) {\n            for (let i = start; i < start + word.length; i++) {\n                bold[i] = true;\n            }\n            start = s.indexOf(word, start + 1);\n        }\n    }\n\n    let result = \"\";\n    // Build result with bold tags at transitions\n    for (let i = 0; i < n; i++) {\n        if (bold[i] && (i === 0 || !bold[i - 1])) {\n            result += \"<b>\";\n        }\n        result += s[i];\n        if (bold[i] && (i === n - 1 || !bold[i + 1])) {\n            result += \"</b>\";\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bold": [
        2,
        3
      ],
      "search_word": [
        5,
        7
      ],
      "mark_bold": [
        9,
        10
      ],
      "next_occurrence": [
        12
      ],
      "build_result": [
        16,
        18
      ],
      "open_tag": [
        19,
        20
      ],
      "add_char": [
        22
      ],
      "close_tag": [
        23,
        24
      ],
      "complete": [
        28
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function addBoldTag(s: string, words: string[]): string {\n    const n = s.length;\n    const bold: boolean[] = new Array(n).fill(false);\n\n    for (const word of words) {\n        // Mark all positions covered by any word\n        let start = s.indexOf(word);\n        while (start !== -1) {\n            for (let i = start; i < start + word.length; i++) {\n                bold[i] = true;\n            }\n            start = s.indexOf(word, start + 1);\n        }\n    }\n\n    let result = \"\";\n    // Build result with bold tags at transitions\n    for (let i = 0; i < n; i++) {\n        if (bold[i] && (i === 0 || !bold[i - 1])) {\n            result += \"<b>\";\n        }\n        result += s[i];\n        if (bold[i] && (i === n - 1 || !bold[i + 1])) {\n            result += \"</b>\";\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bold": [
        2,
        3
      ],
      "search_word": [
        5,
        7
      ],
      "mark_bold": [
        9,
        10
      ],
      "next_occurrence": [
        12
      ],
      "build_result": [
        16,
        18
      ],
      "open_tag": [
        19,
        20
      ],
      "add_char": [
        22
      ],
      "close_tag": [
        23,
        24
      ],
      "complete": [
        28
      ]
    }
  }
};

const AddBoldTagInStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "abcxyz123",
      "words": "abc,123"
    }
  },
  {
    "id": "ex2",
    "label": "Overlapping",
    "value": {
      "s": "aaabbcc",
      "words": "aaa,aab,bc"
    }
  },
  {
    "id": "ex3",
    "label": "All Bold",
    "value": {
      "s": "aaabbcc",
      "words": "a,b,c"
    }
  }
];

function generateAddBoldTagInStringSteps(e: any): any[] {
  let t=String(e?.s??""),r=String(e?.words??"").split(",").map(e=>e.trim()).filter(e=>e.length>0),n=t.length,l=(e,r,i)=>{let l={};for(let a=0;a<n;a++){let n=e&&a>=e.lo&&a<=e.hi?"checking":i?r.has(a)?"done":"dim":r.has(a)?"done":void 0;l[`char_${a}`]={type:"arrayElement",value:t[a],position:a,...n&&{state:n}}}return l},a=new StepRecorder({s:t,words:r.join(", ")},{...l(null,new Set,!1),meta_word:{type:"metadata",value:""},meta_collected:{type:"metadata",value:[]},meta_merged:{type:"metadata",value:[]},meta_result:{type:"metadata",value:""}}),o=(e,t,r,i,n)=>{for(let[t,r]of Object.entries(l(e,(()=>{let e=new Set;for(let t of s)for(let r=t.lo;r<=t.hi;r++)e.add(r);return e})(),n)))a.update_visual(t,r);a.update_visual("meta_word",{type:"metadata",value:t}),a.update_visual("meta_collected",{type:"metadata",value:s.map(e=>({...e}))}),a.update_visual("meta_merged",{type:"metadata",value:r.map(e=>({...e}))}),a.update_visual("meta_result",{type:"metadata",value:i})},s=[];for(let e of(a.record("-",`Start: bold every occurrence of [${r.join(", ")}] in "${t}"`),r)){o(null,`"${e}"`,[],"",!1),a.record("search_word",`Search for every occurrence of "${e}"`);let r=t.indexOf(e);for(;-1!==r;){let i=r+e.length;s.push({lo:r,hi:i,word:e,state:"found"}),o({lo:r,hi:i},`"${e}"`,[],"",!1),a.record("collect_interval",`Found "${e}" at ${r}, collect the interval [${r}, ${i})`),s[s.length-1].state="",r=t.indexOf(e,r+1)}}if(0===s.length)return o(null,"",[],t,!0),a.record("build_result","No word occurs in s, so nothing is bold"),a.record("complete",`Done, result = "${t}"`),a.getSteps();s.sort((e,t)=>e.lo!==t.lo?e.lo-t.lo:e.hi-t.hi),o(null,"",[],"",!1),a.record("sort_intervals",`Sort the intervals by start: [${s.map(e=>`${e.lo},${e.hi}`).join(") [")})`);let d=[{lo:s[0].lo,hi:s[0].hi,word:s[0].word,state:"merged"}];o({lo:d[0].lo,hi:d[0].hi},"",d,"",!1),a.record("merge",`[${d[0].lo}, ${d[0].hi}) starts the first bold run`);for(let e=1;e<s.length;e++){let t=s[e],r=d[d.length-1];if(t.lo<=r.hi){let e=r.hi;r.hi=Math.max(r.hi,t.hi),o({lo:t.lo,hi:t.hi},"",d,"",!1),a.record("merge",`[${t.lo}, ${t.hi}) starts at or before ${e}, so the run stretches to ${r.hi}`)}else d.push({lo:t.lo,hi:t.hi,word:t.word,state:"merged"}),o({lo:t.lo,hi:t.hi},"",d,"",!1),a.record("merge",`[${t.lo}, ${t.hi}) starts after ${r.hi}, so it begins a new run`)}let c="",u=0;for(let e=0;e<t.length;e++){let r=u<d.length&&e===d[u].lo;r&&(c+="<b>"),c+=t[e];let i=u<d.length&&e===d[u].hi-1;i&&(c+="</b>",u++),(r||i)&&(o(null,"",d,c,!1),a.record("build_result",r&&i?`s[${e}] is a whole bold run on its own, result = "${c}"`:r?`Bold run opens at s[${e}], result = "${c}"`:`Bold run closes after s[${e}], result = "${c}"`))}return o(null,"",d,c,!0),a.record("complete",`Done, result = "${c}"`),a.getSteps()
}

export function AddBoldTagInStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AddBoldTagInStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAddBoldTagInStringSteps(e) as any[];
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
      title="Add Bold Tag in String"
      slug="add-bold-tag-in-string"
      approaches={approaches}
      presets={AddBoldTagInStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count and Say (count-and-say)
// ==========================================

const CountAndSayTemplates = {
  "python": {
    "language": "python",
    "code": "def countAndSay(n: int) -> str:\n    current = \"1\"\n\n    for step in range(1, n):\n        next_str = \"\"\n        i = 0\n\n        while i < len(current):\n            ch = current[i]\n            count = 0\n\n            # Count consecutive identical characters\n            while i < len(current) and current[i] == ch:\n                count += 1\n                i += 1\n\n            next_str += str(count) + ch\n\n        current = next_str\n\n    return current",
    "lineMap": {
      "-": [
        1
      ],
      "init_current": [
        2
      ],
      "start_iteration": [
        4,
        5,
        6
      ],
      "scan_char": [
        8,
        9,
        10
      ],
      "count_group": [
        13,
        14,
        15
      ],
      "append_result": [
        17
      ],
      "finish_iteration": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public String countAndSay(int n) {\n    String current = \"1\";\n\n    for (int step = 1; step < n; step++) {\n        StringBuilder next = new StringBuilder();\n        int i = 0;\n\n        while (i < current.length()) {\n            char ch = current.charAt(i);\n            int count = 0;\n\n            // Count consecutive identical characters\n            while (i < current.length() && current.charAt(i) == ch) {\n                count++;\n                i++;\n            }\n\n            next.append(count);\n            next.append(ch);\n        }\n\n        current = next.toString();\n    }\n\n    return current;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_current": [
        2
      ],
      "start_iteration": [
        4,
        5,
        6
      ],
      "scan_char": [
        8,
        9,
        10
      ],
      "count_group": [
        13,
        14,
        15
      ],
      "append_result": [
        18,
        19
      ],
      "finish_iteration": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "string countAndSay(int n) {\n    string current = \"1\";\n\n    for (int step = 1; step < n; step++) {\n        string next = \"\";\n        int i = 0;\n\n        while (i < current.length()) {\n            char ch = current[i];\n            int count = 0;\n\n            // Count consecutive identical characters\n            while (i < current.length() && current[i] == ch) {\n                count++;\n                i++;\n            }\n\n            next += to_string(count) + ch;\n        }\n\n        current = next;\n    }\n\n    return current;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_current": [
        2
      ],
      "start_iteration": [
        4,
        5,
        6
      ],
      "scan_char": [
        8,
        9,
        10
      ],
      "count_group": [
        13,
        14,
        15
      ],
      "append_result": [
        18
      ],
      "finish_iteration": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public string CountAndSay(int n) {\n    string current = \"1\";\n\n    for (int step = 1; step < n; step++) {\n        StringBuilder next = new StringBuilder();\n        int i = 0;\n\n        while (i < current.Length) {\n            char ch = current[i];\n            int count = 0;\n\n            // Count consecutive identical characters\n            while (i < current.Length && current[i] == ch) {\n                count++;\n                i++;\n            }\n\n            next.Append(count);\n            next.Append(ch);\n        }\n\n        current = next.ToString();\n    }\n\n    return current;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_current": [
        2
      ],
      "start_iteration": [
        4,
        5,
        6
      ],
      "scan_char": [
        8,
        9,
        10
      ],
      "count_group": [
        13,
        14,
        15
      ],
      "append_result": [
        18,
        19
      ],
      "finish_iteration": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func countAndSay(n int) string {\n    current := \"1\"\n\n    for step := 1; step < n; step++ {\n        next := \"\"\n        i := 0\n\n        for i < len(current) {\n            ch := current[i]\n            count := 0\n\n            // Count consecutive identical characters\n            for i < len(current) && current[i] == ch {\n                count++\n                i++\n            }\n\n            next += strconv.Itoa(count) + string(ch)\n        }\n\n        current = next\n    }\n\n    return current\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_current": [
        2
      ],
      "start_iteration": [
        4,
        5,
        6
      ],
      "scan_char": [
        8,
        9,
        10
      ],
      "count_group": [
        13,
        14,
        15
      ],
      "append_result": [
        18
      ],
      "finish_iteration": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var countAndSay = function(n) {\n    let current = \"1\";\n\n    for (let step = 1; step < n; step++) {\n        let next = \"\";\n        let i = 0;\n\n        while (i < current.length) {\n            const ch = current[i];\n            let count = 0;\n\n            // Count consecutive identical characters\n            while (i < current.length && current[i] === ch) {\n                count++;\n                i++;\n            }\n\n            next += count.toString() + ch;\n        }\n\n        current = next;\n    }\n\n    return current;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_current": [
        2
      ],
      "start_iteration": [
        4,
        5,
        6
      ],
      "scan_char": [
        8,
        9,
        10
      ],
      "count_group": [
        13,
        14,
        15
      ],
      "append_result": [
        18
      ],
      "finish_iteration": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function countAndSay(n: number): string {\n    let current = \"1\";\n\n    for (let step = 1; step < n; step++) {\n        let next = \"\";\n        let i = 0;\n\n        while (i < current.length) {\n            const ch = current[i];\n            let count = 0;\n\n            // Count consecutive identical characters\n            while (i < current.length && current[i] === ch) {\n                count++;\n                i++;\n            }\n\n            next += count.toString() + ch;\n        }\n\n        current = next;\n    }\n\n    return current;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_current": [
        2
      ],
      "start_iteration": [
        4,
        5,
        6
      ],
      "scan_char": [
        8,
        9,
        10
      ],
      "count_group": [
        13,
        14,
        15
      ],
      "append_result": [
        18
      ],
      "finish_iteration": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  }
};

const CountAndSayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "n = 2",
    "value": {
      "n": 2
    }
  },
  {
    "id": "ex2",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex3",
    "label": "n = 6",
    "value": {
      "n": 6
    }
  }
];

function generateCountAndSaySteps(t: any): any[] {
  let e=Math.max(1,Number(t?.n??1)),n=t=>{let e="";for(let n=0;n<t.length;){let r=n;for(;r<t.length&&t[r]===t[n];)r++;e+=String(r-n)+t[n],n=r}return e},i=["","1"];for(let t=2;t<=e;t++)i[t]=n(i[t-1]);let a=[],l="",s="",o=new StepRecorder({n:e},{meta_stack:{type:"metadata",value:[]},meta_step:{type:"metadata",value:""},meta_result:{type:"metadata",value:null}}),u=(t,e,n)=>{for(let t=0;t<64;t++)o.delete_visual(`curr_${t}`),o.delete_visual(`next_${t}`);for(let[n,r]of Object.entries(((t,e)=>{let n={};for(let r=0;r<l.length;r++){let i=t&&r>=t.start&&r<=t.end?"counting":r<e?"done":void 0;n[`curr_${r}`]={type:"arrayElement",value:l[r],position:r,...i&&{state:i}}}for(let t=0;t<s.length;t++)n[`next_${t}`]={type:"arrayElement",value:s[t],position:t,state:"fresh"};return n})(t,e)))o.update_visual(n,r);o.update_visual("meta_stack",{type:"metadata",value:a.map(t=>({...t}))}),o.update_visual("meta_step",{type:"metadata",value:n})};o.record("-",`Start: countAndSay(${e}) by recursion`);for(let t=e;t>=1;t--)a.push({n:t,value:1===t?"1":null,state:1===t?"base":"open"}),1===t?(u(null,0,'countAndSay(1) = "1"'),o.record("base_case",'Base case: countAndSay(1) returns "1"')):(u(null,0,`countAndSay(${t}) waits on countAndSay(${t-1})`),o.record("recurse",`countAndSay(${t}) calls countAndSay(${t-1}) first`));for(let t=2;t<=e;t++){let e=a.find(e=>e.n===t);e.state="active",l=i[t-1],s="",u(null,0,`countAndSay(${t}) says "${l}"`),o.record("build",`countAndSay(${t}) returned "${l}" from below, now say it`);let n=0;for(;n<l.length;){let e=n;for(;e<l.length&&l[e]===l[n];)e++;let r=e-n,i=l[n];u({start:n,end:e-1},n,`countAndSay(${t}) says "${l}"`),o.record("scan_group",`A run of ${r} '${i}' at ${n}..${e-1}`),s+=String(r)+i,u({start:n,end:e-1},e,`countAndSay(${t}) says "${l}"`),o.record("append",`Append "${r}${i}" to the builder, now "${s}"`),n=e}e.value=s,e.state="done",l="",s="",u(null,0,`countAndSay(${t}) returns "${e.value}"`),o.record("return",`countAndSay(${t}) returns "${e.value}" up the stack`)}let c=i[e];return o.update_visual("meta_result",{type:"metadata",value:c}),o.record("complete",`Done, countAndSay(${e}) = "${c}"`),o.getSteps()
}

export function CountAndSayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountAndSayTemplates,
      generateSteps: (t: any) => {
        const recorded = generateCountAndSaySteps(t) as any[];
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
      title="Count and Say"
      slug="count-and-say"
      approaches={approaches}
      presets={CountAndSayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Encode and Decode Strings (encode-and-decode-strings)
// ==========================================

const EncodeAndDecodeStringsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def encode(self, strs: List[str]) -> str:\n        result = \"\"\n        for s in strs:\n            # Write length as 4-digit zero-padded number\n            result += f\"{len(s):04d}\" + s\n        return result\n\n    def decode(self, s: str) -> List[str]:\n        result = []\n        i = 0\n        while i < len(s):\n            # Read 4-digit length header\n            length = int(s[i:i + 4])\n            # Read exactly 'length' characters\n            result.append(s[i + 4 : i + 4 + length])\n            i += 4 + length\n        return result",
    "lineMap": {
      "-": [
        1
      ],
      "encode_start": [
        2,
        3,
        4
      ],
      "encode_write_length": [
        5,
        6
      ],
      "encode_write_content": [
        6
      ],
      "encode_complete": [
        7
      ],
      "decode_start": [
        9,
        10,
        11
      ],
      "decode_read_length": [
        12,
        13,
        14
      ],
      "decode_add_string": [
        15,
        16,
        17
      ],
      "decode_complete": [
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
    "code": "class Solution {\n    public String encode(List<String> strs) {\n        StringBuilder sb = new StringBuilder();\n        for (String s : strs) {\n            // Write length as 4-digit zero-padded number\n            sb.append(String.format(\"%04d\", s.length()));\n            sb.append(s);\n        }\n        return sb.toString();\n    }\n\n    public List<String> decode(String s) {\n        List<String> result = new ArrayList<>();\n        int i = 0;\n        while (i < s.length()) {\n            // Read 4-digit length header\n            int length = Integer.parseInt(s.substring(i, i + 4));\n            // Read exactly 'length' characters\n            result.add(s.substring(i + 4, i + 4 + length));\n            i += 4 + length;\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "encode_start": [
        2,
        3,
        4
      ],
      "encode_write_length": [
        5,
        6
      ],
      "encode_write_content": [
        7
      ],
      "encode_complete": [
        9
      ],
      "decode_start": [
        12,
        13,
        14
      ],
      "decode_read_length": [
        15,
        16,
        17
      ],
      "decode_add_string": [
        18,
        19,
        20
      ],
      "decode_complete": [
        22
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string encode(vector<string>& strs) {\n        string result;\n        for (const string& s : strs) {\n            // Write length as 4-digit zero-padded number\n            char header[5];\n            snprintf(header, 5, \"%04d\", (int)s.size());\n            result += string(header) + s;\n        }\n        return result;\n    }\n\n    vector<string> decode(string s) {\n        vector<string> result;\n        int i = 0;\n        while (i < s.size()) {\n            // Read 4-digit length header\n            int length = stoi(s.substr(i, 4));\n            // Read exactly 'length' characters\n            result.push_back(s.substr(i + 4, length));\n            i += 4 + length;\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "encode_start": [
        3,
        4,
        5
      ],
      "encode_write_length": [
        6,
        7,
        8
      ],
      "encode_write_content": [
        9
      ],
      "encode_complete": [
        11
      ],
      "decode_start": [
        14,
        15,
        16
      ],
      "decode_read_length": [
        17,
        18,
        19
      ],
      "decode_add_string": [
        20,
        21,
        22
      ],
      "decode_complete": [
        24
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string Encode(IList<string> strs) {\n        var sb = new StringBuilder();\n        foreach (string s in strs) {\n            // Write length as 4-digit zero-padded number\n            sb.Append(s.Length.ToString(\"D4\"));\n            sb.Append(s);\n        }\n        return sb.ToString();\n    }\n\n    public IList<string> Decode(string s) {\n        var result = new List<string>();\n        int i = 0;\n        while (i < s.Length) {\n            // Read 4-digit length header\n            int length = int.Parse(s.Substring(i, 4));\n            // Read exactly 'length' characters\n            result.Add(s.Substring(i + 4, length));\n            i += 4 + length;\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "encode_start": [
        2,
        3,
        4
      ],
      "encode_write_length": [
        5,
        6
      ],
      "encode_write_content": [
        7
      ],
      "encode_complete": [
        9
      ],
      "decode_start": [
        12,
        13,
        14
      ],
      "decode_read_length": [
        15,
        16,
        17
      ],
      "decode_add_string": [
        18,
        19,
        20
      ],
      "decode_complete": [
        22
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func encode(strs []string) string {\n    var result strings.Builder\n    for _, s := range strs {\n        // Write length as 4-digit zero-padded number\n        result.WriteString(fmt.Sprintf(\"%04d\", len(s)))\n        result.WriteString(s)\n    }\n    return result.String()\n}\n\nfunc decode(s string) []string {\n    result := []string{}\n    i := 0\n    for i < len(s) {\n        // Read 4-digit length header\n        length, _ := strconv.Atoi(s[i : i+4])\n        // Read exactly 'length' characters\n        result = append(result, s[i+4:i+4+length])\n        i += 4 + length\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "encode_start": [
        1,
        2,
        3
      ],
      "encode_write_length": [
        4,
        5
      ],
      "encode_write_content": [
        6
      ],
      "encode_complete": [
        8
      ],
      "decode_start": [
        11,
        12,
        13
      ],
      "decode_read_length": [
        14,
        15,
        16
      ],
      "decode_add_string": [
        17,
        18,
        19
      ],
      "decode_complete": [
        21
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var encode = function(strs) {\n    var result = \"\";\n    for (var s of strs) {\n        // Write length as 4-digit zero-padded number\n        result += String(s.length).padStart(4, '0') + s;\n    }\n    return result;\n};\n\nvar decode = function(s) {\n    var result = [];\n    var i = 0;\n    while (i < s.length) {\n        // Read 4-digit length header\n        var length = parseInt(s.substring(i, i + 4));\n        // Read exactly 'length' characters\n        result.push(s.substring(i + 4, i + 4 + length));\n        i += 4 + length;\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "encode_start": [
        1,
        2,
        3
      ],
      "encode_write_length": [
        4,
        5
      ],
      "encode_write_content": [
        5
      ],
      "encode_complete": [
        7
      ],
      "decode_start": [
        10,
        11,
        12
      ],
      "decode_read_length": [
        13,
        14,
        15
      ],
      "decode_add_string": [
        16,
        17,
        18
      ],
      "decode_complete": [
        20
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function encode(strs: string[]): string {\n    let result = \"\";\n    for (const s of strs) {\n        // Write length as 4-digit zero-padded number\n        result += String(s.length).padStart(4, '0') + s;\n    }\n    return result;\n}\n\nfunction decode(s: string): string[] {\n    const result: string[] = [];\n    let i = 0;\n    while (i < s.length) {\n        // Read 4-digit length header\n        const length = parseInt(s.substring(i, i + 4));\n        // Read exactly 'length' characters\n        result.push(s.substring(i + 4, i + 4 + length));\n        i += 4 + length;\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "encode_start": [
        1,
        2,
        3
      ],
      "encode_write_length": [
        4,
        5
      ],
      "encode_write_content": [
        5
      ],
      "encode_complete": [
        7
      ],
      "decode_start": [
        10,
        11,
        12
      ],
      "decode_read_length": [
        13,
        14,
        15
      ],
      "decode_add_string": [
        16,
        17,
        18
      ],
      "decode_complete": [
        20
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {}
  }
};

const EncodeAndDecodeStringsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "strings": [
        "hello",
        "world",
        "",
        "hi"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Special Chars",
    "value": {
      "strings": [
        "a:b",
        "c#d",
        ""
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single String",
    "value": {
      "strings": [
        "abcdef"
      ]
    }
  }
];

function generateEncodeAndDecodeStringsSteps(e: any): any[] {
  let t=[...e.strings||[]],r=t.map(e=>e.split("#").join("##")),i=[],s=0;r.forEach(e=>{i.push({start:s,hlen:0,len:e.length,tlen:2}),s+=e.length+2});let a=s,l=r.map(e=>`${e}#,`).join(""),d=new StepRecorder({},{});t.forEach((e,t)=>{d.add_new_visual(`input_${t}`,{type:"arrayElement",value:e,position:t})}),d.update_variable("mode","escaping"),d.update_variable("segs",i),d.update_variable("encLen",a),d.update_variable("n",t.length),d.update_variable("phase","start"),d.update_variable("sbLen",0),d.record("-","Start: pack the list into ONE string by escaping every '#' as '##' and closing each string with the '#,' delimiter."),d.update_variable("phase","encode"),d.record("encode_start","Encode: for each string, double every '#' so no content can look like the delimiter, then append '#,'.");let o=0;for(let e=0;e<t.length;e++){let n=t[e],s=r[e],a=i[e],l=n.length-n.split("#").join("").length;for(let e=0;e<s.length;e++)d.add_new_visual(`enc_${a.start+e}`,{type:"arrayElement",value:s[e],position:a.start+e,label:"#"===s[e]?"e":"c"});o=a.start+s.length,d.update_variable("sbLen",o),d.update_variable("si",e),d.update_variable("s",n),d.update_variable("esc",s),d.update_variable("len",s.length),d.update_variable("hashes",l),d.update_variable("hl",{start:a.start,end:a.start+s.length,kind:"content"}),d.record("encode_escape",""===n?'The empty string escapes to "", so nothing is written yet.':l>0?`"${n}" holds ${l} '#', so it escapes to "${s}".`:`"${n}" holds no '#', so it is written as is.`);for(let e=0;e<2;e++)d.add_new_visual(`enc_${a.start+s.length+e}`,{type:"arrayElement",value:"#,"[e],position:a.start+s.length+e,label:"t"});o=a.start+s.length+2,d.update_variable("sbLen",o),d.update_variable("hl",{start:a.start+s.length,end:o,kind:"trailer"}),d.record("encode_delimiter","Close the string with the \"#,\" delimiter. A lone '#' can no longer appear, so this pair is unambiguous.")}d.delete_variable("hl"),d.update_variable("phase","encodeDone"),d.record("encode_complete",`Encoding complete: one string of ${a} characters, self-delimiting because every content '#' was doubled.`),d.update_variable("phase","decode"),d.update_variable("i",0),d.update_variable("decCount",0),d.update_variable("current",""),d.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),d.record("decode_start","Decode: walk the string one character at a time, collecting into current until an unescaped '#,' closes it.");let c=[],u="",p=0,g=0;for(;p<a;){let e=p+1<a?l.slice(p,p+2):"",t="#,"===e,r=!t&&"##"===e;d.update_variable("i",p),d.update_variable("k",g),d.add_conditional("is_delimiter",t),t||d.add_conditional("is_escaped",r),t?(c.push(u),d.add_new_visual(`dec_${g}`,{type:"arrayElement",value:u,position:g,label:"d"}),d.update_variable("content",u),d.update_variable("hl",{start:p,end:p+2,kind:"trailer"}),d.update_variable("nextI",p+2),d.update_variable("decCount",g+1),d.update_variable("current",""),d.record("decode_delimiter",""===u?`s[${p}..${p+1}] is "#,", the delimiter. current is empty, so the recovered string is "". Jump i to ${p+2}.`:`s[${p}..${p+1}] is "#,", the delimiter. Finalize current as "${u}" and jump i to ${p+2}.`),u="",p+=2,g++):r?(u+="#",d.update_variable("hl",{start:p,end:p+2,kind:"escape"}),d.update_variable("nextI",p+2),d.update_variable("current",u),d.record("decode_escaped",`s[${p}..${p+1}] is "##", an escaped hash. Append a single '#' to current and jump i to ${p+2}.`),p+=2):(u+=l[p],d.update_variable("hl",{start:p,end:p+1,kind:"content"}),d.update_variable("nextI",p+1),d.update_variable("current",u),d.record("decode_char",`s[${p}] is '${l[p]}', an ordinary character. Append it to current and step i to ${p+1}.`),p+=1),d.update_visual("ptr_i",{type:"pointer",position:Math.min(p,a-.5),label:"i"})}d.delete_visual("ptr_i"),d.delete_variable("hl"),d.update_variable("phase","done"),d.record("decode_complete",`Decoding complete: recovered ${c.length} string${1===c.length?"":"s"}.`);let h=c.length===t.length&&c.every((e,r)=>e===t[r]);return d.update_variable("ok",h),d.record("complete",`Done! decode(encode(strs)) returned the original list, ${c.length}/${t.length} strings match.`),d.getSteps()
}

export function EncodeAndDecodeStringsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: EncodeAndDecodeStringsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateEncodeAndDecodeStringsSteps(e) as any[];
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
      title="Encode and Decode Strings"
      slug="encode-and-decode-strings"
      approaches={approaches}
      presets={EncodeAndDecodeStringsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find the Length of the Longest Common Prefix (find-the-length-of-the-longest-common-prefix)
// ==========================================

const FindTheLengthOfTheLongestCommonPrefixTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def longestCommonPrefix(self, arr1: list[int], arr2: list[int]) -> int:\n        # Build trie from arr1 using nested dictionaries\n        trie = {}\n\n        for num in arr1:\n            node = trie\n            for digit in str(num):\n                if digit not in node:\n                    node[digit] = {}\n                node = node[digit]\n\n        # Query trie with arr2 numbers\n        max_length = 0\n        for num in arr2:\n            node = trie\n            depth = 0\n            for digit in str(num):\n                if digit not in node:\n                    break\n                node = node[digit]\n                depth += 1\n            max_length = max(max_length, depth)\n\n        return max_length",
    "lineMap": {
      "-": [
        4
      ],
      "insert_num": [
        6,
        7
      ],
      "insert_digit": [
        8
      ],
      "create_node": [
        9,
        10
      ],
      "start_query": [
        14
      ],
      "query_num": [
        15,
        16,
        17
      ],
      "query_digit": [
        18,
        19
      ],
      "match_digit": [
        21,
        22
      ],
      "no_match": [
        19,
        20
      ],
      "update_max": [
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "digit_missing": [
        9
      ],
      "query_miss": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int longestCommonPrefix(int[] arr1, int[] arr2) {\n        // Build trie from arr1 using a 2D array\n        // Max nodes: 50000 numbers * 9 digits each\n        int[][] trie = new int[450001][10];\n        int trieSize = 1; // Node 0 is the root\n\n        for (int num : arr1) {\n            String s = Integer.toString(num);\n            int node = 0;\n            for (int i = 0; i < s.length(); i++) {\n                int digit = s.charAt(i) - '0';\n                if (trie[node][digit] == 0) {\n                    trie[node][digit] = trieSize++;\n                }\n                node = trie[node][digit];\n            }\n        }\n\n        // Query trie with arr2 numbers\n        int maxLength = 0;\n        for (int num : arr2) {\n            String s = Integer.toString(num);\n            int node = 0;\n            int depth = 0;\n            for (int i = 0; i < s.length(); i++) {\n                int digit = s.charAt(i) - '0';\n                if (trie[node][digit] == 0) break;\n                node = trie[node][digit];\n                depth++;\n            }\n            maxLength = Math.max(maxLength, depth);\n        }\n        return maxLength;\n    }\n}",
    "lineMap": {
      "-": [
        5,
        6
      ],
      "insert_num": [
        8,
        9,
        10
      ],
      "insert_digit": [
        11,
        12
      ],
      "create_node": [
        13,
        14
      ],
      "start_query": [
        21
      ],
      "query_num": [
        22,
        23,
        24,
        25
      ],
      "query_digit": [
        26,
        27
      ],
      "match_digit": [
        29,
        30
      ],
      "no_match": [
        28
      ],
      "update_max": [
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "digit_missing": [
        13
      ],
      "query_miss": [
        28
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int longestCommonPrefix(vector<int>& arr1, vector<int>& arr2) {\n        // Build trie from arr1 using a 2D vector\n        vector<array<int, 10>> trie(1);\n        trie[0].fill(0);\n\n        for (int num : arr1) {\n            string s = to_string(num);\n            int node = 0;\n            for (char c : s) {\n                int digit = c - '0';\n                if (trie[node][digit] == 0) {\n                    trie.push_back({});\n                    trie.back().fill(0);\n                    trie[node][digit] = trie.size() - 1;\n                }\n                node = trie[node][digit];\n            }\n        }\n\n        // Query trie with arr2 numbers\n        int maxLength = 0;\n        for (int num : arr2) {\n            string s = to_string(num);\n            int node = 0;\n            int depth = 0;\n            for (char c : s) {\n                int digit = c - '0';\n                if (trie[node][digit] == 0) break;\n                node = trie[node][digit];\n                depth++;\n            }\n            maxLength = max(maxLength, depth);\n        }\n        return maxLength;\n    }\n};",
    "lineMap": {
      "-": [
        5,
        6
      ],
      "insert_num": [
        8,
        9,
        10
      ],
      "insert_digit": [
        11,
        12
      ],
      "create_node": [
        13,
        14,
        15,
        16
      ],
      "start_query": [
        23
      ],
      "query_num": [
        24,
        25,
        26,
        27
      ],
      "query_digit": [
        28,
        29
      ],
      "match_digit": [
        31,
        32
      ],
      "no_match": [
        30
      ],
      "update_max": [
        34
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "digit_missing": [
        13
      ],
      "query_miss": [
        30
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int LongestCommonPrefix(int[] arr1, int[] arr2) {\n        // Build trie from arr1 using a 2D array\n        int[][] trie = new int[450001][];\n        for (int i = 0; i < trie.Length; i++) {\n            trie[i] = new int[10];\n        }\n        int trieSize = 1; // Node 0 is the root\n\n        foreach (int num in arr1) {\n            string s = num.ToString();\n            int node = 0;\n            foreach (char c in s) {\n                int digit = c - '0';\n                if (trie[node][digit] == 0) {\n                    trie[node][digit] = trieSize++;\n                }\n                node = trie[node][digit];\n            }\n        }\n\n        // Query trie with arr2 numbers\n        int maxLength = 0;\n        foreach (int num in arr2) {\n            string s = num.ToString();\n            int node = 0;\n            int depth = 0;\n            foreach (char c in s) {\n                int digit = c - '0';\n                if (trie[node][digit] == 0) break;\n                node = trie[node][digit];\n                depth++;\n            }\n            maxLength = Math.Max(maxLength, depth);\n        }\n        return maxLength;\n    }\n}",
    "lineMap": {
      "-": [
        4,
        6,
        8
      ],
      "insert_num": [
        10,
        11,
        12
      ],
      "insert_digit": [
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
        26,
        27
      ],
      "query_digit": [
        28,
        29
      ],
      "match_digit": [
        31,
        32
      ],
      "no_match": [
        30
      ],
      "update_max": [
        34
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "digit_missing": [
        15
      ],
      "query_miss": [
        30
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestCommonPrefix(arr1 []int, arr2 []int) int {\n    // Build trie from arr1 using a slice of arrays\n    trie := make([][10]int, 1) // Node 0 is root\n    trieSize := 1\n\n    for _, num := range arr1 {\n        s := strconv.Itoa(num)\n        node := 0\n        for _, c := range s {\n            digit := int(c - '0')\n            if trie[node][digit] == 0 {\n                trie = append(trie, [10]int{})\n                trie[node][digit] = trieSize\n                trieSize++\n            }\n            node = trie[node][digit]\n        }\n    }\n\n    // Query trie with arr2 numbers\n    maxLength := 0\n    for _, num := range arr2 {\n        s := strconv.Itoa(num)\n        node := 0\n        depth := 0\n        for _, c := range s {\n            digit := int(c - '0')\n            if trie[node][digit] == 0 {\n                break\n            }\n            node = trie[node][digit]\n            depth++\n        }\n        if depth > maxLength {\n            maxLength = depth\n        }\n    }\n    return maxLength\n}",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "insert_num": [
        6,
        7,
        8
      ],
      "insert_digit": [
        9,
        10
      ],
      "create_node": [
        11,
        12,
        13,
        14
      ],
      "start_query": [
        21
      ],
      "query_num": [
        22,
        23,
        24,
        25
      ],
      "query_digit": [
        26,
        27
      ],
      "match_digit": [
        31,
        32
      ],
      "no_match": [
        28,
        29
      ],
      "update_max": [
        34,
        35
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "digit_missing": [
        11
      ],
      "query_miss": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestCommonPrefix = function(arr1, arr2) {\n    // Build trie from arr1 using nested objects\n    var trie = {};\n\n    for (var i = 0; i < arr1.length; i++) {\n        var s = arr1[i].toString();\n        var node = trie;\n        for (var j = 0; j < s.length; j++) {\n            if (!(s[j] in node)) {\n                node[s[j]] = {};\n            }\n            node = node[s[j]];\n        }\n    }\n\n    // Query trie with arr2 numbers\n    var maxLength = 0;\n    for (var i = 0; i < arr2.length; i++) {\n        var s = arr2[i].toString();\n        var node = trie;\n        var depth = 0;\n        for (var j = 0; j < s.length; j++) {\n            if (!(s[j] in node)) break;\n            node = node[s[j]];\n            depth++;\n        }\n        maxLength = Math.max(maxLength, depth);\n    }\n    return maxLength;\n};",
    "lineMap": {
      "-": [
        3
      ],
      "insert_num": [
        5,
        6,
        7
      ],
      "insert_digit": [
        8
      ],
      "create_node": [
        9,
        10
      ],
      "start_query": [
        17
      ],
      "query_num": [
        18,
        19,
        20,
        21
      ],
      "query_digit": [
        22,
        23
      ],
      "match_digit": [
        24,
        25
      ],
      "no_match": [
        23
      ],
      "update_max": [
        27
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "digit_missing": [
        9
      ],
      "query_miss": [
        23
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestCommonPrefix(arr1: number[], arr2: number[]): number {\n    // Build trie from arr1 using nested objects\n    const trie: Record<string, any> = {};\n\n    for (const num of arr1) {\n        const s = num.toString();\n        let node: Record<string, any> = trie;\n        for (const ch of s) {\n            if (!(ch in node)) {\n                node[ch] = {};\n            }\n            node = node[ch];\n        }\n    }\n\n    // Query trie with arr2 numbers\n    let maxLength = 0;\n    for (const num of arr2) {\n        const s = num.toString();\n        let node: Record<string, any> = trie;\n        let depth = 0;\n        for (const ch of s) {\n            if (!(ch in node)) break;\n            node = node[ch];\n            depth++;\n        }\n        maxLength = Math.max(maxLength, depth);\n    }\n    return maxLength;\n}",
    "lineMap": {
      "-": [
        3
      ],
      "insert_num": [
        5,
        6,
        7
      ],
      "insert_digit": [
        8
      ],
      "create_node": [
        9,
        10
      ],
      "start_query": [
        17
      ],
      "query_num": [
        18,
        19,
        20,
        21
      ],
      "query_digit": [
        22,
        23
      ],
      "match_digit": [
        24,
        25
      ],
      "no_match": [
        23
      ],
      "update_max": [
        27
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "digit_missing": [
        9
      ],
      "query_miss": [
        23
      ]
    }
  }
};

const FindTheLengthOfTheLongestCommonPrefixPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (ans: 3)",
    "value": {
      "arr1": [
        1,
        10,
        100
      ],
      "arr2": [
        1000
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (ans: 0)",
    "value": {
      "arr1": [
        1,
        2,
        3
      ],
      "arr2": [
        4,
        4,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3 (ans: 4)",
    "value": {
      "arr1": [
        12345,
        678,
        90
      ],
      "arr2": [
        1234,
        67,
        9012
      ]
    }
  }
];

function generateFindTheLengthOfTheLongestCommonPrefixSteps(e: any): any[] {
  let t=e.arr1||[],r=e.arr2||[],a=new StepRecorder({},{}),n=t.map(()=>"pending"),s=r.map(()=>"pending"),o=0;a.update_variable("phase","Compare every pair"),a.update_variable("arr1",t),a.update_variable("arr2",r),a.update_variable("arr1States",n),a.update_variable("arr2States",s),a.update_variable("sx",""),a.update_variable("sy",""),a.update_variable("matched",0),a.update_variable("cursor",-1),a.update_variable("maxLength",0),a.record("start","Start with a max prefix length of 0");for(let e=0;e<t.length;e++){let i=t[e],l=String(i);e>0&&(n[e-1]="visited"),n[e]="active",s.fill("pending"),a.update_variable("arr1States",n),a.update_variable("arr2States",s),a.update_variable("sx",l),a.update_variable("sy",""),a.update_variable("matched",0),a.update_variable("cursor",-1),a.record("pick_x",`Take ${i} from arr1`);for(let e=0;e<r.length;e++){let t=String(r[e]),i=0;e>0&&(s[e-1]="visited"),s[e]="active",a.update_variable("arr2States",s),a.update_variable("sy",t),a.update_variable("matched",0),a.update_variable("cursor",-1),a.record("pick_y",`Compare "${l}" with "${t}"`);let n=Math.min(l.length,t.length);for(let e=0;e<n;e++){let r=l[e]===t[e];if(a.add_conditional("digits_equal",r),a.update_variable("cursor",e),a.record("compare_digit",`Digit ${e+1}: '${l[e]}' vs '${t[e]}'`),!r){a.record("digit_mismatch",`Digits differ, stop at length ${i}`);break}i++,a.update_variable("matched",i),a.record("digit_match",`Digits match, length = ${i}`)}let d=i>o;d&&(o=i),a.update_variable("maxLength",o),a.record("update_max",d?`New max! maxLength = ${o}`:`Length ${i} does not beat ${o}`)}}return a.update_variable("phase","Complete"),n.fill("visited"),s.fill("visited"),a.update_variable("arr1States",n),a.update_variable("arr2States",s),a.update_variable("cursor",-1),a.record("complete",`Done! The longest common prefix length is ${o}`),a.getSteps()
}

export function FindTheLengthOfTheLongestCommonPrefixProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindTheLengthOfTheLongestCommonPrefixTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindTheLengthOfTheLongestCommonPrefixSteps(e) as any[];
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
      title="Find the Length of the Longest Common Prefix"
      slug="find-the-length-of-the-longest-common-prefix"
      approaches={approaches}
      presets={FindTheLengthOfTheLongestCommonPrefixPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Guess the Word (guess-the-word)
// ==========================================

const GuessTheWordTemplates = {
  "python": {
    "language": "python",
    "code": "def findSecretWord(words: List[str], master: 'Master') -> None:\n    def match(a, b):\n        return sum(x == y for x, y in zip(a, b))\n\n    candidates = list(words)\n\n    while candidates:\n        guess = candidates[0]\n        matches = master.guess(guess)\n\n        if matches == 6:\n            return\n\n        filtered = []\n        for word in candidates:\n            if match(word, guess) == matches:\n                filtered.append(word)\n\n        candidates = filtered",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5
      ],
      "pick": [
        8
      ],
      "guess_call": [
        9
      ],
      "complete": [
        12
      ],
      "filter_start": [
        14
      ],
      "keep_word": [
        15,
        17
      ],
      "eliminate_word": [
        15
      ],
      "update_candidates": [
        19
      ]
    },
    "conditionalMap": {
      "found": [
        11
      ],
      "keep": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void findSecretWord(String[] words, Master master) {\n    List<String> candidates = new ArrayList<>(Arrays.asList(words));\n\n    while (!candidates.isEmpty()) {\n        String guess = candidates.get(0);\n        int matches = master.guess(guess);\n\n        if (matches == 6) {\n            return;\n        }\n\n        List<String> filtered = new ArrayList<>();\n        for (String word : candidates) {\n            if (match(word, guess) == matches) {\n                filtered.add(word);\n            }\n        }\n\n        candidates = filtered;\n    }\n}\n\nprivate int match(String a, String b) {\n    int count = 0;\n    for (int i = 0; i < 6; i++) {\n        if (a.charAt(i) == b.charAt(i)) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "pick": [
        5
      ],
      "guess_call": [
        6
      ],
      "complete": [
        9
      ],
      "filter_start": [
        12
      ],
      "keep_word": [
        13,
        15
      ],
      "eliminate_word": [
        13
      ],
      "update_candidates": [
        19
      ]
    },
    "conditionalMap": {
      "found": [
        8
      ],
      "keep": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int match(const string& a, const string& b) {\n    int count = 0;\n    for (int i = 0; i < 6; i++) {\n        if (a[i] == b[i]) {\n            count++;\n        }\n    }\n    return count;\n}\n\nvoid findSecretWord(vector<string>& words, Master& master) {\n    vector<string> candidates = words;\n\n    while (!candidates.empty()) {\n        string guess = candidates[0];\n        int matches = master.guess(guess);\n\n        if (matches == 6) {\n            return;\n        }\n\n        vector<string> filtered;\n        for (string& word : candidates) {\n            if (match(word, guess) == matches) {\n                filtered.push_back(word);\n            }\n        }\n\n        candidates = filtered;\n    }\n}",
    "lineMap": {
      "-": [
        11
      ],
      "init": [
        12
      ],
      "pick": [
        15
      ],
      "guess_call": [
        16
      ],
      "complete": [
        19
      ],
      "filter_start": [
        22
      ],
      "keep_word": [
        23,
        25
      ],
      "eliminate_word": [
        23
      ],
      "update_candidates": [
        29
      ]
    },
    "conditionalMap": {
      "found": [
        18
      ],
      "keep": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void FindSecretWord(string[] words, Master master) {\n    List<string> candidates = new List<string>(words);\n\n    while (candidates.Count > 0) {\n        string guess = candidates[0];\n        int matches = master.Guess(guess);\n\n        if (matches == 6) {\n            return;\n        }\n\n        List<string> filtered = new List<string>();\n        foreach (string word in candidates) {\n            if (Match(word, guess) == matches) {\n                filtered.Add(word);\n            }\n        }\n\n        candidates = filtered;\n    }\n}\n\nprivate int Match(string a, string b) {\n    int count = 0;\n    for (int i = 0; i < 6; i++) {\n        if (a[i] == b[i]) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "pick": [
        5
      ],
      "guess_call": [
        6
      ],
      "complete": [
        9
      ],
      "filter_start": [
        12
      ],
      "keep_word": [
        13,
        15
      ],
      "eliminate_word": [
        13
      ],
      "update_candidates": [
        19
      ]
    },
    "conditionalMap": {
      "found": [
        8
      ],
      "keep": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findSecretWord(words []string, master *Master) {\n    candidates := append([]string{}, words...)\n\n    for len(candidates) > 0 {\n        guess := candidates[0]\n        matches := master.Guess(guess)\n\n        if matches == 6 {\n            return\n        }\n\n        filtered := []string{}\n        for _, word := range candidates {\n            if match(word, guess) == matches {\n                filtered = append(filtered, word)\n            }\n        }\n\n        candidates = filtered\n    }\n}\n\nfunc match(a, b string) int {\n    count := 0\n    for i := 0; i < 6; i++ {\n        if a[i] == b[i] {\n            count++\n        }\n    }\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "pick": [
        5
      ],
      "guess_call": [
        6
      ],
      "complete": [
        9
      ],
      "filter_start": [
        12
      ],
      "keep_word": [
        13,
        15
      ],
      "eliminate_word": [
        13
      ],
      "update_candidates": [
        19
      ]
    },
    "conditionalMap": {
      "found": [
        8
      ],
      "keep": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findSecretWord = function(words, master) {\n    let candidates = [...words];\n\n    while (candidates.length > 0) {\n        const guess = candidates[0];\n        const matches = master.guess(guess);\n\n        if (matches === 6) {\n            return;\n        }\n\n        const filtered = [];\n        for (const word of candidates) {\n            if (match(word, guess) === matches) {\n                filtered.push(word);\n            }\n        }\n\n        candidates = filtered;\n    }\n}\n\nfunction match(a, b) {\n    let count = 0;\n    for (let i = 0; i < 6; i++) {\n        if (a[i] === b[i]) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "pick": [
        5
      ],
      "guess_call": [
        6
      ],
      "complete": [
        9
      ],
      "filter_start": [
        12
      ],
      "keep_word": [
        13,
        15
      ],
      "eliminate_word": [
        13
      ],
      "update_candidates": [
        19
      ]
    },
    "conditionalMap": {
      "found": [
        8
      ],
      "keep": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findSecretWord(words: string[], master: Master) {\n    let candidates = [...words];\n\n    while (candidates.length > 0) {\n        const guess = candidates[0];\n        const matches = master.guess(guess);\n\n        if (matches === 6) {\n            return;\n        }\n\n        const filtered: string[] = [];\n        for (const word of candidates) {\n            if (match(word, guess) === matches) {\n                filtered.push(word);\n            }\n        }\n\n        candidates = filtered;\n    }\n}\n\nfunction match(a: string, b: string): number {\n    let count = 0;\n    for (let i = 0; i < 6; i++) {\n        if (a[i] === b[i]) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "pick": [
        5
      ],
      "guess_call": [
        6
      ],
      "complete": [
        9
      ],
      "filter_start": [
        12
      ],
      "keep_word": [
        13,
        15
      ],
      "eliminate_word": [
        13
      ],
      "update_candidates": [
        19
      ]
    },
    "conditionalMap": {
      "found": [
        8
      ],
      "keep": [
        14
      ]
    }
  }
};

const GuessTheWordPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "words": [
        "silver",
        "salver",
        "salted",
        "solver",
        "soared"
      ],
      "secret": "solver"
    }
  },
  {
    "id": "ex2",
    "label": "Planet",
    "value": {
      "words": [
        "placed",
        "planes",
        "plants",
        "planet",
        "pranks"
      ],
      "secret": "planet"
    }
  },
  {
    "id": "ex3",
    "label": "LeetCode Example",
    "value": {
      "words": [
        "ccbazz",
        "eiowzz",
        "abcczz",
        "acckzz"
      ],
      "secret": "acckzz"
    }
  }
];

function generateGuessTheWordSteps(e: any): any[] {
  function r(e,t){let a='';for(let s=0;s<e.length&&s<t.length;s++)a+=e[s]===t[s]?'1':'0';return a}
let t=e.words.map(e=>String(e).toLowerCase()),a=String(e.secret).toLowerCase(),n={meta_secret:{type:"metadata",value:a,state:"hidden"},meta_scores:{type:"metadata",value:null},meta_note:{type:"metadata",value:""}};t.forEach((e,t)=>{n[`word_${t}`]={type:"arrayElement",value:e,position:t,state:"candidate"}});let o=new StepRecorder({round:0,guess:"",matches:-1,cmpA:null,cmpB:null,cmpKind:null,cmpMask:null,cmpCount:null,cmpVerdict:null},n),l=(e,a)=>{let s=t.indexOf(e);o.update_visual(`word_${s}`,{type:"arrayElement",value:t[s],position:s,state:a})},d=(e,t,a,s,i,r)=>{o.update_variable("cmpA",e),o.update_variable("cmpB",t),o.update_variable("cmpKind",a),o.update_variable("cmpMask",s),o.update_variable("cmpCount",i),o.update_variable("cmpVerdict",r)},c=(e,t,a)=>{o.update_visual("meta_scores",{type:"metadata",value:e?{metric:e,chosen:t,values:a}:null})};o.record("-",`Start: one of these ${t.length} words is the secret. A guess only reveals how many letters sit in the right position.`);let u=[...t];o.record("init",`All ${t.length} words start as candidates.`);let g=0;for(;u.length>0;){g++,o.update_variable("round",g);let e=u.map(e=>{let t=new Map;for(let a of u){let s=i(e,a);t.set(s,(t.get(s)??0)+1)}return{word:e,score:Math.max(...t.values())}}),s=e[0];for(let t of e)t.score<s.score&&(s=t);let n=s.word;c("worst-case group",null,e),o.update_visual("meta_note",{type:"metadata",value:"Pick the word with the smallest worst-case group"}),o.record("score",`Round ${g}: for each word, find the largest group the answer could hide in.`),c("worst-case group",n,e),l(n,"guess"),o.update_variable("guess",n),o.record("select",`"${n}" has the smallest worst case (${s.score}), so guess it.`),c(null,null,[]),o.update_visual("meta_note",{type:"metadata",value:""});let p=i(n,a);if(o.update_variable("matches",p),d(n,a,"secret",r(n,a),p,6===p?"found":"guess"),o.record("guess_call",`master.guess("${n}") returns ${p}: ${p} of 6 letters are in the right position.`),6===p){o.add_conditional("found",!0),l(n,"found"),t.forEach(e=>{let a=t.indexOf(e),s=o.get_visual(`word_${a}`)?.state;e!==n&&"eliminated"!==s&&l(e,"eliminated")}),o.update_visual("meta_secret",{type:"metadata",value:a,state:"found"}),o.record("complete",`All 6 letters match: "${n}" is the secret, found in ${g} ${1===g?"guess":"guesses"}!`);break}o.add_conditional("found",!1),o.record("filter_start",`Not the secret. The secret must match "${n}" in exactly ${p} positions, so filter the pool.`);let m=[];for(let e of u){let t=i(e,n),a=t===p;d(n,e,"filter",r(n,e),t,a?"keep":"eliminate"),o.add_conditional("keep",a),a?(m.push(e),l(e,"kept"),o.record("keep_word",`"${e}" matches "${n}" in ${t} positions, exactly ${p}. Keep it.`)):(l(e,"eliminated"),o.record("eliminate_word",`"${e}" matches "${n}" in ${t} positions, not ${p}. Eliminate it.`))}u=m,m.forEach(e=>l(e,"candidate")),d(null,null,null,null,null,null),o.record("update_candidates",`Round ${g} done: ${u.length} candidate${1===u.length?"":"s"} remain.`)}return o.getSteps()
}

export function GuessTheWordProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: GuessTheWordTemplates,
      generateSteps: (e: any) => {
        const recorded = generateGuessTheWordSteps(e) as any[];
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
      title="Guess the Word"
      slug="guess-the-word"
      approaches={approaches}
      presets={GuessTheWordPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Integer to English Words (integer-to-english-words)
// ==========================================

const IntegerToEnglishWordsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    ones = [\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\",\n            \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\",\n            \"Thirteen\", \"Fourteen\", \"Fifteen\", \"Sixteen\", \"Seventeen\",\n            \"Eighteen\", \"Nineteen\"]\n    tens = [\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\",\n            \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"]\n\n    def numberToWords(self, num: int) -> str:\n        if num == 0:\n            return \"Zero\"\n        return self.helper(num).strip()\n\n    def helper(self, num):\n        sb = []\n        if num >= 1000000000:\n            sb.append(self.helper(num // 1000000000) + \" Billion\")\n            num %= 1000000000\n        if num >= 1000000:\n            sb.append(self.helper(num // 1000000) + \" Million\")\n            num %= 1000000\n        if num >= 1000:\n            sb.append(self.helper(num // 1000) + \" Thousand\")\n            num %= 1000\n        if num >= 100:\n            sb.append(self.ones[num // 100] + \" Hundred\")\n            num %= 100\n        if num >= 20:\n            sb.append(self.tens[num // 10])\n            num %= 10\n        if num > 0:\n            sb.append(self.ones[num])\n        return ' '.join(sb)",
    "lineMap": {
      "-": [
        1
      ],
      "check_billion": [
        16
      ],
      "add_billion": [
        17,
        18
      ],
      "check_million": [
        19
      ],
      "add_million": [
        20,
        21
      ],
      "check_thousand": [
        22
      ],
      "add_thousand": [
        23,
        24
      ],
      "check_hundred": [
        25
      ],
      "add_hundred": [
        26,
        27
      ],
      "check_tens": [
        28
      ],
      "add_tens": [
        29,
        30
      ],
      "check_ones": [
        31
      ],
      "add_ones": [
        32
      ],
      "return_helper": [
        33
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private final String[] ones = {\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\",\n        \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\", \"Thirteen\", \"Fourteen\",\n        \"Fifteen\", \"Sixteen\", \"Seventeen\", \"Eighteen\", \"Nineteen\"};\n    private final String[] tens = {\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\",\n        \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"};\n    public String numberToWords(int num) {\n        if (num == 0) return \"Zero\";\n        return helper(num).trim();\n    }\n    private String helper(int num) {\n        StringBuilder sb = new StringBuilder();\n        if (num >= 1000000000) {\n            sb.append(helper(num / 1000000000)).append(\" Billion \");\n            num %= 1000000000;\n        }\n        if (num >= 1000000) {\n            sb.append(helper(num / 1000000)).append(\" Million \");\n            num %= 1000000;\n        }\n        if (num >= 1000) {\n            sb.append(helper(num / 1000)).append(\" Thousand \");\n            num %= 1000;\n        }\n        if (num >= 100) {\n            sb.append(helper(num / 100)).append(\" Hundred \");\n            num %= 100;\n        }\n        if (num >= 20) {\n            sb.append(tens[num / 10]).append(\" \");\n            num %= 10;\n        }\n        if (num > 0) {\n            sb.append(ones[num]).append(\" \");\n        }\n        return sb.toString().trim();\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_billion": [
        13
      ],
      "add_billion": [
        14,
        15
      ],
      "check_million": [
        17
      ],
      "add_million": [
        18,
        19
      ],
      "check_thousand": [
        21
      ],
      "add_thousand": [
        22,
        23
      ],
      "check_hundred": [
        25
      ],
      "add_hundred": [
        26,
        27
      ],
      "check_tens": [
        29
      ],
      "add_tens": [
        30,
        31
      ],
      "check_ones": [
        33
      ],
      "add_ones": [
        34
      ],
      "return_helper": [
        36
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string ones[20] = {\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\",\n        \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\", \"Thirteen\",\n        \"Fourteen\", \"Fifteen\", \"Sixteen\", \"Seventeen\", \"Eighteen\", \"Nineteen\"};\n    string tens_arr[10] = {\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\",\n        \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"};\n    string numberToWords(int num) {\n        if (num == 0) return \"Zero\";\n        return helper(num);\n    }\n    string helper(int num) {\n        string result;\n        if (num >= 1000000000) {\n            result += helper(num / 1000000000) + \" Billion \";\n            num %= 1000000000;\n        }\n        if (num >= 1000000) {\n            result += helper(num / 1000000) + \" Million \";\n            num %= 1000000;\n        }\n        if (num >= 1000) {\n            result += helper(num / 1000) + \" Thousand \";\n            num %= 1000;\n        }\n        if (num >= 100) {\n            result += ones[num / 100] + \" Hundred \";\n            num %= 100;\n        }\n        if (num >= 20) {\n            result += tens_arr[num / 10] + \" \";\n            num %= 10;\n        }\n        if (num > 0) {\n            result += ones[num] + \" \";\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "check_billion": [
        14
      ],
      "add_billion": [
        15,
        16
      ],
      "check_million": [
        18
      ],
      "add_million": [
        19,
        20
      ],
      "check_thousand": [
        22
      ],
      "add_thousand": [
        23,
        24
      ],
      "check_hundred": [
        26
      ],
      "add_hundred": [
        27,
        28
      ],
      "check_tens": [
        30
      ],
      "add_tens": [
        31,
        32
      ],
      "check_ones": [
        34
      ],
      "add_ones": [
        35
      ],
      "return_helper": [
        37
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private string[] ones = {\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\",\n        \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\", \"Thirteen\",\n        \"Fourteen\", \"Fifteen\", \"Sixteen\", \"Seventeen\", \"Eighteen\", \"Nineteen\"};\n    private string[] tens = {\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\",\n        \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"};\n    public string NumberToWords(int num) {\n        if (num == 0) return \"Zero\";\n        return Helper(num).Trim();\n    }\n    private string Helper(int num) {\n        var sb = new System.Text.StringBuilder();\n        if (num >= 1000000000) {\n            sb.Append(Helper(num / 1000000000) + \" Billion \");\n            num %= 1000000000;\n        }\n        if (num >= 1000000) {\n            sb.Append(Helper(num / 1000000) + \" Million \");\n            num %= 1000000;\n        }\n        if (num >= 1000) {\n            sb.Append(Helper(num / 1000) + \" Thousand \");\n            num %= 1000;\n        }\n        if (num >= 100) {\n            sb.Append(ones[num / 100] + \" Hundred \");\n            num %= 100;\n        }\n        if (num >= 20) {\n            sb.Append(tens[num / 10] + \" \");\n            num %= 10;\n        }\n        if (num > 0) {\n            sb.Append(ones[num] + \" \");\n        }\n        return sb.ToString().Trim();\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_billion": [
        13
      ],
      "add_billion": [
        14,
        15
      ],
      "check_million": [
        17
      ],
      "add_million": [
        18,
        19
      ],
      "check_thousand": [
        21
      ],
      "add_thousand": [
        22,
        23
      ],
      "check_hundred": [
        25
      ],
      "add_hundred": [
        26,
        27
      ],
      "check_tens": [
        29
      ],
      "add_tens": [
        30,
        31
      ],
      "check_ones": [
        33
      ],
      "add_ones": [
        34
      ],
      "return_helper": [
        36
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "var ones = []string{\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\",\n    \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\", \"Thirteen\",\n    \"Fourteen\", \"Fifteen\", \"Sixteen\", \"Seventeen\", \"Eighteen\", \"Nineteen\"}\nvar tensArr = []string{\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\",\n    \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"}\n\nfunc numberToWords(num int) string {\n    if num == 0 {\n        return \"Zero\"\n    }\n    return strings.TrimSpace(helper(num))\n}\n\nfunc helper(num int) string {\n    result := \"\"\n    if num >= 1000000000 {\n        result += helper(num/1000000000) + \" Billion \"\n        num %= 1000000000\n    }\n    if num >= 1000000 {\n        result += helper(num/1000000) + \" Million \"\n        num %= 1000000\n    }\n    if num >= 1000 {\n        result += helper(num/1000) + \" Thousand \"\n        num %= 1000\n    }\n    if num >= 100 {\n        result += ones[num/100] + \" Hundred \"\n        num %= 100\n    }\n    if num >= 20 {\n        result += tensArr[num/10] + \" \"\n        num %= 10\n    }\n    if num > 0 {\n        result += ones[num] + \" \"\n    }\n    return strings.TrimSpace(result)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_billion": [
        16
      ],
      "add_billion": [
        17,
        18
      ],
      "check_million": [
        20
      ],
      "add_million": [
        21,
        22
      ],
      "check_thousand": [
        24
      ],
      "add_thousand": [
        25,
        26
      ],
      "check_hundred": [
        28
      ],
      "add_hundred": [
        29,
        30
      ],
      "check_tens": [
        32
      ],
      "add_tens": [
        33,
        34
      ],
      "check_ones": [
        36
      ],
      "add_ones": [
        37
      ],
      "return_helper": [
        39
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var numberToWords = function(num) {\n    const ones = [\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\",\n        \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\", \"Thirteen\",\n        \"Fourteen\", \"Fifteen\", \"Sixteen\", \"Seventeen\", \"Eighteen\", \"Nineteen\"];\n    const tens = [\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\",\n        \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"];\n    if (num === 0) return \"Zero\";\n    function helper(num) {\n        let result = \"\";\n        if (num >= 1000000000) {\n            result += helper(Math.floor(num / 1000000000)) + \" Billion \";\n            num %= 1000000000;\n        }\n        if (num >= 1000000) {\n            result += helper(Math.floor(num / 1000000)) + \" Million \";\n            num %= 1000000;\n        }\n        if (num >= 1000) {\n            result += helper(Math.floor(num / 1000)) + \" Thousand \";\n            num %= 1000;\n        }\n        if (num >= 100) {\n            result += ones[Math.floor(num / 100)] + \" Hundred \";\n            num %= 100;\n        }\n        if (num >= 20) {\n            result += tens[Math.floor(num / 10)] + \" \";\n            num %= 10;\n        }\n        if (num > 0) {\n            result += ones[num] + \" \";\n        }\n        return result.trim();\n    }\n    return helper(num);\n};",
    "lineMap": {
      "-": [
        1
      ],
      "check_billion": [
        10
      ],
      "add_billion": [
        11,
        12
      ],
      "check_million": [
        14
      ],
      "add_million": [
        15,
        16
      ],
      "check_thousand": [
        18
      ],
      "add_thousand": [
        19,
        20
      ],
      "check_hundred": [
        22
      ],
      "add_hundred": [
        23,
        24
      ],
      "check_tens": [
        26
      ],
      "add_tens": [
        27,
        28
      ],
      "check_ones": [
        30
      ],
      "add_ones": [
        31
      ],
      "return_helper": [
        33
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function numberToWords(num: number): string {\n    const ones = [\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\",\n        \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\", \"Thirteen\",\n        \"Fourteen\", \"Fifteen\", \"Sixteen\", \"Seventeen\", \"Eighteen\", \"Nineteen\"];\n    const tens = [\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\",\n        \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"];\n    if (num === 0) return \"Zero\";\n    function helper(num: number): string {\n        let result = \"\";\n        if (num >= 1000000000) {\n            result += helper(Math.floor(num / 1000000000)) + \" Billion \";\n            num %= 1000000000;\n        }\n        if (num >= 1000000) {\n            result += helper(Math.floor(num / 1000000)) + \" Million \";\n            num %= 1000000;\n        }\n        if (num >= 1000) {\n            result += helper(Math.floor(num / 1000)) + \" Thousand \";\n            num %= 1000;\n        }\n        if (num >= 100) {\n            result += ones[Math.floor(num / 100)] + \" Hundred \";\n            num %= 100;\n        }\n        if (num >= 20) {\n            result += tens[Math.floor(num / 10)] + \" \";\n            num %= 10;\n        }\n        if (num > 0) {\n            result += ones[num] + \" \";\n        }\n        return result.trim();\n    }\n    return helper(num);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_billion": [
        10
      ],
      "add_billion": [
        11,
        12
      ],
      "check_million": [
        14
      ],
      "add_million": [
        15,
        16
      ],
      "check_thousand": [
        18
      ],
      "add_thousand": [
        19,
        20
      ],
      "check_hundred": [
        22
      ],
      "add_hundred": [
        23,
        24
      ],
      "check_tens": [
        26
      ],
      "add_tens": [
        27,
        28
      ],
      "check_ones": [
        30
      ],
      "add_ones": [
        31
      ],
      "return_helper": [
        33
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {}
  }
};

const IntegerToEnglishWordsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Millions",
    "value": {
      "num": 1234567
    }
  },
  {
    "id": "ex2",
    "label": "Billions",
    "value": {
      "num": 2147483647
    }
  },
  {
    "id": "ex3",
    "label": "Thousands",
    "value": {
      "num": 12345
    }
  }
];

function generateIntegerToEnglishWordsSteps(e: any): any[] {
  let n=e.num??1234567,t=new RecursiveStepRecorder({num:n},{}),a=["","Thousand","Million","Billion"],s=String(n),o=[];for(let e=s.length;e>0;e-=3)o.unshift(s.substring(Math.max(0,e-3),e));let u=o.map((e,n)=>{let t=o.length-1-n;return{idx:n,value:parseInt(e,10),scale:a[t]??"",digits:e}}),d={};if(u.forEach(e=>{d[o.length-1-e.idx]=e.idx}),u.forEach(e=>{t.add_new_visual(`group_${e.idx}`,{type:"metadata",state:0===e.value?"skip":"pending",value:{value:e.value,scale:e.scale,digits:e.digits,idx:e.idx,words:""}})}),t.add_new_visual("meta_words",{type:"metadata",value:""}),t.add_new_visual("meta_active",{type:"metadata",value:null}),t.pushCallFrame({num:n},"numberToWords"),t.record("-",`Convert ${n.toLocaleString("en-US")} to English words`),0===n)return t.update_visual("meta_words",{type:"metadata",value:"Zero",state:"active"}),t.record("complete",'Result: "Zero"'),t.popCallFrame(),t.getSteps();t.record("split","Split into 3-digit groups; process them right to left.");let h=()=>{t.delete_visual("place_h"),t.delete_visual("place_t"),t.delete_visual("place_o")},c=(e,n,i,r,l)=>{t.update_visual(`place_${e}`,{type:"metadata",state:r,value:{kind:e,digit:n,word:i,revealed:l}})},p=(e,n)=>{let i;u.forEach(e=>{let n=t.get_visual(`group_${e.idx}`);n&&"metadata"===n.type&&"active"===n.state&&t.update_visual(`group_${e.idx}`,{...n,state:0===e.value?"skip":"pending"})});let a=t.get_visual(`group_${e}`);a&&"metadata"===a.type&&t.update_visual(`group_${e}`,{...a,state:"active"}),t.update_visual("meta_active",{type:"metadata",value:{groupIdx:e,scale:u[e].scale,value:n}}),h(),n>=100&&c("h",Math.floor(n/100),r[Math.floor(n/100)]+" Hundred","pending",!1),(i=n%100)>=20?(c("t",Math.floor(i/10),l[Math.floor(i/10)],"pending",!1),i%10>0&&c("o",i%10,r[i%10],"pending",!1)):i>=1&&c("o",i,r[i],"pending",!1)},m=(e,n)=>{let i=t.get_visual(`group_${e}`);i&&"metadata"===i.type&&t.update_visual(`group_${e}`,{type:"metadata",state:"done",value:{...i.value,words:n}})},f=e=>{let n=[],i=e;if(i>=100){let e=Math.floor(i/100);c("h",e,r[e]+" Hundred","active",!0),n.push(r[e]+" Hundred"),t.record("hundreds",`Hundreds: ${e} → "${r[e]} Hundred"`),c("h",e,r[e]+" Hundred","done",!0),i%=100}if(i>=20){let e=Math.floor(i/10);c("t",e,l[e],"active",!0),n.push(l[e]),t.record("tens",`Tens: ${e}0 → "${l[e]}"`),c("t",e,l[e],"done",!0),i%=10}return i>0&&(c("o",i,r[i],"active",!0),n.push(r[i]),t.record("ones",`Ones: ${i} → "${r[i]}"`),c("o",i,r[i],"done",!0)),n.join(" ").trim()},g=n,v=0,_="";for(;g>0;){let e=g%1e3,n=d[v],i=a[v]??"";if(0===e)h(),t.update_visual("meta_active",{type:"metadata",value:null}),t.record("skip_chunk",`Group "${u[n]?.digits??"000"}" is zero — skip.`);else{p(n,e),t.record("chunk_start",`Chunk ${e}${i?` at scale "${i}"`:""} — convert 0-999.`);let r=f(e)+(i?" "+i:"");_=r+(_?" "+_:""),m(n,r),t.update_visual("meta_words",{type:"metadata",value:_,state:"active"}),t.record("prepend",`Prepend "${r}" → "${_}"`)}g=Math.floor(g/1e3),v+=1}return h(),t.update_visual("meta_active",{type:"metadata",value:null}),t.update_visual("meta_words",{type:"metadata",value:_,state:"done"}),t.record("complete",`Result: "${_}"`),t.popCallFrame(),t.getSteps()
}

export function IntegerToEnglishWordsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IntegerToEnglishWordsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateIntegerToEnglishWordsSteps(e) as any[];
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
      title="Integer to English Words"
      slug="integer-to-english-words"
      approaches={approaches}
      presets={IntegerToEnglishWordsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// KMP Algorithm (kmp-algorithm)
// ==========================================

const KmpAlgorithmTemplates = {
  "python": {
    "language": "python",
    "code": "def kmp_search(text: str, pattern: str) -> list[int]:\n    n, m = len(text), len(pattern)\n    if m == 0:\n        return []\n\n    # Build LPS array\n    lps = [0] * m\n    length, i = 0, 1\n    while i < m:\n        if pattern[i] == pattern[length]:\n            length += 1\n            lps[i] = length\n            i += 1\n        elif length != 0:\n            length = lps[length - 1]\n        else:\n            lps[i] = 0\n            i += 1\n\n    # Search\n    matches = []\n    i = j = 0\n    while i < n:\n        if text[i] == pattern[j]:\n            i += 1\n            j += 1\n        if j == m:\n            matches.append(i - j)\n            j = lps[j - 1]\n        elif i < n and text[i] != pattern[j]:\n            if j != 0:\n                j = lps[j - 1]\n            else:\n                i += 1\n    return matches",
    "lineMap": {
      "-": [
        1
      ],
      "build_lps": [
        7,
        8
      ],
      "compare_lps": [
        10
      ],
      "use_lps": [
        15
      ],
      "compare": [
        24
      ],
      "match_found": [
        28,
        29
      ],
      "mismatch": [
        34
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "match_lps": [
        10
      ],
      "match": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> kmpSearch(String text, String pattern) {\n    int n = text.length(), m = pattern.length();\n    List<Integer> matches = new ArrayList<>();\n    if (m == 0) return matches;\n\n    // Build LPS array\n    int[] lps = new int[m];\n    int len = 0, i = 1;\n    while (i < m) {\n        if (pattern.charAt(i) == pattern.charAt(len)) {\n            lps[i++] = ++len;\n        } else if (len != 0) {\n            len = lps[len - 1];\n        } else {\n            lps[i++] = 0;\n        }\n    }\n\n    // Search\n    i = 0;\n    int j = 0;\n    while (i < n) {\n        if (text.charAt(i) == pattern.charAt(j)) {\n            i++; j++;\n        }\n        if (j == m) {\n            matches.add(i - j);\n            j = lps[j - 1];\n        } else if (i < n && text.charAt(i) != pattern.charAt(j)) {\n            if (j != 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_lps": [
        7,
        8
      ],
      "compare_lps": [
        10
      ],
      "use_lps": [
        13
      ],
      "compare": [
        23
      ],
      "match_found": [
        27,
        28
      ],
      "mismatch": [
        31
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "match_lps": [
        10
      ],
      "match": [
        23
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> kmpSearch(string text, string pattern) {\n    int n = text.size(), m = pattern.size();\n    vector<int> matches;\n    if (m == 0) return matches;\n\n    // Build LPS array\n    vector<int> lps(m, 0);\n    int len = 0, i = 1;\n    while (i < m) {\n        if (pattern[i] == pattern[len]) {\n            lps[i++] = ++len;\n        } else if (len != 0) {\n            len = lps[len - 1];\n        } else {\n            lps[i++] = 0;\n        }\n    }\n\n    // Search\n    i = 0;\n    int j = 0;\n    while (i < n) {\n        if (text[i] == pattern[j]) { i++; j++; }\n        if (j == m) {\n            matches.push_back(i - j);\n            j = lps[j - 1];\n        } else if (i < n && text[i] != pattern[j]) {\n            if (j != 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_lps": [
        7,
        8
      ],
      "compare_lps": [
        10
      ],
      "use_lps": [
        13
      ],
      "compare": [
        23
      ],
      "match_found": [
        25,
        26
      ],
      "mismatch": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "match_lps": [
        10
      ],
      "match": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public List<int> KmpSearch(string text, string pattern) {\n    int n = text.Length, m = pattern.Length;\n    var matches = new List<int>();\n    if (m == 0) return matches;\n\n    // Build LPS array\n    int[] lps = new int[m];\n    int len = 0, i = 1;\n    while (i < m) {\n        if (pattern[i] == pattern[len]) {\n            lps[i++] = ++len;\n        } else if (len != 0) {\n            len = lps[len - 1];\n        } else {\n            lps[i++] = 0;\n        }\n    }\n\n    // Search\n    i = 0;\n    int j = 0;\n    while (i < n) {\n        if (text[i] == pattern[j]) { i++; j++; }\n        if (j == m) {\n            matches.Add(i - j);\n            j = lps[j - 1];\n        } else if (i < n && text[i] != pattern[j]) {\n            if (j != 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_lps": [
        7,
        8
      ],
      "compare_lps": [
        10
      ],
      "use_lps": [
        13
      ],
      "compare": [
        23
      ],
      "match_found": [
        25,
        26
      ],
      "mismatch": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "match_lps": [
        10
      ],
      "match": [
        23
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func kmpSearch(text, pattern string) []int {\n    n, m := len(text), len(pattern)\n    matches := []int{}\n    if m == 0 {\n        return matches\n    }\n\n    // Build LPS array\n    lps := make([]int, m)\n    length, i := 0, 1\n    for i < m {\n        if pattern[i] == pattern[length] {\n            length++\n            lps[i] = length\n            i++\n        } else if length != 0 {\n            length = lps[length-1]\n        } else {\n            lps[i] = 0\n            i++\n        }\n    }\n\n    // Search\n    i, j := 0, 0\n    for i < n {\n        if text[i] == pattern[j] {\n            i++\n            j++\n        }\n        if j == m {\n            matches = append(matches, i-j)\n            j = lps[j-1]\n        } else if i < n && text[i] != pattern[j] {\n            if j != 0 {\n                j = lps[j-1]\n            } else {\n                i++\n            }\n        }\n    }\n    return matches\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_lps": [
        9,
        10
      ],
      "compare_lps": [
        12
      ],
      "use_lps": [
        17
      ],
      "compare": [
        27
      ],
      "match_found": [
        32,
        33
      ],
      "mismatch": [
        38
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "match_lps": [
        12
      ],
      "match": [
        27
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function kmpSearch(text, pattern) {\n    const n = text.length, m = pattern.length;\n    const matches = [];\n    if (m === 0) return matches;\n\n    // Build LPS array\n    const lps = new Array(m).fill(0);\n    let len = 0, i = 1;\n    while (i < m) {\n        if (pattern[i] === pattern[len]) {\n            lps[i++] = ++len;\n        } else if (len !== 0) {\n            len = lps[len - 1];\n        } else {\n            lps[i++] = 0;\n        }\n    }\n\n    // Search\n    let j = 0;\n    i = 0;\n    while (i < n) {\n        if (text[i] === pattern[j]) { i++; j++; }\n        if (j === m) {\n            matches.push(i - j);\n            j = lps[j - 1];\n        } else if (i < n && text[i] !== pattern[j]) {\n            if (j !== 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_lps": [
        7,
        8
      ],
      "compare_lps": [
        10
      ],
      "use_lps": [
        13
      ],
      "compare": [
        23
      ],
      "match_found": [
        25,
        26
      ],
      "mismatch": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "match_lps": [
        10
      ],
      "match": [
        23
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function kmpSearch(text: string, pattern: string): number[] {\n    const n = text.length, m = pattern.length;\n    const matches: number[] = [];\n    if (m === 0) return matches;\n\n    // Build LPS array\n    const lps: number[] = new Array(m).fill(0);\n    let len = 0, i = 1;\n    while (i < m) {\n        if (pattern[i] === pattern[len]) {\n            lps[i++] = ++len;\n        } else if (len !== 0) {\n            len = lps[len - 1];\n        } else {\n            lps[i++] = 0;\n        }\n    }\n\n    // Search\n    let j = 0;\n    i = 0;\n    while (i < n) {\n        if (text[i] === pattern[j]) { i++; j++; }\n        if (j === m) {\n            matches.push(i - j);\n            j = lps[j - 1];\n        } else if (i < n && text[i] !== pattern[j]) {\n            if (j !== 0) j = lps[j - 1];\n            else i++;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_lps": [
        7,
        8
      ],
      "compare_lps": [
        10
      ],
      "use_lps": [
        13
      ],
      "compare": [
        23
      ],
      "match_found": [
        25,
        26
      ],
      "mismatch": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "match_lps": [
        10
      ],
      "match": [
        23
      ]
    }
  }
};

const KmpAlgorithmPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Repeated Pattern",
    "value": {
      "text": "aabxaaabxaaab",
      "pattern": "aaab"
    }
  },
  {
    "id": "ex2",
    "label": "Overlapping",
    "value": {
      "text": "ababcababcabab",
      "pattern": "ababcabab"
    }
  },
  {
    "id": "ex3",
    "label": "LPS Fallback",
    "value": {
      "text": "aaaaab",
      "pattern": "aaab"
    }
  },
  {
    "id": "ex4",
    "label": "No Match",
    "value": {
      "text": "abcdefgh",
      "pattern": "xyz"
    }
  }
];

function generateKmpAlgorithmSteps(e: any): any[] {
  let t=e.text,i=e.pattern,a=t.length,n=i.length,l=(e={})=>{let i={};for(let r=0;r<a;r++)i[`text_${r}`]={type:"arrayElement",value:t[r],position:r,row:0,state:e[r]??void 0};return i},s=(e={})=>{let t={};for(let r=0;r<n;r++)t[`pattern_${r}`]={type:"arrayElement",value:i[r],position:r,row:1,state:e[r]??void 0};return t},o=(e,t={})=>{let i={};for(let r=0;r<n;r++)i[`lps_${r}`]={type:"arrayElement",value:e[r],position:r,row:2,state:t[r]??void 0};return i},c=Array(n).fill(0),p=new StepRecorder({text:t,pattern:i,n:a,m:n,phase:"build_lps"},{...l(),...s(),...o(c)});if(p.record("-","KMP Algorithm: First build the LPS (Longest Proper Prefix Suffix) array, then search."),0===n)return p.record("complete","Empty pattern, nothing to search."),p.getSteps();c[0]=0;let d=0,u=1;for(p.update_variable("len",d),p.update_variable("i_lps",u),p.update_visual("lps_0",{type:"arrayElement",value:0,position:0,row:2,state:"placed"}),p.record("build_lps","LPS[0] = 0 always. Start building from index i=1.");u<n;){p.update_variable("i_lps",u),p.update_variable("len",d);let e={};e[u]="active",e[d]="checking",Object.entries(s(e)).forEach(([e,t])=>p.update_visual(e,t));let t={};for(let e=0;e<u;e++)t[e]="placed";if(Object.entries(o(c,t)).forEach(([e,t])=>p.update_visual(e,t)),p.record("compare_lps",`Compare pattern[${u}]='${i[u]}' with pattern[${d}]='${i[d]}'`),i[u]===i[d]){d++,c[u]=d,p.update_variable("len",d),p.add_conditional("match_lps",!0);let e={};e[u]="matched",e[d-1]="matched",Object.entries(s(e)).forEach(([e,t])=>p.update_visual(e,t));let t={};for(let e=0;e<=u;e++)t[e]="placed";t[u]="active",Object.entries(o(c,t)).forEach(([e,t])=>p.update_visual(e,t)),p.record("build_lps",`Match! LPS[${u}] = ${d}. Move both pointers forward.`),u++}else if(p.add_conditional("match_lps",!1),0!==d)d=c[d-1],p.update_variable("len",d),p.record("use_lps",`Mismatch. len ≠ 0, so fall back: len = LPS[${0===d?0:d-1}] (was ${c[d]??d}) = ${d}. Don't advance i.`);else{c[u]=0,p.update_variable("len",d);let e={};for(let t=0;t<=u;t++)e[t]="placed";Object.entries(o(c,e)).forEach(([e,t])=>p.update_visual(e,t)),p.record("build_lps",`Mismatch and len=0. LPS[${u}] = 0. Advance i.`),u++}}Object.entries(s()).forEach(([e,t])=>p.update_visual(e,t));let h={};for(let e=0;e<n;e++)h[e]="placed";Object.entries(o(c,h)).forEach(([e,t])=>p.update_visual(e,t)),p.update_variable("phase","matching"),p.delete_variable("i_lps"),p.delete_variable("len"),p.record("build_lps",`LPS array built: [${c.join(", ")}]. Now search for pattern in text.`);let m=0,f=0,g=[];for(p.update_variable("i",m),p.update_variable("j",f),p.update_visual("ptr_i",{type:"pointer",position:m,label:"i"}),p.update_visual("ptr_j",{type:"pointer",position:f,label:"j"}),p.record("-","Start pattern matching. i points into text, j points into pattern.");m<a;){p.update_variable("i",m),p.update_variable("j",f),p.update_visual("ptr_i",{type:"pointer",position:m,label:"i"}),p.update_visual("ptr_j",{type:"pointer",position:f,label:"j"});let e={};e[m]="active";for(let t=m-f;t<m;t++)e[t]="matched";let r={};r[f]="active";for(let e=0;e<f;e++)r[e]="matched";if(Object.entries(l(e)).forEach(([e,t])=>p.update_visual(e,t)),Object.entries(s(r)).forEach(([e,t])=>p.update_visual(e,t)),p.record("compare",`Compare text[${m}]='${t[m]}' with pattern[${f}]='${i[f]}'`),t[m]===i[f])if(p.add_conditional("match",!0),m++,++f===n){let e=m-f;g.push(e),p.update_variable("i",m),p.update_variable("j",f),p.update_variable("matches",[...g]);let t={};for(let i=e;i<m;i++)t[i]="placed";Object.entries(l(t)).forEach(([e,t])=>p.update_visual(e,t));let i={};for(let e=0;e<n;e++)i[e]="placed";Object.entries(s(i)).forEach(([e,t])=>p.update_visual(e,t)),p.record("match_found",`Pattern found at index ${e}! Use LPS[${n-1}]=${c[n-1]} to continue search.`),f=c[n-1]}else p.record("compare",`Match! Advance i=${m}, j=${f}.`);else if(p.add_conditional("match",!1),0!==f){f=c[f-1],p.update_variable("j",f),p.update_visual("ptr_j",{type:"pointer",position:f,label:"j"});let e={};for(let t=0;t<f;t++)e[t]="matched";e[f]="checking",Object.entries(s(e)).forEach(([e,t])=>p.update_visual(e,t)),p.record("use_lps",`Mismatch. j≠0: skip to j = LPS[${0===f?0:f-1}] = ${f}. Keep i=${m}.`)}else{let e={};for(let t of g)for(let i=t;i<t+n;i++)e[i]="placed";e[m]="mismatch",Object.entries(l(e)).forEach(([e,t])=>p.update_visual(e,t)),Object.entries(s()).forEach(([e,t])=>p.update_visual(e,t)),p.record("mismatch",`Mismatch and j=0. Advance i to ${m+1}.`),m++}}return p.update_visual("ptr_i",{type:"pointer",position:a-1,label:"i"}),p.delete_visual("ptr_j"),p.update_variable("matches",g),g.length>0?p.record("complete",`Done! Pattern found at ${g.length} position(s): [${g.join(", ")}]`):p.record("complete","Done! Pattern not found in text."),p.getSteps()
}

export function KmpAlgorithmProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: KmpAlgorithmTemplates,
      generateSteps: (e: any) => {
        const recorded = generateKmpAlgorithmSteps(e) as any[];
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
      title="KMP Algorithm"
      slug="kmp-algorithm"
      approaches={approaches}
      presets={KmpAlgorithmPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Length of Last Word (length-of-last-word)
// ==========================================

const LengthOfLastWordTemplates = {
  "python": {
    "language": "python",
    "code": "def lengthOfLastWord(s: str) -> int:\n    i = len(s) - 1\n# Skip trailing spaces\n\n    while i >= 0 and s[i] == ' ':\n        i -= 1\n\n    # Count characters in the last word\n    length = 0\n    while i >= 0 and s[i] != ' ':\n        length += 1\n        i -= 1\n\n    return length",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "skip_space": [
        5
      ],
      "dec_i_space": [
        6
      ],
      "init_length": [
        9
      ],
      "count_char": [
        10,
        11
      ],
      "dec_i_count": [
        12
      ],
      "stop": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_space": [
        5
      ],
      "is_not_space": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int lengthOfLastWord(String s) {\n    int i = s.length() - 1;\n// Skip trailing spaces\n\n    while (i >= 0 && s.charAt(i) == ' ') {\n        i--;\n    }\n\n    // Count characters in the last word\n    int length = 0;\n    while (i >= 0 && s.charAt(i) != ' ') {\n        length++;\n        i--;\n    }\n\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "skip_space": [
        5
      ],
      "dec_i_space": [
        6
      ],
      "init_length": [
        10
      ],
      "count_char": [
        11,
        12
      ],
      "dec_i_count": [
        13
      ],
      "stop": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_space": [
        5
      ],
      "is_not_space": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int lengthOfLastWord(string s) {\n    int i = s.length() - 1;\n// Skip trailing spaces\n\n    while (i >= 0 && s[i] == ' ') {\n        i--;\n    }\n\n    // Count characters in the last word\n    int length = 0;\n    while (i >= 0 && s[i] != ' ') {\n        length++;\n        i--;\n    }\n\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "skip_space": [
        5
      ],
      "dec_i_space": [
        6
      ],
      "init_length": [
        10
      ],
      "count_char": [
        11,
        12
      ],
      "dec_i_count": [
        13
      ],
      "stop": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_space": [
        5
      ],
      "is_not_space": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LengthOfLastWord(string s) {\n    int i = s.Length - 1;\n// Skip trailing spaces\n\n    while (i >= 0 && s[i] == ' ') {\n        i--;\n    }\n\n    // Count characters in the last word\n    int length = 0;\n    while (i >= 0 && s[i] != ' ') {\n        length++;\n        i--;\n    }\n\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "skip_space": [
        5
      ],
      "dec_i_space": [
        6
      ],
      "init_length": [
        10
      ],
      "count_char": [
        11,
        12
      ],
      "dec_i_count": [
        13
      ],
      "stop": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_space": [
        5
      ],
      "is_not_space": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func lengthOfLastWord(s string) int {\n    i := len(s) - 1\n// Skip trailing spaces\n\n    for i >= 0 && s[i] == ' ' {\n        i--\n    }\n\n    // Count characters in the last word\n    length := 0\n    for i >= 0 && s[i] != ' ' {\n        length++\n        i--\n    }\n\n    return length\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "skip_space": [
        5
      ],
      "dec_i_space": [
        6
      ],
      "init_length": [
        10
      ],
      "count_char": [
        11,
        12
      ],
      "dec_i_count": [
        13
      ],
      "stop": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_space": [
        5
      ],
      "is_not_space": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var lengthOfLastWord = function(s) {\n    let i = s.length - 1;\n// Skip trailing spaces\n\n    while (i >= 0 && s[i] === ' ') {\n        i--;\n    }\n\n    // Count characters in the last word\n    let length = 0;\n    while (i >= 0 && s[i] !== ' ') {\n        length++;\n        i--;\n    }\n\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "skip_space": [
        5
      ],
      "dec_i_space": [
        6
      ],
      "init_length": [
        10
      ],
      "count_char": [
        11,
        12
      ],
      "dec_i_count": [
        13
      ],
      "stop": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_space": [
        5
      ],
      "is_not_space": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function lengthOfLastWord(s: string): number {\n    let i = s.length - 1;\n// Skip trailing spaces\n\n    while (i >= 0 && s[i] === ' ') {\n        i--;\n    }\n\n    // Count characters in the last word\n    let length = 0;\n    while (i >= 0 && s[i] !== ' ') {\n        length++;\n        i--;\n    }\n\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "skip_space": [
        5
      ],
      "dec_i_space": [
        6
      ],
      "init_length": [
        10
      ],
      "count_char": [
        11,
        12
      ],
      "dec_i_count": [
        13
      ],
      "stop": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_space": [
        5
      ],
      "is_not_space": [
        11
      ]
    }
  }
};

const LengthOfLastWordPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "Hello World"
    }
  },
  {
    "id": "ex2",
    "label": "Trailing Spaces",
    "value": {
      "s": "   fly me   to   the moon  "
    }
  },
  {
    "id": "ex3",
    "label": "No Trailing Spaces",
    "value": {
      "s": "luffy is still joyboy"
    }
  }
];

function generateLengthOfLastWordSteps(t: any): any[] {
  let e=t.s,i=e.length,a={};for(let t=0;t<i;t++){let i=e[t];a[`char_${t}`]={type:"arrayElement",value:" "===i?"␣":i,position:t,state:" "===i?"space":void 0}}let l=new StepRecorder({s:e},a);l.record("-",`Start: find the length of the last word in "${e}"`);let s=i-1;for(l.add_new_variable("i",s),l.add_new_variable("length",0),l.add_new_visual("ptr_i",{type:"pointer",position:s,label:"i"}),l.record("init",`Initialize i = ${s}, the last index of the string`);s>=0&&" "===e[s];)l.update_visual(`char_${s}`,{type:"arrayElement",value:"␣",position:s,state:"comparing"}),l.add_conditional("is_space",!0),l.record("skip_space",`s[${s}] = '␣' is a space, skip it`),l.update_visual(`char_${s}`,{type:"arrayElement",value:"␣",position:s,state:"skipped"}),s--,l.update_variable("i",s),s>=0?l.update_visual("ptr_i",{type:"pointer",position:s,label:"i"}):l.delete_visual("ptr_i"),l.record("dec_i_space",`Decrement i to ${s}`);if(s<0)return l.update_variable("length",0),l.add_new_visual("meta_length",{type:"metadata",value:0,label:"length"}),l.record("complete","Done! The string has no words, so length = 0"),l.getSteps();let r=s,o=0;for(l.add_new_visual("meta_length",{type:"metadata",value:o,label:"length"}),l.record("init_length",`s[${s}] = '${e[s]}' is the last character of the last word, initialize length = 0`);s>=0&&" "!==e[s];)l.add_conditional("is_not_space",!0),o++,l.update_variable("length",o),l.update_visual("meta_length",{type:"metadata",value:o,label:"length"}),l.update_visual(`char_${s}`,{type:"arrayElement",value:e[s],position:s,state:"matched"}),l.record("count_char",`s[${s}] = '${e[s]}' is not a space, count it: length = ${o}`),s--,l.update_variable("i",s),s>=0?l.update_visual("ptr_i",{type:"pointer",position:s,label:"i"}):l.delete_visual("ptr_i"),l.record("dec_i_count",`Decrement i to ${s}`);s>=0&&" "===e[s]?(l.add_conditional("is_not_space",!1),l.update_visual(`char_${s}`,{type:"arrayElement",value:"␣",position:s,state:"mismatch"}),l.record("stop",`s[${s}] = '␣' is a space, the last word ends here`)):l.record("stop","i < 0, reached the start of the string");let c=s+1,d=e.slice(c,r+1);s>=0&&(l.update_visual(`char_${s}`,{type:"arrayElement",value:"␣",position:s,state:"space"}),l.delete_visual("ptr_i"));for(let t=0;t<c;t++)" "!==e[t]&&l.update_visual(`char_${t}`,{type:"arrayElement",value:e[t],position:t,state:"dim"});return l.record("complete",`Done! The last word is "${d}", its length is ${o}`),l.getSteps()
}

export function LengthOfLastWordProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LengthOfLastWordTemplates,
      generateSteps: (t: any) => {
        const recorded = generateLengthOfLastWordSteps(t) as any[];
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
      title="Length of Last Word"
      slug="length-of-last-word"
      approaches={approaches}
      presets={LengthOfLastWordPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Nice Substring (longest-nice-substring)
// ==========================================

const LongestNiceSubstringTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def longestNiceSubstring(self, s: str) -> str:\n        if len(s) < 2:\n            return \"\"\n\n        # Build a set of all characters in the string\n        char_set = set(s)\n\n        # Find a character whose counterpart is missing\n        for i, c in enumerate(s):\n            if c.lower() in char_set and c.upper() in char_set:\n                continue\n            # Split at this character and recurse on both halves\n            left = self.longestNiceSubstring(s[:i])\n            right = self.longestNiceSubstring(s[i + 1:])\n            return left if len(left) >= len(right) else right\n\n        # All characters have their counterpart, the whole string is nice\n        return s",
    "lineMap": {
      "-": [
        2
      ],
      "check_length": [
        2,
        3
      ],
      "return_empty": [
        3,
        4
      ],
      "build_set": [
        7
      ],
      "found_bad": [
        10,
        11,
        12
      ],
      "split": [
        14,
        15
      ],
      "compare_halves": [
        16
      ],
      "return_nice": [
        19
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_short": [
        3
      ],
      "no_bad": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String longestNiceSubstring(String s) {\n        if (s.length() < 2) return \"\";\n\n        // Build a set of all characters in the string\n        HashSet<Character> set = new HashSet<>();\n        for (char c : s.toCharArray()) {\n            set.add(c);\n        }\n\n        // Find a character whose counterpart is missing\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (set.contains(Character.toLowerCase(c)) && set.contains(Character.toUpperCase(c))) {\n                continue;\n            }\n            // Split at this character and recurse on both halves\n            String left = longestNiceSubstring(s.substring(0, i));\n            String right = longestNiceSubstring(s.substring(i + 1));\n            return left.length() >= right.length() ? left : right;\n        }\n\n        // All characters have their counterpart, the whole string is nice\n        return s;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "check_length": [
        2,
        3
      ],
      "return_empty": [
        3
      ],
      "build_set": [
        6,
        7,
        8,
        9
      ],
      "found_bad": [
        12,
        13,
        14,
        15,
        16
      ],
      "split": [
        18,
        19
      ],
      "compare_halves": [
        20
      ],
      "return_nice": [
        24
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_short": [
        3
      ],
      "no_bad": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string longestNiceSubstring(string s) {\n        if (s.size() < 2) return \"\";\n\n        // Build a set of all characters in the string\n        unordered_set<char> charSet(s.begin(), s.end());\n\n        // Find a character whose counterpart is missing\n        for (int i = 0; i < (int)s.size(); i++) {\n            char c = s[i];\n            if (charSet.count(tolower(c)) && charSet.count(toupper(c))) {\n                continue;\n            }\n            // Split at this character and recurse on both halves\n            string left = longestNiceSubstring(s.substr(0, i));\n            string right = longestNiceSubstring(s.substr(i + 1));\n            return left.size() >= right.size() ? left : right;\n        }\n\n        // All characters have their counterpart, the whole string is nice\n        return s;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "check_length": [
        3,
        4
      ],
      "return_empty": [
        4
      ],
      "build_set": [
        7
      ],
      "found_bad": [
        10,
        11,
        12,
        13,
        14
      ],
      "split": [
        16,
        17
      ],
      "compare_halves": [
        18
      ],
      "return_nice": [
        22
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "too_short": [
        4
      ],
      "no_bad": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string LongestNiceSubstring(string s) {\n        if (s.Length < 2) return \"\";\n\n        // Build a set of all characters in the string\n        HashSet<char> charSet = new HashSet<char>(s);\n\n        // Find a character whose counterpart is missing\n        for (int i = 0; i < s.Length; i++) {\n            char c = s[i];\n            if (charSet.Contains(char.ToLower(c)) && charSet.Contains(char.ToUpper(c))) {\n                continue;\n            }\n            // Split at this character and recurse on both halves\n            string left = LongestNiceSubstring(s.Substring(0, i));\n            string right = LongestNiceSubstring(s.Substring(i + 1));\n            return left.Length >= right.Length ? left : right;\n        }\n\n        // All characters have their counterpart, the whole string is nice\n        return s;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "check_length": [
        2,
        3
      ],
      "return_empty": [
        3
      ],
      "build_set": [
        6
      ],
      "found_bad": [
        9,
        10,
        11,
        12,
        13
      ],
      "split": [
        15,
        16
      ],
      "compare_halves": [
        17
      ],
      "return_nice": [
        21
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_short": [
        3
      ],
      "no_bad": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestNiceSubstring(s string) string {\n    if len(s) < 2 {\n        return \"\"\n    }\n\n    // Build a set of all characters in the string\n    charSet := make(map[byte]bool)\n    for i := 0; i < len(s); i++ {\n        charSet[s[i]] = true\n    }\n\n    // Find a character whose counterpart is missing\n    for i := 0; i < len(s); i++ {\n        c := s[i]\n        hasLower := charSet[c|32]   // lowercase version\n        hasUpper := charSet[c&^32]  // uppercase version\n        if hasLower && hasUpper {\n            continue\n        }\n        // Split at this character and recurse on both halves\n        left := longestNiceSubstring(s[:i])\n        right := longestNiceSubstring(s[i+1:])\n        if len(left) >= len(right) {\n            return left\n        }\n        return right\n    }\n\n    // All characters have their counterpart, the whole string is nice\n    return s\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        1,
        2
      ],
      "return_empty": [
        2,
        3
      ],
      "build_set": [
        7,
        8,
        9,
        10
      ],
      "found_bad": [
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "split": [
        21,
        22
      ],
      "compare_halves": [
        23,
        24,
        25,
        26
      ],
      "return_nice": [
        30
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "too_short": [
        2
      ],
      "no_bad": [
        30
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestNiceSubstring = function (s) {\n  if (s.length < 2) return \"\";\n\n  // Build a set of all characters in the string\n  let charSet = new Set(s);\n\n  // Find a character whose counterpart is missing\n  for (let i = 0; i < s.length; i++) {\n    let c = s[i];\n    if (charSet.has(c.toLowerCase()) && charSet.has(c.toUpperCase())) {\n      continue;\n    }\n    // Split at this character and recurse on both halves\n    let left = longestNiceSubstring(s.substring(0, i));\n    let right = longestNiceSubstring(s.substring(i + 1));\n    return left.length >= right.length ? left : right;\n  }\n\n  // All characters have their counterpart, the whole string is nice\n  return s;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        1,
        2
      ],
      "return_empty": [
        2
      ],
      "build_set": [
        5
      ],
      "found_bad": [
        8,
        9,
        10,
        11,
        12
      ],
      "split": [
        14,
        15
      ],
      "compare_halves": [
        16
      ],
      "return_nice": [
        20
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "too_short": [
        2
      ],
      "no_bad": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestNiceSubstring(s: string): string {\n    if (s.length < 2) return \"\";\n\n    // Build a set of all characters in the string\n    let charSet = new Set(s);\n\n    // Find a character whose counterpart is missing\n    for (let i = 0; i < s.length; i++) {\n        let c = s[i];\n        if (charSet.has(c.toLowerCase()) && charSet.has(c.toUpperCase())) {\n            continue;\n        }\n        // Split at this character and recurse on both halves\n        let left = longestNiceSubstring(s.substring(0, i));\n        let right = longestNiceSubstring(s.substring(i + 1));\n        return left.length >= right.length ? left : right;\n    }\n\n    // All characters have their counterpart, the whole string is nice\n    return s;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        1,
        2
      ],
      "return_empty": [
        2
      ],
      "build_set": [
        5
      ],
      "found_bad": [
        8,
        9,
        10,
        11,
        12
      ],
      "split": [
        14,
        15
      ],
      "compare_halves": [
        16
      ],
      "return_nice": [
        20
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "too_short": [
        2
      ],
      "no_bad": [
        20
      ]
    }
  }
};

const LongestNiceSubstringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "YazaAay"
    }
  },
  {
    "id": "ex2",
    "label": "Two halves",
    "value": {
      "s": "dDzeE"
    }
  },
  {
    "id": "ex3",
    "label": "Simple nice",
    "value": {
      "s": "Bb"
    }
  }
];

function generateLongestNiceSubstringSteps(e: any): any[] {
  let t=e.s??"YazaAay",r=t.length,s=new StepRecorder({}),i=-1,a=0,l="",c=e=>{for(let[r,n]of(s.update_variable("s",t),s.update_variable("bestStart",i),s.update_variable("bestEnd",a>0?i+a-1:-1),s.update_variable("bestText",l),Object.entries(e)))s.update_variable(r,n)},o=e=>{if(e.length<2)return!1;let t=new Set(e);for(let r of e)if(!t.has(r.toLowerCase())||!t.has(r.toUpperCase()))return!1;return!0};c({i:-1,j:-1}),s.record("-",`Check every substring of "${t}" and keep the longest nice one.`);for(let e=0;e<r;e++)for(let n=e;n<r;n++){let r=t.slice(e,n+1),h=o(r),u=n-e+1,d=h&&u>a;d&&(i=e,a=u,l=r),c({i:e,j:n,isNice:h}),s.record(d?"found":"check",d?`"${r}" is nice and longer → best = "${r}" (length ${u}).`:`"${r}"${h?` is nice but not longer than ${a}`:" is not nice"}.`)}return c({i:-1,j:-1,result:l}),s.record("complete",`Done! Longest nice substring = "${l||"(none)"}".`),s.getSteps()
}

export function LongestNiceSubstringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestNiceSubstringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestNiceSubstringSteps(e) as any[];
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
      title="Longest Nice Substring"
      slug="longest-nice-substring"
      approaches={approaches}
      presets={LongestNiceSubstringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of Matching Subsequences (number-of-matching-subsequences)
// ==========================================

const NumberOfMatchingSubsequencesTemplates = {
  "python": {
    "language": "python",
    "code": "def numMatchingSubseq(s, words):\n    buckets = [[] for _ in range(26)]\n    for i, word in enumerate(words):\n        buckets[ord(word[0]) - ord('a')].append((i, 0))\n    count = 0\n    for c in s:\n        current = buckets[ord(c) - ord('a')]\n        buckets[ord(c) - ord('a')] = []\n        for word_idx, char_idx in current:\n            char_idx += 1\n            if char_idx == len(words[word_idx]):\n                count += 1\n            else:\n                next_char = words[word_idx][char_idx]\n                buckets[ord(next_char) - ord('a')].append(\n                    (word_idx, char_idx))\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "init_buckets": [
        2
      ],
      "place_words": [
        3,
        4
      ],
      "scan_char": [
        6
      ],
      "process_bucket": [
        7,
        8
      ],
      "advance_word": [
        10,
        11
      ],
      "word_matched": [
        12,
        13
      ],
      "move_to_bucket": [
        15,
        16,
        17
      ],
      "scan_done": [
        6
      ],
      "complete": [
        17
      ],
      "check_matched": [
        12
      ]
    },
    "conditionalMap": {
      "check_matched": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int numMatchingSubseq(String s, String[] words) {\n    List<int[]>[] buckets = new List[26];\n    for (int i = 0; i < 26; i++) {\n        buckets[i] = new ArrayList<>();\n    }\n    for (int i = 0; i < words.length; i++) {\n        buckets[words[i].charAt(0) - 'a'].add(new int[]{i, 0});\n    }\n    int count = 0;\n    for (char c : s.toCharArray()) {\n        List<int[]> current = buckets[c - 'a'];\n        buckets[c - 'a'] = new ArrayList<>();\n        for (int[] entry : current) {\n            int wordIdx = entry[0];\n            int charIdx = entry[1] + 1;\n            if (charIdx == words[wordIdx].length()) {\n                count++;\n            } else {\n                buckets[words[wordIdx].charAt(charIdx) - 'a']\n                    .add(new int[]{wordIdx, charIdx});\n            }\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_buckets": [
        2,
        3,
        4
      ],
      "place_words": [
        6,
        7
      ],
      "scan_char": [
        10
      ],
      "process_bucket": [
        11,
        12
      ],
      "advance_word": [
        14,
        15
      ],
      "word_matched": [
        16,
        17
      ],
      "move_to_bucket": [
        19,
        20
      ],
      "scan_done": [
        10
      ],
      "complete": [
        23
      ],
      "check_matched": [
        16
      ]
    },
    "conditionalMap": {
      "check_matched": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int numMatchingSubseq(string s, vector<string>& words) {\n    vector<vector<pair<int, int>>> buckets(26);\n    for (int i = 0; i < words.size(); i++) {\n        buckets[words[i][0] - 'a'].push_back({i, 0});\n    }\n    int count = 0;\n    for (char c : s) {\n        vector<pair<int, int>> current = move(buckets[c - 'a']);\n        buckets[c - 'a'].clear();\n        for (auto& [wordIdx, charIdx] : current) {\n            charIdx++;\n            if (charIdx == words[wordIdx].size()) {\n                count++;\n            } else {\n                buckets[words[wordIdx][charIdx] - 'a']\n                    .push_back({wordIdx, charIdx});\n            }\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_buckets": [
        2
      ],
      "place_words": [
        3,
        4
      ],
      "scan_char": [
        7
      ],
      "process_bucket": [
        8,
        9
      ],
      "advance_word": [
        10,
        11
      ],
      "word_matched": [
        12,
        13
      ],
      "move_to_bucket": [
        15,
        16
      ],
      "scan_done": [
        7
      ],
      "complete": [
        20
      ],
      "check_matched": [
        12
      ]
    },
    "conditionalMap": {
      "check_matched": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int NumMatchingSubseq(string s, string[] words) {\n    var buckets = new List<int[]>[26];\n    for (int i = 0; i < 26; i++) {\n        buckets[i] = new List<int[]>();\n    }\n    for (int i = 0; i < words.Length; i++) {\n        buckets[words[i][0] - 'a'].Add(new int[] { i, 0 });\n    }\n    int count = 0;\n    foreach (char c in s) {\n        var current = buckets[c - 'a'];\n        buckets[c - 'a'] = new List<int[]>();\n        foreach (var entry in current) {\n            int wordIdx = entry[0];\n            int charIdx = entry[1] + 1;\n            if (charIdx == words[wordIdx].Length) {\n                count++;\n            } else {\n                buckets[words[wordIdx][charIdx] - 'a']\n                    .Add(new int[]{wordIdx, charIdx});\n            }\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_buckets": [
        2,
        3,
        4
      ],
      "place_words": [
        6,
        7
      ],
      "scan_char": [
        10
      ],
      "process_bucket": [
        11,
        12
      ],
      "advance_word": [
        14,
        15
      ],
      "word_matched": [
        16,
        17
      ],
      "move_to_bucket": [
        19,
        20
      ],
      "scan_done": [
        10
      ],
      "complete": [
        24
      ],
      "check_matched": [
        16
      ]
    },
    "conditionalMap": {
      "check_matched": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func numMatchingSubseq(s string, words []string) int {\n    type entry struct{ wordIdx, charIdx int }\n    buckets := make([][]entry, 26)\n    for i := range buckets {\n        buckets[i] = []entry{}\n    }\n    for i, word := range words {\n        buckets[word[0]-'a'] = append(buckets[word[0]-'a'], entry{i, 0})\n    }\n    count := 0\n    for _, c := range s {\n        idx := c - 'a'\n        current := buckets[idx]\n        buckets[idx] = []entry{}\n        for _, e := range current {\n            e.charIdx++\n            if e.charIdx == len(words[e.wordIdx]) {\n                count++\n            } else {\n                nextChar := words[e.wordIdx][e.charIdx] - 'a'\n                buckets[nextChar] = append(buckets[nextChar], e)\n            }\n        }\n    }\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_buckets": [
        2,
        3,
        4,
        5
      ],
      "place_words": [
        7,
        8
      ],
      "scan_char": [
        11
      ],
      "process_bucket": [
        12,
        13,
        14
      ],
      "advance_word": [
        15,
        16
      ],
      "word_matched": [
        17,
        18
      ],
      "move_to_bucket": [
        20,
        21
      ],
      "scan_done": [
        11
      ],
      "complete": [
        25
      ],
      "check_matched": [
        17
      ]
    },
    "conditionalMap": {
      "check_matched": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function numMatchingSubseq(s, words) {\n    const buckets = Array.from({length: 26}, () => []);\n    for (let i = 0; i < words.length; i++) {\n        buckets[words[i].charCodeAt(0) - 97].push([i, 0]);\n    }\n    let count = 0;\n    for (const c of s) {\n        const current = buckets[c.charCodeAt(0) - 97];\n        buckets[c.charCodeAt(0) - 97] = [];\n        for (const [wordIdx, prevCharIdx] of current) {\n            const charIdx = prevCharIdx + 1;\n            if (charIdx === words[wordIdx].length) {\n                count++;\n            } else {\n                const next = words[wordIdx].charCodeAt(charIdx) - 97;\n                buckets[next].push([wordIdx, charIdx]);\n            }\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_buckets": [
        2
      ],
      "place_words": [
        3,
        4
      ],
      "scan_char": [
        7
      ],
      "process_bucket": [
        8,
        9
      ],
      "advance_word": [
        10,
        11
      ],
      "word_matched": [
        12,
        13
      ],
      "move_to_bucket": [
        15,
        16
      ],
      "scan_done": [
        7
      ],
      "complete": [
        20
      ],
      "check_matched": [
        12
      ]
    },
    "conditionalMap": {
      "check_matched": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function numMatchingSubseq(s: string, words: string[]): number {\n    const buckets: number[][][] = Array.from({length: 26}, () => []);\n    for (let i = 0; i < words.length; i++) {\n        buckets[words[i].charCodeAt(0) - 97].push([i, 0]);\n    }\n    let count = 0;\n    for (const c of s) {\n        const current = buckets[c.charCodeAt(0) - 97];\n        buckets[c.charCodeAt(0) - 97] = [];\n        for (const [wordIdx, prevCharIdx] of current) {\n            const charIdx = prevCharIdx + 1;\n            if (charIdx === words[wordIdx].length) {\n                count++;\n            } else {\n                const next = words[wordIdx].charCodeAt(charIdx) - 97;\n                buckets[next].push([wordIdx, charIdx]);\n            }\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_buckets": [
        2
      ],
      "place_words": [
        3,
        4
      ],
      "scan_char": [
        7
      ],
      "process_bucket": [
        8,
        9
      ],
      "advance_word": [
        10,
        11
      ],
      "word_matched": [
        12,
        13
      ],
      "move_to_bucket": [
        15,
        16
      ],
      "scan_done": [
        7
      ],
      "complete": [
        20
      ],
      "check_matched": [
        12
      ]
    },
    "conditionalMap": {
      "check_matched": [
        12
      ]
    }
  }
};

const NumberOfMatchingSubsequencesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "abcde",
      "words": [
        "a",
        "bb",
        "acd",
        "ace"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Complex",
    "value": {
      "s": "dsahjpjauf",
      "words": [
        "ahjpjau",
        "ja",
        "ahbwzgqnuk",
        "tnmlanowax"
      ]
    }
  }
];

function generateNumberOfMatchingSubsequencesSteps(e: any): any[] {
  let{s:t,words:i}=e,n={};for(let e=0;e<t.length;e++)n[`s_${e}`]={type:"arrayElement",value:t[e],position:e,state:"pending"};let r=new StepRecorder({},n),o=Array(i.length).fill(0),c=Array(i.length).fill("waiting"),s=()=>{let e=i.map((e,t)=>({idx:t,word:e,matchedLen:o[t],state:c[t]}));r.update_variable("wordsState",e)},l=(e,t)=>{let i=0,a=e.length;for(;i<a;){let n=i+a>>1;e[n]<=t?i=n+1:a=n}return i},d=()=>{r.delete_variable("activeWord"),r.delete_variable("activeChar"),r.delete_variable("posList"),r.delete_variable("prev"),r.delete_variable("pickIdx"),r.delete_variable("charPtr"),r.delete_variable("searching")},h=new Map;for(let e=0;e<t.length;e++){let i=t[e];h.has(i)||h.set(i,[]),h.get(i).push(e)}let u={};h.forEach((e,t)=>u[t]=e),r.update_variable("phase","build"),r.update_variable("count",0),s(),r.record("-","Count how many words are subsequences of s"),r.update_variable("positions",u),r.record("build_positions","Record every index of each character in s");let p=0;for(let e=0;e<i.length;e++){let a=i[e];c[e]="active",o[e]=0;let n=-1;d(),r.update_variable("phase","scan"),r.update_variable("activeWord",e),r.update_variable("charPtr",0),r.update_variable("prev",n),s(),r.record("pick_word",`Check "${a}": jump forward through s, one letter at a time`);let u=!0;for(let t=0;t<a.length;t++){let i=a[t],d=h.get(i)??[],p=l(d,n);if(r.update_variable("charPtr",t),r.update_variable("activeChar",i),r.update_variable("posList",d),r.update_variable("prev",n),r.update_variable("searching",!0),r.delete_variable("pickIdx"),s(),r.record("search_char",`Binary-search '${i}' at [${d.join(", ")}] for the first index > ${n}`),p===d.length){u=!1,c[e]="stuck",r.update_variable("pickIdx",-1),r.delete_variable("searching"),s(),r.record("fail",`No '${i}' after index ${n} — "${a}" is not a subsequence`);break}let g=n;n=d[p],o[e]=t+1,r.update_variable("pickIdx",n),r.update_variable("prev",n),r.delete_variable("searching");let f=r.get_visual(`s_${n}`);r.update_visual(`s_${n}`,{...f,state:"active"}),s(),r.record("jump",`First '${i}' after index ${g} is at ${n} — jump there`)}u&&(c[e]="matched",p+=1,r.update_variable("count",p),r.delete_variable("searching"),r.delete_variable("posList"),r.delete_variable("activeChar"),r.delete_variable("pickIdx"),s(),r.record("word_matched",`Every letter found in order — "${a}" matches, count = ${p}`));for(let e=0;e<t.length;e++){let t=r.get_visual(`s_${e}`);r.update_visual(`s_${e}`,{...t,state:"pending"})}}return d(),r.update_variable("phase","done"),r.update_variable("done",!0),r.update_variable("count",p),s(),r.record("complete",`Result: ${p} of ${i.length} word${1===i.length?"":"s"} are subsequences`),r.getSteps()
}

export function NumberOfMatchingSubsequencesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOfMatchingSubsequencesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNumberOfMatchingSubsequencesSteps(e) as any[];
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
      title="Number of Matching Subsequences"
      slug="number-of-matching-subsequences"
      approaches={approaches}
      presets={NumberOfMatchingSubsequencesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// One Edit Distance (one-edit-distance)
// ==========================================

const OneEditDistanceTemplates = {
  "python": {
    "language": "python",
    "code": "def isOneEditDistance(s: str, t: str) -> bool:\n    # Ensure s is the shorter or equal-length string\n    if len(s) > len(t):\n        return isOneEditDistance(t, s)\n\n    # Length difference > 1 means more than one edit needed\n    if len(t) - len(s) > 1:\n        return False\n\n    # Find the first mismatch\n    for i in range(len(s)):\n        if s[i] != t[i]:\n            if len(s) == len(t):\n                # Replace case: rest of strings must match\n                return s[i + 1:] == t[i + 1:]\n            else:\n                # Insert/delete case: skip char in t, rest must match\n                return s[i:] == t[i + 1:]\n\n    # No mismatch found; one edit only if t has one extra char at the end\n    return len(s) != len(t)",
    "lineMap": {
      "-": [
        1
      ],
      "check_swap": [
        3,
        4
      ],
      "check_length_diff": [
        7,
        8
      ],
      "compare": [
        11,
        12
      ],
      "match": [
        11
      ],
      "mismatch": [
        12
      ],
      "check_replace": [
        13,
        15
      ],
      "check_insert": [
        16,
        18
      ],
      "rest_match": [
        15,
        18
      ],
      "rest_mismatch": [
        15,
        18
      ],
      "no_mismatch": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "length_diff": [
        7
      ],
      "char_equal": [
        12
      ],
      "same_length": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isOneEditDistance(String s, String t) {\n    int sLen = s.length(), tLen = t.length();\n    // Ensure s is the shorter or equal-length string\n    if (sLen > tLen) {\n        return isOneEditDistance(t, s);\n    }\n\n    // Length difference > 1 means more than one edit needed\n    if (tLen - sLen > 1) {\n        return false;\n    }\n\n    // Find the first mismatch\n    for (int i = 0; i < sLen; i++) {\n        if (s.charAt(i) != t.charAt(i)) {\n            if (sLen == tLen) {\n                // Replace case: rest of strings must match\n                return s.substring(i + 1).equals(t.substring(i + 1));\n            } else {\n                // Insert/delete case: skip char in t, rest must match\n                return s.substring(i).equals(t.substring(i + 1));\n            }\n        }\n    }\n\n    // No mismatch found; one edit only if t has one extra char at the end\n    return sLen != tLen;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "check_swap": [
        4,
        5
      ],
      "check_length_diff": [
        9,
        10
      ],
      "compare": [
        14,
        15
      ],
      "match": [
        14
      ],
      "mismatch": [
        15
      ],
      "check_replace": [
        16,
        18
      ],
      "check_insert": [
        19,
        21
      ],
      "rest_match": [
        18,
        21
      ],
      "rest_mismatch": [
        18,
        21
      ],
      "no_mismatch": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "length_diff": [
        9
      ],
      "char_equal": [
        15
      ],
      "same_length": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isOneEditDistance(string s, string t) {\n    int sLen = s.length(), tLen = t.length();\n    // Ensure s is the shorter or equal-length string\n    if (sLen > tLen) {\n        return isOneEditDistance(t, s);\n    }\n\n    // Length difference > 1 means more than one edit needed\n    if (tLen - sLen > 1) {\n        return false;\n    }\n\n    // Find the first mismatch\n    for (int i = 0; i < sLen; i++) {\n        if (s[i] != t[i]) {\n            if (sLen == tLen) {\n                // Replace case: rest of strings must match\n                return s.substr(i + 1) == t.substr(i + 1);\n            } else {\n                // Insert/delete case: skip char in t, rest must match\n                return s.substr(i) == t.substr(i + 1);\n            }\n        }\n    }\n\n    // No mismatch found; one edit only if t has one extra char at the end\n    return sLen != tLen;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "check_swap": [
        4,
        5
      ],
      "check_length_diff": [
        9,
        10
      ],
      "compare": [
        14,
        15
      ],
      "match": [
        14
      ],
      "mismatch": [
        15
      ],
      "check_replace": [
        16,
        18
      ],
      "check_insert": [
        19,
        21
      ],
      "rest_match": [
        18,
        21
      ],
      "rest_mismatch": [
        18,
        21
      ],
      "no_mismatch": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "length_diff": [
        9
      ],
      "char_equal": [
        15
      ],
      "same_length": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsOneEditDistance(string s, string t) {\n    int sLen = s.Length, tLen = t.Length;\n    // Ensure s is the shorter or equal-length string\n    if (sLen > tLen) {\n        return IsOneEditDistance(t, s);\n    }\n\n    // Length difference > 1 means more than one edit needed\n    if (tLen - sLen > 1) {\n        return false;\n    }\n\n    // Find the first mismatch\n    for (int i = 0; i < sLen; i++) {\n        if (s[i] != t[i]) {\n            if (sLen == tLen) {\n                // Replace case: rest of strings must match\n                return s.Substring(i + 1) == t.Substring(i + 1);\n            } else {\n                // Insert/delete case: skip char in t, rest must match\n                return s.Substring(i) == t.Substring(i + 1);\n            }\n        }\n    }\n\n    // No mismatch found; one edit only if t has one extra char at the end\n    return sLen != tLen;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "check_swap": [
        4,
        5
      ],
      "check_length_diff": [
        9,
        10
      ],
      "compare": [
        14,
        15
      ],
      "match": [
        14
      ],
      "mismatch": [
        15
      ],
      "check_replace": [
        16,
        18
      ],
      "check_insert": [
        19,
        21
      ],
      "rest_match": [
        18,
        21
      ],
      "rest_mismatch": [
        18,
        21
      ],
      "no_mismatch": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "length_diff": [
        9
      ],
      "char_equal": [
        15
      ],
      "same_length": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isOneEditDistance(s string, t string) bool {\n    sLen, tLen := len(s), len(t)\n    // Ensure s is the shorter or equal-length string\n    if sLen > tLen {\n        return isOneEditDistance(t, s)\n    }\n\n    // Length difference > 1 means more than one edit needed\n    if tLen - sLen > 1 {\n        return false\n    }\n\n    // Find the first mismatch\n    for i := 0; i < sLen; i++ {\n        if s[i] != t[i] {\n            if sLen == tLen {\n                // Replace case: rest of strings must match\n                return s[i+1:] == t[i+1:]\n            } else {\n                // Insert/delete case: skip char in t, rest must match\n                return s[i:] == t[i+1:]\n            }\n        }\n    }\n\n    // No mismatch found; one edit only if t has one extra char at the end\n    return sLen != tLen\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "check_swap": [
        4,
        5
      ],
      "check_length_diff": [
        9,
        10
      ],
      "compare": [
        14,
        15
      ],
      "match": [
        14
      ],
      "mismatch": [
        15
      ],
      "check_replace": [
        16,
        18
      ],
      "check_insert": [
        19,
        21
      ],
      "rest_match": [
        18,
        21
      ],
      "rest_mismatch": [
        18,
        21
      ],
      "no_mismatch": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "length_diff": [
        9
      ],
      "char_equal": [
        15
      ],
      "same_length": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var isOneEditDistance = function(s, t) {\n    let sLen = s.length, tLen = t.length;\n    // Ensure s is the shorter or equal-length string\n    if (sLen > tLen) {\n        return isOneEditDistance(t, s);\n    }\n\n    // Length difference > 1 means more than one edit needed\n    if (tLen - sLen > 1) {\n        return false;\n    }\n\n    // Find the first mismatch\n    for (let i = 0; i < sLen; i++) {\n        if (s[i] !== t[i]) {\n            if (sLen === tLen) {\n                // Replace case: rest of strings must match\n                return s.slice(i + 1) === t.slice(i + 1);\n            } else {\n                // Insert/delete case: skip char in t, rest must match\n                return s.slice(i) === t.slice(i + 1);\n            }\n        }\n    }\n\n    // No mismatch found; one edit only if t has one extra char at the end\n    return sLen !== tLen;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "check_swap": [
        4,
        5
      ],
      "check_length_diff": [
        9,
        10
      ],
      "compare": [
        14,
        15
      ],
      "match": [
        14
      ],
      "mismatch": [
        15
      ],
      "check_replace": [
        16,
        18
      ],
      "check_insert": [
        19,
        21
      ],
      "rest_match": [
        18,
        21
      ],
      "rest_mismatch": [
        18,
        21
      ],
      "no_mismatch": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "length_diff": [
        9
      ],
      "char_equal": [
        15
      ],
      "same_length": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isOneEditDistance(s: string, t: string): boolean {\n    let sLen = s.length, tLen = t.length;\n    // Ensure s is the shorter or equal-length string\n    if (sLen > tLen) {\n        return isOneEditDistance(t, s);\n    }\n\n    // Length difference > 1 means more than one edit needed\n    if (tLen - sLen > 1) {\n        return false;\n    }\n\n    // Find the first mismatch\n    for (let i = 0; i < sLen; i++) {\n        if (s[i] !== t[i]) {\n            if (sLen === tLen) {\n                // Replace case: rest of strings must match\n                return s.slice(i + 1) === t.slice(i + 1);\n            } else {\n                // Insert/delete case: skip char in t, rest must match\n                return s.slice(i) === t.slice(i + 1);\n            }\n        }\n    }\n\n    // No mismatch found; one edit only if t has one extra char at the end\n    return sLen !== tLen;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "check_swap": [
        4,
        5
      ],
      "check_length_diff": [
        9,
        10
      ],
      "compare": [
        14,
        15
      ],
      "match": [
        14
      ],
      "mismatch": [
        15
      ],
      "check_replace": [
        16,
        18
      ],
      "check_insert": [
        19,
        21
      ],
      "rest_match": [
        18,
        21
      ],
      "rest_mismatch": [
        18,
        21
      ],
      "no_mismatch": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "length_diff": [
        9
      ],
      "char_equal": [
        15
      ],
      "same_length": [
        16
      ]
    }
  }
};

const OneEditDistancePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Insert",
    "value": {
      "s": "ab",
      "t": "acb"
    }
  },
  {
    "id": "ex2",
    "label": "Replace",
    "value": {
      "s": "abc",
      "t": "adc"
    }
  },
  {
    "id": "ex3",
    "label": "Same (false)",
    "value": {
      "s": "abc",
      "t": "abc"
    }
  },
  {
    "id": "ex4",
    "label": "Delete",
    "value": {
      "s": "a",
      "t": ""
    }
  }
];

function generateOneEditDistanceSteps(e: any): any[] {
  let t=e.s,i=e.t,a={};for(let e=0;e<t.length;e++)a[`s_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<i.length;e++)a[`t_${e}`]={type:"arrayElement",value:i[e],position:e};let s=new StepRecorder({s:t,t:i},a),r=(e,n,a)=>{let r="s"===e?t:i;s.update_visual(`${e}_${n}`,{type:"arrayElement",value:r[n],position:n,state:a})};if(s.record("-",`Start: check if "${t}" and "${i}" are exactly one edit apart`),t.length>i.length){let e=t,n=i;t=i,i=e,s.update_variable("s",t),s.update_variable("t",i);let a=(e,t,i)=>{let n=Math.max(t.length,i.length);for(let a=0;a<n;a++)a>=i.length?s.delete_visual(`${e}_${a}`):a>=t.length?s.add_new_visual(`${e}_${a}`,{type:"arrayElement",value:i[a],position:a}):s.update_visual(`${e}_${a}`,{type:"arrayElement",value:i[a],position:a})};a("s",e,t),a("t",n,i),s.record("check_swap",`s is longer than t, swap them so s = "${t}" is the shorter string`)}else s.record("check_swap",`s = "${t}" (length ${t.length}) is not longer than t = "${i}" (length ${i.length}), no swap needed`);let l=i.length-t.length;if(s.add_new_variable("lenDiff",l),s.add_conditional("length_diff",l>1),l>1){for(let e=t.length;e<i.length;e++)r("t",e,"failed");return s.record("check_length_diff",`Length difference is ${l}, more than 1, a single edit cannot fix this`),s.add_new_visual("verdict",{type:"metadata",value:!1}),s.record("complete",`Return false: "${t}" and "${i}" are not one edit apart`),s.getSteps()}s.record("check_length_diff",`Length difference is ${l}, at most 1, compare the characters`),s.add_new_variable("i",0);for(let e=0;e<t.length;e++){s.update_variable("i",e);let n={type:"pointer",position:e,label:"i"},a={type:"range",start:e,end:e,label:"i"};if(0===e?(s.add_new_visual("ptr_i",n),s.add_new_visual("col_band",a)):(s.update_visual("ptr_i",n),s.update_visual("col_band",a)),s.add_conditional("char_equal",t[e]===i[e]),t[e]!==i[e]){let n;if(r("s",e,"edit"),r("t",e,"edit"),s.record("mismatch",`Mismatch at i = ${e}: s[${e}] = '${t[e]}' differs from t[${e}] = '${i[e]}', this must be the one edit`),s.add_conditional("same_length",t.length===i.length),t.length===i.length){n=t.substring(e+1)===i.substring(e+1);for(let i=e+1;i<t.length;i++)r("s",i,"checking"),r("t",i,"checking");s.record("check_replace",`Same length, so replace s[${e}]: the rest must match, compare "${t.substring(e+1)}" with "${i.substring(e+1)}"`);for(let i=e+1;i<t.length;i++)r("s",i,n?"matched":"failed"),r("t",i,n?"matched":"failed")}else{n=t.substring(e)===i.substring(e+1);for(let i=e;i<t.length;i++)r("s",i,"checking"),r("t",i+1,"checking"),s.add_new_visual(`align_${i}`,{type:"range",start:i,end:i+1,label:"align",state:"checking"});s.record("check_insert",`Different lengths, so t[${e}] = '${i[e]}' is the inserted char: compare s[${e}:] = "${t.substring(e)}" with t[${e+1}:] = "${i.substring(e+1)}"`);for(let i=e;i<t.length;i++)r("s",i,n?"matched":"failed"),r("t",i+1,n?"matched":"failed"),s.update_visual(`align_${i}`,{type:"range",start:i,end:i+1,label:"align",state:n?"matched":"failed"})}return n?s.record("rest_match",`The rest matches, exactly one edit turns "${t}" into "${i}"`):s.record("rest_mismatch","The rest does not match, more than one edit is needed"),s.delete_visual("ptr_i"),s.delete_visual("col_band"),s.add_new_visual("verdict",{type:"metadata",value:n}),s.record("complete",`Return ${n}: "${t}" and "${i}" are ${n?"":"not "}one edit apart`),s.getSteps()}r("s",e,"matched"),r("t",e,"matched"),s.record("compare",`s[${e}] = '${t[e]}' equals t[${e}] = '${i[e]}', move to the next index`)}t.length>0&&(s.delete_visual("ptr_i"),s.delete_visual("col_band"));let c=t.length!==i.length;return c&&r("t",i.length-1,"edit"),s.record("no_mismatch",c?`No mismatch, and t has one extra character '${i[i.length-1]}': one insert is enough`:"No mismatch and equal lengths: the strings are identical, zero edits is not one edit"),s.add_new_visual("verdict",{type:"metadata",value:c}),s.record("complete",`Return ${c}: "${t}" and "${i}" are ${c?"":"not "}one edit apart`),s.getSteps()
}

export function OneEditDistanceProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: OneEditDistanceTemplates,
      generateSteps: (e: any) => {
        const recorded = generateOneEditDistanceSteps(e) as any[];
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
      title="One Edit Distance"
      slug="one-edit-distance"
      approaches={approaches}
      presets={OneEditDistancePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Palindrome Pairs (palindrome-pairs)
// ==========================================

const PalindromePairsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def palindromePairs(self, words: list[str]) -> list[list[int]]:\n        trie = [{}, -1, []]\n\n        def is_palindrome_range(s, left, right):\n            while left < right:\n                if s[left] != s[right]:\n                    return False\n                left += 1\n                right -= 1\n            return True\n\n        def insert(word, idx):\n            node = trie\n            for i in range(len(word) - 1, -1, -1):\n                if is_palindrome_range(word, 0, i):\n                    node[2].append(idx)\n                c = word[i]\n                if c not in node[0]:\n                    node[0][c] = [{}, -1, []]\n                node = node[0][c]\n            node[1] = idx\n            node[2].append(idx)\n\n        def search(word, idx):\n            node = trie\n            pairs = []\n            for i in range(len(word)):\n                if node[1] != -1 and node[1] != idx:\n                    if is_palindrome_range(word, i, len(word) - 1):\n                        pairs.append([idx, node[1]])\n                c = word[i]\n                if c not in node[0]:\n                    return pairs\n                node = node[0][c]\n\n            for k in node[2]:\n                if k != idx:\n                    pairs.append([idx, k])\n            return pairs\n\n        for i, word in enumerate(words):\n            insert(word, i)\n\n        result = []\n        for i, word in enumerate(words):\n            result.extend(search(word, i))\n\n        return result",
    "lineMap": {
      "-": [
        3
      ],
      "insert_word_reversed": [
        42,
        43,
        14
      ],
      "check_palindrome_prefix": [
        16,
        17
      ],
      "insert_char": [
        18,
        21
      ],
      "create_node": [
        19,
        20
      ],
      "mark_word_idx": [
        22,
        23
      ],
      "start_search": [
        45,
        46
      ],
      "search_word": [
        26,
        27,
        28
      ],
      "traverse_char": [
        35
      ],
      "check_reversed_word": [
        29,
        30
      ],
      "found_pair": [
        31
      ],
      "no_child": [
        33,
        34
      ],
      "check_palindrome_below": [
        37,
        38
      ],
      "found_palindrome_pair": [
        39
      ],
      "complete": [
        49
      ]
    },
    "conditionalMap": {
      "prefix_palindrome": [
        16
      ],
      "char_missing": [
        19
      ],
      "has_word_idx": [
        29
      ],
      "suffix_palindrome": [
        30
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int[][] children;\n    private int[] wordIdx;\n    private List<Integer>[] palindromeBelow;\n    private int nodeCount;\n\n    public List<List<Integer>> palindromePairs(String[] words) {\n        int totalChars = 0;\n        for (String w : words) totalChars += w.length();\n        int maxNodes = totalChars + 1;\n\n        children = new int[maxNodes][26];\n        wordIdx = new int[maxNodes];\n        palindromeBelow = new List[maxNodes];\n        nodeCount = 0;\n\n        Arrays.fill(wordIdx, -1);\n        for (int i = 0; i < maxNodes; i++) {\n            Arrays.fill(children[i], -1);\n            palindromeBelow[i] = new ArrayList<>();\n        }\n        nodeCount = 1;\n\n        for (int i = 0; i < words.length; i++) {\n            insertReversed(words[i], i);\n        }\n\n        List<List<Integer>> result = new ArrayList<>();\n\n        for (int i = 0; i < words.length; i++) {\n            search(words[i], i, result);\n        }\n\n        return result;\n    }\n\n    private void insertReversed(String word, int idx) {\n        int node = 0;\n        for (int i = word.length() - 1; i >= 0; i--) {\n            if (isPalindromeRange(word, 0, i)) {\n                palindromeBelow[node].add(idx);\n            }\n            int c = word.charAt(i) - 'a';\n            if (children[node][c] == -1) {\n                children[node][c] = nodeCount++;\n            }\n            node = children[node][c];\n        }\n        wordIdx[node] = idx;\n        palindromeBelow[node].add(idx);\n    }\n\n    private void search(String word, int idx, List<List<Integer>> result) {\n        int node = 0;\n        for (int i = 0; i < word.length(); i++) {\n            if (wordIdx[node] != -1 && wordIdx[node] != idx) {\n                if (isPalindromeRange(word, i, word.length() - 1)) {\n                    result.add(Arrays.asList(idx, wordIdx[node]));\n                }\n            }\n            int c = word.charAt(i) - 'a';\n            if (children[node][c] == -1) return;\n            node = children[node][c];\n        }\n\n        for (int k : palindromeBelow[node]) {\n            if (k != idx) {\n                result.add(Arrays.asList(idx, k));\n            }\n        }\n    }\n\n    private boolean isPalindromeRange(String s, int left, int right) {\n        while (left < right) {\n            if (s.charAt(left) != s.charAt(right)) return false;\n            left++;\n            right--;\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        12,
        13,
        14
      ],
      "insert_word_reversed": [
        24,
        25,
        38
      ],
      "check_palindrome_prefix": [
        40,
        41
      ],
      "insert_char": [
        43,
        47
      ],
      "create_node": [
        44,
        45
      ],
      "mark_word_idx": [
        49,
        50
      ],
      "start_search": [
        28,
        30
      ],
      "search_word": [
        31,
        54,
        55
      ],
      "traverse_char": [
        63
      ],
      "check_reversed_word": [
        56,
        57
      ],
      "found_pair": [
        58
      ],
      "no_child": [
        62
      ],
      "check_palindrome_below": [
        66,
        67
      ],
      "found_palindrome_pair": [
        68
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "prefix_palindrome": [
        40
      ],
      "char_missing": [
        44
      ],
      "has_word_idx": [
        56
      ],
      "suffix_palindrome": [
        57
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\n    struct TrieNode {\n        int children[26];\n        int wordIdx;\n        vector<int> palindromeBelow;\n        TrieNode() : wordIdx(-1) {\n            fill(children, children + 26, -1);\n        }\n    };\n\n    vector<TrieNode> nodes;\n\n    bool isPalindromeRange(const string& s, int left, int right) {\n        while (left < right) {\n            if (s[left] != s[right]) return false;\n            left++;\n            right--;\n        }\n        return true;\n    }\n\npublic:\n    vector<vector<int>> palindromePairs(vector<string>& words) {\n        int totalChars = 0;\n        for (const string& w : words) totalChars += (int)w.size();\n        nodes.reserve(totalChars + 1);\n        nodes.emplace_back();\n\n        for (int i = 0; i < (int)words.size(); i++) {\n            int node = 0;\n            const string& word = words[i];\n            for (int j = word.size() - 1; j >= 0; j--) {\n                if (isPalindromeRange(word, 0, j)) {\n                    nodes[node].palindromeBelow.push_back(i);\n                }\n                int c = word[j] - 'a';\n                if (nodes[node].children[c] == -1) {\n                    nodes[node].children[c] = nodes.size();\n                    nodes.emplace_back();\n                }\n                node = nodes[node].children[c];\n            }\n            nodes[node].wordIdx = i;\n            nodes[node].palindromeBelow.push_back(i);\n        }\n\n        vector<vector<int>> result;\n\n        for (int i = 0; i < (int)words.size(); i++) {\n            const string& word = words[i];\n            int node = 0;\n            for (int j = 0; j < (int)word.size(); j++) {\n                if (nodes[node].wordIdx != -1 && nodes[node].wordIdx != i) {\n                    if (isPalindromeRange(word, j, word.size() - 1)) {\n                        result.push_back({i, nodes[node].wordIdx});\n                    }\n                }\n                int c = word[j] - 'a';\n                if (nodes[node].children[c] == -1) goto next_word;\n                node = nodes[node].children[c];\n            }\n\n            for (int k : nodes[node].palindromeBelow) {\n                if (k != i) {\n                    result.push_back({i, k});\n                }\n            }\n            next_word:;\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        26,
        27
      ],
      "insert_word_reversed": [
        29,
        30,
        31
      ],
      "check_palindrome_prefix": [
        33,
        34
      ],
      "insert_char": [
        36,
        41
      ],
      "create_node": [
        37,
        38,
        39
      ],
      "mark_word_idx": [
        43,
        44
      ],
      "start_search": [
        47,
        49
      ],
      "search_word": [
        50,
        51,
        52
      ],
      "traverse_char": [
        60
      ],
      "check_reversed_word": [
        53,
        54
      ],
      "found_pair": [
        55
      ],
      "no_child": [
        59
      ],
      "check_palindrome_below": [
        63,
        64
      ],
      "found_palindrome_pair": [
        65
      ],
      "complete": [
        71
      ]
    },
    "conditionalMap": {
      "prefix_palindrome": [
        33
      ],
      "char_missing": [
        37
      ],
      "has_word_idx": [
        53
      ],
      "suffix_palindrome": [
        54
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int[][] children;\n    private int[] wordIdx;\n    private List<int>[] palindromeBelow;\n    private int nodeCount;\n\n    public IList<IList<int>> PalindromePairs(string[] words) {\n        int totalChars = 0;\n        foreach (var w in words) totalChars += w.Length;\n        int maxNodes = totalChars + 1;\n\n        children = new int[maxNodes][];\n        wordIdx = new int[maxNodes];\n        palindromeBelow = new List<int>[maxNodes];\n        nodeCount = 1;\n\n        for (int i = 0; i < maxNodes; i++) {\n            children[i] = new int[26];\n            Array.Fill(children[i], -1);\n            wordIdx[i] = -1;\n            palindromeBelow[i] = new List<int>();\n        }\n\n        for (int i = 0; i < words.Length; i++) {\n            InsertReversed(words[i], i);\n        }\n\n        IList<IList<int>> result = new List<IList<int>>();\n\n        for (int i = 0; i < words.Length; i++) {\n            Search(words[i], i, result);\n        }\n\n        return result;\n    }\n\n    private void InsertReversed(string word, int idx) {\n        int node = 0;\n        for (int i = word.Length - 1; i >= 0; i--) {\n            if (IsPalindromeRange(word, 0, i)) {\n                palindromeBelow[node].Add(idx);\n            }\n            int c = word[i] - 'a';\n            if (children[node][c] == -1) {\n                children[node][c] = nodeCount++;\n            }\n            node = children[node][c];\n        }\n        wordIdx[node] = idx;\n        palindromeBelow[node].Add(idx);\n    }\n\n    private void Search(string word, int idx, IList<IList<int>> result) {\n        int node = 0;\n        for (int i = 0; i < word.Length; i++) {\n            if (wordIdx[node] != -1 && wordIdx[node] != idx) {\n                if (IsPalindromeRange(word, i, word.Length - 1)) {\n                    result.Add(new List<int> { idx, wordIdx[node] });\n                }\n            }\n            int c = word[i] - 'a';\n            if (children[node][c] == -1) return;\n            node = children[node][c];\n        }\n\n        foreach (int k in palindromeBelow[node]) {\n            if (k != idx) {\n                result.Add(new List<int> { idx, k });\n            }\n        }\n    }\n\n    private bool IsPalindromeRange(string s, int left, int right) {\n        while (left < right) {\n            if (s[left] != s[right]) return false;\n            left++;\n            right--;\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        12,
        13,
        14
      ],
      "insert_word_reversed": [
        24,
        25,
        38
      ],
      "check_palindrome_prefix": [
        40,
        41
      ],
      "insert_char": [
        43,
        47
      ],
      "create_node": [
        44,
        45
      ],
      "mark_word_idx": [
        49,
        50
      ],
      "start_search": [
        28,
        30
      ],
      "search_word": [
        31,
        54,
        55
      ],
      "traverse_char": [
        63
      ],
      "check_reversed_word": [
        56,
        57
      ],
      "found_pair": [
        58
      ],
      "no_child": [
        62
      ],
      "check_palindrome_below": [
        66,
        67
      ],
      "found_palindrome_pair": [
        68
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "prefix_palindrome": [
        40
      ],
      "char_missing": [
        44
      ],
      "has_word_idx": [
        56
      ],
      "suffix_palindrome": [
        57
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type trieNode struct {\n    children        [26]int\n    wordIdx         int\n    palindromeBelow []int\n}\n\nvar nodes []trieNode\n\nfunc palindromePairs(words []string) [][]int {\n    totalChars := 0\n    for _, w := range words {\n        totalChars += len(w)\n    }\n\n    nodes = make([]trieNode, 1, totalChars+1)\n    nodes[0] = trieNode{wordIdx: -1}\n    for i := range nodes[0].children {\n        nodes[0].children[i] = -1\n    }\n\n    for i, word := range words {\n        insertReversed(word, i)\n    }\n\n    result := [][]int{}\n    for i, word := range words {\n        result = searchTrie(word, i, result)\n    }\n    return result\n}\n\nfunc insertReversed(word string, idx int) {\n    node := 0\n    for i := len(word) - 1; i >= 0; i-- {\n        if isPalindromeRange(word, 0, i) {\n            nodes[node].palindromeBelow = append(nodes[node].palindromeBelow, idx)\n        }\n        c := word[i] - 'a'\n        if nodes[node].children[c] == -1 {\n            newNode := trieNode{wordIdx: -1}\n            for j := range newNode.children {\n                newNode.children[j] = -1\n            }\n            nodes[node].children[c] = len(nodes)\n            nodes = append(nodes, newNode)\n        }\n        node = nodes[node].children[c]\n    }\n    nodes[node].wordIdx = idx\n    nodes[node].palindromeBelow = append(nodes[node].palindromeBelow, idx)\n}\n\nfunc searchTrie(word string, idx int, result [][]int) [][]int {\n    node := 0\n    for i := 0; i < len(word); i++ {\n        if nodes[node].wordIdx != -1 && nodes[node].wordIdx != idx {\n            if isPalindromeRange(word, i, len(word)-1) {\n                result = append(result, []int{idx, nodes[node].wordIdx})\n            }\n        }\n        c := word[i] - 'a'\n        if nodes[node].children[c] == -1 {\n            return result\n        }\n        node = nodes[node].children[c]\n    }\n\n    for _, k := range nodes[node].palindromeBelow {\n        if k != idx {\n            result = append(result, []int{idx, k})\n        }\n    }\n    return result\n}\n\nfunc isPalindromeRange(s string, left, right int) bool {\n    for left < right {\n        if s[left] != s[right] {\n            return false\n        }\n        left++\n        right--\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        15,
        16
      ],
      "insert_word_reversed": [
        21,
        22,
        33
      ],
      "check_palindrome_prefix": [
        35,
        36
      ],
      "insert_char": [
        38,
        47
      ],
      "create_node": [
        39,
        44,
        45
      ],
      "mark_word_idx": [
        49,
        50
      ],
      "start_search": [
        25,
        26
      ],
      "search_word": [
        27,
        54,
        55
      ],
      "traverse_char": [
        65
      ],
      "check_reversed_word": [
        56,
        57
      ],
      "found_pair": [
        58
      ],
      "no_child": [
        62,
        63
      ],
      "check_palindrome_below": [
        68,
        69
      ],
      "found_palindrome_pair": [
        70
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "prefix_palindrome": [
        35
      ],
      "char_missing": [
        39
      ],
      "has_word_idx": [
        56
      ],
      "suffix_palindrome": [
        57
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var palindromePairs = function(words) {\n    var nodes = [{ children: new Array(26).fill(-1), wordIdx: -1, palindromeBelow: [] }];\n    var nodeCount = 1;\n\n    var isPalindromeRange = function(s, left, right) {\n        while (left < right) {\n            if (s[left] !== s[right]) return false;\n            left++;\n            right--;\n        }\n        return true;\n    };\n\n    var insertReversed = function(word, idx) {\n        var node = 0;\n        for (var i = word.length - 1; i >= 0; i--) {\n            if (isPalindromeRange(word, 0, i)) {\n                nodes[node].palindromeBelow.push(idx);\n            }\n            var c = word.charCodeAt(i) - 97;\n            if (nodes[node].children[c] === -1) {\n                nodes[node].children[c] = nodeCount++;\n                nodes.push({ children: new Array(26).fill(-1), wordIdx: -1, palindromeBelow: [] });\n            }\n            node = nodes[node].children[c];\n        }\n        nodes[node].wordIdx = idx;\n        nodes[node].palindromeBelow.push(idx);\n    };\n\n    for (var i = 0; i < words.length; i++) {\n        insertReversed(words[i], i);\n    }\n\n    var result = [];\n\n    for (var i = 0; i < words.length; i++) {\n        var word = words[i];\n        var node = 0;\n        var found = false;\n        for (var j = 0; j < word.length; j++) {\n            if (nodes[node].wordIdx !== -1 && nodes[node].wordIdx !== i) {\n                if (isPalindromeRange(word, j, word.length - 1)) {\n                    result.push([i, nodes[node].wordIdx]);\n                }\n            }\n            var c = word.charCodeAt(j) - 97;\n            if (nodes[node].children[c] === -1) {\n                found = true;\n                break;\n            }\n            node = nodes[node].children[c];\n        }\n\n        if (!found) {\n            var belowList = nodes[node].palindromeBelow;\n            for (var k = 0; k < belowList.length; k++) {\n                if (belowList[k] !== i) {\n                    result.push([i, belowList[k]]);\n                }\n            }\n        }\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "insert_word_reversed": [
        31,
        32,
        15
      ],
      "check_palindrome_prefix": [
        17,
        18
      ],
      "insert_char": [
        20,
        25
      ],
      "create_node": [
        21,
        22,
        23
      ],
      "mark_word_idx": [
        27,
        28
      ],
      "start_search": [
        35,
        37
      ],
      "search_word": [
        38,
        39,
        41
      ],
      "traverse_char": [
        52
      ],
      "check_reversed_word": [
        42,
        43
      ],
      "found_pair": [
        44
      ],
      "no_child": [
        48,
        49,
        50
      ],
      "check_palindrome_below": [
        56,
        57,
        58
      ],
      "found_palindrome_pair": [
        59
      ],
      "complete": [
        65
      ]
    },
    "conditionalMap": {
      "prefix_palindrome": [
        17
      ],
      "char_missing": [
        21
      ],
      "has_word_idx": [
        42
      ],
      "suffix_palindrome": [
        43
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function palindromePairs(words: string[]): number[][] {\n    interface TrieNode {\n        children: number[];\n        wordIdx: number;\n        palindromeBelow: number[];\n    }\n\n    const nodes: TrieNode[] = [{ children: new Array(26).fill(-1), wordIdx: -1, palindromeBelow: [] }];\n    let nodeCount = 1;\n\n    const isPalindromeRange = (s: string, left: number, right: number): boolean => {\n        while (left < right) {\n            if (s[left] !== s[right]) return false;\n            left++;\n            right--;\n        }\n        return true;\n    };\n\n    const insertReversed = (word: string, idx: number): void => {\n        let node = 0;\n        for (let i = word.length - 1; i >= 0; i--) {\n            if (isPalindromeRange(word, 0, i)) {\n                nodes[node].palindromeBelow.push(idx);\n            }\n            const c = word.charCodeAt(i) - 97;\n            if (nodes[node].children[c] === -1) {\n                nodes[node].children[c] = nodeCount++;\n                nodes.push({ children: new Array(26).fill(-1), wordIdx: -1, palindromeBelow: [] });\n            }\n            node = nodes[node].children[c];\n        }\n        nodes[node].wordIdx = idx;\n        nodes[node].palindromeBelow.push(idx);\n    };\n\n    for (let i = 0; i < words.length; i++) {\n        insertReversed(words[i], i);\n    }\n\n    const result: number[][] = [];\n\n    for (let i = 0; i < words.length; i++) {\n        const word = words[i];\n        let node = 0;\n        let earlyExit = false;\n\n        for (let j = 0; j < word.length; j++) {\n            if (nodes[node].wordIdx !== -1 && nodes[node].wordIdx !== i) {\n                if (isPalindromeRange(word, j, word.length - 1)) {\n                    result.push([i, nodes[node].wordIdx]);\n                }\n            }\n            const c = word.charCodeAt(j) - 97;\n            if (nodes[node].children[c] === -1) {\n                earlyExit = true;\n                break;\n            }\n            node = nodes[node].children[c];\n        }\n\n        if (!earlyExit) {\n            for (const k of nodes[node].palindromeBelow) {\n                if (k !== i) {\n                    result.push([i, k]);\n                }\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        8,
        9
      ],
      "insert_word_reversed": [
        37,
        38,
        21
      ],
      "check_palindrome_prefix": [
        23,
        24
      ],
      "insert_char": [
        26,
        31
      ],
      "create_node": [
        27,
        28,
        29
      ],
      "mark_word_idx": [
        33,
        34
      ],
      "start_search": [
        41,
        43
      ],
      "search_word": [
        44,
        45,
        48
      ],
      "traverse_char": [
        59
      ],
      "check_reversed_word": [
        49,
        50
      ],
      "found_pair": [
        51
      ],
      "no_child": [
        55,
        56,
        57
      ],
      "check_palindrome_below": [
        63,
        64
      ],
      "found_palindrome_pair": [
        65
      ],
      "complete": [
        71
      ]
    },
    "conditionalMap": {
      "prefix_palindrome": [
        23
      ],
      "char_missing": [
        27
      ],
      "has_word_idx": [
        49
      ],
      "suffix_palindrome": [
        50
      ]
    }
  }
};

const PalindromePairsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "words": [
        "abcd",
        "dcba",
        "lls",
        "s",
        "sssll"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "words": [
        "bat",
        "tab",
        "cat"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "words": [
        "a",
        ""
      ]
    }
  }
];

function generatePalindromePairsSteps(e: any): any[] {
  let r=e.words||[],i=new StepRecorder({},{}),n=r.map(()=>"pending"),a=[],s=new Map;r.forEach((e,r)=>s.set(e,r));let o=e=>{for(let r=0,i=e.length-1;r<i;r++,i--)if(e[r]!==e[i])return!1;return!0},d=e=>e.split("").reverse().join(""),l=e=>""===e?'""':e;i.update_variable("phase","Split every word"),i.update_variable("words",r),i.update_variable("wordStates",n),i.update_variable("currentWord",""),i.update_variable("splitAt",-1),i.update_variable("prefix",""),i.update_variable("suffix",""),i.update_variable("prefixState",""),i.update_variable("suffixState",""),i.update_variable("probe",""),i.update_variable("probeState",""),i.update_variable("pairs",[]),i.record("start",`Map each of the ${r.length} words to its index`);for(let e=0;e<r.length;e++){let t=r[e];e>0&&(n[e-1]="visited"),n[e]="active",i.update_variable("wordStates",n),i.update_variable("currentWord",t),i.update_variable("splitAt",-1),i.update_variable("prefix",""),i.update_variable("suffix",""),i.update_variable("probe",""),i.update_variable("probeState",""),i.record("pick_word",`Decompose "${t}" (index ${e})`);for(let r=0;r<=t.length;r++){let n=t.slice(0,r),c=t.slice(r);i.update_variable("splitAt",r),i.update_variable("prefix",l(n)),i.update_variable("suffix",l(c)),i.update_variable("prefixState",""),i.update_variable("suffixState",""),i.update_variable("probe",""),i.update_variable("probeState",""),i.record("split",`Split into ${l(n)} + ${l(c)}`);let p=o(n);if(i.add_conditional("prefix_palindrome",p),i.update_variable("prefixState",p?"match":"miss"),i.record("case1_check",`${l(n)} is ${p?"":"not "}a palindrome`),p){let r=d(c),t=s.get(r),n=void 0!==t&&t!==e;i.add_conditional("rev_suffix_in_map",n),i.update_variable("probe",l(r)),i.update_variable("probeState",n?"match":"miss"),n&&(a.push([t,e]),i.update_variable("pairs",a)),i.record("case1_found",n?`${l(r)} is words[${t}], record [${t}, ${e}]`:`${l(r)} is not another word`)}let u=c.length>0&&o(c);if(i.add_conditional("suffix_palindrome",u),i.update_variable("suffixState",u?"match":"miss"),i.record("case2_check",0===c.length?"Suffix is empty, skip this case":`${l(c)} is ${u?"":"not "}a palindrome`),u){let r=d(n),t=s.get(r),o=void 0!==t&&t!==e;i.add_conditional("rev_prefix_in_map",o),i.update_variable("probe",l(r)),i.update_variable("probeState",o?"match":"miss"),o&&(a.push([e,t]),i.update_variable("pairs",a)),i.record("case2_found",o?`${l(r)} is words[${t}], record [${e}, ${t}]`:`${l(r)} is not another word`)}}}return i.update_variable("phase","Complete"),n.fill("visited"),i.update_variable("wordStates",n),i.update_variable("currentWord",""),i.update_variable("splitAt",-1),i.update_variable("prefix",""),i.update_variable("suffix",""),i.update_variable("probe",""),i.update_variable("probeState",""),i.record("complete",`Done! Found ${a.length} palindrome pairs: [${a.map(e=>`[${e.join(",")}]`).join(", ")}]`),i.getSteps()
}

export function PalindromePairsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PalindromePairsTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePalindromePairsSteps(e) as any[];
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
      title="Palindrome Pairs"
      slug="palindrome-pairs"
      approaches={approaches}
      presets={PalindromePairsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Rabin-Karp String Search (rabin-karp)
// ==========================================

const RabinKarpTemplates = {
  "python": {
    "language": "python",
    "code": "def rabin_karp(text: str, pattern: str) -> list[int]:\n    n, m = len(text), len(pattern)\n    if m > n:\n        return []\n\n    BASE, MOD = 31, 10**9 + 7\n    matches = []\n\n    # Compute pattern hash and initial window hash\n    pat_hash = win_hash = 0\n    power = 1\n    for i in range(m):\n        pat_hash = (pat_hash * BASE + ord(pattern[i]) - ord('a') + 1) % MOD\n        win_hash = (win_hash * BASE + ord(text[i]) - ord('a') + 1) % MOD\n        if i < m - 1:\n            power = power * BASE % MOD\n\n    # Slide window\n    for start in range(n - m + 1):\n        if win_hash == pat_hash:\n            if text[start:start + m] == pattern:\n                matches.append(start)\n\n        if start < n - m:\n            win_hash = (win_hash - (ord(text[start]) - ord('a') + 1) * power) % MOD\n            win_hash = (win_hash * BASE + ord(text[start + m]) - ord('a') + 1) % MOD\n            win_hash = (win_hash + MOD) % MOD\n\n    return matches",
    "lineMap": {
      "-": [
        1
      ],
      "compute_hash": [
        10,
        11,
        12,
        13,
        14,
        15,
        16
      ],
      "slide_window": [
        19
      ],
      "hash_match": [
        20
      ],
      "verify": [
        21
      ],
      "match_found": [
        22
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "hash_match": [
        20
      ],
      "verify": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> rabinKarp(String text, String pattern) {\n    int n = text.length(), m = pattern.length();\n    List<Integer> matches = new ArrayList<>();\n    if (m > n) return matches;\n\n    final long BASE = 31, MOD = 1_000_000_007L;\n    long patHash = 0, winHash = 0, power = 1;\n\n    // Compute pattern hash and initial window hash\n    for (int i = 0; i < m; i++) {\n        patHash = (patHash * BASE + (pattern.charAt(i) - 'a' + 1)) % MOD;\n        winHash = (winHash * BASE + (text.charAt(i) - 'a' + 1)) % MOD;\n        if (i < m - 1) power = power * BASE % MOD;\n    }\n\n    // Slide window\n    for (int start = 0; start <= n - m; start++) {\n        if (winHash == patHash && text.substring(start, start + m).equals(pattern)) {\n            matches.add(start);\n        }\n        if (start < n - m) {\n            winHash = (winHash - (text.charAt(start) - 'a' + 1) * power % MOD + MOD) % MOD;\n            winHash = (winHash * BASE + (text.charAt(start + m) - 'a' + 1)) % MOD;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_hash": [
        10,
        11,
        12,
        13
      ],
      "slide_window": [
        17
      ],
      "hash_match": [
        18
      ],
      "match_found": [
        19
      ],
      "verify": [
        18
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "hash_match": [
        18
      ],
      "verify": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> rabinKarp(string text, string pattern) {\n    int n = text.size(), m = pattern.size();\n    vector<int> matches;\n    if (m > n) return matches;\n\n    const long long BASE = 31, MOD = 1e9 + 7;\n    long long patHash = 0, winHash = 0, power = 1;\n\n    // Compute pattern hash and initial window hash\n    for (int i = 0; i < m; i++) {\n        patHash = (patHash * BASE + (pattern[i] - 'a' + 1)) % MOD;\n        winHash = (winHash * BASE + (text[i] - 'a' + 1)) % MOD;\n        if (i < m - 1) power = power * BASE % MOD;\n    }\n\n    // Slide window\n    for (int start = 0; start <= n - m; start++) {\n        if (winHash == patHash && text.substr(start, m) == pattern) {\n            matches.push_back(start);\n        }\n        if (start < n - m) {\n            winHash = (winHash - (text[start] - 'a' + 1) * power % MOD + MOD) % MOD;\n            winHash = (winHash * BASE + (text[start + m] - 'a' + 1)) % MOD;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_hash": [
        10,
        11,
        12,
        13
      ],
      "slide_window": [
        17
      ],
      "hash_match": [
        18
      ],
      "match_found": [
        19
      ],
      "verify": [
        18
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "hash_match": [
        18
      ],
      "verify": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public List<int> RabinKarp(string text, string pattern) {\n    int n = text.Length, m = pattern.Length;\n    var matches = new List<int>();\n    if (m > n) return matches;\n\n    const long BASE = 31, MOD = 1_000_000_007L;\n    long patHash = 0, winHash = 0, power = 1;\n\n    // Compute pattern hash and initial window hash\n    for (int i = 0; i < m; i++) {\n        patHash = (patHash * BASE + (pattern[i] - 'a' + 1)) % MOD;\n        winHash = (winHash * BASE + (text[i] - 'a' + 1)) % MOD;\n        if (i < m - 1) power = power * BASE % MOD;\n    }\n\n    // Slide window\n    for (int start = 0; start <= n - m; start++) {\n        if (winHash == patHash && text.Substring(start, m) == pattern) {\n            matches.Add(start);\n        }\n        if (start < n - m) {\n            winHash = (winHash - (text[start] - 'a' + 1) * power % MOD + MOD) % MOD;\n            winHash = (winHash * BASE + (text[start + m] - 'a' + 1)) % MOD;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_hash": [
        10,
        11,
        12,
        13
      ],
      "slide_window": [
        17
      ],
      "hash_match": [
        18
      ],
      "match_found": [
        19
      ],
      "verify": [
        18
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "hash_match": [
        18
      ],
      "verify": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rabinKarp(text, pattern string) []int {\n    n, m := len(text), len(pattern)\n    matches := []int{}\n    if m > n {\n        return matches\n    }\n\n    const base, mod = 31, 1_000_000_007\n    patHash, winHash, power := 0, 0, 1\n\n    // Compute pattern hash and initial window hash\n    for i := 0; i < m; i++ {\n        patHash = (patHash*base + int(pattern[i]-'a') + 1) % mod\n        winHash = (winHash*base + int(text[i]-'a') + 1) % mod\n        if i < m-1 {\n            power = power * base % mod\n        }\n    }\n\n    // Slide window\n    for start := 0; start <= n-m; start++ {\n        if winHash == patHash && text[start:start+m] == pattern {\n            matches = append(matches, start)\n        }\n        if start < n-m {\n            winHash = (winHash - (int(text[start]-'a')+1)*power%mod + mod) % mod\n            winHash = (winHash*base + int(text[start+m]-'a') + 1) % mod\n        }\n    }\n    return matches\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_hash": [
        12,
        13,
        14,
        15,
        16
      ],
      "slide_window": [
        21
      ],
      "hash_match": [
        22
      ],
      "match_found": [
        23
      ],
      "verify": [
        22
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "hash_match": [
        22
      ],
      "verify": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function rabinKarp(text, pattern) {\n    const n = text.length, m = pattern.length;\n    const matches = [];\n    if (m > n) return matches;\n\n    const BASE = 31, MOD = 1_000_000_007;\n    let patHash = 0, winHash = 0, power = 1;\n\n    // Compute pattern hash and initial window hash\n    for (let i = 0; i < m; i++) {\n        patHash = (patHash * BASE + (pattern.charCodeAt(i) - 96)) % MOD;\n        winHash = (winHash * BASE + (text.charCodeAt(i) - 96)) % MOD;\n        if (i < m - 1) power = power * BASE % MOD;\n    }\n\n    // Slide window\n    for (let start = 0; start <= n - m; start++) {\n        if (winHash === patHash && text.slice(start, start + m) === pattern) {\n            matches.push(start);\n        }\n        if (start < n - m) {\n            winHash = (winHash - (text.charCodeAt(start) - 96) * power % MOD + MOD) % MOD;\n            winHash = (winHash * BASE + (text.charCodeAt(start + m) - 96)) % MOD;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_hash": [
        10,
        11,
        12,
        13
      ],
      "slide_window": [
        17
      ],
      "hash_match": [
        18
      ],
      "match_found": [
        19
      ],
      "verify": [
        18
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "hash_match": [
        18
      ],
      "verify": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rabinKarp(text: string, pattern: string): number[] {\n    const n = text.length, m = pattern.length;\n    const matches: number[] = [];\n    if (m > n) return matches;\n\n    const BASE = 31, MOD = 1_000_000_007;\n    let patHash = 0, winHash = 0, power = 1;\n\n    // Compute pattern hash and initial window hash\n    for (let i = 0; i < m; i++) {\n        patHash = (patHash * BASE + (pattern.charCodeAt(i) - 96)) % MOD;\n        winHash = (winHash * BASE + (text.charCodeAt(i) - 96)) % MOD;\n        if (i < m - 1) power = power * BASE % MOD;\n    }\n\n    // Slide window\n    for (let start = 0; start <= n - m; start++) {\n        if (winHash === patHash && text.slice(start, start + m) === pattern) {\n            matches.push(start);\n        }\n        if (start < n - m) {\n            winHash = (winHash - (text.charCodeAt(start) - 96) * power % MOD + MOD) % MOD;\n            winHash = (winHash * BASE + (text.charCodeAt(start + m) - 96)) % MOD;\n        }\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_hash": [
        10,
        11,
        12,
        13
      ],
      "slide_window": [
        17
      ],
      "hash_match": [
        18
      ],
      "match_found": [
        19
      ],
      "verify": [
        18
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "hash_match": [
        18
      ],
      "verify": [
        18
      ]
    }
  }
};

const RabinKarpPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Two Matches",
    "value": {
      "text": "abcabc",
      "pattern": "abc"
    }
  },
  {
    "id": "ex2",
    "label": "Overlap",
    "value": {
      "text": "aabcaab",
      "pattern": "aab"
    }
  },
  {
    "id": "ex3",
    "label": "Middle Match",
    "value": {
      "text": "abcdefg",
      "pattern": "cde"
    }
  },
  {
    "id": "ex4",
    "label": "Hash Collision",
    "value": {
      "text": "aaaaaaa",
      "pattern": "aaa"
    }
  }
];

function generateRabinKarpSteps(t: any): any[] {
  function n(t){return t.charCodeAt(0)-97+1}
let e=t.text,a=t.pattern,i=e.length,s=a.length,o=(t={})=>{let a={};for(let r=0;r<i;r++)a[`text_${r}`]={type:"arrayElement",value:e[r],position:r,row:0,state:t[r]??void 0};return a},l=(t={})=>{let e={};for(let r=0;r<s;r++)e[`pattern_${r}`]={type:"arrayElement",value:a[r],position:r,row:1,state:t[r]??void 0};return e},c=new StepRecorder({text:e,pattern:a,n:i,m:s},{...o(),...l(),meta_patHash:{type:"metadata",value:"?"},meta_textHash:{type:"metadata",value:"?"}});if(c.record("-","Rabin-Karp: Use rolling hash to find all pattern occurrences in text."),s>i)return c.record("complete","Pattern longer than text, no match possible."),c.getSteps();let h=1;for(let t=0;t<s-1;t++)h=31*h%0x3b9aca07;let d=0;for(let t=0;t<s;t++){d=(31*d+n(a[t]))%0x3b9aca07;let e={};for(let a=0;a<=t;a++)e[a]="active";Object.entries(l(e)).forEach(([t,e])=>c.update_visual(t,e)),c.update_visual("meta_patHash",{type:"metadata",value:"hashing..."}),c.record("compute_hash",`Computing pattern hash: processing pattern[${t}]='${a[t]}'. Running hash = ${d}`)}c.update_visual("meta_patHash",{type:"metadata",value:d});let u={};for(let t=0;t<s;t++)u[t]="placed";Object.entries(l(u)).forEach(([t,e])=>c.update_visual(t,e)),c.record("compute_hash",`Pattern hash = ${d}. Now compute hash for first window text[0..${s-1}].`);let p=0;for(let t=0;t<s;t++){p=(31*p+n(e[t]))%0x3b9aca07;let a={};for(let e=0;e<=t;e++)a[e]="active";Object.entries(o(a)).forEach(([t,e])=>c.update_visual(t,e)),c.update_visual("meta_textHash",{type:"metadata",value:"hashing..."}),c.record("compute_hash",`Computing initial window hash: processing text[${t}]='${e[t]}'. Running hash = ${p}`)}c.update_visual("meta_textHash",{type:"metadata",value:p}),c.update_variable("windowStart",0),c.record("compute_hash",`Initial window hash = ${p}. Pattern hash = ${d}.`);let m=[];for(let t=0;t<=i-s;t++){c.update_variable("windowStart",t);let r={};for(let t of m)for(let e=t;e<t+s;e++)r[e]="placed";for(let e=t;e<t+s;e++)r[e]||(r[e]="checking");if(Object.entries(o(r)).forEach(([t,e])=>c.update_visual(t,e)),c.update_visual("meta_textHash",{type:"metadata",value:p}),c.update_visual("ptr_window_start",{type:"pointer",position:t,label:"start"}),c.update_visual("ptr_window_end",{type:"pointer",position:t+s-1,label:"end"}),c.add_conditional("hash_match",p===d),c.record("slide_window",`Window [${t}, ${t+s-1}]: text='${e.slice(t,t+s)}', hash=${p}, patHash=${d}`),p===d){let r=!0;for(let n=0;n<s;n++)if(e[t+n]!==a[n]){r=!1;break}if(c.add_conditional("verify",r),r){m.push(t),c.update_variable("matches",[...m]);let e={};for(let t of m)for(let a=t;a<t+s;a++)e[a]="placed";Object.entries(o(e)).forEach(([t,e])=>c.update_visual(t,e)),c.record("match_found",`Hash match + verified! Pattern found at index ${t}.`)}else{let e={};for(let t of m)for(let a=t;a<t+s;a++)e[a]="placed";for(let a=t;a<t+s;a++)e[a]||(e[a]="mismatch");Object.entries(o(e)).forEach(([t,e])=>c.update_visual(t,e)),c.record("verify","Hash collision! Hashes match but strings differ. Skip window.")}}else c.record("slide_window",`Hash mismatch (${p} ≠ ${d}). Slide window.`);t<i-s&&(p=(31*(p=(p-n(e[t])*h%0x3b9aca07+0x3b9aca07)%0x3b9aca07)+n(e[t+s]))%0x3b9aca07)}return c.delete_visual("ptr_window_start"),c.delete_visual("ptr_window_end"),c.update_variable("matches",m),m.length>0?c.record("complete",`Done! Pattern found at ${m.length} position(s): [${m.join(", ")}]`):c.record("complete","Done! Pattern not found in text."),c.getSteps()
}

export function RabinKarpProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RabinKarpTemplates,
      generateSteps: (t: any) => {
        const recorded = generateRabinKarpSteps(t) as any[];
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
      title="Rabin-Karp String Search"
      slug="rabin-karp"
      approaches={approaches}
      presets={RabinKarpPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Rotate String (rotate-string)
// ==========================================

const RotateStringTemplates = {
  "python": {
    "language": "python",
    "code": "def rotateString(s: str, goal: str) -> bool:\n    if len(s) != len(goal):\n        return False\n    # Try every possible rotation\n    for k in range(len(s)):\n        # Build the k-th rotation: s[k..n-1] + s[0..k-1]\n        if s[k:] + s[:k] == goal:\n            return True\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "rotate": [
        5
      ],
      "compare": [
        7
      ],
      "found": [
        8
      ],
      "not_found": [
        9
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "compare": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean rotateString(String s, String goal) {\n    if (s.length() != goal.length()) {\n        return false;\n    }\n    // Try every possible rotation\n    for (int k = 0; k < s.length(); k++) {\n        // Build the k-th rotation: s[k..n-1] + s[0..k-1]\n        String rotated = s.substring(k) + s.substring(0, k);\n        if (rotated.equals(goal)) {\n            return true;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "rotate": [
        8
      ],
      "compare": [
        9
      ],
      "found": [
        10
      ],
      "not_found": [
        13
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "compare": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool rotateString(string s, string goal) {\n    if (s.size() != goal.size()) {\n        return false;\n    }\n    // Try every possible rotation\n    for (int k = 0; k < s.size(); k++) {\n        // Build the k-th rotation: s[k..n-1] + s[0..k-1]\n        string rotated = s.substr(k) + s.substr(0, k);\n        if (rotated == goal) {\n            return true;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "rotate": [
        8
      ],
      "compare": [
        9
      ],
      "found": [
        10
      ],
      "not_found": [
        13
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "compare": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool RotateString(string s, string goal) {\n    if (s.Length != goal.Length) {\n        return false;\n    }\n    // Try every possible rotation\n    for (int k = 0; k < s.Length; k++) {\n        // Build the k-th rotation: s[k..n-1] + s[0..k-1]\n        string rotated = s.Substring(k) + s.Substring(0, k);\n        if (rotated == goal) {\n            return true;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "rotate": [
        8
      ],
      "compare": [
        9
      ],
      "found": [
        10
      ],
      "not_found": [
        13
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "compare": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rotateString(s string, goal string) bool {\n    if len(s) != len(goal) {\n        return false\n    }\n    // Try every possible rotation\n    for k := 0; k < len(s); k++ {\n        // Build the k-th rotation: s[k..n-1] + s[0..k-1]\n        rotated := s[k:] + s[:k]\n        if rotated == goal {\n            return true\n        }\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "rotate": [
        8
      ],
      "compare": [
        9
      ],
      "found": [
        10
      ],
      "not_found": [
        13
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "compare": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var rotateString = function(s, goal) {\n    if (s.length !== goal.length) {\n        return false;\n    }\n    // Try every possible rotation\n    for (var k = 0; k < s.length; k++) {\n        // Build the k-th rotation: s[k..n-1] + s[0..k-1]\n        var rotated = s.slice(k) + s.slice(0, k);\n        if (rotated === goal) {\n            return true;\n        }\n    }\n    return false;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "rotate": [
        8
      ],
      "compare": [
        9
      ],
      "found": [
        10
      ],
      "not_found": [
        13
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "compare": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rotateString(s: string, goal: string): boolean {\n    if (s.length !== goal.length) {\n        return false;\n    }\n    // Try every possible rotation\n    for (let k = 0; k < s.length; k++) {\n        // Build the k-th rotation: s[k..n-1] + s[0..k-1]\n        const rotated = s.slice(k) + s.slice(0, k);\n        if (rotated === goal) {\n            return true;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "rotate": [
        8
      ],
      "compare": [
        9
      ],
      "found": [
        10
      ],
      "not_found": [
        13
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "compare": [
        9
      ]
    }
  }
};

const RotateStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid rotation",
    "value": {
      "s": "abcde",
      "goal": "cdeab"
    }
  },
  {
    "id": "ex2",
    "label": "Not a rotation",
    "value": {
      "s": "abcde",
      "goal": "abced"
    }
  },
  {
    "id": "ex3",
    "label": "Different lengths",
    "value": {
      "s": "aa",
      "goal": "a"
    }
  }
];

function generateRotateStringSteps(t: any): any[] {
  let e="string"==typeof t?.s?t.s:"",n="string"==typeof t?.goal?t.goal:"",r=e.length,i=(t,e,n)=>{let a={};for(let r=0;r<e.length;r++){let i=n(r);a[`${t}_${r}`]={type:"arrayElement",value:e[r],position:r,...i&&{state:i}}}return a},l=new StepRecorder({s:e,goal:n},{...i("s",e,()=>void 0),...i("goal",n,()=>void 0)});l.record("-",`Start: search "${e+e}" for "${n}" using KMP`);let s=r===n.length;if(l.add_conditional("check_length",!s),!s){for(let[t,a]of Object.entries({...i("s",e,()=>"mismatch"),...i("goal",n,()=>"mismatch")}))l.update_visual(t,a);return l.update_visual("verdict",{type:"metadata",value:!1}),l.record("check_length",`Lengths differ: ${r} vs ${n.length}, return false`),l.getSteps()}if(l.record("check_length",`Lengths match at ${r}, continue`),0===r)return l.update_visual("verdict",{type:"metadata",value:!0}),l.record("found","Both strings are empty, return true"),l.getSteps();let o=e+e;for(let[t,e]of Object.entries(i("doubled",o,()=>void 0)))l.update_visual(t,e);l.record("build_doubled",`Concatenate: s + s = "${o}", every rotation lives inside it`);let u=Array(r).fill(0),c=(t,e)=>{let n={};for(let a=0;a<r;a++){let r=a<=t;n[`lps_${a}`]={type:"arrayElement",value:r?u[a]:null,position:a,state:a===e?"checking":r?void 0:"empty"}}return n};for(let[t,e]of Object.entries(c(-1,-1)))l.update_visual(t,e);l.record("init_lps","Build the lps table: how much of each prefix repeats itself");let p=0;for(let t=1;t<r;t++){for(;p>0&&n[t]!==n[p];)p=u[p-1];for(let[e,a]of(n[t]===n[p]&&p++,u[t]=p,l.update_variable("lps",[...u]),Object.entries(c(t,t))))l.update_visual(e,a);l.record("fill_lps",`lps[${t}] = ${p} for prefix "${n.slice(0,t+1)}"`)}for(let[t,e]of Object.entries(c(r-1,-1)))l.update_visual(t,e);r>0&&l.record("lps_done",`lps = [${u.join(", ")}]`);let d=(t,e,a,l)=>{let s=e-a;for(let[n,r]of Object.entries(i("doubled",o,t=>t>=s&&t<s+a?"checking":l&&t===e?"mismatch":void 0)))t.update_visual(n,r);for(let[e,r]of Object.entries(i("goal",n,t=>t<a?"checking":l&&t===a?"mismatch":void 0)))t.update_visual(e,r);t.update_visual("window",{type:"range",start:Math.max(0,s),end:Math.max(0,s)+r-1,label:"window",state:"checking"}),t.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),t.update_visual("ptr_j",{type:"pointer",position:Math.min(a,Math.max(r-1,0)),label:"j"})},g=0,h=0,f=-1;for(;g<o.length&&f<0;)if(o[g]===n[h]){if(g++,h++,l.update_variable("i",g),l.update_variable("j",h),l.add_conditional("chars_match",!0),d(l,g,h,!1),l.record("match_char",`'${n[h-1]}' matches, advance both to i = ${g}, j = ${h}`),h===r){f=g-h;break}}else if(l.add_conditional("chars_match",!1),d(l,g,h,!0),h>0){let t=u[h-1];l.record("mismatch_jump",`'${o[g]}' != '${n[h]}', lps says slide j from ${h} to ${t} without moving i`),h=t,l.update_variable("j",h)}else l.record("mismatch_advance",`'${o[g]}' != '${n[0]}', nothing matched, advance i`),g++,l.update_variable("i",g);if(l.delete_visual("ptr_i"),l.delete_visual("ptr_j"),f>=0){for(let[t,e]of Object.entries({...i("doubled",o,t=>t>=f&&t<f+r?"matched":void 0),...i("goal",n,()=>"matched")}))l.update_visual(t,e);l.update_visual("window",{type:"range",start:f,end:f+r-1,label:"window",state:"matched"}),l.update_visual("verdict",{type:"metadata",value:!0}),l.record("found",`Found goal in s + s at index ${f}, return true`)}else{for(let[t,e]of(l.delete_visual("window"),Object.entries({...i("doubled",o,()=>void 0),...i("goal",n,()=>"failed")})))l.update_visual(t,e);l.update_visual("verdict",{type:"metadata",value:!1}),l.record("not_found","goal never appears in s + s, return false")}return l.getSteps()
}

export function RotateStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RotateStringTemplates,
      generateSteps: (t: any) => {
        const recorded = generateRotateStringSteps(t) as any[];
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
      title="Rotate String"
      slug="rotate-string"
      approaches={approaches}
      presets={RotateStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Special Binary String (special-binary-string)
// ==========================================

const SpecialBinaryStringTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def makeLargestSpecial(self, s: str) -> str:\n        if len(s) <= 2:\n            return s\n        parts = []\n        balance = 0\n        start = 0\n        for i in range(len(s)):\n            balance += 1 if s[i] == '1' else -1\n            if balance == 0:\n                interior = s[start + 1:i]\n                parts.append(\"1\" + self.makeLargestSpecial(interior) + \"0\")\n                start = i + 1\n        parts.sort(reverse=True)\n        return ''.join(parts)",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        3,
        4
      ],
      "scan_parts": [
        5,
        6,
        7,
        8,
        9
      ],
      "found_part": [
        10,
        11
      ],
      "add_part": [
        12,
        13
      ],
      "sort_parts": [
        14
      ],
      "return_result": [
        15
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "base_case": [
        3
      ],
      "balance_zero": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String makeLargestSpecial(String s) {\n        if (s.length() <= 2) return s;\n        List<String> parts = new ArrayList<>();\n        int balance = 0, start = 0;\n        for (int i = 0; i < s.length(); i++) {\n            balance += s.charAt(i) == '1' ? 1 : -1;\n            if (balance == 0) {\n                String interior = s.substring(start + 1, i);\n                parts.add(\"1\" + makeLargestSpecial(interior) + \"0\");\n                start = i + 1;\n            }\n        }\n        Collections.sort(parts, Collections.reverseOrder());\n        StringBuilder result = new StringBuilder();\n        for (String part : parts) result.append(part);\n        return result.toString();\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        3
      ],
      "scan_parts": [
        4,
        5,
        6,
        7
      ],
      "found_part": [
        8,
        9
      ],
      "add_part": [
        10,
        11
      ],
      "sort_parts": [
        14
      ],
      "return_result": [
        15,
        16,
        17
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "base_case": [
        3
      ],
      "balance_zero": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string makeLargestSpecial(string s) {\n        if (s.size() <= 2) return s;\n        vector<string> parts;\n        int balance = 0, start = 0;\n        for (int i = 0; i < s.size(); i++) {\n            balance += s[i] == '1' ? 1 : -1;\n            if (balance == 0) {\n                string interior = s.substr(start + 1, i - start - 1);\n                parts.push_back(\"1\" + makeLargestSpecial(interior) + \"0\");\n                start = i + 1;\n            }\n        }\n        sort(parts.rbegin(), parts.rend());\n        string result;\n        for (auto& p : parts) result += p;\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        4
      ],
      "scan_parts": [
        5,
        6,
        7,
        8
      ],
      "found_part": [
        9,
        10
      ],
      "add_part": [
        11,
        12
      ],
      "sort_parts": [
        15
      ],
      "return_result": [
        16,
        17,
        18
      ],
      "complete": [
        3
      ]
    },
    "conditionalMap": {
      "base_case": [
        4
      ],
      "balance_zero": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string MakeLargestSpecial(string s) {\n        if (s.Length <= 2) return s;\n        var parts = new List<string>();\n        int balance = 0, start = 0;\n        for (int i = 0; i < s.Length; i++) {\n            balance += s[i] == '1' ? 1 : -1;\n            if (balance == 0) {\n                string interior = s.Substring(start + 1, i - start - 1);\n                parts.Add(\"1\" + MakeLargestSpecial(interior) + \"0\");\n                start = i + 1;\n            }\n        }\n        parts.Sort((a, b) => string.Compare(b, a));\n        return string.Join(\"\", parts);\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        3
      ],
      "scan_parts": [
        4,
        5,
        6,
        7
      ],
      "found_part": [
        8,
        9
      ],
      "add_part": [
        10,
        11
      ],
      "sort_parts": [
        14
      ],
      "return_result": [
        15
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "base_case": [
        3
      ],
      "balance_zero": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func makeLargestSpecial(s string) string {\n    if len(s) <= 2 {\n        return s\n    }\n    parts := []string{}\n    balance, start := 0, 0\n    for i := 0; i < len(s); i++ {\n        if s[i] == '1' {\n            balance++\n        } else {\n            balance--\n        }\n        if balance == 0 {\n            interior := s[start+1 : i]\n            parts = append(parts, \"1\"+makeLargestSpecial(interior)+\"0\")\n            start = i + 1\n        }\n    }\n    sort.Sort(sort.Reverse(sort.StringSlice(parts)))\n    return strings.Join(parts, \"\")\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        2,
        3
      ],
      "scan_parts": [
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "found_part": [
        13,
        14
      ],
      "add_part": [
        15,
        16
      ],
      "sort_parts": [
        19
      ],
      "return_result": [
        20
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "base_case": [
        2
      ],
      "balance_zero": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var makeLargestSpecial = function(s) {\n    if (s.length <= 2) return s;\n    const parts = [];\n    let balance = 0, start = 0;\n    for (let i = 0; i < s.length; i++) {\n        balance += s[i] === '1' ? 1 : -1;\n        if (balance === 0) {\n            const interior = s.substring(start + 1, i);\n            parts.push(\"1\" + makeLargestSpecial(interior) + \"0\");\n            start = i + 1;\n        }\n    }\n    parts.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));\n    return parts.join(\"\");\n};",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        2
      ],
      "scan_parts": [
        3,
        4,
        5,
        6
      ],
      "found_part": [
        7,
        8
      ],
      "add_part": [
        9,
        10
      ],
      "sort_parts": [
        13
      ],
      "return_result": [
        14
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "base_case": [
        2
      ],
      "balance_zero": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function makeLargestSpecial(s: string): string {\n    if (s.length <= 2) return s;\n    const parts: string[] = [];\n    let balance = 0, start = 0;\n    for (let i = 0; i < s.length; i++) {\n        balance += s[i] === '1' ? 1 : -1;\n        if (balance === 0) {\n            const interior = s.substring(start + 1, i);\n            parts.push(\"1\" + makeLargestSpecial(interior) + \"0\");\n            start = i + 1;\n        }\n    }\n    parts.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));\n    return parts.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        2
      ],
      "scan_parts": [
        3,
        4,
        5,
        6
      ],
      "found_part": [
        7,
        8
      ],
      "add_part": [
        9,
        10
      ],
      "sort_parts": [
        13
      ],
      "return_result": [
        14
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "base_case": [
        2
      ],
      "balance_zero": [
        7
      ]
    }
  }
};

const SpecialBinaryStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "11011000"
    }
  },
  {
    "id": "ex2",
    "label": "Reorder",
    "value": {
      "s": "10111000"
    }
  },
  {
    "id": "ex3",
    "label": "Minimal",
    "value": {
      "s": "10"
    }
  }
];

function generateSpecialBinaryStringSteps(t: any): any[] {
  let e=t.s??"11011000",a=new RecursiveStepRecorder({s:e},{}),s=()=>{for(let t=0;t<24;t++)a.delete_visual(`char_${t}`);for(let t=0;t<24;t++)a.delete_visual(`part_${t}`)},i=(t,e,r,i,n,l,o,c)=>{s();for(let e=0;e<t.length;e++)a.add_new_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e});o.forEach((t,e)=>{a.add_new_visual(`part_${e}`,{type:"metadata",state:"found",value:{text:t.text,start:t.start,end:t.end,slot:t.slot}})}),a.update_visual("meta_scan",{type:"metadata",value:{depth:n,i:e,balance:i,start:r,len:t.length,phase:l,result:c}}),e>=0&&e<t.length?a.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}):a.delete_visual("ptr_i")},n=(t,e,r,s,i,n,l)=>{a.update_visual("meta_scan",{type:"metadata",value:{depth:s,i:t,balance:e,start:r,len:i,phase:n,result:l}}),t>=0&&t<i?a.update_visual("ptr_i",{type:"pointer",position:t,label:"i"}):a.delete_visual("ptr_i")},l=(t,e,r,s)=>{a.update_visual(`frame_${t}`,{type:"metadata",state:e,value:{depth:t,str:r,result:s}})};a.pushCallFrame({s:e},"makeLargestSpecial"),i(e,-1,0,0,0,"intro",[],null),a.record("-",`Make largest special binary string from "${e}"`);let o=function t(e,r){a.pushCallFrame({s:e,depth:r},"makeLargestSpecial");for(let t=0;t<r;t++){let e=a.get_visual(`frame_${t}`);e&&"metadata"===e.type&&a.update_visual(`frame_${t}`,{...e,state:"waiting"})}l(r,"active",e,"");let s=e.length<=2;if(a.add_conditional("base_case",s),s)return i(e,-1,0,0,r,"base",[],e),l(r,"done",e,e),a.record("base_case",`Base case: "${e}" (length ≤ 2), return as-is`),a.popCallFrame(),e;let o=[],c=0,p=0;i(e,0,0,0,r,"scanning",[],null),a.record("scan_parts",`Scan "${e}" tracking balance (+1 for 1, -1 for 0)`);for(let s=0;s<e.length;s++){c+="1"===e[s]?1:-1,n(s,c,p,r,e.length,"scanning",null);let d=0===c;if(a.add_conditional("balance_zero",d),a.record("scan_parts",`i=${s}: '${e[s]}' → balance = ${c}${d?" (closed a part)":""}`),d){let n=e.substring(p+1,s);a.record("found_part",`Balance 0 at i=${s}: part "${e.substring(p,s+1)}", interior "${n}"`);let d=t(n,r+1);a.delete_visual(`frame_${r+1}`);let u="1"+d+"0";o.push({text:u,start:p,end:s,slot:o.length}),i(e,s,p,c,r,"scanning",o,null),l(r,"active",e,""),a.record("add_part",`Part = "1" + "${d}" + "0" = "${u}"`),p=s+1}}let d=[...o].sort((t,e)=>t.text>e.text?-1:+(t.text<e.text));d.forEach((t,e)=>{t.slot=e;let r=`part_${o.indexOf(t)}`,s=a.get_visual(r);s&&"metadata"===s.type&&a.update_visual(r,{type:"metadata",state:"sorted",value:{...s.value,slot:e}})});let u=d.map(t=>t.text).join("");return n(e.length,0,p,r,e.length,"sorting",u),a.record("sort_parts",`Sort parts descending: [${d.map(t=>`"${t.text}"`).join(", ")}]`),l(r,"done",e,u),n(e.length,0,p,r,e.length,"returning",u),a.record("return_result",`Return "${u}" from depth ${r}`),a.popCallFrame(),u}(e,0);s(),a.delete_visual("ptr_i"),a.update_visual("meta_scan",{type:"metadata",value:{depth:0,i:-1,balance:0,start:0,len:o.length,phase:"complete",result:o}});for(let t=0;t<o.length;t++)a.add_new_visual(`result_${t}`,{type:"arrayElement",value:o[t],position:t,state:"final"});return l(0,"done",e,o),a.record("complete",`Largest special string: "${o}"`),a.popCallFrame(),a.getSteps()
}

export function SpecialBinaryStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SpecialBinaryStringTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSpecialBinaryStringSteps(t) as any[];
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
      title="Special Binary String"
      slug="special-binary-string"
      approaches={approaches}
      presets={SpecialBinaryStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// String Compression (string-compression)
// ==========================================

const StringCompressionTemplates = {
  "python": {
    "language": "python",
    "code": "def compress(chars):\n    write = 0\n    read = 0\n\n    while read < len(chars):\n        current_char = chars[read]\n        count = 0\n\n        # Count consecutive occurrences\n        while read < len(chars) and chars[read] == current_char:\n            read += 1\n            count += 1\n\n        # Write the character\n        chars[write] = current_char\n        write += 1\n\n        # Write the count digits if count > 1\n        if count > 1:\n            for c in str(count):\n                chars[write] = c\n                write += 1\n\n    return write",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "read_char": [
        6,
        7
      ],
      "count_chars": [
        10,
        11
      ],
      "write_char": [
        15
      ],
      "write_count": [],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "count_gt_1": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int compress(char[] chars) {\n        int write = 0;\n        int read = 0;\n\n        while (read < chars.length) {\n            char currentChar = chars[read];\n            int count = 0;\n\n            // Count consecutive occurrences\n            while (read < chars.length && chars[read] == currentChar) {\n                read++;\n                count++;\n            }\n\n            // Write the character\n            chars[write++] = currentChar;\n\n            // Write the count digits if count > 1\n            if (count > 1) {\n                String countStr = String.valueOf(count);\n                for (char c : countStr.toCharArray()) {\n                    chars[write++] = c;\n                }\n            }\n        }\n\n        return write;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "read_char": [
        7,
        8
      ],
      "count_chars": [
        11,
        12
      ],
      "write_char": [
        17
      ],
      "write_count": [],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "count_gt_1": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int compress(vector<char>& chars) {\n        int write = 0;\n        int read = 0;\n\n        while (read < chars.size()) {\n            char currentChar = chars[read];\n            int count = 0;\n\n            // Count consecutive occurrences\n            while (read < chars.size() && chars[read] == currentChar) {\n                read++;\n                count++;\n            }\n\n            // Write the character\n            chars[write++] = currentChar;\n\n            // Write the count digits if count > 1\n            if (count > 1) {\n                string countStr = to_string(count);\n                for (char c : countStr) {\n                    chars[write++] = c;\n                }\n            }\n        }\n\n        return write;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4,
        5
      ],
      "read_char": [
        8,
        9
      ],
      "count_chars": [
        12,
        13
      ],
      "write_char": [
        18
      ],
      "write_count": [],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "count_gt_1": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int Compress(char[] chars) {\n        int write = 0;\n        int read = 0;\n\n        while (read < chars.Length) {\n            char currentChar = chars[read];\n            int count = 0;\n\n            // Count consecutive occurrences\n            while (read < chars.Length && chars[read] == currentChar) {\n                read++;\n                count++;\n            }\n\n            // Write the character\n            chars[write++] = currentChar;\n\n            // Write the count digits if count > 1\n            if (count > 1) {\n                foreach (char c in count.ToString()) {\n                    chars[write++] = c;\n                }\n            }\n        }\n\n        return write;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "read_char": [
        7,
        8
      ],
      "count_chars": [
        11,
        12
      ],
      "write_char": [
        17
      ],
      "write_count": [],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "count_gt_1": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func compress(chars []byte) int {\n    write := 0\n    read := 0\n\n    for read < len(chars) {\n        currentChar := chars[read]\n        count := 0\n\n        // Count consecutive occurrences\n        for read < len(chars) && chars[read] == currentChar {\n            read++\n            count++\n        }\n\n        // Write the character\n        chars[write] = currentChar\n        write++\n\n        // Write the count digits if count > 1\n        if count > 1 {\n            countStr := strconv.Itoa(count)\n            for _, c := range countStr {\n                chars[write] = byte(c)\n                write++\n            }\n        }\n    }\n\n    return write\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "read_char": [
        6,
        7
      ],
      "count_chars": [
        10,
        11
      ],
      "write_char": [
        16,
        17
      ],
      "write_count": [
        21,
        22,
        23,
        24
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "count_gt_1": [
        20
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function compress(chars) {\n  let write = 0;\n  let read = 0;\n\n  while (read < chars.length) {\n    const currentChar = chars[read];\n    let count = 0;\n\n    // Count consecutive occurrences\n    while (read < chars.length && chars[read] === currentChar) {\n      read++;\n      count++;\n    }\n\n    // Write the character\n    chars[write++] = currentChar;\n\n    // Write the count digits if count > 1\n    if (count > 1) {\n      for (const c of String(count)) {\n        chars[write++] = c;\n      }\n    }\n  }\n\n  return write;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "read_char": [
        6,
        7
      ],
      "count_chars": [
        10,
        11
      ],
      "write_char": [
        16
      ],
      "write_count": [],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "count_gt_1": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function compress(chars: string[]): number {\n    let write = 0;\n    let read = 0;\n\n    while (read < chars.length) {\n        const currentChar = chars[read];\n        let count = 0;\n\n        // Count consecutive occurrences\n        while (read < chars.length && chars[read] === currentChar) {\n            read++;\n            count++;\n        }\n\n        // Write the character\n        chars[write++] = currentChar;\n\n        // Write the count digits if count > 1\n        if (count > 1) {\n            for (const c of String(count)) {\n                chars[write++] = c;\n            }\n        }\n    }\n\n    return write;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "read_char": [
        6,
        7
      ],
      "count_chars": [
        10,
        11
      ],
      "write_char": [
        16
      ],
      "write_count": [],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "count_gt_1": [
        19
      ]
    }
  }
};

const StringCompressionPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "chars": [
        "a",
        "a",
        "b",
        "b",
        "c",
        "c",
        "c"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Single char",
    "value": {
      "chars": [
        "a"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Large count",
    "value": {
      "chars": [
        "a",
        "b",
        "b",
        "b",
        "b",
        "b",
        "b",
        "b",
        "b",
        "b",
        "b",
        "b",
        "b"
      ]
    }
  }
];

function generateStringCompressionSteps(e: any): any[] {
  let t=[...e.chars],r=t.length,a=[];{let e=0;for(;e<r;){let n=t[e],i=0;for(;e<r&&t[e]===n;)e++,i++;a.push(n),i>1&&a.push(...String(i))}}let i=a.length,c=a.join(""),l=[...t],o={};for(let e=0;e<r;e++)o[`bar_${e}`]={type:"arrayElement",value:l[e],position:e};let s=new StepRecorder({finalLen:i,resultStr:c},{...o}),u=e=>s.update_variable("exprParts",e),h=e=>Math.min(e,r-.5);s.record("-",`Compress [${t.join(", ")}] with an extra result array`);let d=0,p=0;s.add_new_visual("ptr_read",{type:"pointer",position:0,label:"read"});let g=(e,t)=>{s.update_variable("read",d),s.update_variable("write",p),s.update_visual("ptr_read",{type:"pointer",position:h(d),label:"read"}),s.record(e,t)};for(u([{t:"result = []",c:"green"},{t:"   run-length encode into a new array",c:"muted"}]),g("init","result = [], read = 0");d<r;){let e=l[d],t=d;s.update_variable("groupStart",t),s.update_variable("groupEnd",t),s.update_variable("ch",e),u([{t:`chars[${t}] = `,c:"muted"},{t:`'${e}'`,c:"cyan"},{t:"  starts a run",c:"muted"}]),g("read_char",`Current character: '${e}'`);let n=0;for(;d<r&&l[d]===e;)d++,n++;s.update_variable("count",n),s.update_variable("groupEnd",d-1),u([{t:"count = ",c:"muted"},{t:String(n),c:"yellow"},{t:` consecutive '${e}'`,c:"muted"}]),g("count_chars",`Run of ${n} '${e}'${1===n?"":"s"}, read = ${d}`);let a=p;if(s.update_visual(`res_${p}`,{type:"arrayElement",value:e,position:p}),p++,s.update_variable("flyFrom",t),s.update_variable("flyTo",a),u([{t:"result.append(",c:"muted"},{t:`'${e}'`,c:"green"},{t:")   len = ",c:"muted"},{t:String(p),c:"green"}]),g("write_char",`Append '${e}' to result (index ${a})`),s.delete_variable("flyFrom"),s.delete_variable("flyTo"),n>1){let e=String(n),t=[];for(let r of e)s.update_visual(`res_${p}`,{type:"arrayElement",value:r,position:p}),t.push(p),p++;s.add_conditional("count_gt_1",!0),s.update_variable("digitSlots",t),u([{t:"count = ",c:"muted"},{t:String(n),c:"yellow"},{t:" > 1  →  result.append(",c:"muted"},{t:`"${e}"`,c:"yellow"},{t:")",c:"muted"}]),g("write_count",`Append "${e}" to result (index ${t[0]}${e.length>1?`..${t[t.length-1]}`:""})`),s.delete_variable("digitSlots")}else s.add_conditional("count_gt_1",!1),u([{t:"count = 1",c:"yellow"},{t:"  →  a single char needs no digits",c:"muted"}]),g("write_count","count = 1: no digits to append")}for(let e=0;e<i;e++)s.update_visual(`bar_${e}`,{type:"arrayElement",value:a[e],position:e});return s.update_visual("ptr_read",{type:"pointer",position:h(d),label:"read",state:"exiting"}),s.update_variable("copyBack",!0),u([{t:"copy result back into chars   ",c:"muted"},{t:`"${c}"`,c:"green"}]),s.update_variable("read",d),s.update_variable("write",p),s.record("copy_back",`Copy the ${i}-char result back into chars`),s.delete_variable("copyBack"),s.update_variable("done",!0),u([]),s.record("complete",`Return ${i}: compressed to "${c}"`),s.getSteps()
}

export function StringCompressionProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: StringCompressionTemplates,
      generateSteps: (e: any) => {
        const recorded = generateStringCompressionSteps(e) as any[];
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
      title="String Compression"
      slug="string-compression"
      approaches={approaches}
      presets={StringCompressionPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Text Justification (text-justification)
// ==========================================

const TextJustificationTemplates = {
  "python": {
    "language": "python",
    "code": "def fullJustify(words: list[str], maxWidth: int) -> list[str]:\n    result = []\n    i = 0\n    while i < len(words):\n        # Determine which words fit on this line\n        lineStart = i\n        lineLength = len(words[i])\n        i += 1\n        while i < len(words) and lineLength + 1 + len(words[i]) <= maxWidth:\n            lineLength += 1 + len(words[i])\n            i += 1\n        numWords = i - lineStart\n        numGaps = numWords - 1\n        line = \"\"\n        # Last line or single word: left-justify\n        if i == len(words) or numGaps == 0:\n            for j in range(lineStart, i):\n                if j > lineStart:\n                    line += \" \"\n                line += words[j]\n            line += \" \" * (maxWidth - len(line))\n        else:\n            totalChars = sum(len(words[j]) for j in range(lineStart, i))\n            totalSpaces = maxWidth - totalChars\n            spacePer = totalSpaces // numGaps\n            extraSpaces = totalSpaces % numGaps\n            for j in range(lineStart, i):\n                if j > lineStart:\n                    # Left gaps get one extra space if remainder exists\n                    spaces = spacePer + (1 if j - lineStart <= extraSpaces else 0)\n                    line += \" \" * spaces\n                line += words[j]\n        result.append(line)\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "pick_words": [
        6,
        7
      ],
      "try_add_word": [
        9,
        10
      ],
      "calc_spaces": [
        23,
        24,
        25,
        26
      ],
      "justify_line": [
        27,
        28,
        30,
        31,
        32
      ],
      "left_justify": [
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "add_line": [
        33
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "try_fit": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> fullJustify(String[] words, int maxWidth) {\n    List<String> result = new ArrayList<>();\n    int i = 0;\n    while (i < words.length) {\n        // Determine which words fit on this line\n        int lineStart = i;\n        int lineLength = words[i].length();\n        i++;\n        while (i < words.length && lineLength + 1 + words[i].length() <= maxWidth) {\n            lineLength += 1 + words[i].length();\n            i++;\n        }\n        int numWords = i - lineStart;\n        int numGaps = numWords - 1;\n        StringBuilder line = new StringBuilder();\n        // Last line or single word: left-justify\n        if (i == words.length || numGaps == 0) {\n            for (int j = lineStart; j < i; j++) {\n                if (j > lineStart) line.append(' ');\n                line.append(words[j]);\n            }\n            // Pad remaining width with spaces\n            while (line.length() < maxWidth) line.append(' ');\n        } else {\n            // Calculate total characters used by words only\n            int totalChars = 0;\n            for (int j = lineStart; j < i; j++) totalChars += words[j].length();\n            int totalSpaces = maxWidth - totalChars;\n            int spacePer = totalSpaces / numGaps;\n            int extraSpaces = totalSpaces % numGaps;\n            for (int j = lineStart; j < i; j++) {\n                if (j > lineStart) {\n                    // Left gaps get one extra space if remainder exists\n                    int spaces = spacePer + (j - lineStart <= extraSpaces ? 1 : 0);\n                    for (int s = 0; s < spaces; s++) line.append(' ');\n                }\n                line.append(words[j]);\n            }\n        }\n        result.add(line.toString());\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_words": [
        6,
        7
      ],
      "try_add_word": [
        9,
        10
      ],
      "calc_spaces": [
        26,
        27,
        28,
        29,
        30
      ],
      "justify_line": [
        31,
        32,
        34,
        35,
        36,
        37
      ],
      "left_justify": [
        17,
        18,
        19,
        20,
        21,
        23
      ],
      "add_line": [
        40
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "try_fit": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> fullJustify(vector<string>& words, int maxWidth) {\n    vector<string> result;\n    int i = 0;\n    while (i < words.size()) {\n        // Determine which words fit on this line\n        int lineStart = i;\n        int lineLength = words[i].length();\n        i++;\n        while (i < words.size() && lineLength + 1 + (int)words[i].length() <= maxWidth) {\n            lineLength += 1 + words[i].length();\n            i++;\n        }\n        int numWords = i - lineStart;\n        int numGaps = numWords - 1;\n        string line = \"\";\n        // Last line or single word: left-justify\n        if (i == words.size() || numGaps == 0) {\n            for (int j = lineStart; j < i; j++) {\n                if (j > lineStart) line += \" \";\n                line += words[j];\n            }\n            // Pad remaining width with spaces\n            line += string(maxWidth - line.length(), ' ');\n        } else {\n            // Calculate total characters used by words only\n            int totalChars = 0;\n            for (int j = lineStart; j < i; j++) totalChars += words[j].length();\n            int totalSpaces = maxWidth - totalChars;\n            int spacePer = totalSpaces / numGaps;\n            int extraSpaces = totalSpaces % numGaps;\n            for (int j = lineStart; j < i; j++) {\n                if (j > lineStart) {\n                    // Left gaps get one extra space if remainder exists\n                    int spaces = spacePer + (j - lineStart <= extraSpaces ? 1 : 0);\n                    line += string(spaces, ' ');\n                }\n                line += words[j];\n            }\n        }\n        result.push_back(line);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_words": [
        6,
        7
      ],
      "try_add_word": [
        9,
        10
      ],
      "calc_spaces": [
        26,
        27,
        28,
        29,
        30
      ],
      "justify_line": [
        31,
        32,
        34,
        35,
        36,
        37
      ],
      "left_justify": [
        17,
        18,
        19,
        20,
        21,
        23
      ],
      "add_line": [
        40
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "try_fit": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> FullJustify(string[] words, int maxWidth) {\n    var result = new List<string>();\n    int i = 0;\n    while (i < words.Length) {\n        // Determine which words fit on this line\n        int lineStart = i;\n        int lineLength = words[i].Length;\n        i++;\n        while (i < words.Length && lineLength + 1 + words[i].Length <= maxWidth) {\n            lineLength += 1 + words[i].Length;\n            i++;\n        }\n        int numWords = i - lineStart;\n        int numGaps = numWords - 1;\n        var line = new StringBuilder();\n        // Last line or single word: left-justify\n        if (i == words.Length || numGaps == 0) {\n            for (int j = lineStart; j < i; j++) {\n                if (j > lineStart) line.Append(' ');\n                line.Append(words[j]);\n            }\n            // Pad remaining width with spaces\n            while (line.Length < maxWidth) line.Append(' ');\n        } else {\n            // Calculate total characters used by words only\n            int totalChars = 0;\n            for (int j = lineStart; j < i; j++) totalChars += words[j].Length;\n            int totalSpaces = maxWidth - totalChars;\n            int spacePer = totalSpaces / numGaps;\n            int extraSpaces = totalSpaces % numGaps;\n            for (int j = lineStart; j < i; j++) {\n                if (j > lineStart) {\n                    // Left gaps get one extra space if remainder exists\n                    int spaces = spacePer + (j - lineStart <= extraSpaces ? 1 : 0);\n                    line.Append(new string(' ', spaces));\n                }\n                line.Append(words[j]);\n            }\n        }\n        result.Add(line.ToString());\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_words": [
        6,
        7
      ],
      "try_add_word": [
        9,
        10
      ],
      "calc_spaces": [
        26,
        27,
        28,
        29,
        30
      ],
      "justify_line": [
        31,
        32,
        34,
        35,
        36,
        37
      ],
      "left_justify": [
        17,
        18,
        19,
        20,
        21,
        23
      ],
      "add_line": [
        40
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "try_fit": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func fullJustify(words []string, maxWidth int) []string {\n    result := []string{}\n    i := 0\n    for i < len(words) {\n        // Determine which words fit on this line\n        lineStart := i\n        lineLength := len(words[i])\n        i++\n        for i < len(words) && lineLength+1+len(words[i]) <= maxWidth {\n            lineLength += 1 + len(words[i])\n            i++\n        }\n        numWords := i - lineStart\n        numGaps := numWords - 1\n        line := \"\"\n        // Last line or single word: left-justify\n        if i == len(words) || numGaps == 0 {\n            for j := lineStart; j < i; j++ {\n                if j > lineStart {\n                    line += \" \"\n                }\n                line += words[j]\n            }\n            // Pad remaining width with spaces\n            for len(line) < maxWidth {\n                line += \" \"\n            }\n        } else {\n            // Calculate total characters used by words only\n            totalChars := 0\n            for j := lineStart; j < i; j++ {\n                totalChars += len(words[j])\n            }\n            totalSpaces := maxWidth - totalChars\n            spacePer := totalSpaces / numGaps\n            extraSpaces := totalSpaces % numGaps\n            for j := lineStart; j < i; j++ {\n                if j > lineStart {\n                    spaces := spacePer\n                    // Left gaps get one extra space if remainder exists\n                    if j-lineStart <= extraSpaces {\n                        spaces++\n                    }\n                    line += strings.Repeat(\" \", spaces)\n                }\n                line += words[j]\n            }\n        }\n        result = append(result, line)\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_words": [
        6,
        7
      ],
      "try_add_word": [
        9,
        10
      ],
      "calc_spaces": [
        30,
        31,
        32,
        33,
        34,
        35,
        36
      ],
      "justify_line": [
        37,
        38,
        39,
        41,
        42,
        43,
        44,
        45,
        46
      ],
      "left_justify": [
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        25,
        26,
        27
      ],
      "add_line": [
        49
      ],
      "complete": [
        51
      ]
    },
    "conditionalMap": {
      "try_fit": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var fullJustify = function(words, maxWidth) {\n    const result = [];\n    let i = 0;\n    while (i < words.length) {\n        // Determine which words fit on this line\n        let lineStart = i;\n        let lineLength = words[i].length;\n        i++;\n        while (i < words.length && lineLength + 1 + words[i].length <= maxWidth) {\n            lineLength += 1 + words[i].length;\n            i++;\n        }\n        const numWords = i - lineStart;\n        const numGaps = numWords - 1;\n        let line = \"\";\n        // Last line or single word: left-justify\n        if (i === words.length || numGaps === 0) {\n            for (let j = lineStart; j < i; j++) {\n                if (j > lineStart) line += \" \";\n                line += words[j];\n            }\n            // Pad remaining width with spaces\n            line += \" \".repeat(maxWidth - line.length);\n        } else {\n            // Calculate total characters used by words only\n            let totalChars = 0;\n            for (let j = lineStart; j < i; j++) totalChars += words[j].length;\n            const totalSpaces = maxWidth - totalChars;\n            const spacePer = Math.floor(totalSpaces / numGaps);\n            const extraSpaces = totalSpaces % numGaps;\n            for (let j = lineStart; j < i; j++) {\n                if (j > lineStart) {\n                    // Left gaps get one extra space if remainder exists\n                    const spaces = spacePer + (j - lineStart <= extraSpaces ? 1 : 0);\n                    line += \" \".repeat(spaces);\n                }\n                line += words[j];\n            }\n        }\n        result.push(line);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_words": [
        6,
        7
      ],
      "try_add_word": [
        9,
        10
      ],
      "calc_spaces": [
        26,
        27,
        28,
        29,
        30
      ],
      "justify_line": [
        31,
        32,
        34,
        35,
        36,
        37
      ],
      "left_justify": [
        17,
        18,
        19,
        20,
        21,
        23
      ],
      "add_line": [
        40
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "try_fit": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function fullJustify(words: string[], maxWidth: number): string[] {\n    const result: string[] = [];\n    let i = 0;\n    while (i < words.length) {\n        // Determine which words fit on this line\n        let lineStart = i;\n        let lineLength = words[i].length;\n        i++;\n        while (i < words.length && lineLength + 1 + words[i].length <= maxWidth) {\n            lineLength += 1 + words[i].length;\n            i++;\n        }\n        const numWords = i - lineStart;\n        const numGaps = numWords - 1;\n        let line = \"\";\n        // Last line or single word: left-justify\n        if (i === words.length || numGaps === 0) {\n            for (let j = lineStart; j < i; j++) {\n                if (j > lineStart) line += \" \";\n                line += words[j];\n            }\n            // Pad remaining width with spaces\n            line += \" \".repeat(maxWidth - line.length);\n        } else {\n            // Calculate total characters used by words only\n            let totalChars = 0;\n            for (let j = lineStart; j < i; j++) totalChars += words[j].length;\n            const totalSpaces = maxWidth - totalChars;\n            const spacePer = Math.floor(totalSpaces / numGaps);\n            const extraSpaces = totalSpaces % numGaps;\n            for (let j = lineStart; j < i; j++) {\n                if (j > lineStart) {\n                    // Left gaps get one extra space if remainder exists\n                    const spaces = spacePer + (j - lineStart <= extraSpaces ? 1 : 0);\n                    line += \" \".repeat(spaces);\n                }\n                line += words[j];\n            }\n        }\n        result.push(line);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_words": [
        6,
        7
      ],
      "try_add_word": [
        9,
        10
      ],
      "calc_spaces": [
        26,
        27,
        28,
        29,
        30
      ],
      "justify_line": [
        31,
        32,
        34,
        35,
        36,
        37
      ],
      "left_justify": [
        17,
        18,
        19,
        20,
        21,
        23
      ],
      "add_line": [
        40
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "try_fit": [
        9
      ]
    }
  }
};

const TextJustificationPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "words": [
        "This",
        "is",
        "an",
        "example",
        "of",
        "text",
        "justification."
      ],
      "maxWidth": 16
    }
  },
  {
    "id": "ex2",
    "label": "Long word",
    "value": {
      "words": [
        "What",
        "must",
        "be",
        "acknowledgment",
        "shall",
        "be"
      ],
      "maxWidth": 16
    }
  },
  {
    "id": "ex3",
    "label": "Short",
    "value": {
      "words": [
        "Science",
        "is",
        "what",
        "we"
      ],
      "maxWidth": 20
    }
  }
];

function generateTextJustificationSteps(e: any): any[] {
  let t=e.words,i=e.maxWidth,r=t.length,a={};for(let e=0;e<r;e++)a[`word_${e}`]={type:"arrayElement",value:t[e],position:e};a.meta_maxWidth={type:"metadata",value:i,label:"maxWidth"};let l=new StepRecorder({maxWidth:i},a),s=(e,i)=>{l.update_visual(`word_${e}`,{type:"arrayElement",value:t[e],position:e,state:i})};l.record("-",`Start: justify ${r} words into lines of width ${i}`);let o=0,d=0,c=[];for(;o<r;){let e=o,n=t[o].length;for(s(o,"inLine"),l.add_new_visual("range_line",{type:"range",start:e,end:e,label:`Line ${d+1}`}),l.add_new_variable("lineStart",e),l.add_new_variable("lineLength",n),l.record("pick_words",`Line ${d+1}: start with "${t[o]}" (length ${n})`),o++;o<r&&n+1+t[o].length<=i;){let r=n+1+t[o].length;s(o,"inLine"),l.update_visual("range_line",{type:"range",start:e,end:o,label:`Line ${d+1}`}),l.update_variable("lineLength",r),l.add_conditional("try_fit",!0),l.record("try_add_word",`"${t[o]}" fits: ${n} + 1 + ${t[o].length} = ${r} <= ${i}`),n=r,o++}if(o<r){let e=n+1+t[o].length;s(o,"reject"),l.add_conditional("try_fit",!1),l.record("try_add_word",`"${t[o]}" does not fit: ${n} + 1 + ${t[o].length} = ${e} > ${i}`),s(o)}let a=o-e-1,h="",u=o===r;if(u||0===a){for(let i=e;i<o;i++)i>e&&(h+=" "),h+=t[i];for(;h.length<i;)h+=" ";l.record("left_justify",u&&a>0?`Last line: left-justify the words, pad the right side to width ${i}`:`Single word on this line: left-justify it, pad to width ${i}`)}else{let n=0;for(let i=e;i<o;i++)n+=t[i].length;let r=i-n,s=Math.floor(r/a),d=r%a;l.add_new_variable("totalSpaces",r),l.add_new_variable("spacePer",s),l.add_new_variable("extraSpaces",d),l.record("calc_spaces",`${i} - ${n} chars = ${r} spaces over ${a} gap${a>1?"s":""}: ${s} each, ${d} extra for the leftmost`);for(let i=e;i<o;i++){if(i>e){let t=s+ +(i-e<=d);h+=" ".repeat(t)}h+=t[i]}l.delete_variable("totalSpaces"),l.delete_variable("spacePer"),l.delete_variable("extraSpaces"),l.record("justify_line","Distribute the spaces, extra ones go to the left gaps first")}c.push(h);for(let e=0;e<h.length;e++){let t=h[e];l.add_new_visual(`line_${d}_${e}`,{type:"arrayElement",value:" "===t?"\xb7":t,position:e,state:" "===t?"space":"char"})}for(let t=e;t<o;t++)s(t,"placed");l.delete_visual("range_line"),l.delete_variable("lineStart"),l.delete_variable("lineLength"),l.record("add_line",`Line ${d+1} added: "${h}"`),d++}return l.record("complete",`Done! ${r} words justified into ${d} lines of width ${i}`),l.getSteps()
}

export function TextJustificationProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TextJustificationTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTextJustificationSteps(e) as any[];
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
      title="Text Justification"
      slug="text-justification"
      approaches={approaches}
      presets={TextJustificationPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Word Abbreviation (valid-word-abbreviation)
// ==========================================

const ValidWordAbbreviationTemplates = {
  "python": {
    "language": "python",
    "code": "def validWordAbbreviation(word, abbr):\n    i = 0  # pointer for word\n    j = 0  # pointer for abbreviation\n\n    while i < len(word) and j < len(abbr):\n        if abbr[j].isdigit():\n            # Leading zero is not allowed\n            if abbr[j] == '0':\n                return False\n\n            # Parse the full number\n            num = 0\n            while j < len(abbr) and abbr[j].isdigit():\n                num = num * 10 + int(abbr[j])\n                j += 1\n            # Skip that many characters in word\n            i += num\n        else:\n            # Letters must match exactly\n            if word[i] != abbr[j]:\n                return False\n            i += 1\n            j += 1\n\n    # Both pointers must reach the end\n    return i == len(word) and j == len(abbr)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "leading_zero": [
        8
      ],
      "parse_num": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "skip": [
        17
      ],
      "match": [
        20,
        21,
        22,
        23
      ],
      "mismatch": [
        20
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_digit": [
        6
      ],
      "is_zero": [
        8
      ],
      "chars_not_equal": [
        20
      ],
      "ends_match": [
        26
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean validWordAbbreviation(String word, String abbr) {\n    int i = 0; // pointer for word\n    int j = 0; // pointer for abbreviation\n\n    while (i < word.length() && j < abbr.length()) {\n        if (Character.isDigit(abbr.charAt(j))) {\n            // Leading zero is not allowed\n            if (abbr.charAt(j) == '0') return false;\n\n            // Parse the full number\n            int num = 0;\n            while (j < abbr.length() && Character.isDigit(abbr.charAt(j))) {\n                num = num * 10 + (abbr.charAt(j) - '0');\n                j++;\n            }\n            // Skip that many characters in word\n            i += num;\n        } else {\n            // Letters must match exactly\n            if (word.charAt(i) != abbr.charAt(j)) return false;\n            i++;\n            j++;\n        }\n    }\n\n    // Both pointers must reach the end\n    return i == word.length() && j == abbr.length();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "leading_zero": [
        8
      ],
      "parse_num": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "skip": [
        17
      ],
      "match": [
        20,
        21,
        22
      ],
      "mismatch": [
        20
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_digit": [
        6
      ],
      "is_zero": [
        8
      ],
      "chars_not_equal": [
        20
      ],
      "ends_match": [
        27
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool validWordAbbreviation(string word, string abbr) {\n    int i = 0; // pointer for word\n    int j = 0; // pointer for abbreviation\n\n    while (i < (int)word.size() && j < (int)abbr.size()) {\n        if (isdigit(abbr[j])) {\n            // Leading zero is not allowed\n            if (abbr[j] == '0') return false;\n\n            // Parse the full number\n            int num = 0;\n            while (j < (int)abbr.size() && isdigit(abbr[j])) {\n                num = num * 10 + (abbr[j] - '0');\n                j++;\n            }\n            // Skip that many characters in word\n            i += num;\n        } else {\n            // Letters must match exactly\n            if (word[i] != abbr[j]) return false;\n            i++;\n            j++;\n        }\n    }\n\n    // Both pointers must reach the end\n    return i == (int)word.size() && j == (int)abbr.size();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "leading_zero": [
        8
      ],
      "parse_num": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "skip": [
        17
      ],
      "match": [
        20,
        21,
        22
      ],
      "mismatch": [
        20
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_digit": [
        6
      ],
      "is_zero": [
        8
      ],
      "chars_not_equal": [
        20
      ],
      "ends_match": [
        27
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool ValidWordAbbreviation(string word, string abbr) {\n    int i = 0; // pointer for word\n    int j = 0; // pointer for abbreviation\n\n    while (i < word.Length && j < abbr.Length) {\n        if (char.IsDigit(abbr[j])) {\n            // Leading zero is not allowed\n            if (abbr[j] == '0') return false;\n\n            // Parse the full number\n            int num = 0;\n            while (j < abbr.Length && char.IsDigit(abbr[j])) {\n                num = num * 10 + (abbr[j] - '0');\n                j++;\n            }\n            // Skip that many characters in word\n            i += num;\n        } else {\n            // Letters must match exactly\n            if (word[i] != abbr[j]) return false;\n            i++;\n            j++;\n        }\n    }\n\n    // Both pointers must reach the end\n    return i == word.Length && j == abbr.Length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "leading_zero": [
        8
      ],
      "parse_num": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "skip": [
        17
      ],
      "match": [
        20,
        21,
        22
      ],
      "mismatch": [
        20
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_digit": [
        6
      ],
      "is_zero": [
        8
      ],
      "chars_not_equal": [
        20
      ],
      "ends_match": [
        27
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func validWordAbbreviation(word string, abbr string) bool {\n    i := 0 // pointer for word\n    j := 0 // pointer for abbreviation\n\n    for i < len(word) && j < len(abbr) {\n        if abbr[j] >= '0' && abbr[j] <= '9' {\n            // Leading zero is not allowed\n            if abbr[j] == '0' {\n                return false\n            }\n\n            // Parse the full number\n            num := 0\n            for j < len(abbr) && abbr[j] >= '0' && abbr[j] <= '9' {\n                num = num*10 + int(abbr[j]-'0')\n                j++\n            }\n            // Skip that many characters in word\n            i += num\n        } else {\n            // Letters must match exactly\n            if word[i] != abbr[j] {\n                return false\n            }\n            i++\n            j++\n        }\n    }\n\n    // Both pointers must reach the end\n    return i == len(word) && j == len(abbr)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "leading_zero": [
        8
      ],
      "parse_num": [
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "skip": [
        19
      ],
      "match": [
        22,
        23,
        24,
        25,
        26
      ],
      "mismatch": [
        22
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_digit": [
        6
      ],
      "is_zero": [
        8
      ],
      "chars_not_equal": [
        22
      ],
      "ends_match": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function validWordAbbreviation(word, abbr) {\n  let i = 0; // pointer for word\n  let j = 0; // pointer for abbreviation\n\n  while (i < word.length && j < abbr.length) {\n    if (abbr[j] >= \"0\" && abbr[j] <= \"9\") {\n      // Leading zero is not allowed\n      if (abbr[j] === \"0\") return false;\n\n      // Parse the full number\n      let num = 0;\n      while (j < abbr.length && abbr[j] >= \"0\" && abbr[j] <= \"9\") {\n        num = num * 10 + Number(abbr[j]);\n        j++;\n      }\n      // Skip that many characters in word\n      i += num;\n    } else {\n      // Letters must match exactly\n      if (word[i] !== abbr[j]) return false;\n      i++;\n      j++;\n    }\n  }\n\n  // Both pointers must reach the end\n  return i === word.length && j === abbr.length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "leading_zero": [
        8
      ],
      "parse_num": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "skip": [
        17
      ],
      "match": [
        20,
        21,
        22
      ],
      "mismatch": [
        20
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_digit": [
        6
      ],
      "is_zero": [
        8
      ],
      "chars_not_equal": [
        20
      ],
      "ends_match": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function validWordAbbreviation(word: string, abbr: string): boolean {\n    let i = 0; // pointer for word\n    let j = 0; // pointer for abbreviation\n\n    while (i < word.length && j < abbr.length) {\n        if (abbr[j] >= \"0\" && abbr[j] <= \"9\") {\n            // Leading zero is not allowed\n            if (abbr[j] === \"0\") return false;\n\n            // Parse the full number\n            let num = 0;\n            while (j < abbr.length && abbr[j] >= \"0\" && abbr[j] <= \"9\") {\n                num = num * 10 + Number(abbr[j]);\n                j++;\n            }\n            // Skip that many characters in word\n            i += num;\n        } else {\n            // Letters must match exactly\n            if (word[i] !== abbr[j]) return false;\n            i++;\n            j++;\n        }\n    }\n\n    // Both pointers must reach the end\n    return i === word.length && j === abbr.length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "leading_zero": [
        8
      ],
      "parse_num": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "skip": [
        17
      ],
      "match": [
        20,
        21,
        22
      ],
      "mismatch": [
        20
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_digit": [
        6
      ],
      "is_zero": [
        8
      ],
      "chars_not_equal": [
        20
      ],
      "ends_match": [
        27
      ]
    }
  }
};

const ValidWordAbbreviationPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid (i12iz4n)",
    "value": {
      "word": "internationalization",
      "abbr": "i12iz4n"
    }
  },
  {
    "id": "ex2",
    "label": "Invalid (a2e)",
    "value": {
      "word": "apple",
      "abbr": "a2e"
    }
  },
  {
    "id": "ex3",
    "label": "Valid (s10n)",
    "value": {
      "word": "substitution",
      "abbr": "s10n"
    }
  }
];

function generateValidWordAbbreviationSteps(e: any): any[] {
  let t=e.word,r=e.abbr,i=t.length,n=r.length,l={};for(let e=0;e<n;e++)l[`abbr_${e}`]={type:"arrayElement",value:r[e],position:e};for(let e=0;e<i;e++)l[`word_${e}`]={type:"arrayElement",value:t[e],position:e};let o=new StepRecorder({word:t,abbr:r},{...l}),d=e=>o.update_variable("exprParts",e),s=e=>e>="0"&&e<="9";o.record("-",`Is "${r}" a valid abbreviation of "${t}"?`),o.update_variable("phase","generate"),d([{t:"expand ",c:"muted"},{t:`"${r}"`,c:"yellow"},{t:"  →  letters stay, numbers become wildcards",c:"muted"}]),o.record("init","Build the string the abbreviation represents");let c=[],h=(e,t)=>{let r=c.length;c.push({ch:e,wild:t}),o.update_visual(`exp_${r}`,{type:"arrayElement",value:e,position:r,state:t?"wild":"letter"})},u=0;for(;u<n;){let e=r[u];if(o.update_variable("genJ",u),!s(e)){o.add_conditional("is_letter",!0),h(e,!1),o.update_visual(`abbr_${u}`,{type:"arrayElement",value:e,position:u,state:"used"}),u++,d([{t:`'${e}'`,c:"green"},{t:" is a letter, copied as-is",c:"muted"}]),o.record("gen_letter",`Letter '${e}' is copied as-is`);continue}if(o.add_conditional("is_letter",!1),"0"===e)return o.add_conditional("is_zero",!0),o.update_visual(`abbr_${u}`,{type:"arrayElement",value:e,position:u,state:"bad"}),o.update_variable("verdict","leading_zero"),d([]),o.record("leading_zero",`abbr[${u}] = '0': a number cannot have a leading zero, return false`),o.getSteps();o.add_conditional("is_zero",!1);let t=0;for(;u<n&&s(r[u]);){o.add_conditional("more_digits",!0);let e=t,a=r[u];t=10*t+(a.charCodeAt(0)-48),o.update_visual(`abbr_${u}`,{type:"arrayElement",value:a,position:u,state:"parsing"}),o.update_variable("genJ",u),u++,d([{t:"num = ",c:"muted"},{t:String(e),c:"yellow"},{t:" * 10 + ",c:"muted"},{t:a,c:"yellow"},{t:" = ",c:"muted"},{t:String(t),c:"yellow"}]),o.record("gen_digit",`abbr[${u-1}] = '${a}': num = ${t}`)}o.add_conditional("more_digits",!1);for(let e=0;e<t;e++)h("*",!0);o.update_variable("genJ",Math.min(u,n-1)),d([{t:String(t),c:"yellow"},{t:`  →  ${t} wildcard${1===t?"":"s"} in the expansion`,c:"muted"}]),o.record("gen_wild",`Number ${t} becomes ${t} wildcard${1===t?"":"s"}`)}o.update_variable("phase","compare");let b=c.length,p=b===i;if(o.add_conditional("length_ok",p),!p)return o.update_variable("verdict","length_mismatch"),d([]),o.record("length_check",`expanded length ${b} != word length ${i}: return false`),o.getSteps();d([{t:`expanded length ${b}`,c:"green"},{t:" == ",c:"muted"},{t:`word length ${i}`,c:"green"},{t:"  →  compare each position",c:"muted"}]),o.record("length_check",`expanded length ${b} == word length ${i}, compare each position`);for(let e=0;e<i;e++){o.update_variable("cmpIdx",e);let r=c[e];if(r.wild)o.update_visual(`exp_${e}`,{type:"arrayElement",value:"*",position:e,state:"matched"}),o.update_visual(`word_${e}`,{type:"arrayElement",value:t[e],position:e,state:"matched"}),d([{t:`expanded[${e}] = '*'`,c:"muted"},{t:"  →  matches any letter",c:"green"}]),o.record("compare_char",`expanded[${e}] is a wildcard, matches word[${e}] = '${t[e]}'`);else{if(r.ch!==t[e])return o.add_conditional("char_match",!1),o.update_visual(`exp_${e}`,{type:"arrayElement",value:r.ch,position:e,state:"bad"}),o.update_visual(`word_${e}`,{type:"arrayElement",value:t[e],position:e,state:"bad"}),o.update_variable("verdict","mismatch"),d([]),o.record("mismatch",`expanded[${e}] = '${r.ch}' != word[${e}] = '${t[e]}': return false`),o.getSteps();o.add_conditional("char_match",!0),o.update_visual(`exp_${e}`,{type:"arrayElement",value:r.ch,position:e,state:"matched"}),o.update_visual(`word_${e}`,{type:"arrayElement",value:t[e],position:e,state:"matched"}),d([{t:`'${r.ch}'`,c:"green"},{t:" == ",c:"muted"},{t:`'${t[e]}'`,c:"green"}]),o.record("compare_char",`expanded[${e}] = '${r.ch}' == word[${e}] = '${t[e]}'`)}}return o.delete_variable("cmpIdx"),o.update_variable("verdict","valid"),d([]),o.record("complete","Every position matches: return true"),o.getSteps()
}

export function ValidWordAbbreviationProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidWordAbbreviationTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidWordAbbreviationSteps(e) as any[];
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
      title="Valid Word Abbreviation"
      slug="valid-word-abbreviation"
      approaches={approaches}
      presets={ValidWordAbbreviationPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Words Within Two Edits of Dictionary (words-within-two-edits-of-dictionary)
// ==========================================

const WordsWithinTwoEditsOfDictionaryTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def twoEditWords(self, queries: list[str], dictionary: list[str]) -> list[str]:\n        # Build Trie as nested dictionaries\n        root = {}\n        for word in dictionary:\n            node = root\n            for ch in word:\n                if ch not in node:\n                    node[ch] = {}\n                node = node[ch]\n\n        def dfs(node, query, depth, edits):\n            if edits > 2:\n                return False\n            if depth == len(query):\n                return True\n            # Try all children of current node\n            for ch, child in node.items():\n                new_edits = edits + (0 if ch == query[depth] else 1)\n                if dfs(child, query, depth + 1, new_edits):\n                    return True\n            return False\n\n        result = []\n        for query in queries:\n            if dfs(root, query, 0, 0):\n                result.append(query)\n        return result",
    "lineMap": {
      "-": [
        2,
        4
      ],
      "insert_word": [
        5,
        6
      ],
      "insert_char": [
        10
      ],
      "create_node": [
        8,
        9,
        10
      ],
      "start_query": [
        24,
        25
      ],
      "query_word": [
        25,
        26
      ],
      "check_pruned": [
        13,
        14
      ],
      "check_complete": [
        15,
        16
      ],
      "start_dfs": [
        18
      ],
      "match_char": [
        19
      ],
      "edit_char": [
        19
      ],
      "found_match": [
        20,
        21
      ],
      "backtrack": [
        18
      ],
      "no_match": [
        22
      ],
      "add_result": [
        26,
        27
      ],
      "skip_query": [
        26
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "char_missing": [
        8
      ],
      "edits_exceeded": [
        13
      ],
      "is_complete": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    // Trie node with 26 children\n    private int[][] trie;\n    private int trieIdx;\n\n    public List<String> twoEditWords(String[] queries, String[] dictionary) {\n        int n = dictionary[0].length();\n        // Max nodes: dictionary.length * word_length + 1 for root\n        trie = new int[dictionary.length * n + 1][26];\n        for (int[] row : trie) Arrays.fill(row, -1);\n        trieIdx = 0;\n\n        // Build Trie from dictionary\n        for (String word : dictionary) {\n            int node = 0;\n            for (int i = 0; i < word.length(); i++) {\n                int c = word.charAt(i) - 'a';\n                if (trie[node][c] == -1) {\n                    trie[node][c] = ++trieIdx;\n                }\n                node = trie[node][c];\n            }\n        }\n\n        List<String> result = new ArrayList<>();\n        for (String query : queries) {\n            if (dfs(query, 0, 0, 0)) {\n                result.add(query);\n            }\n        }\n        return result;\n    }\n\n    private boolean dfs(String query, int node, int depth, int edits) {\n        if (edits > 2) return false;\n        if (depth == query.length()) return true;\n\n        int queryChar = query.charAt(depth) - 'a';\n        for (int c = 0; c < 26; c++) {\n            if (trie[node][c] == -1) continue;\n            int newEdits = edits + (c == queryChar ? 0 : 1);\n            if (dfs(query, trie[node][c], depth + 1, newEdits)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        9,
        10,
        11
      ],
      "insert_word": [
        14,
        15
      ],
      "insert_char": [
        21
      ],
      "create_node": [
        18,
        19,
        20,
        21
      ],
      "start_query": [
        25,
        26
      ],
      "query_word": [
        26,
        27
      ],
      "check_pruned": [
        35
      ],
      "check_complete": [
        36
      ],
      "start_dfs": [
        38,
        39
      ],
      "match_char": [
        41
      ],
      "edit_char": [
        41
      ],
      "found_match": [
        42,
        43
      ],
      "backtrack": [
        39
      ],
      "no_match": [
        46
      ],
      "add_result": [
        27,
        28
      ],
      "skip_query": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "char_missing": [
        18
      ],
      "edits_exceeded": [
        35
      ],
      "is_complete": [
        36
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    struct TrieNode {\n        int children[26];\n        TrieNode() { fill(children, children + 26, -1); }\n    };\n\n    vector<TrieNode> nodes;\n\n    vector<string> twoEditWords(vector<string>& queries, vector<string>& dictionary) {\n        // Build Trie\n        nodes.push_back(TrieNode()); // root\n        for (auto& word : dictionary) {\n            int node = 0;\n            for (char c : word) {\n                int idx = c - 'a';\n                if (nodes[node].children[idx] == -1) {\n                    nodes[node].children[idx] = nodes.size();\n                    nodes.push_back(TrieNode());\n                }\n                node = nodes[node].children[idx];\n            }\n        }\n\n        vector<string> result;\n        for (auto& query : queries) {\n            if (dfs(query, 0, 0, 0)) {\n                result.push_back(query);\n            }\n        }\n        return result;\n    }\n\n    bool dfs(string& query, int node, int depth, int edits) {\n        if (edits > 2) return false;\n        if (depth == (int)query.size()) return true;\n\n        int queryChar = query[depth] - 'a';\n        for (int c = 0; c < 26; c++) {\n            if (nodes[node].children[c] == -1) continue;\n            int newEdits = edits + (c == queryChar ? 0 : 1);\n            if (dfs(query, nodes[node].children[c], depth + 1, newEdits)) {\n                return true;\n            }\n        }\n        return false;\n    }\n};",
    "lineMap": {
      "-": [
        10,
        12
      ],
      "insert_word": [
        13,
        14
      ],
      "insert_char": [
        21
      ],
      "create_node": [
        17,
        18,
        19,
        20,
        21
      ],
      "start_query": [
        25,
        26
      ],
      "query_word": [
        26,
        27
      ],
      "check_pruned": [
        35
      ],
      "check_complete": [
        36
      ],
      "start_dfs": [
        38,
        39
      ],
      "match_char": [
        41
      ],
      "edit_char": [
        41
      ],
      "found_match": [
        42,
        43
      ],
      "backtrack": [
        39
      ],
      "no_match": [
        46
      ],
      "add_result": [
        27,
        28
      ],
      "skip_query": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "char_missing": [
        17
      ],
      "edits_exceeded": [
        35
      ],
      "is_complete": [
        36
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int[][] trie;\n    private int trieIdx;\n\n    public IList<string> TwoEditWords(string[] queries, string[] dictionary) {\n        int n = dictionary[0].Length;\n        trie = new int[dictionary.Length * n + 1][];\n        for (int i = 0; i < trie.Length; i++) {\n            trie[i] = new int[26];\n            Array.Fill(trie[i], -1);\n        }\n        trieIdx = 0;\n\n        // Build Trie from dictionary\n        foreach (string word in dictionary) {\n            int node = 0;\n            foreach (char ch in word) {\n                int c = ch - 'a';\n                if (trie[node][c] == -1) {\n                    trie[node][c] = ++trieIdx;\n                }\n                node = trie[node][c];\n            }\n        }\n\n        List<string> result = new List<string>();\n        foreach (string query in queries) {\n            if (Dfs(query, 0, 0, 0)) {\n                result.Add(query);\n            }\n        }\n        return result;\n    }\n\n    private bool Dfs(string query, int node, int depth, int edits) {\n        if (edits > 2) return false;\n        if (depth == query.Length) return true;\n\n        int queryChar = query[depth] - 'a';\n        for (int c = 0; c < 26; c++) {\n            if (trie[node][c] == -1) continue;\n            int newEdits = edits + (c == queryChar ? 0 : 1);\n            if (Dfs(query, trie[node][c], depth + 1, newEdits)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        5,
        7,
        12
      ],
      "insert_word": [
        15,
        16
      ],
      "insert_char": [
        22
      ],
      "create_node": [
        19,
        20,
        21,
        22
      ],
      "start_query": [
        26,
        27
      ],
      "query_word": [
        27,
        28
      ],
      "check_pruned": [
        36
      ],
      "check_complete": [
        37
      ],
      "start_dfs": [
        39,
        40
      ],
      "match_char": [
        42
      ],
      "edit_char": [
        42
      ],
      "found_match": [
        43,
        44
      ],
      "backtrack": [
        40
      ],
      "no_match": [
        47
      ],
      "add_result": [
        28,
        29
      ],
      "skip_query": [
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "char_missing": [
        19
      ],
      "edits_exceeded": [
        36
      ],
      "is_complete": [
        37
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func twoEditWords(queries []string, dictionary []string) []string {\n    // Build Trie as slice of [26]int arrays\n    type TrieNode [26]int\n    nodes := []TrieNode{{}}\n    // Initialize root children to -1\n    for i := 0; i < 26; i++ {\n        nodes[0][i] = -1\n    }\n\n    for _, word := range dictionary {\n        node := 0\n        for _, c := range word {\n            idx := int(c - 'a')\n            if nodes[node][idx] == -1 {\n                newNode := TrieNode{}\n                for i := 0; i < 26; i++ {\n                    newNode[i] = -1\n                }\n                nodes[node][idx] = len(nodes)\n                nodes = append(nodes, newNode)\n            }\n            node = nodes[node][idx]\n        }\n    }\n\n    var dfs func(query string, node, depth, edits int) bool\n    dfs = func(query string, node, depth, edits int) bool {\n        if edits > 2 {\n            return false\n        }\n        if depth == len(query) {\n            return true\n        }\n        queryChar := int(query[depth] - 'a')\n        for c := 0; c < 26; c++ {\n            if nodes[node][c] == -1 {\n                continue\n            }\n            newEdits := edits\n            if c != queryChar {\n                newEdits++\n            }\n            if dfs(query, nodes[node][c], depth+1, newEdits) {\n                return true\n            }\n        }\n        return false\n    }\n\n    result := []string{}\n    for _, query := range queries {\n        if dfs(query, 0, 0, 0) {\n            result = append(result, query)\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1,
        4
      ],
      "insert_word": [
        10,
        11
      ],
      "insert_char": [
        22
      ],
      "create_node": [
        14,
        19,
        20,
        22
      ],
      "start_query": [
        50,
        51
      ],
      "query_word": [
        51,
        52
      ],
      "check_pruned": [
        28,
        29
      ],
      "check_complete": [
        31,
        32
      ],
      "start_dfs": [
        34,
        35
      ],
      "match_char": [
        39,
        40
      ],
      "edit_char": [
        39,
        40,
        41
      ],
      "found_match": [
        43,
        44
      ],
      "backtrack": [
        35
      ],
      "no_match": [
        47
      ],
      "add_result": [
        52,
        53
      ],
      "skip_query": [
        52
      ],
      "complete": [
        56
      ]
    },
    "conditionalMap": {
      "char_missing": [
        14
      ],
      "edits_exceeded": [
        28
      ],
      "is_complete": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var twoEditWords = function(queries, dictionary) {\n    // Build Trie as object tree\n    var root = {};\n\n    for (var d = 0; d < dictionary.length; d++) {\n        var node = root;\n        for (var i = 0; i < dictionary[d].length; i++) {\n            var ch = dictionary[d][i];\n            if (!node[ch]) node[ch] = {};\n            node = node[ch];\n        }\n    }\n\n    function dfs(node, query, depth, edits) {\n        if (edits > 2) return false;\n        if (depth === query.length) return true;\n        // Try all children\n        var keys = Object.keys(node);\n        for (var k = 0; k < keys.length; k++) {\n            var ch = keys[k];\n            var newEdits = edits + (ch === query[depth] ? 0 : 1);\n            if (dfs(node[ch], query, depth + 1, newEdits)) {\n                return true;\n            }\n        }\n        return false;\n    }\n\n    var result = [];\n    for (var q = 0; q < queries.length; q++) {\n        if (dfs(root, queries[q], 0, 0)) {\n            result.push(queries[q]);\n        }\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "insert_word": [
        5,
        6
      ],
      "insert_char": [
        10
      ],
      "create_node": [
        9,
        10
      ],
      "start_query": [
        29,
        30
      ],
      "query_word": [
        30,
        31
      ],
      "check_pruned": [
        15
      ],
      "check_complete": [
        16
      ],
      "start_dfs": [
        18,
        19
      ],
      "match_char": [
        20,
        21
      ],
      "edit_char": [
        20,
        21
      ],
      "found_match": [
        22,
        23
      ],
      "backtrack": [
        19
      ],
      "no_match": [
        26
      ],
      "add_result": [
        31,
        32
      ],
      "skip_query": [
        31
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "char_missing": [
        9
      ],
      "edits_exceeded": [
        15
      ],
      "is_complete": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function twoEditWords(queries: string[], dictionary: string[]): string[] {\n    // Build Trie as nested Maps\n    type TrieNode = Map<string, TrieNode>;\n    const root: TrieNode = new Map();\n\n    for (const word of dictionary) {\n        let node = root;\n        for (const ch of word) {\n            if (!node.has(ch)) node.set(ch, new Map());\n            node = node.get(ch)!;\n        }\n    }\n\n    function dfs(node: TrieNode, query: string, depth: number, edits: number): boolean {\n        if (edits > 2) return false;\n        if (depth === query.length) return true;\n        for (const [ch, child] of node) {\n            const newEdits = edits + (ch === query[depth] ? 0 : 1);\n            if (dfs(child, query, depth + 1, newEdits)) {\n                return true;\n            }\n        }\n        return false;\n    }\n\n    const result: string[] = [];\n    for (const query of queries) {\n        if (dfs(root, query, 0, 0)) {\n            result.push(query);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1,
        4
      ],
      "insert_word": [
        6,
        7
      ],
      "insert_char": [
        10
      ],
      "create_node": [
        9,
        10
      ],
      "start_query": [
        26,
        27
      ],
      "query_word": [
        27,
        28
      ],
      "check_pruned": [
        15
      ],
      "check_complete": [
        16
      ],
      "start_dfs": [
        17
      ],
      "match_char": [
        18
      ],
      "edit_char": [
        18
      ],
      "found_match": [
        19,
        20
      ],
      "backtrack": [
        17
      ],
      "no_match": [
        23
      ],
      "add_result": [
        28,
        29
      ],
      "skip_query": [
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "char_missing": [
        9
      ],
      "edits_exceeded": [
        15
      ],
      "is_complete": [
        16
      ]
    }
  }
};

const WordsWithinTwoEditsOfDictionaryPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "queries": [
        "word",
        "note",
        "ants",
        "wood"
      ],
      "dictionary": [
        "wood",
        "joke",
        "moat"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "queries": [
        "yes"
      ],
      "dictionary": [
        "not"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "queries": [
        "cat",
        "bat",
        "rat"
      ],
      "dictionary": [
        "car",
        "bar",
        "tar"
      ]
    }
  }
];

function generateWordsWithinTwoEditsOfDictionarySteps(e: any): any[] {
  let t=e.queries||[],r=e.dictionary||[],a=new RecursiveStepRecorder({},{});a.add_new_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"}),a.add_new_visual("meta_query",{type:"metadata",value:""}),a.add_new_visual("meta_edits",{type:"metadata",value:0}),a.add_new_visual("meta_result",{type:"metadata",value:[]}),a.add_new_visual("meta_phase",{type:"metadata",value:"Build Trie"}),a.record("-","Start: Build trie from dictionary, then query with edit budget of 2");let s=0,n=new Map;n.set("","trie_root");let o=new Map;function d(){n.forEach(e=>{let t=o.get(e);t&&a.update_visual(e,{type:"trieNode",char:t.char,isEndOfWord:t.isEndOfWord,parent:t.parent,edgeLabel:t.edgeLabel,state:"standard"})})}function l(e,t){let r=o.get(e);r&&a.update_visual(e,{type:"trieNode",char:r.char,isEndOfWord:r.isEndOfWord,parent:r.parent,edgeLabel:r.edgeLabel,state:t})}o.set("trie_root",{char:"*",isEndOfWord:!1}),a.update_visual("meta_phase",{type:"metadata",value:"Build Trie"}),a.record("-","Phase 1: Insert dictionary words into Trie");for(let e=0;e<r.length;e++){let t=r[e],i="",c="trie_root";a.pushCallFrame({word:t},"insert"),l(c,"active"),a.record("insert_word",`Insert word "${t}" - start at root`);for(let e=0;e<t.length;e++){let r=t[e],d=i+r,u=n.has(d);if(a.add_conditional("char_missing",!u),u)l(c,"visited"),l(c=n.get(d),"active"),i=d,a.record("insert_char",`Character '${r}' already exists, traverse`);else{s++;let e=`trie_${s}`,t=n.get(i),u={char:r,isEndOfWord:!1,parent:t,edgeLabel:r};o.set(e,u),a.add_new_visual(e,{type:"trieNode",char:r,isEndOfWord:!1,parent:t,edgeLabel:r,state:"highlight"}),n.set(d,e),l(c,"visited"),c=e,i=d,a.record("create_node",`Create new node for '${r}'`),l(c,"active")}}let u=o.get(c);u.isEndOfWord=!0,o.set(c,u),a.popCallFrame(),d()}a.update_visual("meta_phase",{type:"metadata",value:"Query Words"});let c=[];a.record("start_query","Phase 2: For each query, DFS through trie with edit budget of 2");for(let e=0;e<t.length;e++){let r=t[e];a.update_visual("meta_query",{type:"metadata",value:r}),a.update_visual("meta_edits",{type:"metadata",value:0}),d(),a.record("query_word",`Query: "${r}" - search trie with up to 2 edits allowed`);!function e(t,i,s){if(a.pushCallFrame({node:t,depth:i,edits:s},"dfs"),a.add_conditional("edits_exceeded",s>2),a.update_visual("meta_edits",{type:"metadata",value:s}),s>2)return l(t,"error"),a.record("check_pruned",`Edits = ${s} > 2, prune this branch`),l(t,"standard"),a.popCallFrame(),!1;if(a.add_conditional("is_complete",i===r.length),i===r.length)return l(t,"result"),a.record("check_complete",`Depth ${i} = word length ${r.length}, match found with ${s} edits!`),a.popCallFrame(),!0;l(t,"active"),a.record("start_dfs",`DFS at depth ${i}, edits = ${s}, looking for '${r[i]}'`);let o=r[i],d=function(e){let t="";return n.forEach((r,i)=>{r===e&&(t=i)}),t}(t),c=[];for(let r of(n.forEach((e,r)=>{r.length===d.length+1&&r.startsWith(d)&&e!==t&&c.push({char:r[r.length-1],childKey:e,childPath:r})}),c)){let n=r.char===o,d=s+ +!n;if(n?(l(r.childKey,"active"),a.record("match_char",`Child '${r.char}' matches query[${i}]='${o}', edits stays ${s}`)):(l(r.childKey,"highlight"),a.record("edit_char",`Child '${r.char}' != query[${i}]='${o}', edits: ${s} -> ${d}`)),e(r.childKey,i+1,d))return l(r.childKey,"result"),a.record("found_match",`Match found through child '${r.char}'`),l(t,"result"),a.popCallFrame(),!0;l(r.childKey,"visited"),a.record("backtrack",`Backtrack from child '${r.char}' - no match in this subtree`)}return a.record("no_match",0===c.length?`No children to explore at depth ${i}`:`No child matched at depth ${i}, return false`),l(t,"visited"),a.popCallFrame(),!1}("trie_root",0,0)?a.record("skip_query",`"${r}" does NOT match any dictionary word within 2 edits`):(c.push(r),a.update_visual("meta_result",{type:"metadata",value:[...c]}),a.record("add_result",`"${r}" matches within 2 edits - add to result`)),d()}return a.update_visual("meta_phase",{type:"metadata",value:"Complete"}),a.update_visual("meta_query",{type:"metadata",value:""}),a.record("complete",`Done! Result: [${c.map(e=>`"${e}"`).join(", ")}]`),a.getSteps()
}

export function WordsWithinTwoEditsOfDictionaryProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: WordsWithinTwoEditsOfDictionaryTemplates,
      generateSteps: (e: any) => {
        const recorded = generateWordsWithinTwoEditsOfDictionarySteps(e) as any[];
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
      title="Words Within Two Edits of Dictionary"
      slug="words-within-two-edits-of-dictionary"
      approaches={approaches}
      presets={WordsWithinTwoEditsOfDictionaryPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Z Algorithm (z-algorithm)
// ==========================================

const ZAlgorithmTemplates = {
  "python": {
    "language": "python",
    "code": "def z_search(text: str, pattern: str) -> list[int]:\n    concat = pattern + \"$\" + text\n    n = len(concat)\n    m = len(pattern)\n    z = [0] * n\n\n    l, r = 0, 0\n    for i in range(1, n):\n        if i < r:\n            z[i] = min(r - i, z[i - l])\n        while i + z[i] < n and concat[z[i]] == concat[i + z[i]]:\n            z[i] += 1\n        if i + z[i] > r:\n            l, r = i, i + z[i]\n\n    return [i - m - 1 for i in range(m + 1, n) if z[i] >= m]",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5
      ],
      "build_z": [
        7,
        8,
        9
      ],
      "use_z_box": [
        10
      ],
      "extend_z": [
        11,
        12,
        13
      ],
      "match_found": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "in_z_box": [
        9
      ],
      "is_match": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> zSearch(String text, String pattern) {\n    String concat = pattern + \"$\" + text;\n    int n = concat.length(), m = pattern.length();\n    int[] z = new int[n];\n    List<Integer> matches = new ArrayList<>();\n\n    int l = 0, r = 0;\n    for (int i = 1; i < n; i++) {\n        if (i < r) z[i] = Math.min(r - i, z[i - l]);\n        while (i + z[i] < n && concat.charAt(z[i]) == concat.charAt(i + z[i]))\n            z[i]++;\n        if (i + z[i] > r) { l = i; r = i + z[i]; }\n        if (z[i] >= m) matches.add(i - m - 1);\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "build_z": [
        7,
        8,
        9
      ],
      "use_z_box": [
        9
      ],
      "extend_z": [
        10,
        11,
        12
      ],
      "match_found": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "in_z_box": [
        9
      ],
      "is_match": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> zSearch(string text, string pattern) {\n    string concat = pattern + \"$\" + text;\n    int n = concat.size(), m = pattern.size();\n    vector<int> z(n, 0), matches;\n\n    int l = 0, r = 0;\n    for (int i = 1; i < n; i++) {\n        if (i < r) z[i] = min(r - i, z[i - l]);\n        while (i + z[i] < n && concat[z[i]] == concat[i + z[i]])\n            z[i]++;\n        if (i + z[i] > r) { l = i; r = i + z[i]; }\n        if (z[i] >= m) matches.push_back(i - m - 1);\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "build_z": [
        6,
        7,
        8
      ],
      "use_z_box": [
        8
      ],
      "extend_z": [
        9,
        10,
        11
      ],
      "match_found": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "in_z_box": [
        8
      ],
      "is_match": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public List<int> ZSearch(string text, string pattern) {\n    string concat = pattern + \"$\" + text;\n    int n = concat.Length, m = pattern.Length;\n    int[] z = new int[n];\n    var matches = new List<int>();\n\n    int l = 0, r = 0;\n    for (int i = 1; i < n; i++) {\n        if (i < r) z[i] = Math.Min(r - i, z[i - l]);\n        while (i + z[i] < n && concat[z[i]] == concat[i + z[i]])\n            z[i]++;\n        if (i + z[i] > r) { l = i; r = i + z[i]; }\n        if (z[i] >= m) matches.Add(i - m - 1);\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "build_z": [
        7,
        8,
        9
      ],
      "use_z_box": [
        9
      ],
      "extend_z": [
        10,
        11,
        12
      ],
      "match_found": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "in_z_box": [
        9
      ],
      "is_match": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func zSearch(text, pattern string) []int {\n    concat := pattern + \"$\" + text\n    n, m := len(concat), len(pattern)\n    z := make([]int, n)\n    matches := []int{}\n\n    l, r := 0, 0\n    for i := 1; i < n; i++ {\n        if i < r {\n            if z[i-l] < r-i {\n                z[i] = z[i-l]\n            } else {\n                z[i] = r - i\n            }\n        }\n        for i+z[i] < n && concat[z[i]] == concat[i+z[i]] {\n            z[i]++\n        }\n        if i+z[i] > r {\n            l, r = i, i+z[i]\n        }\n        if z[i] >= m {\n            matches = append(matches, i-m-1)\n        }\n    }\n    return matches\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "build_z": [
        7,
        8,
        9
      ],
      "use_z_box": [
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "extend_z": [
        15,
        16,
        17,
        18,
        19
      ],
      "match_found": [
        22,
        23,
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "in_z_box": [
        9
      ],
      "is_match": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function zSearch(text, pattern) {\n    const concat = pattern + \"$\" + text;\n    const n = concat.length, m = pattern.length;\n    const z = new Array(n).fill(0);\n    const matches = [];\n\n    let l = 0, r = 0;\n    for (let i = 1; i < n; i++) {\n        if (i < r) z[i] = Math.min(r - i, z[i - l]);\n        while (i + z[i] < n && concat[z[i]] === concat[i + z[i]])\n            z[i]++;\n        if (i + z[i] > r) { l = i; r = i + z[i]; }\n        if (z[i] >= m) matches.push(i - m - 1);\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "build_z": [
        7,
        8,
        9
      ],
      "use_z_box": [
        9
      ],
      "extend_z": [
        10,
        11,
        12
      ],
      "match_found": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "in_z_box": [
        9
      ],
      "is_match": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function zSearch(text: string, pattern: string): number[] {\n    const concat = pattern + \"$\" + text;\n    const n = concat.length, m = pattern.length;\n    const z: number[] = new Array(n).fill(0);\n    const matches: number[] = [];\n\n    let l = 0, r = 0;\n    for (let i = 1; i < n; i++) {\n        if (i < r) z[i] = Math.min(r - i, z[i - l]);\n        while (i + z[i] < n && concat[z[i]] === concat[i + z[i]])\n            z[i]++;\n        if (i + z[i] > r) { l = i; r = i + z[i]; }\n        if (z[i] >= m) matches.push(i - m - 1);\n    }\n    return matches;\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "build_z": [
        7,
        8,
        9
      ],
      "use_z_box": [
        9
      ],
      "extend_z": [
        10,
        11,
        12
      ],
      "match_found": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "in_z_box": [
        9
      ],
      "is_match": [
        13
      ]
    }
  }
};

const ZAlgorithmPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Two Matches",
    "value": {
      "text": "aabxaab",
      "pattern": "aab"
    }
  },
  {
    "id": "ex2",
    "label": "Overlapping",
    "value": {
      "text": "aaabaaab",
      "pattern": "aaab"
    }
  },
  {
    "id": "ex3",
    "label": "Repeated",
    "value": {
      "text": "abcabc",
      "pattern": "abc"
    }
  },
  {
    "id": "ex4",
    "label": "No Match",
    "value": {
      "text": "abcdef",
      "pattern": "xyz"
    }
  }
];

function generateZAlgorithmSteps(e: any): any[] {
  let t=e.text,i=e.pattern,n=i.length,a=i+"$"+t,l=a.length,o=t.length,c=(e={},t)=>{let i={};for(let t=0;t<l;t++)i[`char_${t}`]={type:"arrayElement",value:a[t],position:t,row:0,state:e[t]??void 0};if(t)for(let e=0;e<l;e++)i[`z_${e}`]={type:"arrayElement",value:0===e?"-":t[e]??0,position:e,row:1,state:t[e]>0?"active":void 0};return i},s=(e,t={})=>{let i={};for(let r=0;r<l;r++)i[`z_${r}`]={type:"arrayElement",value:0===r?"-":e[r],position:r,row:1,state:t[r]??void 0};return i},d=Array(l).fill(0),u={};for(let e=0;e<l;e++)u[`char_${e}`]={type:"arrayElement",value:a[e],position:e,row:0},u[`z_${e}`]={type:"arrayElement",value:0===e?"-":0,position:e,row:1};let h=new StepRecorder({pattern:i,text:t,concat:a,m:n,n:o,totalLen:l},u);h.record("-",`Z-Algorithm: Build Z-array on "${a}" (pattern + '$' + text), then find matches.`);let p=0,f=0;h.update_variable("l",p),h.update_variable("r",f);for(let e=1;e<l;e++){h.update_variable("i",e),h.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),f>p?h.update_visual("range_window",{type:"range",start:p,end:f-1,label:"Z-box"}):h.delete_visual("range_window"),Object.entries(c({[e]:"active"})).forEach(([e,t])=>h.update_visual(e,t));let t=e<f;if(h.add_conditional("in_z_box",t),h.record("build_z",`i=${e}: char='${a[e]}'. ${t?`Inside Z-box [${p},${f-1}].`:"Outside Z-box."} l=${p}, r=${f}.`),e<f){let t=e-p,i=f-e;if(h.update_variable("mirror",t),d[t]<i){d[e]=d[t];let r={};r[e]="placed",r[t]="checking",Object.entries(s(d,r)).forEach(([e,t])=>h.update_visual(e,t)),h.record("use_z_box",`Z[mirror=${t}]=${d[t]} < remaining=${i}. Copy: Z[${e}] = ${d[e]}.`)}else{for(d[e]=i;e+d[e]<l&&a[d[e]]===a[e+d[e]];)d[e]++;p=e,f=e+d[e],h.update_variable("l",p),h.update_variable("r",f);let t={};t[e]="placed",Object.entries(s(d,t)).forEach(([e,t])=>h.update_visual(e,t)),f>p&&h.update_visual("range_window",{type:"range",start:p,end:f-1,label:"Z-box"}),h.record("extend_z",`Z[mirror]≥remaining. Extend from i=${e}: Z[${e}] = ${d[e]}. New Z-box [${p},${f-1}].`)}}else{for(d[e]=0;e+d[e]<l&&a[d[e]]===a[e+d[e]];)d[e]++;d[e]>0&&(p=e,f=e+d[e],h.update_variable("l",p),h.update_variable("r",f),f>p&&h.update_visual("range_window",{type:"range",start:p,end:f-1,label:"Z-box"}));let t={};d[e]>0&&(t[e]="placed"),Object.entries(s(d,t)).forEach(([e,t])=>h.update_visual(e,t)),h.record("build_z",`Outside Z-box. Extend: Z[${e}] = ${d[e]}.${d[e]>0?` New Z-box [${p},${f-1}].`:""}`)}}h.delete_visual("ptr_i"),h.delete_visual("range_window"),h.delete_variable("i"),h.delete_variable("l"),h.delete_variable("r"),h.delete_variable("mirror"),h.update_variable("phase","find_matches");let m={},x=[];for(let e=n+1;e<l;e++)if(d[e]>=n){let t=e-n-1;x.push(t)}for(let e=0;e<l;e++)e>=n+1&&d[e]>=n&&(m[e]="placed");Object.entries(s(d,m)).forEach(([e,t])=>h.update_visual(e,t));let g={};for(let e of x){let t=e+n+1;for(let e=t;e<t+n;e++)g[e]="placed"}Object.entries(c(g)).forEach(([e,t])=>h.update_visual(e,t)),h.update_variable("matches",x),h.record("build_z",`Z-array built: [${d.map((e,t)=>0===t?"-":e).join(", ")}]. Now find matches where Z[i] ≥ m=${n}.`);for(let e=n+1;e<l;e++){let t=e-n-1;h.update_visual("ptr_i",{type:"pointer",position:e,label:"i"});let i={};for(let e of x.filter(e=>e<t)){let t=e+n+1;for(let e=t;e<t+n;e++)i[e]="placed"}i[e]="active",Object.entries(c(i)).forEach(([e,t])=>h.update_visual(e,t));let r={};for(let t=1;t<e;t++)t>=n+1&&d[t]>=n&&(r[t]="placed");r[e]="active",Object.entries(s(d,r)).forEach(([e,t])=>h.update_visual(e,t)),h.add_conditional("is_match",d[e]>=n),h.record("build_z",`i=${e}: Z[${e}]=${d[e]} ${d[e]>=n?`≥ m=${n} → Match at text index ${t}!`:`< m=${n}, no match.`}`),d[e]>=n&&h.record("match_found",`Pattern found at text index ${t}! (concat index ${e})`)}return h.delete_visual("ptr_i"),x.length>0?h.record("complete",`Done! Pattern found at ${x.length} position(s): [${x.join(", ")}]`):h.record("complete","Done! Pattern not found in text."),h.getSteps()
}

export function ZAlgorithmProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ZAlgorithmTemplates,
      generateSteps: (e: any) => {
        const recorded = generateZAlgorithmSteps(e) as any[];
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
      title="Z Algorithm"
      slug="z-algorithm"
      approaches={approaches}
      presets={ZAlgorithmPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
