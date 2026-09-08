import NavDesktop from "@/components/nav/nav_desktop";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function Home() {
  return (
    <>
      <NavDesktop NavFor="home" />
      <div>
        <Button>
          <Link to={"/driver"}>Driver</Link>
        </Button>
        <Button>
          <Link to={"/rider"}>Rider</Link>
        </Button>
      </div>
    </>
  );
}

export default Home;
