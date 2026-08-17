from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class PurchaseItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    purchase_item_id: int
    purchase_id: int
    variant_id: int
    quantity: int
    buying_price: Decimal


class PurchaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    purchase_id: int
    purchase_no: str
    factory_id: int
    purchase_date: date
    status: str
    currency_code: str


class PurchaseDetailOut(PurchaseOut):
    items: list[PurchaseItemOut] = []
