import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EmployeeModal from './EmployeeModal'; // Import the modal component
import '../../../Styles/components/employees.css';

function Employees() {
  const { state } = useLocation();
  const user = state?.user;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost/central_juan/backend/employeesSide/employees.php');
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

  const handleAddOrUpdateEmployee = async (newEmployee) => {
    const url = editingEmployee
      ? 'http://localhost/central_juan/backend/employeesSide/update_employee.php'
      : 'http://localhost/central_juan/backend/employeesSide/add_employee.php';
    const method = editingEmployee ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
  
      const text = await response.text();
      let data;
  
      try {
        data = JSON.parse(text);
      } catch {
        alert("Unexpected server error. Please try again.");
        console.error("Server response:", text);
        return;
      }
  
      if (data.success) {
        if (editingEmployee) {
          setEmployees(employees.map(emp => (emp.employee_id === newEmployee.employee_id ? newEmployee : emp)));
        } else {
          setEmployees([...employees, { ...newEmployee, employee_id: data.employee_id }]);
        }
        setEditingEmployee(null);
        setIsModalOpen(false);
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
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employee_id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const response = await fetch(`http://localhost/central_juan/backend/employeesSide/delete_employee.php?id=${employee_id}`, {
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

      <br />
      {user?.role === 'ADMIN' && (
            <button onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}>Add Employee</button>
          )}
<br />
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <div>
          <table className="employee-table">
          <thead>
  <tr>
    <th>Employee ID</th>
    <th>First Name</th>
    <th>Middle Name</th>
    <th>Last Name</th>
    <th>Email</th>
    <th>Contact Number</th>
    <th>Date of Birth</th>
    <th>Department Name</th>
    <th>Position Name</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {employees.map(employee => (
    <tr key={employee.employee_id}>
      <td>{employee.employee_id}</td>
      <td>{employee.first_name}</td>
      <td>{employee.middle_name || 'N/A'}</td>
      <td>{employee.last_name}</td>
      <td>{employee.email}</td>
      <td>{employee.contact_number}</td>
      <td>{new Date(employee.date_of_birth).toLocaleDateString()}</td>
      <td>{employee.department_name || 'N/A'}</td>
      <td>{employee.position_name || 'N/A'}</td>
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



          <EmployeeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddOrUpdateEmployee}
            employee={editingEmployee}
          />
        </div>
      )}
    </div>
  );
}

export default Employees;