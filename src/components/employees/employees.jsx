import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EmployeeModal from './EmployeeModal';

function Employees() {
  const { state } = useLocation();
  const user = state?.user;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost/central_juan/backend/employeesSide/employees.php');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        alert('Error fetching employee data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Employee</h1>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 bg-gray-200 p-4 rounded-lg shadow-sm mb-4">
        <select className="px-3 py-2 border rounded-md bg-white text-gray-700">
          <option value="">Location</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
        </select>

        <select className="px-3 py-2 border rounded-md bg-white text-gray-700">
          <option value="">Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
        </select>

        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
          className="px-3 py-2 border rounded-md w-full md:w-auto"
        />

        {user?.role === 'ADMIN' && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Employee
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading employees...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Contact No.</th>
                <th className="p-3 text-left">Birth Date</th>
                <th className="p-3 text-left">Start Day</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.employee_id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{employee.employee_id}</td>
                  <td className="p-3">{employee.first_name} {employee.last_name}</td>
                  <td className="p-3">{employee.email}</td>
                  <td className="p-3">{employee.contact_number}</td>
                  <td className="p-3">{new Date(employee.date_of_birth).toLocaleDateString()}</td>
                  <td className="p-3">{employee.start_date ? new Date(employee.start_date).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-3">
                    {user?.role === 'ADMIN' && (
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => console.log("Submit Employee")}
        employee={editingEmployee}
      />
    </div>
  );
}

export default Employees;
