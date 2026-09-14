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
import { useRegisterDriver } from "@/API/driver/driver_api";

function DriverInfo() {
  const [isUserInfoActive, setIsUserInfoActive] = useState(true);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Driver information
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // Vehicle information
  const [carPlate, setCarPlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2025");
  const [color, setColor] = useState("");

  const { mutate, isPending } = useRegisterDriver();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imagePreview = URL.createObjectURL(file);

    setImageFile(file);
    setPreview(imagePreview);
  };

  const handleSubmit = () => {
    // =========================
    // Validate driver information
    // =========================

    if (!firstname.trim()) {
      alert("Please enter your first name.");
      setIsUserInfoActive(true);
      return;
    }

    if (!lastname.trim()) {
      alert("Please enter your last name.");
      setIsUserInfoActive(true);
      return;
    }

    if (!licenseNo.trim()) {
      alert("Please enter your license number.");
      setIsUserInfoActive(true);
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      setIsUserInfoActive(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email address.");
      setIsUserInfoActive(true);
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Please enter your phone number.");
      setIsUserInfoActive(true);
      return;
    }

    if (!password.trim()) {
      alert("Please enter a password.");
      setIsUserInfoActive(true);
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      setIsUserInfoActive(true);
      return;
    }

    // =========================
    // Validate vehicle information
    // =========================

    if (!carPlate.trim()) {
      alert("Please enter your license plate.");
      setIsUserInfoActive(false);
      return;
    }

    if (!make.trim()) {
      alert("Please enter the vehicle make.");
      setIsUserInfoActive(false);
      return;
    }

    if (!model.trim()) {
      alert("Please enter the vehicle model.");
      setIsUserInfoActive(false);
      return;
    }

    if (!year.trim()) {
      alert("Please enter the vehicle year.");
      setIsUserInfoActive(false);
      return;
    }

    const vehicleYear = Number(year);

    if (
      !Number.isInteger(vehicleYear) ||
      vehicleYear < 2010 ||
      vehicleYear > 2026
    ) {
      alert("Please enter a valid vehicle year.");
      setIsUserInfoActive(false);
      return;
    }

    if (!color.trim()) {
      alert("Please enter the vehicle color.");
      setIsUserInfoActive(false);
      return;
    }


    if (!imageFile || !preview) {
      alert("Please select a profile picture.");
      return;
    }

    mutate({
      driver_info: {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        password,
        phone_number: phoneNumber.trim(),
        license_no: licenseNo.trim(),
        image_url: "no available yet",
      },

      car_info: {
        carname: `${make.trim()} ${model.trim()}`,
        brand: make.trim(),
        model: model.trim(),
        make: make.trim(),
        year: vehicleYear,
        color: color.trim(),
        car_plate: carPlate.trim(),
        insurance_policy_no: "",
      },
    });
  };

  return (
    <div className="flex w-full max-w-lg justify-center items-center my-auto py-6">
      <Card className="w-full border-zinc-200/80 bg-white shadow-xl shadow-zinc-200/50 rounded-2xl overflow-hidden">
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
              className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 overflow-hidden group shrink-0"
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

        {/* Toggle Buttons */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <Button
              type="button"
              onClick={() => {
                setIsUserInfoActive(true);
              }}
              className={
                isUserInfoActive
                  ? "flex-1 bg-zinc-900 text-white hover:bg-zinc-800 font-semibold text-xs h-9 rounded-lg shadow-xs transition-all"
                  : "flex-1 bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-semibold text-xs h-9 rounded-lg shadow-none transition-all"
              }
            >
              Driver Info
            </Button>

            <Button
              type="button"
              onClick={() => {
                setIsUserInfoActive(false);
              }}
              className={
                !isUserInfoActive
                  ? "flex-1 bg-zinc-900 text-white hover:bg-zinc-800 font-semibold text-xs h-9 rounded-lg shadow-xs transition-all"
                  : "flex-1 bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 font-semibold text-xs h-9 rounded-lg shadow-none transition-all"
              }
            >
              Car Info
            </Button>
          </div>
        </div>

        {/* Driver Info */}
        {isUserInfoActive && (
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
                License no.
              </Label>
              <Input
                placeholder="D1234-56789-01234"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
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
                type="number"
                placeholder="+1 000-000-0000"
                value={phoneNumber}
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
          </CardContent>
        )}

        {/* Car Info */}
        {!isUserInfoActive && (
          <CardContent className="flex flex-col gap-3.5 pt-3">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                License Plate
              </Label>
              <Input
                placeholder="ABCD 123"
                value={carPlate}
                onChange={(e) => setCarPlate(e.target.value)}
                className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Make
              </Label>
              <Input
                placeholder="Honda"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Model
              </Label>
              <Input
                placeholder="Accord"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Year
              </Label>
              <Input
                placeholder="2026"
                type="number"
                min={2010}
                max={2026}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Color
              </Label>
              <Input
                placeholder="Black"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
              />
            </div>
          </CardContent>
        )}

        <CardFooter className="pt-2 pb-6">
          <Button
            type="button"
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

export default DriverInfo;
