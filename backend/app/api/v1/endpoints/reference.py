from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.reference import (
    CustomerOut,
    ExchangeRateOut,
    FactoryOut,
    ProductDetailOut,
    ProductOut,
    WarehouseOut,
)
from app.services import reference_service

router = APIRouter(tags=["reference"])


@router.get("/customers", response_model=list[CustomerOut])
def list_customers(
    current_user: CurrentUser,
    db: DbSession,
    q: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[CustomerOut]:
    return reference_service.list_customers(db, q, skip, limit)


@router.get("/customers/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, current_user: CurrentUser, db: DbSession) -> CustomerOut:
    customer = reference_service.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Customer not found")
    return customer


@router.get("/factories", response_model=list[FactoryOut])
def list_factories(
    current_user: CurrentUser, db: DbSession, skip: int = 0, limit: int = 50
) -> list[FactoryOut]:
    return reference_service.list_factories(db, skip, limit)


@router.get("/factories/{factory_id}", response_model=FactoryOut)
def get_factory(factory_id: int, current_user: CurrentUser, db: DbSession) -> FactoryOut:
    factory = reference_service.get_factory(db, factory_id)
    if not factory:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Factory not found")
    return factory


@router.get("/warehouses", response_model=list[WarehouseOut])
def list_warehouses(current_user: CurrentUser, db: DbSession) -> list[WarehouseOut]:
    return reference_service.list_warehouses(db)


@router.get("/warehouses/{warehouse_id}", response_model=WarehouseOut)
def get_warehouse(warehouse_id: int, current_user: CurrentUser, db: DbSession) -> WarehouseOut:
    warehouse = reference_service.get_warehouse(db, warehouse_id)
    if not warehouse:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Warehouse not found")
    return warehouse


@router.get("/exchange-rates", response_model=list[ExchangeRateOut])
def list_exchange_rates(current_user: CurrentUser, db: DbSession) -> list[ExchangeRateOut]:
    return reference_service.list_exchange_rates(db)


@router.get("/products", response_model=list[ProductOut])
def list_products(
    current_user: CurrentUser,
    db: DbSession,
    q: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[ProductOut]:
    return reference_service.list_products(db, q, skip, limit)


@router.get("/products/{product_id}", response_model=ProductDetailOut)
def get_product(product_id: int, current_user: CurrentUser, db: DbSession) -> ProductDetailOut:
    product = reference_service.get_product(db, product_id)
    if not product:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return product
