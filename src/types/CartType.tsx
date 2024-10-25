import ItemType from "./ItemType";

interface CartType{
    id:number,
    orderedItems:ItemType[],
    quantities: number[],    
    discountCartPrice: number,  
    totalCartPrice:number,
}
export default CartType;