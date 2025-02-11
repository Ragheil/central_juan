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
      const response = await fetch('http://10.0.254.104/central_juan/backend/departments/department.php');
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
      ? 'http://10.0.254.104/central_juan/backend/departments/update_department.php'
      : 'http://10.0.254.104/central_juan/backend/departments/add_department.php';

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
      const response = await fetch(`http://10.0.254.104/central_juan/backend/departments/delete_department.php?id=${department_id}`, {
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Departments</h1>

      <p className="text-gray-600">Welcome, {user?.username || 'Guest'} (Role: {user?.role || 'N/A'})</p>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 bg-gray-200 p-4 rounded-lg shadow-sm mb-4">
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-2 border rounded-md w-full md:w-auto"
        />
        {user?.role === 'ADMIN' && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Department
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading departments...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="p-3 text-left">Department ID</th>
                <th className="p-3 text-left">Department Name</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(department => (
                <tr key={department.department_id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{department.department_id}</td>
                  <td className="p-3">{department.department_name}</td>
                  <td className="p-3">
                    {user?.role === 'ADMIN' && (
                      <>
                        <button
                          onClick={() => handleViewPositions(department)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditDepartment(department)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department.department_id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrUpdateDepartment}
        department={editingDepartment}
      />
    </div>
  );
}

export default Departments;
