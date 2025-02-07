// EmployeeModal.jsx
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import '../../../Styles/components/EmployeeModal.css'; // Optional: Add your styles here

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

  React.useEffect(() => {
    if (employee) {
      setNewEmployee(employee);
    }
  }, [employee]);

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
          <input
            type="text"
            name="department_id"
            placeholder="Department ID"
            value={newEmployee.department_id}
            onChange={handleChange}
          />
          <input
            type="text"
            name="position_title"
            placeholder="Position Title"
            value={newEmployee.position_title}
            onChange={handleChange}
          />
          <button type="submit">{employee ? 'Update' : 'Add'} Employee</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

EmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Declare isOpen prop with type bool and make it required
  onClose: PropTypes.func.isRequired, // Declare onClose prop with type func and make it required
  onSubmit: PropTypes.func.isRequired, // Declare onSubmit prop with type func and make it required
  employee: PropTypes.object, // Declare employee prop with type object
};

export default EmployeeModal;
