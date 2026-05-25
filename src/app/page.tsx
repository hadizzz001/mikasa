import Hero from "../components/Hero";
import CircleCategories from "../components/CircleCategories";
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
      <DecorCategories />
      <NewArrivals />
      <KitchenSection />
      <StorageCollection />
      <CatGrid /> 
    </>
  );
}
