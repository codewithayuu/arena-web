// Universal Step Recorder for DSA Problem Walkthroughs
// 1:1 match to Mindflare's internal execution state machine (module 597448)

export interface RecordedStep {
  id: string; // key matching lineMap (e.g. "check_pair", "row_start")
  description: string; // text explanation for the step banner
  variables: Record<string, any>;
  visualState: Record<string, any>;
  conditionals?: { key: string; result: boolean }[];
}

export class StepRecorder {
  private steps: RecordedStep[] = [];
  private currentVariables: Record<string, any>;
  private currentVisualState: Record<string, any>;
  private currentConditionals: { key: string; result: boolean }[] = [];

  constructor(initialVars: Record<string, any> = {}, initialVisuals: Record<string, any> = {}) {
    this.currentVariables = this.deepClone(initialVars);
    this.currentVisualState = this.deepClone(initialVisuals);
  }

  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;
    return JSON.parse(JSON.stringify(obj));
  }

  update_variable(key: string, val: any): void {
    this.currentVariables[key] = this.deepClone(val);
  }

  add_new_variable(key: string, val: any): void {
    this.currentVariables[key] = this.deepClone(val);
  }

  delete_variable(key: string): void {
    delete this.currentVariables[key];
  }

  update_visual(key: string, patch: any): void {
    this.currentVisualState[key] = this.deepClone(patch);
  }

  add_new_visual(key: string, patch: any): void {
    this.currentVisualState[key] = this.deepClone(patch);
  }

  delete_visual(key: string): void {
    delete this.currentVisualState[key];
  }

  get_visual(key: string): any {
    return this.currentVisualState[key];
  }

  getCurrentVisuals(): Record<string, any> {
    return this.deepClone(this.currentVisualState);
  }

  set_conditionals(conds: any): void {
    this.currentConditionals = Array.isArray(conds)
      ? this.deepClone(conds)
      : typeof conds === "object" && conds !== null
      ? Object.entries(conds).map(([key, result]) => ({ key, result: Boolean(result) }))
      : [];
  }

  add_conditional(key: string, result: boolean): void {
    this.currentConditionals.push({ key, result });
  }

  record(id: string, description: string): void {
    this.steps.push({
      id,
      description,
      variables: this.deepClone(this.currentVariables),
      visualState: this.deepClone(this.currentVisualState),
      conditionals:
        this.currentConditionals.length > 0
          ? this.deepClone(this.currentConditionals)
          : undefined,
    });
    this.currentConditionals = [];
  }

  getSteps(): RecordedStep[] {
    return this.steps;
  }

  reset(): void {
    this.steps = [];
  }
}

export class RecursiveStepRecorder {
  private steps: any[] = [];
  private callStack: any[] = [];
  private globalVariables: Record<string, any>;
  private currentVisualState: Record<string, any>;

  constructor(initialVars: Record<string, any> = {}, initialVisuals: Record<string, any> = {}) {
    this.globalVariables = this.deepClone(initialVars);
    this.currentVisualState = this.deepClone(initialVisuals);
  }

  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;
    return JSON.parse(JSON.stringify(obj));
  }

  update_global_variable(key: string, val: any): void {
    this.globalVariables[key] = this.deepClone(val);
  }

  add_new_global_variable(key: string, val: any): void {
    this.globalVariables[key] = this.deepClone(val);
  }

  delete_global_variable(key: string): void {
    delete this.globalVariables[key];
  }

  update_frame_variable(key: string, val: any): void {
    const frame = this.callStack[this.callStack.length - 1];
    if (frame) frame.variables[key] = this.deepClone(val);
  }

  add_new_frame_variable(key: string, val: any): void {
    const frame = this.callStack[this.callStack.length - 1];
    if (frame) frame.variables[key] = this.deepClone(val);
  }

  delete_frame_variable(key: string): void {
    const frame = this.callStack[this.callStack.length - 1];
    if (frame) delete frame.variables[key];
  }

  update_visual(key: string, patch: any): void {
    this.currentVisualState[key] = this.deepClone(patch);
  }

  add_new_visual(key: string, patch: any): void {
    this.currentVisualState[key] = this.deepClone(patch);
  }

  delete_visual(key: string): void {
    delete this.currentVisualState[key];
  }

  get_visual(key: string): any {
    return this.currentVisualState[key];
  }

  getCurrentVisuals(): Record<string, any> {
    return this.deepClone(this.currentVisualState);
  }

  set_conditionals(conds: any): void {
    const frame = this.callStack[this.callStack.length - 1];
    if (frame) {
      frame.conditionals = Array.isArray(conds)
        ? this.deepClone(conds)
        : typeof conds === "object" && conds !== null
        ? Object.entries(conds).map(([key, result]) => ({ key, result: Boolean(result) }))
        : [];
    }
  }

  pushCallFrame(frameVars: Record<string, any> = {}, functionName?: string): void {
    this.callStack.push({
      depth: this.callStack.length,
      variables: this.deepClone(frameVars),
      currentLineId: "",
      functionArgs: this.deepClone(frameVars),
      conditionals: [],
      function_name: functionName,
    });
  }

  popCallFrame(): any {
    return this.callStack.pop();
  }

  add_conditional(key: string, result: boolean): void {
    const frame = this.callStack[this.callStack.length - 1];
    if (frame) frame.conditionals.push({ key, result });
  }

  clearCurrentConditionals(): void {
    const frame = this.callStack[this.callStack.length - 1];
    if (frame) frame.conditionals = [];
  }

  getDepth(): number {
    return this.callStack.length;
  }

  getCurrentFrame(): any {
    return this.callStack[this.callStack.length - 1];
  }

  record(id: string, description: string): void {
    const frame = this.callStack[this.callStack.length - 1];
    if (frame) frame.currentLineId = id;
    this.steps.push({
      id,
      description,
      variables: this.deepClone(this.globalVariables),
      visualState: this.deepClone(this.currentVisualState),
      callStack: this.deepClone(this.callStack),
    });
    this.clearCurrentConditionals();
  }

  getSteps(): any[] {
    return this.steps;
  }

  reset(): void {
    this.steps = [];
    this.callStack = [];
  }
}
