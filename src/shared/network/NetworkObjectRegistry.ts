import { NetworkObject, SerializedNetworkObject, isSerializedNetworkObject } from "./NetworkObject";

let classMap: { [type: string]: typeof NetworkObject } = {};
let cache = new Map<string, WeakRef<NetworkObject>>();

export function register(Class: typeof NetworkObject, type: string): void {
  classMap[type] = Class;
}

export function getClass(type: string): typeof NetworkObject | undefined {
  return classMap[type];
}

// Not necessary because we can just use NetworkObject.fromJSON
// socket.io already does this for us - so this doesn't seem necessary now

// export function serialize(object: any): any {
//   if (object instanceof NetworkObject) {
//     return object.toJSON();
//   } else if (Array.isArray(object)) {
//     return object.map(item => this.serialize(item));
//   } else if (object !== null && typeof object === 'object') {
//     const serializedObject: any = {};
//     for (const key of Object.keys(object)) {
//       serializedObject[key] = this.serialize(object[key]);
//     }
//     return serializedObject;
//   } else {
//     return object;
//   }
// }

export function deserialize(json: any) {
  if (isSerializedNetworkObject(json)) {
    // This is a serialized NetworkObject

    // Check if this object has been cached before
    const cached = cache.get(json._ID);
    if (cached) {
      // This object is cached; check if the instance is still alive
      const instance = cached.deref();
      if (instance) {
        // The instance is still alive; return it
        return instance;
      } else {
        // The instance has been garbage collected, delete and continue
        cache.delete(json._ID);
      }
    }
    
    // Attempt to get the class for this object
    // Have to use the "any" type because TypeScript won't let us call new on an abstract class
    // even though this class can never be abstract
    const NetworkObjectClass: any = getClass(json._kind);
    
    // Check if this class kind is registered
    if (!NetworkObjectClass) {
      throw new Error(`No class registered for kind "${json._kind}"`);
    }

    /* 
      Instances are created before they are deserialized,
      so that they can be added to the cache before deserialization.
      This allows for circular references to be deserialized properly.
    */
    
    // Create an instance of the class and add it to the cache
    const instance: NetworkObject = new NetworkObjectClass();
    cache.set(json._ID, new WeakRef(instance));

    // Deserialize the instance
    instance.fromJSON(this.deserialize(json._value));

    // Return the instance
    return instance;
  } else if (Array.isArray(json)) {
    // This is an array; deserialize each item
    return json.map(item => deserialize(item));
  } else if (json !== null && typeof json === 'object') {
    // This is an object; deserialize each property
    const deserializedObject = {};
    for (const key of Object.keys(json)) {
      deserializedObject[key] = deserialize(json[key]);
    }
    return deserializedObject;
  } else {
    // Otherwise, return the value as-is
    return json;
  }
}

export function cleanup() {
  // Remove all garbage collected objects from the cache
  for (const [key, value] of cache) {
    if (!value.deref()) {
      cache.delete(key);
    }
  }
}