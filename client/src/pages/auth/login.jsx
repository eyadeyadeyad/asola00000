import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { googleLogin } from "@/store/auth-slice";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          تسجيل الدخول
        </h1>
        <p className="mt-2">
          ليس لديك حساب؟
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
      <div className="space-y-4">
        <GoogleLogin
          useOneTap={false}
          auto_select={false}
          onSuccess={(credentialResponse) => {
            dispatch(googleLogin(credentialResponse.credential)).then((data) => {
              if (data?.payload?.success) {
                toast({
                  title: "Google login successful!",
                });
              } else {
                toast({
                  title: data?.payload?.message || "Google login failed",
                  variant: "destructive",
                });
              }
            });
          }}
          onError={() => {
            toast({
              title: "Google login failed",
              variant: "destructive",
            });
          }}
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              أو استمر بالبريد الإلكتروني
            </span>
          </div>
        </div>
        
        <CommonForm
          formControls={loginFormControls}
          buttonText={"تسجيل الدخول"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                ملاحظة للمستخدمين الجدد
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  إذا كنت جديد ولا تعرف شيئاً عن تسجيل الدخول، اضغط على زر جوجل في أعلى الصفحة واختر حسابك لضمان الحماية والأمان.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;
