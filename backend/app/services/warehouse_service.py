from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Inventory


def list_inventory(
    db: Session, warehouse_id: int | None, variant_id: int | None, skip: int, limit: int
) -> list[Inventory]:
    stmt = select(Inventory)
    if warehouse_id:
        stmt = stmt.where(Inventory.warehouse_id == warehouse_id)
    if variant_id:
        stmt = stmt.where(Inventory.variant_id == variant_id)
    stmt = stmt.offset(skip).limit(limit)
    return list(db.scalars(stmt))
