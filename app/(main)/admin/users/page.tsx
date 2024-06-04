'use client'
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { userResponseType } from '@/app/lib/definations';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/authContext';
import NotLoggedIn from '@/app/ui/NotLoggedIn';
import Loading from '@/app/ui/Loading';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import DialogBox from '@/app/ui/DialogBox';
import { set } from 'zod';

const UserManagement = () => {
  let content;
  const router = useRouter();
  const { token, roles, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated || token === null || token === ' ') {
    if (isAuthenticated !== null && token !== ' ') {
      content = <NotLoggedIn />
    }
    else {
      content = <Loading />
    }
  }

  else if (roles && !roles.includes('Admin'))
    router.push('/')

  else {
    content = <div className="container mx-auto p-4">
      <Suspense fallback={<Loading />}>
        <UserList token={token} />
      </Suspense>
    </div>
  }
  return content;
}

const UserList = ({ token }: { token: string }) => {
  const [users, setUsers] = useState<userResponseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<userResponseType | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<userResponseType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUsers(userResponse.data.data);
        setFilteredUsers(userResponse.data.data);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  const handleEdit = (user: userResponseType) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleUserRoles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    if (selectedUser) {
      let userRoles = selectedUser.roles;
      if (checked) {
        userRoles = [...userRoles, value];
      } else {
        userRoles = userRoles.filter((role) => role !== value);
      }
      setSelectedUser({
        ...selectedUser,
        roles: userRoles
      });
    }
  }

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/user/${selectedUser?._id}`, {
        roles: selectedUser?.roles
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedUsers = users.map((u) => {
        if (u._id === selectedUser?._id) {
          return selectedUser;
        }
        return u;
      });
      setUsers(updatedUsers);
      setIsDialogOpen(false);
      setSelectedUser(null);
      toast.success('User roles updated successfully');
    } catch (error: any) {
      toast.error('There was some problem updating user roles');
      console.error(error.message);
    }
  }

  const handleDelete = async (user: userResponseType) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedUsers = users.filter((u) => u._id !== user._id);
      setUsers(updatedUsers);
      toast.success('User deleted successfully');
    } catch (error: any) {
      toast.error('There was some problem deleting that user');
      console.error(error.message);
    }
  };

  if (isLoading)
    return <Loading />

  return (
    <div className="container mx-auto my-8">
      <div className="bg-white rounded-lg shadow-md">
        <DialogBox isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Select User Role">
          <div className="flex flex-col gap-4 p-4">
            <h1 className='font-bold'>{selectedUser?.name}</h1>
            <div className='flex items-center'>
              <input
                className='p-2 border rounded-md mx-2'
                type="checkbox" value="Customer" id="Customer" name="Customer"
                onChange={handleUserRoles}
                checked={selectedUser?.roles.includes('Customer')}
              />
              <label htmlFor="Customer">Customer</label>
            </div>
            <div className='flex items-center'>
              <input
                className='p-2 border rounded-md mx-2'
                type="checkbox" value="Merchant" id="Merchant" name="Merchant"
                onChange={handleUserRoles}
                checked={selectedUser?.roles.includes('Merchant')}
              />
              <label htmlFor="Merchant">Merchant</label>
            </div>
            <div className='flex items-center'>
              <input
                className='p-2 border rounded-md mx-2'
                type="checkbox" value="Admin" id="Admin" name="Admin"
                onChange={handleUserRoles}
                checked={selectedUser?.roles.includes('Admin')}
              />
              <label htmlFor="Admin">Admin</label>
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Save</button>
          </div>
        </DialogBox>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 bg-indigo-600 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold mb-4 sm:mb-0">User Management</h2>
          <SearchUser users={users} setFilteredUsers={setFilteredUsers} />
        </div>
        <div className="px-4 sm:px-6 py-4 overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={uuid()} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border text-end">
                    {user.roles.map((role) => <div key={uuid()}>{role}</div>)}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                        onClick={() => handleEdit(user)}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SearchUser = ({ users, setFilteredUsers }: {
  users: userResponseType[],
  setFilteredUsers: React.Dispatch<React.SetStateAction<userResponseType[]>>
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      user.email.toLowerCase().includes(event.target.value.toLowerCase()) ||
      user.roles.some((role) => role.toLowerCase().includes(event.target.value.toLowerCase()))
    );
    setFilteredUsers(filteredUsers);
  };

  return (
    <div className="px-6">
      <input
        type="text"
        placeholder="Search for users..."
        className="p-2 border rounded text-black font-semibold w-full sm:w-64"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
}


export default UserManagement;