/** Map compiler/profile identifiers to language IDs understood by Monaco. */
export function monacoLanguageId(language: string): string {
  switch (language.trim().toLowerCase()) {
    case "cpp":
    case "cpp17":
    case "cpp20":
    case "c++":
      return "cpp";
    case "java":
    case "java17":
      return "java";
    case "python":
    case "python3":
      return "python";
    case "typescript":
    case "ts":
      return "typescript";
    case "javascript":
    case "js":
    default:
      return "javascript";
  }
}
