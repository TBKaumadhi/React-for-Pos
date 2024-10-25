import ItemType from "./ItemType";

interface OrderType{
    id: number;
    orderDateTime: string | Date;
    paymentMethod: string,
    invoiceNumber: string,
    totalPrice:number;
    orderedItems: ItemType[] 
}
export default OrderType;