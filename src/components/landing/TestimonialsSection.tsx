
interface Testimonial {
  rating: number;
  content: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
}

const testimonials: Testimonial[] = [
  {
    rating: 5,
    content: "CAPE has completely transformed how I track my expenses. The WhatsApp integration is brilliant - I can log expenses on the go without even opening an app!",
    author: {
      name: "Sarah Johnson",
      role: "Marketing Professional",
      image: "https://randomuser.me/api/portraits/women/17.jpg",
    },
  },
  {
    rating: 5,
    content: "The monthly reports have been eye-opening. I've identified several areas where I was overspending and managed to save almost 20% of my monthly expenses!",
    author: {
      name: "David Chen",
      role: "Software Engineer",
      image: "https://randomuser.me/api/portraits/men/43.jpg",
    },
  },
  {
    rating: 5,
    content: "As a small business owner, CAPE has been invaluable for tracking business expenses separately from personal spending. Simple, effective, and time-saving!",
    author: {
      name: "Maria Rodriguez",
      role: "Business Owner",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
    },
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of users who've simplified their expense tracking with CAPE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={testimonial.author.image} alt={testimonial.author.name} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{testimonial.author.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
