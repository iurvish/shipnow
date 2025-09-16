import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { HeroHeader } from "@/components/home/header";
import HeroSection from "@/components/home/hero";

export default function Home() {
  return <HeroSection />;
}
