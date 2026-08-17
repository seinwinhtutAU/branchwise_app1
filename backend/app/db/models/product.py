from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.delivery import DeliveryItem
    from app.db.models.procurement import PurchaseItem
    from app.db.models.receiving import ReceivingItem
    from app.db.models.sales import OrderItem
    from app.db.models.warehouse import Inventory


class Product(Base):
    """A style/design, identified by product_code. Not directly orderable -
    see ProductVariant, which is the color/group combination that actually
    gets ordered, purchased, stocked, received, and delivered."""

    __tablename__ = "products"

    product_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    product_code: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)

    variants: Mapped[list["ProductVariant"]] = relationship(back_populates="product")


class ProductVariant(Base):
    """A specific color/group combination of a product. Multiple variants
    can share one product_code - either field may be unset when a variant
    isn't split by color or by group."""

    __tablename__ = "product_variants"

    variant_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("products.product_id"), nullable=False
    )
    color: Mapped[str | None] = mapped_column(String, nullable=True)
    group_name: Mapped[str | None] = mapped_column(String, nullable=True)

    product: Mapped["Product"] = relationship(back_populates="variants")
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="variant")
    purchase_items: Mapped[list["PurchaseItem"]] = relationship(back_populates="variant")
    receiving_items: Mapped[list["ReceivingItem"]] = relationship(back_populates="variant")
    inventory_rows: Mapped[list["Inventory"]] = relationship(back_populates="variant")
    delivery_items: Mapped[list["DeliveryItem"]] = relationship(back_populates="variant")
