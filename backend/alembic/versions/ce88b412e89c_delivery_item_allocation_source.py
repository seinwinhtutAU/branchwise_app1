"""delivery item allocation source

Revision ID: ce88b412e89c
Revises: ae2aad6b2c97
Create Date: 2026-08-17 19:55:05.500092

Not every delivery ships from warehouse stock - some products go straight
from a purchase to the customer without ever being received into a
warehouse. delivery_items gets two nullable sourcing FKs so either path is
traceable: stock_allocation_id for warehouse-fulfilled lines, or
purchase_allocation_id for direct-to-customer lines. Exactly one is expected
to be set per line; this isn't enforced at the DB level.
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ce88b412e89c"
down_revision: str | Sequence[str] | None = "ae2aad6b2c97"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "delivery_items", sa.Column("stock_allocation_id", sa.BigInteger(), nullable=True)
    )
    op.add_column(
        "delivery_items", sa.Column("purchase_allocation_id", sa.BigInteger(), nullable=True)
    )
    op.create_foreign_key(
        None, "delivery_items", "stock_allocations", ["stock_allocation_id"], ["allocation_id"]
    )
    op.create_foreign_key(
        None,
        "delivery_items",
        "purchase_allocations",
        ["purchase_allocation_id"],
        ["allocation_id"],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("delivery_items", "purchase_allocation_id")
    op.drop_column("delivery_items", "stock_allocation_id")
