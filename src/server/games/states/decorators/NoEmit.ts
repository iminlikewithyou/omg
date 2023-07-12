function NoEmit(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  return descriptor;
}

export default NoEmit;