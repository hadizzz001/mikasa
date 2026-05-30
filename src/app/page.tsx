import Hero from "../components/Hero";
import Hero1 from "../components/Hero1";
import Hero2 from "../components/Hero2";
import CircleCategories from "../components/CircleCategories";
import PromoSlider from "../components/PromoSlider";
import DecorCategories from "../components/DecorCategories";
import NewArrivals from "../components/NewArrivals";
import KitchenSection from "../components/KitchenSection";
import StorageCollection from "../components/StorageCollection";
import CatGrid from "../components/CatGrid";
import BedBathSection from "../components/BedBathSection";
import Diverse from "../components/Diverse";
import Newsletter from "../components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <CircleCategories />
      <PromoSlider /> 
      <Hero1 />
      <Hero2 />
    </>
  );
}
