export const assert = (name: string, value: string) => {
    if (!value?.length) {
        throw new Error(`${name} was undefined or empty.`);
    }
}
