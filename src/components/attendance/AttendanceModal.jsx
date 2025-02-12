import { useState, useEffect } from "react";

const AttendanceModal = ({ data, onClose }) => {
  const [formData, setFormData] = useState({
    attendance_id: "",
    attendance_date: "",
    employee_name: "",
    time_in_morning: "",
    time_out_morning: "",
    time_in_afternoon: "",
    time_out_afternoon: "",
    days_credited: "",
    overtime_hours: ""
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = data ? "PUT" : "POST";
      const url = data
        ? `http://localhost/central_juan/backend/attendance/update.php?id=${formData.attendance_id}`
        : "http://localhost/central_juan/backend/attendance/create.php";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const resData = await response.json();

      if (resData.success) {
        alert("Attendance record saved successfully!");
        onClose();
      } else {
        alert(resData.message || "Failed to save the record.");
      }
    } catch (error) {
      alert("Error saving record: " + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{data ? "Edit" : "Add"} Attendance</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="attendance_date" placeholder="Date" value={formData.attendance_date} onChange={handleChange} required />
          <input type="text" name="employee_name" placeholder="Employee Name" value={formData.employee_name} onChange={handleChange} required />
          <input type="text" name="time_in_morning" placeholder="Time In (Morning)" value={formData.time_in_morning} onChange={handleChange} />
          <input type="text" name="time_out_morning" placeholder="Time Out (Morning)" value={formData.time_out_morning} onChange={handleChange} />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;
