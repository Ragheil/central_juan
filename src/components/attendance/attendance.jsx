import React, { useEffect, useState } from "react";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]); // State to hold attendance data
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("http://localhost/central_juan/backend/attendance/attendance.php");
        const data = await response.json();

        if (data.success) {
          setAttendanceData(data.data); // Set attendance data if fetch is successful
        } else {
          alert(data.message || "Failed to fetch attendance data."); // Alert if fetch fails
        }
      } catch (error) {
        alert("Error fetching attendance: " + error.message); // Alert on error
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchAttendance(); // Call the fetch function
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Attendance Records</h1>
      {loading ? (
        <p>Loading...</p> // Show loading message while fetching data
      ) : attendanceData.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Attendance ID</th> {/* New column for Attendance ID */}
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
                <td>{item.attendance_id}</td> {/* Display Attendance ID */}
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
        <p>No attendance records available.</p> // Message if no records are found
      )}
    </div>
  );
};

export default Attendance;