export function isFunction(param:any): param is Function {
    return typeof param === 'function';
}