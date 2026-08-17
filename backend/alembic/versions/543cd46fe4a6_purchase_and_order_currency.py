"""purchase and order currency

Revision ID: 543cd46fe4a6
Revises: 2532bef40d09
Create Date: 2026-08-17 20:14:44.914541

Existing rows default to MMK (the base currency) since historical data
didn't record which currency it was in; new rows should set this
explicitly at creation time.
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "543cd46fe4a6"
down_revision: str | Sequence[str] | None = "2532bef40d09"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "purchases",
        sa.Column("currency_code", sa.String(length=3), nullable=False, server_default="MMK"),
    )
    op.create_foreign_key(
        None, "purchases", "exchange_rates", ["currency_code"], ["currency_code"]
    )
    op.add_column(
        "orders",
        sa.Column("currency_code", sa.String(length=3), nullable=False, server_default="MMK"),
    )
    op.create_foreign_key(None, "orders", "exchange_rates", ["currency_code"], ["currency_code"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("orders", "currency_code")
    op.drop_column("purchases", "currency_code")
