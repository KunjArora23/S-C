import { useState } from 'react';

export const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      action: () =>
        window.open(
          'https://api.whatsapp.com/send/?phone=918527921295&text&type=phone_number&app_absent=0',
          '_blank'
        ),
    },
    {
      id: 'maps',
      label: 'Maps',
      color: 'bg-red-500 hover:bg-red-600',
      action: () =>
        window.open(
          'https://www.google.com/maps/place/S+%26+C+Tours+and+Travels/@28.6357043,77.2205492,17z/data=!3m1!4b1!4m6!3m5!1s0x390cfdb7ba097727:0xecad9f2750bfaf9!8m2!3d28.6357043!4d77.2205492!16s%2Fg%2F11vzrz_l4q?entry=tts&g_ep=EgoyMDI1MDcwOS4wIPu8ASoASAFQAw%3D%3D&skid=1ac4ae14-f82d-4a19-8bb2-056a9aba1b2f',
          '_blank'
        ),
    },
    {
      id: 'facebook',
      label: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => window.open('https://www.facebook.com/sandctours/', '_blank'),
    },
    {
      id: 'phone',
      label: 'Call',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => window.location.href = 'tel:+918527921295',
    },
  ];

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {/* Floating Contact Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-32 items-center justify-center rounded-full bg-[var(--home-accent)] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        aria-label="Open contact menu"
      >
        {isOpen ? 'Close' : 'Contact Us'}
      </button>

      {/* Contact Options */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 flex flex-col gap-4">
          {contactOptions.map((option, index) => (
            <div
              key={option.id}
              className={`animate-stair-${index}`}
              style={{
                animation: `slideUp 0.4s ease-out ${index * 0.1}s both`,
              }}
            >
              <button
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                className={`inline-flex w-32 items-center justify-center rounded-full ${option.color} px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105`}
              >
                {option.label}
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
