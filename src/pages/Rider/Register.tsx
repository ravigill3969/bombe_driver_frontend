import RiderInfo from "@/components/login_ui/rider_info";
import NavDesktop from "@/components/nav/nav_desktop";

function DriverRegister() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between">
      <NavDesktop NavFor="rider" isRiderVerified={false} />

      <div className="flex min-h-[calc(100vh-4rem)] w-full items-stretch justify-center bg-zinc-100/50">
        {/*left*/}
        <RiderInfo />
      </div>

      <footer className="py-4 border-t border-zinc-200 bg-white text-center text-xs font-medium text-zinc-500">
        © Bombe Inc. All rights reserved.
      </footer>
    </div>
  );
}

export default DriverRegister;
