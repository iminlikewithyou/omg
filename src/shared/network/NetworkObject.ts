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
  static fromJSON(serialized: SerializedNetworkObject): NetworkObject {
    // TODO please help there's a constant warning here
    throw new Error(`${serialized.kind} deserialization not implemented.`);
  }
}

interface SerializedNetworkObject {
  ID: string;
  kind: string;
  value: string;
}