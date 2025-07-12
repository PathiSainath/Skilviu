// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});

//   const navigate = useNavigate();

//   const VALID_EMAIL = 'Admin@skilviu.com';
//   const VALID_PASSWORD = 'Skilviu@4';

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newErrors = {};

//     if (!email) {
//       newErrors.email = 'Email is required';
//     }

//     if (!password) {
//       newErrors.password = 'Password is required';
//     }

//     if (email && email !== VALID_EMAIL) {
//       newErrors.email = 'Wrong email';
//     }

//     if (email === VALID_EMAIL && password && password !== VALID_PASSWORD) {
//       newErrors.password = 'Wrong password';
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       navigate('/admindashboard');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

//         <form onSubmit={handleSubmit} noValidate>
//           <div className="mb-4">
//             <label htmlFor="email" className="block font-medium mb-1">Email Address</label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500`}
//               placeholder="Enter your email"
//             />
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//           </div>

//           <div className="mb-4 relative">
//             <label htmlFor="password" className="block font-medium mb-1">Password</label>
//             <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={`w-full px-4 py-2 pr-10 border rounded-md outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500`}
//               placeholder="Enter your password"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-9 right-3 text-gray-600 cursor-pointer"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//           </div>


//           <div className="flex items-center justify-between mb-6">
//             <label className="inline-flex items-center text-sm">
//               <input type="checkbox" className="form-checkbox text-blue-600" />
//               <span className="ml-2">Remember me</span>
//             </label>
//             <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('https://skilviu.com/backend/api/v1/login', {
        username: email,
        password: password,
      });

      const { status, data } = response.data;

      if (status) {
        // Redirect based on role
        switch (data.user_role) {
          case 'Admin':
            navigate('/admindashboard');
            break;
          case 'Bdm':
            navigate('/businessdashboard');
            break;
          case 'Hrteam':
            navigate('/hrteamdashboard');
            break;
          default:
            setServerError('Technical Server Failure');
        }
      } else {
        setServerError('Invalid credentials');
      }
    } catch (error) {
      setServerError('Login failed. Check your credentials or server.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

        {serverError && <p className="text-red-600 text-center mb-4">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block font-medium mb-1">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 pr-10 border rounded-md outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="inline-flex items-center text-sm">
              <input type="checkbox" className="form-checkbox text-blue-600" />
              <span className="ml-2">Remember me</span>
            </label>
            {/* <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a> */}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
