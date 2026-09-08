import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as H } from "react-hot-toast";

import RouterMain from "./Router/Router_Main";
import { Toaster } from "./components/ui/toast";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterMain />
        <H toastOptions={{ removeDelay: 3 }} />
        <Toaster />
      </QueryClientProvider>
    </>
  );
}

export default App;
