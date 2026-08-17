from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Date, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.factory import Factory
    from app.db.models.packaging import PackageItem
    from app.db.models.product import Product
    from app.db.models.sales import OrderItem


class Purchase(Base):
    __tablename__ = "purchases"

    purchase_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    purchase_no: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    factory_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("factories.factory_id"), nullable=False
    )
    purchase_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)

    factory: Mapped["Factory"] = relationship(back_populates="purchases")
    items: Mapped[list["PurchaseItem"]] = relationship(back_populates="purchase")


class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    purchase_item_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    purchase_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("purchases.purchase_id"), nullable=False
    )
    product_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("products.product_id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    buying_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    purchase: Mapped["Purchase"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship(back_populates="purchase_items")
    allocations: Mapped[list["PurchaseAllocation"]] = relationship(back_populates="purchase_item")


class PurchaseAllocation(Base):
    __tablename__ = "purchase_allocations"

    allocation_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    purchase_item_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("purchase_items.purchase_item_id"), nullable=False
    )
    order_item_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("order_items.order_item_id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    purchase_item: Mapped["PurchaseItem"] = relationship(back_populates="allocations")
    order_item: Mapped["OrderItem"] = relationship(back_populates="purchase_allocations")
    package_items: Mapped[list["PackageItem"]] = relationship(back_populates="allocation")
