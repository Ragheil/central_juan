import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function DepartmentModal({ isOpen, onClose, onSubmit, department }) {
  const [departmentName, setDepartmentName] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  useEffect(() => {
    if (department) {
      setDepartmentName(department.department_name || '');
      setDepartmentId(department.department_id || '');
    } else {
      setDepartmentName('');
      setDepartmentId('');
    }
  }, [department]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!departmentName.trim() || !departmentId.trim()) {
      alert('Please provide both a department name and a valid ID.');
      return;
    }
  
    onSubmit({
      department_id: departmentId,
      department_name: departmentName,
    });
  
    onClose(); // Close the modal after submission
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{department ? 'Edit Department' : 'Add Department'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Department ID</label>
          <input
            type="text"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            placeholder="Enter Department ID"
            required
          />
          <label>Department Name</label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Enter Department Name"
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

DepartmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  department: PropTypes.object,
};

export default DepartmentModal;
