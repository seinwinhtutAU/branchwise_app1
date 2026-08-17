from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.delivery import DeliveryItem
    from app.db.models.procurement import PurchaseItem
    from app.db.models.receiving import ReceivingItem
    from app.db.models.sales import OrderItem
    from app.db.models.warehouse import Inventory


class Product(Base):
    __tablename__ = "products"

    product_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    product_code: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    color: Mapped[str | None] = mapped_column(String, nullable=True)
    size: Mapped[str | None] = mapped_column(String, nullable=True)

    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="product")
    purchase_items: Mapped[list["PurchaseItem"]] = relationship(back_populates="product")
    receiving_items: Mapped[list["ReceivingItem"]] = relationship(back_populates="product")
    inventory_rows: Mapped[list["Inventory"]] = relationship(back_populates="product")
    delivery_items: Mapped[list["DeliveryItem"]] = relationship(back_populates="product")
