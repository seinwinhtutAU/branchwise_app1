from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.logistics import ShipmentPackage
    from app.db.models.procurement import PurchaseAllocation


class Package(Base):
    __tablename__ = "packages"

    package_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    package_no: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)

    items: Mapped[list["PackageItem"]] = relationship(back_populates="package")
    shipment_links: Mapped[list["ShipmentPackage"]] = relationship(back_populates="package")


class PackageItem(Base):
    """A packed quantity of stock set aside for one customer order (a
    purchase_allocation), not a raw product+purchase. A package can therefore
    hold items sourced from several purchases and destined for several
    customer orders — packing follows the shipment/destination, not any
    single purchase order."""

    __tablename__ = "package_items"

    package_item_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    package_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("packages.package_id"), nullable=False
    )
    purchase_allocation_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("purchase_allocations.allocation_id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    package: Mapped["Package"] = relationship(back_populates="items")
    allocation: Mapped["PurchaseAllocation"] = relationship(back_populates="package_items")
