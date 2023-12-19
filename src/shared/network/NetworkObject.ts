export abstract class NetworkObject {
  private ID = crypto.randomUUID();
  abstract kind: string;

  // AKA serialize
  toJSON(): SerializedNetworkObject {
    return {
      ID: this.ID,
      kind: this.kind, // kind: NetworkObject.kind, // does this work? (static member)
      value: JSON.stringify(this)
    }
  }

  // AKA deserialize
  // was previously static, but it needs to be an instance method
  // so that we can create the instance before deserializing it
  // so that we can add it to the cache
  fromJSON(serialized: SerializedNetworkObject): NetworkObject {
    throw new Error(`${serialized.kind} deserialization not implemented.`);
  }
}

export function isSerializedNetworkObject(json: any): json is SerializedNetworkObject {
  return typeof json === 'object' && json !== null && 'ID' in json && 'kind' in json && 'value' in json;
}

export interface SerializedNetworkObject {
  ID: string;
  kind: string;
  value: string;
}