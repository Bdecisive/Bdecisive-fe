import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../Context/useAuth";
import default_profile from "./default_profile.png";

interface SidebarProps {
  setExpand: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setExpand }) => {

  const { user, isAdmin, isVendor, isInfluencer } = useAuth();

  const name = user?.name;
  const link = "/";
  const profilePic = default_profile;

  const [openedMenu, setOpenedMenu] = useState<Record<string, any>>({});
  const [activeName, setActiveName] = useState("");
  const currentPath = window.location.pathname;
  const listRef = useRef<Record<string, HTMLUListElement | null>>({});

  const [isExpand, setIsExpand] = useState(true);
  const [isExpandOnHover, setIsExpandOnHover] = useState(false);

  // Set active menu based on current path
  useEffect(() => {
    const pathMap: Record<string, string> = {
      "/dashboard": "dashboard",
      "/dashboard/rfq": "transaksi.rfq",
      "/dashboard/quotation": "transaksi.quotation",
      "/dashboard/categories": "category"
    };

    const activeMenu = pathMap[currentPath];
    if (activeMenu) {
      setActiveName(activeMenu);
      // If it's a submenu (contains dot), open the parent menu
      if (activeMenu.includes('.')) {
        const parentMenu = activeMenu.split('.')[0];
        handleToggle(parentMenu);
      }
    }
  }, [currentPath]);

  const handleHoverExpand = (value: boolean) => {
    if (!isExpand) {
      setIsExpandOnHover(value);
    }
  };

  const handleNavigate = (path: string, link?: string) => {
    setActiveName(path);
    if (link) {
      window.location.href = link;
    }
  };

  const handleToggle = (name: string) => {
    const rootEl = name.split(".")[0];

    if (openedMenu[name]?.open === true) {
      setOpenedMenu((prevState) => ({
        ...prevState,
        [name]: {
          open: false,
          height: "0px"
        },
        [rootEl]: {
          open: rootEl === name ? false : true,
          height: `${(listRef.current[rootEl]?.scrollHeight || 0) -
            (listRef.current[name]?.scrollHeight || 0)
            }px`
        }
      }));
    } else {
      setOpenedMenu((prevState) => ({
        ...prevState,
        [name]: {
          open: true,
          height: `${listRef.current[name]?.scrollHeight || 0}px`
        },
        [rootEl]: {
          open: true,
          height: `${(listRef.current[rootEl]?.scrollHeight || 0) +
            (listRef.current[name]?.scrollHeight || 0)
            }px`
        }
      }));
    }
  };

  return (
    <nav
      role="navigation"
      className={[
        "bg-slate-50 border-r border-slate-100 shadow-sm absolute inset-y-0 left-0",
        "duration-300 ease-in-out md:fixed md:translate-x-0",
        `${isExpand
          ? "bg-slate-50 w-72"
          : isExpandOnHover
            ? "bg-slate-50/70 w-72 backdrop-blur-md"
            : "bg-slate-50 w-20"
        }`
      ].join(" ")}
    >
      <button
        className="absolute z-50 top-16 -right-3 bg-white hover:bg-slate-100 text-slate-500 p-0.5 rounded-full border border-slate-200"
        onClick={() => {
          setIsExpand(!isExpand);
          setExpand(!isExpand);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${isExpand ? "rotate-0" : "rotate-180"
            } transform duration-500 h-4 w-4`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        onMouseEnter={() => handleHoverExpand(true)}
        onMouseLeave={() => handleHoverExpand(false)}
        className="relative h-screen overflow-y-auto"
      >
        <div className="text-slate-500">
          <div className="my-8 flex flex-col items-center h-44 overflow-x-hidden">
            <a
              href="/update-profile"
              className="text-center flex flex-col items-center justify-center"
            >
              <div
                className={`rounded-full border-4 border-white overflow-hidden duration-300 bg-gray-100 flex items-center justify-center ${isExpand
                  ? "h-28 w-28"
                  : isExpandOnHover
                    ? "h-28 w-28"
                    : "h-12 w-12"
                  }`}
              >
                <img src={profilePic} className="block" alt="" />
              </div>
              <div
                className={`text-base font-semibold text-slate-700 mt-3 truncate duration-300 ${isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"
                  }`}
              >
                {name}
              </div>
            </a>
          </div>

          <div className="mt-3 mb-10 p-0">
            <ul className="list-none text-sm font-normal px-3">
              {/* Dashboard */}
              <li>
                <a
                  role="button"
                  tabIndex={0}
                  id="dashboard"
                  onClick={() => handleNavigate("dashboard", "/dashboard")}
                  className={[
                    "group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none pl-4",
                    activeName === "dashboard"
                      ? "text-blue-600 font-semibold bg-blue-200/20"
                      : "text-slate-500",
                    "hover:bg-slate-300/20",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-tachometer-alt text-current h-5 w-5"></i>
                    <div className={`truncate ${isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"}`}>
                      Dashboard
                    </div>
                  </div>
                </a>
              </li>

              {/* Vendor */}
              {isAdmin() && (
                <li>
                  <a
                    role="button"
                    tabIndex={0}
                    id="vendor"
                    onClick={() => handleNavigate("vendors", "/dashboard/vendors")}
                    className={[
                      "group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none pl-4",
                      activeName === "vendors"
                        ? "text-blue-600 font-semibold bg-blue-200/20"
                        : "text-slate-500",
                      "hover:bg-slate-300/20",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-list text-current h-5 w-5"></i>
                      <div className={`truncate ${isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"}`}>
                        Vendors
                      </div>
                    </div>
                  </a>
                </li>
              )}

              {/* Category */}
              <li>
                <a
                  role="button"
                  tabIndex={0}
                  id="category"
                  onClick={() => handleNavigate("category", "/dashboard/categories")}
                  className={[
                    "group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none pl-4",
                    activeName === "category"
                      ? "text-blue-600 font-semibold bg-blue-200/20"
                      : "text-slate-500",
                    "hover:bg-slate-300/20",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-list text-current h-5 w-5"></i>
                    <div className={`truncate ${isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"}`}>
                      Category
                    </div>
                  </div>
                </a>
              </li>

              {/* Product */}
              {isVendor() && (
                <li>
                  <a
                    role="button"
                    tabIndex={0}
                    id="product"
                    onClick={() => handleNavigate("product", "/dashboard/products")}
                    className={[
                      "group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none pl-4",
                      activeName === "product"
                        ? "text-blue-600 font-semibold bg-blue-200/20"
                        : "text-slate-500",
                      "hover:bg-slate-300/20",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-list text-current h-5 w-5"></i>
                      <div className={`truncate ${isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"}`}>
                        Product
                      </div>
                    </div>
                  </a>
                </li>
              )}

              {isInfluencer() && (
                <li>
                  <a
                    role="button"
                    tabIndex={0}
                    id="review"
                    onClick={() => handleNavigate("review", "/dashboard/reviews")}
                    className={[
                      "group m-0 flex cursor-pointer rounded-lg items-center justify-between h-12 py-0 pr-3 mb-1 focus:outline-none pl-4",
                      activeName === "review"
                        ? "text-blue-600 font-semibold bg-blue-200/20"
                        : "text-slate-500",
                      "hover:bg-slate-300/20",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-list text-current h-5 w-5"></i>
                      <div className={`truncate ${isExpand ? "" : isExpandOnHover ? "" : "w-0 h-0 opacity-0"}`}>
                        Review
                      </div>
                    </div>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;