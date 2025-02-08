import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../../Styles/components/EmployeeModal.css';

const EmployeeModal = ({ isOpen, onClose, onSubmit, employee }) => {
  const [newEmployee, setNewEmployee] = React.useState(employee || {
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

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (employee) {
      setNewEmployee(employee);
    }
  }, [employee]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost/central_juan/backend/departments/department.php');
        const data = await response.json();
        if (data.status === 'success') {
          setDepartments(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newEmployee);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Existing Inputs */}
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID (optional)"
            value={newEmployee.employee_id}
            onChange={handleChange}
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={newEmployee.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="middle_name"
            placeholder="Middle Name"
            value={newEmployee.middle_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={newEmployee.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number"
            value={newEmployee.contact_number}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date_of_birth"
            value={newEmployee.date_of_birth}
            onChange={handleChange}
            required
          />

          {/* Dropdown for department_id */}
          <select
            name="department_id"
            value={newEmployee.department_id}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="position_title"
            placeholder="Position Title"
            value={newEmployee.position_title}
            onChange={handleChange}
          />
          <button type="submit">{employee ? 'Update' : 'Add'} Employee</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

EmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  employee: PropTypes.object,
};

export default EmployeeModal;
