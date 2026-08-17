"""exchange rates

Revision ID: 2532bef40d09
Revises: a08df2a4c941
Create Date: 2026-08-17 20:14:17.968851

Factories are paid in their own local currency (THB, CNY, BDT, VND) while
customers pay in MMK - amounts weren't comparable without knowing which
currency each one was in. This adds a single global rate-to-MMK per
currency (current rate, not a historical time series) so Purchase/Order
amounts can carry a currency and be converted to a common reporting figure.
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "2532bef40d09"
down_revision: str | Sequence[str] | None = "a08df2a4c941"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

exchange_rates_table = sa.table(
    "exchange_rates",
    sa.column("currency_code", sa.String),
    sa.column("rate_to_base", sa.Numeric),
)


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "exchange_rates",
        sa.Column("currency_code", sa.String(length=3), nullable=False),
        sa.Column("rate_to_base", sa.Numeric(14, 6), nullable=False),
        sa.PrimaryKeyConstraint("currency_code"),
    )
    op.bulk_insert(
        exchange_rates_table,
        [
            {"currency_code": "MMK", "rate_to_base": 1},
            {"currency_code": "THB", "rate_to_base": 60},
            {"currency_code": "CNY", "rate_to_base": 290},
            {"currency_code": "BDT", "rate_to_base": 19},
            {"currency_code": "VND", "rate_to_base": 0.085},
        ],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("exchange_rates")
