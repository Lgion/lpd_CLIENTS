"use client";

import { useContext, useMemo } from 'react';
import AuthContext from "../../stores/authContext.js";
import Donation from './_/Donation'
import BlogCategoryImport from '../_/Blog/BlogCategory.jsx';
import CarouselImport from "../_/Carousel"
import Features from "../_/fromWorkout/features";

const Carousel = CarouselImport as any;
const BlogCategory = BlogCategoryImport as any;

export default function Index() {
  const { data } = useContext(AuthContext) as any;
  if (!data) return null;
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