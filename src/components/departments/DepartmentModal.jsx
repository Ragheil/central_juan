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
      <div className="modal-content bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">{department ? 'Edit Department' : 'Add Department'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Department ID</label>
            <input
              type="text"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              placeholder="Enter Department ID"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Department Name</label>
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter Department Name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
            >
              Save
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
}

DepartmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  department: PropTypes.object,
};

export default DepartmentModal;
