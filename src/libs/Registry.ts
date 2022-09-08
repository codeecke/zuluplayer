export class Registry<TItem> {
    private items: TItem[] = [];

    register(item: TItem) {
        this.items.push(item)
    }

    remove(item: TItem) {
        this.items = this.items.filter(registeredItem => registeredItem !== item);
    }

    use<TResultType>(callback: (item: TItem, previousResult: TResultType | undefined) => TResultType): TResultType | undefined {
        let result: TResultType | undefined = undefined;
        this.items.forEach(item => {
            result = callback(item, result)
        });
        return result;
    }

    async useAsync<TResultType>(callback: (item: TItem, previousResult: TResultType | undefined) => Promise<TResultType>): Promise<TResultType> {
        let result: TResultType | undefined = undefined;
        for(const item of this.items) {
            result = await callback(item, result)
        };
        return result;
    }
}