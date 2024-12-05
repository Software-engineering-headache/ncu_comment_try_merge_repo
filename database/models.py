from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, CheckConstraint
#用於定義資料庫的列型別（Column、Integer、String）和其他屬性（例如主鍵 primary_key 和索引 index）
from database import Base #它是 SQLAlchemy 中用於創建模型的基礎類

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True) #id是主鍵，index就是代表他可以成為索引
    username = Column(String(50), unique=True) #因為名字不像id一定是獨一的，但我們希望是獨一，所以unique=True

class College(Base):
    __tablename__ = 'colleges'

    id = Column(Integer, primary_key=True, index=True)  # 主鍵
    name = Column(String(50))  # 學院名稱
    department_id = Column(Integer, unique=True, index=True)  # 科系 ID
    department_name = Column(String(50))  # 科系名稱

class Professor(Base):
    __tablename__ = 'professors'

    id = Column(Integer, primary_key=True, index=True)  # 主鍵
    name = Column(String(50))  # 教師名稱
    department_id = Column(Integer, ForeignKey('colleges.department_id'))  # 學院外鍵
    
class Course(Base):
    __tablename__ = 'courses'

    id = Column(String(8), primary_key=True, index=True) # 課程編號，比如IM4043-*
    name = Column(String(50), unique=True)  # 唯一課程名稱
    course_info = Column(String(100))  # 課程資訊
    course_year = Column(Integer)  # 開課年份
    professor_id = Column(Integer, ForeignKey('professors.id'))  # 教授外鍵
    department_id = Column(Integer, ForeignKey('colleges.department_id'))  # 學院外鍵

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True) #id是主鍵，index就是代表他可以成為索引
    score = Column(Integer) #
    content = Column(String(100))
    course_id = Column(String(8), ForeignKey('courses.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

    __table_args__ = (
        CheckConstraint('score >= 1 AND score <= 5', name='check_score_range'),
        #希望評分是1~5分之間
    )

class Favorite(Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    course_id = Column(String(8), ForeignKey('courses.id'))