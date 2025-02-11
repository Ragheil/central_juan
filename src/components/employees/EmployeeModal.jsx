import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../../Styles/components/EmployeeModal.css';

const EmployeeModal = ({ isOpen, onClose, onSubmit, employee }) => {
  const [newEmployee, setNewEmployee] = useState(employee || {
    employee_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    date_of_birth: '',
    department_id: '',
    position_id: '',
  });

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (employee) {
      setNewEmployee(employee);
    }
  }, [employee]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://10.0.254.104/central_juan/backend/departments/department.php');
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

  // Fetch positions
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch('http://10.0.254.104/central_juan/backend/departments/positions/fetch_positions.php');
        const data = await response.json();
        console.log(data); // Log the data to see its structure
        if (Array.isArray(data)) {
          setPositions(data);
        } else {
          console.error('Unexpected response format:', data);
          setPositions([]);
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
        setPositions([]);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!newEmployee.first_name || !newEmployee.last_name || !newEmployee.email || !newEmployee.contact_number) {
      alert("Please fill in all required fields.");
      return;
    }

    onSubmit(newEmployee);
    // Reset the form after submission
    setNewEmployee({
      employee_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      date_of_birth: '',
      department_id: '',
      position_id: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID (optional)"
            value={newEmployee.employee_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={newEmployee.first_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="middle_name"
            placeholder="Middle Name"
            value={newEmployee.middle_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={newEmployee.last_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number"
            value={newEmployee.contact_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="date_of_birth"
            value={newEmployee.date_of_birth}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Department Picker */}
          <select
            name="department_id"
            value={newEmployee.department_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>

          {/* Position Picker */}
          <select
            name="position_id"
            value={newEmployee.position_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Position</option>
            {positions.map((pos) => (
              <option key={pos.position_id} value={pos.position_id}>
                {pos.position_name}
              </option>
            ))}
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
            >
              {employee ? 'Update' : 'Add'} Employee
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 w-full"
            >
              Cancel
            </button>
          </div>
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