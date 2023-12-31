import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import InputBoxForm from "../../components/InputBoxForm";
import { API_URL } from "../../helper";
import { userLoaded } from "../../redux/slice/accountSlice";
import ModalForResetPass from "../../components/ModalForResetPass";
import ModalForLoading from "../../components/ModalForLoading";
import { Dialog } from "@headlessui/react";
import Toast from "../../components/Toast/Toast";
// import { loginAction } from "../redux/action/accountAction";

const LandingPageLogin = () => {
  const [inUsername, setInUsername] = useState("");
  const [inPassword, setInPassword] = useState("");
  const [isOpenForgot, setIsOpenForgot] = useState(false);
  const [isOpenLoad, setIsOpenLoad] = useState(false);
  const [focusUsername, setFocusUsername] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [openToastFailUp, setOpenToastFailUp] = useState(false);
  const [toastBodies, setToastBodies] = useState("");

  const userGlobal = useSelector((state) => state.accountSliceReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogin = async () => {
    try {
      setIsOpenLoad(true);
      const response = await axios.post(API_URL + `/auths/login`, {
        username: inUsername,
        password: inPassword,
      });
      console.log("check user", response.data.result.token);
      if (response.data.result.token) {
        localStorage.setItem("token", response.data.result.token);
        dispatch(userLoaded(response.data.result));
      }
      setIsOpenLoad(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setIsOpenLoad(false);
      setOpenToastFailUp(true);
      setToastBodies(error.response.data.message);
    }
  };
  useEffect(() => {
    if (userGlobal.token) {
      navigate("/");
    }
  }, [userGlobal?.user]);
  useEffect(() => {
    if (openToastFailUp) {
      setTimeout(() => {
        setOpenToastFailUp(false);
      }, 2800);
    }
  }, [openToastFailUp]);
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main className=" hidden relative  h-16 lg:block lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Pattern"
            src="https://images.pexels.com/photos/625644/pexels-photo-625644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className="absolute inset-0 h-screen w-full object-cover overflow-hidden"
          />
        </main>

        <aside className="flex items-center justify-center px-4 py-4 sm:px-6 lg:col-span-7 lg:px-12 lg:py-8 xl:col-span-6">
          <div className=" flex flex-col justify-center items-center lg:items-baseline h-full w-full ">
            <div className=" ps-8">
              <p
                className="font-bold text-base md:text-2xl cursor-pointer"
                onClick={() => {
                  navigate("/");
                }}
              >
                Find<span className="font-black text-[#d2633b]">TIX</span>
              </p>
              <h2 className="text-2xl font-bold leading-7 text-black sm:truncate sm:text-3xl sm:tracking-tight">
                Login
              </h2>
            </div>
            <form
              className={
                "bg-white  rounded-md max-h-fit w-10/12 px-8 pt-6 pb-8 mb-4 "
              }
            >
              <div className="mb-5">
                <InputBoxForm
                  htmlName="name"
                  placeholderText="Your Username"
                  focusState={focusUsername}
                  setFocusState={setFocusUsername}
                  labelState={inUsername}
                  onChanger={(e) => setInUsername(e.target.value)}
                  names="name"
                  inputType="text"
                  className="lg:w-80"
                />
              </div>
              <div className="mb-6">
                <InputBoxForm
                  htmlName="password"
                  placeholderText="Password"
                  focusState={focusPassword}
                  setFocusState={setFocusPassword}
                  labelState={inPassword}
                  onChanger={(e) => setInPassword(e.target.value)}
                  names="password"
                  inputType="password"
                  className={` lg:w-80 ${
                    inPassword.length <= 7 && inPassword.length > 0
                      ? `border-2 border-red-500 `
                      : ``
                  }`}
                />
                {focusPassword && inPassword.length <= 0 ? (
                  <p className="text-red-500 text-xs italic">
                    Please enter a password.
                  </p>
                ) : (
                  <div className=" h-4"></div>
                )}
              </div>
              <div className="flex flex-col gap-y-2 justify-between">
                <button
                  className=" bg-orange-500 hover:bg-orange-600 text-black w-full lg:w-80 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => {
                    onLogin();
                  }}
                >
                  Login
                </button>
                <a
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  href="#"
                  onClick={() => {
                    setIsOpenForgot(!isOpenForgot);
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <Dialog
                open={isOpenLoad}
                onClose={() => setIsOpenLoad(false)}
                className="relative z-40"
              >
                <ModalForLoading />
              </Dialog>
              <Dialog
                open={isOpenForgot}
                onClose={() => setIsOpenForgot(false)}
                className="relative z-20"
              >
                <ModalForResetPass
                  onClickforX={() => setIsOpenForgot(!isOpenForgot)}
                />
              </Dialog>
              <Toast
                type="error"
                open={openToastFailUp}
                setOpen={setOpenToastFailUp}
                right="10px"
                top="60px"
                head="Error"
                body={toastBodies}
              />
            </form>
            <div className=" max-w-sm mx-auto text-center mt-12 mb-6">
              <p className=" text-black text-sm">
                Don't have an account?{" "}
                <Link
                  to={"/auth/register"}
                  className="font-bold text-orange-500 hover:underline"
                >
                  Sign up
                </Link>
                .
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default LandingPageLogin;
