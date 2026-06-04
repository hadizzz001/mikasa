import Hero from "../components/Hero";
import Hero1 from "../components/Hero1";
import Hero2 from "../components/Hero2";
import CircleCategories from "../components/CircleCategories";
import PromoSlider from "../components/PromoSlider";
 

export default function Home() {
  return (
    <div className="lg:max-w-7xl lg:mx-auto lg:px-6">
      <Hero />
      <CircleCategories />
      <PromoSlider /> 
      <Hero1 />
      <Hero2 />
    </div>
  );
}
