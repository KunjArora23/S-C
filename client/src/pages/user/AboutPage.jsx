import { Link } from 'react-router-dom';
import { PublicNavbar } from '../../components/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter';

const stats = [
  { value: '50,000+', label: 'Happy Travelers' },
  { value: '25+', label: 'Years Experience' },
  { value: '100+', label: 'Destinations' },
  { value: '2000+', label: 'Tours' },
];

const values = [
  {
    title: 'Passion for Travel',
    description:
      'We believe travel transforms lives and creates lasting memories. Our passion drives us to craft extraordinary experiences.',
  },
  {
    title: 'Trust & Safety',
    description:
      'Your safety and satisfaction are our top priorities. We maintain the highest standards in all our services.',
  },
  {
    title: 'Expert Team',
    description:
      'Our experienced travel experts and local guides ensure authentic and enriching travel experiences.',
  },
  {
    title: 'Sustainable Tourism',
    description:
      'We promote responsible travel that benefits local communities and preserves cultural heritage.',
  },
];

const team = [
  {
    name: 'Shyam Baba',
    role: 'First Founder',
    image: '../../../S&C images/shyam1.png',
    description:
      'The heart and soul behind S&C Tours, Shyam Baba began our journey over 35 years ago with a spirit of kindness and true Indian hospitality.',
  },
  {
    name: 'Raju Bhai',
    role: 'Second Founder',
    image: '../../../S&C images/raju1.jpeg',
    description:
      "Joining his elder brother Shyam Baba, Raju Bhai brought youthful energy and innovative thinking to transform their humble auto rickshaw service into a beloved family travel company. His dedication to creating authentic experiences and building lasting relationships with travelers has been instrumental in S&C Tours' success.",
  },
];

const journey = [
  {
    marker: '95',
    year: '1995',
    text: 'Shyam Baba laid the foundation pillars of S&C Tours, starting with his humble auto rickshaw service and genuine hospitality towards travelers.',
  },
  {
    marker: '10',
    year: '2010',
    text: "Founded Incredible Tours with a vision to showcase India's diversity.",
  },
  {
    marker: '13',
    year: '2013',
    text: 'Launched luxury heritage tours, partnering with palace hotels.',
  },
  {
    marker: '16',
    year: '2016',
    text: 'Expanded to adventure tourism with Himalayan trekking expeditions.',
  },
  {
    marker: '19',
    year: '2019',
    text: 'Received Best Tour Operator award from India Tourism Board.',
  },
  {
    marker: '21',
    year: '2021',
    text: 'Introduced sustainable tourism practices and eco-friendly tours.',
  },
  {
    marker: '24',
    year: '2024',
    text: 'Celebrating 50,000+ satisfied travelers and expanding globally.',
  },
  {
    marker: '25',
    year: '2025',
    text: 'The next generation steps forward to carry forward the legacy, bringing fresh perspectives while honoring the values of hospitality and authenticity established by Shyam Baba and Raju Bhai.',
  },
];

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-(--home-bg) text-(--home-text)">
      <div className="border-b border-(--home-border) bg-(--home-surface)">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-2 text-sm font-semibold text-(--home-primary) sm:justify-end sm:px-6 lg:px-8">
          <a href="tel:+918527921295" className="hover:text-(--home-primary-deep)">+91 8527921295</a>
          <a href="tel:+919818808842" className="hover:text-(--home-primary-deep)">+91 9818808842</a>
        </div>
      </div>

      <PublicNavbar />

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Link to="/" className="inline-block text-base font-semibold text-(--home-primary) hover:text-(--home-primary-deep)">
          ← Back
        </Link>

        <section className="mt-8 text-center">
        
          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">About Incredible Tours</h1>
          <p className="mx-auto mt-5 max-w-4xl text-lg leading-relaxed text-(--home-muted)">
            Incredible Tours is your trusted partner for exploring the wonders of India. With decades of experience, we craft unforgettable journeys tailored to your dreams.
          </p>
        </section>

        <section className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <article key={item.label} className="rounded-2xl border border-(--home-border) bg-(--home-surface) p-5 text-center">
              <p className="text-4xl font-bold text-(--home-text)">{item.value}</p>
              <p className="mt-2 text-sm font-semibold text-(--home-muted)">{item.label}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <article className="rounded-3xl border border-(--home-border) bg-(--home-surface) p-7 sm:p-8">
            <p className="text-4xl text-center font-semibold uppercase tracking-[0.18em] text-(--home-primary)">Our Story</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Born from a passion for travel and a deep love for India&apos;s incredible heritage</h2>

            <div className="mt-5 space-y-4 text-xl leading-relaxed text-(--home-muted)"> 
              <p className='font-bold'>Welcome to S&amp;C Tours, where every journey begins not with a booking, but with a blessing.</p>
              <p>
                Our story began over 35 years ago on the vibrant streets of Delhi. It wasn&apos;t built on technology or big offices. It was born from a simple act of kindness. Shyam Baba,
                the elder in our family, drove a modest auto rickshaw and often stopped to help foreign travelers who looked lost, overwhelmed, or simply curious about India.Though he didn’t speak fluent English, he understood the true language of hospitality — warmth, honesty, and respect.
              </p>
              <p>
                A few years later, his younger brother, Raju Bhai, joined him. Together, they did more than just show people around. They welcomed guests like family, shared home-cooked
                meals, and created bonds that crossed cultures and continents.
              </p>
              <p>
                As travelers kept returning, not for luxury, but for love, laughter, and loyalty, a deeper dream began to grow. The next generation of our family came together, determined
                to take this legacy forward. That&apos;s how S&amp;C Tours was born, a heartfelt family-run travel company offering soulful, safe, and personalized journeys across India.
              </p>
              <p>
                From the snowy peaks of the Himalayas to the backwaters of Kerala, from ancient temples to colorful festivals, we craft every trip with care. With over 20,000 happy guests
                from more than 40 countries, we&apos;re proud to say this isn&apos;t just travel. It&apos;s tradition.
              </p>
              <p>We don&apos;t treat you like tourists, we treat you like our own. Because with us, you don&apos;t just see India.</p>  
                  <p className='italic'> You feel it. You belong.</p>
            </div>
          </article>

          <div className="min-h-[360px] overflow-hidden rounded-3xl border border-(--home-border) bg-(--home-surface) lg:min-h-full flex justify-center items-center" >
            <img
              src="https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="S and C Tours story"
              className="h-4/8 w-full object-cover"
            />
          </div>
        </section>

        <section className="mt-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--home-primary)">Our Values</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">The principles that guide every experience we create</h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {values.map((item) => (
              <article key={item.title} className="rounded-2xl border border-(--home-border) bg-(--home-surface) p-6">
                <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-(--home-muted)">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--home-primary)">Meet Our Team</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">People behind S &amp; C Tours</h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {team.map((member) => (
              <article key={member.name} className="rounded-2xl border border-(--home-border) bg-(--home-surface) p-6">
                <img src={member.image} alt={member.name} className="h-64 w-full rounded-xl border border-(--home-border) object-cover" />
                <h3 className="mt-4 text-3xl font-semibold tracking-tight">{member.name}</h3>
                <p className="mt-1 text-base font-semibold text-(--home-primary)">{member.role}</p>
                <p className="mt-3 text-base leading-relaxed text-(--home-muted)">{member.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--home-primary)">Our Journey</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Milestones that shaped our legacy</h2>
          </div>

          <div className="mt-8 space-y-4">
            {journey.map((item) => (
              <article key={`${item.marker}-${item.year}`} className="rounded-2xl border border-(--home-border) bg-(--home-surface) p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--home-chip) font-bold text-(--home-accent-deep)">{item.marker}</span>
                  <p className="text-2xl font-semibold tracking-tight">{item.year}</p>
                </div>
                <p className="mt-3 text-base leading-relaxed text-(--home-muted)">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-(--home-border) bg-linear-to-r from-[#f7ead5] via-[#f3e7d8] to-[#ebf2f8] p-8 sm:p-10 text-center">
         
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            Ready to Start Your Journey? </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-(--home-muted)">
            Let us craft an unforgettable travel experience for you.Discover the incredible beauty and diversity of India with our expert team.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="rounded-lg bg-linear-to-r from-(--home-accent) to-(--home-accent-deep) px-5 py-2.5 text-base font-semibold text-white">
              Plan Your Trip
            </Link>
            <Link to="/contact" className="rounded-lg border border-(--home-border) bg-(--home-surface) px-5 py-2.5 text-base font-semibold text-(--home-text)">
              Contact Us
            </Link>
          </div>
        </section>

        <PublicFooter />
      </main>
    </div>
  );
};
