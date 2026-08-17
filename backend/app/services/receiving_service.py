from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Receiving


def list_receivings(
    db: Session, status: str | None, warehouse_id: int | None, skip: int, limit: int
) -> list[Receiving]:
    stmt = select(Receiving)
    if status:
        stmt = stmt.where(Receiving.status == status)
    if warehouse_id:
        stmt = stmt.where(Receiving.warehouse_id == warehouse_id)
    stmt = stmt.order_by(Receiving.received_date.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_receiving(db: Session, receiving_id: int) -> Receiving | None:
    stmt = (
        select(Receiving)
        .where(Receiving.receiving_id == receiving_id)
        .options(selectinload(Receiving.items))
    )
    return db.scalars(stmt).first()
