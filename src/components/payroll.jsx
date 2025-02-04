import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../frontend/components/payroll.css';

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = localStorage.getItem('role') || 'N/A';
  const POLL_INTERVAL_MS = 5000;

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
    const interval = setInterval(fetchEmployees, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleAddEmployee = () => {
    if (role === 'admin') {
      // Navigate to add employee form or show form
      alert('Navigating to add employee form...');
    } else {
      alert('Only admins can add employees.');
    }
  };

  const handleDeleteEmployee = (empId) => {
    if (role === 'admin') {
      // Delete employee request here
      alert(`Employee with ID ${empId} deleted.`);
    } else {
      alert('Only admins can delete employees.');
    }
  };

  return (
    <div>
      <h1>Payroll</h1>
      <p>Role: <strong>{role}</strong></p>
      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
      {role === 'admin' && (
        <button onClick={handleAddEmployee}>Add Employee</button>
      )}
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
            <th>Edit</th>
            {role === 'admin' && <th>Delete</th>}
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
              <td>{new Date(employee.birthday).toLocaleDateString()}</td>
              <td>{employee.gender}</td>
              <td>{employee.position}</td>
              <td>{employee.time_in}</td>
              <td>{employee.time_out}</td>
              <td>
                <button onClick={() => handleEditClick(employee)}>Edit</button>
              </td>
              {role === 'admin' && (
                <td>
                  <button onClick={() => handleDeleteEmployee(employee.emp_id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payroll;
