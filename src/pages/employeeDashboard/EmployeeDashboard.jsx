import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import AllUsers from "../adminDashboard/AllUsers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { 
  Users, 
  FileText, 
  Ticket, 
  Award, 
  DollarSign, 
  Trophy, 
  BookOpen,
  Search,
  Filter,
  User,
  ChevronLeft
} from "lucide-react";

const EmployeeDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories] = useState([
    { name: "المستخدمين", value: "users", icon: Users },
    { name: "التقارير", value: "reports", icon: FileText },
    { name: "التذاكر", value: "tickets", icon: Ticket },
    { name: "الشهادات", value: "certificates", icon: Award },
    { name: "التقارير المالية", value: "financialReports", icon: DollarSign },
    { name: "الإنجازات", value: "userAchievements", icon: Trophy },
    { name: "الدورات", value: "courses", icon: BookOpen },
  ]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersByCategory = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/summary?category=${selectedCategory}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setUsers(data.result);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory && selectedCategory !== "users") {
      fetchUsersByCategory();
    }
  }, [selectedCategory, token]);

  const getCategoryCount = (user) => {
    switch (selectedCategory) {
      case "reports": return user.reportCount;
      case "tickets": return user.ticketCount;
      case "certificates": return user.certificateCount;
      case "financialReports": return user.financialReportCount;
      case "userAchievements": return user.achievementCount;
      case "courses": return user.courseCount;
      default: return 0;
    }
  };

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-['Cairo']" dir="rtl">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">لوحة تحكم الموظف</h1>
            <p className="text-gray-500 dark:text-gray-400">مرحباً بك مجدداً. يمكنك هنا مراجعة وإدارة أنشطة المستخدمين في المنصة.</p>
          </div>

          {/* Search and Filters */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                  selectedCategory === ""
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-indigo-200"
                }`}
              >
                <span>الكل</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                    selectedCategory === category.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-indigo-200"
                  }`}
                >
                  <category.icon size={18} />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="text-gray-500">جاري تحميل البيانات...</p>
              </div>
            ) : error ? (
              <Card className="border-red-100 bg-red-50 dark:bg-red-900/10 p-8 text-center">
                <p className="text-red-600 font-medium">خطأ في تحميل البيانات: {error}</p>
              </Card>
            ) : selectedCategory === "users" || selectedCategory === "" ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <AllUsers />
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user._id} className="group hover:shadow-md transition-all border-none shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6 flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-400">
                                <User size={32} />
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {categories.find(c => c.value === selectedCategory)?.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {getCategoryCount(user)}
                          </span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                            <ChevronLeft size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">لا توجد نتائج</h3>
                <p className="text-gray-500">جرب استخدام كلمات بحث أخرى أو فئة مختلفة.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
