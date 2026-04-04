import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../config/api';
import { PublicNavbar } from '../../components/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter';
import { FloatingContactButton } from '../../components/FloatingContactButton';

const whyChooseItems = [
  {
    title: 'Award-Winning Service',
    description: 'Trusted by travelers for consistent quality, smooth planning, and memorable experiences.',
    icon: '🏆',
  },
  {
    title: 'Safe & Reliable Trips',
    description: 'From transport to stays, we prioritize safety and dependable operations at every step.',
    icon: '🛡️',
  },
  {
    title: '24/7 Assistance',
    description: 'Dedicated support team ready to help before, during, and after your journey.',
    icon: '📞',
  },
  {
    title: 'Local Expert Guides',
    description: 'Experienced guides who add stories, culture, and hidden gems to your itinerary.',
    icon: '🧭',
  },
];

const fallbackTestimonials = [
  {
    name: 'Rose Eid',
    text: 'Everything was well-arranged and stress-free. The team handled each detail with care.',
    place: 'Uttarakhand Circuit',
  },
  {
    name: 'Aarav Malhotra',
    text: 'Clear communication, comfortable stays, and great guides. Highly recommended for family trips.',
    place: 'Rajasthan Heritage',
  },
  {
    name: 'Maya Thomas',
    text: 'Professional service and thoughtful planning. The journey felt curated for us.',
    place: 'Kerala Discovery',
  },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReviewSlide, setCurrentReviewSlide] = useState(0);

  const handleTourClick = (tour) => {
    if (!tour?._id || !tour?.city?._id) return;
    navigate(`/tours/${tour.city._id}/${tour._id}`);
  };

  useEffect(() => {
    const fetchPublicTours = async () => {
      console.log('[HomePage] Fetching public tours for homepage skeleton');
      setIsLoading(true);
      setError('');

      try {
        const [toursResponse, reviewsResponse] = await Promise.all([
          apiCall.get('/tours'),
          apiCall.get('/reviews'),
        ]);
        const fetchedTours = toursResponse?.tours || [];
        const fetchedReviews = reviewsResponse?.reviews || [];
        console.log('[HomePage] Tours fetched successfully:', fetchedTours.length);
        setTours(fetchedTours);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error('[HomePage] Failed to fetch public tours:', err.message);
        setError('Unable to load live tours right now. Showing skeleton content.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicTours();
  }, []);



  const featuredTours = useMemo(() => {
    const source = tours.length > 0 ? tours : [];
    const featured = source.filter((tour) => tour?.featured);
    const selected = (featured.length > 0 ? featured : source).slice(0, 6);
    console.log('[HomePage] Featured tour cards prepared:', selected.length);
    return selected;
  }, [tours]);

  const testimonialCards = useMemo(() => {
    if (reviews.length === 0) return fallbackTestimonials;
    return reviews.slice(0, 3).map((review) => ({
      name: review.customerName,
      text: review.reviewText,
      place: review.location,
      rating: review.rating,
      image: review.image,
    }));
  }, [reviews]);

  useEffect(() => {
    if (featuredTours.length <= 1) return;

    console.log('[HomePage] Starting featured slideshow');
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredTours.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [featuredTours]);

  const currentFeaturedTour = featuredTours[currentSlide];
  const activeReview = testimonialCards[currentReviewSlide];

  useEffect(() => {
    if (testimonialCards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentReviewSlide((prev) => (prev + 1) % testimonialCards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonialCards]);

  useEffect(() => {
    if (currentReviewSlide >= testimonialCards.length) {
      setCurrentReviewSlide(0);
    }
  }, [testimonialCards.length, currentReviewSlide]);

  return (
    <div className="min-h-screen bg-[var(--home-bg)] text-[var(--home-text)]">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#f2dcb7]/70 blur-3xl"></div>
        <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-[#d8e8f4]/70 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#e8efe5]/60 blur-3xl"></div>
      </div>

      {/* Floating Contact Button */}
      <FloatingContactButton />

      <PublicNavbar />

      <main>
        {/* Hero */}
        <section id="home" className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pt-16">
          <div>
            
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[var(--home-text)] sm:text-5xl">
              Explore India With Elegance, Comfort, and Local Expertise
            </h1>
            {/* <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--home-muted)] sm:text-lg">
              A premium travel skeleton inspired by your current website structure. Built with a lighter, professional tone for your public-facing experience.
            </p> */}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button 
                onClick={() => navigate('/tours')}
                className="rounded-xl bg-linear-to-r from-[var(--home-accent)] to-[var(--home-accent-deep)] px-5 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95"
              >
                See Packages
              </button>
              {/* <button className="rounded-xl border border-[var(--home-border)] bg-[var(--home-surface)] px-5 py-3 text-sm font-semibold text-[var(--home-text)] hover:bg-[#f5efe5]">
                Browse Destinations
              </button> */}
            </div>

          </div>

          <div className="relative">
            <div 
              onClick={() => handleTourClick(currentFeaturedTour)}
              className="cursor-pointer overflow-hidden rounded-3xl border border-[var(--home-border)] bg-[var(--home-surface)] shadow-lg transition hover:shadow-xl"
            >
              {currentFeaturedTour?.image ? (
                <img
                  src={currentFeaturedTour.image}
                  alt={currentFeaturedTour.title}
                  className="h-85 w-full object-cover sm:h-107.5"
                />
              ) : (
                <div className="flex h-85 w-full items-center justify-center bg-linear-to-br from-[#f2e4cf] to-[#dce8f1] sm:h-107.5">
                  <p className="text-sm font-medium text-[var(--home-muted)]">Featured tour slideshow preview</p>
                </div>
              )}

              {featuredTours.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur">
                  {featuredTours.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        idx === currentSlide ? 'bg-white' : 'bg-white/45 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="absolute -bottom-5 left-5 rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)]/95 p-4 shadow-md backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-[var(--home-muted)]">Featured Tour</p>
              <p className="font-semibold text-[var(--home-text)]">
                {currentFeaturedTour?.title || 'Spiritual & Scenic Uttarakhand'}
              </p>
              <p className="text-sm text-[var(--home-muted)]">
                {currentFeaturedTour?.duration || '7 Days / 6 Nights'}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[var(--home-border)] bg-[var(--home-surface)] p-3 text-center">
              <p className="text-xl font-bold text-[var(--home-text)]">25K+</p>
              <p className="text-xs text-[var(--home-muted)]">Happy Travelers</p>
            </div>
            <div className="rounded-xl border border-[var(--home-border)] bg-[var(--home-surface)] p-3 text-center">
              <p className="text-xl font-bold text-[var(--home-text)]">50+</p>
              <p className="text-xs text-[var(--home-muted)]">Destinations</p>
            </div>
            <div className="rounded-xl border border-[var(--home-border)] bg-[var(--home-surface)] p-3 text-center">
              <p className="text-xl font-bold text-[var(--home-text)]">25+</p>
              <p className="text-xs text-[var(--home-muted)]">Years Experience</p>
            </div>
            <div className="rounded-xl border border-[var(--home-border)] bg-[var(--home-surface)] p-3 text-center">
              <p className="text-xl font-bold text-[var(--home-text)]">2000+</p>
              <p className="text-xs text-[var(--home-muted)]">Tour Packages</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--home-accent-deep)]">What Our Travelers Say</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--home-text)]">Real Stories, Real Journeys</h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[var(--home-border)] bg-[var(--home-surface)] shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 md:h-[360px]">
              <div className="relative h-[260px] md:h-full bg-linear-to-br from-[#efe4d2] to-[#dce8f1]">
                {activeReview?.image ? (
                  <img
                    src={activeReview.image}
                    alt={activeReview.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-7xl font-semibold text-[#7b6d58]">
                    {activeReview?.name?.charAt(0)?.toUpperCase() || 'R'}
                  </div>
                )}
              </div>

              <article className="flex h-full flex-col p-6 sm:p-8">
                <div className="min-h-0 flex-1 overflow-hidden">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[var(--home-primary)]">Customer Review</p>
                  <p className="mt-4 line-clamp-5 text-base leading-relaxed text-[var(--home-muted)]">
                    "{activeReview?.text || ''}"
                  </p>

                  <div className="mt-4 space-y-1">
                    <p className="text-lg font-semibold text-[var(--home-text)]">{activeReview?.name || 'Traveler'}</p>
                    <p className="text-sm text-[#d28e11]">{'★'.repeat(activeReview?.rating || 5)}</p>
                    <p className="text-sm text-[var(--home-muted)] line-clamp-1">
                      Destination visited: <span className="font-semibold text-[var(--home-text)]">{activeReview?.place || 'India Tour'}</span>
                    </p>
                  </div>
                </div>

                {testimonialCards.length > 1 && (
                  <div className="mt-4 flex shrink-0 items-center justify-between gap-3 border-t border-[var(--home-border)] pt-4">
                    {/* <button
                      type="button"
                      onClick={() =>
                        setCurrentReviewSlide((prev) =>
                          prev === 0 ? testimonialCards.length - 1 : prev - 1
                        )
                      }
                      className="rounded-lg border border-[var(--home-border)] px-3 py-2 text-sm font-medium text-[var(--home-text)] hover:bg-[#f5efe5]"
                    >
                      Prev
                    </button> */}

                    <div className="flex items-center gap-2">
                      {testimonialCards.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`Go to review ${idx + 1}`}
                          onClick={() => setCurrentReviewSlide(idx)}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            idx === currentReviewSlide ? 'bg-[var(--home-primary)]' : 'bg-[#d8cdbb] hover:bg-[#c7b8a0]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* <button
                      type="button"
                      onClick={() =>
                        setCurrentReviewSlide((prev) => (prev + 1) % testimonialCards.length)
                      }
                      className="rounded-lg border border-[var(--home-border)] px-3 py-2 text-sm font-medium text-[var(--home-text)] hover:bg-[#f5efe5]"
                    >
                      Next
                    </button> */}
                  </div>
                )}
              </article>
            </div>
          </div>
        </section>

        {/* Why choose */}
        <section id="about" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--home-accent-deep)]">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--home-text)]">Built For Comfortable, Reliable Travel</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] p-5 shadow-sm">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--home-text)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--home-muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Tours */}
        {/* <section id="tours" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--home-primary)]">Tour Packages</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--home-text)]">Ready-To-Book Experiences</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(featuredTours.length > 0 ? featuredTours : Array.from({ length: 6 })).map((tour, idx) => (
              <article key={tour?._id || idx} className="rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-[var(--home-chip)] px-2.5 py-1 text-xs font-semibold text-[var(--home-accent-deep)]">{tour?.duration || 'Flexible Duration'}</span>
                  {tour?.featured ? <span className="text-xs font-semibold text-[var(--home-primary)]">Featured</span> : null}
                </div>
                <h3 className="text-lg font-semibold text-[var(--home-text)]">{tour?.title || 'Signature Tour Package'}</h3>
                <p className="mt-1 text-sm text-[var(--home-muted)]">{tour?.city?.title || 'Multiple Destinations'} • Guided itinerary • Premium support</p>
                <button className="mt-4 rounded-lg border border-[var(--home-border)] bg-[#f3ede3] px-4 py-2 text-sm font-medium text-[var(--home-text)] hover:bg-[#ece2d3]">
                  View Details
                </button>
              </article>
            ))}
          </div>

          {isLoading && <p className="mt-4 text-sm text-[var(--home-muted)]">Loading tours...</p>}
        </section> */}

        {/* CTA */}
        <section id="contact" className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[var(--home-border)] bg-linear-to-r from-[#f7ead5] via-[#f3e7d8] to-[#ebf2f8] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--home-accent-deep)]">Ready For Your Next Adventure?</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--home-text)]">Let Our Team Craft Your Perfect Itinerary</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--home-muted)]">
              Tell us your travel style, budget, and preferred destinations. We will design a smooth, personalized plan tailored to your journey goals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-xl bg-linear-to-r from-[var(--home-accent)] to-[var(--home-accent-deep)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 cursor-pointer" onClick={()=>navigate("/contact")}>Plan My Trip</button>
              <button className="rounded-xl border border-[var(--home-border)] bg-[var(--home-surface)] px-5 py-3 text-sm font-semibold text-[var(--home-text)] hover:bg-[#f5efe5] cursor-pointer" onClick={()=>navigate("/tours")}>Browse Tours</button>
            </div>
          </div>
        </section>
      </main>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <PublicFooter />
      </div>
    </div>
  );
};
