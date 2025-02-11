import { useEffect, useState } from 'react';
import { useSession } from '../../context/SessionContext';
import { useNavigate, } from 'react-router-dom';
import '../../../Styles/dashboard/dashboard.css';

function Dashboard() {
  const { user, } = useSession();
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch employee count
        const employeeResponse = await fetch(
          'http://10.0.254.104/central_juan/backend/employeesSide/employees.php?count=true'
        );
        if (employeeResponse.ok) {
          const data = await employeeResponse.json();
          console.log('Employee Count Data:', data); // Log the response
          setEmployeeCount(data.total_count);
        } else {
          console.error('Failed to fetch employee count');
        }
    
        // Fetch department count
        const departmentResponse = await fetch(
          'http://10.0.254.104/central_juan/backend/departments/department.php?count=true'
        );
        if (departmentResponse.ok) {
          const departmentData = await departmentResponse.json();
          console.log('Department Count Data:', departmentData); // Log the response
          setDepartmentCount(departmentData.total_departments); // Update this line
        } else {
          console.error('Failed to fetch department count');
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);


  return (
    <div className='main_dashboard flex flex-col h-screen w-full bg-amber-700'> 
      <div className='dashboard_head flex flex-1 flex-row bg-green-400'>
        <div className='left_head flex flex-1 m-1 w-full bg-amber-400'>

        </div>
        <div className='right_head flex flex-1 m-1 w-full bg-amber-400'>

        </div>
      </div>
      <div className='dashboard_content flex-row flex flex-4'>  
        
        <div className='date_task_right flex flex-1 m-1 w-full h-full bg-amber-50'>

        </div>
        <div className='left_container flex flex-2 m-1 w-full h-full bg-amber-50'>
        <div className="flex justify-center items-center  bg-gray-100 space-x-8">
           <div
            className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-50"
            onClick={() => navigate('/employees', { state: { user } })}
          >
            <p className="text-lg font-semibold text-center">
              Total Employees: {employeeCount}
            </p>
          </div>
            
          <div
            className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-50"
            onClick={() => navigate('/department', { state: { user } })}
          >
            <p className="text-lg font-semibold text-center">
              Total Departments: {departmentCount}
            </p>
          </div>
          
        </div>          
            <div className='top_container flex flex-1 m-1 bg-amber-950'>
            </div>
            <div className='low_container flex flex-1 m-1 bg-amber-950'>

            </div>
          </div>
          
        </div>
      </div>
    //</div>
    // <div className="dashboard-container flex h-screen justify-center items-center bg-gray-100">
      

    //   {/* Main Dashboard Content */}
    //   <div className="flex flex-col justify-center items-center gap-5">

    //     {/* Dashboard Content */}
    //     <div className="flex justify-center items-center  bg-gray-100 space-x-8">
    //       <div
    //         className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-50"
    //         onClick={() => navigate('/employees', { state: { user } })}
    //       >
    //         <p className="text-lg font-semibold text-center">
    //           Total Employees: {employeeCount}
    //         </p>
    //       </div>
            
    //       <div
    //         className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-50"
    //         onClick={() => navigate('/department', { state: { user } })}
    //       >
    //         <p className="text-lg font-semibold text-center">
    //           Total Departments: {departmentCount}
    //         </p>
    //       </div>
          
    //     </div>
    //     <div className="flex">
    //     <div
    //         className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-50"
    //         onClick={() => navigate('/employees', { state: { user } })}
    //       >
    //         <p className="text-lg font-semibold text-center">
    //           Total Employees: {employeeCount}
    //         </p>
    //       </div>
            
    //       <div
    //         className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-50"
    //         onClick={() => navigate('/department', { state: { user } })}
    //       >
    //         <p className="text-lg font-semibold text-center">
    //           Total Departments: {departmentCount}
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Dashboard;