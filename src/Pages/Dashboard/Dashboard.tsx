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
          <div className="p-4">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                  <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                  <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                </div>
                <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="text-2xl text-gray-400 dark:text-gray-500">
                      <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                      </svg>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                  <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                  <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                  <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                </div>
                <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="text-2xl text-gray-400 dark:text-gray-500">
                      <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                      </svg>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                  <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                  <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                  <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                      <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" d="M9 1v16M1 9h16"/>
                        </svg>
                      </p>
                  </div>
                </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default Dashboard;
