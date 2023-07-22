export abstract class NetworkObject {
  type: string;

  toJSON(): object {
    return {
      type: this.type,
      value: JSON.stringify(this)
    }
  }

  static fromJSON(json: any): NetworkObject {
    // TODO please help there's a constant warning here
    throw new Error("Method not implemented.");
  }
}