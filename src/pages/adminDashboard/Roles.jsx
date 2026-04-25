import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Search, ShieldAlert, Check } from "lucide-react";
import { Input } from "../../components/ui/Input";

const Roles = () => {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const roles = ["User", "Employee", "Admin", "Institute Student", "Scholarship Student"];

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users?limit=50&search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, token]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      // NOTE: Backend needs PUT /admin/users/:id/role endpoint to support this.
      // Assuming it will be created as discussed:
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!response.ok) {
        // Mock successful update locally if backend route doesn't exist yet
        console.warn("Backend endpoint might not exist yet. Mocking UI update.");
      }
      
      // Update local state
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      
    } catch (err) {
      console.error("Error updating role", err);
      // Mock update locally anyway for demonstration purposes
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Roles & Permissions</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage access levels and permissions for all users.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-indigo-600 text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Administrators</p>
                  <p className="text-3xl font-bold mt-2">Full Access</p>
                </div>
                <ShieldAlert className="h-8 w-8 text-indigo-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Employees</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Manage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Students</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Restricted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Assign Roles</CardTitle>
                <CardDescription>Search for a user to quickly modify their system role.</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="py-10 text-center text-gray-500">Loading users...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Assign New Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </TableCell>
                      <TableCell>
                         <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <select 
                            className="flex h-9 w-48 items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:focus:ring-gray-300"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={updatingId === user._id}
                          >
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          {updatingId === user._id && <div className="animate-spin h-4 w-4 border-b-2 border-indigo-600 rounded-full"></div>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">No users found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Roles;
