import { NetworkObject } from "./NetworkObject";
import { getClass } from "./NetworkObjectRegistry";
import socket from "./Socket";

export class DeserializingSocket {
  // constructor(
  //   private socket: Socket,
  //   private registry: NetworkObjectRegistry,
  // ) {}

  emit(eventName: string, object: any): void {
    socket.emit(eventName, this.serialize(object));
  }

  on(eventName: string, handler: (object: any) => void): void {
    socket.on(eventName, (json: any) => {
      const object = this.deserialize(json);
      handler(object);
    });
  }

  private serialize(object: any): any {
    if (object instanceof NetworkObject) {
      return {
        type: object.constructor.name,
        value: this.serialize(object.toJSON())
      };
    } else if (Array.isArray(object)) {
      return object.map(item => this.serialize(item));
    } else if (object !== null && typeof object === 'object') {
      const serializedObject: any = {};
      for (const key of Object.keys(object)) {
        serializedObject[key] = this.serialize(object[key]);
      }
      return serializedObject;
    } else {
      return object;
    }
  }

  private deserialize(json: any): any {
    if (typeof json === 'object' && json !== null && 'type' in json && 'value' in json) {
      const ObjectClass = getClass(json.type);
      if (!ObjectClass) {
        throw new Error(`No class registered for type "${json.type}"`);
      }
      return ObjectClass.fromJSON(this.deserialize(json.value));
    } else if (Array.isArray(json)) {
      return json.map(item => this.deserialize(item));
    } else if (json !== null && typeof json === 'object') {
      const deserializedObject: any = {};
      for (const key of Object.keys(json)) {
        deserializedObject[key] = this.deserialize(json[key]);
      }
      return deserializedObject;
    } else {
      return json;
    }
  }
}