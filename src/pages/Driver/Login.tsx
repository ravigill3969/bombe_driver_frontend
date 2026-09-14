import { useLoginDriver } from "@/API/driver/driver_api";
import NavDesktop from "@/components/nav/nav_desktop";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDriverInfoContext } from "@/context/DriverInfoContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function DriverLogIn() {
  const mavigate = useNavigate();
  const { isVerified, isPending } = useDriverInfoContext();

  useEffect(() => {
    if (isVerified && !isPending) {
      mavigate("/driver");
    }
  }, [isVerified, mavigate, isPending]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate } = useLoginDriver();
  return (
    <div className="min-h-screen bg-zinc-50/60">
      <NavDesktop NavFor="driver" isDriverVerified={false} />
      <div className="flex min-h-[calc(100vh-4rem)] justify-center items-center px-4 py-12">
        <Card className="w-full max-w-md border-zinc-200/80 bg-white shadow-xl shadow-zinc-200/50 rounded-2xl transition-all">
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
              Login into your account
            </CardTitle>
            <CardDescription className="text-zinc-500 text-sm">
              Enter your Email and password account to log in.
            </CardDescription>
            <CardAction>
              <Button
                variant="link"
                className="text-zinc-900 font-semibold p-0 h-auto hover:text-zinc-700"
              >
                Sign In
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-600"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-11 text-zinc-900"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-600"
                    >
                      Password
                    </Label>
                    <a
                      href="#"
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline-offset-4 hover:underline transition-colors"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-11 text-zinc-900"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-11 rounded-xl font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                mutate({ email, password });
              }}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100/80 h-11 rounded-xl font-medium transition-all active:scale-[0.99] cursor-pointer"
            >
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default DriverLogIn;
