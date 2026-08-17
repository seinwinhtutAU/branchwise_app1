from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Delivery, DeliveryItem
from app.schemas.delivery import DeliveryCreate


def list_deliveries(
    db: Session, status: str | None, order_id: int | None, skip: int, limit: int
) -> list[Delivery]:
    stmt = select(Delivery)
    if status:
        stmt = stmt.where(Delivery.status == status)
    if order_id:
        stmt = stmt.where(Delivery.order_id == order_id)
    stmt = stmt.offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_delivery(db: Session, delivery_id: int) -> Delivery | None:
    stmt = (
        select(Delivery)
        .where(Delivery.delivery_id == delivery_id)
        .options(selectinload(Delivery.items))
    )
    return db.scalars(stmt).first()


def create_delivery(db: Session, payload: DeliveryCreate) -> Delivery:
    delivery = Delivery(
        order_id=payload.order_id,
        expected_delivery_date=payload.expected_delivery_date,
        delivery_date=None,
        status="pending",
    )
    db.add(delivery)
    db.flush()

    for line in payload.lines:
        if line.quantity <= 0:
            continue
        db.add(
            DeliveryItem(
                delivery_id=delivery.delivery_id,
                variant_id=line.variant_id,
                quantity=line.quantity,
                stock_allocation_id=None,
                purchase_allocation_id=None,
            )
        )

    db.commit()
    db.refresh(delivery)
    return delivery


def mark_delivered(db: Session, delivery_id: int) -> Delivery | None:
    delivery = db.get(Delivery, delivery_id)
    if not delivery:
        return None
    delivery.status = "delivered"
    delivery.delivery_date = date.today()
    db.commit()
    db.refresh(delivery)
    return delivery
