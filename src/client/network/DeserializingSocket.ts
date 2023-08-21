import { NetworkObject } from "./NetworkObject";
import { deserialize } from "./NetworkObjectRegistry";
import Socket from "./Socket";

export class DeserializingSocket {
  // constructor(
  //   private socket: Socket,
  //   private registry: NetworkObjectRegistry,
  // ) {}

  emit(eventName: string, object: any): void {
    Socket.emit(eventName, this.serialize(object));
  }

  on(eventName: string, handler: (object: any) => void): void {
    Socket.on(eventName, (json: any) => {
      const object = deserialize(json);
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
}