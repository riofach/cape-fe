
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-primary-gradient rounded-2xl py-12 px-6 sm:px-12 md:py-16 md:px-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start Tracking Your Expenses Today
          </h2>
          <p className="text-white/90 text-lg max-w-3xl mx-auto mb-8">
            Join thousands of users who have transformed their financial management with CAPE. 
            Sign up now for free and take control of your expenses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button className="bg-white text-primary hover:bg-gray-100 py-6 px-8 text-base">
                Create Free Account
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 py-6 px-8 text-base">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
