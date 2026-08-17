from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Shipment


def list_shipments(
    db: Session, status: str | None, q: str | None, skip: int, limit: int
) -> list[Shipment]:
    stmt = select(Shipment)
    if status:
        stmt = stmt.where(Shipment.status == status)
    if q:
        stmt = stmt.where(Shipment.shipment_no.ilike(f"%{q}%"))
    stmt = stmt.order_by(Shipment.shipment_date.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_shipment(db: Session, shipment_id: int) -> Shipment | None:
    stmt = (
        select(Shipment)
        .where(Shipment.shipment_id == shipment_id)
        .options(selectinload(Shipment.legs))
    )
    return db.scalars(stmt).first()
