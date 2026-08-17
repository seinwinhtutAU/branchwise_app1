from pydantic import BaseModel, ConfigDict


class InventoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    inventory_id: int
    warehouse_id: int
    variant_id: int
    quantity: int
    reserved_quantity: int
    incoming_quantity: int
