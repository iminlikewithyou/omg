abstract class NetworkObject {
  toJSON() {
    return {
      type: this.constructor.name,
      value: JSON.stringify(this)
    }
  }
}