export abstract class NetworkObject {
  private _ID = crypto.randomUUID();
  abstract kind: string;

  // AKA serialize
  toJSON(): SerializedNetworkObject {
    return {
      _ID: this._ID,
      _kind: this.kind, // kind: NetworkObject.kind, // does this work? (static member)
      _value: JSON.stringify(this)
    }
  }

  // AKA deserialize
  // was previously static, but it needs to be an instance method
  // so that we can create the instance before deserializing it
  // so that we can add it to the cache
  fromJSON(serialized: SerializedNetworkObject): NetworkObject {
    throw new Error(`${serialized._kind} deserialization not implemented.`);
  }
}

interface SerializedNetworkObject {
  _ID: string;
  _kind: string;
  _value: string;
}