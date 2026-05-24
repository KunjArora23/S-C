import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../config/api';
import { PublicNavbar } from '../../components/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter';

export const PublicToursPage = () => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiCall.get('/cities');
        setCities(response.cities || []);
        console.log('Fetched cities:', response.cities);
      } catch (err) {
        setError(err.message || 'Failed to load cities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
    
  }, []);

  const citiesWithTours = useMemo(
    () => cities.filter((city) => Number(city.toursCount || 0) > 0),
    [cities]
  );

  const formatDescription = (description = '') => {
    const trimmed = description.trim();
    if (trimmed.length <= 300) return trimmed;
    return `${trimmed.slice(0, 300)}...`;
  };


  return (
    <div className="min-h-screen bg-(--home-bg) text-(--home-text)">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">Explore Cities</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-(--home-muted)">
          Discover destinations and check how many tours are available in each city.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-(--home-border) bg-(--home-surface)"
              >
                <div className="h-48 animate-pulse bg-[color-mix(in_srgb,var(--home-surface),white_6%)]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
                </div>
              </div>
            ))}
          </div>
        ) : citiesWithTours.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-(--home-border) bg-(--home-surface) p-6 text-(--home-muted)">
            No cities with tours are available right now.
          </div>
        ) : (
          <section className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {citiesWithTours.map((city) => (
              <article
                key={city._id}
                className="group overflow-hidden rounded-2xl border border-(--home-border) bg-(--home-surface) transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {city.toursCount} Tours
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h2 className="text-3xl font-semibold tracking-tight">{city.title}</h2>
                  <p className="mx-auto mt-3 max-w-[34ch] text-base leading-relaxed text-(--home-muted)">
                    {formatDescription(city.description)}
                  </p>
                  <Link
                    to={`/tours/${city._id}`}
                    className="mt-5 inline-flex rounded-lg bg-linear-to-r from-(--home-primary) to-(--home-primary-deep) px-5 py-2.5 text-base font-semibold text-white"
                  >
                    View Tours
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        <Link to="/" className="mt-8 inline-block text-base font-semibold text-(--home-primary) hover:text-(--home-primary-deep)">
          ← Back to Home
        </Link>

        <PublicFooter />
      </main>
    </div>
  );
};
