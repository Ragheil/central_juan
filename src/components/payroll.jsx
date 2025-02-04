import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; // Import Link for navigation

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employee data from the backend API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost/central_juan/backend/employee.php');
        const data = await response.json();
        if (data.message) {
          alert(data.message);
        } else {
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Loading employee data...</div>;
  }

  return (
    <div>
      <h1>Payroll</h1>
      <Link to="/dashboard">
        <button>Back to Dashboard</button> {/* Link to the dashboard */}
      </Link>
      <table>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Birthday</th>
            <th>Gender</th>
            <th>Position</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.emp_id}>
              <td>{employee.emp_id}</td>
              <td>{employee.firstname}</td>
              <td>{employee.lastname}</td>
              <td>{employee.contact_num}</td>
              <td>{employee.address}</td>
              <td>{employee.birthday}</td>
              <td>{employee.gender}</td>
              <td>{employee.position}</td>
              <td>{employee.time_in}</td>
              <td>{employee.time_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payroll;
