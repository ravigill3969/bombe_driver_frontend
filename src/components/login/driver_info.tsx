import { ArrowRightCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

function DriverInfo() {
  const [isUserInfoActive, setIsUserInfoActive] = useState(true);

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Card className="w-[70%]">
        <CardHeader className="text-2xl font-bold text-gray-900">
          Bombe
        </CardHeader>
        <CardTitle className="ml-7 text-xl font-semibold">
          Create new account!
        </CardTitle>

        <div className="flex  gap-3 justify-center items-center">
          <Button
            onClick={() => {
              setIsUserInfoActive(true);
            }}
            className={
              isUserInfoActive ? "bg-yellow-400 font-bold" : "font-bold"
            }
          >
            Driver Info
          </Button>
          <Button
            onClick={() => {
              setIsUserInfoActive(false);
            }}
            className={
              !isUserInfoActive ? "bg-yellow-400 font-bold" : "font-bold"
            }
          >
            Car Info
          </Button>
        </div>

        <CardDescription className="ml-7 text-red-500 font-bold">
          All the inputs are required
        </CardDescription>

        {isUserInfoActive && (
          <CardContent className="flex flex-col gap-3">
            <div className="grid gap-1">
              <Label className="font-semibold">Firstname</Label>
              <Input placeholder="john doe" />
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">Lastname</Label>
              <Input placeholder="john doe" />
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">License no.</Label>
              <Input placeholder="License no." />
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">Email</Label>
              <Input type="email" placeholder="john@company.com" />
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">Phone no.</Label>
              <Input type="number" placeholder="+1 000-000-0000" />
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">Password</Label>
              <Input type="password" placeholder="**********" />
            </div>
          </CardContent>
        )}

        {!isUserInfoActive && (

          // year
          // color

          <CardContent className="flex flex-col gap-3">
            <div className="grid gap-1">
              <Label className="font-semibold">License Plate</Label>
              <Input placeholder="License Plate" />
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">Make</Label>
              <Input placeholder="Honda" />
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">Model</Label>
              <Input placeholder="Accord" />
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">Year</Label>
              <Input placeholder="2026" type="number" min={2010} max={2026} defaultValue={2025}/>
            </div>
            <div className="grid gap-1">
              <Label className="font-semibold">Color</Label>
              <Input placeholder="Black" type="text"/>
            </div>
          </CardContent>
        )}
        <CardFooter>
          <Button>
            Submit <ArrowRightCircleIcon />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DriverInfo;
