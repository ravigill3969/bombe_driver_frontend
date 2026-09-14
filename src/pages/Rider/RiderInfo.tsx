import { useState } from "react";
import {
  BadgeCheck,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";

import NavDesktop from "@/components/nav/nav_desktop";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRiderInfoContext } from "@/context/RiderInfoContext";
import { useUpdateRiderPassword } from "@/API/rider/rider_apis";

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
        {label}
      </Label>
      <div className="flex h-10 items-center rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 text-sm text-zinc-800">
        {value === null || value === undefined || value === "" ? "—" : value}
      </div>
    </div>
  );
}

function RiderInfo() {
  const { riderInfo, isLoading } = useRiderInfoContext();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const { mutate } = useUpdateRiderPassword();

  const handleChangePassword = () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword.trim()) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(
        "New password must be different from your current password.",
      );
      return;
    }

    if (!confirmNewPassword.trim()) {
      setPasswordError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    mutate({
      confirm_new_password: confirmNewPassword,
      curr_password: currentPassword,
      new_password: newPassword,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const hasImage =
    !!riderInfo?.image_url && riderInfo.image_url !== "no available yet";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <NavDesktop NavFor="rider" isRiderVerified />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
        {/* Profile information */}
        <Card className="overflow-hidden rounded-2xl border-zinc-200/80 bg-white shadow-lg shadow-zinc-200/50">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
              {hasImage ? (
                <img
                  src={riderInfo?.image_url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="text-zinc-400" />
              )}
            </div>

            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900">
                {riderInfo
                  ? `${riderInfo.firstname} ${riderInfo.lastname}`
                  : "Rider profile"}
                {riderInfo?.isVerified && (
                  <BadgeCheck className="h-5 w-5 text-emerald-500" />
                )}
              </CardTitle>
              <CardDescription>
                {isLoading ? "Loading profile…" : "Your personal information"}
              </CardDescription>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="grid gap-3.5 pt-4 sm:grid-cols-2">
            <InfoField label="First name" value={riderInfo?.firstname} />
            <InfoField label="Last name" value={riderInfo?.lastname} />

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Email
              </Label>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 text-sm text-zinc-800">
                <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="truncate">{riderInfo?.email || "—"}</span>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Phone no.
              </Label>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 text-sm text-zinc-800">
                <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="truncate">
                  {riderInfo?.phone_number || "—"}
                </span>
              </div>
            </div>

            <InfoField label="Rider ID" value={riderInfo?.id} />

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Rating
              </Label>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 text-sm text-zinc-800">
                <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
                {riderInfo?.rating != null ? riderInfo.rating.toFixed(1) : "—"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change password */}
        <Card className="overflow-hidden rounded-2xl border-zinc-200/80 bg-white shadow-lg shadow-zinc-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900">
              <KeyRound className="h-5 w-5 text-zinc-500" />
              Change password
            </CardTitle>
            <CardDescription>
              Update the password used to sign in to your rider account.
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="flex flex-col gap-3.5 pt-4">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Current password
              </Label>
              <Input
                type="password"
                placeholder="**********"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-10 rounded-lg border-zinc-300 bg-zinc-50/30 text-zinc-900 focus-visible:bg-white focus-visible:ring-zinc-900"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                New password
              </Label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 rounded-lg border-zinc-300 bg-zinc-50/30 text-zinc-900 focus-visible:bg-white focus-visible:ring-zinc-900"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                Confirm new password
              </Label>
              <Input
                type="password"
                placeholder="Repeat your new password"
                autoComplete="new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="h-10 rounded-lg border-zinc-300 bg-zinc-50/30 text-zinc-900 focus-visible:bg-white focus-visible:ring-zinc-900"
              />
            </div>

            {passwordError && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {passwordSuccess}
              </p>
            )}
          </CardContent>

          <CardFooter className="pb-6 pt-2">
            <Button
              type="button"
              onClick={handleChangePassword}
              className="h-11 w-full cursor-pointer rounded-xl bg-zinc-900 font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.99] sm:w-auto sm:px-6"
            >
              Update password
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default RiderInfo;
