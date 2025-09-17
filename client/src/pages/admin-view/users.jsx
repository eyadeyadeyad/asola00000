import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, banUser, unbanUser } from "@/store/admin/users-slice";

function AdminUsers() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { userList, isLoading } = useSelector((state) => state.adminUsers);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  function handleBanUser(userId) {
    dispatch(banUser(userId)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "تم حظر المستخدم بنجاح",
        });
        dispatch(getAllUsers());
      }
    });
  }

  function handleUnbanUser(userId) {
    dispatch(unbanUser(userId)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "تم إلغاء حظر المستخدم بنجاح",
        });
        dispatch(getAllUsers());
      }
    });
  }

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ التسجيل</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList && userList.length > 0
              ? userList.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                        {user.role === "admin" ? "أدمن" : "مستخدم"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isBanned ? "destructive" : "default"}>
                        {user.isBanned ? "محظور" : "نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      {user.role !== "admin" && (
                        <Button
                          onClick={() =>
                            user.isBanned
                              ? handleUnbanUser(user._id)
                              : handleBanUser(user._id)
                          }
                          variant={user.isBanned ? "default" : "destructive"}
                          size="sm"
                        >
                          {user.isBanned ? "إلغاء الحظر" : "حظر"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminUsers;