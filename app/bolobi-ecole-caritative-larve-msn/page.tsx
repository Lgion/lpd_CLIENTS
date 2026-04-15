"use client";

import { useContext, useMemo } from 'react';
import AuthContext from "../../stores/authContext.js";
import Donation from './_/Donation'
import BlogCategory from '../_/Blog/BlogCategory.jsx';
import Carousel from "../_/Carousel"
import Features from "../_/fromWorkout/features";

export default function Index() {
  const { data } = useContext(AuthContext);
  const { diapos, categoryPosts } = data;

  const headings = useMemo(() => ({
    h3: "CATÉGORIE: \"ÉCOLE SAINT MARTIN DE PORÈZ\""
  }), []);

  return (
    <main className="bolobi">
      <Donation />
      <hr />
      <Features />
      <Carousel
        page="ecole"
        diapos={diapos}
        icon="2"
        titre={"L'ÉCOLE SAINT MARTIN DE PORÈZ EN IMAGES"}
      />
      <BlogCategory
        {...{ categoryPosts, headings, filterCategory: "ecole" }}
      />
    </main>
  );
}