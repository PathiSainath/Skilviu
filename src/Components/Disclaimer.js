// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';


// function Disclaimer() {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const hasSeenDisclaimer = sessionStorage.getItem('seenDisclaimer');
//     if (!hasSeenDisclaimer) {
//       setShow(true);
//       sessionStorage.setItem('seenDisclaimer', 'true');
//     }
//   }, []);

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
//       <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md relative">
//         <button
//           className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl sm:text-3xl"
//           onClick={() => setShow(false)}
//           aria-label="Close disclaimer"
//         >
//           &times;
//         </button>
//         <h2 className="text-lg sm:text-xl font-semibold mb-2 text-center">
//           Attention Candidates: Beware of Scams
//         </h2>
//         <p className="text-xs sm:text-sm text-gray-700 mb-4 text-center">
//           Skilviu Soft Solution does not charge any fee at any stage of the recruitment process.
//           Please do not make payments to anyone claiming to represent us.
//         </p>
//         <Link
//           to="/Scams"
//           className="block text-center text-blue-600 text-sm sm:text-base font-medium border border-gray-300 rounded py-2 hover:bg-gray-100 transition"
//         >
//           Click here to know more
//         </Link>

//       </div>
//     </div>
//   );
// }

// export default Disclaimer;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Disclaimer() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenDisclaimer = sessionStorage.getItem('seenDisclaimer');
    if (!hasSeenDisclaimer) {
      setShow(true);
      sessionStorage.setItem('seenDisclaimer', 'true');
    }
  }, []);

  const handleClick = () => {
    setShow(false);           // Close the modal
    navigate('/Scams');       // Navigate to Scams page
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl sm:text-3xl"
          onClick={() => setShow(false)}
          aria-label="Close disclaimer"
        >
          &times;
        </button>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-center">
          Attention Candidates: Beware of Scams
        </h2>
        <p className="text-xs sm:text-sm text-gray-700 mb-4 text-center">
          Skilviu Soft Solution does not charge any fee at any stage of the recruitment process.
          Please do not make payments to anyone claiming to represent us.
        </p>
        <button
          onClick={handleClick}
          className="block w-full text-center text-blue-600 text-sm sm:text-base font-medium border border-gray-300 rounded py-2 hover:bg-gray-100 transition"
        >
          Click here to know more
        </button>
      </div>
    </div>
  );
}

export default Disclaimer;

