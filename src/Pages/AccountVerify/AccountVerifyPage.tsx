import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRegister, VerifyAccountData } from "../../Services/RegisterService";
import { useLocation, Navigate } from "react-router-dom";
import { ApiError } from "../../Utils/ApiError";
import { toast } from "react-toastify";

type Props = {};

interface LocationState {
  username: string;
  role: string;
}

type VerificationFormInputs = Omit<VerifyAccountData, 'username'>;

const validation = Yup.object().shape({
  verificationCode: Yup.string().required("Verification code is required"),
});

const AccountVerifyPage = (props: Props) => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { verifyAccount, resendVerificationCode } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<VerificationFormInputs>({ 
    resolver: yupResolver(validation)
  });

  // Move the navigation check here, after hooks
  if (!state?.username) {
    toast.error("Please register first");
    return <Navigate to="/register" replace />;
  }

  const handleVerification = async (formData: VerificationFormInputs) => {
    try {
      const verificationData: VerifyAccountData = {
        username: state.username,
        verificationCode: formData.verificationCode
      };
      
      await verifyAccount(verificationData);
      if (state.role === 'ROLE_VENDOR') {
        toast.success("Your email has been successfully verified! Please wait for the admin to review and approve your account.");
      } else {
        toast.success("Your email has been successfully verified!");
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      if ((error as ApiError).message) {
        const apiError = error as ApiError;
        if (apiError.message.toLowerCase().includes('verification')) {
          setError('verificationCode', {
            type: 'server',
            message: apiError.message
          });
        } else {
          toast.error(apiError.message);
        }
      } else {
        toast.error('An error occurred during verification');
      }
    }
  };

  const handleResendVerificationCode = async() => {
    await resendVerificationCode(state.username);
    toast.success("Verification code resend!");
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mb-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Verify Your Account
            </h1>
            <div className="text-sm text-gray-600">
              Verifying account for: {state.username}
            </div>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleVerification)}
            >
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Verification Code
                </label>
                <input 
                  type="text" 
                  id="verificationCode"
                  className={`bg-gray-50 border ${
                    errors.verificationCode ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                  placeholder="Enter verification code"
                  {...register("verificationCode")} 
                />
                {errors.verificationCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.verificationCode.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-lightGreen hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Verify Account
              </button>
              <p className="text-sm text-center text-gray-500">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendVerificationCode}
                  className="text-blue-600 hover:underline"
                >
                  Resend code
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountVerifyPage;