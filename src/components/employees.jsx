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
        const response = await fetch('http://localhost/central_juan/backend/employees.php');
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
      alert('Navigating to add employee form...');
    } else {
      alert('Only admins can add employees.');
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    if (role === 'admin') {
      alert(`Employee with ID ${employeeId} deleted.`);
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
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Date of Birth</th>
              <th>Department ID</th>
              <th>Position Title</th>
              <th>Edit</th>
              {role === 'admin' && <th>Delete</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_id}</td>
                <td>{employee.first_name}</td>
                <td>{employee.middle_name || 'N/A'}</td>
                <td>{employee.last_name}</td>
                <td>{employee.email}</td>
                <td>{employee.contact_number}</td>
                <td>{new Date(employee.date_of_birth).toLocaleDateString()}</td>
                <td>{employee.department_id || 'N/A'}</td>
                <td>{employee.position_title || 'N/A'}</td>
                <td>
                  <button onClick={() => handleEditClick(employee)}>Edit</button>
                </td>
                {role === 'admin' && (
                  <td>
                    <button onClick={() => handleDeleteEmployee(employee.employee_id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Payroll;
