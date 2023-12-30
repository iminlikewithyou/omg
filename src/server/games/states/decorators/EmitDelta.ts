import "reflect-metadata";

// TODO a lot of repeated code here
const skipDecorators = ["NoEmit", "EmitDelta", "EmitState"];

function autoEmitDelta(originalMethod: Function, propertyKey: string) {
  return function(...args: any[]) {
    // "this" may be the wrong reference here
    const result = originalMethod.apply(this, args);

    this.emitDelta({
      type: propertyKey,
      payload: args
    });

    return result;
  };
}

function autoEmitState(originalMethod: Function) {
  return function(...args: any[]) {
    const result = originalMethod.apply(this, args);

    this.emitState(this.state);

    return result;
  };
}

export function EmitDelta(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  Reflect.defineMetadata('EmitDelta', true, target, propertyKey);

  descriptor.value = autoEmitDelta(originalMethod, propertyKey).bind(this);
}

export function EmitState(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  Reflect.defineMetadata('EmitState', true, target, propertyKey);

  descriptor.value = autoEmitState(originalMethod).bind(this);
}

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
    prototype[method] = autoEmitDelta(originalMethod, method).bind(this); // binding this may be wrong
  });
}

export function AutoEmitState(constructor: Function) {
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
    prototype[method] = autoEmitState(originalMethod).bind(this); // binding this may be wrong
  });
}

export function NoEmit(_target: any, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  return descriptor;
}