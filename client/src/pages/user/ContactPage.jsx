import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNames as getCountryNames } from 'country-list';
import PhoneInput from 'react-phone-number-input/input';
import { getCountries, getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input';
import { apiCall } from '../../config/api';
import { PublicNavbar } from '../../components/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter';

const inquiryTypes = ['Custom Package', 'General Inquiry', 'Tour Booking', 'Customer Support', 'Partnership'];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const hotelCategories = ['Budget', 'Standard (3*)', 'Deluxe (4*)', 'Luxury (5*)'];

const faqs = [
  {
    question: 'How far in advance should I book my tour?',
    answer:
      'We recommend booking at least 2-3 months in advance, especially for peak season (October to March) and popular destinations like the Golden Triangle.',
  },
  {
    question: 'Do you provide customized tour packages?',
    answer:
      'Yes! We specialize in creating personalized itineraries based on your interests, budget, and travel dates. Contact us to discuss your requirements.',
  },
  {
    question: 'What is included in your tour packages?',
    answer:
      'Our packages typically include accommodation, transportation, professional guides, entrance fees, and specified meals. Specific inclusions vary by package.',
  },
  {
    question: 'Is travel insurance included?',
    answer:
      'Travel insurance is not included but highly recommended. We can help you arrange comprehensive travel insurance for your trip.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'Cancellation policies vary by package and season. Generally, cancellations 30+ days before departure receive full refund minus processing fees.',
  },
];

export const ContactPage = () => {
  const [selectedCallingCountry, setSelectedCallingCountry] = useState('IN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const countryCodeOptions = useMemo(() => {
    return getCountries().map((code) => ({
      code,
      label: `+${getCountryCallingCode(code)} (${code})`,
    }));
  }, []);

  const countries = useMemo(() => getCountryNames().sort((a, b) => a.localeCompare(b)), []);

  const toggleDestination = (destination) => {
    setSelectedDestinations((prev) =>
      prev.includes(destination)
        ? prev.filter((item) => item !== destination)
        : [...prev, destination]
    );
  };

  const removeDestination = (destinationToRemove) => {
    setSelectedDestinations((prev) => prev.filter((destination) => destination !== destinationToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitMessage('');
    setSubmitError('');

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setSubmitError('Please enter a valid phone number.');
      return;
    }

    if (selectedDestinations.length === 0) {
      setSubmitError('Please select at least one destination.');
      return;
    }

    const formData = new FormData(formElement);

    const payload = {
      inquiryType: formData.get('inquiryType'),
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: phoneNumber,
      countryCode: `+${getCountryCallingCode(selectedCallingCountry)}`,
      country: formData.get('country'),
      adults: formData.get('adults'),
      children: formData.get('children') || '0',
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      destinations: selectedDestinations,
      hotelCategory: formData.get('hotelCategory'),
      interests: formData.get('interests') || '',
      specialRequests: formData.get('specialRequests') || '',
    };

    setIsSubmitting(true);
    try {
      const response = await apiCall.post('/contact', payload);
      setSubmitMessage(response.message || 'Enquiry submitted successfully.');
      formElement.reset();
      setSelectedCallingCountry('IN');
      setPhoneNumber('');
      setSelectedDestinations([]);
      setIsDestinationDropdownOpen(false);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--home-bg) text-(--home-text)">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="text-center">

          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-(--home-muted)">
            Our travel experts are ready to help you plan your dream trip. Reach out to us today!
          </p>
        </section>

        <div className="mt-6">
          <Link to="/" className="inline-block text-base font-semibold text-(--home-primary) hover:text-(--home-primary-deep)">
            ← Back
          </Link>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-3">
          <article className="rounded-3xl border border-(--home-border) bg-(--home-surface) p-6 sm:p-8 lg:col-span-2">
            <h2 className="text-3xl font-semibold tracking-tight">Send Us a Message</h2>
            <p className="mt-2 text-base text-(--home-muted)">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-sm font-semibold text-(--home-text)">Inquiry Type</label>
                <select name="inquiryType" className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)">
                  {inquiryTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-(--home-text)">Full Name *</label>
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-(--home-text)">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-(--home-text)">Country Code</label>
                  <select
                    value={selectedCallingCountry}
                    onChange={(event) => setSelectedCallingCountry(event.target.value)}
                    className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                  >
                    {countryCodeOptions.map((option) => (
                      <option key={option.code} value={option.code}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-(--home-text)">Phone Number *</label>
                  <PhoneInput
                    international
                    country={selectedCallingCountry}
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || '')}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                  />
                  {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                    <p className="mt-1 text-xs text-red-500">Please enter a valid phone number</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-(--home-text)">Country *</label>
                <select
                  name="country"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                >
                  <option value="" disabled>Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-(--home-text)">Number of Adults *</label>
                  <input
                    name="adults"
                    type="number"
                    min="1"
                    required
                    defaultValue="1"
                    className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-(--home-text)">Number of Children</label>
                  <input
                    name="children"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-(--home-text)">Start Date *</label>
                  <input
                    name="startDate"
                    type="date"
                    required
                    className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-(--home-text)">End Date *</label>
                  <input
                    name="endDate"
                    type="date"
                    required
                    className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-(--home-text)">Destinations (States/UTs in India) *</label>
                <button
                  type="button"
                  onClick={() => setIsDestinationDropdownOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-left text-base outline-none focus:border-(--home-primary)"
                >
                  <span className="truncate text-(--home-text)">
                    {selectedDestinations.length > 0 ? `${selectedDestinations.length} destination(s) selected` : 'Select destinations'}
                  </span>
                  <span className="text-(--home-muted)">{isDestinationDropdownOpen ? '▲' : '▼'}</span>
                </button>

                {isDestinationDropdownOpen && (
                  <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-(--home-border) bg-(--home-surface) p-3">
                    <div className="space-y-2">
                      {indianStates.map((state) => (
                        <label key={state} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 hover:bg-(--home-bg)">
                          <input
                            type="checkbox"
                            checked={selectedDestinations.includes(state)}
                            onChange={() => toggleDestination(state)}
                            className="h-4 w-4 rounded border-(--home-border)"
                          />
                          <span className="text-sm text-(--home-text)">{state}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDestinations.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedDestinations.map((destination) => (
                      <span
                        key={destination}
                        className="inline-flex items-center gap-2 rounded-full border border-(--home-border) bg-(--home-surface) px-3 py-1 text-sm text-(--home-text)"
                      >
                        {destination}
                        <button
                          type="button"
                          onClick={() => removeDestination(destination)}
                          className="text-(--home-muted) hover:text-(--home-primary)"
                          aria-label={`Remove ${destination}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-(--home-muted)">Please select at least one destination.</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-(--home-text)">Hotel Category *</label>
                <select
                  name="hotelCategory"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                >
                  <option value="" disabled>Select</option>
                  {hotelCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-(--home-text)">Interests</label>
                <input
                  name="interests"
                  type="text"
                  placeholder="e.g. Culture, Wildlife, Adventure"
                  className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-(--home-text)">Special Requests</label>
                <textarea
                  name="specialRequests"
                  rows={4}
                  placeholder="Let us know any special requirements or requests..."
                  className="w-full rounded-xl border border-(--home-border) bg-(--home-bg) px-4 py-3 text-base outline-none focus:border-(--home-primary)"
                />
              </div>

              {submitError && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{submitError}</p>
              )}

              {submitMessage && (
                <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">{submitMessage}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-linear-to-r from-(--home-primary) to-(--home-primary-deep) px-5 py-3 text-base font-semibold text-white disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'Send Custom Package Request'}
              </button>
            </form>
          </article>

          <aside className="space-y-6">
            <article className="rounded-3xl border border-(--home-border) bg-(--home-surface) p-6">
              <h3 className="text-2xl font-semibold tracking-tight">Our Offices</h3>
              <div className="mt-4 space-y-2 text-(--home-muted)">
                <p className="text-lg font-semibold text-(--home-text)">New Delhi</p>
                <p>Shop No. 16, Municipal Market, Connaught Circle, Railway Colony, Connaught Place, New Delhi, Delhi 110001</p>
                <p>+91 85279 21295</p>
                <p>rpiipt@gmail.com</p>
              </div>
            </article>

            <article className="overflow-hidden rounded-3xl border border-(--home-border) bg-(--home-surface)">
              <iframe
                title="S and C Tours Location"
                src="https://www.google.com/maps?hl=en&gl=IN&mapclient=embed&cid=1065903897195576057&ll=28.635704,77.220549&z=15&t=m&output=embed"
                className="h-72 w-full"
                loading="lazy"
              />
            </article>
          </aside>
        </section>

        <section className="mt-12 rounded-3xl border border-(--home-border) bg-(--home-surface) p-6 sm:p-8">
          <h2 className="text-4xl font-semibold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-2 text-base text-(--home-muted)">Find answers to common questions about our tours and services.</p>

          <div className="mt-6 space-y-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-2xl border border-(--home-border) bg-(--home-bg) p-5">
                <h3 className="text-xl font-semibold tracking-tight">{item.question}</h3>
                <p className="mt-2 text-base leading-relaxed text-(--home-muted)">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-(--home-border) bg-linear-to-r from-[#f7ead5] via-[#f3e7d8] to-[#ebf2f8] p-8 text-center sm:p-10">
          <h2 className="text-4xl font-semibold tracking-tight">Ready to Plan Your Adventure?</h2>
          <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-(--home-muted)">
            Our travel experts are standing by to help you create the perfect Indian adventure. Contact us today to get started.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="tel:+918527921295" className="rounded-lg border border-(--home-border) bg-(--home-surface) px-5 py-2.5 text-base font-semibold text-(--home-text)">
              Call Us
            </a>
            <a
              href="https://wa.me/918527921295"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-linear-to-r from-(--home-accent) to-(--home-accent-deep) px-5 py-2.5 text-base font-semibold text-white"
            >
              WhatsApp
            </a>
          </div>
        </section>

      </main>
      <PublicFooter />
    </div>
  );
};
