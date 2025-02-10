import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      setPositionId(position?.position_id || '');
      setPositionName(position?.position_name || '');
    }
  }, [isOpen, position]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!positionId.trim()) {
      alert('Position ID is required.');
      return;
    }

    if (!positionName.trim()) {
      alert('Position Name is required.');
      return;
    }

    if (!departmentId) {
      alert('Department ID is required.');
      return;
    }

    const newPosition = {
      position_id: position ? position.position_id : positionId.trim(),
      new_position_id: positionId.trim(),
      position_name: positionName.trim(),
      department_id: departmentId,
    };

    console.log('Submitting new position:', newPosition);
    onSubmit(newPosition);
    onClose();
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
        <br />
        <label>
          Position Name:
          <input
            type="text"
            value={positionName}
            onChange={(e) => setPositionName(e.target.value)}
            placeholder="Enter position name"
            required
          />
        </label>
        <br />
        <div>
          <button type="submit">{position ? 'Update' : 'Add'}</button>
          <button type="button" onClick={onClose}>
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
  departmentId: PropTypes.string.isRequired,
};

export default PositionModal;
