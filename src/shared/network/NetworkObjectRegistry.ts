import { NetworkObject } from './networkObject';

export class NetworkObjectRegistry {
  private classMap = new Map<string, typeof NetworkObject>();

  register(type: string, Class: typeof NetworkObject) {
    this.classMap.set(type, Class);
  }

  deserialize(json: any): NetworkObject {
    const Class = this.classMap.get(json.type);
    if (!Class) {
      throw new Error(`No class registered for type '${json.type}'`);
    }
    return Class.fromJSON(json);
  }
}

// Export an instance of the registry so it can be imported by NetworkObject subclasses
export const registry = new NetworkObjectRegistry();