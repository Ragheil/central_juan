import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../frontend/components/employees.css';

function Employees() {
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

  // Function to update employee data
  const updateEmployee = async (employeeData) => {
    try {
      const response = await fetch('http://localhost/central_juan/backend/employees.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Get response text to log error details
        console.error('Error response:', errorData);
        throw new Error('Error updating employee');
      }

      const data = await response.json();
      console.log('Employee updated successfully:', data);
      alert('Employee updated successfully!');
    } catch (error) {
      console.error("Error in fetch request:", error);
      alert('Error updating employee.');
    }
  };

  // Handle edit button click to open modal
  const handleEditClick = (employee) => {
    if (role === 'hr' || role === 'admin') {
      setSelectedEmployee(employee);
      setIsModalOpen(true);
    } else {
      alert('You do not have permission to edit employees.');
    }
  };

  // Handle delete button click to confirm deletion
  const handleDeleteClick = async (employeeId) => {
    if (role !== 'admin') {
      alert('You do not have permission to delete employees.');
      return;
    }
  
    const confirmDelete = window.confirm(`Are you sure you want to delete Employee ${employeeId}?`);
    if (confirmDelete) {
      try {
        const response = await fetch('http://localhost/central_juan/backend/employees.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId }),
        });
  
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          setEmployees((prevEmployees) =>
            prevEmployees.filter((employee) => employee.employee_id !== employeeId)
          );
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('An error occurred while deleting the employee.');
      }
    }
  };
  

  // Close the modal and reset selected employee
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Handle input changes inside the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>employees</h1>
      <p>Role: <strong>{role}</strong></p>
      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
      {role === 'admin' && (
        <button onClick={() => alert('Navigating to add employee form...')}>Add Employee</button>
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
              {(role === 'admin') && <th>Delete</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employees) => (
              <tr key={employees.employee_id}>
                <td>{employees.employee_id}</td>
                <td>{employees.first_name}</td>
                <td>{employees.middle_name || 'N/A'}</td>
                <td>{employees.last_name}</td>
                <td>{employees.email}</td>
                <td>{employees.contact_number}</td>
                <td>{new Date(employees.date_of_birth).toLocaleDateString()}</td>
                <td>{employees.department_id || 'N/A'}</td>
                <td>{employees.position_title || 'N/A'}</td>
                <td>
                  <button onClick={() => handleEditClick(employees)}>Edit</button>
                </td>
                {role === 'admin' && (
                  <td>
                    <button onClick={() => handleDeleteClick(employees.employee_id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && selectedEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Employee</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateEmployee(selectedEmployee);
              }}
            >
              <label>
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={selectedEmployee.first_name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={selectedEmployee.last_name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Contact Number:
                <input
                  type="text"
                  name="contact_number"
                  value={selectedEmployee.contact_number}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Department ID:
                <input
                  type="text"
                  name="department_id"
                  value={selectedEmployee.department_id}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Position Title:
                <input
                  type="text"
                  name="position_title"
                  value={selectedEmployee.position_title}
                  onChange={handleInputChange}
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleModalClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
