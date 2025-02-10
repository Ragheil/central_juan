import /*React,*/ { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
  },
};

Modal.setAppElement('#root');

const PositionModal = ({ isOpen, onClose, onSubmit, position, departmentId }) => {
  const [positionId, setPositionId] = useState('');
  const [positionName, setPositionName] = useState('');

  // Reset input fields based on modal visibility or position changes
  useEffect(() => {
    if (isOpen) {
      setPositionId(position?.position_id || '');
      setPositionName(position?.position_name || '');
    }
  }, [isOpen, position]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!positionId.trim()) {
      alert('Position ID cannot be empty.');
      return;
    }
  
    if (!positionName.trim()) {
      alert('Position name cannot be empty.');
      return;
    }
  
    // Prepare the new position data
    const newPosition = {
      new_position_id: positionId.trim(),
      position_name: positionName.trim(),
    };
  
    // Include your `positionData`
    const positionData = {
      position_id: position?.position_id || '',
      new_position_id: newPosition.new_position_id,
      position_name: newPosition.position_name,
      department_id: departmentId,
    };
  
    // Submit the complete data object
    onSubmit(positionData);
    onClose(); // Ensure modal closes after submission
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Position Modal"
    >
      <h2>{position ? 'Edit Position' : 'Add New Position'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Position ID:
          <input
            type="text"
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
            placeholder="Enter position ID"
            required
          />
        </label>
        <label style={{ display: 'block', marginTop: '10px' }}>
          Position Name:
          <input
            type="text"
            value={positionName}
            onChange={(e) => setPositionName(e.target.value)}
            placeholder="Enter position name"
            required
          />
        </label>
        <div style={{ marginTop: '15px' }}>
          <button type="submit">
            {position ? 'Update Position' : 'Add Position'}
          </button>
          <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

PositionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  position: PropTypes.object,
  departmentId: PropTypes.string,
};

export default PositionModal;
