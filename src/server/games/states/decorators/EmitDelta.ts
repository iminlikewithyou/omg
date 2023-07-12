import "reflect-metadata";

const skipDecorators = ["NoEmit", "EmitDelta"];

export function AutoEmitDelta(constructor: Function) {
  // Get the prototype of the class
  const prototype = constructor.prototype;

  // Get all the method names of the class
  const methods = Object.getOwnPropertyNames(prototype)
    .filter(prop => typeof prototype[prop] === "function" && prop !== "constructor");

  // Apply EmitDelta to each method, unless NoEmit is present
  methods.forEach(method => {
    if (skipDecorators.some(decorator => Reflect.getMetadata(decorator, prototype, method))) {
      // Skip this method if the NoEmit decorator is present
      return;
    }

    const originalMethod = prototype[method];
    prototype[method] = autoEmitDelta(originalMethod).bind(this); // binding this may be wrong
  });
}

export function EmitDelta(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = autoEmitDelta(originalMethod).bind(this);
}

function autoEmitDelta(originalMethod) {
  const autoEmitter = (...args: any[]) => {
    // "this" may be the wrong reference here
    const result = originalMethod.apply(this, args);
    const delta: any = {
      type: "emitDelta",
      payload: args
    };
    this.emitDelta(delta);
    return result;
  };

  return autoEmitter;
}