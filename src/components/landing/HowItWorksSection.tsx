
const steps = [
  {
    number: 1,
    title: "Connect WhatsApp",
    description: "Link your WhatsApp account to CAPE with a simple setup process that takes less than a minute.",
  },
  {
    number: 2,
    title: "Track Expenses",
    description: "Log expenses by sending a message to CAPE via WhatsApp or using our web interface.",
  },
  {
    number: 3,
    title: "Get Insights",
    description: "Access detailed reports and visualizations to understand your spending habits and make better financial decisions.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How CAPE Works
          </h2>
          <p className="text-lg text-gray-600">
            Three simple steps to take control of your expenses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-gradient text-white text-xl font-bold flex items-center justify-center mx-auto mb-5">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
