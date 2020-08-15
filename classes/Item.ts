class Item {
    public name: string;
    public count: number;
    public ammo: number;
    public rarity: number;

    constructor(name: string, count: number, ammo: number, rarity: number) {
        this.name = name;
        this.count = count;
        this.ammo = ammo;
        this.rarity = rarity;
    }

    public setAmmo(ammo: number) {
        this.ammo = ammo;
    }

    public setCount(count: number) {
        this.count = count;
    }

    public setRarity(rarity: number) {
        this.rarity = rarity;
    }

    public setName(name: string) {
        this.name = name;
    }
}

export default Item;