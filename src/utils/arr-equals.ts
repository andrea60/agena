export function arrayEquals(first:any[], second:any[]){
    for(let i:number=0;i<first.length;i++)
        if (first[i] !== second[i])
            return false;
    return first.length == second.length;
}