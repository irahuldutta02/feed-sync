
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BarChart2, PieChart, MessageCircle, Users, Star, TrendingUp } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <Card className="hover:shadow-md transition-all bg-white dark:bg-card border-border">
    <CardHeader className="pb-2">
      <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-2">
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ quote, author, role, company }) => (
  <Card className="bg-white dark:bg-card border-border hover:shadow-md transition-all h-full flex flex-col">
    <CardContent className="pt-6 px-6 flex-1 flex flex-col">
      <div className="mb-4 text-brand-500">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H9.5C9.5 9.5 10 13 13 15.5V16c-1 1-2.5 1.5-4 1.5-4 0-5-3.5-5-5.5C4 10 5 7 9.59 4.59zM21 15.5V16c-1 1-2.5 1.5-4 1.5-4 0-5-3.5-5-5.5 0-2 1-5 5.59-7.41A2 2 0 1 1 19 8h-1.5c0 1.5.5 5 3.5 7.5z" fill="currentColor" />
        </svg>
      </div>
      <p className="text-foreground text-lg mb-4 flex-1">{quote}</p>
      <div>
        <p className="font-medium text-foreground">{author}</p>
        <p className="text-muted-foreground">{role}, {company}</p>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-brand-800 via-brand-600 to-brand-700 dark:from-brand-400 dark:via-brand-500 dark:to-brand-400">
                Collect. Analyze.<br />Improve.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                FeedSync helps you collect meaningful feedback from users, analyze trends, and make data-driven improvements to your products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                  onClick={() => navigate('/signup')}
                >
                  Get Started for Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-400 opacity-75 blur"></div>
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="FeedSync Dashboard" 
                    className="w-full h-auto rounded-xl" 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to collect and analyze feedback, all in one platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<MessageCircle size={24} />}
                title="Customizable Feedback Forms"
                description="Create beautiful, branded feedback forms that match your company's identity and encourage user engagement."
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<BarChart2 size={24} />}
                title="In-depth Analytics"
                description="Powerful analytics dashboard to track feedback trends, sentiment analysis, and user satisfaction over time."
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<PieChart size={24} />}
                title="Visual Reports"
                description="Generate visual reports to share with stakeholders and team members, with exportable data in multiple formats."
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<Users size={24} />}
                title="Team Collaboration"
                description="Invite team members to collaborate, assign tasks, and respond to feedback as a team."
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<Star size={24} />}
                title="Sentiment Analysis"
                description="AI-powered sentiment analysis to understand the emotions behind user feedback and prioritize improvements."
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<TrendingUp size={24} />}
                title="Trend Monitoring"
                description="Track feedback trends over time to identify recurring issues and measure the impact of your improvements."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join thousands of companies that use FeedSync to improve their products and services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <TestimonialCard
                quote="FeedSync has completely transformed how we collect and analyze customer feedback. We've been able to identify several key improvements that led to a 30% increase in customer satisfaction."
                author="Sarah Johnson"
                role="Product Manager"
                company="TechForward"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <TestimonialCard
                quote="The analytics dashboard in FeedSync is incredible. We can now see exactly what our users are thinking and feeling about our product in real-time, which has helped us make better decisions."
                author="Michael Chen"
                role="CEO"
                company="InnovateCo"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <TestimonialCard
                quote="Setting up feedback campaigns with FeedSync is so easy. We were up and running in minutes, and the insights we've gained have been invaluable for our product roadmap."
                author="Emily Rodriguez"
                role="UX Director"
                company="DesignMasters"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-brand-50 dark:bg-brand-950/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your feedback process?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                Join thousands of companies using FeedSync to collect meaningful feedback and make data-driven improvements.
              </p>
              <Button 
                size="lg" 
                className="bg-brand-600 hover:bg-brand-700 text-white"
                onClick={() => navigate('/signup')}
              >
                Get Started For Free
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. 14-day free trial.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
