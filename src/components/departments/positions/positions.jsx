import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PositionModal from './PositionModal'; // Assume this modal component exists

function Positions() {
  const { state } = useLocation();
  const user = state?.user;
  const { departmentId, departmentName, role } = state || {};

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);

  // Fetch positions for the specific department
  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost/central_juan/backend/departments/positions/positions.php?department_id=${departmentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.message) {
        alert(data.message);
      } else {
        setPositions(data);
      }
    } catch (error) {
      console.error('Error fetching position data:', error);
      alert('Error fetching position data. Please check your server or connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentId) fetchPositions();
  }, [departmentId]);

  // Handle Add/Update
  const handleAddOrUpdatePosition = async (newPosition) => {
    const url = editingPosition
      ? 'http://localhost/central_juan/backend/departments/positions/update_positions.php'
      : 'http://localhost/central_juan/backend/departments/positions/add_positions.php';
  
    const method = editingPosition ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPosition),  // Ensure department ID is included in payload
      });
  
      const data = await response.json();
      if (data.status === 'success') {
        alert('Position record successfully saved.');
        setIsModalOpen(false);
        setEditingPosition(null);
        fetchPositions();
      } else {
        alert(data.message || 'Failed to save position record.');
      }
    } catch (error) {
      alert('Error saving position. Please try again later.');
      console.error('Error saving position:', error);
    }
  };
  

  // Handle Edit
  const handleEditPosition = (position) => {
    setEditingPosition(position);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeletePosition = async (position_id) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;

    try {
      const response = await fetch(`http://localhost/central_juan/backend/departments/positions/delete_positions.php?id=${position_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Position deleted successfully.');
        fetchPositions(); // Refresh data
      } else {
        alert(data.message || 'Failed to delete position.');
      }
    } catch (error) {
      alert('Error deleting position. Please try again later.');
      console.error('Error deleting position:', error);
    }
  };

  return (
    <div>
      <h1>Positions for Department: {departmentName} (ID: {departmentId})</h1>
      <p>Role: {role || 'N/A'}</p>

      {role === 'ADMIN' && (
        <button onClick={() => { setEditingPosition(null); setIsModalOpen(true); }}>
          Add Position
        </button>
      )}

      {loading ? (
        <p>Loading positions...</p>
      ) : (
        <div>
          <table className="positions-table">
            <thead>
              <tr>
                <th>Position ID</th>
                <th>Position Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 ? positions.map(position => (
                <tr key={position.position_id}>
                  <td>{position.position_id}</td>
                  <td>{position.position_name}</td>
                  <td>
                    {role === 'ADMIN' && (
                      <>
                        <button onClick={() => handleEditPosition(position)}>Edit</button>
                        <button onClick={() => handleDeletePosition(position.position_id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3">No positions available for this department.</td>
                </tr>
              )}
            </tbody>
          </table>

          <PositionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddOrUpdatePosition}
            position={editingPosition}
          />
        </div>
      )}
    </div>
  );
}

export default Positions;