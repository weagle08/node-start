interface ObjectConstructor {
    isEmpty(obj: any): boolean;
    isEqual(objA: any, objB: any, aToBOnly?: boolean): boolean;
}

Object.isEmpty = (obj: any) => {
    let keys = Object.keys(obj);
    let symbols = Object.getOwnPropertySymbols(obj);
    return keys.length === 0 && symbols.length === 0 && obj.constructor === Object;
};

Object.isEqual = (objA: any, objB: any, aToBOnly: boolean = false) => {
    let keysA = Object.keys(objA);
    let keysB = Object.keys(objB);

    if (objA === objB) {
        return true;
    }

    let isEqual = true;

    keysA.forEach((k: string) => {
        if (!(objA[k] === objB[k])) {
            isEqual = false;
            return;
        }
    });

    if (isEqual === true && aToBOnly === false) {
        keysB.forEach((k: string) => {
            if (!(objB[k] === objA[k])) {
                isEqual = false;
                return;
            }
        });
    }

    if (isEqual === true) {
        let symbolsA = Object.getOwnPropertySymbols(objA);
        let symbolsB = Object.getOwnPropertySymbols(objB);

        symbolsA.forEach((s: symbol) => {
            if (!(objA[s] === objB[s])) {
                isEqual = false;
                return;
            }
        });

        if (isEqual === true && aToBOnly === false) {
            symbolsB.forEach((s: symbol) => {
                if (!(objB[s] === objA[s])) {
                    isEqual = false;
                    return;
                }
            });
        }
    }

    return isEqual;
};