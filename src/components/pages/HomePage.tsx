import React, { Suspense } from "react";
import { FaBookOpen, FaQuestionCircle } from "react-icons/fa";
import PageTransition from "../common/PageTransition";
import { Link } from "@tanstack/react-router";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import WarningCard from "../common/WarningCard";
const LogoIcon = React.lazy(() => import("../common/nav/LogoIcon"));
const TetelListCard = React.lazy(() => import("../common/home/TetelListCard"));
const DashboardOverview = React.lazy(
  () => import("../common/home/DashboardOverview")
);

const HomePage: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div>
      <PageTransition>
        <Suspense>
          {/* Hero Section */}
          <section className="text-center py-5">
            <div className="flex justify-center items-center">
              <LogoIcon className="w-18 h-18 text-primary" />
              <h1 className="text-5xl font-bold italic text-primary -translate-x-[17px] translate-y-[15px] tracking-tight skew-x-[2deg]">
                iomi
              </h1>
            </div>
            <p className="mt-4 text-lg text-foreground">
              Készíts, tanulj és ossz meg tananyagot, tételeket, kártyákat,
              kérdéseke, bárhol, bármikor.
            </p>
          </section>

          {/* Content Section */}
          <section className="py-6">
            <div className="max-w-7xl mx-auto px-6">
              {!isOnline && (
                <WarningCard message="Offline módban vagy, ilyenkor csak a lementett tételeket tudod megnézni." />
              )}

              <Suspense
                fallback={
                  <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full mb-6">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-secondary min-h-[170px] border border-transparent rounded-xl px-6 py-4 shadow-md animate-pulse"
                      />
                    ))}
                  </div>
                }
              >
                <DashboardOverview />
              </Suspense>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TetelListCard with reserved height */}
                <Suspense
                  fallback={
                    <div className="md:min-h-[150px] min-h-[215px] bg-secondary shadow-md rounded-lg animate-pulse" />
                  }
                >
                  <TetelListCard />
                </Suspense>

                <div className="flex flex-col space-y-6">
                  <Link to="/tetelek" className="cursor-pointer">
                    <div className="bg-secondary shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-border border-2 p-6 flex-1">
                      <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                        <FaBookOpen size={24} />
                        Tananyagok és Kártyacsomagok
                      </h3>
                      <div className="h-0.5 bg-border w-full mb-4" />
                      <p className="text-foreground">
                        Böngéssz vagy hozz létre tananyagokat: kidolgozott
                        tételek, jegyzetek, kártyák és egyéb oktatási
                        segédletek.
                      </p>
                    </div>
                  </Link>

                  <Link to="/mchoiceq" className="cursor-pointer">
                    <div className="bg-secondary shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-border border-2 p-6 flex-1">
                      <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                        <FaQuestionCircle size={24} />
                        Gyakorló Kérdések
                      </h3>
                      <div className="h-0.5 bg-border w-full mb-4" />
                      <p className="text-foreground">
                        Teszteld tudásod interaktív kérdésekkel és válaszokkal –
                        önállóan vagy csoportban.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Suspense>
      </PageTransition>
    </div>
  );
};

export default HomePage;
