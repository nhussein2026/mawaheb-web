import React from "react";
import { useSelector } from "react-redux";
import { Menu, Bell, Search } from "lucide-react";
import { Input } from "../ui/Input";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector((state) => state.auth?.user || {});

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center flex-1">
        <button
          type="button"
          className="mr-4 lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-full bg-gray-50 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="relative rounded-full bg-white dark:bg-gray-900 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
        </button>

        <div className="relative ml-3">
          <div className="flex items-center gap-3">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "Admin User"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role || "Administrator"}
              </span>
            </div>
            <button className="flex max-w-xs items-center rounded-full bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <img
                className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                src={user?.imageUrl || "https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
