from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Package


def list_packages(
    db: Session, status: str | None, q: str | None, skip: int, limit: int
) -> list[Package]:
    stmt = select(Package)
    if status:
        stmt = stmt.where(Package.status == status)
    if q:
        stmt = stmt.where(Package.package_no.ilike(f"%{q}%"))
    stmt = stmt.order_by(Package.package_no).offset(skip).limit(limit)
    return list(db.scalars(stmt))


def get_package(db: Session, package_id: int) -> Package | None:
    stmt = (
        select(Package).where(Package.package_id == package_id).options(selectinload(Package.items))
    )
    return db.scalars(stmt).first()
