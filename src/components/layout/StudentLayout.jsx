import Sidebar from "./Sidebar";

const StudentLayout = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-surface-page font-sans text-text-primary overflow-hidden" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 custom-scrollbar">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
