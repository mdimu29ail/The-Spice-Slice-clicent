import React from 'react';
import MainSection from '../MainSection/MainSection';
import Banner from '../Banner/Banner';
import Goals from '../Goals/Goals';
import MapComponent from '../MapComponent/MapComponent';
import MenuSection from '../MenuSection/MenuSection';
import ChefsSection from '../ChefsSection/ChefsSection';
const foodsPromise = fetch(
  'https://my-assignment-11-server-lac.vercel.app/foods'
).then(res => res.json());
const Home = () => {
  return (
    <div>
      <Banner></Banner>

      {/* Main Section */}
      <div className="w-11/12 mx-auto">
        <MainSection foodsPromise={foodsPromise}></MainSection>

        <Goals></Goals>

        <MenuSection></MenuSection>

        <ChefsSection></ChefsSection>

        <MapComponent></MapComponent>
      </div>
    </div>
  );
};

export default Home;
