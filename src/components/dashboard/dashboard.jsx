import { useEffect, useState } from "react";
import { useSession } from "../../context/SessionContext";
import { useNavigate } from "react-router-dom";
import "../../../Styles/dashboard/dashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default CSS for the calendar

function Dashboard() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [date, setDate] = useState(new Date()); // Selected date
  const [tasks, setTasks] = useState({}); // Object to store tasks per date
  const [note, setNote] = useState(""); // Input field note

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch employee count
        const employeeResponse = await fetch(
          "http://10.0.254.104/central_juan/backend/employeesSide/employees.php?count=true"
        );
        if (employeeResponse.ok) {
          const data = await employeeResponse.json();
          setEmployeeCount(data.total_count);
        } else {
          console.error("Failed to fetch employee count");
        }

        // Fetch department count
        const departmentResponse = await fetch(
          "http://10.0.254.104/central_juan/backend/departments/department.php?count=true"
        );
        if (departmentResponse.ok) {
          const departmentData = await departmentResponse.json();
          setDepartmentCount(departmentData.total_departments);
        } else {
          console.error("Failed to fetch department count");
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
    loadTasks(); // Load tasks from local storage
  }, []);

  // Function to handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate);
    setNote(tasks[newDate.toDateString()] || ""); // Load note for selected date
  };

  // Load tasks from local storage
  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    setTasks(savedTasks);
  };

  // Save task to local storage
  const saveTask = () => {
    const updatedTasks = { ...tasks, [date.toDateString()]: note };
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Delete task for selected date
  const deleteTask = () => {
    const updatedTasks = { ...tasks };
    delete updatedTasks[date.toDateString()];
    setTasks(updatedTasks);
    setNote(""); // Clear input field
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return (
    <div className="main_dashboard flex flex-col h-screen w-full">
      <div className="dashboard_head flex flex-1 flex-row">
        <div className="left_head flex flex-3 m-1 w-full">
          <p className="font-[Albert_Sans] text-[50px]">
            Hello{" "}
            <span
              className={` ${
                user?.role === "Admin" ? "font-bold" : "font-normal"
              }`}
            >
              {user?.role === "Admin" ? "Admin" : user?.role || "Guest"}
            </span>
          </p>
        </div>
        <div className="right_head flex flex-1 flex-row m-1 w-full justify-end items-center">
          <div className="Employee_count flex-col flex flex-1 justify-end h-full m-1">
            <div className="text-9xl flex justify-end">
              {(employeeCount ?? 0).toString().padStart(2, "0")}
            </div>
            <p className="text-3xl">Employee</p>
          </div>

          <div className="deparment_count flex-col flex flex-1 justify-end h-full m-1">
            <div className="text-9xl flex justify-end">
              {(departmentCount ?? 0).toString().padStart(2, "0")}
            </div>
            <p className="text-3xl">Department</p>
          </div>
        </div>
      </div>
      <div className="dashboard_content flex-row flex flex-4">
        <div className="date_task_right flex flex-col flex-1 m-1 w-full h-full bg-amber-50">
          <div className="callendar_container flex justify-center ">
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="react-calendar"
              tileClassName={({ date }) =>
                tasks[date.toDateString()] ? "task-date" : ""
              }
            />
          </div>
          <div className="task_note_container  p-4">
            <h2 className="text-lg font-bold">Task for {date.toDateString()}</h2>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Write your task here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-between mt-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={saveTask}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={deleteTask}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className="left_container flex flex-2 m-1 w-full h-full bg-amber-50">
          <div className="right_container flex w-full h-full flex-col">
            <div className="top_container flex flex-1 m-1 bg-amber-950"></div>
            <div className="low_container flex flex-1 m-1 bg-amber-950"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
