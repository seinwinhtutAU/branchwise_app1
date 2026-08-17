from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Customer, ExchangeRate, Factory, Product, Warehouse


def list_customers(db: Session, q: str | None, skip: int, limit: int) -> list[Customer]:
    stmt = select(Customer)
    if q:
        stmt = stmt.where(Customer.name.ilike(f"%{q}%"))
    stmt = stmt.order_by(Customer.name).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_customer(db: Session, customer_id: int) -> Customer | None:
    return db.get(Customer, customer_id)


def list_factories(db: Session, skip: int, limit: int) -> list[Factory]:
    stmt = select(Factory).order_by(Factory.name).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_factory(db: Session, factory_id: int) -> Factory | None:
    return db.get(Factory, factory_id)


def list_warehouses(db: Session) -> list[Warehouse]:
    return list(db.scalars(select(Warehouse).order_by(Warehouse.name)))


def get_warehouse(db: Session, warehouse_id: int) -> Warehouse | None:
    return db.get(Warehouse, warehouse_id)


def list_exchange_rates(db: Session) -> list[ExchangeRate]:
    return list(db.scalars(select(ExchangeRate).order_by(ExchangeRate.currency_code)))


def list_products(db: Session, q: str | None, skip: int, limit: int) -> list[Product]:
    stmt = select(Product)
    if q:
        stmt = stmt.where(Product.name.ilike(f"%{q}%") | Product.product_code.ilike(f"%{q}%"))
    stmt = stmt.order_by(Product.product_code).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_product(db: Session, product_id: int) -> Product | None:
    stmt = (
        select(Product)
        .where(Product.product_id == product_id)
        .options(selectinload(Product.variants))
    )
    return db.scalars(stmt).first()
