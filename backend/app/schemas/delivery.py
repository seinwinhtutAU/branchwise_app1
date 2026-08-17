from datetime import date

from pydantic import BaseModel, ConfigDict


class DeliveryItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    delivery_item_id: int
    delivery_id: int
    variant_id: int
    quantity: int
    stock_allocation_id: int | None
    purchase_allocation_id: int | None


class DeliveryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    delivery_id: int
    order_id: int
    expected_delivery_date: date | None
    delivery_date: date | None
    status: str


class DeliveryDetailOut(DeliveryOut):
    items: list[DeliveryItemOut] = []


class DeliveryLineCreate(BaseModel):
    variant_id: int
    quantity: int


class DeliveryCreate(BaseModel):
    order_id: int
    expected_delivery_date: date
    lines: list[DeliveryLineCreate]
