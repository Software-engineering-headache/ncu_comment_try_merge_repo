"""your migration message

Revision ID: 73fffdf55e83
Revises: 938df895f095
Create Date: 2024-12-11 13:38:26.409590

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '73fffdf55e83'
down_revision: Union[str, None] = '938df895f095'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('char_count', sa.Integer(), nullable=True),
    sa.Column('action', sa.String(length=50), nullable=True),
    sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('admin_id', sa.String(length=20), nullable=True),
    sa.ForeignKeyConstraint(['admin_id'], ['users.studentId'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_logs_id'), 'logs', ['id'], unique=False)
    op.create_table('course_professors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('course_id', sa.String(length=8), nullable=True),
    sa.Column('professor_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ),
    sa.ForeignKeyConstraint(['professor_id'], ['professors.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_course_professors_id'), 'course_professors', ['id'], unique=False)
    op.alter_column('comments', 'time',
               existing_type=mysql.VARCHAR(length=50),
               type_=sa.DateTime(timezone=True),
               existing_nullable=True)
    op.drop_constraint('courses_ibfk_2', 'courses', type_='foreignkey')
    op.drop_column('courses', 'professor_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('courses', sa.Column('professor_id', mysql.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('courses_ibfk_2', 'courses', 'professors', ['professor_id'], ['id'])
    op.alter_column('comments', 'time',
               existing_type=sa.DateTime(timezone=True),
               type_=mysql.VARCHAR(length=50),
               existing_nullable=True)
    op.drop_index(op.f('ix_course_professors_id'), table_name='course_professors')
    op.drop_table('course_professors')
    op.drop_index(op.f('ix_logs_id'), table_name='logs')
    op.drop_table('logs')
    # ### end Alembic commands ###