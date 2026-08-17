from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Date, ForeignKey, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.logistics import Shipment
    from app.db.models.product import ProductVariant
    from app.db.models.warehouse import Warehouse


class Receiving(Base):
    __tablename__ = "receiving"

    receiving_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    # Unique: the diagram's `SHIPMENT ||--o| RECEIVING` cardinality means a
    # shipment has at most one receiving record.
    shipment_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("shipments.shipment_id"), unique=True, nullable=False
    )
    warehouse_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("warehouses.warehouse_id"), nullable=False
    )
    received_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)

    shipment: Mapped["Shipment"] = relationship(back_populates="receiving")
    warehouse: Mapped["Warehouse"] = relationship(back_populates="receivings")
    items: Mapped[list["ReceivingItem"]] = relationship(back_populates="receiving")


class ReceivingItem(Base):
    __tablename__ = "receiving_items"

    receiving_item_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    receiving_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("receiving.receiving_id"), nullable=False
    )
    variant_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("product_variants.variant_id"), nullable=False
    )
    quantity_expected: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity_received: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default=text("0")
    )

    receiving: Mapped["Receiving"] = relationship(back_populates="items")
    variant: Mapped["ProductVariant"] = relationship(back_populates="receiving_items")
