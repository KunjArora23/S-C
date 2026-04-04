import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiCall } from '../../config/api';
import { PublicNavbar } from '../../components/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter';

export const TourDetailsPage = () => {
  const { cityId, tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTourDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiCall.get(`/tours/${tourId}`);
        setTour(response.tour || null);
      } catch (err) {
        setError(err.message || 'Failed to load tour details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDetails();
  }, [tourId]);

  return (
    <div className="min-h-screen bg-(--home-bg) text-(--home-text)">
      <PublicNavbar />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          to={cityId ? `/tours/${cityId}` : '/tours'}
          className="inline-block text-base font-semibold text-(--home-primary) hover:text-(--home-primary-deep)"
        >
          ← Back
        </Link>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
            <div className="h-72 animate-pulse rounded-2xl bg-[color-mix(in_srgb,var(--home-surface),white_8%)]" />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : !tour ? (
          <div className="mt-8 rounded-xl border border-(--home-border) bg-(--home-surface) p-6 text-(--home-muted)">
            Tour details not found.
          </div>
        ) : (
          <section className="mt-8 space-y-8">
            {tour.image ? (
              <img
                src={tour.image}
                alt={tour.title}
                className="h-80 w-full rounded-2xl border border-(--home-border) object-cover"
              />
            ) : null}

            <div className="rounded-2xl border border-(--home-border) bg-(--home-surface) p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-(--home-primary)">
                {/* {tour.city?.title || 'Tour'} */}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{tour.title}</h1>
              <p className="mt-4 text-lg text-(--home-muted)">Duration: {tour.duration}</p>

              <div className="mt-6">
                <h2 className="text-2xl font-semibold">Destinations</h2>
                <ul className="mt-3 list-disc space-y-1 pl-6 text-(--home-muted)">
                  {(tour.destinations || []).map((destination, index) => (
                    <li key={`${destination}-${index}`}>{destination}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold">Itinerary</h2>
                {!tour.itinerary || tour.itinerary.length === 0 ? (
                  <p className="mt-3 text-(--home-muted)">Detailed itinerary will be shared by our team.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {tour.itinerary.map((dayPlan, index) => (
                      <article
                        key={`${dayPlan.day}-${index}`}
                        className="rounded-xl border border-(--home-border) bg-[color-mix(in_srgb,var(--home-surface),black_2%)] p-4"
                      >
                        <p className="text-sm font-semibold uppercase tracking-wide text-(--home-primary)">{dayPlan.day}</p>
                        <h3 className="mt-1 text-xl font-semibold">{dayPlan.title}</h3>
                        <p className="mt-2 leading-relaxed text-(--home-muted)">{dayPlan.description}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <PublicFooter />
      </main>
    </div>
  );
};
