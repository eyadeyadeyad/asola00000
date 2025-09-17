import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  deleteOrder,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  function handleDeleteOrder(orderId) {
    dispatch(deleteOrder(orderId)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "تم حذف الطلب بنجاح",
        });
        dispatch(getAllOrdersForAdmin());
      }
    });
  }

  function isNewOrder(orderDate) {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const diffInHours = (now - orderTime) / (1000 * 60 * 60);
    return diffInHours < 24; // طلب جديد إذا كان أقل من 24 ساعة
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>جميع الطلبات</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>تاريخ الطلب</TableHead>
              <TableHead>حالة الطلب</TableHead>
              <TableHead>سعر الطلب</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id} className={isNewOrder(orderItem?.orderDate) ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}>
                    <TableCell className="flex items-center gap-2">
                      {orderItem?._id}
                      {isNewOrder(orderItem?.orderDate) && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          جديد
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                            size="sm"
                          >
                            عرض التفاصيل
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                        <Button
                          onClick={() => handleDeleteOrder(orderItem?._id)}
                          variant="destructive"
                          size="sm"
                        >
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      لا توجد طلبات حالياً
                    </h3>
                  </TableCell>
                </TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
