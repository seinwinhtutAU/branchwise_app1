from datetime import date

from pydantic import BaseModel, ConfigDict


class ReceivingItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    receiving_item_id: int
    receiving_id: int
    variant_id: int
    quantity_expected: int
    quantity_received: int


class ReceivingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    receiving_id: int
    shipment_id: int
    warehouse_id: int
    received_date: date
    status: str


class ReceivingDetailOut(ReceivingOut):
    items: list[ReceivingItemOut] = []
