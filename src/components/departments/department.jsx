import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DepartmentModal from './DepartmentModal'; // Assume modal component for departments
//import '../../../Styles/components/departments.css';

function Departments() {
  const { state } = useLocation();
  const user = state?.user;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
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

    fetchDepartments();
  }, []);

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
        if (editingDepartment) {
          setDepartments(
            departments.map(dept =>
              dept.department_id === newDepartment.department_id ? newDepartment : dept
            )
          );
        } else {
          setDepartments([...departments, { ...newDepartment, department_id: data.department_id }]);
        }
        setEditingDepartment(null);
        setIsModalOpen(false);
        alert("Department record successfully saved.");
      } else {
        alert(data.message || "Failed to save department record.");
      }
    } catch (error) {
      alert("Error saving department. Please try again later.");
      console.error("Error saving department:", error);
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
      });

      const data = await response.json();
      if (data.success) {
        setDepartments(departments.filter(dept => dept.department_id !== department_id));
      } else {
        alert(data.message);
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
