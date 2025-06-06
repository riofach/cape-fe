import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ExpensePreviewCard from './ExpensePreviewCard';

const HeroSection = () => {
	return (
		<section className="pt-20 pb-16 sm:pt-24 sm:pb-20 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto max-w-7xl">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-8">
						<div className="flex items-center space-x-3 mb-4">
							<img src="/cape2.png" alt="CAPE Logo" className="w-14" />
							<h2 className="text-2xl font-bold">CAPE</h2>
						</div>
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
							Track Expenses Effortlessly via WhatsApp or Web
						</h1>
						<p className="text-lg text-gray-600 max-w-2xl">
							CAPE makes expense tracking simple. Use WhatsApp or our web app to log expenses,
							categorize spending, and get insightful reports to manage your finances better.
						</p>
						<div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
							<Link to="/register">
								<Button className="bg-primary-gradient hover:opacity-90 py-6 px-8 text-base">
									Get Started for Free
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
					<ExpensePreviewCard />
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
