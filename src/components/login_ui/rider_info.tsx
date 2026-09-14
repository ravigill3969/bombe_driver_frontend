import { ArrowRightCircleIcon, Camera } from "lucide-react";
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
import { useRegisterRider } from "@/API/rider/rider_apis";

function RiderInfo() {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [home_address, setHomeAddress] = useState("");
  const [work_address, setWorkAddress] = useState("");

  const { mutate, isPending } = useRegisterRider();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !email.trim() ||
      !phone_number.trim() ||
      !password.trim() ||
      !home_address.trim() ||
      !work_address.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (!imageFile || !preview) {
      alert("Please select a profile picture.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    mutate({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      password,
      phone_number: phone_number.trim(),
      image_url: "nothing for now",
      home_address: home_address.trim(),
      work_address: work_address.trim(),
    });
  };

  return (
    <div className="flex w-full max-w-lg justify-center items-center my-auto py-6">
      <Card className="w-full border-zinc-200/80 bg-white shadow-xl shadow-zinc-200/50 rounded-2xl overflow-hidden transition-all">
        <div className="flex">
          <CardHeader className="pb-3 space-y-1 w-100">
            <CardHeader className="p-0 text-3xl font-black tracking-tight text-zinc-900">
              Bombe
            </CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-800">
              Create new rider account!
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
              * All fields are required
            </CardDescription>
          </CardHeader>

          <div className="flex flex-col items-center gap-1">
            <label
              htmlFor="image-upload"
              className="relative flex h-25 w-25 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 overflow-hidden group transition-all shrink-0"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400 group-hover:text-zinc-600 transition-colors">
                  <Camera size={20} />
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={18} className="text-white" />
              </div>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {preview && <Button>Upload</Button>}
          </div>
        </div>

        <CardContent className="flex flex-col gap-3.5 pt-3">
          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Firstname
            </Label>
            <Input
              placeholder="John"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Lastname
            </Label>
            <Input
              placeholder="Doe"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Email
            </Label>
            <Input
              type="email"
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Phone no.
            </Label>
            <Input
              type="tel"
              placeholder="+1 000-000-0000"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Password
            </Label>
            <Input
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Home Address
            </Label>
            <Input
              placeholder="123 Main Street"
              value={home_address}
              onChange={(e) => setHomeAddress(e.target.value)}
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Work Address
            </Label>
            <Input
              placeholder="456 King Street"
              value={work_address}
              onChange={(e) => setWorkAddress(e.target.value)}
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6">
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-11 rounded-xl font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? "Submitting..." : "Submit"}
            <ArrowRightCircleIcon className="w-5 h-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RiderInfo;
