from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class CustomerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    customer_id: int
    name: str
    phone: str | None
    address: str | None


class FactoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    factory_id: int
    name: str
    phone: str | None


class WarehouseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: int
    name: str


class ExchangeRateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    currency_code: str
    rate_to_base: Decimal


class ProductVariantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    variant_id: int
    product_id: int
    color: str | None
    group_name: str | None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    product_code: str
    name: str


class ProductDetailOut(ProductOut):
    variants: list[ProductVariantOut] = []
