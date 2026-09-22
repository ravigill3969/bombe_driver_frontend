import { Car, Wallet } from "lucide-react";

import NavDesktop from "@/components/nav/nav_desktop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDriversTodayEarnings } from "@/API/trip/trip_apis";

function TodayIncome() {
  const { data } = useGetDriversTodayEarnings();

  if (!data || !data.isSuccess) {
    return <div>Error while loading driver trip info</div>;
  }

  const totalTripsToday = data.data ? data.data.total_trips_today : 0;
  const totalEarningsToday = data.data ? data.data.total_earning_today : 0;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <NavDesktop NavFor="driver" isDriverVerified={true} />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Today's income
          </h1>
          <p className="text-sm text-zinc-500">
            Trips completed and earnings for today.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-lg shadow-zinc-200/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Total trips
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <Car className="h-5 w-5 text-zinc-700" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-zinc-900">
                {totalTripsToday}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200/80 bg-white shadow-lg shadow-zinc-200/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Total earnings
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <Wallet className="h-5 w-5 text-zinc-700" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-zinc-900">
                ${totalEarningsToday}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TodayIncome;
