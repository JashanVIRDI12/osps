import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { TrustMarquee } from '@/components/sections/TrustMarquee';
import { AboutBlock } from '@/components/sections/AboutBlock';
import { VisionMission } from '@/components/sections/VisionMission';
import { ProblemSolution } from '@/components/sections/ProblemSolution';
import { WhyDifferent } from '@/components/sections/WhyDifferent';
import { Clients } from '@/components/sections/Clients';
import { BrandPartners } from '@/components/sections/BrandPartners';
import { CoreStrengths } from '@/components/sections/CoreStrengths';
import { Capabilities } from '@/components/sections/Capabilities';
import { Catalogue } from '@/components/sections/Catalogue';
import { PriceList } from '@/components/sections/PriceList';
import { Strengths } from '@/components/sections/Strengths';
import { ProcessRail } from '@/components/sections/ProcessRail';
import { MetricsBand } from '@/components/sections/MetricsBand';
import { ExportGlobe } from '@/components/sections/ExportGlobe';
import { IndustriesValues } from '@/components/sections/IndustriesValues';
import { ClosingChecklist } from '@/components/sections/ClosingChecklist';
import { ContactBlock } from '@/components/sections/ContactBlock';

/**
 * Section order is a light/royal rhythm. The page lives on the light canvas and
 * cuts to royal blue for the hero and its marquee, the metrics block, and the
 * closing contact panel plus footer — so the inversions bookend the page and
 * none of them loses its snap.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustMarquee />
        <AboutBlock />
        <VisionMission />
        <ProblemSolution />
        <WhyDifferent />
        <Capabilities />
        <Catalogue />
        <PriceList />
        <CoreStrengths />
        <Strengths />
        <ProcessRail />
        <Clients />
        <BrandPartners />
        <MetricsBand />
        <ExportGlobe />
        <IndustriesValues />
        <ClosingChecklist />
        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}
