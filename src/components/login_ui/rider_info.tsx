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

function RiderInfo() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
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

              {/* Hover Overlay */}
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
            {/*<span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Photo
            </span>*/}

            {preview && (
              <>
                <Button>Upload</Button>
              </>
            )}
          </div>
        </div>

        <CardContent className="flex flex-col gap-3.5 pt-3">
          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Firstname
            </Label>
            <Input
              placeholder="John"
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Lastname
            </Label>
            <Input
              placeholder="Doe"
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
              className="border-zinc-300 bg-zinc-50/30 focus-visible:ring-zinc-900 focus-visible:bg-white rounded-lg h-10 text-zinc-900"
            />
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6">
          <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-11 rounded-xl font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2">
            Submit <ArrowRightCircleIcon className="w-5 h-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RiderInfo;
