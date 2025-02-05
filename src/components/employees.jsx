import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../frontend/components/employees.css';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // State for departments
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    date_of_birth: '',
    department_id: '',
    position_title: ''
  });
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

    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost/central_juan/backend/employees.php?departments=true');
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching department data:', error);
      }
    };

    fetchEmployees();
    fetchDepartments(); // Fetch departments
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
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error('Error updating employee');
      }

      alert('Employee updated successfully!');
      setEmployees((prev) => prev.map(emp => emp.employee_id === employeeData.employee_id ? employeeData : emp));
    } catch (error) {
      console.error("Error in fetch request:", error);
      alert('Error updating employee.');
    }
  };

  // Function to add a new employee
  const addEmployee = async (employeeData) => {
    try {
      const response = await fetch('http://localhost/central_juan/backend/employees.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Role': role // Include the role in the headers
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error('Error adding employee');
      }

      const data = await response.json();
      alert(data.message);
      setEmployees((prev) => [...prev, { ...employeeData, employee_id: data.employee_id }]);
      setIsAddModalOpen(false);
      setNewEmployee({
        employee_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        date_of_birth: '',
        department_id: '',
        position_title: ''
      });
    } catch (error) {
      console.error("Error in fetch request:", error);
      alert('Error adding employee.');
    }
  };

  // Handle edit button click to open modal
  const handleEditClick = (employee) => {
    if (role === 'hr' || role === 'admin') {
      setSelectedEmployee(employee);
      setIsEditModalOpen(true);
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

  // Close the edit modal and reset selected employee
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  // Close the add modal and reset new employee data
  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewEmployee({
      employee_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      date_of_birth: '',
      department_id: '',
      position_title: ''
    });
  };

  // Handle input changes inside the add employee modal form
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Employees</h1>
      <p>Role: <strong>{role}</strong></p>
      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
      {role === 'admin' && (
        <button onClick={() => setIsAddModalOpen(true)}>Add Employee</button>
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
                    <button onClick={() => handleDeleteClick(employee.employee_id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && selectedEmployee && (
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
                Employee ID:
                <input
                  type="text"
                  name="employee_id"
                  value={selectedEmployee.employee_id}
                  readOnly
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={selectedEmployee.first_name}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={selectedEmployee.last_name}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee.email}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Contact Number:
                <input
                  type="text"
                  name="contact_number"
                  value={selectedEmployee.contact_number}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Department ID:
                <input
                  type="text"
                  name="department_id"
                  value={selectedEmployee.department_id}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Position Title:
                <input
                  type="text"
                  name="position_title"
                  value={selectedEmployee.position_title}
                  onChange={handleAddInputChange}
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleEditModalClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Employee</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addEmployee(newEmployee);
              }}
            >
              <label>
                Employee ID:
                <input
                  type="text"
                  name="employee_id"
                  value={newEmployee.employee_id}
                  onChange={handleAddInputChange}
                  required
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={newEmployee.first_name}
                  onChange={handleAddInputChange}
                  required
                />
              </label>
              <label>
                Middle Name:
                <input
                  type="text"
                  name="middle_name"
                  value={newEmployee.middle_name}
                  onChange={handleAddInputChange}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={newEmployee.last_name}
                  onChange={handleAddInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleAddInputChange}
                  required
                />
              </label>
              <label>
                Contact Number:
                <input
                  type="text"
                  name="contact_number"
                  value={newEmployee.contact_number}
                  onChange={handleAddInputChange}
                  required
                />
              </label>
              <label>
                Date of Birth:
                <input
                  type="date"
                  name="date_of_birth"
                  value={newEmployee.date_of_birth}
                  onChange={handleAddInputChange}
                  required
                />
              </label>
              <label>
                Department:
                <select
                  name="department_id"
                  value={newEmployee.department_id}
                  onChange={handleAddInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((department, index) => (
                    <option key={index} value={department}>{department}</option>
                  ))}
                </select>
              </label>
              <label>
                Position Title:
                <input
                  type="text"
                  name="position_title"
                  value={newEmployee.position_title}
                  onChange={handleAddInputChange}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Add Employee</button>
                <button type="button" onClick={handleAddModalClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;