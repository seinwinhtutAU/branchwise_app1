from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.procurement import PurchaseAllocation
    from app.db.models.product import ProductVariant
    from app.db.models.sales import Order
    from app.db.models.warehouse import StockAllocation


class Delivery(Base):
    __tablename__ = "deliveries"

    delivery_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("orders.order_id"), nullable=False)
    # expected_delivery_date is the target set when scheduling; delivery_date is
    # only filled in once the delivery is actually confirmed (status="delivered").
    # We can't promise the target will hold, so the two are tracked separately.
    expected_delivery_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    delivery_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False)

    order: Mapped["Order"] = relationship(back_populates="deliveries")
    items: Mapped[list["DeliveryItem"]] = relationship(back_populates="delivery")


class DeliveryItem(Base):
    __tablename__ = "delivery_items"

    delivery_item_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    delivery_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("deliveries.delivery_id"), nullable=False
    )
    variant_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("product_variants.variant_id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    # Exactly one of these is set, depending on how this line was fulfilled:
    # stock_allocation_id when it shipped from warehouse stock, or
    # purchase_allocation_id when it went straight from a purchase to the
    # customer without ever passing through a warehouse.
    stock_allocation_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("stock_allocations.allocation_id"), nullable=True
    )
    purchase_allocation_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("purchase_allocations.allocation_id"), nullable=True
    )

    delivery: Mapped["Delivery"] = relationship(back_populates="items")
    variant: Mapped["ProductVariant"] = relationship(back_populates="delivery_items")
    stock_allocation: Mapped["StockAllocation | None"] = relationship(
        back_populates="delivery_items"
    )
    purchase_allocation: Mapped["PurchaseAllocation | None"] = relationship(
        back_populates="delivery_items"
    )
