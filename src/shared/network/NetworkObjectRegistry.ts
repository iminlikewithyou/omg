import { NetworkObject } from "./NetworkObject";

let classMap: { [type: string]: typeof NetworkObject } = {};

export function register(Class: typeof NetworkObject, type: string): void {
  classMap[type] = Class;
}

export function getClass(type: string): typeof NetworkObject | undefined {
  return classMap[type];
}

export function deserialize(obj: any, map = new Map<string, NetworkObject>()): any {
  if (Array.isArray(obj)) {
    return obj.map(item => deserialize(item, map));
  } else if (obj !== null && typeof obj === 'object') {
    if ('ID' in obj && 'kind' in obj && 'value' in obj) {
      // This is a SerializedNetworkObject
      if (map.has(obj.ID)) {
        // We've seen this object before; return the instance we created for it
        return map.get(obj.ID);
      }

      const ObjectType = getClass(obj.kind);
      if (!ObjectType) {
        throw new Error(`No class registered for ${obj.kind}`);
      }
      const instance = ObjectType.fromJSON(obj);
      map.set(obj.ID, instance);

      return instance;
    } else {
      // This is a regular object; convert its properties
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = deserialize(value, map);
      }

      return result;
    }
  } else {
    // This is not an object; return it as-is
    return obj;
  }
}