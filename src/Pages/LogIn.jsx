import Lottie from 'lottie-react';
import { Link, useLocation, useNavigate } from 'react-router';
import animationData from '../assets/login.json';
import { FcGoogle } from 'react-icons/fc';
import { use } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';

const LogIn = () => {
  const { logIn, signinWithGoogle } = use(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || '/';

  const handleLogin = e => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    logIn(email, password)
      .then(result => {
        console.log(result);
        navigate(from, { replace: true });
        Swal.fire({
          icon: 'success',
          title: 'LogIn successful!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(from);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const loginWithGoogle = () => {
    signinWithGoogle()
      .then(result => {
        console.log(result);
        navigate(from, { replace: true });
        Swal.fire({
          icon: 'success',
          title: 'LogIn successful!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(from);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const inputStyle =
    'w-full px-5 py-3 rounded-full bg-[#b0c4de] flex items-center justify-center gap-3 text-gray-700 ';

  return (
    <div className="hero min-h-screen animated-bg border-b-2 rounded-2xl">
      <div className="hero-content flex-col lg:flex-row-reverse border-b-2 rounded-2xl">
        <div className="text-center lg:text-left">
          <Lottie loop={true} animationData={animationData} />
        </div>

        <div className="card bg-transparent w-full max-w-sm shrink-0 shadow-2xl border-b-2 rounded-2xl">
          <div className="flex-1 w-full max-w-md p-4 rounded-md shadow sm:p-8 dark:bg-gray-50 dark:text-gray-800 ">
            <h2 className="mb-3 text-3xl font-semibold text-center border-b-2 rounded-2xl ">
              Login your account
            </h2>

            <form onSubmit={handleLogin} className="space-y-6 mb-6">
              <div className="space-y-1 text-sm">
                <label htmlFor="username" className="block dark:text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={inputStyle}
                />
              </div>
              <div className="space-y-1 text-sm">
                <label htmlFor="password" className="block dark:text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className={inputStyle}
                />
                <div className="flex justify-end text-xs dark:text-gray-600">
                  <a rel="noopener noreferrer" href="#">
                    Forgot Password?
                  </a>
                </div>
              </div>
              <button className=" w-full py-2  font-bold border-b-2 hover:border-green-600 rounded-2xl  hover:text-green-500 transition-colors">
                Register
              </button>
            </form>

            <p className="text-sm text-center dark:text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="border-b-2 rounded-2xl px-3 py-1 ml-2 hover:text-green-600 font-bold"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="flex items-center w-full my-4">
            <hr className="w-full dark:text-gray-600" />
            <p className="px-3 dark:text-gray-600">OR</p>
            <hr className="w-full dark:text-gray-600" />
          </div>

          <div className="my-6 space-y-4">
            <button
              onClick={loginWithGoogle}
              aria-label="Login with Google"
              type="button"
              className="flex items-center justify-center w-full p-3 space-x-4 border-b-2 hover:border-green-600 rounded-2xl transition-colors hover:text-green-500"
            >
              <FcGoogle size="30px" />
              <p>Login with Google</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
