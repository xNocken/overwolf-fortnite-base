import Item from './Item';
import Vector3 from './Vector3';

class Player {
    public name: string = '';
    public accuracy: number = 0;
    public hotbar: Array<Item> = [];
    public health: number = 0;
    public shield: number = 0;
    public inventory: Array<Item> = [];
    public selected_slot = {
        isPrimary: false,
        slot: '0',
    };
    public selectedMaterial: number = 0;
    public location: Vector3 = new Vector3();

    public getMaterialCount(materialType: string): number {
        let count: number = 0;

        this.inventory.forEach((item: Item) => {
            if (item && item.name == `${materialType}ItemData`) {
                count = item.count;
            }
        });

        return count;
    }
}

export default Player;
