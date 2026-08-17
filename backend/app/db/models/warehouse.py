from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, ForeignKey, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.delivery import DeliveryItem
    from app.db.models.product import ProductVariant
    from app.db.models.receiving import Receiving
    from app.db.models.sales import OrderItem


class Warehouse(Base):
    __tablename__ = "warehouses"

    warehouse_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)

    inventory_rows: Mapped[list["Inventory"]] = relationship(back_populates="warehouse")
    receivings: Mapped[list["Receiving"]] = relationship(back_populates="warehouse")


class Inventory(Base):
    __tablename__ = "inventory"

    inventory_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    warehouse_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("warehouses.warehouse_id"), nullable=False
    )
    variant_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("product_variants.variant_id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    reserved_quantity: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default=text("0")
    )
    incoming_quantity: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default=text("0")
    )

    warehouse: Mapped["Warehouse"] = relationship(back_populates="inventory_rows")
    variant: Mapped["ProductVariant"] = relationship(back_populates="inventory_rows")
    stock_allocations: Mapped[list["StockAllocation"]] = relationship(back_populates="inventory")


class StockAllocation(Base):
    __tablename__ = "stock_allocations"

    allocation_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    order_item_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("order_items.order_item_id"), nullable=False
    )
    inventory_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("inventory.inventory_id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    order_item: Mapped["OrderItem"] = relationship(back_populates="stock_allocations")
    inventory: Mapped["Inventory"] = relationship(back_populates="stock_allocations")
    delivery_items: Mapped[list["DeliveryItem"]] = relationship(back_populates="stock_allocation")
