from sqlalchemy import Boolean, Column, Enum, Index, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import sqltypes, func
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)  # id是主鍵
    username = Column(String(50), unique=True)  # 獨一無二的使用者名稱
    print('try')
    # Relationship
    comments = relationship("Comment", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")


class College(Base):
    __tablename__ = 'colleges'

    id = Column(Integer, primary_key=True, index=True)  # 主鍵
    name = Column(String(50))  # 學院名稱

    # Relationship
    professors = relationship("Professor", back_populates="college")
    courses = relationship("Course", back_populates="college")
    departments = relationship("Department", back_populates="college")


class Department(Base):
    __tablename__ = 'departments'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    college_id = Column(Integer, ForeignKey('colleges.id', ondelete='CASCADE'))

    # Relationship
    college = relationship("College", back_populates="departments")
    professors = relationship("Professor", back_populates="department")


class Professor(Base):
    __tablename__ = 'professors'

    id = Column(Integer, primary_key=True, index=True)  # 主鍵
    name = Column(String(50))  # 教師名稱
    department_id = Column(Integer, ForeignKey('departments.id', ondelete='CASCADE'))

    # Relationship
    department = relationship("Department", back_populates="professors")
    courses = relationship("Course", back_populates="professor")


class Course(Base):
    __tablename__ = 'courses'

    id = Column(String(8), primary_key=True, index=True)
    name = Column(String(50), unique=True)
    course_info = Column(String(100))
    course_year = Column(Integer)
    professor_id = Column(Integer, ForeignKey('professors.id', ondelete='CASCADE'))
    department_id = Column(Integer, ForeignKey('departments.id', ondelete='CASCADE'))

    # Relationship
    professor = relationship("Professor", back_populates="courses")
    department = relationship("Department", back_populates="courses")
    comments = relationship("Comment", back_populates="course")
    favorites = relationship("Favorite", back_populates="course")


class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True)  # 主鍵
    score = Column(Integer, CheckConstraint('score >= 1 AND score <= 5', name='check_score_range'))  # 評分範圍
    content = Column(String(100))  # 評論內容
    course_id = Column(String(8), ForeignKey('courses.id', ondelete='CASCADE'))  # 外鍵指向 Course.id
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))  # 外鍵指向 User.id

    # Relationship
    course = relationship("Course", back_populates="comments")
    user = relationship("User", back_populates="comments")


class Favorite(Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    course_id = Column(String(8), ForeignKey('courses.id', ondelete='CASCADE'))

    # Relationship
    user = relationship("User", back_populates="favorites")
    course = relationship("Course", back_populates="favorites")


class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, index=True)  # 管理員 ID
    username = Column(String(50), unique=True, index=True)  # 管理員帳號
    password = Column(String(255))  # 加密後儲存，建議長度足夠以支持哈希值

    # Relationship
    logs = relationship("Log", back_populates="admin")


#管理員可以查看系統日誌紀錄(評論、使用者、系統的紀錄)
class Log(Base):
    __tablename__ = 'logs'

    id = Column(Integer, primary_key=True, index=True)  # 主鍵
    admin_id = Column(Integer, ForeignKey('admins.id', ondelete='CASCADE'))  # 操作的管理員
    entity_type = Column(Enum('comment', 'user', 'system', name='entity_type_enum'))  # 實體類型
    entity_id = Column(String(50), nullable=True)  # 操作對象的 ID（可為 NULL）
    action = Column(String(50))  # 操作類型，例如 'delete', 'edit', 'create'
    description = Column(sqltypes.Text, nullable=True)  # 操作詳細描述
    timestamp = Column(sqltypes.TIMESTAMP(timezone=True), server_default=func.now())  # 操作時間

    __table_args__ = (
        Index('idx_entity_type_id', 'entity_type', 'entity_id'),
        Index('idx_admin_id_timestamp', 'admin_id', 'timestamp'),
    )

    # Relationships
    admin = relationship("Admin", back_populates="logs")

    '''
    entity_type：用於區分日誌記錄的對象類型（如 comment、user、system）。
    entity_id：對應操作的具體對象，例如 comment_id 或 user_id，如果是系統相關的操作則可以為 NULL。
    action：描述操作類型，比如 delete、edit、create 等。
    description：用於記錄詳細的操作描述，特別對於 SystemLog 類型非常有用。
    timestamp：記錄操作發生的時間，保持所有日誌的時間統一性。
    '''
