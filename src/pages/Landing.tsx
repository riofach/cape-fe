
import { ArrowRight, CheckCircle2, MessageSquareText, PieChart, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const Landing = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-24 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Track Expenses Effortlessly via WhatsApp or Web
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                CAPE makes expense tracking simple. Use WhatsApp or our web app to log
                expenses, categorize spending, and get insightful reports to manage your finances better.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button className="bg-primary-gradient hover:opacity-90 py-6 px-8 text-base">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" className="py-6 px-8 text-base">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="p-6 bg-primary-gradient text-white">
                  <h2 className="text-xl font-semibold mb-4">April 2025</h2>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white/80 text-sm">Total Expenses</p>
                      <p className="text-3xl font-bold">$1,458.65</p>
                    </div>
                    <PieChart className="h-16 w-16" />
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900">Recent Expenses</h3>
                    <div className="mt-3 space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Electronics</p>
                            <p className="text-xs text-gray-500">Apr 12, 2025</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">$249.99</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Groceries</p>
                            <p className="text-xs text-gray-500">Apr 10, 2025</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">$120.38</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Entertainment</p>
                            <p className="text-xs text-gray-500">Apr 8, 2025</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">$45.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-primary mb-5">
                <MessageSquareText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp Integration</h3>
              <p className="text-gray-600">
                Track expenses directly through WhatsApp. Just send a message with your expense details and CAPE handles the rest.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-5">
                <PieChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Insightful Reports</h3>
              <p className="text-gray-600">
                Get detailed monthly reports and visualizations to understand your spending patterns and save more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-5">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cross-Platform Access</h3>
              <p className="text-gray-600">
                Access your expense data anytime, anywhere through our responsive web app or WhatsApp on your phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
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
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-gradient text-white text-xl font-bold flex items-center justify-center mx-auto mb-5">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect WhatsApp</h3>
              <p className="text-gray-600">
                Link your WhatsApp account to CAPE with a simple setup process that takes less than a minute.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-gradient text-white text-xl font-bold flex items-center justify-center mx-auto mb-5">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Expenses</h3>
              <p className="text-gray-600">
                Log expenses by sending a message to CAPE via WhatsApp or using our web interface.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-gradient text-white text-xl font-bold flex items-center justify-center mx-auto mb-5">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Insights</h3>
              <p className="text-gray-600">
                Access detailed reports and visualizations to understand your spending habits and make better financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "CAPE has completely transformed how I track my expenses. The WhatsApp integration is brilliant - I can log expenses on the go without even opening an app!"
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src="https://randomuser.me/api/portraits/women/17.jpg" alt="User" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Marketing Professional</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The monthly reports have been eye-opening. I've identified several areas where I was overspending and managed to save almost 20% of my monthly expenses!"
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src="https://randomuser.me/api/portraits/men/43.jpg" alt="User" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">David Chen</p>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "As a small business owner, CAPE has been invaluable for tracking business expenses separately from personal spending. Simple, effective, and time-saving!"
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src="https://randomuser.me/api/portraits/women/63.jpg" alt="User" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Maria Rodriguez</p>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
    </MainLayout>
  );
};

export default Landing;
