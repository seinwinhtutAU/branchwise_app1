from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Date, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.currency import ExchangeRate
    from app.db.models.customer import Customer
    from app.db.models.delivery import Delivery
    from app.db.models.procurement import PurchaseAllocation
    from app.db.models.product import ProductVariant
    from app.db.models.warehouse import StockAllocation


class Order(Base):
    __tablename__ = "orders"

    order_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    order_no: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    customer_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("customers.customer_id"), nullable=False
    )
    order_date: Mapped[date] = mapped_column(Date, nullable=False)
    source: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency_code: Mapped[str] = mapped_column(
        String(3), ForeignKey("exchange_rates.currency_code"), nullable=False
    )

    customer: Mapped["Customer"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order")
    deliveries: Mapped[list["Delivery"]] = relationship(back_populates="order")
    currency: Mapped["ExchangeRate"] = relationship(back_populates="orders")


class OrderItem(Base):
    __tablename__ = "order_items"

    order_item_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("orders.order_id"), nullable=False)
    variant_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("product_variants.variant_id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    order: Mapped["Order"] = relationship(back_populates="items")
    variant: Mapped["ProductVariant"] = relationship(back_populates="order_items")
    purchase_allocations: Mapped[list["PurchaseAllocation"]] = relationship(
        back_populates="order_item"
    )
    stock_allocations: Mapped[list["StockAllocation"]] = relationship(back_populates="order_item")
