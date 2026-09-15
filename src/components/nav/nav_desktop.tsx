import { CircleHelpIcon, HandIcon, LogOutIcon, User } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useLogoutDriver } from "@/API/driver/driver_api";
import { useLogoutRider } from "@/API/rider/rider_apis";

interface NavDesktopProps {
  NavFor: "driver" | "rider" | "home";
  isDriverVerified?: boolean;
  isRiderVerified?: boolean;
}

function NavDesktop({
  NavFor,
  isDriverVerified,
  isRiderVerified,
}: NavDesktopProps) {
  const { mutate: logoutDriver } = useLogoutDriver();
  const { mutate: logoutRider } = useLogoutRider();
  return (
    <header className="sticky overflow-hidden  top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs transition-all">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {" "}
        <div className="flex justify-between items-center w-full">
          {/*//logo and stuff*/}
          <Link to={"/"}>
            <div className="font-black text-2xl tracking-tight text-zinc-900 flex items-center gap-3">
              Bombe
              {NavFor && (
                <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-700 border border-zinc-300">
                  {NavFor}
                </span>
              )}
            </div>
          </Link>
          {/*//auth and profile*/}
          <div className="flex items-center gap-3">
            {NavFor == "rider" && (
              <>
                {!isRiderVerified ? (
                  <>
                    <button
                      className={
                        "bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full flex justify-center gap-2 items-center font-semibold text-sm transition-all duration-200 active:scale-95 shadow-xs"
                      }
                    >
                      <Link to={"/rider"} className="flex gap-2 items-center">
                        <User strokeWidth={2.5} size={15} />
                        Login
                      </Link>
                    </button>
                    <Button
                      className={
                        "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                      }
                    >
                      <Link to={"/rider/register"}>Sign up</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className={
                        "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                      }
                    >
                      <Link
                        to={"/rider/riderinfo"}
                        className="flex gap-2 items-center"
                      >
                        <User strokeWidth={2.5} size={15} />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      onClick={() => logoutRider()}
                      className={
                        "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                      }
                    >
                      <div className="flex gap-2 items-center">
                        <LogOutIcon strokeWidth={2.5} size={15} />
                        Logout
                      </div>
                    </Button>
                  </>
                )}
              </>
            )}

            {NavFor == "driver" && (
              <>
                {!isDriverVerified ? (
                  <>
                    <button
                      className={
                        "bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full flex justify-center gap-2 items-center font-semibold text-sm transition-all duration-200 active:scale-95 shadow-xs"
                      }
                    >
                      <Link to={"/driver"} className="flex gap-2 items-center">
                        <User strokeWidth={2.5} size={15} />
                        Login
                      </Link>
                    </button>
                    <Button
                      className={
                        "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                      }
                    >
                      <Link to={"/driver/register"}>Sign up</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className={
                        "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                      }
                    >
                      <Link
                        to={"/driver/driverinfo"}
                        className="flex gap-2 items-center"
                      >
                        <User strokeWidth={2.5} size={15} />
                        Profile
                      </Link>
                    </Button>
                    <Button onClick={()=>logoutDriver()}
                      className={
                        "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                      }
                    >
                      <div className="flex gap-2 items-center">
                        <LogOutIcon strokeWidth={2.5} size={15} />
                        Logout
                      </div>
                    </Button>
                  </>
                )}
              </>
            )}
            {NavFor == "home" && (
              <>
                <button
                  className={
                    "bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full flex justify-center gap-2 items-center font-semibold text-sm transition-all duration-200 active:scale-95 shadow-xs"
                  }
                >
                  About <HandIcon />
                </button>
                <Button
                  className={
                    "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                  }
                >
                  Contact
                  <CircleHelpIcon size={5} />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavDesktop;

// import { CircleHelpIcon, HandIcon, User, User2 } from "lucide-react";
// import { Button } from "../ui/button";
// import { Link } from "react-router";
// import { useRiderInfoContext } from "@/context/RiderInfoContext";
// import { useDriverInfoContext } from "@/context/DriverInfoContext";

// interface NavDesktopProps {
//   NavFor: "driver" | "rider" | "home";
// }

// function NavDesktop({ NavFor }: NavDesktopProps) {
//   const { isVerified } = useRiderInfoContext();
//   const { isVerified: isDriverVerified } = useDriverInfoContext();
//   return (
//     <header className="sticky overflow-hidden  top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md shadow-xs transition-all">
//       <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
//         {" "}
//         <div className="flex justify-between items-center w-full">
//           {/*//logo and stuff*/}
//           <div className="font-black text-2xl tracking-tight text-zinc-900 flex items-center gap-3">
//             Bombe
//             {NavFor && (
//               <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-700 border border-zinc-300">
//                 {NavFor}
//               </span>
//             )}
//           </div>
//           {/*//auth and profile*/}
//           <div className="flex items-center gap-3">
//             {NavFor == "rider" && (
//               <>
//                 {isVerified ? (
//                   <>
//                     <button
//                       className={
//                         "bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full flex justify-center gap-2 items-center font-semibold text-sm transition-all duration-200 active:scale-95 shadow-xs"
//                       }
//                     >
//                       <Link
//                         to={"/rider/login"}
//                         className="flex gap-2 items-center"
//                       >
//                         <User strokeWidth={2.5} size={15} />
//                         Login
//                       </Link>
//                     </button>
//                     <Button
//                       className={
//                         "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
//                       }
//                     >
//                       <Link to={"/rider/register"}>Sign up</Link>
//                     </Button>
//                   </>
//                 ) : (
//                   <div>
//                     {" "}
//                     <button
//                       className={
//                         "bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full flex justify-center gap-2 items-center font-semibold text-sm transition-all duration-200 active:scale-95 shadow-xs"
//                       }
//                     >
//                       <Link
//                         to={"/rider/riderinfo"}
//                         className="flex gap-2 items-center"
//                       >
//                         <User2 strokeWidth={2.5} size={15} />
//                         Profile
//                       </Link>
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}

//             {NavFor == "driver" && (
//               <>
//                 {!isDriverVerified ? (
//                   <>
//                     <button
//                       className={
//                         "bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full flex justify-center gap-2 items-center font-semibold text-sm transition-all duration-200 active:scale-95 shadow-xs"
//                       }
//                     >
//                       <Link
//                         to={"/driver/login"}
//                         className="flex gap-2 items-center"
//                       >
//                         <User strokeWidth={2.5} size={15} />
//                         Login
//                       </Link>
//                     </button>
//                     <Button
//                       className={
//                         "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
//                       }
//                     >
//                       <Link to={"/driver/register"}>Sign up</Link>
//                     </Button>
//                   </>
//                 ) : (
//                   <div>
//                     {" "}
//                     <button
//                       className={
//                         "bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full flex justify-center gap-2 items-center font-semibold text-sm transition-all duration-200 active:scale-95 shadow-xs"
//                       }
//                     >
//                       <Link
//                         to={"/driver/driverinfo"}
//                         className="flex gap-2 items-center"
//                       >
//                         <User2 strokeWidth={2.5} size={15} />
//                         Profile
//                       </Link>
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//             {NavFor == "home" && (
//               <>
//                 <button
//                   className={
//                     "bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full flex justify-center gap-2 items-center font-semibold text-sm transition-all duration-200 active:scale-95 shadow-xs"
//                   }
//                 >
//                   About <HandIcon />
//                 </button>
//                 <Button
//                   className={
//                     "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-5 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
//                   }
//                 >
//                   Contact
//                   <CircleHelpIcon size={5} />
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default NavDesktop;
