import { User } from "lucide-react";
import { Button } from "../ui/button";

function NavRiderDesktop() {
  return (
    <div className="border-b-2 sticky top-0">
      <nav className="flex justify-center items-center h-16 ">
        <div className="flex justify-between w-[90vw] ">
          {/*//logo and stuff*/}
          <div className="font-bold text-2xl">Bombe</div>
          {/*//auth and profile*/}
          <div className="flex gap-4">
            <button
              className={
                "bg-gray-50 text-black cursor-pointer hover:bg-gray-200 px-2  py-1 rounded-4xl mt-0.5 flex justify-center gap-1 items-center font-semibold"
              }
            >
              <User strokeWidth={3} size={15} className="" />
              Login
            </button>
            <Button className={"cursor-pointer"}>Sign up</Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavRiderDesktop;
