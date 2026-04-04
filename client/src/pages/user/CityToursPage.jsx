import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiCall } from '../../config/api';
import { PublicNavbar } from '../../components/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter';

export const CityToursPage = () => {
  const { cityId } = useParams();
  const [city, setCity] = useState(null);
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCityTours = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiCall.get(`/cities/${cityId}`);
        setCity(response.city || null);
        setTours(response.tours || []);
      } catch (err) {
        setError(err.message || 'Failed to load city tours');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityTours();
  }, [cityId]);

  return (
    <div className="min-h-screen bg-(--home-bg) text-(--home-text)">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          to="/tours"
          className="inline-block text-base font-semibold text-(--home-primary) hover:text-(--home-primary-deep)"
        >
          ← Back to Cities
        </Link>

        {isLoading ? (
          <div className="mt-8">
            <div className="h-8 w-64 animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-(--home-border) bg-(--home-surface)">
                  <div className="h-44 animate-pulse bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
                  <div className="space-y-3 p-4">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-8 text-center">
              {/* <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--home-primary)">City Tours</p> */}
              <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">Welcome to {city?.title || 'Tours'}</h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-(--home-muted)">{city?.description}</p>
            </div>

            {tours.length === 0 ? (
              <div className="mt-8 rounded-xl border border-(--home-border) bg-(--home-surface) p-6 text-(--home-muted)">
                No tours found in this city.
              </div>
            ) : (
              <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => (
                  <article
                    key={tour._id}
                    className="overflow-hidden rounded-2xl border border-(--home-border) bg-(--home-surface)"
                  >
                    {tour.image ? (
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-44 w-full bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
                    )}

                    <div className="p-5 text-left">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-2xl font-semibold leading-snug">{tour.title}</h2>
                        {tour.featured && (
                          <span className="rounded-full bg-(--home-chip) px-2.5 py-1 text-xs font-semibold text-(--home-accent-deep)">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-base text-(--home-muted)">Duration: {tour.duration}</p>
                      <p className="mt-3 max-w-[34ch] text-base leading-relaxed text-(--home-muted)">
                        Destinations: {(tour.destinations || []).slice(0, 4).join(' • ')}
                      </p>

                      <Link
                        to={`/tours/${cityId}/${tour._id}`}
                        className="mt-5 inline-flex rounded-lg bg-linear-to-r from-(--home-primary) to-(--home-primary-deep) px-4 py-2 text-sm font-semibold text-white"
                      >
                        View Full Information
                      </Link>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </>
        )}

        <PublicFooter />
      </main>
    </div>
  );
};
