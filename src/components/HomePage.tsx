import React, { Suspense } from "react";
import Navbar from "./Navbar";
import { FaBookOpen, FaQuestionCircle } from "react-icons/fa";
import PageTransition from "../components/common/PageTransition";
import { Link } from "@tanstack/react-router";
import WarningCard from "./common/WarningCard";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
const TetelListCard = React.lazy(() => import("./common/home/TetelListCard"));

const HomePage: React.FC = () => {
  const isOnline = useOnlineStatus();
  return (
    <div>
      <Navbar />
      <PageTransition>
        <Suspense>
          {/* Hőszekció */}
          <section className="text-center mt-5 py-16">
            <h1 className="text-4xl font-bold text-foreground">
              Tétel lista és Kidolgozott Tételek
            </h1>
            <p className="mt-4 text-lg text-foreground">
              Az oldal az ELTE IK tételeit tartalmazza, kidolgozott válaszokkal
              és interaktív kérdésekkel.
            </p>
          </section>

          {/* Tartalomszekció */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-6">
              {!isOnline && (
                <WarningCard message="Offline módban vagy, ilyenkor csak a lementett tételeket tudod megnézni." />
              )}
              <h2 className="text-3xl font-semibold text-center mb-8">
                Fedezd fel a tartalmat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TetelListCard />

                <div className="flex flex-col space-y-8">
                  <Link to="/tetelek" className="cursor-pointer">
                    <div className="bg-secondary shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-border border-2 p-6 flex-1">
                      <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                        <FaBookOpen size={24} />
                        Kidolgozott Tételek
                      </h3>
                      <div className="h-0.5 bg-border w-full mb-4" />
                      <p className="text-foreground">
                        Itt találhatók a részletes válaszokkal és
                        magyarázatokkal rendelkező kidolgozott tételek, amelyek
                        segítenek a vizsga előkészítésében.
                      </p>
                    </div>
                  </Link>

                  <Link to="/mchoiceq" className="cursor-pointer">
                    <div className="bg-secondary shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-border border-2 p-6 flex-1">
                      <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                        <FaQuestionCircle size={24} />
                        Tételekhez Kérdések
                      </h3>
                      <div className="h-0.5 bg-border w-full mb-4" />
                      <p className="text-foreground">
                        Az interaktív kérdések segítségével tesztelheted tudásod
                        a tételek témaköreiben.
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
