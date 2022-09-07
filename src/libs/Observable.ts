import { Registry } from "./Registry";

export class Observable <T> {
    private observer = new Registry<(value: T) => void>()

    constructor(private value: T) {}

    observe(observer: (value: T) => void, runValue: T = undefined) {
        this.observer.register(observer);
    }

    update(value: T) {
        this.value = value;
        this.observer.use(observer => observer(value));
    }

    getValue(): T {
        return this.value;
    }
}