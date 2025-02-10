import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DepartmentModal from './DepartmentModal';

function Departments() {
  const { state } = useLocation();
  const user = state?.user;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const navigate = useNavigate();



  
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/central_juan/backend/departments/department.php');
      const data = await response.json();
      if (data.message) {
        alert(data.message);
      } else {
        setDepartments(data.data);
      }
    } catch (error) {
      alert('Error fetching department data. Please try again later.');
      console.error('Error fetching department data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleViewPositions = (department) => {
    navigate('/positions', { 
      state: { 
        departmentId: department.department_id, 
        departmentName: department.department_name, 
        role: user?.role 
      } 
    });
  };

  const handleAddOrUpdateDepartment = async (newDepartment) => {
    const url = editingDepartment
      ? 'http://localhost/central_juan/backend/departments/update_department.php'
      : 'http://localhost/central_juan/backend/departments/add_department.php';

    const method = editingDepartment ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDepartment),
      });

      const data = await response.json();
      if (data.success) {
        alert('Department record successfully saved.');
        setIsModalOpen(false);
        setEditingDepartment(null);
        fetchDepartments();
      } else {
        alert(data.message || 'Failed to save department record.');
      }
    } catch (error) {
      alert('Error saving department. Please try again later.');
      console.error('Error saving department:', error);
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (department_id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      const response = await fetch(`http://localhost/central_juan/backend/departments/delete_department.php?id=${department_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        alert('Department deleted successfully.');
        fetchDepartments();
      } else {
        alert(data.message || 'Failed to delete department.');
      }
    } catch (error) {
      alert('Error deleting department. Please try again later.');
      console.error('Error deleting department:', error);
    }
  };

  return (
    <div>
      <h1>Departments</h1>
      <p>Welcome, {user?.username || 'Guest'} (Role: {user?.role || 'N/A'})</p>

      {user?.role === 'ADMIN' && (
        <button onClick={() => { setEditingDepartment(null); setIsModalOpen(true); }}>
          Add Department
        </button>
      )}

      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <div>
          <table className="department-table">
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Department Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(department => (
                <tr key={department.department_id}>
                  <td>{department.department_id}</td>
                  <td>{department.department_name}</td>
                  <td>
                    {user?.role === 'ADMIN' && (
                      <>
                        <button onClick={() => handleViewPositions(department)}>View</button>
                        <button onClick={() => handleEditDepartment(department)}>Edit</button>
                        <button onClick={() => handleDeleteDepartment(department.department_id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <DepartmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddOrUpdateDepartment}
            department={editingDepartment}
          />
        </div>
      )}
    </div>
  );
}

export default Departments;
