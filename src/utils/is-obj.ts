export function isObj(param:any): param is Object {
    return !!param && 
        !Array.isArray(param) &&
        typeof param === 'object';
}