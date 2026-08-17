from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    order_item_id: int
    order_id: int
    variant_id: int
    quantity: int
    price: Decimal


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    order_id: int
    order_no: str
    customer_id: int
    order_date: date
    source: str | None
    status: str
    total_amount: Decimal
    currency_code: str


class OrderDetailOut(OrderOut):
    items: list[OrderItemOut] = []


class OrderItemUpdate(BaseModel):
    order_item_id: int
    quantity: int
    price: Decimal


class OrderItemsUpdateRequest(BaseModel):
    items: list[OrderItemUpdate]
