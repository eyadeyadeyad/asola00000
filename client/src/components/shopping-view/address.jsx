import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  fullName: "",
  address: "",
  city: "",
  phone: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();
    
    const userId = user?._id || user?.id;
    console.log('User ID:', userId);
    
    if (!userId) {
      toast({
        title: "خطأ في تسجيل الدخول",
        variant: "destructive",
      });
      return;
    }

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "يمكنك إضافة 3 عناوين كحد أقصى",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: userId,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(userId));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "تم تحديث العنوان بنجاح",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: userId,
          })
        ).then((data) => {
          console.log('Response:', data);
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(userId));
            setFormData(initialAddressFormData);
            toast({
              title: "تم إضافة العنوان بنجاح",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?._id || user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?._id || user?.id));
        toast({
          title: "تم حذف العنوان بنجاح",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      fullName: getCuurentAddress?.fullName,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
    });
  }

  function isFormValid() {
    return formData.fullName.trim() !== "" && formData.address.trim() !== "" && formData.city !== "" && formData.phone.trim() !== "";
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?._id || user?.id));
  }, [dispatch]);

  console.log(addressList, "addressList");

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "تعديل العنوان" : "إضافة عنوان جديد"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "تعديل" : "إضافة"}
          onSubmit={handleManageAddress}
          isBtnDisabled={false}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
