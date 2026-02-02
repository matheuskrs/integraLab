import { Outlet } from "react-router-dom";
import { RouterNavigationLoading } from "~/components/RouterNavigationLoading/RouterNavigationLoading";

export default function RootLayout() {
  return (
    <>
      <RouterNavigationLoading />
      <Outlet />
    </>
  );
}
