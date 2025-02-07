import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../Styles/components/employees.css';

function Employees() {
  const { state } = useLocation();
  const user = state?.user;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    date_of_birth: '',
    department_id: '',
    position_title: '',
  });
  const [editingEmployee, setEditingEmployee] = useState(null);

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
        alert('Error fetching employee data. Please try again later.');
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddOrUpdateEmployee = async (e) => {
    e.preventDefault();
    
    const url = editingEmployee
      ? 'http://localhost/central_juan/backend/update_employee.php'
      : 'http://localhost/central_juan/backend/add_employee.php';
  
    const method = editingEmployee ? 'POST' : 'POST'; // Changed PUT to POST for compatibility
  
    try { 
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.success) {
        if (editingEmployee) {
          setEmployees(employees.map(emp => (emp.employee_id === newEmployee.employee_id ? newEmployee : emp)));
        } else {
          setEmployees([...employees, { ...newEmployee, employee_id: data.employee_id }]);
        }
  
        // Reset form state
        setEditingEmployee(null);
        setNewEmployee({
          employee_id: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          email: '',
          contact_number: '',
          date_of_birth: '',
          department_id: '',
          position_title: '',
        });
  
        alert("Employee record successfully saved.");
      } else {
        alert(data.message || "Failed to save employee record.");
      }
    } catch (error) {
      alert("Error saving employee. Please try again later.");
      console.error("Error saving employee:", error);
    }
  };
  

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
  };

  const handleDeleteEmployee = async (employee_id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const response = await fetch(`http://localhost/central_juan/backend/delete_employee.php?id=${employee_id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setEmployees(employees.filter(emp => emp.employee_id !== employee_id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error deleting employee. Please try again later.');
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div>
      <h1>Employees</h1>
      <p>Welcome, {user?.username || 'Guest'} (Role: {user?.role || 'N/A'})</p>

      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <div>
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>

                <th>Email</th>
                <th>Contact Number</th>
                <th>Date of Birth</th>
                <th>Department ID</th>
                <th>Position Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.employee_id || `${employee.first_name}-${employee.last_name}`}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.first_name}</td>
                  

                  <td>{employee.last_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.contact_number}</td>
                  <td>{new Date(employee.date_of_birth).toLocaleDateString()}</td>
                  <td>{employee.department_id || 'N/A'}</td>
                  <td>{employee.position_title || 'N/A'}</td>
                  <td>
                    {user?.role === 'ADMIN' && (
                      <>
                        <button onClick={() => handleEditEmployee(employee)}>Edit</button>
                        <button onClick={() => handleDeleteEmployee(employee.employee_id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {user?.role === 'ADMIN' && (
            <form onSubmit={handleAddOrUpdateEmployee}>
              <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>

              <input
                type="text"
                placeholder="Employee ID (optional)"
                value={newEmployee.employee_id || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, employee_id: e.target.value })}
              />

              <input
                type="text"
                placeholder="First Name"
                value={newEmployee.first_name}
                onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Middle Name"
                value={newEmployee.middle_name || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, middle_name: e.target.value })}
              />

              <input
                type="text"
                placeholder="Last Name"
                value={newEmployee.last_name}
                onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Contact Number"
                value={newEmployee.contact_number}
                onChange={(e) => setNewEmployee({ ...newEmployee, contact_number: e.target.value })}
                required
              />

              <input
                type="date"
                placeholder="Date of Birth"
                value={newEmployee.date_of_birth}
                onChange={(e) => setNewEmployee({ ...newEmployee, date_of_birth: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Department ID"
                value={newEmployee.department_id}
                onChange={(e) => setNewEmployee({ ...newEmployee, department_id: e.target.value })}
              />

              <input
                type="text"
                placeholder="Position Title"
                value={newEmployee.position_title}
                onChange={(e) => setNewEmployee({ ...newEmployee, position_title: e.target.value })}
              />

              <button type="submit">{editingEmployee ? 'Update' : 'Add'} Employee</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Employees;
