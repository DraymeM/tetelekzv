import type { FC } from "react";
import Navbar from "./Navbar";
import TetelListCard from "./common/home/TetelListCard";

const HomePage: FC = () => {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="text-center mt-5 py-16">
        <h1 className="text-4xl font-bold text-gray-100">
          Tétel lista és Kidolgozott Tételek
        </h1>
        <p className="mt-4 text-lg text-gray-200">
          Az oldal az ELTE IK tételeit tartalmazza, kidolgozott válaszokkal és
          interaktív kérdésekkel.
        </p>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Fedezd fel a tartalmat
          </h2>

          {/* Corrected Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Tetel List */}
            <TetelListCard />

            {/* Right: 2 small cards stacked */}
            <div className="flex flex-col space-y-8">
              {/* Kidolgozott Tételek Card */}
              <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-gray-400 border-2 p-6 flex-1">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Kidolgozott Tételek
                </h3>
                <div className="h-0.5 bg-gray-400 w-full mb-4" />

                <p className="text-gray-400">
                  Itt találhatók a részletes válaszokkal és magyarázatokkal
                  rendelkező kidolgozott tételek, amelyek segítenek a vizsga
                  előkészítésében.
                </p>
              </div>

              {/* Tételekhez Kérdések Card */}
              <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-gray-400 border-2 p-6 flex-1">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Tételekhez Kérdések
                </h3>
                <div className="h-0.5 bg-gray-400 w-full mb-4" />

                <p className="text-gray-400">
                  Az interaktív kérdések segítségével tesztelheted tudásod a
                  tételek témaköreiben.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
