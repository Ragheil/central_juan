import { useEffect, useState } from "react";
import AttendanceModal from "./AttendanceModal";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || { role: "guest" });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://10.0.254.104/central_juan/backend/attendance/attendance.php");
      const data = await response.json();

      if (data.success) {
        setAttendanceData(data.data);
      } else {
        alert(data.message || "Failed to fetch attendance data.");
      }
    } catch (error) {
      alert("Error fetching attendance: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await fetch(`http://10.0.254.104/central_juan/backend/attendance/delete.php?id=${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          alert("Record deleted successfully!");
          fetchAttendance();
        } else {
          alert(data.message || "Failed to delete the record.");
        }
      } catch (error) {
        alert("Error deleting record: " + error.message);
      }
    }
  };

  const openModal = (data = null) => {
    setModalData(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalData(null);
    setModalVisible(false);
    fetchAttendance(); // Refresh after create/edit
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Attendance Records</h1>
      <p>Welcome, {user?.username || 'Guest'} (Role: {user?.role || 'N/A'})</p>

      {user?.role === "admin" && (
        <button onClick={() => openModal()}>Add Attendance</button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : attendanceData.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Attendance ID</th>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Time In (Morning)</th>
              <th>Time Out (Morning)</th>
              <th>Time In (Afternoon)</th>
              <th>Time Out (Afternoon)</th>
              <th>Days Credited</th>
              <th>Overtime Hours</th>
              {user?.role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item) => (
              <tr key={item.attendance_id}>
                <td>{item.attendance_id}</td>
                <td>{item.attendance_date}</td>
                <td>{item.employee_name}</td>
                <td>{item.time_in_morning || "N/A"}</td>
                <td>{item.time_out_morning || "N/A"}</td>
                <td>{item.time_in_afternoon || "N/A"}</td>
                <td>{item.time_out_afternoon || "N/A"}</td>
                <td>{item.days_credited}</td>
                <td>{item.overtime_hours}</td>
                {user?.role === "admin" && (
                  <td>
                    <button onClick={() => openModal(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.attendance_id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records available.</p>
      )}

      {modalVisible && (
        <AttendanceModal
          data={modalData}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Attendance;
