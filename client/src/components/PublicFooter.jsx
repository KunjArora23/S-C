import { Link } from 'react-router-dom';

export const PublicFooter = () => {
  return (
    <footer className="mt-14 rounded-3xl border border-(--home-border) bg-(--home-surface) p-8 sm:p-10">
      <div className="grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <h3 className="text-3xl font-semibold tracking-tight">S & C Tours</h3>
          <p className="mt-2 text-base font-medium text-(--home-primary)">Discover Amazing India</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-(--home-muted)">
            Experience the magic of India with our carefully curated tour packages. From the majestic Himalayas to serene backwaters, we bring you the best of Incredible India.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold">Quick Links</h4>
          <div className="mt-3 space-y-2 text-(--home-muted)">
            <Link to="/" className="block hover:text-(--home-primary)">Home</Link>
            <Link to="/tours" className="block hover:text-(--home-primary)">Tour</Link>
            <Link to="/about" className="block hover:text-(--home-primary)">About Us</Link>
            <Link to="/contact" className="block hover:text-(--home-primary)">Contact</Link>
            <Link to="/admin/login" className="block hover:text-(--home-primary)">Admin</Link>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold">Contact Info</h4>
          <div className="mt-3 space-y-2 text-(--home-muted)">
            <p>Shop No. 16, Municipal Market, Connaught Circle, Railway Colony, Connaught Place, New Delhi, Delhi 110001</p>
            <p>+91 8527921295</p>
            <p>salesiipt@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-(--home-border) pt-5 text-sm text-(--home-muted)">
        <p>© 2024 S & C Tours. All rights reserved.</p>
      </div>
    </footer>
  );
};
