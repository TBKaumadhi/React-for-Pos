import CategoryType from "./CategoryType";
import StockType from "./StockType";

interface ItemType{
    id:number,
    name: string,
    description: string,
    imgUrl: string,
    price:number,
    discount:number,
    category?: CategoryType,
    stock:StockType
}
export default ItemType;