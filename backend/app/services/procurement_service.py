from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Purchase


def list_purchases(
    db: Session,
    status: str | None,
    factory_id: int | None,
    q: str | None,
    skip: int,
    limit: int,
) -> list[Purchase]:
    stmt = select(Purchase)
    if status:
        stmt = stmt.where(Purchase.status == status)
    if factory_id:
        stmt = stmt.where(Purchase.factory_id == factory_id)
    if q:
        stmt = stmt.where(Purchase.purchase_no.ilike(f"%{q}%"))
    stmt = stmt.order_by(Purchase.purchase_date.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_purchase(db: Session, purchase_id: int) -> Purchase | None:
    stmt = (
        select(Purchase)
        .where(Purchase.purchase_id == purchase_id)
        .options(selectinload(Purchase.items))
    )
    return db.scalars(stmt).first()
