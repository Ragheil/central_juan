import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../frontend/components/payroll.css'; // Import the CSS file

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State to hold the selected employee
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch employee data from the backend API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost/central_juan/backend/employee.php');
        const data = await response.json();
        if (data.message) {
          alert(data.message);
        } else {
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee); // Set the selected employee
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSaveChanges = async () => {
    if (!selectedEmployee) return;
  
    try {
      const response = await fetch('http://localhost/central_juan/backend/employee.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedEmployee),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
  
      const result = await response.json();
      alert(result.message);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
  
  

  if (loading) {
    return <div>Loading employee data...</div>;
  }

  return (
    <div>
      <h1>Payroll</h1>
      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Birthday</th>
            <th>Gender</th>
            <th>Position</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.emp_id}>
              <td>{employee.emp_id}</td>
              <td>{employee.firstname}</td>
              <td>{employee.lastname}</td>
              <td>{employee.contact_num}</td>
              <td>{employee.address}</td>
              <td>{employee.birthday}</td>
              <td>{employee.gender}</td>
              <td>{employee.position}</td>
              <td>{employee.time_in}</td>
              <td>{employee.time_out}</td>
              <td>
                <button onClick={() => handleEditClick(employee)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing employee */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Edit Employee</h2>
            <form>
              <label>First Name:</label>
              <input
                type="text"
                value={selectedEmployee?.firstname || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, firstname: e.target.value })}
              />
              <br />
              <label>Last Name:</label>
              <input
                type="text"
                value={selectedEmployee?.lastname || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, lastname: e.target.value })}
              />
              <br />
              <label>Contact Number:</label>
              <input
                type="text"
                value={selectedEmployee?.contact_num || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, contact_num: e.target.value })}
              />
              <br />
              <label>Address:</label>
              <input
                type="text"
                value={selectedEmployee?.address || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
              />
              <br />
              <label>Birthday:</label>
              <input
                type="date"
                value={selectedEmployee?.birthday || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, birthday: e.target.value })}
              />
              <br />
              <label>Gender:</label>
              <select
                value={selectedEmployee?.gender || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <br />
              <label>Position:</label>
              <input
                type="text"
                value={selectedEmployee?.position || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, position: e.target.value })}
              />
              <br />
              <button type="button" onClick={handleSaveChanges}>Save Changes</button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;
