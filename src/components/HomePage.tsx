import { Suspense, type FC } from "react";
import Navbar from "./Navbar";
import TetelListCard from "./common/home/TetelListCard";
import { FaBookOpen, FaQuestionCircle } from "react-icons/fa"; // ✅ Added icons
import Spinner from "./Spinner";

const HomePage: FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="text-center mt-5 py-16">
          <h1 className="text-4xl font-bold text-foreground">
            Tétel lista és Kidolgozott Tételek
          </h1>
          <p className="mt-4 text-lg text-foreground">
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
                <div className="bg-secondary shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-border border-2 p-6 flex-1">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaBookOpen size={24} />
                    Kidolgozott Tételek
                  </h3>
                  <div className="h-0.5 bg-border w-full mb-4" />

                  <p className="text-foreground">
                    Itt találhatók a részletes válaszokkal és magyarázatokkal
                    rendelkező kidolgozott tételek, amelyek segítenek a vizsga
                    előkészítésében.
                  </p>
                </div>

                {/* Tételekhez Kérdések Card */}
                <div className="bg-secondary shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-border border-2 p-6 flex-1">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaQuestionCircle size={24} />
                    Tételekhez Kérdések
                  </h3>
                  <div className="h-0.5 bg-border w-full mb-4" />

                  <p className="text-foreground">
                    Az interaktív kérdések segítségével tesztelheted tudásod a
                    tételek témaköreiben.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  );
};

export default HomePage;
