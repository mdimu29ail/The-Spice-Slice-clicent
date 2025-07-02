import Lottie from 'lottie-react';
import { Link, useNavigate } from 'react-router';
import animationData from '../assets/register.json';
import { use } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';

const Register = () => {
  const { createUser } = use(AuthContext);
  const navigate = useNavigate();
  const handleRegister = e => {
    e.preventDefault();
    const from = e.target;
    const email = from.email.value;
    const password = from.password.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(password)) {
      return Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'Password must be at least 6 characters, include an uppercase and a lowercase letter.',
      });
    }

    createUser(email, password)
      .then(result => {
        console.log(result);

        navigate('/');
      })
      .catch(error => {
        console.log(error);
        // ..
      });
  };

  const inputStyle =
    'w-full px-5 py-3 rounded-full bg-[#b0c4de] flex items-center justify-center gap-3 text-gray-700 ';

  return (
    <div className="hero min-h-screen animated-bg border-b-2 rounded-2xl">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center min-h-screen bg-transparent dark:bg-gray-900 border-b-2 rounded-2xl">
        <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark:bg-gray-50 dark:text-gray-800 border-b-2">
          <h1 className="text-2xl font-bold text-center border-b-2 rounded-2xl">
            Create your account
          </h1>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-1 text-sm">
              <label htmlFor="username" className="block dark:text-gray-600">
                Username
              </label>
              <input
                type="Username"
                name="name"
                placeholder="Username"
                className={inputStyle}
              />
            </div>
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

          <p className="text-xs text-center sm:px-6 dark:text-gray-600">
            Don't have an account?
            <Link
              to="/login"
              className="border-b-2 rounded-2xl px-3 py-1 ml-2 hover:text-green-600 font-bold"
            >
              Log In
            </Link>
          </p>
        </div>

        <div className="w-full max-w-md p-8">
          <Lottie loop={true} animationData={animationData}></Lottie>
        </div>
      </div>
    </div>
  );
};

export default Register;
