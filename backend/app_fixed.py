from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, Employee, Attendance, Task, Event
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
CORS(app)

# --- Các route API ở đây ---

@app.route('/api/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    return jsonify([{'id': e.id, 'name': e.name, 'code': e.code} for e in employees])

@app.route('/api/employees', methods=['POST'])
def add_employee():
    data = request.json
    emp = Employee(name=data['name'], code=data['code'])
    db.session.add(emp)
    db.session.commit()
    return jsonify({'success': True})
@app.route('/api/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    emp = Employee.query.get(employee_id)
    if not emp:
        return jsonify({'message': 'Không tìm thấy nhân viên.'}), 404
    db.session.delete(emp)
    db.session.commit()
    return jsonify({'message': 'Xóa nhân viên thành công.'}), 200

@app.route('/api/checkin', methods=['POST'])
def check_in():
    data = request.json
    employee_code = data['code']
    today = datetime.date.today()
    now = datetime.datetime.now().time()

    emp = Employee.query.filter_by(code=employee_code).first()
    if not emp:
        return jsonify({'success': False, 'message': 'Không tìm thấy mã nhân viên!'}), 404

    att = Attendance.query.filter_by(employee_id=emp.id, date=today).first()
    if att and att.check_in:
        return jsonify({'success': False, 'message': 'Đã chấm công vào hôm nay rồi!'}), 400

    if not att:
        att = Attendance(employee_id=emp.id, date=today, check_in=now)
        db.session.add(att)
    else:
        att.check_in = now
    db.session.commit()
    return jsonify({'success': True, 'message': 'Chấm công vào thành công!'})

@app.route('/api/checkout', methods=['POST'])
def check_out():
    data = request.json
    employee_code = data['code']
    today = datetime.date.today()
    now = datetime.datetime.now().time()

    emp = Employee.query.filter_by(code=employee_code).first()
    if not emp:
        return jsonify({'success': False, 'message': 'Không tìm thấy mã nhân viên!'}), 404

    att = Attendance.query.filter_by(employee_id=emp.id, date=today).first()
    if not att or not att.check_in:
        return jsonify({'success': False, 'message': 'Chưa chấm công vào hôm nay!'}), 400
    if att.check_out:
        return jsonify({'success': False, 'message': 'Đã chấm công ra hôm nay rồi!'}), 400

    att.check_out = now
    db.session.commit()
    return jsonify({'success': True, 'message': 'Chấm công ra thành công!'})
# Thêm task cho từng nhân viên trong ngày
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    employee_code = data['code']
    description = data['description']
    today = datetime.date.today()

    emp = Employee.query.filter_by(code=employee_code).first()
    if not emp:
        return jsonify({'success': False, 'message': 'Không tìm thấy mã nhân viên!'}), 404

    task = Task(employee_id=emp.id, date=today, description=description, completed=False)
    db.session.add(task)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Tạo task thành công!'})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    employee_code = request.args.get('code')
    today = datetime.date.today()
    emp = Employee.query.filter_by(code=employee_code).first()
    if not emp:
        return jsonify({'success': False, 'message': 'Không tìm thấy mã nhân viên!'}), 404

    tasks = Task.query.filter_by(employee_id=emp.id, date=today).all()
    return jsonify([{
        'id': t.id,
        'description': t.description,
        'completed': t.completed
    } for t in tasks])
@app.route('/api/tasks/<int:task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'success': False, 'message': 'Không tìm thấy task!'}), 404

    task.completed = True
    db.session.commit()
    return jsonify({'success': True, 'message': 'Đã tích hoàn thành task!'})
@app.route('/api/events', methods=['POST'])
def add_event():
    data = request.json
    title = data['title']
    event_date = data['event_date']  # "YYYY-MM-DD"
    notes = data.get('notes', '')

    try:
        dt = datetime.datetime.strptime(event_date, "%Y-%m-%d").date()
    except Exception:
        return jsonify({'success': False, 'message': 'Định dạng ngày không hợp lệ!'}), 400

    event = Event(title=title, event_date=dt, notes=notes)
    db.session.add(event)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Tạo sự kiện thành công!'})
@app.route('/api/events', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.event_date).all()
    return jsonify([{
        'id': e.id,
        'title': e.title,
        'event_date': e.event_date.strftime("%Y-%m-%d"),
        'notes': e.notes
    } for e in events])
@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'success': False, 'message': 'Không tìm thấy sự kiện!'}), 404
    db.session.delete(event)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Xoá sự kiện thành công!'})
import io
from flask import send_file


@app.route('/api/attendance/export', methods=['GET'])
def export_attendance():
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws.append(["Tên nhân viên", "Mã NV", "Ngày", "Giờ vào", "Giờ ra"])

    records = Attendance.query.join(Employee, Attendance.employee_id == Employee.id).all()
    for att in records:
        emp = Employee.query.get(att.employee_id)
        ws.append([
            emp.name,
            emp.code,
            att.date.strftime("%Y-%m-%d"),
            att.check_in.strftime("%H:%M:%S") if att.check_in else "",
            att.check_out.strftime("%H:%M:%S") if att.check_out else ""
        ])
@app.route('/api/attendance/all', methods=['GET'])
def get_all_attendance_today():
    date_str = request.args.get("date")
    if date_str:
        try:
            today = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        except Exception:
            today = datetime.date.today()
    else:
        today = datetime.date.today()
    records = Attendance.query.filter_by(date=today).all()
    data = []
    for att in records:
        emp = Employee.query.get(att.employee_id)
        data.append({
            'name': emp.name,
            'code': emp.code,
            'check_in': att.check_in.strftime("%H:%M:%S") if att.check_in else "",
            'check_out': att.check_out.strftime("%H:%M:%S") if att.check_out else "",
        })
    return jsonify(data)

@app.route('/api/tasks/all', methods=['GET'])
def get_all_tasks_today():
    date_str = request.args.get("date")
    if date_str:
        try:
            today = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
        except Exception:
            today = datetime.date.today()
    else:
        today = datetime.date.today()
    records = Task.query.filter_by(date=today).all()
    data = []
    for task in records:
        emp = Employee.query.get(task.employee_id)
        data.append({
            'id': task.id,   # <--- THÊM DÒNG NÀY
            'name': emp.name,
            'code': emp.code,
            'description': task.description,
            'completed': task.completed
        })
    return jsonify(data)

@app.route('/api/attendance/dates-in-month', methods=['GET'])
def get_attendance_dates_in_month():
    month_str = request.args.get("month")  # "2025-07"
    if not month_str:
        return jsonify([])
    year, month = [int(x) for x in month_str.split("-")]
    from calendar import monthrange
    num_days = monthrange(year, month)[1]
    from datetime import date
    dates = []
    for d in range(1, num_days + 1):
        day = date(year, month, d)
        exists = Attendance.query.filter_by(date=day).first()
        if exists:
            dates.append(day.strftime("%Y-%m-%d"))
    return jsonify(dates)
@app.route('/api/tasks/dates-in-month', methods=['GET'])
def get_task_dates_in_month():
    month_str = request.args.get("month")
    if not month_str:
        return jsonify([])
    year, month = [int(x) for x in month_str.split("-")]
    from calendar import monthrange
    num_days = monthrange(year, month)[1]
    from datetime import date
    dates = []
    for d in range(1, num_days + 1):
        day = date(year, month, d)
        exists = Task.query.filter_by(date=day).first()
        if exists:
            dates.append(day.strftime("%Y-%m-%d"))
    return jsonify(dates)
@app.route('/api/tasks/duplicate-to-end-of-month', methods=['POST'])
def duplicate_tasks_to_end_of_month():
    data = request.json
    date_str = data.get("date")  # yyyy-mm-dd
    if not date_str:
        return jsonify({"error": "Missing date"}), 400

    from datetime import datetime, timedelta
    base_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    year, month = base_date.year, base_date.month

    # Lấy tất cả task của ngày này
    tasks = Task.query.filter_by(date=base_date).all()

    if not tasks:
        return jsonify({"error": "No tasks to duplicate"}), 400

    # Tính các ngày còn lại trong tháng (từ base_date+1 -> ngày cuối tháng)
    import calendar
    last_day = calendar.monthrange(year, month)[1]
    target_days = [base_date + timedelta(days=i)
                   for i in range(1, last_day - base_date.day + 1)]

    created_count = 0
    for day in target_days:
        for t in tasks:
            # Chỉ tạo nếu chưa có task cùng nhân viên, cùng nội dung, cùng ngày đó
            exists = Task.query.filter_by(
                employee_id=t.employee_id,
                description=t.description,
                date=day
            ).first()
            if not exists:
                new_task = Task(
                    employee_id=t.employee_id,
                    description=t.description,
                    date=day,
                    completed=False  # task mới mặc định chưa hoàn thành
                )
                db.session.add(new_task)
                created_count += 1
    db.session.commit()
    return jsonify({"message": f"Đã sao chép {created_count} tác vụ cho các ngày còn lại trong tháng!"}), 200
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    from app_fixed import db, Task
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200

    # Ghi ra file ảo và trả về
    file_stream = io.BytesIO()
    wb.save(file_stream)
    file_stream.seek(0)
    return send_file(file_stream, download_name="attendance.xlsx", as_attachment=True)

# --- Kết thúc các hàm route, CHỈ SAU ĐÓ mới tới đoạn này ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
