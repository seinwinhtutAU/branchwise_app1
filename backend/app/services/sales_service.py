from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Order
from app.schemas.sales import OrderItemUpdate


def list_orders(
    db: Session,
    status: str | None,
    customer_id: int | None,
    q: str | None,
    skip: int,
    limit: int,
) -> list[Order]:
    stmt = select(Order)
    if status:
        stmt = stmt.where(Order.status == status)
    if customer_id:
        stmt = stmt.where(Order.customer_id == customer_id)
    if q:
        stmt = stmt.where(Order.order_no.ilike(f"%{q}%"))
    stmt = stmt.order_by(Order.order_date.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_order(db: Session, order_id: int) -> Order | None:
    stmt = select(Order).where(Order.order_id == order_id).options(selectinload(Order.items))
    return db.scalars(stmt).first()


def update_order_items(db: Session, order_id: int, edits: list[OrderItemUpdate]) -> Order | None:
    order = get_order(db, order_id)
    if not order:
        return None

    edits_by_id = {e.order_item_id: e for e in edits}
    for item in order.items:
        edit = edits_by_id.get(item.order_item_id)
        if edit:
            item.quantity = edit.quantity
            item.price = edit.price

    order.total_amount = sum(
        (item.quantity * item.price for item in order.items), start=Decimal(0)
    )
    db.commit()
    db.refresh(order)
    return order
