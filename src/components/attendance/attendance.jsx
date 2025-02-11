import React, { useEffect, useState } from "react";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("http://localhost/central_juan/backend/attendance/attendance.php");
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

    fetchAttendance();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Attendance Records</h1>
      {loading ? (
        <p>Loading...</p>
      ) : attendanceData.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Time In (Morning)</th>
              <th>Time Out (Morning)</th>
              <th>Time In (Afternoon)</th>
              <th>Time Out (Afternoon)</th>
              <th>Days Credited</th>
              <th>Overtime Hours</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item) => (
              <tr key={item.attendance_id}>
                <td>{item.attendance_date}</td>
                <td>{item.employee_name}</td>
                <td>{item.time_in_morning || "N/A"}</td>
                <td>{item.time_out_morning || "N/A"}</td>
                <td>{item.time_in_afternoon || "N/A"}</td>
                <td>{item.time_out_afternoon || "N/A"}</td>
                <td>{item.days_credited}</td>
                <td>{item.overtime_hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records available.</p>
      )}
    </div>
  );
};

export default Attendance;
