"""inventory incoming quantity

Revision ID: a08df2a4c941
Revises: ce88b412e89c
Create Date: 2026-08-17 20:14:00.946606

The frontend mock layer already tracked incoming_quantity on Inventory (used
by the Inventory page and Product Detail page), but the column never made
it into the backend model - a schema drift bug, not a new feature.
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a08df2a4c941"
down_revision: str | Sequence[str] | None = "ce88b412e89c"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "inventory",
        sa.Column("incoming_quantity", sa.Integer(), nullable=False, server_default="0"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("inventory", "incoming_quantity")
