import ItemType from "./ItemType"

interface StockType{
    id:number,    
    availableStock: number,
    item?: ItemType
}
export default StockType;