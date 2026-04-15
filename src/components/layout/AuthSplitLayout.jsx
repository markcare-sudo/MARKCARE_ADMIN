// const AuthSplitLayout = ({ children, marketing }) => {
//   return (
//     <div className="min-h-screen bg-[url('/auth-bg.jpg')] bg-cover bg-center flex items-center justify-center px-4">

//       <div className="w-full max-w-7xl bg-white rounded shadow-2xl overflow-hidden">

//         <div className="grid grid-cols-1 md:grid-cols-12">

//           {/* LEFT SIDE (8 columns now) */}
//           <div className="hidden md:flex md:col-span-8 bg-gradient-to-br from-blue-700 to-blue-500 text-white p-12 flex-col justify-center space-y-6">

//             <h1 className="text-3xl font-bold leading-snug">
//               {marketing?.title}
//             </h1>

//             <p className="text-sm opacity-90">
//               {marketing?.subtitle}
//             </p>

//             <ul className="space-y-4 text-sm mt-6">
//               {marketing?.features?.map((item, index) => (
//                 <li key={index}>✔ {item}</li>
//               ))}
//             </ul>

//             <h2 className="text-xl font-semibold mt-8">
//               {marketing?.trialText}
//             </h2>

//             <p className="text-sm mt-4">
//               {marketing?.supportText}
//             </p>

//           </div>

//           {/* RIGHT SIDE (4 columns now) */}
//           <div className="col-span-1 md:col-span-4 flex items-center justify-center p-6 md:p-10">

//             <div className="w-full max-w-sm">
//               {children}
//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default AuthSplitLayout;





// const AuthSplitLayout = ({ children, marketing }) => {
//   return (
//     /* 1. Main Wrapper: Ensure it takes full height but allows the page to scroll on small screens */
//     <div className="min-h-screen w-full bg-[url('/auth-bg.jpg')] bg-cover bg-center flex items-center justify-center p-0 md:p-6 lg:p-10">
      

//       <div className="flex items-center justify-center w-full max-w-7xl bg-white shadow-2xl flex flex-col md:flex-row rounded overflow-hidden md:max-h-[90vh] min-h-screen md:min-h-0">
        
//         {/* LEFT SIDE (Marketing) 
//             - Mobile: Hidden (usually preferred for login UX) OR order-2
//             - Desktop: Shown, takes 8/12 columns
//         */}
//         <div className="hidden md:flex md:w-3/5 lg:w-2/3 bg-gradient-to-br from-blue-700 to-blue-500 text-white p-8 lg:p-16 flex-col justify-center space-y-6">
//           <div className="max-w-md">
//              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
//               {marketing?.title}
//             </h1>
//             <p className="text-base opacity-90 mt-4">
//               {marketing?.subtitle}
//             </p>
            
//             <ul className="space-y-4 mt-8">
//               {marketing?.features?.map((item, index) => (
//                 <li key={index} className="flex items-start gap-3">
//                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✔</span>
//                   <span className="text-sm lg:text-base">{item}</span>
//                 </li>
//               ))}
//             </ul>

//             <div className="pt-10">
//                <h2 className="text-2xl font-semibold">{marketing?.trialText}</h2>
//                <p className="text-sm mt-2 opacity-70">Need help? {marketing?.supportText}</p>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE (Form) 
//             - Mobile: Takes full width/height
//             - Desktop: Scrollable inner content
//         */}
//         <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col bg-white">
//           <div className="flex-1 overflow-y-auto px-6 py-10 md:px-10 md:py-16 custom-scrollbar flex items-center">
//             <div className="w-full max-w-sm mx-auto">              
//               {children}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AuthSplitLayout;

const AuthSplitLayout = ({ children, marketing }) => {
  return (
    /* 1. Main Wrapper: 
      - We use 'overflow-y-auto' here so that if the whole card is too big for mobile, 
        the user can scroll the entire page.
    */
    <div className="min-h-screen w-full bg-[url('/auth-bg.jpg')] bg-cover bg-center flex md:items-center justify-center overflow-y-auto">
      
      {/* 2. Main Card: 
        - Mobile: 'min-h-screen' so it fills the phone but stays centered.
        - Desktop: Fixed 'h-[90vh]' to trigger the right-side internal scroll.
      */}
      <div className="w-full max-w-7xl bg-white shadow-2xl flex flex-col md:flex-row rounded overflow-hidden min-h-screen md:min-h-0 md:h-[90vh] my-auto">
        
        {/* LEFT SIDE: Marketing (Hidden on mobile to save space) */}
        <div className="hidden md:flex md:w-3/5 lg:w-2/3 bg-gradient-to-br from-blue-700 to-blue-500 text-white p-8 lg:p-16 flex-col justify-center space-y-6">
          <div className="max-w-md">
             <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              {marketing?.title}
            </h1>
            <p className="text-base opacity-90 mt-4">
              {marketing?.subtitle}
            </p>
            
            <ul className="space-y-4 mt-8">
              {marketing?.features?.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✔</span>
                  <span className="text-sm lg:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-10">
               <h2 className="text-2xl font-semibold">{marketing?.trialText}</h2>
               <p className="text-sm mt-2 opacity-70">Need help? {marketing?.supportText}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form Container */}
        <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col bg-white overflow-hidden">
          
          {/* This is the magic div:
            - 'md:overflow-y-auto': Only scroll inside this box on Desktop.
            - 'justify-center': Keeps the form centered when content is small.
          */}
          <div className="flex-1 flex flex-col justify-center md:overflow-y-auto px-6 py-12 md:px-8 lg:px-10 custom-scrollbar">
            
            <div className="w-full max-w-sm mx-auto">
              {children}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthSplitLayout;