import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useAuth } from "../../Context/useAuth";

interface Props {}

const Dashboard = (props: Props) => {
  const { sideMenuIsExpand, setSideMenuIsExpand } = useAuth();

  return (
    <>
      <Sidebar setExpand={setSideMenuIsExpand} />
      <div
          className={`flex-1 min-h-screen mx-0 bg-slate-100 transition-all duration-300 ease-in-out ${
            sideMenuIsExpand ? "md:ml-72" : "md:ml-20"
          }`}>
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <Outlet />
          </div>
      </div>
    </>
  );
};

export default Dashboard;
