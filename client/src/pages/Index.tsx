import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart2,
  Check,
  MessageCircle,
  PieChart,
  Rocket,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">
      {eyebrow}
    </span>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
      {title}
    </h2>
    <p className="text-lg text-muted-foreground">{description}</p>
  </motion.div>
);

const BentoCard = ({
  icon,
  title,
  description,
  className,
  delay = 0,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
  children?: ReactNode;
}) => (
  <motion.div
    {...fadeUp}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300",
      "hover:-translate-y-1 hover:border-brand-400/60 hover:shadow-xl hover:shadow-brand-500/10",
      className
    )}
  >
    <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {children}
    </div>
  </motion.div>
);

const Step = ({
  number,
  icon,
  title,
  description,
  delay,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    {...fadeUp}
    transition={{ duration: 0.5, delay }}
    className="relative rounded-2xl border border-border bg-card/60 backdrop-blur p-6"
  >
    <span className="absolute top-5 right-6 text-5xl font-black text-brand-500/10 select-none">
      {number}
    </span>
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  delay,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
  delay: number;
}) => (
  <motion.figure
    {...fadeUp}
    transition={{ duration: 0.5, delay }}
    className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-brand-500/10"
  >
    <div className="mb-4 flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={16} fill="currentColor" />
      ))}
    </div>
    <blockquote className="flex-1 text-foreground/90 mb-6">
      “{quote}”
    </blockquote>
    <figcaption className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
        {author
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </span>
      <span>
        <span className="block font-medium leading-tight">{author}</span>
        <span className="block text-sm text-muted-foreground">
          {role}, {company}
        </span>
      </span>
    </figcaption>
  </motion.figure>
);

const stats = [
  { value: "10k+", label: "Feedback collected" },
  { value: "2,500+", label: "Active campaigns" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "< 2 min", label: "To launch a campaign" },
];

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const primaryCta = () => navigate(isAuthenticated ? "/dashboard" : "/signup");

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 md:pt-36 pb-20 md:pb-28">
        {/* background glow + grid */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px] dark:bg-brand-600/25" />
          <div className="absolute right-[-10%] top-[30%] h-[320px] w-[320px] rounded-full bg-brand-300/20 blur-[100px] dark:bg-brand-400/10" />
          <div
            className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-10 xl:gap-16">
          <motion.div
            className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-1.5 text-sm font-medium text-brand-700 backdrop-blur dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
              <Sparkles size={14} />
              Feedback management, reimagined
            </span>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl xl:text-7xl">
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Collect. Analyze.
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 bg-clip-text text-transparent">
                Improve.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground md:text-xl lg:mx-0">
              FeedSync helps you collect meaningful feedback from users,
              analyze trends, and make data-driven improvements to your
              products.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="h-12 rounded-full bg-brand-600 px-8 text-base text-white shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/40"
                onClick={primaryCta}
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
                <ArrowRight className="ml-2" size={18} />
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full bg-background/60 px-8 text-base backdrop-blur"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
              )}
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Free to start", "No credit card", "Set up in minutes"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={14} className="text-brand-500" />
                    {t}
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Product mockup */}
          <motion.div
            className="relative mx-auto w-full max-w-2xl lg:max-w-none [perspective:1400px]"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            {/* pulsing glow */}
            <motion.div
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-brand-600/40 via-brand-400/30 to-brand-600/40 blur-2xl"
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.04, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* floating, tilting dashboard */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-brand-900/30 lg:[transform:rotateY(-8deg)_rotateX(3deg)]"
                whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              >
                <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  <span className="ml-4 hidden rounded-md bg-background/80 px-3 py-0.5 text-xs text-muted-foreground sm:block">
                    app.feedsync.io/dashboard
                  </span>
                </div>
                <img
                  src="/assets/dashboard.png"
                  alt="FeedSync Dashboard"
                  className="h-auto w-full"
                />
                {/* shimmer sweep */}
                <motion.div
                  className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ left: "-40%" }}
                  animate={{ left: "140%" }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* floating chips */}
            <motion.div
              className="absolute -left-4 top-1/4 hidden items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 shadow-xl backdrop-blur sm:flex lg:-left-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, 10, 0] }}
              transition={{
                opacity: { delay: 0.9 },
                scale: { delay: 0.9 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </span>
              <span className="text-xs font-semibold">4.9 rating</span>
            </motion.div>

            <motion.div
              className="absolute -bottom-5 right-2 hidden items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 shadow-xl backdrop-blur sm:flex lg:-right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: 1.1 },
                scale: { delay: 1.1 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
                <TrendingUp size={14} />
              </span>
              <span className="text-xs">
                <span className="block font-semibold leading-tight">
                  +32% satisfaction
                </span>
                <span className="block text-muted-foreground">this month</span>
              </span>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-brand-600 to-brand-400 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features (bento) */}
      <section id="features" className="py-20 md:py-28 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to hear your users"
            description="Everything you need to collect and analyze feedback, all in one platform."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <BentoCard
              className="md:col-span-2"
              icon={<MessageCircle size={22} />}
              title="Instant Feedback Collection"
              description="Quickly gather feedback from your users with easy-to-use forms and widgets."
            >
              <div className="mt-6 flex flex-wrap gap-2">
                {["Ratings", "Comments", "File uploads", "Anonymous mode"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </BentoCard>
            <BentoCard
              delay={0.1}
              icon={<BarChart2 size={22} />}
              title="Real-Time Analytics"
              description="Monitor feedback trends and metrics as they happen, enabling fast, data-driven decisions."
            />
            <BentoCard
              delay={0.1}
              icon={<PieChart size={22} />}
              title="Customizable Reports"
              description="Create and export detailed reports tailored to your team's needs."
            />
            <BentoCard
              delay={0.2}
              icon={<Users size={22} />}
              title="Team Collaboration"
              description="Invite your team, assign roles, and work together to address user feedback."
            />
            <BentoCard
              delay={0.2}
              icon={<Star size={22} />}
              title="Satisfaction Tracking"
              description="Track satisfaction scores and see how your changes impact user happiness."
            />
            <BentoCard
              className="md:col-span-3"
              delay={0.3}
              icon={<TrendingUp size={22} />}
              title="Growth Insights"
              description="Identify opportunities for growth and improvement based on real user data."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-muted/30 py-20 md:py-28 scroll-mt-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="From idea to insight in three steps"
            description="No complicated setup. Launch a campaign and start learning right away."
          />
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
            <Step
              number="01"
              delay={0}
              icon={<Rocket size={20} />}
              title="Create a campaign"
              description="Name it, describe what you want to learn, and you're ready to go."
            />
            <Step
              number="02"
              delay={0.1}
              icon={<Share2 size={20} />}
              title="Share the link"
              description="Send your feedback link to users anywhere — email, chat, or your site."
            />
            <Step
              number="03"
              delay={0.2}
              icon={<BarChart2 size={20} />}
              title="Analyze & act"
              description="Watch ratings and responses roll in, then prioritize what to improve."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by product teams"
            description="Join thousands of companies that use FeedSync to improve their products and services."
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <TestimonialCard
              delay={0}
              quote="FeedSync has completely transformed how we collect and analyze customer feedback. We've been able to identify several key improvements that led to a 30% increase in customer satisfaction."
              author="Sarah Johnson"
              role="Product Manager"
              company="TechForward"
            />
            <TestimonialCard
              delay={0.1}
              quote="The analytics dashboard in FeedSync is incredible. We can now see exactly what our users are thinking and feeling about our product in real-time, which has helped us make better decisions."
              author="Michael Chen"
              role="CEO"
              company="InnovateCo"
            />
            <TestimonialCard
              delay={0.2}
              quote="Setting up feedback campaigns with FeedSync is so easy. We were up and running in minutes, and the insights we've gained have been invaluable for our product roadmap."
              author="Emily Rodriguez"
              role="UX Director"
              company="DesignMasters"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-16 text-center shadow-2xl shadow-brand-700/30 md:py-20"
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-brand-300/20 blur-3xl" />
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to transform your feedback process?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-brand-100">
              Join thousands of companies using FeedSync to collect meaningful
              feedback and make data-driven improvements.
            </p>
            <Button
              size="lg"
              className="h-12 rounded-full bg-white px-8 text-base font-semibold text-brand-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-50"
              onClick={primaryCta}
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started For Free"}
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
