from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.procurement import Purchase
    from app.db.models.sales import Order


class ExchangeRate(Base):
    """Current rate to convert 1 unit of currency_code into the base
    reporting currency (MMK). Global and single-valued, not a historical
    time series - the row for a currency gets overwritten as rates change."""

    __tablename__ = "exchange_rates"

    currency_code: Mapped[str] = mapped_column(String(3), primary_key=True)
    rate_to_base: Mapped[Decimal] = mapped_column(Numeric(14, 6), nullable=False)

    purchases: Mapped[list["Purchase"]] = relationship(back_populates="currency")
    orders: Mapped[list["Order"]] = relationship(back_populates="currency")
