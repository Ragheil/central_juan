import { useEffect, useState } from 'react';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost/central_juan/backend/departments/department.php');
        const data = await response.json();
        if (data.status === 'success') {
          setDepartments(data.data);
        } else {
          setError(data.message);
        }
      } catch {
        setError('Failed to fetch departments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Departments</h1>
      {departments.length > 0 ? (
        <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
              {/* <th>Created At</th> */}
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.department_id}>
                <td>{department.department_id}</td>
                <td>{department.department_name}</td>
                {/* <td>{department.created_at}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No departments found.</p>
      )}
    </div>
  );
};

export default Department;
