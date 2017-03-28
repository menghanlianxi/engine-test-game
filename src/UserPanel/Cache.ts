var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
    const getter = desc.get;
    console.log(getter)
    desc.get = function () {
        return getter.apply(this);
    }
    return desc;
}