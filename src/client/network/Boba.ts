import { io } from "socket.io-client";
import { deserialize } from "@shared/network/NetworkObjectRegistry";
import { Socket } from "socket.io";

const socket = io();

function createDeserializingSocketProxy(socket: any) {
  /*
    Map of original listeners to wrapped listeners

    This is used because socket.off() requires the original listener.
    We override the listener in socket.on(), so we need to store the original listener somewhere.
  */
  const listeners = new Map();
  
  return new Proxy(socket, {
    get(target, propKey, receiver) {
      const originalMethod = target[propKey];

      if (typeof originalMethod === 'function') {
        if (propKey === 'on') {
          // socket.on() proxy handler
          
          return function (event: string, listener: (...args: any[]) => void) {
            // Wrap the listener function so that it deserializes the arguments
            const wrappedListener = (...args: any[]) => {
              const deserializedArgs = args.map(arg => deserialize(arg));
              listener(...deserializedArgs);
            };

            // Store the wrapped listener so that we can remove it later with socket.off()
            listeners.set(listener, wrappedListener);

            // Call the original socket.on() with the wrapped listener
            return originalMethod.call(target, event, wrappedListener);
          };
        } else if (propKey === 'off') {
          // socket.off() proxy handler
          
          return function (event: string, listener: (...args: any[]) => void) {
            // Get the wrapped listener from the map
            const wrappedListener = listeners.get(listener);

            // Call the original socket.off() with the wrapped listener if it exists
            if (wrappedListener) {
              listeners.delete(listener);
              return originalMethod.call(target, event, wrappedListener);
            }

            // Call the original socket.off() with the original listener if it doesn't exist
            return originalMethod.call(target, event, listener);
          };
        }
      }

      // Return the original method if it's not socket.on() or socket.off()
      return Reflect.get(target, propKey, receiver);
    }
  });
}

const Boba: Socket = createDeserializingSocketProxy(socket);

export default Boba;