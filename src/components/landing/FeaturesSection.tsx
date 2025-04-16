
import { MessageSquareText, PieChart, Smartphone } from "lucide-react";

const features = [
  {
    icon: <MessageSquareText className="h-6 w-6" />,
    title: "WhatsApp Integration",
    description: "Track expenses directly through WhatsApp. Just send a message with your expense details and CAPE handles the rest.",
    bgColor: "bg-green-100",
    textColor: "text-primary",
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "Insightful Reports",
    description: "Get detailed monthly reports and visualizations to understand your spending patterns and save more.",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Cross-Platform Access",
    description: "Access your expense data anytime, anywhere through our responsive web app or WhatsApp on your phone.",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Features Designed for Simplicity
          </h2>
          <p className="text-lg text-gray-600">
            CAPE makes expense tracking accessible and effortless with powerful features
            that work seamlessly across WhatsApp and web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center ${feature.textColor} mb-5`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
